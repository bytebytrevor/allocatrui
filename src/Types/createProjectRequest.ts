// export type CreateProjectRequest = {
//   title: string;
//   description: string;
//   category: string;

//   skillIds: string[];

//   startDate: string;
//   dueDate: string;

//   priority: "standard" | "high" | "urgent";

//   isPublic: boolean;
//   allowBids: boolean;

//   budget: number;
//   currency: string;
// };

export type CreateProjectRequest = {
  title: string;
  description: string;
  category: string;
  skillIds: string[];
  startDate: string;
  dueDate: string;
  priority: "standard" | "high" | "urgent";
  isPublic: boolean;
  allowBids: boolean;
  budget: number;
  currency: string;
};