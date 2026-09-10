import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  EyeIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  MessageSquareIcon,
  PlayIcon,
  SendIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import { useAuth } from "@/auth/useAuth";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

const videos = {
  overview: "",
  workspace: "",
  completion: "",
};

const videoGuides = [
  {
    number: "01",
    title: "Creating a new project",
    description:
      "Learn how to create a project, describe the work and add the information needed to get started.",
    audience: "For clients",
    icon: FileTextIcon,
    url: "",
  },
  {
    number: "02",
    title: "Finding the right Allocat",
    description:
      "See how to explore skilled professionals and find the right fit for your project.",
    audience: "For clients",
    icon: UsersIcon,
    url: "",
  },
  {
    number: "03",
    title: "Using the Project Manager",
    description:
      "A quick walkthrough of the main project workspace, people, progress and project information.",
    audience: "For everyone",
    icon: LayoutDashboardIcon,
    url: "",
  },
  {
    number: "04",
    title: "Working with the task board",
    description:
      "See how tasks are created, updated and moved through the project while work is being carried out.",
    audience: "For Allocats",
    icon: ListTodoIcon,
    url: "",
  },
  {
    number: "05",
    title: "Comments and project updates",
    description:
      "Keep questions, clarification and progress updates connected to the work they relate to.",
    audience: "For everyone",
    icon: MessageSquareIcon,
    url: "",
  },
  {
    number: "06",
    title: "Submitting work for review",
    description:
      "See how completed work is submitted to the client and moves into the final review process.",
    audience: "For Allocats",
    icon: SendIcon,
    url: "",
  },
];

const steps = [
  {
    number: "01",
    label: "Create",
    title: "Start with the job.",
    description:
      "Create a project with the work that needs doing, the expected outcome and the details professionals need.",
    icon: FileTextIcon,
    surface: "bg-violet-500/10",
    iconClass: "text-violet-600 dark:text-violet-300",
  },
  {
    number: "02",
    label: "Connect",
    title: "Bring in the right skill.",
    description:
      "Find an Allocat whose experience fits the project and bring them into the shared workspace.",
    icon: UsersIcon,
    surface: "bg-sky-500/10",
    iconClass: "text-sky-600 dark:text-sky-300",
  },
  {
    number: "03",
    label: "Execute",
    title: "Move the work.",
    description:
      "The Allocat manages the task board, updates work and moves tasks through the project.",
    icon: WrenchIcon,
    surface: "bg-brand-primary/15",
    iconClass: "text-foreground",
  },
  {
    number: "04",
    label: "Submit",
    title: "Send the work for review.",
    description:
      "Once the required work is complete, the Allocat submits the project to the client for final review.",
    icon: SendIcon,
    surface: "bg-orange-500/10",
    iconClass: "text-orange-600 dark:text-orange-300",
  },
  {
    number: "05",
    label: "Review",
    title: "Confirm the outcome.",
    description:
      "The client reviews the finished work and either approves completion or requests changes.",
    icon: ClipboardCheckIcon,
    surface: "bg-teal-500/10",
    iconClass: "text-teal-600 dark:text-teal-300",
  },
];

const clientActions = [
  "Create and manage the project",
  "Choose and manage project relationships",
  "See tasks and project progress",
  "Open tasks and comment",
  "Review submitted work",
  "Approve completion or request changes",
];

const allocatActions = [
  "Enter accepted project workspaces",
  "Create and update tasks",
  "Move tasks through their workflow",
  "Mark completed work",
  "Respond to project comments",
  "Submit completed work for client review",
];

const completionSteps = [
  {
    number: "01",
    title: "Tasks complete",
    description:
      "The required operational work reaches the end of the task board.",
    icon: CheckCircle2Icon,
  },
  {
    number: "02",
    title: "Submit for completion",
    description:
      "The Allocat sends the completed project to the client for review.",
    icon: SendIcon,
  },
  {
    number: "03",
    title: "Client review",
    description:
      "The client reviews the finished outcome and checks that the project requirements have been met.",
    icon: EyeIcon,
  },
  {
    number: "04",
    title: "Approve or request changes",
    description:
      "The client confirms completion or sends the work back for changes.",
    icon: ClipboardCheckIcon,
  },
];

function HowItWorksPage() {
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
            <div className="absolute -left-52 top-10 h-[480px] w-[480px] rounded-full bg-brand-primary/[0.045] blur-[120px]" />

            <div className="absolute -right-48 -top-32 h-[560px] w-[560px] rounded-full bg-violet-500/[0.04] blur-[130px]" />

            <div className="absolute bottom-[-12rem] left-[50%] h-80 w-80 rounded-full bg-sky-500/[0.035] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 24,
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
                  How Allocatr works
                </SectionEyebrow>

                <h1 className="mt-6 max-w-[11ch] text-5xl font-black leading-[0.91] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.6rem]">
                  From job to done, without losing{" "}
                  <AccentUnderline>
                    the thread.
                  </AccentUnderline>
                </h1>

                <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Find the skills your project needs, bring the right people
                  into the work and keep everything moving from the first
                  brief to final approval.
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
                    <Link to={postTaskHref}>
                      Start a project

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
                    <Link to="/allocats">
                      Find an Allocat
                    </Link>
                  </Button>
                </motion.div>

                <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
                  <HeroFact>
                    Find by skill
                  </HeroFact>

                  <HeroFact>
                    Shared workspace
                  </HeroFact>

                  <HeroFact>
                    Clear final review
                  </HeroFact>
                </div>
              </motion.div>

              <YouTubeVideo
                url={videos.overview}
                eyebrow="How it works"
                title="See the complete Allocatr workflow"
                description="A quick walkthrough from creating a project to final client approval."
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-44 top-16 h-80 w-80 rounded-full bg-sky-500/[0.035] blur-[110px]" />

            <div className="absolute -left-40 bottom-10 h-72 w-72 rounded-full bg-violet-500/[0.03] blur-[110px]" />
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
                The process
              </SectionEyebrow>

              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Five steps.{" "}
                <AccentUnderline>
                  One continuous project.
                </AccentUnderline>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Finding the right person is only the beginning. Allocatr
                keeps the project structured all the way through delivery
                and review.
              </p>
            </motion.div>

            <ProcessTimeline />
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-44 top-16 h-80 w-80 rounded-full bg-brand-primary/[0.03] blur-[110px]" />

            <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-violet-500/[0.03] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
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
                  Quick video guides
                </SectionEyebrow>

                <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Learn exactly what{" "}
                  <AccentUnderline>
                    you need.
                  </AccentUnderline>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Short walkthroughs help you get familiar with specific
                  parts of Allocatr without having to watch the complete
                  platform overview.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  <GuideAudience label="For clients" />
                  <GuideAudience label="For Allocats" />
                  <GuideAudience label="For everyone" />
                </div>
              </motion.div>

              <div className="grid gap-5 sm:grid-cols-2">
                {videoGuides.map((guide, index) => (
                  <VideoGuideCard
                    key={guide.title}
                    guide={guide}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-zinc-950 py-24 text-white lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full border border-white/[0.055]" />

            <div className="absolute right-[8%] top-[-7rem] h-80 w-80 rounded-full bg-brand-primary/[0.07] blur-[110px]" />

            <div className="absolute bottom-[-10rem] left-[35%] h-72 w-72 rounded-full bg-violet-500/[0.05] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
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
                  <LayoutDashboardIcon size={21} />
                </span>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  The project workspace
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Everyone sees the work.{" "}

                  <span className="text-brand-primary">
                    Responsibilities stay clear.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  The client stays close to the project without becoming a
                  second task manager. The Allocat controls operational
                  execution while progress remains visible.
                </p>

                <div className="mt-8 space-y-3">
                  <DarkFact
                    icon={EyeIcon}
                    text="Clients can see tasks, deadlines and progress."
                  />

                  <DarkFact
                    icon={MessageSquareIcon}
                    text="Both sides can keep questions and updates in context."
                  />

                  <DarkFact
                    icon={ListTodoIcon}
                    text="Allocats manage task status and execution."
                  />
                </div>
              </motion.div>

              <YouTubeVideo
                url={videos.workspace}
                eyebrow="Workspace walkthrough"
                title="Watch a project move through the workspace"
                description="See how tasks, comments, people and project progress stay together during execution."
                dark
              />
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-5 md:px-8">
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
                Clear responsibilities
              </SectionEyebrow>

              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Same project.{" "}

                <AccentUnderline>
                  Different controls.
                </AccentUnderline>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Clients and Allocats work from the same project, but each
                side controls the part they are responsible for.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              <ResponsibilityPanel
                eyebrow="For clients"
                title="Own the outcome."
                description="Clients create the project, manage the relationship and make the final decision when completed work is submitted."
                icon={UsersIcon}
                actions={clientActions}
              />

              <ResponsibilityPanel
                eyebrow="For Allocats"
                title="Own the execution."
                description="Accepted Allocats manage the operational task board and move the work through to completion."
                icon={BriefcaseBusinessIcon}
                actions={allocatActions}
                dark
              />
            </div>

            <div className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-3 text-center">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/15">
                <ShieldCheckIcon
                  size={13}
                  className="text-foreground"
                />
              </span>

              <p className="text-xs leading-6 text-muted-foreground">
                The workspace stays shared while controls change according
                to each person&apos;s role in the project.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-44 top-20 h-80 w-80 rounded-full bg-brand-primary/[0.03] blur-[110px]" />

            <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-[110px]" />
          </div>

          <div className="container relative mx-auto px-5 md:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-20">
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
                <SectionEyebrow>
                  Finishing the project
                </SectionEyebrow>

                <h2 className="mt-5 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Tasks finished.

                  <span className="block">
                    The outcome still needs{" "}

                    <AccentUnderline>
                      approval.
                    </AccentUnderline>
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Completing the final task does not automatically close the
                  project. The Allocat submits the work and the client makes
                  the final decision.
                </p>

                <CompletionSteps />
              </motion.div>

              <YouTubeVideo
                url={videos.completion}
                eyebrow="Completion walkthrough"
                title="See how work moves into client review"
                description="A walkthrough of completing tasks, submitting the project and receiving the final client decision."
              />
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-5 md:px-8">
            <motion.div
              className="relative overflow-hidden border-y border-border py-14 sm:py-16 lg:py-20"
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
              <div className="pointer-events-none absolute -right-32 top-[-8rem] h-72 w-72 rounded-full bg-brand-primary/[0.035] blur-[100px]" />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-4xl">
                  <SectionEyebrow>
                    Ready to start?
                  </SectionEyebrow>

                  <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                    Bring the right skill into your next project.
                  </h2>

                  <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Start the project, find the people it needs and keep the
                    work moving in one place.
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
                    <Link to={postTaskHref}>
                      Start a project

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
              </div>
            </motion.div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

function ProcessTimeline() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="absolute bottom-10 left-[23px] top-10 w-px bg-border sm:left-[27px]" />

      <div className="relative space-y-3">
        {steps.map((step, index) => (
          <ProcessStep
            key={step.number}
            step={step}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: {
    number: string;
    label: string;
    title: string;
    description: string;
    icon: LucideIcon;
    surface: string;
    iconClass: string;
  };
  index: number;
}) {
  const Icon = step.icon;

  return (
    <motion.article
      className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-5 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-7"
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
        amount: 0.35,
      }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
      }}
    >
      <div className="relative z-10 flex justify-center pt-6">
        <span
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl",
            "border-[5px] border-muted bg-background",
            step.surface,
            step.iconClass,
          ].join(" ")}
        >
          <Icon size={17} />
        </span>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-card p-6 text-card-foreground sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {step.label}
            </p>

            <h3 className="mt-2 text-2xl font-black leading-[1] tracking-[-0.03em] sm:text-3xl">
              {step.title}
            </h3>
          </div>

          <span className="text-[0.62rem] font-black tracking-[0.14em] text-muted-foreground/45">
            {step.number}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {step.description}
        </p>
      </div>
    </motion.article>
  );
}

function VideoGuideCard({
  guide,
  index,
}: {
  guide: {
    number: string;
    title: string;
    description: string;
    audience: string;
    icon: LucideIcon;
    url: string;
  };
  index: number;
}) {
  const Icon = guide.icon;
  const embedUrl = getYouTubeEmbedUrl(guide.url);

  return (
    <motion.article
      className="group min-w-0 overflow-hidden rounded-[1.5rem] border border-border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-lg hover:shadow-black/[0.04]"
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
        amount: 0.2,
      }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
      }}
      whileHover={{
        y: -4,
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={guide.title}
            loading="lazy"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-zinc-950 transition-transform duration-200 group-hover:scale-105">
                <PlayIcon
                  size={18}
                  fill="currentColor"
                />
              </span>

              <p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white/40">
                Video coming soon
              </p>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute left-4 top-4">
          <span className="rounded-md bg-black/60 px-2.5 py-1.5 text-[0.56rem] font-semibold text-white backdrop-blur-md">
            {guide.audience}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-foreground">
            <Icon size={17} />
          </span>

          <span className="text-[0.58rem] font-black tracking-[0.14em] text-muted-foreground/45">
            {guide.number}
          </span>
        </div>

        <h3 className="mt-6 text-xl font-black leading-[1.05] tracking-[-0.025em]">
          {guide.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {guide.description}
        </p>

        {guide.url && (
          <a
            href={guide.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-foreground/70"
          >
            Watch on YouTube

            <ArrowRightIcon
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        )}
      </div>
    </motion.article>
  );
}

function GuideAudience({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[0.62rem] font-semibold text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />

      {label}
    </span>
  );
}

function CompletionSteps() {
  return (
    <div className="mt-9 border-y border-border">
      {completionSteps.map((step, index) => {
        const Icon = step.icon;

        return (
          <motion.div
            key={step.number}
            className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 border-b border-border py-5 last:border-b-0"
            initial={{
              opacity: 0,
              x: -16,
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
            }}
          >
            <span
              className={[
                "flex h-9 w-9 items-center justify-center rounded-lg",
                index === 0
                  ? "bg-brand-primary/15 text-foreground"
                  : index === 1
                    ? "bg-orange-500/10 text-orange-600 dark:text-orange-300"
                    : index === 2
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-300",
              ].join(" ")}
            >
              <Icon size={15} />
            </span>

            <div>
              <div className="flex items-center gap-3">
                <span className="text-[0.56rem] font-black tracking-[0.12em] text-muted-foreground/50">
                  {step.number}
                </span>

                <h3 className="text-sm font-black">
                  {step.title}
                </h3>
              </div>

              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ResponsibilityPanel({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions: string[];
  dark?: boolean;
}) {
  return (
    <motion.article
      className={[
        "relative overflow-hidden rounded-[1.8rem] p-7 sm:p-9 lg:p-10",
        dark
          ? "bg-zinc-950 text-white"
          : "border border-border bg-card text-card-foreground",
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
      }}
      transition={{
        duration: 0.55,
      }}
      whileHover={{
        y: -4,
      }}
    >
      {dark && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-primary/[0.065] blur-3xl" />

          <img
            src={assets.allocatrIcon}
            alt=""
            className="pointer-events-none absolute -bottom-10 -right-6 w-44 rotate-12 opacity-[0.045]"
          />
        </>
      )}

      <div className="relative">
        <span
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl",
            dark
              ? "bg-brand-primary text-zinc-950"
              : "bg-sky-500/10 text-sky-600 dark:text-sky-300",
          ].join(" ")}
        >
          <Icon size={20} />
        </span>

        <p
          className={[
            "mt-8 text-xs font-semibold uppercase tracking-[0.18em]",
            dark
              ? "text-white/45"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {eyebrow}
        </p>

        <h3
          className={[
            "mt-3 text-4xl font-black leading-[0.96] tracking-[-0.04em]",
            dark ? "text-white" : "",
          ].join(" ")}
        >
          {title}
        </h3>

        <p
          className={[
            "mt-5 max-w-xl text-sm leading-7",
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
          <div className="grid gap-3">
            {actions.map((action) => (
              <div
                key={action}
                className="flex items-start gap-3"
              >
                <CheckCircle2Icon
                  size={15}
                  className={[
                    "mt-0.5 shrink-0",
                    dark
                      ? "text-brand-primary"
                      : "text-foreground/60",
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
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function YouTubeVideo({
  url,
  eyebrow,
  title,
  description,
  dark = false,
}: {
  url: string;
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <motion.div
      className="min-w-0"
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.65,
      }}
    >
      <div
        className={[
          "overflow-hidden rounded-[1.8rem] border",
          dark
            ? "border-white/10 bg-white/[0.04]"
            : "border-border bg-card",
        ].join(" ")}
      >
        <div className="aspect-video overflow-hidden bg-zinc-950">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              loading="lazy"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-zinc-950">
                  <PlayIcon
                    size={21}
                    fill="currentColor"
                  />
                </span>

                <p className="mt-4 text-xs font-semibold text-white/50">
                  Add YouTube video
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <p
            className={[
              "text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
              dark
                ? "text-white/45"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {eyebrow}
          </p>

          <h3
            className={[
              "mt-2 text-xl font-black tracking-[-0.025em]",
              dark
                ? "text-white"
                : "text-card-foreground",
            ].join(" ")}
          >
            {title}
          </h3>

          {description && (
            <p
              className={[
                "mt-3 text-sm leading-7",
                dark
                  ? "text-white/55"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) {
    return "";
  }

  try {
    const parsedUrl = new URL(url);
    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v") ?? "";
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/")[2] ?? "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/")[2] ?? "";
      }
    }

    if (!videoId) {
      return "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return "";
  }
}

function DarkFact({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-brand-primary">
        <Icon size={14} />
      </span>

      <p className="pt-1 text-sm leading-6 text-white/65">
        {text}
      </p>
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

export default HowItWorksPage;