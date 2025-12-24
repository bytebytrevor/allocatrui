export type Task = {
    id: string,
    title: string,
    description?: string,
    status: "pending" | "active" | "complete" | "overdue";
    priority?: "low" | "medium" | "high" | "urgent",
    order: number,
    createdAt: string,
    dueDate?: string,
    UpdatedAt: string,
    completedAt: string,
    comments: Comment[],
    createdByUserId: string,
    projectId: string,
}