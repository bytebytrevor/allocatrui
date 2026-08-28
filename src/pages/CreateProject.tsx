import {
  ArrowLeftIcon,
  FolderPlusIcon,
  InfoIcon,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";

import {
  Button,
} from "@/components/ui/button";

function CreateProject() {
  const navigate =
    useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={[
          "sticky top-0 z-40",
          "border-b border-border/60",
          "bg-background/90 backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main className="relative">
        <div
          className={[
            "mx-auto w-full max-w-5xl",
            "px-4 py-7",
            "sm:px-6 sm:py-10",
            "lg:px-8 lg:py-12",
          ].join(" ")}
        >
          {/* =================================================
              BACK
          ================================================= */}

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              navigate(-1)
            }
            className={[
              "-ml-3 h-9 rounded-lg px-3",
              "text-xs font-medium text-muted-foreground",
              "shadow-none",
              "hover:text-foreground",
            ].join(" ")}
          >
            <ArrowLeftIcon
              size={14}
            />

            Back
          </Button>

          {/* =================================================
              PAGE INTRO
          ================================================= */}

          <motion.header
            className="mt-8 max-w-3xl"
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <div className="flex items-center gap-2 text-primary">
              <FolderPlusIcon
                size={16}
              />

              <p
                className={[
                  "text-[0.62rem] font-semibold uppercase",
                  "tracking-[0.17em]",
                ].join(" ")}
              >
                New project
              </p>
            </div>

            <h1
              className={[
                "mt-4",
                "text-3xl font-black leading-[1.05]",
                "tracking-[-0.035em]",
                "sm:text-4xl",
              ].join(" ")}
            >
              Create a project.
            </h1>

            <p
              className={[
                "mt-3 max-w-2xl",
                "text-sm leading-7 text-muted-foreground",
                "sm:text-base",
              ].join(" ")}
            >
              Add the core project details now.
              Tasks, collaborators and other
              workspace details can be added
              afterwards.
            </p>
          </motion.header>

          {/* =================================================
              SMALL HINT
          ================================================= */}

          <motion.div
            className={[
              "mt-7 flex max-w-3xl items-start gap-2.5",
              "border-l-2 border-primary/40",
              "pl-4",
            ].join(" ")}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.08,
              duration: 0.45,
            }}
          >
            <InfoIcon
              size={14}
              className="mt-1 shrink-0 text-muted-foreground"
            />

            <p className="text-xs leading-6 text-muted-foreground">
              A clear title, category and brief
              are enough to get started. You can
              refine the project as the work
              develops.
            </p>
          </motion.div>

          {/* =================================================
              FORM
          ================================================= */}

          <motion.section
            className="mt-9 min-w-0"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.55,
              ease: "easeOut",
            }}
          >
            <div
              className={[
                "overflow-hidden",
                "rounded-[1.5rem]",
                "border border-border/80",
                "bg-background",
              ].join(" ")}
            >
              {/* Form heading */}

              <div
                className={[
                  "flex items-center justify-between gap-5",
                  "border-b border-border/70",
                  "px-5 py-5",
                  "sm:px-7",
                  "lg:px-9",
                ].join(" ")}
              >
                <div>
                  <h2 className="text-sm font-bold sm:text-base">
                    Project details
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the three steps below.
                  </p>
                </div>

                <span
                  className={[
                    "hidden text-[0.62rem] font-semibold uppercase",
                    "tracking-[0.14em] text-muted-foreground",
                    "sm:block",
                  ].join(" ")}
                >
                  Takes a few minutes
                </span>
              </div>

              {/* Form body */}

              <div
                className={[
                  "px-5 py-6",
                  "sm:px-7 sm:py-8",
                  "lg:px-9 lg:py-9",
                ].join(" ")}
              >
                <NewProjectForm />
              </div>
            </div>
          </motion.section>

          {/* =================================================
              FOOTER HINT
          ================================================= */}

          <div
            className={[
              "mt-4 flex items-center justify-between gap-5",
              "px-1 text-[0.68rem] text-muted-foreground",
            ].join(" ")}
          >
            <p>
              Nothing here is permanent. Project
              details can be updated later.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateProject;