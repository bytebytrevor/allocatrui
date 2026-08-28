import {
  useState,
  type FormEvent,
} from "react";

import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  FileTextIcon,
  GraduationCapIcon,
  LoaderCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UploadCloudIcon,
  UserRoundCheckIcon,
  WandSparklesIcon,
  XIcon,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import api from "@/api/axios";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Progress,
} from "@/components/ui/progress";

import {
  Textarea,
} from "@/components/ui/textarea";

/* =========================================================
   PAGE
========================================================= */

function CreateAllocatProfile() {
  const navigate =
    useNavigate();

  const [
    skills,
    setSkills,
  ] =
    useState<string[]>([]);

  const [
    skillInput,
    setSkillInput,
  ] =
    useState("");

  const [
    hourlyRate,
    setHourlyRate,
  ] =
    useState(22);

  const [
    yearsExperience,
    setYearsExperience,
  ] =
    useState(3);

  const [
    bio,
    setBio,
  ] =
    useState("");

  const [
    idDocument,
    setIdDocument,
  ] =
    useState<File | null>(
      null,
    );

  const [
    credentialFiles,
    setCredentialFiles,
  ] =
    useState<File[]>([]);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  /* =======================================================
     SKILLS
  ======================================================= */

  function addSkill(
    incoming?: string,
  ) {
    const value =
      (
        incoming ??
        skillInput
      )
        .trim()
        .replace(
          /\s+/g,
          " ",
        );

    if (!value) {
      return;
    }

    const exists =
      skills.some(
        (
          skill,
        ) =>
          skill.toLowerCase() ===
          value.toLowerCase(),
      );

    if (exists) {
      setSkillInput("");
      return;
    }

    setSkills(
      (
        current,
      ) => [
        ...current,
        value,
      ],
    );

    setSkillInput("");
  }

  function removeSkill(
    skill: string,
  ) {
    setSkills(
      (
        current,
      ) =>
        current.filter(
          (
            item,
          ) =>
            item !==
            skill,
        ),
    );
  }

  /* =======================================================
     CREDENTIALS
  ======================================================= */

  function addCredentialFiles(
    files: File[],
  ) {
    setCredentialFiles(
      (
        current,
      ) => {
        const next = [
          ...current,
        ];

        files.forEach(
          (
            incoming,
          ) => {
            const duplicate =
              next.some(
                (
                  existing,
                ) =>
                  existing.name ===
                    incoming.name &&
                  existing.size ===
                    incoming.size,
              );

            if (
              !duplicate
            ) {
              next.push(
                incoming,
              );
            }
          },
        );

        return next;
      },
    );
  }

  function removeCredentialFile(
    index: number,
  ) {
    setCredentialFiles(
      (
        current,
      ) =>
        current.filter(
          (
            _,
            currentIndex,
          ) =>
            currentIndex !==
            index,
        ),
    );
  }

  /* =======================================================
     HELPERS
  ======================================================= */

  function formatFileSize(
    size: number,
  ) {
    if (
      size <
      1024 * 1024
    ) {
      return `${Math.max(
        1,
        Math.round(
          size / 1024,
        ),
      )} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(
      1,
    )} MB`;
  }

  function getExperienceLevel(
    years: number,
  ) {
    if (
      years <= 2
    ) {
      return "Emerging";
    }

    if (
      years <= 5
    ) {
      return "Experienced";
    }

    if (
      years <= 10
    ) {
      return "Senior";
    }

    return "Specialist";
  }

  function getRateLabel(
    rate: number,
  ) {
    if (
      rate < 15
    ) {
      return "Entry";
    }

    if (
      rate < 35
    ) {
      return "Competitive";
    }

    if (
      rate < 75
    ) {
      return "Premium";
    }

    return "Specialist";
  }

  /* =======================================================
     COMPLETION
  ======================================================= */

  const completionItems = [
    {
      label:
        "Identity document",
      done:
        Boolean(
          idDocument,
        ),
    },

    {
      label:
        "Hourly rate",
      done:
        hourlyRate > 0,
    },

    {
      label:
        "Experience",
      done:
        yearsExperience >=
        0,
    },

    {
      label:
        "3+ skills",
      done:
        skills.length >=
        3,
    },

    {
      label:
        "Credentials",
      done:
        credentialFiles.length >
        0,
    },

    {
      label:
        "Bio",
      done:
        bio.trim().length >
        0,
    },
  ];

  const completed =
    completionItems.filter(
      (
        item,
      ) =>
        item.done,
    ).length;

  const completion =
    Math.round(
      (
        completed /
        completionItems.length
      ) *
        100,
    );

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      submitting
    ) {
      return;
    }

    const form =
      new FormData(
        event.currentTarget,
      );

    const data =
      new FormData();

    data.append(
      "idNumber",
      String(
        form.get(
          "idNumber",
        ) ?? "",
      ).trim(),
    );

    data.append(
      "hourlyRate",
      hourlyRate.toString(),
    );

    data.append(
      "yearsExperience",
      yearsExperience.toString(),
    );

    data.append(
      "bio",
      bio.trim(),
    );

    skills.forEach(
      (
        skill,
      ) => {
        data.append(
          "skills",
          skill,
        );
      },
    );

    if (
      idDocument
    ) {
      data.append(
        "idDocument",
        idDocument,
      );
    }

    credentialFiles.forEach(
      (
        file,
      ) => {
        data.append(
          "credentialFiles",
          file,
        );
      },
    );

    try {
      setSubmitting(
        true,
      );

      await api.post(
        "/allocats/profiles/create",
        data,
        {
          withCredentials:
            true,
        },
      );

      navigate(
        "/allocats/profile",
      );
    } catch (
      error
    ) {
      console.error(
        "Could not create Allocat profile:",
        error,
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

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
                Create profile
              </p>
            </div>
          </DashboardMainNav>
        </div>
      </header>

      {/* ===================================================
          PAGE
      =================================================== */}

      <main className="container mx-auto px-5 py-8 md:px-8 lg:py-12">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden border-b border-border pb-10 pt-2">

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.045] px-3 py-1.5 text-primary">
                <SparklesIcon
                  size={
                    12
                  }
                />

                <span className="text-[0.6rem] font-bold uppercase tracking-[0.17em]">
                  Become an Allocat
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.05em] sm:text-5xl lg:text-[3.6rem]">
                Create your{" "}

                <span className="text-primary">
                  allocat profile.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Show the work you do best, what you charge and why
                clients should choose you for their next project.
              </p>
            </div>

            {/* Profile progress */}

            <div className="w-full max-w-[270px]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Profile strength
                  </p>

                  <p className="mt-1 text-[0.68rem] text-muted-foreground">
                    {
                      completed
                    }{" "}
                    of{" "}
                    {
                      completionItems.length
                    }{" "}
                    essentials
                  </p>
                </div>

                <span className="text-3xl font-black tracking-[-0.05em] text-primary">
                  {
                    completion
                  }
                  %
                </span>
              </div>

              <Progress
                value={
                  completion
                }
                className="mt-3 h-1.5"
              />

              <p className="mt-2 text-[0.62rem] leading-5 text-muted-foreground">
                Add useful detail so clients have enough context
                before sending an invitation.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            FORM + PREVIEW
        ================================================= */}

        <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_310px] xl:gap-16">

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="min-w-0"
          >

            {/* =============================================
                ABOUT
            ============================================= */}

            <ProfileSection
              icon={
                UserRoundCheckIcon
              }
              title="About you"
              description="The essentials clients need to understand who you are professionally."
            >

              {/* ===========================================
                  VERIFICATION
              =========================================== */}

              <div className="rounded-2xl border border-border bg-muted/[0.14] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                    <ShieldCheckIcon
                      size={
                        16
                      }
                    />
                  </span>

                  <div>
                    <p className="text-xs font-bold">
                      Identity verification
                    </p>

                    <p className="mt-1 text-[0.68rem] leading-5 text-muted-foreground">
                      These details stay private and help verify your
                      professional account.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">

                  {/* ID number */}

                  <div>
                    <Label
                      htmlFor="idNumber"
                      className="text-xs font-semibold"
                    >
                      ID number
                    </Label>

                    <Input
                      id="idNumber"
                      name="idNumber"
                      required
                      disabled={
                        submitting
                      }
                      placeholder="00000000A00"
                      className={[
                        "mt-2 h-11 rounded-lg",
                        "border-border",
                        "!bg-transparent dark:!bg-transparent",
                        "px-3.5 shadow-none",
                        "focus-visible:border-primary/40",
                        "focus-visible:ring-1",
                        "focus-visible:ring-primary/30",
                      ].join(
                        " ",
                      )}
                    />

                    <p className="mt-2 text-[0.62rem] leading-5 text-muted-foreground">
                      Not visible to clients.
                    </p>
                  </div>

                  {/* ID document */}

                  <div>
                    <Label className="text-xs font-semibold">
                      Identity document
                    </Label>

                    <div
                      className={[
                        "mt-2 flex min-h-11 items-center gap-3",
                        "rounded-lg border border-border px-3",
                        "transition-colors",

                        idDocument
                          ? "bg-primary/[0.035]"
                          : "bg-background",
                      ].join(
                        " ",
                      )}
                    >
                      <span
                        className={[
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",

                          idDocument
                            ? "bg-primary/[0.09] text-primary"
                            : "bg-muted text-muted-foreground",
                        ].join(
                          " ",
                        )}
                      >
                        {idDocument ? (
                          <ShieldCheckIcon
                            size={
                              13
                            }
                          />
                        ) : (
                          <UploadCloudIcon
                            size={
                              13
                            }
                          />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        {idDocument ? (
                          <>
                            <p className="truncate text-xs font-semibold">
                              {
                                idDocument.name
                              }
                            </p>

                            <p className="text-[0.58rem] text-muted-foreground">
                              {formatFileSize(
                                idDocument.size,
                              )}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-medium">
                              Upload a document
                            </p>

                            <p className="mt-0.5 text-[0.58rem] text-muted-foreground">
                              PDF, PNG or JPG
                            </p>
                          </>
                        )}
                      </div>

                      {idDocument ? (
                        <button
                          type="button"
                          onClick={() =>
                            setIdDocument(
                              null,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Remove document"
                        >
                          <XIcon
                            size={
                              12
                            }
                          />
                        </button>
                      ) : (
                        <Label
                          htmlFor="idDocument"
                          className="shrink-0"
                        >
                          <span className="cursor-pointer text-[0.68rem] font-semibold text-primary hover:underline">
                            Choose file
                          </span>
                        </Label>
                      )}

                      <Input
                        id="idDocument"
                        name="idDocument"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        disabled={
                          submitting
                        }
                        className="hidden"
                        onChange={(event) => {
                          const selected =
                            event.target.files?.[0];

                          if (
                            selected
                          ) {
                            setIdDocument(
                              selected,
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===========================================
                  PROFESSIONAL DETAILS
              =========================================== */}

              <div className="mt-9">
                <div className="flex items-center gap-2">
                  <BriefcaseBusinessIcon
                    size={
                      15
                    }
                    className="text-primary"
                  />

                  <p className="text-xs font-bold">
                    Professional details
                  </p>
                </div>

                <p className="mt-1 text-[0.68rem] leading-5 text-muted-foreground">
                  Set your experience and starting rate. You can edit
                  both later.
                </p>

                <div className="mt-6 grid gap-10 md:grid-cols-2">

                  {/* Experience */}

                  <ProfessionalRange
                    label="Experience"
                    display={
                      <>
                        {
                          yearsExperience
                        }

                        <span className="ml-1 text-sm font-medium tracking-normal text-muted-foreground">
                          {yearsExperience ===
                          1
                            ? "year"
                            : "years"}
                        </span>
                      </>
                    }
                    descriptor={getExperienceLevel(
                      yearsExperience,
                    )}
                  >
                    <input
                      id="yearsExperience"
                      name="yearsExperience"
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={
                        yearsExperience
                      }
                      disabled={
                        submitting
                      }
                      onChange={(event) =>
                        setYearsExperience(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                      className="w-full accent-primary"
                    />

                    <div className="mt-2 flex justify-between text-[0.6rem] text-muted-foreground">
                      <span>
                        New
                      </span>

                      <span>
                        10 yrs
                      </span>

                      <span>
                        20+
                      </span>
                    </div>
                  </ProfessionalRange>

                  {/* Rate */}

                  <ProfessionalRange
                    label="Hourly rate"
                    display={
                      <>
                        <span className="mr-1 text-lg font-black text-muted-foreground">
                          $
                        </span>

                        {
                          hourlyRate
                        }

                        <span className="ml-1 text-sm font-medium tracking-normal text-muted-foreground">
                          /hr
                        </span>
                      </>
                    }
                    descriptor={getRateLabel(
                      hourlyRate,
                    )}
                  >
                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="range"
                      min="5"
                      max="150"
                      step="1"
                      value={
                        hourlyRate
                      }
                      disabled={
                        submitting
                      }
                      onChange={(event) =>
                        setHourlyRate(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                      className="w-full accent-primary"
                    />

                    <div className="mt-2 flex justify-between text-[0.6rem] text-muted-foreground">
                      <span>
                        $5
                      </span>

                      <span>
                        $75
                      </span>

                      <span>
                        $150+
                      </span>
                    </div>
                  </ProfessionalRange>
                </div>
              </div>
            </ProfileSection>

            {/* =============================================
                SKILLS
            ============================================= */}

            <ProfileSection
              icon={
                BriefcaseBusinessIcon
              }
              title="Your skills"
              description="Add the capabilities clients should find you for."
            >

              {/* Skill input */}

              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label
                      htmlFor="skill"
                      className="text-xs font-semibold"
                    >
                      Skills
                    </Label>

                    <p className="mt-1 text-[0.65rem] leading-5 text-muted-foreground">
                      Keep them specific and useful for project matching.
                    </p>
                  </div>

                  <span
                    className={[
                      "text-[0.62rem] font-medium",

                      skills.length >=
                      3
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-muted-foreground",
                    ].join(
                      " ",
                    )}
                  >
                    {
                      skills.length
                    }{" "}
                    added
                  </span>
                </div>

                <div
                  className={[
                    "mt-3 flex min-h-12 flex-wrap items-center gap-1.5",
                    "rounded-xl border border-border",
                    "bg-muted/[0.12] px-2.5 py-2",
                    "transition-all",
                    "focus-within:border-primary/35",
                    "focus-within:bg-background",
                    "focus-within:ring-2 focus-within:ring-primary/[0.07]",
                  ].join(
                    " ",
                  )}
                >
                  {skills.map(
                    (
                      skill,
                    ) => (
                      <span
                        key={
                          skill
                        }
                        className={[
                          "inline-flex h-7 items-center gap-1.5",
                          "rounded-full border border-primary/10",
                          "bg-primary/[0.065]",
                          "px-2.5",
                          "text-[0.66rem] font-semibold text-primary",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          skill
                        }

                        <button
                          type="button"
                          disabled={
                            submitting
                          }
                          onClick={() =>
                            removeSkill(
                              skill,
                            )
                          }
                          className="text-primary/55 transition-colors hover:text-primary"
                          aria-label={`Remove ${skill}`}
                        >
                          <XIcon
                            size={
                              10
                            }
                          />
                        </button>
                      </span>
                    ),
                  )}

                  <input
                    id="skill"
                    value={
                      skillInput
                    }
                    disabled={
                      submitting
                    }
                    onChange={(event) =>
                      setSkillInput(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          ","
                      ) {
                        event.preventDefault();

                        addSkill();
                      }

                      if (
                        event.key ===
                          "Backspace" &&
                        !skillInput &&
                        skills.length >
                          0
                      ) {
                        setSkills(
                          (
                            current,
                          ) =>
                            current.slice(
                              0,
                              -1,
                            ),
                        );
                      }
                    }}
                    onBlur={() => {
                      if (
                        skillInput.trim()
                      ) {
                        addSkill();
                      }
                    }}
                    placeholder={
                      skills.length
                        ? "Add another skill"
                        : "e.g. React, Motion Design, Copywriting"
                    }
                    className="h-7 min-w-[190px] flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground/65"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-[0.62rem] text-muted-foreground">
                    Press Enter or comma after each skill.
                  </p>

                  <p className="text-[0.62rem] text-muted-foreground">
                    3 or more recommended
                  </p>
                </div>
              </div>

              {/* Credentials */}

              <div className="mt-8 border-t border-border pt-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                      <GraduationCapIcon
                        size={
                          15
                        }
                      />
                    </span>

                    <div>
                      <p className="text-xs font-bold">
                        Credentials
                      </p>

                      <p className="mt-1 text-[0.65rem] leading-5 text-muted-foreground">
                        Add certificates, degrees or relevant training.
                      </p>
                    </div>
                  </div>

                  <Label
                    htmlFor="credentialFiles"
                  >
                    <span className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-background px-3 text-xs font-semibold transition-colors hover:bg-muted/40">
                      Add files
                    </span>
                  </Label>
                </div>

                <Input
                  id="credentialFiles"
                  name="credentialFiles"
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={
                    submitting
                  }
                  className="hidden"
                  onChange={(event) => {
                    addCredentialFiles(
                      Array.from(
                        event.target.files ??
                          [],
                      ),
                    );

                    event.target.value =
                      "";
                  }}
                />

                {credentialFiles.length >
                0 ? (
                  <div className="mt-4 divide-y divide-border border-y border-border">
                    {credentialFiles.map(
                      (
                        file,
                        index,
                      ) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="group flex items-center gap-3 py-3"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <FileTextIcon
                              size={
                                14
                              }
                            />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold">
                              {
                                file.name
                              }
                            </p>

                            <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
                              {formatFileSize(
                                file.size,
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={
                              submitting
                            }
                            onClick={() =>
                              removeCredentialFile(
                                index,
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`Remove ${file.name}`}
                          >
                            <XIcon
                              size={
                                12
                              }
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <CredentialType
                      icon={
                        FileTextIcon
                      }
                      label="Certificates"
                    />

                    <CredentialType
                      icon={
                        BadgeCheckIcon
                      }
                      label="Qualifications"
                    />

                    <CredentialType
                      icon={
                        BriefcaseBusinessIcon
                      }
                      label="Training"
                    />
                  </div>
                )}
              </div>
            </ProfileSection>

            {/* =============================================
                BIO
            ============================================= */}

            <ProfileSection
              icon={
                WandSparklesIcon
              }
              title="Tell clients about your work"
              description="A short introduction can say more than another list of qualifications."
              last
            >
              <div className="flex items-center justify-between gap-4">
                <Label
                  htmlFor="bio"
                  className="text-xs font-semibold"
                >
                  Professional bio
                </Label>

                <span className="text-[0.62rem] tabular-nums text-muted-foreground">
                  {
                    bio.length
                  }
                  /500
                </span>
              </div>

              <div
                className={[
                  "mt-3 overflow-hidden rounded-xl border border-border",
                  "bg-muted/[0.08]",
                  "transition-all",
                  "focus-within:border-primary/35",
                  "focus-within:bg-background",
                  "focus-within:ring-2",
                  "focus-within:ring-primary/[0.07]",
                ].join(
                  " ",
                )}
              >
                <Textarea
                  id="bio"
                  name="bio"
                  maxLength={
                    500
                  }
                  required
                  disabled={
                    submitting
                  }
                  value={
                    bio
                  }
                  onChange={(event) =>
                    setBio(
                      event.target.value,
                    )
                  }
                  placeholder="What do you do especially well? What kind of projects do you enjoy? What can clients expect when working with you?"
                  className={[
                    "min-h-[180px] resize-none",
                    "rounded-none border-0",
                    "!bg-transparent dark:!bg-transparent",
                    "px-4 py-4",
                    "text-sm leading-7",
                    "shadow-none",
                    "focus-visible:ring-0",
                  ].join(
                    " ",
                  )}
                />

                <div className="flex items-center gap-2 border-t border-border bg-background/50 px-4 py-3">
                  <SparklesIcon
                    size={
                      12
                    }
                    className="shrink-0 text-primary"
                  />

                  <p className="text-[0.62rem] leading-5 text-muted-foreground">
                    Clear and specific usually works better than long.
                  </p>
                </div>
              </div>
            </ProfileSection>

            {/* =============================================
                ACTION
            ============================================= */}

            <div className="mt-4 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold">
                  Ready when you are.
                </p>

                <p className="mt-1 max-w-md text-[0.65rem] leading-5 text-muted-foreground">
                  You can update your profile whenever your experience,
                  rate or skills change.
                </p>
              </div>

              <Button
                type="submit"
                disabled={
                  submitting
                }
                className="h-11 rounded-lg px-6 text-xs shadow-none"
              >
                {submitting ? (
                  <>
                    <LoaderCircleIcon
                      size={
                        14
                      }
                      className="animate-spin"
                    />

                    Creating profile
                  </>
                ) : (
                  <>
                    Create profile

                    <SparklesIcon
                      size={
                        14
                      }
                    />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* =================================================
              SIDEBAR / LIVE PREVIEW
          ================================================= */}

          <aside className="hidden xl:block">
            <div className="sticky top-24 pt-6">

              {/* Live preview label */}

              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary">
                    Live preview
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Updates as you build your profile
                  </p>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/[0.08] px-2.5 py-1 text-[0.58rem] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />

                  Live
                </span>
              </div>

              {/* Preview */}

              <div
                className={[
                  "relative overflow-hidden rounded-[1.4rem]",
                  "border border-border",
                  "bg-card p-5",
                  "shadow-lg shadow-black/[0.035]",
                  "dark:shadow-black/15",
                ].join(
                  " ",
                )}
              >
                <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-primary/[0.09] blur-3xl" />

                <div className="relative">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.09] text-primary">
                      <UserRoundCheckIcon
                        size={
                          17
                        }
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">
                        New Allocat
                      </p>

                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
                        {getExperienceLevel(
                          yearsExperience,
                        )}{" "}
                        professional
                      </p>
                    </div>

                    <BadgeCheckIcon
                      size={
                        16
                      }
                      className={
                        idDocument
                          ? "shrink-0 text-emerald-600 dark:text-emerald-300"
                          : "shrink-0 text-muted-foreground/35"
                      }
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 divide-x divide-border border-y border-border">
                    <div className="py-4 pr-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
                        Rate
                      </p>

                      <p className="mt-1 text-xl font-black tracking-[-0.03em]">
                        $
                        {
                          hourlyRate
                        }

                        <span className="ml-1 text-[0.6rem] font-normal text-muted-foreground">
                          /hr
                        </span>
                      </p>
                    </div>

                    <div className="py-4 pl-4">
                      <p className="text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
                        Experience
                      </p>

                      <p className="mt-1 text-xl font-black tracking-[-0.03em]">
                        {
                          yearsExperience
                        }

                        <span className="ml-1 text-[0.6rem] font-normal text-muted-foreground">
                          yrs
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {skills.length ? (
                      <>
                        {skills
                          .slice(
                            0,
                            5,
                          )
                          .map(
                            (
                              skill,
                            ) => (
                              <span
                                key={
                                  skill
                                }
                                className="rounded-full bg-primary/[0.07] px-2.5 py-1 text-[0.6rem] font-semibold text-primary"
                              >
                                {
                                  skill
                                }
                              </span>
                            ),
                          )}

                        {skills.length >
                          5 && (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[0.6rem] font-semibold text-muted-foreground">
                            +
                            {skills.length -
                              5}
                          </span>
                        )}
                      </>
                    ) : (
                      <p className="text-[0.68rem] text-muted-foreground">
                        Your skills will appear here.
                      </p>
                    )}
                  </div>

                  <p className="mt-5 line-clamp-5 text-xs leading-6 text-muted-foreground">
                    {bio ||
                      "Your bio will begin shaping this preview as you write."}
                  </p>
                </div>
              </div>

              {/* Verification */}

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-muted/[0.22] p-4">
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

                    idDocument
                      ? "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300"
                      : "bg-background text-muted-foreground",
                  ].join(
                    " ",
                  )}
                >
                  {idDocument ? (
                    <BadgeCheckIcon
                      size={
                        15
                      }
                    />
                  ) : (
                    <ShieldCheckIcon
                      size={
                        15
                      }
                    />
                  )}
                </span>

                <div>
                  <p className="text-xs font-semibold">
                    {idDocument
                      ? "Identity document added"
                      : "Build client trust"}
                  </p>

                  <p className="mt-1 text-[0.65rem] leading-5 text-muted-foreground">
                    {idDocument
                      ? "Your verification document is ready for submission."
                      : "Verification and credentials give clients more confidence in your profile."}
                  </p>
                </div>
              </div>

              {/* Completion checklist */}

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Profile essentials
                </p>

                <div className="mt-4 space-y-3">
                  {completionItems.map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item.label
                        }
                        className="flex items-center gap-2.5"
                      >
                        <span
                          className={[
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",

                            item.done
                              ? "bg-emerald-400/[0.08] text-emerald-600 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground",
                          ].join(
                            " ",
                          )}
                        >
                          <CheckCircle2Icon
                            size={
                              11
                            }
                          />
                        </span>

                        <p
                          className={[
                            "text-[0.68rem]",

                            item.done
                              ? "font-medium text-foreground"
                              : "text-muted-foreground",
                          ].join(
                            " ",
                          )}
                        >
                          {
                            item.label
                          }
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  icon: Icon,
  title,
  description,
  children,
  last = false,
}: {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  title: string;

  description: string;

  children:
    React.ReactNode;

  last?: boolean;
}) {
  return (
    <section
      className={[
        "relative grid gap-6 py-10",
        "md:grid-cols-[52px_minmax(0,1fr)]",

        !last
          ? "border-b border-border"
          : "",
      ].join(
        " ",
      )}
    >
      <div>
        <span
          className={[
            "flex h-10 w-10 items-center justify-center",
            "rounded-xl border border-primary/10",
            "bg-primary/[0.065] text-primary",
            "shadow-sm shadow-primary/[0.03]",
          ].join(
            " ",
          )}
        >
          <Icon
            size={
              17
            }
          />
        </span>
      </div>

      <div className="min-w-0">
        <div className="mb-7 max-w-2xl">
          <h2 className="text-xl font-black tracking-[-0.025em] sm:text-2xl">
            {
              title
            }
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            {
              description
            }
          </p>
        </div>

        {
          children
        }
      </div>
    </section>
  );
}

/* =========================================================
   PROFESSIONAL RANGE
========================================================= */

function ProfessionalRange({
  label,
  display,
  descriptor,
  children,
}: {
  label: string;

  display:
    React.ReactNode;

  descriptor:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold">
          {
            label
          }
        </p>

        <span className="rounded-full bg-primary/[0.065] px-2.5 py-1 text-[0.6rem] font-semibold text-primary">
          {
            descriptor
          }
        </span>
      </div>

      <div className="my-5">
        <p className="flex items-baseline text-4xl font-black tracking-[-0.055em] sm:text-[2.65rem]">
          {
            display
          }
        </p>
      </div>

      <div className="rounded-xl bg-muted/[0.2] px-3 py-4">
        {
          children
        }
      </div>
    </div>
  );
}

/* =========================================================
   CREDENTIAL TYPE
========================================================= */

function CredentialType({
  icon: Icon,
  label,
}: {
  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;

  label:
    string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/[0.1] px-2 py-3 text-center">
      <Icon
        size={
          14
        }
        className="mx-auto text-muted-foreground"
      />

      <p className="mt-1.5 text-[0.6rem] font-medium text-muted-foreground">
        {
          label
        }
      </p>
    </div>
  );
}

export default CreateAllocatProfile;