import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowDownIcon,
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  FileCheck2Icon,
  FileTextIcon,
  HardHatIcon,
  Layers3Icon,
  PaintbrushIcon,
  PawPrintIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import { useAuth } from "@/auth/useAuth";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

/* =========================================================
   TYPES
========================================================= */

type Tone = "teal" | "lime" | "green" | "amber" | "cyan" | "neutral";

type StatusTone = "active" | "pending" | "complete" | "overdue";

type WorkImageShape = "arch" | "soft" | "round" | "tall";

type TypingPhase = "typing" | "holding" | "clearing";

type TealAccent = "amber" | "lime" | "green" | "cyan";

type HeroCapability = {
  label: string;
  icon: LucideIcon;
  tone: Tone;
};

type HeroScenario = {
  id: string;
  brief: string;
  meta: string;
  category: string;
  capabilities: HeroCapability[];
  matchCount: number;
  matchName: string;
  initials: string;
  role: string;
  matchMeta: string;
};

/* =========================================================
   HERO DOTS
========================================================= */

const HERO_DOT_SPACING = 26;

const HERO_DOT_OFFSET = HERO_DOT_SPACING / 2;

const HERO_DOT_RADIUS = 1;

/* =========================================================
   IMAGERY

   Development references.

   Move approved imagery into local assets before production.
========================================================= */

const landingImages = {
  advisory:
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1400",

  projectManagement:
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400",

  electrical:
    "https://images.pexels.com/photos/29871587/pexels-photo-29871587.jpeg?auto=compress&cs=tinysrgb&w=1400",

  construction:
    "https://images.pexels.com/photos/14076979/pexels-photo-14076979.jpeg?auto=compress&cs=tinysrgb&w=1400",

  commercial:
    "https://images.pexels.com/photos/5493654/pexels-photo-5493654.jpeg?auto=compress&cs=tinysrgb&w=1400",

  projectTeam:
    "https://images.pexels.com/photos/30592258/pexels-photo-30592258.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

/* =========================================================
   ACTIONS

   Landing-page navigation actions deliberately use Link
   directly instead of the shared Button component.

   This prevents variant hover styles from bleeding into
   landing-page brand states.
========================================================= */

const actionBase = [
  "inline-flex items-center justify-center gap-2",

  "rounded-lg border",

  "font-semibold",

  "shadow-none",

  "transition-opacity duration-150",

  "focus-visible:outline-none",

  "focus-visible:ring-2",

  "focus-visible:ring-offset-2",

  "focus-visible:ring-offset-background",
].join(" ");

const primaryButton = [
  actionBase,

  "border-brand-secondary-highlight/15",

  "bg-brand-secondary-highlight",

  "text-primary-foreground",

  "hover:border-brand-secondary-highlight/15",

  "hover:bg-brand-secondary-highlight",

  "hover:text-primary-foreground",

  "hover:opacity-[0.86]",

  "focus-visible:ring-brand-secondary-highlight/25",

  "dark:border-secondary/10",

  "dark:bg-secondary",

  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/10",

  "dark:hover:bg-secondary",

  "dark:hover:text-secondary-foreground",

  "dark:hover:opacity-[0.88]",

  "dark:focus-visible:ring-secondary/25",
].join(" ");

const secondaryButton = [
  actionBase,

  "border-border/65",

  "bg-surface-2/35",

  "text-foreground/70",

  "hover:border-border/65",

  "hover:bg-surface-2/35",

  "hover:text-foreground/70",

  "hover:opacity-[0.72]",

  "focus-visible:ring-brand-secondary-highlight/18",

  "dark:border-border",

  "dark:bg-surface-2/65",

  "dark:text-foreground/75",

  "dark:hover:border-border",

  "dark:hover:bg-surface-2/65",

  "dark:hover:text-foreground/75",

  "dark:hover:opacity-[0.76]",

  "dark:focus-visible:ring-secondary/18",
].join(" ");

const tealCardButton = [
  actionBase,

  "border-brand-primary/20",

  "bg-brand-primary",

  "text-secondary-foreground",

  "hover:border-brand-primary/20",

  "hover:bg-brand-primary",

  "hover:text-secondary-foreground",

  "hover:opacity-[0.84]",

  "focus-visible:ring-brand-primary/30",

  "focus-visible:ring-offset-primary",
].join(" ");

/* =========================================================
   SURFACES
========================================================= */

const paperSurface = [
  "border-border/55",

  "bg-card",

  "dark:border-border",

  "dark:bg-card",
].join(" ");

const quietSurface = [
  "border-border/50",

  "bg-surface-2/35",

  "dark:border-border",

  "dark:bg-surface-2/65",
].join(" ");

const neutralIconSurface = [
  "bg-surface-3/70",

  "text-foreground/55",

  "ring-1 ring-inset ring-border/40",

  "dark:bg-surface-2/85",

  "dark:text-foreground/65",

  "dark:ring-border",
].join(" ");

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.07]",

  "text-brand-secondary-highlight",

  "ring-1 ring-inset ring-brand-secondary-highlight/10",

  "dark:bg-secondary/[0.065]",

  "dark:text-secondary",

  "dark:ring-secondary/10",
].join(" ");

const tealInsightSurface = [
  "border-primary/20",

  "bg-primary",

  "text-primary-foreground",

  "dark:border-brand-secondary-highlight/25",

  "dark:bg-brand-secondary",

  "dark:text-white",
].join(" ");

/* =========================================================
   HERO DEMO
========================================================= */

const heroDemoSurface = [
  "border-primary/15",

  "bg-primary",

  "text-white",

  "dark:border-border",

  "dark:bg-card",

  "dark:text-foreground",
].join(" ");

const heroDemoMuted = ["text-white/55", "dark:text-muted-foreground"].join(" ");

const heroDemoSoft = ["text-white/72", "dark:text-foreground/70"].join(" ");

const heroDemoStrong = ["text-white", "dark:text-foreground"].join(" ");

const heroDemoDivider = ["border-white/[0.12]", "dark:border-border/55"].join(
  " ",
);

const heroDemoInnerSurface = [
  "border-white/[0.12]",

  "bg-white/[0.065]",

  "dark:border-border/60",

  "dark:bg-background/30",
].join(" ");

const heroDemoChipSurface = [
  "border-white/[0.12]",

  "bg-white/[0.075]",

  "dark:border-border/55",

  "dark:bg-surface-2/60",
].join(" ");

/* =========================================================
   OPERATING MODEL
========================================================= */

const operatingStages = [
  {
    number: "01",

    label: "Define",

    title: "Start with the outcome.",

    description:
      "Set the project, scope and expectations before looking for people.",

    icon: FileTextIcon,

    tone: "neutral" as Tone,
  },

  {
    number: "02",

    label: "Shape",

    title: "Identify capability.",

    description:
      "Turn the project into the practical skills and expertise it requires.",

    icon: WrenchIcon,

    tone: "teal" as Tone,
  },

  {
    number: "03",

    label: "Allocate",

    title: "Find the right fit.",

    description:
      "Connect those requirements to people who can take responsibility.",

    icon: UsersIcon,

    tone: "lime" as Tone,
  },

  {
    number: "04",

    label: "Deliver",

    title: "Keep work connected.",

    description:
      "Tasks, progress, decisions and completion stay with the project.",

    icon: CircleCheckBigIcon,

    tone: "green" as Tone,
  },
];

/* =========================================================
   CAPABILITY CARDS
========================================================= */

const capabilityCards = [
  {
    label: "Advisory",

    description: "Strategy · analysis · professional services",

    image: landingImages.advisory,

    icon: BriefcaseBusinessIcon,

    tone: "teal" as Tone,

    shape: "arch" as WorkImageShape,

    offset: "sm:mt-14",
  },

  {
    label: "Project delivery",

    description: "Coordination · implementation · rollout",

    image: landingImages.projectManagement,

    icon: Layers3Icon,

    tone: "lime" as Tone,

    shape: "soft" as WorkImageShape,

    offset: "sm:mt-0",
  },

  {
    label: "Technical",

    description: "Systems · electrical · specialist work",

    image: landingImages.electrical,

    icon: ZapIcon,

    tone: "amber" as Tone,

    shape: "round" as WorkImageShape,

    offset: "sm:mt-20",
  },

  {
    label: "Construction",

    description: "Building · commercial works · site delivery",

    image: landingImages.construction,

    icon: HardHatIcon,

    tone: "green" as Tone,

    shape: "tall" as WorkImageShape,

    offset: "sm:mt-7",
  },
];

/* =========================================================
   DISCOVERY
========================================================= */

const discoveryGroups = [
  {
    icon: BriefcaseBusinessIcon,

    title: "Strategy",

    count: 11,

    tone: "teal" as Tone,

    skills: ["Planning", "Research", "Advisory"],
  },

  {
    icon: PaintbrushIcon,

    title: "Creative",

    count: 14,

    tone: "lime" as Tone,

    skills: ["Brand", "Content", "Campaigns"],
  },

  {
    icon: ZapIcon,

    title: "Technical",

    count: 9,

    tone: "amber" as Tone,

    skills: ["Systems", "Electrical", "Engineering"],
  },

  {
    icon: TruckIcon,

    title: "Delivery",

    count: 6,

    tone: "green" as Tone,

    skills: ["Logistics", "Install", "Rollout"],
  },
];

/* =========================================================
   HERO SCENARIOS
========================================================= */

const heroScenarios: HeroScenario[] = [
  {
    id: "commercial-fitout",

    brief:
      "Plan and deliver our new regional office fit-out, including electrical works, furniture installation and site coordination.",

    meta: "Harare · Commercial project",

    category: "Project delivery",

    capabilities: [
      {
        label: "Coordination",

        icon: Layers3Icon,

        tone: "teal",
      },

      {
        label: "Electrical",

        icon: ZapIcon,

        tone: "amber",
      },

      {
        label: "Fit-out",

        icon: HardHatIcon,

        tone: "lime",
      },
    ],

    matchCount: 9,

    matchName: "Tariro M.",

    initials: "TM",

    role: "Project coordinator",

    matchMeta: "10 years · 4.9",
  },

  {
    id: "brand-launch",

    brief:
      "Develop a brand launch strategy, campaign toolkit and content production plan for a new financial service.",

    meta: "Zimbabwe · Professional services",

    category: "Brand & communications",

    capabilities: [
      {
        label: "Strategy",

        icon: BriefcaseBusinessIcon,

        tone: "teal",
      },

      {
        label: "Creative",

        icon: PaintbrushIcon,

        tone: "lime",
      },

      {
        label: "Delivery",

        icon: UsersIcon,

        tone: "green",
      },
    ],

    matchCount: 14,

    matchName: "Nyasha K.",

    initials: "NK",

    role: "Brand strategist",

    matchMeta: "9 years · 4.8",
  },

  {
    id: "business-advisory",

    brief:
      "Review our finance operations, map key controls and prepare a practical process-improvement roadmap.",

    meta: "Remote · Business advisory",

    category: "Finance & advisory",

    capabilities: [
      {
        label: "Process review",

        icon: FileCheck2Icon,

        tone: "teal",
      },

      {
        label: "Controls",

        icon: ShieldCheckIcon,

        tone: "green",
      },

      {
        label: "Implementation",

        icon: Layers3Icon,

        tone: "neutral",
      },
    ],

    matchCount: 7,

    matchName: "Rudo T.",

    initials: "RT",

    role: "Process consultant",

    matchMeta: "11 years · 4.9",
  },

  {
    id: "service-rollout",

    brief:
      "Coordinate the rollout of a new customer service platform across six branches, including process updates, training and implementation support.",

    meta: "6 locations · Transformation",

    category: "Operational rollout",

    capabilities: [
      {
        label: "Process design",

        icon: FileCheck2Icon,

        tone: "teal",
      },

      {
        label: "Implementation",

        icon: Layers3Icon,

        tone: "lime",
      },

      {
        label: "Training",

        icon: UsersIcon,

        tone: "cyan",
      },
    ],

    matchCount: 12,

    matchName: "Kuda N.",

    initials: "KN",

    role: "Implementation lead",

    matchMeta: "8 years · 4.9",
  },
];

/* =========================================================
   PAGE
========================================================= */

function LandingPage() {
  const { user } = useAuth();

  const postProjectHref = user ? "/projects/new" : "/register";

  const allocatHref = user?.isAllocat ? "/projects" : "/become-an-allocat";

  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden">
        <HeroSection postProjectHref={postProjectHref} />

        <StoryBand />

        <div className="bg-surface-1">
          <ConnectedWorkSection />

          <DiscoverySection />

          <WorkspaceSection postProjectHref={postProjectHref} />

          <ProofSection allocatHref={allocatHref} allocatLabel={allocatLabel} />
        </div>

        <FinalCta
          postProjectHref={postProjectHref}
          allocatHref={allocatHref}
          allocatLabel={allocatLabel}
        />
      </main>

      <SiteFooter />
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroSection({ postProjectHref }: { postProjectHref: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={[
        "relative isolate overflow-hidden",

        "min-h-screen",

        "min-h-[100svh]",

        "bg-background",
      ].join(" ")}
    >
      <HeroDotBackground />

      <div
        className={[
          "container relative z-10 mx-auto",

          "flex min-h-screen min-h-[100svh] items-center",

          "px-4 pb-24 pt-24",

          "sm:px-5",

          "sm:pb-24",

          "sm:pt-24",

          "md:px-8",

          "md:pt-28",

          "lg:pb-24",

          "lg:pt-24",
        ].join(" ")}
      >
        <div className="grid w-full gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <motion.div
            data-hero-no-effect="true"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 22,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="relative z-20"
          >
            <Eyebrow>Work, properly allocated</Eyebrow>

            <h1
              className={[
                "mt-5 max-w-[10.5ch]",

                "text-[2.85rem] font-semibold leading-[0.92] tracking-[-0.052em]",

                "text-foreground/95",

                "sm:mt-6",

                "sm:text-[4.5rem]",

                "md:text-[5.15rem]",

                "lg:text-[5.35rem]",

                "xl:text-[5.8rem]",
              ].join(" ")}
            >
              Start with the work.
              <span className="block text-brand-secondary-highlight dark:text-secondary">
                Find the right fit.
              </span>
            </h1>

            <motion.p
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.12,
                duration: 0.5,
              }}
              className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:mt-7 sm:text-base sm:leading-8"
            >
              Define the outcome, identify the capability it needs and bring the
              right people together around one shared project.
            </motion.p>

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row"
            >
              <Link
                to="/discover"
                className={[
                  "h-11 w-full px-6 text-xs",

                  "sm:h-12",

                  "sm:w-auto",

                  "sm:px-7",

                  primaryButton,
                ].join(" ")}
              >
                Find an Allocat
                <ArrowRightIcon size={14} />
              </Link>

              <Link
                to={postProjectHref}
                className={[
                  "h-11 w-full px-6 text-xs",

                  "sm:h-12",

                  "sm:w-auto",

                  "sm:px-7",

                  secondaryButton,
                ].join(" ")}
              >
                Post a project
              </Link>
            </motion.div>

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-border/55 pt-4 sm:mt-10 sm:gap-x-6 sm:pt-5"
            >
              <HeroDetail>Project first</HeroDetail>

              <HeroDetail>Capability led</HeroDetail>

              <HeroDetail className="hidden sm:inline-flex">
                Clear ownership
              </HeroDetail>
            </motion.div>
          </motion.div>

          <HeroMatchComposer />
        </div>
      </div>

      <HeroScrollCue />
    </section>
  );
}

/* =========================================================
   HERO SCROLL CUE
========================================================= */

function HeroScrollCue() {
  const reduceMotion = useReducedMotion();

  function scrollToStory() {
    const story = document.getElementById("landing-story");

    if (!story) {
      return;
    }

    story.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",

      block: "start",
    });
  }

  return (
    <motion.div
      data-hero-no-effect="true"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 8,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.8,
        duration: 0.5,
      }}
      className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 sm:bottom-6"
    >
      <button
        type="button"
        onClick={scrollToStory}
        aria-label="Scroll to learn how Allocatr works"
        className={[
          "flex flex-col items-center gap-2",

          "text-muted-foreground",

          "transition-opacity duration-150",

          "hover:opacity-70",

          "focus-visible:outline-none",
        ].join(" ")}
      >
        <span className="hidden text-[0.44rem] font-semibold uppercase tracking-[0.16em] sm:block">
          Explore
        </span>

        <motion.span
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, 4, 0],
                }
          }
          transition={{
            duration: 2.2,

            repeat: Infinity,

            ease: "easeInOut",
          }}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full",

            "border border-border/65",

            "bg-background/78",

            "text-brand-secondary-highlight",

            "backdrop-blur-md",

            "ring-1 ring-inset ring-border/20",

            "dark:border-border",

            "dark:bg-surface-1/80",

            "dark:text-secondary",

            "sm:h-11",

            "sm:w-11",
          ].join(" ")}
        >
          <ArrowDownIcon size={15} strokeWidth={1.8} />
        </motion.span>
      </button>
    </motion.div>
  );
}

/* =========================================================
   HERO DOT BACKGROUND
========================================================= */

function HeroDotBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const currentRoot = rootRef.current;

    if (currentRoot === null) {
      return;
    }

    const rootElement: HTMLDivElement = currentRoot;

    const currentHero = rootElement.closest<HTMLElement>("section");

    if (currentHero === null) {
      return;
    }

    const heroElement: HTMLElement = currentHero;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (reduceMotion || !finePointer.matches) {
      rootElement.style.setProperty("--hero-dot-opacity", "0");

      return;
    }

    let frameId = 0;

    let running = false;

    let initialized = false;

    let x = 0;

    let y = 0;

    let targetX = 0;

    let targetY = 0;

    let opacity = 0;

    let targetOpacity = 0;

    function animate() {
      x += (targetX - x) * 0.1;

      y += (targetY - y) * 0.1;

      const opacityEase = targetOpacity < opacity ? 0.15 : 0.075;

      opacity += (targetOpacity - opacity) * opacityEase;

      rootElement.style.setProperty("--hero-dot-x", `${x}px`);

      rootElement.style.setProperty("--hero-dot-y", `${y}px`);

      rootElement.style.setProperty("--hero-dot-opacity", String(opacity));

      const moving =
        Math.abs(targetX - x) > 0.08 || Math.abs(targetY - y) > 0.08;

      const fading = Math.abs(targetOpacity - opacity) > 0.002;

      if (moving || fading) {
        frameId = window.requestAnimationFrame(animate);

        return;
      }

      x = targetX;

      y = targetY;

      opacity = targetOpacity;

      rootElement.style.setProperty("--hero-dot-x", `${x}px`);

      rootElement.style.setProperty("--hero-dot-y", `${y}px`);

      rootElement.style.setProperty("--hero-dot-opacity", String(opacity));

      running = false;
    }

    function startAnimation() {
      if (running) {
        return;
      }

      running = true;

      frameId = window.requestAnimationFrame(animate);
    }

    function updatePointer(event: PointerEvent) {
      const rect = heroElement.getBoundingClientRect();

      targetX = event.clientX - rect.left;

      targetY = event.clientY - rect.top;

      if (!initialized) {
        initialized = true;

        x = targetX;

        y = targetY;

        rootElement.style.setProperty("--hero-dot-x", `${x}px`);

        rootElement.style.setProperty("--hero-dot-y", `${y}px`);
      }
    }

    function isBlocked(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return false;
      }

      return Boolean(target.closest('[data-hero-no-effect="true"]'));
    }

    function handlePointerEnter(event: PointerEvent) {
      updatePointer(event);

      targetOpacity = isBlocked(event) ? 0 : 0.62;

      startAnimation();
    }

    function handlePointerMove(event: PointerEvent) {
      updatePointer(event);

      targetOpacity = isBlocked(event) ? 0 : 0.62;

      startAnimation();
    }

    function handlePointerLeave() {
      targetOpacity = 0;

      startAnimation();
    }

    function handleWindowBlur() {
      targetOpacity = 0;

      startAnimation();
    }

    heroElement.addEventListener("pointerenter", handlePointerEnter, {
      passive: true,
    });

    heroElement.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    heroElement.addEventListener("pointerleave", handlePointerLeave);

    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.cancelAnimationFrame(frameId);

      heroElement.removeEventListener("pointerenter", handlePointerEnter);

      heroElement.removeEventListener("pointermove", handlePointerMove);

      heroElement.removeEventListener("pointerleave", handlePointerLeave);

      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [reduceMotion]);

  const dotMask = `radial-gradient(
    circle at ${HERO_DOT_OFFSET}px ${HERO_DOT_OFFSET}px,
    #000 0,
    #000 ${HERO_DOT_RADIUS}px,
    transparent ${HERO_DOT_RADIUS + 0.4}px
  )`;

  const variables = {
    "--hero-dot-x": "68%",

    "--hero-dot-y": "42%",

    "--hero-dot-opacity": "0",
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={variables}
    >
      {/* BASE DOTS */}

      <div
        className="absolute inset-0 opacity-[0.11] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(
            circle at ${HERO_DOT_OFFSET}px ${HERO_DOT_OFFSET}px,

            color-mix(
              in srgb,
              var(--muted-foreground) 38%,
              transparent
            ) 0,

            color-mix(
              in srgb,
              var(--muted-foreground) 38%,
              transparent
            ) ${HERO_DOT_RADIUS}px,

            transparent ${HERO_DOT_RADIUS + 0.4}px
          )`,

          backgroundSize: `${HERO_DOT_SPACING}px ${HERO_DOT_SPACING}px`,

          maskImage:
            "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",

          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
        }}
      />

      {/* LIGHT INTERACTION */}

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          opacity: "var(--hero-dot-opacity)",

          backgroundImage: `radial-gradient(
            circle 340px at var(--hero-dot-x) var(--hero-dot-y),

            color-mix(
              in srgb,
              var(--brand-red) 48%,
              var(--brand-amber)
            ) 0%,

            color-mix(
              in srgb,
              var(--brand-amber) 80%,
              var(--brand-red)
            ) 17%,

            color-mix(
              in srgb,
              var(--brand-amber) 72%,
              transparent
            ) 36%,

            color-mix(
              in srgb,
              var(--brand-secondary-highlight) 48%,
              var(--brand-amber)
            ) 60%,

            color-mix(
              in srgb,
              var(--brand-secondary-highlight) 70%,
              transparent
            ) 79%,

            transparent 100%
          )`,

          maskImage: dotMask,

          WebkitMaskImage: dotMask,

          maskSize: `${HERO_DOT_SPACING}px ${HERO_DOT_SPACING}px`,

          WebkitMaskSize: `${HERO_DOT_SPACING}px ${HERO_DOT_SPACING}px`,

          maskRepeat: "repeat",

          WebkitMaskRepeat: "repeat",
        }}
      />

      {/* DARK INTERACTION */}

      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          opacity: "var(--hero-dot-opacity)",

          backgroundImage: `radial-gradient(
            circle 345px at var(--hero-dot-x) var(--hero-dot-y),

            color-mix(
              in srgb,
              var(--brand-red) 43%,
              var(--brand-amber)
            ) 0%,

            color-mix(
              in srgb,
              var(--brand-amber) 76%,
              transparent
            ) 20%,

            color-mix(
              in srgb,
              var(--secondary) 40%,
              var(--brand-amber)
            ) 53%,

            color-mix(
              in srgb,
              var(--secondary) 68%,
              transparent
            ) 76%,

            transparent 100%
          )`,

          maskImage: dotMask,

          WebkitMaskImage: dotMask,

          maskSize: `${HERO_DOT_SPACING}px ${HERO_DOT_SPACING}px`,

          WebkitMaskSize: `${HERO_DOT_SPACING}px ${HERO_DOT_SPACING}px`,

          maskRepeat: "repeat",

          WebkitMaskRepeat: "repeat",
        }}
      />

      {/* SOFT ATMOSPHERE */}

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          opacity: "var(--hero-dot-opacity)",

          backgroundImage: `radial-gradient(
            circle 220px at var(--hero-dot-x) var(--hero-dot-y),

            color-mix(
              in srgb,
              var(--brand-amber) 2.5%,
              transparent
            ) 0%,

            color-mix(
              in srgb,
              var(--brand-secondary-highlight) 1.2%,
              transparent
            ) 68%,

            transparent 100%
          )`,
        }}
      />

      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          opacity: "var(--hero-dot-opacity)",

          backgroundImage: `radial-gradient(
            circle 225px at var(--hero-dot-x) var(--hero-dot-y),

            color-mix(
              in srgb,
              var(--brand-amber) 2.5%,
              transparent
            ) 0%,

            color-mix(
              in srgb,
              var(--secondary) 1.2%,
              transparent
            ) 68%,

            transparent 100%
          )`,
        }}
      />

      <PawPrintIcon
        className={[
          "absolute -right-10 bottom-[8%]",

          "hidden h-40 w-40 -rotate-12",

          "text-foreground/[0.009]",

          "lg:block",
        ].join(" ")}
      />
    </div>
  );
}

/* =========================================================
   HERO MATCH COMPOSER
========================================================= */

function HeroMatchComposer() {
  const reduceMotion = useReducedMotion();

  const [scenarioIndex, setScenarioIndex] = useState(0);

  const [typingPhase, setTypingPhase] = useState<TypingPhase>(
    reduceMotion ? "holding" : "typing",
  );

  const [capabilitiesReady, setCapabilitiesReady] = useState(
    Boolean(reduceMotion),
  );

  const [matchReady, setMatchReady] = useState(Boolean(reduceMotion));

  const [actionReady, setActionReady] = useState(Boolean(reduceMotion));

  const scenario = heroScenarios[scenarioIndex];

  const handleTypingPhase = useCallback((phase: TypingPhase) => {
    setTypingPhase(phase);
  }, []);

  const handleScenarioCycle = useCallback(() => {
    setScenarioIndex((current) => (current + 1) % heroScenarios.length);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setCapabilitiesReady(true);

      setMatchReady(true);

      setActionReady(true);

      return;
    }

    if (typingPhase !== "holding") {
      setCapabilitiesReady(false);

      setMatchReady(false);

      setActionReady(false);

      return;
    }

    const capabilityTimer = window.setTimeout(() => {
      setCapabilitiesReady(true);
    }, 100);

    const matchTimer = window.setTimeout(() => {
      setMatchReady(true);
    }, 500);

    const actionTimer = window.setTimeout(() => {
      setActionReady(true);
    }, 850);

    return () => {
      window.clearTimeout(capabilityTimer);

      window.clearTimeout(matchTimer);

      window.clearTimeout(actionTimer);
    };
  }, [typingPhase, reduceMotion]);

  return (
    <motion.div
      data-hero-no-effect="true"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
              scale: 0.985,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay: 0.12,
        duration: 0.65,
        ease: "easeOut",
      }}
      className="relative mx-auto w-full max-w-[650px]"
    >
      <div
        aria-hidden
        className={[
          "absolute inset-x-[5%] -bottom-5 top-5 hidden",

          "rounded-[1.8rem] border",

          "border-primary/10",

          "bg-primary/[0.045]",

          "sm:block",

          "dark:border-border/30",

          "dark:bg-surface-2/15",
        ].join(" ")}
      />

      <PawTrail className="absolute -right-1 -top-9 hidden md:flex" />

      <div
        className={[
          "relative overflow-hidden rounded-[1.15rem] border p-4",

          "sm:rounded-[1.35rem]",

          "sm:p-6",

          heroDemoSurface,
        ].join(" ")}
      >
        <HeroDemoGrid />

        <div className="relative z-10">
          {/* HEADER */}

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",

                  "bg-white/[0.09]",

                  "ring-1 ring-inset ring-white/[0.10]",

                  "dark:bg-secondary/[0.065]",

                  "dark:ring-secondary/10",
                ].join(" ")}
              >
                <img
                  src={assets.allocatrIcon}
                  alt=""
                  className="h-4 w-4 object-contain"
                />
              </span>

              <div className="min-w-0">
                <p
                  className={[
                    "text-[0.44rem] font-semibold uppercase tracking-[0.15em]",

                    "sm:text-[0.46rem]",

                    heroDemoMuted,
                  ].join(" ")}
                >
                  Start a project
                </p>

                <p
                  className={[
                    "mt-1 truncate text-xs font-semibold",

                    "sm:text-sm",

                    heroDemoStrong,
                  ].join(" ")}
                >
                  What needs to be done?
                </p>
              </div>
            </div>

            <div aria-hidden className="hidden items-center gap-2 sm:flex">
              {heroScenarios.map((item, index) => (
                <span
                  key={item.id}
                  className={[
                    "h-1.5 rounded-full",

                    "transition-[width,background-color,opacity] duration-300",

                    index === scenarioIndex
                      ? ["w-4", "bg-brand-primary", "dark:bg-secondary"].join(
                          " ",
                        )
                      : [
                          "w-1.5",

                          "bg-white/20",

                          "dark:bg-muted-foreground/25",
                        ].join(" "),
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          {/* BRIEF */}

          <div
            className={[
              "mt-4 rounded-xl border p-3.5",

              "sm:mt-5",

              "sm:p-4",

              heroDemoInnerSurface,
            ].join(" ")}
          >
            <HeroTypingLine
              key={scenario.id}
              text={scenario.brief}
              meta={scenario.meta}
              reduceMotion={reduceMotion}
              onPhaseChange={handleTypingPhase}
              onCycle={handleScenarioCycle}
            />
          </div>

          {/* CAPABILITIES */}

          <div className="mt-4 sm:mt-5">
            <div className="flex items-center gap-3">
              <p
                className={[
                  "text-[0.42rem] font-semibold uppercase tracking-[0.14em]",

                  "sm:text-[0.44rem]",

                  heroDemoMuted,
                ].join(" ")}
              >
                Suggested capability
              </p>

              <span className="h-px flex-1 bg-white/[0.12] dark:bg-border/70" />

              <motion.span
                animate={{
                  opacity: capabilitiesReady ? 1 : 0.25,
                }}
                transition={{
                  duration: 0.3,
                }}
                className={[
                  "hidden text-[0.45rem] font-semibold sm:block",

                  heroDemoMuted,
                ].join(" ")}
              >
                {String(scenario.capabilities.length).padStart(2, "0")}
              </motion.span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {scenario.capabilities.map((capability, index) => (
                <ComposerCapability
                  key={`${scenario.id}-${capability.label}`}
                  icon={capability.icon}
                  label={capability.label}
                  tone={capability.tone}
                  visible={capabilitiesReady}
                  delay={index * 0.08}
                  className={index === 2 ? "hidden sm:inline-flex" : ""}
                />
              ))}
            </div>
          </div>

          {/* MATCH */}

          <motion.div
            animate={{
              opacity: matchReady ? 1 : 0.3,

              y: matchReady ? 0 : 8,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className={[
              "mt-5 border-t pt-4",

              "sm:mt-6",

              "sm:pt-5",

              heroDemoDivider,
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className={[
                    "text-[0.42rem] font-semibold uppercase tracking-[0.14em]",

                    "sm:text-[0.44rem]",

                    heroDemoMuted,
                  ].join(" ")}
                >
                  Recommended fit
                </p>

                <motion.p
                  key={`${scenario.id}-category`}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 3,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={[
                    "mt-1 text-xs font-semibold",

                    heroDemoStrong,
                  ].join(" ")}
                >
                  {scenario.category}
                </motion.p>
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <span className="text-[0.46rem] font-semibold text-brand-primary dark:text-status-complete-foreground">
                  {scenario.matchCount} matches
                </span>

                <motion.span
                  animate={{
                    opacity: matchReady ? 1 : 0,

                    scale: matchReady ? 1 : 0.94,
                  }}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5",

                    "border-white/[0.12]",

                    "bg-white/[0.07]",

                    "text-[0.44rem] font-semibold text-white/70",

                    "dark:border-border/55",

                    "dark:bg-surface-2/45",

                    "dark:text-foreground/60",
                  ].join(" ")}
                >
                  <PawPrintIcon
                    size={9}
                    className="text-brand-primary dark:text-secondary"
                  />
                  Good fit
                </motion.span>
              </div>
            </div>

            <motion.div
              key={`${scenario.id}-match`}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 5,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.28,
              }}
              className={[
                "mt-3 flex items-center gap-3 rounded-xl border p-3",

                "sm:p-3.5",

                heroDemoChipSurface,

                matchReady
                  ? "border-white/[0.19] dark:border-secondary/10"
                  : "",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",

                  "bg-white/[0.10]",

                  "text-[0.46rem] font-semibold text-white/75",

                  "sm:h-10",

                  "sm:w-10",

                  "sm:text-[0.48rem]",

                  "dark:bg-surface-2",

                  "dark:text-foreground/60",
                ].join(" ")}
              >
                {scenario.initials}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "truncate text-xs font-semibold",

                    heroDemoStrong,
                  ].join(" ")}
                >
                  {scenario.matchName}
                </p>

                <p
                  className={[
                    "mt-0.5 truncate text-[0.48rem]",

                    heroDemoMuted,
                  ].join(" ")}
                >
                  {scenario.role}

                  <span className="hidden sm:inline">
                    {" "}
                    · {scenario.matchMeta}
                  </span>
                </p>
              </div>

              <motion.span
                animate={{
                  opacity: matchReady ? 1 : 0,

                  scale: matchReady ? 1 : 0.78,
                }}
                transition={{
                  type: "spring",

                  stiffness: 260,

                  damping: 20,
                }}
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",

                  "bg-brand-primary",

                  "text-secondary-foreground",

                  "dark:bg-secondary",

                  "dark:text-secondary-foreground",
                ].join(" ")}
              >
                <CheckCircle2Icon size={11} />
              </motion.span>
            </motion.div>
          </motion.div>

          {/* ACTION */}

          <motion.div
            animate={{
              opacity: actionReady ? 1 : 0.4,

              y: actionReady ? 0 : 4,
            }}
            transition={{
              duration: 0.35,

              ease: "easeOut",
            }}
            className="mt-4 flex items-center justify-end gap-4 sm:justify-between"
          >
            <div className="hidden items-center gap-2 sm:flex">
              <motion.span
                animate={{
                  scale: actionReady ? [1, 1.35, 1] : 1,
                }}
                transition={{
                  duration: 0.55,
                }}
                className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-status-complete"
              />

              <span className={["text-[0.47rem]", heroDemoMuted].join(" ")}>
                {actionReady ? "Ready to allocate" : "Preparing match"}
              </span>
            </div>

            <motion.div
              animate={{
                opacity: actionReady ? 1 : 0.62,
              }}
              transition={{
                duration: 0.3,
              }}
              className={[
                "flex h-9 w-full items-center justify-center gap-2 rounded-lg border px-4",

                "text-[0.52rem] font-semibold",

                "transition-[background-color,border-color,color,opacity] duration-300",

                "sm:w-auto",

                actionReady
                  ? [
                      "border-brand-primary/15",

                      "bg-brand-primary",

                      "text-secondary-foreground",

                      "dark:border-secondary/10",

                      "dark:bg-secondary",

                      "dark:text-secondary-foreground",
                    ].join(" ")
                  : [
                      "border-white/[0.11]",

                      "bg-white/[0.07]",

                      "text-white/45",

                      "dark:border-border/55",

                      "dark:bg-surface-2/55",

                      "dark:text-muted-foreground",
                    ].join(" "),
              ].join(" ")}
            >
              Allocate
              <ArrowRightIcon size={11} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   HERO TYPING
========================================================= */

function HeroTypingLine({
  text,
  meta,
  reduceMotion,
  onPhaseChange,
  onCycle,
}: {
  text: string;
  meta: string;
  reduceMotion: boolean | null;
  onPhaseChange: (phase: TypingPhase) => void;
  onCycle: () => void;
}) {
  const [characterCount, setCharacterCount] = useState(
    reduceMotion ? text.length : 0,
  );

  const [phase, setPhase] = useState<TypingPhase>(
    reduceMotion ? "holding" : "typing",
  );

  useEffect(() => {
    if (reduceMotion) {
      onPhaseChange("holding");

      return;
    }

    onPhaseChange("typing");
  }, [reduceMotion, onPhaseChange]);

  useEffect(() => {
    if (reduceMotion) {
      setCharacterCount(text.length);

      setPhase("holding");

      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (phase === "typing") {
      if (characterCount < text.length) {
        const nextCharacter = text[characterCount];

        let delay = 34;

        if (nextCharacter === " ") {
          delay = 19;
        }

        if (nextCharacter === "," || nextCharacter === ".") {
          delay = 105;
        }

        timeoutId = setTimeout(() => {
          setCharacterCount((current) => Math.min(current + 1, text.length));
        }, delay);
      } else {
        timeoutId = setTimeout(() => {
          setPhase("holding");

          onPhaseChange("holding");
        }, 150);
      }
    }

    if (phase === "holding") {
      timeoutId = setTimeout(() => {
        setPhase("clearing");

        onPhaseChange("clearing");
      }, 3600);
    }

    if (phase === "clearing") {
      timeoutId = setTimeout(() => {
        onCycle();
      }, 480);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [characterCount, phase, reduceMotion, text, onPhaseChange, onCycle]);

  const visibleText = reduceMotion ? text : text.slice(0, characterCount);

  const complete = reduceMotion || phase === "holding";

  return (
    <>
      <div className="flex min-h-[96px] items-start gap-3 sm:min-h-[76px]">
        <FileTextIcon
          size={14}
          className="mt-1 shrink-0 text-white/45 dark:text-muted-foreground"
        />

        <div className="min-w-0 flex-1">
          <motion.p
            animate={{
              opacity: phase === "clearing" ? 0 : 1,

              y: phase === "clearing" ? -2 : 0,
            }}
            transition={{
              duration: 0.3,

              ease: "easeOut",
            }}
            className="max-w-md text-xs leading-6 text-white/80 dark:text-foreground/80"
          >
            {visibleText}

            {!reduceMotion && phase === "typing" && (
              <motion.span
                aria-hidden
                animate={{
                  opacity: [1, 0.18, 1],
                }}
                transition={{
                  duration: 0.8,

                  repeat: Infinity,

                  ease: "easeInOut",
                }}
                className="ml-0.5 inline-block h-[0.9rem] w-px translate-y-[2px] bg-brand-primary dark:bg-secondary"
              />
            )}
          </motion.p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/[0.10] pt-3 dark:border-border/50 sm:mt-4">
        <motion.span
          key={meta}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                }
          }
          animate={{
            opacity: 1,
          }}
          className="hidden text-[0.47rem] text-white/45 dark:text-muted-foreground sm:inline"
        >
          {meta}
        </motion.span>

        <motion.span
          animate={{
            opacity: phase === "clearing" ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
          }}
          className={[
            "ml-auto text-[0.47rem] font-semibold",

            complete
              ? "text-brand-primary dark:text-status-complete-foreground"
              : "text-white/65 dark:text-secondary",
          ].join(" ")}
        >
          {complete ? "Brief understood" : "Writing brief"}
        </motion.span>
      </div>
    </>
  );
}

/* =========================================================
   HERO CAPABILITY
========================================================= */

function ComposerCapability({
  icon: Icon,
  label,
  tone,
  visible,
  delay,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  visible: boolean;
  delay: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      animate={
        reduceMotion
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : visible
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
              }
            : {
                opacity: 0.3,
                y: 5,
                scale: 0.98,
              }
      }
      transition={{
        delay: visible ? delay : 0,

        duration: 0.32,

        ease: "easeOut",
      }}
      className={[
        "inline-flex items-center gap-2 rounded-full border",

        "py-1.5 pl-1.5 pr-3",

        heroDemoChipSurface,

        className,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full",

          "bg-white/[0.09]",

          "text-white/75",

          "dark:bg-transparent",

          toneSurfaceDark(tone),
        ].join(" ")}
      >
        <Icon size={9} />
      </span>

      <span
        className={["text-[0.49rem] font-semibold", heroDemoSoft].join(" ")}
      >
        {label}
      </span>
    </motion.span>
  );
}

/* =========================================================
   HERO DEMO GRID
========================================================= */

function HeroDemoGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden opacity-[0.08] sm:block dark:opacity-[0.12]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(255 255 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.16) 1px, transparent 1px)",

        backgroundSize: "36px 36px",

        maskImage:
          "linear-gradient(to bottom right, black 0%, transparent 72%)",

        WebkitMaskImage:
          "linear-gradient(to bottom right, black 0%, transparent 72%)",
      }}
    />
  );
}

/* =========================================================
   STORY BAND
========================================================= */

function StoryBand() {
  return (
    <section id="landing-story" className="relative scroll-mt-16 bg-surface-1">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-y border-border/55 py-5 sm:grid-cols-4 sm:gap-0 sm:py-0">
          <StoryBandItem
            number="01"
            label="Brief"
            text="Start with what needs to happen."
          />

          <StoryBandItem
            number="02"
            label="Capability"
            text="Shape the skills the work requires."
          />

          <StoryBandItem
            number="03"
            label="People"
            text="Bring in the right fit."
          />

          <StoryBandItem
            number="04"
            label="Delivery"
            text="Keep execution connected."
            paw
          />
        </div>
      </div>
    </section>
  );
}

function StoryBandItem({
  number,
  label,
  text,
  paw = false,
}: {
  number: string;
  label: string;
  text: string;
  paw?: boolean;
}) {
  return (
    <div className="relative sm:border-r sm:border-border/55 sm:px-5 sm:py-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
      <div className="flex items-center gap-2">
        <span className="text-[0.44rem] font-semibold text-brand-secondary-highlight dark:text-secondary">
          {number}
        </span>

        <span className="text-[0.46rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground sm:text-[0.48rem] sm:tracking-[0.14em]">
          {label}
        </span>

        {paw && (
          <PawPrintIcon className="ml-auto hidden h-4 w-4 rotate-12 text-brand-secondary-highlight/25 sm:block dark:text-secondary/25" />
        )}
      </div>

      <p className="mt-2 hidden max-w-[15rem] text-xs leading-5 text-foreground/65 sm:block">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   CONNECTED WORK
========================================================= */

function ConnectedWorkSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <PawPrintIcon className="pointer-events-none absolute -left-16 top-[30%] hidden h-52 w-52 rotate-12 text-foreground/[0.012] lg:block" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <Eyebrow>From brief to delivery</Eyebrow>
            </div>

            <div>
              <h2
                className={[
                  "max-w-[15ch]",

                  "text-[2.35rem] font-semibold leading-[0.97] tracking-[-0.043em]",

                  "text-foreground/95",

                  "sm:text-5xl",

                  "lg:text-[3.9rem]",
                ].join(" ")}
              >
                One project.
                <span className="block text-brand-secondary-highlight dark:text-secondary">
                  One connected flow of work.
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                Allocatr keeps the brief, capabilities, people and delivery
                attached to the same piece of work. The same structure works
                whether you&apos;re engaging one specialist or coordinating
                several disciplines across a broader project.
              </p>
            </div>
          </div>
        </Reveal>

        <div
          className={[
            "relative mt-10 overflow-hidden rounded-[1.35rem] border",

            "border-border/55",

            "bg-card/70",

            "sm:mt-16",

            "sm:rounded-[2rem]",

            "lg:mt-20",

            "dark:bg-card",
          ].join(" ")}
        >
          <PawTrail className="absolute right-8 top-8 hidden opacity-80 lg:flex" />

          <div className="px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
            <OperatingModelFlow />
          </div>

          <div className="border-t border-border/55 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
            <TealInsightCard
              icon={Layers3Icon}
              label="One shared structure"
              title="Different capabilities. One accountable project."
              text="Professional services, specialists, contractors and delivery teams can stay distinct while ownership, progress and project context remain connected."
              accent="lime"
              action={
                <Link
                  to="/how-it-works"
                  className={["h-10 px-4 text-xs", tealCardButton].join(" ")}
                >
                  See how it works
                  <ArrowRightIcon size={13} />
                </Link>
              }
              horizontal
            />
          </div>

          <div className="border-t border-border/55 px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <Reveal>
              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
                <div>
                  <p className="text-[0.46rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.5rem] sm:tracking-[0.17em]">
                    Assemble around the work
                  </p>

                  <h3
                    className={[
                      "mt-3 max-w-[13ch]",

                      "text-[1.9rem] font-semibold leading-[0.99] tracking-[-0.04em]",

                      "text-foreground/95",

                      "sm:mt-4",

                      "sm:text-4xl",

                      "lg:text-5xl",
                    ].join(" ")}
                  >
                    Different expertise.
                    <span className="block">
                      One <HeadlineAccent>shared outcome.</HeadlineAccent>
                    </span>
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
                  Work can require very different kinds of capability. Advisory,
                  creative, technical and delivery specialists remain distinct
                  while their contribution stays connected to the same outcome.
                </p>
              </div>
            </Reveal>

            <CapabilityPhotoGrid />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   OPERATING MODEL
========================================================= */

function OperatingModelFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[58px] hidden h-px bg-border lg:block"
      />

      {!reduceMotion && (
        <motion.span
          aria-hidden
          animate={{
            left: ["12.5%", "37.5%", "62.5%", "87.5%"],
          }}
          transition={{
            duration: 7,

            repeat: Infinity,

            ease: "easeInOut",

            times: [0, 0.33, 0.66, 1],
          }}
          className={[
            "pointer-events-none absolute top-[54px] z-20 hidden",

            "h-2 w-2 -translate-x-1/2 rounded-full",

            "bg-brand-secondary-highlight",

            "ring-4 ring-card",

            "lg:block",

            "dark:bg-secondary",
          ].join(" ")}
        />
      )}

      <div className="grid grid-cols-2 gap-x-4 lg:grid-cols-4 lg:gap-0">
        {operatingStages.map((stage, index) => (
          <OperatingStage key={stage.number} stage={stage} index={index} />
        ))}
      </div>
    </div>
  );
}

function OperatingStage({
  stage,
  index,
}: {
  stage: (typeof operatingStages)[number];
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  const Icon = stage.icon;

  const mobilePosition =
    index % 2 === 0 ? "border-r border-border/55 pr-3" : "pl-3";

  const mobileRow = index < 2 ? "border-b border-border/55" : "";

  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 16,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.35,
      }}
      transition={{
        delay: index * 0.08,

        duration: 0.42,

        ease: "easeOut",
      }}
      className={[
        "relative py-5",

        mobilePosition,

        mobileRow,

        "lg:border-b-0",

        "lg:border-r",

        "lg:border-border/55",

        "lg:px-6",

        "lg:py-0",

        "lg:first:pl-0",

        "lg:last:border-r-0",

        "lg:last:pr-0",
      ].join(" ")}
    >
      <div className="relative z-30 flex items-center justify-between">
        <span
          className={[
            "flex h-9 w-9 items-center justify-center rounded-lg",

            "sm:h-10",

            "sm:w-10",

            toneSurface(stage.tone),
          ].join(" ")}
        >
          <Icon size={14} />
        </span>

        <span className="text-[0.44rem] font-semibold tracking-[0.12em] text-brand-secondary-highlight sm:text-[0.46rem] sm:tracking-[0.14em] dark:text-secondary">
          {stage.number}
        </span>
      </div>

      <div className="hidden h-9 lg:block" />

      <p className="mt-4 text-[0.43rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:mt-5 sm:text-[0.46rem] sm:tracking-[0.14em] lg:mt-0">
        {stage.label}
      </p>

      <p className="mt-1.5 text-xs font-semibold text-foreground sm:mt-2 sm:text-sm">
        {stage.title}
      </p>

      <p className="mt-2 hidden max-w-xs text-xs leading-6 text-muted-foreground sm:block">
        {stage.description}
      </p>
    </motion.article>
  );
}

/* =========================================================
   CAPABILITY GRID
========================================================= */

function CapabilityPhotoGrid() {
  return (
    <div className="relative mt-9 sm:mt-16">
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-4 sm:gap-4">
        {capabilityCards.map((item, index) => (
          <CapabilityPhotoCard key={item.label} item={item} index={index} />
        ))}
      </div>

      <div className="relative mx-auto mt-8 max-w-4xl sm:mt-11">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />

        <div
          className={[
            "relative mx-auto flex w-fit items-center gap-2.5 rounded-full border",

            "border-border/60",

            "bg-card",

            "px-3.5 py-2",

            "sm:gap-3",

            "sm:px-4",

            "sm:py-2.5",

            "dark:bg-card",
          ].join(" ")}
        >
          <Layers3Icon
            size={12}
            className="text-brand-secondary-highlight dark:text-secondary sm:size-[13px]"
          />

          <span className="text-[0.52rem] font-semibold text-foreground/75 sm:text-[0.57rem]">
            One shared project
          </span>
        </div>
      </div>
    </div>
  );
}

function CapabilityPhotoCard({
  item,
  index,
}: {
  item: (typeof capabilityCards)[number];
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  const Icon = item.icon;

  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
              scale: 0.985,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.18,
      }}
      transition={{
        delay: index * 0.08,

        duration: 0.48,

        ease: "easeOut",
      }}
      className={["group relative", item.offset].join(" ")}
    >
      <div
        className={[
          "relative aspect-[3/4] overflow-hidden",

          "border border-border/55",

          "bg-surface-2",

          imageShapeClass(item.shape),
        ].join(" ")}
      >
        <img
          src={item.image}
          alt={`${item.label} work in progress`}
          loading="lazy"
          decoding="async"
          className={[
            "h-full w-full object-cover",

            "saturate-[0.76]",

            "transition-[transform,filter] duration-500",

            "group-hover:scale-[1.012]",

            "group-hover:saturate-[0.88]",

            "dark:brightness-[0.65]",

            "dark:saturate-[0.55]",
          ].join(" ")}
        />

        <ImageShade />

        <span
          className={[
            "absolute bottom-3 left-3 z-20",

            "flex h-8 w-8 items-center justify-center rounded-lg",

            "sm:bottom-4",

            "sm:left-4",

            "sm:h-9",

            "sm:w-9",

            toneSurface(item.tone),

            "backdrop-blur-md",
          ].join(" ")}
        >
          <Icon size={13} />
        </span>

        {index === 1 && (
          <PawPrintIcon className="absolute right-4 top-4 z-20 hidden h-5 w-5 rotate-12 text-white/65 sm:block" />
        )}
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="hidden text-[0.46rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
          Capability
        </p>

        <p className="text-xs font-semibold text-foreground sm:mt-1.5 sm:text-sm">
          {item.label}
        </p>

        <p className="mt-1 hidden text-[0.55rem] leading-5 text-muted-foreground sm:block">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}

/* =========================================================
   DISCOVERY
========================================================= */

function DiscoverySection() {
  return (
    <section className="relative pb-8 sm:pb-14 lg:pb-16">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div
          className={[
            "relative overflow-hidden rounded-[1.35rem] border",

            "border-border/55",

            "bg-background",

            "px-4 py-8",

            "sm:rounded-[2rem]",

            "sm:px-8",

            "sm:py-12",

            "lg:px-10",

            "lg:py-14",
          ].join(" ")}
        >
          <PawPrintIcon className="pointer-events-none absolute -right-10 -top-12 hidden h-40 w-40 rotate-12 text-foreground/[0.012] sm:block" />

          <div className="relative grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-20">
            <Reveal direction="left" className="order-2 lg:order-1">
              <DiscoverySystem />
            </Reveal>

            <Reveal direction="right" className="order-1 lg:order-2">
              <div>
                <Eyebrow>Discover what fits</Eyebrow>

                <SectionTitle>
                  Search by the work.
                  <span className="block">
                    Follow the <HeadlineAccent>capability.</HeadlineAccent>
                  </span>
                </SectionTitle>

                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                  From specialist trades to professional services, search by
                  skill, profession or category and shape the team around the
                  outcome you need.
                </p>

                <TealInsightCard
                  icon={SearchIcon}
                  label="Start with the need"
                  title="You do not need to know the exact profession first."
                  text="Describe the problem or outcome. Allocatr helps surface the skills and professional capabilities that make sense around it."
                  accent="amber"
                  className="mt-7"
                  compact
                  action={
                    <Link
                      to="/discover"
                      className={["h-10 px-4 text-xs", tealCardButton].join(
                        " ",
                      )}
                    >
                      Explore Allocats
                      <ArrowRightIcon size={13} />
                    </Link>
                  }
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DISCOVERY SYSTEM
========================================================= */

function DiscoverySystem() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div
        className={[
          "relative overflow-hidden rounded-[1.15rem] border p-4",

          "sm:rounded-[1.35rem]",

          "sm:p-6",

          paperSurface,
        ].join(" ")}
      >
        <InterfaceGrid />

        <div className="relative z-10">
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 8,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.42,
            }}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3.5 py-3 dark:bg-background/35 sm:px-4 sm:py-3.5"
          >
            <SearchIcon
              size={14}
              className="shrink-0 text-muted-foreground sm:size-[15px]"
            />

            <span className="min-w-0 truncate text-xs text-foreground/80">
              regional brand launch
            </span>

            {!reduceMotion && (
              <motion.span
                animate={{
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1,

                  repeat: Infinity,
                }}
                className="h-4 w-px shrink-0 bg-brand-secondary-highlight dark:bg-secondary"
              />
            )}

            <span className="ml-auto hidden shrink-0 text-[0.48rem] font-medium text-muted-foreground sm:block">
              40 matches
            </span>
          </motion.div>

          <div className="mt-4 flex items-center gap-3 sm:mt-5">
            <span className="text-[0.42rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.44rem] sm:tracking-[0.14em]">
              Related capability
            </span>

            <span className="h-px flex-1 bg-border" />

            <span className="hidden text-[0.46rem] font-semibold text-brand-secondary-highlight sm:block dark:text-secondary">
              04 groups
            </span>
          </div>

          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2">
            {discoveryGroups.map((group, index) => (
              <DiscoveryGroup
                key={group.title}
                group={group}
                index={index}
                className={index >= 2 ? "hidden sm:block" : ""}
              />
            ))}
          </div>

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                  }
            }
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,

              duration: 0.4,
            }}
            className="mt-4 flex items-center justify-end border-t border-border/55 pt-4 sm:mt-5 sm:justify-between"
          >
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-status-complete" />

              <span className="text-[0.49rem] text-muted-foreground">
                Results refine as you search
              </span>
            </div>

            <span className="text-[0.49rem] font-semibold text-brand-secondary-highlight dark:text-secondary">
              40 matching profiles
            </span>
          </motion.div>
        </div>
      </div>

      <div
        className={[
          "absolute -bottom-5 right-[8%] hidden",

          "h-10 w-10 items-center justify-center rounded-full",

          "border border-border/55",

          "bg-background",

          "text-brand-secondary-highlight",

          "sm:flex",

          "dark:text-secondary",
        ].join(" ")}
      >
        <PawPrintIcon size={15} />
      </div>
    </div>
  );
}

function DiscoveryGroup({
  group,
  index,
  className = "",
}: {
  group: (typeof discoveryGroups)[number];
  index: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const Icon = group.icon;

  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 12,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.4,
      }}
      transition={{
        delay: 0.08 + index * 0.08,

        duration: 0.4,
      }}
      className={[
        "rounded-xl border p-3.5 sm:p-4",

        "border-border/50",

        "bg-surface-2/30",

        "dark:bg-surface-2/55",

        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

            toneSurface(group.tone),
          ].join(" ")}
        >
          <Icon size={12} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground">{group.title}</p>

          <p className="mt-0.5 text-[0.47rem] text-muted-foreground">
            {group.count} matching Allocats
          </p>
        </div>

        <span className="hidden text-lg font-semibold tracking-[-0.04em] text-foreground/20 sm:block">
          {String(group.count).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-border/50 bg-background/40 px-2 py-1 text-[0.43rem] font-medium text-muted-foreground dark:bg-background/20"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

/* =========================================================
   WORKSPACE
========================================================= */

function WorkspaceSection({ postProjectHref }: { postProjectHref: string }) {
  return (
    <section className="relative py-8 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div
          className={[
            "relative overflow-hidden rounded-[1.35rem] border",

            "border-border/55",

            "bg-card",

            "px-4 py-8",

            "sm:rounded-[2rem]",

            "sm:px-8",

            "sm:py-12",

            "lg:px-10",

            "lg:py-14",
          ].join(" ")}
        >
          <PawTrail className="absolute bottom-8 left-8 hidden opacity-65 lg:flex" />

          <div className="grid gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
            <Reveal direction="left">
              <div>
                <Eyebrow>When work starts</Eyebrow>

                <h2
                  className={[
                    "mt-4 max-w-[10ch]",

                    "text-[2.25rem] font-semibold leading-[0.97] tracking-[-0.042em]",

                    "text-foreground/95",

                    "sm:mt-5",

                    "sm:text-5xl",

                    "lg:text-[3.7rem]",
                  ].join(" ")}
                >
                  One place for the work to move.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                  From a focused professional engagement to a multi-site
                  rollout, everyone can work from the same view of ownership,
                  progress and what needs attention next.
                </p>

                <div className="mt-6 space-y-3 sm:mt-8">
                  <WorkspaceBenefit
                    icon={CircleCheckBigIcon}
                    title="Shared progress"
                    text="Everyone sees where the work stands."
                  />

                  <WorkspaceBenefit
                    icon={UsersIcon}
                    title="Clear ownership"
                    text="Tasks stay connected to the people responsible."
                  />

                  <WorkspaceBenefit
                    icon={FileCheck2Icon}
                    title="Useful project history"
                    text="Decisions and outcomes remain attached to the work."
                    className="hidden sm:flex"
                  />
                </div>

                <SectionAction>
                  <Link
                    to={postProjectHref}
                    className={["h-10 px-4 text-xs", secondaryButton].join(" ")}
                  >
                    Post a project
                    <ArrowRightIcon size={13} />
                  </Link>
                </SectionAction>
              </div>
            </Reveal>

            <Reveal direction="right">
              <WorkspaceComposition />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkspaceBenefit({
  icon: Icon,
  title,
  text,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={["flex items-start gap-3", className].join(" ")}>
      <span
        className={[
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

          neutralIconSurface,
        ].join(" ")}
      >
        <Icon size={12} />
      </span>

      <div>
        <p className="text-xs font-semibold text-foreground">{title}</p>

        <p className="mt-1 text-[0.55rem] leading-5 text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   WORKSPACE COMPOSITION
========================================================= */

function WorkspaceComposition() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[760px] lg:min-h-[540px]">
      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                x: 18,
              }
        }
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
        }}
        className={[
          "absolute right-[2%] top-[2%] hidden",

          "h-[270px] w-[180px] overflow-hidden",

          "rounded-t-[5rem] rounded-b-[1.2rem]",

          "border-[5px] border-card",

          "ring-1 ring-border/55",

          "lg:block",
        ].join(" ")}
      >
        <img
          src={landingImages.commercial}
          alt="Commercial project work in progress"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover saturate-[0.72] dark:brightness-[0.63]"
        />
      </motion.div>

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 22,
                scale: 0.99,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.58,
          ease: "easeOut",
        }}
        className={[
          "relative z-20 overflow-hidden rounded-[1.1rem] border",

          paperSurface,

          "lg:absolute",

          "lg:bottom-[4%]",

          "lg:left-0",

          "lg:right-[9%]",

          "lg:rounded-[1.3rem]",
        ].join(" ")}
      >
        <WorkspaceHeader />

        <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1.12fr_0.88fr]">
          <WorkspaceMain />

          <div className="hidden md:block">
            <WorkspaceSide />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 12,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.16,

          duration: 0.45,
        }}
        className={[
          "absolute bottom-0 right-0 z-30 hidden",

          "h-[145px] w-[145px] overflow-hidden rounded-full",

          "border-[5px] border-card",

          "ring-1 ring-border/55",

          "lg:block",
        ].join(" ")}
      >
        <img
          src={landingImages.projectManagement}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover saturate-[0.76] dark:brightness-[0.65]"
        />
      </motion.div>

      <PawPrintIcon className="absolute left-[4%] top-[3%] hidden h-5 w-5 -rotate-12 text-brand-secondary-highlight/24 lg:block dark:text-secondary/24" />
    </div>
  );
}

/* =========================================================
   WORKSPACE HEADER
========================================================= */

function WorkspaceHeader() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/55 bg-surface-2/40 px-4 py-4 dark:bg-surface-2/65 sm:px-5 sm:py-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",

            accentIconSurface,
          ].join(" ")}
        >
          <Layers3Icon size={14} />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
              Regional branch rollout
            </p>

            <StatusLabel tone="active">Active</StatusLabel>
          </div>

          <p className="mt-1 hidden text-[0.52rem] text-muted-foreground sm:block">
            5 locations · AL-0241
          </p>
        </div>
      </div>

      <span
        className={[
          "hidden w-fit rounded-lg border px-3 py-2",

          "text-[0.53rem] font-semibold",

          "border-border/55",

          "bg-surface-2/55",

          "text-muted-foreground",

          "sm:inline-flex",

          "dark:border-border",

          "dark:bg-surface-2/70",
        ].join(" ")}
      >
        Project workspace
      </span>
    </div>
  );
}

/* =========================================================
   WORKSPACE MAIN
========================================================= */

function WorkspaceMain() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.44rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.46rem] sm:tracking-[0.14em]">
            Project progress
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            68
            <span className="ml-1 text-sm text-muted-foreground">%</span>
          </p>
        </div>

        <p className="hidden text-[0.52rem] text-muted-foreground sm:block">
          17 of 25 tasks complete
        </p>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-3 sm:mt-5">
        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: "68%",
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-brand-secondary-highlight dark:bg-secondary"
        />
      </div>

      <div className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2">
        <WorkspaceTask
          title="Approve site drawings"
          person="Nyasha M."
          status="Complete"
          tone="complete"
        />

        <WorkspaceTask
          title="Complete network cabling"
          person="Tinashe K."
          status="Active"
          tone="active"
        />

        <div className="hidden sm:block">
          <WorkspaceTask
            title="Install branch signage"
            person="Rudo L."
            status="Pending"
            tone="pending"
          />
        </div>

        <div className="hidden sm:block">
          <WorkspaceTask
            title="Compliance inspection"
            person="Project team"
            status="Overdue"
            tone="overdue"
          />
        </div>
      </div>
    </div>
  );
}

function WorkspaceTask({
  title,
  person,
  status,
  tone,
}: {
  title: string;
  person: string;
  status: string;
  tone: StatusTone;
}) {
  return (
    <article className={["rounded-lg border p-3.5", quietSurface].join(" ")}>
      <p className="text-[0.62rem] font-semibold text-foreground/80">{title}</p>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="truncate text-[0.47rem] text-muted-foreground">
          {person}
        </span>

        <StatusLabel tone={tone}>{status}</StatusLabel>
      </div>
    </article>
  );
}

/* =========================================================
   WORKSPACE SIDE
========================================================= */

function WorkspaceSide() {
  return (
    <div className="border-t border-border/55 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.46rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Project team
          </p>

          <p className="mt-1.5 text-sm font-semibold text-foreground">
            Assigned Allocats
          </p>
        </div>

        <span className="text-xl font-semibold text-status-active-foreground">
          03
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <WorkspaceMember
          initials="NM"
          name="Nyasha M."
          role="Project management"
        />

        <WorkspaceMember
          initials="TK"
          name="Tinashe K."
          role="Network & systems"
        />

        <WorkspaceMember initials="RL" name="Rudo L." role="Fit-out" />
      </div>

      <div className="mt-6 border-t border-border/55 pt-5">
        <div className="flex items-center gap-2 text-status-active-foreground">
          <FileCheck2Icon size={12} />

          <p className="text-[0.46rem] font-semibold uppercase tracking-[0.13em]">
            Next milestone
          </p>
        </div>

        <p className="mt-2 text-xs font-semibold text-foreground">
          Bulawayo site handover
        </p>

        <p className="mt-1 text-[0.52rem] text-muted-foreground">
          Due 24 October · Project team
        </p>
      </div>
    </div>
  );
}

function WorkspaceMember({
  initials,
  name,
  role,
}: {
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",

          "border border-border/60",

          "bg-surface-3",

          "text-[0.46rem] font-semibold text-foreground/60",

          "dark:bg-surface-2",
        ].join(" ")}
      >
        {initials}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.6rem] font-semibold text-foreground/80">
          {name}
        </p>

        <p className="mt-0.5 text-[0.47rem] text-muted-foreground">{role}</p>
      </div>

      <span className="h-1.5 w-1.5 rounded-full bg-status-complete" />
    </div>
  );
}

/* =========================================================
   PROOF
========================================================= */

function ProofSection({
  allocatHref,
  allocatLabel,
}: {
  allocatHref: string;
  allocatLabel: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-14 lg:pb-32 lg:pt-16">
      <PawPrintIcon className="pointer-events-none absolute -left-14 top-[20%] hidden h-48 w-48 rotate-12 text-foreground/[0.012] lg:block" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-20">
          <Reveal direction="left">
            <ProofComposition />
          </Reveal>

          <Reveal direction="right">
            <div>
              <Eyebrow>Work becomes proof</Eyebrow>

              <h2
                className={[
                  "mt-4 max-w-[13ch]",

                  "text-[2.25rem] font-semibold leading-[0.98] tracking-[-0.042em]",

                  "text-foreground/95",

                  "sm:mt-5",

                  "sm:text-5xl",

                  "lg:text-[3.7rem]",
                ].join(" ")}
              >
                Good work should make the next project easier.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                Completed work and client feedback build useful professional
                context around the capabilities someone has already delivered.
              </p>

              <div className="mt-7 grid grid-cols-3 border-y border-border/55 py-4 sm:mt-8 sm:py-5">
                <ProofStat label="Capability" value="Skills" />

                <ProofStat label="Evidence" value="Projects" />

                <ProofStat label="Signal" value="Feedback" />
              </div>

              <TealInsightCard
                icon={ShieldCheckIcon}
                label="Built from delivery"
                title="Reputation stays attached to real work."
                text="Completed projects, outcomes and feedback become useful context for the next client instead of disappearing when a project closes."
                accent="green"
                className="mt-7"
                compact
                action={
                  <Link
                    to={allocatHref}
                    className={["h-10 px-4 text-xs", tealCardButton].join(" ")}
                  >
                    {allocatLabel}

                    <ArrowRightIcon size={13} />
                  </Link>
                }
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PROOF COMPOSITION
========================================================= */

function ProofComposition() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto min-h-[420px] w-full max-w-[660px] sm:min-h-[590px]">
      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                scale: 0.98,
              }
        }
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.55,
        }}
        className={[
          "absolute left-0 top-0 h-[350px] w-full overflow-hidden",

          "rounded-[1.5rem_4rem_1.5rem_1.5rem]",

          "border border-border/55",

          "sm:left-[4%]",

          "sm:top-[4%]",

          "sm:h-[420px]",

          "sm:w-[66%]",

          "sm:rounded-[2rem_5rem_2rem_2rem]",
        ].join(" ")}
      >
        <img
          src={landingImages.projectTeam}
          alt="People working together on a project"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover saturate-[0.72] dark:brightness-[0.63] dark:saturate-[0.52]"
        />

        <ImageShade />
      </motion.div>

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                x: 14,
              }
        }
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.12,

          duration: 0.45,
        }}
        className={[
          "absolute bottom-0 left-4 right-4 z-30",

          "rounded-xl border p-4",

          paperSurface,

          "sm:bottom-auto",

          "sm:left-auto",

          "sm:right-[2%]",

          "sm:top-[7%]",

          "sm:w-[210px]",
        ].join(" ")}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-complete/[0.07] text-status-complete-foreground">
          <CircleCheckBigIcon size={14} />
        </span>

        <p className="mt-3 text-[0.46rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground sm:mt-4">
          Project complete
        </p>

        <p className="mt-1.5 text-sm font-semibold text-foreground">
          National signage rollout
        </p>

        <p className="mt-1 text-[0.5rem] text-muted-foreground">
          42 of 42 tasks complete
        </p>
      </motion.div>

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 15,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.2,

          duration: 0.45,
        }}
        className={[
          "absolute bottom-[3%] left-[10%] z-30 hidden",

          "w-[235px] -rotate-[2deg] rounded-xl border p-4",

          paperSurface,

          "sm:block",
        ].join(" ")}
      >
        <p className="text-[0.46rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
          Work record
        </p>

        <div className="mt-4 grid grid-cols-3">
          <MiniStat label="Projects" value="26" />

          <MiniStat label="Years" value="8" />

          <MiniStat label="Rating" value="4.9" />
        </div>
      </motion.div>

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 15,
              }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.28,

          duration: 0.45,
        }}
        className={[
          "absolute bottom-[10%] right-[2%] z-30 hidden",

          "w-[220px] rotate-[2deg] rounded-xl border p-4",

          paperSurface,

          "sm:block",
        ].join(" ")}
      >
        <div
          className="flex items-center gap-1"
          aria-label="Rated 4.9 out of 5"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <StarIcon
              key={value}
              aria-hidden
              size={14}
              className="fill-brand-amber text-brand-amber"
            />
          ))}
        </div>

        <p className="mt-4 text-xs font-semibold text-foreground">
          Professional and reliable.
        </p>

        <p className="mt-1.5 text-[0.54rem] leading-5 text-muted-foreground">
          Clear communication, strong coordination and delivery as agreed.
        </p>
      </motion.div>

      <div
        className={[
          "absolute bottom-[28%] left-[1%] hidden",

          "h-9 w-9 items-center justify-center rounded-full",

          "border border-border/55",

          "bg-surface-1",

          "text-brand-secondary-highlight",

          "sm:flex",

          "dark:text-secondary",
        ].join(" ")}
      >
        <PawPrintIcon size={14} />
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
    <section className="relative overflow-hidden bg-background py-12 sm:py-20 lg:py-24">
      <PawTrail className="absolute right-[7%] top-9 hidden opacity-70 lg:flex" />

      <PawPrintIcon className="pointer-events-none absolute -right-14 bottom-[-4rem] hidden h-56 w-56 -rotate-12 text-foreground/[0.012] lg:block" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <Reveal>
          <div className="grid gap-7 border-y border-border/55 py-9 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:py-14">
            <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-12">
              <Eyebrow>Start with the work</Eyebrow>

              <div>
                <h2
                  className={[
                    "max-w-[14ch]",

                    "text-[2.25rem] font-semibold leading-[0.97] tracking-[-0.045em]",

                    "text-foreground/95",

                    "sm:text-5xl",

                    "lg:text-[3.8rem]",
                  ].join(" ")}
                >
                  There&apos;s work to be done.{" "}
                  <span className="text-brand-secondary-highlight dark:text-secondary">
                    Allocate it properly.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:mt-5">
                  Define the outcome, find the capability and bring together the
                  people who can make it happen.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <Link
                to={postProjectHref}
                className={[
                  "h-11 w-full px-6 text-xs",

                  "sm:h-12",

                  "sm:w-auto",

                  "sm:min-w-[190px]",

                  primaryButton,
                ].join(" ")}
              >
                Post a project
                <ArrowRightIcon size={14} className="ml-auto" />
              </Link>

              <Link
                to={allocatHref}
                className={[
                  "h-11 w-full px-6 text-xs",

                  "sm:h-12",

                  "sm:w-auto",

                  "sm:min-w-[190px]",

                  secondaryButton,
                ].join(" ")}
              >
                {allocatLabel}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   TEAL INSIGHT CARD
========================================================= */

function TealInsightCard({
  icon: Icon,
  label,
  title,
  text,
  accent = "amber",
  compact = false,
  horizontal = false,
  action,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  accent?: TealAccent;
  compact?: boolean;
  horizontal?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border",

        compact ? "p-4 sm:p-5" : "p-5 sm:p-6",

        tealInsightSurface,

        className,
      ].join(" ")}
    >
      <div
        className={[
          "relative z-10",

          horizontal
            ? "lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6"
            : "",
        ].join(" ")}
      >
        <span
          className={[
            "flex shrink-0 items-center justify-center rounded-lg",

            compact ? "h-8 w-8" : "h-9 w-9",

            "bg-white/[0.09]",

            "text-white/90",

            "ring-1 ring-inset ring-white/[0.10]",
          ].join(" ")}
        >
          <Icon size={compact ? 12 : 14} />
        </span>

        <div className={horizontal ? "mt-4 lg:mt-0" : "mt-4"}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.44rem] font-semibold uppercase tracking-[0.15em] text-white/55">
              {label}
            </p>

            <ColourSprinkles accent={accent} small />
          </div>

          <p
            className={[
              "font-semibold tracking-[-0.015em] text-white",

              compact
                ? "mt-1.5 text-xs leading-5"
                : "mt-2 text-sm leading-6 sm:text-base",
            ].join(" ")}
          >
            {title}
          </p>

          <p
            className={[
              "text-white/65",

              compact
                ? "mt-2 text-[0.58rem] leading-5"
                : "mt-2 max-w-2xl text-xs leading-6",
            ].join(" ")}
          >
            {text}
          </p>
        </div>

        {action && (
          <div
            className={[
              "mt-4 flex",

              horizontal ? "lg:mt-0 lg:justify-end" : "sm:mt-5",
            ].join(" ")}
          >
            {action}
          </div>
        )}
      </div>

      <div
        aria-hidden
        className={[
          "pointer-events-none absolute",

          "-right-12 -top-12",

          compact ? "h-28 w-28" : "h-36 w-36",

          "rounded-full",

          "border border-white/[0.06]",
        ].join(" ")}
      />

      <PawPrintIcon
        aria-hidden
        className={[
          "pointer-events-none absolute -bottom-8 -right-6",

          compact ? "h-20 w-20" : "h-28 w-28",

          "-rotate-12",

          "text-white/[0.035]",
        ].join(" ")}
      />
    </div>
  );
}

/* =========================================================
   COLOUR SPRINKLES
========================================================= */

function ColourSprinkles({
  accent,
  small = false,
}: {
  accent: TealAccent;
  small?: boolean;
}) {
  return (
    <div aria-hidden className="flex shrink-0 items-center gap-1.5">
      <span
        className={[
          "rounded-full",

          small ? "h-1.5 w-1.5" : "h-2 w-2",

          accentDotClass(accent),
        ].join(" ")}
      />

      <span
        className={[
          "rounded-full bg-white/28",

          small ? "h-1 w-1" : "h-1.5 w-1.5",
        ].join(" ")}
      />

      <span
        className={[
          "rounded-full",

          small ? "h-1 w-3" : "h-1.5 w-4",

          secondaryAccentClass(accent),
        ].join(" ")}
      />
    </div>
  );
}

/* =========================================================
   SECTION ACTION
========================================================= */

function SectionAction({ children }: { children: ReactNode }) {
  return <div className="mt-7 flex">{children}</div>;
}

/* =========================================================
   PAW LANGUAGE
========================================================= */

function PawTrail({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={["pointer-events-none items-center gap-3", className].join(
        " ",
      )}
    >
      <PawPrintIcon className="h-5 w-5 -rotate-12 text-brand-secondary-highlight/28 dark:text-secondary/28" />

      <PawPrintIcon className="h-4 w-4 rotate-6 text-foreground/12" />

      <PawPrintIcon className="h-3.5 w-3.5 -rotate-6 text-brand-secondary-highlight/14 dark:text-secondary/14" />
    </div>
  );
}

/* =========================================================
   INTERFACE GRID
========================================================= */

function InterfaceGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden opacity-[0.2] sm:block dark:opacity-[0.12]"
      style={{
        backgroundImage:
          "linear-gradient(to right, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 45%, transparent) 1px, transparent 1px)",

        backgroundSize: "36px 36px",

        maskImage:
          "linear-gradient(to bottom right, black 0%, transparent 72%)",

        WebkitMaskImage:
          "linear-gradient(to bottom right, black 0%, transparent 72%)",
      }}
    />
  );
}

/* =========================================================
   REVEAL
========================================================= */

function Reveal({
  children,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const reduceMotion = useReducedMotion();

  const initial =
    direction === "left"
      ? {
          opacity: 0,
          x: -22,
        }
      : direction === "right"
        ? {
            opacity: 0,
            x: 22,
          }
        : {
            opacity: 0,
            y: 20,
          };

  return (
    <motion.div
      initial={reduceMotion ? false : initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   GENERAL
========================================================= */

function Eyebrow({
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
      <span className="h-1.5 w-7 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

      <span className="text-[0.5rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground sm:text-[0.52rem] sm:tracking-[0.19em]">
        {children}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className={[
        "mt-4 max-w-4xl",

        "text-[2.25rem] font-semibold leading-[0.97] tracking-[-0.042em]",

        "text-foreground/95",

        "sm:mt-5",

        "sm:text-5xl",

        "lg:text-6xl",
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

function HeroDetail({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 text-[0.55rem] font-medium text-muted-foreground sm:text-[0.57rem]",

        className,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

      {children}
    </span>
  );
}

function StatusLabel({
  tone,
  children,
}: {
  tone: StatusTone;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",

        "text-[0.49rem] font-semibold",

        statusTextClass(tone),
      ].join(" ")}
    >
      <span
        className={["h-1.5 w-1.5 rounded-full", statusDotClass(tone)].join(" ")}
      />

      {children}
    </span>
  );
}

function ProofStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-border/55 px-2 first:border-l-0 first:pl-0 sm:px-3">
      <p className="text-[0.4rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground sm:text-[0.44rem] sm:tracking-[0.11em]">
        {label}
      </p>

      <p className="mt-1.5 text-[0.68rem] font-semibold text-foreground sm:text-xs">
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-border/55 px-2.5 first:border-l-0 first:pl-0">
      <p className="text-[0.42rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}

/* =========================================================
   IMAGE HELPERS
========================================================= */

function ImageShade() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent dark:from-background/80"
    />
  );
}

function imageShapeClass(shape: WorkImageShape): string {
  switch (shape) {
    case "arch":
      return "rounded-t-[5rem] rounded-b-[1.1rem] sm:rounded-t-[7rem] sm:rounded-b-[1.3rem]";

    case "soft":
      return "rounded-[1.3rem_2.8rem_1.3rem_1.3rem] sm:rounded-[1.6rem_3.5rem_1.6rem_1.6rem]";

    case "round":
      return "rounded-[4rem_4rem_1.2rem_1.2rem] sm:rounded-[5rem_5rem_1.5rem_1.5rem]";

    case "tall":
      return "rounded-[1.2rem_2.8rem_1.2rem_2.8rem] sm:rounded-[1.4rem_3.4rem_1.4rem_3.4rem]";

    default:
      return "rounded-xl";
  }
}

/* =========================================================
   COLOUR HELPERS
========================================================= */

function toneSurface(tone: Tone): string {
  switch (tone) {
    case "amber":
      return [
        "bg-status-pending/[0.12]",

        "text-status-pending-foreground",
      ].join(" ");

    case "green":
      return [
        "bg-status-complete/[0.11]",

        "text-status-complete-foreground",
      ].join(" ");

    case "lime":
      return [
        "bg-brand-primary/[0.12]",

        "text-brand-primary-muted",

        "dark:bg-secondary/[0.10]",

        "dark:text-secondary",
      ].join(" ");

    case "cyan":
      return [
        "bg-brand-cyan/[0.09]",

        "text-brand-secondary-highlight",

        "dark:bg-brand-cyan/[0.08]",

        "dark:text-brand-cyan",
      ].join(" ");

    case "teal":
      return [
        "bg-brand-secondary-highlight/[0.10]",

        "text-brand-secondary-highlight",

        "dark:bg-surface-2/90",

        "dark:text-secondary",
      ].join(" ");

    case "neutral":
    default:
      return neutralIconSurface;
  }
}

function toneSurfaceDark(tone: Tone): string {
  switch (tone) {
    case "amber":
      return "dark:bg-status-pending/[0.12] dark:text-status-pending-foreground";

    case "green":
      return "dark:bg-status-complete/[0.11] dark:text-status-complete-foreground";

    case "lime":
      return "dark:bg-secondary/[0.10] dark:text-secondary";

    case "cyan":
      return "dark:bg-brand-cyan/[0.08] dark:text-brand-cyan";

    case "teal":
      return "dark:bg-surface-2/90 dark:text-secondary";

    case "neutral":
    default:
      return "dark:bg-surface-2/85 dark:text-foreground/65";
  }
}

function accentDotClass(accent: TealAccent): string {
  switch (accent) {
    case "lime":
      return "bg-brand-primary";

    case "green":
      return "bg-brand-green";

    case "cyan":
      return "bg-brand-cyan";

    case "amber":
    default:
      return "bg-brand-amber";
  }
}

function secondaryAccentClass(accent: TealAccent): string {
  switch (accent) {
    case "lime":
      return "bg-brand-cyan/70";

    case "green":
      return "bg-brand-primary/70";

    case "cyan":
      return "bg-brand-amber/70";

    case "amber":
    default:
      return "bg-brand-primary/70";
  }
}

function statusDotClass(tone: StatusTone): string {
  switch (tone) {
    case "pending":
      return "bg-status-pending";

    case "complete":
      return "bg-status-complete";

    case "overdue":
      return "bg-status-overdue";

    case "active":
    default:
      return "bg-status-active";
  }
}

function statusTextClass(tone: StatusTone): string {
  switch (tone) {
    case "pending":
      return "text-status-pending-foreground";

    case "complete":
      return "text-status-complete-foreground";

    case "overdue":
      return "text-status-overdue-foreground";

    case "active":
    default:
      return "text-status-active-foreground";
  }
}

export default LandingPage;
