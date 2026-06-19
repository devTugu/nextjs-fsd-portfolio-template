import { cn } from '@/shared/lib/utils';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </section>
  );
}
