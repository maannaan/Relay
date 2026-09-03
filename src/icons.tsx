type IconProps = { size?: number; className?: string }

const base = (size = 16) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })

export function RelayLogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <g transform="translate(100,100)" fill="#14210f">
        <path d="M -52 -8 C -52 -30, -34 -46, -12 -46 L 30 -46 C 34 -46, 36 -42, 33 -39 L 14 -20 C 11 -17, 6 -17, 3 -20 L -8 -31 C -20 -31, -30 -21, -30 -8 Z" />
        <path d="M 52 8 C 52 30, 34 46, 12 46 L -30 46 C -34 46, -36 42, -33 39 L -14 20 C -11 17, -6 17, -3 20 L 8 31 C 20 31, 30 21, 30 8 Z" />
        <circle cx="0" cy="0" r="7" />
      </g>
    </svg>
  )
}

export function IconGrid({ size, className }: IconProps) { return <svg {...base(size)} className={className}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg> }
export function IconNotes({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /><path d="M8 13h8M8 17h5" /></svg> }
export function IconRadar({ size, className }: IconProps) { return <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><path d="M12 3v3M21 12h-3" /></svg> }
export function IconRelay({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M4 17V7l8-4 8 4v10l-8 4-8-4Z" /><path d="M4 7l8 4 8-4M12 11v10" /></svg> }
export function IconAudit({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M12 3a9 9 0 1 0 9 9" /><path d="M21 3v6h-6" /><path d="M12 8v4l3 2" /></svg> }
export function IconCheck({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M20 6 9 17l-5-5" /></svg> }
export function IconAlert({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" /></svg> }
export function IconDot({ size, className }: IconProps) { return <svg {...base(size)} className={className}><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></svg> }
export function IconArrowRight({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg> }
export function IconSparkline({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M3 16l4-3 3 4 4-9 4 5 3-2" /></svg> }
export function IconClock({ size, className }: IconProps) { return <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> }
export function IconTerminal({ size, className }: IconProps) { return <svg {...base(size)} className={className}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9l3 3-3 3M13 15h4" /></svg> }
export function IconRefresh({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg> }
export function IconEye({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg> }
export function IconWand({ size, className }: IconProps) { return <svg {...base(size)} className={className}><path d="m15 4 1.5 3L20 8.5 16.5 10 15 13l-1.5-3L10 8.5 13.5 7 15 4Z" /><path d="M5 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /><path d="M4 4l.6 1.4L6 6l-1.4.6L4 8l-.6-1.4L2 6l1.4-.6L4 4Z" /></svg> }
