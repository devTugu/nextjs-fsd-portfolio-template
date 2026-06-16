'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  ClipboardList,
  FolderKanban,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { env } from '@/shared/config/env';
import { ROUTES } from '@/shared/config/routes';
import {
  PERMISSION_CODES,
  type PermissionCode,
} from '@/shared/config/permissions';
import { useAuthPermissions } from '@/features/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { NavUser } from './nav-user';

interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  permission?: PermissionCode;
}

const systemNavItems: NavItem[] = [
  {
    title: 'Overview',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    permission: PERMISSION_CODES.DASHBOARD_READ,
  },
  {
    title: 'Users',
    href: ROUTES.USERS,
    icon: Users,
    permission: PERMISSION_CODES.USER_READ,
  },
  {
    title: 'Roles',
    href: ROUTES.ROLES,
    icon: Shield,
    permission: PERMISSION_CODES.ROLE_READ,
  },
  {
    title: 'Permissions',
    href: ROUTES.PERMISSIONS,
    icon: KeyRound,
    permission: PERMISSION_CODES.PERMISSION_READ,
  },
  {
    title: 'Audit Logs',
    href: ROUTES.AUDIT_LOGS,
    icon: ClipboardList,
    permission: PERMISSION_CODES.AUDIT_READ,
  },
];

const portfolioNavItems: NavItem[] = [
  {
    title: 'Projects',
    href: ROUTES.PROJECTS,
    icon: FolderKanban,
    permission: PERMISSION_CODES.PROJECT_READ,
  },
  {
    title: 'Skills',
    href: ROUTES.SKILLS,
    icon: GraduationCap,
    permission: PERMISSION_CODES.SKILL_READ,
  },
  {
    title: 'Experiences',
    href: ROUTES.EXPERIENCES,
    icon: Briefcase,
    permission: PERMISSION_CODES.EXPERIENCE_READ,
  },
  {
    title: 'Site Settings',
    href: ROUTES.SITE_SETTINGS,
    icon: Settings,
    permission: PERMISSION_CODES.SITE_SETTING_READ,
  },
  {
    title: 'Contact Messages',
    href: ROUTES.CONTACT_MESSAGES,
    icon: Mail,
    permission: PERMISSION_CODES.CONTACT_READ,
  },
];

function NavSection({
  label,
  items,
  pathname,
  can,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  can: (code: PermissionCode) => boolean;
}) {
  const visibleItems = items.filter(
    (item) => !item.permission || can(item.permission)
  );

  if (visibleItems.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { can } = useAuthPermissions();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={ROUTES.DASHBOARD}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{env.APP_NAME}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin Console
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSection
          label="System"
          items={systemNavItems}
          pathname={pathname}
          can={can}
        />
        <NavSection
          label="Portfolio"
          items={portfolioNavItems}
          pathname={pathname}
          can={can}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
