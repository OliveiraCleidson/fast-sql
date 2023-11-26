import { format } from 'sql-formatter';

export function clearExtraSpaces(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}

export function handleQueryReturn(query: string) {
  return format(clearExtraSpaces(query), { language: 'postgresql' });
}
