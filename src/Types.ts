export type Task = {
    id: string;
    title: string;
    description: string; 
    status: "pending" | "active" | "completed" | "cancelled" | "overdue";
    createdAt: string;
    updatedAt?: string;
    startDate?: string;
    dueDate: string;
    completedAt?: string;
    projectId: string;
    allocatId?: string;
    assignedById?: string;
    attachments?: string[];
    priority?: "low" | "medium" | "high" | "urgent";
    isPublic: boolean;

}

export type Project = {
    id: string; // GUID
    projectCode: string;
    title: string;
    description: string;
    type?: string; // e.g., "home service", "digital", etc.
    category: string; // e.g., "plumbing", "babysitting", etc.
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    dueDate?: string;
    completedAt?: string;
    status: "pending" | "active" | "completed" | "cancelled" | "overdue";
    progress?: number; // percentage 0-100
    priority?: "low" | "medium" | "high" | "urgent";
    userId: string; // project owner
    allocatId?: string; // assigned Allocatr (worker)
    teamIds?: string[]; // optional team members
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