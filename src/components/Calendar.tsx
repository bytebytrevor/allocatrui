import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";

import {
  AlertTriangleIcon,
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

import type { Project } from "@/Types/project";
import type { ProjectWorkspaceContext } from "@/Types/projectWorkspaceContext";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =========================================================
   TYPES
========================================================= */

type CalendarView = "month" | "week";
type CalendarScope = "all" | "mine" | "work";

type CalendarEventType =
  | "project-start"
  | "project-due"
  | "task"
  | "plan-block";

type CalendarRelationship =
  | "owner"
  | "allocat"
  | "planning";

type CalendarTaskStatus =
  | "pending"
  | "active"
  | "complete"
  | "overdue";

type CalendarEvent = {
  id: string;
  type: Exclude<CalendarEventType, "plan-block">;
  projectId: string;
  taskId?: string | null;
  projectTitle: string;
  projectCode?: string | null;
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
  title: string;
  description?: string | null;
  notes?: string | null;
  start: string;
  end?: string | null;
  allDay: boolean;
  status: string;
  relationship: CalendarRelationship;
};

type CalendarRange = {
  start: Date;
  end: Date;
};

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
};

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

type CalendarItemAppearance = {
  surface: string;
  meta: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const WEEK_START_HOUR = 6;
const WEEK_END_HOUR = 23;

const WEEK_HOURS = Array.from(
  { length: WEEK_END_HOUR - WEEK_START_HOUR },
  (_, index) => index + WEEK_START_HOUR,
);

const HOUR_HEIGHT = 64;
const WEEKLY_CAPACITY_HOURS = 40;

/* =========================================================
   PAGE
========================================================= */

function Calendar() {
  const navigate = useNavigate();

  const {
    projects,
    currentProject,
    projectId,
    isAllocat,
  } = useOutletContext<ProjectWorkspaceContext>();

  const [view, setView] = useState<CalendarView>("month");
  const [scope, setScope] = useState<CalendarScope>("all");
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [planningBlocks, setPlanningBlocks] = useState<CalendarPlanningBlock[]>([]);
  const [focusTasks, setFocusTasks] = useState<CalendarFocusTask[]>([]);

  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [editingBlock, setEditingBlock] = useState<CalendarPlanningBlock | null>(null);
  const [planEditorOpen, setPlanEditorOpen] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastAutomaticLoadRef = useRef<string | null>(null);
  const requestVersionRef = useRef(0);

  /* =======================================================
     RANGE
  ======================================================= */

  const range = useMemo<CalendarRange>(() => {
    if (view === "week") {
      const start = startOfWeek(anchorDate);

      return {
        start,
        end: addDays(start, 7),
      };
    }

    const monthStart = startOfMonth(anchorDate);
    const start = startOfWeek(monthStart);

    return {
      start,
      end: addDays(start, 42),
    };
  }, [anchorDate, view]);

  const rangeStartKey = toDateKey(range.start);
  const rangeEndKey = toDateKey(range.end);

  const focusWeekStart = useMemo(
    () => startOfWeek(anchorDate),
    [anchorDate],
  );

  const focusWeekStartKey = toDateKey(focusWeekStart);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const fetchCalendarData = useCallback(
    async (force = false) => {
      const loadKey = [
        rangeStartKey,
        rangeEndKey,
        focusWeekStartKey,
      ].join(":");

      if (
        !force &&
        lastAutomaticLoadRef.current === loadKey
      ) {
        return;
      }

      lastAutomaticLoadRef.current = loadKey;

      const requestVersion = ++requestVersionRef.current;

      try {
        setLoading(true);
        setError(null);

        const [
          eventsResponse,
          blocksResponse,
          focusResponse,
        ] = await Promise.all([
          api.get<CalendarEvent[]>("/calendar", {
            params: {
              start: rangeStartKey,
              end: rangeEndKey,
            },
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

          api.get<CalendarFocusTask[]>(
            "/calendar/focus",
            {
              params: {
                weekStart: focusWeekStartKey,
              },
              withCredentials: true,
            },
          ),
        ]);

        if (
          requestVersion !==
          requestVersionRef.current
        ) {
          return;
        }

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
          Array.isArray(focusResponse.data)
            ? focusResponse.data
            : [],
        );
      } catch (requestError) {
        if (
          requestVersion !==
          requestVersionRef.current
        ) {
          return;
        }

        lastAutomaticLoadRef.current = null;

        console.error(
          "Could not load calendar:",
          requestError,
        );

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
        if (
          requestVersion ===
          requestVersionRef.current
        ) {
          setLoading(false);
        }
      }
    },
    [
      rangeStartKey,
      rangeEndKey,
      focusWeekStartKey,
    ],
  );

  useEffect(() => {
    void fetchCalendarData();
  }, [fetchCalendarData]);

  /* =======================================================
     NORMALIZE ITEMS
  ======================================================= */

  const calendarItems = useMemo<CalendarItem[]>(() => {
    const projectEvents: CalendarItem[] = events.map(event => ({
      ...event,
      source: "event",
      sourceId: event.id,
    }));

    const planItems: CalendarItem[] = planningBlocks.map(block => ({
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

    return [
      ...projectEvents,
      ...planItems,
    ];
  }, [events, planningBlocks]);

  const visibleItems = useMemo(() => {
    return calendarItems.filter(item => {
      if (item.relationship === "planning") {
        return true;
      }

      if (scope === "mine") {
        return item.relationship === "owner";
      }

      if (scope === "work") {
        return item.relationship === "allocat";
      }

      return true;
    });
  }, [calendarItems, scope]);

  /* =======================================================
     MONTH / WEEK DAYS
  ======================================================= */

  const monthDays = useMemo<CalendarDay[]>(() => {
    const currentMonth = anchorDate.getMonth();
    const start = startOfWeek(startOfMonth(anchorDate));
    const today = new Date();

    return Array.from(
      { length: 42 },
      (_, index) => {
        const date = addDays(start, index);

        return {
          date,
          inCurrentMonth: date.getMonth() === currentMonth,
          isToday: isSameDay(date, today),
        };
      },
    );
  }, [anchorDate]);

  const weekDays = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, index) => addDays(focusWeekStart, index),
    );
  }, [focusWeekStart]);

  /* =======================================================
     PLANNING INTELLIGENCE
  ======================================================= */

  const insights = useMemo(
    () =>
      buildPlanningInsights(
        focusWeekStart,
        addDays(focusWeekStart, 7),
        calendarItems,
        planningBlocks,
      ),
    [
      focusWeekStart,
      calendarItems,
      planningBlocks,
    ],
  );

  const upcomingItems = useMemo(() => {
    const now = new Date();

    return calendarItems
      .filter(item => parseCalendarDate(item.start) >= now)
      .sort(compareCalendarItems)
      .slice(0, 4);
  }, [calendarItems]);

  const ownedEventCount = useMemo(
    () =>
      events.filter(
        event => event.relationship === "owner",
      ).length,
    [events],
  );

  const workEventCount = useMemo(
    () =>
      events.filter(
        event => event.relationship === "allocat",
      ).length,
    [events],
  );

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function goPrevious() {
    setAnchorDate(current =>
      view === "month"
        ? addMonths(current, -1)
        : addDays(current, -7),
    );
  }

  function goNext() {
    setAnchorDate(current =>
      view === "month"
        ? addMonths(current, 1)
        : addDays(current, 7),
    );
  }

  function goToday() {
    setAnchorDate(
      startOfDay(new Date()),
    );
  }

  /* =======================================================
     FOCUS ACTIONS
  ======================================================= */

  async function toggleFocus(taskId: string) {
    const focused = focusTasks.some(
      task => task.taskId === taskId,
    );

    try {
      const response = focused
        ? await api.delete<CalendarFocusTask[]>(
            `/calendar/focus/${taskId}`,
            {
              params: {
                weekStart: focusWeekStartKey,
              },
              withCredentials: true,
            },
          )
        : await api.put<CalendarFocusTask[]>(
            `/calendar/focus/${taskId}`,
            null,
            {
              params: {
                weekStart: focusWeekStartKey,
              },
              withCredentials: true,
            },
          );

      setFocusTasks(response.data);
    } catch (requestError) {
      setError(
        getAxiosMessage(
          requestError,
          "The weekly focus could not be updated.",
        ),
      );
    }
  }

  /* =======================================================
     PLANNING BLOCK ACTIONS
  ======================================================= */

  function createPlanningBlock() {
    setEditingBlock(null);
    setPlanEditorOpen(true);
  }

  function editPlanningBlock(item: CalendarItem) {
    if (item.source !== "planning") return;

    const block = planningBlocks.find(
      planningBlock =>
        planningBlock.id === item.sourceId,
    );

    if (!block) return;

    setEditingBlock(block);
    setSelectedItem(null);
    setPlanEditorOpen(true);
  }

  async function savePlanningBlock(
    payload: PlanningBlockPayload,
  ) {
    try {
      setSavingPlan(true);

      if (editingBlock) {
        await api.patch(
          `/calendar/plan-blocks/${editingBlock.id}`,
          payload,
          { withCredentials: true },
        );
      } else {
        await api.post(
          "/calendar/plan-blocks",
          payload,
          { withCredentials: true },
        );
      }

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
      await api.delete(
        `/calendar/plan-blocks/${item.sourceId}`,
        { withCredentials: true },
      );

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

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-w-0">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              "bg-[#DCE7E3] text-[#315E6C]",
              "dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
            ].join(" ")}
          >
            <CalendarDaysIcon size={16} />
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#30383A] sm:text-3xl dark:text-white">
                Calendar
              </h1>

              <span className="hidden h-1 w-1 shrink-0 rounded-full bg-[#829093] sm:block dark:bg-white/20" />

              <span className="hidden max-w-52 truncate text-xs font-medium text-[#768487] sm:block dark:text-white/28">
                {currentProject.title}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-[#788689] dark:text-white/28">
              Plan across your projects and client work.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            className={[
              "h-9 rounded-lg px-3 text-xs font-semibold shadow-none",
              "bg-[#315E6C] text-white hover:bg-[#294F5B] hover:text-white",
              "dark:bg-[#DEDA00] dark:text-[#303030]",
              "dark:hover:bg-[#D4D000] dark:hover:text-[#303030]",
            ].join(" ")}
          >
            <PlusIcon size={13} />
            Plan time
          </Button>

          <CalendarViewSwitch
            view={view}
            onChange={setView}
          />
        </div>
      </div>

      {/* ===================================================
          PERIOD TOOLBAR
      =================================================== */}

      <div className="mt-4 flex flex-col gap-3 border-y border-[#315E6C]/[0.07] py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.055]">
        <div className="flex min-w-0 items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={`${view}-${formatCalendarHeading(
                anchorDate,
                view,
              )}`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.14 }}
              className="truncate text-base font-semibold tracking-[-0.02em] text-[#364447] sm:text-lg dark:text-white"
            >
              {formatCalendarHeading(
                anchorDate,
                view,
              )}
            </motion.h2>
          </AnimatePresence>

          <span className="hidden rounded-full bg-[#E2E9E6] px-2 py-1 text-[0.6rem] font-semibold text-[#738185] md:inline-flex dark:bg-white/[0.045] dark:text-white/28">
            {visibleItems.length}{" "}
            {visibleItems.length === 1
              ? "item"
              : "items"}
          </span>

          <span className="hidden items-center gap-1.5 text-[0.6rem] text-[#768487] lg:inline-flex dark:text-white/27">
            <CircleDotIcon
              size={10}
              className="text-[#315E6C] dark:text-[#DEDA00]"
            />

            {currentProject.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={goToday}
            className={[
              "h-8 rounded-lg px-2.5 text-[0.68rem] font-semibold shadow-none",
              "text-[#708084] hover:bg-[#E4EAE7] hover:text-[#315E6C]",
              "dark:text-white/30 dark:hover:bg-white/[0.045] dark:hover:text-[#DEDA00]",
            ].join(" ")}
          >
            <RotateCcwIcon size={12} />
            Today
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrevious}
            className={[
              "h-8 w-8 rounded-lg shadow-none",
              "text-[#708084] hover:bg-[#E4EAE7] hover:text-[#315E6C]",
              "dark:text-white/30 dark:hover:bg-white/[0.045] dark:hover:text-[#DEDA00]",
            ].join(" ")}
            aria-label="Previous period"
          >
            <ChevronLeftIcon size={15} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            className={[
              "h-8 w-8 rounded-lg shadow-none",
              "text-[#708084] hover:bg-[#E4EAE7] hover:text-[#315E6C]",
              "dark:text-white/30 dark:hover:bg-white/[0.045] dark:hover:text-[#DEDA00]",
            ].join(" ")}
            aria-label="Next period"
          >
            <ChevronRightIcon size={15} />
          </Button>
        </div>
      </div>

      {/* ===================================================
          PLANNING BAR
      =================================================== */}

      <CalendarPlanningBar
        open={planningOpen}
        onToggle={() =>
          setPlanningOpen(
            current => !current,
          )
        }
        insights={insights}
        focusTasks={focusTasks}
        upcomingItems={upcomingItems}
        currentProjectId={projectId}
        onOpenItem={setSelectedItem}
        onOpenProject={task =>
          navigate(
            `/projects/${task.projectId}`,
          )
        }
        onRemoveFocus={taskId =>
          void toggleFocus(taskId)
        }
      />

      {/* ===================================================
          CALENDAR
      =================================================== */}

      <div className="mt-3 min-w-0">
        {loading ? (
          <CalendarLoading />
        ) : error ? (
          <CalendarError
            message={error}
            onRetry={() =>
              void fetchCalendarData(true)
            }
            onDismiss={() =>
              setError(null)
            }
          />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${view}-${rangeStartKey}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                duration: 0.16,
                ease: "easeOut",
              }}
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
        <CalendarLegend
          showClientWork={isAllocat}
        />
      )}

      {/* ===================================================
          DETAIL PANEL
      =================================================== */}

      <AnimatePresence>
        {selectedItem && (
          <CalendarDetailPanel
            item={selectedItem}
            current={
              Boolean(selectedItem.projectId) &&
              String(selectedItem.projectId) === String(projectId)
            }
            isFocused={Boolean(
              selectedItem.taskId &&
                focusTasks.some(
                  task =>
                    task.taskId === selectedItem.taskId,
                ),
            )}
            onClose={() =>
              setSelectedItem(null)
            }
            onOpenProject={() => {
              if (selectedItem.projectId) {
                navigate(
                  `/projects/${selectedItem.projectId}`,
                );
              }
            }}
            onToggleFocus={
              selectedItem.taskId
                ? () =>
                    void toggleFocus(
                      selectedItem.taskId!,
                    )
                : undefined
            }
            onEdit={
              selectedItem.source === "planning"
                ? () =>
                    editPlanningBlock(selectedItem)
                : undefined
            }
            onDelete={
              selectedItem.source === "planning"
                ? () =>
                    void deletePlanningBlock(selectedItem)
                : undefined
            }
          />
        )}
      </AnimatePresence>

      {/* ===================================================
          PLAN EDITOR
      =================================================== */}

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

/* =========================================================
   COMPACT PLANNING BAR
========================================================= */

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
}: {
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
      className={[
        "mt-3 overflow-hidden rounded-lg border",
        "border-[#315E6C]/[0.07] bg-[#EEF2F0]",
        "dark:border-white/[0.06] dark:bg-[#0C1D22]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        className={[
          "flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left",
          "transition-colors hover:bg-[#E7ECE9]",
          "dark:hover:bg-white/[0.025]",
          "sm:px-4",
        ].join(" ")}
      >
        <div className="flex shrink-0 items-center gap-2">
          <StarIcon
            size={12}
            className="text-[#315E6C] dark:text-[#DEDA00]"
          />

          <span className="text-[0.68rem] font-semibold text-[#3C4A4D] dark:text-white/72">
            Week plan
          </span>
        </div>

        <span className="hidden h-3 w-px bg-[#315E6C]/[0.09] sm:block dark:bg-white/[0.07]" />

        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <PlanningPill>
            {formatHours(insights.plannedHours)}h /{" "}
            {insights.capacityHours}h
          </PlanningPill>

          <PlanningPill>
            {insights.workloadLabel}
          </PlanningPill>

          <PlanningPill>
            {focusTasks.length} focus
          </PlanningPill>

          <PlanningPill>
            {insights.deadlineCount}{" "}
            {insights.deadlineCount === 1
              ? "deadline"
              : "deadlines"}
          </PlanningPill>

          {insights.alerts.length > 0 && (
            <span className="hidden items-center gap-1 rounded-full bg-[#AD3A12]/[0.07] px-2 py-1 text-[0.58rem] font-semibold text-[#9F3C1A] lg:inline-flex dark:text-[#D27857]">
              <AlertTriangleIcon size={10} />
              {insights.alerts.length}
            </span>
          )}

          {nextItem && (
            <span className="ml-auto hidden min-w-0 max-w-64 truncate text-[0.62rem] text-[#768487] xl:block dark:text-white/27">
              Next:{" "}
              <span className="font-semibold text-[#465559] dark:text-white/60">
                {nextItem.title}
              </span>
            </span>
          )}
        </div>

        <ChevronDownIcon
          size={14}
          className={[
            "shrink-0 text-[#788689] transition-transform duration-200 dark:text-white/27",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.18,
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#315E6C]/[0.065] p-3 sm:p-4 dark:border-white/[0.055]">
              {insights.alerts.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {insights.alerts.map(alert => (
                    <span
                      key={alert}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5",
                        "bg-[#E2E9E6] text-[0.62rem] font-medium text-[#66777B]",
                        "dark:bg-white/[0.035] dark:text-white/32",
                      ].join(" ")}
                    >
                      <AlertTriangleIcon size={10} />
                      {alert}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid gap-3 xl:grid-cols-2">
                <WeeklyFocusStrip
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

function PlanningPill({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="whitespace-nowrap rounded-full bg-[#DDE6E3] px-2 py-1 text-[0.58rem] font-semibold text-[#68797D] dark:bg-white/[0.045] dark:text-white/30">
      {children}
    </span>
  );
}

/* =========================================================
   WEEKLY FOCUS
========================================================= */

function WeeklyFocusStrip({
  tasks,
  onOpenProject,
  onRemove,
}: {
  tasks: CalendarFocusTask[];
  onOpenProject: (task: CalendarFocusTask) => void;
  onRemove: (taskId: string) => void;
}) {
  return (
    <div
      className={[
        "rounded-lg border px-3 py-3",
        "border-[#315E6C]/[0.07] bg-[#F6F8F6]",
        "dark:border-white/[0.06] dark:bg-[#10262D]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StarIcon
              size={12}
              className="text-[#315E6C] dark:text-[#DEDA00]"
            />

            <p className="text-[0.68rem] font-semibold">
              Weekly focus
            </p>
          </div>

          <p className="mt-0.5 text-[0.6rem] text-[#788689] dark:text-white/27">
            Up to five priorities for this week.
          </p>
        </div>

        <span className="shrink-0 text-[0.6rem] font-semibold tabular-nums text-[#788689] dark:text-white/27">
          {tasks.length}/5
        </span>
      </div>

      {tasks.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tasks.map(task => (
            <div
              key={task.taskId}
              className={[
                "flex min-w-0 items-center gap-2 rounded-md border px-2.5 py-1.5",
                "border-[#315E6C]/[0.07] bg-[#EDF2F0]",
                "dark:border-white/[0.06] dark:bg-white/[0.025]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() =>
                  onOpenProject(task)
                }
                className="min-w-0 text-left"
              >
                <p className="max-w-44 truncate text-[0.64rem] font-semibold">
                  {task.title}
                </p>

                <p className="mt-0.5 max-w-44 truncate text-[0.56rem] text-[#798689] dark:text-white/26">
                  {task.projectTitle}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  onRemove(task.taskId)
                }
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  "text-[#7C898C] transition-colors",
                  "hover:bg-[#E0E7E4] hover:text-[#315E6C]",
                  "dark:text-white/25 dark:hover:bg-white/[0.05] dark:hover:text-white",
                ].join(" ")}
                aria-label={`Remove ${task.title} from weekly focus`}
              >
                <XIcon size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[0.62rem] leading-5 text-[#788689] dark:text-white/27">
          Open a task in the calendar and add it to your weekly focus.
        </p>
      )}
    </div>
  );
}

/* =========================================================
   UPCOMING
========================================================= */

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
    <div
      className={[
        "rounded-lg border p-3",
        "border-[#315E6C]/[0.07] bg-[#F6F8F6]",
        "dark:border-white/[0.06] dark:bg-[#10262D]",
      ].join(" ")}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock3Icon
            size={12}
            className="text-[#778689] dark:text-white/28"
          />

          <p className="text-[0.68rem] font-semibold">
            Next up
          </p>
        </div>

        <span className="text-[0.58rem] text-[#7A888B] dark:text-white/27">
          {items.length} upcoming
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {items.map(item => {
            const current =
              Boolean(item.projectId) &&
              String(item.projectId) === String(currentProjectId);

            const appearance =
              getCalendarItemAppearance(item, current);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen(item)}
                className={[
                  "min-w-0 rounded-md border px-2.5 py-2 text-left",
                  "transition-[background-color,border-color] duration-150",
                  appearance.surface,
                ].join(" ")}
              >
                <p
                  className={[
                    "text-[0.54rem] font-semibold uppercase tracking-[0.1em]",
                    appearance.meta,
                  ].join(" ")}
                >
                  {formatUpcomingDate(
                    parseCalendarDate(item.start),
                  )}
                </p>

                <p className="mt-1 truncate text-[0.66rem] font-semibold">
                  {item.title}
                </p>

                <p
                  className={[
                    "mt-0.5 truncate text-[0.56rem]",
                    appearance.meta,
                  ].join(" ")}
                >
                  {item.type === "plan-block"
                    ? "My plan"
                    : item.projectTitle}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-[0.62rem] leading-5 text-[#788689] dark:text-white/27">
          Nothing upcoming in the current calendar range.
        </p>
      )}
    </div>
  );
}

/* =========================================================
   VIEW SWITCH
========================================================= */

function CalendarViewSwitch({
  view,
  onChange,
}: {
  view: CalendarView;
  onChange: (view: CalendarView) => void;
}) {
  return (
    <div
      className={[
        "inline-flex w-fit items-center rounded-full border p-1",
        "border-[#315E6C]/[0.08] bg-[#E2E9E6]",
        "dark:border-white/[0.06] dark:bg-white/[0.035]",
      ].join(" ")}
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
      className={[
        "relative flex h-8 min-w-20 items-center justify-center rounded-full px-4",
        "text-xs font-semibold transition-colors duration-200",
        active
          ? "text-white dark:text-[#303030]"
          : "text-[#6F7F83] hover:text-[#315E6C] dark:text-white/30 dark:hover:text-white",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="calendar-view"
          className="absolute inset-0 rounded-full bg-[#315E6C] shadow-sm dark:bg-[#DEDA00]"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 38,
          }}
        />
      )}

      <span className="relative z-10">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   SCOPE CONTROL
========================================================= */

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
          className={[
            "h-9 rounded-lg px-3 text-xs font-semibold shadow-none",
            "border-[#315E6C]/[0.09] bg-[#F6F8F6] text-[#566A6F]",
            "hover:bg-[#E7ECE9] hover:text-[#315E6C]",
            "dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-white/55",
            "dark:hover:bg-white/[0.05] dark:hover:text-white",
          ].join(" ")}
        >
          <Layers3Icon size={13} />
          {label}
          <ChevronDownIcon size={13} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={[
          "w-56 rounded-xl p-1.5",
          "border-[#315E6C]/[0.09] bg-[#F8FAF8]",
          "dark:border-white/[0.08] dark:bg-[#10262D]",
        ].join(" ")}
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-[#758386] dark:text-white/27">
            Calendar scope
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#315E6C]/[0.07] dark:bg-white/[0.07]" />

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
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  count?: number;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className={[
        "rounded-lg px-3 py-2.5 text-xs",
        "focus:bg-[#E5ECE9] dark:focus:bg-white/[0.05]",
        active
          ? "bg-[#E5ECE9] font-semibold text-[#315E6C] dark:bg-[#DEDA00]/[0.07] dark:text-[#DEDA00]"
          : "",
      ].join(" ")}
    >
      <Icon
        size={13}
        className={
          active
            ? "text-[#315E6C] dark:text-[#DEDA00]"
            : "text-[#788689] dark:text-white/27"
        }
      />

      <span className="flex-1">
        {label}
      </span>

      {typeof count === "number" && (
        <span className="text-[0.6rem] tabular-nums opacity-60">
          {count}
        </span>
      )}

      {active && (
        <CheckIcon
          size={12}
          strokeWidth={3}
          className="ml-1"
        />
      )}
    </DropdownMenuItem>
  );
}

/* =========================================================
   MONTH VIEW
========================================================= */

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
      className={[
        "overflow-x-auto rounded-xl border",
        "border-[#315E6C]/[0.08] bg-[#F8FAF8]",
        "dark:border-white/[0.06] dark:bg-[#0C1D22]",
      ].join(" ")}
    >
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 border-b border-[#315E6C]/[0.07] bg-[#EAF0EE] dark:border-white/[0.055] dark:bg-white/[0.025]">
          {WEEK_DAYS.map(day => (
            <div
              key={day}
              className="px-2 py-3 text-center text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#778588] dark:text-white/26"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayItems = items
              .filter(item =>
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

  const remainingCount = Math.max(
    0,
    items.length - visibleItems.length,
  );

  return (
    <div
      className={[
        "relative min-h-[132px] min-w-0 p-2 transition-colors",
        !isLastColumn
          ? "border-r border-[#315E6C]/[0.055] dark:border-white/[0.045]"
          : "",
        !isLastRow
          ? "border-b border-[#315E6C]/[0.055] dark:border-white/[0.045]"
          : "",
        day.inCurrentMonth
          ? "bg-[#F8FAF8] dark:bg-[#0C1D22]"
          : "bg-[#F0F3F1] dark:bg-[#0A181D]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full",
          "text-xs font-semibold tabular-nums",
          day.isToday
            ? [
                "bg-[#315E6C] text-white",
                "dark:bg-[#DEDA00] dark:text-[#303030]",
              ].join(" ")
            : day.inCurrentMonth
              ? "text-[#435154] dark:text-white/70"
              : "text-[#9AA4A6] dark:text-white/18",
        ].join(" ")}
      >
        {day.date.getDate()}
      </span>

      <div className="mt-2 space-y-1">
        {visibleItems.map(item => (
          <CalendarItemButton
            key={item.id}
            item={item}
            current={
              Boolean(item.projectId) &&
              String(item.projectId) === String(currentProjectId)
            }
            compact
            onClick={() =>
              onItemClick(item)
            }
          />
        ))}

        {remainingCount > 0 && (
          <p className="px-1 pt-1 text-[0.6rem] font-semibold text-[#788689] dark:text-white/25">
            +{remainingCount} more
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   WEEK VIEW
========================================================= */

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
  const allDayItems = items.filter(item => item.allDay);
  const timedItems = items.filter(item => !item.allDay);

  const timelineHeight =
    WEEK_HOURS.length * HOUR_HEIGHT;

  return (
    <div
      className={[
        "overflow-x-auto rounded-xl border",
        "border-[#315E6C]/[0.08] bg-[#F8FAF8]",
        "dark:border-white/[0.06] dark:bg-[#0C1D22]",
      ].join(" ")}
    >
      <div className="min-w-[900px]">
        {/* HEADER */}

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-[#315E6C]/[0.07] dark:border-white/[0.055]">
          <div />

          {days.map(date => {
            const today = isSameDay(
              date,
              new Date(),
            );

            return (
              <div
                key={toDateKey(date)}
                className="border-l border-[#315E6C]/[0.055] px-3 py-3 text-center dark:border-white/[0.045]"
              >
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#778588] dark:text-white/26">
                  {formatWeekday(date)}
                </p>

                <span
                  className={[
                    "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full",
                    "text-sm font-semibold tabular-nums",
                    today
                      ? [
                          "bg-[#315E6C] text-white",
                          "dark:bg-[#DEDA00] dark:text-[#303030]",
                        ].join(" ")
                      : "text-[#435154] dark:text-white/70",
                  ].join(" ")}
                >
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* ALL DAY */}

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-[#315E6C]/[0.07] dark:border-white/[0.055]">
          <div className="px-2 py-3 text-right text-[0.58rem] font-medium text-[#788689] dark:text-white/25">
            All day
          </div>

          {days.map(date => {
            const dayItems = allDayItems
              .filter(item =>
                isSameDay(
                  parseCalendarDate(item.start),
                  date,
                ),
              )
              .sort(compareCalendarItems);

            return (
              <div
                key={toDateKey(date)}
                className="min-h-20 space-y-1 border-l border-[#315E6C]/[0.055] p-1.5 dark:border-white/[0.045]"
              >
                {dayItems.map(item => (
                  <CalendarItemButton
                    key={item.id}
                    item={item}
                    current={
                      Boolean(item.projectId) &&
                      String(item.projectId) === String(currentProjectId)
                    }
                    compact
                    onClick={() =>
                      onItemClick(item)
                    }
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
          <div
            className="relative"
            style={{
              height: timelineHeight,
            }}
          >
            {WEEK_HOURS.map((hour, index) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t border-[#315E6C]/[0.045] dark:border-white/[0.04]"
                style={{
                  top: index * HOUR_HEIGHT,
                }}
              >
                <span className="absolute -top-2 right-2 bg-[#F8FAF8] px-1 text-[0.58rem] text-[#7C898C] dark:bg-[#0C1D22] dark:text-white/24">
                  {formatHour(hour)}
                </span>
              </div>
            ))}
          </div>

          {days.map(date => {
            const dayItems = timedItems
              .filter(item =>
                isSameDay(
                  parseCalendarDate(item.start),
                  date,
                ),
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
  return (
    <div
      className="relative border-l border-[#315E6C]/[0.055] dark:border-white/[0.045]"
      style={{ height }}
    >
      {WEEK_HOURS.map((hour, index) => (
        <div
          key={hour}
          className="absolute left-0 right-0 border-t border-[#315E6C]/[0.045] dark:border-white/[0.04]"
          style={{
            top: index * HOUR_HEIGHT,
          }}
        />
      ))}

      {items.map(item => {
        const start = parseCalendarDate(item.start);

        const end = item.end
          ? parseCalendarDate(item.end)
          : addMinutes(start, 50);

        const startMinutes =
          (start.getHours() - WEEK_START_HOUR) * 60 +
          start.getMinutes();

        const durationMinutes = Math.max(
          30,
          (end.getTime() - start.getTime()) / 60000,
        );

        const top = Math.max(
          0,
          (startMinutes / 60) * HOUR_HEIGHT,
        );

        const itemHeight = Math.max(
          34,
          (durationMinutes / 60) * HOUR_HEIGHT,
        );

        return (
          <div
            key={item.id}
            className="absolute left-1 right-1 z-10 overflow-hidden"
            style={{
              top,
              height: Math.min(
                itemHeight,
                height - top,
              ),
            }}
          >
            <CalendarItemButton
              item={item}
              current={
                Boolean(item.projectId) &&
                String(item.projectId) === String(currentProjectId)
              }
              fill
              onClick={() =>
                onItemClick(item)
              }
            />
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   CALENDAR ITEM
========================================================= */

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
    item.type === "task"
      ? getCalendarTaskStatus(item)
      : null;

  const appearance =
    getCalendarItemAppearance(
      item,
      current,
    );

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
      transition={{
        duration: 0.15,
      }}
      title={`${item.title} · ${item.projectTitle}`}
      className={[
        "group/event block w-full min-w-0 rounded-md border text-left",
        "transition-[background-color,border-color] duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#315E6C]/20 dark:focus-visible:ring-[#DEDA00]/20",
        fill ? "h-full" : "",
        compact
          ? "px-2 py-1.5"
          : "px-2.5 py-2",
        appearance.surface,
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <Icon
          size={10}
          className="shrink-0 opacity-75"
        />

        <span
          className={[
            "truncate font-semibold",
            compact
              ? "text-[0.61rem]"
              : "text-[0.67rem]",
          ].join(" ")}
        >
          {timed && (
            <span className="mr-1 opacity-65">
              {formatTime(
                parseCalendarDate(
                  item.start,
                ),
              )}
            </span>
          )}

          {item.title}
        </span>
      </div>

      {!compact && (
        <p
          className={[
            "mt-1 truncate text-[0.56rem]",
            appearance.meta,
          ].join(" ")}
        >
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

/* =========================================================
   ITEM APPEARANCE
========================================================= */

function getCalendarItemAppearance(
  item: CalendarItem,
  current: boolean,
): CalendarItemAppearance {
  if (item.type === "plan-block") {
    return {
      surface: [
        "border-[#73868B]/[0.12] bg-[#E8ECEA] text-[#46575B]",
        "hover:border-[#73868B]/[0.20] hover:bg-[#E3E8E6]",
        "dark:border-white/[0.07] dark:bg-white/[0.035] dark:text-white/65",
        "dark:hover:border-white/[0.12] dark:hover:bg-white/[0.05]",
      ].join(" "),
      meta: "text-[#738185] dark:text-white/28",
    };
  }

  if (item.type === "task") {
    const status = getCalendarTaskStatus(item);

    if (status === "overdue") {
      return {
        surface: current
          ? [
              "border-[#AD3A12]/30 bg-[#F3E5DF] text-[#863615]",
              "hover:border-[#AD3A12]/40 hover:bg-[#EFE0D9]",
              "dark:border-[#D27857]/25 dark:bg-[#AD3A12]/[0.14] dark:text-[#E4A088]",
              "dark:hover:border-[#D27857]/35 dark:hover:bg-[#AD3A12]/[0.18]",
            ].join(" ")
          : [
              "border-[#AD3A12]/16 bg-[#F6ECE8] text-[#91401F]",
              "hover:border-[#AD3A12]/25 hover:bg-[#F2E6E1]",
              "dark:border-[#AD3A12]/16 dark:bg-[#AD3A12]/[0.07] dark:text-[#D88B70]",
              "dark:hover:border-[#D27857]/24 dark:hover:bg-[#AD3A12]/[0.10]",
            ].join(" "),
        meta:
          "text-[#9F5A3C] dark:text-[#D99278]",
      };
    }

    if (current && status === "pending") {
      return {
        surface: [
          "border-[#B98645]/25 bg-[#F4EDE3] text-[#795427]",
          "hover:border-[#B98645]/34 hover:bg-[#F0E8DC]",
          "dark:border-[#F0A23A]/20 dark:bg-[#F0A23A]/[0.08] dark:text-[#F0A23A]",
          "dark:hover:border-[#F0A23A]/30 dark:hover:bg-[#F0A23A]/[0.11]",
        ].join(" "),
        meta:
          "text-[#8A6A43] dark:text-[#E8AC5D]",
      };
    }

    if (current && status === "complete") {
      return {
        surface: [
          "border-[#568B5E]/25 bg-[#E8F0E9] text-[#3D7047]",
          "hover:border-[#568B5E]/34 hover:bg-[#E3EDE5]",
          "dark:border-[#38D200]/20 dark:bg-[#38D200]/[0.07] dark:text-[#38D200]",
          "dark:hover:border-[#38D200]/30 dark:hover:bg-[#38D200]/[0.10]",
        ].join(" "),
        meta:
          "text-[#618069] dark:text-[#77DB58]",
      };
    }

    if (current) {
      return {
        surface: [
          "border-[#315E6C]/25 bg-[#E2ECE9] text-[#315E6C]",
          "hover:border-[#315E6C]/34 hover:bg-[#DCE8E4]",
          "dark:border-[#DEDA00]/20 dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
          "dark:hover:border-[#DEDA00]/30 dark:hover:bg-[#DEDA00]/[0.11]",
        ].join(" "),
        meta:
          "text-[#5E767C] dark:text-[#D4D058]",
      };
    }
  }

  if (current) {
    return {
      surface: [
        "border-[#315E6C]/25 bg-[#E2ECE9] text-[#315E6C]",
        "hover:border-[#315E6C]/34 hover:bg-[#DCE8E4]",
        "dark:border-[#DEDA00]/20 dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
        "dark:hover:border-[#DEDA00]/30 dark:hover:bg-[#DEDA00]/[0.11]",
      ].join(" "),
      meta:
        "text-[#5E767C] dark:text-[#D4D058]",
    };
  }

  if (item.relationship === "allocat") {
    return {
      surface: [
        "border-[#315E6C]/[0.10] bg-[#EDF3F1] text-[#46575B]",
        "hover:border-[#315E6C]/[0.18] hover:bg-[#E8F0ED]",
        "dark:border-[#7DA6B1]/[0.10] dark:bg-[#7DA6B1]/[0.045] dark:text-white/68",
        "dark:hover:border-[#7DA6B1]/20 dark:hover:bg-[#7DA6B1]/[0.065]",
      ].join(" "),
      meta:
        "text-[#748387] dark:text-white/30",
    };
  }

  return {
    surface: [
      "border-[#315E6C]/[0.07] bg-[#EEF2F0] text-[#4A595D]",
      "hover:border-[#315E6C]/[0.13] hover:bg-[#E9EEEC]",
      "dark:border-white/[0.055] dark:bg-white/[0.03] dark:text-white/65",
      "dark:hover:border-white/[0.10] dark:hover:bg-white/[0.045]",
    ].join(" "),
    meta:
      "text-[#788689] dark:text-white/27",
  };
}

/* =========================================================
   TASK STATUS
========================================================= */

function getCalendarTaskStatus(
  item: CalendarItem,
): CalendarTaskStatus {
  const normalized = normalizeCalendarStatus(
    item.status,
  );

  if (
    normalized === "complete" ||
    normalized === "completed" ||
    normalized === "closed"
  ) {
    return "complete";
  }

  if (
    normalized === "overdue" ||
    isIncompleteCalendarTaskOverdue(item)
  ) {
    return "overdue";
  }

  if (
    normalized === "active" ||
    normalized === "inprogress"
  ) {
    return "active";
  }

  return "pending";
}

function isIncompleteCalendarTaskOverdue(
  item: CalendarItem,
) {
  if (item.type !== "task") return false;

  const normalized = normalizeCalendarStatus(
    item.status,
  );

  if (
    normalized === "complete" ||
    normalized === "completed" ||
    normalized === "closed"
  ) {
    return false;
  }

  const dueDate = parseCalendarDate(
    item.start,
  );

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const now = new Date();

  if (item.allDay) {
    return (
      startOfDay(dueDate).getTime() <
      startOfDay(now).getTime()
    );
  }

  return dueDate.getTime() < now.getTime();
}

function normalizeCalendarStatus(
  status?: string,
) {
  return String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

/* =========================================================
   DETAIL PANEL
========================================================= */

function CalendarDetailPanel({
  item,
  current,
  isFocused,
  onClose,
  onOpenProject,
  onToggleFocus,
  onEdit,
  onDelete,
}: {
  item: CalendarItem;
  current: boolean;
  isFocused: boolean;
  onClose: () => void;
  onOpenProject: () => void;
  onToggleFocus?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const start = parseCalendarDate(item.start);

  const end = item.end
    ? parseCalendarDate(item.end)
    : null;

  const appearance =
    getCalendarItemAppearance(
      item,
      current,
    );

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close calendar details"
        className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.aside
        initial={{
          x: 32,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        exit={{
          x: 32,
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className={[
          "fixed inset-y-0 right-0 z-[80] w-full max-w-md overflow-y-auto",
          "border-l border-[#315E6C]/[0.08] bg-[#F8FAF8] p-5 shadow-2xl",
          "dark:border-white/[0.07] dark:bg-[#0C1D22]",
          "sm:p-6",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-[#788689] dark:text-white/27">
              {item.type === "plan-block"
                ? "My plan"
                : item.relationship === "allocat"
                  ? "Client work"
                  : "Project work"}
            </p>

            <h2 className="mt-2 break-words text-xl font-semibold tracking-[-0.025em]">
              {item.title}
            </h2>

            {item.type !== "plan-block" && (
              <span
                className={[
                  "mt-3 inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1",
                  "text-[0.6rem] font-semibold",
                  appearance.surface,
                ].join(" ")}
              >
                {getCalendarTaskStatusIcon(item)}
                {formatStatus(item.status)}
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-lg shadow-none"
          >
            <XIcon size={16} />
          </Button>
        </div>

        <div className="mt-6 space-y-5">
          <DetailRow
            label="Project"
            value={
              item.projectTitle ||
              "Personal planning"
            }
          />

          <DetailRow
            label="When"
            value={formatItemTimeRange(
              start,
              end,
              item.allDay,
            )}
          />

          {item.type !== "plan-block" && (
            <DetailRow
              label="Status"
              value={formatStatus(
                getDisplayCalendarStatus(item),
              )}
            />
          )}

          <DetailRow
            label="Timing"
            value={getDeadlineIntelligence(item)}
          />

          {(item.description || item.notes) && (
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#788689] dark:text-white/27">
                Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-[#536266] dark:text-white/62">
                {item.notes || item.description}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-2 border-t border-[#315E6C]/[0.07] pt-5 dark:border-white/[0.06]">
          {onToggleFocus && (
            <Button
              type="button"
              variant={isFocused ? "outline" : "default"}
              onClick={onToggleFocus}
              className={[
                "h-10 w-full justify-start rounded-lg text-xs font-semibold shadow-none",
                !isFocused
                  ? [
                      "bg-[#315E6C] text-white hover:bg-[#294F5B]",
                      "dark:bg-[#DEDA00] dark:text-[#303030] dark:hover:bg-[#D4D000]",
                    ].join(" ")
                  : "",
              ].join(" ")}
            >
              <StarIcon size={13} />

              {isFocused
                ? "Remove from weekly focus"
                : "Add to weekly focus"}
            </Button>
          )}

          {onEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="h-10 w-full justify-start rounded-lg bg-transparent text-xs font-semibold shadow-none"
            >
              <PencilIcon size={13} />
              Reschedule or edit
            </Button>
          )}

          {item.projectId && (
            <Button
              type="button"
              variant="outline"
              onClick={onOpenProject}
              className="h-10 w-full justify-start rounded-lg bg-transparent text-xs font-semibold shadow-none"
            >
              <FolderOpenIcon size={13} />
              Open project
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="h-10 w-full justify-start rounded-lg text-xs font-semibold text-[#AD3A12] shadow-none hover:bg-[#AD3A12]/[0.05] hover:text-[#AD3A12] dark:text-[#D27857]"
            >
              <Trash2Icon size={13} />
              Delete planning block
            </Button>
          )}
        </div>
      </motion.aside>
    </>
  );
}

function getCalendarTaskStatusIcon(
  item: CalendarItem,
) {
  if (item.type !== "task") {
    return null;
  }

  const status =
    getCalendarTaskStatus(item);

  if (status === "overdue") {
    return (
      <AlertTriangleIcon size={11} />
    );
  }

  if (status === "complete") {
    return (
      <CheckCircle2Icon size={11} />
    );
  }

  if (status === "active") {
    return (
      <CircleDotIcon size={11} />
    );
  }

  return (
    <CircleDashedIcon size={11} />
  );
}

function getDisplayCalendarStatus(
  item: CalendarItem,
) {
  if (
    item.type === "task" &&
    getCalendarTaskStatus(item) === "overdue"
  ) {
    return "Overdue";
  }

  return item.status;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#788689] dark:text-white/27">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-[#425053] dark:text-white/70">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PLANNING BLOCK EDITOR
========================================================= */

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
  const initialStart = block
    ? parseCalendarDate(block.startAt)
    : null;

  const initialEnd = block
    ? parseCalendarDate(block.endAt)
    : null;

  const [title, setTitle] = useState(block?.title ?? "");
  const [notes, setNotes] = useState(block?.notes ?? "");
  const [selectedProjectId, setSelectedProjectId] = useState(block?.projectId ?? "");

  const [date, setDate] = useState(
    initialStart
      ? toDateKey(initialStart)
      : defaultDate,
  );

  const [startTime, setStartTime] = useState(
    initialStart
      ? toTimeInput(initialStart)
      : "09:00",
  );

  const [endTime, setEndTime] = useState(
    initialEnd
      ? toTimeInput(initialEnd)
      : "10:00",
  );

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    setFormError(null);

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setFormError(
        "Give this planning block a title.",
      );
      return;
    }

    const startAt = localDateTimeToIso(
      date,
      startTime,
    );

    const endAt = localDateTimeToIso(
      date,
      endTime,
    );

    if (
      new Date(endAt) <=
      new Date(startAt)
    ) {
      setFormError(
        "End time must be after the start time.",
      );
      return;
    }

    try {
      await onSave({
        projectId:
          selectedProjectId || null,
        taskId: null,
        title: cleanTitle,
        notes:
          notes.trim() || null,
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

  const inputClass = [
    "w-full rounded-lg border px-3 text-sm outline-none transition-colors",
    "border-[#315E6C]/[0.10] bg-[#F8FAF8]",
    "focus:border-[#315E6C]/40",
    "dark:border-white/[0.08] dark:bg-[#10262D]",
    "dark:focus:border-[#DEDA00]/40",
  ].join(" ");

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close planning editor"
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 14,
          scale: 0.99,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 14,
          scale: 0.99,
        }}
        transition={{
          duration: 0.18,
        }}
        className={[
          "fixed left-1/2 top-1/2 z-[100]",
          "w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border p-5 shadow-2xl sm:p-6",
          "border-[#315E6C]/[0.09] bg-[#F8FAF8]",
          "dark:border-white/[0.08] dark:bg-[#0C1D22]",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-[#788689] dark:text-white/27">
              Personal planning
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em]">
              {block
                ? "Edit planning block"
                : "Plan time"}
            </h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-lg shadow-none"
          >
            <XIcon size={16} />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <CalendarField label="Title">
            <input
              value={title}
              onChange={event =>
                setTitle(
                  event.target.value,
                )
              }
              maxLength={180}
              placeholder="e.g. Homepage concepts"
              className={`${inputClass} h-10 placeholder:text-[#899598] dark:placeholder:text-white/20`}
            />
          </CalendarField>

          <CalendarField label="Project">
            <select
              value={selectedProjectId}
              onChange={event =>
                setSelectedProjectId(
                  event.target.value,
                )
              }
              className={`${inputClass} h-10`}
            >
              <option value="">
                Personal / no project
              </option>

              {projects.map(project => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.title}
                </option>
              ))}
            </select>
          </CalendarField>

          <CalendarField label="Date">
            <input
              type="date"
              value={date}
              onChange={event =>
                setDate(
                  event.target.value,
                )
              }
              className={`${inputClass} h-10`}
            />
          </CalendarField>

          <div className="grid grid-cols-2 gap-3">
            <CalendarField label="Start">
              <input
                type="time"
                value={startTime}
                onChange={event =>
                  setStartTime(
                    event.target.value,
                  )
                }
                className={`${inputClass} h-10`}
              />
            </CalendarField>

            <CalendarField label="End">
              <input
                type="time"
                value={endTime}
                onChange={event =>
                  setEndTime(
                    event.target.value,
                  )
                }
                className={`${inputClass} h-10`}
              />
            </CalendarField>
          </div>

          <CalendarField label="Notes">
            <textarea
              value={notes}
              onChange={event =>
                setNotes(
                  event.target.value,
                )
              }
              maxLength={1200}
              rows={4}
              placeholder="Optional context for yourself"
              className={`${inputClass} resize-none py-2.5 leading-6 placeholder:text-[#899598] dark:placeholder:text-white/20`}
            />
          </CalendarField>

          {formError && (
            <p className="rounded-lg bg-[#AD3A12]/[0.06] px-3 py-2 text-xs font-medium text-[#9F3C1A] dark:text-[#D27857]">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className={[
                "h-9 rounded-lg px-4 text-xs font-semibold shadow-none",
                "bg-[#315E6C] text-white hover:bg-[#294F5B]",
                "dark:bg-[#DEDA00] dark:text-[#303030] dark:hover:bg-[#D4D000]",
              ].join(" ")}
            >
              {saving && (
                <LoaderCircleIcon
                  size={13}
                  className="animate-spin"
                />
              )}

              {block
                ? "Save changes"
                : "Add to plan"}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
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
      <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#788689] dark:text-white/27">
        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function CalendarLegend({
  showClientWork,
}: {
  showClientWork: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.62rem] text-[#758386] dark:text-white/27">
      <LegendItem
        surface="bg-[#315E6C] dark:bg-[#DEDA00]"
        label="Current project"
      />

      <LegendItem
        surface="bg-[#B98645] dark:bg-[#F0A23A]"
        label="Pending task"
      />

      <LegendItem
        surface="bg-[#568B5E] dark:bg-[#38D200]"
        label="Completed task"
      />

      <LegendItem
        surface="bg-[#AD3A12] dark:bg-[#D27857]"
        label="Overdue task"
      />

      {showClientWork && (
        <LegendItem
          surface="bg-[#7DA6B1]"
          label="Client work"
        />
      )}

      <LegendItem
        surface="bg-[#A5AFAC] dark:bg-white/25"
        label="My plan"
      />
    </div>
  );
}

function LegendItem({
  surface,
  label,
}: {
  surface: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={[
          "h-2.5 w-2.5 rounded-sm",
          surface,
        ].join(" ")}
      />

      {label}
    </span>
  );
}

/* =========================================================
   LOADING / ERROR
========================================================= */

function CalendarLoading() {
  return (
    <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-[#315E6C]/[0.07] dark:border-white/[0.06]">
      <div className="text-center">
        <LoaderCircleIcon
          size={20}
          className="mx-auto animate-spin text-[#315E6C] dark:text-[#DEDA00]"
        />

        <p className="mt-3 text-xs font-medium text-[#788689] dark:text-white/27">
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
    <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#315E6C]/[0.07] dark:border-white/[0.06]">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E1E8E5] text-[#687B80] dark:bg-white/[0.04] dark:text-white/30">
          <RefreshCwIcon size={17} />
        </span>

        <h2 className="mt-4 text-base font-semibold tracking-[-0.015em]">
          Could not load calendar
        </h2>

        <p className="mt-2 text-xs leading-6 text-[#788689] dark:text-white/28">
          {message}
        </p>

        <div className="mt-5 flex justify-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onDismiss}
            className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
          >
            Dismiss
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            className="h-9 rounded-lg bg-transparent px-4 text-xs font-semibold shadow-none"
          >
            <RefreshCwIcon size={13} />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PLANNING INTELLIGENCE
========================================================= */

function buildPlanningInsights(
  weekStart: Date,
  weekEnd: Date,
  items: CalendarItem[],
  planningBlocks: CalendarPlanningBlock[],
): PlanningInsights {
  const blocks = planningBlocks
    .map(block => ({
      ...block,
      startDate:
        parseCalendarDate(
          block.startAt,
        ),
      endDate:
        parseCalendarDate(
          block.endAt,
        ),
    }))
    .filter(
      block =>
        block.endDate > weekStart &&
        block.startDate < weekEnd,
    );

  const plannedHours = blocks.reduce(
    (
      total,
      block,
    ) => {
      const start = new Date(
        Math.max(
          block.startDate.getTime(),
          weekStart.getTime(),
        ),
      );

      const end = new Date(
        Math.min(
          block.endDate.getTime(),
          weekEnd.getTime(),
        ),
      );

      return (
        total +
        Math.max(
          0,
          (end.getTime() -
            start.getTime()) /
            3600000,
        )
      );
    },
    0,
  );

  const ratio =
    plannedHours /
    WEEKLY_CAPACITY_HOURS;

  const workloadLabel: PlanningInsights["workloadLabel"] =
    ratio > 1
      ? "Overloaded"
      : ratio >= 0.8
        ? "Busy"
        : ratio >= 0.5
          ? "Balanced"
          : "Light";

  const alerts: string[] = [];

  const overlappingPairs =
    findOverlappingBlocks(
      blocks,
    );

  if (overlappingPairs > 0) {
    alerts.push(
      `${overlappingPairs} planning ${
        overlappingPairs === 1
          ? "overlap"
          : "overlaps"
      }`,
    );
  }

  const dayStats = Array.from(
    { length: 7 },
    (_, index) => {
      const date = addDays(
        weekStart,
        index,
      );

      const hours = blocks
        .filter(block =>
          isSameDay(
            block.startDate,
            date,
          ),
        )
        .reduce(
          (
            total,
            block,
          ) =>
            total +
            Math.max(
              0,
              (block.endDate.getTime() -
                block.startDate.getTime()) /
                3600000,
            ),
          0,
        );

      const deadlineCount = items.filter(
        item =>
          (item.type === "task" ||
            item.type === "project-due") &&
          isSameDay(
            parseCalendarDate(
              item.start,
            ),
            date,
          ),
      ).length;

      return {
        date,
        hours,
        deadlineCount,
      };
    },
  );

  const busiestDay = dayStats.find(
    day =>
      day.hours > 8 ||
      day.deadlineCount >= 3,
  );

  if (busiestDay) {
    alerts.push(
      `${formatWeekday(
        busiestDay.date,
      )} looks busy`,
    );
  }

  if (
    plannedHours >
    WEEKLY_CAPACITY_HOURS
  ) {
    alerts.push(
      `${formatHours(
        plannedHours -
          WEEKLY_CAPACITY_HOURS,
      )}h over weekly capacity`,
    );
  }

  const deadlineCount = items.filter(item => {
    if (
      item.type !== "task" &&
      item.type !== "project-due"
    ) {
      return false;
    }

    const start =
      parseCalendarDate(
        item.start,
      );

    return (
      start >= weekStart &&
      start < weekEnd
    );
  }).length;

  return {
    plannedHours,
    capacityHours:
      WEEKLY_CAPACITY_HOURS,
    workloadLabel,
    deadlineCount,
    alerts,
  };
}

function findOverlappingBlocks(
  blocks: Array<{
    startDate: Date;
    endDate: Date;
  }>,
) {
  let overlaps = 0;

  const sorted = [...blocks].sort(
    (
      first,
      second,
    ) =>
      first.startDate.getTime() -
      second.startDate.getTime(),
  );

  for (
    let firstIndex = 0;
    firstIndex < sorted.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < sorted.length;
      secondIndex += 1
    ) {
      const first =
        sorted[firstIndex];

      const second =
        sorted[secondIndex];

      if (
        second.startDate >=
        first.endDate
      ) {
        break;
      }

      if (
        second.startDate <
          first.endDate &&
        second.endDate >
          first.startDate
      ) {
        overlaps += 1;
      }
    }
  }

  return overlaps;
}

/* =========================================================
   DATE HELPERS
========================================================= */

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

function startOfMonth(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  );
}

function startOfWeek(date: Date) {
  const result =
    startOfDay(date);

  const day =
    result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() +
      difference,
  );

  return result;
}

function addDays(
  date: Date,
  amount: number,
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() +
      amount,
  );

  return result;
}

function addMonths(
  date: Date,
  amount: number,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
  );
}

function addMinutes(
  date: Date,
  amount: number,
) {
  return new Date(
    date.getTime() +
      amount * 60000,
  );
}

function isSameDay(
  first: Date,
  second: Date,
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}

function parseCalendarDate(
  value: string,
) {
  return new Date(value);
}

function toDateKey(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toTimeInput(
  date: Date,
) {
  const hours =
    String(
      date.getHours(),
    ).padStart(2, "0");

  const minutes =
    String(
      date.getMinutes(),
    ).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function localDateTimeToIso(
  date: string,
  time: string,
) {
  return new Date(
    `${date}T${time}:00`,
  ).toISOString();
}

/* =========================================================
   FORMAT HELPERS
========================================================= */

function formatCalendarHeading(
  date: Date,
  view: CalendarView,
) {
  if (view === "month") {
    return new Intl.DateTimeFormat(
      "en",
      {
        month: "long",
        year: "numeric",
      },
    ).format(date);
  }

  const start = startOfWeek(date);
  const end = addDays(start, 6);

  const sameMonth =
    start.getMonth() ===
      end.getMonth() &&
    start.getFullYear() ===
      end.getFullYear();

  if (sameMonth) {
    const monthYear =
      new Intl.DateTimeFormat(
        "en",
        {
          month: "long",
          year: "numeric",
        },
      ).format(start);

    return `${start.getDate()}-${end.getDate()} ${monthYear}`;
  }

  const startLabel =
    new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
      },
    ).format(start);

  const endLabel =
    new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    ).format(end);

  return `${startLabel} - ${endLabel}`;
}

function formatWeekday(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "en",
    {
      weekday: "short",
    },
  ).format(date);
}

function formatHour(
  hour: number,
) {
  return new Intl.DateTimeFormat(
    "en",
    {
      hour: "numeric",
    },
  ).format(
    new Date(
      2026,
      0,
      1,
      hour,
    ),
  );
}

function formatTime(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "en",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function formatUpcomingDate(
  date: Date,
) {
  if (
    isSameDay(
      date,
      new Date(),
    )
  ) {
    return "Today";
  }

  if (
    isSameDay(
      date,
      addDays(
        new Date(),
        1,
      ),
    )
  ) {
    return "Tomorrow";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    },
  ).format(date);
}

function formatHours(
  value: number,
) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function formatStatus(
  status: string,
) {
  if (!status) {
    return "Not set";
  }

  return status
    .replace(
      /[-_]/g,
      " ",
    )
    .replace(
      /\b\w/g,
      letter =>
        letter.toUpperCase(),
    );
}

function formatItemTimeRange(
  start: Date,
  end: Date | null,
  allDay: boolean,
) {
  const date =
    new Intl.DateTimeFormat(
      "en",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    ).format(start);

  if (allDay) {
    return `${date} · All day`;
  }

  if (!end) {
    return `${date} · ${formatTime(start)}`;
  }

  return `${date} · ${formatTime(start)} - ${formatTime(end)}`;
}

function getDeadlineIntelligence(
  item: CalendarItem,
) {
  if (item.type === "plan-block") {
    return "Personal time reserved on your plan.";
  }

  const eventDate =
    startOfDay(
      parseCalendarDate(
        item.start,
      ),
    );

  const today =
    startOfDay(
      new Date(),
    );

  const days =
    Math.round(
      (eventDate.getTime() -
        today.getTime()) /
        86400000,
    );

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Tomorrow";
  }

  if (days > 1) {
    return `In ${days} days`;
  }

  if (days === -1) {
    return "Overdue by 1 day";
  }

  return `Overdue by ${Math.abs(days)} days`;
}

/* =========================================================
   SORT / ERROR HELPERS
========================================================= */

function compareCalendarItems(
  first: CalendarItem,
  second: CalendarItem,
) {
  if (
    first.allDay !==
    second.allDay
  ) {
    return first.allDay
      ? -1
      : 1;
  }

  return (
    parseCalendarDate(
      first.start,
    ).getTime() -
    parseCalendarDate(
      second.start,
    ).getTime()
  );
}

function getAxiosMessage(
  error: unknown,
  fallback: string,
) {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

export default Calendar;