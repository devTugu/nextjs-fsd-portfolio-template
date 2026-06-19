import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { TeamMemberOutput } from '@/entities/team';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Container, Section, SectionHeader } from '@/shared/ui/marketing';

interface TeamGridProps {
  members: TeamMemberOutput[];
}

export async function TeamGrid({ members }: TeamGridProps) {
  const t = await getTranslations('marketing.about');
  const locale = (await getLocale()) as Locale;

  return (
    <Section className="pt-8">
      <Container>
        <SectionHeader title={t('teamTitle')} description={t('teamDescription')} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="border-border/60 rounded-xl border p-4 text-center"
            >
              {member.imageUrl ? (
                <div className="relative mx-auto mb-3 size-20 overflow-hidden rounded-full">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : null}
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {pickLocalized(member.role, locale)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
