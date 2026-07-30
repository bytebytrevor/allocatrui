// import NewProjectForm from "@/components/NewProjectForm";
// import MinimalNavMenu from "@/components/MinimalNavMenu";
// import robocat from "@/assets/robocat.svg";

// function CreateProject() {

//     return (
//         <>  
//             <header className="bg-background sticky top-0 border-b z-10">
//                 <div className="container mx-auto px-4">
//                     <MinimalNavMenu />
//                 </div>
//             </header>
//             <main className="container flex flex-col items-center mx-auto px-2 py-8">
//                     <div className="w-2xl">
//                         <img
//                         className="bg-input w-24 rounded-sm"
//                             src={robocat}
//                             alt=""
//                         />
//                             <span>
//                                 <h2 className="text-2xl text-primary font-bold my-4">Create New Project</h2>
//                                 <p className="text-sm text-muted-foreground w-sm py-4 leading-[1rem]">Start by defining your project details, setting goals, and assigning tasks to the right experts.</p>
//                             </span>
                    
//                         <div>
//                             <NewProjectForm />
//                         </div>
//                     </div>               
//             </main>
//         </>
//     );
// }

// export default CreateProject;


import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  FolderPlusIcon,
  SparklesIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import NewProjectForm from "@/components/NewProjectForm";
import MinimalNavMenu from "@/components/MinimalNavMenu";
import robocat from "@/assets/robocat.svg";
import { Button } from "@/components/ui/button";

const features = [
  "Define the work clearly",
  "Set dates and priorities",
  "Connect with suitable Allocats",
];

function CreateProject() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MinimalNavMenu />
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Background details */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/[0.07] blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-3 rounded-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon size={17} />
            Back
          </Button>

          <div className="grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12 xl:gap-16">
            {/* Intro panel */}
            <aside className="lg:sticky lg:top-32">
              <div className="overflow-hidden rounded-[2rem] border border-border bg-foreground p-6 text-background sm:p-8 lg:p-10">
                <div className="relative">
                  <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-background/10" />
                  <div className="absolute -right-6 top-4 h-28 w-28 rounded-full border border-background/10" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-background/10">
                    <img
                      src={robocat}
                      alt="Allocatr robot cat"
                      className="h-11 w-11 object-contain"
                    />
                  </div>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-background/55">
                    New workspace
                  </p>

                  <h1 className="mt-4 text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-5xl">
                    Create your project.
                  </h1>

                  <p className="mt-6 max-w-md text-sm leading-7 text-background/65 sm:text-base">
                    Tell us what needs to be done. We will help you organise
                    the project and connect with professionals who match the
                    work.
                  </p>

                  <div className="mt-10 space-y-4">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm text-background/80"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
                          <CheckCircle2Icon size={16} />
                        </span>

                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 rounded-2xl border border-background/10 bg-background/5 p-4">
                    <div className="flex items-start gap-3">
                      <SparklesIcon
                        size={18}
                        className="mt-0.5 shrink-0 text-primary"
                      />

                      <p className="text-xs leading-6 text-background/60">
                        You can add tasks and invite collaborators after the
                        project has been created.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Form panel */}
            <section className="min-w-0 overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl shadow-black/[0.04]">
              <div className="border-b border-border px-5 py-6 sm:px-8 lg:px-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FolderPlusIcon size={21} />
                  </span>

                  <div>
                    <h2 className="text-lg font-bold sm:text-xl">
                      Project details
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Complete the three short steps below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <NewProjectForm />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateProject;