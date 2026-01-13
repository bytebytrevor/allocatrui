import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Input } from "./ui/input";
import { projectCategories } from "@/data/projectCategories";
import { toLocalDateOnly } from "@/utils/date";
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
  title: z.string().min(5).max(64),
  category: z.string().nonempty(),
  tags: z.array(z.string().min(2)).min(1),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  description: z.string().min(20).max(2000),
  priority: z.enum(["standard", "high", "urgent"]),
  budget: z.string().optional(),
});

function NewProjectForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitIntent, setSubmitIntent] = useState<"post" | "find">("post");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: today,
      endDate: tomorrow,
      priority: "standard",
      tags: [],
    },
  });

  const { isSubmitting } = form.formState;

  async function OnSubmit(values: z.infer<typeof formSchema>) {
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
      budget: Number(values.budget ?? 0),
      currency: "USD",
    };

    try {
      const response = await axios.post<Project>(
        "http://localhost:5206/projects",
        payload
      );

      toast.success("Project has been created");

      if (submitIntent === "find") {
        navigate(`/projects/${response.data.id}/allocats/find`);
      } else {
        navigate("/projects");
      }
    } catch {
      toast.error("Failed to create project");
    }
  }

  return (
    <>
      <Toaster />

      <form
        id="new-project"
        onSubmit={form.handleSubmit(OnSubmit)}
      >
        <FieldGroup>

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              {/* TITLE */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-muted-foreground font-semibold">
                      Title*
                    </FieldLabel>
                    <Input {...field} className="border-none bg-input" />
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
                    <FieldLabel className="text-muted-foreground font-semibold">
                      Category*
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-full bg-input border-none rounded-full",
                          fieldState.invalid && "ring-1 ring-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {projectCategories.map(c => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* TAGS */}
              <Controller
                name="tags"
                control={form.control}
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
                      Add tags to improve search
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <span className="flex gap-4">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field }) => (
                    <Calendar28
                    id="startDate"
                      label="Start date"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field }) => (
                    <Calendar28
                      id="endDate"
                      label="End date"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </span>

              <Controller
                name="priority"
                control={form.control}
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
                            checked={field.value === p}
                            onChange={() => field.onChange(p)}
                          />
                          {p}
                        </label>
                      ))}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="budget"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-muted-foreground font-semibold">
                      Budget
                    </FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      className="border-none bg-input"
                    />
                  </Field>
                )}
              />
            </>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <>
              <Field>
                <MultiFileUpload autoUpload={false} />
              </Field>

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-muted-foreground font-semibold">
                      Description*
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea {...field} rows={6} />
                      <InputGroupAddon align="block-end">
                        <InputGroupText>
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

        {/* ================= NAV ================= */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button type="button" variant="link" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setSubmitIntent("find")}
              >
                Find allocats
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSubmitIntent("post")}
              >
                Post project
              </Button>
            </div>
          )}
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