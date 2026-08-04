/**
 * Yu Yan Academic Homepage JS Engine
 * Minimal theme switcher & navigation handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Retrieve theme preference or default to light for clean academic readability
  const savedTheme = localStorage.getItem('academic-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('academic-theme', newTheme);
  });
});
