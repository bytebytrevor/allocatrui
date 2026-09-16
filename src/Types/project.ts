// import type { Task } from "./task";

// export type Project = {
//     id: string; // GUID
//     projectCode: string;
//     title: string;
//     description: string;
//     category: string; // e.g., "plumbing", "babysitting", etc.
//     tags: string[];
//     createdAt: string;
//     updatedAt: string;
//     startDate?: string;
//     dueDate?: string;
//     completedAt?: string;
//     status: "pending" | "active" | "complete" | "cancelled" | "overdue";
//     progress?: number; // percentage 0-100
//     priority: "standard" | "high" | "urgent";
//     userId: string; // project owner
//     allocatAssignments: string[]; // optional team members
//     messagesCount?: number;
//     lastActivity?: string;
//     isPublic?: boolean;
//     allowBids?: boolean;
//     budget?: number;
//     currency?: string;
//     hasAcceptedAllocat: boolean;
//     attachments?: string[];
//     tasks: Task[]
// };

import type { Task } from "./task";

export type ProjectSkill = {
  id: string;
  name: string;
  categoryId: string;
  category: string;
};

export type Project = {
  id: string; // GUID
  projectCode: string;

  title: string;
  description: string;
  category: string;

  skills: ProjectSkill[];

  tags?: string[];

  createdAt: string;
  updatedAt?: string;

  startDate?: string;
  dueDate?: string;
  completedAt?: string;

  status:
    | "pending"
    | "active"
    | "complete"
    | "cancelled"
    | "overdue";

  progress?: number;

  priority:
    | "standard"
    | "high"
    | "urgent";

  userId?: string;

  allocatAssignments: string[];

  messagesCount?: number;
  lastActivity?: string;

  isPublic?: boolean;
  allowBids?: boolean;

  budget?: number;
  currency?: string;

  hasAcceptedAllocat: boolean;

  attachments?: string[];

  tasks?: Task[];
};