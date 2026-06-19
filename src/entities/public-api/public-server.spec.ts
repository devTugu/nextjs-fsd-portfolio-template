import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  getPublicBrands,
  getPublicSiteSettings,
} from './public-server';

describe('public-server', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: { id: 1, header: { siteName: { en: 'Test', mn: 'Тест' } } },
          timestamp: '',
          path: '',
          requestId: '',
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('unwraps and normalizes site settings envelope', async () => {
    const settings = await getPublicSiteSettings();
    expect(settings).toMatchObject({
      id: 1,
      header: { siteName: { en: 'Test', mn: 'Тест' } },
    });
    expect(settings?.hero).toBeDefined();
    expect(settings?.hero.secondaryCtaLabel).toBeDefined();
  });

  it('returns empty array when brands fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    const brands = await getPublicBrands();
    expect(brands).toEqual([]);
  });

  it('passes type query param to brands endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        timestamp: '',
        path: '',
        requestId: '',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await getPublicBrands({ type: 'restaurant', limit: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('type=restaurant'),
      expect.any(Object),
    );
  });
});
