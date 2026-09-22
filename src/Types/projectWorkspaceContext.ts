import type { Project } from "@/Types/project";

export type ProjectWorkspaceContext = {
  projects: Project[];
  currentProject: Project;
  projectId: string;
  isAllocat: boolean;
};