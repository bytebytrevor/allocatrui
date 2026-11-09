import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  LightbulbIcon,
  MapPinIcon,
  PawPrintIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react";
import api from "@/api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SpotlightProfile = {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  location?: string;
  skills: string[];
};
type ProfilesPage = {
  items: unknown[];
  totalPages?: number;
  pageSize?: number;
};
type Tip = { title: string; body: string; category: string };
const TIPS: Tip[] = [
  {
    title: "Start with a clear finish.",
    body: "Write down what a successful handover looks like before the work begins. A shared definition of done keeps everyone moving together.",
    category: "Project planning",
  },
  {
    title: "Small milestones, steady progress.",
    body: "Break a large deliverable into a few reviewable steps. You’ll spot questions early and give useful feedback while there’s still time to act.",
    category: "Working together",
  },
  {
    title: "Give feedback a little context.",
    body: "Explain the goal behind a requested change. Sharing why something matters helps your Allocat find a stronger solution.",
    category: "Communication",
  },
  {
    title: "Keep decisions close to the work.",
    body: "Record agreed changes in the project workspace. A short written note helps everyone pick up where the last conversation ended.",
    category: "Project habits",
  },
  {
    title: "Leave room for a review.",
    body: "Include a review window in your timeline. Good work benefits from a little space to check details and agree on the finishing touches.",
    category: "Time management",
  },
  {
    title: "Share the useful references.",
    body: "A good example can make a brief much clearer. Add a few references and explain what you like about each one.",
    category: "Better briefs",
  },
  {
    title: "Make the next step obvious.",
    body: "End a project conversation with who is doing what next. A clear owner and an agreed date can save a lot of follow-up.",
    category: "Working together",
  },
  {
    title: "Keep scope changes visible.",
    body: "When a new request comes up, agree on its effect on time, cost and deliverables before adding it to the work.",
    category: "Project planning",
  },
];
const PAGE_SIZE = 24;
const MAX_SPOTLIGHTS = 6;
const ROTATION_MS = 8000;
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-card";
const iconButton =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-3/60 hover:text-foreground disabled:opacity-40 motion-reduce:transition-none " +
  focus;
const accent = "text-brand-secondary-highlight dark:text-secondary";
const card =
  "min-w-0 overflow-hidden rounded-2xl border border-border/65 bg-card shadow-sm shadow-black/[0.025] dark:border-border dark:shadow-none";

export default function WorkspaceDiscoverySidebar({
  excludeUserId,
}: {
  excludeUserId?: string;
}) {
  const [wide, setWide] = useState(
    () => window.matchMedia("(min-width: 1280px)").matches,
  );
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setWide(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (wide) setOpen(false);
  }, [wide]);
  if (wide) return <DiscoveryContent excludeUserId={excludeUserId} />;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open Allocats and tips"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-12 max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-xl border border-brand-secondary-highlight/15 bg-brand-secondary-highlight px-4 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/10 transition-opacity hover:opacity-90 dark:border-secondary/15 dark:bg-secondary dark:text-secondary-foreground motion-reduce:transition-none " +
          focus
        }
      >
        <SparklesIcon size={15} aria-hidden="true" />
        <span>Allocats &amp; tips</span>
        <ChevronUpIcon size={14} aria-hidden="true" />
      </button>
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
        className="!fixed !inset-x-0 !bottom-0 !top-auto z-[70] !mx-auto flex !max-h-[85dvh] !w-full !max-w-lg !translate-x-0 !translate-y-0 flex-col gap-0 overflow-hidden !rounded-b-none !rounded-t-2xl border-border/65 bg-background !p-0 text-foreground shadow-xl shadow-black/15 data-[state=open]:!animate-none data-[state=closed]:!animate-none"
      >
        <DialogHeader className="shrink-0 border-b border-border/55 px-5 pb-4 pr-12 pt-5 text-left">
          <DialogTitle className="text-base font-semibold tracking-[-0.02em]">
            A little inspiration
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs leading-6 text-muted-foreground">
            Meet Allocats and pick up a tip for your next project.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          <DiscoveryContent excludeUserId={excludeUserId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DiscoveryContent({ excludeUserId }: { excludeUserId?: string }) {
  const reduceMotion = useReducedMotion();
  const [profiles, setProfiles] = useState<SpotlightProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [tipIndex, setTipIndex] = useState(() =>
    Math.floor(Math.random() * TIPS.length),
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setFailed(false);
    setProfiles([]);
    setIndex(0);
    async function requestPage(
      page: number,
      pageSize = PAGE_SIZE,
    ): Promise<ProfilesPage> {
      const response = await api.get<ProfilesPage>("/allocats/profiles", {
        params: { page, pageSize },
        withCredentials: true,
        signal: controller.signal,
      });
      if (!Array.isArray(response.data?.items))
        throw new Error("Invalid profiles response.");
      return response.data;
    }
    async function loadProfiles() {
      try {
        const first = await requestPage(1);
        const pages = Number.isFinite(first.totalPages)
          ? Math.max(1, Math.floor(first.totalPages!))
          : 1;
        const pageSize =
          Number.isFinite(first.pageSize) && first.pageSize! > 0
            ? first.pageSize!
            : PAGE_SIZE;
        const randomPage = 1 + Math.floor(Math.random() * pages);
        let pool = first.items;
        if (randomPage > 1) {
          try {
            const selected = await requestPage(randomPage, pageSize);
            if (selected.items.length) pool = selected.items;
          } catch (error) {
            if (controller.signal.aborted) throw error;
            // The first public page still provides a useful preview if the sampled page fails.
          }
        }
        if (!active) return;
        const unique = new Map<string, SpotlightProfile>();
        for (const raw of pool) {
          const profile = normalizeProfile(raw);
          if (
            profile &&
            profile.id !== excludeUserId &&
            !unique.has(profile.id)
          )
            unique.set(profile.id, profile);
        }
        setProfiles(shuffle([...unique.values()]).slice(0, MAX_SPOTLIGHTS));
      } catch {
        if (active && !controller.signal.aborted) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadProfiles();
    return () => {
      active = false;
      controller.abort();
    };
  }, [excludeUserId, retry]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  const rotating =
    profiles.length > 1 && !hovered && !focused && !hidden && !reduceMotion;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % profiles.length),
      ROTATION_MS,
    );
    return () => window.clearInterval(timer);
  }, [rotating, profiles.length]);

  const current = profiles[index];
  const tip = TIPS[tipIndex];
  function move(direction: number) {
    setIndex(
      (current) => (current + direction + profiles.length) % profiles.length,
    );
  }

  return (
    <aside
      aria-label="Community spotlights and daily tips"
      className="grid min-w-0 items-start gap-5 xl:self-start"
    >
      <section className={card} aria-labelledby="spotlight-heading">
        <div className="border-b border-border/50 bg-surface-2/20 px-5 pb-5 pt-5 dark:bg-card">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={
                "flex h-7 w-7 items-center justify-center rounded-lg bg-surface-3/65 ring-1 ring-inset ring-border/35 dark:bg-surface-2/80 " +
                accent
              }
            >
              <SparklesIcon size={12} />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Community spotlight
            </p>
          </div>
          <h2
            id="spotlight-heading"
            className="mt-4 text-lg font-semibold leading-snug tracking-[-0.025em] text-foreground/90"
          >
            A little extra paw-power.
          </h2>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Great work starts with good company. Meet an Allocat for whatever
            comes next.
          </p>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Allocat spotlights"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setFocused(false);
          }}
        >
          {loading ? (
            <div
              role="status"
              aria-label="Loading community spotlights"
              className="min-h-[256px] px-5 py-5"
            >
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="mt-4 h-4 w-36" />
              <Skeleton className="mt-2 h-3 w-44" />
              <Skeleton className="mt-5 h-7 w-full" />
              <Skeleton className="mt-5 h-9 w-full" />
            </div>
          ) : current ? (
            <>
              <div
                aria-live={rotating ? "off" : "polite"}
                aria-atomic="true"
                className="overflow-hidden"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={current.id}
                    initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      reduceMotion ? { opacity: 1 } : { opacity: 0, x: -12 }
                    }
                    transition={{ duration: reduceMotion ? 0 : 0.24 }}
                  >
                    <article
                      aria-roledescription="slide"
                      aria-label={`${index + 1} of ${profiles.length}`}
                      className="flex h-[280px] flex-col px-5 py-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-14 w-14 shrink-0 border border-border/60">
                          <AvatarImage
                            src={current.avatarUrl}
                            alt=""
                            className="object-cover"
                          />
                          <AvatarFallback
                            className={
                              "bg-brand-secondary-highlight/[0.08] text-base font-semibold dark:bg-secondary/[0.08] " +
                              accent
                            }
                          >
                            {initials(current.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h3
                            title={current.name}
                            className="line-clamp-2 break-words text-sm font-semibold leading-6 text-foreground/90 [overflow-wrap:anywhere]"
                          >
                            {current.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {current.title}
                          </p>
                        </div>
                      </div>
                      {current.location && (
                        <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-5 text-muted-foreground">
                          <MapPinIcon
                            size={12}
                            aria-hidden="true"
                            className="mt-1 shrink-0"
                          />
                          <span title={current.location} className="truncate">
                            {current.location}
                          </span>
                        </p>
                      )}
                      {current.skills.length > 0 && (
                        <div className="mt-4 flex gap-1.5 overflow-hidden">
                          {current.skills.map((skill) => (
                            <span
                              key={skill}
                              title={skill}
                              className="min-w-0 max-w-full truncate rounded-md border border-border/55 bg-surface-2/45 px-2 py-1 text-[10px] font-medium text-foreground/75 dark:bg-surface-2/65"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto pt-5">
                        <Link
                          to={`/allocats/${encodeURIComponent(current.id)}`}
                          className={
                            "group flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-brand-secondary-highlight/15 bg-brand-secondary-highlight px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 dark:border-secondary/15 dark:bg-secondary dark:text-secondary-foreground motion-reduce:transition-none " +
                            focus
                          }
                        >
                          View profile
                          <ArrowRightIcon
                            size={13}
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                          />
                        </Link>
                      </div>
                    </article>
                  </motion.div>
                </AnimatePresence>
              </div>
              {profiles.length > 1 && (
                <div className="flex items-center justify-end border-t border-border/45 px-4 py-2">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      aria-label="Previous Allocat"
                      onClick={() => move(-1)}
                      className={iconButton}
                    >
                      <ChevronLeftIcon size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Allocat"
                      onClick={() => move(1)}
                      className={iconButton}
                    >
                      <ChevronRightIcon size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-5 py-6">
              <p className="text-xs leading-6 text-muted-foreground">
                {failed
                  ? "The community is taking a catnap. You can still explore Allocats in Discover."
                  : "Your next collaborator could be just around the corner. Explore the community to find your fit."}
              </p>
              {failed && (
                <button
                  type="button"
                  onClick={() => setRetry((value) => value + 1)}
                  className={
                    "mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md text-xs font-semibold " +
                    accent +
                    " " +
                    focus
                  }
                >
                  <RefreshCwIcon size={12} aria-hidden="true" />
                  Try again
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={card} aria-labelledby="daily-tip-heading">
        <div className="px-5 pb-5 pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={
                  "flex h-7 w-7 items-center justify-center rounded-lg bg-brand-secondary-highlight/[0.07] dark:bg-secondary/[0.07] " +
                  accent
                }
              >
                <LightbulbIcon size={13} />
              </span>
              <h2
                id="daily-tip-heading"
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
              >
                Daily tip
              </h2>
            </div>
            <button
              type="button"
              aria-label="Show another tip"
              onClick={() =>
                setTipIndex(
                  (current) =>
                    (current +
                      1 +
                      Math.floor(Math.random() * (TIPS.length - 1))) %
                    TIPS.length,
                )
              }
              className={iconButton}
            >
              <RefreshCwIcon size={12} aria-hidden="true" />
            </button>
          </div>
          <div aria-live="polite" aria-atomic="true">
            <p className={"mt-4 text-[10px] font-medium " + accent}>
              {tip.category}
            </p>
            <h3 className="mt-2 text-sm font-semibold leading-6 tracking-[-0.015em] text-foreground/90">
              {tip.title}
            </h3>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              {tip.body}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-border/45 pt-4 text-[10px] text-muted-foreground/75">
            <PawPrintIcon size={11} aria-hidden="true" className={accent} />
            Small steps. Better projects.
          </div>
        </div>
      </section>
    </aside>
  );
}

function normalizeProfile(raw: unknown): SpotlightProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const id = stringValue(value.allocatrUserId);
  const name = stringValue(value.fullName);
  if (!id || !name || value.isVisible === false) return null;
  const skills = [
    ...new Set(
      (Array.isArray(value.skills) ? value.skills : [])
        .map((skill) =>
          typeof skill === "string"
            ? skill.trim()
            : skill && typeof skill === "object"
              ? stringValue((skill as Record<string, unknown>).name)
              : "",
        )
        .filter(Boolean),
    ),
  ].slice(0, 3);
  return {
    id,
    name,
    title:
      stringValue(value.title) ||
      stringValue(value.headline) ||
      "Allocat professional",
    avatarUrl: stringValue(value.avatarUrl) || undefined,
    location: stringValue(value.location) || undefined,
    skills,
  };
}
function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
function shuffle<T>(items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [items[index], items[swap]] = [items[swap], items[index]];
  }
  return items;
}
