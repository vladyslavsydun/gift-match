import './style.css';

// Головний файл. Тут буде вся робота з інтерфейсом.

// Перемикання сторінок
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

// TODO: форма, список, рекомендації, статистика
