import { ListTodoIcon, PlusIcon } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";
import CreateTaskDialog from "./CreateTaskDialogue";
import { DraggableTask } from "./DraggableTask";
import { laneAppearance, quietAction } from "./workspace-ui";
import type { WorkflowStatus } from "./workspace-utils";

type Props = {
  status: WorkflowStatus; title: string; description: string; tasks?: Task[]; project?: Project;
  onTaskCreated?: () => void | Promise<void>; canManageTasks?: boolean; className?: string;
  onTaskMove?: (taskId: string, status: WorkflowStatus) => void | Promise<void>;
  onTaskEdit?: (task: Task) => void; onTaskDelete?: (task: Task) => void | Promise<void>;
  busyTaskIds?: ReadonlySet<string>; filtering?: boolean;
};
export default function TaskStatusBoard({ status, title, description, tasks = [], project, onTaskCreated, canManageTasks = false, className = "", onTaskMove, onTaskEdit, onTaskDelete, busyTaskIds, filtering = false }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status, disabled: !canManageTasks });
  const appearance = laneAppearance[status]; const Icon = appearance.icon;
  return <section ref={setNodeRef} aria-label={`${title}: ${tasks.length} tasks`} className={`flex min-w-0 flex-col overflow-hidden rounded-xl border bg-surface-2/55 transition-[border-color] duration-150 motion-reduce:transition-none ${isOver && canManageTasks ? "border-brand-secondary-highlight/25 dark:border-secondary/25" : "border-border/70"} ${className}`}>
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/65 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-2"><Icon size={16} aria-hidden="true" className={appearance.text} /><h3 className="truncate text-xs font-medium text-foreground">{title}</h3><span className="text-[11px] tabular-nums text-muted-foreground">{tasks.length}</span></div>
      {canManageTasks && status === "pending" && project?.id && <CreateTaskDialog projectId={project.id} onCreated={onTaskCreated} trigger={<button type="button" aria-label="Create task" className={`${quietAction} h-8 min-h-8 w-8 px-0`}><PlusIcon size={15} aria-hidden="true" /></button>} />}
    </header>
    <div className="min-h-0 overflow-y-auto p-3">
      {tasks.length ? <div className="space-y-3">{tasks.map(task => <DraggableTask key={task.id} task={task} disabled={!canManageTasks || Boolean(busyTaskIds?.has(task.id))} onMoveTask={onTaskMove} onEditTask={onTaskEdit} onDeleteTask={onTaskDelete} />)}{canManageTasks && <div aria-hidden="true" className={`h-9 rounded-lg border border-dashed ${isOver ? "border-brand-secondary-highlight/25 bg-brand-secondary-highlight/[0.035] dark:border-secondary/25 dark:bg-secondary/[0.045]" : "border-transparent"}`} />}</div> : <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-8 text-center"><ListTodoIcon size={23} aria-hidden="true" className="text-muted-foreground/70" /><p className="mt-4 text-xs font-medium">{description}</p><p className="mt-1.5 max-w-[210px] text-[11px] leading-6 text-muted-foreground">{filtering ? "Change or clear the board filters to see more work." : canManageTasks ? status === "pending" ? "Create the first task when you’re ready." : "Move a task here as the work progresses." : "Tasks in this stage will appear here."}</p></div>}
    </div>
  </section>;
}
