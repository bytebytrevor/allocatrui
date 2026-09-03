import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

import SpaceCat from "../assets/space-cat.svg";

import MainNav from "./MainNav";
import { Button } from "./ui/button";
import SiteHeader from "./SiteHeader";

function NotFoundErrorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80">
        <div className="container mx-auto">
          {/* <MainNav /> */}
          <SiteHeader />
        </div>
      </header>

      <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-primary/[0.05] blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" />
        </div>

        <div className="container relative mx-auto px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-8 rounded-full bg-primary/[0.06] blur-3xl" />

                <img
                  src={SpaceCat}
                  alt="Space cat"
                  className="relative w-full max-w-[320px] sm:max-w-[380px]"
                />
              </div>
            </div>

            <div className="max-w-xl text-center lg:text-left">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                Error 404
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Oops! Page not found.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                Looks like Schrödinger&apos;s cat fell off the map.. but
                don&apos;t worry, you haven&apos;t hit your 9th life just yet.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Button
                  asChild
                  className="group h-10 rounded-lg px-5 shadow-none"
                >
                  <Link to="/">
                    Respawn to Earth

                    <ArrowRightIcon
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
                <span className="h-px w-8 bg-border" />

                <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Lost in the allocation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFoundErrorPage;