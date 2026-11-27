# Практична робота №10. Командна робота з Git та GitHub

## Мета

Навчитися використовувати Git для спільної розробки програмного продукту.

> Я працюю індивідуально, тому «окремі гілки для учасників» я замінив на окремі гілки для кожної задачі. Процес (гілка → Pull Request → code review → виправлення → merge) такий самий, як у команді, тільки рев'ю я роблю сам собі.

## Хід роботи

### 1. Окремі гілки

Гілки, які я створював у проєкті:

| Гілка | Для чого |
|---|---|
| `feature/project-structure` | структура проєкту |
| `docs/readme-features` | розділ «Можливості» в README |
| `docs/readme-tech` | розділ «Технології» в README |
| `feature/add-person` | US-01 додавання людини |
| `feature/recommendations` | US-03, US-06 підбір і маркетплейси |
| `feature/edit-delete` | US-04, US-05 редагування і видалення |
| `feature/search-sort` | US-07, US-08 пошук і сортування |
| `feature/stats-export` | US-09, US-10 статистика, експорт/імпорт |
| `feature/auto-tests` | автоматичні тести |
| `fix/bug-1-age-decimal`, `fix/bug-2-search-case`, `fix/bug-3-html-in-name` | виправлення помилок |
| `feature/budget` | нова вимога — бюджет |
| `feature/footer-version` | версія у футері (гілка для Pull Request у цій практичній) |

### 2. Зміни у власній гілці

Для демонстрації Pull Request я зробив маленьку зміну: показати назву і версію застосунку у футері.

```bash
git checkout main
git pull
git checkout -b feature/footer-version
# змінив рядок у index.html
git add index.html
git commit -m "Футер: додано назву і версію застосунку"
git push -u origin feature/footer-version
```

### 3. Створення Pull Request

На GitHub після push з'явилась кнопка **Compare & pull request**. Я створив Pull Request:

- **base:** `main` ← **compare:** `feature/footer-version`
- **Назва:** Футер: назва і версія застосунку
- **Опис:**
  > Що зроблено: у футері тепер написано «GiftMatch v1.1.0», щоб на демонстрації було видно версію.
  > Як перевірити: `npm run dev`, прокрутити сторінку вниз.

Посилання на PR: **[вставити посилання на Pull Request]**

### 4. Code review

Я відкрив вкладку **Files changed**, переглянув зміни і залишив коментар до рядка у `index.html`:

> 💬 У футері немає посилання на репозиторій. На захисті буде зручно, щоб можна було одразу перейти на GitHub. Додай посилання.

Після цього натиснув **Finish your review → Comment → Submit review**. На власний Pull Request GitHub не дозволяє ставити «Request changes» чи «Approve», тому рев'ю я залишив у вигляді коментаря.

Що я перевіряв під час рев'ю (свій маленький чек-лист):
- зміна робить те, що написано в описі;
- нічого зайвого не потрапило в коміт;
- текст українською без помилок;
- `npm run build` і `npm test` проходять.

### 5. Виправлення зауважень

У тій самій гілці додав посилання:

```html
<footer class="footer">
  GiftMatch v1.1.0 · Навчальний проєкт · Основи програмної інженерії · 2026 ·
  <a href="https://github.com/[ваш-логін]/gift-match" target="_blank">GitHub</a>
</footer>
```

```bash
git add index.html
git commit -m "Футер: додано посилання на GitHub (виправлення після рев'ю)"
git push
```

Новий коміт автоматично з'явився в тому самому Pull Request. Коментар я позначив як **Resolve conversation**.

### 6. Merge

Після виправлення натиснув **Merge pull request → Confirm merge**, а потім **Delete branch**. Локально оновив `main`:

```bash
git checkout main
git pull
git branch -d feature/footer-version
```

### 7. Ситуація виникнення конфлікту

Конфлікт виникає, коли дві гілки змінюють **той самий рядок** у файлі, і Git не знає, який варіант залишити.

Я створив дві гілки від `main`, і обидві змінили один і той самий рядок «Проєкт у розробці.» у `README.md`:
- `docs/readme-features` — замінила його на розділ «Можливості»;
- `docs/readme-tech` — замінила його на розділ «Технології».

Першу гілку я злив без проблем, а при злитті другої:

```
$ git merge --no-ff docs/readme-tech
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

### 8. Вирішення простого merge conflict

Git позначив конфлікт у файлі так:

```
<<<<<<< HEAD
## Можливості

- додавання, редагування і видалення людей
- підбір топ-5 подарунків з урахуванням коефіцієнтів
- посилання на маркетплейси (Rozetka, Prom.ua, Allo)

Статус: у розробці.
=======
## Технології

- TypeScript
- Vite
- localStorage для збереження даних

Статус: проєкт у розробці.
>>>>>>> docs/readme-tech
```

- між `<<<<<<< HEAD` і `=======` — те, що вже є в `main`;
- між `=======` і `>>>>>>>` — те, що прийшло з гілки.

Мені потрібні **обидва** розділи, тому я залишив обидва, а рядок «Статус» — тільки один раз. Видалив позначки `<<<<<<<`, `=======`, `>>>>>>>` і завершив злиття:

```bash
git add README.md
git commit -m "Merge branch 'docs/readme-tech' (вирішено конфлікт у README.md)"
```

Історія після цього виглядає так (`git log --oneline --graph`):

```
*   Merge branch 'docs/readme-tech' (вирішено конфлікт у README.md)
|\
| * README: додано розділ Технології
* |   Merge branch 'docs/readme-features'
|\ \
| |/
|/|
| * README: додано список можливостей
|/
*   Merge branch 'feature/project-structure'
```

Пізніше, у практичній №14, був ще один конфлікт — вже в коді (див. той звіт).

## Результат

GitHub-репозиторій з налаштованим workflow: гілка на кожну задачу → Pull Request → рев'ю → виправлення → merge.

## Висновок

Я навчився працювати з гілками і Pull Request, робити code review і вирішувати merge conflict. Конфлікт — це не страшно, головне уважно подивитися, що є в обох версіях, і залишити правильний варіант.
