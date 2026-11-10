import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CopyIcon,
  LoaderCircleIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import type { Project } from "@/Types/project";
import type { ProjectAllocatMember } from "@/Types/projectAllocatMember";
import type { SkillOption } from "@/Types/skillOption";
import { getProjectCategoryLabel, getProjectIcon } from "@/utils/projectIcons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ProjectStatusAppearance = {
  label: string;
  dot: string;
  text: string;
  rail: string;
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

const projectIconSurface =
  "bg-surface-3/65 text-foreground/55 ring-1 ring-inset ring-border/35 dark:bg-surface-2/80 dark:text-brand-secondary-highlight dark:ring-border";

const primaryActionButton =
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:border-brand-secondary-highlight/20 hover:bg-brand-secondary-highlight/90 hover:text-primary-foreground focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/20 dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground dark:hover:border-secondary/15 dark:hover:bg-secondary/90 dark:hover:text-secondary-foreground dark:focus-visible:ring-secondary/20";

const ghostActionButton =
  "text-muted-foreground hover:bg-surface-3/55 hover:text-foreground/90 dark:hover:bg-surface-3/65 dark:hover:text-foreground";

const dialogSurface =
  "border-border/60 bg-card text-card-foreground shadow-none dark:border-border dark:bg-card";

const dialogFooterSurface =
  "border-t border-border/55 bg-surface-2/30 dark:border-border dark:bg-surface-2/55";

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
  return (
    statusAppearance[normalizeStatus(status)] ?? {
      label: formatStatusLabel(status),
      dot: "bg-muted-foreground/60",
      text: "text-muted-foreground",
      rail: "bg-muted-foreground/45",
    }
  );
}

function parseProjectDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match)
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value?: string | Date | null) {
  const parsed = parseProjectDate(value);
  return parsed
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(parsed)
    : "Not set";
}

function getInitials(name?: string | null) {
  return name?.trim()
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "A";
}

function clampProgress(progress?: number) {
  return typeof progress === "number" && Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;
}

function isClientWorkProject(project: Project) {
  return Boolean((project as ProjectWithWorkContext).projectAllocatStatus);
}

function getProjectCategoryContext(project: Project) {
  const isClientWork = isClientWorkProject(project);
  const iconCategory = project.category?.trim()
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

function getProjectSkillIds(project: Project) {
  const value = project as ProjectWithSkillContext;
  if (Array.isArray(value.skillIds)) return [...value.skillIds];
  return Array.isArray(value.skills)
    ? value.skills.map((skill) => skill.id).filter(Boolean)
    : [];
}

function getEmbeddedProjectSkills(project: Project): SkillOption[] {
  const value = project as ProjectWithSkillContext;
  if (!Array.isArray(value.skills)) return [];
  return value.skills
    .filter((skill) => Boolean(skill?.id && skill?.name))
    .map((skill) => ({
      id: skill.id,
      name: skill.name!,
      categoryId: skill.categoryId ?? "",
      category: skill.category ?? project.category ?? "",
    }));
}

function mergeSkillOptions(...sources: SkillOption[][]) {
  const map = new Map<string, SkillOption>();
  for (const source of sources)
    for (const skill of source) map.set(skill.id, skill);
  return Array.from(map.values());
}

const priorityAppearance: Record<string, string> = {
  standard: "text-muted-foreground",
  high: "text-status-pending-foreground",
  urgent: "text-status-overdue-foreground",
};

function resolveProjectSkills(project: Project, catalogue: SkillOption[]) {
  const available = mergeSkillOptions(
    catalogue,
    getEmbeddedProjectSkills(project),
  );
  return getProjectSkillIds(project)
    .map((id) => available.find((skill) => skill.id === id))
    .filter((skill): skill is SkillOption => Boolean(skill));
}

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
        if (!cancelled) setMembersLoading(false);
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
        if (!cancelled) setSkillsLoading(false);
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
  const invitedMembers = useMemo(
    () =>
      isClientWork
        ? []
        : members.filter(
            (member) => normalizeMemberStatus(member.status) === "invited",
          ),
    [members, isClientWork],
  );
  const visibleMemberCount = acceptedMembers.length + invitedMembers.length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "flex max-h-[90dvh] flex-col overflow-hidden rounded-xl p-0 sm:max-w-2xl",
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

          <DialogTitle className="mt-3 break-words pr-6 text-xl font-semibold leading-[1.25] tracking-[-0.025em] text-foreground/90 sm:text-2xl">
            {project.title}
          </DialogTitle>

          <DialogDescription className="mt-2 max-w-xl whitespace-pre-line break-words text-sm leading-6 text-muted-foreground">
            {project.description || "No project description was provided."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-6 py-6 sm:px-7">
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
                className="h-full rounded-full bg-brand-secondary-highlight/85 transition-[width] duration-500 motion-reduce:transition-none dark:bg-secondary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <div className="grid gap-6 border-y border-border/55 py-6 sm:grid-cols-2 dark:border-border">
            <DetailRow label="Category" value={categoryLabel} />

            <DetailRow
              label="Project code"
              value={project.projectCode || "Not assigned"}
              copyable={Boolean(project.projectCode?.trim())}
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
                <span className="shrink-0 text-[0.68rem] font-medium tabular-nums text-muted-foreground">
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

                      "text-[11px] font-medium",
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
                <span className="shrink-0 text-[0.68rem] font-medium tabular-nums text-muted-foreground">
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
          <p className="mt-0.5 truncate font-mono text-[0.58rem] text-muted-foreground/60">
            {project.projectCode}
          </p>
        )}
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-between gap-3 py-4">
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
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-[13px] font-semibold text-foreground/85">
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
      <p className="mt-2 flex min-w-0 items-center gap-2 text-[13px] font-medium text-foreground/80">
        <CalendarDaysIcon
          size={13}
          className="shrink-0 text-muted-foreground/80"
        />
        <span className="min-w-0 break-words">{formatDate(value)}</span>
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  async function copyReference() {
    try {
      await window.navigator.clipboard.writeText(value);
      toast.success("Project reference copied.");
    } catch {
      toast.error("Could not copy. Select the reference and copy it manually.");
    }
  }

  return (
    <div className="min-w-0">
      <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-foreground/80">
        {copyable ? (
          <span className="inline-flex max-w-full items-center gap-1.5">
            <code className="min-w-0 select-all break-all font-mono text-[11px] font-normal leading-5">
              {value}
            </code>
            <button
              type="button"
              onClick={() => void copyReference()}
              aria-label="Copy project reference"
              title="Copy reference"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/55 hover:text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 dark:hover:bg-surface-3/65 dark:hover:text-foreground"
            >
              <CopyIcon size={13} aria-hidden="true" />
            </button>
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

export default ProjectDetailsDialog;
