import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleDollarSignIcon,
  LoaderCircleIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
  FileTextIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import api from "@/api/axios";
import type { CreateProjectRequest } from "@/Types/createProjectRequest";
import type { Project } from "@/Types/project";
import type { SkillOption } from "@/Types/skillOption";
import { cn } from "@/lib/utils";
import { toLocalDateOnly } from "@/utils/date";
import { Calendar28 } from "./DatePicker";
import {
  FILE_ACCEPT,
  fileError,
  formatFileSize,
  uploadProjectFile,
  validateSelectedFile,
} from "@/api/projectFiles";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BriefFile = {
  key: number;
  file: File;
  status: "queued" | "uploading" | "uploaded" | "error";
  progress: number;
  error?: string;
};
type SavedProject = { project: Project; intent: SubmitIntent };

type SkillCategoryOption = { id: string; name: string };
type FormValues = z.infer<typeof formSchema>;
type Step = 1 | 2 | 3;
type SubmitIntent = "post" | "find" | "invite";
type Props = {
  selectedAllocatId?: string | null;
  selectedAllocatName?: string | null;
};

const categoryGroupSchema = z.object({
  category: z.string().min(1, "Choose a category."),
  skillIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one relevant skill.")
    .max(15, "Choose no more than 15 skills per category."),
});

const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "Use at least 5 characters.")
      .max(64, "Keep the title below 64 characters."),
    categoryGroups: z
      .array(categoryGroupSchema)
      .min(1, "Add at least one category.")
      .superRefine((groups, context) => {
        const seen = new Set<string>();
        groups.forEach((group, index) => {
          if (group.category && seen.has(group.category)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "This category is already included. Add skills to its existing group.",
              path: [index, "category"],
            });
          }
          seen.add(group.category);
        });
      }),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    description: z
      .string()
      .min(20, "Describe the project in at least 20 characters.")
      .max(2000, "Keep the description below 2,000 characters."),
    priority: z.enum(["standard", "high", "urgent"]),
    budget: z.string().optional(),
  })
  .refine(
    (values) =>
      !values.startDate ||
      !values.endDate ||
      values.endDate >= values.startDate,
    {
      message: "The end date must be after the start date.",
      path: ["endDate"],
    },
  );
const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Planning" },
  { number: 3, label: "Brief" },
] as const;
const stepFields: Record<Step, (keyof FormValues)[]> = {
  1: ["title", "categoryGroups"],
  2: ["startDate", "endDate", "priority", "budget"],
  3: ["description"],
};
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35";
const inputSurface =
  "border-border/65 bg-surface-2/45 text-foreground/80 placeholder:text-muted-foreground/55 shadow-none transition-[background-color,border-color,box-shadow,color] duration-150 hover:border-border/85 hover:bg-surface-2/60 focus-visible:border-brand-secondary-highlight/30 focus-visible:bg-surface-1 focus-visible:ring-1 focus-visible:ring-brand-secondary-highlight/15 dark:border-border dark:bg-surface-2/85 dark:text-foreground/90 dark:placeholder:text-muted-foreground/60 dark:hover:border-border dark:hover:bg-surface-3/70 dark:focus-visible:border-secondary/25 dark:focus-visible:bg-surface-2 dark:focus-visible:ring-secondary/15 motion-reduce:transition-none";
const calendarSurface =
  "border-border/65 bg-surface-2/45 text-foreground/80 shadow-none hover:border-border/85 hover:bg-surface-2/60 focus-within:border-brand-secondary-highlight/30 focus-within:bg-surface-1 focus-within:ring-1 focus-within:ring-brand-secondary-highlight/15 dark:border-border dark:bg-surface-2/85 dark:text-foreground/90 dark:hover:border-border dark:hover:bg-surface-3/70 dark:focus-within:border-secondary/25 dark:focus-within:bg-surface-2 dark:focus-within:ring-secondary/15";
const fieldDescriptionClass =
  "text-[0.67rem] leading-5 text-muted-foreground/85 dark:text-muted-foreground";
const primaryButton =
  "border border-brand-secondary-highlight/15 bg-brand-secondary-highlight text-primary-foreground hover:border-brand-secondary-highlight/20 hover:bg-brand-secondary-highlight/90 hover:text-primary-foreground dark:border-secondary dark:bg-secondary dark:text-secondary-foreground dark:hover:border-secondary/90 dark:hover:bg-secondary/90 dark:hover:text-secondary-foreground motion-reduce:transition-none " +
  focus;
const secondaryButton =
  "border-border/65 bg-surface-2/45 text-foreground/70 hover:border-border/85 hover:bg-surface-3/60 hover:text-foreground/90 dark:border-border dark:bg-surface-2/80 dark:text-foreground/80 dark:hover:border-border dark:hover:bg-surface-3/80 dark:hover:text-foreground motion-reduce:transition-none " +
  focus;
const helperIconSurface =
  "bg-brand-secondary-highlight/[0.08] text-brand-secondary-highlight ring-1 ring-inset ring-brand-secondary-highlight/10 dark:bg-secondary/[0.08] dark:text-secondary dark:ring-secondary/12";
const previousButton =
  "h-10 rounded-lg px-3 text-xs text-muted-foreground shadow-none hover:bg-surface-3/50 hover:text-foreground/85 dark:hover:bg-surface-3/70 dark:hover:text-foreground " +
  focus;

export default function NewProjectForm({
  selectedAllocatId = null,
  selectedAllocatName = null,
}: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [submitIntent, setSubmitIntent] = useState<SubmitIntent>("post");
  const submitIntentRef = useRef<SubmitIntent>("post");
  const hasSelectedAllocat = Boolean(selectedAllocatId);
  const [briefFiles, setBriefFiles] = useState<BriefFile[]>([]);
  const briefFilesRef = useRef<BriefFile[]>([]);
  const fileKeyRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedProject, setSavedProject] = useState<SavedProject | null>(null);
  const savedProjectRef = useRef<SavedProject | null>(null);
  const submitLockRef = useRef(false);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      uploadAbortRef.current?.abort();
    };
  }, []);

  function updateBriefFiles(update: (current: BriefFile[]) => BriefFile[]) {
    briefFilesRef.current = update(briefFilesRef.current);
    if (mountedRef.current) setBriefFiles(briefFilesRef.current);
  }
  function chooseFiles(selected: File[]) {
    if (submitLockRef.current) return;
    updateBriefFiles((current) => {
      const next = [...current];
      for (const file of selected) {
        const validation = validateSelectedFile(file);
        if (validation) {
          toast.error(`${file.name}: ${validation}`);
          continue;
        }
        if (
          next.some(
            (entry) =>
              entry.file.name === file.name &&
              entry.file.size === file.size &&
              entry.file.lastModified === file.lastModified,
          )
        )
          continue;
        next.push({
          key: fileKeyRef.current++,
          file,
          status: "queued",
          progress: 0,
        });
      }
      return next;
    });
  }
  function removeBriefFile(key: number) {
    if (submitLockRef.current) return;
    // Uploaded files belong to the project now; deletion stays in its Files workspace.
    updateBriefFiles((current) =>
      current.filter(
        (entry) => entry.key !== key || entry.status === "uploaded",
      ),
    );
  }
  async function uploadBriefFiles(projectId: string): Promise<boolean> {
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    try {
      for (const entry of briefFilesRef.current) {
        if (!mountedRef.current || controller.signal.aborted) return false;
        if (entry.status === "uploaded") continue;
        updateBriefFiles((current) =>
          current.map((item) =>
            item.key === entry.key
              ? { ...item, status: "uploading", progress: 0, error: undefined }
              : item,
          ),
        );
        try {
          // No taskId: these are project files, not task/comment attachments.
          await uploadProjectFile(projectId, entry.file, {
            signal: controller.signal,
            onProgress: (progress) => {
              if (mountedRef.current && !controller.signal.aborted)
                updateBriefFiles((current) =>
                  current.map((item) =>
                    item.key === entry.key ? { ...item, progress } : item,
                  ),
                );
            },
          });
          updateBriefFiles((current) =>
            current.map((item) =>
              item.key === entry.key
                ? { ...item, status: "uploaded", progress: 100 }
                : item,
            ),
          );
          window.dispatchEvent(
            new CustomEvent("allocatr:files-changed", {
              detail: { projectId },
            }),
          );
        } catch (error) {
          if (!mountedRef.current || controller.signal.aborted) return false;
          updateBriefFiles((current) =>
            current.map((item) =>
              item.key === entry.key
                ? {
                    ...item,
                    status: "error",
                    error: fileError(
                      error,
                      "Upload failed. Retry or remove this file to continue.",
                    ),
                  }
                : item,
            ),
          );
        }
      }
      return briefFilesRef.current.every(
        (entry) => entry.status === "uploaded",
      );
    } finally {
      if (uploadAbortRef.current === controller) uploadAbortRef.current = null;
    }
  }
  const [categories, setCategories] = useState<SkillCategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() + 1);
    return date;
  }, [today]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryGroups: [{ category: "", skillIds: [] }],
      description: "",
      startDate: today,
      endDate: tomorrow,
      priority: "standard",
      budget: "",
    },
  });
  const { isSubmitting } = form.formState;
  const {
    fields: categoryFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "categoryGroups",
  });
  const categoryGroups = form.watch("categoryGroups");
  const canAddCategory =
    !loadingCategories &&
    !loadingSkills &&
    !categoriesError &&
    !skillsError &&
    categoryGroups.every(
      (group) => group.category && group.skillIds.length > 0,
    ) &&
    categories.some(
      (category) =>
        !categoryGroups.some((group) => group.category === category.name),
    );

  function validateCatalogue(values: FormValues) {
    if (loadingCategories || loadingSkills || categoriesError || skillsError) {
      form.setError("categoryGroups.0.category", {
        type: "validate",
        message:
          "Wait for the category and skills catalogues to load. Retry below if needed.",
      });
      return false;
    }
    let valid = true;
    values.categoryGroups.forEach((group, index) => {
      const category = categories.find((item) => item.name === group.category);
      if (!category) {
        form.setError(`categoryGroups.${index}.category`, {
          type: "validate",
          message: "Choose an available category.",
        });
        valid = false;
      } else if (
        group.skillIds.some(
          (id) =>
            !skills.some(
              (skill) => skill.id === id && skill.categoryId === category.id,
            ),
        )
      ) {
        form.setError(`categoryGroups.${index}.skillIds`, {
          type: "validate",
          message: "Choose skills belonging to this category.",
        });
        valid = false;
      }
    });
    return valid;
  }

  async function addCategory() {
    if (
      !(await form.trigger("categoryGroups", { shouldFocus: true })) ||
      !validateCatalogue(form.getValues())
    )
      return;
    append(
      { category: "", skillIds: [] },
      { focusName: `categoryGroups.${categoryFields.length}.category` },
    );
  }
  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);
      const response = await api.get<SkillCategoryOption[]>(
        "/skill-categories",
        { withCredentials: true },
      );
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Could not load skill categories:", error);
      setCategories([]);
      setCategoriesError("The category catalogue could not be loaded.");
    } finally {
      setLoadingCategories(false);
    }
  }, []);
  const loadSkills = useCallback(async () => {
    try {
      setLoadingSkills(true);
      setSkillsError(null);
      const response = await api.get<SkillOption[]>("/skills", {
        withCredentials: true,
      });
      setSkills(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Could not load skills:", error);
      setSkills([]);
      setSkillsError("The skills catalogue could not be loaded.");
    } finally {
      setLoadingSkills(false);
    }
  }, []);
  useEffect(() => {
    void Promise.all([loadCategories(), loadSkills()]);
  }, [loadCategories, loadSkills]);

  async function handleNext() {
    const isValid = await form.trigger(stepFields[step], { shouldFocus: true });
    if (!isValid || (step === 1 && !validateCatalogue(form.getValues())))
      return;
    if (step < 3) setStep((current) => (current + 1) as Step);
  }
  function handleBack() {
    if (submitLockRef.current || savedProjectRef.current) return;
    if (step > 1) setStep((current) => (current - 1) as Step);
  }
  function setIntent(intent: SubmitIntent) {
    if (submitLockRef.current || savedProjectRef.current) return;
    submitIntentRef.current = intent;
    setSubmitIntent(intent);
  }
  function handleCategoryChange(
    index: number,
    category: string,
    onChange: (value: string) => void,
  ) {
    if (form.getValues(`categoryGroups.${index}.category`) !== category) {
      form.setValue(`categoryGroups.${index}.skillIds`, [], {
        shouldDirty: true,
      });
      form.clearErrors(`categoryGroups.${index}.skillIds`);
    }
    onChange(category);
  }

  async function onSubmit(values: FormValues) {
    if (submitLockRef.current) return;
    if (!savedProjectRef.current && !validateCatalogue(values)) {
      setStep(1);
      return;
    }
    submitLockRef.current = true;
    try {
      let saved = savedProjectRef.current;
      if (!saved) {
        const payload: CreateProjectRequest = {
          title: values.title.trim(),
          description: values.description.trim(),
          // Keep the existing API contract: first group is primary; skills retain
          // their catalogue categoryId across every selected category.
          category: values.categoryGroups[0].category,
          skillIds: [
            ...new Set(
              values.categoryGroups.flatMap((group) => group.skillIds),
            ),
          ],
          startDate: toLocalDateOnly(values.startDate ?? new Date()),
          dueDate: toLocalDateOnly(values.endDate ?? new Date()),
          priority: values.priority,
          isPublic: false,
          allowBids: false,
          budget: Number(values.budget || 0),
          currency: "USD",
        };

        try {
          const response = await api.post<Project>("/projects", payload, {
            withCredentials: true,
          });
          saved = { project: response.data, intent: submitIntentRef.current };
          // Set synchronously before uploads: retries must never create another project.
          savedProjectRef.current = saved;
          if (!mountedRef.current) return;
          setSavedProject(saved);
        } catch (error) {
          if (mountedRef.current) {
            console.error("Could not create project:", error);
            toast.error("We could not create the project. Please try again.");
          }
          return;
        }
      }
      if (!mountedRef.current) return;
      const { project, intent } = saved;
      if (!(await uploadBriefFiles(project.id))) {
        if (mountedRef.current)
          toast.warning(
            "Your project is saved, but some files could not be uploaded. Retry or remove the failed files before continuing.",
          );
        return;
      }
      if (!mountedRef.current) return;
      if (selectedAllocatId) {
        try {
          await api.put(
            `/projects/${project.id}/allocats/${selectedAllocatId}/invite`,
            {},
            { withCredentials: true },
          );
          if (!mountedRef.current) return;
          toast.success(
            selectedAllocatName
              ? `${selectedAllocatName} has been invited to ${project.title}.`
              : "Project created and invitation sent.",
          );
          navigate(`/projects/${project.id}`);
          return;
        } catch (inviteError) {
          if (!mountedRef.current) return;
          console.error(
            "Project was created but the invitation could not be sent:",
            inviteError,
          );
          toast.warning(
            "Your project was created, but the invitation could not be sent. You can try again from Find Allocats.",
          );
          navigate(`/projects/${project.id}/allocats/find`);
          return;
        }
      }
      toast.success("Project created successfully.");
      if (intent === "find") {
        navigate(`/projects/${project.id}/allocats/find`);
        return;
      }
      navigate("/projects");
    } finally {
      submitLockRef.current = false;
    }
  }
  const selectedAllocatFirstName = getFirstName(selectedAllocatName);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card dark:border-border dark:bg-card">
      <div className="border-b border-border/55 bg-surface-2/35 px-4 py-4 sm:px-6 dark:border-border dark:bg-surface-2/70">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center">
            {steps.map((item, index) => {
              const isActive = step === item.number;
              const isComplete = step > item.number;
              return (
                <React.Fragment key={item.number}>
                  <button
                    type="button"
                    disabled={
                      item.number > step ||
                      isSubmitting ||
                      Boolean(savedProject)
                    }
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Step ${item.number}: ${item.label}`}
                    onClick={() => {
                      if (
                        !submitLockRef.current &&
                        !savedProjectRef.current &&
                        item.number < step
                      )
                        setStep(item.number);
                    }}
                    className={cn(
                      "group flex shrink-0 items-center gap-2 rounded-lg",
                      focus,
                      item.number < step ? "cursor-pointer" : "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border text-[0.64rem] font-semibold transition-[background-color,border-color,color] duration-150 motion-reduce:transition-none",
                        isActive &&
                          "border-brand-secondary-highlight/25 bg-brand-secondary-highlight/[0.10] text-brand-secondary-highlight dark:border-secondary/25 dark:bg-secondary/[0.10] dark:text-secondary",
                        isComplete &&
                          "border-brand-secondary-highlight/15 bg-brand-secondary-highlight/[0.06] text-brand-secondary-highlight/80 dark:border-secondary/15 dark:bg-secondary/[0.055] dark:text-secondary/85",
                        !isActive &&
                          !isComplete &&
                          "border-border/60 bg-surface-1/70 text-muted-foreground/75 dark:border-border dark:bg-surface-1 dark:text-muted-foreground",
                      )}
                    >
                      {isComplete ? (
                        <CheckIcon
                          size={12}
                          strokeWidth={2.6}
                          aria-hidden="true"
                        />
                      ) : (
                        item.number
                      )}
                    </span>
                    <span
                      className={cn(
                        "hidden text-xs font-semibold sm:block",
                        isActive
                          ? "text-foreground/90 dark:text-foreground"
                          : isComplete
                            ? "text-foreground/70 dark:text-foreground/80"
                            : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="mx-3 h-px w-5 overflow-hidden bg-border/70 sm:w-12 dark:bg-border"
                    >
                      <div
                        className={cn(
                          "h-full origin-left bg-brand-secondary-highlight/65 transition-transform duration-300 dark:bg-secondary/70 motion-reduce:transition-none",
                          step > item.number ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <span className="shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/75 dark:text-muted-foreground">
            {step} of {steps.length}
          </span>
        </div>
      </div>
      <form
        id="new-project"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          if (errors.title || errors.categoryGroups) setStep(1);
          else if (
            errors.startDate ||
            errors.endDate ||
            errors.priority ||
            errors.budget
          )
            setStep(2);
          else setStep(3);
        })}
        className="min-w-0 px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
      >
        <fieldset disabled={isSubmitting} className="min-w-0">
          <FieldGroup className="gap-7">
            {step === 1 && (
              <>
                <StepHeading
                  eyebrow="Start here"
                  title="Give the project an identity."
                  description="Give the project a clear title, then choose the categories and skills your team needs."
                />
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="project-title"
                        className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                      >
                        Project title
                      </FieldLabel>
                      <Input
                        {...field}
                        id="project-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Redesign company website"
                        className={cn(
                          "h-12 rounded-xl px-4",
                          inputSurface,
                          fieldState.invalid && "border-destructive",
                        )}
                      />
                      <FieldDescription className={fieldDescriptionClass}>
                        Make the outcome obvious at a glance.
                      </FieldDescription>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <div className="space-y-5">
                  {categoryFields.map((group, index) => (
                    <fieldset
                      key={group.id}
                      className="min-w-0 space-y-5 rounded-xl border border-border/60 p-4 sm:p-5 dark:border-border"
                    >
                      <legend className="px-1.5 text-xs font-semibold text-foreground/80 dark:text-foreground/90">
                        {index === 0
                          ? "Primary category"
                          : `Additional category ${index}`}
                      </legend>
                      {categoryFields.length > 1 && (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                            aria-label={`Remove ${categoryGroups[index]?.category || `category ${index + 1}`}`}
                            className={cn(
                              "h-8 gap-1.5 rounded-lg px-2 text-[11px] text-muted-foreground hover:text-destructive",
                              focus,
                            )}
                          >
                            <Trash2Icon size={12} aria-hidden="true" /> Remove
                          </Button>
                        </div>
                      )}
                      <Controller
                        name={`categoryGroups.${index}.category`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              htmlFor={`project-category-${group.id}`}
                              className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                            >
                              Category
                            </FieldLabel>
                            <Select
                              value={field.value}
                              disabled={loadingCategories}
                              onValueChange={(value) =>
                                handleCategoryChange(
                                  index,
                                  value,
                                  field.onChange,
                                )
                              }
                            >
                              <SelectTrigger
                                id={`project-category-${group.id}`}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                aria-invalid={fieldState.invalid}
                                className={cn(
                                  "h-12 w-full rounded-xl px-4",
                                  inputSurface,
                                  fieldState.invalid && "border-destructive",
                                )}
                              >
                                <SelectValue
                                  placeholder={
                                    loadingCategories
                                      ? "Loading categories..."
                                      : "Choose a category"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border border-border/65 bg-popover p-1 text-popover-foreground shadow-none dark:border-border dark:bg-popover">
                                <SelectGroup>
                                  {categories
                                    .filter(
                                      (category) =>
                                        category.name ===
                                          categoryGroups[index]?.category ||
                                        !categoryGroups.some(
                                          (selected, otherIndex) =>
                                            otherIndex !== index &&
                                            selected.category === category.name,
                                        ),
                                    )
                                    .map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.name}
                                        className="cursor-pointer rounded-lg text-xs focus:bg-surface-3/55 focus:text-foreground data-[highlighted]:bg-surface-3/55 data-[highlighted]:text-foreground data-[state=checked]:bg-brand-secondary-highlight/[0.07] data-[state=checked]:text-brand-secondary-highlight dark:focus:bg-surface-3/75 dark:focus:text-foreground dark:data-[highlighted]:bg-surface-3/75 dark:data-[highlighted]:text-foreground dark:data-[state=checked]:bg-secondary/[0.07] dark:data-[state=checked]:text-secondary"
                                      >
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            {categoriesError && (
                              <p className="text-xs text-destructive dark:text-status-overdue-foreground">
                                {categoriesError}
                              </p>
                            )}
                            <FieldError errors={[fieldState.error]} />
                          </Field>
                        )}
                      />
                      <Controller
                        name={`categoryGroups.${index}.skillIds`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel
                              htmlFor={`project-skill-search-${group.id}`}
                              className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                            >
                              Skills needed
                            </FieldLabel>
                            <SkillsPicker
                              skills={skills}
                              value={field.value}
                              category={categoryGroups[index]?.category || ""}
                              categoryId={
                                categories.find(
                                  (category) =>
                                    category.name ===
                                    categoryGroups[index]?.category,
                                )?.id
                              }
                              inputId={`project-skill-search-${group.id}`}
                              inputRef={field.ref}
                              onBlur={field.onBlur}
                              loading={loadingSkills}
                              error={skillsError}
                              invalid={fieldState.invalid}
                              disabled={!categoryGroups[index]?.category}
                              onChange={field.onChange}
                            />
                            <FieldDescription className={fieldDescriptionClass}>
                              Choose only the skills that matter for this
                              project.
                            </FieldDescription>
                            <FieldError errors={[fieldState.error]} />
                          </Field>
                        )}
                      />
                    </fieldset>
                  ))}
                  <div className="flex flex-col items-start gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!canAddCategory}
                      onClick={() => void addCategory()}
                      className={cn(
                        "h-10 rounded-lg px-4 text-xs font-semibold shadow-none",
                        secondaryButton,
                      )}
                    >
                      <PlusIcon size={14} aria-hidden="true" /> Add another
                      category
                    </Button>
                    <p className={fieldDescriptionClass}>
                      Need skills from another field? Add a category and choose
                      its skills.
                    </p>
                  </div>
                  {(categoriesError || skillsError) && (
                    <Button
                      type="button"
                      variant="outline"
                      className={secondaryButton}
                      disabled={loadingCategories || loadingSkills}
                      onClick={() =>
                        void Promise.all([loadCategories(), loadSkills()])
                      }
                    >
                      Retry loading categories and skills
                    </Button>
                  )}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <StepHeading
                  eyebrow="Plan the work"
                  title="Set a sensible timeline."
                  description="Add the dates, priority and budget that will help people understand the shape of the work."
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Controller
                    name="startDate"
                    control={form.control}
                    render={({ field }) => (
                      <Calendar28
                        id="startDate"
                        label="Start date"
                        value={field.value}
                        onChange={field.onChange}
                        className={cn("h-12 rounded-xl", calendarSurface)}
                      />
                    )}
                  />
                  <Controller
                    name="endDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Calendar28
                          id="endDate"
                          label="Due date"
                          value={field.value}
                          onChange={field.onChange}
                          className={cn(
                            "h-12 rounded-xl",
                            calendarSurface,
                            fieldState.invalid && "border-destructive",
                          )}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="text-sm font-semibold text-foreground/80 dark:text-foreground/90">
                        Priority
                      </FieldLabel>
                      <div className="grid gap-2.5 sm:grid-cols-3">
                        {[
                          {
                            value: "standard",
                            label: "Standard",
                            description: "Normal delivery pace",
                          },
                          {
                            value: "high",
                            label: "High",
                            description: "Needs extra attention",
                          },
                          {
                            value: "urgent",
                            label: "Urgent",
                            description: "Time-sensitive work",
                          },
                        ].map((option) => {
                          const isSelected = field.value === option.value;
                          return (
                            <label
                              key={option.value}
                              className={cn(
                                "group relative cursor-pointer rounded-xl border px-4 py-3.5 transition-[background-color,border-color] duration-150 focus-within:ring-2 focus-within:ring-ring/35 motion-reduce:transition-none",
                                isSelected
                                  ? "border-brand-secondary-highlight/20 bg-brand-secondary-highlight/[0.05] dark:border-secondary/20 dark:bg-secondary/[0.055]"
                                  : "border-border/60 bg-surface-2/35 hover:border-border/80 hover:bg-surface-2/55 dark:border-border dark:bg-surface-2/75 dark:hover:border-border dark:hover:bg-surface-3/70",
                              )}
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => field.onChange(option.value)}
                                className="sr-only"
                              />
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p
                                    className={cn(
                                      "text-xs font-semibold",
                                      isSelected
                                        ? "text-foreground/90 dark:text-foreground"
                                        : "text-foreground/75 dark:text-foreground/85",
                                    )}
                                  >
                                    {option.label}
                                  </p>
                                  <p className="mt-1 text-[0.64rem] text-muted-foreground/85 dark:text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "flex h-4 w-4 items-center justify-center rounded-full border transition-[background-color,border-color,color] motion-reduce:transition-none",
                                    isSelected
                                      ? "border-brand-secondary-highlight/40 bg-brand-secondary-highlight/[0.12] text-brand-secondary-highlight dark:border-secondary/45 dark:bg-secondary/[0.12] dark:text-secondary"
                                      : "border-border bg-transparent dark:border-border",
                                  )}
                                >
                                  {isSelected && (
                                    <CheckIcon size={9} strokeWidth={3} />
                                  )}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </Field>
                  )}
                />
                <Controller
                  name="budget"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel
                        htmlFor="project-budget"
                        className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                      >
                        Estimated budget
                      </FieldLabel>
                      <div className="group flex h-12 items-center overflow-hidden rounded-xl border border-border/65 bg-surface-2/45 text-foreground/80 transition-[background-color,border-color,box-shadow] duration-150 hover:border-border/85 hover:bg-surface-2/60 focus-within:border-brand-secondary-highlight/30 focus-within:bg-surface-1 focus-within:ring-1 focus-within:ring-brand-secondary-highlight/15 dark:border-border dark:bg-surface-2/85 dark:text-foreground/90 dark:hover:border-border dark:hover:bg-surface-3/70 dark:focus-within:border-secondary/25 dark:focus-within:bg-surface-2 dark:focus-within:ring-secondary/15 motion-reduce:transition-none">
                        <div className="flex h-full items-center gap-2 border-r border-border/55 px-4 text-muted-foreground/85 dark:border-border dark:text-muted-foreground">
                          <CircleDollarSignIcon size={15} aria-hidden="true" />
                          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.08em]">
                            USD
                          </span>
                        </div>
                        <input
                          {...field}
                          id="project-budget"
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value === "" || /^\d*\.?\d{0,2}$/.test(value))
                              field.onChange(value);
                          }}
                          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold text-foreground/80 caret-brand-secondary-highlight outline-none placeholder:font-normal placeholder:text-muted-foreground/55 dark:text-foreground/90 dark:caret-secondary dark:placeholder:text-muted-foreground/60"
                        />
                      </div>
                      <FieldDescription className={fieldDescriptionClass}>
                        Optional. Leave blank if price will be agreed later.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </>
            )}
            {step === 3 && (
              <>
                <StepHeading
                  eyebrow="The brief"
                  title="Describe what success looks like."
                  description={
                    hasSelectedAllocat
                      ? `Give ${selectedAllocatFirstName || "the Allocat"} enough context to understand the job, the outcome and any important constraints.`
                      : "Give the Allocat enough context to understand the job, the outcome and any important constraints."
                  }
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="project-brief"
                        className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                      >
                        Project brief
                      </FieldLabel>
                      <InputGroup
                        className={cn(
                          "overflow-hidden rounded-xl border-border/65 bg-surface-2/45 shadow-none transition-[background-color,border-color,box-shadow] duration-150 focus-within:border-brand-secondary-highlight/30 focus-within:bg-surface-1 focus-within:ring-1 focus-within:ring-brand-secondary-highlight/15 dark:border-border dark:bg-surface-2/85 dark:focus-within:border-secondary/25 dark:focus-within:bg-surface-2 dark:focus-within:ring-secondary/15 motion-reduce:transition-none",
                          fieldState.invalid && "border-destructive",
                        )}
                      >
                        <InputGroupTextarea
                          {...field}
                          id="project-brief"
                          disabled={Boolean(savedProject)}
                          aria-invalid={fieldState.invalid}
                          rows={8}
                          placeholder="What needs to be delivered? What matters most? Are there requirements, references or constraints?"
                          className="min-h-[190px] resize-none bg-transparent px-4 py-4 text-sm leading-7 text-foreground/80 caret-brand-secondary-highlight placeholder:text-muted-foreground/55 focus-visible:bg-transparent focus-visible:ring-0 dark:text-foreground/90 dark:caret-secondary dark:placeholder:text-muted-foreground/60"
                        />
                        <InputGroupAddon
                          align="block-end"
                          className="border-t border-border/55 bg-surface-3/25 px-4 py-2.5 dark:border-border dark:bg-surface-3/45"
                        >
                          <InputGroupText className="ml-auto text-[0.62rem] text-muted-foreground/75 dark:text-muted-foreground">
                            {field.value.length}/2000
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Field>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <FieldLabel className="text-sm font-semibold text-foreground/80 dark:text-foreground/90">
                        Supporting files
                      </FieldLabel>
                      <p className="mt-1 text-[0.67rem] text-muted-foreground/85 dark:text-muted-foreground">
                        Add references, documents or media to the project.
                      </p>
                    </div>
                    <span className="rounded-md bg-surface-3/60 px-2 py-1 text-[0.58rem] font-semibold text-muted-foreground dark:bg-surface-3/70 dark:text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <div className="mt-3 overflow-hidden rounded-xl border border-dashed border-border/65 bg-surface-2/35 p-3 transition-[background-color,border-color] duration-150 hover:border-border/85 hover:bg-surface-2/55 dark:border-border dark:bg-surface-2/75 dark:hover:border-border dark:hover:bg-surface-3/65 motion-reduce:transition-none">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={FILE_ACCEPT}
                      aria-label="Choose supporting project files"
                      className="sr-only"
                      onChange={(event) => {
                        const files = Array.from(event.target.files || []);
                        event.target.value = "";
                        chooseFiles(files);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "h-10 rounded-lg px-4 text-xs font-semibold shadow-none",
                        secondaryButton,
                      )}
                    >
                      <UploadIcon size={14} aria-hidden="true" /> Choose files
                    </Button>
                    <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                      Up to 25 MB per file. Files upload when you create the
                      project.
                    </p>
                    {briefFiles.length > 0 && (
                      <ul
                        className="mt-4 space-y-2"
                        aria-label="Supporting project files"
                      >
                        {briefFiles.map((entry) => (
                          <li
                            key={entry.key}
                            className="flex min-w-0 items-start gap-3 rounded-lg border border-border/60 bg-card px-3 py-3 dark:border-border"
                          >
                            <FileTextIcon
                              size={15}
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-muted-foreground"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="break-words text-xs font-medium text-foreground/85">
                                {entry.file.name}
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                {formatFileSize(entry.file.size)}
                              </p>
                              <p
                                role="status"
                                className={cn(
                                  "mt-1 text-[11px] leading-5",
                                  entry.status === "error"
                                    ? "text-destructive dark:text-status-overdue-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {entry.status === "uploaded"
                                  ? "Uploaded to project"
                                  : entry.status === "uploading"
                                    ? `Uploading · ${entry.progress}%`
                                    : entry.status === "error"
                                      ? entry.error
                                      : "Ready to upload"}
                              </p>
                            </div>
                            {entry.status === "uploaded" ? (
                              <CheckIcon
                                size={14}
                                aria-hidden="true"
                                className="shrink-0 text-brand-secondary-highlight dark:text-secondary"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeBriefFile(entry.key)}
                                disabled={isSubmitting}
                                aria-label={`Remove file ${entry.file.name}`}
                                className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive",
                                  focus,
                                )}
                              >
                                <XIcon size={13} aria-hidden="true" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>
              </>
            )}
          </FieldGroup>
        </fieldset>
        <div className="mt-9 border-t border-border/55 pt-6 dark:border-border">
          {step < 3 ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className={previousButton}
                  >
                    <ArrowLeftIcon size={14} aria-hidden="true" />
                    Previous
                  </Button>
                )}
              </div>
              <Button
                type="button"
                onClick={handleNext}
                className={cn(
                  "group h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
                  primaryButton,
                )}
              >
                Continue
                <ArrowRightIcon
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </Button>
            </div>
          ) : savedProject ? (
            <div>
              <p
                role="status"
                className="mb-4 text-xs leading-6 text-muted-foreground"
              >
                Your project is saved.{" "}
                {isSubmitting
                  ? "Finishing uploads and setup… Keep this page open."
                  : "Retry any failed uploads, or remove those files and continue. Uploaded files are already in the project."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() =>
                    navigate(`/projects/${savedProject.project.id}`)
                  }
                  className={cn(
                    "h-10 rounded-lg px-4 text-xs shadow-none",
                    secondaryButton,
                  )}
                >
                  Open saved project
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "h-10 rounded-lg px-5 text-xs font-semibold shadow-none",
                    primaryButton,
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircleIcon
                        size={14}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />{" "}
                      Finishing…
                    </>
                  ) : briefFiles.some(
                      (entry) => entry.status !== "uploaded",
                    ) ? (
                    "Retry uploads & continue"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </div>
          ) : hasSelectedAllocat ? (
            <div>
              <div className="mb-5 flex items-start gap-3">
                <span
                  className={
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                    helperIconSurface
                  }
                >
                  <UserPlusIcon size={14} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground/80 dark:text-foreground/90">
                    Ready to start working together.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    The project will be created and its files uploaded, then{" "}
                    {selectedAllocatName || "the selected Allocat"} will receive
                    an invitation.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className={previousButton}
                >
                  <ArrowLeftIcon size={14} aria-hidden="true" />
                  Previous
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setIntent("invite")}
                  className={cn(
                    "group h-11 rounded-lg px-5 text-xs font-semibold shadow-none",
                    primaryButton,
                  )}
                >
                  {isSubmitting && submitIntent === "invite" ? (
                    <>
                      <LoaderCircleIcon
                        size={14}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                      Creating &amp; inviting...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon size={14} aria-hidden="true" />
                      {selectedAllocatFirstName
                        ? `Create project & invite ${selectedAllocatFirstName}`
                        : "Create project & invite"}
                      <ArrowRightIcon
                        size={13}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-start gap-3">
                <span
                  className={
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                    helperIconSurface
                  }
                >
                  <SparklesIcon size={14} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground/80 dark:text-foreground/90">
                    Ready to create it.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Save the project now, or continue directly into finding the
                    right Allocats.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className={previousButton}
                >
                  <ArrowLeftIcon size={14} aria-hidden="true" />
                  Previous
                </Button>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => setIntent("post")}
                    className={cn(
                      "h-11 rounded-lg px-5 text-xs font-semibold shadow-none",
                      secondaryButton,
                    )}
                  >
                    {isSubmitting && submitIntent === "post" ? (
                      <>
                        <LoaderCircleIcon
                          size={14}
                          aria-hidden="true"
                          className="animate-spin motion-reduce:animate-none"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <SendIcon size={14} aria-hidden="true" />
                        Create project
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => setIntent("find")}
                    className={cn(
                      "group h-11 rounded-lg px-5 text-xs font-semibold shadow-none",
                      primaryButton,
                    )}
                  >
                    {isSubmitting && submitIntent === "find" ? (
                      <>
                        <LoaderCircleIcon
                          size={14}
                          aria-hidden="true"
                          className="animate-spin motion-reduce:animate-none"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <SearchIcon size={14} aria-hidden="true" />
                        Create &amp; find Allocats
                        <ArrowRightIcon
                          size={13}
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                        />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function StepHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-1 max-w-2xl">
      <div className="mb-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight/75 dark:bg-secondary/80"
        />
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-brand-secondary-highlight/85 dark:text-secondary/90">
          {eyebrow}
        </p>
      </div>
      <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] text-foreground/85 sm:text-2xl dark:text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
type SkillsPickerProps = {
  inputId: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onBlur?: () => void;
  categoryId?: string;
  skills: SkillOption[];
  value: string[];
  category: string;
  onChange: (value: string[]) => void;
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  error?: string | null;
};
function SkillsPicker({
  inputId,
  inputRef,
  onBlur,
  categoryId,
  skills,
  value,
  category,
  onChange,
  loading = false,
  disabled = false,
  invalid = false,
  error,
}: SkillsPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const listId = `${inputId}-options`;
  useEffect(() => {
    setQuery("");
    setOpen(false);
  }, [categoryId]);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !pickerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", dismiss, true);
    return () => document.removeEventListener("pointerdown", dismiss, true);
  }, [open]);
  const selectedSkills = useMemo(
    () =>
      value
        .map((id) => skills.find((skill) => skill.id === id))
        .filter((skill): skill is SkillOption => Boolean(skill)),
    [skills, value],
  );
  const availableSkills = useMemo(() => {
    if (!category) return [];
    const search = query.trim().toLowerCase();
    return skills
      .filter((skill) => skill.categoryId === categoryId)
      .filter((skill) => !value.includes(skill.id))
      .filter((skill) => !search || skill.name.toLowerCase().includes(search))
      .sort((first, second) => first.name.localeCompare(second.name));
  }, [category, categoryId, query, skills, value]);
  const categorySkillCount = skills.filter(
    (skill) => skill.categoryId === categoryId,
  ).length;
  function addSkill(skillId: string) {
    if (
      disabled ||
      loading ||
      error ||
      value.includes(skillId) ||
      value.length >= 15
    )
      return;
    onChange([...value, skillId]);
    setQuery("");
  }
  function removeSkill(skillId: string) {
    onChange(value.filter((id) => id !== skillId));
  }
  return (
    <div
      ref={pickerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          // Restore focus without reopening the list.
          pickerRef.current?.querySelector("input")?.focus();
        }
      }}
      className={cn(
        "overflow-hidden rounded-xl border bg-surface-2/45 transition-[background-color,border-color,box-shadow] duration-150 focus-within:border-brand-secondary-highlight/30 focus-within:bg-surface-1 focus-within:ring-1 focus-within:ring-brand-secondary-highlight/15 dark:bg-surface-2/85 dark:focus-within:border-secondary/25 dark:focus-within:bg-surface-2 dark:focus-within:ring-secondary/15 motion-reduce:transition-none",
        invalid ? "border-destructive" : "border-border/65 dark:border-border",
        disabled && "opacity-60",
      )}
    >
      <div className="relative flex min-h-12 items-center gap-2 px-3">
        <SearchIcon
          size={14}
          aria-hidden="true"
          className="shrink-0 text-muted-foreground/80"
        />
        <input
          id={inputId}
          ref={inputRef}
          onBlur={onBlur}
          value={query}
          aria-expanded={open && !disabled && !loading}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "Enter") {
              event.preventDefault();
              setOpen(true);
            }
          }}
          disabled={disabled || loading || Boolean(error)}
          aria-invalid={invalid}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            !category
              ? "Choose a category first"
              : loading
                ? "Loading skills..."
                : "Search available skills"
          }
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground/80 caret-brand-secondary-highlight outline-none placeholder:text-muted-foreground/55 dark:text-foreground/90 dark:caret-secondary dark:placeholder:text-muted-foreground/60"
        />
        {loading && (
          <LoaderCircleIcon
            size={14}
            aria-hidden="true"
            className="animate-spin text-muted-foreground motion-reduce:animate-none"
          />
        )}
        {!loading && category && (
          <span className="shrink-0 text-[0.6rem] font-medium text-muted-foreground/75 dark:text-muted-foreground">
            {value.length}/{Math.min(15, categorySkillCount || 15)}
          </span>
        )}
      </div>
      {selectedSkills.length > 0 && (
        <div className="border-t border-border/55 px-3 py-3 dark:border-border">
          <p className="mb-2 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground/75">
            Selected
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className="group inline-flex items-center gap-2 rounded-lg border border-brand-secondary-highlight/10 bg-brand-secondary-highlight/[0.055] px-2.5 py-1.5 text-[0.67rem] font-semibold text-foreground/70 dark:border-border dark:bg-surface-3/55 dark:text-foreground/85"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand-secondary-highlight/70 dark:bg-secondary/80"
                />
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className={
                    "ml-0.5 flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-brand-secondary-highlight/[0.08] hover:text-brand-secondary-highlight dark:hover:bg-secondary/[0.08] dark:hover:text-secondary motion-reduce:transition-none " +
                    focus
                  }
                  aria-label={`Remove ${skill.name}`}
                >
                  <XIcon size={10} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      {open && !disabled && !loading && (
        <div
          id={listId}
          role="group"
          aria-label={`Available skills in ${category}`}
          className="border-t border-border/55 px-2 py-2 dark:border-border"
        >
          {error ? (
            <div className="px-2 py-3">
              <p className="text-xs text-destructive dark:text-status-overdue-foreground">
                {error}
              </p>
            </div>
          ) : availableSkills.length > 0 ? (
            <div className="max-h-56 overflow-y-auto">
              {availableSkills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  disabled={value.length >= 15}
                  onClick={() => addSkill(skill.id)}
                  className={
                    "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-surface-3/55 disabled:pointer-events-none disabled:opacity-45 dark:hover:bg-surface-3/75 motion-reduce:transition-none " +
                    focus
                  }
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground/80 dark:text-foreground/90">
                      {skill.name}
                    </p>
                    <p className="mt-0.5 text-[0.57rem] text-muted-foreground/80 dark:text-muted-foreground">
                      {skill.category}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md " +
                      helperIconSurface
                    }
                  >
                    <CheckIcon size={11} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-3">
              <p className="text-xs text-muted-foreground">
                {query.trim()
                  ? "No matching skills found."
                  : "No skills are available for this category yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function getFirstName(name?: string | null) {
  if (!name?.trim()) return "";
  return name.trim().split(/\s+/)[0] ?? "";
}
