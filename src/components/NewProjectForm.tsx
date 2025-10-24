import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
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
    InputGroupTextarea
} from "@/components/ui/input-group"

const formSchema = z.object({
    title: z
        .string()
        .min(5, "Project title must be at least 5 characters.")
        .max(32, "Project title must be at most 32 characters."),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(500, "Description must be at most 500 characters")
});


function NewProjectForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
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
                {/* <Controller
                
                /> */}
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
