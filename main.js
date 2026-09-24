(() => {
  const root = document.documentElement;

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    root.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Animaciones ---------- */
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js-anim'); return; }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  // Navegación: se esconde al bajar y vuelve al subir, para no tapar el contenido.
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

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Entrada del hero: el titular sube renglón por renglón y la foto se abre desde el centro.
    const hero = document.querySelector('.hero-title');
    const lines = hero.querySelectorAll('.line > span');
    const photo = hero.querySelector('.inline-photo');

    gsap.set(lines, { yPercent: 110 });
    gsap.set(photo, { clipPath: 'inset(0% 50% 0% 50%)' });
    gsap.set(photo.querySelector('img'), { scale: 1.35 });
    gsap.set(hero, { visibility: 'visible' });
    root.classList.remove('js-anim');

    gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.3 } })
      .to(lines, { yPercent: 0, stagger: 0.09 })
      .to(photo, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }, 0.45)
      .to(photo.querySelector('img'), { scale: 1, duration: 1.6 }, 0.45)
      .from('.hero-foot', { autoAlpha: 0, y: 16, duration: 1 }, 0.7);

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

    // Perfil: las palabras se encienden al ritmo de la lectura.
    const lead = document.querySelector('.profile-lead');
    let split;
    if (window.SplitText && lead) {
      split = SplitText.create(lead, { type: 'words' });
      gsap.from(split.words, {
        opacity: 0.18,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: lead, start: 'top 80%', end: 'bottom 50%', scrub: true },
      });
    }

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

    return () => { if (split) split.revert(); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => { root.classList.remove('js-anim'); });

  // Las imágenes lazy cambian la altura de la página: recalcular los disparadores al cargar.
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
