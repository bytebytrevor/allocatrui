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
import { MotionConfig, motion } from "framer-motion";
import api from "@/api/axios";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import NewProjectForm from "@/components/NewProjectForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
const createProjectIconSurface =
  "bg-surface-2 text-brand-secondary-highlight ring-1 ring-inset ring-border/45 dark:bg-secondary/[0.08] dark:text-secondary dark:ring-secondary/12";
const subtleCardSurface =
  "border-border/65 bg-surface-2/60 dark:border-border dark:bg-surface-1";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";

function CreateProject() {
  const [searchParams, setSearchParams] = useSearchParams();
  const allocatId = searchParams.get("allocat");
  const [selectedAllocat, setSelectedAllocat] =
    useState<SelectedAllocat | null>(null);
  const [loadingAllocat, setLoadingAllocat] = useState(Boolean(allocatId));
  const [allocatError, setAllocatError] = useState<string | null>(null);
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
  function removeSelectedAllocat() {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("allocat");
    setSearchParams(nextParams, { replace: true });
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl dark:border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <MinimalNavMenu />
          </div>
        </header>
        <main>
          <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
            <motion.header
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="min-w-0 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                      createProjectIconSurface
                    }
                  >
                    <FolderPlusIcon size={15} aria-hidden="true" />
                  </span>
                  <p className="text-[0.57rem] font-semibold uppercase tracking-[0.17em] text-brand-secondary-highlight dark:text-secondary/90">
                    New project
                  </p>
                </div>
                <h1 className="mt-4 text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-foreground/90 sm:text-4xl dark:text-foreground">
                  {selectedAllocat
                    ? `Start a project with ${selectedAllocat.fullName}.`
                    : "Create a project."}
                </h1>
                <p className="mt-2.5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[0.93rem]">
                  {selectedAllocat
                    ? "Define the work, set the timeline and send an invitation once the project is ready."
                    : "Add the essential project details now. You can refine the workspace as the work develops."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 pb-0.5 text-[0.62rem] font-medium text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight/75 dark:bg-secondary/80"
                />
                <span>3 steps</span>
                <span aria-hidden="true" className="text-muted-foreground/35">
                  ·
                </span>
                <span>A few minutes</span>
              </div>
            </motion.header>
            <div className="mt-6 h-px bg-border/60 dark:bg-border" />
            {allocatId && (
              <motion.section
                className="mt-5"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04, duration: 0.3 }}
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
            {!loadingAllocat && !allocatError && (
              <motion.section
                className={allocatId ? "mt-5 min-w-0" : "mt-6 min-w-0"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
              >
                <NewProjectForm
                  selectedAllocatId={selectedAllocat?.allocatrUserId ?? null}
                  selectedAllocatName={selectedAllocat?.fullName ?? null}
                />
              </motion.section>
            )}
            {!loadingAllocat && !allocatError && (
              <p className="mt-4 px-1 text-[0.64rem] leading-5 text-muted-foreground/75 dark:text-muted-foreground">
                Project details can be edited later from the project workspace.
              </p>
            )}
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
function SelectedAllocatCard({
  allocat,
  onRemove,
}: {
  allocat: SelectedAllocat;
  onRemove: () => void;
}) {
  const rating = allocat.averageRating ?? allocat.rating ?? 0;
  const isVerified = Boolean(allocat.isVerified ?? allocat.verified ?? false);
  return (
    <div
      className={
        "overflow-hidden rounded-xl border px-4 py-3.5 sm:px-5 " +
        subtleCardSurface
      }
    >
      <div className="flex items-center gap-3.5">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 border border-border/70 bg-surface-3 dark:border-border dark:bg-surface-2">
            {allocat.avatarUrl && (
              <AvatarImage
                src={allocat.avatarUrl}
                alt={`${allocat.fullName}'s profile`}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-surface-3 text-xs font-semibold text-brand-secondary-highlight dark:bg-surface-2 dark:text-secondary">
              {getInitials(allocat.fullName)}
            </AvatarFallback>
          </Avatar>
          {isVerified && (
            <span
              className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-surface-2 bg-brand-secondary text-primary-foreground dark:border-surface-1 dark:bg-surface-3 dark:text-secondary dark:ring-1 dark:ring-inset dark:ring-secondary/20"
              title="Verified professional"
            >
              <BadgeCheckIcon size={9} aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <h2 className="truncate text-sm font-semibold tracking-[-0.015em] text-foreground/90 dark:text-foreground">
              {allocat.fullName}
            </h2>
            {isVerified && (
              <BadgeCheckIcon
                size={12}
                aria-hidden="true"
                className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
              />
            )}
          </div>
          <p className="mt-0.5 truncate text-[0.66rem] text-muted-foreground">
            {allocat.title ||
              allocat.headline ||
              "Professional service provider"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.61rem] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <StarIcon
                size={10}
                aria-hidden="true"
                className={
                  rating > 0
                    ? "fill-current text-brand-amber/80 dark:text-status-pending-foreground"
                    : ""
                }
              />
              {rating > 0 ? rating.toFixed(1) : "New"}
            </span>
            {allocat.location && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPinIcon size={10} aria-hidden="true" className="shrink-0" />
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
          <span className="text-[0.57rem] font-semibold uppercase tracking-[0.13em] text-brand-secondary-highlight/85 dark:text-secondary/85">
            Selected Allocat
          </span>
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-brand-secondary-highlight/30 dark:bg-secondary/35"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          title="Remove selected Allocat"
          aria-label="Remove selected Allocat"
          onClick={onRemove}
          className={
            "h-8 w-8 shrink-0 rounded-lg p-0 text-muted-foreground shadow-none hover:bg-surface-3 hover:text-foreground/90 dark:hover:bg-surface-3/75 dark:hover:text-foreground " +
            focus
          }
        >
          <XIcon size={13} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
function SelectedAllocatLoading() {
  return (
    <div
      role="status"
      className={
        "flex min-h-[76px] items-center gap-3.5 rounded-xl border px-4 py-3.5 " +
        subtleCardSurface
      }
    >
      <span
        className={
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg " +
          createProjectIconSurface
        }
      >
        <LoaderCircleIcon
          size={17}
          aria-hidden="true"
          className="animate-spin motion-reduce:animate-none"
        />
      </span>
      <div>
        <p className="text-xs font-semibold text-foreground/85 dark:text-foreground">
          Loading selected Allocat
        </p>
        <p className="mt-0.5 text-[0.64rem] text-muted-foreground">
          Getting their public profile.
        </p>
      </div>
    </div>
  );
}
function SelectedAllocatError({
  message,
  onRemove,
}: {
  message: string;
  onRemove: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/15 bg-destructive/[0.035] p-4 dark:border-status-overdue/20 dark:bg-status-overdue/[0.07]"
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/[0.07] text-destructive dark:bg-status-overdue/[0.10] dark:text-status-overdue-foreground">
          <UserRoundIcon size={15} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground/85 dark:text-foreground">
            Selected Allocat unavailable
          </p>
          <p className="mt-1 max-w-2xl text-[0.65rem] leading-5 text-muted-foreground">
            {message}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          title="Remove selected Allocat"
          aria-label="Remove selected Allocat"
          className={
            "h-8 w-8 shrink-0 rounded-lg p-0 text-destructive shadow-none hover:bg-destructive/[0.06] hover:text-destructive dark:text-status-overdue-foreground dark:hover:bg-status-overdue/[0.10] dark:hover:text-status-overdue-foreground " +
            focus
          }
        >
          <XIcon size={13} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
function getInitials(name?: string | null) {
  if (!name?.trim()) return "A";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
export default CreateProject;
