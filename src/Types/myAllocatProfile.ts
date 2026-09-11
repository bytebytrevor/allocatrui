import type { AllocatProfile } from "./allocatProfile";

export type MyAllocatProfile = AllocatProfile & {
  email: string;
  idNumber: string | null;

  isVisible: boolean;

  createdAt: string;
  updatedAt: string;
};