import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Project } from "@/Types";


type Props = {
  projects?: Project[];
  project?: Project;
  projectId?: string;
}

function ComboBox({projects, project, projectId}: Props) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(project?.title);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between rounded-full"
                >
                {value ?? "Select project..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 rounded-[6px]">
                <Command className="rounded-[6px] w-full">
                <CommandInput placeholder="Search job..." />
                <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                    {projects?.map((project) => (
                        <CommandItem
                        key={project.title}
                        value={project.title}
                        onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                        }}
                        >
                        <CheckIcon
                            className={cn(
                            "mr-2 h-4 w-4",
                            value === project.title ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {project.title}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default ComboBox;