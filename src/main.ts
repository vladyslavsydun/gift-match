import './style.css';
import type { Gender, Person, PersonData } from './types';
import { HOBBIES, PROFESSIONS, GENDER_LABELS } from './data/options';
import { PersonStore, sortPeople } from './storage';
import type { SortMode } from './storage';
import { validatePerson } from './validation';
import { GIFTS } from './data/gifts';
import { recommend } from './recommender';
import { MARKETPLACES, buildMarketplaceUrl } from './marketplaces';
import { ClickStats, getTopHobby } from './stats';

// Головний файл. Тут вся робота з інтерфейсом (HTML).

const store = new PersonStore();
const clickStats = new ClickStats();

// Елементи сторінки
const form = document.getElementById('person-form') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const ageInput = document.getElementById('age') as HTMLInputElement;
const professionSelect = document.getElementById('profession') as HTMLSelectElement;
const hobbiesBox = document.getElementById('hobbies') as HTMLDivElement;
const errorsBox = document.getElementById('form-errors') as HTMLDivElement;
const peopleList = document.getElementById('people-list') as HTMLDivElement;
const peopleCount = document.getElementById('people-count') as HTMLSpanElement;
const messageBox = document.getElementById('message') as HTMLDivElement;
const searchInput = document.getElementById('search') as HTMLInputElement;
const sortSelect = document.getElementById('sort') as HTMLSelectElement;
const recTitle = document.getElementById('rec-title') as HTMLHeadingElement;
const recList = document.getElementById('rec-list') as HTMLDivElement;
const statsContent = document.getElementById('stats-content') as HTMLDivElement;
const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
const importInput = document.getElementById('import-input') as HTMLInputElement;
const formTitle = document.getElementById('form-title') as HTMLHeadingElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;

// id людини, яку зараз редагуємо (null - режим додавання)
let editingId: string | null = null;

// ---------- Перемикання сторінок ----------

function showPage(page: string): void {
  document.querySelectorAll('.page').forEach((el) => el.classList.add('hidden'));
  document.getElementById('page-' + page)?.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.page === page);
  });
}

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const page = (btn as HTMLElement).dataset.page || 'people';
    if (page === 'stats') {
      renderStats();
    }
    showPage(page);
  });
});

// ---------- Форма ----------

// Заповнюємо список професій і чекбокси хобі
function fillFormOptions(): void {
  professionSelect.innerHTML = PROFESSIONS.map((p) => `<option value="${p}">${p}</option>`).join('');

  hobbiesBox.innerHTML = HOBBIES.map(
    (h) => `<label><input type="checkbox" name="hobby" value="${h}" /> ${h}</label>`
  ).join('');
}

// Збирає дані з форми в об'єкт
function readForm(): PersonData {
  const gender = (document.querySelector('input[name="gender"]:checked') as HTMLInputElement).value;
  const hobbies: string[] = [];
  document.querySelectorAll<HTMLInputElement>('input[name="hobby"]:checked').forEach((cb) => {
    hobbies.push(cb.value);
  });

  return {
    name: nameInput.value,
    age: Number(ageInput.value),
    gender: gender as Gender,
    profession: professionSelect.value,
    hobbies: hobbies,
  };
}

function showErrors(errors: string[]): void {
  errorsBox.innerHTML = errors.map((e) => `<div>⚠ ${e}</div>`).join('');
}

function clearForm(): void {
  form.reset();
  showErrors([]);
  editingId = null;
  formTitle.textContent = 'Додати людину';
  submitBtn.textContent = 'Додати';
  cancelBtn.classList.add('hidden');
}

// Підставляє дані людини у форму для редагування
function fillForm(p: Person): void {
  nameInput.value = p.name;
  ageInput.value = String(p.age);
  (document.querySelector(`input[name="gender"][value="${p.gender}"]`) as HTMLInputElement).checked = true;
  professionSelect.value = p.profession;
  document.querySelectorAll<HTMLInputElement>('input[name="hobby"]').forEach((cb) => {
    cb.checked = p.hobbies.includes(cb.value);
  });

  editingId = p.id;
  formTitle.textContent = 'Редагувати: ' + p.name;
  submitBtn.textContent = 'Зберегти зміни';
  cancelBtn.classList.remove('hidden');
  showErrors([]);
  nameInput.focus();
}

cancelBtn.addEventListener('click', () => clearForm());

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm();
  const errors = validatePerson(data);

  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  data.name = data.name.trim();
  if (editingId) {
    store.update(editingId, data);
    showMessage('Зміни збережено');
  } else {
    store.add(data);
    showMessage('Людину додано');
  }
  clearForm();
  renderPeople();
});

// ---------- Список людей ----------

function renderPeople(): void {
  const all = store.getAll();
  peopleCount.textContent = String(all.length);

  if (all.length === 0) {
    peopleList.innerHTML = '<p class="empty">Список порожній. Додайте першу людину.</p>';
    return;
  }

  const found = store.search(searchInput.value);
  const people = sortPeople(found, sortSelect.value as SortMode);

  if (people.length === 0) {
    peopleList.innerHTML = '<p class="empty">Нікого не знайдено.</p>';
    return;
  }

  peopleList.innerHTML = people.map((p) => personCard(p)).join('');
}

searchInput.addEventListener('input', () => renderPeople());
sortSelect.addEventListener('change', () => renderPeople());

function personCard(p: Person): string {
  const hobbies = p.hobbies.map((h) => `<span class="tag">#${h}</span>`).join(' ');
  return `
    <div class="person">
      <div class="person-title">${p.name}, ${p.age}</div>
      <div class="person-info">${p.profession} · ${GENDER_LABELS[p.gender]}</div>
      <div>${hobbies}</div>
      <div class="person-buttons">
        <button class="btn btn-primary" data-action="recommend" data-id="${p.id}">🎁 Підібрати подарунок</button>
        <button class="btn" data-action="edit" data-id="${p.id}">Редагувати</button>
        <button class="btn btn-danger" data-action="delete" data-id="${p.id}">Видалити</button>
      </div>
    </div>`;
}

// Кнопки на картках (одним обробником для всього списку)
peopleList.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest('button');
  if (!button) return;
  const id = button.dataset.id || '';
  const person = store.getById(id);
  if (!person) return;

  if (button.dataset.action === 'recommend') {
    showRecommendations(id);
  }

  if (button.dataset.action === 'edit') {
    fillForm(person);
  }

  if (button.dataset.action === 'delete') {
    if (confirm('Видалити ' + person.name + '?')) {
      store.remove(id);
      if (editingId === id) {
        clearForm();
      }
      showMessage('Видалено');
      renderPeople();
    }
  }
});

// ---------- Рекомендації ----------

function showRecommendations(personId: string): void {
  const person = store.getById(personId);
  if (!person) {
    showMessage('Людину не знайдено', true);
    return;
  }

  recTitle.textContent = `Подарунки для: ${person.name} (${person.age}, ${person.profession})`;
  const recommendations = recommend(person, GIFTS);

  if (recommendations.length === 0) {
    recList.innerHTML = '<p class="empty">На жаль, нічого не знайдено.</p>';
  } else {
    recList.innerHTML = recommendations
      .map((r, index) => {
        const reasons = r.reasons.map((text) => `<li>✓ ${text}</li>`).join('');
        const links = MARKETPLACES.map(
          (m) =>
            `<a class="btn mp-btn" href="${buildMarketplaceUrl(m, r.gift.title)}" target="_blank" rel="noopener" data-mp="${m.id}">${m.name}</a>`
        ).join(' ');

        return `
          <div class="gift">
            <div class="gift-header">
              <div class="gift-title">${index + 1}. ${r.gift.title}</div>
              <div class="gift-score">${r.score}%</div>
            </div>
            <div class="progress"><div class="progress-bar" style="width: ${r.score}%"></div></div>
            <div class="gift-desc">${r.gift.description} <b>~ ${r.gift.price} грн</b> · ${r.gift.category}</div>
            <ul class="reasons">${reasons}</ul>
            <div class="gift-links">Купити: ${links}</div>
          </div>`;
      })
      .join('');
  }

  showPage('recommendations');
}

document.getElementById('back-btn')?.addEventListener('click', () => showPage('people'));

// Рахуємо переходи на маркетплейси (посилання відкривається саме, ми тільки рахуємо)
recList.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement).closest('a');
  if (link && link.dataset.mp) {
    clickStats.registerClick(link.dataset.mp);
  }
});

// ---------- Статистика ----------

function renderStats(): void {
  const people = store.getAll();
  const topHobby = getTopHobby(people);
  const total = clickStats.getTotal();

  // найбільше значення - для ширини смужок
  const max = Math.max(1, ...MARKETPLACES.map((m) => clickStats.getCount(m.id)));

  const rows = MARKETPLACES.map((m) => {
    const count = clickStats.getCount(m.id);
    const width = Math.round((count / max) * 100);
    return `
      <div class="stat-row">
        <span class="stat-name">${m.name}</span>
        <div class="progress stat-bar"><div class="progress-bar" style="width: ${width}%"></div></div>
        <span class="stat-value">${count}</span>
      </div>`;
  }).join('');

  statsContent.innerHTML = `
    <div class="stat-cards">
      <div class="card stat-card"><div class="stat-label">Людей у списку</div><div class="stat-number">${people.length}</div></div>
      <div class="card stat-card"><div class="stat-label">Найпопулярніше хобі</div><div class="stat-number">${topHobby || '—'}</div></div>
      <div class="card stat-card"><div class="stat-label">Подарунків у каталозі</div><div class="stat-number">${GIFTS.length}</div></div>
    </div>
    <div class="card">
      <h2>Переходи на маркетплейси (всього: ${total})</h2>
      ${rows}
    </div>`;
}

// ---------- Експорт / імпорт ----------

exportBtn.addEventListener('click', () => {
  const blob = new Blob([store.exportJson()], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'giftmatch-people.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

importInput.addEventListener('change', () => {
  const file = importInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const added = store.importJson(String(reader.result));
      showMessage('Імпортовано людей: ' + added);
      renderPeople();
    } catch (e) {
      showMessage((e as Error).message, true);
    }
    importInput.value = ''; // щоб можна було вибрати той самий файл ще раз
  };
  reader.onerror = () => showMessage('Не вдалося прочитати файл', true);
  reader.readAsText(file);
});

// ---------- Повідомлення ----------

function showMessage(text: string, isError = false): void {
  messageBox.textContent = text;
  messageBox.classList.remove('hidden');
  messageBox.classList.toggle('message-error', isError);
  setTimeout(() => messageBox.classList.add('hidden'), 3000);
}

// ---------- Запуск ----------

fillFormOptions();
const loadError = store.load();
if (loadError) {
  showMessage(loadError, true);
}
renderPeople();
