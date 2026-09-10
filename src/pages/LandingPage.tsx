import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleCheckBigIcon,
  CircleDotIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  HammerIcon,
  HardHatIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  MessageSquareIcon,
  PaintbrushIcon,
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

const themePrimaryActionClass = [
  "bg-primary text-brand-primary",
  "hover:bg-primary/90 hover:text-brand-primary",
  "dark:text-primary-foreground",
  "dark:hover:text-primary-foreground",
].join(" ");

const brandActionClass = [
  "bg-brand-primary text-zinc-950",
  "hover:bg-brand-primary/90 hover:text-zinc-950",
].join(" ");

const platformFeatures = [
  {
    icon: SearchIcon,
    title: "Find by skill",
    description:
      "Start with the work you need done and find people with relevant experience.",
    surface: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-300",
  },
  {
    icon: LayoutDashboardIcon,
    title: "Run the project",
    description:
      "Keep tasks, deadlines, people and progress together after the match.",
    surface: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-300",
  },
  {
    icon: MessageSquareIcon,
    title: "Keep the context",
    description:
      "Comments and project information stay connected to the work.",
    surface: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-300",
  },
];

const services = [
  {
    title: "Electrical",
    description:
      "Electrical repairs, installations, wiring, fault finding and maintenance.",
    icon: ZapIcon,
    image:
      "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",
    iconClass: "text-amber-700",
    heightClass: "h-[360px] lg:h-[390px]",
  },
  {
    title: "Carpentry & Joinery",
    description:
      "Furniture, cabinetry, fittings, repairs and custom woodwork.",
    icon: HammerIcon,
    image:
      "https://images.pexels.com/photos/6791496/pexels-photo-6791496.jpeg",
    iconClass: "text-orange-700",
    heightClass: "h-[430px] lg:h-[470px]",
  },
  {
    title: "Construction",
    description:
      "Builders, renovations, tiling, structural work and specialist trades.",
    icon: HardHatIcon,
    image:
      "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg",
    iconClass: "text-yellow-700",
    heightClass: "h-[380px] lg:h-[420px]",
  },
  {
    title: "Painting & Finishing",
    description:
      "Painting, decorating, surface preparation and finishing work.",
    icon: PaintbrushIcon,
    image:
      "https://images.pexels.com/photos/5973958/pexels-photo-5973958.jpeg",
    iconClass: "text-violet-700",
    heightClass: "h-[420px] lg:h-[460px]",
  },
  {
    title: "Repairs & Maintenance",
    description:
      "Home repairs, plumbing, installations and general property maintenance.",
    icon: WrenchIcon,
    image:
      "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",
    iconClass: "text-teal-700",
    heightClass: "h-[350px] lg:h-[380px]",
  },
  {
    title: "Transport & Delivery",
    description:
      "Moving, deliveries, courier work and dependable transport support.",
    icon: TruckIcon,
    image:
      "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg",
    iconClass: "text-cyan-700",
    heightClass: "h-[400px] lg:h-[440px]",
  },
];

const projectLayers = [
  {
    number: "01",
    label: "Brief",
    title: "Start with a clear job.",
    description:
      "Describe what needs doing, where the work is and what a good outcome looks like.",
    icon: FileTextIcon,
    iconSurface:
      "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    activeIconSurface:
      "bg-violet-600 text-white dark:bg-violet-400 dark:text-zinc-950",
    activeBorder: "border-violet-500/45",
    glow: "bg-violet-500/10",
    preview: "border-violet-500/15 bg-violet-500/[0.055]",
    accent: "bg-violet-500",
  },
  {
    number: "02",
    label: "Match",
    title: "Bring in the right skills.",
    description:
      "Find the electrician, carpenter, builder or specialist the project actually needs.",
    icon: UsersIcon,
    iconSurface:
      "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    activeIconSurface:
      "bg-sky-600 text-white dark:bg-sky-400 dark:text-zinc-950",
    activeBorder: "border-sky-500/45",
    glow: "bg-sky-500/10",
    preview: "border-sky-500/15 bg-sky-500/[0.055]",
    accent: "bg-sky-500",
  },
  {
    number: "03",
    label: "Work",
    title: "Keep execution moving.",
    description:
      "Tasks, deadlines and updates stay together while Allocats manage the work.",
    icon: ListTodoIcon,
    iconSurface:
      "bg-brand-primary/10 text-foreground dark:text-brand-primary",
    activeIconSurface:
      "bg-brand-primary text-zinc-950",
    activeBorder: "border-brand-primary/50",
    glow: "bg-brand-primary/10",
    preview: "border-brand-primary/20 bg-brand-primary/[0.06]",
    accent: "bg-brand-primary",
  },
  {
    number: "04",
    label: "Review",
    title: "Finish with confidence.",
    description:
      "Follow progress and review the finished outcome when the work is ready.",
    icon: ClipboardCheckIcon,
    iconSurface:
      "bg-teal-500/10 text-teal-600 dark:text-teal-300",
    activeIconSurface:
      "bg-teal-600 text-white dark:bg-teal-400 dark:text-zinc-950",
    activeBorder: "border-teal-500/45",
    glow: "bg-teal-500/10",
    preview: "border-teal-500/15 bg-teal-500/[0.055]",
    accent: "bg-teal-500",
  },
];

const trustPoints = [
  {
    icon: BadgeCheckIcon,
    title: "Relevant experience",
    description:
      "Review skills and professional experience before deciding who to work with.",
    surface: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-300",
  },
  {
    icon: StarIcon,
    title: "Better context",
    description:
      "Make decisions with more than a name or a broad job title.",
    surface: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-300",
  },
  {
    icon: ShieldCheckIcon,
    title: "Clear project visibility",
    description:
      "See the people, tasks, conversations and progress around the job.",
    surface: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-300",
  },
];

const clientRolePoints = [
  "Create the project and define the outcome",
  "Follow progress and stay part of the conversation",
  "Review the finished work and make the final decision",
];

const allocatRolePoints = [
  "Take responsibility for project execution",
  "Manage tasks, deadlines and day-to-day progress",
  "Submit completed work when it is ready for review",
];

const HERO_IMAGE =
  "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg";

const SECONDARY_HERO_IMAGE =
  "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg";

const PROJECT_IMAGE =
  "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg";

function LandingPage() {
  const { user } = useAuth();

  const postTaskHref = user
    ? "/projects/new"
    : "/register";

  const allocatCtaHref = user?.isAllocat
    ? "/projects"
    : "/become-an-allocat";

  const allocatCtaLabel = user?.isAllocat
    ? "View projects"
    : "Become an Allocat";

  return (
    <>
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-background text-foreground">
        <section className="relative overflow-hidden pb-20 pt-24 sm:pt-28 lg:pb-28 lg:pt-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-52 top-20 h-[460px] w-[460px] rounded-full bg-brand-primary/[0.065] blur-[120px]" />

            <div className="absolute -right-40 -top-20 h-[540px] w-[540px] rounded-full bg-violet-500/[0.05] blur-[130px]" />

            <div className="absolute bottom-[-12rem] left-[42%] h-[360px] w-[360px] rounded-full bg-sky-500/[0.035] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <motion.div
                className="relative z-10"
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  ease: "easeOut",
                }}
              >
                <motion.div
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-3 py-2 text-card-foreground shadow-sm"
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.12,
                    duration: 0.4,
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary">
                    <img
                      src={assets.allocatrIcon}
                      alt=""
                      className="h-4 w-4 object-contain"
                    />
                  </span>

                  <span className="pr-1 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                    Work, properly allocated
                  </span>
                </motion.div>

                <h1 className="mt-7 max-w-[10ch] text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-7xl lg:text-[5.1rem] xl:text-[5.8rem]">
                  Find the skill.

                  <span className="relative mt-1 block w-fit">
                    <span className="relative z-10">
                      Get the job done.
                    </span>

                    <motion.span
                      className={[
                        "absolute bottom-[0.02em] left-[3%] z-0",
                        "h-[0.15em] w-[94%] origin-left rounded-full",
                        "bg-brand-primary/55",
                      ].join(" ")}
                      initial={{
                        scaleX: 0,
                      }}
                      animate={{
                        scaleX: 1,
                      }}
                      transition={{
                        delay: 0.6,
                        duration: 0.65,
                        ease: "easeOut",
                      }}
                    />
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Find electricians, carpenters, builders and other skilled
                  professionals, then manage the project from first task to
                  final review.
                </p>

                <motion.div
                  className="mt-9 flex flex-col gap-3 sm:flex-row"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.28,
                    duration: 0.5,
                  }}
                >
                  <Button
                    asChild
                    className={[
                      "group h-12 rounded-lg px-7 shadow-none",
                      themePrimaryActionClass,
                    ].join(" ")}
                  >
                    <Link to="/allocats">
                      Find an Allocat

                      <ArrowRightIcon
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-lg px-7 shadow-none"
                  >
                    <Link to={postTaskHref}>
                      Post a task
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.48,
                    duration: 0.45,
                  }}
                >
                  <HeroCheck>
                    Search by skill
                  </HeroCheck>

                  <HeroCheck>
                    Manage the project
                  </HeroCheck>

                  <HeroCheck>
                    Follow progress
                  </HeroCheck>
                </motion.div>
              </motion.div>

              <HeroVisual />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-44 top-20 h-80 w-80 rounded-full bg-sky-500/[0.04] blur-[100px]" />

            <div className="absolute -left-40 bottom-10 h-72 w-72 rounded-full bg-amber-500/[0.03] blur-[100px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-20">
              <motion.div
                className="relative min-h-[500px]"
                initial={{
                  opacity: 0,
                  x: -24,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.65,
                  ease: "easeOut",
                }}
              >
                <div className="absolute inset-y-0 left-0 w-[82%] overflow-hidden rounded-[2rem]">
                  <img
                    src={PROJECT_IMAGE}
                    alt="Tradesperson working on a project"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <motion.div
                  className="absolute bottom-8 right-0 w-[58%] rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.18,
                    duration: 0.55,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                >
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Skills needed
                  </p>

                  <div className="mt-4 space-y-3">
                    <SkillMatchRow
                      icon={ZapIcon}
                      label="Electrician"
                      detail="Power & lighting"
                      surface="bg-amber-500/10"
                      iconClass="text-amber-600 dark:text-amber-300"
                    />

                    <SkillMatchRow
                      icon={HammerIcon}
                      label="Carpenter"
                      detail="Cabinet installation"
                      surface="bg-orange-500/10"
                      iconClass="text-orange-600 dark:text-orange-300"
                    />

                    <SkillMatchRow
                      icon={PaintbrushIcon}
                      label="Painter"
                      detail="Final finishing"
                      surface="bg-violet-500/10"
                      iconClass="text-violet-600 dark:text-violet-300"
                    />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <SectionEyebrow>
                  Built for real work
                </SectionEyebrow>

                <h2 className="mt-5 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  The match is only{" "}
                  <AccentUnderline>
                    the start.
                  </AccentUnderline>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Allocatr connects finding the right person with the work
                  that happens afterwards.
                </p>

                <div className="mt-10 border-y border-border">
                  {platformFeatures.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                      <motion.div
                        key={feature.title}
                        className="group grid gap-4 border-b border-border py-6 last:border-b-0 sm:grid-cols-[44px_1fr] sm:gap-5"
                        initial={{
                          opacity: 0,
                          x: 14,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay: index * 0.07,
                          duration: 0.4,
                        }}
                      >
                        <span
                          className={[
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            "transition-transform duration-300 group-hover:scale-105",
                            feature.surface,
                            feature.iconClass,
                          ].join(" ")}
                        >
                          <Icon size={18} />
                        </span>

                        <div>
                          <h3 className="text-base font-bold">
                            {feature.title}
                          </h3>

                          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <LayeredProjectSection />

        <section className="relative overflow-hidden bg-zinc-950 py-20 text-white lg:py-28">
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute -left-32 top-[-16rem] h-[580px] w-[580px] rounded-full border border-white/[0.06]"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 55,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="absolute -right-28 bottom-[-12rem] h-[400px] w-[400px] rounded-full border border-white/[0.06]" />

            <div className="absolute right-[20%] top-[14%] h-64 w-64 rounded-full bg-brand-primary/[0.075] blur-[110px]" />

            <div className="absolute bottom-[-4rem] left-[28%] h-56 w-56 rounded-full bg-violet-500/[0.045] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-zinc-950">
                  <LayoutDashboardIcon size={20} />
                </span>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Project workspace
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  See the job{" "}
                  <span className="text-brand-primary">
                    moving.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                  Follow work from preparation through installation and
                  finishing without turning the client into the person
                  managing every task.
                </p>

                <Button
                  asChild
                  className={[
                    "mt-8 h-11 rounded-lg px-6 shadow-none",
                    brandActionClass,
                  ].join(" ")}
                >
                  <Link to={postTaskHref}>
                    Start a project
                    <ArrowRightIcon size={15} />
                  </Link>
                </Button>
              </motion.div>

              <AnimatedTaskBoard />
            </div>
          </div>
        </section>

        <ServiceMosaicSection />

        <RoleWorkspaceSection
          postTaskHref={postTaskHref}
          allocatCtaHref={allocatCtaHref}
          allocatCtaLabel={allocatCtaLabel}
        />

        <section className="relative overflow-hidden bg-muted/30 py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-10 h-64 w-64 rounded-full bg-teal-500/[0.035] blur-[100px]" />

            <div className="absolute bottom-0 right-[8%] h-72 w-72 rounded-full bg-sky-500/[0.03] blur-[100px]" />

            <div className="absolute left-[46%] top-[30%] h-52 w-52 rounded-full bg-brand-primary/[0.025] blur-[100px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <motion.div
              className="max-w-3xl"
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
                duration: 0.55,
              }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
                <ShieldCheckIcon size={21} />
              </span>

              <div className="mt-6">
                <SectionEyebrow>
                  Better context
                </SectionEyebrow>
              </div>

              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Know more before{" "}
                <AccentUnderline>
                  the work starts.
                </AccentUnderline>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                Better information makes it easier to choose who you work
                with and understand what is happening once the project begins.
              </p>
            </motion.div>

            <div className="mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;

                return (
                  <motion.article
                    key={point.title}
                    className={[
                      "group rounded-2xl border border-border",
                      "bg-card p-7 text-card-foreground",
                      "transition-all duration-300",
                      "hover:border-foreground/10",
                      "hover:shadow-lg hover:shadow-black/[0.035]",
                    ].join(" ")}
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
                    }}
                    transition={{
                      delay: index * 0.07,
                      duration: 0.45,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                  >
                    <span
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        "transition-transform duration-300 group-hover:scale-105",
                        point.surface,
                        point.iconClass,
                      ].join(" ")}
                    >
                      <Icon size={19} />
                    </span>

                    <h3 className="mt-6 text-lg font-black">
                      {point.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {point.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute -right-36 -top-48 h-[560px] w-[560px] rounded-full border border-white/[0.06]" />

          <div className="pointer-events-none absolute right-[8%] top-[-8rem] h-[360px] w-[360px] rounded-full bg-brand-primary/[0.075] blur-[110px]" />

          <div className="pointer-events-none absolute bottom-[-10rem] left-[12%] h-72 w-72 rounded-full bg-violet-500/[0.045] blur-[120px]" />

          <motion.img
            src={assets.allocatrIcon}
            alt=""
            className="pointer-events-none absolute -bottom-24 -right-14 w-72 rotate-12 opacity-[0.05] sm:w-[28rem]"
            animate={{
              rotate: [12, 9, 12],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <motion.div
                className="max-w-4xl"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Ready when the work is
                </p>

                <h2 className="mt-5 text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
                  Find the right skill.

                  <span className="block text-brand-primary">
                    Get things moving.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  Find the right professional for your next job or put
                  your own practical experience to work.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col gap-3 sm:flex-row lg:flex-col"
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.08,
                  duration: 0.45,
                }}
              >
                <Button
                  asChild
                  className={[
                    "group h-12 rounded-lg px-7 shadow-none",
                    brandActionClass,
                  ].join(" ")}
                >
                  <Link to="/allocats">
                    Find Allocats

                    <ArrowRightIcon
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className={[
                    "h-12 rounded-lg px-7 shadow-none",
                    "border-white/25 bg-transparent text-white",
                    "hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <Link to={allocatCtaHref}>
                    {allocatCtaLabel}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

function ServiceMosaicSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-44 top-[20%] h-80 w-80 rounded-full bg-sky-500/[0.035] blur-[110px]" />

        <div className="absolute -right-44 bottom-[12%] h-80 w-80 rounded-full bg-violet-500/[0.035] blur-[110px]" />

        <div className="absolute left-[42%] top-[36%] h-64 w-64 rounded-full bg-brand-primary/[0.025] blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            className="max-w-3xl"
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
              duration: 0.55,
            }}
          >
            <SectionEyebrow>
              Explore skilled work
            </SectionEyebrow>

            <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Real skills for{" "}
              <AccentUnderline>
                real jobs.
              </AccentUnderline>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              From everyday repairs to construction, transport and specialist
              finishing work.
            </p>
          </motion.div>

          <Button
            asChild
            className={[
              "h-11 w-fit rounded-lg px-6 shadow-none",
              themePrimaryActionClass,
            ].join(" ")}
          >
            <Link to="/allocats">
              Explore all skills
              <ArrowUpRightIcon size={15} />
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-14 max-w-7xl columns-1 gap-5 sm:columns-2 lg:columns-3">
          {services.map((service, index) => (
            <ServiceMosaicCard
              key={service.title}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceMosaicCard({
  service,
  index,
}: {
  service: {
    title: string;
    description: string;
    icon: LucideIcon;
    image: string;
    iconClass: string;
    heightClass: string;
  };
  index: number;
}) {
  const Icon = service.icon;

  return (
    <motion.article
      className={[
        "group mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem]",
        "bg-zinc-950",
        service.heightClass,
      ].join(" ")}
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        delay: (index % 3) * 0.05,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
      }}
    >
      <Link
        to="/allocats"
        className="relative block h-full w-full overflow-hidden rounded-[1.5rem]"
      >
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className={[
            "absolute inset-0 h-full w-full object-cover",
            "transition-[transform,filter] duration-700 ease-out",
            "group-hover:scale-[1.045]",
            "group-hover:brightness-[0.96]",
          ].join(" ")}
        />

        <div
          className={[
            "absolute inset-0",
            "bg-gradient-to-t from-black/85 via-black/10 to-black/[0.04]",
            "transition-all duration-500",
            "group-hover:from-black/90 group-hover:via-black/25",
          ].join(" ")}
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-xl",
              "bg-white/95",
              "transition-transform duration-300 ease-out",
              "group-hover:-translate-y-0.5",
              service.iconClass,
            ].join(" ")}
          >
            <Icon size={18} />
          </span>

          <span className="rounded-md bg-black/30 px-2.5 py-1.5 text-[0.56rem] font-semibold tracking-[0.12em] text-white/75 backdrop-blur-md">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div
            className={[
              "transition-transform duration-500 ease-out",
              "lg:translate-y-[62px]",
              "lg:group-hover:translate-y-0",
            ].join(" ")}
          >
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/55">
              Skilled work
            </p>

            <div className="mt-2 flex items-end justify-between gap-5">
              <h3 className="max-w-[85%] text-2xl font-black leading-[0.98] tracking-[-0.035em] text-white sm:text-3xl">
                {service.title}
              </h3>

              <span
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  "bg-brand-primary text-zinc-950",
                  "transition-all duration-300 ease-out",
                  "lg:scale-95 lg:opacity-0",
                  "lg:group-hover:scale-100",
                  "lg:group-hover:opacity-100",
                ].join(" ")}
              >
                <ArrowUpRightIcon size={15} />
              </span>
            </div>

            <div
              className={[
                "mt-4 border-t border-white/15 pt-4",
                "transition-all duration-500 ease-out",
                "lg:translate-y-2 lg:opacity-0",
                "lg:group-hover:translate-y-0",
                "lg:group-hover:opacity-100",
              ].join(" ")}
            >
              <p className="text-sm leading-6 text-white/70">
                {service.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-primary">
                Find Allocats

                <ArrowRightIcon
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function RoleWorkspaceSection({
  postTaskHref,
  allocatCtaHref,
  allocatCtaLabel,
}: {
  postTaskHref: string;
  allocatCtaHref: string;
  allocatCtaLabel: string;
}) {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-44 top-10 h-80 w-80 rounded-full bg-brand-primary/[0.025] blur-[110px]" />

        <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-violet-500/[0.025] blur-[110px]" />
      </div>

      <div className="container relative mx-auto px-5 md:px-8">
        <motion.div
          className="max-w-3xl"
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
            duration: 0.55,
          }}
        >
          <SectionEyebrow>
            Two sides of the project
          </SectionEyebrow>

          <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Clear roles.{" "}
            <AccentUnderline>
              One shared project.
            </AccentUnderline>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Clients stay in control of the outcome while Allocats manage
            execution. Both sides stay connected to the same work.
          </p>
        </motion.div>

        <motion.div
          className="relative mt-12 overflow-hidden rounded-[2rem] border border-border bg-card"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/15 text-foreground">
                <LayoutDashboardIcon size={16} />
              </span>

              <div>
                <p className="text-sm font-black">
                  Shared project workspace
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Same information. Role-aware controls.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[0.62rem] font-semibold text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              Connected from brief to review
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            <RoleWorkspacePane
              eyebrow="For clients"
              title="Own the outcome."
              description="Set the direction, stay informed and make the final call when the work is ready."
              icon={UsersIcon}
              items={clientRolePoints}
              href={postTaskHref}
              buttonLabel="Post a task"
            />

            <RoleWorkspacePane
              eyebrow="For Allocats"
              title="Own the execution."
              description="Take the project forward, manage the tasks and keep the work moving toward completion."
              icon={BriefcaseBusinessIcon}
              items={allocatRolePoints}
              href={allocatCtaHref}
              buttonLabel={allocatCtaLabel}
              dark
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RoleWorkspacePane({
  eyebrow,
  title,
  description,
  icon: Icon,
  items,
  href,
  buttonLabel,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
  href: string;
  buttonLabel: string;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden p-7 sm:p-9 lg:p-10",
        dark
          ? "bg-zinc-950 text-white"
          : "bg-card text-card-foreground",
      ].join(" ")}
    >
      {dark && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-primary/[0.07] blur-3xl" />

          <img
            src={assets.allocatrIcon}
            alt=""
            className="pointer-events-none absolute -bottom-12 -right-6 w-48 rotate-12 opacity-[0.045]"
          />
        </>
      )}

      <div className="relative">
        <div className="flex items-center justify-between gap-5">
          <span
            className={[
              "flex h-11 w-11 items-center justify-center rounded-xl",
              dark
                ? "bg-brand-primary text-zinc-950"
                : "bg-violet-500/10 text-violet-600 dark:text-violet-300",
            ].join(" ")}
          >
            <Icon size={19} />
          </span>

          <span
            className={[
              "text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
              dark
                ? "text-white/40"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {eyebrow}
          </span>
        </div>

        <h3
          className={[
            "mt-8 max-w-lg text-4xl font-black leading-[0.96] tracking-[-0.04em]",
            dark ? "text-white" : "",
          ].join(" ")}
        >
          {title}
        </h3>

        <p
          className={[
            "mt-5 max-w-lg text-sm leading-7",
            dark
              ? "text-white/60"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {description}
        </p>

        <div
          className={[
            "mt-8 border-t pt-6",
            dark
              ? "border-white/10"
              : "border-border",
          ].join(" ")}
        >
          <div className="space-y-3.5">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3"
              >
                <CheckCircle2Icon
                  size={15}
                  className={[
                    "mt-0.5 shrink-0",
                    dark
                      ? "text-brand-primary"
                      : "text-foreground/55",
                  ].join(" ")}
                />

                <span
                  className={[
                    "text-sm leading-6",
                    dark
                      ? "text-white/70"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          asChild
          className={[
            "mt-8 h-11 rounded-lg px-6 shadow-none",
            dark
              ? brandActionClass
              : themePrimaryActionClass,
          ].join(" ")}
        >
          <Link to={href}>
            {buttonLabel}
            <ArrowRightIcon size={15} />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function LayeredProjectSection() {
  const [activeLayer, setActiveLayer] = useState(1);

  const rotations = [
    -2.5,
    -0.8,
    1.2,
    2.5,
  ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-violet-500/[0.035] blur-[110px]" />

        <div className="absolute right-[10%] top-[25%] h-72 w-72 rounded-full bg-sky-500/[0.035] blur-[110px]" />

        <div className="absolute bottom-[-8rem] left-[44%] h-64 w-64 rounded-full bg-brand-primary/[0.04] blur-[110px]" />
      </div>

      <div className="container relative mx-auto px-5 md:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <SectionEyebrow>
            Everything around the job
          </SectionEyebrow>

          <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            One project.{" "}
            <AccentUnderline>
              Every important part.
            </AccentUnderline>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            From the first brief to final review, the pieces of the job
            stay connected instead of disappearing into different tools
            and conversations.
          </p>
        </motion.div>

        <div
          className={[
            "mx-auto mt-16 flex max-w-7xl flex-col gap-4",
            "lg:min-h-[400px] lg:flex-row lg:items-stretch",
            "lg:justify-center lg:gap-0",
          ].join(" ")}
        >
          {projectLayers.map((item, index) => {
            const Icon = item.icon;
            const active = activeLayer === index;

            return (
              <motion.article
                key={item.number}
                tabIndex={0}
                onMouseEnter={() => setActiveLayer(index)}
                onFocus={() => setActiveLayer(index)}
                onClick={() => setActiveLayer(index)}
                className={[
                  "relative min-h-[320px] w-full cursor-default",
                  "overflow-hidden rounded-[1.7rem] border",
                  "bg-card p-6 text-card-foreground outline-none",
                  "sm:p-7 lg:w-[29%]",
                  index > 0
                    ? "lg:-ml-8 xl:-ml-10"
                    : "",
                  active
                    ? [
                        item.activeBorder,
                        "shadow-2xl shadow-black/[0.1]",
                      ].join(" ")
                    : [
                        "border-border",
                        "shadow-lg shadow-black/[0.035]",
                      ].join(" "),
                ].join(" ")}
                style={{
                  zIndex: active
                    ? 50
                    : 10 + index,
                }}
                animate={{
                  y: active ? -14 : 0,
                  rotate: active
                    ? 0
                    : rotations[index],
                  scale: active ? 1.02 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 29,
                  mass: 0.85,
                }}
              >
                <motion.div
                  className={[
                    "pointer-events-none absolute -right-12 -top-12",
                    "h-40 w-40 rounded-full blur-3xl",
                    item.glow,
                  ].join(" ")}
                  animate={{
                    opacity: active ? 0.85 : 0.22,
                    scale: active ? 1.12 : 1,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <motion.span
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      active
                        ? item.activeIconSurface
                        : item.iconSurface,
                    ].join(" ")}
                    animate={{
                      scale: active ? 1.05 : 1,
                      rotate: active ? 0 : -2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <Icon size={20} />
                  </motion.span>

                  <span className="text-[0.62rem] font-black tracking-[0.12em] text-muted-foreground">
                    {item.number}
                  </span>
                </div>

                <div className="relative">
                  <p className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {item.label}
                  </p>

                  <h3 className="mt-3 text-2xl font-black leading-[1] tracking-[-0.035em]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>

                  <LayerCardPreview
                    index={index}
                    active={active}
                    previewClass={item.preview}
                    accentClass={item.accent}
                  />
                </div>

                <motion.div
                  className={[
                    "absolute bottom-0 left-0 h-[3px]",
                    item.accent,
                  ].join(" ")}
                  animate={{
                    width: active
                      ? "100%"
                      : "20%",
                  }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                />
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mx-auto mt-9 flex max-w-2xl items-start justify-center gap-3 text-center"
          initial={{
            opacity: 0,
            y: 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.12,
            duration: 0.45,
          }}
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15 text-foreground">
            <LayoutDashboardIcon size={13} />
          </span>

          <p className="max-w-xl text-xs leading-6 text-muted-foreground">
            Clients can follow progress and comment while Allocats manage
            task execution in the same project workspace.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function LayerCardPreview({
  index,
  active,
  previewClass,
  accentClass,
}: {
  index: number;
  active: boolean;
  previewClass: string;
  accentClass: string;
}) {
  return (
    <motion.div
      className={[
        "mt-8 rounded-xl border p-4",
        active
          ? previewClass
          : "border-border bg-muted/35",
      ].join(" ")}
      animate={{
        y: active ? -2 : 0,
        scale: active ? 1.008 : 1,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      {index === 0 && (
        <>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Kitchen renovation
          </p>

          <div className="mt-4 space-y-2">
            <PreviewLine
              width="w-full"
              accentClass={accentClass}
              active={active}
            />

            <PreviewLine
              width="w-[78%]"
              accentClass={accentClass}
              active={active}
            />

            <PreviewLine
              width="w-[52%]"
              accentClass={accentClass}
              active={active}
            />
          </div>
        </>
      )}

      {index === 1 && (
        <>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Skills matched
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <PreviewSkill
              icon={ZapIcon}
              label="Electrician"
              surface="bg-amber-500/10"
              iconClass="text-amber-600 dark:text-amber-300"
            />

            <PreviewSkill
              icon={HammerIcon}
              label="Carpenter"
              surface="bg-orange-500/10"
              iconClass="text-orange-600 dark:text-orange-300"
            />
          </div>
        </>
      )}

      {index === 2 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Project progress
            </p>

            <span className="text-xs font-black">
              68%
            </span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
            <motion.div
              className={[
                "h-full rounded-full",
                accentClass,
              ].join(" ")}
              animate={{
                width: active
                  ? "68%"
                  : "42%",
              }}
              transition={{
                duration: 0.4,
              }}
            />
          </div>

          <p className="mt-3 text-[0.58rem] text-muted-foreground">
            8 of 12 tasks moving
          </p>
        </>
      )}

      {index === 3 && (
        <>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Final review
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300">
              <CircleCheckBigIcon size={14} />
            </span>

            <div>
              <p className="text-xs font-bold">
                Work ready
              </p>

              <p className="mt-0.5 text-[0.56rem] text-muted-foreground">
                Awaiting client review
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function PreviewLine({
  width,
  accentClass,
  active,
}: {
  width: string;
  accentClass: string;
  active: boolean;
}) {
  return (
    <span
      className={[
        "block h-1.5 rounded-full",
        width,
        active
          ? `${accentClass} opacity-25`
          : "bg-border",
      ].join(" ")}
    />
  );
}

function PreviewSkill({
  icon: Icon,
  label,
  surface,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  surface: string;
  iconClass: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[0.6rem] font-semibold">
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded",
          surface,
          iconClass,
        ].join(" ")}
      >
        <Icon size={10} />
      </span>

      {label}
    </span>
  );
}

function HeroVisual() {
  return (
    <motion.div
      className="relative min-h-[570px] sm:min-h-[650px] lg:min-h-[680px]"
      initial={{
        opacity: 0,
        x: 32,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: 0.12,
        duration: 0.75,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="absolute right-0 top-0 h-[78%] w-[82%] overflow-hidden rounded-[2.2rem]"
        whileHover={{
          scale: 1.006,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <img
          src={HERO_IMAGE}
          alt="Skilled tradesperson carrying out repair work"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        className="absolute left-0 top-[14%] h-[42%] w-[38%] overflow-hidden rounded-[1.7rem] border-[6px] border-background shadow-xl"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={SECONDARY_HERO_IMAGE}
          alt="Construction professional at work"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute right-[4%] top-5 rounded-xl border border-white/20 bg-black/55 px-4 py-3 text-white shadow-lg backdrop-blur-xl"
        animate={{
          y: [0, 3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <p className="text-[0.56rem] uppercase tracking-[0.15em] text-white/60">
          Matching now
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-white">
          <span className="h-2 w-2 rounded-full bg-brand-primary" />
          Skilled trades available
        </div>
      </motion.div>

      <motion.div
        className={[
          "absolute bottom-[5%] left-[10%] right-0",
          "rounded-[1.7rem] border border-border",
          "bg-card/95 p-5 text-card-foreground",
          "shadow-2xl backdrop-blur-xl",
          "sm:left-[16%] sm:p-6",
        ].join(" ")}
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.48,
          duration: 0.65,
        }}
        whileHover={{
          y: -3,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Project workspace
            </p>

            <h2 className="mt-1 text-lg font-black tracking-[-0.025em]">
              Kitchen renovation
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary/15 px-2.5 py-1.5 text-[0.64rem] font-semibold text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
            Active
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <HeroMetric
            label="Progress"
            value="68%"
          />

          <HeroMetric
            label="Tasks"
            value="12"
          />

          <HeroMetric
            label="Allocats"
            value="2"
          />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-[0.62rem] text-muted-foreground">
            <span>Project progress</span>
            <span>68%</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-dark-gray"
              initial={{
                width: 0,
              }}
              animate={{
                width: "68%",
              }}
              transition={{
                delay: 0.9,
                duration: 1,
                ease: "easeOut",
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className={[
          "absolute bottom-[23%] right-[-0.5rem] hidden w-48",
          "rounded-xl border border-border",
          "bg-card p-3 text-card-foreground shadow-xl",
          "sm:block",
        ].join(" ")}
        animate={{
          y: [0, -4, 0],
          rotate: [0, 0.4, 0],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <ZapIcon size={15} />
          </span>

          <div>
            <p className="text-[0.58rem] text-muted-foreground">
              New match
            </p>

            <p className="text-xs font-bold">
              Electrician
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkillMatchRow({
  icon: Icon,
  label,
  detail,
  surface,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
  surface: string;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          surface,
          iconClass,
        ].join(" ")}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-bold">
          {label}
        </p>

        <p className="text-xs text-muted-foreground">
          {detail}
        </p>
      </div>

      <CheckCircle2Icon
        size={15}
        className="ml-auto shrink-0 text-teal-600 dark:text-teal-300"
      />
    </div>
  );
}

function AnimatedTaskBoard() {
  return (
    <motion.div
      className={[
        "rounded-[1.75rem] border p-4 shadow-2xl",
        "border-zinc-200/80 bg-white text-zinc-950",
        "transition-colors duration-300",
        "dark:border-white/10 dark:bg-zinc-900 dark:text-white",
        "dark:shadow-black/35",
        "sm:p-6",
      ].join(" ")}
      initial={{
        opacity: 0,
        scale: 0.975,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.65,
      }}
      whileHover={{
        y: -3,
      }}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-white/10">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-white/40">
            Project workspace
          </p>

          <p className="mt-1 text-sm font-black text-zinc-950 dark:text-white">
            Kitchen renovation
          </p>
        </div>

        <span className="rounded-md bg-brand-primary px-2.5 py-1 text-[0.62rem] font-semibold text-zinc-950">
          68% complete
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <TaskLane
          title="Pending"
          accent="bg-amber-500"
        >
          <MiniTask
            title="Fit cabinet doors"
            meta="Due 14 Sep"
          />

          <MiniTask
            title="Paint touch-ups"
            meta="Due 16 Sep"
          />
        </TaskLane>

        <TaskLane
          title="In progress"
          accent="bg-brand-primary"
        >
          <motion.div
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MiniTask
              title="Install sockets"
              meta="Electrician on site"
              active
            />
          </motion.div>

          <MiniTask
            title="Build base units"
            meta="Carpentry"
          />
        </TaskLane>

        <TaskLane
          title="Complete"
          accent="bg-teal-500"
        >
          <MiniTask
            title="Site inspection"
            meta="Complete"
            complete
          />

          <MiniTask
            title="Remove old fittings"
            meta="Complete"
            complete
          />
        </TaskLane>
      </div>

      <div
        className={[
          "mt-5 flex items-center justify-between rounded-xl px-4 py-3",
          "bg-zinc-100 transition-colors duration-300",
          "dark:bg-white/[0.055]",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <MessageSquareIcon
            size={14}
            className="text-violet-600 dark:text-violet-300"
          />

          <span className="text-xs font-medium text-zinc-900 dark:text-white/80">
            Project conversation
          </span>
        </div>

        <span className="text-[0.62rem] text-zinc-500 dark:text-white/40">
          Everything in context
        </span>
      </div>
    </motion.div>
  );
}

function TaskLane({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-xl p-3",
        "bg-zinc-100/90 transition-colors duration-300",
        "dark:bg-white/[0.055]",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            accent,
          ].join(" ")}
        />

        <p className="text-[0.62rem] font-bold text-zinc-800 dark:text-white/70">
          {title}
        </p>
      </div>

      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function MiniTask({
  title,
  meta,
  active = false,
  complete = false,
}: {
  title: string;
  meta: string;
  active?: boolean;
  complete?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-lg border p-3",
        "border-zinc-200 bg-white shadow-sm",
        "transition-colors duration-300",
        "dark:border-white/10 dark:bg-zinc-950/70 dark:shadow-none",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        {complete ? (
          <CircleCheckBigIcon
            size={13}
            className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-300"
          />
        ) : active ? (
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-primary text-zinc-950">
            <CircleDotIcon size={10} />
          </span>
        ) : (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full border border-zinc-400 dark:border-white/30" />
        )}

        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold leading-4 text-zinc-900 dark:text-white/85">
            {title}
          </p>

          <p className="mt-1 text-[0.56rem] text-zinc-500 dark:text-white/40">
            {meta}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionEyebrow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-brand-primary" />

      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

function AccentUnderline({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">
        {children}
      </span>

      <span className="absolute bottom-[0.07em] left-[3%] right-[3%] z-0 h-[0.17em] rounded-full bg-brand-primary/55" />
    </span>
  );
}

function HeroCheck({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <CheckCircle2Icon
        size={15}
        strokeWidth={2}
        className="shrink-0 text-dark-gray dark:text-brand-primary"
      />

      <span>
        {children}
      </span>
    </span>
  );
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-l border-border pl-3 first:border-l-0 first:pl-0">
      <p className="text-[0.56rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xl font-black tracking-[-0.025em]">
        {value}
      </p>
    </div>
  );
}

export default LandingPage;