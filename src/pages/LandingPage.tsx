import { useRef } from "react";
import { Link } from "react-router-dom";

import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  HammerIcon,
  LaptopIcon,
  PaintbrushIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import { useAuth } from "@/auth/useAuth";

import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Home repairs",
    description:
      "Plumbing, electrical work, roofing and everyday maintenance.",
    icon: WrenchIcon,
  },
  {
    title: "Construction",
    description:
      "Builders, painters, welders, tilers and specialist trades.",
    icon: HammerIcon,
  },
  {
    title: "Delivery",
    description:
      "Reliable transport, courier and moving support when needed.",
    icon: TruckIcon,
  },
  {
    title: "Creative work",
    description:
      "Design, photography, video, branding and content support.",
    icon: PaintbrushIcon,
  },
  {
    title: "Technology",
    description:
      "Web development, computer repair and technical assistance.",
    icon: LaptopIcon,
  },
  {
    title: "Business support",
    description:
      "Administration, bookkeeping, consulting and project support.",
    icon: BriefcaseBusinessIcon,
  },
];

const workflow = [
  {
    number: "01",
    title: "Post",
    description:
      "Describe the work, set expectations and share the details professionals need.",
  },
  {
    number: "02",
    title: "Match",
    description:
      "Find Allocats whose experience and skills closely fit your project.",
  },
  {
    number: "03",
    title: "Manage",
    description:
      "Track tasks, deadlines, progress and communication until the work is complete.",
  },
];

const trustPoints = [
  {
    icon: UsersIcon,
    title: "Professional profiles",
    description:
      "See experience, skills and relevant work information before making a decision.",
  },
  {
    icon: StarIcon,
    title: "Relevant experience",
    description:
      "Search for people based on what they can actually do, not only broad job titles.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Clear project visibility",
    description:
      "Follow the work, comments, progress and completion from one shared workspace.",
  },
];

const productHighlights = [
  {
    title: "Track tasks",
    description:
      "See what is pending, active and complete.",
  },
  {
    title: "Follow progress",
    description:
      "Clients stay informed without controlling execution.",
  },
  {
    title: "Keep context",
    description:
      "Comments and project information stay with the job.",
  },
];

const serviceImages: Record<string, string> = {
  "Home repairs":
    "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",

  Construction:
    "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg",

  Delivery:
    "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg",

  "Creative work":
    "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",

  Technology:
    "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",

  "Business support":
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
};

const HERO_IMAGE =
  "https://images.pexels.com/photos/5973958/pexels-photo-5973958.jpeg";

const PEOPLE_IMAGE =
  "https://images.pexels.com/photos/6791496/pexels-photo-6791496.jpeg";

/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage() {
  const { user } = useAuth();

  const sliderRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const postTaskHref = user
    ? "/projects/new"
    : "/register";

  const allocatCtaHref = user?.isAllocat
    ? "/projects"
    : "/become-an-allocat";

  const allocatCtaLabel = user?.isAllocat
    ? "View projects"
    : "Become an Allocat";

  function scrollServices(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  }

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-primary"
        style={{ scaleX }}
      />

      <SiteHeader />

      <main className="min-w-0 overflow-x-hidden bg-background text-foreground">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 top-16 h-[560px] w-[560px] rounded-full bg-primary/[0.03] blur-3xl" />

            <motion.div
              className="absolute -right-48 top-20 h-[560px] w-[560px] rounded-full border border-primary/[0.08]"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="absolute -right-24 top-44 h-[360px] w-[360px] rounded-full border border-primary/[0.06]"
              initial={{
                opacity: 0,
                scale: 0.86,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.15,
                duration: 1.1,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="absolute right-8 top-[14.5rem] h-[190px] w-[190px] rounded-full border border-primary/[0.045]"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.25,
                duration: 1,
                ease: "easeOut",
              }}
            />

            <motion.div
              className="absolute right-[8%] top-[22%] hidden items-center gap-3 lg:flex"
              initial={{
                opacity: 0,
                x: 18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.85,
                duration: 0.6,
              }}
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              <span className="h-1 w-1 rounded-full bg-primary/20" />
            </motion.div>
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-16">
              <motion.div
                className="relative z-10 max-w-3xl"
                initial={{
                  opacity: 0,
                  y: 26,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.75,
                  ease: "easeOut",
                }}
              >
                <motion.div
                  className="mb-6 inline-flex items-center gap-2.5 rounded-lg border border-primary/15 bg-primary/[0.05] px-3.5 py-2"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.18,
                    duration: 0.5,
                  }}
                >
                  <img
                    src={assets.allocatrIcon}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />

                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                    Work, properly allocated
                  </span>
                </motion.div>

                <h1 className="max-w-[11ch] text-5xl font-black uppercase leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.8rem]">
                  The right skill.{" "}
                  <span className="text-primary">
                    Right when you need it.
                  </span>
                </h1>

                <motion.p
                  className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg"
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.28,
                    duration: 0.65,
                  }}
                >
                  Find skilled professionals, bring them into your project
                  and keep the work moving from first task to final approval.
                </motion.p>

                <motion.div
                  className="mt-9 flex flex-col gap-3 sm:flex-row"
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 0.65,
                  }}
                >
                  <Button
                    asChild
                    className="group h-12 rounded-lg px-7 shadow-none"
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
                  className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-muted-foreground"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.65,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2Icon
                      size={14}
                      className="text-primary"
                    />

                    Skill matched
                  </span>

                  <span className="flex items-center gap-2">
                    <CheckCircle2Icon
                      size={14}
                      className="text-primary"
                    />

                    Work tracked
                  </span>

                  <span className="hidden italic text-muted-foreground/60 sm:inline">
                    No catnap required.
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative min-h-[500px] sm:min-h-[570px] lg:min-h-[630px]"
                initial={{
                  opacity: 0,
                  x: 45,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }}
                transition={{
                  delay: 0.16,
                  duration: 0.85,
                  ease: "easeOut",
                }}
              >
                <div className="absolute inset-x-5 bottom-0 top-5 overflow-hidden rounded-2xl bg-muted shadow-lg sm:inset-x-10 lg:left-16 lg:right-0">
                  <img
                    src={HERO_IMAGE}
                    alt="Skilled professional working"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/[0.03] to-black/5" />

                  <motion.div
                    className="absolute left-5 top-5 flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-white backdrop-blur-xl"
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.7,
                    }}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <img
                        src={assets.allocatrIcon}
                        alt=""
                        className="h-5 w-5"
                      />
                    </span>

                    <div>
                      <p className="text-[0.56rem] uppercase tracking-[0.15em] text-white/55">
                        Allocat spotted
                      </p>

                      <p className="mt-0.5 text-xs font-semibold">
                        Skilled & ready
                      </p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute bottom-7 left-0 w-[88%] max-w-md rounded-2xl border border-border bg-card/95 p-5 text-card-foreground shadow-lg backdrop-blur-xl sm:bottom-10 sm:p-6"
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.65,
                    duration: 0.65,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Live project
                      </p>

                      <p className="mt-1 text-lg font-black tracking-[-0.02em]">
                        Office renovation
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/15 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2.5">
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
                      value="3"
                    />
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-[0.6rem] font-medium text-muted-foreground">
                      <span>Project progress</span>
                      <span>68%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: "68%",
                        }}
                        transition={{
                          delay: 1,
                          duration: 1.1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="hidden items-center justify-between pb-7 pt-5 md:flex"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1,
              }}
            >
              <div className="flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/55" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/25" />

                Follow the trail
              </div>

              <span className="text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/60">
                Find · Match · Move
              </span>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <section className="border-y border-border bg-muted/20">
          <div className="container mx-auto px-5 py-20 md:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
              <motion.div
                className="max-w-xl"
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                  One platform
                </p>

                <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                  Spot the skill.

                  <span className="block text-primary">
                    Pounce on the work.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Find the person, agree on the work and keep delivery
                  moving without jumping between disconnected tools.
                </p>
              </motion.div>

              <div className="divide-y divide-border border-y border-border">
                {workflow.map((item, index) => (
                  <motion.article
                    key={item.number}
                    className="group grid gap-4 py-7 sm:grid-cols-[60px_150px_1fr] sm:items-start sm:gap-6 sm:py-8"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.4,
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                    }}
                  >
                    <span className="text-xs font-semibold text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary">
                      {item.number}
                    </span>

                    <h3 className="text-xl font-black uppercase">
                      {item.title}
                    </h3>

                    <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MEET THE ALLOCATS
        ===================================================== */}

        <section className="container mx-auto px-5 py-20 md:px-8 lg:py-32">
          <motion.div
            className={[
              "overflow-hidden rounded-2xl border",
              "border-foreground/10 bg-foreground text-background",
              "shadow-lg",
              "dark:border-border dark:bg-card dark:text-card-foreground",
            ].join(" ")}
            initial={{
              opacity: 0,
              y: 35,
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
              duration: 0.7,
            }}
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden p-7 sm:p-10 lg:p-16">
                <img
                  src={assets.allocatrIcon}
                  alt=""
                  className={[
                    "pointer-events-none absolute -bottom-10 -left-8",
                    "w-44 rotate-[8deg] opacity-[0.035]",
                    "sm:w-56 dark:opacity-[0.045]",
                  ].join(" ")}
                />

                <div className="relative">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                    Meet the Allocats
                  </p>

                  <h2 className="mt-5 max-w-xl text-4xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                    Sharp skills.

                    <span className="block text-primary">
                      Zero chasing.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-lg text-sm leading-7 text-background/65 sm:text-base sm:leading-8 dark:text-muted-foreground">
                    They know their craft, know their tools and know how
                    to get moving. From trades to technology, Allocats
                    bring real experience to real work.
                  </p>

                  <p className="mt-5 text-xs italic text-background/45 dark:text-muted-foreground/60">
                    Victory stretch optional.
                  </p>

                  <Button
                    asChild
                    variant="secondary"
                    className={[
                      "mt-8 h-12 rounded-lg px-6 shadow-none",
                      "dark:bg-primary dark:text-primary-foreground",
                      "dark:hover:bg-primary/90",
                    ].join(" ")}
                  >
                    <Link to="/allocats">
                      Explore professionals
                      <ArrowRightIcon size={16} />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
                <motion.img
                  src={PEOPLE_IMAGE}
                  alt="People collaborating in a workshop"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{
                    scale: 1.06,
                  }}
                  whileInView={{
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1.1,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent" />

                <div className="absolute bottom-6 right-6 rounded-lg border border-white/15 bg-black/25 px-4 py-2 text-xs font-medium text-white backdrop-blur-lg">
                  Skill in motion
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            PRODUCT
        ===================================================== */}

        <section className="bg-muted/20 py-20 lg:py-32">
          <div className="container mx-auto px-5 md:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                Built for the work after the match
              </p>

              <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                The hunt ends.

                <span className="block text-primary">
                  The work begins.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                See tasks, deadlines, progress, people and comments
                in one shared project workspace.
              </p>
            </motion.div>

            <motion.div
              className="mt-12 overflow-hidden rounded-2xl border border-border bg-card p-3 text-card-foreground shadow-lg sm:p-5 lg:p-7"
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.98,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
              }}
            >
              <div className="rounded-xl bg-muted/30 p-3 sm:p-5 lg:p-8">
                <img
                  src={assets.computerPhone}
                  alt="Allocatr project workspace"
                  className="mx-auto block h-auto w-full max-w-6xl object-contain"
                />
              </div>
            </motion.div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-7 sm:grid-cols-3">
              {productHighlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="border-l-2 border-primary pl-5"
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
                    delay: index * 0.08,
                  }}
                >
                  <h3 className="text-sm font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SKILLS
        ===================================================== */}

        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-5 md:px-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <motion.div
                className="max-w-2xl"
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
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                  Explore skills
                </p>

                <h2 className="mt-4 text-4xl font-black uppercase leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                  Whatever needs{" "}
                  <span className="text-primary">
                    doing.
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                  Browse a wide range of skills and find the right
                  professional for your next project.
                </p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollServices("left")}
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-lg",
                    "border border-border bg-card text-card-foreground",
                    "transition-all duration-200",
                    "hover:border-primary/40 hover:text-primary",
                  ].join(" ")}
                  aria-label="Previous skills"
                >
                  <ArrowLeftIcon size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollServices("right")}
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-lg",
                    "border border-border bg-card text-card-foreground",
                    "transition-all duration-200",
                    "hover:border-primary/40 hover:text-primary",
                  ].join(" ")}
                  aria-label="More skills"
                >
                  <ArrowRightIcon size={18} />
                </button>

                <Button
                  asChild
                  variant="outline"
                  className="ml-1 h-11 rounded-lg px-5 shadow-none"
                >
                  <Link to="/allocats">
                    View all skills
                    <ArrowUpRightIcon size={15} />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mt-10 md:mt-12">
              <div
                ref={sliderRef}
                className={[
                  "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4",
                  "scroll-smooth md:gap-5",
                  "[scrollbar-width:none]",
                  "[&::-webkit-scrollbar]:hidden",
                ].join(" ")}
              >
                {services.map((service, index) => {
                  const Icon = service.icon;
                  const image = serviceImages[service.title];

                  return (
                    <motion.article
                      key={service.title}
                      className={[
                        "group flex min-h-[460px] shrink-0 snap-start flex-col",
                        "w-[84%] overflow-hidden rounded-2xl",
                        "border border-border bg-card text-card-foreground",
                        "transition-all duration-300",
                        "hover:-translate-y-1 hover:border-primary/25",
                        "hover:shadow-lg hover:shadow-black/5",
                        "dark:hover:shadow-black/20",
                        "sm:w-[47%]",
                        "lg:w-[31.5%]",
                      ].join(" ")}
                      initial={{
                        opacity: 0,
                        x: 26,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        delay: index * 0.055,
                        duration: 0.5,
                      }}
                    >
                      <div className="relative h-[220px] overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                        <span className="absolute left-4 top-4 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-[0.62rem] font-bold text-white backdrop-blur-md">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                          <Icon
                            size={21}
                            className="text-primary"
                          />

                          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Skill category
                          </span>
                        </div>

                        <h3 className="mt-5 text-xl font-black tracking-[-0.025em]">
                          {service.title}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {service.description}
                        </p>

                        <div className="mt-auto pt-7">
                          <div className="h-px bg-border" />

                          <Link
                            to="/allocats"
                            className="mt-5 flex items-center justify-between text-sm font-semibold text-primary"
                          >
                            Explore

                            <ArrowRightIcon
                              size={16}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-10 bg-gradient-to-l from-background to-transparent sm:w-16" />
            </div>

            <div className="mt-3 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                </span>

                New skills keep joining the platform.
              </div>

              <span className="text-muted-foreground/65">
                Follow the trail and find your match.
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            CLIENTS / ALLOCATS
        ===================================================== */}

        <section className="container mx-auto px-5 pb-20 md:px-8 lg:pb-32">
          <div className="border-y border-border py-12 sm:py-14 lg:py-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
              <motion.article
                className="lg:pr-16"
                initial={{
                  opacity: 0,
                  x: -20,
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
                  duration: 0.6,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                    For clients
                  </p>
                </div>

                <h3 className="mt-6 max-w-xl text-3xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                  Find the skill.
                  <br />
                  Keep control of the outcome.
                </h3>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Create projects, invite professionals, follow progress,
                  comment on the work and approve completion when the
                  job is done.
                </p>

                <Button
                  asChild
                  className="mt-8 h-11 rounded-lg px-6 shadow-none"
                >
                  <Link to={postTaskHref}>
                    Post a task
                    <ArrowRightIcon size={15} />
                  </Link>
                </Button>
              </motion.article>

              <motion.article
                className="border-t border-border pt-12 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0"
                initial={{
                  opacity: 0,
                  x: 20,
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
                  duration: 0.6,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                    For Allocats
                  </p>
                </div>

                <h3 className="mt-6 max-w-xl text-3xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                  Put your skills
                  <br />
                  on the prowl.
                </h3>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Build your profile, receive project opportunities,
                  manage tasks and keep your work organized from one place.
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="mt-8 h-11 rounded-lg px-6 shadow-none"
                >
                  <Link to={allocatCtaHref}>
                    {allocatCtaLabel}
                    <ArrowRightIcon size={15} />
                  </Link>
                </Button>
              </motion.article>
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST
        ===================================================== */}

        <section className="border-y border-border bg-muted/20">
          <div className="container mx-auto px-5 py-20 md:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <motion.div
                className="max-w-lg"
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
                <ShieldCheckIcon
                  size={26}
                  className="text-primary"
                />

                <h2 className="mt-6 text-4xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-5xl">
                  Confidence before

                  <span className="block text-primary">
                    the work begins.
                  </span>
                </h2>
              </motion.div>

              <div className="divide-y divide-border border-y border-border">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;

                  return (
                    <motion.article
                      key={point.title}
                      className="grid gap-4 py-7 sm:grid-cols-[52px_190px_1fr] sm:items-start sm:gap-6"
                      initial={{
                        opacity: 0,
                        x: 18,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: index * 0.08,
                      }}
                    >
                      <Icon
                        size={19}
                        className="text-primary"
                      />

                      <h3 className="text-sm font-bold">
                        {point.title}
                      </h3>

                      <p className="text-sm leading-7 text-muted-foreground">
                        {point.description}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="px-5 py-10 md:px-8 lg:py-14">
          <motion.div
            className="container mx-auto overflow-hidden rounded-2xl border border-border bg-card px-7 py-14 text-card-foreground sm:px-10 sm:py-20 lg:px-16 lg:py-24"
            initial={{
              opacity: 0,
              y: 30,
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
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-4xl">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
                  Ready to move?
                </p>

                <h2 className="mt-5 text-4xl font-black uppercase leading-[1] tracking-[-0.035em] sm:text-5xl lg:text-6xl xl:text-7xl">
                  Find the right person.

                  <span className="block text-primary">
                    Get the work moving.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Whether you need a professional or want to put your own
                  skills to work, Allocatr gives you one place to connect
                  and keep the project moving.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  className="h-12 rounded-lg px-7 shadow-none"
                >
                  <Link to="/allocats">
                    Find Allocats
                    <ArrowRightIcon size={16} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-lg px-7 shadow-none"
                >
                  <Link to={allocatCtaHref}>
                    {allocatCtaLabel}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="bg-background px-5 py-8 md:px-8">
          <div className="container mx-auto flex flex-col gap-6 border-t border-border pt-8 text-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={assets.allocatrIcon}
                alt=""
                className="h-5 w-5"
              />

              <p className="text-muted-foreground">
                © {new Date().getFullYear()} Allocatr. Work, properly
                allocated.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-3">
              <Link
                to="/about"
                className="transition-colors hover:text-primary"
              >
                About
              </Link>

              <Link
                to="/how-it-works"
                className="transition-colors hover:text-primary"
              >
                How it works
              </Link>

              <Link
                to="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms
              </Link>

              <Link
                to="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}

/* =========================================================
   HERO METRIC
========================================================= */

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-l border-border pl-3 first:border-l-0 first:pl-0">
      <p className="text-[0.58rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xl font-black tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}

export default LandingPage;