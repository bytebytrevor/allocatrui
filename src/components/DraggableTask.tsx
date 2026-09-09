import type { CSSProperties } from "react";

import { useDraggable } from "@dnd-kit/core";

import type { Task } from "@/Types/task";

import TaskCard from "./TaskCard";

type TaskStatus =
  | "pending"
  | "active"
  | "complete"
  | "overdue";

type DraggableTaskProps = {
  task: Task;
  disabled?: boolean;

  onMoveTask?: (
    taskId: string,
    status: TaskStatus,
  ) => void | Promise<void>;

  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
};

export function DraggableTask({
  task,
  disabled = false,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}: DraggableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    disabled,
    data: {
      task,
    },
  });

  const style: CSSProperties = {
    transform:
      !disabled && transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!disabled ? attributes : {})}
      {...(!disabled ? listeners : {})}
      className={[
        "transition-opacity",
        !disabled
          ? "cursor-grab touch-none active:cursor-grabbing"
          : "",
      ].join(" ")}
    >
      <TaskCard
        task={task}
        canManageTasks={!disabled}
        onMoveTask={
          disabled
            ? undefined
            : onMoveTask
        }
        onEditTask={
          disabled
            ? undefined
            : onEditTask
        }
        onDeleteTask={
          disabled
            ? undefined
            : onDeleteTask
        }
      />
    </div>
  );
}