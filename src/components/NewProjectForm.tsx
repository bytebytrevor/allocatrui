import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Input } from "./ui/input";
import { projectTypes } from "@/data/projectTypes";
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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar28 } from "./DatePicker";
import MultiFileUpload from "./MultiFileUpload";
import axios from "axios";
import { CircleCheckBig } from "lucide-react";
import { bg } from "date-fns/locale";

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Project title must be at least 5 characters.")
        .max(64, "Project title must be at most 64 characters."),
    type: z
        .string()
        .nonempty("Please select a type."),
    category: z
        .string()
        .nonempty("Please select a category"),
    startDate: z
        .date()
        .nullable(),
    endDate: z
        .date()
        .nullable(),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(2000, "Description must be at most 2000 characters")
});


function NewProjectForm() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // add 1 day

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            type: "",
            description: "",
            startDate: today,
            endDate: tomorrow,
        },
    });

    async function OnSubmit(data: z.infer<typeof formSchema>) {
        // await axios.post("https://httpbin.org/post", form);
        console.log("Submitted");
        toast.success("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          position: "top-center",
          style: { color: "#303030"}
          
        });      
    }

    const selectedType = form.watch("type") as keyof typeof projectTypes;

    return (
        <>
        <Toaster />
            <form id="new-project" onSubmit={form.handleSubmit(OnSubmit)}>
                <FieldGroup>
                    <Controller
                        name="title"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="title">Title</FieldLabel>
                                <Input
                                    {...field}
                                    name="title"
                                    id="title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Car Window Repair"
                                    autoComplete="off"
                                    className="rounded-full border-none bg-input"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>                        
                        )}
                    />
                    <Controller
                        name="type"
                        control={form.control}
                        render={({field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="type">
                                    Type
                                </FieldLabel>
                                <Select
                                    name="type"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >                                 
                                    <SelectTrigger
                                        name="type"
                                        id="type"
                                        className={cn(
                                            "w-full rounded-full bg-input border-none transition-colors duration-300",
                                            fieldState.invalid && "ring-1 ring-destructive"
                                        )}
                                    >
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectGroup>
                                        {/* <SelectLabel>Project type</SelectLabel> */}
                                        {Object.keys(projectTypes).map(type =>
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className="focus:bg-input"
                                            >
                                                {type}
                                            </SelectItem>
                                        )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <p className="text-destructive text-xs mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}                            
                            </Field> 
                        )}                
                    />
                    {/* CATEGORY SELECT */}
                    <Controller
                        name="category"
                        control={form.control}
                        render={({ field, fieldState }) => {
                        const availableCategories = selectedType
                            ? projectTypes[selectedType]
                            : []

                        return (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="category">Category</FieldLabel>

                            <Select
                                name="category"
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedType} // disable until type is chosen
                            >
                                <SelectTrigger
                                name="category"
                                id="category"
                                className={cn(
                                    "w-full rounded-full bg-input border-none transition-colors duration-300",
                                    fieldState.invalid && "ring-1 ring-destructive"
                                )}
                                >
                                <SelectValue placeholder="Select category" />
                                </SelectTrigger>

                                <SelectContent className="bg-background">
                                <SelectGroup>
                                    {availableCategories.length > 0 ? (
                                    availableCategories.map((category: string) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                            className="focus:bg-input"
                                        >
                                            {category}
                                        </SelectItem>
                                    ))
                                    ) : (
                                    <p className="px-2 text-xs text-muted-foreground">
                                        Select a type first
                                    </p>
                                    )}
                                </SelectGroup>
                                </SelectContent>
                            </Select>

                            {fieldState.error && (
                                <p className="text-destructive text-xs mt-1">
                                {fieldState.error.message}
                                </p>
                            )}
                            </Field>
                        )}}
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
                    <Field>
                        <MultiFileUpload autoUpload={true} />
                    </Field>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        id="description"
                                        placeholder="Please tell more about your project."
                                        rows={6}
                                        className="min-h-24 resize-none"
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
            </form>
            <Field orientation="horizontal" className="mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()} className="rounded-full">
                    Find allocats
                </Button>
                <Button
                    type="submit"
                    form="new-project"
                    className="rounded-full text-background"
                >
                    Post project
                </Button>
            </Field>
        </>        
    );
}

export default NewProjectForm;
