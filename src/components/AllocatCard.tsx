import { useState } from "react";

import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  LoaderCircleIcon,
  MapPinIcon,
  RotateCcwIcon,
  SendIcon,
  SparklesIcon,
  StarIcon,
  UserRoundIcon,
} from "lucide-react";

import { toast } from "sonner";

import api from "@/api/axios";

import type { Project } from "@/Types/project";
import type { AllocatProfile } from "@/Types/allocatProfile";
import type { ProjectAllocatStatus } from "@/Types/enums";

import AllocatProfileDialog from "@/components/AllocatProfileDialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

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

type CardAllocat = Omit<AllocatProfile, "skills"> & {
  skills?: SkillItem[];
  matchScore?: number;
  matchedSkillCount?: number;
  requiredSkillCount?: number;
  verified?: boolean;
  isVerified?: boolean;
  averageRating?: number;
};

type CardMode = "project" | "discovery";

type Props = {
  allocat: CardAllocat;
  project?: Project;
  relationshipStatus?: ProjectAllocatStatus | null;
  onStatusChange?: (status: ProjectAllocatStatus) => void;
  viewMode?: "grid" | "list";
  mode?: CardMode;
  onStartProject?: () => void;
};

/* =========================================================
   THEME
========================================================= */

const cardSurface = [
  "border-border/50 bg-surface-2/50",

  "transition-[background-color,border-color] duration-200",

  "hover:border-border/70",
  "hover:bg-surface-3/45",

  "dark:border-border",
  "dark:bg-surface-1/75",

  "dark:hover:bg-surface-2/70",
].join(" ");

const avatarSurface = [
  "border-border/60",
  "bg-surface-3/70",

  "dark:border-border",
  "dark:bg-surface-2/80",
].join(" ");

const avatarFallbackSurface = [
  "bg-surface-3/75",
  "text-foreground/65",

  "dark:bg-surface-2/90",
  "dark:text-secondary/80",
].join(" ");

// const primaryActionButton = [
//   "border border-brand-secondary/15",

//   "bg-brand-secondary",
//   "text-primary-foreground",

//   "hover:border-brand-secondary/20",
//   "hover:bg-brand-secondary/90",
//   "hover:text-primary-foreground",

//   "focus-visible:ring-brand-secondary/20",

//   "dark:border-secondary/10",
//   "dark:bg-secondary",
//   "dark:text-secondary-foreground",

//   "dark:hover:border-secondary/15",
//   "dark:hover:bg-secondary/90",
//   "dark:hover:text-secondary-foreground",

//   "dark:focus-visible:ring-secondary/20",
// ].join(" ");

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

const secondaryActionButton = [
  "border-border/65",
  "bg-surface-2/35",
  "text-foreground/70",

  "hover:border-border/85",
  "hover:bg-surface-3/65",
  "hover:text-foreground/90",

  "dark:border-border",
  "dark:bg-surface-2/60",
  "dark:text-foreground/75",

  "dark:hover:bg-surface-3/70",
  "dark:hover:text-foreground",
].join(" ");

const ghostActionButton = [
  "text-muted-foreground",

  "hover:bg-surface-3/60",
  "hover:text-foreground/90",

  "dark:hover:bg-surface-3/70",
  "dark:hover:text-foreground",
].join(" ");

const skillSurface = [
  "border-border/50",
  "bg-surface-3/50",
  "text-foreground/65",

  "dark:border-border",
  "dark:bg-surface-2/75",
  "dark:text-foreground/70",
].join(" ");

const matchSurface = [
  "border-foreground/[0.07]",
  "bg-foreground/[0.04]",
  "text-foreground/65",

  "dark:border-secondary/10",
  "dark:bg-secondary/[0.045]",
  "dark:text-secondary/85",
].join(" ");

const verifiedIconClass = "text-brand-secondary-highlight dark:text-secondary";

/* =========================================================
   CARD
========================================================= */

export function AllocatCardGrid({
  allocat,
  project,
  relationshipStatus = null,
  onStatusChange,
  viewMode = "grid",
  mode = "project",
  onStartProject,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  const isDiscovery = mode === "discovery";

  const rating = allocat.rating ?? allocat.averageRating ?? 0;
  const completedProjects = allocat.completedProjects ?? 0;
  const yearsExperience = allocat.yearsExperience ?? 0;

  const isVerified = Boolean(allocat.isVerified ?? allocat.verified ?? false);

  const isInvited = relationshipStatus === "Invited";
  const isAccepted = relationshipStatus === "Accepted";
  const isDeclined = relationshipStatus === "Declined";
  const isRemoved = relationshipStatus === "Removed";

  const canInvite =
    !isDiscovery && Boolean(project) && !inviting && !isInvited && !isAccepted;

  const ratingStyle = getRatingStyle(rating);

  const visibleSkills = (allocat.skills ?? []).slice(
    0,
    viewMode === "list" ? 5 : 3,
  );

  const remainingSkills = (allocat.skills?.length ?? 0) - visibleSkills.length;

  /* =======================================================
     INVITE
  ======================================================= */

  async function handleInvite() {
    if (!project || !canInvite) return;

    setInviting(true);

    try {
      await api.put(
        `/projects/${project.id}/allocats/${allocat.allocatrUserId}/invite`,
        {},
        { withCredentials: true },
      );

      onStatusChange?.("Invited");

      toast.success(
        `${allocat.fullName} has been invited to ${project.title}.`,
      );
    } catch (error) {
      console.error("Could not invite Allocat:", error);

      toast.error("The invitation could not be sent. Please try again.");
    } finally {
      setInviting(false);
    }
  }

  /* =======================================================
     START PROJECT
  ======================================================= */

  function handleStartProject() {
    setProfileOpen(false);
    onStartProject?.();
  }

  /* =======================================================
     INVITE CONTENT
  ======================================================= */

  function renderInviteContent() {
    if (inviting) {
      return (
        <>
          <LoaderCircleIcon size={14} className="animate-spin" />
          Inviting
        </>
      );
    }

    if (isAccepted) {
      return (
        <>
          <CheckCircle2Icon size={14} />
          Added
        </>
      );
    }

    if (isInvited) {
      return (
        <>
          <CheckCircle2Icon size={14} />
          Invited
        </>
      );
    }

    if (isDeclined || isRemoved) {
      return (
        <>
          <RotateCcwIcon size={14} />
          Invite again
        </>
      );
    }

    return (
      <>
        <SendIcon size={14} />
        Invite
      </>
    );
  }

  function renderCompactInviteContent() {
    if (inviting) {
      return (
        <>
          <LoaderCircleIcon size={13} className="animate-spin" />

          <span className="hidden sm:inline">Inviting</span>
        </>
      );
    }

    if (isAccepted) {
      return (
        <>
          <CheckCircle2Icon size={13} />

          <span className="hidden sm:inline">Added</span>
        </>
      );
    }

    if (isInvited) {
      return (
        <>
          <CheckCircle2Icon size={13} />

          <span className="hidden sm:inline">Invited</span>
        </>
      );
    }

    if (isDeclined || isRemoved) {
      return (
        <>
          <RotateCcwIcon size={13} />

          <span className="hidden sm:inline">Invite again</span>
        </>
      );
    }

    return (
      <>
        <SendIcon size={13} />

        <span className="hidden sm:inline">Invite</span>
      </>
    );
  }

  function getInviteButtonClass(compact = false) {
    const base = compact
      ? [
          "h-8 w-8 rounded-lg p-0",
          "text-[0.65rem] font-semibold shadow-none",
          "sm:h-9 sm:w-auto sm:px-3",
          "lg:px-4 lg:text-xs",
        ].join(" ")
      : ["h-10 flex-1 rounded-lg", "text-xs font-semibold shadow-none"].join(
          " ",
        );

    if (isAccepted) {
      return [
        base,

        "border border-brand-green/15",
        "bg-brand-green/[0.055]",
        "text-brand-green/90",

        "hover:border-brand-green/20",
        "hover:bg-brand-green/[0.08]",
        "hover:text-brand-green",

        "dark:border-brand-green/15",
        "dark:bg-brand-green/[0.06]",
        "dark:text-brand-green",
      ].join(" ");
    }

    if (isInvited) {
      return [
        base,

        "border border-brand-amber/15",
        "bg-brand-amber/[0.055]",
        "text-brand-amber/90",

        "hover:border-brand-amber/20",
        "hover:bg-brand-amber/[0.08]",
        "hover:text-brand-amber",

        "dark:border-brand-amber/15",
        "dark:bg-brand-amber/[0.06]",
        "dark:text-brand-amber",
      ].join(" ");
    }

    return [base, primaryActionButton].join(" ");
  }

  /* =======================================================
     LIST VIEW
  ======================================================= */

  if (viewMode === "list") {
    return (
      <>
        <article
          className={[
            "group rounded-xl border",
            "px-3 py-3 sm:px-4 sm:py-4 lg:px-5",
            cardSurface,
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5 lg:gap-4">
            {/* AVATAR */}

            <ProfileAvatar
              allocat={allocat}
              verified={isVerified}
              size="large"
            />

            {/* IDENTITY */}

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <h2 className="min-w-0 truncate text-[0.78rem] font-semibold tracking-[-0.01em] text-foreground/85 sm:text-sm lg:text-base">
                  {allocat.fullName || "Allocat professional"}
                </h2>

                {isVerified && (
                  <BadgeCheckIcon
                    size={14}
                    className={[
                      "hidden shrink-0 sm:block",
                      verifiedIconClass,
                    ].join(" ")}
                  />
                )}

                {!isDiscovery && allocat.matchScore !== undefined && (
                  <span
                    className={[
                      "inline-flex h-5 shrink-0 items-center gap-1",
                      "rounded-md border px-1.5",
                      "text-[0.55rem] font-semibold",
                      "sm:h-6 sm:px-2 sm:text-[0.62rem]",
                      matchSurface,
                    ].join(" ")}
                  >
                    <SparklesIcon size={9} className="hidden sm:block" />
                    {allocat.matchScore}%
                    <span className="hidden md:inline">match</span>
                  </span>
                )}
              </div>

              <p className="mt-0.5 truncate text-[0.65rem] font-medium text-muted-foreground sm:mt-1 sm:text-xs">
                {allocat.title ||
                  allocat.headline ||
                  "Professional service provider"}
              </p>

              <div className="mt-1.5 flex min-w-0 items-center gap-2.5 sm:mt-2 sm:gap-3 lg:gap-4">
                <ListRating rating={rating} ratingStyle={ratingStyle} />

                {yearsExperience > 0 && (
                  <span className="hidden items-center gap-1.5 text-[0.65rem] text-muted-foreground sm:inline-flex lg:text-[0.7rem]">
                    <BriefcaseBusinessIcon size={11} />

                    <span>
                      {yearsExperience}

                      <span className="hidden md:inline">
                        {" "}
                        {yearsExperience === 1 ? "year" : "years"}
                      </span>
                    </span>
                  </span>
                )}

                <span className="hidden text-[0.7rem] text-muted-foreground lg:inline">
                  <span className="font-semibold text-foreground/75">
                    {completedProjects}
                  </span>{" "}
                  completed
                </span>

                <span className="hidden min-w-0 items-center gap-1.5 text-[0.7rem] text-muted-foreground lg:inline-flex">
                  <MapPinIcon size={11} className="shrink-0" />

                  <span className="max-w-36 truncate xl:max-w-48">
                    {allocat.location || "Location not listed"}
                  </span>
                </span>
              </div>

              {/* SKILLS */}

              {visibleSkills.length > 0 && (
                <div className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                  {visibleSkills.map((skill, index) => (
                    <SkillBadge key={getSkillKey(skill, index)} skill={skill} />
                  ))}

                  {remainingSkills > 0 && (
                    <span
                      className={[
                        "rounded-md border px-2 py-1",
                        "text-[0.62rem] font-semibold",
                        skillSurface,
                      ].join(" ")}
                    >
                      +{remainingSkills}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* RATE */}

            <div className="shrink-0 text-right">
              <p className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80 md:block">
                Rate
              </p>

              <p className="whitespace-nowrap text-[0.68rem] font-semibold tracking-[-0.02em] text-foreground/80 sm:text-xs md:mt-0.5 md:text-sm lg:text-base">
                <span className="hidden sm:inline">US$</span>

                <span className="sm:hidden">$</span>

                {allocat.hourlyRate ?? 0}

                <span className="ml-0.5 text-[0.52rem] font-medium text-muted-foreground sm:text-[0.6rem]">
                  /hr
                </span>
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                title="View profile"
                aria-label="View profile"
                onClick={() => setProfileOpen(true)}
                className={[
                  "h-8 w-8 rounded-lg p-0 shadow-none",
                  "sm:h-9 sm:w-auto sm:px-3",
                  ghostActionButton,
                ].join(" ")}
              >
                <UserRoundIcon size={13} />

                <span className="hidden lg:inline">Profile</span>
              </Button>

              {isDiscovery ? (
                <Button
                  type="button"
                  title="Start a project"
                  aria-label={`Start a project with ${
                    allocat.fullName || "this Allocat"
                  }`}
                  onClick={handleStartProject}
                  disabled={!onStartProject}
                  className={[
                    "h-8 w-8 rounded-lg p-0",
                    "text-[0.65rem] font-semibold shadow-none",
                    "sm:h-9 sm:w-auto sm:px-3",
                    "lg:px-4 lg:text-xs",
                    primaryActionButton,
                  ].join(" ")}
                >
                  <BriefcaseBusinessIcon size={13} />

                  <span className="hidden sm:inline">Start project</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  title={
                    isInvited ? "Invited" : isAccepted ? "Added" : "Invite"
                  }
                  aria-label={
                    isInvited ? "Invited" : isAccepted ? "Added" : "Invite"
                  }
                  onClick={() => void handleInvite()}
                  disabled={!project || inviting || isInvited || isAccepted}
                  variant="ghost"
                  className={getInviteButtonClass(true)}
                >
                  {renderCompactInviteContent()}
                </Button>
              )}
            </div>
          </div>
        </article>

        <AllocatProfileDialog
          allocat={allocat as AllocatProfile}
          project={project}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          invited={isInvited}
          inviting={inviting}
          onInvite={() => void handleInvite()}
          mode={mode}
          onStartProject={handleStartProject}
        />
      </>
    );
  }

  /* =======================================================
     GRID VIEW
  ======================================================= */

  return (
    <>
      <article
        className={[
          "group flex h-full min-w-0 flex-col",
          "rounded-xl border p-5",
          cardSurface,
        ].join(" ")}
      >
        {/* =================================================
            IDENTITY
        ================================================= */}

        <div className="flex items-start gap-3.5">
          <ProfileAvatar allocat={allocat} verified={isVerified} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h2 className="truncate text-sm font-semibold tracking-[-0.01em] text-foreground/85">
                    {allocat.fullName || "Allocat professional"}
                  </h2>

                  {isVerified && (
                    <BadgeCheckIcon
                      size={13}
                      className={["shrink-0", verifiedIconClass].join(" ")}
                    />
                  )}
                </div>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {allocat.title ||
                    allocat.headline ||
                    "Professional service provider"}
                </p>
              </div>

              {!isDiscovery && allocat.matchScore !== undefined && (
                <MatchBadge score={allocat.matchScore} compact />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem]">
              <Rating rating={rating} ratingStyle={ratingStyle} />

              {yearsExperience > 0 && (
                <>
                  <span className="h-3 w-px bg-border/60" />

                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <BriefcaseBusinessIcon size={12} />
                    {yearsExperience} {yearsExperience === 1 ? "yr" : "yrs"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          <MapPinIcon size={13} className="shrink-0" />

          <span className="truncate">
            {allocat.location || "Location not listed"}
          </span>
        </div>

        {/* =================================================
            SKILLS
        ================================================= */}

        {visibleSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visibleSkills.map((skill, index) => (
              <SkillBadge key={getSkillKey(skill, index)} skill={skill} />
            ))}

            {remainingSkills > 0 && (
              <span
                className={[
                  "rounded-md border px-2 py-1",
                  "text-[0.65rem] font-semibold",
                  skillSurface,
                ].join(" ")}
              >
                +{remainingSkills}
              </span>
            )}
          </div>
        )}

        {/* =================================================
            METRICS
        ================================================= */}

        <div className="mt-5 grid grid-cols-3 divide-x divide-border/50 border-y border-border/50 py-4">
          <Metric
            label="Rate"
            value={`US$${allocat.hourlyRate ?? 0}`}
            suffix="/hr"
          />

          <Metric label="Completed" value={String(completedProjects)} />

          <Metric
            label="Joined"
            value={formatJoinedDateShort(allocat.joinedAt)}
          />
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setProfileOpen(true)}
            className={[
              "h-10 flex-1 rounded-lg",
              "text-xs font-semibold shadow-none",
              ghostActionButton,
            ].join(" ")}
          >
            <UserRoundIcon size={14} />
            Profile
          </Button>

          {isDiscovery ? (
            <Button
              type="button"
              onClick={handleStartProject}
              disabled={!onStartProject}
              className={[
                "h-10 flex-1 rounded-lg",
                "text-xs font-semibold shadow-none",
                primaryActionButton,
              ].join(" ")}
            >
              <BriefcaseBusinessIcon size={14} />
              Start project
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => void handleInvite()}
              disabled={!project || inviting || isInvited || isAccepted}
              variant="ghost"
              className={getInviteButtonClass()}
            >
              {renderInviteContent()}
            </Button>
          )}
        </div>
      </article>

      <AllocatProfileDialog
        allocat={allocat as AllocatProfile}
        project={project}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        invited={isInvited}
        inviting={inviting}
        onInvite={() => void handleInvite()}
        mode={mode}
        onStartProject={handleStartProject}
      />
    </>
  );
}

/* =========================================================
   AVATAR
========================================================= */

function ProfileAvatar({
  allocat,
  verified,
  size = "default",
}: {
  allocat: CardAllocat;
  verified: boolean;
  size?: "default" | "large";
}) {
  const avatarSize =
    size === "large"
      ? "h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
      : "h-12 w-12";

  return (
    <div className="relative shrink-0">
      <Avatar className={[avatarSize, "border", avatarSurface].join(" ")}>
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
            "text-[0.65rem] font-semibold sm:text-xs",
            avatarFallbackSurface,
          ].join(" ")}
        >
          {getInitials(allocat.fullName)}
        </AvatarFallback>
      </Avatar>

      {verified && (
        <span
          className={[
            "absolute -bottom-0.5 -right-0.5",

            "flex h-4 w-4 items-center justify-center",
            "rounded-full border-2",

            "border-surface-2",
            "bg-brand-secondary",
            "text-primary-foreground",

            "sm:h-5 sm:w-5",

            "dark:border-surface-1",
            "dark:bg-secondary",
            "dark:text-secondary-foreground",
          ].join(" ")}
          title="Verified professional"
        >
          <BadgeCheckIcon size={9} className="sm:h-[10px] sm:w-[10px]" />
        </span>
      )}
    </div>
  );
}

/* =========================================================
   LIST RATING
========================================================= */

function ListRating({
  rating,
  ratingStyle,
}: {
  rating: number;
  ratingStyle: ReturnType<typeof getRatingStyle>;
}) {
  if (rating <= 0) {
    return (
      <span
        title="New profile"
        className={[
          "hidden shrink-0 items-center gap-1 sm:inline-flex",
          ratingStyle.text,
        ].join(" ")}
      >
        <StarIcon size={12} className={ratingStyle.star} />

        <span className="text-[0.65rem] font-semibold lg:text-[0.7rem]">
          New
        </span>
      </span>
    );
  }

  return (
    <span
      title={`${rating.toFixed(1)} rating`}
      className={[
        "inline-flex shrink-0 items-center gap-1",
        ratingStyle.text,
      ].join(" ")}
    >
      <StarIcon
        size={12}
        className={["fill-current", ratingStyle.star].join(" ")}
      />

      <span className="hidden text-[0.65rem] font-semibold sm:inline lg:text-[0.7rem]">
        {rating.toFixed(1)}
      </span>

      <span className="hidden text-[0.7rem] font-medium text-muted-foreground lg:inline">
        rating
      </span>
    </span>
  );
}

/* =========================================================
   MATCH
========================================================= */

function MatchBadge({
  score,
  compact = false,
}: {
  score: number;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="shrink-0 text-right">
        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/75">
          Match
        </p>

        <p className="mt-0.5 text-sm font-semibold text-foreground/70 dark:text-secondary/90">
          {score}%
        </p>
      </div>
    );
  }

  return (
    <span
      className={[
        "inline-flex h-7 shrink-0 items-center gap-1.5",
        "rounded-md border px-2.5",
        "text-[0.65rem] font-semibold",
        matchSurface,
      ].join(" ")}
    >
      <SparklesIcon size={11} />
      {score}% match
    </span>
  );
}

/* =========================================================
   RATING
========================================================= */

function Rating({
  rating,
  ratingStyle,
}: {
  rating: number;
  ratingStyle: ReturnType<typeof getRatingStyle>;
}) {
  return (
    <span
      className={["inline-flex items-center gap-1.5", ratingStyle.text].join(
        " ",
      )}
    >
      <StarIcon
        size={12}
        className={[rating > 0 ? "fill-current" : "", ratingStyle.star].join(
          " ",
        )}
      />

      <span className="font-semibold">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>

      {rating > 0 && (
        <span className="font-medium text-muted-foreground">rating</span>
      )}
    </span>
  );
}

/* =========================================================
   SKILL
========================================================= */

function SkillBadge({ skill }: { skill: SkillItem }) {
  return (
    <span
      className={[
        "max-w-full truncate rounded-md border",
        "px-2 py-1",
        "text-[0.65rem] font-semibold",
        skillSurface,
      ].join(" ")}
    >
      {getSkillName(skill)}
    </span>
  );
}

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
   METRIC
========================================================= */

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="min-w-0 px-3 first:pl-0 last:pr-0">
      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.11em] text-muted-foreground/75">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-foreground/75">
        {value}

        {suffix && (
          <span className="ml-0.5 font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

/* =========================================================
   RATING STYLE
========================================================= */

function getRatingStyle(rating: number) {
  if (rating <= 0) {
    return {
      text: "text-muted-foreground",
      star: "text-muted-foreground/50",
    };
  }

  if (rating < 3) {
    return {
      text: "text-destructive/85",
      star: "text-destructive/80",
    };
  }

  if (rating < 4) {
    return {
      text: "text-brand-amber/90",
      star: "text-brand-amber/80",
    };
  }

  return {
    text: "text-brand-green/90",
    star: "text-brand-green/80",
  };
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "A";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/* =========================================================
   JOINED DATE
========================================================= */

function formatJoinedDateShort(joinedAt?: string): string {
  if (!joinedAt) {
    return "—";
  }

  const joinedDate = new Date(joinedAt);

  if (Number.isNaN(joinedDate.getTime())) {
    return "—";
  }

  const now = new Date();

  const monthDifference =
    (now.getFullYear() - joinedDate.getFullYear()) * 12 +
    now.getMonth() -
    joinedDate.getMonth();

  if (monthDifference < 1) {
    return "New";
  }

  if (monthDifference < 12) {
    return `${monthDifference}mo`;
  }

  const years = Math.floor(monthDifference / 12);

  return `${years}yr`;
}
