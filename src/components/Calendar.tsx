import {
    type ComponentType,
    type FormEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import axios from "axios";
import {
    Portal as DialogPortal,
    Overlay as DialogOverlay,
    Content as DialogPrimitiveContent,
    Close as DialogClose,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    AlertTriangleIcon,
    BanIcon,
    BriefcaseBusinessIcon,
    CalendarDaysIcon,
    CheckCircle2Icon,
    CheckIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CircleDashedIcon,
    CircleDotIcon,
    Clock3Icon,
    FolderOpenIcon,
    Layers3Icon,
    LoaderCircleIcon,
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    RotateCcwIcon,
    StarIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { toast } from "sonner";
import type { Task } from "@/Types/task";
import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/Types/project";
import type { ProjectWorkspaceContext } from "@/Types/projectWorkspaceContext";
import { Button } from "@/components/ui/button";
import { Calendar28 } from "@/components/DatePicker";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CalendarView = "month" | "week";
type CalendarScope = "all" | "mine" | "work";
type CalendarEventType =
    "project-start" | "project-due" | "task" | "plan-block";
type CalendarRelationship = "owner" | "allocat" | "planning";
type FocusAction = "add" | "remove";
type CalendarTaskStatus = "pending" | "active" | "complete" | "overdue";
type CalendarEvent = {
    id: string;
    type: Exclude<CalendarEventType, "plan-block">;
    projectId: string;
    taskId?: string | null;
    projectTitle: string;
    projectCode?: string | null;
    projectStatus?: string | null;
    title: string;
    description?: string | null;
    start: string;
    end?: string | null;
    allDay: boolean;
    status: string;
    relationship: Exclude<CalendarRelationship, "planning">;
};
type CalendarPlanningBlock = {
    id: string;
    projectId?: string | null;
    taskId?: string | null;
    projectTitle?: string | null;
    title: string;
    notes?: string | null;
    startAt: string;
    endAt: string;
};
type CalendarFocusTask = {
    taskId: string;
    projectId: string;
    projectTitle: string;
    projectStatus?: string | null;
    title: string;
    status: string;
    dueDate?: string | null;
};
type CalendarItem = {
    id: string;
    source: "event" | "planning";
    sourceId: string;
    type: CalendarEventType;
    projectId?: string | null;
    taskId?: string | null;
    projectTitle: string;
    projectCode?: string | null;
    projectStatus?: string | null;
    title: string;
    description?: string | null;
    notes?: string | null;
    start: string;
    end?: string | null;
    allDay: boolean;
    status: string;
    relationship: CalendarRelationship;
};
type CalendarRange = { start: Date; end: Date };
type CalendarDay = { date: Date; inCurrentMonth: boolean; isToday: boolean };
type PlanningInsights = {
    plannedHours: number;
    capacityHours: number;
    workloadLabel: "Light" | "Balanced" | "Busy" | "Overloaded";
    deadlineCount: number;
    alerts: string[];
};
type PlanningBlockPayload = {
    projectId: string | null;
    taskId: string | null;
    title: string;
    notes: string | null;
    startAt: string;
    endAt: string;
};
type CalendarItemAppearance = { surface: string; meta: string };

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_START_HOUR = 6;
const WEEK_END_HOUR = 23;
const WEEK_HOURS = Array.from(
    { length: WEEK_END_HOUR - WEEK_START_HOUR },
    (_, index) => index + WEEK_START_HOUR,
);
const HOUR_HEIGHT = 64;
const WEEKLY_CAPACITY_HOURS = 40;

const controlFocus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 motion-reduce:transition-none";
const calendarIconSurface =
    "bg-surface-2/60 text-muted-foreground dark:bg-surface-3/40";
const primaryActionButton =
    "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight/90 hover:text-primary-foreground dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90 dark:hover:text-secondary-foreground";
const secondaryActionButton =
    "border-border/35 bg-card text-foreground/80 hover:border-border/45 hover:bg-surface-2/50 hover:text-foreground dark:border-border/35 dark:bg-surface-2/40 dark:hover:bg-surface-2/60";
const ghostActionButton =
    "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground dark:hover:bg-surface-3/40";
const calendarShell = "border-border/35 bg-card";
const softPanelSurface = "border-border/35 bg-card";
const insetPanelSurface = "bg-surface-2/45 dark:bg-surface-2/35";
const formControlSurface =
    "border border-border/35 bg-surface-2/35 text-foreground outline-none shadow-none transition-[background-color,border-color,box-shadow] duration-150 hover:border-border/45 focus:border-ring/35 focus:bg-card focus:ring-2 focus:ring-ring/10 dark:bg-surface-2/40 dark:focus:bg-surface-2 motion-reduce:transition-none";
// Normalize only the shared picker's field wrapper; keep its calendar behavior intact.
const calendarDateField =
    "m-0 min-w-0 border-0 p-0 [&>div]:!grid [&>div]:!w-full [&>div]:!gap-1.5 [&>div>*]:!my-0 [&_label]:!m-0 [&_label]:!px-0 [&_label]:!text-xs [&_label]:!font-medium [&_label]:!leading-5 [&_label]:!text-foreground/80";
const calendarFieldLabel =
    "block text-xs font-medium leading-5 text-foreground/80";

export default function Calendar() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const permissionAccount = user?.userId ?? "";
    const permissionAccountRef = useRef(permissionAccount);
    permissionAccountRef.current = permissionAccount;
    const taskPermissionCache = useRef(
        new Map<string, { allowed: boolean; expiresAt: number }>(),
    );
    const taskPermissionReads = useRef(new Map<string, Promise<void>>());
    const [, setPermissionRevision] = useState(0);
    const { projects, currentProject, projectId, isAllocat } =
        useOutletContext<ProjectWorkspaceContext>();
    const [view, setView] = useState<CalendarView>("month");
    const [scope, setScope] = useState<CalendarScope>("all");
    const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [planningBlocks, setPlanningBlocks] = useState<
        CalendarPlanningBlock[]
    >([]);
    const [focusTasks, setFocusTasks] = useState<CalendarFocusTask[]>([]);
    const [focusPending, setFocusPending] = useState<{
        taskId: string;
        action: FocusAction;
    } | null>(null);
    const focusSaveLock = useRef(false);
    const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
    const [editingBlock, setEditingBlock] =
        useState<CalendarPlanningBlock | null>(null);
    const [planEditorOpen, setPlanEditorOpen] = useState(false);
    const [planningOpen, setPlanningOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savingPlan, setSavingPlan] = useState(false);
    const [editingTaskTime, setEditingTaskTime] = useState<CalendarItem | null>(
        null,
    );
    const [savingTaskTime, setSavingTaskTime] = useState(false);
    const taskTimeSaveLock = useRef(false);
    const calendarMounted = useRef(false);
    useEffect(() => {
        calendarMounted.current = true;
        return () => {
            calendarMounted.current = false;
        };
    }, []);
    const [error, setError] = useState<string | null>(null);
    const lastAutomaticLoadRef = useRef<string | null>(null);
    const requestVersionRef = useRef(0);
    const range = useMemo<CalendarRange>(() => {
        if (view === "week") {
            const start = startOfWeek(anchorDate);
            return { start, end: addDays(start, 7) };
        }
        const monthStart = startOfMonth(anchorDate);
        const start = startOfWeek(monthStart);
        return { start, end: addDays(start, 42) };
    }, [anchorDate, view]);
    const rangeStartKey = toDateKey(range.start);
    const rangeEndKey = toDateKey(range.end);
    const focusWeekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);
    const focusWeekStartKey = toDateKey(focusWeekStart);
    const currentFocusWeek = useRef(focusWeekStartKey);
    currentFocusWeek.current = focusWeekStartKey;
    const ensureTaskPermission = useCallback(
        (taskProjectId: string): Promise<void> => {
            if (!permissionAccount) return Promise.resolve();
            const key = `${permissionAccount}/${taskProjectId}`;
            const cached = taskPermissionCache.current.get(key);
            if (cached && cached.expiresAt > Date.now())
                return Promise.resolve();
            const existingRead = taskPermissionReads.current.get(key);
            if (existingRead) return existingRead;
            const pending = api
                .get<{ canManageTasks: boolean }>(
                    `/projects/${encodeURIComponent(taskProjectId)}/permissions`,
                    { withCredentials: true },
                )
                .then((response) => {
                    taskPermissionCache.current.set(key, {
                        allowed: response.data?.canManageTasks === true,
                        expiresAt: Date.now() + 30000,
                    });
                })
                .catch(() => {
                    taskPermissionCache.current.set(key, {
                        allowed: false,
                        expiresAt: Date.now() + 3000,
                    });
                })
                .finally(() => {
                    taskPermissionReads.current.delete(key);
                    if (
                        calendarMounted.current &&
                        permissionAccountRef.current === permissionAccount
                    )
                        setPermissionRevision((value) => value + 1);
                });
            taskPermissionReads.current.set(key, pending);
            return pending;
        },
        [permissionAccount],
    );
    const fetchCalendarData = useCallback(
        async (force = false) => {
            const loadKey = [
                rangeStartKey,
                rangeEndKey,
                focusWeekStartKey,
            ].join(":");
            if (!force && lastAutomaticLoadRef.current === loadKey) return;
            lastAutomaticLoadRef.current = loadKey;
            const requestVersion = ++requestVersionRef.current;
            try {
                setLoading(true);
                setError(null);
                const [eventsResponse, blocksResponse, focusResponse] =
                    await Promise.all([
                        api.get<CalendarEvent[]>("/calendar", {
                            params: { start: rangeStartKey, end: rangeEndKey },
                            withCredentials: true,
                        }),
                        api.get<CalendarPlanningBlock[]>(
                            "/calendar/plan-blocks",
                            {
                                params: {
                                    start: rangeStartKey,
                                    end: rangeEndKey,
                                },
                                withCredentials: true,
                            },
                        ),
                        api.get<CalendarFocusTask[]>("/calendar/focus", {
                            params: { weekStart: focusWeekStartKey },
                            withCredentials: true,
                        }),
                    ]);
                if (requestVersion !== requestVersionRef.current) return;
                setEvents(
                    Array.isArray(eventsResponse.data)
                        ? eventsResponse.data
                        : [],
                );
                setPlanningBlocks(
                    Array.isArray(blocksResponse.data)
                        ? blocksResponse.data
                        : [],
                );
                setFocusTasks(
                    Array.isArray(focusResponse.data) ? focusResponse.data : [],
                );
            } catch (requestError) {
                if (requestVersion !== requestVersionRef.current) return;
                lastAutomaticLoadRef.current = null;
                console.error("Could not load calendar:", requestError);
                const responseMessage =
                    axios.isAxiosError(requestError) &&
                    typeof requestError.response?.data?.message === "string"
                        ? requestError.response.data.message
                        : null;
                setError(
                    responseMessage ??
                        "Your calendar could not be loaded. Please try again.",
                );
            } finally {
                if (requestVersion === requestVersionRef.current)
                    setLoading(false);
            }
        },
        [rangeStartKey, rangeEndKey, focusWeekStartKey],
    );
    useEffect(() => {
        void fetchCalendarData();
    }, [fetchCalendarData]);
    const calendarItems = useMemo<CalendarItem[]>(() => {
        const projectEvents: CalendarItem[] = events.map((event) => ({
            ...event,
            projectStatus: calendarProjectStatus(
                projects,
                event.projectId,
                event.projectStatus,
            ),
            source: "event",
            sourceId: event.id,
        }));
        const planItems: CalendarItem[] = planningBlocks.map((block) => ({
            id: `planning-${block.id}`,
            source: "planning",
            sourceId: block.id,
            type: "plan-block",
            projectId: block.projectId,
            taskId: block.taskId,
            projectTitle: block.projectTitle ?? "Personal planning",
            projectCode: null,
            title: block.title,
            description: null,
            notes: block.notes,
            start: block.startAt,
            end: block.endAt,
            allDay: false,
            status: "planned",
            relationship: "planning",
        }));
        return [...projectEvents, ...planItems];
    }, [events, planningBlocks, projects]);
    const visibleFocusTasks = useMemo(
        () =>
            focusTasks.map((task) => ({
                ...task,
                projectStatus: calendarProjectStatus(
                    projects,
                    task.projectId,
                    calendarItems.find(
                        (item) =>
                            item.type === "task" && item.taskId === task.taskId,
                    )?.projectStatus ?? task.projectStatus,
                ),
            })),
        [focusTasks, projects, calendarItems],
    );
    const visibleItems = useMemo(
        () =>
            calendarItems.filter((item) => {
                if (item.relationship === "planning") return true;
                if (scope === "mine") return item.relationship === "owner";
                if (scope === "work") return item.relationship === "allocat";
                return true;
            }),
        [calendarItems, scope],
    );
    useEffect(() => {
        if (!isAllocat || !permissionAccount) return;
        const openProjects = new Set(
            projects
                .filter((project) =>
                    ["pending", "active"].includes(
                        normalizeCalendarStatus(project.status),
                    ),
                )
                .map((project) => String(project.id)),
        );
        const ids = [
            ...new Set([
                ...(openProjects.has(String(projectId))
                    ? [String(projectId)]
                    : []),
                ...visibleItems
                    .filter(
                        (item) =>
                            item.type === "task" &&
                            !isCancelledCalendarTask(item) &&
                            item.projectId &&
                            openProjects.has(String(item.projectId)),
                    )
                    .map((item) => String(item.projectId)),
            ]),
        ];
        let active = true;
        let next = 0;
        async function prefetch() {
            while (active && next < ids.length) {
                const id = ids[next++];
                await ensureTaskPermission(id);
            }
        }
        for (let worker = 0; worker < Math.min(3, ids.length); worker++)
            void prefetch();
        return () => {
            active = false;
        };
    }, [
        visibleItems,
        projects,
        projectId,
        isAllocat,
        permissionAccount,
        ensureTaskPermission,
    ]);
    useEffect(() => {
        if (
            isAllocat &&
            selectedItem?.type === "task" &&
            selectedItem.projectId &&
            !isCancelledCalendarTask(selectedItem) &&
            projects.some(
                (project) =>
                    String(project.id) === String(selectedItem.projectId) &&
                    ["pending", "active"].includes(
                        normalizeCalendarStatus(project.status),
                    ),
            )
        ) {
            void ensureTaskPermission(selectedItem.projectId);
        }
    }, [
        selectedItem?.taskId,
        selectedItem?.projectId,
        projects,
        isAllocat,
        ensureTaskPermission,
    ]);
    const monthDays = useMemo<CalendarDay[]>(() => {
        const currentMonth = anchorDate.getMonth();
        const start = startOfWeek(startOfMonth(anchorDate));
        const today = new Date();
        return Array.from({ length: 42 }, (_, index) => {
            const date = addDays(start, index);
            return {
                date,
                inCurrentMonth: date.getMonth() === currentMonth,
                isToday: isSameDay(date, today),
            };
        });
    }, [anchorDate]);
    const weekDays = useMemo(
        () =>
            Array.from({ length: 7 }, (_, index) =>
                addDays(focusWeekStart, index),
            ),
        [focusWeekStart],
    );
    const insights = useMemo(
        () =>
            buildPlanningInsights(
                focusWeekStart,
                addDays(focusWeekStart, 7),
                calendarItems,
                planningBlocks,
            ),
        [focusWeekStart, calendarItems, planningBlocks],
    );
    const upcomingItems = useMemo(() => {
        const now = new Date();
        return calendarItems
            .filter((item) => parseCalendarDate(item.start) >= now)
            .sort(compareCalendarItems)
            .slice(0, 4);
    }, [calendarItems]);
    const ownedEventCount = useMemo(
        () => events.filter((event) => event.relationship === "owner").length,
        [events],
    );
    const workEventCount = useMemo(
        () => events.filter((event) => event.relationship === "allocat").length,
        [events],
    );
    function goPrevious() {
        setAnchorDate((current) =>
            view === "month" ? addMonths(current, -1) : addDays(current, -7),
        );
    }
    function goNext() {
        setAnchorDate((current) =>
            view === "month" ? addMonths(current, 1) : addDays(current, 7),
        );
    }
    function goToday() {
        setAnchorDate(startOfDay(new Date()));
    }
    async function toggleFocus(taskId: string) {
        if (focusSaveLock.current) return;
        const focused = focusTasks.some((task) => task.taskId === taskId);
        const calendarTask = calendarItems.find(
            (item) => item.type === "task" && item.taskId === taskId,
        );
        if (!focused && calendarTask && isCancelledCalendarTask(calendarTask)) {
            toast.error(
                "Tasks from cancelled projects cannot be added to weekly focus.",
            );
            return;
        }
        const weekStart = focusWeekStartKey;
        focusSaveLock.current = true;
        setFocusPending({ taskId, action: focused ? "remove" : "add" });
        try {
            const response = focused
                ? await api.delete<CalendarFocusTask[]>(
                      `/calendar/focus/${taskId}`,
                      {
                          params: { weekStart },
                          withCredentials: true,
                      },
                  )
                : await api.put<CalendarFocusTask[]>(
                      `/calendar/focus/${taskId}`,
                      null,
                      { params: { weekStart }, withCredentials: true },
                  );
            if (
                calendarMounted.current &&
                currentFocusWeek.current === weekStart
            )
                setFocusTasks(response.data);
        } catch (requestError) {
            if (
                calendarMounted.current &&
                currentFocusWeek.current === weekStart
            )
                setError(
                    getAxiosMessage(
                        requestError,
                        "The weekly focus could not be updated.",
                    ),
                );
        } finally {
            focusSaveLock.current = false;
            if (calendarMounted.current) setFocusPending(null);
        }
    }
    function createPlanningBlock() {
        setEditingBlock(null);
        setPlanEditorOpen(true);
    }
    function editPlanningBlock(item: CalendarItem) {
        if (item.source !== "planning") return;
        const block = planningBlocks.find(
            (planningBlock) => planningBlock.id === item.sourceId,
        );
        if (!block) return;
        setEditingBlock(block);
        setSelectedItem(null);
        setPlanEditorOpen(true);
    }
    async function savePlanningBlock(payload: PlanningBlockPayload) {
        try {
            setSavingPlan(true);
            if (editingBlock)
                await api.patch(
                    `/calendar/plan-blocks/${editingBlock.id}`,
                    payload,
                    {
                        withCredentials: true,
                    },
                );
            else
                await api.post("/calendar/plan-blocks", payload, {
                    withCredentials: true,
                });
            setPlanEditorOpen(false);
            setEditingBlock(null);
            await fetchCalendarData(true);
        } catch (requestError) {
            throw new Error(
                getAxiosMessage(
                    requestError,
                    "The planning block could not be saved.",
                ),
            );
        } finally {
            setSavingPlan(false);
        }
    }
    async function deletePlanningBlock(item: CalendarItem) {
        if (item.source !== "planning") return;
        try {
            await api.delete(`/calendar/plan-blocks/${item.sourceId}`, {
                withCredentials: true,
            });
            setSelectedItem(null);
            await fetchCalendarData(true);
        } catch (requestError) {
            setError(
                getAxiosMessage(
                    requestError,
                    "The planning block could not be deleted.",
                ),
            );
        }
    }
    async function saveTaskTime(dueDate: string) {
        if (!editingTaskTime?.taskId || taskTimeSaveLock.current) return;
        const item = editingTaskTime;
        taskTimeSaveLock.current = true;
        setSavingTaskTime(true);
        try {
            const response = await api.patch<Task>(
                `/projects/tasks/task/${item.taskId}/due-date`,
                { dueDate },
                { withCredentials: true },
            );
            if (!calendarMounted.current) return;
            const updatedTask = response.data;
            if (!updatedTask?.dueDate)
                throw new Error(
                    "The task time could not be confirmed. Refresh the calendar before trying again.",
                );
            const savedDueDate = updatedTask.dueDate;
            setEvents((current) =>
                current.map((event) =>
                    event.type === "task" && event.taskId === item.taskId
                        ? {
                              ...event,
                              start: savedDueDate,
                              end: null,
                              allDay: false,
                              status: updatedTask.status,
                          }
                        : event,
                ),
            );
            setFocusTasks((current) =>
                current.map((task) =>
                    task.taskId === item.taskId
                        ? {
                              ...task,
                              dueDate: savedDueDate,
                              status: updatedTask.status,
                          }
                        : task,
                ),
            );
            setSelectedItem((current) =>
                current?.type === "task" && current.taskId === item.taskId
                    ? {
                          ...current,
                          start: savedDueDate,
                          end: null,
                          allDay: false,
                          status: updatedTask.status,
                      }
                    : current,
            );
            setEditingTaskTime(null);
            toast.success("Task due date and time updated.");
            await fetchCalendarData(true);
        } catch (requestError) {
            throw new Error(
                getAxiosMessage(
                    requestError,
                    requestError instanceof Error
                        ? requestError.message
                        : "The task time could not be updated.",
                ),
            );
        } finally {
            taskTimeSaveLock.current = false;
            if (calendarMounted.current) setSavingTaskTime(false);
        }
    }
    return (
        <div className="min-w-0 pb-4">
            {/* Shared date pickers portal their popups; keep them above this page's editor layers. */}
            <style>{`body:has([data-calendar-editor]) [data-radix-popper-content-wrapper] { z-index: 110 !important; }`}</style>
            <header className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                    <p
                        className="truncate text-[11px] text-muted-foreground"
                        title={currentProject.title}
                    >
                        {currentProject.title}
                    </p>
                    <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-medium tracking-[-0.03em] text-foreground">
                        <CalendarDaysIcon
                            size={21}
                            aria-hidden="true"
                            className="shrink-0 text-muted-foreground"
                        />
                        Calendar
                    </h1>
                    <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                        Plan across your projects and client work.
                    </p>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <CalendarScopeControl
                        value={scope}
                        onChange={setScope}
                        isAllocat={isAllocat}
                        ownedCount={ownedEventCount}
                        workCount={workEventCount}
                    />
                    <Button
                        type="button"
                        onClick={createPlanningBlock}
                        className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${primaryActionButton}`}
                    >
                        <PlusIcon size={14} aria-hidden="true" />
                        Plan time
                    </Button>
                    <CalendarViewSwitch view={view} onChange={setView} />
                </div>
            </header>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.h2
                            key={`${view}-${formatCalendarHeading(anchorDate, view)}`}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -3 }}
                            transition={{ duration: 0.14 }}
                            className="truncate text-base font-medium tracking-[-0.02em] text-foreground sm:text-lg"
                        >
                            {formatCalendarHeading(anchorDate, view)}
                        </motion.h2>
                    </AnimatePresence>
                    <span className="hidden shrink-0 rounded-md bg-surface-2/60 px-2 py-1 text-[11px] tabular-nums text-muted-foreground sm:inline-flex dark:bg-surface-3/40">
                        {visibleItems.length}{" "}
                        {visibleItems.length === 1 ? "item" : "items"}
                    </span>
                </div>
                <div className="flex items-center gap-1 self-end sm:self-auto">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={goToday}
                        className={`h-9 rounded-lg px-3 text-xs font-medium shadow-none ${ghostActionButton}`}
                    >
                        <RotateCcwIcon size={12} aria-hidden="true" />
                        Today
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={goPrevious}
                        className={`h-9 w-9 rounded-lg shadow-none ${ghostActionButton}`}
                        aria-label="Previous period"
                    >
                        <ChevronLeftIcon size={15} aria-hidden="true" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={goNext}
                        className={`h-9 w-9 rounded-lg shadow-none ${ghostActionButton}`}
                        aria-label="Next period"
                    >
                        <ChevronRightIcon size={15} aria-hidden="true" />
                    </Button>
                </div>
            </div>
            <CalendarPlanningBar
                open={planningOpen}
                onToggle={() => setPlanningOpen((current) => !current)}
                insights={insights}
                focusTasks={visibleFocusTasks}
                focusBusy={Boolean(focusPending)}
                focusPendingTaskId={focusPending?.taskId}
                upcomingItems={upcomingItems}
                currentProjectId={projectId}
                onOpenItem={setSelectedItem}
                onOpenProject={(task) =>
                    navigate(`/projects/${task.projectId}`)
                }
                onRemoveFocus={(taskId) => void toggleFocus(taskId)}
            />
            <div className="mt-5 min-w-0">
                {loading ? (
                    <CalendarLoading />
                ) : error ? (
                    <CalendarError
                        message={error}
                        onRetry={() => void fetchCalendarData(true)}
                        onDismiss={() => setError(null)}
                    />
                ) : (
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${view}-${rangeStartKey}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.16, ease: "easeOut" }}
                        >
                            {view === "month" ? (
                                <MonthView
                                    days={monthDays}
                                    items={visibleItems}
                                    currentProjectId={projectId}
                                    onItemClick={setSelectedItem}
                                />
                            ) : (
                                <WeekView
                                    days={weekDays}
                                    items={visibleItems}
                                    currentProjectId={projectId}
                                    onItemClick={setSelectedItem}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
            {!loading && !error && (
                <CalendarLegend showClientWork={isAllocat} />
            )}
            <AnimatePresence>
                {selectedItem && (
                    <CalendarDetailPanel
                        taskTimePermission={
                            selectedItem.projectId
                                ? taskPermissionCache.current.get(
                                      `${permissionAccount}/${selectedItem.projectId}`,
                                  )?.allowed
                                : false
                        }
                        focusBusy={Boolean(focusPending)}
                        focusPendingAction={
                            focusPending &&
                            focusPending.taskId === selectedItem.taskId
                                ? focusPending.action
                                : undefined
                        }
                        item={{
                            ...selectedItem,
                            projectStatus: calendarProjectStatus(
                                projects,
                                selectedItem.projectId,
                                selectedItem.projectStatus,
                            ),
                        }}
                        current={
                            Boolean(selectedItem.projectId) &&
                            String(selectedItem.projectId) === String(projectId)
                        }
                        isFocused={Boolean(
                            selectedItem.taskId &&
                            focusTasks.some(
                                (task) => task.taskId === selectedItem.taskId,
                            ),
                        )}
                        onClose={() => setSelectedItem(null)}
                        onOpenProject={() => {
                            if (selectedItem.projectId)
                                navigate(`/projects/${selectedItem.projectId}`);
                        }}
                        onEditTaskTime={
                            isAllocat &&
                            selectedItem.type === "task" &&
                            !isCancelledCalendarTask(selectedItem) &&
                            selectedItem.taskId &&
                            projects.some(
                                (project) =>
                                    String(project.id) ===
                                        String(selectedItem.projectId) &&
                                    ["pending", "active"].includes(
                                        normalizeCalendarStatus(project.status),
                                    ),
                            )
                                ? () => setEditingTaskTime(selectedItem)
                                : undefined
                        }
                        onToggleFocus={
                            selectedItem.taskId &&
                            (!isCancelledProjectStatus(
                                calendarProjectStatus(
                                    projects,
                                    selectedItem.projectId,
                                    selectedItem.projectStatus,
                                ),
                            ) ||
                                focusTasks.some(
                                    (task) =>
                                        task.taskId === selectedItem.taskId,
                                ))
                                ? () => void toggleFocus(selectedItem.taskId!)
                                : undefined
                        }
                        onEdit={
                            selectedItem.source === "planning"
                                ? () => editPlanningBlock(selectedItem)
                                : undefined
                        }
                        onDelete={
                            selectedItem.source === "planning"
                                ? () => void deletePlanningBlock(selectedItem)
                                : undefined
                        }
                    />
                )}
            </AnimatePresence>
            {editingTaskTime && (
                <TaskDueTimeEditor
                    key={editingTaskTime.taskId}
                    item={editingTaskTime}
                    saving={savingTaskTime}
                    onClose={() => {
                        if (!taskTimeSaveLock.current) setEditingTaskTime(null);
                    }}
                    onSave={saveTaskTime}
                />
            )}
            <AnimatePresence>
                {planEditorOpen && (
                    <PlanningBlockEditor
                        projects={projects}
                        block={editingBlock}
                        defaultDate={toDateKey(anchorDate)}
                        saving={savingPlan}
                        onClose={() => {
                            setPlanEditorOpen(false);
                            setEditingBlock(null);
                        }}
                        onSave={savePlanningBlock}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CalendarPlanningBar({
    open,
    onToggle,
    insights,
    focusTasks,
    upcomingItems,
    currentProjectId,
    onOpenItem,
    onOpenProject,
    onRemoveFocus,
    focusBusy,
    focusPendingTaskId,
}: {
    focusBusy: boolean;
    focusPendingTaskId?: string;
    open: boolean;
    onToggle: () => void;
    insights: PlanningInsights;
    focusTasks: CalendarFocusTask[];
    upcomingItems: CalendarItem[];
    currentProjectId: string;
    onOpenItem: (item: CalendarItem) => void;
    onOpenProject: (task: CalendarFocusTask) => void;
    onRemoveFocus: (taskId: string) => void;
}) {
    const nextItem = upcomingItems[0];
    return (
        <div
            className={`mt-4 overflow-hidden rounded-xl border ${softPanelSurface}`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className={`flex w-full min-w-0 items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-2/30 sm:items-center ${controlFocus}`}
            >
                <span className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
                    <StarIcon
                        size={13}
                        aria-hidden="true"
                        className="text-muted-foreground"
                    />
                    <span className="text-xs font-medium text-foreground">
                        Week plan
                    </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2">
                    <PlanningPill>
                        {formatHours(insights.plannedHours)}h /{" "}
                        {insights.capacityHours}h
                    </PlanningPill>
                    <PlanningPill>{insights.workloadLabel}</PlanningPill>
                    <PlanningPill>{focusTasks.length} focus</PlanningPill>
                    <PlanningPill>
                        {insights.deadlineCount}{" "}
                        {insights.deadlineCount === 1
                            ? "deadline"
                            : "deadlines"}
                    </PlanningPill>
                    {insights.alerts.length > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-status-overdue/[0.06] px-2 py-1 text-[11px] text-status-overdue-foreground">
                            <AlertTriangleIcon size={11} aria-hidden="true" />
                            {insights.alerts.length}
                        </span>
                    )}
                    {nextItem && (
                        <span className="ml-auto hidden min-w-0 max-w-56 truncate text-[11px] text-muted-foreground 2xl:block">
                            Next:{" "}
                            <span className="text-foreground/75">
                                {nextItem.title}
                            </span>
                        </span>
                    )}
                </span>
                <ChevronDownIcon
                    size={14}
                    aria-hidden="true"
                    className={`mt-1 shrink-0 text-muted-foreground transition-transform duration-200 sm:mt-0 ${open ? "rotate-180" : ""}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border/25 p-3 sm:p-4">
                            {insights.alerts.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {insights.alerts.map((alert) => (
                                        <span
                                            key={alert}
                                            className="inline-flex items-center gap-1.5 rounded-md bg-surface-2/60 px-2.5 py-1.5 text-[11px] text-muted-foreground dark:bg-surface-3/35"
                                        >
                                            <AlertTriangleIcon
                                                size={11}
                                                aria-hidden="true"
                                            />
                                            {alert}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="grid gap-3 xl:grid-cols-2">
                                <WeeklyFocusStrip
                                    busy={focusBusy}
                                    pendingTaskId={focusPendingTaskId}
                                    tasks={focusTasks}
                                    onOpenProject={onOpenProject}
                                    onRemove={onRemoveFocus}
                                />
                                <UpcomingStrip
                                    items={upcomingItems}
                                    currentProjectId={currentProjectId}
                                    onOpen={onOpenItem}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
function PlanningPill({ children }: { children: ReactNode }) {
    return (
        <span className="whitespace-nowrap rounded-md bg-surface-2/55 px-2 py-1 text-[11px] tabular-nums text-muted-foreground dark:bg-surface-3/35">
            {children}
        </span>
    );
}
function WeeklyFocusStrip({
    tasks,
    onOpenProject,
    onRemove,
    busy,
    pendingTaskId,
}: {
    busy: boolean;
    pendingTaskId?: string;
    tasks: CalendarFocusTask[];
    onOpenProject: (task: CalendarFocusTask) => void;
    onRemove: (taskId: string) => void;
}) {
    return (
        <div className={`min-w-0 rounded-lg p-3 sm:p-4 ${insetPanelSurface}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <StarIcon
                            size={12}
                            aria-hidden="true"
                            className="text-muted-foreground"
                        />
                        <p className="text-xs font-medium text-foreground">
                            Weekly focus
                        </p>
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                        Up to five priorities for this week.
                    </p>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {tasks.length}/5
                </span>
            </div>
            {tasks.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {tasks.map((task) => (
                        <div
                            key={task.taskId}
                            className="flex min-w-0 max-w-full items-center gap-2 rounded-md border border-border/25 bg-card px-2.5 py-2"
                        >
                            <button
                                type="button"
                                onClick={() => onOpenProject(task)}
                                className={`min-w-0 rounded text-left ${controlFocus}`}
                            >
                                <p
                                    className={`max-w-44 truncate text-xs font-medium ${isCancelledProjectStatus(task.projectStatus) ? "text-status-overdue-foreground line-through decoration-status-overdue decoration-2" : "text-foreground/85"}`}
                                >
                                    {task.title}
                                </p>
                                <p className="mt-1 max-w-44 truncate text-[11px] text-muted-foreground">
                                    {task.projectTitle}
                                </p>
                                {isCancelledProjectStatus(
                                    task.projectStatus,
                                ) && (
                                    <span className="sr-only">
                                        Project cancelled
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(task.taskId)}
                                disabled={busy}
                                aria-busy={pendingTaskId === task.taskId}
                                title={
                                    pendingTaskId === task.taskId
                                        ? "Removing from focus…"
                                        : "Remove from focus"
                                }
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-60 ${ghostActionButton} ${controlFocus}`}
                                aria-label={
                                    pendingTaskId === task.taskId
                                        ? `Removing ${task.title} from weekly focus`
                                        : `Remove ${task.title} from weekly focus`
                                }
                            >
                                {pendingTaskId === task.taskId ? (
                                    <LoaderCircleIcon
                                        size={12}
                                        aria-hidden="true"
                                        className="animate-spin"
                                    />
                                ) : (
                                    <XIcon size={12} aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-[11px] leading-6 text-muted-foreground">
                    Open a task in the calendar and add it to your weekly focus.
                </p>
            )}
        </div>
    );
}
function UpcomingStrip({
    items,
    currentProjectId,
    onOpen,
}: {
    items: CalendarItem[];
    currentProjectId: string;
    onOpen: (item: CalendarItem) => void;
}) {
    return (
        <div className={`min-w-0 rounded-lg p-3 sm:p-4 ${insetPanelSurface}`}>
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Clock3Icon
                        size={12}
                        aria-hidden="true"
                        className="text-muted-foreground"
                    />
                    <p className="text-xs font-medium text-foreground">
                        Next up
                    </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                    {items.length} upcoming
                </span>
            </div>
            {items.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                    {items.map((item) => {
                        const current =
                            Boolean(item.projectId) &&
                            String(item.projectId) === String(currentProjectId);
                        const appearance = getCalendarEntryAppearance(
                            item,
                            current,
                        );
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onOpen(item)}
                                className={`min-w-0 rounded-md border px-2.5 py-2 text-left transition-[background-color,border-color] duration-150 ${appearance.surface} ${controlFocus}`}
                            >
                                <p className={`text-[11px] ${appearance.meta}`}>
                                    {formatUpcomingDate(
                                        parseCalendarDate(item.start),
                                    )}
                                </p>
                                <p
                                    className={`mt-1 truncate text-xs font-medium ${isCancelledCalendarTask(item) ? "line-through decoration-status-overdue decoration-2" : ""}`}
                                >
                                    {item.title}
                                </p>
                                <p
                                    className={`mt-1 truncate text-[11px] ${appearance.meta}`}
                                >
                                    {item.type === "plan-block"
                                        ? "My plan"
                                        : item.projectTitle}
                                </p>
                                {isCancelledCalendarTask(item) && (
                                    <span className="sr-only">
                                        Project cancelled
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <p className="text-[11px] leading-6 text-muted-foreground">
                    Nothing upcoming in the current calendar range.
                </p>
            )}
        </div>
    );
}
function CalendarViewSwitch({
    view,
    onChange,
}: {
    view: CalendarView;
    onChange: (view: CalendarView) => void;
}) {
    return (
        <div
            role="group"
            aria-label="Calendar view"
            className="inline-flex h-10 w-fit items-center rounded-lg bg-surface-2/60 p-1 dark:bg-surface-3/55"
        >
            <CalendarViewButton
                active={view === "month"}
                label="Month"
                onClick={() => onChange("month")}
            />
            <CalendarViewButton
                active={view === "week"}
                label="Week"
                onClick={() => onChange("week")}
            />
        </div>
    );
}
function CalendarViewButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`relative flex h-8 min-w-16 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors duration-150 ${controlFocus} ${active ? "text-brand-secondary-highlight dark:text-secondary" : "text-muted-foreground hover:text-foreground"}`}
        >
            {active && (
                <motion.span
                    layoutId="calendar-view"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-md bg-card"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
            )}
            <span className="relative z-10">{label}</span>
        </button>
    );
}
function CalendarScopeControl({
    value,
    onChange,
    isAllocat,
    ownedCount,
    workCount,
}: {
    value: CalendarScope;
    onChange: (value: CalendarScope) => void;
    isAllocat: boolean;
    ownedCount: number;
    workCount: number;
}) {
    const label =
        value === "mine"
            ? "My projects"
            : value === "work"
              ? "Client work"
              : "All projects";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`h-10 rounded-lg px-3 text-xs font-medium shadow-none ${secondaryActionButton}`}
                >
                    <Layers3Icon size={13} aria-hidden="true" />
                    {label}
                    <ChevronDownIcon size={13} aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-border/35 bg-popover p-1.5 text-popover-foreground shadow-none"
            >
                <DropdownMenuLabel className="px-2.5 py-2">
                    <p className="text-[11px] font-medium text-muted-foreground">
                        Calendar scope
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/25" />
                <ScopeMenuItem
                    active={value === "all"}
                    icon={Layers3Icon}
                    label="All projects"
                    onSelect={() => onChange("all")}
                />
                <ScopeMenuItem
                    active={value === "mine"}
                    icon={BriefcaseBusinessIcon}
                    label="My projects"
                    count={ownedCount}
                    onSelect={() => onChange("mine")}
                />
                {isAllocat && (
                    <ScopeMenuItem
                        active={value === "work"}
                        icon={FolderOpenIcon}
                        label="Client work"
                        count={workCount}
                        onSelect={() => onChange("work")}
                    />
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
function ScopeMenuItem({
    active,
    icon: Icon,
    label,
    count,
    onSelect,
}: {
    active: boolean;
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    count?: number;
    onSelect: () => void;
}) {
    return (
        <DropdownMenuItem
            onSelect={onSelect}
            className={`min-h-10 gap-2 rounded-lg px-3 py-2.5 text-xs font-medium focus:bg-surface-2/60 focus:text-foreground data-[highlighted]:bg-surface-2/60 data-[highlighted]:text-foreground dark:focus:bg-surface-2 dark:data-[highlighted]:bg-surface-2 ${active ? "bg-surface-2/50 text-brand-secondary-highlight dark:bg-card dark:text-secondary" : "text-foreground/75"}`}
        >
            <Icon size={13} className="text-muted-foreground" />
            <span className="flex-1">{label}</span>
            {typeof count === "number" && (
                <span className="text-[11px] tabular-nums text-muted-foreground">
                    {count}
                </span>
            )}
            {active && <CheckIcon size={12} className="ml-1" />}
        </DropdownMenuItem>
    );
}

function MonthView({
    days,
    items,
    currentProjectId,
    onItemClick,
}: {
    days: CalendarDay[];
    items: CalendarItem[];
    currentProjectId: string;
    onItemClick: (item: CalendarItem) => void;
}) {
    return (
        <div
            className={`overflow-x-auto overscroll-x-contain rounded-xl border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${calendarShell}`}
        >
            <div className="min-w-[760px]">
                <div className="grid grid-cols-7 border-b border-border/30 bg-surface-2/55 dark:bg-surface-2/40">
                    {WEEK_DAYS.map((day) => (
                        <div
                            key={day}
                            className="px-2 py-3 text-center text-[11px] font-medium text-muted-foreground"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const dayItems = items
                            .filter((item) =>
                                isSameDay(
                                    parseCalendarDate(item.start),
                                    day.date,
                                ),
                            )
                            .sort(compareCalendarItems);
                        return (
                            <MonthDay
                                key={toDateKey(day.date)}
                                day={day}
                                items={dayItems}
                                currentProjectId={currentProjectId}
                                onItemClick={onItemClick}
                                isLastColumn={(index + 1) % 7 === 0}
                                isLastRow={index >= 35}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
function MonthDay({
    day,
    items,
    currentProjectId,
    onItemClick,
    isLastColumn,
    isLastRow,
}: {
    day: CalendarDay;
    items: CalendarItem[];
    currentProjectId: string;
    onItemClick: (item: CalendarItem) => void;
    isLastColumn: boolean;
    isLastRow: boolean;
}) {
    const visibleItems = items.slice(0, 3);
    const remainingCount = Math.max(0, items.length - visibleItems.length);
    return (
        <div
            className={`relative min-h-[140px] min-w-0 p-2 transition-colors ${!isLastColumn ? "border-r border-border/30" : ""} ${!isLastRow ? "border-b border-border/30" : ""} ${day.inCurrentMonth ? "bg-card" : "bg-surface-2/45 dark:bg-surface-1/55"}`}
        >
            <span
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium tabular-nums ${day.isToday ? "bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground" : day.inCurrentMonth ? "text-foreground/80" : "text-muted-foreground/60"}`}
            >
                {day.date.getDate()}
            </span>
            <div className="mt-2 space-y-1.5">
                {visibleItems.map((item) => (
                    <CalendarItemButton
                        key={item.id}
                        item={item}
                        current={
                            Boolean(item.projectId) &&
                            String(item.projectId) === String(currentProjectId)
                        }
                        compact
                        onClick={() => onItemClick(item)}
                    />
                ))}
                {remainingCount > 0 && (
                    <p className="px-1 pt-1 text-[11px] text-muted-foreground">
                        +{remainingCount} more
                    </p>
                )}
            </div>
        </div>
    );
}
function WeekView({
    days,
    items,
    currentProjectId,
    onItemClick,
}: {
    days: Date[];
    items: CalendarItem[];
    currentProjectId: string;
    onItemClick: (item: CalendarItem) => void;
}) {
    const allDayItems = items.filter((item) => item.allDay);
    const timedItems = items.filter((item) => !item.allDay);
    const timelineHeight = WEEK_HOURS.length * HOUR_HEIGHT;
    const maxColumns = Math.max(
        1,
        ...days.map((date) => {
            const dayItems = timedItems.filter((item) =>
                isSameDay(parseCalendarDate(item.start), date),
            );
            return Math.max(
                1,
                ...positionWeekItems(dayItems, timelineHeight).map(
                    (position) => position.columnCount,
                ),
            );
        }),
    );
    const minimumWeekWidth = Math.max(900, 64 + 7 * maxColumns * 96);
    return (
        <div
            className={`overflow-x-auto overscroll-x-contain rounded-xl border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${calendarShell}`}
        >
            <div style={{ minWidth: minimumWeekWidth }}>
                <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border/30 bg-surface-2/55 dark:bg-surface-2/40">
                    <div />
                    {days.map((date) => {
                        const today = isSameDay(date, new Date());
                        return (
                            <div
                                key={toDateKey(date)}
                                className="border-l border-border/30 px-3 py-3 text-center"
                            >
                                <p className="text-[11px] font-medium text-muted-foreground">
                                    {formatWeekday(date)}
                                </p>
                                <span
                                    className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium tabular-nums ${today ? "bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground" : "text-foreground/80"}`}
                                >
                                    {date.getDate()}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border/30">
                    <div className="px-2 py-3 text-right text-[11px] text-muted-foreground">
                        All day
                    </div>
                    {days.map((date) => {
                        const dayItems = allDayItems
                            .filter((item) =>
                                isSameDay(parseCalendarDate(item.start), date),
                            )
                            .sort(compareCalendarItems);
                        return (
                            <div
                                key={toDateKey(date)}
                                className="min-h-20 space-y-1.5 border-l border-border/30 p-1.5"
                            >
                                {dayItems.map((item) => (
                                    <CalendarItemButton
                                        key={item.id}
                                        item={item}
                                        current={
                                            Boolean(item.projectId) &&
                                            String(item.projectId) ===
                                                String(currentProjectId)
                                        }
                                        compact
                                        onClick={() => onItemClick(item)}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
                <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
                    <div
                        className="relative bg-card"
                        style={{ height: timelineHeight }}
                    >
                        {WEEK_HOURS.map((hour, index) => (
                            <div
                                key={hour}
                                className="absolute left-0 right-0 border-t border-border/25"
                                style={{ top: index * HOUR_HEIGHT }}
                            >
                                <span className="absolute -top-2 right-2 bg-card px-1 text-[11px] text-muted-foreground">
                                    {formatHour(hour)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {days.map((date) => {
                        const dayItems = timedItems
                            .filter((item) =>
                                isSameDay(parseCalendarDate(item.start), date),
                            )
                            .sort(compareCalendarItems);
                        return (
                            <WeekDayColumn
                                key={toDateKey(date)}
                                items={dayItems}
                                currentProjectId={currentProjectId}
                                height={timelineHeight}
                                onItemClick={onItemClick}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
type WeekItemPosition = {
    item: CalendarItem;
    top: number;
    height: number;
    column: number;
    columnCount: number;
};

// Group intersecting visible time ranges, then reuse the first free column.
// Use rendered bounds so short events with a minimum height cannot cover one another.
function positionWeekItems(
    items: CalendarItem[],
    height: number,
): WeekItemPosition[] {
    const positioned = items
        .map((item) => {
            const start = parseCalendarDate(item.start);
            const end = item.end
                ? parseCalendarDate(item.end)
                : addMinutes(start, 50);
            const startMinutes =
                (start.getHours() - WEEK_START_HOUR) * 60 + start.getMinutes();
            const durationMinutes = Math.max(
                30,
                (end.getTime() - start.getTime()) / 60000,
            );
            const top = Math.max(0, (startMinutes / 60) * HOUR_HEIGHT);
            const itemHeight = Math.max(
                34,
                (durationMinutes / 60) * HOUR_HEIGHT,
            );
            return {
                item,
                top,
                height: Math.max(0, Math.min(itemHeight, height - top)),
                column: 0,
                columnCount: 1,
            };
        })
        .sort(
            (first, second) =>
                first.top - second.top ||
                second.height - first.height ||
                first.item.id.localeCompare(second.item.id),
        );
    let group: WeekItemPosition[] = [];
    let groupEnd = -Infinity;
    let columnEnds: number[] = [];
    function finishGroup() {
        for (const position of group) position.columnCount = columnEnds.length;
        group = [];
        columnEnds = [];
        groupEnd = -Infinity;
    }
    for (const position of positioned) {
        if (group.length && position.top >= groupEnd) finishGroup();
        let column = columnEnds.findIndex((end) => end <= position.top);
        if (column < 0) column = columnEnds.length;
        const bottom = position.top + position.height;
        position.column = column;
        columnEnds[column] = bottom;
        group.push(position);
        groupEnd = Math.max(groupEnd, bottom);
    }
    finishGroup();
    return positioned;
}

function WeekDayColumn({
    items,
    currentProjectId,
    height,
    onItemClick,
}: {
    items: CalendarItem[];
    currentProjectId: string;
    height: number;
    onItemClick: (item: CalendarItem) => void;
}) {
    const positionedItems = positionWeekItems(items, height);
    return (
        <div
            className="relative border-l border-border/30 bg-card"
            style={{ height }}
        >
            {WEEK_HOURS.map((hour, index) => (
                <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-border/25"
                    style={{ top: index * HOUR_HEIGHT }}
                />
            ))}
            {positionedItems.map(
                ({ item, top, height: itemHeight, column, columnCount }) => (
                    <div
                        key={item.id}
                        className="absolute z-10 overflow-hidden"
                        style={{
                            top,
                            height: itemHeight,
                            left: `calc(${(column / columnCount) * 100}% + 4px)`,
                            width: `calc(${100 / columnCount}% - 8px)`,
                        }}
                    >
                        <CalendarItemButton
                            item={item}
                            current={
                                Boolean(item.projectId) &&
                                String(item.projectId) ===
                                    String(currentProjectId)
                            }
                            fill
                            onClick={() => onItemClick(item)}
                        />
                    </div>
                ),
            )}
        </div>
    );
}
function CalendarItemButton({
    item,
    current,
    compact = false,
    fill = false,
    onClick,
}: {
    item: CalendarItem;
    current: boolean;
    compact?: boolean;
    fill?: boolean;
    onClick: () => void;
}) {
    const timed = !item.allDay;
    const taskStatus =
        item.type === "task" ? getCalendarTaskStatus(item) : null;
    const appearance = getCalendarEntryAppearance(item, current);
    const Icon =
        item.type === "plan-block"
            ? Clock3Icon
            : item.type === "project-due"
              ? Clock3Icon
              : item.type === "project-start"
                ? CalendarDaysIcon
                : taskStatus === "overdue"
                  ? AlertTriangleIcon
                  : taskStatus === "complete"
                    ? CheckCircle2Icon
                    : taskStatus === "pending"
                      ? CircleDashedIcon
                      : CircleDotIcon;
    return (
        <motion.button
            layout
            type="button"
            onClick={onClick}
            transition={{ duration: 0.15 }}
            title={`${item.title} · ${item.projectTitle}${isCancelledCalendarTask(item) ? " · Project cancelled" : ""}`}
            className={`group/event block w-full min-w-0 rounded-md border text-left transition-[background-color,border-color] duration-150 ${controlFocus} ${fill ? "h-full" : ""} ${compact ? "px-2 py-1.5" : "px-2.5 py-2"} ${appearance.surface}`}
        >
            <div className="flex min-w-0 items-center gap-1.5">
                <Icon
                    size={11}
                    aria-hidden="true"
                    className="shrink-0 opacity-80"
                />
                <span
                    className={`truncate font-medium ${compact ? "text-[11px]" : "text-xs"} ${isCancelledCalendarTask(item) ? "line-through decoration-status-overdue decoration-2" : ""}`}
                >
                    {timed && (
                        <span className="mr-1 opacity-75">
                            {formatTime(parseCalendarDate(item.start))}
                        </span>
                    )}
                    {item.title}
                </span>
            </div>
            {isCancelledCalendarTask(item) && (
                <span className="sr-only">Project cancelled</span>
            )}
            {!compact && (
                <p className={`mt-1 truncate text-[11px] ${appearance.meta}`}>
                    {item.type === "plan-block"
                        ? item.projectTitle || "My plan"
                        : item.relationship === "allocat"
                          ? `Client work · ${item.projectTitle}`
                          : `My project · ${item.projectTitle}`}
                </p>
            )}
        </motion.button>
    );
}
// Calendar entries use cancellation styling; details retain the task's own status styling.
function getCalendarEntryAppearance(
    item: CalendarItem,
    current: boolean,
): CalendarItemAppearance {
    if (isCancelledCalendarTask(item))
        return {
            surface:
                "border-status-overdue/15 bg-status-overdue/[0.04] text-status-overdue-foreground hover:border-status-overdue/25 hover:bg-status-overdue/[0.07] dark:bg-status-overdue/[0.06] dark:hover:bg-status-overdue/[0.09]",
            meta: "text-status-overdue-foreground/80",
        };
    return getCalendarItemAppearance(item, current);
}

function getCalendarItemAppearance(
    item: CalendarItem,
    current: boolean,
): CalendarItemAppearance {
    if (item.type === "plan-block")
        return {
            surface:
                "border-border/25 bg-surface-2/60 text-foreground/80 hover:border-border/35 hover:bg-surface-2/80 dark:bg-surface-2/55 dark:hover:bg-surface-2/75",
            meta: "text-muted-foreground",
        };
    if (item.type === "task") {
        const status = getCalendarTaskStatus(item);
        if (status === "overdue")
            return {
                surface:
                    "border-status-overdue/15 bg-status-overdue/[0.06] text-status-overdue-foreground hover:border-status-overdue/25 hover:bg-status-overdue/[0.09] dark:bg-status-overdue/[0.08] dark:hover:bg-status-overdue/[0.11]",
                meta: "text-status-overdue-foreground/80",
            };
        if (status === "pending")
            return {
                surface:
                    "border-status-pending/15 bg-status-pending/[0.06] text-status-pending-foreground hover:border-status-pending/25 hover:bg-status-pending/[0.09] dark:bg-status-pending/[0.07] dark:hover:bg-status-pending/[0.10]",
                meta: "text-status-pending-foreground/80",
            };
        if (status === "complete")
            return {
                surface:
                    "border-status-complete/15 bg-status-complete/[0.055] text-status-complete-foreground hover:border-status-complete/25 hover:bg-status-complete/[0.085] dark:bg-status-complete/[0.07] dark:hover:bg-status-complete/[0.10]",
                meta: "text-status-complete-foreground/80",
            };
        return {
            surface:
                "border-status-active/15 bg-status-active/[0.055] text-status-active-foreground hover:border-status-active/25 hover:bg-status-active/[0.085] dark:bg-status-active/[0.07] dark:hover:bg-status-active/[0.10]",
            meta: "text-status-active-foreground/80",
        };
    }
    if (current)
        return {
            surface:
                "border-brand-secondary-highlight/15 bg-brand-secondary-highlight/[0.05] text-brand-secondary-highlight hover:border-brand-secondary-highlight/25 hover:bg-brand-secondary-highlight/[0.08] dark:border-border/35 dark:bg-surface-3/40 dark:text-secondary dark:hover:border-border/45 dark:hover:bg-surface-3/60",
            meta: "text-brand-secondary-highlight/80 dark:text-secondary/75",
        };
    if (item.relationship === "allocat")
        return {
            surface:
                "border-brand-secondary-highlight/10 bg-surface-teal/65 text-foreground/80 hover:border-brand-secondary-highlight/15 hover:bg-surface-teal dark:border-brand-secondary-highlight/10 dark:bg-brand-secondary-highlight/[0.045] dark:hover:border-brand-secondary-highlight/15 dark:hover:bg-brand-secondary-highlight/[0.07]",
            meta: "text-muted-foreground",
        };
    return {
        surface:
            "border-border/25 bg-surface-2/55 text-foreground/80 hover:border-border/35 hover:bg-surface-2/75 dark:bg-surface-2/50 dark:hover:bg-surface-2/70",
        meta: "text-muted-foreground",
    };
}
function isCancelledProjectStatus(status?: string | null) {
    const value = normalizeCalendarStatus(status ?? undefined);
    return value === "cancelled" || value === "canceled";
}
function calendarProjectStatus(
    projects: Project[],
    projectId?: string | null,
    eventStatus?: string | null,
) {
    const projectStatus = projects.find(
        (project) => String(project.id) === String(projectId),
    )?.status;
    // A known cancellation wins over an older active project/event snapshot.
    if (
        isCancelledProjectStatus(projectStatus) ||
        isCancelledProjectStatus(eventStatus)
    )
        return "cancelled";
    return projectStatus ?? eventStatus;
}
function isCancelledCalendarTask(item: CalendarItem) {
    return item.type === "task" && isCancelledProjectStatus(item.projectStatus);
}

function getCalendarTaskStatus(item: CalendarItem): CalendarTaskStatus {
    const normalized = normalizeCalendarStatus(item.status);
    if (
        normalized === "complete" ||
        normalized === "completed" ||
        normalized === "closed"
    )
        return "complete";
    if (normalized === "overdue" || isIncompleteCalendarTaskOverdue(item))
        return "overdue";
    if (normalized === "active" || normalized === "inprogress") return "active";
    return "pending";
}
function isIncompleteCalendarTaskOverdue(item: CalendarItem) {
    if (item.type !== "task") return false;
    const normalized = normalizeCalendarStatus(item.status);
    if (
        normalized === "complete" ||
        normalized === "completed" ||
        normalized === "closed"
    )
        return false;
    const dueDate = parseCalendarDate(item.start);
    if (Number.isNaN(dueDate.getTime())) return false;
    const now = new Date();
    if (item.allDay)
        return startOfDay(dueDate).getTime() < startOfDay(now).getTime();
    return dueDate.getTime() < now.getTime();
}
function normalizeCalendarStatus(status?: string) {
    return String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]/g, "");
}

function CalendarDetailPanel({
    item,
    current,
    isFocused,
    onClose,
    onOpenProject,
    onToggleFocus,
    onEdit,
    onDelete,
    onEditTaskTime,
    focusBusy,
    focusPendingAction,
    taskTimePermission,
}: {
    taskTimePermission?: boolean;
    focusBusy: boolean;
    focusPendingAction?: FocusAction;
    item: CalendarItem;
    current: boolean;
    isFocused: boolean;
    onClose: () => void;
    onOpenProject: () => void;
    onToggleFocus?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onEditTaskTime?: () => void;
}) {
    const start = parseCalendarDate(item.start);
    const end = item.end ? parseCalendarDate(item.end) : null;
    const appearance = getCalendarItemAppearance(item, current);
    const canEditTaskTime = taskTimePermission === true;
    return (
        <>
            <motion.button
                type="button"
                aria-label="Close calendar details"
                className="fixed inset-0 z-[70] bg-foreground/20 backdrop-blur-[1px] dark:bg-background/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.aside
                initial={{ x: 32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 32, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-y-0 right-0 z-[80] w-full max-w-md overflow-y-auto overscroll-contain border-l border-border/35 bg-card p-5 [scrollbar-width:none] sm:p-6 [&::-webkit-scrollbar]:hidden"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[11px] font-medium text-muted-foreground">
                            {item.type === "plan-block"
                                ? "My plan"
                                : item.relationship === "allocat"
                                  ? "Client work"
                                  : "Project work"}
                        </p>
                        <h2 className="mt-2 break-words text-xl font-medium tracking-[-0.025em] text-foreground">
                            {item.title}
                        </h2>
                        {item.type !== "plan-block" && (
                            <span
                                className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium ${appearance.surface}`}
                            >
                                {getCalendarTaskStatusIcon(item)}
                                {formatStatus(getDisplayCalendarStatus(item))}
                            </span>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close details"
                        className={`h-9 w-9 shrink-0 rounded-lg shadow-none ${ghostActionButton}`}
                    >
                        <XIcon size={16} aria-hidden="true" />
                    </Button>
                </div>
                {isCancelledCalendarTask(item) && (
                    <p
                        role="status"
                        className="mt-5 flex items-start gap-2 rounded-lg border border-border/25 bg-surface-2/40 px-3 py-3 text-xs leading-6 text-muted-foreground"
                    >
                        <BanIcon
                            size={14}
                            aria-hidden="true"
                            className="mt-1 shrink-0"
                        />
                        <span>
                            <span className="block font-medium text-foreground/85">
                                Project cancelled
                            </span>
                            This task remains available for project history.
                        </span>
                    </p>
                )}
                <div className="mt-6 space-y-5">
                    <DetailRow
                        label="Project"
                        value={item.projectTitle || "Personal planning"}
                    />
                    {isCancelledCalendarTask(item) && (
                        <DetailRow label="Project status" value="Cancelled" />
                    )}
                    <DetailRow
                        label="When"
                        value={formatItemTimeRange(start, end, item.allDay)}
                    />
                    {item.type !== "plan-block" && (
                        <DetailRow
                            label="Status"
                            value={formatStatus(getDisplayCalendarStatus(item))}
                        />
                    )}
                    <DetailRow
                        label="Timing"
                        value={getDeadlineIntelligence(item)}
                    />
                    {(item.description || item.notes) && (
                        <div>
                            <p className="text-[11px] font-medium text-muted-foreground">
                                Notes
                            </p>
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/80">
                                {item.notes || item.description}
                            </p>
                        </div>
                    )}
                </div>
                <div className="mt-8 space-y-2 border-t border-border/25 pt-5">
                    {onToggleFocus && (
                        <Button
                            type="button"
                            variant={isFocused ? "outline" : "default"}
                            onClick={onToggleFocus}
                            disabled={focusBusy}
                            aria-busy={Boolean(focusPendingAction)}
                            className={`h-10 w-full justify-start rounded-lg text-xs font-medium shadow-none ${isFocused ? secondaryActionButton : primaryActionButton}`}
                        >
                            {focusPendingAction ? (
                                <LoaderCircleIcon
                                    size={13}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            ) : (
                                <StarIcon size={13} aria-hidden="true" />
                            )}
                            {focusPendingAction === "add"
                                ? "Adding to focus…"
                                : focusPendingAction === "remove"
                                  ? "Removing from focus…"
                                  : isFocused
                                    ? "Remove from weekly focus"
                                    : "Add to weekly focus"}
                        </Button>
                    )}
                    {onEditTaskTime && taskTimePermission !== false && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onEditTaskTime}
                            disabled={!canEditTaskTime}
                            aria-busy={!canEditTaskTime}
                            className={`h-10 w-full justify-start rounded-lg text-xs font-medium shadow-none ${secondaryActionButton}`}
                        >
                            {canEditTaskTime ? (
                                <Clock3Icon size={13} aria-hidden="true" />
                            ) : (
                                <LoaderCircleIcon
                                    size={13}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            )}
                            {canEditTaskTime
                                ? "Edit due date & time"
                                : "Checking access…"}
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onEdit}
                            className={`h-10 w-full justify-start rounded-lg text-xs font-medium shadow-none ${secondaryActionButton}`}
                        >
                            <PencilIcon size={13} aria-hidden="true" />
                            Reschedule or edit
                        </Button>
                    )}
                    {item.projectId && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onOpenProject}
                            className={`h-10 w-full justify-start rounded-lg text-xs font-medium shadow-none ${secondaryActionButton}`}
                        >
                            <FolderOpenIcon size={13} aria-hidden="true" />
                            Open project
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onDelete}
                            className="h-10 w-full justify-start rounded-lg text-xs font-medium text-status-overdue-foreground shadow-none hover:bg-status-overdue/[0.06] hover:text-status-overdue-foreground"
                        >
                            <Trash2Icon size={13} aria-hidden="true" />
                            Delete planning block
                        </Button>
                    )}
                </div>
            </motion.aside>
        </>
    );
}
function getCalendarTaskStatusIcon(item: CalendarItem) {
    if (item.type !== "task") return null;
    const status = getCalendarTaskStatus(item);
    if (status === "overdue") return <AlertTriangleIcon size={11} />;
    if (status === "complete") return <CheckCircle2Icon size={11} />;
    if (status === "active") return <CircleDotIcon size={11} />;
    return <CircleDashedIcon size={11} />;
}
function getDisplayCalendarStatus(item: CalendarItem) {
    if (item.type === "task" && getCalendarTaskStatus(item) === "overdue")
        return "Overdue";
    return item.status;
}
function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[11px] font-medium text-muted-foreground">
                {label}
            </p>
            <p className="mt-1.5 text-sm text-foreground/85">{value}</p>
        </div>
    );
}

function PlanningBlockEditor({
    projects,
    block,
    defaultDate,
    saving,
    onClose,
    onSave,
}: {
    projects: Project[];
    block: CalendarPlanningBlock | null;
    defaultDate: string;
    saving: boolean;
    onClose: () => void;
    onSave: (payload: PlanningBlockPayload) => Promise<void>;
}) {
    const initialStart = block ? parseCalendarDate(block.startAt) : null;
    const initialEnd = block ? parseCalendarDate(block.endAt) : null;
    const [title, setTitle] = useState(block?.title ?? "");
    const [notes, setNotes] = useState(block?.notes ?? "");
    const [selectedProjectId, setSelectedProjectId] = useState(
        block?.projectId ?? "",
    );
    const [date, setDate] = useState(
        initialStart ? toDateKey(initialStart) : defaultDate,
    );
    const [startTime, setStartTime] = useState(
        initialStart ? toTimeInput(initialStart) : "09:00",
    );
    const [endTime, setEndTime] = useState(
        initialEnd ? toTimeInput(initialEnd) : "10:00",
    );
    const [formError, setFormError] = useState<string | null>(null);
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setFormError(null);
        const cleanTitle = title.trim();
        if (!cleanTitle) {
            setFormError("Give this planning block a title.");
            return;
        }
        const startAt = localDateTimeToIso(date, startTime);
        const endAt = localDateTimeToIso(date, endTime);
        if (new Date(endAt) <= new Date(startAt)) {
            setFormError("End time must be after the start time.");
            return;
        }
        try {
            await onSave({
                projectId: selectedProjectId || null,
                taskId: null,
                title: cleanTitle,
                notes: notes.trim() || null,
                startAt,
                endAt,
            });
        } catch (saveError) {
            setFormError(
                saveError instanceof Error
                    ? saveError.message
                    : "The planning block could not be saved.",
            );
        }
    }
    return (
        <>
            <motion.button
                type="button"
                aria-label="Close planning editor"
                className="fixed inset-0 z-[90] bg-foreground/25 backdrop-blur-[1px] dark:bg-background/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                data-calendar-editor="planning"
                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.99 }}
                transition={{ duration: 0.18 }}
                className="fixed left-1/2 top-1/2 z-[100] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-xl border border-border/35 bg-card p-5 text-card-foreground shadow-none [scrollbar-width:none] sm:p-6 [&::-webkit-scrollbar]:hidden"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-medium text-muted-foreground">
                            Personal planning
                        </p>
                        <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-foreground">
                            {block ? "Edit planning block" : "Plan time"}
                        </h2>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close editor"
                        className={`h-9 w-9 rounded-lg shadow-none ${ghostActionButton}`}
                    >
                        <XIcon size={16} aria-hidden="true" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <CalendarField label="Title">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            maxLength={180}
                            placeholder="e.g. Homepage concepts"
                            className={`h-10 w-full rounded-lg px-3 text-sm placeholder:text-muted-foreground/60 ${formControlSurface}`}
                        />
                    </CalendarField>
                    <CalendarField label="Project">
                        <select
                            value={selectedProjectId}
                            onChange={(event) =>
                                setSelectedProjectId(event.target.value)
                            }
                            className={`h-10 w-full rounded-lg px-3 text-sm ${formControlSurface}`}
                        >
                            <option value="">Personal / no project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </CalendarField>
                    <fieldset disabled={saving} className={calendarDateField}>
                        <Calendar28
                            id="planning-block-date"
                            label="Date"
                            value={date ? new Date(`${date}T00:00:00`) : null}
                            onChange={(value) => {
                                if (!saving)
                                    setDate(value ? toDateKey(value) : "");
                            }}
                            className={`!h-10 !min-h-10 w-full rounded-lg text-sm ${formControlSurface}`}
                        />
                    </fieldset>
                    <div className="grid grid-cols-2 items-end gap-3">
                        <div className="grid min-w-0 gap-1.5">
                            <span
                                id="planning-start-label"
                                className={calendarFieldLabel}
                            >
                                Start
                            </span>
                            <CalendarTimeSelector
                                id="planning-start"
                                labelledBy="planning-start-label"
                                value={startTime}
                                onChange={setStartTime}
                                disabled={saving}
                            />
                        </div>
                        <div className="grid min-w-0 gap-1.5">
                            <span
                                id="planning-end-label"
                                className={calendarFieldLabel}
                            >
                                End
                            </span>
                            <CalendarTimeSelector
                                id="planning-end"
                                labelledBy="planning-end-label"
                                value={endTime}
                                onChange={setEndTime}
                                disabled={saving}
                            />
                        </div>
                    </div>
                    <CalendarField label="Notes">
                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            maxLength={1200}
                            rows={4}
                            placeholder="Optional context for yourself"
                            className={`w-full resize-none rounded-lg px-3 py-2.5 text-sm leading-6 placeholder:text-muted-foreground/60 ${formControlSurface}`}
                        />
                    </CalendarField>
                    {formError && (
                        <p className="rounded-lg bg-status-overdue/[0.06] px-3 py-2 text-xs font-medium text-status-overdue-foreground">
                            {formError}
                        </p>
                    )}
                    <div className="flex justify-end gap-2 border-t border-border/25 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={saving}
                            className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${ghostActionButton}`}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${primaryActionButton}`}
                        >
                            {saving && (
                                <LoaderCircleIcon
                                    size={13}
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            )}
                            {block ? "Save changes" : "Add to plan"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </>
    );
}
function CalendarTimeSelector({
    id,
    labelledBy,
    value,
    onChange,
    disabled = false,
}: {
    id: string;
    labelledBy: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    const [hour, minute] = value.split(":");
    return (
        <div
            id={id}
            role="group"
            aria-labelledby={labelledBy}
            className={`flex h-10 min-w-0 items-center gap-0.5 rounded-lg border border-border/35 bg-surface-2/35 px-2 text-sm text-foreground dark:bg-surface-2/40 ${disabled ? "opacity-60" : ""}`}
        >
            <Clock3Icon
                size={13}
                aria-hidden="true"
                className="mr-1 shrink-0 text-muted-foreground"
            />
            {(
                [
                    { part: "Hour", selected: hour, count: 24 },
                    { part: "Minute", selected: minute, count: 60 },
                ] as const
            ).map(({ part, selected, count }, index) => (
                <span
                    key={part}
                    className="flex min-w-0 flex-1 items-center gap-0.5"
                >
                    {index === 1 && (
                        <span
                            aria-hidden="true"
                            className="mr-0.5 text-muted-foreground"
                        >
                            :
                        </span>
                    )}
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                disabled={disabled}
                                aria-label={`${part}: ${selected}`}
                                className={`flex h-8 min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1 font-medium tabular-nums text-foreground transition-colors hover:bg-surface-2/70 disabled:pointer-events-none dark:hover:bg-surface-3/45 ${controlFocus}`}
                            >
                                <span>{selected}</span>
                                <ChevronDownIcon
                                    size={10}
                                    aria-hidden="true"
                                    className="shrink-0 text-muted-foreground"
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            sideOffset={6}
                            collisionPadding={12}
                            className={`!z-[110] max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border/35 bg-popover p-1 text-popover-foreground shadow-none w-36`}
                        >
                            <DropdownMenuLabel className="px-2.5 py-2 text-[11px] font-medium text-muted-foreground">
                                {part}
                            </DropdownMenuLabel>
                            <TimeOptionsList>
                                {Array.from({ length: count }, (_, number) =>
                                    String(number).padStart(2, "0"),
                                ).map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        role="menuitemradio"
                                        aria-checked={selected === option}
                                        onSelect={() => {
                                            if (!disabled)
                                                onChange(
                                                    part === "Hour"
                                                        ? `${option}:${minute}`
                                                        : `${hour}:${option}`,
                                                );
                                        }}
                                        className={`flex min-h-9 items-center justify-between gap-3 rounded-md px-2.5 py-2 text-xs font-medium tabular-nums outline-none focus:bg-surface-2/70 data-[highlighted]:bg-surface-2/70 dark:focus:bg-surface-3/45 dark:data-[highlighted]:bg-surface-3/45 ${selected === option ? "bg-surface-2/50 text-brand-secondary-highlight dark:bg-card dark:text-secondary" : "text-foreground/80"}`}
                                    >
                                        <span>{option}</span>
                                        {selected === option && (
                                            <CheckIcon
                                                size={10}
                                                aria-hidden="true"
                                                className="shrink-0"
                                            />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </TimeOptionsList>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </span>
            ))}
        </div>
    );
}

function TimeOptionsList({ children }: { children: ReactNode }) {
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        function scrollWithWheel(event: WheelEvent) {
            if (event.ctrlKey || !event.deltaY || !list) return;
            const limit = Math.max(0, list.scrollHeight - list.clientHeight);
            if (!limit) return;
            const unit =
                event.deltaMode === 1
                    ? 16
                    : event.deltaMode === 2
                      ? list.clientHeight
                      : 1;
            list.scrollTop = Math.max(
                0,
                Math.min(limit, list.scrollTop + event.deltaY * unit),
            );
            event.preventDefault();
            event.stopPropagation();
        }
        list.addEventListener("wheel", scrollWithWheel, { passive: false });
        return () => list.removeEventListener("wheel", scrollWithWheel);
    }, []);
    return (
        <div
            ref={listRef}
            data-time-options
            className="max-h-[min(16rem,calc(var(--radix-dropdown-menu-content-available-height)-3rem))] overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:!block [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/65"
            style={{ scrollbarColor: "var(--border) transparent" }}
        >
            {children}
        </div>
    );
}

function taskDueTimeToIso(date: string, time: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time))
        return null;
    const value = new Date(`${date}T${time}:00`);
    if (
        !Number.isFinite(value.getTime()) ||
        toDateKey(value) !== date ||
        toTimeInput(value) !== time
    )
        return null;
    return value.toISOString();
}

function TaskDueTimeEditor({
    item,
    saving,
    onClose,
    onSave,
}: {
    item: CalendarItem;
    saving: boolean;
    onClose: () => void;
    onSave: (dueDate: string) => Promise<void>;
}) {
    const id = useId();
    const initial = parseCalendarDate(item.start);
    const [date, setDate] = useState(() => toDateKey(initial));
    const [time, setTime] = useState(() => toTimeInput(initial));
    const [formError, setFormError] = useState<string | null>(null);
    const saveLock = useRef(false);
    const mounted = useRef(false);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (saving || saveLock.current) return;
        setFormError(null);
        const dueDate = taskDueTimeToIso(date, time);
        if (!dueDate) {
            setFormError("Choose a valid due date and time.");
            return;
        }
        saveLock.current = true;
        try {
            await onSave(dueDate);
        } catch (error) {
            if (mounted.current)
                setFormError(
                    error instanceof Error
                        ? error.message
                        : "The task time could not be updated.",
                );
        } finally {
            saveLock.current = false;
        }
    }
    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open && !saving && !saveLock.current) onClose();
            }}
        >
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-[90] bg-foreground/25 backdrop-blur-[1px] dark:bg-background/60" />
                <DialogPrimitiveContent
                    data-calendar-editor="task-time"
                    className="fixed left-1/2 top-1/2 z-[100] grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto overscroll-contain rounded-xl border border-border/35 bg-card p-6 text-card-foreground shadow-none outline-none"
                >
                    <DialogHeader className="pr-7 text-left">
                        <DialogTitle className="text-xl font-medium tracking-[-0.025em]">
                            Edit task time
                        </DialogTitle>
                        <DialogDescription className="text-xs leading-6">
                            Updates this task’s due date and time across the
                            project.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="break-words text-sm font-medium text-foreground">
                        {item.title}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid items-end gap-4 sm:grid-cols-2">
                            <fieldset
                                disabled={saving}
                                className={calendarDateField}
                            >
                                <Calendar28
                                    id={`${id}-date`}
                                    label="Due date"
                                    value={
                                        date
                                            ? new Date(`${date}T00:00:00`)
                                            : null
                                    }
                                    onChange={(value) => {
                                        if (!saving)
                                            setDate(
                                                value ? toDateKey(value) : "",
                                            );
                                    }}
                                    className={`!h-10 !min-h-10 w-full rounded-lg text-sm ${formControlSurface}`}
                                />
                            </fieldset>
                            <div className="grid min-w-0 gap-1.5">
                                <span
                                    id={`${id}-time-label`}
                                    className={calendarFieldLabel}
                                >
                                    Due time
                                </span>
                                <CalendarTimeSelector
                                    id={`${id}-time`}
                                    labelledBy={`${id}-time-label`}
                                    value={time}
                                    onChange={setTime}
                                    disabled={saving}
                                />
                            </div>
                        </div>
                        <p className="text-[11px] leading-5 text-muted-foreground">
                            Times use your device’s timezone.
                        </p>
                        {formError && (
                            <p
                                role="alert"
                                className="rounded-lg bg-status-overdue/[0.06] px-3 py-2 text-xs leading-6 text-status-overdue-foreground"
                            >
                                {formError}
                            </p>
                        )}
                        <DialogFooter className="border-t border-border/25 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    if (!saveLock.current) onClose();
                                }}
                                disabled={saving}
                                className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${ghostActionButton}`}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${primaryActionButton}`}
                            >
                                {saving && (
                                    <LoaderCircleIcon
                                        size={13}
                                        aria-hidden="true"
                                        className="animate-spin"
                                    />
                                )}
                                Save task time
                            </Button>
                        </DialogFooter>
                    </form>
                    <DialogClose
                        disabled={saving}
                        aria-label="Close task time editor"
                        className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50 ${ghostActionButton} ${controlFocus}`}
                    >
                        <XIcon size={15} aria-hidden="true" />
                    </DialogClose>
                </DialogPrimitiveContent>
            </DialogPortal>
        </Dialog>
    );
}

function CalendarField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-foreground/80">
                {label}
            </span>
            {children}
        </label>
    );
}
function CalendarLegend({ showClientWork }: { showClientWork: boolean }) {
    return (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            <LegendItem
                surface="bg-brand-secondary-highlight dark:bg-secondary"
                label="Current project"
            />
            <LegendItem surface="bg-status-active" label="Active task" />
            <LegendItem surface="bg-status-pending" label="Pending task" />
            <LegendItem surface="bg-status-complete" label="Completed task" />
            <LegendItem surface="bg-status-overdue" label="Overdue task" />
            {showClientWork && (
                <LegendItem
                    surface="bg-brand-secondary-highlight/70"
                    label="Client work"
                />
            )}
            <LegendItem surface="bg-muted-foreground/50" label="My plan" />
        </div>
    );
}
function LegendItem({ surface, label }: { surface: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-2">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${surface}`} />
            {label}
        </span>
    );
}
function CalendarLoading() {
    return (
        <div
            className={`flex min-h-[520px] items-center justify-center rounded-xl border ${calendarShell}`}
        >
            <div className="text-center">
                <LoaderCircleIcon
                    size={20}
                    aria-hidden="true"
                    className="mx-auto animate-spin text-muted-foreground"
                />
                <p className="mt-3 text-xs text-muted-foreground">
                    Loading calendar
                </p>
            </div>
        </div>
    );
}
function CalendarError({
    message,
    onRetry,
    onDismiss,
}: {
    message: string;
    onRetry: () => void;
    onDismiss: () => void;
}) {
    return (
        <div
            className={`flex min-h-[420px] items-center justify-center rounded-xl border px-5 ${calendarShell}`}
        >
            <div className="max-w-sm text-center">
                <span
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${calendarIconSurface}`}
                >
                    <RefreshCwIcon size={17} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-medium tracking-[-0.015em] text-foreground">
                    Could not load calendar
                </h2>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {message}
                </p>
                <div className="mt-5 flex justify-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onDismiss}
                        className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${ghostActionButton}`}
                    >
                        Dismiss
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onRetry}
                        className={`h-10 rounded-lg px-4 text-xs font-medium shadow-none ${secondaryActionButton}`}
                    >
                        <RefreshCwIcon size={13} aria-hidden="true" />
                        Try again
                    </Button>
                </div>
            </div>
        </div>
    );
}

function buildPlanningInsights(
    weekStart: Date,
    weekEnd: Date,
    items: CalendarItem[],
    planningBlocks: CalendarPlanningBlock[],
): PlanningInsights {
    const blocks = planningBlocks
        .map((block) => ({
            ...block,
            startDate: parseCalendarDate(block.startAt),
            endDate: parseCalendarDate(block.endAt),
        }))
        .filter(
            (block) => block.endDate > weekStart && block.startDate < weekEnd,
        );
    const plannedHours = blocks.reduce((total, block) => {
        const start = new Date(
            Math.max(block.startDate.getTime(), weekStart.getTime()),
        );
        const end = new Date(
            Math.min(block.endDate.getTime(), weekEnd.getTime()),
        );
        return total + Math.max(0, (end.getTime() - start.getTime()) / 3600000);
    }, 0);
    const ratio = plannedHours / WEEKLY_CAPACITY_HOURS;
    const workloadLabel: PlanningInsights["workloadLabel"] =
        ratio > 1
            ? "Overloaded"
            : ratio >= 0.8
              ? "Busy"
              : ratio >= 0.5
                ? "Balanced"
                : "Light";
    const alerts: string[] = [];
    const overlappingPairs = findOverlappingBlocks(blocks);
    if (overlappingPairs > 0)
        alerts.push(
            `${overlappingPairs} planning ${overlappingPairs === 1 ? "overlap" : "overlaps"}`,
        );
    const dayStats = Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        const hours = blocks
            .filter((block) => isSameDay(block.startDate, date))
            .reduce(
                (total, block) =>
                    total +
                    Math.max(
                        0,
                        (block.endDate.getTime() - block.startDate.getTime()) /
                            3600000,
                    ),
                0,
            );
        const deadlineCount = items.filter(
            (item) =>
                (item.type === "task" || item.type === "project-due") &&
                isSameDay(parseCalendarDate(item.start), date),
        ).length;
        return { date, hours, deadlineCount };
    });
    const busiestDay = dayStats.find(
        (day) => day.hours > 8 || day.deadlineCount >= 3,
    );
    if (busiestDay) alerts.push(`${formatWeekday(busiestDay.date)} looks busy`);
    if (plannedHours > WEEKLY_CAPACITY_HOURS)
        alerts.push(
            `${formatHours(plannedHours - WEEKLY_CAPACITY_HOURS)}h over weekly capacity`,
        );
    const deadlineCount = items.filter((item) => {
        if (item.type !== "task" && item.type !== "project-due") return false;
        const start = parseCalendarDate(item.start);
        return start >= weekStart && start < weekEnd;
    }).length;
    return {
        plannedHours,
        capacityHours: WEEKLY_CAPACITY_HOURS,
        workloadLabel,
        deadlineCount,
        alerts,
    };
}
function findOverlappingBlocks(
    blocks: Array<{ startDate: Date; endDate: Date }>,
) {
    let overlaps = 0;
    const sorted = [...blocks].sort(
        (first, second) =>
            first.startDate.getTime() - second.startDate.getTime(),
    );
    for (let firstIndex = 0; firstIndex < sorted.length; firstIndex += 1) {
        for (
            let secondIndex = firstIndex + 1;
            secondIndex < sorted.length;
            secondIndex += 1
        ) {
            const first = sorted[firstIndex];
            const second = sorted[secondIndex];
            if (second.startDate >= first.endDate) break;
            if (
                second.startDate < first.endDate &&
                second.endDate > first.startDate
            )
                overlaps += 1;
        }
    }
    return overlaps;
}
function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function startOfWeek(date: Date) {
    const result = startOfDay(date);
    const day = result.getDay();
    const difference = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + difference);
    return result;
}
function addDays(date: Date, amount: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
}
function addMonths(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
function addMinutes(date: Date, amount: number) {
    return new Date(date.getTime() + amount * 60000);
}
function isSameDay(first: Date, second: Date) {
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    );
}
function parseCalendarDate(value: string) {
    return new Date(value);
}
function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function toTimeInput(date: Date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}
function localDateTimeToIso(date: string, time: string) {
    return new Date(`${date}T${time}:00`).toISOString();
}
function formatCalendarHeading(date: Date, view: CalendarView) {
    if (view === "month")
        return new Intl.DateTimeFormat("en", {
            month: "long",
            year: "numeric",
        }).format(date);
    const start = startOfWeek(date);
    const end = addDays(start, 6);
    const sameMonth =
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear();
    if (sameMonth) {
        const monthYear = new Intl.DateTimeFormat("en", {
            month: "long",
            year: "numeric",
        }).format(start);
        return `${start.getDate()}-${end.getDate()} ${monthYear}`;
    }
    const startLabel = new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
    }).format(start);
    const endLabel = new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(end);
    return `${startLabel} - ${endLabel}`;
}
function formatWeekday(date: Date) {
    return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}
function formatHour(hour: number) {
    return new Intl.DateTimeFormat("en", { hour: "numeric" }).format(
        new Date(2026, 0, 1, hour),
    );
}
function formatTime(date: Date) {
    return new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}
function formatUpcomingDate(date: Date) {
    if (isSameDay(date, new Date())) return "Today";
    if (isSameDay(date, addDays(new Date(), 1))) return "Tomorrow";
    return new Intl.DateTimeFormat("en", {
        weekday: "short",
        day: "numeric",
        month: "short",
    }).format(date);
}
function formatHours(value: number) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
function formatStatus(status: string) {
    if (!status) return "Not set";
    return status
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function formatItemTimeRange(start: Date, end: Date | null, allDay: boolean) {
    const date = new Intl.DateTimeFormat("en", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(start);
    if (allDay) return `${date} · All day`;
    if (!end) return `${date} · ${formatTime(start)}`;
    return `${date} · ${formatTime(start)} - ${formatTime(end)}`;
}
function getDeadlineIntelligence(item: CalendarItem) {
    if (item.type === "plan-block")
        return "Personal time reserved on your plan.";
    const eventDate = startOfDay(parseCalendarDate(item.start));
    const today = startOfDay(new Date());
    const days = Math.round((eventDate.getTime() - today.getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days > 1) return `In ${days} days`;
    if (days === -1) return "Overdue by 1 day";
    return `Overdue by ${Math.abs(days)} days`;
}
function compareCalendarItems(first: CalendarItem, second: CalendarItem) {
    if (first.allDay !== second.allDay) return first.allDay ? -1 : 1;
    return (
        parseCalendarDate(first.start).getTime() -
        parseCalendarDate(second.start).getTime()
    );
}
function getAxiosMessage(error: unknown, fallback: string) {
    if (
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
    )
        return error.response.data.message;
    return fallback;
}
