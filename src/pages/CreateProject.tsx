import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  BadgeCheckIcon,
  FolderPlusIcon,
  LoaderCircleIcon,
  MapPinIcon,
  StarIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";

import { motion } from "framer-motion";

import api from "@/api/axios";

import MinimalNavMenu from "@/components/MinimalNavMenu";
import NewProjectForm from "@/components/NewProjectForm";

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

  const [selectedAllocat, setSelectedAllocat] = useState<SelectedAllocat | null>(null);
  const [loadingAllocat, setLoadingAllocat] = useState(Boolean(allocatId));
  const [allocatError, setAllocatError] = useState<string | null>(null);

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

        console.error("Could not load selected Allocat:", error);

        setSelectedAllocat(null);

        setAllocatError(
          "This Allocat profile is no longer available. Remove the selection to continue creating your project.",
        );
      } finally {
        if (!cancelled) setLoadingAllocat(false);
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

    setSearchParams(nextParams, { replace: true });
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F3F5F2] text-[#30383A] dark:bg-[#08171C] dark:text-white">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className={[
          "sticky top-0 z-40 border-b backdrop-blur-xl",
          "border-[#0D566D]/[0.055] bg-[#F8FAF8]/95",
          "dark:border-white/[0.055] dark:bg-[#08171C]/95",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      {/* ===================================================
          PAGE
      =================================================== */}

      <main>
        <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          {/* =================================================
              INTRO
          ================================================= */}

          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    "bg-[#DCE8E4] text-[#0D566D]",
                    "dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
                  ].join(" ")}
                >
                  <FolderPlusIcon size={15} />
                </span>

                <p className="text-[0.57rem] font-semibold uppercase tracking-[0.17em] text-[#0D566D] dark:text-[#DEDA00]">
                  New project
                </p>
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-4xl">
                {selectedAllocat
                  ? `Start a project with ${selectedAllocat.fullName}.`
                  : "Create a project."}
              </h1>

              <p className="mt-2.5 max-w-xl text-sm leading-6 text-[#718084] sm:text-[0.93rem] dark:text-[#94A3B8]">
                {selectedAllocat
                  ? "Define the work, set the timeline and send an invitation once the project is ready."
                  : "Add the essential project details now. You can refine the workspace as the work develops."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 pb-0.5 text-[0.62rem] font-medium text-[#718084] dark:text-[#94A3B8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D566D] dark:bg-[#DEDA00]" />
              3 steps
              <span className="text-[#A0AAAC] dark:text-white/20">·</span>
              A few minutes
            </div>
          </motion.header>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="mt-6 h-px bg-[#0D566D]/[0.07] dark:bg-white/[0.055]" />

          {/* =================================================
              SELECTED ALLOCAT
          ================================================= */}

          {allocatId && (
            <motion.section
              className="mt-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.35 }}
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
              FORM
          ================================================= */}

          {!loadingAllocat && !allocatError && (
            <motion.section
              className={allocatId ? "mt-5 min-w-0" : "mt-6 min-w-0"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.4, ease: "easeOut" }}
            >
              <NewProjectForm
                selectedAllocatId={selectedAllocat?.allocatrUserId ?? null}
                selectedAllocatName={selectedAllocat?.fullName ?? null}
              />
            </motion.section>
          )}

          {/* =================================================
              FOOTER NOTE
          ================================================= */}

          {!loadingAllocat && !allocatError && (
            <p className="mt-4 px-1 text-[0.64rem] leading-5 text-[#7A878A] dark:text-[#7F9198]">
              Project details can be edited later from the project workspace.
            </p>
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
  const rating = allocat.averageRating ?? allocat.rating ?? 0;

  const isVerified = Boolean(
    allocat.isVerified ??
      allocat.verified ??
      false,
  );

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border px-4 py-3.5 sm:px-5",
        "border-[#0D566D]/[0.085] bg-[#EDF4F2]",
        "dark:border-white/[0.065] dark:bg-[#10262D]",
      ].join(" ")}
    >
      <span className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#0D566D]/[0.05] blur-3xl dark:bg-[#DEDA00]/[0.02]" />

      <div className="relative flex items-center gap-3.5">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 border border-[#0D566D]/10 bg-[#DDE9E6] dark:border-white/[0.07] dark:bg-[#0C1D22]">
            {allocat.avatarUrl && (
              <AvatarImage
                src={allocat.avatarUrl}
                alt={`${allocat.fullName}'s profile`}
                className="object-cover"
              />
            )}

            <AvatarFallback className="bg-[#DDE9E6] text-xs font-semibold text-[#0D566D] dark:bg-[#0C1D22] dark:text-[#DEDA00]">
              {getInitials(allocat.fullName)}
            </AvatarFallback>
          </Avatar>

          {isVerified && (
            <span
              className={[
                "absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2",
                "border-[#EDF4F2] bg-[#0D566D] text-white",
                "dark:border-[#10262D] dark:bg-[#DEDA00] dark:text-[#303030]",
              ].join(" ")}
              title="Verified professional"
            >
              <BadgeCheckIcon size={9} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="truncate text-sm font-semibold tracking-[-0.015em]">
              {allocat.fullName}
            </h2>

            {isVerified && (
              <BadgeCheckIcon
                size={12}
                className="shrink-0 text-[#0D566D] dark:text-[#DEDA00]"
              />
            )}
          </div>

          <p className="mt-0.5 truncate text-[0.66rem] text-[#6E7D80] dark:text-[#94A3B8]">
            {allocat.title ||
              allocat.headline ||
              "Professional service provider"}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.61rem] text-[#718084] dark:text-[#94A3B8]">
            <span className="inline-flex items-center gap-1">
              <StarIcon
                size={10}
                className={
                  rating > 0
                    ? "fill-current text-[#B98645] dark:text-[#DEDA00]"
                    : ""
                }
              />

              {rating > 0 ? rating.toFixed(1) : "New"}
            </span>

            {allocat.location && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPinIcon size={10} className="shrink-0" />
                <span className="truncate">{allocat.location}</span>
              </span>
            )}

            {allocat.hourlyRate !== null &&
              allocat.hourlyRate !== undefined && (
                <span>
                  {allocat.currency || "USD"} {allocat.hourlyRate}/hr
                </span>
              )}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="text-[0.57rem] font-semibold uppercase tracking-[0.13em] text-[#0D566D] dark:text-[#DEDA00]">
            Selected Allocat
          </span>

          <span className="h-1 w-1 rounded-full bg-[#0D566D]/30 dark:bg-[#DEDA00]/35" />
        </div>

        <Button
          type="button"
          variant="ghost"
          title="Remove selected Allocat"
          aria-label="Remove selected Allocat"
          onClick={onRemove}
          className={[
            "h-8 w-8 shrink-0 rounded-lg p-0 shadow-none",
            "text-[#718084] hover:bg-[#DCE8E4] hover:text-[#0D566D]",
            "dark:text-[#94A3B8] dark:hover:bg-white/[0.05] dark:hover:text-white",
          ].join(" ")}
        >
          <XIcon size={13} />
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
    <div className="flex min-h-[76px] items-center gap-3.5 rounded-xl border border-[#0D566D]/[0.08] bg-[#EDF4F2] px-4 py-3.5 dark:border-white/[0.065] dark:bg-[#10262D]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DCE8E4] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
        <LoaderCircleIcon size={17} className="animate-spin" />
      </span>

      <div>
        <p className="text-xs font-semibold">
          Loading selected Allocat
        </p>

        <p className="mt-0.5 text-[0.64rem] text-[#718084] dark:text-[#94A3B8]">
          Getting their public profile.
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
    <div className="rounded-xl border border-[#AD3A12]/15 bg-[#AD3A12]/[0.035] p-4 dark:border-[#AD3A12]/20 dark:bg-[#AD3A12]/[0.055]">
      <div className="flex items-start gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#AD3A12]/10 text-[#9F3C1A] dark:text-[#D27857]">
          <UserRoundIcon size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">
            Selected Allocat unavailable
          </p>

          <p className="mt-1 max-w-2xl text-[0.65rem] leading-5 text-[#718084] dark:text-[#94A3B8]">
            {message}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          title="Remove selected Allocat"
          aria-label="Remove selected Allocat"
          className="h-8 w-8 shrink-0 rounded-lg p-0 text-[#9F3C1A] shadow-none hover:bg-[#AD3A12]/[0.06] dark:text-[#D27857]"
        >
          <XIcon size={13} />
        </Button>
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