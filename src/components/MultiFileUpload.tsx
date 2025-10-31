import { useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { FileAudio, FileIcon, FileImage, FileText, FileVideo, Icon, Plus, Trash, Upload, X } from "lucide-react";

type FileWithProgress = {
    id: string;
    file: File;
    progress: number;
    uploaded: boolean;
}

type UploadProps = {
    autoUpload: boolean
}

function MultiFileUpload({autoUpload}: UploadProps) {
    const [files, setFiles] = useState<FileWithProgress[]>([]);
    const [uploading, setUploading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) {
            return;
        }

        const newFiles = Array.from(e.target.files).map((file) => ({
            file,
            progress: 0,
            uploaded: false,
            id: file.name,
        }));

        setFiles([...files, ...newFiles]);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function handleUpload() {
        if (files.length === 0 || uploading) {
            return;
        }

        setUploading(true);

        const uploadPromises = files.map(async (fileWithProgress) => {
            const formData = new FormData();
            formData.append("file", fileWithProgress.file);

            try {
                await axios.post("https://httpbin.org/post", formData, {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                            
                        );
                        setFiles((prevFiles) =>
                            prevFiles.map((file) =>
                                file.id === fileWithProgress.id ? { ...file, progress }: file
                            )
                        );
                    }
                });

                setFiles((prevFiles) =>
                    prevFiles.map((file) =>
                        file.id === fileWithProgress.id ? { ...file, uploaded: true }: file
                    )
                );                
            } catch (error) {
                console.error(error);
            }
        });

        await Promise.all(uploadPromises);

        setUploading(false);
    }

    function removeFile(id: string) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    }

    function handleClear() {
        setFiles([]);
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">File upload</h2>
            <div className="flex gap-2">
                <FileInput
                    inputRef={inputRef}
                    disabled={uploading}
                    onFileSelect={handleFileSelect}
                />
                <ActionButtons
                    autoUpload={autoUpload}
                    disabled={files.length === 0 || uploading}
                    onUpload={handleUpload}
                    onClear={handleClear}
                />
            </div>
            <FileList files={files} onRemove={removeFile} uploading={uploading} />           
        </div>  
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
                className="flex cursor-pointer items-center gap-1 rounded-full bg-muted border text-foreground text-xs font-medium py-2 px-3 hover:opacity-90 disabled:bg-muted/50 disabled:text-foreground/50"
            >
                <Plus size={14} />
                Select files
            </label>
        </>
    )
}

type FileListProps = {
    files: FileWithProgress[];
    onRemove: (id: string) => void;
    uploading: boolean;
};

type ActionButtonProps = {
    disabled: boolean;
    autoUpload: boolean;
    onUpload: () => void;
    onClear: () => void;
};

function ActionButtons({ onUpload, onClear, disabled, autoUpload}: ActionButtonProps) {
    return (
        <>
            {
                (autoUpload == false) ?
                    <button
                        onClick={onUpload}
                        disabled={disabled}
                        className="flex items-center gap-1 cursor-pointer rounded-full bg-muted border text-foreground text-xs font-medium py-2 px-3 hover:opacity-90 disabled:bg-muted/50 disabled:text-foreground/50"
                    >
                        <Upload size={16} />
                        Upload
                    </button> : ""
            }
            <button
                onClick={onClear}
                className="flex items-center gap-1 cursor-pointer rounded-full bg-muted border text-foreground text-xs font-medium py-2 px-3 hover:opacity-90 disabled:bg-muted/50 disabled:text-foreground/50"
                disabled={disabled}
            >
                <Trash size={16} />
                Clear all
            </button>
        </>
    );
}

function FileList({files, onRemove, uploading}: FileListProps) {
    if (files.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            <h3 className="font-semibold">Files:</h3>
            <div>
                {files.map((file) => (
                    <FileItem
                        key={file.id}
                        file={file}
                        onRemove={onRemove}
                        uploading={uploading}
                    />
                ))}
            </div>
        </div>
    );
}

type FileItemProps = {
    file: FileWithProgress;
    onRemove: (id: string) => void;
    uploading: boolean;
};

function FileItem({file, onRemove, uploading}: FileItemProps) {
    const Icon = getFileIcon(file.file.type);

    return (
        <div className="my-1 rounded-md p-2">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Icon size={40} className="text-primary-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">{file.file.name}</span>
                        <div className="flex items-center gap-2 text-xs text-grayscale-400">
                            <span>{formatFileSize(file.file.size)}</span>
                            <span>•</span>
                            <span>{file.file.type || "Unknown type"}</span>
                        </div>
                    </div>
                </div>
                {!uploading && (
                    <button onClick={() => onRemove(file.id)} className="bg-none p-0">
                        <X size={16} className="text-forrground cursor-pointer" />
                    </button>
                )}
            </div>
            <div className="text-right text-xs">
                {file.uploaded ? "Completed" : `${Math.round(file.progress)}%`}
            </div>
            <ProgressBar progress={file.progress} />
        </div>
    );
}

type ProgressBarProps = {
    progress: number;
}

function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-grayscale-800">
            <div
                className="h-full bg-linear-to-t from-primary to-primary/50 transition-all duration-300"
                style={{ width: `${progress}%` }}
            >
            </div>
        </div>
    )
}

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return FileImage;
    if (mimeType.startsWith("video/")) return FileVideo;
    if (mimeType.startsWith("audio/")) return FileAudio;
    if (mimeType === "application/pdf") return FileText;
    return FileIcon;
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default MultiFileUpload;