import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  ClipboardCheckIcon,
  CompassIcon,
  FileTextIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import { useAuth } from "@/auth/useAuth";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

/* =========================================================
   IMAGE
========================================================= */

const ABOUT_HERO_IMAGE =
  "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg";

/* =========================================================
   TYPES
========================================================= */

type Tone = "primary" | "success" | "pending" | "neutral";

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

function toneIconClass(tone: Tone) {
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

const reasons: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
}[] = [
  {
    number: "01",
    title: "Skills should be easier to find.",
    description:
      "People should be able to start with the work they need done and find professionals with the relevant experience.",
    icon: SearchIcon,
    tone: "primary",
  },
  {
    number: "02",
    title: "The match should lead somewhere.",
    description:
      "Finding the right person is only the beginning. Tasks, communication and progress still need a clear place to live.",
    icon: TargetIcon,
    tone: "primary",
  },
  {
    number: "03",
    title: "Every job deserves structure.",
    description:
      "Whether it is a repair, installation or bigger project, both sides benefit when expectations and responsibilities are clear.",
    icon: LayoutDashboardIcon,
    tone: "pending",
  },
];

const journey: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
}[] = [
  {
    number: "01",
    title: "Create the project",
    description:
      "Start with the work, expected outcome, timing and the information professionals need.",
    icon: FileTextIcon,
    tone: "primary",
  },
  {
    number: "02",
    title: "Find the skills",
    description:
      "Discover Allocats whose experience and capabilities fit what the project requires.",
    icon: UsersIcon,
    tone: "primary",
  },
  {
    number: "03",
    title: "Move the work",
    description:
      "Allocats manage execution while tasks, deadlines, comments and progress stay visible.",
    icon: WrenchIcon,
    tone: "pending",
  },
  {
    number: "04",
    title: "Review the outcome",
    description:
      "When the work is ready, the client reviews the completed project and decides what happens next.",
    icon: ClipboardCheckIcon,
    tone: "success",
  },
];

const values: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: Tone;
}[] = [
  {
    title: "Clarity",
    description:
      "The brief, responsibilities, tasks and progress should be easy for everyone involved to understand.",
    icon: CompassIcon,
    tone: "primary",
  },
  {
    title: "Trust",
    description:
      "Clients need useful context before choosing someone, and skilled professionals deserve a clear way to show what they can do.",
    icon: ShieldCheckIcon,
    tone: "success",
  },
  {
    title: "Momentum",
    description:
      "Good tools should reduce friction and help work move forward instead of creating more administration.",
    icon: ZapIcon,
    tone: "pending",
  },
  {
    title: "Respect",
    description:
      "The person commissioning the work and the person delivering it both need clear responsibilities and a professional working relationship.",
    icon: HeartHandshakeIcon,
    tone: "primary",
  },
];

/* =========================================================
   PAGE
========================================================= */

function AboutPage() {
  const { user } = useAuth();

  const postTaskHref = user ? "/projects/new" : "/register";
  const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";
  const allocatLabel = user?.isAllocat ? "View projects" : "Become an Allocat";

  return (
    <>
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-background text-foreground">
        <HeroSection postTaskHref={postTaskHref} />
        <WhySection />
        <AllocatSection />
        <RolesSection />
        <JourneySection />
        <ValuesSection />

        <FinalCta allocatHref={allocatHref} allocatLabel={allocatLabel} />
      </main>

      <SiteFooter />
    </>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection({ postTaskHref }: { postTaskHref: string }) {
  return (
    <section className="border-b border-border/55 bg-background pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">
          <Reveal>
            <SectionEyebrow>About Allocatr</SectionEyebrow>

            <h1 className="mt-5 max-w-[12ch] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-foreground/95 sm:text-5xl lg:text-[3.7rem]">
              Skilled work should be easier to{" "}
              <HeadlineAccent>make happen.</HeadlineAccent>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              Allocatr helps people find the skills a job needs, bring the right
              professionals into the project and keep the work moving in one
              shared workspace.
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
                <Link to="/allocats">
                  Find an Allocat
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
                <Link to={postTaskHref}>Start a project</Link>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              <HeroFact>Find by skill</HeroFact>
              <HeroFact>Work in one place</HeroFact>
              <HeroFact>Review the outcome</HeroFact>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <AboutHeroVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HERO VISUAL
========================================================= */

function AboutHeroVisual() {
  return (
    <div className="min-w-0">
      <div
        className={["overflow-hidden rounded-2xl border", cardSurface].join(
          " ",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
          <img
            src={ABOUT_HERO_IMAGE}
            alt="Skilled professional carrying out trade work"
            className="h-full w-full object-cover"
          />

          <div className="absolute left-4 top-4 rounded-lg border border-white/[0.18] bg-brand-charcoal/80 px-3 py-2 text-white">
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/60">
              Built around the work
            </p>

            <div className="mt-1 flex items-center gap-2 text-xs font-semibold">
              <span className="h-1.5 w-5 rounded-full bg-secondary" />
              Skill to outcome
            </div>
          </div>
        </div>

        <div className="border-t border-border/55 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Project responsibility
              </p>

              <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-foreground">
                Clear roles from the start
              </h2>
            </div>

            <span
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                accentIconSurface,
              ].join(" ")}
            >
              <LayoutDashboardIcon size={15} />
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <HeroRole
              icon={UsersIcon}
              label="Client"
              value="Outcome & approval"
            />

            <HeroRole
              icon={WrenchIcon}
              label="Allocat"
              value="Execution & delivery"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroRole({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl border px-3.5 py-3",
        quietSurface,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          accentIconSurface,
        ].join(" ")}
      >
        <Icon size={14} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-semibold text-foreground">
          {value}
        </p>
      </div>

      <CheckCircle2Icon
        size={13}
        className="ml-auto shrink-0 text-status-complete-foreground"
      />
    </div>
  );
}

/* =========================================================
   WHY
========================================================= */

function WhySection() {
  return (
    <section className="border-b border-border/55 bg-surface-2/30 py-20 dark:bg-surface-2/35 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 xl:gap-20">
          <div className="max-w-xl">
            <Reveal>
              <SectionEyebrow>Why Allocatr exists</SectionEyebrow>

              <SectionTitle>
                Finding someone should not feel like{" "}
                <HeadlineAccent>guesswork.</HeadlineAccent>
              </SectionTitle>

              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                People often know exactly what they need done but still struggle
                to find the right person. At the same time, capable
                professionals can struggle to reach the people who need their
                skills.
              </p>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Allocatr is designed to make that connection clearer and give
                the work somewhere structured to go once the match has been
                made.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4">
            {reasons.map((reason, index) => (
              <ReasonCard key={reason.number} reason={reason} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReasonCard({
  reason,
  index,
}: {
  reason: (typeof reasons)[number];
  index: number;
}) {
  const Icon = reason.icon;

  return (
    <Reveal delay={index * 0.04}>
      <article
        className={["rounded-2xl border p-5 sm:p-6", cardSurface].join(" ")}
      >
        <div className="grid gap-5 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-start">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg",
              toneIconClass(reason.tone),
            ].join(" ")}
          >
            <Icon size={16} />
          </span>

          <div>
            <h3 className="text-lg font-semibold tracking-[-0.025em] text-foreground sm:text-xl">
              {reason.title}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              {reason.description}
            </p>
          </div>

          <span className="text-[0.54rem] font-semibold tracking-[0.14em] text-muted-foreground/65">
            {reason.number}
          </span>
        </div>
      </article>
    </Reveal>
  );
}

/* =========================================================
   WHAT IS AN ALLOCAT
========================================================= */

function AllocatSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <div
            className={[
              "rounded-2xl border p-6 sm:p-8 lg:p-10",
              contrastSurface,
            ].join(" ")}
          >
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-center lg:gap-16">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <SparklesIcon size={18} />
                </span>

                <p className="mt-6 text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-white/55">
                  What is an Allocat?
                </p>
              </div>

              <div>
                <h2 className="max-w-3xl text-3xl font-semibold leading-[1.03] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]">
                  A skilled professional who takes responsibility for{" "}
                  <span className="text-secondary">getting the work done.</span>
                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Allocats bring practical experience into projects that need
                  it. They are not simply names in a directory. Once part of a
                  project, they take responsibility for executing the work and
                  moving the tasks through to completion.
                </p>

                <Button
                  asChild
                  variant="ghost"
                  className="mt-7 h-10 rounded-lg border border-secondary/10 bg-secondary px-5 text-xs font-semibold text-secondary-foreground shadow-none transition-opacity duration-150 hover:bg-secondary hover:text-secondary-foreground hover:opacity-90"
                >
                  <Link to="/allocats">
                    Explore Allocats
                    <ArrowRightIcon size={14} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   ROLES
========================================================= */

function RolesSection() {
  return (
    <section className="border-y border-border/55 bg-surface-2/30 py-20 dark:bg-surface-2/35 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow center>One workspace</SectionEyebrow>

          <SectionTitle center>
            Two clear roles.{" "}
            <HeadlineAccent>One shared project.</HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Both sides can understand what is happening without competing for
            control of the same work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div
              className={[
                "h-full overflow-hidden rounded-2xl border p-4 sm:p-5",
                cardSurface,
              ].join(" ")}
            >
              <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl bg-surface-2/40 p-5 dark:bg-surface-2/55 sm:p-8">
                <img
                  src={assets.computerPhone}
                  alt="Allocatr shared project workspace"
                  className="block h-auto w-full object-contain"
                />
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            <RoleSummaryCard
              eyebrow="For clients"
              title="You own the outcome."
              description="Clients create the project, choose who they work with, follow progress, comment and make the final decision on completion."
              icon={UsersIcon}
              points={[
                "See the project and its progress",
                "Comment and clarify requirements",
                "Review the finished outcome",
              ]}
            />

            <RoleSummaryCard
              eyebrow="For Allocats"
              title="You own the execution."
              description="Allocats manage the operational work, move tasks through the project and submit the finished project for client review."
              icon={BriefcaseBusinessIcon}
              points={[
                "Manage the project task board",
                "Update and complete work",
                "Submit completed work for review",
              ]}
              contrast
            />
          </div>
        </div>

        <div className="mx-auto mt-7 flex max-w-2xl items-start justify-center gap-3 text-center">
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              accentIconSurface,
            ].join(" ")}
          >
            <LayoutDashboardIcon size={13} />
          </span>

          <p className="pt-1 text-xs leading-6 text-muted-foreground">
            The same project stays visible to both sides while the controls
            change according to each person’s responsibility.
          </p>
        </div>
      </div>
    </section>
  );
}

function RoleSummaryCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  points,
  contrast = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: string[];
  contrast?: boolean;
}) {
  return (
    <Reveal>
      <article
        className={[
          "h-full rounded-2xl border p-6 sm:p-7",
          contrast ? contrastSurface : cardSurface,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg",
              contrast
                ? "bg-secondary text-secondary-foreground"
                : accentIconSurface,
            ].join(" ")}
          >
            <Icon size={17} />
          </span>

          <span
            className={[
              "flex h-7 w-7 items-center justify-center rounded-lg",
              contrast
                ? "bg-white/[0.08] text-secondary"
                : "bg-status-complete/[0.08] text-status-complete-foreground",
            ].join(" ")}
          >
            <CircleCheckBigIcon size={13} />
          </span>
        </div>

        <p
          className={[
            "mt-6 text-[0.52rem] font-semibold uppercase tracking-[0.15em]",
            contrast ? "text-white/55" : "text-muted-foreground",
          ].join(" ")}
        >
          {eyebrow}
        </p>

        <h3
          className={[
            "mt-2 text-2xl font-semibold tracking-[-0.035em]",
            contrast ? "text-white" : "text-foreground",
          ].join(" ")}
        >
          {title}
        </h3>

        <p
          className={[
            "mt-4 text-sm leading-7",
            contrast ? "text-white/65" : "text-muted-foreground",
          ].join(" ")}
        >
          {description}
        </p>

        <div
          className={[
            "mt-6 space-y-3 border-t pt-5",
            contrast ? "border-white/[0.10]" : "border-border/50",
          ].join(" ")}
        >
          {points.map((point) => (
            <div key={point} className="flex items-start gap-2.5">
              <CheckCircle2Icon
                size={14}
                className={[
                  "mt-0.5 shrink-0",
                  contrast
                    ? "text-secondary"
                    : "text-status-complete-foreground",
                ].join(" ")}
              />

              <span
                className={[
                  "text-xs leading-5",
                  contrast ? "text-white/65" : "text-muted-foreground",
                ].join(" ")}
              >
                {point}
              </span>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

/* =========================================================
   JOURNEY
========================================================= */

function JourneySection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 xl:gap-20">
          <div className="max-w-xl">
            <SectionEyebrow>How the work moves</SectionEyebrow>

            <SectionTitle>
              From the first brief to{" "}
              <HeadlineAccent>final review.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              Allocatr gives the working relationship a clear path without
              making the platform more complicated than the job itself.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {journey.map((step, index) => (
              <JourneyCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyCard({
  step,
  index,
}: {
  step: (typeof journey)[number];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <Reveal delay={index * 0.04}>
      <article
        className={[
          "flex min-h-[250px] flex-col justify-between rounded-2xl border p-6",
          cardSurface,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg",
              toneIconClass(step.tone),
            ].join(" ")}
          >
            <Icon size={16} />
          </span>

          <span className="text-[0.54rem] font-semibold tracking-[0.14em] text-muted-foreground/65">
            {step.number}
          </span>
        </div>

        <div className="mt-12">
          <h3 className="text-lg font-semibold tracking-[-0.025em] text-foreground sm:text-xl">
            {step.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {step.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/* =========================================================
   VALUES
========================================================= */

function ValuesSection() {
  return (
    <section className={["border-y py-20 lg:py-28", contrastSurface].join(" ")}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 xl:gap-20">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <BadgeCheckIcon size={18} />
            </span>

            <ContrastEyebrow className="mt-6">What guides us</ContrastEyebrow>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-[1.03] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]">
              Simple principles for{" "}
              <span className="text-secondary">better work.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  value,
  index,
}: {
  value: (typeof values)[number];
  index: number;
}) {
  const Icon = value.icon;

  return (
    <Reveal delay={index * 0.04}>
      <article className="min-h-[220px] rounded-2xl border border-white/[0.10] bg-white/[0.045] p-6">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            value.tone === "success"
              ? "bg-status-complete/[0.14] text-status-complete"
              : value.tone === "pending"
                ? "bg-status-pending/[0.14] text-status-pending"
                : "bg-white/[0.08] text-secondary",
          ].join(" ")}
        >
          <Icon size={16} />
        </span>

        <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-white">
          {value.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/65">
          {value.description}
        </p>
      </article>
    </Reveal>
  );
}

/* =========================================================
   FINAL CTA
========================================================= */

function FinalCta({
  allocatHref,
  allocatLabel,
}: {
  allocatHref: string;
  allocatLabel: string;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <div className="grid gap-10 border-y border-border/55 py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-14">
            <div className="max-w-3xl">
              <SectionEyebrow>Built for both sides</SectionEyebrow>

              <h2 className="mt-4 text-3xl font-semibold leading-[1.03] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[2.75rem]">
                Need the skill?
                <span className="block">
                  Or <HeadlineAccent>have the skill?</HeadlineAccent>
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Allocatr gives both sides a clearer place to connect and move
                meaningful work forward.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                variant="ghost"
                className={[
                  "h-11 rounded-lg px-6 text-xs font-semibold",
                  primaryButton,
                ].join(" ")}
              >
                <Link to="/allocats">
                  Find an Allocat
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   MOTION
========================================================= */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
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

function ContrastEyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["flex items-center gap-2.5", className].join(" ")}>
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

export default AboutPage;
