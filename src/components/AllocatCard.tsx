import { useEffect, useRef, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
type CardMode = "project" | "discovery";
type Props = {
  allocat: CardAllocat;
  project?: Project;
  relationshipStatus?: ProjectAllocatStatus | null;
  onStatusChange?: (status: ProjectAllocatStatus) => void;
  viewMode?: "grid" | "list";
  mode?: CardMode;
  onStartProject?: () => void;
};
const ACCENT = "text-brand-secondary-highlight dark:text-secondary";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-card";
const CARD =
  "min-w-0 rounded-2xl border border-border/75 bg-card text-card-foreground shadow-[0_2px_8px_-5px_color-mix(in_srgb,var(--brand-charcoal)_18%,transparent)] transition-[border-color,box-shadow] duration-150 hover:border-brand-secondary-highlight/25 hover:shadow-[0_10px_28px_-20px_color-mix(in_srgb,var(--brand-charcoal)_30%,transparent)] focus-within:border-ring/40 dark:hover:border-secondary/25 motion-reduce:transition-none";
const ACTION = `inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium shadow-none transition-opacity duration-150 hover:opacity-80 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;
const PRIMARY =
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground dark:border-secondary/15 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground";
const SECONDARY =
  "border border-border/75 bg-transparent text-foreground hover:bg-transparent hover:text-foreground";
const STATUS =
  "border border-border/65 bg-surface-2/65 text-muted-foreground hover:bg-surface-2/65 hover:text-muted-foreground disabled:opacity-100";
const SKILL =
  "inline-flex max-w-full items-center rounded-md border border-border/65 bg-surface-2/55 px-2 py-1 text-[10px] font-medium leading-4 text-muted-foreground";
const numberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});
const countFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});
const joinedFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  year: "numeric",
});
export function AllocatCardGrid({
  allocat,
  project,
  relationshipStatus = null,
  onStatusChange,
  viewMode = "grid",
  mode = "project",
  onStartProject,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(() =>
    normalizeStatus(relationshipStatus),
  );
  const [pendingScope, setPendingScope] = useState<string | null>(null);
  const requests = useRef(new Set<string>());
  const mounted = useRef(true);
  const scope = JSON.stringify([project?.id, allocat.allocatrUserId, mode]);
  const currentScope = useRef(scope);
  currentScope.current = scope;
  const statusRef = useRef(localStatus);
  statusRef.current = localStatus;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    setLocalStatus(normalizeStatus(relationshipStatus));
  }, [relationshipStatus, scope]);
  useEffect(() => {
    setProfileOpen(false);
  }, [scope]);
  const inviting = pendingScope === scope;
  const isDiscovery = mode === "discovery";
  const isInvited = localStatus === "invited";
  const isAccepted = localStatus === "accepted";
  const reinvite = localStatus === "declined" || localStatus === "removed";
  const canInvite =
    !isDiscovery && !!project && !inviting && !isInvited && !isAccepted;
  const name = allocat.fullName?.trim() || "Allocat professional";
  const title =
    allocat.title?.trim() ||
    allocat.headline?.trim() ||
    "Professional service provider";
  const verified = Boolean(allocat.isVerified ?? allocat.verified ?? false);
  const rating = Math.min(
    5,
    safeNumber(allocat.rating ?? allocat.averageRating),
  );
  const ratingCount = Math.floor(safeNumber(allocat.ratingCount));
  const experience = safeNumber(allocat.yearsExperience);
  const completed = Math.floor(safeNumber(allocat.completedProjects));
  const rate = formatHourlyRate(allocat.hourlyRate, allocat.currency);
  const joined = formatJoinedDate(allocat.joinedAt);
  const skills = normalizeSkills(allocat.skills);
  const visibleSkills = skills.slice(0, viewMode === "list" ? 5 : 3);
  const remainingSkills = skills.slice(visibleSkills.length);
  const matchScore =
    typeof allocat.matchScore === "number" &&
    Number.isFinite(allocat.matchScore)
      ? Math.round(Math.min(100, Math.max(0, allocat.matchScore)))
      : undefined;
  // The dialog's public profile contract uses skill names. Keep the card's
  // catalogue metadata here and avoid casting an object skill array to string[].
  const dialogProfile: AllocatProfile = {
    ...allocat,
    skills: skills.map((skill) => skill.name),
  };
  async function handleInvite() {
    if (!project || !canInvite || requests.current.has(scope)) return;
    const requestScope = scope;
    const personId = allocat.allocatrUserId;
    const projectId = project.id;
    requests.current.add(requestScope);
    setPendingScope(requestScope);
    try {
      await api.put(
        `/projects/${encodeURIComponent(projectId)}/allocats/${encodeURIComponent(personId)}/invite`,
        {},
        { withCredentials: true },
      );
    } catch {
      if (mounted.current && currentScope.current === requestScope)
        toast.error("The invitation could not be sent. Please try again.");
      return;
    } finally {
      requests.current.delete(requestScope);
      if (mounted.current)
        setPendingScope((current) =>
          current === requestScope ? null : current,
        );
    }
    if (!mounted.current || currentScope.current !== requestScope) return;
    // Keep the successful action visible even if the parent does not re-fetch
    // immediately. Do not downgrade a newer Accepted state to Invited.
    if (statusRef.current !== "accepted") {
      setLocalStatus("invited");
      toast.success(`${name} has been invited to ${project.title}.`);
      onStatusChange?.("Invited");
    }
  }
  function handleStartProject() {
    if (!onStartProject || inviting) return;
    setProfileOpen(false);
    onStartProject();
  }
  function actions() {
    const Icon = inviting
      ? LoaderCircleIcon
      : isInvited || isAccepted
        ? CheckCircle2Icon
        : reinvite
          ? RotateCcwIcon
          : SendIcon;
    const label = inviting
      ? "Inviting…"
      : isAccepted
        ? "Added"
        : isInvited
          ? "Invited"
          : reinvite
            ? "Invite again"
            : "Invite";
    return (
      <>
        <Button
          type="button"
          variant="ghost"
          aria-label={`View profile: ${name}`}
          onClick={() => setProfileOpen(true)}
          className={`${ACTION} ${SECONDARY} flex-1`}
        >
          <UserRoundIcon size={14} aria-hidden="true" />
          Profile
        </Button>
        {isDiscovery ? (
          <Button
            type="button"
            aria-label={`Start a project with ${name}`}
            onClick={handleStartProject}
            disabled={!onStartProject || inviting}
            className={`${ACTION} ${PRIMARY} flex-1`}
          >
            <BriefcaseBusinessIcon size={14} aria-hidden="true" />
            Start project
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => void handleInvite()}
            disabled={!canInvite}
            aria-busy={inviting}
            aria-label={`${label.replace("…", "")} ${name}`}
            className={`${ACTION} ${isInvited || isAccepted ? STATUS : PRIMARY} flex-1`}
          >
            <Icon
              size={14}
              aria-hidden="true"
              className={
                inviting ? "animate-spin motion-reduce:animate-none" : ""
              }
            />
            {label}
          </Button>
        )}
      </>
    );
  }
  function skillBadges() {
    return (
      <>
        {visibleSkills.map((skill) => (
          <span key={skill.key} title={skill.name} className={SKILL}>
            <span className="truncate">{skill.name}</span>
          </span>
        ))}
        {remainingSkills.length > 0 && (
          <span
            title={remainingSkills.map((skill) => skill.name).join(", ")}
            aria-label={`${remainingSkills.length} more skills: ${remainingSkills.map((skill) => skill.name).join(", ")}`}
            className={SKILL}
          >
            +{remainingSkills.length}
          </span>
        )}
      </>
    );
  }
  function identity() {
    return (
      <>
        <h2 className="min-w-0 text-[15px] font-medium leading-6 tracking-[-0.025em]">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            title={name}
            aria-label={`View profile: ${name}`}
            className={`block max-w-full rounded text-left transition-opacity hover:opacity-75 motion-reduce:transition-none ${FOCUS}`}
          >
            <span className="line-clamp-2 break-words">{name}</span>
          </button>
        </h2>
        <p
          title={title}
          className="mt-1 line-clamp-2 break-words text-xs leading-5 text-muted-foreground"
        >
          {title}
        </p>
      </>
    );
  }
  function trustLine() {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-muted-foreground">
        <Rating rating={rating} count={ratingCount} />
        {experience > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseBusinessIcon
              size={12}
              aria-hidden="true"
              className="shrink-0"
            />
            {numberFormat.format(experience)}{" "}
            {experience === 1 ? "year" : "years"} experience
          </span>
        )}
      </div>
    );
  }
  function locationLine() {
    return (
      <span
        title={allocat.location || undefined}
        className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-[11px] leading-5 text-muted-foreground"
      >
        <MapPinIcon size={13} aria-hidden="true" className="shrink-0" />
        <span className="truncate">
          {allocat.location?.trim() || "Location not listed"}
        </span>
      </span>
    );
  }
  const match =
    !isDiscovery && matchScore !== undefined ? (
      <MatchBadge
        score={matchScore}
        matched={allocat.matchedSkillCount}
        required={allocat.requiredSkillCount}
      />
    ) : null;
  return (
    <>
      {viewMode === "list" ? (
        <article className={`${CARD} p-4 sm:p-5`} aria-busy={inviting}>
          <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <ProfileAvatar
                name={name}
                url={allocat.avatarUrl}
                verified={verified}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                  <div className="min-w-0 flex-1">{identity()}</div>
                  {match}
                </div>
                <div className="mt-2.5">{trustLine()}</div>
                <div className="mt-2">{locationLine()}</div>
                {skills.length > 0 && (
                  <div
                    aria-label="Skills"
                    className="mt-3 flex flex-wrap gap-1.5"
                  >
                    {skillBadges()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-3 border-t border-border/65 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 xl:shrink-0 xl:border-t-0 xl:pt-0">
              <div className="flex items-baseline justify-between gap-3 sm:block">
                <p className="text-[10px] text-muted-foreground">Hourly rate</p>
                <Rate value={rate} compact />
              </div>
              <div className="flex min-w-0 items-center gap-2 sm:w-[248px]">
                {actions()}
              </div>
            </div>
          </div>
        </article>
      ) : (
        <article
          className={`${CARD} flex h-full flex-col p-5`}
          aria-busy={inviting}
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <ProfileAvatar
              name={name}
              url={allocat.avatarUrl}
              verified={verified}
            />
            <div className="min-w-0 flex-1">{identity()}</div>
          </div>
          <div className="mt-4">{trustLine()}</div>
          <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
            {locationLine()}
            {match}
          </div>
          <div
            aria-label="Skills"
            className="mt-4 flex min-h-14 flex-wrap content-start items-start gap-1.5"
          >
            {skills.length ? (
              skillBadges()
            ) : (
              <span className="text-[11px] leading-5 text-muted-foreground">
                Skills not listed
              </span>
            )}
          </div>
          <div className="mt-auto pt-5">
            <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)_minmax(0,1fr)] items-start gap-3 border-t border-border/65 pt-4">
              <div className="min-w-0">
                <p className="mb-1.5 text-[10px] text-muted-foreground">
                  Hourly rate
                </p>
                <Rate value={rate} />
              </div>
              <Metric label="Completed" value={countFormat.format(completed)} />
              <Metric label="Joined" value={joined} />
            </div>
            <div className="mt-5 flex min-w-0 items-center gap-2">
              {actions()}
            </div>
          </div>
        </article>
      )}
      <AllocatProfileDialog
        allocat={dialogProfile}
        project={project}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        invited={isInvited}
        accepted={isAccepted}
        inviting={inviting}
        onInvite={canInvite ? () => void handleInvite() : undefined}
        mode={mode}
        onStartProject={
          isDiscovery && onStartProject ? handleStartProject : undefined
        }
      />
    </>
  );
}
function ProfileAvatar({
  name,
  url,
  verified,
}: {
  name: string;
  url?: string | null;
  verified: boolean;
}) {
  return (
    <div className="relative shrink-0">
      <Avatar
        aria-hidden="true"
        className="h-12 w-12 border border-border/70 bg-surface-2 sm:h-14 sm:w-14"
      >
        <AvatarImage src={url || undefined} alt="" className="object-cover" />
        <AvatarFallback
          className={`bg-surface-2 text-xs font-medium ${ACCENT}`}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {verified && (
        <span
          title="Verified profile"
          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
        >
          <BadgeCheckIcon size={11} aria-hidden="true" />
          <span className="sr-only">Verified profile</span>
        </span>
      )}
    </div>
  );
}
function Rating({ rating, count }: { rating: number; count: number }) {
  const description =
    rating > 0
      ? `${rating.toFixed(1)} out of 5${count > 0 ? ` from ${countFormat.format(count)} ${count === 1 ? "review" : "reviews"}` : ""}`
      : "Not yet rated";
  return (
    <span
      role="img"
      aria-label={description}
      title={description}
      className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground"
    >
      <StarIcon
        size={12}
        aria-hidden="true"
        className={
          rating > 0
            ? "fill-brand-amber/75 text-brand-amber"
            : "text-muted-foreground/60"
        }
      />
      <span
        aria-hidden="true"
        className={rating > 0 ? "font-medium text-foreground" : ""}
      >
        {rating > 0 ? rating.toFixed(1) : "Not yet rated"}
      </span>
      {rating > 0 && count > 0 && (
        <span aria-hidden="true">({countFormat.format(count)})</span>
      )}
    </span>
  );
}
function Rate({
  value,
  compact = false,
}: {
  value: string | null;
  compact?: boolean;
}) {
  return (
    <p
      title={value ? `${value} per hour` : "Rate on request"}
      className={`min-w-0 ${compact ? "sm:mt-1" : ""}`}
    >
      <span
        className={`block truncate ${value ? "text-base font-medium tracking-[-0.03em] text-foreground sm:text-lg" : "text-[11px] font-medium leading-6 text-muted-foreground"}`}
      >
        {value ?? "On request"}
        {value && (
          <span className="ml-0.5 text-[10px] font-normal tracking-normal text-muted-foreground">
            /hr
          </span>
        )}
      </span>
    </p>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[10px] text-muted-foreground">{label}</p>
      <p
        title={value}
        className="truncate text-xs font-medium leading-6 text-foreground/85"
      >
        {value}
      </p>
    </div>
  );
}
function MatchBadge({
  score,
  matched,
  required,
}: {
  score: number;
  matched?: number;
  required?: number;
}) {
  const detail =
    typeof matched === "number" &&
    Number.isFinite(matched) &&
    matched >= 0 &&
    typeof required === "number" &&
    Number.isFinite(required) &&
    required > 0 &&
    matched <= required
      ? ` · ${matched} of ${required} required skills matched`
      : "";
  return (
    <span
      title={`${score}% project match${detail}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-md border border-brand-secondary-highlight/15 bg-brand-secondary-highlight/[0.045] px-2 py-1 text-[10px] font-medium dark:border-secondary/15 dark:bg-secondary/[0.055] ${ACCENT}`}
    >
      <SparklesIcon size={10} aria-hidden="true" />
      {score}% match
    </span>
  );
}
function safeNumber(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}
function normalizeStatus(value?: ProjectAllocatStatus | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}
function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "A"
  );
}
function formatJoinedDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? joinedFormat.format(date) : "—";
}
function formatHourlyRate(value?: number | null, currency?: string | null) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    return null;
  const code = currency?.trim().toUpperCase();
  if (!code || !/^[A-Z]{3}$/.test(code)) return null;
  return `${code === "USD" ? "US$" : `${code} `}${numberFormat.format(value)}`;
}
function normalizeSkills(input?: SkillItem[]) {
  const unique = new Map<
    string,
    {
      key: string;
      name: string;
    }
  >();
  for (const item of Array.isArray(input) ? input : []) {
    const name = (typeof item === "string" ? item : item?.name)?.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (!unique.has(key)) unique.set(key, { key, name });
  }
  return [...unique.values()];
}
