import type { Person, PersonData } from './types';
import { validatePerson } from './validation';

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

  // Пошук за ім'ям або хобі
  search(query: string): Person[] {
    // порівнюємо в нижньому регістрі, щоб "ОЛЕНА" і "олена" знаходили "Олена"
    const q = query.trim().toLowerCase();
    if (q === '') {
      return this.getAll();
    }
    return this.people.filter(
      (p) => p.name.toLowerCase().includes(q) || p.hobbies.some((h) => h.toLowerCase().includes(q))
    );
  }

  // Повертає список людей у вигляді JSON-тексту (для збереження у файл)
  exportJson(): string {
    return JSON.stringify(this.people, null, 2);
  }

  // Додає людей з JSON-тексту. Повертає, скільки людей додано.
  // Якщо файл неправильний - кидає помилку і нічого не змінює.
  importJson(json: string): number {
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error('Файл має неправильний формат');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Файл має неправильний формат');
    }

    // спочатку перевіряємо всі записи, і тільки потім додаємо
    const toAdd: Person[] = [];
    for (const item of parsed) {
      if (
        typeof item !== 'object' || item === null ||
        typeof item.id !== 'string' ||
        typeof item.name !== 'string' ||
        typeof item.age !== 'number' ||
        !Array.isArray(item.hobbies) ||
        validatePerson(item).length > 0
      ) {
        throw new Error('Файл має неправильний формат');
      }
      // людей, які вже є в списку, не дублюємо
      if (!this.getById(item.id)) {
        toAdd.push({
          id: item.id,
          name: item.name,
          age: item.age,
          gender: item.gender,
          profession: item.profession,
          hobbies: item.hobbies,
          createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        });
      }
    }

    this.people.push(...toAdd);
    this.save();
    return toAdd.length;
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.people));
  }
}

export type SortMode = 'newest' | 'name' | 'age';

// Сортування списку людей (повертає новий масив)
export function sortPeople(people: Person[], mode: SortMode): Person[] {
  const result = [...people];
  if (mode === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
  } else if (mode === 'age') {
    result.sort((a, b) => a.age - b.age);
  } else {
    result.sort((a, b) => b.createdAt - a.createdAt);
  }
  return result;
}
