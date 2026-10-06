import { Link } from "react-router-dom";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  Layers3Icon,
  MinusIcon,
  NetworkIcon,
  SparklesIcon,
  UsersIcon,
  WandSparklesIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

/* =========================================================
   TYPES
========================================================= */

type FeatureRow = {
  label: string;
  standard: string | boolean;
  pro: string | boolean;
};

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/* =========================================================
   DATA
========================================================= */

const proBenefits: Benefit[] = [
  {
    icon: Layers3Icon,
    title: "Multidisciplinary projects",
    description:
      "Bring multiple practices into one project instead of splitting complex work into separate briefs.",
  },
  {
    icon: UsersIcon,
    title: "Team Builder",
    description:
      "Define the roles, capabilities and number of Allocats required to deliver your project.",
  },
  {
    icon: WandSparklesIcon,
    title: "AI-assisted team planning",
    description:
      "Turn a project brief into a recommended mix of roles, skills and disciplines.",
  },
  {
    icon: NetworkIcon,
    title: "Smarter matching",
    description:
      "Surface Allocats whose skills, experience and availability are better aligned to each role.",
  },
];

const comparisonRows: FeatureRow[] = [
  {
    label: "Post projects",
    standard: true,
    pro: true,
  },
  {
    label: "Discover Allocats",
    standard: true,
    pro: true,
  },
  {
    label: "Invite Allocats to projects",
    standard: true,
    pro: true,
  },
  {
    label: "Project workspace",
    standard: true,
    pro: true,
  },
  {
    label: "Tasks and milestones",
    standard: true,
    pro: true,
  },
  {
    label: "Project communication",
    standard: true,
    pro: true,
  },
  {
    label: "Reviews and ratings",
    standard: true,
    pro: true,
  },
  {
    label: "Single-practice projects",
    standard: true,
    pro: true,
  },
  {
    label: "Multidisciplinary projects",
    standard: false,
    pro: true,
  },
  {
    label: "Team Builder",
    standard: false,
    pro: true,
  },
  {
    label: "AI Team Builder",
    standard: false,
    pro: true,
  },
  {
    label: "Team composition recommendations",
    standard: false,
    pro: true,
  },
  {
    label: "Advanced Allocat matching",
    standard: "Standard matching",
    pro: "Advanced matching",
  },
  {
    label: "Team budget planning",
    standard: false,
    pro: true,
  },
  {
    label: "Invite a complete project team",
    standard: false,
    pro: true,
  },
  {
    label: "Advanced project insights",
    standard: false,
    pro: true,
  },
  {
    label: "Enhanced team coordination",
    standard: false,
    pro: true,
  },
];

/* =========================================================
   THEME
========================================================= */

const primaryButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",
  "shadow-none",
  "transition-opacity duration-150",

  "hover:border-brand-secondary-highlight/15",
  "hover:bg-brand-secondary-highlight",
  "hover:text-primary-foreground",
  "hover:opacity-90",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/20",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/10",
  "dark:hover:bg-secondary",
  "dark:hover:text-secondary-foreground",
  "dark:hover:opacity-90",

  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryButton = [
  "border border-border/65",
  "bg-surface-2/35",
  "text-foreground/75",
  "shadow-none",
  "transition-opacity duration-150",

  "hover:border-border/65",
  "hover:bg-surface-2/35",
  "hover:text-foreground/75",
  "hover:opacity-75",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/15",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",

  "dark:border-border",
  "dark:bg-surface-2/65",
  "dark:text-foreground/75",

  "dark:hover:border-border",
  "dark:hover:bg-surface-2/65",
  "dark:hover:text-foreground/75",
  "dark:hover:opacity-75",
].join(" ");

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08]",
  "text-brand-secondary-highlight",
  "ring-1 ring-inset ring-brand-secondary-highlight/10",

  "dark:bg-secondary/[0.07]",
  "dark:text-secondary",
  "dark:ring-secondary/10",
].join(" ");

/* =========================================================
   PAGE
========================================================= */

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section className="border-b border-border/45">
          <div className="container mx-auto px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

                <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                  Plans
                </p>

                <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-foreground/95 sm:text-5xl lg:text-6xl">
                Do more with Allocatr
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Start with everything you need to find skilled professionals
                and get work moving. Go Pro when the work gets bigger, more
                complex and needs a complete team.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="ghost"
                  className={[
                    "h-11 rounded-lg px-5 text-sm font-semibold",
                    primaryButton,
                  ].join(" ")}
                >
                  <Link to="/register">
                    Get started
                    <ArrowRightIcon size={15} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className={[
                    "h-11 rounded-lg px-5 text-sm font-semibold",
                    secondaryButton,
                  ].join(" ")}
                >
                  <a href="#compare-plans">
                    Compare plans
                  </a>
                </Button>
              </div>

              <p className="mt-5 text-xs text-muted-foreground">
                Start simple. Upgrade when your projects need more capability.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            TWO PLANS
        ================================================= */}

        <section className="border-b border-border/45">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Choose your level"
              title="Built to grow with the work"
              description="Most projects start with one clear requirement. When that work expands across multiple practices, Allocatr Pro gives you a better way to plan, build and coordinate the team."
            />

            <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
              {/* STANDARD */}

              <article className="flex min-h-full flex-col rounded-2xl border border-border/55 bg-card p-6 dark:border-border dark:bg-card sm:p-7">
                <div>
                  <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Allocatr
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground">
                    Get the work moving.
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    Find the right Allocat, create focused projects and manage
                    the work from one place.
                  </p>
                </div>

                <div className="mt-8 border-y border-border/50 py-5">
                  <p className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Price
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                      Free
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex-1">
                  <p className="text-xs font-semibold text-foreground">
                    Includes
                  </p>

                  <div className="mt-4 space-y-3">
                    <PlanFeature>
                      Post and manage projects
                    </PlanFeature>

                    <PlanFeature>
                      Discover skilled Allocats
                    </PlanFeature>

                    <PlanFeature>
                      Invite Allocats to your projects
                    </PlanFeature>

                    <PlanFeature>
                      Tasks, milestones and project communication
                    </PlanFeature>

                    <PlanFeature>
                      Reviews and ratings
                    </PlanFeature>

                    <PlanFeature>
                      Single-practice projects
                    </PlanFeature>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className={[
                    "mt-8 h-11 w-full rounded-lg text-sm font-semibold",
                    secondaryButton,
                  ].join(" ")}
                >
                  <Link to="/register">
                    Get started
                  </Link>
                </Button>
              </article>

              {/* PRO */}

              <article className="relative flex min-h-full flex-col overflow-hidden rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground dark:border-brand-secondary-highlight/25 dark:bg-brand-secondary sm:p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border border-white/[0.05]"
                />

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                      Allocatr Pro
                    </p>

                    <span className="rounded-lg bg-secondary px-2.5 py-1 text-[0.58rem] font-semibold text-secondary-foreground">
                      Pro
                    </span>
                  </div>

                  <div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">
                      Built for bigger work.
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-7 text-white/65">
                      Plan multidisciplinary projects, build complete teams and
                      use smarter tools to find the right combination of talent.
                    </p>
                  </div>

                  <div className="mt-8 border-y border-white/[0.10] py-5">
                    <p className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                      Pro pricing
                    </p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        Coming soon
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex-1">
                    <p className="text-xs font-semibold text-white">
                      Everything in Allocatr, plus
                    </p>

                    <div className="mt-4 space-y-3">
                      <ContrastPlanFeature>
                        Multidisciplinary projects
                      </ContrastPlanFeature>

                      <ContrastPlanFeature>
                        Team Builder
                      </ContrastPlanFeature>

                      <ContrastPlanFeature>
                        AI-assisted team planning
                      </ContrastPlanFeature>

                      <ContrastPlanFeature>
                        Advanced Allocat matching
                      </ContrastPlanFeature>

                      <ContrastPlanFeature>
                        Team budget planning
                      </ContrastPlanFeature>

                      <ContrastPlanFeature>
                        Advanced project insights
                      </ContrastPlanFeature>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    className={[
                      "mt-8 h-11 w-full rounded-lg",
                      "bg-secondary",
                      "text-sm font-semibold",
                      "text-secondary-foreground",
                      "shadow-none",

                      "transition-opacity duration-150",

                      "hover:bg-secondary",
                      "hover:text-secondary-foreground",
                      "hover:opacity-90",

                      "focus-visible:ring-2",
                      "focus-visible:ring-secondary/30",
                      "focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-primary",
                    ].join(" ")}
                  >
                    <a href="#team-builder">
                      Explore Pro
                      <ArrowRightIcon size={15} />
                    </a>
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =================================================
            PRO POSITIONING
        ================================================= */}

        <section className="border-b border-border/45">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Why Pro"
              title="More than a bigger project form"
              description="Allocatr Pro is not simply about selecting more categories. It gives you a better way to plan, staff and run work that spans multiple disciplines."
            />

            <div className="mx-auto mt-10 grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-border/55 bg-border/55 sm:grid-cols-2 lg:grid-cols-4 dark:border-border dark:bg-border">
              {proBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-card p-5 dark:bg-card sm:p-6"
                >
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      accentIconSurface,
                    ].join(" ")}
                  >
                    <benefit.icon size={15} />
                  </span>

                  <h3 className="mt-5 text-sm font-semibold text-foreground">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            TEAM BUILDER
        ================================================= */}

        <section
          id="team-builder"
          className="bg-primary text-primary-foreground dark:bg-brand-secondary"
        >
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              {/* COPY */}

              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-6 rounded-full bg-secondary" />

                  <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-white/50">
                    Allocatr Pro
                  </p>
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-4xl">
                  One project. Every skill it needs.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-8 text-white/65 sm:text-base">
                  Large projects rarely fit neatly into one practice. Team
                  Builder lets you bring multiple disciplines into one project
                  and assemble the right combination of Allocats around the
                  work.
                </p>

                <div className="mt-8 space-y-4">
                  <ContrastDetail
                    icon={Layers3Icon}
                    title="One coordinated project"
                    description="Keep multidisciplinary work together instead of breaking it into disconnected projects."
                  />

                  <ContrastDetail
                    icon={UsersIcon}
                    title="Define the team you need"
                    description="Plan roles, disciplines and required capabilities before you start inviting people."
                  />

                  <ContrastDetail
                    icon={WorkflowIcon}
                    title="Build around the work"
                    description="Structure the team based on what the project actually needs to deliver."
                  />
                </div>
              </div>

              {/* EXAMPLE */}

              <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] p-5 sm:p-6">
                <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-white/45">
                  Example project
                </p>

                <h3 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-white">
                  Digital banking platform launch
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  Redesign the customer experience, build the frontend,
                  integrate existing banking APIs, test the platform and
                  prepare launch communications.
                </p>

                <div className="mt-6 border-t border-white/[0.10] pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-white">
                      Recommended team
                    </p>

                    <span className="text-[0.6rem] font-medium text-secondary">
                      6 Allocats
                    </span>
                  </div>

                  <div className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                    <TeamRole
                      practice="Product design"
                      role="Product Designer"
                      count={1}
                    />

                    <TeamRole
                      practice="Frontend"
                      role="React Developer"
                      count={2}
                    />

                    <TeamRole
                      practice="Backend"
                      role="API Developer"
                      count={1}
                    />

                    <TeamRole
                      practice="Quality assurance"
                      role="QA Specialist"
                      count={1}
                    />

                    <TeamRole
                      practice="Content"
                      role="Copywriter"
                      count={1}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/55">
                    <span>5 practices identified</span>
                    <span>6 roles allocated</span>
                    <span>1 coordinated project</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            AI TEAM BUILDER
        ================================================= */}

        <section className="border-b border-border/45">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* AI EXAMPLE */}

              <div className="rounded-2xl border border-border/55 bg-card p-5 dark:border-border dark:bg-card sm:p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      accentIconSurface,
                    ].join(" ")}
                  >
                    <SparklesIcon size={15} />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      AI Team Builder
                    </p>

                    <p className="mt-0.5 text-[0.61rem] text-muted-foreground">
                      Project brief analysis
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border/50 bg-surface-2/30 p-4 dark:bg-surface-2/45">
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Your brief
                  </p>

                  <p className="mt-3 text-sm leading-7 text-foreground/75">
                    We need a new customer portal with a redesigned user
                    experience, frontend development, backend integrations,
                    testing and launch content.
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Allocatr identifies
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Product design",
                      "Frontend",
                      "Backend",
                      "Quality assurance",
                      "Copywriting",
                    ].map((practice) => (
                      <span
                        key={practice}
                        className={[
                          "rounded-lg px-3 py-1.5",
                          "bg-brand-secondary-highlight/[0.07]",
                          "text-xs font-semibold",
                          "text-brand-secondary-highlight",
                          "ring-1 ring-inset ring-brand-secondary-highlight/10",

                          "dark:bg-secondary/[0.07]",
                          "dark:text-secondary",
                          "dark:ring-secondary/10",
                        ].join(" ")}
                      >
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-border/50 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Team structure ready
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Review the recommendation before selecting Allocats.
                      </p>
                    </div>

                    <BadgeCheckIcon
                      size={18}
                      className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* COPY */}

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

                  <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                    AI Team Builder
                  </p>
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.03] tracking-[-0.045em] text-foreground sm:text-4xl">
                  Tell us what you're trying to deliver.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
                  AI Team Builder can analyse your project brief, identify the
                  practices and skills involved, then recommend the team
                  structure that best fits the work.
                </p>

                <div className="mt-7 border-y border-border/50 py-5">
                  <p className="text-lg font-semibold tracking-[-0.025em] text-foreground">
                    Allocatr builds the shortlist. You build the team.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Recommendations help you make a faster, more informed
                    decision. You remain in control of who joins your project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTEXTUAL UPGRADE
        ================================================= */}

        <section className="border-b border-border/45">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-4xl rounded-2xl border border-border/55 bg-surface-2/30 p-6 dark:border-border dark:bg-surface-2/50 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    accentIconSurface,
                  ].join(" ")}
                >
                  <BriefcaseBusinessIcon size={16} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    When the work gets bigger
                  </p>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground sm:text-2xl">
                    This project looks bigger than one practice.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    If Allocatr detects requirements across multiple
                    disciplines, Pro can help turn them into one coordinated
                    project and recommend the team needed to deliver it.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Software development",
                      "UI/UX design",
                      "Quality assurance",
                      "Copywriting",
                    ].map((practice) => (
                      <span
                        key={practice}
                        className="rounded-lg border border-border/55 bg-card px-3 py-1.5 text-xs font-medium text-foreground/75 dark:border-border dark:bg-card"
                      >
                        {practice}
                      </span>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    className={[
                      "mt-6 h-10 rounded-lg px-4 text-xs font-semibold",
                      primaryButton,
                    ].join(" ")}
                  >
                    <a href="#team-builder">
                      Explore Team Builder
                      <ArrowRightIcon size={14} />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            COMPARISON
        ================================================= */}

        <section
          id="compare-plans"
          className="border-b border-border/45"
        >
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Compare plans"
              title="Start with what you need"
              description="Allocatr covers the essentials for focused projects. Pro adds the tools needed to plan and staff larger, multidisciplinary work."
            />

            <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-border/55 bg-card dark:border-border dark:bg-card">
              {/* DESKTOP */}

              <div className="hidden md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border/55">
                      <th className="w-1/2 px-5 py-5 text-xs font-semibold text-foreground">
                        Capability
                      </th>

                      <th className="w-1/4 border-l border-border/55 px-5 py-5 text-center">
                        <p className="text-xs font-semibold text-foreground">
                          Allocatr
                        </p>

                        <p className="mt-1 text-[0.58rem] font-normal text-muted-foreground">
                          Free
                        </p>
                      </th>

                      <th className="w-1/4 border-l border-border/55 bg-primary/[0.035] px-5 py-5 text-center dark:bg-secondary/[0.025]">
                        <p className="text-xs font-semibold text-brand-secondary-highlight dark:text-secondary">
                          Allocatr Pro
                        </p>

                        <p className="mt-1 text-[0.58rem] font-normal text-muted-foreground">
                          Paid
                        </p>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <tr
                        key={row.label}
                        className={
                          index <
                          comparisonRows.length - 1
                            ? "border-b border-border/45"
                            : ""
                        }
                      >
                        <td className="px-5 py-4 text-xs font-medium text-foreground/80">
                          {row.label}
                        </td>

                        <td className="border-l border-border/55 px-5 py-4 text-center">
                          <FeatureValue value={row.standard} />
                        </td>

                        <td className="border-l border-border/55 bg-primary/[0.025] px-5 py-4 text-center dark:bg-secondary/[0.02]">
                          <FeatureValue
                            value={row.pro}
                            pro
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-border/50 md:hidden">
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="p-4"
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {row.label}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                          Allocatr
                        </p>

                        <div className="mt-1.5">
                          <FeatureValue
                            value={row.standard}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-brand-secondary-highlight dark:text-secondary">
                          Pro
                        </p>

                        <div className="mt-1.5">
                          <FeatureValue
                            value={row.pro}
                            pro
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section>
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

                <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                  Ready when the work gets bigger
                </p>

                <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />
              </div>

              <h2 className="mt-6 text-3xl font-semibold leading-[1.03] tracking-[-0.045em] text-foreground sm:text-4xl">
                Start with Allocatr. Scale with your ambition.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                Whether you need one specialist today or a multidisciplinary
                project team tomorrow, Allocatr gives you a better way to get
                the work done.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="ghost"
                  className={[
                    "h-11 rounded-lg px-5 text-sm font-semibold",
                    primaryButton,
                  ].join(" ")}
                >
                  <Link to="/register">
                    Get started
                    <ArrowRightIcon size={15} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className={[
                    "h-11 rounded-lg px-5 text-sm font-semibold",
                    secondaryButton,
                  ].join(" ")}
                >
                  <a href="#team-builder">
                    Explore Allocatr Pro
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="flex items-center justify-center gap-2.5">
        <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

        <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
          {eyebrow}
        </p>

        <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />
      </div>

      <h2 className="mt-5 text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:text-4xl">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   PLAN FEATURE
========================================================= */

function PlanFeature({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
          accentIconSurface,
        ].join(" ")}
      >
        <CheckIcon size={11} />
      </span>

      <p className="text-xs leading-6 text-foreground/75">
        {children}
      </p>
    </div>
  );
}

/* =========================================================
   CONTRAST PLAN FEATURE
========================================================= */

function ContrastPlanFeature({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <CheckIcon size={11} />
      </span>

      <p className="text-xs leading-6 text-white/75">
        {children}
      </p>
    </div>
  );
}

/* =========================================================
   CONTRAST DETAIL
========================================================= */

function ContrastDetail({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-white/[0.09] pt-4 first:border-t-0 first:pt-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/[0.10] text-secondary ring-1 ring-inset ring-secondary/[0.12]">
        <Icon size={14} />
      </span>

      <div>
        <p className="text-xs font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-6 text-white/55">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TEAM ROLE
========================================================= */

function TeamRole({
  practice,
  role,
  count,
}: {
  practice: string;
  role: string;
  count: number;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[0.57rem] font-medium text-white/40">
          {practice}
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-white">
          {role}
        </p>
      </div>

      <span className="text-xs font-semibold text-secondary">
        ×{count}
      </span>
    </div>
  );
}

/* =========================================================
   FEATURE VALUE
========================================================= */

function FeatureValue({
  value,
  pro = false,
}: {
  value: string | boolean;
  pro?: boolean;
}) {
  if (typeof value === "string") {
    return (
      <span
        className={[
          "text-[0.65rem] font-medium",

          pro
            ? "text-brand-secondary-highlight dark:text-secondary"
            : "text-muted-foreground",
        ].join(" ")}
      >
        {value}
      </span>
    );
  }

  if (value) {
    return (
      <span
        className={[
          "inline-flex h-6 w-6 items-center justify-center rounded-md",

          pro
            ? [
                "bg-brand-secondary-highlight/[0.08]",
                "text-brand-secondary-highlight",
                "dark:bg-secondary/[0.08]",
                "dark:text-secondary",
              ].join(" ")
            : "bg-surface-3/70 text-foreground/65 dark:bg-surface-2",
        ].join(" ")}
      >
        <CheckIcon size={12} />
      </span>
    );
  }

  return (
    <span className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground/45">
      <MinusIcon size={13} />
    </span>
  );
}

export default PricingPage;