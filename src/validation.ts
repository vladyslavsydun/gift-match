import type { PersonData } from './types';
import { HOBBIES, PROFESSIONS, MAX_HOBBIES } from './data/options';

// Перевіряє дані людини. Повертає масив помилок.
// Якщо масив порожній - все правильно.
export function validatePerson(data: PersonData): string[] {
  const errors: string[] = [];

  const name = data.name.trim();
  if (name.length < 2 || name.length > 50) {
    errors.push("Ім'я має містити від 2 до 50 символів");
  }

  if (!Number.isInteger(data.age) || data.age < 1 || data.age > 120) {
    errors.push('Вік має бути цілим числом від 1 до 120');
  }

  if (!['male', 'female', 'other'].includes(data.gender)) {
    errors.push('Оберіть стать');
  }

  if (!PROFESSIONS.includes(data.profession)) {
    errors.push('Оберіть професію зі списку');
  }

  if (data.hobbies.length === 0) {
    errors.push('Оберіть хоча б одне хобі');
  } else if (data.hobbies.length > MAX_HOBBIES) {
    errors.push('Можна обрати не більше ' + MAX_HOBBIES + ' хобі');
  } else if (data.hobbies.some((h) => !HOBBIES.includes(h))) {
    errors.push('Невідоме хобі');
  }

  return errors;
}
