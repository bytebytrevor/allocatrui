import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { isAxiosError } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  BanknoteIcon,
  BriefcaseBusinessIcon,
  CameraIcon,
  CircleDollarSignIcon,
  Clock3Icon,
  DownloadIcon,
  Edit3Icon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
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
  UploadIcon,
  UserRoundIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import type {
  AllocatAvailability,
  AllocatSkill,
  MyAllocatProfile as BaseMyAllocatProfile,
  UpdateAllocatProfilePayload as BaseUpdateAllocatProfilePayload,
} from "@/Types/allocatProfile";
import type { ProfileUser } from "@/Types/profileUser";
import DashboardMainNav from "@/components/DashboardMainNav";
import SkillPicker from "@/components/allocat-profile/SkillPicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

// Additive response fields allow older profiles to load before location confirmation.
type MyAllocatProfile = BaseMyAllocatProfile & {
  operatingCountryCode?: string | null;
  operatingCityId?: number | null;
  operatingCountryName?: string | null;
  operatingCityName?: string | null;
};
type UpdateAllocatProfilePayload = BaseUpdateAllocatProfilePayload & {
  operatingCountryCode?: string;
  operatingCityId?: number;
};
type CountryOption = {
  code: string;
  name: string;
  supportsAllocatOperations: boolean;
};
type CityOption = { id: number; name: string; countryCode: string };
type EditingSection = "account" | "about" | "skills" | "work" | null;
type AccountDraft = {
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  cityName: string;
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
  operatingCountryCode: string;
  operatingCityId: string;
};
type IncompleteProfileItem = {
  key: string;
  label: string;
  section: Exclude<EditingSection, null>;
};
type UserDocumentType =
  | "Identity"
  | "Qualification"
  | "Certification"
  | "ProfessionalLicense"
  | "Training"
  | "Other";
type ProfessionalDocumentType = Exclude<UserDocumentType, "Identity">;
type UserDocumentReviewStatus = "Pending" | "Approved" | "Rejected";
type UserDocumentDto = {
  id: string;
  documentType: UserDocumentType;
  reviewStatus: UserDocumentReviewStatus;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  reviewedAt: string | null;
};
type ApiUserDocumentDto = Omit<
  UserDocumentDto,
  "documentType" | "reviewStatus"
> & { documentType: unknown; reviewStatus: unknown };
type DocumentPreviewState = {
  document: UserDocumentDto;
  url: string | null;
  loading: boolean;
  error: string | null;
};
type CompletedProject = MyAllocatProfile["projects"][number];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const MAX_PROFESSIONAL_DOCUMENTS = 8;
const COMPLETED_PROJECT_PREVIEW_COUNT = 4;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const PROFESSIONAL_DOCUMENT_OPTIONS: Array<{
  value: ProfessionalDocumentType;
  label: string;
}> = [
  { value: "Qualification", label: "Qualification" },
  { value: "Certification", label: "Certification" },
  { value: "ProfessionalLicense", label: "Professional licence" },
  { value: "Training", label: "Training" },
  { value: "Other", label: "Other professional document" },
];
const CREATE_PROFILE_ROUTE = "/allocats/profile/create";
const REGULAR_PROFILE_ROUTE = "/profile";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";
const primaryButton =
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground shadow-none transition-opacity duration-150 hover:border-brand-secondary-highlight/15 hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground dark:hover:border-secondary/10 dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:hover:opacity-90 dark:focus-visible:ring-secondary/20 motion-reduce:transition-none";
const secondaryButton =
  "border border-border/65 bg-surface-2/35 text-foreground/75 shadow-none transition-opacity duration-150 hover:border-border/65 hover:bg-surface-2/35 hover:text-foreground/75 hover:opacity-75 focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-border dark:bg-surface-2/65 dark:text-foreground/75 dark:hover:border-border dark:hover:bg-surface-2/65 dark:hover:text-foreground/75 dark:hover:opacity-75 dark:focus-visible:ring-secondary/15 motion-reduce:transition-none";
const quietIconButton =
  "bg-transparent text-muted-foreground shadow-none transition-opacity duration-150 hover:bg-transparent hover:text-foreground hover:opacity-70 motion-reduce:transition-none " +
  focus;
const fieldClass =
  "h-11 rounded-lg border-border/70 bg-surface-1/70 shadow-none transition-[border-color,box-shadow,background-color] focus-visible:border-brand-secondary-highlight/35 focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/20 dark:bg-surface-2/35 dark:focus-visible:border-secondary/25 dark:focus-visible:ring-secondary/15 motion-reduce:transition-none";
const disabledFieldClass =
  "h-11 rounded-lg border-border/60 bg-surface-2/50 font-medium text-muted-foreground shadow-none disabled:cursor-not-allowed disabled:opacity-100 disabled:text-muted-foreground dark:bg-surface-2/65";
const selectTriggerClass =
  "h-11 w-full rounded-lg border-border/70 bg-surface-1/70 px-3.5 text-sm text-foreground shadow-none transition-[border-color,box-shadow,background-color] focus:ring-1 focus:ring-brand-secondary-highlight/20 focus:ring-offset-0 data-[placeholder]:text-muted-foreground dark:bg-surface-2/35 dark:focus:ring-secondary/15 motion-reduce:transition-none";
const selectContentClass =
  "rounded-xl border border-border/70 !bg-card !text-foreground shadow-md shadow-black/5 dark:border-border dark:bg-popover";
const selectItemClass =
  "rounded-lg !text-foreground hover:!bg-surface-3 hover:!text-foreground focus:!bg-surface-3 focus:!text-foreground data-[highlighted]:!bg-surface-3 data-[highlighted]:!text-foreground data-[state=checked]:!bg-surface-2 data-[state=checked]:!text-foreground [&_span]:!text-inherit";
const cardSurface = "border-border/60 bg-card dark:border-border dark:bg-card";
const quietSurface =
  "border-border/55 bg-surface-2/30 dark:border-border dark:bg-surface-2/55";
const accentIconSurface =
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10 dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10";
const professionalScoreSurface =
  "border-primary/20 bg-primary text-primary-foreground dark:border-brand-secondary-highlight/25 dark:bg-brand-secondary dark:text-white";
const pageCanvas = "bg-surface-2/20 dark:bg-background";
const profileSurface =
  "rounded-2xl border border-border/60 bg-card shadow-sm shadow-black/[0.025] dark:border-border dark:bg-card dark:shadow-none";
const sectionSurface =
  "rounded-2xl border border-border/60 bg-card dark:border-border dark:bg-card";

function AllocatProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [accountProfile, setAccountProfile] = useState<ProfileUser | null>(
    null,
  );
  const [allocatProfile, setAllocatProfile] = useState<MyAllocatProfile | null>(
    null,
  );
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [citiesCountry, setCitiesCountry] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [cityRetry, setCityRetry] = useState(0);
  const [skillOptions, setSkillOptions] = useState<AllocatSkill[]>([]);
  const [documents, setDocuments] = useState<UserDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [skillCatalogError, setSkillCatalogError] = useState<string | null>(
    null,
  );
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [savingSection, setSavingSection] = useState<EditingSection>(null);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [showHideProfileWarning, setShowHideProfileWarning] = useState(false);
  const [showCompletedProjects, setShowCompletedProjects] = useState(false);
  const [accountDraft, setAccountDraft] = useState<AccountDraft>({
    fullName: "",
    phoneNumber: "",
    countryCode: "",
    cityName: "",
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
      operatingCountryCode: "",
      operatingCityId: "",
    },
  );
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const identityInputRef = useRef<HTMLInputElement | null>(null);
  const professionalDocumentInputRef = useRef<HTMLInputElement | null>(null);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [identityProgress, setIdentityProgress] = useState(0);
  const [uploadingIdentity, setUploadingIdentity] = useState(false);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [professionalDocumentType, setProfessionalDocumentType] =
    useState<ProfessionalDocumentType>("Qualification");
  const [professionalDocumentFile, setProfessionalDocumentFile] =
    useState<File | null>(null);
  const [professionalDocumentProgress, setProfessionalDocumentProgress] =
    useState(0);
  const [uploadingProfessionalDocument, setUploadingProfessionalDocument] =
    useState(false);
  const [professionalDocumentError, setProfessionalDocumentError] = useState<
    string | null
  >(null);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<
    string | null
  >(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );
  const [documentToDelete, setDocumentToDelete] =
    useState<UserDocumentDto | null>(null);
  const [documentPreview, setDocumentPreview] =
    useState<DocumentPreviewState | null>(null);

  const loadCountries = useCallback(async () => {
    setLoadingCountries(true);
    setCountriesError(null);
    try {
      const response = await api.get<CountryOption[]>("/locations/countries", {
        withCredentials: true,
      });
      if (!Array.isArray(response.data))
        throw new Error("Invalid country catalogue.");
      setCountries(
        [...response.data].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } catch (error) {
      setCountriesError(
        getApiErrorMessage(
          error,
          "The country catalogue could not be loaded. Please retry.",
        ),
      );
    } finally {
      setLoadingCountries(false);
    }
  }, []);
  useEffect(() => {
    if (editingSection === "account" || editingSection === "work")
      void loadCountries();
  }, [editingSection, loadCountries]);
  useEffect(() => {
    let active = true;
    setCities([]);
    setCitiesCountry("");
    setCitiesError(null);
    const code = professionalDraft.operatingCountryCode;
    if (editingSection !== "work" || !code) {
      setLoadingCities(false);
      return;
    }
    setLoadingCities(true);
    async function load() {
      try {
        const response = await api.get<CityOption[]>(
          `/locations/countries/${encodeURIComponent(code)}/cities`,
          { withCredentials: true },
        );
        if (!Array.isArray(response.data))
          throw new Error("Invalid city catalogue.");
        if (!active) return;
        setCities(
          response.data
            .filter((city) => city.countryCode === code)
            .sort((a, b) => a.name.localeCompare(b.name)),
        );
        setCitiesCountry(code);
      } catch (error) {
        if (active)
          setCitiesError(
            getApiErrorMessage(
              error,
              "The city catalogue could not be loaded. Please retry.",
            ),
          );
      } finally {
        if (active) setLoadingCities(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [editingSection, professionalDraft.operatingCountryCode, cityRetry]);
  const availableCities =
    citiesCountry === professionalDraft.operatingCountryCode ? cities : [];
  const operatingCountries = countries.filter(
    (country) => country.supportsAllocatOperations,
  );
  const operatingLocation =
    allocatProfile?.operatingCountryCode &&
    allocatProfile.operatingCityId != null
      ? [allocatProfile.operatingCityName, allocatProfile.operatingCountryName]
          .filter(Boolean)
          .join(", ") ||
        allocatProfile.location ||
        "Operating location added"
      : "";
  function changeOperatingCountry(code: string) {
    setProfessionalDraft((current) => ({
      ...current,
      operatingCountryCode: code,
      operatingCityId: "",
    }));
    setCities([]);
    setCitiesCountry("");
    setCitiesError(null);
    setSectionError(null);
  }
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
  const loadDocuments = useCallback(async () => {
    try {
      setLoadingDocuments(true);
      setDocumentsError(null);
      const response = await api.get<ApiUserDocumentDto[]>(
        "/allocats/profiles/me/documents",
        { withCredentials: true },
      );
      setDocuments(sortDocuments(response.data.map(normalizeUserDocument)));
    } catch (error) {
      console.error("Could not load user documents:", error);
      setDocumentsError(
        getApiErrorMessage(error, "Your documents could not be loaded."),
      );
    } finally {
      setLoadingDocuments(false);
    }
  }, []);
  const fetchPageData = useCallback(async () => {
    if (!user?.isAllocat) return;
    try {
      setLoading(true);
      setPageError(null);
      const accountResponse = await api.get<ProfileUser>("/profiles/me", {
        withCredentials: true,
      });
      setAccountProfile(accountResponse.data);
      setAccountDraft(toAccountDraft(accountResponse.data));
      try {
        const allocatResponse = await api.get<MyAllocatProfile>(
          "/allocats/profiles/me",
          { withCredentials: true },
        );
        setAllocatProfile(allocatResponse.data);
        setProfessionalDraft(toProfessionalDraft(allocatResponse.data));
        void loadSkillOptions();
        void loadDocuments();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setAllocatProfile(null);
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Could not load Allocat profile:", error);
      setPageError(
        getApiErrorMessage(error, "Your Allocat profile could not be loaded."),
      );
    } finally {
      setLoading(false);
    }
  }, [user?.isAllocat, loadSkillOptions, loadDocuments]);
  useEffect(() => {
    if (!user?.isAllocat) return;
    void fetchPageData();
  }, [user?.isAllocat, fetchPageData]);
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
  useEffect(() => {
    if (!showHideProfileWarning) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !updatingVisibility)
        setShowHideProfileWarning(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showHideProfileWarning, updatingVisibility]);
  useEffect(() => {
    if (!documentToDelete) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deletingDocumentId)
        setDocumentToDelete(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [documentToDelete, deletingDocumentId]);
  useEffect(() => {
    if (!documentPreview) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDocumentPreview(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [documentPreview]);
  useEffect(() => {
    if (!showCompletedProjects) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowCompletedProjects(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showCompletedProjects]);
  const allSkillOptions = useMemo(() => {
    const map = new Map<string, AllocatSkill>();
    allocatProfile?.skills.forEach((skill) => map.set(skill.id, skill));
    skillOptions.forEach((skill) => map.set(skill.id, skill));
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
  const identityDocument = useMemo(
    () =>
      documents.find((document) => document.documentType === "Identity") ??
      null,
    [documents],
  );
  const professionalDocuments = useMemo(
    () => documents.filter((document) => document.documentType !== "Identity"),
    [documents],
  );
  const completedProjectPreview = useMemo(
    () =>
      allocatProfile?.projects.slice(0, COMPLETED_PROJECT_PREVIEW_COUNT) ?? [],
    [allocatProfile?.projects],
  );
  const initials = useMemo(
    () => getInitials(accountProfile?.fullName ?? allocatProfile?.fullName),
    [accountProfile?.fullName, allocatProfile?.fullName],
  );
  const persistedAvatar =
    accountProfile?.avatarUrl ?? allocatProfile?.avatarUrl ?? undefined;
  const incompleteProfileItems = useMemo(
    () =>
      !accountProfile || !allocatProfile
        ? []
        : getIncompleteProfileItems(accountProfile, allocatProfile),
    [accountProfile, allocatProfile],
  );
  function isDocumentPreviewLoading(documentId: string) {
    return (
      documentPreview?.document.id === documentId &&
      documentPreview.loading === true
    );
  }
  function updateProfessionalDraft<K extends keyof ProfessionalDraft>(
    key: K,
    value: ProfessionalDraft[K],
  ) {
    setProfessionalDraft((current) => ({ ...current, [key]: value }));
    setSectionError(null);
  }
  function startEditing(section: Exclude<EditingSection, null>) {
    if (savingSection) return;
    setSectionError(null);
    setEditingSection(section);
    requestAnimationFrame(() => {
      if (section === "account") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      document
        .getElementById(`profile-${section}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  function completeNextProfileItem() {
    const next = incompleteProfileItems[0];
    if (next) startEditing(next.section);
  }
  function scrollToIdentityVerification() {
    document
      .getElementById("profile-identity")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function cancelEditing() {
    if (accountProfile) setAccountDraft(toAccountDraft(accountProfile));
    if (allocatProfile)
      setProfessionalDraft(toProfessionalDraft(allocatProfile));
    setSectionError(null);
    setEditingSection(null);
  }
  async function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountDraft.fullName.trim()) {
      setSectionError("Enter your full name before saving.");
      return;
    }
    if (accountDraft.cityName.trim() && !accountDraft.countryCode) {
      setSectionError("Select a residence country before entering a city.");
      return;
    }
    if (accountDraft.cityName.trim().length > 150) {
      setSectionError("City cannot exceed 150 characters.");
      return;
    }
    const residenceChanged =
      accountProfile &&
      accountDraft.countryCode !== (accountProfile.countryCode ?? "");
    if (
      residenceChanged &&
      accountDraft.countryCode &&
      !countries.some((country) => country.code === accountDraft.countryCode)
    ) {
      setSectionError("Select a country from the country catalogue.");
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
          ...(accountProfile &&
          (accountDraft.countryCode !== (accountProfile.countryCode ?? "") ||
            accountDraft.cityName.trim() !==
              (accountProfile.cityName ?? "").trim())
            ? {
                countryCode: accountDraft.countryCode || null,
                cityName: accountDraft.cityName.trim() || null,
              }
            : {}),
        },
        { withCredentials: true },
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
  async function saveProfessionalSection(
    section: Exclude<EditingSection, "account" | null>,
  ) {
    const validationError = validateProfessionalDraft(professionalDraft);
    if (validationError) {
      setSectionError(validationError);
      return;
    }
    const locationChanged =
      allocatProfile &&
      (professionalDraft.operatingCountryCode !==
        (allocatProfile.operatingCountryCode ?? "") ||
        professionalDraft.operatingCityId !==
          (allocatProfile.operatingCityId?.toString() ?? ""));
    if (
      section === "work" &&
      (locationChanged ||
        !allocatProfile?.operatingCountryCode ||
        allocatProfile.operatingCityId == null)
    ) {
      if (
        !operatingCountries.some(
          (country) => country.code === professionalDraft.operatingCountryCode,
        )
      ) {
        setSectionError("Select a supported operating country.");
        return;
      }
      if (
        !professionalDraft.operatingCityId ||
        !availableCities.some(
          (city) => String(city.id) === professionalDraft.operatingCityId,
        )
      ) {
        setSectionError("Select an operating city belonging to this country.");
        return;
      }
    }
    const payload = buildProfessionalPayload(professionalDraft);
    if (section === "work" && locationChanged) {
      payload.operatingCountryCode = professionalDraft.operatingCountryCode;
      payload.operatingCityId = Number(professionalDraft.operatingCityId);
    }
    try {
      setSavingSection(section);
      setSectionError(null);
      const response = await api.put<MyAllocatProfile>(
        "/allocats/profiles/me",
        payload,
        { withCredentials: true },
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
  function requestVisibilityToggle() {
    if (!allocatProfile || updatingVisibility) return;
    if (allocatProfile.isVisible) {
      setShowHideProfileWarning(true);
      return;
    }
    void updateVisibility(true);
  }
  async function updateVisibility(isVisible: boolean) {
    if (!allocatProfile || updatingVisibility) return;
    try {
      setUpdatingVisibility(true);
      await api.patch(
        "/allocats/profiles/me/visibility",
        { isVisible },
        { withCredentials: true },
      );
      setAllocatProfile((current) =>
        current ? { ...current, isVisible } : current,
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
    if (file.size <= 0) {
      setAvatarError("Choose a non-empty image file.");
      event.target.value = "";
      return;
    }
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("Choose a JPEG, PNG or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
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
  async function uploadAvatar() {
    if (!avatarFile || uploadingAvatar) return;
    const previousAvatar = accountProfile?.avatarUrl ?? null;
    const data = new FormData();
    data.append("file", avatarFile);
    try {
      setUploadingAvatar(true);
      setAvatarError(null);
      setAvatarProgress(0);
      await api.post("/profiles/profile-picture", data, {
        withCredentials: true,
        onUploadProgress: (event) => {
          if (!event.total) return;
          setAvatarProgress(Math.round((event.loaded * 100) / event.total));
        },
      });
      const [accountResponse, allocatResponse] = await Promise.all([
        api.get<ProfileUser>("/profiles/me", { withCredentials: true }),
        api.get<MyAllocatProfile>("/allocats/profiles/me", {
          withCredentials: true,
        }),
      ]);
      const nextAvatar = accountResponse.data.avatarUrl;
      if (!nextAvatar || nextAvatar === previousAvatar)
        throw new Error(
          "The upload completed, but the new profile picture was not saved.",
        );
      setAccountProfile(accountResponse.data);
      setAccountDraft(toAccountDraft(accountResponse.data));
      setAllocatProfile(allocatResponse.data);
      setProfessionalDraft(toProfessionalDraft(allocatResponse.data));
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
            "Your profile picture could not be uploaded.",
          ),
        );
    } finally {
      setUploadingAvatar(false);
    }
  }
  function validateSelectedDocument(file: File) {
    if (file.size <= 0) return "Choose a non-empty document.";
    if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type))
      return "Choose a PDF, JPEG, PNG or WebP file.";
    if (file.size > MAX_DOCUMENT_SIZE) return "Documents cannot exceed 10 MB.";
    return null;
  }
  function handleIdentityFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setIdentityError(null);
    if (!file) return;
    const error = validateSelectedDocument(file);
    if (error) {
      setIdentityError(error);
      event.target.value = "";
      return;
    }
    setIdentityFile(file);
    setIdentityProgress(0);
  }
  function clearIdentitySelection() {
    setIdentityFile(null);
    setIdentityProgress(0);
    setIdentityError(null);
    if (identityInputRef.current) identityInputRef.current.value = "";
  }
  async function uploadIdentityDocument() {
    if (!identityFile || uploadingIdentity) return;
    if (identityDocument) {
      setIdentityError(
        "An identity document already exists. Remove the current pending or rejected document before uploading another one.",
      );
      return;
    }
    const data = new FormData();
    data.append("documentType", "Identity");
    data.append("file", identityFile);
    try {
      setUploadingIdentity(true);
      setIdentityError(null);
      setDocumentsError(null);
      setIdentityProgress(0);
      const response = await api.post<ApiUserDocumentDto>(
        "/allocats/profiles/me/documents",
        data,
        {
          withCredentials: true,
          onUploadProgress: (event) => {
            if (!event.total) return;
            setIdentityProgress(Math.round((event.loaded * 100) / event.total));
          },
        },
      );
      const uploaded = normalizeUserDocument(response.data);
      setDocuments((current) =>
        sortDocuments([
          uploaded,
          ...current.filter((document) => document.id !== uploaded.id),
        ]),
      );
      clearIdentitySelection();
      toast.success("Identity document uploaded", {
        description: "Your document has been submitted for review.",
      });
    } catch (error) {
      console.error("Could not upload identity document:", error);
      setIdentityError(
        getApiErrorMessage(
          error,
          "Your identity document could not be uploaded.",
        ),
      );
    } finally {
      setUploadingIdentity(false);
    }
  }
  function handleProfessionalDocumentChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    setProfessionalDocumentError(null);
    if (!file) return;
    const error = validateSelectedDocument(file);
    if (error) {
      setProfessionalDocumentError(error);
      event.target.value = "";
      return;
    }
    setProfessionalDocumentFile(file);
    setProfessionalDocumentProgress(0);
  }
  function clearProfessionalDocumentSelection() {
    setProfessionalDocumentFile(null);
    setProfessionalDocumentProgress(0);
    setProfessionalDocumentError(null);
    if (professionalDocumentInputRef.current)
      professionalDocumentInputRef.current.value = "";
  }
  async function uploadProfessionalDocument() {
    if (!professionalDocumentFile || uploadingProfessionalDocument) return;
    if (professionalDocuments.length >= MAX_PROFESSIONAL_DOCUMENTS) {
      setProfessionalDocumentError(
        `You can upload a maximum of ${MAX_PROFESSIONAL_DOCUMENTS} professional documents.`,
      );
      return;
    }
    const data = new FormData();
    data.append("documentType", professionalDocumentType);
    data.append("file", professionalDocumentFile);
    try {
      setUploadingProfessionalDocument(true);
      setProfessionalDocumentError(null);
      setDocumentsError(null);
      setProfessionalDocumentProgress(0);
      const response = await api.post<ApiUserDocumentDto>(
        "/allocats/profiles/me/documents",
        data,
        {
          withCredentials: true,
          onUploadProgress: (event) => {
            if (!event.total) return;
            setProfessionalDocumentProgress(
              Math.round((event.loaded * 100) / event.total),
            );
          },
        },
      );
      const uploaded = normalizeUserDocument(response.data);
      setDocuments((current) =>
        sortDocuments([
          uploaded,
          ...current.filter((document) => document.id !== uploaded.id),
        ]),
      );
      clearProfessionalDocumentSelection();
      toast.success("Professional document uploaded");
    } catch (error) {
      console.error("Could not upload professional document:", error);
      setProfessionalDocumentError(
        getApiErrorMessage(error, "The document could not be uploaded."),
      );
    } finally {
      setUploadingProfessionalDocument(false);
    }
  }
  async function getDocumentUrl(documentId: string) {
    const response = await api.get<{ url: string }>(
      `/allocats/profiles/me/documents/${documentId}/download`,
      { withCredentials: true },
    );
    if (!response.data.url)
      throw new Error("The file URL could not be created.");
    return response.data.url;
  }
  async function previewDocument(documentItem: UserDocumentDto) {
    setDocumentPreview({
      document: documentItem,
      url: null,
      loading: true,
      error: null,
    });
    try {
      const url = await getDocumentUrl(documentItem.id);
      setDocumentPreview((current) =>
        !current || current.document.id !== documentItem.id
          ? current
          : { ...current, url, loading: false },
      );
    } catch (error) {
      console.error("Could not preview document:", error);
      const message =
        error instanceof Error &&
        error.message === "The file URL could not be created."
          ? error.message
          : getApiErrorMessage(error, "The document could not be previewed.");
      setDocumentPreview((current) =>
        !current || current.document.id !== documentItem.id
          ? current
          : { ...current, loading: false, error: message },
      );
    }
  }
  async function downloadDocument(documentItem: UserDocumentDto) {
    if (downloadingDocumentId) return;
    try {
      setDownloadingDocumentId(documentItem.id);
      const url = await getDocumentUrl(documentItem.id);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = documentItem.originalFileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      window.document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Could not download document:", error);
      toast.error(
        error instanceof Error &&
          error.message === "The file URL could not be created."
          ? error.message
          : getApiErrorMessage(error, "The document could not be downloaded."),
      );
    } finally {
      setDownloadingDocumentId(null);
    }
  }
  async function deleteDocument() {
    if (!documentToDelete || deletingDocumentId) return;
    const currentDocument = documentToDelete;
    try {
      setDeletingDocumentId(currentDocument.id);
      setDocumentsError(null);
      await api.delete(
        `/allocats/profiles/me/documents/${currentDocument.id}`,
        { withCredentials: true },
      );
      setDocuments((current) =>
        current.filter((document) => document.id !== currentDocument.id),
      );
      setDocumentPreview((current) =>
        current?.document.id === currentDocument.id ? null : current,
      );
      setDocumentToDelete(null);
      toast.success("Document removed");
    } catch (error) {
      console.error("Could not delete document:", error);
      toast.error(
        getApiErrorMessage(error, "The document could not be removed."),
      );
    } finally {
      setDeletingDocumentId(null);
    }
  }
  if (user && !user.isAllocat)
    return <Navigate to={REGULAR_PROFILE_ROUTE} replace />;
  if (!user || loading) return <AllocatProfileSkeleton />;
  if (pageError || !accountProfile)
    return (
      <AllocatProfileError
        message={pageError ?? "Your profile could not be loaded."}
        onRetry={fetchPageData}
      />
    );
  if (!allocatProfile)
    return (
      <IncompleteAllocatSetup
        accountProfile={accountProfile}
        onContinue={() => navigate(CREATE_PROFILE_ROUTE)}
      />
    );
  const rating = allocatProfile.rating;
  const completedProjects = allocatProfile.completedProjects;
  const identityManager = (
    <IdentityDocumentManager
      document={identityDocument}
      loading={loadingDocuments}
      error={documentsError}
      file={identityFile}
      progress={identityProgress}
      uploading={uploadingIdentity}
      uploadError={identityError}
      previewing={
        identityDocument ? isDocumentPreviewLoading(identityDocument.id) : false
      }
      downloading={
        identityDocument ? downloadingDocumentId === identityDocument.id : false
      }
      inputRef={identityInputRef}
      onChoose={() => identityInputRef.current?.click()}
      onFileChange={handleIdentityFileChange}
      onClear={clearIdentitySelection}
      onUpload={() => void uploadIdentityDocument()}
      onPreview={
        identityDocument
          ? () => void previewDocument(identityDocument)
          : undefined
      }
      onDownload={
        identityDocument
          ? () => void downloadDocument(identityDocument)
          : undefined
      }
      onDelete={
        identityDocument && identityDocument.reviewStatus !== "Approved"
          ? () => setDocumentToDelete(identityDocument)
          : undefined
      }
      onRetry={() => void loadDocuments()}
    />
  );
  return (
    <div className={"min-h-screen text-foreground " + pageCanvas}>
      <ProfileHeader />
      <main className="container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-8">
        <section className={"overflow-hidden " + profileSurface}>
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative w-fit shrink-0">
                  <Avatar className="h-24 w-24 border border-border/70 bg-transparent sm:h-28 sm:w-28">
                    <AvatarImage
                      key={persistedAvatar}
                      src={persistedAvatar}
                      alt={`${accountProfile.fullName}'s profile`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-brand-secondary-highlight/[0.08] text-2xl font-semibold text-brand-secondary-highlight dark:bg-secondary/[0.08] dark:text-secondary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {allocatProfile.verified && (
                    <span
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg border-[3px] border-card bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
                      title="Verified Allocat"
                    >
                      <BadgeCheckIcon size={14} aria-hidden="true" />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={openAvatarEditor}
                    className={
                      "absolute -left-1 -top-1 flex h-8 w-8 items-center justify-center rounded-lg border-[3px] border-card bg-brand-secondary-highlight text-primary-foreground transition-opacity duration-150 hover:opacity-85 dark:bg-secondary dark:text-secondary-foreground motion-reduce:transition-none " +
                      focus
                    }
                    aria-label="Change profile picture"
                    title="Change profile picture"
                  >
                    <CameraIcon size={14} aria-hidden="true" />
                  </button>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-brand-secondary-highlight dark:text-secondary">
                      Professional profile
                    </p>
                    <span className="rounded-lg bg-brand-secondary-highlight/[0.07] px-2 py-1 text-[10px] font-semibold text-brand-secondary-highlight dark:bg-secondary/[0.07] dark:text-secondary">
                      Level {allocatProfile.level}
                    </span>
                  </div>
                  <div className="mt-2 flex min-w-0 items-start gap-2">
                    <h1 className="min-w-0 break-words text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground/95 sm:text-4xl lg:text-[2.75rem] [overflow-wrap:anywhere]">
                      {accountProfile.fullName}
                    </h1>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing("account")}
                      className={
                        "mt-0.5 h-8 w-8 shrink-0 rounded-lg sm:mt-1 " +
                        quietIconButton
                      }
                      aria-label="Edit account details"
                      title="Edit account details"
                    >
                      <Edit3Icon size={14} aria-hidden="true" />
                    </Button>
                  </div>
                  <p
                    className={
                      "mt-2 text-sm font-semibold sm:text-base " +
                      (allocatProfile.title
                        ? "text-foreground/80"
                        : "text-muted-foreground")
                    }
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
                      <MapPinIcon size={13} aria-hidden="true" />
                      {operatingLocation || "Operating location not added"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <AvailabilityDot
                        availability={allocatProfile.availabilityStatus}
                      />
                      {formatAvailability(allocatProfile.availabilityStatus)}
                    </span>
                    {allocatProfile.responseTime != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3Icon size={13} aria-hidden="true" />
                        {formatResponseSummary(allocatProfile.responseTime)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={requestVisibilityToggle}
                disabled={updatingVisibility}
                className={
                  "h-10 shrink-0 rounded-lg px-4 text-xs font-semibold " +
                  secondaryButton
                }
              >
                {updatingVisibility ? (
                  <LoaderCircleIcon
                    size={14}
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                ) : allocatProfile.isVisible ? (
                  <EyeIcon size={14} aria-hidden="true" />
                ) : (
                  <EyeOffIcon size={14} aria-hidden="true" />
                )}
                {allocatProfile.isVisible ? "Visible" : "Hidden"}
              </Button>
            </div>
            {editingSection === "account" && (
              <form
                onSubmit={saveAccount}
                className={"mt-7 rounded-xl border p-5 " + quietSurface}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Account details
                    </p>
                    <p className="mt-1 text-[0.64rem] leading-5 text-muted-foreground">
                      Update your contact and account information.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={cancelEditing}
                    className={"h-8 w-8 rounded-lg " + quietIconButton}
                    aria-label="Close account editor"
                  >
                    <XIcon size={14} aria-hidden="true" />
                  </Button>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {(
                    [
                      {
                        key: "fullName",
                        label: "Full name",
                        icon: UserRoundIcon,
                      },
                      {
                        key: "phoneNumber",
                        label: "Phone number",
                        icon: PhoneIcon,
                        placeholder: "+263...",
                        type: "tel",
                      },
                    ] as const
                  ).map((item) => (
                    <ProfileField key={item.key} label={item.label}>
                      <div className="relative">
                        <item.icon
                          size={15}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          aria-label={item.label}
                          type={"type" in item ? item.type : "text"}
                          value={accountDraft[item.key]}
                          placeholder={
                            "placeholder" in item ? item.placeholder : undefined
                          }
                          onChange={(event) => {
                            setSectionError(null);
                            setAccountDraft((current) => ({
                              ...current,
                              [item.key]: event.target.value,
                            }));
                          }}
                          className={fieldClass + " pl-10"}
                        />
                      </div>
                    </ProfileField>
                  ))}
                  <ProfileField label="Residence country">
                    <Select
                      value={accountDraft.countryCode || "__none__"}
                      disabled={loadingCountries || Boolean(savingSection)}
                      onValueChange={(value) => {
                        setAccountDraft((current) => ({
                          ...current,
                          countryCode: value === "__none__" ? "" : value,
                          cityName: "",
                        }));
                        setSectionError(null);
                      }}
                    >
                      <SelectTrigger
                        aria-label="Residence country"
                        className={selectTriggerClass}
                      >
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        <SelectItem
                          value="__none__"
                          className={selectItemClass}
                        >
                          Not added
                        </SelectItem>
                        {accountDraft.countryCode &&
                          !countries.some(
                            (country) =>
                              country.code === accountDraft.countryCode,
                          ) && (
                            <SelectItem
                              value={accountDraft.countryCode}
                              className={selectItemClass}
                            >
                              {accountProfile.countryName ||
                                accountDraft.countryCode}
                            </SelectItem>
                          )}
                        {countries.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={country.code}
                            className={selectItemClass}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Where you live. This can be any country and stays separate
                      from your operating base.
                    </p>
                  </ProfileField>
                  <ProfileField label="Residence city">
                    <Input
                      aria-label="Residence city"
                      value={accountDraft.cityName}
                      maxLength={150}
                      placeholder="Enter your city"
                      disabled={
                        !accountDraft.countryCode || Boolean(savingSection)
                      }
                      className={fieldClass}
                      onChange={(event) => {
                        setAccountDraft((current) => ({
                          ...current,
                          cityName: event.target.value,
                        }));
                        setSectionError(null);
                      }}
                    />
                  </ProfileField>
                  {countriesError && (
                    <div className="sm:col-span-2">
                      <InlineError message={countriesError} />
                      <Button
                        type="button"
                        onClick={() => void loadCountries()}
                        className={secondaryButton + " mt-2"}
                      >
                        Retry countries
                      </Button>
                    </div>
                  )}
                  {!accountProfile.countryCode && accountProfile.location && (
                    <p className="sm:col-span-2 text-xs leading-6 text-muted-foreground">
                      Previous location: {accountProfile.location}. Select a
                      country to confirm your residence. Editing your name or
                      phone preserves the previous location.
                    </p>
                  )}
                  <ProfileField label="Email">
                    <div className="relative">
                      <MailIcon
                        size={15}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        aria-label="Email"
                        value={accountProfile.email ?? ""}
                        disabled
                        className={disabledFieldClass + " pl-10 pr-10"}
                      />
                      <LockKeyholeIcon
                        size={13}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                      />
                    </div>
                  </ProfileField>
                </div>
                {sectionError && <InlineError message={sectionError} />}
                <SectionActions
                  saving={savingSection === "account"}
                  onCancel={cancelEditing}
                  submit
                />
              </form>
            )}
          </div>
          <div className="border-t border-border/55">
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
        <div className="mt-4 space-y-3">
          {incompleteProfileItems.length > 0 && (
            <IncompleteProfileWarning
              items={incompleteProfileItems}
              onComplete={completeNextProfileItem}
            />
          )}
          {!loadingDocuments &&
            documents.length === 0 &&
            !allocatProfile.verified && (
              <VerificationDocumentsNotice
                onStart={scrollToIdentityVerification}
              />
            )}
        </div>
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            <ProfileSection
              sectionId="profile-about"
              eyebrow="Overview"
              title={`About ${getFirstName(accountProfile.fullName)}`}
              editing={editingSection === "about"}
              onEdit={() => startEditing("about")}
              onCancel={cancelEditing}
            >
              {editingSection === "about" ? (
                <div className="w-full">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Professional title">
                      <Input
                        aria-label="Professional title"
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
                        aria-label="Headline"
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
                        aria-label="Professional bio"
                        value={professionalDraft.bio}
                        maxLength={500}
                        onChange={(event) =>
                          updateProfessionalDraft("bio", event.target.value)
                        }
                        className={
                          "min-h-40 resize-none rounded-xl leading-7 " +
                          fieldClass.replace("h-11 ", "")
                        }
                      />
                    </ProfileField>
                  </div>
                  {!allocatProfile.verified && (
                    <div className="mt-6 border-t border-border/50 pt-6">
                      <ProfileField label="ID number">
                        <Input
                          aria-label="ID number"
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
                  {!allocatProfile.verified && (
                    <div
                      id="profile-identity"
                      className="mt-7 scroll-mt-28 border-t border-border/50 pt-6"
                    >
                      {identityManager}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
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
                    <div className="max-w-3xl">
                      <ReadOnlyField
                        label="Professional bio"
                        value={allocatProfile.bio}
                        missingLabel="Not added"
                        multiline
                      />
                    </div>
                  </div>
                  <div
                    id="profile-identity"
                    className="mt-6 scroll-mt-28 border-t border-border/50 pt-5"
                  >
                    <ReadOnlyField
                      label="ID number"
                      value={allocatProfile.idNumber ? "Added" : null}
                      missingLabel="Not added"
                      description="Private. Your ID number is not visible to clients."
                      positive={Boolean(allocatProfile.idNumber)}
                    />
                    <div className="mt-5">{identityManager}</div>
                  </div>
                </div>
              )}
            </ProfileSection>
            <ProfileSection
              sectionId="profile-skills"
              eyebrow="Expertise"
              title="Skills"
              editing={editingSection === "skills"}
              onEdit={() => startEditing("skills")}
              onCancel={cancelEditing}
            >
              {editingSection === "skills" ? (
                <div className="w-full">
                  <SkillPicker
                    options={allSkillOptions}
                    selected={selectedSkills}
                    loading={loadingSkills}
                    error={skillCatalogError}
                    disabled={savingSection === "skills"}
                    max={20}
                    onRetry={() => void loadSkillOptions()}
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
                <div className="flex flex-wrap gap-2">
                  {allocatProfile.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-md bg-brand-secondary-highlight/[0.07] px-3 py-1.5 text-xs font-semibold text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10 dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div>
                  <MissingValue>No skills added</MissingValue>
                  <p className="mt-2 max-w-xl text-xs leading-6 text-muted-foreground">
                    Add the capabilities you offer so clients can understand
                    your expertise and find you through relevant work.
                  </p>
                </div>
              )}
            </ProfileSection>
            <ProfileSection
              sectionId="profile-work"
              eyebrow="Professional"
              title="Working details"
              editing={editingSection === "work"}
              onEdit={() => startEditing("work")}
              onCancel={cancelEditing}
            >
              {editingSection === "work" ? (
                <div className="w-full">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ProfileField label="Operating country">
                      <Select
                        value={professionalDraft.operatingCountryCode}
                        disabled={loadingCountries || Boolean(savingSection)}
                        onValueChange={changeOperatingCountry}
                      >
                        <SelectTrigger
                          aria-label="Operating country"
                          className={selectTriggerClass}
                        >
                          <SelectValue
                            placeholder={
                              loadingCountries
                                ? "Loading countries…"
                                : "Select operating country"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {professionalDraft.operatingCountryCode &&
                            !operatingCountries.some(
                              (country) =>
                                country.code ===
                                professionalDraft.operatingCountryCode,
                            ) && (
                              <SelectItem
                                value={professionalDraft.operatingCountryCode}
                                disabled
                                className={selectItemClass}
                              >
                                {allocatProfile.operatingCountryName ||
                                  professionalDraft.operatingCountryCode}{" "}
                                (saved)
                              </SelectItem>
                            )}
                          {operatingCountries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.code}
                              className={selectItemClass}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ProfileField>
                    <ProfileField label="Operating city">
                      <Select
                        value={professionalDraft.operatingCityId}
                        disabled={
                          !professionalDraft.operatingCountryCode ||
                          loadingCities ||
                          citiesCountry !==
                            professionalDraft.operatingCountryCode ||
                          Boolean(savingSection)
                        }
                        onValueChange={(value) =>
                          updateProfessionalDraft("operatingCityId", value)
                        }
                      >
                        <SelectTrigger
                          aria-label="Operating city"
                          className={selectTriggerClass}
                        >
                          <SelectValue
                            placeholder={
                              loadingCities
                                ? "Loading cities…"
                                : "Select operating city"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {professionalDraft.operatingCityId &&
                            !availableCities.some(
                              (city) =>
                                String(city.id) ===
                                professionalDraft.operatingCityId,
                            ) && (
                              <SelectItem
                                value={professionalDraft.operatingCityId}
                                disabled
                                className={selectItemClass}
                              >
                                {allocatProfile.operatingCityName ||
                                  "Saved city"}
                              </SelectItem>
                            )}
                          {availableCities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={String(city.id)}
                              className={selectItemClass}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ProfileField>
                    <p className="sm:col-span-2 text-xs leading-6 text-muted-foreground">
                      Where you deliver your services. Clients search using this
                      operating base. Changing it does not change your residence
                      or automatically convert your hourly rate or currency.
                    </p>
                    {countriesError && (
                      <div className="sm:col-span-2">
                        <InlineError message={countriesError} />
                        <Button
                          type="button"
                          onClick={() => void loadCountries()}
                          className={secondaryButton + " mt-2"}
                        >
                          Retry countries
                        </Button>
                      </div>
                    )}
                    {citiesError && (
                      <div className="sm:col-span-2">
                        <InlineError message={citiesError} />
                        <Button
                          type="button"
                          onClick={() => setCityRetry((value) => value + 1)}
                          className={secondaryButton + " mt-2"}
                        >
                          Retry cities
                        </Button>
                      </div>
                    )}
                    {!loadingCities &&
                      !citiesError &&
                      citiesCountry ===
                        professionalDraft.operatingCountryCode &&
                      professionalDraft.operatingCountryCode &&
                      availableCities.length === 0 && (
                        <p
                          role="status"
                          className="sm:col-span-2 text-xs text-muted-foreground"
                        >
                          No operating cities are available for this country
                          yet.
                        </p>
                      )}
                    <ProfileField label="Availability">
                      <Select
                        value={professionalDraft.availability}
                        onValueChange={(value) =>
                          updateProfessionalDraft(
                            "availability",
                            value as AllocatAvailability,
                          )
                        }
                      >
                        <SelectTrigger
                          aria-label="Availability"
                          className={selectTriggerClass}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {["available", "busy", "unavailable"].map((value) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className={selectItemClass}
                            >
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ProfileField>
                    <ProfileField label="Years of experience">
                      <Input
                        aria-label="Years of experience"
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
                        aria-label="Hourly rate"
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
                        aria-label="Currency"
                        value={professionalDraft.currency}
                        maxLength={3}
                        onChange={(event) =>
                          updateProfessionalDraft(
                            "currency",
                            event.target.value.toUpperCase(),
                          )
                        }
                        className={fieldClass + " uppercase"}
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={BriefcaseBusinessIcon}
                    label="Experience"
                    value={
                      allocatProfile.yearsExperience !== null
                        ? `${allocatProfile.yearsExperience} ${allocatProfile.yearsExperience === 1 ? "year" : "years"}`
                        : "Not added"
                    }
                    missing={allocatProfile.yearsExperience === null}
                  />
                  <DetailItem
                    icon={MapPinIcon}
                    label="Operating location"
                    value={operatingLocation || "Not added"}
                    missing={!operatingLocation}
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
                        ? `${formatMoney(allocatProfile.hourlyRate, allocatProfile.currency)}/hr`
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
            <ProfileSection
              sectionId="profile-documents"
              eyebrow="Credentials"
              title="Professional documents"
            >
              <div className="w-full">
                <div
                  className={
                    "flex items-start gap-3 rounded-xl border px-4 py-4 " +
                    quietSurface
                  }
                >
                  <span
                    className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
                      accentIconSurface
                    }
                  >
                    <LockKeyholeIcon size={15} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      Private professional credentials
                    </p>
                    <p className="mt-1 max-w-2xl text-[0.64rem] leading-5 text-muted-foreground">
                      Qualifications, certifications and licences help Allocatr
                      verify your professional background. Approved verification
                      information can strengthen the trust clients place in your
                      profile.
                    </p>
                  </div>
                </div>
                {professionalDocuments.length === 0 &&
                  !allocatProfile.verified &&
                  !loadingDocuments && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-status-pending/25 bg-status-pending/[0.055] px-4 py-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
                        <ShieldCheckIcon size={15} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Add supporting credentials
                        </p>
                        <p className="mt-1 max-w-2xl text-[0.62rem] leading-5 text-muted-foreground">
                          Upload professional documents for review. Verification
                          is visible to clients and helps them identify trusted,
                          validated professionals.
                        </p>
                      </div>
                    </div>
                  )}
                {documentsError && (
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircleIcon
                        size={14}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-destructive"
                      />
                      <p className="text-xs leading-5 text-destructive">
                        {documentsError}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void loadDocuments()}
                      disabled={loadingDocuments}
                      className={
                        "h-8 shrink-0 rounded-lg px-3 text-xs font-semibold " +
                        secondaryButton
                      }
                    >
                      <RefreshCwIcon size={13} aria-hidden="true" />
                      Retry
                    </Button>
                  </div>
                )}
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Uploaded documents
                    </p>
                    <p className="mt-1 text-[0.61rem] text-muted-foreground">
                      Preview or download your files here. Approved documents
                      are locked after verification.
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                    {professionalDocuments.length} of{" "}
                    {MAX_PROFESSIONAL_DOCUMENTS}
                  </span>
                </div>
                <div className="mt-3">
                  {loadingDocuments ? (
                    <div className="space-y-2">
                      <DocumentRowSkeleton />
                      <DocumentRowSkeleton />
                    </div>
                  ) : professionalDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {professionalDocuments.map((document) => (
                        <DocumentRow
                          key={document.id}
                          document={document}
                          previewing={isDocumentPreviewLoading(document.id)}
                          downloading={downloadingDocumentId === document.id}
                          onPreview={() => void previewDocument(document)}
                          onDownload={() => void downloadDocument(document)}
                          onDelete={
                            document.reviewStatus === "Approved"
                              ? undefined
                              : () => setDocumentToDelete(document)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/65 px-4 py-5">
                      <p className="text-xs font-semibold text-foreground">
                        No professional documents uploaded
                      </p>
                      <p className="mt-1 text-[0.61rem] leading-5 text-muted-foreground">
                        Add qualifications, certifications or licences to
                        support your account verification.
                      </p>
                    </div>
                  )}
                </div>
                <div
                  className={
                    "mt-6 rounded-xl border p-4 sm:p-5 " + quietSurface
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Add a professional document
                      </p>
                      <p className="mt-1 text-[0.61rem] leading-5 text-muted-foreground">
                        PDF, JPEG, PNG or WebP · Maximum 10 MB per file.
                      </p>
                    </div>
                    <span
                      className={
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                        accentIconSurface
                      }
                    >
                      <UploadIcon size={14} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <ProfileField label="Document type">
                      <Select
                        value={professionalDocumentType}
                        onValueChange={(value) => {
                          setProfessionalDocumentType(
                            value as ProfessionalDocumentType,
                          );
                          setProfessionalDocumentError(null);
                        }}
                        disabled={uploadingProfessionalDocument}
                      >
                        <SelectTrigger
                          aria-label="Document type"
                          className={selectTriggerClass}
                        >
                          <SelectValue placeholder="Choose document type" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClass}>
                          {PROFESSIONAL_DOCUMENT_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className={selectItemClass}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ProfileField>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        professionalDocumentInputRef.current?.click()
                      }
                      disabled={
                        uploadingProfessionalDocument ||
                        professionalDocuments.length >=
                          MAX_PROFESSIONAL_DOCUMENTS
                      }
                      className={
                        "h-11 rounded-lg px-4 text-xs font-semibold " +
                        secondaryButton
                      }
                    >
                      <FileTextIcon size={14} aria-hidden="true" />
                      Choose file
                    </Button>
                  </div>
                  <input
                    ref={professionalDocumentInputRef}
                    type="file"
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleProfessionalDocumentChange}
                    disabled={uploadingProfessionalDocument}
                  />
                  {professionalDocuments.length >=
                    MAX_PROFESSIONAL_DOCUMENTS && (
                    <p className="mt-3 text-[0.61rem] leading-5 text-status-pending-foreground">
                      You have reached the professional document limit.
                    </p>
                  )}
                  {professionalDocumentFile && (
                    <SelectedDocument
                      file={professionalDocumentFile}
                      typeLabel={getDocumentTypeLabel(professionalDocumentType)}
                      progress={professionalDocumentProgress}
                      uploading={uploadingProfessionalDocument}
                      onClear={clearProfessionalDocumentSelection}
                      onUpload={() => void uploadProfessionalDocument()}
                    />
                  )}
                  {professionalDocumentError && (
                    <InlineError message={professionalDocumentError} />
                  )}
                </div>
              </div>
            </ProfileSection>
            <ProfileSection eyebrow="Work history" title="Completed projects">
              <CompletedProjectsSection
                projects={completedProjectPreview}
                total={allocatProfile.projects.length}
                onViewAll={() => setShowCompletedProjects(true)}
              />
            </ProfileSection>
            <ProfileSection eyebrow="Trust" title="Verification">
              {!allocatProfile.verified && documents.length === 0 && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-status-pending/25 bg-status-pending/[0.055] px-4 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
                    <ShieldAlertIcon size={15} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      Verification not started
                    </p>
                    <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                      Upload your identity and supporting professional documents
                      so Allocatr can review your account for verification.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={scrollToIdentityVerification}
                      className={
                        "mt-3 h-8 rounded-lg px-3 text-xs font-semibold " +
                        primaryButton
                      }
                    >
                      Start verification
                      <ArrowRightIcon size={13} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="grid gap-3 md:grid-cols-3">
                <VerificationItem
                  icon={ShieldCheckIcon}
                  title="Identity"
                  description={
                    identityDocument
                      ? identityDocument.originalFileName
                      : "Professional identity"
                  }
                  status={
                    allocatProfile.verified
                      ? "Verified"
                      : identityDocument
                        ? identityDocument.reviewStatus
                        : "Not submitted"
                  }
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
          <aside className="min-w-0 space-y-5 xl:sticky xl:top-24">
            <section
              className={"rounded-2xl border p-5 " + professionalScoreSurface}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
                    Professional score
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-white">
                    {getScoreLabel(allocatProfile.professionalScore)}
                  </h2>
                </div>
                <p className="shrink-0 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {allocatProfile.professionalScore}
                  <span className="ml-0.5 text-sm font-medium text-white/55">
                    %
                  </span>
                </p>
              </div>
              <ContrastProgress
                value={allocatProfile.professionalScore}
                className="mt-5"
              />
              <p className="mt-4 text-xs leading-6 text-white/65">
                Complete your professional information and build your reputation
                through skills, experience and successful work.
              </p>
            </section>
            <section
              className={"overflow-hidden rounded-2xl border " + cardSurface}
            >
              <div className="flex items-center gap-3 border-b border-border/55 px-5 py-4">
                <span
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                    accentIconSurface
                  }
                >
                  <BriefcaseBusinessIcon size={14} aria-hidden="true" />
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
                    allocatProfile.responseTime != null
                      ? formatResponseTime(allocatProfile.responseTime)
                      : "Not measured yet"
                  }
                  muted={allocatProfile.responseTime == null}
                />
                <SidebarDetail
                  label="Experience"
                  value={
                    allocatProfile.yearsExperience !== null
                      ? `${allocatProfile.yearsExperience} ${allocatProfile.yearsExperience === 1 ? "year" : "years"}`
                      : "Not added"
                  }
                  missing={allocatProfile.yearsExperience === null}
                />
                <SidebarDetail
                  label="Rate"
                  value={
                    allocatProfile.hourlyRate !== null
                      ? `${formatMoney(allocatProfile.hourlyRate, allocatProfile.currency)}/hr`
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
            <section className={"rounded-2xl border p-5 " + quietSurface}>
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
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                    (allocatProfile.isVisible
                      ? accentIconSurface
                      : "bg-surface-3/70 text-muted-foreground dark:bg-surface-2")
                  }
                >
                  {allocatProfile.isVisible ? (
                    <EyeIcon size={14} aria-hidden="true" />
                  ) : (
                    <EyeOffIcon size={14} aria-hidden="true" />
                  )}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-y border-border/45 py-3">
                <span
                  className={
                    "h-1.5 w-1.5 shrink-0 rounded-full " +
                    (allocatProfile.isVisible
                      ? "bg-status-complete"
                      : "bg-muted-foreground/40")
                  }
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
                className={
                  "mt-4 h-9 w-full rounded-lg text-xs font-semibold " +
                  secondaryButton
                }
              >
                {updatingVisibility && (
                  <LoaderCircleIcon
                    size={13}
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
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
      <ProfilePictureDialog
        open={avatarEditorOpen}
        currentAvatar={persistedAvatar}
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
        onUpload={() => void uploadAvatar()}
      />
      <DocumentPreviewDialog
        preview={documentPreview}
        downloading={
          documentPreview
            ? downloadingDocumentId === documentPreview.document.id
            : false
        }
        onClose={() => setDocumentPreview(null)}
        onRetry={(document) => void previewDocument(document)}
        onDownload={(document) => void downloadDocument(document)}
      />
      <CompletedProjectsDialog
        open={showCompletedProjects}
        projects={allocatProfile.projects}
        onClose={() => setShowCompletedProjects(false)}
      />
      <HideProfileWarning
        open={showHideProfileWarning}
        loading={updatingVisibility}
        onCancel={() => setShowHideProfileWarning(false)}
        onConfirm={() => void updateVisibility(false)}
      />
      <DeleteDocumentWarning
        document={documentToDelete}
        loading={
          documentToDelete ? deletingDocumentId === documentToDelete.id : false
        }
        onCancel={() => setDocumentToDelete(null)}
        onConfirm={() => void deleteDocument()}
      />
    </div>
  );
}

function ProfileHeader({ context = true }: { context?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardMainNav>
          {context ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Allocat
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                Profile
              </p>
            </div>
          ) : undefined}
        </DashboardMainNav>
      </div>
    </header>
  );
}
function VerificationDocumentsNotice({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-xl border border-status-pending/25 bg-status-pending/[0.055] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
          <ShieldCheckIcon size={15} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground">
            Get your account verified
          </p>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground">
            Upload your identity and professional documents for review.
            Verification is shown to clients and helps establish trust when they
            discover, invite or hire you.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onStart}
          className={
            "h-9 shrink-0 rounded-lg px-4 text-xs font-semibold " +
            primaryButton
          }
        >
          Start verification
          <ArrowRightIcon size={13} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
function CompletedProjectsSection({
  projects,
  total,
  onViewAll,
}: {
  projects: CompletedProject[];
  total: number;
  onViewAll: () => void;
}) {
  if (total === 0) return <EmptyHistory />;
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-foreground">
            Completed work
          </p>
          <p className="mt-1 text-[0.61rem] text-muted-foreground">
            Showing {Math.min(projects.length, total)} of {total} completed{" "}
            {total === 1 ? "project" : "projects"}.
          </p>
        </div>
        {total > COMPLETED_PROJECT_PREVIEW_COUNT && (
          <Button
            type="button"
            variant="ghost"
            onClick={onViewAll}
            className={
              "h-8 shrink-0 rounded-lg px-3 text-xs font-semibold " +
              secondaryButton
            }
          >
            View all
            <ArrowRightIcon size={13} aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-border/55">
        {projects.map((project) => (
          <CompletedProjectRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
function CompletedProjectRow({ project }: { project: CompletedProject }) {
  return (
    <div className="flex items-center gap-4 border-b border-border/45 px-4 py-4 last:border-b-0">
      <span
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
          accentIconSurface
        }
      >
        <FolderCheckIcon size={15} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {project.title}
        </p>
        <p className="mt-1 truncate text-[0.61rem] text-muted-foreground">
          {project.category} · {project.projectCode}
        </p>
      </div>
      <span className="shrink-0 text-[10px] font-semibold capitalize text-muted-foreground">
        {project.status}
      </span>
    </div>
  );
}
function CompletedProjectsDialog({
  open,
  projects,
  onClose,
}: {
  open: boolean;
  projects: CompletedProject[];
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[125] flex items-center justify-center bg-foreground/40 px-4 py-5 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="completed-projects-title"
        className="flex max-h-[86dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/65 bg-card text-card-foreground shadow-lg shadow-black/5 dark:border-border dark:bg-card"
      >
        <div className="flex shrink-0 items-start justify-between gap-5 border-b border-border/55 px-5 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Work history
            </p>
            <h2
              id="completed-projects-title"
              className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground"
            >
              Completed projects
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {projects.length} completed{" "}
              {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={"h-8 w-8 shrink-0 rounded-lg " + quietIconButton}
            aria-label="Close completed projects"
          >
            <XIcon size={14} aria-hidden="true" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <div className="divide-y divide-border/55">
            {projects.map((project) => (
              <CompletedProjectRow key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div className="flex shrink-0 justify-end border-t border-border/55 px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={
              "h-9 rounded-lg px-4 text-xs font-semibold " + secondaryButton
            }
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
function UploadProgress({
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
      className={
        "h-1.5 w-full overflow-hidden rounded-full bg-brand-secondary-highlight/[0.10] dark:bg-secondary/[0.10] " +
        className
      }
      role="progressbar"
      aria-label="Upload progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className="h-full rounded-full bg-brand-secondary-highlight transition-[width] duration-200 ease-out dark:bg-secondary motion-reduce:transition-none"
        style={{ width: `${safeValue}%` }}
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
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/65 bg-card p-5 text-card-foreground shadow-lg shadow-black/5 sm:p-6 dark:border-border dark:bg-card"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Profile image
            </p>
            <h2
              id="profile-picture-title"
              className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground"
            >
              Change profile picture
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
            className={"h-8 w-8 shrink-0 rounded-lg " + quietIconButton}
            aria-label="Close profile picture editor"
          >
            <XIcon size={14} aria-hidden="true" />
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
              className={
                "absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-lg border-[3px] border-card bg-brand-secondary-highlight text-primary-foreground transition-opacity duration-150 hover:opacity-85 disabled:pointer-events-none disabled:opacity-60 dark:bg-secondary dark:text-secondary-foreground motion-reduce:transition-none " +
                focus
              }
              aria-label="Choose profile picture"
            >
              <CameraIcon size={15} aria-hidden="true" />
            </button>
          </div>
          {file ? (
            <div
              className={
                "mt-5 w-full rounded-xl border px-4 py-3.5 " + quietSurface
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                    accentIconSurface
                  }
                >
                  <CameraIcon size={14} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[0.61rem] text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!uploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className={"h-8 w-8 rounded-lg " + quietIconButton}
                    aria-label="Clear selected image"
                  >
                    <Trash2Icon size={13} aria-hidden="true" />
                  </Button>
                )}
              </div>
              {uploading && (
                <UploadProgress value={progress} className="mt-3" />
              )}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onChoose}
              disabled={uploading}
              className={
                "mt-5 h-10 rounded-lg px-4 text-xs font-semibold " +
                secondaryButton
              }
            >
              <UploadIcon size={14} aria-hidden="true" />
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
            className={
              "h-10 rounded-lg px-4 text-xs font-semibold " + secondaryButton
            }
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onUpload}
            disabled={!file || uploading}
            className={
              "h-10 rounded-lg px-4 text-xs font-semibold " + primaryButton
            }
          >
            {uploading ? (
              <>
                <LoaderCircleIcon
                  size={14}
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
                Uploading
              </>
            ) : (
              <>
                <SaveIcon size={14} aria-hidden="true" />
                Save picture
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
function DocumentPreviewDialog({
  preview,
  downloading,
  onClose,
  onRetry,
  onDownload,
}: {
  preview: DocumentPreviewState | null;
  downloading: boolean;
  onClose: () => void;
  onRetry: (document: UserDocumentDto) => void;
  onDownload: (document: UserDocumentDto) => void;
}) {
  if (!preview) return null;
  const { document, url, loading, error } = preview;
  const isImage = document.contentType.startsWith("image/");
  const isPdf = document.contentType === "application/pdf";
  function openExternally() {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-foreground/45 px-3 py-4 backdrop-blur-[2px] sm:px-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-preview-title"
        className="flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border/65 bg-card text-card-foreground shadow-lg shadow-black/5 dark:border-border dark:bg-card"
      >
        <div className="flex shrink-0 items-start justify-between gap-5 border-b border-border/55 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Document preview
              </p>
              <DocumentStatusBadge status={document.reviewStatus} />
            </div>
            <h2
              id="document-preview-title"
              className="mt-2 truncate text-base font-semibold tracking-[-0.02em] text-foreground sm:text-lg"
            >
              {document.originalFileName}
            </h2>
            <p className="mt-1 text-[0.61rem] text-muted-foreground">
              {getDocumentTypeLabel(document.documentType)} ·{" "}
              {formatFileSize(document.sizeBytes)} ·{" "}
              {formatDocumentDate(document.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {url && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={openExternally}
                className={"h-8 w-8 rounded-lg " + quietIconButton}
                title="Open in new tab"
                aria-label={`Open ${document.originalFileName} in new tab`}
              >
                <ExternalLinkIcon size={14} aria-hidden="true" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={"h-8 w-8 rounded-lg " + quietIconButton}
              aria-label="Close document preview"
            >
              <XIcon size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-surface-2/30 p-3 sm:p-4 dark:bg-surface-2/45">
          {loading ? (
            <div className="flex h-[65vh] min-h-80 items-center justify-center rounded-xl border border-border/55 bg-card">
              <div className="text-center">
                <LoaderCircleIcon
                  size={22}
                  aria-hidden="true"
                  className="mx-auto animate-spin text-brand-secondary-highlight motion-reduce:animate-none dark:text-secondary"
                />
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  Preparing preview
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-[50vh] min-h-72 items-center justify-center rounded-xl border border-border/55 bg-card px-6">
              <div className="max-w-sm text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/[0.07] text-destructive">
                  <AlertCircleIcon size={17} aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  Preview unavailable
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {error}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onRetry(document)}
                  className={
                    "mt-5 h-9 rounded-lg px-4 text-xs font-semibold " +
                    secondaryButton
                  }
                >
                  <RefreshCwIcon size={13} aria-hidden="true" />
                  Try again
                </Button>
              </div>
            </div>
          ) : url && isImage ? (
            <div className="flex h-[68vh] min-h-80 items-center justify-center overflow-auto rounded-xl border border-border/55 bg-card p-3 sm:p-5">
              <img
                src={url}
                alt={document.originalFileName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : url && isPdf ? (
            <div className="h-[68vh] min-h-80 overflow-hidden rounded-xl border border-border/55 bg-card">
              <iframe
                src={url}
                title={document.originalFileName}
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="flex h-[50vh] min-h-72 items-center justify-center rounded-xl border border-border/55 bg-card px-6">
              <div className="max-w-sm text-center">
                <span
                  className={
                    "mx-auto flex h-10 w-10 items-center justify-center rounded-lg " +
                    accentIconSurface
                  }
                >
                  <FileTextIcon size={17} aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  This file cannot be previewed here
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Open the file in a new tab or download it to view it.
                </p>
                {url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openExternally}
                    className={
                      "mt-5 h-9 rounded-lg px-4 text-xs font-semibold " +
                      secondaryButton
                    }
                  >
                    <ExternalLinkIcon size={13} aria-hidden="true" />
                    Open file
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/55 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2 text-[0.6rem] text-muted-foreground">
            <LockKeyholeIcon size={12} aria-hidden="true" />
            Private document
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={
                "h-9 rounded-lg px-4 text-xs font-semibold " + secondaryButton
              }
            >
              Close
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onDownload(document)}
              disabled={!url || downloading}
              className={
                "h-9 rounded-lg px-4 text-xs font-semibold " + primaryButton
              }
            >
              {downloading ? (
                <LoaderCircleIcon
                  size={13}
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
              ) : (
                <DownloadIcon size={13} aria-hidden="true" />
              )}
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityDocumentManager({
  document,
  loading,
  error,
  file,
  progress,
  uploading,
  uploadError,
  previewing,
  downloading,
  inputRef,
  onChoose,
  onFileChange,
  onClear,
  onUpload,
  onPreview,
  onDownload,
  onDelete,
  onRetry,
}: {
  document: UserDocumentDto | null;
  loading: boolean;
  error: string | null;
  file: File | null;
  progress: number;
  uploading: boolean;
  uploadError: string | null;
  previewing: boolean;
  downloading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onChoose: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onUpload: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onRetry: () => void;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-foreground">
              Identity verification
            </p>
            {!document && (
              <span className="rounded-md bg-status-pending/[0.08] px-2 py-1 text-[10px] font-semibold text-status-pending-foreground ring-1 ring-inset ring-status-pending/15">
                Required for verification
              </span>
            )}
          </div>
          <p className="mt-1 max-w-2xl text-[0.61rem] leading-5 text-muted-foreground">
            Upload an identity document matching your ID number. Once reviewed,
            it can contribute to the verification status clients see on your
            profile.
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
          {document ? "1 of 1" : "0 of 1"}
        </span>
      </div>
      {error && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-3.5 py-3">
          <p className="text-xs text-destructive">{error}</p>
          <Button
            type="button"
            variant="ghost"
            onClick={onRetry}
            className={
              "h-8 rounded-lg px-3 text-xs font-semibold " + secondaryButton
            }
          >
            <RefreshCwIcon size={13} aria-hidden="true" />
            Retry
          </Button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
        disabled={uploading}
      />
      <div className="mt-3">
        {loading ? (
          <DocumentRowSkeleton />
        ) : document ? (
          <DocumentRow
            document={document}
            previewing={previewing}
            downloading={downloading}
            onPreview={onPreview ?? (() => undefined)}
            onDownload={onDownload ?? (() => undefined)}
            onDelete={onDelete}
          />
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border border-status-pending/20 bg-status-pending/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
                <ShieldCheckIcon size={15} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Identity document not submitted
                </p>
                <p className="mt-1 max-w-lg text-[0.61rem] leading-5 text-muted-foreground">
                  Submit your identity document to begin account verification.
                  PDF, JPEG, PNG or WebP · Maximum 10 MB.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onChoose}
              disabled={uploading}
              className={
                "h-9 shrink-0 rounded-lg px-4 text-xs font-semibold " +
                secondaryButton
              }
            >
              <UploadIcon size={13} aria-hidden="true" />
              Choose document
            </Button>
          </div>
        )}
      </div>
      {file && !document && (
        <SelectedDocument
          file={file}
          typeLabel="Identity document"
          progress={progress}
          uploading={uploading}
          onClear={onClear}
          onUpload={onUpload}
        />
      )}
      {document && document.reviewStatus !== "Approved" && (
        <p className="mt-2 text-[0.59rem] leading-5 text-muted-foreground">
          Documents are not edited in place. Remove this file first if you need
          to submit a different copy.
        </p>
      )}
      {uploadError && <InlineError message={uploadError} />}
    </div>
  );
}
function SelectedDocument({
  file,
  typeLabel,
  progress,
  uploading,
  onClear,
  onUpload,
}: {
  file: File;
  typeLabel: string;
  progress: number;
  uploading: boolean;
  onClear: () => void;
  onUpload: () => void;
}) {
  return (
    <div className={"mt-4 rounded-lg border p-4 " + cardSurface}>
      <div className="flex items-center gap-3">
        <span
          className={
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
            accentIconSurface
          }
        >
          <FileTextIcon size={14} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">
            {file.name}
          </p>
          <p className="mt-0.5 text-[0.61rem] text-muted-foreground">
            {formatFileSize(file.size)} · {typeLabel}
          </p>
        </div>
        {!uploading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClear}
            className={"h-8 w-8 rounded-lg " + quietIconButton}
            aria-label="Clear selected document"
          >
            <XIcon size={13} aria-hidden="true" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={onUpload}
          disabled={uploading}
          className={
            "h-8 rounded-lg px-3 text-xs font-semibold " + primaryButton
          }
        >
          {uploading ? (
            <>
              <LoaderCircleIcon
                size={13}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
              Uploading
            </>
          ) : (
            <>
              <UploadIcon size={13} aria-hidden="true" />
              Upload
            </>
          )}
        </Button>
      </div>
      {uploading && <UploadProgress value={progress} className="mt-3" />}
    </div>
  );
}
function DocumentRow({
  document,
  previewing,
  downloading,
  onPreview,
  onDownload,
  onDelete,
}: {
  document: UserDocumentDto;
  previewing: boolean;
  downloading: boolean;
  onPreview: () => void;
  onDownload: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={
        "flex items-center gap-3 rounded-xl border px-4 py-3.5 " + cardSurface
      }
    >
      <span
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg " +
          accentIconSurface
        }
      >
        <FileTextIcon size={15} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className="max-w-full truncate text-xs font-semibold text-foreground"
            title={document.originalFileName}
          >
            {document.originalFileName}
          </p>
          <DocumentStatusBadge status={document.reviewStatus} />
        </div>
        <p className="mt-1 text-[0.6rem] leading-5 text-muted-foreground">
          {getDocumentTypeLabel(document.documentType)} ·{" "}
          {formatFileSize(document.sizeBytes)} ·{" "}
          {formatDocumentDate(document.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onPreview}
          disabled={previewing}
          className={"h-8 w-8 rounded-lg " + quietIconButton}
          title="Preview document"
          aria-label={`Preview ${document.originalFileName}`}
        >
          {previewing ? (
            <LoaderCircleIcon
              size={13}
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <EyeIcon size={13} aria-hidden="true" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDownload}
          disabled={downloading}
          className={"h-8 w-8 rounded-lg " + quietIconButton}
          title="Download document"
          aria-label={`Download ${document.originalFileName}`}
        >
          {downloading ? (
            <LoaderCircleIcon
              size={13}
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <DownloadIcon size={13} aria-hidden="true" />
          )}
        </Button>
        {onDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className={
              "h-8 w-8 rounded-lg bg-transparent text-muted-foreground shadow-none transition-colors duration-150 hover:bg-destructive/[0.07] hover:text-destructive focus-visible:bg-destructive/[0.07] focus-visible:text-destructive dark:hover:bg-destructive/[0.10] dark:focus-visible:bg-destructive/[0.10] motion-reduce:transition-none " +
              focus
            }
            title="Remove document"
            aria-label={`Remove ${document.originalFileName}`}
          >
            <Trash2Icon size={13} aria-hidden="true" />
          </Button>
        ) : (
          <span
            className="flex h-8 w-8 items-center justify-center text-muted-foreground/45"
            title="Approved documents are locked"
          >
            <LockKeyholeIcon size={12} aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  );
}
function DocumentStatusBadge({ status }: { status: UserDocumentReviewStatus }) {
  const className =
    status === "Approved"
      ? "bg-status-complete/[0.08] text-status-complete-foreground ring-status-complete/15"
      : status === "Rejected"
        ? "bg-destructive/[0.06] text-destructive ring-destructive/15"
        : "bg-status-pending/[0.08] text-status-pending-foreground ring-status-pending/15";
  return (
    <span
      className={
        "rounded-md px-2 py-1 text-[10px] font-semibold ring-1 ring-inset " +
        className
      }
    >
      {status}
    </span>
  );
}
function DocumentRowSkeleton() {
  return (
    <div
      className={
        "flex items-center gap-3 rounded-xl border px-4 py-3.5 " + cardSurface
      }
    >
      <Skeleton className="h-9 w-9 rounded-lg" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-3.5 w-48 max-w-full" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}
function DeleteDocumentWarning({
  document,
  loading,
  onCancel,
  onConfirm,
}: {
  document: UserDocumentDto | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!document) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-foreground/35 px-4 py-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-document-title"
        aria-describedby="delete-document-description"
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/65 bg-card p-5 text-card-foreground shadow-lg shadow-black/5 sm:p-6 dark:border-border dark:bg-card"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/[0.08] text-destructive">
            <Trash2Icon size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="delete-document-title"
              className="text-lg font-semibold tracking-[-0.025em] text-foreground"
            >
              Remove this document?
            </h2>
            <p
              id="delete-document-description"
              className="mt-2 break-words text-sm leading-7 text-muted-foreground"
            >
              <span className="font-medium text-foreground">
                {document.originalFileName}
              </span>{" "}
              will be removed from your profile and deleted from storage.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border/45 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className={
              "h-10 rounded-lg px-4 text-xs font-semibold " + secondaryButton
            }
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onConfirm}
            disabled={loading}
            className={
              "h-10 rounded-lg border border-destructive/15 bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-none transition-opacity duration-150 hover:bg-destructive hover:text-destructive-foreground hover:opacity-90 motion-reduce:transition-none " +
              focus
            }
          >
            {loading ? (
              <>
                <LoaderCircleIcon
                  size={14}
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
                Removing
              </>
            ) : (
              <>
                <Trash2Icon size={14} aria-hidden="true" />
                Remove document
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
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
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/35 px-4 py-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="hide-profile-title"
        aria-describedby="hide-profile-description"
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/65 bg-card p-5 text-card-foreground shadow-lg shadow-black/5 sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
            <ShieldAlertIcon size={17} aria-hidden="true" />
          </span>
          <div>
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
              Clients will no longer be able to discover your Allocat profile.
              Your profile information and work history will remain saved.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-border/45 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className={
              "h-10 rounded-lg px-4 text-xs font-semibold " + secondaryButton
            }
          >
            Keep visible
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onConfirm}
            disabled={loading}
            className={
              "h-10 rounded-lg bg-destructive px-4 text-xs font-semibold text-destructive-foreground shadow-none hover:bg-destructive hover:text-destructive-foreground hover:opacity-90 " +
              focus
            }
          >
            {loading ? (
              <LoaderCircleIcon
                size={14}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
            ) : (
              <EyeOffIcon size={14} aria-hidden="true" />
            )}
            Hide profile
          </Button>
        </div>
      </div>
    </div>
  );
}
function IncompleteAllocatSetup({
  accountProfile,
  onContinue,
}: {
  accountProfile: ProfileUser;
  onContinue: () => void;
}) {
  const initials = getInitials(accountProfile.fullName);
  return (
    <div className={"min-h-screen text-foreground " + pageCanvas}>
      <ProfileHeader />
      <main className="container mx-auto px-4 py-8 sm:px-6 md:px-8 lg:py-12">
        <section className={"max-w-4xl p-5 sm:p-6 " + profileSurface}>
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border border-border/70">
              <AvatarImage
                src={accountProfile.avatarUrl ?? undefined}
                alt={accountProfile.fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-brand-secondary-highlight/[0.08] text-xl font-semibold text-brand-secondary-highlight dark:bg-secondary/[0.08] dark:text-secondary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-secondary-highlight dark:text-secondary">
                Professional profile
              </p>
              <h1 className="mt-2 break-words text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground/95 sm:text-4xl">
                {accountProfile.fullName}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Professional profile setup not completed
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-status-pending/25 bg-status-pending/[0.055] p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
                <AlertCircleIcon size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-status-pending-foreground">
                  Profile incomplete
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
                  Finish setting up your Allocat profile
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Your Allocat account is active, but your professional profile
                  has not been created yet. Complete the setup so clients can
                  understand your skills, experience and working preferences.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onContinue}
                  className={
                    "mt-6 h-10 rounded-lg px-5 text-xs font-semibold " +
                    primaryButton
                  }
                >
                  Continue profile setup
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
function IncompleteProfileWarning({
  items,
  onComplete,
}: {
  items: IncompleteProfileItem[];
  onComplete: () => void;
}) {
  const visibleItems = items.slice(0, 4);
  const remaining = items.length - visibleItems.length;
  return (
    <div className="rounded-xl border border-status-pending/25 bg-status-pending/[0.055] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-pending/[0.10] text-status-pending-foreground">
          <AlertCircleIcon size={15} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground">
            Complete your professional profile
          </p>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground">
            You still have {items.length} key{" "}
            {items.length === 1 ? "detail" : "details"} to add.
          </p>
          <p className="mt-2 text-[0.62rem] leading-5 text-status-pending-foreground">
            Missing: {visibleItems.map((item) => item.label).join(", ")}
            {remaining > 0 ? ` and ${remaining} more` : ""}.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onComplete}
          className={
            "h-9 shrink-0 rounded-lg px-4 text-xs font-semibold " +
            primaryButton
          }
        >
          Complete profile
        </Button>
      </div>
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
      className={
        "h-1.5 w-full overflow-hidden rounded-full bg-white/[0.12] " + className
      }
      role="progressbar"
      aria-label="Professional score"
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
function ProfileSection({
  sectionId,
  eyebrow,
  title,
  editing = false,
  onEdit,
  onCancel,
  children,
}: {
  sectionId?: string;
  eyebrow: string;
  title: string;
  editing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  children: ReactNode;
}) {
  return (
    <section id={sectionId} className={"scroll-mt-28 " + sectionSurface}>
      <div className="p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-5 rounded-full bg-brand-secondary-highlight dark:bg-secondary"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {eyebrow}
              </p>
            </div>
            <h2 className="mt-2.5 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
          {onEdit && !editing && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className={"h-9 w-9 shrink-0 rounded-lg " + quietIconButton}
              aria-label={`Edit ${title}`}
            >
              <Edit3Icon size={14} aria-hidden="true" />
            </Button>
          )}
          {editing && onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className={"h-9 w-9 shrink-0 rounded-lg " + quietIconButton}
              aria-label={`Close ${title} editor`}
            >
              <XIcon size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
        {children}
      </div>
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
    <div className="mt-7 flex justify-end gap-2 border-t border-border/45 pt-5">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={saving}
        className={
          "h-9 rounded-lg px-4 text-xs font-semibold " + secondaryButton
        }
      >
        Cancel
      </Button>
      <Button
        type={submit ? "submit" : "button"}
        variant="ghost"
        onClick={submit ? undefined : onSave}
        disabled={saving}
        className={"h-9 rounded-lg px-4 text-xs font-semibold " + primaryButton}
      >
        {saving ? (
          <>
            <LoaderCircleIcon
              size={13}
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
            Saving
          </>
        ) : (
          <>
            <SaveIcon size={13} aria-hidden="true" />
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
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
        {label}
      </p>
      {missing ? (
        <div className="mt-2">
          <MissingValue>{missingLabel}</MissingValue>
        </div>
      ) : (
        <p
          className={
            "mt-2 break-words text-sm " +
            (multiline
              ? "whitespace-pre-line leading-8 text-muted-foreground"
              : "font-medium leading-6 text-foreground/80") +
            (positive ? " text-status-complete-foreground" : "")
          }
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
function MissingValue({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-status-pending-foreground">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-pending"
      />
      {children}
    </span>
  );
}
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
      className={
        "min-w-0 px-5 py-4 " +
        (divided ? "border-t border-border/55 sm:border-l sm:border-t-0" : "")
      }
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
      className={
        "flex items-center gap-3 rounded-xl border px-4 py-4 " + quietSurface
      }
    >
      <span
        className={
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
          (missing
            ? "bg-status-pending/[0.08] text-status-pending-foreground"
            : accentIconSurface)
        }
      >
        <Icon size={14} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
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
    <div className={"rounded-xl border p-4 " + quietSurface}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={
            "flex h-8 w-8 items-center justify-center rounded-lg " +
            (verified
              ? accentIconSurface
              : "bg-surface-3/70 text-muted-foreground dark:bg-surface-2")
          }
        >
          <Icon size={14} aria-hidden="true" />
        </span>
        <span
          className={
            "text-[10px] font-semibold " +
            (verified
              ? "text-status-complete-foreground"
              : "text-status-pending-foreground")
          }
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
            className={
              "break-words text-right text-xs " +
              (strong
                ? "font-semibold text-brand-secondary-highlight dark:text-secondary"
                : muted
                  ? "font-medium text-muted-foreground"
                  : "font-semibold text-foreground")
            }
          >
            {value}
          </p>
        </div>
      )}
    </div>
  );
}
function AvailabilityDot({
  availability,
}: {
  availability: AllocatAvailability;
}) {
  return (
    <span
      aria-hidden="true"
      className={
        "h-1.5 w-1.5 shrink-0 rounded-full " +
        (availability === "available"
          ? "bg-status-complete"
          : availability === "busy"
            ? "bg-status-pending"
            : "bg-muted-foreground/40")
      }
    />
  );
}
function EmptyHistory() {
  return (
    <div className="rounded-xl border border-dashed border-border/65 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-3/70 text-muted-foreground ring-1 ring-inset ring-border/35 dark:bg-surface-2">
          <FolderCheckIcon size={15} aria-hidden="true" />
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
function InlineError({ message }: { message: string }) {
  return (
    <div
      className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-3.5 py-3 text-xs text-destructive"
      role="alert"
    >
      <AlertCircleIcon
        size={14}
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      />
      <p className="leading-5">{message}</p>
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
    <div className={"min-h-screen text-foreground " + pageCanvas}>
      <ProfileHeader context={false} />
      <main className="container mx-auto px-4 py-20 sm:px-6 md:px-8">
        <div className={"max-w-md p-5 sm:p-6 " + profileSurface}>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/[0.08] text-destructive">
            <AlertCircleIcon size={19} aria-hidden="true" />
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
            className={
              "mt-6 h-10 rounded-lg px-5 text-xs font-semibold " + primaryButton
            }
          >
            <RefreshCwIcon size={14} aria-hidden="true" />
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}
function AllocatProfileSkeleton() {
  return (
    <div className={"min-h-screen text-foreground " + pageCanvas}>
      <ProfileHeader context={false} />
      <main
        className="container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:py-8"
        role="status"
        aria-label="Loading Allocat profile"
      >
        <span className="sr-only">Loading Allocat profile</span>
        <div className={profileSurface + " overflow-hidden"}>
          <div className="flex items-center gap-5 p-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-7 w-56 max-w-full" />
              <Skeleton className="h-4 w-80 max-w-full" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>
          </div>
          <div className="grid border-t border-border/55 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="border-b border-border/55 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-3 h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-44 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <div className="hidden space-y-5 xl:block">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

function getIncompleteProfileItems(
  account: ProfileUser,
  profile: MyAllocatProfile,
): IncompleteProfileItem[] {
  const items: IncompleteProfileItem[] = [];
  if (!profile.title?.trim())
    items.push({ key: "title", label: "professional title", section: "about" });
  if (!profile.bio?.trim())
    items.push({ key: "bio", label: "professional bio", section: "about" });
  if (!profile.idNumber?.trim())
    items.push({ key: "id-number", label: "ID number", section: "about" });
  if (profile.skills.length === 0)
    items.push({ key: "skills", label: "skills", section: "skills" });
  if (profile.yearsExperience == null)
    items.push({
      key: "experience",
      label: "years of experience",
      section: "work",
    });
  if (profile.hourlyRate == null || profile.hourlyRate <= 0)
    items.push({ key: "rate", label: "hourly rate", section: "work" });
  if (!profile.operatingCountryCode || profile.operatingCityId == null)
    items.push({
      key: "operating-location",
      label: "operating location",
      section: "work",
    });
  if (!account.countryCode?.trim())
    items.push({
      key: "residence",
      label: "residence country",
      section: "account",
    });
  if (!account.phoneNumber?.trim())
    items.push({ key: "phone", label: "phone number", section: "account" });
  return items;
}
function toAccountDraft(account: ProfileUser): AccountDraft {
  return {
    fullName: account.fullName ?? "",
    phoneNumber: account.phoneNumber ?? "",
    countryCode: account.countryCode ?? "",
    cityName: account.cityName ?? "",
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
    operatingCountryCode: profile.operatingCountryCode ?? "",
    operatingCityId: profile.operatingCityId?.toString() ?? "",
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
    hourlyRate: parseNullableNumber(draft.hourlyRate),
    currency: draft.currency.trim().toUpperCase(),
    availability: draft.availability,
    yearsExperience: parseNullableInteger(draft.yearsExperience),
    skillIds: draft.skillIds,
  };
}
function validateProfessionalDraft(draft: ProfessionalDraft) {
  if (!draft.idNumber.trim()) return "ID number is required.";
  if (draft.skillIds.length === 0) return "Select at least one skill.";
  if (
    draft.currency.trim().length !== 3 ||
    !/^[A-Za-z]{3}$/.test(draft.currency.trim())
  )
    return "Currency must use a three-letter code such as USD.";
  if (draft.hourlyRate.trim()) {
    const hourlyRate = Number(draft.hourlyRate);
    if (!Number.isFinite(hourlyRate)) return "Enter a valid hourly rate.";
    if (hourlyRate < 0) return "Hourly rate cannot be negative.";
  }
  if (draft.yearsExperience.trim()) {
    const yearsExperience = Number(draft.yearsExperience);
    if (!Number.isInteger(yearsExperience))
      return "Years of experience must be a whole number.";
    if (yearsExperience < 0 || yearsExperience > 80)
      return "Years of experience must be between 0 and 80.";
  }
  return null;
}
function normalizeUserDocument(document: ApiUserDocumentDto): UserDocumentDto {
  return {
    ...document,
    documentType: normalizeDocumentType(document.documentType),
    reviewStatus: normalizeReviewStatus(document.reviewStatus),
  };
}
function normalizeDocumentType(value: unknown): UserDocumentType {
  if (typeof value === "number") {
    const values: UserDocumentType[] = [
      "Identity",
      "Qualification",
      "Certification",
      "ProfessionalLicense",
      "Training",
      "Other",
    ];
    return values[value] ?? "Other";
  }
  const normalized = String(value ?? "")
    .replace(/[\s_-]/g, "")
    .toLowerCase();
  switch (normalized) {
    case "identity":
      return "Identity";
    case "qualification":
      return "Qualification";
    case "certification":
      return "Certification";
    case "professionallicense":
    case "professionallicence":
      return "ProfessionalLicense";
    case "training":
      return "Training";
    default:
      return "Other";
  }
}
function normalizeReviewStatus(value: unknown): UserDocumentReviewStatus {
  if (typeof value === "number") {
    const values: UserDocumentReviewStatus[] = [
      "Pending",
      "Approved",
      "Rejected",
    ];
    return values[value] ?? "Pending";
  }
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
}
function sortDocuments(documents: UserDocumentDto[]) {
  return [...documents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
function getDocumentTypeLabel(type: UserDocumentType) {
  if (type === "Identity") return "Identity document";
  return (
    PROFESSIONAL_DOCUMENT_OPTIONS.find((option) => option.value === type)
      ?.label ?? "Document"
  );
}
function formatDocumentDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function cleanOptional(value: string) {
  return value.trim() || null;
}
function parseNullableNumber(value: string) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
function parseNullableInteger(value: string) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}
function getInitials(name?: string | null) {
  if (!name?.trim()) return "A";
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
function getScoreLabel(score: number) {
  if (score >= 90) return "Outstanding profile";
  if (score >= 75) return "Strong profile";
  if (score >= 50) return "Good foundation";
  return "Build your profile";
}
function formatAvailability(availability: AllocatAvailability) {
  return availability.charAt(0).toUpperCase() + availability.slice(1);
}
function formatResponseTime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
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
function formatShortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}
function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    if ("detail" in data && typeof data.detail === "string") return data.detail;
    if ("message" in data && typeof data.message === "string")
      return data.message;
    if ("title" in data && typeof data.title === "string") return data.title;
  }
  return fallback;
}
export default AllocatProfilePage;
