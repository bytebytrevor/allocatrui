import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  AlertCircleIcon,
  BadgeCheckIcon,
  BanknoteIcon,
  BriefcaseBusinessIcon,
  CameraIcon,
  CircleDollarSignIcon,
  Clock3Icon,
  Edit3Icon,
  EyeIcon,
  EyeOffIcon,
  FolderCheckIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  RefreshCwIcon,
  SaveIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import type {
  AllocatAvailability,
  AllocatSkill,
  MyAllocatProfile,
  UpdateAllocatProfilePayload,
} from "@/Types/allocatProfile";

import type { ProfileUser } from "@/Types/profileUser";

import DashboardMainNav from "@/components/DashboardMainNav";
import SkillPicker from "@/components/allocat-profile/SkillPicker";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

/* =========================================================
   TYPES
========================================================= */

type EditingSection = "account" | "about" | "skills" | "work" | null;

type AccountDraft = {
  fullName: string;
  phoneNumber: string;
  location: string;
};

type ProfessionalDraft = {
  idNumber: string;
  title: string;
  headline: string;
  bio: string;
  availability: AllocatAvailability;
  hourlyRate: string;
  currency: string;
  yearsExperience: string;
  skillIds: string[];
};

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* =========================================================
   THEME
========================================================= */

const primaryButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",
  "shadow-none",

  "transition-opacity duration-150",

  "hover:border-brand-secondary-highlight/15",
  "hover:bg-brand-secondary-highlight",
  "hover:text-primary-foreground",
  "hover:opacity-90",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/20",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/10",
  "dark:hover:bg-secondary",
  "dark:hover:text-secondary-foreground",
  "dark:hover:opacity-90",

  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryButton = [
  "border border-border/65",
  "bg-surface-2/35",
  "text-foreground/75",
  "shadow-none",

  "transition-opacity duration-150",

  "hover:border-border/65",
  "hover:bg-surface-2/35",
  "hover:text-foreground/75",
  "hover:opacity-75",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/15",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",

  "dark:border-border",
  "dark:bg-surface-2/65",
  "dark:text-foreground/75",

  "dark:hover:border-border",
  "dark:hover:bg-surface-2/65",
  "dark:hover:text-foreground/75",
  "dark:hover:opacity-75",

  "dark:focus-visible:ring-secondary/15",
].join(" ");

const quietIconButton = [
  "bg-transparent",
  "text-muted-foreground",
  "shadow-none",

  "transition-opacity duration-150",

  "hover:bg-transparent",
  "hover:text-foreground",
  "hover:opacity-70",
].join(" ");

const fieldClass = [
  "h-11 rounded-lg",
  "border-border/70",
  "bg-surface-1/70",
  "shadow-none",

  "transition-[border-color,box-shadow,background-color]",

  "focus-visible:border-brand-secondary-highlight/35",
  "focus-visible:ring-1",
  "focus-visible:ring-brand-secondary-highlight/20",

  "dark:bg-surface-2/35",
  "dark:focus-visible:border-secondary/25",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const disabledFieldClass = [
  "h-11 rounded-lg",
  "border-border/60",
  "bg-surface-2/50",
  "font-medium",
  "text-muted-foreground",
  "shadow-none",

  "disabled:cursor-not-allowed",
  "disabled:opacity-100",
  "disabled:text-muted-foreground",

  "dark:bg-surface-2/65",
].join(" ");

const cardSurface = [
  "border-border/55",
  "bg-card",

  "dark:border-border",
  "dark:bg-card",
].join(" ");

const quietSurface = [
  "border-border/55",
  "bg-surface-2/30",

  "dark:border-border",
  "dark:bg-surface-2/55",
].join(" ");

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08]",
  "text-brand-secondary-highlight",
  "ring-1 ring-inset ring-brand-secondary-highlight/10",

  "dark:bg-secondary/[0.07]",
  "dark:text-secondary",
  "dark:ring-secondary/10",
].join(" ");

const progressClass = [
  "h-1.5",

  "[&_[data-slot=progress-indicator]]:bg-brand-secondary-highlight",

  "dark:[&_[data-slot=progress-indicator]]:bg-secondary",
].join(" ");

const professionalScoreSurface = [
  "border-primary/20",
  "bg-primary",
  "text-primary-foreground",

  "dark:border-brand-secondary-highlight/25",
  "dark:bg-brand-secondary",
  "dark:text-white",
].join(" ");

/* =========================================================
   PAGE
========================================================= */

function AllocatProfilePage() {
  const { refreshUser } = useAuth();

  const [accountProfile, setAccountProfile] = useState<ProfileUser | null>(
    null,
  );

  const [allocatProfile, setAllocatProfile] = useState<MyAllocatProfile | null>(
    null,
  );

  const [skillOptions, setSkillOptions] = useState<AllocatSkill[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);

  const [skillCatalogError, setSkillCatalogError] = useState<string | null>(
    null,
  );

  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  const [savingSection, setSavingSection] = useState<EditingSection>(null);

  const [sectionError, setSectionError] = useState<string | null>(null);

  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  const [showHideProfileWarning, setShowHideProfileWarning] = useState(false);

  const [accountDraft, setAccountDraft] = useState<AccountDraft>({
    fullName: "",
    phoneNumber: "",
    location: "",
  });

  const [professionalDraft, setProfessionalDraft] = useState<ProfessionalDraft>(
    {
      idNumber: "",
      title: "",
      headline: "",
      bio: "",
      availability: "available",
      hourlyRate: "",
      currency: "USD",
      yearsExperience: "",
      skillIds: [],
    },
  );

  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [avatarProgress, setAvatarProgress] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [avatarError, setAvatarError] = useState<string | null>(null);

  /* =======================================================
     LOAD SKILLS
  ======================================================= */

  const loadSkillOptions = useCallback(async () => {
    try {
      setLoadingSkills(true);
      setSkillCatalogError(null);

      const response = await api.get<AllocatSkill[]>("/skills", {
        withCredentials: true,
      });

      setSkillOptions(response.data);
    } catch (error) {
      console.error("Could not load skill catalogue:", error);

      setSkillCatalogError(
        getApiErrorMessage(error, "The skill catalogue could not be loaded."),
      );
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [accountResponse, allocatResponse] = await Promise.all([
        api.get<ProfileUser>("/profiles/me", {
          withCredentials: true,
        }),

        api.get<MyAllocatProfile>("/allocats/profiles/me", {
          withCredentials: true,
        }),
      ]);

      const account = accountResponse.data;
      const profile = allocatResponse.data;

      setAccountProfile(account);
      setAllocatProfile(profile);

      setAccountDraft(toAccountDraft(account));
      setProfessionalDraft(toProfessionalDraft(profile));

      void loadSkillOptions();
    } catch (error) {
      console.error("Could not load Allocat profile:", error);

      setPageError(
        getApiErrorMessage(error, "Your Allocat profile could not be loaded."),
      );
    } finally {
      setLoading(false);
    }
  }, [loadSkillOptions]);

  useEffect(() => {
    void fetchPageData();
  }, [fetchPageData]);

  /* =======================================================
     AVATAR CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  /* =======================================================
     HIDE PROFILE DIALOG KEYBOARD
  ======================================================= */

  useEffect(() => {
    if (!showHideProfileWarning) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !updatingVisibility) {
        setShowHideProfileWarning(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showHideProfileWarning, updatingVisibility]);

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const allSkillOptions = useMemo(() => {
    const map = new Map<string, AllocatSkill>();

    skillOptions.forEach((skill) => {
      map.set(skill.id, skill);
    });

    allocatProfile?.skills.forEach((skill) => {
      map.set(skill.id, skill);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [allocatProfile?.skills, skillOptions]);

  const selectedSkills = useMemo(
    () =>
      professionalDraft.skillIds
        .map((skillId) => allSkillOptions.find((skill) => skill.id === skillId))
        .filter((skill): skill is AllocatSkill => Boolean(skill)),
    [allSkillOptions, professionalDraft.skillIds],
  );

  const initials = useMemo(
    () => getInitials(accountProfile?.fullName ?? allocatProfile?.fullName),
    [accountProfile?.fullName, allocatProfile?.fullName],
  );

  const displayedAvatar =
    avatarPreview ??
    accountProfile?.avatarUrl ??
    allocatProfile?.avatarUrl ??
    undefined;

  /* =======================================================
     EDIT HELPERS
  ======================================================= */

  function updateProfessionalDraft<K extends keyof ProfessionalDraft>(
    key: K,
    value: ProfessionalDraft[K],
  ) {
    setProfessionalDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setSectionError(null);
  }

  function startEditing(section: Exclude<EditingSection, null>) {
    if (savingSection) {
      return;
    }

    setSectionError(null);
    setEditingSection(section);
  }

  function cancelEditing() {
    if (accountProfile) {
      setAccountDraft(toAccountDraft(accountProfile));
    }

    if (allocatProfile) {
      setProfessionalDraft(toProfessionalDraft(allocatProfile));
    }

    clearAvatarSelection();

    setSectionError(null);
    setEditingSection(null);
  }

  /* =======================================================
     SAVE ACCOUNT
  ======================================================= */

  async function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accountDraft.fullName.trim()) {
      setSectionError("Enter your full name before saving.");
      return;
    }

    try {
      setSavingSection("account");
      setSectionError(null);

      const response = await api.patch<ProfileUser>(
        "/profiles/me",
        {
          fullName: accountDraft.fullName.trim(),
          phoneNumber: accountDraft.phoneNumber.trim() || null,
          location: accountDraft.location.trim() || null,
        },
        {
          withCredentials: true,
        },
      );

      setAccountProfile(response.data);
      setAccountDraft(toAccountDraft(response.data));

      await refreshUser();

      setEditingSection(null);

      toast.success("Account details updated");
    } catch (error) {
      console.error("Could not update account:", error);

      setSectionError(
        getApiErrorMessage(error, "Your account details could not be saved."),
      );
    } finally {
      setSavingSection(null);
    }
  }

  /* =======================================================
     SAVE PROFESSIONAL
  ======================================================= */

  async function saveProfessionalSection(
    section: Exclude<EditingSection, "account" | null>,
  ) {
    const validationError = validateProfessionalDraft(professionalDraft);

    if (validationError) {
      setSectionError(validationError);
      return;
    }

    const payload = buildProfessionalPayload(professionalDraft);

    try {
      setSavingSection(section);
      setSectionError(null);

      const response = await api.put<MyAllocatProfile>(
        "/allocats/profiles/me",
        payload,
        {
          withCredentials: true,
        },
      );

      setAllocatProfile(response.data);
      setProfessionalDraft(toProfessionalDraft(response.data));

      setEditingSection(null);

      toast.success("Allocat profile updated", {
        description: "Your professional information has been saved.",
      });
    } catch (error) {
      console.error("Could not update Allocat profile:", error);

      setSectionError(
        getApiErrorMessage(
          error,
          "Your professional profile could not be saved.",
        ),
      );
    } finally {
      setSavingSection(null);
    }
  }

  /* =======================================================
     VISIBILITY
  ======================================================= */

  function requestVisibilityToggle() {
    if (!allocatProfile || updatingVisibility) {
      return;
    }

    /*
     * Showing a profile again is safe to perform immediately.
     *
     * Hiding a visible profile affects client discovery, so every
     * UI control routes through the confirmation dialog first.
     */
    if (allocatProfile.isVisible) {
      setShowHideProfileWarning(true);
      return;
    }

    void updateVisibility(true);
  }

  async function updateVisibility(isVisible: boolean) {
    if (!allocatProfile || updatingVisibility) {
      return;
    }

    try {
      setUpdatingVisibility(true);

      await api.patch(
        "/allocats/profiles/me/visibility",
        {
          isVisible,
        },
        {
          withCredentials: true,
        },
      );

      setAllocatProfile((current) =>
        current
          ? {
              ...current,
              isVisible,
            }
          : current,
      );

      setShowHideProfileWarning(false);

      toast.success(
        isVisible ? "Profile is now visible" : "Profile is now hidden",
        {
          description: isVisible
            ? "Clients can now discover your professional profile."
            : "Your professional profile will no longer appear in client discovery.",
        },
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Profile visibility could not be updated."),
      );
    } finally {
      setUpdatingVisibility(false);
    }
  }

  /* =======================================================
     AVATAR
  ======================================================= */

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setAvatarError(null);

    if (!file) {
      return;
    }

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Choose a JPEG, PNG or WebP image.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("The image must be smaller than 5 MB.");

      event.target.value = "";
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarProgress(0);
  }

  function clearAvatarSelection() {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
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
    if (!avatarFile || uploadingAvatar) {
      return;
    }

    const data = new FormData();

    data.append("file", avatarFile);

    try {
      setUploadingAvatar(true);
      setAvatarError(null);
      setAvatarProgress(0);

      const response = await api.post<{
        avatarUrl: string;
      }>("/profiles/profile-picture", data, {
        withCredentials: true,

        onUploadProgress: (event) => {
          if (!event.total) {
            return;
          }

          setAvatarProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      setAccountProfile((current) =>
        current
          ? {
              ...current,
              avatarUrl: response.data.avatarUrl,
            }
          : current,
      );

      setAllocatProfile((current) =>
        current
          ? {
              ...current,
              avatarUrl: response.data.avatarUrl,
            }
          : current,
      );

      await refreshUser();

      clearAvatarSelection();

      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Could not upload profile picture:", error);

      setAvatarError(
        getApiErrorMessage(
          error,
          "Your profile picture could not be uploaded.",
        ),
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  /* =======================================================
     PAGE STATES
  ======================================================= */

  if (loading) {
    return <AllocatProfileSkeleton />;
  }

  if (pageError || !accountProfile || !allocatProfile) {
    return (
      <AllocatProfileError
        message={pageError ?? "Your profile could not be loaded."}
        onRetry={fetchPageData}
      />
    );
  }

  const rating = allocatProfile.rating;

  const completedProjects = allocatProfile.completedProjects;

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
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Allocat
              </p>

              <p className="mt-0.5 text-xs font-semibold text-foreground">
                Profile
              </p>
            </div>
          </DashboardMainNav>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="container mx-auto px-4 py-8 sm:px-6 md:px-8 lg:py-12">
        {/* =================================================
            INTRO
        ================================================= */}

        <section className="pb-8 sm:pb-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              {/* AVATAR */}

              <div className="relative w-fit shrink-0">
                <Avatar className="h-24 w-24 border border-border/70 bg-transparent sm:h-28 sm:w-28">
                  <AvatarImage
                    src={displayedAvatar}
                    alt={
                      accountProfile.fullName
                        ? `${accountProfile.fullName}'s profile`
                        : "Allocat profile"
                    }
                    className="object-cover"
                  />

                  <AvatarFallback
                    className={[
                      "bg-brand-secondary-highlight/[0.08]",
                      "text-2xl font-semibold",
                      "text-brand-secondary-highlight",

                      "dark:bg-secondary/[0.08]",
                      "dark:text-secondary",
                    ].join(" ")}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {allocatProfile.verified && (
                  <span
                    className={[
                      "absolute -bottom-1 -right-1",
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-lg border-[3px] border-background",

                      "bg-brand-secondary-highlight",
                      "text-primary-foreground",

                      "dark:bg-secondary",
                      "dark:text-secondary-foreground",
                    ].join(" ")}
                    title="Verified Allocat"
                  >
                    <BadgeCheckIcon size={14} />
                  </span>
                )}

                {editingSection === "account" && (
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className={[
                      "absolute -left-1 -top-1",
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-lg border-[3px] border-background",

                      "bg-brand-secondary-highlight",
                      "text-primary-foreground",

                      "transition-opacity duration-150",
                      "hover:opacity-85",

                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-brand-secondary-highlight/25",

                      "disabled:pointer-events-none",
                      "disabled:opacity-60",

                      "dark:bg-secondary",
                      "dark:text-secondary-foreground",
                      "dark:focus-visible:ring-secondary/25",
                    ].join(" ")}
                    aria-label="Change profile picture"
                  >
                    <CameraIcon size={14} />
                  </button>
                )}
              </div>

              {/* IDENTITY */}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.54rem] font-semibold uppercase tracking-[0.17em] text-brand-secondary-highlight dark:text-secondary">
                    Professional profile
                  </p>

                  <span
                    className={[
                      "rounded-lg px-2 py-1",
                      "bg-brand-secondary-highlight/[0.07]",
                      "text-[0.58rem] font-semibold",
                      "text-brand-secondary-highlight",

                      "dark:bg-secondary/[0.07]",
                      "dark:text-secondary",
                    ].join(" ")}
                  >
                    Level {allocatProfile.level}
                  </span>
                </div>

                <div className="mt-2 flex min-w-0 items-start gap-2">
                  <h1 className="min-w-0 break-words text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground/95 sm:text-4xl lg:text-[2.75rem]">
                    {accountProfile.fullName}
                  </h1>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing("account")}
                    className={[
                      "mt-0.5 h-8 w-8 shrink-0 rounded-lg sm:mt-1",
                      quietIconButton,
                    ].join(" ")}
                    aria-label="Edit account details"
                    title="Edit account details"
                  >
                    <Edit3Icon size={14} />
                  </Button>
                </div>

                <p
                  className={[
                    "mt-2 text-sm font-semibold sm:text-base",

                    allocatProfile.title
                      ? "text-foreground/80"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {allocatProfile.title || "Professional service provider"}
                </p>

                {allocatProfile.headline && (
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {allocatProfile.headline}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPinIcon size={13} />

                    {accountProfile.location ||
                      allocatProfile.location ||
                      "Location not added"}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <AvailabilityDot
                      availability={allocatProfile.availabilityStatus}
                    />

                    {formatAvailability(allocatProfile.availabilityStatus)}
                  </span>

                  {allocatProfile.responseTime !== null && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3Icon size={13} />

                      {formatResponseSummary(allocatProfile.responseTime)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* VISIBILITY */}

            <div className="flex shrink-0 items-center">
              <Button
                type="button"
                variant="outline"
                onClick={requestVisibilityToggle}
                disabled={updatingVisibility}
                className={[
                  "h-10 rounded-lg px-4 text-xs font-semibold",
                  secondaryButton,
                ].join(" ")}
              >
                {updatingVisibility ? (
                  <LoaderCircleIcon size={14} className="animate-spin" />
                ) : allocatProfile.isVisible ? (
                  <EyeIcon size={14} />
                ) : (
                  <EyeOffIcon size={14} />
                )}

                {allocatProfile.isVisible ? "Visible" : "Hidden"}
              </Button>
            </div>
          </div>

          {/* =================================================
              ACCOUNT EDIT
          ================================================= */}

          {editingSection === "account" && (
            <form
              onSubmit={saveAccount}
              className={["mt-7 rounded-xl border p-5", quietSurface].join(" ")}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Account details
                  </p>

                  <p className="mt-1 text-[0.64rem] leading-5 text-muted-foreground">
                    These details belong to your main Allocatr account.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={cancelEditing}
                  className={["h-8 w-8 rounded-lg", quietIconButton].join(" ")}
                  aria-label="Close account editor"
                >
                  <XIcon size={14} />
                </Button>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ProfileField label="Full name">
                  <div className="relative">
                    <UserRoundIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      value={accountDraft.fullName}
                      onChange={(event) => {
                        setSectionError(null);

                        setAccountDraft((current) => ({
                          ...current,
                          fullName: event.target.value,
                        }));
                      }}
                      className={[fieldClass, "pl-10"].join(" ")}
                    />
                  </div>
                </ProfileField>

                <ProfileField label="Phone number">
                  <div className="relative">
                    <PhoneIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      type="tel"
                      value={accountDraft.phoneNumber}
                      placeholder="+263..."
                      onChange={(event) => {
                        setSectionError(null);

                        setAccountDraft((current) => ({
                          ...current,
                          phoneNumber: event.target.value,
                        }));
                      }}
                      className={[fieldClass, "pl-10"].join(" ")}
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
                      value={accountDraft.location}
                      placeholder="City, country"
                      onChange={(event) => {
                        setSectionError(null);

                        setAccountDraft((current) => ({
                          ...current,
                          location: event.target.value,
                        }));
                      }}
                      className={[fieldClass, "pl-10"].join(" ")}
                    />
                  </div>
                </ProfileField>

                <ProfileField label="Email">
                  <div className="relative">
                    <MailIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      value={accountProfile.email ?? ""}
                      disabled
                      className={[disabledFieldClass, "pl-10 pr-10"].join(" ")}
                    />

                    <LockKeyholeIcon
                      size={13}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                    />
                  </div>
                </ProfileField>
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />

              {avatarFile && (
                <div
                  className={["mt-5 rounded-lg border p-4", cardSurface].join(
                    " ",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        accentIconSurface,
                      ].join(" ")}
                    >
                      <CameraIcon size={14} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {avatarFile.name}
                      </p>

                      <p className="mt-0.5 text-[0.61rem] text-muted-foreground">
                        Ready to upload
                      </p>
                    </div>

                    {!uploadingAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearAvatarSelection}
                        className={["h-8 w-8 rounded-lg", quietIconButton].join(
                          " ",
                        )}
                        aria-label="Remove selected image"
                      >
                        <Trash2Icon size={13} />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void uploadAvatar()}
                      disabled={uploadingAvatar}
                      className={[
                        "h-8 rounded-lg px-3 text-xs font-semibold",
                        primaryButton,
                      ].join(" ")}
                    >
                      {uploadingAvatar ? (
                        <>
                          <LoaderCircleIcon
                            size={13}
                            className="animate-spin"
                          />
                          Uploading
                        </>
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>

                  {uploadingAvatar && (
                    <Progress
                      value={avatarProgress}
                      className={["mt-3", progressClass].join(" ")}
                    />
                  )}

                  {avatarError && <InlineError message={avatarError} />}
                </div>
              )}

              {sectionError && <InlineError message={sectionError} />}

              <SectionActions
                saving={savingSection === "account"}
                onCancel={cancelEditing}
                submit
              />
            </form>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="mt-8 border-y border-border/55">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4">
              <ProfileStat
                label="Hourly rate"
                value={
                  allocatProfile.hourlyRate !== null
                    ? formatMoney(
                        allocatProfile.hourlyRate,
                        allocatProfile.currency,
                      )
                    : "Not added"
                }
                suffix={
                  allocatProfile.hourlyRate !== null ? "/hour" : undefined
                }
              />

              <ProfileStat
                label="Experience"
                value={allocatProfile.yearsExperience ?? "Not added"}
                suffix={
                  allocatProfile.yearsExperience !== null
                    ? allocatProfile.yearsExperience === 1
                      ? "year"
                      : "years"
                    : undefined
                }
                divided
              />

              <ProfileStat
                label="Rating"
                value={rating > 0 ? rating.toFixed(1) : "New"}
                suffix={
                  allocatProfile.ratingCount > 0
                    ? `${allocatProfile.ratingCount} reviews`
                    : undefined
                }
                divided
              />

              <ProfileStat
                label="Completed"
                value={completedProjects}
                suffix={completedProjects === 1 ? "project" : "projects"}
                divided
              />
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid items-start gap-10 border-t border-border/40 pt-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
          {/* =================================================
              MAIN COLUMN
          ================================================= */}

          <div className="min-w-0">
            {/* =================================================
                OVERVIEW
            ================================================= */}

            <ProfileSection
              eyebrow="Overview"
              title={`About ${getFirstName(accountProfile.fullName)}`}
              editing={editingSection === "about"}
              onEdit={() => startEditing("about")}
              onCancel={cancelEditing}
            >
              {editingSection === "about" ? (
                <div className="max-w-3xl">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Professional title">
                      <Input
                        value={professionalDraft.title}
                        maxLength={120}
                        onChange={(event) =>
                          updateProfessionalDraft("title", event.target.value)
                        }
                        className={fieldClass}
                      />
                    </ProfileField>

                    <ProfileField label="Headline">
                      <Input
                        value={professionalDraft.headline}
                        maxLength={180}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "headline",
                            event.target.value,
                          )
                        }
                        className={fieldClass}
                      />
                    </ProfileField>
                  </div>

                  <div className="mt-5">
                    <ProfileField label="Professional bio">
                      <Textarea
                        value={professionalDraft.bio}
                        maxLength={500}
                        onChange={(event) =>
                          updateProfessionalDraft("bio", event.target.value)
                        }
                        className={[
                          "min-h-40 resize-none rounded-xl leading-7",

                          "border-border/70",
                          "bg-surface-1/70",
                          "shadow-none",

                          "transition-[border-color,box-shadow,background-color]",

                          "focus-visible:border-brand-secondary-highlight/35",
                          "focus-visible:ring-1",
                          "focus-visible:ring-brand-secondary-highlight/20",

                          "dark:bg-surface-2/35",
                          "dark:focus-visible:border-secondary/25",
                          "dark:focus-visible:ring-secondary/15",
                        ].join(" ")}
                      />
                    </ProfileField>
                  </div>

                  {!allocatProfile.verified && (
                    <div className="mt-6 border-t border-border/50 pt-6">
                      <ProfileField label="ID number">
                        <Input
                          value={professionalDraft.idNumber}
                          maxLength={50}
                          onChange={(event) =>
                            updateProfessionalDraft(
                              "idNumber",
                              event.target.value,
                            )
                          }
                          className={fieldClass}
                        />

                        <p className="mt-2 text-[0.61rem] leading-5 text-muted-foreground">
                          Private. Your ID number is never shown to clients.
                        </p>
                      </ProfileField>
                    </div>
                  )}

                  {sectionError && <InlineError message={sectionError} />}

                  <SectionActions
                    saving={savingSection === "about"}
                    onSave={() => void saveProfessionalSection("about")}
                    onCancel={cancelEditing}
                  />
                </div>
              ) : (
                <div className="max-w-3xl">
                  <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <ReadOnlyField
                      label="Professional title"
                      value={allocatProfile.title}
                      missingLabel="Not added"
                    />

                    <ReadOnlyField
                      label="Headline"
                      value={allocatProfile.headline}
                      missingLabel="Not added"
                    />
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-6">
                    <ReadOnlyField
                      label="Professional bio"
                      value={allocatProfile.bio}
                      missingLabel="Not added"
                      multiline
                    />
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-5">
                    <ReadOnlyField
                      label="ID number"
                      value={allocatProfile.idNumber ? "Added" : null}
                      missingLabel="Not added"
                      description="Private. Your ID number is not visible to clients."
                      positive={Boolean(allocatProfile.idNumber)}
                    />
                  </div>
                </div>
              )}
            </ProfileSection>

            {/* =================================================
                SKILLS
            ================================================= */}

            <ProfileSection
              eyebrow="Expertise"
              title="Skills"
              divided
              editing={editingSection === "skills"}
              onEdit={() => startEditing("skills")}
              onCancel={cancelEditing}
            >
              {editingSection === "skills" ? (
                <div className="max-w-3xl">
                  <SkillPicker
                    options={allSkillOptions}
                    selected={selectedSkills}
                    loading={loadingSkills}
                    error={skillCatalogError}
                    onChange={(skills) =>
                      updateProfessionalDraft(
                        "skillIds",
                        skills.map((skill) => skill.id),
                      )
                    }
                  />

                  {sectionError && <InlineError message={sectionError} />}

                  <SectionActions
                    saving={savingSection === "skills"}
                    onSave={() => void saveProfessionalSection("skills")}
                    onCancel={cancelEditing}
                  />
                </div>
              ) : allocatProfile.skills.length > 0 ? (
                <div className="max-w-3xl">
                  <div className="flex flex-wrap gap-2">
                    {allocatProfile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className={[
                          "rounded-lg px-3 py-1.5",

                          "bg-brand-secondary-highlight/[0.07]",

                          "text-xs font-semibold",
                          "text-brand-secondary-highlight",

                          "ring-1 ring-inset ring-brand-secondary-highlight/10",

                          "dark:bg-secondary/[0.07]",
                          "dark:text-secondary",
                          "dark:ring-secondary/10",
                        ].join(" ")}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl">
                  <MissingValue>No skills added</MissingValue>

                  <p className="mt-2 max-w-xl text-xs leading-6 text-muted-foreground">
                    Add the capabilities you offer so clients can understand
                    your expertise and find you through relevant work.
                  </p>
                </div>
              )}
            </ProfileSection>

            {/* =================================================
                WORKING DETAILS
            ================================================= */}

            <ProfileSection
              eyebrow="Professional"
              title="Working details"
              divided
              editing={editingSection === "work"}
              onEdit={() => startEditing("work")}
              onCancel={cancelEditing}
            >
              {editingSection === "work" ? (
                <div className="max-w-3xl">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Availability">
                      <select
                        value={professionalDraft.availability}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "availability",
                            event.target.value as AllocatAvailability,
                          )
                        }
                        className={[
                          fieldClass,
                          "w-full px-3.5 text-sm text-foreground outline-none",
                        ].join(" ")}
                      >
                        <option value="available">Available</option>

                        <option value="busy">Busy</option>

                        <option value="unavailable">Unavailable</option>
                      </select>
                    </ProfileField>

                    <ProfileField label="Years of experience">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={80}
                        step={1}
                        value={professionalDraft.yearsExperience}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "yearsExperience",
                            event.target.value,
                          )
                        }
                        className={fieldClass}
                      />
                    </ProfileField>

                    <ProfileField label="Hourly rate">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={professionalDraft.hourlyRate}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "hourlyRate",
                            event.target.value,
                          )
                        }
                        className={fieldClass}
                      />
                    </ProfileField>

                    <ProfileField label="Currency">
                      <Input
                        value={professionalDraft.currency}
                        maxLength={3}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "currency",
                            event.target.value.toUpperCase(),
                          )
                        }
                        className={[fieldClass, "uppercase"].join(" ")}
                      />
                    </ProfileField>
                  </div>

                  {sectionError && <InlineError message={sectionError} />}

                  <SectionActions
                    saving={savingSection === "work"}
                    onSave={() => void saveProfessionalSection("work")}
                    onCancel={cancelEditing}
                  />
                </div>
              ) : (
                <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={BriefcaseBusinessIcon}
                    label="Experience"
                    value={
                      allocatProfile.yearsExperience !== null
                        ? `${allocatProfile.yearsExperience} ${
                            allocatProfile.yearsExperience === 1
                              ? "year"
                              : "years"
                          }`
                        : "Not added"
                    }
                    missing={allocatProfile.yearsExperience === null}
                  />

                  <DetailItem
                    icon={MapPinIcon}
                    label="Location"
                    value={accountProfile.location || "Not added"}
                    missing={!accountProfile.location}
                  />

                  <DetailItem
                    icon={Clock3Icon}
                    label="Availability"
                    value={formatAvailability(
                      allocatProfile.availabilityStatus,
                    )}
                  />

                  <DetailItem
                    icon={CircleDollarSignIcon}
                    label="Hourly rate"
                    value={
                      allocatProfile.hourlyRate !== null
                        ? `${formatMoney(
                            allocatProfile.hourlyRate,
                            allocatProfile.currency,
                          )}/hr`
                        : "Not added"
                    }
                    missing={allocatProfile.hourlyRate === null}
                  />

                  <DetailItem
                    icon={BanknoteIcon}
                    label="Currency"
                    value={allocatProfile.currency || "Not added"}
                    missing={!allocatProfile.currency}
                  />
                </div>
              )}
            </ProfileSection>

            {/* =================================================
                COMPLETED PROJECTS
            ================================================= */}

            <ProfileSection
              eyebrow="Work history"
              title="Completed projects"
              divided
            >
              {allocatProfile.projects.length > 0 ? (
                <div className="max-w-3xl divide-y divide-border/55 border-y border-border/55">
                  {allocatProfile.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 py-4"
                    >
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          accentIconSurface,
                        ].join(" ")}
                      >
                        <FolderCheckIcon size={15} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {project.title}
                        </p>

                        <p className="mt-1 text-[0.61rem] text-muted-foreground">
                          {project.category} · {project.projectCode}
                        </p>
                      </div>

                      <span className="text-[0.58rem] font-semibold capitalize text-muted-foreground">
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHistory />
              )}
            </ProfileSection>

            {/* =================================================
                VERIFICATION
            ================================================= */}

            <ProfileSection eyebrow="Trust" title="Verification" divided last>
              <div className="grid gap-3 md:grid-cols-3">
                <VerificationItem
                  icon={ShieldCheckIcon}
                  title="Identity"
                  description="Professional identity"
                  status={allocatProfile.verified ? "Verified" : "Pending"}
                  verified={allocatProfile.verified}
                />

                <VerificationItem
                  icon={MailIcon}
                  title="Email"
                  description={accountProfile.email || "Account email"}
                  status={
                    accountProfile.emailConfirmed ? "Verified" : "Pending"
                  }
                  verified={Boolean(accountProfile.emailConfirmed)}
                />

                <VerificationItem
                  icon={EyeIcon}
                  title="Visibility"
                  description="Client discovery"
                  status={allocatProfile.isVisible ? "Visible" : "Hidden"}
                  verified={allocatProfile.isVisible}
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
                "relative overflow-hidden rounded-2xl border p-5",
                professionalScoreSurface,
              ].join(" ")}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-white/55">
                      Professional score
                    </p>

                    <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-white">
                      {getScoreLabel(allocatProfile.professionalScore)}
                    </h2>
                  </div>

                  <span className="text-lg font-semibold tracking-[-0.04em] text-white">
                    {allocatProfile.professionalScore}%
                  </span>
                </div>

                <ContrastProgress
                  value={allocatProfile.professionalScore}
                  className="mt-5"
                />

                <p className="mt-4 text-xs leading-6 text-white/65">
                  Complete your professional information, skills and verified
                  details, then build your reputation through completed work.
                </p>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border border-white/[0.05]"
              />
            </section>

            {/* =============================================
                WORK PREFERENCES
            ============================================= */}

            <section
              className={[
                "mt-5 overflow-hidden rounded-2xl border",
                cardSurface,
              ].join(" ")}
            >
              <div className="flex items-center gap-3 border-b border-border/55 px-5 py-4">
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    accentIconSurface,
                  ].join(" ")}
                >
                  <BriefcaseBusinessIcon size={14} />
                </span>

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Work preferences
                  </p>

                  <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
                    Current working setup
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/45 px-5">
                <SidebarDetail
                  label="Availability"
                  value={formatAvailability(allocatProfile.availabilityStatus)}
                  leading={
                    <AvailabilityDot
                      availability={allocatProfile.availabilityStatus}
                    />
                  }
                />

                <SidebarDetail
                  label="Response time"
                  value={
                    allocatProfile.responseTime !== null
                      ? formatResponseTime(allocatProfile.responseTime)
                      : "Not measured yet"
                  }
                  muted={allocatProfile.responseTime === null}
                />

                <SidebarDetail
                  label="Experience"
                  value={
                    allocatProfile.yearsExperience !== null
                      ? `${allocatProfile.yearsExperience} ${
                          allocatProfile.yearsExperience === 1
                            ? "year"
                            : "years"
                        }`
                      : "Not added"
                  }
                  missing={allocatProfile.yearsExperience === null}
                />

                <SidebarDetail
                  label="Rate"
                  value={
                    allocatProfile.hourlyRate !== null
                      ? `${formatMoney(
                          allocatProfile.hourlyRate,
                          allocatProfile.currency,
                        )}/hr`
                      : "Not added"
                  }
                  missing={allocatProfile.hourlyRate === null}
                  strong
                />

                <SidebarDetail
                  label="Currency"
                  value={allocatProfile.currency || "Not added"}
                  missing={!allocatProfile.currency}
                />

                <SidebarDetail
                  label="Joined"
                  value={formatShortDate(allocatProfile.joinedAt)}
                />
              </div>
            </section>

            {/* =============================================
                PUBLIC PROFILE
            ============================================= */}

            <section
              className={["mt-5 rounded-2xl border p-5", quietSurface].join(
                " ",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Public profile
                  </p>

                  <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                    Control whether clients can discover your professional
                    profile.
                  </p>
                </div>

                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

                    allocatProfile.isVisible
                      ? accentIconSurface
                      : "bg-surface-3/70 text-muted-foreground dark:bg-surface-2",
                  ].join(" ")}
                >
                  {allocatProfile.isVisible ? (
                    <EyeIcon size={14} />
                  ) : (
                    <EyeOffIcon size={14} />
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-y border-border/45 py-3">
                <span
                  className={[
                    "h-1.5 w-1.5 shrink-0 rounded-full",

                    allocatProfile.isVisible
                      ? "bg-status-complete"
                      : "bg-muted-foreground/40",
                  ].join(" ")}
                />

                <p className="text-[0.61rem] leading-5 text-muted-foreground">
                  {allocatProfile.isVisible
                    ? "Clients can currently discover this profile."
                    : "This profile is currently hidden from clients."}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={requestVisibilityToggle}
                disabled={updatingVisibility}
                className={[
                  "mt-4 h-9 w-full rounded-lg text-xs font-semibold",
                  secondaryButton,
                ].join(" ")}
              >
                {updatingVisibility && (
                  <LoaderCircleIcon size={13} className="animate-spin" />
                )}

                {allocatProfile.isVisible
                  ? "Hide profile"
                  : "Make profile visible"}
              </Button>
            </section>
          </aside>
        </div>
      </main>

      {/* ===================================================
          HIDE PROFILE CONFIRMATION
      =================================================== */}

      <HideProfileWarning
        open={showHideProfileWarning}
        loading={updatingVisibility}
        onCancel={() => setShowHideProfileWarning(false)}
        onConfirm={() => void updateVisibility(false)}
      />
    </div>
  );
}

/* =========================================================
   HIDE PROFILE WARNING
========================================================= */

function HideProfileWarning({
  open,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/35 px-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="hide-profile-title"
        aria-describedby="hide-profile-description"
        className={[
          "w-full max-w-md rounded-2xl border p-5 sm:p-6",
          "border-border/65",
          "bg-card",
          "text-card-foreground",
          "shadow-none",
          "dark:border-border",
          "dark:bg-card",
        ].join(" ")}
      >
        <div className="flex items-start gap-4">
          <span
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              "bg-status-pending/[0.10]",
              "text-status-pending-foreground",
            ].join(" ")}
          >
            <ShieldAlertIcon size={17} />
          </span>

          <div className="min-w-0 flex-1">
            <h2
              id="hide-profile-title"
              className="text-lg font-semibold tracking-[-0.025em] text-foreground"
            >
              Hide your professional profile?
            </h2>

            <p
              id="hide-profile-description"
              className="mt-2 text-sm leading-7 text-muted-foreground"
            >
              Clients will no longer be able to discover your Allocat profile
              while it is hidden. Your profile information and work history will
              remain saved, and you can make it visible again at any time.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={loading}
            className={[
              "-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-lg",
              quietIconButton,
            ].join(" ")}
            aria-label="Close warning"
          >
            <XIcon size={14} />
          </Button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border/45 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className={[
              "h-10 rounded-lg px-4 text-xs font-semibold",
              secondaryButton,
            ].join(" ")}
          >
            Keep profile visible
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "h-10 rounded-lg px-4 text-xs font-semibold",

              "border border-destructive/15",
              "bg-destructive",
              "text-destructive-foreground",
              "shadow-none",

              "transition-opacity duration-150",

              "hover:border-destructive/15",
              "hover:bg-destructive",
              "hover:text-destructive-foreground",
              "hover:opacity-90",

              "focus-visible:ring-2",
              "focus-visible:ring-destructive/20",
              "focus-visible:ring-offset-2",
              "focus-visible:ring-offset-background",
            ].join(" ")}
          >
            {loading ? (
              <>
                <LoaderCircleIcon size={14} className="animate-spin" />
                Hiding profile
              </>
            ) : (
              <>
                <EyeOffIcon size={14} />
                Hide profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONTRAST PROGRESS
========================================================= */

function ContrastProgress({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number.isFinite(value) ? value : 0),
  );

  return (
    <div
      className={[
        "h-1.5 w-full overflow-hidden rounded-full",
        "bg-white/[0.14]",
        className,
      ].join(" ")}
      role="progressbar"
      aria-label="Professional profile score"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className="h-full rounded-full bg-secondary transition-[width] duration-300 ease-out"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  eyebrow,
  title,
  editing = false,
  onEdit,
  onCancel,
  children,
  divided = false,
  last = false,
}: {
  eyebrow: string;
  title: string;
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
        divided ? "border-t border-border/50 pt-9" : "",

        !last ? "pb-10" : "",
      ].join(" ")}
    >
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

            <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {eyebrow}
            </p>
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
            {title}
          </h2>
        </div>

        {onEdit && !editing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className={["h-9 w-9 rounded-lg", quietIconButton].join(" ")}
            aria-label={`Edit ${title}`}
          >
            <Edit3Icon size={14} />
          </Button>
        )}

        {editing && onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className={["h-9 w-9 rounded-lg", quietIconButton].join(" ")}
            aria-label={`Close ${title} editor`}
          >
            <XIcon size={14} />
          </Button>
        )}
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
  submit = false,
}: {
  saving: boolean;
  onSave?: () => void;
  onCancel: () => void;
  submit?: boolean;
}) {
  return (
    <div className="mt-7 flex justify-end gap-2 border-t border-border/45 pt-5">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={saving}
        className={[
          "h-9 rounded-lg px-4 text-xs font-semibold",
          secondaryButton,
        ].join(" ")}
      >
        Cancel
      </Button>

      <Button
        type={submit ? "submit" : "button"}
        variant="ghost"
        onClick={submit ? undefined : onSave}
        disabled={saving}
        className={[
          "h-9 rounded-lg px-4 text-xs font-semibold",
          primaryButton,
        ].join(" ")}
      >
        {saving ? (
          <>
            <LoaderCircleIcon size={13} className="animate-spin" />
            Saving
          </>
        ) : (
          <>
            <SaveIcon size={13} />
            Save
          </>
        )}
      </Button>
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
    <div>
      <Label className="text-xs font-semibold text-foreground">{label}</Label>

      <div className="mt-2">{children}</div>
    </div>
  );
}

/* =========================================================
   READ ONLY FIELD
========================================================= */

function ReadOnlyField({
  label,
  value,
  missingLabel,
  description,
  multiline = false,
  positive = false,
}: {
  label: string;
  value?: string | null;
  missingLabel: string;
  description?: string;
  multiline?: boolean;
  positive?: boolean;
}) {
  const missing = !value?.trim();

  return (
    <div>
      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
        {label}
      </p>

      {missing ? (
        <div className="mt-2">
          <MissingValue>{missingLabel}</MissingValue>
        </div>
      ) : (
        <p
          className={[
            "mt-2 text-sm",

            multiline
              ? "whitespace-pre-line leading-8 text-muted-foreground"
              : "font-medium leading-6 text-foreground/80",

            positive ? "text-status-complete-foreground" : "",
          ].join(" ")}
        >
          {value}
        </p>
      )}

      {description && (
        <p className="mt-1.5 text-[0.61rem] leading-5 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   MISSING VALUE
========================================================= */

function MissingValue({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-status-pending-foreground">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-pending" />

      {children}
    </span>
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
        "min-w-0 px-5 py-4",

        divided ? "border-t border-border/55 sm:border-l sm:border-t-0" : "",
      ].join(" ")}
    >
      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-baseline gap-1.5">
        <p className="truncate text-lg font-semibold tracking-[-0.03em] text-foreground sm:text-xl">
          {value}
        </p>

        {suffix && (
          <span className="truncate text-[0.6rem] font-medium text-muted-foreground">
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
  missing = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  missing?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl border px-4 py-4",
        quietSurface,
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",

          missing
            ? "bg-status-pending/[0.08] text-status-pending-foreground"
            : accentIconSurface,
        ].join(" ")}
      >
        <Icon size={14} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.58rem] text-muted-foreground">{label}</p>

        <div className="mt-0.5">
          {missing ? (
            <MissingValue>{value}</MissingValue>
          ) : (
            <p className="truncate text-sm font-semibold text-foreground">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
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
  icon: LucideIcon;
  title: string;
  description: string;
  status: string;
  verified?: boolean;
}) {
  return (
    <div className={["rounded-xl border p-4", quietSurface].join(" ")}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-lg",

            verified
              ? accentIconSurface
              : "bg-surface-3/70 text-muted-foreground dark:bg-surface-2",
          ].join(" ")}
        >
          <Icon size={14} />
        </span>

        <span
          className={[
            "text-[0.56rem] font-semibold",

            verified
              ? "text-status-complete-foreground"
              : "text-status-pending-foreground",
          ].join(" ")}
        >
          {status}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold text-foreground">{title}</p>

      <p className="mt-1 truncate text-[0.62rem] leading-5 text-muted-foreground">
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
  leading,
  strong = false,
  missing = false,
  muted = false,
}: {
  label: string;
  value: string;
  leading?: ReactNode;
  strong?: boolean;
  missing?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3 py-3.5">
      <p className="text-[0.61rem] leading-5 text-muted-foreground">{label}</p>

      {missing ? (
        <div className="flex justify-end">
          <MissingValue>{value}</MissingValue>
        </div>
      ) : (
        <div className="flex min-w-0 items-center justify-end gap-2">
          {leading}

          <p
            className={[
              "break-words text-right text-xs",

              strong
                ? "font-semibold text-brand-secondary-highlight dark:text-secondary"
                : muted
                  ? "font-medium text-muted-foreground"
                  : "font-semibold text-foreground",
            ].join(" ")}
          >
            {value}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   AVAILABILITY DOT
========================================================= */

function AvailabilityDot({
  availability,
}: {
  availability: AllocatAvailability;
}) {
  const className =
    availability === "available"
      ? "bg-status-complete"
      : availability === "busy"
        ? "bg-status-pending"
        : "bg-muted-foreground/40";

  return (
    <span
      aria-hidden
      className={["h-1.5 w-1.5 shrink-0 rounded-full", className].join(" ")}
    />
  );
}

/* =========================================================
   EMPTY HISTORY
========================================================= */

function EmptyHistory() {
  return (
    <div className="max-w-3xl border-y border-border/55 py-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-3/70 text-muted-foreground ring-1 ring-inset ring-border/35 dark:bg-surface-2">
          <FolderCheckIcon size={15} />
        </span>

        <div>
          <p className="text-sm font-semibold text-foreground">
            No completed projects yet
          </p>

          <p className="mt-1 max-w-lg text-xs leading-6 text-muted-foreground">
            Completed work and client feedback will build your professional
            history here.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INLINE ERROR
========================================================= */

function InlineError({ message }: { message: string }) {
  return (
    <div
      className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-3.5 py-3 text-xs text-destructive"
      role="alert"
    >
      <AlertCircleIcon size={14} className="mt-0.5 shrink-0" />

      <p className="leading-5">{message}</p>
    </div>
  );
}

/* =========================================================
   ERROR PAGE
========================================================= */

function AllocatProfileError({
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

      <main className="container mx-auto px-4 py-20 sm:px-6 md:px-8">
        <div className="max-w-md">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/[0.08] text-destructive">
            <AlertCircleIcon size={19} />
          </span>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
            Could not load your profile
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {message}
          </p>

          <Button
            type="button"
            variant="ghost"
            onClick={() => void onRetry()}
            className={[
              "mt-6 h-10 rounded-lg px-5 text-xs font-semibold",
              primaryButton,
            ].join(" ")}
          >
            <RefreshCwIcon size={14} />
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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 md:px-8 lg:py-12">
        <div className="flex items-center gap-5">
          <Skeleton className="h-24 w-24 rounded-full" />

          <div className="space-y-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <div className="mt-8 border-y border-border/55">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className={[
                  "px-5 py-4",

                  index > 0
                    ? "border-t border-border/55 sm:border-l sm:border-t-0"
                    : "",
                ].join(" ")}
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-3 h-6 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-10 border-t border-border/40 pt-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
          <div className="space-y-10">
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-3 h-7 w-44" />
              <Skeleton className="mt-7 h-24 w-full rounded-xl" />
            </div>

            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>

          <div className="hidden space-y-5 xl:block">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DRAFT HELPERS
========================================================= */

function toAccountDraft(account: ProfileUser): AccountDraft {
  return {
    fullName: account.fullName ?? "",

    phoneNumber: account.phoneNumber ?? "",

    location: account.location ?? "",
  };
}

function toProfessionalDraft(profile: MyAllocatProfile): ProfessionalDraft {
  return {
    idNumber: profile.idNumber ?? "",

    title: profile.title ?? "",

    headline: profile.headline ?? "",

    bio: profile.bio ?? "",

    availability: profile.availabilityStatus,

    hourlyRate: profile.hourlyRate?.toString() ?? "",

    currency: profile.currency || "USD",

    yearsExperience: profile.yearsExperience?.toString() ?? "",

    skillIds: profile.skills.map((skill) => skill.id),
  };
}

/* =========================================================
   BUILD PAYLOAD
========================================================= */

function buildProfessionalPayload(
  draft: ProfessionalDraft,
): UpdateAllocatProfilePayload {
  return {
    idNumber: draft.idNumber.trim(),

    title: cleanOptional(draft.title),

    headline: cleanOptional(draft.headline),

    bio: cleanOptional(draft.bio),

    hourlyRate: parseNullableNumber(draft.hourlyRate),

    currency: draft.currency.trim().toUpperCase(),

    availability: draft.availability,

    yearsExperience: parseNullableInteger(draft.yearsExperience),

    skillIds: draft.skillIds,
  };
}

/* =========================================================
   VALIDATION
========================================================= */

function validateProfessionalDraft(draft: ProfessionalDraft) {
  if (!draft.idNumber.trim()) {
    return "ID number is required.";
  }

  if (draft.skillIds.length === 0) {
    return "Select at least one skill.";
  }

  if (!/^[A-Za-z]{3}$/.test(draft.currency.trim())) {
    return "Currency must use a three-letter code such as USD.";
  }

  if (draft.hourlyRate.trim()) {
    const hourlyRate = Number(draft.hourlyRate);

    if (!Number.isFinite(hourlyRate)) {
      return "Enter a valid hourly rate.";
    }

    if (hourlyRate < 0) {
      return "Hourly rate cannot be negative.";
    }
  }

  if (draft.yearsExperience.trim()) {
    const yearsExperience = Number(draft.yearsExperience);

    if (!Number.isInteger(yearsExperience)) {
      return "Years of experience must be a whole number.";
    }

    if (yearsExperience < 0 || yearsExperience > 80) {
      return "Years of experience must be between 0 and 80.";
    }
  }

  return null;
}

/* =========================================================
   VALUE HELPERS
========================================================= */

function cleanOptional(value: string) {
  return value.trim() || null;
}

function parseNullableNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function parseNullableInteger(value: string) {
  if (!value.trim()) {
    return null;
  }

  const number = Number(value);

  return Number.isInteger(number) ? number : null;
}

/* =========================================================
   NAME HELPERS
========================================================= */

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "A";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getFirstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] || "this Allocat";
}

/* =========================================================
   SCORE
========================================================= */

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

/* =========================================================
   AVAILABILITY
========================================================= */

function formatAvailability(availability: AllocatAvailability) {
  return availability.charAt(0).toUpperCase() + availability.slice(1);
}

/* =========================================================
   RESPONSE TIME
========================================================= */

function formatResponseTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  if (minutes < 1440) {
    const hours = Math.round(minutes / 60);

    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  const days = Math.round(minutes / 1440);

  return `${days} ${days === 1 ? "day" : "days"}`;
}

function formatResponseSummary(minutes: number) {
  return `Usually responds in ${formatResponseTime(minutes)}`;
}

/* =========================================================
   MONEY
========================================================= */

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}

/* =========================================================
   DATE
========================================================= */

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   API ERROR
========================================================= */

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (data && typeof data === "object") {
    if ("detail" in data && typeof data.detail === "string") {
      return data.detail;
    }

    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }

    if ("title" in data && typeof data.title === "string") {
      return data.title;
    }
  }

  return fallback;
}

export default AllocatProfilePage;
