import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  SparklesIcon
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => Promise<void> | void;
};

export default function BecomeAllocatDialog({
  open,
  onOpenChange,
  onContinue
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <BriefcaseBusinessIcon className="text-primary" size={28} />
          </div>

          <DialogTitle className="text-center text-xl">
            Become an Allocat
          </DialogTitle>

          <DialogDescription className="text-center">
            You're about to create your professional Allocat profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="font-semibold mb-3">
              As an Allocat you'll be able to:
            </h4>

            <div className="space-y-3">
              {[
                "Be discovered by clients looking for experts.",
                "Receive invitations to projects that match your skills.",
                "Showcase your experience, certifications and portfolio.",
                "Set your own hourly rate and availability."
              ].map(item => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2Icon
                    size={18}
                    className="mt-0.5 text-primary shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex gap-3">
              <SparklesIcon className="text-primary shrink-0" size={18} />
              <p className="text-sm text-muted-foreground">
                After continuing you'll create your professional profile. You can edit your profile later.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="shadow-none"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="shadow-none"
            onClick={onContinue}
          >
            Create My Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}