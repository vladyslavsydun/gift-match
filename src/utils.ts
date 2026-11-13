// Допоміжні функції

// Замінює спецсимволи HTML, щоб текст користувача показувався як текст,
// а не як HTML-код (наприклад, ім'я "<b>Тест</b>").
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
