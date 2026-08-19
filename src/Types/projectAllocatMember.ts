import type { ProjectAllocatStatus } from "@/Types/enums";

export type ProjectAllocatMember = {
  allocatProfileId: string;
  fullName: string;
  avatarUrl?: string;
  title?: string;

  status: ProjectAllocatStatus;

  invitedAt: string;
  respondedAt: string | null;
};