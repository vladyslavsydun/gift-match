import type { Person, PersonData } from './types';

// Клас для роботи зі списком людей.
// Всі дані зберігаються в localStorage браузера.
export class PersonStore {
  private people: Person[] = [];
  private storageKey: string;

  constructor(storageKey = 'giftmatch-people') {
    this.storageKey = storageKey;
  }

  // Завантажує дані з localStorage.
  // Повертає текст помилки, якщо дані пошкоджені, або null, якщо все добре.
  load(): string | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.people = [];
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        throw new Error('not array');
      }
      this.people = parsed;
      return null;
    } catch {
      // якщо хтось зіпсував дані - починаємо з порожнього списку
      this.people = [];
      return 'Збережені дані пошкоджені, список очищено.';
    }
  }

  getAll(): Person[] {
    return [...this.people];
  }

  getById(id: string): Person | undefined {
    return this.people.find((p) => p.id === id);
  }

  add(data: PersonData): Person {
    const person: Person = {
      ...data,
      id: Date.now().toString() + Math.random().toString(16).slice(2, 6),
      createdAt: Date.now(),
    };
    this.people.push(person);
    this.save();
    return person;
  }

  // Змінює дані людини. Повертає false, якщо людину не знайдено.
  update(id: string, data: PersonData): boolean {
    const index = this.people.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    // id і дату додавання не змінюємо
    this.people[index] = { ...this.people[index], ...data };
    this.save();
    return true;
  }

  remove(id: string): boolean {
    const before = this.people.length;
    this.people = this.people.filter((p) => p.id !== id);
    if (this.people.length === before) {
      return false;
    }
    this.save();
    return true;
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.people));
  }
}
