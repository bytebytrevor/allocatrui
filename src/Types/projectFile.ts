export type ProjectFile = {
    id: string;
    projectId: string;
    originalFileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedByUserId: string;
    uploadedByName: string;
    createdAt: string;
    context: "project" | "task" | "comment";
    taskId: string | null;
    taskTitle: string | null;
    commentId: string | null;
    canDelete: boolean;
};
export type ProjectFilePage = {
    items: ProjectFile[];
    page: number;
    pageSize: number;
    totalCount: number;
    canUpload: boolean;
};
export type TaskDiscussionContext = {
    projectId: string;
    canUploadFiles: boolean;
    maxAttachments: number;
    maxFileSizeBytes: number;
};
