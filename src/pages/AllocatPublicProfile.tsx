import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { isAxiosError } from "axios";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  CheckIcon,
  CircleCheckBigIcon,
  CopyIcon,
  FolderOpenIcon,
  LoaderCircleIcon,
  MapPinIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  StarIcon,
  UserRoundIcon,
  ZoomInIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import {
  getPublicAllocatProfile,
  PublicAllocatProfileRequestError,
} from "@/api/allocatPublicProfile";
import { useAuth } from "@/auth/useAuth";
import type { Project } from "@/Types/project";
import type { AllocatProjectSummary } from "@/Types/allocatProfile";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  primaryAction as workspacePrimaryAction,
  secondaryAction as workspaceSecondaryAction,
  quietAction as workspaceQuietAction,
  ProjectStatus,
} from "@/components/workspace-ui";
import { getProjectCategoryLabel, getProjectIcon } from "@/utils/projectIcons";
import {
  type AllocatPublicProfileLoader,
  type PublicAllocatProfile,
  formatHourlyRate,
  formatMemberSince,
  getAllocatProfilePath,
  getAvailability,
  getProfileInitials,
  getPublicSkills,
  isCompletedPublicProject,
  nonNegativeCount,
  normalizeProfileStatus,
} from "@/utils/allocatPublicProfile";
/* =========================================================
   ROUTE: /allocats/:profileId

   Loads the existing public-profile endpoint by default.
   Invitation endpoints are the existing project endpoints.
========================================================= */
type Props = {
  loadProfile?: AllocatPublicProfileLoader;
};
type ProfileFailure = "unavailable" | "unauthorized" | "connection" | null;
const primaryAction = workspacePrimaryAction + " min-h-11";
const secondaryAction = workspaceSecondaryAction + " min-h-11";
const quietAction = workspaceQuietAction + " min-h-11";
const CONTAINER =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16";
const surface = "rounded-2xl border border-border/75 bg-card";
const accent = "text-brand-secondary-highlight dark:text-secondary";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
export default function AllocatPublicProfilePage({
  loadProfile = getPublicAllocatProfile,
}: Props = {}) {
  const { profileId: allocatId } = useParams<{
    profileId: string;
  }>();
  const [profile, setProfile] = useState<PublicAllocatProfile | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<ProfileFailure>(null);
  const [reload, setReload] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(68);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () =>
      setNavHeight(Math.ceil(header.getBoundingClientRect().height) || 68);
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setProfile(null);
    setLoadedId(null);
    setFailure(null);
    setLoading(true);
    async function load() {
      if (!allocatId?.trim()) {
        setFailure("unavailable");
        setLoadedId(allocatId ?? "");
        setLoading(false);
        return;
      }
      try {
        const result = await loadProfile(allocatId, {
          signal: controller.signal,
        });
        if (cancelled) return;
        if (
          !result ||
          typeof result.allocatrUserId !== "string" ||
          result.allocatrUserId.toLowerCase() !== allocatId.toLowerCase()
        ) {
          throw new Error("Invalid public profile response.");
        }
        setProfile(result);
      } catch (cause) {
        if (cancelled) return;
        const status =
          cause instanceof PublicAllocatProfileRequestError
            ? cause.status
            : isAxiosError(cause)
              ? cause.response?.status
              : undefined;
        setFailure(
          status === 404 || status === 403
            ? "unavailable"
            : status === 401
              ? "unauthorized"
              : "connection",
        );
      } finally {
        if (!cancelled) {
          setLoadedId(allocatId);
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [allocatId, loadProfile, reload]);
  const pending = loading || loadedId !== (allocatId ?? "");
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen bg-background text-foreground"
        style={{ "--profile-nav-height": `${navHeight}px` } as CSSProperties}
      >
        <header
          ref={headerRef}
          className="sticky top-0 z-50 border-b border-border/70 bg-background"
        >
          <div className={CONTAINER}>
            <MinimalNavMenu />
          </div>
        </header>
        <main className={`${CONTAINER} pb-12 pt-5 sm:pb-16 sm:pt-7`}>
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex min-h-9 items-center gap-2 text-xs text-muted-foreground sm:mb-7"
          >
            <Link to="/discover" className={quietAction + " -ml-2.5"}>
              <ArrowLeftIcon size={13} aria-hidden="true" />
              Discover Allocats
            </Link>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span className="truncate">Professional profile</span>
          </nav>
          {pending ? (
            <ProfileSkeleton />
          ) : failure || !profile ? (
            <ProfileError
              unavailable={failure === "unavailable"}
              unauthorized={failure === "unauthorized"}
              onRetry={() => setReload((value) => value + 1)}
            />
          ) : (
            <PublicProfileContent
              key={profile.allocatrUserId}
              profile={profile}
            />
          )}
        </main>
      </div>
    </MotionConfig>
  );
}
function getStartProjectPath(allocatId: string) {
  return `/projects/new?allocat=${encodeURIComponent(allocatId)}`;
}
/** The owned-project response supplies required skills in its skills array. */
function getInvitationSkillCheck(
  project: Project,
  profileSkills: PublicAllocatProfile["skills"],
): {
  needsConfirmation: boolean;
  unavailable: boolean;
  required: string[];
  matched: string[];
} {
  const raw: unknown = (
    project as Project & {
      skills?: unknown;
    }
  ).skills;
  const normalize = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  if (!Array.isArray(raw))
    return {
      needsConfirmation: true,
      unavailable: true,
      required: [],
      matched: [],
    };
  const required: string[] = [];
  for (const item of raw) {
    const name =
      typeof item === "string"
        ? item
        : item &&
            typeof item === "object" &&
            "name" in item &&
            typeof item.name === "string"
          ? item.name
          : null;
    if (!name?.trim())
      return {
        needsConfirmation: true,
        unavailable: true,
        required: [],
        matched: [],
      };
    if (!required.some((value) => normalize(value) === normalize(name)))
      required.push(name.trim());
  }
  const available = new Set(
    getPublicSkills(profileSkills).map((skill) => normalize(skill.name)),
  );
  const matched = required.filter((skill) => available.has(normalize(skill)));
  return {
    needsConfirmation: required.length > 0 && matched.length === 0,
    unavailable: false,
    required,
    matched,
  };
}
/* =========================================================
   PROFILE CONTENT
========================================================= */
export function PublicProfileContent({
  profile,
}: {
  profile: PublicAllocatProfile;
}) {
  const { user } = useAuth();
  const reducedMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const avatarUrl = profile.avatarUrl?.trim() || undefined;
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const name = profile.fullName?.trim() || "Allocat professional";
  const firstName = name.split(/\s+/)[0];
  const title =
    profile.title?.trim() ||
    profile.headline?.trim() ||
    "Independent professional";
  const headline = profile.headline?.trim();
  const verified = Boolean(profile.isVerified ?? profile.verified);
  const availability = getAvailability(
    profile.availabilityStatus,
    profile.availability,
  );
  const memberSince = formatMemberSince(profile.joinedAt);
  const rate = formatHourlyRate(profile.hourlyRate, profile.currency);
  const skills = useMemo(
    () => getPublicSkills(profile.skills),
    [profile.skills],
  );
  const projects = useMemo(() => {
    const unique = new Map<string, AllocatProjectSummary>();
    for (const project of Array.isArray(profile.projects)
      ? profile.projects
      : []) {
      if (
        project &&
        typeof project.id === "string" &&
        typeof project.title === "string"
      )
        unique.set(project.id, project);
    }
    return Array.from(unique.values());
  }, [profile.projects]);
  const ratingCount = nonNegativeCount(profile.ratingCount);
  const rawRating = profile.rating ?? profile.averageRating;
  const rating =
    ratingCount > 0 &&
    typeof rawRating === "number" &&
    Number.isFinite(rawRating) &&
    rawRating > 0
      ? Math.min(5, rawRating)
      : null;
  const completed = nonNegativeCount(profile.completedProjects);
  const experience =
    typeof profile.yearsExperience === "number" &&
    Number.isFinite(profile.yearsExperience) &&
    profile.yearsExperience >= 0
      ? profile.yearsExperience
      : null;
  const isOwnProfile = Boolean(
    user?.userId &&
    user.userId.toLowerCase() === profile.allocatrUserId.toLowerCase(),
  );
  const contextProjectId = searchParams.get("projectId") || undefined;
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);
  async function copyProfileLink() {
    try {
      const url = new URL(
        getAllocatProfilePath(profile.allocatrUserId),
        window.location.origin,
      );
      await navigator.clipboard.writeText(url.href);
      if (!mountedRef.current) return;
      setCopied(true);
      toast.success("Profile link copied.");
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      if (mountedRef.current)
        toast.error("The profile link could not be copied.");
    }
  }
  const inviteAction = isOwnProfile ? (
    <p className="rounded-lg border border-border/70 bg-surface-2/40 px-3.5 py-3 text-xs leading-6 text-muted-foreground">
      This is your public professional profile.
    </p>
  ) : user?.userId ? (
    <button
      type="button"
      onClick={() => setInviteOpen(true)}
      className={primaryAction + " w-full"}
    >
      <SendIcon size={14} aria-hidden="true" />
      Invite to a project
      <ArrowUpRightIcon size={13} aria-hidden="true" className="ml-auto" />
    </button>
  ) : (
    <Link
      to={getStartProjectPath(profile.allocatrUserId)}
      aria-label={`Start a project with ${name}`}
      className={
        primaryAction + " min-h-10 w-full whitespace-normal py-3 text-center"
      }
    >
      <BriefcaseBusinessIcon size={14} aria-hidden="true" />
      Start a project
      <ArrowUpRightIcon size={13} aria-hidden="true" className="ml-auto" />
    </Link>
  );
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      {/* PROFILE HERO */}
      <section
        aria-labelledby="profile-name"
        className={surface + " relative overflow-hidden"}
      >
        <div className="relative overflow-hidden bg-card text-foreground">
          <div className="relative px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight/80 dark:bg-secondary"
                />
                Allocat profile
              </p>
              <button
                type="button"
                onClick={() => void copyProfileLink()}
                aria-label={
                  copied
                    ? "Public profile link copied"
                    : "Copy public profile link"
                }
                className={
                  "inline-flex h-11 w-11 shrink-0 sm:w-auto items-center justify-center gap-2 rounded-lg border border-border/70 bg-surface-2/40 px-3 text-xs font-medium text-brand-secondary-highlight transition-opacity hover:opacity-75 dark:border-border dark:bg-surface-2/50 dark:text-foreground/85 motion-reduce:transition-none " +
                  focus
                }
              >
                {copied ? (
                  <CheckIcon size={13} aria-hidden="true" />
                ) : (
                  <CopyIcon size={13} aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {copied ? "Copied" : "Copy link"}
                </span>
              </button>
            </div>

            <div className="mt-6 flex flex-col items-start gap-5 sm:mt-7 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative shrink-0">
                <button
                  type="button"
                  disabled={!avatarUrl || photoFailed}
                  aria-label={"View " + name + "'s profile photo"}
                  aria-haspopup="dialog"
                  onClick={() => setPhotoOpen(true)}
                  className={
                    "group relative block rounded-2xl text-left disabled:cursor-default " +
                    focus
                  }
                >
                  <Avatar className="h-24 w-24 rounded-2xl border border-border/70 bg-surface-2 sm:h-28 sm:w-28">
                    <AvatarImage
                      src={avatarUrl}
                      alt={name}
                      onLoadingStatusChange={(status) =>
                        setPhotoFailed(status === "error")
                      }
                      className="object-cover transition-opacity duration-150 motion-reduce:transition-none group-enabled:group-hover:opacity-85"
                    />
                    <AvatarFallback className="rounded-2xl bg-surface-2 text-3xl font-medium text-brand-secondary-highlight sm:text-4xl dark:text-secondary">
                      {getProfileInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  {avatarUrl && !photoFailed && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground transition-colors group-hover:bg-surface-2"
                    >
                      <ZoomInIcon size={13} />
                    </span>
                  )}
                </button>
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h1
                    id="profile-name"
                    className="break-words text-[clamp(1.9rem,3.5vw,2.8rem)] font-medium leading-[1.12] tracking-[-0.04em] [overflow-wrap:anywhere]"
                  >
                    {name}
                  </h1>
                  {verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-secondary-highlight dark:text-secondary">
                      <BadgeCheckIcon size={13} aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-2 break-words text-sm font-normal leading-7 text-foreground/80 sm:text-base">
                  {title}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {profile.location?.trim() && (
                    <span className="inline-flex min-w-0 max-w-full items-start gap-1.5">
                      <MapPinIcon
                        size={13}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                      />
                      <span className="break-words [overflow-wrap:anywhere]">
                        {profile.location}
                      </span>
                    </span>
                  )}
                  <span
                    className={
                      "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 dark:bg-surface-3 " +
                      availability.text
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={"h-1.5 w-1.5 rounded-full " + availability.dot}
                    />
                    {availability.label}
                  </span>
                  {memberSince && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDaysIcon size={13} aria-hidden="true" />
                      Joined {memberSince}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {headline && headline !== title && (
              <p className="mt-5 max-w-3xl break-words text-sm leading-7 text-muted-foreground">
                {headline}
              </p>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-3 border-t border-border/65 bg-surface-2/25">
          <ProfileMetric
            label="Client rating"
            icon={<StarIcon size={14} aria-hidden="true" />}
            value={rating ? rating.toFixed(1) + "/5" : "Not yet rated"}
            detail={
              rating
                ? ratingCount + (ratingCount === 1 ? " rating" : " ratings")
                : "Ratings on Allocatr"
            }
          />
          <ProfileMetric
            label="Completed"
            icon={<CircleCheckBigIcon size={14} aria-hidden="true" />}
            value={String(completed)}
            detail="Projects on Allocatr"
          />
          <ProfileMetric
            label="Experience"
            icon={<BriefcaseBusinessIcon size={14} aria-hidden="true" />}
            value={
              experience === null
                ? "Not listed"
                : experience + (experience === 1 ? " year" : " years")
            }
            detail="Listed experience"
          />
        </dl>
      </section>

      {/* IN-PAGE NAVIGATION */}
      <nav
        aria-label="Profile sections"
        className="mt-5 flex items-center gap-2 overflow-x-auto border-b border-border/70 py-1 [scrollbar-width:thin] sm:mt-6 sm:gap-4"
      >
        <SectionLink href="#overview">Overview</SectionLink>
        <SectionLink href="#expertise">Expertise</SectionLink>
        <SectionLink href="#public-work">Work</SectionLink>
        <SectionLink href="#reputation">Client ratings</SectionLink>
      </nav>

      <div className="mt-5 rounded-xl border border-border/75 bg-card p-4 sm:p-5 lg:hidden">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs text-muted-foreground">Work with {firstName}</p>
          <p className="text-sm font-medium">
            {rate || "Rate on request"}
            {rate && (
              <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                / hour
              </span>
            )}
          </p>
        </div>
        {inviteAction}
      </div>

      <div className="mt-6 grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_312px] xl:grid-cols-[minmax(0,1fr)_336px] lg:gap-7">
        <div className="min-w-0 space-y-5 lg:space-y-6">
          <section
            id="overview"
            aria-labelledby="about-heading"
            className={
              surface +
              " scroll-mt-[calc(var(--profile-nav-height,68px)+24px)] p-5 sm:p-7"
            }
          >
            <SectionHeading
              eyebrow="The introduction"
              title={"About " + firstName}
              id="about-heading"
            />
            <div className="mt-5 whitespace-pre-line break-words text-[13px] leading-8 text-foreground/85 [overflow-wrap:anywhere]">
              {profile.bio?.trim() ||
                "This professional has not added a personal introduction yet."}
            </div>
          </section>

          <ExpertiseSection skills={skills} />
          <PublicWorkSection projects={projects} />
          <section
            id="reputation"
            aria-labelledby="feedback-heading"
            className={
              surface +
              " scroll-mt-[calc(var(--profile-nav-height,68px)+24px)] p-5 sm:p-7"
            }
          >
            <SectionHeading
              eyebrow="Reputation"
              title="Client ratings"
              id="feedback-heading"
            />
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border/65 bg-surface-2/40 p-5 sm:flex-row sm:items-center sm:gap-6">
              <div
                className="shrink-0"
                role="img"
                aria-label={
                  rating
                    ? `${rating.toFixed(1)} out of 5 from ${ratingCount} ${ratingCount === 1 ? "rating" : "ratings"}`
                    : "Not yet rated"
                }
              >
                <p
                  aria-hidden="true"
                  className="inline-flex items-baseline gap-1.5 text-3xl font-medium tracking-[-0.04em] tabular-nums"
                >
                  <StarIcon
                    size={18}
                    className={
                      rating
                        ? "self-center fill-brand-amber/75 text-brand-amber"
                        : "self-center text-muted-foreground/50"
                    }
                  />
                  {rating ? rating.toFixed(1) : "—"}
                  <span className="text-xs font-normal tracking-normal text-muted-foreground">
                    / 5
                  </span>
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {rating ? "Rated by clients" : "Not yet rated"}
                </p>
                <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                  {rating
                    ? `Based on ${ratingCount.toLocaleString()} ${ratingCount === 1 ? "client rating" : "client ratings"} on Allocatr.`
                    : "Client ratings will appear here as work is reviewed."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* WORK WITH THIS PROFESSIONAL */}
        <aside
          aria-label={"Work with " + firstName}
          className="hidden min-w-0 lg:sticky lg:top-[calc(var(--profile-nav-height,68px)+24px)] lg:block"
        >
          <section className={surface + " overflow-hidden"}>
            <div className="border-b border-border/65 bg-surface-2/35 px-5 py-5 sm:px-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Project collaboration
              </p>
              <h2 className="mt-2 break-words text-lg font-medium tracking-[-0.025em]">
                Work with {firstName}
              </h2>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Start with a project brief and confirm the scope together.
              </p>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <p className="text-[11px] text-muted-foreground">Hourly rate</p>
                <p className="mt-2 break-words text-2xl font-medium tracking-[-0.035em]">
                  {rate || "Rate on request"}
                  {rate && (
                    <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground">
                      / hour
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 border-y border-border/60 py-3 text-xs">
                <span className="text-muted-foreground">Availability</span>
                <span
                  className={
                    "inline-flex items-center gap-1.5 font-medium " +
                    availability.text
                  }
                >
                  <span
                    aria-hidden="true"
                    className={"h-1.5 w-1.5 rounded-full " + availability.dot}
                  />
                  {availability.shortLabel}
                </span>
              </div>
              {inviteAction}
              {!isOwnProfile && (
                <p className="text-[11px] leading-6 text-muted-foreground">
                  Share your project with {firstName}. They can review the brief
                  before accepting your invitation.
                </p>
              )}
            </div>
          </section>

          <Link to="/discover" className={quietAction + " mt-4 w-full"}>
            Explore more Allocats
            <ArrowRightIcon size={12} aria-hidden="true" />
          </Link>
        </aside>
      </div>

      {photoOpen && avatarUrl && (
        <ProfilePhotoViewer
          src={avatarUrl}
          name={name}
          onOpenChange={setPhotoOpen}
        />
      )}
      {inviteOpen && user?.userId && !isOwnProfile && (
        <InviteToProjectDialog
          profile={profile}
          contextProjectId={contextProjectId}
          onOpenChange={setInviteOpen}
        />
      )}
    </motion.div>
  );
}
/* =========================================================
   PROFILE PHOTO VIEWER
   Dialog supplies focus trapping, Escape dismissal and focus restoration.
========================================================= */
function ProfilePhotoViewer({
  src,
  name,
  onOpenChange,
}: {
  src: string;
  name: string;
  onOpenChange: (open: boolean) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col gap-0 overflow-hidden rounded-2xl border-border/80 bg-card p-0 text-card-foreground sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border/65 px-5 py-5 pr-12 text-left sm:px-6">
          <DialogTitle className="text-base font-medium tracking-[-0.02em]">
            {name}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Profile photo
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex min-h-[min(13rem,35dvh)] flex-1 items-start justify-center overflow-y-auto bg-surface-2/50 p-3 sm:p-5">
          {!loaded && !failed && (
            <div
              role="status"
              className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <LoaderCircleIcon
                size={18}
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Loading photo
            </div>
          )}
          {failed ? (
            <div
              role="alert"
              className="flex flex-col items-center gap-3 px-6 py-12 text-sm text-muted-foreground"
            >
              <UserRoundIcon size={32} aria-hidden="true" />
              <p>The profile photo could not be loaded.</p>
              <button
                type="button"
                className={secondaryAction}
                onClick={() => {
                  setLoaded(false);
                  setFailed(false);
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <img
              src={src}
              alt={name + "'s profile photo"}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={
                "my-auto max-h-[65dvh] max-w-full rounded-xl object-contain " +
                (loaded ? "opacity-100" : "opacity-0")
              }
            />
          )}
        </div>
        <DialogFooter className="shrink-0 border-t border-border/65 px-5 py-4 sm:px-6">
          <button
            type="button"
            className={secondaryAction}
            onClick={() => onOpenChange(false)}
          >
            Close photo
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
/* =========================================================
   EXPERTISE
========================================================= */
function ExpertiseSection({
  skills,
}: {
  skills: {
    id: string;
    name: string;
  }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? skills : skills.slice(0, 12);
  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className={
        surface +
        " scroll-mt-[calc(var(--profile-nav-height,68px)+24px)] p-5 sm:p-7"
      }
    >
      <SectionHeading
        eyebrow="What they bring"
        title="Skills & expertise"
        id="expertise-heading"
        count={skills.length}
      />
      {skills.length ? (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {visible.map((skill) => (
              <span
                key={skill.id}
                className="max-w-full break-words rounded-lg border border-border/65 bg-surface-2/45 px-3 py-2 text-[11px] font-medium leading-5 text-foreground/85 [overflow-wrap:anywhere]"
              >
                {skill.name}
              </span>
            ))}
          </div>
          {skills.length > 12 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className={quietAction + " -ml-2.5 mt-4"}
            >
              {expanded
                ? "Show fewer skills"
                : "View all " + skills.length + " skills"}
              <PlusIcon
                size={12}
                aria-hidden="true"
                className={expanded ? "rotate-45" : ""}
              />
            </button>
          )}
        </>
      ) : (
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Skills have not been listed yet.
        </p>
      )}
    </section>
  );
}
/* =========================================================
   PUBLIC WORK
   Uses only the project summaries returned in the public DTO.
   These entries do not link into private project workspaces.
========================================================= */
function PublicWorkSection({
  projects,
}: {
  projects: AllocatProjectSummary[];
}) {
  const [completedOnly, setCompletedOnly] = useState(false);
  const [limit, setLimit] = useState(6);
  const filtered = completedOnly
    ? projects.filter((project) => isCompletedPublicProject(project.status))
    : projects;
  const visible = filtered.slice(0, limit);
  return (
    <section
      id="public-work"
      aria-labelledby="work-heading"
      className={
        surface +
        " scroll-mt-[calc(var(--profile-nav-height,68px)+24px)] p-5 sm:p-7"
      }
    >
      <SectionHeading
        eyebrow="Experience in practice"
        title="Work on Allocatr"
        id="work-heading"
        count={projects.length}
      />
      {projects.length > 0 ? (
        <>
          <div
            role="group"
            aria-label="Filter public work"
            className="mt-5 inline-flex gap-1 rounded-lg border border-border/65 bg-surface-2/40 p-1"
          >
            {[
              { value: false, label: "All work" },
              { value: true, label: "Completed" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={completedOnly === item.value}
                onClick={() => {
                  setCompletedOnly(item.value);
                  setLimit(6);
                }}
                className={
                  "min-h-10 rounded-md px-3 text-[11px] font-medium " +
                  focus +
                  " " +
                  (completedOnly === item.value
                    ? "bg-card text-brand-secondary-highlight dark:text-secondary"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {visible.map((project) => (
              <article
                key={project.id}
                className="min-w-0 rounded-xl border border-border/70 bg-surface-2/25 p-4 sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3/60 " +
                    accent
                  }
                >
                  {getProjectIcon(project.category || "default", 14)}
                </span>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  {getProjectCategoryLabel(project.category, "General project")}
                </p>
                <h3 className="mt-1.5 break-words text-xs font-medium leading-6">
                  {project.title}
                </h3>
                <div className="mt-4 border-t border-border/60 pt-3">
                  <ProjectStatus status={project.status} />
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              No completed work is listed in this profile yet.
            </p>
          )}
          {filtered.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((value) => value + 6)}
              className={secondaryAction + " mt-4 w-full"}
            >
              Show more work
              <PlusIcon size={13} aria-hidden="true" />
            </button>
          )}
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border p-5">
          <FolderOpenIcon
            size={20}
            aria-hidden="true"
            className="text-muted-foreground/65"
          />
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            No public project summaries are listed yet.
          </p>
        </div>
      )}
    </section>
  );
}
/* =========================================================
   INVITE TO PROJECT
   Lists owned projects; checks only the selected relationship.
========================================================= */
function InviteToProjectDialog({
  profile,
  contextProjectId,
  onOpenChange,
}: {
  profile: PublicAllocatProfile;
  contextProjectId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [confirmProjectId, setConfirmProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [relationship, setRelationship] = useState<string | null>(null);
  const [relationshipProjectId, setRelationshipProjectId] = useState<
    string | null
  >(null);
  const [checking, setChecking] = useState(false);
  const [relationshipError, setRelationshipError] = useState(false);
  const [relationshipReload, setRelationshipReload] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const busyRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    setSelectedId("");
    setConfirmProjectId(null);
    setProjects([]);
    async function load() {
      try {
        const response = await api.get<Project[]>("/projects/mine", {
          withCredentials: true,
          signal: controller.signal,
        });
        if (cancelled) return;
        if (!Array.isArray(response.data))
          throw new Error("Invalid projects response.");
        const owned = response.data.filter((project) =>
          ["pending", "active"].includes(
            normalizeProfileStatus(project.status),
          ),
        );
        setProjects(owned);
        if (
          contextProjectId &&
          owned.some(
            (project) =>
              project.id.toLowerCase() === contextProjectId.toLowerCase(),
          )
        ) {
          setSelectedId(
            owned.find(
              (project) =>
                project.id.toLowerCase() === contextProjectId.toLowerCase(),
            )!.id,
          );
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [contextProjectId, reload]);
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    const controller = new AbortController();
    setChecking(true);
    setRelationship(null);
    setRelationshipProjectId(null);
    setRelationshipError(false);
    async function check() {
      try {
        const response = await api.get<{
          status?: string;
        }>(
          "/projects/" +
            encodeURIComponent(selectedId) +
            "/allocats/" +
            encodeURIComponent(profile.allocatrUserId),
          { withCredentials: true, signal: controller.signal },
        );
        if (cancelled) return;
        const status = normalizeProfileStatus(response.data?.status);
        if (!["invited", "accepted", "declined", "removed"].includes(status))
          throw new Error("Invalid relationship response.");
        setRelationship(status);
      } catch (cause) {
        if (cancelled) return;
        if (isAxiosError(cause) && cause.response?.status === 404)
          setRelationship(null);
        else setRelationshipError(true);
      } finally {
        if (!cancelled) {
          setRelationshipProjectId(selectedId);
          setChecking(false);
        }
      }
    }
    void check();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedId, profile.allocatrUserId, relationshipReload]);
  const selected = projects.find((project) => project.id === selectedId);
  const skillCheck = selected
    ? getInvitationSkillCheck(selected, profile.skills)
    : null;
  const confirming = Boolean(
    selected &&
    confirmProjectId === selectedId &&
    skillCheck?.needsConfirmation,
  );
  const visible = projects.filter((project) =>
    [project.title, project.projectCode ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const alreadyInvited = relationship === "invited";
  const alreadyAccepted = relationship === "accepted";
  const canSend =
    Boolean(selected) &&
    !loading &&
    !loadError &&
    !checking &&
    !relationshipError &&
    relationshipProjectId === selectedId &&
    !alreadyInvited &&
    !alreadyAccepted;
  function startNewProject() {
    if (busyRef.current) return;
    onOpenChange(false);
    navigate(getStartProjectPath(profile.allocatrUserId));
  }
  function requestInvitation() {
    if (busyRef.current || !canSend || !selected) return;
    if (skillCheck?.needsConfirmation) {
      setConfirmProjectId(selected.id);
      setSubmitError(null);
      return;
    }
    void sendInvitation();
  }
  async function sendInvitation(confirmedId?: string) {
    if (busyRef.current || !canSend || !selected) return;
    if (skillCheck?.needsConfirmation && confirmedId !== selected.id) return;
    busyRef.current = true;
    setSending(true);
    setSubmitError(null);
    try {
      await api.put(
        "/projects/" +
          encodeURIComponent(selected.id) +
          "/allocats/" +
          encodeURIComponent(profile.allocatrUserId) +
          "/invite",
        {},
        { withCredentials: true },
      );
      if (!mountedRef.current) return;
      setRelationship("invited");
      toast.success(
        profile.fullName + " has been invited to " + selected.title + ".",
      );
      onOpenChange(false);
    } catch {
      if (mountedRef.current) {
        setSubmitError(
          "The invitation could not be sent. Your selection has been kept. Check the project and try again.",
        );
        setRelationshipReload((value) => value + 1);
      }
    } finally {
      busyRef.current = false;
      if (mountedRef.current) setSending(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!busyRef.current) onOpenChange(open);
      }}
    >
      <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col gap-0 overflow-hidden rounded-2xl border-border/80 bg-card p-0 text-card-foreground shadow-[0_24px_80px_-24px_color-mix(in_srgb,var(--brand-charcoal)_45%,transparent)] sm:max-w-[560px]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <DialogHeader className="border-b border-border/65 px-5 py-5 pr-12 text-left sm:px-6 sm:pr-12">
            <DialogTitle className="text-xl font-medium tracking-[-0.025em]">
              {confirming
                ? "Confirm project invitation"
                : "Invite to a project"}
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs leading-6">
              {confirming
                ? "Review the skill match before sending this invitation."
                : `Choose a project for ${profile.fullName} to review, or start a new one.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            {confirming && selected && skillCheck ? (
              <section className="space-y-4">
                <div
                  role="status"
                  className="rounded-xl border border-status-pending/25 bg-status-pending/[0.06] p-4"
                >
                  <h3 className="text-sm font-medium text-status-pending-foreground">
                    {skillCheck.unavailable
                      ? "Skill match could not be verified"
                      : "No required skills match"}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {skillCheck.unavailable
                      ? `Required skill details are not available for ${selected.title}. Would you still like to invite ${profile.fullName}?`
                      : `${profile.fullName} does not have any of the required skills listed for ${selected.title}. Would you still like to invite them?`}
                  </p>
                </div>
                {skillCheck.required.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold">
                      Project requirements
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {skillCheck.required.map((skill) => (
                        <span
                          key={skill}
                          className="max-w-full break-words rounded-md border border-border/60 bg-surface-2/40 px-2.5 py-1.5 text-xs text-foreground/80 [overflow-wrap:anywhere]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs leading-6 text-muted-foreground">
                  This sends an invitation. {profile.fullName} will join the
                  project only after accepting.
                </p>
              </section>
            ) : loading ? (
              <LoadingLine>Loading your projects</LoadingLine>
            ) : loadError ? (
              <InlineError
                message="Your projects could not be loaded."
                onRetry={() => setReload((value) => value + 1)}
              />
            ) : !projects.length ? (
              <div className="rounded-lg border border-border/65 bg-surface-2/35 p-4">
                <p className="text-xs leading-6 text-muted-foreground">
                  Create an active or pending project to invite this Allocat.
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <SearchIcon
                    size={14}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="search"
                    value={query}
                    disabled={sending}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search your projects"
                    placeholder="Search your projects"
                    className={
                      "h-11 w-full rounded-lg border border-input bg-surface-2/40 pl-9 pr-3 text-base outline-none placeholder:text-muted-foreground/75 lg:text-xs " +
                      focus
                    }
                  />
                </div>
                <fieldset disabled={sending} className="space-y-2">
                  <legend className="sr-only">Choose a project</legend>
                  {visible.map((project) => (
                    <label
                      key={project.id}
                      className="relative block cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="profile-invite-project"
                        value={project.id}
                        checked={selectedId === project.id}
                        onChange={() => {
                          setSelectedId(project.id);
                          setConfirmProjectId(null);
                          setSubmitError(null);
                        }}
                        className="peer sr-only"
                      />
                      <span
                        className={
                          "flex min-h-16 items-center justify-between gap-3 rounded-xl border p-4 peer-focus-visible:ring-2 peer-focus-visible:ring-ring/35 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 " +
                          (selectedId === project.id
                            ? "border-brand-secondary-highlight/35 bg-brand-secondary-highlight/[0.07] dark:border-secondary/35 dark:bg-secondary/[0.08]"
                            : "border-border/65 bg-surface-2/25 hover:border-border")
                        }
                      >
                        <span className="min-w-0">
                          <span
                            title={project.title}
                            className="block truncate text-xs font-medium"
                          >
                            {project.title}
                          </span>
                          <span className="mt-1.5 block">
                            <ProjectStatus status={project.status} />
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border " +
                            (selectedId === project.id
                              ? "border-brand-secondary-highlight bg-brand-secondary-highlight text-primary-foreground dark:border-secondary dark:bg-secondary dark:text-secondary-foreground"
                              : "border-border")
                          }
                        >
                          {selectedId === project.id && (
                            <CheckIcon size={12} aria-hidden="true" />
                          )}
                        </span>
                      </span>
                    </label>
                  ))}
                  {!visible.length && (
                    <p className="py-3 text-xs text-muted-foreground">
                      No matching projects. Try another name or code.
                    </p>
                  )}
                </fieldset>
                {selectedId &&
                (checking || relationshipProjectId !== selectedId) ? (
                  <LoadingLine>Checking project invitation</LoadingLine>
                ) : relationshipError ? (
                  <InlineError
                    message="The project relationship could not be checked."
                    onRetry={() => setRelationshipReload((value) => value + 1)}
                  />
                ) : alreadyAccepted ? (
                  <p
                    role="status"
                    className="rounded-lg border border-border/65 bg-surface-2/35 p-3 text-xs leading-6 text-status-complete-foreground"
                  >
                    This Allocat is already part of the selected project.
                  </p>
                ) : alreadyInvited ? (
                  <p
                    role="status"
                    className="rounded-lg border border-border/65 bg-surface-2/35 p-3 text-xs leading-6 text-status-pending-foreground"
                  >
                    An invitation is already waiting for this Allocat.
                  </p>
                ) : null}
              </>
            )}
            {!confirming && (
              <div className="border-t border-border/60 pt-4">
                <button
                  type="button"
                  disabled={sending}
                  onClick={startNewProject}
                  className={secondaryAction + " w-full"}
                >
                  <PlusIcon size={14} aria-hidden="true" />
                  Start a new project instead
                </button>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {profile.fullName} will be carried into the new project flow.
                </p>
              </div>
            )}
            {submitError && (
              <p
                role="alert"
                className="text-xs leading-6 text-status-overdue-foreground"
              >
                {submitError}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="shrink-0 border-t border-border/65 bg-card px-5 py-4 gap-2 sm:px-6">
          {confirming ? (
            <>
              <button
                type="button"
                disabled={sending}
                onClick={() => {
                  setConfirmProjectId(null);
                  setSubmitError(null);
                }}
                className={quietAction}
              >
                Back to projects
              </button>
              <button
                type="button"
                disabled={!canSend || sending}
                onClick={() =>
                  void sendInvitation(confirmProjectId ?? undefined)
                }
                className={primaryAction}
              >
                {sending ? (
                  <LoaderCircleIcon
                    size={14}
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                ) : (
                  <SendIcon size={14} aria-hidden="true" />
                )}
                {sending ? "Sending…" : "Confirm and send invitation"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={sending}
                onClick={() => onOpenChange(false)}
                className={quietAction}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!canSend || sending}
                onClick={requestInvitation}
                className={primaryAction}
              >
                {sending ? (
                  <LoaderCircleIcon
                    size={14}
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                ) : (
                  <SendIcon size={14} aria-hidden="true" />
                )}
                {sending
                  ? "Sending…"
                  : relationship === "declined" || relationship === "removed"
                    ? "Invite again"
                    : "Send invitation"}
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
/* =========================================================
   PRESENTATION
========================================================= */
function ProfileMetric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="min-w-0 border-r border-border/65 px-3 py-4 last:border-r-0 sm:px-6 sm:py-5">
      <dt className="flex flex-wrap items-center gap-1.5 text-[10px] leading-4 text-muted-foreground">
        <span aria-hidden="true">{icon}</span>
        {label}
      </dt>
      <dd className="mt-2">
        <span
          className={`block break-words font-medium tracking-[-0.025em] tabular-nums ${value === "Not yet rated" || value === "Not listed" ? "text-xs leading-6 text-muted-foreground sm:text-sm" : "text-lg leading-6 sm:text-xl"}`}
        >
          {value}
        </span>
        <span className="mt-1 block text-[10px] leading-5 text-muted-foreground">
          {detail}
        </span>
      </dd>
    </div>
  );
}
function SectionHeading({
  title,
  id,
  count,
}: {
  eyebrow?: string;
  title: string;
  id: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2
        id={id}
        className="text-lg font-medium tracking-[-0.025em] sm:text-xl"
      >
        {title}
      </h2>
      {typeof count === "number" && count > 0 && (
        <span className="text-xs tabular-nums text-muted-foreground">
          {count.toLocaleString()}
        </span>
      )}
    </div>
  );
}
function SectionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={quietAction + " min-h-11 shrink-0 px-2.5"}>
      {children}
    </a>
  );
}
function LoadingLine({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="flex min-h-16 items-center gap-2.5 text-xs text-muted-foreground"
    >
      <LoaderCircleIcon
        size={14}
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-none"
      />
      {children}
    </div>
  );
}
function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-border/65 bg-surface-2/35 p-4"
    >
      <p className="text-xs leading-6 text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className={quietAction + " -ml-2.5 mt-2"}
      >
        <RefreshCwIcon size={12} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
function ProfileError({
  unavailable,
  unauthorized = false,
  onRetry,
}: {
  unavailable: boolean;
  unauthorized?: boolean;
  onRetry: () => void;
}) {
  return (
    <section
      className={
        surface +
        " flex min-h-[420px] flex-col items-center justify-center px-5 py-12 text-center"
      }
    >
      <UserRoundIcon
        size={28}
        aria-hidden="true"
        className="text-muted-foreground/70"
      />
      <h1 className="mt-5 text-xl font-medium tracking-[-0.025em]">
        {unavailable
          ? "Profile unavailable"
          : unauthorized
            ? "Public profile temporarily unavailable"
            : "This profile could not be loaded"}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {unavailable
          ? "This professional profile is not currently available to view."
          : unauthorized
            ? "This profile is temporarily unavailable. Please try again shortly."
            : "The connection was interrupted. Try loading the profile again."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {!unavailable && (
          <button type="button" onClick={onRetry} className={secondaryAction}>
            <RefreshCwIcon size={13} aria-hidden="true" />
            Try again
          </button>
        )}
        <Link to="/discover" className={primaryAction}>
          Discover Allocats
          <ArrowRightIcon size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading professional profile"
      className="space-y-6"
    >
      <span className="sr-only">Loading professional profile</span>
      <div aria-hidden="true" className={surface + " overflow-hidden"}>
        <div className="h-28 bg-surface-2/60" />
        <div className="space-y-4 p-6">
          <div className="h-24 w-24 animate-pulse rounded-2xl bg-surface-3 motion-reduce:animate-none" />
          <div className="h-6 w-2/3 max-w-sm animate-pulse rounded bg-surface-3 motion-reduce:animate-none" />
          <div className="h-4 w-1/2 max-w-xs animate-pulse rounded bg-surface-3 motion-reduce:animate-none" />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className={surface + " h-64 bg-surface-2/30"} />
        <div className={surface + " h-64 bg-surface-2/30"} />
      </div>
    </div>
  );
}
