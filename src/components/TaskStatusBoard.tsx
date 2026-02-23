// import {
//     CalendarDaysIcon,
//     CircleCheckBigIcon,
//     CircleDashedIcon,
//     CircleDotIcon,
//     EllipsisVerticalIcon,
//     ListTodoIcon,
//     TriangleAlertIcon } from "lucide-react";
// import { Link } from "react-router-dom";
// import type { Task } from "@/Types/task"
// import CreateTaskDialog from "./CreateTaskDialogue";
// import type { Project } from "@/Types/project";

// import { useDroppable } from "@dnd-kit/core";
// import { useDraggable } from "@dnd-kit/core";

// type Status = "pending" | "active" | "complete" | "overdue";

// type Props = {
//     title: string;
//     description: string;
//     linkText: string;
//     tasks?: Task[];
//     project?: Project;
//     className?: string;
// }

// function DraggableTaskCard({ task }: { task: Task }) {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id: task.id
//   });

//   const style: React.CSSProperties = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     opacity: isDragging ? 0.6 : 1
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       className="bg-background/20 my-1 py-1 px-2 shadow-none border border-foreground/10 rounded-[6px] cursor-grab active:cursor-grabbing"
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
//           {task.status === "complete" && (
//             <CircleCheckBigIcon size={16} className="text-accent-2" />
//           )}
//           {task.status === "active" && (
//             <CircleDotIcon size={16} className="text-primary" />
//           )}
//           {task.status === "overdue" && (
//             <TriangleAlertIcon size={16} className="text-destructive" />
//           )}
//           {task.status === "pending" && (
//             <CircleDashedIcon size={16} className="text-accent-3" />
//           )}
//           <EllipsisVerticalIcon
//             size={16}
//             className="text-muted-foreground hover:text-foreground"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function TaskStatusBoard({title, description, linkText, tasks, project, className}: Props) {
//     const { setNodeRef, isOver } = useDroppable({ id: status });
//     return (
                       
//         <section
//             ref={setNodeRef}
//             className={`flex flex-col w-64 min-h-60 max-h-full bg-muted border border-t-5 rounded-sm p-2 mt-8 ${className} ${
//         isOver ? "ring-2 ring-foreground/20" : ""}`}
//             >

//             <h3 className="font-semibold text-xs text-foreground/80 pb-2">{title}</h3> 
//             {tasks == null || tasks?.length == 0 ? (  
//                 <div className="flex-1 flex gap-x-4 items-center justify-center text-muted-foreground">
//                     <ListTodoIcon />
//                     <small className="flex flex-col">
//                         {description}
//                         {project?.id && (
//                             <CreateTaskDialog
//                                 trigger={<Link className="text-accent-3" to="">{linkText}</Link>}
//                                 projectId={project.id}
//                             />
//                             )
//                         }
//                     </small>
//                 </div>) : (
//                 <section className="flex-1 overflow-y-auto max-h-full scrollbar-thin">
//                     {tasks?.map(task => (
//                         // <div key={task.id} className="bg-linear-to-br from-muted-foreground/15 to-muted-foreground/8 my-1 p-1 shadow-none border border-foreground/10 rounded-[6px]">
//                         <div key={task.id} className="bg-background/20 my-1 py-1 px-2 shadow-none border border-foreground/10 rounded-[6px]">
//                             <div className="flex items-center justify-between gap-2">
//                                 <div className="flex flex-col">
//                                     <h4 className="font-medium text-xs">{task.title}</h4>
//                                     <span className="flex gap-1 items-center text-[0.6rem] text-muted-foreground">
//                                         <CalendarDaysIcon size={10}/>
//                                         Due {task.dueDate
//                                             ? (` ${new Date(task.dueDate).toDateString()}`)
//                                             : <span className="italic">Not specified</span>}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center space-x-4">
//                                     {task.status == "complete" && <CircleCheckBigIcon size={16} className="text-accent-2"/>}
//                                     {task.status == "active" && <CircleDotIcon size={16} className="text-primary"/>}
//                                     {task.status == "overdue" && <TriangleAlertIcon size={16} className="text-destructive"/>}
//                                     {task.status == "pending" && <CircleDashedIcon size={16} className="text-accent-3"/>}
//                                     <EllipsisVerticalIcon size={16} className="text-muted-foreground hover:text-foreground"/>
//                                 </div>
//                             </div>
//                         </div>           
//                     ))}     
//                 </section>
//             )}              
//         </section>    
//     );
// }

// export default TaskStatusBoard;

import {
  CalendarDaysIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotIcon,
  EllipsisVerticalIcon,
  ListTodoIcon,
  TriangleAlertIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Task } from "@/Types/task";
import CreateTaskDialog from "./CreateTaskDialogue";
import type { Project } from "@/Types/project";

import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

type Status = "pending" | "active" | "complete" | "overdue";

type Props = {
  status: Status;
  title: string;
  description: string;
  linkText: string;
  tasks?: Task[];
  project?: Project;
  className?: string;
};

function DraggableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.6 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-background/20 my-1 py-1 px-2 shadow-none border border-foreground/10 rounded-[6px] cursor-grab active:cursor-grabbing"
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
          {task.status === "complete" && (
            <CircleCheckBigIcon size={16} className="text-accent-2" />
          )}
          {task.status === "active" && (
            <CircleDotIcon size={16} className="text-primary" />
          )}
          {task.status === "overdue" && (
            <TriangleAlertIcon size={16} className="text-destructive" />
          )}
          {task.status === "pending" && (
            <CircleDashedIcon size={16} className="text-accent-3" />
          )}
          <EllipsisVerticalIcon
            size={16}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

function TaskStatusBoard({
  status,
  title,
  description,
  linkText,
  tasks,
  project,
  className
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col w-64 min-h-60 max-h-full bg-muted border border-t-5 rounded-sm p-2 mt-8 ${className} ${
        isOver ? "ring-2 ring-foreground/20" : ""
      }`}
    >
      <h3 className="font-semibold text-xs text-foreground/80 pb-2">{title}</h3>

      {tasks == null || tasks.length === 0 ? (
        <div className="flex-1 flex gap-x-4 items-center justify-center text-muted-foreground">
          <ListTodoIcon />
          <small className="flex flex-col">
            {description}
            {project?.id && (
              <CreateTaskDialog
                trigger={<Link className="text-accent-3" to="">{linkText}</Link>}
                projectId={project.id}
              />
            )}
          </small>
        </div>
      ) : (
        <section className="flex-1 overflow-y-auto max-h-full scrollbar-thin">
          {tasks.map(task => (
            <DraggableTaskCard key={task.id} task={task} />
          ))}
        </section>
      )}
    </section>
  );
}

export default TaskStatusBoard;