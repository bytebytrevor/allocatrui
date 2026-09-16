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

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

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

type Props = {
  allocat: CardAllocat;
  project?: Project;
  relationshipStatus: ProjectAllocatStatus | null;
  onStatusChange?: (status: ProjectAllocatStatus) => void;
  viewMode?: "grid" | "list";
};

/* =========================================================
   CARD
========================================================= */

export function AllocatCardGrid({
  allocat,
  project,
  relationshipStatus,
  onStatusChange,
  viewMode = "grid",
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  const rating =
    allocat.rating ??
    allocat.averageRating ??
    0;

  const completedProjects = allocat.completedProjects ?? 0;
  const yearsExperience = allocat.yearsExperience ?? 0;

  const isVerified = Boolean(
    allocat.isVerified ??
    allocat.verified ??
    false,
  );

  const isInvited = relationshipStatus === "Invited";
  const isAccepted = relationshipStatus === "Accepted";
  const isDeclined = relationshipStatus === "Declined";
  const isRemoved = relationshipStatus === "Removed";

  const canInvite =
    Boolean(project) &&
    !inviting &&
    !isInvited &&
    !isAccepted;

  const ratingStyle = getRatingStyle(rating);

  const visibleSkills = (allocat.skills ?? []).slice(
    0,
    viewMode === "list" ? 5 : 3,
  );

  const remainingSkills =
    (allocat.skills?.length ?? 0) - visibleSkills.length;

  /* =======================================================
     INVITE
  ======================================================= */

  async function handleInvite() {
    if (!project || !canInvite) {
      return;
    }

    setInviting(true);

    try {
      await api.put(
        `/projects/${project.id}/allocats/${allocat.allocatrUserId}/invite`,
        {},
        {
          withCredentials: true,
        },
      );

      onStatusChange?.("Invited");

      toast.success(
        `${allocat.fullName} has been invited to ${project.title}.`,
      );
    } catch (error) {
      console.error("Could not invite Allocat:", error);

      toast.error(
        "The invitation could not be sent. Please try again.",
      );
    } finally {
      setInviting(false);
    }
  }

  function renderInviteContent() {
    if (inviting) {
      return (
        <>
          <LoaderCircleIcon
            size={15}
            className="animate-spin"
          />
          Inviting
        </>
      );
    }

    if (isAccepted) {
      return (
        <>
          <CheckCircle2Icon size={15} />
          Added
        </>
      );
    }

    if (isInvited) {
      return (
        <>
          <CheckCircle2Icon size={15} />
          Invited
        </>
      );
    }

    if (isDeclined || isRemoved) {
      return (
        <>
          <RotateCcwIcon size={15} />
          Invite again
        </>
      );
    }

    return "Invite";
  }

  function renderCompactInviteContent() {
    if (inviting) {
      return (
        <>
          <LoaderCircleIcon
            size={13}
            className="animate-spin"
          />

          <span className="hidden sm:inline">
            Inviting
          </span>
        </>
      );
    }

    if (isAccepted) {
      return (
        <>
          <CheckCircle2Icon size={13} />

          <span className="hidden sm:inline">
            Added
          </span>
        </>
      );
    }

    if (isInvited) {
      return (
        <>
          <CheckCircle2Icon size={13} />

          <span className="hidden sm:inline">
            Invited
          </span>
        </>
      );
    }

    if (isDeclined || isRemoved) {
      return (
        <>
          <RotateCcwIcon size={13} />

          <span className="hidden sm:inline">
            Invite again
          </span>
        </>
      );
    }

    return (
      <>
        <SendIcon size={13} />

        <span className="hidden sm:inline">
          Invite
        </span>
      </>
    );
  }

  /* =======================================================
     LIST VIEW
  ======================================================= */

  if (viewMode === "list") {
    return (
      <>
        <article
          className={[
            "group rounded-xl border border-border bg-background",
            "px-3 py-3 sm:px-4 sm:py-4 lg:px-5",
            "transition-all duration-200",
            "hover:border-primary/25",
            "hover:shadow-sm hover:shadow-black/[0.035]",
            "dark:hover:shadow-black/20",
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5 lg:gap-4">

            {/* ===============================================
                AVATAR
            =============================================== */}

            <ProfileAvatar
              allocat={allocat}
              verified={isVerified}
              size="large"
            />

            {/* ===============================================
                MAIN PROFILE INFORMATION
            =============================================== */}

            <div className="min-w-0 flex-1">

              {/* NAME */}

              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <h2 className="min-w-0 truncate text-[0.78rem] font-bold tracking-[-0.01em] sm:text-sm lg:text-base">
                  {allocat.fullName || "Allocat professional"}
                </h2>

                {isVerified && (
                  <BadgeCheckIcon
                    size={14}
                    className="hidden shrink-0 text-primary sm:block"
                  />
                )}

                {allocat.matchScore !== undefined && (
                  <span
                    className={[
                      "inline-flex h-5 shrink-0 items-center gap-1",
                      "rounded-md bg-primary/[0.08]",
                      "px-1.5 text-[0.55rem] font-bold text-primary",
                      "sm:h-6 sm:px-2 sm:text-[0.62rem]",
                    ].join(" ")}
                  >
                    <SparklesIcon
                      size={9}
                      className="hidden sm:block"
                    />

                    {allocat.matchScore}%

                    <span className="hidden md:inline">
                      match
                    </span>
                  </span>
                )}
              </div>

              {/* TITLE */}

              <p className="mt-0.5 truncate text-[0.65rem] font-medium text-muted-foreground sm:mt-1 sm:text-xs">
                {allocat.title ||
                  allocat.headline ||
                  "Professional service provider"}
              </p>

              {/* ===============================================
                  DETAILS

                  Mobile:
                  rating star only

                  sm:
                  rating + experience

                  lg:
                  rating + experience + completed + location
              =============================================== */}

              <div className="mt-1.5 flex min-w-0 items-center gap-2.5 sm:mt-2 sm:gap-3 lg:gap-4">

                {/* RATING */}

                {rating > 0 && (
                  <ListRating
                    rating={rating}
                    ratingStyle={ratingStyle}
                  />
                )}

                {/* EXPERIENCE */}

                {yearsExperience > 0 && (
                  <span className="hidden items-center gap-1 text-[0.65rem] text-muted-foreground sm:inline-flex lg:text-[0.7rem]">
                    <BriefcaseBusinessIcon size={11} />

                    <span>
                      {yearsExperience}
                      <span className="hidden md:inline">
                        {" "}
                        {yearsExperience === 1
                          ? "year"
                          : "years"}
                      </span>
                    </span>
                  </span>
                )}

                {/* COMPLETED */}

                <span className="hidden text-[0.7rem] text-muted-foreground lg:inline">
                  <span className="font-semibold text-foreground">
                    {completedProjects}
                  </span>{" "}
                  completed
                </span>

                {/* LOCATION */}

                <span className="hidden min-w-0 items-center gap-1 text-[0.7rem] text-muted-foreground lg:inline-flex">
                  <MapPinIcon
                    size={11}
                    className="shrink-0"
                  />

                  <span className="max-w-36 truncate xl:max-w-48">
                    {allocat.location || "Location not listed"}
                  </span>
                </span>
              </div>

              {/* ===============================================
                  SKILLS

                  Hidden below md.
              =============================================== */}

              {visibleSkills.length > 0 && (
                <div className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                  {visibleSkills.map((skill, index) => (
                    <SkillBadge
                      key={getSkillKey(skill, index)}
                      skill={skill}
                    />
                  ))}

                  {remainingSkills > 0 && (
                    <span className="rounded-md bg-muted px-2 py-1 text-[0.62rem] font-semibold text-muted-foreground">
                      +{remainingSkills}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ===============================================
                RATE
            =============================================== */}

            <div className="shrink-0 text-right">
              <p className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:block">
                Rate
              </p>

              <p className="whitespace-nowrap text-[0.68rem] font-black tracking-[-0.02em] sm:text-xs md:mt-0.5 md:text-sm lg:text-base">
                <span className="hidden sm:inline">
                  US$
                </span>

                <span className="sm:hidden">
                  $
                </span>

                {allocat.hourlyRate ?? 0}

                <span className="ml-0.5 text-[0.52rem] font-medium text-muted-foreground sm:text-[0.6rem]">
                  /hr
                </span>
              </p>
            </div>

            {/* ===============================================
                ACTIONS
            =============================================== */}

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">

              {/* PROFILE */}

              <Button
                type="button"
                variant="ghost"
                title="View profile"
                aria-label="View profile"
                onClick={() => setProfileOpen(true)}
                className={[
                  "h-8 w-8 rounded-lg p-0",
                  "text-muted-foreground shadow-none",
                  "hover:bg-muted/50 hover:text-foreground",
                  "sm:h-9 sm:w-auto sm:px-3",
                ].join(" ")}
              >
                <UserRoundIcon size={13} />

                <span className="hidden lg:inline">
                  Profile
                </span>
              </Button>

              {/* INVITE */}

              <Button
                type="button"
                title={
                  isInvited
                    ? "Invited"
                    : isAccepted
                      ? "Added"
                      : "Invite"
                }
                aria-label={
                  isInvited
                    ? "Invited"
                    : isAccepted
                      ? "Added"
                      : "Invite"
                }
                onClick={() => void handleInvite()}
                disabled={
                  !project ||
                  inviting ||
                  isInvited ||
                  isAccepted
                }
                variant={
                  isInvited || isAccepted
                    ? "outline"
                    : "default"
                }
                className={[
                  "h-8 w-8 rounded-lg p-0",
                  "text-[0.65rem] font-semibold shadow-none",
                  "sm:h-9 sm:w-auto sm:px-3",
                  "lg:px-4 lg:text-xs",
                ].join(" ")}
              >
                {renderCompactInviteContent()}
              </Button>
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
          "rounded-xl border border-border bg-background",
          "p-5",
          "transition-all duration-200",
          "hover:border-primary/25",
          "hover:shadow-md hover:shadow-black/[0.035]",
          "dark:hover:shadow-black/20",
        ].join(" ")}
      >
        {/* PROFILE */}

        <div className="flex items-start gap-3.5">
          <ProfileAvatar
            allocat={allocat}
            verified={isVerified}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold tracking-[-0.01em]">
                  {allocat.fullName || "Allocat professional"}
                </h2>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {allocat.title ||
                    allocat.headline ||
                    "Professional service provider"}
                </p>
              </div>

              {allocat.matchScore !== undefined && (
                <MatchBadge
                  score={allocat.matchScore}
                  compact
                />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem]">
              <Rating
                rating={rating}
                ratingStyle={ratingStyle}
              />

              {yearsExperience > 0 && (
                <>
                  <span className="h-3 w-px bg-border" />

                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <BriefcaseBusinessIcon size={12} />

                    {yearsExperience}{" "}
                    {yearsExperience === 1 ? "yr" : "yrs"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* LOCATION */}

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <MapPinIcon
            size={14}
            className="shrink-0"
          />

          <span className="truncate">
            {allocat.location || "Location not listed"}
          </span>
        </div>

        {/* SKILLS */}

        {visibleSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visibleSkills.map((skill, index) => (
              <SkillBadge
                key={getSkillKey(skill, index)}
                skill={skill}
              />
            ))}

            {remainingSkills > 0 && (
              <span className="rounded-md bg-muted px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                +{remainingSkills}
              </span>
            )}
          </div>
        )}

        {/* METRICS */}

        <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border py-4">
          <Metric
            label="Rate"
            value={`US$${allocat.hourlyRate ?? 0}`}
            suffix="/hr"
          />

          <Metric
            label="Completed"
            value={String(completedProjects)}
          />

          <Metric
            label="Joined"
            value={formatJoinedDateShort(allocat.joinedAt)}
          />
        </div>

        {/* ACTIONS */}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setProfileOpen(true)}
            className={[
              "h-10 flex-1 rounded-lg",
              "text-xs font-semibold",
              "text-muted-foreground",
              "shadow-none",
              "hover:bg-muted/40",
              "hover:text-foreground",
            ].join(" ")}
          >
            <UserRoundIcon size={14} />
            Profile
          </Button>

          <Button
            type="button"
            onClick={() => void handleInvite()}
            disabled={
              !project ||
              inviting ||
              isInvited ||
              isAccepted
            }
            variant={
              isInvited || isAccepted
                ? "outline"
                : "default"
            }
            className="h-10 flex-1 rounded-lg text-xs font-semibold shadow-none"
          >
            {renderInviteContent()}
          </Button>
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
      <Avatar className={`${avatarSize} border border-border bg-muted`}>
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

        <AvatarFallback className="bg-primary/[0.08] text-[0.65rem] font-bold text-primary sm:text-xs">
          {getInitials(allocat.fullName)}
        </AvatarFallback>
      </Avatar>

      {verified && (
        <span
          className={[
            "absolute -bottom-0.5 -right-0.5",
            "flex h-4 w-4 items-center justify-center",
            "rounded-full border-2 border-background",
            "bg-primary text-primary-foreground",
            "sm:h-5 sm:w-5",
          ].join(" ")}
          title="Verified professional"
        >
          <BadgeCheckIcon
            size={9}
            className="sm:h-[10px] sm:w-[10px]"
          />
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
        className={[
          "fill-current",
          ratingStyle.star,
        ].join(" ")}
      />

      <span className="hidden text-[0.65rem] font-bold sm:inline lg:text-[0.7rem]">
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
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Match
        </p>

        <p className="mt-0.5 text-sm font-black text-primary">
          {score}%
        </p>
      </div>
    );
  }

  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-primary/[0.08] px-2.5 text-[0.65rem] font-bold text-primary">
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
      className={[
        "inline-flex items-center gap-1.5",
        ratingStyle.text,
      ].join(" ")}
    >
      <StarIcon
        size={12}
        className={[
          "fill-current",
          ratingStyle.star,
        ].join(" ")}
      />

      <span className="font-bold">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>

      {rating > 0 && (
        <span className="font-medium text-muted-foreground">
          rating
        </span>
      )}
    </span>
  );
}

/* =========================================================
   SKILL
========================================================= */

function SkillBadge({
  skill,
}: {
  skill: SkillItem;
}) {
  return (
    <span
      className={[
        "max-w-full truncate rounded-md",
        "bg-primary/[0.065]",
        "px-2 py-1",
        "text-[0.65rem] font-semibold text-primary",
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

function getSkillKey(
  skill: SkillItem,
  index: number,
): string {
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
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold">
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
      text: "text-amber-600 dark:text-amber-300",
      star: "text-amber-500",
    };
  }

  if (rating < 3) {
    return {
      text: "text-red-600 dark:text-red-400",
      star: "text-red-500",
    };
  }

  if (rating < 4) {
    return {
      text: "text-amber-600 dark:text-amber-300",
      star: "text-amber-500",
    };
  }

  if (rating < 4.5) {
    return {
      text: "text-lime-700 dark:text-lime-400",
      star: "text-lime-600 dark:text-lime-400",
    };
  }

  return {
    text: "text-emerald-700 dark:text-emerald-300",
    star: "text-emerald-600 dark:text-emerald-400",
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
    .map(part => part.charAt(0).toUpperCase())
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