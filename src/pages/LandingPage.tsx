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
  becomeAllocat: "/register",
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
const TIMELINE_TOKENS = {
  colorScheme: "dark",
  "--background": "var(--brand-secondary)",
  "--foreground": "var(--primary-foreground)",
  "--card":
    "color-mix(in srgb, var(--brand-secondary) 88%, var(--brand-charcoal))",
  "--card-foreground": "var(--primary-foreground)",
  "--muted-foreground":
    "color-mix(in srgb, var(--primary-foreground) 76%, var(--brand-secondary))",
  "--border":
    "color-mix(in srgb, var(--primary-foreground) 18%, var(--brand-secondary))",
  "--brand-secondary-highlight": "var(--brand-primary)",
} as CSSProperties;

const CONTAINER =
  "mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-14 xl:px-20";
const HEADING =
  "text-[clamp(1.9rem,3vw,3.1rem)] font-medium leading-[1.12] tracking-[-0.035em]";
const ACCENT = "text-brand-secondary-highlight ";
const DEMO_CARD =
  "rounded-xl border border-primary/15 bg-primary p-4 text-primary-foreground shadow-none sm:p-5 lg:p-6";
const PAPER_CARD =
  "rounded-xl border border-border/55 bg-card p-4 text-card-foreground shadow-none sm:p-5 lg:p-6";
const ACTION_BASE =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border px-5 py-3 text-[13px] font-medium shadow-none pointer-events-auto relative z-10 transition-[background-color,border-color,color,opacity] duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const PRIMARY_BUTTON =
  "border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90 focus-visible:ring-brand-secondary-highlight/25       ";
const SECONDARY_BUTTON =
  "border-border/75 bg-surface-1 text-foreground/85 hover:bg-surface-2 hover:text-foreground focus-visible:ring-brand-secondary-highlight/25       ";
const TEAL_BUTTON =
  "border-brand-primary/20 bg-brand-primary text-secondary-foreground hover:bg-brand-primary hover:text-secondary-foreground hover:opacity-90 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-primary";

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
  const postProjectHref = user
    ? "/projects/new"
    : `${ROUTES.register}?returnTo=${encodeURIComponent("/projects/new")}`;
  const allocatHref = user ? "/projects" : ROUTES.becomeAllocat;
  const profileHref = user
    ? user.isAllocat
      ? "/allocats/profile"
      : "/profile"
    : ROUTES.register;
  const allocatLabel = user?.isAllocat
    ? "View my work"
    : user
      ? "Open my workspace"
      : "Become an Allocat";

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
        <SlidingSection
          order={1}
          id="choose-your-path"
          className="bg-surface-1"
        >
          <AdventurePanel
            postProjectHref={postProjectHref}
            allocatHref={allocatHref}
            allocatLabel={allocatLabel}
          />
        </SlidingSection>
        <SlidingSection
          order={2}
          className="bg-primary text-primary-foreground"
          style={TIMELINE_TOKENS}
        >
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
          <ProfilePanel allocatHref={profileHref} signedIn={Boolean(user)} />
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
  style,
  id,
}: {
  children: ReactNode;
  order: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
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
      id={id}
      tabIndex={id ? -1 : undefined}
      data-paw-tone={className.includes("bg-primary") ? "dark" : undefined}
      className={`relative w-full border-t border-border/55 focus:outline-none ${className}`}
      style={{
        ...style,
        zIndex: order,
        scrollMarginTop: id
          ? "calc(var(--landing-header-height, 64px) + 1rem)"
          : undefined,
      }}
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
  center = false,
}: {
  children: ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 ${center ? "justify-center" : ""}`}
    >
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
      aria-labelledby="landing-title"
      className="relative flex min-h-[calc(100svh-var(--landing-header-height))] w-full flex-col overflow-hidden bg-background text-foreground"
      data-paw-tone="dark"
      style={HERO_TOKENS}
    >
      <HeroAtmosphere />
      <CatBackground />
      <div
        className={`${CONTAINER} relative z-10 flex flex-1 flex-col items-start justify-center pb-8 pt-10 text-left sm:pb-9 sm:pt-14 lg:pb-10 lg:pt-16`}
      >
        <Eyebrow dark>Work, better allocated</Eyebrow>
        <motion.h1
          id="landing-title"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 max-w-[760px] text-[clamp(2.1rem,4.6vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.04em] lg:max-w-[64%]"
        >
          Good work starts
          <br />
          with the right
          <br />
          <span className="text-brand-secondary-highlight">
            skilled people.
          </span>
        </motion.h1>
        <p className="mt-6 max-w-[480px] text-pretty text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:max-w-[44%]">
          Find experienced professionals, skilled tradespeople and specialists.
          Bring your team and your project together in one connected workspace.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap">
          <ActionLink to={postProjectHref} onTeal>
            Post a project
          </ActionLink>
          <ActionLink to={ROUTES.discover} onDark>
            Browse Allocats
          </ActionLink>
        </div>
        <div className="mt-10 hidden max-w-[760px] flex-wrap items-center sm:flex gap-x-6 gap-y-3 pt-6 lg:mt-12">
          <HeroBenefit
            icon={BriefcaseBusinessIcon}
            title="Professional expertise"
          />
          <HeroBenefit icon={HardHatIcon} title="Skilled trades" />
          <HeroBenefit icon={UsersIcon} title="One shared workspace" />
        </div>
      </div>
      <HeroScrollCue />
    </section>
  );
}

function HeroScrollCue() {
  const ref = useRef<HTMLAnchorElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  return (
    <div
      className="relative z-10 flex shrink-0 justify-center px-5 pb-5 pt-2 sm:pb-6"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <a
        ref={ref}
        href="#choose-your-path"
        aria-label="Scroll to Choose your path"
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const target = document.getElementById("choose-your-path");
          if (!target) return;
          event.preventDefault();
          target.focus({ preventScroll: true });
          target.scrollIntoView({
            behavior: reducedMotion ? "instant" : "smooth",
            block: "start",
          });
        }}
        className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/25 bg-primary-foreground/[0.035] text-brand-primary transition-colors hover:border-brand-primary/40 hover:bg-primary-foreground/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none"
      >
        <motion.span
          aria-hidden="true"
          className="flex"
          animate={visible && !reducedMotion ? { y: [0, 4, 0] } : { y: 0 }}
          transition={
            visible && !reducedMotion
              ? {
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        >
          <ChevronDownIcon size={18} strokeWidth={1.7} />
        </motion.span>
      </a>
    </div>
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
      {/* A broad tonal veil keeps the left-aligned content readable beside the photograph. */}
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
      className="flex min-w-0 items-center gap-2.5 px-1 py-1"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/[0.08] text-brand-primary ring-1 ring-inset ring-brand-primary/15   ">
        <Icon size={16} aria-hidden="true" />
      </span>
      <span className="text-[11px] font-medium leading-5">{title}</span>
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
          animate={{ opacity: [0, 0.15, 0.1, 0], scale: [0.85, 1, 1, 0.96] }}
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
    <div className={`${CONTAINER} py-16 sm:py-20 lg:py-24`}>
      <div className="text-center">
        <Eyebrow center>Two ways to start</Eyebrow>
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
    <article className="grid h-full overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground sm:grid-cols-[1.12fr_0.88fr]">
      <div className="flex flex-col items-start p-5 sm:p-6 xl:p-8">
        <h3 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {copy}
        </p>
        <ul className="mb-7 mt-6 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-sm leading-6"
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
    color: "var(--brand-secondary)",
  },
  {
    label: "Shape",
    title: "Identify the capability.",
    copy: "Understand the practical skills and expertise the work requires.",
    icon: WrenchIcon,
    color: "var(--brand-amber)",
  },
  {
    label: "Allocate",
    title: "Find the right fit.",
    copy: "Bring in skilled people who can take responsibility.",
    icon: UsersIcon,
    color: "var(--brand-cyan)",
  },
  {
    label: "Deliver",
    title: "Keep the work connected.",
    copy: "Follow the tasks, decisions and completion together.",
    icon: CircleCheckBigIcon,
    color: "var(--brand-green)",
  },
];

type TimelinePoint = { x: number; y: number };
type TimelineSegment = { from: TimelinePoint; to: TimelinePoint };
const TIMELINE_TRAVEL_SECONDS = 1.3;
const TIMELINE_NODE_PAUSE_MS = 1000;
const TIMELINE_BOUNCE_SECONDS = 0.72;
const TIMELINE_REWIND_SECONDS = 1.25;

function TimelineConnector({
  segment,
  index,
  progress,
  gradientId,
}: {
  segment: TimelineSegment;
  index: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  gradientId: string;
}) {
  const length = Math.hypot(
    segment.to.x - segment.from.x,
    segment.to.y - segment.from.y,
  );
  const offset = useTransform(
    progress,
    (value) => length * (1 - Math.max(0, Math.min(1, value - index))),
  );
  const opacity = useTransform(progress, (value) => (value > index ? 1 : 0));
  return (
    <g>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={segment.from.x}
          y1={segment.from.y}
          x2={segment.to.x}
          y2={segment.to.y}
        >
          <stop offset="0%" stopColor={OPERATING_STAGES[index].color} />
          <stop offset="100%" stopColor={OPERATING_STAGES[index + 1].color} />
        </linearGradient>
      </defs>
      <line
        x1={segment.from.x}
        y1={segment.from.y}
        x2={segment.to.x}
        y2={segment.to.y}
        stroke="var(--border)"
        strokeOpacity={1}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <motion.line
        data-timeline-fill={index}
        x1={segment.from.x}
        y1={segment.from.y}
        x2={segment.to.x}
        y2={segment.to.y}
        stroke={`url(#${gradientId})`}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${length} ${length}`}
        style={{ strokeDashoffset: offset, opacity }}
      />
    </g>
  );
}

function OperatingTimeline() {
  const timelineId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visible = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [reached, setReached] = useState(-1);
  const [arrival, setArrival] = useState({ index: -1, sequence: 0 });
  const [segments, setSegments] = useState<TimelineSegment[]>([]);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.max(
      0,
      Math.min(OPERATING_STAGES.length - 1, Math.floor(value)),
    );
    setReached((current) => (current === next ? current : next));
  });
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function measure() {
      const horizontal = window.matchMedia("(min-width: 1024px)").matches;
      const bounds = track!.getBoundingClientRect();
      const icons = iconRefs.current.map((element) =>
        element?.getBoundingClientRect(),
      );
      const next: TimelineSegment[] = [];
      for (let index = 0; index < OPERATING_STAGES.length - 1; index++) {
        const from = icons[index],
          to = icons[index + 1];
        if (!from || !to) return;
        if (horizontal) {
          const x1 = from.right - bounds.left + 7;
          const x2 = to.left - bounds.left - 7;
          if (x2 <= x1) return;
          const y = from.top - bounds.top + from.height / 2;
          next.push({ from: { x: x1, y }, to: { x: x2, y } });
        } else {
          const y1 = from.bottom - bounds.top + 7;
          const y2 = to.top - bounds.top - 7;
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
    if (reducedMotion) {
      progress.set(OPERATING_STAGES.length - 1);
      setReached(OPERATING_STAGES.length - 1);
      setArrival((current) => ({ ...current, index: -1 }));
      return;
    }
    if (!visible || hidden || !segments.length) {
      progress.set(0);
      setReached(-1);
      setArrival((current) => ({ ...current, index: -1 }));
      return;
    }
    let stopped = false;
    let playback: ReturnType<typeof animate> | undefined;
    let pauseTimer: number | undefined;
    let releaseStop: () => void = () => {};
    const stopSignal = new Promise<void>((resolve) => {
      releaseStop = resolve;
    });
    function arrive(index: number) {
      setReached(index);
      setArrival((current) => ({ index, sequence: current.sequence + 1 }));
    }
    async function pause() {
      await Promise.race([
        new Promise<void>((resolve) => {
          pauseTimer = window.setTimeout(
            resolve,
            TIMELINE_BOUNCE_SECONDS * 1000 + TIMELINE_NODE_PAUSE_MS,
          );
        }),
        stopSignal,
      ]);
      if (pauseTimer !== undefined) window.clearTimeout(pauseTimer);
      pauseTimer = undefined;
    }
    async function fillTo(value: number, duration: number) {
      playback = animate(progress, value, { duration, ease: "easeInOut" });
      await Promise.race([Promise.resolve(playback), stopSignal]);
    }
    async function loop() {
      progress.set(0);
      while (!stopped) {
        arrive(0);
        await pause();
        for (
          let stage = 1;
          stage < OPERATING_STAGES.length && !stopped;
          stage++
        ) {
          await fillTo(stage, TIMELINE_TRAVEL_SECONDS);
          if (stopped) return;
          arrive(stage);
          await pause();
        }
        if (stopped) return;
        // One continuous reverse: no repeated node bounces on the way back.
        setArrival((current) => ({ ...current, index: -1 }));
        await fillTo(0, TIMELINE_REWIND_SECONDS);
      }
    }
    void loop();
    return () => {
      stopped = true;
      playback?.stop();
      if (pauseTimer !== undefined) window.clearTimeout(pauseTimer);
      releaseStop();
    };
  }, [visible, hidden, reducedMotion, progress, segments.length]);

  return (
    <div ref={ref} className={`${CONTAINER} py-16 sm:py-20 lg:py-24`}>
      <Reveal>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6 lg:mb-12">
          <div className="max-w-2xl">
            <Eyebrow dark>From brief to delivery</Eyebrow>
            <h2 className={`${HEADING} mt-4 text-primary-foreground`}>
              Different expertise.
              <br className="hidden sm:block" /> One shared outcome.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-primary-foreground/75">
              A clear brief. The right capability. A shared plan for getting the
              work done.
            </p>
          </div>
          <Link
            to={ROUTES.howItWorks}
            className="relative z-10 inline-flex min-h-11 items-center gap-3 rounded-lg border border-primary-foreground/25 bg-primary-foreground/[0.04] px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none"
          >
            See the process
            <ArrowRightIcon size={15} aria-hidden="true" />
          </Link>
        </div>
        <div
          data-paw-block="true"
          style={LANDING_TOKENS}
          className="rounded-2xl border border-border/60 bg-card px-5 py-7 text-card-foreground sm:px-8 sm:py-9 lg:px-10 lg:py-10"
        >
          <div ref={trackRef} className="relative">
            {segments.length > 0 && (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              >
                {segments.map((segment, index) => (
                  <TimelineConnector
                    key={index}
                    segment={segment}
                    index={index}
                    progress={progress}
                    gradientId={`${timelineId}-stage-${index}`}
                  />
                ))}
              </svg>
            )}
            <ol
              aria-label="From brief to delivery"
              className="grid grid-cols-1 gap-9 lg:grid-cols-4 lg:gap-9"
            >
              {OPERATING_STAGES.map(
                ({ label, title, copy, icon: Icon, color }, index) => {
                  const complete = reducedMotion || reached >= index;
                  const bounce = !reducedMotion && arrival.index === index;
                  return (
                    <li
                      key={label}
                      className="relative grid grid-cols-[56px_minmax(0,1fr)] items-start gap-x-5 lg:flex lg:flex-col lg:items-center lg:text-center"
                    >
                      <div
                        ref={(element) => {
                          iconRefs.current[index] = element;
                        }}
                        className="relative z-10 h-14 w-14 shrink-0 rounded-full bg-card"
                      >
                        <motion.span
                          key={`${label}-${bounce ? arrival.sequence : 0}`}
                          data-timeline-node={label}
                          initial={false}
                          animate={
                            bounce
                              ? {
                                  scale: [1, 1.16, 0.97, 1.025, 1],
                                  y: [0, -4, 0, -1, 0],
                                }
                              : { scale: 1, y: 0 }
                          }
                          transition={
                            bounce
                              ? {
                                  duration: TIMELINE_BOUNCE_SECONDS,
                                  times: [0, 0.3, 0.58, 0.8, 1],
                                  ease: "easeInOut",
                                }
                              : { duration: 0 }
                          }
                          style={{
                            backgroundColor: `color-mix(in srgb, ${color} ${complete ? 15 : 5}%, var(--card))`,
                            borderColor: `color-mix(in srgb, ${color} ${complete ? 48 : 22}%, var(--card))`,
                            color: `color-mix(in srgb, ${color} 65%, var(--brand-charcoal))`,
                          }}
                          className="flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300 motion-reduce:transition-none"
                        >
                          <Icon
                            size={22}
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                        </motion.span>
                      </div>
                      <div className="min-w-0 pb-1 lg:mt-6 lg:pb-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
                          <span
                            className="mr-2 tabular-nums"
                            style={{
                              color: `color-mix(in srgb, ${color} 60%, var(--brand-charcoal))`,
                            }}
                          >
                            0{index + 1}
                          </span>
                          {label}
                        </p>
                        <h3 className="mt-2.5 text-sm font-medium leading-6 text-foreground sm:text-base">
                          {title}
                        </h3>
                        <p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                          {copy}
                        </p>
                      </div>
                    </li>
                  );
                },
              )}
            </ol>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/75">
          {(
            [
              [BriefcaseBusinessIcon, "Advisory"],
              [HardHatIcon, "Construction"],
              [ZapIcon, "Technical services"],
              [ShieldCheckIcon, "Specialist expertise"],
            ] as const
          ).map(([Icon, label]) => (
            <span key={label} className="flex items-center gap-2">
              <Icon
                size={14}
                className="text-brand-primary"
                aria-hidden="true"
              />
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
      className={`${CONTAINER} grid items-center gap-7 sm:gap-10 py-16 sm:py-20 lg:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16`}
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
    <div className="aspect-[16/10] overflow-hidden lg:aspect-[1.12] rounded-2xl bg-muted">
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
      className={`${CONTAINER} grid items-center gap-7 sm:gap-10 py-16 sm:py-20 lg:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16`}
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

function ProfilePanel({
  allocatHref,
  signedIn,
}: {
  allocatHref: string;
  signedIn: boolean;
}) {
  return (
    <div
      className={`${CONTAINER} grid items-center gap-8 sm:gap-12 py-16 sm:py-20 lg:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16`}
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
            Illustrative professional profile
          </p>
        </div>
        <div
          className={`absolute bottom-0 right-0 hidden w-[min(82%,290px)] lg:block ${PAPER_CARD}`}
        >
          <p className="text-xs font-medium leading-5">
            Example project context
          </p>
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
          <ActionLink to={allocatHref}>
            {signedIn ? "Manage your profile" : "Build your profile"}
          </ActionLink>
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
      "Select Become an Allocat or Build your profile. Choose an Allocat account during registration, confirm your email and complete your professional profile.",
  },
];

function FaqPanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`${CONTAINER} grid gap-9 py-16 sm:py-20 lg:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}
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
                  className="pointer-events-auto relative z-10 flex w-full items-center justify-between gap-5 rounded-xl px-5 py-4 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <p className="px-5 pb-5 pt-1 text-sm font-normal leading-7 text-muted-foreground">
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
    <div className={`${CONTAINER} py-16 sm:py-20 lg:py-24`}>
      <div className="flex flex-col items-center text-center">
        <Eyebrow center>Get started today</Eyebrow>
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
