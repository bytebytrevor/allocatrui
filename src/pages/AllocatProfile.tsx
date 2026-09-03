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

import {
  AlertCircleIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CameraIcon,
  CheckIcon,
  Clock3Icon,
  Edit3Icon,
  EyeIcon,
  FileCheck2Icon,
  FileTextIcon,
  FolderCheckIcon,
  GraduationCapIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  SaveIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UploadCloudIcon,
  UserRoundCheckIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";

import { isAxiosError } from "axios";
import { toast } from "sonner";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import type { AllocatProfile } from "@/Types/allocatProfile";
import type { ProfileUser } from "@/Types/profileUser";

import DashboardMainNav from "@/components/DashboardMainNav";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   TYPES
========================================================= */

type AccountDraft = {
  fullName: string;
  phoneNumber: string;
  location: string;
};

type AboutDraft = {
  headline: string;
  bio: string;
};

type WorkDraft = {
  availability: string;
  hourlyRate: number;
  yearsExperience: number;
};

type CredentialDocument = {
  id: string;
  fileName: string;
  url?: string;
  uploadedAt?: string;
  status?: string;
};

type ExtendedAllocatProfile = AllocatProfile & {
  credentials?: CredentialDocument[];
};

type EditingSection =
  | "account"
  | "about"
  | "skills"
  | "work"
  | null;

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ACCEPTED_CREDENTIAL_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

/* =========================================================
   PAGE
========================================================= */

function AllocatProfilePage() {
  const { refreshUser } = useAuth();

  /* =======================================================
     DATA
  ======================================================= */

  const [accountProfile, setAccountProfile] =
    useState<ProfileUser | null>(null);

  const [allocatProfile, setAllocatProfile] =
    useState<ExtendedAllocatProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  /* =======================================================
     EDITING
  ======================================================= */

  const [editingSection, setEditingSection] =
    useState<EditingSection>(null);

  const [savingSection, setSavingSection] =
    useState<EditingSection>(null);

  /* =======================================================
     ERRORS
  ======================================================= */

  const [accountError, setAccountError] =
    useState<string | null>(null);

  const [avatarError, setAvatarError] =
    useState<string | null>(null);

  const [aboutError, setAboutError] =
    useState<string | null>(null);

  const [skillsError, setSkillsError] =
    useState<string | null>(null);

  const [workError, setWorkError] =
    useState<string | null>(null);

  const [credentialError, setCredentialError] =
    useState<string | null>(null);

  /* =======================================================
     ACCOUNT
  ======================================================= */

  const [accountDraft, setAccountDraft] =
    useState<AccountDraft>({
      fullName: "",
      phoneNumber: "",
      location: "",
    });

  /* =======================================================
     ABOUT
  ======================================================= */

  const [aboutDraft, setAboutDraft] =
    useState<AboutDraft>({
      headline: "",
      bio: "",
    });

  /* =======================================================
     SKILLS
  ======================================================= */

  const [skillsDraft, setSkillsDraft] =
    useState<string[]>([]);

  const [skillInput, setSkillInput] =
    useState("");

  /* =======================================================
     WORK
  ======================================================= */

  const [workDraft, setWorkDraft] =
    useState<WorkDraft>({
      availability: "",
      hourlyRate: 0,
      yearsExperience: 0,
    });

  /* =======================================================
     AVATAR
  ======================================================= */

  const avatarInputRef =
    useRef<HTMLInputElement | null>(null);

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [avatarProgress, setAvatarProgress] =
    useState(0);

  /* =======================================================
     CREDENTIALS
  ======================================================= */

  const credentialInputRef =
    useRef<HTMLInputElement | null>(null);

  const [credentialFiles, setCredentialFiles] =
    useState<File[]>([]);

  const [uploadingCredentials, setUploadingCredentials] =
    useState(false);

  /* =======================================================
     LOAD ACCOUNT PROFILE
  ======================================================= */

  const fetchAccountProfile = useCallback(async () => {
    const response = await api.get<ProfileUser>(
      "/profiles/me",
      {
        withCredentials: true,
      },
    );

    setAccountProfile(response.data);

    return response.data;
  }, []);

  /* =======================================================
     LOAD ALLOCAT PROFILE
  ======================================================= */

  const fetchAllocatProfile = useCallback(async () => {
    const response =
      await api.get<ExtendedAllocatProfile>(
        "/allocats/profiles/me",
        {
          withCredentials: true,
        },
      );

    setAllocatProfile(response.data);

    return response.data;
  }, []);

  /* =======================================================
     LOAD PAGE
  ======================================================= */

  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchAccountProfile(),
        fetchAllocatProfile(),
      ]);
    } catch (err: unknown) {
      console.error(
        "Could not load Allocat profile:",
        err,
      );

      setError(
        err instanceof Error
          ? err
          : new Error(
              "Could not load Allocat profile.",
            ),
      );
    } finally {
      setLoading(false);
    }
  }, [
    fetchAccountProfile,
    fetchAllocatProfile,
  ]);

  useEffect(() => {
    void fetchPageData();
  }, [fetchPageData]);

  /* =======================================================
     SYNC ACCOUNT DRAFT
  ======================================================= */

  useEffect(() => {
    if (!accountProfile) {
      return;
    }

    setAccountDraft({
      fullName:
        accountProfile.fullName ?? "",
      phoneNumber:
        accountProfile.phoneNumber ?? "",
      location:
        accountProfile.location ?? "",
    });
  }, [
    accountProfile?.fullName,
    accountProfile?.phoneNumber,
    accountProfile?.location,
  ]);

  /* =======================================================
     SYNC PROFESSIONAL DRAFTS
  ======================================================= */

  useEffect(() => {
    if (!allocatProfile) {
      return;
    }

    setAboutDraft({
      headline:
        allocatProfile.headline ?? "",
      bio:
        allocatProfile.bio ?? "",
    });

    setSkillsDraft(
      allocatProfile.skills ?? [],
    );

    setWorkDraft({
      availability:
        allocatProfile.availability ?? "",
      hourlyRate:
        allocatProfile.hourlyRate ?? 0,
      yearsExperience:
        allocatProfile.yearsExperience ?? 0,
    });
  }, [allocatProfile]);

  /* =======================================================
     AVATAR PREVIEW CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview,
        );
      }
    };
  }, [avatarPreview]);

  /* =======================================================
     DERIVED
  ======================================================= */

  const initials = useMemo(() => {
    return getInitials(
      accountProfile?.fullName ??
        allocatProfile?.fullName,
    );
  }, [
    accountProfile?.fullName,
    allocatProfile?.fullName,
  ]);

  const displayedAvatar =
    avatarPreview ??
    accountProfile?.avatarUrl ??
    allocatProfile?.avatarUrl ??
    undefined;

  const rating =
    allocatProfile?.rating ?? 0;

  const ratingCount =
    allocatProfile?.ratingCount ?? 0;

  const completedProjects =
    allocatProfile?.completedProjects ?? 0;

  const professionalScore =
    allocatProfile?.professionalScore ?? 0;

  const credentials =
    allocatProfile?.credentials ?? [];

  const isAvailable =
    Boolean(allocatProfile?.availability) &&
    !String(
      allocatProfile?.availability,
    )
      .toLowerCase()
      .includes("unavailable");

  /* =======================================================
     EDITING
  ======================================================= */

  function startEditing(
    section: Exclude<EditingSection, null>,
  ) {
    if (savingSection) {
      return;
    }

    setAccountError(null);
    setAboutError(null);
    setSkillsError(null);
    setWorkError(null);

    setEditingSection(section);
  }

  function cancelEditing() {
    if (!allocatProfile) {
      return;
    }

    setAccountDraft({
      fullName:
        accountProfile?.fullName ?? "",
      phoneNumber:
        accountProfile?.phoneNumber ?? "",
      location:
        accountProfile?.location ?? "",
    });

    setAboutDraft({
      headline:
        allocatProfile.headline ?? "",
      bio:
        allocatProfile.bio ?? "",
    });

    setSkillsDraft(
      allocatProfile.skills ?? [],
    );

    setWorkDraft({
      availability:
        allocatProfile.availability ?? "",
      hourlyRate:
        allocatProfile.hourlyRate ?? 0,
      yearsExperience:
        allocatProfile.yearsExperience ?? 0,
    });

    setSkillInput("");

    setAccountError(null);
    setAvatarError(null);
    setAboutError(null);
    setSkillsError(null);
    setWorkError(null);

    clearAvatarSelection();

    setEditingSection(null);
  }

  /* =======================================================
     ACCOUNT SAVE
  ======================================================= */

  async function saveAccount(
    event?: FormEvent,
  ) {
    event?.preventDefault();

    setAccountError(null);

    if (!accountDraft.fullName.trim()) {
      setAccountError(
        "Enter your full name before saving.",
      );

      return;
    }

    try {
      setSavingSection("account");

      const response =
        await api.patch<ProfileUser>(
          "/profiles/me",
          {
            fullName:
              accountDraft.fullName.trim(),

            phoneNumber:
              accountDraft.phoneNumber.trim() ||
              null,

            location:
              accountDraft.location.trim() ||
              null,
          },
          {
            withCredentials: true,
          },
        );

      setAccountProfile(response.data);

      await refreshUser();

      setEditingSection(null);

      toast.success(
        "Account details updated",
        {
          description:
            "Your account information has been saved.",
        },
      );
    } catch (error) {
      console.error(
        "Could not update account:",
        error,
      );

      setAccountError(
        getApiErrorMessage(
          error,
          "Your account details could not be saved. Please try again.",
        ),
      );
    } finally {
      setSavingSection(null);
    }
  }

  /* =======================================================
     ABOUT SAVE
  ======================================================= */

  async function saveAbout() {
    setAboutError(null);

    try {
      setSavingSection("about");

      await api.patch(
        "/allocats/profiles/me",
        {
          headline:
            aboutDraft.headline.trim() ||
            null,

          bio:
            aboutDraft.bio.trim() ||
            null,
        },
        {
          withCredentials: true,
        },
      );

      await fetchAllocatProfile();

      setEditingSection(null);

      toast.success(
        "Profile introduction updated",
        {
          description:
            "Your professional introduction has been saved.",
        },
      );
    } catch (error) {
      console.error(
        "Could not update profile introduction:",
        error,
      );

      setAboutError(
        getApiErrorMessage(
          error,
          "Your professional introduction could not be saved.",
        ),
      );
    } finally {
      setSavingSection(null);
    }
  }

  /* =======================================================
     SKILLS
  ======================================================= */

  function addSkill() {
    const value = skillInput
      .trim()
      .replace(/\s+/g, " ");

    if (!value) {
      return;
    }

    const alreadyExists =
      skillsDraft.some(
        (skill) =>
          skill.toLowerCase() ===
          value.toLowerCase(),
      );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkillsDraft((current) => [
      ...current,
      value,
    ]);

    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkillsDraft((current) =>
      current.filter(
        (item) => item !== skill,
      ),
    );
  }

  async function saveSkills() {
    setSkillsError(null);

    try {
      setSavingSection("skills");

      await api.patch(
        "/allocats/profiles/me/skills",
        {
          skills: skillsDraft,
        },
        {
          withCredentials: true,
        },
      );

      await fetchAllocatProfile();

      setEditingSection(null);

      toast.success("Skills updated", {
        description:
          "Your professional skills have been saved.",
      });
    } catch (error) {
      console.error(
        "Could not update skills:",
        error,
      );

      setSkillsError(
        getApiErrorMessage(
          error,
          "Your skills could not be saved.",
        ),
      );
    } finally {
      setSavingSection(null);
    }
  }

  /* =======================================================
     WORK DETAILS
  ======================================================= */

  async function saveWorkDetails() {
    setWorkError(null);

    if (workDraft.hourlyRate < 0) {
      setWorkError(
        "Hourly rate cannot be negative.",
      );

      return;
    }

    if (
      workDraft.yearsExperience < 0 ||
      workDraft.yearsExperience > 60
    ) {
      setWorkError(
        "Years of experience must be between 0 and 60.",
      );

      return;
    }

    try {
      setSavingSection("work");

      await api.patch(
        "/allocats/profiles/me",
        {
          availability:
            workDraft.availability.trim() ||
            null,

          hourlyRate:
            workDraft.hourlyRate,

          yearsExperience:
            workDraft.yearsExperience,
        },
        {
          withCredentials: true,
        },
      );

      await fetchAllocatProfile();

      setEditingSection(null);

      toast.success(
        "Working details updated",
        {
          description:
            "Your professional working details have been saved.",
        },
      );
    } catch (error) {
      console.error(
        "Could not update work details:",
        error,
      );

      setWorkError(
        getApiErrorMessage(
          error,
          "Your working details could not be saved.",
        ),
      );
    } finally {
      setSavingSection(null);
    }
  }

  /* =======================================================
     AVATAR
  ======================================================= */

  function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setAvatarError(null);

    if (!selectedFile) {
      return;
    }

    if (
      !ACCEPTED_AVATAR_TYPES.includes(
        selectedFile.type,
      )
    ) {
      setAvatarError(
        "Choose a JPEG, PNG or WebP image.",
      );

      event.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      MAX_AVATAR_SIZE
    ) {
      setAvatarError(
        "The image must be smaller than 5 MB.",
      );

      event.target.value = "";
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview,
      );
    }

    setAvatarFile(selectedFile);

    setAvatarPreview(
      URL.createObjectURL(
        selectedFile,
      ),
    );

    setAvatarProgress(0);
  }

  function clearAvatarSelection() {
    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview,
      );
    }

    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarProgress(0);
    setAvatarError(null);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  }

  async function uploadAvatar() {
    if (
      !avatarFile ||
      uploadingAvatar
    ) {
      return;
    }

    const data = new FormData();

    data.append(
      "file",
      avatarFile,
    );

    try {
      setUploadingAvatar(true);
      setAvatarProgress(0);
      setAvatarError(null);

      const response = await api.post<{
        avatarUrl: string;
      }>(
        "/profiles/profile-picture",
        data,
        {
          withCredentials: true,

          onUploadProgress: (event) => {
            if (!event.total) {
              return;
            }

            setAvatarProgress(
              Math.round(
                (event.loaded * 100) /
                  event.total,
              ),
            );
          },
        },
      );

      setAccountProfile((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          avatarUrl:
            response.data.avatarUrl,
        };
      });

      await refreshUser();

      clearAvatarSelection();

      toast.success(
        "Profile picture updated",
        {
          description:
            "Your new picture is now visible across Allocatr.",
        },
      );
    } catch (error) {
      console.error(
        "Could not upload profile picture:",
        error,
      );

      setAvatarError(
        getApiErrorMessage(
          error,
          "Your profile picture could not be uploaded. Please try again.",
        ),
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  /* =======================================================
     CREDENTIALS
  ======================================================= */

  function handleCredentialFiles(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setCredentialError(null);

    const incomingFiles =
      Array.from(
        event.target.files ?? [],
      );

    const acceptedFiles =
      incomingFiles.filter((file) =>
        ACCEPTED_CREDENTIAL_TYPES.includes(
          file.type,
        ),
      );

    if (
      acceptedFiles.length !==
      incomingFiles.length
    ) {
      setCredentialError(
        "Only PDF, JPEG and PNG documents are supported.",
      );
    }

    setCredentialFiles((current) => {
      const next = [...current];

      acceptedFiles.forEach(
        (incoming) => {
          const exists =
            next.some(
              (existing) =>
                existing.name ===
                  incoming.name &&
                existing.size ===
                  incoming.size,
            );

          if (!exists) {
            next.push(incoming);
          }
        },
      );

      return next;
    });

    event.target.value = "";
  }

  function removeCredentialFile(
    index: number,
  ) {
    setCredentialFiles((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index,
      ),
    );
  }

  async function uploadCredentials() {
    if (
      credentialFiles.length === 0 ||
      uploadingCredentials
    ) {
      return;
    }

    const data = new FormData();

    credentialFiles.forEach((file) => {
      data.append(
        "credentialFiles",
        file,
      );
    });

    try {
      setUploadingCredentials(true);
      setCredentialError(null);

      await api.post(
        "/allocats/profiles/me/credentials",
        data,
        {
          withCredentials: true,
        },
      );

      setCredentialFiles([]);

      await fetchAllocatProfile();

      toast.success(
        "Credentials uploaded",
        {
          description:
            "Your qualification documents have been submitted.",
        },
      );
    } catch (error) {
      console.error(
        "Could not upload credentials:",
        error,
      );

      setCredentialError(
        getApiErrorMessage(
          error,
          "Your documents could not be uploaded.",
        ),
      );
    } finally {
      setUploadingCredentials(false);
    }
  }

  /* =======================================================
     STATES
  ======================================================= */

  if (loading) {
    return <AllocatProfileSkeleton />;
  }

  if (
    error ||
    !allocatProfile ||
    !accountProfile
  ) {
    return (
      <AllocatProfileError
        onRetry={fetchPageData}
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
            ACCOUNT IDENTITY
        ================================================= */}

        <section className="pb-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}

              <div className="relative w-fit shrink-0">
                <Avatar className="h-24 w-24 border border-border bg-muted/30 shadow-sm sm:h-28 sm:w-28">
                  <AvatarImage
                    src={displayedAvatar}
                    alt={`${accountProfile.fullName}'s profile`}
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-primary/[0.08] text-2xl font-black text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {allocatProfile.isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg border-[3px] border-background bg-primary text-primary-foreground shadow-sm"
                    title="Verified Allocat"
                  >
                    <BadgeCheckIcon
                      size={14}
                    />
                  </span>
                )}

                {editingSection ===
                  "account" && (
                  <button
                    type="button"
                    onClick={() =>
                      avatarInputRef.current?.click()
                    }
                    disabled={
                      uploadingAvatar
                    }
                    className={[
                      "absolute -left-1 -top-1",
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-lg border border-border",
                      "bg-background text-muted-foreground shadow-sm",
                      "transition-colors hover:text-primary",
                      "disabled:pointer-events-none disabled:opacity-50",
                    ].join(" ")}
                    aria-label="Change profile picture"
                  >
                    <CameraIcon
                      size={14}
                    />
                  </button>
                )}
              </div>

              {/* Identity */}

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
                  {accountProfile.fullName ||
                    allocatProfile.fullName ||
                    "Allocat professional"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-foreground/75 sm:text-base">
                  {allocatProfile.headline ||
                    "Professional service provider"}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon
                      size={13}
                    />

                    {accountProfile.location ||
                      allocatProfile.location ||
                      "Location not listed"}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        isAvailable
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/40",
                      ].join(" ")}
                    />

                    {allocatProfile.availability ||
                      "Availability not set"}
                  </span>

                  {allocatProfile.responseTime && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3Icon
                        size={13}
                      />

                      {
                        allocatProfile.responseTime
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Header actions */}

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg bg-transparent px-4 text-xs font-semibold shadow-none"
              >
                <EyeIcon size={14} />
                Preview as client
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  startEditing(
                    "account",
                  )
                }
                className="h-10 w-10 rounded-lg text-muted-foreground shadow-none hover:text-primary"
                aria-label="Edit account details"
              >
                <Edit3Icon size={15} />
              </Button>
            </div>
          </div>

          {/* ===============================================
              ACCOUNT EDITOR
          =============================================== */}

          {editingSection ===
            "account" && (
            <form
              onSubmit={saveAccount}
              className="mt-7 rounded-xl border border-border bg-muted/[0.08] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold">
                    Account identity
                  </p>

                  <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
                    These details belong
                    to your main Allocatr
                    account and are shared
                    across the platform.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={
                    cancelEditing
                  }
                  disabled={
                    savingSection ===
                    "account"
                  }
                  className="h-8 w-8 rounded-lg"
                  aria-label="Cancel account editing"
                >
                  <XIcon size={14} />
                </Button>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {/* Full name */}

                <ProfileField label="Full name">
                  <div className="relative">
                    <UserRoundIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      value={
                        accountDraft.fullName
                      }
                      onChange={(
                        event,
                      ) =>
                        setAccountDraft(
                          (
                            current,
                          ) => ({
                            ...current,
                            fullName:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
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
                      disabled={
                        savingSection ===
                        "account"
                      }
                    />
                  </div>
                </ProfileField>

                {/* Phone */}

                <ProfileField label="Phone number">
                  <div className="relative">
                    <PhoneIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      type="tel"
                      value={
                        accountDraft.phoneNumber
                      }
                      placeholder="+263..."
                      onChange={(
                        event,
                      ) =>
                        setAccountDraft(
                          (
                            current,
                          ) => ({
                            ...current,
                            phoneNumber:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      className={[
                        "h-11 rounded-lg",
                        "!bg-transparent",
                        "border-border",
                        "pl-10 shadow-none",
                        "focus-visible:border-primary/40",
                        "focus-visible:ring-1",
                        "focus-visible:ring-primary/30",
                      ].join(" ")}
                      disabled={
                        savingSection ===
                        "account"
                      }
                    />
                  </div>
                </ProfileField>

                {/* Location */}

                <ProfileField label="Location">
                  <div className="relative">
                    <MapPinIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      value={
                        accountDraft.location
                      }
                      placeholder="City, country"
                      onChange={(
                        event,
                      ) =>
                        setAccountDraft(
                          (
                            current,
                          ) => ({
                            ...current,
                            location:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      className={[
                        "h-11 rounded-lg",
                        "!bg-transparent",
                        "border-border",
                        "pl-10 shadow-none",
                        "focus-visible:border-primary/40",
                        "focus-visible:ring-1",
                        "focus-visible:ring-primary/30",
                      ].join(" ")}
                      disabled={
                        savingSection ===
                        "account"
                      }
                    />
                  </div>
                </ProfileField>

                {/* Email */}

                <ProfileField label="Email">
                  <div className="relative">
                    <MailIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80"
                    />

                    <Input
                      type="email"
                      value={
                        accountProfile.email ??
                        ""
                      }
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
                </ProfileField>
              </div>

              {accountError && (
                <InlineError
                  message={
                    accountError
                  }
                />
              )}

              {/* Avatar selection */}

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={
                  handleAvatarChange
                }
              />

              {avatarFile && (
                <div className="mt-5 rounded-lg border border-border bg-background px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CameraIcon
                      size={15}
                      className="shrink-0 text-primary"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {
                          avatarFile.name
                        }
                      </p>

                      <p className="mt-0.5 text-[0.62rem] text-muted-foreground">
                        {(
                          avatarFile.size /
                          (1024 *
                            1024)
                        ).toFixed(
                          2,
                        )}{" "}
                        MB
                      </p>
                    </div>

                    {!uploadingAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={
                          clearAvatarSelection
                        }
                        className="h-8 w-8 rounded-lg"
                      >
                        <Trash2Icon
                          size={
                            13
                          }
                        />
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={() =>
                        void uploadAvatar()
                      }
                      disabled={
                        uploadingAvatar
                      }
                      className="h-8 rounded-lg px-3 text-[0.68rem] shadow-none"
                    >
                      {uploadingAvatar ? (
                        <>
                          <LoaderCircleIcon
                            size={
                              13
                            }
                            className="animate-spin"
                          />

                          {
                            avatarProgress
                          }
                          %
                        </>
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>

                  {uploadingAvatar && (
                    <Progress
                      value={
                        avatarProgress
                      }
                      className="mt-3 h-1.5"
                    />
                  )}

                  {avatarError && (
                    <InlineError
                      message={
                        avatarError
                      }
                    />
                  )}
                </div>
              )}

              <SectionActions
                saving={
                  savingSection ===
                  "account"
                }
                onCancel={
                  cancelEditing
                }
              />
            </form>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mt-8 border-y border-border">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4">
              <ProfileStat
                label="Hourly rate"
                value={`US$${
                  allocatProfile.hourlyRate ??
                  0
                }`}
                suffix="/hour"
              />

              <ProfileStat
                label="Experience"
                value={
                  allocatProfile.yearsExperience ??
                  0
                }
                suffix={
                  allocatProfile.yearsExperience ===
                  1
                    ? "year"
                    : "years"
                }
                divided
              />

              <ProfileStat
                label="Rating"
                value={
                  rating > 0
                    ? rating.toFixed(
                        1,
                      )
                    : "New"
                }
                suffix={
                  ratingCount > 0
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
          <div className="min-w-0">
            {/* =============================================
                ABOUT
            ============================================= */}

            <ProfileSection
              eyebrow="Overview"
              title={`About ${getFirstName(
                accountProfile.fullName ??
                  allocatProfile.fullName,
              )}`}
              editing={
                editingSection ===
                "about"
              }
              onEdit={() =>
                startEditing("about")
              }
              onCancel={
                cancelEditing
              }
            >
              {editingSection ===
              "about" ? (
                <div className="max-w-3xl">
                  <ProfileField label="Professional headline">
                    <Input
                      value={
                        aboutDraft.headline
                      }
                      maxLength={
                        120
                      }
                      placeholder="e.g. Senior Product Designer"
                      onChange={(
                        event,
                      ) =>
                        setAboutDraft(
                          (
                            current,
                          ) => ({
                            ...current,
                            headline:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      className="h-11 rounded-lg !bg-transparent shadow-none"
                    />
                  </ProfileField>

                  <div className="mt-5">
                    <ProfileField label="Professional bio">
                      <Textarea
                        value={
                          aboutDraft.bio
                        }
                        maxLength={
                          1000
                        }
                        onChange={(
                          event,
                        ) =>
                          setAboutDraft(
                            (
                              current,
                            ) => ({
                              ...current,
                              bio:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        placeholder="Tell clients about your experience, strengths and the kind of work you do best."
                        className="min-h-40 resize-none rounded-xl !bg-transparent leading-7 shadow-none"
                      />
                    </ProfileField>
                  </div>

                  {aboutError && (
                    <InlineError
                      message={
                        aboutError
                      }
                    />
                  )}

                  <SectionActions
                    saving={
                      savingSection ===
                      "about"
                    }
                    onSave={() =>
                      void saveAbout()
                    }
                    onCancel={
                      cancelEditing
                    }
                  />
                </div>
              ) : (
                <p className="max-w-3xl whitespace-pre-line text-sm leading-8 text-muted-foreground sm:text-[0.95rem]">
                  {allocatProfile.bio ||
                    "Add a short professional introduction so clients can understand the work you do best."}
                </p>
              )}
            </ProfileSection>

            {/* =============================================
                SKILLS
            ============================================= */}

            <ProfileSection
              eyebrow="Expertise"
              title="Skills"
              divided
              editing={
                editingSection ===
                "skills"
              }
              onEdit={() =>
                startEditing("skills")
              }
              onCancel={
                cancelEditing
              }
            >
              {editingSection ===
              "skills" ? (
                <div className="max-w-3xl">
                  <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-border bg-transparent px-3 py-2 focus-within:border-primary/35">
                    {skillsDraft.map(
                      (skill) => (
                        <span
                          key={
                            skill
                          }
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary/[0.07] px-2.5 text-[0.68rem] font-semibold text-primary"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(
                                skill,
                              )
                            }
                            className="text-primary/60 hover:text-primary"
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
                      value={
                        skillInput
                      }
                      onChange={(
                        event,
                      ) =>
                        setSkillInput(
                          event
                            .target
                            .value,
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key ===
                            ","
                        ) {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill"
                      className="h-8 min-w-[180px] flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  <p className="mt-2 text-[0.62rem] text-muted-foreground">
                    Press Enter or
                    comma to add each
                    skill.
                  </p>

                  {skillsError && (
                    <InlineError
                      message={
                        skillsError
                      }
                    />
                  )}

                  <SectionActions
                    saving={
                      savingSection ===
                      "skills"
                    }
                    onSave={() =>
                      void saveSkills()
                    }
                    onCancel={
                      cancelEditing
                    }
                  />
                </div>
              ) : allocatProfile
                  .skills?.length ? (
                <div className="flex max-w-3xl flex-wrap gap-2">
                  {allocatProfile.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-primary/10 bg-primary/[0.055] px-3 py-1.5 text-xs font-semibold text-primary"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              ) : (
                <EmptySection
                  message="Add skills so clients can find you for the right work."
                  action="Add skills"
                  onClick={() =>
                    startEditing(
                      "skills",
                    )
                  }
                />
              )}
            </ProfileSection>

            {/* =============================================
                WORK DETAILS
            ============================================= */}

            <ProfileSection
              eyebrow="Professional"
              title="Working details"
              divided
              editing={
                editingSection ===
                "work"
              }
              onEdit={() =>
                startEditing("work")
              }
              onCancel={
                cancelEditing
              }
            >
              {editingSection ===
              "work" ? (
                <div className="max-w-3xl">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <ProfileField label="Availability">
                      <Input
                        value={
                          workDraft.availability
                        }
                        placeholder="Available"
                        onChange={(
                          event,
                        ) =>
                          setWorkDraft(
                            (
                              current,
                            ) => ({
                              ...current,
                              availability:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent shadow-none"
                      />
                    </ProfileField>

                    <ProfileField label="Hourly rate">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          US$
                        </span>

                        <Input
                          type="number"
                          min={0}
                          value={
                            workDraft.hourlyRate
                          }
                          onChange={(
                            event,
                          ) =>
                            setWorkDraft(
                              (
                                current,
                              ) => ({
                                ...current,
                                hourlyRate:
                                  Number(
                                    event
                                      .target
                                      .value,
                                  ),
                              }),
                            )
                          }
                          className="h-11 rounded-lg !bg-transparent pl-11 shadow-none"
                        />
                      </div>
                    </ProfileField>

                    <ProfileField label="Years of experience">
                      <Input
                        type="number"
                        min={0}
                        max={60}
                        value={
                          workDraft.yearsExperience
                        }
                        onChange={(
                          event,
                        ) =>
                          setWorkDraft(
                            (
                              current,
                            ) => ({
                              ...current,
                              yearsExperience:
                                Number(
                                  event
                                    .target
                                    .value,
                                ),
                            }),
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent shadow-none"
                      />
                    </ProfileField>
                  </div>

                  {workError && (
                    <InlineError
                      message={
                        workError
                      }
                    />
                  )}

                  <SectionActions
                    saving={
                      savingSection ===
                      "work"
                    }
                    onSave={() =>
                      void saveWorkDetails()
                    }
                    onCancel={
                      cancelEditing
                    }
                  />
                </div>
              ) : (
                <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={
                      BriefcaseBusinessIcon
                    }
                    label="Experience"
                    value={`${
                      allocatProfile.yearsExperience ??
                      0
                    } ${
                      allocatProfile.yearsExperience ===
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
                      accountProfile.location ||
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
              )}
            </ProfileSection>

            {/* =============================================
                QUALIFICATIONS
            ============================================= */}

            <ProfileSection
              eyebrow="Qualifications"
              title="Credentials & training"
              divided
              action={
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    credentialInputRef.current?.click()
                  }
                  className="h-9 rounded-lg px-3 text-xs font-semibold text-muted-foreground shadow-none hover:text-primary"
                >
                  <PlusIcon
                    size={14}
                  />
                  Add document
                </Button>
              }
            >
              <input
                ref={
                  credentialInputRef
                }
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={
                  handleCredentialFiles
                }
              />

              {credentials.length >
                0 && (
                <div className="max-w-3xl divide-y divide-border border-y border-border">
                  {credentials.map(
                    (
                      credential,
                    ) => (
                      <CredentialRow
                        key={
                          credential.id
                        }
                        credential={
                          credential
                        }
                      />
                    ),
                  )}
                </div>
              )}

              {credentials.length ===
                0 &&
                credentialFiles.length ===
                  0 && (
                  <div className="max-w-3xl rounded-xl border border-dashed border-border bg-muted/[0.08] px-5 py-7">
                    <GraduationCapIcon
                      size={20}
                      className="text-primary"
                    />

                    <p className="mt-4 text-sm font-semibold">
                      Add your
                      qualifications
                    </p>

                    <p className="mt-1 max-w-lg text-xs leading-6 text-muted-foreground">
                      Upload
                      certificates,
                      degrees or
                      professional
                      training documents
                      that support your
                      expertise.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        credentialInputRef.current?.click()
                      }
                      className="mt-5 h-9 rounded-lg bg-transparent px-4 text-xs shadow-none"
                    >
                      <UploadCloudIcon
                        size={
                          14
                        }
                      />
                      Upload documents
                    </Button>
                  </div>
                )}

              {credentialFiles.length >
                0 && (
                <div className="mt-5 max-w-3xl rounded-xl border border-border bg-muted/[0.08] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold">
                        Ready to
                        upload
                      </p>

                      <p className="mt-1 text-[0.62rem] text-muted-foreground">
                        {
                          credentialFiles.length
                        }{" "}
                        {credentialFiles.length ===
                        1
                          ? "document"
                          : "documents"}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        void uploadCredentials()
                      }
                      disabled={
                        uploadingCredentials
                      }
                      className="h-9 rounded-lg px-4 text-xs shadow-none"
                    >
                      {uploadingCredentials ? (
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
                          <UploadCloudIcon
                            size={
                              14
                            }
                          />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 divide-y divide-border border-y border-border">
                    {credentialFiles.map(
                      (
                        file,
                        index,
                      ) => (
                        <div
                          key={`${file.name}-${file.size}`}
                          className="flex items-center gap-3 py-3"
                        >
                          <FileTextIcon
                            size={
                              14
                            }
                            className="shrink-0 text-muted-foreground"
                          />

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

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeCredentialFile(
                                index,
                              )
                            }
                            disabled={
                              uploadingCredentials
                            }
                            className="h-7 w-7 rounded-md"
                          >
                            <XIcon
                              size={
                                12
                              }
                            />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {credentialError && (
                <div className="max-w-3xl">
                  <InlineError
                    message={
                      credentialError
                    }
                  />
                </div>
              )}
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
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/70"
                  >
                    View all

                    <ArrowRightIcon
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
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
                  verified={Boolean(
                    allocatProfile.isVerified,
                  )}
                />

                <VerificationItem
                  icon={
                    FileCheck2Icon
                  }
                  title="Credentials"
                  description={
                    credentials.length >
                    0
                      ? `${credentials.length} document${
                          credentials.length ===
                          1
                            ? ""
                            : "s"
                        } submitted`
                      : "No documents submitted"
                  }
                  status={
                    credentials.length >
                    0
                      ? "Under review"
                      : "Not added"
                  }
                />

                <VerificationItem
                  icon={MailIcon}
                  title="Email"
                  description={
                    accountProfile.email ||
                    "Account email"
                  }
                  status={
                    accountProfile.emailConfirmed
                      ? "Verified"
                      : "Pending"
                  }
                  verified={Boolean(
                    accountProfile.emailConfirmed,
                  )}
                />
              </div>
            </ProfileSection>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="min-w-0 xl:sticky xl:top-24">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-primary">
                    Professional score
                  </p>

                  <h2 className="mt-2 text-lg font-black tracking-[-0.025em]">
                    {getScoreLabel(
                      professionalScore,
                    )}
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

              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                Build your reputation
                through completed work,
                client feedback,
                qualifications and
                verified information.
              </p>
            </section>

            <section className="mt-5 rounded-2xl border border-border/80 p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                  <BriefcaseBusinessIcon
                    size={14}
                  />
                </span>

                <div>
                  <p className="text-xs font-bold">
                    Work preferences
                  </p>

                  <p className="mt-0.5 text-[0.62rem] text-muted-foreground">
                    Current working
                    setup
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
                    String(
                      allocatProfile.responseTime ||
                        "",
                    ) ||
                    "Not available"
                  }
                />

                <SidebarDetail
                  label="Rate"
                  value={`US$${
                    allocatProfile.hourlyRate ??
                    0
                  }/hr`}
                  strong
                />
              </div>
            </section>

            {allocatProfile.isVerified && (
              <section className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-400/[0.05] px-4 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.1] text-emerald-700 dark:text-emerald-300">
                  <BadgeCheckIcon
                    size={16}
                  />
                </span>

                <div>
                  <p className="text-xs font-semibold">
                    Verified Allocat
                  </p>

                  <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
                    Identity
                    information has
                    been verified for
                    this professional
                    profile.
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
   PROFILE SECTION
========================================================= */

function ProfileSection({
  eyebrow,
  title,
  action,
  editing = false,
  onEdit,
  onCancel,
  children,
  divided = false,
  last = false,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  editing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
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
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-primary">
            {eyebrow}
          </p>

          <h2 className="mt-1.5 text-xl font-black tracking-[-0.025em] sm:text-2xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {action}

          {onEdit && !editing && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:text-primary"
              aria-label={`Edit ${title}`}
            >
              <Edit3Icon
                size={14}
              />
            </Button>
          )}

          {editing &&
            onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={
                  onCancel
                }
                className="h-9 w-9 rounded-lg text-muted-foreground shadow-none"
                aria-label="Cancel editing"
              >
                <XIcon
                  size={14}
                />
              </Button>
            )}
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   SECTION ACTIONS
========================================================= */

function SectionActions({
  saving,
  onSave,
  onCancel,
}: {
  saving: boolean;
  onSave?: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={saving}
        className="h-9 rounded-lg px-4 text-xs shadow-none"
      >
        Cancel
      </Button>

      {onSave ? (
        <Button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="h-9 rounded-lg px-4 text-xs shadow-none"
        >
          {saving ? (
            <>
              <LoaderCircleIcon
                size={13}
                className="animate-spin"
              />
              Saving
            </>
          ) : (
            <>
              <SaveIcon
                size={13}
              />
              Save
            </>
          )}
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={saving}
          className="h-9 rounded-lg px-4 text-xs shadow-none"
        >
          {saving ? (
            <>
              <LoaderCircleIcon
                size={13}
                className="animate-spin"
              />
              Saving
            </>
          ) : (
            <>
              <CheckIcon
                size={13}
              />
              Save
            </>
          )}
        </Button>
      )}
    </div>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-semibold">
        {label}
      </Label>

      {children}
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
  value: ReactNode;
  suffix?: ReactNode;
  divided?: boolean;
}) {
  return (
    <div
      className={[
        "min-w-0 px-5 py-4 transition-colors hover:bg-muted/[0.15]",
        divided
          ? "border-t border-border sm:border-l sm:border-t-0"
          : "",
      ].join(" ")}
    >
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-baseline gap-1.5">
        <p className="truncate text-xl font-black tracking-[-0.04em] sm:text-[1.35rem]">
          {value}
        </p>

        {suffix && (
          <span className="min-w-0 truncate text-[0.62rem] font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
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
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/75 bg-background px-4 py-4 transition-colors hover:bg-muted/[0.16]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
        <Icon size={14} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.6rem] font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   CREDENTIAL ROW
========================================================= */

function CredentialRow({
  credential,
}: {
  credential: CredentialDocument;
}) {
  const status =
    credential.status ??
    "Submitted";

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
        <FileTextIcon
          size={15}
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">
          {credential.fileName}
        </p>

        <p className="mt-1 text-[0.62rem] text-muted-foreground">
          {credential.uploadedAt
            ? formatShortDate(
                credential.uploadedAt,
              )
            : "Professional credential"}
        </p>
      </div>

      <span className="rounded-md bg-muted px-2 py-1 text-[0.58rem] font-semibold text-muted-foreground">
        {status}
      </span>
    </div>
  );
}

/* =========================================================
   VERIFICATION
========================================================= */

function VerificationItem({
  icon: Icon,
  title,
  description,
  status,
  verified = false,
}: {
  icon: ComponentType<{
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
          ].join(" ")}
        >
          <Icon size={14} />
        </span>

        <span
          className={[
            "text-[0.58rem] font-semibold",
            verified
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {status}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold">
        {title}
      </p>

      <p className="mt-1 truncate text-[0.64rem] leading-5 text-muted-foreground">
        {description}
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
        {label}
      </p>

      <p
        className={[
          "break-words text-right text-xs",
          strong
            ? "font-black tracking-[-0.01em] text-primary"
            : "font-semibold",
        ].join(" ")}
      >
        {value}
      </p>
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
      className="group flex w-full items-center gap-4 rounded-xl border border-border/75 bg-background px-5 py-5 text-left transition-colors hover:bg-muted/[0.15]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
        <FolderCheckIcon
          size={17}
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {count} completed{" "}
          {count === 1
            ? "project"
            : "projects"}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-6 text-muted-foreground">
          Completed work and client
          feedback build your
          professional history.
        </p>
      </div>

      <ArrowRightIcon
        size={14}
        className="shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </button>
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
            size={15}
          />
        </span>

        <div>
          <p className="text-sm font-semibold">
            No completed projects yet
          </p>

          <p className="mt-1 max-w-lg text-xs leading-6 text-muted-foreground">
            Completed work and client
            feedback will appear here
            as your project history
            grows.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY SECTION
========================================================= */

function EmptySection({
  message,
  action,
  onClick,
}: {
  message: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex max-w-3xl items-center justify-between gap-5 rounded-xl border border-dashed border-border px-5 py-5">
      <p className="text-xs leading-6 text-muted-foreground">
        {message}
      </p>

      <Button
        type="button"
        variant="ghost"
        onClick={onClick}
        className="h-9 shrink-0 rounded-lg px-3 text-xs font-semibold text-primary shadow-none"
      >
        <PlusIcon size={13} />
        {action}
      </Button>
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
   ERROR
========================================================= */

function AllocatProfileError({
  onRetry,
}: {
  onRetry: () => Promise<void>;
}) {
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
              size={19}
            />
          </span>

          <h1 className="mt-5 text-xl font-black">
            Could not load your
            profile
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Something interrupted the
            request for your Allocat
            profile.
          </p>

          <Button
            type="button"
            onClick={() =>
              void onRetry()
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

        <div className="mt-8 border-y border-border">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className={
                    index > 0
                      ? "border-t border-border px-5 py-4 sm:border-l sm:border-t-0"
                      : "px-5 py-4"
                  }
                >
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-3 h-6 w-24" />
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-3 h-7 w-48" />
              <Skeleton className="mt-6 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>

            <div className="border-t border-border/50 pt-9">
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

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    isAxiosError(error) &&
    typeof error.response?.data
      ?.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
}

function getInitials(
  name?: string | null,
) {
  if (!name?.trim()) {
    return "A";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part
        .charAt(0)
        .toUpperCase(),
    )
    .join("");
}

function getFirstName(
  name?: string | null,
) {
  return (
    name
      ?.trim()
      .split(/\s+/)[0] ||
    "this Allocat"
  );
}

function getScoreLabel(
  score: number,
) {
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

function formatFileSize(
  size: number,
) {
  if (size < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(size / 1024),
    )} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function formatShortDate(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

export default AllocatProfilePage;