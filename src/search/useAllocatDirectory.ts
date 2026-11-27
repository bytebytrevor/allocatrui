import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import type { AllocatProfile } from "@/Types/allocatProfile";

export type DirectorySort =
    "relevance" | "rating" | "experience" | "rate-low" | "recent";
export type DirectorySkill = {
    id: string;
    name: string;
    categoryId?: string;
    category?: string;
};
export type DirectoryAllocat = Omit<AllocatProfile, "skills"> & {
    skills?: DirectorySkill[];
    location?: string;
    city?: string;
    country?: string;
    isVerified?: boolean;
    verified?: boolean;
    rating?: number;
    averageRating?: number;
    joinedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};
export type DirectoryCriteria = {
    search: string;
    category: string;
    skillIds: string[];
    location: string;
    maxHourlyRate: number | null;
    minExperience: number;
    verifiedOnly: boolean;
    sortBy: DirectorySort;
};
export type DirectoryPage = {
    items: DirectoryAllocat[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};
export type DirectoryFilters = {
    skills: DirectorySkill[];
    maxHourlyRate: number;
};
const PAGE_SIZE = 24;
const DEBOUNCE_MS = 300;

export function directoryCriteriaKey(criteria: DirectoryCriteria) {
    return JSON.stringify({
        ...criteria,
        search: criteria.search.trim(),
        location: criteria.location.trim(),
        skillIds: [...new Set(criteria.skillIds)].sort(),
    });
}

export function directoryRequestUrl(key: string, page: number) {
    const criteria: DirectoryCriteria = JSON.parse(key);
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
        sortBy: criteria.sortBy,
        includeUnpriced: "true",
    });
    if (criteria.search) params.set("search", criteria.search);
    if (criteria.category) params.set("category", criteria.category);
    for (const id of criteria.skillIds) params.append("skillIds", id);
    if (criteria.location) params.set("location", criteria.location);
    if (criteria.maxHourlyRate !== null)
        params.set("maxHourlyRate", String(criteria.maxHourlyRate));
    if (criteria.minExperience > 0)
        params.set("minYearsExperience", String(criteria.minExperience));
    if (criteria.verifiedOnly) params.set("verifiedOnly", "true");
    return `/allocats/profiles?${params}`;
}

function validatePage(data: DirectoryPage, page: number): DirectoryPage {
    if (
        !data ||
        !Array.isArray(data.items) ||
        data.page !== page ||
        !Number.isInteger(data.pageSize) ||
        data.pageSize < 1 ||
        data.pageSize > 50 ||
        !Number.isInteger(data.totalCount) ||
        data.totalCount < 0 ||
        !Number.isInteger(data.totalPages) ||
        data.totalPages !== Math.ceil(data.totalCount / data.pageSize) ||
        data.items.length > data.pageSize ||
        data.items.some(
            (item) =>
                !item ||
                typeof item.allocatrUserId !== "string" ||
                !item.allocatrUserId,
        )
    ) {
        throw new Error("Invalid directory response.");
    }
    return data;
}

export function useAllocatDirectory(criteria: DirectoryCriteria) {
    const key = directoryCriteriaKey(criteria);
    const [debouncedKey, setDebouncedKey] = useState(key);
    const [cursor, setCursor] = useState({ key, page: 1 });
    const [retryVersion, setRetryVersion] = useState(0);
    const [result, setResult] = useState<DirectoryPage & { key: string }>({
        key: "",
        items: [],
        page: 0,
        pageSize: PAGE_SIZE,
        totalCount: 0,
        totalPages: 0,
    });
    const [status, setStatus] = useState<{
        id: string;
        loading: boolean;
        error: string | null;
    }>({ id: "", loading: true, error: null });
    const page = cursor.key === debouncedKey ? cursor.page : 1;
    const requestId = JSON.stringify([debouncedKey, page, retryVersion]);
    const waiting = key !== debouncedKey;

    useEffect(() => {
        // Reset even when returning to a previously used set of filters; its old
        // page cursor must not cause the new search to start halfway through.
        setCursor({ key, page: 1 });
    }, [key]);

    useEffect(() => {
        if (key === debouncedKey) return;
        const timer = window.setTimeout(
            () => setDebouncedKey(key),
            DEBOUNCE_MS,
        );
        return () => window.clearTimeout(timer);
    }, [key, debouncedKey]);

    useEffect(() => {
        // Including the raw key cancels an old request immediately, before debounce.
        if (key !== debouncedKey) return;
        const controller = new AbortController();
        let cancelled = false;
        setStatus({ id: requestId, loading: true, error: null });
        void api
            .get<DirectoryPage>(directoryRequestUrl(debouncedKey, page), {
                signal: controller.signal,
            })
            .then((response) => {
                if (cancelled) return;
                const data = validatePage(response.data, page);
                setResult((previous) => {
                    if (page === 1 || previous.key !== debouncedKey)
                        return { ...data, key: debouncedKey };
                    const unique = new Map(
                        previous.items.map((item) => [
                            item.allocatrUserId,
                            item,
                        ]),
                    );
                    for (const item of data.items)
                        unique.set(item.allocatrUserId, item);
                    return {
                        ...data,
                        key: debouncedKey,
                        items: [...unique.values()],
                    };
                });
                setStatus({ id: requestId, loading: false, error: null });
            })
            .catch(() => {
                if (!cancelled)
                    setStatus({
                        id: requestId,
                        loading: false,
                        error: "We could not load professionals right now. Please try again.",
                    });
            });
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [key, debouncedKey, page, retryVersion, requestId]);

    const current = result.key === key;
    const loading = waiting || status.id !== requestId || status.loading;
    const error = !waiting && status.id === requestId ? status.error : null;
    return {
        items: current ? result.items : [],
        totalCount: current ? result.totalCount : 0,
        page: current ? result.page : 0,
        totalPages: current ? result.totalPages : 0,
        hasLoaded: result.key !== "",
        loading,
        loadingMore: current && page > 1 && loading,
        error,
        hasNext: current && result.page < result.totalPages,
        loadMore() {
            if (
                !loading &&
                !error &&
                current &&
                result.page < result.totalPages
            )
                setCursor({ key, page: result.page + 1 });
        },
        retry() {
            setRetryVersion((version) => version + 1);
        },
    };
}

export function useAllocatDirectoryFilters() {
    const [filters, setFilters] = useState<DirectoryFilters>({
        skills: [],
        maxHourlyRate: 100,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryVersion, setRetryVersion] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;
        setLoading(true);
        setError(false);
        void api
            .get<DirectoryFilters>("/allocats/profiles/filters", {
                signal: controller.signal,
            })
            .then((response) => {
                if (cancelled) return;
                const data = response.data;
                if (
                    !Array.isArray(data?.skills) ||
                    typeof data.maxHourlyRate !== "number" ||
                    !Number.isFinite(data.maxHourlyRate) ||
                    data.maxHourlyRate < 0
                )
                    throw new Error("Invalid directory filters.");
                setFilters(data);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [retryVersion]);
    const skills = useMemo(
        () => [...filters.skills].sort((a, b) => a.name.localeCompare(b.name)),
        [filters.skills],
    );
    return {
        skills,
        rateCeiling: Math.ceil(Math.max(100, filters.maxHourlyRate) / 10) * 10,
        loading,
        error,
        retry: () => setRetryVersion((version) => version + 1),
    };
}
