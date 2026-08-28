import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Badge,
} from "@/components/ui/badge";

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
  AlertCircleIcon,
  BadgeCheckIcon,
  CameraIcon,
  CheckCircle2Icon,
  Clock3Icon,
  ImageIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SaveIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type ProfileUser = {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  emailConfirmed?: boolean;
};

type ProfileForm = {
  fullName: string;
  phoneNumber: string;
  location: string;
};

type MessageState =
  | {
      type:
        | "success"
        | "error";

      text: string;
    }
  | null;

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   HELPERS
========================================================= */

function getInitials(
  name?: string,
) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase(),
    )
    .join("");
}

function formatDate(
  date?: string,
) {
  if (!date) {
    return "Not available";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day:
        "numeric",

      month:
        "long",

      year:
        "numeric",
    },
  ).format(
    parsedDate,
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Profile() {
  const {
    user,
    refreshUser,
  } =
    useAuth();

  const profileUser =
    user as ProfileUser | null;

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    file,
    setFile,
  ] =
    useState<File | null>(
      null,
    );

  const [
    preview,
    setPreview,
  ] =
    useState<string | null>(
      null,
    );

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    uploadProgress,
    setUploadProgress,
  ] =
    useState(0);

  const [
    savingProfile,
    setSavingProfile,
  ] =
    useState(false);

  const [
    pictureMessage,
    setPictureMessage,
  ] =
    useState<MessageState>(
      null,
    );

  const [
    profileMessage,
    setProfileMessage,
  ] =
    useState<MessageState>(
      null,
    );

  const [
    profileForm,
    setProfileForm,
  ] =
    useState<ProfileForm>({
      fullName:
        profileUser?.fullName ??
        "",

      phoneNumber:
        profileUser?.phoneNumber ??
        "",

      location:
        profileUser?.location ??
        "",
    });

  /* =======================================================
     SYNC PROFILE
  ======================================================= */

  useEffect(() => {
    setProfileForm({
      fullName:
        profileUser?.fullName ??
        "",

      phoneNumber:
        profileUser?.phoneNumber ??
        "",

      location:
        profileUser?.location ??
        "",
    });
  }, [
    profileUser?.fullName,
    profileUser?.phoneNumber,
    profileUser?.location,
  ]);

  /* =======================================================
     PREVIEW CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (
        preview
      ) {
        URL.revokeObjectURL(
          preview,
        );
      }
    };
  }, [
    preview,
  ]);

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const displayedImage =
    preview ??
    profileUser?.profilePictureUrl ??
    undefined;

  const fileSize =
    useMemo(() => {
      if (!file) {
        return null;
      }

      return `${(
        file.size /
        (1024 * 1024)
      ).toFixed(
        2,
      )} MB`;
    }, [
      file,
    ]);

  const profileHasChanges =
    profileForm.fullName.trim() !==
      (
        profileUser?.fullName ??
        ""
      ).trim() ||
    profileForm.phoneNumber.trim() !==
      (
        profileUser?.phoneNumber ??
        ""
      ).trim() ||
    profileForm.location.trim() !==
      (
        profileUser?.location ??
        ""
      ).trim();

  const profileCompletion =
    useMemo(() => {
      const fields = [
        Boolean(
          profileUser?.fullName,
        ),

        Boolean(
          profileUser?.email,
        ),

        Boolean(
          profileUser?.phoneNumber,
        ),

        Boolean(
          profileUser?.location,
        ),

        Boolean(
          profileUser?.profilePictureUrl,
        ),
      ];

      const complete =
        fields.filter(
          Boolean,
        ).length;

      return Math.round(
        (
          complete /
          fields.length
        ) *
          100,
      );
    }, [
      profileUser?.fullName,
      profileUser?.email,
      profileUser?.phoneNumber,
      profileUser?.location,
      profileUser?.profilePictureUrl,
    ]);

  /* =======================================================
     PROFILE PICTURE
  ======================================================= */

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0] ??
      null;

    setPictureMessage(
      null,
    );

    if (
      !selectedFile
    ) {
      clearSelectedFile();
      return;
    }

    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        selectedFile.type,
      )
    ) {
      setPictureMessage({
        type:
          "error",

        text:
          "Choose a JPEG, PNG or WebP image.",
      });

      event.target.value =
        "";

      return;
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setPictureMessage({
        type:
          "error",

        text:
          "The image must be smaller than 5 MB.",
      });

      event.target.value =
        "";

      return;
    }

    if (
      preview
    ) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setFile(
      selectedFile,
    );

    setPreview(
      URL.createObjectURL(
        selectedFile,
      ),
    );

    setUploadProgress(
      0,
    );
  }

  function clearSelectedFile() {
    if (
      preview
    ) {
      URL.revokeObjectURL(
        preview,
      );
    }

    setFile(
      null,
    );

    setPreview(
      null,
    );

    setUploadProgress(
      0,
    );

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  }

  async function uploadProfilePicture() {
    if (
      !file ||
      uploading
    ) {
      return;
    }

    setUploading(
      true,
    );

    setUploadProgress(
      0,
    );

    setPictureMessage(
      null,
    );

    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    try {
      await api.post(
        "/profile/profile-picture",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          withCredentials:
            true,

          onUploadProgress:
            (
              event,
            ) => {
              if (
                !event.total
              ) {
                return;
              }

              const percent =
                Math.round(
                  (
                    event.loaded *
                    100
                  ) /
                    event.total,
                );

              setUploadProgress(
                percent,
              );
            },
        },
      );

      await refreshUser();

      clearSelectedFile();

      setPictureMessage({
        type:
          "success",

        text:
          "Your profile picture has been updated.",
      });
    } catch (
      error
    ) {
      console.error(
        error,
      );

      setPictureMessage({
        type:
          "error",

        text:
          "The image could not be uploaded. Please try again.",
      });
    } finally {
      setUploading(
        false,
      );
    }
  }

  /* =======================================================
     PROFILE DETAILS
  ======================================================= */

  function handleProfileFieldChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const {
      name,
      value,
    } =
      event.target;

    setProfileForm(
      (
        current,
      ) => ({
        ...current,

        [name]:
          value,
      }),
    );

    setProfileMessage(
      null,
    );
  }

  async function saveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !profileForm.fullName.trim()
    ) {
      setProfileMessage({
        type:
          "error",

        text:
          "Enter your full name before saving.",
      });

      return;
    }

    setSavingProfile(
      true,
    );

    setProfileMessage(
      null,
    );

    try {
      await api.patch(
        "/profile",
        {
          fullName:
            profileForm.fullName.trim(),

          phoneNumber:
            profileForm.phoneNumber.trim() ||
            null,

          location:
            profileForm.location.trim() ||
            null,
        },
        {
          withCredentials:
            true,
        },
      );

      await refreshUser();

      setProfileMessage({
        type:
          "success",

        text:
          "Your profile details have been saved.",
      });
    } catch (
      error
    ) {
      console.error(
        error,
      );

      setProfileMessage({
        type:
          "error",

        text:
          "Your profile could not be saved. Please try again.",
      });
    } finally {
      setSavingProfile(
        false,
      );
    }
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
                Account
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
            HEADER
        ================================================= */}

        <section className="pb-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div className="min-w-0">

              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-primary">
                Your account
              </p>

              <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
                Profile
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Manage the personal information connected to your Allocatr account.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {profileUser?.emailConfirmed !==
                false && (
                <Badge
                  variant="outline"
                  className={[
                    "h-8 rounded-lg",
                    "border-emerald-500/15",
                    "bg-emerald-400/[0.06]",
                    "px-3",
                    "text-[0.68rem] font-semibold",
                    "text-emerald-700",
                    "shadow-none",
                    "dark:text-emerald-300",
                  ].join(
                    " ",
                  )}
                >
                  <BadgeCheckIcon
                    size={
                      12
                    }
                  />

                  Verified
                </Badge>
              )}

              <Badge
                variant="outline"
                className={[
                  "h-8 rounded-lg",
                  "border-border",
                  "bg-muted/30",
                  "px-3",
                  "text-[0.68rem] font-semibold",
                  "shadow-none",
                ].join(
                  " ",
                )}
              >
                <UserRoundIcon
                  size={
                    12
                  }
                />

                Client account
              </Badge>

            </div>

          </div>

          {/* =================================================
              ACCOUNT SUMMARY
              OPEN LEFT + RIGHT
          ================================================= */}

          <div className="mt-8 border-y border-border">

            <div className="grid sm:grid-cols-2 xl:grid-cols-4">

              <SummaryStat
                label="Profile"
                value={`${profileCompletion}%`}
                suffix="complete"
              />

              <SummaryStat
                label="Email"
                value={
                  profileUser?.emailConfirmed ===
                  false
                    ? "Pending"
                    : "Verified"
                }
                divided
              />

              <SummaryStat
                label="Location"
                value={
                  profileUser?.location ||
                  "Not added"
                }
                divided
              />

              <SummaryStat
                label="Member since"
                value={formatDateShort(
                  profileUser?.createdAt,
                )}
                divided
              />

            </div>

          </div>

        </section>

        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <div className="grid min-w-0 items-start gap-10 pt-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-14">

          {/* =================================================
              LEFT
          ================================================= */}

          <aside className="min-w-0">

            {/* =============================================
                PROFILE PICTURE
            ============================================= */}

            <section className="rounded-2xl border border-border bg-card p-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-primary">
                    Identity
                  </p>

                  <p className="mt-1 text-xs font-semibold">
                    Profile picture
                  </p>
                </div>

                <span className="text-[0.6rem] text-muted-foreground">
                  Max 5 MB
                </span>

              </div>

              <div className="mt-7 flex flex-col items-center text-center">

                <div className="relative">

                  <Avatar className="h-28 w-28 border border-border shadow-sm">

                    <AvatarImage
                      src={
                        displayedImage
                      }
                      alt={
                        profileUser?.fullName
                          ? `${profileUser.fullName}'s profile`
                          : "User profile"
                      }
                      className="object-cover"
                    />

                    <AvatarFallback className="bg-primary/[0.08] text-2xl font-black text-primary">
                      {getInitials(
                        profileUser?.fullName,
                      )}
                    </AvatarFallback>

                  </Avatar>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={
                      uploading
                    }
                    className={[
                      "absolute -bottom-1 -right-1",
                      "flex h-9 w-9 items-center justify-center",
                      "rounded-lg border-4 border-card",
                      "bg-primary text-primary-foreground",
                      "transition-all duration-200",
                      "hover:-translate-y-0.5",
                      "disabled:pointer-events-none",
                      "disabled:opacity-60",
                    ].join(
                      " ",
                    )}
                    aria-label="Choose profile picture"
                  >
                    <CameraIcon
                      size={
                        15
                      }
                    />
                  </button>

                </div>

                <h2 className="mt-5 max-w-full break-words text-lg font-bold tracking-[-0.025em]">
                  {profileUser?.fullName ||
                    "Allocatr user"}
                </h2>

                <p className="mt-1 max-w-full break-all text-xs text-muted-foreground">
                  {profileUser?.email ||
                    "No email available"}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1.5 text-[0.65rem] text-muted-foreground">

                  <MapPinIcon
                    size={
                      11
                    }
                  />

                  {profileUser?.location ||
                    "Location not added"}

                </div>

              </div>

              {/* Completion */}

              <div className="mt-7 border-t border-border/70 pt-5">

                <div className="flex items-end justify-between gap-3">

                  <div>

                    <p className="text-xs font-semibold">
                      Profile completeness
                    </p>

                    <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                      Complete your basic account details.
                    </p>

                  </div>

                  <span className="text-lg font-black tracking-[-0.035em] text-primary">
                    {
                      profileCompletion
                    }
                    %
                  </span>

                </div>

                <Progress
                  value={
                    profileCompletion
                  }
                  className="mt-3 h-1.5"
                />

              </div>

              {/* Input */}

              <input
                ref={
                  fileInputRef
                }
                id="profile-picture"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={
                  handleFileChange
                }
                disabled={
                  uploading
                }
              />

              {/* Selected image */}

              {file && (
                <div className="mt-6 border-t border-border/70 pt-5">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                      <ImageIcon
                        size={
                          16
                        }
                      />
                    </span>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-xs font-semibold">
                        {
                          file.name
                        }
                      </p>

                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
                        {
                          fileSize
                        }
                      </p>

                    </div>

                    {!uploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
                        onClick={
                          clearSelectedFile
                        }
                        aria-label="Remove selected image"
                      >
                        <Trash2Icon
                          size={
                            14
                          }
                        />
                      </Button>
                    )}

                  </div>

                </div>
              )}

              {/* Upload progress */}

              {uploading && (
                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between text-[0.68rem]">

                    <span className="font-medium">
                      Uploading image
                    </span>

                    <span className="tabular-nums text-muted-foreground">
                      {
                        uploadProgress
                      }
                      %
                    </span>

                  </div>

                  <Progress
                    value={
                      uploadProgress
                    }
                    className="h-1.5"
                  />

                </div>
              )}

              {pictureMessage && (
                <InlineMessage
                  message={
                    pictureMessage
                  }
                />
              )}

              {/* Actions */}

              <div className="mt-6 grid gap-2">

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg text-xs font-semibold shadow-none"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploading
                  }
                >
                  <CameraIcon
                    size={
                      14
                    }
                  />

                  {file
                    ? "Choose another"
                    : "Choose image"}
                </Button>

                {file && (
                  <Button
                    type="button"
                    className="h-10 rounded-lg text-xs font-semibold shadow-none"
                    onClick={() =>
                      void uploadProfilePicture()
                    }
                    disabled={
                      uploading
                    }
                  >
                    {uploading ? (
                      <>
                        <LoaderCircleIcon
                          size={
                            14
                          }
                          className="animate-spin"
                        />

                        Uploading
                      </>
                    ) : (
                      <>
                        <SaveIcon
                          size={
                            14
                          }
                        />

                        Save picture
                      </>
                    )}
                  </Button>
                )}

              </div>

              <p className="mt-4 text-center text-[0.63rem] leading-5 text-muted-foreground">
                JPEG, PNG or WebP.
              </p>

            </section>

            {/* =============================================
                TRUST NOTE
            ============================================= */}

            <section className="mt-5 flex items-start gap-3 rounded-xl bg-muted/[0.18] px-4 py-4">

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300">

                <ShieldCheckIcon
                  size={
                    16
                  }
                />

              </span>

              <div>

                <p className="text-xs font-semibold">
                  Keep your details current
                </p>

                <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
                  Accurate contact information helps with project updates and important account notices.
                </p>

              </div>

            </section>

          </aside>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="min-w-0">

            {/* =============================================
                PERSONAL INFO
            ============================================= */}

            <form
              onSubmit={
                saveProfile
              }
            >

              <ProfileSection
                eyebrow="Personal details"
                title="Your information"
                description="The basic information shown throughout your workspace."
              >

                <div className="grid gap-6">

                  <ProfileField
                    label="Full name"
                    description="The name shown to other people on Allocatr."
                  >
                    <div className="relative">

                      <UserRoundIcon
                        size={
                          15
                        }
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        id="fullName"
                        name="fullName"
                        value={
                          profileForm.fullName
                        }
                        onChange={
                          handleProfileFieldChange
                        }
                        placeholder="Enter your full name"
                        className={[
                          "h-11 rounded-lg",
                          "border-border bg-background",
                          "pl-10 shadow-none",
                          "focus-visible:border-primary/40",
                          "focus-visible:ring-1",
                          "focus-visible:ring-primary/30",
                        ].join(
                          " ",
                        )}
                        disabled={
                          savingProfile
                        }
                      />

                    </div>
                  </ProfileField>

                  <ProfileField
                    label="Email address"
                    description="Email changes are managed through account settings."
                  >

                    <div className="relative">

                      <MailIcon
                        size={
                          15
                        }
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        id="email"
                        type="email"
                        value={
                          profileUser?.email ??
                          ""
                        }
                        readOnly
                        className={[
                          "h-11 rounded-lg",
                          "border-border",
                          "bg-muted/20",
                          "pl-10 pr-24",
                          "text-muted-foreground",
                          "shadow-none",
                        ].join(
                          " ",
                        )}
                      />

                      {profileUser?.emailConfirmed !==
                        false && (
                        <span className="pointer-events-none absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[0.62rem] font-semibold text-emerald-600 dark:text-emerald-300">

                          <BadgeCheckIcon
                            size={
                              12
                            }
                          />

                          Verified

                        </span>
                      )}

                    </div>

                  </ProfileField>

                  <div className="grid gap-6 sm:grid-cols-2">

                    <ProfileField
                      label="Phone number"
                    >
                      <div className="relative">

                        <PhoneIcon
                          size={
                            15
                          }
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={
                            profileForm.phoneNumber
                          }
                          onChange={
                            handleProfileFieldChange
                          }
                          placeholder="+263..."
                          className={[
                            "h-11 rounded-lg",
                            "border-border bg-background",
                            "pl-10 shadow-none",
                            "focus-visible:border-primary/40",
                            "focus-visible:ring-1",
                            "focus-visible:ring-primary/30",
                          ].join(
                            " ",
                          )}
                          disabled={
                            savingProfile
                          }
                        />

                      </div>
                    </ProfileField>

                    <ProfileField
                      label="Location"
                    >
                      <div className="relative">

                        <MapPinIcon
                          size={
                            15
                          }
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                          id="location"
                          name="location"
                          value={
                            profileForm.location
                          }
                          onChange={
                            handleProfileFieldChange
                          }
                          placeholder="City, country"
                          className={[
                            "h-11 rounded-lg",
                            "border-border bg-background",
                            "pl-10 shadow-none",
                            "focus-visible:border-primary/40",
                            "focus-visible:ring-1",
                            "focus-visible:ring-primary/30",
                          ].join(
                            " ",
                          )}
                          disabled={
                            savingProfile
                          }
                        />

                      </div>
                    </ProfileField>

                  </div>

                </div>

                {profileMessage && (
                  <InlineMessage
                    message={
                      profileMessage
                    }
                  />
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <p
                    className={[
                      "text-[0.68rem]",

                      profileHasChanges
                        ? "font-medium text-primary"
                        : "text-muted-foreground",
                    ].join(
                      " ",
                    )}
                  >
                    {profileHasChanges
                      ? "You have unsaved changes."
                      : "Your details are up to date."}
                  </p>

                  <Button
                    type="submit"
                    disabled={
                      !profileHasChanges ||
                      savingProfile
                    }
                    className="h-10 rounded-lg px-5 text-xs font-semibold shadow-none"
                  >
                    {savingProfile ? (
                      <>
                        <LoaderCircleIcon
                          size={
                            14
                          }
                          className="animate-spin"
                        />

                        Saving
                      </>
                    ) : (
                      <>
                        <SaveIcon
                          size={
                            14
                          }
                        />

                        Save changes
                      </>
                    )}
                  </Button>

                </div>

              </ProfileSection>

            </form>

            {/* =============================================
                ACCOUNT STATUS
            ============================================= */}

            <ProfileSection
              eyebrow="Account"
              title="Account status"
              description="A quick overview of your current account."
              divided
              last
            >

              <div className="grid gap-3 sm:grid-cols-2">

                <AccountItem
                  icon={
                    MailIcon
                  }
                  label="Email"
                  value={
                    profileUser?.emailConfirmed ===
                    false
                      ? "Not verified"
                      : "Verified"
                  }
                  status={
                    profileUser?.emailConfirmed ===
                    false
                      ? "warning"
                      : "success"
                  }
                />

                <AccountItem
                  icon={
                    Clock3Icon
                  }
                  label="Member since"
                  value={formatDate(
                    profileUser?.createdAt,
                  )}
                />

                <AccountItem
                  icon={
                    UserRoundIcon
                  }
                  label="Account type"
                  value="Client"
                />

                <AccountItem
                  icon={
                    LockKeyholeIcon
                  }
                  label="Profile visibility"
                  value="Private account"
                />

              </div>

            </ProfileSection>

          </div>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   SUMMARY STAT
========================================================= */

function SummaryStat({
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
        "min-w-0 px-5 py-4",
        "transition-colors",
        "hover:bg-muted/[0.14]",

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

        <p className="truncate text-lg font-black tracking-[-0.03em] sm:text-xl">
          {
            value
          }
        </p>

        {suffix && (
          <span className="truncate text-[0.62rem] font-medium text-muted-foreground">
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
  description,
  children,
  divided = false,
  last = false,
}: {
  eyebrow: string;

  title: string;

  description:
    string;

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

      <div className="mb-7 max-w-2xl">

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

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {
            description
          }
        </p>

      </div>

      {
        children
      }

    </section>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  description,
  children,
}: {
  label:
    string;

  description?:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div className="grid gap-2">

      <div>

        <Label className="text-xs font-semibold">
          {
            label
          }
        </Label>

        {description && (
          <p className="mt-1 text-[0.65rem] leading-5 text-muted-foreground">
            {
              description
            }
          </p>
        )}

      </div>

      {
        children
      }

    </div>
  );
}

/* =========================================================
   ACCOUNT ITEM
========================================================= */

function AccountItem({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;

  label:
    string;

  value:
    string;

  status?:
    | "success"
    | "warning";
}) {
  return (
    <div
      className={[
        "group flex items-center gap-3",
        "rounded-xl border border-border/75",
        "bg-background px-4 py-4",
        "transition-colors",
        "hover:bg-muted/[0.14]",
      ].join(
        " ",
      )}
    >

      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center",
          "rounded-lg",
          "bg-muted/60",
          "text-muted-foreground",
          "transition-colors",
          "group-hover:bg-primary/[0.07]",
          "group-hover:text-primary",
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

      <div className="min-w-0 flex-1">

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

      {status && (
        <span
          className={[
            "shrink-0 rounded-md px-2 py-1",
            "text-[0.58rem] font-semibold",

            status ===
            "success"
              ? "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300"
              : "bg-amber-400/[0.08] text-amber-700 dark:text-amber-300",
          ].join(
            " ",
          )}
        >
          {status ===
          "success"
            ? "Verified"
            : "Pending"}
        </span>
      )}

    </div>
  );
}

/* =========================================================
   INLINE MESSAGE
========================================================= */

function InlineMessage({
  message,
}: {
  message:
    Exclude<
      MessageState,
      null
    >;
}) {
  const success =
    message.type ===
    "success";

  return (
    <div
      className={[
        "mt-5 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-xs",

        success
          ? "border-emerald-500/20 bg-emerald-400/[0.06] text-emerald-700 dark:text-emerald-300"
          : "border-destructive/20 bg-destructive/[0.06] text-destructive",
      ].join(
        " ",
      )}
      role={
        success
          ? "status"
          : "alert"
      }
    >

      {success ? (
        <CheckCircle2Icon
          size={
            15
          }
          className="mt-0.5 shrink-0"
        />
      ) : (
        <AlertCircleIcon
          size={
            15
          }
          className="mt-0.5 shrink-0"
        />
      )}

      <p className="leading-5">
        {
          message.text
        }
      </p>

    </div>
  );
}

/* =========================================================
   DATE SUMMARY
========================================================= */

function formatDateShort(
  date?: string,
) {
  if (!date) {
    return "Not available";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month:
        "short",

      year:
        "numeric",
    },
  ).format(
    parsedDate,
  );
}