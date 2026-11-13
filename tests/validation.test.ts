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

  it('без хобі - помилка', () => {
    expect(validatePerson({ ...good, hobbies: [] })).toContain('Оберіть хоча б одне хобі');
  });

  it('професія не зі списку - помилка', () => {
    expect(validatePerson({ ...good, profession: 'космонавт' })).toContain('Оберіть професію зі списку');
  });
});
