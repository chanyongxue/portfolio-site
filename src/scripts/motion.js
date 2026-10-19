// Page behavior: scroll reveals, typed headings, count-up metrics, and in-place lens tabs.
// Runs inline at the end of <body>. Everything is visible and every link works without it.
// Motion switches itself off for people who prefer reduced motion; the lens tabs still filter in place.
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animate = !reduce && 'IntersectionObserver' in window;
  let io = null;
  if (!animate) root.classList.remove('js');

  // Sticky header: keep its backing clear at the top of the page, fill it in once scrolled.
  const header = document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    const syncHeader = () => {
      header.classList.toggle('is-top', scrollY < 4);
      ticking = false;
    };
    addEventListener(
      'scroll',
      () => {
        if (!ticking) (ticking = true), requestAnimationFrame(syncHeader);
      },
      { passive: true },
    );
    syncHeader();
  }

  // Keep this list in sync with the reveal selector in global.css.
  const REVEAL =
    '[data-reveal], .prose > *, .case-head > :not([data-type]), .facts, .metrics > li, .cover, .next, ' +
    '.hero-foot > *, .work-head, .cards > li, .site-footer > *, [data-line]';

  const stagger = (i) => `${Math.min(i, 6) * 70}ms`;

  function setupMotion() {
    // 1. Reveal elements as they scroll into view. Elements that arrive together are staggered.
    io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.style.transitionDelay = stagger(i++);
          el.classList.add('is-in');
          io.unobserve(el);
          el.addEventListener('transitionend', () => (el.style.transitionDelay = ''), { once: true });
          el.querySelectorAll('[data-count]').forEach(countUp);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll(REVEAL).forEach((el) => io.observe(el));

    // 2. Type the page heading the first time each page is opened in a visit.
    //    The full text is always in the layout, so nothing shifts.
    const heading = document.querySelector('[data-type]');
    if (heading) {
      const key = `typed:${location.pathname}`;
      let seen = false;
      try {
        seen = sessionStorage.getItem(key) === '1';
      } catch {}
      const text = heading.textContent.trim();
      if (!seen && text) {
        const part = (name) => {
          const span = document.createElement('span');
          span.className = name;
          span.setAttribute('aria-hidden', 'true');
          return span;
        };
        const typed = part('typed');
        const caret = part('caret');
        const rest = part('rest');
        rest.textContent = text;
        heading.setAttribute('aria-label', text);
        heading.replaceChildren(typed, caret, rest);

        // Longer headings type faster so the whole line takes about a second and a half.
        const pace = Math.max(12, Math.min(34, 1500 / text.length));
        let n = 0;
        const tick = () => {
          n += 1;
          typed.textContent = text.slice(0, n);
          rest.textContent = text.slice(n);
          if (n < text.length) {
            setTimeout(tick, text[n - 1] === ',' ? 140 : pace * (0.7 + Math.random() * 0.6));
          } else {
            caret.classList.add('is-done');
            try {
              sessionStorage.setItem(key, '1');
            } catch {}
          }
        };
        setTimeout(tick, 350);
      }
      heading.classList.add('is-ready');
    }

    // 3. Count metric numbers up from zero when they appear.
    //    Every number in the value counts, so "+5.9%", "45–53%" and "15,000+" all work.
    document.querySelectorAll('.metrics .value, .stats .value').forEach((el) => {
      const final = el.textContent.trim();
      if (!NUMBER.test(final)) return;
      const live = document.createElement('span');
      live.setAttribute('aria-hidden', 'true');
      live.dataset.count = final;
      live.textContent = countText(final, 0);
      const label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = final;
      el.replaceChildren(live, label);
    });
  }

  const NUMBER = /\d[\d,]*(?:\.\d+)?/;

  // The value with each number scaled by `t` (0 to 1), keeping its decimals and thousands commas.
  function countText(final, t) {
    return final.replace(new RegExp(NUMBER.source, 'g'), (match) => {
      const decimals = (match.split('.')[1] || '').length;
      const scaled = Number(match.replace(/,/g, '')) * t;
      return match.includes(',')
        ? scaled.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : scaled.toFixed(decimals);
    });
  }

  function countUp(el) {
    const final = el.dataset.count;
    const start = performance.now();
    const duration = 1400;
    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = t < 1 ? countText(final, eased) : final;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // 4. Lens tabs filter the project cards in place instead of loading a new page.
  //    The address bar still changes, so each lens stays a shareable link.
  function setupLenses() {
    const tabs = [...document.querySelectorAll('.lens-tabs a[data-lens]')];
    const list = document.querySelector('.cards');
    if (!tabs.length || !list) return;
    const cards = [...list.children];
    const intro = document.querySelector('.hero .intro');
    const status = document.querySelector('[data-lens-status]');
    let timer;

    const apply = (tab) => {
      const lens = tab.dataset.lens;
      tabs.forEach((t) => (t === tab ? t.setAttribute('aria-current', 'page') : t.removeAttribute('aria-current')));

      const swap = () => {
        let shown = 0;
        cards.forEach((card) => {
          const show = !lens || card.dataset.lenses.split(' ').includes(lens);
          card.hidden = !show;
          if (show) shown += 1;
        });
        if (intro) intro.textContent = tab.dataset.intro;
        document.title = tab.dataset.title;
        if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}`;
      };

      if (!animate) {
        swap();
        return;
      }

      // Fade the current cards out, swap, then reveal the new set one after another.
      const leaving = [list, intro].filter(Boolean);
      leaving.forEach((el) => el.classList.add('is-leaving'));
      clearTimeout(timer);
      timer = setTimeout(() => {
        swap();
        const fresh = [intro, ...cards.filter((card) => !card.hidden)].filter(Boolean);
        fresh.forEach((el) => {
          if (io) io.unobserve(el);
          el.classList.add('no-anim');
          el.classList.remove('is-in');
          el.style.transitionDelay = '';
        });
        leaving.forEach((el) => el.classList.remove('is-leaving'));
        void list.offsetWidth;
        fresh.forEach((el, i) => {
          el.classList.remove('no-anim');
          el.style.transitionDelay = stagger(i);
          el.classList.add('is-in');
        });
      }, 180);
    };

    tabs.forEach((tab) =>
      tab.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        if (tab.hasAttribute('aria-current')) return;
        history.pushState({}, '', tab.pathname);
        apply(tab);
      }),
    );

    addEventListener('popstate', () => {
      const tab = tabs.find((t) => t.pathname === location.pathname);
      if (tab && !tab.hasAttribute('aria-current')) apply(tab);
    });
  }

  // 5. The glow behind the home headline eases toward the cursor.
  //    Without a mouse, or with reduced motion, it stays where the stylesheet puts it.
  function setupGlow() {
    const layer = document.querySelector('.glow');
    if (!layer) return;
    layer.classList.add('is-on');
    const blob = layer.querySelector('.glow-blob');
    if (!blob || reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let x = null;
    let y = null;
    let targetX = 0;
    let targetY = 0;
    let running = false;

    const step = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      blob.style.setProperty('--glow-x', `${x.toFixed(1)}px`);
      blob.style.setProperty('--glow-y', `${y.toFixed(1)}px`);
      if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
        requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        const box = layer.getBoundingClientRect();
        if (box.bottom < 0) return; // the hero has scrolled out of view
        targetX = event.clientX - box.left;
        targetY = Math.min(Math.max(event.clientY - box.top, 0), box.height);
        if (x === null) {
          // Start from where the glow rests so the first move glides instead of jumping.
          x = box.width / 2;
          y = Math.min(380, box.height / 2);
        }
        if (!running) {
          running = true;
          requestAnimationFrame(step);
        }
      },
      { passive: true },
    );
  }

  try {
    setupGlow();
  } catch (error) {
    // The glow is decoration; the page is complete without it.
  }

  if (animate) {
    try {
      setupMotion();
    } catch (error) {
      // If anything goes wrong, show the page without motion.
      animate = false;
      root.classList.remove('js');
    }
  }
  try {
    setupLenses();
  } catch (error) {
    // The tabs are ordinary links, so they still work as page loads.
  }
})();
