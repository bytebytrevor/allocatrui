import { Link } from "react-router-dom";
import { ArrowRightIcon, SatelliteIcon } from "lucide-react";

import SpaceCat from "../assets/space-cat.svg";

import { Button } from "./ui/button";
import SiteHeader from "./SiteHeader";

const stars = [
  { left: "7%", top: "18%", size: "h-1 w-1", delay: "0s", duration: "3.8s" },
  {
    left: "14%",
    top: "72%",
    size: "h-1.5 w-1.5",
    delay: "1s",
    duration: "4.4s",
  },
  { left: "21%", top: "34%", size: "h-1 w-1", delay: "0.4s", duration: "3.2s" },
  { left: "31%", top: "12%", size: "h-1 w-1", delay: "1.8s", duration: "4.8s" },
  { left: "39%", top: "80%", size: "h-1 w-1", delay: "0.7s", duration: "3.6s" },
  {
    left: "51%",
    top: "21%",
    size: "h-1.5 w-1.5",
    delay: "1.4s",
    duration: "4.2s",
  },
  { left: "61%", top: "68%", size: "h-1 w-1", delay: "0.2s", duration: "4.7s" },
  { left: "69%", top: "13%", size: "h-1 w-1", delay: "2s", duration: "3.9s" },
  {
    left: "76%",
    top: "84%",
    size: "h-1.5 w-1.5",
    delay: "0.9s",
    duration: "4.5s",
  },
  { left: "84%", top: "29%", size: "h-1 w-1", delay: "1.6s", duration: "3.4s" },
  { left: "92%", top: "61%", size: "h-1 w-1", delay: "0.5s", duration: "4.1s" },
  { left: "96%", top: "15%", size: "h-1 w-1", delay: "2.2s", duration: "4.9s" },
];

function NotFoundErrorPage() {
  return (
    <div className="min-h-screen bg-surface-2/20 text-foreground dark:bg-background">
      <style>{`
        @keyframes space-cat-float {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(-1deg);
          }

          50% {
            transform: translate3d(0, -12px, 0) rotate(1deg);
          }
        }

        @keyframes space-orbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes space-drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(7px, -5px, 0);
          }
        }

        .space-cat-float {
          animation: space-cat-float 7s ease-in-out infinite;
        }

        .space-orbit {
          animation: space-orbit 28s linear infinite;
        }

        .space-drift {
          animation: space-drift 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .space-cat-float,
          .space-orbit,
          .space-drift,
          .space-star {
            animation: none !important;
          }
        }
      `}</style>

      <header className="relative z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SiteHeader />
        </div>
      </header>

      <main className="relative z-0 isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          {stars.map((star, index) => (
            <span
              key={index}
              className={[
                "space-star absolute rounded-full bg-muted-foreground/25",
                "animate-pulse",
                star.size,
              ].join(" ")}
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}

          <span className="absolute left-[6%] top-[49%] h-px w-20 rotate-[-18deg] bg-border/50" />

          <span className="absolute right-[8%] top-[22%] h-px w-14 rotate-[28deg] bg-border/40" />

          <span className="absolute bottom-[16%] right-[22%] h-px w-10 rotate-[-35deg] bg-border/40" />
        </div>

        <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-24">
            <div className="order-2 flex justify-center lg:order-1">
              <div className="pointer-events-none relative flex aspect-square w-full max-w-[430px] select-none items-center justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-[10%] rounded-full border border-border/55"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-[20%] rotate-[18deg] rounded-full border border-dashed border-border/50"
                />

                <div
                  aria-hidden="true"
                  className="space-orbit absolute inset-[14%] rounded-full"
                >
                  <span
                    className={[
                      "absolute left-1/2 top-[-5px] flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-lg",
                      "border border-border/60 bg-card text-muted-foreground",
                    ].join(" ")}
                  >
                    <SatelliteIcon size={13} />
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="space-drift absolute left-[5%] top-[26%]"
                >
                  <span className="block h-2 w-2 rounded-full border border-brand-secondary-highlight/40 bg-brand-secondary-highlight/[0.10] dark:border-secondary/40 dark:bg-secondary/[0.10]" />
                </div>

                <div
                  aria-hidden="true"
                  className="space-drift absolute bottom-[23%] right-[5%]"
                  style={{
                    animationDelay: "-2.5s",
                  }}
                >
                  <span className="block h-3 w-3 rotate-45 border border-border/70 bg-card" />
                </div>

                <div className="space-cat-float relative z-10">
                  <img
                    src={SpaceCat}
                    alt="Space cat floating lost in space"
                    className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[380px]"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            <div className="order-1 relative z-20 mx-auto max-w-xl text-center lg:order-2 lg:mx-0 lg:text-left">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brand-secondary-highlight dark:text-secondary">
                Error 404
              </p>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                Oops! Page not found.
              </h1>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base lg:mx-0">
                Looks like Schrödinger&apos;s cat fell off the map... but
                don&apos;t worry, you haven&apos;t hit your 9th life just yet.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Button
                  asChild
                  className={[
                    "h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
                    "border border-brand-secondary-highlight/15",
                    "bg-brand-secondary-highlight text-primary-foreground",
                    "transition-opacity duration-150",
                    "hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90",
                    "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20",
                    "dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground",
                    "dark:hover:bg-secondary dark:hover:text-secondary-foreground",
                    "dark:focus-visible:ring-secondary/20",
                  ].join(" ")}
                >
                  <Link to="/">
                    Respawn to Earth
                    <ArrowRightIcon size={14} />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-8 bg-border" />

                <p className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Lost in the allocation
                </p>

                <span className="h-px w-8 bg-border lg:hidden" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFoundErrorPage;
