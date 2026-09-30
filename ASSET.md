# Asset da generare (45/186 pronti)

**Versione minima (30/09)**: Caterina = bambina (S02–S04), medie (S05), liceo (S06–S07), studentessa (S08–S12, S10 b1), tailleur (S10 b2–b3, S13 b1–b3), hostess (S11), felpa/amici (S13–S14), colorata (da S14 b4). Le voci barrate non servono in questa versione.

Generato dal codice: sono tutti i file che il sito si aspetta. Metti ogni PNG (sfondo trasparente) nella cartella indicata, con esattamente questo nome. Quando il file c'è, il segnaposto sparisce da solo.

La texture va in `assets/img/tex/tex-carta.jpg`.

## Interfaccia — `assets/img/ui/`

Il testo lo scrive sempre il codice (Chunko). Finché mancano restano gli stili CSS.

- [ ] ui-linguetta.png — linguetta di ogni scena sotto la barra, tela 1:2
- [ ] ui-linguetta-attiva.png — linguetta della scena corrente (gialla, bordo scuro), tela 1:2
- [ ] ui-etichetta-corta.png — cartellino del titolo fino a ~14 caratteri, tela 3:1
- [ ] ui-etichetta-lunga.png — cartellino per titoli più lunghi, tela 5:1

## S01 — `assets/img/s01/`

Pose animate: immagine ferma + fotogrammi `-1…-N` sulla stessa tela. I fotogrammi li ricava Claude dai tuoi video stop motion (5 s, camera ferma con la stessa inquadratura dell'immagine ferma, sfondo uniforme di un colore che non c'è nel soggetto, fine del movimento ≈ inizio): mettili in `sorgenti/s01/` con lo stesso nome (es. `sorgenti/s01/s01-papa-grana.mp4`).

- [ ] s01-papa-mescola.png — ferma (col cucchiaio di legno, guarda a destra)
- [ ] s01-papa-mescola-1…N.png — fotogrammi
- [ ] s01-papa-grana.png — ferma (grattugia il grana)
- [ ] s01-papa-grana-1…N.png — fotogrammi
- [ ] s01-papa-oops.png — gomito all'indietro verso sinistra, si gira a guardare
- [ ] s01-papa-confuso.png — fermo, faccia confusa (b8)
- [ ] s01-mamma-mescola.png — ferma (col cucchiaio di legno, guarda a sinistra)
- [ ] s01-mamma-mescola-1…N.png — fotogrammi
- [ ] s01-mamma-confusa.png — ferma, faccia confusa (b8)
- [ ] s01-mamma-drop.png — extra (pandeiro che le scappa di mano): se è la posa giusta, usala a metà b1 tra pandeiro e mescola
- [ ] s01-mamma-oops.png — extra: pose di sorpresa; da valutare (b6/b7) o come mamma-confusa se è quella la faccia
- [ ] s01-mamma-pandeiro.png — facoltativa: se c'è, la mamma parte col pandeiro in mano e a metà b1 passa a mescola (stessa tela)
- [x] s01-bacinella.png — ferma (bacinella gialla su sgabellino)
- [ ] s01-bacinella-1…N.png — fotogrammi
- [ ] s01-scaffale.png — scaffale a tre ripiani, vuoto
- [ ] s01-ampolla-fratello-1.png — barattolo con la testa di Luana (etichetta vuota)
- [ ] s01-ampolla-fratello-2.png — barattolo con la testa di Raffaele (etichetta vuota)
- [ ] s01-barattolo-tette.png — vuoto, polvere e ragnatela (etichetta vuota)
- [ ] s01-barattolo-ricci.png — vuoto, un solo ricciolo sul fondo (etichetta vuota)
- [ ] s01-barattolo-allergie.png — pieno zeppo di polline (etichetta vuota)
- [ ] s01-barattolo-altezza.png — quasi vuoto, tacche da righello (etichetta vuota)
- [ ] s01-barattolo-bunda.png — settimo barattolo, ripiano basso al centro (etichetta vuota; testo provvisorio «BUNDA · ESAURITA»)
- [ ] s01-bolle-bacinella.png — extra: bolle da sovrapporre alla bacinella (facoltativa)
- [ ] s01-ampolla.png — ampolla dei traumi piena
- [ ] s01-ampolla-crepata.png
- [ ] s01-liquido.png
- [ ] s01-pandeiro.png — cade nella bacinella alla b1 (12vh)
- [ ] s01-note.png — (nel file da smistare si chiama `nota.png`) una nota sola: il codice la clona 4 volte (4–8vh)
- [ ] s01-scaglie.png
- [ ] s01-fumetto-1.png — coda in basso a sinistra (papà), vuoto
- [ ] s01-fumetto-2.png — coda in basso a destra (mamma), vuoto: se c'è solo `s01-fumetto.png`, il secondo è lo specchio orizzontale del primo
- [ ] s01-cate-neonata.png

## S02 — `assets/img/s02/`

Le tre culle stanno sulla stessa tela (340×507), i due certificati pure (600×403). File piccoli: vedi PROGRESSO.md.

- [x] s02-culla.png — vuota
- [x] s02-culla-piena.png — con la neonata dentro
- [x] s02-culla-piena-vomito.png
- [ ] s02-cartellino-caterina.png — vuoto, testo scritto dal codice
- [ ] s02-cartellino-maria.png — vuoto, testo scritto dal codice
- [x] s02-certificato-virgola.png — testo già nell'immagine: «Caterina Maria, Cozzoli — nata a Milano alle ore 14:15 il 20/08/2002»
- [x] s02-certificato-no-virgola.png — stessa tela, senza la virgola
- [x] s02-virgola.png — la virgola da sola; posizione misurata sul certificato (`dx`/`dy` di `virgola` in js/scenes.js)
- [ ] s02-fumetto.png — vuoto, testo scritto dal codice
- [x] s02-punto-domanda.png

## S03 — `assets/img/s03/`

Alla b4 Caterina usa `s05-cate-medie` (sezione S05): stessa immagine delle due scene.

- ~~s03-cate-artista.png~~ — non serve nella versione minima
- [x] s03-cate-bambina.png
- [x] s03-cate-ginnasta.png
- [x] s03-cate-ginnasta-fasciata.png
- [x] s03-cate-liceo.png — Caterina al liceo in abiti normali, 45vh: entra in b5 prima del judo
- [x] s03-cate-judo.png — Caterina al liceo in judogi, 45vh
- [ ] s03-cavalletto.png
- [x] s03-lente.png — oggetto da restauratrice (nel file da smistare si chiama `s03-item-restauro`: rinominalo così) (lente d'ingrandimento)
- [ ] s03-nastro.png
- [ ] s03-quadro-antico.png
- [ ] s03-tatami.png
- [ ] s03-tavolozza.png
- [ ] s03-testa-gigante.png

## S04 — `assets/img/s04/`

- [ ] s04-banda.png
- [ ] s04-cate-percussionista.png
- [ ] s04-milano.png
- [ ] s04-papa-banda.png
- [ ] s04-passanti.png

## S05 — `assets/img/s05/`

- [ ] s05-banco.png
- [ ] s05-cate-blocchi.png
- [x] s05-cate-medie.png
- [ ] s05-nuvola.png
- [ ] s05-stranezza.png — [DA DEFINIRE]

## S06 — `assets/img/s06/`

- [ ] s06-biglietto-dorato.png
- [ ] s06-bulli.png
- ~~s06-cate-maranza.png~~ — non serve nella versione minima
- ~~s06-cate-teatro.png~~ — non serve nella versione minima
- [ ] s06-leggio-coro.png
- [x] s06-mascherina.png
- [ ] s06-pagella.png
- [ ] s06-sipario.png

## S07 — `assets/img/s07/`

- [ ] s07-associazione.png — [DA DEFINIRE]
- [x] s07-casa-piccola.png
- [ ] s07-persone-associazione.png

## S08 — `assets/img/s08/`

- ~~s08-cate-cameriera.png~~ — non serve nella versione minima
- [ ] s08-monete.png
- [ ] s08-salvadanaio.png
- ~~s08-tazzine.png~~ — non serve nella versione minima
- [x] s08-vassoio.png

## S09 — `assets/img/s09/`

- [x] s09-ale.png
- [ ] s09-cartello-pronostico.png
- ~~s09-cate-felice.png~~ — non serve nella versione minima
- [x] s09-cate-studentessa.png
- [ ] s09-ex.png
- [ ] s09-libri.png
- [x] s09-maya.png
- [ ] s09-prof.png

## S10 — `assets/img/s10/`

- ~~s10-cate-designer.png~~ — non serve nella versione minima
- ~~s10-cate-diva.png~~ — non serve nella versione minima
- [ ] s10-flash.png
- [x] s10-laptop.png
- [ ] s10-parlamento.png
- [ ] s10-stelle-ue.png
- [ ] s10-tappeto-rosso.png
- [ ] s10-telefono-app.png
- [ ] s10-ui-1.png
- [ ] s10-ui-2.png
- [ ] s10-ui-3.png

## S11 — `assets/img/s11/`

- [x] s11-cani.png
- ~~s11-cate-dogsitter.png~~ — non serve nella versione minima
- [x] s11-cate-hostess.png
- [ ] s11-condominio.png
- [ ] s11-fumetto-vicini.png
- [ ] s11-luci-discoteca.png
- [ ] s11-vassoio-dispositivi.png
- [ ] s11-vicini.png

## S12 — `assets/img/s12/`

- ~~s12-cate-mediatrice.png~~ — non serve nella versione minima
- ~~s12-cate-ragazza.png~~ — non serve nella versione minima
- [ ] s12-consultorio.png
- [ ] s12-donne-bambine.png — [DA DEFINIRE]
- [ ] s12-fumetti-lingue-1.png
- [ ] s12-fumetti-lingue-2.png
- [ ] s12-fumetti-lingue-3.png
- [ ] s12-insulti.png — [DA DEFINIRE]
- [ ] s12-ospedale.png

## S13 — `assets/img/s13/`

Sticker: vedi la sezione **Sticker** in fondo. Contenuti dei fogli cliccabili: sezione **Media S13**.

- [x] s13-abilicity-logo.png — file fornito da Caterina
- [ ] s13-amico-1.png
- [ ] s13-amico-2.png
- [ ] s13-amico-3.png
- [ ] s13-amico-4.png
- [ ] s13-avversita-1.png — [DA DEFINIRE]
- [ ] s13-avversita-2.png — [DA DEFINIRE]
- [ ] s13-avversita-3.png — [DA DEFINIRE]
- [ ] s13-badge-mediatrice.png
- [ ] s13-biglietti.png — biglietti da visita
- [ ] s13-busta-borsa.png
- [x] s13-cate-tailleur.png — S10 b2–b3 e S13 b1–b3 (con la corona)
- [x] s13-cate-felpa.png — S13 b4–b8 e b11–b12 (grigia), S14 b2–b3
- [x] s13-cate-amici.png — S13 b9–b10
- ~~s13-cate-fase-1.png~~ — non serve nella versione minima
- ~~s13-cate-fase-2.png~~ — non serve nella versione minima
- ~~s13-cate-fase-3.png~~ — non serve nella versione minima
- ~~s13-cate-hyperfocus.png~~ — non serve nella versione minima
- [ ] s13-computer.png — sullo schermo un paesaggio a blocchi generico
- [x] s13-corona.png — alloro
- [ ] s13-libri.png
- [ ] s13-mamma-busto.png
- [ ] s13-nuvoletta-genitori.png — nuvoletta vuota
- [ ] s13-nuvoletta-grigia.png — piove un po’
- [ ] s13-papa-busto.png
- [ ] s13-problema-1.png — [DA DEFINIRE]
- [ ] s13-problema-2.png — [DA DEFINIRE]
- [ ] s13-progetto-finale.png
- [ ] s13-spritz.png
- [ ] s13-sveglia.png
- [ ] s13-telefono-notifiche.png — schermo libero per lo sticker e il badge (HTML)

## S14 — `assets/img/s14/`

- [ ] s14-bici.png
- ~~s14-cate-corsa.png~~ — non serve nella versione minima
- [x] s14-cuore.png
- ~~s14-maya-bacio.png~~ — non serve nella versione minima
- [x] s14-maya-fronte.png — Maya vista di fronte
- [ ] s14-mulino.png
- [x] s14-prato.png
- [ ] s14-tulipani.png

- [x] s14-cate-spalle.png — Caterina a colori di spalle che corre via (S14 b4)
- [x] s14-ale-spalle.png — Ale di spalle che corre via
- [x] s14-maya-spalle.png — Maya di spalle che corre via

## S15 — `assets/img/s15/`

- [ ] s15-carta-in-mano.png — carta collezionabile inventata, nessun Pokémon vero
- ~~s15-cate-base.png~~ — non serve nella versione minima
- [x] s15-cate-colorata.png — da S14 b4 alla fine
- [ ] s15-ciondolo-carta.png
- [ ] s15-ciondolo-cedro.png
- [ ] s15-ciondolo-cuore.png
- [ ] s15-ciondolo-forchetta.png
- [ ] s15-ciondolo-gamepad.png
- [ ] s15-ciondolo-judo.png
- [ ] s15-ciondolo-microfono.png
- [ ] s15-ciondolo-moschettone.png
- [ ] s15-ciondolo-nota.png
- [ ] s15-ciondolo-scintilla.png
- [ ] s15-ciondolo-tavolozza.png
- [ ] s15-ciondolo-tv.png — una sola tv generica (Glee e Futurama)
- [ ] s15-ciondolo-zampa.png
- [ ] s15-foto-cibo-1.png
- [ ] s15-foto-cibo-2.png
- [ ] s15-foto-cibo-3.png
- [ ] s15-gattino.png
- [ ] s15-parete-arrampicata.png
- [ ] s15-telefono-dating.png

## S16 — `assets/img/s16/`

Canzoni e video: sezione **Musica** in fondo.

- [ ] s16-video-poster.jpg — fotogramma fermo del video (si vede se il video non parte)
- [x] s16-logo.png
- [ ] s16-play.png — grande bottone play di carta
- [ ] s16-ricomincia.png
- [ ] s16-telefono-grande.png — cornice di telefono di carta orizzontale, schermo vuoto e trasparente

## Sticker — `assets/img/sticker/`

Gli sticker dei loghi li carica solo Caterina, dalle pagine ufficiali; Claude non li disegna, non li genera e non li scarica. Il sito li mostra piccoli e come sono (niente rotazioni, ombre, texture o ritagli; non entrano nel moltiplicarsi della S13).

- [ ] sticker-linkedin.png — sullo schermo del telefono (S13 b6)
- [x] sticker-figma.png — S13 b10
- [x] sticker-claude.png — S13 b10
- [x] sticker-miro.png — S13 b10
- [x] sticker-antigravity.png — S13 b10

## Musica — `assets/musica/`

Solo file forniti da Caterina (mai brani scaricati o in streaming).

- [x] canzone-5.mp3 — S05
- [x] canzone-1.mp3 — S14 (Olanda), dalla b2
- [x] canzone-2.mp3 — S15 fino a S16 b1
- [ ] video-3.mp4 — S16, il saggio nello schermo del telefono (parte solo al clic su play)
- [x] canzone-4.mp3 — S13 b13, accelera e si taglia sul nero

## Media S13 — `assets/media/s13/`

Contenuti dei fogli che si aprono al clic (per ora segnaposto; nomi da decidere quando ci sono i file).

- [ ] computer → esperimento Minecraft
- [ ] busta → mail della borsa e schermate dell'app per maranza
- [ ] logo Abilicity → link all'articolo
- [ ] progetto finale → app per daltonici e la gag

## Non assegnati — `assets/img/non-assegnati/`

Copie dal portfolio (`portfolio-caterina/public/images/`), in attesa di un posto:
- `cane/`: canecane zampa (Maya che saluta con la zampa), stato1cane, stato1xcon coda, stato2concoda (Maya di spalle), coda, coda2 (code staccate: servirebbero a far scodinzolare Maya), premietto cane (osso), scaffale (mensola), tavolo.
- `avatar/`: le altre espressioni del logo-faccia (alto-destra, curiosa con occhiali, felice, fischia, frontale, in-basso-a-destra, lato-sinistra, popcorn, sbatti, sotto-centro) e i tre hover con fumetto «hi! / ciao! / olá!». Idee: «ciao!» come cartello di S00; «sbatti» per il grigio di S13; «felice» per il logo finale.

