// // import {
// //   CalendarDaysIcon,
// //   CircleCheckBigIcon,
// //   CircleDashedIcon,
// //   CircleDotIcon,
// //   EllipsisVerticalIcon,
// //   TriangleAlertIcon,
// // } from "lucide-react";

// // import type {
// //   Task,
// // } from "@/Types/task";

// // type Props = {
// //   task: Task;
// //   isOverlay?: boolean;
// // };

// // type TaskStatusAppearance = {
// //   label: string;
// //   icon: React.ComponentType<{
// //     size?: number;
// //     className?: string;
// //   }>;
// //   iconClass: string;
// //   badgeClass: string;
// // };

// // const taskStatusAppearance: Record<
// //   string,
// //   TaskStatusAppearance
// // > = {
// //   pending: {
// //     label: "Pending",
// //     icon: CircleDashedIcon,
// //     iconClass:
// //       "text-amber-600 dark:text-amber-300",
// //     badgeClass:
// //       "bg-amber-400/[0.08] text-amber-700 dark:text-amber-300",
// //   },

// //   active: {
// //     label: "In progress",
// //     icon: CircleDotIcon,
// //     iconClass:
// //       "text-primary",
// //     badgeClass:
// //       "bg-primary/[0.08] text-primary",
// //   },

// //   complete: {
// //     label: "Complete",
// //     icon: CircleCheckBigIcon,
// //     iconClass:
// //       "text-emerald-600 dark:text-emerald-300",
// //     badgeClass:
// //       "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300",
// //   },

// //   overdue: {
// //     label: "Overdue",
// //     icon: TriangleAlertIcon,
// //     iconClass:
// //       "text-destructive",
// //     badgeClass:
// //       "bg-destructive/[0.07] text-destructive",
// //   },
// // };

// // /* =========================================================
// //    TASK CARD
// // ========================================================= */

// // function TaskCard({
// //   task,
// //   isOverlay = false,
// // }: Props) {
// //   const status =
// //     getTaskStatusAppearance(
// //       task.status,
// //     );

// //   const isOverdue =
// //     task.dueDate
// //       ? new Date(
// //           task.dueDate,
// //         ).getTime() <
// //           Date.now() &&
// //         task.status !==
// //           "complete"
// //       : false;

// //   return (
// //     <article
// //       className={[
// //         "group relative overflow-hidden",
// //         "rounded-xl border border-border/80",
// //         "bg-background px-3.5 py-3.5",
// //         "transition-all duration-200",

// //         isOverlay
// //           ? [
// //               "rotate-[1deg]",
// //               "border-primary/30",
// //               "shadow-xl shadow-black/[0.08]",
// //               "dark:shadow-black/30",
// //             ].join(
// //               " ",
// //             )
// //           : [
// //               "hover:border-foreground/15",
// //               "hover:bg-muted/20",
// //               "hover:shadow-sm",
// //             ].join(
// //               " ",
// //             ),
// //       ].join(" ")}
// //     >
// //       {/* ===================================================
// //           TOP ROW
// //       =================================================== */}

// //       <div className="flex items-start justify-between gap-3">
// //         <div className="min-w-0 flex-1">
// //           <h4 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.01em]">
// //             {task.title}
// //           </h4>

// //           {task.description && (
// //             <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
// //               {
// //                 task.description
// //               }
// //             </p>
// //           )}
// //         </div>

// //         <button
// //           type="button"
// //           onPointerDown={(
// //             event,
// //           ) =>
// //             event.stopPropagation()
// //           }
// //           className={[
// //             "flex h-7 w-7 shrink-0 items-center justify-center",
// //             "rounded-md text-muted-foreground",
// //             "opacity-60 transition-all",
// //             "hover:bg-muted hover:text-foreground hover:opacity-100",
// //             "group-hover:opacity-100",
// //           ].join(" ")}
// //           aria-label={`Task options for ${task.title}`}
// //         >
// //           <EllipsisVerticalIcon
// //             size={15}
// //           />
// //         </button>
// //       </div>

// //       {/* ===================================================
// //           FOOTER
// //       =================================================== */}

// //       <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
// //         <DueDate
// //           dueDate={
// //             task.dueDate
// //           }
// //           isOverdue={
// //             isOverdue
// //           }
// //         />

// //         <TaskStatus
// //           status={
// //             task.status
// //           }
// //           appearance={
// //             status
// //           }
// //         />
// //       </div>
// //     </article>
// //   );
// // }

// // /* =========================================================
// //    DUE DATE
// // ========================================================= */

// // function DueDate({
// //   dueDate,
// //   isOverdue,
// // }: {
// //   dueDate?:
// //     | string
// //     | Date
// //     | null;

// //   isOverdue: boolean;
// // }) {
// //   return (
// //     <span
// //       className={[
// //         "flex min-w-0 items-center gap-1.5",
// //         "text-[0.66rem] font-medium",

// //         isOverdue
// //           ? "text-destructive"
// //           : "text-muted-foreground",
// //       ].join(" ")}
// //     >
// //       <CalendarDaysIcon
// //         size={12}
// //         className="shrink-0"
// //       />

// //       <span className="truncate">
// //         {dueDate
// //           ? formatTaskDate(
// //               dueDate,
// //             )
// //           : "No due date"}
// //       </span>
// //     </span>
// //   );
// // }

// // /* =========================================================
// //    STATUS
// // ========================================================= */

// // function TaskStatus({
// //   status,
// //   appearance,
// // }: {
// //   status: Task["status"];

// //   appearance: TaskStatusAppearance;
// // }) {
// //   const Icon =
// //     appearance.icon;

// //   return (
// //     <span
// //       className={[
// //         "inline-flex shrink-0 items-center gap-1.5",
// //         "rounded-md px-2 py-1",
// //         "text-[0.62rem] font-semibold",
// //         appearance.badgeClass,
// //       ].join(" ")}
// //     >
// //       <Icon
// //         size={11}
// //         className={
// //           appearance.iconClass
// //         }
// //       />

// //       {
// //         appearance.label
// //       }
// //     </span>
// //   );
// // }

// // /* =========================================================
// //    HELPERS
// // ========================================================= */

// // function getTaskStatusAppearance(
// //   status?: string,
// // ) {
// //   const normalized =
// //     String(
// //       status ?? "",
// //     )
// //       .toLowerCase()
// //       .replace(
// //         /[\s_-]/g,
// //         "",
// //       );

// //   return (
// //     taskStatusAppearance[
// //       normalized
// //     ] ??
// //     taskStatusAppearance.pending
// //   );
// // }

// // function formatTaskDate(
// //   value:
// //     | string
// //     | Date,
// // ) {
// //   const date =
// //     new Date(value);

// //   if (
// //     Number.isNaN(
// //       date.getTime(),
// //     )
// //   ) {
// //     return "No due date";
// //   }

// //   return new Intl.DateTimeFormat(
// //     "en",
// //     {
// //       day: "numeric",
// //       month: "short",
// //     },
// //   ).format(date);
// // }

// // export default TaskCard;

// import {
//   CalendarDaysIcon,
//   CircleCheckBigIcon,
//   CircleDashedIcon,
//   CircleDotIcon,
//   EllipsisVerticalIcon,
//   EyeIcon,
//   PencilIcon,
//   Trash2Icon,
//   TriangleAlertIcon,
// } from "lucide-react";

// import {
//   useState,
// } from "react";

// import type {
//   Task,
// } from "@/Types/task";

// import TaskDialog from "@/components/TaskDialog";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// type Props = {
//   task: Task;
//   isOverlay?: boolean;
// };

// type TaskStatusAppearance = {
//   label: string;

//   icon: React.ComponentType<{
//     size?: number;
//     className?: string;
//   }>;

//   iconClass: string;
//   badgeClass: string;
// };

// const taskStatusAppearance: Record<
//   string,
//   TaskStatusAppearance
// > = {
//   pending: {
//     label: "Pending",

//     icon:
//       CircleDashedIcon,

//     iconClass:
//       "text-amber-600 dark:text-amber-300",

//     badgeClass:
//       "bg-amber-400/[0.08] text-amber-700 dark:text-amber-300",
//   },

//   active: {
//     label:
//       "In progress",

//     icon:
//       CircleDotIcon,

//     iconClass:
//       "text-primary",

//     badgeClass:
//       "bg-primary/[0.08] text-primary",
//   },

//   complete: {
//     label:
//       "Complete",

//     icon:
//       CircleCheckBigIcon,

//     iconClass:
//       "text-emerald-600 dark:text-emerald-300",

//     badgeClass:
//       "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300",
//   },

//   overdue: {
//     label:
//       "Overdue",

//     icon:
//       TriangleAlertIcon,

//     iconClass:
//       "text-destructive",

//     badgeClass:
//       "bg-destructive/[0.07] text-destructive",
//   },
// };

// /* =========================================================
//    TASK CARD
// ========================================================= */

// function TaskCard({
//   task,
//   isOverlay = false,
// }: Props) {
//   const [
//     dialogOpen,
//     setDialogOpen,
//   ] = useState(false);

//   const status =
//     getTaskStatusAppearance(
//       task.status,
//     );

//   const isOverdue =
//     task.dueDate
//       ? new Date(
//           task.dueDate,
//         ).getTime() <
//           Date.now() &&
//         task.status !==
//           "complete"
//       : false;

//   function openTask() {
//     if (isOverlay) {
//       return;
//     }

//     setDialogOpen(true);
//   }

//   function handleCardKeyDown(
//     event: React.KeyboardEvent<HTMLElement>,
//   ) {
//     if (isOverlay) {
//       return;
//     }

//     if (
//       event.key === "Enter" ||
//       event.key === " "
//     ) {
//       event.preventDefault();

//       setDialogOpen(true);
//     }
//   }

//   return (
//     <>
//       <article
//         role={
//           isOverlay
//             ? undefined
//             : "button"
//         }
//         tabIndex={
//           isOverlay
//             ? -1
//             : 0
//         }
//         onClick={
//           openTask
//         }
//         onKeyDown={
//           handleCardKeyDown
//         }
//         className={[
//           "group relative overflow-hidden",
//           "rounded-xl border border-border/80",
//           "bg-background px-3.5 py-3.5",
//           "transition-all duration-200",

//           !isOverlay &&
//             "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",

//           isOverlay
//             ? [
//                 "rotate-[1deg]",
//                 "border-primary/30",
//                 "shadow-xl shadow-black/[0.08]",
//                 "dark:shadow-black/30",
//               ].join(
//                 " ",
//               )
//             : [
//                 "hover:border-foreground/15",
//                 "hover:bg-muted/20",
//                 "hover:shadow-sm",
//               ].join(
//                 " ",
//               ),
//         ]
//           .filter(Boolean)
//           .join(" ")}
//       >
//         {/* ===================================================
//             TOP ROW
//         =================================================== */}

//         <div className="flex items-start justify-between gap-3">
//           <div className="min-w-0 flex-1">
//             <h4 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.01em]">
//               {
//                 task.title
//               }
//             </h4>

//             {task.description && (
//               <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
//                 {
//                   task.description
//                 }
//               </p>
//             )}
//           </div>

//           {!isOverlay && (
//             <TaskMenu
//               task={task}
//               onOpenTask={
//                 openTask
//               }
//             />
//           )}
//         </div>

//         {/* ===================================================
//             FOOTER
//         =================================================== */}

//         <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
//           <DueDate
//             dueDate={
//               task.dueDate
//             }
//             isOverdue={
//               isOverdue
//             }
//           />

//           <TaskStatus
//             status={
//               task.status
//             }
//             appearance={
//               status
//             }
//           />
//         </div>
//       </article>

//       {!isOverlay && (
//         <TaskDialog
//           task={task}
//           open={
//             dialogOpen
//           }
//           onOpenChange={
//             setDialogOpen
//           }
//         />
//       )}
//     </>
//   );
// }

// /* =========================================================
//    TASK MENU
// ========================================================= */

// function TaskMenu({
//   task,
//   onOpenTask,
// }: {
//   task: Task;
//   onOpenTask: () => void;
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger
//         asChild
//       >
//         <button
//           type="button"
//           onPointerDown={(
//             event,
//           ) => {
//             event.stopPropagation();
//           }}
//           onClick={(
//             event,
//           ) => {
//             event.stopPropagation();
//           }}
//           className={[
//             "flex h-7 w-7 shrink-0 items-center justify-center",
//             "rounded-md text-muted-foreground",
//             "opacity-60 transition-all",
//             "hover:bg-muted hover:text-foreground hover:opacity-100",
//             "group-hover:opacity-100",
//             "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
//           ].join(
//             " ",
//           )}
//           aria-label={`Task options for ${task.title}`}
//         >
//           <EllipsisVerticalIcon
//             size={15}
//           />
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         sideOffset={6}
//         className="w-44 rounded-xl p-1.5"
//         onClick={(
//           event,
//         ) => {
//           event.stopPropagation();
//         }}
//       >
//         <DropdownMenuItem
//           className="rounded-lg"
//           onSelect={(
//             event,
//           ) => {
//             event.preventDefault();

//             onOpenTask();
//           }}
//         >
//           <EyeIcon
//             size={14}
//           />

//           View task
//         </DropdownMenuItem>

//         <DropdownMenuItem
//           className="rounded-lg"
//           onSelect={(
//             event,
//           ) => {
//             event.preventDefault();

//             /*
//              * We will wire edit functionality here
//              * once the task edit flow is ready.
//              */
//           }}
//         >
//           <PencilIcon
//             size={14}
//           />

//           Edit task
//         </DropdownMenuItem>

//         <DropdownMenuSeparator />

//         <DropdownMenuItem
//           className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
//           onSelect={(
//             event,
//           ) => {
//             event.preventDefault();

//             /*
//              * Delete confirmation will go here.
//              */
//           }}
//         >
//           <Trash2Icon
//             size={14}
//           />

//           Delete task
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// /* =========================================================
//    DUE DATE
// ========================================================= */

// function DueDate({
//   dueDate,
//   isOverdue,
// }: {
//   dueDate?:
//     | string
//     | Date
//     | null;

//   isOverdue: boolean;
// }) {
//   return (
//     <span
//       className={[
//         "flex min-w-0 items-center gap-1.5",
//         "text-[0.66rem] font-medium",

//         isOverdue
//           ? "text-destructive"
//           : "text-muted-foreground",
//       ].join(
//         " ",
//       )}
//     >
//       <CalendarDaysIcon
//         size={12}
//         className="shrink-0"
//       />

//       <span className="truncate">
//         {dueDate
//           ? formatTaskDate(
//               dueDate,
//             )
//           : "No due date"}
//       </span>
//     </span>
//   );
// }

// /* =========================================================
//    STATUS
// ========================================================= */

// function TaskStatus({
//   status,
//   appearance,
// }: {
//   status:
//     Task["status"];

//   appearance:
//     TaskStatusAppearance;
// }) {
//   const Icon =
//     appearance.icon;

//   return (
//     <span
//       className={[
//         "inline-flex shrink-0 items-center gap-1.5",
//         "rounded-md px-2 py-1",
//         "text-[0.62rem] font-semibold",
//         appearance.badgeClass,
//       ].join(
//         " ",
//       )}
//     >
//       <Icon
//         size={11}
//         className={
//           appearance.iconClass
//         }
//       />

//       {
//         appearance.label
//       }
//     </span>
//   );
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// function getTaskStatusAppearance(
//   status?: string,
// ) {
//   const normalized =
//     String(
//       status ??
//         "",
//     )
//       .toLowerCase()
//       .replace(
//         /[\s_-]/g,
//         "",
//       );

//   return (
//     taskStatusAppearance[
//       normalized
//     ] ??
//     taskStatusAppearance.pending
//   );
// }

// function formatTaskDate(
//   value:
//     | string
//     | Date,
// ) {
//   const date =
//     new Date(value);

//   if (
//     Number.isNaN(
//       date.getTime(),
//     )
//   ) {
//     return "No due date";
//   }

//   return new Intl.DateTimeFormat(
//     "en",
//     {
//       day:
//         "numeric",

//       month:
//         "short",
//     },
//   ).format(
//     date,
//   );
// }

// export default TaskCard;

import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";

import {
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

import type {
  Task,
} from "@/Types/task";

import TaskDialog from "@/components/TaskDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  task: Task;
  isOverlay?: boolean;
};

type TaskStatusAppearance = {
  label: string;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  iconClass: string;
  badgeClass: string;
};

/* =========================================================
   STATUS APPEARANCE
========================================================= */

const taskStatusAppearance: Record<
  string,
  TaskStatusAppearance
> = {
  pending: {
    label: "Pending",

    icon:
      CircleDashedIcon,

    iconClass:
      "text-amber-600 dark:text-amber-300",

    badgeClass:
      "bg-amber-400/[0.08] text-amber-700 dark:text-amber-300",
  },

  active: {
    label:
      "In progress",

    icon:
      CircleDotIcon,

    iconClass:
      "text-primary",

    badgeClass:
      "bg-primary/[0.08] text-primary",
  },

  complete: {
    label:
      "Complete",

    icon:
      CircleCheckBigIcon,

    iconClass:
      "text-emerald-600 dark:text-emerald-300",

    badgeClass:
      "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300",
  },

  overdue: {
    label:
      "Overdue",

    icon:
      TriangleAlertIcon,

    iconClass:
      "text-destructive",

    badgeClass:
      "bg-destructive/[0.07] text-destructive",
  },
};

/* =========================================================
   TASK CARD
========================================================= */

function TaskCard({
  task,
  isOverlay = false,
}: Props) {
  const [
    dialogOpen,
    setDialogOpen,
  ] =
    useState(false);

  const status =
    getTaskStatusAppearance(
      task.status,
    );

  const isOverdue =
    task.dueDate
      ? new Date(
          task.dueDate,
        ).getTime() <
          Date.now() &&
        task.status !==
          "complete"
      : false;

  /* =======================================================
     OPEN TASK
  ======================================================= */

  function openTask() {
    if (isOverlay) {
      return;
    }

    setDialogOpen(true);
  }

  function handleCardClick(
    event: MouseEvent<HTMLElement>,
  ) {
    if (isOverlay) {
      return;
    }

    /*
     * If another interactive element somehow
     * bubbles a click to the card, do not
     * open the dialog from here.
     */
    const target =
      event.target as HTMLElement;

    if (
      target.closest(
        "button, a, input, textarea, select, [role='menuitem']",
      )
    ) {
      return;
    }

    openTask();
  }

  function handleCardKeyDown(
    event: KeyboardEvent<HTMLElement>,
  ) {
    if (isOverlay) {
      return;
    }

    /*
     * Ignore keyboard events originating
     * inside controls.
     */
    const target =
      event.target as HTMLElement;

    if (
      target !==
      event.currentTarget
    ) {
      return;
    }

    if (
      event.key ===
        "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      openTask();
    }
  }

  return (
    <>
      <article
        role={
          isOverlay
            ? undefined
            : "button"
        }
        tabIndex={
          isOverlay
            ? -1
            : 0
        }
        onClick={
          handleCardClick
        }
        onKeyDown={
          handleCardKeyDown
        }
        aria-label={
          isOverlay
            ? undefined
            : `Open task ${task.title}`
        }
        className={[
          "group relative overflow-hidden",
          "rounded-xl border border-border/80",
          "bg-background px-3.5 py-3.5",
          "transition-all duration-200",

          !isOverlay
            ? [
                "cursor-pointer",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/30",
              ].join(" ")
            : "",

          isOverlay
            ? [
                "rotate-[1deg]",
                "border-primary/30",
                "shadow-xl shadow-black/[0.08]",
                "dark:shadow-black/30",
              ].join(" ")
            : [
                "hover:border-foreground/15",
                "hover:bg-muted/20",
                "hover:shadow-sm",
              ].join(" "),
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ===================================================
            TOP
        =================================================== */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.01em]">
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
                {
                  task.description
                }
              </p>
            )}
          </div>

          {!isOverlay && (
            <TaskMenu
              task={task}
              onOpenTask={
                openTask
              }
            />
          )}
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <DueDate
            dueDate={
              task.dueDate
            }
            isOverdue={
              isOverdue
            }
          />

          <TaskStatus
            appearance={
              status
            }
          />
        </div>
      </article>

      {/* =====================================================
          TASK DIALOG
      ===================================================== */}

      {!isOverlay && (
        <TaskDialog
          task={task}
          open={
            dialogOpen
          }
          onOpenChange={
            setDialogOpen
          }
        />
      )}
    </>
  );
}

/* =========================================================
   TASK MENU
========================================================= */

function TaskMenu({
  task,
  onOpenTask,
}: {
  task: Task;
  onOpenTask: () => void;
}) {
  /*
   * Prevent menu interactions from bubbling
   * into the draggable/card surface.
   */
  function stopPointer(
    event: PointerEvent<HTMLElement>,
  ) {
    event.stopPropagation();
  }

  function stopClick(
    event: MouseEvent<HTMLElement>,
  ) {
    event.stopPropagation();
  }

  return (
    <div
      onPointerDown={
        stopPointer
      }
      onClick={
        stopClick
      }
      className="relative z-10 shrink-0"
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
        >
          <button
            type="button"
            className={[
              "flex h-7 w-7 items-center justify-center",
              "rounded-md text-muted-foreground",
              "opacity-60 transition-all",
              "hover:bg-muted",
              "hover:text-foreground",
              "hover:opacity-100",
              "group-hover:opacity-100",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/30",
            ].join(" ")}
            aria-label={`Task options for ${task.title}`}
          >
            <EllipsisVerticalIcon
              size={15}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-44 rounded-xl p-1.5"
          onPointerDown={
            stopPointer
          }
          onClick={
            stopClick
          }
        >
          {/* ===============================================
              VIEW
          =============================================== */}

          <DropdownMenuItem
            className="rounded-lg"
            onSelect={(
              event,
            ) => {
              event.preventDefault();

              /*
               * Radix closes the menu after
               * selection. Schedule the dialog
               * immediately after the menu event.
               */
              requestAnimationFrame(
                () => {
                  onOpenTask();
                },
              );
            }}
          >
            <EyeIcon
              size={14}
            />

            View task
          </DropdownMenuItem>

          {/* ===============================================
              EDIT
          =============================================== */}

          <DropdownMenuItem
            className="rounded-lg"
            onSelect={(
              event,
            ) => {
              event.preventDefault();

              /*
               * Task editing will be
               * connected here later.
               */
            }}
          >
            <PencilIcon
              size={14}
            />

            Edit task
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* ===============================================
              DELETE
          =============================================== */}

          <DropdownMenuItem
            className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
            onSelect={(
              event,
            ) => {
              event.preventDefault();

              /*
               * Delete confirmation
               * will be connected here.
               */
            }}
          >
            <Trash2Icon
              size={14}
            />

            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* =========================================================
   DUE DATE
========================================================= */

function DueDate({
  dueDate,
  isOverdue,
}: {
  dueDate?:
    | string
    | Date
    | null;

  isOverdue: boolean;
}) {
  return (
    <span
      className={[
        "flex min-w-0 items-center gap-1.5",
        "text-[0.66rem] font-medium",

        isOverdue
          ? "text-destructive"
          : "text-muted-foreground",
      ].join(" ")}
    >
      <CalendarDaysIcon
        size={12}
        className="shrink-0"
      />

      <span className="truncate">
        {dueDate
          ? formatTaskDate(
              dueDate,
            )
          : "No due date"}
      </span>
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

function TaskStatus({
  appearance,
}: {
  appearance:
    TaskStatusAppearance;
}) {
  const Icon =
    appearance.icon;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5",
        "rounded-md px-2 py-1",
        "text-[0.62rem] font-semibold",
        appearance.badgeClass,
      ].join(" ")}
    >
      <Icon
        size={11}
        className={
          appearance.iconClass
        }
      />

      {
        appearance.label
      }
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getTaskStatusAppearance(
  status?: string,
) {
  const normalized =
    String(
      status ?? "",
    )
      .toLowerCase()
      .replace(
        /[\s_-]/g,
        "",
      );

  return (
    taskStatusAppearance[
      normalized
    ] ??
    taskStatusAppearance.pending
  );
}

function formatTaskDate(
  value:
    | string
    | Date,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "No due date";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day:
        "numeric",

      month:
        "short",
    },
  ).format(
    date,
  );
}

export default TaskCard;