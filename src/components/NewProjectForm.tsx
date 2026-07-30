// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast, Toaster } from "sonner";
// import { Input } from "./ui/input";
// import { projectCategories } from "@/data/projectCategories";
// import { toLocalDateOnly } from "@/utils/date";
// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   InputGroupTextarea,
// } from "@/components/ui/input-group";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";
// import { Button } from "./ui/button";
// import { Calendar28 } from "./DatePicker";
// import MultiFileUpload from "./MultiFileUpload";
// import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import type { CreateProjectRequest } from "@/Types/createProjectRequest";
// import type { Project } from "@/Types/project";
// import api from "@/api/axios";

// const formSchema = z.object({
//   title: z.string().min(5).max(64),
//   category: z.string().nonempty(),
//   tags: z.array(z.string().min(2)).min(1),
//   startDate: z.date().nullable(),
//   endDate: z.date().nullable(),
//   description: z.string().min(20).max(2000),
//   priority: z.enum(["standard", "high", "urgent"]),
//   budget: z.string().optional(),
// });

// function NewProjectForm() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<1 | 2 | 3>(1);
//   const [submitIntent, setSubmitIntent] = useState<"post" | "find">("post");

//   const today = new Date();
//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       startDate: today,
//       endDate: tomorrow,
//       priority: "standard",
//       tags: [],
//     },
//   });

//   const { isSubmitting } = form.formState;

//   async function OnSubmit(values: z.infer<typeof formSchema>) {
//     const payload: CreateProjectRequest = {
//       title: values.title,
//       description: values.description,
//       category: values.category,
//       tags: values.tags,
//       startDate: toLocalDateOnly(values.startDate ?? new Date()),
//       dueDate: toLocalDateOnly(values.endDate ?? new Date()),
//       priority: values.priority,
//       isPublic: false,
//       allowBids: false,
//       budget: Number(values.budget ?? 0),
//       currency: "USD",
//     };

//     try {
//       const response = await api.post<Project>(
//         "projects",
//         payload,
//         { withCredentials: true }
//       );

//       toast.success("Project has been created");

//       if (submitIntent === "find") {
//         navigate(`/projects/${response.data.id}/allocats/find`);
//       } else {
//         navigate("/projects");
//       }
//     } catch {
//       toast.error("Failed to create project");
//     }
//   }

//   return (
//     <>
//       <Toaster />

//       <form
//         id="new-project"
//         onSubmit={form.handleSubmit(OnSubmit)}
//       >
//         <FieldGroup>

//           {/* ================= STEP 1 ================= */}
//           {step === 1 && (
//             <>
//               {/* TITLE */}
//               <Controller
//                 name="title"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel className="text-muted-foreground font-semibold">
//                       Title*
//                     </FieldLabel>
//                     <Input {...field}
//                       className="h-12 border-none bg-input shadow-none"
//                       placeholder="Project title"
//                     />
//                     <FieldError errors={[fieldState.error]} />
//                   </Field>
//                 )}
//               />

//               {/* CATEGORY */}
//               <Controller
//                 name="category"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel className="text-muted-foreground font-semibold">
//                       Category*
//                     </FieldLabel>
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger
//                         className={cn(
//                           "w-full bg-input border-none rounded-full py-6 shadow-none",
//                           fieldState.invalid && "ring-1 ring-destructive"
//                         )}
//                       >
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           {projectCategories.map(c => (
//                             <SelectItem key={c} value={c}>
//                               {c}
//                             </SelectItem>
//                           ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                     <FieldError errors={[fieldState.error]} />
//                   </Field>
//                 )}
//               />

//               {/* TAGS */}
//               <Controller
//                 name="tags"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel className="text-muted-foreground font-semibold">
//                       Tags*
//                     </FieldLabel>
//                     <TagsInput
//                       value={field.value}
//                       onChange={field.onChange}
//                       disabled={!form.watch("category")}
//                     />
//                     <FieldDescription>
//                       Add tags to improve search
//                     </FieldDescription>
//                     <FieldError errors={[fieldState.error]} />
//                   </Field>
//                 )}
//               />
//             </>
//           )}

//           {/* ================= STEP 2 ================= */}
//           {step === 2 && (
//             <>
//               <span className="flex gap-4 w-full">
//                 <Controller
//                   name="startDate"
//                   control={form.control}
//                   render={({ field }) => (
//                     <Calendar28
//                     id="startDate"
//                       label="Start date"
//                       value={field.value}
//                       onChange={field.onChange}
//                       className="h-12 shadow-none"
//                     />
//                   )}
//                 />
//                 <Controller
//                   name="endDate"
//                   control={form.control}
//                   render={({ field }) => (
//                     <Calendar28
//                       id="endDate"
//                       label="End date"
//                       value={field.value}
//                       onChange={field.onChange}
//                       className="h-12 shadow-none"
//                     />
//                   )}
//                 />
//               </span>

//               <Controller
//                 name="priority"
//                 control={form.control}
//                 render={({ field }) => (
//                   <Field>
//                     <FieldLabel className="text-muted-foreground font-semibold">
//                       Priority*
//                     </FieldLabel>
//                     <div className="flex gap-4">
//                       {["standard", "high", "urgent"].map(p => (
//                         <label key={p} className="flex items-center gap-2">
//                           <input
//                             type="radio"
//                             checked={field.value === p}
//                             onChange={() => field.onChange(p)}
//                           />
//                           {p}
//                         </label>
//                       ))}
//                     </div>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 name="budget"
//                 control={form.control}
//                 render={({ field }) => (
//                   <Field>
//                     <FieldLabel className="text-muted-foreground font-semibold">
//                       Budget
//                     </FieldLabel>
//                     <Input
//                       type="number"
//                       {...field}
//                       className="h-12 border-none bg-input shadow-none"
//                     />
//                   </Field>
//                 )}
//               />
//             </>
//           )}

//           {/* ================= STEP 3 ================= */}
//           {step === 3 && (
//             <>
//               <Field>
//                 <MultiFileUpload autoUpload={false} />
//               </Field>

//               <Controller
//                 name="description"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel className="text-muted-foreground font-semibold">
//                       Description*
//                     </FieldLabel>
//                     <InputGroup>
//                       <InputGroupTextarea {...field} rows={6} />
//                       <InputGroupAddon align="block-end">
//                         <InputGroupText>
//                           {field.value.length}/2000
//                         </InputGroupText>
//                       </InputGroupAddon>
//                     </InputGroup>
//                     <FieldError errors={[fieldState.error]} />
//                   </Field>
//                 )}
//               />
//             </>
//           )}
//         </FieldGroup>

//         {/* ================= NAV ================= */}
//         <div className="flex justify-between mt-8">
//           {step > 1 ? (
//             <Button type="button" variant="link" onClick={() => setStep(step - 1)}>
//               Back
//             </Button>
//           ) : (
//             <span />
//           )}

//           {step < 3 ? (
//             <Button
//               type="button"
//               onClick={() => setStep(step + 1)}
//               className="h-12 px-12"
//             >
//               Next
//             </Button>
//           ) : (
//             <div className="flex gap-4">
//               <Button
//                 type="submit"
//                 variant="outline"
//                 disabled={isSubmitting}
//                 onClick={() => setSubmitIntent("find")}
//                 className="h-12 shadow-none"
//               >
//                 Find allocats
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 onClick={() => setSubmitIntent("post")}
//                 className="h-12"
//               >
//                 Post project
//               </Button>
//             </div>
//           )}
//         </div>
//       </form>
//     </>
//   );
// }

// function TagsInput({
//   value,
//   onChange,
//   disabled,
// }: {
//   value: string[];
//   onChange: (value: string[]) => void;
//   disabled?: boolean;
// }) {
//   const [input, setInput] = React.useState("");

//   function addTag(tag: string) {
//     const clean = tag.trim().toLowerCase();
//     if (!clean || value.includes(clean)) return;
//     onChange([...value, clean]);    
//   }

//   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       addTag(input);
//       setInput("");
//     }
//   }

//   function removeTag(tag: string) {
//     onChange(value.filter(t => t !== tag));
//   }

//   return (
//     <div className="flex flex-wrap gap-2 bg-transparent p-2">
//       {value.map(tag => (
//         <span
//           key={tag}
//           className="flex items-center gap-1 rounded-sm bg-muted px-3 py-1 text-xs"
//         >
//           {tag}
//           <button onClick={() => removeTag(tag)}>×</button>
//         </span>
//       ))}

//       <Input
//         value={input}
//         onChange={e => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type tag and press Enter"
//         disabled={disabled}
//         className="border-none bg-transparent w-50 h-12"
//       />
//     </div>
//   );
// }

// export default NewProjectForm;


import React, { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  FileTextIcon,
  FolderOpenIcon,
  SearchIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import * as z from "zod";

import api from "@/api/axios";
import { projectCategories } from "@/data/projectCategories";
import type { CreateProjectRequest } from "@/Types/createProjectRequest";
import type { Project } from "@/Types/project";
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

const formSchema = z
  .object({
    title: z
      .string()
      .min(5, "Use at least 5 characters.")
      .max(64, "Keep the title below 64 characters."),

    category: z.string().min(1, "Choose a category."),

    tags: z
      .array(z.string().min(2))
      .min(1, "Add at least one relevant tag."),

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
    (values) => {
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

type FormValues = z.infer<typeof formSchema>;
type Step = 1 | 2 | 3;
type SubmitIntent = "post" | "find";

const steps = [
  {
    number: 1,
    label: "Basics",
    description: "Title, category and skills",
    icon: FolderOpenIcon,
  },
  {
    number: 2,
    label: "Planning",
    description: "Dates, urgency and budget",
    icon: CalendarDaysIcon,
  },
  {
    number: 3,
    label: "Brief",
    description: "Files and project description",
    icon: FileTextIcon,
  },
] as const;

const stepFields: Record<Step, (keyof FormValues)[]> = {
  1: ["title", "category", "tags"],
  2: ["startDate", "endDate", "priority", "budget"],
  3: ["description"],
};

function NewProjectForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [submitIntent, setSubmitIntent] =
    useState<SubmitIntent>("post");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: "",
      category: "",
      tags: [],
      description: "",
      startDate: today,
      endDate: tomorrow,
      priority: "standard",
      budget: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleNext() {
    const fields = stepFields[step];

    const isValid = await form.trigger(fields, {
      shouldFocus: true,
    });

    if (!isValid) {
      return;
    }

    if (step < 3) {
      setStep((current) => (current + 1) as Step);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((current) => (current - 1) as Step);
    }
  }

  async function onSubmit(values: FormValues) {
    const payload: CreateProjectRequest = {
      title: values.title,
      description: values.description,
      category: values.category,
      tags: values.tags,
      startDate: toLocalDateOnly(values.startDate ?? new Date()),
      dueDate: toLocalDateOnly(values.endDate ?? new Date()),
      priority: values.priority,
      isPublic: false,
      allowBids: false,
      budget: Number(values.budget || 0),
      currency: "USD",
    };

    try {
      const response = await api.post<Project>(
        "projects",
        payload,
        {
          withCredentials: true,
        },
      );

      toast.success("Project created successfully.");

      if (submitIntent === "find") {
        navigate(
          `/projects/${response.data.id}/allocats/find`,
        );

        return;
      }

      navigate("/projects");
    } catch {
      toast.error(
        "We could not create the project. Please try again.",
      );
    }
  }

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* Step navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {steps.map((item) => {
            const Icon = item.icon;
            const isActive = step === item.number;
            const isComplete = step > item.number;

            return (
              <button
                key={item.number}
                type="button"
                onClick={() => {
                  if (item.number < step) {
                    setStep(item.number);
                  }
                }}
                className={cn(
                  "min-w-0 rounded-2xl border p-3 text-left transition-all sm:p-4",
                  isActive &&
                    "border-primary bg-primary/5 ring-2 ring-primary/10",
                  isComplete &&
                    "cursor-pointer border-primary/30 bg-primary/[0.03]",
                  !isActive &&
                    !isComplete &&
                    "cursor-default border-border bg-muted/20",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold sm:h-9 sm:w-9",
                      isActive &&
                        "bg-primary text-primary-foreground",
                      isComplete &&
                        "bg-primary/15 text-primary",
                      !isActive &&
                        !isComplete &&
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    {isComplete ? (
                      <CheckIcon size={16} />
                    ) : (
                      <Icon size={16} />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-xs font-semibold sm:text-sm",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </p>

                    <p className="mt-0.5 hidden truncate text-xs text-muted-foreground md:block">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${(step / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <form
        id="new-project"
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-0"
      >
        <FieldGroup className="gap-6">
          {step === 1 && (
            <>
              <StepHeading
                title="What are you working on?"
                description="Start with a clear title and choose the category that best describes the project."
              />

              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-semibold">
                      Project title
                    </FieldLabel>

                    <Input
                      {...field}
                      placeholder="Example: Redesign company website"
                      className="h-13 rounded-2xl border-border bg-muted/30 px-4 shadow-none focus-visible:bg-background"
                    />

                    <FieldDescription>
                      Use a short title that clearly describes the
                      outcome.
                    </FieldDescription>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-semibold">
                      Category
                    </FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-13 w-full rounded-2xl border-border bg-muted/30 px-4 shadow-none",
                          fieldState.invalid &&
                            "border-destructive ring-1 ring-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select a project category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {projectCategories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-semibold">
                      Skills and tags
                    </FieldLabel>

                    <TagsInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!form.watch("category")}
                      invalid={fieldState.invalid}
                    />

                    <FieldDescription>
                      Type a skill and press Enter. Examples:
                      branding, React, plumbing.
                    </FieldDescription>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading
                title="Set the project expectations."
                description="Choose the working dates, urgency and estimated budget."
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
                      className="h-13 rounded-2xl border-border bg-muted/30 shadow-none"
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
                        label="End date"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-13 rounded-2xl border-border bg-muted/30 shadow-none"
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
                    <FieldLabel className="font-semibold">
                      Priority
                    </FieldLabel>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        {
                          value: "standard",
                          label: "Standard",
                          description: "Normal timeline",
                        },
                        {
                          value: "high",
                          label: "High",
                          description: "Needs attention soon",
                        },
                        {
                          value: "urgent",
                          label: "Urgent",
                          description: "Immediate priority",
                        },
                      ].map((priority) => {
                        const isSelected =
                          field.value === priority.value;

                        return (
                          <label
                            key={priority.value}
                            className={cn(
                              "cursor-pointer rounded-2xl border p-4 transition-all",
                              isSelected
                                ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                                : "border-border bg-muted/20 hover:bg-muted/40",
                            )}
                          >
                            <input
                              type="radio"
                              value={priority.value}
                              checked={isSelected}
                              onChange={() =>
                                field.onChange(priority.value)
                              }
                              className="sr-only"
                            />

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold capitalize">
                                  {priority.label}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                  {priority.description}
                                </p>
                              </div>

                              <span
                                className={cn(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border",
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon size={12} />
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
                    <FieldLabel className="font-semibold">
                      Estimated budget
                    </FieldLabel>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        USD
                      </span>

                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        placeholder="0.00"
                        className="h-13 rounded-2xl border-border bg-muted/30 pl-14 shadow-none focus-visible:bg-background"
                      />
                    </div>

                    <FieldDescription>
                      You can leave this blank if the budget is still
                      flexible.
                    </FieldDescription>
                  </Field>
                )}
              />
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading
                title="Give Allocats the full picture."
                description="Add supporting files and explain the expected outcome, requirements and constraints."
              />

              <Field>
                <FieldLabel className="font-semibold">
                  Supporting files
                </FieldLabel>

                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-3">
                  <MultiFileUpload autoUpload={false} />
                </div>

                <FieldDescription>
                  Add briefs, references, images or other useful
                  documents.
                </FieldDescription>
              </Field>

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-semibold">
                      Project description
                    </FieldLabel>

                    <InputGroup
                      className={cn(
                        "overflow-hidden rounded-2xl border-border bg-muted/30 shadow-none",
                        fieldState.invalid &&
                          "border-destructive ring-1 ring-destructive",
                      )}
                    >
                      <InputGroupTextarea
                        {...field}
                        rows={9}
                        placeholder="Describe the project goals, deliverables, important requirements and what a successful result should look like."
                        className="min-h-[220px] resize-none bg-transparent px-4 py-4 leading-7"
                      />

                      <InputGroupAddon
                        align="block-end"
                        className="border-t border-border px-4 py-3"
                      >
                        <InputGroupText className="ml-auto text-xs text-muted-foreground">
                          {field.value.length}/2000
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </>
          )}
        </FieldGroup>

        {/* Navigation */}
        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                className="h-12 w-full rounded-full px-5 sm:w-auto"
              >
                <ArrowLeftIcon size={16} />
                Back
              </Button>
            )}
          </div>

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-12 w-full rounded-full px-8 sm:w-auto"
            >
              Continue
              <ArrowRightIcon size={16} />
            </Button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setSubmitIntent("find")}
                className="h-12 rounded-full px-6 shadow-none"
              >
                <SearchIcon size={16} />

                {isSubmitting &&
                submitIntent === "find"
                  ? "Creating..."
                  : "Create and find Allocats"}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitIntent("post")}
                className="h-12 rounded-full px-7"
              >
                <SendIcon size={16} />

                {isSubmitting &&
                submitIntent === "post"
                  ? "Creating..."
                  : "Create project"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

type StepHeadingProps = {
  title: string;
  description: string;
};

function StepHeading({
  title,
  description,
}: StepHeadingProps) {
  return (
    <div className="mb-1">
      <h3 className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">
        {title}
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

type TagsInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
};

function TagsInput({
  value,
  onChange,
  disabled,
  invalid,
}: TagsInputProps) {
  const [input, setInput] = useState("");

  function addTag(tag: string) {
    const cleanTag = tag.trim().toLowerCase();

    if (!cleanTag || value.includes(cleanTag)) {
      return;
    }

    onChange([...value, cleanTag]);
  }

  function commitTag() {
    addTag(input);
    setInput("");
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTag();
    }

    if (
      event.key === "Backspace" &&
      !input &&
      value.length > 0
    ) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((item) => item !== tag));
  }

  return (
    <div
      className={cn(
        "flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border bg-muted/30 p-2 transition-colors",
        "focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/30",
        invalid
          ? "border-destructive"
          : "border-border",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
        >
          {tag}

          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="rounded-full p-0.5 transition-colors hover:bg-primary/15"
            aria-label={`Remove ${tag}`}
          >
            <XIcon size={12} />
          </button>
        </span>
      ))}

      <Input
        value={input}
        onChange={(event) =>
          setInput(event.target.value)
        }
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (input.trim()) {
            commitTag();
          }
        }}
        placeholder={
          disabled
            ? "Choose a category first"
            : value.length
              ? "Add another skill"
              : "Type a skill and press Enter"
        }
        disabled={disabled}
        className="h-10 min-w-[180px] flex-1 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

export default NewProjectForm;