import { type FormEvent, useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BanIcon,
  CalendarDaysIcon,
  CheckIcon,
  CircleCheckBigIcon,
  Clock3Icon,
  Edit3Icon,
  EllipsisVerticalIcon,
  EyeIcon,
  FolderOpenIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  SearchIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { ProjectAllocatMember } from "@/Types/projectAllocatMember";
import type { SkillOption } from "@/Types/skillOption";

import { getProjectCategoryLabel, getProjectIcon } from "@/utils/projectIcons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   MOTION
========================================================= */

const MotionLink = motion.create(Link);

/* =========================================================
   TYPES
========================================================= */

type ViewProps = {
  project: Project;
  onProjectUpdated?: (project: Project) => void;
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
  header?: boolean;
};

type ProjectStatusAppearance = {
  label: string;
  dot: string;
  text: string;
  rail: string;
};

type ProjectPriority = "standard" | "high" | "urgent";

type UpdateProjectRequest = {
  title: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  priority: ProjectPriority;
  skillIds?: string[];
};

type ProjectWithWorkContext = Project & {
  projectAllocatStatus?: string | null;
};

type ProjectSkillLike = {
  id: string;
  name?: string | null;
  category?: string | null;
  categoryId?: string | null;
};

type ProjectWithSkillContext = Project & {
  skillIds?: string[] | null;
  skills?: ProjectSkillLike[] | null;
};

type TaskPreview = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  dueDate?: string | null;
};

type RatingDraft = {
  rating: number;
  comment: string;
};

type ProjectRatingRecord = {
  allocatId?: string | null;
  allocatProfileId?: string | null;
  rating: number;
  comment?: string | null;
};

type ProjectRatingsResponse =
  | ProjectRatingRecord[]
  | {
      ratings?: ProjectRatingRecord[] | null;
    };

/* =========================================================
   THEME
========================================================= */

const projectCardSurface = [
  "border-border/55",
  "bg-card",

  "transition-[background-color,border-color] duration-200",

  "hover:border-border/75",
  "hover:bg-surface-2/55",

  "dark:border-border",
  "dark:bg-card",

  "dark:hover:border-border",
  "dark:hover:bg-surface-2/60",
].join(" ");

const projectIconSurface = [
  "bg-surface-3/65",
  "text-foreground/55",

  "ring-1 ring-inset ring-border/35",

  "dark:bg-surface-2/80",
  "dark:text-brand-secondary-highlight",
  "dark:ring-border",
].join(" ");

const primaryActionButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",

  "hover:border-brand-secondary-highlight/20",
  "hover:bg-brand-secondary-highlight/90",
  "hover:text-primary-foreground",

  "focus-visible:ring-1",
  "focus-visible:ring-brand-secondary-highlight/20",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/15",
  "dark:hover:bg-secondary/90",
  "dark:hover:text-secondary-foreground",

  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryActionButton = [
  "border-border/65",
  "bg-surface-2/40",
  "text-foreground/70",

  "hover:border-border/85",
  "hover:bg-surface-3/60",
  "hover:text-foreground/90",

  "dark:border-border",
  "dark:bg-surface-2/65",
  "dark:text-foreground/75",

  "dark:hover:bg-surface-3/70",
  "dark:hover:text-foreground",
].join(" ");

const ghostActionButton = [
  "text-muted-foreground",

  "hover:bg-surface-3/55",
  "hover:text-foreground/90",

  "dark:hover:bg-surface-3/65",
  "dark:hover:text-foreground",
].join(" ");

const dialogSurface = [
  "border-border/60",
  "bg-card",
  "text-card-foreground",
  "shadow-none",

  "dark:border-border",
  "dark:bg-card",
].join(" ");

const dialogFooterSurface = [
  "border-t border-border/55",
  "bg-surface-2/30",

  "dark:border-border",
  "dark:bg-surface-2/55",
].join(" ");

const formControlSurface = [
  "border-border/65",
  "bg-surface-2/40",
  "text-foreground/85",
  "shadow-none",

  "transition-[background-color,border-color,box-shadow] duration-150",

  "hover:border-border/80",
  "hover:bg-surface-2/55",

  "focus-visible:border-ring/25",
  "focus-visible:bg-surface-1",
  "focus-visible:ring-1",
  "focus-visible:ring-ring/10",

  "dark:border-border",
  "dark:bg-surface-2/65",

  "dark:hover:bg-surface-3/60",

  "dark:focus-visible:border-secondary/20",
  "dark:focus-visible:bg-surface-2",
  "dark:focus-visible:ring-secondary/[0.08]",
].join(" ");

/* =========================================================
   STATUS
========================================================= */

const statusAppearance: Record<string, ProjectStatusAppearance> = {
  pending: {
    label: "Pending",
    dot: "bg-status-pending",
    text: "text-status-pending-foreground",
    rail: "bg-status-pending/75",
  },

  active: {
    label: "Active",
    dot: "bg-status-active",
    text: "text-status-active-foreground",
    rail: "bg-status-active/80",
  },

  completionrequested: {
    label: "Awaiting confirmation",
    dot: "bg-status-pending",
    text: "text-status-pending-foreground",
    rail: "bg-status-pending/75",
  },

  onhold: {
    label: "On hold",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
    rail: "bg-muted-foreground/45",
  },

  paused: {
    label: "Paused",
    dot: "bg-muted-foreground/60",
    text: "text-muted-foreground",
    rail: "bg-muted-foreground/45",
  },

  complete: {
    label: "Complete",
    dot: "bg-status-complete",
    text: "text-status-complete-foreground",
    rail: "bg-status-complete/75",
  },

  completed: {
    label: "Complete",
    dot: "bg-status-complete",
    text: "text-status-complete-foreground",
    rail: "bg-status-complete/75",
  },

  closed: {
    label: "Closed",
    dot: "bg-status-complete",
    text: "text-status-complete-foreground",
    rail: "bg-status-complete/65",
  },

  cancelled: {
    label: "Cancelled",
    dot: "bg-status-overdue",
    text: "text-status-overdue-foreground",
    rail: "bg-status-overdue/70",
  },

  canceled: {
    label: "Cancelled",
    dot: "bg-status-overdue",
    text: "text-status-overdue-foreground",
    rail: "bg-status-overdue/70",
  },
};

const priorityAppearance: Record<string, string> = {
  standard: "text-muted-foreground",
  high: "text-status-pending-foreground",
  urgent: "text-status-overdue-foreground",
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(status?: string) {
  return String(status ?? "onhold")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

function normalizeMemberStatus(status?: string | null) {
  return String(status ?? "")
    .trim()
    .toLowerCase();
}

function formatStatusLabel(status?: string) {
  if (!status?.trim()) return "On hold";

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
      dot: "bg-muted-foreground/60",
      text: "text-muted-foreground",
      rail: "bg-muted-foreground/45",
    }
  );
}

function parseProjectDate(value?: string | Date | null): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatDate(date?: string | Date | null) {
  const parsedDate = parseProjectDate(date);

  if (!parsedDate) return "Not set";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function toDateOnly(value?: Date | null): string | null {
  if (!value || Number.isNaN(value.getTime())) return null;

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitials(name?: string | null) {
  const normalizedName = name?.trim();

  if (!normalizedName) return "A";

  return normalizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function clampProgress(progress?: number) {
  if (typeof progress !== "number" || !Number.isFinite(progress)) return 0;

  return Math.min(100, Math.max(0, progress));
}

function normalizePriority(priority?: string | null): ProjectPriority {
  const normalized = priority?.trim().toLowerCase();

  if (normalized === "high" || normalized === "urgent") return normalized;

  return "standard";
}

function isClientWorkProject(project: Project) {
  return Boolean((project as ProjectWithWorkContext).projectAllocatStatus);
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
  return ["complete", "completed", "closed", "cancelled", "canceled"].includes(
    normalizeStatus(project.status),
  );
}

function isCompletedProject(project: Project) {
  return ["complete", "completed", "closed"].includes(
    normalizeStatus(project.status),
  );
}

function isCompletionRequested(project: Project) {
  return normalizeStatus(project.status) === "completionrequested";
}

function canModifyOwnedProject(project: Project) {
  if (isClientWorkProject(project)) return false;

  const status = normalizeStatus(project.status);

  return status === "pending" || status === "active";
}

function canCancelProject(project: Project) {
  return canModifyOwnedProject(project) && !isTerminalProject(project);
}

function canMarkProjectComplete(project: Project) {
  return (
    isAcceptedClientWorkProject(project) &&
    normalizeStatus(project.status) === "active"
  );
}

function canReviewCompletion(project: Project) {
  return !isClientWorkProject(project) && isCompletionRequested(project);
}

function canManageProjectRatings(project: Project) {
  return !isClientWorkProject(project) && isCompletedProject(project);
}

function normalizeProjectRatings(
  response: ProjectRatingsResponse,
): ProjectRatingRecord[] {
  if (Array.isArray(response)) return response;

  return Array.isArray(response.ratings) ? response.ratings : [];
}

function getRatingAllocatId(rating: ProjectRatingRecord) {
  return rating.allocatId?.trim() || rating.allocatProfileId?.trim() || "";
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
    isClientWork ? "Client project" : "General project",
  );

  return { iconCategory, label, isClientWork };
}

/* =========================================================
   SKILLS
========================================================= */

function getProjectSkillIds(project: Project) {
  const projectWithSkills = project as ProjectWithSkillContext;

  if (Array.isArray(projectWithSkills.skillIds)) {
    return [...projectWithSkills.skillIds];
  }

  if (Array.isArray(projectWithSkills.skills)) {
    return projectWithSkills.skills.map((skill) => skill.id).filter(Boolean);
  }

  return [];
}

function getEmbeddedProjectSkills(project: Project): SkillOption[] {
  const projectWithSkills = project as ProjectWithSkillContext;

  if (!Array.isArray(projectWithSkills.skills)) return [];

  return projectWithSkills.skills
    .filter((skill) => Boolean(skill?.id && skill?.name))
    .map((skill) => ({
      id: skill.id,
      name: skill.name!,
      categoryId: skill.categoryId ?? "",
      category: skill.category ?? project.category ?? "",
    }));
}

function mergeSkillOptions(...sources: SkillOption[][]) {
  const skillsById = new Map<string, SkillOption>();

  for (const source of sources) {
    for (const skill of source) {
      skillsById.set(skill.id, skill);
    }
  }

  return Array.from(skillsById.values());
}

function resolveProjectSkills(project: Project, catalogue: SkillOption[]) {
  const skillIds = getProjectSkillIds(project);

  const availableSkills = mergeSkillOptions(
    catalogue,
    getEmbeddedProjectSkills(project),
  );

  return skillIds
    .map((id) => availableSkills.find((skill) => skill.id === id))
    .filter((skill): skill is SkillOption => Boolean(skill));
}

/* =========================================================
   SYNC
========================================================= */

function useSyncedProject(project: Project) {
  const [currentProject, setCurrentProject] = useState<Project>(project);

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  return [currentProject, setCurrentProject] as const;
}

/* =========================================================
   GRID VIEW
========================================================= */

export function GridView({ project, onProjectUpdated }: ViewProps) {
  const [currentProject, setCurrentProject] = useSyncedProject(project);

  const progress = clampProgress(currentProject.progress);
  const category = getProjectCategoryContext(currentProject);
  const status = getStatusAppearance(currentProject.status);

  function handleProjectUpdated(updatedProject: Project) {
    setCurrentProject(updatedProject);
    onProjectUpdated?.(updatedProject);
  }

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.18, ease: "easeOut" },
        y: { duration: 0.2, ease: "easeOut" },
        layout: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
      }}
      className={[
        "group relative flex min-h-[270px] min-w-0 flex-col overflow-hidden rounded-xl border p-5",
        projectCardSurface,
        "sm:min-h-[278px]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-5 top-0 h-[2px] w-10 rounded-full",
          status.rail,
        ].join(" ")}
      />

      <div className="flex items-start justify-between gap-4">
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            projectIconSurface,
          ].join(" ")}
        >
          {getProjectIcon(category.iconCategory, 15)}
        </span>

        <div className="flex shrink-0 items-center gap-0.5">
          <ProjectStatusDot status={currentProject.status} />

          <div
            className={[
              "transition-opacity duration-150",
              "opacity-100 sm:opacity-0",
              "sm:group-hover:opacity-100 sm:group-focus-within:opacity-100",
            ].join(" ")}
          >
            <ProjectMenu
              project={currentProject}
              onProjectUpdated={handleProjectUpdated}
              header
            />
          </div>
        </div>
      </div>

      <div className="mt-6 min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {category.label}
          </p>

          {currentProject.projectCode && (
            <>
              <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/30" />

              <span className="truncate text-[0.52rem] text-muted-foreground/65">
                {currentProject.projectCode}
              </span>
            </>
          )}
        </div>

        <MotionLink
          to={`/projects/${currentProject.id}`}
          className="mt-2.5 block min-w-0"
          whileTap={{ scale: 0.995 }}
        >
          <h3
            className={[
              "line-clamp-2 break-words",
              "text-sm font-semibold leading-[1.35] tracking-[-0.015em]",
              "text-foreground/85",
              "transition-colors duration-150",
              "group-hover:text-foreground",
              "sm:text-base",
            ].join(" ")}
          >
            {currentProject.title}
          </h3>
        </MotionLink>

        <p className="mt-2 min-h-10 line-clamp-2 text-[0.64rem] leading-5 text-muted-foreground/90">
          {currentProject.description || "No project description was provided."}
        </p>

        <ProjectCompletionNotice project={currentProject} compact />
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/50 pt-4 dark:border-border">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground/75">
            {progress}%
          </span>

          <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/30" />

          <span className="flex min-w-0 items-center gap-1.5 text-[0.54rem] text-muted-foreground/75">
            <CalendarDaysIcon size={10} className="shrink-0" />

            <span className="truncate">
              {formatDate(currentProject.createdAt)}
            </span>
          </span>
        </div>

        <Link
          to={`/projects/${currentProject.id}`}
          aria-label={`Open ${currentProject.title}`}
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",

            "text-muted-foreground",

            "transition-[background-color,color,transform] duration-150",

            "hover:translate-x-0.5",
            "hover:bg-surface-3/60",
            "hover:text-foreground/85",

            "dark:hover:bg-surface-3/70",
            "dark:hover:text-secondary",
          ].join(" ")}
        >
          <ArrowRightIcon size={12} />
        </Link>
      </div>
    </motion.article>
  );
}

/* =========================================================
   LIST VIEW
========================================================= */

export function ListView({ project, onProjectUpdated }: ViewProps) {
  const [currentProject, setCurrentProject] = useSyncedProject(project);

  const progress = clampProgress(currentProject.progress);
  const category = getProjectCategoryContext(currentProject);
  const status = getStatusAppearance(currentProject.status);

  function handleProjectUpdated(updatedProject: Project) {
    setCurrentProject(updatedProject);
    onProjectUpdated?.(updatedProject);
  }

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.18, ease: "easeOut" },
        y: { duration: 0.18, ease: "easeOut" },
        layout: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
      }}
      className={[
        "group relative min-w-0 overflow-hidden rounded-xl border",
        projectCardSurface,
      ].join(" ")}
    >
      <span
        className={[
          "absolute inset-y-4 left-0 w-[2px] rounded-full",
          status.rail,
        ].join(" ")}
      />

      {/* MOBILE / TABLET */}

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 pl-5 sm:gap-4 sm:px-5 sm:pl-6 md:hidden">
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            projectIconSurface,
          ].join(" ")}
        >
          {getProjectIcon(category.iconCategory, 14)}
        </span>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-[0.5rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              {category.label}
            </p>

            {currentProject.projectCode && (
              <>
                <span className="hidden h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/30 sm:block" />

                <span className="hidden truncate text-[0.5rem] text-muted-foreground/65 sm:block">
                  {currentProject.projectCode}
                </span>
              </>
            )}
          </div>

          <MotionLink
            to={`/projects/${currentProject.id}`}
            className="mt-1.5 block min-w-0"
            whileTap={{ scale: 0.99 }}
          >
            <h3 className="truncate text-sm font-semibold tracking-[-0.015em] text-foreground/85 transition-colors group-hover:text-foreground">
              {currentProject.title}
            </h3>
          </MotionLink>

          <div className="mt-2 flex min-w-0 items-center gap-2.5">
            <span className="shrink-0 text-[0.62rem] font-semibold tabular-nums text-foreground/70">
              {progress}%
            </span>

            <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/30" />

            <span className="truncate text-[0.56rem] text-muted-foreground/70">
              {formatDate(currentProject.createdAt)}
            </span>
          </div>

          <ProjectCompletionNotice project={currentProject} compact />
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <ProjectStatusDot status={currentProject.status} />

          <Link
            to={`/projects/${currentProject.id}`}
            aria-label={`Open ${currentProject.title}`}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-md",

              "text-muted-foreground",

              "transition-[background-color,color,transform] duration-150",

              "hover:translate-x-0.5",
              "hover:bg-surface-3/60",
              "hover:text-foreground/85",

              "dark:hover:bg-surface-3/70",
              "dark:hover:text-secondary",
            ].join(" ")}
          >
            <ArrowRightIcon size={11} />
          </Link>

          <ProjectMenu
            project={currentProject}
            onProjectUpdated={handleProjectUpdated}
            header
          />
        </div>
      </div>

      {/* DESKTOP */}

      <div
        className={[
          "hidden min-w-0 gap-6 px-6 py-5 pl-7",
          "md:grid md:items-center",
          "md:grid-cols-[minmax(0,1fr)_72px_150px_auto]",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              projectIconSurface,
            ].join(" ")}
          >
            {getProjectIcon(category.iconCategory, 14)}
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {category.label}
              </p>

              {currentProject.projectCode && (
                <>
                  <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-muted-foreground/30" />

                  <p className="truncate text-[0.5rem] text-muted-foreground/65">
                    {currentProject.projectCode}
                  </p>
                </>
              )}
            </div>

            <MotionLink
              to={`/projects/${currentProject.id}`}
              className="mt-2 block min-w-0"
              whileTap={{ scale: 0.99 }}
            >
              <h3 className="truncate text-sm font-semibold tracking-[-0.015em] text-foreground/85 transition-colors group-hover:text-foreground">
                {currentProject.title}
              </h3>
            </MotionLink>

            {currentProject.description && (
              <p className="mt-1.5 line-clamp-1 max-w-xl text-[0.62rem] leading-5 text-muted-foreground/90">
                {currentProject.description}
              </p>
            )}

            <ProjectCompletionNotice project={currentProject} compact />
          </div>
        </div>

        <div>
          <p className="text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            Progress
          </p>

          <p className="mt-1.5 text-sm font-semibold tabular-nums text-foreground/70">
            {progress}%
          </p>
        </div>

        <div>
          <p className="text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            Created
          </p>

          <p className="mt-1.5 flex items-center gap-1.5 text-[0.62rem] text-muted-foreground">
            <CalendarDaysIcon size={10} />

            {formatDate(currentProject.createdAt)}
          </p>
        </div>

        <div className="flex items-center justify-end gap-0.5">
          <ProjectStatusDot status={currentProject.status} />

          <Link
            to={`/projects/${currentProject.id}`}
            aria-label={`Open ${currentProject.title}`}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-md",

              "text-muted-foreground",

              "transition-[background-color,color,transform] duration-150",

              "hover:translate-x-0.5",
              "hover:bg-surface-3/60",
              "hover:text-foreground/85",

              "dark:hover:bg-surface-3/70",
              "dark:hover:text-secondary",
            ].join(" ")}
          >
            <ArrowRightIcon size={12} />
          </Link>

          <ProjectMenu
            project={currentProject}
            onProjectUpdated={handleProjectUpdated}
            header
          />
        </div>
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
  const { iconCategory, label } = getProjectCategoryContext(project);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          projectIconSurface,
        ].join(" ")}
      >
        {getProjectIcon(iconCategory, compact ? 13 : 14)}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[0.56rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          {label}
        </p>

        {project.projectCode && (
          <p className="mt-0.5 truncate text-[0.58rem] text-muted-foreground/60">
            {project.projectCode}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusIndicator({ status }: { status?: string }) {
  const appearance = getStatusAppearance(status);

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-1.5",
        "text-[0.65rem] font-semibold",
        appearance.text,
      ].join(" ")}
    >
      <span
        className={["h-1.5 w-1.5 rounded-full", appearance.dot].join(" ")}
      />

      {appearance.label}
    </span>
  );
}

function ProjectStatusDot({ status }: { status?: string }) {
  const appearance = getStatusAppearance(status);

  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center"
      aria-label={appearance.label}
      title={appearance.label}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          appearance.dot,

          normalizeStatus(status) === "active"
            ? "ring-4 ring-status-active/[0.08]"
            : "",
        ].join(" ")}
      />
    </span>
  );
}

/* =========================================================
   COMPLETION NOTICE
========================================================= */

function ProjectCompletionNotice({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  if (!isCompletionRequested(project)) return null;

  const isClientWork = isClientWorkProject(project);

  return (
    <div
      className={[
        compact ? "mt-3" : "mt-4",
        "flex items-center gap-2 border-l-2 border-status-pending/45 pl-3",
      ].join(" ")}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {!isClientWork && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-pending opacity-20" />
        )}

        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-pending" />
      </span>

      <p className="min-w-0 text-[0.6rem] font-semibold text-status-pending-foreground">
        {isClientWork
          ? "Awaiting client confirmation"
          : "Action required · Completion requested"}
      </p>
    </div>
  );
}

/* =========================================================
   PROJECT MENU
========================================================= */

function ProjectMenu({
  project,
  onProjectUpdated,
  header = false,
}: ProjectMenuProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [reviewCompletionOpen, setReviewCompletionOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);

  const isClientWork = isClientWorkProject(project);

  const canModifyOwned = canModifyOwnedProject(project);
  const showCancel = canCancelProject(project);
  const showMarkComplete = canMarkProjectComplete(project);
  const showReviewCompletion = canReviewCompletion(project);
  const showManageRatings = canManageProjectRatings(project);

  const menuItemClass = [
    "min-h-8 rounded-md px-2.5 py-1.5",
    "gap-2 text-[0.7rem] font-medium",
    "text-foreground/75",

    "focus:bg-surface-3/60",
    "focus:text-foreground",

    "data-[highlighted]:bg-surface-3/60",
    "data-[highlighted]:text-foreground",

    "dark:focus:bg-surface-2",
    "dark:data-[highlighted]:bg-surface-2",
  ].join(" ");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={[
              "h-7 w-7 rounded-md shadow-none",

              header
                ? [
                    "text-muted-foreground/70",

                    "hover:bg-surface-3/55",
                    "hover:text-foreground/85",

                    "data-[state=open]:bg-surface-3/60",
                    "data-[state=open]:text-foreground/85",

                    "dark:hover:bg-surface-3/65",
                    "dark:data-[state=open]:bg-surface-3/65",
                  ].join(" ")
                : ghostActionButton,
            ].join(" ")}
            aria-label={`Open menu for ${project.title}`}
          >
            <EllipsisVerticalIcon size={14} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={7}
          className={[
            "w-48 rounded-lg p-1 shadow-none",

            "border-border/60",
            "bg-popover",
            "text-popover-foreground",

            "dark:border-border",
          ].join(" ")}
        >
          <DropdownMenuItem asChild className={menuItemClass}>
            <Link to={`/projects/${project.id}`}>
              <FolderOpenIcon size={13} />
              Open project
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className={menuItemClass}
            onSelect={() => setDetailsOpen(true)}
          >
            <EyeIcon size={13} />
            View details
          </DropdownMenuItem>

          {showReviewCompletion && (
            <>
              <DropdownMenuSeparator className="my-1 bg-border/60 dark:bg-border" />

              <DropdownMenuItem
                className={[
                  menuItemClass,

                  "text-status-pending-foreground",

                  "focus:bg-status-pending/[0.07]",
                  "focus:text-status-pending-foreground",

                  "data-[highlighted]:bg-status-pending/[0.07]",
                  "data-[highlighted]:text-status-pending-foreground",
                ].join(" ")}
                onSelect={() => setReviewCompletionOpen(true)}
              >
                <Clock3Icon size={13} />
                Review completion
              </DropdownMenuItem>
            </>
          )}

          {showManageRatings && (
            <>
              <DropdownMenuSeparator className="my-1 bg-border/60 dark:bg-border" />

              <DropdownMenuItem
                className={menuItemClass}
                onSelect={() => setRatingsOpen(true)}
              >
                <StarIcon size={13} />
                Rate Allocats
              </DropdownMenuItem>
            </>
          )}

          {canModifyOwned && (
            <>
              <DropdownMenuSeparator className="my-1 bg-border/60 dark:bg-border" />

              <DropdownMenuItem asChild className={menuItemClass}>
                <Link to={`/projects/${project.id}/allocats/find`}>
                  <UserPlusIcon size={13} />
                  Find Allocats
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className={menuItemClass}
                onSelect={() => setEditOpen(true)}
              >
                <Edit3Icon size={13} />
                Edit project
              </DropdownMenuItem>

              {showCancel && (
                <>
                  <DropdownMenuSeparator className="my-1 bg-border/60 dark:bg-border" />

                  <DropdownMenuItem
                    className={[
                      menuItemClass,

                      "text-status-overdue-foreground",

                      "focus:bg-status-overdue/[0.07]",
                      "focus:text-status-overdue-foreground",

                      "data-[highlighted]:bg-status-overdue/[0.07]",
                      "data-[highlighted]:text-status-overdue-foreground",
                    ].join(" ")}
                  >
                    <BanIcon size={13} />
                    Cancel project
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}

          {showMarkComplete && (
            <>
              <DropdownMenuSeparator className="my-1 bg-border/60 dark:bg-border" />

              <DropdownMenuItem
                className={[
                  menuItemClass,

                  "text-status-complete-foreground",

                  "focus:bg-status-complete/[0.07]",
                  "focus:text-status-complete-foreground",

                  "data-[highlighted]:bg-status-complete/[0.07]",
                  "data-[highlighted]:text-status-complete-foreground",
                ].join(" ")}
                onSelect={() => setCompleteOpen(true)}
              >
                <CircleCheckBigIcon size={13} />
                Mark complete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectDetailsDialog
        project={project}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {canModifyOwned && (
        <EditProjectDialog
          project={project}
          open={editOpen}
          onOpenChange={setEditOpen}
          onProjectUpdated={onProjectUpdated}
        />
      )}

      {isClientWork && (
        <RequestCompletionDialog
          project={project}
          open={completeOpen}
          onOpenChange={setCompleteOpen}
          onProjectUpdated={onProjectUpdated}
        />
      )}

      {!isClientWork && (
        <>
          <ReviewCompletionDialog
            project={project}
            open={reviewCompletionOpen}
            onOpenChange={setReviewCompletionOpen}
            onProjectUpdated={onProjectUpdated}
          />

          <ManageRatingsDialog
            project={project}
            open={ratingsOpen}
            onOpenChange={setRatingsOpen}
          />
        </>
      )}
    </>
  );
}

/* =========================================================
   REQUEST COMPLETION
========================================================= */

function RequestCompletionDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [tasks, setTasks] = useState<TaskPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadTasks() {
      try {
        setLoading(true);
        setLoadError(false);

        const response = await api.get<TaskPreview[]>(
          `/projects/tasks/${project.id}`,
          { withCredentials: true },
        );

        if (cancelled) return;

        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load project tasks:", error);

        setLoadError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, [open, project.id, reloadKey]);

  const incompleteTasks = useMemo(
    () =>
      tasks.filter((task) => task.status?.trim().toLowerCase() !== "complete"),
    [tasks],
  );

  async function requestCompletion() {
    if (submitting || loading || loadError) return;

    try {
      setSubmitting(true);

      const response = await api.patch<Project>(
        `/projects/${project.id}/completion/request`,
        {},
        { withCredentials: true },
      );

      onProjectUpdated({
        ...project,
        ...response.data,
      });

      toast.success("Completion request sent to the client.");

      onOpenChange(false);
    } catch (error) {
      console.error("Could not request project completion:", error);

      toast.error("The completion request could not be sent.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (submitting) return;

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={["rounded-xl p-0 sm:max-w-lg", dialogSurface].join(" ")}
      >
        <DialogHeader className="border-b border-border/55 px-6 pb-5 pt-6 text-left dark:border-border">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-complete/[0.08] text-status-complete-foreground">
            <CircleCheckBigIcon size={17} />
          </span>

          <DialogTitle className="mt-4 text-xl font-semibold tracking-[-0.025em]">
            Mark project complete?
          </DialogTitle>

          <DialogDescription className="mt-2 text-sm leading-7 text-muted-foreground">
            This will send the project to the client for final completion
            confirmation.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6">
          {loading ? (
            <div className="flex min-h-24 items-center gap-3 text-sm text-muted-foreground">
              <LoaderCircleIcon size={16} className="animate-spin" />
              Checking project tasks
            </div>
          ) : loadError ? (
            <div className="rounded-lg border border-status-overdue/15 bg-status-overdue/[0.045] p-4">
              <p className="text-sm font-semibold text-status-overdue-foreground">
                We couldn't check the project tasks.
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Try again before sending the completion request.
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className={[
                  "mt-4 h-8 rounded-lg text-xs shadow-none",
                  secondaryActionButton,
                ].join(" ")}
                onClick={() => setReloadKey((value) => value + 1)}
              >
                Try again
              </Button>
            </div>
          ) : incompleteTasks.length > 0 ? (
            <div className="rounded-lg border border-status-pending/15 bg-status-pending/[0.045] p-4">
              <div className="flex gap-3">
                <AlertTriangleIcon
                  size={16}
                  className="mt-0.5 shrink-0 text-status-pending-foreground"
                />

                <div>
                  <p className="text-sm font-semibold text-status-pending-foreground">
                    {incompleteTasks.length}{" "}
                    {incompleteTasks.length === 1 ? "task is" : "tasks are"}{" "}
                    still incomplete.
                  </p>

                  <p className="mt-1 text-xs leading-6 text-foreground/65 dark:text-foreground/75">
                    Continuing will automatically mark{" "}
                    {incompleteTasks.length === 1 ? "this task" : "these tasks"}{" "}
                    as complete before the project is sent to the client.
                  </p>
                </div>
              </div>

              <div className="mt-4 max-h-32 space-y-2 overflow-y-auto border-t border-status-pending/10 pt-3">
                {incompleteTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-pending" />

                    <span className="truncate font-medium">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : tasks.length > 0 ? (
            <div className="rounded-lg border border-status-complete/15 bg-status-complete/[0.045] p-4">
              <p className="text-sm font-semibold text-status-complete-foreground">
                All project tasks are complete.
              </p>

              <p className="mt-1 text-xs leading-6 text-foreground/65 dark:text-foreground/75">
                The project is ready to be sent to the client for confirmation.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border/50 bg-surface-2/45 p-4 dark:border-border dark:bg-surface-2/60">
              <p className="text-sm font-semibold text-foreground/85">
                No tasks were created for this project.
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                That's okay. The task manager is optional, and you can still
                send the project to the client for completion confirmation.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className={["px-6 py-4", dialogFooterSurface].join(" ")}>
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            className={[
              "h-9 rounded-lg px-4 text-xs shadow-none",
              ghostActionButton,
            ].join(" ")}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={submitting || loading || loadError}
            onClick={() => void requestCompletion()}
            className={[
              "h-9 rounded-lg px-5 text-xs font-semibold shadow-none",
              primaryActionButton,
            ].join(" ")}
          >
            {submitting ? (
              <LoaderCircleIcon size={14} className="animate-spin" />
            ) : (
              <CircleCheckBigIcon size={14} />
            )}

            {submitting ? "Sending" : "Send for confirmation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   REVIEW COMPLETION
========================================================= */

function ReviewCompletionDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [members, setMembers] = useState<ProjectAllocatMember[]>([]);
  const [ratings, setRatings] = useState<Record<string, RatingDraft>>({});
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<"confirm" | "reject" | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadMembers() {
      try {
        setLoading(true);

        const response = await api.get<ProjectAllocatMember[]>(
          `/projects/${project.id}/allocats/members`,
          { withCredentials: true },
        );

        if (cancelled) return;

        const acceptedMembers = (
          Array.isArray(response.data) ? response.data : []
        ).filter(
          (member) => normalizeMemberStatus(member.status) === "accepted",
        );

        setMembers(acceptedMembers);

        const nextRatings: Record<string, RatingDraft> = {};

        for (const member of acceptedMembers) {
          nextRatings[member.allocatProfileId] = {
            rating: 0,
            comment: "",
          };
        }

        setRatings(nextRatings);
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load project Allocats:", error);

        toast.error("The project team could not be loaded.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [open, project.id]);

  function setMemberRating(allocatId: string, rating: number) {
    setRatings((current) => ({
      ...current,
      [allocatId]: {
        rating,
        comment: current[allocatId]?.comment ?? "",
      },
    }));
  }

  function clearMemberRating(allocatId: string) {
    setRatings((current) => ({
      ...current,
      [allocatId]: {
        rating: 0,
        comment: "",
      },
    }));
  }

  function setMemberComment(allocatId: string, comment: string) {
    setRatings((current) => ({
      ...current,
      [allocatId]: {
        rating: current[allocatId]?.rating ?? 0,
        comment,
      },
    }));
  }

  async function needsMoreWork() {
    if (acting) return;

    try {
      setActing("reject");

      const response = await api.patch<Project>(
        `/projects/${project.id}/completion/reject`,
        {},
        { withCredentials: true },
      );

      onProjectUpdated({
        ...project,
        ...response.data,
      });

      toast.success("The project has been returned for more work.");

      onOpenChange(false);
    } catch (error) {
      console.error("Could not return project for more work:", error);

      toast.error("The project could not be returned for more work.");
    } finally {
      setActing(null);
    }
  }

  async function confirmCompletion() {
    if (acting) return;

    try {
      setActing("confirm");

      const response = await api.patch<Project>(
        `/projects/${project.id}/completion/confirm`,
        {},
        { withCredentials: true },
      );

      const submittedRatings = members.flatMap((member) => {
        const draft = ratings[member.allocatProfileId];

        if (!draft || draft.rating < 1) return [];

        return [
          {
            allocatId: member.allocatProfileId,
            rating: draft.rating,
            comment: draft.comment.trim() || null,
          },
        ];
      });

      let ratingsSaved = true;

      if (submittedRatings.length > 0) {
        try {
          await api.put(
            `/projects/${project.id}/ratings`,
            { ratings: submittedRatings },
            { withCredentials: true },
          );
        } catch (error) {
          ratingsSaved = false;

          console.error(
            "Project completed but ratings could not be saved:",
            error,
          );
        }
      }

      onProjectUpdated({
        ...project,
        ...response.data,
      });

      if (!ratingsSaved) {
        toast.warning("Project completed, but the ratings could not be saved.");
      } else if (submittedRatings.length > 0) {
        toast.success("Project completed and ratings submitted.");
      } else {
        toast.success("Project completion confirmed.");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Could not confirm project completion:", error);

      toast.error("Project completion could not be confirmed.");
    } finally {
      setActing(null);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (acting) return;

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden rounded-xl p-0 sm:max-w-2xl",
          dialogSurface,
        ].join(" ")}
      >
        <DialogHeader className="shrink-0 border-b border-border/55 px-6 pb-5 pt-6 text-left sm:px-7 dark:border-border">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-pending/[0.07] text-status-pending-foreground">
            <Clock3Icon size={17} />
          </span>

          <DialogTitle className="mt-4 text-xl font-semibold tracking-[-0.025em]">
            Confirm project completion
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            The project team has marked this job as complete. Confirm the work
            or send it back if more work is needed.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7">
          <div className="rounded-lg border border-border/50 bg-surface-2/45 p-4 dark:border-border dark:bg-surface-2/60">
            <p className="text-sm font-semibold text-foreground/85">
              {project.title}
            </p>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Confirming completion will close the project and make the project
              work read-only.
            </p>
          </div>

          <section className="mt-7">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Rate your Allocats
            </p>

            <h3 className="mt-1.5 text-base font-semibold tracking-[-0.015em] text-foreground/90">
              How was the experience?
            </h3>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Ratings are optional. You can rate one, several or all of the
              Allocats who worked on this project. You can also add or update
              ratings later from the completed project.
            </p>

            {loading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircleIcon size={15} className="animate-spin" />
                Loading project team
              </div>
            ) : members.length === 0 ? (
              <div className="mt-5 rounded-lg border border-border/50 bg-surface-2/45 p-4 dark:border-border dark:bg-surface-2/60">
                <p className="text-sm font-semibold text-foreground/85">
                  No accepted Allocats were found.
                </p>

                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  You can still confirm project completion.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-border/55 border-y border-border/55 dark:divide-border dark:border-border">
                {members.map((member) => {
                  const draft = ratings[member.allocatProfileId] ?? {
                    rating: 0,
                    comment: "",
                  };

                  return (
                    <div key={member.allocatProfileId} className="py-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/60">
                          <AvatarImage
                            src={member.avatarUrl}
                            alt={member.fullName}
                            className="object-cover"
                          />

                          <AvatarFallback className="bg-surface-3 text-[0.65rem] font-semibold text-foreground/80">
                            {getInitials(member.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground/85">
                            {member.fullName}
                          </p>

                          <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                            {member.title || "Allocat professional"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const selected = value <= draft.rating;

                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={acting !== null}
                              onClick={() =>
                                setMemberRating(member.allocatProfileId, value)
                              }
                              className="rounded-md p-1 transition-transform hover:scale-105 disabled:pointer-events-none"
                              aria-label={`Rate ${member.fullName} ${value} out of 5`}
                            >
                              <StarIcon
                                size={19}
                                className={
                                  selected
                                    ? "fill-status-pending text-status-pending"
                                    : "text-muted-foreground/25"
                                }
                              />
                            </button>
                          );
                        })}

                        {draft.rating > 0 && (
                          <>
                            <span className="ml-2 text-[0.68rem] font-semibold text-muted-foreground">
                              {draft.rating}/5
                            </span>

                            <button
                              type="button"
                              disabled={acting !== null}
                              onClick={() =>
                                clearMemberRating(member.allocatProfileId)
                              }
                              className="ml-2 text-[0.64rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              Clear
                            </button>
                          </>
                        )}
                      </div>

                      {draft.rating > 0 && (
                        <Textarea
                          value={draft.comment}
                          disabled={acting !== null}
                          maxLength={1000}
                          rows={3}
                          onChange={(event) =>
                            setMemberComment(
                              member.allocatProfileId,
                              event.target.value,
                            )
                          }
                          placeholder="Add a comment (optional)"
                          className={[
                            "mt-3 min-h-20 resize-none rounded-lg text-sm",
                            formControlSurface,
                          ].join(" ")}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <DialogFooter
          className={["shrink-0 px-6 py-4 sm:px-7", dialogFooterSurface].join(
            " ",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            disabled={acting !== null}
            onClick={() => void needsMoreWork()}
            className={[
              "h-9 rounded-lg px-4 text-xs shadow-none",
              ghostActionButton,
            ].join(" ")}
          >
            {acting === "reject" && (
              <LoaderCircleIcon size={14} className="animate-spin" />
            )}
            Needs more work
          </Button>

          <Button
            type="button"
            disabled={acting !== null || loading}
            onClick={() => void confirmCompletion()}
            className={[
              "h-9 rounded-lg px-5 text-xs font-semibold shadow-none",
              primaryActionButton,
            ].join(" ")}
          >
            {acting === "confirm" ? (
              <LoaderCircleIcon size={14} className="animate-spin" />
            ) : (
              <CircleCheckBigIcon size={14} />
            )}

            {acting === "confirm" ? "Confirming" : "Confirm completion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   MANAGE RATINGS
========================================================= */

function ManageRatingsDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [members, setMembers] = useState<ProjectAllocatMember[]>([]);
  const [ratings, setRatings] = useState<Record<string, RatingDraft>>({});
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadMembers() {
      try {
        setLoadingMembers(true);
        setMembersError(null);

        const response = await api.get<ProjectAllocatMember[]>(
          `/projects/${project.id}/allocats/members`,
          { withCredentials: true },
        );

        if (cancelled) return [];

        const accepted = (
          Array.isArray(response.data) ? response.data : []
        ).filter(
          (member) => normalizeMemberStatus(member.status) === "accepted",
        );

        setMembers(accepted);

        return accepted;
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load project Allocats:", error);

          setMembersError("The project team could not be loaded.");
          setMembers([]);
        }

        return [];
      } finally {
        if (!cancelled) {
          setLoadingMembers(false);
        }
      }
    }

    async function loadRatings() {
      try {
        setLoadingRatings(true);
        setRatingsError(null);

        const response = await api.get<ProjectRatingsResponse>(
          `/projects/${project.id}/ratings`,
          { withCredentials: true },
        );

        if (cancelled) return [];

        return normalizeProjectRatings(response.data);
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load existing project ratings:", error);

          setRatingsError("Existing ratings could not be loaded.");
        }

        return [];
      } finally {
        if (!cancelled) {
          setLoadingRatings(false);
        }
      }
    }

    async function load() {
      setMembers([]);
      setRatings({});

      const [acceptedMembers, existingRatings] = await Promise.all([
        loadMembers(),
        loadRatings(),
      ]);

      if (cancelled) return;

      const nextRatings: Record<string, RatingDraft> = {};

      for (const member of acceptedMembers) {
        const existing = existingRatings.find(
          (rating) => getRatingAllocatId(rating) === member.allocatProfileId,
        );

        nextRatings[member.allocatProfileId] = {
          rating:
            typeof existing?.rating === "number"
              ? Math.min(5, Math.max(0, existing.rating))
              : 0,
          comment: existing?.comment ?? "",
        };
      }

      setRatings(nextRatings);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, project.id]);

  function setMemberRating(allocatId: string, rating: number) {
    setRatings((current) => ({
      ...current,
      [allocatId]: {
        rating,
        comment: current[allocatId]?.comment ?? "",
      },
    }));
  }

  function setMemberComment(allocatId: string, comment: string) {
    setRatings((current) => ({
      ...current,
      [allocatId]: {
        rating: current[allocatId]?.rating ?? 0,
        comment,
      },
    }));
  }

  async function saveRatings() {
    if (
      saving ||
      loadingMembers ||
      loadingRatings ||
      membersError ||
      ratingsError
    ) {
      return;
    }

    const submittedRatings = members.flatMap((member) => {
      const draft = ratings[member.allocatProfileId];

      if (!draft || draft.rating < 1) return [];

      return [
        {
          allocatId: member.allocatProfileId,
          rating: draft.rating,
          comment: draft.comment.trim() || null,
        },
      ];
    });

    if (submittedRatings.length === 0) {
      toast.error("Rate at least one Allocat before saving.");

      return;
    }

    try {
      setSaving(true);

      await api.put(
        `/projects/${project.id}/ratings`,
        { ratings: submittedRatings },
        { withCredentials: true },
      );

      toast.success("Ratings saved.");

      onOpenChange(false);
    } catch (error) {
      console.error("Could not save project ratings:", error);

      toast.error("The ratings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  const loading = loadingMembers || loadingRatings;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (saving) return;

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden rounded-xl p-0 sm:max-w-2xl",
          dialogSurface,
        ].join(" ")}
      >
        <DialogHeader className="shrink-0 border-b border-border/55 px-6 pb-5 pt-6 text-left sm:px-7 dark:border-border">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-pending/[0.07] text-status-pending-foreground">
            <StarIcon size={17} />
          </span>

          <DialogTitle className="mt-4 text-xl font-semibold tracking-[-0.025em]">
            Rate your Allocats
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            Add feedback for Allocats you skipped when the project was
            completed, or update a rating you have already submitted.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7">
          <div className="rounded-lg border border-border/50 bg-surface-2/45 p-4 dark:border-border dark:bg-surface-2/60">
            <p className="text-sm font-semibold text-foreground/85">
              {project.title}
            </p>

            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              Your feedback remains connected to this completed project.
              Existing ratings can be updated at any time.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircleIcon size={16} className="animate-spin" />
                Loading ratings
              </div>
            </div>
          ) : membersError ? (
            <div className="mt-6 rounded-lg border border-status-overdue/15 bg-status-overdue/[0.04] p-4">
              <p className="text-sm font-semibold text-status-overdue-foreground">
                Project team unavailable
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                {membersError}
              </p>
            </div>
          ) : ratingsError ? (
            <div className="mt-6 rounded-lg border border-status-overdue/15 bg-status-overdue/[0.04] p-4">
              <p className="text-sm font-semibold text-status-overdue-foreground">
                Ratings unavailable
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                {ratingsError}
              </p>

              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Existing ratings need to be loaded before they can be safely
                updated.
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="mt-6 rounded-lg border border-border/50 bg-surface-2/45 p-4 dark:border-border dark:bg-surface-2/60">
              <p className="text-sm font-semibold text-foreground/85">
                No accepted Allocats were found.
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                There is currently nobody to rate on this project.
              </p>
            </div>
          ) : (
            <div className="mt-7 divide-y divide-border/55 border-y border-border/55 dark:divide-border dark:border-border">
              {members.map((member) => {
                const draft = ratings[member.allocatProfileId] ?? {
                  rating: 0,
                  comment: "",
                };

                const hasRating = draft.rating > 0;

                return (
                  <div key={member.allocatProfileId} className="py-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0 border border-border/60">
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.fullName}
                          className="object-cover"
                        />

                        <AvatarFallback className="bg-surface-3 text-[0.65rem] font-semibold text-foreground/80">
                          {getInitials(member.fullName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="truncate text-sm font-semibold text-foreground/85">
                            {member.fullName}
                          </p>

                          <span
                            className={[
                              "text-[0.6rem] font-medium",

                              hasRating
                                ? "text-foreground/50"
                                : "text-muted-foreground/60",
                            ].join(" ")}
                          >
                            {hasRating ? "Rated" : "Not rated"}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
                          {member.title || "Allocat professional"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const selected = value <= draft.rating;

                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              setMemberRating(member.allocatProfileId, value)
                            }
                            className="rounded-md p-1 transition-transform duration-150 hover:scale-105 disabled:pointer-events-none"
                            aria-label={`Rate ${member.fullName} ${value} out of 5`}
                          >
                            <StarIcon
                              size={20}
                              className={
                                selected
                                  ? "fill-status-pending text-status-pending"
                                  : "text-muted-foreground/25"
                              }
                            />
                          </button>
                        );
                      })}

                      {hasRating && (
                        <span className="ml-2 text-[0.68rem] font-semibold text-muted-foreground">
                          {draft.rating}/5
                        </span>
                      )}
                    </div>

                    {hasRating && (
                      <div className="mt-3">
                        <Textarea
                          value={draft.comment}
                          disabled={saving}
                          maxLength={1000}
                          rows={3}
                          onChange={(event) =>
                            setMemberComment(
                              member.allocatProfileId,
                              event.target.value,
                            )
                          }
                          placeholder="Add or update your comment (optional)"
                          className={[
                            "min-h-20 resize-none rounded-lg text-sm",
                            formControlSurface,
                          ].join(" ")}
                        />

                        <div className="mt-1.5 flex justify-end">
                          <span className="text-[0.6rem] tabular-nums text-muted-foreground/60">
                            {draft.comment.length}/1000
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter
          className={["shrink-0 px-6 py-4 sm:px-7", dialogFooterSurface].join(
            " ",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            disabled={saving}
            onClick={() => onOpenChange(false)}
            className={[
              "h-9 rounded-lg px-4 text-xs shadow-none",
              ghostActionButton,
            ].join(" ")}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              saving ||
              loading ||
              Boolean(membersError) ||
              Boolean(ratingsError) ||
              members.length === 0
            }
            onClick={() => void saveRatings()}
            className={[
              "h-9 rounded-lg px-5 text-xs font-semibold shadow-none",
              primaryActionButton,
            ].join(" ")}
          >
            {saving ? (
              <LoaderCircleIcon size={14} className="animate-spin" />
            ) : (
              <StarIcon size={14} />
            )}

            {saving ? "Saving" : "Save ratings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   PROJECT DETAILS
========================================================= */

function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [members, setMembers] = useState<ProjectAllocatMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const [skillCatalogue, setSkillCatalogue] = useState<SkillOption[]>(
    getEmbeddedProjectSkills(project),
  );

  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  const progress = clampProgress(project.progress);

  const { label: categoryLabel, isClientWork } =
    getProjectCategoryContext(project);

  const priority = project.priority?.toLowerCase() || "standard";

  const selectedSkills = useMemo(
    () => resolveProjectSkills(project, skillCatalogue),
    [project, skillCatalogue],
  );

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadMembers() {
      try {
        setMembersLoading(true);
        setMembersError(null);
        setMembers([]);

        const response = await api.get<ProjectAllocatMember[]>(
          `/projects/${project.id}/allocats/members`,
          { withCredentials: true },
        );

        if (cancelled) return;

        setMembers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load project members:", error);

        setMembersError("Could not load the project team.");
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
  }, [open, project.id]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadSkills() {
      try {
        setSkillsLoading(true);
        setSkillsError(null);

        const embeddedSkills = getEmbeddedProjectSkills(project);

        setSkillCatalogue(embeddedSkills);

        const response = await api.get<SkillOption[]>("/skills", {
          withCredentials: true,
        });

        if (cancelled) return;

        const catalogue = Array.isArray(response.data) ? response.data : [];

        setSkillCatalogue(mergeSkillOptions(catalogue, embeddedSkills));
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load project skills:", error);

        setSkillsError("Could not load the project skills.");
      } finally {
        if (!cancelled) {
          setSkillsLoading(false);
        }
      }
    }

    void loadSkills();

    return () => {
      cancelled = true;
    };
  }, [open, project]);

  const acceptedMembers = useMemo(
    () =>
      members.filter(
        (member) => normalizeMemberStatus(member.status) === "accepted",
      ),
    [members],
  );

  const invitedMembers = useMemo(() => {
    if (isClientWork) return [];

    return members.filter(
      (member) => normalizeMemberStatus(member.status) === "invited",
    );
  }, [members, isClientWork]);

  const visibleMemberCount = acceptedMembers.length + invitedMembers.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden rounded-xl p-0 sm:max-w-2xl",
          dialogSurface,
        ].join(" ")}
      >
        <DialogHeader className="shrink-0 border-b border-border/55 px-6 pb-5 pt-6 text-left sm:px-7 dark:border-border">
          <ProjectIdentity project={project} />

          {project.priority && (
            <div className="mt-4">
              <span
                className={[
                  "text-[0.68rem] font-semibold capitalize",
                  priorityAppearance[priority] ?? priorityAppearance.standard,
                ].join(" ")}
              >
                {project.priority} priority
              </span>
            </div>
          )}

          <DialogTitle className="mt-3 break-words text-xl font-semibold leading-[1.15] tracking-[-0.025em] text-foreground/90 sm:text-2xl">
            {project.title}
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            {project.description || "No project description was provided."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-6 py-6 sm:px-7">
          <div className="grid gap-5 border-b border-border/55 pb-6 sm:grid-cols-3 dark:border-border">
            <DateDetail label="Created" value={project.createdAt} />

            <DateDetail label="Start date" value={project.startDate} />

            <DateDetail label="Due date" value={project.dueDate} />
          </div>

          <section>
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Project progress
                </p>

                <div className="mt-2">
                  <StatusIndicator status={project.status} />
                </div>
              </div>

              <p className="text-2xl font-semibold tracking-[-0.035em] tabular-nums text-foreground/85">
                {progress}

                <span className="ml-0.5 text-sm text-muted-foreground">%</span>
              </p>
            </div>

            <div
              className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted/80 dark:bg-surface-3"
              role="progressbar"
              aria-label="Project progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-brand-secondary-highlight/85 transition-[width] duration-500 dark:bg-secondary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <div className="grid gap-6 border-y border-border/55 py-6 sm:grid-cols-2 dark:border-border">
            <DetailRow label="Category" value={categoryLabel} />

            <DetailRow
              label="Project code"
              value={project.projectCode || "Not assigned"}
            />
          </div>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Requirements
                </p>

                <h3 className="mt-1.5 text-base font-semibold tracking-[-0.015em] text-foreground/90">
                  Required skills
                </h3>
              </div>

              {!skillsLoading && selectedSkills.length > 0 && (
                <span className="text-[0.68rem] font-medium text-muted-foreground">
                  {selectedSkills.length}{" "}
                  {selectedSkills.length === 1 ? "skill" : "skills"}
                </span>
              )}
            </div>

            {skillsLoading ? (
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <LoaderCircleIcon size={14} className="animate-spin" />
                Loading skills
              </div>
            ) : selectedSkills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className={[
                      "inline-flex items-center rounded-md border px-2.5 py-1.5",

                      "border-border/55",
                      "bg-surface-2/50",

                      "text-[0.66rem] font-medium",
                      "text-foreground/75",

                      "dark:border-border",
                      "dark:bg-surface-2/70",
                    ].join(" ")}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : skillsError ? (
              <p className="mt-4 text-xs text-destructive">{skillsError}</p>
            ) : (
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                No required skills are currently attached to this project.
              </p>
            )}
          </section>

          <section className="border-t border-border/55 pt-6 dark:border-border">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  {isClientWork ? "People" : "Project team"}
                </p>

                <h3 className="mt-1.5 text-base font-semibold tracking-[-0.015em] text-foreground/90">
                  {isClientWork ? "Project team" : "Allocats"}
                </h3>
              </div>

              {!membersLoading && !membersError && (
                <span className="text-[0.68rem] font-medium text-muted-foreground">
                  {visibleMemberCount}{" "}
                  {visibleMemberCount === 1 ? "member" : "members"}
                </span>
              )}
            </div>

            {membersLoading ? (
              <div className="mt-6 flex min-h-28 items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircleIcon size={16} className="animate-spin" />
                  Loading team
                </div>
              </div>
            ) : membersError ? (
              <div className="mt-5 border-l-2 border-status-overdue/60 pl-4">
                <p className="text-sm font-semibold text-status-overdue-foreground">
                  Project team unavailable
                </p>

                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  {membersError}
                </p>
              </div>
            ) : visibleMemberCount === 0 ? (
              <div className="mt-6 border-y border-border/55 py-7 dark:border-border">
                <UsersIcon size={20} className="text-muted-foreground/75" />

                <p className="mt-4 text-sm font-semibold text-foreground/85">
                  {isClientWork
                    ? "No other team members are currently shown."
                    : "No Allocats yet."}
                </p>

                <p className="mt-1 max-w-sm text-xs leading-6 text-muted-foreground">
                  {isClientWork
                    ? "Accepted Allocats working on this project will appear here."
                    : "Invited and accepted professionals will appear here."}
                </p>

                {!isClientWork && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className={[
                      "mt-4 -ml-3 h-8 rounded-lg px-3 text-xs shadow-none",
                      ghostActionButton,
                    ].join(" ")}
                  >
                    <Link to={`/projects/${project.id}/allocats/find`}>
                      <UserPlusIcon size={13} />
                      Find Allocats
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-7">
                {acceptedMembers.length > 0 && (
                  <MemberSection
                    title={isClientWork ? "Team" : "Accepted"}
                    description={
                      isClientWork
                        ? "Allocats currently working with you on this project."
                        : "Allocats currently working on this project."
                    }
                    members={acceptedMembers}
                  />
                )}

                {!isClientWork && invitedMembers.length > 0 && (
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

        <DialogFooter
          className={["shrink-0 px-6 py-4 sm:px-7", dialogFooterSurface].join(
            " ",
          )}
        >
          <DialogClose asChild>
            <Button
              variant="ghost"
              className={[
                "h-9 rounded-lg px-4 text-xs shadow-none",
                ghostActionButton,
              ].join(" ")}
            >
              Close
            </Button>
          </DialogClose>

          <Button
            asChild
            className={[
              "group h-9 rounded-lg px-5 text-xs font-semibold shadow-none",
              primaryActionButton,
            ].join(" ")}
          >
            <Link to={`/projects/${project.id}`}>
              Open project
              <ArrowRightIcon
                size={13}
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
   MEMBERS
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
        <h4 className="text-sm font-semibold text-foreground/85">{title}</h4>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="divide-y divide-border/55 border-y border-border/55 dark:divide-border dark:border-border">
        {members.map((member) => (
          <ProjectMemberRow key={member.allocatProfileId} member={member} />
        ))}
      </div>
    </div>
  );
}

function ProjectMemberRow({ member }: { member: ProjectAllocatMember }) {
  const accepted = normalizeMemberStatus(member.status) === "accepted";

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0 border border-border/60">
          <AvatarImage
            src={member.avatarUrl}
            alt={member.fullName}
            className="object-cover"
          />

          <AvatarFallback className="bg-surface-3 text-[0.65rem] font-semibold text-foreground/80">
            {getInitials(member.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground/85">
              {member.fullName}
            </p>

            <span
              className={[
                "inline-flex items-center gap-1.5 text-[0.6rem] font-medium",

                accepted
                  ? "text-status-complete-foreground"
                  : "text-status-pending-foreground",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",

                  accepted ? "bg-status-complete" : "bg-status-pending",
                ].join(" ")}
              />

              {member.status}
            </span>
          </div>

          <p className="mt-1 truncate text-[0.68rem] text-muted-foreground">
            {member.title || "Allocat professional"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={[
          "h-8 shrink-0 rounded-lg px-3 text-[0.68rem] font-medium shadow-none",
          ghostActionButton,
        ].join(" ")}
      >
        Profile
        <ArrowRightIcon size={12} />
      </Button>
    </div>
  );
}

/* =========================================================
   DETAILS
========================================================= */

function DateDetail({
  label,
  value,
}: {
  label: string;
  value?: string | Date | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 flex min-w-0 items-center gap-2 text-sm font-medium text-foreground/80">
        <CalendarDaysIcon
          size={13}
          className="shrink-0 text-muted-foreground/80"
        />

        <span className="min-w-0 break-words">{formatDate(value)}</span>
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-foreground/80">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EDIT PROJECT
========================================================= */

function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description ?? "");

  const [startDate, setStartDate] = useState<Date | null>(
    parseProjectDate(project.startDate),
  );

  const [dueDate, setDueDate] = useState<Date | null>(
    parseProjectDate(project.dueDate),
  );

  const [priority, setPriority] = useState<ProjectPriority>(
    normalizePriority(project.priority),
  );

  const [skillIds, setSkillIds] = useState<string[]>(
    getProjectSkillIds(project),
  );

  const [skillsChanged, setSkillsChanged] = useState(false);

  const [skillOptions, setSkillOptions] = useState<SkillOption[]>(
    getEmbeddedProjectSkills(project),
  );

  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categoryLabel = getProjectCategoryLabel(
    project.category,
    "General project",
  );

  useEffect(() => {
    if (!open) return;

    setTitle(project.title);
    setDescription(project.description ?? "");
    setStartDate(parseProjectDate(project.startDate));
    setDueDate(parseProjectDate(project.dueDate));
    setPriority(normalizePriority(project.priority));
    setSkillIds(getProjectSkillIds(project));
    setSkillOptions(getEmbeddedProjectSkills(project));
    setSkillsChanged(false);
    setSkillsError(null);
  }, [open, project]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadSkills() {
      try {
        setSkillsLoading(true);
        setSkillsError(null);

        const embeddedSkills = getEmbeddedProjectSkills(project);

        const response = await api.get<SkillOption[]>("/skills", {
          withCredentials: true,
        });

        if (cancelled) return;

        const catalogue = Array.isArray(response.data) ? response.data : [];

        setSkillOptions(mergeSkillOptions(catalogue, embeddedSkills));
      } catch (error) {
        if (cancelled) return;

        console.error("Could not load skills:", error);

        setSkillsError("The skills catalogue could not be loaded.");
      } finally {
        if (!cancelled) {
          setSkillsLoading(false);
        }
      }
    }

    void loadSkills();

    return () => {
      cancelled = true;
    };
  }, [open, project]);

  function handleSkillsChange(nextSkillIds: string[]) {
    setSkillIds(nextSkillIds);
    setSkillsChanged(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      toast.error("Add a project title before saving.");

      return;
    }

    if (skillsChanged && skillIds.length === 0) {
      toast.error("Select at least one skill for this project.");

      return;
    }

    if (skillsChanged && skillIds.length > 15) {
      toast.error("Choose no more than 15 skills.");

      return;
    }

    if (startDate && dueDate && dueDate.getTime() < startDate.getTime()) {
      toast.error("The due date must be after the start date.");

      return;
    }

    const payload: UpdateProjectRequest = {
      title: cleanTitle,
      description: cleanDescription,
      startDate: toDateOnly(startDate),
      dueDate: toDateOnly(dueDate),
      priority,
      ...(skillsChanged ? { skillIds } : {}),
    };

    try {
      setSaving(true);

      const response = await api.patch<Project>(
        `/projects/${project.id}`,
        payload,
        { withCredentials: true },
      );

      onProjectUpdated(response.data);

      toast.success("Project updated.");

      onOpenChange(false);
    } catch (error) {
      console.error("Could not update project:", error);

      toast.error("The project could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (saving) return;

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={[
          "max-h-[90vh] overflow-y-auto rounded-xl p-0 sm:max-w-2xl",
          dialogSurface,
        ].join(" ")}
      >
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="border-b border-border/55 px-6 pb-5 pt-6 text-left sm:px-7 dark:border-border">
            <div className="flex items-start gap-3">
              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  projectIconSurface,
                ].join(" ")}
              >
                <Edit3Icon size={16} />
              </span>

              <div className="min-w-0">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Project settings
                </p>

                <DialogTitle className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-foreground/90">
                  Edit project
                </DialogTitle>
              </div>
            </div>

            <DialogDescription className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Update the project information, schedule and required skills.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-7 px-6 py-6 sm:px-7">
            <section>
              <FormSectionHeading
                title="Project information"
                description="Update the title and brief while keeping the original project category."
              />

              <div className="mt-5 space-y-5">
                <div className="grid gap-2">
                  <Label
                    htmlFor={`edit-title-${project.id}`}
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Project title
                  </Label>

                  <Input
                    id={`edit-title-${project.id}`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={160}
                    autoFocus
                    disabled={saving}
                    className={[
                      "h-10 rounded-lg px-3.5",
                      formControlSurface,
                    ].join(" ")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-semibold text-foreground/80">
                    Category
                  </Label>

                  <div
                    className={[
                      "flex h-10 items-center justify-between gap-3 rounded-lg border px-3.5",

                      "border-border/55",
                      "bg-surface-2/45",

                      "dark:border-border",
                      "dark:bg-surface-2/65",
                    ].join(" ")}
                  >
                    <span className="truncate text-sm font-medium text-foreground/75">
                      {categoryLabel}
                    </span>

                    <LockKeyholeIcon
                      size={13}
                      className="shrink-0 text-muted-foreground"
                    />
                  </div>

                  <p className="text-[0.66rem] leading-5 text-muted-foreground">
                    Category is fixed after the project is created. You can
                    still update the required skills within this category.
                  </p>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xs font-semibold text-foreground/80">
                      Skills needed
                    </Label>

                    <span
                      className={[
                        "text-[0.62rem] font-medium tabular-nums",

                        skillsChanged && skillIds.length === 0
                          ? "text-destructive"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {skillIds.length}/15
                    </span>
                  </div>

                  <EditSkillsPicker
                    skills={skillOptions}
                    value={skillIds}
                    category={project.category ?? ""}
                    loading={skillsLoading}
                    error={skillsError}
                    disabled={saving}
                    onChange={handleSkillsChange}
                  />

                  {skillsChanged && skillIds.length === 0 ? (
                    <p className="text-[0.66rem] leading-5 text-destructive">
                      Select at least one skill before saving the project.
                    </p>
                  ) : (
                    <p className="text-[0.66rem] leading-5 text-muted-foreground">
                      Skills help Allocatr match this project with suitable
                      professionals.
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor={`edit-description-${project.id}`}
                      className="text-xs font-semibold text-foreground/80"
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
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={2000}
                    rows={5}
                    disabled={saving}
                    className={[
                      "min-h-32 resize-none rounded-lg text-sm leading-6",
                      formControlSurface,
                    ].join(" ")}
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-border/55 dark:bg-border" />

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
                  className={["h-10 rounded-lg", formControlSurface].join(" ")}
                />

                <Calendar28
                  id={`edit-due-date-${project.id}`}
                  label="Due date"
                  value={dueDate}
                  onChange={setDueDate}
                  className={["h-10 rounded-lg", formControlSurface].join(" ")}
                />
              </div>
            </section>

            <div className="h-px bg-border/55 dark:bg-border" />

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
                  selected={priority === "standard"}
                  disabled={saving}
                  onSelect={setPriority}
                />

                <PriorityOption
                  value="high"
                  label="High"
                  description="Needs attention soon"
                  selected={priority === "high"}
                  disabled={saving}
                  onSelect={setPriority}
                />

                <PriorityOption
                  value="urgent"
                  label="Urgent"
                  description="Immediate priority"
                  selected={priority === "urgent"}
                  disabled={saving}
                  onSelect={setPriority}
                />
              </div>
            </section>
          </div>

          <DialogFooter
            className={["px-6 py-4 sm:px-7", dialogFooterSurface].join(" ")}
          >
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() => onOpenChange(false)}
              className={[
                "h-9 rounded-lg px-4 text-xs shadow-none",
                ghostActionButton,
              ].join(" ")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving || !title.trim()}
              className={[
                "h-9 min-w-28 rounded-lg px-5 text-xs font-semibold shadow-none",
                primaryActionButton,
              ].join(" ")}
            >
              {saving && (
                <LoaderCircleIcon size={14} className="animate-spin" />
              )}

              {saving ? "Saving" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   SKILLS PICKER
========================================================= */

function EditSkillsPicker({
  skills,
  value,
  category,
  loading,
  error,
  disabled,
  onChange,
}: {
  skills: SkillOption[];
  value: string[];
  category: string;
  loading: boolean;
  error: string | null;
  disabled: boolean;
  onChange: (value: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const normalizedCategory = category.trim().toLowerCase();

  const selectedSkills = useMemo(
    () =>
      value
        .map((id) => skills.find((skill) => skill.id === id))
        .filter((skill): skill is SkillOption => Boolean(skill)),
    [skills, value],
  );

  const availableSkills = useMemo(() => {
    const search = query.trim().toLowerCase();

    return skills
      .filter((skill) => {
        const skillCategory = String(skill.category ?? "")
          .trim()
          .toLowerCase();

        const skillCategoryId = String(skill.categoryId ?? "")
          .trim()
          .toLowerCase();

        if (!normalizedCategory) return true;

        return (
          skillCategory === normalizedCategory ||
          skillCategoryId === normalizedCategory
        );
      })
      .filter((skill) => !value.includes(skill.id))
      .filter((skill) => !search || skill.name.toLowerCase().includes(search))
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [skills, value, query, normalizedCategory]);

  function addSkill(skillId: string) {
    if (disabled || value.includes(skillId) || value.length >= 15) return;

    onChange([...value, skillId]);

    setQuery("");
  }

  function removeSkill(skillId: string) {
    if (disabled) return;

    onChange(value.filter((id) => id !== skillId));
  }

  return (
    <div
      className={[
        "overflow-hidden rounded-lg border",

        "border-border/60",
        "bg-surface-2/40",

        "transition-[background-color,border-color,box-shadow]",

        "focus-within:border-ring/25",
        "focus-within:bg-surface-1",
        "focus-within:ring-1",
        "focus-within:ring-ring/10",

        "dark:border-border",
        "dark:bg-surface-2/65",

        "dark:focus-within:border-secondary/20",
        "dark:focus-within:bg-surface-2",
        "dark:focus-within:ring-secondary/[0.08]",

        disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex min-h-10 items-center gap-2 px-3.5">
        <SearchIcon size={13} className="shrink-0 text-muted-foreground" />

        <input
          value={query}
          disabled={disabled || loading}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={loading ? "Loading skills..." : "Search skills"}
          className={[
            "h-9 min-w-0 flex-1 bg-transparent text-sm outline-none",

            "text-foreground/85",

            "caret-brand-secondary-highlight",
            "placeholder:text-muted-foreground/55",

            "dark:caret-secondary",
          ].join(" ")}
        />

        {loading && (
          <LoaderCircleIcon
            size={14}
            className="animate-spin text-muted-foreground"
          />
        )}
      </div>

      {selectedSkills.length > 0 && (
        <div className="border-t border-border/55 px-3.5 pb-3 pt-3 dark:border-border">
          <p className="mb-2 text-[0.56rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Selected
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className={[
                  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5",

                  "border-border/55",
                  "bg-surface-1",

                  "text-[0.66rem] font-medium",
                  "text-foreground/80",

                  "dark:border-border",
                  "dark:bg-surface-3/45",
                ].join(" ")}
              >
                {skill.name}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeSkill(skill.id)}
                  className={[
                    "flex h-4 w-4 items-center justify-center rounded-sm",

                    "text-muted-foreground",

                    "transition-colors",

                    "hover:bg-surface-3",
                    "hover:text-foreground",

                    "dark:hover:bg-surface-2",
                  ].join(" ")}
                  aria-label={`Remove ${skill.name}`}
                >
                  <XIcon size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {!loading && !disabled && (
        <div className="border-t border-border/55 px-2 py-2 dark:border-border">
          {error ? (
            <div className="px-2 py-3">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          ) : availableSkills.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {availableSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  disabled={value.length >= 15}
                  onClick={() => addSkill(skill.id)}
                  className={[
                    "flex w-full items-center justify-between gap-4",

                    "rounded-md px-3 py-2 text-left",

                    "transition-colors",

                    "hover:bg-surface-3/60",

                    "dark:hover:bg-surface-3/70",

                    "disabled:pointer-events-none",
                    "disabled:opacity-45",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground/80">
                      {skill.name}
                    </p>

                    <p className="mt-0.5 text-[0.58rem] text-muted-foreground">
                      {skill.category}
                    </p>
                  </div>

                  <span
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",

                      "bg-surface-3/65",
                      "text-foreground/55",

                      "dark:bg-secondary/[0.07]",
                      "dark:text-secondary",
                    ].join(" ")}
                  >
                    <CheckIcon size={11} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-3">
              <p className="text-xs text-muted-foreground">
                {query.trim()
                  ? "No matching skills found."
                  : "No additional skills are available for this category."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FORM HELPERS
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
      <h3 className="text-sm font-semibold text-foreground/85">{title}</h3>

      <p className="mt-1 max-w-xl text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

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
      onClick={() => onSelect(value)}
      className={[
        "flex min-h-20 items-start justify-between gap-3",

        "rounded-lg border p-4 text-left",

        "transition-[background-color,border-color] duration-150",

        "disabled:cursor-not-allowed",
        "disabled:opacity-60",

        selected
          ? [
              "border-foreground/[0.09]",
              "bg-foreground/[0.035]",

              "dark:border-secondary/15",
              "dark:bg-secondary/[0.035]",
            ].join(" ")
          : [
              "border-border/55",
              "bg-surface-2/35",

              "hover:border-border/75",
              "hover:bg-surface-2/55",

              "dark:border-border",
              "dark:bg-surface-2/60",

              "dark:hover:bg-surface-3/60",
            ].join(" "),
      ].join(" ")}
    >
      <div>
        <p className="text-xs font-semibold text-foreground/85">{label}</p>

        <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <span
        className={[
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",

          selected
            ? [
                "border-brand-secondary-highlight",
                "bg-brand-secondary-highlight",

                "dark:border-secondary",
                "dark:bg-secondary",
              ].join(" ")
            : "border-border bg-transparent",
        ].join(" ")}
      >
        {selected && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground dark:bg-secondary-foreground" />
        )}
      </span>
    </button>
  );
}

export default GridView;
