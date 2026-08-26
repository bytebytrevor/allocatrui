// import React, {
//   useState,
// } from "react";

// import {
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   CalendarDaysIcon,
//   CheckIcon,
//   FileTextIcon,
//   FolderOpenIcon,
//   SearchIcon,
//   SendIcon,
//   XIcon,
// } from "lucide-react";

// import {
//   zodResolver,
// } from "@hookform/resolvers/zod";

// import {
//   Controller,
//   useForm,
// } from "react-hook-form";

// import {
//   useNavigate,
// } from "react-router-dom";

// import {
//   toast,
//   Toaster,
// } from "sonner";

// import * as z from "zod";

// import api from "@/api/axios";

// import {
//   projectCategories,
// } from "@/data/projectCategories";

// import type {
//   CreateProjectRequest,
// } from "@/Types/createProjectRequest";

// import type {
//   Project,
// } from "@/Types/project";

// import {
//   toLocalDateOnly,
// } from "@/utils/date";

// import {
//   cn,
// } from "@/lib/utils";

// import {
//   Button,
// } from "./ui/button";

// import {
//   Input,
// } from "./ui/input";

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

// import {
//   Calendar28,
// } from "./DatePicker";

// import MultiFileUpload from "./MultiFileUpload";

// /* =========================================================
//    SCHEMA
// ========================================================= */

// const formSchema = z
//   .object({
//     title: z
//       .string()
//       .min(
//         5,
//         "Use at least 5 characters.",
//       )
//       .max(
//         64,
//         "Keep the title below 64 characters.",
//       ),

//     category: z
//       .string()
//       .min(
//         1,
//         "Choose a category.",
//       ),

//     tags: z
//       .array(
//         z.string().min(2),
//       )
//       .min(
//         1,
//         "Add at least one relevant tag.",
//       ),

//     startDate: z
//       .date()
//       .nullable(),

//     endDate: z
//       .date()
//       .nullable(),

//     description: z
//       .string()
//       .min(
//         20,
//         "Describe the project in at least 20 characters.",
//       )
//       .max(
//         2000,
//         "Keep the description below 2,000 characters.",
//       ),

//     priority: z.enum([
//       "standard",
//       "high",
//       "urgent",
//     ]),

//     budget: z
//       .string()
//       .optional(),
//   })
//   .refine(
//     (values) => {
//       if (
//         !values.startDate ||
//         !values.endDate
//       ) {
//         return true;
//       }

//       return (
//         values.endDate >=
//         values.startDate
//       );
//     },
//     {
//       message:
//         "The end date must be after the start date.",
//       path: [
//         "endDate",
//       ],
//     },
//   );

// type FormValues =
//   z.infer<
//     typeof formSchema
//   >;

// type Step =
//   | 1
//   | 2
//   | 3;

// type SubmitIntent =
//   | "post"
//   | "find";

// /* =========================================================
//    STEPS
// ========================================================= */

// const steps = [
//   {
//     number: 1,
//     label: "Basics",
//     description:
//       "Title, category and skills",
//     icon: FolderOpenIcon,
//   },
//   {
//     number: 2,
//     label: "Planning",
//     description:
//       "Dates, priority and budget",
//     icon: CalendarDaysIcon,
//   },
//   {
//     number: 3,
//     label: "Brief",
//     description:
//       "Files and project description",
//     icon: FileTextIcon,
//   },
// ] as const;

// const stepFields: Record<
//   Step,
//   (
//     keyof FormValues
//   )[]
// > = {
//   1: [
//     "title",
//     "category",
//     "tags",
//   ],

//   2: [
//     "startDate",
//     "endDate",
//     "priority",
//     "budget",
//   ],

//   3: [
//     "description",
//   ],
// };

// /* =========================================================
//    FORM
// ========================================================= */

// function NewProjectForm() {
//   const navigate =
//     useNavigate();

//   const [
//     step,
//     setStep,
//   ] =
//     useState<Step>(1);

//   const [
//     submitIntent,
//     setSubmitIntent,
//   ] =
//     useState<SubmitIntent>(
//       "post",
//     );

//   const today =
//     new Date();

//   const tomorrow =
//     new Date(today);

//   tomorrow.setDate(
//     today.getDate() + 1,
//   );

//   const form =
//     useForm<FormValues>({
//       resolver:
//         zodResolver(
//           formSchema,
//         ),

//       defaultValues: {
//         title: "",
//         category: "",
//         tags: [],
//         description: "",
//         startDate:
//           today,
//         endDate:
//           tomorrow,
//         priority:
//           "standard",
//         budget: "",
//       },
//     });

//   const {
//     isSubmitting,
//   } =
//     form.formState;

//   async function handleNext() {
//     const fields =
//       stepFields[
//         step
//       ];

//     const isValid =
//       await form.trigger(
//         fields,
//         {
//           shouldFocus:
//             true,
//         },
//       );

//     if (!isValid) {
//       return;
//     }

//     if (step < 3) {
//       setStep(
//         (
//           current,
//         ) =>
//           (current +
//             1) as Step,
//       );
//     }
//   }

//   function handleBack() {
//     if (step > 1) {
//       setStep(
//         (
//           current,
//         ) =>
//           (current -
//             1) as Step,
//       );
//     }
//   }

//   async function onSubmit(
//     values: FormValues,
//   ) {
//     const payload: CreateProjectRequest =
//       {
//         title:
//           values.title,

//         description:
//           values.description,

//         category:
//           values.category,

//         tags:
//           values.tags,

//         startDate:
//           toLocalDateOnly(
//             values.startDate ??
//               new Date(),
//           ),

//         dueDate:
//           toLocalDateOnly(
//             values.endDate ??
//               new Date(),
//           ),

//         priority:
//           values.priority,

//         isPublic:
//           false,

//         allowBids:
//           false,

//         budget:
//           Number(
//             values.budget ||
//               0,
//           ),

//         currency:
//           "USD",
//       };

//     try {
//       const response =
//         await api.post<Project>(
//           "projects",
//           payload,
//           {
//             withCredentials:
//               true,
//           },
//         );

//       toast.success(
//         "Project created successfully.",
//       );

//       if (
//         submitIntent ===
//         "find"
//       ) {
//         navigate(
//           `/projects/${response.data.id}/allocats/find`,
//         );

//         return;
//       }

//       navigate(
//         "/projects",
//       );
//     } catch {
//       toast.error(
//         "We could not create the project. Please try again.",
//       );
//     }
//   }

//   return (
//     <>
//       <Toaster
//         richColors
//         position="top-right"
//       />

//       {/* =====================================================
//           PROGRESS
//       ===================================================== */}

//       <div className="mb-9">
//         <div className="flex items-start">
//           {steps.map(
//             (
//               item,
//               index,
//             ) => {
//               const Icon =
//                 item.icon;

//               const isActive =
//                 step ===
//                 item.number;

//               const isComplete =
//                 step >
//                 item.number;

//               return (
//                 <React.Fragment
//                   key={
//                     item.number
//                   }
//                 >
//                   <button
//                     type="button"
//                     onClick={() => {
//                       if (
//                         item.number <
//                         step
//                       ) {
//                         setStep(
//                           item.number,
//                         );
//                       }
//                     }}
//                     className={cn(
//                       "group min-w-0 flex-1 text-left",
//                       isComplete
//                         ? "cursor-pointer"
//                         : "cursor-default",
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       <span
//                         className={cn(
//                           "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
//                           "text-xs font-bold transition-colors duration-200",

//                           isActive &&
//                             "bg-primary text-primary-foreground",

//                           isComplete &&
//                             "bg-primary/10 text-primary",

//                           !isActive &&
//                             !isComplete &&
//                             "bg-muted text-muted-foreground",
//                         )}
//                       >
//                         {isComplete ? (
//                           <CheckIcon
//                             size={
//                               15
//                             }
//                           />
//                         ) : (
//                           <Icon
//                             size={
//                               15
//                             }
//                           />
//                         )}
//                       </span>

//                       <div className="hidden min-w-0 sm:block">
//                         <p
//                           className={cn(
//                             "text-xs font-semibold",

//                             isActive
//                               ? "text-foreground"
//                               : "text-muted-foreground",
//                           )}
//                         >
//                           {
//                             item.label
//                           }
//                         </p>

//                         <p className="mt-0.5 hidden truncate text-[0.66rem] text-muted-foreground lg:block">
//                           {
//                             item.description
//                           }
//                         </p>
//                       </div>
//                     </div>
//                   </button>

//                   {index <
//                     steps.length -
//                       1 && (
//                     <div className="mx-2 mt-[18px] h-px flex-1 bg-border sm:mx-3">
//                       <div
//                         className={cn(
//                           "h-px origin-left bg-primary transition-transform duration-300",

//                           step >
//                             item.number
//                             ? "scale-x-100"
//                             : "scale-x-0",
//                         )}
//                       />
//                     </div>
//                   )}
//                 </React.Fragment>
//               );
//             },
//           )}
//         </div>

//         <div className="mt-5 flex items-center justify-between border-b border-border pb-4">
//           <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
//             Step {step} of{" "}
//             {
//               steps.length
//             }
//           </p>

//           <p className="text-xs font-medium text-muted-foreground">
//             {
//               steps[
//                 step -
//                   1
//               ].label
//             }
//           </p>
//         </div>
//       </div>

//       {/* =====================================================
//           FORM
//       ===================================================== */}

//       <form
//         id="new-project"
//         onSubmit={
//           form.handleSubmit(
//             onSubmit,
//           )
//         }
//         className="min-w-0"
//       >
//         <FieldGroup className="gap-6">
//           {/* =================================================
//               STEP 1
//           ================================================= */}

//           {step === 1 && (
//             <>
//               <StepHeading
//                 eyebrow="Project basics"
//                 title="What are you working on?"
//                 description="Give the project a clear identity before adding the planning details."
//               />

//               <Controller
//                 name="title"
//                 control={
//                   form.control
//                 }
//                 render={({
//                   field,
//                   fieldState,
//                 }) => (
//                   <Field
//                     data-invalid={
//                       fieldState.invalid
//                     }
//                   >
//                     <FieldLabel className="text-sm font-semibold">
//                       Project
//                       title
//                     </FieldLabel>

//                     <Input
//                       {...field}
//                       placeholder="Example: Redesign company website"
//                       className={[
//                         "h-12 rounded-xl",
//                         "border-border bg-background",
//                         "px-4 shadow-none",
//                         "focus-visible:ring-1",
//                         "focus-visible:ring-primary/50",
//                       ].join(
//                         " ",
//                       )}
//                     />

//                     <FieldDescription className="text-xs leading-5">
//                       Keep it
//                       short and
//                       focused on
//                       the outcome.
//                     </FieldDescription>

//                     <FieldError
//                       errors={[
//                         fieldState.error,
//                       ]}
//                     />
//                   </Field>
//                 )}
//               />

//               <Controller
//                 name="category"
//                 control={
//                   form.control
//                 }
//                 render={({
//                   field,
//                   fieldState,
//                 }) => (
//                   <Field
//                     data-invalid={
//                       fieldState.invalid
//                     }
//                   >
//                     <FieldLabel className="text-sm font-semibold">
//                       Category
//                     </FieldLabel>

//                     <Select
//                       value={
//                         field.value
//                       }
//                       onValueChange={
//                         field.onChange
//                       }
//                     >
//                       <SelectTrigger
//                         className={cn(
//                           "h-12 w-full rounded-xl border-border bg-background px-4 shadow-none",
//                           "focus:ring-1 focus:ring-primary/50",

//                           fieldState.invalid &&
//                             "border-destructive",
//                         )}
//                       >
//                         <SelectValue placeholder="Select a project category" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectGroup>
//                           {projectCategories.map(
//                             (
//                               category,
//                             ) => (
//                               <SelectItem
//                                 key={
//                                   category
//                                 }
//                                 value={
//                                   category
//                                 }
//                               >
//                                 {
//                                   category
//                                 }
//                               </SelectItem>
//                             ),
//                           )}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>

//                     <FieldError
//                       errors={[
//                         fieldState.error,
//                       ]}
//                     />
//                   </Field>
//                 )}
//               />

//               <Controller
//                 name="tags"
//                 control={
//                   form.control
//                 }
//                 render={({
//                   field,
//                   fieldState,
//                 }) => (
//                   <Field
//                     data-invalid={
//                       fieldState.invalid
//                     }
//                   >
//                     <FieldLabel className="text-sm font-semibold">
//                       Skills
//                       and tags
//                     </FieldLabel>

//                     <TagsInput
//                       value={
//                         field.value
//                       }
//                       onChange={
//                         field.onChange
//                       }
//                       disabled={
//                         !form.watch(
//                           "category",
//                         )
//                       }
//                       invalid={
//                         fieldState.invalid
//                       }
//                     />

//                     <FieldDescription className="text-xs leading-5">
//                       Add the
//                       skills that
//                       matter most
//                       for the job.
//                     </FieldDescription>

//                     <FieldError
//                       errors={[
//                         fieldState.error,
//                       ]}
//                     />
//                   </Field>
//                 )}
//               />
//             </>
//           )}

//           {/* =================================================
//               STEP 2
//           ================================================= */}

//           {step === 2 && (
//             <>
//               <StepHeading
//                 eyebrow="Planning"
//                 title="Set the project expectations."
//                 description="Add the working dates, urgency and an estimated budget."
//               />

//               <div className="grid gap-5 sm:grid-cols-2">
//                 <Controller
//                   name="startDate"
//                   control={
//                     form.control
//                   }
//                   render={({
//                     field,
//                   }) => (
//                     <Calendar28
//                       id="startDate"
//                       label="Start date"
//                       value={
//                         field.value
//                       }
//                       onChange={
//                         field.onChange
//                       }
//                       className="h-12 rounded-xl border-border bg-background shadow-none"
//                     />
//                   )}
//                 />

//                 <Controller
//                   name="endDate"
//                   control={
//                     form.control
//                   }
//                   render={({
//                     field,
//                     fieldState,
//                   }) => (
//                     <Field
//                       data-invalid={
//                         fieldState.invalid
//                       }
//                     >
//                       <Calendar28
//                         id="endDate"
//                         label="End date"
//                         value={
//                           field.value
//                         }
//                         onChange={
//                           field.onChange
//                         }
//                         className="h-12 rounded-xl border-border bg-background shadow-none"
//                       />

//                       <FieldError
//                         errors={[
//                           fieldState.error,
//                         ]}
//                       />
//                     </Field>
//                   )}
//                 />
//               </div>

//               <Controller
//                 name="priority"
//                 control={
//                   form.control
//                 }
//                 render={({
//                   field,
//                 }) => (
//                   <Field>
//                     <FieldLabel className="text-sm font-semibold">
//                       Priority
//                     </FieldLabel>

//                     <div className="overflow-hidden rounded-xl ring-1 ring-border sm:grid sm:grid-cols-3">
//                       {[
//                         {
//                           value:
//                             "standard",
//                           label:
//                             "Standard",
//                           description:
//                             "Normal timeline",
//                         },
//                         {
//                           value:
//                             "high",
//                           label:
//                             "High",
//                           description:
//                             "Needs attention soon",
//                         },
//                         {
//                           value:
//                             "urgent",
//                           label:
//                             "Urgent",
//                           description:
//                             "Immediate priority",
//                         },
//                       ].map(
//                         (
//                           priority,
//                           index,
//                         ) => {
//                           const isSelected =
//                             field.value ===
//                             priority.value;

//                           return (
//                             <label
//                               key={
//                                 priority.value
//                               }
//                               className={cn(
//                                 "relative flex cursor-pointer items-center gap-3 px-4 py-4 transition-colors",

//                                 index >
//                                   0 &&
//                                   "border-t border-border sm:border-l sm:border-t-0",

//                                 isSelected
//                                   ? "bg-primary/[0.055]"
//                                   : "bg-background hover:bg-muted/30",
//                               )}
//                             >
//                               <input
//                                 type="radio"
//                                 value={
//                                   priority.value
//                                 }
//                                 checked={
//                                   isSelected
//                                 }
//                                 onChange={() =>
//                                   field.onChange(
//                                     priority.value,
//                                   )
//                                 }
//                                 className="sr-only"
//                               />

//                               <span
//                                 className={cn(
//                                   "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",

//                                   isSelected
//                                     ? "border-primary bg-primary text-primary-foreground"
//                                     : "border-border bg-background",
//                                 )}
//                               >
//                                 {isSelected && (
//                                   <CheckIcon
//                                     size={
//                                       9
//                                     }
//                                     strokeWidth={
//                                       3
//                                     }
//                                   />
//                                 )}
//                               </span>

//                               <span className="min-w-0">
//                                 <span className="block text-xs font-semibold">
//                                   {
//                                     priority.label
//                                   }
//                                 </span>

//                                 <span className="mt-0.5 block text-[0.65rem] leading-5 text-muted-foreground">
//                                   {
//                                     priority.description
//                                   }
//                                 </span>
//                               </span>
//                             </label>
//                           );
//                         },
//                       )}
//                     </div>
//                   </Field>
//                 )}
//               />

//               <Controller
//                 name="budget"
//                 control={
//                   form.control
//                 }
//                 render={({
//                   field,
//                 }) => (
//                   <Field>
//                     <FieldLabel className="text-sm font-semibold">
//                       Estimated
//                       budget
//                     </FieldLabel>

//                     <div className="relative">
//                       <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
//                         USD
//                       </span>

//                       <Input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         {...field}
//                         placeholder="0.00"
//                         className={[
//                           "h-12 rounded-xl",
//                           "border-border bg-background",
//                           "pl-14 shadow-none",
//                           "focus-visible:ring-1",
//                           "focus-visible:ring-primary/50",
//                         ].join(
//                           " ",
//                         )}
//                       />
//                     </div>

//                     <FieldDescription className="text-xs leading-5">
//                       Leave this
//                       blank if the
//                       budget is
//                       still
//                       flexible.
//                     </FieldDescription>
//                   </Field>
//                 )}
//               />
//             </>
//           )}

//           {/* =================================================
//               STEP 3
//           ================================================= */}

//           {step === 3 && (
//             <>
//               <StepHeading
//                 eyebrow="Project brief"
//                 title="Give Allocats the full picture."
//                 description="Explain the outcome, important requirements and anything they should know before accepting the work."
//               />

//               <Field>
//                 <FieldLabel className="text-sm font-semibold">
//                   Supporting
//                   files
//                 </FieldLabel>

//                 <div className="border-y border-border py-4">
//                   <MultiFileUpload
//                     autoUpload={
//                       false
//                     }
//                   />
//                 </div>

//                 <FieldDescription className="text-xs leading-5">
//                   Add briefs,
//                   references,
//                   photos or any
//                   files that make
//                   the work easier
//                   to understand.
//                 </FieldDescription>
//               </Field>

//               <Controller
//                 name="description"
//                 control={
//                   form.control
//                 }
//                 render={({
//                   field,
//                   fieldState,
//                 }) => (
//                   <Field
//                     data-invalid={
//                       fieldState.invalid
//                     }
//                   >
//                     <FieldLabel className="text-sm font-semibold">
//                       Project
//                       description
//                     </FieldLabel>

//                     <InputGroup
//                       className={cn(
//                         "overflow-hidden rounded-xl border-border bg-background shadow-none",

//                         fieldState.invalid &&
//                           "border-destructive",
//                       )}
//                     >
//                       <InputGroupTextarea
//                         {...field}
//                         rows={
//                           9
//                         }
//                         placeholder="Describe the goals, deliverables, requirements and what a successful result should look like."
//                         className="min-h-[210px] resize-none bg-transparent px-4 py-4 leading-7"
//                       />

//                       <InputGroupAddon
//                         align="block-end"
//                         className="border-t border-border px-4 py-2.5"
//                       >
//                         <InputGroupText className="ml-auto text-[0.65rem] text-muted-foreground">
//                           {
//                             field
//                               .value
//                               .length
//                           }
//                           /2000
//                         </InputGroupText>
//                       </InputGroupAddon>
//                     </InputGroup>

//                     <FieldError
//                       errors={[
//                         fieldState.error,
//                       ]}
//                     />
//                   </Field>
//                 )}
//               />
//             </>
//           )}
//         </FieldGroup>

//         {/* =====================================================
//             ACTIONS
//         ===================================================== */}

//         <div className="mt-9 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             {step > 1 && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={
//                   handleBack
//                 }
//                 className="h-11 w-full rounded-lg px-4 text-muted-foreground shadow-none sm:w-auto"
//               >
//                 <ArrowLeftIcon
//                   size={
//                     15
//                   }
//                 />

//                 Previous
//               </Button>
//             )}
//           </div>

//           {step < 3 ? (
//             <Button
//               type="button"
//               onClick={
//                 handleNext
//               }
//               className="group h-11 w-full rounded-lg px-6 shadow-none sm:w-auto"
//             >
//               Continue

//               <ArrowRightIcon
//                 size={
//                   15
//                 }
//                 className="transition-transform group-hover:translate-x-1"
//               />
//             </Button>
//           ) : (
//             <div className="flex flex-col gap-2.5 sm:flex-row">
//               <Button
//                 type="submit"
//                 variant="outline"
//                 disabled={
//                   isSubmitting
//                 }
//                 onClick={() =>
//                   setSubmitIntent(
//                     "find",
//                   )
//                 }
//                 className="h-11 rounded-lg px-5 shadow-none"
//               >
//                 <SearchIcon
//                   size={
//                     15
//                   }
//                 />

//                 {isSubmitting &&
//                 submitIntent ===
//                   "find"
//                   ? "Creating..."
//                   : "Create & find Allocats"}
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={
//                   isSubmitting
//                 }
//                 onClick={() =>
//                   setSubmitIntent(
//                     "post",
//                   )
//                 }
//                 className="h-11 rounded-lg px-6 shadow-none"
//               >
//                 <SendIcon
//                   size={
//                     15
//                   }
//                 />

//                 {isSubmitting &&
//                 submitIntent ===
//                   "post"
//                   ? "Creating..."
//                   : "Create project"}
//               </Button>
//             </div>
//           )}
//         </div>
//       </form>
//     </>
//   );
// }

// /* =========================================================
//    STEP HEADING
// ========================================================= */

// function StepHeading({
//   eyebrow,
//   title,
//   description,
// }: {
//   eyebrow: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="mb-2 max-w-2xl">
//       <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-primary">
//         {eyebrow}
//       </p>

//       <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.02em] sm:text-2xl">
//         {title}
//       </h3>

//       <p className="mt-2 text-sm leading-7 text-muted-foreground">
//         {description}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    TAGS INPUT
// ========================================================= */

// type TagsInputProps = {
//   value: string[];
//   onChange: (
//     value: string[],
//   ) => void;
//   disabled?: boolean;
//   invalid?: boolean;
// };

// function TagsInput({
//   value,
//   onChange,
//   disabled,
//   invalid,
// }: TagsInputProps) {
//   const [
//     input,
//     setInput,
//   ] =
//     useState("");

//   function addTag(
//     tag: string,
//   ) {
//     const cleanTag =
//       tag
//         .trim()
//         .toLowerCase();

//     if (
//       !cleanTag ||
//       value.includes(
//         cleanTag,
//       )
//     ) {
//       return;
//     }

//     onChange([
//       ...value,
//       cleanTag,
//     ]);
//   }

//   function commitTag() {
//     addTag(input);
//     setInput("");
//   }

//   function handleKeyDown(
//     event: React.KeyboardEvent<HTMLInputElement>,
//   ) {
//     if (
//       event.key ===
//         "Enter" ||
//       event.key === ","
//     ) {
//       event.preventDefault();

//       commitTag();
//     }

//     if (
//       event.key ===
//         "Backspace" &&
//       !input &&
//       value.length >
//         0
//     ) {
//       onChange(
//         value.slice(
//           0,
//           -1,
//         ),
//       );
//     }
//   }

//   function removeTag(
//     tag: string,
//   ) {
//     onChange(
//       value.filter(
//         (item) =>
//           item !==
//           tag,
//       ),
//     );
//   }

//   return (
//     <div
//       className={cn(
//         "flex min-h-12 flex-wrap items-center gap-2 rounded-xl border bg-background px-2.5 py-2",
//         "transition-colors focus-within:ring-1 focus-within:ring-primary/50",

//         invalid
//           ? "border-destructive"
//           : "border-border",

//         disabled &&
//           "cursor-not-allowed opacity-60",
//       )}
//     >
//       {value.map(
//         (tag) => (
//           <span
//             key={tag}
//             className={[
//               "inline-flex h-7 items-center gap-1.5 rounded-lg",
//               "bg-muted px-2.5 text-[0.68rem] font-semibold",
//               "text-foreground",
//             ].join(
//               " ",
//             )}
//           >
//             {tag}

//             <button
//               type="button"
//               onClick={() =>
//                 removeTag(
//                   tag,
//                 )
//               }
//               disabled={
//                 disabled
//               }
//               className="text-muted-foreground transition-colors hover:text-foreground"
//               aria-label={`Remove ${tag}`}
//             >
//               <XIcon
//                 size={
//                   11
//                 }
//               />
//             </button>
//           </span>
//         ),
//       )}

//       <Input
//         value={
//           input
//         }
//         onChange={(
//           event,
//         ) =>
//           setInput(
//             event.target
//               .value,
//           )
//         }
//         onKeyDown={
//           handleKeyDown
//         }
//         onBlur={() => {
//           if (
//             input.trim()
//           ) {
//             commitTag();
//           }
//         }}
//         placeholder={
//           disabled
//             ? "Choose a category first"
//             : value.length
//               ? "Add another skill"
//               : "Type a skill and press Enter"
//         }
//         disabled={
//           disabled
//         }
//         className="h-8 min-w-[170px] flex-1 border-0 bg-transparent px-1.5 text-sm shadow-none focus-visible:ring-0"
//       />
//     </div>
//   );
// }

// export default NewProjectForm;



import React, {
  useRef,
  useState,
} from "react";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  FileTextIcon,
  FolderOpenIcon,
  LoaderCircleIcon,
  SearchIcon,
  SendIcon,
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
        "Add at least one relevant tag.",
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
    description:
      "Title, category and skills",
    icon: FolderOpenIcon,
  },
  {
    number: 2,
    label: "Planning",
    description:
      "Dates, priority and budget",
    icon: CalendarDaysIcon,
  },
  {
    number: 3,
    label: "Brief",
    description:
      "Files and project description",
    icon: FileTextIcon,
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

  /*
   * The ref guarantees that onSubmit immediately
   * sees which submit button was clicked.
   */
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
     STEP NAVIGATION
  ======================================================= */

  async function handleNext() {
    const fields =
      stepFields[
        step
      ];

    const isValid =
      await form.trigger(
        fields,
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

      /*
       * Option 1:
       * Create project and immediately
       * continue to finding Allocats.
       */
      if (
        intent ===
        "find"
      ) {
        navigate(
          `/projects/${response.data.id}/allocats/find`,
        );

        return;
      }

      /*
       * Option 2:
       * Create project and return to
       * the normal project workspace.
       */
      navigate(
        "/projects",
      );
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
      <Toaster
        richColors
        position="top-right"
      />

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="mb-9">
        <div className="flex items-start">
          {steps.map(
            (
              item,
              index,
            ) => {
              const Icon =
                item.icon;

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
                      "group min-w-0 flex-1 text-left",

                      isComplete
                        ? "cursor-pointer"
                        : "cursor-default",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",

                          "text-xs font-bold transition-colors duration-200",

                          isActive &&
                            "bg-primary text-primary-foreground",

                          isComplete &&
                            "bg-primary/10 text-primary",

                          !isActive &&
                            !isComplete &&
                            "bg-muted text-muted-foreground",
                        )}
                      >
                        {isComplete ? (
                          <CheckIcon
                            size={
                              15
                            }
                          />
                        ) : (
                          <Icon
                            size={
                              15
                            }
                          />
                        )}
                      </span>

                      <div className="hidden min-w-0 sm:block">
                        <p
                          className={cn(
                            "text-xs font-semibold",

                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {
                            item.label
                          }
                        </p>

                        <p className="mt-0.5 hidden truncate text-[0.66rem] text-muted-foreground lg:block">
                          {
                            item.description
                          }
                        </p>
                      </div>
                    </div>
                  </button>

                  {index <
                    steps.length -
                      1 && (
                    <div className="mx-2 mt-[18px] h-px flex-1 bg-border sm:mx-3">
                      <div
                        className={cn(
                          "h-px origin-left bg-primary transition-transform duration-300",

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

        <div className="mt-5 flex items-center justify-between border-b border-border pb-4">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Step {step} of{" "}
            {
              steps.length
            }
          </p>

          <p className="text-xs font-medium text-muted-foreground">
            {
              steps[
                step -
                  1
              ].label
            }
          </p>
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
        <FieldGroup className="gap-6">

          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <>
              <StepHeading
                eyebrow="Project basics"
                title="What are you working on?"
                description="Give the project a clear identity before adding the planning details."
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
                      placeholder="Example: Redesign company website"
                      className={[
                        "h-12 rounded-xl",
                        "border-border bg-background",
                        "px-4 shadow-none",
                        "focus-visible:ring-1",
                        "focus-visible:ring-primary/50",
                      ].join(
                        " ",
                      )}
                    />

                    <FieldDescription className="text-xs leading-5">
                      Keep it short
                      and focused on
                      the outcome.
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
                          "h-12 w-full rounded-xl border-border bg-background px-4 shadow-none",

                          "focus:ring-1 focus:ring-primary/50",

                          fieldState.invalid &&
                            "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select a project category" />
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
                      Skills and
                      tags
                    </FieldLabel>

                    <TagsInput
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

                    <FieldDescription className="text-xs leading-5">
                      Add the
                      skills that
                      matter most
                      for the job.
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
                eyebrow="Planning"
                title="Set the project expectations."
                description="Add the working dates, urgency and an estimated budget."
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
                      className="h-12 rounded-xl border-border bg-background shadow-none"
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
                        label="End date"
                        value={
                          field.value
                        }
                        onChange={
                          field.onChange
                        }
                        className="h-12 rounded-xl border-border bg-background shadow-none"
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

                    <div className="overflow-hidden rounded-xl ring-1 ring-border sm:grid sm:grid-cols-3">
                      {[
                        {
                          value:
                            "standard",
                          label:
                            "Standard",
                          description:
                            "Normal timeline",
                        },
                        {
                          value:
                            "high",
                          label:
                            "High",
                          description:
                            "Needs attention soon",
                        },
                        {
                          value:
                            "urgent",
                          label:
                            "Urgent",
                          description:
                            "Immediate priority",
                        },
                      ].map(
                        (
                          priority,
                          index,
                        ) => {
                          const isSelected =
                            field.value ===
                            priority.value;

                          return (
                            <label
                              key={
                                priority.value
                              }
                              className={cn(
                                "relative flex cursor-pointer items-center gap-3 px-4 py-4 transition-colors",

                                index >
                                  0 &&
                                  "border-t border-border sm:border-l sm:border-t-0",

                                isSelected
                                  ? "bg-primary/[0.055]"
                                  : "bg-background hover:bg-muted/30",
                              )}
                            >
                              <input
                                type="radio"
                                value={
                                  priority.value
                                }
                                checked={
                                  isSelected
                                }
                                onChange={() =>
                                  field.onChange(
                                    priority.value,
                                  )
                                }
                                className="sr-only"
                              />

                              <span
                                className={cn(
                                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",

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

                              <span className="min-w-0">
                                <span className="block text-xs font-semibold">
                                  {
                                    priority.label
                                  }
                                </span>

                                <span className="mt-0.5 block text-[0.65rem] leading-5 text-muted-foreground">
                                  {
                                    priority.description
                                  }
                                </span>
                              </span>
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

                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        USD
                      </span>

                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        placeholder="0.00"
                        className={[
                          "h-12 rounded-xl",
                          "border-border bg-background",
                          "pl-14 shadow-none",
                          "focus-visible:ring-1",
                          "focus-visible:ring-primary/50",
                        ].join(
                          " ",
                        )}
                      />
                    </div>

                    <FieldDescription className="text-xs leading-5">
                      Leave this
                      blank if the
                      budget is
                      still flexible.
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
                eyebrow="Project brief"
                title="Give Allocats the full picture."
                description="Explain the outcome, important requirements and anything they should know before accepting the work."
              />

              <Field>
                <FieldLabel className="text-sm font-semibold">
                  Supporting
                  files
                </FieldLabel>

                <div className="border-y border-border py-4">
                  <MultiFileUpload
                    autoUpload={
                      false
                    }
                  />
                </div>

                <FieldDescription className="text-xs leading-5">
                  Add briefs,
                  references,
                  photos or any
                  files that make
                  the work easier
                  to understand.
                </FieldDescription>
              </Field>

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
                      Project
                      description
                    </FieldLabel>

                    <InputGroup
                      className={cn(
                        "overflow-hidden rounded-xl border-border bg-background shadow-none",

                        fieldState.invalid &&
                          "border-destructive",
                      )}
                    >
                      <InputGroupTextarea
                        {...field}
                        rows={
                          9
                        }
                        placeholder="Describe the goals, deliverables, requirements and what a successful result should look like."
                        className="min-h-[210px] resize-none bg-transparent px-4 py-4 leading-7"
                      />

                      <InputGroupAddon
                        align="block-end"
                        className="border-t border-border px-4 py-2.5"
                      >
                        <InputGroupText className="ml-auto text-[0.65rem] text-muted-foreground">
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
            </>
          )}
        </FieldGroup>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="mt-9 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={
                  handleBack
                }
                disabled={
                  isSubmitting
                }
                className="h-11 w-full rounded-lg px-4 text-muted-foreground shadow-none sm:w-auto"
              >
                <ArrowLeftIcon
                  size={
                    15
                  }
                />

                Previous
              </Button>
            )}
          </div>

          {step < 3 ? (
            <Button
              type="button"
              onClick={
                handleNext
              }
              className="group h-11 w-full rounded-lg px-6 shadow-none sm:w-auto"
            >
              Continue

              <ArrowRightIcon
                size={
                  15
                }
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {/* ===============================================
                  CREATE PROJECT ONLY
              =============================================== */}

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
                className="h-11 rounded-lg px-5 shadow-none"
              >
                {isSubmitting &&
                submitIntent ===
                  "post" ? (
                  <>
                    <LoaderCircleIcon
                      size={
                        15
                      }
                      className="animate-spin"
                    />

                    Creating...
                  </>
                ) : (
                  <>
                    <SendIcon
                      size={
                        15
                      }
                    />

                    Create project
                  </>
                )}
              </Button>

              {/* ===============================================
                  CREATE + FIND ALLOCATS
              =============================================== */}

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
                className="group h-11 rounded-lg px-6 shadow-none"
              >
                {isSubmitting &&
                submitIntent ===
                  "find" ? (
                  <>
                    <LoaderCircleIcon
                      size={
                        15
                      }
                      className="animate-spin"
                    />

                    Creating...
                  </>
                ) : (
                  <>
                    <SearchIcon
                      size={
                        15
                      }
                    />

                    Create & find Allocats

                    <ArrowRightIcon
                      size={
                        14
                      }
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </Button>
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
    <div className="mb-2 max-w-2xl">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-primary">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.02em] sm:text-2xl">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   TAGS INPUT
========================================================= */

type TagsInputProps = {
  value: string[];

  onChange: (
    value: string[],
  ) => void;

  disabled?: boolean;
  invalid?: boolean;
};

function TagsInput({
  value,
  onChange,
  disabled,
  invalid,
}: TagsInputProps) {
  const [
    input,
    setInput,
  ] =
    useState("");

  function addTag(
    tag: string,
  ) {
    const cleanTag =
      tag
        .trim()
        .toLowerCase();

    if (
      !cleanTag ||
      value.includes(
        cleanTag,
      )
    ) {
      return;
    }

    onChange([
      ...value,
      cleanTag,
    ]);
  }

  function commitTag() {
    addTag(input);
    setInput("");
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key ===
        "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();

      commitTag();
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

  function removeTag(
    tag: string,
  ) {
    onChange(
      value.filter(
        (item) =>
          item !==
          tag,
      ),
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-12 flex-wrap items-center gap-2 rounded-xl border bg-background px-2.5 py-2",

        "transition-colors focus-within:ring-1 focus-within:ring-primary/50",

        invalid
          ? "border-destructive"
          : "border-border",

        disabled &&
          "cursor-not-allowed opacity-60",
      )}
    >
      {value.map(
        (tag) => (
          <span
            key={tag}
            className={[
              "inline-flex h-7 items-center gap-1.5 rounded-lg",
              "bg-muted px-2.5 text-[0.68rem] font-semibold",
              "text-foreground",
            ].join(
              " ",
            )}
          >
            {tag}

            <button
              type="button"
              onClick={() =>
                removeTag(
                  tag,
                )
              }
              disabled={
                disabled
              }
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`Remove ${tag}`}
            >
              <XIcon
                size={
                  11
                }
              />
            </button>
          </span>
        ),
      )}

      <Input
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
        onBlur={() => {
          if (
            input.trim()
          ) {
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
        disabled={
          disabled
        }
        className="h-8 min-w-[170px] flex-1 border-0 bg-transparent px-1.5 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

export default NewProjectForm;