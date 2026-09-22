import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CameraIcon,
  Clock3Icon,
  ImageIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailCheckIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshCwIcon,
  SaveIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";

import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ProfileUser } from "@/Types/profileUser";

/* =========================================================
   TYPES
========================================================= */

type ProfileForm = {
  fullName: string;
  phoneNumber: string;
  location: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const EMAIL_VERIFICATION_ENDPOINT =
  "/profiles/me/email-verification";

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateShort(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    isAxiosError(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

/* =========================================================
   PAGE
========================================================= */

export default function Profile() {
  const { refreshUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileUser, setProfileUser] =
    useState<ProfileUser | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileLoadError, setProfileLoadError] =
    useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [savingProfile, setSavingProfile] = useState(false);

  const [sendingVerification, setSendingVerification] =
    useState(false);

  const [pictureError, setPictureError] =
    useState<string | null>(null);

  const [profileError, setProfileError] =
    useState<string | null>(null);

  const [verificationError, setVerificationError] =
    useState<string | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    phoneNumber: "",
    location: "",
  });

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  const fetchProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      setProfileLoadError(null);

      const response = await api.get<ProfileUser>(
        "/profiles/me",
        {
          withCredentials: true,
        },
      );

      setProfileUser(response.data);
    } catch (error) {
      console.error("Could not load profile:", error);

      setProfileLoadError(
        getApiErrorMessage(
          error,
          "Your profile could not be loaded. Please try again.",
        ),
      );
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  /* =======================================================
     SYNC FORM
  ======================================================= */

  useEffect(() => {
    if (!profileUser) {
      return;
    }

    setProfileForm({
      fullName: profileUser.fullName ?? "",
      phoneNumber: profileUser.phoneNumber ?? "",
      location: profileUser.location ?? "",
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
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const displayedImage =
    preview ??
    profileUser?.avatarUrl ??
    undefined;

  const fileSize = useMemo(() => {
    if (!file) {
      return null;
    }

    return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  }, [file]);

  const profileHasChanges =
    profileForm.fullName.trim() !==
      (profileUser?.fullName ?? "").trim() ||
    profileForm.phoneNumber.trim() !==
      (profileUser?.phoneNumber ?? "").trim() ||
    profileForm.location.trim() !==
      (profileUser?.location ?? "").trim();

  const profileCompletion = useMemo(() => {
    if (!profileUser) {
      return 0;
    }

    const requirements = [
      Boolean(profileUser.fullName?.trim()),
      Boolean(profileUser.email?.trim()),
      profileUser.emailConfirmed,
      Boolean(profileUser.phoneNumber?.trim()),
      Boolean(profileUser.location?.trim()),
      Boolean(profileUser.avatarUrl),
    ];

    const completed =
      requirements.filter(Boolean).length;

    return Math.round(
      (completed / requirements.length) * 100,
    );
  }, [profileUser]);

  /* =======================================================
     PROFILE PICTURE
  ======================================================= */

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setPictureError(null);

    if (!selectedFile) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setPictureError(
        "Choose a JPEG, PNG or WebP image.",
      );

      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setPictureError(
        "The image must be smaller than 5 MB.",
      );

      event.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadProgress(0);
  }

  function clearSelectedFile() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setPictureError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadProfilePicture() {
    if (!file || uploading) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setPictureError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post<{
        avatarUrl: string;
      }>(
        "/profiles/profile-picture",
        formData,
        {
          withCredentials: true,

          onUploadProgress: event => {
            if (!event.total) {
              return;
            }

            const percent = Math.round(
              (event.loaded * 100) / event.total,
            );

            setUploadProgress(percent);
          },
        },
      );

      setProfileUser(current => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          avatarUrl: response.data.avatarUrl,
        };
      });

      await refreshUser();

      clearSelectedFile();

      toast.success("Profile picture updated", {
        description:
          "Your new picture is now visible across Allocatr.",
      });
    } catch (error) {
      console.error(
        "Could not upload profile picture:",
        error,
      );

      setPictureError(
        getApiErrorMessage(
          error,
          "The image could not be uploaded. Please try again.",
        ),
      );
    } finally {
      setUploading(false);
    }
  }

  /* =======================================================
     PROFILE DETAILS
  ======================================================= */

  function handleProfileFieldChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setProfileForm(current => ({
      ...current,
      [name]: value,
    }));

    setProfileError(null);
  }

  async function saveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setProfileError(null);

    if (!profileForm.fullName.trim()) {
      setProfileError(
        "Enter your full name before saving.",
      );

      return;
    }

    setSavingProfile(true);

    try {
      const response = await api.patch<ProfileUser>(
        "/profiles/me",
        {
          fullName: profileForm.fullName.trim(),
          phoneNumber:
            profileForm.phoneNumber.trim() || null,
          location:
            profileForm.location.trim() || null,
        },
        {
          withCredentials: true,
        },
      );

      setProfileUser(response.data);

      await refreshUser();

      toast.success("Profile updated", {
        description:
          "Your personal information has been saved.",
      });
    } catch (error) {
      console.error(
        "Could not update profile:",
        error,
      );

      setProfileError(
        getApiErrorMessage(
          error,
          "Your profile could not be saved. Please try again.",
        ),
      );
    } finally {
      setSavingProfile(false);
    }
  }

  /* =======================================================
     EMAIL VERIFICATION
  ======================================================= */

  async function sendVerificationEmail() {
    if (
      !profileUser?.email ||
      profileUser.emailConfirmed ||
      sendingVerification
    ) {
      return;
    }

    setSendingVerification(true);
    setVerificationError(null);

    try {
      await api.post(
        EMAIL_VERIFICATION_ENDPOINT,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Verification email sent", {
        description:
          `Check ${profileUser.email} for your verification link.`,
      });
    } catch (error) {
      console.error(
        "Could not send verification email:",
        error,
      );

      setVerificationError(
        getApiErrorMessage(
          error,
          "We could not send the verification email. Please try again.",
        ),
      );
    } finally {
      setSendingVerification(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingProfile) {
    return <ProfileLoading />;
  }

  /* =======================================================
     LOAD ERROR
  ======================================================= */

  if (profileLoadError || !profileUser) {
    return (
      <ProfileErrorPage
        message={
          profileLoadError ??
          "Your profile could not be loaded."
        }
        onRetry={fetchProfile}
      />
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
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-secondary shadow-sm shadow-primary/10">
                  <UserRoundIcon size={15} />
                </span>

                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
                  Your account
                </p>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
                Profile
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Manage the personal information connected to your
                Allocatr account.
              </p>
            </div>

            <Badge
              variant="outline"
              className={[
                "h-8 w-fit rounded-lg px-3",
                "border-border bg-muted/25",
                "text-[0.68rem] font-semibold",
                "text-foreground shadow-none",
              ].join(" ")}
            >
              <UserRoundIcon size={12} />

              {profileUser.isAllocat
                ? "Allocat account"
                : "Client account"}
            </Badge>
          </div>

          {/* =================================================
              VERIFICATION NOTICE
          ================================================= */}

          {!profileUser.emailConfirmed && (
            <EmailVerificationWarning
              email={profileUser.email}
              sending={sendingVerification}
              error={verificationError}
              onVerify={sendVerificationEmail}
            />
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mt-8 border-y border-border">
            <div className="grid sm:grid-cols-3">
              <SummaryStat
                label="Profile"
                value={`${profileCompletion}%`}
                suffix="complete"
              />

              <SummaryStat
                label="Location"
                value={
                  profileUser.location ||
                  "Not added"
                }
                divided
              />

              <SummaryStat
                label="Member since"
                value={formatDateShort(
                  profileUser.createdAt,
                )}
                divided
              />
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid min-w-0 items-start gap-10 pt-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-14">

          {/* =================================================
              LEFT
          ================================================= */}

          <aside className="min-w-0">

            {/* =============================================
                PROFILE PICTURE
            ============================================= */}

            <section className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
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
                  <Avatar className="h-28 w-28 border border-border bg-transparent shadow-sm">
                    <AvatarImage
                      src={displayedImage}
                      alt={`${profileUser.fullName}'s profile`}
                      className="object-cover"
                    />

                    <AvatarFallback className="bg-primary/[0.08] text-2xl font-black text-primary">
                      {getInitials(profileUser.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className={[
                      "absolute -bottom-1 -right-1",
                      "flex h-9 w-9 items-center justify-center",
                      "rounded-lg border-4 border-background",
                      "bg-primary text-secondary",
                      "shadow-sm shadow-primary/10",
                      "transition-all duration-200",
                      "hover:-translate-y-0.5 hover:scale-[1.03]",
                      "hover:bg-primary/90",
                      "disabled:pointer-events-none",
                      "disabled:opacity-60",
                    ].join(" ")}
                    aria-label="Choose profile picture"
                  >
                    <CameraIcon size={15} />
                  </button>
                </div>

                <h2 className="mt-5 max-w-full break-words text-lg font-bold tracking-[-0.025em]">
                  {profileUser.fullName}
                </h2>

                <div className="mt-1 flex max-w-full items-center justify-center gap-1.5">
                  <p className="min-w-0 truncate text-xs text-muted-foreground">
                    {profileUser.email ||
                      "No email available"}
                  </p>

                  {profileUser.emailConfirmed && (
                    <BadgeCheckIcon
                      size={12}
                      className="shrink-0 text-emerald-600 dark:text-emerald-300"
                    />
                  )}
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1.5 text-[0.65rem] text-muted-foreground">
                  <MapPinIcon size={11} />

                  {profileUser.location ||
                    "Location not added"}
                </div>
              </div>

              {/* FILE INPUT */}

              <input
                ref={fileInputRef}
                id="profile-picture"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />

              {/* SELECTED IMAGE */}

              {file && (
                <div className="mt-6 border-t border-border/70 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                      <ImageIcon size={16} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {file.name}
                      </p>

                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
                        {fileSize}
                      </p>
                    </div>

                    {!uploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground shadow-none hover:bg-muted/40 hover:text-foreground"
                        onClick={clearSelectedFile}
                        aria-label="Remove selected image"
                      >
                        <Trash2Icon size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* UPLOAD PROGRESS */}

              {uploading && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[0.68rem]">
                    <span className="font-medium">
                      Uploading image
                    </span>

                    <span className="tabular-nums text-muted-foreground">
                      {uploadProgress}%
                    </span>
                  </div>

                  <Progress
                    value={uploadProgress}
                    className="h-1.5"
                  />
                </div>
              )}

              {pictureError && (
                <InlineError message={pictureError} />
              )}

              {/* PICTURE ACTIONS */}

              <div className="mt-6 grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg bg-transparent text-xs font-semibold shadow-none"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading}
                >
                  <CameraIcon size={14} />

                  {file
                    ? "Choose another"
                    : profileUser.avatarUrl
                      ? "Change picture"
                      : "Choose image"}
                </Button>

                {file && (
                  <Button
                    type="button"
                    className="h-10 rounded-lg text-xs font-semibold shadow-none"
                    onClick={() =>
                      void uploadProfilePicture()
                    }
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <LoaderCircleIcon
                          size={14}
                          className="animate-spin"
                        />
                        Uploading
                      </>
                    ) : (
                      <>
                        <SaveIcon size={14} />
                        Save picture
                      </>
                    )}
                  </Button>
                )}
              </div>

              <p className="mt-4 text-center text-[0.63rem] leading-5 text-muted-foreground">
                JPEG, PNG or WebP.
              </p>

              {/* COMPLETION */}

              <div className="mt-7 border-t border-border/70 pt-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold">
                      Profile completeness
                    </p>

                    <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                      Complete and verify your account details.
                    </p>
                  </div>

                  <span className="text-lg font-black tracking-[-0.035em]">
                    {profileCompletion}%
                  </span>
                </div>

                <Progress
                  value={profileCompletion}
                  className="mt-3 h-1.5"
                />
              </div>
            </section>

            {/* =============================================
                TRUST
            ============================================= */}

            <section className="mt-5 flex items-start gap-3 rounded-xl bg-muted/[0.15] px-4 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300">
                <ShieldCheckIcon size={16} />
              </span>

              <div>
                <p className="text-xs font-semibold">
                  Keep your details current
                </p>

                <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
                  Accurate and verified information improves account
                  security and keeps project communication reliable.
                </p>
              </div>
            </section>
          </aside>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="min-w-0">
            <form onSubmit={saveProfile}>
              <ProfileSection
                eyebrow="Personal details"
                title="Your information"
                description="The basic information shown throughout your workspace."
              >
                <div className="grid gap-6">

                  {/* =========================================
                      FULL NAME
                  ========================================= */}

                  <ProfileField
                    label="Full name"
                    description="The name shown to other people on Allocatr."
                  >
                    <div className="relative">
                      <UserRoundIcon
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        id="fullName"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileFieldChange}
                        placeholder="Enter your full name"
                        className={[
                          "h-11 rounded-lg",
                          "!bg-transparent",
                          "border-border",
                          "pl-10 shadow-none",
                          "focus-visible:border-primary/40",
                          "focus-visible:ring-1",
                          "focus-visible:ring-primary/30",
                        ].join(" ")}
                        disabled={savingProfile}
                      />
                    </div>
                  </ProfileField>

                  {/* =========================================
                      EMAIL
                  ========================================= */}

                  <ProfileField
                    label="Email address"
                    description="Your sign-in email is tied to your account and cannot be changed from this page."
                  >
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <div className="relative min-w-0 flex-1">
                        <MailIcon
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80"
                        />

                        <Input
                          id="email"
                          type="email"
                          value={profileUser.email ?? ""}
                          disabled
                          className={[
                            "h-11 rounded-lg",
                            "!bg-muted/[0.2]",
                            "border-border/70",
                            "pl-10 pr-10",
                            "font-medium",
                            "text-muted-foreground",
                            "shadow-none",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-100",
                            "disabled:text-muted-foreground",
                          ].join(" ")}
                        />

                        <LockKeyholeIcon
                          size={13}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/55"
                        />
                      </div>

                      {profileUser.emailConfirmed ? (
                        <div
                          className={[
                            "flex h-11 shrink-0 items-center gap-1.5",
                            "rounded-lg border border-border/70",
                            "bg-transparent px-3.5",
                            "text-xs font-semibold",
                            "text-emerald-700",
                            "dark:text-emerald-300",
                          ].join(" ")}
                        >
                          <BadgeCheckIcon size={13} />
                          Verified
                        </div>
                      ) : (
                        <VerificationButton
                          sending={sendingVerification}
                          disabled={!profileUser.email}
                          onVerify={sendVerificationEmail}
                          size="field"
                        />
                      )}
                    </div>
                  </ProfileField>

                  {/* =========================================
                      PHONE + LOCATION
                  ========================================= */}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <ProfileField label="Phone number">
                      <div className="relative">
                        <PhoneIcon
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={profileForm.phoneNumber}
                          onChange={handleProfileFieldChange}
                          placeholder="+263..."
                          className={[
                            "h-11 rounded-lg",
                            "!bg-transparent",
                            "border-border",
                            "pl-10 shadow-none",
                            "focus-visible:border-primary/40",
                            "focus-visible:ring-1",
                            "focus-visible:ring-primary/30",
                          ].join(" ")}
                          disabled={savingProfile}
                        />
                      </div>
                    </ProfileField>

                    <ProfileField label="Location">
                      <div className="relative">
                        <MapPinIcon
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                          id="location"
                          name="location"
                          value={profileForm.location}
                          onChange={handleProfileFieldChange}
                          placeholder="City, country"
                          className={[
                            "h-11 rounded-lg",
                            "!bg-transparent",
                            "border-border",
                            "pl-10 shadow-none",
                            "focus-visible:border-primary/40",
                            "focus-visible:ring-1",
                            "focus-visible:ring-primary/30",
                          ].join(" ")}
                          disabled={savingProfile}
                        />
                      </div>
                    </ProfileField>
                  </div>
                </div>

                {profileError && (
                  <InlineError message={profileError} />
                )}

                {/* =========================================
                    SAVE
                ========================================= */}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={[
                      "text-[0.68rem]",
                      profileHasChanges
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    ].join(" ")}
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
                          size={14}
                          className="animate-spin"
                        />
                        Saving
                      </>
                    ) : (
                      <>
                        <SaveIcon size={14} />
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
                  icon={MailIcon}
                  label="Email"
                  value={
                    profileUser.emailConfirmed
                      ? "Verified"
                      : "Verification required"
                  }
                  status={
                    profileUser.emailConfirmed
                      ? "success"
                      : "pending"
                  }
                />

                <AccountItem
                  icon={Clock3Icon}
                  label="Member since"
                  value={formatDate(
                    profileUser.createdAt,
                  )}
                />

                <AccountItem
                  icon={UserRoundIcon}
                  label="Account type"
                  value={
                    profileUser.isAllocat
                      ? "Allocat"
                      : "Client"
                  }
                />

                <AccountItem
                  icon={LockKeyholeIcon}
                  label="Profile visibility"
                  value={
                    profileUser.isAllocat
                      ? "Professional account"
                      : "Private account"
                  }
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
   EMAIL VERIFICATION WARNING
========================================================= */

function EmailVerificationWarning({
  email,
  sending,
  error,
  onVerify,
}: {
  email: string | null;
  sending: boolean;
  error: string | null;
  onVerify: () => Promise<void>;
}) {
  return (
    <section
      className={[
        "mt-7 rounded-xl border",
        "border-border/70",
        "bg-muted/[0.12]",
        "px-4 py-4 sm:px-5",
      ].join(" ")}
      aria-label="Email verification required"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <span
            className={[
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-lg",
              "bg-primary text-secondary",
              "shadow-sm shadow-primary/10",
            ].join(" ")}
          >
            <MailCheckIcon size={15} />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[-0.01em]">
              Email verification required
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Confirm{" "}
              {email ? (
                <span className="font-medium text-foreground">
                  {email}
                </span>
              ) : (
                "your email address"
              )}{" "}
              to complete your profile and keep your account
              information verified.
            </p>

            {error && (
              <div
                className="mt-3 flex items-start gap-2 text-xs text-destructive"
                role="alert"
              >
                <AlertCircleIcon
                  size={13}
                  className="mt-0.5 shrink-0"
                />

                <p className="leading-5">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        <VerificationButton
          sending={sending}
          disabled={!email}
          onVerify={onVerify}
        />
      </div>
    </section>
  );
}

/* =========================================================
   VERIFICATION BUTTON
========================================================= */

function VerificationButton({
  sending,
  disabled,
  onVerify,
  size = "default",
}: {
  sending: boolean;
  disabled: boolean;
  onVerify: () => Promise<void>;
  size?: "default" | "field";
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void onVerify()}
      disabled={
        sending ||
        disabled
      }
      className={[
        "shrink-0 rounded-lg",
        "border-border",
        "bg-transparent",
        "text-xs font-semibold text-foreground",
        "shadow-none",
        "transition-colors",
        "hover:border-foreground/15",
        "hover:bg-muted/40",
        "hover:text-foreground",
        "disabled:border-border",
        "disabled:bg-transparent",
        "disabled:text-muted-foreground",
        "disabled:opacity-60",
        size === "field"
          ? "h-11 px-4"
          : "h-9 px-3.5",
      ].join(" ")}
    >
      {sending ? (
        <>
          <LoaderCircleIcon
            size={13}
            className="animate-spin"
          />
          Sending
        </>
      ) : (
        <>
          <MailCheckIcon size={13} />
          Verify email
        </>
      )}
    </Button>
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
  value: ReactNode;
  suffix?: ReactNode;
  divided?: boolean;
}) {
  return (
    <div
      className={[
        "min-w-0 px-5 py-4",
        "transition-colors hover:bg-muted/[0.08]",
        divided
          ? "border-t border-border sm:border-l sm:border-t-0"
          : "",
      ].join(" ")}
    >
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-baseline gap-1.5">
        <p className="truncate text-lg font-black tracking-[-0.03em] sm:text-xl">
          {value}
        </p>

        {suffix && (
          <span className="truncate text-[0.62rem] font-medium text-muted-foreground">
            {suffix}
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
  description: string;
  children: ReactNode;
  divided?: boolean;
  last?: boolean;
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
      ].join(" ")}
    >
      <div className="mb-7 max-w-2xl">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {eyebrow}
        </p>

        <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em] sm:text-2xl">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
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
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div>
        <Label className="text-xs font-semibold">
          {label}
        </Label>

        {description && (
          <p className="mt-1 text-[0.65rem] leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
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
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
  status?: "success" | "pending";
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/75 bg-transparent px-4 py-4 transition-colors hover:bg-muted/[0.08]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground transition-colors group-hover:bg-primary/[0.07] group-hover:text-primary">
        <Icon size={14} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[0.6rem] font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {value}
        </p>
      </div>

      {status && (
        <span
          className={[
            "shrink-0 rounded-md px-2 py-1",
            "text-[0.58rem] font-semibold",

            status === "success"
              ? "bg-emerald-400/[0.08] text-emerald-700 dark:text-emerald-300"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {status === "success"
            ? "Verified"
            : "Pending"}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   INLINE ERROR
========================================================= */

function InlineError({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-3.5 py-3 text-xs text-destructive"
      role="alert"
    >
      <AlertCircleIcon
        size={15}
        className="mt-0.5 shrink-0"
      />

      <p className="leading-5">
        {message}
      </p>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-5 py-10 md:px-8 lg:py-12">
        <div className="max-w-xl">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="mt-5 h-10 w-48" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>

        <Skeleton className="mt-7 h-[74px] w-full rounded-xl" />

        <div className="mt-8 border-y border-border">
          <div className="grid sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={[
                  "px-5 py-4",

                  index > 0
                    ? "border-t border-border sm:border-l sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-3 h-6 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <Skeleton className="h-[520px] rounded-2xl" />

          <div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-48" />
            <Skeleton className="mt-3 h-4 w-80 max-w-full" />

            <div className="mt-8 space-y-6">
              <Skeleton className="h-11 w-full rounded-lg" />

              <div className="flex gap-3">
                <Skeleton className="h-11 flex-1 rounded-lg" />
                <Skeleton className="h-11 w-28 rounded-lg" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Skeleton className="h-11 rounded-lg" />
                <Skeleton className="h-11 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   ERROR PAGE
========================================================= */

function ProfileErrorPage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => Promise<void>;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-5 py-20 md:px-8">
        <div className="max-w-md">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertCircleIcon size={20} />
          </span>

          <h1 className="mt-5 text-2xl font-black tracking-[-0.03em]">
            Could not load your profile
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {message}
          </p>

          <Button
            type="button"
            onClick={() => void onRetry()}
            className="mt-6 h-10 rounded-lg px-5 text-xs font-semibold shadow-none"
          >
            <RefreshCwIcon size={14} />
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}