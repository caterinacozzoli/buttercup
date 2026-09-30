/* ==========================================================
   main.js — motore di Buttercup
   Un palco fisso (#stage) con uno strato per scena e Caterina globale.
   Ogni scena ha una <section> invisibile alta quanto il suo scroll e una
   timeline con scrub: 1 unità di timeline = 100vh di scroll.
   I dati stanno in scenes.js; qui il motore + le animazioni su misura (EXTRAS).
   ========================================================== */

(function () {
  'use strict';

  var SCENES   = window.SCENES;
  var FLOOR    = 12;            /* pavimento: % dal fondo */
  var CATE_BOX = 50;            /* il box di Caterina è alto 50vh, poi scalato a h/50 */
  var PALETTE  = ['#7a35ee', '#d4cdff', '#fed728', '#ffeba2', '#ff5f6d'];
  var Z = { fondale: 10, sagoma: 15, clic: 25, front: 35, fumetto: 40, testo: 40, bottone: 60, approfondimento: 60 };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Lingua (testi in i18n.js) ─────────────────────────── */
  var I18N = window.I18N;
  var lang = localStorage.getItem('pref-lang');
  if (lang !== 'it' && lang !== 'pt') lang = /^pt/i.test(navigator.language) ? 'pt' : 'it';
  var i18nNodes = [];           /* scritte da ritradurre al cambio lingua: { el, key, it, kind } */

  function ui(key, vars) {
    return I18N[lang].ui[key].replace(/\{(\w)\}/g, function (m, k) { return vars[k]; });
  }
  /* testo nella lingua corrente; portoghese mancante = segnaposto visibile */
  function tr(key, it) {
    if (lang === 'it' || it == null) return it;
    return I18N.pt.testi[key] || '[PT] ' + it;
  }
  function titleOf(sc) { return lang === 'it' ? sc.title : (I18N.pt.titoli[sc.id] || '[PT] ' + sc.title); }
  function paintText(n) {
    var s = tr(n.key, n.it);
    n.el.textContent = s;
    if (n.kind != null) n.el.style.fontSize = labelSize(s, n.kind);
  }

  gsap.registerPlugin(ScrollTrigger);
  /* il racconto parte sempre dall'inizio: né il browser né ScrollTrigger riaprono dove si era rimasti */
  ScrollTrigger.clearScrollMemory('manual');
  window.scrollTo(0, 0);

  var stage      = document.getElementById('stage');
  var bgs        = document.getElementById('bgs');
  var tracks     = document.getElementById('tracks');
  var cate       = document.getElementById('character');
  var cateHow    = cate.querySelector('.cate__how');
  var cateRt     = cate.querySelector('.cate__rt');
  var cateFig    = cate.querySelector('.cate__fig');
  var cateAttach = cate.querySelector('.cate__attach');
  var jars       = [].slice.call(document.querySelectorAll('.s01-fratello'));   /* barattoli cliccabili di S01 */

  /* ── Lenis ─────────────────────────────────────────────── */
  var lenis = null;
  if (!reducedMotion) {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  var jumping = false;          /* durante i salti (barra, Ricomincia) la voce tace */
  function scrollToY(y, duration) {
    if (!lenis) { window.scrollTo(0, y); return; }
    jumping = true;
    subBar.setAttribute('aria-live', 'off');     /* niente raffica di battute durante il salto */
    lenis.scrollTo(y, { duration: duration });
    /* ponytail: timer invece di onComplete, che non arriva se l'utente interrompe il salto */
    setTimeout(function () {
      jumping = false;
      subBar.setAttribute('aria-live', 'polite');
      var text = subText.textContent;             /* annuncia solo la battuta d'arrivo */
      subText.textContent = '';
      requestAnimationFrame(function () { subText.textContent = text; });
    }, duration * 1000 + 300);
  }

  /* ── Utilità ───────────────────────────────────────────── */
  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rnd(a, b, unit) { return function () { return gsap.utils.random(a, b) + (unit || ''); }; }
  function bySide(v) { return function (i, t) { return t._side < 0 ? '-' + v : v; }; }
  function spec(s) { if (typeof s !== 'string') return s; var p = s.split(' '); return { b: p[0], fx: p[1] }; }

  /* ── Segnaposto ────────────────────────────────────────── */
  function wireImg(img, ph) {
    /* .is-loaded sul contenitore: le scritte perdono il fondino di carta (servono solo sul segnaposto) */
    function fail() { img.style.display = 'none'; ph.style.display = 'flex'; img.parentNode.classList.remove('is-loaded'); }
    function ok() { img.style.display = ''; ph.style.display = 'none'; img.parentNode.classList.add('is-loaded'); }
    img.addEventListener('error', fail);
    img.addEventListener('load', ok);
    if (img.complete) { if (img.naturalWidth === 0) fail(); else ok(); }
  }
  document.querySelectorAll('.scene-img').forEach(function (img) {
    var ph = img.nextElementSibling;
    if (ph && ph.classList.contains('placeholder')) wireImg(img, ph);
  });

  /* Figura, non tela: misura il riquadro dei pixel non trasparenti (su una copia ridotta) e dimensiona l'immagine
     perché la FIGURA riempia l'altezza del contenitore, piedi sul fondo, centrata. Così un'altezza in vh è
     l'altezza vera del personaggio o dell'oggetto, qualunque sia la tela (2:3, quadrata, 3:2…). */
  var figCache = {};
  function measureFig(img) {
    var key = img.currentSrc || img.src;
    if (figCache[key]) return figCache[key];
    var W = img.naturalWidth, H = img.naturalHeight, k = Math.min(1, 256 / Math.max(W, H));
    var w = Math.max(1, Math.round(W * k)), h = Math.max(1, Math.round(H * k));
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(img, 0, 0, w, h);
    var d = cx.getImageData(0, 0, w, h).data, x0 = w, x1 = -1, y0 = h, y1 = -1;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 60) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 < 0) return null;
    return (figCache[key] = { h: (y1 - y0 + 1) / h, gap: (h - 1 - y1) / h, cx: (x0 + x1 + 1) / 2 / w, ratio: W / H });
  }
  function fitFigure(img) {
    function go() {
      if (!img.naturalWidth) return;
      var f = measureFig(img), box = img.parentNode.getBoundingClientRect();
      if (!f || !box.height) return;
      var imgWpct = (1 / f.h) * f.ratio * (box.height / box.width) * 100;   /* larghezza immagine in % del contenitore */
      img.style.cssText += ';position:absolute;inset:auto;max-width:none;object-fit:fill;' +
        'height:' + (100 / f.h) + '%;width:' + imgWpct + '%;bottom:' + (-f.gap / f.h * 100) + '%;left:' + (50 - f.cx * imgWpct) + '%';
    }
    img.addEventListener('load', go);
    if (img.complete) go();
  }

  var phN = 0;
  function addMedia(box, file, tbd) {
    var img = el('img', 'scene-img', box);
    img.alt = '';
    img.src = 'assets/img/' + (file.indexOf('/') >= 0 ? '' : file.slice(0, 3) + '/') + file + '.png';
    var ph = el('div', 'placeholder placeholder--' + (phN++ % 5), box);
    ph.setAttribute('aria-hidden', 'true');
    ph.textContent = (tbd ? '[DA DEFINIRE] ' : '') + file + '.png';
    img.dataset.anim = file;          /* per le animazioni a fotogrammi (anims nei dati della scena) */
    wireImg(img, ph);
  }

  /* ══════════════════════════════════════════════════════════
     ANIMAZIONI A FOTOGRAMMI (sistema unico, per tutte le scene)
     Ogni posa animata ha l'immagine ferma senza numero (file.png) e i fotogrammi file-1…-N.png
     sulla stessa tela. Nei dati: anims: [{ file, frames, fps, da, a }]. Il loop gira a tempo reale
     dalla battuta da (inclusa) alla battuta a (esclusa; null = fino alla fine della scena).
     Stesso fotogramma su tutte le <img data-anim="file"> (colore e sagoma restano sincronizzati).
     frames 0, fotogrammi mancanti, fuori dal loop, Calma o riduci movimento = immagine ferma.
     ══════════════════════════════════════════════════════════ */

  /* fermo: fotogramma su cui resta quando non gira (altrimenti l'immagine ferma senza numero) */
  function framePlayer(imgs, file, n, fps, fermo) {
    var dir = 'assets/img/' + file.slice(0, 3) + '/';
    var still = new URL(dir + file + '.png', location.href).href;
    var srcs = [], loaded = 0, ready = false, playing = false, t0 = 0, last = -1;
    for (var i = 1; i <= n; i++) {       /* precarica; se ne manca anche uno si resta sull'immagine ferma */
      var im = new Image();
      im.onload = function () { if (++loaded === n) { ready = true; if (playing) start(); } };
      im.src = dir + file + '-' + i + '.png';
      srcs.push(im.src);
    }
    function show(src) { imgs.forEach(function (im) { if (im.src !== src) im.src = src; }); }
    function tick(time) {
      var f = Math.floor((time - t0) * fps) % n;
      if (f !== last) { last = f; show(srcs[f]); }
    }
    function start() { t0 = gsap.ticker.time; last = -1; gsap.ticker.remove(tick); gsap.ticker.add(tick); }
    return {                            /* stessa interfaccia dei tween a tempo reale (updateRealtime) */
      restart: function () { playing = true; if (ready) start(); },
      pause: function () { playing = false; gsap.ticker.remove(tick); if (ready) show(fermo ? srcs[fermo - 1] : still); },
    };
  }

  /* fromTo di un'entrata con autoAlpha: 1 solo nel "da": GSAP lo mette in startAt e, dopo un riavvolgimento,
     non lo riapplica se lo scroll salta oltre l'entrata (l'elemento resta invisibile). La visibilità va quindi
     in un tl.set a parte (uno per elemento se c'è uno stagger), che si riavvolge sempre in modo affidabile. */
  function fromToIn(tl, targets, from, to, pos) {
    if (from.autoAlpha === 1 && to.autoAlpha == null) {
      from = Object.assign({}, from); delete from.autoAlpha;
      var list = gsap.utils.toArray(targets), st = typeof to.stagger === 'number' ? to.stagger : 0;
      list.forEach(function (t, i) { tl.set(t, { autoAlpha: 1 }, pos + i * st); });
    }
    return tl.fromTo(targets, from, to, pos);
  }

  /* Caduta con piccolo rimbalzo all'atterraggio */
  function hop(p) { return p < 0.8 ? (p / 0.8) * (p / 0.8) : 1 - 0.05 * Math.sin(Math.PI * (p - 0.8) / 0.2); }

  /* ══════════════════════════════════════════════════════════
     EFFETTI (movimenti standard di bozza-scene.md)
     ══════════════════════════════════════════════════════════ */

  /* Entrate: [da, a] per un fromTo */
  function inFx(name) {
    switch (name) {
      case 'spunta':       return [{ autoAlpha: 0, scale: 0.6, y: '4vh', transformOrigin: '50% 100%' },
                                   { autoAlpha: 1, scale: 1, y: '0vh', transformOrigin: '50% 100%', ease: 'back.out(1.7)' }];
      case 'cade':         return [{ autoAlpha: 1, y: '-110vh' }, { y: '0vh', ease: hop }];
      case 'cade-pesante': return [{ autoAlpha: 1, y: '-110vh' }, { y: '0vh', ease: 'power3.in' }];
      case 'entra-sx':     return [{ autoAlpha: 1, x: '-100vw' }, { x: '0vw', ease: 'power2.out' }];
      case 'entra-dx':     return [{ autoAlpha: 1, x: '100vw' }, { x: '0vw', ease: 'power2.out' }];
      case 'entra-lati':   return [{ autoAlpha: 1, x: bySide('100vw') }, { x: '0vw', ease: 'power2.out' }];
      case 'sfuma':        return [{ autoAlpha: 0 }, { autoAlpha: 1, ease: 'none' }];
      case 'scende':       return [{ autoAlpha: 1, y: '-110vh' }, { y: '0vh', ease: 'power2.out' }];
      case 'sale':         return [{ autoAlpha: 1, y: '110vh' }, { y: '0vh', ease: 'power2.out' }];
      case 'piove':        return [{ autoAlpha: 1, y: '-110vh', rotation: rnd(-360, 360) }, { y: '0vh', rotation: rnd(-20, 20), ease: 'power1.in' }];
      case 'srotola':      return [{ autoAlpha: 1, clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power1.inOut' }];
      case 'entra-orbita': return [{ autoAlpha: 1, x: bySide('70vw'), y: '-30vh', rotation: 90 }, { x: '0vw', y: '0vh', rotation: 0, ease: 'power2.out' }];
      case 'schiaffa':     return [{ autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, ease: 'power4.out' }];   /* adesivo */
      /* ciondolo: entra grande accanto a lei, rimpicciolisce e va ad appendersi */
      case 'appende':      return [{ autoAlpha: 1, scale: 2.3, x: bySide('16vh'), y: '-8vh', rotation: rnd(-25, 25) },
                                   { scale: 1, x: '0vh', y: '0vh', rotation: 0, ease: 'back.out(1.3)' }];
    }
    console.warn('Effetto di entrata sconosciuto:', name);
    return [{ autoAlpha: 0 }, { autoAlpha: 1 }];
  }

  /* Uscite: vars per un to */
  function outFx(name) {
    switch (name) {
      case 'esce-sx':     return { x: '-100vw', ease: 'power2.in' };
      case 'esce-dx':     return { x: '100vw', ease: 'power2.in' };
      case 'esce-basso':  return { y: '110vh', ease: 'power2.in' };
      case 'esce-alto':   return { y: '-110vh', ease: 'power2.in' };
      case 'esce-lati':   return { x: bySide('100vw'), ease: 'power2.in' };
      case 'vola-via':    return { x: '60vw', y: '-110vh', rotation: 200, ease: 'power2.in' };
      case 'vola-dx':     return { x: '100vw', y: '-15vh', rotation: 120, ease: 'power2.in' };
      case 'vola-alto':   return { y: '-120vh', rotation: -20, ease: 'power2.in' };
      case 'sfuma':       return { autoAlpha: 0, ease: 'none' };
      case 'raccogli':    return { scale: 0.3, autoAlpha: 0, ease: 'power1.in' };
      case 'srotola-via': return { scale: 0, rotation: -720, autoAlpha: 0, ease: 'power2.in' };
    }
    console.warn('Effetto di uscita sconosciuto:', name);
    return { autoAlpha: 0 };
  }

  /* Cambio scena: gli elementi rimasti della scena prima */
  function cambioFx(name) {
    switch (name) {
      case 'sfuma':      return { autoAlpha: 0, ease: 'none' };
      case 'esce-basso': return { y: '130vh', ease: 'power2.in' };
      case 'vola-via':   return { x: '60vw', y: '-120vh', rotation: 200, ease: 'power2.in' };
      case 'legacy':     return { y: '130vh', ease: 'power2.in' };   /* s01: la timeline usa già x e rotation */
      case 'esce-dx':    return { x: '110vw', ease: 'power2.in' };
      case 'via':        return { autoAlpha: 0, ease: 'steps(1)' };  /* sparisce subito (es. dietro il nero di S13) */
    }
    return { y: '130vh', x: rnd(-8, 8, 'vw'), rotation: rnd(-35, 35), ease: 'power2.in' };  /* carta che cade */
  }

  /* "si stacca": come un adesivo, una diagonale scopre l'elemento dall'angolo in alto a sinistra */
  function peelPath(p) {
    if (p <= 100) return 'polygon(' + p + '% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ' + p + '%)';
    var q = p - 100;
    return 'polygon(100% ' + q + '%, 100% 100%, ' + q + '% 100%, 100% 100%, 100% 100%)';
  }
  function peel(tl, target, t, d) {
    var o = { p: 0 };
    tl.to(o, { p: 200, duration: d, ease: 'power1.in',
      onUpdate: function () { target.style.clipPath = peelPath(o.p); } }, t);
  }

  function shakeStage(tl, t) {
    tl.to(stage, { keyframes: { x: ['1vh', '-1vh', '0.6vh', '-0.4vh', '0vh'] }, duration: 0.15, ease: 'none' }, t);
  }

  /* Movimenti a tempo reale (in pausa finché la scena non è quella corrente) */
  function wiggle(target, amp, dur, origin) {
    gsap.set(target, { transformOrigin: origin || '50% 100%' });
    return gsap.timeline({ repeat: -1, paused: true })
      .to(target, { rotation: amp, duration: dur / 4, ease: 'sine.out' })
      .to(target, { rotation: -amp, duration: dur / 2, ease: 'sine.inOut' })
      .to(target, { rotation: 0, duration: dur / 4, ease: 'sine.in' });
  }
  function bounce(target, prop, amount, dur) {
    var v = {}; v[prop] = amount;
    return gsap.to(target, Object.assign(v, { duration: dur, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true }));
  }
  function rtTween(kind, target) {
    switch (kind) {
      case 'oscilla':    return wiggle(target, 3, 2.4, '50% 50%');
      case 'scuote':     return wiggle(target, 4, 0.4);
      case 'scodinzola': return wiggle(target, 4, 0.3);
      case 'luce':       return wiggle(target, 12, 3.2, '50% 0%');
      case 'barcolla':   return wiggle(target, 5, 1.6);
      case 'marcia':     return bounce(target, 'y', '-1.2vh', 0.22);
      case 'corsa':      return bounce(target, 'y', '-1vh', 0.15);
      case 'trema':      return bounce(target, 'x', '0.5vh', 0.05);
      case 'pendolo':    return wiggle(target, 10, 1.6, '50% 0%');   /* ciondoli appesi */
    }
    console.warn('Movimento a tempo reale sconosciuto:', kind);
    return gsap.timeline({ paused: true });
  }

  /* ══════════════════════════════════════════════════════════
     CATERINA — un contenitore, stato simulato lungo tutto il sito
     #character   → solo timeline: --cx (x %), --cb (piedi, vh dal fondo), --cs (scala), autoAlpha
     .cate__how   → solo timeline: saltella, corre, cade, capriola…
     .cate__rt    → solo tempo reale: marcia, barcolla, trema
     ══════════════════════════════════════════════════════════ */

  var C = { x: 50, y: 26, h: 10, img: null, alpha: 0, rot: 0 };   /* prima di nascere: dentro la bacinella */
  var cateVars = {};

  /* Versione minima: ogni versione mancante ripiega sulla Caterina della sua età (bambina S02–S04, medie S05,
     liceo S06–S07, studentessa da S08). Le immagini si dimensionano sulla figura (fitFigure). */
  function cateFallback(img, sid) {
    var n = +sid.slice(1);
    var fb = n <= 4 ? 's03-cate-bambina' : n === 5 ? 's05-cate-medie' : n <= 7 ? 's03-cate-liceo' : 's09-cate-studentessa';
    return n >= 2 && img !== fb ? fb : null;
  }
  SCENES.forEach(function (sc) {
    sc.beats.forEach(function (b) {
      [].concat(b.move || []).forEach(function (m) {
        if (!m.img || cateVars[m.img]) return;
        var w = el('div', 'img-wrap variant cate__var', cateFig);
        addMedia(w, m.img);
        var im = w.querySelector('img'), fb = cateFallback(m.img, sc.id);
        if (fb) {
          im.addEventListener('error', function () {
            if (im.dataset.fb) return;
            im.dataset.fb = '1';
            im.src = 'assets/img/' + fb.slice(0, 3) + '/' + fb + '.png';
          });
          if (im.complete && im.naturalWidth === 0) im.dispatchEvent(new Event('error'));
        }
        fitFigure(im);
        cateVars[m.img] = w;
      });
    });
  });
  gsap.set(Object.keys(cateVars).map(function (k) { return cateVars[k]; }), { autoAlpha: 0 });

  function cateBottom(y, h) { return y === 'floor' ? FLOOR : y - h / 2; }
  function cateCss(s) { return { '--cx': s.x, '--cb': cateBottom(s.y, s.h), '--cs': s.h / CATE_BOX }; }

  gsap.set(cate, Object.assign(cateCss(C), { autoAlpha: 0 }));
  gsap.set([cateHow, cateFig], { transformOrigin: '50% 100%' });

  var cateRtTw = reducedMotion ? {} : {
    marcia: rtTween('marcia', cateRt),
    barcolla: rtTween('barcolla', cateRt),
    trema: rtTween('trema', cateRt),
  };

  function hops(tl, t0, d, n, amp) {
    for (var i = 0; i < n; i++) {
      tl.to(cateHow, { y: '-' + amp + 'vh', duration: d / (2 * n), ease: 'sine.out' }, t0 + i * d / n);
      tl.to(cateHow, { y: '0vh', duration: d / (2 * n), ease: 'sine.in' }, t0 + i * d / n + d / (2 * n));
    }
  }

  function how(tl, kind, t0, d, dir) {
    switch (kind) {
      case 'cammina':  hops(tl, t0, d, 3, 1.5); break;
      case 'saltella': hops(tl, t0, d, 3, 6); break;
      case 'salto':    hops(tl, t0, d, 1, 12); break;
      case 'sobbalzo': hops(tl, t0, d, 1, 2.5); break;
      case 'corre':
        tl.to(cateHow, { rotation: 8 * dir, duration: d * 0.15 }, t0);
        tl.to(cateHow, { rotation: C.rot, duration: d * 0.15 }, t0 + d * 0.85);
        hops(tl, t0, d, 4, 1.5);
        break;
      case 'capriola':
        hops(tl, t0, d, 1, 15);
        tl.fromTo(cateHow, { rotation: 0 }, { rotation: 360, duration: d, ease: 'power1.inOut', immediateRender: false }, t0);
        tl.set(cateHow, { rotation: 0 }, t0 + d);
        break;
      case 'cade':     /* ruota, tocca terra, resta un attimo, si rialza */
        tl.to(cateHow, { rotation: 85, duration: d * 0.3, ease: 'power2.in' }, t0);
        tl.to(cateHow, { rotation: 0, duration: d * 0.3, ease: 'back.out(1.4)' }, t0 + d * 0.7);
        break;
      case 'gira':
        tl.to(cateHow, { scaleX: -1, duration: d * 0.15 }, t0);
        tl.to(cateHow, { scaleX: 1, duration: d * 0.15 }, t0 + d * 0.55);
        break;
      case 'inclina':  tl.to(cateHow, { rotation: -8, duration: d }, t0); C.rot = -8; break;
      case 'dritta':   tl.to(cateHow, { rotation: 0, duration: d }, t0); C.rot = 0; break;
      case 'respiro':
        tl.to(cateHow, { scale: 1.05, duration: d / 2, ease: 'sine.inOut' }, t0);
        tl.to(cateHow, { scale: 1, duration: d / 2, ease: 'sine.inOut' }, t0 + d / 2);
        break;
      case 'danza':    /* tre oscillazioni dei fianchi */
        tl.to(cateHow, { keyframes: { rotation: [0, 6, -6, 6, -6, 6, -6, 0] }, duration: d, ease: 'none' }, t0);
        break;
    }
  }

  function addMoves(sc, tl, T) {
    sc.cateStart = { x: C.x, y: C.y, h: C.h, img: C.img, alpha: C.alpha, rot: C.rot };   /* com'è Caterina a inizio scena */
    sc.beats.forEach(function (b) {
      [].concat(b.move || []).forEach(function (m) {
        var len = sc.lens[b.id];
        /* mai esattamente a 0: le timeline ancora ferme non devono toccare Caterina */
        var t0 = Math.max(T(b.id, m.at || 0), 0.001);
        var d = (m.d != null ? m.d : 0.2) * len;

        /* nasce / sparisce */
        if (m.how === 'nasce' || m.how === 'sparisce') {
          var a = m.how === 'nasce' ? 1 : 0;
          tl.fromTo(cate, { autoAlpha: C.alpha }, { autoAlpha: a, duration: d * (a ? 0.15 : 1), ease: 'none', immediateRender: false }, t0);
          C.alpha = a;
        }

        /* cambia in X: dissolvenza nel primo 20% della battuta */
        if (m.img && m.img !== C.img) {
          var fd = Math.min(d, 0.2 * len);
          if (C.img) tl.fromTo(cateVars[C.img], { autoAlpha: 1 }, { autoAlpha: 0, duration: fd, ease: 'none', immediateRender: false }, t0);
          tl.fromTo(cateVars[m.img], { autoAlpha: 0 }, { autoAlpha: 1, duration: C.img ? fd : 0.01, ease: 'none', immediateRender: false }, t0);
          /* pop di carta: un piccolo sobbalzo di scala a ogni cambio d'abito */
          if (C.img) tl.to(cateFig, { keyframes: [{ scale: 1.06, duration: fd * 0.45 }, { scale: 1, duration: fd * 0.75 }], ease: 'power2.out' }, t0);
          C.img = m.img;
        }

        /* posizione e altezza */
        var n = { x: m.x != null ? m.x : C.x, y: m.y != null ? m.y : C.y, h: m.h != null ? m.h : C.h };
        var dir = n.x < C.x ? -1 : 1;
        if (n.x !== C.x || n.y !== C.y || n.h !== C.h) {
          var ease = m.ease || (m.how === 'nasce' ? 'elastic.out(1, 0.5)' : m.how === 'cammina' ? 'none'
            : m.how === 'corre' ? 'power1.inOut' : 'power2.inOut');
          tl.fromTo(cate, cateCss(C), Object.assign(cateCss(n), { duration: d, ease: ease, immediateRender: false }), t0);
          C.x = n.x; C.y = n.y; C.h = n.h;
        }

        if (m.how) how(tl, m.how, t0, d, dir);
      });
    });
  }

  /* Movimento a tempo reale di Caterina attivo nella battuta corrente */
  function cateRtFor(sc) {
    var want = null;
    sc.beats.forEach(function (b, i) {
      if (i > sc.beatIdx) return;
      [].concat(b.move || []).forEach(function (m) {
        if (!m.rt) return;
        var until = m.rt.until === 'end' ? Infinity : sc.idx[m.rt.until];
        want = sc.beatIdx < until ? m.rt.fx : null;
      });
    });
    return want;
  }

  /* ══════════════════════════════════════════════════════════
     ORBITE (a tempo reale, fuori dallo scrub)
     ══════════════════════════════════════════════════════════ */

  function toPx(v) { return parseFloat(v) * (/vw$/.test(v) ? window.innerWidth : window.innerHeight) / 100; }

  function renderOrbit(o) {
    var W = window.innerWidth / 100, H = window.innerHeight / 100;
    var rx = toPx(o.rx) * o.k, ry = toPx(o.ry) * o.k;
    o.items.forEach(function (m) {
      var a = (o.angle + m.phase) * Math.PI / 180;
      var x = Math.cos(a) * rx, y = -Math.sin(a) * ry;
      if (m.join) {                      /* orbitFrom: parte da un punto fisso e si aggancia */
        var j = m.join.j;
        x = m.fx * W * (1 - j) + x * j;
        y = m.fy * H * (1 - j) + y * j;
      }
      m.sx(x); m.sy(y);
      if (o.depth) m.root.style.zIndex = Math.sin(a) < 0 ? 35 : 15;   /* passa davanti e dietro a lei */
    });
  }
  function renderAllOrbits() {
    SCENES.forEach(function (sc) { sc.orbitList.forEach(renderOrbit); });
  }
  function orbitSpeed(o, sc) {
    var s = 1;
    if (o.speed) sc.beats.forEach(function (b, i) { if (i <= sc.beatIdx && o.speed[b.id] != null) s = o.speed[b.id]; });
    return s;
  }

  /* ══════════════════════════════════════════════════════════
     ELEMENTI
     .item      posizione e z (solo CSS)
     .item__x   solo il cambio scena (lo anima la scena DOPO)
     .item__tl  entrate, uscite e animazioni su misura della sua scena
     .item__rt  tempo reale / orbita
     .item__c   contenuto: immagine+segnaposto, cartoncino, scritta, bottone
     ══════════════════════════════════════════════════════════ */

  function labelSize(text, kind) {
    var n = Math.max(text.length, 1);
    if (kind === 'testo' || n <= 14) return 'min(' + (kind === 'testo' ? 70 : 34) + 'cqh, ' + (150 / n).toFixed(1) + 'cqw)';
    return 'min(14cqh, ' + (260 / n).toFixed(1) + 'cqw)';
  }

  function place(root, it, p, sc) {
    var k = it.attach ? CATE_BOX / (sc.cateH || CATE_BOX) : 1;   /* dentro Caterina: compensa la sua scala */
    var H = it.h * k;
    var W = it.w ? it.w + 'vw' : (H * (it.r || 1)).toFixed(2) + 'vh';
    var dx = p.dx || it.dx;
    root.style.height = H.toFixed(2) + 'vh';
    root.style.width = W;
    root.style.left = 'calc(' + p.x + '% - ' + W + ' / 2' + (dx ? ' + ' + dx : '') + ')';
    var y = p.y == null ? 'floor' : p.y;
    if (y === 'top') root.style.top = '0';
    else if (y === 'floor') root.style.bottom = it.attach ? '0' : FLOOR + '%';
    else root.style.bottom = 'calc(' + y + '% - ' + (H / 2).toFixed(2) + 'vh' + (it.dy ? ' + ' + it.dy : '') + ')';
  }

  function makeNode(sc, it, p, i, file) {
    var kind = it.kind || '';
    var interactive = kind === 'bottone' || kind === 'approfondimento' || kind === 'clic';
    var root = el('div', 'item' + (kind ? ' is-' + kind : '') + (it.cls ? ' ' + it.cls : '') + (it.labelSeManca ? ' label-se-manca' : '')
      + (it.round ? ' is-round' : '') + (it.frame ? ' is-frame' : '') + (it.label ? ' has-label' : ''));
    root.dataset.item = sc.id + '-' + it.id + (i ? '-' + i : '');
    root.style.zIndex = it.z || Z[kind] || 20;
    place(root, it, p, sc);

    var x = el('div', 'item__x', root);
    var tlw = el('div', 'item__tl', x);
    var rt = el('div', 'item__rt', tlw);
    var c = el(interactive ? 'button' : 'div', 'item__c' + (kind === 'clic' ? ' clic-btn' : interactive ? ' paper-btn' : ''), rt);

    if (file) { c.classList.add('img-wrap'); addMedia(c, file, it.tbd); if (it.fig) fitFigure(c.querySelector('img')); }
    else if (kind !== 'testo' && !it.confetti) c.classList.add('card');

    var label = it.labels ? it.labels[i] : it.label;
    if (label) {
      var lb = el('span', 'item__label' + (kind === 'testo' || label.length <= 14 ? ' is-1line' : ''), c);
      var ln = { el: lb, key: sc.id + '-' + it.id + (it.labels ? '-' + (i + 1) : ''), it: label, kind: kind };
      i18nNodes.push(ln);
      paintText(ln);
    }
    if (it.rot != null) c.style.rotate = (Array.isArray(it.rot) ? it.rot[i] : it.rot) + 'deg';
    /* oggetto cliccabile: puntino che pulsa, apre il foglio degli approfondimenti */
    if (kind === 'clic') {
      el('i', 'clic-dot', c);
      c.setAttribute('aria-haspopup', 'dialog');
      c.dataset.i18nLabel = sc.id + '-' + it.id;
      c.dataset.itLabel = it.sheet;
      c.addEventListener('click', function () { openSheet(c, c.getAttribute('aria-label'), 'media'); });
    }
    if (it.nome) { c.dataset.i18nLabel = sc.id + '-' + it.id + '-nome'; c.dataset.itLabel = it.nome; }
    if (it.halves) c.style.clipPath = i ? 'inset(0% 0% 0% 50%)' : 'inset(0% 50% 0% 0%)';
    if (it.confetti) {
      var bits = [];
      for (var j = 0; j < it.confetti; j++) {
        var bit = el('i', 'confetto', c);
        bit.style.left = gsap.utils.random(1, 98) + '%';
        bit.style.bottom = gsap.utils.random(FLOOR, FLOOR + 3) + '%';
        bit.style.height = gsap.utils.random(2, 3) + 'vh';
        bit.style.background = PALETTE[j % PALETTE.length];
        bits.push(bit);
      }
      gsap.set(bits, { y: '-100vh' });
      c._bits = bits;
    }

    if (interactive) c.type = 'button';
    else root.setAttribute('aria-hidden', 'true');

    (it.attach ? cateAttach : sc.layer).appendChild(root);
    tlw._side = p.x < 50 ? -1 : 1;
    return { root: root, x: x, tl: tlw, rt: rt, c: c, p: p, i: i };
  }

  function buildItem(sc, it, tl, T, D) {
    var list = [];
    if (it.pos) list = it.pos.map(function (p) { return { x: p[0], y: p[1] }; });
    else if (it.ring) {
      for (var r = 0; r < it.ring.n; r++) {
        var a = (90 - 360 * r / it.ring.n) * Math.PI / 180;
        list.push({ x: it.ring.cx, y: +(it.ring.cy + it.ring.r * Math.sin(a)).toFixed(2), dx: (it.ring.r * Math.cos(a)).toFixed(2) + 'vh' });
      }
    } else for (var n = 0; n < (it.n || 1); n++) list.push({ x: it.x, y: it.y });

    var orbit = it.orbit ? sc.orb[it.orbit] : null;
    var nodes = list.map(function (p, i) {
      if (orbit) p = { x: orbit.cx, y: orbit.cy };
      var file = it.files ? it.files[i] : it.file === null || it.confetti ? null : (it.file || sc.id + '-' + it.id);
      var node = makeNode(sc, it, p, i, file);
      if (orbit) {
        var phase = (it.phase || 0) + i * (it.spread != null ? it.spread : 360 / list.length);
        var m = { phase: phase, root: node.root,
          sx: gsap.quickSetter(node.rt, 'x', 'px'), sy: gsap.quickSetter(node.rt, 'y', 'px') };
        if (it.orbitFrom) { m.join = { j: 0 }; m.fx = it.orbitFrom[0] - orbit.cx; m.fy = -(it.orbitFrom[1] - orbit.cy); }
        orbit.items.push(m);
        node.tl._side = Math.cos(phase * Math.PI / 180) >= 0 ? 1 : -1;
        node.orbitItem = m;
      }
      return node;
    });

    sc.nodes[it.id] = nodes;
    if (it.cambio !== 'resta') nodes.forEach(function (nd) { sc.exitTargets.push({ el: nd.x, fx: it.cambio }); });
    if (it.testo) i18nNodes.push({ el: el('p', 'visually-hidden', sc.section), key: sc.id + '-' + it.id + '-testo', it: it.testo });
    var tls = nodes.map(function (nd) { return nd.tl; });

    /* Entrata */
    if (it.in) {
      gsap.set(tls, { autoAlpha: 0 });
      var s = it.in === 'custom' ? null : spec(it.in);
      if (s) {
        var t0 = T(s.b, s.at || 0), d = (s.d != null ? s.d : 0.2) * sc.lens[s.b], st = (s.stagger || 0) * sc.lens[s.b];
        if (s.fx === 'coriandoli') {
          tl.fromTo(tls, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001, immediateRender: false }, t0);
          nodes.forEach(function (nd) {
            tl.to(nd.c._bits, { y: '0vh', rotation: rnd(-200, 200), ease: 'sine.in', duration: d * 0.4,
              stagger: { each: d * 0.6 / nd.c._bits.length, from: 'random' } }, t0);
          });
        } else {
          var v = inFx(s.fx);
          fromToIn(tl, tls, v[0], Object.assign(v[1], { duration: d, stagger: st, immediateRender: false }), t0);
          if (s.fx === 'cade-pesante') shakeStage(tl, t0 + d);   /* al tocco, scossone di tutta la scena */
        }
        /* orbitFrom: si aggancia all'orbita nella battuta dopo l'entrata */
        nodes.forEach(function (nd) {
          if (!nd.orbitItem || !nd.orbitItem.join) return;
          var nb = sc.beats[sc.idx[s.b] + 1].id;
          tl.fromTo(nd.orbitItem.join, { j: 0 }, { j: 1, duration: D(nb, 0.5), ease: 'power1.inOut', immediateRender: false }, T(nb));
        });
      }
    }

    /* Uscita (senza "at": 80–100% della battuta prima) */
    if (it.out) {
      var o = spec(it.out), t1, d1;
      if (o.at == null) { d1 = 0.2 * sc.lens[sc.beats[Math.max(0, sc.idx[o.b] - 1)].id]; t1 = Math.max(0, T(o.b) - d1); }
      else { t1 = T(o.b, o.at); d1 = (o.d != null ? o.d : 0.2) * sc.lens[o.b]; }
      var st1 = (o.stagger || 0) * sc.lens[o.b];
      if (o.fx === 'si-stacca') nodes.forEach(function (nd) { peel(tl, nd.c, t1, d1); });
      else if (o.fx === 'strappa') nodes.forEach(function (nd) {
        var sd = nd.i ? 1 : -1;
        tl.to(nd.tl, { x: sd * 6 + 'vh', rotation: sd * 14, duration: d1 * 0.35, ease: 'power2.out' }, t1);
        tl.to(nd.tl, { y: '110vh', rotation: sd * 40, duration: d1 * 0.65, ease: 'power2.in' }, t1 + d1 * 0.35);
      });
      else {
        tl.to(tls, Object.assign(outFx(o.fx), { duration: d1, stagger: st1 }), t1);
        if (o.fx === 'raccogli' && orbit && !orbit.gathering) {   /* gli oggetti si raccolgono dietro di lei */
          orbit.gathering = true;
          tl.to(orbit, { k: 0.15, duration: d1, ease: 'power2.in' }, t1);
        }
      }
    }

    /* Tempo reale */
    if (it.rt && !reducedMotion) nodes.forEach(function (nd) {
      sc.rts.push({ tw: rtTween(it.rt, nd.rt), from: 0, until: Infinity });
    });
  }

  /* ══════════════════════════════════════════════════════════
     SCENE
     ══════════════════════════════════════════════════════════ */

  function buildScene(sc, k) {
    var prev = SCENES[k - 1];
    var last = k === SCENES.length - 1;

    /* tempi: 1 unità = 100vh di scroll */
    var t = 0;
    sc.labels = {}; sc.lens = {}; sc.idx = {};
    sc.beats.forEach(function (b, i) {
      sc.labels[b.id] = t; sc.lens[b.id] = b.len / 100; sc.idx[b.id] = i; t += b.len / 100;
    });
    sc.total = t;
    sc.beatIdx = 0;
    sc.lastP = 0;
    sc.rts = [];
    sc.nodes = {};
    sc.exitTargets = [];
    function T(b, f) { return sc.labels[b] + (f || 0) * sc.lens[b]; }
    function D(b, f) { return f * sc.lens[b]; }
    function N(id) { return sc.nodes[id]; }

    /* traccia di scroll */
    var sec = el('section', 'scene', tracks);
    sec.id = 'scene-' + sc.id;
    sec.dataset.scene = sc.id;
    sec.setAttribute('aria-label', 'Scena ' + k + ': ' + sc.title);
    sec.style.height = (t * 100 + (last ? 100 : 0)) + 'vh';
    el('h2', 'visually-hidden', sec).textContent = sc.title;
    /* il racconto intero, leggibile di seguito con lo screen reader */
    sc.beats.forEach(function (b) {
      if (b.text) i18nNodes.push({ el: el('p', 'visually-hidden', sec), key: sc.id + '-' + b.id, it: b.text });
    });
    sc.section = sec;

    /* strato sul palco (senza z-index: gli z degli elementi si confrontano con Caterina) */
    var layer = stage.querySelector('[data-layer="' + sc.id + '"]');
    if (!layer) {
      layer = el('div', 'layer');
      layer.dataset.layer = sc.id;
      stage.insertBefore(layer, cate);
    }
    sc.layer = layer;

    /* sfondo */
    var bg = bgs.querySelector('[data-bg="' + sc.id + '"]');
    if (!bg && sc.bg) {
      bg = el('div', 'bg', sc.bgZ ? layer : bgs);
      bg.dataset.bg = sc.id;
      bg.style.backgroundColor = sc.bg;
      if (sc.bgZ) bg.style.zIndex = sc.bgZ;
    }
    sc.bgEl = bg;

    /* orbite */
    sc.orb = {};
    sc.orbitList = (sc.orbits || []).map(function (o) {
      var ob = Object.assign({}, o, { angle: 0, k: 1, items: [] });
      sc.orb[o.id] = ob;
      return ob;
    });

    /* timeline */
    var tlVars = {
      paused: reducedMotion,
      defaults: { ease: 'power1.inOut' },
      onUpdate: function () { onSceneUpdate(sc); },
    };
    if (!reducedMotion) tlVars.scrollTrigger = {
      trigger: sec,
      start: 'top top',
      end: last ? 'bottom bottom' : 'bottom top',
      scrub: 0.8,
    };
    var tl = gsap.timeline(tlVars);
    sc.tl = tl;
    sc.beats.forEach(function (b) { tl.addLabel(b.id, sc.labels[b.id]); });
    tl.set({}, {}, sc.total);          /* la timeline dura esattamente quanto lo scroll */

    /* elementi (+ approfondimento da S02 a S16; S00 «Ciao» tolto il 30/09) */
    var items = (sc.items || []).slice();
    var first = sc.beats[0].id === 'c' ? sc.beats[1].id : sc.beats[0].id;
    if (sc.id !== 's01') items.push({ id: 'approfondimento', kind: 'approfondimento', x: 5, y: 9, h: 9, r: 1, in: first + ' spunta' });
    items.forEach(function (it) { buildItem(sc, it, tl, T, D); });

    /* cambio scena: la scena prima cade giù, lo sfondo sfuma */
    if (prev && sc.beats[0].id === 'c') {
      var tc = T('c'), dc = D('c', 0.5), groups = {};
      prev.exitTargets.forEach(function (e) { (groups[e.fx || 'cade'] = groups[e.fx || 'cade'] || []).push(e.el); });
      Object.keys(groups).forEach(function (fx) {
        tl.to(groups[fx], Object.assign(cambioFx(fx), { duration: dc, stagger: { amount: dc * 0.4, from: 'random' } }), tc);
        tl.set(groups[fx], { autoAlpha: 0 }, tc + dc * 1.4);   /* fuori schermo = anche fuori dal Tab */
      });
      if (bg) {
        gsap.set(bg, { autoAlpha: 0 });
        tl.fromTo(bg, { autoAlpha: 0 }, { autoAlpha: 1, duration: D('c', 0.6), ease: 'none', immediateRender: false }, tc);
      }
    }

    /* sfondo che cambia colore dentro la scena */
    var color = sc.bg;
    (sc.bgTo || []).forEach(function (c) {
      tl.fromTo(bg, { backgroundColor: color }, { backgroundColor: c.color, duration: D(c.b, c.d || 0.3), ease: 'none', immediateRender: false }, T(c.b, c.at || 0));
      color = c.color;
    });
    if (sc.bgOut) tl.to(bg, { autoAlpha: 0, duration: D(sc.bgOut.b, sc.bgOut.d || 0.3), ease: 'none' }, T(sc.bgOut.b, sc.bgOut.at || 0));

    /* movimenti di Caterina in una timeline a parte, guidata solo dalla scena corrente (driveCate) */
    sc.cateTl = gsap.timeline({ paused: true });
    addMoves(sc, sc.cateTl, T);
    if (EXTRAS[sc.id]) EXTRAS[sc.id](sc, tl, T, D, N);

    /* animazioni a fotogrammi: loop a tempo reale nelle battute indicate */
    if (!reducedMotion) (sc.anims || []).forEach(function (a) {
      var imgs = [].slice.call(layer.querySelectorAll('img[data-anim="' + a.file + '"]'));
      if (!a.frames || !imgs.length) return;
      sc.rts.push({ tw: framePlayer(imgs, a.file, a.frames, a.fps || 6, a.fermo),
        from: sc.idx[a.da || sc.beats[0].id], until: a.a ? sc.idx[a.a] : Infinity });
    });

    /* soglie delle battute dalle label della timeline */
    sc.thresholds = sc.beats.map(function (b) { return tl.labels[b.id] / tl.duration(); });

    /* prefers-reduced-motion: niente scrub; ogni battuta è un fotogramma fermo */
    if (reducedMotion) {
      sc.st = ScrollTrigger.create({
        trigger: sec, start: 'top top', end: last ? 'bottom bottom' : 'bottom top',
        onUpdate: function (s) { rmSnap(sc, s.progress); },
        onRefresh: function (s) { rmSnap(sc, s.progress); },
        onLeave: function () { rmSnap(sc, 1); },
        onLeaveBack: function () { rmSnap(sc, 0); },
      });
    } else sc.st = tl.scrollTrigger;
  }

  function rmSnap(sc, p) {
    var target = 0;
    if (p >= 1) target = sc.total;
    else if (p > 0) {
      var b = sc.beats[beatAt(sc, p)];
      target = sc.labels[b.id] + 0.7 * sc.lens[b.id];    /* dopo le entrate, prima delle uscite */
    }
    if (sc.tl.time() === target) return;
    sc.tl.time(target);
    sc.orbitList.forEach(renderOrbit);
    onSceneUpdate(sc);
  }

  /* ══════════════════════════════════════════════════════════
     ANIMAZIONI SU MISURA (tutto ciò che non è un effetto standard)
     ══════════════════════════════════════════════════════════ */

  var videoPlaying = false, videoCtl = null;   /* S16: il video del saggio */

  var EXTRAS = {

    /* ── S01 — La ricetta ─────────────────────────────── */
    /* Pose: cambio con dissolvenza incrociata; i gesti (fotogrammi) sono in anims, in scenes.js */
    s01: function (sc, tl, T, D) {
      var L = sc.layer;
      function q(s) { return L.querySelectorAll(s); }
      function swap(from, to, t, d) {
        tl.to(q(from), { autoAlpha: 0, duration: d }, t);
        tl.to(q(to), { autoAlpha: 1, duration: d }, t);
      }

      /* coriandoli di carta */
      var bits = [], shapes = ['', 's01-confetto--circle', 's01-confetto--tri'];
      for (var i = 0; i < 45; i++) {
        var c = el('div', 's01-confetto ' + shapes[i % 3], L.querySelector('.s01-confetti'));
        c.style.backgroundColor = PALETTE[i % PALETTE.length];
        bits.push(c);
      }

      /* stati iniziali: sagome nere, entrambi fermi sulla posa mescola */
      gsap.set(q('.s01-papa-grana, .s01-papa-oops, .s01-papa-confuso, .s01-mamma-confusa, .s01-ampolla-cracked'), { autoAlpha: 0 });
      gsap.set(q('.s01-pandeiro'), { y: '-110vh', autoAlpha: 0 });
      gsap.set(q('.s01-scaglie'), { autoAlpha: 0 });
      gsap.set(q('.s01-fumetto'), { autoAlpha: 0, scale: 0.3 });
      gsap.set(q('.s01-ampolla-liquid-wrap'), { clipPath: 'inset(0% 0% 100% 0%)' });   /* il liquido non c'è ancora */
      gsap.set(bits, { autoAlpha: 0, scale: 0 });

      /* b1 — (se c'è s01-mamma-pandeiro: a metà battuta il pandeiro le vola via di mano e lei passa a mescola) */
      var mamma = L.querySelector('.s01-mamma');
      gsap.set(mamma, { '--pand': 1, '--drop': 0 });
      tl.to(mamma, { '--pand': 0, '--drop': 1, duration: D('b1', 0.04), ease: 'none' }, T('b1', 0.45));   /* le scappa di mano */
      tl.to(mamma, { '--drop': 0, duration: D('b1', 0.04), ease: 'none' }, T('b1', 0.75));                /* torna a mescolare */
      /* il pandeiro cade ruotando un po' nella bacinella e sparisce dietro il bordo: tuffo */
      fromToIn(tl, q('.s01-pandeiro'), { y: '-110vh', autoAlpha: 1, rotation: -20 },
        { y: '14vh', rotation: 25, duration: D('b1', 0.35), ease: 'power2.in', immediateRender: false }, T('b1', 0.45));
      tl.to(q('.s01-bacinella'), { scaleY: 0.94, transformOrigin: '50% 100%', duration: D('b1', 0.05), ease: 'power2.out',
        yoyo: true, repeat: 1 }, T('b1', 0.75));
      /* …ed escono 4 note (una sola immagine, clonata) che salgono fino al 75% */
      var dentro = L.querySelector('.s01-dentro');
      [-7, -2, 3, 8].forEach(function (dx, i) {
        var w = el('div', 'img-wrap s01-caduta s01-nota', dentro);
        var im = el('img', 'scene-img', w);
        im.src = 'assets/img/s01/s01-note.png'; im.alt = '';
        var ph = el('div', 'placeholder placeholder--' + (i % 5), w);
        ph.textContent = 's01-note.png';
        wireImg(im, ph);
        gsap.set(w, { x: dx + 'vh', y: '8vh', autoAlpha: 0, height: [5, 7, 4, 8][i] + 'vh' });
        tl.to(w, { y: '-38vh', rotation: i % 2 ? 12 : -12, autoAlpha: 1, duration: D('b1', 0.35),
          ease: 'power1.out' }, T('b1', 0.72 + i * 0.05));
        tl.to(w, { autoAlpha: 0, duration: D('b2', 0.1) }, T('b2', 0.05 + i * 0.03));
      });

      /* b2–b3 — il papà grattugia il grana: scaglie dalla sua parte (x ~40%) alla bacinella */
      swap('.s01-papa-mescola', '.s01-papa-grana', T('b2'), D('b2', 0.12));
      fromToIn(tl, q('.s01-scaglie'), { autoAlpha: 1, x: '-10vw', y: '-9vh' },
        { x: '0vw', y: '8vh', duration: D('b2', 0.5), ease: 'power1.in', immediateRender: false }, T('b2', 0.2));
      tl.fromTo(q('.s01-scaglie'), { x: '-10vw', y: '-9vh' },
        { x: '0vw', y: '8vh', duration: D('b3', 0.4), ease: 'power1.in', immediateRender: false }, T('b3', 0.3));

      /* b3 — fumetti: papà «Buongiorno!», mamma «Buona giornata!», poi cadono nella bacinella */
      tl.fromTo(q('.s01-fumetto-1'), { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, duration: D('b3', 0.2), ease: 'back.out(1.6)', immediateRender: false }, T('b3'));
      tl.fromTo(q('.s01-fumetto-2'), { autoAlpha: 0, scale: 0.3 },
        { autoAlpha: 1, scale: 1, duration: D('b3', 0.2), ease: 'back.out(1.6)', immediateRender: false }, T('b3', 0.08));
      tl.to(q('.s01-fumetto-1'), { x: '14vw', y: '24vh', scale: 0.35, autoAlpha: 0, duration: D('b3', 0.2), ease: 'power2.in' }, T('b3', 0.78));
      tl.to(q('.s01-fumetto-2'), { x: '-14vw', y: '24vh', scale: 0.35, autoAlpha: 0, duration: D('b3', 0.2), ease: 'power2.in' }, T('b3', 0.8));

      /* b4 — entrambi mescolano (il papà lascia il grana) */
      swap('.s01-papa-grana', '.s01-papa-mescola', T('b4'), D('b4', 0.12));

      /* b5 — le sagome si staccano come adesivi e compaiono i colori; leggera inclinazione (resta) */
      peel(tl, L.querySelector('.s01-papa-shadow'), T('b5', 0.1), D('b5', 0.35));
      peel(tl, L.querySelector('.s01-mamma-shadow'), T('b5', 0.2), D('b5', 0.35));
      tl.to(q('.s01-papa'), { rotation: 4, transformOrigin: '50% 100%', duration: D('b5', 0.3) }, T('b5', 0.5));
      tl.to(q('.s01-mamma'), { rotation: -4, transformOrigin: '50% 100%', duration: D('b5', 0.3) }, T('b5', 0.5));

      /* b6 — oops: il gomito del papà (all'indietro, verso sinistra) urta l'ampolla, che si crepa */
      swap('.s01-papa-mescola', '.s01-papa-oops', T('b6', 0.05), D('b6', 0.08));
      tl.to(q('.s01-ampolla-glass'), { autoAlpha: 0, duration: D('b6', 0.06) }, T('b6', 0.15));
      tl.to(q('.s01-ampolla-cracked'), { autoAlpha: 1, duration: D('b6', 0.06) }, T('b6', 0.15));

      /* b7 — il liquido scende e scopre l'etichetta; la bacinella trema (la mamma si ferma: vedi anims) */
      /* b7: dall'ampolla crepata cola il liquido nero (s01-liquido), dall'alto verso il ripiano */
      tl.to(q('.s01-ampolla-liquid-wrap'), { clipPath: 'inset(0% 0% 0% 0%)', duration: D('b7', 0.45), ease: 'power1.in' }, T('b7'));
      tl.to(q('.s01-bacinella-area'), { keyframes: { x: ['0.6vh', '-0.6vh', '0.6vh', '-0.6vh', '0.4vh', '0vh'] },
        duration: D('b7', 0.35), ease: 'none' }, T('b7', 0.3));

      /* b8 — entrambi confusi guardano la neonata (sale dalla bacinella col campo move); coriandoli */
      swap('.s01-papa-oops', '.s01-papa-confuso', T('b8'), D('b8', 0.1));
      swap('.s01-mamma-mescola', '.s01-mamma-confusa', T('b8'), D('b8', 0.1));
      tl.to(bits, {
        autoAlpha: 1, scale: rnd(0.6, 1.6), x: rnd(-30, 30, 'vh'), y: rnd(-40, -8, 'vh'), rotation: rnd(-200, 200),
        duration: D('b8', 0.25), stagger: D('b8', 0.2) / bits.length, ease: 'power2.out',
      }, T('b8', 0.05));
      tl.to(bits, { autoAlpha: 0, duration: D('b8', 0.15), stagger: D('b8', 0.1) / bits.length }, T('b8', 0.6));

      /* al cambio scena cade tutto (i fumetti sono già spariti e hanno y occupata) */
      sc.exitTargets = Array.prototype.filter.call(L.children, function (c) {
        return !c.classList.contains('s01-fumetto');
      }).map(function (c) { return { el: c, fx: 'legacy' }; });
    },

    /* ── S02 — Il nome ────────────────────────────────── */
    s02: function (sc, tl, T, D, N) {
      /* b2: la culla sobbalza quando passa a "piena col vomito" */
      var culla = N('culla-piena-vomito')[0].c;
      tl.to(culla, { y: '-1.2vh', rotation: -3, transformOrigin: '50% 100%', duration: D('b2', 0.05), ease: 'power2.out' }, T('b2', 0.3));
      tl.to(culla, { y: '0vh', rotation: 0, duration: D('b2', 0.1), ease: 'bounce.out' }, T('b2', 0.35));
      /* la virgola: compare col certificato, si stacca (il certificato passa a no-virgola), cade a terra, poi vola via (out) */
      var v = N('virgola')[0].tl;
      /* compare quando il certificato ha finito di spuntare (prima la scala lo sposterebbe dal suo punto) */
      tl.fromTo(v, { autoAlpha: 0 }, { autoAlpha: 1, duration: D('b1', 0.01), ease: 'none', immediateRender: false }, T('b1', 0.22));
      /* cade fino al pavimento: dal centro al 68% + 3.68vh fino al 12% + mezza virgola */
      tl.to(v, { y: '59vh', rotation: 200, duration: D('b3', 0.17), ease: 'power2.in' }, T('b3', 0.5));
      tl.to(v, { y: '57.8vh', duration: D('b3', 0.04), ease: 'sine.out', yoyo: true, repeat: 1 }, T('b3', 0.67));
      /* b4: il certificato cresce 30 → 38vh */
      tl.to(N('certificato-no-virgola')[0].tl, { scale: 38 / 30, duration: D('b4', 0.6), ease: 'power1.inOut' }, T('b4', 0));
    },

    /* ── S03 — I sogni da piccola ─────────────────────── */
    s03: function (sc, tl, T, D, N) {
      /* il nastro le volteggia attorno (b3), cade a terra quando cade lei */
      var nastro = N('nastro')[0].tl;
      tl.to(nastro, { rotation: 540, x: '6vw', duration: D('b3', 0.35), ease: 'sine.inOut' }, T('b3', 0.12));
      tl.to(nastro, { y: '30vh', rotation: 620, duration: D('b3', 0.12), ease: 'power2.in' }, T('b3', 0.5));
    },

    /* ── S04 — La percussionista ──────────────────────── */
    s04: function (sc, tl, T, D, N) {
      /* la banda attraversa piano la scena verso destra */
      tl.to(N('banda')[0].tl, { x: '14vw', ease: 'none', duration: D('b1', 0.7) + D('b2', 1) }, T('b1', 0.3));
      /* i passanti si girano a guardarla */
      tl.to(N('passanti').map(function (n) { return n.c; }), { scaleX: -1, duration: D('b2', 0.1) }, T('b2', 0.45));
    },

    /* ── S06 — Le superiori ───────────────────────────── */
    s06: function (sc, tl, T, D, N) {
      /* i bulli la indicano (piccola rotazione in avanti, verso il centro) */
      tl.to(N('bulli').map(function (n) { return n.c; }),
        { rotation: function (i) { return i ? -8 : 8; }, transformOrigin: '50% 100%', duration: D('b2', 0.1) }, T('b2', 0.3));
    },

    /* ── S07 — La casa momentanea ─────────────────────── */
    s07: function (sc, tl, T, D, N) {
      /* la casa dietro di lei: da 85vh a 18vh seguendo lo scroll della b1 (ancorata a terra) */
      var casa = N('casa-piccola')[0].tl;
      gsap.set(casa, { transformOrigin: '50% 100%' });
      tl.fromTo(casa, { scale: 1 }, { scale: 18 / 85, ease: 'none', duration: D('b1', 0.75), immediateRender: false }, T('b1', 0.2));
    },

    /* ── S08 — La cameriera ───────────────────────────── */
    s08: function (sc, tl, T, D, N) {
      /* monete: cadono una alla volta nel salvadanaio */
      N('monete').forEach(function (n, i) {
        var t = T('b2', 0.1 + i * 0.13);
        fromToIn(tl, n.tl, { autoAlpha: 1, y: '-100vh' }, { y: '0vh', ease: 'power2.in', duration: D('b2', 0.08), immediateRender: false }, t);
        tl.to(n.tl, { autoAlpha: 0, duration: D('b2', 0.02) }, t + D('b2', 0.08));
      });
    },

    /* ── S10 — Figma e il Parlamento Europeo ──────────── */
    s10: function (sc, tl, T, D, N) {
      /* b2: il telefono vola in alto a destra fino al Parlamento e sparisce */
      var fly = [N('telefono-app')[0].tl].concat(N('ui').map(function (n) { return n.tl; }));
      tl.to(fly, { x: '10vw', y: '-8vh', scale: 0.15, rotation: 25, autoAlpha: 0, duration: D('b2', 0.4), ease: 'power2.in' }, T('b2', 0.1));
      /* b3: tre lampi bianchi seguendo lo scroll */
      var fl = N('flash').map(function (n) { return n.tl; });
      for (var j = 0; j < 3; j++) {
        tl.fromTo(fl, { autoAlpha: 0 }, { autoAlpha: 1, duration: D('b3', 0.03), immediateRender: false }, T('b3', 0.2 + 0.22 * j));
        tl.to(fl, { autoAlpha: 0, duration: D('b3', 0.08) }, T('b3', 0.23 + 0.22 * j));
      }
    },

    /* ── S12 — La mediatrice culturale ────────────────── */
    s12: function (sc, tl, T, D, N) {
      /* dall'ampolla cade una goccia corallo fino a terra */
      var g = N('goccia')[0].tl;
      fromToIn(tl, g, { autoAlpha: 1, y: '0vh' }, { y: '51vh', ease: 'power2.in', duration: D('b2', 0.3), immediateRender: false }, T('b2', 0.3));
      tl.to(g, { scaleX: 2.2, scaleY: 0.35, transformOrigin: '50% 100%', duration: D('b2', 0.05) }, T('b2', 0.6));
    },

    /* ── S13 — Da dicembre a maggio (il bugiardino) ──── */
    s13: function (sc, tl, T, D, N) {
      /* b11–b12: con le avversità Caterina (in felpa) diventa grigia seguendo lo scroll */
      sc.cateTl.fromTo(cateFig, { filter: 'grayscale(0)' }, { filter: 'grayscale(1)', ease: 'none',
        duration: T('b13') - T('b11'), immediateRender: false }, T('b11'));

      /* b4: la pila di libri cresce a scatti seguendo lo scroll (6 → 16vh) */
      var libri = N('libri')[0].tl;
      gsap.set(libri, { transformOrigin: '50% 100%' });
      tl.set(libri, { autoAlpha: 1 }, T('b4', 0.05));
      tl.fromTo(libri, { scaleY: 6 / 16 }, { scaleY: 1, ease: 'steps(5)', duration: D('b4', 0.8), immediateRender: false }, T('b4', 0.05));

      /* b6: il badge del telefono conta da 1 a 100 seguendo lo scroll */
      var badge = el('span', 'item__label is-1line', N('badge')[0].c), cnt = { v: 1 };
      badge.textContent = '1';
      tl.fromTo(cnt, { v: 1 }, { v: 100, ease: 'power1.in', duration: D('b6', 0.8), immediateRender: false,
        onUpdate: function () { badge.textContent = Math.round(cnt.v); } }, T('b6', 0.15));

      /* b12: da ciascuna nuvoletta cade un problema su Caterina */
      N('problema').forEach(function (n, i) {
        var s = i ? -1 : 1;
        tl.set(n.tl, { autoAlpha: 1 }, T('b12', 0.45 + i * 0.1));
        tl.fromTo(n.tl, { x: '0vw', y: '0vh' }, { x: s * 28 + 'vw', y: '-16vh', ease: 'power1.out',
          duration: D('b12', 0.2), immediateRender: false }, T('b12', 0.45 + i * 0.1));
        tl.to(n.tl, { y: '-2vh', ease: 'power2.in', duration: D('b12', 0.15) }, T('b12', 0.65 + i * 0.1));
      });

      /* b13: tutto si moltiplica (non gli sticker: i loghi restano come sono) — cloni sfalsati, sempre più fitti, fino a coprire la pagina, poi il nero */
      var src = [].slice.call(sc.layer.children).filter(function (r) {
        return r.classList.contains('item') && !/is-(nero|approfondimento|sticker)/.test(r.className) && !r.querySelector('.confetto');
      });
      var clones = [];
      for (var i = 0; i < 80 && src.length; i++) {
        var cl = src[i % src.length].cloneNode(true);
        cl.removeAttribute('data-item');
        cl.setAttribute('aria-hidden', 'true');
        cl.inert = true;
        cl.querySelectorAll('.item__x, .item__tl, .item__rt').forEach(function (e) { e.removeAttribute('style'); });
        cl.querySelectorAll('.scene-img').forEach(function (img) { wireImg(img, img.nextElementSibling); });
        cl.style.left = gsap.utils.random(-6, 94) + '%';
        cl.style.bottom = gsap.utils.random(-4, 92) + '%';
        cl.style.top = 'auto';
        cl.style.zIndex = 60 + (i % 15);
        sc.layer.appendChild(cl);
        clones.push(cl);
      }
      /* compaiono sul contenitore interno (S13), spariscono su quello esterno (cambio scena di S14):
         mai due timeline sulla stessa proprietà dello stesso elemento */
      var inner = clones.map(function (c) { return c.querySelector('.item__tl'); });
      gsap.set(clones, { rotation: rnd(-25, 25), scale: rnd(0.8, 1.6) });
      gsap.set(inner, { autoAlpha: 0 });
      tl.to(inner, { autoAlpha: 1, duration: 0.001, stagger: { amount: D('b13', 0.65), ease: 'power2.in' } }, T('b13', 0.05));
      clones.forEach(function (c) { sc.exitTargets.push({ el: c, fx: 'via' }); });
      /* il nero resta al cambio scena: lo toglie S14 quando il suo sfondo nero è pieno */
    },

    /* ── S14 — L'Olanda ───────────────────────────────── */
    s14: function (sc, tl, T, D, N) {
      var s13 = SCENES.filter(function (s) { return s.id === 's13'; })[0];
      if (s13 && s13.nodes.nero) tl.to(s13.nodes.nero[0].x, { autoAlpha: 0, duration: 0.001 }, T('c', 0.65));

      /* la scena parte desaturata e torna a colori seguendo lo scroll (b3) */
      tl.fromTo(sc.layer, { filter: 'saturate(0.15)' }, { filter: 'saturate(0.15)', duration: 0.001, immediateRender: false }, T('c', 0.1));
      tl.to(sc.layer, { filter: 'saturate(1)', ease: 'none', duration: D('b3', 0.9) }, T('b3'));

      /* b1: Maya si avvicina dal buio (6 → 60vh) trotterellando, poi primo piano e "leccata" allo schermo */
      var mf = N('maya-fronte')[0].tl, mb = N('maya-bacio')[0];
      tl.set(mf, { autoAlpha: 1 }, T('b1'));
      tl.fromTo(mf, { scale: 0.1 }, { scale: 1, ease: 'none', duration: D('b1', 0.8), immediateRender: false }, T('b1'));
      tl.to(mf, { autoAlpha: 0, duration: D('b1', 0.04) }, T('b1', 0.84));
      tl.set(mb.tl, { autoAlpha: 1 }, T('b1', 0.84));
      tl.to(mb.c, { keyframes: { scale: [1, 1.08, 1] }, duration: D('b1', 0.1), ease: 'power1.inOut' }, T('b1', 0.86));

      /* b2–b3: Caterina (in felpa, grigia da S13) torna lentamente a colori */
      sc.cateTl.fromTo(cateFig, { filter: 'grayscale(1)' }, { filter: 'grayscale(0)', ease: 'none',
        duration: T('b4') - T('b2'), immediateRender: false }, T('b2'));

      /* b4: di spalle corrono via uno alla volta (Maya, Ale, Caterina, sfalsati di 1/4 di battuta): salgono verso
         l'orizzonte (~40% dello schermo), si rimpiccioliscono a 1/5 con rimbalzo di corsa e spariscono */
      ['maya-spalle', 'ale-spalle', 'cate-spalle'].forEach(function (id, i) {
        var n = N(id)[0], t0 = T('b4', 0.1 + i * 0.25), d = D('b4', 0.55 - i * 0.12);
        var h = { 'maya-spalle': 18, 'ale-spalle': 55, 'cate-spalle': 50 }[id];
        gsap.set(n.tl, { transformOrigin: '50% 100%' });
        tl.set(n.tl, { autoAlpha: 1 }, t0);
        tl.fromTo(n.tl, { y: '0vh', scale: 1 }, { y: -(40 - 12 - h / 10) + 'vh', scale: 0.2, ease: 'power1.in', duration: d, immediateRender: false }, t0);
        tl.to(n.c, { keyframes: { y: ['0vh', '-2vh', '0vh', '-1.6vh', '0vh', '-1.2vh', '0vh', '-0.8vh', '0vh'] }, ease: 'none', duration: d }, t0);
        tl.to(n.tl, { autoAlpha: 0, duration: D('b4', 0.05) }, t0 + d);
      });
    },

    /* ── S15 — Cosa ama Caterina ──────────────────────── */
    s15: function (sc, tl, T, D, N) {
      /* b6: la barra di avanzamento brilla una volta ("questa" è il sito) */
      var glow = document.querySelector('.progress__glow');
      gsap.set(glow, { autoAlpha: 0 });
      tl.fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: D('b6', 0.1), immediateRender: false }, T('b6', 0.4));
      tl.to(glow, { autoAlpha: 0, duration: D('b6', 0.2) }, T('b6', 0.55));
    },

    /* ── S16 — Il saggio ──────────────────────────────── */
    s16: function (sc, tl, T, D, N) {
      var L = sc.layer, tel = N('telefono-grande')[0], playN = N('play')[0];
      var scritte = [], k = 1;
      while (sc.nodes['scritta-' + k]) scritte.push(N('scritta-' + (k++))[0]);
      var logoN = N('logo')[0], ricN = N('ricomincia')[0];
      var fin = scritte.concat([logoN, ricN]);
      var nero = N('nero')[0];

      /* b2: il telefono cresce dalla sua mano fino a coprire la pagina (con riduci movimento è già grande) */
      tl.set(tel.tl, { autoAlpha: 1 }, T('b2'));
      tl.fromTo(tel.tl, { scale: 8 / 110, x: '-4vw', y: '10vh' }, { scale: 1, x: '0vw', y: '0vh', ease: 'power1.in',
        duration: reducedMotion ? 0.001 : D('b2', 0.8), immediateRender: false }, T('b2'));

      /* senza video (nessun clic, riduci movimento, file mancante): le scritte una alla volta seguendo lo scroll
         della b3 (0.04 → 0.53), poi nero, logo e Ricomincia */
      var passo = 0.49 / scritte.length;
      scritte.forEach(function (n, i) {
        var t = 0.04 + i * passo;
        tl.fromTo(n.tl, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, ease: 'back.out(1.6)',
          duration: D('b3', passo * 0.3), immediateRender: false }, T('b3', t));
        tl.to(n.tl, { autoAlpha: 0, duration: D('b3', passo * 0.15) }, T('b3', t + passo * 0.85));
      });
      /* dalla 5ª scritta (buona giornata…) il nero copre il video e resta solo il logo; Ricomincia dopo l'ultima */
      var FINALI = 4, tNero = 0.04 + FINALI * passo;
      [[logoN, tNero], [ricN, 0.6]].forEach(function (p) {
        tl.fromTo(p[0].tl, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, ease: 'back.out(1.6)',
          duration: D('b3', 0.06), immediateRender: false }, T('b3', p[1]));
      });
      /* …e il nero copre il telefono: restano solo nero, logo e Ricomincia */
      tl.fromTo(nero.tl, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: D('b3', 0.04), immediateRender: false }, T('b3', tNero));

      /* video nello schermo del telefono: parte solo al clic su play, con audio */
      tel.root.removeAttribute('aria-hidden');          /* contiene il video, raggiungibile da tastiera */
      var video = el('video', 's16-video', tel.c);
      video.preload = 'none';
      video.playsInline = true;
      video.tabIndex = 0;
      video.poster = 'assets/img/s16/s16-video-poster.jpg';
      video.src = 'assets/musica/video-3.mp4';
      video.dataset.uiLabel = 'video';
      var mode = false;
      function show(n, on) { gsap.set(n.rt, { autoAlpha: on ? 1 : 0 }); }
      function enter() {
        mode = true; videoPlaying = true;
        L.classList.add('video-on');
        fin.concat(nero).forEach(function (n) { show(n, false); });
        show(playN, false);
      }
      function exit() {
        mode = false; videoPlaying = false;
        video.pause();
        L.classList.remove('video-on');
        fin.concat(nero).forEach(function (n) { show(n, true); });
        show(playN, true);
      }
      function toggle() { if (video.paused) video.play().catch(exit); else video.pause(); }
      if (reducedMotion) playN.root.hidden = true;
      playN.c.addEventListener('click', function () {
        enter();
        video.play().then(function () { video.focus({ preventScroll: true }); }).catch(exit);   /* file mancante: resta lo scroll */
      });
      video.addEventListener('click', toggle);
      video.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mode) { exit(); video.currentTime = 0; playN.c.focus({ preventScroll: true }); }
      });
      video.addEventListener('timeupdate', function () {
        if (!mode || !video.duration) return;
        /* una scritta alla volta, distribuite dal 5% al 95% del video */
        var f = (video.currentTime / video.duration - 0.05) / 0.9, cur = Math.floor(f * scritte.length);
        scritte.forEach(function (n, i) { show(n, i === cur); });
        var fine = cur >= FINALI;                     /* ultime frasi: nero e solo il logo (il video continua a suonare sotto) */
        show(nero, fine); show(logoN, fine);
      });
      video.addEventListener('ended', function () {
        scritte.forEach(function (n) { show(n, false); });
        show(logoN, true); show(ricN, true); show(nero, true);
        ricN.c.focus({ preventScroll: true });
      });
      /* parte da solo quando si arriva alla b3 scorrendo (una volta per visita; con riduci movimento resta il play).
         Se il browser blocca l'audio, riprova senza audio. */
      var auto = false;
      function start() {
        if (mode || auto || reducedMotion) return;
        auto = true;
        enter();
        video.play().catch(function () { video.muted = true; return video.play(); }).catch(exit);
      }
      videoCtl = { exit: function () { exit(); auto = false; }, start: start, active: function () { return mode; } };

      /* Ricomincia: torna all'inizio in circa 3 secondi */
      ricN.c.addEventListener('click', function () {
        if (mode) exit();
        scrollToY(0, 3);
        document.getElementById('top').focus({ preventScroll: true });
      });
    },
  };

  /* ══════════════════════════════════════════════════════════
     UI — interruttori, sottotitoli, voce
     ══════════════════════════════════════════════════════════ */

  var subtitlesOn = localStorage.getItem('pref-subtitles') !== '0';
  var voiceOn     = localStorage.getItem('pref-voice') === '1';
  var calmOn      = localStorage.getItem('pref-calm') === '1';   /* Calma: ferma i movimenti continui */
  var musicOn     = localStorage.getItem('pref-music') !== '0';  /* Musica: predefinito acceso */
  var audioUnlocked = false;
  var currentAudio  = null;

  var btnSub   = document.getElementById('btn-subtitles');
  var btnVoice = document.getElementById('btn-voice');
  var btnCalm  = document.getElementById('btn-calm');
  var btnMusic = document.getElementById('btn-music');
  var subBar   = document.getElementById('subtitle-bar');
  var subText  = document.getElementById('subtitle-text');
  var audioNotice = document.getElementById('audio-unlock');

  applySubtitlePref();
  applyVoicePref();
  btnCalm.setAttribute('aria-checked', calmOn);
  document.documentElement.classList.toggle('is-calm', calmOn);
  /* con "riduci movimento" di sistema il sito è già tutto fermo: l'interruttore non servirebbe */
  btnCalm.hidden = reducedMotion;

  btnCalm.addEventListener('click', function () {
    calmOn = !calmOn;
    localStorage.setItem('pref-calm', calmOn ? '1' : '0');
    btnCalm.setAttribute('aria-checked', calmOn);
    document.documentElement.classList.toggle('is-calm', calmOn);
    if (curScene) updateRealtime(curScene);
  });

  btnSub.addEventListener('click', function () {
    subtitlesOn = !subtitlesOn;
    localStorage.setItem('pref-subtitles', subtitlesOn ? '1' : '0');
    applySubtitlePref();
  });

  btnMusic.addEventListener('click', function () {
    musicOn = !musicOn;
    localStorage.setItem('pref-music', musicOn ? '1' : '0');
    if (!musicOn) songs.forEach(function (t) { t.a.pause(); t.a.volume = 0; });
    applyVoicePref();
  });

  btnVoice.addEventListener('click', function () {
    voiceOn = !voiceOn;
    localStorage.setItem('pref-voice', voiceOn ? '1' : '0');
    if (!voiceOn) stopBeat();
    applyVoicePref();
  });

  function applySubtitlePref() {
    btnSub.setAttribute('aria-checked', subtitlesOn);
    subBar.classList.toggle('hidden-pref', !subtitlesOn);
  }

  function applyVoicePref() {
    btnVoice.setAttribute('aria-checked', voiceOn);
    btnMusic.setAttribute('aria-checked', musicOn);
    audioNotice.classList.toggle('hidden', !((voiceOn || musicOn) && !audioUnlocked));
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    audioNotice.classList.add('hidden');
  }
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

  function playBeat(src) {
    if (!voiceOn || !audioUnlocked || !src || jumping) return;
    stopBeat();
    var a = new Audio(src);
    currentAudio = a;
    a.play().catch(function () { /* file mancante: silenzio */ });
  }

  function stopBeat() {
    if (!currentAudio) return;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  /* ══════════════════════════════════════════════════════════
     MUSICA — solo file di Caterina in assets/musica/ (dati music delle scene)
     Ogni brano ha la sua sezione: suona in loop finché ci sei (anche fermo), entrando o uscendo
     sfuma in ~1 s (così tra due sezioni è un crossfade), anche tornando indietro. Parte solo dopo il
     primo clic/tasto e con MUSICA acceso; sotto la voce scende a 0.2; scheda nascosta = pausa.
     Unica eccezione legata allo scroll: la rampa e il "taglio" di canzone-4 alla b13 di S13.
     File mancante = silenzio, nessun errore. Durante il video di S16 tace.
     ══════════════════════════════════════════════════════════ */
  var songs = [];
  SCENES.forEach(function (sc) {
    if (!sc.music) return;
    var t = { sc: sc, m: sc.music, a: new Audio(), broken: false };
    t.a.preload = 'none';
    t.a.loop = true;
    t.a.volume = 0;
    t.a.addEventListener('error', function () { t.broken = true; });
    t.a.src = 'assets/musica/' + sc.music.file + '.mp3';
    songs.push(t);
  });
  function sceneById(id) { return SCENES.filter(function (s) { return s.id === id; })[0]; }
  function scrollAt(sc, b, f) {
    var st = sc.st;
    return st.start + (sc.labels[b] + (f || 0) * sc.lens[b]) / sc.total * (st.end - st.start);
  }
  function trackRange(t) {
    var m = t.m;
    var end = m.taglio ? scrollAt(t.sc, m.taglio.b, m.taglio.at)
      : m.fino ? scrollAt(sceneById(m.fino.s), m.fino.b, m.fino.at || 0) : t.sc.st.end;
    return [scrollAt(t.sc, m.da, 0), end];
  }
  function trackMix(t, y) {                       /* volume e velocità nel punto y */
    var m = t.m, vol = m.vol, rate = 1, st = t.sc.st;
    if (m.vols && y >= st.start && y < st.end) {
      var u = (y - st.start) / (st.end - st.start) * t.sc.total;
      t.sc.beats.forEach(function (b) { if (u >= t.sc.labels[b.id] && m.vols[b.id] != null) vol = m.vols[b.id]; });
    }
    if (m.ramp) {
      var r0 = scrollAt(t.sc, m.ramp.b, m.ramp.at || 0), r1 = scrollAt(t.sc, m.ramp.b, m.ramp.fino);
      var k = gsap.utils.clamp(0, 1, (y - r0) / (r1 - r0 || 1));
      vol += (m.ramp.vol - vol) * k;
      rate += ((m.ramp.rate || 1) - 1) * k;
    }
    return { vol: vol, rate: rate };
  }
  document.addEventListener('visibilitychange', function () {   /* scheda nascosta: pausa; al ritorno riprende dal ticker */
    if (document.hidden) songs.forEach(function (t) { t.a.pause(); });
  });
  gsap.ticker.add(function (time, dt) {
    if (!songs.length || document.hidden) return;
    var y = window.scrollY;
    var ducking = currentAudio && !currentAudio.paused;
    songs.forEach(function (t) {
      if (!t.sc.st) return;
      var r = trackRange(t), inside = y >= r[0] && y < r[1];
      if (t.m.taglio && y >= r[1]) { if (!t.a.paused) t.a.pause(); t.a.volume = 0; return; }   /* il nero: silenzio */
      var target = 0;
      if (inside && musicOn && audioUnlocked && !t.broken && !videoPlaying) {
        var mix = trackMix(t, y);
        target = ducking ? Math.min(mix.vol, 0.2) : mix.vol;
        t.a.playbackRate = mix.rate;
        if (t.a.paused && !document.hidden) t.a.play().catch(function () { t.broken = true; });
      }
      if (t.a.paused) return;
      var step = dt / 1000 * 0.3;                  /* ~1 s per sfumare (da 0.3 a 0) */
      var v = t.a.volume + gsap.utils.clamp(-step, step, target - t.a.volume);
      t.a.volume = gsap.utils.clamp(0, 1, v);
      if (target === 0 && t.a.volume <= 0.001) {
        t.a.pause();
        if (y < r[0]) t.a.currentTime = 0;         /* tornati prima della sua scena: riparte da capo */
      }
    });
  });

  function showSubtitle(text) {
    if (text) subText.textContent = text;
    subBar.classList.toggle('visible', !!text);
  }

  /* ══════════════════════════════════════════════════════════
     BATTUTE — seguono tl.progress() (la timeline animata)
     ══════════════════════════════════════════════════════════ */

  var lastKey = null, curScene = null;

  function beatAt(sc, p) {
    var idx = 0;
    sc.thresholds.forEach(function (th, i) { if (p >= th - 1e-6) idx = i; });
    return idx;
  }

  function onSceneUpdate(sc) {
    if (!sc.thresholds) return;
    var p = sc.tl.progress();
    var dir = p > sc.lastP ? 1 : p < sc.lastP ? -1 : 0;
    sc.lastP = p;
    sc.beatIdx = beatAt(sc, p);
    refreshCurrent(dir);
    /* una scena vicina che sta ancora recuperando lo scrub (salti, barra) non deve scrivere su
       Caterina dopo la scena corrente: arriva subito al suo punto d'arrivo (vedi ticker sotto) */
    if (curScene) driveCate(curScene);
  }

  /* Caterina è una sola per tutto il sito: la muove solo la scena corrente. Quando una scena prende
     la guida riparte dallo stato di Caterina a inizio scena (cateStart) e avanza fino al punto giusto,
     così salti, barra e scroll all'indietro danno sempre lo stesso risultato. */
  var cateDriver = null;
  function driveCate(sc) {
    if (!sc.cateTl) return;
    if (cateDriver !== sc) {
      cateDriver = sc;
      sc.cateTl.time(0, true);
      var s = sc.cateStart;
      gsap.set(cate, Object.assign(cateCss(s), { autoAlpha: s.alpha }));
      gsap.set(cateHow, { x: 0, y: 0, rotation: s.rot, scale: 1, scaleX: 1 });
      gsap.set(cateFig, { filter: 'grayscale(0)', scale: 1 });
      Object.keys(cateVars).forEach(function (k) { gsap.set(cateVars[k], { autoAlpha: k === s.img ? 1 : 0 }); });
    }
    sc.cateTl.time(sc.tl.time(), true);
  }

  /* scena corrente = l'ultima la cui timeline è partita */
  function refreshCurrent(dir) {
    var cur = SCENES[0];
    SCENES.forEach(function (sc) { if (sc.tl && sc.tl.progress() > 0) cur = sc; });
    var beat = cur.beats[cur.beatIdx];
    var key = cur.id + '-' + beat.id;
    if (key === lastKey) return;
    lastKey = key;

    subBar.classList.toggle('is-bugiardino', !!cur.bugiardino);   /* S13: foglietto illustrativo */
    var inB3 = cur.id === 's16' && beat.id === 'b3';
    if (videoCtl && !inB3) videoCtl.exit();                  /* uscendo dalla b3 il video si ferma */
    else if (videoCtl && inB3 && !jumping) videoCtl.start(); /* arrivando alla b3 parte da solo */
    showSubtitle(tr(key, beat.text));
    if (dir === 1 && beat.text) playBeat(lang === 'pt' ? 'assets/vo/pt-br/' + key + '.mp3' : (beat.audio || 'assets/vo/' + key + '.mp3'));

    if (cur !== curScene) {
      jars.forEach(function (j) { j.inert = cur.id === 's00'; });   /* coperti dal titolo: niente focus nascosto */
      if (curScene && curScene.mark) curScene.mark.removeAttribute('aria-current');
      if (cur.mark) cur.mark.setAttribute('aria-current', 'step');
      curScene = cur;
    }
    if (!reducedMotion) updateRealtime(cur);
  }

  function updateRealtime(cur) {
    SCENES.forEach(function (sc) {
      sc.rts.forEach(function (r) {
        var on = !calmOn && sc === cur && cur.beatIdx >= r.from && cur.beatIdx < r.until;
        if (on === !!r.on) return;
        r.on = on;
        if (on) r.tw.restart(); else r.tw.pause(0);
      });
    });
    var want = calmOn ? null : cateRtFor(cur);
    Object.keys(cateRtTw).forEach(function (fx) {
      var tw = cateRtTw[fx], on = fx === want;
      if (on && !tw.isActive()) tw.restart();
      else if (!on && tw.isActive()) tw.pause(0);
    });
  }

  /* ══════════════════════════════════════════════════════════
     COSTRUZIONE
     ══════════════════════════════════════════════════════════ */

  SCENES.forEach(buildScene);
  renderAllOrbits();

  if (!reducedMotion) {
    gsap.ticker.add(function (time, dt) {
      if (calmOn || !curScene || !curScene.orbitList.length) return;
      curScene.orbitList.forEach(function (o) {
        o.angle += dt / 1000 * 360 / o.period * orbitSpeed(o, curScene);
        renderOrbit(o);
      });
    });
  }

  /* ── Barra di avanzamento ──────────────────────────────── */
  var progress = document.getElementById('progress');
  var fill = progress.querySelector('.progress__fill');
  var marks = progress.querySelector('.progress__marks');

  gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' });
  var setFill = gsap.quickSetter(fill, 'scaleX');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { setFill(s.progress); } });

  /* un segno per scena: salta all'inizio della scena (dopo il cambio scena) */
  function jumpTarget(sc) {
    var f = sc.beats[0].id === 'c' ? sc.labels[sc.beats[1].id] / sc.total : 0;
    return Math.round(sc.st.start + f * (sc.st.end - sc.st.start)) + 2;
  }
  SCENES.forEach(function (sc, k) {
    if (sc.noMark) return;
    var b = el('button', 'progress__mark', marks);
    b.type = 'button';
    b.dataset.n = k + 1;                          /* scene numerate da 1 (S00 tolto) */
    b.addEventListener('click', function () { scrollToY(jumpTarget(sc), 2); });
    /* post-it: in hover/focus scende e mostra il titolo breve */
    i18nNodes.push({ el: el('span', 'progress__tab', b), key: sc.id + '-breve', it: sc.short || sc.title });
    sc.mark = b;
  });
  function positionMarks() {
    var max = ScrollTrigger.maxScroll(window) || 1;
    SCENES.forEach(function (sc) {
      if (!sc.mark) return;
      var pct = jumpTarget(sc) / max * 100;
      sc.mark.style.left = pct + '%';
      /* il post-it aperto si allunga verso destra; se non ci sta (bordo destro) verso sinistra */
      sc.mark.classList.toggle('is-right', window.innerWidth * pct / 100 + 150 > window.innerWidth);
    });
  }

  /* Etichette in immagine (assets/img/ui): se ci sono sostituiscono gli stili CSS, altrimenti restano questi */
  ['ui-linguetta', 'ui-linguetta-attiva', 'ui-etichetta-corta', 'ui-etichetta-lunga', 'ui-etichetta-indizi'].forEach(function (n) {
    var im = new Image();
    im.onload = function () { document.documentElement.classList.add('has-' + n); };
    im.src = 'assets/img/ui/' + n + '.png';
  });

  /* Telefono in verticale: cartellino «Girami» (si può chiudere: l'orientamento non è obbligatorio, WCAG 1.3.4) */
  document.getElementById('girami-chiudi').addEventListener('click', function () {
    document.getElementById('girami').classList.add('is-chiuso');
  });

  /* Esc richiude i post-it aperti (WCAG 1.4.13); si riaprono al primo movimento del mouse o del focus */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.documentElement.classList.add('tips-off');
  });
  ['mousemove', 'focusin'].forEach(function (t) {
    document.addEventListener(t, function () { document.documentElement.classList.remove('tips-off'); });
  });

  /* ── Approfondimenti ───────────────────────────────────── */
  var deep = document.getElementById('deep');
  var deepOpener = null;
  /* Foglio di carta: titolo, segnaposto dei contenuti (chiave ui) e didascalia facoltativa */
  function openSheet(opener, title, mediaKey, caption) {
    deepOpener = opener;
    document.getElementById('deep-title').textContent = title;
    /* DEMO: i contenuti non ci sono ancora → ogni foglio dice «Work in progress» (mediaKey e caption restano per dopo) */
    /* GIF del pinguino; con Calma o riduci movimento un fotogramma fermo (una GIF non si può mettere in pausa) */
    var wip = deep.querySelector('.deep__wip');
    wip.alt = ui('wip');
    wip.src = 'assets/img/ui/work-in-progress' + (reducedMotion || calmOn ? '-fermo.png' : '.gif');
    var cap = document.getElementById('deep-caption');
    cap.hidden = true;
    cap.textContent = '';
    if (lenis) lenis.stop();
    document.documentElement.classList.add('is-deep');
    deep.showModal();
  }
  SCENES.forEach(function (sc) {
    var n = sc.nodes.approfondimento && sc.nodes.approfondimento[0];
    if (!n) return;
    n.c.setAttribute('aria-haspopup', 'dialog');
    el('i', 'pin', n.c);
    n.c.addEventListener('click', function () { openSheet(n.c, titleOf(sc), 'media'); });
  });

  /* ── Barattoli dei fratelli (S01): foglio con foto e didascalia ── */
  jars.forEach(function (b) {
    var k = 's01-fratello-' + b.dataset.fratello;
    b.addEventListener('click', function () {
      openSheet(b, tr(k + '-nome', b.dataset.itLabel), 'foto', tr(k + '-didascalia', b.dataset.itCaption));
    });
  });
  document.getElementById('deep-close').addEventListener('click', function () { deep.close(); });
  deep.addEventListener('close', function () {   /* chiusura con X o Esc */
    document.documentElement.classList.remove('is-deep');
    if (lenis) lenis.start();
    if (deepOpener) deepOpener.focus({ preventScroll: true });
  });

  /* ── Lingua ────────────────────────────────────────────── */
  document.querySelectorAll('[data-i18n]').forEach(function (e) {
    i18nNodes.push({ el: e, key: e.dataset.i18n, it: e.textContent });
  });

  function applyLang() {
    document.documentElement.lang = I18N[lang].htmlLang;
    document.querySelectorAll('.lang__btn').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang); });
    document.querySelectorAll('[data-ui]').forEach(function (e) { e.textContent = ui(e.dataset.ui); });
    document.querySelectorAll('[data-ui-label]').forEach(function (e) { e.setAttribute('aria-label', ui(e.dataset.uiLabel)); });
    document.querySelectorAll('[data-i18n-label]').forEach(function (e) { e.setAttribute('aria-label', tr(e.dataset.i18nLabel, e.dataset.itLabel)); });
    i18nNodes.forEach(paintText);
    document.querySelectorAll('.progress__tab').forEach(function (t) { t.classList.toggle('is-lungo', t.textContent.length > 14); });
    SCENES.forEach(function (sc) {
      if (sc.mark) {
        sc.mark.title = titleOf(sc);
        sc.mark.setAttribute('aria-label', ui('vaiScena', { n: sc.mark.dataset.n, t: titleOf(sc) }));
      }
      var n = sc.nodes.approfondimento && sc.nodes.approfondimento[0];
      if (n) n.c.setAttribute('aria-label', ui('approfondimento', { t: titleOf(sc) }));
    });
    lastKey = null;               /* ridisegna subito il sottotitolo della battuta corrente */
    refreshCurrent(0);
  }

  document.querySelectorAll('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      localStorage.setItem('pref-lang', lang);
      stopBeat();
      applyLang();
    });
  });

  /* ── Avvio ─────────────────────────────────────────────── */
  ScrollTrigger.addEventListener('refresh', function () { positionMarks(); renderAllOrbits(); });
  applyLang();
  if (curScene) driveCate(curScene);
  if (document.fonts) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener('load', function () {
    ScrollTrigger.clearScrollMemory('manual');
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
  });

})();
