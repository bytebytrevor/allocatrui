import { ListTodoIcon, PlusIcon } from "lucide-react";
import type { Task } from "@/Types/task";
import type { Project } from "@/Types/project";
import CreateTaskDialog from "./CreateTaskDialogue";
import TaskCard from "./TaskCard";
import { useDroppable, useDraggable } from "@dnd-kit/core";

type Status = "pending" | "active" | "complete" | "overdue";

type Props = {
  status: Status;
  title: string;
  description: string;
  tasks?: Task[];
  project?: Project;
  onTaskCreated?: () => void;
  className?: string;
};

function DraggableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: task.id,
    data: { task }
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      <TaskCard task={task} />
    </div>
  );
}

function TaskStatusBoard({
  status,
  title,
  description,
  tasks,
  project,
  onTaskCreated,
  className
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status
  });

  return (
    <section
      ref={setNodeRef}
      className={[
        "flex w-full min-w-[236px] flex-col",
        "min-h-[180px]",
        "max-h-[calc(100vh-230px)]",
        "overflow-hidden rounded-xl border bg-background p-3",
        className,
        isOver ? "ring-2 ring-primary/30" : ""
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          {/* <h3 className="text-sm font-semibold">{title}</h3> */}
          <h3 className="text-sm font-semibold">{title}</h3>

          <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground">
            {tasks?.length ?? 0}
          </span>
        </div>

        {project?.id && (
          <CreateTaskDialog
            projectId={project.id}
            onCreated={onTaskCreated}
            trigger={
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`Add task to ${title}`}
              >
                <PlusIcon size={15} />
              </button>
            }
          />
        )}
      </div>

      {!tasks?.length ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ListTodoIcon size={20} />
          </span>

          <p className="mt-3 text-sm font-medium">{description}</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Drag a task here or create a new one.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin">
          {tasks.map(task => (
            <DraggableTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskStatusBoard;