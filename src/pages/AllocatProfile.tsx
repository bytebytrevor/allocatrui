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
import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CameraIcon,
  CheckCircle2Icon,
  Clock3Icon,
  Edit3Icon,
  EyeIcon,
  EyeOffIcon,
  FolderCheckIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  SaveIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserRoundIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

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

type EditingSection =
  | "account"
  | "about"
  | "skills"
  | "work"
  | null;

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

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function AllocatProfilePage() {
  const { refreshUser } = useAuth();

  const [accountProfile, setAccountProfile] =
    useState<ProfileUser | null>(null);

  const [allocatProfile, setAllocatProfile] =
    useState<MyAllocatProfile | null>(null);

  const [skillOptions, setSkillOptions] =
    useState<AllocatSkill[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] =
    useState(false);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const [skillCatalogError, setSkillCatalogError] =
    useState<string | null>(null);

  const [editingSection, setEditingSection] =
    useState<EditingSection>(null);

  const [savingSection, setSavingSection] =
    useState<EditingSection>(null);

  const [sectionError, setSectionError] =
    useState<string | null>(null);

  const [updatingVisibility, setUpdatingVisibility] =
    useState(false);

  const [accountDraft, setAccountDraft] =
    useState<AccountDraft>({
      fullName: "",
      phoneNumber: "",
      location: "",
    });

  const [professionalDraft, setProfessionalDraft] =
    useState<ProfessionalDraft>({
      idNumber: "",
      title: "",
      headline: "",
      bio: "",
      availability: "available",
      hourlyRate: "",
      currency: "USD",
      yearsExperience: "",
      skillIds: [],
    });

  const avatarInputRef =
    useRef<HTMLInputElement | null>(null);

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const [avatarProgress, setAvatarProgress] =
    useState(0);

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [avatarError, setAvatarError] =
    useState<string | null>(null);

  const loadSkillOptions = useCallback(async () => {
    try {
      setLoadingSkills(true);
      setSkillCatalogError(null);

      const response = await api.get<AllocatSkill[]>(
        "/skills",
        {
          withCredentials: true,
        },
      );

      setSkillOptions(response.data);
    } catch (error) {
      console.error(
        "Could not load skill catalogue:",
        error,
      );

      setSkillCatalogError(
        getApiErrorMessage(
          error,
          "The skill catalogue could not be loaded.",
        ),
      );
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      setPageError(null);

      const [
        accountResponse,
        allocatResponse,
      ] = await Promise.all([
        api.get<ProfileUser>("/profiles/me", {
          withCredentials: true,
        }),

        api.get<MyAllocatProfile>(
          "/allocats/profiles/me",
          {
            withCredentials: true,
          },
        ),
      ]);

      const account = accountResponse.data;
      const profile = allocatResponse.data;

      setAccountProfile(account);
      setAllocatProfile(profile);

      setAccountDraft(toAccountDraft(account));
      setProfessionalDraft(
        toProfessionalDraft(profile),
      );

      void loadSkillOptions();
    } catch (error) {
      console.error(
        "Could not load Allocat profile:",
        error,
      );

      setPageError(
        getApiErrorMessage(
          error,
          "Your Allocat profile could not be loaded.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [loadSkillOptions]);

  useEffect(() => {
    void fetchPageData();
  }, [fetchPageData]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const allSkillOptions = useMemo(() => {
    const map = new Map<string, AllocatSkill>();

    skillOptions.forEach((skill) => {
      map.set(skill.id, skill);
    });

    allocatProfile?.skills.forEach((skill) => {
      map.set(skill.id, skill);
    });

    return Array.from(map.values()).sort(
      (a, b) => a.name.localeCompare(b.name),
    );
  }, [allocatProfile?.skills, skillOptions]);

  const selectedSkills = useMemo(
    () =>
      professionalDraft.skillIds
        .map((skillId) =>
          allSkillOptions.find(
            (skill) => skill.id === skillId,
          ),
        )
        .filter(
          (skill): skill is AllocatSkill =>
            Boolean(skill),
        ),
    [
      allSkillOptions,
      professionalDraft.skillIds,
    ],
  );

  const initials = useMemo(
    () =>
      getInitials(
        accountProfile?.fullName ??
          allocatProfile?.fullName,
      ),
    [
      accountProfile?.fullName,
      allocatProfile?.fullName,
    ],
  );

  const displayedAvatar =
    avatarPreview ??
    accountProfile?.avatarUrl ??
    allocatProfile?.avatarUrl ??
    undefined;

  function updateProfessionalDraft<
    K extends keyof ProfessionalDraft,
  >(
    key: K,
    value: ProfessionalDraft[K],
  ) {
    setProfessionalDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEditing(
    section: Exclude<EditingSection, null>,
  ) {
    if (savingSection) {
      return;
    }

    setSectionError(null);
    setEditingSection(section);
  }

  function cancelEditing() {
    if (accountProfile) {
      setAccountDraft(
        toAccountDraft(accountProfile),
      );
    }

    if (allocatProfile) {
      setProfessionalDraft(
        toProfessionalDraft(allocatProfile),
      );
    }

    clearAvatarSelection();
    setSectionError(null);
    setEditingSection(null);
  }

  async function saveAccount(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!accountDraft.fullName.trim()) {
      setSectionError(
        "Enter your full name before saving.",
      );
      return;
    }

    try {
      setSavingSection("account");
      setSectionError(null);

      const response = await api.patch<ProfileUser>(
        "/profiles/me",
        {
          fullName: accountDraft.fullName.trim(),
          phoneNumber:
            accountDraft.phoneNumber.trim() || null,
          location:
            accountDraft.location.trim() || null,
        },
        {
          withCredentials: true,
        },
      );

      setAccountProfile(response.data);
      setAccountDraft(
        toAccountDraft(response.data),
      );

      await refreshUser();

      setEditingSection(null);

      toast.success("Account details updated");
    } catch (error) {
      console.error(
        "Could not update account:",
        error,
      );

      setSectionError(
        getApiErrorMessage(
          error,
          "Your account details could not be saved.",
        ),
      );
    } finally {
      setSavingSection(null);
    }
  }

  async function saveProfessionalSection(
    section: Exclude<
      EditingSection,
      "account" | null
    >,
  ) {
    const validationError =
      validateProfessionalDraft(
        professionalDraft,
      );

    if (validationError) {
      setSectionError(validationError);
      return;
    }

    const payload =
      buildProfessionalPayload(
        professionalDraft,
      );

    try {
      setSavingSection(section);
      setSectionError(null);

      const response =
        await api.put<MyAllocatProfile>(
          "/allocats/profiles/me",
          payload,
          {
            withCredentials: true,
          },
        );

      setAllocatProfile(response.data);
      setProfessionalDraft(
        toProfessionalDraft(response.data),
      );

      setEditingSection(null);

      toast.success("Allocat profile updated", {
        description:
          "Your professional information has been saved.",
      });
    } catch (error) {
      console.error(
        "Could not update Allocat profile:",
        error,
      );

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

  async function toggleVisibility() {
    if (
      !allocatProfile ||
      updatingVisibility
    ) {
      return;
    }

    const nextVisibility =
      !allocatProfile.isVisible;

    try {
      setUpdatingVisibility(true);

      await api.patch(
        "/allocats/profiles/me/visibility",
        {
          isVisible: nextVisibility,
        },
        {
          withCredentials: true,
        },
      );

      setAllocatProfile((current) =>
        current
          ? {
              ...current,
              isVisible: nextVisibility,
            }
          : current,
      );

      toast.success(
        nextVisibility
          ? "Profile is now visible"
          : "Profile is now hidden",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Profile visibility could not be updated.",
        ),
      );
    } finally {
      setUpdatingVisibility(false);
    }
  }

  function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setAvatarError(null);

    if (!file) {
      return;
    }

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError(
        "Choose a JPEG, PNG or WebP image.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError(
        "The image must be smaller than 5 MB.",
      );

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

      setAccountProfile((current) =>
        current
          ? {
              ...current,
              avatarUrl:
                response.data.avatarUrl,
            }
          : current,
      );

      setAllocatProfile((current) =>
        current
          ? {
              ...current,
              avatarUrl:
                response.data.avatarUrl,
            }
          : current,
      );

      await refreshUser();

      clearAvatarSelection();

      toast.success(
        "Profile picture updated",
      );
    } catch (error) {
      console.error(
        "Could not upload profile picture:",
        error,
      );

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

  if (loading) {
    return <AllocatProfileSkeleton />;
  }

  if (
    pageError ||
    !accountProfile ||
    !allocatProfile
  ) {
    return (
      <AllocatProfileError
        message={
          pageError ??
          "Your profile could not be loaded."
        }
        onRetry={fetchPageData}
      />
    );
  }

  const rating = allocatProfile.rating;
  const completedProjects =
    allocatProfile.completedProjects;

  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <main className="container mx-auto px-5 py-8 md:px-8 lg:py-12">
        <section className="pb-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative w-fit shrink-0">
                <Avatar className="h-24 w-24 border border-border bg-muted/30 sm:h-28 sm:w-28">
                  <AvatarImage
                    src={displayedAvatar}
                    alt={`${accountProfile.fullName}'s profile`}
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-primary/[0.08] text-2xl font-black text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {allocatProfile.verified && (
                  <span
                    className={[
                      "absolute -bottom-1 -right-1",
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-lg border-[3px] border-background",
                      "bg-primary text-primary-foreground",
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
                    onClick={() =>
                      avatarInputRef.current?.click()
                    }
                    className={[
                      "absolute -left-1 -top-1",
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-lg border border-border bg-background",
                      "text-muted-foreground shadow-sm",
                      "transition-colors hover:text-primary",
                    ].join(" ")}
                    aria-label="Change profile picture"
                  >
                    <CameraIcon size={14} />
                  </button>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-primary">
                    Professional profile
                  </p>

                  <span className="rounded-md bg-primary/[0.07] px-2 py-1 text-[0.6rem] font-semibold text-primary">
                    Level {allocatProfile.level}
                  </span>
                </div>

                <h1 className="mt-2 break-words text-3xl font-black leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
                  {accountProfile.fullName}
                </h1>

                <p className="mt-2 text-sm font-semibold text-foreground/80 sm:text-base">
                  {allocatProfile.title ||
                    "Professional service provider"}
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
                      "Location not listed"}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        allocatProfile.availability
                          ? "bg-emerald-500"
                          : "bg-muted-foreground/40",
                      ].join(" ")}
                    />

                    {formatAvailability(
                      allocatProfile.availabilityStatus,
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock3Icon size={13} />

                    {formatResponseTime(
                      allocatProfile.responseTime,
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void toggleVisibility()
                }
                disabled={updatingVisibility}
                className="h-10 rounded-lg bg-transparent px-4 text-xs font-semibold shadow-none"
              >
                {updatingVisibility ? (
                  <LoaderCircleIcon
                    size={14}
                    className="animate-spin"
                  />
                ) : allocatProfile.isVisible ? (
                  <EyeIcon size={14} />
                ) : (
                  <EyeOffIcon size={14} />
                )}

                {allocatProfile.isVisible
                  ? "Visible"
                  : "Hidden"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  startEditing("account")
                }
                className="h-10 w-10 rounded-lg text-muted-foreground shadow-none hover:text-primary"
                aria-label="Edit account details"
              >
                <Edit3Icon size={15} />
              </Button>
            </div>
          </div>

          {editingSection === "account" && (
            <form
              onSubmit={saveAccount}
              className="mt-7 rounded-xl border border-border bg-muted/[0.08] p-5"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold">
                    Account details
                  </p>

                  <p className="mt-1 text-[0.66rem] leading-5 text-muted-foreground">
                    These details belong to your main
                    Allocatr account.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={cancelEditing}
                  className="h-8 w-8 rounded-lg"
                >
                  <XIcon size={14} />
                </Button>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ProfileField label="Full name">
                  <div className="relative">
                    <UserRoundIcon
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      value={accountDraft.fullName}
                      onChange={(event) =>
                        setAccountDraft(
                          (current) => ({
                            ...current,
                            fullName:
                              event.target.value,
                          }),
                        )
                      }
                      className="h-11 rounded-lg !bg-transparent pl-10 shadow-none"
                    />
                  </div>
                </ProfileField>

                <ProfileField label="Phone number">
                  <Input
                    type="tel"
                    value={accountDraft.phoneNumber}
                    placeholder="+263..."
                    onChange={(event) =>
                      setAccountDraft(
                        (current) => ({
                          ...current,
                          phoneNumber:
                            event.target.value,
                        }),
                      )
                    }
                    className="h-11 rounded-lg !bg-transparent shadow-none"
                  />
                </ProfileField>

                <ProfileField label="Location">
                  <Input
                    value={accountDraft.location}
                    placeholder="City, country"
                    onChange={(event) =>
                      setAccountDraft(
                        (current) => ({
                          ...current,
                          location:
                            event.target.value,
                        }),
                      )
                    }
                    className="h-11 rounded-lg !bg-transparent shadow-none"
                  />
                </ProfileField>

                <ProfileField label="Email">
                  <div className="relative">
                    <MailIcon
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      value={
                        accountProfile.email ?? ""
                      }
                      disabled
                      className="h-11 rounded-lg !bg-muted/[0.2] pl-10 pr-10 text-muted-foreground shadow-none disabled:opacity-100"
                    />

                    <LockKeyholeIcon
                      size={13}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
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
              />

              {avatarFile && (
                <div className="mt-5 rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <CameraIcon
                      size={15}
                      className="text-primary"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {avatarFile.name}
                      </p>
                    </div>

                    {!uploadingAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearAvatarSelection}
                        className="h-8 w-8 rounded-lg"
                      >
                        <Trash2Icon size={13} />
                      </Button>
                    )}

                    <Button
                      type="button"
                      onClick={() =>
                        void uploadAvatar()
                      }
                      disabled={uploadingAvatar}
                      className="h-8 rounded-lg px-3 text-xs shadow-none"
                    >
                      {uploadingAvatar
                        ? `${avatarProgress}%`
                        : "Upload"}
                    </Button>
                  </div>

                  {avatarError && (
                    <InlineError
                      message={avatarError}
                    />
                  )}
                </div>
              )}

              {sectionError && (
                <InlineError
                  message={sectionError}
                />
              )}

              <SectionActions
                saving={
                  savingSection === "account"
                }
                onCancel={cancelEditing}
                submit
              />
            </form>
          )}

          <div className="mt-8 border-y border-border bg-border">
            <div className="grid gap-px sm:grid-cols-2 xl:grid-cols-4">
              <ProfileStat
                label="Hourly rate"
                value={
                  allocatProfile.hourlyRate !== null
                    ? formatMoney(
                        allocatProfile.hourlyRate,
                        allocatProfile.currency,
                      )
                    : "Not set"
                }
                suffix="/hour"
              />

              <ProfileStat
                label="Experience"
                value={
                  allocatProfile.yearsExperience ??
                  "—"
                }
                suffix={
                  allocatProfile.yearsExperience === 1
                    ? "year"
                    : "years"
                }
              />

              <ProfileStat
                label="Rating"
                value={
                  rating > 0
                    ? rating.toFixed(1)
                    : "New"
                }
                suffix={
                  allocatProfile.ratingCount > 0
                    ? `${allocatProfile.ratingCount} reviews`
                    : undefined
                }
              />

              <ProfileStat
                label="Completed"
                value={completedProjects}
                suffix={
                  completedProjects === 1
                    ? "project"
                    : "projects"
                }
              />
            </div>
          </div>
        </section>

        <div className="grid items-start gap-10 pt-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
          <div className="min-w-0">
            <ProfileSection
              eyebrow="Overview"
              title={`About ${getFirstName(
                accountProfile.fullName,
              )}`}
              editing={editingSection === "about"}
              onEdit={() =>
                startEditing("about")
              }
              onCancel={cancelEditing}
            >
              {editingSection === "about" ? (
                <div className="max-w-3xl">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Professional title">
                      <Input
                        value={
                          professionalDraft.title
                        }
                        maxLength={120}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "title",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent shadow-none"
                      />
                    </ProfileField>

                    <ProfileField label="Headline">
                      <Input
                        value={
                          professionalDraft.headline
                        }
                        maxLength={180}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "headline",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent shadow-none"
                      />
                    </ProfileField>
                  </div>

                  <div className="mt-5">
                    <ProfileField label="Professional bio">
                      <Textarea
                        value={
                          professionalDraft.bio
                        }
                        maxLength={500}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "bio",
                            event.target.value,
                          )
                        }
                        className="min-h-40 resize-none rounded-xl !bg-transparent leading-7 shadow-none"
                      />
                    </ProfileField>
                  </div>

                  {!allocatProfile.verified && (
                    <div className="mt-5 border-t border-border pt-5">
                      <ProfileField label="ID number">
                        <Input
                          value={
                            professionalDraft.idNumber
                          }
                          maxLength={50}
                          onChange={(event) =>
                            updateProfessionalDraft(
                              "idNumber",
                              event.target.value,
                            )
                          }
                          className="h-11 rounded-lg !bg-transparent shadow-none"
                        />

                        <p className="mt-2 text-[0.62rem] text-muted-foreground">
                          Private. This is not shown to clients.
                        </p>
                      </ProfileField>
                    </div>
                  )}

                  {sectionError && (
                    <InlineError
                      message={sectionError}
                    />
                  )}

                  <SectionActions
                    saving={
                      savingSection === "about"
                    }
                    onSave={() =>
                      void saveProfessionalSection(
                        "about",
                      )
                    }
                    onCancel={cancelEditing}
                  />
                </div>
              ) : (
                <div className="max-w-3xl">
                  {allocatProfile.title && (
                    <p className="text-sm font-bold">
                      {allocatProfile.title}
                    </p>
                  )}

                  {allocatProfile.headline && (
                    <p className="mt-2 text-sm font-medium leading-7 text-foreground/75">
                      {allocatProfile.headline}
                    </p>
                  )}

                  <p className="mt-4 whitespace-pre-line text-sm leading-8 text-muted-foreground sm:text-[0.95rem]">
                    {allocatProfile.bio ||
                      "Add a professional introduction so clients can understand the work you do best."}
                  </p>
                </div>
              )}
            </ProfileSection>

            <ProfileSection
              eyebrow="Expertise"
              title="Skills"
              divided
              editing={editingSection === "skills"}
              onEdit={() =>
                startEditing("skills")
              }
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
                        skills.map(
                          (skill) => skill.id,
                        ),
                      )
                    }
                  />

                  {sectionError && (
                    <InlineError
                      message={sectionError}
                    />
                  )}

                  <SectionActions
                    saving={
                      savingSection === "skills"
                    }
                    onSave={() =>
                      void saveProfessionalSection(
                        "skills",
                      )
                    }
                    onCancel={cancelEditing}
                  />
                </div>
              ) : (
                <div className="flex max-w-3xl flex-wrap gap-2">
                  {allocatProfile.skills.map(
                    (skill) => (
                      <span
                        key={skill.id}
                        className="rounded-lg bg-primary/[0.07] px-3 py-1.5 text-xs font-semibold text-primary"
                      >
                        {skill.name}
                      </span>
                    ),
                  )}
                </div>
              )}
            </ProfileSection>

            <ProfileSection
              eyebrow="Professional"
              title="Working details"
              divided
              editing={editingSection === "work"}
              onEdit={() =>
                startEditing("work")
              }
              onCancel={cancelEditing}
            >
              {editingSection === "work" ? (
                <div className="max-w-3xl">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Availability">
                      <select
                        value={
                          professionalDraft.availability
                        }
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "availability",
                            event.target
                              .value as AllocatAvailability,
                          )
                        }
                        className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm outline-none focus:border-primary/40"
                      >
                        <option value="available">
                          Available
                        </option>
                        <option value="busy">
                          Busy
                        </option>
                        <option value="unavailable">
                          Unavailable
                        </option>
                      </select>
                    </ProfileField>

                    <ProfileField label="Years of experience">
                      <Input
                        type="number"
                        min={0}
                        max={80}
                        value={
                          professionalDraft.yearsExperience
                        }
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "yearsExperience",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent shadow-none"
                      />
                    </ProfileField>

                    <ProfileField label="Hourly rate">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={
                          professionalDraft.hourlyRate
                        }
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "hourlyRate",
                            event.target.value,
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent shadow-none"
                      />
                    </ProfileField>

                    <ProfileField label="Currency">
                      <Input
                        value={
                          professionalDraft.currency
                        }
                        maxLength={3}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "currency",
                            event.target.value.toUpperCase(),
                          )
                        }
                        className="h-11 rounded-lg !bg-transparent uppercase shadow-none"
                      />
                    </ProfileField>
                  </div>

                  {sectionError && (
                    <InlineError
                      message={sectionError}
                    />
                  )}

                  <SectionActions
                    saving={
                      savingSection === "work"
                    }
                    onSave={() =>
                      void saveProfessionalSection(
                        "work",
                      )
                    }
                    onCancel={cancelEditing}
                  />
                </div>
              ) : (
                <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={BriefcaseBusinessIcon}
                    label="Experience"
                    value={
                      allocatProfile.yearsExperience !==
                      null
                        ? `${allocatProfile.yearsExperience} ${
                            allocatProfile.yearsExperience ===
                            1
                              ? "year"
                              : "years"
                          }`
                        : "Not specified"
                    }
                  />

                  <DetailItem
                    icon={MapPinIcon}
                    label="Location"
                    value={
                      accountProfile.location ||
                      "Not listed"
                    }
                  />

                  <DetailItem
                    icon={Clock3Icon}
                    label="Availability"
                    value={formatAvailability(
                      allocatProfile.availabilityStatus,
                    )}
                  />

                  <DetailItem
                    icon={FolderCheckIcon}
                    label="Completed work"
                    value={`${completedProjects} ${
                      completedProjects === 1
                        ? "project"
                        : "projects"
                    }`}
                  />
                </div>
              )}
            </ProfileSection>

            <ProfileSection
              eyebrow="Work history"
              title="Completed projects"
              divided
            >
              {allocatProfile.projects.length > 0 ? (
                <div className="max-w-3xl divide-y divide-border border-y border-border">
                  {allocatProfile.projects.map(
                    (project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 py-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                          <FolderCheckIcon
                            size={15}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {project.title}
                          </p>

                          <p className="mt-1 text-[0.62rem] text-muted-foreground">
                            {project.category} ·{" "}
                            {project.projectCode}
                          </p>
                        </div>

                        <span className="text-[0.6rem] font-semibold capitalize text-muted-foreground">
                          {project.status}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <EmptyHistory />
              )}
            </ProfileSection>

            <ProfileSection
              eyebrow="Trust"
              title="Verification"
              divided
              last
            >
              <div className="grid gap-3 md:grid-cols-3">
                <VerificationItem
                  icon={ShieldCheckIcon}
                  title="Identity"
                  description="Professional identity"
                  status={
                    allocatProfile.verified
                      ? "Verified"
                      : "Pending"
                  }
                  verified={
                    allocatProfile.verified
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

                <VerificationItem
                  icon={EyeIcon}
                  title="Visibility"
                  description="Client discovery"
                  status={
                    allocatProfile.isVisible
                      ? "Visible"
                      : "Hidden"
                  }
                  verified={
                    allocatProfile.isVisible
                  }
                />
              </div>
            </ProfileSection>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-24">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-primary">
                    Professional score
                  </p>

                  <h2 className="mt-2 text-lg font-black tracking-[-0.025em]">
                    {getScoreLabel(
                      allocatProfile.professionalScore,
                    )}
                  </h2>
                </div>

                <span className="text-2xl font-black tracking-[-0.04em] text-primary">
                  {allocatProfile.professionalScore}%
                </span>
              </div>

              <Progress
                value={
                  allocatProfile.professionalScore
                }
                className="mt-5 h-1.5"
              />

              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                Complete your professional information,
                skills and verified details, then build
                your reputation through completed work.
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
                    Current working setup
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <SidebarDetail
                  label="Availability"
                  value={formatAvailability(
                    allocatProfile.availabilityStatus,
                  )}
                />

                <SidebarDetail
                  label="Response"
                  value={formatResponseTime(
                    allocatProfile.responseTime,
                  )}
                />

                <SidebarDetail
                  label="Rate"
                  value={
                    allocatProfile.hourlyRate !== null
                      ? `${formatMoney(
                          allocatProfile.hourlyRate,
                          allocatProfile.currency,
                        )}/hr`
                      : "Not set"
                  }
                  strong
                />

                <SidebarDetail
                  label="Joined"
                  value={formatShortDate(
                    allocatProfile.joinedAt,
                  )}
                />
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-border/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold">
                    Public profile
                  </p>

                  <p className="mt-1 text-[0.64rem] leading-5 text-muted-foreground">
                    Control whether clients can discover
                    your profile.
                  </p>
                </div>

                {allocatProfile.isVisible ? (
                  <EyeIcon
                    size={16}
                    className="text-primary"
                  />
                ) : (
                  <EyeOffIcon
                    size={16}
                    className="text-muted-foreground"
                  />
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  void toggleVisibility()
                }
                disabled={updatingVisibility}
                className="mt-4 h-9 w-full rounded-lg bg-transparent text-xs shadow-none"
              >
                {updatingVisibility && (
                  <LoaderCircleIcon
                    size={13}
                    className="animate-spin"
                  />
                )}

                {allocatProfile.isVisible
                  ? "Hide profile"
                  : "Make profile visible"}
              </Button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

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
        divided
          ? "border-t border-border/50 pt-9"
          : "",
        !last ? "pb-10" : "",
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

        {onEdit && !editing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-9 w-9 rounded-lg text-muted-foreground shadow-none hover:text-primary"
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
            className="h-9 w-9 rounded-lg text-muted-foreground shadow-none"
          >
            <XIcon size={14} />
          </Button>
        )}
      </div>

      {children}
    </section>
  );
}

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
    <div className="mt-6 flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        disabled={saving}
        className="h-9 rounded-lg px-4 text-xs shadow-none"
      >
        Cancel
      </Button>

      <Button
        type={submit ? "submit" : "button"}
        onClick={
          submit
            ? undefined
            : onSave
        }
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
            <SaveIcon size={13} />
            Save
          </>
        )}
      </Button>
    </div>
  );
}

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-semibold">
        {label}
      </Label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

function ProfileStat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: ReactNode;
  suffix?: ReactNode;
}) {
  return (
    <div className="min-w-0 bg-background px-5 py-4">
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <p className="truncate text-xl font-black tracking-[-0.04em]">
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

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/75 px-4 py-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
        <Icon size={14} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.6rem] text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

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
    <div className="rounded-xl border border-border/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-lg",
            verified
              ? "bg-primary/[0.07] text-primary"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          <Icon size={14} />
        </span>

        <span
          className={[
            "text-[0.58rem] font-semibold",
            verified
              ? "text-primary"
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
    <div className="grid grid-cols-[82px_minmax(0,1fr)] gap-3">
      <p className="text-[0.62rem] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "break-words text-right text-xs",
          strong
            ? "font-black text-primary"
            : "font-semibold",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="max-w-3xl rounded-xl border border-dashed border-border px-5 py-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FolderCheckIcon size={15} />
        </span>

        <div>
          <p className="text-sm font-semibold">
            No completed projects yet
          </p>

          <p className="mt-1 max-w-lg text-xs leading-6 text-muted-foreground">
            Completed work and client feedback will
            build your professional history here.
          </p>
        </div>
      </div>
    </div>
  );
}

function InlineError({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="mt-4 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-4 py-3 text-xs leading-5 text-destructive"
      role="alert"
    >
      {message}
    </div>
  );
}

function AllocatProfileError({
  message,
  onRetry,
}: {
  message: string;
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
          <ShieldCheckIcon
            size={24}
            className="mx-auto text-muted-foreground"
          />

          <h1 className="mt-5 text-xl font-black">
            Could not load your profile
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {message}
          </p>

          <Button
            type="button"
            onClick={() => void onRetry()}
            className="mt-6 h-10 rounded-lg px-5 text-xs shadow-none"
          >
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}

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

        <div className="mt-8 grid gap-px border-y border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="bg-background px-5 py-4"
            >
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-3 h-6 w-24" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-10">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>

          <div className="hidden space-y-5 xl:block">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

function toAccountDraft(
  account: ProfileUser,
): AccountDraft {
  return {
    fullName: account.fullName ?? "",
    phoneNumber: account.phoneNumber ?? "",
    location: account.location ?? "",
  };
}

function toProfessionalDraft(
  profile: MyAllocatProfile,
): ProfessionalDraft {
  return {
    idNumber: profile.idNumber ?? "",
    title: profile.title ?? "",
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    availability: profile.availabilityStatus,
    hourlyRate:
      profile.hourlyRate?.toString() ?? "",
    currency: profile.currency || "USD",
    yearsExperience:
      profile.yearsExperience?.toString() ?? "",
    skillIds: profile.skills.map(
      (skill) => skill.id,
    ),
  };
}

function buildProfessionalPayload(
  draft: ProfessionalDraft,
): UpdateAllocatProfilePayload {
  return {
    idNumber: draft.idNumber.trim(),
    title: cleanOptional(draft.title),
    headline: cleanOptional(draft.headline),
    bio: cleanOptional(draft.bio),
    hourlyRate: parseNullableNumber(
      draft.hourlyRate,
    ),
    currency: draft.currency
      .trim()
      .toUpperCase(),
    availability: draft.availability,
    yearsExperience: parseNullableNumber(
      draft.yearsExperience,
    ),
    skillIds: draft.skillIds,
  };
}

function validateProfessionalDraft(
  draft: ProfessionalDraft,
) {
  if (!draft.idNumber.trim()) {
    return "ID number is required.";
  }

  if (draft.skillIds.length === 0) {
    return "Select at least one skill.";
  }

  if (
    !/^[A-Za-z]{3}$/.test(
      draft.currency.trim(),
    )
  ) {
    return "Currency must use a three-letter code such as USD.";
  }

  const hourlyRate = parseNullableNumber(
    draft.hourlyRate,
  );

  if (hourlyRate !== null && hourlyRate < 0) {
    return "Hourly rate cannot be negative.";
  }

  const yearsExperience = parseNullableNumber(
    draft.yearsExperience,
  );

  if (
    yearsExperience !== null &&
    (yearsExperience < 0 ||
      yearsExperience > 80)
  ) {
    return "Years of experience must be between 0 and 80.";
  }

  return null;
}

function cleanOptional(value: string) {
  return value.trim() || null;
}

function parseNullableNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
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
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

function getFirstName(
  name?: string | null,
) {
  return (
    name?.trim().split(/\s+/)[0] ||
    "this Allocat"
  );
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

function formatAvailability(
  availability: AllocatAvailability,
) {
  return availability.charAt(0).toUpperCase() +
    availability.slice(1);
}

function formatResponseTime(
  minutes: number | null,
) {
  if (minutes === null) {
    return "Response time unavailable";
  }

  if (minutes < 60) {
    return `${minutes} min response`;
  }

  const hours = Math.round(minutes / 60);

  return `${hours} ${
    hours === 1 ? "hour" : "hours"
  } response`;
}

function formatMoney(
  value: number,
  currency: string,
) {
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

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (data && typeof data === "object") {
    if (
      "detail" in data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }

    if (
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    if (
      "title" in data &&
      typeof data.title === "string"
    ) {
      return data.title;
    }
  }

  return fallback;
}

export default AllocatProfilePage;