import React, {
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
  SearchIcon,
  SendIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
  Toaster,
} from "sonner";

import * as z from "zod";

import api from "@/api/axios";

import {
  projectCategories,
} from "@/data/projectCategories";

import type {
  CreateProjectRequest,
} from "@/Types/createProjectRequest";

import type {
  Project,
} from "@/Types/project";

import {
  toLocalDateOnly,
} from "@/utils/date";

import {
  cn,
} from "@/lib/utils";

import {
  Button,
} from "./ui/button";

import {
  Input,
} from "./ui/input";

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

import {
  Calendar28,
} from "./DatePicker";

import MultiFileUpload from "./MultiFileUpload";

/* =========================================================
   SCHEMA
========================================================= */

const formSchema = z
  .object({
    title: z
      .string()
      .min(
        5,
        "Use at least 5 characters.",
      )
      .max(
        64,
        "Keep the title below 64 characters.",
      ),

    category: z
      .string()
      .min(
        1,
        "Choose a category.",
      ),

    tags: z
      .array(
        z.string().min(2),
      )
      .min(
        1,
        "Add at least one relevant skill.",
      ),

    startDate: z
      .date()
      .nullable(),

    endDate: z
      .date()
      .nullable(),

    description: z
      .string()
      .min(
        20,
        "Describe the project in at least 20 characters.",
      )
      .max(
        2000,
        "Keep the description below 2,000 characters.",
      ),

    priority: z.enum([
      "standard",
      "high",
      "urgent",
    ]),

    budget: z
      .string()
      .optional(),
  })
  .refine(
    (values) => {
      if (
        !values.startDate ||
        !values.endDate
      ) {
        return true;
      }

      return (
        values.endDate >=
        values.startDate
      );
    },
    {
      message:
        "The end date must be after the start date.",

      path: [
        "endDate",
      ],
    },
  );

/* =========================================================
   TYPES
========================================================= */

type FormValues =
  z.infer<
    typeof formSchema
  >;

type Step =
  | 1
  | 2
  | 3;

type SubmitIntent =
  | "post"
  | "find";

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

const stepFields: Record<
  Step,
  (
    keyof FormValues
  )[]
> = {
  1: [
    "title",
    "category",
    "tags",
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
  const navigate =
    useNavigate();

  const [
    step,
    setStep,
  ] =
    useState<Step>(1);

  const [
    submitIntent,
    setSubmitIntent,
  ] =
    useState<SubmitIntent>(
      "post",
    );

  const submitIntentRef =
    useRef<SubmitIntent>(
      "post",
    );

  const today =
    new Date();

  const tomorrow =
    new Date(today);

  tomorrow.setDate(
    today.getDate() + 1,
  );

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(
          formSchema,
        ),

      defaultValues: {
        title: "",
        category: "",
        tags: [],
        description: "",
        startDate:
          today,
        endDate:
          tomorrow,
        priority:
          "standard",
        budget: "",
      },
    });

  const {
    isSubmitting,
  } =
    form.formState;

  /* =======================================================
     NAVIGATION
  ======================================================= */

  async function handleNext() {
    const isValid =
      await form.trigger(
        stepFields[
          step
        ],
        {
          shouldFocus:
            true,
        },
      );

    if (!isValid) {
      return;
    }

    if (step < 3) {
      setStep(
        (
          current,
        ) =>
          (current +
            1) as Step,
      );
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(
        (
          current,
        ) =>
          (current -
            1) as Step,
      );
    }
  }

  function setIntent(
    intent: SubmitIntent,
  ) {
    submitIntentRef.current =
      intent;

    setSubmitIntent(
      intent,
    );
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function onSubmit(
    values: FormValues,
  ) {
    const intent =
      submitIntentRef.current;

    const payload: CreateProjectRequest =
      {
        title:
          values.title.trim(),

        description:
          values.description.trim(),

        category:
          values.category,

        tags:
          values.tags,

        startDate:
          toLocalDateOnly(
            values.startDate ??
              new Date(),
          ),

        dueDate:
          toLocalDateOnly(
            values.endDate ??
              new Date(),
          ),

        priority:
          values.priority,

        isPublic:
          false,

        allowBids:
          false,

        budget:
          Number(
            values.budget ||
              0,
          ),

        currency:
          "USD",
      };

    try {
      const response =
        await api.post<Project>(
          "/projects",
          payload,
          {
            withCredentials:
              true,
          },
        );

      toast.success(
        "Project created successfully.",
      );

      if (
        intent ===
        "find"
      ) {
        navigate(
          `/projects/${response.data.id}/allocats/find`,
        );

        return;
      }

      navigate(
        "/projects",
      );
    } catch (
      error
    ) {
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
      <Toaster
        richColors
        position="top-right"
      />

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="mb-9">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center">
            {steps.map(
              (
                item,
                index,
              ) => {
                const isActive =
                  step ===
                  item.number;

                const isComplete =
                  step >
                  item.number;

                return (
                  <React.Fragment
                    key={
                      item.number
                    }
                  >
                    <button
                      type="button"
                      disabled={
                        item.number >
                        step
                      }
                      onClick={() => {
                        if (
                          item.number <
                          step
                        ) {
                          setStep(
                            item.number,
                          );
                        }
                      }}
                      className={cn(
                        "group flex shrink-0 items-center gap-2",

                        item.number <
                          step
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
                              "border-primary",
                              "bg-primary",
                              "text-primary-foreground",
                              "shadow-sm shadow-primary/10",
                            ].join(
                              " ",
                            ),

                          isComplete &&
                            [
                              "border-primary/20",
                              "bg-primary/[0.07]",
                              "text-primary",
                            ].join(
                              " ",
                            ),

                          !isActive &&
                            !isComplete &&
                            [
                              "border-border",
                              "bg-background",
                              "text-muted-foreground",
                            ].join(
                              " ",
                            ),
                        )}
                      >
                        {isComplete ? (
                          <CheckIcon
                            size={
                              13
                            }
                            strokeWidth={
                              2.6
                            }
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
                        {
                          item.label
                        }
                      </span>
                    </button>

                    {index <
                      steps.length -
                        1 && (
                      <div className="mx-3 h-px w-5 overflow-hidden bg-border sm:w-10">
                        <div
                          className={cn(
                            "h-full origin-left bg-primary transition-transform duration-300",

                            step >
                              item.number
                              ? "scale-x-100"
                              : "scale-x-0",
                          )}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              },
            )}
          </div>

          <span className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {step} of{" "}
            {
              steps.length
            }
          </span>
        </div>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        id="new-project"
        onSubmit={
          form.handleSubmit(
            onSubmit,
          )
        }
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

              <Controller
                name="title"
                control={
                  form.control
                }
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
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
                      Make the
                      outcome obvious
                      at a glance.
                    </FieldDescription>

                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  </Field>
                )}
              />

              <Controller
                name="category"
                control={
                  form.control
                }
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
                  >
                    <FieldLabel className="text-sm font-semibold">
                      Category
                    </FieldLabel>

                    <Select
                      value={
                        field.value
                      }
                      onValueChange={
                        field.onChange
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
                        <SelectValue placeholder="Choose the closest category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {projectCategories.map(
                            (
                              category,
                            ) => (
                              <SelectItem
                                key={
                                  category
                                }
                                value={
                                  category
                                }
                              >
                                {
                                  category
                                }
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  </Field>
                )}
              />

              <Controller
                name="tags"
                control={
                  form.control
                }
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
                  >
                    <FieldLabel className="text-sm font-semibold">
                      Skills needed
                    </FieldLabel>

                    <SkillsInput
                      value={
                        field.value
                      }
                      onChange={
                        field.onChange
                      }
                      disabled={
                        !form.watch(
                          "category",
                        )
                      }
                      invalid={
                        fieldState.invalid
                      }
                    />

                    <FieldDescription className="text-[0.68rem]">
                      Add only the
                      skills that
                      actually matter
                      for this job.
                    </FieldDescription>

                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
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

              <div className="grid gap-5 sm:grid-cols-2">
                <Controller
                  name="startDate"
                  control={
                    form.control
                  }
                  render={({
                    field,
                  }) => (
                    <Calendar28
                      id="startDate"
                      label="Start date"
                      value={
                        field.value
                      }
                      onChange={
                        field.onChange
                      }
                      className="h-12 rounded-xl border-border/90 bg-muted/[0.18] shadow-none"
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={
                    form.control
                  }
                  render={({
                    field,
                    fieldState,
                  }) => (
                    <Field
                      data-invalid={
                        fieldState.invalid
                      }
                    >
                      <Calendar28
                        id="endDate"
                        label="Due date"
                        value={
                          field.value
                        }
                        onChange={
                          field.onChange
                        }
                        className="h-12 rounded-xl border-border/90 bg-muted/[0.18] shadow-none"
                      />

                      <FieldError
                        errors={[
                          fieldState.error,
                        ]}
                      />
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="priority"
                control={
                  form.control
                }
                render={({
                  field,
                }) => (
                  <Field>
                    <FieldLabel className="text-sm font-semibold">
                      Priority
                    </FieldLabel>

                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        {
                          value:
                            "standard",
                          label:
                            "Standard",
                          description:
                            "Normal pace",
                        },
                        {
                          value:
                            "high",
                          label:
                            "High",
                          description:
                            "Needs attention",
                        },
                        {
                          value:
                            "urgent",
                          label:
                            "Urgent",
                          description:
                            "Time-sensitive",
                        },
                      ].map(
                        (
                          option,
                        ) => {
                          const isSelected =
                            field.value ===
                            option.value;

                          return (
                            <label
                              key={
                                option.value
                              }
                              className={cn(
                                "group relative cursor-pointer rounded-xl",

                                "border px-4 py-3.5",

                                "transition-all duration-200",

                                isSelected
                                  ? [
                                      "border-primary/30",
                                      "bg-primary/[0.055]",
                                      "shadow-sm shadow-primary/[0.04]",
                                    ].join(
                                      " ",
                                    )
                                  : [
                                      "border-border/90",
                                      "bg-muted/[0.15]",
                                      "hover:bg-muted/30",
                                      "hover:border-foreground/10",
                                    ].join(
                                      " ",
                                    ),
                              )}
                            >
                              <input
                                type="radio"
                                value={
                                  option.value
                                }
                                checked={
                                  isSelected
                                }
                                onChange={() =>
                                  field.onChange(
                                    option.value,
                                  )
                                }
                                className="sr-only"
                              />

                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-bold">
                                    {
                                      option.label
                                    }
                                  </p>

                                  <p className="mt-1 text-[0.65rem] text-muted-foreground">
                                    {
                                      option.description
                                    }
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
                                      size={
                                        9
                                      }
                                      strokeWidth={
                                        3
                                      }
                                    />
                                  )}
                                </span>
                              </div>
                            </label>
                          );
                        },
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="budget"
                control={
                  form.control
                }
                render={({
                  field,
                }) => (
                  <Field>
                    <FieldLabel className="text-sm font-semibold">
                      Estimated
                      budget
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
                          size={
                            15
                          }
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
                        onChange={(
                          event,
                        ) => {
                          const value =
                            event.target.value;

                          if (
                            value ===
                              "" ||
                            /^\d*\.?\d{0,2}$/.test(
                              value,
                            )
                          ) {
                            field.onChange(
                              value,
                            );
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
                      Optional.
                      Leave blank if
                      you want to
                      agree on price
                      later.
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

              <Controller
                name="description"
                control={
                  form.control
                }
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
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
                        rows={
                          8
                        }
                        placeholder="What needs to be delivered? What matters most? Are there any requirements, references or constraints?"
                        className="min-h-[190px] resize-none bg-transparent px-4 py-4 text-sm leading-7"
                      />

                      <InputGroupAddon
                        align="block-end"
                        className="border-t border-border/70 bg-muted/[0.08] px-4 py-2.5"
                      >
                        <InputGroupText className="ml-auto text-[0.64rem] text-muted-foreground">
                          {
                            field
                              .value
                              .length
                          }
                          /2000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  </Field>
                )}
              />

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <FieldLabel className="text-sm font-semibold">
                      Supporting
                      files
                    </FieldLabel>

                    <p className="mt-1 text-[0.68rem] text-muted-foreground">
                      References help,
                      but they are not
                      required.
                    </p>
                  </div>

                  <span className="rounded-md bg-muted px-2 py-1 text-[0.62rem] font-semibold text-muted-foreground">
                    Optional
                  </span>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-dashed border-border/90 bg-muted/[0.1] p-3 transition-colors hover:bg-muted/[0.18]">
                  <MultiFileUpload
                    autoUpload={
                      false
                    }
                  />
                </div>
              </Field>
            </>
          )}
        </FieldGroup>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="mt-10 border-t border-border/80 pt-6">
          {step < 3 ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={
                      handleBack
                    }
                    className="h-10 rounded-lg px-3 text-xs text-muted-foreground shadow-none"
                  >
                    <ArrowLeftIcon
                      size={
                        14
                      }
                    />

                    Previous
                  </Button>
                )}
              </div>

              <Button
                type="button"
                onClick={
                  handleNext
                }
                className="group h-10 rounded-lg px-5 text-xs shadow-none"
              >
                Continue

                <ArrowRightIcon
                  size={
                    14
                  }
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                  <SparklesIcon
                    size={
                      14
                    }
                  />
                </span>

                <div>
                  <p className="text-sm font-bold">
                    Ready to
                    create it.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Save the
                    project now,
                    or immediately
                    continue to
                    matching
                    Allocats.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={
                    handleBack
                  }
                  disabled={
                    isSubmitting
                  }
                  className="h-10 rounded-lg px-3 text-xs text-muted-foreground shadow-none"
                >
                  <ArrowLeftIcon
                    size={
                      14
                    }
                  />

                  Previous
                </Button>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={
                      isSubmitting
                    }
                    onClick={() =>
                      setIntent(
                        "post",
                      )
                    }
                    className="h-11 rounded-lg px-5 text-xs shadow-none"
                  >
                    {isSubmitting &&
                    submitIntent ===
                      "post" ? (
                      <>
                        <LoaderCircleIcon
                          size={
                            14
                          }
                          className="animate-spin"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <SendIcon
                          size={
                            14
                          }
                        />

                        Create project
                      </>
                    )}
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                    onClick={() =>
                      setIntent(
                        "find",
                      )
                    }
                    className="group h-11 rounded-lg px-5 text-xs shadow-none"
                  >
                    {isSubmitting &&
                    submitIntent ===
                      "find" ? (
                      <>
                        <LoaderCircleIcon
                          size={
                            14
                          }
                          className="animate-spin"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <SearchIcon
                          size={
                            14
                          }
                        />

                        Create & find Allocats

                        <ArrowRightIcon
                          size={
                            13
                          }
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
   SKILLS INPUT
========================================================= */

type SkillsInputProps = {
  value: string[];

  onChange: (
    value: string[],
  ) => void;

  disabled?: boolean;
  invalid?: boolean;
};

function SkillsInput({
  value,
  onChange,
  disabled,
  invalid,
}: SkillsInputProps) {
  const [
    input,
    setInput,
  ] =
    useState("");

  function addSkill(
    skill: string,
  ) {
    const cleanSkill =
      skill
        .trim()
        .toLowerCase();

    if (
      !cleanSkill ||
      value.includes(
        cleanSkill,
      )
    ) {
      return;
    }

    onChange([
      ...value,
      cleanSkill,
    ]);

    setInput("");
  }

  function handleAdd() {
    addSkill(
      input,
    );
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key ===
        "Enter" ||
      event.key ===
        ","
    ) {
      event.preventDefault();

      handleAdd();
    }

    if (
      event.key ===
        "Backspace" &&
      !input &&
      value.length >
        0
    ) {
      onChange(
        value.slice(
          0,
          -1,
        ),
      );
    }
  }

  function removeSkill(
    skill: string,
  ) {
    onChange(
      value.filter(
        (
          item,
        ) =>
          item !==
          skill,
      ),
    );
  }

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
          "pointer-events-none opacity-50",
      )}
    >
      {/* INPUT ROW */}

      <div className="flex min-h-12 items-center gap-2 px-3">
        <input
          value={
            input
          }
          onChange={(
            event,
          ) =>
            setInput(
              event.target
                .value,
            )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder={
            disabled
              ? "Choose a category first"
              : "e.g. React, branding, plumbing"
          }
          disabled={
            disabled
          }
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent",

            "text-sm outline-none",

            "placeholder:text-muted-foreground/55",
          )}
        />

        <button
          type="button"
          onClick={
            handleAdd
          }
          disabled={
            disabled ||
            !input.trim()
          }
          className={cn(
            "flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3",

            "text-[0.68rem] font-semibold",

            "transition-colors",

            input.trim()
              ? [
                  "bg-primary/[0.09]",
                  "text-primary",
                  "hover:bg-primary/[0.14]",
                ].join(
                  " ",
                )
              : [
                  "bg-muted",
                  "text-muted-foreground/50",
                ].join(
                  " ",
                ),
          )}
        >
          <PlusIcon
            size={
              12
            }
          />

          Add
        </button>
      </div>

      {/* SELECTED SKILLS */}

      {value.length >
        0 && (
        <div className="border-t border-border/70 px-3 py-3">
          <div className="flex flex-wrap gap-2">
            {value.map(
              (
                skill,
              ) => (
                <span
                  key={
                    skill
                  }
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-lg",

                    "border border-primary/10 bg-primary/[0.055]",

                    "px-2.5 py-1.5",

                    "text-[0.68rem] font-semibold text-foreground",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />

                  {
                    skill
                  }

                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(
                        skill,
                      )
                    }
                    className={cn(
                      "ml-0.5 flex h-4 w-4 items-center justify-center rounded-sm",

                      "text-muted-foreground",

                      "transition-colors",

                      "hover:bg-primary/10 hover:text-primary",
                    )}
                    aria-label={`Remove ${skill}`}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default NewProjectForm;