const root = document.documentElement;
const body = document.body;
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = [...document.querySelectorAll('.nav-link')];
const themeButton = document.querySelector('.theme-toggle');
const backToTop = document.querySelector('.back-to-top');
const year = document.querySelector('#current-year');
const themeColor = document.querySelector('meta[name="theme-color"]');

const getSavedTheme = () => {
  try {
    return localStorage.getItem('portfolio-theme');
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch {
    // O site continua funcionando mesmo quando o armazenamento está bloqueado.
  }
};

const applyTheme = (theme) => {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  themeColor?.setAttribute('content', nextTheme === 'light' ? '#f3f0e8' : '#0b0c0f');
  themeButton?.setAttribute(
    'aria-label',
    nextTheme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'
  );
};

applyTheme(getSavedTheme() || 'dark');

themeButton?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

const closeMenu = () => {
  if (!menuButton || !navPanel) return;
  navPanel.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  body.classList.remove('menu-open');
};

const toggleMenu = () => {
  if (!menuButton || !navPanel) return;
  const willOpen = !navPanel.classList.contains('open');
  navPanel.classList.toggle('open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  body.classList.toggle('menu-open', willOpen);
};

menuButton?.addEventListener('click', toggleMenu);
navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

const updateScrollUI = () => {
  const hasScrolled = window.scrollY > 28;
  header?.classList.toggle('scrolled', hasScrolled);
  backToTop?.classList.toggle('visible', window.scrollY > 560);
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) return;

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === `#${visibleSection.target.id}`);
      });
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55%' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const marquee = document.querySelector('.hero-line span');
if (marquee) {
  const message = marquee.textContent.trim();
  marquee.textContent = `${message}   ·   ${message}   ·   ${message}   ·   ${message}`;
}

if (year) year.textContent = new Date().getFullYear();
