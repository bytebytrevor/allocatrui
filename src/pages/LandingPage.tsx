import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
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
  "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 xl:px-20";
const HEADING =
  "text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.04em]";
const ACCENT = "text-brand-secondary-highlight ";
const PAPER_CARD =
  "rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_12px_40px_-20px_color-mix(in_srgb,var(--brand-charcoal)_28%,transparent)] sm:p-6";
const ACTION_BASE =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border px-5 py-3 text-[13px] font-medium pointer-events-auto relative z-10 transition-opacity duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const PRIMARY_BUTTON =
  "border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-[0.86] focus-visible:ring-brand-secondary-highlight/25       ";
const SECONDARY_BUTTON =
  "border-border/65 bg-surface-2/35 text-foreground hover:bg-surface-2/35 hover:text-foreground hover:opacity-[0.72] focus-visible:ring-brand-secondary-highlight/18       ";
const TEAL_BUTTON =
  "border-brand-primary/20 bg-brand-primary text-secondary-foreground hover:bg-brand-primary hover:text-secondary-foreground hover:opacity-[0.84] focus-visible:ring-brand-primary/30 focus-visible:ring-offset-primary";
const LANDING_LAYOUT = `
.allocatr-landing { --landing-viewport-height: 100vh; }
@supports (height: 100svh) { .allocatr-landing { --landing-viewport-height: 100svh; } }
@supports (height: 100dvh) { .allocatr-landing { --landing-viewport-height: 100dvh; } }
.allocatr-landing .landing-hero {
  min-height: max(0px, calc(var(--landing-viewport-height) - var(--landing-header-height, 64px)));
}
.allocatr-landing #landing-content { scroll-margin-top: var(--landing-header-height, 64px); }
@media (max-height: 800px) {
  .allocatr-landing .landing-hero-content { padding-top: 1.75rem; padding-bottom: 1.25rem; }
  .allocatr-landing .landing-hero-heading { margin-top: 1.25rem; font-size: clamp(2.35rem, 5vw, 4.25rem); }
  .allocatr-landing .landing-hero-copy { margin-top: 1rem; line-height: 1.75; }
  .allocatr-landing .landing-hero-actions { margin-top: 1.5rem; }
  .allocatr-landing .landing-hero-benefits { margin-top: 1.75rem; padding-top: 1rem; }
}
@media (max-width: 639px) and (max-height: 740px) {
  .allocatr-landing .landing-hero-content { padding-top: 1.25rem; padding-bottom: 1rem; }
  .allocatr-landing .landing-hero-heading { font-size: clamp(2.15rem, 9vw, 2.75rem); }
  .allocatr-landing .landing-hero-copy { font-size: 0.875rem; line-height: 1.65; }
  .allocatr-landing .landing-hero-actions { margin-top: 1.25rem; }
  .allocatr-landing .landing-hero-benefits { margin-top: 1.25rem; column-gap: 1rem; row-gap: 0.5rem; }
}
`;
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
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(header);
    if (header.firstElementChild) observer?.observe(header.firstElementChild);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const postProjectHref = user ? "/projects/new" : ROUTES.register;
  const allocatHref = user?.isAllocat ? "/projects" : ROUTES.becomeAllocat;
  const allocatLabel = user?.isAllocat ? "View my work" : "Become an Allocat";
  return (
    <div
      ref={pageRef}
      className="allocatr-landing isolate w-full bg-background text-foreground"
      style={
        {
          ...LANDING_TOKENS,
          "--landing-header-height": `${headerHeight}px`,
        } as CSSProperties
      }
    >
      <style>{LANDING_LAYOUT}</style>
      <a
        href="#landing-content"
        className="sr-only fixed left-4 top-4 z-[110] rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium text-brand-charcoal focus:not-sr-only"
      >
        Skip to content
      </a>
      {/* Keep navigation outside every transformed or animated section. */}
      <div
        ref={headerRef}
        className="sticky top-0 z-[100] w-full bg-background pointer-events-auto"
        style={HERO_TOKENS}
      >
        <SiteHeader />
      </div>
      <BlankSpacePaws rootRef={pageRef} />
      <main
        id="landing-content"
        tabIndex={-1}
        className="relative isolate w-full outline-none"
      >
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
          <ProfilePanel
            allocatHref={allocatHref}
            allocatLabel={
              user?.isAllocat ? "View my work" : "Build your profile"
            }
          />
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
/** Stationary surfaces keep scrolling and pointer targets stable. */
function SlidingSection({
  children,
  order,
  id,
  className = "",
}: {
  children: ReactNode;
  order: number;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      tabIndex={id ? -1 : undefined}
      aria-labelledby={id ? "choose-path-title" : undefined}
      data-paw-tone={className.includes("bg-primary") ? "dark" : undefined}
      className={`relative w-full border-t border-border/55 ${className}`}
      style={{
        zIndex: order,
        scrollMarginTop: "var(--landing-header-height, 64px)",
        outline: "none",
      }}
    >
      {children}
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
    <div className="inline-flex items-center gap-2.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-brand-primary" : "bg-brand-secondary-highlight "}`}
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
      className="landing-hero relative flex w-full flex-col overflow-hidden bg-background text-foreground"
      data-paw-tone="dark"
      style={HERO_TOKENS}
    >
      <HeroAtmosphere />
      <CatBackground />
      <div
        className={`${CONTAINER} landing-hero-content relative z-10 flex flex-1 flex-col items-center justify-center pb-7 pt-10 text-center sm:pb-9 sm:pt-14 lg:items-start lg:pb-12 lg:pt-16 lg:text-left`}
      >
        <Eyebrow dark>Work, better allocated</Eyebrow>
        <motion.h1
          id="landing-title"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="landing-hero-heading relative mt-6 max-w-[720px] text-balance text-[clamp(2.5rem,5.4vw,5rem)] font-medium leading-[1.04] tracking-[-0.045em] lg:max-w-[64%]"
        >
          Good work starts
          <br />
          with the right
          <br />
          <span className="text-brand-secondary-highlight">
            skilled people.
          </span>
        </motion.h1>
        <p className="landing-hero-copy mt-6 max-w-[470px] text-pretty text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:max-w-[44%]">
          Find experienced professionals, skilled tradespeople and specialists.
          Bring your team and your project together in one connected workspace.
        </p>
        <div className="landing-hero-actions mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
          <ActionLink to={postProjectHref} onTeal>
            Post a project
          </ActionLink>
          <ActionLink to={ROUTES.discover} onDark>
            Browse Allocats
          </ActionLink>
        </div>
        <div className="landing-hero-benefits mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border/60 pt-5 lg:mt-10 lg:justify-start">
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
/** An ordinary anchor stays usable before JavaScript loads. */
function HeroScrollCue() {
  const ref = useRef<HTMLAnchorElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  return (
    <div
      className="relative z-10 flex shrink-0 justify-center px-5 pb-5 pt-2 sm:pb-7"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <a
        ref={ref}
        href="#choose-your-path"
        aria-label="Scroll to Choose your path"
        onClick={(event) => {
          const target = document.getElementById("choose-your-path");
          if (!target) return;
          event.preventDefault();
          target.focus({ preventScroll: true });
          target.scrollIntoView({
            behavior: reducedMotion ? "instant" : "smooth",
            block: "start",
          });
        }}
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/80 bg-surface-2/30 text-brand-primary transition-colors hover:border-brand-primary/40 hover:bg-surface-3/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none"
      >
        <span className="flex items-center justify-center">
          <motion.span
            aria-hidden="true"
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
            className="flex"
          >
            <ChevronDownIcon size={18} strokeWidth={1.7} />
          </motion.span>
        </span>
      </a>
    </div>
  );
}
function CatBackground() {
  const [imageAvailable, setImageAvailable] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  if (!imageAvailable) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Contain preserves the ears and face. Lighten lets the photo's black
            backdrop merge with the hero without a rectangle behind the text.
            A single broad horizontal fade replaces the tight elliptical mask. */}
      <div
        className="absolute inset-0 mix-blend-lighten opacity-[0.18] sm:opacity-[0.32] lg:opacity-[0.76]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 12%, rgba(0,0,0,0.15) 32%, rgba(0,0,0,0.7) 56%, black 78%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 12%, rgba(0,0,0,0.15) 32%, rgba(0,0,0,0.7) 56%, black 78%)",
        }}
      >
        <motion.img
          src={HERO_CAT_IMAGE}
          srcSet={photoSrcSet(HERO_CAT_IMAGE)}
          sizes="100vw"
          width={2400}
          height={1600}
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageAvailable(false)}
          initial={false}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.2, ease: "easeOut" }}
          className="h-full w-full object-contain object-right"
        />
      </div>
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
      className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs"
    >
      <Icon
        size={15}
        strokeWidth={1.7}
        className="shrink-0 text-brand-primary"
        aria-hidden="true"
      />
      <span>{title}</span>
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
  rootRef: {
    readonly current: HTMLDivElement | null;
  };
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
      setSteps((current) => [...current.slice(-4), paw]);
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
        timer = window.setInterval(step, 280);
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
          animate={{ opacity: [0, 0.14, 0.09, 0], scale: [0.85, 1, 1, 0.96] }}
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
    <div className={`${CONTAINER} py-16 sm:py-20 lg:py-28`}>
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Eyebrow>Two ways to start</Eyebrow>
          <h2 id="choose-path-title" className={`${HEADING} mt-4`}>
            Choose your path
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            Find the right people for your project, or bring your skills to work
            that needs them.
          </p>
        </div>
        <div className="mt-10 grid gap-0 md:mt-14 md:grid-cols-2 md:gap-14 lg:gap-20">
          <Reveal className="h-full">
            <ChoiceCard
              title="For clients"
              copy="Describe what needs doing. Find skilled people and keep the work connected from start to finish."
              href={postProjectHref}
              action="Post a project"
            />
          </Reveal>
          <Reveal className="h-full" delay={0.08}>
            <ChoiceCard
              title="For skilled experts"
              copy="Show what you do well. Find relevant projects and build your professional reputation through good work."
              href={allocatHref}
              action={allocatLabel}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
function ChoiceCard({
  title,
  copy,
  href,
  action,
}: {
  title: string;
  copy: string;
  href: string;
  action: string;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col items-start border-t border-border/65 py-8 sm:py-10">
      <h3 className="text-2xl font-medium tracking-[-0.035em] sm:text-[1.75rem]">
        {title}
      </h3>
      <p className="mb-7 mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-[15px]">
        {copy}
      </p>
      <Link
        to={href}
        className="group mt-auto inline-flex min-h-12 items-center gap-3 rounded-md text-[13px] font-medium text-brand-secondary-highlight transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none"
      >
        {action}
        <ArrowRightIcon
          size={17}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
        />
      </Link>
    </article>
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
type TimelinePoint = {
  x: number;
  y: number;
};
type TimelineSegment = {
  from: TimelinePoint;
  to: TimelinePoint;
};
// Distance-based interpolation keeps one speed across unequal stage spacing.
// The marker is rendered above the icons, so it never disappears at a stage.
function timelineMarker(phase: number, segments: TimelineSegment[]) {
  if (!segments.length) return { x: 0, y: 0 };
  const lengths = segments.map(({ from, to }) =>
    Math.hypot(to.x - from.x, to.y - from.y),
  );
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance =
    (Math.max(0, Math.min(segments.length, phase)) / segments.length) * total;
  for (let index = 0; index < segments.length; index += 1) {
    const { from, to } = segments[index];
    const length = lengths[index];
    if (distance <= length || index === segments.length - 1) {
      const progress = length ? Math.min(1, distance / length) : 0;
      return {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      };
    }
    distance -= length;
  }
  return segments[segments.length - 1].to;
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
        const fromCenter = {
          x: from.left - bounds.left + from.width / 2,
          y: from.top - bounds.top + from.height / 2,
        };
        const toCenter = {
          x: to.left - bounds.left + to.width / 2,
          y: to.top - bounds.top + to.height / 2,
        };
        if (
          horizontal ? toCenter.x <= fromCenter.x : toCenter.y <= fromCenter.y
        )
          return;
        next.push({ from: fromCenter, to: toCenter });
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
    const playback = animate(phase, [0, OPERATING_STAGES.length - 1], {
      duration: 6.6,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 0,
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
            className={`pointer-events-auto relative z-10 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${ACCENT}`}
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
              </svg>
            )}
            {segments.length > 0 && !reducedMotion && (
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
              >
                <motion.circle
                  r={4}
                  cx={markerX}
                  cy={markerY}
                  fill="var(--brand-secondary-highlight)"
                  stroke="var(--card)"
                  strokeWidth={2}
                />
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
      className={`${CONTAINER} grid items-center gap-7 sm:gap-10 py-12 sm:py-16 lg:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16`}
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
      <Reveal className="min-w-0">
        <WorkspacePreview />
      </Reveal>
    </div>
  );
}
/** A static example, deliberately presented without nonfunctional controls. */
function WorkspacePreview() {
  const lanes = [
    {
      title: "To do",
      tasks: [
        {
          title: "Prepare handover pack",
          person: "Alex",
          initials: "AK",
          label: "Documentation",
        },
      ],
    },
    {
      title: "In progress",
      tasks: [
        {
          title: "Electrical installation",
          person: "Daniel",
          initials: "DM",
          label: "Site works",
        },
      ],
    },
    {
      title: "Done",
      tasks: [
        {
          title: "Site assessment",
          person: "Tariro",
          initials: "TM",
          label: "Planning",
        },
      ],
    },
  ];
  return (
    <figure
      data-paw-block="true"
      className="min-w-0 rounded-2xl border border-border/80 bg-card p-2 shadow-[0_24px_64px_-32px_color-mix(in_srgb,var(--brand-secondary)_30%,transparent)] sm:p-3"
    >
      <div className="overflow-hidden rounded-xl border border-border/65">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-surface-2/50 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
            Project workspace
          </span>
          <span className="text-[9px] text-muted-foreground">
            Illustrative preview
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground">
                Commercial installation
              </p>
              <h3 className="mt-1 text-base font-medium tracking-[-0.02em]">
                Office fit-out
              </h3>
            </div>
            <span className="rounded-md bg-surface-teal px-2 py-1 text-[9px] font-medium text-brand-secondary">
              In progress
            </span>
          </div>
          <div className="mt-5">
            <ProgressBar label="Project progress" value={68} paper />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {lanes.map((lane, index) => (
              <div
                key={lane.title}
                className="min-w-0 rounded-lg bg-surface-2/65 p-2.5"
              >
                <p className="mb-3 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${index === 2 ? "bg-brand-secondary" : index === 1 ? "bg-brand-amber" : "bg-border"}`}
                    />
                    {lane.title}
                  </span>
                  <span>1</span>
                </p>
                {lane.tasks.map((task) => (
                  <div
                    key={task.title}
                    className="rounded-lg border border-border/70 bg-card p-3"
                  >
                    <p className="text-[9px] text-muted-foreground">
                      {task.label}
                    </p>
                    <h4 className="mt-2 min-h-10 text-[11px] font-medium leading-5">
                      {task.title}
                    </h4>
                    <div className="mt-3 flex items-center gap-1.5 border-t border-border/55 pt-3">
                      <span
                        aria-hidden="true"
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-teal text-[8px] font-medium text-brand-secondary"
                      >
                        {task.initials}
                      </span>
                      <span className="truncate text-[9px] text-muted-foreground">
                        {task.person}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border/60 px-3 py-3">
            <MessageSquareIcon
              size={14}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-brand-secondary"
            />
            <div>
              <p className="text-[10px] font-medium">Project messaging</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                Tariro: Site assessment complete. The team can move to
                installation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-center text-[10px] leading-5 text-muted-foreground">
        People, tasks and conversations. The context stays with the project.
      </figcaption>
    </figure>
  );
}
function photoSrcSet(src: string) {
  return [480, 800, 1200, 1600, 2400]
    .map((width) => `${src.replace(/([?&])w=\d+/, `$1w=${width}`)} ${width}w`)
    .join(", ");
}
function Photo({ src, alt }: { src: string; alt: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="aspect-[16/10] overflow-hidden lg:aspect-[1.12] rounded-2xl bg-muted">
      <motion.img
        src={src}
        srcSet={photoSrcSet(src)}
        sizes="(min-width: 1440px) 560px, (min-width: 1024px) 45vw, 90vw"
        width={1200}
        height={1000}
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
          className={`h-full rounded-full ${paper ? "bg-brand-secondary" : "bg-brand-primary"}`}
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
function ExecutionPanel() {
  return (
    <div
      className={`${CONTAINER} grid items-center gap-7 sm:gap-10 py-12 sm:py-16 lg:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16`}
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
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[11px] text-primary-foreground/75">
          {(
            [
              [FileCheck2Icon, "Tasks"],
              [FileTextIcon, "Files"],
              [MessageSquareIcon, "Messaging"],
              [UsersIcon, "People"],
            ] as const
          ).map(([Icon, label]) => (
            <span key={label} className="inline-flex items-center gap-2">
              <Icon size={14} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
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
  allocatLabel,
}: {
  allocatHref: string;
  allocatLabel: string;
}) {
  return (
    <div
      className={`${CONTAINER} grid items-center gap-8 sm:gap-12 py-12 sm:py-16 lg:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16`}
    >
      <div
        data-paw-block="true"
        className="pointer-events-none relative order-2 grid min-w-0 gap-3 lg:order-1 lg:block lg:pb-20 lg:pr-14 lg:pt-8"
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
          <ActionLink to={allocatHref}>{allocatLabel}</ActionLink>
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
      "The workspace keeps project tasks, assigned responsibility, files, comments, messaging and progress connected so the people involved can follow the work.",
  },
  {
    question: "How do I become an Allocat?",
    answer:
      "Select Become an Allocat or Build your profile, then follow the Allocat setup process to present your skills and experience.",
  },
];
function FaqPanel() {
  const faqId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  return (
    <div
      className={`${CONTAINER} grid gap-9 py-12 sm:py-16 lg:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}
    >
      <div>
        <Eyebrow>FAQ</Eyebrow>
        <h2 className={`${HEADING} mt-4`}>Common questions</h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          A few things to know about working on Allocatr.
        </p>
      </div>
      <div className="border-t border-border">
        {FAQS.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          const triggerId = `${faqId}-trigger-${index}`;
          const panelId = `${faqId}-panel-${index}`;
          return (
            <div
              key={question}
              className={`border-b border-border/80 transition-colors duration-150 motion-reduce:transition-none ${isOpen ? "bg-surface-teal/60" : "bg-transparent"}`}
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
                  className="pointer-events-auto relative z-10 flex w-full items-center justify-between gap-5 rounded-md px-3 py-5 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <p className="px-3 pb-6 pt-0 text-[13px] font-normal leading-7 text-muted-foreground">
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
    <div className={`${CONTAINER} py-12 sm:py-16 lg:py-24`}>
      <div className="flex flex-col items-center rounded-2xl border border-border/65 bg-card px-6 py-14 text-center shadow-[0_16px_48px_-32px_color-mix(in_srgb,var(--brand-charcoal)_18%,transparent)] sm:px-12 sm:py-20">
        <Eyebrow>Get started today</Eyebrow>
        <h2 className={`${HEADING} mt-5 max-w-[900px]`}>
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
