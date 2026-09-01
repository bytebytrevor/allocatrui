import { useState } from "react";

import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  LoaderCircleIcon,
  MapPinIcon,
  RotateCcwIcon,
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

type Props = {
  allocat: AllocatProfile;
  project?: Project;
  relationshipStatus: ProjectAllocatStatus | null;
  onStatusChange?: (status: ProjectAllocatStatus) => void;
};

/* =========================================================
   CARD
========================================================= */

export function AllocatCardGrid({
  allocat,
  project,
  relationshipStatus,
  onStatusChange,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  const rating = allocat.rating ?? 0;
  const completedProjects = allocat.completedProjects ?? 0;
  const yearsExperience = allocat.yearsExperience ?? 0;

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

  console.log("ALLOCAT CARD:", {
    name: allocat.fullName,
    avatarUrl: allocat.avatarUrl,
    allocat,
  });

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
        {/* =================================================
            PROFILE
        ================================================= */}

        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 border border-border bg-muted">
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

              <AvatarFallback className="bg-primary/[0.08] text-xs font-bold text-primary">
                {getInitials(allocat.fullName)}
              </AvatarFallback>
            </Avatar>

            {allocat.isVerified && (
              <span
                className={[
                  "absolute -bottom-0.5 -right-0.5",
                  "flex h-5 w-5 items-center justify-center",
                  "rounded-full border-2 border-background",
                  "bg-primary text-primary-foreground",
                ].join(" ")}
                title="Verified professional"
              >
                <BadgeCheckIcon size={10} />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold tracking-[-0.01em]">
                  {allocat.fullName || "Allocat professional"}
                </h2>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {allocat.title || "Professional service provider"}
                </p>
              </div>

              {allocat.matchScore !== undefined && (
                <div className="shrink-0 text-right">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Match
                  </p>

                  <p className="mt-0.5 text-sm font-black text-primary">
                    {allocat.matchScore}%
                  </p>
                </div>
              )}
            </div>

            {/* Rating + experience */}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem]">
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

        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <MapPinIcon
            size={14}
            className="shrink-0"
          />

          <span className="truncate">
            {allocat.location || "Location not listed"}
          </span>
        </div>

        {/* =================================================
            SKILLS
        ================================================= */}

        {allocat.skills && allocat.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {allocat.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className={[
                  "rounded-md",
                  "bg-primary/[0.065]",
                  "px-2 py-1",
                  "text-[0.65rem] font-semibold text-primary",
                ].join(" ")}
              >
                {skill}
              </span>
            ))}

            {allocat.skills.length > 3 && (
              <span className="rounded-md bg-muted px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                +{allocat.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* =================================================
            METRICS
        ================================================= */}

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
        allocat={allocat}
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
   RATING
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