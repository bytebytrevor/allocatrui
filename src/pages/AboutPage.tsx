import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CompassIcon,
  HeartHandshakeIcon,
  Layers3Icon,
  LightbulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

import assets from "@/assets/assets";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import SiteFooter from "@/components/SiteFooter";

const values = [
  {
    title: "Clarity",
    description:
      "Good work begins with clear expectations. We make it easier for everyone to understand the task, the timeline and what success looks like.",
    icon: CompassIcon,
    accent:
      "bg-sky-300/25 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  },
  {
    title: "Trust",
    description:
      "Clients need confidence in the people they hire. Professionals need a fair chance to show what they can do.",
    icon: ShieldCheckIcon,
    accent:
      "bg-emerald-300/25 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  {
    title: "Momentum",
    description:
      "We remove unnecessary friction so projects can move from idea to action without getting buried in messages and follow-ups.",
    icon: ZapIcon,
    accent:
      "bg-amber-300/30 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    title: "Respect",
    description:
      "Every task matters, and so does the person doing it. Allocatr is built around fair, professional and productive working relationships.",
    icon: HeartHandshakeIcon,
    accent:
      "bg-pink-300/25 text-pink-700 dark:bg-pink-400/15 dark:text-pink-300",
  },
];

const principles = [
  {
    number: "01",
    title: "Skills should be easier to find",
    description:
      "Talented professionals should not remain invisible simply because they lack the right connections or marketing reach.",
  },
  {
    number: "02",
    title: "Work should be easier to manage",
    description:
      "Finding someone is only the beginning. The real value comes from keeping tasks, deadlines and progress clear.",
  },
  {
    number: "03",
    title: "Small jobs deserve proper attention",
    description:
      "A quick repair can matter just as much as a long-term business project. Both deserve the right person and a clear process.",
  },
];

const journey = [
  {
    title: "Share the work",
    description:
      "Start with the details. Explain what needs to be done, when it is needed and what a good result should look like.",
    icon: LightbulbIcon,
  },
  {
    title: "Find the fit",
    description:
      "Connect with professionals whose skills, experience and availability suit the work.",
    icon: UsersIcon,
  },
  {
    title: "Manage the project",
    description:
      "Break the work into tasks, track progress and keep deadlines visible in one workspace.",
    icon: Layers3Icon,
  },
  {
    title: "Complete with confidence",
    description:
      "Keep the process clear from the first conversation to the final completed task.",
    icon: CheckCircle2Icon,
  },
];

type SectionHeadingProps = {
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};

function SectionHeading({
  eyebrow,
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className="min-w-0">
      {eyebrow && (
        <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.22em]">
          {eyebrow}
        </p>
      )}

      <motion.h2
        className={[
          "max-w-full break-words text-3xl font-black leading-[0.96]",
          "tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl",
          className,
        ].join(" ")}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {children}
      </motion.h2>
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen min-w-0 overflow-x-hidden bg-background pt-24 text-foreground transition-colors duration-300 sm:pt-28">
        {/* Intro */}
        <section className="container mx-auto px-5 py-16 sm:py-20 md:px-8 md:py-24 lg:py-36">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.22em]">
                About Allocatr
              </p>

              <motion.h1
                className="max-w-5xl break-words text-4xl font-black uppercase leading-[0.93] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
              >
                Better work starts with the{" "}
                <span className="text-primary">right connection.</span>
              </motion.h1>
            </div>

            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
            >
              <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                Allocatr brings clients and skilled professionals together,
                then gives them the tools to manage the work clearly from
                beginning to end.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 w-full rounded-full px-7 shadow-none sm:w-auto">
                  Post a job
                  <ArrowUpRightIcon size={16} />
                </Button>

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full px-7 shadow-none sm:w-auto"
                >
                  Join as an Allocat
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand definition */}
        <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-28 lg:pb-40">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#151515] px-5 py-12 text-white dark:bg-[#090909] sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-amber-300/20 sm:h-72 sm:w-72" />
            <div className="absolute -bottom-20 right-1/4 h-52 w-52 rounded-full border border-sky-300/15" />

            <div className="relative grid min-w-0 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
              <div className="flex justify-center lg:justify-start">
                <motion.div
                  className="flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-primary sm:h-52 sm:w-52"
                  initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
                  whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <img
                    src={assets.allocatrIcon}
                    alt="Allocatr cat icon"
                    className="w-24 sm:w-32"
                  />
                </motion.div>
              </div>

              <div className="min-w-0">
                <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/55 sm:text-xs">
                  What is an Allocat?
                </p>

                <h2 className="max-w-4xl break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl">
                  A professional with the skill to get the job{" "}
                  <span className="text-amber-300">done properly.</span>
                </h2>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                  An Allocat is experienced, capable and ready to take
                  responsibility for meaningful work. They are not just listed
                  on the platform. They are part of the project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why we exist */}
        <section className="border-y border-border bg-muted/20 dark:bg-muted/10">
          <div className="container mx-auto px-5 py-16 sm:py-20 md:px-8 md:py-24 lg:py-36">
            <div className="grid min-w-0 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="min-w-0">
                <SectionHeading eyebrow="Why we exist">
                  Finding talent should not feel like{" "}
                  <span className="text-primary">guesswork.</span>
                </SectionHeading>
              </div>

              <div className="min-w-0">
                <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                  Too often, people know what they need done but do not know
                  where to find the right person. At the same time, capable
                  professionals struggle to find consistent opportunities.
                </p>

                <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                  Allocatr closes that gap. It creates a clearer way to discover
                  skills, begin working relationships and keep the project
                  organized after the first introduction.
                </p>
              </div>
            </div>

            <div className="mt-12 grid border-y border-border md:mt-16 md:grid-cols-3">
              {principles.map((principle, index) => (
                <motion.article
                  key={principle.number}
                  className={[
                    "min-w-0 py-8 md:px-7 md:py-10 lg:px-10",
                    index !== principles.length - 1
                      ? "border-b border-border md:border-b-0 md:border-r"
                      : "",
                  ].join(" ")}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.12, duration: 0.55 }}
                >
                  <span className="text-xs font-bold text-primary">
                    {principle.number}
                  </span>

                  <h3 className="mt-8 max-w-xs break-words text-xl font-bold uppercase leading-tight sm:text-2xl">
                    {principle.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                    {principle.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto px-5 py-16 sm:py-20 md:px-8 md:py-24 lg:py-36">
          <div className="grid min-w-0 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <article className="min-w-0">
              <SectionHeading eyebrow="Our mission">
                Make skilled work easier to{" "}
                <span className="text-primary">find, manage and complete.</span>
              </SectionHeading>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Allocatr is designed to support the entire working relationship,
                not only the first connection. That means clearer project
                details, better visibility and fewer loose ends.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Give skilled professionals better visibility",
                  "Help clients make informed choices",
                  "Keep tasks and deadlines organized",
                  "Make progress easier to understand",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 text-sm sm:text-base"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.45 }}
                  >
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        index % 2 === 0
                          ? "bg-emerald-300/25 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
                          : "bg-sky-300/25 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
                      ].join(" ")}
                    >
                      <CheckCircle2Icon size={17} />
                    </span>

                    {item}
                  </motion.li>
                ))}
              </ul>
            </article>

            <motion.aside
              className="relative min-w-0 overflow-hidden rounded-[2rem] border border-border bg-card p-7 text-card-foreground sm:p-9 md:p-12"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-amber-300/25 dark:bg-amber-400/10" />

              <TargetIcon size={32} className="relative text-primary" />

              <p className="relative mt-20 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                The outcome
              </p>

              <h3 className="relative mt-3 break-words text-3xl font-black uppercase leading-[0.98] sm:text-4xl">
                Less uncertainty. Better work.
              </h3>

              <p className="relative mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                The platform should make both sides feel more prepared,
                informed and confident about what happens next.
              </p>
            </motion.aside>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-border bg-background py-16 text-foreground sm:py-20 md:py-24 lg:py-36">
          <div className="container mx-auto px-5 md:px-8">
            <div className="max-w-4xl">
              <SectionHeading eyebrow="What guides us">
                Built around simple principles that make{" "}
                <span className="text-primary">work better.</span>
              </SectionHeading>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14">
              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.article
                    key={value.title}
                    className={[
                      "flex min-h-[260px] min-w-0 flex-col justify-between",
                      "rounded-[1.75rem] border border-border bg-card p-6",
                      "text-card-foreground transition-colors",
                      "sm:min-h-[300px] sm:rounded-[2rem] sm:p-8",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.1, duration: 0.55 }}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${value.accent}`}
                    >
                      <Icon size={24} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words text-2xl font-black uppercase sm:text-3xl">
                        {value.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                        {value.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How the platform helps */}
        <section className="bg-background pb-20 text-foreground md:pb-28 lg:pb-40">
          <div className="container mx-auto px-5 md:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#151515] px-6 py-12 text-white dark:bg-[#090909] sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16">
              <div className="grid min-w-0 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
                <div className="min-w-0">
                  <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                    How it comes together
                  </p>

                  <h2 className="break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl md:text-5xl">
                    One path from the first idea to{" "}
                    <span className="text-amber-300">finished work.</span>
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {journey.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <motion.article
                        key={step.title}
                        className="flex min-h-[230px] min-w-0 flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <Icon
                            size={23}
                            className={
                              index % 2 === 0
                                ? "text-amber-300"
                                : "text-emerald-300"
                            }
                          />

                          <span className="text-xs font-semibold text-white/35">
                            0{index + 1}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold">{step.title}</h3>

                          <p className="mt-3 text-sm leading-7 text-white/60">
                            {step.description}
                          </p>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who it is for */}
        <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-28 lg:pb-40">
          <div className="mb-10 max-w-4xl md:mb-14">
            <SectionHeading eyebrow="Made for both sides">
              A stronger platform for people who need work done and people who{" "}
              <span className="text-primary">know how to do it.</span>
            </SectionHeading>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <motion.article
              className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card p-7 text-card-foreground sm:p-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-[7rem] bg-sky-300/20 dark:bg-sky-400/10" />

              <BriefcaseBusinessIcon
                size={30}
                className="relative text-sky-600 dark:text-sky-300"
              />

              <div className="relative mt-24">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  For clients
                </p>

                <h3 className="mt-3 max-w-xl break-words text-3xl font-black uppercase leading-[0.98] sm:text-4xl">
                  Find the right person without wasting time.
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Share your project, compare suitable professionals and keep
                  the work organized once it begins.
                </p>
              </div>
            </motion.article>

            <motion.article
              className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-border bg-card p-7 text-card-foreground sm:p-10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-[7rem] bg-emerald-300/20 dark:bg-emerald-400/10" />

              <SparklesIcon
                size={30}
                className="relative text-emerald-600 dark:text-emerald-300"
              />

              <div className="relative mt-24">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  For Allocats
                </p>

                <h3 className="mt-3 max-w-xl break-words text-3xl font-black uppercase leading-[0.98] sm:text-4xl">
                  Show your skills and find meaningful work.
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Build a stronger professional presence, discover suitable
                  opportunities and manage your active projects clearly.
                </p>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-background px-5 pb-8 text-foreground md:px-8">
          <div className="container mx-auto overflow-hidden rounded-[1.75rem] bg-primary px-5 py-12 text-primary-foreground sm:rounded-[2.5rem] sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
            <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="min-w-0">
                <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] opacity-70 sm:text-xs">
                  Let’s get to work
                </p>

                <h2 className="max-w-5xl break-words text-3xl font-black uppercase leading-[0.94] tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Great work begins when the right people find each other.
                </h2>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                <Button
                  size="lg"
                  className="h-[52px] w-full rounded-full bg-[#151515] px-8 text-white shadow-none hover:bg-[#151515]/90 dark:bg-black dark:hover:bg-black/80 sm:w-auto"
                >
                  Post a job
                  <ArrowUpRightIcon size={17} />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-[52px] w-full rounded-full border-current/25 bg-transparent px-8 text-current shadow-none hover:bg-white/15 sm:w-auto"
                >
                  Become an Allocat
                </Button>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

export default AboutPage;