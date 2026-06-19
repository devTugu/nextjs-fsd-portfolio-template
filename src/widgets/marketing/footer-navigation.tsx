import Link from 'next/link';
import type { NavigationNodeTree } from '@/entities/navigation';
import { resolveNavigationLabel } from '@/entities/navigation';
import type { Locale } from '@/shared/i18n/config';

interface FooterNavigationProps {
  tree: NavigationNodeTree[];
  locale: Locale;
}

export function FooterNavigation({ tree, locale }: FooterNavigationProps) {
  const groups = tree.filter((node) => node.type === 'GROUP');

  if (groups.length === 0) {
    return null;
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-4 text-sm font-semibold">
            {resolveNavigationLabel(group.labels, locale)}
          </h3>
          <ul className="space-y-2">
            {group.children
              .filter((child) => child.type === 'LINK')
              .map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href ?? '/'}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {resolveNavigationLabel(link.labels, locale)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </>
  );
}
