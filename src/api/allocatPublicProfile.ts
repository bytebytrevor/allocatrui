import api from "@/api/axios";

import type { AllocatProfile } from "@/Types/allocatProfile";
import type { AllocatPublicProfileLoader } from "@/utils/allocatPublicProfile";

export class PublicAllocatProfileRequestError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`The public profile request failed with status ${status}.`);

    this.name = "PublicAllocatProfileRequestError";
    this.status = status;
  }
}

/**
 * GET /api/allocats/profiles/{allocatUserId}
 *
 * Uses the anonymous public-profile endpoint.
 * Reuses the configured API base URL without running authenticated
 * Axios interceptors or sending session credentials.
 */
export const getPublicAllocatProfile: AllocatPublicProfileLoader = async (
  allocatId,
  { signal },
) => {
  const id = allocatId.trim();

  // The public endpoint expects a GUID, never "me".
  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (!isValidId) {
    throw new PublicAllocatProfileRequestError(404);
  }

  const baseUrl = api.defaults.baseURL?.trim().replace(/\/+$/, "") || "/api";

  const response = await fetch(
    `${baseUrl}/allocats/profiles/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "omit",
      signal,
    },
  );

  if (!response.ok) {
    throw new PublicAllocatProfileRequestError(response.status);
  }

  return (await response.json()) as AllocatProfile;
};
