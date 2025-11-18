// src/components/icons/tennis-ball-icon.tsx
export function TennisBallIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="11" fill="oklch(69.6% 0.17 162.48)" />

      <path
        d="M6 4.5C8 5.5 10 7.8 10 12s-2 6.5-4 7.5"
        fill="none"
        stroke="#bbf7d0"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18 4.5C16 5.5 14 7.8 14 12s2 6.5 4 7.5"
        fill="none"
        stroke="#bbf7d0"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
