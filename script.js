document.addEventListener('DOMContentLoaded', function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) {
    console.warn('No tabs were found for the resume tab widget.');
    return;
  }

  var panels = tabs.map(function (tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  });

  function activate(tab, setFocus) {
    tabs.forEach(function (t, idx) {
      var selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.setAttribute('tabindex', selected ? '0' : '-1');
      if (selected && setFocus) t.focus();
      if (panels[idx]) {
        if (selected) {
          panels[idx].classList.add('active');
          panels[idx].removeAttribute('hidden');
        } else {
          panels[idx].classList.remove('active');
          panels[idx].setAttribute('hidden', '');
        }
      }
    });

    var id = tab.getAttribute('aria-controls');
    if (history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
  }

  function findInitialTab() {
    var hash = (location.hash || '').replace(/^#/, '');
    if (!hash) return null;
    return tabs.find(function (tab) {
      return tab.getAttribute('aria-controls') === hash;
    }) || null;
  }

  tabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      activate(tab, false);
    });

    tab.addEventListener('keydown', function (e) {
      var next;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        activate(next, true);
      }
    });
  });

  activate(findInitialTab() || tabs[0], false);

  var footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
