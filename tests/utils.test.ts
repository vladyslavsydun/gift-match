import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../src/utils';

describe('escapeHtml', () => {
  it('замінює теги на безпечний текст (BUG-3)', () => {
    expect(escapeHtml('<b>Тест</b>')).toBe('&lt;b&gt;Тест&lt;/b&gt;');
  });

  it('звичайний текст не змінює', () => {
    expect(escapeHtml("Олена")).toBe('Олена');
  });
});
