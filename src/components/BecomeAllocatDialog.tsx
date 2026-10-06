import { useNavigate } from "react-router-dom";

import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  LoaderCircleIcon,
  ShieldCheckIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => Promise<void> | void;
  loading?: boolean;
};

const benefits = [
  "Create a professional profile clients can discover.",
  "Show the skills, experience and services you offer.",
  "Set your rate and current availability.",
  "Receive invitations to projects that match your work.",
];

const primaryButton = [
  "border border-brand-secondary-highlight/15",
  "bg-brand-secondary-highlight",
  "text-primary-foreground",
  "shadow-none",
  "transition-opacity duration-150",

  "hover:border-brand-secondary-highlight/15",
  "hover:bg-brand-secondary-highlight",
  "hover:text-primary-foreground",
  "hover:opacity-90",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/20",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",

  "dark:border-secondary/10",
  "dark:bg-secondary",
  "dark:text-secondary-foreground",

  "dark:hover:border-secondary/10",
  "dark:hover:bg-secondary",
  "dark:hover:text-secondary-foreground",
  "dark:hover:opacity-90",

  "dark:focus-visible:ring-secondary/20",
].join(" ");

const secondaryButton = [
  "border border-border/65",
  "bg-surface-2/35",
  "text-foreground/75",
  "shadow-none",
  "transition-opacity duration-150",

  "hover:border-border/65",
  "hover:bg-surface-2/35",
  "hover:text-foreground/75",
  "hover:opacity-75",

  "focus-visible:ring-2",
  "focus-visible:ring-brand-secondary-highlight/15",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background",

  "dark:border-border",
  "dark:bg-surface-2/65",
  "dark:text-foreground/75",

  "dark:hover:border-border",
  "dark:hover:bg-surface-2/65",
  "dark:hover:text-foreground/75",
  "dark:hover:opacity-75",

  "dark:focus-visible:ring-secondary/15",
].join(" ");

const accentIconSurface = [
  "bg-brand-secondary-highlight/[0.08]",
  "text-brand-secondary-highlight",
  "ring-1 ring-inset ring-brand-secondary-highlight/10",

  "dark:bg-secondary/[0.07]",
  "dark:text-secondary",
  "dark:ring-secondary/10",
].join(" ");

export default function BecomeAllocatDialog({
  open,
  onOpenChange,
  onContinue,
  loading = false,
}: Props) {
  const navigate = useNavigate();

  async function handleContinue() {
    if (loading) {
      return;
    }

    /*
     * onContinue handles any prerequisite account change,
     * such as marking an existing user as an Allocat.
     *
     * Navigation only happens once that completes successfully.
     */
    await onContinue();

    onOpenChange(false);

    navigate("/allocats/profile/create");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent
        className={[
          "overflow-hidden p-0",
          "rounded-2xl border border-border/55",
          "bg-card text-card-foreground",
          "shadow-none",
          "sm:max-w-lg",
          "dark:border-border dark:bg-card",
        ].join(" ")}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <DialogHeader className="border-b border-border/50 px-6 pb-6 pt-7 text-left sm:px-8">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-lg",
              accentIconSurface,
            ].join(" ")}
          >
            <BriefcaseBusinessIcon size={17} />
          </span>

          <div className="mt-5">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-6 rounded-full bg-brand-secondary-highlight dark:bg-secondary" />

              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Professional profile
              </p>
            </div>

            <DialogTitle className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">
              Become an Allocat
            </DialogTitle>

            <DialogDescription className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Set up your professional profile and make your skills available to
              clients looking for the right person for their work.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* =================================================
            BENEFITS
        ================================================= */}

        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold text-foreground">
            As an Allocat you can:
          </p>

          <div className="mt-4 divide-y divide-border/45 border-y border-border/45">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 py-3.5">
                <span
                  className={[
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                    accentIconSurface,
                  ].join(" ")}
                >
                  <CheckIcon size={11} />
                </span>

                <p className="text-xs leading-6 text-muted-foreground">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          {/* =================================================
              NEXT STEP
          ================================================= */}

          <div className="mt-5 flex items-start gap-3">
            <span
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                accentIconSurface,
              ].join(" ")}
            >
              <ShieldCheckIcon size={14} />
            </span>

            <div>
              <p className="text-xs font-semibold text-foreground">
                Next, set up your Allocat profile
              </p>

              <p className="mt-1 text-[0.62rem] leading-5 text-muted-foreground">
                We&apos;ll guide you through your professional details, skills,
                rate, availability and identity information. Verification
                documents are optional during setup and can be added later.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <DialogFooter className="border-t border-border/50 px-6 py-5 sm:px-8">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className={[
              "h-10 rounded-lg px-4 text-xs font-semibold",
              secondaryButton,
            ].join(" ")}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={() => void handleContinue()}
            className={[
              "h-10 min-w-36 rounded-lg px-5 text-xs font-semibold",
              primaryButton,
            ].join(" ")}
          >
            {loading ? (
              <>
                <LoaderCircleIcon size={14} className="animate-spin" />
                Preparing profile
              </>
            ) : (
              <>
                Continue
                <ArrowRightIcon size={14} />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
