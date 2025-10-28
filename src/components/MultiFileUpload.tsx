import { useRef, useState, type ChangeEvent } from "react"
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

type FileWithProgress = {
    id: string;
    file: File;
    progress: number;
    uploaded: boolean;
}

function MultiFileUpload() {
    const [files, setFiles] = useState<FileWithProgress[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold">File upload</h2>
                <div className="flex gap-2">
                    <FileInput
                        inputRef={inputRef}
                        disabled={false}
                        onFileSelect={() => {}}
                    />
                </div>            
            </div>            
        </>
    )    
}

type FileInputProps = {
    inputRef: React.RefObject<HTMLInputElement | null>;
    disabled: boolean;
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FileInput({inputRef, disabled, onFileSelect}: FileInputProps) {
    return (
        <>
            <Input
                type="file"
                ref={inputRef}
                onChange={onFileSelect}
                multiple
                className="hidden"
                id="file-upload"
                disabled={disabled}
            />
            <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center gap-1 rounded-full bg-muted border text-foreground text-xs font-medium py-2 px-3 hover:opacity-90"
            >
                <Plus size={14} />
                Select files
            </label>
        </>
    )
}

export default MultiFileUpload;