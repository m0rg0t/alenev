import { describe, expect, test } from 'bun:test';
import { htmlToMarkdown } from './generate-markdown';

describe('Markdown twins', () => {
  test('decodes HTML text entities while preserving formatting', () => {
    const { md, tokens } = htmlToMarkdown('<main><p>Tom &amp; Jerry &lt;3 <strong>friends</strong></p></main>');
    expect(md).toBe('Tom & Jerry <3 **friends**\n');
    expect(tokens).toBe(Math.ceil(md.length / 4));
  });
  test('renders nested list text once and keeps sibling sublists', () => {
    const { md } = htmlToMarkdown('<main><ul><li>Parent<ul><li>Child</li></ul><ol><li>Second</li></ol></li></ul></main>');
    expect(md).toBe('- Parent\n  - Child\n  1. Second\n');
    expect(md.match(/Child/g)?.length).toBe(1);
  });
  test('retains titles and canonical sources while omitting script/navigation scaffolding', () => {
    const { md } = htmlToMarkdown('<html><head><title>Title &amp; more</title><link rel="canonical" href="https://example.test/page/"></head><body><main><nav>skip nav</nav><p>Body</p><script>secret()</script><iframe>skip frame</iframe></main></body></html>');
    expect(md).toContain('# Title & more');
    expect(md).toContain('Source: https://example.test/page/');
    expect(md).toContain('Body');
    expect(md).not.toMatch(/skip|secret/);
  });
});
