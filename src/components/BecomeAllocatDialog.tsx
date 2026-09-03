// import { Link } from "react-router-dom";

// import {
//   ArrowRightIcon,
//   BriefcaseBusinessIcon,
//   CheckCircle2Icon,
// } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// };

// const benefits = [
//   "Be discovered by clients looking for your skills.",
//   "Receive invitations to client projects.",
//   "Show your experience, skills and professional profile.",
//   "Set your rate and availability.",
// ];

// export default function BecomeAllocatDialog({
//   open,
//   onOpenChange,
// }: Props) {
//   return (
//     <Dialog
//       open={open}
//       onOpenChange={onOpenChange}
//     >
//       <DialogContent className="overflow-hidden rounded-[1.5rem] border-border bg-background p-0 text-foreground sm:max-w-lg">
//         <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
//           <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
//             <BriefcaseBusinessIcon size={18} />
//           </span>

//           <div className="mt-5">
//             <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
//               Professional profile
//             </p>

//             <DialogTitle className="mt-2 text-2xl font-black tracking-[-0.03em]">
//               Become an Allocat
//             </DialogTitle>

//             <DialogDescription className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
//               Create your professional profile and make your skills available
//               to clients looking for the right person for their work.
//             </DialogDescription>
//           </div>
//         </DialogHeader>

//         <div className="px-6 py-6 sm:px-8">
//           <p className="text-sm font-semibold">
//             As an Allocat you can:
//           </p>

//           <div className="mt-5 divide-y divide-border border-y border-border">
//             {benefits.map((benefit) => (
//               <div
//                 key={benefit}
//                 className="flex items-start gap-3 py-3.5"
//               >
//                 <CheckCircle2Icon
//                   size={16}
//                   className="mt-0.5 shrink-0 text-primary"
//                 />

//                 <p className="text-sm leading-6 text-muted-foreground">
//                   {benefit}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <p className="mt-5 text-xs leading-6 text-muted-foreground">
//             You&apos;ll set up your professional details on the next page.
//             Everything can be updated later from your profile.
//           </p>
//         </div>

//         <DialogFooter className="border-t border-border px-6 py-5 sm:px-8">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() => onOpenChange(false)}
//             className="rounded-lg px-5 text-muted-foreground shadow-none"
//           >
//             Cancel
//           </Button>

//           <Button
//             asChild
//             className="group rounded-lg px-6 shadow-none"
//           >
//             <Link
//               to="/allocats/profile/create"
//               onClick={() => onOpenChange(false)}
//             >
//               Continue

//               <ArrowRightIcon
//                 size={15}
//                 className="transition-transform group-hover:translate-x-0.5"
//               />
//             </Link>
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  LoaderCircleIcon,
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
  "Be discovered by clients looking for your skills.",
  "Receive invitations to client projects.",
  "Show your experience, skills and professional profile.",
  "Set your rate and availability.",
];

export default function BecomeAllocatDialog({
  open,
  onOpenChange,
  onContinue,
  loading = false,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="overflow-hidden rounded-[1.5rem] border-border bg-background p-0 text-foreground sm:max-w-lg">
        <DialogHeader className="border-b border-border px-6 pb-6 pt-7 text-left sm:px-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
            <BriefcaseBusinessIcon size={18} />
          </span>

          <div className="mt-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
              Professional profile
            </p>

            <DialogTitle className="mt-2 text-2xl font-black tracking-[-0.03em]">
              Become an Allocat
            </DialogTitle>

            <DialogDescription className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Set up your professional profile so clients can discover your
              skills and invite you to their projects.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 sm:px-8">
          <p className="text-sm font-semibold">
            As an Allocat you can:
          </p>

          <div className="mt-5 divide-y divide-border border-y border-border">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 py-3.5"
              >
                <CheckCircle2Icon
                  size={16}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <p className="text-sm leading-6 text-muted-foreground">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            Next, you&apos;ll complete your first-time Allocat profile setup.
            You can update your professional details later.
          </p>
        </div>

        <DialogFooter className="border-t border-border px-6 py-5 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-5 text-muted-foreground shadow-none"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={() => void onContinue()}
            className="min-w-36 rounded-lg px-6 shadow-none"
          >
            {loading ? (
              <>
                <LoaderCircleIcon
                  size={15}
                  className="animate-spin"
                />
                Preparing profile
              </>
            ) : (
              <>
                Continue
                <ArrowRightIcon size={15} />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}