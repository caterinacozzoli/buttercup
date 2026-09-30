# PROGRESSO — brutta con segnaposto

Checklist da `bozza-scene.md`. Una riga per punto; sotto ogni punto spuntato, una riga di note.

- [x] 1. Scena 1 — correzioni e allineamento alle misure di questo file
  - Misure della bozza (mamma x24, papà x76, pentolone 32vh, carrello x91 26vh, ampolla 12vh, chitarra 15vh, note 8vh fino al 75%, scaglie 6vh dalla grattugia, fumetti 14vh a x30/x70 al 60%); scroll per battuta 60·60·60·90·90·90·90·60·90vh; ritmo 0–20/20–80/80–100; il nero si stacca col clip-path diagonale; la neonata ora è la Caterina globale.
- [x] 2. Barra di avanzamento
  - Striscia di carta 1.2vh in alto, riempimento con lo scroll di tutto il sito, un `<button>` per scena (S01–S16) che salta con Lenis all'inizio della scena dopo il cambio; interruttori subito sotto.
- [x] 3. S00 — Titolo "Ciao"
  - Cartello "Ciao" (Chunko, carta) che oscilla, in uscita vola via in alto a destra mentre il foglio bianco sfuma e sotto compare la scena 1.
- [x] 4. Sistema approfondimenti (bottone + foglio + segnaposto)
  - Un bottone di carta con puntina per S02–S16 (x 5%, al 9%, 9vh), spunta a b1 e cade al cambio scena; `<dialog>` nativo 70vw×70vh, Lenis fermo, Esc/X chiudono e il focus torna al bottone; solo S02 ha "clicca per vedere il momento".
- [x] 5. Personaggio centrale che si muove (campo `move`)
  - `#character` globale: posizione/altezza via variabili CSS, cambio immagine in dissolvenza, cammina/corre/saltella/cade/capriola/gira/inclina/respiro/danza/nasce/sparisce, marcia/barcolla/trema a tempo reale; stato simulato in ordine per riavvolgere bene.
- [x] 6. S02 — riscritta il 30/09
  - Culla vuota → piena (la neonata sparisce dentro) → piena col vomito con sobbalzo (b2); CATERINA + MARIA; cartellini che volano nel certificato (b3); la virgola si stacca, cade a terra e vola via mentre il certificato passa a senza virgola; certificato 30→38vh (b4); fumetto fuori campo (b5); escono (b6); Caterina bambina e punto di domanda (b7). Tolti sportello, impiegato, modulo, orologio.
- [x] 7. S03
  - Artista (cavalletto, tavolozza), testa gigante, ginnasta con capriola + nastro che volteggia e cade con lei, alle medie (s05-cate-medie, 40vh) con lente e quadro antico, judo al liceo (45vh) su tatami con caduta. Aggiornata il 30/09: 450vh, niente più s03-cate-restauratrice.
- [x] 8. S04
  - Skyline lento, banda che attraversa piano verso destra, papà in marcia, Caterina marcia a tempo reale e si rimpicciolisce a 28vh, passanti-sagome che si girano, coriandoli lenti; "si nasconde dietro il tamburo" è una nota [DA DEFINIRE] visibile.
- [x] 9. S05
  - Banco, stranezza [DA DEFINIRE] in orbita (passa davanti e dietro a lei), nuvola di sogno con Caterina "a blocchetti".
- [x] 10. S06
  - Maranza che entra camminando, sipario che scende, leggio, bulli-sagome che la indicano, due pagelle "3ª" e lei che si gira, mascherina, 5 biglietti PROMOSSA che piovono (l'ultimo vola via).
- [x] 11. S07
  - Casa piccola a cornice che si stringe (1→0.75) mentre lei si inclina e scende a 40vh, casa che vola via, corsa a destra, associazione [DA DEFINIRE], persone ai due lati.
- [x] 12. S08
  - Salvadanaio UNIVERSITÀ, cameriera che corre avanti e indietro due volte, vassoio con 3 tazzine in mano, 6 monete che cadono una alla volta.
- [x] 13. S09
  - Prof ed ex-sagome che scuotono la testa e si staccano come adesivi, cartello NON CE LA FARÀ che si strappa in due, libri sotto il braccio, sfondo lavanda→giallo, felice che saltella, Ale e Maya (scodinzola).
- [x] 14. S10
  - Laptop, telefono con 3 pezzi di interfaccia, telefono che vola fino al Parlamento, 12 stelle in cerchio, tappeto rosso che si srotola, diva che cammina, tre lampi.
- [x] 15. S11
  - Salto e hostess, sfondo che si scurisce, 3 luci da discoteca che oscillano, vassoio di dispositivi generici, sfondo di nuovo carta, condominio che sale con 4 vicini, fumetto «la dogsitter sudamericana», 4 cani che la trascinano.
- [x] 16. S12
  - Insulti [DA DEFINIRE], ampolla di S01 con goccia corallo fino a terra, mediatrice con 3 fumetti-lingua, ospedale, consultorio, donne e bambine [DA DEFINIRE].
- [x] 17. S13 — Da dicembre a maggio (bugiardino) — riscritta il 30/09
  - Montaggio che si somma, sottotitolo a foglietto illustrativo, 4 oggetti cliccabili, badge 1→100, sticker, cloni e nero finale (b13).
- [x] 18. S14 — L'Olanda — riscritta il 30/09
  - Dal nero: Maya che lecca lo schermo, cuore, Olanda che torna a colori, corsa nei prati.
- [x] 19. S15 — Cosa ama Caterina (ciondoli) — riscritta il 30/09
  - Cerchio giallo, Caterina che si riveste di colore, 13 ciondoli alla cintura, arrampicata, barra che brilla.
- [x] 20. S16 — Il saggio (telefono, video, scritte, logo, Ricomincia) — riscritta il 30/09
  - Telefono a tutto schermo, video al clic, scritte, e alla fine solo nero, logo e Ricomincia.

---

## Resoconto della notte (28 settembre 2026)

### Cosa ho fatto

- **Trovato all'inizio**: `scenes.js` era già stato riscritto (da una notte precedente interrotta) come elenco di dati per tutte le scene, ma `main.js` lo leggeva ancora come `SCENES.s01`: il sito era rotto. Ho tenuto quei dati e scritto il motore che li usa.
- **Cambio di architettura** (descritto in `implementation_plan.md`): non più una `<section>` pinnata con dentro la scena, ma un **palco fisso** con uno strato per scena, sfondi impilati e Caterina unica, più una `<section>` invisibile per scena che dà solo la lunghezza di scroll. Serve perché il cambio scena della bozza chiede di vedere insieme la scena che cade e quella che entra; con i pin, tra una scena e l'altra passavano 100vh di pagina vuota. Ogni scena ha comunque la sua timeline con scrub 0.8 e le battute come label.
- **Motore generico** in `main.js`: posizioni/misure della bozza (x in %, "a terra" = 12%, altezze in vh), movimenti standard (cade, spunta, entra/esce, si stacca, sfuma, vola via, piove, sale/scende, srotola, strappa, orbita), cambio scena (tutto cade come carta, lo sfondo sfuma), tempo reale solo per la scena corrente, orbite, segnaposto col nome del file e `[DA DEFINIRE]`.
- **Scena 1** riallineata alle misure della bozza e spostata nel palco; la neonata è la Caterina globale.
- **Aggiunti in `scenes.js`** elementi citati nella bozza ma mancanti nei dati: coriandoli di S04 e S13, goccia di S12, orbita "davanti/dietro" in S05.
- **Accessibilità** (revisione con l'agente di accessibilità, correzioni applicate): i testi di tutte le battute sono anche dentro le `<section>` per gli screen reader, gli elementi usciti non restano nel Tab, focus a due toni visibile anche sul viola, sottotitoli che non si troncano con lo zoom, niente raffica di annunci durante i salti, segni della barra da 24px, segnaposto non letti nei nomi dei bottoni.
- `implementation_plan.md` riscritto (v3).

### Cosa non ho potuto verificare / cosa potrebbe non funzionare

- **Non ho potuto aprire il sito nel browser**: i permessi per gli strumenti browser (Playwright / Chrome DevTools) non erano concessi e non c'era nessuno per concederli; il terminale era escluso. **Tutto è verificato solo rileggendo il codice**: nessuna prova reale di scorrimento avanti/indietro. Primo controllo da fare al mattino: `python3 -m http.server 8000`, aprire http://localhost:8000, console senza errori, poi scorrere tutto il sito avanti e indietro.
- Punti più a rischio, da guardare per primi:
  - la neonata che "nasce" dal pentolone a S01 b8 (compare davanti al pentolone, non da dentro);
  - al passaggio S01→S02 cadono i figli diretti dello strato S01 (genitori, pentolone, carrello): controllare che scorrendo indietro tornino al loro posto;
  - gli scritti sopra i segnaposto (misure con unità `cqh/cqw`): potrebbero risultare troppo piccoli o grandi;
  - le orbite di S15 (il calendario che parte da x 25% al 62% e poi si aggancia) e di S16 (raccogli a b10);
  - salto con i segni della barra da una scena lontana: la voce tace per la durata del salto, ma tutte le timeline intermedie vengono attraversate velocemente.
- `prefers-reduced-motion`: ho interpretato "scene statiche" come **un fotogramma fermo per battuta** (a scatti, senza animazioni). Non verificato.
- Su schermi stretti (telefono in verticale) il bottone approfondimento a x 5% esce in parte dallo schermo e molti elementi si sovrappongono: la bozza è pensata per schermo orizzontale.
- Script da CDN senza `integrity` (SRI): non ho potuto calcolare gli hash senza terminale/rete.
- Nessun file audio né immagine reale: tutto è segnaposto; i file audio mancanti restano in silenzio (la console mostrerà i 404).

### Dubbi da chiedere a Caterina

1. **Architettura**: va bene il palco fisso al posto delle sezioni pinnate? Se sì, aggiorno le righe su "section alta 100vh, pinnata" in `CLAUDE.md` (non l'ho toccato).
2. **[DA DEFINIRE]** da decidere: S04 "si nasconde dietro il tamburo" (serve un tamburo? un'immagine di lei nascosta?), S05 stranezza, S07 associazione, S12 insulti, S12 donne e bambine, S16 danza polinesiana.
3. **Interruttore MOVIMENTO**: per le linee guida WCAG (2.2.2) i movimenti continui (dondolii, marce, orbite) dovrebbero potersi fermare anche dalla pagina, non solo con l'impostazione di sistema. Aggiungo un terzo bottone accanto a SOTTOTITOLI e VOCE?
4. **Fumetti delle lingue (S12)**: che lingue o che scritte dentro? Ora sono solo segnaposto.
5. **Glee e Futurama (S16 b3)**: basta una sola TV generica, o due oggetti distinti?
6. **Papà "oops" (S01)**: dopo b6 resta nella posa "oops" fino alla fine della scena; deve tornare a "mescola"?
7. **Segni della barra**: portano all'inizio della scena *dopo* il cambio scena (così si vede già la scena nuova). Va bene, o preferisci proprio l'inizio del cambio?
8. **Testi aggiunti non dai sottotitoli**: "MAGGIO" sul calendario, "3ª", "PROMOSSA", "NON CE LA FARÀ", "UNIVERSITÀ", "PSICOLOGIA", "INFORMATICA", "Ricomincia", "clicca per vedere il momento", "Foto / video / audio — da definire" sono presi dalla bozza; nessun sottotitolo è stato scritto o cambiato.


---

## S01 aggiornata (30 settembre 2026)

**Fatto**
- Nuova disposizione: papà x 30% (guarda a destra), mamma x 70% (guarda a sinistra), bacinella gialla su sgabellino x 50%, scaffale a tre ripiani x 10% al posto del carrello; fumetti a x 36% (papà «Buongiorno!») e x 64% (mamma «Buona giornata!»).
- Scaffale con 6 barattoli (9vh) e l'ampolla dei traumi (12vh) sul bordo destro del ripiano centrale, visibili per tutta la scena. Fratelli: veri bottoni che aprono il foglio con foto e didascalia (mouse e tastiera). Ingredienti: immagini con l'etichetta come testo alternativo, oscillano solo in hover.
- Decisioni con Caterina: sagome che si staccano alla b5; posa iniziale mescola; alla b1 cade il pandeiro (via chitarra e note); b2–b3 il papà grattugia il grana (la mamma non grattugia più); b8 entrambi in posa confusa (nuovi file s01-papa-confuso, s01-mamma-confusa).
- Sistema unico di animazione a fotogrammi nel motore (`anims` nei dati, `framePlayer` in main.js), per ora `frames: 0`. Provato simulando 3 fotogrammi: girano alla b2–b3, stesso fotogramma su colore e sagoma, si fermano con Calma e fuori dalla finestra, ripartono scorrendo indietro.
- "pentolone" → "bacinella" ovunque; bolle e schiuma separate non c'erano nel codice.
- Etichette e fumetti in i18n; proposte PT-BR in testi-pt-br.md. CLAUDE.md, implementation_plan.md e ASSET.md (152 file) aggiornati.
- Corretto un bug introdotto il 28/09: i barattoli dei fratelli erano finiti dentro un contenitore aria-hidden.

**Verificato nel browser** (1440×900): nessun errore JS (solo 404 dei file mancanti); battute b0–b8 in avanti e all'indietro; Calma; riduci movimento; screenshot a b0, b3, b6, b8.

**Resta da fare**
- Rimisurare sulle immagini vere: proporzioni dello scaffale (ora 1:2), altezze dei ripiani, linea del bordo della bacinella (ora 25vh su 30), proporzioni della bacinella (ora 1:1), posizione dell'ampolla rispetto al gomito del papà.
- Ricavare i fotogrammi dai video (papà mescola, papà grana, mamma mescola, bacinella) e impostare `frames` in scenes.js.
- La neonata compare davanti alla bacinella invece di uscire da dentro (la Caterina globale sta sopra la bacinella): da sistemare quando c'è l'immagine.
- Aggiornare la sezione S01 di bozza-scene.md con le decisioni del 30/09 (pandeiro, grana, pose confuse), se Caterina vuole che resti la fonte unica.
- Approvare le proposte PT-BR delle etichette.


---

## S13–S16 nuove, musica, controllo S02–S12 (30 settembre 2026)

**Fatto**
- **S13–S16 sostituite** come in bozza-scene.md e script-voiceover.md (lunghezze di scroll: 800 / 420 / 860 / 380vh):
  - S13 bugiardino: sfondo che si spegne fino al grigio e poi al nero, Caterina in tre fasi che perde saturazione (torna piena con gli amici), oggetti che si sommano senza uscire, 4 oggetti cliccabili con puntino (computer, busta, Abilicity, progetto finale) che aprono il foglio, badge che conta 1→100, sticker, avversità e problemi [DA DEFINIRE], b13 con 80 cloni sempre più fitti e poi il nero; sottotitolo a forma di bugiardino con intestazione.
  - S14: dal nero, Maya che si avvicina e "lecca" lo schermo, cuore; Olanda desaturata che torna a colori; corsa nei prati.
  - S15: cerchio giallo, Caterina neutra che si riveste di colore (b1→b9), 13 ciondoli che si appendono alla cintura e oscillano, una sola tv, arrampicata con caduta, barra che brilla.
  - S16: telefono che cresce fino a tutto schermo, bottone play, video al clic (pausa col clic, Esc ferma), scritte a 20/50/80% del video, logo e Ricomincia alla fine; senza video tutto segue lo scroll della b3 (le scritte lasciano il posto al logo).
- **Interruttore MUSICA** (predefinito acceso) e motore della musica: canzone-4 in S13 (sale di volume e velocità nella b13, taglio netto sul nero), canzone-1 in S14 dalla b2, canzone-2 da S15 b1 fino a S16 b1; sotto la voce scende a 0.2; solo scorrendo in avanti; file mancanti = silenzio. Provato simulando la riproduzione.
- **Etichette in immagine** `assets/img/ui/` (linguetta, linguetta attiva, etichetta corta/lunga) con il CSS attuale come ripiego.
- **Decisioni applicate**: palco fisso; niente terzo interruttore oltre Calma (che ferma tutti i movimenti continui, anche ciondoli, puntini, pendoli); papà in oops fino a fine b7 e confuso alla b8; segno della barra all'inizio della scena dopo il cambio; cartellino «Girami» su telefono verticale (chiudibile); fumetti-lingua S12 «Hola», «Olá», «Salam»; una sola tv.
- **S02–S12 confrontate con la bozza**: coincidono (posizioni, misure, battute, effetti). Unica aggiunta: le scritte dei fumetti-lingua.
- **Bug trovati e corretti** aprendo il sito nel browser:
  - Caterina e altri elementi sbagliati dopo i salti (barra, scrollbar, Home/Fine): ora Caterina la guida solo la scena corrente, ripartendo dal suo stato d'inizio scena.
  - cloni di S13 che restavano nelle scene successive;
  - segnaposto invisibili sopra sfondi dello stesso colore (ora hanno un bordino).
- **Testi**: proposte PT-BR per i sottotitoli e le etichette di S13–S16 in testi-pt-br.md (da approvare); ASSET.md rigenerato (177 file, con S13–S16 nuove e le etichette ui).

**Verificato nel browser** (1440×900): nessun errore JS (solo 404 dei file mancanti); tutto il sito avanti e indietro, anche con Calma acceso; salti tra scene lontane; musica; clic su play senza video. Screenshot a metà di ogni scena e dei momenti chiave in `verifiche/2026-09-30/`.

**Resta da fare / da chiedere**
- ~~Sticker di S13~~: risolto (li carica solo Caterina, vedi sotto).
- Testi [DA DEFINIRE] rimasti come segnaposto: avversità (S13), problemi (S13), più quelli già noti di S04, S05, S07, S12.
- Titoli dei 4 fogli degli oggetti cliccabili di S13 e titoli brevi dei post-it: bozze di Claude, da rivedere.
- Video: proporzioni dello schermo del telefono (ora margini 9%/6%) da allineare all'immagine vera; nessun sottotitolo per il video (è musica e danza).
- Scena verticale su telefono: per ora solo il cartellino «Girami».


---

## S02 nuova, finale S16, sticker, PT nel sito (30 settembre 2026, mattina)

**Fatto**
- **S02 riscritta** come in bozza-scene.md (vedi punto 6). Il testo del certificato è anche testo nascosto per gli screen reader. La posizione della virgola sul certificato è nei dati (`dx`/`dy` di `virgola` in js/scenes.js): **da misurare**, perché le immagini di S02 non sono nella cartella (né altrove sul Mac).
- **S16**: alla fine restano solo nero, logo e Ricomincia (un fondo nero copre il telefono), sia scorrendo sia a fine video.
- **Sticker**: piccoli e non modificati (tolte rotazioni, ombra ed entrata "schiaffata"; esclusi dai cloni di S13). Regola in CLAUDE.md.
- **S01**: pandeiro 12vh che cade ruotando un po' con tuffo (la bacinella si schiaccia appena), 4 note (una sola immagine `s01-note`, 4–8vh) che escono e salgono fino al 75%; posa facoltativa `s01-mamma-pandeiro` (se il file c'è, a metà b1 passa a mescola; se no resta mescola); alla b7 la mamma si ferma sul fotogramma 1 di mescola.
- **Portoghese**: le proposte di testi-pt-br.md sono ora anche in js/i18n.js (134 testi, 17 titoli), così si vedono nel sito; restano da approvare. Aggiunte le voci nuove di S02 (fumetto, testo del certificato).
- **.gitignore**: `sorgenti/`, `verifiche/`.
- **Documenti**: ASSET.md (S02 dalla bozza, S01 con note e posa facoltativa, sezioni Sticker, Musica, Media S13), CLAUDE.md (regole e scene), README.md nuovo.
- **S03–S12** riconfrontate con la bozza: durate, sfondi e file coincidono.

**Verificato nel browser** (1440×900): nessun errore JS (solo 404 dei file mancanti); tutto il sito avanti e indietro con Calma acceso e spento; S02 battuta per battuta; S01 b1; S16 fine; nessun `[PT]` rimasto in portoghese. Screenshot in `verifiche/2026-09-30/` (`v2-*.png` e `meta-sNN.png`).

**Da chiedere**
- S02: la bozza dice «scroll totale 520vh» ma le battute sommano 640vh (60+60+60+60+130+90+90+90). Ho tenuto le lunghezze per battuta.
- S02: le immagini che la bozza dà per fatte (culle, certificati, virgola, punto di domanda) non ci sono in `assets/img/s02/`.
- Sticker: la bozza dice «schiaffati» con rotazione ±12° e ombra; la regola nuova dice «non modificati». Ho seguito la regola nuova.


---

## Smistamento asset e controlli, fasi 1–5 (30 settembre 2026)

**Smistati** (da `~/Desktop/papercut-project/da-smistare/`, che ora è vuota; copia intatta di tutti gli originali in `sorgenti/originali/`):
s01-bacinella · s02-culla, -culla-piena, -culla-piena-vomito (da `_vomito`), -certificato-virgola (nome con spazio), -certificato-no-virgola (da `certifica-`), -virgola, -punto-domanda · s03-cate-bambina, -ginnasta, -ginnasta-fasciata, -liceo, -judo (da `judo.`) · s05-cate-medie (da `s03-cate-medie`) · s03-lente (da `s03-item-restauro`). Liceo e judo non erano invertiti.

**Non trovati in da-smistare** (né altrove sul Desktop/Download): fumetto, nota, post-it-plain, etichetta, s01-bolle-bacinella, s01-barattolo-bunda, s01-mamma-drop, s01-mamma-oops, facce di papà e mamma, video (papa-mescola, mamma-mescola, bacinella-bolle), sticker, logo Abilicity, asset Maya/logo dal portfolio. Quindi niente fase 3 (fotogrammi) e niente etichette ui.

**Portfolio** (`~/Desktop/portfolio-caterina`, repo caterinacozzoli.github.io; non ho spostato niente): c'è `progetto-abilicity/logo-abilicity.jpeg` (JPEG, senza trasparenza), `export-banner/images/avatar-caterina-default.png`, banner LinkedIn e icone del sito; nessuna immagine di Maya. In `~/Desktop/asset portoflio/` ci sono polaroid (cate-piccola, banda, brasile, volontariato, laurea, master, parlamento, amore): potrebbero servire agli approfondimenti (`assets/media/sNN/`).

**Modifiche ai file** (originali in `sorgenti/originali/`):
- S02: tutti i PNG avevano una cornice sottile a rettangolo arrotondato sul bordo della tela: tolta (fascia di 10 px, il disegno parte da almeno 13 px dal bordo).
- s03-lente: sfondo tolto con rembg (isnet-general-use).

**Codice**:
- S02: proporzioni vere (culle 340×507, certificati 600×403, punto di domanda 260×388). Virgola misurata confrontando i due certificati: inchiostro a x 347–351, y 146–157 → `dx`/`dy` = 3.68vh, altezza 1.26vh; verificato che sovrapposta coincide al pixel con quella del certificato, poi cade a terra e vola via.
- S01: bacinella adattata all'immagine (tela 36.6vh, piedi sul pavimento, bordo anteriore al 66.5% della tela); nuovo barattolo «BUNDA · ESAURITA» (ripiano basso al centro, 9vh, segnaposto; proposta PT in testi-pt-br.md, non applicata).
- S03: b5 prima al liceo (abiti normali, 40→45vh), corre sul tatami, poi judogi, cade e si rialza. Lente in proporzione 2002×919.
- **Bug del motore corretto**: tornando indietro prima di un'entrata e poi saltando oltre, alcuni elementi restavano invisibili (es. il fumetto di S02). Nuova funzione `fromToIn()` in main.js.

**Verificato** (1440×900): nessun errore JS (solo 404 dei file mancanti), tutto il sito avanti e indietro; screenshot `verifiche/2026-09-30/fase5-*.png` (S01, S02, S03 a inizio e fine di ogni battuta, più `fase5-virgola-sopra/sotto.png`). Misure: papà e mamma 55vh, scaffale 50vh, 7 barattoli 9vh sui ripiani giusti (alto 2, centro 2 + ampolla, basso 3), culle perfettamente sovrapposte, Caterina in S03 nell'ordine artista → bambina → ginnasta → fasciata → medie → liceo → judo.

**Problemi nei file**
- ~~s01-bacinella con Bulbasaur, Psyduck e axolotl Minecraft~~: va bene, il vincolo su personaggi e loghi esistenti è stato tolto (è un esercizio).
- **s03-lente**: è la foto dell'«Ecce Homo» di Borja (tre fasi del restauro), non una lente di carta: foto di un'opera esistente, stile diverso dal resto, larga il doppio dell'altezza. Da decidere se tenerla così, come quadro, o sostituirla.
- **Dimensioni** (lato lungo < 1500 px): certificati 600×403, culle 340×507, punto di domanda 260×388, virgola 60×107, bacinella 1200×896. Su un portatile retina (900 px di altezza, 2×) restano nitidi fino a circa: certificato 22vh (nel sito 30→38vh: **sgranato**), punto di domanda 21vh (20vh: al limite), culla 28vh (10vh: ok), bacinella 50vh (36.6vh: ok).
- **Culla**: con i 10vh della bozza il disegno è alto ~7.5vh, piccolo accanto alla neonata da 18vh. Proposta: 22–25vh.
- **Piedi di Caterina non sulla stessa riga** (vuoto sotto i piedi nella tela 1696×2528): bambina 193 px, ginnasta e fasciata 176, medie 146, judo 140, **liceo 31**. Al cambio liceo↔medie/judo si vede un salto di ~2vh; e in generale Caterina galleggia 2–3vh sopra il pavimento. Meglio riallineare i piedi alla stessa distanza dal bordo (o dirmi se li compenso nel codice).
- Tutte le tele di una stessa serie coincidono (culle, certificati, le 6 Caterina).

**Ancora da fare / da chiedere**
- Etichette ui (post-it e cartellino): quando ci sono i file li metto in `assets/img/ui/` e allineo i testi sopra, tenendo l'animazione attuale.
- Fotogrammi: servono i video in `sorgenti/s01/`.
- s01-mamma-drop / s01-mamma-oops: non trovati, non so ancora cosa siano.
- Fase 6 (generazione) in attesa del tuo via libera.
- 30/09: aggiunto `s13-abilicity-logo.png` (copia in PNG di `portfolio-caterina/progetto-abilicity/logo-abilicity.jpeg`, 478×716, sfondo grigio chiaro non trasparente). Gli zip «Vizcom Export» in Download sono di luglio e servono al portfolio (Libraccio, Qualia), non a Buttercup.
- 30/09: dal portfolio (`public/images/`, copiati, niente spostato): sticker figma, claude, miro, antigravity (da `logos/`; figma, claude e antigravity sono 150×150, miro 1024×1024; **manca LinkedIn**); Maya → `s09-maya` (seduta di tre quarti, `cane/stato2cane`) e `s14-maya-fronte` (`cane/caneforntale`); logo → `s16-logo` (`avatar/avatar-caterina-default`). Resto in `assets/img/non-assegnati/` (vedi ASSET.md). Manca ancora `s14-maya-bacio` (primo piano con la lingua fuori).
- 30/09: menu in alto a destra su due righe a ogni larghezza (lingua a sinistra; Sottotitoli · Voce sopra, Musica · Calma sotto; levette allineate in colonna).

---

## Versione minima / demo (30/09, MINIMO.md)

**Codice**:
- **Segnaposto**: un file mancante non mostra più il segnaposto, l'elemento non compare. Restano le scritte su carta (cartellini, fumetti, etichette in Chunko), e spariscono le note [DA DEFINIRE] e gli oggetti cliccabili senza immagine.
- **Caterina**:
  - fino a S07, ogni versione mancante ripiega sull'età: bambina S02–S04, s05-cate-medie S05, s03-cate-liceo S06–S07;
  - da S08 in poi sempre s13-cate-fase-1 (fase 2 = mezza grigia, fase 3 = grigia, torna a colori in S14 b4). Finché s13-cate-fase-1 manca, al suo posto c'è la liceale.
- **File riusati**:
  - busti S13 = s01-papa-mescola / s01-mamma-mescola;
  - s02-fumetto = s01-fumetto (in S01 un solo fumetto, quello della mamma specchiato);
  - s01-mamma-confusa = s01-mamma-oops;
  - Maya in S14 = s09-maya (anche il bacio).
- **Forme CSS**: tatami S03 (stuoia verde), telefono S16 (cornice scura, schermo nero), play S16 (cerchio giallo con triangolo). Etichette della barra: la freccia `ui-etichetta-indizi.png`, con la stessa animazione.
- **Verificato** (1440×900): nessun errore JS, tutto il sito avanti e indietro; screenshot `verifiche/2026-09-30/demo-s00…s16.png`.

**Smistamento**: `da-smistare/` è vuota. Gli S01 (papà, mamma, neonata, scaffale, barattoli, ampolle, fumetto, nota, facce) non sono né lì né altrove. Tre video S01 sono in Download (papà mescola, mamma mescola, bacinella), non ancora usati.

**Mancano (MINIMO.md)**: s13-cate-fase-1, s03-testa-gigante, s04-cate-percussionista, s06-mascherina, s07-casa-piccola, s08-vassoio, s09-ale, s10-laptop, s11-cani, s12-ospedale, s13-corona, s14-prato; tutta S01 tranne la bacinella; video-3.mp4. Già presenti: s09-maya, S02, S03, s05-cate-medie, sticker (tranne LinkedIn), logo, Abilicity.

**Da sapere**: gli oggetti «addosso» all'adulta (vassoio, corona…) vanno ancorati su testa/mani/vita di s13-cate-fase-1 quando arriva l'immagine.
- 30/09: tutti i fogli degli approfondimenti mostrano «Work in progress» (cartello di carta con cornice a strisce gialle e nere). Ancore visibili: cerchio giallo con «+» (bordo scuro, pulsa piano; fermo con Calma e riduci movimento) sui bottoni approfondimento di S02–S16 e sugli oggetti cliccabili di S13 senza immagine; piccolo «+» sui barattoli dei fratelli in S01.
- 30/09: fogli approfondimento con la GIF `assets/img/ui/work-in-progress.gif` (con Calma o riduci movimento il fotogramma fermo `work-in-progress-fermo.png`; alt «Work in progress»). Caterina ×1.3 in tutte le scene (CATE_SCALA in main.js); culle S02 22vh; elementi con scritta senza immagine = cartoncino di carta con bordo.
- 30/09: strumento «sposta» per localhost (js/sposta.js): Cmd+K modalità sposta, trascina, Cmd+R copia le coordinate.

---

## Versione minima, ultimo giro (30/09)

**Collegato**:
- **Caterina per scena**:
  - bambina S02–S04 (percussionista mancante → bambina);
  - medie S05; liceo S06–S07;
  - studentessa S08, S09, S10 b1, S12;
  - tailleur S10 b2–b3 e S13 b1–b3 (con la corona); hostess S11;
  - felpa S13 b4–b8 e b11–b12 (grigia) e S14 b2–b3 (torna a colori); amici S13 b9–b10;
  - colorata da S14 b4 alla fine.
  - Cambi sul posto con un piccolo pop di carta.
- **Figura, non tela**: `fitFigure()` in main.js misura i pixel non trasparenti di ogni immagine e fa sì che l'altezza in vh sia quella della figura, piedi a terra, per ogni tela (2:3 o quadrata). Vale per Caterina e per gli oggetti con `fig: true`.
- **Oggetti ancorati alla figura**:
  - vassoio sulla mano destra all'altezza del gomito (S08);
  - laptop a terra a destra (S10 b1);
  - cani ai piedi (S11 b5);
  - corona in testa (S13 b1).
  - S06 mascherina; S07 casa dietro di lei 85 → 18vh; S09/S14/S15 Ale e Maya.
  - S14: Maya di fronte cresce, bacio (s14-maya-fronte in primo piano), cuore; alla b4 prato, colorata, poi di spalle Maya, Ale e Caterina corrono all'orizzonte uno alla volta (1/5, rimbalzo).
- **S16**:
  - il video parte da solo arrivando alla b3 (se il browser blocca l'audio riparte senza) e si ferma tornando indietro;
  - 7 scritte di Caterina in maiuscolo, una alla volta mentre scorre;
  - dalla 5ª (buona giornata, scusate il disagio, miao arigato) nero e solo il logo, scritta chiara sotto; poi Ricomincia.
  - Senza video, le stesse cose seguono lo scroll. Proposte PT delle 7 scritte in testi-pt-br.md.
- **Musica**:
  - canzone-5 S05, canzone-4 S13 (rampa e taglio alla b13), canzone-1 S14 dalla b2, canzone-2 da S15 a S16 b1;
  - loop finché si resta nella sezione, crossfade ~1 s, riparte anche tornando indietro;
  - pausa con la scheda nascosta, 0.3 → 0.2 sotto la voce.
  - Provato: 30 s fermi in S05 e in S14 la canzone continua; S13 → S14 crossfade.
- **Linguette della barra**: il nome si intravede anche da chiuse, tagliato sul bordo della barra.
- **ASSET.md**: spunte aggiornate (45/186); le versioni di Caterina non più usate sono barrate «non serve nella versione minima»; tolte s16-scritta-*.

**Manca ancora**: tutta S01 tranne la bacinella, s03-testa-gigante, s04-cate-percussionista, s12-ospedale, sticker-linkedin (e gli elementi non in MINIMO.md: restano invisibili).

**Da sapere**:
- Col server locale (`python3 -m http.server`) il video non si può mandare avanti/indietro (niente richieste Range); su GitHub Pages sì.
- Le canzoni sono brani veri (canzone-5 è Creep): CLAUDE.md vieta musica protetta da copyright. Su un sito pubblico è un rischio: decidi tu.
- 30/09: S01 completa con gli asset di Caterina (ridimensionati per il web, originali in sorgenti/originali/s01): genitori con tutte le pose (anche mamma-pandeiro → drop → mescola in b1, mamma-oops = confusa), scaffale con i piani misurati, 7 barattoli, ampolla/crepata/liquido, fumetto, nota, neonata. Senza «Ciao» iniziale, sfondo neutro. Strumento sposta solo in locale (js/sposta.js fuori da git).
- 30/09: S02 senza cartellini CATERINA/MARIA: il certificato con la virgola compare in alto appena nata (b1), alla b3 la virgola cade e resta il certificato senza virgola.
- 30/09: tutto un terzo più grande (SCALA in main.js: Caterina e oggetti < 60vh; S01 nel CSS) e pavimento dal 12% al 15%.
- 30/09: judo spostato da S03 b5 a S06 b0 (dopo le medie e Creep); colline di S14 più grandi (64vh); script-presentazione.md con tutte le battute in ordine.
