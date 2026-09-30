# Versione minima (demo) — cosa serve davvero

Regola: una Caterina per età + al massimo un oggetto per scena. Il testo racconta il resto.
Tutto ciò che non è in questa lista, se manca, NON si vede (niente riquadri segnaposto).

## Da generare (11 + 2 se Maya e Ale non sono nel portfolio)

| # | File | Scena | Tela · altezza | Prompt |
|---|---|---|---|---|
| 1 | 5 versioni di Caterina adulta | vedi sezione «Caterina adulta: 5 versioni» in fondo | 2:3 · 50vh | — |
| 2 | s03-testa-gigante.png | S03 b2 (Art Attack) | 1:1 · 40vh | prompt-vizcom/s03.md |
| 3 | s04-cate-percussionista.png | S04 | 2:3 · 35vh | prompt-vizcom/s04.md |
| 4 | s06-mascherina.png | S06 b4 (Covid) | 1:1 | prompt-vizcom/s06.md |
| 5 | s07-casa-piccola.png | S07 | 1:1 | prompt-vizcom/s07.md |
| 6 | s08-vassoio.png | S08 | 1:1 | prompt-vizcom/s08.md |
| 7 | s09-maya.png | S09 + S14 | portfolio o prompt-vizcom/s09.md |
| 8 | s09-ale.png | S09 + S14 | portfolio o prompt-vizcom/s09.md |
| 9 | s10-laptop.png | S10 (Figma) | 1:1 | prompt-vizcom/s10.md |
| 10 | s11-cani.png | S11 b5 (dogsitter) | 1:1 | prompt-vizcom/s11.md |
| 11 | s12-ospedale.png | S12 | 1:1 | prompt-vizcom/s12.md |
| 12 | s13-corona.png | S13 b1 (laurea) | 1:1 | prompt-vizcom/s13.md |
| 13 | s14-prato.png | S14 | 3:1 | prompt-vizcom/s14.md |
| 14 | s14-cate-spalle.png | S14 b4, corre via | 2:3 · 50→10vh | prompt-vizcom/s14.md |
| 15 | s14-ale-spalle.png | S14 b4, corre via | 2:3 · 55→11vh | prompt-vizcom/s14.md |
| 16 | s14-maya-spalle.png | S14 b4, corre via | 1:1 · 18→4vh | prompt-vizcom/s14.md |

Nota nomi: il file «cate-artista» (o s03-cate-artista) che arriva in da-smistare è la TESTA GIGANTE di Art Attack → rinominalo s03-testa-gigante.png.

Se avanza tempo, in quest'ordine: s03-tavolozza, s10-stelle-ue, s15-ciondolo-cuore, s15-ciondolo-nota, s15-ciondolo-zampa, s14-tulipani, s06-pagella.

## Già pronti o da mettere in da-smistare (li hai già fatti)
S01 completa (papà, mamma, scaffale, barattoli, ampolle, fumetto, nota, neonata, video), S02, S03 (bambina, ginnasta, fasciata, liceo, judo, lente), s05-cate-medie.

## Da fornire tu
- video-3.mp4 (S16, indispensabile per il finale)
- canzone-4.mp3 (S13) — facoltativa
- canzone-5.mp3 (S05, Creep) — facoltativa
- loghi sticker e Abilicity — facoltativi

## Risolti col codice (nessuna immagine)
- Caterina: bambina S02–S04, medie S05, liceo S06–S07, poi le 5 versioni adulte (vedi sotto) da S08 a S16.
- S13 fasi 2 e 3: la stessa adulta con filtro grigio CSS.
- S13 busti dei genitori: s01-papa-faccia / s01-mamma-faccia.
- S02 cartellini, S03 tatami, S16 telefono e play, UI linguette/etichette: CSS + testo Chunko.
- s02-fumetto = s01-fumetto; s01-mamma-confusa = s01-mamma-oops.

## Caterina adulta + oggetti addosso/attorno
La versione adulta della scena (vedi «5 versioni» qui sotto), 50vh, x 50%. Ogni "mestiere" è la base + un oggetto posizionato dal codice (layer sopra la base, entra con un piccolo pop di carta, esce a fine scena).

| Scena | Oggetto | Dove rispetto a Caterina | Altezza |
|---|---|---|---|
| S08 cameriera | s08-vassoio | sulla mano destra, all'altezza del gomito (≈ 55% della sua altezza), sporge a destra | 10vh |
| S09 studentessa | s09-libri (se c'è) | stretti al petto / sotto il braccio sinistro | 10vh |
| S10 designer | s10-laptop | a terra accanto a lei a destra, o in mano davanti alla pancia | 12vh |
| S10 diva | s10-flash + occhiali (se ci sono) | flash attorno, 2–3 copie sparse | 8vh |
| S11 hostess/dogsitter | s11-cani | a terra ai suoi piedi, a destra | 14vh |
| S07 casa stretta | s07-casa-piccola | DIETRO di lei, a terra, x 50%: parte enorme (85vh) e con lo scroll della b1 scende a 18vh (più piccola di lei) | 85 → 18vh |
| S12 mediatrice | s12-ospedale | sfondo dietro di lei, a sinistra | 35vh |
| S13 laurea | s13-corona | in testa (centrata sulla testa, leggermente inclinata) | 8vh |
| S15 cose amate | ciondoli (se ci sono) | appesi alla vita, uno alla volta | 4vh |

Misura la posizione di testa, mani e vita sull'immagine vera di ciascuna versione e ancora gli oggetti a quei punti (non a coordinate fisse dello schermo).


## Caterina adulta: 6 versioni (sostituiscono s13-cate-fase-1/2/3 e le versioni per mestiere)

| File | Com'è | Dove si usa |
|---|---|---|
| s09-cate-studentessa.png | inizio università, prima della laurea | base con oggetti: S08 (vassoio), S09, S10 b1 (laptop), S12 (ospedale dietro) |
| s13-cate-amici.png | casual, un po' meno in sbatti | S13 b9–b10 (amici, impara cose) |
| s13-cate-tailleur.png | laurea, tailleur | S10 b2–b3 (Parlamento, diva); S13 b1–b3 (laurea + corona, magistrale, borsa): resta ferma mentre gli oggetti cambiano attorno |
| s11-cate-hostess.png | hostess, sorriso finto | S11 tutta la scena (hostess, discoteche, Ploom, dogsitter + cani) |
| s13-cate-felpa.png | felpa, in sbatti | S13 b4–b8 (esami, Abilicity, networking, mediatrice, master in ritardo); S13 b11–b12 con filtro grigio CSS progressivo; S14 b2–b3 ancora grigia che schiarisce |
| s15-cate-colorata.png | a colori, bene, ripresa | S14 b4 («tutto è tornato a colori», cambio con pop, poi si gira: s14-cate-spalle e corre via), S15 (riappare al centro, con i ciondoli), S16 |

Tele quadrate ~2268 px (non 2:3): l'altezza in vh va applicata alla FIGURA (bounding box dei pixel non trasparenti), non alla tela, così tutte e 6 risultano alte uguali: i cambi avvengono sul posto, senza salti.
Non servono più: s13-cate-fase-1/2/3, s13-cate-hyperfocus, s08-cate-cameriera, s09-cate-*, s10-cate-*, s11-cate-dogsitter, s12-cate-*, s14-cate-corsa, s15-cate-base.


## S16 scritte finali
Non più in paper cut: testo HTML in Chunko **bold nero**, sopra il video (con leggera ombra chiara per leggibilità). Niente immagini s16-scritta-*.
