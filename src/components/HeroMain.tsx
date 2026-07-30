import {
  ArrowRightIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import SiteHeader from "./SiteHeader";

const highlights = [
  "Find skilled professionals",
  "Manage projects clearly",
  "Keep every deadline visible",
];

function HeroMain() {
  return (
    <header className="relative overflow-hidden rounded-b-[48px] border-b border-border bg-muted pb-14 sm:rounded-b-[72px] sm:pb-20 lg:rounded-b-[110px] lg:pb-28">
      <SiteHeader />

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-primary/[0.08] blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.12)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 pb-4 pt-32 sm:pt-36 md:pt-40 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pt-44">
          {/* Hero copy */}
          <div className="max-w-4xl">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              Work with the right people
            </motion.p>

            <motion.h1
              className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.75,
                ease: "easeOut",
              }}
            >
              The right Allocat for every task.
            </motion.h1>

            <motion.p
              className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg md:text-xl"
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.45,
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              Allocatr connects you with skilled professionals,
              keeps projects organised and gives everyone a clear
              view of the work ahead.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.65,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              <Button
                asChild
                className="h-[52px] rounded-2xl px-6 text-sm font-semibold"
              >
                <Link to="/allocats">
                  Find Allocats
                  <ArrowRightIcon />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-[52px] rounded-2xl px-6 text-sm font-semibold"
              >
                <Link to="/register">
                  Create an account
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="mt-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.85,
                duration: 0.7,
              }}
            >
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2Icon
                    size={17}
                    className="shrink-0 text-primary"
                  />

                  <span>{highlight}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dashboard advert */}
          <motion.div
            className="relative mx-auto w-full max-w-xl lg:mx-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background/85 p-5 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-7">
              {/* Decorative dashboard glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Active workspace
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      Website Redesign
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Hippo Car Rental
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    In progress
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">
                      Project progress
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-2xl font-black">
                        68%
                      </p>

                      <span className="text-xs font-medium text-primary">
                        +12%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[68%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">
                      Tasks remaining
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      12
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground">
                      4 due this week
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Next deadline
                      </p>

                      <p className="mt-1 truncate text-sm font-bold">
                        Homepage design review
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold">
                      14 Aug
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Assigned Allocat
                    </p>

                    <p className="mt-1 truncate text-sm font-bold">
                      Tinashe Moyo
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Product designer
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-primary/10">
                    TM
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border px-4 py-3">
                  <div className="flex -space-x-2">
                    {["TM", "RN", "KM"].map((initials) => (
                      <div
                        key={initials}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    3 collaborators active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default HeroMain;