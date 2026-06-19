'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { StripeGradientEngine } from '@/shared/lib/stripe-gradient';
import { cn } from '@/shared/lib/utils';
import { GradientMesh } from './gradient-mesh';
import { meshBandClipStyle, meshBandShellClassName } from './mesh-band-layout';

interface AnimatedMeshProps {
  className?: string;
}

export function AnimatedMesh({ className }: AnimatedMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    let engine: StripeGradientEngine | null = null;

    const ensureEngine = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;

      if (!engine) {
        try {
          engine = new StripeGradientEngine({ canvas, width, height });
          engine.play();
        } catch {
          return;
        }
      }

      engine.resize(width, height);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      ensureEngine(width, height);
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        engine?.setVisible(entry?.isIntersecting ?? false);
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      engine?.disconnect();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <GradientMesh className={className} />;
  }

  return (
    <div aria-hidden className={cn(meshBandShellClassName, className)}>
      <div ref={containerRef} className="absolute inset-0" style={meshBandClipStyle}>
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    </div>
  );
}
