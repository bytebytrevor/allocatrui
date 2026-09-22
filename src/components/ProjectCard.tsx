import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  ArrowRightIcon,
  BanIcon,
  CalendarDaysIcon,
  CheckIcon,
  CircleCheckBigIcon,
  Edit3Icon,
  EllipsisVerticalIcon,
  EyeIcon,
  FolderOpenIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { ProjectAllocatMember } from "@/Types/projectAllocatMember";
import type { SkillOption } from "@/Types/skillOption";

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
    text: "text-foreground",
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
  if (!status?.trim()) return "On hold";

  return status
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function getStatusAppearance(status?: string) {
  const normalizedStatus = normalizeStatus(status);

  return statusAppearance[normalizedStatus] ?? {
    label: formatStatusLabel(status),
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
  };
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
    .map(part => part.charAt(0).toUpperCase())
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
  const workProject = project as ProjectWithWorkContext;
  return Boolean(workProject.projectAllocatStatus);
}

function isAcceptedClientWorkProject(project: Project) {
  const workProject = project as ProjectWithWorkContext;

  return String(workProject.projectAllocatStatus ?? "")
    .trim()
    .toLowerCase() === "accepted";
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
  return !isClientWorkProject(project) && !isTerminalProject(project);
}

function canMarkProjectComplete(project: Project) {
  return isAcceptedClientWorkProject(project) && !isTerminalProject(project);
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

  return {
    iconCategory,
    label,
    isClientWork,
  };
}

/* =========================================================
   PROJECT SKILL HELPERS
========================================================= */

function getProjectSkillIds(project: Project) {
  const projectWithSkills = project as ProjectWithSkillContext;

  if (Array.isArray(projectWithSkills.skillIds)) {
    return [...projectWithSkills.skillIds];
  }

  if (Array.isArray(projectWithSkills.skills)) {
    return projectWithSkills.skills
      .map(skill => skill.id)
      .filter(Boolean);
  }

  return [];
}

function getEmbeddedProjectSkills(project: Project): SkillOption[] {
  const projectWithSkills = project as ProjectWithSkillContext;

  if (!Array.isArray(projectWithSkills.skills)) return [];

  return projectWithSkills.skills
    .filter(skill => Boolean(skill?.id && skill?.name))
    .map(skill => ({
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
    .map(id => availableSkills.find(skill => skill.id === id))
    .filter((skill): skill is SkillOption => Boolean(skill));
}

/* =========================================================
   SYNCED PROJECT
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

export function GridView({ project }: ViewProps) {
  const [currentProject, setCurrentProject] = useSyncedProject(project);
  const progress = clampProgress(currentProject.progress);

  return (
    <motion.article
      layout="position"
      className={[
        "group relative flex min-h-[248px] min-w-0 flex-col",
        "rounded-xl border border-border/70 bg-background",
        "p-4 sm:p-[1.125rem]",
        "transition-[border-color,box-shadow] duration-200",
        "hover:border-foreground/[0.14]",
        "hover:shadow-[0_20px_46px_-34px_rgba(0,0,0,0.42)]",
        "dark:hover:shadow-[0_22px_50px_-34px_rgba(0,0,0,0.8)]",
      ].join(" ")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{
        opacity: {
          duration: 0.18,
          ease: "easeOut",
        },
        y: {
          duration: 0.2,
          ease: "easeOut",
        },
        layout: {
          type: "spring",
          stiffness: 420,
          damping: 34,
          mass: 0.8,
        },
      }}
    >
      {/* HEADER */}

      <div className="flex min-w-0 items-start justify-between gap-3">
        <ProjectIdentity project={currentProject} />

        <div
          className={[
            "shrink-0 transition-opacity duration-150",
            "opacity-100",
            "sm:opacity-0",
            "sm:group-hover:opacity-100",
            "sm:group-focus-within:opacity-100",
          ].join(" ")}
        >
          <ProjectMenu
            project={currentProject}
            onProjectUpdated={setCurrentProject}
          />
        </div>
      </div>

      {/* PROJECT COPY */}

      <div className="mt-4 min-w-0">
        <MotionLink
          to={`/projects/${currentProject.id}`}
          className="block min-w-0"
          whileTap={{ scale: 0.995 }}
        >
          <h3
            className={[
              "line-clamp-2 break-words",
              "text-[0.98rem] font-black leading-[1.22]",
              "tracking-[-0.02em]",
              "transition-colors duration-200",
              "group-hover:text-foreground/80",
            ].join(" ")}
          >
            {currentProject.title}
          </h3>
        </MotionLink>

        {currentProject.description && (
          <p className="mt-2 line-clamp-2 text-[0.68rem] leading-[1.1rem] text-muted-foreground">
            {currentProject.description}
          </p>
        )}
      </div>

      {/* STATUS + PROGRESS */}

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <StatusIndicator status={currentProject.status} />

          <span className="text-[0.66rem] font-bold tabular-nums text-muted-foreground">
            {progress}%
          </span>
        </div>

        <Progress value={progress} className="mt-2.5 h-[3px]" />
      </div>

      {/* FOOTER */}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="flex min-w-0 items-center gap-1.5 text-[0.62rem] text-muted-foreground">
          <CalendarDaysIcon size={11} className="shrink-0" />

          <span className="truncate">
            {formatDate(currentProject.createdAt)}
          </span>
        </span>

        <Link
          to={`/projects/${currentProject.id}`}
          className={[
            "group/open inline-flex shrink-0 items-center gap-1",
            "text-[0.65rem] font-semibold text-foreground",
            "transition-colors duration-200",
            "hover:text-muted-foreground",
          ].join(" ")}
        >
          Open

          <ArrowRightIcon
            size={11}
            className="transition-transform duration-200 group-hover/open:translate-x-0.5"
          />
        </Link>
      </div>
    </motion.article>
  );
}

/* =========================================================
   LIST VIEW
========================================================= */

export function ListView({ project }: ViewProps) {
  const [currentProject, setCurrentProject] = useSyncedProject(project);
  const progress = clampProgress(currentProject.progress);

  return (
    <motion.article
      layout="position"
      className={[
        "group relative grid min-w-0 gap-5",
        "border-b border-border/70 py-5",
        "transition-colors duration-200",
        "hover:bg-muted/[0.16]",
        "sm:px-3",
        "md:grid-cols-[minmax(0,1.4fr)_170px_110px_auto]",
        "md:items-center",
      ].join(" ")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: {
          duration: 0.18,
          ease: "easeOut",
        },
        y: {
          duration: 0.2,
          ease: "easeOut",
        },
        layout: {
          type: "spring",
          stiffness: 420,
          damping: 34,
          mass: 0.8,
        },
      }}
    >
      {/* PROJECT */}

      <div className="min-w-0">
        <ProjectIdentity project={currentProject} compact />

        <MotionLink
          to={`/projects/${currentProject.id}`}
          className="mt-3 block min-w-0"
          whileTap={{ scale: 0.99 }}
        >
          <h3 className="truncate text-base font-black tracking-[-0.02em] transition-colors duration-200 group-hover:text-foreground/75 sm:text-lg">
            {currentProject.title}
          </h3>
        </MotionLink>

        {currentProject.description && (
          <p className="mt-1.5 line-clamp-2 max-w-xl text-xs leading-5 text-muted-foreground">
            {currentProject.description}
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDaysIcon size={13} />
          {formatDate(currentProject.createdAt)}
        </p>
      </div>

      {/* PROGRESS */}

      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Progress
          </span>

          <span className="text-xs font-bold tabular-nums">
            {progress}%
          </span>
        </div>

        <Progress value={progress} className="h-1" />
      </div>

      {/* STATUS */}

      <StatusIndicator status={currentProject.status} />

      {/* MENU */}

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
  const { iconCategory, label } = getProjectCategoryContext(project);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          getProjectIconSurfaceClass(iconCategory),
        ].join(" ")}
      >
        {getProjectIcon(iconCategory, compact ? 14 : 15)}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[0.56rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          {label}
        </p>

        {project.projectCode && (
          <p className="mt-0.5 truncate text-[0.58rem] text-muted-foreground/55">
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
        className={[
          "h-1.5 w-1.5 rounded-full",
          appearance.dot,
        ].join(" ")}
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isClientWork = isClientWorkProject(project);
  const showCancel = canCancelProject(project);
  const showMarkComplete = canMarkProjectComplete(project);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground"
            aria-label={`Open menu for ${project.title}`}
          >
            <EllipsisVerticalIcon size={15} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border-border bg-popover p-1.5 text-popover-foreground shadow-lg"
        >
          <DropdownMenuItem asChild className="rounded-lg">
            <Link to={`/projects/${project.id}`}>
              <FolderOpenIcon size={14} />
              Open project
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-lg"
            onSelect={() => setDetailsOpen(true)}
          >
            <EyeIcon size={14} />
            View details
          </DropdownMenuItem>

          {!isClientWork && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="rounded-lg">
                <Link to={`/projects/${project.id}/find-allocats`}>
                  <UserPlusIcon size={14} />
                  Find Allocats
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="rounded-lg"
                onSelect={() => setEditOpen(true)}
              >
                <Edit3Icon size={14} />
                Edit project
              </DropdownMenuItem>

              {showCancel && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="rounded-lg text-destructive focus:bg-destructive/[0.07] focus:text-destructive">
                    <BanIcon size={14} />
                    Cancel project
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}

          {showMarkComplete && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="rounded-lg text-emerald-700 focus:text-emerald-700 dark:text-emerald-300 dark:focus:text-emerald-300">
                <CircleCheckBigIcon size={14} />
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
  const [members, setMembers] = useState<ProjectAllocatMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const [skillCatalogue, setSkillCatalogue] = useState<SkillOption[]>(
    getEmbeddedProjectSkills(project),
  );

  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  const progress = clampProgress(project.progress);

  const {
    label: categoryLabel,
    isClientWork,
  } = getProjectCategoryContext(project);

  const priority = project.priority?.toLowerCase() || "standard";

  const selectedSkills = useMemo(
    () => resolveProjectSkills(project, skillCatalogue),
    [project, skillCatalogue],
  );

  /* =======================================================
     LOAD MEMBERS
  ======================================================= */

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadMembers() {
      try {
        setMembersLoading(true);
        setMembersError(null);

        const response = await api.get<ProjectAllocatMember[]>(
          `/projects/${project.id}/allocats/members`,
          {
            withCredentials: true,
          },
        );

        if (cancelled) return;

        setMembers(
          Array.isArray(response.data)
            ? response.data
            : [],
        );
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

  /* =======================================================
     LOAD SKILLS
  ======================================================= */

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

        const catalogue = Array.isArray(response.data)
          ? response.data
          : [];

        setSkillCatalogue(
          mergeSkillOptions(
            catalogue,
            embeddedSkills,
          ),
        );
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

  const acceptedMembers = members.filter(
    member => member.status?.trim().toLowerCase() === "accepted",
  );

  const invitedMembers = members.filter(
    member => member.status?.trim().toLowerCase() === "invited",
  );

  const visibleMemberCount =
    acceptedMembers.length +
    invitedMembers.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "flex max-h-[90vh] flex-col overflow-hidden",
          "rounded-[1.5rem] border-border bg-background p-0",
          "text-foreground sm:max-w-2xl",
        ].join(" ")}
      >
        <DialogHeader className="shrink-0 border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
          <ProjectIdentity project={project} />

          {project.priority && (
            <div className="mt-5">
              <span
                className={[
                  "text-xs font-semibold capitalize",
                  priorityAppearance[priority] ?? priorityAppearance.standard,
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

        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:px-8">
          {/* DATES */}

          <div className="grid gap-6 border-b border-border pb-7 sm:grid-cols-3">
            <DateDetail label="Created" value={project.createdAt} />
            <DateDetail label="Start date" value={project.startDate} />
            <DateDetail label="Due date" value={project.dueDate} />
          </div>

          {/* PROGRESS */}

          <section>
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Project progress
                </p>

                <div className="mt-2">
                  <StatusIndicator status={project.status} />
                </div>
              </div>

              <p className="text-4xl font-black tracking-[-0.045em] tabular-nums">
                {progress}
                <span className="text-lg text-muted-foreground">%</span>
              </p>
            </div>

            <Progress value={progress} className="mt-5 h-1.5" />
          </section>

          {/* INFORMATION */}

          <div className="grid gap-6 border-y border-border py-7 sm:grid-cols-2">
            <DetailRow label="Category" value={categoryLabel} />

            <DetailRow
              label="Project code"
              value={project.projectCode || "Not assigned"}
            />
          </div>

          {/* SKILLS */}

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Requirements
                </p>

                <h3 className="mt-1 text-lg font-black tracking-[-0.02em]">
                  Required skills
                </h3>
              </div>

              {!skillsLoading && selectedSkills.length > 0 && (
                <span className="text-xs font-semibold text-muted-foreground">
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
                {selectedSkills.map(skill => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center rounded-lg bg-muted/60 px-3 py-1.5 text-[0.68rem] font-semibold text-foreground"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : skillsError ? (
              <p className="mt-4 text-xs text-destructive">
                {skillsError}
              </p>
            ) : (
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                No required skills are currently attached to this project.
              </p>
            )}
          </section>

          {/* TEAM */}

          <section className="border-t border-border pt-7">
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
                <UsersIcon size={21} className="text-muted-foreground" />

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
                    <Link to={`/projects/${project.id}/find-allocats`}>
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

        <DialogFooter className="shrink-0 border-t border-border bg-background px-6 py-5 sm:px-8">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="rounded-lg px-5 text-muted-foreground shadow-none"
            >
              Close
            </Button>
          </DialogClose>

          <Button asChild className="group rounded-lg px-6 shadow-none">
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
        <h4 className="text-sm font-bold">{title}</h4>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {members.map(member => (
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
    member.status?.trim().toLowerCase() === "accepted";

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
                  accepted ? "bg-emerald-500" : "bg-primary",
                ].join(" ")}
              />

              {member.status}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {member.title || "Allocat professional"}
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
        <CalendarDaysIcon size={14} className="text-primary" />
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

  /* =======================================================
     RESET FORM
  ======================================================= */

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

  /* =======================================================
     LOAD SKILLS
  ======================================================= */

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

        const catalogue = Array.isArray(response.data)
          ? response.data
          : [];

        setSkillOptions(
          mergeSkillOptions(
            catalogue,
            embeddedSkills,
          ),
        );
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

  /* =======================================================
     SAVE
  ======================================================= */

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

    if (
      startDate &&
      dueDate &&
      dueDate.getTime() < startDate.getTime()
    ) {
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

  //   try {
  //     setSaving(true);

  //     const response = await api.patch<Project | null>(
  //       `/projects/${project.id}`,
  //       payload,
  //       {
  //         withCredentials: true,
  //       },
  //     );

  //     let updatedProject: Project;

  //     if (response.data && typeof response.data === "object") {
  //       updatedProject = {
  //         ...project,
  //         ...response.data,
  //       };

  //       if (skillsChanged) {
  //         updatedProject = {
  //           ...updatedProject,
  //           skillIds: [...skillIds],
  //         } as Project;
  //       }
  //     } else {
  //       updatedProject = {
  //         ...project,
  //         ...payload,
  //       } as Project;

  //       if (skillsChanged) {
  //         updatedProject = {
  //           ...updatedProject,
  //           skillIds: [...skillIds],
  //         } as Project;
  //       }
  //     }

  //     onProjectUpdated(updatedProject);
  //     toast.success("Project updated.");
  //     onOpenChange(false);
  //   } catch (error) {
  //     console.error("Could not update project:", error);
  //     toast.error("The project could not be updated.");
  //   } finally {
  //     setSaving(false);
  //   }
  // }

  try {
    setSaving(true);

    const response = await api.patch<Project>(
      `/projects/${project.id}`,
      payload,
      {
        withCredentials: true,
      },
    );

    onProjectUpdated(response.data);

    toast.success("Project updated.");
    onOpenChange(false);
  } catch (error) {
    console.error("Could not update project:", error);

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
      onOpenChange={nextOpen => {
        if (saving) return;
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
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                <Edit3Icon size={17} />
              </span>

              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Project settings
                </p>

                <DialogTitle className="mt-1.5 text-2xl font-black tracking-[-0.03em]">
                  Edit project
                </DialogTitle>
              </div>
            </div>

            <DialogDescription className="mt-4 max-w-xl text-sm leading-7">
              Update the project information, schedule and required skills.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-7 px-6 py-7 sm:px-8">
            <section>
              <FormSectionHeading
                title="Project information"
                description="Update the title and brief while keeping the original project category."
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
                    onChange={event => setTitle(event.target.value)}
                    maxLength={160}
                    autoFocus
                    disabled={saving}
                    className="h-11 rounded-lg border-border bg-background shadow-none"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">
                    Category
                  </Label>

                  <div className="flex h-11 items-center justify-between gap-3 rounded-lg bg-muted/45 px-3.5">
                    <span className="truncate text-sm font-medium">
                      {categoryLabel}
                    </span>

                    <LockKeyholeIcon
                      size={14}
                      className="shrink-0 text-muted-foreground"
                    />
                  </div>

                  <p className="text-[0.68rem] leading-5 text-muted-foreground">
                    Category is fixed after the project is created. You can
                    still update the required skills within this category.
                  </p>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-semibold">
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
                    <p className="text-[0.68rem] leading-5 text-destructive">
                      Select at least one skill before saving the project.
                    </p>
                  ) : (
                    <p className="text-[0.68rem] leading-5 text-muted-foreground">
                      Skills help Allocatr match this project with suitable
                      professionals.
                    </p>
                  )}
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
                    onChange={event => setDescription(event.target.value)}
                    maxLength={2000}
                    rows={5}
                    disabled={saving}
                    className="min-h-32 resize-none rounded-lg border-border bg-background leading-6 shadow-none"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-border" />

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

          <DialogFooter className="border-t border-border bg-background px-6 py-5 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-5 text-muted-foreground shadow-none"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving || !title.trim()}
              className="min-w-32 rounded-lg px-6 shadow-none"
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
   EDIT SKILLS PICKER
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
        .map(id => skills.find(skill => skill.id === id))
        .filter((skill): skill is SkillOption => Boolean(skill)),
    [skills, value],
  );

  const availableSkills = useMemo(() => {
    const search = query.trim().toLowerCase();

    return skills
      .filter(skill => {
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
      .filter(skill => !value.includes(skill.id))
      .filter(
        skill =>
          !search ||
          skill.name.toLowerCase().includes(search),
      )
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [skills, value, query, normalizedCategory]);

  function addSkill(skillId: string) {
    if (disabled || value.includes(skillId) || value.length >= 15) return;

    onChange([
      ...value,
      skillId,
    ]);

    setQuery("");
  }

  function removeSkill(skillId: string) {
    if (disabled) return;

    onChange(
      value.filter(id => id !== skillId),
    );
  }

  return (
    <div
      className={[
        "overflow-hidden rounded-xl bg-muted/30",
        "transition-colors",
        "focus-within:bg-muted/20",
        "focus-within:ring-1 focus-within:ring-primary/25",
        disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex min-h-11 items-center gap-2 px-3.5">
        <SearchIcon
          size={14}
          className="shrink-0 text-muted-foreground"
        />

        <input
          value={query}
          disabled={disabled || loading}
          onChange={event => setQuery(event.target.value)}
          placeholder={loading ? "Loading skills..." : "Search skills"}
          className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/55"
        />

        {loading && (
          <LoaderCircleIcon
            size={14}
            className="animate-spin text-muted-foreground"
          />
        )}
      </div>

      {selectedSkills.length > 0 && (
        <div className="px-3.5 pb-3 pt-1">
          <p className="mb-2 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Selected
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-background/80 px-2.5 py-1.5 text-[0.68rem] font-semibold"
              >
                {skill.name}

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeSkill(skill.id)}
                  className="flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
        <div className="px-2 pb-2">
          {error ? (
            <div className="px-2 py-3">
              <p className="text-xs text-destructive">
                {error}
              </p>
            </div>
          ) : availableSkills.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {availableSkills.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  disabled={value.length >= 15}
                  onClick={() => addSkill(skill.id)}
                  className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-background/75 disabled:pointer-events-none disabled:opacity-45"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {skill.name}
                    </p>

                    <p className="mt-0.5 text-[0.58rem] text-muted-foreground">
                      {skill.category}
                    </p>
                  </div>

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
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
      onClick={() => onSelect(value)}
      className={[
        "flex min-h-24 items-start justify-between gap-3",
        "rounded-xl border p-4 text-left",
        "transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-primary/35 bg-primary/[0.055]"
          : "border-border bg-background hover:bg-muted/25",
      ].join(" ")}
    >
      <div>
        <p className="text-sm font-semibold">
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
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
        )}
      </span>
    </button>
  );
}

export default GridView;