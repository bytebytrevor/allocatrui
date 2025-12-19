export type Project = {
    id: string; // GUID
    projectCode: string;
    title: string;
    description: string;
    type?: string; // e.g., "home service", "digital", etc.
    category: string; // e.g., "plumbing", "babysitting", etc.
    tags: [];
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    dueDate?: string;
    completedAt?: string;
    status: "pending" | "active" | "complete" | "cancelled" | "overdue";
    progress?: number; // percentage 0-100
    priority: "standard" | "high" | "urgent";
    userId: string; // project owner
    allocatIds: string[]; // optional team members
    tasksCount?: number;
    messagesCount?: number;
    lastActivity?: string;
    isPublic?: boolean;
    allowBids?: boolean;
    budget?: number;
    currency?: string;
    attachments?: string[];
    tasks: Task[]
};

export type Allocat = {
    id: string;
    fullName: string;
    title: string
    skills: string[],
    rating: number,
    completedProjects: number,
    available: boolean,
    verified: boolean,
    location: string,
    hourlyRate: number,
    currency: string,
    joinedAt: string
}

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

export type TaskComment = {
    id: string,
    createdAt: string,
    updatedAt: string,
    comment: string,
    createdBy: string,
    taskId: string
}