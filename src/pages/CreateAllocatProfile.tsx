import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { isAxiosError } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknoteIcon,
  BriefcaseBusinessIcon,
  CameraIcon,
  CheckIcon,
  CircleDollarSignIcon,
  FileBadgeIcon,
  FileCheckIcon,
  FileTextIcon,
  GraduationCapIcon,
  IdCardIcon,
  LoaderCircleIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
  WandSparklesIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";

import type {
  AllocatAvailability,
  AllocatSkill,
  MyAllocatProfile,
} from "@/Types/allocatProfile";

import type { ProfileUser } from "@/Types/profileUser";

import DashboardMainNav from "@/components/DashboardMainNav";

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

const CREATE_ALLOCAT_PROFILE_ENDPOINT = "/allocats/profiles";
const ALLOCAT_PROFILE_ROUTE = "/allocats/profile";

type CreateAllocatProfilePayload = {
  idNumber: string;
  title: string | null;
  headline: string | null;
  bio: string | null;
  hourlyRate: number | null;
  currency: string;
  availability: AllocatAvailability;
  yearsExperience: number | null;
  skillIds: string[];
};

type SupportedCountry = {
  code: "ZW" | "ZA";
  name: string;
  currencyCode: "USD" | "ZAR";
  currencyName: string;
  currencySymbol: string;
  cities: string[];
};

type FormState = {
  title: string;
  headline: string;
  bio: string;

  countryCode: string;
  city: string;
  phoneNumber: string;

  yearsExperience: string;
  availability: AllocatAvailability;
  hourlyRate: string;

  skillIds: string[];

  idNumber: string;
};

type UserDocumentType =
  | "Identity"
  | "Qualification"
  | "Certification"
  | "ProfessionalLicense"
  | "Training"
  | "Other";

type ProfessionalDocumentType = Exclude<UserDocumentType, "Identity">;

type VerificationDocumentDraft = {
  id: string;
  type: ProfessionalDocumentType;
  file: File;
};

type StepDefinition = {
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
};

type ReviewRowProps = {
  label: string;
  value: ReactNode;
  missing?: boolean;
};

const SUPPORTED_ALLOCAT_COUNTRIES: SupportedCountry[] = [
  {
    code: "ZW",
    name: "Zimbabwe",
    currencyCode: "USD",
    currencyName: "United States Dollar",
    currencySymbol: "$",
    cities: [
      "Harare",
      "Bulawayo",
      "Chitungwiza",
      "Mutare",
      "Gweru",
      "Masvingo",
      "Kwekwe",
      "Kadoma",
      "Victoria Falls",
      "Marondera",
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    currencyCode: "ZAR",
    currencyName: "South African Rand",
    currencySymbol: "R",
    cities: [
      "Johannesburg",
      "Cape Town",
      "Pretoria",
      "Durban",
      "Gqeberha",
      "Bloemfontein",
      "East London",
      "Polokwane",
      "Mbombela",
      "Kimberley",
    ],
  },
];

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const MAX_ID_DOCUMENT_SIZE = 10 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const MAX_DOCUMENTS = 8;

const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const STEPS: StepDefinition[] = [
  {
    title: "Introduce your work",
    shortTitle: "Professional",
    description:
      "Give clients a clear picture of what you do and the kind of work you are best suited for.",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Where are you based?",
    shortTitle: "Location",
    description:
      "Allocats currently operate from supported regions. Your country also determines the currency used for your profile.",
    icon: MapPinIcon,
  },
  {
    title: "Set your working preferences",
    shortTitle: "Work",
    description:
      "Tell clients about your experience, availability and starting hourly rate.",
    icon: CircleDollarSignIcon,
  },
  {
    title: "What can you do?",
    shortTitle: "Skills",
    description:
      "Choose the skills that best represent the work you can confidently deliver.",
    icon: SparklesIcon,
  },
  {
    title: "Confirm your identity",
    shortTitle: "Identity",
    description:
      "Your identification details stay private and help us verify that professional profiles belong to real people.",
    icon: IdCardIcon,
  },
  {
    title: "Add professional credentials",
    shortTitle: "Credentials",
    description:
      "Qualifications and certifications help support verification. You can skip these during setup and add them later.",
    icon: GraduationCapIcon,
  },
  {
    title: "Review your profile",
    shortTitle: "Review",
    description:
      "Check your information before creating your Allocat profile. You can continue improving it afterwards.",
    icon: FileCheckIcon,
  },
];

const initialForm: FormState = {
  title: "",
  headline: "",
  bio: "",

  countryCode: "",
  city: "",
  phoneNumber: "",

  yearsExperience: "",
  availability: "available",
  hourlyRate: "",

  skillIds: [],

  idNumber: "",
};

const primaryButton = [
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground shadow-none",
  "transition-opacity duration-150",
  "hover:border-brand-secondary-highlight/15 hover:bg-brand-secondary-highlight hover:text-primary-foreground hover:opacity-90",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-secondary/10 dark:bg-secondary dark:text-secondary-foreground",
  "dark:hover:border-secondary/10 dark:hover:bg-secondary dark:hover:text-secondary-foreground dark:hover:opacity-90",
  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryButton = [
  "border border-border/65 bg-surface-2/35 text-foreground/75 shadow-none",
  "transition-opacity duration-150",
  "hover:border-border/65 hover:bg-surface-2/35 hover:text-foreground/75 hover:opacity-75",
  "focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:border-border dark:bg-surface-2/65 dark:text-foreground/75",
  "dark:hover:border-border dark:hover:bg-surface-2/65 dark:hover:text-foreground/75 dark:hover:opacity-75",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const quietButton = [
  "bg-transparent text-muted-foreground shadow-none transition-opacity duration-150",
  "hover:bg-transparent hover:text-foreground hover:opacity-70",
].join(" ");

const fieldClass = [
  "h-11 rounded-lg border-border/70 bg-surface-1/70 shadow-none",
  "transition-[border-color,box-shadow,background-color]",
  "focus-visible:border-brand-secondary-highlight/35 focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/20",
  "dark:bg-surface-2/35 dark:focus-visible:border-secondary/25 dark:focus-visible:ring-secondary/15",
].join(" ");

const selectTriggerClass = [
  "h-11 w-full rounded-lg border border-border/70 bg-surface-1/70 px-3.5 text-sm text-foreground shadow-none",
  "transition-[border-color,box-shadow,background-color]",
  "focus:border-brand-secondary-highlight/35 focus:ring-1 focus:ring-brand-secondary-highlight/20",
  "focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/20",
  "data-[placeholder]:text-muted-foreground",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "dark:border-border dark:bg-surface-2/35",
  "dark:focus:border-secondary/25 dark:focus:ring-secondary/15",
  "dark:focus-visible:ring-secondary/15",
].join(" ");

const selectContentClass = [
  "rounded-xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-none",
  "dark:border-border dark:bg-popover",
].join(" ");

const selectItemClass = [
  "rounded-lg px-2.5 py-2 text-sm text-foreground/80",
  "focus:bg-surface-3/60 focus:text-foreground",
  "data-[highlighted]:bg-surface-3/60 data-[highlighted]:text-foreground",
  "dark:focus:bg-surface-3/70 dark:focus:text-foreground",
  "dark:data-[highlighted]:bg-surface-3/70 dark:data-[highlighted]:text-foreground",
].join(" ");

const cardSurface = "border-border/55 bg-card dark:border-border dark:bg-card";

const quietSurface =
  "border-border/55 bg-surface-2/30 dark:border-border dark:bg-surface-2/55";

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10",
  "dark:bg-secondary/[0.07] dark:text-secondary dark:ring-secondary/10",
].join(" ");

const skillTagClass = [
  "inline-flex min-h-8 items-center gap-2 rounded-lg px-3 py-1.5",
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight",
  "ring-1 ring-inset ring-brand-secondary-highlight/10",
  "text-xs font-semibold",
  "dark:bg-secondary/[0.08] dark:text-secondary dark:ring-secondary/10",
].join(" ");

function CreateAllocatProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [accountProfile, setAccountProfile] = useState<ProfileUser | null>(
    null,
  );

  const [skills, setSkills] = useState<AllocatSkill[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [stepError, setStepError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitPhase, setSubmitPhase] = useState<string | null>(null);
  const [submitProgress, setSubmitProgress] = useState(0);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const idDocumentInputRef = useRef<HTMLInputElement | null>(null);

  const [documentType, setDocumentType] =
    useState<ProfessionalDocumentType>("Qualification");

  const [verificationDocuments, setVerificationDocuments] = useState<
    VerificationDocumentDraft[]
  >([]);

  const documentInputRef = useRef<HTMLInputElement | null>(null);

  const loadSkills = useCallback(async () => {
    try {
      setLoadingSkills(true);

      const response = await api.get<AllocatSkill[]>("/skills", {
        withCredentials: true,
      });

      setSkills(
        [...response.data].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } catch (error) {
      console.error("Could not load skills:", error);

      setPageError(
        getApiErrorMessage(error, "The skill catalogue could not be loaded."),
      );
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  const loadPage = useCallback(async () => {
    if (!user?.isAllocat) {
      return;
    }

    try {
      setLoading(true);
      setPageError(null);

      try {
        await api.get<MyAllocatProfile>("/allocats/profiles/me", {
          withCredentials: true,
        });

        navigate(ALLOCAT_PROFILE_ROUTE, {
          replace: true,
        });

        return;
      } catch (error) {
        if (!isAxiosError(error) || error.response?.status !== 404) {
          throw error;
        }
      }

      const accountResponse = await api.get<ProfileUser>("/profiles/me", {
        withCredentials: true,
      });

      const account = accountResponse.data;
      const location = inferSupportedAllocatLocation(account.location);

      setAccountProfile(account);

      setForm((current) => ({
        ...current,
        phoneNumber: account.phoneNumber ?? "",
        countryCode: location?.countryCode ?? "",
        city: location?.city ?? "",
      }));

      await loadSkills();
    } catch (error) {
      console.error("Could not start Allocat setup:", error);

      setPageError(
        getApiErrorMessage(error, "Allocat setup could not be loaded."),
      );
    } finally {
      setLoading(false);
    }
  }, [user?.isAllocat, navigate, loadSkills]);

  useEffect(() => {
    if (!user?.isAllocat) {
      return;
    }

    void loadPage();
  }, [user?.isAllocat, loadPage]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const currentStep = STEPS[step];

  const selectedCountry = useMemo(
    () =>
      SUPPORTED_ALLOCAT_COUNTRIES.find(
        (country) => country.code === form.countryCode,
      ) ?? null,
    [form.countryCode],
  );

  const availableCities = selectedCountry?.cities ?? [];
  const currencyCode = selectedCountry?.currencyCode ?? "USD";
  const currencyName = selectedCountry?.currencyName ?? "United States Dollar";
  const currencySymbol = selectedCountry?.currencySymbol ?? "$";

  const formattedLocation =
    selectedCountry && form.city ? `${form.city}, ${selectedCountry.name}` : "";

  const selectedSkills = useMemo(
    () =>
      form.skillIds
        .map((skillId) => skills.find((skill) => skill.id === skillId))
        .filter((skill): skill is AllocatSkill => Boolean(skill)),
    [form.skillIds, skills],
  );

  const initials = useMemo(
    () => getInitials(accountProfile?.fullName),
    [accountProfile?.fullName],
  );

  const progress = ((step + 1) / STEPS.length) * 100;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setStepError(null);
    setSubmitError(null);
  }

  function handleCountryChange(countryCode: string) {
    setForm((current) => ({
      ...current,
      countryCode,
      city: "",
    }));

    setStepError(null);
    setSubmitError(null);
  }

  function goNext() {
    if (creating) {
      return;
    }

    const error = validateStep(step, form);

    if (error) {
      setStepError(error);
      return;
    }

    setStepError(null);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    if (creating) {
      return;
    }

    setStepError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setStepError(null);

    if (!file) {
      return;
    }

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setStepError("Choose a JPEG, PNG or WebP profile picture.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setStepError("Your profile picture must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function removeAvatar() {
    if (creating) {
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(null);
    setAvatarPreview(null);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  }

  function handleIdDocumentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setStepError(null);

    if (!file) {
      return;
    }

    const error = validateDocumentFile(file, MAX_ID_DOCUMENT_SIZE);

    if (error) {
      setStepError(error);
      event.target.value = "";
      return;
    }

    setIdDocument(file);
  }

  function removeIdDocument() {
    if (creating) {
      return;
    }

    setIdDocument(null);

    if (idDocumentInputRef.current) {
      idDocumentInputRef.current.value = "";
    }
  }

  function handleVerificationFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    setStepError(null);

    if (files.length === 0) {
      return;
    }

    if (verificationDocuments.length + files.length > MAX_DOCUMENTS) {
      setStepError(
        `You can add up to ${MAX_DOCUMENTS} professional documents.`,
      );

      event.target.value = "";
      return;
    }

    for (const file of files) {
      const error = validateDocumentFile(file, MAX_DOCUMENT_SIZE);

      if (error) {
        setStepError(error);
        event.target.value = "";
        return;
      }
    }

    const additions: VerificationDocumentDraft[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      type: documentType,
      file,
    }));

    setVerificationDocuments((current) => [...current, ...additions]);
    event.target.value = "";
  }

  function removeVerificationDocument(id: string) {
    if (creating) {
      return;
    }

    setVerificationDocuments((current) =>
      current.filter((document) => document.id !== id),
    );
  }

  async function uploadProfilePicture(file: File) {
    const data = new FormData();

    data.append("file", file);

    await api.post("/profiles/profile-picture", data, {
      withCredentials: true,
    });
  }

  async function uploadUserDocument(
    documentType: UserDocumentType,
    file: File,
  ) {
    const data = new FormData();

    data.append("documentType", documentType);
    data.append("file", file);

    await api.post("/allocats/profiles/me/documents", data, {
      withCredentials: true,
    });
  }

  async function createProfile() {
    const finalError = validateAll(form);

    if (finalError) {
      setSubmitError(finalError);
      return;
    }

    if (!accountProfile || !selectedCountry || creating) {
      return;
    }

    const payload: CreateAllocatProfilePayload = {
      idNumber: form.idNumber.trim(),
      title: cleanOptional(form.title),
      headline: cleanOptional(form.headline),
      bio: cleanOptional(form.bio),
      hourlyRate: parseNullableNumber(form.hourlyRate),
      currency: selectedCountry.currencyCode,
      availability: form.availability,
      yearsExperience: parseNullableInteger(form.yearsExperience),
      skillIds: form.skillIds,
    };

    setCreating(true);
    setSubmitError(null);
    setSubmitProgress(0);
    setSubmitPhase("Creating your professional profile");

    try {
      await api.post<MyAllocatProfile>(
        CREATE_ALLOCAT_PROFILE_ENDPOINT,
        payload,
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Could not create Allocat profile:", error);

      setSubmitError(
        getApiErrorMessage(error, "Your Allocat profile could not be created."),
      );

      setSubmitPhase(null);
      setCreating(false);
      return;
    }

    const warnings: string[] = [];
    const newLocation = `${form.city}, ${selectedCountry.name}`;

    const accountChanged =
      newLocation !== (accountProfile.location ?? "").trim() ||
      form.phoneNumber.trim() !== (accountProfile.phoneNumber ?? "").trim();

    setSubmitProgress(20);

    if (accountChanged) {
      setSubmitPhase("Saving your location and contact details");

      try {
        const response = await api.patch<ProfileUser>(
          "/profiles/me",
          {
            fullName: accountProfile.fullName,
            phoneNumber: form.phoneNumber.trim() || null,
            location: newLocation,
          },
          {
            withCredentials: true,
          },
        );

        setAccountProfile(response.data);
      } catch (error) {
        console.error("Could not update account details:", error);

        warnings.push(
          "Your location or phone number could not be updated. You can correct it from your profile.",
        );
      }
    }

    setSubmitProgress(35);

    if (avatarFile) {
      setSubmitPhase("Uploading your profile picture");

      try {
        await uploadProfilePicture(avatarFile);
      } catch (error) {
        console.error("Could not upload profile picture:", error);

        warnings.push(
          "Your profile picture could not be uploaded. You can add it from your profile.",
        );
      }
    }

    setSubmitProgress(50);

    if (idDocument) {
      setSubmitPhase("Uploading your identity document");

      try {
        await uploadUserDocument("Identity", idDocument);
      } catch (error) {
        console.error("Could not upload identity document:", error);

        warnings.push(
          getApiErrorMessage(
            error,
            "Your identity document could not be uploaded. You can submit it from your profile.",
          ),
        );
      }
    }

    setSubmitProgress(65);

    let failedProfessionalDocuments = 0;

    for (let index = 0; index < verificationDocuments.length; index += 1) {
      const document = verificationDocuments[index];

      setSubmitPhase(
        `Uploading professional document ${index + 1} of ${
          verificationDocuments.length
        }`,
      );

      try {
        await uploadUserDocument(document.type, document.file);
      } catch (error) {
        console.error(
          `Could not upload professional document ${document.file.name}:`,
          error,
        );

        failedProfessionalDocuments += 1;
      }

      const credentialProgress =
        verificationDocuments.length > 0
          ? ((index + 1) / verificationDocuments.length) * 25
          : 25;

      setSubmitProgress(Math.round(65 + credentialProgress));
    }

    if (failedProfessionalDocuments > 0) {
      warnings.push(
        `${failedProfessionalDocuments} ${
          failedProfessionalDocuments === 1
            ? "professional document"
            : "professional documents"
        } could not be uploaded. You can add them from your profile.`,
      );
    }

    setSubmitProgress(92);
    setSubmitPhase("Finishing your profile");

    try {
      await refreshUser();
    } catch (error) {
      console.error("Could not refresh authenticated user:", error);
    }

    setSubmitProgress(100);

    toast.success("Your Allocat profile is ready", {
      description:
        idDocument || verificationDocuments.length > 0
          ? "Your selected verification documents have been submitted for review."
          : "You can now review and manage your professional profile.",
    });

    if (warnings.length > 0) {
      toast.warning("Some profile details need attention", {
        description: warnings.join(" "),
      });
    }

    navigate(ALLOCAT_PROFILE_ROUTE, {
      replace: true,
    });
  }

  if (user && !user.isAllocat) {
    return <Navigate to="/projects" replace />;
  }

  if (!user || loading) {
    return <CreateAllocatProfileSkeleton />;
  }

  if (pageError || !accountProfile) {
    return (
      <CreateAllocatProfileError
        message={pageError ?? "Allocat setup could not be loaded."}
        onRetry={loadPage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav>
            <div>
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Allocat
              </p>

              <p className="mt-0.5 text-xs font-semibold text-foreground">
                Profile setup
              </p>
            </div>
          </DashboardMainNav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Become an Allocat
              </p>
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-foreground/95 sm:text-4xl lg:text-[2.75rem]">
              Build your professional profile
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Tell us about the work you do, where you are based and how you
              prefer to work. We’ll keep each step focused.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-5">
            <p className="text-xs font-semibold text-foreground">
              Step {step + 1} of {STEPS.length}
            </p>

            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>

          <SetupProgress value={progress} className="mt-3" />

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <nav
                  aria-label="Allocat profile setup progress"
                  className="space-y-1"
                >
                  {STEPS.map((item, index) => {
                    const Icon = item.icon;
                    const active = index === step;
                    const complete = index < step;

                    return (
                      <div
                        key={item.shortTitle}
                        className={[
                          "flex items-center gap-3 rounded-xl px-3 py-3",
                          active ? "bg-surface-2/55 dark:bg-surface-2/65" : "",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                            complete
                              ? "bg-brand-secondary-highlight text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
                              : active
                                ? accentIconSurface
                                : "bg-surface-2/45 text-muted-foreground dark:bg-surface-2",
                          ].join(" ")}
                        >
                          {complete ? (
                            <CheckIcon size={13} />
                          ) : (
                            <Icon size={14} />
                          )}
                        </span>

                        <div className="min-w-0">
                          <p
                            className={[
                              "text-xs",
                              active
                                ? "font-semibold text-foreground"
                                : "font-medium text-muted-foreground",
                            ].join(" ")}
                          >
                            {item.shortTitle}
                          </p>

                          <p className="mt-0.5 text-[0.58rem] text-muted-foreground">
                            Step {index + 1}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </nav>

                <div className="mt-6 border-t border-border/50 pt-5">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheckIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"
                    />

                    <p className="text-[0.62rem] leading-5 text-muted-foreground">
                      Your identity information and verification documents are
                      private and are never displayed to clients.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <section
              className={[
                "min-w-0 rounded-2xl border p-5 sm:p-7 lg:p-8",
                cardSurface,
              ].join(" ")}
            >
              <div className="flex items-start gap-4 border-b border-border/50 pb-6">
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    accentIconSurface,
                  ].join(" ")}
                >
                  <currentStep.icon size={17} />
                </span>

                <div className="min-w-0">
                  <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Step {step + 1}
                  </p>

                  <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-foreground sm:text-2xl">
                    {currentStep.title}
                  </h2>

                  <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {step === 0 && (
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <ProfileField label="Professional title" hint="Optional">
                    <Input
                      value={form.title}
                      maxLength={120}
                      placeholder="e.g. Frontend Developer"
                      disabled={creating}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      className={fieldClass}
                    />

                    <FieldHelp>
                      Use a title clients will immediately understand.
                    </FieldHelp>
                  </ProfileField>

                  <ProfileField label="Headline" hint="Optional">
                    <Input
                      value={form.headline}
                      maxLength={180}
                      placeholder="e.g. Building fast, accessible web experiences"
                      disabled={creating}
                      onChange={(event) =>
                        updateField("headline", event.target.value)
                      }
                      className={fieldClass}
                    />

                    <FieldHelp>
                      A short statement that gives clients a reason to look
                      closer.
                    </FieldHelp>
                  </ProfileField>

                  <div className="sm:col-span-2">
                    <ProfileField label="Professional bio" hint="Optional">
                      <Textarea
                        value={form.bio}
                        maxLength={500}
                        disabled={creating}
                        placeholder="Tell clients about your experience, strengths and the kind of work you enjoy."
                        onChange={(event) =>
                          updateField("bio", event.target.value)
                        }
                        className={[
                          "min-h-36 resize-none rounded-xl leading-7",
                          "border-border/70 bg-surface-1/70 shadow-none",
                          "focus-visible:border-brand-secondary-highlight/35 focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/20",
                          "dark:bg-surface-2/35 dark:focus-visible:border-secondary/25 dark:focus-visible:ring-secondary/15",
                        ].join(" ")}
                      />

                      <div className="flex items-center justify-between gap-4">
                        <FieldHelp>
                          Clear and specific usually works best.
                        </FieldHelp>

                        <p className="mt-2 text-[0.61rem] tabular-nums text-muted-foreground">
                          {form.bio.length}/500
                        </p>
                      </div>
                    </ProfileField>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="mt-7">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <ProfileField label="Country">
                      <Select
                        value={form.countryCode}
                        disabled={creating}
                        onValueChange={handleCountryChange}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>

                        <SelectContent className={selectContentClass}>
                          {SUPPORTED_ALLOCAT_COUNTRIES.map((country) => (
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

                      <FieldHelp>
                        Allocats currently register from supported operating
                        countries.
                      </FieldHelp>
                    </ProfileField>

                    <ProfileField label="City">
                      <Select
                        value={form.city}
                        disabled={!selectedCountry || creating}
                        onValueChange={(value) => updateField("city", value)}
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue
                            placeholder={
                              selectedCountry
                                ? "Select city"
                                : "Select a country first"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent className={selectContentClass}>
                          {availableCities.map((city) => (
                            <SelectItem
                              key={city}
                              value={city}
                              className={selectItemClass}
                            >
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FieldHelp>
                        Your public profile will show your city and country.
                      </FieldHelp>
                    </ProfileField>

                    <ProfileField label="Phone number" hint="Optional">
                      <div className="relative">
                        <PhoneIcon
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          maxLength={30}
                          disabled={creating}
                          value={form.phoneNumber}
                          placeholder={
                            form.countryCode === "ZA" ? "+27..." : "+263..."
                          }
                          onChange={(event) =>
                            updateField("phoneNumber", event.target.value)
                          }
                          className={[fieldClass, "pl-10"].join(" ")}
                        />
                      </div>

                      <FieldHelp>
                        Used for account contact and communication. It is not
                        shown publicly by default.
                      </FieldHelp>
                    </ProfileField>
                  </div>

                  {selectedCountry && (
                    <div
                      className={[
                        "mt-6 rounded-xl border p-4",
                        quietSurface,
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            accentIconSurface,
                          ].join(" ")}
                        >
                          <BanknoteIcon size={15} />
                        </span>

                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Your profile currency will be{" "}
                            {selectedCountry.currencyCode}
                          </p>

                          <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                            {selectedCountry.name} profiles use{" "}
                            {selectedCountry.currencyName}. This is determined
                            automatically from your operating location.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="mt-7">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <ProfileField label="Years of experience" hint="Optional">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={80}
                        step={1}
                        disabled={creating}
                        value={form.yearsExperience}
                        placeholder="e.g. 5"
                        onChange={(event) =>
                          updateField("yearsExperience", event.target.value)
                        }
                        className={fieldClass}
                      />

                      <FieldHelp>Use a whole number.</FieldHelp>
                    </ProfileField>

                    <ProfileField label="Availability">
                      <Select
                        value={form.availability}
                        disabled={creating}
                        onValueChange={(value) =>
                          updateField(
                            "availability",
                            value as AllocatAvailability,
                          )
                        }
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent className={selectContentClass}>
                          <SelectItem
                            value="available"
                            className={selectItemClass}
                          >
                            Available
                          </SelectItem>

                          <SelectItem value="busy" className={selectItemClass}>
                            Busy
                          </SelectItem>

                          <SelectItem
                            value="unavailable"
                            className={selectItemClass}
                          >
                            Unavailable
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FieldHelp>Your current capacity.</FieldHelp>
                    </ProfileField>

                    <ProfileField
                      label={`Hourly rate (${currencyCode})`}
                      hint="Optional"
                    >
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                          {currencySymbol}
                        </span>

                        <Input
                          type="number"
                          min={0}
                          max={1000000}
                          step="0.01"
                          disabled={creating}
                          value={form.hourlyRate}
                          placeholder="0.00"
                          onChange={(event) =>
                            updateField("hourlyRate", event.target.value)
                          }
                          className={[fieldClass, "pl-9"].join(" ")}
                        />
                      </div>

                      <FieldHelp>
                        A starting rate, not a fixed project quote.
                      </FieldHelp>
                    </ProfileField>
                  </div>

                  <div className="mt-6 flex items-start gap-2.5 border-t border-border/50 pt-5">
                    <BanknoteIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"
                    />

                    <p className="text-[0.62rem] leading-5 text-muted-foreground">
                      Your rate is shown in{" "}
                      <span className="font-semibold text-foreground">
                        {currencyName} ({currencyCode})
                      </span>{" "}
                      because your selected operating country is{" "}
                      <span className="font-semibold text-foreground">
                        {selectedCountry?.name}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-7">
                  <ProfileField
                    label="Your skills"
                    hint={`${form.skillIds.length}/20 selected`}
                  >
                    <ThemedSkillPicker
                      options={skills}
                      selected={selectedSkills}
                      loading={loadingSkills}
                      disabled={creating}
                      max={20}
                      onChange={(nextSkills) =>
                        updateField(
                          "skillIds",
                          nextSkills.map((skill) => skill.id),
                        )
                      }
                    />

                    <FieldHelp>
                      Choose at least one skill. Three or more relevant skills
                      will give clients and matching tools better context.
                    </FieldHelp>
                  </ProfileField>
                </div>
              )}

              {step === 4 && (
                <div className="mt-7">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <ProfileField label="ID number">
                      <div className="relative">
                        <IdCardIcon
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                          value={form.idNumber}
                          maxLength={50}
                          placeholder="Enter your ID number"
                          autoComplete="off"
                          disabled={creating}
                          onChange={(event) =>
                            updateField("idNumber", event.target.value)
                          }
                          className={[fieldClass, "pl-10"].join(" ")}
                        />
                      </div>

                      <FieldHelp>
                        Private. Never displayed on your public profile.
                      </FieldHelp>
                    </ProfileField>

                    <ProfileField
                      label="Identity document"
                      hint="For verification"
                    >
                      <input
                        ref={idDocumentInputRef}
                        type="file"
                        accept="application/pdf,image/jpeg,image/png,image/webp"
                        onChange={handleIdDocumentChange}
                        disabled={creating}
                        className="hidden"
                      />

                      {idDocument ? (
                        <div
                          className={[
                            "flex min-h-28 items-center gap-3 rounded-xl border p-4",
                            quietSurface,
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              accentIconSurface,
                            ].join(" ")}
                          >
                            <FileBadgeIcon size={15} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground">
                              {idDocument.name}
                            </p>

                            <p className="mt-1 text-[0.58rem] text-muted-foreground">
                              {formatFileSize(idDocument.size)}
                            </p>

                            <button
                              type="button"
                              disabled={creating}
                              onClick={() =>
                                idDocumentInputRef.current?.click()
                              }
                              className="mt-2 text-[0.62rem] font-semibold text-brand-secondary-highlight transition-opacity hover:opacity-70 disabled:pointer-events-none disabled:opacity-50 dark:text-secondary"
                            >
                              Choose another
                            </button>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={creating}
                            onClick={removeIdDocument}
                            className={[
                              "h-8 w-8 shrink-0 rounded-lg",
                              quietButton,
                            ].join(" ")}
                            aria-label="Remove ID document"
                          >
                            <Trash2Icon size={13} />
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={creating}
                          onClick={() => idDocumentInputRef.current?.click()}
                          className={[
                            "flex min-h-28 w-full items-center gap-3 rounded-xl border border-dashed px-4 text-left",
                            "border-border/70 bg-surface-2/25",
                            "transition-opacity duration-150 hover:opacity-75",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20",
                            "disabled:pointer-events-none disabled:opacity-50",
                            "dark:bg-surface-2/40 dark:focus-visible:ring-secondary/20",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              accentIconSurface,
                            ].join(" ")}
                          >
                            <FileBadgeIcon size={15} />
                          </span>

                          <span>
                            <span className="block text-xs font-semibold text-foreground">
                              Upload your ID
                            </span>

                            <span className="mt-1 block text-[0.61rem] leading-5 text-muted-foreground">
                              PDF, JPEG, PNG or WebP. Max 10 MB.
                            </span>
                          </span>
                        </button>
                      )}

                      <FieldHelp>
                        Used to support identity verification. This document is
                        never public.
                      </FieldHelp>
                    </ProfileField>

                    <ProfileField label="Profile picture" hint="Optional">
                      <div
                        className={[
                          "flex min-h-28 items-center gap-4 rounded-xl border p-4",
                          quietSurface,
                        ].join(" ")}
                      >
                        <Avatar className="h-14 w-14 shrink-0 border border-border/65">
                          <AvatarImage
                            src={
                              avatarPreview ??
                              accountProfile.avatarUrl ??
                              undefined
                            }
                            className="object-cover"
                          />

                          <AvatarFallback
                            className={[
                              "font-semibold",
                              "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight",
                              "dark:bg-secondary/[0.08] dark:text-secondary",
                            ].join(" ")}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-foreground">
                            {avatarFile
                              ? avatarFile.name
                              : accountProfile.avatarUrl
                                ? "Current profile picture"
                                : "Add a profile picture"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={creating}
                              onClick={() => avatarInputRef.current?.click()}
                              className={[
                                "h-8 rounded-lg px-3 text-xs font-semibold",
                                secondaryButton,
                              ].join(" ")}
                            >
                              <CameraIcon size={13} />

                              {avatarFile || accountProfile.avatarUrl
                                ? "Choose another"
                                : "Choose photo"}
                            </Button>

                            {avatarFile && (
                              <Button
                                type="button"
                                variant="ghost"
                                disabled={creating}
                                onClick={removeAvatar}
                                className={[
                                  "h-8 rounded-lg px-3 text-xs font-semibold",
                                  quietButton,
                                ].join(" ")}
                              >
                                <XIcon size={13} />
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={creating}
                        onChange={handleAvatarChange}
                        className="hidden"
                      />

                      <FieldHelp>JPEG, PNG or WebP. Maximum 5 MB.</FieldHelp>
                    </ProfileField>
                  </div>

                  <div className="mt-6 flex items-start gap-2.5 border-t border-border/50 pt-5">
                    <ShieldCheckIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-brand-secondary-highlight dark:text-secondary"
                    />

                    <p className="text-[0.62rem] leading-5 text-muted-foreground">
                      Your ID number and identity document are private
                      verification information. Clients only see your public
                      professional details.
                    </p>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="mt-7">
                  <div
                    className={[
                      "mb-6 rounded-xl border p-4",
                      quietSurface,
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          accentIconSurface,
                        ].join(" ")}
                      >
                        <ShieldCheckIcon size={15} />
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Credentials are optional during setup
                        </p>

                        <p className="mt-1 text-xs leading-6 text-muted-foreground">
                          Qualifications, certifications, professional licences
                          and training can support verification. You can also
                          submit them later from your profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <ProfileField label="Document type">
                      <Select
                        value={documentType}
                        disabled={creating}
                        onValueChange={(value) =>
                          setDocumentType(value as ProfessionalDocumentType)
                        }
                      >
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent className={selectContentClass}>
                          <SelectItem
                            value="Qualification"
                            className={selectItemClass}
                          >
                            Qualification
                          </SelectItem>

                          <SelectItem
                            value="Certification"
                            className={selectItemClass}
                          >
                            Certification
                          </SelectItem>

                          <SelectItem
                            value="ProfessionalLicense"
                            className={selectItemClass}
                          >
                            Professional licence
                          </SelectItem>

                          <SelectItem
                            value="Training"
                            className={selectItemClass}
                          >
                            Training
                          </SelectItem>

                          <SelectItem value="Other" className={selectItemClass}>
                            Other professional document
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FieldHelp>
                        Choose the category that best describes the files you
                        are adding.
                      </FieldHelp>
                    </ProfileField>

                    <ProfileField label="Credential files" hint="Optional">
                      <button
                        type="button"
                        disabled={
                          creating ||
                          verificationDocuments.length >= MAX_DOCUMENTS
                        }
                        onClick={() => documentInputRef.current?.click()}
                        className={[
                          "flex min-h-28 w-full items-center gap-4 rounded-xl border border-dashed px-4 py-4 text-left",
                          "border-border/70 bg-surface-2/25",
                          "transition-opacity duration-150 hover:opacity-75",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-highlight/20",
                          "disabled:pointer-events-none disabled:opacity-50",
                          "dark:bg-surface-2/40 dark:focus-visible:ring-secondary/20",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            accentIconSurface,
                          ].join(" ")}
                        >
                          <GraduationCapIcon size={15} />
                        </span>

                        <span>
                          <span className="block text-xs font-semibold text-foreground">
                            {verificationDocuments.length >= MAX_DOCUMENTS
                              ? "Document limit reached"
                              : "Choose documents"}
                          </span>

                          <span className="mt-1 block text-[0.61rem] leading-5 text-muted-foreground">
                            PDF, JPEG, PNG or WebP. Up to 10 MB each.
                          </span>
                        </span>
                      </button>

                      <input
                        ref={documentInputRef}
                        type="file"
                        multiple
                        accept="application/pdf,image/jpeg,image/png,image/webp"
                        disabled={
                          creating ||
                          verificationDocuments.length >= MAX_DOCUMENTS
                        }
                        onChange={handleVerificationFiles}
                        className="hidden"
                      />
                    </ProfileField>
                  </div>

                  {verificationDocuments.length > 0 && (
                    <div className="mt-6 border-t border-border/50 pt-5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold text-foreground">
                          Documents selected
                        </p>

                        <p className="text-[0.6rem] text-muted-foreground">
                          {verificationDocuments.length}/{MAX_DOCUMENTS}
                        </p>
                      </div>

                      <div className="mt-3 divide-y divide-border/45 border-y border-border/45">
                        {verificationDocuments.map((document) => (
                          <div
                            key={document.id}
                            className="flex items-center gap-3 py-3"
                          >
                            <span
                              className={[
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                accentIconSurface,
                              ].join(" ")}
                            >
                              <FileTextIcon size={13} />
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-foreground">
                                {document.file.name}
                              </p>

                              <p className="mt-0.5 text-[0.58rem] text-muted-foreground">
                                {formatDocumentType(document.type)}
                                {" · "}
                                {formatFileSize(document.file.size)}
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={creating}
                              onClick={() =>
                                removeVerificationDocument(document.id)
                              }
                              className={[
                                "h-8 w-8 shrink-0 rounded-lg",
                                quietButton,
                              ].join(" ")}
                              aria-label={`Remove ${document.file.name}`}
                            >
                              <Trash2Icon size={13} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-start gap-2.5 border-t border-border/50 pt-5">
                    <AlertCircleIcon
                      size={14}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />

                    <p className="text-[0.61rem] leading-5 text-muted-foreground">
                      You can continue without credentials and complete
                      professional verification later.
                    </p>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="mt-7">
                  <div className="flex items-center gap-4 border-b border-border/50 pb-5">
                    <Avatar className="h-14 w-14 border border-border/65">
                      <AvatarImage
                        src={
                          avatarPreview ?? accountProfile.avatarUrl ?? undefined
                        }
                        className="object-cover"
                      />

                      <AvatarFallback
                        className={[
                          "font-semibold",
                          "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight",
                          "dark:bg-secondary/[0.08] dark:text-secondary",
                        ].join(" ")}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold tracking-[-0.02em] text-foreground">
                        {accountProfile.fullName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {form.title.trim() || "Professional service provider"}
                      </p>

                      {formattedLocation && (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-[0.61rem] text-muted-foreground">
                          <MapPinIcon size={11} />
                          {formattedLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  <ReviewGroup title="Professional profile">
                    <ReviewRow
                      label="Professional title"
                      value={form.title.trim() || "Not added"}
                      missing={!form.title.trim()}
                    />

                    <ReviewRow
                      label="Headline"
                      value={form.headline.trim() || "Not added"}
                      missing={!form.headline.trim()}
                    />

                    <ReviewRow
                      label="Bio"
                      value={form.bio.trim() || "Not added"}
                      missing={!form.bio.trim()}
                    />

                    <ReviewRow
                      label="Skills"
                      value={`${form.skillIds.length} selected`}
                    />
                  </ReviewGroup>

                  <ReviewGroup title="Location & contact">
                    <ReviewRow
                      label="Country"
                      value={selectedCountry?.name ?? "Not selected"}
                    />

                    <ReviewRow
                      label="City"
                      value={form.city || "Not selected"}
                    />

                    <ReviewRow
                      label="Phone number"
                      value={form.phoneNumber.trim() || "Not added"}
                      missing={!form.phoneNumber.trim()}
                    />

                    <ReviewRow
                      label="Profile currency"
                      value={`${currencyCode} · ${currencyName}`}
                    />
                  </ReviewGroup>

                  <ReviewGroup title="Working details">
                    <ReviewRow
                      label="Experience"
                      value={
                        form.yearsExperience.trim()
                          ? `${form.yearsExperience} ${
                              Number(form.yearsExperience) === 1
                                ? "year"
                                : "years"
                            }`
                          : "Not added"
                      }
                      missing={!form.yearsExperience.trim()}
                    />

                    <ReviewRow
                      label="Availability"
                      value={formatAvailability(form.availability)}
                    />

                    <ReviewRow
                      label="Hourly rate"
                      value={
                        form.hourlyRate.trim()
                          ? `${formatMoney(
                              Number(form.hourlyRate),
                              currencyCode,
                            )}/hr`
                          : "Not added"
                      }
                      missing={!form.hourlyRate.trim()}
                    />
                  </ReviewGroup>

                  <ReviewGroup title="Identity & verification">
                    <ReviewRow label="ID number" value="Provided privately" />

                    <ReviewRow
                      label="Identity document"
                      value={
                        idDocument
                          ? "Will be submitted for review"
                          : "Add later"
                      }
                      missing={!idDocument}
                    />

                    <ReviewRow
                      label="Professional credentials"
                      value={
                        verificationDocuments.length > 0
                          ? `${verificationDocuments.length} ${
                              verificationDocuments.length === 1
                                ? "document"
                                : "documents"
                            } ready to submit`
                          : "Complete later"
                      }
                      missing={verificationDocuments.length === 0}
                    />

                    <ReviewRow
                      label="Verification"
                      value={
                        idDocument || verificationDocuments.length > 0
                          ? "Documents will be submitted for review"
                          : "Not started"
                      }
                      missing={
                        !idDocument && verificationDocuments.length === 0
                      }
                    />
                  </ReviewGroup>

                  <div
                    className={[
                      "mt-7 rounded-xl border p-4",
                      quietSurface,
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          accentIconSurface,
                        ].join(" ")}
                      >
                        <WandSparklesIcon size={15} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">
                          Your professional profile is ready to be created
                        </p>

                        <p className="mt-1 text-xs leading-6 text-muted-foreground">
                          Selected identity and professional documents will be
                          uploaded securely after your profile is created and
                          submitted for review.
                        </p>

                        {creating && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex min-w-0 items-center gap-2">
                                <LoaderCircleIcon
                                  size={13}
                                  className="shrink-0 animate-spin text-brand-secondary-highlight dark:text-secondary"
                                />

                                <p className="truncate text-[0.61rem] font-medium text-muted-foreground">
                                  {submitPhase ?? "Finishing profile setup"}
                                </p>
                              </div>

                              <span className="shrink-0 text-[0.58rem] font-medium tabular-nums text-muted-foreground">
                                {submitProgress}%
                              </span>
                            </div>

                            <UploadProgress
                              value={submitProgress}
                              className="mt-2.5"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stepError && <InlineError message={stepError} />}
              {submitError && <InlineError message={submitError} />}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/50 pt-5">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={creating}
                    className={[
                      "h-10 rounded-lg px-4 text-xs font-semibold",
                      quietButton,
                    ].join(" ")}
                  >
                    <ArrowLeftIcon size={14} />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goNext}
                    disabled={creating}
                    className={[
                      "h-10 rounded-lg px-4 text-xs font-semibold",
                      primaryButton,
                    ].join(" ")}
                  >
                    Continue
                    <ArrowRightIcon size={14} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void createProfile()}
                    disabled={creating}
                    className={[
                      "h-10 rounded-lg px-5 text-xs font-semibold",
                      primaryButton,
                    ].join(" ")}
                  >
                    {creating ? (
                      <>
                        <LoaderCircleIcon size={14} className="animate-spin" />
                        Creating profile
                      </>
                    ) : (
                      <>
                        <CheckIcon size={14} />
                        Create Allocat profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function ThemedSkillPicker({
  options,
  selected,
  onChange,
  loading = false,
  disabled = false,
  max = 20,
}: {
  options: AllocatSkill[];
  selected: AllocatSkill[];
  onChange: (skills: AllocatSkill[]) => void;
  loading?: boolean;
  disabled?: boolean;
  max?: number;
}) {
  const [query, setQuery] = useState("");

  const selectedIds = useMemo(
    () => new Set(selected.map((skill) => skill.id)),
    [selected],
  );

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();

    return options
      .filter((skill) => !selectedIds.has(skill.id))
      .filter((skill) => !search || skill.name.toLowerCase().includes(search))
      .slice(0, 12);
  }, [options, query, selectedIds]);

  function addSkill(skill: AllocatSkill) {
    if (disabled || selected.length >= max || selectedIds.has(skill.id)) {
      return;
    }

    onChange([...selected, skill]);
    setQuery("");
  }

  function removeSkill(skillId: string) {
    if (disabled) {
      return;
    }

    onChange(selected.filter((skill) => skill.id !== skillId));
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selected.map((skill) => (
            <span key={skill.id} className={skillTagClass}>
              <span>{skill.name}</span>

              <button
                type="button"
                disabled={disabled}
                onClick={() => removeSkill(skill.id)}
                className={[
                  "flex h-4 w-4 items-center justify-center rounded-md",
                  "text-brand-secondary-highlight/65 transition-opacity hover:opacity-60",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/25",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "dark:text-secondary/70 dark:focus-visible:ring-secondary/25",
                ].join(" ")}
                aria-label={`Remove ${skill.name}`}
              >
                <XIcon size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div
        className={[
          "overflow-hidden rounded-xl border border-border/70",
          "bg-surface-1/70",
          "focus-within:border-brand-secondary-highlight/35",
          "focus-within:ring-1 focus-within:ring-brand-secondary-highlight/20",
          "dark:bg-surface-2/35",
          "dark:focus-within:border-secondary/25",
          "dark:focus-within:ring-secondary/15",
        ].join(" ")}
      >
        <div className="relative">
          <SearchIcon
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={query}
            disabled={disabled || loading || selected.length >= max}
            placeholder={
              selected.length >= max
                ? `Maximum ${max} skills selected`
                : "Search skills"
            }
            onChange={(event) => setQuery(event.target.value)}
            className={[
              "h-11 w-full bg-transparent pl-10 pr-4 text-sm text-foreground outline-none",
              "placeholder:text-muted-foreground/60",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          />
        </div>

        {(query.trim() || loading) && (
          <div className="border-t border-border/55 p-1.5">
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-3 text-xs text-muted-foreground">
                <LoaderCircleIcon size={13} className="animate-spin" />
                Loading skills
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => addSkill(skill)}
                    className={[
                      "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left",
                      "text-sm text-foreground/80",
                      "transition-colors duration-150",
                      "hover:bg-surface-3/60 hover:text-foreground",
                      "focus-visible:outline-none focus-visible:bg-surface-3/60",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "dark:hover:bg-surface-3/70",
                      "dark:focus-visible:bg-surface-3/70",
                    ].join(" ")}
                  >
                    <span className="truncate">{skill.name}</span>
                    <PlusMark />
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-3 py-3 text-xs text-muted-foreground">
                No matching skills found.
              </p>
            )}
          </div>
        )}
      </div>

      {selected.length === 0 && !query && (
        <p className="mt-2 text-[0.61rem] text-muted-foreground">
          Start typing to search the skill catalogue.
        </p>
      )}
    </div>
  );
}

function PlusMark() {
  return (
    <span
      className={[
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
        "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight",
        "dark:bg-secondary/[0.08] dark:text-secondary",
      ].join(" ")}
    >
      <span className="text-sm leading-none">+</span>
    </span>
  );
}

function SetupProgress({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={[
        "h-1.5 w-full overflow-hidden rounded-full bg-surface-3/80 dark:bg-surface-2",
        className,
      ].join(" ")}
      role="progressbar"
      aria-label="Allocat profile setup progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className="h-full rounded-full bg-brand-secondary-highlight transition-[width] duration-300 ease-out dark:bg-secondary"
        style={{
          width: `${safeValue}%`,
        }}
      />
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
      className={[
        "h-1.5 w-full overflow-hidden rounded-full",
        "bg-brand-secondary-highlight/[0.10] dark:bg-secondary/[0.10]",
        className,
      ].join(" ")}
      role="progressbar"
      aria-label="Profile creation progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className="h-full rounded-full bg-brand-secondary-highlight transition-[width] duration-300 ease-out dark:bg-secondary"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}

function ProfileField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-semibold text-foreground">{label}</Label>

        {hint && (
          <span className="text-[0.58rem] font-medium text-muted-foreground">
            {hint}
          </span>
        )}
      </div>

      <div className="mt-2">{children}</div>
    </div>
  );
}

function FieldHelp({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 text-[0.61rem] leading-5 text-muted-foreground">
      {children}
    </p>
  );
}

function ReviewGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border/50 py-6 last:border-b-0">
      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>

      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ReviewRow({ label, value, missing = false }: ReviewRowProps) {
  return (
    <div>
      <p className="text-[0.6rem] text-muted-foreground">{label}</p>

      <div className="mt-1.5">
        {missing ? (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-status-pending-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-status-pending" />
            {value}
          </span>
        ) : (
          <p className="text-xs font-semibold leading-5 text-foreground">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <div
      className="mt-5 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-3.5 py-3 text-xs text-destructive"
      role="alert"
    >
      <AlertCircleIcon size={14} className="mt-0.5 shrink-0" />
      <p className="leading-5">{message}</p>
    </div>
  );
}

function CreateAllocatProfileError({
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

      <main className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/[0.08] text-destructive">
            <AlertCircleIcon size={18} />
          </span>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
            Could not start profile setup
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
            Try again
          </Button>
        </div>
      </main>
    </div>
  );
}

function CreateAllocatProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-5 h-10 w-80 max-w-full" />
          <Skeleton className="mt-4 h-5 w-[36rem] max-w-full" />
          <Skeleton className="mt-9 h-1.5 w-full rounded-full" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
            <div className="hidden space-y-3 lg:block">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-xl" />
              ))}
            </div>

            <div className="rounded-2xl border border-border/55 p-6">
              <div className="flex gap-4 border-b border-border/50 pb-6">
                <Skeleton className="h-10 w-10 rounded-lg" />

                <div className="flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-3 h-7 w-64" />
                  <Skeleton className="mt-3 h-4 w-full max-w-xl" />
                </div>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function validateStep(step: number, form: FormState) {
  switch (step) {
    case 1: {
      const country = SUPPORTED_ALLOCAT_COUNTRIES.find(
        (item) => item.code === form.countryCode,
      );

      if (!country) {
        return "Select the country where you are based.";
      }

      if (!form.city || !country.cities.includes(form.city)) {
        return "Select your city.";
      }

      if (form.phoneNumber.trim().length > 30) {
        return "Phone number is too long.";
      }

      return null;
    }

    case 2: {
      if (form.yearsExperience.trim()) {
        const years = Number(form.yearsExperience);

        if (!Number.isInteger(years)) {
          return "Years of experience must be a whole number.";
        }

        if (years < 0 || years > 80) {
          return "Years of experience must be between 0 and 80.";
        }
      }

      if (form.hourlyRate.trim()) {
        const rate = Number(form.hourlyRate);

        if (!Number.isFinite(rate)) {
          return "Enter a valid hourly rate.";
        }

        if (rate < 0) {
          return "Hourly rate cannot be negative.";
        }

        if (rate > 1_000_000) {
          return "Hourly rate is outside the supported range.";
        }
      }

      return null;
    }

    case 3: {
      if (form.skillIds.length === 0) {
        return "Select at least one skill before continuing.";
      }

      if (form.skillIds.length > 20) {
        return "You can select up to 20 skills.";
      }

      return null;
    }

    case 4: {
      if (!form.idNumber.trim()) {
        return "Enter your ID number before continuing.";
      }

      if (form.idNumber.trim().length > 50) {
        return "ID number cannot exceed 50 characters.";
      }

      return null;
    }

    default:
      return null;
  }
}

function validateAll(form: FormState) {
  for (let step = 0; step < 6; step += 1) {
    const error = validateStep(step, form);

    if (error) {
      return error;
    }
  }

  return null;
}

function validateDocumentFile(file: File, maxSize: number) {
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
    return "Documents must be PDF, JPEG, PNG or WebP files.";
  }

  if (file.size > maxSize) {
    return "Documents cannot exceed 10 MB.";
  }

  return null;
}

function inferSupportedAllocatLocation(location?: string | null): {
  countryCode: string;
  city: string;
} | null {
  if (!location?.trim()) {
    return null;
  }

  const normalized = location.trim().toLowerCase();

  for (const country of SUPPORTED_ALLOCAT_COUNTRIES) {
    for (const city of country.cities) {
      const expected = `${city}, ${country.name}`.toLowerCase();

      if (normalized === expected) {
        return {
          countryCode: country.code,
          city,
        };
      }
    }
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

  return Number.isFinite(number) ? number : null;
}

function parseNullableInteger(value: string) {
  if (!value.trim()) {
    return null;
  }

  const number = Number(value);

  return Number.isInteger(number) ? number : null;
}

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

function formatAvailability(availability: AllocatAvailability) {
  return availability.charAt(0).toUpperCase() + availability.slice(1);
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

function formatDocumentType(type: ProfessionalDocumentType) {
  switch (type) {
    case "Qualification":
      return "Qualification";

    case "Certification":
      return "Certification";

    case "ProfessionalLicense":
      return "Professional licence";

    case "Training":
      return "Training";

    default:
      return "Other professional document";
  }
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

export default CreateAllocatProfile;
