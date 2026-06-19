import { cn } from '@/shared/lib/utils';
import { meshBandClipStyle, meshBandShellClassName } from './mesh-band-layout';

interface GradientMeshProps {
  className?: string;
}

export function GradientMesh({ className }: GradientMeshProps) {
  return (
    <div aria-hidden className={cn(meshBandShellClassName, className)}>
      <div className="absolute inset-0" style={meshBandClipStyle}>
        <div
          className="absolute -top-[15%] -left-[5%] h-[480px] w-[680px] rounded-full blur-3xl opacity-90"
          style={{ background: 'var(--marketing-ribbon-gradient)' }}
        />
        <div
          className="absolute -top-[10%] left-[20%] h-[520px] w-[820px] rounded-full blur-3xl"
          style={{ background: 'var(--marketing-hero-gradient)' }}
        />
        <div className="from-marketing-violet/30 to-marketing-indigo/20 absolute -top-[5%] right-[5%] h-[420px] w-[480px] rounded-full bg-gradient-to-bl blur-3xl" />
      </div>
    </div>
  );
}
