import { getPublicSiteSettings } from '@/entities/public-api';
import { ContactSection } from '@/features/public-contact';

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const contactInfo = settings?.contactInfo ?? {
    email: '',
    phone: null,
    location: null,
    address: null,
    workHours: null,
    showForm: true,
  };

  return <ContactSection contactInfo={contactInfo} />;
}
