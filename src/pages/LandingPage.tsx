import { useEffect, useState, type ReactNode } from "react";

import { Link } from "react-router-dom";

import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  FileCheck2Icon,
  FileTextIcon,
  HammerIcon,
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
import { Button } from "@/components/ui/button";

/* =========================================================
   TYPES
========================================================= */

type Tone = "teal" | "lime" | "green" | "amber" | "neutral";

type StatusTone = "active" | "pending" | "complete" | "overdue";

type WorkImageShape = "arch" | "soft" | "round" | "tall";

type TypingPhase = "typing" | "holding" | "clearing";

/* =========================================================
   IMAGERY

   Pexels development references.
   Move final approved imagery into local assets before
   production so the landing page does not depend on hotlinks.
========================================================= */

const landingImages = {
  electrical:
    "https://images.pexels.com/photos/29871587/pexels-photo-29871587.jpeg?auto=compress&cs=tinysrgb&w=1400",

  carpentry:
    "https://images.pexels.com/photos/6790977/pexels-photo-6790977.jpeg?auto=compress&cs=tinysrgb&w=1400",

  finishing:
    "https://images.pexels.com/photos/5493673/pexels-photo-5493673.jpeg?auto=compress&cs=tinysrgb&w=1400",

  construction:
    "https://images.pexels.com/photos/14076979/pexels-photo-14076979.jpeg?auto=compress&cs=tinysrgb&w=1400",

  renovation:
    "https://images.pexels.com/photos/5493654/pexels-photo-5493654.jpeg?auto=compress&cs=tinysrgb&w=1400",

  projectTeam:
    "https://images.pexels.com/photos/30592258/pexels-photo-30592258.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

/* =========================================================
   THEME
========================================================= */

const primaryButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",
  "shadow-none",

  "transition-[background-color,border-color,color,transform] duration-200",

  "hover:-translate-y-0.5",
  "hover:border-brand-secondary-highlight/20",
  "hover:bg-brand-secondary-highlight/90",
  "hover:text-primary-foreground",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/15",
  "dark:hover:bg-secondary/90",
  "dark:hover:text-secondary-foreground",
].join(" ");

const secondaryButton = [
  "border-border/65",
  "bg-surface-2/35",
  "text-foreground/70",
  "shadow-none",

  "transition-[background-color,border-color,color,transform] duration-200",

  "hover:-translate-y-0.5",
  "hover:border-border/85",
  "hover:bg-surface-3/60",
  "hover:text-foreground",

  "dark:border-border",
  "dark:bg-surface-2/65",
  "dark:text-foreground/75",

  "dark:hover:bg-surface-3/70",
  "dark:hover:text-foreground",
].join(" ");

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

/* =========================================================
   DATA
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

const capabilityCards = [
  {
    label: "Electrical",
    description: "Wiring · lighting · installations",
    image: landingImages.electrical,
    icon: ZapIcon,
    tone: "amber" as Tone,
    shape: "arch" as WorkImageShape,
    offset: "sm:mt-14",
  },
  {
    label: "Carpentry",
    description: "Joinery · fitting · cabinetry",
    image: landingImages.carpentry,
    icon: HammerIcon,
    tone: "lime" as Tone,
    shape: "soft" as WorkImageShape,
    offset: "sm:mt-0",
  },
  {
    label: "Finishing",
    description: "Painting · prep · decorating",
    image: landingImages.finishing,
    icon: PaintbrushIcon,
    tone: "green" as Tone,
    shape: "round" as WorkImageShape,
    offset: "sm:mt-20",
  },
  {
    label: "Construction",
    description: "Building · renovation · site work",
    image: landingImages.construction,
    icon: HardHatIcon,
    tone: "teal" as Tone,
    shape: "tall" as WorkImageShape,
    offset: "sm:mt-7",
  },
];

const discoveryGroups = [
  {
    icon: ZapIcon,
    title: "Electrical",
    count: 12,
    tone: "amber" as Tone,
    skills: ["Wiring", "Lighting", "Sockets"],
  },
  {
    icon: HammerIcon,
    title: "Carpentry",
    count: 8,
    tone: "lime" as Tone,
    skills: ["Cabinetry", "Joinery", "Fitting"],
  },
  {
    icon: PaintbrushIcon,
    title: "Finishing",
    count: 7,
    tone: "green" as Tone,
    skills: ["Painting", "Prep", "Decorating"],
  },
  {
    icon: TruckIcon,
    title: "Logistics",
    count: 5,
    tone: "teal" as Tone,
    skills: ["Transport", "Delivery", "Handling"],
  },
];

const heroBrief =
  "Renovate my kitchen, update the electrical fittings and install new cabinetry.";

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

          <WorkspaceSection />

          <ProofSection />
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
    <section className="relative overflow-hidden bg-background">
      <HeroBackground />

      <div className="container relative mx-auto px-4 pb-14 pt-20 sm:px-5 sm:pb-20 sm:pt-24 md:px-8 lg:pb-28 lg:pt-32">
        <div className="grid gap-12 lg:min-h-[690px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
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
                "sm:mt-6 sm:text-[4.5rem]",
                "md:text-[5.15rem]",
                "lg:text-[5.8rem]",
              ].join(" ")}
            >
              Start with the work.
              <span className="block text-brand-secondary-highlight dark:text-secondary">
                Find the right fit.
              </span>
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
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
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
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
              <Button
                asChild
                variant="ghost"
                className={[
                  "group h-11 w-full rounded-lg px-6 text-xs font-semibold",
                  "sm:h-12 sm:w-auto sm:px-7",
                  primaryButton,
                ].join(" ")}
              >
                <Link to="/discover">
                  Find an Allocat
                  <ArrowRightIcon
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className={[
                  "h-11 w-full rounded-lg px-6 text-xs font-semibold",
                  "sm:h-12 sm:w-auto sm:px-7",
                  secondaryButton,
                ].join(" ")}
              >
                <Link to={postProjectHref}>Create a project</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
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
    </section>
  );
}

/* =========================================================
   HERO MATCH COMPOSER
========================================================= */

function HeroMatchComposer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
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
          "rounded-[1.8rem] border border-border/30",
          "bg-surface-2/15",
          "dark:bg-surface-2/15",
          "sm:block",
        ].join(" ")}
      />

      <PawTrail className="absolute -right-1 -top-9 hidden md:flex" />

      <div
        className={[
          "relative overflow-hidden rounded-[1.15rem] border p-4",
          "sm:rounded-[1.35rem] sm:p-6",
          paperSurface,
        ].join(" ")}
      >
        <InterfaceGrid />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  accentIconSurface,
                ].join(" ")}
              >
                <img
                  src={assets.allocatrIcon}
                  alt=""
                  className="h-4 w-4 object-contain"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[0.44rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-[0.46rem]">
                  Start a project
                </p>

                <p className="mt-1 truncate text-xs font-semibold text-foreground sm:text-sm">
                  What needs to be done?
                </p>
              </div>
            </div>

            <span className="hidden text-[0.45rem] font-semibold text-muted-foreground sm:block">
              New brief
            </span>
          </div>

          {/* INPUT */}

          <div className="mt-4 rounded-xl border border-border/60 bg-background/55 p-3.5 dark:bg-background/30 sm:mt-5 sm:p-4">
            <HeroTypingLine reduceMotion={reduceMotion} />
          </div>

          {/* CAPABILITIES */}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.05,
              duration: 0.45,
            }}
            className="mt-4 sm:mt-5"
          >
            <div className="flex items-center gap-3">
              <p className="text-[0.42rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[0.44rem]">
                Suggested capability
              </p>

              <span className="h-px flex-1 bg-border/70" />

              <span className="hidden text-[0.45rem] font-semibold text-muted-foreground sm:block">
                03
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <ComposerCapability
                icon={ZapIcon}
                label="Electrical"
                tone="amber"
                delay={1.12}
              />

              <ComposerCapability
                icon={HammerIcon}
                label="Carpentry"
                tone="lime"
                delay={1.25}
              />

              <ComposerCapability
                icon={PaintbrushIcon}
                label="Finishing"
                tone="green"
                delay={1.38}
                className="hidden sm:inline-flex"
              />
            </div>
          </motion.div>

          {/* MATCH */}

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 14,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.62,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="mt-5 border-t border-border/55 pt-4 sm:mt-6 sm:pt-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.42rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[0.44rem]">
                  Recommended fit
                </p>

                <p className="mt-1 text-xs font-semibold text-foreground">
                  Electrical
                </p>
              </div>

              <span className="hidden text-[0.46rem] font-semibold text-status-complete-foreground sm:block">
                12 matches
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-border/55 bg-surface-2/30 p-3 dark:bg-surface-2/55 sm:p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[0.46rem] font-semibold text-foreground/60 dark:bg-surface-2 sm:h-10 sm:w-10 sm:text-[0.48rem]">
                TM
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  Tawanda M.
                </p>

                <p className="mt-0.5 truncate text-[0.48rem] text-muted-foreground">
                  Electrical specialist
                  <span className="hidden sm:inline"> · 8 years · 4.9</span>
                </p>
              </div>

              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.08, 1],
                      }
                }
                transition={{
                  delay: 2,
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  "bg-brand-secondary-highlight text-primary-foreground",
                  "dark:bg-secondary dark:text-secondary-foreground",
                ].join(" ")}
              >
                <CheckCircle2Icon size={11} />
              </motion.span>
            </div>
          </motion.div>

          {/* ACTION */}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.95,
              duration: 0.45,
            }}
            className="mt-4 flex items-center justify-end gap-4 sm:justify-between"
          >
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-status-complete" />

              <span className="text-[0.47rem] text-muted-foreground">
                Ready to allocate
              </span>
            </div>

            <div
              className={[
                "flex h-9 w-full items-center justify-center gap-2 rounded-lg border px-4",
                "border-brand-secondary-highlight/15",
                "bg-brand-secondary-highlight",
                "text-[0.52rem] font-semibold text-primary-foreground",
                "dark:border-secondary/10",
                "dark:bg-secondary",
                "dark:text-secondary-foreground",
                "sm:w-auto",
              ].join(" ")}
            >
              Allocate
              <ArrowRightIcon size={11} />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 8 }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          delay: 1.75,
          duration: 0.4,
        }}
        className={[
          "absolute -right-3 top-[43%] hidden",
          "items-center gap-2 rounded-full border px-3 py-2",
          paperSurface,
          "md:flex",
        ].join(" ")}
      >
        <PawPrintIcon
          size={11}
          className="text-brand-secondary-highlight dark:text-secondary"
        />

        <span className="text-[0.47rem] font-semibold text-foreground/65">
          Good fit
        </span>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   HERO TYPING

   Types → holds → fades → starts again.
========================================================= */

function HeroTypingLine({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [characterCount, setCharacterCount] = useState(
    reduceMotion ? heroBrief.length : 0,
  );

  const [phase, setPhase] = useState<TypingPhase>(
    reduceMotion ? "holding" : "typing",
  );

  useEffect(() => {
    if (reduceMotion) {
      setCharacterCount(heroBrief.length);
      setPhase("holding");
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (characterCount < heroBrief.length) {
        const nextCharacter = heroBrief[characterCount];

        let delay = 38;

        if (nextCharacter === " ") {
          delay = 22;
        }

        if (nextCharacter === "," || nextCharacter === ".") {
          delay = 115;
        }

        timeoutId = setTimeout(() => {
          setCharacterCount((current) =>
            Math.min(current + 1, heroBrief.length),
          );
        }, delay);
      } else {
        timeoutId = setTimeout(() => {
          setPhase("holding");
        }, 120);
      }
    }

    if (phase === "holding") {
      timeoutId = setTimeout(() => {
        setPhase("clearing");
      }, 3200);
    }

    if (phase === "clearing") {
      timeoutId = setTimeout(() => {
        setCharacterCount(0);
        setPhase("typing");
      }, 380);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [characterCount, phase, reduceMotion]);

  const visibleText = reduceMotion
    ? heroBrief
    : heroBrief.slice(0, characterCount);

  const isComplete = reduceMotion || phase === "holding";

  return (
    <>
      <div className="flex min-h-[72px] items-start gap-3 sm:min-h-[52px]">
        <FileTextIcon
          size={14}
          className="mt-1 shrink-0 text-muted-foreground"
        />

        <div className="min-w-0 flex-1">
          <motion.p
            animate={{
              opacity: phase === "clearing" ? 0 : 1,
            }}
            transition={{
              duration: 0.25,
            }}
            className="max-w-md text-xs leading-6 text-foreground/80"
          >
            {visibleText}

            {!reduceMotion && phase === "typing" && (
              <motion.span
                aria-hidden
                animate={{
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                }}
                className="ml-0.5 inline-block h-[0.9rem] w-px translate-y-[2px] bg-brand-secondary-highlight dark:bg-secondary"
              />
            )}
          </motion.p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 border-t border-border/50 pt-3 sm:mt-4">
        <span className="hidden text-[0.47rem] text-muted-foreground sm:inline">
          Harare · Home improvement
        </span>

        <motion.span
          animate={{
            opacity: phase === "clearing" ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
          }}
          className={[
            "ml-auto text-[0.47rem] font-semibold",
            isComplete
              ? "text-status-complete-foreground"
              : "text-brand-secondary-highlight dark:text-secondary",
          ].join(" ")}
        >
          {isComplete ? "Brief understood" : "Writing brief"}
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
  delay,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  delay: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 6,
              scale: 0.96,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        delay,
        duration: 0.35,
        ease: "easeOut",
      }}
      className={[
        "inline-flex items-center gap-2 rounded-full border",
        "border-border/55 bg-surface-2/35",
        "py-1.5 pl-1.5 pr-3",
        "dark:bg-surface-2/60",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full",
          toneSurface(tone),
        ].join(" ")}
      >
        <Icon size={9} />
      </span>

      <span className="text-[0.49rem] font-semibold text-foreground/70">
        {label}
      </span>
    </motion.span>
  );
}

/* =========================================================
   HERO BACKGROUND
========================================================= */

function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute right-0 top-0 hidden h-full w-[60%] opacity-[0.2] sm:block dark:opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to left, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, black 45%, transparent 100%)",
        }}
      />

      <PawPrintIcon className="absolute -right-10 bottom-[7%] hidden h-40 w-40 -rotate-12 text-foreground/[0.012] md:block" />
    </div>
  );
}

/* =========================================================
   STORY BAND
========================================================= */

function StoryBand() {
  return (
    <section className="relative bg-surface-1">
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

              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                Allocatr keeps the brief, capabilities, people and delivery
                attached to the same piece of work from beginning to end.
              </p>
            </div>
          </div>
        </Reveal>

        <div
          className={[
            "relative mt-10 overflow-hidden rounded-[1.35rem] border",
            "border-border/55 bg-card/70",
            "dark:bg-card",
            "sm:mt-16 sm:rounded-[2rem]",
            "lg:mt-20",
          ].join(" ")}
        >
          <PawTrail className="absolute right-8 top-8 hidden opacity-80 lg:flex" />

          {/* OPERATING MODEL */}

          <div className="px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
            <OperatingModelFlow />
          </div>

          {/* CAPABILITY STORY */}

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
                      "sm:mt-4 sm:text-4xl",
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
                  A project can require very different kinds of practical
                  capability. Specialists remain distinct while their work
                  remains connected to the same outcome.
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
            "dark:bg-secondary",
            "lg:block",
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

        "lg:border-b-0 lg:border-r lg:border-border/55 lg:px-6 lg:py-0",
        "lg:first:pl-0",
        "lg:last:border-r-0 lg:last:pr-0",
      ].join(" ")}
    >
      <div className="relative z-30 flex items-center justify-between">
        <span
          className={[
            "flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10",
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
            "border-border/60 bg-card px-3.5 py-2",
            "dark:bg-card",
            "sm:gap-3 sm:px-4 sm:py-2.5",
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
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -8,
            }
      }
      className={["group relative", item.offset].join(" ")}
    >
      <div
        className={[
          "relative aspect-[3/4] overflow-hidden",
          "border border-border/55 bg-surface-2",
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
            "transition-[transform,filter] duration-700",
            "group-hover:scale-[1.03]",
            "group-hover:saturate-100",
            "dark:brightness-[0.65]",
            "dark:saturate-[0.55]",
          ].join(" ")}
        />

        <ImageShade />

        <span
          className={[
            "absolute bottom-3 left-3 z-20",
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "sm:bottom-4 sm:left-4 sm:h-9 sm:w-9",
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
            "border-border/55 bg-background",
            "px-4 py-8",
            "sm:rounded-[2rem] sm:px-8 sm:py-12",
            "lg:px-10 lg:py-14",
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
                  Search by skill, profession or category. A broad need can
                  naturally lead toward the capabilities that make sense for the
                  project.
                </p>

                <div className="mt-8 hidden items-start gap-3 border-l-2 border-brand-secondary-highlight pl-4 sm:flex dark:border-secondary">
                  <SearchIcon
                    size={15}
                    className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"
                  />

                  <p className="max-w-md text-xs leading-6 text-muted-foreground">
                    Discovery starts with what needs doing instead of expecting
                    a client to already know exactly who they need.
                  </p>
                </div>

                <Link
                  to="/discover"
                  className="group mt-6 inline-flex items-center gap-2 text-xs font-semibold text-brand-secondary-highlight sm:mt-7 dark:text-secondary"
                >
                  Explore Allocats
                  <ArrowRightIcon
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
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
          "sm:rounded-[1.35rem] sm:p-6",
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
              kitchen renovation
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
              32 matches
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
              View all 32
            </span>
          </motion.div>
        </div>
      </div>

      <div
        className={[
          "absolute -bottom-5 right-[8%] hidden",
          "h-10 w-10 items-center justify-center rounded-full",
          "border border-border/55 bg-background",
          "text-brand-secondary-highlight",
          "dark:text-secondary",
          "sm:flex",
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
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -3,
            }
      }
      className={[
        "rounded-xl border p-3.5 sm:p-4",
        "border-border/50 bg-surface-2/30",
        "transition-[background-color,border-color] duration-200",
        "hover:border-border/75 hover:bg-surface-3/40",
        "dark:bg-surface-2/55",
        "dark:hover:bg-surface-3/55",
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

function WorkspaceSection() {
  return (
    <section className="relative py-8 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-5 md:px-8">
        <div
          className={[
            "relative overflow-hidden rounded-[1.35rem] border",
            "border-border/55 bg-card",
            "px-4 py-8",
            "sm:rounded-[2rem] sm:px-8 sm:py-12",
            "lg:px-10 lg:py-14",
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
                    "sm:mt-5 sm:text-5xl",
                    "lg:text-[3.7rem]",
                  ].join(" ")}
                >
                  One place for the work to move.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                  Once the team is in place, Allocatr becomes the shared view of
                  tasks, progress, ownership and what needs attention next.
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
      {/* PHOTO */}

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
          src={landingImages.renovation}
          alt="Renovation work in progress"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover saturate-[0.72] dark:brightness-[0.63]"
        />
      </motion.div>

      {/* INTERFACE */}

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
          "lg:absolute lg:bottom-[4%] lg:left-0 lg:right-[9%] lg:rounded-[1.3rem]",
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

      {/* SMALL PHOTO */}

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
          src={landingImages.carpentry}
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
          <WrenchIcon size={14} />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
              Kitchen renovation
            </p>

            <StatusLabel tone="active">Active</StatusLabel>
          </div>

          <p className="mt-1 hidden text-[0.52rem] text-muted-foreground sm:block">
            Home improvement · AL-0182
          </p>
        </div>
      </div>

      <span
        className={[
          "hidden w-fit rounded-lg border px-3 py-2",
          "text-[0.53rem] font-semibold",
          "border-brand-secondary-highlight/15",
          "bg-brand-secondary-highlight",
          "text-primary-foreground",
          "dark:border-secondary/10",
          "dark:bg-secondary",
          "dark:text-secondary-foreground",
          "sm:inline-flex",
        ].join(" ")}
      >
        Find Allocats
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
          7 of 12 complete
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
          title="Install kitchen sockets"
          person="Tawanda M."
          status="Active"
          tone="active"
        />

        <WorkspaceTask
          title="Fit cabinet doors"
          person="Leroy N."
          status="Pending"
          tone="pending"
        />

        <div className="hidden sm:block">
          <WorkspaceTask
            title="Site inspection"
            person="Project team"
            status="Complete"
            tone="complete"
          />
        </div>

        <div className="hidden sm:block">
          <WorkspaceTask
            title="Confirm fitting sizes"
            person="Client review"
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
            Accepted Allocats
          </p>
        </div>

        <span className="text-xl font-semibold text-status-active-foreground">
          03
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <WorkspaceMember initials="TM" name="Tawanda M." role="Electrical" />

        <WorkspaceMember initials="LN" name="Leroy N." role="Carpentry" />

        <WorkspaceMember initials="KM" name="Kuda M." role="Finishing" />
      </div>

      <div className="mt-6 border-t border-border/55 pt-5">
        <div className="flex items-center gap-2 text-status-active-foreground">
          <FileCheck2Icon size={12} />

          <p className="text-[0.46rem] font-semibold uppercase tracking-[0.13em]">
            Next milestone
          </p>
        </div>

        <p className="mt-2 text-xs font-semibold text-foreground">
          Electrical installation review
        </p>

        <p className="mt-1 text-[0.52rem] text-muted-foreground">
          Due 18 October · Tawanda M.
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

function ProofSection() {
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
                  "sm:mt-5 sm:text-5xl",
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

              <div className="mt-7 hidden items-start gap-3 sm:flex">
                <ShieldCheckIcon
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"
                />

                <p className="max-w-md text-xs leading-6 text-muted-foreground">
                  Professional context stays attached to actual work rather than
                  becoming another isolated directory listing.
                </p>
              </div>
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

          "sm:left-[4%] sm:top-[4%] sm:h-[420px] sm:w-[66%]",
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

          "sm:bottom-auto sm:left-auto sm:right-[2%] sm:top-[7%]",
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
          Kitchen renovation
        </p>

        <p className="mt-1 text-[0.5rem] text-muted-foreground">
          12 of 12 tasks complete
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
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <StarIcon
              key={value}
              size={14}
              className={
                value <= 4
                  ? "fill-brand-amber text-brand-amber"
                  : "text-muted-foreground/25"
              }
            />
          ))}
        </div>

        <p className="mt-4 text-xs font-semibold text-foreground">
          Professional and reliable.
        </p>

        <p className="mt-1.5 text-[0.54rem] leading-5 text-muted-foreground">
          Clear communication and completed as agreed.
        </p>
      </motion.div>

      <div
        className={[
          "absolute bottom-[28%] left-[1%] hidden",
          "h-9 w-9 items-center justify-center rounded-full",
          "border border-border/55 bg-surface-1",
          "text-brand-secondary-highlight",
          "dark:text-secondary",
          "sm:flex",
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
              <Button
                asChild
                variant="ghost"
                className={[
                  "group h-11 w-full rounded-lg px-6 text-xs font-semibold",
                  "sm:h-12 sm:w-auto sm:min-w-[190px]",
                  primaryButton,
                ].join(" ")}
              >
                <Link to={postProjectHref}>
                  Start a project
                  <ArrowRightIcon
                    size={14}
                    className="ml-auto transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className={[
                  "h-11 w-full rounded-lg px-6 text-xs font-semibold",
                  "sm:h-12 sm:w-auto sm:min-w-[190px]",
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
        "sm:mt-5 sm:text-5xl",
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
   COLOR HELPERS
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
