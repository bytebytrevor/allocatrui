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
  SearchIcon,
  SendIcon,
  SparklesIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import MultiFileUpload from "./MultiFileUpload";

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

/* =========================================================
   TYPES
========================================================= */

type SkillCategoryOption = {
  id: string;
  name: string;
};

type FormValues = z.infer<typeof formSchema>;
type Step = 1 | 2 | 3;
type SubmitIntent = "post" | "find" | "invite";

type Props = {
  selectedAllocatId?: string | null;
  selectedAllocatName?: string | null;
};

/* =========================================================
   VALIDATION
========================================================= */

const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "Use at least 5 characters.")
      .max(64, "Keep the title below 64 characters."),

    category: z
      .string()
      .min(1, "Choose a category."),

    skillIds: z
      .array(z.string().uuid())
      .min(1, "Choose at least one relevant skill.")
      .max(15, "Choose no more than 15 skills."),

    startDate: z.date().nullable(),
    endDate: z.date().nullable(),

    description: z
      .string()
      .min(20, "Describe the project in at least 20 characters.")
      .max(2000, "Keep the description below 2,000 characters."),

    priority: z.enum([
      "standard",
      "high",
      "urgent",
    ]),

    budget: z.string().optional(),
  })
  .refine(
    values => {
      if (!values.startDate || !values.endDate) return true;
      return values.endDate >= values.startDate;
    },
    {
      message: "The end date must be after the start date.",
      path: ["endDate"],
    },
  );

/* =========================================================
   STEPS
========================================================= */

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Planning" },
  { number: 3, label: "Brief" },
] as const;

const stepFields: Record<Step, (keyof FormValues)[]> = {
  1: ["title", "category", "skillIds"],
  2: ["startDate", "endDate", "priority", "budget"],
  3: ["description"],
};

/* =========================================================
   STYLE
========================================================= */

const inputSurface = [
  "border-[#0D566D]/[0.09] bg-[#F1F6F4] shadow-none",
  "text-[#33484D] placeholder:text-[#8A989B]",
  "caret-[#0D566D]",
  "hover:border-[#0D566D]/[0.14] hover:bg-[#EDF4F1]",
  "focus-visible:border-[#0D566D]/30 focus-visible:bg-[#F1F6F4]",
  "focus-visible:text-[#33484D]",
  "focus-visible:ring-1 focus-visible:ring-[#0D566D]/20",

  "dark:border-white/[0.075] dark:bg-[#10262D]",
  "dark:text-[#E6EEF0] dark:placeholder:text-[#6F838A]",
  "dark:caret-[#DEDA00]",
  "dark:hover:border-white/[0.11] dark:hover:bg-[#123039]",
  "dark:focus-visible:border-[#DEDA00]/30",
  "dark:focus-visible:bg-[#10262D]",
  "dark:focus-visible:text-[#F1F5F9]",
  "dark:focus-visible:ring-[#DEDA00]/15",
].join(" ");

const fieldDescriptionClass =
  "text-[0.67rem] text-[#748286] dark:text-[#94A3B8]";

const primaryButton = [
  "bg-[#0D566D] text-white",
  "hover:bg-[#0A4B5F] hover:text-white",
  "dark:bg-[#DEDA00] dark:text-[#303030]",
  "dark:hover:bg-[#D4D000] dark:hover:text-[#303030]",
].join(" ");

const secondaryButton = [
  "border-[#0D566D]/[0.11] bg-[#F3F7F5] text-[#31545D]",
  "hover:border-[#0D566D]/20 hover:bg-[#E9F1EE] hover:text-[#153F49]",
  "dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-[#CBD5E1]",
  "dark:hover:border-white/[0.14] dark:hover:bg-white/[0.05] dark:hover:text-white",
].join(" ");

/* =========================================================
   FORM
========================================================= */

function NewProjectForm({
  selectedAllocatId = null,
  selectedAllocatName = null,
}: Props) {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [submitIntent, setSubmitIntent] = useState<SubmitIntent>("post");
  const submitIntentRef = useRef<SubmitIntent>("post");

  const hasSelectedAllocat = Boolean(selectedAllocatId);

  /* =======================================================
     DATABASE CATEGORIES
  ======================================================= */

  const [categories, setCategories] = useState<SkillCategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  /* =======================================================
     DATABASE SKILLS
  ======================================================= */

  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  /* =======================================================
     DATES
  ======================================================= */

  const today = useMemo(() => new Date(), []);

  const tomorrow = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() + 1);
    return date;
  }, [today]);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: "",
      category: "",
      skillIds: [],
      description: "",
      startDate: today,
      endDate: tomorrow,
      priority: "standard",
      budget: "",
    },
  });

  const { isSubmitting } = form.formState;
  const selectedCategory = form.watch("category");

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);

      const response = await api.get<SkillCategoryOption[]>(
        "/skill-categories",
        { withCredentials: true },
      );

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      console.error("Could not load skill categories:", error);

      setCategories([]);
      setCategoriesError("The category catalogue could not be loaded.");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  /* =======================================================
     LOAD SKILLS
  ======================================================= */

  const loadSkills = useCallback(async () => {
    try {
      setLoadingSkills(true);
      setSkillsError(null);

      const response = await api.get<SkillOption[]>(
        "/skills",
        { withCredentials: true },
      );

      setSkills(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      console.error("Could not load skills:", error);

      setSkills([]);
      setSkillsError("The skills catalogue could not be loaded.");
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  useEffect(() => {
    void Promise.all([
      loadCategories(),
      loadSkills(),
    ]);
  }, [loadCategories, loadSkills]);

  /* =======================================================
     STEP NAVIGATION
  ======================================================= */

  async function handleNext() {
    const isValid = await form.trigger(
      stepFields[step],
      { shouldFocus: true },
    );

    if (!isValid) return;

    if (step < 3) {
      setStep(current => (current + 1) as Step);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(current => (current - 1) as Step);
    }
  }

  function setIntent(intent: SubmitIntent) {
    submitIntentRef.current = intent;
    setSubmitIntent(intent);
  }

  /* =======================================================
     CATEGORY
  ======================================================= */

  function handleCategoryChange(
    category: string,
    onChange: (value: string) => void,
  ) {
    const currentCategory = form.getValues("category");

    if (currentCategory && currentCategory !== category) {
      form.setValue("skillIds", [], {
        shouldValidate: true,
      });
    }

    onChange(category);
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function onSubmit(values: FormValues) {
    const intent = submitIntentRef.current;

    const payload: CreateProjectRequest = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      skillIds: values.skillIds,

      startDate: toLocalDateOnly(
        values.startDate ?? new Date(),
      ),

      dueDate: toLocalDateOnly(
        values.endDate ?? new Date(),
      ),

      priority: values.priority,

      isPublic: false,
      allowBids: false,

      budget: Number(values.budget || 0),
      currency: "USD",
    };

    try {
      const response = await api.post<Project>(
        "/projects",
        payload,
        { withCredentials: true },
      );

      const project = response.data;

      /* ===================================================
         CREATE + INVITE
      =================================================== */

      if (selectedAllocatId) {
        try {
          await api.put(
            `/projects/${project.id}/allocats/${selectedAllocatId}/invite`,
            {},
            { withCredentials: true },
          );

          toast.success(
            selectedAllocatName
              ? `${selectedAllocatName} has been invited to ${project.title}.`
              : "Project created and invitation sent.",
          );

          navigate(`/projects/${project.id}`);
          return;
        } catch (inviteError) {
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

      /* ===================================================
         NORMAL CREATE
      =================================================== */

      toast.success("Project created successfully.");

      if (intent === "find") {
        navigate(`/projects/${project.id}/allocats/find`);
        return;
      }

      navigate("/projects");
    } catch (error) {
      console.error("Could not create project:", error);

      toast.error(
        "We could not create the project. Please try again.",
      );
    }
  }

  const selectedAllocatFirstName = getFirstName(selectedAllocatName);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={[
        "overflow-hidden rounded-[1.3rem] border",
        "border-[#0D566D]/[0.085] bg-[#F8FAF8]",
        "shadow-[0_18px_48px_-42px_rgba(13,86,109,0.26)]",
        "dark:border-white/[0.065] dark:bg-[#0C1D22]",
        "dark:shadow-[0_18px_48px_-34px_rgba(0,0,0,0.48)]",
      ].join(" ")}
    >
      {/* =================================================
          STEP INDICATOR
      ================================================= */}

      <div className="border-b border-[#0D566D]/[0.07] bg-[#EAF2EF] px-4 py-4 sm:px-6 dark:border-white/[0.06] dark:bg-[#10262D]">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center">
            {steps.map((item, index) => {
              const isActive = step === item.number;
              const isComplete = step > item.number;

              return (
                <React.Fragment key={item.number}>
                  <button
                    type="button"
                    disabled={item.number > step}
                    onClick={() => {
                      if (item.number < step) {
                        setStep(item.number);
                      }
                    }}
                    className={cn(
                      "group flex shrink-0 items-center gap-2",
                      item.number < step
                        ? "cursor-pointer"
                        : "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border",
                        "text-[0.64rem] font-semibold transition-colors duration-200",

                        isActive &&
                          [
                            "border-[#0D566D] bg-[#0D566D] text-white",
                            "dark:border-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#303030]",
                          ].join(" "),

                        isComplete &&
                          [
                            "border-[#0D566D]/20 bg-[#DCE8E4] text-[#0D566D]",
                            "dark:border-[#DEDA00]/15 dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]",
                          ].join(" "),

                        !isActive &&
                          !isComplete &&
                          [
                            "border-[#0D566D]/[0.08] bg-[#F3F7F5] text-[#7A888B]",
                            "dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-[#7F9198]",
                          ].join(" "),
                      )}
                    >
                      {isComplete ? (
                        <CheckIcon size={12} strokeWidth={2.7} />
                      ) : (
                        item.number
                      )}
                    </span>

                    <span
                      className={cn(
                        "hidden text-xs font-semibold sm:block",
                        isActive
                          ? "text-[#283B40] dark:text-white"
                          : "text-[#758386] dark:text-[#94A3B8]",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>

                  {index < steps.length - 1 && (
                    <div className="mx-3 h-px w-5 overflow-hidden bg-[#0D566D]/[0.10] sm:w-12 dark:bg-white/[0.07]">
                      <div
                        className={cn(
                          "h-full origin-left bg-[#0D566D] transition-transform duration-300",
                          "dark:bg-[#DEDA00]",
                          step > item.number
                            ? "scale-x-100"
                            : "scale-x-0",
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <span className="shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-[#748286] dark:text-[#94A3B8]">
            {step} of {steps.length}
          </span>
        </div>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        id="new-project"
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-0 px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
      >
        <FieldGroup className="gap-7">
          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <>
              <StepHeading
                eyebrow="Start here"
                title="Give the project an identity."
                description="A clear title, category and the right skills make the project easier to understand and match."
              />

              {/* TITLE */}

              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold">
                      Project title
                    </FieldLabel>

                    <Input
                      {...field}
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

              {/* CATEGORY */}

              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold">
                      Category
                    </FieldLabel>

                    <Select
                      value={field.value}
                      disabled={loadingCategories}
                      onValueChange={value =>
                        handleCategoryChange(
                          value,
                          field.onChange,
                        )
                      }
                    >
                      <SelectTrigger
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
                              : "Choose the closest category"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent
                        className={[
                          "border-[#0D566D]/[0.09] bg-[#F8FAF8] text-[#30383A]",
                          "dark:border-white/[0.08] dark:bg-[#10262D] dark:text-[#E6EEF0]",
                        ].join(" ")}
                      >
                        <SelectGroup>
                          {categories.map(category => (
                            <SelectItem
                              key={category.id}
                              value={category.name}
                              className={[
                                "cursor-pointer",
                                "focus:bg-[#E7EFEC] focus:text-[#30383A]",
                                "data-[state=checked]:bg-[#E7EFEC] data-[state=checked]:text-[#0D566D]",
                                "dark:focus:bg-white/[0.05] dark:focus:text-white",
                                "dark:data-[state=checked]:bg-[#DEDA00]/[0.07]",
                                "dark:data-[state=checked]:text-[#DEDA00]",
                              ].join(" ")}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {categoriesError && (
                      <p className="text-xs text-destructive">
                        {categoriesError}
                      </p>
                    )}

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* SKILLS */}

              <Controller
                name="skillIds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold">
                      Skills needed
                    </FieldLabel>

                    <SkillsPicker
                      skills={skills}
                      value={field.value}
                      category={selectedCategory}
                      loading={loadingSkills}
                      error={skillsError}
                      invalid={fieldState.invalid}
                      disabled={!selectedCategory}
                      onChange={field.onChange}
                    />

                    <FieldDescription className={fieldDescriptionClass}>
                      Choose only the skills that matter for this project.
                    </FieldDescription>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <>
              <StepHeading
                eyebrow="Plan the work"
                title="Set a sensible timeline."
                description="Add the dates, priority and budget that will help people understand the shape of the work."
              />

              {/* DATES */}

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
                      className={cn(
                        "h-12 rounded-xl",
                        inputSurface,
                      )}
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
                          inputSurface,
                          fieldState.invalid && "border-destructive",
                        )}
                      />

                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>

              {/* PRIORITY */}

              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-semibold">
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
                      ].map(option => {
                        const isSelected = field.value === option.value;

                        return (
                          <label
                            key={option.value}
                            className={cn(
                              "group relative cursor-pointer rounded-xl border px-4 py-3.5",
                              "transition-colors duration-200",

                              isSelected
                                ? [
                                    "border-[#0D566D]/20 bg-[#E7F0ED]",
                                    "dark:border-[#DEDA00]/18 dark:bg-[#DEDA00]/[0.045]",
                                  ].join(" ")
                                : [
                                    "border-[#0D566D]/[0.08] bg-[#F1F6F4]",
                                    "hover:border-[#0D566D]/15 hover:bg-[#EDF4F1]",
                                    "dark:border-white/[0.075] dark:bg-[#10262D]",
                                    "dark:hover:border-white/[0.11] dark:hover:bg-[#123039]",
                                  ].join(" "),
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
                                    isSelected &&
                                      "text-[#0D566D] dark:text-[#F1F5F9]",
                                  )}
                                >
                                  {option.label}
                                </p>

                                <p className="mt-1 text-[0.64rem] text-[#758386] dark:text-[#94A3B8]">
                                  {option.description}
                                </p>
                              </div>

                              <span
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",

                                  isSelected
                                    ? [
                                        "border-[#0D566D] bg-[#0D566D] text-white",
                                        "dark:border-[#DEDA00] dark:bg-[#DEDA00] dark:text-[#303030]",
                                      ].join(" ")
                                    : "border-[#879699]/40 bg-transparent dark:border-white/15",
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

              {/* BUDGET */}

              <Controller
                name="budget"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-sm font-semibold">
                      Estimated budget
                    </FieldLabel>

                    <div
                      className={[
                        "group flex h-12 items-center overflow-hidden rounded-xl border",
                        "border-[#0D566D]/[0.09] bg-[#F1F6F4]",
                        "text-[#33484D]",
                        "transition-colors",
                        "hover:border-[#0D566D]/[0.14] hover:bg-[#EDF4F1]",
                        "focus-within:border-[#0D566D]/30",
                        "focus-within:ring-1 focus-within:ring-[#0D566D]/20",

                        "dark:border-white/[0.075] dark:bg-[#10262D]",
                        "dark:text-[#E6EEF0]",
                        "dark:hover:border-white/[0.11] dark:hover:bg-[#123039]",
                        "dark:focus-within:border-[#DEDA00]/30",
                        "dark:focus-within:bg-[#10262D]",
                        "dark:focus-within:ring-[#DEDA00]/15",
                      ].join(" ")}
                    >
                      <div className="flex h-full items-center gap-2 border-r border-[#0D566D]/[0.07] px-4 text-[#65797E] dark:border-white/[0.06] dark:text-[#94A3B8]">
                        <CircleDollarSignIcon size={15} />

                        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.08em]">
                          USD
                        </span>
                      </div>

                      <input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        onChange={event => {
                          const value = event.target.value;

                          if (
                            value === "" ||
                            /^\d*\.?\d{0,2}$/.test(value)
                          ) {
                            field.onChange(value);
                          }
                        }}
                        className={[
                          "h-full min-w-0 flex-1 bg-transparent px-4 outline-none",
                          "text-sm font-semibold text-[#33484D]",
                          "caret-[#0D566D]",
                          "placeholder:font-normal placeholder:text-[#8A989B]",
                          "focus:bg-transparent",
                          "dark:text-[#E6EEF0] dark:caret-[#DEDA00]",
                          "dark:placeholder:text-[#6F838A]",
                          "dark:focus:bg-transparent",
                        ].join(" ")}
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

          {/* =================================================
              STEP 3
          ================================================= */}

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

              {/* BRIEF */}

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-sm font-semibold">
                      Project brief
                    </FieldLabel>

                    <InputGroup
                      className={cn(
                        "overflow-hidden rounded-xl shadow-none",
                        "border-[#0D566D]/[0.09] bg-[#F1F6F4]",
                        "transition-colors",
                        "focus-within:border-[#0D566D]/30",
                        "focus-within:bg-[#F1F6F4]",
                        "focus-within:ring-1 focus-within:ring-[#0D566D]/20",

                        "dark:border-white/[0.075] dark:bg-[#10262D]",
                        "dark:focus-within:border-[#DEDA00]/30",
                        "dark:focus-within:bg-[#10262D]",
                        "dark:focus-within:ring-[#DEDA00]/15",

                        fieldState.invalid && "border-destructive",
                      )}
                    >
                      <InputGroupTextarea
                        {...field}
                        rows={8}
                        placeholder="What needs to be delivered? What matters most? Are there requirements, references or constraints?"
                        className={[
                          "min-h-[190px] resize-none bg-transparent px-4 py-4",
                          "text-sm leading-7 text-[#33484D]",
                          "caret-[#0D566D]",
                          "placeholder:text-[#8A989B]",
                          "focus-visible:bg-transparent focus-visible:ring-0",

                          "dark:bg-transparent dark:text-[#E6EEF0]",
                          "dark:caret-[#DEDA00]",
                          "dark:placeholder:text-[#6F838A]",
                          "dark:focus-visible:bg-transparent",
                        ].join(" ")}
                      />

                      <InputGroupAddon
                        align="block-end"
                        className="border-t border-[#0D566D]/[0.07] bg-[#E8F0ED]/70 px-4 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.025]"
                      >
                        <InputGroupText className="ml-auto text-[0.62rem] text-[#748286] dark:text-[#94A3B8]">
                          {field.value.length}/2000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* FILES */}

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel className="text-sm font-semibold">
                      Supporting files
                    </FieldLabel>

                    <p className="mt-1 text-[0.67rem] text-[#748286] dark:text-[#94A3B8]">
                      References can make the brief clearer.
                    </p>
                  </div>

                  <span className="rounded-md bg-[#E4ECE9] px-2 py-1 text-[0.58rem] font-semibold text-[#667A7F] dark:bg-white/[0.045] dark:text-[#94A3B8]">
                    Optional
                  </span>
                </div>

                <div
                  className={[
                    "mt-3 overflow-hidden rounded-xl border border-dashed p-3",
                    "border-[#0D566D]/[0.13] bg-[#F1F6F4]",
                    "transition-colors hover:bg-[#EDF4F1]",
                    "dark:border-white/[0.09] dark:bg-[#10262D]",
                    "dark:hover:bg-[#123039]",
                  ].join(" ")}
                >
                  <MultiFileUpload autoUpload={false} />
                </div>
              </Field>
            </>
          )}
        </FieldGroup>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-9 border-t border-[#0D566D]/[0.07] pt-6 dark:border-white/[0.06]">
          {step < 3 ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="h-10 rounded-lg px-3 text-xs text-[#718084] shadow-none hover:bg-[#EAF1EF] hover:text-[#31545D] dark:text-[#94A3B8] dark:hover:bg-white/[0.04] dark:hover:text-white"
                  >
                    <ArrowLeftIcon size={14} />
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
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Button>
            </div>
          ) : hasSelectedAllocat ? (
            <div>
              <div className="mb-5 flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DCE8E4] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                  <UserPlusIcon size={14} />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Ready to start working together.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#718084] dark:text-[#94A3B8]">
                    The project will be created first, then{" "}
                    {selectedAllocatName || "the selected Allocat"}{" "}
                    will receive an invitation.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="h-10 rounded-lg px-3 text-xs text-[#718084] shadow-none hover:bg-[#EAF1EF] dark:text-[#94A3B8] dark:hover:bg-white/[0.04]"
                >
                  <ArrowLeftIcon size={14} />
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
                      <LoaderCircleIcon size={14} className="animate-spin" />
                      Creating & inviting...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon size={14} />

                      {selectedAllocatFirstName
                        ? `Create project & invite ${selectedAllocatFirstName}`
                        : "Create project & invite"}

                      <ArrowRightIcon
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DCE8E4] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                  <SparklesIcon size={14} />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Ready to create it.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#718084] dark:text-[#94A3B8]">
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
                  className="h-10 rounded-lg px-3 text-xs text-[#718084] shadow-none hover:bg-[#EAF1EF] dark:text-[#94A3B8] dark:hover:bg-white/[0.04]"
                >
                  <ArrowLeftIcon size={14} />
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
                        <LoaderCircleIcon size={14} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <SendIcon size={14} />
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
                        <LoaderCircleIcon size={14} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <SearchIcon size={14} />
                        Create & find Allocats

                        <ArrowRightIcon
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
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

/* =========================================================
   STEP HEADING
========================================================= */

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
        <span className="h-1.5 w-1.5 rounded-full bg-[#0D566D] dark:bg-[#DEDA00]" />

        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#0D566D] dark:text-[#DEDA00]">
          {eyebrow}
        </p>
      </div>

      <h3 className="text-xl font-semibold leading-tight tracking-[-0.025em] sm:text-2xl">
        {title}
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#718084] dark:text-[#94A3B8]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SKILLS PICKER
========================================================= */

type SkillsPickerProps = {
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

  const selectedSkills = useMemo(
    () =>
      value
        .map(id => skills.find(skill => skill.id === id))
        .filter((skill): skill is SkillOption => Boolean(skill)),
    [skills, value],
  );

  const availableSkills = useMemo(() => {
    if (!category) return [];

    const search = query.trim().toLowerCase();

    return skills
      .filter(skill => skill.category === category)
      .filter(skill => !value.includes(skill.id))
      .filter(
        skill =>
          !search ||
          skill.name
            .toLowerCase()
            .includes(search),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [category, query, skills, value]);

  const categorySkillCount = skills.filter(
    skill => skill.category === category,
  ).length;

  function addSkill(skillId: string) {
    if (value.includes(skillId)) return;

    onChange([...value, skillId]);
    setQuery("");
  }

  function removeSkill(skillId: string) {
    onChange(
      value.filter(id => id !== skillId),
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border transition-colors",
        "bg-[#F1F6F4]",
        "focus-within:border-[#0D566D]/30",
        "focus-within:bg-[#F1F6F4]",
        "focus-within:ring-1 focus-within:ring-[#0D566D]/20",

        "dark:bg-[#10262D]",
        "dark:focus-within:border-[#DEDA00]/30",
        "dark:focus-within:bg-[#10262D]",
        "dark:focus-within:ring-[#DEDA00]/15",

        invalid
          ? "border-destructive"
          : "border-[#0D566D]/[0.09] dark:border-white/[0.075]",

        disabled && "opacity-60",
      )}
    >
      {/* SEARCH */}

      <div className="relative flex min-h-12 items-center gap-2 px-3">
        <SearchIcon
          size={14}
          className="shrink-0 text-[#718084] dark:text-[#94A3B8]"
        />

        <input
          value={query}
          disabled={disabled || loading}
          onChange={event => setQuery(event.target.value)}
          placeholder={
            !category
              ? "Choose a category first"
              : loading
                ? "Loading skills..."
                : "Search available skills"
          }
          className={[
            "h-11 min-w-0 flex-1 bg-transparent text-sm outline-none",
            "text-[#33484D] caret-[#0D566D]",
            "placeholder:text-[#8A989B]",
            "focus:bg-transparent",
            "dark:text-[#E6EEF0] dark:caret-[#DEDA00]",
            "dark:placeholder:text-[#6F838A]",
            "dark:focus:bg-transparent",
          ].join(" ")}
        />

        {loading && (
          <LoaderCircleIcon
            size={14}
            className="animate-spin text-[#718084] dark:text-[#94A3B8]"
          />
        )}

        {!loading && category && (
          <span className="shrink-0 text-[0.6rem] font-medium text-[#718084] dark:text-[#94A3B8]">
            {value.length}/{Math.min(15, categorySkillCount || 15)}
          </span>
        )}
      </div>

      {/* SELECTED */}

      {selectedSkills.length > 0 && (
        <div className="border-t border-[#0D566D]/[0.07] px-3 py-3 dark:border-white/[0.06]">
          <p className="mb-2 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-[#748286] dark:text-[#94A3B8]">
            Selected
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span
                key={skill.id}
                className={[
                  "group inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5",
                  "border-[#0D566D]/[0.10] bg-[#E3EEEB]",
                  "text-[0.67rem] font-semibold text-[#31545D]",
                  "dark:border-[#DEDA00]/[0.10] dark:bg-[#DEDA00]/[0.055] dark:text-[#DEDA00]",
                ].join(" ")}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#0D566D] dark:bg-[#DEDA00]" />

                {skill.name}

                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-sm text-[#718084] transition-colors hover:bg-[#0D566D]/10 hover:text-[#0D566D] dark:text-[#94A3B8] dark:hover:bg-[#DEDA00]/10 dark:hover:text-[#DEDA00]"
                  aria-label={`Remove ${skill.name}`}
                >
                  <XIcon size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AVAILABLE */}

      {!disabled && !loading && (
        <div className="border-t border-[#0D566D]/[0.07] px-2 py-2 dark:border-white/[0.06]">
          {error ? (
            <div className="px-2 py-3">
              <p className="text-xs text-destructive">
                {error}
              </p>
            </div>
          ) : availableSkills.length > 0 ? (
            <div className="max-h-56 overflow-y-auto">
              {availableSkills.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => addSkill(skill.id)}
                  className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#E7EFEC] dark:hover:bg-white/[0.045]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {skill.name}
                    </p>

                    <p className="mt-0.5 text-[0.57rem] text-[#758386] dark:text-[#94A3B8]">
                      {skill.category}
                    </p>
                  </div>

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#DCE8E4] text-[#0D566D] dark:bg-[#DEDA00]/[0.08] dark:text-[#DEDA00]">
                    <CheckIcon size={11} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-3">
              <p className="text-xs text-[#718084] dark:text-[#94A3B8]">
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

/* =========================================================
   NAME
========================================================= */

function getFirstName(name?: string | null) {
  if (!name?.trim()) return "";

  return name.trim().split(/\s+/)[0] ?? "";
}

export default NewProjectForm;