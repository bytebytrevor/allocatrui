import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  Clock3Icon,
  Edit3Icon,
  EllipsisVerticalIcon,
  EyeIcon,
  FolderOpenIcon,
  LoaderCircleIcon,
  PauseCircleIcon,
  UserPlusIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

import api from "@/api/axios";

import type {
  Project,
} from "@/Types/project";

import type {
  ProjectAllocatMember,
} from "@/Types/projectAllocatMember";

import {
  getProjectIcon,
} from "@/utils/projectIcons";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";


import {
  Button,
} from "@/components/ui/button";

import {
  Calendar28,
} from "@/components/DatePicker";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Progress,
} from "@/components/ui/progress";

import {
  Textarea,
} from "@/components/ui/textarea";

/* =========================================================
   MOTION LINK
========================================================= */

const MotionLink =
  motion.create(
    Link,
  );

/* =========================================================
   TYPES
========================================================= */

type ViewProps = {
  project:
    Project;
};

type DialogProps = {
  project:
    Project;

  trigger:
    React.ReactNode;
};

type ProjectStatusAppearance = {
  label:
    string;

  dot:
    string;

  text:
    string;

  subtle:
    string;

  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;
};

/* =========================================================
   STATUS APPEARANCE
========================================================= */

const statusAppearance: Record<
  string,
  ProjectStatusAppearance
> = {
  pending: {
    label:
      "Pending",

    dot:
      "bg-amber-500",

    text:
      "text-amber-700 dark:text-amber-300",

    subtle:
      "bg-amber-400/10",

    icon:
      Clock3Icon,
  },

  active: {
    label:
      "Active",

    dot:
      "bg-emerald-500",

    text:
      "text-emerald-700 dark:text-emerald-300",

    subtle:
      "bg-emerald-400/10",

    icon:
      CircleDotIcon,
  },

  onhold: {
    label:
      "On hold",

    dot:
      "bg-muted-foreground",

    text:
      "text-muted-foreground",

    subtle:
      "bg-muted",

    icon:
      PauseCircleIcon,
  },

  paused: {
    label:
      "Paused",

    dot:
      "bg-muted-foreground",

    text:
      "text-muted-foreground",

    subtle:
      "bg-muted",

    icon:
      PauseCircleIcon,
  },

  complete: {
    label:
      "Complete",

    dot:
      "bg-sky-500",

    text:
      "text-sky-700 dark:text-sky-300",

    subtle:
      "bg-sky-400/10",

    icon:
      CheckCircle2Icon,
  },

  completed: {
    label:
      "Complete",

    dot:
      "bg-sky-500",

    text:
      "text-sky-700 dark:text-sky-300",

    subtle:
      "bg-sky-400/10",

    icon:
      CheckCircle2Icon,
  },

  closed: {
    label:
      "Closed",

    dot:
      "bg-muted-foreground",

    text:
      "text-muted-foreground",

    subtle:
      "bg-muted",

    icon:
      CheckCircle2Icon,
  },
};

/* =========================================================
   PRIORITY APPEARANCE
========================================================= */

const priorityAppearance: Record<
  string,
  string
> = {
  standard:
    "text-sky-700 dark:text-sky-300",

  high:
    "text-amber-700 dark:text-amber-300",

  urgent:
    "text-destructive",
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(
  status?: string,
) {
  return (
    status
      ?.toLowerCase()
      .replace(
        /[\s_-]/g,
        "",
      ) ||
    "onhold"
  );
}

function getStatusAppearance(
  status?: string,
) {
  const normalizedStatus =
    normalizeStatus(
      status,
    );

  return (
    statusAppearance[
      normalizedStatus
    ] ?? {
      label:
        status
          ? status
              .charAt(0)
              .toUpperCase() +
            status.slice(1)
          : "On hold",

      dot:
        "bg-muted-foreground",

      text:
        "text-muted-foreground",

      subtle:
        "bg-muted",

      icon:
        PauseCircleIcon,
    }
  );
}

function formatDate(
  date?:
    | string
    | Date
    | null,
) {
  if (!date) {
    return "Not set";
  }

  const parsedDate =
    new Date(
      date,
    );

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day:
        "numeric",
      month:
        "short",
      year:
        "numeric",
    },
  ).format(
    parsedDate,
  );
}

function getInitials(
  name?: string,
) {
  if (!name) {
    return "A";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase(),
    )
    .join("");
}

function clampProgress(
  progress?: number,
) {
  if (
    typeof progress !==
    "number"
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      progress,
    ),
  );
}

/* =========================================================
   GRID VIEW
========================================================= */

export function GridView({
  project,
}: ViewProps) {
  const progress =
    clampProgress(
      project.progress,
    );

  return (
    <motion.article
      className={[
        "group relative flex min-h-[295px] min-w-0 flex-col",
        "overflow-hidden rounded-[1.35rem]",
        "border border-border bg-background",
        "p-5 transition-all duration-300",
        "hover:border-primary/25",
        "hover:shadow-lg hover:shadow-black/[0.035]",
        "dark:hover:shadow-black/20",
        "sm:p-6",
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
        ease:
          "easeOut",
      }}
      whileHover={{
        y: -3,
      }}
    >
      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <ProjectIdentity
          project={
            project
          }
        />

        <ProjectMenu
          project={
            project
          }
        />
      </div>

      {/* =====================================================
          PROJECT COPY
      ===================================================== */}

      <div className="mt-6 min-w-0">
        <MotionLink
          to={`${project.id}`}
          className="block min-w-0"
          whileTap={{
            scale:
              0.99,
          }}
        >
          <h3 className="line-clamp-2 break-words text-xl font-black leading-[1.08] tracking-[-0.025em] transition-colors group-hover:text-primary sm:text-[1.35rem]">
            {
              project.title
            }
          </h3>
        </MotionLink>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {
              project.description
            }
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
            status={
              project.status
            }
          />
        </div>

        <Progress
          value={
            progress
          }
          className="mt-4 h-1.5"
        />

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <CalendarDaysIcon
              size={
                13
              }
              className="shrink-0"
            />

            <span className="truncate">
              {formatDate(
                project.createdAt,
              )}
            </span>
          </span>

          <Link
            to={`${project.id}`}
            className={[
              "group/open inline-flex shrink-0 items-center gap-1.5",
              "text-xs font-semibold text-foreground",
              "transition-colors hover:text-primary",
            ].join(" ")}
          >
            Open

            <ArrowRightIcon
              size={
                13
              }
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

export function ListView({
  project,
}: ViewProps) {
  const progress =
    clampProgress(
      project.progress,
    );

  return (
    <motion.article
      className={[
        "group relative grid min-w-0 gap-5",
        "border-b border-border py-5",
        "transition-colors duration-200",
        "hover:bg-muted/[0.18]",
        "sm:px-3",
        "md:grid-cols-[minmax(0,1.4fr)_180px_120px_auto]",
        "md:items-center",
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
        duration:
          0.3,
      }}
    >
      {/* Project */}

      <div className="min-w-0">
        <ProjectIdentity
          project={
            project
          }
          compact
        />

        <MotionLink
          to={`${project.id}`}
          className="mt-3 block min-w-0"
          whileTap={{
            scale:
              0.99,
          }}
        >
          <h3 className="truncate text-base font-black tracking-[-0.02em] transition-colors group-hover:text-primary sm:text-lg">
            {
              project.title
            }
          </h3>
        </MotionLink>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDaysIcon
            size={
              13
            }
          />

          {formatDate(
            project.createdAt,
          )}
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
          value={
            progress
          }
          className="h-1.5"
        />
      </div>

      {/* Status */}

      <StatusIndicator
        status={
          project.status
        }
      />

      {/* Menu */}

      <div className="absolute right-0 top-4 md:static">
        <ProjectMenu
          project={
            project
          }
          hideStatus
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
  project:
    Project;

  compact?:
    boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={[
          "flex shrink-0 items-center justify-center",
          "bg-primary/[0.075] text-primary",

          compact
            ? "h-9 w-9 rounded-lg"
            : "h-10 w-10 rounded-xl",
        ].join(" ")}
      >
        {getProjectIcon(
          project?.category ??
            "default",
        )}
      </span>

      <div className="min-w-0">
        <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {project.category ||
            "General project"}
        </p>

        {project.projectCode && (
          <p className="mt-0.5 truncate text-[0.62rem] text-muted-foreground/60">
            {
              project.projectCode
            }
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
  status?:
    string;
}) {
  const appearance =
    getStatusAppearance(
      status,
    );

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-2",
        "text-xs font-semibold",
        appearance.text,
      ].join(" ")}
    >
      <span
        className={`h-2 w-2 rounded-full ${appearance.dot}`}
      />

      {
        appearance.label
      }
    </span>
  );
}

/* =========================================================
   PROJECT MENU
========================================================= */

type ProjectMenuProps =
  ViewProps & {
    hideStatus?:
      boolean;
  };

function ProjectMenu({
  project,
  hideStatus = false,
}: ProjectMenuProps) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      {!hideStatus && (
        <div className="hidden sm:block">
          <StatusIndicator
            status={
              project.status
            }
          />
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={[
              "h-9 w-9 rounded-lg",
              "text-muted-foreground shadow-none",
              "hover:bg-muted hover:text-foreground",
            ].join(" ")}
            aria-label={`Open menu for ${project.title}`}
          >
            <EllipsisVerticalIcon
              size={
                17
              }
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={[
            "w-52 rounded-xl border-border",
            "bg-popover p-1.5 text-popover-foreground",
            "shadow-lg",
          ].join(" ")}
        >
          <DropdownMenuItem
            asChild
            className="rounded-lg"
          >
            <Link
              to={`/projects/${project.id}/find-allocats`}
            >
              <UserPlusIcon
                size={
                  14
                }
              />

              Find Allocats
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="rounded-lg"
          >
            <Link
              to={`${project.id}`}
            >
              <FolderOpenIcon
                size={
                  14
                }
              />

              Open project
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-lg"
            onSelect={(
              event,
            ) =>
              event.preventDefault()
            }
          >
            <ProjectDetailsDialog
              project={
                project
              }
              trigger={
                <>
                  <EyeIcon
                    size={
                      14
                    }
                  />

                  View details
                </>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-lg"
            onSelect={(
              event,
            ) =>
              event.preventDefault()
            }
          >
            <EditProjectDialog
              project={
                project
              }
              trigger={
                <>
                  <Edit3Icon
                    size={
                      14
                    }
                  />

                  Edit project
                </>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-lg">
            <CircleDotIcon
              size={
                14
              }
            />

            Change status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive">
            <XCircleIcon
              size={
                14
              }
            />

            Cancel project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* =========================================================
   PROJECT DETAILS DIALOG
========================================================= */

function ProjectDetailsDialog({
  project,
  trigger,
}: DialogProps) {
  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    members,
    setMembers,
  ] =
    useState<
      ProjectAllocatMember[]
    >([]);

  const [
    membersLoading,
    setMembersLoading,
  ] =
    useState(false);

  const [
    membersError,
    setMembersError,
  ] =
    useState<
      string | null
    >(null);

  const progress =
    clampProgress(
      project.progress,
    );

  const status =
    getStatusAppearance(
      project.status,
    );

  const priority =
    project.priority
      ?.toLowerCase() ||
    "standard";

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled =
      false;

    async function loadMembers() {
      try {
        setMembersLoading(
          true,
        );

        setMembersError(
          null,
        );

        const response =
          await api.get<
            ProjectAllocatMember[]
          >(
            `/projects/${project.id}/allocats/members`,
            {
              withCredentials:
                true,
            },
          );

        if (
          !cancelled
        ) {
          setMembers(
            response.data,
          );
        }
      } catch (error) {
        if (
          cancelled
        ) {
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
        if (
          !cancelled
        ) {
          setMembersLoading(
            false,
          );
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled =
        true;
    };
  }, [
    open,
    project.id,
  ]);

  const acceptedMembers =
    members.filter(
      (member) =>
        member.status ===
        "Accepted",
    );

  const invitedMembers =
    members.filter(
      (member) =>
        member.status ===
        "Invited",
    );

  return (
    <Dialog
      open={
        open
      }
      onOpenChange={
        setOpen
      }
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
        >
          {trigger}
        </button>
      </DialogTrigger>

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
          <ProjectIdentity
            project={
              project
            }
          />

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusIndicator
              status={
                project.status
              }
            />

            {project.priority && (
              <span
                className={[
                  "text-xs font-semibold capitalize",
                  priorityAppearance[
                    priority
                  ] ??
                    priorityAppearance.standard,
                ].join(" ")}
              >
                {
                  project.priority
                }{" "}
                priority
              </span>
            )}
          </div>

          <DialogTitle className="mt-4 break-words text-2xl font-black leading-[1.08] tracking-[-0.03em] sm:text-3xl">
            {
              project.title
            }
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
              value={
                project.createdAt
              }
            />

            <DateDetail
              label="Start date"
              value={
                project.startDate
              }
            />

            <DateDetail
              label="Due date"
              value={
                project.dueDate
              }
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
                    status={
                      project.status
                    }
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
              value={
                progress
              }
              className="mt-5 h-1.5"
            />
          </section>

          {/* Information */}

          <div className="grid gap-6 border-y border-border py-7 sm:grid-cols-2">
            <DetailRow
              label="Category"
              value={
                project.category
                  ? project.category
                      .charAt(0)
                      .toUpperCase() +
                    project.category.slice(
                      1,
                    )
                  : "General"
              }
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
                {
                  members.length
                }{" "}
                total
              </span>
            </div>

            {membersLoading ? (
              <div className="mt-6 flex min-h-28 items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircleIcon
                    size={
                      16
                    }
                    className="animate-spin"
                  />

                  Loading team...
                </div>
              </div>
            ) : membersError ? (
              <div className="mt-5 border-l-2 border-destructive pl-4">
                <p className="text-sm text-destructive">
                  {
                    membersError
                  }
                </p>
              </div>
            ) : members.length ===
              0 ? (
              <div className="mt-6 border-y border-border py-8">
                <UsersIcon
                  size={
                    21
                  }
                  className="text-muted-foreground"
                />

                <p className="mt-4 text-sm font-semibold">
                  No Allocats yet.
                </p>

                <p className="mt-1 max-w-sm text-xs leading-6 text-muted-foreground">
                  Invited and accepted professionals will appear here.
                </p>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-4 -ml-3 rounded-lg text-primary shadow-none"
                >
                  <Link
                    to={`/projects/${project.id}/find-allocats`}
                  >
                    <UserPlusIcon
                      size={
                        14
                      }
                    />

                    Find Allocats
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-8">
                {acceptedMembers.length >
                  0 && (
                  <MemberSection
                    title="Accepted"
                    description="Allocats currently working on this project."
                    members={
                      acceptedMembers
                    }
                  />
                )}

                {invitedMembers.length >
                  0 && (
                  <MemberSection
                    title="Pending invitations"
                    description="Waiting for these Allocats to respond."
                    members={
                      invitedMembers
                    }
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
            <Link
              to={`${project.id}`}
            >
              Open project

              <ArrowRightIcon
                size={
                  15
                }
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
  title:
    string;

  description:
    string;

  members:
    ProjectAllocatMember[];
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
        {members.map(
          (member) => (
            <ProjectMemberRow
              key={
                member.allocatProfileId
              }
              member={
                member
              }
            />
          ),
        )}
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
  member:
    ProjectAllocatMember;
}) {
  const accepted =
    member.status ===
    "Accepted";

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0 border border-border">
          <AvatarImage
            src={
              member.avatarUrl
            }
            alt={
              member.fullName
            }
            className="object-cover"
          />

          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
            {getInitials(
              member.fullName,
            )}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-bold">
              {
                member.fullName
              }
            </p>

            <span
              className={[
                "inline-flex items-center gap-1.5 text-[0.62rem] font-semibold",

                accepted
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-amber-700 dark:text-amber-300",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  accepted
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                ].join(" ")}
              />

              {
                member.status
              }
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

        <ArrowRightIcon
          size={
            13
          }
        />
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
  label:
    string;

  value?:
    | string
    | Date
    | null;
}) {
  return (
    <div>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
        <CalendarDaysIcon
          size={
            14
          }
          className="text-primary"
        />

        {formatDate(
          value,
        )}
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
  label:
    string;

  value:
    string;
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
  trigger,
}: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 text-left"
        >
          {trigger}
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[1.5rem] border-border bg-background text-foreground sm:max-w-2xl">
        <form>
          <DialogHeader className="text-left">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-primary">
              Project settings
            </p>

            <DialogTitle className="mt-2 text-2xl font-black tracking-[-0.03em]">
              Edit project
            </DialogTitle>

            <DialogDescription className="mt-2 leading-7">
              Update the project information, dates and priority.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-7 grid gap-6">
            <div className="grid gap-2">
              <Label
                htmlFor={`title-${project.id}`}
                className="text-sm font-semibold"
              >
                Project title
              </Label>

              <Input
                id={`title-${project.id}`}
                name="title"
                defaultValue={
                  project.title
                }
                className="h-12 rounded-xl border-border bg-background shadow-none"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor={`description-${project.id}`}
                className="text-sm font-semibold"
              >
                Description
              </Label>

              <Textarea
                id={`description-${project.id}`}
                name="description"
                defaultValue={
                  project.description
                }
                className="min-h-32 rounded-xl border-border bg-background shadow-none"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid min-w-0 gap-2">
                <Label
                  htmlFor={`start-date-${project.id}`}
                  className="text-sm font-semibold"
                >
                  Start date
                </Label>

                <Calendar28
                  id={`start-date-${project.id}`}
                  value={
                    project.startDate
                      ? new Date(
                          project.startDate,
                        )
                      : new Date()
                  }
                />
              </div>

              <div className="grid min-w-0 gap-2">
                <Label
                  htmlFor={`due-date-${project.id}`}
                  className="text-sm font-semibold"
                >
                  Due date
                </Label>

                <Calendar28
                  id={`due-date-${project.id}`}
                  value={
                    project.dueDate
                      ? new Date(
                          project.dueDate,
                        )
                      : new Date()
                  }
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">
                Priority
              </legend>

              <div className="mt-3 overflow-hidden rounded-xl border border-border sm:grid sm:grid-cols-3">
                <PriorityOption
                  projectId={
                    project.id
                  }
                  value="standard"
                  label="Standard"
                  defaultChecked={
                    project.priority ===
                    "standard"
                  }
                />

                <PriorityOption
                  projectId={
                    project.id
                  }
                  value="high"
                  label="High"
                  defaultChecked={
                    project.priority ===
                    "high"
                  }
                  divided
                />

                <PriorityOption
                  projectId={
                    project.id
                  }
                  value="urgent"
                  label="Urgent"
                  defaultChecked={
                    project.priority ===
                    "urgent"
                  }
                  divided
                />
              </div>
            </fieldset>
          </div>

          <DialogFooter className="mt-8 border-t border-border pt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="rounded-lg px-5 text-muted-foreground shadow-none"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="rounded-lg px-6 shadow-none"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   PRIORITY OPTION
========================================================= */

function PriorityOption({
  projectId,
  value,
  label,
  defaultChecked,
  divided = false,
}: {
  projectId:
    string;

  value:
    string;

  label:
    string;

  defaultChecked:
    boolean;

  divided?:
    boolean;
}) {
  const inputId =
    `${value}-${projectId}`;

  return (
    <label
      htmlFor={
        inputId
      }
      className={[
        "flex cursor-pointer items-center gap-3 px-4 py-4",
        "text-sm transition-colors",
        "hover:bg-muted/30",
        "has-[:checked]:bg-primary/[0.055]",

        divided
          ? "border-t border-border sm:border-l sm:border-t-0"
          : "",
      ].join(" ")}
    >
      <input
        type="radio"
        name={`priority-${projectId}`}
        id={
          inputId
        }
        value={
          value
        }
        defaultChecked={
          defaultChecked
        }
        className="h-4 w-4 accent-primary"
      />

      <span className="font-semibold">
        {label}
      </span>
    </label>
  );
}