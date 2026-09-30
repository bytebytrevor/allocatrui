// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   CalendarDaysIcon,
//   CheckCircle2Icon,
//   CircleDashedIcon,
//   CircleDotIcon,
//   Clock3Icon,
//   LoaderCircleIcon,
//   MessageSquareIcon,
//   MoreHorizontalIcon,
//   PencilIcon,
//   SendIcon,
//   Trash2Icon,
//   TriangleAlertIcon,
//   UserRoundIcon,
// } from "lucide-react";

// import api from "@/api/axios";

// import {
//   useAuth,
// } from "@/auth/useAuth";

// import type {
//   Task,
// } from "@/Types/task";

// import type {
//   TaskComment,
// } from "@/Types/taskComment";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";

// import {
//   Badge,
// } from "@/components/ui/badge";

// import {
//   Button,
// } from "@/components/ui/button";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// import {
//   Textarea,
// } from "@/components/ui/textarea";

// /* =========================================================
//    TYPES
// ========================================================= */

// type Props = {
//   task: Task;

//   open: boolean;

//   onOpenChange:
//     (open: boolean) => void;
// };

// /* =========================================================
//    TASK DIALOG
// ========================================================= */

// function TaskDialog({
//   task,
//   open,
//   onOpenChange,
// }: Props) {
//   const {
//     user,
//   } =
//     useAuth();

//     console.log(user);

//   /* =======================================================
//      COMMENT STATE
//   ======================================================= */

//   const [
//     comment,
//     setComment,
//   ] =
//     useState("");

//   const [
//     comments,
//     setComments,
//   ] =
//     useState<TaskComment[]>(
//       [],
//     );

//   const [
//     loadingComments,
//     setLoadingComments,
//   ] =
//     useState(false);

//   const [
//     sendingComment,
//     setSendingComment,
//   ] =
//     useState(false);

//   /* =======================================================
//      EDIT STATE
//   ======================================================= */

//   const [
//     editingCommentId,
//     setEditingCommentId,
//   ] =
//     useState<string | null>(
//       null,
//     );

//   const [
//     editCommentValue,
//     setEditCommentValue,
//   ] =
//     useState("");

//   const [
//     savingCommentId,
//     setSavingCommentId,
//   ] =
//     useState<string | null>(
//       null,
//     );

//   /* =======================================================
//      DELETE STATE
//   ======================================================= */

//   const [
//     deletingCommentId,
//     setDeletingCommentId,
//   ] =
//     useState<string | null>(
//       null,
//     );

//   const [
//     commentToDelete,
//     setCommentToDelete,
//   ] =
//     useState<TaskComment | null>(
//       null,
//     );

//   /* =======================================================
//      LOAD COMMENTS
//   ======================================================= */

//   useEffect(() => {
//     if (
//       !open ||
//       !task.id
//     ) {
//       return;
//     }

//     let cancelled =
//       false;

//     async function fetchComments() {
//       try {
//         setLoadingComments(
//           true,
//         );

//         const response =
//           await api.get<
//             TaskComment[]
//           >(
//             `/tasks/${task.id}/comments`,
//             {
//               withCredentials:
//                 true,
//             },
//           );

//         if (
//           cancelled
//         ) {
//           return;
//         }

//         setComments(
//           response.data,
//         );
//       } catch (
//         error
//       ) {
//         if (
//           cancelled
//         ) {
//           return;
//         }

//         console.error(
//           "Could not load task comments:",
//           error,
//         );
//       } finally {
//         if (
//           !cancelled
//         ) {
//           setLoadingComments(
//             false,
//           );
//         }
//       }
//     }

//     void fetchComments();

//     return () => {
//       cancelled =
//         true;
//     };
//   }, [
//     open,
//     task.id,
//   ]);

//   /* =======================================================
//      RESET TRANSIENT STATE
//   ======================================================= */

//   useEffect(() => {
//     if (
//       open
//     ) {
//       return;
//     }

//     setComment(
//       "",
//     );

//     setEditingCommentId(
//       null,
//     );

//     setEditCommentValue(
//       "",
//     );

//     setCommentToDelete(
//       null,
//     );
//   }, [
//     open,
//   ]);

//   /* =======================================================
//      CREATE COMMENT
//   ======================================================= */

//   async function handleSendComment() {
//     const cleanedComment =
//       comment.trim();

//     if (
//       !cleanedComment ||
//       sendingComment
//     ) {
//       return;
//     }

//     try {
//       setSendingComment(
//         true,
//       );

//       const response =
//         await api.post<
//           TaskComment
//         >(
//           `/tasks/${task.id}/comments`,
//           {
//             comment:
//               cleanedComment,
//           },
//           {
//             withCredentials:
//               true,
//           },
//         );

//       setComments(
//         (
//           current,
//         ) => [
//           ...current,
//           response.data,
//         ],
//       );

//       setComment(
//         "",
//       );
//     } catch (
//       error
//     ) {
//       console.error(
//         "Could not add task comment:",
//         error,
//       );
//     } finally {
//       setSendingComment(
//         false,
//       );
//     }
//   }

//   /* =======================================================
//      START EDITING
//   ======================================================= */

//   function startEditingComment(
//     taskComment:
//       TaskComment,
//   ) {
//     setEditingCommentId(
//       taskComment.id,
//     );

//     setEditCommentValue(
//       taskComment.comment,
//     );
//   }

//   /* =======================================================
//      CANCEL EDITING
//   ======================================================= */

//   function cancelEditingComment() {
//     setEditingCommentId(
//       null,
//     );

//     setEditCommentValue(
//       "",
//     );
//   }

//   /* =======================================================
//      SAVE EDIT
//   ======================================================= */

//   async function saveEditedComment(
//     commentId: string,
//   ) {
//     const nextComment =
//       editCommentValue.trim();

//     if (
//       !nextComment ||
//       savingCommentId
//     ) {
//       return;
//     }

//     try {
//       setSavingCommentId(
//         commentId,
//       );

//       const response =
//         await api.patch<
//           TaskComment
//         >(
//           `/tasks/${task.id}/comments/${commentId}`,
//           {
//             comment:
//               nextComment,
//           },
//           {
//             withCredentials:
//               true,
//           },
//         );

//       setComments(
//         (
//           current,
//         ) =>
//           current.map(
//             (
//               currentComment,
//             ) =>
//               currentComment.id ===
//               commentId
//                 ? response.data
//                 : currentComment,
//           ),
//       );

//       setEditingCommentId(
//         null,
//       );

//       setEditCommentValue(
//         "",
//       );
//     } catch (
//       error
//     ) {
//       console.error(
//         "Could not update task comment:",
//         error,
//       );
//     } finally {
//       setSavingCommentId(
//         null,
//       );
//     }
//   }

//   /* =======================================================
//      DELETE COMMENT
//   ======================================================= */

//   async function deleteComment(
//     commentId: string,
//   ) {
//     if (
//       deletingCommentId
//     ) {
//       return;
//     }

//     try {
//       setDeletingCommentId(
//         commentId,
//       );

//       await api.delete(
//         `/tasks/${task.id}/comments/${commentId}`,
//         {
//           withCredentials:
//             true,
//         },
//       );

//       setComments(
//         (
//           current,
//         ) =>
//           current.filter(
//             (
//               currentComment,
//             ) =>
//               currentComment.id !==
//               commentId,
//           ),
//       );

//       if (
//         editingCommentId ===
//         commentId
//       ) {
//         setEditingCommentId(
//           null,
//         );

//         setEditCommentValue(
//           "",
//         );
//       }

//       setCommentToDelete(
//         null,
//       );
//     } catch (
//       error
//     ) {
//       console.error(
//         "Could not delete task comment:",
//         error,
//       );
//     } finally {
//       setDeletingCommentId(
//         null,
//       );
//     }
//   }

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <>
//       <Dialog
//         open={
//           open
//         }
//         onOpenChange={
//           onOpenChange
//         }
//       >
//         <DialogContent
//           className={[
//             "flex max-h-[90vh] flex-col overflow-hidden p-0",
//             "sm:max-w-3xl",
//           ].join(
//             " ",
//           )}
//         >
//           {/* =================================================
//               HEADER
//           ================================================= */}

//           <DialogHeader className="shrink-0 border-b border-border px-6 py-6 text-left sm:px-7">
//             <div className="pr-8">
//               <div className="flex flex-wrap items-center gap-2">
//                 <TaskStatusBadge
//                   status={
//                     task.status
//                   }
//                 />

//                 {task.priority && (
//                   <Badge
//                     variant="outline"
//                     className="rounded-md font-medium capitalize shadow-none"
//                   >
//                     {
//                       task.priority
//                     }
//                   </Badge>
//                 )}
//               </div>

//               <DialogTitle className="mt-4 text-xl font-bold tracking-[-0.02em] sm:text-2xl">
//                 {
//                   task.title
//                 }
//               </DialogTitle>

//               <DialogDescription className="mt-2">
//                 Task details and discussion
//               </DialogDescription>
//             </div>
//           </DialogHeader>

//           {/* =================================================
//               BODY
//           ================================================= */}

//           <div className="min-h-0 flex-1 overflow-y-auto">

//             {/* ===============================================
//                 TASK DETAILS
//             =============================================== */}

//             <section className="px-6 py-6 sm:px-7">
//               <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_220px]">

//                 {/* Description */}

//                 <div>
//                   <SectionLabel>
//                     Description
//                   </SectionLabel>

//                   {task.description ? (
//                     <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
//                       {
//                         task.description
//                       }
//                     </p>
//                   ) : (
//                     <p className="mt-2 text-sm italic text-muted-foreground">
//                       No description added.
//                     </p>
//                   )}
//                 </div>

//                 {/* Metadata */}

//                 <div className="space-y-4">
//                   <TaskMeta
//                     icon={
//                       <CalendarDaysIcon
//                         size={
//                           15
//                         }
//                       />
//                     }
//                     label="Due date"
//                     value={formatDate(
//                       task.dueDate,
//                     )}
//                   />

//                   <TaskMeta
//                     icon={
//                       <UserRoundIcon
//                         size={
//                           15
//                         }
//                       />
//                     }
//                     label="Assigned to"
//                     value={getAssignedTo(
//                       task,
//                     )}
//                   />

//                   <TaskMeta
//                     icon={
//                       <Clock3Icon
//                         size={
//                           15
//                         }
//                       />
//                     }
//                     label="Status"
//                     value={formatStatus(
//                       task.status,
//                     )}
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* ===============================================
//                 DISCUSSION
//             =============================================== */}

//             <section className="border-t border-border">
//               <div className="px-6 py-6 sm:px-7">

//                 {/* Discussion header */}

//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <MessageSquareIcon
//                         size={
//                           16
//                         }
//                         className="text-primary"
//                       />

//                       <h2 className="text-sm font-bold">
//                         Discussion
//                       </h2>
//                     </div>

//                     <p className="mt-1 text-xs text-muted-foreground">
//                       Share feedback, ideas and updates about this task.
//                     </p>
//                   </div>

//                   {!loadingComments && (
//                     <span className="shrink-0 text-xs font-medium text-muted-foreground">
//                       {
//                         comments.length
//                       }{" "}
//                       {comments.length ===
//                       1
//                         ? "comment"
//                         : "comments"}
//                     </span>
//                   )}
//                 </div>

//                 {/* ===========================================
//                     COMMENTS
//                 =========================================== */}

//                 <div className="mt-6">
//                   {loadingComments ? (
//                     <CommentsLoading />
//                   ) : comments.length >
//                     0 ? (
//                     <div className="divide-y divide-border">
//                       {comments.map(
//                         (
//                           taskComment,
//                         ) => (
//                           <TaskCommentItem
//                             key={
//                               taskComment.id
//                             }
//                             comment={
//                               taskComment
//                             }
//                             currentUserId={
//                               user?.userId
//                             }
//                             editing={
//                               editingCommentId ===
//                               taskComment.id
//                             }
//                             editValue={
//                               editCommentValue
//                             }
//                             saving={
//                               savingCommentId ===
//                               taskComment.id
//                             }
//                             onEdit={() =>
//                               startEditingComment(
//                                 taskComment,
//                               )
//                             }
//                             onEditValueChange={
//                               setEditCommentValue
//                             }
//                             onSave={() =>
//                               void saveEditedComment(
//                                 taskComment.id,
//                               )
//                             }
//                             onCancel={
//                               cancelEditingComment
//                             }
//                             onDelete={() =>
//                               setCommentToDelete(
//                                 taskComment,
//                               )
//                             }
//                           />
//                         ),
//                       )}
//                     </div>
//                   ) : (
//                     <EmptyDiscussion />
//                   )}
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* =================================================
//               COMMENT COMPOSER
//           ================================================= */}

//           <div className="shrink-0 border-t border-border bg-background px-6 py-4 sm:px-7">
//             <div className="flex items-end gap-3">

//               {/* Current user */}

//               <Avatar className="h-8 w-8 shrink-0">
//                 <AvatarImage
//                   src={
//                     user?.avatarUrl
//                   }
//                   alt={
//                     user?.fullName
//                       ? `${user.fullName}'s profile`
//                       : "Your profile"
//                   }
//                   className="object-cover"
//                 />

//                 <AvatarFallback className="bg-primary/10 text-[0.62rem] font-bold text-primary">
//                   {getCommentInitials(
//                     user?.fullName,
//                   )}
//                 </AvatarFallback>
//               </Avatar>

//               {/* Composer */}

//               <div className="relative min-w-0 flex-1">
//                 <Textarea
//                   value={
//                     comment
//                   }
//                   onChange={(
//                     event,
//                   ) =>
//                     setComment(
//                       event.target
//                         .value,
//                     )
//                   }
//                   onKeyDown={(
//                     event,
//                   ) => {
//                     if (
//                       event.key ===
//                         "Enter" &&
//                       !event.shiftKey
//                     ) {
//                       event.preventDefault();

//                       if (
//                         comment.trim() &&
//                         !sendingComment
//                       ) {
//                         void handleSendComment();
//                       }
//                     }
//                   }}
//                   placeholder="Write a comment..."
//                   rows={
//                     1
//                   }
//                   maxLength={
//                     2000
//                   }
//                   className="min-h-[42px] resize-none pr-12"
//                   disabled={
//                     sendingComment
//                   }
//                 />

//                 <Button
//                   type="button"
//                   size="icon"
//                   onClick={() =>
//                     void handleSendComment()
//                   }
//                   disabled={
//                     !comment.trim() ||
//                     sendingComment
//                   }
//                   className={[
//                     "absolute bottom-1.5 right-1.5",
//                     "h-8 w-8 rounded-md shadow-none",
//                   ].join(
//                     " ",
//                   )}
//                   aria-label="Send comment"
//                 >
//                   {sendingComment ? (
//                     <LoaderCircleIcon
//                       size={
//                         14
//                       }
//                       className="animate-spin"
//                     />
//                   ) : (
//                     <SendIcon
//                       size={
//                         14
//                       }
//                     />
//                   )}
//                 </Button>
//               </div>
//             </div>

//             <p className="mt-2 pl-11 text-[0.6rem] text-muted-foreground">
//               Enter to send · Shift + Enter for a new line
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ===================================================
//           DELETE CONFIRMATION
//       =================================================== */}

//       <AlertDialog
//         open={
//           commentToDelete !==
//           null
//         }
//         onOpenChange={(
//           nextOpen,
//         ) => {
//           if (
//             !nextOpen &&
//             !deletingCommentId
//           ) {
//             setCommentToDelete(
//               null,
//             );
//           }
//         }}
//       >
//         <AlertDialogContent className="rounded-xl sm:max-w-md">
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               Delete comment?
//             </AlertDialogTitle>

//             <AlertDialogDescription>
//               This comment will be permanently removed from the task discussion.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <AlertDialogFooter>
//             <AlertDialogCancel
//               disabled={
//                 Boolean(
//                   deletingCommentId,
//                 )
//               }
//             >
//               Cancel
//             </AlertDialogCancel>

//             <AlertDialogAction
//               disabled={
//                 Boolean(
//                   deletingCommentId,
//                 )
//               }
//               onClick={(
//                 event,
//               ) => {
//                 event.preventDefault();

//                 if (
//                   commentToDelete
//                 ) {
//                   void deleteComment(
//                     commentToDelete.id,
//                   );
//                 }
//               }}
//             >
//               {deletingCommentId ? (
//                 <>
//                   <LoaderCircleIcon
//                     size={
//                       14
//                     }
//                     className="animate-spin"
//                   />

//                   Deleting
//                 </>
//               ) : (
//                 <>
//                   <Trash2Icon
//                     size={
//                       14
//                     }
//                   />

//                   Delete
//                 </>
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

// /* =========================================================
//    COMMENT ITEM
// ========================================================= */

// function TaskCommentItem({
//   comment,
//   currentUserId,
//   editing,
//   editValue,
//   saving,
//   onEdit,
//   onEditValueChange,
//   onSave,
//   onCancel,
//   onDelete,
// }: {
//   comment:
//     TaskComment;

//   currentUserId?:
//     string;

//   editing:
//     boolean;

//   editValue:
//     string;

//   saving:
//     boolean;

//   onEdit:
//     () => void;

//   onEditValueChange:
//     (
//       value:
//         string,
//     ) => void;

//   onSave:
//     () => void;

//   onCancel:
//     () => void;

//   onDelete:
//     () => void;
// }) {
//   const ownComment =
//     currentUserId ===
//     comment.createdById;

//   const edited =
//     Boolean(
//       comment.updatedAt,
//     );

//     console.log({
//       currentUserId,
//       createdById: comment.createdById,
//       ownComment,
//     });

//   return (
//     <article className="group flex gap-3 py-4">

//       {/* Avatar */}

//       <Avatar className="h-8 w-8 shrink-0">
//         <AvatarImage
//           src={
//             comment.avatarUrl ??
//             undefined
//           }
//           alt={
//             comment.createdByName
//               ? `${comment.createdByName}'s profile`
//               : "Comment author"
//           }
//           className="object-cover"
//         />

//         <AvatarFallback className="bg-primary/10 text-[0.62rem] font-bold text-primary">
//           {getCommentInitials(
//             comment.createdByName,
//           )}
//         </AvatarFallback>
//       </Avatar>

//       {/* Content */}

//       <div className="min-w-0 flex-1">
//         <div className="flex items-start justify-between gap-3">

//           {/* Author */}

//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
//               <p className="truncate text-xs font-semibold">
//                 {comment.createdByName ||
//                   "Allocatr user"}
//               </p>

//               {ownComment && (
//                 <span className="text-[0.58rem] font-medium text-primary">
//                   You
//                 </span>
//               )}

//               <span className="text-[0.62rem] text-muted-foreground">
//                 {formatCommentDate(
//                   comment.createdAt,
//                 )}
//               </span>

//               {edited && (
//                 <span
//                   className="text-[0.6rem] text-muted-foreground"
//                   title={
//                     comment.updatedAt
//                       ? `Edited ${formatCommentDate(
//                           comment.updatedAt,
//                         )}`
//                       : undefined
//                   }
//                 >
//                   Edited
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Options */}

//           {ownComment &&
//             !editing && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger
//                   asChild
//                 >
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className={[
//                       "h-7 w-7 shrink-0 rounded-md",
//                       "text-muted-foreground",
//                       "opacity-0 transition-all duration-150",
//                       "hover:bg-muted hover:text-foreground",
//                       "group-hover:opacity-100",
//                       "focus-visible:opacity-100",
//                       "data-[state=open]:bg-muted",
//                       "data-[state=open]:text-foreground",
//                       "data-[state=open]:opacity-100",
//                     ].join(
//                       " ",
//                     )}
//                     aria-label="Comment options"
//                   >
//                     <MoreHorizontalIcon
//                       size={
//                         14
//                       }
//                     />
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent
//                   align="end"
//                   sideOffset={
//                     5
//                   }
//                   className="w-36 rounded-lg p-1"
//                 >
//                   <DropdownMenuItem
//                     onSelect={
//                       onEdit
//                     }
//                     className="rounded-md text-xs"
//                   >
//                     <PencilIcon
//                       size={
//                         13
//                       }
//                     />

//                     Edit
//                   </DropdownMenuItem>

//                   <DropdownMenuItem
//                     onSelect={
//                       onDelete
//                     }
//                     className="rounded-md text-xs"
//                   >
//                     <Trash2Icon
//                       size={
//                         13
//                       }
//                     />

//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//         </div>

//         {/* Edit mode */}

//         {editing ? (
//           <div className="mt-2">
//             <Textarea
//               value={
//                 editValue
//               }
//               onChange={(
//                 event,
//               ) =>
//                 onEditValueChange(
//                   event.target
//                     .value,
//                 )
//               }
//               onKeyDown={(
//                 event,
//               ) => {
//                 if (
//                   event.key ===
//                     "Escape" &&
//                   !saving
//                 ) {
//                   onCancel();
//                 }

//                 if (
//                   event.key ===
//                     "Enter" &&
//                   !event.shiftKey &&
//                   !saving &&
//                   editValue.trim()
//                 ) {
//                   event.preventDefault();
//                   onSave();
//                 }
//               }}
//               maxLength={
//                 2000
//               }
//               rows={
//                 3
//               }
//               autoFocus
//               disabled={
//                 saving
//               }
//               className="min-h-24 resize-none rounded-lg"
//             />

//             <div className="mt-2 flex items-center justify-between gap-3">
//               <p className="text-[0.6rem] text-muted-foreground">
//                 Enter to save · Esc to cancel
//               </p>

//               <div className="flex items-center gap-2">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   disabled={
//                     saving
//                   }
//                   onClick={
//                     onCancel
//                   }
//                   className="h-8 rounded-md px-3 text-xs shadow-none"
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="button"
//                   size="sm"
//                   disabled={
//                     !editValue.trim() ||
//                     saving
//                   }
//                   onClick={
//                     onSave
//                   }
//                   className="h-8 rounded-md px-3 text-xs shadow-none"
//                 >
//                   {saving && (
//                     <LoaderCircleIcon
//                       size={
//                         13
//                       }
//                       className="animate-spin"
//                     />
//                   )}

//                   {saving
//                     ? "Saving"
//                     : "Save"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/85">
//             {
//               comment.comment
//             }
//           </p>
//         )}
//       </div>
//     </article>
//   );
// }

// /* =========================================================
//    COMMENTS LOADING
// ========================================================= */

// function CommentsLoading() {
//   return (
//     <div className="flex min-h-40 items-center justify-center">
//       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//         <LoaderCircleIcon
//           size={
//             16
//           }
//           className="animate-spin text-primary"
//         />

//         Loading comments...
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    EMPTY DISCUSSION
// ========================================================= */

// function EmptyDiscussion() {
//   return (
//     <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border px-5 py-8 text-center">
//       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
//         <MessageSquareIcon
//           size={
//             17
//           }
//         />
//       </div>

//       <p className="mt-3 text-sm font-semibold">
//         No comments yet
//       </p>

//       <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
//         Start the discussion by sharing an update, question or feedback about this task.
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    META
// ========================================================= */

// function TaskMeta({
//   icon,
//   label,
//   value,
// }: {
//   icon:
//     React.ReactNode;

//   label:
//     string;

//   value:
//     string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <span className="mt-0.5 text-muted-foreground">
//         {
//           icon
//         }
//       </span>

//       <div className="min-w-0">
//         <p className="text-[0.65rem] font-medium text-muted-foreground">
//           {
//             label
//           }
//         </p>

//         <p className="mt-0.5 truncate text-xs font-semibold">
//           {
//             value
//           }
//         </p>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION LABEL
// ========================================================= */

// function SectionLabel({
//   children,
// }: {
//   children:
//     React.ReactNode;
// }) {
//   return (
//     <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//       {
//         children
//       }
//     </p>
//   );
// }

// /* =========================================================
//    STATUS BADGE
// ========================================================= */

// function TaskStatusBadge({
//   status,
// }: {
//   status:
//     Task["status"];
// }) {
//   const config =
//     getStatusConfig(
//       status,
//     );

//   const Icon =
//     config.icon;

//   return (
//     <Badge
//       variant="outline"
//       className={`rounded-md shadow-none ${config.className}`}
//     >
//       <Icon
//         size={
//           12
//         }
//       />

//       {
//         config.label
//       }
//     </Badge>
//   );
// }

// /* =========================================================
//    STATUS CONFIG
// ========================================================= */

// function getStatusConfig(
//   status:
//     Task["status"],
// ) {
//   switch (
//     status
//   ) {
//     case "active":
//       return {
//         label:
//           "In progress",

//         icon:
//           CircleDotIcon,

//         className:
//           "border-primary/20 bg-primary/5 text-primary",
//       };

//     case "complete":
//       return {
//         label:
//           "Complete",

//         icon:
//           CheckCircle2Icon,

//         className:
//           "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-300",
//       };

//     case "overdue":
//       return {
//         label:
//           "Overdue",

//         icon:
//           TriangleAlertIcon,

//         className:
//           "border-destructive/20 bg-destructive/5 text-destructive",
//       };

//     default:
//       return {
//         label:
//           "Pending",

//         icon:
//           CircleDashedIcon,

//         className:
//           "border-border bg-muted/40 text-muted-foreground",
//       };
//   }
// }

// /* =========================================================
//    TASK HELPERS
// ========================================================= */

// function formatStatus(
//   status?:
//     string,
// ) {
//   if (
//     status ===
//     "active"
//   ) {
//     return "In progress";
//   }

//   if (
//     status ===
//     "complete"
//   ) {
//     return "Complete";
//   }

//   if (
//     status ===
//     "overdue"
//   ) {
//     return "Overdue";
//   }

//   return "Pending";
// }

// function formatDate(
//   date?:
//     | string
//     | Date
//     | null,
// ) {
//   if (
//     !date
//   ) {
//     return "No due date";
//   }

//   const parsed =
//     new Date(
//       date,
//     );

//   if (
//     Number.isNaN(
//       parsed.getTime(),
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

//       year:
//         "numeric",
//     },
//   ).format(
//     parsed,
//   );
// }

// function getAssignedTo(
//   task:
//     Task,
// ) {
//   const taskWithAssignment =
//     task as Task & {
//       assignedToName?:
//         string;
//     };

//   return (
//     taskWithAssignment.assignedToName ??
//     "Unassigned"
//   );
// }

// /* =========================================================
//    COMMENT HELPERS
// ========================================================= */

// function getCommentInitials(
//   name?:
//     string,
// ) {
//   if (
//     !name
//   ) {
//     return "U";
//   }

//   return name
//     .trim()
//     .split(
//       /\s+/,
//     )
//     .slice(
//       0,
//       2,
//     )
//     .map(
//       (
//         part,
//       ) =>
//         part
//           .charAt(
//             0,
//           )
//           .toUpperCase(),
//     )
//     .join(
//       "",
//     );
// }

// function formatCommentDate(
//   value:
//     string,
// ) {
//   const date =
//     new Date(
//       value,
//     );

//   if (
//     Number.isNaN(
//       date.getTime(),
//     )
//   ) {
//     return "";
//   }

//   return new Intl.DateTimeFormat(
//     "en",
//     {
//       day:
//         "numeric",

//       month:
//         "short",

//       hour:
//         "numeric",

//       minute:
//         "2-digit",
//     },
//   ).format(
//     date,
//   );
// }

// export default TaskDialog;

import { useEffect, useState, type ReactNode } from "react";

import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleDotIcon,
  Clock3Icon,
  LoaderCircleIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import type { Task } from "@/Types/task";
import type { TaskComment } from "@/Types/taskComment";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/* =========================================================
   TASK DIALOG
========================================================= */

function TaskDialog({ task, open, onOpenChange }: Props) {
  const { user } = useAuth();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<TaskComment | null>(null);

  /* =======================================================
     LOAD COMMENTS
  ======================================================= */

  useEffect(() => {
    if (!open || !task.id) return;

    let cancelled = false;

    async function fetchComments() {
      try {
        setLoadingComments(true);

        const response = await api.get<TaskComment[]>(
          `/tasks/${task.id}/comments`,
          { withCredentials: true },
        );

        if (cancelled) return;

        setComments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load task comments:", error);
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    }

    void fetchComments();

    return () => {
      cancelled = true;
    };
  }, [open, task.id]);

  useEffect(() => {
    if (open) return;

    setComment("");
    setEditingCommentId(null);
    setEditCommentValue("");
    setCommentToDelete(null);
  }, [open]);

  /* =======================================================
     CREATE COMMENT
  ======================================================= */

  async function handleSendComment() {
    const cleanedComment = comment.trim();

    if (!cleanedComment || sendingComment) return;

    try {
      setSendingComment(true);

      const response = await api.post<TaskComment>(
        `/tasks/${task.id}/comments`,
        { comment: cleanedComment },
        { withCredentials: true },
      );

      setComments(current => [...current, response.data]);
      setComment("");
    } catch (error) {
      console.error("Could not add task comment:", error);
    } finally {
      setSendingComment(false);
    }
  }

  /* =======================================================
     EDIT COMMENT
  ======================================================= */

  function startEditingComment(taskComment: TaskComment) {
    setEditingCommentId(taskComment.id);
    setEditCommentValue(taskComment.comment);
  }

  function cancelEditingComment() {
    setEditingCommentId(null);
    setEditCommentValue("");
  }

  async function saveEditedComment(commentId: string) {
    const nextComment = editCommentValue.trim();

    if (!nextComment || savingCommentId) return;

    try {
      setSavingCommentId(commentId);

      const response = await api.patch<TaskComment>(
        `/tasks/${task.id}/comments/${commentId}`,
        { comment: nextComment },
        { withCredentials: true },
      );

      setComments(current =>
        current.map(currentComment =>
          currentComment.id === commentId ? response.data : currentComment,
        ),
      );

      setEditingCommentId(null);
      setEditCommentValue("");
    } catch (error) {
      console.error("Could not update task comment:", error);
    } finally {
      setSavingCommentId(null);
    }
  }

  /* =======================================================
     DELETE COMMENT
  ======================================================= */

  async function deleteComment(commentId: string) {
    if (deletingCommentId) return;

    try {
      setDeletingCommentId(commentId);

      await api.delete(`/tasks/${task.id}/comments/${commentId}`, {
        withCredentials: true,
      });

      setComments(current =>
        current.filter(currentComment => currentComment.id !== commentId),
      );

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditCommentValue("");
      }

      setCommentToDelete(null);
    } catch (error) {
      console.error("Could not delete task comment:", error);
    } finally {
      setDeletingCommentId(null);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={[
            "flex max-h-[90vh] flex-col overflow-hidden p-0",
            "border-[#315E6C]/[0.09] bg-[#F7F9F7] text-[#30383A]",
            "shadow-[0_28px_80px_-34px_rgba(22,44,50,0.36)]",
            "sm:max-w-3xl sm:rounded-[1.5rem]",
            "dark:border-white/[0.08] dark:bg-[#0C1D22] dark:text-white",
            "dark:shadow-[0_28px_80px_-34px_rgba(0,0,0,0.78)]",
          ].join(" ")}
        >
          {/* HEADER */}

          <DialogHeader className="shrink-0 border-b border-[#315E6C]/[0.07] bg-[#E9F0ED] px-6 py-6 text-left dark:border-white/[0.06] dark:bg-[#10262D] sm:px-7">
            <div className="pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <TaskStatusBadge status={task.status} />

                {task.priority && (
                  <Badge
                    variant="outline"
                    className="rounded-md border-[#315E6C]/[0.10] bg-[#F4F7F5] font-medium capitalize text-[#65777B] shadow-none dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-white/40"
                  >
                    {task.priority}
                  </Badge>
                )}
              </div>

              <DialogTitle className="mt-4 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
                {task.title}
              </DialogTitle>

              <DialogDescription className="mt-2 text-[#718084] dark:text-white/32">
                Task details and discussion
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* BODY */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* TASK DETAILS */}

            <section className="px-6 py-6 sm:px-7 sm:py-7">
              <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-8">
                <div>
                  <SectionLabel>Description</SectionLabel>

                  {task.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#435154] dark:text-white/72">
                      {task.description}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm italic text-[#7A878A] dark:text-white/30">
                      No description added.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-[#315E6C]/[0.07] bg-[#E8EFEC] p-4 dark:border-white/[0.06] dark:bg-[#10262D]">
                  <div className="space-y-4">
                    <TaskMeta
                      icon={<CalendarDaysIcon size={14} />}
                      label="Due date"
                      value={formatDate(task.dueDate)}
                    />

                    <TaskMeta
                      icon={<UserRoundIcon size={14} />}
                      label="Assigned to"
                      value={getAssignedTo(task)}
                    />

                    <TaskMeta
                      icon={<Clock3Icon size={14} />}
                      label="Status"
                      value={formatStatus(task.status)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* DISCUSSION */}

            <section className="border-t border-[#315E6C]/[0.07] dark:border-white/[0.06]">
              <div className="px-6 py-6 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D8E6E2] text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                        <MessageSquareIcon size={13} />
                      </span>

                      <h2 className="text-sm font-semibold">Discussion</h2>
                    </div>

                    <p className="mt-1.5 text-xs text-[#748286] dark:text-white/28">
                      Share feedback, ideas and updates about this task.
                    </p>
                  </div>

                  {!loadingComments && (
                    <span className="shrink-0 text-[0.65rem] font-medium text-[#7D898C] dark:text-white/25">
                      {comments.length}{" "}
                      {comments.length === 1 ? "comment" : "comments"}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  {loadingComments ? (
                    <CommentsLoading />
                  ) : comments.length > 0 ? (
                    <div className="divide-y divide-[#315E6C]/[0.07] dark:divide-white/[0.06]">
                      {comments.map(taskComment => (
                        <TaskCommentItem
                          key={taskComment.id}
                          comment={taskComment}
                          currentUserId={user?.userId}
                          editing={editingCommentId === taskComment.id}
                          editValue={editCommentValue}
                          saving={savingCommentId === taskComment.id}
                          onEdit={() => startEditingComment(taskComment)}
                          onEditValueChange={setEditCommentValue}
                          onSave={() =>
                            void saveEditedComment(taskComment.id)
                          }
                          onCancel={cancelEditingComment}
                          onDelete={() => setCommentToDelete(taskComment)}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyDiscussion />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* COMPOSER */}

          <div className="shrink-0 border-t border-[#315E6C]/[0.07] bg-[#EDF3F1] px-6 py-4 dark:border-white/[0.06] dark:bg-[#10262D] sm:px-7">
            <div className="flex items-end gap-3">
              <Avatar className="h-8 w-8 shrink-0 border border-[#315E6C]/[0.10] dark:border-white/[0.08]">
                <AvatarImage
                  src={user?.avatarUrl}
                  alt={
                    user?.fullName
                      ? `${user.fullName}'s profile`
                      : "Your profile"
                  }
                  className="object-cover"
                />

                <AvatarFallback className="bg-[#D8E6E2] text-[0.62rem] font-semibold text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                  {getCommentInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="relative min-w-0 flex-1">
                <Textarea
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();

                      if (comment.trim() && !sendingComment) {
                        void handleSendComment();
                      }
                    }
                  }}
                  placeholder="Write a comment..."
                  rows={1}
                  maxLength={2000}
                  className="min-h-[42px] resize-none rounded-xl border-[#315E6C]/[0.10] bg-[#F7F9F7] pr-12 shadow-none focus-visible:ring-[#315E6C]/20 dark:border-white/[0.08] dark:bg-[#0C1D22] dark:focus-visible:ring-[#DEDA00]/20"
                  disabled={sendingComment}
                />

                <Button
                  type="button"
                  size="icon"
                  onClick={() => void handleSendComment()}
                  disabled={!comment.trim() || sendingComment}
                  className={[
                    "absolute bottom-1.5 right-1.5 h-8 w-8 rounded-lg shadow-none",
                    "bg-[#315E6C] text-white hover:bg-[#294F5B]",
                    "dark:bg-[#DEDA00] dark:text-[#303030] dark:hover:bg-[#D4D000]",
                  ].join(" ")}
                  aria-label="Send comment"
                >
                  {sendingComment ? (
                    <LoaderCircleIcon size={13} className="animate-spin" />
                  ) : (
                    <SendIcon size={13} />
                  )}
                </Button>
              </div>
            </div>

            <p className="mt-2 pl-11 text-[0.57rem] text-[#839093] dark:text-white/22">
              Enter to send · Shift + Enter for a new line
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}

      <AlertDialog open={commentToDelete !== null} onOpenChange={nextOpen => {
        if (!nextOpen && !deletingCommentId) setCommentToDelete(null);
      }}>
        <AlertDialogContent className="rounded-xl border-[#315E6C]/[0.09] bg-[#F7F9F7] dark:border-white/[0.08] dark:bg-[#10262D] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>

            <AlertDialogDescription>
              This comment will be permanently removed from the task discussion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingCommentId)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={Boolean(deletingCommentId)}
              onClick={event => {
                event.preventDefault();

                if (commentToDelete) {
                  void deleteComment(commentToDelete.id);
                }
              }}
            >
              {deletingCommentId ? (
                <>
                  <LoaderCircleIcon size={14} className="animate-spin" />
                  Deleting
                </>
              ) : (
                <>
                  <Trash2Icon size={14} />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* =========================================================
   COMMENT
========================================================= */

function TaskCommentItem({
  comment,
  currentUserId,
  editing,
  editValue,
  saving,
  onEdit,
  onEditValueChange,
  onSave,
  onCancel,
  onDelete,
}: {
  comment: TaskComment;
  currentUserId?: string;
  editing: boolean;
  editValue: string;
  saving: boolean;
  onEdit: () => void;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const ownComment = currentUserId === comment.createdById;
  const edited = Boolean(comment.updatedAt);

  return (
    <article className="group flex gap-3 py-4">
      <Avatar className="h-8 w-8 shrink-0 border border-[#315E6C]/[0.08] dark:border-white/[0.07]">
        <AvatarImage
          src={comment.avatarUrl ?? undefined}
          alt={
            comment.createdByName
              ? `${comment.createdByName}'s profile`
              : "Comment author"
          }
          className="object-cover"
        />

        <AvatarFallback className="bg-[#D8E6E2] text-[0.62rem] font-semibold text-[#315E6C] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
          {getCommentInitials(comment.createdByName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="truncate text-xs font-semibold">
                {comment.createdByName || "Allocatr user"}
              </p>

              {ownComment && (
                <span className="text-[0.56rem] font-semibold text-[#315E6C] dark:text-[#DEDA00]">
                  You
                </span>
              )}

              <span className="text-[0.58rem] text-[#839093] dark:text-white/24">
                {formatCommentDate(comment.createdAt)}
              </span>

              {edited && (
                <span
                  className="text-[0.56rem] text-[#929C9E] dark:text-white/20"
                  title={
                    comment.updatedAt
                      ? `Edited ${formatCommentDate(comment.updatedAt)}`
                      : undefined
                  }
                >
                  Edited
                </span>
              )}
            </div>
          </div>

          {ownComment && !editing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={[
                    "h-7 w-7 shrink-0 rounded-md",
                    "text-[#829093] opacity-0 transition-all duration-150",
                    "hover:bg-[#E2EAE7] hover:text-[#315E6C]",
                    "group-hover:opacity-100 focus-visible:opacity-100",
                    "data-[state=open]:bg-[#E2EAE7] data-[state=open]:text-[#315E6C] data-[state=open]:opacity-100",
                    "dark:text-white/25 dark:hover:bg-white/[0.05] dark:hover:text-white",
                    "dark:data-[state=open]:bg-white/[0.05] dark:data-[state=open]:text-white",
                  ].join(" ")}
                  aria-label="Comment options"
                >
                  <MoreHorizontalIcon size={14} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={5}
                className="w-36 rounded-lg border-[#315E6C]/[0.09] bg-[#F7F9F7] p-1 dark:border-white/[0.08] dark:bg-[#10262D]"
              >
                <DropdownMenuItem
                  onSelect={onEdit}
                  className="rounded-md text-xs focus:bg-[#E4ECE9] dark:focus:bg-white/[0.05]"
                >
                  <PencilIcon size={13} />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={onDelete}
                  className="rounded-md text-xs text-[#9F3C1A] focus:bg-[#AD3A12]/[0.07] focus:text-[#9F3C1A] dark:text-[#D27857]"
                >
                  <Trash2Icon size={13} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {editing ? (
          <div className="mt-2">
            <Textarea
              value={editValue}
              onChange={event => onEditValueChange(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Escape" && !saving) onCancel();

                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !saving &&
                  editValue.trim()
                ) {
                  event.preventDefault();
                  onSave();
                }
              }}
              maxLength={2000}
              rows={3}
              autoFocus
              disabled={saving}
              className="min-h-24 resize-none rounded-xl border-[#315E6C]/[0.10] bg-[#F4F7F5] shadow-none focus-visible:ring-[#315E6C]/20 dark:border-white/[0.08] dark:bg-[#08171C] dark:focus-visible:ring-[#DEDA00]/20"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[0.57rem] text-[#839093] dark:text-white/22">
                Enter to save · Esc to cancel
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={saving}
                  onClick={onCancel}
                  className="h-8 rounded-md px-3 text-xs text-[#748286] shadow-none hover:bg-[#E4ECE9] dark:text-white/34 dark:hover:bg-white/[0.05]"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={!editValue.trim() || saving}
                  onClick={onSave}
                  className="h-8 rounded-md bg-[#315E6C] px-3 text-xs text-white shadow-none hover:bg-[#294F5B] dark:bg-[#DEDA00] dark:text-[#303030] dark:hover:bg-[#D4D000]"
                >
                  {saving && (
                    <LoaderCircleIcon size={13} className="animate-spin" />
                  )}

                  {saving ? "Saving" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-[#4D5C5F] dark:text-white/68">
            {comment.comment}
          </p>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   COMMENTS LOADING
========================================================= */

function CommentsLoading() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="flex items-center gap-2 text-xs text-[#748286] dark:text-white/30">
        <LoaderCircleIcon
          size={15}
          className="animate-spin text-[#315E6C] dark:text-[#DEDA00]"
        />

        Loading comments...
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY DISCUSSION
========================================================= */

function EmptyDiscussion() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-[#315E6C]/[0.10] bg-[#EDF3F1] px-5 py-8 text-center dark:border-white/[0.07] dark:bg-[#10262D]">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8E6E2] text-[#60777C] dark:bg-white/[0.04] dark:text-white/30">
        <MessageSquareIcon size={16} />
      </div>

      <p className="mt-3 text-sm font-semibold">No comments yet</p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-[#758285] dark:text-white/28">
        Start the discussion by sharing an update, question or feedback about
        this task.
      </p>
    </div>
  );
}

/* =========================================================
   META
========================================================= */

function TaskMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#6D8084] dark:text-white/28">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[0.58rem] font-medium text-[#7A888B] dark:text-white/25">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-semibold text-[#425053] dark:text-white/72">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION LABEL
========================================================= */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-[#748286] dark:text-white/27">
      {children}
    </p>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function TaskStatusBadge({ status }: { status: Task["status"] }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`rounded-md shadow-none ${config.className}`}
    >
      <Icon size={11} />
      {config.label}
    </Badge>
  );
}

/* =========================================================
   STATUS CONFIG
========================================================= */

function getStatusConfig(status: Task["status"]) {
  switch (status) {
    case "active":
      return {
        label: "In progress",
        icon: CircleDotIcon,
        className:
          "border-[#315E6C]/15 bg-[#D8E6E2] text-[#315E6C] dark:border-[#DEDA00]/15 dark:bg-[#DEDA00]/[0.07] dark:text-[#DEDA00]",
      };

    case "complete":
      return {
        label: "Complete",
        icon: CheckCircle2Icon,
        className:
          "border-[#568B5E]/15 bg-[#DCE9DE] text-[#477A4F] dark:border-[#38D200]/15 dark:bg-[#38D200]/[0.07] dark:text-[#38D200]",
      };

    case "overdue":
      return {
        label: "Overdue",
        icon: TriangleAlertIcon,
        className:
          "border-[#AD3A12]/15 bg-[#EFE0DA] text-[#9F3C1A] dark:border-[#AD3A12]/20 dark:bg-[#AD3A12]/[0.08] dark:text-[#D27857]",
      };

    default:
      return {
        label: "Pending",
        icon: CircleDashedIcon,
        className:
          "border-[#B98645]/15 bg-[#ECE1D3] text-[#8A632F] dark:border-[#F0A23A]/15 dark:bg-[#F0A23A]/[0.07] dark:text-[#F0A23A]",
      };
  }
}

/* =========================================================
   TASK HELPERS
========================================================= */

function formatStatus(status?: string) {
  if (status === "active") return "In progress";
  if (status === "complete") return "Complete";
  if (status === "overdue") return "Overdue";

  return "Pending";
}

function formatDate(date?: string | Date | null) {
  if (!date) return "No due date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "No due date";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getAssignedTo(task: Task) {
  const taskWithAssignment = task as Task & {
    assignedToName?: string;
  };

  return taskWithAssignment.assignedToName ?? "Unassigned";
}

/* =========================================================
   COMMENT HELPERS
========================================================= */

function getCommentInitials(name?: string) {
  if (!name?.trim()) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

function formatCommentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default TaskDialog;