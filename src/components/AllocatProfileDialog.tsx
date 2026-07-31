import { useState } from "react";
import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  LoaderCircleIcon,
  MapPinIcon,
  SendIcon,
  StarIcon,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/api/axios";
import type { Project } from "@/Types/project";
import type { AllocatProfile } from "@/Types/allocatProfile";
import { avatarFallback } from "@/utils/avatarFallback";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  allocat: AllocatProfile;
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invited: boolean;
  inviting: boolean;
  onInvite: () => void;
};

export default function AllocatProfileDialog({
  allocat,
  project,
  open,
  onOpenChange,
  invited,
  inviting,
  onInvite,
}: Props) {
  const rating = allocat.rating ?? 0;
  const completedProjects =
    allocat.completedProjects ?? 0;
  const yearsExperience =
    allocat.yearsExperience ?? 0;  

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!inviting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-border p-0 sm:max-w-2xl">
        {/* Profile heading */}
        <div className="relative overflow-hidden border-b border-border bg-muted/25 px-6 pb-6 pt-8 sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

          <DialogHeader className="relative text-left">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 shrink-0 border-4 border-background shadow-md">
                <AvatarImage
                  src={allocat.avatarUrl}
                  alt={
                    allocat.fullName
                      ? `${allocat.fullName}'s profile`
                      : "Allocat profile"
                  }
                  className="object-cover"
                />

                <AvatarFallback className="bg-primary/10 text-xl font-black text-primary">
                  {avatarFallback(allocat)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                      <span className="truncate">
                        {allocat.fullName || "Allocat professional"}
                      </span>

                      {allocat.isVerified && (
                        <BadgeCheckIcon
                          size={21}
                          className="shrink-0 text-emerald-600 dark:text-emerald-300"
                          aria-label="Verified professional"
                        />
                      )}
                    </DialogTitle>

                    <DialogDescription className="mt-2 text-sm">
                      {allocat.title || "Professional service provider"}
                    </DialogDescription>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <StarIcon
                      size={13}
                      className="fill-current"
                    />

                    {rating > 0
                      ? `${rating.toFixed(1)} rating`
                      : "New profile"}
                  </span>

                  {yearsExperience > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                      <BriefcaseBusinessIcon size={13} />

                      {yearsExperience}{" "}
                      {yearsExperience === 1
                        ? "year experience"
                        : "years experience"}
                    </span>
                  )}

                  {allocat.matchScore !== undefined && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      <CheckCircle2Icon size={13} />
                      {allocat.matchScore}% match
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-7 px-6 py-7 sm:px-8">
          {/* Key information */}
          <section className="grid gap-3 sm:grid-cols-2">
            <ProfileDetail
              icon={MapPinIcon}
              label="Location"
              value={allocat.location || "Not listed"}
            />

            <ProfileDetail
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

            <ProfileDetail
              icon={CheckCircle2Icon}
              label="Completed projects"
              value={completedProjects.toString()}
            />

            <ProfileDetail
              icon={CalendarDaysIcon}
              label="Member since"
              value={formatJoinedDate(allocat.joinedAt)}
            />
          </section>

          {/* Bio */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              About
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/80">
              {allocat.bio ||
                "This Allocat has not added a profile description yet."}
            </p>
          </section>

          {/* Skills */}
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Skills
            </p>

            {allocat.skills && allocat.skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {allocat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No skills have been listed.
              </p>
            )}
          </section>

          {/* Rate and availability summary */}
          <section className="grid gap-4 rounded-[1.5rem] border border-border bg-muted/20 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Hourly rate
              </p>

              <p className="mt-2 text-2xl font-black tracking-[-0.03em]">
                US${allocat.hourlyRate ?? 0}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  /hour
                </span>
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Availability
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                <Clock3Icon
                  size={16}
                  className="text-primary"
                />

                {allocat.availability || "Contact for availability"}
              </p>
            </div>
          </section>

          {/* Invite action */}
          <section className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Interested in working with this Allocat?
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Send an invitation to add them to this project.
              </p>
            </div>

            <Button
                type="button"
                    onClick={onInvite}
                    disabled={!project || inviting || invited}
                    className="h-12 shrink-0 rounded-full px-6"
                >
                {inviting ? (
                    <>
                    <LoaderCircleIcon
                        size={16}
                        className="animate-spin"
                    />
                    Sending invitation
                    </>
                ) : invited ? (
                    <>
                    <CheckCircle2Icon size={16} />
                    Invited
                    </>
                ) : (
                    <>
                    <SendIcon size={16} />
                    Invite to project
                    </>
                )}
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ProfileDetailProps = {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
};

function ProfileDetail({
  icon: Icon,
  label,
  value,
}: ProfileDetailProps) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={17} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold">
          {value}
        </p>
      </div>
    </article>
  );
}

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