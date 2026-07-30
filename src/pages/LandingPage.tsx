import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  Clock3Icon,
  HammerIcon,
  LaptopIcon,
  PaintbrushIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";

import AnimatedText from "@/components/AnimatedText";
import AnimatedIconScale from "@/components/AnimatedIconScale";
import HomeHeader from "@/components/HeroMain";
import assets from "@/assets/assets";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/auth/useAuth";

const objectives = [
  {
    number: "01",
    title: "Find the right skill",
    description:
      "Connect with experienced professionals whose skills match the work you need done.",
    accent: "bg-amber-400",
  },
  {
    number: "02",
    title: "Manage work clearly",
    description:
      "Keep tasks, deadlines, progress and communication organized in one shared workspace.",
    accent: "bg-emerald-400",
  },
  {
    number: "03",
    title: "Get things moving",
    description:
      "Spend less time searching and following up, and more time getting meaningful work completed.",
    accent: "bg-sky-400",
  },
];

const benefits = [
  {
    title: "Post",
    description:
      "Describe the work, set expectations and share the details professionals need.",
    icon: assets.crossShapeIcon,
    accent: "bg-amber-400/15",
    numberColor: "text-amber-500",
  },
  {
    title: "Match",
    description:
      "Discover skilled Allocats based on category, experience and relevant expertise.",
    icon: assets.lShapeIcon,
    accent: "bg-emerald-400/15",
    numberColor: "text-emerald-500",
  },
  {
    title: "Manage",
    description:
      "Track tasks, due dates and project progress until the work is complete.",
    icon: assets.rhombusIcon,
    accent: "bg-sky-400/15",
    numberColor: "text-sky-500",
  },
];

const services = [
  {
    title: "Home repairs",
    description: "Plumbing, electrical work, roofing and everyday maintenance.",
    icon: WrenchIcon,
    label: "Popular",
    accent: "bg-amber-300",
  },
  {
    title: "Construction",
    description: "Builders, painters, welders, tilers and specialist trades.",
    icon: HammerIcon,
    label: "Skilled trades",
    accent: "bg-orange-300",
  },
  {
    title: "Delivery",
    description: "Reliable transport, courier and moving support when needed.",
    icon: TruckIcon,
    label: "On the move",
    accent: "bg-emerald-300",
  },
  {
    title: "Creative work",
    description: "Design, photography, video, branding and content support.",
    icon: PaintbrushIcon,
    label: "Creative",
    accent: "bg-pink-300",
  },
  {
    title: "Technology",
    description: "Web development, computer repair and technical assistance.",
    icon: LaptopIcon,
    label: "Digital",
    accent: "bg-sky-300",
  },
  {
    title: "Business support",
    description: "Administration, bookkeeping, consulting and project support.",
    icon: BriefcaseBusinessIcon,
    label: "Professional",
    accent: "bg-violet-300",
  },
];

const trustPoints = [
  {
    title: "Clear professional profiles",
    icon: UsersIcon,
    accent: "bg-amber-300/30",
  },
  {
    title: "Relevant skills and experience",
    icon: StarIcon,
    accent: "bg-emerald-300/30",
  },
  {
    title: "Organized project workspaces",
    icon: Clock3Icon,
    accent: "bg-sky-300/30",
  },
  {
    title: "Progress visible from start to finish",
    icon: CheckCircle2Icon,
    accent: "bg-violet-300/30",
  },
];

type ResponsiveHeadingProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function ResponsiveHeading({
  children,
  className = "",
  delay = 0,
}: ResponsiveHeadingProps) {
  return (
    <motion.h2
      className={[
        "max-w-full break-words text-3xl font-black leading-[0.96]",
        "tracking-[-0.035em] sm:text-4xl md:text-5xl lg:text-6xl",
        className,
      ].join(" ")}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay, duration: 0.65, ease: "easeOut" }}
    >
      {children}
    </motion.h2>
  );
}

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (user) {
      navigate("/projects", { replace: true });
    }
  }, [user, navigate]);

  function scrollServices(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  }

  if (user) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-primary"
        style={{ scaleX }}
      />

      <HomeHeader />

      <main className="min-w-0 overflow-x-hidden">
        {/* Platform objectives */}
        <section className="container mx-auto px-5 py-16 sm:py-20 md:px-8 md:py-24 lg:py-36">
          <div className="mb-10 flex min-w-0 flex-col gap-6 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.22em]">
                Built to move work forward
              </p>

              <ResponsiveHeading className="uppercase">
                Less chasing.
                <br />
                <span className="text-primary">More doing.</span>
              </ResponsiveHeading>
            </div>

            <p className="max-w-md text-sm leading-7 text-muted-foreground md:text-base">
              Allocatr gives clients and skilled professionals a clearer way to
              find each other, agree on the work and keep every project moving.
            </p>
          </div>

          <div className="grid border-y md:grid-cols-3">
            {objectives.map((objective, index) => (
              <motion.article
                key={objective.number}
                className={[
                  "group relative min-w-0 px-0 py-8 sm:py-10 md:px-6 lg:px-10",
                  index !== objectives.length - 1
                    ? "border-b md:border-b-0 md:border-r"
                    : "",
                ].join(" ")}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.12, duration: 0.55 }}
              >
                <div
                  className={`mb-6 h-1.5 w-10 rounded-full ${objective.accent}`}
                />

                <span className="text-xs font-semibold text-muted-foreground">
                  {objective.number}
                </span>

                <h3 className="mt-8 max-w-xs break-words text-xl font-bold uppercase leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl md:mt-10">
                  {objective.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                  {objective.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Allocatr definition */}
        <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-24 lg:pb-40">
          <div className="min-w-0 max-w-5xl">
            <ResponsiveHeading>
              An allocat is not your{" "}
              <span className="text-primary">typical feline.</span>
            </ResponsiveHeading>

            <div className="mt-7 grid gap-5 text-base leading-8 text-muted-foreground md:mt-8 md:grid-cols-2 md:text-lg">
              <AnimatedText
                delay={0.2}
                text='This sleek and skilled creature is a seasoned expert, drawing on years of experience to take on each task with finesse. Allocats are the go-to pros, springing into action faster than you can say "catnap".'
              />

              <AnimatedText
                delay={0.35}
                text="They are agile, reliable and anything but lazy, unless you count the occasional victory stretch after a job well done."
              />
            </div>
          </div>
        </section>

        {/* Why Allocats */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto grid min-w-0 gap-12 px-5 py-16 sm:py-20 md:px-8 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-36">
            <article className="min-w-0">
              <div className="mb-7 flex items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-amber-300/20 sm:h-16 sm:w-16">
                  <img
                    src={assets.allocatrIcon}
                    alt="Allocatr cat icon"
                    className="w-9 sm:w-10"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs sm:tracking-[0.2em]">
                    Meet the professionals
                  </p>

                  <h2 className="mt-1 text-sm font-semibold sm:text-base">
                    Lost time is so last season
                  </h2>
                </div>
              </div>

              <ResponsiveHeading className="max-w-4xl uppercase lg:text-6xl xl:text-7xl">
                We line up skilled pros so fast you’ll think time is on your{" "}
                <span className="text-primary">side.</span>
              </ResponsiveHeading>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                From urgent repairs to long-term business projects, find people
                with the right expertise and manage the work without losing
                track of the details.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button className="h-12 w-full rounded-full px-6 shadow-none sm:w-auto sm:px-8">
                  Post a job
                  <ArrowUpRightIcon size={16} />
                </Button>

                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full px-6 shadow-none sm:w-auto sm:px-8"
                >
                  Become an Allocat
                </Button>
              </div>
            </article>

            <div className="min-w-0 rounded-3xl border bg-background px-5 py-3 shadow-sm md:px-8">
              <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
                className="w-full"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="py-5 text-left text-base sm:py-6 sm:text-lg">
                    Certified and experienced
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground sm:pb-6">
                    Allocats can showcase qualifications, professional
                    experience and the work they are equipped to handle.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="py-5 text-left text-base sm:py-6 sm:text-lg">
                    Specialized experts
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground sm:pb-6">
                    Search beyond broad job titles and find people with skills
                    that closely match your project.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="py-5 text-left text-base sm:py-6 sm:text-lg">
                    Reliable and trustworthy
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground sm:pb-6">
                    Professional profiles, work history and project activity
                    create a clearer foundation for trust.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="py-5 text-left text-base sm:py-6 sm:text-lg">
                    Efficient and cost-effective
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground sm:pb-6">
                    Compare suitable professionals, clarify the scope and keep
                    delivery organized without unnecessary delays.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-5 py-16 sm:py-20 md:px-8 md:py-24 lg:py-36">
          <div className="mb-10 min-w-0 max-w-3xl md:mb-14">
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.22em]">
              Simple from the start
            </p>

            <ResponsiveHeading>
              From idea to done in{" "}
              <span className="text-primary">three clear moves.</span>
            </ResponsiveHeading>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
              No complicated process. Share the work, connect with suitable
              professionals and keep the project moving in one place.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {benefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                className={[
                  "group flex min-h-[280px] min-w-0 flex-col justify-between",
                  "overflow-hidden rounded-3xl border bg-background p-6",
                  "transition-all hover:-translate-y-1 hover:shadow-lg",
                  "sm:min-h-[320px] sm:p-7 md:min-h-[360px] md:p-8 lg:p-9",
                ].join(" ")}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.13, duration: 0.55 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    // className={`rounded-2xl p-3 sm:p-4 ${benefit.accent}`}
                    className={`rounded-2xl p-3 sm:p-4`}
                  >
                    <AnimatedIconScale
                      delay={index * 0.15}
                      imageSrc={benefit.icon}
                      imageAlt=""
                    />
                  </div>

                  <span
                    className={`text-xs font-bold ${benefit.numberColor}`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-3xl font-black uppercase sm:text-4xl">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">
                    {benefit.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Project management tools */}
        <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-28 lg:pb-40">
          <div className="grid min-w-0 items-center gap-10 overflow-hidden rounded-[1.75rem] border bg-muted/20 p-5 sm:rounded-[2rem] sm:p-7 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-16">
            <article className="min-w-0">
              <div className="mb-5 flex items-center gap-2 text-primary">
                <SparklesIcon size={18} />

                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em]">
                  More than a marketplace
                </span>
              </div>

              <ResponsiveHeading className="lg:text-5xl">
                Project management tools built into{" "}
                <span className="text-primary">the work.</span>
              </ResponsiveHeading>

              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                Organize tasks, track progress and manage deadlines without
                leaving the platform where you found your professional.
              </p>

              <ul className="mt-7 space-y-4 sm:mt-8">
                {[
                  "Visual task boards",
                  "Task statuses and deadlines",
                  "Real-time project progress",
                  "A shared view of the work",
                ].map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        index % 2 === 0
                          ? "bg-emerald-400/15 text-emerald-600"
                          : "bg-sky-400/15 text-sky-600",
                      ].join(" ")}
                    >
                      <CheckCircle2Icon size={16} />
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              <Button className="mt-9 h-12 w-full rounded-full px-6 shadow-none sm:mt-10 sm:w-auto sm:px-8">
                Explore the workspace
                <ArrowUpRightIcon size={16} />
              </Button>
            </article>

            <motion.div
              className="relative min-w-0"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-8 rounded-full bg-sky-300/20 blur-3xl sm:inset-10" />

              <img
                src={assets.computerPhone}
                alt="Allocatr project workspace shown on a laptop and phone"
                className="relative z-10 block h-auto w-full max-w-full object-contain"
              />
            </motion.div>
          </div>
        </section>

        {/* Job sizes statement */}
        <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-24 lg:pb-36">
          <article className="relative min-w-0 overflow-hidden rounded-[1.75rem] bg-foreground px-5 py-12 text-background sm:rounded-[2rem] sm:px-7 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border border-amber-300/20 sm:h-72 sm:w-72" />
            <div className="absolute -right-6 top-6 h-36 w-36 rounded-full border border-sky-300/20 sm:h-44 sm:w-44" />
            <div className="absolute bottom-8 right-10 h-3 w-3 rounded-full bg-emerald-400" />

            <p className="relative mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-background/60 sm:text-xs sm:tracking-[0.22em]">
              Every task counts
            </p>

            <motion.h3
              className={[
                "relative max-w-5xl break-words text-3xl font-black uppercase",
                "leading-[0.95] tracking-[-0.035em]",
                "sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
              ].join(" ")}
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              No job is too small. No project is too{" "}
              <span className="text-amber-300">ambitious.</span>
            </motion.h3>

            <div className="relative mt-8 flex flex-col gap-7 sm:mt-10 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-2xl text-sm leading-7 text-background/70 sm:text-base sm:leading-8">
                Whether it is a quick repair or a complex business project,
                Allocatr helps you find the right expertise and creates a clear
                place to manage the work.
              </p>

              <Button
                variant="secondary"
                className="h-12 w-full self-start rounded-full px-7 shadow-none sm:w-auto sm:px-8"
              >
                Get started
                <ArrowUpRightIcon size={16} />
              </Button>
            </div>
          </article>
        </section>

        {/* Horizontal service slider */}
        <section className="rounded-t-[2.5rem] bg-background py-16 text-foreground sm:rounded-t-[3rem] sm:py-20 md:rounded-t-[5rem] md:py-24 lg:py-36">
          <div className="container mx-auto px-5 md:px-8">
            <div className="flex min-w-0 flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0 max-w-3xl">
                <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs sm:tracking-[0.22em]">
                  Skills for real life
                </p>

                <ResponsiveHeading className="uppercase text-foreground">
                  Whatever needs doing,{" "}
                  <span className="text-primary">start here.</span>
                </ResponsiveHeading>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
                  Browse service areas and find professionals for home,
                  business, technical and creative work.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => scrollServices("left")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background sm:h-12 sm:w-12"
                  aria-label="View previous services"
                >
                  <ArrowLeftIcon size={19} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollServices("right")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-foreground hover:text-background sm:h-12 sm:w-12"
                  aria-label="View more services"
                >
                  <ArrowRightIcon size={19} />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={sliderRef}
            className={[
              "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6",
              "scroll-smooth md:mt-14 md:gap-5 md:px-8",
              "lg:pl-[max(2rem,calc((100vw-1280px)/2))]",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            ].join(" ")}
          >
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.title}
                  className={[
                    "group flex min-h-[340px] w-[calc(100vw-3rem)] max-w-[340px]",
                    "shrink-0 snap-start flex-col justify-between overflow-hidden",
                    "rounded-[1.75rem] border border-border bg-muted/40 p-6",
                    "sm:min-h-[400px] sm:w-[330px] sm:rounded-[2rem] sm:p-7",
                    "transition-transform duration-300 hover:-translate-y-1",
                  ].join(" ")}
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.5,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold ${service.accent}`}
                    >
                      {service.label}
                    </span>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 sm:h-12 sm:w-12">
                      <Icon size={21} />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-muted-foreground">
                      0{index + 1}
                    </span>

                    <h3 className="mt-3 break-words text-2xl font-black uppercase leading-tight sm:text-3xl">
                      {service.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                      {service.description}
                    </p>

                    <button
                      type="button"
                      className="mt-6 flex items-center gap-2 text-sm font-semibold sm:mt-7"
                    >
                      Explore category

                      <ArrowUpRightIcon
                        size={16}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* Trust section */}
        <section className="bg-background pb-20 text-foreground md:pb-28 lg:pb-40">
          <div className="container mx-auto px-5 md:px-8">
            <div className="grid min-w-0 gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6">
              <article className="min-w-0 rounded-[1.75rem] bg-foreground p-7 text-background sm:rounded-[2rem] sm:p-8 md:p-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300 text-slate-950">
                  <ShieldCheckIcon size={25} />
                </div>

                <h2 className="mt-12 max-w-xl break-words text-3xl font-black uppercase leading-[0.98] tracking-[-0.03em] sm:mt-16 sm:text-4xl md:text-5xl">
                  Confidence before the work begins.
                </h2>

                <p className="mt-5 text-sm leading-7 text-background/70 sm:text-base">
                  Better information helps clients make informed choices and
                  gives professionals a stronger way to show what they can do.
                </p>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;

                  return (
                    <article
                      key={point.title}
                      className="flex min-h-[180px] min-w-0 flex-col justify-between rounded-[1.75rem] border border-border bg-muted/30 p-6 sm:min-h-[210px] sm:rounded-[2rem] sm:p-7"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${point.accent}`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-muted-foreground">
                          0{index + 1}
                        </span>

                        <h3 className="mt-2 max-w-xs break-words text-lg font-bold sm:text-xl">
                          {point.title}
                        </h3>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-background px-5 pb-8 pt-8 text-foreground md:px-8 lg:pb-12">
          <div className="container mx-auto overflow-hidden rounded-[2rem] bg-primary sm:rounded-[2.75rem]">
            <div className="relative px-6 py-14 sm:px-10 sm:py-20 lg:px-20 lg:py-24">
              {/* Background decoration */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

                <div className="absolute right-10 top-10 h-3 w-3 rounded-full bg-white/40" />
                <div className="absolute bottom-16 left-1/3 h-2 w-2 rounded-full bg-white/30" />
              </div>

              <div className="relative grid items-end gap-12 lg:grid-cols-[1fr_auto]">
                <div className="max-w-4xl">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
                    Ready to get started?
                  </p>

                  <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                    Find the right person.
                    <br />
                    Get the work moving.
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/75 sm:text-lg">
                    Whether you're hiring skilled professionals or offering your own
                    expertise, Allocatr gives you one place to connect, collaborate and
                    keep every project on track.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-primary-foreground/85 backdrop-blur">
                      <CheckCircle2Icon size={16} />
                      Verified professionals
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-primary-foreground/85 backdrop-blur">
                      <CheckCircle2Icon size={16} />
                      Project management included
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-primary-foreground/85 backdrop-blur">
                      <CheckCircle2Icon size={16} />
                      Built for Zimbabwe
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-background px-8 text-primary shadow-none hover:bg-background/90"
                  >
                    Find Allocats
                    <ArrowRightIcon size={18} />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full border-2 border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Become an Allocat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background px-5 py-8 text-foreground sm:py-10 md:px-8">
          <div className="container mx-auto flex flex-col gap-6 border-t border-border pt-8 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Allocatr. Work, properly allocated.
            </p>

            <nav className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-6">
              <Link to="/about" className="hover:underline">
                About
              </Link>

              <Link to="/how-it-works" className="hover:underline">
                How it works
              </Link>

              <Link to="/terms" className="hover:underline">
                Terms
              </Link>

              <Link to="/privacy" className="hover:underline">
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}

export default LandingPage;