(function () {
  const desktopMediaQuery = window.matchMedia('(min-width: 992px)');

  function setupNavigation(nav) {
    const toggle = nav.querySelector('.nav-toggle');
    const menu = nav.querySelector('.p-navigation__list');

    if (!toggle || !menu) {
      return;
    }

    const dropdownControllers = [];

    function closeAllDropdowns(exceptTrigger) {
      dropdownControllers.forEach((controller) => {
        if (!controller) {
          return;
        }

        if (exceptTrigger && controller.trigger === exceptTrigger) {
          return;
        }

        controller.close();
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

      function openDropdown() {
        item.classList.add('is-expanded');
        dropdownToggle.setAttribute('aria-expanded', 'true');
        submenu.hidden = false;
      }

      function closeDropdown() {
        item.classList.remove('is-expanded');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        submenu.hidden = true;
      }

      dropdownToggle.addEventListener('click', (event) => {
        event.preventDefault();
        const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          closeDropdown();
        } else {
          closeAllDropdowns(dropdownToggle);
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
        closeAllDropdowns();
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
      closeAllDropdowns();
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      closeAllDropdowns();
    }

    function syncMenuToViewport() {
      if (desktopMediaQuery.matches) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = false;
        closeAllDropdowns();
      } else if (!nav.classList.contains('is-open')) {
        menu.hidden = true;
        closeAllDropdowns();
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
