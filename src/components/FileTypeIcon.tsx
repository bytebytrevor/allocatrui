import { FileArchiveIcon, FileIcon, FileImageIcon, FileSpreadsheetIcon, FileTextIcon, FileType2Icon, FileVideoIcon, NotepadTextIcon, type LucideIcon, type LucideProps, } from "lucide-react";
import type { ProjectFile } from "@/Types/projectFile";
type FileMetadata = Pick<ProjectFile, "originalFileName" | "contentType">;
type FilePresentation = {
    icon: LucideIcon;
    label: string;
};
const formats: Record<string, FilePresentation> = {
    pdf: { icon: FileTextIcon, label: "PDF" },
    jpg: { icon: FileImageIcon, label: "JPG" },
    jpeg: { icon: FileImageIcon, label: "JPEG" },
    png: { icon: FileImageIcon, label: "PNG" },
    webp: { icon: FileImageIcon, label: "WEBP" },
    doc: { icon: FileType2Icon, label: "DOC" },
    docx: { icon: FileType2Icon, label: "DOCX" },
    xls: { icon: FileSpreadsheetIcon, label: "XLS" },
    xlsx: { icon: FileSpreadsheetIcon, label: "XLSX" },
    csv: { icon: FileSpreadsheetIcon, label: "CSV" },
    txt: { icon: NotepadTextIcon, label: "TXT" },
    mp4: { icon: FileVideoIcon, label: "MP4" },
    webm: { icon: FileVideoIcon, label: "WEBM" },
    zip: { icon: FileArchiveIcon, label: "ZIP" },
};
// Presentation only: preview and upload format validation remain separate.
export function getFilePresentation(file: FileMetadata): FilePresentation {
    const extension = file.originalFileName.includes(".") ? file.originalFileName.split(".").pop()?.toLowerCase() : "";
    if (extension && Object.prototype.hasOwnProperty.call(formats, extension))
        return formats[extension];
    const mime = file.contentType.split(";")[0].trim().toLowerCase();
    if (["image/jpeg", "image/png", "image/webp"].includes(mime))
        return { icon: FileImageIcon, label: "Image" };
    if (["video/mp4", "video/webm"].includes(mime))
        return { icon: FileVideoIcon, label: "Video" };
    if (mime === "application/pdf")
        return formats.pdf;
    if (["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(mime))
        return { icon: FileType2Icon, label: "Document" };
    if (["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/csv"].includes(mime))
        return { icon: FileSpreadsheetIcon, label: "Spreadsheet" };
    if (["application/zip", "application/x-zip-compressed"].includes(mime))
        return formats.zip;
    if (mime === "text/plain")
        return { icon: NotepadTextIcon, label: "Text" };
    return { icon: FileIcon, label: "File" };
}
export default function FileTypeIcon({ file, ...props }: LucideProps & {
    file: FileMetadata;
}) {
    const { icon: Icon } = getFilePresentation(file);
    return <Icon {...props}/>;
}
