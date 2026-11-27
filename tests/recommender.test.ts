import { describe, it, expect } from 'vitest';
import { scoreGift, recommend, WEIGHTS } from '../src/recommender';
import { GIFTS } from '../src/data/gifts';
import type { Gift, Person } from '../src/types';

// Тестова людина
const olena: Person = {
  id: 'test-1',
  name: 'Олена',
  age: 25,
  gender: 'female',
  profession: 'дизайнер',
  hobbies: ['малювання', 'фотографія'],
  createdAt: 0,
};

// Тестовий подарунок, який підходить під усе
const perfectGift: Gift = {
  id: 999,
  title: 'Тестовий подарунок',
  description: 'для тесту',
  price: 100,
  category: 'Тест',
  hobbies: ['малювання', 'фотографія', 'музика'],
  professions: ['дизайнер'],
  minAge: 18,
  maxAge: 30,
  genders: [],
};

describe('recommender', () => {
  it('сума коефіцієнтів дорівнює 1, а хобі має найбільший коефіцієнт', () => {
    const sum = WEIGHTS.hobby + WEIGHTS.age + WEIGHTS.profession + WEIGHTS.gender;
    expect(sum).toBeCloseTo(1);
    expect(WEIGHTS.hobby).toBeGreaterThan(WEIGHTS.age);
    expect(WEIGHTS.hobby).toBeGreaterThan(WEIGHTS.profession);
    expect(WEIGHTS.hobby).toBeGreaterThan(WEIGHTS.gender);
  });

  it('подарунок з потрібним хобі отримує більший бал, ніж без нього', () => {
    const tablet = GIFTS.find((g) => g.title === 'Графічний планшет')!; // малювання
    const fishing = GIFTS.find((g) => g.title === 'Набір риболовних снастей')!; // риболовля
    expect(scoreGift(olena, tablet).score).toBeGreaterThan(scoreGift(olena, fishing).score);
  });

  it('бал завжди від 0 до 100', () => {
    // людина, у якої всі 3 хобі збігаються з подарунком
    const manyHobbies: Person = { ...olena, hobbies: ['малювання', 'фотографія', 'музика'] };
    const result = scoreGift(manyHobbies, perfectGift);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);

    for (const gift of GIFTS) {
      const r = scoreGift(olena, gift);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });

  it('recommend повертає не більше 5 подарунків, відсортованих за балом', () => {
    const result = recommend(olena, GIFTS);
    expect(result.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
    }
  });

  it('у рекомендації є причина з хобі', () => {
    const r = scoreGift(olena, perfectGift);
    expect(r.reasons).toContain('Підходить під хобі: малювання, фотографія');
  });

  it('з бюджетом 1000 грн немає подарунків дорожче 1000 (v1.1)', () => {
    const result = recommend({ ...olena, budget: 1000 }, GIFTS);
    expect(result.length).toBeGreaterThan(0);
    for (const r of result) {
      expect(r.gift.price).toBeLessThanOrEqual(1000);
    }
  });

  it('без бюджету можуть бути дорогі подарунки (v1.1)', () => {
    const result = recommend(olena, GIFTS);
    expect(result.some((r) => r.gift.price > 1000)).toBe(true);
  });

  // ---- BUG-5: у багатьох подарунків був однаковий відсоток ----

  it('подарунок тільки про хобі людини має більший бал, ніж подарунок про багато різних хобі (BUG-5)', () => {
    const onlyDrawing: Gift = { ...perfectGift, hobbies: ['малювання'] };
    const manyThings: Gift = { ...perfectGift, hobbies: ['малювання', 'спорт', 'кіно'] };
    expect(scoreGift(olena, onlyDrawing).score).toBeGreaterThan(scoreGift(olena, manyThings).score);
  });

  it('подарунок під обидва хобі людини має більший бал, ніж під одне (BUG-5)', () => {
    const bothHobbies: Gift = { ...perfectGift, hobbies: ['малювання', 'фотографія'] };
    const oneHobby: Gift = { ...perfectGift, hobbies: ['малювання', 'кіно'] };
    expect(scoreGift(olena, bothHobbies).score).toBeGreaterThan(scoreGift(olena, oneHobby).score);
  });

  it('вік ближче до середини вікового діапазону дає більший бал (BUG-5)', () => {
    const middle: Gift = { ...perfectGift, minAge: 15, maxAge: 35 }; // середина 25
    const edge: Gift = { ...perfectGift, minAge: 25, maxAge: 45 }; // 25 - на краю
    expect(scoreGift(olena, middle).score).toBeGreaterThan(scoreGift(olena, edge).score);
  });

  it('подарунок для іншої професії не гірший, ніж подарунок для всіх (BUG-5)', () => {
    const forTeacher: Gift = { ...perfectGift, professions: ['вчитель'] };
    const forAll: Gift = { ...perfectGift, professions: [] };
    expect(scoreGift(olena, forTeacher).score).toBe(scoreGift(olena, forAll).score);
  });

  it('для Олени (лікар, кулінарія і подорожі, бюджет 2000) у топ-5 не всі бали однакові (BUG-5)', () => {
    const doctor: Person = { ...olena, profession: 'лікар', hobbies: ['кулінарія', 'подорожі'], budget: 2000 };
    const result = recommend(doctor, GIFTS);
    const differentScores = new Set(result.map((r) => r.score));
    expect(result.length).toBe(5);
    expect(differentScores.size).toBeGreaterThan(1);
  });

  it('якщо каталог порожній - повертає порожній масив', () => {
    expect(recommend(olena, [])).toEqual([]);
  });

  it('подарунок не для тієї статі отримує менший бал', () => {
    const forMen: Gift = { ...perfectGift, genders: ['male'] };
    expect(scoreGift(olena, forMen).score).toBeLessThan(scoreGift(olena, perfectGift).score);
  });
});
