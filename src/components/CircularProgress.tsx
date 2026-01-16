type Props = { progress: number };

export function CircularProgress({ progress }: Props) {
  const radius = 48;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="120" height="120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-100"
      />
    </svg>
  );
}
