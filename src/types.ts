// Основні типи даних програми

export type Gender = 'male' | 'female' | 'other';

// Людина, якій шукаємо подарунок
export interface Person {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  profession: string;
  hobbies: string[];
  budget?: number; // максимальна ціна подарунка, грн (необов'язково) - додано у версії 1.1
  createdAt: number; // дата додавання (мілісекунди)
}

// Дані з форми (без id і дати, їх створює програма)
export type PersonData = Omit<Person, 'id' | 'createdAt'>;

// Подарунок з каталогу
export interface Gift {
  id: number;
  title: string;
  description: string;
  price: number; // орієнтовна ціна в гривнях
  category: string;
  hobbies: string[]; // для яких хобі підходить (порожній масив = універсальний)
  professions: string[]; // для яких професій (порожній масив = для всіх)
  minAge: number;
  maxAge: number;
  genders: Gender[]; // порожній масив = для всіх
}

// Результат підбору
export interface Recommendation {
  gift: Gift;
  score: number; // від 0 до 100
  reasons: string[];
}

export interface Marketplace {
  id: string;
  name: string;
  searchUrl: string; // адреса пошуку, в кінець додається текст запиту
}
