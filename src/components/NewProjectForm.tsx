import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
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

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Project title must be at least 5 characters.")
        .max(32, "Project title must be at most 32 characters."),
    type: z
        .string()
        .nonempty("Please select a type."),
    category: z
        .string()
        .nonempty("Please select a category"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(500, "Description must be at most 1000 characters")
});


function NewProjectForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            type: "",
            description:"",
        },
    });

    function OnSubmit(data: z.infer<typeof formSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify(data, null, 2)}</code>

                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius) + 4px",
            } as React.CSSProperties,
        });
    }

    const selectedType: string = form.watch("type");

    return (
        <form id="new-project" onSubmit={form.handleSubmit(OnSubmit)}>
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="project-title">Title</FieldLabel>
                            <Input
                                {...field}
                                id="project-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="Car Window Repair"
                                autoComplete="off"
                                className="rounded-full border-none dark:bg-input"
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
                                onValueChange={field.onChange}
                                value={field.value}
                            >                                 
                                <SelectTrigger
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
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedType} // disable until type is chosen
                        >
                            <SelectTrigger
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
                                    <SelectItem key={category} value={category}>
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
                    )
                    }}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Description</FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="description"
                                    placeholder="Please tell more about your project."
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    arai-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length}/1000 characters
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
    );
}

export default NewProjectForm;
