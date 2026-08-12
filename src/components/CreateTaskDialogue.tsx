import { useState } from "react";
import {
  CalendarDaysIcon,
  CheckIcon,
  LoaderCircleIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/api/axios";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  projectId: string;
  trigger: React.ReactNode;
  onCreated?: () => void;
};

type Priority = "standard" | "high" | "urgent";

const priorities: {
  value: Priority;
  label: string;
  description: string;
}[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Normal priority",
  },
  {
    value: "high",
    label: "High",
    description: "Needs attention soon",
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Immediate priority",
  },
];

export default function CreateTaskDialog({
  projectId,
  trigger,
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<Priority>("standard");
  const [dueDate, setDueDate] = useState("");

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("standard");
    setDueDate("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!projectId || loading) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Please enter a task title.");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/projects/tasks/${projectId}`,
        {
          title: trimmedTitle,
          description:
            description.trim() || null,
          priority,
          dueDate: dueDate
            ? new Date(
                `${dueDate}T12:00:00`,
              ).toISOString()
            : null,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Task created.");

      resetForm();
      setOpen(false);

      onCreated?.();
    } catch (error) {
      console.error(
        "Failed to create task:",
        error,
      );

      toast.error(
        "The task could not be created. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (loading) {
          return;
        }

        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden",
          "rounded-[2rem] border-border p-0",
          "sm:max-w-xl",
        ].join(" ")}
      >
        {/* Fixed header */}
        <div className="shrink-0 border-b border-border bg-muted/30 px-6 py-5 sm:px-7">
          <DialogHeader className="text-left">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PlusIcon size={19} />
              </span>

              <div>
                <DialogTitle className="text-xl font-bold tracking-[-0.02em]">
                  Create task
                </DialogTitle>

                <DialogDescription className="mt-1 text-sm leading-6">
                  Add a task, choose its priority and optionally
                  set a deadline.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable form body */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5 sm:px-7">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="task-title"
                className="text-sm font-semibold"
              >
                Task title
              </Label>

              <Input
                id="task-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Example: Install kitchen lighting"
                maxLength={200}
                disabled={loading}
                autoFocus
                className="h-11 rounded-2xl bg-muted/30 px-4 shadow-none"
              />

              <p className="text-xs text-muted-foreground">
                Keep it short and outcome-focused.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label
                  htmlFor="task-description"
                  className="text-sm font-semibold"
                >
                  Description
                </Label>

                <span className="text-xs text-muted-foreground">
                  Optional
                </span>
              </div>

              <Textarea
                id="task-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="Add useful details, requirements or notes..."
                rows={3}
                disabled={loading}
                className="resize-none rounded-2xl bg-muted/30 p-4 leading-6 shadow-none"
              />
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold">
                  Priority
                </Label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Choose how urgently this task needs attention.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {priorities.map((option) => {
                  const selected =
                    priority === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setPriority(option.value)
                      }
                      className={cn(
                        "relative rounded-2xl border p-3 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                          : "border-border bg-muted/20 hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">
                            {option.label}
                          </p>

                          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                            {option.description}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border",
                          )}
                        >
                          {selected && (
                            <CheckIcon size={12} />
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due date */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label
                  htmlFor="task-due-date"
                  className="text-sm font-semibold"
                >
                  Due date
                </Label>

                <span className="text-xs text-muted-foreground">
                  Optional
                </span>
              </div>

              <div className="relative">
                <CalendarDaysIcon
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  disabled={loading}
                  className="h-11 rounded-2xl bg-muted/30 pl-11 shadow-none"
                />
              </div>
            </div>
          </div>

          {/* Fixed footer */}
          <DialogFooter className="shrink-0 border-t border-border bg-background px-6 py-4 sm:px-7">
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="h-10 rounded-full px-5"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                loading || !title.trim()
              }
              className="h-10 rounded-full px-6"
            >
              {loading ? (
                <>
                  <LoaderCircleIcon
                    size={16}
                    className="animate-spin"
                  />

                  Creating
                </>
              ) : (
                <>
                  <PlusIcon size={16} />

                  Create task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}