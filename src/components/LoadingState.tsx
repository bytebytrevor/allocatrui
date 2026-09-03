import { LoaderCircleIcon } from "lucide-react";

type LoadingStateProps = {
  label?: string;
  layout?: "centered" | "inline";
  className?: string;
};

function LoadingState({
  label = "Loading",
  layout = "centered",
  className = "",
}: LoadingStateProps) {
  if (layout === "inline") {
    return (
      <div
        className={[
          "flex items-center gap-2 text-xs text-muted-foreground",
          className,
        ].join(" ")}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <LoaderCircleIcon
          size={14}
          className="shrink-0 animate-spin text-primary"
        />

        <span>{label}</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex min-h-40 w-full items-center justify-center",
        className,
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
        <LoaderCircleIcon
          size={14}
          className="shrink-0 animate-spin text-primary"
        />

        <span>{label}</span>
      </div>
    </div>
  );
}

export default LoadingState;