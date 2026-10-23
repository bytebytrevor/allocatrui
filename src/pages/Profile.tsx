import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isAxiosError } from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CameraIcon,
  CheckIcon,
  CircleIcon,
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
  XIcon,
  type LucideIcon,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import type { ProfileUser } from "@/Types/profileUser";
import DashboardMainNav from "@/components/DashboardMainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileForm = {
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  cityName: string;
};
type ResidenceCountry = {
  code: string;
  name: string;
  supportsAllocatOperations: boolean;
};
type VerificationTrigger = "banner" | "field";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EMAIL_VERIFICATION_ENDPOINT = "/profiles/me/email-verification";
const ALLOCAT_PROFILE_ROUTE = "/allocats/profile";
const NO_COUNTRY = "__none__";
const primaryButton = [
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground shadow-none",
  "transition-opacity duration-150 motion-reduce:transition-none",
  "hover:border-brand-secondary-highlight/15 hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground",
  "dark:hover:border-secondary/10 dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:hover:opacity-90",
  "dark:focus-visible:ring-secondary/20",
].join(" ");
const secondaryButton = [
  "border border-border/65 bg-surface-2/35 text-foreground/80 shadow-none",
  "transition-colors duration-150 motion-reduce:transition-none",
  "hover:border-border hover:bg-surface-2/70 hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-border dark:bg-surface-2/65 dark:text-foreground/80",
  "dark:hover:bg-surface-3/60 dark:hover:text-foreground dark:focus-visible:ring-secondary/20",
].join(" ");
const quietIconButton = [
  "bg-transparent text-muted-foreground shadow-none transition-colors duration-150 motion-reduce:transition-none",
  "hover:bg-surface-2/60 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/25 dark:focus-visible:ring-secondary/25",
].join(" ");
// Override the shared Select's accent defaults here, pairing neutral text with
// neutral surfaces in normal, selected, hover and keyboard-highlighted states.
const countryMenuClass = [
  "rounded-xl border border-border/70 !bg-card p-1.5 !text-foreground",
  "shadow-lg shadow-black/[0.07] dark:border-border dark:shadow-black/25",
].join(" ");
const countryItemClass = [
  "min-h-10 cursor-default rounded-lg py-2.5 !text-foreground",
  "text-sm font-medium whitespace-normal transition-colors duration-150 motion-reduce:transition-none",
  "hover:!bg-surface-3 hover:!text-foreground",
  "focus:!bg-surface-3 focus:!text-foreground",
  "data-[highlighted]:!bg-surface-3 data-[highlighted]:!text-foreground",
  "data-[state=checked]:!bg-surface-2 data-[state=checked]:!text-foreground",
  "[&_span]:!text-inherit",
].join(" ");
const fieldClass = [
  "h-11 rounded-lg border-border/70 bg-surface-1/70 shadow-none",
  "transition-[border-color,box-shadow,background-color] motion-reduce:transition-none",
  "hover:border-border focus-visible:border-brand-secondary-highlight/40 focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15",
  "dark:bg-surface-2/35 dark:focus-visible:border-secondary/25 dark:focus-visible:ring-secondary/15",
].join(" ");
const disabledFieldClass = [
  "h-11 rounded-lg border-border/60 bg-surface-2/50 font-medium text-muted-foreground shadow-none",
  "disabled:cursor-not-allowed disabled:opacity-100 disabled:text-muted-foreground",
  "dark:bg-surface-2/65",
].join(" ");
const cardSurface = "border-border/55 bg-card dark:border-border dark:bg-card";
const quietSurface =
  "border-border/55 bg-surface-2/30 dark:border-border dark:bg-surface-2/55";
const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10",
  "dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10",
].join(" ");
const pageCanvas = "bg-surface-2/20 dark:bg-background";
const profileSurface = [
  "rounded-2xl border border-border/60 bg-card shadow-sm shadow-black/[0.025]",
  "dark:border-border dark:bg-card dark:shadow-none",
].join(" ");
const sectionSurface = [
  "rounded-2xl border border-border/60 bg-card",
  "dark:border-border dark:bg-card",
].join(" ");
const accountCompletionSurface = [
  "border-primary/20 bg-primary text-primary-foreground",
  "dark:border-brand-secondary-highlight/25 dark:bg-brand-secondary dark:text-white",
].join(" ");

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [countries, setCountries] = useState<ResidenceCountry[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [clearLegacyLocation, setClearLegacyLocation] = useState(false);
  const residenceBeforeClear = useRef({ countryCode: "", cityName: "" });
  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [verificationErrorSource, setVerificationErrorSource] =
    useState<VerificationTrigger | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    phoneNumber: "",
    countryCode: "",
    cityName: "",
  });
  const fetchProfile = useCallback(async () => {
    if (!user || user.isAllocat) return;
    try {
      setLoadingProfile(true);
      setProfileLoadError(null);
      const response = await api.get<ProfileUser>("/profiles/me", {
        withCredentials: true,
      });
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
  }, [user]);
  const fetchCountries = useCallback(async () => {
    try {
      setLoadingCountries(true);
      setCountriesError(null);
      // Residence uses the worldwide list, without operatingOnly=true.
      const response = await api.get<ResidenceCountry[]>(
        "/locations/countries",
        { withCredentials: true },
      );
      if (!Array.isArray(response.data) || response.data.length === 0)
        throw new Error("Country catalogue unavailable.");
      setCountries(
        [...response.data].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } catch (error) {
      setCountriesError(
        getApiErrorMessage(
          error,
          "The country list could not be loaded. Please try again.",
        ),
      );
    } finally {
      setLoadingCountries(false);
    }
  }, []);
  useEffect(() => {
    if (!user || user.isAllocat) return;
    void fetchProfile();
  }, [user, fetchProfile]);
  useEffect(() => {
    if (!user || user.isAllocat) return;
    void fetchCountries();
  }, [user, fetchCountries]);
  useEffect(() => {
    if (!profileUser) return;
    setProfileForm({
      fullName: profileUser.fullName ?? "",
      phoneNumber: profileUser.phoneNumber ?? "",
      countryCode: profileUser.countryCode ?? "",
      cityName: profileUser.cityName ?? "",
    });
    setClearLegacyLocation(false);
  }, [profileUser]);
  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );
  useEffect(() => {
    if (!avatarEditorOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !uploadingAvatar) closeAvatarEditor();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [avatarEditorOpen, uploadingAvatar]);
  const residenceHasChanges =
    profileForm.countryCode !== (profileUser?.countryCode ?? "") ||
    profileForm.cityName.trim() !== (profileUser?.cityName ?? "").trim() ||
    clearLegacyLocation;
  const profileHasChanges =
    profileForm.fullName.trim() !== (profileUser?.fullName ?? "").trim() ||
    profileForm.phoneNumber.trim() !==
      (profileUser?.phoneNumber ?? "").trim() ||
    residenceHasChanges;
  const profileCompletion = useMemo(() => {
    if (!profileUser) return 0;
    const requirements = [
      Boolean(profileUser.fullName?.trim()),
      Boolean(profileUser.email?.trim()),
      profileUser.emailConfirmed,
      Boolean(profileUser.phoneNumber?.trim()),
      Boolean(profileUser.countryCode?.trim()),
      Boolean(profileUser.avatarUrl),
    ];
    return Math.round(
      (requirements.filter(Boolean).length / requirements.length) * 100,
    );
  }, [profileUser]);
  function openAvatarEditor() {
    setAvatarError(null);
    setAvatarEditorOpen(true);
  }
  function closeAvatarEditor() {
    if (uploadingAvatar) return;
    clearAvatarSelection();
    setAvatarEditorOpen(false);
  }
  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setAvatarError(null);
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError("Choose a JPEG, PNG or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setAvatarError("The profile picture cannot exceed 5 MB.");
      event.target.value = "";
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarProgress(0);
  }
  function clearAvatarSelection() {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarProgress(0);
    setAvatarError(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }
  async function uploadProfilePicture() {
    if (!avatarFile || uploadingAvatar || !profileUser) return;
    const previousAvatar = profileUser.avatarUrl ?? null;
    const formData = new FormData();
    formData.append("file", avatarFile);
    try {
      setUploadingAvatar(true);
      setAvatarProgress(0);
      setAvatarError(null);
      await api.post("/profiles/profile-picture", formData, {
        withCredentials: true,
        onUploadProgress: (event) => {
          if (!event.total) return;
          setAvatarProgress(Math.round((event.loaded * 100) / event.total));
        },
      });
      const response = await api.get<ProfileUser>("/profiles/me", {
        withCredentials: true,
      });
      const nextAvatar = response.data.avatarUrl;
      if (!nextAvatar || nextAvatar === previousAvatar)
        throw new Error(
          "The upload completed, but the new profile picture was not saved.",
        );
      setProfileUser(response.data);
      await refreshUser();
      clearAvatarSelection();
      setAvatarEditorOpen(false);
      toast.success("Profile picture updated");
    } catch (error) {
      console.error("Could not upload profile picture:", error);
      if (
        error instanceof Error &&
        error.message ===
          "The upload completed, but the new profile picture was not saved."
      )
        setAvatarError(error.message);
      else
        setAvatarError(
          getApiErrorMessage(
            error,
            "The image could not be uploaded. Please try again.",
          ),
        );
    } finally {
      setUploadingAvatar(false);
    }
  }
  function handleProfileFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
    setProfileError(null);
  }
  function handleResidenceCountryChange(value: string) {
    const countryCode = value === NO_COUNTRY ? "" : value;
    setProfileForm((current) => ({
      ...current,
      countryCode,
      cityName: countryCode === current.countryCode ? current.cityName : "",
    }));
    setClearLegacyLocation(false);
    setProfileError(null);
  }
  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingProfile) return;
    if (!profileForm.fullName.trim()) {
      setProfileError("Enter your full name before saving.");
      return;
    }
    if (residenceHasChanges) {
      if (profileForm.cityName.trim() && !profileForm.countryCode) {
        setProfileError("Select your country before adding a city.");
        return;
      }
      if (profileForm.cityName.trim().length > 150) {
        setProfileError("City name cannot exceed 150 characters.");
        return;
      }
      if (
        profileForm.countryCode &&
        profileForm.countryCode !== profileUser?.countryCode &&
        !countries.some((country) => country.code === profileForm.countryCode)
      ) {
        setProfileError(
          "Select a country from the country list. Reload the list if it is unavailable.",
        );
        return;
      }
    }
    const payload: {
      fullName: string;
      phoneNumber: string | null;
      countryCode?: string | null;
      cityName?: string | null;
    } = {
      fullName: profileForm.fullName.trim(),
      phoneNumber: profileForm.phoneNumber.trim() || null,
    };
    // Omit residence entirely for unrelated edits, especially legacy-only accounts.
    if (residenceHasChanges) {
      payload.countryCode = profileForm.countryCode || null;
      payload.cityName = profileForm.cityName.trim() || null;
    }
    try {
      setSavingProfile(true);
      setProfileError(null);
      const response = await api.patch<ProfileUser>("/profiles/me", payload, {
        withCredentials: true,
      });
      setProfileUser(response.data);
      await refreshUser();
      toast.success("Profile updated", {
        description: "Your personal information has been saved.",
      });
    } catch (error) {
      console.error("Could not update profile:", error);
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
  async function sendVerificationEmail(source: VerificationTrigger) {
    if (
      !profileUser?.email ||
      profileUser.emailConfirmed ||
      sendingVerification
    )
      return;
    try {
      setSendingVerification(true);
      setVerificationError(null);
      setVerificationErrorSource(source);
      await api.post(
        EMAIL_VERIFICATION_ENDPOINT,
        {},
        { withCredentials: true },
      );
      setVerificationError(null);
      setVerificationErrorSource(null);
      toast.success("Verification email sent", {
        description: `Check ${profileUser.email} for your verification link.`,
      });
    } catch (error) {
      console.error("Could not send verification email:", error);
      setVerificationError(
        getApiErrorMessage(
          error,
          "We could not send the verification email. Please try again.",
        ),
      );
      setVerificationErrorSource(source);
    } finally {
      setSendingVerification(false);
    }
  }
  if (user?.isAllocat) return <Navigate to={ALLOCAT_PROFILE_ROUTE} replace />;
  if (!user || loadingProfile) return <ProfileLoading />;
  if (profileLoadError || !profileUser)
    return (
      <ProfileErrorPage
        message={profileLoadError ?? "Your profile could not be loaded."}
        onRetry={fetchProfile}
      />
    );
  const initials = getInitials(profileUser.fullName);
  const residenceLabel = formatResidence(profileUser);
  const legacyResidence = Boolean(
    !profileUser.countryCode && profileUser.location?.trim(),
  );
  return (
    <div className={["min-h-screen text-foreground", pageCanvas].join(" ")}>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav>
            <div>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Account
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                Profile
              </p>
            </div>
          </DashboardMainNav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-8">
        <section className={["overflow-hidden", profileSurface].join(" ")}>
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative w-fit shrink-0">
                  <Avatar className="h-24 w-24 border border-border/70 bg-transparent sm:h-28 sm:w-28">
                    <AvatarImage
                      key={profileUser.avatarUrl ?? "avatar"}
                      src={profileUser.avatarUrl ?? undefined}
                      alt={`${profileUser.fullName}'s profile`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-brand-secondary-highlight/[0.08] text-2xl font-semibold text-brand-secondary-highlight dark:bg-secondary/[0.08] dark:text-secondary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={openAvatarEditor}
                    className="absolute -left-1 -top-1 flex h-8 w-8 items-center justify-center rounded-lg border-[3px] border-card bg-brand-secondary-highlight text-primary-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/25 dark:bg-secondary dark:text-secondary-foreground dark:focus-visible:ring-secondary/25"
                    aria-label="Update profile picture"
                    title="Update profile picture"
                  >
                    <CameraIcon size={14} />
                  </button>
                  {profileUser.emailConfirmed && (
                    <span
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg border-[3px] border-card bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
                      title="Verified account email"
                    >
                      <BadgeCheckIcon size={14} />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-brand-secondary-highlight dark:text-secondary">
                      Client profile
                    </p>
                    <Badge
                      variant="outline"
                      className="h-6 rounded-md border-border/55 bg-surface-2/35 px-2 text-[0.625rem] font-semibold text-muted-foreground shadow-none dark:bg-surface-2/55"
                    >
                      Client account
                    </Badge>
                  </div>
                  <h1 className="mt-2 break-words [overflow-wrap:anywhere] text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground/95 sm:text-4xl lg:text-[2.75rem]">
                    {profileUser.fullName}
                  </h1>
                  <div className="mt-3 flex min-w-0 items-center gap-2">
                    <MailIcon
                      size={13}
                      className="shrink-0 text-muted-foreground"
                    />
                    <p className="truncate text-sm text-muted-foreground">
                      {profileUser.email || "No email available"}
                    </p>
                    {profileUser.emailConfirmed && (
                      <BadgeCheckIcon
                        size={13}
                        className="shrink-0 text-status-complete-foreground"
                      />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon size={13} />
                      {residenceLabel || "Residence not added"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3Icon size={13} />
                      Joined {formatDateShort(profileUser.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={[
                  "inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2",
                  profileUser.emailConfirmed
                    ? "border-status-complete/15 bg-status-complete/[0.055] text-status-complete-foreground"
                    : "border-status-pending/20 bg-status-pending/[0.055] text-status-pending-foreground",
                ].join(" ")}
              >
                {profileUser.emailConfirmed ? (
                  <BadgeCheckIcon size={13} />
                ) : (
                  <MailCheckIcon size={13} />
                )}
                <span className="text-xs font-semibold">
                  {profileUser.emailConfirmed
                    ? "Email verified"
                    : "Email verification pending"}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-border/55">
            <div className="grid sm:grid-cols-3">
              <SummaryStat
                label="Profile"
                value={`${profileCompletion}%`}
                suffix="complete"
              />
              <SummaryStat
                label="Residence"
                value={residenceLabel || "Not added"}
                divided
              />
              <SummaryStat
                label="Member since"
                value={formatDateShort(profileUser.createdAt)}
                divided
              />
            </div>
          </div>
        </section>
        {!profileUser.emailConfirmed && (
          <div className="mt-4">
            <EmailVerificationWarning
              email={profileUser.email}
              sending={sendingVerification}
              error={
                verificationErrorSource === "banner" ? verificationError : null
              }
              onVerify={() => sendVerificationEmail("banner")}
            />
          </div>
        )}
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            <ProfileSection
              eyebrow="Personal details"
              title="Your information"
              description="The basic information connected to your Allocatr account."
            >
              <form onSubmit={saveProfile}>
                <div className="grid gap-6">
                  <ProfileField
                    label="Full name"
                    htmlFor="fullName"
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
                        className={[fieldClass, "pl-10"].join(" ")}
                        disabled={savingProfile}
                      />
                    </div>
                  </ProfileField>
                  <ProfileField
                    label="Email address"
                    htmlFor="email"
                    description="Your sign-in email is tied to your account and cannot be changed here."
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
                          className={[disabledFieldClass, "pl-10 pr-10"].join(
                            " ",
                          )}
                        />
                        <LockKeyholeIcon
                          size={13}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/55"
                        />
                      </div>
                      {profileUser.emailConfirmed ? (
                        <div className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-status-complete/15 bg-status-complete/[0.055] px-3.5 text-xs font-semibold text-status-complete-foreground">
                          <BadgeCheckIcon size={13} />
                          Verified
                        </div>
                      ) : (
                        <VerificationButton
                          sending={sendingVerification}
                          disabled={!profileUser.email}
                          onVerify={() => sendVerificationEmail("field")}
                          size="field"
                        />
                      )}
                    </div>
                    {verificationErrorSource === "field" &&
                      verificationError && (
                        <FieldError message={verificationError} />
                      )}
                  </ProfileField>
                  <ProfileField label="Phone number" htmlFor="phoneNumber">
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
                        className={[fieldClass, "pl-10"].join(" ")}
                        disabled={savingProfile}
                      />
                    </div>
                  </ProfileField>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <ProfileField
                      label="Country of residence"
                      htmlFor="countryCode"
                      description="The country where you currently live."
                    >
                      <Select
                        value={profileForm.countryCode || NO_COUNTRY}
                        disabled={savingProfile || loadingCountries}
                        onValueChange={handleResidenceCountryChange}
                      >
                        <SelectTrigger
                          id="countryCode"
                          aria-label="Country of residence"
                          className={[
                            fieldClass,
                            "w-full !text-foreground focus:ring-2 focus:ring-brand-secondary-highlight/15 focus:ring-offset-0 dark:focus:ring-secondary/15",
                          ].join(" ")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={countryMenuClass}>
                          <SelectItem
                            value={NO_COUNTRY}
                            className={countryItemClass}
                          >
                            Not added
                          </SelectItem>
                          {profileForm.countryCode &&
                            !countries.some(
                              (country) =>
                                country.code === profileForm.countryCode,
                            ) && (
                              <SelectItem
                                value={profileForm.countryCode}
                                className={countryItemClass}
                              >
                                {profileUser.countryName ||
                                  profileForm.countryCode}
                              </SelectItem>
                            )}
                          {countries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.code}
                              className={countryItemClass}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {loadingCountries && (
                        <p
                          role="status"
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <LoaderCircleIcon
                            size={12}
                            className="animate-spin motion-reduce:animate-none"
                          />
                          Loading countries
                        </p>
                      )}
                      {countriesError && (
                        <div className="space-y-2">
                          <FieldError message={countriesError} />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => void fetchCountries()}
                            disabled={loadingCountries || savingProfile}
                            className={[
                              "h-8 rounded-lg px-3 text-xs",
                              secondaryButton,
                            ].join(" ")}
                          >
                            <RefreshCwIcon size={12} />
                            Retry countries
                          </Button>
                        </div>
                      )}
                    </ProfileField>
                    <ProfileField
                      label="City or town"
                      htmlFor="cityName"
                      description="Enter your residence city. It does not need to be in an Allocat operating region."
                    >
                      <div className="relative">
                        <MapPinIcon
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          id="cityName"
                          name="cityName"
                          autoComplete="address-level2"
                          maxLength={150}
                          value={profileForm.cityName}
                          onChange={handleProfileFieldChange}
                          placeholder={
                            profileForm.countryCode
                              ? "e.g. London"
                              : "Select your country first"
                          }
                          className={[fieldClass, "pl-10"].join(" ")}
                          disabled={savingProfile || !profileForm.countryCode}
                        />
                      </div>
                    </ProfileField>
                  </div>
                  <p className="text-[0.6875rem] leading-5 text-muted-foreground">
                    Your residence is separate from where you need work done.
                    You can hire Allocats in supported regions while living
                    abroad.
                  </p>
                  {legacyResidence && (
                    <div
                      className={["rounded-xl border p-4", quietSurface].join(
                        " ",
                      )}
                    >
                      <p className="text-xs font-semibold text-foreground">
                        Confirm your residence
                      </p>
                      <p className="mt-1 break-words text-xs leading-6 text-muted-foreground">
                        Previous location:{" "}
                        <span className="font-medium text-foreground">
                          {profileUser.location}
                        </span>
                        . Select a country and enter your city to confirm it.
                        Your previous location stays saved until you update it.
                      </p>
                      {clearLegacyLocation ? (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <p
                            role="status"
                            className="text-xs text-muted-foreground"
                          >
                            Your previous location will be cleared when you
                            save.
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={savingProfile}
                            onClick={() => {
                              setProfileForm((current) => ({
                                ...current,
                                ...residenceBeforeClear.current,
                              }));
                              setClearLegacyLocation(false);
                              setProfileError(null);
                            }}
                            className={[
                              "h-8 rounded-lg px-3 text-xs",
                              secondaryButton,
                            ].join(" ")}
                          >
                            Undo
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={savingProfile}
                          onClick={() => {
                            residenceBeforeClear.current = {
                              countryCode: profileForm.countryCode,
                              cityName: profileForm.cityName,
                            };
                            setProfileForm((current) => ({
                              ...current,
                              countryCode: "",
                              cityName: "",
                            }));
                            setClearLegacyLocation(true);
                            setProfileError(null);
                          }}
                          className={[
                            "mt-3 h-8 rounded-lg px-3 text-xs",
                            secondaryButton,
                          ].join(" ")}
                        >
                          Clear previous location
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {profileError && <InlineError message={profileError} />}
                <div className="mt-7 flex flex-col gap-3 border-t border-border/45 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={[
                      "text-[0.6875rem]",
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
                    variant="ghost"
                    disabled={!profileHasChanges || savingProfile}
                    className={[
                      "h-9 rounded-lg px-4 text-xs font-semibold",
                      primaryButton,
                      "disabled:border-border/50 disabled:bg-surface-3 disabled:text-muted-foreground disabled:opacity-60",
                      "dark:disabled:bg-surface-2",
                    ].join(" ")}
                  >
                    {savingProfile ? (
                      <>
                        <LoaderCircleIcon
                          size={13}
                          className="animate-spin motion-reduce:animate-none"
                        />
                        Saving
                      </>
                    ) : (
                      <>
                        <SaveIcon size={13} />
                        Save changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </ProfileSection>
            <ProfileSection
              eyebrow="Account"
              title="Account status"
              description="A quick overview of your current client account."
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
                  status={profileUser.emailConfirmed ? "success" : "pending"}
                />
                <AccountItem
                  icon={Clock3Icon}
                  label="Member since"
                  value={formatDate(profileUser.createdAt)}
                />
                <AccountItem
                  icon={UserRoundIcon}
                  label="Account type"
                  value="Client"
                />
                <AccountItem
                  icon={LockKeyholeIcon}
                  label="Account profile"
                  value="Private"
                />
              </div>
            </ProfileSection>
          </div>
          <aside className="min-w-0 space-y-5 xl:sticky xl:top-24">
            <section
              className={[
                "rounded-2xl border p-5",
                accountCompletionSurface,
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-white/55">
                    Account completion
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-white">
                    {getCompletionLabel(profileCompletion)}
                  </h2>
                </div>
                <p className="shrink-0 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {profileCompletion}
                  <span className="ml-0.5 text-sm font-medium text-white/55">
                    %
                  </span>
                </p>
              </div>
              <ContrastProgress value={profileCompletion} className="mt-5" />
              <p className="mt-4 text-xs leading-6 text-white/65">
                Complete your account information and verify your email to keep
                your profile ready for projects.
              </p>
            </section>
            <ProfileChecklist profile={profileUser} />
            <section
              className={["rounded-2xl border p-5", quietSurface].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-complete/[0.08] text-status-complete-foreground">
                  <ShieldCheckIcon size={15} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Keep your details current
                  </p>
                  <p className="mt-1 text-[0.625rem] leading-5 text-muted-foreground">
                    Accurate and verified information improves account security
                    and keeps project communication reliable.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <ProfilePictureDialog
        open={avatarEditorOpen}
        currentAvatar={profileUser.avatarUrl ?? undefined}
        preview={avatarPreview}
        initials={initials}
        file={avatarFile}
        progress={avatarProgress}
        uploading={uploadingAvatar}
        error={avatarError}
        inputRef={avatarInputRef}
        onClose={closeAvatarEditor}
        onChoose={() => avatarInputRef.current?.click()}
        onChange={handleAvatarChange}
        onClear={clearAvatarSelection}
        onUpload={() => void uploadProfilePicture()}
      />
    </div>
  );
}
function ProfilePictureDialog({
  open,
  currentAvatar,
  preview,
  initials,
  file,
  progress,
  uploading,
  error,
  inputRef,
  onClose,
  onChoose,
  onChange,
  onClear,
  onUpload,
}: {
  open: boolean;
  currentAvatar?: string;
  preview: string | null;
  initials: string;
  file: File | null;
  progress: number;
  uploading: boolean;
  error: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onChoose: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onUpload: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/35 px-4 py-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !uploading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-picture-title"
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/65 bg-card p-5 text-card-foreground shadow-lg shadow-black/[0.07] sm:p-6 dark:border-border dark:bg-card dark:shadow-black/25"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Profile image
            </p>
            <h2
              id="profile-picture-title"
              className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground"
            >
              Update profile picture
            </h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Choose a JPEG, PNG or WebP image up to 5 MB.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={uploading}
            className={["h-8 w-8 shrink-0 rounded-lg", quietIconButton].join(
              " ",
            )}
            aria-label="Close profile picture editor"
          >
            <XIcon size={14} />
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onChange}
          disabled={uploading}
        />
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-28 w-28 border border-border/70 bg-transparent">
              <AvatarImage
                src={preview ?? currentAvatar}
                alt="Profile picture preview"
                className="object-cover"
              />
              <AvatarFallback className="bg-brand-secondary-highlight/[0.08] text-2xl font-semibold text-brand-secondary-highlight dark:bg-secondary/[0.08] dark:text-secondary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={onChoose}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-lg border-[3px] border-card bg-brand-secondary-highlight text-primary-foreground transition-opacity duration-150 hover:opacity-85 disabled:pointer-events-none disabled:opacity-60 dark:bg-secondary dark:text-secondary-foreground"
              aria-label="Choose profile picture"
            >
              <CameraIcon size={15} />
            </button>
          </div>
          {file ? (
            <div
              className={[
                "mt-5 w-full rounded-xl border px-4 py-3.5",
                quietSurface,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    accentIconSurface,
                  ].join(" ")}
                >
                  <ImageIcon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[0.625rem] text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!uploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className={["h-8 w-8 rounded-lg", quietIconButton].join(
                      " ",
                    )}
                    aria-label="Clear selected image"
                  >
                    <Trash2Icon size={13} />
                  </Button>
                )}
              </div>
              {uploading && (
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[0.625rem] font-medium text-muted-foreground">
                      Uploading image
                    </p>
                    <p className="text-[0.625rem] tabular-nums text-muted-foreground">
                      {progress}%
                    </p>
                  </div>
                  <ThemeProgress value={progress} />
                </div>
              )}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onChoose}
              disabled={uploading}
              className={[
                "mt-5 h-10 rounded-lg px-4 text-xs font-semibold",
                secondaryButton,
              ].join(" ")}
            >
              <CameraIcon size={14} />
              Choose image
            </Button>
          )}
          {error && (
            <div className="w-full">
              <InlineError message={error} />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-border/45 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={uploading}
            className={[
              "h-10 rounded-lg px-4 text-xs font-semibold",
              secondaryButton,
            ].join(" ")}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onUpload}
            disabled={!file || uploading}
            className={[
              "h-10 rounded-lg px-4 text-xs font-semibold",
              primaryButton,
            ].join(" ")}
          >
            {uploading ? (
              <>
                <LoaderCircleIcon
                  size={14}
                  className="animate-spin motion-reduce:animate-none"
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
        </div>
      </div>
    </div>
  );
}
function ProfileChecklist({ profile }: { profile: ProfileUser }) {
  const items = [
    {
      label: "Full name",
      description: profile.fullName?.trim()
        ? profile.fullName
        : "Add your full name",
      complete: Boolean(profile.fullName?.trim()),
    },
    {
      label: "Email address",
      description: profile.email?.trim()
        ? profile.email
        : "Email not available",
      complete: Boolean(profile.email?.trim()),
    },
    {
      label: "Email verification",
      description: profile.emailConfirmed
        ? "Verified"
        : "Verification required",
      complete: Boolean(profile.emailConfirmed),
    },
    {
      label: "Phone number",
      description: profile.phoneNumber?.trim()
        ? profile.phoneNumber
        : "Add your phone number",
      complete: Boolean(profile.phoneNumber?.trim()),
    },
    {
      label: "Residence",
      description: profile.countryCode?.trim()
        ? formatResidence(profile)
        : profile.location?.trim()
          ? "Confirm your country and city"
          : "Add your residence",
      complete: Boolean(profile.countryCode?.trim()),
    },
    {
      label: "Profile picture",
      description: profile.avatarUrl ? "Added" : "Add a profile picture",
      complete: Boolean(profile.avatarUrl),
    },
  ];
  const completeCount = items.filter((item) => item.complete).length;
  return (
    <section
      className={["overflow-hidden rounded-2xl border", cardSurface].join(" ")}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/55 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              accentIconSurface,
            ].join(" ")}
          >
            <CheckIcon size={14} />
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Profile checklist
            </p>
            <p className="mt-0.5 text-[0.625rem] text-muted-foreground">
              Account essentials
            </p>
          </div>
        </div>
        <span className="text-[0.625rem] font-semibold text-muted-foreground">
          {completeCount}/{items.length}
        </span>
      </div>
      <div className="divide-y divide-border/45 px-5">
        {items.map((item) => (
          <ChecklistItem
            key={item.label}
            label={item.label}
            description={item.description}
            complete={item.complete}
          />
        ))}
      </div>
    </section>
  );
}
function ChecklistItem({
  label,
  description,
  complete,
}: {
  label: string;
  description: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          complete
            ? "bg-status-complete/[0.08] text-status-complete-foreground"
            : "bg-surface-3/70 text-muted-foreground dark:bg-surface-2",
        ].join(" ")}
      >
        {complete ? <CheckIcon size={12} /> : <CircleIcon size={11} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.625rem] font-medium text-muted-foreground">
          {label}
        </p>
        <p
          className={[
            "mt-0.5 truncate text-xs font-semibold",
            complete ? "text-foreground" : "text-status-pending-foreground",
          ].join(" ")}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
function EmailVerificationWarning({
  email,
  sending,
  error,
  onVerify,
}: {
  email?: string | null;
  sending: boolean;
  error: string | null;
  onVerify: () => Promise<void>;
}) {
  return (
    <section
      className="rounded-xl border border-status-pending/20 bg-status-pending/[0.045] px-4 py-4 sm:px-5"
      aria-label="Email verification required"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.12] text-status-pending-foreground">
            <MailCheckIcon size={15} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">
              Email verification required
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Confirm{" "}
              {email ? (
                <span className="font-medium text-foreground">{email}</span>
              ) : (
                "your email address"
              )}{" "}
              to complete your profile and keep your account information
              verified.
            </p>
            {error && (
              <div
                className="mt-3 flex items-start gap-2 text-xs text-destructive"
                role="alert"
              >
                <AlertCircleIcon size={13} className="mt-0.5 shrink-0" />
                <p className="leading-5">{error}</p>
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
      disabled={sending || disabled}
      className={[
        "shrink-0 rounded-lg text-xs font-semibold",
        secondaryButton,
        "disabled:border-border/60 disabled:bg-surface-2/20 disabled:text-muted-foreground disabled:opacity-60",
        size === "field" ? "h-11 px-4" : "h-9 px-3.5",
      ].join(" ")}
    >
      {sending ? (
        <>
          <LoaderCircleIcon
            size={13}
            className="animate-spin motion-reduce:animate-none"
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
function ThemeProgress({
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
        "bg-brand-secondary-highlight/[0.10] dark:bg-secondary/[0.10]",
        className,
      ].join(" ")}
      role="progressbar"
      aria-label="Progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className="h-full rounded-full bg-brand-secondary-highlight transition-[width] duration-200 ease-out motion-reduce:transition-none dark:bg-secondary"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
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
        "h-1.5 w-full overflow-hidden rounded-full bg-white/[0.12]",
        className,
      ].join(" ")}
      role="progressbar"
      aria-label="Account completion"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className="h-full rounded-full bg-secondary transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
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
        divided ? "border-t border-border/55 sm:border-l sm:border-t-0" : "",
      ].join(" ")}
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 flex min-w-0 items-baseline gap-1.5">
        <p className="truncate text-lg font-semibold tracking-[-0.03em] text-foreground sm:text-xl">
          {value}
        </p>
        {suffix && (
          <span className="truncate text-[0.625rem] font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
function ProfileSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={sectionSurface}>
      <div className="p-5 sm:p-6">
        <div className="mb-7 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-5 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {eyebrow}
            </p>
          </div>
          <h2 className="mt-2.5 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
function ProfileField({
  label,
  htmlFor,
  description,
  children,
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div>
        <Label
          htmlFor={htmlFor}
          className="text-xs font-semibold text-foreground"
        >
          {label}
        </Label>
        {description && (
          <p className="mt-1 text-[0.6875rem] leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
function AccountItem({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  status?: "success" | "pending";
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
          status === "success"
            ? accentIconSurface
            : "bg-surface-3/70 text-muted-foreground ring-1 ring-inset ring-border/35 dark:bg-surface-2",
        ].join(" ")}
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.625rem] font-medium text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
      {status && (
        <span
          className={[
            "shrink-0 rounded-md px-2 py-1 text-[0.625rem] font-semibold",
            status === "success"
              ? "bg-status-complete/[0.08] text-status-complete-foreground"
              : "bg-status-pending/[0.09] text-status-pending-foreground",
          ].join(" ")}
        >
          {status === "success" ? "Verified" : "Pending"}
        </span>
      )}
    </div>
  );
}
function FieldError({ message }: { message: string }) {
  return (
    <div
      className="flex items-start gap-2 text-xs text-destructive"
      role="alert"
    >
      <AlertCircleIcon size={13} className="mt-0.5 shrink-0" />
      <p className="leading-5">{message}</p>
    </div>
  );
}
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
function ProfileLoading() {
  return (
    <div className={["min-h-screen text-foreground", pageCanvas].join(" ")}>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-8">
        <div className={[profileSurface, "overflow-hidden"].join(" ")}>
          <div className="flex items-center gap-5 p-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-64 max-w-full" />
              <Skeleton className="h-4 w-80 max-w-full" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>
          </div>
          <div className="grid border-t border-border/55 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
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
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-60 rounded-2xl" />
          </div>
          <div className="hidden space-y-5 xl:block">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
function ProfileErrorPage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => Promise<void>;
}) {
  return (
    <div className={["min-h-screen text-foreground", pageCanvas].join(" ")}>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-20 sm:px-6 md:px-8">
        <div className={["max-w-md p-5 sm:p-6", profileSurface].join(" ")}>
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
function formatResidence(profile: ProfileUser) {
  if (profile.countryCode?.trim())
    return [
      profile.cityName?.trim(),
      profile.countryName?.trim() || profile.countryCode,
    ]
      .filter(Boolean)
      .join(", ");
  return profile.location?.trim() || "";
}
function getInitials(name?: string | null) {
  if (!name?.trim()) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
function getCompletionLabel(score: number) {
  if (score >= 100) return "Profile complete";
  if (score >= 80) return "Almost complete";
  if (score >= 50) return "Good progress";
  return "Complete your profile";
}
function formatDate(date?: string | null) {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}
function formatDateShort(date?: string | null) {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}
function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data;
  if (data && typeof data === "object") {
    if ("detail" in data && typeof data.detail === "string") return data.detail;
    if ("message" in data && typeof data.message === "string")
      return data.message;
    if ("title" in data && typeof data.title === "string") return data.title;
  }
  return fallback;
}
