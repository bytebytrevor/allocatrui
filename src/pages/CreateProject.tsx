// import {
//   ArrowLeftIcon,
//   CheckCircle2Icon,
//   FolderPlusIcon,
//   SparklesIcon,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import NewProjectForm from "@/components/NewProjectForm";
// import MinimalNavMenu from "@/components/MinimalNavMenu";
// import robocat from "@/assets/robocat.svg";
// import { Button } from "@/components/ui/button";

// const features = [
//   "Define the work clearly",
//   "Set dates and priorities",
//   "Connect with suitable Allocats",
// ];

// function CreateProject() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-muted/30">
//       <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <MinimalNavMenu />
//         </div>
//       </header>

//       <main className="relative overflow-hidden">
//         {/* Background details */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
//           <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl" />
//         </div>

//         <div className="container relative mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() => navigate(-1)}
//             className="mb-6 -ml-3 rounded-full text-muted-foreground hover:text-foreground"
//           >
//             <ArrowLeftIcon size={17} />
//             Back
//           </Button>

//           <div className="grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12 xl:gap-16">
//             {/* Intro panel */}
//             <aside className="lg:sticky lg:top-32">
//               <div className="overflow-hidden rounded-[2rem] border border-border bg-foreground p-6 text-background sm:p-8 lg:p-10">
//                 <div className="relative">
//                   <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-background/10" />
//                   <div className="absolute -right-6 top-4 h-28 w-28 rounded-full border border-background/10" />

//                   <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-background/10">
//                     <img
//                       src={robocat}
//                       alt="Allocatr robot cat"
//                       className="h-11 w-11 object-contain"
//                     />
//                   </div>

//                   <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-background/55">
//                     New workspace
//                   </p>

//                   <h1 className="mt-4 text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-5xl">
//                     Create your project.
//                   </h1>

//                   <p className="mt-6 max-w-md text-sm leading-7 text-background/65 sm:text-base">
//                     Tell us what needs to be done. We will help you organise
//                     the project and connect with professionals who match the
//                     work.
//                   </p>

//                   <div className="mt-10 space-y-4">
//                     {features.map((feature) => (
//                       <div
//                         key={feature}
//                         className="flex items-center gap-3 text-sm text-background/80"
//                       >
//                         <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
//                           <CheckCircle2Icon size={16} />
//                         </span>

//                         {feature}
//                       </div>
//                     ))}
//                   </div>

//                   <div className="mt-10 rounded-2xl border border-background/10 bg-background/5 p-4">
//                     <div className="flex items-start gap-3">
//                       <SparklesIcon
//                         size={18}
//                         className="mt-0.5 shrink-0 text-primary"
//                       />

//                       <p className="text-xs leading-6 text-background/60">
//                         You can add tasks and invite collaborators after the
//                         project has been created.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </aside>

//             {/* Form panel */}
//             <section className="min-w-0 overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl shadow-black/[0.04]">
//               <div className="border-b border-border px-5 py-6 sm:px-8 lg:px-10">
//                 <div className="flex items-center gap-3">
//                   <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//                     <FolderPlusIcon size={21} />
//                   </span>

//                   <div>
//                     <h2 className="text-lg font-bold sm:text-xl">
//                       Project details
//                     </h2>

//                     <p className="mt-1 text-sm text-muted-foreground">
//                       Complete the three short steps below.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5 sm:p-8 lg:p-10">
//                 <NewProjectForm />
//               </div>
//             </section>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CreateProject;


import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  FolderPlusIcon,
  SparklesIcon,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";

import robocat from "@/assets/robocat.svg";

import { Button } from "@/components/ui/button";

const features = [
  {
    number: "01",
    title: "Define the work",
    description:
      "Give the project a clear title, scope and category.",
  },
  {
    number: "02",
    title: "Set expectations",
    description:
      "Add dates, priority and the details professionals need.",
  },
  {
    number: "03",
    title: "Find the right skills",
    description:
      "Invite Allocats once your project workspace is ready.",
  },
];

function CreateProject() {
  const navigate =
    useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main className="relative overflow-hidden">

        {/* Quiet background treatment */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-48 top-10 h-[30rem] w-[30rem] rounded-full bg-primary/[0.025] blur-3xl" />

          <div className="absolute -right-52 top-[28%] h-[34rem] w-[34rem] rounded-full bg-primary/[0.02] blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

          {/* =================================================
              BACK
          ================================================= */}

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              navigate(-1)
            }
            className="mb-7 -ml-3 h-10 rounded-lg px-3 text-xs font-medium text-muted-foreground shadow-none hover:text-foreground"
          >
            <ArrowLeftIcon
              size={15}
            />

            Back
          </Button>

          {/* =================================================
              LAYOUT
          ================================================= */}

          <div className="grid min-w-0 gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 xl:grid-cols-[0.68fr_1.32fr] xl:gap-20">

            {/* =============================================
                INTRO
            ============================================= */}

            <motion.aside
              className="min-w-0 lg:sticky lg:top-28 lg:self-start"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              <div className="max-w-xl">

                {/* Identity */}

                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08]">
                    <img
                      src={robocat}
                      alt="Allocatr robot cat"
                      className="h-8 w-8 object-contain"
                    />
                  </span>

                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-primary">
                      New project
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Create your workspace
                    </p>
                  </div>
                </div>

                {/* Heading */}

                <h1 className="mt-8 max-w-lg text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.4rem]">
                  Start with a
                  clear brief.

                  <span className="block text-primary">
                    Build from there.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Tell us what needs to be
                  done and create the project
                  space where your Allocats,
                  tasks and progress will
                  eventually live.
                </p>

                {/* Workflow */}

                <div className="mt-10 divide-y divide-border border-y border-border">
                  {features.map(
                    (
                      feature,
                      index,
                    ) => (
                      <motion.div
                        key={
                          feature.number
                        }
                        className="grid gap-3 py-5 sm:grid-cols-[42px_1fr]"
                        initial={{
                          opacity: 0,
                          x: -12,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            0.1 +
                            index *
                              0.08,
                          duration:
                            0.45,
                        }}
                      >
                        <span className="text-[0.62rem] font-semibold text-primary">
                          {
                            feature.number
                          }
                        </span>

                        <div>
                          <h2 className="text-sm font-bold">
                            {
                              feature.title
                            }
                          </h2>

                          <p className="mt-1 text-xs leading-6 text-muted-foreground">
                            {
                              feature.description
                            }
                          </p>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>

                {/* Tip */}

                <motion.div
                  className="mt-7 flex items-start gap-3 rounded-xl bg-muted/35 p-4"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.34,
                    duration: 0.45,
                  }}
                >
                  <SparklesIcon
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />

                  <p className="text-xs leading-6 text-muted-foreground">
                    You do not need to plan every
                    task here. Create the project
                    first, then build the working
                    plan inside its workspace.
                  </p>
                </motion.div>

                {/* Quiet status row */}

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.68rem] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2Icon
                      size={13}
                      className="text-primary"
                    />

                    Brief first
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2Icon
                      size={13}
                      className="text-primary"
                    />

                    Tasks later
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2Icon
                      size={13}
                      className="text-primary"
                    />

                    Invite when ready
                  </span>
                </div>
              </div>
            </motion.aside>

            {/* =============================================
                FORM
            ============================================= */}

            <motion.section
              className="min-w-0"
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
                duration: 0.65,
                ease: "easeOut",
              }}
            >
              <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-border">

                {/* Header */}

                <div className="flex items-center gap-4 border-b border-border bg-card/40 px-5 py-5 sm:px-7 lg:px-9">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                    <FolderPlusIcon
                      size={19}
                    />
                  </span>

                  <div className="min-w-0">
                    <h2 className="text-base font-bold sm:text-lg">
                      Project details
                    </h2>

                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                      Add the core information
                      needed to create the
                      workspace.
                    </p>
                  </div>
                </div>

                {/* Form */}

                <div className="bg-background p-5 sm:p-7 lg:p-9">
                  <NewProjectForm />
                </div>
              </div>

              {/* Bottom reassurance */}

              <div className="mt-4 flex items-start gap-2 px-1 text-[0.68rem] leading-5 text-muted-foreground">
                <CheckCircle2Icon
                  size={13}
                  className="mt-0.5 shrink-0 text-primary"
                />

                You can update the project,
                add tasks and invite Allocats
                after creation.
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateProject;