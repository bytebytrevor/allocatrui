import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  EyeIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  MessageSquareIcon,
  PlayIcon,
  SendIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/auth/useAuth";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

/* =========================================================
   VIDEOS
========================================================= */

const videos = {
  overview: "",
  workspace: "",
  completion: "",
};

/* =========================================================
   TYPES
========================================================= */

type StepTone = "primary" | "pending" | "success" | "neutral";

/* =========================================================
   THEME
========================================================= */

const primaryButton = [
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground shadow-none",
  "transition-opacity duration-150",
  "hover:border-brand-secondary-highlight/15 hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground",
  "dark:hover:border-secondary/10 dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:hover:opacity-90",
  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryButton = [
  "border border-border/65 bg-surface-2/35 text-foreground/75 shadow-none",
  "transition-opacity duration-150",
  "hover:border-border/65 hover:bg-surface-2/35 hover:text-foreground/75 hover:opacity-75",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-border dark:bg-surface-2/65 dark:text-foreground/75",
  "dark:hover:border-border dark:hover:bg-surface-2/65 dark:hover:text-foreground/75 dark:hover:opacity-75",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const cardSurface = "border-border/55 bg-card dark:border-border dark:bg-card";

const quietSurface =
  "border-border/55 bg-surface-2/30 dark:border-border dark:bg-surface-2/55";

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10",
  "dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10",
].join(" ");

const contrastSurface = [
  "border-primary/20 bg-primary text-primary-foreground",
  "dark:border-brand-secondary-highlight/25 dark:bg-brand-secondary dark:text-white",
].join(" ");

function toneIconClass(tone: StepTone) {
  switch (tone) {
    case "success":
      return "bg-status-complete/[0.09] text-status-complete-foreground";

    case "pending":
      return "bg-status-pending/[0.10] text-status-pending-foreground";

    case "neutral":
      return "bg-surface-3/70 text-muted-foreground dark:bg-surface-2";

    default:
      return accentIconSurface;
  }
}

/* =========================================================
   DATA
========================================================= */

const processSteps: {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: StepTone;
}[] = [
  {
    number: "01",
    label: "Create",
    title: "Define the project.",
    description:
      "Describe the work, expected outcome, schedule and skills the project needs before anybody is brought into it.",
    icon: FileTextIcon,
    tone: "primary",
  },
  {
    number: "02",
    label: "Allocate",
    title: "Bring in the right skill.",
    description:
      "Discover professionals whose experience matches the project and invite the right people into the shared workspace.",
    icon: UsersIcon,
    tone: "primary",
  },
  {
    number: "03",
    label: "Execute",
    title: "Move the work.",
    description:
      "Accepted Allocats manage operational tasks while progress remains visible to everybody involved in the project.",
    icon: WrenchIcon,
    tone: "pending",
  },
  {
    number: "04",
    label: "Submit",
    title: "Send the outcome for review.",
    description:
      "When the work is ready, the Allocat submits the project back to the client rather than closing it automatically.",
    icon: SendIcon,
    tone: "primary",
  },
  {
    number: "05",
    label: "Review",
    title: "Confirm completion.",
    description:
      "The client reviews the finished outcome and either confirms completion or returns the project for more work.",
    icon: ClipboardCheckIcon,
    tone: "success",
  },
];

const videoGuides = [
  {
    number: "01",
    title: "Creating a new project",
    description:
      "Create the project, describe the work and add the information needed to begin.",
    audience: "Clients",
    icon: FileTextIcon,
    url: "",
  },
  {
    number: "02",
    title: "Finding the right Allocat",
    description:
      "Explore skilled professionals and find people whose experience matches the project.",
    audience: "Clients",
    icon: UsersIcon,
    url: "",
  },
  {
    number: "03",
    title: "Using the Project Manager",
    description:
      "Understand project information, people, progress and the shared workspace.",
    audience: "Everyone",
    icon: LayoutDashboardIcon,
    url: "",
  },
  {
    number: "04",
    title: "Working with the task board",
    description:
      "Create, update and move tasks while operational work is being carried out.",
    audience: "Allocats",
    icon: ListTodoIcon,
    url: "",
  },
  {
    number: "05",
    title: "Comments and project updates",
    description:
      "Keep project questions, clarification and progress updates connected to the work.",
    audience: "Everyone",
    icon: MessageSquareIcon,
    url: "",
  },
  {
    number: "06",
    title: "Submitting work for review",
    description:
      "Move completed work into the client's final review and confirmation process.",
    audience: "Allocats",
    icon: SendIcon,
    url: "",
  },
];

const clientActions = [
  "Create and manage project information",
  "Invite and manage project relationships",
  "See task status and overall progress",
  "Open tasks and participate in discussion",
  "Review submitted work",
  "Confirm completion or request changes",
];

const allocatActions = [
  "Enter accepted project workspaces",
  "Create and update project tasks",
  "Move tasks through their workflow",
  "Manage operational execution",
  "Respond to project comments",
  "Submit finished work for client review",
];

const completionSteps: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: StepTone;
}[] = [
  {
    number: "01",
    title: "Tasks complete",
    description:
      "The required operational work reaches the end of the task board.",
    icon: CheckCircle2Icon,
    tone: "success",
  },
  {
    number: "02",
    title: "Submit for confirmation",
    description: "The Allocat sends the finished project back to the client.",
    icon: SendIcon,
    tone: "primary",
  },
  {
    number: "03",
    title: "Client review",
    description:
      "The client checks the finished outcome against the project requirements.",
    icon: EyeIcon,
    tone: "neutral",
  },
  {
    number: "04",
    title: "Confirm or return",
    description:
      "The client closes the project or sends it back for additional work.",
    icon: ClipboardCheckIcon,
    tone: "pending",
  },
];

/* =========================================================
   PAGE
========================================================= */

function HowItWorksPage() {
  const { user } = useAuth();

  const postProjectHref = user ? "/projects/new" : "/register";

  const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";
  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

  return (
    <>
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-background text-foreground">
        <HeroSection postProjectHref={postProjectHref} />
        <ProcessSection />
        <GuidesSection />
        <WorkspaceSection />
        <ResponsibilitiesSection />
        <CompletionSection />

        <FinalCta
          postProjectHref={postProjectHref}
          allocatHref={allocatHref}
          allocatLabel={allocatLabel}
        />
      </main>

      <SiteFooter />
    </>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection({ postProjectHref }: { postProjectHref: string }) {
  return (
    <section className="border-b border-border/55 bg-background pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">
          <Reveal>
            <SectionEyebrow>How Allocatr works</SectionEyebrow>

            <h1 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground/95 sm:text-5xl lg:text-[3.7rem]">
              From project brief to{" "}
              <HeadlineAccent>final approval.</HeadlineAccent>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              Find the skills your project needs, bring the right people into
              the work and keep everything connected from creation through
              execution and completion.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="ghost"
                className={[
                  "h-11 rounded-lg px-6 text-xs font-semibold",
                  primaryButton,
                ].join(" ")}
              >
                <Link to={postProjectHref}>
                  Start a project
                  <ArrowRightIcon size={14} />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className={[
                  "h-11 rounded-lg px-6 text-xs font-semibold",
                  secondaryButton,
                ].join(" ")}
              >
                <Link to="/discover">Find an Allocat</Link>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              <HeroFact>Find by project skill</HeroFact>
              <HeroFact>Shared project workspace</HeroFact>
              <HeroFact>Client confirmation</HeroFact>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <OverviewVideo />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OverviewVideo() {
  return (
    <div
      className={["overflow-hidden rounded-2xl border", cardSurface].join(" ")}
    >
      <VideoCardHeader label="Product overview" icon={LayoutDashboardIcon} />

      <YouTubeVideo
        url={videos.overview}
        title="See the complete Allocatr workflow"
      />

      <div className="border-t border-border/55 px-5 py-5 sm:px-6">
        <h3 className="text-lg font-semibold tracking-[-0.025em] text-foreground">
          The complete workflow
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
          From creating the project and finding Allocats to managing work and
          confirming the finished outcome.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PROCESS
========================================================= */

function ProcessSection() {
  return (
    <section className="border-b border-border/55 bg-card py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow center>The process</SectionEyebrow>

          <SectionTitle center>
            One project. <HeadlineAccent>One continuous path.</HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Finding the right person is one stage in a larger workflow. Allocatr
            keeps the project structured from the first brief to the final
            decision.
          </p>
        </div>

        <ProcessTimeline />
      </div>
    </section>
  );
}

function ProcessTimeline() {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
      <div
        aria-hidden
        className="absolute bottom-8 left-[21px] top-8 w-px bg-border/80 sm:left-[27px] lg:left-1/2 lg:-translate-x-1/2"
      />

      <div className="relative space-y-4 sm:space-y-5 lg:space-y-6">
        {processSteps.map((step, index) => (
          <ProcessStep key={step.number} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: (typeof processSteps)[number];
  index: number;
}) {
  const Icon = step.icon;
  const isRight = index % 2 !== 0;

  return (
    <Reveal delay={index * 0.04}>
      <article
        className={[
          "relative grid grid-cols-[44px_minmax(0,1fr)] gap-4",
          "sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-6",
          "lg:grid-cols-[1fr_76px_1fr] lg:gap-0",
        ].join(" ")}
      >
        <div
          className={[
            "hidden lg:block",
            isRight ? "lg:col-start-1" : "lg:col-start-3",
          ].join(" ")}
        />

        <div className="relative z-10 flex justify-center pt-6 lg:col-start-2 lg:row-start-1">
          <span
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              "border-[5px] border-card dark:border-card",
              toneIconClass(step.tone),
            ].join(" ")}
          >
            <Icon size={16} />
          </span>
        </div>

        <div
          className={[
            "relative min-w-0 rounded-2xl border p-5 sm:p-6 lg:p-7",
            quietSurface,
            "lg:row-start-1",
            isRight ? "lg:col-start-3" : "lg:col-start-1",
          ].join(" ")}
        >
          <ProcessConnector side={isRight ? "left" : "right"} />

          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {step.label}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
                {step.title}
              </h3>
            </div>

            <span className="shrink-0 text-[0.56rem] font-semibold tracking-[0.14em] text-muted-foreground/65">
              {step.number}
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            {step.description}
          </p>

          <div className="mt-5 flex items-center gap-2 border-t border-border/45 pt-4">
            <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

            <span className="text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Project continues
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProcessConnector({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={[
        "absolute top-[48px] hidden h-px w-[38px] bg-border/80 lg:block",
        side === "left" ? "-left-[38px]" : "-right-[38px]",
      ].join(" ")}
    />
  );
}

/* =========================================================
   GUIDES
========================================================= */

function GuidesSection() {
  return (
    <section className="border-b border-border/55 bg-surface-2/30 py-20 dark:bg-surface-2/35 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionEyebrow>Quick video guides</SectionEyebrow>

            <SectionTitle>
              Learn exactly what <HeadlineAccent>you need.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              Short walkthroughs for specific parts of the platform, so you do
              not have to watch the complete product overview every time.
            </p>

            <div className="mt-7 hidden flex-wrap gap-2 sm:flex">
              <GuideAudience>For clients</GuideAudience>
              <GuideAudience>For Allocats</GuideAudience>
              <GuideAudience>For everyone</GuideAudience>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {videoGuides.map((guide, index) => (
              <VideoGuideCard key={guide.title} guide={guide} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoGuideCard({
  guide,
  index,
}: {
  guide: (typeof videoGuides)[number];
  index: number;
}) {
  const Icon = guide.icon;
  const embedUrl = getYouTubeEmbedUrl(guide.url);

  return (
    <Reveal delay={index * 0.035}>
      <article
        className={[
          "group min-w-0 overflow-hidden rounded-2xl border",
          cardSurface,
        ].join(" ")}
      >
        <div className="relative aspect-video overflow-hidden bg-brand-charcoal">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={guide.title}
              loading="lazy"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <PlayIcon size={16} fill="currentColor" />
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-lg border border-white/[0.12] bg-brand-charcoal/80 px-2.5 py-1.5 text-[0.52rem] font-semibold text-white">
            {guide.audience}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <span
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg",
                accentIconSurface,
              ].join(" ")}
            >
              <Icon size={15} />
            </span>

            <span className="text-[0.5rem] font-semibold tracking-[0.14em] text-muted-foreground/65">
              {guide.number}
            </span>
          </div>

          <h3 className="mt-5 text-lg font-semibold leading-[1.1] tracking-[-0.025em] text-foreground">
            {guide.title}
          </h3>

          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            {guide.description}
          </p>

          <p className="mt-5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {guide.url ? "Watch guide" : "Video coming soon"}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

function GuideAudience({ children }: { children: ReactNode }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2",
        "text-[0.58rem] font-semibold text-muted-foreground",
        quietSurface,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-sm bg-brand-secondary-highlight dark:bg-secondary" />
      {children}
    </span>
  );
}

/* =========================================================
   WORKSPACE
========================================================= */

function WorkspaceSection() {
  return (
    <section className={["border-b py-20 lg:py-28", contrastSurface].join(" ")}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
          <div>
            <ContrastEyebrow>Project workspace</ContrastEyebrow>

            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]">
              Everyone sees the work.{" "}
              <span className="text-secondary">
                Responsibilities stay clear.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Clients stay close to the project without becoming a second task
              manager. Allocats control execution while progress remains
              visible.
            </p>

            <div className="mt-8 space-y-3">
              <DarkFact
                icon={EyeIcon}
                text="Clients can follow task status, deadlines and project progress."
              />

              <DarkFact
                icon={MessageSquareIcon}
                text="Questions and updates remain connected to the project."
              />

              <DarkFact
                icon={ListTodoIcon}
                text="Allocats manage operational work through the task board."
              />
            </div>
          </div>

          <WorkspaceVideo />
        </div>
      </div>
    </section>
  );
}

function WorkspaceVideo() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04]">
      <div className="flex items-center justify-between border-b border-white/[0.10] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-6 rounded-full bg-secondary" />

          <span className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-white/55">
            Workspace walkthrough
          </span>
        </div>

        <LayoutDashboardIcon size={14} className="text-white/45" />
      </div>

      <YouTubeVideo
        url={videos.workspace}
        title="Watch a project move through the workspace"
      />

      <div className="border-t border-white/[0.10] px-5 py-5 sm:px-6">
        <h3 className="text-lg font-semibold tracking-[-0.025em] text-white">
          Watch a project move through the workspace
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-7 text-white/60">
          See how tasks, people, comments and progress remain connected during
          execution.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   RESPONSIBILITIES
========================================================= */

function ResponsibilitiesSection() {
  return (
    <section className="border-b border-border/55 bg-card py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow center>Clear responsibilities</SectionEyebrow>

          <SectionTitle center>
            Same project. <HeadlineAccent>Different controls.</HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Both sides work from the same project, while permissions and
            operational controls follow each person's role.
          </p>
        </div>

        <div
          className={[
            "mt-12 overflow-hidden rounded-2xl border lg:grid lg:grid-cols-2",
            cardSurface,
          ].join(" ")}
        >
          <ResponsibilityPanel
            eyebrow="Client"
            title="Own the outcome."
            description="Create the project, manage the relationship and make the final decision when finished work is submitted."
            icon={UsersIcon}
            actions={clientActions}
          />

          <ResponsibilityPanel
            eyebrow="Allocat"
            title="Own the execution."
            description="Manage operational work and move the project through its task workflow."
            icon={BriefcaseBusinessIcon}
            actions={allocatActions}
            allocat
          />
        </div>

        <div className="mx-auto mt-7 flex max-w-2xl items-start justify-center gap-3 text-center">
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              accentIconSurface,
            ].join(" ")}
          >
            <ShieldCheckIcon size={13} />
          </span>

          <p className="pt-1 text-xs leading-6 text-muted-foreground">
            The project remains shared while control stays with the person
            responsible for that part of the work.
          </p>
        </div>
      </div>
    </section>
  );
}

function ResponsibilityPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  allocat = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions: string[];
  allocat?: boolean;
}) {
  return (
    <article
      className={[
        "relative p-6 sm:p-8 lg:p-10",
        allocat
          ? "border-t border-border/55 bg-surface-2/30 dark:bg-surface-2/45 lg:border-l lg:border-t-0"
          : "bg-card",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            accentIconSurface,
          ].join(" ")}
        >
          <Icon size={17} />
        </span>

        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-7 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
        {title}
      </h3>

      <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      <div className="mt-7 border-t border-border/50 pt-6">
        <div className="grid gap-3">
          {actions.map((action) => (
            <div key={action} className="flex items-start gap-3">
              <CheckCircle2Icon
                size={14}
                className="mt-1 shrink-0 text-status-complete-foreground"
              />

              <span className="text-sm leading-6 text-muted-foreground">
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   COMPLETION
========================================================= */

function CompletionSection() {
  return (
    <section className="border-b border-border/55 bg-surface-2/30 py-20 dark:bg-surface-2/35 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-center lg:gap-20">
          <div>
            <SectionEyebrow>Finishing the project</SectionEyebrow>

            <SectionTitle>
              Tasks finished.{" "}
              <HeadlineAccent>The outcome still needs approval.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              Completing the final task does not automatically close the
              project. The Allocat submits the finished work and the client
              makes the final decision.
            </p>

            <CompletionSteps />
          </div>

          <CompletionVideo />
        </div>
      </div>
    </section>
  );
}

function CompletionSteps() {
  return (
    <div className="mt-8 border-y border-border/55">
      {completionSteps.map((step, index) => {
        const Icon = step.icon;

        return (
          <Reveal key={step.number} delay={index * 0.04}>
            <div className="grid grid-cols-[38px_minmax(0,1fr)] gap-4 border-b border-border/55 py-5 last:border-b-0">
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  toneIconClass(step.tone),
                ].join(" ")}
              >
                <Icon size={14} />
              </span>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[0.5rem] font-semibold tracking-[0.12em] text-muted-foreground/65">
                    {step.number}
                  </span>

                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

function CompletionVideo() {
  return (
    <div
      className={["overflow-hidden rounded-2xl border", cardSurface].join(" ")}
    >
      <VideoCardHeader
        label="Completion walkthrough"
        icon={ClipboardCheckIcon}
        tone="success"
      />

      <YouTubeVideo
        url={videos.completion}
        title="See how work moves into client review"
      />

      <div className="border-t border-border/55 px-5 py-5 sm:px-6">
        <h3 className="text-lg font-semibold tracking-[-0.025em] text-foreground">
          From completed tasks to confirmed project
        </h3>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          See how finished work is submitted and how the client makes the final
          completion decision.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCta({
  postProjectHref,
  allocatHref,
  allocatLabel,
}: {
  postProjectHref: string;
  allocatHref: string;
  allocatLabel: string;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <SectionEyebrow center>Ready to start?</SectionEyebrow>

          <h2 className="mx-auto mt-5 max-w-[15ch] text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[3rem]">
            Bring the right people into{" "}
            <HeadlineAccent>the right work.</HeadlineAccent>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Start with the project, find the skills it needs and keep the work
            moving in one place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              variant="ghost"
              className={[
                "h-11 rounded-lg px-6 text-xs font-semibold",
                primaryButton,
              ].join(" ")}
            >
              <Link to={postProjectHref}>
                Start a project
                <ArrowRightIcon size={14} />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className={[
                "h-11 rounded-lg px-6 text-xs font-semibold",
                secondaryButton,
              ].join(" ")}
            >
              <Link to={allocatHref}>{allocatLabel}</Link>
            </Button>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl border-y border-border/55 sm:grid-cols-3">
            <FinalMetric number="01" label="Create" />
            <FinalMetric number="02" label="Allocate" divided />
            <FinalMetric number="03" label="Complete" divided />
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalMetric({
  number,
  label,
  divided = false,
}: {
  number: string;
  label: string;
  divided?: boolean;
}) {
  return (
    <div
      className={[
        "py-4",
        divided ? "border-t border-border/55 sm:border-l sm:border-t-0" : "",
      ].join(" ")}
    >
      <p className="text-[0.5rem] font-semibold tracking-[0.15em] text-brand-secondary-highlight dark:text-secondary">
        {number}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-foreground">{label}</p>
    </div>
  );
}

/* =========================================================
   VIDEO
========================================================= */

function VideoCardHeader({
  label,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  icon: LucideIcon;
  tone?: StepTone;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/55 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-2.5">
        <span
          className={[
            "h-1.5 w-6 rounded-full",
            tone === "success"
              ? "bg-status-complete"
              : "bg-brand-secondary-highlight dark:bg-secondary",
          ].join(" ")}
        />

        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
      </div>

      <Icon size={14} className="text-muted-foreground" />
    </div>
  );
}

function YouTubeVideo({ url, title }: { url: string; title: string }) {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="relative aspect-video overflow-hidden bg-brand-charcoal">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <PlayIcon size={18} fill="currentColor" />
            </span>

            <p className="mt-4 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-white/45">
              Video coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") ?? "";
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/")[2] ?? "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/")[2] ?? "";
      }
    }

    if (!videoId) {
      return "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

/* =========================================================
   MOTION
========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   SHARED
========================================================= */

function SectionEyebrow({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-2.5",
        center ? "justify-center" : "",
      ].join(" ")}
    >
      <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

function ContrastEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-1.5 w-6 rounded-full bg-secondary" />

      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-white/55">
        {children}
      </p>
    </div>
  );
}

function SectionTitle({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <h2
      className={[
        "mt-4 max-w-4xl text-3xl font-semibold leading-[1.04] tracking-[-0.04em] text-foreground",
        "sm:text-4xl lg:text-[2.75rem]",
        center ? "mx-auto" : "",
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function HeadlineAccent({ children }: { children: ReactNode }) {
  return (
    <span className="text-brand-secondary-highlight dark:text-secondary">
      {children}
    </span>
  );
}

function HeroFact({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium text-muted-foreground">
      <CheckCircle2Icon size={12} className="text-status-complete-foreground" />

      {children}
    </span>
  );
}

function DarkFact({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] text-secondary ring-1 ring-inset ring-white/[0.08]">
        <Icon size={14} />
      </span>

      <p className="pt-1 text-sm leading-6 text-white/70">{text}</p>
    </div>
  );
}

export default HowItWorksPage;
