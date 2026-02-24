import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotIcon,
  EllipsisVerticalIcon,
  TriangleAlertIcon
} from "lucide-react";
import type { Task } from "@/Types/task";

export default function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  return (
    <div
      className={[
        "bg-background/20 my-1 py-1 px-2 shadow-none border border-foreground/10 rounded-[6px]",
        isOverlay ? "shadow-md scale-[1.02]" : ""
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h4 className="font-medium text-xs">{task.title}</h4>
          <span className="flex gap-1 items-center text-[0.6rem] text-muted-foreground">
            <CalendarDaysIcon size={10} />
            Due{" "}
            {task.dueDate ? (
              ` ${new Date(task.dueDate).toDateString()}`
            ) : (
              <span className="italic">Not specified</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {task.status === "complete" && <CircleCheckBigIcon size={16} className="text-accent-2" />}
          {task.status === "active" && <CircleDotIcon size={16} className="text-primary" />}
          {task.status === "overdue" && <TriangleAlertIcon size={16} className="text-destructive" />}
          {task.status === "pending" && <CircleDashedIcon size={16} className="text-accent-3" />}
          <EllipsisVerticalIcon size={16} className="text-muted-foreground hover:text-foreground" />
        </div>
      </div>
    </div>
  );
}