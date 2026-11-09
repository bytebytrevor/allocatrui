export type User = {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  isAllocat: boolean;
  emailConfirmed: boolean;
  // First-time professional profile creation, not the account's 100% badge.
  hasAllocatProfile: boolean;
};
