// import {
//   CalendarDaysIcon,
//   CircleCheckBigIcon,
//   CircleDashedIcon,
//   CircleDotIcon,
//   EllipsisVerticalIcon,
//   TriangleAlertIcon
// } from "lucide-react";
// import type { Task } from "@/Types/task";

// export default function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
//   return (
//     <div
//       className={[
//         "bg-background/20 my-1 py-1 px-2 shadow-none border border-foreground/10 rounded-[6px]",
//         isOverlay ? "shadow-md scale-[1.02]" : ""
//       ].join(" ")}
//     >
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex flex-col">
//           <h4 className="font-medium text-xs">{task.title}</h4>
//           <span className="flex gap-1 items-center text-[0.6rem] text-muted-foreground">
//             <CalendarDaysIcon size={10} />
//             Due{" "}
//             {task.dueDate ? (
//               ` ${new Date(task.dueDate).toDateString()}`
//             ) : (
//               <span className="italic">Not specified</span>
//             )}
//           </span>
//         </div>

//         <div className="flex items-center space-x-4">
//           {task.status === "complete" && <CircleCheckBigIcon size={16} className="text-accent-2" />}
//           {task.status === "active" && <CircleDotIcon size={16} className="text-primary" />}
//           {task.status === "overdue" && <TriangleAlertIcon size={16} className="text-destructive" />}
//           {task.status === "pending" && <CircleDashedIcon size={16} className="text-accent-3" />}
//           <EllipsisVerticalIcon size={16} className="text-muted-foreground hover:text-foreground" />
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotIcon,
  EllipsisVerticalIcon,
  TriangleAlertIcon
} from "lucide-react";
import type { Task } from "@/Types/task";

type Props = {
  task: Task;
  isOverlay?: boolean;
};

function TaskCard({ task, isOverlay = false }: Props) {
  return (
    <article
      className={[
        "rounded-lg border bg-background p-3 transition-colors",
        "hover:border-foreground/20 hover:bg-muted/30",
        isOverlay ? "rotate-1 border-primary/30 bg-background" : ""
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold">
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>

        <button
          type="button"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          onPointerDown={event => event.stopPropagation()}
        >
          <EllipsisVerticalIcon size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
          <CalendarDaysIcon size={12} />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </span>

        <TaskStatusIcon status={task.status} />
      </div>
    </article>
  );
}

function TaskStatusIcon({ status }: { status: Task["status"] }) {
  if (status === "complete") {
    return <CircleCheckBigIcon size={16} className="text-accent-2" />;
  }

  if (status === "active") {
    return <CircleDotIcon size={16} className="text-primary" />;
  }

  if (status === "overdue") {
    return <TriangleAlertIcon size={16} className="text-destructive" />;
  }

  return <CircleDashedIcon size={16} className="text-accent-3" />;
}

export default TaskCard;