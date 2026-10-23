import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckBigIcon,
  FileCheck2Icon,
  FileTextIcon,
  MessageSquareIcon,
  UsersIcon,
  HardHatIcon,
  WrenchIcon,
  ShieldCheckIcon,
  ZapIcon,
  PawPrintIcon,
  CalendarDaysIcon,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const ROUTES = {
  register: "/register",
  discover: "/discover",
  howItWorks: "/how-it-works",
  becomeAllocat: "/become-an-allocat",
};

// Replace these with your own photography when available.
// Exact selected photograph: Snapwire / Pexels, photo 730896.
// https://www.pexels.com/photo/photo-of-gray-cat-looking-up-against-black-background-730896/
const HERO_CAT_IMAGE =
  "https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?auto=compress&cs=tinysrgb&w=2400";

const IMAGES = {
  client:
    "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
  expert:
    "https://images.pexels.com/photos/14076979/pexels-photo-14076979.jpeg?auto=compress&cs=tinysrgb&w=1400",
  connected:
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600",
  delivery:
    "https://images.pexels.com/photos/5493654/pexels-photo-5493654.jpeg?auto=compress&cs=tinysrgb&w=1600",
  profile:
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

// One fixed landing-page palette, scoped locally. It does not mutate the
// application theme or use light/dark variants. All values use brand tokens.
const LANDING_TOKENS = {
  colorScheme: "light",
  "--landing-paper": "var(--primary-foreground)",
  "--landing-hero-bg": "color-mix(in srgb, var(--brand-charcoal) 34%, black)",
  "--background":
    "color-mix(in srgb, var(--landing-paper) 96%, var(--brand-charcoal))",
  "--foreground": "var(--brand-charcoal)",
  "--surface-1": "var(--landing-paper)",
  "--surface-2":
    "color-mix(in srgb, var(--landing-paper) 94%, var(--brand-charcoal))",
  "--surface-3":
    "color-mix(in srgb, var(--landing-paper) 89%, var(--brand-charcoal))",
  "--surface-teal":
    "color-mix(in srgb, var(--landing-paper) 95%, var(--brand-secondary))",
  "--surface-lime":
    "color-mix(in srgb, var(--landing-paper) 94%, var(--brand-primary))",
  "--card": "var(--landing-paper)",
  "--card-foreground": "var(--brand-charcoal)",
  "--popover": "var(--landing-paper)",
  "--popover-foreground": "var(--brand-charcoal)",
  "--primary": "var(--brand-secondary)",
  "--secondary": "var(--brand-primary)",
  "--secondary-foreground": "var(--brand-charcoal)",
  "--muted": "var(--surface-3)",
  "--muted-foreground":
    "color-mix(in srgb, var(--brand-charcoal) 70%, var(--landing-paper))",
  "--accent": "var(--surface-teal)",
  "--accent-foreground": "var(--brand-secondary)",
  "--border":
    "color-mix(in srgb, var(--brand-charcoal) 15%, var(--landing-paper))",
  "--input": "var(--border)",
  "--ring": "var(--brand-secondary)",
  "--brand-secondary-highlight": "var(--brand-secondary)",
  "--brand-secondary-strong":
    "color-mix(in srgb, var(--brand-secondary) 80%, var(--brand-charcoal))",
} as CSSProperties;

const HERO_TOKENS = {
  colorScheme: "dark",
  "--background": "var(--landing-hero-bg)",
  "--foreground": "var(--primary-foreground)",
  "--card": "var(--landing-hero-bg)",
  "--card-foreground": "var(--primary-foreground)",
  "--popover": "var(--landing-hero-bg)",
  "--popover-foreground": "var(--primary-foreground)",
  "--surface-1": "var(--landing-hero-bg)",
  "--surface-2":
    "color-mix(in srgb, var(--landing-hero-bg) 92%, var(--primary-foreground))",
  "--surface-3":
    "color-mix(in srgb, var(--landing-hero-bg) 85%, var(--primary-foreground))",
  "--muted-foreground":
    "color-mix(in srgb, var(--primary-foreground) 72%, var(--landing-hero-bg))",
  "--border":
    "color-mix(in srgb, var(--primary-foreground) 16%, var(--landing-hero-bg))",
  "--ring": "var(--brand-primary)",
  "--brand-secondary-highlight": "var(--brand-primary)",
} as CSSProperties;
const CONTAINER =
  "mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-14 xl:px-20";
const HEADING =
  "text-[clamp(1.7rem,2.8vw,2.85rem)] font-medium leading-[1.16] tracking-[-0.035em]";
const ACCENT = "text-brand-secondary-highlight ";
const DEMO_CARD =
  "rounded-xl border border-primary/15 bg-primary p-4 text-primary-foreground shadow-none sm:p-5 lg:p-6";
const PAPER_CARD =
  "rounded-xl border border-border/55 bg-card p-4 text-card-foreground shadow-none sm:p-5 lg:p-6";
const ACTION_BASE =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border px-5 py-2.5 text-[13px] font-medium shadow-none pointer-events-auto relative z-10 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const PRIMARY_BUTTON =
  "border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-[0.86] focus-visible:ring-brand-secondary-highlight/25       ";
const SECONDARY_BUTTON =
  "border-border/65 bg-surface-2/35 text-foreground/70 hover:bg-surface-2/35 hover:text-foreground/70 hover:opacity-[0.72] focus-visible:ring-brand-secondary-highlight/18       ";
const TEAL_BUTTON =
  "border-brand-primary/20 bg-brand-primary text-secondary-foreground hover:bg-brand-primary hover:text-secondary-foreground hover:opacity-[0.84] focus-visible:ring-brand-primary/30 focus-visible:ring-offset-primary";

export default function LandingPage() {
  const { user } = useAuth();
  const pageRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => {
      const childHeight =
        header.firstElementChild?.getBoundingClientRect().height ?? 0;
      setHeaderHeight(
        Math.ceil(header.getBoundingClientRect().height || childHeight || 64),
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    if (header.firstElementChild) observer.observe(header.firstElementChild);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const postProjectHref = user ? "/projects/new" : ROUTES.register;
  const allocatHref = user?.isAllocat ? "/projects" : ROUTES.becomeAllocat;
  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";

  return (
    <div
      ref={pageRef}
      className="isolate w-full bg-background text-foreground"
      style={
        {
          ...LANDING_TOKENS,
          "--landing-header-height": `${headerHeight}px`,
        } as CSSProperties
      }
    >
      {/* Keep navigation outside every transformed or animated section. */}
      <div
        ref={headerRef}
        className="sticky top-0 z-[100] w-full bg-background pointer-events-auto"
        style={HERO_TOKENS}
      >
        <SiteHeader />
      </div>
      <BlankSpacePaws rootRef={pageRef} />
      <main className="relative isolate w-full">
        <HeroPanel postProjectHref={postProjectHref} />
        <SlidingSection order={1} className="bg-surface-1">
          <AdventurePanel
            postProjectHref={postProjectHref}
            allocatHref={allocatHref}
            allocatLabel={allocatLabel}
          />
        </SlidingSection>
        <SlidingSection order={2} className="bg-background">
          <OperatingTimeline />
        </SlidingSection>
        <SlidingSection order={3} className="bg-surface-teal">
          <ConnectedWorkPanel />
        </SlidingSection>
        <SlidingSection
          order={4}
          className="bg-primary text-primary-foreground "
        >
          <ExecutionPanel />
        </SlidingSection>
        <SlidingSection order={5} className="bg-surface-1">
          <ProfilePanel allocatHref={allocatHref} />
        </SlidingSection>
        <SlidingSection order={6} className="bg-surface-2">
          <FaqPanel />
        </SlidingSection>
        <SlidingSection order={7} className="bg-background">
          <ClosingPanel postProjectHref={postProjectHref} />
        </SlidingSection>
      </main>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}

/**
 * Distinct sections in normal document flow. The surface remains stationary
 * within the document while its content receives an 8px entrance lift.
 * There is no pinning, negative margin or overlapping hit-test layer.
 */
function SlidingSection({
  children,
  order,
  className = "",
}: {
  children: ReactNode;
  order: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 70%"],
  });
  const lift = useTransform(scrollYProgress, [0, 1], [8, 0]);
  return (
    <section
      ref={ref}
      data-paw-tone={className.includes("bg-primary") ? "dark" : undefined}
      className={`relative w-full border-t border-border/55 ${className}`}
      style={{ zIndex: order }}
    >
      <motion.div style={{ y: reducedMotion ? 0 : lift }}>
        {children}
      </motion.div>
    </section>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.6,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Floating({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.15 });
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={`pointer-events-none ${className}`}
      animate={visible && !reducedMotion ? { y: [0, -2, 0] } : { y: 0 }}
      transition={{
        duration: 6,
        delay,
        repeat: visible && !reducedMotion ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function ActionLink({
  to,
  children,
  secondary = false,
  onTeal = false,
  onDark = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  onTeal?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`${ACTION_BASE} w-full sm:w-auto ${onTeal ? TEAL_BUTTON : onDark ? "border-primary-foreground/25 bg-primary-foreground/[0.04] text-primary-foreground hover:opacity-80 focus-visible:ring-brand-primary/30" : secondary ? SECONDARY_BUTTON : PRIMARY_BUTTON}`}
    >
      {children}
      <ArrowRightIcon size={17} aria-hidden="true" />
    </Link>
  );
}

function Eyebrow({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`h-1.5 w-7 rounded-full ${dark ? "bg-brand-primary" : "bg-brand-secondary-highlight "}`}
      />
      <p
        className={`text-[10px] font-medium uppercase tracking-[0.16em] sm:text-[11px] ${dark ? "text-primary-foreground/65" : "text-muted-foreground"}`}
      >
        {children}
      </p>
    </div>
  );
}

function HeroPanel({ postProjectHref }: { postProjectHref: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <section
      className="relative flex min-h-[calc(100svh-var(--landing-header-height))] w-full flex-col bg-background text-foreground"
      data-paw-tone="dark"
      style={HERO_TOKENS}
    >
      <HeroAtmosphere />
      <CatBackground />
      <div
        className={`${CONTAINER} relative z-10 flex flex-1 flex-col items-center justify-center pb-12 pt-10 text-center sm:pb-16 sm:pt-12`}
      >
        <Eyebrow dark>Work, better allocated</Eyebrow>
        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-5 max-w-[1000px] text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-[1.06] tracking-[-0.035em]"
        >
          Good work starts
          <br className="hidden sm:block" /> with the right
          <br />
          <span className="text-brand-secondary-highlight ">
            skilled people.
          </span>
        </motion.h1>
        <p className="mt-7 max-w-3xl text-sm font-normal tracking-[-0.015em] sm:text-base lg:text-lg">
          Real expertise.{" "}
          <span className="mx-1 text-brand-secondary-highlight ">+</span> Clear
          responsibility.
          <span className="mx-1 text-brand-secondary-highlight ">+</span> One
          connected workspace.
        </p>
        <p className="mt-4 max-w-[620px] text-sm leading-relaxed text-muted-foreground sm:text-base">
          Find experienced professionals, skilled tradespeople and specialists.
          Bring the right capability together around the work that needs doing.
        </p>
        <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <ActionLink to={postProjectHref} onTeal>
            Post a project
          </ActionLink>
          <ActionLink to={ROUTES.discover} onDark>
            Browse all Allocats
          </ActionLink>
        </div>
        <div className="mt-8 hidden w-full max-w-[850px] gap-3 text-left sm:grid sm:grid-cols-3 lg:mt-10">
          <HeroBenefit
            icon={BriefcaseBusinessIcon}
            title="Professional expertise"
          />
          <HeroBenefit icon={HardHatIcon} title="Skilled trades" />
          <HeroBenefit icon={UsersIcon} title="People who deliver" />
        </div>
      </div>
    </section>
  );
}

function CatBackground() {
  const [imageAvailable, setImageAvailable] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  if (!imageAvailable) return null;

  const feather =
    "radial-gradient(ellipse at 64% 48%, var(--primary-foreground) 24%, color-mix(in srgb, var(--primary-foreground) 82%, transparent) 45%, transparent 78%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Lighten removes the photograph's black rectangle without recolouring
          the amber eyes. The radial mask feathers all four image edges. */}
      <div
        className="absolute -right-[12%] -top-[4%] h-[108%] w-[105%] mix-blend-lighten opacity-[0.42] sm:-right-[8%] sm:w-[82%] sm:opacity-[0.62] lg:-right-[4%] lg:w-[68%]"
        style={{
          maskImage: feather,
          WebkitMaskImage: feather,
        }}
      >
        <motion.img
          src={HERO_CAT_IMAGE}
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageAvailable(false)}
          initial={false}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.2, ease: "easeOut" }}
          className="h-full w-full object-cover object-[50%_42%]"
        />
      </div>
      {/* A broad tonal veil gives the centred headline a quiet reading area. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--background) 3%, color-mix(in srgb, var(--background) 85%, transparent) 32%, color-mix(in srgb, var(--background) 45%, transparent) 58%, transparent 85%), linear-gradient(to top, var(--background), transparent 24%, transparent 78%, color-mix(in srgb, var(--background) 68%, transparent))",
        }}
      />
    </div>
  );
}

function HeroBenefit({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div
      data-paw-block="true"
      className="flex items-center gap-3 rounded-xl border border-border/55 bg-primary-foreground/[0.04] px-4 py-3.5"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/[0.08] text-brand-primary ring-1 ring-inset ring-brand-primary/15   ">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="text-xs font-medium leading-5">{title}</span>
    </div>
  );
}

function HeroAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 82% 48%, color-mix(in srgb, var(--brand-secondary) 18%, transparent), transparent 68%)",
      }}
    />
  );
}

type PawStep = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
};

/** Decorative footsteps only on unoccupied page space. Never captures input. */
function BlankSpacePaws({
  rootRef,
}: {
  rootRef: { readonly current: HTMLDivElement | null };
}) {
  const reducedMotion = useReducedMotion();
  const [steps, setSteps] = useState<PawStep[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) {
      setSteps([]);
      return;
    }
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    // Rectangles also exclude pointer-events:none photo compositions.
    const blocked =
      "a,button,input,textarea,select,label,form,nav,header,footer,h1,h2,h3,h4,p,li,article,img,[role='progressbar'],[data-paw-block]";
    let rects: DOMRect[] = [];
    let lastMeasure = 0;
    let timer: number | undefined;
    let anchor = { x: 0, y: 0, color: "" };
    let sequence = 0;
    let nextId = 0;

    function refreshRects() {
      rects = Array.from(root!.querySelectorAll<HTMLElement>(blocked))
        // Decorative background photos must not turn the whole hero into a blocked area.
        .filter((element) => !element.closest('[aria-hidden="true"]'))
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0);
      lastMeasure = performance.now();
    }
    function isOccupied(x: number, y: number) {
      return rects.some(
        (rect) =>
          x >= rect.left - 14 &&
          x <= rect.right + 14 &&
          y >= rect.top - 14 &&
          y <= rect.bottom + 14,
      );
    }
    function stop() {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      sequence = 0;
      setSteps((current) => (current.length ? [] : current));
    }
    function step() {
      if (document.hidden || !finePointer.matches) {
        stop();
        return;
      }
      if (performance.now() - lastMeasure > 250) refreshRects();
      const phase = sequence % 6;
      const side = sequence % 2 === 0 ? -1 : 1;
      const x = anchor.x + side * 9;
      const y = anchor.y + 30 - phase * 13;
      sequence += 1;
      if (
        x < 16 ||
        y < 16 ||
        x > window.innerWidth - 16 ||
        y > window.innerHeight - 16 ||
        isOccupied(x, y)
      )
        return;
      const paw = {
        id: nextId++,
        x,
        y,
        rotation: side * 8,
        color: anchor.color,
      };
      setSteps((current) => [...current.slice(-7), paw]);
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !finePointer.matches) {
        stop();
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) {
        stop();
        return;
      }
      if (performance.now() - lastMeasure > 120) refreshRects();
      if (target.closest(blocked) || isOccupied(event.clientX, event.clientY)) {
        stop();
        return;
      }
      const darkSurface = target.closest('[data-paw-tone="dark"]');
      anchor = {
        x: event.clientX,
        y: event.clientY,
        color: getComputedStyle(root!)
          .getPropertyValue(
            darkSurface ? "--brand-primary" : "--brand-secondary",
          )
          .trim(),
      };
      if (timer === undefined) {
        step();
        timer = window.setInterval(step, 190);
      }
    }
    function visibility() {
      if (document.hidden) stop();
    }
    refreshRects();
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", stop);
    window.addEventListener("scroll", stop, { passive: true });
    window.addEventListener("resize", stop);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    finePointer.addEventListener("change", stop);
    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", stop);
      window.removeEventListener("scroll", stop);
      window.removeEventListener("resize", stop);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
      finePointer.removeEventListener("change", stop);
    };
  }, [reducedMotion, rootRef]);

  if (reducedMotion) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[30] overflow-hidden select-none"
      style={{ pointerEvents: "none" }}
    >
      {steps.map((step) => (
        <motion.span
          key={step.id}
          data-paw-step="true"
          className="pointer-events-none absolute"
          style={{
            left: step.x - 10,
            top: step.y - 10,
            color: step.color,
            rotate: step.rotation,
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 0.23, 0.17, 0], scale: [0.85, 1, 1, 0.96] }}
          transition={{
            duration: 1.25,
            times: [0, 0.12, 0.55, 1],
            ease: "easeInOut",
          }}
          onAnimationComplete={() =>
            setSteps((current) => current.filter((item) => item.id !== step.id))
          }
        >
          <PawPrintIcon size={20} strokeWidth={1.6} aria-hidden="true" />
        </motion.span>
      ))}
    </div>
  );
}

function AdventurePanel({
  postProjectHref,
  allocatHref,
  allocatLabel,
}: {
  postProjectHref: string;
  allocatHref: string;
  allocatLabel: string;
}) {
  return (
    <div className={`${CONTAINER} py-12 sm:py-16 lg:py-20`}>
      <div className="text-center">
        <Eyebrow>Two ways to start</Eyebrow>
        <h2 className={`${HEADING} mt-4`}>Choose your path</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Different goals. One connected platform. Built for people who want to
          work together.
        </p>
      </div>
      <div className="mt-9 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-7">
        <Reveal>
          <ChoiceCard
            title="For clients"
            copy="Find the capability your project needs and bring the right people together."
            points={[
              "Describe the work",
              "Discover relevant capability",
              "Allocate responsibility",
            ]}
            image={IMAGES.client}
            imageAlt="Professional planning project work"
            href={postProjectHref}
            action="Post a project"
            labels={["Planning", "Allocating", "Tracking", "Delivering"]}
          />
        </Reveal>
        <Reveal delay={0.12}>
          <ChoiceCard
            title="For skilled experts"
            copy="Bring your trade, profession or specialist experience to work that needs it."
            points={[
              "Showcase your skills and experience",
              "Join relevant projects",
              "Build context through delivery",
            ]}
            image={IMAGES.expert}
            imageAlt="Skilled construction expert working on site"
            href={allocatHref}
            action={allocatLabel}
            labels={[
              "Find work",
              "Build your profile",
              "Gain experience",
              "Grow your network",
            ]}
          />
        </Reveal>
      </div>
    </div>
  );
}

function ChoiceCard({
  title,
  copy,
  points,
  image,
  imageAlt,
  href,
  action,
  labels,
}: {
  title: string;
  copy: string;
  points: string[];
  image: string;
  imageAlt: string;
  href: string;
  action: string;
  labels: string[];
}) {
  return (
    <article className="grid h-full overflow-hidden rounded-xl border border-border/55 bg-card text-card-foreground  sm:grid-cols-[1.12fr_0.88fr]">
      <div className="flex flex-col items-start p-5 sm:p-6 xl:p-8">
        <h3 className="text-lg font-medium tracking-[-0.025em] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {copy}
        </p>
        <ul className="mb-7 mt-6 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-xs leading-relaxed sm:text-sm"
            >
              <CheckDot />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto w-full sm:w-auto">
          <ActionLink to={href}>{action}</ActionLink>
        </div>
      </div>
      <div className="relative hidden sm:block sm:min-h-[360px]">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover saturate-[0.76]  "
        />
        <div className="absolute inset-0 bg-brand-secondary/15" />
        <div className="absolute bottom-5 right-4 max-w-[190px] rounded-xl border border-primary/15 bg-primary p-4 text-primary-foreground shadow-none   ">
          {labels.map((label) => (
            <div
              key={label}
              className="flex items-center gap-2 py-2 text-[11px]"
            >
              <CircleCheckBigIcon
                className="shrink-0 text-brand-primary "
                size={15}
                aria-hidden="true"
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function CheckDot() {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-secondary-highlight text-primary-foreground  ">
      <CheckIcon size={11} strokeWidth={3} aria-hidden="true" />
    </span>
  );
}

const OPERATING_STAGES = [
  {
    label: "Define",
    title: "Start with the outcome.",
    copy: "Set the scope and expectations before looking for people.",
    icon: FileTextIcon,
    color: "var(--brand-secondary-highlight)",
    ink: "var(--brand-secondary-highlight)",
  },
  {
    label: "Shape",
    title: "Identify the capability.",
    copy: "Understand the practical skills and expertise the work requires.",
    icon: WrenchIcon,
    color: "var(--brand-amber)",
    ink: "color-mix(in srgb, var(--brand-amber) 60%, var(--brand-charcoal))",
  },
  {
    label: "Allocate",
    title: "Find the right fit.",
    copy: "Bring in skilled people who can take responsibility.",
    icon: UsersIcon,
    color: "var(--brand-cyan)",
    ink: "color-mix(in srgb, var(--brand-cyan) 60%, var(--brand-charcoal))",
  },
  {
    label: "Deliver",
    title: "Keep the work connected.",
    copy: "Follow the tasks, decisions and completion together.",
    icon: CircleCheckBigIcon,
    color: "var(--brand-green)",
    ink: "color-mix(in srgb, var(--brand-green) 60%, var(--brand-charcoal))",
  },
];

type TimelinePoint = { x: number; y: number };
type TimelineSegment = { from: TimelinePoint; to: TimelinePoint };

function insetTimelinePoint(
  from: TimelinePoint,
  to: TimelinePoint,
  distance: number,
): TimelinePoint {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  if (!length) return from;
  const offset = Math.min(distance, length / 2) / length;
  return {
    x: from.x + (to.x - from.x) * offset,
    y: from.y + (to.y - from.y) * offset,
  };
}

// One marker follows the same path in either orientation, hiding behind nodes.
function timelineMarker(phase: number, segments: TimelineSegment[]) {
  if (!segments.length) return { x: 0, y: 0, opacity: 0 };
  const last = segments.length - 1;
  const stops = [
    insetTimelinePoint(segments[0].from, segments[0].to, 4),
    ...segments.slice(0, last).map((segment, index) => ({
      x: (segment.to.x + segments[index + 1].from.x) / 2,
      y: (segment.to.y + segments[index + 1].from.y) / 2,
    })),
    insetTimelinePoint(segments[last].to, segments[last].from, 4),
  ];
  const position = Math.max(0, Math.min(segments.length, phase));
  const index = Math.min(last, Math.floor(position));
  const progress = position - index;
  const point = {
    x: stops[index].x + (stops[index + 1].x - stops[index].x) * progress,
    y: stops[index].y + (stops[index + 1].y - stops[index].y) * progress,
  };
  let opacity = 0;
  for (const segment of segments) {
    const dx = segment.to.x - segment.from.x;
    const dy = segment.to.y - segment.from.y;
    const length = Math.hypot(dx, dy);
    if (!length) continue;
    const along =
      ((point.x - segment.from.x) * dx + (point.y - segment.from.y) * dy) /
      length;
    const across =
      Math.abs(
        (point.x - segment.from.x) * dy - (point.y - segment.from.y) * dx,
      ) / length;
    if (across < 0.5 && along >= 0 && along <= length) {
      opacity = Math.max(0, Math.min(1, along / 4, (length - along) / 4));
      break;
    }
  }
  return { ...point, opacity };
}

function OperatingTimeline() {
  const timelineId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visible = useInView(ref, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const phase = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [segments, setSegments] = useState<TimelineSegment[]>([]);
  const markerX = useTransform(
    phase,
    (value) => timelineMarker(value, segments).x,
  );
  const markerY = useTransform(
    phase,
    (value) => timelineMarker(value, segments).y,
  );
  const markerOpacity = useTransform(
    phase,
    (value) => timelineMarker(value, segments).opacity,
  );

  useMotionValueEvent(phase, "change", (value) => {
    const next = Math.min(
      OPERATING_STAGES.length - 1,
      Math.max(0, Math.round(value)),
    );
    setActive((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function measure() {
      const horizontal = window.innerWidth >= 1024;
      const bounds = track!.getBoundingClientRect();
      const icons = iconRefs.current.map((element) =>
        element?.getBoundingClientRect(),
      );
      const next: TimelineSegment[] = [];
      for (let index = 0; index < OPERATING_STAGES.length - 1; index += 1) {
        const from = icons[index];
        const to = icons[index + 1];
        if (!from || !to) return;
        if (horizontal) {
          const x1 = from.right - bounds.left + 10;
          const x2 = to.left - bounds.left - 10;
          if (x2 <= x1) return;
          const y = from.top - bounds.top + from.height / 2;
          next.push({ from: { x: x1, y }, to: { x: x2, y } });
        } else {
          const y1 = from.bottom - bounds.top + 10;
          const y2 = to.top - bounds.top - 10;
          if (y2 <= y1) return;
          const x = from.left - bounds.left + from.width / 2;
          next.push({ from: { x, y: y1 }, to: { x, y: y2 } });
        }
      }
      setSegments((current) =>
        JSON.stringify(current) === JSON.stringify(next) ? current : next,
      );
    }
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    iconRefs.current.forEach((icon) => {
      if (icon) observer.observe(icon);
    });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) {
      phase.set(0);
      return;
    }
    phase.set(0);
    // 2.2 seconds per forward stage, then 0.4 seconds per reverse stage.
    // Easing is applied independently between each pair of icon positions.
    const playback = animate(phase, [0, 1, 2, 3, 2, 1, 0], {
      duration: 7.8,
      times: [0, 2.2 / 7.8, 4.4 / 7.8, 6.6 / 7.8, 7 / 7.8, 7.4 / 7.8, 1],
      repeat: Infinity,
      repeatDelay: 0.25,
      ease: "easeInOut",
    });
    return () => playback.stop();
  }, [visible, reducedMotion, phase]);

  return (
    <div ref={ref} className={`${CONTAINER} py-12 sm:py-16`}>
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>From brief to delivery</Eyebrow>
            <h2 className="mt-3 text-lg font-medium tracking-[-0.025em] sm:text-2xl">
              Different expertise. One shared outcome.
            </h2>
          </div>
          <Link
            to={ROUTES.howItWorks}
            className={`pointer-events-auto relative z-10 inline-flex items-center gap-2 text-sm font-medium ${ACCENT}`}
          >
            See the process
            <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div
          data-paw-block="true"
          className="rounded-xl border border-border/55 bg-card p-5 sm:p-8"
        >
          <div ref={trackRef} className="relative">
            {segments.length > 0 && (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              >
                <defs>
                  {segments.map((segment, index) => (
                    <linearGradient
                      key={index}
                      id={`${timelineId}-connector-${index}`}
                      gradientUnits="userSpaceOnUse"
                      x1={segment.from.x}
                      y1={segment.from.y}
                      x2={segment.to.x}
                      y2={segment.to.y}
                    >
                      <stop
                        offset="0%"
                        stopColor={OPERATING_STAGES[index].color}
                      />
                      <stop
                        offset="100%"
                        stopColor={OPERATING_STAGES[index + 1].color}
                      />
                    </linearGradient>
                  ))}
                </defs>
                {segments.map((segment, index) => (
                  <line
                    key={index}
                    x1={segment.from.x}
                    x2={segment.to.x}
                    y1={segment.from.y}
                    y2={segment.to.y}
                    stroke={`url(#${timelineId}-connector-${index})`}
                    strokeWidth={1.5}
                    strokeOpacity={0.35}
                    strokeLinecap="round"
                  />
                ))}
                {!reducedMotion && (
                  <motion.circle
                    r={4}
                    cx={markerX}
                    cy={markerY}
                    fill="var(--brand-secondary-highlight)"
                    style={{ opacity: markerOpacity }}
                  />
                )}
              </svg>
            )}
            <ol className="grid grid-cols-1 gap-9 lg:grid-cols-4 lg:gap-8">
              {OPERATING_STAGES.map(
                ({ label, title, copy, icon: Icon, color, ink }, index) => (
                  <li
                    key={label}
                    className="relative grid grid-cols-[48px_minmax(0,1fr)] items-start gap-x-5 lg:block"
                  >
                    <div
                      ref={(element) => {
                        iconRefs.current[index] = element;
                      }}
                      className="relative z-10 h-12 w-12 rounded-full bg-card"
                    >
                      <motion.span
                        animate={{
                          scale: !reducedMotion && active === index ? 1.05 : 1,
                        }}
                        transition={{ duration: reducedMotion ? 0 : 0.45 }}
                        style={{
                          backgroundColor: `color-mix(in srgb, ${color} ${active === index ? 16 : 9}%, var(--card))`,
                          color: ink,
                          borderColor: `color-mix(in srgb, ${color} 24%, var(--card))`,
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full border"
                      >
                        <Icon size={20} aria-hidden="true" />
                      </motion.span>
                    </div>
                    <div className="min-w-0 pb-1 lg:mt-6 lg:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                          {label}
                        </p>
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: `color-mix(in srgb, ${color} 25%, var(--brand-charcoal))`,
                          }}
                        >
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-medium">{title}</h3>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        {copy}
                      </p>
                    </div>
                  </li>
                ),
              )}
            </ol>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {(
            [
              [BriefcaseBusinessIcon, "Advisory"],
              [HardHatIcon, "Construction"],
              [ZapIcon, "Technical services"],
              [ShieldCheckIcon, "Specialist expertise"],
            ] as const
          ).map(([Icon, label]) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-border/55 px-3 py-2"
            >
              <Icon size={14} className={ACCENT} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function ConnectedWorkPanel() {
  const steps = [
    ["Plan together", "Keep the outcome clear and aligned."],
    ["Collaborate with ease", "Share files, feedback and decisions."],
    [
      "Track progress",
      "See what is done, what is next and who is responsible.",
    ],
  ];
  return (
    <div
      className={`${CONTAINER} grid items-center gap-7 sm:gap-10 py-12 sm:py-16 lg:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16`}
    >
      <div>
        <Eyebrow>How it works</Eyebrow>
        <h2 className={`${HEADING} mt-4`}>The match is only the beginning.</h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Once the right people are involved, the same workspace keeps the
          project, responsibility and delivery connected.
        </p>
        <ol className="mt-8 space-y-6">
          {steps.map(([title, copy], i) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-secondary-highlight text-sm font-medium text-primary-foreground  ">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-medium tracking-[-0.02em]">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div
        data-paw-block="true"
        className="pointer-events-none relative grid min-w-0 gap-3 lg:block lg:pb-14 lg:pl-10 lg:pt-5"
      >
        <Photo src={IMAGES.connected} alt="People collaborating on a project" />
        <div
          className={`w-full lg:absolute lg:bottom-0 lg:left-0 lg:w-[min(82%,320px)] ${DEMO_CARD}`}
        >
          <ProgressBar label="Office fit-out" value={68} />
          <ul className="mt-4 space-y-2.5 text-xs sm:mt-5 sm:space-y-3">
            {[
              "Site assessment",
              "Electrical works",
              "Installation and handover",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckDot />
                {item}
              </li>
            ))}
          </ul>
          <DemoCaption />
        </div>
        <Floating className="absolute right-0 top-0 hidden max-w-[230px] lg:block">
          <CommentCard
            name="Daniel"
            text="The site assessment is complete. Ready for the next stage."
          />
        </Floating>
      </div>
    </div>
  );
}

function Photo({ src, alt }: { src: string; alt: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="aspect-[16/10] overflow-hidden lg:aspect-[1.12] rounded-xl bg-muted">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={reducedMotion ? false : { scale: 1.025 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className="h-full w-full object-cover saturate-[0.76]  "
      />
    </div>
  );
}

function ProgressBar({
  label,
  value,
  paper = false,
}: {
  label: string;
  value: number;
  paper?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4 text-xs font-medium">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${label} (illustrative)`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className={`h-2 overflow-hidden rounded-full ${paper ? "bg-surface-3" : "bg-primary-foreground/20 "}`}
      >
        <motion.div
          className="h-full rounded-full bg-brand-primary"
          initial={reducedMotion ? false : { width: "0%" }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={reducedMotion ? { width: `${value}%` } : undefined}
        />
      </div>
    </div>
  );
}

function DemoCaption() {
  return (
    <p className="mt-4 text-[10px] text-current opacity-65">
      Illustrative project workspace
    </p>
  );
}

function CommentCard({
  name,
  text,
  className = "",
}: {
  name: string;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 text-card-foreground shadow-none ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-medium text-foreground/65 ">
          {name[0]}
        </span>
        <div>
          <p className="text-xs font-medium leading-5">
            {name}
            <span className="ml-2 font-normal text-muted-foreground">
              Project comment
            </span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function ExecutionPanel() {
  return (
    <div
      className={`${CONTAINER} grid items-center gap-7 sm:gap-10 py-12 sm:py-16 lg:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16`}
    >
      <div>
        <Eyebrow dark>Built for real projects</Eyebrow>
        <h2 className={`${HEADING} mt-4`}>
          Keep people and progress moving together.
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
          From repairs and installations to advisory work and larger projects,
          keep the scope, responsibilities and next steps clear for everyone
          involved.
        </p>
        <div className="mt-8">
          <ActionLink to={ROUTES.howItWorks} onTeal>
            See how it works
          </ActionLink>
        </div>
      </div>
      <div
        data-paw-block="true"
        className="pointer-events-none relative grid min-w-0 gap-3 lg:block lg:pb-12 lg:pl-12 lg:pt-7"
      >
        <Photo
          src={IMAGES.delivery}
          alt="Skilled expert carrying out commercial project work"
        />
        <ProjectResponsibilityCard />
        <div
          className={`absolute bottom-0 left-0 hidden lg:block ${PAPER_CARD}`}
        >
          <div className="grid gap-3 text-xs">
            {(
              [
                [FileCheck2Icon, "Tasks"],
                [FileTextIcon, "Files"],
                [MessageSquareIcon, "Comments"],
                [UsersIcon, "People"],
              ] as const
            ).map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={17} className={ACCENT} aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
        <Floating
          className="absolute bottom-5 right-0 hidden max-w-[220px] lg:block"
          delay={1}
        >
          <CommentCard
            name="Alex"
            text="The team is ready for the site handover."
          />
        </Floating>
      </div>
    </div>
  );
}

function ProjectResponsibilityCard() {
  return (
    <div
      className={`relative w-full lg:absolute lg:left-0 lg:top-0 lg:z-20 lg:w-[min(82%,300px)] ${PAPER_CARD}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/[0.07] text-brand-secondary sm:h-9 sm:w-9">
          <UsersIcon size={17} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium">Clear responsibility</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Commercial installation
          </p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 border-t border-border/55 pt-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-1 lg:gap-4 lg:pt-4">
        <div>
          <p className="text-[10px] text-muted-foreground">Assigned expert</p>
          <p className="mt-1 text-xs font-medium leading-5">
            Tariro M. · Site coordinator
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <CalendarDaysIcon
            size={15}
            className="mt-0.5 shrink-0 text-brand-secondary"
            aria-hidden="true"
          />
          <div>
            <p className="text-[10px] text-muted-foreground">Next milestone</p>
            <p className="mt-1 text-xs leading-5">
              Site inspection and handover
            </p>
          </div>
        </div>
      </div>
      <DemoCaption />
    </div>
  );
}

function ProfilePanel({ allocatHref }: { allocatHref: string }) {
  return (
    <div
      className={`${CONTAINER} grid items-center gap-8 sm:gap-12 py-12 sm:py-16 lg:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16`}
    >
      <div
        data-paw-block="true"
        className="pointer-events-none relative order-2 grid min-w-0 gap-3 lg:order-1 lg:block lg:pb-14 lg:pr-16 lg:pt-4"
      >
        <Photo
          src={IMAGES.profile}
          alt="Professionals coordinating project delivery"
        />
        <div
          className={`relative w-full lg:absolute lg:right-0 lg:top-0 lg:w-[min(78%,280px)] ${PAPER_CARD}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-secondary-highlight/[0.07] text-sm font-medium text-brand-secondary-highlight  ">
              SC
            </span>
            <div>
              <h3 className="text-sm font-medium">Sarah Collins</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Project coordinator
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {["Coordination", "Site delivery", "Planning"].map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-border/55 px-2 py-1 text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">
            Example professional profile
          </p>
        </div>
        <div
          className={`absolute bottom-0 right-0 hidden w-[min(82%,290px)] lg:block ${PAPER_CARD}`}
        >
          <p className="text-xs font-medium leading-5">Project context</p>
          <div className="mt-4 space-y-4">
            {[
              "Completed a site assessment",
              "Coordinated installation work",
              "Prepared a project handover",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-xs">
                <CircleCheckBigIcon
                  size={17}
                  className={`shrink-0 ${ACCENT}`}
                  aria-hidden="true"
                />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="order-1 min-w-0 lg:order-2">
        <Eyebrow>Your story</Eyebrow>
        <h2 className={`${HEADING} mt-4`}>
          Let good work build your professional story.
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Bring your skills and experience into focus. As you take part in
          projects, your contributions add useful context to the work you do.
        </p>
        <div className="mt-8">
          <ActionLink to={allocatHref}>Build your profile</ActionLink>
        </div>
      </div>
    </div>
  );
}

const FAQS = [
  {
    question: "What is Allocatr?",
    answer:
      "Allocatr connects clients with skilled experts, tradespeople and professionals around work that needs doing. Capability, responsibility and progress remain attached to the project.",
  },
  {
    question: "How do I post a project?",
    answer:
      "Select Post a project. Sign in or create an account, then describe the work and the capability your project needs.",
  },
  {
    question: "How do I find the right people?",
    answer:
      "Browse Allocats and review their skills and professional context. Start with what the work needs, then consider the people whose capability fits.",
  },
  {
    question: "What kinds of experts can I look for?",
    answer:
      "Start with the capability your work needs: professional advice, project coordination, construction, technical services or another specialist trade. Browse the available profiles to find a suitable fit.",
  },
  {
    question: "What stays in the project workspace?",
    answer:
      "The workspace keeps project tasks, assigned responsibility, files, comments and progress connected so the people involved can follow the work.",
  },
  {
    question: "How do I become an Allocat?",
    answer:
      "Select Build your profile or Put your skills to work, then follow the Allocat setup process to present your skills and experience.",
  },
];

function FaqPanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`${CONTAINER} grid gap-9 py-12 sm:py-16 lg:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}
    >
      <div>
        <Eyebrow>FAQ</Eyebrow>
        <h2 className={`${HEADING} mt-4`}>Common questions</h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          A few things to know about working on Allocatr.
        </p>
      </div>
      <div className="space-y-2.5">
        {FAQS.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          const triggerId = `landing-faq-trigger-${index}`;
          const panelId = `landing-faq-panel-${index}`;
          return (
            <div
              key={question}
              className={`rounded-xl border border-border/55 transition-colors duration-300 motion-reduce:transition-none ${isOpen ? "bg-surface-teal" : "bg-surface-1"}`}
            >
              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                  className="pointer-events-auto relative z-10 flex w-full items-center justify-between gap-5 rounded-xl px-5 py-4 text-left text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {question}
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.28,
                      ease: "easeInOut",
                    }}
                    className={`shrink-0 ${ACCENT}`}
                  >
                    <ChevronDownIcon size={16} />
                  </motion.span>
                </button>
              </h3>
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 pt-1 text-[13px] font-normal leading-7 text-muted-foreground">
                  {answer}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClosingPanel({ postProjectHref }: { postProjectHref: string }) {
  return (
    <div className={`${CONTAINER} py-12 sm:py-16 lg:py-20`}>
      <div className="flex flex-col items-center text-center">
        <Eyebrow>Get started today</Eyebrow>
        <h2 className={`${HEADING} mt-4 max-w-[1000px]`}>
          Something needs doing.
          <br />
          <span className={ACCENT}>Put the right people around it.</span>
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Post a project, find the right capability and keep everything
          connected from start to finish.
        </p>
        <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <ActionLink to={postProjectHref}>Post a project</ActionLink>
          <ActionLink to={ROUTES.discover} secondary>
            Browse Allocats
          </ActionLink>
        </div>
      </div>
    </div>
  );
}
