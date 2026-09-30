/* ==========================================================
   sposta.js — strumento di impaginazione, SOLO su localhost.
   Cmd+K (Ctrl+K)  accende/spegne la modalità «sposta»
   clic + trascina un elemento per spostarlo (Maiusc+clic: selezione multipla)
   frecce          spostano la selezione di 0.5% (con Maiusc 2%)
   Cmd+G (Ctrl+G)  accende/spegne «ridimensiona»: freccia su ingrandisce, giù rimpicciolisce (5%, Maiusc 20%)
   Cmd+R (Ctrl+R)  copia negli appunti le coordinate degli elementi spostati
   T (o Cmd+T)     copia le coordinate di TUTTI gli elementi visibili della scena
                   (Chrome e Safari tengono Cmd+T per la nuova scheda: lì usa T da solo)
   Esc             annulla la selezione
   Le coordinate sono nelle unità di scenes.js: x = centro in % della larghezza,
   y = centro in % dell'altezza dal fondo (per Caterina: x e piedi dal fondo).
   Non modifica i file: si ricarica la pagina e tutto torna com'era.
   ========================================================== */
(function () {
  'use strict';
  if (!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;

  var SEL = '.item, #character, .s01-parent, .s01-bacinella-area, .s01-scaffale-area, .s01-fumetto, .s01-vaso, .s01-ampolla';
  var on = false, grow = false, moved = new Map(), sizes = new Map(), selected = new Set(), drag = null;

  var css = document.createElement('style');
  css.textContent =
    'html.is-sposta ' + SEL.split(', ').join(', html.is-sposta ') + ' { pointer-events: auto !important; cursor: move; }' +
    'html.is-sposta .sposta-sel { outline: 2px dashed #ff5f6d !important; outline-offset: 2px; }' +
    'html.is-sposta .sposta-mosso { outline: 2px solid #7a35ee; outline-offset: 2px; }' +
    '.sposta-badge { position: fixed; left: 50%; top: 70px; translate: -50% 0; z-index: 99999; padding: 6px 12px;' +
    ' border: 2px solid #212529; border-radius: 8px; background: #fed728; font: 700 13px/1.3 system-ui, sans-serif;' +
    ' color: #212529; box-shadow: 0 2px 6px rgba(0,0,0,.3); pointer-events: none; white-space: pre; text-align: center; }';
  document.head.appendChild(css);
  var badge = document.createElement('div');
  badge.className = 'sposta-badge';
  badge.hidden = true;
  document.body.appendChild(badge);
  var toastT;
  function say(msg, keep) {
    badge.textContent = msg;
    badge.hidden = false;
    clearTimeout(toastT);
    if (!keep) toastT = setTimeout(function () { if (on) say(help(), true); else badge.hidden = true; }, 2200);
  }
  function help() {
    return grow ? 'RIDIMENSIONA · freccia su = più grande · giù = più piccolo (Maiusc ×4)\nCmd+G torna a spostare · Cmd+R copia · Cmd+K esci'
                : 'MODALITÀ SPOSTA · trascina · Maiusc+clic = più elementi · frecce = ritocco\nCmd+G ridimensiona · Cmd+R copia gli spostati · T copia tutta la scena · Cmd+K esci';
  }

  /* spostamento: #character usa left/bottom (la sua translate la anima il motore), il resto la proprietà translate */
  function offset(el) { return moved.get(el) || { dx: 0, dy: 0 }; }
  function apply(el, dx, dy) {
    moved.set(el, { dx: dx, dy: dy });
    if (el.id === 'character') { el.style.left = dx + 'px'; el.style.bottom = -dy + 'px'; }
    else el.style.translate = dx + 'px ' + dy + 'px';
    el.classList.add('sposta-mosso');
  }

  /* scala: proprietà CSS scale (la timeline usa transform); per Caterina sul disegno (.cate__fig), la sua scale è del motore */
  function target(el) { return el.id === 'character' ? el.querySelector('.cate__fig') : el; }
  function resize(el, k) {
    var f = Math.max(0.1, (sizes.get(el) || 1) * k);
    sizes.set(el, f);
    var t = target(el);
    t.style.transformOrigin = '50% 100%';
    t.style.scale = f;
    if (!moved.has(el)) moved.set(el, { dx: 0, dy: 0 });
    el.classList.add('sposta-mosso');
  }

  function name(el) {
    if (el.id === 'character') return 'Caterina';
    if (el.dataset.item) return el.dataset.item;
    return (el.className.baseVal || el.className).split(' ').filter(function (c) { return /^s\d\d-/.test(c); })[0] || el.className;
  }
  function currentScene() {
    var mark = document.querySelector('.progress__mark[aria-current]');
    return mark ? (mark.getAttribute('aria-label') || '') : '';
  }
  function coords(el) {
    var r = target(el).getBoundingClientRect(), W = innerWidth, H = innerHeight;
    var sc = sizes.get(el), extra = sc && sc !== 1 ? ' (scala ×' + Math.round(sc * 100) / 100 + ')' : '';
    var cx = (r.left + r.width / 2) / W * 100, cy = (H - (r.top + r.height / 2)) / H * 100, bottom = (H - r.bottom) / H * 100;
    var f = function (n) { return Math.round(n * 10) / 10; };
    if (el.id === 'character') return name(el) + ': x ' + f(cx) + '%, piedi al ' + f(bottom) + '% dal fondo, tela alta ' + f(r.height / H * 100) + 'vh' + extra;
    return name(el) + ': x ' + f(cx) + '%, y ' + f(cy) + '% (centro dal fondo), base al ' + f(bottom) + '%, alto ' + f(r.height / H * 100) + 'vh' + extra;
  }

  function copy() {
    var list = Array.from(moved.keys());
    if (!list.length) { say('Nessun elemento spostato'); return; }
    var txt = ['Coordinate (' + innerWidth + '×' + innerHeight + ') — ' + currentScene()].concat(list.map(coords)).join('\n');
    console.log(txt);
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
      .then(function () { say('Copiate ' + list.length + ' coordinate: incollale nella chat'); },
            function () { say('Non riesco a copiare: le trovi nella console'); });
  }

  function copyAll() {
    var list = Array.from(document.querySelectorAll(SEL)).filter(function (el) {
      if (el.id === 'character') return shown(el) && Array.from(el.querySelectorAll('.cate__var')).some(function (v) { return parseFloat(getComputedStyle(v).opacity) > 0.5; });
      if (!shown(el)) return false;
      return Array.from(el.querySelectorAll('img, .item__label, .item__c, span')).some(function (d) {
        if (d.matches('.item__x, .item__tl, .item__rt') || !shown(d)) return false;
        if (d.tagName === 'IMG' && !(d.complete && d.naturalWidth)) return false;
        var r = d.getBoundingClientRect();
        return r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
      });
    });
    if (!list.length) { say('Nessun elemento visibile'); return; }
    var txt = ['Scena intera (' + innerWidth + '×' + innerHeight + ') — ' + currentScene()].concat(list.map(function (el) {
      var im = el.id === 'character' ? null : el.querySelector('img');
      return coords(el) + (im && !(im.complete && im.naturalWidth) ? ' — senza immagine' : '');
    })).join('\n');
    console.log(txt);
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
      .then(function () { say('Copiate le coordinate di ' + list.length + ' elementi della scena'); },
            function () { say('Non riesco a copiare: le trovi nella console'); });
  }

  function toggle() {
    on = !on;
    grow = false;
    document.documentElement.classList.toggle('is-sposta', on);
    if (on) say(help(), true);
    else { selected.forEach(function (e) { e.classList.remove('sposta-sel'); }); selected.clear(); badge.hidden = true; }
  }

  document.addEventListener('keydown', function (e) {
    var mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); toggle(); return; }
    if (!on) return;
    if (mod && e.key.toLowerCase() === 'r') { e.preventDefault(); copy(); return; }
    if (e.key.toLowerCase() === 't' && !e.altKey) { e.preventDefault(); copyAll(); return; }
    if (mod && e.key.toLowerCase() === 'g') { e.preventDefault(); grow = !grow; say(help(), true); return; }
    if (grow && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      if (!selected.size) { say('Prima seleziona un elemento (clic)'); return; }
      var q = (e.shiftKey ? 0.2 : 0.05) * (e.key === 'ArrowUp' ? 1 : -1);
      selected.forEach(function (el) { resize(el, 1 + q); });
      say(coords(Array.from(selected).pop()));
      return;
    }
    if (e.key === 'Escape') { selected.forEach(function (x) { x.classList.remove('sposta-sel'); }); selected.clear(); return; }
    var step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (step && selected.size) {
      e.preventDefault();
      var k = (e.shiftKey ? 2 : 0.5) / 100;
      selected.forEach(function (el) { var o = offset(el); apply(el, o.dx + step[0] * k * innerWidth, o.dy + step[1] * k * innerHeight); });
    }
  }, true);

  /* visibile davvero: né lui né un antenato nascosto o trasparente (gli strati delle altre scene restano nel DOM) */
  function shown(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
    }
    var r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2 && r.width < innerWidth * 0.95;   /* niente fondali a tutto schermo */
  }
  function pick(x, y) {
    var hits = document.elementsFromPoint(x, y);
    for (var i = 0; i < hits.length; i++) {
      var h = hits[i], el = h.closest(SEL);
      /* conta solo il contenuto visibile: la scatola vuota di un elemento con il contenuto nascosto non vale */
      var vuoto = h.matches('.item, .item__x, .item__tl, .item__rt, #character, .cate__how, .cate__rt, .cate__fig');
      if (el && !vuoto && shown(h)) return el;
    }
    return null;
  }

  document.addEventListener('pointerdown', function (e) {
    if (!on) return;
    var el = pick(e.clientX, e.clientY);
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    if (!e.shiftKey && !selected.has(el)) { selected.forEach(function (x) { x.classList.remove('sposta-sel'); }); selected.clear(); }
    selected.add(el); el.classList.add('sposta-sel');
    drag = { x: e.clientX, y: e.clientY, start: Array.from(selected).map(function (s) { return [s, offset(s)]; }) };
  }, true);
  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.start.forEach(function (p) { apply(p[0], p[1].dx + dx, p[1].dy + dy); });
  }, true);
  document.addEventListener('pointerup', function () {
    if (!drag) return;
    var last = drag.start[drag.start.length - 1][0];
    drag = null;
    say(coords(last));
  }, true);
  /* in modalità sposta i clic non aprono fogli né bottoni */
  document.addEventListener('click', function (e) { if (on && e.target.closest(SEL)) { e.preventDefault(); e.stopPropagation(); } }, true);
})();
