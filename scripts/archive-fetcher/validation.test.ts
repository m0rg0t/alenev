import { describe, expect, test } from 'bun:test';
import { archiveFrontmatter, validateArchiveCategory, validateArchiveSlug } from './validation';

describe('offline archive input validation', () => {
  test.each(['../escape', '/absolute', 'a/b', 'a\\b', '.', '', '-bad', 'bad-', 'a'.repeat(81)])('rejects unsafe slug %s', slug => {
    expect(() => validateArchiveSlug(slug)).toThrow();
  });
  test.each(['a', 'habr-article-123', 'a'.repeat(80)])('retains safe slug %s', slug => expect(validateArchiveSlug(slug)).toBe(slug));
  test('restricts category to the collection schema', () => {
    expect(validateArchiveCategory('article')).toBe('article');
    expect(() => validateArchiveCategory('unknown')).toThrow();
  });
  test('quotes both quote styles, multiline descriptions and list values safely', () => {
    const source = { title: `A "quoted" author's story`, description: 'first\nsecond: true', images: ['https://example.test/a"b.jpg'], archiveDate: '2026-10-03' };
    const yaml = archiveFrontmatter(source);
    expect(yaml).toContain(`title: ${JSON.stringify(source.title)}`);
    expect(yaml).toContain(`description: ${JSON.stringify(source.description)}`);
    expect(yaml).toContain(`  - ${JSON.stringify(source.images[0])}`);
    expect(yaml).toContain('archiveDate: 2026-10-03');
  });
});
