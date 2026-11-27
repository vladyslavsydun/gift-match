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

// Бал для подарунків, які підходять "всім" (порожній список хобі),
// а також для професії, якщо подарунок не прив'язаний саме до професії людини
const NEUTRAL_SCORE = 0.3;

// Скільки років можна вийти за межі віку подарунка, щоб отримати хоч якийсь бал
const AGE_TOLERANCE = 5;

// Рахує, наскільки подарунок підходить людині.
// Кожна характеристика дає оцінку від 0 до 1, потім множимо на коефіцієнт.
// Повертає точний бал (exactScore) для сортування і округлений (score) для показу.
export function scoreGift(person: Person, gift: Gift): Recommendation & { exactScore: number } {
  const reasons: string[] = [];

  // 1. Хобі.
  // coverage - яку частину хобі людини покриває подарунок (обидва хобі краще, ніж одне);
  // focus - наскільки подарунок саме про ці хобі (набір спецій тільки про кулінарію,
  // а колонка - одразу про музику, подорожі і туризм, тому вона менш "точна").
  let hobbyScore = 0;
  if (gift.hobbies.length === 0) {
    hobbyScore = NEUTRAL_SCORE;
  } else {
    const matched = person.hobbies.filter((h) => gift.hobbies.includes(h));
    if (matched.length > 0) {
      const coverage = matched.length / person.hobbies.length;
      const focus = matched.length / gift.hobbies.length;
      hobbyScore = 0.4 + 0.3 * coverage + 0.3 * focus; // від 0.4 до 1
      reasons.push('Підходить під хобі: ' + matched.join(', '));
    }
  }

  // 2. Вік.
  // Якщо вік у межах - чим ближче до середини вікового діапазону подарунка, тим краще
  // (там "типовий" отримувач цього подарунка).
  let ageScore = 0;
  if (person.age >= gift.minAge && person.age <= gift.maxAge) {
    const middle = (gift.minAge + gift.maxAge) / 2;
    const halfRange = (gift.maxAge - gift.minAge) / 2 || 1; // || 1 - щоб не ділити на 0
    const closeness = 1 - Math.abs(person.age - middle) / halfRange; // від 0 до 1
    ageScore = 0.5 + 0.5 * closeness; // від 0.5 до 1
    reasons.push('Вік у межах ' + gift.minAge + '–' + gift.maxAge);
  } else if (person.age >= gift.minAge - AGE_TOLERANCE && person.age <= gift.maxAge + AGE_TOLERANCE) {
    ageScore = 0.25;
  }

  // 3. Професія.
  // Збіг - повний бал. Якщо подарунок для інших професій або для всіх - нейтральний бал
  // (подарунок для вчителя не стає гіршим для інженера, ніж подарунок для всіх).
  let professionScore = NEUTRAL_SCORE;
  if (gift.professions.includes(person.profession)) {
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
    exactScore: total * 100,
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
    // сортуємо за точним балом; якщо бал однаковий - спочатку дешевший подарунок
    .sort((a, b) => b.exactScore - a.exactScore || a.gift.price - b.gift.price)
    .slice(0, limit)
    .map((r) => ({ gift: r.gift, score: r.score, reasons: r.reasons }));
}
