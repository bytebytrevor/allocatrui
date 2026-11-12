import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { isAxiosError } from "axios";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CheckIcon,
  CircleDollarSignIcon,
  CopyIcon,
  EyeIcon,
  FilmIcon,
  ImageIcon,
  FileTextIcon,
  LoaderCircleIcon,
  SendIcon,
  SparklesIcon,
  UserRoundIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type InvitationAction = "accept" | "decline";

type InvitationSkill = {
  id: string;
  name: string;
  categoryId?: string;
  category?: string;
};

type InvitationFile = {
  id: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
};

type InvitationPreview = {
  id: string;
  projectCode: string | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  budget: number | null;
  currency: string | null;
  startDate: string | null;
  dueDate: string | null;
  invitedAt: string | null;
  client: {
    fullName: string | null;
    city: string | null;
    country: string | null;
    countryCode: string | null;
  };
  skills: InvitationSkill[];
  files: InvitationFile[];
};
type Props = {
  project: { id: string; title: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responding: InvitationAction | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
};
const primaryActionButton = [
  "border border-brand-secondary-highlight/20 bg-brand-secondary-highlight text-primary-foreground",
  "hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90",
  "dark:border-secondary/20 dark:bg-secondary dark:text-secondary-foreground",
  "dark:hover:bg-secondary dark:hover:text-secondary-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring/35 motion-reduce:transition-none",
].join(" ");

/** Loads only the brief the authenticated Allocat has been invited to review. */
export default function ProjectInvitationDialog({
  project,
  open,
  onOpenChange,
  responding,
  onAccept,
  onDecline,
}: Props) {
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestedId = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let cancelled = false;
    requestedId.current = project.id;
    setPreview(null);
    setLoading(true);
    setError(null);
    async function load() {
      try {
        const [response, catalogue] = await Promise.all([
          api.get<InvitationPreview>(
            `/projects/${encodeURIComponent(project.id)}/invitation-preview`,
            {
              withCredentials: true,
              signal: controller.signal,
            },
          ),
          // The invitation endpoint currently returns skill IDs/names only.
          // Resolve categories from the catalogue without opening the project workspace.
          api
            .get<
              InvitationSkill[]
            >("/skills", { withCredentials: true, signal: controller.signal })
            .catch(() => null),
        ]);
        if (cancelled) return;
        if (!validPreview(response.data, project.id))
          throw new Error("Invalid preview");
        const byId = new Map(
          (Array.isArray(catalogue?.data) ? catalogue.data : []).map(
            (skill) => [skill.id.trim().toLowerCase(), skill],
          ),
        );
        setPreview({
          ...response.data,
          skills: response.data.skills.map((skill) => {
            const canonical = byId.get(skill.id.trim().toLowerCase());
            return {
              ...skill,
              categoryId: canonical?.categoryId || skill.categoryId,
              category: canonical?.category || skill.category,
            };
          }),
        });
      } catch (failure) {
        if (cancelled) return;
        const unavailable =
          isAxiosError(failure) &&
          [403, 404].includes(failure.response?.status ?? 0);
        setError(
          unavailable
            ? "This invitation is no longer available to review. Refresh your invitations to check its status."
            : "The full project brief could not be loaded. Please try again before accepting.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [open, project.id, attempt]);

  const details = preview?.id === project.id ? preview : null;
  const teamProject = details
    ? hasMultipleSkillCategories(details.skills)
    : false;
  const ready =
    open &&
    !loading &&
    !error &&
    details !== null &&
    requestedId.current === project.id;
  const location = details
    ? [
        details.client.city,
        details.client.country || details.client.countryCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "";
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!responding) onOpenChange(next);
      }}
    >
      <DialogContent
        onEscapeKeyDown={(event) => {
          if (responding) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (responding) event.preventDefault();
        }}
        style={
          {
            "--invitation-warm-ink":
              "color-mix(in srgb, var(--brand-amber) 48%, var(--foreground))",
          } as CSSProperties
        }
        className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-xl border-border/70 bg-card p-0 text-card-foreground shadow-xl shadow-black/10 sm:max-w-2xl dark:border-border"
      >
        <DialogHeader className="shrink-0 border-b border-border/60 px-5 pb-5 pt-6 text-left sm:px-7 sm:pt-7">
          <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-md bg-brand-amber/15 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--invitation-warm-ink)]">
            <SendIcon
              size={13}
              strokeWidth={1.7}
              aria-hidden="true"
              className="shrink-0"
            />
            Project invitation
          </p>
          <DialogTitle className="break-words pr-6 text-xl font-medium leading-snug tracking-[-0.025em] sm:text-2xl [overflow-wrap:anywhere]">
            {details?.title ?? project.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-[13px] leading-6 text-muted-foreground">
            Review the brief before accepting the invitation.
          </DialogDescription>
        </DialogHeader>

        <div
          aria-busy={loading}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7"
        >
          {!ready && !error && (
            <div
              role="status"
              className="flex min-h-56 items-center justify-center gap-2.5 text-[13px] text-muted-foreground"
            >
              <LoaderCircleIcon
                size={16}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
              Loading project brief
            </div>
          )}
          {error && (
            <div role="alert" className="py-6">
              <AlertCircleIcon
                size={21}
                strokeWidth={1.7}
                aria-hidden="true"
                className="mb-4 text-muted-foreground"
              />
              <h3 className="text-sm font-medium">The brief is unavailable</h3>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                {error}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => setAttempt((value) => value + 1)}
                className="mt-4 h-10 rounded-lg border-border/70 bg-card px-4 text-xs font-medium shadow-none"
              >
                Try again
              </Button>
            </div>
          )}
          {ready && details && (
            <div className="space-y-6">
              <section
                aria-label="Budget and schedule"
                className="border-b border-border/60 pb-6"
              >
                <dl className="grid min-w-0 grid-cols-2 items-center gap-x-5 gap-y-5 sm:grid-cols-[1.3fr_1fr_1fr]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <dt className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                      <CircleDollarSignIcon
                        size={14}
                        strokeWidth={1.7}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                      />
                      <span>Estimated project budget</span>
                    </dt>
                    <dd className="mt-2 break-words text-lg font-medium leading-snug tracking-[-0.025em] [overflow-wrap:anywhere]">
                      {formatBudget(details.budget, details.currency)}
                    </dd>
                  </div>
                  <Detail
                    label="Start date"
                    value={formatDate(details.startDate)}
                  />
                  <Detail
                    label="Due date"
                    value={formatDate(details.dueDate)}
                  />
                </dl>
                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  This is the overall project estimate. Agree your individual
                  fee and payment terms with the client.
                </p>
              </section>

              <section aria-labelledby="invitation-scope-heading">
                <SectionHeading
                  id="invitation-scope-heading"
                  icon={
                    <FileTextIcon
                      size={15}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  }
                >
                  Project scope
                </SectionHeading>
                <p className="mt-2.5 whitespace-pre-line break-words text-[13px] leading-7 text-foreground/80 [overflow-wrap:anywhere]">
                  {details.description?.trim() ||
                    "No project description was provided."}
                </p>
              </section>

              <InvitationProjectFiles
                key={details.id}
                projectId={details.id}
                files={details.files}
                disabled={Boolean(responding)}
              />

              <section aria-labelledby="invitation-skills-heading">
                <SectionHeading
                  id="invitation-skills-heading"
                  warm
                  icon={
                    <SparklesIcon
                      size={15}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  }
                >
                  Skills needed
                </SectionHeading>
                {teamProject && (
                  <section
                    aria-label="Team project"
                    className="mt-3 flex items-start gap-3 rounded-lg border border-brand-secondary-highlight/10 bg-brand-secondary-highlight/[0.045] px-4 py-3 dark:border-secondary/15 dark:bg-secondary/[0.045]"
                  >
                    <UsersIcon
                      size={16}
                      strokeWidth={1.7}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"
                    />
                    <p className="text-[13px] leading-6 text-foreground/80">
                      This is a team project that brings together Allocats with
                      different skills.
                    </p>
                  </section>
                )}
                {details.skills.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {details.skills.map((skill) => (
                      <li
                        key={skill.id}
                        className="max-w-full break-words rounded-md bg-surface-2 px-2.5 py-1.5 text-xs leading-5 text-foreground/80 [overflow-wrap:anywhere]"
                      >
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2.5 text-xs leading-6 text-muted-foreground">
                    No required skills have been listed.
                  </p>
                )}
              </section>

              <section
                aria-labelledby="invitation-client-heading"
                className="border-t border-border/60 pt-5"
              >
                <SectionHeading
                  id="invitation-client-heading"
                  icon={
                    <UserRoundIcon
                      size={15}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  }
                >
                  About the client
                </SectionHeading>
                <dl className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
                  <Detail
                    label="Client"
                    value={
                      details.client.fullName?.trim() || "Name not provided"
                    }
                  />
                  <Detail
                    label="Client based in"
                    value={location || "Location not provided"}
                  />
                </dl>
                <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                  The client’s location may differ from the work site. Confirm
                  where the work will happen and whether travel is required.
                </p>
              </section>

              <section
                aria-labelledby="invitation-details-heading"
                className="border-t border-border/60 pt-5"
              >
                <h3
                  id="invitation-details-heading"
                  className="text-sm font-medium"
                >
                  Project details
                </h3>
                <dl className="mt-3 grid min-w-0 grid-cols-2 gap-x-5 gap-y-4">
                  <Detail
                    label="Category"
                    value={details.category?.trim() || "Not specified"}
                  />
                  <Detail
                    label="Priority"
                    value={<PriorityMark value={details.priority} />}
                  />
                  <Detail
                    label="Invited"
                    value={formatDate(details.invitedAt)}
                  />
                  <ProjectReference
                    key={details.projectCode ?? "missing-reference"}
                    value={details.projectCode}
                  />
                </dl>
              </section>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border/60 bg-surface-2/35 px-5 py-4 sm:px-7">
          <p className="mb-3 text-[11px] leading-5 text-muted-foreground">
            Accepting adds you to the project workspace and its tasks.
          </p>
          <InvitationActions
            responding={responding}
            onAccept={onAccept}
            onDecline={onDecline}
            acceptDisabled={!ready}
            dialog
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InvitationActions({
  responding,
  onAccept,
  onDecline,
  acceptDisabled = false,
  dialog = false,
}: {
  responding: InvitationAction | null;
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
  acceptDisabled?: boolean;
  dialog?: boolean;
}) {
  return (
    <div
      className={
        dialog
          ? "grid shrink-0 grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end"
          : "flex items-center gap-2 sm:justify-end"
      }
    >
      <Button
        type="button"
        variant={dialog ? "outline" : "ghost"}
        disabled={responding !== null}
        onClick={() => void onDecline()}
        className={`${dialog ? "h-11 border-border/70 bg-card px-5 text-xs" : "h-9 px-3 text-xs"} rounded-lg font-medium text-muted-foreground shadow-none hover:bg-surface-3/60 hover:text-foreground dark:hover:bg-surface-3/70`}
      >
        {responding === "decline" ? (
          <LoaderCircleIcon
            size={15}
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        ) : dialog ? null : (
          <XIcon size={14} aria-hidden="true" />
        )}
        Decline
      </Button>
      <Button
        type="button"
        disabled={responding !== null || acceptDisabled}
        onClick={() => void onAccept()}
        className={`${dialog ? "h-11 px-5 text-xs" : "h-9 px-4 text-xs"} rounded-lg font-medium shadow-none ${primaryActionButton}`}
      >
        {responding === "accept" ? (
          <LoaderCircleIcon
            size={15}
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        ) : dialog ? null : (
          <CheckCircle2Icon size={14} aria-hidden="true" />
        )}
        {dialog ? "Accept project" : "Accept"}
      </Button>
    </div>
  );
}

function ProjectReference({ value }: { value: string | null }) {
  const reference = value?.trim();
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");
  const mounted = useRef(false);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  async function copyReference() {
    if (!reference || busy.current) return;
    busy.current = true;
    if (timer.current !== null) clearTimeout(timer.current);
    setCopyState("copying");
    try {
      if (!window.navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await window.navigator.clipboard.writeText(reference);
      if (!mounted.current) return;
      setCopyState("copied");
      timer.current = setTimeout(() => {
        if (mounted.current) setCopyState("idle");
        timer.current = null;
      }, 2000);
    } catch {
      if (mounted.current) setCopyState("error");
    } finally {
      busy.current = false;
    }
  }

  return (
    <div className="col-span-2 min-w-0">
      <dt className="text-[11px] font-normal leading-5 text-muted-foreground">
        Project reference
      </dt>
      <dd className="mt-1 min-w-0">
        {reference ? (
          <>
            <div className="inline-flex max-w-full items-start gap-1.5">
              <code className="min-w-0 select-all break-all py-2.5 font-mono text-[11px] leading-5 text-foreground/85 sm:py-1">
                {reference}
              </code>
              <button
                type="button"
                onClick={() => void copyReference()}
                disabled={copyState === "copying"}
                aria-label="Copy project reference"
                title={copyState === "copied" ? "Copied" : "Copy reference"}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-50 motion-reduce:transition-none sm:h-8 sm:w-8"
              >
                {copyState === "copied" ? (
                  <CheckIcon
                    size={14}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className="text-brand-secondary-highlight dark:text-secondary"
                  />
                ) : (
                  <CopyIcon size={14} strokeWidth={1.7} aria-hidden="true" />
                )}
              </button>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="min-h-5 text-[11px] font-normal leading-5 text-muted-foreground"
            >
              {copyState === "copied"
                ? "Copied"
                : copyState === "error"
                  ? "Couldn’t copy. Select the reference and copy it manually."
                  : copyState === "copying"
                    ? "Copying…"
                    : ""}
            </p>
          </>
        ) : (
          <span className="text-[13px] leading-6 text-muted-foreground">
            Not assigned
          </span>
        )}
      </dd>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-normal leading-5 text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-[13px] font-medium leading-6 text-foreground/85 [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  );
}
function SectionHeading({
  id,
  icon,
  children,
  warm = false,
}: {
  id: string;
  icon: ReactNode;
  children: ReactNode;
  warm?: boolean;
}) {
  return (
    <h3 id={id} className="flex items-center gap-2.5 text-sm font-medium">
      <span
        className={`inline-flex h-5 w-5 shrink-0 items-center justify-center ${warm ? "text-[color:var(--invitation-warm-ink)]" : "text-brand-secondary-highlight dark:text-secondary"}`}
      >
        {icon}
      </span>
      {children}
    </h3>
  );
}
function PriorityMark({ value }: { value: string | null }) {
  const priority = value?.trim().toLowerCase();
  const dot =
    priority === "urgent"
      ? "bg-status-overdue"
      : priority === "high"
        ? "bg-status-pending"
        : "bg-muted-foreground/50";
  return (
    <span className="inline-flex items-center gap-2 text-foreground/85">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
      />
      {readable(value) || "Not specified"}
    </span>
  );
}
function readable(value: string | null) {
  return value
    ?.trim()
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}
function formatBudget(value: number | null, currency: string | null) {
  if (value == null || !Number.isFinite(value) || value <= 0)
    return "Not specified";
  const code = currency?.trim().toUpperCase();
  if (!code || !/^[A-Z]{3}$/.test(code))
    return `${value.toLocaleString("en", { maximumFractionDigits: 2 })} · currency not specified`;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${code} ${value.toLocaleString("en", { maximumFractionDigits: 2 })}`;
  }
}
function formatDate(value: string | null) {
  if (!value) return "Not specified";
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = day
    ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]))
    : new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date)
    : "Not specified";
}
function validPreview(value: InvitationPreview, id: string) {
  return (
    value &&
    value.id === id &&
    typeof value.title === "string" &&
    value.client &&
    Array.isArray(value.files) &&
    value.files.every(
      (file) =>
        file &&
        typeof file.id === "string" &&
        typeof file.originalFileName === "string" &&
        typeof file.contentType === "string" &&
        Number.isFinite(file.sizeBytes) &&
        file.sizeBytes > 0,
    ) &&
    Array.isArray(value.skills) &&
    value.skills.every(
      (skill) =>
        skill && typeof skill.id === "string" && typeof skill.name === "string",
    )
  );
}

function hasMultipleSkillCategories(skills: InvitationSkill[]) {
  const normalizeCategory = (value?: string) =>
    value?.trim().toLowerCase() || "";
  const nameById = new Map(
    skills
      .filter((skill) => skill.categoryId && skill.category)
      .map((skill) => [
        normalizeCategory(skill.categoryId),
        normalizeCategory(skill.category),
      ]),
  );
  const categories = new Set<string>();
  for (const skill of skills) {
    const id = normalizeCategory(skill.categoryId);
    const name = normalizeCategory(skill.category) || nameById.get(id);
    const key = name ? `name:${name}` : id ? `id:${id}` : "";
    // Missing metadata never counts as another category.
    if (key) categories.add(key);
  }
  return categories.size > 1;
}

function InvitationProjectFiles({
  projectId,
  files,
  disabled,
}: {
  projectId: string;
  files: InvitationFile[];
  disabled: boolean;
}) {
  const [selected, setSelected] = useState<InvitationFile | null>(null);
  return (
    <section aria-labelledby="invitation-files-heading">
      <SectionHeading
        id="invitation-files-heading"
        icon={<FileTextIcon size={15} strokeWidth={1.7} aria-hidden="true" />}
      >
        Project files
      </SectionHeading>
      {files.length ? (
        <ul className="mt-3 flex flex-wrap gap-3">
          {files.map((file) => (
            <li key={file.id} className="w-32 min-w-0 sm:w-36">
              <button
                type="button"
                disabled={disabled}
                onClick={() => setSelected(file)}
                aria-label={`Preview ${file.originalFileName}`}
                aria-pressed={selected?.id === file.id}
                className="group block w-full overflow-hidden rounded-lg border border-border/65 bg-surface-2/30 text-left transition-colors hover:border-brand-secondary-highlight/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 disabled:opacity-50 dark:hover:border-secondary/35"
              >
                <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-surface-2">
                  <InvitationFileThumbnail projectId={projectId} file={file} />
                  <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-md bg-card/90 text-foreground/80">
                    <EyeIcon size={12} aria-hidden="true" />
                  </span>
                </span>
                <span className="block px-2.5 py-2.5">
                  <span
                    title={file.originalFileName}
                    className="block truncate text-[11px] font-medium leading-5 text-foreground/85"
                  >
                    {file.originalFileName}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    {formatInvitationFileSize(file.sizeBytes)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2.5 text-xs leading-6 text-muted-foreground">
          No project files have been uploaded.
        </p>
      )}
      {selected && (
        <InvitationFilePreview
          key={selected.id}
          projectId={projectId}
          file={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

type InvitationPreviewKind = "image" | "video" | "pdf" | "text" | "unsupported";
function invitationPreviewKind(file: InvitationFile): InvitationPreviewKind {
  const mime = file.contentType.split(";")[0].trim().toLowerCase();
  const extension = file.originalFileName.split(".").pop()?.toLowerCase();
  if (
    (mime === "image/jpeg" && (extension === "jpg" || extension === "jpeg")) ||
    (mime === "image/png" && extension === "png") ||
    (mime === "image/webp" && extension === "webp")
  )
    return "image";
  if (
    (mime === "video/mp4" && extension === "mp4") ||
    (mime === "video/webm" && extension === "webm")
  )
    return "video";
  if (mime === "application/pdf" && extension === "pdf") return "pdf";
  if (
    (extension === "txt" || extension === "csv") &&
    [
      "text/plain",
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
    ].includes(mime)
  )
    return "text";
  return "unsupported";
}
async function invitationFileUrl(
  projectId: string,
  fileId: string,
  signal: AbortSignal,
) {
  const { data } = await api.get<{ url: string }>(
    `/projects/${encodeURIComponent(projectId)}/invitation-preview/files/${encodeURIComponent(fileId)}/download`,
    { withCredentials: true, signal },
  );
  const url = new URL(data.url);
  if (url.protocol !== "https:" && url.protocol !== "http:")
    throw new Error("Invalid preview URL.");
  return url.href;
}
function InvitationFileThumbnail({
  projectId,
  file,
}: {
  projectId: string;
  file: InvitationFile;
}) {
  const kind = invitationPreviewKind(file);
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (kind !== "image") return;
    const controller = new AbortController();
    void invitationFileUrl(projectId, file.id, controller.signal)
      .then((url) => {
        if (!controller.signal.aborted) setUrl(url);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [projectId, file.id, kind]);
  const Icon =
    kind === "image" ? ImageIcon : kind === "video" ? FilmIcon : FileTextIcon;
  return (
    <>
      <span
        aria-hidden="true"
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <Icon size={28} strokeWidth={1.4} />
        <span className="text-[9px] font-medium uppercase tracking-wider">
          {file.originalFileName.split(".").pop()?.slice(0, 8)}
        </span>
      </span>
      {kind === "image" && url && !failed && (
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </>
  );
}
function InvitationFilePreview({
  projectId,
  file,
  onClose,
}: {
  projectId: string;
  file: InvitationFile;
  onClose: () => void;
}) {
  const kind = invitationPreviewKind(file);
  const [content, setContent] = useState<{
    url: string;
    text: string;
    truncated: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(kind !== "unsupported");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    setContent(null);
    setError(null);
    setLoading(kind !== "unsupported");
    if (kind !== "unsupported")
      void (async () => {
        try {
          const url = await invitationFileUrl(
            projectId,
            file.id,
            controller.signal,
          );
          const response = await fetch(url, {
            credentials: "omit",
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("Preview unavailable.");
          const blob = await response.blob();
          if (controller.signal.aborted) return;
          if (blob.size > 25 * 1024 * 1024)
            throw new Error("Preview exceeds file limit.");
          if (kind === "text") {
            const text = await blob.slice(0, 128 * 1024).text();
            if (!controller.signal.aborted)
              setContent({ url: "", text, truncated: blob.size > 128 * 1024 });
          } else {
            // Embed only allowlisted media/PDF with an explicit MIME, never HTML,
            // SVG, archives or Office documents.
            const mime =
              kind === "pdf"
                ? "application/pdf"
                : file.contentType.split(";")[0].trim().toLowerCase();
            objectUrl = URL.createObjectURL(new Blob([blob], { type: mime }));
            setContent({ url: objectUrl, text: "", truncated: false });
          }
        } catch (failure) {
          if (!controller.signal.aborted) {
            const unavailable =
              isAxiosError(failure) &&
              [403, 404].includes(failure.response?.status ?? 0);
            setError(
              unavailable
                ? "This file or invitation is no longer available. Close and reopen the invitation to refresh it."
                : "This preview could not be loaded. Try again.",
            );
          }
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      })();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [projectId, file.id, file.contentType, kind, attempt]);
  return (
    <div
      role="region"
      aria-label={`Preview of ${file.originalFileName}`}
      className="mt-4 overflow-hidden rounded-lg border border-border/65"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-surface-2/40 px-3 py-2">
        <p className="min-w-0 break-words text-xs font-medium">
          {file.originalFileName}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close file preview"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
        >
          <XIcon size={14} aria-hidden="true" />
        </button>
      </div>
      {loading && (
        <p
          role="status"
          className="flex min-h-40 items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <LoaderCircleIcon
            size={14}
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
          Loading preview…
        </p>
      )}
      {error && (
        <div role="alert" className="p-4">
          <p className="text-xs leading-6 text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="mt-2 rounded px-2 py-2 text-xs font-medium text-brand-secondary-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 dark:text-secondary"
          >
            Try again
          </button>
        </div>
      )}
      {!loading && !error && kind === "unsupported" && (
        <p className="px-4 py-8 text-center text-xs leading-6 text-muted-foreground">
          Preview isn’t available for this file type.
        </p>
      )}
      {!loading && !error && content && kind === "image" && (
        <img
          src={content.url}
          alt={file.originalFileName}
          onError={() => setError("This image could not be displayed.")}
          className="mx-auto max-h-[55dvh] max-w-full object-contain p-3"
        />
      )}
      {!loading && !error && content && kind === "video" && (
        <video
          src={content.url}
          controls
          controlsList="nodownload"
          playsInline
          preload="metadata"
          onError={() => setError("This video could not be played.")}
          className="mx-auto max-h-[55dvh] w-full object-contain"
        />
      )}
      {!loading && !error && content && kind === "pdf" && (
        <object
          data={`${content.url}#toolbar=0&navpanes=0`}
          type="application/pdf"
          aria-label={`PDF preview of ${file.originalFileName}`}
          className="h-[55dvh] w-full"
        >
          <p className="p-4 text-xs leading-6 text-muted-foreground">
            Your browser cannot display this PDF preview.
          </p>
        </object>
      )}
      {!loading && !error && content && kind === "text" && (
        <div className="max-h-[55dvh] overflow-auto p-4">
          <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-foreground/85">
            {content.text}
          </pre>
          {content.truncated && (
            <p className="mt-3 text-[11px] text-muted-foreground">
              Showing the first 128 KB.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
function formatInvitationFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
