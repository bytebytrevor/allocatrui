import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  ArrowRightIcon,
  BanIcon,
  CalendarDaysIcon,
  CircleCheckBigIcon,
  Edit3Icon,
  EllipsisVerticalIcon,
  EyeIcon,
  FolderOpenIcon,
  LoaderCircleIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { ProjectAllocatMember } from "@/Types/projectAllocatMember";

import {
  getProjectCategoryLabel,
  getProjectIcon,
  getProjectIconSurfaceClass,
} from "@/utils/projectIcons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Calendar28 } from "@/components/DatePicker";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   MOTION LINK
========================================================= */

const MotionLink = motion.create(Link);

/* =========================================================
   TYPES
========================================================= */

type ViewProps = {
  project: Project;
};

type ProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type EditProjectDialogProps = ProjectDialogProps & {
  onProjectUpdated: (project: Project) => void;
};

type ProjectMenuProps = {
  project: Project;
  onProjectUpdated: (project: Project) => void;
};

type ProjectStatusAppearance = {
  label: string;
  dot: string;
  text: string;
};

type ProjectPriority =
  | "standard"
  | "high"
  | "urgent";

type UpdateProjectRequest = {
  title: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  priority: ProjectPriority;
};

type ProjectWithWorkContext = Project & {
  projectAllocatStatus?: string | null;
};

/* =========================================================
   STATUS APPEARANCE
========================================================= */

const statusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
  },

  active: {
    label: "Active",
    dot: "bg-primary",
    text: "text-primary",
  },

  onhold: {
    label: "On hold",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },

  paused: {
    label: "Paused",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },

  complete: {
    label: "Complete",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },

  completed: {
    label: "Complete",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },

  closed: {
    label: "Closed",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },

  cancelled: {
    label: "Cancelled",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },

  canceled: {
    label: "Cancelled",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  },
};

/* =========================================================
   PRIORITY APPEARANCE
========================================================= */

const priorityAppearance: Record<string, string> = {
  standard: "text-muted-foreground",
  high: "text-primary",
  urgent: "text-destructive",
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(status?: string) {
  return String(status ?? "onhold")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

function formatStatusLabel(status?: string) {
  if (!status?.trim()) {
    return "On hold";
  }

  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusAppearance(status?: string) {
  const normalizedStatus = normalizeStatus(status);

  return (
    statusAppearance[normalizedStatus] ?? {
      label: formatStatusLabel(status),
      dot: "bg-muted-foreground",
      text: "text-muted-foreground",
    }
  );
}

function formatDate(date?: string | Date | null) {
  if (!date) {
    return "Not set";
  }

  const parsedDate = parseProjectDate(date);

  if (!parsedDate) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function parseProjectDate(
  value?: string | Date | null,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return undefined;
    }

    return value;
  }

  /*
   * DateOnly values from ASP.NET should be interpreted as a
   * local calendar date rather than UTC.
   */
  const dateOnlyMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/,
  );

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

function toDateOnly(
  value?: Date,
): string | null {
  if (!value || Number.isNaN(value.getTime())) {
    return null;
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitials(name?: string | null) {
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return "A";
  }

  return normalizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function clampProgress(progress?: number) {
  if (
    typeof progress !== "number" ||
    !Number.isFinite(progress)
  ) {
    return 0;
  }

  return Math.min(100, Math.max(0, progress));
}

function normalizePriority(
  priority?: string | null,
): ProjectPriority {
  const normalized = priority?.trim().toLowerCase();

  if (
    normalized === "high" ||
    normalized === "urgent"
  ) {
    return normalized;
  }

  return "standard";
}

function isClientWorkProject(project: Project) {
  const workProject = project as ProjectWithWorkContext;

  return Boolean(workProject.projectAllocatStatus);
}

function isAcceptedClientWorkProject(project: Project) {
  const workProject = project as ProjectWithWorkContext;

  return (
    String(workProject.projectAllocatStatus ?? "")
      .trim()
      .toLowerCase() === "accepted"
  );
}

function isTerminalProject(project: Project) {
  const status = normalizeStatus(project.status);

  return [
    "complete",
    "completed",
    "closed",
    "cancelled",
    "canceled",
  ].includes(status);
}

function canCancelProject(project: Project) {
  return (
    !isClientWorkProject(project) &&
    !isTerminalProject(project)
  );
}

function canMarkProjectComplete(project: Project) {
  return (
    isAcceptedClientWorkProject(project) &&
    !isTerminalProject(project)
  );
}

function getProjectCategoryContext(project: Project) {
  const isClientWork = isClientWorkProject(project);
  const hasCategory = Boolean(project.category?.trim());

  const iconCategory = hasCategory
    ? project.category
    : isClientWork
      ? "client work"
      : "default";

  const label = getProjectCategoryLabel(
    project.category,
    isClientWork
      ? "Client project"
      : "General project",
  );

  return {
    iconCategory,
    label,
    isClientWork,
  };
}

/* =========================================================
   SYNCED PROJECT

   Cards keep a local copy so a successful edit can update
   immediately without refreshing the whole projects page.
========================================================= */

function useSyncedProject(project: Project) {
  const [currentProject, setCurrentProject] =
    useState<Project>(project);

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  return [
    currentProject,
    setCurrentProject,
  ] as const;
}

/* =========================================================
   GRID VIEW
========================================================= */

export function GridView({ project }: ViewProps) {
  const [
    currentProject,
    setCurrentProject,
  ] = useSyncedProject(project);

  const progress = clampProgress(
    currentProject.progress,
  );

  return (
    <motion.article
      className={[
        "group relative flex min-h-[295px] min-w-0 flex-col overflow-hidden",
        "rounded-[1.35rem] border border-border bg-background p-5",
        "transition-all duration-300 hover:border-primary/25",
        "hover:shadow-lg hover:shadow-black/[0.035]",
        "dark:hover:shadow-black/20 sm:p-6",
      ].join(" ")}
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      whileHover={{
        y: -3,
      }}
    >
      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <ProjectIdentity project={currentProject} />

        <ProjectMenu
          project={currentProject}
          onProjectUpdated={setCurrentProject}
        />
      </div>

      {/* =====================================================
          PROJECT COPY
      ===================================================== */}

      <div className="mt-6 min-w-0">
        <MotionLink
          to={`/projects/${currentProject.id}`}
          className="block min-w-0"
          whileTap={{
            scale: 0.99,
          }}
        >
          <h3 className="line-clamp-2 break-words text-xl font-black leading-[1.08] tracking-[-0.025em] transition-colors group-hover:text-primary sm:text-[1.35rem]">
            {currentProject.title}
          </h3>
        </MotionLink>

        {currentProject.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {currentProject.description}
          </p>
        )}
      </div>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="mt-auto pt-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Progress
            </p>

            <p className="mt-1 text-2xl font-black tracking-[-0.035em]">
              {progress}
              <span className="ml-0.5 text-sm text-muted-foreground">
                %
              </span>
            </p>
          </div>

          <StatusIndicator
            status={currentProject.status}
          />
        </div>

        <Progress
          value={progress}
          className="mt-4 h-1.5"
        />

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <CalendarDaysIcon
              size={13}
              className="shrink-0"
            />

            <span className="truncate">
              {formatDate(currentProject.createdAt)}
            </span>
          </span>

          <Link
            to={`/projects/${currentProject.id}`}
            className="group/open inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary"
          >
            Open

            <ArrowRightIcon
              size={13}
              className="transition-transform group-hover/open:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   LIST VIEW
========================================================= */

export function ListView({ project }: ViewProps) {
  const [
    currentProject,
    setCurrentProject,
  ] = useSyncedProject(project);

  const progress = clampProgress(
    currentProject.progress,
  );

  return (
    <motion.article
      className={[
        "group relative grid min-w-0 gap-5 border-b border-border py-5",
        "transition-colors duration-200 hover:bg-muted/[0.18] sm:px-3",
        "md:grid-cols-[minmax(0,1.4fr)_180px_120px_auto] md:items-center",
      ].join(" ")}
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {/* Project */}

      <div className="min-w-0">
        <ProjectIdentity
          project={currentProject}
          compact
        />

        <MotionLink
          to={`/projects/${currentProject.id}`}
          className="mt-3 block min-w-0"
          whileTap={{
            scale: 0.99,
          }}
        >
          <h3 className="truncate text-base font-black tracking-[-0.02em] transition-colors group-hover:text-primary sm:text-lg">
            {currentProject.title}
          </h3>
        </MotionLink>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDaysIcon size={13} />
          {formatDate(currentProject.createdAt)}
        </p>
      </div>

      {/* Progress */}

      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Progress
          </span>

          <span className="text-xs font-bold">
            {progress}%
          </span>
        </div>

        <Progress
          value={progress}
          className="h-1.5"
        />
      </div>

      {/* Status */}

      <StatusIndicator
        status={currentProject.status}
      />

      {/* Menu */}

      <div className="absolute right-0 top-4 md:static">
        <ProjectMenu
          project={currentProject}
          onProjectUpdated={setCurrentProject}
        />
      </div>
    </motion.article>
  );
}

/* =========================================================
   PROJECT IDENTITY
========================================================= */

function ProjectIdentity({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const {
    iconCategory,
    label,
  } = getProjectCategoryContext(project);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={[
          "flex shrink-0 items-center justify-center",
          getProjectIconSurfaceClass(iconCategory),
          compact
            ? "h-9 w-9 rounded-lg"
            : "h-10 w-10 rounded-xl",
        ].join(" ")}
      >
        {getProjectIcon(
          iconCategory,
          compact ? 16 : 18,
        )}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>

        {project.projectCode && (
          <p className="mt-0.5 truncate text-[0.62rem] text-muted-foreground/60">
            {project.projectCode}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS INDICATOR
========================================================= */

function StatusIndicator({
  status,
}: {
  status?: string;
}) {
  const appearance =
    getStatusAppearance(status);

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-2 text-xs font-semibold",
        appearance.text,
      ].join(" ")}
    >
      <span
        className={`h-2 w-2 rounded-full ${appearance.dot}`}
      />

      {appearance.label}
    </span>
  );
}

/* =========================================================
   PROJECT MENU
========================================================= */

function ProjectMenu({
  project,
  onProjectUpdated,
}: ProjectMenuProps) {
  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const isClientWork =
    isClientWorkProject(project);

  const showCancel =
    canCancelProject(project);

  const showMarkComplete =
    canMarkProjectComplete(project);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
            aria-label={`Open menu for ${project.title}`}
          >
            <EllipsisVerticalIcon size={17} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
        >
          {/* ===============================================
              COMMON
          =============================================== */}

          <DropdownMenuItem
            asChild
            className="rounded-lg"
          >
            <Link to={`/projects/${project.id}`}>
              <FolderOpenIcon size={14} />
              Open project
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-lg"
            onSelect={() =>
              setDetailsOpen(true)
            }
          >
            <EyeIcon size={14} />
            View details
          </DropdownMenuItem>

          {/* ===============================================
              OWNER ACTIONS
          =============================================== */}

          {!isClientWork && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                asChild
                className="rounded-lg"
              >
                <Link
                  to={`/projects/${project.id}/find-allocats`}
                >
                  <UserPlusIcon size={14} />
                  Find Allocats
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-lg"
                onSelect={() =>
                  setEditOpen(true)
                }
              >
                <Edit3Icon size={14} />
                Edit project
              </DropdownMenuItem>

              {showCancel && (
                <>
                  <DropdownMenuSeparator />

                  {/* UI only — cancellation logic comes later. */}
                  <DropdownMenuItem
                    className={[
                      "rounded-lg text-destructive",
                      "focus:bg-destructive/[0.07] focus:text-destructive",
                    ].join(" ")}
                  >
                    <BanIcon size={14} />
                    Cancel project
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}

          {/* ===============================================
              ALLOCAT ACTIONS
          =============================================== */}

          {showMarkComplete && (
            <>
              <DropdownMenuSeparator />

              {/* UI only — completion flow comes later. */}
              <DropdownMenuItem className="rounded-lg text-emerald-700 focus:text-emerald-700 dark:text-emerald-300 dark:focus:text-emerald-300">
                <CircleCheckBigIcon size={14} />
                Mark complete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ===================================================
          DIALOGS

          Dialogs live outside the DropdownMenu so we avoid
          nested interactive triggers inside menu items.
      =================================================== */}

      <ProjectDetailsDialog
        project={project}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {!isClientWork && (
        <EditProjectDialog
          project={project}
          open={editOpen}
          onOpenChange={setEditOpen}
          onProjectUpdated={onProjectUpdated}
        />
      )}
    </>
  );
}

/* =========================================================
   PROJECT DETAILS DIALOG
========================================================= */

function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [
    members,
    setMembers,
  ] = useState<ProjectAllocatMember[]>([]);

  const [
    membersLoading,
    setMembersLoading,
  ] = useState(false);

  const [
    membersError,
    setMembersError,
  ] = useState<string | null>(null);

  const progress = clampProgress(
    project.progress,
  );

  const {
    label: categoryLabel,
    isClientWork,
  } = getProjectCategoryContext(project);

  const priority =
    project.priority?.toLowerCase() ||
    "standard";

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadMembers() {
      try {
        setMembersLoading(true);
        setMembersError(null);

        const response =
          await api.get<ProjectAllocatMember[]>(
            `/projects/${project.id}/allocats/members`,
            {
              withCredentials: true,
            },
          );

        if (!cancelled) {
          setMembers(response.data);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Could not load project members:",
          error,
        );

        setMembersError(
          "Could not load the project team.",
        );
      } finally {
        if (!cancelled) {
          setMembersLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    project.id,
  ]);

  const acceptedMembers = members.filter(
    (member) =>
      member.status === "Accepted",
  );

  const invitedMembers = members.filter(
    (member) =>
      member.status === "Invited",
  );

  const visibleMemberCount =
    acceptedMembers.length +
    invitedMembers.length;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden",
          "rounded-[1.5rem] border-border bg-background p-0",
          "text-foreground sm:max-w-2xl",
        ].join(" ")}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <DialogHeader className="shrink-0 border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
          <ProjectIdentity project={project} />

          {project.priority && (
            <div className="mt-5">
              <span
                className={[
                  "text-xs font-semibold capitalize",
                  priorityAppearance[priority] ??
                    priorityAppearance.standard,
                ].join(" ")}
              >
                {project.priority} priority
              </span>
            </div>
          )}

          <DialogTitle className="mt-4 break-words text-2xl font-black leading-[1.08] tracking-[-0.03em] sm:text-3xl">
            {project.title}
          </DialogTitle>

          <DialogDescription className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            {project.description ||
              "No project description was provided."}
          </DialogDescription>
        </DialogHeader>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:px-8">
          {/* Dates */}

          <div className="grid gap-6 border-b border-border pb-7 sm:grid-cols-3">
            <DateDetail
              label="Created"
              value={project.createdAt}
            />

            <DateDetail
              label="Start date"
              value={project.startDate}
            />

            <DateDetail
              label="Due date"
              value={project.dueDate}
            />
          </div>

          {/* Progress */}

          <section>
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Project progress
                </p>

                <div className="mt-2">
                  <StatusIndicator
                    status={project.status}
                  />
                </div>
              </div>

              <p className="text-4xl font-black tracking-[-0.045em]">
                {progress}
                <span className="text-lg text-muted-foreground">
                  %
                </span>
              </p>
            </div>

            <Progress
              value={progress}
              className="mt-5 h-1.5"
            />
          </section>

          {/* Information */}

          <div className="grid gap-6 border-y border-border py-7 sm:grid-cols-2">
            <DetailRow
              label="Category"
              value={categoryLabel}
            />

            <DetailRow
              label="Project code"
              value={
                project.projectCode ||
                "Not assigned"
              }
            />
          </div>

          {/* Team */}

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Project team
                </p>

                <h3 className="mt-1 text-lg font-black tracking-[-0.02em]">
                  Allocats
                </h3>
              </div>

              <span className="text-xs font-semibold text-muted-foreground">
                {visibleMemberCount} total
              </span>
            </div>

            {membersLoading ? (
              <div className="mt-6 flex min-h-28 items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircleIcon
                    size={16}
                    className="animate-spin text-primary"
                  />

                  Loading team
                </div>
              </div>
            ) : membersError ? (
              <div className="mt-5 border-l-2 border-destructive pl-4">
                <p className="text-sm text-destructive">
                  {membersError}
                </p>
              </div>
            ) : visibleMemberCount === 0 ? (
              <div className="mt-6 border-y border-border py-8">
                <UsersIcon
                  size={21}
                  className="text-muted-foreground"
                />

                <p className="mt-4 text-sm font-semibold">
                  No Allocats yet.
                </p>

                <p className="mt-1 max-w-sm text-xs leading-6 text-muted-foreground">
                  Invited and accepted professionals will appear here.
                </p>

                {!isClientWork && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-4 -ml-3 rounded-lg text-primary shadow-none"
                  >
                    <Link
                      to={`/projects/${project.id}/find-allocats`}
                    >
                      <UserPlusIcon size={14} />
                      Find Allocats
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-8">
                {acceptedMembers.length > 0 && (
                  <MemberSection
                    title="Accepted"
                    description="Allocats currently working on this project."
                    members={acceptedMembers}
                  />
                )}

                {invitedMembers.length > 0 && (
                  <MemberSection
                    title="Pending invitations"
                    description="Waiting for these Allocats to respond."
                    members={invitedMembers}
                  />
                )}
              </div>
            )}
          </section>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <DialogFooter className="shrink-0 border-t border-border bg-background px-6 py-5 sm:px-8">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-lg px-5 text-muted-foreground shadow-none"
            >
              Close
            </Button>
          </DialogClose>

          <Button
            asChild
            className="group rounded-lg px-6 shadow-none"
          >
            <Link to={`/projects/${project.id}`}>
              Open project

              <ArrowRightIcon
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   MEMBER SECTION
========================================================= */

function MemberSection({
  title,
  description,
  members,
}: {
  title: string;
  description: string;
  members: ProjectAllocatMember[];
}) {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-sm font-bold">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {members.map((member) => (
          <ProjectMemberRow
            key={member.allocatProfileId}
            member={member}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MEMBER ROW
========================================================= */

function ProjectMemberRow({
  member,
}: {
  member: ProjectAllocatMember;
}) {
  const accepted =
    member.status === "Accepted";

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0 border border-border">
          <AvatarImage
            src={member.avatarUrl}
            alt={member.fullName}
            className="object-cover"
          />

          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
            {getInitials(member.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-bold">
              {member.fullName}
            </p>

            <span
              className={[
                "inline-flex items-center gap-1.5 text-[0.62rem] font-semibold",
                accepted
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-primary",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  accepted
                    ? "bg-emerald-500"
                    : "bg-primary",
                ].join(" ")}
              />

              {member.status}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {member.title ||
              "Allocat professional"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 rounded-lg px-3 text-xs text-primary shadow-none"
      >
        Profile
        <ArrowRightIcon size={13} />
      </Button>
    </div>
  );
}

/* =========================================================
   DATE DETAIL
========================================================= */

function DateDetail({
  label,
  value,
}: {
  label: string;
  value?: string | Date | null;
}) {
  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
        <CalendarDaysIcon
          size={14}
          className="text-primary"
        />

        {formatDate(value)}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EDIT PROJECT DIALOG
========================================================= */

function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [
    title,
    setTitle,
  ] = useState(project.title);

  const [
    description,
    setDescription,
  ] = useState(project.description ?? "");

  const [
    startDate,
    setStartDate,
  ] = useState<Date | undefined>(
    parseProjectDate(project.startDate),
  );

  const [
    dueDate,
    setDueDate,
  ] = useState<Date | undefined>(
    parseProjectDate(project.dueDate),
  );

  const [
    priority,
    setPriority,
  ] = useState<ProjectPriority>(
    normalizePriority(project.priority),
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  /*
   * Reset the form every time it opens so Cancel never leaves
   * stale unsaved values behind.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(project.title);
    setDescription(project.description ?? "");

    setStartDate(
      parseProjectDate(project.startDate),
    );

    setDueDate(
      parseProjectDate(project.dueDate),
    );

    setPriority(
      normalizePriority(project.priority),
    );
  }, [
    open,
    project,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      toast.error(
        "Add a project title before saving.",
      );

      return;
    }

    if (
      startDate &&
      dueDate &&
      dueDate.getTime() <
        startDate.getTime()
    ) {
      toast.error(
        "The due date must be after the start date.",
      );

      return;
    }

    const payload: UpdateProjectRequest = {
      title: cleanTitle,
      description: cleanDescription,
      startDate: toDateOnly(startDate),
      dueDate: toDateOnly(dueDate),
      priority,
    };

    try {
      setSaving(true);

      /*
       * Expected API:
       *
       * PATCH /api/projects/{projectId}
       *
       * The endpoint should return the updated ProjectDto.
       */
      const response =
        await api.patch<Project | null>(
          `/projects/${project.id}`,
          payload,
          {
            withCredentials: true,
          },
        );

      /*
       * Returning the updated project from the API is preferred.
       * The fallback also supports a 204-style response.
       */
      const updatedProject =
        response.data &&
        typeof response.data === "object"
          ? response.data
          : {
              ...project,
              ...payload,
            };

      onProjectUpdated(updatedProject);

      toast.success(
        "Project updated.",
      );

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Could not update project:",
        error,
      );

      toast.error(
        "The project could not be updated.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (saving) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={[
          "max-h-[90vh] overflow-y-auto p-0",
          "rounded-[1.5rem] border-border bg-background",
          "text-foreground sm:max-w-2xl",
        ].join(" ")}
      >
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {/* ===============================================
              HEADER
          =============================================== */}

          <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                <Edit3Icon size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  Project settings
                </p>

                <DialogTitle className="mt-1.5 text-2xl font-black tracking-[-0.03em]">
                  Edit project
                </DialogTitle>
              </div>
            </div>

            <DialogDescription className="mt-4 max-w-xl text-sm leading-7">
              Update the core project information. Changes are saved
              directly to this workspace.
            </DialogDescription>
          </DialogHeader>

          {/* ===============================================
              FORM
          =============================================== */}

          <div className="space-y-7 px-6 py-7 sm:px-8">
            {/* Project information */}

            <section>
              <FormSectionHeading
                title="Project information"
                description="Keep the title and brief clear so everyone understands the outcome."
              />

              <div className="mt-5 space-y-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor={`edit-title-${project.id}`}
                    className="text-sm font-semibold"
                  >
                    Project title
                  </Label>

                  <Input
                    id={`edit-title-${project.id}`}
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                    maxLength={160}
                    autoFocus
                    disabled={saving}
                    className="h-11 rounded-lg border-border bg-background shadow-none"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor={`edit-description-${project.id}`}
                      className="text-sm font-semibold"
                    >
                      Description
                    </Label>

                    <span className="text-[0.62rem] tabular-nums text-muted-foreground">
                      {description.length}/2000
                    </span>
                  </div>

                  <Textarea
                    id={`edit-description-${project.id}`}
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    maxLength={2000}
                    rows={5}
                    disabled={saving}
                    className="min-h-32 resize-none rounded-lg border-border bg-background leading-6 shadow-none"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* Schedule */}

            <section>
              <FormSectionHeading
                title="Schedule"
                description="Adjust the working dates when the project timeline changes."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Calendar28
                  id={`edit-start-date-${project.id}`}
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                  className="h-11 rounded-lg border-border bg-background shadow-none"
                />

                <Calendar28
                  id={`edit-due-date-${project.id}`}
                  label="Due date"
                  value={dueDate}
                  onChange={setDueDate}
                  className="h-11 rounded-lg border-border bg-background shadow-none"
                />
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* Priority */}

            <section>
              <FormSectionHeading
                title="Priority"
                description="Set how urgently this project needs attention."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PriorityOption
                  value="standard"
                  label="Standard"
                  description="Normal timeline"
                  selected={
                    priority === "standard"
                  }
                  disabled={saving}
                  onSelect={setPriority}
                />

                <PriorityOption
                  value="high"
                  label="High"
                  description="Needs attention soon"
                  selected={
                    priority === "high"
                  }
                  disabled={saving}
                  onSelect={setPriority}
                />

                <PriorityOption
                  value="urgent"
                  label="Urgent"
                  description="Immediate priority"
                  selected={
                    priority === "urgent"
                  }
                  disabled={saving}
                  onSelect={setPriority}
                />
              </div>
            </section>
          </div>

          {/* ===============================================
              FOOTER
          =============================================== */}

          <DialogFooter className="border-t border-border bg-background px-6 py-5 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() =>
                onOpenChange(false)
              }
              className="rounded-lg px-5 text-muted-foreground shadow-none"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                saving ||
                !title.trim()
              }
              className="min-w-32 rounded-lg px-6 shadow-none"
            >
              {saving && (
                <LoaderCircleIcon
                  size={14}
                  className="animate-spin"
                />
              )}

              {saving
                ? "Saving"
                : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   FORM SECTION HEADING
========================================================= */

function FormSectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold">
        {title}
      </h3>

      <p className="mt-1 max-w-xl text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   PRIORITY OPTION
========================================================= */

function PriorityOption({
  value,
  label,
  description,
  selected,
  disabled,
  onSelect,
}: {
  value: ProjectPriority;
  label: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  onSelect: (value: ProjectPriority) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        onSelect(value)
      }
      className={[
        "flex min-h-24 items-start justify-between gap-3 rounded-xl border p-4 text-left",
        "transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-primary/35 bg-primary/[0.055]"
          : "border-border bg-background hover:bg-muted/25",
      ].join(" ")}
    >
      <div>
        <p
          className={[
            "text-sm font-semibold",
            selected
              ? "text-foreground"
              : "",
          ].join(" ")}
        >
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <span
        className={[
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          selected
            ? "border-primary bg-primary"
            : "border-border",
        ].join(" ")}
      >
        {selected && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
        )}
      </span>
    </button>
  );
}