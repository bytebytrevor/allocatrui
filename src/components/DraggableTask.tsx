// import { useDraggable } from "@dnd-kit/core";
// import type { Task } from "@/Types/task";
// import TaskCard from "./TaskCard";

// export function DraggableTask({ task }: { task: Task }) {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id: task.id
//   });

//   const style: React.CSSProperties = {
//     transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
//     opacity: isDragging ? 0 : 1 // hide original while dragging (overlay will show)
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       className="cursor-grab active:cursor-grabbing"
//     >
//       <TaskCard task={task} />
//     </div>
//   );
// }

import { useDraggable } from "@dnd-kit/core";
import type { Task } from "@/Types/task";
import TaskCard from "./TaskCard";

export function DraggableTask({ task }: { task: Task }) {
  const { setNodeRef, attributes, listeners, transform, isDragging } = useDraggable({
    id: task.id
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} />
    </div>
  );
}