import type { ProjectFile } from "@/Types/projectFile";
import { getOptimizedThumbnail } from "@/api/projectFiles";
type ThumbnailFile = Pick<ProjectFile, "id" | "projectId">;
type Entry = {
  url: string;
  size: number;
  expires: number;
};
type Pending = {
  controller: AbortController;
  promise: Promise<string>;
};
// Kept in memory only: nothing persists private media in localStorage/IndexedDB.
export class ThumbnailCache {
  private entries = new Map<string, Entry>();
  private pending = new Map<string, Pending>();
  private failures = new Map<string, number>();
  private user: string | null = null;
  private epoch = 0;
  private bytes = 0;
  private active = 0;
  private waiting: (() => void)[] = [];
  private loader: (file: ThumbnailFile, signal: AbortSignal) => Promise<Blob>;
  private now: () => number;
  constructor(
    loader: (file: ThumbnailFile, signal: AbortSignal) => Promise<Blob>,
    now: () => number = Date.now,
  ) {
    this.loader = loader;
    this.now = now;
  }
  setUser(user: string | null) {
    if (user !== this.user) {
      this.clear();
      this.user = user;
    }
  }
  clear() {
    this.epoch++;
    for (const entry of this.entries.values()) URL.revokeObjectURL(entry.url);
    for (const request of this.pending.values()) request.controller.abort();
    this.entries.clear();
    this.pending.clear();
    this.failures.clear();
    this.bytes = 0;
  }
  private drop(key: string) {
    const entry = this.entries.get(key);
    if (entry) {
      URL.revokeObjectURL(entry.url);
      this.bytes -= entry.size;
      this.entries.delete(key);
    }
  }
  invalidate(projectId: string, fileId: string) {
    const key = `${projectId}/${fileId}`;
    this.drop(key);
    this.failures.delete(key);
    this.pending.get(key)?.controller.abort();
    this.pending.delete(key);
  }
  private runLoader(file: ThumbnailFile, signal: AbortSignal): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const start = () => {
        if (signal.aborted) {
          reject(new Error("Thumbnail request canceled."));
          this.drain();
          return;
        }
        this.active++;
        try {
          this.loader(file, signal)
            .then(resolve, reject)
            .finally(() => {
              this.active--;
              this.drain();
            });
        } catch (error) {
          this.active--;
          reject(error);
          this.drain();
        }
      };
      if (this.active < 4) start();
      else this.waiting.push(start);
    });
  }
  private drain() {
    while (this.active < 4 && this.waiting.length) this.waiting.shift()?.();
  }
  get(user: string, file: ThumbnailFile): Promise<string> {
    this.setUser(user);
    const key = `${file.projectId}/${file.id}`;
    const cached = this.entries.get(key);
    if (cached && cached.expires > this.now()) {
      this.entries.delete(key);
      this.entries.set(key, cached);
      return Promise.resolve(cached.url);
    }
    if (cached) this.drop(key);
    const previous = this.pending.get(key);
    if (previous) return previous.promise;
    if ((this.failures.get(key) || 0) > this.now())
      return Promise.reject(new Error("Thumbnail temporarily unavailable."));
    this.failures.delete(key);
    const epoch = this.epoch;
    const controller = new AbortController();
    const request: Pending = { controller, promise: Promise.resolve("") };
    request.promise = this.runLoader(file, controller.signal)
      .then((blob) => {
        if (epoch !== this.epoch || controller.signal.aborted)
          throw new Error("Thumbnail request canceled.");
        if (
          !blob.size ||
          blob.size > 256 * 1024 ||
          blob.type.split(";")[0] !== "image/jpeg"
        )
          throw new Error("Invalid thumbnail response.");
        const url = URL.createObjectURL(blob);
        this.entries.set(key, {
          url,
          size: blob.size,
          expires: this.now() + 4 * 60 * 1000,
        });
        this.bytes += blob.size;
        while (this.entries.size > 80 || this.bytes > 12 * 1024 * 1024) {
          const oldest = this.entries.keys().next().value;
          if (!oldest) break;
          this.drop(oldest);
        }
        return url;
      })
      .catch((error) => {
        if (epoch === this.epoch && !controller.signal.aborted) {
          this.failures.set(key, this.now() + 30000);
          while (this.failures.size > 200) {
            const oldest = this.failures.keys().next().value;
            if (!oldest) break;
            this.failures.delete(oldest);
          }
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
export const thumbnailCache = new ThumbnailCache(getOptimizedThumbnail);
