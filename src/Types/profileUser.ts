export type ProfileUser = {
  id: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;

  // Compatibility display label returned by the API.
  location: string | null;

  // Account residence, separate from an Allocat's operating location.
  countryCode: string | null;
  countryName: string | null;
  cityName: string | null;

  avatarUrl: string | null;
  createdAt: string;
  emailConfirmed: boolean;
  isAllocat: boolean;
};
