import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { motion, useReducedMotion } from "framer-motion";

import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  RefreshCwIcon,
  UserRoundIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import type { ProjectAllocatMember } from "@/Types/projectAllocatMember";

import { Calendar28 } from "@/components/DatePicker";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BusyIcon, primaryAction, secondaryAction } from "./workspace-ui";

import { initials } from "./workspace-utils";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  projectId: string;
  trigger: ReactNode;
  onCreated?: () => void | Promise<void>;
};

type Priority = "standard" | "high" | "urgent";

type AssignableMember = ProjectAllocatMember & {
  userId: string;
};

const priorities: {
  value: Priority;
  label: string;
  description: string;
}[] = [
  {
    value: "standard",
    label: "Standard",
    description: "Normal timeline",
  },
  {
    value: "high",
    label: "High",
    description: "Needs attention",
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Immediate",
  },
];

/* =========================================================
   THEME
========================================================= */

const controlStyle = [
  "w-full min-w-0 rounded-lg border border-input",
  "bg-surface-2/45 px-3.5",
  "text-base text-foreground shadow-none outline-none",
  "placeholder:text-muted-foreground/70",
  "transition-colors duration-150",
  "focus-visible:border-ring/60",
  "focus-visible:ring-2 focus-visible:ring-ring/10",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "motion-reduce:transition-none sm:text-sm",
].join(" ");

const assignmentMenuItem = [
  "flex min-h-12 items-center gap-3",
  "rounded-lg px-3 py-2.5",
  "text-xs text-foreground",
  "focus:bg-surface-3/65 focus:text-foreground",
  "data-[highlighted]:bg-surface-3/65",
  "data-[highlighted]:text-foreground",
].join(" ");

/* =========================================================
   CREATE TASK
========================================================= */

export default function CreateTaskDialog({
  projectId,
  trigger,
  onCreated,
}: Props) {
  const { user } = useAuth();

  const id = useId();
  const reduceMotion = useReducedMotion();

  const titleRef = useRef<HTMLInputElement>(null);
  const assignmentRef = useRef<HTMLButtonElement>(null);

  const mountedRef = useRef(true);
  const requestRef = useRef(0);
  const busyRef = useRef(false);
  const projectRef = useRef(projectId);

  projectRef.current = projectId;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("standard");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  // Empty means the backend assigns the task to its creator.
  const [assignedToId, setAssignedToId] = useState("");

  const [members, setMembers] = useState<ProjectAllocatMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [membersReload, setMembersReload] = useState(0);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [createdCount, setCreatedCount] = useState(0);

  /* =======================================================
     LIFECYCLE
  ======================================================= */

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

    setLoading(false);
    setOpen(false);
    setCreatedCount(0);

    setMembers([]);
    setMembersLoading(false);
    setMembersError(null);

    resetForm();
  }, [projectId]);

  /* =======================================================
     LOAD PROJECT MEMBERS
  ======================================================= */

  useEffect(() => {
    if (!open || !projectId) return;

    let cancelled = false;

    async function loadMembers() {
      setMembersLoading(true);
      setMembersError(null);
      setMembers([]);

      try {
        const response = await api.get<ProjectAllocatMember[]>(
          `/projects/${projectId}/allocats/members`,
          {
            withCredentials: true,
          },
        );

        if (cancelled || projectRef.current !== projectId) {
          return;
        }

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid project members response.");
        }

        setMembers(response.data);
      } catch {
        if (!cancelled && projectRef.current === projectId) {
          setMembers([]);
          setMembersError("The project team could not be loaded.");
        }
      } finally {
        if (!cancelled && projectRef.current === projectId) {
          setMembersLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [open, projectId, membersReload]);

  /* =======================================================
     ACCEPTED MEMBERS
  ======================================================= */

  const acceptedMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          String(member.status ?? "")
            .trim()
            .toLowerCase() === "accepted",
      ),
    [members],
  );

  const assignableMembers = useMemo(() => {
    const seen = new Set<string>();

    const currentUserId = user?.userId?.trim().toLowerCase();

    return acceptedMembers.flatMap((member): AssignableMember[] => {
      /*
       * The existing ProjectAllocatService uses this
       * profile key as the AllocatrUser ID.
       */
      const userId =
        typeof member.allocatProfileId === "string"
          ? member.allocatProfileId.trim()
          : "";

      const normalizedId = userId.toLowerCase();

      if (!userId || normalizedId === currentUserId || seen.has(normalizedId)) {
        return [];
      }

      seen.add(normalizedId);

      return [
        {
          ...member,
          userId,
        },
      ];
    });
  }, [acceptedMembers, user?.userId]);

  const missingMemberIds = acceptedMembers.some(
    (member) =>
      typeof member.allocatProfileId !== "string" ||
      !member.allocatProfileId.trim(),
  );

  const selectedMember = assignedToId
    ? assignableMembers.find((member) => member.userId === assignedToId)
    : undefined;

  const selectedName = assignedToId
    ? selectedMember?.fullName || "Selected Allocat unavailable"
    : user?.fullName || "Me";

  const selectedAvatar = assignedToId
    ? selectedMember?.avatarUrl
    : user?.avatarUrl;

  const selectedPersonName = assignedToId
    ? selectedMember?.fullName
    : user?.fullName;

  const assignmentUnavailable =
    Boolean(assignedToId) &&
    (membersLoading || Boolean(membersError) || !selectedMember);

  /* =======================================================
     FORM STATE
  ======================================================= */

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("standard");
    setDueDate(null);
    setAssignedToId("");

    setTitleError(null);
    setDescriptionError(null);
    setDateError(null);
    setAssignmentError(null);
    setSubmitError(null);
  }

  function changeOpen(nextOpen: boolean) {
    if (busyRef.current) return;

    setOpen(nextOpen);
    resetForm();
    setCreatedCount(0);

    setMembers([]);
    setMembersError(null);
    setMembersLoading(nextOpen);
  }

  function selectAssignee(userId: string) {
    if (busyRef.current) return;

    setAssignedToId(userId);
    setAssignmentError(null);
    setSubmitError(null);
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!open || !projectId || busyRef.current) return;

    setTitleError(null);
    setDescriptionError(null);
    setDateError(null);
    setAssignmentError(null);
    setSubmitError(null);

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || cleanTitle.length > 200) {
      setTitleError(
        cleanTitle
          ? "Keep the title within 200 characters."
          : "Enter a task title.",
      );

      titleRef.current?.focus();
      return;
    }

    if (cleanDescription.length > 2000) {
      setDescriptionError("Keep the description within 2,000 characters.");
      return;
    }

    if (assignmentUnavailable) {
      setAssignmentError(
        membersLoading
          ? "Wait for the project team to finish loading."
          : "Choose an available Allocat or assign the task to yourself.",
      );

      assignmentRef.current?.focus();
      return;
    }

    if (dueDate && !Number.isFinite(dueDate.getTime())) {
      setDateError("Choose a valid due date.");
      return;
    }

    // Preserve the existing local-noon deadline conversion.
    const deadline = dueDate
      ? new Date(
          dueDate.getFullYear(),
          dueDate.getMonth(),
          dueDate.getDate(),
          12,
          0,
          0,
          0,
        ).toISOString()
      : null;

    const request = ++requestRef.current;
    const submittedProjectId = projectId;

    const isCurrent = () =>
      mountedRef.current &&
      request === requestRef.current &&
      projectRef.current === submittedProjectId;

    busyRef.current = true;
    setLoading(true);

    try {
      await api.post(
        `/projects/tasks/${submittedProjectId}`,
        {
          title: cleanTitle,
          description: cleanDescription || null,
          priority,
          dueDate: deadline,
          assignedToId: assignedToId || null,
        },
        {
          withCredentials: true,
        },
      );

      if (!isCurrent()) return;

      resetForm();
      setCreatedCount((count) => count + 1);

      toast.success("Task created.");

      try {
        await onCreated?.();
      } catch {
        if (isCurrent()) {
          toast.error(
            "Task created, but the board could not be refreshed. Refresh the workspace to see it.",
          );
        }
      }
    } catch {
      if (isCurrent()) {
        setSubmitError(
          "The task could not be created. Your draft has been kept. Check the assignment and try again.",
        );
      }
    } finally {
      if (isCurrent()) {
        busyRef.current = false;
        setLoading(false);

        requestAnimationFrame(() => {
          if (isCurrent()) {
            titleRef.current?.focus();
          }
        });
      }
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          titleRef.current?.focus();
        }}
        className={[
          "flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col",
          "overflow-hidden rounded-xl border-border",
          "bg-card p-0 text-card-foreground shadow-none",
          "sm:max-w-[560px]",
        ].join(" ")}
      >
        <DialogHeader className="shrink-0 border-b border-border/70 px-5 py-5 text-left sm:px-7 sm:py-6">
          <div className="pr-8">
            <DialogTitle className="text-xl font-medium tracking-[-0.025em]">
              Create task
            </DialogTitle>

            <DialogDescription className="mt-2 text-xs leading-6 text-muted-foreground">
              Define the work and choose who will deliver it.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {/* TITLE */}

            <div>
              <label
                htmlFor={`${id}-title`}
                className="block text-xs font-medium"
              >
                Task title
                <span className="ml-1 font-normal text-muted-foreground">
                  (required)
                </span>
              </label>

              <input
                ref={titleRef}
                id={`${id}-title`}
                name="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleError(null);
                  setSubmitError(null);
                }}
                placeholder="What needs to be done?"
                maxLength={200}
                required
                disabled={loading}
                aria-invalid={Boolean(titleError)}
                aria-describedby={titleError ? `${id}-title-error` : undefined}
                className={[
                  controlStyle,
                  "mt-2 h-11",
                  titleError ? "border-destructive" : "",
                ].join(" ")}
              />

              {titleError && (
                <p
                  id={`${id}-title-error`}
                  role="alert"
                  className="mt-2 text-xs text-status-overdue-foreground"
                >
                  {titleError}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}

            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor={`${id}-description`}
                  className="text-xs font-medium"
                >
                  Description
                </label>

                <span className="text-[11px] text-muted-foreground">
                  Optional
                </span>
              </div>

              <textarea
                id={`${id}-description`}
                name="description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setDescriptionError(null);
                }}
                placeholder="Add requirements or the expected outcome…"
                rows={3}
                maxLength={2000}
                disabled={loading}
                aria-invalid={Boolean(descriptionError)}
                aria-describedby={
                  descriptionError ? `${id}-description-error` : undefined
                }
                className={`${controlStyle} mt-2 min-h-[96px] resize-y py-3 leading-6`}
              />

              {descriptionError && (
                <p
                  id={`${id}-description-error`}
                  role="alert"
                  className="mt-2 text-xs text-status-overdue-foreground"
                >
                  {descriptionError}
                </p>
              )}
            </div>

            {/* PRIORITY */}

            <fieldset disabled={loading}>
              <legend className="text-xs font-medium">Priority</legend>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {priorities.map((option) => {
                  const selected = priority === option.value;

                  return (
                    <label
                      key={option.value}
                      className="relative min-w-0 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`${id}-priority`}
                        value={option.value}
                        checked={selected}
                        onChange={() => setPriority(option.value)}
                        className="peer sr-only"
                      />

                      <span
                        className={[
                          "flex min-h-[68px] items-center",
                          "justify-between gap-1.5",
                          "rounded-lg border px-2.5 py-3",
                          "transition-opacity duration-150",
                          "peer-focus-visible:ring-2",
                          "peer-focus-visible:ring-ring/40",
                          "peer-disabled:cursor-not-allowed",
                          "peer-disabled:opacity-60",
                          "motion-reduce:transition-none",
                          selected
                            ? [
                                "border-brand-secondary-highlight",
                                "bg-brand-secondary-highlight",
                                "text-primary-foreground",
                                "dark:border-secondary",
                                "dark:bg-secondary",
                                "dark:text-secondary-foreground",
                              ].join(" ")
                            : [
                                "border-border",
                                "bg-surface-2/45",
                                "text-foreground",
                                "hover:opacity-75",
                              ].join(" "),
                        ].join(" ")}
                      >
                        <span className="min-w-0">
                          <span className="block text-xs font-medium">
                            {option.label}
                          </span>

                          <span
                            className={[
                              "mt-1 block text-[10px] leading-4",
                              selected
                                ? "text-inherit opacity-80"
                                : "text-muted-foreground",
                            ].join(" ")}
                          >
                            {option.description}
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className="flex h-4 w-4 shrink-0 items-center justify-center"
                        >
                          {selected && (
                            <motion.svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <motion.path
                                d="m5 12 4 4 10-10"
                                initial={
                                  reduceMotion
                                    ? false
                                    : {
                                        pathLength: 0,
                                        opacity: 0,
                                      }
                                }
                                animate={{
                                  pathLength: 1,
                                  opacity: 1,
                                }}
                                transition={{
                                  duration: reduceMotion ? 0 : 0.2,
                                  ease: "easeOut",
                                }}
                              />
                            </motion.svg>
                          )}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* ASSIGNMENT */}

            <div>
              <label
                htmlFor={`${id}-assignee`}
                className="block text-xs font-medium"
              >
                Assign to
              </label>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    ref={assignmentRef}
                    id={`${id}-assignee`}
                    type="button"
                    disabled={loading}
                    aria-invalid={Boolean(assignmentError)}
                    aria-describedby={
                      assignmentError
                        ? `${id}-assignment-error`
                        : `${id}-assignment-hint`
                    }
                    className={[
                      controlStyle,
                      "mt-2 flex min-h-12 items-center",
                      "gap-3 py-2 text-left",
                      assignmentError ? "border-destructive" : "",
                    ].join(" ")}
                  >
                    <MemberAvatar
                      name={selectedPersonName}
                      url={selectedAvatar}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium">
                        {assignedToId ? selectedName : "Assign to me"}
                      </span>

                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {assignedToId
                          ? selectedMember?.title || "Accepted project Allocat"
                          : user?.fullName || "Task creator"}
                      </span>
                    </span>

                    {membersLoading ? (
                      <BusyIcon />
                    ) : (
                      <ChevronDownIcon
                        size={14}
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground"
                      />
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={6}
                  collisionPadding={12}
                  className={[
                    "z-[80] w-[var(--radix-dropdown-menu-trigger-width)]",
                    "rounded-xl border border-border",
                    "bg-popover p-1.5",
                    "text-popover-foreground shadow-none",
                  ].join(" ")}
                >
                  <DropdownMenuItem
                    className={assignmentMenuItem}
                    onSelect={() => selectAssignee("")}
                  >
                    <MemberAvatar name={user?.fullName} url={user?.avatarUrl} />

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium">
                        Assign to me
                      </span>

                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {user?.fullName || "Task creator"}
                      </span>
                    </span>

                    {!assignedToId && (
                      <CheckIcon
                        size={14}
                        aria-hidden="true"
                        className="shrink-0 text-brand-secondary-highlight"
                      />
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border/70" />

                  {membersLoading ? (
                    <div
                      role="status"
                      className="flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground"
                    >
                      <BusyIcon />
                      Loading project team…
                    </div>
                  ) : (
                    <>
                      {assignableMembers.length > 0 && (
                        <div className="max-h-60 overflow-y-auto">
                          {assignableMembers.map((member) => (
                            <DropdownMenuItem
                              key={member.userId}
                              className={assignmentMenuItem}
                              onSelect={() => selectAssignee(member.userId)}
                            >
                              <MemberAvatar
                                name={member.fullName}
                                url={member.avatarUrl}
                              />

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-medium">
                                  {member.fullName}
                                </span>

                                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                                  {member.title || "Allocat professional"}
                                </span>
                              </span>

                              {assignedToId === member.userId && (
                                <CheckIcon
                                  size={14}
                                  aria-hidden="true"
                                  className="shrink-0 text-brand-secondary-highlight"
                                />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </div>
                      )}

                      {membersError ? (
                        <div
                          role="alert"
                          className="px-3 py-2 text-xs leading-5 text-status-overdue-foreground"
                        >
                          {membersError}
                        </div>
                      ) : missingMemberIds ? (
                        <p className="px-3 py-2 text-xs leading-5 text-muted-foreground">
                          Some project members are unavailable for assignment.
                        </p>
                      ) : assignableMembers.length === 0 ? (
                        <p className="px-3 py-3 text-xs leading-5 text-muted-foreground">
                          No other accepted Allocats are available.
                        </p>
                      ) : null}

                      <DropdownMenuItem
                        className={assignmentMenuItem}
                        onSelect={(event) => {
                          event.preventDefault();
                          setMembersReload((value) => value + 1);
                        }}
                      >
                        <RefreshCwIcon
                          size={13}
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        Refresh project team
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {assignmentError ? (
                <p
                  id={`${id}-assignment-error`}
                  role="alert"
                  className="mt-2 text-xs text-status-overdue-foreground"
                >
                  {assignmentError}
                </p>
              ) : (
                <p
                  id={`${id}-assignment-hint`}
                  className="mt-2 text-[11px] leading-5 text-muted-foreground"
                >
                  Only Allocats who have accepted this project can be assigned.
                </p>
              )}
            </div>

            {/* DEADLINE */}

            <fieldset disabled={loading} className="min-w-0">
              <Calendar28
                id={`${id}-due-date`}
                label="Due date (optional)"
                value={dueDate}
                onChange={(value) => {
                  if (busyRef.current) return;

                  setDueDate(value);
                  setDateError(null);
                }}
                className={[
                  "h-11 w-full rounded-lg border",
                  "border-input bg-surface-2/45",
                  "text-foreground shadow-none",
                  "transition-opacity hover:opacity-75",
                  "focus-visible:ring-2",
                  "focus-visible:ring-ring/10",
                  "motion-reduce:transition-none",
                ].join(" ")}
              />

              {dateError && (
                <p
                  role="alert"
                  className="mt-2 text-xs text-status-overdue-foreground"
                >
                  {dateError}
                </p>
              )}
            </fieldset>

            {submitError && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 px-3.5 py-3 text-xs leading-6 text-status-overdue-foreground"
              >
                {submitError}
              </p>
            )}
          </div>

          {/* FOOTER */}

          <div className="shrink-0 border-t border-border/70 bg-surface-2/50 px-5 py-4 sm:px-7">
            <p
              role="status"
              aria-live="polite"
              className="mb-3 text-[11px] leading-5 text-muted-foreground"
            >
              {createdCount
                ? `${createdCount} ${
                    createdCount === 1 ? "task" : "tasks"
                  } created. Add another or choose Done.`
                : "You can add several tasks without leaving this dialog."}
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => changeOpen(false)}
                className={secondaryAction}
              >
                {createdCount ? "Done" : "Close"}
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !title.trim() ||
                  !projectId ||
                  assignmentUnavailable
                }
                className={primaryAction}
              >
                {loading ? (
                  <BusyIcon />
                ) : (
                  <PlusIcon
                    size={14}
                    aria-hidden="true"
                    className="text-inherit"
                  />
                )}

                {loading ? "Creating…" : "Create task"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   MEMBER AVATAR
========================================================= */

function MemberAvatar({
  name,
  url,
}: {
  name?: string | null;
  url?: string | null;
}) {
  const cleanName = name?.trim();
  const cleanUrl = url?.trim() || undefined;

  return (
    <Avatar
      aria-hidden="true"
      className="h-7 w-7 shrink-0 border border-border/80"
    >
      <AvatarImage src={cleanUrl} alt="" className="object-cover" />

      <AvatarFallback className="bg-surface-3 text-[9px] font-medium text-brand-secondary-highlight">
        {cleanName ? (
          initials(cleanName)
        ) : (
          <UserRoundIcon size={13} aria-hidden="true" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
