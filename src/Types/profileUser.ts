export type ProfileUser = {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  location: string | null;
  avatarUrl: string | null;
  createdAt: string;
  emailConfirmed: boolean;
  isAllocat: boolean;
};