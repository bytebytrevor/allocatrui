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

import { toLocalDateOnly } from "@/utils/date";
import { cn } from "@/lib/utils";

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

import { Calendar28 } from "./DatePicker";
import MultiFileUpload from "./MultiFileUpload";

/* =========================================================
   TYPES
========================================================= */

type SkillCategoryOption = {
  id: string;
  name: string;
};

type FormValues = z.infer<typeof formSchema>;

type Step = 1 | 2 | 3;

type SubmitIntent =
  | "post"
  | "find";

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
      if (!values.startDate || !values.endDate) {
        return true;
      }

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
  {
    number: 1,
    label: "Basics",
  },
  {
    number: 2,
    label: "Planning",
  },
  {
    number: 3,
    label: "Brief",
  },
] as const;

const stepFields: Record<Step, (keyof FormValues)[]> = {
  1: [
    "title",
    "category",
    "skillIds",
  ],

  2: [
    "startDate",
    "endDate",
    "priority",
    "budget",
  ],

  3: [
    "description",
  ],
};

/* =========================================================
   FORM
========================================================= */

function NewProjectForm() {
  const navigate = useNavigate();

  const [step, setStep] =
    useState<Step>(1);

  const [submitIntent, setSubmitIntent] =
    useState<SubmitIntent>("post");

  const submitIntentRef =
    useRef<SubmitIntent>("post");

  /* =======================================================
     DATABASE CATEGORIES
  ======================================================= */

  const [categories, setCategories] =
    useState<SkillCategoryOption[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState<string | null>(null);

  /* =======================================================
     DATABASE SKILLS
  ======================================================= */

  const [skills, setSkills] =
    useState<SkillOption[]>([]);

  const [loadingSkills, setLoadingSkills] =
    useState(true);

  const [skillsError, setSkillsError] =
    useState<string | null>(null);

  /* =======================================================
     DATES
  ======================================================= */

  const today = useMemo(
    () => new Date(),
    [],
  );

  const tomorrow = useMemo(() => {
    const date = new Date(today);

    date.setDate(
      today.getDate() + 1,
    );

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

  const { isSubmitting } =
    form.formState;

  const selectedCategory =
    form.watch("category");

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);

      const response = await api.get<SkillCategoryOption[]>(
        "/skill-categories",
        {
          withCredentials: true,
        },
      );

      setCategories(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      console.error(
        "Could not load skill categories:",
        error,
      );

      setCategories([]);

      setCategoriesError(
        "The category catalogue could not be loaded.",
      );
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
        {
          withCredentials: true,
        },
      );

      setSkills(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      console.error(
        "Could not load skills:",
        error,
      );

      setSkills([]);

      setSkillsError(
        "The skills catalogue could not be loaded.",
      );
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  /* =======================================================
     LOAD DATABASE CATALOGUE
  ======================================================= */

  useEffect(() => {
    void Promise.all([
      loadCategories(),
      loadSkills(),
    ]);
  }, [
    loadCategories,
    loadSkills,
  ]);

  /* =======================================================
     STEP NAVIGATION
  ======================================================= */

  async function handleNext() {
    const isValid = await form.trigger(
      stepFields[step],
      {
        shouldFocus: true,
      },
    );

    if (!isValid) {
      return;
    }

    if (step < 3) {
      setStep(
        current => (current + 1) as Step,
      );
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(
        current => (current - 1) as Step,
      );
    }
  }

  /* =======================================================
     SUBMIT INTENT
  ======================================================= */

  function setIntent(intent: SubmitIntent) {
    submitIntentRef.current = intent;
    setSubmitIntent(intent);
  }

  /* =======================================================
     CATEGORY CHANGE
  ======================================================= */

  function handleCategoryChange(
    category: string,
    onChange: (value: string) => void,
  ) {
    const currentCategory =
      form.getValues("category");

    if (
      currentCategory &&
      currentCategory !== category
    ) {
      form.setValue(
        "skillIds",
        [],
        {
          shouldValidate: true,
        },
      );
    }

    onChange(category);
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function onSubmit(values: FormValues) {
    const intent =
      submitIntentRef.current;

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

      budget: Number(
        values.budget || 0,
      ),

      currency: "USD",
    };

    try {
      const response = await api.post<Project>(
        "/projects",
        payload,
        {
          withCredentials: true,
        },
      );

      toast.success(
        "Project created successfully.",
      );

      if (intent === "find") {
        navigate(
          `/projects/${response.data.id}/allocats/find`,
        );

        return;
      }

      navigate("/projects");
    } catch (error) {
      console.error(
        "Could not create project:",
        error,
      );

      toast.error(
        "We could not create the project. Please try again.",
      );
    }
  }

  return (
    <>
      {/* =================================================
          STEP INDICATOR
      ================================================= */}

      <div className="mb-9">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center">
            {steps.map((item, index) => {
              const isActive =
                step === item.number;

              const isComplete =
                step > item.number;

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
                        "relative flex h-8 w-8 items-center justify-center",
                        "rounded-lg border text-[0.66rem] font-bold",
                        "transition-all duration-200",

                        isActive &&
                          [
                            "border-dark-gray",
                            "bg-dark-gray",
                            "text-brand-primary",
                            "shadow-sm shadow-black/10",
                          ].join(" "),

                        isComplete &&
                          [
                            "border-dark-gray",
                            "bg-dark-gray",
                            "text-brand-primary",
                            "shadow-sm shadow-black/[0.05]",
                          ].join(" "),

                        !isActive &&
                          !isComplete &&
                          [
                            "border-border",
                            "bg-background",
                            "text-muted-foreground",
                          ].join(" "),
                      )}
                    >
                      {isComplete ? (
                        <CheckIcon
                          size={13}
                          strokeWidth={2.6}
                        />
                      ) : (
                        item.number
                      )}
                    </span>

                    <span
                      className={cn(
                        "hidden text-xs font-semibold sm:block",

                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>

                  {index < steps.length - 1 && (
                    <div className="mx-3 h-px w-5 overflow-hidden bg-border sm:w-10">
                      <div
                        className={cn(
                          "h-full origin-left bg-primary transition-transform duration-300",

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

          <span className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
        className="min-w-0"
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
                description="Keep it simple. A clear title, category and the skills required are enough to get started."
              />

              {/* TITLE */}

              <Controller
                name="title"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="text-sm font-semibold">
                      Project title
                    </FieldLabel>

                    <Input
                      {...field}
                      placeholder="Redesign company website"
                      className={cn(
                        "h-12 rounded-xl border-border/90",
                        "bg-muted/[0.18] px-4 shadow-none",
                        "transition-colors",
                        "hover:bg-muted/[0.28]",
                        "focus-visible:bg-background",
                        "focus-visible:ring-1 focus-visible:ring-primary/40",

                        fieldState.invalid &&
                          "border-destructive",
                      )}
                    />

                    <FieldDescription className="text-[0.68rem]">
                      Make the outcome obvious at a glance.
                    </FieldDescription>

                    <FieldError
                      errors={[fieldState.error]}
                    />
                  </Field>
                )}
              />

              {/* CATEGORY */}

              <Controller
                name="category"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
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
                          "h-12 w-full rounded-xl border-border/90",
                          "bg-muted/[0.18] px-4 shadow-none",
                          "transition-colors hover:bg-muted/[0.28]",

                          fieldState.invalid &&
                            "border-destructive",
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
                        className={cn(
                          "border-border",
                          "bg-popover",
                          "text-popover-foreground",
                        )}
                      >
                        <SelectGroup>
                          {categories.map(category => (
                            <SelectItem
                              key={category.id}
                              value={category.name}
                              className={cn(
                                "cursor-pointer",
                                "text-popover-foreground",

                                "focus:bg-muted",
                                "focus:text-foreground",

                                "data-[highlighted]:bg-muted",
                                "data-[highlighted]:text-foreground",

                                "data-[state=checked]:bg-muted",
                                "data-[state=checked]:text-foreground",
                              )}
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

                    <FieldError
                      errors={[fieldState.error]}
                    />
                  </Field>
                )}
              />

              {/* SKILLS */}

              <Controller
                name="skillIds"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
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

                    <FieldDescription className="text-[0.68rem]">
                      Choose the skills that actually matter for this job.
                    </FieldDescription>

                    <FieldError
                      errors={[fieldState.error]}
                    />
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
                eyebrow="Set the pace"
                title="When should the work happen?"
                description="Add a sensible timeline, priority and budget. These can still be adjusted later."
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
                      className="h-12 rounded-xl border-border/90 bg-muted/[0.18] shadow-none"
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={form.control}
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                    >
                      <Calendar28
                        id="endDate"
                        label="Due date"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-12 rounded-xl border-border/90 bg-muted/[0.18] shadow-none"
                      />

                      <FieldError
                        errors={[fieldState.error]}
                      />
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

                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        {
                          value: "standard",
                          label: "Standard",
                          description: "Normal pace",
                        },
                        {
                          value: "high",
                          label: "High",
                          description: "Needs attention",
                        },
                        {
                          value: "urgent",
                          label: "Urgent",
                          description: "Time-sensitive",
                        },
                      ].map(option => {
                        const isSelected =
                          field.value === option.value;

                        return (
                          <label
                            key={option.value}
                            className={cn(
                              "group relative cursor-pointer rounded-xl",
                              "border px-4 py-3.5",
                              "transition-all duration-200",

                              isSelected
                                ? [
                                    "border-primary/30",
                                    "bg-primary/[0.055]",
                                    "shadow-sm shadow-primary/[0.04]",
                                  ].join(" ")
                                : [
                                    "border-border/90",
                                    "bg-muted/[0.15]",
                                    "hover:bg-muted/30",
                                    "hover:border-foreground/10",
                                  ].join(" "),
                            )}
                          >
                            <input
                              type="radio"
                              value={option.value}
                              checked={isSelected}
                              onChange={() =>
                                field.onChange(option.value)
                              }
                              className="sr-only"
                            />

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-bold">
                                  {option.label}
                                </p>

                                <p className="mt-1 text-[0.65rem] text-muted-foreground">
                                  {option.description}
                                </p>
                              </div>

                              <span
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-full border",
                                  "transition-colors",

                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background",
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon
                                    size={9}
                                    strokeWidth={3}
                                  />
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
                      className={cn(
                        "group flex h-12 items-center overflow-hidden rounded-xl",
                        "border border-border/90 bg-muted/[0.18]",
                        "transition-colors",
                        "hover:bg-muted/[0.28]",
                        "focus-within:border-primary/35",
                        "focus-within:bg-background",
                        "focus-within:ring-1 focus-within:ring-primary/30",
                      )}
                    >
                      <div className="flex h-full items-center gap-2 border-r border-border/80 px-4 text-muted-foreground">
                        <CircleDollarSignIcon
                          size={15}
                        />

                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em]">
                          USD
                        </span>
                      </div>

                      <input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        onChange={event => {
                          const value =
                            event.target.value;

                          if (
                            value === "" ||
                            /^\d*\.?\d{0,2}$/.test(value)
                          ) {
                            field.onChange(value);
                          }
                        }}
                        className={cn(
                          "h-full min-w-0 flex-1 bg-transparent px-4",
                          "text-sm font-semibold outline-none",
                          "placeholder:font-normal placeholder:text-muted-foreground/55",
                        )}
                      />
                    </div>

                    <FieldDescription className="text-[0.68rem]">
                      Optional. Leave blank if you want to agree on price later.
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
                eyebrow="One last thing"
                title="Tell them what success looks like."
                description="Give the Allocat enough context to understand the job without writing a novel."
              />

              {/* BRIEF */}

              <Controller
                name="description"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="text-sm font-semibold">
                      Project brief
                    </FieldLabel>

                    <InputGroup
                      className={cn(
                        "overflow-hidden rounded-xl",
                        "border-border/90 bg-muted/[0.15] shadow-none",
                        "transition-colors focus-within:bg-background",

                        fieldState.invalid &&
                          "border-destructive",
                      )}
                    >
                      <InputGroupTextarea
                        {...field}
                        rows={8}
                        placeholder="What needs to be delivered? What matters most? Are there any requirements, references or constraints?"
                        className="min-h-[190px] resize-none bg-transparent px-4 py-4 text-sm leading-7"
                      />

                      <InputGroupAddon
                        align="block-end"
                        className="border-t border-border/70 bg-muted/[0.08] px-4 py-2.5"
                      >
                        <InputGroupText className="ml-auto text-[0.64rem] text-muted-foreground">
                          {field.value.length}/2000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldError
                      errors={[fieldState.error]}
                    />
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

                    <p className="mt-1 text-[0.68rem] text-muted-foreground">
                      References help, but they are not required.
                    </p>
                  </div>

                  <span className="rounded-md bg-muted px-2 py-1 text-[0.62rem] font-semibold text-muted-foreground">
                    Optional
                  </span>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-dashed border-border/90 bg-muted/[0.1] p-3 transition-colors hover:bg-muted/[0.18]">
                  <MultiFileUpload
                    autoUpload={false}
                  />
                </div>
              </Field>
            </>
          )}
        </FieldGroup>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-10 border-t border-border/80 pt-6">
          {step < 3 ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="h-10 rounded-lg px-3 text-xs text-muted-foreground shadow-none"
                  >
                    <ArrowLeftIcon
                      size={14}
                    />

                    Previous
                  </Button>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNext}
                className="group h-10 rounded-lg px-5 text-xs shadow-none"
              >
                Continue

                <ArrowRightIcon
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                  <SparklesIcon
                    size={14}
                  />
                </span>

                <div>
                  <p className="text-sm font-bold">
                    Ready to create it.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Save the project now, or immediately continue to matching
                    Allocats.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="h-10 rounded-lg px-3 text-xs text-muted-foreground shadow-none"
                >
                  <ArrowLeftIcon
                    size={14}
                  />

                  Previous
                </Button>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() =>
                      setIntent("post")
                    }
                    className="h-11 rounded-lg px-5 text-xs shadow-none"
                  >
                    {isSubmitting &&
                    submitIntent === "post" ? (
                      <>
                        <LoaderCircleIcon
                          size={14}
                          className="animate-spin"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <SendIcon
                          size={14}
                        />

                        Create project
                      </>
                    )}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() =>
                      setIntent("find")
                    }
                    className="group h-11 rounded-lg px-5 text-xs shadow-none"
                  >
                    {isSubmitting &&
                    submitIntent === "find" ? (
                      <>
                        <LoaderCircleIcon
                          size={14}
                          className="animate-spin"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <SearchIcon
                          size={14}
                        />

                        Create & find Allocats

                        <ArrowRightIcon
                          size={13}
                          className="transition-transform group-hover:translate-x-1"
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
    </>
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
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />

        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
      </div>

      <h3 className="text-xl font-black leading-tight tracking-[-0.025em] sm:text-2xl">
        {title}
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
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

  onChange: (
    value: string[],
  ) => void;

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
  const [query, setQuery] =
    useState("");

  /* =======================================================
     SELECTED SKILLS
  ======================================================= */

  const selectedSkills = useMemo(
    () =>
      value
        .map(id =>
          skills.find(
            skill =>
              skill.id === id,
          ),
        )
        .filter(
          (skill): skill is SkillOption =>
            Boolean(skill),
        ),
    [
      skills,
      value,
    ],
  );

  /* =======================================================
     FILTER DATABASE SKILLS BY CATEGORY
  ======================================================= */

  const availableSkills = useMemo(() => {
    if (!category) {
      return [];
    }

    const search =
      query
        .trim()
        .toLowerCase();

    return skills
      .filter(
        skill =>
          skill.category === category,
      )
      .filter(
        skill =>
          !value.includes(skill.id),
      )
      .filter(
        skill =>
          !search ||
          skill.name
            .toLowerCase()
            .includes(search),
      )
      .sort(
        (a, b) =>
          a.name.localeCompare(b.name),
      );
  }, [
    category,
    query,
    skills,
    value,
  ]);

  const categorySkillCount =
    skills.filter(
      skill =>
        skill.category === category,
    ).length;

  /* =======================================================
     ACTIONS
  ======================================================= */

  function addSkill(skillId: string) {
    if (value.includes(skillId)) {
      return;
    }

    onChange([
      ...value,
      skillId,
    ]);

    setQuery("");
  }

  function removeSkill(skillId: string) {
    onChange(
      value.filter(
        id =>
          id !== skillId,
      ),
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border",
        "bg-muted/[0.14] transition-all",
        "focus-within:bg-background",
        "focus-within:ring-1 focus-within:ring-primary/35",

        invalid
          ? "border-destructive"
          : "border-border/90",

        disabled &&
          "opacity-60",
      )}
    >
      {/* SEARCH */}

      <div className="relative flex min-h-12 items-center gap-2 px-3">
        <SearchIcon
          size={14}
          className="shrink-0 text-muted-foreground"
        />

        <input
          value={query}
          disabled={
            disabled ||
            loading
          }
          onChange={event =>
            setQuery(
              event.target.value,
            )
          }
          placeholder={
            !category
              ? "Choose a category first"
              : loading
                ? "Loading skills..."
                : "Search available skills"
          }
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent",
            "text-sm outline-none",
            "placeholder:text-muted-foreground/55",
          )}
        />

        {loading && (
          <LoaderCircleIcon
            size={14}
            className="animate-spin text-muted-foreground"
          />
        )}

        {!loading && category && (
          <span className="shrink-0 text-[0.62rem] font-medium text-muted-foreground">
            {categorySkillCount} available
          </span>
        )}
      </div>

      {/* SELECTED */}

      {selectedSkills.length > 0 && (
        <div className="border-t border-border/70 px-3 py-3">
          <p className="mb-2 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Selected
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span
                key={skill.id}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg",
                  "border border-primary/10 bg-primary/[0.055]",
                  "px-2.5 py-1.5",
                  "text-[0.68rem] font-semibold text-foreground",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />

                {skill.name}

                <button
                  type="button"
                  onClick={() =>
                    removeSkill(skill.id)
                  }
                  className={cn(
                    "ml-0.5 flex h-4 w-4 items-center justify-center rounded-sm",
                    "text-muted-foreground",
                    "transition-colors",
                    "hover:bg-primary/10 hover:text-primary",
                  )}
                  aria-label={`Remove ${skill.name}`}
                >
                  <XIcon
                    size={10}
                  />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AVAILABLE */}

      {!disabled && !loading && (
        <div className="border-t border-border/70 px-2 py-2">
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
                  onClick={() =>
                    addSkill(skill.id)
                  }
                  className={cn(
                    "flex w-full items-center justify-between gap-4",
                    "rounded-lg px-3 py-2.5 text-left",
                    "transition-colors hover:bg-muted/60",
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">
                      {skill.name}
                    </p>

                    <p className="mt-0.5 text-[0.58rem] text-muted-foreground">
                      {skill.category}
                    </p>
                  </div>

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/[0.07] text-primary">
                    <CheckIcon
                      size={11}
                    />
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

export default NewProjectForm;