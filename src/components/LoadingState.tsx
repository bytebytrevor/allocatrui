// import { LoaderCircleIcon } from "lucide-react";

// type LoadingStateProps = {
//   label?: string;
//   layout?: "centered" | "inline";
//   className?: string;
// };

// function LoadingState({
//   label = "Loading",
//   layout = "centered",
//   className = "",
// }: LoadingStateProps) {
//   if (layout === "inline") {
//     return (
//       <div
//         className={[
//           "flex items-center gap-2 text-xs text-muted-foreground",
//           className,
//         ].join(" ")}
//         role="status"
//         aria-live="polite"
//         aria-busy="true"
//       >
//         <LoaderCircleIcon
//           size={14}
//           className="shrink-0 animate-spin text-primary"
//         />

//         <span>{label}</span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={[
//         "flex min-h-40 w-full items-center justify-center",
//         className,
//       ].join(" ")}
//       role="status"
//       aria-live="polite"
//       aria-busy="true"
//     >
//       <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
//         <LoaderCircleIcon
//           size={14}
//           className="shrink-0 animate-spin text-primary"
//         />

//         <span>{label}</span>
//       </div>
//     </div>
//   );
// }

// export default LoadingState;


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
          size={15}
          className="shrink-0 animate-spin text-primary"
        />

        <span className="font-medium">
          {label}
        </span>
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
      <div className="flex flex-col items-center">
        <LoaderCircleIcon
          size={26}
          strokeWidth={1.8}
          className="animate-spin text-primary"
        />

        <p className="mt-3 text-xs font-medium text-muted-foreground">
          {label}
        </p>

        <div
          className="mt-3 flex items-center gap-1.5"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-duration:900ms]" />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms] [animation-duration:900ms]" />

          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/30 [animation-delay:300ms] [animation-duration:900ms]" />
        </div>
      </div>
    </div>
  );
}

export default LoadingState;