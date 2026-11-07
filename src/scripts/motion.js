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
    '.hero-foot > *, .work-head, .cards > li, [data-line]';

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
      // Keep one <em> (e.g. the light-italic "dynamic") while typing: remember where it starts and ends.
      const em = heading.querySelector('em');
      const emFrom = em ? text.indexOf(em.textContent) : -1;
      const emTo = emFrom < 0 ? -1 : emFrom + em.textContent.length;
      const fill = (el, from, to) => {
        el.replaceChildren();
        const add = (a, b, italic) => {
          if (b <= a) return;
          const t = document.createTextNode(text.slice(a, b));
          if (!italic) return el.append(t);
          const e = document.createElement('em');
          e.append(t);
          el.append(e);
        };
        if (emFrom < 0) return add(from, to, false);
        add(from, Math.min(to, emFrom), false);
        add(Math.max(from, emFrom), Math.min(to, emTo), true);
        add(Math.max(from, emTo), to, false);
      };
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
        fill(rest, 0, text.length);
        heading.setAttribute('aria-label', text);
        heading.replaceChildren(typed, caret, rest);

        // Longer headings type faster so the whole line takes about a second and a half.
        const pace = Math.max(12, Math.min(34, 1500 / text.length));
        let n = 0;
        const tick = () => {
          n += 1;
          fill(typed, 0, n);
          fill(rest, n, text.length);
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
    const status = document.querySelector('[data-lens-status]');
    let timer;

    // The pill slides to the current tab. Only transform and width change, so nothing else moves.
    const track = document.querySelector('.lens-tabs');
    const pill = track && track.querySelector('.lens-indicator');
    const place = (instant) => {
      const tab = tabs.find((t) => t.hasAttribute('aria-current'));
      if (!pill || !tab) return;
      if (instant) pill.classList.add('no-anim');
      pill.style.width = `${tab.offsetWidth}px`;
      pill.style.transform = `translateX(${tab.offsetLeft}px)`;
      if (instant) {
        void pill.offsetWidth;
        pill.classList.remove('no-anim');
      }
    };
    if (pill) {
      track.classList.add('has-indicator');
      place(true);
      // Tab widths settle once the fonts load and change with the window size.
      if (document.fonts) document.fonts.ready.then(() => place(true));
      if ('ResizeObserver' in window) new ResizeObserver(() => place(true)).observe(track.querySelector('ul'));
    }

    const apply = (tab) => {
      const lens = tab.dataset.lens;
      tabs.forEach((t) => (t === tab ? t.setAttribute('aria-current', 'page') : t.removeAttribute('aria-current')));
      place(false);
      // On narrow screens the track scrolls sideways; keep the chosen tab in view.
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: animate ? 'smooth' : 'auto' });

      const swap = () => {
        let shown = 0;
        cards.forEach((card) => {
          const show = !lens || card.dataset.lenses.split(' ').includes(lens);
          card.hidden = !show;
          if (show) shown += 1;
        });
        document.title = tab.dataset.title;
        if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}`;
      };

      if (!animate) {
        swap();
        return;
      }

      // Fade the current cards out, swap, then reveal the new set one after another.
      const leaving = [list];
      leaving.forEach((el) => el.classList.add('is-leaving'));
      clearTimeout(timer);
      timer = setTimeout(() => {
        swap();
        const fresh = cards.filter((card) => !card.hidden);
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

    // The glow is drawn as ASCII: the page is split into character cells, each cell takes the
    // glow's brightness at that spot, and the brightness picks a character from sparse to dense.
    // The edge scatters (cells flicker in and out) and the characters keep shuffling.
    const canvas = document.createElement('canvas');
    canvas.className = 'glow-ascii';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    layer.append(canvas);
    layer.classList.add('is-ascii');

    const RAMP = " .,:;-~=+*!?#%@";
    const SCATTER = '.:+*';
    const CELL_W = 11;
    const CELL_H = 16;
    const live = !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let radius = 0;
    let x = null;
    let y = null;
    let targetX = 0;
    let targetY = 0;
    let visible = true;
    let running = false;
    let last = 0;
    let seed = 1;

    // A cheap repeatable hash, so each cell has its own steady "personality" between shuffles.
    const hash = (i, j, k) => {
      let n = (i * 374761393 + j * 668265263 + k * 2147483647) | 0;
      n = (n ^ (n >>> 13)) * 1274126177;
      return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    };

    const resize = () => {
      const box = layer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.width;
      h = box.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL_W);
      rows = Math.ceil(h / CELL_H);
      radius = Math.min(w * 0.7, 780) / 2;
      if (x === null) {
        x = targetX = w / 2;
        y = targetY = Math.min(380, h / 2);
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `500 13px ${getComputedStyle(document.documentElement).getPropertyValue('--mono') || 'monospace'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const reach = radius * 1.25;
      const c0 = Math.max(0, Math.floor((x - reach) / CELL_W));
      const c1 = Math.min(cols - 1, Math.ceil((x + reach) / CELL_W));
      const r0 = Math.max(0, Math.floor((y - reach) / CELL_H));
      const r1 = Math.min(rows - 1, Math.ceil((y + reach) / CELL_H));
      for (let j = r0; j <= r1; j++) {
        const cy = j * CELL_H + CELL_H / 2;
        for (let i = c0; i <= c1; i++) {
          const cx = i * CELL_W + CELL_W / 2;
          const d = Math.hypot(cx - x, cy - y) / radius;
          if (d > 1.25) continue;
          // Soft falloff like the old blurred circle, with a little per-cell noise.
          const noise = hash(i, j, seed) - 0.5;
          let b = Math.exp(-d * d * 2.4) + noise * 0.22;
          // Toward the edge, cells only sometimes show up: that is the scatter.
          if (d > 0.55 && hash(j, i, seed + 7) > Math.max(0, 1.2 - d) * 1.6) continue;
          if (b < 0.06) continue;
          b = Math.min(1, b);
          const edge = d > 0.7;
          const ch = edge
            ? SCATTER[Math.floor(hash(i, j, seed + 3) * SCATTER.length)]
            : RAMP[Math.max(1, Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1))))];
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.35 + b * 0.65).toFixed(3)})`;
          // Scattered cells drift a pixel or two off the grid.
          const jx = edge ? (hash(i, j, seed + 11) - 0.5) * 6 : 0;
          const jy = edge ? (hash(j, i, seed + 13) - 0.5) * 6 : 0;
          ctx.fillText(ch, cx + jx, cy + jy);
        }
      }
    };

    const step = (now) => {
      if (!visible) {
        running = false;
        return;
      }
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      const moving = Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5;
      // Shuffle the characters about 12 times a second; redraw every frame while the glow is moving.
      if (now - last > 85) {
        seed = (seed + 1) % 100000;
        last = now;
        draw();
      } else if (moving) {
        draw();
      }
      requestAnimationFrame(step);
    };

    const start = () => {
      if (live && visible && !running) {
        running = true;
        requestAnimationFrame(step);
      }
    };

    resize();
    if (document.fonts) document.fonts.ready.then(draw);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(layer);
    if (!live) return; // Reduced motion or touch: a still ASCII glow.

    // Only animate while the hero is on screen.
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    }).observe(layer);

    addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        const box = layer.getBoundingClientRect();
        if (box.bottom < 0) return; // the hero has scrolled out of view
        targetX = event.clientX - box.left;
        targetY = Math.min(Math.max(event.clientY - box.top, 0), box.height);
        start();
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
