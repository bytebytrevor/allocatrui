import DashboardMainNav from "@/components/DashboardMainNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  CircleDollarSignIcon,
  SparklesIcon,
  StarIcon,
  UserRoundCheckIcon,
  WandSparklesIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
  BriefcaseIcon,
  UploadCloudIcon,
  FileTextIcon,
  XIcon,
  ShieldCheckIcon,
  GraduationCapIcon
} from "lucide-react";
import { useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";


function CreateAllocatProfile() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [hourlyRate, setHourlyRate] = useState(22);
  const [yearsExperience, setYearsExperience] = useState(3);
  const [bio, setBio] = useState("");

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [credentialFiles, setCredentialFiles] = useState<File[]>([]);

  const navigate = useNavigate();

  function addSkill() {
    const value = skillInput.trim();
    if (!value || skills.includes(value)) return;

    setSkills(prev => [...prev, value]);
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills(prev => prev.filter(s => s !== skill));
  }

  function removeCredentialFile(fileName: string) {
    setCredentialFiles(prev => prev.filter(file => file.name !== fileName));
  }

  function formatFileSize(size: number) {
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getExperienceLevel(years: number) {
    if (years <= 2) return "Emerging professional";
    if (years <= 5) return "Skilled professional";
    if (years <= 10) return "Senior professional";
    return "Specialist";
  }

  function getRateLabel(rate: number) {
    if (rate < 15) return "Entry-friendly";
    if (rate < 35) return "Competitive";
    if (rate < 75) return "Premium";
    return "Specialist rate";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = new FormData()
    
    data.append("idNumber", String(formData.get("idNumber")));
    data.append("hourlyRate", hourlyRate.toString());
    data.append("yearsExperience", yearsExperience.toString());
    data.append("bio", bio)

    skills.forEach(skill => data.append("skills", skill));

    if (idDocument) {
        data.append("idDocument", idDocument)
    }

    credentialFiles.forEach(file =>
        data.append("credentialFiles", file)
    );

    try {
        const response = await api.post(
            "allocats/profiles/create",
            data,
            {withCredentials: true}            
        );
        console.log("Allocat profile payload:", response);

        navigate("/allocats/profile")
    } catch (err) {
        console.error(err);
    }    
  }

  const completionItems = [
    { label: "Upload ID document", done: Boolean(idDocument) },
    { label: "Set hourly rate", done: hourlyRate > 0 },
    { label: "Set experience level", done: yearsExperience >= 0 },
    { label: "Add 3+ skills", done: skills.length >= 3 },
    { label: "Upload credentials", done: credentialFiles.length > 0 },
    { label: "Write your bio", done: bio.trim().length > 0 }
  ];

  const completed = completionItems.filter(item => item.done).length;
  const completion = Math.round((completed / completionItems.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
        <div className="container mx-auto px-4">
          <DashboardMainNav />
        </div>
      </header>

      <main className="container px-4 mx-auto py-8">
        <section className="py-8 mb-8">
          <Badge className="bg-primary/10 text-primary border border-primary/20 mb-4 shadow-none">
            <SparklesIcon size={14} />
            Become an Allocat
          </Badge>

          <div className="flex flex-col gap-3 max-w-2xl">
            <h1 className="text-4xl font-black tracking-tight">
              Create your <span className="text-primary">Allocat</span> profile
            </h1>
            <p className="text-sm text-muted-foreground leading-6">
              Build a profile that shows clients what you do, what you’re worth, and why you’re the right expert for their project.
            </p>
          </div>
        </section>

        <section className="flex items-start gap-8 justify-between w-full">
          <section className="w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <article className="rounded-xl border bg-background p-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <h2 className="font-bold flex items-center gap-2">
                      <UserRoundCheckIcon size={18} />
                      About you
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Start with your identity, experience, and pricing.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="idNumber">ID number</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        placeholder="00000000A00"
                        className="shadow-none"
                        required
                      />
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {idDocument ? (
                              <ShieldCheckIcon size={18} />
                            ) : (
                              <UploadCloudIcon size={18} />
                            )}
                          </span>

                          <div>
                            <p className="text-sm font-bold">
                              {idDocument ? "Identity document ready" : "Verify your identity"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Upload your ID, passport, or driver’s licence.
                            </p>
                          </div>
                        </div>

                        <Label htmlFor="idDocument">
                          <span className="inline-flex cursor-pointer items-center rounded-md border bg-background px-4 py-2 text-xs font-medium hover:bg-muted">
                            {idDocument ? "Replace file" : "Choose file"}
                          </span>
                        </Label>
                      </div>

                      <Input
                        id="idDocument"
                        name="idDocument"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) setIdDocument(file);
                        }}
                      />

                      {idDocument && (
                        <div className="mt-4 flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs">
                          <span className="flex items-center gap-2 truncate">
                            <FileTextIcon size={14} />
                            <span className="truncate">{idDocument.name}</span>
                            <span className="text-muted-foreground">
                              {formatFileSize(idDocument.size)}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setIdDocument(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border bg-muted/30 p-5">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <Label htmlFor="yearsExperience">Professional journey</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            How long have you been doing this professionally?
                          </p>
                        </div>
                        <BriefcaseIcon size={20} className="text-primary" />
                      </div>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-4xl font-black">{yearsExperience}</p>
                          <p className="text-xs text-muted-foreground">
                            {yearsExperience === 1 ? "year experience" : "years experience"}
                          </p>
                        </div>
                        <Badge variant="outline" className="shadow-none">
                          {getExperienceLevel(yearsExperience)}
                        </Badge>
                      </div>

                      <input
                        id="yearsExperience"
                        name="yearsExperience"
                        type="range"
                        min="0"
                        max="20"
                        value={yearsExperience}
                        onChange={e => setYearsExperience(Number(e.target.value))}
                        className="w-full accent-primary"
                      />

                      <div className="flex justify-between text-[0.65rem] text-muted-foreground mt-2">
                        <span>New</span>
                        <span>5 yrs</span>
                        <span>10 yrs</span>
                        <span>20+ yrs</span>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-5">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <Label htmlFor="hourlyRate">Your rate</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Set the hourly rate clients will see first.
                          </p>
                        </div>
                        <CircleDollarSignIcon size={20} className="text-primary" />
                      </div>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-4xl font-black">${hourlyRate}</p>
                          <p className="text-xs text-muted-foreground">per hour</p>
                        </div>
                        <Badge variant="outline" className="shadow-none">
                          {getRateLabel(hourlyRate)}
                        </Badge>
                      </div>

                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="range"
                        min="5"
                        max="150"
                        step="1"
                        value={hourlyRate}
                        onChange={e => setHourlyRate(Number(e.target.value))}
                        className="w-full accent-primary"
                      />

                      <div className="flex justify-between text-[0.65rem] text-muted-foreground mt-2">
                        <span>$5</span>
                        <span>$35</span>
                        <span>$75</span>
                        <span>$150+</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-primary/5 border-primary/20 p-4 flex gap-3">
                    <TrendingUpIcon className="text-primary shrink-0" size={18} />
                    <p className="text-xs text-muted-foreground leading-5">
                      Your profile will show you as a{" "}
                      <span className="text-foreground font-semibold">
                        {getExperienceLevel(yearsExperience)}
                      </span>{" "}
                      charging{" "}
                      <span className="text-foreground font-semibold">
                        ${hourlyRate}/hr
                      </span>. You can update this later.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border bg-background p-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <h2 className="font-bold flex items-center gap-2">
                      <BriefcaseBusinessIcon size={18} />
                      Your skills
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add the skills clients should match you with.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="skill">Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skill"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="React, .NET, Copywriting..."
                        className="shadow-none"
                      />
                      <Button type="button" onClick={addSkill} className="px-8 shadow-none">
                        Add
                      </Button>
                    </div>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="inline-flex items-center gap-2 rounded-full border bg-primary/5 text-primary px-3 py-1 text-xs font-medium hover:bg-primary/10 transition-colors shadow-none"
                          >
                            {skill} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <GraduationCapIcon size={18} />
                        </span>

                        <div>
                          <p className="text-sm font-bold">Training & credentials</p>
                          <p className="text-xs text-muted-foreground">
                            Add certificates, degrees, or course documents.
                          </p>
                        </div>
                      </div>

                      <Label htmlFor="credentialFiles">
                        <span className="inline-flex cursor-pointer items-center rounded-md border bg-background px-4 py-2 text-xs font-medium hover:bg-muted">
                          Add files
                        </span>
                      </Label>
                    </div>

                    <Input
                      id="credentialFiles"
                      name="credentialFiles"
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={e => {
                        const files = Array.from(e.target.files ?? []);
                        setCredentialFiles(prev => [...prev, ...files]);
                      }}
                    />

                    {credentialFiles.length > 0 ? (
                      <div className="mt-4 grid gap-2">
                        {credentialFiles.map(file => (
                          <div
                            key={`${file.name}-${file.size}`}
                            className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <FileTextIcon size={14} />
                              <span className="truncate">{file.name}</span>
                              <span className="text-muted-foreground">
                                {formatFileSize(file.size)}
                              </span>
                            </span>

                            <button
                              type="button"
                              onClick={() => removeCredentialFile(file.name)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <XIcon size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-lg border bg-background p-3 text-center">
                          <FileTextIcon size={16} className="mx-auto text-muted-foreground mb-1" />
                          <p className="text-[0.65rem] text-muted-foreground">Certificates</p>
                        </div>
                        <div className="rounded-lg border bg-background p-3 text-center">
                          <BadgeCheckIcon size={16} className="mx-auto text-muted-foreground mb-1" />
                          <p className="text-[0.65rem] text-muted-foreground">Degrees</p>
                        </div>
                        <div className="rounded-lg border bg-background p-3 text-center">
                          <BriefcaseBusinessIcon size={16} className="mx-auto text-muted-foreground mb-1" />
                          <p className="text-[0.65rem] text-muted-foreground">Training</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              <article className="rounded-xl border bg-background p-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <h2 className="font-bold flex items-center gap-2">
                      <WandSparklesIcon size={18} />
                      Tell your story
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Write a short bio clients will see on your profile.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bio">Bio</Label>
                    <span className="text-xs text-muted-foreground">{bio.length}/500</span>
                  </div>
                  <Textarea
                    id="bio"
                    name="bio"
                    maxLength={500}
                    placeholder="Describe your experience, what you’re good at, and the kind of projects you enjoy working on..."
                    className="min-h-36 resize-none shadow-none"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    required
                  />
                </div>
              </article>

              <div className="rounded-xl border bg-background p-6 flex items-center justify-between">
                <Button type="button" variant="outline" className="px-8 shadow-none">
                  Save draft
                </Button>

                <p className="hidden sm:block text-xs text-muted-foreground">
                  You can always edit this later.
                </p>

                <Button
                    type="submit"
                    className="px-10 shadow-none"
                >
                  Create profile
                  <SparklesIcon size={16} />
                </Button>
              </div>
            </form>
          </section>

          <aside className="hidden xl:block w-[420px] space-y-5 sticky top-24">
            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold">Profile strength</h3>
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to start receiving invitations.
                  </p>
                </div>
                <span className="text-2xl font-black text-primary">{completion}%</span>
              </div>

              <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="space-y-3">
                {completionItems.map(item => (
                  <p key={item.label} className="flex items-center gap-2 text-sm">
                    <CheckCircle2Icon
                      size={16}
                      className={item.done ? "text-accent-2" : "text-muted-foreground"}
                    />
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </p>
                ))}
              </div>
            </article>

            <article className="rounded-xl border bg-background p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold">Profile preview</h3>
                <Badge variant="outline" className="shadow-none">
                  Preview
                </Badge>
              </div>

              <div className="rounded-xl border bg-muted/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold">Your Allocat Profile</h4>
                    <p className="text-xs text-muted-foreground">
                      {getExperienceLevel(yearsExperience)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <StarIcon size={14} className="text-accent-3" />
                    New
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Rate</p>
                    <p className="font-bold">${hourlyRate}/hr</p>
                  </div>
                  <div className="rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-bold">{yearsExperience} yrs</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {skills.length > 0 ? (
                    skills.slice(0, 6).map(skill => (
                      <span key={skill} className="rounded-full border bg-background px-3 py-1 text-xs">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Add skills to preview your tags.
                    </span>
                  )}
                </div>

                <div className="mt-5 border-t pt-5">
                  <p className="text-sm text-muted-foreground leading-6">
                    {bio || "Your bio preview will appear here as you type."}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl border bg-primary/5 border-primary/20 p-6">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <BadgeCheckIcon size={18} className="text-primary" />
                What happens next?
              </h3>
              <p className="text-sm text-muted-foreground leading-6">
                Once your profile is created, clients can discover your skills and invite you to projects that match your expertise.
              </p>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default CreateAllocatProfile;