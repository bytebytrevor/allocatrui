import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  FileCheck2Icon,
  FileTextIcon,
  HammerIcon,
  HardHatIcon,
  Layers3Icon,
  MapPinIcon,
  MessageSquareIcon,
  PaintbrushIcon,
  SearchIcon,
  SendIcon,
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
   BRAND
========================================================= */

const primaryButton = [
  "border border-[#DEDA00]",
  "bg-[#DEDA00] text-[#202020]",
  "shadow-[0_16px_42px_-24px_rgba(222,218,0,0.72)]",
  "hover:border-[#d4d000] hover:bg-[#d4d000] hover:text-[#202020]",
].join(" ");

const outlineButton = [
  "border-white/[0.12] bg-white/[0.03] text-white",
  "hover:border-white/[0.19] hover:bg-white/[0.06] hover:text-white",
].join(" ");

/* =========================================================
   PROFILE MEDIA
========================================================= */

type AvatarKey = "tawanda" | "leroy" | "kuda" | "tatenda";

const profileAvatars: Record<AvatarKey, string> = {
  tawanda:
    "https://images.pexels.com/photos/34592823/pexels-photo-34592823.jpeg?auto=compress&cs=tinysrgb&w=320",
  leroy:
    "https://images.pexels.com/photos/20595361/pexels-photo-20595361/free-photo-of-portrait-of-a-man-smiling.jpeg?auto=compress&cs=tinysrgb&w=320",
  kuda:
    "https://images.pexels.com/photos/18744477/pexels-photo-18744477/free-photo-of-portrait-of-an-african-man.jpeg?auto=compress&cs=tinysrgb&w=320",
  tatenda:
    "https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg?auto=compress&cs=tinysrgb&w=320",
};

/* =========================================================
   DATA
========================================================= */

const lifecycleStages = [
  {
    number: "01",
    label: "Pending",
    title: "Project created",
    description: "The brief, schedule and required skills are defined.",
    signal: "pending" as const,
  },
  {
    number: "02",
    label: "Allocated",
    title: "Team accepted",
    description: "The right people join the project and work can begin.",
    signal: "allocated" as const,
  },
  {
    number: "03",
    label: "Active",
    title: "Work moving",
    description: "Tasks, ownership, deadlines and progress stay visible.",
    signal: "active" as const,
  },
  {
    number: "04",
    label: "Complete",
    title: "Client confirmed",
    description: "Finished work is reviewed and the project formally closes.",
    signal: "complete" as const,
  },
];

const allocationRoles = [
  {
    icon: ZapIcon,
    role: "Electrical",
    person: "Tawanda M.",
    avatar: "tawanda" as AvatarKey,
    title: "Electrical specialist",
    experience: "8 years experience",
    tone: "amber" as const,
    rotation: -6,
  },
  {
    icon: HammerIcon,
    role: "Carpentry",
    person: "Leroy N.",
    avatar: "leroy" as AvatarKey,
    title: "Carpenter & joiner",
    experience: "6 years experience",
    tone: "lime" as const,
    rotation: -2,
  },
  {
    icon: PaintbrushIcon,
    role: "Painting",
    person: "Kuda M.",
    avatar: "kuda" as AvatarKey,
    title: "Painter & finisher",
    experience: "5 years experience",
    tone: "green" as const,
    rotation: 3,
  },
  {
    icon: HardHatIcon,
    role: "Construction",
    person: "Tatenda R.",
    avatar: "tatenda" as AvatarKey,
    title: "Construction specialist",
    experience: "7 years experience",
    tone: "teal" as const,
    rotation: 7,
  },
];

const workCategories = [
  {
    icon: ZapIcon,
    title: "Electrical",
    detail: "Wiring · lighting · installations · fault finding",
    iconClass: "text-[#F0A23A]",
    surface: "bg-[#F0A23A]/[0.10]",
    signal: "bg-[#F0A23A]",
  },
  {
    icon: HammerIcon,
    title: "Carpentry & joinery",
    detail: "Cabinetry · furniture · fittings · repairs",
    iconClass: "text-[#DEDA00]",
    surface: "bg-[#DEDA00]/[0.08]",
    signal: "bg-[#DEDA00]",
  },
  {
    icon: HardHatIcon,
    title: "Construction",
    detail: "Building · renovations · tiling · structural work",
    iconClass: "text-[#7DA6B1]",
    surface: "bg-[#7DA6B1]/[0.08]",
    signal: "bg-[#7DA6B1]",
  },
  {
    icon: PaintbrushIcon,
    title: "Painting & finishing",
    detail: "Preparation · painting · decorating · finishing",
    iconClass: "text-[#F0A23A]",
    surface: "bg-[#F0A23A]/[0.10]",
    signal: "bg-[#F0A23A]",
  },
  {
    icon: WrenchIcon,
    title: "Repairs & maintenance",
    detail: "Property repairs · installations · general maintenance",
    iconClass: "text-[#38D200]",
    surface: "bg-[#38D200]/[0.08]",
    signal: "bg-[#38D200]",
  },
  {
    icon: TruckIcon,
    title: "Transport & delivery",
    detail: "Moving · delivery · courier work · transport",
    iconClass: "text-[#DEDA00]",
    surface: "bg-[#DEDA00]/[0.08]",
    signal: "bg-[#DEDA00]",
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
    <div className="dark">
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-[#08171C] text-white">
        <HeroSection postProjectHref={postProjectHref} />
        <LifecycleSection />
        <AllocationSection />
        <SkillsSection />
        <WorkspaceSection />
        <ResponsibilitySection />
        <ProfileSection />
        <CompletionSection />

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
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#08171C]">
      <GridTexture />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-17rem] h-[54rem] w-[88rem] -translate-x-1/2 rounded-[50%] bg-[#0D566D]/20 blur-[150px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-52 top-[26%] h-[32rem] w-[32rem] rounded-full bg-[#DEDA00]/[0.04] blur-[150px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-56 top-[18%] h-[34rem] w-[34rem] rounded-full bg-[#7DA6B1]/[0.05] blur-[150px]"
      />

      <div className="container relative mx-auto px-4 pb-16 pt-14 sm:px-5 sm:pb-20 sm:pt-20 md:px-8 lg:pb-28 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-6xl text-center"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-2">
            <img
              src={assets.allocatrIcon}
              alt=""
              className="h-5 w-5 object-contain sm:h-5.5 sm:w-5.5"
            />

            <span className="text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-white/48 sm:text-[0.58rem] sm:tracking-[0.2em]">
              Work, properly allocated
            </span>
          </div>

          <h1
            className={[
              "mx-auto mt-7 max-w-[14ch]",
              "text-[2.85rem] font-bold leading-[0.94] tracking-[-0.04em]",
              "text-[#F4F7F7]",
              "sm:mt-8 sm:text-[4.3rem]",
              "md:text-[5.4rem]",
              "lg:text-[6.45rem]",
            ].join(" ")}
          >
            Put the right people on{" "}
            <HeadlineAccent variant="hero">the right work.</HeadlineAccent>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[0.82rem] leading-6 text-white/54 sm:mt-7 sm:max-w-2xl sm:text-base sm:leading-8">
            Create the project, find the people it needs and keep execution,
            responsibility and completion connected in one place.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
            <Button
              asChild
              className={[
                "group h-11 rounded-lg px-6 text-xs font-semibold sm:h-12 sm:px-7",
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
                "h-11 rounded-lg px-6 text-xs font-semibold shadow-none sm:h-12 sm:px-7",
                outlineButton,
              ].join(" ")}
            >
              <Link to={postProjectHref}>Create a project</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5 sm:mt-8 sm:gap-3">
            <HeroProof icon={SearchIcon} tone="lime">
              Skills-based discovery
            </HeroProof>

            <HeroProof icon={Layers3Icon} tone="teal">
              Shared project workspace
            </HeroProof>

            <div className="hidden sm:block">
              <HeroProof icon={FileCheck2Icon} tone="green">
                Client-confirmed completion
              </HeroProof>
            </div>
          </div>
        </motion.div>

        <HeroProductScene />
      </div>
    </section>
  );
}

/* =========================================================
   HERO PRODUCT
========================================================= */

function HeroProductScene() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto mt-12 max-w-6xl sm:mt-16 lg:mt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-2 h-52 w-[82%] -translate-x-1/2 bg-[#0D566D]/20 blur-[90px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-1px] h-px w-[74%] -translate-x-1/2 bg-white/20 blur-[1px]"
      />

      <div className="absolute -left-3 top-12 hidden h-20 w-1 rounded-full bg-[#DEDA00] lg:block" />
      <div className="absolute -right-3 bottom-16 hidden h-16 w-1 rounded-full bg-[#38D200] lg:block" />

      <div
        className={[
          "relative overflow-hidden rounded-[1.25rem] border",
          "border-white/[0.105] bg-[#0A2027]/95",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_20px_80px_rgba(0,0,0,0.60)]",
          "ring-1 ring-white/[0.018]",
          "backdrop-blur-xl sm:rounded-[1.6rem]",
        ].join(" ")}
      >
        <div className="relative flex items-center justify-between border-b border-white/[0.08] bg-white/[0.018] px-4 py-3.5 sm:px-6 sm:py-4">
          <span className="absolute bottom-0 left-0 h-[2px] w-36 bg-[#DEDA00]" />

          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#DEDA00] opacity-20" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#DEDA00]" />
            </span>

            <span className="text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-white/48">
              Allocatr project workspace
            </span>
          </div>

          <span className="hidden text-[0.54rem] text-white/24 sm:block">
            AL-0182
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:gap-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
          <HeroProjectSummary />
          <HeroPeoplePanel />
        </div>
      </div>
    </motion.div>
  );
}

function HeroProjectSummary() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#071A20] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DEDA00] text-[#303030]">
            <WrenchIcon size={15} />
          </span>

          <div className="min-w-0">
            <p className="text-[0.48rem] font-semibold uppercase tracking-[0.13em] text-white/34">
              Home improvement
            </p>

            <h3 className="mt-1.5 truncate text-lg font-semibold tracking-[-0.015em] text-white sm:text-xl">
              Kitchen renovation
            </h3>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 text-[0.54rem] font-semibold text-[#DEDA00]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEDA00]" />
          Active
        </span>
      </div>

      <p className="mt-5 text-xs leading-6 text-white/42 sm:text-sm sm:leading-7">
        Replace cabinetry, update electrical fittings and complete final
        finishing before handover.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 border-y border-white/[0.07] py-4">
        <DarkStat label="Skills" value="04" />
        <DarkStat label="Team" value="03" />
        <DarkStat label="Due" value="30 Oct" />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-white/28">
            Progress
          </span>

          <span className="text-xs font-semibold text-white">68%</span>
        </div>

        <ProgressBar value={68} className="mt-2.5" />
      </div>
    </div>
  );
}

function HeroPeoplePanel() {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#10262D] p-4 sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <PreviewLabel>Recommended team</PreviewLabel>

          <h3 className="mt-1.5 text-sm font-semibold text-white sm:text-base">
            Matching project skills
          </h3>
        </div>

        <span className="hidden rounded-full border border-[#DEDA00]/12 bg-[#DEDA00]/[0.07] px-2.5 py-1 text-[0.52rem] font-semibold text-[#DEDA00] sm:inline-flex">
          3 matches
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        <HeroPerson
          avatar="tawanda"
          name="Tawanda Moyo"
          role="Electrical specialist"
          skill="Electrical wiring"
          tone="amber"
        />

        <HeroPerson
          avatar="leroy"
          name="Leroy Nyathi"
          role="Carpenter & joiner"
          skill="Carpentry"
          tone="lime"
        />

        <HeroPerson
          avatar="kuda"
          name="Kuda M."
          role="Painter & finisher"
          skill="Painting"
          tone="green"
        />
      </div>
    </div>
  );
}

function HeroPerson({
  avatar,
  name,
  role,
  skill,
  tone,
}: {
  avatar: AvatarKey;
  name: string;
  role: string;
  skill: string;
  tone: "amber" | "lime" | "green";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-[#F0A23A]/[0.09] text-[#F0A23A]"
      : tone === "green"
        ? "bg-[#38D200]/[0.07] text-[#38D200]"
        : "bg-[#DEDA00]/[0.08] text-[#DEDA00]";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
      <ProfileAvatar avatar={avatar} size="md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-white">{name}</p>

        <p className="mt-0.5 truncate text-[0.53rem] text-white/34">
          {role}
        </p>
      </div>

      <span
        className={[
          "hidden rounded-md px-2.5 py-1.5 text-[0.5rem] font-semibold sm:inline-flex",
          toneClass,
        ].join(" ")}
      >
        {skill}
      </span>
    </div>
  );
}

/* =========================================================
   LIFECYCLE
========================================================= */

function LifecycleSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#0C1D22] py-20 sm:py-24 lg:py-32">
      <ArchitecturalColumns />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 top-10 h-[34rem] w-[34rem] rounded-full bg-[#7DA6B1]/[0.035] blur-[145px]"
      />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr] lg:items-end lg:gap-16">
          <div>
            <SectionEyebrow>Project lifecycle</SectionEyebrow>

            <SectionTitle>
              The work has state.{" "}
              <HeadlineAccent>You can see where it is.</HeadlineAccent>
            </SectionTitle>
          </div>

          <p className="max-w-xl text-sm leading-7 text-white/43 sm:text-base sm:leading-8 lg:justify-self-end">
            Every project follows a visible path from brief to allocation,
            execution and client-confirmed completion.
          </p>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          <LifecycleRail />

          <div className="relative grid gap-3 sm:grid-cols-2 sm:gap-7 md:grid-cols-4 md:gap-6">
            {lifecycleStages.map((stage, index) => (
              <LifecycleStage key={stage.number} stage={stage} index={index} />
            ))}
          </div>
        </div>

        <LifecycleSummary />
      </div>
    </section>
  );
}

function LifecycleRail() {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { scaleX: 0, opacity: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        viewport: { once: true },
        transition: { duration: 1.15, ease: "easeOut" as const },
      };

  return (
    <div
      aria-hidden
      className="absolute left-0 right-0 top-3 hidden h-14 -translate-y-1/2 md:block"
    >
      <motion.div
        {...motionProps}
        className="absolute inset-x-0 top-1/2 h-12 -translate-y-1/2 origin-left blur-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.12) 12%, rgba(222,218,0,0.15) 36%, rgba(125,166,177,0.13) 64%, rgba(56,210,0,0.10) 88%, transparent 100%)",
        }}
      />

      <motion.div
        {...motionProps}
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-left"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240,162,58,0.80) 12%, rgba(222,218,0,0.78) 36%, rgba(125,166,177,0.72) 64%, rgba(56,210,0,0.68) 88%, transparent 100%)",
        }}
      />
    </div>
  );
}

function LifecycleStage({
  stage,
  index,
}: {
  stage: (typeof lifecycleStages)[number];
  index: number;
}) {
  const signalClass =
    stage.signal === "pending"
      ? "bg-[#F0A23A]"
      : stage.signal === "allocated"
        ? "bg-[#DEDA00]"
        : stage.signal === "complete"
          ? "bg-[#38D200]"
          : "bg-[#7DA6B1]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: 0.08 + index * 0.08, duration: 0.42, ease: "easeOut" }}
      className="relative rounded-xl border border-white/[0.055] bg-white/[0.018] p-4 sm:p-5 md:border-0 md:bg-transparent md:p-0"
    >
      <span className="relative z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-white/[0.10] bg-[#0C1D22] md:flex">
        <span className={["h-2 w-2 rounded-full", signalClass].join(" ")} />
      </span>

      <div className="flex items-center gap-2 md:mt-6">
        <span className={["h-1.5 w-1.5 rounded-full md:hidden", signalClass].join(" ")} />

        <p className="text-[0.48rem] font-semibold uppercase tracking-[0.14em] text-white/34 md:text-[0.5rem] md:tracking-[0.16em]">
          {stage.number} / {stage.label}
        </p>
      </div>

      <h3 className="mt-2 text-base font-semibold tracking-[-0.01em] text-white sm:text-lg">
        {stage.title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/38">
        {stage.description}
      </p>
    </motion.article>
  );
}

function LifecycleSummary() {
  return (
    <div className="mt-10 grid overflow-hidden rounded-xl border border-white/[0.07] bg-[#071A20] sm:mt-14 sm:grid-cols-4">
      <DarkMetric label="Brief" value="Defined" tone="amber" />
      <DarkMetric label="People" value="Allocated" tone="lime" />
      <DarkMetric label="Work" value="Visible" tone="teal" />
      <DarkMetric label="Outcome" value="Confirmed" tone="green" />
    </div>
  );
}

/* =========================================================
   ALLOCATION
========================================================= */

function AllocationSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#08171C] py-20 sm:py-24 lg:py-32">
      <SoftWave tone="lime" side="left" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 top-[8%] h-[34rem] w-[34rem] rounded-full bg-[#0D566D]/[0.10] blur-[145px]"
      />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>Build the team</SectionEyebrow>

            <SectionTitle>
              One project can need{" "}
              <HeadlineAccent>several different people.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/43 sm:mt-6 sm:text-base sm:leading-8">
              Skills belong to the project. Bring together the right mix of
              people around one brief instead of managing each trade as a
              separate job.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <SkillTag>Electrical</SkillTag>
              <SkillTag>Carpentry</SkillTag>
              <SkillTag>Painting</SkillTag>
              <SkillTag>Construction</SkillTag>
            </div>

            <div className="relative mt-8 max-w-md overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C2229] p-5">
              <span className="absolute inset-y-0 left-0 w-[3px] bg-[#DEDA00]" />

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DEDA00] text-[#303030]">
                  <Layers3Icon size={14} />
                </span>

                <div>
                  <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/32">
                    Allocation principle
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    The project comes first.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/40">
                People are selected around what the project needs, keeping every
                role connected to one shared outcome.
              </p>
            </div>
          </div>

          <AllocationFan />
        </div>
      </div>
    </section>
  );
}

function AllocationFan() {
  return (
    <div className="relative min-h-[410px] sm:min-h-[535px] lg:min-h-[550px]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="absolute left-1/2 top-0 z-30 w-[94%] max-w-md -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#10262D] p-4 shadow-[0_28px_70px_-42px_rgba(0,0,0,0.55)] sm:w-[84%] sm:p-5"
      >
        <span className="absolute inset-x-0 top-0 h-[3px] bg-[#DEDA00]" />

        <div className="flex items-center justify-between">
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/34">
            Project team
          </span>

          <span className="rounded-full bg-[#DEDA00] px-2.5 py-1 text-[0.5rem] font-semibold text-[#303030]">
            4 roles
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold text-white sm:text-xl">
          Kitchen renovation
        </h3>

        <p className="mt-2 text-[0.68rem] text-white/40 sm:text-xs">
          The team is assembled around the skills the work requires.
        </p>

        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
          {["Electrical", "Carpentry", "Painting", "Construction"].map(skill => (
            <span
              key={skill}
              className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[0.53rem] font-medium text-white/52"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="absolute left-1/2 top-[116px] h-12 w-px -translate-x-1/2 bg-[#7DA6B1]/18 sm:top-[142px] sm:h-16" />

      <div className="absolute left-[16%] right-[16%] top-[163px] h-px bg-[#7DA6B1]/15 sm:left-[12%] sm:right-[12%] sm:top-[205px]" />

      <div className="absolute inset-x-0 top-[184px] grid grid-cols-2 gap-2.5 sm:hidden">
        {allocationRoles.slice(0, 2).map((item, index) => (
          <AllocationCard key={item.role} item={item} index={index} compact />
        ))}
      </div>

      <div className="absolute inset-x-0 top-[228px] hidden grid-cols-2 gap-3 sm:grid lg:hidden">
        {allocationRoles.map((item, index) => (
          <AllocationCard key={item.role} item={item} index={index} />
        ))}
      </div>

      <div className="absolute inset-x-0 top-[228px] hidden items-end justify-center lg:flex">
        {allocationRoles.map((item, index) => (
          <AllocationCard key={item.role} item={item} index={index} desktop />
        ))}
      </div>
    </div>
  );
}

function AllocationCard({
  item,
  index,
  compact = false,
  desktop = false,
}: {
  item: (typeof allocationRoles)[number];
  index: number;
  compact?: boolean;
  desktop?: boolean;
}) {
  const Icon = item.icon;

  const signalClass =
    item.tone === "amber"
      ? "bg-[#F0A23A]"
      : item.tone === "green"
        ? "bg-[#38D200]"
        : item.tone === "lime"
          ? "bg-[#DEDA00]"
          : "bg-[#7DA6B1]";

  const iconClass =
    item.tone === "amber"
      ? "bg-[#F0A23A]/[0.10] text-[#F0A23A]"
      : item.tone === "green"
        ? "bg-[#38D200]/[0.08] text-[#38D200]"
        : item.tone === "lime"
          ? "bg-[#DEDA00]/[0.08] text-[#DEDA00]"
          : "bg-[#7DA6B1]/[0.08] text-[#7DA6B1]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotate: desktop ? item.rotation * 1.4 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: desktop ? item.rotation : 0 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.18 + index * 0.07,
        type: desktop ? "spring" : "tween",
        stiffness: 240,
        damping: 24,
        duration: desktop ? undefined : 0.35,
      }}
      whileHover={
        desktop
          ? {
              y: -10,
              rotate: 0,
              scale: 1.03,
              zIndex: 40,
            }
          : undefined
      }
      className={[
        "rounded-xl border border-white/[0.07] bg-[#10262D] p-3.5",
        desktop
          ? "relative w-48 p-4 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.60)]"
          : "",
        desktop && index > 0 ? "-ml-5" : "",
      ].join(" ")}
      style={desktop ? { zIndex: 10 + index } : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="relative">
          <ProfileAvatar avatar={item.avatar} size={compact ? "md" : "lg"} />

          <span
            className={[
              "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-md",
              "border-2 border-[#10262D]",
              iconClass,
            ].join(" ")}
          >
            <Icon size={10} />
          </span>
        </div>

        <span className={["mt-1 h-2 w-2 rounded-full", signalClass].join(" ")} />
      </div>

      <p
        className={[
          "font-semibold uppercase tracking-[0.14em] text-white/28",
          compact ? "mt-4 text-[0.46rem]" : "mt-5 text-[0.5rem]",
        ].join(" ")}
      >
        {item.role}
      </p>

      <h4 className="mt-1.5 truncate text-xs font-semibold text-white sm:text-sm">
        {item.person}
      </h4>

      {!compact && (
        <>
          <p className="mt-1 text-[0.56rem] text-white/38">
            {item.title}
          </p>

          <p className="mt-1 text-[0.52rem] text-white/24">
            {item.experience}
          </p>

          <div className="mt-5 flex items-center gap-1.5 border-t border-white/[0.06] pt-3 text-[0.52rem] font-semibold text-[#38D200]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
            Accepted
          </div>
        </>
      )}
    </motion.article>
  );
}

/* =========================================================
   SKILLS
========================================================= */

function SkillsSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#0C1D22] py-20 sm:py-24 lg:py-32">
      <GridTexture />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-16">
          <div>
            <SectionEyebrow>Skills on Allocatr</SectionEyebrow>

            <SectionTitle>
              Practical work needs{" "}
              <HeadlineAccent>practical capability.</HeadlineAccent>
            </SectionTitle>
          </div>

          <p className="max-w-xl text-sm leading-7 text-white/43 sm:text-base sm:leading-8 lg:justify-self-end">
            A single project can call for several different capabilities. Find
            the skills the work needs without breaking the job into disconnected
            pieces.
          </p>
        </div>

        <SkillsTicker />
      </div>
    </section>
  );
}

function SkillsTicker() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mt-10 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#08171C] sm:mt-14 sm:rounded-[1.5rem] lg:mt-16">
      <div className="relative flex items-center justify-between bg-[#10262D] px-4 py-4 sm:px-6 sm:py-5">
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#DEDA00]" />

        <div>
          <p className="text-[0.48rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            Skill categories
          </p>

          <p className="mt-1.5 text-xs font-semibold text-white/66">
            Different capabilities. One project system.
          </p>
        </div>

        <Link
          to="/discover"
          className="group hidden items-center gap-2 rounded-lg bg-[#DEDA00] px-3 py-2 text-[0.56rem] font-semibold text-[#303030] transition-colors hover:bg-[#d4d000] sm:flex"
        >
          Explore Allocats

          <ArrowRightIcon
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {reduceMotion ? (
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
          {workCategories.map(item => (
            <SkillTickerCard key={item.title} item={item} />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden py-5 sm:py-7">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#08171C] via-[#08171C]/90 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-[#08171C] via-[#08171C]/90 to-transparent sm:w-24" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            className="flex w-max gap-3 px-3 sm:gap-4 sm:px-4"
          >
            {[...workCategories, ...workCategories].map((item, index) => (
              <SkillTickerCard key={`${item.title}-${index}`} item={item} />
            ))}
          </motion.div>
        </div>
      )}

      <div className="grid border-t border-white/[0.07] sm:grid-cols-3">
        <SkillsMetric
          number="01"
          title="Define the need"
          description="Skills are attached directly to the project."
        />

        <SkillsMetric
          number="02"
          title="Find the people"
          description="Discover professionals relevant to those skills."
        />

        <SkillsMetric
          number="03"
          title="Keep one project"
          description="Everyone stays connected to the same outcome."
        />
      </div>
    </div>
  );
}

function SkillTickerCard({
  item,
}: {
  item: (typeof workCategories)[number];
}) {
  const Icon = item.icon;

  return (
    <div
      className={[
        "group w-[250px] shrink-0 rounded-xl border border-white/[0.07]",
        "bg-[#10262D] p-5 transition-all duration-200",
        "hover:-translate-y-1 hover:border-white/[0.12]",
        "hover:bg-[#123039]",
        "sm:w-[285px] sm:p-6",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            item.surface,
            item.iconClass,
          ].join(" ")}
        >
          <Icon size={16} />
        </span>

        <span className={["mt-1 h-1.5 w-1.5 rounded-full", item.signal].join(" ")} />
      </div>

      <h3 className="mt-7 text-sm font-semibold tracking-[-0.01em] text-white">
        {item.title}
      </h3>

      <p className="mt-2 min-h-10 text-[0.6rem] leading-5 text-white/34">
        {item.detail}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-white/24">
          Find specialists
        </span>

        <ArrowRightIcon
          size={12}
          className="text-[#DEDA00] transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </div>
  );
}

function SkillsMetric({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-white/[0.07] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6">
      <p className="text-[0.48rem] font-semibold tracking-[0.15em] text-[#DEDA00]">
        {number}
      </p>

      <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-6 text-white/36">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   WORKSPACE
========================================================= */

function WorkspaceSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#10262D] py-20 sm:py-24 lg:py-32">
      <SoftWave tone="teal" side="right" />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-44 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#DEDA00]/[0.025] blur-[140px]"
      />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>Project workspace</SectionEyebrow>

          <SectionTitle center>
            One place to see{" "}
            <HeadlineAccent>what is actually happening.</HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/43 sm:mt-6 sm:text-base sm:leading-8">
            The workspace brings the brief, team, progress and task execution
            together without turning the project into another stream of
            disconnected updates.
          </p>
        </div>

        <WorkspaceDemo />
      </div>
    </section>
  );
}

function WorkspaceDemo() {
  return (
    <div className="relative mx-auto mt-10 max-w-6xl sm:mt-14 sm:pb-10 lg:mt-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="overflow-hidden rounded-[1.25rem] border border-white/[0.09] bg-[#071A20] shadow-[0_20px_80px_rgba(0,0,0,0.48)] sm:rounded-[1.5rem]"
      >
        <WorkspaceHeader />

        <div className="grid gap-3 p-3.5 sm:gap-4 sm:p-6 lg:grid-cols-[1.22fr_0.78fr]">
          <WorkspaceMain />
          <WorkspaceSidebar />
        </div>
      </motion.div>

      <WorkspaceMessageFloat />
    </div>
  );
}

function WorkspaceHeader() {
  return (
    <div className="relative flex flex-col gap-4 border-b border-white/[0.08] bg-[#0A2027] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <span className="absolute bottom-0 left-0 h-[2px] w-36 bg-[#DEDA00]" />

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DEDA00] text-[#303030]">
          <WrenchIcon size={16} />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold tracking-[-0.015em] text-white sm:text-lg">
              Kitchen renovation
            </h3>

            <span className="inline-flex items-center gap-1.5 text-[0.54rem] font-semibold text-[#DEDA00]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DEDA00]" />
              Active
            </span>
          </div>

          <p className="mt-1 truncate text-[0.55rem] text-white/28">
            Home improvement · AL-0182
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-[0.56rem] font-semibold text-white/46 sm:inline-flex">
          Project details
        </span>

        <span className="rounded-lg bg-[#DEDA00] px-3 py-2 text-[0.56rem] font-semibold text-[#303030]">
          Find Allocats
        </span>
      </div>
    </div>
  );
}

function WorkspaceMain() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#10262D] p-4 sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <PreviewLabel>Project progress</PreviewLabel>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
              68
            </span>

            <span className="mb-1 text-sm font-semibold text-white/30">
              %
            </span>
          </div>
        </div>

        <span className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-[0.54rem] font-semibold text-white/58">
          Active
        </span>
      </div>

      <ProgressBar value={68} className="mt-5 sm:mt-6" large />

      <div className="mt-6 grid grid-cols-3 border-y border-white/[0.06] py-4">
        <ProjectStat label="Tasks" value="12" />
        <ProjectStat label="Complete" value="07" />
        <ProjectStat label="Due" value="30 Oct" />
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <PreviewLabel>Tasks</PreviewLabel>

            <h4 className="mt-1.5 text-sm font-semibold text-white">
              Current execution
            </h4>
          </div>

          <span className="hidden text-[0.52rem] text-white/24 sm:block">
            Status board
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

          <WorkspaceTask
            title="Site inspection"
            person="Project team"
            status="Complete"
            tone="complete"
          />

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
  tone: "active" | "pending" | "complete" | "overdue";
}) {
  const dotClass =
    tone === "complete"
      ? "bg-[#38D200]"
      : tone === "pending"
        ? "bg-[#F0A23A]"
        : tone === "overdue"
          ? "bg-[#AD3A12]"
          : "bg-[#DEDA00]";

  const statusClass =
    tone === "complete"
      ? "text-[#38D200]"
      : tone === "pending"
        ? "text-[#F0A23A]"
        : tone === "overdue"
          ? "text-[#D27857]"
          : "text-[#DEDA00]";

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3.5">
      <div className="flex items-start gap-2.5">
        <span className={["mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dotClass].join(" ")} />

        <div className="min-w-0 flex-1">
          <p className="text-[0.66rem] font-semibold leading-5 text-white/74">
            {title}
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="truncate text-[0.5rem] text-white/27">
              {person}
            </span>

            <span className={["text-[0.5rem] font-semibold", statusClass].join(" ")}>
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidebar() {
  return (
    <div className="grid gap-3">
      <div className="rounded-xl border border-white/[0.06] bg-[#10262D] p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <PreviewLabel>Project team</PreviewLabel>

            <p className="mt-1.5 text-sm font-semibold text-white">
              Accepted Allocats
            </p>
          </div>

          <span className="text-xl font-semibold text-[#DEDA00]">
            03
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <WorkspaceMember avatar="tawanda" name="Tawanda M." skill="Electrical" />
          <WorkspaceMember avatar="leroy" name="Leroy N." skill="Carpentry" />
          <WorkspaceMember avatar="kuda" name="Kuda M." skill="Painting" />
        </div>
      </div>

      <div className="rounded-xl border border-[#DEDA00]/[0.10] bg-[#DEDA00]/[0.055] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-[#DEDA00]">
          <FileCheck2Icon size={14} />

          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em]">
            Next milestone
          </span>
        </div>

        <p className="mt-3 text-sm font-semibold text-white">
          Electrical installation review
        </p>

        <p className="mt-1.5 text-xs leading-6 text-white/38">
          Due 18 October · assigned to Tawanda M.
        </p>
      </div>

      <div className="rounded-xl border border-[#38D200]/[0.08] bg-[#38D200]/[0.035] p-4 sm:p-5">
        <div className="flex items-center gap-2.5 text-[#38D200]">
          <ShieldCheckIcon size={14} />

          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em]">
            Project health
          </span>
        </div>

        <p className="mt-3 text-sm font-semibold text-white">
          Moving as planned
        </p>

        <p className="mt-1.5 text-xs leading-6 text-white/38">
          7 of 12 tasks complete with three accepted Allocats active.
        </p>
      </div>
    </div>
  );
}

function WorkspaceMember({
  avatar,
  name,
  skill,
}: {
  avatar: AvatarKey;
  name: string;
  skill: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <ProfileAvatar avatar={avatar} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.62rem] font-semibold text-white/76">
          {name}
        </p>

        <p className="mt-0.5 text-[0.5rem] text-white/26">
          {skill}
        </p>
      </div>

      <span className="h-1.5 w-1.5 rounded-full bg-[#38D200]" />
    </div>
  );
}

function WorkspaceMessageFloat() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -left-8 bottom-0 hidden w-64 rounded-xl border border-white/[0.08] bg-[#10262D] p-4 shadow-2xl lg:block"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DEDA00]/[0.09] text-[#DEDA00]">
          <MessageSquareIcon size={15} />
        </span>

        <div>
          <p className="text-[0.52rem] text-white/28">
            Project update
          </p>

          <p className="mt-0.5 text-xs font-semibold text-white">
            Electrical work started
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   RESPONSIBILITY
========================================================= */

function ResponsibilitySection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#0C1D22] py-20 sm:py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[34rem] w-[70rem] -translate-x-1/2 rounded-[50%] bg-[#0D566D]/[0.07] blur-[150px]"
      />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="max-w-4xl">
          <SectionEyebrow>Same project</SectionEyebrow>

          <SectionTitle>
            Different responsibilities.{" "}
            <HeadlineAccent>Shared visibility.</HeadlineAccent>
          </SectionTitle>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/43 sm:mt-6 sm:text-base sm:leading-8">
            The client and Allocat work from the same project. What changes is
            what each person is responsible for.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#08171C] sm:mt-14 lg:grid-cols-[1fr_0.72fr_1fr]">
          <ResponsibilityPanel
            role="Client"
            icon={UsersIcon}
            title="Own the outcome"
            description="Define what needs to happen, choose the team and make the final decision on completion."
            items={[
              "Create the brief",
              "Invite the team",
              "Review progress",
              "Confirm completion",
            ]}
          />

          <SharedProjectCore />

          <ResponsibilityPanel
            role="Allocat"
            icon={BriefcaseBusinessIcon}
            title="Own the execution"
            description="Take responsibility for assigned work, keep tasks moving and return the finished project for review."
            items={[
              "Accept the work",
              "Execute tasks",
              "Update progress",
              "Submit completion",
            ]}
            allocat
          />
        </div>
      </div>
    </section>
  );
}

function ResponsibilityPanel({
  role,
  icon: Icon,
  title,
  description,
  items,
  allocat = false,
}: {
  role: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  allocat?: boolean;
}) {
  return (
    <div
      className={[
        "p-5 sm:p-8 lg:p-10",
        allocat
          ? "border-t border-white/[0.06] lg:border-l lg:border-t-0"
          : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            allocat
              ? "bg-[#DEDA00]/[0.08] text-[#DEDA00]"
              : "bg-[#7DA6B1]/[0.08] text-[#7DA6B1]",
          ].join(" ")}
        >
          <Icon size={16} />
        </span>

        <span className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-white/26">
          {role}
        </span>
      </div>

      <h3 className="mt-7 text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
        {title}.
      </h3>

      <p className="mt-3 text-sm leading-7 text-white/40">
        {description}
      </p>

      <div className="mt-7 space-y-3 border-t border-white/[0.06] pt-5">
        {items.map(item => (
          <div key={item} className="flex items-center gap-2.5">
            <CheckCircle2Icon
              size={13}
              className={allocat ? "text-[#DEDA00]" : "text-[#7DA6B1]"}
            />

            <span className="text-xs font-medium text-white/46">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SharedProjectCore() {
  return (
    <div className="relative flex flex-col justify-center border-y border-white/[0.06] bg-[#10262D] p-6 sm:p-8 lg:border-x lg:border-y-0 lg:p-7">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-[#DEDA00] lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[3px]" />

      <div className="mx-auto max-w-xs text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#DEDA00] text-[#303030]">
          <Layers3Icon size={17} />
        </span>

        <p className="mt-5 text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-white/34">
          Shared project
        </p>

        <h4 className="mt-2 text-lg font-semibold tracking-[-0.015em] text-white">
          One source of truth
        </h4>

        <p className="mt-3 text-xs leading-6 text-white/42">
          Brief, people, tasks, status and completion stay connected regardless
          of who is viewing the work.
        </p>

        <div className="mt-6 flex justify-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-white/18" />
          <span className="h-1.5 w-8 rounded-full bg-[#DEDA00]" />
          <span className="h-1.5 w-5 rounded-full bg-white/18" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#08171C] py-20 sm:py-24 lg:py-32">
      <SoftAtmosphere position="left" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <div>
            <SectionEyebrow>Before the invitation</SectionEyebrow>

            <SectionTitle>
              More context than{" "}
              <HeadlineAccent>a contact number.</HeadlineAccent>
            </SectionTitle>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/43 sm:mt-6 sm:text-base sm:leading-8">
              Profiles bring skills, experience, professional information and
              project feedback together before a client makes an invitation.
            </p>

            <ProfileTrustCard />
          </div>

          <AllocatProfilePreview />
        </div>
      </div>
    </section>
  );
}

function ProfileTrustCard() {
  return (
    <div className="relative mt-8 max-w-md overflow-hidden rounded-xl border border-white/[0.07] bg-[#10262D] p-5">
      <span className="absolute inset-y-0 left-0 w-[3px] bg-[#DEDA00]" />

      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#38D200]/[0.08] text-[#38D200]">
          <BadgeCheckIcon size={15} />
        </span>

        <div>
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            Professional context
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Make the invitation with context.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 border-t border-white/[0.07] pt-4">
        <DarkStat label="Skills" value="04" />
        <DarkStat label="Experience" value="8 yrs" />
        <DarkStat label="Rating" value="4.9" />
      </div>
    </div>
  );
}

function AllocatProfilePreview() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#10262D] shadow-[0_28px_90px_-54px_rgba(0,0,0,0.70)] sm:rounded-[1.5rem]">
      <div className="relative flex items-center gap-4 border-b border-white/[0.07] bg-[#0C2229] p-4 sm:gap-5 sm:p-6">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-[#DEDA00]" />

        <ProfileAvatar avatar="tawanda" size="xl" />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
              Tawanda Moyo
            </h3>

            <BadgeCheckIcon
              size={15}
              className="shrink-0 text-[#DEDA00]"
            />
          </div>

          <p className="mt-1 text-xs font-medium text-white/42">
            Electrical specialist
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-[0.56rem] text-white/28">
            <span className="flex items-center gap-1.5">
              <MapPinIcon size={11} />
              Harare
            </span>

            <span className="flex items-center gap-1.5">
              <StarIcon
                size={11}
                className="fill-[#F0A23A] text-[#F0A23A]"
              />
              4.9
            </span>
          </div>
        </div>

        <div className="ml-auto hidden rounded-xl bg-[#DEDA00]/[0.07] px-4 py-3 text-right sm:block">
          <p className="text-2xl font-semibold text-[#DEDA00]">
            8
          </p>

          <p className="text-[0.48rem] uppercase tracking-[0.10em] text-white/28">
            years experience
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
          <ProfileDetail label="Hourly rate" value="$18 / hour" />
          <ProfileDetail label="Experience" value="8 years" />
          <ProfileDetail label="Rating" value="4.9 / 5" tone="amber" />
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-5">
          <PreviewLabel>Skills</PreviewLabel>

          <div className="mt-3 flex flex-wrap gap-2">
            <SkillTag>Electrical wiring</SkillTag>
            <SkillTag>Installation</SkillTag>
            <SkillTag>Fault finding</SkillTag>
            <SkillTag>Lighting</SkillTag>
          </div>
        </div>

        <div className="mt-6 hidden border-t border-white/[0.06] pt-5 sm:block">
          <PreviewLabel>About</PreviewLabel>

          <p className="mt-3 max-w-xl text-xs leading-6 text-white/38">
            Experienced electrical professional focused on residential and
            commercial installation, maintenance and fault diagnosis.
          </p>
        </div>

        <div className="mt-6 flex justify-end border-t border-white/[0.06] pt-4">
          <span className="inline-flex items-center gap-2 text-[0.58rem] font-semibold text-[#DEDA00]">
            View profile
            <ArrowRightIcon size={11} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPLETION
========================================================= */

function CompletionSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#10262D] py-20 sm:py-24 lg:py-32">
      <SoftWave tone="green" side="right" />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>Completion & reputation</SectionEyebrow>

          <SectionTitle center>
            Done means{" "}
            <HeadlineAccent>
              reviewed, confirmed and remembered.
            </HeadlineAccent>
          </SectionTitle>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/43 sm:mt-6 sm:text-base sm:leading-8">
            Completion creates a clear handover, a client decision and feedback
            that follows the professional beyond one project.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-3 sm:mt-14 lg:grid-cols-3 lg:gap-4">
          <CompletionStep
            number="01"
            icon={SendIcon}
            title="Submit the work"
            description="The project team sends completed work to the client for confirmation."
            tone="teal"
          />

          <CompletionStep
            number="02"
            icon={FileCheck2Icon}
            title="Confirm the outcome"
            description="The client confirms completion or returns the project when more work is needed."
            tone="lime"
          />

          <CompletionStep
            number="03"
            icon={StarIcon}
            title="Build reputation"
            description="Ratings and comments become part of the professional context available on future projects."
            tone="green"
          />
        </div>

        <CompletionResult />
      </div>
    </section>
  );
}

function CompletionStep({
  number,
  icon: Icon,
  title,
  description,
  tone,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "teal" | "lime" | "green";
}) {
  const iconClass =
    tone === "lime"
      ? "bg-[#DEDA00]/[0.08] text-[#DEDA00]"
      : tone === "green"
        ? "bg-[#38D200]/[0.07] text-[#38D200]"
        : "bg-[#7DA6B1]/[0.08] text-[#7DA6B1]";

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#08171C]/70 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-start justify-between">
        <span className={["flex h-10 w-10 items-center justify-center rounded-lg", iconClass].join(" ")}>
          <Icon size={16} />
        </span>

        <span
          className={[
            "text-[0.48rem] font-semibold tracking-[0.15em]",
            tone === "lime"
              ? "text-[#DEDA00]"
              : tone === "green"
                ? "text-[#38D200]"
                : "text-[#7DA6B1]",
          ].join(" ")}
        >
          {number}
        </span>
      </div>

      <h3 className="mt-7 text-lg font-semibold tracking-[-0.015em] text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/38">
        {description}
      </p>
    </div>
  );
}

function CompletionResult() {
  return (
    <div className="mx-auto mt-4 max-w-4xl overflow-hidden rounded-xl border border-white/[0.07] bg-[#071A20] sm:mt-6">
      <div className="grid sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="relative flex items-center gap-4 p-4 sm:p-5">
          <span className="absolute inset-y-0 left-0 w-[3px] bg-[#38D200]" />

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#38D200]/[0.08] text-[#38D200]">
            <CircleCheckBigIcon size={16} />
          </span>

          <div>
            <p className="text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              Project complete
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Kitchen renovation successfully closed.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.07] px-4 py-4 sm:border-l sm:border-t-0 sm:px-6">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(value => (
              <StarIcon
                key={value}
                size={15}
                className={
                  value <= 4
                    ? "fill-[#F0A23A] text-[#F0A23A]"
                    : "text-white/15"
                }
              />
            ))}

            <span className="ml-2 text-[0.58rem] font-semibold text-white/44">
              4/5
            </span>
          </div>

          <p className="mt-1 text-[0.5rem] text-[#DEDA00]">
            Rating saved
          </p>
        </div>
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
    <section className="relative overflow-hidden bg-[#08171C] py-20 sm:py-24 lg:py-32">
      <GridTexture />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[48rem] w-[76rem] -translate-x-1/2 rounded-[50%] bg-[#0D566D]/16 blur-[155px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#DEDA00]/[0.035] blur-[130px]"
      />

      <div className="container relative mx-auto px-4 sm:px-5 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionEyebrow center>
            Ready when the work is
          </SectionEyebrow>

          <h2
            className={[
              "mx-auto mt-5 max-w-[13ch]",
              "text-[2.75rem] font-bold leading-[0.94] tracking-[-0.038em]",
              "text-white",
              "sm:mt-6 sm:text-6xl",
              "lg:text-7xl",
            ].join(" ")}
          >
            There's work to be done.

            <HeadlineAccent block variant="hero">
              Allocate it properly.
            </HeadlineAccent>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/42 sm:mt-7 sm:text-base sm:leading-8">
            Start with the project, find the people it needs and keep the work
            connected from brief to completion.
          </p>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/[0.08] bg-[#10262D]/80 p-2 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.70)] backdrop-blur-xl sm:mt-10">
            <Link
              to={postProjectHref}
              className="group flex min-h-[3.5rem] items-center gap-3 rounded-lg px-3 text-left transition-colors hover:bg-white/[0.035] sm:gap-4 sm:px-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DEDA00]/[0.08] text-[#DEDA00]">
                <SearchIcon size={14} />
              </span>

              <span className="min-w-0 flex-1 text-sm text-white/36">
                What needs doing?
              </span>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DEDA00] text-[#303030] transition-transform group-hover:translate-x-0.5">
                <ArrowRightIcon size={14} />
              </span>
            </Link>
          </div>

          <div className="mt-5 hidden flex-wrap justify-center gap-2 sm:flex">
            <SkillTag>Electrical</SkillTag>
            <SkillTag>Carpentry</SkillTag>
            <SkillTag>Construction</SkillTag>
            <SkillTag>Painting</SkillTag>
            <SkillTag>Repairs</SkillTag>
            <SkillTag>Transport</SkillTag>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/[0.07] pt-7 sm:mt-12 sm:grid-cols-2 sm:pt-8">
            <FinalCtaChoice
              href={postProjectHref}
              icon={FileTextIcon}
              eyebrow="Need the work done?"
              title="Start a project"
              description="Create the brief and build the right team around it."
              tone="teal"
            />

            <FinalCtaChoice
              href={allocatHref}
              icon={BriefcaseBusinessIcon}
              eyebrow="Have the skills?"
              title={allocatLabel}
              description="Build your professional profile and join client projects."
              tone="lime"
            />
          </div>

          <div className="relative mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[#10262D] px-4 py-4 text-left sm:mt-10 sm:px-6">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-[#DEDA00]" />

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DEDA00] text-[#303030]">
              <CheckCircle2Icon size={14} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-white">
                One project. The right people. Clear ownership.
              </p>

              <p className="mt-0.5 hidden text-[0.55rem] text-white/32 sm:block">
                From the first brief to final client confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCtaChoice({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  tone,
}: {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  tone: "teal" | "lime";
}) {
  const iconClass =
    tone === "lime"
      ? "bg-[#DEDA00]/[0.08] text-[#DEDA00]"
      : "bg-[#7DA6B1]/[0.08] text-[#7DA6B1]";

  return (
    <Link
      to={href}
      className={[
        "group flex items-center gap-4 rounded-xl border border-white/[0.07]",
        "bg-white/[0.022] p-4 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04]",
        "sm:p-5",
      ].join(" ")}
    >
      <span className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconClass].join(" ")}>
        <Icon size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[0.48rem] font-semibold uppercase tracking-[0.13em] text-white/26">
          {eyebrow}
        </p>

        <p className="mt-1.5 text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 hidden text-[0.56rem] leading-5 text-white/30 sm:block">
          {description}
        </p>
      </div>

      <ArrowRightIcon
        size={13}
        className={[
          "shrink-0 transition-transform group-hover:translate-x-0.5",
          tone === "lime" ? "text-[#DEDA00]" : "text-[#7DA6B1]",
        ].join(" ")}
      />
    </Link>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ProgressBar({
  value,
  className = "",
  large = false,
}: {
  value: number;
  className?: string;
  large?: boolean;
}) {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div
      className={[
        "overflow-hidden rounded-full bg-white/[0.07]",
        large ? "h-1.5" : "h-1",
        className,
      ].join(" ")}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-full rounded-full bg-[#DEDA00]"
      >
        {large && (
          <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[#10262D] bg-[#DEDA00]" />
        )}
      </motion.div>
    </div>
  );
}

function ProjectStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-white/[0.06] px-3 first:border-l-0 first:pl-0">
      <p className="text-[0.47rem] font-semibold uppercase tracking-[0.1em] text-white/24">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-white sm:text-sm">
        {value}
      </p>
    </div>
  );
}

function DarkStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-white/[0.07] px-3 first:border-l-0 first:pl-0">
      <p className="text-[0.46rem] font-semibold uppercase tracking-[0.1em] text-white/26">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function DarkMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "lime" | "teal" | "green";
}) {
  const dotClass =
    tone === "amber"
      ? "bg-[#F0A23A]"
      : tone === "lime"
        ? "bg-[#DEDA00]"
        : tone === "green"
          ? "bg-[#38D200]"
          : "bg-[#7DA6B1]";

  const valueClass =
    tone === "lime"
      ? "text-[#DEDA00]"
      : tone === "green"
        ? "text-[#38D200]"
        : "text-white";

  return (
    <div className="border-b border-white/[0.07] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-5">
      <p className="text-[0.46rem] font-semibold uppercase tracking-[0.13em] text-white/26">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className={["h-1.5 w-1.5 rounded-full", dotClass].join(" ")} />

        <p className={["text-xs font-semibold", valueClass].join(" ")}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ProfileDetail({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "amber";
}) {
  return (
    <div>
      <PreviewLabel>{label}</PreviewLabel>

      <p
        className={[
          "mt-2 text-xs font-semibold sm:text-sm",
          tone === "amber" ? "text-[#F0A23A]" : "text-white",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function PreviewLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        "text-[0.48rem] font-semibold uppercase tracking-[0.13em]",
        "text-white/28 sm:text-[0.5rem] sm:tracking-[0.14em]",
        className,
      ].join(" ")}
    >
      {children}
    </p>
  );
}

function SkillTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-lg border border-white/[0.09] bg-white/[0.025] px-2.5 py-1.5 text-[0.54rem] font-medium text-white/48 sm:text-[0.56rem]">
      {children}
    </span>
  );
}

function SectionEyebrow({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={["flex items-center gap-2.5", center ? "justify-center" : ""].join(" ")}>
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-5 rounded-full bg-white/16" />
        <span className="h-1.5 w-2 rounded-full bg-[#DEDA00]" />
      </span>

      <span className="text-[0.53rem] font-semibold uppercase tracking-[0.17em] text-white/36 sm:text-[0.56rem] sm:tracking-[0.2em]">
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
        "mt-4 max-w-5xl text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.03em]",
        "text-[#F4F7F7]",
        "sm:mt-5 sm:text-5xl sm:leading-[0.96] sm:tracking-[-0.034em]",
        "lg:text-6xl",
        center ? "mx-auto" : "",
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function HeadlineAccent({
  children,
  block = false,
  variant = "standard",
}: {
  children: ReactNode;
  block?: boolean;
  variant?: "standard" | "hero";
}) {
  return (
    <span
      className={[
        variant === "hero"
          ? "text-[#DEDA00]"
          : "text-[#C7D7DA]",
        block ? "block" : "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function HeroProof({
  icon: Icon,
  children,
  tone,
}: {
  icon: LucideIcon;
  children: ReactNode;
  tone: "lime" | "teal" | "green";
}) {
  const iconClass =
    tone === "lime"
      ? "bg-[#DEDA00]/[0.10] text-[#DEDA00]"
      : tone === "green"
        ? "bg-[#38D200]/[0.08] text-[#38D200]"
        : "bg-[#7DA6B1]/[0.09] text-[#9ABAC2]";

  return (
    <span
      className={[
        "inline-flex items-center gap-2.5 rounded-lg",
        "border border-white/[0.10] bg-white/[0.025]",
        "px-3 py-2 text-[0.58rem] font-medium text-white/56",
        "sm:gap-3 sm:px-3.5 sm:text-[0.61rem]",
      ].join(" ")}
    >
      <span className={["flex h-5.5 w-5.5 items-center justify-center rounded-md", iconClass].join(" ")}>
        <Icon size={10} />
      </span>

      {children}
    </span>
  );
}

/* =========================================================
   PROFILE AVATAR
========================================================= */

function ProfileAvatar({
  avatar,
  size = "md",
}: {
  avatar: AvatarKey;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass =
    size === "xl"
      ? "h-14 w-14 sm:h-16 sm:w-16"
      : size === "lg"
        ? "h-12 w-12"
        : size === "sm"
          ? "h-8 w-8"
          : "h-10 w-10";

  return (
    <span
      className={[
        "relative block shrink-0 overflow-hidden rounded-full",
        "border border-white/[0.10] bg-[#10262D]",
        sizeClass,
      ].join(" ")}
    >
      <img
        src={profileAvatars[avatar]}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}

/* =========================================================
   BACKGROUNDS
========================================================= */

function GridTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(125,166,177,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(125,166,177,0.015) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.58) 34%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.58) 34%, transparent 78%)",
      }}
    />
  );
}

function SoftWave({
  tone,
  side,
}: {
  tone: "teal" | "lime" | "green";
  side: "left" | "right";
}) {
  const reduceMotion = useReducedMotion();

  const colorClass =
    tone === "lime"
      ? "text-[#DEDA00]"
      : tone === "green"
        ? "text-[#38D200]"
        : "text-[#7DA6B1]";

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute top-[10%] h-[32rem] w-[100rem]",
        side === "left" ? "-left-[48rem]" : "-right-[48rem]",
        colorClass,
        "opacity-[0.065]",
      ].join(" ")}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.25) 20%, black 45%, black 55%, rgba(0,0,0,.25) 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.25) 20%, black 45%, black 55%, rgba(0,0,0,.25) 80%, transparent 100%)",
      }}
    >
      <motion.svg
        animate={reduceMotion ? undefined : { x: [0, 6, 0], y: [0, -4, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 1800 520"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path
            d="M-200 365 C100 120 370 110 650 265 C930 420 1160 395 1420 220 C1620 85 1830 110 2020 250"
            strokeWidth="18"
            opacity="0.035"
            style={{ filter: "blur(22px)" }}
          />

          <path
            d="M-200 365 C100 120 370 110 650 265 C930 420 1160 395 1420 220 C1620 85 1830 110 2020 250"
            strokeWidth="0.9"
            opacity="0.72"
          />

          <path
            d="M-210 420 C130 240 405 185 690 315 C960 438 1200 420 1460 300 C1690 195 1870 190 2040 285"
            strokeWidth="0.6"
            opacity="0.22"
          />
        </g>
      </motion.svg>
    </div>
  );
}

function ArchitecturalColumns() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-4"
    >
      <span className="border-r border-white/[0.022]" />
      <span className="border-r border-white/[0.022]" />
      <span className="border-r border-white/[0.022]" />
      <span />
    </div>
  );
}

function SoftAtmosphere({
  position = "center",
}: {
  position?: "left" | "center" | "right";
}) {
  const positionClass =
    position === "left"
      ? "-left-[16rem]"
      : position === "right"
        ? "-right-[16rem]"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block"
    >
      <div
        className={[
          "absolute top-[12%] h-[38rem] w-[38rem] rounded-full blur-[145px]",
          "bg-[#DEDA00]/[0.025]",
          positionClass,
        ].join(" ")}
      />

      <div
        className={[
          "absolute top-[32%] h-[30rem] w-[30rem] rounded-full blur-[140px]",
          "bg-[#0D566D]/[0.10]",
          position === "left" ? "left-[10rem]" : positionClass,
        ].join(" ")}
      />
    </div>
  );
}

export default LandingPage;