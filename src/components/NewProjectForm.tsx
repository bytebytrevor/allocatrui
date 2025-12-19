import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Input } from "./ui/input";
import { projectTypes } from "@/data/projectTypes";
import { projects } from "@/data/projects";
import type { Project } from "@/Types";
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

const formSchema = z.object({
    // Required fields
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
    tags: z
        .string()
        .nonempty("Please add tags"),
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
        .string()
        .nonempty("Please select priority"),   
    
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

    function OnSubmit() {
        const newProject: Project =  {
            id: String(Math.round(Math.random() * 100000)),
            projectCode: "",
            title: form.getValues("title"),
            description: form.getValues("description"),
            type: form.getValues("type"),
            category: form.getValues("category"),
            tags: form.getValues("tags"),
            createdAt: new Date().toLocaleDateString(),
            updatedAt: new Date().toLocaleDateString(),
            startDate: form.getValues("startDate")?.toLocaleDateString(),
            dueDate: form.getValues("endDate")?.toLocaleDateString(),
            completedAt: "",
            status: "pending",
            progress: 12,
            // priority: form.getValues("priority"),
            priority: "standard",
            userId: "",
            allocatIds: [],
            tasksCount: 0,
            messagesCount: 0,
            lastActivity: new Date().toLocaleDateString(),
            isPublic: false,
            allowBids: false,
            budget: Number(form.getValues("budget")),
            currency: "USD",
            attachments: [],
            tasks: [],
        }

        console.log(newProject);
        projects.push(newProject);

        console.log("Submitted");
        toast.success("Project has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          position: "top-center",
          style: { color: "#303030"}          
        });
        
        if (projects.findIndex(project => project.id === newProject.id)) {
            return navigate(`/projects/${newProject.id}/allocats/find`);
        }
    }

    const selectedType = form.watch("type") as keyof typeof projectTypes;
    
    return (
        <>
        <Toaster />
            <form
                id="new-project"
                onSubmit={form.handleSubmit(OnSubmit)}
                className="flex gap-8"
            >
                <FieldGroup>
                    <Controller
                        name="title"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="title" className="text-muted-foreground font-semibold">Title</FieldLabel>
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
                        name="type"
                        control={form.control}
                        render={({field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="type" className="text-muted-foreground font-semibold">Type</FieldLabel>
                                <Select
                                    name="type"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >                                 
                                    <SelectTrigger
                                        name="type"
                                        id="type"
                                        className={cn(
                                            "w-full  bg-input border-none transition-colors duration-300 rounded-full",
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
                            <FieldLabel htmlFor="category" className="text-muted-foreground font-semibold">Category</FieldLabel>

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
                                    "w-full  bg-input border-none transition-colors duration-300",
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
                    <Controller
                        name="tags"
                        control={form.control}
                        render={({field}) => (
                            <span className="flex items-center">
                            <Input
                                name="tags"
                                id="tags"
                                placeholder="Add tags. e.g. Capenter, Repair, Tutor, Nanny"
                                className="rounded-none rounded-l-full"
                            />
                            <Button className="w-36 rounded-none rounded-r-full">Add</Button>
                            </span>
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
                    <Field>
                        <FieldLabel htmlFor="priority-field" className="text-muted-foreground font-semibold">Priority</FieldLabel>
                        <div id="priority-field" className="flex gap-4">
                            <span className="flex items-center gap-2">
                                <input type="radio" name="priority" id="standard" value="standard" defaultChecked />
                                <FieldLabel htmlFor="standard">Standard</FieldLabel>
                            </span>           
                            <span className="flex items-center gap-2">
                                <input type="radio" name="priority" id="high" value="high"/>
                                <FieldLabel htmlFor="high">High</FieldLabel>
                            </span>
                            <span className="flex items-center gap-2">
                                <input type="radio" name="priority" id="urgent" value="urgent" />
                                <FieldLabel htmlFor="urgent">Urgent</FieldLabel>
                            </span>                            
                        </div>
                    </Field>
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
                                <FieldLabel htmlFor="description" className="text-muted-foreground font-semibold">Description</FieldLabel>
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
            </form>
            <Field orientation="horizontal" className="flex items-center justify-between pt-4 mt-8">
                <Button type="button" variant="link" onClick={() => form.reset()} className="text-foreground ">
                    Reset
                </Button>
                <span className="flex items-center gap-4">
                <Button
                    type="submit"
                    form="new-project"
                    variant="outline"
                    className=""
                >
                    Find allocats
                </Button>
                <Button
                    type="submit"
                    form="new-project"
                    className=" text-background"
                >
                    Post project
                </Button>
                </span>
            </Field>
        </>        
    );
}

export default NewProjectForm;
