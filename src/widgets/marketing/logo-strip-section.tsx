import { getTranslations } from 'next-intl/server';
import { TECH_STACK } from '@/shared/config/tech-stack';
import { Container } from '@/shared/ui/marketing';
import { TechLogoMark } from '@/widgets/marketing/tech-logo-mark';
import { cn } from '@/shared/lib/utils';

interface LogoStripProps {
  embedded?: boolean;
}

export async function LogoStripSection({ embedded = false }: LogoStripProps) {
  const t = await getTranslations('marketing.logos');

  return (
    <div className={cn(!embedded && 'py-12 md:py-14', embedded && 'pb-10 md:pb-12')}>
      <Container>
        <p className="text-muted-foreground mb-8 text-center text-sm md:mb-10">
          {t('title')}
        </p>
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {TECH_STACK.map((tech) => (
            <TechLogoMark key={tech.id} id={tech.id} name={tech.name} />
          ))}
        </div>
      </Container>
    </div>
  );
}
