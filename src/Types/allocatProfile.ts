// import type { AllocatProjectSummary } from "./allocatProjectSummary";

// export type AllocatProfile = {
//   allocatrUserId: string;

//   fullName: string;
//   avatarUrl: string | null;

//   bio: string | null;
//   headline: string | null;
//   title: string | null;

//   skills: string[];

//   rating: number;
//   ratingCount: number;
//   completedProjects: number;

//   availability: boolean;
//   availabilityStatus: "available" | "busy" | "unavailable";

//   verified: boolean;

//   location: string | null;

//   hourlyRate: number | null;
//   currency: string;

//   responseTime: number | null;
//   level: number;

//   yearsExperience: number | null;
//   professionalScore: number;

//   joinedAt: string;

//   projects: AllocatProjectSummary[];
// };

export type AllocatAvailability =
  | "available"
  | "busy"
  | "unavailable";

export type AllocatSkill = {
  id: string;
  name: string;
};

export type AllocatProjectSummary = {
  id: string;
  projectCode: string;
  title: string;
  category: string;
  status: string;
};

export type AllocatProfile = {
  allocatrUserId: string;
  fullName: string;
  avatarUrl: string | null;

  bio: string | null;
  headline: string | null;
  title: string | null;

  skills: string[];

  rating: number;
  ratingCount: number;
  completedProjects: number;

  availability: boolean;
  availabilityStatus: AllocatAvailability;
  verified: boolean;

  location: string | null;

  hourlyRate: number | null;
  currency: string;

  responseTime: number | null;
  level: number;

  yearsExperience: number | null;
  professionalScore: number;

  joinedAt: string;

  projects: AllocatProjectSummary[];
};

export type MyAllocatProfile = Omit<
  AllocatProfile,
  "skills"
> & {
  email: string;
  idNumber: string | null;

  skills: AllocatSkill[];

  isVisible: boolean;

  createdAt: string;
  updatedAt: string;
};

export type SkillOption = {
  id: string;
  name: string;
  categoryId: string;
  category: string;
};

export type CreateAllocatProfilePayload = {
  idNumber: string;

  title: string | null;
  headline: string | null;
  bio: string | null;

  hourlyRate: number | null;
  currency: string;

  availability: AllocatAvailability;
  yearsExperience: number | null;

  skillIds: string[];
};

export type UpdateAllocatProfilePayload =
  CreateAllocatProfilePayload;