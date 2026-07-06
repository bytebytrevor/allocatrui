import DashboardMainNav from "@/components/DashboardMainNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleDollarSignIcon,
  ClockIcon,
  Code2Icon,
  EditIcon,
  EyeIcon,
  FlameIcon,
  FolderCheckIcon,
  MailCheckIcon,
  MapPinIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UserRoundCheckIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import type { AllocatProfile } from "@/Types/allocatProfile";

function AllocatProfile() {
  
  const [allocatProfile, setAllocatProfile] = useState<AllocatProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
        async function fetchAllocatProfile() {
            try {
                const response = await api.get(
                    `/allocats/profiles/me`,
                    { withCredentials: true, }
                );
                setAllocatProfile(response.data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown"));
                }
            } finally {
                setLoading(false);
            }
        }

        fetchAllocatProfile();
    }, []);

    console.log(allocatProfile);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
        <div className="container mx-auto px-4">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container px-4 mx-auto py-8">
        <section className="flex items-end justify-between gap-6 mb-8">
          <div className="flex items-end gap-5">
            <div className="relative h-28 w-28 rounded-full border-4 border-background bg-primary text-primary-foreground flex items-center justify-center">
              <UserRoundCheckIcon size={50} />

              <span className="absolute -right-1 -bottom-1 h-10 w-10 rounded-full border-4 border-background bg-primary text-primary-foreground flex items-center justify-center">
                <BadgeCheckIcon size={20} />
              </span>
            </div>

            <div className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-black">{allocatProfile?.fullName}</h1>
                <Badge className="bg-primary text-primary-foreground border-primary shadow-none">
                  <BadgeCheckIcon size={14} />
                  Allocat
                </Badge>
              </div>

              <p className="text-sm font-medium mt-1">{allocatProfile?.headline}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPinIcon size={14} />
                  {allocatProfile?.location}
                </span>

                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-accent-2" />
                  {allocatProfile?.availability}
                </span>

                <span className="flex items-center gap-1">
                  <FlameIcon size={14} className="text-accent-3" />
                  {allocatProfile?.responseTime}
                </span>
              </div>

              <Badge
                variant="outline"
                className="mt-4 shadow-none bg-primary/5 text-primary border-primary/20"
              >
                <StarIcon size={14} />
                {allocatProfile?.level}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 pb-2">
            <Button variant="outline" className="shadow-none">
              <EyeIcon size={16} />
              Preview as client
            </Button>

            <Link to="/allocats/profile/edit">
              <Button className="shadow-none">
                <EditIcon size={16} />
                Edit profile
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-6">
            <section className="grid gap-4 md:grid-cols-4">
              <article className="rounded-xl border border-accent-2/20 bg-accent-2/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="h-14 w-14 rounded-full bg-accent-2/10 text-accent-2 flex items-center justify-center">
                    <CircleDollarSignIcon size={26} />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Rate</p>
                    <p className="text-3xl font-black">${allocatProfile?.hourlyRate}</p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="h-14 w-14 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <BriefcaseBusinessIcon size={26} />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-3xl font-black">{allocatProfile?.yearsExperience}</p>
                    <p className="text-xs text-muted-foreground">years</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-accent-3/20 bg-accent-3/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="h-14 w-14 rounded-full bg-accent-3/10 text-accent-3 flex items-center justify-center">
                    <StarIcon size={26} />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    {/* <p className="text-3xl font-black">{allocatProfile?.rating.toFixed(1)}</p> */}
                    <p className="text-3xl font-black">{3.45.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">
                      {allocatProfile?.ratingCount} reviews
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-4">
                  <span className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <FolderCheckIcon size={26} />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-3xl font-black">{allocatProfile?.completedProjects}</p>
                    <p className="text-xs text-muted-foreground">projects</p>
                  </div>
                </div>
              </article>
            </section>

            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <SparklesIcon size={18} />
                </span>
                <h2 className="font-bold">About Trevor</h2>
              </div>

              <p className="text-sm text-muted-foreground leading-8">
                {allocatProfile?.bio}
              </p>
            </article>

            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <FolderCheckIcon size={18} />
                  </span>
                  <h2 className="font-bold">Completed projects</h2>
                </div>

                <Button variant="outline" className="shadow-none">
                  View all projects
                </Button>
              </div>

              {/* <div className="space-y-3">
                {allocatProfile?.projects.map(project => (
                  <div
                    key={project.title}
                    className="rounded-xl border bg-muted/30 p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-11 w-11 rounded-full flex items-center justify-center ${project.accent}`}
                      >
                        {project.icon}
                      </span>

                      <div>
                        <p className="text-sm font-bold">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className="bg-accent-2/10 text-accent-2 border border-accent-2/20 shadow-none">
                        Completed
                        <CheckCircle2Icon size={14} />
                      </Badge>
                      <ArrowRightIcon size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div> */}
            </article>

            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Code2Icon size={18} />
                </span>
                <h2 className="font-bold">Skills & expertise</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {allocatProfile?.skills.map(skill => (
                  <span
                    key={skill}
                    className="rounded-full border bg-primary/5 text-primary border-primary/20 px-4 py-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-5">
            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheckIcon size={16} />
                </span>
                <h3 className="font-bold">Professional score</h3>
              </div>

              <div className="flex items-center gap-5">
                <div className="rounded-full border-[10px] p-6 border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-black">{allocatProfile?.professionalScore}%</p>
                    <p className="text-xs font-medium">Strong profile</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">You're doing great!</h4>
                  <p className="text-sm text-muted-foreground leading-6 mt-2">
                    Complete the remaining steps to strengthen your profile and attract more opportunities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1 mt-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 rounded-full ${
                      index < 5 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 text-xs">
                <span>5 of 6 steps completed</span>
                <button className="text-primary font-medium flex items-center gap-1">
                  See how it works
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </article>

            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheckIcon size={16} />
                </span>
                <h3 className="font-bold">Trust & verification</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-accent-2/10 text-accent-2 flex items-center justify-center">
                      <CheckCircle2Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-bold">Identity verified</p>
                      <p className="text-xs text-muted-foreground">
                        ID document verified
                      </p>
                    </div>
                  </div>

                  <Badge className="bg-accent-2/10 text-accent-2 border border-accent-2/20 shadow-none">
                    Verified
                  </Badge>
                </div>

                <div className="border-t" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-accent-3/10 text-accent-3 flex items-center justify-center">
                      <ClockIcon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-bold">Credentials</p>
                      <p className="text-xs text-muted-foreground">Under review</p>
                    </div>
                  </div>

                  <Badge className="bg-accent-3/10 text-accent-3 border border-accent-3/20 shadow-none">
                    Pending
                  </Badge>
                </div>

                <div className="border-t" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-accent-2/10 text-accent-2 flex items-center justify-center">
                      <MailCheckIcon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-bold">Email verified</p>
                      <p className="text-xs text-muted-foreground">{allocatProfile?.email}</p>
                    </div>
                  </div>

                  <Badge className="bg-accent-2/10 text-accent-2 border border-accent-2/20 shadow-none">
                    Verified
                  </Badge>
                </div>
              </div>

              <button className="mt-5 w-full text-sm text-primary font-medium flex items-center justify-center gap-1">
                View verification details
                <ArrowRightIcon size={14} />
              </button>
            </article>

            <article className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <span className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <RocketIcon size={28} />
                </span>

                <div>
                  <h3 className="font-bold">Grow your visibility</h3>
                  <p className="text-sm text-muted-foreground leading-6 mt-2">
                    Add portfolio pieces and keep completing projects to improve your ranking.
                  </p>

                  <Button variant="outline" className="shadow-none mt-5">
                    Add portfolio item
                  </Button>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default AllocatProfile;