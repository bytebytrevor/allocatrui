// // import {
// //   ArrowLeftIcon,
// //   FolderPlusIcon,
// //   InfoIcon,
// // } from "lucide-react";

// // import {
// //   motion,
// // } from "framer-motion";

// // import {
// //   useNavigate,
// // } from "react-router-dom";

// // import NewProjectForm from "@/components/NewProjectForm";
// // import MinimalNavMenu from "@/components/MinimalNavMenu";

// // import {
// //   Button,
// // } from "@/components/ui/button";

// // function CreateProject() {
// //   const navigate =
// //     useNavigate();

// //   return (
// //     <div className="min-h-screen bg-background text-foreground">
// //       {/* =====================================================
// //           HEADER
// //       ===================================================== */}

// //       <header
// //         className={[
// //           "sticky top-0 z-40",
// //           "border-b border-border/60",
// //           "bg-background/90 backdrop-blur-xl",
// //         ].join(" ")}
// //       >
// //         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// //           <MinimalNavMenu />
// //         </div>
// //       </header>

// //       {/* =====================================================
// //           PAGE
// //       ===================================================== */}

// //       <main className="relative">
// //         <div
// //           className={[
// //             "mx-auto w-full max-w-5xl",
// //             "px-4 py-7",
// //             "sm:px-6 sm:py-10",
// //             "lg:px-8 lg:py-12",
// //           ].join(" ")}
// //         >
// //           {/* =================================================
// //               BACK
// //           ================================================= */}

// //           {/* <Button
// //             type="button"
// //             variant="ghost"
// //             onClick={() =>
// //               navigate(-1)
// //             }
// //             className={[
// //               "-ml-3 h-9 rounded-lg px-3",
// //               "text-xs font-medium text-muted-foreground",
// //               "shadow-none",
// //               "hover:text-foreground",
// //             ].join(" ")}
// //           >
// //             <ArrowLeftIcon
// //               size={14}
// //             />

// //             Back
// //           </Button> */}

// //           {/* =================================================
// //               PAGE INTRO
// //           ================================================= */}

// //           <motion.header
// //             className="mt-8 max-w-3xl"
// //             initial={{
// //               opacity: 0,
// //               y: 16,
// //             }}
// //             animate={{
// //               opacity: 1,
// //               y: 0,
// //             }}
// //             transition={{
// //               duration: 0.5,
// //               ease: "easeOut",
// //             }}
// //           >
// //             <div className="flex items-center gap-2 text-primary">
// //               <FolderPlusIcon
// //                 size={16}
// //               />

// //               <p
// //                 className={[
// //                   "text-[0.62rem] font-semibold uppercase",
// //                   "tracking-[0.17em]",
// //                 ].join(" ")}
// //               >
// //                 New project
// //               </p>
// //             </div>

// //             <h1
// //               className={[
// //                 "mt-4",
// //                 "text-3xl font-black leading-[1.05]",
// //                 "tracking-[-0.035em]",
// //                 "sm:text-4xl",
// //               ].join(" ")}
// //             >
// //               Create a project.
// //             </h1>

// //             <p
// //               className={[
// //                 "mt-3 max-w-2xl",
// //                 "text-sm leading-7 text-muted-foreground",
// //                 "sm:text-base",
// //               ].join(" ")}
// //             >
// //               Add the core project details now.
// //               Tasks, collaborators and other
// //               workspace details can be added
// //               afterwards.
// //             </p>
// //           </motion.header>

// //           {/* =================================================
// //               SMALL HINT
// //           ================================================= */}

// //           <motion.div
// //             className={[
// //               "mt-7 flex max-w-3xl items-start gap-2.5",
// //               "border-l-2 border-primary/40",
// //               "pl-4",
// //             ].join(" ")}
// //             initial={{
// //               opacity: 0,
// //               y: 10,
// //             }}
// //             animate={{
// //               opacity: 1,
// //               y: 0,
// //             }}
// //             transition={{
// //               delay: 0.08,
// //               duration: 0.45,
// //             }}
// //           >
// //             <InfoIcon
// //               size={14}
// //               className="mt-1 shrink-0 text-muted-foreground"
// //             />

// //             <p className="text-xs leading-6 text-muted-foreground">
// //               A clear title, category and brief
// //               are enough to get started. You can
// //               refine the project as the work
// //               develops.
// //             </p>
// //           </motion.div>

// //           {/* =================================================
// //               FORM
// //           ================================================= */}

// //           <motion.section
// //             className="mt-9 min-w-0"
// //             initial={{
// //               opacity: 0,
// //               y: 20,
// //             }}
// //             animate={{
// //               opacity: 1,
// //               y: 0,
// //             }}
// //             transition={{
// //               delay: 0.1,
// //               duration: 0.55,
// //               ease: "easeOut",
// //             }}
// //           >
// //             <div
// //               className={[
// //                 "overflow-hidden",
// //                 "rounded-[1.5rem]",
// //                 "border border-border/80",
// //                 "bg-background",
// //               ].join(" ")}
// //             >
// //               {/* Form heading */}

// //               <div
// //                 className={[
// //                   "flex items-center justify-between gap-5",
// //                   "border-b border-border/70",
// //                   "px-5 py-5",
// //                   "sm:px-7",
// //                   "lg:px-9",
// //                 ].join(" ")}
// //               >
// //                 <div>
// //                   <h2 className="text-sm font-bold sm:text-base">
// //                     Project details
// //                   </h2>

// //                   <p className="mt-1 text-xs text-muted-foreground">
// //                     Complete the three steps below.
// //                   </p>
// //                 </div>

// //                 <span
// //                   className={[
// //                     "hidden text-[0.62rem] font-semibold uppercase",
// //                     "tracking-[0.14em] text-muted-foreground",
// //                     "sm:block",
// //                   ].join(" ")}
// //                 >
// //                   Takes a few minutes
// //                 </span>
// //               </div>

// //               {/* Form body */}

// //               <div
// //                 className={[
// //                   "px-5 py-6",
// //                   "sm:px-7 sm:py-8",
// //                   "lg:px-9 lg:py-9",
// //                 ].join(" ")}
// //               >
// //                 <NewProjectForm />
// //               </div>
// //             </div>
// //           </motion.section>

// //           {/* =================================================
// //               FOOTER HINT
// //           ================================================= */}

// //           <div
// //             className={[
// //               "mt-4 flex items-center justify-between gap-5",
// //               "px-1 text-[0.68rem] text-muted-foreground",
// //             ].join(" ")}
// //           >
// //             <p>
// //               Nothing here is permanent. Project
// //               details can be updated later.
// //             </p>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // export default CreateProject;

// import {
//   FolderPlusIcon,
//   InfoIcon,
// } from "lucide-react";

// import {
//   motion,
// } from "framer-motion";

// import NewProjectForm from "@/components/NewProjectForm";
// import MinimalNavMenu from "@/components/MinimalNavMenu";

// /* =========================================================
//    CREATE PROJECT
// ========================================================= */

// function CreateProject() {
//   return (
//     <div className="min-h-screen bg-background text-foreground">

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <header
//         className={[
//           "sticky top-0 z-40",
//           "border-b border-border/60",
//           "bg-background/90 backdrop-blur-xl",
//         ].join(" ")}
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <MinimalNavMenu />
//         </div>
//       </header>

//       {/* =====================================================
//           PAGE
//       ===================================================== */}

//       <main className="relative">
//         <div
//           className={[
//             "mx-auto w-full max-w-5xl",
//             "px-4 py-7",
//             "sm:px-6 sm:py-10",
//             "lg:px-8 lg:py-12",
//           ].join(" ")}
//         >

//           {/* =================================================
//               PAGE INTRO
//           ================================================= */}

//           <motion.header
//             className="max-w-3xl"
//             initial={{
//               opacity: 0,
//               y: 16,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               duration: 0.5,
//               ease: "easeOut",
//             }}
//           >
//             <div className="flex items-center gap-2 text-primary">
//               <FolderPlusIcon
//                 size={16}
//               />

//               <p
//                 className={[
//                   "text-[0.62rem] font-semibold uppercase",
//                   "tracking-[0.17em]",
//                 ].join(" ")}
//               >
//                 New project
//               </p>
//             </div>

//             <h1
//               className={[
//                 "mt-4",
//                 "text-3xl font-black leading-[1.05]",
//                 "tracking-[-0.035em]",
//                 "sm:text-4xl",
//               ].join(" ")}
//             >
//               Create a project.
//             </h1>

//             <p
//               className={[
//                 "mt-3 max-w-2xl",
//                 "text-sm leading-7 text-muted-foreground",
//                 "sm:text-base",
//               ].join(" ")}
//             >
//               Add the core project details now. Tasks, collaborators and
//               other workspace details can be added afterwards.
//             </p>
//           </motion.header>

//           {/* =================================================
//               SMALL HINT
//           ================================================= */}

//           <motion.div
//             className={[
//               "mt-7 flex max-w-3xl items-start gap-2.5",
//               "border-l-2 border-primary/40",
//               "pl-4",
//             ].join(" ")}
//             initial={{
//               opacity: 0,
//               y: 10,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               delay: 0.08,
//               duration: 0.45,
//             }}
//           >
//             <InfoIcon
//               size={14}
//               className="mt-1 shrink-0 text-muted-foreground"
//             />

//             <p className="text-xs leading-6 text-muted-foreground">
//               A clear title, category and brief are enough to get started.
//               You can refine the project as the work develops.
//             </p>
//           </motion.div>

//           {/* =================================================
//               FORM
//           ================================================= */}

//           <motion.section
//             className="mt-12 min-w-0"
//             initial={{
//               opacity: 0,
//               y: 20,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               delay: 0.1,
//               duration: 0.55,
//               ease: "easeOut",
//             }}
//           >

//             {/* ===============================================
//                 FORM INTRO
//             =============================================== */}

//             <div
//               className={[
//                 "flex items-end justify-between gap-5",
//                 "mb-8",
//               ].join(" ")}
//             >
//               <div>
//                 <h2 className="text-base font-bold sm:text-lg">
//                   Project details
//                 </h2>

//                 <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
//                   Complete the three steps below.
//                 </p>
//               </div>

//               <span
//                 className={[
//                   "hidden shrink-0",
//                   "text-[0.62rem] font-semibold uppercase",
//                   "tracking-[0.14em] text-muted-foreground",
//                   "sm:block",
//                 ].join(" ")}
//               >
//                 Takes a few minutes
//               </span>
//             </div>

//             {/* ===============================================
//                 FORM BODY
//             =============================================== */}

//             <div className="min-w-0">
//               <NewProjectForm />
//             </div>
//           </motion.section>

//           {/* =================================================
//               FOOTER HINT
//           ================================================= */}

//           <div
//             className={[
//               "mt-8",
//               "text-[0.68rem] text-muted-foreground",
//             ].join(" ")}
//           >
//             <p>
//               Nothing here is permanent. Project details can be updated
//               later.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CreateProject;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  BadgeCheckIcon,
  FolderPlusIcon,
  InfoIcon,
  LoaderCircleIcon,
  MapPinIcon,
  StarIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";

import { motion } from "framer-motion";

import api from "@/api/axios";

import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

/* =========================================================
   TYPES
========================================================= */

type SelectedAllocat = {
  allocatrUserId: string;
  fullName: string;
  avatarUrl?: string | null;
  title?: string | null;
  headline?: string | null;
  location?: string | null;
  hourlyRate?: number | null;
  currency?: string | null;
  averageRating?: number;
  rating?: number;
  ratingCount?: number;
  completedProjects?: number;
  isVerified?: boolean;
  verified?: boolean;
};

/* =========================================================
   CREATE PROJECT
========================================================= */

function CreateProject() {
  const [searchParams, setSearchParams] = useSearchParams();

  const allocatId = searchParams.get("allocat");

  const [selectedAllocat, setSelectedAllocat] =
    useState<SelectedAllocat | null>(null);

  const [loadingAllocat, setLoadingAllocat] =
    useState(Boolean(allocatId));

  const [allocatError, setAllocatError] =
    useState<string | null>(null);

  /* =======================================================
     LOAD SELECTED ALLOCAT
  ======================================================= */

  useEffect(() => {
    if (!allocatId) {
      setSelectedAllocat(null);
      setAllocatError(null);
      setLoadingAllocat(false);
      return;
    }

    let cancelled = false;

    async function loadSelectedAllocat() {
      setLoadingAllocat(true);
      setAllocatError(null);

      try {
        const response = await api.get<SelectedAllocat>(
          `/allocats/profiles/${allocatId}`,
        );

        if (cancelled) return;

        setSelectedAllocat(response.data);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Could not load selected Allocat:",
          error,
        );

        setSelectedAllocat(null);

        setAllocatError(
          "This Allocat profile is no longer available. Remove the selection to continue creating your project.",
        );
      } finally {
        if (!cancelled) {
          setLoadingAllocat(false);
        }
      }
    }

    void loadSelectedAllocat();

    return () => {
      cancelled = true;
    };
  }, [allocatId]);

  /* =======================================================
     REMOVE SELECTED ALLOCAT
  ======================================================= */

  function removeSelectedAllocat() {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("allocat");

    setSearchParams(nextParams, {
      replace: true,
    });
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={[
          "sticky top-0 z-40",
          "border-b border-border/60",
          "bg-background/90 backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main className="relative">
        <div
          className={[
            "mx-auto w-full max-w-5xl",
            "px-4 py-7",
            "sm:px-6 sm:py-10",
            "lg:px-8 lg:py-12",
          ].join(" ")}
        >

          {/* =================================================
              PAGE INTRO
          ================================================= */}

          <motion.header
            className="max-w-3xl"
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <div className="flex items-center gap-2 text-primary">
              <FolderPlusIcon size={16} />

              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em]">
                New project
              </p>
            </div>

            <h1
              className={[
                "mt-4",
                "text-3xl font-black leading-[1.05]",
                "tracking-[-0.035em]",
                "sm:text-4xl",
              ].join(" ")}
            >
              {selectedAllocat
                ? `Start a project with ${selectedAllocat.fullName}.`
                : "Create a project."}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {selectedAllocat
                ? "Add the project details below. Once the project is created, we’ll send this Allocat an invitation to join it."
                : "Add the core project details now. Tasks, collaborators and other workspace details can be added afterwards."}
            </p>
          </motion.header>

          {/* =================================================
              SELECTED ALLOCAT
          ================================================= */}

          {allocatId && (
            <motion.section
              className="mt-7 max-w-3xl"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.05,
                duration: 0.45,
              }}
            >
              {loadingAllocat ? (
                <SelectedAllocatLoading />
              ) : selectedAllocat ? (
                <SelectedAllocatCard
                  allocat={selectedAllocat}
                  onRemove={removeSelectedAllocat}
                />
              ) : allocatError ? (
                <SelectedAllocatError
                  message={allocatError}
                  onRemove={removeSelectedAllocat}
                />
              ) : null}
            </motion.section>
          )}

          {/* =================================================
              SMALL HINT
          ================================================= */}

          {!allocatError && (
            <motion.div
              className={[
                "mt-7 flex max-w-3xl items-start gap-2.5",
                "border-l-2 border-primary/40",
                "pl-4",
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
                delay: 0.08,
                duration: 0.45,
              }}
            >
              <InfoIcon
                size={14}
                className="mt-1 shrink-0 text-muted-foreground"
              />

              <p className="text-xs leading-6 text-muted-foreground">
                {selectedAllocat
                  ? "The Allocat will only be invited after the project has been created. They can still accept or decline the invitation."
                  : "A clear title, category and brief are enough to get started. You can refine the project as the work develops."}
              </p>
            </motion.div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          {!loadingAllocat && !allocatError && (
            <motion.section
              className="mt-12 min-w-0"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.55,
                ease: "easeOut",
              }}
            >

              {/* FORM INTRO */}

              <div className="mb-8 flex items-end justify-between gap-5">
                <div>
                  <h2 className="text-base font-bold sm:text-lg">
                    Project details
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    Complete the three steps below.
                  </p>
                </div>

                <span className="hidden shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
                  Takes a few minutes
                </span>
              </div>

              {/* FORM BODY */}

              <div className="min-w-0">
                <NewProjectForm
                  selectedAllocatId={
                    selectedAllocat?.allocatrUserId ?? null
                  }
                  selectedAllocatName={
                    selectedAllocat?.fullName ?? null
                  }
                />
              </div>
            </motion.section>
          )}

          {/* =================================================
              FOOTER HINT
          ================================================= */}

          {!loadingAllocat && !allocatError && (
            <div className="mt-8 text-[0.68rem] text-muted-foreground">
              <p>
                Nothing here is permanent. Project details can be updated later.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SELECTED ALLOCAT CARD
========================================================= */

function SelectedAllocatCard({
  allocat,
  onRemove,
}: {
  allocat: SelectedAllocat;
  onRemove: () => void;
}) {
  const rating =
    allocat.averageRating ??
    allocat.rating ??
    0;

  const isVerified = Boolean(
    allocat.isVerified ??
    allocat.verified ??
    false,
  );

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-primary/20",
        "bg-primary/[0.035]",
        "p-4 sm:p-5",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/[0.07] blur-3xl" />

      <div className="relative flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 border border-border bg-muted sm:h-16 sm:w-16">
            {allocat.avatarUrl && (
              <AvatarImage
                src={allocat.avatarUrl}
                alt={`${allocat.fullName}'s profile`}
                className="object-cover"
              />
            )}

            <AvatarFallback className="bg-primary/[0.08] text-sm font-black text-primary">
              {getInitials(allocat.fullName)}
            </AvatarFallback>
          </Avatar>

          {isVerified && (
            <span
              className={[
                "absolute -bottom-1 -right-1",
                "flex h-5 w-5 items-center justify-center",
                "rounded-full border-2 border-background",
                "bg-primary text-secondary",
              ].join(" ")}
              title="Verified professional"
            >
              <BadgeCheckIcon size={10} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-primary">
            Starting this project with
          </p>

          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            <h2 className="truncate text-base font-black tracking-[-0.02em]">
              {allocat.fullName}
            </h2>

            {isVerified && (
              <BadgeCheckIcon
                size={14}
                className="shrink-0 text-primary"
              />
            )}
          </div>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {allocat.title ||
              allocat.headline ||
              "Professional service provider"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.68rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <StarIcon
                size={11}
                className={
                  rating > 0
                    ? "fill-current text-chart-2"
                    : "text-muted-foreground"
                }
              />

              {rating > 0
                ? rating.toFixed(1)
                : "New"}
            </span>

            {allocat.location && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPinIcon
                  size={11}
                  className="shrink-0"
                />

                <span className="truncate">
                  {allocat.location}
                </span>
              </span>
            )}

            {allocat.hourlyRate !== null &&
              allocat.hourlyRate !== undefined && (
                <span>
                  {allocat.currency || "USD"}{" "}
                  {allocat.hourlyRate}/hr
                </span>
              )}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          title="Remove selected Allocat"
          aria-label="Remove selected Allocat"
          onClick={onRemove}
          className="h-9 w-9 shrink-0 rounded-lg p-0 text-muted-foreground shadow-none hover:bg-background hover:text-foreground"
        >
          <XIcon size={14} />
        </Button>
      </div>
    </div>
  );
}

/* =========================================================
   SELECTED ALLOCAT LOADING
========================================================= */

function SelectedAllocatLoading() {
  return (
    <div className="flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-muted/[0.12] p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
        <LoaderCircleIcon
          size={19}
          className="animate-spin"
        />
      </span>

      <div>
        <p className="text-sm font-bold">
          Loading selected Allocat
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Getting their public profile before you continue.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SELECTED ALLOCAT ERROR
========================================================= */

function SelectedAllocatError({
  message,
  onRemove,
}: {
  message: string;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.035] p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <UserRoundIcon size={17} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">
            Selected Allocat unavailable
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {message}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
            className="mt-4 h-9 rounded-lg px-4 text-xs shadow-none"
          >
            <XIcon size={13} />
            Remove selection
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name?: string | null) {
  if (!name?.trim()) return "A";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

export default CreateProject;