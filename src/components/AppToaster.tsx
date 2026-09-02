import { Toaster } from "sonner";

import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      duration={3500}
      gap={10}
      offset={20}
      icons={{
        success: (
          <CheckCircle2Icon
            size={16}
            className="text-primary"
          />
        ),
        error: (
          <AlertCircleIcon
            size={16}
            className="text-destructive"
          />
        ),
        info: (
          <InfoIcon
            size={16}
            className="text-primary"
          />
        ),
        warning: (
          <TriangleAlertIcon
            size={16}
            className="text-primary"
          />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: [
            "!rounded-xl",
            "!border",
            "!border-border/70",
            "!bg-background",
            "!px-4",
            "!py-3.5",
            "!shadow-lg",
            "!shadow-black/[0.04]",
            "dark:!shadow-black/20",
          ].join(" "),

          title: [
            "!text-[0.78rem]",
            "!font-semibold",
            "!tracking-[-0.01em]",
            "!text-foreground",
          ].join(" "),

          description: [
            "!mt-0.5",
            "!text-[0.68rem]",
            "!leading-5",
            "!text-muted-foreground",
          ].join(" "),

          success: "!border-primary/15",

          info: "!border-primary/15",

          warning: "!border-primary/15",

          error: "!border-destructive/20",

          closeButton: [
            "!border-border",
            "!bg-background",
            "!text-muted-foreground",
            "!shadow-none",
            "hover:!bg-muted",
            "hover:!text-foreground",
          ].join(" "),

          actionButton: [
            "!rounded-lg",
            "!bg-primary",
            "!px-3",
            "!text-xs",
            "!font-semibold",
            "!text-primary-foreground",
            "!shadow-none",
          ].join(" "),

          cancelButton: [
            "!rounded-lg",
            "!border",
            "!border-border",
            "!bg-transparent",
            "!px-3",
            "!text-xs",
            "!font-semibold",
            "!text-foreground",
            "!shadow-none",
          ].join(" "),
        },
      }}
    />
  );
}