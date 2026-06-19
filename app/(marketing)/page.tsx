import {
  getPublicBrands,
  getPublicNews,
  getPublicSiteSettings,
} from '@/entities/public-api';
import { getEmptySiteSettings } from '@/entities/site-settings/lib/normalize-site-settings';
import {
  AboutBriefSection,
  BrandsShowcaseSection,
  ContactCtaSection,
  HeroSection,
  NewsPreviewSection,
} from '@/widgets/marketing';

export default async function HomePage() {
  const [settings, brands, news] = await Promise.all([
    getPublicSiteSettings(),
    getPublicBrands({ limit: 6 }),
    getPublicNews({ limit: 3 }),
  ]);

  const defaults = getEmptySiteSettings();
  const hero = settings?.hero ?? defaults.hero;
  const about = settings?.about ?? defaults.about;

  return (
    <>
      <HeroSection hero={hero} />
      <AboutBriefSection about={about} className="bg-muted/20" />
      <BrandsShowcaseSection brands={brands} />
      <NewsPreviewSection posts={news.items} className="bg-muted/20" />
      <ContactCtaSection contactInfo={settings?.contactInfo} />
    </>
  );
}
