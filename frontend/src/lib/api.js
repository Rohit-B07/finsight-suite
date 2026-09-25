import { supabase } from './supabase';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_BASE = RAW_API_URL && RAW_API_URL.trim() !== '' ? RAW_API_URL.trim().replace(/\/$/, '') : '/api';


async function apiFetch(path, options = {}) {
  const { responseType, ...fetchOptions } = options;
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('finsight_token');
  }

  if (!token) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    } catch (e) {
      // Supabase is optional when using the local backend authentication.
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_BASE}${normalizedPath}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const detailMsg = errorData?.detail || errorData?.message || `API error: ${response.status}`;
      const err = new Error(typeof detailMsg === 'object' ? JSON.stringify(detailMsg) : detailMsg);
      err.status = response.status;
      err.data = errorData;
      throw err;
    }

    return responseType === 'blob' ? response.blob() : response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
}

export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiFetch(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, options) => apiFetch(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (path, options) => apiFetch(path, { ...options, method: 'DELETE' }),
  download: (path, options) => apiFetch(path, { ...options, method: 'GET', responseType: 'blob' }),
};
