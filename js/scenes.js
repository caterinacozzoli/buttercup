/* ==========================================================
   scenes.js — Dati puri per ogni scena (nessuna logica).
   Modifica i testi qui senza toccare main.js.

   Battute: len = scroll in vh. "c" = cambio scena (60vh).
   Audio: se non indicato, assets/vo/<scena>-<battuta>.mp3.

   Elementi (items):
     x      centro orizzontale, % della larghezza
     y      'floor' (poggia sul pavimento al 12%, default),
            'top' (attaccato in alto) o N = centro all'N% dal fondo
     h      altezza in vh · r = larghezza/altezza · w = larghezza in vw
     dx/dy  spostamento extra (es. '15.4vh')
     pos    copie: [[x, y], ...] · n = numero di copie uguali
     file   nome immagine senza .png (default <scena>-<id>);
            null = cartoncino HTML · files = un file per copia
     kind   'sagoma' (nera) · 'fondale' · 'fumetto' · 'front'
            'testo' (solo scritta) · 'bottone'
     label  scritta HTML sopra l'elemento (l'immagine è il supporto vuoto, il testo lo scrive il codice)
     labelSeManca true = la scritta c'è solo finché manca l'immagine (es. s02-virgola)
     tbd    true = [DA DEFINIRE]
     in/out "battuta effetto" oppure { b, fx, at, d, stagger }
            (at, d, stagger in frazioni della battuta).
            Entrata senza "at": 0–20% della battuta.
            Uscita senza "at": 80–100% della battuta PRIMA.
            in: 'custom' = nascosto, lo anima main.js.
     cambio effetto al cambio scena successivo (default: cade giù)
     rt     movimento a tempo reale (oscilla, twirl, scuote, ...)
     attach true = lo tiene Caterina (x/y in % del suo box)
     orbit  id dell'orbita della scena (phase in gradi, spread tra le copie,
            orbitFrom [x, y] = parte da lì e si aggancia nella battuta dopo)
     ring   { cx, cy, r (vh), n } = copie in cerchio
     halves true = due metà (per "strappa") · frame = segnaposto a cornice
     round  segnaposto tondo · confetti N = N coriandoli che cadono (in fx 'coriandoli')
     rot    rotazione fissa in gradi (numero o una per copia) · labels = una scritta per copia
     kind 'clic' = oggetto cliccabile (puntino che pulsa) che apre il foglio con titolo sheet
     nome   nome accessibile di un bottone senza scritta · testo = testo per gli screen reader
     cambio 'resta' = non esce al cambio scena · 'via' = sparisce subito

   Orbite: { id, cx, cy, rx, ry, period (s per giro), speed { battuta: moltiplicatore },
             depth = passa davanti/dietro a Caterina }
   Approfondimenti (S02–S16): li aggiunge main.js, file sNN-approfondimento.

   music (scena) { file, da, vol, vols {battuta: volume}, ramp {b, at, fino, vol, rate}, taglio {b, at},
                 fino {s, b, at} } — file in assets/musica/, vedi main.js
   bugiardino (scena) true = sottotitolo a forma di foglietto illustrativo
   anims (scena) gesti a fotogrammi: [{ file, frames, fps, da, a }] — vedi main.js
   short (scena) titolo breve scritto sul post-it della barra (deve stare dentro title)

   move (Caterina), per battuta, oggetto o lista di passi:
     { at, d, img, x, y, h, how, rt: { fx, until } }
   ========================================================== */

window.SCENES = [

  /* ── S00 — Titolo ─────────────────────────────────────── */
  {
    id: 's00', title: 'Titolo', bg: '#fcfbfa', bgZ: 45, noMark: true,
    bgOut: { b: 'uscita', at: 0.35, d: 0.5 },
    beats: [
      { id: 'inizio', len: 40 },
      { id: 'uscita', len: 60 },
    ],
    items: [
      { id: 'cartello', file: null, label: 'Ciao', x: 50, y: 55, h: 30, r: 1.4, z: 46, rt: 'oscilla',
        out: { b: 'uscita', fx: 'vola-via', at: 0, d: 0.6 } },
    ],
  },

  /* ── S01 — La ricetta (HTML in index.html, animazione in main.js) ── */
  {
    id: 's01', title: 'La ricetta', short: "La ricetta", cateH: 18,
    beats: [
      { id: 'b0', len: 60, text: null },
      { id: 'b1', len: 60, text: 'Bossa nova.' },
      { id: 'b2', len: 60, text: 'Parmigiano reggiano.' },
      { id: 'b3', len: 90, text: 'Tanti «buongiorno» e «buona giornata».' },
      { id: 'b4', len: 90, text: 'Questi erano gli ingredienti per creare una bambina serena.' },
      { id: 'b5', len: 90, text: 'Ma Silvelena e Liborio, che non avevano avuto vite semplici…' },
      { id: 'b6', len: 90, text: '…aggiunsero per sbaglio un ingrediente in più.' },
      { id: 'b7', len: 60, text: 'Una vagonata di traumi.' },
      { id: 'b8', len: 90, text: 'E così nacque Caterina.',
        move: { how: 'nasce', img: 's01-cate-neonata', x: 50, y: 40, h: 18, at: 0.05, d: 0.45 } },
    ],
    items: [],
    /* gesti a fotogrammi (sistema unico, vedi main.js): per ora frames 0 = immagini ferme */
    anims: [
      { file: 's01-papa-grana',    frames: 0, fps: 6, da: 'b2', a: 'b4' },   /* grattugia il grana */
      { file: 's01-papa-mescola',  frames: 0, fps: 6, da: 'b4', a: 'b6' },   /* alla b6 passa a oops */
      { file: 's01-mamma-mescola', frames: 0, fps: 6, da: 'b4', a: 'b7', fermo: 1 },   /* alla b7 si ferma sul fotogramma 1 */
      { file: 's01-bacinella',     frames: 0, fps: 8, da: 'b0', a: null },   /* brodaglia, fumo e bolle: tutta la scena */
    ],
  },

  /* ── S02 — Il nome ────────────────────────────────────
     Niente Comune in scena: culla (vuota → piena → piena col vomito), cartellini, certificato con e senza
     virgola (stessa tela), la virgola che cade, il fumetto. Il testo del certificato è nell'immagine. */
  {
    id: 's02', title: 'Il nome', short: "Il nome", bg: '#fcfbfa', cateH: 18,
    beats: [
      /* la neonata scende nella culla, poi sparisce: la culla passa a "piena" */
      { id: 'c', len: 60, move: [{ x: 40, y: 22, h: 18, at: 0.4, d: 0.4 }, { how: 'sparisce', at: 0.85, d: 0.1 }] },
      { id: 'b1', len: 60, text: "Però «Caterina» non era un nome abbastanza da vecchia." },
      { id: 'b2', len: 60, text: "Così aggiunsero anche Maria." },
      { id: 'b3', len: 60, text: "Senza virgola." },
      { id: 'b4', len: 130, text: "Per assicurarsi che a ogni firma in Comune ci fossero due minuti di imbarazzo…" },
      { id: 'b5', len: 90, text: "…e la solita frase: «Scusi, è un po' lungo da scrivere»." },
      { id: 'b6', len: 90, text: "E così, forte di questi super insegnamenti ricevuti prestissimo…" },
      { id: 'b7', len: 90, text: "…Cate ha dedicato la sua vita a una missione: capire chi fosse.",
        move: [{ how: 'nasce', at: 0, d: 0.1 }, { x: 50, y: 'floor', h: 35, img: 's03-cate-bambina', how: 'saltella', d: 0.6 }] },
    ],
    items: [
      /* tre culle sulla stessa tela: si sostituiscono senza salti */
      { id: 'culla', x: 40, h: 22, r: 340 / 507, z: 35, in: 'c spunta', out: { b: 'c', fx: 'sfuma', at: 0.85, d: 0.1 } },
      { id: 'culla-piena', x: 40, h: 22, r: 340 / 507, z: 35, in: { b: 'c', fx: 'sfuma', at: 0.85, d: 0.1 },
        out: { b: 'b2', fx: 'sfuma', at: 0.3, d: 0.08 } },
      { id: 'culla-piena-vomito', x: 40, h: 22, r: 340 / 507, z: 35, in: { b: 'b2', fx: 'sfuma', at: 0.3, d: 0.08 },
        out: { b: 'b6', fx: 'esce-basso', at: 0, d: 0.25 } },
      { id: 'cartellino-caterina', label: 'CATERINA', x: 40, y: 45, h: 7, r: 2.6, in: 'b1 cade' },
      { id: 'cartellino-maria', label: 'MARIA', x: 40, dx: '15.4vh', y: 45, h: 7, r: 1.8, in: 'b2 entra-dx' },
      /* certificato (x 60%, al 60%, 30vh): con virgola, poi senza (stessa tela). Proporzioni da misurare. */
      { id: 'certificato-virgola', x: 60, y: 60, h: 30, r: 600 / 403, z: 22, in: { b: 'b3', fx: 'spunta', at: 0.25, d: 0.15 },
        out: { b: 'b3', fx: 'sfuma', at: 0.5, d: 0.01 },
        testo: 'Caterina Maria, Cozzoli — nata a Milano alle ore 14:15 il 20/08/2002' },
      { id: 'certificato-no-virgola', x: 60, y: 60, h: 30, r: 600 / 403, z: 22, in: { b: 'b3', fx: 'sfuma', at: 0.5, d: 0.01 },
        out: { b: 'b6', fx: 'esce-dx', at: 0, d: 0.25 } },
      /* la virgola sopra quella del certificato. Misurata confrontando i due certificati (600×403 px):
         inchiostro a x 347–351, y 146–157 → centro 49.5 px a destra e 49.5 px sopra il centro, alta 12 px.
         Con il certificato a 30vh: 1 px = 30/403 vh → dx = dy = 3.68vh. In s02-virgola.png (60×107) l'inchiostro
         è alto 76 px: tela = 12 × 107/76 = 16.9 px del certificato → 1.26vh. */
      { id: 'virgola', x: 60, y: 60, dx: '3.68vh', dy: '3.68vh', h: 1.26, r: 60 / 107, z: 23, in: 'custom', label: ',', labelSeManca: true,
        out: { b: 'b3', fx: 'vola-dx', at: 0.82, d: 0.15 } },
      { id: 'fumetto', kind: 'fumetto', file: 's01-fumetto', label: "Scusi, è un po' lungo da scrivere", x: 78, y: 78, h: 14, r: 1.6,
        in: 'b5 entra-dx', out: { b: 'b6', fx: 'esce-dx', at: 0, d: 0.25 } },
      { id: 'punto-domanda', x: 50, y: 75, h: 20, r: 260 / 388, rt: 'oscilla', in: { b: 'b7', fx: 'spunta', at: 0.3 },
        cambio: 'sfuma' },
    ],
  },

  /* ── S03 — I sogni da piccola ─────────────────────────
     Caterina cambia a ogni battuta restando in scena: artista → bambina → ginnasta (fasciata)
     → alle medie (s05-cate-medie, la stessa di S05) con la lente da restauratrice → judoka al liceo. */
  {
    id: 's03', title: 'I sogni da piccola', short: "I sogni", bg: '#ffeba2', cateH: 35,
    beats: [
      { id: 'c', len: 60 },
      { id: 'b1', len: 60, text: "Caterina ha sognato di essere un'artista,", move: { img: 's03-cate-artista' } },
      { id: 'b2', len: 60, text: "la testa di Art Attack,", move: { img: 's03-cate-bambina' } },
      { id: 'b3', len: 90, text: "È stata una ginnasta, finché non ha perso una spalla per strada.",
        move: [
          { img: 's03-cate-ginnasta', x: 40, how: 'capriola', d: 0.35 },
          { at: 0.5, how: 'cade', d: 0.35 },
          { at: 0.65, img: 's03-cate-ginnasta-fasciata' },
        ] },
      /* «Poi alle medie»: cambia subito e cresce 35 → 40vh (resta a x 40%: la lente le arriva alla mano) */
      { id: 'b4', len: 90, text: "Poi alle medie, come se non bastassero occhiali e apparecchio, sognava di fare la restauratrice.",
        move: { img: 's05-cate-medie', h: 40, d: 0.2 } },
      /* al liceo (abiti normali, 40 → 45vh) corre sul tatami (x 40 → 50%), si cambia nel judogi, cade e si rialza */
      { id: 'b5', len: 90, text: "Ma, per perdere anche l'altra spalla, si è data al judo.",
        move: [
          { img: 's03-cate-liceo', h: 45, d: 0.15 },
          { x: 50, how: 'corre', d: 0.3 },
          { at: 0.32, img: 's03-cate-judo' },
          { at: 0.5, how: 'cade', d: 0.4 },
        ] },
    ],
    items: [
      { id: 'cavalletto', x: 28, h: 22, r: 0.7, in: 'b1 entra-sx', out: 'b2 esce-sx' },
      { id: 'tavolozza', x: 38, y: 45, h: 8, r: 1.3, in: 'b1 spunta', out: 'b2 esce-sx' },
      { id: 'testa-gigante', x: 72, h: 40, r: 0.9, in: 'b2 spunta', out: 'b3 esce-dx' },
      { id: 'nastro', x: 40, y: 50, h: 15, r: 1, in: 'b3 sfuma', out: { b: 'b4', fx: 'sfuma', at: 0, d: 0.15 } },
      /* su «restauratrice» (fine della frase); escono all'inizio della b5 (l'uscita di default cadrebbe sopra l'entrata) */
      { id: 'lente', x: 48, y: 45, h: 12, r: 2002 / 919, z: 35, in: { b: 'b4', fx: 'spunta', at: 0.7, d: 0.12 }, out: { b: 'b5', fx: 'esce-dx', at: 0, d: 0.2 } },
      { id: 'quadro-antico', x: 72, y: 50, h: 25, r: 0.8, in: { b: 'b4', fx: 'entra-dx', at: 0.75, d: 0.2 }, out: { b: 'b5', fx: 'esce-dx', at: 0, d: 0.2 } },
      { id: 'tatami', x: 50, w: 40, h: 6, in: 'b5 spunta', cambio: 'esce-basso' },
    ],
  },

  /* ── S04 — La percussionista ──────────────────────────── */
  {
    id: 's04', title: 'La percussionista', short: "La percussionista", bg: '#7a35ee', cateH: 35,
    beats: [
      { id: 'c', len: 60 },
      { id: 'b1', len: 90, text: "Molto giovane è diventata percussionista…",
        move: { img: 's04-cate-percussionista', h: 35, rt: { fx: 'marcia', until: 'end' } } },
      { id: 'b2', len: 60, text: "…umiliata tra le vie di Milano.", move: { h: 28, at: 0.2, d: 0.4 } },
      { id: 'coda', len: 60 },
    ],
    items: [
      { id: 'milano', kind: 'fondale', x: 50, w: 100, h: 40, in: { b: 'b1', fx: 'entra-dx', d: 0.9 } },
      { id: 'banda', x: 50, w: 50, h: 35, z: 15, rt: 'marcia', in: { b: 'b1', fx: 'entra-sx', d: 0.3 },
        out: { b: 'coda', fx: 'esce-dx', at: 0, d: 0.8 } },
      { id: 'papa-banda', x: 34, h: 55, r: 2 / 3, z: 22, rt: 'marcia', in: { b: 'b1', fx: 'entra-sx', d: 0.4 },
        out: { b: 'coda', fx: 'esce-dx', at: 0, d: 0.8 } },
      { id: 'passanti', kind: 'sagoma', pos: [[12, 'floor'], [88, 'floor']], h: 30, r: 2 / 3, in: 'b2 spunta' },
      { id: 'coriandoli', confetti: 30, x: 50, y: 50, w: 100, h: 100, z: 36,
        in: { b: 'b2', fx: 'coriandoli', at: 0.05, d: 0.9 } },
      { id: 'tamburo', file: null, tbd: true, kind: 'testo', cls: 'is-nota',
        label: '[DA DEFINIRE] si nasconde dietro il tamburo', x: 50, y: 50, h: 5, w: 26,
        in: { b: 'b2', fx: 'sfuma', at: 0.3 } },
    ],
  },

  /* ── S05 — Le medie ───────────────────────────────────── */
  {
    id: 's05', title: 'Le medie', short: "Le medie", bg: '#d4cdff', cateH: 40,
    music: { file: 'canzone-5', da: 'c', vol: 0.3 },
    orbits: [{ id: 'giro', cx: 50, cy: 60, rx: '24vh', ry: '5vh', period: 6, depth: true }],
    beats: [
      { id: 'c', len: 60 },
      { id: 'b1', len: 60, text: "Alle medie era solo… beh, strana.", move: { img: 's05-cate-medie', h: 40 } },
      { id: 'b2', len: 60, text: "E sognava di essere Alex." },
    ],
    items: [
      { id: 'banco', x: 34, h: 18, r: 1.2, in: 'b1 spunta' },
      { id: 'stranezza', tbd: true, orbit: 'giro', h: 10, r: 1, in: 'b1 spunta' },
      { id: 'nuvola', x: 60, y: 78, h: 22, r: 1.5, in: 'b2 spunta' },
      { id: 'cate-blocchi', x: 60, y: 78, h: 14, r: 2 / 3, z: 21, in: { b: 'b2', fx: 'sfuma', at: 0.15 } },
    ],
  },

  /* ── S06 — Le superiori ───────────────────────────────── */
  {
    id: 's06', title: 'Le superiori', short: "Le superiori", bg: '#fed728', cateH: 45,
    beats: [
      { id: 'c', len: 60, move: { x: 40, h: 45, at: 0.3, d: 0.5 } },
      { id: 'b1', len: 90, text: "In prima superiore, una maranza non troppo studiosa.",
        move: { x: 50, img: 's03-cate-liceo', how: 'cammina', d: 0.6 } },
      { id: 'b2', len: 90, text: "E, per non farsi mancare ulteriore bullismo: teatro e coro della scuola.",
      },
      { id: 'b3', len: 90, text: "Le piacque a tal punto la terza che decise di rifarla…",
        move: { at: 0.35, how: 'gira', d: 0.5 } },
      { id: 'b4', len: 90, text: "…proprio l'anno prima del «tutti promossi», aka Covid." },
    ],
    items: [
      { id: 'sipario', kind: 'fondale', x: 50, w: 50, h: 60, in: 'b2 scende', out: 'b3 esce-alto' },
      { id: 'leggio-coro', x: 30, h: 22, r: 0.6, in: 'b2 spunta', out: 'b3 esce-basso' },
      { id: 'bulli', kind: 'sagoma', pos: [[12, 'floor'], [88, 'floor']], h: 35, r: 2 / 3,
        in: 'b2 spunta', out: 'b3 esce-lati' },
      { id: 'pagella-1', file: 's06-pagella', label: '3ª', x: 30, y: 50, h: 18, r: 0.75,
        in: 'b3 cade', out: 'b4 esce-basso' },
      { id: 'pagella-2', file: 's06-pagella', label: '3ª', x: 70, y: 50, h: 18, r: 0.75,
        in: { b: 'b3', fx: 'cade', at: 0.2 }, out: 'b4 esce-basso' },
      { id: 'mascherina', x: 60, y: 70, h: 6, r: 1.7, fig: true, in: 'b4 spunta' },
      { id: 'biglietti', file: 's06-biglietto-dorato', label: 'PROMOSSA',
        pos: [[25, 22], [33, 42], [67, 36], [75, 20]], h: 12, r: 1.6,
        in: { b: 'b4', fx: 'piove', at: 0.1, d: 0.25, stagger: 0.1 } },
      { id: 'biglietto-5', file: 's06-biglietto-dorato', label: 'PROMOSSA', x: 58, y: 40, h: 12, r: 1.6, z: 35,
        in: { b: 'b4', fx: 'piove', at: 0.5, d: 0.2 }, out: { b: 'b4', fx: 'vola-via', at: 0.8 } },
    ],
  },

  /* ── S07 — La casa momentanea ─────────────────────────── */
  {
    id: 's07', title: 'La casa momentanea', short: "La casa", bg: '#fcfbfa', cateH: 45,
    beats: [
      { id: 'c', len: 60 },
      { id: 'b1', len: 90, text: "Poi, quando la sua casa si è fatta stretta…",
        move: { how: 'inclina', h: 40, at: 0.3, d: 0.5 } },
      { id: 'b2', len: 90, text: "…ha trovato una casa momentanea in un'associazione magnifica…",
        move: [{ h: 45, how: 'dritta', d: 0.2 }, { at: 0.2, x: 58, how: 'corre', d: 0.5 }] },
      { id: 'b3', len: 60, text: "…che la accompagna da dieci anni." },
    ],
    items: [
      /* dietro Caterina, a terra: spunta enorme (85vh) e con lo scroll si rimpicciolisce fino a 18vh (main.js) */
      { id: 'casa-piccola', x: 50, h: 85, r: 1.1, z: 20, fig: true, in: 'b1 spunta', out: 'b2 vola-alto' },
      { id: 'associazione', tbd: true, x: 74, h: 50, r: 0.9, in: 'b2 entra-dx' },
      { id: 'persone-associazione', pos: [[38, 'floor'], [88, 'floor']], h: 40, r: 1, in: 'b3 spunta' },
    ],
  },

  /* ── S08 — La cameriera ───────────────────────────────── */
  {
    id: 's08', title: 'La cameriera', short: "La cameriera", bg: '#ffeba2', cateH: 45,
    beats: [
      { id: 'c', len: 60, move: [{ img: 's09-cate-studentessa', d: 0.2 }, { x: 50, how: 'cammina', at: 0.3, d: 0.6 }] },
      { id: 'b1', len: 90, text: "Nel frattempo doveva racimolare i soldi per l'università…" },
      { id: 'b2', len: 90, text: "…allora è diventata una cameriera.",
        move: [
          { at: 0.15, x: 44, how: 'corre', d: 0.17 },
          { at: 0.35, x: 60, how: 'corre', d: 0.17 },
          { at: 0.55, x: 44, how: 'corre', d: 0.17 },
          { at: 0.75, x: 60, how: 'corre', d: 0.17 },
        ] },
    ],
    items: [
      { id: 'salvadanaio', label: 'UNIVERSITÀ', x: 28, h: 18, r: 1.2, in: 'b1 spunta' },
      /* sulla mano destra all'altezza del gomito (55% della figura), sporge a destra */
      { id: 'vassoio', attach: true, pos: [[84, 55]], h: 10, r: 1.7, fig: true, in: { b: 'b2', fx: 'spunta', at: 0.02 } },
      { id: 'monete', n: 6, x: 28, y: 32, h: 5, r: 1, round: true, in: 'custom' },
    ],
  },

  /* ── S09 — Scienze psicosociali ───────────────────────── */
  {
    id: 's09', title: 'Scienze psicosociali', short: "Psicosociali", bg: '#d4cdff', cateH: 45,
    bgTo: [{ b: 'b3', color: '#fed728', at: 0, d: 0.3 }],
    beats: [
      { id: 'c', len: 60, move: { x: 50, at: 0.3, d: 0.4 } },
      { id: 'b1', len: 90, text: "Contro ogni pronostico dei professori e del suo ex ragazzo…" },
      { id: 'b2', len: 90, text: "…è diventata studentessa di Scienze psicosociali.",
        move: { img: 's09-cate-studentessa' } },
      { id: 'b3', len: 130, text: "E improvvisamente Caterina è diventata felice. Forse per la prima volta nella sua vita…",
        move: { how: 'saltella', at: 0.1, d: 0.8 } },
      { id: 'b4', len: 90, text: "…grazie anche a due magnifici compagni di vita: Ale e Maya." },
    ],
    items: [
      { id: 'prof', kind: 'sagoma', x: 16, h: 55, r: 2 / 3, rt: 'scuote', in: 'b1 spunta',
        out: { b: 'b2', fx: 'si-stacca', at: 0.25, d: 0.3 } },
      { id: 'ex', kind: 'sagoma', x: 84, h: 55, r: 2 / 3, rt: 'scuote', in: 'b1 spunta',
        out: { b: 'b2', fx: 'si-stacca', at: 0.3, d: 0.3 } },
      { id: 'cartello-pronostico', label: 'NON CE LA FARÀ', n: 2, halves: true, x: 50, y: 80, h: 15, r: 2,
        in: 'b1 cade', out: { b: 'b2', fx: 'strappa', at: 0.05, d: 0.3 } },
      { id: 'libri', attach: true, pos: [[6, 55]], h: 12, r: 1, in: { b: 'b2', fx: 'spunta', at: 0.05 } },
      { id: 'ale', file: 's09-ale', x: 68, h: 55, r: 0.35, fig: true, in: { b: 'b4', fx: 'entra-dx', d: 0.4 } },
      { id: 'maya', file: 's09-maya', x: 36, h: 18, r: 0.75, fig: true, rt: 'scodinzola', in: { b: 'b4', fx: 'entra-sx', d: 0.25 } },
    ],
  },

  /* ── S10 — Figma e il Parlamento Europeo ──────────────── */
  {
    id: 's10', title: 'Figma e il Parlamento Europeo', short: "Figma", bg: '#7a35ee', cateH: 45,
    beats: [
      { id: 'c', len: 60 },
      { id: 'b1', len: 130, text: "Per caso o per destino ha scoperto Figma: per un esame di marketing le sembrava inconcepibile ideare un piano social per un'app senza averla tangibile.",
      },
      { id: 'b2', len: 90, text: "E, per caso o per fortuna, quel progetto è finito al Parlamento Europeo.",
        move: { img: 's13-cate-tailleur' } },
      { id: 'b3', len: 90, text: "Quindi si potrebbe dire che Caterina è stata anche, momentaneamente… una diva?",
        move: { x: 45, how: 'cammina', d: 0.8 } },
    ],
    items: [
      /* a terra accanto a lei, a destra */
      { id: 'laptop', x: 64, h: 12, r: 1.35, fig: true, in: 'b1 spunta', out: 'b2 esce-sx' },
      { id: 'telefono-app', x: 66, y: 50, h: 22, r: 0.5, in: 'b1 spunta' },
      { id: 'ui', files: ['s10-ui-1', 's10-ui-2', 's10-ui-3'], pos: [[66, 56], [66, 50], [66, 44]],
        h: 4, r: 2.2, z: 21, in: { b: 'b1', fx: 'spunta', at: 0.3, d: 0.1, stagger: 0.2 } },
      { id: 'parlamento', x: 76, h: 45, r: 1.3, in: 'b2 entra-dx' },
      { id: 'stelle-ue', ring: { cx: 76, cy: 82, r: 9, n: 12 }, h: 4, r: 1,
        in: { b: 'b2', fx: 'spunta', at: 0.3, d: 0.05, stagger: 0.04 } },
      { id: 'tappeto-rosso', x: 40, w: 60, h: 6, in: 'b3 srotola' },
      { id: 'flash', cls: 'is-flash', pos: [[20, 50], [80, 50]], h: 12, r: 1, z: 45, in: 'custom' },
    ],
  },

  /* ── S11 — I lavoretti ────────────────────────────────── */
  {
    id: 's11', title: 'I lavoretti', short: "I lavoretti", bg: '#7a35ee', cateH: 45,
    bgTo: [
      { b: 'b2', color: '#31155f', at: 0, d: 0.4 },   /* viola con velo nero al 60% */
      { b: 'b5', color: '#fcfbfa', at: 0, d: 0.2 },
    ],
    beats: [
      { id: 'c', len: 60, move: [{ img: 's11-cate-hostess', d: 0.2 }, { x: 50, at: 0.3, d: 0.4 }] },
      { id: 'b1', len: 90, text: "Poi è tornata a terra ed è diventata una hostess…",
        move: { how: 'salto', d: 0.4 } },
      { id: 'b2', len: 60, text: "…la notte…" },
      { id: 'b3', len: 60, text: "…nelle discoteche milanesi…" },
      { id: 'b4', len: 60, text: "…a vendere Ploom." },
      { id: 'b5', len: 90, text: "E, per molti borghesi del suo condominio, «la dogsitter sudamericana».",
        move: [{ x: 30, d: 0.15 }, { at: 0.2, x: 60, how: 'corre', d: 0.6 }] },
    ],
    items: [
      { id: 'luci-discoteca', pos: [[25, 'top'], [50, 'top'], [75, 'top']], h: 70, r: 0.35, rt: 'luce',
        in: 'b3 sfuma', out: 'b5 sfuma' },
      { id: 'vassoio-dispositivi', attach: true, pos: [[50, 51]], h: 10, r: 1.6, in: 'b4 spunta', out: 'b5 sfuma' },
      { id: 'condominio', kind: 'fondale', x: 50, h: 70, r: 1, in: 'b5 sale' },
      { id: 'vicini', kind: 'sagoma', pos: [[40, 70], [60, 70], [40, 48], [60, 48]], h: 10, r: 0.8,
        in: { b: 'b5', fx: 'spunta', at: 0.25, stagger: 0.06 } },
      { id: 'fumetto-vicini', kind: 'fumetto', label: '«la dogsitter sudamericana»', x: 72, y: 78, h: 14, r: 1.6,
        in: { b: 'b5', fx: 'spunta', at: 0.45 } },
      /* ai suoi piedi, a destra: corrono con lei */
      { id: 'cani', attach: true, pos: [[112, 15]], h: 14, r: 1.25, fig: true, rt: 'corsa', in: { b: 'b5', fx: 'spunta', at: 0.12 } },
    ],
  },

  /* ── S12 — La mediatrice culturale ────────────────────── */
  {
    id: 's12', title: 'La mediatrice culturale', short: "La mediatrice", bg: '#fcfbfa', cateH: 45,
    beats: [
      { id: 'c', len: 60, move: { x: 50, img: 's09-cate-studentessa', at: 0.3, d: 0.5 } },
      { id: 'b1', len: 90, text: "Ma essere mezza sudamericana, oltre a qualche insulto velatamente razzista…" },
      { id: 'b2', len: 60, text: "…e qualche aggiuntina di traumi…" },
      { id: 'b3', len: 90, text: "…ha fatto sì che Caterina diventasse una mediatrice culturale…",
      },
      { id: 'b4', len: 90, text: "…per donne e bambine immigrate, negli ospedali e nei consultori." },
    ],
    items: [
      { id: 'insulti', tbd: true, x: 70, y: 60, h: 12, r: 1.5, in: 'b1 sfuma', out: 'b3 esce-dx' },
      { id: 'ampolla', file: 's01-ampolla', x: 80, y: 72, h: 12, r: 2 / 3, in: 'b2 spunta',
        out: { b: 'b2', fx: 'sfuma', at: 0.8 } },
      { id: 'goccia', file: null, cls: 'is-goccia', x: 80, y: 64, h: 2.5, r: 0.7, z: 21, in: 'custom' },
      { id: 'fumetti-lingue', kind: 'fumetto',
        files: ['s12-fumetti-lingue-1', 's12-fumetti-lingue-2', 's12-fumetti-lingue-3'],
        labels: ['Hola', 'Olá', 'Salam'],
        pos: [[32, 65], [50, 82], [68, 65]], h: 12, r: 1.4,
        in: { b: 'b3', fx: 'spunta', at: 0.1, stagger: 0.15 } },
      { id: 'ospedale', x: 14, h: 40, r: 0.9, in: 'b4 entra-sx' },
      { id: 'consultorio', x: 86, h: 35, r: 0.9, in: 'b4 entra-dx' },
      { id: 'donne-bambine', tbd: true, pos: [[32, 'floor'], [68, 'floor']], h: 40, r: 0.8,
        in: { b: 'b4', fx: 'spunta', at: 0.15, stagger: 0.05 } },
    ],
  },

  /* ── S13 — Da dicembre a maggio (il bugiardino) ─────────
     Montaggio veloce: niente esce, tutto si somma fino alla b13 (poi si moltiplica e diventa nero).
     Sottotitolo a forma di bugiardino (bugiardino: true). */
  {
    id: 's13', title: 'Da dicembre a maggio: il bugiardino', short: "Il bugiardino", bg: '#fed728', cateH: 50,
    bugiardino: true,
    bgTo: [
      { b: 'b1', color: '#b0b4ba', at: 0, d: 11.8 },   /* si spegne battuta dopo battuta fino al grigio (b11) */
      { b: 'b13', color: '#000000', at: 0.75, d: 0.1 },
    ],
    music: { file: 'canzone-4', da: 'c', vol: 0.3,
      ramp: { b: 'b13', at: 0, fino: 0.75, vol: 0.6, rate: 1.25 },   /* mentre tutto si moltiplica */
      taglio: { b: 'b13', at: 0.8 } },                                /* nero: silenzio di colpo */
    beats: [
      { id: 'c', len: 60, move: { img: 's13-cate-tailleur', x: 50, y: 'floor', h: 50, at: 0.3, d: 0.5 } },
      { id: 'b1', len: 50, text: "Caterina, da dicembre a maggio: si è laureata in Scienze psicosociali," },
      { id: 'b2', len: 50, text: "ha iniziato la magistrale in Teoria e tecnologia della comunicazione," },
      { id: 'b3', len: 50, text: "ha vinto una borsa di studio per il master con un'app per maranza," },
      { id: 'b4', len: 50, text: "ha dato gli esami del primo semestre,", move: { img: 's13-cate-felpa' } },
      { id: 'b5', len: 60, text: "ha portato un suo vecchio progetto, Abilicity, in una mostra digitale delle Paralimpiadi invernali," },
      { id: 'b6', len: 50, text: "ha fatto una vagonata di networking agli eventi," },
      { id: 'b7', len: 60, text: "ha continuato a fare la mediatrice negli ospedali, per donne e bambine immigrate, assistendo a visite… ecco, non sempre allegre," },
      { id: 'b8', len: 60, text: "e ha concluso il master… uhm… presentando in ritardo il progetto finale." },
      { id: 'b9', len: 50, text: "Però ha conosciuto dei bellissimi amici,", move: { img: 's13-cate-amici' } },
      { id: 'b10', len: 50, text: "e ha imparato un sacco di cose." },
      { id: 'b11', len: 60, text: "Poi le avversità della vita…", move: { img: 's13-cate-felpa' } },
      { id: 'b12', len: 60, text: "…e ogni tanto Silvelena e Liborio, con una nuvoletta, ne aggiungevano un'altra." },
      { id: 'b13', len: 90 },
    ],
    items: [
      /* b1 */
      { id: 'corona', attach: true, pos: [[50, 95]], h: 8, r: 1.2, fig: true, rot: -14, in: 'b1 cade', cambio: 'via' },
      { id: 'spritz', attach: true, pos: [[14, 46]], h: 8, r: 0.6, in: { b: 'b1', fx: 'cade', at: 0.1 }, cambio: 'via' },
      { id: 'coriandoli', confetti: 30, x: 50, y: 50, w: 100, h: 100, z: 36,
        in: { b: 'b1', fx: 'coriandoli', at: 0.05, d: 0.9 }, cambio: 'via' },
      /* b2–b5 */
      { id: 'computer', kind: 'clic', sheet: 'Esperimento Minecraft', x: 30, y: 30, h: 14, r: 1.3, rot: -4,
        in: 'b2 spunta', cambio: 'via' },
      { id: 'busta-borsa', kind: 'clic', sheet: "Mail della borsa e app per maranza", x: 70, y: 62, h: 10, r: 1.5, rot: 6,
        in: 'b3 entra-dx', cambio: 'via' },
      { id: 'libri', x: 36, h: 16, r: 0.8, in: 'custom', cambio: 'via' },
      { id: 'abilicity-logo', kind: 'clic', sheet: 'Abilicity: articolo', x: 72, y: 40, h: 10, r: 478 / 716, rot: -5,
        in: 'b5 spunta', cambio: 'via' },
      /* b6 */
      { id: 'telefono-notifiche', x: 26, y: 55, h: 14, r: 0.55, rot: 5, in: 'b6 spunta', cambio: 'via' },
      { id: 'sticker-linkedin', file: 'sticker/sticker-linkedin', cls: 'is-sticker', x: 26, y: 57, h: 5, r: 1, z: 22,
        in: { b: 'b6', fx: 'sfuma', at: 0.1, d: 0.05 }, cambio: 'via' },
      { id: 'badge', file: null, cls: 'is-badge', x: 29.5, y: 63, h: 3.2, r: 1.3, z: 23, round: true,
        in: { b: 'b6', fx: 'spunta', at: 0.12 }, cambio: 'via' },
      { id: 'biglietti', pos: [[40, 'floor'], [44, 'floor'], [48, 'floor'], [53, 'floor'], [57, 'floor'], [61, 'floor']],
        h: 4, r: 1.6, rot: [-12, 8, -4, 15, -9, 5],
        in: { b: 'b6', fx: 'piove', at: 0.2, d: 0.3, stagger: 0.08 }, cambio: 'via' },
      /* b7–b8 */
      { id: 'badge-mediatrice', attach: true, pos: [[60, 66]], h: 5, r: 1, in: 'b7 spunta', cambio: 'via' },
      { id: 'nuvoletta-grigia', attach: true, pos: [[50, 118]], h: 10, r: 1.6, rt: 'oscilla', in: { b: 'b7', fx: 'spunta', at: 0.2 }, cambio: 'via' },
      { id: 'sveglia', x: 64, h: 8, r: 1, rt: 'trema', in: 'b8 spunta', cambio: 'via' },
      { id: 'progetto-finale', kind: 'clic', sheet: 'Progetto finale: app per daltonici', x: 60, y: 30, h: 12, r: 1.3, rot: 4,
        in: { b: 'b8', fx: 'entra-dx', at: 0.35, d: 0.45 }, cambio: 'via' },
      /* b9–b10 */
      { id: 'amico', files: ['s13-amico-1', 's13-amico-2', 's13-amico-3', 's13-amico-4'],
        pos: [[36, 68], [42, 79], [58, 79], [64, 68]], h: 9, r: 1, round: true, rot: [-8, 5, -5, 8],
        in: { b: 'b9', fx: 'spunta', at: 0.1, d: 0.12, stagger: 0.15 }, cambio: 'via' },
      { id: 'sticker', cls: 'is-sticker',
        files: ['sticker/sticker-figma', 'sticker/sticker-claude', 'sticker/sticker-miro', 'sticker/sticker-antigravity'],
        pos: [[33, 52], [67, 50], [38, 22], [63, 24]], h: 7, r: 1, z: 36,
        in: { b: 'b10', fx: 'sfuma', at: 0.1, d: 0.05, stagger: 0.15 }, cambio: 'via' },
      /* b11–b12 */
      { id: 'avversita', tbd: true, files: ['s13-avversita-1', 's13-avversita-2', 's13-avversita-3'],
        pos: [[30, 'floor'], [70, 'floor'], [50, 84]], h: 12, r: 1, rot: [-10, 12, -6],
        in: { b: 'b11', fx: 'cade-pesante', at: 0.05, d: 0.2, stagger: 0.2 }, cambio: 'via' },
      { id: 'papa-busto', file: 's01-papa-mescola', x: 8, y: 20, h: 25, r: 0.8, in: 'b12 entra-sx', cambio: 'via' },
      { id: 'mamma-busto', file: 's01-mamma-mescola', x: 92, y: 20, h: 25, r: 0.8, in: 'b12 entra-dx', cambio: 'via' },
      { id: 'nuvoletta-genitori', kind: 'fumetto', pos: [[18, 50], [82, 50]], h: 12, r: 1.4,
        in: { b: 'b12', fx: 'spunta', at: 0.25, stagger: 0.08 }, cambio: 'via' },
      { id: 'problema', tbd: true, files: ['s13-problema-1', 's13-problema-2'], pos: [[18, 50], [82, 50]], h: 8, r: 1,
        z: 37, in: 'custom', cambio: 'via' },
      /* b13: il nero finale (i cloni li crea main.js) */
      { id: 'nero', file: null, cls: 'is-nero', x: 50, y: 50, w: 100, h: 100, z: 80,
        in: { b: 'b13', fx: 'sfuma', at: 0.76, d: 0.06 }, cambio: 'resta' },
    ],
  },

  /* ── S14 — L'Olanda ───────────────────────────────────── */
  {
    id: 's14', title: "L'Olanda", short: "L'Olanda", bg: '#000000', cateH: 50,
    bgTo: [
      { b: 'b2', color: '#16264a', at: 0, d: 0.5 },    /* blu notte */
      { b: 'b3', color: '#cfe6ff', at: 0, d: 0.9 },    /* azzurro cielo */
    ],
    music: { file: 'canzone-1', da: 'b2', vol: 0.3 },
    beats: [
      { id: 'c', len: 60, move: { how: 'sparisce', at: 0, d: 0.02 } },
      { id: 'b1', len: 90 },
      { id: 'b2', len: 90, text: "Allora io, Ale e Maya abbiamo girato l'Olanda…",
        move: [
          { at: 0, x: -15, y: 'floor', h: 50, img: 's13-cate-felpa', d: 0.01 },
          { at: 0.02, how: 'nasce', d: 0.05 },
          { at: 0.05, x: 45, how: 'cammina', d: 0.6 },
        ] },
      { id: 'b3', len: 90, text: "…abbiamo respirato, e ci siamo goduti ogni giorno come se potesse essere l'ultimo.",
        move: { how: 'respiro', at: 0.2, d: 0.6 } },
      { id: 'b4', len: 90, text: "E tutto è tornato a colori.",
        /* passa a colorata, poi al suo turno (0.5) lascia il posto alla versione di spalle che corre via (main.js) */
        move: [{ img: 's15-cate-colorata' }, { how: 'sparisce', at: 0.5, d: 0.02 }] },
    ],
    items: [
      { id: 'maya-fronte', x: 50, y: 45, h: 60, r: 0.6, fig: true, z: 40, rt: 'marcia', in: 'custom' },
      { id: 'maya-bacio', file: 's14-maya-fronte', x: 50, y: 50, h: 90, r: 0.6, fig: true, z: 41, in: 'custom', out: { b: 'b2', fx: 'sfuma', at: 0, d: 0.1 } },
      { id: 'cuore', x: 62, y: 72, h: 6, r: 1.1, fig: true, z: 42, in: { b: 'b1', fx: 'spunta', at: 0.9, d: 0.08 },
        out: { b: 'b2', fx: 'sfuma', at: 0, d: 0.1 } },
      { id: 'maya', file: 's09-maya', x: 35, h: 18, r: 0.75, fig: true, rt: 'scodinzola', in: { b: 'b2', fx: 'spunta', at: 0.08 },
        out: { b: 'b4', fx: 'sfuma', at: 0.1, d: 0.03 } },
      { id: 'mulino', x: 15, h: 45, r: 0.6, in: { b: 'b2', fx: 'sale', at: 0.1, d: 0.3 }, out: 'b4 esce-basso' },
      { id: 'tulipani', x: 50, w: 70, h: 12, in: { b: 'b2', fx: 'sale', at: 0.15, d: 0.3 }, out: 'b4 esce-basso' },
      { id: 'bici', x: 82, h: 18, r: 1.5, in: { b: 'b2', fx: 'sale', at: 0.2, d: 0.3 }, out: 'b4 esce-basso' },
      { id: 'ale', file: 's09-ale', x: 60, h: 55, r: 0.35, fig: true, in: { b: 'b2', fx: 'entra-sx', at: 0.1, d: 0.55 },
        out: { b: 'b4', fx: 'sfuma', at: 0.35, d: 0.03 } },
      { id: 'prato', kind: 'fondale', x: 50, y: 22.5, w: 100, h: 45, in: { b: 'b4', fx: 'sale', at: 0, d: 0.12 }, cambio: 'esce-basso' },
      /* b4: di spalle corrono via uno alla volta verso l'orizzonte (Maya, Ale, Caterina): main.js */
      { id: 'maya-spalle', x: 35, h: 18, r: 0.75, fig: true, z: 36, in: 'custom', cambio: 'via' },
      { id: 'ale-spalle', x: 60, h: 55, r: 0.5, fig: true, z: 36, in: 'custom', cambio: 'via' },
      { id: 'cate-spalle', x: 45, h: 50, r: 0.6, fig: true, z: 37, in: 'custom', cambio: 'via' },
    ],
  },

  /* ── S15 — Cosa ama Caterina ──────────────────────────── */
  {
    id: 's15', title: 'Cosa ama Caterina', short: "Cosa ama", bg: '#7a35ee', cateH: 50,
    music: { file: 'canzone-2', da: 'c', vol: 0.3, fino: { s: 's16', b: 'b1', at: 0.3 } },
    beats: [
      { id: 'c', len: 60, move: [{ img: 's15-cate-colorata', x: 50, y: 'floor', h: 50, at: 0, d: 0.01 }, { how: 'nasce', at: 0.3, d: 0.3 }] },
      { id: 'b1', len: 90, text: "Caterina ama la musica, l'arte, i videogame…", move: { how: 'sobbalzo', at: 0.02, d: 0.12 } },
      { id: 'b2', len: 90, text: "…il buon cibo (profilo Hinge di un uomo performativo)…" },
      { id: 'b3', len: 60, text: "…i cedri, Glee, Futurama…" },
      { id: 'b4', len: 130, text: "…i Pokémon, soprattutto perché da piccola non glieli compravano, e ora li colleziona con Alessandro…" },
      { id: 'b5', len: 60, text: "…il judo…" },
      { id: 'b6', len: 90, text: "…le cose simpatiche come questa, da fare con l'aiuto dell'AI…" },
      { id: 'b7', len: 90, text: "…i gattini, i cagnolini, ma ogni essere vivente…" },
      { id: 'b8', len: 60, text: "…essere utile…" },
      { id: 'b9', len: 130, text: "…arrampicarsi a cazzo di cane, cadere e rialzarsi.",
        move: [
          { x: 80, how: 'corre', d: 0.15 },
          { at: 0.2, y: 42, d: 0.05 },
          { at: 0.28, y: 48, d: 0.05 },
          { at: 0.36, y: 55, d: 0.05 },
          { at: 0.5, y: 'floor', d: 0.07, ease: 'power2.in' },
          { at: 0.5, how: 'cade', d: 0.3 },
          { at: 0.85, x: 50, how: 'corre', d: 0.15 },
        ] },
    ],
    items: [
      { id: 'cerchio', file: null, cls: 'is-giallo', round: true, kind: 'fondale', x: 50, y: 37, h: 60, r: 1,
        in: 'c sfuma', cambio: 'resta' },
      /* lo stesso disegno a colori sopra quello neutro: si "riveste" di colore da b1 a b9 */
      /* ciondoli alla cintura (~45% della sua altezza): entrano grandi accanto a lei e si appendono */
      { id: 'ciondolo-nota', attach: true, pos: [[40, 40]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b1', fx: 'appende', at: 0.15, d: 0.3 }, cambio: 'resta' },
      { id: 'ciondolo-tavolozza', attach: true, pos: [[60, 40]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b1', fx: 'appende', at: 0.4, d: 0.3 }, cambio: 'resta' },
      { id: 'ciondolo-gamepad', attach: true, pos: [[33, 38]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b1', fx: 'appende', at: 0.65, d: 0.3 }, cambio: 'resta' },
      { id: 'telefono-dating', x: 80, y: 50, h: 18, r: 0.5, z: 40, in: 'b2 spunta', out: { b: 'b2', fx: 'esce-dx', at: 0.85, d: 0.15 } },
      { id: 'foto-cibo', files: ['s15-foto-cibo-1', 's15-foto-cibo-2', 's15-foto-cibo-3'], pos: [[80, 53], [80, 53], [80, 53]],
        h: 7, r: 1, z: 41, in: { b: 'b2', fx: 'sfuma', at: 0.2, d: 0.05, stagger: 0.2 }, out: { b: 'b2', fx: 'esce-dx', at: 0.85, d: 0.15 } },
      { id: 'ciondolo-forchetta', attach: true, pos: [[67, 38]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b2', fx: 'appende', at: 0.5, d: 0.3 }, cambio: 'resta' },
      { id: 'ciondolo-cedro', attach: true, pos: [[26, 40]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b3', fx: 'appende', at: 0.1, d: 0.25 }, cambio: 'resta' },
      { id: 'ciondolo-microfono', attach: true, pos: [[74, 40]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b3', fx: 'appende', at: 0.35, d: 0.25 }, cambio: 'resta' },
      /* una sola tv generica per Glee e Futurama */
      { id: 'ciondolo-tv', attach: true, pos: [[47, 37]], h: 4.5, r: 1, z: 26, rt: 'pendolo', in: { b: 'b3', fx: 'appende', at: 0.6, d: 0.25 }, cambio: 'resta' },
      { id: 'ale', file: 's09-ale', x: 78, h: 55, r: 2 / 3, in: 'b4 spunta' },
      { id: 'carta-in-mano', x: 72, y: 40, h: 8, r: 0.7, z: 22, in: { b: 'b4', fx: 'spunta', at: 0.15 } },
      { id: 'ciondolo-carta', attach: true, pos: [[20, 38]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b4', fx: 'appende', at: 0.45, d: 0.25 }, cambio: 'resta' },
      { id: 'ciondolo-judo', attach: true, pos: [[80, 38]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b5', fx: 'appende', at: 0.2, d: 0.3 }, cambio: 'resta' },
      { id: 'ciondolo-scintilla', attach: true, pos: [[54, 36]], h: 4.5, r: 1, z: 26, rt: 'pendolo', in: { b: 'b6', fx: 'appende', at: 0.2, d: 0.3 }, cambio: 'resta' },
      { id: 'gattino', x: 36, h: 15, r: 1.2, in: { b: 'b7', fx: 'entra-sx', d: 0.3 } },
      { id: 'maya', file: 's09-maya', x: 62, h: 18, r: 1, rt: 'scodinzola', in: { b: 'b7', fx: 'entra-dx', at: 0.1, d: 0.3 } },
      { id: 'ciondolo-zampa', attach: true, pos: [[14, 40]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b7', fx: 'appende', at: 0.5, d: 0.3 }, cambio: 'resta' },
      { id: 'ciondolo-cuore', attach: true, pos: [[86, 40]], h: 4.5, r: 1, z: 25, rt: 'pendolo', in: { b: 'b8', fx: 'appende', at: 0.2, d: 0.35 }, cambio: 'resta' },
      { id: 'parete-arrampicata', kind: 'fondale', x: 88, h: 70, r: 0.5, in: 'b9 sale' },
      { id: 'ciondolo-moschettone', attach: true, pos: [[40, 34]], h: 4.5, r: 1, z: 27, rt: 'pendolo', in: { b: 'b9', fx: 'appende', at: 0.82, d: 0.15 }, cambio: 'resta' },
    ],
  },

  /* ── S16 — Il saggio (telefono, video, scritte, logo, Ricomincia) ── */
  {
    id: 's16', title: 'Il saggio', short: "Il saggio", bg: '#7a35ee', cateH: 50,
    beats: [
      { id: 'c', len: 60 },
      { id: 'b1', len: 90, text: "Ah! E ho fatto anche il saggio di danza polinesiana con le mie amichette.",
        move: { how: 'inclina', at: 0.2, d: 0.3 } },
      { id: 'b2', len: 130 },
      { id: 'b3', len: 100 },
    ],
    items: [
      /* telefono di carta orizzontale: cresce dalla sua mano fino a coprire la pagina (video nello schermo) */
      { id: 'telefono-grande', x: 50, y: 50, h: 110, r: 2, z: 70, in: 'custom' },
      { id: 'play', kind: 'bottone', nome: 'Guarda il saggio', x: 50, y: 50, h: 18, r: 1, z: 73, round: true,
        in: { b: 'b2', fx: 'spunta', at: 0.85, d: 0.1 } },
      /* alla fine resta solo il nero (copre telefono e play), con logo e Ricomincia sopra */
      { id: 'nero', file: null, cls: 'is-nero is-finale', x: 50, y: 50, w: 100, h: 100, z: 74, in: 'custom' },
      /* scritte papercut (il testo è anche in HTML per gli screen reader) e finale */
      /* scritte finali (testi di Caterina, 30/09): HTML in Chunko maiuscolo, una alla volta sopra il video.
         Le ultime tre (dalla 5) sul nero con solo il logo, sotto di esso. */
      { id: 'scritta-1', file: null, cls: 'is-finale is-scritta', label: "Ah sì, ho fatto il saggio di danza polinesiana con le mie amiche", x: 50, y: 72, h: 22, w: 86, z: 76, in: 'custom' },
      { id: 'scritta-2', file: null, cls: 'is-finale is-scritta', label: "Un grazie a chi ci è stato e chi un po' meno (mamma, papà e fratelli)", x: 50, y: 72, h: 22, w: 86, z: 76, in: 'custom' },
      { id: 'scritta-3', file: null, cls: 'is-finale is-scritta', label: "Ma soprattutto grazie a Jakala e a questo magnifico team per l'opportunità che mi state dando", x: 50, y: 72, h: 22, w: 86, z: 76, in: 'custom' },
      { id: 'scritta-4', file: null, cls: 'is-finale is-scritta', label: "Non vedo l'ora di imparare e crescere con voi", x: 50, y: 72, h: 22, w: 86, z: 76, in: 'custom' },
      { id: 'scritta-5', file: null, cls: 'is-finale is-scritta is-sul-nero', label: "Buona giornata e buon lavoro a tutti", x: 50, y: 22, h: 14, w: 86, z: 76, in: 'custom' },
      { id: 'scritta-6', file: null, cls: 'is-finale is-scritta is-sul-nero', label: "Scusate il disagio", x: 50, y: 22, h: 14, w: 86, z: 76, in: 'custom' },
      { id: 'scritta-7', file: null, cls: 'is-finale is-scritta is-sul-nero', label: "Miao, arigato", x: 50, y: 22, h: 14, w: 86, z: 76, in: 'custom' },
      { id: 'logo', cls: 'is-finale', x: 50, y: 58, h: 40, r: 1, z: 77, in: 'custom' },
      { id: 'ricomincia', kind: 'bottone', cls: 'is-finale', label: 'Ricomincia', x: 50, y: 14, h: 7, w: 18, z: 78, in: 'custom' },
    ],
  },

];
