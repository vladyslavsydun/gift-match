import './style.css';
import type { Gender, Person, PersonData } from './types';
import { HOBBIES, PROFESSIONS, GENDER_LABELS } from './data/options';
import { PersonStore } from './storage';
import { validatePerson } from './validation';

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
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm();
  const errors = validatePerson(data);

  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  store.add(data);
  showMessage('Людину додано');
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
    </div>`;
}

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
