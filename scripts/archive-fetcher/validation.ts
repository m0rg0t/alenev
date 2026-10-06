/** Archive filenames must remain within the content/media directories. */
export function validateArchiveSlug(value: string): string {
  if (!/^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(value)) {
    throw new Error('Archive slug must use 1–80 lowercase letters, digits or inner hyphens');
  }
  return value;
}

export function validateArchiveCategory(value: string): 'article' | 'media' | 'achievement' {
  if (value !== 'article' && value !== 'media' && value !== 'achievement') throw new Error('Invalid archive category');
  return value;
}

/** JSON quoted scalars are valid YAML and safely escape quotes and line breaks. */
export function archiveFrontmatter(data: Record<string, unknown>): string {
  return Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => {
    if (key.endsWith('Date') && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return `${key}: ${value}`;
    if (Array.isArray(value)) return `${key}:\n${value.map(item => `  - ${JSON.stringify(item)}`).join('\n')}`;
    return `${key}: ${JSON.stringify(value)}`;
  }).join('\n');
}
