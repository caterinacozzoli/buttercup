# Buttercup

Presentazione personale di Caterina Maria Cozzoli (UX/UI designer): un racconto a scene guidato dallo scroll. Al centro c'è Caterina, un personaggio di carta che cresce e cambia mentre la sua vita le gira attorno. In italiano e in portoghese brasiliano, con sottotitoli, voce e musica.

## Come aprirlo

Serve un server locale (i file audio e le immagini non si caricano aprendo `index.html` col doppio clic):

```
cd buttercup
python3 -m http.server 8000
```

Poi apri http://localhost:8000. Nessun build, nessuna installazione: HTML, CSS e JavaScript semplici, con GSAP 3.12.5 + ScrollTrigger e Lenis 1.3.26 da CDN.

## Cartelle

```
index.html             pagina (palco fisso, controlli, barra, scena 1 scritta a mano)
css/style.css          stile
js/scenes.js           dati delle scene: battute, testi, elementi, movimenti, musica
js/i18n.js             testi dell'interfaccia e traduzioni in portoghese
js/main.js             motore: scroll, timeline, Caterina, voce, musica, approfondimenti
assets/img/sNN/        immagini della scena NN
assets/img/ui/         linguette ed etichette della barra in alto
assets/img/sticker/    sticker dei loghi
assets/img/tex/        texture della carta (tex-carta.jpg)
assets/vo/             voce italiana, assets/vo/pt-br/ quella portoghese
assets/musica/         canzoni e video
assets/media/sNN/      foto e video che si aprono al clic (approfondimenti)
assets/fonts/          Chunko-Bold.otf
sorgenti/              video stop motion da cui si ricavano i fotogrammi (non va online)
verifiche/             screenshot di controllo (non va online)
```

Documenti: `bozza-scene.md` (cosa succede in ogni scena, la fonte), `script-voiceover.md` (i testi della voce), `ASSET.md` (tutti i file da preparare, con nome e cartella), `testi-pt-br.md` (traduzioni da approvare), `PROGRESSO.md` (a che punto siamo), `CLAUDE.md` (regole per Claude Code).

## Immagini

- PNG con sfondo trasparente, nella cartella della scena, con **esattamente** il nome indicato in `ASSET.md` (es. `assets/img/s02/s02-culla.png`). Quando il file c'è, il segnaposto colorato sparisce da solo.
- Le varianti di uno stesso oggetto (culla vuota / piena, certificato con / senza virgola) vanno sulla **stessa tela**, così si sostituiscono senza salti.
- Cartellini, fumetti ed etichette: l'immagine è il supporto vuoto, il testo lo scrive il codice (così si traduce).
- Pose animate: immagine ferma senza numero più i fotogrammi `-1.png … -N.png` sulla stessa tela; il numero di fotogrammi si imposta in `js/scenes.js` (`frames`).

## Voce

Un file per battuta: `assets/vo/sNN-bN.mp3` in italiano, `assets/vo/pt-br/sNN-bN.mp3` in portoghese. Parte dopo il primo clic o tasto, con l'interruttore VOCE. I testi dei sottotitoli sono quelli di `script-voiceover.md`; se un file manca resta il silenzio.

## Musica

Solo file forniti da Caterina, in `assets/musica/`: `canzone-1.mp3` (S14), `canzone-2.mp3` (S15–S16), `canzone-4.mp3` (S13), `video-3.mp4` (il saggio in S16, parte al clic su play). Interruttore MUSICA, acceso di default; suona solo scorrendo in avanti e si abbassa sotto la voce. Niente brani scaricati o in streaming.

## Sticker

I loghi (LinkedIn, Figma, Claude, Miro, Antigravity) vanno in `assets/img/sticker/`.

## Approfondimenti

Da S02 a S16 c'è un bottone di carta con la puntina; in S01 i barattoli dei fratelli, in S13 alcuni oggetti con un puntino che pulsa. Al clic si apre un foglio (Esc o X per chiudere) con foto, video o audio da `assets/media/sNN/`; per ora sono segnaposto.

## Accessibilità

Navigabile da tastiera, sottotitoli letti dagli screen reader, testi di ogni battuta nella pagina. L'interruttore CALMA ferma tutti i movimenti continui; con «riduci movimento» del sistema le scene sono ferme, una per battuta.

## Impaginare a mano (solo in locale)

Su `localhost`: **Cmd+K** accende/spegne la modalità «sposta». Clic e trascina un elemento (Maiusc+clic per sceglierne più d'uno, frecce per i ritocchi); **Cmd+G** passa a «ridimensiona»: freccia su ingrandisce, giù rimpicciolisce (Maiusc per passi grandi); **Cmd+R** copia negli appunti le coordinate degli elementi spostati, **T** (o Cmd+T dove il browser lo permette) quelle di tutti gli elementi visibili della scena, nelle unità di `js/scenes.js` (x = centro in %, y = centro in % dal fondo; per Caterina x e piedi). Incollale in chat e le riporto nel codice. Ricaricando la pagina tutto torna com'era. Codice: `js/sposta.js` (online non si attiva).
