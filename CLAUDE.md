# Buttercup — istruzioni per Claude Code

Sito scrollytelling personale di Caterina Maria Cozzoli (UX/UI designer), per presentarsi nel nuovo lavoro. Racconta la sua vita a scene: un personaggio papercut al centro che cambia età, vestiti e contesto mentre si scorre, con oggetti e figure che le gravitano attorno. Tono ironico e autentico.

## Regole di lavoro

- **Per una scena nuova o un cambio di struttura**: prima proponi un piano e aspetta l'ok. Per correzioni piccole e puntuali procedi direttamente.
- **Non inventare e non riscrivere i testi dei sottotitoli.** Li scrive Caterina in un processo separato. Se un testo manca, lascia un segnaposto e chiedi.
- Dopo ogni modifica, di' come verificarla (quale scena, quale battuta, cosa deve succedere scorrendo avanti e indietro).
- Tieni aggiornato `implementation_plan.md` quando cambia l'architettura.
- Lavora solo dentro questa cartella.
- **Nei testi lasciati `[DA DEFINIRE]` non inventare niente**: resta il segnaposto (anche in portoghese: `[A DEFINIR]`).
- **Immagini, voce, canzoni e video li fornisce Caterina**: finché mancano, solo segnaposto. Non creare, disegnare o scaricare immagini, musica o video.
- I testi dei sottotitoli devono coincidere con `script-voiceover.md`. Le traduzioni PT-BR sono proposte in `testi-pt-br.md` (da approvare) e copiate in `js/i18n.js`.
- `sorgenti/` (video stop motion) e `verifiche/` (screenshot di controllo) sono in `.gitignore`: non cancellarli.

## Stack

- HTML/CSS/JS puro, nessun framework, nessun build step. Deploy su GitHub Pages.
- Da CDN, versioni fisse: GSAP 3.12.5 + ScrollTrigger, Lenis 1.3.26. Non cambiarle senza chiedere.
- Skill disponibile: `/gsap-scrolltrigger` (e le altre di gsap-skills).
- Server locale: `python3 -m http.server 8000` → http://localhost:8000

## Struttura

```
index.html
css/style.css
js/scenes.js     ← SOLO dati: testi delle battute, file audio, metadati di ogni scena
js/i18n.js       ← lingue: testi dell'interfaccia e traduzioni portoghesi (bozza da approvare)
js/main.js       ← motore: Lenis, ScrollTrigger, interruttori, costruzione delle scene
assets/img/sNN/  ← immagini della scena NN (es. assets/img/s01/s01-bacinella.png)
assets/img/tex/  ← texture (tex-carta.jpg)
assets/img/ui/   ← linguette ed etichette della barra (se mancano: stili CSS)
assets/img/sticker/ ← sticker dei loghi
assets/musica/   ← canzone-1/2/4.mp3, video-3.mp4 (forniti da Caterina)
assets/vo/       ← voiceover, un file per battuta: sNN-bN.mp3 (portoghese in assets/vo/pt-br/)
testi-pt-br.md   ← bozza di traduzione da far rivedere a Caterina (poi copiata in js/i18n.js)
assets/fonts/    ← Chunko-Bold.otf
assets/media/sNN/ ← contenuti dei fogli (approfondimenti, barattoli dei fratelli)
sorgenti/sNN/    ← video di Caterina da cui si ricavano i fotogrammi (il sito non li carica; .gitignore)
verifiche/       ← screenshot di controllo per data (.gitignore)
ASSET.md · bozza-scene.md · script-voiceover.md · PROGRESSO.md · README.md
```

## Architettura delle scene

- **Palco fisso** (`#stage`, fisso a tutto schermo) con uno strato (`.layer`) per scena, gli sfondi impilati e una Caterina unica (`#character`); ogni scena ha una `<section>` invisibile che dà solo la lunghezza di scroll (1 unità di timeline = 100vh), e una timeline `scrub: 0.8`. Così al cambio scena si vedono insieme la scena che cade e quella che entra. Le scene 0 e 2–16 sono costruite dal motore a partire da `scenes.js`; la scena 1 è HTML a mano. Dettagli in `implementation_plan.md`.
- **Animazioni a fotogrammi (sistema unico)**: ogni gesto ha l'immagine ferma senza numero (`s01-papa-grana.png`) e i fotogrammi numerati sulla stessa tela (`s01-papa-grana-1.png … -N.png`). Nei dati della scena: `anims: [{ file, frames, fps, da, a }]`; il loop gira a tempo reale dalla battuta `da` alla battuta `a` (esclusa, `null` = fino alla fine). Lo stesso fotogramma va su tutte le `<img data-anim="file">` (livello a colori e sagoma nera). `frames: 0`, fotogrammi mancanti, fuori dal loop, Calma o riduci movimento = immagine ferma. I fotogrammi si ricavano con ffmpeg dai video stop motion di Caterina (5 s, camera ferma, sfondo uniforme, in `sorgenti/`).
- Le battute sono label nella timeline (`b0`, `b1`, …). Le soglie si calcolano come `tl.labels.bN / tl.duration()`, mai a mano.
- Sottotitoli e voce seguono `tl.progress()` (la timeline animata), non `self.progress` dello ScrollTrigger.
- Voce: solo scorrendo in avanti; ferma sempre il file precedente prima di avviare il nuovo; audio sbloccato al primo clic o tasto. File mancante = silenzio, nessun errore.
- Controlli in alto a destra: lingua IT · PT, interruttori Sottotitoli (default acceso), Voce (default spento), Musica (default acceso), Calma (default spento: acceso ferma tutti i movimenti continui). Nessun altro interruttore. Stato in localStorage. Sempre su due righe: lingua a sinistra, levette a coppie (Sottotitoli · Voce / Musica · Calma).
- **Musica**: solo i file di Caterina in `assets/musica/` (canzone-1, canzone-2, canzone-4, video-3); dati `music` delle scene (tratti di scroll, volumi, taglio). Parte dopo il primo clic/tasto e solo scorrendo in avanti, sotto la voce scende a 0.2, si ferma tornando indietro prima della sua scena. File mancante = silenzio, nessun errore.
- **Caterina** la guida solo la scena corrente: ogni scena ha la sua timeline di Caterina (`cateTl`) e lo stato di partenza (`cateStart`), così salti e scroll all'indietro danno sempre lo stesso risultato.
- Telefono in verticale: cartellino «Girami» chiudibile (non blocca il sito).
- **Portoghese brasiliano**: le traduzioni si inseriscono in `js/i18n.js` solo dopo che Caterina ha approvato `testi-pt-br.md`. Stessa regola dei testi italiani: non inventarle né riscriverle da solo.
- Movimenti continui (mescolare, dondolare) sono tween a tempo reale `repeat: -1` attivati/messi in pausa in base alla battuta corrente, non dentro lo scrub.
- Scorrendo all'indietro tutto deve riavvolgersi.

## Regole di layout (imparate dai bug)

- **Varianti sovrapposte, mai impilate**: pose alternative e livelli (colore/sagoma, vetro/liquido/crepa) stanno in un contenitore `position: relative` con `aspect-ratio`, ogni variante `position: absolute; inset: 0`.
- **Le classi animate vanno sul `.img-wrap`, non sull'`<img>`**, così immagine e segnaposto si comportano allo stesso modo.
- **Elementi con un testo** (cartellini, fumetti, etichette): l'immagine è il supporto vuoto e il testo lo scrive il codice sopra. Il fondino di carta dietro il testo serve solo finché si vede il segnaposto (classe `.is-loaded` sull'img-wrap quando l'immagine c'è). Eccezione: con `labelSeManca` (es. `s02-virgola`) la scritta c'è solo finché manca l'immagine.
- **Segnaposto**: riempiono tutto il contenitore (100% × 100%) e mostrano il nome del file atteso. Con i soli segnaposto la scena deve già leggersi correttamente.
- **Mai due tween sulla stessa proprietà dello stesso elemento**: wrapper esterno per la timeline, contenitore interno per i movimenti a tempo reale.
- **Entrate con `autoAlpha: 1` solo nel «da» di un `fromTo`: usare `fromToIn()`** (main.js). Altrimenti, dopo un riavvolgimento, un salto di scroll oltre l'entrata lascia l'elemento invisibile.
- **Pavimento** a circa il 12% dal fondo: personaggi e oggetti a terra poggiano lì.
- **Personaggi dimensionati in altezza** (genitori ~55vh, con max su schermi larghi), non in larghezza, così pose diverse restano alla stessa scala.
- Il personaggio centrale (Caterina) vive in un contenitore globale: le sue versioni si danno il cambio con dissolvenza, e il contenitore si muove in modo fluido (cammina, corre, cade, si rialza) secondo il campo `move` delle battute.
- Ogni cosa citata nel testo si materializza come fumetto, oggetto o sagoma.
- Barra di avanzamento di carta fissa in alto, con i segni delle scene cliccabili.
- Approfondimenti: un bottone di carta per scena (in basso a sinistra, fissato con una puntina) che ferma lo scroll e apre un foglio con foto, video o audio di quel periodo. Contenuti in `assets/media/sNN/`.

## Stile visivo

- Gli asset sono **carta vera fotografata** (cartoncino con grana, ombre reali, spessore). Niente colori piatti "digitali": sopra ogni campitura, cartiglio, bottone o coriandolo va la texture `assets/img/tex/tex-carta.jpg` in `mix-blend-mode: multiply`.
- Bordi strappati irregolari (non a sega), con "anima" bianca della carta e ombra morbida.
- Colori (dal portfolio di Caterina):
  - viola `#7a35ee` · lavanda `#d4cdff`
  - giallo `#fed728` · giallo chiaro `#ffeba2`
  - carta `#fcfbfa` · inchiostro `#212529` · corallo `#ff5f6d`
- Font: **Chunko** (titoli, bottoni) da `assets/fonts/Chunko-Bold.otf`; **Onest** (sottotitoli e testi) da Google Fonts. Niente serif.

## Accessibilità

- `prefers-reduced-motion`: niente animazioni né smooth scroll, scene statiche con tutti i testi leggibili.
- Navigabile da tastiera, focus visibile, sottotitoli in `aria-live="polite"`.

## Vincoli non negoziabili

- **Nessuna musica o audio protetto da copyright**, mai: niente brani veri, niente download, niente streaming.

## Scene 2–16, titolo e finale

La bozza completa, con l'ordine di lavoro, è in `bozza-scene.md`. S13–S16 (riscritte il 30/09): S13 Da dicembre a maggio (bugiardino: montaggio che si somma, sottotitolo a foglietto illustrativo, cloni e nero finale), S14 L'Olanda (dal nero ai colori, Maya), S15 Cosa ama Caterina (ciondoli alla cintura, si riveste di colore), S16 Il saggio (telefono a tutto schermo, video al clic, scritte, logo, Ricomincia). Decisioni: una sola tv generica per Glee e Futurama; fumetti-lingua di S12 «Hola», «Olá», «Salam»; il segno della barra porta all'inizio della scena dopo il cambio.
- S02 (riscritta il 30/09): niente sportello, impiegato, modulo né orologio. Culla vuota → piena (la neonata globale sparisce) → piena col vomito (b2); cartellini che volano nel certificato (b3); la virgola `s02-virgola` sopra quella del certificato cade e vola via mentre il certificato passa a `-no-virgola`; fumetto fuori campo alla b5. Posizione della virgola: `dx`/`dy` dell'elemento `virgola` in `js/scenes.js`, da misurare sull'immagine vera.
- S16: il video parte da solo alla b3; 7 scritte HTML in maiuscolo una alla volta; dalla 5ª nero e solo il logo; poi Ricomincia.
- **Versione minima** (MINIMO.md): Caterina per scena e oggetti addosso come in PROGRESSO.md; `fitFigure()` dimensiona le immagini sulla figura (Caterina sempre, oggetti con `fig: true`). Asset mancante = elemento invisibile (niente segnaposto).

## Scena 1 — La ricetta

Fonte: sezione S01 di `bozza-scene.md` e di `ASSET.md`, con le decisioni del 30/09 qui sotto (dove differiscono, vale questa tabella). HTML a mano in `index.html`, timeline in `main.js` (EXTRAS.s01), gesti in `scenes.js` (anims).

Sfondo viola a sinistra e giallo a destra, bordo strappato. Papà (Liborio) a sinistra x 30% che guarda a destra, mamma (Silvelena) a destra x 70% che guarda a sinistra, entrambi 55vh. Al centro (x 50%) la bacinella gialla su sgabellino (disegno 30vh con lo sgabello, tela 36.6vh; bordo anteriore a ~21vh dal pavimento, misurato su s01-bacinella.png): ciò che ci cade sparisce dietro il bordo. A sinistra (x 10%) lo scaffale del laboratorio a tre ripiani (50vh, proporzioni 1:2 provvisorie; ripiani a ~42/28/14vh dal pavimento, da rimisurare sull'immagine):
- ripiano alto: barattoli dei fratelli, veri `<button>` ("Luana, test 1" / "Raffaele, test 2") con etichette `TEST 1 · LUANA · 1996` e `TEST 2 · RAFFAELE · 1998`; oscillano in hover/focus, al clic aprono il foglio con foto e didascalia;
- ripiano centrale: `TETTE GRANDI · ESAURITE NEL 1996`, `CAPELLI RICCI · ESAURITI` e, sul bordo destro sporgente verso il papà, l'ampolla dei traumi (12vh);
- ripiano basso: `ALLERGIE · DOSE PER TRE`, `BUNDA · ESAURITA` (al centro, etichetta provvisoria), `ALTEZZA · ULTIME GOCCE`.
I barattoli degli ingredienti non sono cliccabili: `role="img"` con l'etichetta come testo alternativo, oscillano solo in hover. Tutti i barattoli sono visibili per tutta la scena; con Calma o riduci movimento non oscillano.

| Battuta | Testo | Azione |
|---|---|---|
| b0 | — | genitori sagome nere, entrambi fermi sulla posa mescola; bacinella (loop continuo), scaffale e barattoli già visibili |
| b1 | Bossa nova. | il pandeiro cade nella bacinella e sparisce dietro il bordo (niente chitarra, niente note) |
| b2 | Parmigiano reggiano. | il papà grattugia il grana (posa grana, in loop); scaglie dalla sua parte (x ~40%) alla bacinella; la mamma resta ferma su mescola |
| b3 | Tanti «buongiorno» e «buona giornata». | il papà continua a grattugiare; fumetto papà «Buongiorno!» (x 36%), fumetto mamma «Buona giornata!» (x 64%), poi cadono nella bacinella |
| b4 | Questi erano gli ingredienti per creare una bambina serena. | entrambi mescolano (in loop) |
| b5 | Ma Silvelena e Liborio, che non avevano avuto vite semplici… | le sagome si staccano come adesivi e compaiono i colori; leggera inclinazione uno verso l'altro (resta) |
| b6 | …aggiunsero per sbaglio un ingrediente in più. | il papà passa alla posa oops (gomito all'indietro verso sinistra): urta l'ampolla, che si crepa; la mamma continua a mescolare |
| b7 | Una vagonata di traumi. | il liquido scende e scopre «UNA VAGONATA DI TRAUMI»; la bacinella trema; la mamma si ferma (immagine ferma) |
| b8 | E così nacque Caterina. | entrambi in posa confusa guardano la neonata che sale dalla bacinella con rimbalzo elastico; coriandoli di carta |

File in `assets/img/s01/` (tutti .png, sfondo trasparente). Con fotogrammi (`-1…-N` sulla stessa tela): s01-papa-mescola, s01-papa-grana, s01-mamma-mescola, s01-bacinella. Immagini singole: s01-papa-oops, s01-papa-confuso, s01-mamma-confusa, s01-scaffale, s01-ampolla-fratello-1, s01-ampolla-fratello-2, s01-barattolo-tette, s01-barattolo-ricci, s01-barattolo-allergie, s01-barattolo-altezza, s01-ampolla, s01-ampolla-crepata, s01-liquido, s01-pandeiro, s01-scaglie, s01-fumetto-1 (coda in basso a sinistra, papà), s01-fumetto-2 (coda in basso a destra, mamma), s01-cate-neonata. Non esistono più: pentolone, carrello, chitarra, note, grattugia della mamma, bolle e schiuma separate.
