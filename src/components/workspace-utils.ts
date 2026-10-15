import type { Task } from "@/Types/task";

export const WORKFLOW_STATUSES = ["pending", "active", "complete"] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];
export function normalizeStatus(value?: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}
export function isWorkflowStatus(value: unknown): value is WorkflowStatus {
  return (
    typeof value === "string" &&
    (WORKFLOW_STATUSES as readonly string[]).includes(value)
  );
}
export function getWorkflowStatus(task: Pick<Task, "status">): WorkflowStatus {
  const status = normalizeStatus(task.status);
  return status === "active"
    ? "active"
    : status === "complete" || status === "completed"
      ? "complete"
      : "pending";
}
export function isTaskOverdue(task: Task, now = Date.now()) {
  if (getWorkflowStatus(task) === "complete" || !task.dueDate) return false;
  const time = new Date(task.dueDate).getTime();
  return Number.isFinite(time) && time < now;
}
export function formatDate(value?: string | Date | null, includeYear = true) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    ...(includeYear ? { year: "numeric" as const } : {}),
  }).format(date);
}
export function formatStatus(value?: unknown) {
  const text = String(value ?? "").trim();
  return text
    ? text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Unknown";
}
export function projectCode(value?: string) {
  const text = value?.trim().replace(/^#/, "");
  if (!text) return "";
  return `#${text.length <= 10 ? text : text.toUpperCase().startsWith("PRJ-") ? text.slice(0, 9) : text.slice(0, 8)}`;
}
export function projectProgress(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : 0;
}
export function getAssignedName(task: Task) {
  if (!task.assignedToId) {
    return "Unassigned";
  }

  const assignedName = task.assignedToName?.trim();

  if (assignedName) {
    return assignedName;
  }

  if (task.assignedToId === task.createdByUserId) {
    const creatorName = task.createdByName?.trim();

    if (creatorName) {
      return creatorName;
    }
  }

  return "Assigned Allocat";
}
export function getTaskPriority(task: Task) {
  return String((task as Task & { priority?: string }).priority ?? "").trim();
}
export function initials(name?: string) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U"
  );
}
export const CLOSED_PROJECT_STATUSES = new Set([
  "complete",
  "completed",
  "closed",
  "cancelled",
  "canceled",
]);
