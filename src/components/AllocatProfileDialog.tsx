import { type ComponentType, type ReactNode } from "react";

import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  LoaderCircleIcon,
  MapPinIcon,
  SendIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";

import type { AllocatProfile } from "@/Types/allocatProfile";
import type { Project } from "@/Types/project";

import { avatarFallback } from "@/utils/avatarFallback";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* =========================================================
   TYPES
========================================================= */

type SkillItem =
  | string
  | {
      id?: string;
      name: string;
      categoryId?: string;
      category?: string;
    };

type DialogAllocat = Omit<AllocatProfile, "skills"> & {
  skills?: SkillItem[];
  matchScore?: number;
  averageRating?: number;
  verified?: boolean;
  isVerified?: boolean;
  availability?: boolean | string;
};

type DialogMode = "project" | "discovery";

type Props = {
  allocat: DialogAllocat;
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invited?: boolean;
  inviting?: boolean;
  onInvite?: () => void;
  mode?: DialogMode;
  onStartProject?: () => void;
};

type RatingStyle = {
  text: string;
  star: string;
  surface: string;
};

/* =========================================================
   SHARED THEME
========================================================= */

const primaryActionButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",

  "hover:border-brand-secondary-highlight/20",
  "hover:bg-brand-secondary-highlight/90",
  "hover:text-primary-foreground",

  "focus-visible:ring-brand-secondary-highlight/20",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/15",
  "dark:hover:bg-secondary/90",
  "dark:hover:text-secondary-foreground",

  "dark:focus-visible:ring-secondary/20",
].join(" ");

const subtleIconSurface = [
  "bg-surface-3/70",
  "text-brand-secondary-highlight",
  "ring-1 ring-inset ring-border/40",

  "dark:bg-surface-2",
  "dark:text-secondary",
  "dark:ring-border",
].join(" ");

const subtlePanelSurface = [
  "border-border/55",
  "bg-surface-2/45",

  "dark:border-border",
  "dark:bg-surface-2/55",
].join(" ");

/* =========================================================
   DIALOG
========================================================= */

export default function AllocatProfileDialog({
  allocat,
  project,
  open,
  onOpenChange,
  invited = false,
  inviting = false,
  onInvite,
  mode,
  onStartProject,
}: Props) {
  const rating = allocat.rating ?? allocat.averageRating ?? 0;
  const completedProjects = allocat.completedProjects ?? 0;
  const yearsExperience = allocat.yearsExperience ?? 0;

  const isDiscovery = mode === "discovery" || !project;

  const isVerified = Boolean(allocat.isVerified ?? allocat.verified ?? false);

  const hasSkills = (allocat.skills?.length ?? 0) > 0;

  const availability = formatAvailability(allocat.availability);

  const ratingStyle = getRatingStyle(rating);

  const professionalTitle =
    allocat.title || allocat.headline || "Professional service provider";

  const hourlyRate = formatHourlyRate(allocat.hourlyRate);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!inviting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent
        className={[
          "flex max-h-[92vh] flex-col overflow-hidden p-0",
          "rounded-xl border shadow-none",
          "border-border/60 bg-card text-card-foreground",
          "dark:border-border dark:bg-card",
          "sm:max-w-2xl",
        ].join(" ")}
      >
        {/* =================================================
            HERO
        ================================================= */}

        <DialogHeader
          className={[
            "shrink-0 border-b px-6 pb-6 pt-6 text-left",
            "border-border/55 bg-surface-2/30",
            "dark:border-border dark:bg-surface-2/45",
            "sm:px-7 sm:pb-7 sm:pt-7",
          ].join(" ")}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* AVATAR */}

            <div className="relative shrink-0">
              <Avatar
                className={[
                  "h-[72px] w-[72px]",
                  "border border-border/65",
                  "bg-surface-3",
                  "ring-1 ring-inset ring-border/25",
                ].join(" ")}
              >
                {allocat.avatarUrl && (
                  <AvatarImage
                    src={allocat.avatarUrl}
                    alt={
                      allocat.fullName
                        ? `${allocat.fullName}'s profile`
                        : "Allocat profile"
                    }
                    className="object-cover"
                  />
                )}

                <AvatarFallback
                  className={[
                    "bg-surface-3",
                    "text-base font-semibold",
                    "text-brand-secondary-highlight",
                    "dark:text-secondary",
                  ].join(" ")}
                >
                  {avatarFallback(allocat)}
                </AvatarFallback>
              </Avatar>

              {isVerified && (
                <span
                  className={[
                    "absolute -bottom-1 -right-1",
                    "flex h-6 w-6 items-center justify-center",
                    "rounded-full border-2 border-surface-2",

                    "bg-brand-secondary-highlight",
                    "text-primary-foreground",

                    "dark:border-surface-2",
                    "dark:bg-secondary",
                    "dark:text-secondary-foreground",
                  ].join(" ")}
                  title="Verified professional"
                >
                  <BadgeCheckIcon size={11} />
                </span>
              )}
            </div>

            {/* IDENTITY */}

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <DialogTitle
                  className={[
                    "min-w-0 break-words",
                    "text-xl font-semibold leading-tight tracking-[-0.025em]",
                    "text-foreground/90",
                    "sm:text-2xl",
                  ].join(" ")}
                >
                  {allocat.fullName || "Allocat professional"}
                </DialogTitle>

                {isVerified && (
                  <BadgeCheckIcon
                    size={14}
                    className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
                  />
                )}
              </div>

              <DialogDescription className="mt-1.5 text-sm font-medium text-muted-foreground">
                {professionalTitle}
              </DialogDescription>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] text-muted-foreground">
                {allocat.location && (
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <MapPinIcon size={12} className="shrink-0" />

                    <span className="break-words">{allocat.location}</span>
                  </span>
                )}

                {yearsExperience > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusinessIcon size={12} className="shrink-0" />
                    {yearsExperience} {yearsExperience === 1 ? "year" : "years"}{" "}
                    experience
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* HERO STATS */}

          <div
            className={[
              "mt-6 grid overflow-hidden rounded-xl border",
              "border-border/55 bg-surface-2/40",
              "dark:border-border dark:bg-surface-1/45",

              isDiscovery ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
            ].join(" ")}
          >
            <HeroMetric
              label="Rating"
              value={rating > 0 ? rating.toFixed(1) : "New"}
              icon={StarIcon}
              iconClass={ratingStyle.star}
              valueClass={ratingStyle.text}
              surfaceClass={rating > 0 ? ratingStyle.surface : ""}
            />

            <HeroMetric
              label="Projects"
              value={completedProjects.toString()}
              icon={CheckCircle2Icon}
              className="border-l border-border/55 dark:border-border"
            />

            <HeroMetric
              label="Rate"
              value={hourlyRate}
              sub={
                allocat.hourlyRate !== null && allocat.hourlyRate !== undefined
                  ? "/hour"
                  : undefined
              }
              className={[
                isDiscovery
                  ? "border-l border-border/55 dark:border-border"
                  : [
                      "border-t border-border/55",
                      "dark:border-border",
                      "sm:border-l sm:border-t-0",
                    ].join(" "),
              ].join(" ")}
            />

            {!isDiscovery && (
              <HeroMetric
                label="Match"
                value={
                  allocat.matchScore !== undefined
                    ? `${allocat.matchScore}%`
                    : "—"
                }
                icon={SparklesIcon}
                accent
                className={[
                  "border-l border-t border-border/55",
                  "dark:border-border",
                  "sm:border-t-0",
                ].join(" ")}
              />
            )}
          </div>
        </DialogHeader>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-7">
          {/* =================================================
              ABOUT
          ================================================= */}

          <ProfileSection eyebrow="About" title="About this Allocat">
            <p className="max-w-xl whitespace-pre-line text-sm leading-7 text-foreground/75">
              {allocat.bio ||
                "This Allocat has not added a profile description yet."}
            </p>
          </ProfileSection>

          {/* =================================================
              SKILLS
          ================================================= */}

          <ProfileSection eyebrow="Skills" title="What they work with">
            {hasSkills ? (
              <div className="flex flex-wrap gap-2">
                {allocat.skills?.map((skill, index) => (
                  <span
                    key={getSkillKey(skill, index)}
                    className={[
                      "inline-flex max-w-full items-center rounded-lg border",
                      "border-border/55 bg-surface-2/50",
                      "px-2.5 py-1.5",
                      "text-[0.68rem] font-medium text-foreground/75",

                      "dark:border-border",
                      "dark:bg-surface-2/60",
                      "dark:text-foreground/80",
                    ].join(" ")}
                  >
                    <span className="truncate">{getSkillName(skill)}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills have been listed yet.
              </p>
            )}
          </ProfileSection>

          {/* =================================================
              DETAILS
          ================================================= */}

          <ProfileSection
            eyebrow="Profile"
            title="Working details"
            bordered={false}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={BriefcaseBusinessIcon}
                label="Experience"
                value={
                  yearsExperience > 0
                    ? `${yearsExperience} ${
                        yearsExperience === 1 ? "year" : "years"
                      }`
                    : "Not listed"
                }
              />

              <InfoTile
                icon={CalendarDaysIcon}
                label="Member since"
                value={formatJoinedDate(allocat.joinedAt)}
              />

              <InfoTile
                icon={CheckCircle2Icon}
                label="Completed work"
                value={`${completedProjects} ${
                  completedProjects === 1 ? "project" : "projects"
                }`}
              />

              <InfoTile
                icon={Clock3Icon}
                label="Availability"
                value={availability}
              />
            </div>
          </ProfileSection>

          {/* =================================================
              WORKING RATE
          ================================================= */}

          <section className="pb-7">
            <div
              className={[
                "overflow-hidden rounded-xl border p-5",
                subtlePanelSurface,
              ].join(" ")}
            >
              <div
                className={[
                  "grid gap-5",

                  !isDiscovery && allocat.matchScore !== undefined
                    ? "sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                    : "",
                ].join(" ")}
              >
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Working rate
                  </p>

                  <p className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground/85 sm:text-2xl">
                    {hourlyRate}

                    {allocat.hourlyRate !== null &&
                      allocat.hourlyRate !== undefined && (
                        <span className="ml-1 text-xs font-medium text-muted-foreground">
                          /hour
                        </span>
                      )}
                  </p>

                  <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground">
                    {isDiscovery
                      ? "Final scope, availability and terms can be confirmed when you start a project together."
                      : "Final scope, availability and terms can be confirmed after the invitation is accepted."}
                  </p>
                </div>

                {!isDiscovery && allocat.matchScore !== undefined && (
                  <div className="border-t border-border/55 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 dark:border-border">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      Project match
                    </p>

                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-brand-secondary-highlight dark:text-secondary">
                      {allocat.matchScore}%
                    </p>

                    <p className="mt-1 text-[0.66rem] text-muted-foreground">
                      based on this project
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
            ACTION BAR
        ================================================= */}

        <div
          className={[
            "shrink-0 border-t px-6 py-4",
            "border-border/55 bg-surface-2/35",
            "dark:border-border dark:bg-surface-2/45",
            "sm:px-7",
          ].join(" ")}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground/85">
                {isDiscovery
                  ? `Want to work with ${allocat.fullName || "this Allocat"}?`
                  : "Ready to work together?"}
              </p>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                {isDiscovery
                  ? `Create a project and invite ${
                      allocat.fullName || "this Allocat"
                    } when you're ready.`
                  : `Invite ${
                      allocat.fullName || "this Allocat"
                    } to ${project?.title || "your project"}.`}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={inviting}
                onClick={() => onOpenChange(false)}
                className={[
                  "h-10 rounded-lg px-4",
                  "text-xs font-medium shadow-none",
                  "text-muted-foreground",

                  "hover:bg-surface-3/60",
                  "hover:text-foreground/90",

                  "dark:hover:bg-surface-3",
                  "dark:hover:text-foreground",
                ].join(" ")}
              >
                Close
              </Button>

              {isDiscovery ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onStartProject}
                  disabled={!onStartProject}
                  className={[
                    "h-10 rounded-lg px-5",
                    "text-xs font-semibold shadow-none",
                    primaryActionButton,
                  ].join(" ")}
                >
                  <BriefcaseBusinessIcon size={14} />
                  Start a project
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onInvite}
                  disabled={!project || !onInvite || inviting || invited}
                  className={[
                    "h-10 rounded-lg px-5",
                    "text-xs font-semibold shadow-none",

                    invited
                      ? [
                          "border border-status-pending/20",
                          "bg-status-pending/[0.07]",
                          "text-status-pending-foreground",

                          "hover:bg-status-pending/[0.07]",
                          "hover:text-status-pending-foreground",

                          "dark:border-status-pending/15",
                          "dark:bg-status-pending/[0.06]",
                        ].join(" ")
                      : primaryActionButton,
                  ].join(" ")}
                >
                  {inviting ? (
                    <>
                      <LoaderCircleIcon size={14} className="animate-spin" />
                      Sending
                    </>
                  ) : invited ? (
                    <>
                      <CheckCircle2Icon size={14} />
                      Invited
                    </>
                  ) : (
                    <>
                      <SendIcon size={14} />
                      Invite to project
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  eyebrow,
  title,
  children,
  bordered = true,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <section
      className={[
        "py-7",
        bordered ? "border-b border-border/55 dark:border-border" : "",
      ].join(" ")}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight/75 dark:bg-secondary/75" />

          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {eyebrow}
          </p>
        </div>

        <h3 className="mt-2 text-sm font-semibold tracking-[-0.015em] text-foreground/85">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   HERO METRIC
========================================================= */

function HeroMetric({
  label,
  value,
  sub,
  icon: Icon,
  accent = false,
  iconClass = "",
  valueClass = "",
  surfaceClass = "",
  className = "",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ComponentType<{
    size?: number;
    className?: string;
  }>;
  accent?: boolean;
  iconClass?: string;
  valueClass?: string;
  surfaceClass?: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "min-w-0 px-4 py-4",
        surfaceClass,
        accent
          ? "bg-brand-secondary-highlight/[0.035] dark:bg-secondary/[0.035]"
          : "",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {Icon && (
          <Icon
            size={11}
            className={
              iconClass ||
              (accent
                ? "text-brand-secondary-highlight dark:text-secondary"
                : "")
            }
          />
        )}

        <p className="truncate text-[0.54rem] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <p
        className={[
          "mt-1.5 truncate",
          "text-sm font-semibold tracking-[-0.015em]",
          "text-foreground/80",

          valueClass ||
            (accent
              ? "text-brand-secondary-highlight dark:text-secondary"
              : ""),
        ].join(" ")}
      >
        {value}

        {sub && (
          <span className="ml-1 text-[0.6rem] font-medium text-muted-foreground">
            {sub}
          </span>
        )}
      </p>
    </div>
  );
}

/* =========================================================
   INFO TILE
========================================================= */

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <article
      className={[
        "flex items-start gap-3 rounded-xl border p-4",
        "border-border/55 bg-surface-2/40",
        "transition-[background-color,border-color] duration-150",

        "hover:border-border/75",
        "hover:bg-surface-2/60",

        "dark:border-border",
        "dark:bg-surface-2/50",
        "dark:hover:bg-surface-3/55",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          subtleIconSurface,
        ].join(" ")}
      >
        <Icon size={14} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.57rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-1.5 break-words text-sm font-semibold text-foreground/80">
          {value}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   RATING STYLE
========================================================= */

function getRatingStyle(rating: number): RatingStyle {
  if (rating <= 0) {
    return {
      text: "text-muted-foreground",
      star: "text-muted-foreground/55",
      surface: "",
    };
  }

  if (rating < 3) {
    return {
      text: "text-destructive/90",
      star: "fill-current text-destructive/85",
      surface: "bg-destructive/[0.025]",
    };
  }

  if (rating < 4) {
    return {
      text: "text-brand-amber/90",
      star: "fill-current text-brand-amber/85",
      surface: "bg-brand-amber/[0.025]",
    };
  }

  return {
    text: "text-brand-green/90",
    star: "fill-current text-brand-green/80",
    surface: "bg-brand-green/[0.025]",
  };
}

/* =========================================================
   SKILLS
========================================================= */

function getSkillName(skill: SkillItem): string {
  if (typeof skill === "string") {
    return skill;
  }

  return skill.name;
}

function getSkillKey(skill: SkillItem, index: number): string {
  if (typeof skill === "string") {
    return `${skill}-${index}`;
  }

  return skill.id || `${skill.name}-${index}`;
}

/* =========================================================
   AVAILABILITY
========================================================= */

function formatAvailability(availability?: boolean | string): string {
  if (availability === true) {
    return "Available";
  }

  if (availability === false) {
    return "Unavailable";
  }

  if (!availability) {
    return "Contact to confirm";
  }

  return availability
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/* =========================================================
   RATE
========================================================= */

function formatHourlyRate(hourlyRate?: number | null): string {
  if (
    hourlyRate === null ||
    hourlyRate === undefined ||
    !Number.isFinite(hourlyRate)
  ) {
    return "Not set";
  }

  return `US$${hourlyRate}`;
}

/* =========================================================
   DATE
========================================================= */

function formatJoinedDate(joinedAt?: string): string {
  if (!joinedAt) {
    return "Not available";
  }

  const joinedDate = new Date(joinedAt);

  if (Number.isNaN(joinedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(joinedDate);
}
