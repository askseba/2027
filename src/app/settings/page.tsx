import { redirect } from '@/i18n/routing';
export default function SettingsRedirect() {
  redirect('/profile');  // next-intl auto-prefixes locale (proven by P0.2 diagnostic)
}
