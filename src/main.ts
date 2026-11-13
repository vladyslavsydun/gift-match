import './style.css';
import type { Gender, Person, PersonData } from './types';
import { HOBBIES, PROFESSIONS, GENDER_LABELS } from './data/options';
import { PersonStore } from './storage';
import { validatePerson } from './validation';
import { GIFTS } from './data/gifts';
import { recommend } from './recommender';
import { MARKETPLACES, buildMarketplaceUrl } from './marketplaces';

// Головний файл. Тут вся робота з інтерфейсом (HTML).

const store = new PersonStore();

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
const recTitle = document.getElementById('rec-title') as HTMLHeadingElement;
const recList = document.getElementById('rec-list') as HTMLDivElement;
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
    showPage((btn as HTMLElement).dataset.page || 'people');
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
  const people = store.getAll();
  peopleCount.textContent = String(people.length);

  if (people.length === 0) {
    peopleList.innerHTML = '<p class="empty">Список порожній. Додайте першу людину.</p>';
    return;
  }

  peopleList.innerHTML = people.map((p) => personCard(p)).join('');
}

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
