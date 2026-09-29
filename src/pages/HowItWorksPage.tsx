import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

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
   BRAND
========================================================= */

const lime = "#DEDA00";
const green = "#38D200";
const amber = "#F0A23A";

const primaryButton = [
  "bg-[#303030] text-white",
  "hover:bg-[#202020] hover:text-white",
  "dark:bg-[#DEDA00] dark:text-[#202020]",
  "dark:hover:bg-[#d3cf00] dark:hover:text-[#202020]",
].join(" ");

const outlineButton = [
  "border-black/[0.13] bg-white text-[#303030]",
  "hover:border-black/[0.20] hover:bg-[#f5f5f2]",
  "dark:border-white/[0.11] dark:bg-white/[0.025] dark:text-white",
  "dark:hover:border-white/[0.18] dark:hover:bg-white/[0.05]",
].join(" ");

/* =========================================================
   VIDEOS
========================================================= */

const videos = {
  overview: "",
  workspace: "",
  completion: "",
};

/* =========================================================
   DATA
========================================================= */

const processSteps = [
  {
    number: "01",
    label: "Create",
    title: "Define the project.",
    description:
      "Describe the work, expected outcome, schedule and skills the project needs before anybody is brought into it.",
    icon: FileTextIcon,
    accent: lime,
    iconClass:
      "bg-[#DEDA00]/[0.13] text-[#666300] dark:text-[#DEDA00]",
  },
  {
    number: "02",
    label: "Allocate",
    title: "Bring in the right skill.",
    description:
      "Discover professionals whose experience matches the project and invite the right people into the shared workspace.",
    icon: UsersIcon,
    accent: lime,
    iconClass:
      "bg-[#DEDA00]/[0.13] text-[#666300] dark:text-[#DEDA00]",
  },
  {
    number: "03",
    label: "Execute",
    title: "Move the work.",
    description:
      "Accepted Allocats manage operational tasks while progress remains visible to everybody involved in the project.",
    icon: WrenchIcon,
    accent: amber,
    iconClass:
      "bg-[#F0A23A]/[0.11] text-[#8c5800] dark:text-[#F0A23A]",
  },
  {
    number: "04",
    label: "Submit",
    title: "Send the outcome for review.",
    description:
      "When the work is ready, the Allocat submits the project back to the client rather than closing it automatically.",
    icon: SendIcon,
    accent: lime,
    iconClass:
      "bg-[#DEDA00]/[0.13] text-[#666300] dark:text-[#DEDA00]",
  },
  {
    number: "05",
    label: "Review",
    title: "Confirm completion.",
    description:
      "The client reviews the finished outcome and either confirms completion or returns the project for more work.",
    icon: ClipboardCheckIcon,
    accent: green,
    iconClass:
      "bg-[#38D200]/[0.10] text-[#247e08] dark:text-[#38D200]",
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

const completionSteps = [
  {
    number: "01",
    title: "Tasks complete",
    description:
      "The required operational work reaches the end of the task board.",
    icon: CheckCircle2Icon,
  },
  {
    number: "02",
    title: "Submit for confirmation",
    description:
      "The Allocat sends the finished project back to the client.",
    icon: SendIcon,
  },
  {
    number: "03",
    title: "Client review",
    description:
      "The client checks the finished outcome against the project requirements.",
    icon: EyeIcon,
  },
  {
    number: "04",
    title: "Confirm or return",
    description:
      "The client closes the project or sends it back for additional work.",
    icon: ClipboardCheckIcon,
  },
];

/* =========================================================
   PAGE
========================================================= */

function HowItWorksPage() {
  const { user } = useAuth();

  const postProjectHref = user
    ? "/projects/new"
    : "/register";

  const allocatHref = user?.isAllocat
    ? "/projects"
    : "/become-an-allocat";

  const allocatLabel = user?.isAllocat
    ? "View my work"
    : "Become an Allocat";

  return (
    <>
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-[#f7f7f4] text-[#303030] dark:bg-[#080808] dark:text-white">
        <HeroSection
          postProjectHref={postProjectHref}
        />

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

function HeroSection({
  postProjectHref,
}: {
  postProjectHref: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f7f7f4] pb-20 pt-28 dark:border-white/[0.06] dark:bg-[#080808] sm:pt-32 lg:pb-28 lg:pt-40">
      <HeroAtmosphere />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <SectionEyebrow>
              How Allocatr works
            </SectionEyebrow>

            <h1 className="mt-7 max-w-[11ch] text-5xl font-black leading-[0.9] tracking-[-0.055em] text-[#303030] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.6rem] dark:text-white">
              From project brief to{" "}

              <HeadlineAccent>
                final approval.
              </HeadlineAccent>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#5f5f59] sm:text-lg dark:text-white/48">
              Find the skills your project needs, bring the right people into
              the work and keep everything connected from creation through
              execution and completion.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className={[
                  "group h-12 rounded-lg px-7 text-xs font-bold shadow-none",
                  primaryButton,
                ].join(" ")}
              >
                <Link to={postProjectHref}>
                  Start a project

                  <ArrowRightIcon
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className={[
                  "h-12 rounded-lg px-7 text-xs font-semibold shadow-none",
                  outlineButton,
                ].join(" ")}
              >
                <Link to="/discover">
                  Find an Allocat
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              <HeroFact>
                Find by project skill
              </HeroFact>

              <HeroFact>
                Shared project workspace
              </HeroFact>

              <HeroFact>
                Client confirmation
              </HeroFact>
            </div>
          </motion.div>

          <OverviewVideo />
        </div>
      </div>
    </section>
  );
}

function HeroAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -right-48 top-[8%] h-[34rem] w-[34rem] rounded-full bg-black/[0.025] blur-[125px] dark:bg-white/[0.018]" />

      <div className="absolute left-[42%] top-[74%] h-52 w-[42rem] -translate-x-1/2 rounded-[50%] bg-[#DEDA00]/[0.025] blur-[110px] dark:bg-[#DEDA00]/[0.018]" />

      <div className="absolute left-[6%] top-[20%] h-px w-[28rem] bg-gradient-to-r from-transparent via-black/[0.055] to-transparent dark:via-white/[0.035]" />
    </div>
  );
}

function OverviewVideo() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.12,
        duration: 0.65,
      }}
      className="relative"
    >
      <div className="absolute -bottom-4 left-8 right-8 h-20 rounded-[50%] bg-black/[0.08] blur-3xl dark:bg-black/40" />

      <div className="relative overflow-hidden rounded-[1.55rem] border border-black/[0.10] bg-white shadow-[0_28px_80px_-52px_rgba(0,0,0,0.30)] dark:border-white/[0.08] dark:bg-[#141414] dark:shadow-2xl dark:shadow-black/30">
        <div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 dark:border-white/[0.07] sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#303030] opacity-10 dark:bg-[#DEDA00] dark:opacity-20" />

              <span className="relative h-2 w-2 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
            </span>

            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[#60605a] dark:text-white/38">
              Product overview
            </span>
          </div>

          <span className="hidden text-[0.52rem] text-[#777771] sm:block dark:text-white/24">
            Allocatr
          </span>
        </div>

        <YouTubeVideo
          url={videos.overview}
          title="See the complete Allocatr workflow"
        />

        <div className="border-t border-black/[0.08] px-5 py-5 dark:border-white/[0.07] sm:px-6">
          <h3 className="text-lg font-black tracking-[-0.025em] text-[#303030] dark:text-white">
            The complete workflow
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-7 text-[#60605a] dark:text-white/40">
            From creating the project and finding Allocats to managing work and
            confirming the finished outcome.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   PROCESS
========================================================= */

function ProcessSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-white py-24 dark:border-white/[0.06] dark:bg-[#111111] lg:py-32">
      <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <SectionEyebrow center>
            The process
          </SectionEyebrow>

          <SectionTitle center>
            One project.{" "}

            <HeadlineAccent>
              One continuous path.
            </HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 dark:text-white/42">
            Finding the right person is one stage in a larger workflow.
            Allocatr keeps the project structured from the first brief to the
            final decision.
          </p>
        </div>

        <ProcessTimeline />
      </div>
    </section>
  );
}

/* =========================================================
   PROCESS GRAPH
========================================================= */

function ProcessTimeline() {
  const reduceMotion =
    useReducedMotion();

  return (
    <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
      <div
        aria-hidden
        className="absolute bottom-10 left-[21px] top-10 w-px bg-black/[0.10] dark:bg-white/[0.08] sm:left-[27px] lg:left-1/2 lg:-translate-x-1/2"
      />

      <motion.div
        aria-hidden
        initial={{
          scaleY: reduceMotion ? 1 : 0,
        }}
        whileInView={{
          scaleY: 1,
        }}
        viewport={{
          once: true,
          amount: 0.12,
        }}
        transition={{
          duration: 1.4,
          ease: "easeOut",
        }}
        className={[
          "absolute bottom-10 left-[21px] top-10 w-px origin-top",
          "bg-[#303030]/65 dark:bg-[#DEDA00]/70",
          "sm:left-[27px]",
          "lg:left-1/2 lg:-translate-x-1/2",
        ].join(" ")}
      />

      <div className="relative space-y-4 sm:space-y-5 lg:space-y-7">
        {processSteps.map(
          (step, index) => (
            <ProcessStep
              key={step.number}
              step={step}
              index={index}
            />
          ),
        )}
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

  const isRight =
    index % 2 !== 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.28,
      }}
      transition={{
        delay: index * 0.055,
        duration: 0.48,
      }}
      className={[
        "relative grid",
        "grid-cols-[44px_minmax(0,1fr)] gap-4",
        "sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-6",
        "lg:grid-cols-[1fr_76px_1fr] lg:gap-0",
      ].join(" ")}
    >
      <div
        className={[
          "hidden lg:block",
          isRight
            ? "lg:col-start-1"
            : "lg:col-start-3",
        ].join(" ")}
      />

      <div className="relative z-10 flex justify-center pt-6 lg:col-start-2 lg:row-start-1">
        <motion.span
          whileHover={{
            scale: 1.06,
          }}
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            "border-[5px] border-white",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
            "dark:border-[#111111]",
            "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
            step.iconClass,
          ].join(" ")}
        >
          <Icon size={16} />
        </motion.span>
      </div>

      <div
        className={[
          "relative min-w-0 rounded-[1.35rem]",
          "border border-black/[0.09] bg-[#fafaf8]",
          "p-5 sm:p-6 lg:p-7",
          "dark:border-white/[0.07] dark:bg-[#161616]",
          "lg:row-start-1",
          isRight
            ? "lg:col-start-3 lg:ml-0"
            : "lg:col-start-1 lg:mr-0",
        ].join(" ")}
      >
        <ProcessConnector
          side={
            isRight
              ? "left"
              : "right"
          }
        />

        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-[#64645e] dark:text-white/34">
              {step.label}
            </p>

            <h3 className="mt-2 text-xl font-black leading-[1.04] tracking-[-0.03em] text-[#303030] sm:text-2xl dark:text-white">
              {step.title}
            </h3>
          </div>

          <span className="shrink-0 text-[0.58rem] font-black tracking-[0.14em] text-[#85857e] dark:text-white/20">
            {step.number}
          </span>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#62625c] dark:text-white/40">
          {step.description}
        </p>

        <div className="mt-5 flex items-center gap-2 border-t border-black/[0.07] pt-4 dark:border-white/[0.06]">
          <ProcessSignalDot
            accent={step.accent}
          />

          <span className="text-[0.53rem] font-semibold uppercase tracking-[0.12em] text-[#73736d] dark:text-white/26">
            Project continues
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function ProcessSignalDot({
  accent,
}: {
  accent: string;
}) {
  if (accent === lime) {
    return (
      <span className="h-1.5 w-1.5 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />
    );
  }

  return (
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{
        backgroundColor: accent,
      }}
    />
  );
}

function ProcessConnector({
  side,
}: {
  side: "left" | "right";
}) {
  return (
    <span
      aria-hidden
      className={[
        "absolute top-[48px] hidden h-px w-[38px]",
        "bg-black/[0.10] dark:bg-white/[0.08]",
        "lg:block",
        side === "left"
          ? "-left-[38px]"
          : "-right-[38px]",
      ].join(" ")}
    />
  );
}

/* =========================================================
   QUICK GUIDES
========================================================= */

function GuidesSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f3f3ef] py-24 dark:border-white/[0.06] dark:bg-[#080808] lg:py-32">
      <SoftAtmosphere
        side="right"
        tone="neutral"
      />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionEyebrow>
              Quick video guides
            </SectionEyebrow>

            <SectionTitle>
              Learn exactly what{" "}

              <HeadlineAccent>
                you need.
              </HeadlineAccent>
            </SectionTitle>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 dark:text-white/42">
              Short walkthroughs for specific parts of the platform, so you do
              not have to watch the complete product overview every time.
            </p>

            <div className="mt-8 hidden flex-wrap gap-2 sm:flex">
              <GuideAudience>
                For clients
              </GuideAudience>

              <GuideAudience>
                For Allocats
              </GuideAudience>

              <GuideAudience>
                For everyone
              </GuideAudience>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {videoGuides.map(
              (guide, index) => (
                <VideoGuideCard
                  key={guide.title}
                  guide={guide}
                  index={index}
                />
              ),
            )}
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

  const embedUrl =
    getYouTubeEmbedUrl(
      guide.url,
    );

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        delay: index * 0.04,
        duration: 0.45,
      }}
      whileHover={{
        y: -3,
      }}
      className={[
        "group min-w-0 overflow-hidden rounded-[1.25rem]",
        "border border-black/[0.09] bg-white",
        "transition-shadow duration-300",
        "hover:shadow-[0_20px_55px_-44px_rgba(0,0,0,0.32)]",
        "dark:border-white/[0.07] dark:bg-[#151515]",
        "dark:hover:shadow-none",
      ].join(" ")}
    >
      <div className="relative aspect-video overflow-hidden bg-[#151515]">
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
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DEDA00] text-[#202020] transition-transform duration-300 group-hover:scale-105">
              <PlayIcon
                size={17}
                fill="currentColor"
              />
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2.5 py-1.5 text-[0.52rem] font-semibold text-white backdrop-blur-md">
          {guide.audience}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eeeeea] text-[#55554f] dark:bg-white/[0.055] dark:text-white/58">
            <Icon size={15} />
          </span>

          <span className="text-[0.5rem] font-black tracking-[0.14em] text-[#7d7d76] dark:text-white/22">
            {guide.number}
          </span>
        </div>

        <h3 className="mt-5 text-lg font-black leading-[1.08] tracking-[-0.025em] text-[#303030] dark:text-white">
          {guide.title}
        </h3>

        <p className="mt-3 hidden text-xs leading-6 text-[#64645e] dark:text-white/36 sm:block">
          {guide.description}
        </p>

        <p className="mt-5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-[#777771] dark:text-white/24">
          {guide.url
            ? "Watch guide"
            : "Video coming soon"}
        </p>
      </div>
    </motion.article>
  );
}

function GuideAudience({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-black/[0.10] bg-white px-3 py-2 text-[0.58rem] font-semibold text-[#5f5f59] dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-white/40">
      <span className="h-1.5 w-1.5 rounded-full bg-[#303030] dark:bg-[#DEDA00]" />

      {children}
    </span>
  );
}

/* =========================================================
   WORKSPACE
========================================================= */

function WorkspaceSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#0b0b0b] py-24 text-white lg:py-32">
      <WorkspaceAtmosphere />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
          <div>
            <SectionEyebrow dark>
              Project workspace
            </SectionEyebrow>

            <h2 className="mt-5 max-w-xl text-4xl font-black leading-[0.93] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Everyone sees the work.{" "}

              <span className="text-[#DEDA00]">
                Responsibilities stay clear.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/52 sm:text-base sm:leading-8">
              Clients stay close to the project without becoming a second task
              manager. Allocats control execution while progress remains
              visible.
            </p>

            <div className="mt-9 space-y-3">
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

function WorkspaceAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -right-[14rem] top-[8%] h-[36rem] w-[36rem] rounded-full bg-[#DEDA00]/[0.025] blur-[130px]" />

      <div className="absolute -left-[18rem] bottom-[-6rem] h-[34rem] w-[34rem] rounded-full bg-white/[0.018] blur-[130px]" />

      <SignalWave />
    </div>
  );
}

function SignalWave() {
  const reduceMotion =
    useReducedMotion();

  return (
    <div className="absolute -right-[22rem] top-[18%] h-[28rem] w-[70rem] text-[#DEDA00] opacity-[0.14]">
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -5, 0],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-full w-full"
      >
        <svg
          viewBox="0 0 1500 420"
          preserveAspectRatio="none"
          className="h-full w-full"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 18%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 18%, black 80%, transparent 100%)",
          }}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
          >
            <path
              d="M-120 285 C125 111 317 111 512 226 C709 343 885 340 1041 201 C1205 54 1371 86 1620 227"
              strokeWidth="1"
              opacity="0.72"
            />

            <path
              d="M-140 331 C100 185 314 165 520 268 C717 367 905 350 1071 237 C1244 119 1399 132 1630 272"
              strokeWidth="0.72"
              opacity="0.28"
            />

            <path
              d="M-110 233 C115 55 334 76 525 185 C716 295 889 292 1037 144 C1194 -13 1394 45 1610 166"
              strokeWidth="0.62"
              opacity="0.16"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

function WorkspaceVideo() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/[0.075] bg-[#141414] shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-white/[0.065] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEDA00]" />

          <span className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/38">
            Workspace walkthrough
          </span>
        </div>

        <LayoutDashboardIcon
          size={14}
          className="text-white/24"
        />
      </div>

      <YouTubeVideo
        url={videos.workspace}
        title="Watch a project move through the workspace"
      />

      <div className="border-t border-white/[0.065] px-5 py-5 sm:px-6">
        <h3 className="text-lg font-black text-white">
          Watch a project move through the workspace
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-7 text-white/40">
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
    <section className="border-b border-black/[0.08] bg-white py-24 dark:border-white/[0.06] dark:bg-[#111111] lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>
            Clear responsibilities
          </SectionEyebrow>

          <SectionTitle center>
            Same project.{" "}

            <HeadlineAccent>
              Different controls.
            </HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 dark:text-white/42">
            Both sides work from the same project, while permissions and
            operational controls follow each person's role.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[1.5rem] border border-black/[0.09] bg-white dark:border-white/[0.045] dark:bg-[#111111] lg:grid lg:grid-cols-2">
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

        <div className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-3 text-center">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#303030] text-white dark:bg-white/[0.06] dark:text-[#DEDA00]">
            <ShieldCheckIcon size={13} />
          </span>

          <p className="text-xs leading-6 text-[#60605a] dark:text-white/38">
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
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
      }}
      className={[
        "relative p-6 sm:p-8 lg:p-10",
        allocat
          ? [
              "bg-[#f2f2ee]",
              "dark:bg-[#0f0f0f]",
              "lg:border-l lg:border-black/[0.07]",
              "dark:lg:border-white/[0.04]",
            ].join(" ")
          : "bg-white dark:bg-[#151515]",
      ].join(" ")}
    >
      {allocat && (
        <span
          className={[
            "absolute bottom-8 left-0 top-8 hidden w-[2px] lg:block",
            "bg-[#303030]/25 dark:bg-[#DEDA00]/70",
          ].join(" ")}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#303030] text-white dark:bg-white/[0.06] dark:text-[#DEDA00]">
          <Icon size={17} />
        </span>

        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-[#686862] dark:text-white/26">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-8 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-[#303030] dark:text-white">
        {title}
      </h3>

      <p className="mt-5 max-w-md text-sm leading-7 text-[#5f5f59] dark:text-white/42">
        {description}
      </p>

      <div className="mt-8 border-t border-black/[0.08] pt-6 dark:border-white/[0.06]">
        <div className="grid gap-3">
          {actions.map(
            (action) => (
              <div
                key={action}
                className="flex items-start gap-3"
              >
                <CheckCircle2Icon
                  size={14}
                  className="mt-1 shrink-0 text-[#55554f] dark:text-[#DEDA00]"
                />

                <span className="text-sm leading-6 text-[#5f5f59] dark:text-white/44">
                  {action}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   COMPLETION
========================================================= */

function CompletionSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/[0.08] bg-[#f3f3ef] py-24 dark:border-white/[0.06] dark:bg-[#080808] lg:py-32">
      <SoftAtmosphere
        side="left"
        tone="warm"
      />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-center lg:gap-20">
          <div>
            <SectionEyebrow>
              Finishing the project
            </SectionEyebrow>

            <SectionTitle>
              Tasks finished.{" "}

              <HeadlineAccent>
                The outcome still needs approval.
              </HeadlineAccent>
            </SectionTitle>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#5f5f59] sm:text-base sm:leading-8 dark:text-white/42">
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
    <div className="mt-9 border-y border-black/[0.08] dark:border-white/[0.07]">
      {completionSteps.map(
        (step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.number}
              initial={{
                opacity: 0,
                x: -12,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay:
                  index * 0.05,
              }}
              className="grid grid-cols-[38px_minmax(0,1fr)] gap-4 border-b border-black/[0.08] py-5 last:border-b-0 dark:border-white/[0.07]"
            >
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  index === 0
                    ? "bg-[#38D200]/[0.10] text-[#247e08] dark:text-[#38D200]"
                    : index === 1
                      ? "bg-[#DEDA00]/[0.13] text-[#666300] dark:text-[#DEDA00]"
                      : index === 2
                        ? "bg-[#edede9] text-[#55554f] dark:bg-white/[0.055] dark:text-white/55"
                        : "bg-[#303030] text-white dark:bg-[#DEDA00] dark:text-[#202020]",
                ].join(" ")}
              >
                <Icon size={14} />
              </span>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[0.5rem] font-black tracking-[0.12em] text-[#777771] dark:text-white/24">
                    {step.number}
                  </span>

                  <h3 className="text-sm font-black text-[#303030] dark:text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-1.5 text-xs leading-6 text-[#64645e] dark:text-white/36">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        },
      )}
    </div>
  );
}

function CompletionVideo() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.09] bg-white shadow-[0_28px_80px_-55px_rgba(0,0,0,0.26)] dark:border-white/[0.075] dark:bg-[#141414] dark:shadow-none">
      <div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 dark:border-white/[0.065] sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />

          <span className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-[#60605a] dark:text-white/38">
            Completion walkthrough
          </span>
        </div>

        <ClipboardCheckIcon
          size={14}
          className="text-[#777771] dark:text-white/24"
        />
      </div>

      <YouTubeVideo
        url={videos.completion}
        title="See how work moves into client review"
      />

      <div className="border-t border-black/[0.08] px-5 py-5 dark:border-white/[0.065] sm:px-6">
        <h3 className="text-lg font-black text-[#303030] dark:text-white">
          From completed tasks to confirmed project
        </h3>

        <p className="mt-2 text-sm leading-7 text-[#60605a] dark:text-white/40">
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
    <section className="relative overflow-hidden bg-white py-24 dark:bg-[#111111] lg:py-32">
      <FinalAtmosphere />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>
            Ready to start?
          </SectionEyebrow>

          <h2 className="mx-auto mt-6 max-w-[13ch] text-5xl font-black leading-[0.9] tracking-[-0.055em] text-[#303030] sm:text-6xl lg:text-7xl dark:text-white">
            Bring the right people into{" "}

            <HeadlineAccent>
              the right work.
            </HeadlineAccent>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#5f5f59] sm:text-base dark:text-white/42">
            Start with the project, find the skills it needs and keep the work
            moving in one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className={[
                "group h-12 rounded-lg px-7 text-xs font-bold shadow-none",
                primaryButton,
              ].join(" ")}
            >
              <Link to={postProjectHref}>
                Start a project

                <ArrowRightIcon
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className={[
                "h-12 rounded-lg px-7 text-xs font-semibold shadow-none",
                outlineButton,
              ].join(" ")}
            >
              <Link to={allocatHref}>
                {allocatLabel}
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl border-t border-black/[0.08] pt-7 dark:border-white/[0.07] sm:grid-cols-3">
            <FinalMetric
              number="01"
              label="Create"
            />

            <FinalMetric
              number="02"
              label="Allocate"
            />

            <FinalMetric
              number="03"
              label="Complete"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-[15%] h-[28rem] w-[54rem] -translate-x-1/2 rounded-[50%] bg-black/[0.025] blur-[125px] dark:bg-white/[0.014]" />

      <div className="absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-black/[0.055] to-transparent dark:via-white/[0.035]" />
    </div>
  );
}

function FinalMetric({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="border-b border-black/[0.07] py-4 last:border-b-0 dark:border-white/[0.06] sm:border-b-0 sm:border-r sm:py-0 sm:last:border-r-0">
      <p className="text-[0.48rem] font-black tracking-[0.15em] text-[#777771] dark:text-[#DEDA00]">
        {number}
      </p>

      <p className="mt-1.5 text-sm font-bold text-[#303030] dark:text-white">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   VIDEO
========================================================= */

function YouTubeVideo({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const embedUrl =
    getYouTubeEmbedUrl(
      url,
    );

  return (
    <div className="relative aspect-video overflow-hidden bg-[#151515]">
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
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DEDA00] text-[#202020] transition-transform duration-300 hover:scale-105">
              <PlayIcon
                size={20}
                fill="currentColor"
              />
            </span>

            <p className="mt-4 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/32">
              Video coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getYouTubeEmbedUrl(
  url: string,
) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl =
      new URL(url);

    let videoId = "";

    if (
      parsedUrl.hostname.includes(
        "youtu.be",
      )
    ) {
      videoId =
        parsedUrl.pathname.replace(
          "/",
          "",
        );
    }

    if (
      parsedUrl.hostname.includes(
        "youtube.com",
      )
    ) {
      if (
        parsedUrl.pathname ===
        "/watch"
      ) {
        videoId =
          parsedUrl.searchParams.get(
            "v",
          ) ?? "";
      }

      if (
        parsedUrl.pathname.startsWith(
          "/shorts/",
        )
      ) {
        videoId =
          parsedUrl.pathname.split(
            "/",
          )[2] ?? "";
      }

      if (
        parsedUrl.pathname.startsWith(
          "/embed/",
        )
      ) {
        videoId =
          parsedUrl.pathname.split(
            "/",
          )[2] ?? "";
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
   BACKGROUND
========================================================= */

function SoftAtmosphere({
  side,
  tone,
}: {
  side: "left" | "right";
  tone: "neutral" | "warm";
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className={[
          "absolute top-[18%] h-[34rem] w-[34rem] rounded-full blur-[135px]",
          side === "left"
            ? "-left-[20rem]"
            : "-right-[20rem]",
          tone === "warm"
            ? "bg-[#F0A23A]/[0.018] dark:bg-[#F0A23A]/[0.016]"
            : "bg-black/[0.025] dark:bg-white/[0.015]",
        ].join(" ")}
      />
    </div>
  );
}

/* =========================================================
   SHARED
========================================================= */

function SectionEyebrow({
  children,
  center = false,
  dark = false,
}: {
  children: ReactNode;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2.5",
        center
          ? "justify-center"
          : "",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 shrink-0 rounded-full",
          dark
            ? "bg-[#DEDA00]"
            : "bg-[#303030] dark:bg-[#DEDA00]",
        ].join(" ")}
      />

      <span
        className={[
          "text-[0.56rem] font-semibold uppercase tracking-[0.2em]",
          dark
            ? "text-white/38"
            : "text-[#5e5e58] dark:text-white/32",
        ].join(" ")}
      >
        {children}
      </span>
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
        "mt-5 max-w-5xl",
        "text-4xl font-black leading-[0.92] tracking-[-0.05em]",
        "text-[#303030] dark:text-white",
        "sm:text-5xl lg:text-6xl",
        center
          ? "mx-auto"
          : "",
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function HeadlineAccent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="text-[#303030] dark:text-[#DEDA00]">
      {children}
    </span>
  );
}

function HeroFact({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.62rem] font-medium text-[#5f5f59] dark:text-white/36">
      <CheckCircle2Icon
        size={12}
        className="text-[#247e08] dark:text-[#38D200]"
      />

      {children}
    </span>
  );
}

function DarkFact({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.055] text-[#DEDA00]">
        <Icon size={14} />
      </span>

      <p className="pt-1 text-sm leading-6 text-white/56">
        {text}
      </p>
    </div>
  );
}

export default HowItWorksPage;