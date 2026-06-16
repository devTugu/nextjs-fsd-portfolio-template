import { RequirePermission } from '@/features/auth';
import { SiteSettingsForm } from '@/features/site-settings';
import { PERMISSION_CODES } from '@/shared/config/permissions';

export default function SiteSettingsPage() {
  return (
    <RequirePermission permission={PERMISSION_CODES.SITE_SETTING_READ}>
      <SiteSettingsForm />
    </RequirePermission>
  );
}
