import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  Clock3Icon,
  EditIcon,
  EyeIcon,
  FolderCheckIcon,
  MailCheckIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
} from "lucide-react";

import api from "@/api/axios";

import type {
  AllocatProfile,
} from "@/Types/allocatProfile";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Button,
} from "@/components/ui/button";

import {
  Progress,
} from "@/components/ui/progress";

import {
  Skeleton,
} from "@/components/ui/skeleton";

/* =========================================================
   PAGE
========================================================= */

function AllocatProfile() {
  const [
    allocatProfile,
    setAllocatProfile,
  ] =
    useState<AllocatProfile | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<Error | null>(
      null,
    );

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function fetchAllocatProfile() {
      try {
        setLoading(
          true,
        );

        setError(
          null,
        );

        const response =
          await api.get<AllocatProfile>(
            "/allocats/profiles/me",
            {
              withCredentials:
                true,
            },
          );

        if (
          cancelled
        ) {
          return;
        }

        setAllocatProfile(
          response.data,
        );
      } catch (
        err: unknown
      ) {
        if (
          cancelled
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err
            : new Error(
                "Could not load Allocat profile.",
              ),
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void fetchAllocatProfile();

    return () => {
      cancelled =
        true;
    };
  }, []);

  /* =======================================================
     DERIVED
  ======================================================= */

  const initials =
    useMemo(
      () =>
        getInitials(
          allocatProfile?.fullName,
        ),
      [
        allocatProfile?.fullName,
      ],
    );

  const rating =
    allocatProfile?.rating ??
    0;

  const ratingCount =
    allocatProfile?.ratingCount ??
    0;

  const completedProjects =
    allocatProfile?.completedProjects ??
    0;

  const yearsExperience =
    allocatProfile?.yearsExperience ??
    0;

  const professionalScore =
    allocatProfile?.professionalScore ??
    0;

  const hourlyRate =
    allocatProfile?.hourlyRate ??
    0;

  const skills =
    allocatProfile?.skills ??
    [];

  const isAvailable =
    Boolean(
      allocatProfile?.availability,
    ) &&
    !allocatProfile?.availability
      ?.toLowerCase()
      .includes(
        "unavailable",
      );

  /* =======================================================
     STATES
  ======================================================= */

  if (
    loading
  ) {
    return (
      <AllocatProfileSkeleton />
    );
  }

  if (
    error ||
    !allocatProfile
  ) {
    return (
      <AllocatProfileError />
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ===================================================
          NAV
      =================================================== */}

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav>
            <div>
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Allocat
              </p>

              <p className="mt-0.5 text-xs font-semibold">
                Profile
              </p>
            </div>
          </DashboardMainNav>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="container mx-auto px-5 py-8 md:px-8 lg:py-12">

        {/* =================================================
            PROFILE HERO
        ================================================= */}

        <section className="pb-8">

          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">

            {/* Identity */}

            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">

              <div className="relative w-fit shrink-0">

                <Avatar
                  className={[
                    "h-24 w-24 sm:h-28 sm:w-28",
                    "border border-border",
                    "bg-muted/30",
                    "shadow-sm",
                  ].join(
                    " ",
                  )}
                >
                  <AvatarImage
                    src={
                      allocatProfile.avatarUrl
                    }
                    alt={
                      allocatProfile.fullName
                        ? `${allocatProfile.fullName}'s profile`
                        : "Allocat profile"
                    }
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-primary/[0.08] text-2xl font-black text-primary">
                    {
                      initials
                    }
                  </AvatarFallback>
                </Avatar>

                {allocatProfile.isVerified && (
                  <span
                    className={[
                      "absolute -bottom-1 -right-1",
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-lg border-[3px] border-background",
                      "bg-primary text-primary-foreground",
                      "shadow-sm",
                    ].join(
                      " ",
                    )}
                    title="Verified Allocat"
                  >
                    <BadgeCheckIcon
                      size={
                        14
                      }
                    />
                  </span>
                )}

              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-primary">
                    Professional profile
                  </p>

                  {allocatProfile.level && (
                    <span className="rounded-md bg-primary/[0.07] px-2 py-1 text-[0.6rem] font-semibold text-primary">
                      {
                        allocatProfile.level
                      }
                    </span>
                  )}

                </div>

                <h1 className="mt-2 break-words text-3xl font-black leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
                  {
                    allocatProfile.fullName ||
                    "Allocat professional"
                  }
                </h1>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-foreground/75 sm:text-base">
                  {
                    allocatProfile.headline ||
                    "Professional service provider"
                  }
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">

                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon
                      size={
                        13
                      }
                    />

                    {
                      allocatProfile.location ||
                      "Location not listed"
                    }
                  </span>

                  <span className="inline-flex items-center gap-1.5">

                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",

                        isAvailable
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/40",
                      ].join(
                        " ",
                      )}
                    />

                    {
                      allocatProfile.availability ||
                      "Availability not set"
                    }

                  </span>

                  {allocatProfile.responseTime && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3Icon
                        size={
                          13
                        }
                      />

                      {
                        allocatProfile.responseTime
                      }
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* Actions */}

            <div className="flex shrink-0 flex-wrap gap-2">

              <Button
                type="button"
                variant="outline"
                className={[
                  "h-10 rounded-lg px-4",
                  "text-xs font-semibold shadow-none",
                  "hover:border-primary/25",
                ].join(
                  " ",
                )}
              >
                <EyeIcon
                  size={
                    14
                  }
                />

                Preview as client
              </Button>

              <Button
                asChild
                className="group h-10 rounded-lg px-4 text-xs font-semibold shadow-none"
              >
                <Link to="/allocats/profile/edit">

                  <EditIcon
                    size={
                      14
                    }
                  />

                  Edit profile

                  <ArrowRightIcon
                    size={
                      12
                    }
                    className="ml-0.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  />

                </Link>
              </Button>

            </div>

          </div>

          {/* =================================================
              SUMMARY BAR
              OPEN LEFT + RIGHT
          ================================================= */}

          <div className="mt-8 border-y border-border">

            <div className="grid sm:grid-cols-2 xl:grid-cols-4">

              <ProfileStat
                label="Hourly rate"
                value={`US$${hourlyRate}`}
                suffix="/hour"
              />

              <ProfileStat
                label="Experience"
                value={
                  yearsExperience
                }
                suffix={
                  yearsExperience ===
                    1
                    ? "year"
                    : "years"
                }
                divided
              />

              <ProfileStat
                label="Rating"
                value={
                  rating >
                  0
                    ? rating.toFixed(
                        1,
                      )
                    : "New"
                }
                suffix={
                  ratingCount >
                  0
                    ? `${ratingCount} ${
                        ratingCount ===
                          1
                          ? "review"
                          : "reviews"
                      }`
                    : undefined
                }
                divided
              />

              <ProfileStat
                label="Completed"
                value={
                  completedProjects
                }
                suffix={
                  completedProjects ===
                    1
                    ? "project"
                    : "projects"
                }
                divided
              />

            </div>

          </div>

        </section>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="grid items-start gap-10 pt-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">

          {/* =================================================
              PROFILE CONTENT
          ================================================= */}

          <div className="min-w-0">

            {/* =============================================
                ABOUT
            ============================================= */}

            <ProfileSection
              eyebrow="Overview"
              title={`About ${getFirstName(
                allocatProfile.fullName,
              )}`}
            >

              <p className="max-w-3xl whitespace-pre-line text-sm leading-8 text-muted-foreground sm:text-[0.95rem]">
                {
                  allocatProfile.bio ||
                  "This Allocat has not added a professional bio yet."
                }
              </p>

            </ProfileSection>

            {/* =============================================
                SKILLS
            ============================================= */}

            <ProfileSection
              eyebrow="Expertise"
              title="Skills"
              divided
            >

              {skills.length >
              0 ? (
                <div className="flex max-w-3xl flex-wrap gap-2">

                  {skills.map(
                    (
                      skill,
                    ) => (
                      <span
                        key={
                          skill
                        }
                        className={[
                          "rounded-lg",
                          "border border-primary/10",
                          "bg-primary/[0.055]",
                          "px-3 py-1.5",
                          "text-xs font-semibold text-primary",
                          "transition-colors",
                          "hover:border-primary/20",
                          "hover:bg-primary/[0.09]",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          skill
                        }
                      </span>
                    ),
                  )}

                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills have been added yet.
                </p>
              )}

            </ProfileSection>

            {/* =============================================
                PROFESSIONAL DETAILS
            ============================================= */}

            <ProfileSection
              eyebrow="Professional"
              title="Working details"
              divided
            >

              <div className="grid max-w-3xl gap-3 sm:grid-cols-2">

                <DetailItem
                  icon={
                    BriefcaseBusinessIcon
                  }
                  label="Experience"
                  value={`${yearsExperience} ${
                    yearsExperience ===
                      1
                      ? "year"
                      : "years"
                  }`}
                />

                <DetailItem
                  icon={
                    MapPinIcon
                  }
                  label="Location"
                  value={
                    allocatProfile.location ||
                    "Not listed"
                  }
                />

                <DetailItem
                  icon={
                    Clock3Icon
                  }
                  label="Availability"
                  value={
                    allocatProfile.availability ||
                    "Not specified"
                  }
                />

                <DetailItem
                  icon={
                    FolderCheckIcon
                  }
                  label="Completed work"
                  value={`${completedProjects} ${
                    completedProjects ===
                      1
                      ? "project"
                      : "projects"
                  }`}
                />

              </div>

            </ProfileSection>

            {/* =============================================
                PROJECT HISTORY
            ============================================= */}

            <ProfileSection
              eyebrow="Work history"
              title="Completed projects"
              divided
              action={
                completedProjects >
                0 ? (
                  <button
                    type="button"
                    className={[
                      "group inline-flex items-center gap-1.5",
                      "text-xs font-semibold text-primary",
                      "transition-colors hover:text-primary/70",
                    ].join(
                      " ",
                    )}
                  >
                    View all

                    <ArrowRightIcon
                      size={
                        13
                      }
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </button>
                ) : undefined
              }
            >

              {completedProjects >
              0 ? (
                <CompletedProjectSummary
                  count={
                    completedProjects
                  }
                />
              ) : (
                <EmptyProjectHistory />
              )}

            </ProfileSection>

            {/* =============================================
                VERIFICATION
            ============================================= */}

            <ProfileSection
              eyebrow="Trust"
              title="Verification"
              divided
              last
            >

              <div className="grid gap-3 md:grid-cols-3">

                <VerificationItem
                  icon={
                    ShieldCheckIcon
                  }
                  title="Identity"
                  description="Identity document"
                  status={
                    allocatProfile.isVerified
                      ? "Verified"
                      : "Pending"
                  }
                  verified={
                    Boolean(
                      allocatProfile.isVerified,
                    )
                  }
                />

                <VerificationItem
                  icon={
                    BadgeCheckIcon
                  }
                  title="Credentials"
                  description="Professional documents"
                  status="Under review"
                />

                <VerificationItem
                  icon={
                    MailCheckIcon
                  }
                  title="Email"
                  description={
                    allocatProfile.email ||
                    "Account email"
                  }
                  status="Verified"
                  verified
                />

              </div>

            </ProfileSection>

          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="min-w-0 xl:sticky xl:top-24">

            {/* =============================================
                PROFESSIONAL SCORE
            ============================================= */}

            <section
              className={[
                "rounded-2xl",
                "border border-border",
                "bg-card",
                "p-5",
              ].join(
                " ",
              )}
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-primary">
                    Professional score
                  </p>

                  <h2 className="mt-2 text-lg font-black tracking-[-0.025em]">
                    {
                      getScoreLabel(
                        professionalScore,
                      )
                    }
                  </h2>

                </div>

                <span className="text-2xl font-black tracking-[-0.04em] text-primary">
                  {
                    professionalScore
                  }
                  %
                </span>

              </div>

              <Progress
                value={
                  professionalScore
                }
                className="mt-5 h-1.5"
              />

              <div className="mt-4 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <p className="text-[0.62rem] font-medium text-muted-foreground">
                  {
                    professionalScore >=
                    75
                      ? "Your profile is performing well"
                      : "There is room to strengthen your profile"
                  }
                </p>

              </div>

              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Build your reputation through completed work, client feedback and verified information.
              </p>

              <button
                type="button"
                className={[
                  "group mt-4 inline-flex items-center gap-1.5",
                  "text-xs font-semibold text-primary",
                  "transition-colors hover:text-primary/70",
                ].join(
                  " ",
                )}
              >
                Improve profile

                <ArrowRightIcon
                  size={
                    12
                  }
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>

            </section>

            {/* =============================================
                WORK PREFERENCES
            ============================================= */}

            <section className="mt-5 rounded-2xl border border-border/80 p-5">

              <div className="flex items-center gap-2">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                  <BriefcaseBusinessIcon
                    size={
                      14
                    }
                  />
                </span>

                <div>
                  <p className="text-xs font-bold">
                    Work preferences
                  </p>

                  <p className="mt-0.5 text-[0.62rem] text-muted-foreground">
                    Current working setup
                  </p>
                </div>

              </div>

              <div className="mt-5 grid gap-4">

                <SidebarDetail
                  label="Availability"
                  value={
                    allocatProfile.availability ||
                    "Not specified"
                  }
                />

                <SidebarDetail
                  label="Response"
                  value={
                    allocatProfile.responseTime ||
                    "Not available"
                  }
                />

                <SidebarDetail
                  label="Rate"
                  value={`US$${hourlyRate}/hr`}
                  strong
                />

              </div>

            </section>

            {/* =============================================
                VERIFIED
            ============================================= */}

            {allocatProfile.isVerified && (

              <section className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-400/[0.05] px-4 py-4">

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.1] text-emerald-700 dark:text-emerald-300">

                  <BadgeCheckIcon
                    size={
                      16
                    }
                  />

                </span>

                <div>

                  <p className="text-xs font-semibold">
                    Verified Allocat
                  </p>

                  <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
                    Identity information has been verified for this professional profile.
                  </p>

                </div>

              </section>

            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   PROFILE STAT
========================================================= */

function ProfileStat({
  label,
  value,
  suffix,
  divided = false,
}: {
  label: string;

  value:
    React.ReactNode;

  suffix?:
    React.ReactNode;

  divided?:
    boolean;
}) {
  return (
    <div
      className={[
        "group relative min-w-0 px-5 py-4",

        "transition-colors",

        "hover:bg-muted/[0.15]",

        divided
          ? "border-t border-border sm:border-l sm:border-t-0"
          : "",
      ].join(
        " ",
      )}
    >

      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {
          label
        }
      </p>

      <div className="mt-1.5 flex min-w-0 items-baseline gap-1.5">

        <p className="truncate text-xl font-black tracking-[-0.04em] sm:text-[1.35rem]">
          {
            value
          }
        </p>

        {suffix && (
          <span className="min-w-0 truncate text-[0.62rem] font-medium text-muted-foreground">
            {
              suffix
            }
          </span>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  eyebrow,
  title,
  action,
  children,
  divided = false,
  last = false,
}: {
  eyebrow: string;

  title: string;

  action?:
    React.ReactNode;

  children:
    React.ReactNode;

  divided?:
    boolean;

  last?:
    boolean;
}) {
  return (
    <section
      className={[
        divided
          ? "border-t border-border/50 pt-9"
          : "",

        !last
          ? "pb-10"
          : "",
      ].join(
        " ",
      )}
    >

      <div className="mb-6 flex items-end justify-between gap-5">

        <div>

          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-primary">
            {
              eyebrow
            }
          </p>

          <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em] sm:text-2xl">
            {
              title
            }
          </h2>

        </div>

        {
          action
        }

      </div>

      {
        children
      }

    </section>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;

  label: string;

  value: string;
}) {
  return (
    <div
      className={[
        "group flex items-center gap-3",
        "rounded-xl",
        "border border-border/75",
        "bg-background",
        "px-4 py-4",
        "transition-colors",
        "hover:bg-muted/[0.16]",
      ].join(
        " ",
      )}
    >

      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-lg",
          "bg-primary/[0.07]",
          "text-primary",
        ].join(
          " ",
        )}
      >
        <Icon
          size={
            14
          }
        />
      </span>

      <div className="min-w-0">

        <p className="text-[0.6rem] font-medium text-muted-foreground">
          {
            label
          }
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {
            value
          }
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   COMPLETED PROJECT SUMMARY
========================================================= */

function CompletedProjectSummary({
  count,
}: {
  count: number;
}) {
  return (
    <button
      type="button"
      className={[
        "group flex w-full items-center gap-4",
        "rounded-xl border border-border/75",
        "bg-background",
        "px-5 py-5 text-left",
        "transition-colors",
        "hover:bg-muted/[0.15]",
      ].join(
        " ",
      )}
    >

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">

        <FolderCheckIcon
          size={
            17
          }
        />

      </span>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-semibold">
          {count} completed{" "}
          {count ===
          1
            ? "project"
            : "projects"}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-6 text-muted-foreground">
          Completed work and client feedback build your professional history.
        </p>

      </div>

      <ArrowRightIcon
        size={
          14
        }
        className={[
          "shrink-0 text-muted-foreground",
          "transition-all",
          "group-hover:translate-x-0.5",
          "group-hover:text-primary",
        ].join(
          " ",
        )}
      />

    </button>
  );
}

/* =========================================================
   VERIFICATION ITEM
========================================================= */

function VerificationItem({
  icon: Icon,
  title,
  description,
  status,
  verified = false,
}: {
  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;

  title: string;

  description: string;

  status: string;

  verified?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/75 bg-background p-4 transition-colors hover:bg-muted/[0.12]">

      <div className="flex items-start justify-between gap-3">

        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-lg",

            verified
              ? "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300"
              : "bg-muted text-muted-foreground",
          ].join(
            " ",
          )}
        >
          <Icon
            size={
              14
            }
          />
        </span>

        <span
          className={[
            "text-[0.58rem] font-semibold",

            verified
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-muted-foreground",
          ].join(
            " ",
          )}
        >
          {
            status
          }
        </span>

      </div>

      <p className="mt-4 text-xs font-semibold">
        {
          title
        }
      </p>

      <p className="mt-1 truncate text-[0.64rem] leading-5 text-muted-foreground">
        {
          description
        }
      </p>

    </div>
  );
}

/* =========================================================
   SIDEBAR DETAIL
========================================================= */

function SidebarDetail({
  label,
  value,
  strong = false,
}: {
  label: string;

  value: string;

  strong?: boolean;
}) {
  return (
    <div className="grid grid-cols-[82px_minmax(0,1fr)] items-start gap-3">

      <p className="text-[0.62rem] text-muted-foreground">
        {
          label
        }
      </p>

      <p
        className={[
          "break-words text-right text-xs",

          strong
            ? "font-black tracking-[-0.01em] text-primary"
            : "font-semibold",
        ].join(
          " ",
        )}
      >
        {
          value
        }
      </p>

    </div>
  );
}

/* =========================================================
   EMPTY HISTORY
========================================================= */

function EmptyProjectHistory() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/[0.08] px-5 py-6">

      <div className="flex items-start gap-3">

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border/70">

          <FolderCheckIcon
            size={
              15
            }
          />

        </span>

        <div>

          <p className="text-sm font-semibold">
            No completed projects yet
          </p>

          <p className="mt-1 max-w-lg text-xs leading-6 text-muted-foreground">
            Completed work and client feedback will appear here as your project history grows.
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function AllocatProfileError() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-5 py-20 md:px-8">

        <div className="mx-auto max-w-md text-center">

          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">

            <UserRoundCheckIcon
              size={
                19
              }
            />

          </span>

          <h1 className="mt-5 text-xl font-black">
            Could not load your profile
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Something interrupted the request for your Allocat profile.
          </p>

          <Button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 h-10 rounded-lg px-5 text-xs shadow-none"
          >
            Try again
          </Button>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function AllocatProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-5 py-10 md:px-8 lg:py-12">

        <div className="flex items-center gap-5">

          <Skeleton className="h-24 w-24 rounded-full" />

          <div className="space-y-3">

            <Skeleton className="h-7 w-56" />

            <Skeleton className="h-4 w-80 max-w-full" />

            <Skeleton className="h-3 w-48" />

          </div>

        </div>

        {/* Open-left/open-right summary */}

        <div className="mt-8 border-y border-border">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4">

            {Array.from({
              length:
                4,
            }).map(
              (
                _,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className={[
                    "px-5 py-4",

                    index >
                    0
                      ? "border-t border-border sm:border-l sm:border-t-0"
                      : "",
                  ].join(
                    " ",
                  )}
                >

                  <Skeleton className="h-3 w-16" />

                  <Skeleton className="mt-3 h-6 w-24" />

                </div>
              ),
            )}

          </div>

        </div>

        <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_300px]">

          <div>

            <div className="pb-10">

              <Skeleton className="h-3 w-20" />

              <Skeleton className="mt-3 h-7 w-48" />

              <Skeleton className="mt-6 h-4 w-full" />

              <Skeleton className="mt-2 h-4 w-5/6" />

              <Skeleton className="mt-2 h-4 w-3/4" />

            </div>

            <div className="border-t border-border/50 py-9">

              <Skeleton className="h-3 w-16" />

              <Skeleton className="mt-3 h-7 w-28" />

              <div className="mt-5 flex gap-2">

                <Skeleton className="h-8 w-24 rounded-lg" />

                <Skeleton className="h-8 w-28 rounded-lg" />

                <Skeleton className="h-8 w-20 rounded-lg" />

              </div>

            </div>

          </div>

          <div className="hidden space-y-5 xl:block">

            <Skeleton className="h-52 rounded-2xl" />

            <Skeleton className="h-40 rounded-2xl" />

          </div>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name?: string) {
  if (!name) {
    return "A";
  }

  return name.trim().split(/\s+/,).slice(0, 2,)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getFirstName(name?: string) {
  return (name?.trim().split(/\s+/,)[0] || "this Allocat");
}

function getScoreLabel(score: number) {
  if (score >= 90) {
    return "Outstanding profile";
  }

  if (score >= 75) {
    return "Strong profile";
  }

  if (score >= 50) {
    return "Good foundation";
  }

  return "Build your profile";
}

export default AllocatProfile;