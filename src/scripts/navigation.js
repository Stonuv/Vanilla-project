(function () {
  const desktopMediaQuery = window.matchMedia('(min-width: 992px)');

  function setupNavigation(nav) {
    const toggle = nav.querySelector('.nav-toggle');
    const menu = nav.querySelector('.p-navigation__list');

    if (!toggle || !menu) {
      return;
    }

    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }

    function syncMenuToViewport() {
      if (desktopMediaQuery.matches) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = false;
      } else if (!nav.classList.contains('is-open')) {
        menu.hidden = true;
      }
    }

    syncMenuToViewport();

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    const listener = () => syncMenuToViewport();

    if (typeof desktopMediaQuery.addEventListener === 'function') {
      desktopMediaQuery.addEventListener('change', listener);
    } else if (typeof desktopMediaQuery.addListener === 'function') {
      desktopMediaQuery.addListener(listener);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.p-navigation').forEach(setupNavigation);
  });
})();
