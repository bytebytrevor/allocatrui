// import { useState } from "react";
// import {
//   BadgeCheckIcon,
//   BriefcaseBusinessIcon,
//   CalendarDaysIcon,
//   CheckCircle2Icon,
//   Clock3Icon,
//   LoaderCircleIcon,
//   MapPinIcon,
//   SendIcon,
//   StarIcon,
// } from "lucide-react";
// import { toast } from "sonner";

// import api from "@/api/axios";
// import type { Project } from "@/Types/project";
// import type { AllocatProfile } from "@/Types/allocatProfile";
// import { avatarFallback } from "@/utils/avatarFallback";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// type Props = {
//   allocat: AllocatProfile;
//   project?: Project;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   invited: boolean;
//   inviting: boolean;
//   onInvite: () => void;
// };

// export default function AllocatProfileDialog({
//   allocat,
//   project,
//   open,
//   onOpenChange,
//   invited,
//   inviting,
//   onInvite,
// }: Props) {
//   const rating = allocat.rating ?? 0;
//   const completedProjects =
//     allocat.completedProjects ?? 0;
//   const yearsExperience =
//     allocat.yearsExperience ?? 0;  

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(nextOpen) => {
//         if (!inviting) {
//           onOpenChange(nextOpen);
//         }
//       }}
//     >
//       <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-border p-0 sm:max-w-2xl">
//         {/* Profile heading */}
//         <div className="relative overflow-hidden border-b border-border bg-muted/25 px-6 pb-6 pt-8 sm:px-8">
//           <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

//           <DialogHeader className="relative text-left">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
//               <Avatar className="h-20 w-20 shrink-0 border-4 border-background shadow-md">
//                 <AvatarImage
//                   src={allocat.avatarUrl}
//                   alt={
//                     allocat.fullName
//                       ? `${allocat.fullName}'s profile`
//                       : "Allocat profile"
//                   }
//                   className="object-cover"
//                 />

//                 <AvatarFallback className="bg-primary/10 text-xl font-black text-primary">
//                   {avatarFallback(allocat)}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="min-w-0 flex-1">
//                 <div className="flex items-start gap-3">
//                   <div className="min-w-0 flex-1">
//                     <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
//                       <span className="truncate">
//                         {allocat.fullName || "Allocat professional"}
//                       </span>

//                       {allocat.isVerified && (
//                         <BadgeCheckIcon
//                           size={21}
//                           className="shrink-0 text-emerald-600 dark:text-emerald-300"
//                           aria-label="Verified professional"
//                         />
//                       )}
//                     </DialogTitle>

//                     <DialogDescription className="mt-2 text-sm">
//                       {allocat.title || "Professional service provider"}
//                     </DialogDescription>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
//                     <StarIcon
//                       size={13}
//                       className="fill-current"
//                     />

//                     {rating > 0
//                       ? `${rating.toFixed(1)} rating`
//                       : "New profile"}
//                   </span>

//                   {yearsExperience > 0 && (
//                     <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
//                       <BriefcaseBusinessIcon size={13} />

//                       {yearsExperience}{" "}
//                       {yearsExperience === 1
//                         ? "year experience"
//                         : "years experience"}
//                     </span>
//                   )}

//                   {allocat.matchScore !== undefined && (
//                     <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
//                       <CheckCircle2Icon size={13} />
//                       {allocat.matchScore}% match
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </DialogHeader>
//         </div>

//         <div className="space-y-7 px-6 py-7 sm:px-8">
//           {/* Key information */}
//           <section className="grid gap-3 sm:grid-cols-2">
//             <ProfileDetail
//               icon={MapPinIcon}
//               label="Location"
//               value={allocat.location || "Not listed"}
//             />

//             <ProfileDetail
//               icon={BriefcaseBusinessIcon}
//               label="Experience"
//               value={
//                 yearsExperience > 0
//                   ? `${yearsExperience} ${
//                       yearsExperience === 1 ? "year" : "years"
//                     }`
//                   : "Not listed"
//               }
//             />

//             <ProfileDetail
//               icon={CheckCircle2Icon}
//               label="Completed projects"
//               value={completedProjects.toString()}
//             />

//             <ProfileDetail
//               icon={CalendarDaysIcon}
//               label="Member since"
//               value={formatJoinedDate(allocat.joinedAt)}
//             />
//           </section>

//           {/* Bio */}
//           <section>
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//               About
//             </p>

//             <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground/80">
//               {allocat.bio ||
//                 "This Allocat has not added a profile description yet."}
//             </p>
//           </section>

//           {/* Skills */}
//           <section>
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//               Skills
//             </p>

//             {allocat.skills && allocat.skills.length > 0 ? (
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {allocat.skills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="mt-3 text-sm text-muted-foreground">
//                 No skills have been listed.
//               </p>
//             )}
//           </section>

//           {/* Rate and availability summary */}
//           <section className="grid gap-4 rounded-[1.5rem] border border-border bg-muted/20 p-5 sm:grid-cols-2">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//                 Hourly rate
//               </p>

//               <p className="mt-2 text-2xl font-black tracking-[-0.03em]">
//                 US${allocat.hourlyRate ?? 0}
//                 <span className="ml-1 text-xs font-medium text-muted-foreground">
//                   /hour
//                 </span>
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//                 Availability
//               </p>

//               <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
//                 <Clock3Icon
//                   size={16}
//                   className="text-primary"
//                 />

//                 {allocat.availability || "Contact for availability"}
//               </p>
//             </div>
//           </section>

//           {/* Invite action */}
//           <section className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm font-semibold">
//                 Interested in working with this Allocat?
//               </p>

//               <p className="mt-1 text-xs leading-5 text-muted-foreground">
//                 Send an invitation to add them to this project.
//               </p>
//             </div>

//             <Button
//                 type="button"
//                     onClick={onInvite}
//                     disabled={!project || inviting || invited}
//                     className="h-12 shrink-0 rounded-full px-6"
//                 >
//                 {inviting ? (
//                     <>
//                     <LoaderCircleIcon
//                         size={16}
//                         className="animate-spin"
//                     />
//                     Sending invitation
//                     </>
//                 ) : invited ? (
//                     <>
//                     <CheckCircle2Icon size={16} />
//                     Invited
//                     </>
//                 ) : (
//                     <>
//                     <SendIcon size={16} />
//                     Invite to project
//                     </>
//                 )}
//             </Button>
//           </section>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// type ProfileDetailProps = {
//   icon: React.ComponentType<{
//     size?: number;
//     className?: string;
//   }>;
//   label: string;
//   value: string;
// };

// function ProfileDetail({
//   icon: Icon,
//   label,
//   value,
// }: ProfileDetailProps) {
//   return (
//     <article className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
//       <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
//         <Icon size={17} />
//       </span>

//       <div className="min-w-0">
//         <p className="text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
//           {label}
//         </p>

//         <p className="mt-1 break-words text-sm font-semibold">
//           {value}
//         </p>
//       </div>
//     </article>
//   );
// }

// function formatJoinedDate(joinedAt?: string): string {
//   if (!joinedAt) {
//     return "Not available";
//   }

//   const joinedDate = new Date(joinedAt);

//   if (Number.isNaN(joinedDate.getTime())) {
//     return "Not available";
//   }

//   return new Intl.DateTimeFormat("en", {
//     month: "long",
//     year: "numeric",
//   }).format(joinedDate);
// }

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

import type {
  AllocatProfile,
} from "@/Types/allocatProfile";

import type {
  Project,
} from "@/Types/project";

import {
  avatarFallback,
} from "@/utils/avatarFallback";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Button,
} from "@/components/ui/button";

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

type Props = {
  allocat: AllocatProfile;
  project?: Project;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  invited: boolean;
  inviting: boolean;

  onInvite: () => void;
};

/* =========================================================
   DIALOG
========================================================= */

export default function AllocatProfileDialog({
  allocat,
  project,
  open,
  onOpenChange,
  invited,
  inviting,
  onInvite,
}: Props) {
  const rating =
    allocat.rating ?? 0;

  const completedProjects =
    allocat.completedProjects ?? 0;

  const yearsExperience =
    allocat.yearsExperience ?? 0;

  const hasSkills =
    Boolean(
      allocat.skills?.length,
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(
        nextOpen,
      ) => {
        if (!inviting) {
          onOpenChange(
            nextOpen,
          );
        }
      }}
    >
      <DialogContent
        className={[
          "flex max-h-[92vh] flex-col overflow-hidden",
          "border-border bg-background p-0 text-foreground",
          "shadow-2xl shadow-black/[0.08]",
          "dark:shadow-black/35",
          "sm:max-w-2xl sm:rounded-[1.5rem]",
        ].join(" ")}
      >
        {/* =================================================
            HERO
        ================================================= */}

        <DialogHeader
          className={[
            "relative shrink-0 overflow-hidden",
            "border-b border-border",
            "px-6 pb-7 pt-7 text-left sm:px-8 sm:pt-8",
          ].join(" ")}
        >
          {/* Quiet character */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-primary/[0.08] blur-3xl" />

            <div className="absolute right-12 top-10 h-24 w-24 rounded-full border border-primary/10" />

            <div className="absolute right-20 top-[4.8rem] h-10 w-10 rounded-full border border-primary/10" />
          </div>

          <div className="relative">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Avatar */}

              <div className="relative shrink-0">
                <Avatar className="h-[76px] w-[76px] border-2 border-background ring-1 ring-border">
                  <AvatarImage
                    src={
                      allocat.avatarUrl
                    }
                    alt={
                      allocat.fullName
                        ? `${allocat.fullName}'s profile`
                        : "Allocat profile"
                    }
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-primary/[0.09] text-lg font-black text-primary">
                    {avatarFallback(
                      allocat,
                    )}
                  </AvatarFallback>
                </Avatar>

                {allocat.isVerified && (
                  <span
                    className={[
                      "absolute -bottom-1 -right-1",
                      "flex h-7 w-7 items-center justify-center",
                      "rounded-full border-2 border-background",
                      "bg-emerald-500 text-white",
                    ].join(" ")}
                    title="Verified professional"
                  >
                    <BadgeCheckIcon
                      size={14}
                    />
                  </span>
                )}
              </div>

              {/* Identity */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="min-w-0 truncate text-2xl font-black tracking-[-0.035em] sm:text-[2rem]">
                    {allocat.fullName ||
                      "Allocat professional"}
                  </DialogTitle>
                </div>

                <DialogDescription className="mt-1.5 text-sm font-medium text-muted-foreground">
                  {allocat.title ||
                    "Professional service provider"}
                </DialogDescription>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {allocat.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon
                        size={13}
                      />

                      {
                        allocat.location
                      }
                    </span>
                  )}

                  {yearsExperience >
                    0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusinessIcon
                        size={13}
                      />

                      {
                        yearsExperience
                      }{" "}
                      {yearsExperience ===
                      1
                        ? "year"
                        : "years"}{" "}
                      experience
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ===============================================
                HERO STATS
            =============================================== */}

            <div
              className={[
                "mt-7 grid overflow-hidden rounded-xl",
                "border border-border bg-card/60",
                "grid-cols-2 sm:grid-cols-4",
              ].join(" ")}
            >
              <HeroMetric
                label="Rating"
                value={
                  rating > 0
                    ? rating.toFixed(
                        1,
                      )
                    : "New"
                }
                icon={
                  StarIcon
                }
              />

              <HeroMetric
                label="Projects"
                value={
                  completedProjects.toString()
                }
                icon={
                  CheckCircle2Icon
                }
                divided
              />

              <HeroMetric
                label="Rate"
                value={`US$${
                  allocat.hourlyRate ??
                  0
                }`}
                sub="/hour"
                divided
              />

              <HeroMetric
                label="Match"
                value={
                  allocat.matchScore !==
                  undefined
                    ? `${allocat.matchScore}%`
                    : "—"
                }
                icon={
                  SparklesIcon
                }
                accent
                divided
              />
            </div>
          </div>
        </DialogHeader>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8">
          {/* About */}

          <ProfileSection
            eyebrow="About"
            title="A little about this Allocat"
          >
            <p className="max-w-xl whitespace-pre-line text-sm leading-7 text-foreground/80">
              {allocat.bio ||
                "This Allocat has not added a profile description yet."}
            </p>
          </ProfileSection>

          {/* Skills */}

          <ProfileSection
            eyebrow="Skills"
            title="What they work with"
          >
            {hasSkills ? (
              <div className="flex flex-wrap gap-2">
                {allocat.skills?.map(
                  (
                    skill,
                    index,
                  ) => (
                    <span
                      key={
                        skill
                      }
                      className={[
                        "inline-flex items-center rounded-lg",
                        "border px-3 py-1.5",
                        "text-[0.7rem] font-semibold",
                        "transition-colors",

                        index ===
                        0
                          ? [
                              "border-primary/20",
                              "bg-primary/[0.07]",
                              "text-primary",
                            ].join(
                              " ",
                            )
                          : [
                              "border-border",
                              "bg-muted/30",
                              "text-foreground/80",
                            ].join(
                              " ",
                            ),
                      ].join(
                        " ",
                      )}
                    >
                      {
                        skill
                      }
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills have
                been listed yet.
              </p>
            )}
          </ProfileSection>

          {/* Details */}

          <ProfileSection
            eyebrow="Profile"
            title="Working details"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile
                icon={
                  BriefcaseBusinessIcon
                }
                label="Experience"
                value={
                  yearsExperience >
                  0
                    ? `${yearsExperience} ${
                        yearsExperience ===
                        1
                          ? "year"
                          : "years"
                      }`
                    : "Not listed"
                }
              />

              <InfoTile
                icon={
                  CalendarDaysIcon
                }
                label="Member since"
                value={formatJoinedDate(
                  allocat.joinedAt,
                )}
              />

              <InfoTile
                icon={
                  CheckCircle2Icon
                }
                label="Completed work"
                value={`${completedProjects} ${
                  completedProjects ===
                  1
                    ? "project"
                    : "projects"
                }`}
              />

              <InfoTile
                icon={
                  Clock3Icon
                }
                label="Availability"
                value={
                  allocat.availability ||
                  "Contact to confirm"
                }
              />
            </div>
          </ProfileSection>

          {/* ===============================================
              RATE / MATCH FEATURE STRIP
          =============================================== */}

          <section className="pb-7 pt-1">
            <div
              className={[
                "relative overflow-hidden rounded-xl",
                "border border-border",
                "bg-foreground/[0.035] p-5",
                "dark:bg-card",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute -right-14 -top-20 h-44 w-44 rounded-full bg-primary/[0.07] blur-3xl" />

              <div className="relative grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Working rate
                  </p>

                  <p className="mt-2 text-2xl font-black tracking-[-0.035em]">
                    US$
                    {allocat.hourlyRate ??
                      0}

                    <span className="ml-1 text-xs font-medium text-muted-foreground">
                      /hour
                    </span>
                  </p>

                  <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
                    Final scope,
                    availability and
                    terms can be
                    confirmed directly
                    after invitation.
                  </p>
                </div>

                {allocat.matchScore !==
                  undefined && (
                  <div className="sm:border-l sm:border-border sm:pl-6">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Match
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-primary">
                      {
                        allocat.matchScore
                      }
                      %
                    </p>

                    <p className="mt-1 text-[0.68rem] text-muted-foreground">
                      for this project
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
            "shrink-0 border-t border-border",
            "bg-muted/[0.18]",
            "px-6 py-5 sm:px-8",
          ].join(" ")}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold">
                Looks like a
                good fit?
              </p>

              <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                Invite{" "}
                {allocat.fullName ||
                  "this Allocat"}{" "}
                to{" "}
                {project?.title ||
                  "your project"}.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={
                  inviting
                }
                onClick={() =>
                  onOpenChange(
                    false,
                  )
                }
                className="h-10 rounded-lg px-4 text-xs text-muted-foreground shadow-none"
              >
                Close
              </Button>

              <Button
                type="button"
                onClick={
                  onInvite
                }
                disabled={
                  !project ||
                  inviting ||
                  invited
                }
                className="h-10 rounded-lg px-5 text-xs shadow-none"
              >
                {inviting ? (
                  <>
                    <LoaderCircleIcon
                      size={
                        14
                      }
                      className="animate-spin"
                    />

                    Sending
                  </>
                ) : invited ? (
                  <>
                    <CheckCircle2Icon
                      size={
                        14
                      }
                    />

                    Invited
                  </>
                ) : (
                  <>
                    <SendIcon
                      size={
                        14
                      }
                    />

                    Invite to project
                  </>
                )}
              </Button>
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
}: {
  eyebrow: string;
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="border-b border-border py-7 last:border-b-0">
      <div className="mb-4">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-primary">
          {eyebrow}
        </p>

        <h3 className="mt-1.5 text-sm font-black tracking-[-0.015em]">
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
  divided = false,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;

  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  divided?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "min-w-0 px-4 py-4",

        divided
          ? "border-l border-border"
          : "",

        accent
          ? "bg-primary/[0.035]"
          : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {Icon && (
          <Icon
            size={12}
            className={
              accent
                ? "text-primary"
                : ""
            }
          />
        )}

        <p className="text-[0.57rem] font-semibold uppercase tracking-[0.13em]">
          {label}
        </p>
      </div>

      <p
        className={[
          "mt-1.5 truncate text-sm font-black tracking-[-0.02em]",

          accent
            ? "text-primary"
            : "",
        ].join(" ")}
      >
        {value}

        {sub && (
          <span className="ml-1 text-[0.62rem] font-medium text-muted-foreground">
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
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  label: string;
  value: string;
}) {
  return (
    <article
      className={[
        "group flex items-start gap-3",
        "rounded-xl border border-border",
        "bg-card/50 p-4",
        "transition-colors",
        "hover:bg-muted/20",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center",
          "rounded-lg bg-primary/[0.07] text-primary",
        ].join(" ")}
      >
        <Icon
          size={16}
        />
      </span>

      <div className="min-w-0">
        <p className="text-[0.61rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-1.5 break-words text-sm font-semibold">
          {value}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatJoinedDate(
  joinedAt?: string,
): string {
  if (!joinedAt) {
    return "Not available";
  }

  const joinedDate =
    new Date(
      joinedAt,
    );

  if (
    Number.isNaN(
      joinedDate.getTime(),
    )
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month:
        "long",

      year:
        "numeric",
    },
  ).format(
    joinedDate,
  );
}