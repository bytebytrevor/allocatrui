import { type ReactNode } from "react";
import {
  ArrowUpRightIcon,
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
  type LucideIcon,
} from "lucide-react";
import type { AllocatProfile } from "@/Types/allocatProfile";
import type { Project } from "@/Types/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
type SkillItem =
  | string
  | {
      id?: string;
      name: string;
      categoryId?: string;
      category?: string;
    };
type DialogAllocat = Omit<
  AllocatProfile,
  "skills" | "availability" | "verified"
> & {
  skills?: SkillItem[];
  matchScore?: number;
  averageRating?: number;
  verified?: boolean;
  isVerified?: boolean;
  availability?: boolean | string;
};
type DialogMode = "project" | "discovery";
type Props = {
  allocat: DialogAllocat;
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invited?: boolean;
  accepted?: boolean;
  inviting?: boolean;
  onInvite?: () => void;
  mode?: DialogMode;
  onStartProject?: () => void;
};
const ACCENT = "text-brand-secondary-highlight dark:text-secondary";
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-card";
const ACTION = `inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-4 text-xs font-medium shadow-none transition-opacity duration-150 hover:opacity-80 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;
const PRIMARY =
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground dark:border-secondary/15 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground";
const SECONDARY =
  "border border-border/75 bg-transparent text-foreground hover:bg-transparent hover:text-foreground";
const STATUS =
  "border border-border/65 bg-surface-2/65 text-muted-foreground hover:bg-surface-2/65 hover:text-muted-foreground disabled:opacity-100";
const amountFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});
const countFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});
const joinedFormat = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});
export default function AllocatProfileDialog({
  allocat,
  project,
  open,
  onOpenChange,
  invited = false,
  accepted = false,
  inviting = false,
  onInvite,
  mode,
  onStartProject,
}: Props) {
  const name = allocat.fullName?.trim() || "Allocat professional";
  const title =
    allocat.title?.trim() ||
    allocat.headline?.trim() ||
    "Professional service provider";
  const rating = Math.min(
    5,
    safeNumber(allocat.rating ?? allocat.averageRating),
  );
  const reviews = Math.floor(safeNumber(allocat.ratingCount));
  const completed = Math.floor(safeNumber(allocat.completedProjects));
  const experience = safeNumber(allocat.yearsExperience);
  const verified = Boolean(allocat.isVerified ?? allocat.verified ?? false);
  const availability = formatAvailability(
    allocat.availabilityStatus || allocat.availability,
  );
  const rate = formatHourlyRate(allocat.hourlyRate, allocat.currency);
  const skills = normalizeSkills(allocat.skills);
  const isDiscovery = mode === "discovery" || !project;
  const match =
    typeof allocat.matchScore === "number" &&
    Number.isFinite(allocat.matchScore)
      ? Math.round(Math.min(100, Math.max(0, allocat.matchScore)))
      : undefined;
  const profileId = allocat.allocatrUserId?.trim();
  const fullProfileUrl = profileId
    ? `/allocats/${encodeURIComponent(profileId)}${!isDiscovery && project ? `?projectId=${encodeURIComponent(project.id)}` : ""}`
    : null;
  const ratingDescription =
    rating > 0
      ? `${rating.toFixed(1)} out of 5${reviews > 0 ? ` from ${countFormat.format(reviews)} ${reviews === 1 ? "review" : "reviews"}` : ""}`
      : "Not yet rated";
  const footerTitle = isDiscovery
    ? "Start a project together"
    : inviting
      ? "Sending invitation…"
      : accepted
        ? "Already on this project"
        : invited
          ? "Invitation sent"
          : "Add to your project";
  const footerDescription = isDiscovery
    ? `Create a project and invite ${name} when you’re ready.`
    : accepted
      ? `Added to ${project?.title || "your project"}.`
      : invited
        ? `Awaiting a response for ${project?.title || "your project"}.`
        : project?.title || "Invite this Allocat to your project.";
  function close() {
    if (!inviting) onOpenChange(false);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!inviting) onOpenChange(next);
      }}
    >
      <DialogContent
        aria-busy={inviting}
        className="flex max-h-[92dvh] w-[calc(100vw-24px)] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-card p-0 text-card-foreground shadow-[0_24px_80px_-24px_color-mix(in_srgb,var(--brand-charcoal)_50%,transparent)] motion-reduce:animate-none sm:max-w-[720px] [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button]:bg-card [&>button]:text-muted-foreground [&>button]:opacity-100"
      >
        {/* Identity scrolls with the profile, leaving space for the action bar
            even on short or landscape screens. Radix retains focus trapping. */}
        <div
          role="region"
          aria-label="Profile details"
          tabIndex={0}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/30"
        >
          <DialogHeader className="border-b border-border/65 px-5 pb-6 pt-6 text-left sm:px-7 sm:pt-7">
            <div className="flex min-w-0 items-start gap-3.5 pr-9 sm:gap-5">
              <Avatar
                aria-hidden="true"
                className="h-14 w-14 shrink-0 border border-border/70 bg-surface-2 sm:h-16 sm:w-16"
              >
                <AvatarImage
                  src={allocat.avatarUrl || undefined}
                  alt=""
                  className="object-cover"
                />
                <AvatarFallback
                  className={`bg-surface-2 text-sm font-medium ${ACCENT}`}
                >
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <DialogTitle className="break-words text-xl font-medium leading-7 tracking-[-0.035em] [overflow-wrap:anywhere] sm:text-2xl sm:leading-8">
                  {name}
                </DialogTitle>
                <DialogDescription className="mt-1.5 break-words text-[13px] leading-6 text-muted-foreground [overflow-wrap:anywhere]">
                  {title}
                </DialogDescription>
                {verified && (
                  <span
                    className={`mt-2 inline-flex items-center gap-1 text-[10px] font-medium ${ACCENT}`}
                  >
                    <BadgeCheckIcon size={13} aria-hidden="true" />
                    Verified profile
                  </span>
                )}
              </div>
            </div>
            <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
              <span
                role="img"
                aria-label={ratingDescription}
                title={ratingDescription}
                className="inline-flex items-center gap-1.5"
              >
                <StarIcon
                  size={13}
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
                {rating > 0 && reviews > 0 && (
                  <span aria-hidden="true">
                    ({countFormat.format(reviews)}{" "}
                    {reviews === 1 ? "review" : "reviews"})
                  </span>
                )}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2Icon size={13} aria-hidden="true" />
                {countFormat.format(completed)}{" "}
                {completed === 1 ? "project" : "projects"} completed
              </span>
              {!!allocat.location?.trim() && (
                <span className="inline-flex min-w-0 max-w-full items-start gap-1.5">
                  <MapPinIcon
                    size={13}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />
                  <span className="break-words [overflow-wrap:anywhere]">
                    {allocat.location.trim()}
                  </span>
                </span>
              )}
            </div>
            {fullProfileUrl && (
              <a
                href={fullProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 inline-flex min-h-10 items-center gap-1.5 self-start rounded-md text-xs font-medium transition-opacity hover:opacity-75 motion-reduce:transition-none ${ACCENT} ${FOCUS}`}
              >
                Open full profile
                <ArrowUpRightIcon size={13} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab or window)</span>
              </a>
            )}
          </DialogHeader>

          <div className="px-5 sm:px-7">
            <ProfileSection title="About this Allocat">
              <p className="whitespace-pre-wrap break-words text-[13px] leading-7 text-foreground/85 [overflow-wrap:anywhere]">
                {allocat.bio?.trim() ||
                  "This Allocat has not added a profile description yet."}
              </p>
            </ProfileSection>
            <ProfileSection title="Skills & expertise">
              {skills.length ? (
                <ul className="flex flex-wrap gap-2" aria-label="Skills">
                  {skills.map((skill) => (
                    <li
                      key={skill.key}
                      className="max-w-full rounded-lg border border-border/65 bg-surface-2/55 px-2.5 py-1.5 text-[11px] font-medium leading-5 text-foreground/85"
                    >
                      <span className="break-words [overflow-wrap:anywhere]">
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs leading-6 text-muted-foreground">
                  No skills have been listed yet.
                </p>
              )}
            </ProfileSection>
            <ProfileSection title="Working details" bordered={false}>
              <dl className="grid gap-5 sm:grid-cols-3">
                <Detail
                  icon={BriefcaseBusinessIcon}
                  label="Experience"
                  value={
                    experience > 0
                      ? `${amountFormat.format(experience)} ${experience === 1 ? "year" : "years"}`
                      : "Not listed"
                  }
                />
                <Detail
                  icon={Clock3Icon}
                  label="Availability"
                  value={availability}
                />
                <Detail
                  icon={CalendarDaysIcon}
                  label="Member since"
                  value={formatJoinedDate(allocat.joinedAt)}
                />
              </dl>
            </ProfileSection>
            <section
              aria-label="Rate and project context"
              className="mb-6 rounded-xl border border-border/70 bg-surface-2/50 p-4 sm:mb-7 sm:p-5"
            >
              <div
                className={`grid gap-5 ${!isDiscovery && match !== undefined ? "sm:grid-cols-[minmax(0,1fr)_160px]" : ""}`}
              >
                <div className="min-w-0">
                  <h3 className="text-[11px] font-medium text-muted-foreground">
                    Hourly rate
                  </h3>
                  <p className="mt-2 break-words text-2xl font-medium leading-8 tracking-[-0.035em] [overflow-wrap:anywhere]">
                    {rate ?? "On request"}
                    {rate && (
                      <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground">
                        /hour
                      </span>
                    )}
                  </p>
                  <p className="mt-2 max-w-md text-[11px] leading-6 text-muted-foreground">
                    {isDiscovery
                      ? "Confirm scope, availability and terms when you start a project together."
                      : accepted
                        ? "Confirm scope and terms with your project team."
                        : "Confirm scope, availability and terms after the invitation is accepted."}
                  </p>
                </div>
                {!isDiscovery && match !== undefined && (
                  <div className="min-w-0 border-t border-border/65 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                    <h3 className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <SparklesIcon size={12} aria-hidden="true" />
                      Project match
                    </h3>
                    <p
                      className={`mt-2 text-2xl font-medium leading-8 tracking-[-0.035em] ${ACCENT}`}
                    >
                      {match}%
                    </p>
                    <p
                      title={project?.title}
                      className="mt-2 break-words text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]"
                    >
                      Based on {project?.title || "this project"}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div
          role="group"
          aria-label="Profile actions"
          className="shrink-0 border-t border-border/70 bg-card px-5 py-4 sm:px-7"
        >
          <p role="status" aria-live="polite" className="sr-only">
            {inviting
              ? "Sending invitation. Please wait."
              : !isDiscovery && accepted
                ? "This Allocat is already on the project."
                : !isDiscovery && invited
                  ? "Invitation sent."
                  : ""}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="min-w-0">
              <p className="text-xs font-medium leading-5">{footerTitle}</p>
              <p
                title={footerDescription}
                className="mt-1 hidden text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere] sm:line-clamp-2"
              >
                {footerDescription}
              </p>
            </div>
            <div className="grid w-full shrink-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-2 sm:flex sm:w-auto">
              <Button
                type="button"
                variant="ghost"
                disabled={inviting}
                onClick={close}
                className={`${ACTION} ${SECONDARY}`}
              >
                Close
              </Button>
              {isDiscovery ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onStartProject}
                  disabled={!onStartProject || inviting}
                  className={`${ACTION} ${PRIMARY}`}
                >
                  <BriefcaseBusinessIcon size={14} aria-hidden="true" />
                  Start a project
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onInvite}
                  disabled={
                    !project || !onInvite || inviting || invited || accepted
                  }
                  aria-busy={inviting}
                  className={`${ACTION} ${invited || accepted ? STATUS : PRIMARY}`}
                >
                  {inviting ? (
                    <>
                      <LoaderCircleIcon
                        size={14}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                      Sending…
                    </>
                  ) : accepted ? (
                    <>
                      <CheckCircle2Icon size={14} aria-hidden="true" />
                      Added
                    </>
                  ) : invited ? (
                    <>
                      <CheckCircle2Icon size={14} aria-hidden="true" />
                      Invited
                    </>
                  ) : (
                    <>
                      <SendIcon size={14} aria-hidden="true" />
                      Invite to project
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function ProfileSection({
  title,
  children,
  bordered = true,
}: {
  title: string;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <section className={`py-6 ${bordered ? "border-b border-border/65" : ""}`}>
      <h3 className="mb-3 text-sm font-medium tracking-[-0.015em]">{title}</h3>
      {children}
    </section>
  );
}
function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground"
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] leading-4 text-muted-foreground">{label}</dt>
        <dd className="mt-1 break-words text-xs font-medium leading-5 [overflow-wrap:anywhere]">
          {value}
        </dd>
      </div>
    </div>
  );
}
function safeNumber(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
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
function formatAvailability(value?: boolean | string) {
  if (value === true) return "Available";
  if (value === false) return "Unavailable";
  const text = value?.trim().replace(/[-_]/g, " ").replace(/\s+/g, " ");
  return text
    ? text.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Contact to confirm";
}
function formatHourlyRate(value?: number | null, currency?: string | null) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    return null;
  const code = currency?.trim().toUpperCase();
  if (!code || !/^[A-Z]{3}$/.test(code)) return null;
  return `${code === "USD" ? "US$" : `${code} `}${amountFormat.format(value)}`;
}
function formatJoinedDate(value?: string) {
  if (!value) return "Not listed";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? joinedFormat.format(date)
    : "Not listed";
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
