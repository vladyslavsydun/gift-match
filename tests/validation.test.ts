import { describe, it, expect } from 'vitest';
import { validatePerson } from '../src/validation';
import type { PersonData } from '../src/types';

const good: PersonData = {
  name: 'Петро',
  age: 52,
  gender: 'male',
  profession: 'інженер',
  hobbies: ['риболовля'],
};

describe('validatePerson', () => {
  it('правильні дані - помилок немає', () => {
    expect(validatePerson(good)).toEqual([]);
  });

  it("ім'я з 1 символу - помилка", () => {
    expect(validatePerson({ ...good, name: 'П' })).toContain("Ім'я має містити від 2 до 50 символів");
  });

  it('вік 0 і 121 - помилка', () => {
    expect(validatePerson({ ...good, age: 0 }).length).toBe(1);
    expect(validatePerson({ ...good, age: 121 }).length).toBe(1);
  });

  it('дробовий вік (25.5) - помилка (BUG-1)', () => {
    expect(validatePerson({ ...good, age: 25.5 })).toContain('Вік має бути цілим числом від 1 до 120');
  });

  it('без хобі - помилка', () => {
    expect(validatePerson({ ...good, hobbies: [] })).toContain('Оберіть хоча б одне хобі');
  });

  it('бюджет необов\'язковий, а 1000 грн - правильний (v1.1)', () => {
    expect(validatePerson(good)).toEqual([]);
    expect(validatePerson({ ...good, budget: 1000 })).toEqual([]);
  });

  it('бюджет 10 грн або 200000 грн - помилка (v1.1)', () => {
    expect(validatePerson({ ...good, budget: 10 })).toContain('Бюджет має бути цілим числом від 50 до 100000 грн');
    expect(validatePerson({ ...good, budget: 200000 })).toContain('Бюджет має бути цілим числом від 50 до 100000 грн');
  });

  it('професія не зі списку - помилка', () => {
    expect(validatePerson({ ...good, profession: 'космонавт' })).toContain('Оберіть професію зі списку');
  });
});
