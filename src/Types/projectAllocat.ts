import type { ProjectAllocatStatus } from "./enums";

export type ProjectAllocat = {
  projectId: string;
  allocatProfileId: string;
  status: ProjectAllocatStatus;
  invitedAt: string;
  respondedAt: string | null;
  removedAt: string | null;
};