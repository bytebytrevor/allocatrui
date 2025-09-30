export type Task = {
    id: number;
    title: string;
    status: "complete" | "active" | "overdue";
}