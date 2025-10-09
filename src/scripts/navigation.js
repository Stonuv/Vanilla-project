(function () {
  const desktopMediaQuery = window.matchMedia('(min-width: 992px)');

  function setupNavigation(nav) {
    const toggle = nav.querySelector('.nav-toggle');
    const menu = nav.querySelector('.p-navigation__list');

    if (!toggle || !menu) {
      return;
    }

    const dropdownControllers = [];

    function closeAllDropdowns(config) {
      let exceptTrigger = null;
      let immediate = false;

      if (config instanceof Element) {
        exceptTrigger = config;
      } else if (config && typeof config === 'object') {
        exceptTrigger = config.exceptTrigger || null;
        immediate = Boolean(config.immediate);
      }

      dropdownControllers.forEach((controller) => {
        if (!controller) {
          return;
        }

        if (exceptTrigger && controller.trigger === exceptTrigger) {
          return;
        }

        controller.close({ immediate });
      });
    }

    const dropdownItems = Array.from(nav.querySelectorAll('.js-has-dropdown'));

    dropdownItems.forEach((item) => {
      const dropdownToggle = item.querySelector('.js-dropdown-toggle');
      const submenu = item.querySelector('.js-dropdown-menu');

      if (!dropdownToggle || !submenu) {
        return;
      }

      submenu.hidden = true;

      let pendingCloseHandler = null;

      function openDropdown() {
        if (pendingCloseHandler) {
          submenu.removeEventListener('transitionend', pendingCloseHandler);
          pendingCloseHandler = null;
        }

        if (!submenu.hidden && item.classList.contains('is-expanded')) {
          return;
        }

        dropdownToggle.setAttribute('aria-expanded', 'true');
        submenu.hidden = false;

        requestAnimationFrame(() => {
          item.classList.add('is-expanded');
        });
      }

      function closeDropdown({ immediate = false } = {}) {
        if (pendingCloseHandler) {
          submenu.removeEventListener('transitionend', pendingCloseHandler);
          pendingCloseHandler = null;
        }

        if (submenu.hidden && !item.classList.contains('is-expanded')) {
          dropdownToggle.setAttribute('aria-expanded', 'false');
          return;
        }

        const shouldCloseImmediately = immediate || !desktopMediaQuery.matches;

        dropdownToggle.setAttribute('aria-expanded', 'false');

        if (shouldCloseImmediately) {
          item.classList.remove('is-expanded');
          submenu.hidden = true;
          return;
        }

        if (!item.classList.contains('is-expanded')) {
          submenu.hidden = true;
          return;
        }

        pendingCloseHandler = (event) => {
          if (event.target !== submenu || event.propertyName !== 'opacity') {
            return;
          }

          submenu.hidden = true;
          submenu.removeEventListener('transitionend', pendingCloseHandler);
          pendingCloseHandler = null;
        };

        submenu.addEventListener('transitionend', pendingCloseHandler);
        item.classList.remove('is-expanded');
      }

      dropdownToggle.addEventListener('click', (event) => {
        event.preventDefault();
        const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          closeDropdown();
        } else {
          closeAllDropdowns({ exceptTrigger: dropdownToggle });
          openDropdown();
        }
      });

      dropdownToggle.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeDropdown();
          dropdownToggle.focus();
        }
      });

      submenu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeDropdown();
          dropdownToggle.focus();
        }
      });

      dropdownControllers.push({
        item,
        trigger: dropdownToggle,
        submenu,
        open: openDropdown,
        close: closeDropdown,
      });
    });

    const handleDocumentClick = (event) => {
      if (!nav.contains(event.target)) {
        closeAllDropdowns({ immediate: false });
      }
    };

    document.addEventListener('click', handleDocumentClick);

    nav.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    });

    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
      closeAllDropdowns({ immediate: true });
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      closeAllDropdowns({ immediate: true });
    }

    function syncMenuToViewport() {
      if (desktopMediaQuery.matches) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = false;
        closeAllDropdowns({ immediate: true });
      } else if (!nav.classList.contains('is-open')) {
        menu.hidden = true;
        closeAllDropdowns({ immediate: true });
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
