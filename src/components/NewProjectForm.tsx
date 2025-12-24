import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Input } from "./ui/input";
import { projectCategories } from "@/data/projectCategories";
import { toLocalDateOnly } from "@/utils/date"
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
    InputGroupTextarea
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    // SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar28 } from "./DatePicker";
import MultiFileUpload from "./MultiFileUpload";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import type { CreateProjectRequest } from "@/Types/createProjectRequest";
import type { Project } from "@/Types/project";

const formSchema = z.object({
    // Required fields
    title: z
        .string()
        .min(5, "Project title must be at least 5 characters.")
        .max(64, "Project title must be at most 64 characters."),
    category: z
        .string("Please select a category")
        .nonempty("Please lect a category"),
    tags: z
        .array(z.string().min(2))
        .min(1, "Add at least one tag"),
    startDate: z
        .date()
        .nullable(),
    endDate: z
        .date()
        .nullable(),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(2000, "Description must be at most 2000 characters"),
    priority: z
        .enum(["standard", "high", "urgent"], {
            error: "Please select priority"
        }),  
    
    // Optional fields
    budget: z
        .string()
        .optional(),    
});


function NewProjectForm() {
    let navigate = useNavigate();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // add 1 day
    
    type SubmitIntent = "post" | "find";
    const [submitIntent, setSubmitIntent] = useState<SubmitIntent>("post");    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            startDate: today,
            endDate: tomorrow,
        },
    });

    const {isSubmitting} = form.formState;

    async function OnSubmit(values: z.infer<typeof formSchema>) {
        const payload: CreateProjectRequest =  {
            title: values.title,
            description: values.description,
            category: values.category,
            tags: values.tags,
            startDate: toLocalDateOnly(values.startDate ?? new Date()),
            dueDate: toLocalDateOnly(values.endDate ?? new Date()),
            priority: values.priority,
            isPublic: false,
            allowBids: false,
            budget: Number(values.budget ?? 0),
            currency: "USD"

        };

        console.log(payload);
        try {
            const response = await axios.post<Project>(
                "http://localhost:5206/projects", payload
            );
            
            const createdProject = response.data;

            toast.success("Project has been created", {
                description: new Date().toLocaleDateString(),
                position: "top-center",
                style: { color: "#303030"}
                 
            });

            console.log("Submitted");            

            if (submitIntent === "find") {
                navigate(`/projects/${createdProject.id}/allocats/find`);
            } else {
                navigate("/projects");
            }   

        } catch(e) {
            console.log(e);
            toast.error("Failed to create project");                  
        };          
    }

    return (
        <>
        <Toaster />
            <form
                id="new-project"
                onSubmit={form.handleSubmit(
                    OnSubmit,
                    errors => {
                    console.log("FORM ERRORS:", errors);
                    }
                )}
                className=""
                
            >
                <FieldGroup>
                    <Controller
                        name="title"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="title" className="text-muted-foreground font-semibold">
                                    Title*
                                </FieldLabel>
                                <Input
                                    {...field}
                                    name="title"
                                    id="title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Car Window Repair"
                                    autoComplete="off"
                                    className=" border-none bg-input"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>                        
                        )}
                    />
                    <Controller
                        name="category"
                        control={form.control}
                        render={({field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="category" className="text-muted-foreground font-semibold">
                                    Category*
                                </FieldLabel>
                                <Select
                                    name="category"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >                                 
                                    <SelectTrigger
                                        name="category"
                                        id="category"
                                        className={cn(
                                            "w-full  bg-input border-none transition-colors duration-300 rounded-full",
                                            fieldState.invalid && "ring-1 ring-destructive"
                                        )}
                                    >
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectGroup>
                                        {/* <SelectLabel>Project category</SelectLabel> */}
                                        {projectCategories.map(category =>
                                            <SelectItem
                                                key={category}
                                                value={category}
                                                className="focus:bg-input"
                                            >
                                                {category}
                                            </SelectItem>
                                        )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}                            
                            </Field> 
                        )}                
                    />
                    {/* TAGS SELECT */}                    
                    <Controller
                        name="tags"
                        control={form.control}
                        defaultValue={[]}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-muted-foreground font-semibold">
                                Tags*
                            </FieldLabel>

                            <TagsInput
                                value={field.value}
                                onChange={field.onChange}
                                disabled={!form.watch("category")}
                            />

                            <FieldDescription>
                                Add tags to improve search (e.g. cleaning, plumbing, repair)
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            </Field>
                        )}
                    />

                    <span className="flex gap-4">
                        <Controller
                            name="startDate"
                            control={form.control}
                            render={({field}) => (                                    
                                <Calendar28
                                    id="start-date"
                                    label="Start date"
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endDate"
                            control={form.control}
                            render={({field}) => (                                    
                                <Calendar28
                                    id="end-date"
                                    label="End date"
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </span>
                    <span className="flex items-center gap-4">
                    <Controller
                        name="priority"
                        control={form.control}
                        defaultValue="standard"
                        render={({ field }) => (
                            <Field>
                            <FieldLabel className="text-muted-foreground font-semibold">
                                Priority*
                            </FieldLabel>

                            <div className="flex gap-4">
                                {["standard", "high", "urgent"].map(p => (
                                <label key={p} className="flex items-center gap-2">
                                    <input
                                    type="radio"
                                    value={p}
                                    checked={field.value === p}
                                    onChange={() => field.onChange(p)}
                                    />
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </label>
                                ))}
                            </div>
                            </Field>
                        )}
                    />

                    <Controller
                        name="budget"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="budget" className="text-muted-foreground font-semibold">Budget</FieldLabel>
                                <Input
                                    {...field}
                                    type="number"
                                    name="budget"
                                    id="budget"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="50"
                                    autoComplete="off"
                                    className="w-[12px] border-none "
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>

                        )}
                    />
                    </span>
                    <Field>
                        <MultiFileUpload autoUpload={false} />
                    </Field>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="description" className="text-muted-foreground font-semibold">
                                    Description*
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        id="description"
                                        placeholder="Please tell more about your project."
                                        rows={6}
                                        className="min-h-16 resize-none"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <InputGroupAddon align="block-end">
                                        <InputGroupText className="tabular-nums">
                                            {field.value.length}/2000 characters
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>
                                    Include full details of what you want done, e.g. walk dog daily starting at 5pm.
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex justify-between mt-8">
                    <Button type="reset" variant="link" onClick={() => form.reset()}>
                        Reset
                    </Button>

                    <div className="flex gap-4">
                    <Button
                        type="submit"
                        onClick={() => setSubmitIntent("find")}
                        disabled={isSubmitting}
                        variant="outline"
                    >
                        Find allocats
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => setSubmitIntent("post")}
                        disabled={isSubmitting}
                    >
                        Post project
                    </Button>
                    </div>
                </div>
            </form>            
        </>        
    );
}

function TagsInput({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = React.useState("");

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase();
    if (!clean || value.includes(clean)) return;
    onChange([...value, clean]);    
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
      setInput("");
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag));
  }

  return (
    <div className="flex flex-wrap gap-2 bg-transparent p-2">
      {value.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-sm bg-muted px-3 py-1 text-xs"
        >
          {tag}
          <button onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}

      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type tag and press Enter"
        disabled={disabled}
        className="border-none bg-transparent w-50"
      />
    </div>
  );
}

export default NewProjectForm;