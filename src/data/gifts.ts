import type { Gift } from '../types';

// Каталог подарунків.
// hobbies / professions / genders: порожній масив означає "підходить для всіх".
// Ціни орієнтовні (грн), реальні ціни дивитися на маркетплейсі.
export const GIFTS: Gift[] = [
  // ---- спорт ----
  { id: 1, title: 'Фітнес-браслет', description: 'Рахує кроки, пульс і сон.', price: 1200, category: 'Гаджети', hobbies: ['спорт', 'технології'], professions: [], minAge: 14, maxAge: 70, genders: [] },
  { id: 2, title: 'Килимок для йоги', description: 'Нековзкий килимок для тренувань вдома.', price: 600, category: 'Спорт', hobbies: ['спорт'], professions: [], minAge: 14, maxAge: 70, genders: [] },
  { id: 3, title: 'Спортивна пляшка для води', description: 'Пляшка 750 мл з фільтром.', price: 350, category: 'Спорт', hobbies: ['спорт', 'туризм'], professions: ['студент'], minAge: 10, maxAge: 60, genders: [] },
  { id: 4, title: 'Набір гантелей', description: 'Розбірні гантелі для домашніх тренувань.', price: 1500, category: 'Спорт', hobbies: ['спорт'], professions: [], minAge: 16, maxAge: 60, genders: ['male'] },

  // ---- читання ----
  { id: 5, title: 'Електронна книга', description: 'Рідер з екраном E-Ink, не втомлює очі.', price: 4500, category: 'Гаджети', hobbies: ['читання', 'технології'], professions: ['вчитель', 'студент'], minAge: 12, maxAge: 80, genders: [] },
  { id: 6, title: 'Сертифікат у книгарню', description: 'Людина сама обере книжку до душі.', price: 500, category: 'Сертифікати', hobbies: ['читання'], professions: ['вчитель'], minAge: 8, maxAge: 99, genders: [] },
  { id: 7, title: 'Лампа для читання', description: 'Маленька лампа на прищіпці для книги.', price: 300, category: 'Дім', hobbies: ['читання'], professions: ['пенсіонер'], minAge: 8, maxAge: 99, genders: [] },

  // ---- музика ----
  { id: 8, title: 'Бездротові навушники', description: 'Bluetooth-навушники з шумозаглушенням.', price: 2500, category: 'Гаджети', hobbies: ['музика', 'технології'], professions: ['програміст', 'студент'], minAge: 12, maxAge: 60, genders: [] },
  { id: 9, title: 'Портативна колонка', description: 'Невелика колонка для дому і пікніків.', price: 1800, category: 'Гаджети', hobbies: ['музика', 'подорожі', 'туризм'], professions: [], minAge: 12, maxAge: 60, genders: [] },
  { id: 10, title: 'Укулеле для початківців', description: 'Маленька гітара, легко навчитися грати.', price: 1400, category: 'Музика', hobbies: ['музика'], professions: [], minAge: 8, maxAge: 50, genders: [] },
  { id: 11, title: 'Програвач вінілу', description: 'Ретро-програвач для платівок.', price: 5000, category: 'Музика', hobbies: ['музика'], professions: [], minAge: 20, maxAge: 70, genders: [] },

  // ---- ігри ----
  { id: 12, title: 'Настільна гра «Каркасон»', description: 'Популярна гра для компанії 2–5 людей.', price: 900, category: 'Ігри', hobbies: ['ігри'], professions: ['студент', 'вчитель'], minAge: 8, maxAge: 99, genders: [] },
  { id: 13, title: 'Ігрова миша', description: 'Мишка з підсвіткою для комп\'ютерних ігор.', price: 1100, category: 'Гаджети', hobbies: ['ігри', 'технології'], professions: ['програміст', 'студент'], minAge: 10, maxAge: 45, genders: [] },
  { id: 14, title: 'Геймпад для ПК', description: 'Бездротовий джойстик для ігор.', price: 1500, category: 'Гаджети', hobbies: ['ігри'], professions: [], minAge: 8, maxAge: 45, genders: [] },
  { id: 15, title: 'Пазл на 1000 елементів', description: 'Гарна картинка, на кілька вечорів.', price: 450, category: 'Ігри', hobbies: ['ігри', 'рукоділля'], professions: ['пенсіонер'], minAge: 10, maxAge: 99, genders: [] },

  // ---- кулінарія ----
  { id: 16, title: 'Набір кухонних ножів', description: 'Набір з 5 ножів з підставкою.', price: 2200, category: 'Кухня', hobbies: ['кулінарія'], professions: ['кухар'], minAge: 20, maxAge: 80, genders: [] },
  { id: 17, title: 'Книга рецептів', description: 'Рецепти української кухні з фото.', price: 450, category: 'Книги', hobbies: ['кулінарія', 'читання'], professions: ['кухар'], minAge: 16, maxAge: 99, genders: [] },
  { id: 18, title: 'Набір спецій', description: '12 спецій у гарних баночках.', price: 600, category: 'Кухня', hobbies: ['кулінарія'], professions: [], minAge: 18, maxAge: 99, genders: [] },
  { id: 19, title: 'Кавоварка-турка електрична', description: 'Для тих, хто любить каву зранку.', price: 1300, category: 'Кухня', hobbies: ['кулінарія'], professions: ['програміст', 'менеджер', 'бухгалтер'], minAge: 18, maxAge: 80, genders: [] },

  // ---- подорожі / туризм ----
  { id: 20, title: 'Дорожня подушка', description: 'Подушка для шиї в літак чи автобус.', price: 400, category: 'Подорожі', hobbies: ['подорожі'], professions: ['менеджер'], minAge: 10, maxAge: 80, genders: [] },
  { id: 21, title: 'Скретч-карта світу', description: 'Карта, на якій можна «стирати» відвідані країни.', price: 500, category: 'Подорожі', hobbies: ['подорожі'], professions: [], minAge: 12, maxAge: 70, genders: [] },
  { id: 22, title: 'Туристичний рюкзак 40 л', description: 'Зручний рюкзак для походів.', price: 2000, category: 'Туризм', hobbies: ['туризм', 'подорожі'], professions: [], minAge: 14, maxAge: 60, genders: [] },
  { id: 23, title: 'Термос', description: 'Тримає чай гарячим 12 годин.', price: 700, category: 'Туризм', hobbies: ['туризм', 'риболовля'], professions: ['водій'], minAge: 14, maxAge: 99, genders: [] },
  { id: 24, title: 'Налобний ліхтарик', description: 'Яскравий ліхтарик для походів.', price: 450, category: 'Туризм', hobbies: ['туризм', 'риболовля'], professions: [], minAge: 12, maxAge: 70, genders: [] },

  // ---- фотографія ----
  { id: 25, title: 'Штатив для телефону', description: 'Гнучкий штатив з пультом.', price: 500, category: 'Фото', hobbies: ['фотографія'], professions: [], minAge: 12, maxAge: 60, genders: [] },
  { id: 26, title: 'Фотокамера миттєвого друку', description: 'Фото друкується одразу після зйомки.', price: 3500, category: 'Фото', hobbies: ['фотографія', 'подорожі'], professions: [], minAge: 12, maxAge: 40, genders: [] },
  { id: 27, title: 'Фотоальбом ручної роботи', description: 'Альбом для друкованих фото.', price: 700, category: 'Фото', hobbies: ['фотографія', 'рукоділля'], professions: [], minAge: 16, maxAge: 99, genders: ['female'] },

  // ---- рукоділля / малювання ----
  { id: 28, title: 'Набір для вишивання', description: 'Набір з нитками і схемою.', price: 400, category: 'Хобі', hobbies: ['рукоділля'], professions: ['пенсіонер'], minAge: 10, maxAge: 99, genders: ['female'] },
  { id: 29, title: 'Набір для в\'язання', description: 'Пряжа, спиці та інструкція.', price: 650, category: 'Хобі', hobbies: ['рукоділля'], professions: [], minAge: 12, maxAge: 99, genders: [] },
  { id: 30, title: 'Скетчбук і маркери', description: 'Альбом і 36 двосторонніх маркерів.', price: 900, category: 'Хобі', hobbies: ['малювання'], professions: ['дизайнер', 'студент'], minAge: 8, maxAge: 60, genders: [] },
  { id: 31, title: 'Графічний планшет', description: 'Для малювання на комп\'ютері.', price: 2500, category: 'Гаджети', hobbies: ['малювання', 'технології'], professions: ['дизайнер'], minAge: 14, maxAge: 60, genders: [] },
  { id: 32, title: 'Набір акварельних фарб', description: '24 кольори і пензлі.', price: 550, category: 'Хобі', hobbies: ['малювання'], professions: ['вчитель'], minAge: 6, maxAge: 99, genders: [] },

  // ---- садівництво ----
  { id: 33, title: 'Набір садових інструментів', description: 'Лопатка, грабельки, рукавиці.', price: 700, category: 'Сад', hobbies: ['садівництво'], professions: ['пенсіонер'], minAge: 25, maxAge: 99, genders: [] },
  { id: 34, title: 'Набір для вирощування мікрозелені', description: 'Можна вирощувати зелень на підвіконні.', price: 450, category: 'Сад', hobbies: ['садівництво', 'кулінарія'], professions: [], minAge: 12, maxAge: 99, genders: [] },

  // ---- технології ----
  { id: 35, title: 'Механічна клавіатура', description: 'Клавіатура з підсвіткою.', price: 2300, category: 'Гаджети', hobbies: ['технології', 'ігри'], professions: ['програміст'], minAge: 14, maxAge: 55, genders: [] },
  { id: 36, title: 'Павербанк 20000 мА·год', description: 'Зарядка для телефону в дорогу.', price: 1000, category: 'Гаджети', hobbies: ['технології', 'подорожі'], professions: ['менеджер', 'студент'], minAge: 12, maxAge: 70, genders: [] },
  { id: 37, title: 'Розумна колонка', description: 'Колонка з голосовим помічником.', price: 2800, category: 'Гаджети', hobbies: ['технології', 'музика'], professions: [], minAge: 14, maxAge: 70, genders: [] },

  // ---- кіно ----
  { id: 38, title: 'Міні-проєктор', description: 'Кінотеатр вдома на стіні.', price: 3500, category: 'Гаджети', hobbies: ['кіно', 'технології'], professions: [], minAge: 14, maxAge: 70, genders: [] },
  { id: 39, title: 'Підписка на онлайн-кінотеатр', description: 'Підписка на 6 місяців.', price: 900, category: 'Сертифікати', hobbies: ['кіно'], professions: [], minAge: 16, maxAge: 99, genders: [] },
  { id: 40, title: 'Набір для попкорну', description: 'Машинка для попкорну і миски.', price: 1100, category: 'Кухня', hobbies: ['кіно', 'кулінарія'], professions: [], minAge: 8, maxAge: 70, genders: [] },

  // ---- риболовля ----
  { id: 41, title: 'Набір риболовних снастей', description: 'Гачки, поплавки, волосінь у коробці.', price: 800, category: 'Риболовля', hobbies: ['риболовля'], professions: ['пенсіонер'], minAge: 12, maxAge: 99, genders: [] },
  { id: 42, title: 'Розкладний стілець рибалки', description: 'Легкий стілець з підсклянником.', price: 900, category: 'Риболовля', hobbies: ['риболовля', 'туризм'], professions: [], minAge: 16, maxAge: 99, genders: ['male'] },

  // ---- автомобілі ----
  { id: 43, title: 'Автомобільний пилосос', description: 'Компактний пилосос від прикурювача.', price: 1200, category: 'Авто', hobbies: ['автомобілі'], professions: ['водій'], minAge: 18, maxAge: 80, genders: [] },
  { id: 44, title: 'Відеореєстратор', description: 'Записує дорогу в Full HD.', price: 2000, category: 'Авто', hobbies: ['автомобілі', 'технології'], professions: ['водій'], minAge: 18, maxAge: 80, genders: [] },
  { id: 45, title: 'Тримач телефону в авто', description: 'Магнітний тримач на решітку.', price: 300, category: 'Авто', hobbies: ['автомобілі'], professions: ['водій', 'менеджер'], minAge: 18, maxAge: 80, genders: [] },

  // ---- універсальні ----
  { id: 46, title: 'Термочашка', description: 'Чашка, яка довго тримає тепло.', price: 500, category: 'Універсальні', hobbies: [], professions: ['вчитель', 'лікар', 'бухгалтер', 'менеджер'], minAge: 16, maxAge: 99, genders: [] },
  { id: 47, title: 'Плед з рукавами', description: 'Теплий плед для вечорів.', price: 800, category: 'Універсальні', hobbies: [], professions: ['пенсіонер', 'лікар'], minAge: 10, maxAge: 99, genders: [] },
  { id: 48, title: 'Щоденник-планер', description: 'Планер на рік у гарній обкладинці.', price: 400, category: 'Універсальні', hobbies: [], professions: ['студент', 'менеджер', 'вчитель', 'бухгалтер'], minAge: 12, maxAge: 70, genders: [] },
  { id: 49, title: 'Ароматична свічка', description: 'Свічка з натурального воску.', price: 350, category: 'Універсальні', hobbies: [], professions: [], minAge: 16, maxAge: 99, genders: ['female'] },
  { id: 50, title: 'Масажер для шиї', description: 'Допомагає розслабитися після роботи.', price: 1300, category: 'Здоров\'я', hobbies: [], professions: ['програміст', 'лікар', 'бухгалтер', 'водій'], minAge: 20, maxAge: 99, genders: [] },
];
