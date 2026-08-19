// import { useState } from "react";
// import {
//   BadgeCheckIcon,
//   BriefcaseBusinessIcon,
//   CalendarDaysIcon,
//   CheckCircle2Icon,
//   LoaderCircleIcon,
//   MapPinIcon,
//   StarIcon,
//   UserRoundIcon,
// } from "lucide-react";
// import { toast } from "sonner";

// import api from "@/api/axios";
// import type { Project } from "@/Types/project";
// import type { AllocatProfile } from "@/Types/allocatProfile";
// import type { ProjectAllocatStatus } from "@/Types/enums";

// import { avatarFallback } from "@/utils/avatarFallback";

// import AllocatProfileDialog from "@/components/AllocatProfileDialog";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// type Props = {
//   allocat: AllocatProfile;
//   project?: Project;

//   relationshipStatus:
//     | ProjectAllocatStatus
//     | null;

//   onStatusChange?: (
//     status: ProjectAllocatStatus,
//   ) => void;
// };

// export function AllocatCardGrid({
//   allocat,
//   project,
//   relationshipStatus,
//   onStatusChange,
// }: Props) {
//   const [profileOpen, setProfileOpen] =
//     useState(false);

//   const [inviting, setInviting] =
//     useState(false);

//   const rating = allocat.rating ?? 0;

//   const completedProjects =
//     allocat.completedProjects ?? 0;

//   const yearsExperience =
//     allocat.yearsExperience ?? 0;

//   const isInvited =
//     relationshipStatus === "Invited";

//   const isAccepted =
//     relationshipStatus === "Accepted";

//   async function handleInvite() {
//     if (
//       !project ||
//       inviting ||
//       isInvited ||
//       isAccepted
//     ) {
//       return;
//     }

//     setInviting(true);

//     try {
//       await api.put(
//         `/projects/${project.id}/allocats/${allocat.allocatrUserId}/invite`,
//         {},
//         {
//           withCredentials: true,
//         },
//       );

//       onStatusChange?.("Invited");

//       toast.success(
//         `${allocat.fullName} has been invited to ${project.title}.`,
//       );
//     } catch (error) {
//       console.error(
//         "Could not invite Allocat:",
//         error,
//       );

//       toast.error(
//         "The invitation could not be sent. Please try again.",
//       );
//     } finally {
//       setInviting(false);
//     }
//   }

//   return (
//     <>
//       <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-background p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-black/[0.04]">
//         {/* Identity */}
//         <div className="flex items-start gap-4">
//           <Avatar className="h-14 w-14 shrink-0 border border-border">
//             <AvatarImage
//               src={allocat.avatarUrl}
//               alt={
//                 allocat.fullName
//                   ? `${allocat.fullName}'s profile`
//                   : "Allocat profile"
//               }
//               className="object-cover"
//             />

//             <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
//               {avatarFallback(allocat)}
//             </AvatarFallback>
//           </Avatar>

//           <div className="min-w-0 flex-1">
//             <div className="flex items-start justify-between gap-3">
//               <div className="min-w-0">
//                 <h2 className="truncate text-sm font-bold">
//                   {allocat.fullName}
//                 </h2>

//                 <p className="mt-1 truncate text-xs text-muted-foreground">
//                   {allocat.title ||
//                     "Allocat professional"}
//                 </p>
//               </div>

//               {allocat.isVerified && (
//                 <span
//                   className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
//                   title="Verified professional"
//                 >
//                   <BadgeCheckIcon size={17} />
//                 </span>
//               )}
//             </div>

//             <div className="mt-3 flex flex-wrap items-center gap-2">
//               <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
//                 <StarIcon
//                   size={12}
//                   className="fill-current"
//                 />

//                 {rating > 0
//                   ? rating.toFixed(1)
//                   : "New"}
//               </span>

//               {yearsExperience > 0 && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
//                   <BriefcaseBusinessIcon
//                     size={12}
//                   />

//                   {yearsExperience}{" "}
//                   {yearsExperience === 1
//                     ? "year"
//                     : "years"}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Details */}
//         <div className="mt-5 space-y-3 text-xs text-muted-foreground">
//           <div className="flex items-center gap-2">
//             <MapPinIcon
//               size={15}
//               className="shrink-0"
//             />

//             <span className="truncate">
//               {allocat.location ||
//                 "Location not listed"}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             <CheckCircle2Icon
//               size={15}
//               className="shrink-0"
//             />

//             <span>
//               {completedProjects}{" "}
//               {completedProjects === 1
//                 ? "project completed"
//                 : "projects completed"}
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//             <CalendarDaysIcon
//               size={15}
//               className="shrink-0"
//             />

//             <span>
//               {formatJoinedDate(
//                 allocat.joinedAt,
//               )}
//             </span>
//           </div>
//         </div>

//         {/* Skills */}
//         {allocat.skills &&
//           allocat.skills.length > 0 && (
//             <div className="mt-5 flex flex-wrap gap-2">
//               {allocat.skills
//                 .slice(0, 3)
//                 .map((skill) => (
//                   <span
//                     key={skill}
//                     className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary"
//                   >
//                     {skill}
//                   </span>
//                 ))}

//               {allocat.skills.length > 3 && (
//                 <span className="rounded-full bg-muted px-2.5 py-1 text-[0.68rem] font-semibold text-muted-foreground">
//                   +
//                   {allocat.skills.length - 3}
//                 </span>
//               )}
//             </div>
//           )}

//         {/* Rate */}
//         <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
//           <div>
//             <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//               Hourly rate
//             </p>

//             <p className="mt-1 text-lg font-black tracking-[-0.02em]">
//               US${allocat.hourlyRate ?? 0}

//               <span className="ml-1 text-xs font-medium text-muted-foreground">
//                 /hour
//               </span>
//             </p>
//           </div>

//           {allocat.matchScore !==
//             undefined && (
//             <div className="text-right">
//               <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
//                 Match
//               </p>

//               <p className="mt-1 text-sm font-bold text-primary">
//                 {allocat.matchScore}%
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() =>
//               setProfileOpen(true)
//             }
//             className="h-11 rounded-full text-xs font-semibold shadow-none"
//           >
//             <UserRoundIcon size={15} />
//             View profile
//           </Button>

//           <Button
//             type="button"
//             onClick={() =>
//               void handleInvite()
//             }
//             disabled={
//               !project ||
//               inviting ||
//               isInvited ||
//               isAccepted
//             }
//             className="h-11 rounded-full text-xs font-semibold"
//           >
//             {inviting ? (
//               <>
//                 <LoaderCircleIcon
//                   size={15}
//                   className="animate-spin"
//                 />

//                 Inviting
//               </>
//             ) : isAccepted ? (
//               <>
//                 <CheckCircle2Icon
//                   size={15}
//                 />

//                 Added
//               </>
//             ) : isInvited ? (
//               <>
//                 <CheckCircle2Icon
//                   size={15}
//                 />

//                 Invited
//               </>
//             ) : (
//               "Invite"
//             )}
//           </Button>
//         </div>
//       </article>

//       <AllocatProfileDialog
//         allocat={allocat}
//         project={project}
//         open={profileOpen}
//         onOpenChange={setProfileOpen}
//         invited={isInvited}
//         inviting={inviting}
//         onInvite={() =>
//           void handleInvite()
//         }
//       />
//     </>
//   );
// }

// function formatJoinedDate(
//   joinedAt?: string,
// ): string {
//   if (!joinedAt) {
//     return "Join date unavailable";
//   }

//   const joinedDate =
//     new Date(joinedAt);

//   if (
//     Number.isNaN(
//       joinedDate.getTime(),
//     )
//   ) {
//     return "Join date unavailable";
//   }

//   const now = new Date();

//   const monthDifference =
//     (now.getFullYear() -
//       joinedDate.getFullYear()) *
//       12 +
//     now.getMonth() -
//     joinedDate.getMonth();

//   if (monthDifference < 1) {
//     return "Joined this month";
//   }

//   if (monthDifference < 12) {
//     return `Joined ${monthDifference} ${
//       monthDifference === 1
//         ? "month"
//         : "months"
//     } ago`;
//   }

//   const years = Math.floor(
//     monthDifference / 12,
//   );

//   return `Joined ${years} ${
//     years === 1
//       ? "year"
//       : "years"
//   } ago`;
// }


import { useState } from "react";
import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
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

import { avatarFallback } from "@/utils/avatarFallback";

import AllocatProfileDialog from "@/components/AllocatProfileDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Props = {
  allocat: AllocatProfile;
  project?: Project;

  relationshipStatus: ProjectAllocatStatus | null;

  onStatusChange?: (
    status: ProjectAllocatStatus,
  ) => void;
};

export function AllocatCardGrid({
  allocat,
  project,
  relationshipStatus,
  onStatusChange,
}: Props) {
  const [profileOpen, setProfileOpen] =
    useState(false);

  const [inviting, setInviting] =
    useState(false);

  const rating = allocat.rating ?? 0;

  const completedProjects =
    allocat.completedProjects ?? 0;

  const yearsExperience =
    allocat.yearsExperience ?? 0;

  const isInvited =
    relationshipStatus === "Invited";

  const isAccepted =
    relationshipStatus === "Accepted";

  const isDeclined =
    relationshipStatus === "Declined";

  const isRemoved =
    relationshipStatus === "Removed";

  const canInvite =
    !!project &&
    !inviting &&
    !isInvited &&
    !isAccepted;

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
      console.error(
        "Could not invite Allocat:",
        error,
      );

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

  return (
    <>
      <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-background p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-black/[0.04]">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 shrink-0 border border-border">
            <AvatarImage
              src={allocat.avatarUrl}
              alt={
                allocat.fullName
                  ? `${allocat.fullName}'s profile`
                  : "Allocat profile"
              }
              className="object-cover"
            />

            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
              {avatarFallback(allocat)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold">
                  {allocat.fullName}
                </h2>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {allocat.title ||
                    "Allocat professional"}
                </p>
              </div>

              {allocat.isVerified && (
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
                  title="Verified professional"
                >
                  <BadgeCheckIcon size={17} />
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <StarIcon
                  size={12}
                  className="fill-current"
                />

                {rating > 0
                  ? rating.toFixed(1)
                  : "New"}
              </span>

              {yearsExperience > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <BriefcaseBusinessIcon
                    size={12}
                  />

                  {yearsExperience}{" "}
                  {yearsExperience === 1
                    ? "year"
                    : "years"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPinIcon
              size={15}
              className="shrink-0"
            />

            <span className="truncate">
              {allocat.location ||
                "Location not listed"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2Icon
              size={15}
              className="shrink-0"
            />

            <span>
              {completedProjects}{" "}
              {completedProjects === 1
                ? "project completed"
                : "projects completed"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDaysIcon
              size={15}
              className="shrink-0"
            />

            <span>
              {formatJoinedDate(
                allocat.joinedAt,
              )}
            </span>
          </div>
        </div>

        {allocat.skills &&
          allocat.skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {allocat.skills
                .slice(0, 3)
                .map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold text-primary"
                  >
                    {skill}
                  </span>
                ))}

              {allocat.skills.length > 3 && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-[0.68rem] font-semibold text-muted-foreground">
                  +{allocat.skills.length - 3}
                </span>
              )}
            </div>
          )}

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Hourly rate
            </p>

            <p className="mt-1 text-lg font-black tracking-[-0.02em]">
              US${allocat.hourlyRate ?? 0}

              <span className="ml-1 text-xs font-medium text-muted-foreground">
                /hour
              </span>
            </p>
          </div>

          {allocat.matchScore !==
            undefined && (
            <div className="text-right">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Match
              </p>

              <p className="mt-1 text-sm font-bold text-primary">
                {allocat.matchScore}%
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setProfileOpen(true)
            }
            className="h-11 rounded-full text-xs font-semibold shadow-none"
          >
            <UserRoundIcon size={15} />
            View profile
          </Button>

          <Button
            type="button"
            onClick={() =>
              void handleInvite()
            }
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
            className="h-11 rounded-full text-xs font-semibold"
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
        onInvite={() =>
          void handleInvite()
        }
      />
    </>
  );
}

function formatJoinedDate(
  joinedAt?: string,
): string {
  if (!joinedAt) {
    return "Join date unavailable";
  }

  const joinedDate = new Date(joinedAt);

  if (Number.isNaN(joinedDate.getTime())) {
    return "Join date unavailable";
  }

  const now = new Date();

  const monthDifference =
    (now.getFullYear() -
      joinedDate.getFullYear()) *
      12 +
    now.getMonth() -
    joinedDate.getMonth();

  if (monthDifference < 1) {
    return "Joined this month";
  }

  if (monthDifference < 12) {
    return `Joined ${monthDifference} ${
      monthDifference === 1
        ? "month"
        : "months"
    } ago`;
  }

  const years = Math.floor(
    monthDifference / 12,
  );

  return `Joined ${years} ${
    years === 1
      ? "year"
      : "years"
  } ago`;
}