import { LoaderCircleIcon } from "lucide-react";

type LoadingStateProps = {
  title?: string;
  description?: string;
  variant?: "page" | "section" | "card" | "inline";
  className?: string;
};

function LoadingState({
  title = "Loading your workspace",
  description = "We are gathering the latest information.",
  variant = "section",
  className = "",
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm text-muted-foreground ${className}`}
        role="status"
        aria-live="polite"
      >
        <LoaderCircleIcon
          size={16}
          className="animate-spin text-primary"
        />
        {title}
      </span>
    );
  }

  const layoutClasses = {
    page: "min-h-[calc(100vh-5rem)]",
    section: "min-h-[420px]",
    card: "min-h-[240px]",
  };

  return (
    <div
      className={[
        "flex w-full items-center justify-center",
        layoutClasses[variant],
        className,
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex max-w-md flex-col items-center px-6 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">

          <div className="absolute inset-2 rounded-3xl bg-primary/10" />

          <LoaderCircleIcon className="relative h-8 w-8 animate-spin text-primary" />
        </div>

        <p className="mt-7 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
          Please wait
        </p>

        <h2 className="mt-3 text-xl font-black uppercase tracking-[-0.025em] sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-6 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

export default LoadingState;