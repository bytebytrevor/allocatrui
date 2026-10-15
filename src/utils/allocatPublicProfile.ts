import type { AllocatProfile } from "@/Types/allocatProfile";
export type PublicProfileSkill = string | {
    id?: string;
    name: string;
    categoryId?: string;
    category?: string;
};
export type PublicAllocatProfile = Omit<AllocatProfile, "skills"> & {
    skills: PublicProfileSkill[];
    isVerified?: boolean;
    averageRating?: number;
};
/** Connect this to the existing public-profile endpoint, not /me. */
export type AllocatPublicProfileLoader = (allocatId: string, options: {
    signal: AbortSignal;
}) => Promise<PublicAllocatProfile>;
export function getAllocatProfilePath(allocatId: string, projectId?: string) {
    const path = "/allocats/" + encodeURIComponent(allocatId.trim());
    return projectId ? path + "?projectId=" + encodeURIComponent(projectId) : path;
}
export function getPublicSkills(skills?: PublicProfileSkill[] | null) {
    const unique = new Map<string, {
        id: string;
        name: string;
    }>();
    for (const skill of Array.isArray(skills) ? skills : []) {
        const name = (typeof skill === "string" ? skill : skill?.name)?.trim();
        if (!name)
            continue;
        const key = name.toLocaleLowerCase();
        if (!unique.has(key))
            unique.set(key, { id: key, name });
    }
    return Array.from(unique.values());
}
export function getProfileInitials(name?: string | null) {
    return name?.trim().split(/\s+/).slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase()).join("") || "A";
}
export function getAvailability(status?: string | null, available?: boolean) {
    const value = status?.trim().toLowerCase();
    if (value === "available" || (!value && available === true)) {
        return { label: "Available for work", shortLabel: "Available", dot: "bg-status-complete", text: "text-status-complete-foreground" };
    }
    if (value === "busy") {
        return { label: "Currently busy", shortLabel: "Busy", dot: "bg-status-pending", text: "text-status-pending-foreground" };
    }
    return { label: "Currently unavailable", shortLabel: "Unavailable", dot: "bg-muted-foreground/60", text: "text-muted-foreground" };
}
export function formatHourlyRate(rate?: number | null, currency?: string | null) {
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate < 0)
        return null;
    const code = currency?.trim().toUpperCase();
    if (!code || !/^[A-Z]{3}$/.test(code))
        return null;
    try {
        return new Intl.NumberFormat("en", {
            style: "currency", currency: code, currencyDisplay: "code",
            minimumFractionDigits: 0, maximumFractionDigits: 2,
        }).format(rate);
    }
    catch {
        return null;
    }
}
export function formatMemberSince(value?: string | null) {
    if (!value)
        return null;
    const date = new Date(value);
    return Number.isFinite(date.getTime())
        ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date)
        : null;
}
export function normalizeProfileStatus(value?: string | null) {
    return String(value ?? "").trim().toLowerCase().replace(/[\s_-]/g, "");
}
export function isCompletedPublicProject(status?: string | null) {
    return ["complete", "completed", "closed"].includes(normalizeProfileStatus(status));
}
export function nonNegativeCount(value?: number | null) {
    return typeof value === "number" && Number.isFinite(value)
        ? Math.max(0, Math.floor(value)) : 0;
}
