const root = document.documentElement;
const toggle = document.querySelector('#theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const storedTheme = localStorage.getItem('yu-yan-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme) {
  const isDark = theme === 'dark';
  root.dataset.theme = theme;
  document.querySelectorAll("img[data-light-src][data-dark-src]").forEach((icon) => {
    icon.src = isDark ? icon.dataset.darkSrc : icon.dataset.lightSrc;
  });
  toggle?.setAttribute('aria-pressed', String(isDark));
  toggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  themeColor?.setAttribute('content', isDark ? '#181a18' : '#f4f1ea');
}

applyTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));

toggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('yu-yan-theme', nextTheme);
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
