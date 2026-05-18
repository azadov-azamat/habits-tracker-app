export function formatActionForPreview(action: string): string {
  const trimmed = action.trim();

  if (!trimmed) {
    return '___';
  }

  const replacements: [RegExp, string][] = [
    [/ qilish$/i, ' qilaman'],
    [/ ichish$/i, ' ichaman'],
    [/ o‘qish$/i, ' o‘qiyman'],
    [/ o'qish$/i, ' o‘qiyman'],
    [/ yozish$/i, ' yozaman'],
    [/ yurish$/i, ' yuraman'],
    [/ uxlash$/i, ' uxlayman'],
    [/ o‘rganish$/i, ' o‘rganaman'],
    [/ o'rganish$/i, ' o‘rganaman'],
    [/ ovqatlanish$/i, ' ovqatlanaman'],
    [/ harakat$/i, ' harakat qilaman'],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(trimmed)) {
      return trimmed.replace(pattern, replacement);
    }
  }

  if (/meditatsiya$/i.test(trimmed)) {
    return `${trimmed} qilaman`;
  }

  return trimmed;
}
