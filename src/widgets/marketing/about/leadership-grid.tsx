import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { LeadershipMemberOutput } from '@/entities/leadership';
import type { Locale } from '@/shared/i18n/config';
import { pickLocalized } from '@/shared/lib/pick-localized';
import { Container, Section, SectionHeader } from '@/shared/ui/marketing';

interface LeadershipGridProps {
  members: LeadershipMemberOutput[];
}

export async function LeadershipGrid({ members }: LeadershipGridProps) {
  const t = await getTranslations('marketing.about');
  const locale = (await getLocale()) as Locale;

  return (
    <Section className="pt-8">
      <Container>
        <SectionHeader
          title={t('leadershipTitle')}
          description={t('leadershipDescription')}
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="border-border/60 rounded-xl border p-6 text-center"
            >
              {member.imageUrl ? (
                <div className="relative mx-auto mb-4 size-24 overflow-hidden rounded-full">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : null}
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {pickLocalized(member.title, locale)}
              </p>
              <blockquote className="text-muted-foreground mt-4 text-sm italic">
                &ldquo;{pickLocalized(member.quote, locale)}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
