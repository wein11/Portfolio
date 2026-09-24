(() => {
  const root = document.documentElement;
  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;

  /* ---------- Idioma ---------- */
  const EN = window.I18N_EN || {};
  const ES = {};
  const textEls = [...document.querySelectorAll('[data-i18n]')];
  const altEls = [...document.querySelectorAll('[data-i18n-alt]')];
  const ariaEls = [...document.querySelectorAll('[data-i18n-aria]')];
  const metaDesc = document.querySelector('meta[name="description"]');
  const langBtn = document.querySelector('.lang-toggle');

  textEls.forEach((el) => { ES[el.dataset.i18n] = el.textContent; });
  altEls.forEach((el) => { ES[el.dataset.i18nAlt] = el.alt; });
  ariaEls.forEach((el) => { ES[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
  ES['meta.title'] = document.title;
  ES['meta.desc'] = metaDesc.content;

  const beforeLang = [];
  const afterLang = [];
  let lang = 'es';

  const applyLang = (next) => {
    beforeLang.forEach((fn) => fn());
    lang = next;
    const t = (key) => (next === 'en' && EN[key]) || ES[key];
    textEls.forEach((el) => { el.textContent = t(el.dataset.i18n); });
    altEls.forEach((el) => { el.alt = t(el.dataset.i18nAlt); });
    ariaEls.forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.title = t('meta.title');
    metaDesc.content = t('meta.desc');
    root.lang = next;
    langBtn.textContent = next === 'en' ? 'ES' : 'EN';
    langBtn.lang = next === 'en' ? 'es' : 'en';
    langBtn.setAttribute('aria-label', next === 'en' ? 'Cambiar a español' : 'Switch to English');
    try { localStorage.setItem('lang', next); } catch (e) { /* sin almacenamiento, no pasa nada */ }
    afterLang.forEach((fn) => fn());
  };

  let savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (e) { /* idem */ }
  const urlLang = new URLSearchParams(location.search).get('lang');
  const initialLang = urlLang === 'en' || urlLang === 'es' ? urlLang : savedLang;
  if (initialLang === 'en') applyLang('en');

  langBtn.addEventListener('click', () => {
    const next = lang === 'en' ? 'es' : 'en';
    if (!hasGsap || reduceMotion) { applyLang(next); return; }
    // Fundido corto para que el cambio de texto no salte de golpe.
    const targets = ['main', '.nav-links', '.nav-actions', '.footer', '.menu nav'];
    gsap.to(targets, {
      autoAlpha: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        applyLang(next);
        gsap.to(targets, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
        gsap.fromTo('.hero-title .line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 });
      },
    });
  });

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    root.classList.toggle('menu-open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); } else { document.body.style.overflow = open ? 'hidden' : ''; }
  };

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Sin GSAP: el sitio queda completo y estático ---------- */
  if (!hasGsap) { root.classList.remove('js-anim'); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  /* ---------- Scroll suave ---------- */
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.085, anchors: true, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Navegación: se esconde al bajar y vuelve al subir ---------- */
  const nav = document.querySelector('.nav');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-top', y < 40);
      nav.classList.toggle('is-hidden', self.direction === 1 && y > 240);
    },
  });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  /* ---------- Cursor: punto con rastro que invierte el texto al pasar ---------- */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    const dot = document.createElement('div');
    dot.className = 'cursor';
    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-trail';
    document.body.append(canvas, dot);

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    gsap.set(dot, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const xTo = gsap.quickTo(dot, 'x', { duration: 0.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.2, ease: 'power3.out' });
    let visible = false;

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        dot.classList.add('is-visible');
      }
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { visible = false; dot.classList.remove('is-visible'); });

    // El rastro guarda las últimas posiciones del punto y las dibuja cada vez más finas.
    const trail = [];
    const TRAIL_LENGTH = 24;
    gsap.ticker.add(() => {
      ctx.clearRect(0, 0, w, h);
      if (!visible) { trail.length = 0; return; }
      trail.push({ x: gsap.getProperty(dot, 'x'), y: gsap.getProperty(dot, 'y') });
      if (trail.length > TRAIL_LENGTH) trail.shift();
      ctx.lineCap = 'round';
      for (let i = 1; i < trail.length; i++) {
        const dx = trail[i].x - trail[i - 1].x;
        const dy = trail[i].y - trail[i - 1].y;
        if (dx * dx + dy * dy < 0.25) continue;
        const k = i / trail.length;
        ctx.strokeStyle = `rgba(239, 237, 234, ${k * 0.85})`;
        ctx.lineWidth = k * 7;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
    });

    // Tamaño del punto según lo que hay debajo: cuanto más grande el texto, más grande el círculo.
    const sizes = [
      ['.display, .marquee, .menu a', 150],
      ['.profile-lead, .contact-mail, .work-title, .edu-item h3', 90],
      ['a, button', 60],
      ['p, h3, .label, .work-tag', 40],
    ];
    let currentSize = 12;
    document.addEventListener('pointerover', (e) => {
      let size = 12;
      for (const [selector, s] of sizes) {
        if (e.target.closest(selector)) { size = s; break; }
      }
      if (size === currentSize) return;
      currentSize = size;
      gsap.to(dot, { width: size, height: size, duration: 0.5, ease: 'expo.out' });
    });
    document.addEventListener('pointerdown', () => gsap.to(dot, { scale: 0.8, duration: 0.15 }));
    document.addEventListener('pointerup', () => gsap.to(dot, { scale: 1, duration: 0.4, ease: 'expo.out' }));
  }

  /* ---------- Animaciones de entrada y scroll ---------- */
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero: el titular sube renglón por renglón.
    const hero = document.querySelector('.hero-title');
    const lines = hero.querySelectorAll('.line > span');
    gsap.set(lines, { yPercent: 110 });
    gsap.set(hero, { visibility: 'visible' });
    root.classList.remove('js-anim');

    gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.3 } })
      .to(lines, { yPercent: 0, stagger: 0.1 })
      .from('.hero-foot', { autoAlpha: 0, y: 16, duration: 1 }, 0.6);

    // Títulos de sección: misma entrada que el hero, marca el cambio de capítulo.
    gsap.utils.toArray('.reveal-title').forEach((title) => {
      gsap.from(title.querySelectorAll('.line > span'), {
        yPercent: 110,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: title, start: 'top 85%', once: true },
      });
    });

    // Retrato: se descubre de abajo hacia arriba y se desplaza más lento que la página.
    gsap.fromTo('.profile-photo',
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.profile-photo', start: 'top 85%', once: true } });
    gsap.fromTo('.profile-photo img',
      { yPercent: -6, scale: 1.14 },
      { yPercent: 6, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.profile', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Perfil: las palabras se encienden al ritmo de la lectura. Se rearma al cambiar de idioma.
    const lead = document.querySelector('.profile-lead');
    let split = null;
    let leadTween = null;
    const buildLead = () => {
      if (!window.SplitText) return;
      split = SplitText.create(lead, { type: 'words' });
      leadTween = gsap.from(split.words, {
        opacity: 0.18,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: lead, start: 'top 80%', end: 'bottom 50%', scrub: true },
      });
    };
    const destroyLead = () => {
      if (leadTween) { leadTween.scrollTrigger.kill(); leadTween.kill(); leadTween = null; }
      if (split) { split.revert(); split = null; }
    };
    buildLead();
    beforeLang.push(destroyLead);
    afterLang.push(() => { buildLead(); ScrollTrigger.refresh(); });

    // Capturas de trabajos: se descubren de abajo hacia arriba al entrar en pantalla.
    const media = gsap.utils.toArray('.work-media');
    gsap.set(media, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(media.map((m) => m.querySelector('img')), { scale: 1.15 });
    ScrollTrigger.batch(media, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.12 });
        gsap.to(batch.map((m) => m.querySelector('img')), {
          scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12, clearProps: 'transform',
        });
      },
    });

    return () => {
      destroyLead();
      beforeLang.splice(beforeLang.indexOf(destroyLead), 1);
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => { root.classList.remove('js-anim'); });

  // Las imágenes lazy cambian la altura de la página: recalcular los disparadores al cargar.
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
