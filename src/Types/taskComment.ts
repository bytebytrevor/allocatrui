export type TaskComment = {
  id: string;
  createdAt: string;
  updatedAt?: string | null;

  comment: string;

  createdById: string;
  createdByName: string;
  avatarUrl?: string | null;

  taskItemId: string;
};