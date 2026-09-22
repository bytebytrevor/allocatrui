// import {
//   type ComponentType,
//   type FormEvent,
//   type ReactNode,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import { useNavigate, useOutletContext } from "react-router-dom";

// import {
//   AlertTriangleIcon,
//   BriefcaseBusinessIcon,
//   CalendarDaysIcon,
//   CheckCircle2Icon,
//   CheckIcon,
//   ChevronDownIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CircleDotIcon,
//   Clock3Icon,
//   FolderOpenIcon,
//   Layers3Icon,
//   LoaderCircleIcon,
//   PencilIcon,
//   PlusIcon,
//   RefreshCwIcon,
//   RotateCcwIcon,
//   StarIcon,
//   Trash2Icon,
//   XIcon,
// } from "lucide-react";

// import api from "@/api/axios";

// import type { Project } from "@/Types/project";
// import type { ProjectWorkspaceContext } from "@/Types/projectWorkspaceContext";

// import { Button } from "@/components/ui/button";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// /* =========================================================
//    TYPES
// ========================================================= */

// type CalendarView = "month" | "week";
// type CalendarScope = "all" | "mine" | "work";

// type CalendarEventType =
//   | "project-start"
//   | "project-due"
//   | "task"
//   | "plan-block";

// type CalendarRelationship =
//   | "owner"
//   | "allocat"
//   | "planning";

// type CalendarEvent = {
//   id: string;
//   type: Exclude<CalendarEventType, "plan-block">;
//   projectId: string;
//   taskId?: string | null;
//   projectTitle: string;
//   projectCode?: string | null;
//   title: string;
//   description?: string | null;
//   start: string;
//   end?: string | null;
//   allDay: boolean;
//   status: string;
//   relationship: Exclude<CalendarRelationship, "planning">;
// };

// type CalendarPlanningBlock = {
//   id: string;
//   projectId?: string | null;
//   taskId?: string | null;
//   projectTitle?: string | null;
//   title: string;
//   notes?: string | null;
//   startAt: string;
//   endAt: string;
// };

// type CalendarFocusTask = {
//   taskId: string;
//   projectId: string;
//   projectTitle: string;
//   title: string;
//   status: string;
//   dueDate?: string | null;
// };

// type CalendarItem = {
//   id: string;
//   source: "event" | "planning";
//   sourceId: string;
//   type: CalendarEventType;
//   projectId?: string | null;
//   taskId?: string | null;
//   projectTitle: string;
//   projectCode?: string | null;
//   title: string;
//   description?: string | null;
//   notes?: string | null;
//   start: string;
//   end?: string | null;
//   allDay: boolean;
//   status: string;
//   relationship: CalendarRelationship;
// };

// type CalendarRange = {
//   start: Date;
//   end: Date;
// };

// type CalendarDay = {
//   date: Date;
//   inCurrentMonth: boolean;
//   isToday: boolean;
// };

// type PlanningInsights = {
//   plannedHours: number;
//   capacityHours: number;
//   workloadLabel: "Light" | "Balanced" | "Busy" | "Overloaded";
//   deadlineCount: number;
//   alerts: string[];
// };

// /* =========================================================
//    CONSTANTS
// ========================================================= */

// const WEEK_DAYS = [
//   "Mon",
//   "Tue",
//   "Wed",
//   "Thu",
//   "Fri",
//   "Sat",
//   "Sun",
// ];

// const WEEK_START_HOUR = 6;
// const WEEK_END_HOUR = 23;
// const WEEK_HOURS = Array.from(
//   { length: WEEK_END_HOUR - WEEK_START_HOUR },
//   (_, index) => index + WEEK_START_HOUR,
// );

// const HOUR_HEIGHT = 64;
// const WEEKLY_CAPACITY_HOURS = 40;

// /* =========================================================
//    PAGE
// ========================================================= */

// function Calendar() {
//   const navigate = useNavigate();

//   const {
//     projects,
//     currentProject,
//     projectId,
//     isAllocat,
//   } = useOutletContext<ProjectWorkspaceContext>();

//   const [view, setView] = useState<CalendarView>("month");
//   const [scope, setScope] = useState<CalendarScope>("all");
//   const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));

//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [planningBlocks, setPlanningBlocks] = useState<CalendarPlanningBlock[]>([]);
//   const [focusTasks, setFocusTasks] = useState<CalendarFocusTask[]>([]);

//   const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
//   const [editingBlock, setEditingBlock] = useState<CalendarPlanningBlock | null>(null);
//   const [planEditorOpen, setPlanEditorOpen] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [savingPlan, setSavingPlan] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   /* =======================================================
//      RANGE
//   ======================================================= */

//   const range = useMemo<CalendarRange>(() => {
//     if (view === "week") {
//       const start = startOfWeek(anchorDate);

//       return {
//         start,
//         end: addDays(start, 7),
//       };
//     }

//     const monthStart = startOfMonth(anchorDate);
//     const start = startOfWeek(monthStart);

//     return {
//       start,
//       end: addDays(start, 42),
//     };
//   }, [anchorDate, view]);

//   const rangeStartKey = toDateKey(range.start);
//   const rangeEndKey = toDateKey(range.end);

//   const focusWeekStart = useMemo(
//     () => startOfWeek(anchorDate),
//     [anchorDate],
//   );

//   const focusWeekStartKey = toDateKey(focusWeekStart);

//   /* =======================================================
//      LOAD DATA
//   ======================================================= */

//   const fetchCalendarData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [eventsResponse, blocksResponse, focusResponse] = await Promise.all([
//         api.get<CalendarEvent[]>("/calendar", {
//           params: {
//             start: rangeStartKey,
//             end: rangeEndKey,
//           },
//           withCredentials: true,
//         }),
//         api.get<CalendarPlanningBlock[]>("/calendar/plan-blocks", {
//           params: {
//             start: rangeStartKey,
//             end: rangeEndKey,
//           },
//           withCredentials: true,
//         }),
//         api.get<CalendarFocusTask[]>("/calendar/focus", {
//           params: {
//             weekStart: focusWeekStartKey,
//           },
//           withCredentials: true,
//         }),
//       ]);

//       setEvents(Array.isArray(eventsResponse.data) ? eventsResponse.data : []);
//       setPlanningBlocks(
//         Array.isArray(blocksResponse.data)
//           ? blocksResponse.data
//           : [],
//       );
//       setFocusTasks(
//         Array.isArray(focusResponse.data)
//           ? focusResponse.data
//           : [],
//       );
//     } catch (requestError) {
//       console.error("Could not load calendar:", requestError);

//       const responseMessage =
//         axios.isAxiosError(requestError) &&
//         typeof requestError.response?.data?.message === "string"
//           ? requestError.response.data.message
//           : null;

//       setError(
//         responseMessage ??
//         "Your calendar could not be loaded. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [rangeStartKey, rangeEndKey, focusWeekStartKey]);

//   useEffect(() => {
//     void fetchCalendarData();
//   }, [fetchCalendarData]);

//   /* =======================================================
//      NORMALIZE ITEMS
//   ======================================================= */

//   const calendarItems = useMemo<CalendarItem[]>(() => {
//     const projectEvents: CalendarItem[] = events.map(event => ({
//       ...event,
//       source: "event",
//       sourceId: event.id,
//     }));

//     const planItems: CalendarItem[] = planningBlocks.map(block => ({
//       id: `planning-${block.id}`,
//       source: "planning",
//       sourceId: block.id,
//       type: "plan-block",
//       projectId: block.projectId,
//       taskId: block.taskId,
//       projectTitle: block.projectTitle ?? "Personal planning",
//       projectCode: null,
//       title: block.title,
//       description: null,
//       notes: block.notes,
//       start: block.startAt,
//       end: block.endAt,
//       allDay: false,
//       status: "planned",
//       relationship: "planning",
//     }));

//     return [...projectEvents, ...planItems];
//   }, [events, planningBlocks]);

//   const visibleItems = useMemo(() => {
//     return calendarItems.filter(item => {
//       if (item.relationship === "planning") {
//         return true;
//       }

//       if (scope === "mine") {
//         return item.relationship === "owner";
//       }

//       if (scope === "work") {
//         return item.relationship === "allocat";
//       }

//       return true;
//     });
//   }, [calendarItems, scope]);

//   /* =======================================================
//      MONTH / WEEK DAYS
//   ======================================================= */

//   const monthDays = useMemo<CalendarDay[]>(() => {
//     const currentMonth = anchorDate.getMonth();
//     const start = startOfWeek(startOfMonth(anchorDate));
//     const today = new Date();

//     return Array.from({ length: 42 }, (_, index) => {
//       const date = addDays(start, index);

//       return {
//         date,
//         inCurrentMonth: date.getMonth() === currentMonth,
//         isToday: isSameDay(date, today),
//       };
//     });
//   }, [anchorDate]);

//   const weekDays = useMemo(() => {
//     return Array.from(
//       { length: 7 },
//       (_, index) => addDays(focusWeekStart, index),
//     );
//   }, [focusWeekStart]);

//   /* =======================================================
//      PLANNING INTELLIGENCE
//   ======================================================= */

//   const insights = useMemo(
//     () =>
//       buildPlanningInsights(
//         focusWeekStart,
//         addDays(focusWeekStart, 7),
//         calendarItems,
//         planningBlocks,
//       ),
//     [focusWeekStart, calendarItems, planningBlocks],
//   );

//   const upcomingItems = useMemo(() => {
//     const now = new Date();

//     return calendarItems
//       .filter(item => parseCalendarDate(item.start) >= now)
//       .sort(compareCalendarItems)
//       .slice(0, 4);
//   }, [calendarItems]);

//   const ownedEventCount = useMemo(
//     () => events.filter(event => event.relationship === "owner").length,
//     [events],
//   );

//   const workEventCount = useMemo(
//     () => events.filter(event => event.relationship === "allocat").length,
//     [events],
//   );

//   /* =======================================================
//      NAVIGATION
//   ======================================================= */

//   function goPrevious() {
//     setAnchorDate(current =>
//       view === "month"
//         ? addMonths(current, -1)
//         : addDays(current, -7),
//     );
//   }

//   function goNext() {
//     setAnchorDate(current =>
//       view === "month"
//         ? addMonths(current, 1)
//         : addDays(current, 7),
//     );
//   }

//   function goToday() {
//     setAnchorDate(startOfDay(new Date()));
//   }

//   /* =======================================================
//      FOCUS ACTIONS
//   ======================================================= */

//   async function toggleFocus(taskId: string) {
//     const focused = focusTasks.some(task => task.taskId === taskId);

//     try {
//       const response = focused
//         ? await api.delete<CalendarFocusTask[]>(`/calendar/focus/${taskId}`, {
//             params: {
//               weekStart: focusWeekStartKey,
//             },
//             withCredentials: true,
//           })
//         : await api.put<CalendarFocusTask[]>(
//             `/calendar/focus/${taskId}`,
//             null,
//             {
//               params: {
//                 weekStart: focusWeekStartKey,
//               },
//               withCredentials: true,
//             },
//           );

//       setFocusTasks(response.data);
//     } catch (requestError) {
//       const message = getAxiosMessage(
//         requestError,
//         "The weekly focus could not be updated.",
//       );

//       setError(message);
//     }
//   }

//   /* =======================================================
//      PLANNING BLOCK ACTIONS
//   ======================================================= */

//   function createPlanningBlock() {
//     setEditingBlock(null);
//     setPlanEditorOpen(true);
//   }

//   function editPlanningBlock(item: CalendarItem) {
//     if (item.source !== "planning") return;

//     const block = planningBlocks.find(
//       planningBlock => planningBlock.id === item.sourceId,
//     );

//     if (!block) return;

//     setEditingBlock(block);
//     setSelectedItem(null);
//     setPlanEditorOpen(true);
//   }

//   async function savePlanningBlock(payload: PlanningBlockPayload) {
//     try {
//       setSavingPlan(true);

//       if (editingBlock) {
//         await api.patch(
//           `/calendar/plan-blocks/${editingBlock.id}`,
//           payload,
//           {
//             withCredentials: true,
//           },
//         );
//       } else {
//         await api.post(
//           "/calendar/plan-blocks",
//           payload,
//           {
//             withCredentials: true,
//           },
//         );
//       }

//       setPlanEditorOpen(false);
//       setEditingBlock(null);
//       await fetchCalendarData();
//     } catch (requestError) {
//       throw new Error(
//         getAxiosMessage(
//           requestError,
//           "The planning block could not be saved.",
//         ),
//       );
//     } finally {
//       setSavingPlan(false);
//     }
//   }

//   async function deletePlanningBlock(item: CalendarItem) {
//     if (item.source !== "planning") return;

//     try {
//       await api.delete(
//         `/calendar/plan-blocks/${item.sourceId}`,
//         {
//           withCredentials: true,
//         },
//       );

//       setSelectedItem(null);
//       await fetchCalendarData();
//     } catch (requestError) {
//       setError(
//         getAxiosMessage(
//           requestError,
//           "The planning block could not be deleted.",
//         ),
//       );
//     }
//   }

//   /* =======================================================
//      UI
//   ======================================================= */

//   return (
//     <div className="min-w-0">
//       {/* HEADER */}

//       <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
//         <div className="min-w-0">
//           <div className="flex items-center gap-2.5">
//             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-secondary shadow-sm shadow-primary/10">
//               <CalendarDaysIcon size={15} />
//             </span>

//             <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
//               Schedule
//             </p>
//           </div>

//           <h1 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
//             Calendar
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
//             See every commitment, shape your week and protect your capacity
//             without losing sight of client work.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <Button
//             type="button"
//             onClick={createPlanningBlock}
//             className="h-9 rounded-lg px-3 text-xs font-semibold shadow-none"
//           >
//             <PlusIcon size={13} />
//             Plan time
//           </Button>

//           <CalendarViewSwitch
//             view={view}
//             onChange={setView}
//           />
//         </div>
//       </div>

//       {/* HIGHLIGHTED PROJECT + FILTERS */}

//       <div className="mt-7 flex flex-col gap-4 border-y border-border/70 py-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex min-w-0 items-center gap-3">
//           <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-secondary">
//             <CircleDotIcon size={15} />
//           </span>

//           <div className="min-w-0">
//             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//               Highlighted project
//             </p>

//             <p className="mt-0.5 truncate text-sm font-bold">
//               {currentProject.title}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <CalendarScopeControl
//             value={scope}
//             onChange={setScope}
//             isAllocat={isAllocat}
//             ownedCount={ownedEventCount}
//             workCount={workEventCount}
//           />

//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             onClick={goToday}
//             className="h-9 rounded-lg px-3 text-xs text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
//           >
//             <RotateCcwIcon size={13} />
//             Today
//           </Button>
//         </div>
//       </div>

//       {/* WEEK INTELLIGENCE */}

//       <CalendarPlanningSummary
//         insights={insights}
//         weekStart={focusWeekStart}
//       />

//       {/* WEEKLY FOCUS */}

//       <WeeklyFocusStrip
//         tasks={focusTasks}
//         onOpenProject={task => navigate(`/projects/${task.projectId}`)}
//         onRemove={taskId => void toggleFocus(taskId)}
//       />

//       {/* UPCOMING */}

//       <UpcomingStrip
//         items={upcomingItems}
//         currentProjectId={projectId}
//         onOpen={setSelectedItem}
//       />

//       {/* PERIOD HEADER */}

//       <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="min-w-0">
//           <AnimatePresence mode="wait" initial={false}>
//             <motion.h2
//               key={`${view}-${formatCalendarHeading(anchorDate, view)}`}
//               initial={{ opacity: 0, y: 4 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -4 }}
//               transition={{ duration: 0.16 }}
//               className="text-xl font-black tracking-[-0.025em] sm:text-2xl"
//             >
//               {formatCalendarHeading(anchorDate, view)}
//             </motion.h2>
//           </AnimatePresence>

//           <p className="mt-1 text-xs text-muted-foreground">
//             {visibleItems.length}{" "}
//             {visibleItems.length === 1
//               ? "calendar item"
//               : "calendar items"}
//           </p>
//         </div>

//         <div className="flex items-center gap-1">
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={goPrevious}
//             className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
//             aria-label="Previous period"
//           >
//             <ChevronLeftIcon size={16} />
//           </Button>

//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={goNext}
//             className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
//             aria-label="Next period"
//           >
//             <ChevronRightIcon size={16} />
//           </Button>
//         </div>
//       </div>

//       {/* CALENDAR */}

//       <div className="mt-5 min-w-0">
//         {loading ? (
//           <CalendarLoading />
//         ) : error ? (
//           <CalendarError
//             message={error}
//             onRetry={() => void fetchCalendarData()}
//             onDismiss={() => setError(null)}
//           />
//         ) : (
//           <AnimatePresence mode="wait" initial={false}>
//             <motion.div
//               key={`${view}-${rangeStartKey}`}
//               initial={{ opacity: 0, y: 6 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -6 }}
//               transition={{ duration: 0.18, ease: "easeOut" }}
//             >
//               {view === "month" ? (
//                 <MonthView
//                   days={monthDays}
//                   items={visibleItems}
//                   currentProjectId={projectId}
//                   onItemClick={setSelectedItem}
//                 />
//               ) : (
//                 <WeekView
//                   days={weekDays}
//                   items={visibleItems}
//                   currentProjectId={projectId}
//                   onItemClick={setSelectedItem}
//                 />
//               )}
//             </motion.div>
//           </AnimatePresence>
//         )}
//       </div>

//       {!loading && !error && (
//         <CalendarLegend showClientWork={isAllocat} />
//       )}

//       {/* DETAIL PANEL */}

//       <AnimatePresence>
//         {selectedItem && (
//           <CalendarDetailPanel
//             item={selectedItem}
//             isFocused={Boolean(
//               selectedItem.taskId &&
//               focusTasks.some(task => task.taskId === selectedItem.taskId),
//             )}
//             onClose={() => setSelectedItem(null)}
//             onOpenProject={() => {
//               if (selectedItem.projectId) {
//                 navigate(`/projects/${selectedItem.projectId}`);
//               }
//             }}
//             onToggleFocus={
//               selectedItem.taskId
//                 ? () => void toggleFocus(selectedItem.taskId!)
//                 : undefined
//             }
//             onEdit={
//               selectedItem.source === "planning"
//                 ? () => editPlanningBlock(selectedItem)
//                 : undefined
//             }
//             onDelete={
//               selectedItem.source === "planning"
//                 ? () => void deletePlanningBlock(selectedItem)
//                 : undefined
//             }
//           />
//         )}
//       </AnimatePresence>

//       {/* PLAN EDITOR */}

//       <AnimatePresence>
//         {planEditorOpen && (
//           <PlanningBlockEditor
//             projects={projects}
//             block={editingBlock}
//             defaultDate={toDateKey(anchorDate)}
//             saving={savingPlan}
//             onClose={() => {
//               setPlanEditorOpen(false);
//               setEditingBlock(null);
//             }}
//             onSave={savePlanningBlock}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// /* =========================================================
//    PLANNING SUMMARY
// ========================================================= */

// function CalendarPlanningSummary({
//   insights,
//   weekStart,
// }: {
//   insights: PlanningInsights;
//   weekStart: Date;
// }) {
//   const weekEnd = addDays(weekStart, 6);

//   return (
//     <div className="mt-6 border-b border-border/70 pb-5">
//       <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//         <div>
//           <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//             Week plan
//           </p>

//           <p className="mt-1 text-sm font-bold">
//             {formatShortDate(weekStart)} - {formatShortDate(weekEnd)}
//           </p>
//         </div>

//         <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
//           <SummaryStat
//             label="Planned"
//             value={`${formatHours(insights.plannedHours)}h`}
//           />

//           <SummaryStat
//             label="Capacity"
//             value={`${insights.capacityHours}h`}
//           />

//           <SummaryStat
//             label="Workload"
//             value={insights.workloadLabel}
//           />

//           <SummaryStat
//             label="Alerts"
//             value={String(insights.alerts.length)}
//           />
//         </div>
//       </div>

//       {insights.alerts.length > 0 && (
//         <div className="mt-4 flex flex-wrap gap-2">
//           {insights.alerts.slice(0, 3).map(alert => (
//             <span
//               key={alert}
//               className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/25 px-2.5 py-1.5 text-[0.66rem] font-medium text-muted-foreground"
//             >
//               <AlertTriangleIcon size={11} />
//               {alert}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function SummaryStat({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="min-w-20">
//       <p className="text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
//         {label}
//       </p>

//       <p className="mt-1 text-sm font-black tracking-[-0.015em]">
//         {value}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    WEEKLY FOCUS
// ========================================================= */

// function WeeklyFocusStrip({
//   tasks,
//   onOpenProject,
//   onRemove,
// }: {
//   tasks: CalendarFocusTask[];
//   onOpenProject: (task: CalendarFocusTask) => void;
//   onRemove: (taskId: string) => void;
// }) {
//   return (
//     <div className="mt-5 rounded-xl border border-border/70 bg-muted/[0.12] px-4 py-4 sm:px-5">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <StarIcon size={13} className="text-primary" />

//             <p className="text-xs font-bold">
//               Weekly focus
//             </p>
//           </div>

//           <p className="mt-1 text-[0.66rem] text-muted-foreground">
//             Keep up to five tasks at the center of the week.
//           </p>
//         </div>

//         <span className="text-[0.62rem] font-semibold tabular-nums text-muted-foreground">
//           {tasks.length}/5
//         </span>
//       </div>

//       {tasks.length > 0 ? (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {tasks.map(task => (
//             <div
//               key={task.taskId}
//               className="flex min-w-0 items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-2"
//             >
//               <button
//                 type="button"
//                 onClick={() => onOpenProject(task)}
//                 className="min-w-0 text-left"
//               >
//                 <p className="max-w-48 truncate text-[0.68rem] font-semibold">
//                   {task.title}
//                 </p>

//                 <p className="mt-0.5 max-w-48 truncate text-[0.58rem] text-muted-foreground">
//                   {task.projectTitle}
//                 </p>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => onRemove(task.taskId)}
//                 className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
//                 aria-label={`Remove ${task.title} from weekly focus`}
//               >
//                 <XIcon size={11} />
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-3 text-xs text-muted-foreground">
//           No focus tasks yet. Open a task in the calendar and add it to this week.
//         </p>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    UPCOMING
// ========================================================= */

// function UpcomingStrip({
//   items,
//   currentProjectId,
//   onOpen,
// }: {
//   items: CalendarItem[];
//   currentProjectId: string;
//   onOpen: (item: CalendarItem) => void;
// }) {
//   if (items.length === 0) return null;

//   return (
//     <div className="mt-5">
//       <div className="mb-2.5 flex items-center justify-between">
//         <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//           Next up
//         </p>

//         <span className="text-[0.6rem] text-muted-foreground">
//           {items.length} upcoming
//         </span>
//       </div>

//       <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
//         {items.map(item => (
//           <button
//             key={item.id}
//             type="button"
//             onClick={() => onOpen(item)}
//             className={[
//               "min-w-0 rounded-lg border px-3 py-3 text-left transition-colors",
//               String(item.projectId) === String(currentProjectId)
//                 ? "border-primary/30 bg-primary/[0.04]"
//                 : "border-border/70 bg-background hover:bg-muted/20",
//             ].join(" ")}
//           >
//             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
//               {formatUpcomingDate(parseCalendarDate(item.start))}
//             </p>

//             <p className="mt-1.5 truncate text-xs font-bold">
//               {item.title}
//             </p>

//             <p className="mt-1 truncate text-[0.62rem] text-muted-foreground">
//               {item.type === "plan-block"
//                 ? "My plan"
//                 : item.projectTitle}
//             </p>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    VIEW SWITCH
// ========================================================= */

// function CalendarViewSwitch({
//   view,
//   onChange,
// }: {
//   view: CalendarView;
//   onChange: (view: CalendarView) => void;
// }) {
//   return (
//     <div className="inline-flex w-fit items-center rounded-full border border-border/70 bg-muted/30 p-1">
//       <CalendarViewButton
//         active={view === "month"}
//         label="Month"
//         onClick={() => onChange("month")}
//       />

//       <CalendarViewButton
//         active={view === "week"}
//         label="Week"
//         onClick={() => onChange("week")}
//       />
//     </div>
//   );
// }

// function CalendarViewButton({
//   active,
//   label,
//   onClick,
// }: {
//   active: boolean;
//   label: string;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={[
//         "relative flex h-8 min-w-20 items-center justify-center rounded-full px-4",
//         "text-xs font-semibold transition-colors duration-200",
//         active
//           ? "text-foreground"
//           : "text-muted-foreground hover:text-foreground",
//       ].join(" ")}
//     >
//       {active && (
//         <motion.span
//           layoutId="calendar-view"
//           className="absolute inset-0 rounded-full bg-background shadow-sm shadow-black/[0.035] ring-1 ring-inset ring-border/60"
//           transition={{
//             type: "spring",
//             stiffness: 500,
//             damping: 38,
//           }}
//         />
//       )}

//       <span className="relative z-10">
//         {label}
//       </span>
//     </button>
//   );
// }

// /* =========================================================
//    SCOPE CONTROL
// ========================================================= */

// function CalendarScopeControl({
//   value,
//   onChange,
//   isAllocat,
//   ownedCount,
//   workCount,
// }: {
//   value: CalendarScope;
//   onChange: (value: CalendarScope) => void;
//   isAllocat: boolean;
//   ownedCount: number;
//   workCount: number;
// }) {
//   const label =
//     value === "mine"
//       ? "My projects"
//       : value === "work"
//         ? "Client work"
//         : "All projects";

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           className="h-9 rounded-lg bg-background px-3 text-xs font-semibold shadow-none"
//         >
//           <Layers3Icon size={13} />
//           {label}
//           <ChevronDownIcon size={13} />
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         className="w-56 rounded-xl border-border/80 p-1.5 shadow-lg"
//       >
//         <DropdownMenuLabel className="px-2.5 py-2">
//           <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//             Calendar scope
//           </p>
//         </DropdownMenuLabel>

//         <DropdownMenuSeparator />

//         <ScopeMenuItem
//           active={value === "all"}
//           icon={Layers3Icon}
//           label="All projects"
//           onSelect={() => onChange("all")}
//         />

//         <ScopeMenuItem
//           active={value === "mine"}
//           icon={BriefcaseBusinessIcon}
//           label="My projects"
//           count={ownedCount}
//           onSelect={() => onChange("mine")}
//         />

//         {isAllocat && (
//           <ScopeMenuItem
//             active={value === "work"}
//             icon={FolderOpenIcon}
//             label="Client work"
//             count={workCount}
//             onSelect={() => onChange("work")}
//           />
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// function ScopeMenuItem({
//   active,
//   icon: Icon,
//   label,
//   count,
//   onSelect,
// }: {
//   active: boolean;
//   icon: ComponentType<{
//     size?: number;
//     className?: string;
//   }>;
//   label: string;
//   count?: number;
//   onSelect: () => void;
// }) {
//   return (
//     <DropdownMenuItem
//       onSelect={onSelect}
//       className={[
//         "rounded-lg px-3 py-2.5 text-xs",
//         active ? "bg-muted/60 font-semibold" : "",
//       ].join(" ")}
//     >
//       <Icon
//         size={13}
//         className="text-muted-foreground"
//       />

//       <span className="flex-1">
//         {label}
//       </span>

//       {typeof count === "number" && (
//         <span className="text-[0.6rem] tabular-nums text-muted-foreground">
//           {count}
//         </span>
//       )}

//       {active && (
//         <CheckIcon
//           size={12}
//           strokeWidth={3}
//           className="ml-1"
//         />
//       )}
//     </DropdownMenuItem>
//   );
// }

// /* =========================================================
//    MONTH VIEW
// ========================================================= */

// function MonthView({
//   days,
//   items,
//   currentProjectId,
//   onItemClick,
// }: {
//   days: CalendarDay[];
//   items: CalendarItem[];
//   currentProjectId: string;
//   onItemClick: (item: CalendarItem) => void;
// }) {
//   return (
//     <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
//       <div className="min-w-[760px]">
//         <div className="grid grid-cols-7 border-b border-border/70 bg-muted/[0.12]">
//           {WEEK_DAYS.map(day => (
//             <div
//               key={day}
//               className="px-2 py-3 text-center text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7">
//           {days.map((day, index) => {
//             const dayItems = items
//               .filter(item =>
//                 isSameDay(
//                   parseCalendarDate(item.start),
//                   day.date,
//                 ),
//               )
//               .sort(compareCalendarItems);

//             return (
//               <MonthDay
//                 key={toDateKey(day.date)}
//                 day={day}
//                 items={dayItems}
//                 currentProjectId={currentProjectId}
//                 onItemClick={onItemClick}
//                 isLastColumn={(index + 1) % 7 === 0}
//                 isLastRow={index >= 35}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MonthDay({
//   day,
//   items,
//   currentProjectId,
//   onItemClick,
//   isLastColumn,
//   isLastRow,
// }: {
//   day: CalendarDay;
//   items: CalendarItem[];
//   currentProjectId: string;
//   onItemClick: (item: CalendarItem) => void;
//   isLastColumn: boolean;
//   isLastRow: boolean;
// }) {
//   const visibleItems = items.slice(0, 3);
//   const remainingCount = Math.max(0, items.length - visibleItems.length);

//   return (
//     <div
//       className={[
//         "relative min-h-[132px] min-w-0 p-2 transition-colors",
//         !isLastColumn ? "border-r border-border/60" : "",
//         !isLastRow ? "border-b border-border/60" : "",
//         day.inCurrentMonth
//           ? "bg-background"
//           : "bg-muted/[0.1]",
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "flex h-7 w-7 items-center justify-center rounded-full",
//           "text-xs font-semibold tabular-nums",
//           day.isToday
//             ? "bg-primary text-secondary"
//             : day.inCurrentMonth
//               ? "text-foreground"
//               : "text-muted-foreground/45",
//         ].join(" ")}
//       >
//         {day.date.getDate()}
//       </span>

//       <div className="mt-2 space-y-1">
//         {visibleItems.map(item => (
//           <CalendarItemButton
//             key={item.id}
//             item={item}
//             current={
//               Boolean(item.projectId) &&
//               String(item.projectId) === String(currentProjectId)
//             }
//             compact
//             onClick={() => onItemClick(item)}
//           />
//         ))}

//         {remainingCount > 0 && (
//           <p className="px-1 pt-1 text-[0.6rem] font-semibold text-muted-foreground">
//             +{remainingCount} more
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    WEEK VIEW
// ========================================================= */

// function WeekView({
//   days,
//   items,
//   currentProjectId,
//   onItemClick,
// }: {
//   days: Date[];
//   items: CalendarItem[];
//   currentProjectId: string;
//   onItemClick: (item: CalendarItem) => void;
// }) {
//   const allDayItems = items.filter(item => item.allDay);
//   const timedItems = items.filter(item => !item.allDay);
//   const timelineHeight = WEEK_HOURS.length * HOUR_HEIGHT;

//   return (
//     <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
//       <div className="min-w-[900px]">
//         {/* HEADER */}

//         <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border/70">
//           <div />

//           {days.map(date => {
//             const today = isSameDay(date, new Date());

//             return (
//               <div
//                 key={toDateKey(date)}
//                 className="border-l border-border/60 px-3 py-3 text-center"
//               >
//                 <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
//                   {formatWeekday(date)}
//                 </p>

//                 <span
//                   className={[
//                     "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full",
//                     "text-sm font-bold tabular-nums",
//                     today ? "bg-primary text-secondary" : "",
//                   ].join(" ")}
//                 >
//                   {date.getDate()}
//                 </span>
//               </div>
//             );
//           })}
//         </div>

//         {/* ALL DAY */}

//         <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border/70">
//           <div className="px-2 py-3 text-right text-[0.58rem] font-medium text-muted-foreground">
//             All day
//           </div>

//           {days.map(date => {
//             const dayItems = allDayItems
//               .filter(item =>
//                 isSameDay(parseCalendarDate(item.start), date),
//               )
//               .sort(compareCalendarItems);

//             return (
//               <div
//                 key={toDateKey(date)}
//                 className="min-h-20 space-y-1 border-l border-border/60 p-1.5"
//               >
//                 {dayItems.map(item => (
//                   <CalendarItemButton
//                     key={item.id}
//                     item={item}
//                     current={
//                       Boolean(item.projectId) &&
//                       String(item.projectId) === String(currentProjectId)
//                     }
//                     compact
//                     onClick={() => onItemClick(item)}
//                   />
//                 ))}
//               </div>
//             );
//           })}
//         </div>

//         {/* TIMELINE */}

//         <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
//           <div className="relative" style={{ height: timelineHeight }}>
//             {WEEK_HOURS.map((hour, index) => (
//               <div
//                 key={hour}
//                 className="absolute left-0 right-0 border-t border-border/50"
//                 style={{ top: index * HOUR_HEIGHT }}
//               >
//                 <span className="absolute -top-2 right-2 bg-background px-1 text-[0.58rem] text-muted-foreground">
//                   {formatHour(hour)}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {days.map(date => {
//             const dayItems = timedItems
//               .filter(item =>
//                 isSameDay(parseCalendarDate(item.start), date),
//               )
//               .sort(compareCalendarItems);

//             return (
//               <WeekDayColumn
//                 key={toDateKey(date)}
//                 items={dayItems}
//                 currentProjectId={currentProjectId}
//                 height={timelineHeight}
//                 onItemClick={onItemClick}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// function WeekDayColumn({
//   items,
//   currentProjectId,
//   height,
//   onItemClick,
// }: {
//   items: CalendarItem[];
//   currentProjectId: string;
//   height: number;
//   onItemClick: (item: CalendarItem) => void;
// }) {
//   return (
//     <div
//       className="relative border-l border-border/60"
//       style={{ height }}
//     >
//       {WEEK_HOURS.map((hour, index) => (
//         <div
//           key={hour}
//           className="absolute left-0 right-0 border-t border-border/50"
//           style={{ top: index * HOUR_HEIGHT }}
//         />
//       ))}

//       {items.map(item => {
//         const start = parseCalendarDate(item.start);
//         const end = item.end
//           ? parseCalendarDate(item.end)
//           : addMinutes(start, 50);

//         const startMinutes =
//           (start.getHours() - WEEK_START_HOUR) * 60 +
//           start.getMinutes();

//         const durationMinutes = Math.max(
//           30,
//           (end.getTime() - start.getTime()) / 60000,
//         );

//         const top = Math.max(
//           0,
//           (startMinutes / 60) * HOUR_HEIGHT,
//         );

//         const itemHeight = Math.max(
//           34,
//           (durationMinutes / 60) * HOUR_HEIGHT,
//         );

//         return (
//           <div
//             key={item.id}
//             className="absolute left-1 right-1 z-10 overflow-hidden"
//             style={{
//               top,
//               height: Math.min(itemHeight, height - top),
//             }}
//           >
//             <CalendarItemButton
//               item={item}
//               current={
//                 Boolean(item.projectId) &&
//                 String(item.projectId) === String(currentProjectId)
//               }
//               fill
//               onClick={() => onItemClick(item)}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// /* =========================================================
//    CALENDAR ITEM
// ========================================================= */

// function CalendarItemButton({
//   item,
//   current,
//   compact = false,
//   fill = false,
//   onClick,
// }: {
//   item: CalendarItem;
//   current: boolean;
//   compact?: boolean;
//   fill?: boolean;
//   onClick: () => void;
// }) {
//   const timed = !item.allDay;

//   const icon =
//     item.type === "plan-block" ? (
//       <Clock3Icon size={10} className="shrink-0 opacity-70" />
//     ) : item.type === "task" ? (
//       <CheckCircle2Icon size={10} className="shrink-0 opacity-70" />
//     ) : item.type === "project-due" ? (
//       <Clock3Icon size={10} className="shrink-0 opacity-70" />
//     ) : (
//       <CalendarDaysIcon size={10} className="shrink-0 opacity-70" />
//     );

//   return (
//     <motion.button
//       layout
//       type="button"
//       onClick={onClick}
//       whileHover={{ y: -1 }}
//       transition={{ duration: 0.15 }}
//       title={`${item.title} · ${item.projectTitle}`}
//       className={[
//         "group/event block w-full min-w-0 rounded-md border text-left",
//         "transition-[background-color,border-color,box-shadow]",
//         fill ? "h-full" : "",
//         item.type === "plan-block"
//           ? "border-primary/15 bg-secondary text-secondary-foreground hover:border-primary/25"
//           : current
//             ? "border-primary bg-primary text-secondary shadow-[0_10px_24px_-18px_rgba(0,0,0,0.55)]"
//             : item.relationship === "allocat"
//               ? "border-primary/10 bg-primary/[0.045] text-foreground hover:border-primary/20 hover:bg-primary/[0.065]"
//               : "border-border/60 bg-muted/40 text-foreground hover:border-foreground/10 hover:bg-muted/60",
//         compact ? "px-2 py-1.5" : "px-2.5 py-2",
//       ].join(" ")}
//     >
//       <div className="flex min-w-0 items-center gap-1.5">
//         {icon}

//         <span
//           className={[
//             "truncate font-semibold",
//             compact ? "text-[0.61rem]" : "text-[0.67rem]",
//           ].join(" ")}
//         >
//           {timed && (
//             <span className="mr-1 opacity-65">
//               {formatTime(parseCalendarDate(item.start))}
//             </span>
//           )}

//           {item.title}
//         </span>
//       </div>

//       {!compact && (
//         <p
//           className={[
//             "mt-1 truncate text-[0.56rem]",
//             item.type === "plan-block"
//               ? "opacity-70"
//               : current
//                 ? "text-secondary/65"
//                 : "text-muted-foreground",
//           ].join(" ")}
//         >
//           {item.type === "plan-block"
//             ? item.projectTitle || "My plan"
//             : item.relationship === "allocat"
//               ? `Client work · ${item.projectTitle}`
//               : `My project · ${item.projectTitle}`}
//         </p>
//       )}
//     </motion.button>
//   );
// }

// /* =========================================================
//    DETAIL PANEL
// ========================================================= */

// function CalendarDetailPanel({
//   item,
//   isFocused,
//   onClose,
//   onOpenProject,
//   onToggleFocus,
//   onEdit,
//   onDelete,
// }: {
//   item: CalendarItem;
//   isFocused: boolean;
//   onClose: () => void;
//   onOpenProject: () => void;
//   onToggleFocus?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
// }) {
//   const start = parseCalendarDate(item.start);
//   const end = item.end ? parseCalendarDate(item.end) : null;

//   return (
//     <>
//       <motion.button
//         type="button"
//         aria-label="Close calendar details"
//         className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[1px]"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//       />

//       <motion.aside
//         initial={{ x: 32, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         exit={{ x: 32, opacity: 0 }}
//         transition={{ duration: 0.2, ease: "easeOut" }}
//         className="fixed inset-y-0 right-0 z-[80] w-full max-w-md overflow-y-auto border-l border-border bg-background p-5 shadow-2xl sm:p-6"
//       >
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//               {item.type === "plan-block"
//                 ? "My plan"
//                 : item.relationship === "allocat"
//                   ? "Client work"
//                   : "Project work"}
//             </p>

//             <h2 className="mt-2 text-xl font-black tracking-[-0.025em]">
//               {item.title}
//             </h2>
//           </div>

//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             className="h-9 w-9 shrink-0 rounded-lg shadow-none"
//           >
//             <XIcon size={16} />
//           </Button>
//         </div>

//         <div className="mt-6 space-y-5">
//           <DetailRow
//             label="Project"
//             value={item.projectTitle || "Personal planning"}
//           />

//           <DetailRow
//             label="When"
//             value={formatItemTimeRange(start, end, item.allDay)}
//           />

//           {item.type !== "plan-block" && (
//             <DetailRow
//               label="Status"
//               value={formatStatus(item.status)}
//             />
//           )}

//           <DetailRow
//             label="Timing"
//             value={getDeadlineIntelligence(item)}
//           />

//           {(item.description || item.notes) && (
//             <div>
//               <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//                 Notes
//               </p>

//               <p className="mt-2 text-sm leading-6 text-foreground/80">
//                 {item.notes || item.description}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="mt-8 space-y-2 border-t border-border/70 pt-5">
//           {onToggleFocus && (
//             <Button
//               type="button"
//               variant={isFocused ? "outline" : "default"}
//               onClick={onToggleFocus}
//               className="h-10 w-full justify-start rounded-lg text-xs font-semibold shadow-none"
//             >
//               <StarIcon size={13} />
//               {isFocused
//                 ? "Remove from weekly focus"
//                 : "Add to weekly focus"}
//             </Button>
//           )}

//           {onEdit && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onEdit}
//               className="h-10 w-full justify-start rounded-lg bg-transparent text-xs font-semibold shadow-none"
//             >
//               <PencilIcon size={13} />
//               Reschedule or edit
//             </Button>
//           )}

//           {item.projectId && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onOpenProject}
//               className="h-10 w-full justify-start rounded-lg bg-transparent text-xs font-semibold shadow-none"
//             >
//               <FolderOpenIcon size={13} />
//               Open project
//             </Button>
//           )}

//           {onDelete && (
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={onDelete}
//               className="h-10 w-full justify-start rounded-lg text-xs font-semibold text-destructive shadow-none hover:bg-destructive/[0.05] hover:text-destructive"
//             >
//               <Trash2Icon size={13} />
//               Delete planning block
//             </Button>
//           )}
//         </div>
//       </motion.aside>
//     </>
//   );
// }

// function DetailRow({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div>
//       <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//         {label}
//       </p>

//       <p className="mt-1.5 text-sm font-semibold">
//         {value}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    PLANNING BLOCK EDITOR
// ========================================================= */

// type PlanningBlockPayload = {
//   projectId: string | null;
//   taskId: string | null;
//   title: string;
//   notes: string | null;
//   startAt: string;
//   endAt: string;
// };

// function PlanningBlockEditor({
//   projects,
//   block,
//   defaultDate,
//   saving,
//   onClose,
//   onSave,
// }: {
//   projects: Project[];
//   block: CalendarPlanningBlock | null;
//   defaultDate: string;
//   saving: boolean;
//   onClose: () => void;
//   onSave: (payload: PlanningBlockPayload) => Promise<void>;
// }) {
//   const initialStart = block
//     ? parseCalendarDate(block.startAt)
//     : null;

//   const initialEnd = block
//     ? parseCalendarDate(block.endAt)
//     : null;

//   const [title, setTitle] = useState(block?.title ?? "");
//   const [notes, setNotes] = useState(block?.notes ?? "");
//   const [projectId, setProjectId] = useState(block?.projectId ?? "");
//   const [date, setDate] = useState(
//     initialStart ? toDateKey(initialStart) : defaultDate,
//   );
//   const [startTime, setStartTime] = useState(
//     initialStart ? toTimeInput(initialStart) : "09:00",
//   );
//   const [endTime, setEndTime] = useState(
//     initialEnd ? toTimeInput(initialEnd) : "10:00",
//   );
//   const [formError, setFormError] = useState<string | null>(null);

//   async function handleSubmit(event: FormEvent) {
//     event.preventDefault();
//     setFormError(null);

//     const cleanTitle = title.trim();

//     if (!cleanTitle) {
//       setFormError("Give this planning block a title.");
//       return;
//     }

//     const startAt = localDateTimeToIso(date, startTime);
//     const endAt = localDateTimeToIso(date, endTime);

//     if (new Date(endAt) <= new Date(startAt)) {
//       setFormError("End time must be after the start time.");
//       return;
//     }

//     try {
//       await onSave({
//         projectId: projectId || null,
//         taskId: null,
//         title: cleanTitle,
//         notes: notes.trim() || null,
//         startAt,
//         endAt,
//       });
//     } catch (saveError) {
//       setFormError(
//         saveError instanceof Error
//           ? saveError.message
//           : "The planning block could not be saved.",
//       );
//     }
//   }

//   return (
//     <>
//       <motion.button
//         type="button"
//         aria-label="Close planning editor"
//         className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[1px]"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 14, scale: 0.99 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: 14, scale: 0.99 }}
//         transition={{ duration: 0.18 }}
//         className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-6"
//       >
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
//               Personal planning
//             </p>

//             <h2 className="mt-2 text-xl font-black tracking-[-0.025em]">
//               {block ? "Edit planning block" : "Plan time"}
//             </h2>
//           </div>

//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             className="h-9 w-9 rounded-lg shadow-none"
//           >
//             <XIcon size={16} />
//           </Button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="mt-6 space-y-4"
//         >
//           <CalendarField label="Title">
//             <input
//               value={title}
//               onChange={event => setTitle(event.target.value)}
//               maxLength={180}
//               placeholder="e.g. Homepage concepts"
//               className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
//             />
//           </CalendarField>

//           <CalendarField label="Project">
//             <select
//               value={projectId}
//               onChange={event => setProjectId(event.target.value)}
//               className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
//             >
//               <option value="">
//                 Personal / no project
//               </option>

//               {projects.map(project => (
//                 <option
//                   key={project.id}
//                   value={project.id}
//                 >
//                   {project.title}
//                 </option>
//               ))}
//             </select>
//           </CalendarField>

//           <CalendarField label="Date">
//             <input
//               type="date"
//               value={date}
//               onChange={event => setDate(event.target.value)}
//               className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
//             />
//           </CalendarField>

//           <div className="grid grid-cols-2 gap-3">
//             <CalendarField label="Start">
//               <input
//                 type="time"
//                 value={startTime}
//                 onChange={event => setStartTime(event.target.value)}
//                 className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
//               />
//             </CalendarField>

//             <CalendarField label="End">
//               <input
//                 type="time"
//                 value={endTime}
//                 onChange={event => setEndTime(event.target.value)}
//                 className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
//               />
//             </CalendarField>
//           </div>

//           <CalendarField label="Notes">
//             <textarea
//               value={notes}
//               onChange={event => setNotes(event.target.value)}
//               maxLength={1200}
//               rows={4}
//               placeholder="Optional context for yourself"
//               className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
//             />
//           </CalendarField>

//           {formError && (
//             <p className="rounded-lg bg-destructive/[0.06] px-3 py-2 text-xs font-medium text-destructive">
//               {formError}
//             </p>
//           )}

//           <div className="flex justify-end gap-2 pt-2">
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={onClose}
//               disabled={saving}
//               className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               disabled={saving}
//               className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
//             >
//               {saving && (
//                 <LoaderCircleIcon
//                   size={13}
//                   className="animate-spin"
//                 />
//               )}

//               {block ? "Save changes" : "Add to plan"}
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </>
//   );
// }

// function CalendarField({
//   label,
//   children,
// }: {
//   label: string;
//   children: ReactNode;
// }) {
//   return (
//     <label className="block">
//       <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
//         {label}
//       </span>

//       {children}
//     </label>
//   );
// }

// /* =========================================================
//    LEGEND
// ========================================================= */

// function CalendarLegend({
//   showClientWork,
// }: {
//   showClientWork: boolean;
// }) {
//   return (
//     <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.62rem] text-muted-foreground">
//       <LegendItem
//         surface="bg-primary"
//         label="Current project"
//       />

//       <LegendItem
//         surface="bg-muted"
//         label="My projects"
//       />

//       {showClientWork && (
//         <LegendItem
//           surface="bg-primary/[0.08]"
//           label="Client work"
//         />
//       )}

//       <LegendItem
//         surface="bg-secondary"
//         label="My plan"
//       />
//     </div>
//   );
// }

// function LegendItem({
//   surface,
//   label,
// }: {
//   surface: string;
//   label: string;
// }) {
//   return (
//     <span className="inline-flex items-center gap-2">
//       <span
//         className={[
//           "h-2.5 w-2.5 rounded-sm border border-border/60",
//           surface,
//         ].join(" ")}
//       />

//       {label}
//     </span>
//   );
// }

// /* =========================================================
//    LOADING / ERROR
// ========================================================= */

// function CalendarLoading() {
//   return (
//     <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-border/70">
//       <div className="text-center">
//         <LoaderCircleIcon
//           size={20}
//           className="mx-auto animate-spin text-primary"
//         />

//         <p className="mt-3 text-xs font-medium text-muted-foreground">
//           Loading calendar
//         </p>
//       </div>
//     </div>
//   );
// }

// function CalendarError({
//   message,
//   onRetry,
//   onDismiss,
// }: {
//   message: string;
//   onRetry: () => void;
//   onDismiss: () => void;
// }) {
//   return (
//     <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border/70">
//       <div className="max-w-sm text-center">
//         <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
//           <RefreshCwIcon size={17} />
//         </span>

//         <h2 className="mt-4 text-base font-bold tracking-[-0.015em]">
//           Could not load calendar
//         </h2>

//         <p className="mt-2 text-xs leading-6 text-muted-foreground">
//           {message}
//         </p>

//         <div className="mt-5 flex justify-center gap-2">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={onDismiss}
//             className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
//           >
//             Dismiss
//           </Button>

//           <Button
//             type="button"
//             variant="outline"
//             onClick={onRetry}
//             className="h-9 rounded-lg bg-transparent px-4 text-xs font-semibold shadow-none"
//           >
//             <RefreshCwIcon size={13} />
//             Try again
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    PLANNING INTELLIGENCE
// ========================================================= */

// function buildPlanningInsights(
//   weekStart: Date,
//   weekEnd: Date,
//   items: CalendarItem[],
//   planningBlocks: CalendarPlanningBlock[],
// ): PlanningInsights {
//   const blocks = planningBlocks
//     .map(block => ({
//       ...block,
//       startDate: parseCalendarDate(block.startAt),
//       endDate: parseCalendarDate(block.endAt),
//     }))
//     .filter(block =>
//       block.endDate > weekStart &&
//       block.startDate < weekEnd,
//     );

//   const plannedHours = blocks.reduce((total, block) => {
//     const start = new Date(
//       Math.max(block.startDate.getTime(), weekStart.getTime()),
//     );

//     const end = new Date(
//       Math.min(block.endDate.getTime(), weekEnd.getTime()),
//     );

//     return total + Math.max(0, (end.getTime() - start.getTime()) / 3600000);
//   }, 0);

//   const ratio = plannedHours / WEEKLY_CAPACITY_HOURS;

//   const workloadLabel: PlanningInsights["workloadLabel"] =
//     ratio > 1
//       ? "Overloaded"
//       : ratio >= 0.8
//         ? "Busy"
//         : ratio >= 0.5
//           ? "Balanced"
//           : "Light";

//   const alerts: string[] = [];

//   const overlappingPairs = findOverlappingBlocks(blocks);

//   if (overlappingPairs > 0) {
//     alerts.push(
//       `${overlappingPairs} planning ${overlappingPairs === 1 ? "overlap" : "overlaps"}`,
//     );
//   }

//   const dayStats = Array.from({ length: 7 }, (_, index) => {
//     const date = addDays(weekStart, index);

//     const hours = blocks
//       .filter(block => isSameDay(block.startDate, date))
//       .reduce(
//         (total, block) =>
//           total +
//           Math.max(
//             0,
//             (block.endDate.getTime() - block.startDate.getTime()) / 3600000,
//           ),
//         0,
//       );

//     const deadlineCount = items.filter(item =>
//       item.type !== "plan-block" &&
//       isSameDay(parseCalendarDate(item.start), date),
//     ).length;

//     return {
//       date,
//       hours,
//       deadlineCount,
//     };
//   });

//   const busiestDay = dayStats.find(
//     day => day.hours > 8 || day.deadlineCount >= 3,
//   );

//   if (busiestDay) {
//     alerts.push(
//       `${formatWeekday(busiestDay.date)} looks busy`,
//     );
//   }

//   if (plannedHours > WEEKLY_CAPACITY_HOURS) {
//     alerts.push(
//       `${formatHours(plannedHours - WEEKLY_CAPACITY_HOURS)}h over weekly capacity`,
//     );
//   }

//   const deadlineCount = items.filter(item => {
//     if (item.type === "plan-block") return false;

//     const start = parseCalendarDate(item.start);
//     return start >= weekStart && start < weekEnd;
//   }).length;

//   return {
//     plannedHours,
//     capacityHours: WEEKLY_CAPACITY_HOURS,
//     workloadLabel,
//     deadlineCount,
//     alerts,
//   };
// }

// function findOverlappingBlocks(
//   blocks: Array<{
//     startDate: Date;
//     endDate: Date;
//   }>,
// ) {
//   let overlaps = 0;

//   const sorted = [...blocks].sort(
//     (first, second) =>
//       first.startDate.getTime() - second.startDate.getTime(),
//   );

//   for (let firstIndex = 0; firstIndex < sorted.length; firstIndex += 1) {
//     for (
//       let secondIndex = firstIndex + 1;
//       secondIndex < sorted.length;
//       secondIndex += 1
//     ) {
//       const first = sorted[firstIndex];
//       const second = sorted[secondIndex];

//       if (second.startDate >= first.endDate) break;

//       if (
//         second.startDate < first.endDate &&
//         second.endDate > first.startDate
//       ) {
//         overlaps += 1;
//       }
//     }
//   }

//   return overlaps;
// }

// /* =========================================================
//    DATE HELPERS
// ========================================================= */

// function startOfDay(date: Date) {
//   return new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate(),
//   );
// }

// function startOfMonth(date: Date) {
//   return new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     1,
//   );
// }

// function startOfWeek(date: Date) {
//   const result = startOfDay(date);
//   const day = result.getDay();
//   const difference = day === 0 ? -6 : 1 - day;

//   result.setDate(result.getDate() + difference);
//   return result;
// }

// function addDays(date: Date, amount: number) {
//   const result = new Date(date);
//   result.setDate(result.getDate() + amount);
//   return result;
// }

// function addMonths(date: Date, amount: number) {
//   return new Date(
//     date.getFullYear(),
//     date.getMonth() + amount,
//     1,
//   );
// }

// function addMinutes(date: Date, amount: number) {
//   return new Date(date.getTime() + amount * 60000);
// }

// function isSameDay(first: Date, second: Date) {
//   return (
//     first.getFullYear() === second.getFullYear() &&
//     first.getMonth() === second.getMonth() &&
//     first.getDate() === second.getDate()
//   );
// }

// function parseCalendarDate(value: string) {
//   return new Date(value);
// }

// function toDateKey(date: Date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function toTimeInput(date: Date) {
//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   return `${hours}:${minutes}`;
// }

// function localDateTimeToIso(
//   date: string,
//   time: string,
// ) {
//   return new Date(`${date}T${time}:00`).toISOString();
// }

// /* =========================================================
//    FORMAT HELPERS
// ========================================================= */

// function formatCalendarHeading(
//   date: Date,
//   view: CalendarView,
// ) {
//   if (view === "month") {
//     return new Intl.DateTimeFormat("en", {
//       month: "long",
//       year: "numeric",
//     }).format(date);
//   }

//   const start = startOfWeek(date);
//   const end = addDays(start, 6);

//   const sameMonth =
//     start.getMonth() === end.getMonth() &&
//     start.getFullYear() === end.getFullYear();

//   if (sameMonth) {
//     const monthYear = new Intl.DateTimeFormat("en", {
//       month: "long",
//       year: "numeric",
//     }).format(start);

//     return `${start.getDate()}-${end.getDate()} ${monthYear}`;
//   }

//   const startLabel = new Intl.DateTimeFormat("en", {
//     day: "numeric",
//     month: "short",
//   }).format(start);

//   const endLabel = new Intl.DateTimeFormat("en", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   }).format(end);

//   return `${startLabel} - ${endLabel}`;
// }

// function formatWeekday(date: Date) {
//   return new Intl.DateTimeFormat("en", {
//     weekday: "short",
//   }).format(date);
// }

// function formatHour(hour: number) {
//   return new Intl.DateTimeFormat("en", {
//     hour: "numeric",
//   }).format(
//     new Date(2026, 0, 1, hour),
//   );
// }

// function formatTime(date: Date) {
//   return new Intl.DateTimeFormat("en", {
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(date);
// }

// function formatShortDate(date: Date) {
//   return new Intl.DateTimeFormat("en", {
//     day: "numeric",
//     month: "short",
//   }).format(date);
// }

// function formatUpcomingDate(date: Date) {
//   if (isSameDay(date, new Date())) {
//     return "Today";
//   }

//   if (isSameDay(date, addDays(new Date(), 1))) {
//     return "Tomorrow";
//   }

//   return new Intl.DateTimeFormat("en", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//   }).format(date);
// }

// function formatHours(value: number) {
//   return Number.isInteger(value)
//     ? String(value)
//     : value.toFixed(1);
// }

// function formatStatus(status: string) {
//   if (!status) return "Not set";

//   return status
//     .replace(/[-_]/g, " ")
//     .replace(/\b\w/g, letter => letter.toUpperCase());
// }

// function formatItemTimeRange(
//   start: Date,
//   end: Date | null,
//   allDay: boolean,
// ) {
//   const date = new Intl.DateTimeFormat("en", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   }).format(start);

//   if (allDay) {
//     return `${date} · All day`;
//   }

//   if (!end) {
//     return `${date} · ${formatTime(start)}`;
//   }

//   return `${date} · ${formatTime(start)} - ${formatTime(end)}`;
// }

// function getDeadlineIntelligence(item: CalendarItem) {
//   if (item.type === "plan-block") {
//     return "Personal time reserved on your plan.";
//   }

//   const eventDate = startOfDay(parseCalendarDate(item.start));
//   const today = startOfDay(new Date());
//   const days = Math.round(
//     (eventDate.getTime() - today.getTime()) / 86400000,
//   );

//   if (days === 0) return "Today";
//   if (days === 1) return "Tomorrow";
//   if (days > 1) return `In ${days} days`;
//   if (days === -1) return "Overdue by 1 day";

//   return `Overdue by ${Math.abs(days)} days`;
// }

// /* =========================================================
//    SORT / ERROR HELPERS
// ========================================================= */

// function compareCalendarItems(
//   first: CalendarItem,
//   second: CalendarItem,
// ) {
//   if (first.allDay !== second.allDay) {
//     return first.allDay ? -1 : 1;
//   }

//   return (
//     parseCalendarDate(first.start).getTime() -
//     parseCalendarDate(second.start).getTime()
//   );
// }

// function getAxiosMessage(
//   error: unknown,
//   fallback: string,
// ) {
//   if (
//     axios.isAxiosError(error) &&
//     typeof error.response?.data?.message === "string"
//   ) {
//     return error.response.data.message;
//   }

//   return fallback;
// }

// export default Calendar;


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

  const [anchorDate, setAnchorDate] = useState(
    () => startOfDay(new Date()),
  );

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [planningBlocks, setPlanningBlocks] =
    useState<CalendarPlanningBlock[]>([]);
  const [focusTasks, setFocusTasks] =
    useState<CalendarFocusTask[]>([]);

  const [selectedItem, setSelectedItem] =
    useState<CalendarItem | null>(null);

  const [editingBlock, setEditingBlock] =
    useState<CalendarPlanningBlock | null>(null);

  const [planEditorOpen, setPlanEditorOpen] =
    useState(false);

  const [planningOpen, setPlanningOpen] =
    useState(false);

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

  const focusWeekStartKey =
    toDateKey(focusWeekStart);

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

      const requestVersion =
        ++requestVersionRef.current;

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
          typeof requestError.response?.data?.message ===
            "string"
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

  const calendarItems =
    useMemo<CalendarItem[]>(() => {
      const projectEvents: CalendarItem[] =
        events.map(event => ({
          ...event,
          source: "event",
          sourceId: event.id,
        }));

      const planItems: CalendarItem[] =
        planningBlocks.map(block => ({
          id: `planning-${block.id}`,
          source: "planning",
          sourceId: block.id,
          type: "plan-block",
          projectId: block.projectId,
          taskId: block.taskId,
          projectTitle:
            block.projectTitle ??
            "Personal planning",
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
      if (
        item.relationship === "planning"
      ) {
        return true;
      }

      if (scope === "mine") {
        return (
          item.relationship === "owner"
        );
      }

      if (scope === "work") {
        return (
          item.relationship === "allocat"
        );
      }

      return true;
    });
  }, [calendarItems, scope]);

  /* =======================================================
     MONTH / WEEK DAYS
  ======================================================= */

  const monthDays =
    useMemo<CalendarDay[]>(() => {
      const currentMonth =
        anchorDate.getMonth();

      const start = startOfWeek(
        startOfMonth(anchorDate),
      );

      const today = new Date();

      return Array.from(
        { length: 42 },
        (_, index) => {
          const date =
            addDays(start, index);

          return {
            date,
            inCurrentMonth:
              date.getMonth() ===
              currentMonth,
            isToday: isSameDay(
              date,
              today,
            ),
          };
        },
      );
    }, [anchorDate]);

  const weekDays = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, index) =>
        addDays(
          focusWeekStart,
          index,
        ),
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
      .filter(
        item =>
          parseCalendarDate(
            item.start,
          ) >= now,
      )
      .sort(compareCalendarItems)
      .slice(0, 4);
  }, [calendarItems]);

  const ownedEventCount = useMemo(
    () =>
      events.filter(
        event =>
          event.relationship ===
          "owner",
      ).length,
    [events],
  );

  const workEventCount = useMemo(
    () =>
      events.filter(
        event =>
          event.relationship ===
          "allocat",
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

  async function toggleFocus(
    taskId: string,
  ) {
    const focused =
      focusTasks.some(
        task =>
          task.taskId === taskId,
      );

    try {
      const response = focused
        ? await api.delete<
            CalendarFocusTask[]
          >(
            `/calendar/focus/${taskId}`,
            {
              params: {
                weekStart:
                  focusWeekStartKey,
              },
              withCredentials: true,
            },
          )
        : await api.put<
            CalendarFocusTask[]
          >(
            `/calendar/focus/${taskId}`,
            null,
            {
              params: {
                weekStart:
                  focusWeekStartKey,
              },
              withCredentials: true,
            },
          );

      setFocusTasks(response.data);
    } catch (requestError) {
      const message =
        getAxiosMessage(
          requestError,
          "The weekly focus could not be updated.",
        );

      setError(message);
    }
  }

  /* =======================================================
     PLANNING BLOCK ACTIONS
  ======================================================= */

  function createPlanningBlock() {
    setEditingBlock(null);
    setPlanEditorOpen(true);
  }

  function editPlanningBlock(
    item: CalendarItem,
  ) {
    if (
      item.source !== "planning"
    ) {
      return;
    }

    const block =
      planningBlocks.find(
        planningBlock =>
          planningBlock.id ===
          item.sourceId,
      );

    if (!block) {
      return;
    }

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
          {
            withCredentials: true,
          },
        );
      } else {
        await api.post(
          "/calendar/plan-blocks",
          payload,
          {
            withCredentials: true,
          },
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

  async function deletePlanningBlock(
    item: CalendarItem,
  ) {
    if (
      item.source !== "planning"
    ) {
      return;
    }

    try {
      await api.delete(
        `/calendar/plan-blocks/${item.sourceId}`,
        {
          withCredentials: true,
        },
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
     UI
  ======================================================= */

  return (
    <div className="min-w-0">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-secondary">
            <CalendarDaysIcon
              size={16}
            />
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                Calendar
              </h1>

              <span className="hidden h-1 w-1 shrink-0 rounded-full bg-muted-foreground/35 sm:block" />

              <span className="hidden max-w-52 truncate text-xs font-medium text-muted-foreground sm:block">
                {currentProject.title}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Plan across your
              projects and client
              work.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CalendarScopeControl
            value={scope}
            onChange={setScope}
            isAllocat={isAllocat}
            ownedCount={
              ownedEventCount
            }
            workCount={
              workEventCount
            }
          />

          <Button
            type="button"
            onClick={
              createPlanningBlock
            }
            className="h-9 rounded-lg px-3 text-xs font-semibold shadow-none"
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

      {/* PERIOD TOOLBAR */}

      <div className="mt-4 flex flex-col gap-3 border-y border-border/70 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.h2
              key={`${view}-${formatCalendarHeading(
                anchorDate,
                view,
              )}`}
              initial={{
                opacity: 0,
                y: 3,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -3,
              }}
              transition={{
                duration: 0.14,
              }}
              className="truncate text-base font-black tracking-[-0.02em] sm:text-lg"
            >
              {formatCalendarHeading(
                anchorDate,
                view,
              )}
            </motion.h2>
          </AnimatePresence>

          <span className="hidden rounded-full bg-muted/60 px-2 py-1 text-[0.6rem] font-semibold text-muted-foreground md:inline-flex">
            {visibleItems.length}{" "}
            {visibleItems.length ===
            1
              ? "item"
              : "items"}
          </span>

          <span className="hidden items-center gap-1.5 text-[0.6rem] text-muted-foreground lg:inline-flex">
            <CircleDotIcon
              size={10}
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
            className="h-8 rounded-lg px-2.5 text-[0.68rem] font-semibold text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
          >
            <RotateCcwIcon
              size={12}
            />
            Today
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrevious}
            className="h-8 w-8 rounded-lg text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
            aria-label="Previous period"
          >
            <ChevronLeftIcon
              size={15}
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            className="h-8 w-8 rounded-lg text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
            aria-label="Next period"
          >
            <ChevronRightIcon
              size={15}
            />
          </Button>
        </div>
      </div>

      {/* COMPACT PLANNING BAR */}

      <CalendarPlanningBar
        open={planningOpen}
        onToggle={() =>
          setPlanningOpen(
            current => !current,
          )
        }
        insights={insights}
        focusTasks={focusTasks}
        upcomingItems={
          upcomingItems
        }
        currentProjectId={
          projectId
        }
        onOpenItem={
          setSelectedItem
        }
        onOpenProject={task =>
          navigate(
            `/projects/${task.projectId}`,
          )
        }
        onRemoveFocus={taskId =>
          void toggleFocus(taskId)
        }
      />

      {/* CALENDAR */}

      <div className="mt-3 min-w-0">
        {loading ? (
          <CalendarLoading />
        ) : error ? (
          <CalendarError
            message={error}
            onRetry={() =>
              void fetchCalendarData(
                true,
              )
            }
            onDismiss={() =>
              setError(null)
            }
          />
        ) : (
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.div
              key={`${view}-${rangeStartKey}`}
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -6,
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
            >
              {view === "month" ? (
                <MonthView
                  days={monthDays}
                  items={
                    visibleItems
                  }
                  currentProjectId={
                    projectId
                  }
                  onItemClick={
                    setSelectedItem
                  }
                />
              ) : (
                <WeekView
                  days={weekDays}
                  items={
                    visibleItems
                  }
                  currentProjectId={
                    projectId
                  }
                  onItemClick={
                    setSelectedItem
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!loading && !error && (
        <CalendarLegend
          showClientWork={
            isAllocat
          }
        />
      )}

      {/* DETAIL PANEL */}

      <AnimatePresence>
        {selectedItem && (
          <CalendarDetailPanel
            item={selectedItem}
            isFocused={Boolean(
              selectedItem.taskId &&
                focusTasks.some(
                  task =>
                    task.taskId ===
                    selectedItem.taskId,
                ),
            )}
            onClose={() =>
              setSelectedItem(null)
            }
            onOpenProject={() => {
              if (
                selectedItem.projectId
              ) {
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
              selectedItem.source ===
              "planning"
                ? () =>
                    editPlanningBlock(
                      selectedItem,
                    )
                : undefined
            }
            onDelete={
              selectedItem.source ===
              "planning"
                ? () =>
                    void deletePlanningBlock(
                      selectedItem,
                    )
                : undefined
            }
          />
        )}
      </AnimatePresence>

      {/* PLAN EDITOR */}

      <AnimatePresence>
        {planEditorOpen && (
          <PlanningBlockEditor
            projects={projects}
            block={editingBlock}
            defaultDate={toDateKey(
              anchorDate,
            )}
            saving={savingPlan}
            onClose={() => {
              setPlanEditorOpen(
                false,
              );
              setEditingBlock(null);
            }}
            onSave={
              savePlanningBlock
            }
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
    <div className="mt-3 overflow-hidden rounded-lg border border-border/70 bg-muted/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/20 sm:px-4"
      >
        <div className="flex shrink-0 items-center gap-2">
          <StarIcon
            size={12}
            className="text-primary"
          />

          <span className="text-[0.68rem] font-bold">
            Week plan
          </span>
        </div>

        <span className="hidden h-3 w-px bg-border sm:block" />

        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <PlanningPill>
            {formatHours(
              insights.plannedHours,
            )}
            h /{" "}
            {insights.capacityHours}
            h
          </PlanningPill>

          <PlanningPill>
            {
              insights.workloadLabel
            }
          </PlanningPill>

          <PlanningPill>
            {focusTasks.length} focus
          </PlanningPill>

          <PlanningPill>
            {
              insights.deadlineCount
            }{" "}
            {insights.deadlineCount ===
            1
              ? "deadline"
              : "deadlines"}
          </PlanningPill>

          {insights.alerts.length >
            0 && (
            <span className="hidden items-center gap-1 rounded-full bg-destructive/[0.07] px-2 py-1 text-[0.58rem] font-semibold text-destructive lg:inline-flex">
              <AlertTriangleIcon
                size={10}
              />

              {
                insights.alerts
                  .length
              }
            </span>
          )}

          {nextItem && (
            <span className="ml-auto hidden min-w-0 max-w-64 truncate text-[0.62rem] text-muted-foreground xl:block">
              Next:{" "}
              <span className="font-semibold text-foreground/80">
                {nextItem.title}
              </span>
            </span>
          )}
        </div>

        <ChevronDownIcon
          size={14}
          className={[
            "shrink-0 text-muted-foreground transition-transform duration-200",
            open
              ? "rotate-180"
              : "",
          ].join(" ")}
        />
      </button>

      <AnimatePresence
        initial={false}
      >
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
            <div className="border-t border-border/60 p-3 sm:p-4">
              {insights.alerts
                .length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {insights.alerts.map(
                    alert => (
                      <span
                        key={alert}
                        className="inline-flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 text-[0.62rem] font-medium text-muted-foreground"
                      >
                        <AlertTriangleIcon
                          size={
                            10
                          }
                        />
                        {
                          alert
                        }
                      </span>
                    ),
                  )}
                </div>
              )}

              <div className="grid gap-3 xl:grid-cols-2">
                <WeeklyFocusStrip
                  tasks={
                    focusTasks
                  }
                  onOpenProject={
                    onOpenProject
                  }
                  onRemove={
                    onRemoveFocus
                  }
                />

                <UpcomingStrip
                  items={
                    upcomingItems
                  }
                  currentProjectId={
                    currentProjectId
                  }
                  onOpen={
                    onOpenItem
                  }
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
    <span className="whitespace-nowrap rounded-full bg-muted/60 px-2 py-1 text-[0.58rem] font-semibold text-muted-foreground">
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
    <div className="rounded-lg border border-border/70 bg-background px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StarIcon
              size={12}
              className="text-primary"
            />

            <p className="text-[0.68rem] font-bold">
              Weekly focus
            </p>
          </div>

          <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
            Up to five priorities
            for this week.
          </p>
        </div>

        <span className="shrink-0 text-[0.6rem] font-semibold tabular-nums text-muted-foreground">
          {tasks.length}/5
        </span>
      </div>

      {tasks.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tasks.map(task => (
            <div
              key={task.taskId}
              className="flex min-w-0 items-center gap-2 rounded-md border border-border/70 bg-muted/[0.08] px-2.5 py-1.5"
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

                <p className="mt-0.5 max-w-44 truncate text-[0.56rem] text-muted-foreground">
                  {
                    task.projectTitle
                  }
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  onRemove(
                    task.taskId,
                  )
                }
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`Remove ${task.title} from weekly focus`}
              >
                <XIcon size={10} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[0.62rem] leading-5 text-muted-foreground">
          Open a task in the
          calendar and add it to
          your weekly focus.
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
    <div className="rounded-lg border border-border/70 bg-background p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock3Icon
            size={12}
            className="text-muted-foreground"
          />

          <p className="text-[0.68rem] font-bold">
            Next up
          </p>
        </div>

        <span className="text-[0.58rem] text-muted-foreground">
          {items.length} upcoming
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onOpen(item)
              }
              className={[
                "min-w-0 rounded-md border px-2.5 py-2 text-left transition-colors",
                String(
                  item.projectId,
                ) ===
                String(
                  currentProjectId,
                )
                  ? "border-primary/30 bg-primary/[0.04]"
                  : "border-border/70 bg-muted/[0.06] hover:bg-muted/20",
              ].join(" ")}
            >
              <p className="text-[0.54rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {formatUpcomingDate(
                  parseCalendarDate(
                    item.start,
                  ),
                )}
              </p>

              <p className="mt-1 truncate text-[0.66rem] font-bold">
                {item.title}
              </p>

              <p className="mt-0.5 truncate text-[0.56rem] text-muted-foreground">
                {item.type ===
                "plan-block"
                  ? "My plan"
                  : item.projectTitle}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[0.62rem] leading-5 text-muted-foreground">
          Nothing upcoming in the
          current calendar range.
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
    <div className="inline-flex w-fit items-center rounded-full border border-border/70 bg-muted/30 p-1">
      <CalendarViewButton
        active={
          view === "month"
        }
        label="Month"
        onClick={() =>
          onChange("month")
        }
      />

      <CalendarViewButton
        active={
          view === "week"
        }
        label="Week"
        onClick={() =>
          onChange("week")
        }
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
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="calendar-view"
          className="absolute inset-0 rounded-full bg-background shadow-sm shadow-black/[0.035] ring-1 ring-inset ring-border/60"
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
      <DropdownMenuTrigger
        asChild
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-lg bg-background px-3 text-xs font-semibold shadow-none"
        >
          <Layers3Icon
            size={13}
          />

          {label}

          <ChevronDownIcon
            size={13}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border-border/80 p-1.5 shadow-lg"
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Calendar scope
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScopeMenuItem
          active={
            value === "all"
          }
          icon={
            Layers3Icon
          }
          label="All projects"
          onSelect={() =>
            onChange("all")
          }
        />

        <ScopeMenuItem
          active={
            value === "mine"
          }
          icon={
            BriefcaseBusinessIcon
          }
          label="My projects"
          count={ownedCount}
          onSelect={() =>
            onChange("mine")
          }
        />

        {isAllocat && (
          <ScopeMenuItem
            active={
              value === "work"
            }
            icon={
              FolderOpenIcon
            }
            label="Client work"
            count={workCount}
            onSelect={() =>
              onChange("work")
            }
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
        active
          ? "bg-muted/60 font-semibold"
          : "",
      ].join(" ")}
    >
      <Icon
        size={13}
        className="text-muted-foreground"
      />

      <span className="flex-1">
        {label}
      </span>

      {typeof count ===
        "number" && (
        <span className="text-[0.6rem] tabular-nums text-muted-foreground">
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
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 border-b border-border/70 bg-muted/[0.12]">
          {WEEK_DAYS.map(
            day => (
              <div
                key={day}
                className="px-2 py-3 text-center text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                {day}
              </div>
            ),
          )}
        </div>

        <div className="grid grid-cols-7">
          {days.map(
            (
              day,
              index,
            ) => {
              const dayItems =
                items
                  .filter(item =>
                    isSameDay(
                      parseCalendarDate(
                        item.start,
                      ),
                      day.date,
                    ),
                  )
                  .sort(
                    compareCalendarItems,
                  );

              return (
                <MonthDay
                  key={toDateKey(
                    day.date,
                  )}
                  day={day}
                  items={
                    dayItems
                  }
                  currentProjectId={
                    currentProjectId
                  }
                  onItemClick={
                    onItemClick
                  }
                  isLastColumn={
                    (index +
                      1) %
                      7 ===
                    0
                  }
                  isLastRow={
                    index >= 35
                  }
                />
              );
            },
          )}
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
  const visibleItems =
    items.slice(0, 3);

  const remainingCount =
    Math.max(
      0,
      items.length -
        visibleItems.length,
    );

  return (
    <div
      className={[
        "relative min-h-[132px] min-w-0 p-2 transition-colors",
        !isLastColumn
          ? "border-r border-border/60"
          : "",
        !isLastRow
          ? "border-b border-border/60"
          : "",
        day.inCurrentMonth
          ? "bg-background"
          : "bg-muted/[0.1]",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full",
          "text-xs font-semibold tabular-nums",
          day.isToday
            ? "bg-primary text-secondary"
            : day.inCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground/45",
        ].join(" ")}
      >
        {day.date.getDate()}
      </span>

      <div className="mt-2 space-y-1">
        {visibleItems.map(
          item => (
            <CalendarItemButton
              key={item.id}
              item={item}
              current={
                Boolean(
                  item.projectId,
                ) &&
                String(
                  item.projectId,
                ) ===
                  String(
                    currentProjectId,
                  )
              }
              compact
              onClick={() =>
                onItemClick(
                  item,
                )
              }
            />
          ),
        )}

        {remainingCount >
          0 && (
          <p className="px-1 pt-1 text-[0.6rem] font-semibold text-muted-foreground">
            +{remainingCount}{" "}
            more
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
  const allDayItems =
    items.filter(
      item => item.allDay,
    );

  const timedItems =
    items.filter(
      item => !item.allDay,
    );

  const timelineHeight =
    WEEK_HOURS.length *
    HOUR_HEIGHT;

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
      <div className="min-w-[900px]">
        {/* HEADER */}

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border/70">
          <div />

          {days.map(date => {
            const today =
              isSameDay(
                date,
                new Date(),
              );

            return (
              <div
                key={toDateKey(
                  date,
                )}
                className="border-l border-border/60 px-3 py-3 text-center"
              >
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {formatWeekday(
                    date,
                  )}
                </p>

                <span
                  className={[
                    "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full",
                    "text-sm font-bold tabular-nums",
                    today
                      ? "bg-primary text-secondary"
                      : "",
                  ].join(" ")}
                >
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* ALL DAY */}

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-border/70">
          <div className="px-2 py-3 text-right text-[0.58rem] font-medium text-muted-foreground">
            All day
          </div>

          {days.map(date => {
            const dayItems =
              allDayItems
                .filter(item =>
                  isSameDay(
                    parseCalendarDate(
                      item.start,
                    ),
                    date,
                  ),
                )
                .sort(
                  compareCalendarItems,
                );

            return (
              <div
                key={toDateKey(
                  date,
                )}
                className="min-h-20 space-y-1 border-l border-border/60 p-1.5"
              >
                {dayItems.map(
                  item => (
                    <CalendarItemButton
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                      current={
                        Boolean(
                          item.projectId,
                        ) &&
                        String(
                          item.projectId,
                        ) ===
                          String(
                            currentProjectId,
                          )
                      }
                      compact
                      onClick={() =>
                        onItemClick(
                          item,
                        )
                      }
                    />
                  ),
                )}
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}

        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
          <div
            className="relative"
            style={{
              height:
                timelineHeight,
            }}
          >
            {WEEK_HOURS.map(
              (
                hour,
                index,
              ) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-border/50"
                  style={{
                    top:
                      index *
                      HOUR_HEIGHT,
                  }}
                >
                  <span className="absolute -top-2 right-2 bg-background px-1 text-[0.58rem] text-muted-foreground">
                    {formatHour(
                      hour,
                    )}
                  </span>
                </div>
              ),
            )}
          </div>

          {days.map(date => {
            const dayItems =
              timedItems
                .filter(item =>
                  isSameDay(
                    parseCalendarDate(
                      item.start,
                    ),
                    date,
                  ),
                )
                .sort(
                  compareCalendarItems,
                );

            return (
              <WeekDayColumn
                key={toDateKey(
                  date,
                )}
                items={
                  dayItems
                }
                currentProjectId={
                  currentProjectId
                }
                height={
                  timelineHeight
                }
                onItemClick={
                  onItemClick
                }
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
      className="relative border-l border-border/60"
      style={{ height }}
    >
      {WEEK_HOURS.map(
        (
          hour,
          index,
        ) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-border/50"
            style={{
              top:
                index *
                HOUR_HEIGHT,
            }}
          />
        ),
      )}

      {items.map(item => {
        const start =
          parseCalendarDate(
            item.start,
          );

        const end = item.end
          ? parseCalendarDate(
              item.end,
            )
          : addMinutes(
              start,
              50,
            );

        const startMinutes =
          (start.getHours() -
            WEEK_START_HOUR) *
            60 +
          start.getMinutes();

        const durationMinutes =
          Math.max(
            30,
            (end.getTime() -
              start.getTime()) /
              60000,
          );

        const top =
          Math.max(
            0,
            (startMinutes / 60) *
              HOUR_HEIGHT,
          );

        const itemHeight =
          Math.max(
            34,
            (durationMinutes /
              60) *
              HOUR_HEIGHT,
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
                Boolean(
                  item.projectId,
                ) &&
                String(
                  item.projectId,
                ) ===
                  String(
                    currentProjectId,
                  )
              }
              fill
              onClick={() =>
                onItemClick(
                  item,
                )
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
  const timed =
    !item.allDay;

  const icon =
    item.type ===
    "plan-block" ? (
      <Clock3Icon
        size={10}
        className="shrink-0 opacity-70"
      />
    ) : item.type ===
      "task" ? (
      <CheckCircle2Icon
        size={10}
        className="shrink-0 opacity-70"
      />
    ) : item.type ===
      "project-due" ? (
      <Clock3Icon
        size={10}
        className="shrink-0 opacity-70"
      />
    ) : (
      <CalendarDaysIcon
        size={10}
        className="shrink-0 opacity-70"
      />
    );

  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={{
        y: -1,
      }}
      transition={{
        duration: 0.15,
      }}
      title={`${item.title} · ${item.projectTitle}`}
      className={[
        "group/event block w-full min-w-0 rounded-md border text-left",
        "transition-[background-color,border-color,box-shadow]",
        fill ? "h-full" : "",
        item.type ===
        "plan-block"
          ? "border-primary/15 bg-secondary text-secondary-foreground hover:border-primary/25"
          : current
            ? "border-primary bg-primary text-secondary shadow-[0_10px_24px_-18px_rgba(0,0,0,0.55)]"
            : item.relationship ===
                "allocat"
              ? "border-primary/10 bg-primary/[0.045] text-foreground hover:border-primary/20 hover:bg-primary/[0.065]"
              : "border-border/60 bg-muted/40 text-foreground hover:border-foreground/10 hover:bg-muted/60",
        compact
          ? "px-2 py-1.5"
          : "px-2.5 py-2",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        {icon}

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
            item.type ===
            "plan-block"
              ? "opacity-70"
              : current
                ? "text-secondary/65"
                : "text-muted-foreground",
          ].join(" ")}
        >
          {item.type ===
          "plan-block"
            ? item.projectTitle ||
              "My plan"
            : item.relationship ===
                "allocat"
              ? `Client work · ${item.projectTitle}`
              : `My project · ${item.projectTitle}`}
        </p>
      )}
    </motion.button>
  );
}

/* =========================================================
   DETAIL PANEL
========================================================= */

function CalendarDetailPanel({
  item,
  isFocused,
  onClose,
  onOpenProject,
  onToggleFocus,
  onEdit,
  onDelete,
}: {
  item: CalendarItem;
  isFocused: boolean;
  onClose: () => void;
  onOpenProject: () => void;
  onToggleFocus?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const start =
    parseCalendarDate(
      item.start,
    );

  const end = item.end
    ? parseCalendarDate(
        item.end,
      )
    : null;

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close calendar details"
        className="fixed inset-0 z-[70] bg-black/25 backdrop-blur-[1px]"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
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
        className="fixed inset-y-0 right-0 z-[80] w-full max-w-md overflow-y-auto border-l border-border bg-background p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {item.type ===
              "plan-block"
                ? "My plan"
                : item.relationship ===
                    "allocat"
                  ? "Client work"
                  : "Project work"}
            </p>

            <h2 className="mt-2 text-xl font-black tracking-[-0.025em]">
              {item.title}
            </h2>
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

          {item.type !==
            "plan-block" && (
            <DetailRow
              label="Status"
              value={formatStatus(
                item.status,
              )}
            />
          )}

          <DetailRow
            label="Timing"
            value={getDeadlineIntelligence(
              item,
            )}
          />

          {(item.description ||
            item.notes) && (
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground/80">
                {item.notes ||
                  item.description}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-2 border-t border-border/70 pt-5">
          {onToggleFocus && (
            <Button
              type="button"
              variant={
                isFocused
                  ? "outline"
                  : "default"
              }
              onClick={
                onToggleFocus
              }
              className="h-10 w-full justify-start rounded-lg text-xs font-semibold shadow-none"
            >
              <StarIcon
                size={13}
              />

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
              <PencilIcon
                size={13}
              />
              Reschedule or edit
            </Button>
          )}

          {item.projectId && (
            <Button
              type="button"
              variant="outline"
              onClick={
                onOpenProject
              }
              className="h-10 w-full justify-start rounded-lg bg-transparent text-xs font-semibold shadow-none"
            >
              <FolderOpenIcon
                size={13}
              />
              Open project
            </Button>
          )}

          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="h-10 w-full justify-start rounded-lg text-xs font-semibold text-destructive shadow-none hover:bg-destructive/[0.05] hover:text-destructive"
            >
              <Trash2Icon
                size={13}
              />
              Delete planning
              block
            </Button>
          )}
        </div>
      </motion.aside>
    </>
  );
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
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold">
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
    ? parseCalendarDate(
        block.startAt,
      )
    : null;

  const initialEnd = block
    ? parseCalendarDate(
        block.endAt,
      )
    : null;

  const [title, setTitle] =
    useState(
      block?.title ?? "",
    );

  const [notes, setNotes] =
    useState(
      block?.notes ?? "",
    );

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState(
    block?.projectId ?? "",
  );

  const [date, setDate] =
    useState(
      initialStart
        ? toDateKey(
            initialStart,
          )
        : defaultDate,
    );

  const [
    startTime,
    setStartTime,
  ] = useState(
    initialStart
      ? toTimeInput(
          initialStart,
        )
      : "09:00",
  );

  const [
    endTime,
    setEndTime,
  ] = useState(
    initialEnd
      ? toTimeInput(
          initialEnd,
        )
      : "10:00",
  );

  const [
    formError,
    setFormError,
  ] = useState<
    string | null
  >(null);

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    setFormError(null);

    const cleanTitle =
      title.trim();

    if (!cleanTitle) {
      setFormError(
        "Give this planning block a title.",
      );
      return;
    }

    const startAt =
      localDateTimeToIso(
        date,
        startTime,
      );

    const endAt =
      localDateTimeToIso(
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
          selectedProjectId ||
          null,
        taskId: null,
        title: cleanTitle,
        notes:
          notes.trim() ||
          null,
        startAt,
        endAt,
      });
    } catch (saveError) {
      setFormError(
        saveError instanceof
          Error
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
        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[1px]"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
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
        className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Personal planning
            </p>

            <h2 className="mt-2 text-xl font-black tracking-[-0.025em]">
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
                  event.target
                    .value,
                )
              }
              maxLength={180}
              placeholder="e.g. Homepage concepts"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </CalendarField>

          <CalendarField label="Project">
            <select
              value={
                selectedProjectId
              }
              onChange={event =>
                setSelectedProjectId(
                  event.target
                    .value,
                )
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">
                Personal / no project
              </option>

              {projects.map(
                project => (
                  <option
                    key={
                      project.id
                    }
                    value={
                      project.id
                    }
                  >
                    {
                      project.title
                    }
                  </option>
                ),
              )}
            </select>
          </CalendarField>

          <CalendarField label="Date">
            <input
              type="date"
              value={date}
              onChange={event =>
                setDate(
                  event.target
                    .value,
                )
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </CalendarField>

          <div className="grid grid-cols-2 gap-3">
            <CalendarField label="Start">
              <input
                type="time"
                value={
                  startTime
                }
                onChange={event =>
                  setStartTime(
                    event.target
                      .value,
                  )
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </CalendarField>

            <CalendarField label="End">
              <input
                type="time"
                value={endTime}
                onChange={event =>
                  setEndTime(
                    event.target
                      .value,
                  )
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </CalendarField>
          </div>

          <CalendarField label="Notes">
            <textarea
              value={notes}
              onChange={event =>
                setNotes(
                  event.target
                    .value,
                )
              }
              maxLength={1200}
              rows={4}
              placeholder="Optional context for yourself"
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </CalendarField>

          {formError && (
            <p className="rounded-lg bg-destructive/[0.06] px-3 py-2 text-xs font-medium text-destructive">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={
                onClose
              }
              disabled={saving}
              className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="h-9 rounded-lg px-4 text-xs font-semibold shadow-none"
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
      <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
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
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.62rem] text-muted-foreground">
      <LegendItem
        surface="bg-primary"
        label="Current project"
      />

      <LegendItem
        surface="bg-muted"
        label="My projects"
      />

      {showClientWork && (
        <LegendItem
          surface="bg-primary/[0.08]"
          label="Client work"
        />
      )}

      <LegendItem
        surface="bg-secondary"
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
          "h-2.5 w-2.5 rounded-sm border border-border/60",
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
    <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-border/70">
      <div className="text-center">
        <LoaderCircleIcon
          size={20}
          className="mx-auto animate-spin text-primary"
        />

        <p className="mt-3 text-xs font-medium text-muted-foreground">
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
    <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border/70">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <RefreshCwIcon
            size={17}
          />
        </span>

        <h2 className="mt-4 text-base font-bold tracking-[-0.015em]">
          Could not load
          calendar
        </h2>

        <p className="mt-2 text-xs leading-6 text-muted-foreground">
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
            <RefreshCwIcon
              size={13}
            />
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
  const blocks =
    planningBlocks
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
          block.endDate >
            weekStart &&
          block.startDate <
            weekEnd,
      );

  const plannedHours =
    blocks.reduce(
      (
        total,
        block,
      ) => {
        const start =
          new Date(
            Math.max(
              block.startDate.getTime(),
              weekStart.getTime(),
            ),
          );

        const end =
          new Date(
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

  const alerts: string[] =
    [];

  const overlappingPairs =
    findOverlappingBlocks(
      blocks,
    );

  if (
    overlappingPairs > 0
  ) {
    alerts.push(
      `${overlappingPairs} planning ${
        overlappingPairs === 1
          ? "overlap"
          : "overlaps"
      }`,
    );
  }

  const dayStats =
    Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          addDays(
            weekStart,
            index,
          );

        const hours =
          blocks
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

        const deadlineCount =
          items.filter(
            item =>
              (item.type ===
                "task" ||
                item.type ===
                  "project-due") &&
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

  const busiestDay =
    dayStats.find(
      day =>
        day.hours > 8 ||
        day.deadlineCount >=
          3,
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

  const deadlineCount =
    items.filter(item => {
      if (
        item.type !==
          "task" &&
        item.type !==
          "project-due"
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

  const sorted =
    [...blocks].sort(
      (
        first,
        second,
      ) =>
        first.startDate.getTime() -
        second.startDate.getTime(),
    );

  for (
    let firstIndex = 0;
    firstIndex <
    sorted.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      sorted.length;
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

function startOfDay(
  date: Date,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

function startOfMonth(
  date: Date,
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  );
}

function startOfWeek(
  date: Date,
) {
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
    date.getMonth() +
      amount,
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
  if (
    view === "month"
  ) {
    return new Intl.DateTimeFormat(
      "en",
      {
        month: "long",
        year: "numeric",
      },
    ).format(date);
  }

  const start =
    startOfWeek(date);

  const end =
    addDays(start, 6);

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
  return Number.isInteger(
    value,
  )
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
  if (
    item.type ===
    "plan-block"
  ) {
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
    axios.isAxiosError(
      error,
    ) &&
    typeof error.response
      ?.data?.message ===
      "string"
  ) {
    return error.response
      .data.message;
  }

  return fallback;
}

export default Calendar;
