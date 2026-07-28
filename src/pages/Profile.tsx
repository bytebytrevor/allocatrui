// import api from "@/api/axios";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useAuth } from "@/auth/useAuth";

// export default function Profile() {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] ?? null;
//     setFile(selectedFile);

//     if (selectedFile) {
//       setPreview(URL.createObjectURL(selectedFile));
//     } else {
//       setPreview(null);
//     }
//   };

//   async function upload() {
//     if (!file) return;

//     setUploading(true);
//     setProgress(0);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await api.post("/profile/profile-picture", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//         onUploadProgress: (event) => {
//           if (!event.total) return;
//           const percent = Math.round((event.loaded * 100) / event.total);
//           setProgress(percent);
//         },
//       });

//       await refreshUser();
      
//       alert("Profile picture uploaded!");
//       setFile(null);
//       setPreview(null);
//     } catch (err) {
//       console.error(err);
//       alert(
//         "Upload failed. Make sure you are logged in and try again."
//       );
//     } finally {
//       setUploading(false);
//     }
//   }

//   const { refreshUser } = useAuth();
//   const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : null;

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-4 rounded-xl border shadow-sm">
//       <h2 className="text-xl font-semibold">Profile Picture</h2>

//       {/* Choose File Button */}
//       <div>
//         <input
//           id="fileInput"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileChange}
//           disabled={uploading}
//         />
//         <Button
//           className="w-full"
//           onClick={() => document.getElementById("fileInput")?.click()}
//         >
//           {file ? "Change File" : "Choose File"}
//         </Button>
//       </div>

//       {/* File Info & Preview */}
//       {file && (
//         <div className="space-y-2">
//           <p className="text-sm text-muted-foreground">
//             File size: <span className="font-medium">{fileSizeMB} MB</span>
//           </p>
//           {preview && (
//             <img
//               src={preview}
//               alt="Preview"
//               className="h-32 w-32 rounded-full object-cover border"
//             />
//           )}
//         </div>
//       )}

//       {/* Progress Bar */}
//       {uploading && (
//         <div className="space-y-1">
//           <div className="w-full h-2 bg-muted rounded">
//             <div
//               className="h-2 bg-primary rounded transition-all"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <p className="text-xs text-muted-foreground">{progress}%</p>
//         </div>
//       )}

//       {/* Upload Button */}
//       <Button
//         onClick={upload}
//         disabled={!file || uploading}
//         className="w-full"
//       >
//         {uploading ? "Uploading..." : "Upload"}
//       </Button>
//     </div>
//   );
// }




import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import DashboardMainNav from "@/components/DashboardMainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CameraIcon,
  CheckCircle2Icon,
  Clock3Icon,
  ImageIcon,
  LoaderCircleIcon,
  LockKeyholeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProfileUser = {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  emailConfirmed?: boolean;
};

type ProfileForm = {
  fullName: string;
  phoneNumber: string;
  location: string;
};

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(date?: string) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export default function Profile() {
  const { user, refreshUser } = useAuth();

  /*
   * This local type allows the page to work while your authentication
   * user model is still being expanded.
   */
  const profileUser = user as ProfileUser | null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [savingProfile, setSavingProfile] = useState(false);

  const [pictureMessage, setPictureMessage] =
    useState<MessageState>(null);

  const [profileMessage, setProfileMessage] =
    useState<MessageState>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: profileUser?.fullName ?? "",
    phoneNumber: profileUser?.phoneNumber ?? "",
    location: profileUser?.location ?? "",
  });

  useEffect(() => {
    setProfileForm({
      fullName: profileUser?.fullName ?? "",
      phoneNumber: profileUser?.phoneNumber ?? "",
      location: profileUser?.location ?? "",
    });
  }, [
    profileUser?.fullName,
    profileUser?.phoneNumber,
    profileUser?.location,
  ]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const displayedImage =
    preview ?? profileUser?.profilePictureUrl ?? undefined;

  const fileSize = useMemo(() => {
    if (!file) return null;

    return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
  }, [file]);

  const profileHasChanges =
    profileForm.fullName.trim() !==
      (profileUser?.fullName ?? "").trim() ||
    profileForm.phoneNumber.trim() !==
      (profileUser?.phoneNumber ?? "").trim() ||
    profileForm.location.trim() !==
      (profileUser?.location ?? "").trim();

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0] ?? null;

    setPictureMessage(null);

    if (!selectedFile) {
      clearSelectedFile();
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setPictureMessage({
        type: "error",
        text: "Choose a JPEG, PNG or WebP image.",
      });

      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setPictureMessage({
        type: "error",
        text: "The image must be smaller than 5 MB.",
      });

      event.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadProgress(0);
  }

  function clearSelectedFile() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadProfilePicture() {
    if (!file || uploading) return;

    setUploading(true);
    setUploadProgress(0);
    setPictureMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/profile/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (event) => {
          if (!event.total) return;

          const percent = Math.round(
            (event.loaded * 100) / event.total,
          );

          setUploadProgress(percent);
        },
      });

      await refreshUser();

      setPictureMessage({
        type: "success",
        text: "Your profile picture has been updated.",
      });

      clearSelectedFile();
    } catch (error) {
      console.error(error);

      setPictureMessage({
        type: "error",
        text: "The image could not be uploaded. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  function handleProfileFieldChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));

    setProfileMessage(null);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profileForm.fullName.trim()) {
      setProfileMessage({
        type: "error",
        text: "Enter your full name before saving.",
      });

      return;
    }

    setSavingProfile(true);
    setProfileMessage(null);

    try {
      await api.patch(
        "/profile",
        {
          fullName: profileForm.fullName.trim(),
          phoneNumber: profileForm.phoneNumber.trim() || null,
          location: profileForm.location.trim() || null,
        },
        {
          withCredentials: true,
        },
      );

      await refreshUser();

      setProfileMessage({
        type: "success",
        text: "Your profile details have been saved.",
      });
    } catch (error) {
      console.error(error);

      setProfileMessage({
        type: "error",
        text: "Your profile could not be saved. Please try again.",
      });
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-5 md:px-8">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container mx-auto px-5 py-8 sm:py-10 md:px-8 lg:py-12">
        {/* Page heading */}
        <section className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              Account settings
            </p>

            <h1 className="break-words text-3xl font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Your{" "}
              <span className="text-primary">profile.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Manage the personal details connected to your Allocatr
              account.
            </p>
          </div>

          <Badge
            variant="outline"
            className="h-9 w-fit rounded-full border-primary/20 bg-primary/10 px-4 text-primary shadow-none"
          >
            <UserRoundIcon size={14} />
            Client account
          </Badge>
        </section>

        <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* Left column */}
          <aside className="min-w-0 space-y-5">
            {/* Profile picture */}
            <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 text-card-foreground sm:p-7">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Profile picture
                </p>

                <div className="mt-6 flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl sm:h-36 sm:w-36">
                      <AvatarImage
                        src={displayedImage}
                        alt={
                          profileUser?.fullName
                            ? `${profileUser.fullName}'s profile`
                            : "User profile"
                        }
                        className="object-cover"
                      />

                      <AvatarFallback className="bg-primary/15 text-3xl font-black text-primary">
                        {getInitials(profileUser?.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className={[
                        "absolute bottom-1 right-1 flex h-11 w-11",
                        "items-center justify-center rounded-full",
                        "border-4 border-card bg-primary text-primary-foreground",
                        "transition-transform hover:scale-105",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                      ].join(" ")}
                      aria-label="Choose profile picture"
                    >
                      <CameraIcon size={18} />
                    </button>
                  </div>

                  <h2 className="mt-5 break-words text-xl font-black uppercase tracking-[-0.025em]">
                    {profileUser?.fullName || "Allocatr user"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {profileUser?.email || "No email available"}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  id="profile-picture"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />

                {file && (
                  <div className="mt-6 rounded-[1.25rem] border border-border bg-background/60 p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ImageIcon size={19} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {fileSize}
                        </p>
                      </div>

                      {!uploading && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-destructive"
                          onClick={clearSelectedFile}
                          aria-label="Remove selected image"
                        >
                          <Trash2Icon size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">
                        Uploading image
                      </span>

                      <span className="text-muted-foreground">
                        {uploadProgress}%
                      </span>
                    </div>

                    <Progress
                      value={uploadProgress}
                      className="h-2"
                    />
                  </div>
                )}

                {pictureMessage && (
                  <InlineMessage message={pictureMessage} />
                )}

                <div className="mt-6 grid gap-3">
                  <Button
                    type="button"
                    variant={file ? "outline" : "default"}
                    className="h-11 rounded-full shadow-none"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <CameraIcon size={16} />
                    {file ? "Choose another image" : "Choose image"}
                  </Button>

                  {file && (
                    <Button
                      type="button"
                      className="h-11 rounded-full shadow-none"
                      onClick={() => void uploadProfilePicture()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <LoaderCircleIcon
                            size={16}
                            className="animate-spin"
                          />
                          Uploading
                        </>
                      ) : (
                        <>
                          <SaveIcon size={16} />
                          Save profile picture
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <p className="mt-5 text-center text-xs leading-6 text-muted-foreground">
                  JPEG, PNG or WebP. Maximum size: 5 MB.
                </p>
              </div>
            </section>

            {/* Account trust card */}
            <section className="rounded-[1.75rem] border border-border bg-[#151515] p-6 text-white dark:bg-[#090909]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                <ShieldCheckIcon size={21} />
              </div>

              <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                Account security
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.025em]">
                Keep your information current.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/60">
                Accurate contact details make it easier to receive
                project updates and account notices.
              </p>
            </section>
          </aside>

          {/* Right column */}
          <div className="min-w-0 space-y-6">
            {/* Personal details */}
            <form
              onSubmit={saveProfile}
              className="rounded-[2rem] border border-border bg-card p-6 text-card-foreground sm:p-8"
            >
              <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                    Personal information
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                    Your details
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                    This information identifies you throughout your
                    workspace.
                  </p>
                </div>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserRoundIcon size={21} />
                </span>
              </div>

              <div className="mt-7 grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full name</Label>

                  <div className="relative">
                    <UserRoundIcon
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileFieldChange}
                      placeholder="Enter your full name"
                      className="h-12 rounded-xl bg-background pl-11"
                      disabled={savingProfile}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>

                  <div className="relative">
                    <MailIcon
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      id="email"
                      type="email"
                      value={profileUser?.email ?? ""}
                      className="h-12 rounded-xl bg-muted/50 pl-11 text-muted-foreground"
                      readOnly
                    />
                  </div>

                  <p className="text-xs leading-6 text-muted-foreground">
                    Your email address is managed through your account
                    settings.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">
                      Phone number
                    </Label>

                    <div className="relative">
                      <PhoneIcon
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={profileForm.phoneNumber}
                        onChange={handleProfileFieldChange}
                        placeholder="+263..."
                        className="h-12 rounded-xl bg-background pl-11"
                        disabled={savingProfile}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>

                    <div className="relative">
                      <MapPinIcon
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <Input
                        id="location"
                        name="location"
                        value={profileForm.location}
                        onChange={handleProfileFieldChange}
                        placeholder="City, country"
                        className="h-12 rounded-xl bg-background pl-11"
                        disabled={savingProfile}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {profileMessage && (
                <InlineMessage message={profileMessage} />
              )}

              <div className="mt-8 flex justify-end border-t border-border pt-6">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-full px-7 shadow-none sm:w-auto"
                  disabled={!profileHasChanges || savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <LoaderCircleIcon
                        size={16}
                        className="animate-spin"
                      />
                      Saving changes
                    </>
                  ) : (
                    <>
                      <SaveIcon size={16} />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Account details */}
            <section className="rounded-[2rem] border border-border bg-card p-6 text-card-foreground sm:p-8">
              <div className="flex items-start justify-between gap-5 border-b border-border pb-6">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Account information
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.03em]">
                    Account status
                  </h2>
                </div>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-700 dark:text-sky-300">
                  <BadgeCheckIcon size={21} />
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <AccountDetail
                  icon={MailIcon}
                  label="Email status"
                  value={
                    profileUser?.emailConfirmed === false
                      ? "Not verified"
                      : "Verified"
                  }
                  accent={
                    profileUser?.emailConfirmed === false
                      ? "bg-amber-400/10 text-amber-700 dark:text-amber-300"
                      : "bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
                  }
                />

                <AccountDetail
                  icon={Clock3Icon}
                  label="Member since"
                  value={formatDate(profileUser?.createdAt)}
                  accent="bg-sky-400/10 text-sky-700 dark:text-sky-300"
                />

                <AccountDetail
                  icon={UserRoundIcon}
                  label="Account type"
                  value="Client"
                  accent="bg-primary/10 text-primary"
                />

                <AccountDetail
                  icon={LockKeyholeIcon}
                  label="Profile visibility"
                  value="Private account"
                  accent="bg-violet-400/10 text-violet-700 dark:text-violet-300"
                />
              </div>
            </section>

            {/* Difference from Allocat profile */}
            <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 text-card-foreground sm:p-8">
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  <SparklesIcon size={23} />
                </span>

                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Your client profile
                  </p>

                  <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.025em] sm:text-2xl">
                    Separate from an Allocat profile
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    This page manages your standard user account.
                    Professional skills, experience, rates and work
                    availability belong in a separate Allocat profile.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function InlineMessage({
  message,
}: {
  message: Exclude<MessageState, null>;
}) {
  const success = message.type === "success";

  return (
    <div
      className={[
        "mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm",
        success
          ? "border-emerald-500/20 bg-emerald-400/10 text-emerald-800 dark:text-emerald-300"
          : "border-destructive/20 bg-destructive/10 text-destructive",
      ].join(" ")}
      role={success ? "status" : "alert"}
    >
      {success ? (
        <CheckCircle2Icon size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircleIcon size={18} className="mt-0.5 shrink-0" />
      )}

      <p className="leading-6">{message.text}</p>
    </div>
  );
}

type AccountDetailProps = {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  label: string;
  value: string;
  accent: string;
};

function AccountDetail({
  icon: Icon,
  label,
  value,
  accent,
}: AccountDetailProps) {
  return (
    <article className="flex items-start gap-4 rounded-[1.25rem] border border-border bg-background/50 p-4">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon size={18} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold">
          {value}
        </p>
      </div>
    </article>
  );
}