# Buttercup — Implementation Plan (v3)

Sito scroll-driven: GSAP 3.12.5 + ScrollTrigger + Lenis 1.3.26, HTML/CSS/JS puro, GitHub Pages.
Coreografia completa delle scene in `bozza-scene.md`; stato dei lavori in `PROGRESSO.md`.

---

## File & cartelle

```
buttercup/
├── index.html         ← interfaccia, palco fisso, HTML a mano della scena 1, <dialog> approfondimento
├── css/style.css
├── js/
│   ├── scenes.js      ← SOLO dati: battute (testo, len, move), elementi, orbite, sfondi
│   ├── i18n.js        ← lingue: testi dell'interfaccia (it/pt) + traduzioni PT-BR approvate
│   └── main.js        ← motore: Lenis, ScrollTrigger, effetti, Caterina, orbite, UI, EXTRAS per scena
├── assets/
│   ├── fonts/Chunko-Bold.otf
│   ├── img/tex/tex-carta.jpg
│   ├── img/sNN/sNN-nome.png      ← immagini (mancanti = segnaposto col nome del file)
│   ├── media/sNN/                ← contenuti degli approfondimenti (futuro)
│   ├── vo/sNN-bN.mp3             ← voce italiana, un file per battuta con testo
│   └── vo/pt-br/sNN-bN.mp3       ← voce in portoghese brasiliano, stessi nomi
├── testi-pt-br.md     ← bozza di traduzione da rivedere (NON letta dal sito)
```

## Dipendenze (CDN, versioni fisse)

| Lib | URL |
|-----|-----|
| GSAP | `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js` |
| ScrollTrigger | `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js` |
| Lenis JS / CSS | `https://unpkg.com/lenis@1.3.26/dist/lenis.min.js` / `lenis.css` |
| Onest | Google Fonts |

---

## Architettura (v3)

### Perché non più "una section pinnata con dentro la scena"

Il cambio scena della bozza chiede che gli elementi della scena N-1 cadano **mentre** la scena N
entra, che lo sfondo sfumi dall'uno all'altro e che Caterina resti la stessa. Con sezioni pinnate
separate le due scene non sono mai sullo schermo insieme (tra un pin e l'altro scorre 100vh di
pagina). Quindi:

- **Palco fisso** `#stage` (`position: fixed`), con dentro:
  - `.bgs` — uno sfondo per scena (`.bg[data-bg=sNN]`), impilati; la scena N sfuma il suo sopra gli altri.
  - `.layer[data-layer=sNN]` — uno strato per scena. **Senza z-index né transform**, così gli z
    degli elementi di tutte le scene si confrontano direttamente con quello di Caterina.
  - `#character` — Caterina, unica per tutto il sito.
- **Tracce di scroll** `<main id="tracks">`: una `<section class="scene" data-scene="sNN">` per
  scena, alta quanto il suo scroll (somma dei `len` delle battute, in vh), con un `<h2>` e i testi
  delle battute visivamente nascosti (leggibili con screen reader). Nessun pin: le sezioni sono
  contigue, quindi le timeline si passano il testimone senza buchi. L'ultima è alta +100vh e usa
  `end: 'bottom bottom'`.
- Ogni scena ha **una timeline** con `scrollTrigger: { trigger: section, start: 'top top',
  end: 'bottom top', scrub: 0.8 }`. **1 unità di timeline = 100vh di scroll**; la timeline dura
  esattamente il totale (`tl.set({}, {}, total)`).

### Battute

- Label `c`, `b1`, … a tempi cumulativi; soglie = `tl.labels[id] / tl.duration()`.
- `onUpdate` **della timeline** → `onSceneUpdate` → battuta corrente. Scena corrente = l'ultima
  la cui `tl.progress() > 0`. Al cambio di battuta: sottotitolo, voce (solo in avanti, file
  `assets/vo/sNN-bN.mp3`, solo battute con testo), movimenti a tempo reale.
- Ritmo: entrate 0–20% della battuta; uscite senza `at` = 80–100% della battuta **prima**.

### Elementi (da `scenes.js`)

```
.item        posizione (left/bottom in % e vh), z  — solo CSS
  .item__x   cambio scena: lo anima la timeline della scena DOPO
    .item__tl  entrate/uscite/EXTRAS della sua scena
      .item__rt  tempo reale (oscilla, marcia…) oppure posizione in orbita
        .item__c   contenuto: img + segnaposto | cartoncino | scritta | <button>
```

Un livello per "proprietario": mai due timeline sulla stessa proprietà dello stesso elemento.
Entrate = `fromTo` con `immediateRender: false` (stato nascosto impostato con `gsap.set` al build);
uscite e animazioni su misura = `to` nella stessa timeline.

Effetti standard in `main.js`: `inFx`, `outFx`, `cambioFx`, `peel` (si stacca: clip-path
diagonale), `strappa`, `coriandoli`, `shakeStage`. Tutto ciò che non è standard sta in
`EXTRAS.sNN(sc, tl, T, D, N)`.

### Caterina

```
#character      --cx (x %), --cb (piedi, vh dal fondo), --cs (h/50), autoAlpha  ← solo timeline
  .cate__how    salti, corsa, caduta, capriola, gira, respiro…                   ← solo timeline
    .cate__rt   marcia, barcolla, trema                                           ← solo tempo reale
      .cate__fig    una variante sovrapposta per ogni immagine (sNN-cate-xxx)
      .cate__attach oggetti che tiene lei (attach: true), dimensioni compensate per la sua scala
```

Box alto 50vh, posizionato con le proprietà CSS individuali `translate`/`scale` calcolate dalle
variabili: nessun conflitto con i transform di GSAP e niente px da ricalcolare al resize.
Lo stato (x, y, h, img) è **simulato in ordine** lungo tutte le scene al build: ogni passo `move`
diventa un `fromTo` con valori espliciti, così avanti/indietro e salti tra scene restano coerenti.

### Orbite

Oggetti in orbita: `.item` al centro dell'orbita, `.item__rt` spostato ogni frame da un ticker
(solo per la scena corrente) con `quickSetter`. Velocità per battuta (`speed`), raggio `k`
animato dalla timeline (raccogli), `orbitFrom` per partire da un punto fisso e agganciarsi,
`depth` per passare davanti/dietro a Caterina.

### Tempo reale

Tween/timeline `repeat: -1` in pausa; `updateRealtime` li fa partire solo per la scena
corrente (e la finestra di battute giusta) e li rimette a zero con `pause(0)`.

### Interfaccia

- **Barra di avanzamento** fissa in alto (`--bar-h`, 14–20px), riempimento viola `scaleX` da un
  ScrollTrigger `0 → max`. Ogni scena (tranne S00) è un **post-it** (`<button>` 28px con dentro
  `span.progress__tab`) appeso alla barra come un segnalibro sul taglio di un libro. Chiuso: ruotato
  di −90°, senza scritta, sfuma dentro la barra (mask). In hover/focus (`@keyframes tab-sfoglia`):
  resta appeso un istante, ruota verso destra fino all'orizzontale mentre il titolo breve affiora
  (si legge dal basso verso l'alto finché è verticale), poi si allunga sul titolo intero. Il box è ancorato
  con l'estremità sinistra sulla linguetta; `--y0` lo tiene appeso da chiuso. Vicino al bordo destro
  (`.is-right`, calcolato in `positionMarks`) è ancorato a destra e si apre verso sinistra.
  Titolo breve: `short` in scenes.js (chiave i18n `sNN-breve`), deve stare dentro `title`, che resta
  nell'aria-label. Esc lo richiude; con riduci movimento niente animazione. Al clic salta con
  `lenis.scrollTo` all'inizio della scena dopo il cambio scena; durante i salti la voce tace e
  `aria-live` è spento. Scena corrente (`aria-current`) = post-it più lungo, giallo con bordo inchiostro.
- **Responsive (interfaccia)**: sotto 540px i controlli vanno su 2×2 (lingua + Sottotitoli / Voce +
  Calma); sotto 640px i post-it sono sottili e senza scritta, i controlli salgono e il bottone
  approfondimento sale al 17% per non coprire i sottotitoli. Il riquadro dei controlli parte sotto i
  post-it (`--bar-h` + 48px). Verificato a 1440×900, 1024×768, 768×1024, 844×390, 390×844.
- **Colore di "attivo" unico**: `--attivo` (giallo) sempre con bordo inchiostro — linguetta corrente,
  lingua scelta, interruttori accesi.
- **Controlli** in alto a destra, sotto la barra, in un bigliettino di carta: lingua `IT · PT`
  (due `<button aria-pressed>`, segmento compatto alto come le levette, area cliccabile 44px), poi tre interruttori `<button role="switch" aria-checked>` con
  etichetta Onest + levetta di carta: **Sottotitoli** (default acceso), **Voce** (default spento),
  **Calma** (default spento). Tutto in localStorage (`pref-lang`, `pref-subtitles`, `pref-voice`, `pref-calm`).
- **Calma**: ferma i movimenti continui (`updateRealtime` li tiene spenti, il ticker delle orbite
  non avanza, Caterina senza tempo reale); la storia continua con lo scroll. Nascosto con
  `prefers-reduced-motion`, dove il sito è già tutto fermo.
- **Lingue** (`js/i18n.js`): `ui` = testi dell'interfaccia (`data-ui` → testo, `data-ui-label` →
  aria-label); `pt.testi` per chiave `sNN-bN` (battute) e `sNN-id` (scritte in scena, e `data-i18n`
  sugli HTML a mano della scena 1); `pt.titoli` per chiave `sNN`. Traduzione mancante = `[PT] testo
  italiano` visibile. Cambio lingua: `html lang`, tutte le scritte, sottotitolo della battuta corrente,
  voce da `assets/vo/pt-br/`. Lingua iniziale: quella salvata, altrimenti quella del browser (pt* → pt).
- **Approfondimenti** S02–S16: generati dal motore (`sNN-approfondimento`, x 5%, al 9%, 9vh),
  spuntano alla prima battuta, cadono al cambio scena. Al clic: `lenis.stop()`, `<dialog>`
  nativo con `showModal()` (Esc/X chiudono, il focus torna al bottone). Funzione unica `openSheet(opener,
  titolo, chiave-ui del segnaposto, didascalia facoltativa)`, usata anche dai barattoli dei fratelli di S01.
- **Ricomincia** (S16): `lenis.scrollTo(0, { duration: 3 })`.

### Caterina guidata dalla scena corrente

Ogni scena ha `cateTl` (timeline in pausa con i `move` di Caterina) e `cateStart` (stato di Caterina a inizio
scena, simulato in fase di costruzione). `driveCate(curScene)` a ogni aggiornamento: se la scena corrente è
cambiata riparte da `cateStart` (posizione, visibilità, immagine, rotazione, saturazione), poi porta `cateTl`
al tempo della scena. Prima Caterina era la somma delle timeline di tutte le scene: nei salti (barra,
scrollbar, tasti Home/Fine) vinceva l'ultima scena ad aggiornarsi.

### Musica

Dati `music` per scena: `{ file, da, vol, vols, ramp, taglio, fino }`. Un ticker confronta `scrollY` con il
tratto del brano: dentro e scorrendo in avanti → play (dopo lo sblocco audio), volume che sfuma di ~0.6/s
verso il bersaglio, sotto la voce 0.2, `ramp` alza volume e velocità, `taglio` = silenzio di colpo; prima
dell'inizio → sfuma, pausa e torna a 0. Tace durante il video di S16. Interruttore MUSICA (predefinito acceso).

### S13–S16

- S13: `bugiardino: true` → classe `is-bugiardino` sul sottotitolo (foglio bianco, grazie, intestazione `ui.bugiardino`).
  Oggetti `kind: 'clic'` (puntino che pulsa, aprono il foglio). b13: 80 cloni degli oggetti (compaiono su
  `.item__tl`, spariscono al cambio su `.item`), poi l'elemento `nero` (z 80, `cambio: 'resta'`) che S14 toglie
  quando il suo sfondo nero è pieno.
- S14: saturazione sullo strato S14 (0.15 → 1 in b3); Maya cresce (scala), poi primo piano con "leccata".
- S15: `cate-colorata` attaccata a Caterina, opacità 0 → 1 da b1 a b9; ciondoli `attach` con effetto `appende`
  e `rt: 'pendolo'`, `cambio: 'resta'` (restano su di lei in S16).
- S16: telefono orizzontale che cresce fino a coprire la pagina; `<video>` dentro lo schermo, parte solo al
  clic su play; scritte a 20/50/80% del video, logo e Ricomincia alla fine; senza video (nessun clic, file
  mancante, riduci movimento) scritte, logo e Ricomincia seguono lo scroll della b3. Esc ferma il video.

### Etichette in immagine (`assets/img/ui`)

`main.js` precarica ui-linguetta, ui-linguetta-attiva, ui-etichetta-corta, ui-etichetta-lunga: se il file c'è
aggiunge `has-<nome>` a `<html>` e il CSS usa l'immagine al posto di bordo e fondo. Titoli > 14 caratteri
(`is-lungo`) usano l'etichetta lunga. Cartellino ruotato di ±3°.

### prefers-reduced-motion

Niente Lenis, niente scrub, niente tempo reale. Timeline in pausa; un ScrollTrigger per sezione
porta la timeline a un **fotogramma fermo per battuta** (label + 70% della battuta: entrate finite,
uscite non ancora iniziate). Sottotitoli e testi nascosti nelle sezioni restano leggibili.

---

## Scena 1 — La ricetta (HTML a mano)

Specifica e tabella delle battute in `CLAUDE.md` (decisioni del 30/09 sopra la bozza).

**Struttura** (strato `[data-layer="s01"]`, senza aria-hidden: lo hanno i singoli blocchi decorativi)
```
.s01-parent.s01-papa / .s01-mamma   ← solo inclinazione b5 (timeline)
  .s01-figure
    .s01-color  > .img-wrap.variant.s01-papa-{mescola|grana|oops|confuso}
    .s01-shadow > .img-wrap.variant.s01-papa-{mescola|grana}    ← brightness 0, peel alla b5
.s01-bacinella-area                 ← trema alla b7 (x)
  .s01-dentro (ritaglio sul bordo, --bordo)  > .s01-pandeiro, .s01-scaglie
  .s01-bacinella (img data-anim)
.s01-fumetto-1 (papà x 36%) · .s01-fumetto-2 (mamma x 64%), testo HTML
.s01-scaffale-area (x 10%, 50vh, 1:2)
  .s01-scaffale (immagine) · .s01-vaso.s01-fratello (button) ×2 · .s01-vaso[role=img] ×4
  .s01-ampolla-wrapper (etichetta < liquido < vetro / vetro crepato)
.s01-confetti
```
La stessa classe di posa sta sul colore e sulla sagoma: `swap(from, to)` in EXTRAS.s01 le dissolve insieme.
Ripiani: `.s01-ripiano-alto/centro/basso` = bottom 84/56/28% dello scaffale (≈ 42/28/14vh).

**Gesti** (`anims` in scenes.js, sistema a fotogrammi di `main.js`): papà grana b2–b4, papà mescola
b4–b6, mamma mescola b4–b7, bacinella tutta la scena. Per ora `frames: 0` → immagini ferme.

**Sistema a fotogrammi** (`framePlayer` in main.js): precarica `file-1…N.png`; se ne manca anche uno
resta l'immagine ferma. Il player ha la stessa interfaccia dei tween a tempo reale (`restart`/`pause`)
e sta in `sc.rts`, quindi `updateRealtime` lo accende solo nella finestra di battute, lo spegne con
Calma, e con riduci movimento non viene creato. Da spento mostra l'immagine ferma, oppure il fotogramma
`fermo: N` se indicato (mamma mescola: fotogramma 1 dalla b7).

**Barattoli dei fratelli**: `openSheet()` con segnaposto "Foto" e didascalia; `inert` finché la scena
corrente è S00 (sono coperti dal titolo). Etichette e nomi accessibili in i18n (`data-i18n`,
`data-i18n-label`).

## Segnaposto

Ogni immagine ha un fratello `.placeholder` (nome del file atteso, `[DA DEFINIRE]` se `tbd`),
mostrato su `error`, nascosto su `load`. Con i soli segnaposto ogni scena si legge.

**Entrate e riavvolgimento (30/09)**: `fromToIn(tl, target, da, a, pos)` in main.js. Se `autoAlpha: 1` sta solo nel
«da» di un fromTo, GSAP lo mette in `startAt` e dopo un riavvolgimento non lo riapplica quando lo scroll salta oltre
l'entrata: l'elemento restava invisibile. La visibilità ora è un `tl.set` separato (uno per elemento con lo stagger).

