import { cn } from '@/shared/lib/utils';

interface TechLogoMarkProps {
  id: string;
  name: string;
  className?: string;
}

export function TechLogoMark({ id, name, className }: TechLogoMarkProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground/55 flex h-8 items-center justify-center transition-opacity hover:opacity-80',
        className,
      )}
      title={name}
    >
      <TechLogoSvg id={id} label={name} />
    </div>
  );
}

function TechLogoSvg({ id, label }: { id: string; label: string }) {
  switch (id) {
    case 'nextjs':
      return (
        <svg viewBox="0 0 120 24" aria-label={label} className="h-5 w-auto" role="img">
          <text
            x="0"
            y="18"
            fill="currentColor"
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            NEXT
          </text>
          <text
            x="52"
            y="18"
            fill="currentColor"
            fontSize="16"
            fontWeight="400"
            fontFamily="system-ui, sans-serif"
          >
            .js
          </text>
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 80 24" aria-label={label} className="h-6 w-auto" role="img">
          <circle cx="40" cy="12" r="2.5" fill="currentColor" />
          <ellipse
            cx="40"
            cy="12"
            rx="28"
            ry="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <ellipse
            cx="40"
            cy="12"
            rx="28"
            ry="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(60 40 12)"
          />
          <ellipse
            cx="40"
            cy="12"
            rx="28"
            ry="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(120 40 12)"
          />
        </svg>
      );
    case 'typescript':
      return (
        <svg viewBox="0 0 110 24" aria-label={label} className="h-5 w-auto" role="img">
          <rect x="0" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.15" />
          <text
            x="4"
            y="17"
            fill="currentColor"
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            TS
          </text>
          <text
            x="28"
            y="17"
            fill="currentColor"
            fontSize="14"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            TypeScript
          </text>
        </svg>
      );
    case 'nestjs':
      return (
        <svg viewBox="0 0 100 24" aria-label={label} className="h-5 w-auto" role="img">
          <path
            d="M8 20L2 4h4.5l3.5 10.5L13.5 4H18l-6 16h-4z"
            fill="currentColor"
          />
          <text
            x="22"
            y="17"
            fill="currentColor"
            fontSize="14"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            NestJS
          </text>
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 130 24" aria-label={label} className="h-5 w-auto" role="img">
          <path
            d="M8 18c-3.5 0-5.5-1.8-6-5.5 1.2 1.6 2.6 2.2 4.2 1.7 0.9-0.3 1.5-1 2.2-1.8 1.3-1.4 2.8-3 6-3 3.5 0 5.5 1.8 6 5.5-1.2-1.6-2.6-2.2-4.2-1.7-0.9 0.3-1.5 1-2.2 1.8-1.3 1.4-2.8 3-6 3z"
            fill="currentColor"
          />
          <text
            x="22"
            y="17"
            fill="currentColor"
            fontSize="13"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Tailwind CSS
          </text>
        </svg>
      );
    case 'mysql':
      return (
        <svg viewBox="0 0 80 24" aria-label={label} className="h-5 w-auto" role="img">
          <text
            x="0"
            y="17"
            fill="currentColor"
            fontSize="15"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="-0.5"
          >
            MySQL
          </text>
        </svg>
      );
    case 'redis':
      return (
        <svg viewBox="0 0 70 24" aria-label={label} className="h-5 w-auto" role="img">
          <text
            x="0"
            y="17"
            fill="currentColor"
            fontSize="15"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Redis
          </text>
        </svg>
      );
    default:
      return (
        <span className="text-xs font-semibold tracking-wide uppercase">{label}</span>
      );
  }
}
