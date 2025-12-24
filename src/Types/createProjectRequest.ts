import type { Priority } from "./enums";

export type CreateProjectRequest = {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  startDate?: string; // ISO
  dueDate?: string;   // ISO
  priority: Priority;
  isPublic: boolean;
  allowBids: boolean;
  budget: number;
  currency: string;
//   attachments: [];
};