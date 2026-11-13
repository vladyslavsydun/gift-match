import type { Gift, Person, Recommendation } from './types';

// Алгоритм підбору подарунків.

// Коефіцієнти (ваги) характеристик. Сума = 1.
// Хобі має найбільшу вагу, бо найкраще показує, що людині подобається.
export const WEIGHTS = {
  hobby: 0.45,
  age: 0.25,
  profession: 0.2,
  gender: 0.1,
};

// Бал для подарунків, які підходять "всім" (порожній список хобі або професій)
const UNIVERSAL_SCORE = 0.3;

// Скільки років можна вийти за межі віку подарунка, щоб отримати половину балу
const AGE_TOLERANCE = 5;

// Рахує, наскільки подарунок підходить людині.
// Кожна характеристика дає оцінку від 0 до 1, потім множимо на коефіцієнт.
export function scoreGift(person: Person, gift: Gift): Recommendation {
  const reasons: string[] = [];

  // 1. Хобі
  let hobbyScore = 0;
  if (gift.hobbies.length === 0) {
    hobbyScore = UNIVERSAL_SCORE;
  } else {
    const matched = person.hobbies.filter((h) => gift.hobbies.includes(h));
    if (matched.length > 0) {
      // 1 збіг = 0.8, 2 і більше збігів = 1.0 (більше 1 бути не може)
      hobbyScore = Math.min(1, 0.6 + 0.2 * matched.length);
      reasons.push('Підходить під хобі: ' + matched.join(', '));
    }
  }

  // 2. Вік
  let ageScore = 0;
  if (person.age >= gift.minAge && person.age <= gift.maxAge) {
    ageScore = 1;
    reasons.push('Вік у межах ' + gift.minAge + '–' + gift.maxAge);
  } else if (person.age >= gift.minAge - AGE_TOLERANCE && person.age <= gift.maxAge + AGE_TOLERANCE) {
    ageScore = 0.5;
  }

  // 3. Професія
  let professionScore = 0;
  if (gift.professions.length === 0) {
    professionScore = UNIVERSAL_SCORE;
  } else if (gift.professions.includes(person.profession)) {
    professionScore = 1;
    reasons.push('Підходить для професії: ' + person.profession);
  }

  // 4. Стать
  let genderScore = 0;
  if (gift.genders.length === 0 || gift.genders.includes(person.gender)) {
    genderScore = 1;
  }

  const total =
    WEIGHTS.hobby * hobbyScore +
    WEIGHTS.age * ageScore +
    WEIGHTS.profession * professionScore +
    WEIGHTS.gender * genderScore;

  return {
    gift: gift,
    score: Math.round(total * 100),
    reasons: reasons,
  };
}

// Повертає найкращі подарунки для людини (за замовчуванням 5).
// Якщо в людини вказаний бюджет - дорожчі подарунки не показуємо.
export function recommend(person: Person, gifts: Gift[], limit = 5): Recommendation[] {
  return gifts
    .filter((gift) => person.budget === undefined || gift.price <= person.budget)
    .map((gift) => scoreGift(person, gift))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
