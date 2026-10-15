import { useEffect, useRef, useState } from "react";
import { Trash2Icon } from "lucide-react";

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

import { BusyIcon } from "./workspace-ui";

type Props = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (task: Task) => void | Promise<void>;
};

export default function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onConfirm,
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const requestRef = useRef(0);

  const scopeRef = useRef({
    taskId: task.id,
    open,
  });

  scopeRef.current = {
    taskId: task.id,
    open,
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
    };
  }, []);

  useEffect(() => {
    requestRef.current += 1;
    busyRef.current = false;

    setDeleting(false);
    setError(null);
  }, [task.id, open]);

  async function handleDelete() {
    if (!open || busyRef.current) return;

    const request = ++requestRef.current;
    const taskId = task.id;

    const isCurrent = () =>
      mountedRef.current &&
      request === requestRef.current &&
      scopeRef.current.taskId === taskId &&
      scopeRef.current.open;

    busyRef.current = true;
    setDeleting(true);
    setError(null);

    try {
      await onConfirm(task);

      if (isCurrent()) {
        onOpenChange(false);
      }
    } catch {
      if (isCurrent()) {
        setError("The task could not be deleted. Please try again.");
      }
    } finally {
      if (mountedRef.current && request === requestRef.current) {
        busyRef.current = false;
        setDeleting(false);
      }
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!busyRef.current) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <AlertDialogContent
        aria-busy={deleting}
        className={[
          "max-h-[90dvh] w-[calc(100vw-24px)]",
          "overflow-y-auto rounded-xl",
          "border-border bg-card p-5",
          "text-card-foreground shadow-none",
          "sm:max-w-[440px] sm:p-6",
        ].join(" ")}
      >
        <AlertDialogHeader className="text-left">
          <div className="flex items-center gap-2.5">
            <Trash2Icon
              size={18}
              aria-hidden="true"
              className="shrink-0 text-status-overdue-foreground"
            />

            <AlertDialogTitle className="text-lg font-medium tracking-[-0.02em]">
              Delete task?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-2 text-sm leading-7 text-muted-foreground">
            <span className="block break-words font-medium text-foreground">
              {task.title}
            </span>

            <span className="mt-2 block">
              This task will be permanently removed from the project. This
              action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p
            role="alert"
            className="text-xs leading-6 text-status-overdue-foreground"
          >
            {error}
          </p>
        )}

        <AlertDialogFooter className="mt-2 gap-2">
          <AlertDialogCancel
            disabled={deleting}
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
            className={[
              "mt-0 inline-flex min-h-10 items-center justify-center",
              "rounded-lg border px-3.5 py-2",
              "text-xs font-medium shadow-none",
              "transition-opacity duration-150",
              "hover:opacity-75",
              "focus-visible:ring-2",
              "focus-visible:ring-ring/35",
              "disabled:pointer-events-none disabled:opacity-55",
              "motion-reduce:transition-none",
            ].join(" ")}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            style={{
              backgroundColor: "var(--destructive)",
              borderColor: "var(--destructive)",
              color: "var(--destructive-foreground)",
            }}
            className={[
              "inline-flex min-h-10 items-center justify-center",
              "gap-2 rounded-lg border px-4 py-2",
              "text-xs font-medium shadow-none",
              "transition-opacity duration-150",
              "hover:opacity-90",
              "focus-visible:ring-2",
              "focus-visible:ring-ring/40",
              "disabled:pointer-events-none disabled:opacity-60",
              "motion-reduce:transition-none",
            ].join(" ")}
          >
            {deleting ? (
              <BusyIcon />
            ) : (
              <Trash2Icon
                size={14}
                aria-hidden="true"
                className="text-inherit"
              />
            )}

            {deleting ? "Deleting…" : "Delete task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
