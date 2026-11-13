import { describe, it, expect } from 'vitest';
import { MARKETPLACES, buildMarketplaceUrl } from '../src/marketplaces';

describe('marketplaces', () => {
  it('є 3 маркетплейси', () => {
    expect(MARKETPLACES.map((m) => m.name)).toEqual(['Rozetka', 'Prom.ua', 'Allo']);
  });

  it('посилання містить назву подарунка і партнерську мітку', () => {
    const url = buildMarketplaceUrl(MARKETPLACES[0], 'Термос');
    expect(url).toContain('rozetka.com.ua');
    expect(url).toContain(encodeURIComponent('Термос'));
    expect(url).toContain('utm_source=giftmatch');
  });
});
