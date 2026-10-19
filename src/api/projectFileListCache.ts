import { isAxiosError } from "axios";
import type { ProjectFile, ProjectFilePage } from "@/Types/projectFile";
import {
  listProjectFiles,
  type FileKind,
  type FileSort,
} from "@/api/projectFiles";
export type FileListQuery = {
  projectId: string;
  taskId?: string;
  search?: string;
  source?: string;
  sort?: FileSort;
  kind?: FileKind;
};
export type FileListSnapshot = {
  items: ProjectFile[];
  page: number;
  totalCount: number;
  canUpload: boolean;
  updatedAt: number;
};
type Pending = {
  projectId: string;
  controller: AbortController;
  promise: Promise<FileListSnapshot>;
};
type Loader = (
  query: FileListQuery,
  page: number,
  signal: AbortSignal,
) => Promise<ProjectFilePage>;
function canceled(): Error {
  const error = new Error("File list request canceled.");
  error.name = "AbortError";
  return error;
}
export class ProjectFileListCache {
  private entries = new Map<
    string,
    {
      projectId: string;
      value: FileListSnapshot;
    }
  >();
  private pending = new Map<string, Pending>();
  private versions = new Map<string, number>();
  private user: string | null = null;
  private epoch = 0;
  private loader: Loader;
  private now: () => number;
  constructor(loader: Loader, now: () => number = Date.now) {
    this.loader = loader;
    this.now = now;
  }
  key(query: FileListQuery): string {
    return JSON.stringify([
      query.projectId,
      query.taskId || "",
      query.search?.trim() || "",
      query.source || "",
      query.sort || "newest",
      query.kind || "all",
    ]);
  }
  setUser(user: string | null) {
    if (user !== this.user) {
      this.clear();
      this.user = user;
    }
  }
  clear() {
    this.epoch++;
    for (const request of this.pending.values()) request.controller.abort();
    this.pending.clear();
    this.entries.clear();
    this.versions.clear();
  }
  invalidateProject(projectId: string) {
    this.versions.set(projectId, (this.versions.get(projectId) || 0) + 1);
    for (const [key, entry] of this.entries)
      if (entry.projectId === projectId) this.entries.delete(key);
    for (const [key, request] of this.pending)
      if (request.projectId === projectId) {
        request.controller.abort();
        this.pending.delete(key);
      }
  }
  isFresh(snapshot: FileListSnapshot): boolean {
    return this.now() - snapshot.updatedAt < 60000;
  }
  peek(user: string, query: FileListQuery): FileListSnapshot | undefined {
    if (!user || user !== this.user) return undefined;
    const key = this.key(query),
      entry = this.entries.get(key);
    if (!entry) return undefined;
    if (this.now() - entry.value.updatedAt >= 5 * 60000) {
      this.entries.delete(key);
      return undefined;
    }
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value;
  }
  private remember(key: string, projectId: string, value: FileListSnapshot) {
    // Keep metadata only; bounds also cover large paginated collections.
    this.entries.delete(key);
    if (value.items.length > 2000) return;
    this.entries.set(key, { projectId, value });
    let items = [...this.entries.values()].reduce(
      (sum, entry) => sum + entry.value.items.length,
      0,
    );
    while (this.entries.size > 40 || items > 5000) {
      const oldest = this.entries.keys().next().value;
      if (!oldest) break;
      items -= this.entries.get(oldest)!.value.items.length;
      this.entries.delete(oldest);
    }
  }
  read(
    user: string,
    query: FileListQuery,
    pages = 1,
    force = false,
  ): Promise<FileListSnapshot> {
    if (!user) return Promise.reject(canceled());
    this.setUser(user);
    const key = this.key(query),
      previous = this.peek(user, query);
    pages = Math.max(1, Math.floor(pages));
    if (!force && previous && this.isFresh(previous) && previous.page >= pages)
      return Promise.resolve(previous);
    const epoch = this.epoch,
      version = this.versions.get(query.projectId) || 0;
    const pending = this.pending.get(key);
    if (pending)
      return pending.promise.then((value) => {
        if (
          epoch !== this.epoch ||
          user !== this.user ||
          version !== (this.versions.get(query.projectId) || 0)
        )
          throw canceled();
        return value.page >= pages ? value : this.read(user, query, pages);
      });
    const controller = new AbortController();
    const request: Pending = {
      projectId: query.projectId,
      controller,
      promise: Promise.resolve({
        items: [],
        page: 0,
        totalCount: 0,
        canUpload: false,
        updatedAt: 0,
      }),
    };
    request.promise = (async () => {
      const append =
        !force &&
        previous &&
        this.isFresh(previous) &&
        pages === previous.page + 1;
      let value: FileListSnapshot;
      if (append) {
        const result = await this.loader(query, pages, controller.signal);
        const seen = new Set(previous.items.map((file) => file.id));
        value = {
          items: [
            ...previous.items,
            ...result.items.filter((file) => !seen.has(file.id)),
          ],
          page: result.page,
          totalCount: result.totalCount,
          canUpload: result.canUpload,
          updatedAt: previous.updatedAt,
        };
      } else {
        const first = await this.loader(query, 1, controller.signal);
        const maximum = Math.min(
          pages,
          Math.max(1, Math.ceil(first.totalCount / first.pageSize)),
        );
        const items = [...first.items];
        const seen = new Set(items.map((file) => file.id));
        let page = first.page;
        // Revalidate all previously loaded pages without mixing old/new sort positions.
        for (let next = 2; next <= maximum; next++) {
          const result = await this.loader(query, next, controller.signal);
          for (const file of result.items)
            if (!seen.has(file.id)) {
              items.push(file);
              seen.add(file.id);
            }
          page = result.page;
        }
        value = {
          items,
          page,
          totalCount: first.totalCount,
          canUpload: first.canUpload,
          updatedAt: this.now(),
        };
      }
      if (
        controller.signal.aborted ||
        epoch !== this.epoch ||
        version !== (this.versions.get(query.projectId) || 0)
      )
        throw canceled();
      this.remember(key, query.projectId, value);
      return value;
    })()
      .catch((error) => {
        if (
          epoch === this.epoch &&
          !controller.signal.aborted &&
          isAxiosError(error)
        ) {
          if (error.response?.status === 401) this.clear();
          else if (
            error.response?.status === 403 ||
            error.response?.status === 404
          )
            this.invalidateProject(query.projectId);
        }
        throw error;
      })
      .finally(() => {
        if (this.pending.get(key) === request) this.pending.delete(key);
      });
    this.pending.set(key, request);
    return request.promise;
  }
}
export const projectFileListCache = new ProjectFileListCache(
  (query, page, signal) => {
    const { projectId, ...filters } = query;
    return listProjectFiles(projectId, { ...filters, page, signal });
  },
);
