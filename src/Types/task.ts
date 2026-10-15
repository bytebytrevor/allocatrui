export type Task = {
  id: string;
  title: string;
  description?: string | null;

  status: "pending" | "active" | "complete" | "overdue";

  priority: "standard" | "low" | "medium" | "high" | "urgent";

  dueDate?: string | null;

  assignedToId?: string | null;
  assignedToName?: string | null;
  assignedToAvatarUrl?: string | null;

  createdByUserId: string;
  createdByName?: string | null;
};
