import { cache } from 'react';
import type { NewsPostOutput, ListPublicNewsPostsParams } from '@/entities/news-post';
import type { BrandDetailOutput, BrandOutput, BrandType } from '@/entities/brand';
import type { HistoryEntryOutput } from '@/entities/history';
import type { LeadershipMemberOutput } from '@/entities/leadership';
import { normalizeSiteSettings } from '@/entities/site-settings/lib/normalize-site-settings';
import type { SiteSettingsOutput } from '@/entities/site-settings';
import type { TeamMemberOutput } from '@/entities/team';
import type {
  NavigationScope,
  NavigationNodeTree,
  PublicNavigationOutput,
} from '@/entities/navigation';
import type { PaginatedResult } from '@/shared/api';
import { fetchInternal, parseInternalJson } from '@/shared/lib/internal-api';
import { PUBLIC_API_PATHS, PUBLIC_REVALIDATE_SECONDS } from '@/shared/api/public.config';

async function fetchPublic<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetchInternal(path, {
      ...init,
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    const envelope = await parseInternalJson<T>(response);
    return envelope.data;
  } catch {
    return null;
  }
}

export const getPublicSiteSettings = cache(async (): Promise<SiteSettingsOutput | null> => {
  const raw = await fetchPublic<SiteSettingsOutput>(PUBLIC_API_PATHS.SITE_SETTINGS);
  return normalizeSiteSettings(raw);
});

export async function getPublicBrands(params?: {
  type?: BrandType;
  limit?: number;
}): Promise<BrandOutput[]> {
  const search = new URLSearchParams();
  if (params?.type) {
    search.set('type', params.type);
  }
  if (params?.limit) {
    search.set('limit', String(params.limit));
  }

  const query = search.toString();
  const path = query
    ? `${PUBLIC_API_PATHS.BRANDS}?${query}`
    : PUBLIC_API_PATHS.BRANDS;

  return (await fetchPublic<BrandOutput[]>(path)) ?? [];
}

export async function getPublicBrandBySlug(
  slug: string,
): Promise<BrandDetailOutput | null> {
  return fetchPublic<BrandDetailOutput>(PUBLIC_API_PATHS.BRAND_BY_SLUG(slug));
}

export const getPublicHistory = cache(async (): Promise<HistoryEntryOutput[]> =>
  (await fetchPublic<HistoryEntryOutput[]>(PUBLIC_API_PATHS.HISTORY)) ?? [],
);

export const getPublicLeadership = cache(async (): Promise<LeadershipMemberOutput[]> =>
  (await fetchPublic<LeadershipMemberOutput[]>(PUBLIC_API_PATHS.LEADERSHIP)) ?? [],
);

export const getPublicTeam = cache(async (): Promise<TeamMemberOutput[]> =>
  (await fetchPublic<TeamMemberOutput[]>(PUBLIC_API_PATHS.TEAM)) ?? [],
);

export async function getPublicNews(
  params?: ListPublicNewsPostsParams,
): Promise<PaginatedResult<NewsPostOutput>> {
  const search = new URLSearchParams();
  if (params?.category) search.set('category', params.category);
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  const path = query
    ? `${PUBLIC_API_PATHS.NEWS}?${query}`
    : PUBLIC_API_PATHS.NEWS;

  return (
    (await fetchPublic<PaginatedResult<NewsPostOutput>>(path)) ?? {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    }
  );
}

export async function getPublicNewsBySlug(
  slug: string,
): Promise<NewsPostOutput | null> {
  return fetchPublic<NewsPostOutput>(PUBLIC_API_PATHS.NEWS_BY_SLUG(slug));
}

export const getPublicNavigation = cache(
  async (scope: NavigationScope): Promise<NavigationNodeTree[]> => {
    const path = `${PUBLIC_API_PATHS.NAVIGATION}?scope=${scope}`;
    const data = await fetchPublic<PublicNavigationOutput>(path);
    return data?.tree ?? [];
  },
);
