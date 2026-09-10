import {
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

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
  MessageSquareIcon,
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

const ABOUT_HERO_IMAGE =
  "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg";

const reasons = [
  {
    number: "01",
    title: "Skills should be easier to find.",
    description:
      "People should be able to start with the work they need done and find professionals with the relevant experience.",
    icon: SearchIcon,
    surface: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-300",
    accent: "bg-sky-500",
  },
  {
    number: "02",
    title: "The match should lead somewhere.",
    description:
      "Finding the right person is only the beginning. Tasks, communication and progress still need a clear place to live.",
    icon: TargetIcon,
    surface: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-300",
    accent: "bg-violet-500",
  },
  {
    number: "03",
    title: "Every job deserves structure.",
    description:
      "Whether it is a repair, installation or bigger project, both sides benefit when expectations and responsibilities are clear.",
    icon: LayoutDashboardIcon,
    surface: "bg-amber-500/10",
    iconClass: "text-amber-700 dark:text-amber-300",
    accent: "bg-brand-primary",
  },
];

const journey = [
  {
    number: "01",
    title: "Create the project",
    description:
      "Start with the work, expected outcome, timing and the information professionals need.",
    icon: FileTextIcon,
    surface: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-300",
  },
  {
    number: "02",
    title: "Find the skills",
    description:
      "Discover Allocats whose experience and capabilities fit what the project requires.",
    icon: UsersIcon,
    surface: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-300",
  },
  {
    number: "03",
    title: "Move the work",
    description:
      "Allocats manage execution while tasks, deadlines, comments and progress stay visible.",
    icon: WrenchIcon,
    surface: "bg-brand-primary/15",
    iconClass: "text-foreground",
  },
  {
    number: "04",
    title: "Review the outcome",
    description:
      "When the work is ready, the client reviews the completed project and decides what happens next.",
    icon: ClipboardCheckIcon,
    surface: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-300",
  },
];

const values = [
  {
    title: "Clarity",
    description:
      "The brief, responsibilities, tasks and progress should be easy for everyone involved to understand.",
    icon: CompassIcon,
    surface: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-300",
  },
  {
    title: "Trust",
    description:
      "Clients need useful context before choosing someone, and skilled professionals deserve a clear way to show what they can do.",
    icon: ShieldCheckIcon,
    surface: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-300",
  },
  {
    title: "Momentum",
    description:
      "Good tools should reduce friction and help work move forward instead of creating more administration.",
    icon: ZapIcon,
    surface: "bg-amber-500/10",
    iconClass: "text-amber-700 dark:text-amber-300",
  },
  {
    title: "Respect",
    description:
      "The person commissioning the work and the person delivering it both need clear responsibilities and a professional working relationship.",
    icon: HeartHandshakeIcon,
    surface: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-300",
  },
];

function AboutPage() {
  const { user } = useAuth();

  const postTaskHref = user
    ? "/projects/new"
    : "/register";

  const allocatHref = user?.isAllocat
    ? "/projects"
    : "/become-an-allocat";

  const allocatLabel = user?.isAllocat
    ? "View projects"
    : "Become an Allocat";

  return (
    <>
      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-background text-foreground">
        <section className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-52 top-16 h-[460px] w-[460px] rounded-full bg-brand-primary/[0.045] blur-[120px]" />

            <div className="absolute -right-48 -top-28 h-[560px] w-[560px] rounded-full bg-violet-500/[0.045] blur-[135px]" />

            <div className="absolute bottom-[-12rem] left-[48%] h-80 w-80 rounded-full bg-sky-500/[0.03] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 26,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
              >
                <SectionEyebrow>
                  About Allocatr
                </SectionEyebrow>

                <h1 className="mt-6 max-w-[11ch] text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.6rem]">
                  Skilled work should be easier to{" "}
                  <AccentUnderline>
                    make happen.
                  </AccentUnderline>
                </h1>

                <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Allocatr helps people find the skills a job needs, bring
                  the right professionals into the project and keep the work
                  moving in one shared workspace.
                </p>

                <motion.div
                  className="mt-9 flex flex-col gap-3 sm:flex-row"
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.25,
                    duration: 0.55,
                  }}
                >
                  <Button
                    asChild
                    className={[
                      "group h-12 rounded-lg px-7 shadow-none",
                      "bg-primary text-brand-primary",
                      "hover:bg-primary/90 hover:text-brand-primary",
                      "dark:text-primary-foreground",
                      "dark:hover:text-primary-foreground",
                    ].join(" ")}
                  >
                    <Link to="/allocats">
                      Find an Allocat

                      <ArrowRightIcon
                        size={16}
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
                      Start a project
                    </Link>
                  </Button>
                </motion.div>

                <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
                  <HeroFact>
                    Find by skill
                  </HeroFact>

                  <HeroFact>
                    Work in one place
                  </HeroFact>

                  <HeroFact>
                    Review the outcome
                  </HeroFact>
                </div>
              </motion.div>

              <AboutHeroVisual />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-sky-500/[0.035] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
              <motion.div
                className="max-w-xl"
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
              >
                <SectionEyebrow>
                  Why Allocatr exists
                </SectionEyebrow>

                <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Finding someone should not feel like{" "}
                  <AccentUnderline>
                    guesswork.
                  </AccentUnderline>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  People often know exactly what they need done but still
                  struggle to find the right person. At the same time,
                  capable professionals can struggle to reach the people
                  who need their skills.
                </p>

                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Allocatr is designed to make that connection clearer and
                  give the work somewhere structured to go once the match
                  has been made.
                </p>
              </motion.div>

              <div className="grid gap-4">
                {reasons.map((reason, index) => {
                  const Icon = reason.icon;

                  return (
                    <motion.article
                      key={reason.number}
                      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-7"
                      initial={{
                        opacity: 0,
                        x: 24,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.35,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.5,
                      }}
                      whileHover={{
                        x: 4,
                      }}
                    >
                      <div
                        className={[
                          "absolute bottom-0 left-0 top-0 w-[3px]",
                          reason.accent,
                        ].join(" ")}
                      />

                      <div className="grid gap-5 sm:grid-cols-[48px_1fr_auto] sm:items-start">
                        <span
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-xl",
                            "transition-transform duration-200 group-hover:scale-105",
                            reason.surface,
                            reason.iconClass,
                          ].join(" ")}
                        >
                          <Icon size={19} />
                        </span>

                        <div>
                          <h3 className="text-xl font-black tracking-[-0.025em]">
                            {reason.title}
                          </h3>

                          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                            {reason.description}
                          </p>
                        </div>

                        <span className="text-[0.62rem] font-black tracking-[0.14em] text-muted-foreground/60">
                          {reason.number}
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-24 md:px-8 lg:py-32">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-12 text-white sm:px-9 sm:py-16 lg:px-14 lg:py-20"
            initial={{
              opacity: 0,
              y: 28,
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
              duration: 0.65,
            }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-28 -top-32 h-96 w-96 rounded-full border border-white/[0.06]" />

              <div className="absolute right-[12%] top-[-7rem] h-80 w-80 rounded-full bg-brand-primary/[0.07] blur-[110px]" />

              <div className="absolute -bottom-20 left-[25%] h-64 w-64 rounded-full bg-violet-500/[0.05] blur-[100px]" />
            </div>

            <img
              src={assets.allocatrIcon}
              alt=""
              className="pointer-events-none absolute -bottom-16 -right-8 w-52 rotate-12 opacity-[0.05] sm:w-72"
            />

            <div className="relative grid gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:items-center lg:gap-20">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-zinc-950">
                  <SparklesIcon size={24} />
                </span>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  What is an Allocat?
                </p>
              </div>

              <div>
                <h2 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  A skilled professional who takes responsibility for{" "}
                  <span className="text-brand-primary">
                    getting the work done.
                  </span>
                </h2>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Allocats bring practical experience into projects that
                  need it. They are not simply names in a directory. Once
                  part of a project, they take responsibility for executing
                  the work and moving the tasks through to completion.
                </p>

                <Button
                  asChild
                  className="mt-8 h-11 rounded-lg bg-brand-primary px-6 text-zinc-950 shadow-none hover:bg-brand-primary/90 hover:text-zinc-950"
                >
                  <Link to="/allocats">
                    Explore Allocats
                    <ArrowRightIcon size={15} />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-24 h-72 w-72 rounded-full bg-violet-500/[0.035] blur-[110px]" />

            <div className="absolute -right-40 bottom-10 h-72 w-72 rounded-full bg-brand-primary/[0.03] blur-[110px]" />
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
            >
              <SectionEyebrow>
                One workspace
              </SectionEyebrow>

              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Two clear roles.{" "}
                <AccentUnderline>
                  One shared project.
                </AccentUnderline>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Both sides can understand what is happening without
                competing for control of the same work.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
              <motion.div
                className="overflow-hidden rounded-[1.8rem] border border-border bg-card p-4 shadow-sm sm:p-6"
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
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                }}
              >
                <div className="flex h-full min-h-[430px] items-center justify-center overflow-hidden rounded-[1.35rem] bg-muted/45 p-5 sm:p-8">
                  <img
                    src={assets.computerPhone}
                    alt="Allocatr shared project workspace"
                    className="block h-auto w-full object-contain"
                  />
                </div>
              </motion.div>

              <div className="grid gap-5">
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
                  dark
                />
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-3 text-center">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15">
                <LayoutDashboardIcon
                  size={13}
                  className="text-foreground"
                />
              </span>

              <p className="text-xs leading-6 text-muted-foreground">
                The same project stays visible to both sides while the
                controls change according to each person’s responsibility.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <motion.div
                className="max-w-xl"
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
              >
                <SectionEyebrow>
                  How the work moves
                </SectionEyebrow>

                <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  From the first brief to{" "}
                  <AccentUnderline>
                    final review.
                  </AccentUnderline>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Allocatr gives the working relationship a clear path
                  without making the platform more complicated than the
                  job itself.
                </p>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {journey.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.article
                      key={step.number}
                      className={[
                        "group flex min-h-[275px] flex-col justify-between",
                        "rounded-[1.6rem] border border-border",
                        "bg-card p-6 text-card-foreground sm:p-7",
                        "transition-shadow duration-200",
                        "hover:shadow-lg hover:shadow-black/[0.04]",
                      ].join(" ")}
                      initial={{
                        opacity: 0,
                        y: 22,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.25,
                      }}
                      transition={{
                        delay: index * 0.07,
                        duration: 0.5,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-xl",
                            "transition-transform duration-200 group-hover:scale-105",
                            step.surface,
                            step.iconClass,
                          ].join(" ")}
                        >
                          <Icon size={19} />
                        </span>

                        <span className="text-[0.62rem] font-black tracking-[0.14em] text-muted-foreground/60">
                          {step.number}
                        </span>
                      </div>

                      <div className="mt-14">
                        <h3 className="text-xl font-black tracking-[-0.025em]">
                          {step.title}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-zinc-950 py-24 text-white lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-44 -top-44 h-[500px] w-[500px] rounded-full border border-white/[0.055]" />

            <div className="absolute -right-36 bottom-[-10rem] h-96 w-96 rounded-full bg-brand-primary/[0.055] blur-[120px]" />

            <div className="absolute left-[40%] top-10 h-64 w-64 rounded-full bg-violet-500/[0.045] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
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
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-zinc-950">
                  <BadgeCheckIcon size={21} />
                </span>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  What guides us
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  Simple principles for{" "}
                  <span className="text-brand-primary">
                    better work.
                  </span>
                </h2>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {values.map((value, index) => {
                  const Icon = value.icon;

                  return (
                    <motion.article
                      key={value.title}
                      className="group min-h-[250px] rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 sm:p-7"
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
                        delay: index * 0.07,
                      }}
                      whileHover={{
                        y: -4,
                        backgroundColor: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <span
                        className={[
                          "flex h-11 w-11 items-center justify-center rounded-xl",
                          value.surface,
                          value.iconClass,
                        ].join(" ")}
                      >
                        <Icon size={19} />
                      </span>

                      <h3 className="mt-10 text-2xl font-black tracking-[-0.03em] text-white">
                        {value.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-white/60">
                        {value.description}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-5 md:px-8">
            <motion.div
              className="grid gap-10 border-y border-border py-14 lg:grid-cols-[1fr_auto] lg:items-end lg:py-16"
              initial={{
                opacity: 0,
                y: 22,
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
              <div className="max-w-4xl">
                <SectionEyebrow>
                  Built for both sides
                </SectionEyebrow>

                <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Need the skill?
                  <span className="block">
                    Or have the skill?
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Allocatr gives both sides a clearer place to connect and
                  move meaningful work forward.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  className={[
                    "group h-12 rounded-lg px-7 shadow-none",
                    "bg-primary text-brand-primary",
                    "hover:bg-primary/90 hover:text-brand-primary",
                    "dark:text-primary-foreground",
                    "dark:hover:text-primary-foreground",
                  ].join(" ")}
                >
                  <Link to="/allocats">
                    Find an Allocat

                    <ArrowRightIcon
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-lg px-7 shadow-none"
                >
                  <Link to={allocatHref}>
                    {allocatLabel}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

function AboutHeroVisual() {
  return (
    <motion.div
      className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[650px]"
      initial={{
        opacity: 0,
        x: 34,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: 0.12,
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      <div className="absolute bottom-[5%] right-0 top-0 w-[88%] overflow-hidden rounded-[2.2rem]">
        <img
          src={ABOUT_HERO_IMAGE}
          alt="Skilled professional carrying out trade work"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/[0.04] to-transparent" />
      </div>

      <motion.div
        className="absolute right-[5%] top-6 rounded-xl border border-white/20 bg-black/55 px-4 py-3 text-white shadow-lg backdrop-blur-xl"
        animate={{
          y: [0, 4, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <p className="text-[0.56rem] uppercase tracking-[0.15em] text-white/55">
          Built around the work
        </p>

        <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-brand-primary" />
          Skill to outcome
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-[82%] max-w-md rounded-[1.6rem] border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl sm:p-6"
        initial={{
          opacity: 0,
          y: 26,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.5,
          duration: 0.65,
        }}
        whileHover={{
          y: -4,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Project responsibility
            </p>

            <h2 className="mt-1 text-lg font-black tracking-[-0.025em]">
              Clear roles from the start
            </h2>
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-zinc-950">
            <LayoutDashboardIcon size={16} />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <HeroRole
            icon={UsersIcon}
            label="Client"
            value="Outcome & approval"
            surface="bg-sky-500/10"
            iconClass="text-sky-600"
          />

          <HeroRole
            icon={WrenchIcon}
            label="Allocat"
            value="Execution & delivery"
            surface="bg-violet-500/10"
            iconClass="text-violet-600"
          />
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            className="h-full rounded-full bg-brand-primary"
            initial={{
              width: 0,
            }}
            animate={{
              width: "72%",
            }}
            transition={{
              delay: 1,
              duration: 1,
              ease: "easeOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroRole({
  icon: Icon,
  label,
  value,
  surface,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  surface: string;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-3">
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          surface,
          iconClass,
        ].join(" ")}
      >
        <Icon size={15} />
      </span>

      <div>
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-bold text-zinc-900">
          {value}
        </p>
      </div>

      <CheckCircle2Icon
        size={15}
        className="ml-auto shrink-0 text-zinc-400"
      />
    </div>
  );
}

function RoleSummaryCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  points,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: string[];
  dark?: boolean;
}) {
  return (
    <motion.article
      className={[
        "relative overflow-hidden rounded-[1.7rem] p-6 sm:p-7",
        dark
          ? "bg-zinc-950 text-white"
          : "border border-border bg-card text-card-foreground",
      ].join(" ")}
      initial={{
        opacity: 0,
        x: 22,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
        y: -3,
      }}
    >
      {dark && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-primary/[0.06] blur-3xl" />

          <img
            src={assets.allocatrIcon}
            alt=""
            className="pointer-events-none absolute -bottom-10 -right-4 w-36 rotate-12 opacity-[0.045]"
          />
        </>
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <span
            className={[
              "flex h-11 w-11 items-center justify-center rounded-xl",
              dark
                ? "bg-brand-primary text-zinc-950"
                : "bg-sky-500/10 text-sky-600 dark:text-sky-300",
            ].join(" ")}
          >
            <Icon size={19} />
          </span>

          <span
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full",
              dark
                ? "bg-white/10 text-brand-primary"
                : "bg-brand-primary/15 text-foreground",
            ].join(" ")}
          >
            <CircleCheckBigIcon size={13} />
          </span>
        </div>

        <p
          className={[
            "mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.18em]",
            dark
              ? "text-white/45"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {eyebrow}
        </p>

        <h3
          className={[
            "mt-3 text-3xl font-black leading-[0.98] tracking-[-0.035em]",
            dark ? "text-white" : "",
          ].join(" ")}
        >
          {title}
        </h3>

        <p
          className={[
            "mt-4 text-sm leading-7",
            dark
              ? "text-white/60"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {description}
        </p>

        <div
          className={[
            "mt-6 space-y-3 border-t pt-5",
            dark
              ? "border-white/10"
              : "border-border",
          ].join(" ")}
        >
          {points.map((point) => (
            <div
              key={point}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2Icon
                size={14}
                className={[
                  "mt-0.5 shrink-0",
                  dark
                    ? "text-brand-primary"
                    : "text-foreground/60",
                ].join(" ")}
              />

              <span
                className={[
                  "text-xs leading-5",
                  dark
                    ? "text-white/65"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
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

      <span className="absolute bottom-[0.06em] left-0 right-0 z-0 h-[0.16em] rounded-full bg-brand-primary/55" />
    </span>
  );
}

function HeroFact({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-primary text-zinc-950">
        <CheckCircle2Icon size={10} />
      </span>

      {children}
    </span>
  );
}

export default AboutPage;