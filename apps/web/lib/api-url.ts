const DEFAULT_DEV_API_BASE = '/api/business';

export function getApiBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || DEFAULT_DEV_API_BASE;
  }

  return process.env.NEXT_PUBLIC_API_URL || '';
}

export function buildApiUrl(path: string) {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
