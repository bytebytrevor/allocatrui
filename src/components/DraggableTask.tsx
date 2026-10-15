import { GripVerticalIcon } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

import type { Task } from "@/Types/task";
import TaskCard from "./TaskCard";
import type { WorkflowStatus } from "./workspace-utils";

type Props = {
  task: Task;
  disabled?: boolean;
  onMoveTask?: (taskId: string, status: WorkflowStatus) => void | Promise<void>;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void | Promise<void>;
};

export function DraggableTask({
  task,
  disabled = false,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}: Props) {
  const { setNodeRef, setActivatorNodeRef, listeners, attributes, isDragging } =
    useDraggable({
      id: task.id,
      disabled,
    });

  return (
    <div
      ref={setNodeRef}
      className="min-w-0"
      style={{ opacity: isDragging ? 0.35 : 1 }}
    >
      <TaskCard
        task={task}
        canManageTasks={!disabled}
        onMoveTask={onMoveTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        dragHandle={
          !disabled ? (
            <button
              ref={setActivatorNodeRef}
              type="button"
              {...attributes}
              {...listeners}
              aria-label={`Drag task ${task.title}`}
              title="Drag task"
              className={[
                "flex h-8 w-6 touch-none items-center justify-center",
                "rounded-md text-muted-foreground/65",
                "hover:text-foreground",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring/35",
              ].join(" ")}
            >
              <GripVerticalIcon size={14} aria-hidden="true" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
