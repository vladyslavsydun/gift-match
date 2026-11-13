import type { Marketplace } from './types';

// Маркетплейси, де можна купити подарунок.
// Ми відкриваємо сторінку пошуку з назвою подарунка.
export const MARKETPLACES: Marketplace[] = [
  { id: 'rozetka', name: 'Rozetka', searchUrl: 'https://rozetka.com.ua/ua/search/?text=' },
  { id: 'prom', name: 'Prom.ua', searchUrl: 'https://prom.ua/ua/search?search_term=' },
  { id: 'allo', name: 'Allo', searchUrl: 'https://allo.ua/ua/catalogsearch/result/?q=' },
];

// Партнерська мітка. За переходи з такою міткою маркетплейс платить власнику GiftMatch.
// У навчальній версії це просто UTM-параметри. У реальному проєкті тут був би
// ідентифікатор з партнерської програми маркетплейсу.
const PARTNER_PARAMS = 'utm_source=giftmatch&utm_medium=referral&utm_campaign=gift_recommendation';

// Створює посилання на пошук товару на маркетплейсі
export function buildMarketplaceUrl(marketplace: Marketplace, query: string): string {
  return marketplace.searchUrl + encodeURIComponent(query) + '&' + PARTNER_PARAMS;
}
