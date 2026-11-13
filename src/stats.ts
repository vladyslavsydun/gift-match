import type { Person } from './types';

// Статистика переходів на маркетплейси.
// Для власника продукту це головна цифра: за переходи платять маркетплейси.
export class ClickStats {
  private counts: Record<string, number> = {};
  private storageKey: string;

  constructor(storageKey = 'giftmatch-clicks') {
    this.storageKey = storageKey;
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.counts = raw ? JSON.parse(raw) : {};
    } catch {
      this.counts = {};
    }
  }

  registerClick(marketplaceId: string): void {
    this.counts[marketplaceId] = this.getCount(marketplaceId) + 1;
    localStorage.setItem(this.storageKey, JSON.stringify(this.counts));
  }

  getCount(marketplaceId: string): number {
    return this.counts[marketplaceId] || 0;
  }

  getTotal(): number {
    return Object.values(this.counts).reduce((sum, n) => sum + n, 0);
  }
}

// Найпопулярніше хобі серед людей у списку (або null, якщо список порожній)
export function getTopHobby(people: Person[]): string | null {
  const counter: Record<string, number> = {};
  for (const p of people) {
    for (const h of p.hobbies) {
      counter[h] = (counter[h] || 0) + 1;
    }
  }

  let top: string | null = null;
  let max = 0;
  for (const hobby in counter) {
    if (counter[hobby] > max) {
      max = counter[hobby];
      top = hobby;
    }
  }
  return top;
}
