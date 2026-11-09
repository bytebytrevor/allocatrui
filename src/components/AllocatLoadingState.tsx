import { CatIcon, PawPrintIcon, SparklesIcon } from "lucide-react";
import { discoverIconSurface } from "@/components/allocat-results-theme";

type Props = { message?: string; description?: string; className?: string };

export default function AllocatLoadingState({
  message = "Paws at work — finding your Allocats…",
  description,
  className = "",
}: Props) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className={`flex min-h-[250px] items-center justify-center px-6 py-10 text-center ${className}`}>
      <div className="min-w-0 max-w-sm">
        <div aria-hidden="true">
          <div className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${discoverIconSurface}`}>
            <CatIcon size={24} strokeWidth={1.8} />
            <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 animate-bounce items-center justify-center rounded-full border border-border/60 bg-surface-1 text-brand-secondary-highlight motion-reduce:animate-none dark:bg-surface-2 dark:text-secondary">
              <SparklesIcon size={10} />
            </span>
          </div>
          <div className="mt-4 flex justify-center gap-2 text-muted-foreground/60">
            {[0, 150, 300].map((delay) => <PawPrintIcon key={delay} size={12} className="animate-pulse motion-reduce:animate-none" style={{ animationDelay: `${delay}ms` }} />)}
          </div>
        </div>
        <p className="mt-4 break-words text-sm font-semibold text-foreground/80">{message}</p>
        {description && <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
