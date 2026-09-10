import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import type { Task } from "@/Types/task";

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

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (task: Task) => void | Promise<void>;
};

function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) {
      return;
    }

    try {
      setDeleting(true);

      await onConfirm(task);

      onOpenChange(false);
    } catch {
      // The parent handles the error and toast.
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!deleting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2Icon size={18} />
          </span>

          <AlertDialogTitle>
            Delete task?
          </AlertDialogTitle>

          <AlertDialogDescription className="leading-6">
            <span className="font-medium text-foreground">
              {task.title}
            </span>{" "}
            will be permanently removed from this project. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel
            disabled={deleting}
            className="rounded-lg"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <LoaderCircleIcon
                  size={15}
                  className="animate-spin"
                />
                Deleting
              </>
            ) : (
              <>
                <Trash2Icon size={15} />
                Delete task
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTaskDialog;