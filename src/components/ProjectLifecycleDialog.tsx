import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { BanIcon, LoaderCircleIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import type { Project } from "@/Types/project";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  project: Project;
  action: "cancel" | "leave";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated?: (project: Project) => void;
  onLeft?: () => void;
};

export default function ProjectLifecycleDialog({
  project,
  action,
  open,
  onOpenChange,
  onProjectUpdated,
  onLeft,
}: Props) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (open && !busy.current) {
      setReason("");
      setError(null);
    }
  }, [open, project.id, action]);
  const cancelling = action === "cancel";
  const Icon = cancelling ? BanIcon : LogOutIcon;
  const title = cancelling ? "Cancel project?" : "Leave project?";
  const reasonId = `${action}-reason-${project.id}`;

  async function submit() {
    if (busy.current) return;
    const clean = reason.trim();
    if (!clean || clean.length > 1000) {
      setError("Provide a reason of 1 to 1,000 characters.");
      return;
    }
    busy.current = true;
    setSubmitting(true);
    setError(null);
    try {
      if (cancelling) {
        const { data } = await api.patch<Project>(
          `/projects/${project.id}/cancel`,
          { reason: clean },
          { withCredentials: true },
        );
        if (!mounted.current) return;
        const updated = { ...project, ...data };
        onProjectUpdated?.(updated);
        window.dispatchEvent(
          new CustomEvent("allocatr:project-cancelled", { detail: updated }),
        );
      } else {
        await api.patch(
          `/projects/${project.id}/allocats/leave`,
          { reason: clean },
          { withCredentials: true },
        );
        if (!mounted.current) return;
        window.dispatchEvent(
          new CustomEvent("allocatr:project-left", {
            detail: { projectId: project.id },
          }),
        );
      }
      toast.success(
        cancelling ? "Project cancelled." : "You have left the project.",
      );
      onOpenChange(false);
      if (!cancelling) onLeft?.();
    } catch (failure) {
      if (!mounted.current) return;
      const message = isAxiosError<{ message?: string }>(failure)
        ? failure.response?.data?.message
        : undefined;
      setError(
        message ||
          (cancelling
            ? "The project could not be cancelled. Please try again."
            : "You could not leave the project. Please try again."),
      );
    } finally {
      busy.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!busy.current) onOpenChange(value);
      }}
    >
      <DialogContent
        onEscapeKeyDown={(event) => {
          if (busy.current) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (busy.current) event.preventDefault();
        }}
        className="max-h-[90dvh] overflow-y-auto rounded-xl border-border/60 bg-card p-0 text-card-foreground shadow-none sm:max-w-lg"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <DialogHeader className="border-b border-border/55 px-6 pb-5 pt-6 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-3 text-brand-secondary-highlight dark:text-secondary">
              <Icon size={17} aria-hidden="true" />
            </span>
            <DialogTitle className="mt-4 text-xl font-semibold tracking-[-0.025em]">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-7">
              {cancelling
                ? "This immediately stops project work for everyone. Project history and discussion remain available. This cannot be undone."
                : "This ends your membership immediately. You will lose access to the workspace, and your unfinished tasks will become unassigned. Your existing contributions remain part of the project."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 px-6 py-5">
            <div className="rounded-lg border border-border/60 bg-surface-2/40 p-4">
              <p className="break-words text-sm font-medium">{project.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.projectCode}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={reasonId}>Reason</Label>
              <Textarea
                id={reasonId}
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setError(null);
                }}
                disabled={submitting}
                maxLength={1000}
                rows={4}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? `${reasonId}-error` : `${reasonId}-hint`
                }
                className="min-h-28 resize-none border-border/65 bg-surface-2/40 text-base shadow-none sm:text-sm"
              />
              <div
                id={`${reasonId}-hint`}
                className="flex justify-between gap-3 text-[11px] text-muted-foreground"
              >
                <span>
                  {cancelling
                    ? "Shared with the project’s current Allocats."
                    : "Shared with the project owner."}
                </span>
                <span className="tabular-nums">{reason.length}/1000</span>
              </div>
              {error && (
                <p
                  id={`${reasonId}-error`}
                  role="alert"
                  className="text-xs leading-6 text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="border-t border-border/55 bg-surface-2/30 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-lg border-border/65 bg-card px-4 text-xs text-foreground shadow-none transition-opacity hover:bg-card hover:text-foreground hover:opacity-75"
            >
              Keep project{cancelling ? " open" : " membership"}
            </Button>
            <Button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="h-10 rounded-lg border border-brand-secondary-highlight/20 bg-brand-secondary-highlight px-5 text-xs text-primary-foreground shadow-none transition-opacity hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90 dark:border-secondary/20 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground"
            >
              {submitting && (
                <LoaderCircleIcon
                  size={14}
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
              )}
              {submitting
                ? cancelling
                  ? "Cancelling…"
                  : "Leaving…"
                : cancelling
                  ? "Cancel project"
                  : "Leave project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
