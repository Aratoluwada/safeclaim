/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function initTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('safeclaim_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return isDark;
}

export function setTheme(isDark: boolean) {
  if (typeof window === 'undefined') return;
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('safeclaim_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('safeclaim_theme', 'light');
  }
  window.dispatchEvent(new CustomEvent('safeclaim_theme_changed', { detail: isDark }));
}
