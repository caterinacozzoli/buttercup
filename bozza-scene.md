# Bozza scene (BRUTTA con segnaposto) — coreografia completa

Bozza di lavoro. I testi sono la bozza di Caterina, divisa in battute: usali esattamente così. Dove c'è [DA DEFINIRE] metti un segnaposto visibile e vai avanti.

---

## REGOLE GENERALI

### Architettura
- Stessa architettura della scena 1: una `<section>` pinnata per scena, timeline con scrub, battute come label, testi e parametri in `js/scenes.js`.
- Obiettivo: **struttura, posizioni, misure e ritmo corretti**. Le immagini sono segnaposto.
- Nomi file: `assets/img/sNN/sNN-nome.png`. Versioni di Caterina: `sNN-cate-xxx.png`.
- Scorrendo all'indietro tutto deve riavvolgersi.

### Posizioni
Le coordinate indicano il **centro orizzontale** dell'elemento, in % della larghezza dello schermo:

| Zona | x |
|---|---|
| sinistra lontana | 12% |
| sinistra vicina | 28% |
| centro | 50% |
| destra vicina | 72% |
| destra lontana | 88% |

In verticale, misurato dal fondo dello schermo:
- **"a terra"** = i piedi (o la base) appoggiano sul **pavimento, al 12%**
- **"al N%"** = il centro verticale dell'elemento sta all'N% dal fondo
- mezz'aria 40–60%, cielo 70–85%

### Misure (sempre in ALTEZZA, vh)

| Cosa | Altezza |
|---|---|
| Caterina neonata | 18vh |
| Caterina bambina (S03–S04) | 35vh |
| Caterina ragazzina (S05) | 40vh |
| Caterina ragazza (S06–S12) | 45vh |
| Caterina adulta (S13–S16) | 50vh |
| Altri adulti (genitori, Ale, impiegati, sagome di persone) | 55vh, salvo indicazione |
| Maya e altri animali | 18vh |
| Oggetti grandi | 30–45vh |
| Oggetti medi | 15–25vh |
| Oggetti piccoli | 5–10vh |
| Fumetti | 12–16vh |

La larghezza segue le proporzioni dell'immagine (segnaposto: persone 2:3, oggetti 1:1 salvo indicazione).

### Profondità (dal fondo verso chi guarda)
sfondo → fondali (edifici, sipari) → sagome lontane → oggetti → **Caterina** → oggetti in primo piano → fumetti → interfaccia.

### Scroll
- Ogni battuta ha la sua lunghezza di scroll, indicata nella tabella (100vh = un'altezza di schermo).
- **Ritmo dentro ogni battuta**: 0–20% entra ciò che è nuovo · 20–80% tutto fermo, si legge · 80–100% esce ciò che deve uscire.
- **Cambio scena (60vh)**: tutto tranne Caterina scivola giù fuori dallo schermo come carta che cade; lo sfondo cambia colore con una dissolvenza; Caterina si sposta alla posizione iniziale della scena nuova.
- Se un elemento non ha scritto "esce", **resta fino al cambio scena**.

### Movimenti standard
- **cade**: dall'alto fuori schermo fino alla posizione, piccolo rimbalzo all'atterraggio
- **entra da sinistra/destra**: scivola da fuori schermo
- **spunta**: dal basso, scala da 0.6 a 1 con leggero rimbalzo (back.out)
- **si stacca**: come un adesivo (clip-path diagonale)
- **sfuma**: dissolvenza
- **vola via**: esce dallo schermo ruotando
- **esce a sinistra/destra/in basso**: scivola fuori
- **orbita**: ruota lentamente attorno a Caterina, a tempo reale (non in scrub)

Caterina:
- **cambia in X**: dissolvenza tra una versione e l'altra (dura il primo 20% della battuta)
- **saltella**: si sposta a piccoli archi
- **corre**: veloce, inclinata in avanti
- **cade**: ruota, tocca terra, resta un attimo, si rialza
- La posizione di Caterina per battuta è nel campo `move` in `scenes.js`.

### Sottotitoli
Fascia in basso al centro, sotto il pavimento (entro l'11% più basso dello schermo), così non copre nulla.

### Barra di avanzamento
Striscia di carta fissa in cima allo schermo, alta 1.2vh, larga tutto lo schermo, che si riempie scorrendo tutto il sito. Un segno per ogni scena: cliccandolo si salta all'inizio di quella scena (scroll morbido con Lenis). I bottoni SOTTOTITOLI e VOCE stanno subito sotto la barra.

### Approfondimenti
- Una per scena, da S02 a S16: bottone `sNN-approfondimento`, un oggetto di carta fissato con una puntina.
- Posizione **fissa per tutte le scene**: x 5%, centro al 9%, altezza 9vh.
- **Spunta** all'inizio della prima battuta della scena, **esce** al cambio scena.
- Al clic: Lenis si ferma, si apre un foglio di carta (70vw × 70vh, al centro) con un segnaposto "Foto / video / audio — da definire". Si chiude con la X o con Esc e lo scroll riparte da lì. È un vero `<button>`, focus gestito da tastiera.
- Solo il primo (S02) mostra accanto il suggerimento "clicca per vedere il momento".
- Contenuti veri, in futuro: `assets/media/sNN/`.

### Ogni cosa citata si materializza
Ogni persona, oggetto, luogo o idea nominata nel testo compare come fumetto, oggetto o sagoma. Se il testo nomina qualcosa che non è nella tabella, aggiungi un segnaposto con un nome file coerente, **oggetto piccolo al 60%, dal lato meno affollato**.

---

## ETICHETTE DEI TITOLI (barra di avanzamento e indizi)

Immagini in `assets/img/ui/`, il testo lo scrive sempre il codice sopra (Chunko), mai nell'immagine.

| File | Uso | Tela |
|---|---|---|
| ui-etichetta-corta.png | cartellino con l'indizio/titolo della scena, per testi fino a ~14 caratteri | 3:1 |
| ui-etichetta-lunga.png | stesso cartellino per testi più lunghi | 5:1 |
| ui-linguetta.png | linguetta di ogni scena sotto la barra di avanzamento | 1:2 |
| ui-linguetta-attiva.png | linguetta della scena corrente (gialla, bordo scuro) | 1:2 |

Il codice sceglie corta o lunga in base alla lunghezza del testo; il cartellino compare in hover/focus sulla linguetta ed è leggermente ruotato (±3°). Finché le immagini mancano restano gli stili CSS attuali.

## S00 — Titolo · scroll totale 100vh
Sfondo carta `#fcfbfa`.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| inizio · 40vh | cartello "Ciao" (carta, testo in Chunko) | x 50%, al 55% | 30vh | già visibile al caricamento, leggera oscillazione |
| uscita · 60vh | cartello | — | — | si stacca e vola via in alto a destra; sotto compare la scena 1 |

---

## S01 — La ricetta · scroll totale 690vh (già costruita: allinea a queste misure)

Sfondo viola a sinistra, giallo a destra, bordo strappato al centro.

**Disposizione**: il **papà a sinistra guarda verso destra**, la **mamma a destra guarda verso sinistra**, in mezzo la **bacinella gialla** (quella in cui lavavano Caterina da piccola) su uno sgabellino. All'estrema sinistra, accanto al papà, lo **scaffale del laboratorio** con i barattoli (sostituisce il carrello). L'ampolla dei traumi sporge dal bordo destro dello scaffale, a portata di gomito del papà.

| Elemento | File | Dove | Altezza |
|---|---|---|---|
| papà (sagoma → colore) | s01-papa-mescola / s01-papa-grana / s01-papa-oops / s01-papa-confuso | x 30%, a terra, guarda a destra | 55vh |
| mamma (sagoma → colore) | s01-mamma-mescola / s01-mamma-confusa (facoltativa: s01-mamma-pandeiro) | x 70%, a terra, guarda a sinistra | 55vh |
| bacinella su sgabellino | s01-bacinella (+ fotogrammi) | x 50%, a terra; bordo circa 25vh dal pavimento | 30vh (sgabello compreso) |
| scaffale a tre ripiani | s01-scaffale | x 10%, a terra | 50vh |
| barattolo Luana | s01-ampolla-fratello-1 | ripiano alto, a sinistra | 9vh |
| barattolo Raffaele | s01-ampolla-fratello-2 | ripiano alto, a destra | 9vh |
| barattolo tette grandi | s01-barattolo-tette | ripiano centrale, a sinistra | 9vh |
| barattolo capelli ricci | s01-barattolo-ricci | ripiano centrale, al centro | 9vh |
| ampolla dei traumi | s01-ampolla / -crepata / s01-liquido | ripiano centrale, sul bordo destro, sporge verso il papà | 12vh |
| barattolo allergie | s01-barattolo-allergie | ripiano basso, a sinistra | 9vh |
| barattolo altezza | s01-barattolo-altezza | ripiano basso, a destra | 9vh |
| barattolo bunda | s01-barattolo-bunda | ripiano basso, al centro | 9vh |
| pandeiro | s01-pandeiro | cade dall'alto dentro la bacinella, ruotando un po', e sparisce dietro il bordo (ritaglio all'altezza del bordo) | 12vh |
| note | s01-note (una nota, clonata 5–6 volte) | escono dalla bacinella e salgono fino al 75% | 4–8vh |
| scaglie | s01-scaglie | dalla grattugia del papà (x ~40%) alla bacinella | 6vh |
| fumetto papà | s01-fumetto-1 (coda in basso a sinistra) | x 36%, al 62% | 14vh |
| fumetto mamma | s01-fumetto-2 (coda in basso a destra) | x 64%, al 62% | 14vh |
| neonata | s01-cate-neonata | sale dalla bacinella fino al 40% | 18vh |

Le altezze dei ripiani (per ora: alto ~42vh, centrale ~28vh, basso ~14vh dal pavimento) vanno rimisurate sull'immagine dello scaffale quando arriva.

**Battute**

| Battuta | Testo | Cosa succede |
|---|---|---|
| b0 | — | genitori come sagome nere, bacinella, scaffale e barattoli già visibili; la brodaglia ribolle |
| b1 | Bossa nova. | il pandeiro cade nella bacinella (con tuffo) ed escono 3–4 note che salgono fino al 75%; la mamma (sagoma) è ferma sulla posa mescola, oppure — se c'è `s01-mamma-pandeiro` — parte da quella posa e a metà battuta, quando il pandeiro vola via dalla sua mano, passa a mescola |
| b2 | Parmigiano reggiano. | il **papà** grattugia il grana (fotogrammi in loop), le scaglie cadono nella bacinella; la mamma resta ferma sulla posa mescola (non grattugia) |
| b3 | Tanti «buongiorno» e «buona giornata». | il papà continua a grattugiare; fumetto papà «Buongiorno!», fumetto mamma «Buona giornata!», poi i fumetti cadono nella bacinella |
| b4 | Questi erano gli ingredienti… | **entrambi** mescolano (fotogrammi in loop) |
| b5 | Ma Silvelena e Liborio… | le sagome si staccano e compaiono i colori; leggera inclinazione (resta) |
| b6 | …aggiunsero per sbaglio un ingrediente in più. | il papà passa alla posa **oops** (gomito all'indietro verso sinistra, si gira a guardare): urta l'ampolla, che si crepa; la mamma continua a mescolare |
| b7 | Una vagonata di traumi. | il liquido dell'ampolla scende e scopre l'etichetta «UNA VAGONATA DI TRAUMI»; la bacinella trema; papà resta in oops, mamma si ferma (fotogramma 1 di mescola) |
| b8 | E così nacque Caterina. | **entrambi passano alla posa confusa** (s01-papa-confuso, s01-mamma-confusa) e guardano la neonata che sale dalla bacinella con rimbalzo elastico; coriandoli di carta |

Scroll per battuta: b0 60 · b1 60 · b2 60 · b3 90 · b4 90 · b5 90 · b6 90 · b7 60 · b8 90 (vh).

**Animazioni a fotogrammi (sistema unico, vale anche per le scene future)**. Ogni elemento animato ha un'immagine ferma senza numero (`s01-papa-grana.png`) e, quando pronti, i fotogrammi numerati sulla **stessa tela** (`s01-papa-grana-1.png … -N.png`). Nei dati della scena il numero di fotogrammi e la velocità stanno in un campo (`frames: N, fps: 6`); se `frames` è 0 o i file mancano, si usa l'immagine ferma. I fotogrammi girano a tempo reale in loop mentre il gesto è attivo. **Lo stesso fotogramma va sia sul livello a colori sia sulla sagoma nera**, così restano sincronizzati durante il distacco. Con prefers-reduced-motion o Calma resta l'immagine ferma.

- Genitori: papà grana b2–b3, mescola di entrambi b4–b6 (mamma ferma alla b7), ~6 fotogrammi al secondo. Le pose oops e confuse sono immagini singole. Video sorgente in `sorgenti/s01/` (fuori dal sito, in .gitignore).
- Bacinella: `s01-bacinella.png` ferma + `s01-bacinella-1…N` in loop continuo per tutta la scena, ~8 fotogrammi al secondo. Fumo e bolle sono già dentro i fotogrammi, quindi **niente bolle e schiuma separate** (tolte). Alla b7 trema tutta la bacinella.

**Barattoli dei fratelli** (Luana e Raffaele), visibili per tutta la scena, anche quando i genitori sono sagome. Etichette scritte dal codice sull'etichetta vuota dell'immagine:
- `TEST 1 · LUANA · 1996`
- `TEST 2 · RAFFAELE · 1998`

Sono **cliccabili**: veri `<button>` con nome accessibile ("Luana, test 1" / "Raffaele, test 2"). Al passaggio del mouse o al focus oscillano appena. Al clic si apre il foglio degli approfondimenti con un segnaposto per una foto e una didascalia ("Luana — foto e didascalia da definire", idem Raffaele); Lenis si ferma, Esc o X chiudono. Contenuti futuri in `assets/media/s01/`.

**Barattoli degli ingredienti finiti** (non cliccabili, solo oscillazione al passaggio del mouse; testo dell'etichetta scritto dal codice, anche come testo alternativo):
- s01-barattolo-tette → `TETTE GRANDI · ESAURITE NEL 1996`
- s01-barattolo-ricci → `CAPELLI RICCI · ESAURITI`
- s01-barattolo-allergie → `ALLERGIE · DOSE PER TRE`
- s01-barattolo-bunda → `BUNDA · ESAURITA` (provvisorio, da confermare)
- s01-barattolo-altezza → `ALTEZZA · ULTIME GOCCE`

(I testi PT-BR delle etichette vanno aggiunti a testi-pt-br.md, da approvare.)

---

## S02 — Il nome · scroll totale 520vh
Sfondo carta `#fcfbfa`. **Niente sportello, impiegato, modulo e orologio**: il Comune è solo raccontato dalla voce e dai sottotitoli. In scena: culla (vuota, piena, piena col vomito), i cartellini, il certificato di nascita con e senza virgola, la virgola che cade, il fumetto.

**File di Caterina già fatti** (in `assets/img/s02/`): `s02-culla.png`, `s02-culla-piena.png`, `s02-culla-piena-vomito.png`, `s02-certificato-virgola.png`, `s02-certificato-no-virgola.png`, `s02-virgola.png`, `s02-punto-domanda.png`. Le tre culle e i due certificati stanno sulla **stessa tela** ciascun gruppo, così si sostituiscono senza salti.

Il testo del certificato (**«Caterina Maria, Cozzoli — nata a Milano alle ore 14:15 il 20/08/2002»**) è già scritto nelle immagini: il codice lo ripete come testo nascosto (alt) per gli screen reader.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | scena 1 | — | — | tutto scivola giù; lo sfondo passa a carta |
| | s02-culla | x 40%, a terra | 10vh | spunta vuota |
| | neonata (Caterina globale) | da x 50% al 40% → dentro la culla | 18vh | scende e si posa nella culla; poi sfuma e al suo posto la culla passa a **s02-culla-piena** (stessa posizione, la neonata globale sparisce) |
| **b1** · 60vh<br>Però «Caterina» non era un nome abbastanza da vecchia. | s02-cartellino-caterina | x 40%, al 45% | 7vh | cade |
| **b2** · 60vh<br>Così aggiunsero anche Maria. | s02-cartellino-maria | subito a destra di CATERINA | 7vh | entra da destra e si attacca |
| | culla | — | — | passa a **s02-culla-piena-vomito**: la neonata reagisce al secondo nome (piccolo sobbalzo della culla) |
| **b3** · 60vh<br>Senza virgola. | s02-certificato-virgola | x 60%, al 60% | 30vh | i due cartellini volano dentro e compare il certificato con «Caterina Maria**,** Cozzoli» |
| | s02-virgola | sopra la virgola del certificato (posizione da misurare sull'immagine) | come nel certificato | si stacca, **cade** a terra e vola via a destra. **Esce**; nello stesso istante il certificato passa a **s02-certificato-no-virgola** |
| **b4** · 130vh<br>Per assicurarsi che a ogni firma in Comune ci fossero due minuti di imbarazzo… | certificato | x 60%, al 60% | 30 → 38vh | ingrandisce leggermente |
| **b5** · 90vh<br>…e la solita frase: «Scusi, è un po' lungo da scrivere». | fumetto (s02-fumetto) | x 78%, al 78% | 14vh | entra da destra come una voce fuori campo, con dentro «Scusi, è un po' lungo da scrivere»; nessun impiegato |
| **b6** · 90vh<br>E così, forte di questi super insegnamenti ricevuti prestissimo… | certificato, fumetto | — | — | escono a destra |
| | culla | — | — | esce in basso |
| **b7** · 90vh<br>…Cate ha dedicato la sua vita a una missione: capire chi fosse. | Caterina | da x 40% a x 50%, a terra | 18 → 35vh | cambia in s03-cate-bambina e saltella al centro |
| | s02-punto-domanda | x 50%, al 75% | 20vh | spunta e oscilla piano |

---

## S03 — I sogni da piccola · scroll totale 450vh
Sfondo giallo chiaro `#ffeba2`. Caterina bambina, 35vh (b4: alle medie 40vh; b5: judoka al liceo 45vh).

Ordine delle versioni di Caterina: artista → (testa gigante) → ginnasta → **restauratrice = Caterina alle medie (`s05-cate-medie`) con un oggetto da restauratrice** → judoka al liceo. Non esiste più `s03-cate-restauratrice`.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | punto di domanda | — | — | sfuma |
| **b1** · 60vh<br>Caterina ha sognato di essere un'artista, | Caterina | x 50%, a terra | 35vh | cambia in s03-cate-artista |
| | s03-cavalletto | x 28%, a terra | 22vh | entra da sinistra |
| | s03-tavolozza | x 38%, al 45% | 8vh | spunta |
| **b2** · 60vh<br>la testa di Art Attack, | cavalletto, tavolozza | — | — | escono a sinistra |
| | Caterina | x 50% | 35vh | cambia in s03-cate-bambina |
| | s03-testa-gigante (la testa di Caterina gigante, in cartapesta) | x 72%, a terra | 40vh | spunta |
| **b3** · 90vh<br>È stata una ginnasta, finché non ha perso una spalla per strada. | testa gigante | — | — | esce a destra |
| | Caterina | da x 50% a x 40% | 35vh | cambia in s03-cate-ginnasta, fa una capriola (salto con rotazione di 360°); a metà battuta **cade** e si rialza come s03-cate-ginnasta-fasciata |
| | s03-nastro | le volteggia attorno, al 50% | 15vh | sfuma all'inizio, cade a terra quando lei cade, poi esce |
| **b4** · 90vh<br>Poi alle medie, come se non bastassero occhiali e apparecchio, sognava di fare la restauratrice. | nastro | — | — | esce |
| | Caterina | da x 40% a x 50% | 35 → 40vh | cambia in **s05-cate-medie** (occhiali e apparecchio ben visibili; l'illusione adolescenziale, prima del «vai allo scientifico») appena parte «Poi alle medie»; cresce a 40vh |
| | s03-lente (oggetto da restauratrice) | vicino alla sua mano, al 45% | 12vh | spunta e le si posa accanto su «restauratrice» |
| | s03-quadro-antico | x 72%, al 50% (appeso) | 25vh | entra da destra |
| **b5** · 90vh<br>Ma, per perdere anche l'altra spalla, si è data al judo. | lente, quadro | — | — | escono a destra |
| | s03-tatami | x 50%, a terra (largo 40vw) | 6vh | spunta |
| | Caterina | da x 40% a x 50% | 40 → 45vh | entra correndo come s03-cate-liceo (abiti normali), sul tatami cambia in s03-cate-judo (**Caterina al liceo, ~16 anni**, judogi, entrambe le braccia fasciate), **cade** e si rialza |

---

## S04 — La percussionista · scroll totale 270vh
Sfondo viola `#7a35ee`. Caterina bambina, 35vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | tatami | — | — | esce in basso |
| **b1** · 90vh<br>Molto giovane è diventata percussionista… | Caterina | x 50%, a terra | 35vh | cambia in s04-cate-percussionista; marcia sul posto (saltelli piccoli e regolari, a tempo reale) |
| | s04-milano (skyline, fondale) | x 50%, a terra (largo tutto lo schermo) | 40vh | entra da destra, più lento degli altri elementi (effetto profondità) |
| | s04-banda | dietro Caterina, a terra (larga 50vw) | 35vh | entra da sinistra e attraversa piano la scena verso destra per tutta la scena |
| | s04-papa-banda | da fuori schermo a x 34%, a terra | 55vh | entra da sinistra marciando |
| **b2** · 60vh<br>…umiliata tra le vie di Milano. | s04-passanti (sagome) | x 12% e x 88%, a terra | 30vh | spuntano, poi si girano a guardarla (specchiati) |
| | Caterina | x 50% | 35 → 28vh | si rimpicciolisce e si nasconde dietro il tamburo [DA DEFINIRE] |
| | s04-coriandoli | dal cielo a terra, su tutta la larghezza | 2–3vh ciascuno | cadono lenti |
| **coda** · 60vh | banda, papà | — | — | escono a destra marciando |

---

## S05 — Le medie · scroll totale 180vh
Sfondo lavanda `#d4cdff`. Caterina ragazzina, 40vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | passanti, milano, coriandoli | — | — | escono in basso |
| **b1** · 60vh<br>Alle medie era solo… beh, strana. | Caterina | x 50%, a terra | 40vh | cambia in s05-cate-medie |
| | s05-banco | x 34%, a terra | 18vh | spunta |
| | s05-stranezza [DA DEFINIRE] | le gira attorno al 60% | 10vh | orbita |
| **b2** · 60vh<br>E sognava di essere Alex. | s05-nuvola (nuvoletta di sogno) | x 60%, al 78% | 22vh | spunta |
| | s05-cate-blocchi (lei "a blocchetti", non il personaggio di Minecraft) | dentro la nuvola | 14vh | sfuma |

**Musica**: `assets/musica/canzone-5.mp3` (Creep, Radiohead) entra al cambio scena sfumando in 1 s, volume 0.3 (0.2 mentre parla la voce), sfuma al cambio scena verso S06.

---

## S06 — Le superiori · scroll totale 420vh
Sfondo giallo `#fed728`. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | banco, nuvola, stranezza | — | — | escono |
| **b1** · 90vh<br>In prima superiore, una maranza non troppo studiosa. | Caterina | da x 40% a x 50%, a terra | 45vh | cambia in s06-cate-maranza, entra camminando dondolando |
| **b2** · 90vh<br>E, per non farsi mancare ulteriore bullismo: teatro e coro della scuola. | s06-sipario (fondale) | x 50%, dall'alto fino a terra (largo 50vw) | 60vh | scende dall'alto dietro di lei |
| | s06-leggio-coro | x 30%, a terra | 22vh | spunta |
| | Caterina | x 50% | 45vh | cambia in s06-cate-teatro |
| | s06-bulli (sagome nere) | x 12% e x 88%, a terra | 35vh | spuntano e la indicano (piccola rotazione avanti) |
| **b3** · 90vh<br>Le piacque a tal punto la terza che decise di rifarla… | sipario, leggio, bulli | — | — | escono |
| | Caterina | x 50% | 45vh | cambia in s06-cate-maranza |
| | s06-pagella con "3ª" | x 30%, al 50% | 18vh | cade |
| | seconda s06-pagella con "3ª" | x 70%, al 50% | 18vh | cade; Caterina si gira verso l'una e poi verso l'altra |
| **b4** · 90vh<br>…proprio l'anno prima del «tutti promossi», aka Covid. | pagelle | — | — | escono |
| | s06-mascherina | x 60%, al 70% | 6vh | spunta |
| | s06-biglietto-dorato "PROMOSSA" (5 copie) | cadono attorno a lei, tra x 25% e x 75% | 12vh | piovono ruotando senza mai toccarla; l'ultimo le sfiora la mano e vola via |

---

## S07 — La casa momentanea · scroll totale 300vh
Sfondo carta `#fcfbfa`. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | mascherina, biglietti | — | — | escono |
| **b1** · 90vh<br>Poi, quando la sua casa si è fatta stretta… | s07-casa-piccola (casa normale vista di fronte) | x 50%, a terra, **dietro** Caterina | 85 → 18vh | spunta enorme alle sue spalle e, con lo scroll, si rimpicciolisce fino a diventare più piccola di lei |
| | Caterina | x 50% | 45vh | resta davanti, ferma; alla fine si guarda la casetta ai piedi |
| **b2** · 90vh<br>…ha trovato una casa momentanea in un'associazione magnifica… | casa piccola | — | — | vola via in alto |
| | Caterina | da x 50% a x 58% | 45vh | torna alla sua altezza e corre verso destra |
| | s07-associazione [DA DEFINIRE] | x 74%, a terra | 50vh | entra da destra |
| **b3** · 60vh<br>…che la accompagna da dieci anni. | s07-persone-associazione (gruppo) | x 38% e x 88%, a terra | 40vh | spuntano ai due lati di Caterina |

---

## S08 — La cameriera · scroll totale 240vh
Sfondo giallo chiaro `#ffeba2`. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | associazione, persone | — | — | escono in basso |
| | Caterina | torna a x 50% | 45vh | cammina |
| **b1** · 90vh<br>Nel frattempo doveva racimolare i soldi per l'università… | s08-salvadanaio (etichetta UNIVERSITÀ in HTML) | x 28%, a terra | 18vh | spunta, vuoto |
| **b2** · 90vh<br>…allora è diventata una cameriera. | Caterina | tra x 44% e x 60% | 45vh | cambia in s08-cate-cameriera; corre avanti e indietro due volte seguendo lo scroll |
| | s08-tazzine (3) | su un vassoio che lei tiene, al 55% | 8vh | spuntano |
| | s08-monete (6) | dall'alto al salvadanaio | 5vh | cadono una alla volta, distribuite lungo la battuta |

---

## S09 — Scienze psicosociali · scroll totale 460vh
Sfondo lavanda `#d4cdff` → giallo `#fed728` alla b3. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | salvadanaio, monete, tazzine | — | — | escono |
| **b1** · 90vh<br>Contro ogni pronostico dei professori e del suo ex ragazzo… | s09-prof (sagoma) | x 16%, a terra | 55vh | spunta e scuote la testa (oscillazione) |
| | s09-ex (sagoma) | x 84%, a terra | 55vh | spunta e scuote la testa |
| | s09-cartello-pronostico ("NON CE LA FARÀ" in HTML) | x 50%, al 80% | 15vh | cade |
| **b2** · 90vh<br>…è diventata studentessa di Scienze psicosociali. | Caterina | x 50%, a terra | 45vh | cambia in s09-cate-studentessa |
| | s09-libri | x 40%, al 40% (sotto il braccio) | 12vh | spunta |
| | cartello | — | — | si strappa in due ed esce in basso |
| | prof, ex | — | — | si staccano come adesivi ed escono |
| **b3** · 130vh<br>E improvvisamente Caterina è diventata felice. Forse per la prima volta nella sua vita… | sfondo | — | — | da lavanda a giallo |
| | Caterina | x 50% | 45vh | cambia in s09-cate-felice e saltella sul posto |
| **b4** · 90vh<br>…grazie anche a due magnifici compagni di vita: Ale e Maya. | s09-ale | da destra a x 68%, a terra | 55vh | entra camminando |
| | s09-maya | da sinistra a x 36%, a terra | 18vh | entra correndo, poi scodinzola (a tempo reale) |

---

## S10 — Figma e il Parlamento Europeo · scroll totale 370vh
Sfondo viola `#7a35ee`. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | Ale, Maya, libri | — | — | escono |
| **b1** · 130vh<br>Per caso o per destino ha scoperto Figma: per un esame di marketing le sembrava inconcepibile ideare un piano social per un'app senza averla tangibile. | Caterina | x 50%, a terra | 45vh | cambia in s10-cate-designer |
| | s10-laptop | x 38%, al 38% | 14vh | spunta |
| | s10-telefono-app | x 66%, al 50% | 22vh | spunta; dentro compaiono 3 pezzi di interfaccia uno dopo l'altro, seguendo lo scroll |
| **b2** · 90vh<br>E, per caso o per fortuna, quel progetto è finito al Parlamento Europeo. | laptop | — | — | esce |
| | telefono | — | — | vola in alto a destra fino al Parlamento e sparisce |
| | s10-parlamento | x 76%, a terra | 45vh | entra da destra |
| | s10-stelle-ue (12) | in cerchio sopra il Parlamento, x 76% all'82% | 4vh ciascuna | spuntano una dopo l'altra |
| **b3** · 90vh<br>Quindi si potrebbe dire che Caterina è stata anche, momentaneamente… una diva? | s10-tappeto-rosso | a terra, da x 10% a x 70% | 6vh | si srotola da sinistra |
| | Caterina | da x 50% a x 45% | 45vh | cambia in s10-cate-diva, cammina lenta sul tappeto |
| | s10-flash | x 20% e x 80%, al 50% | 12vh | tre lampi bianchi seguendo lo scroll |

---

## S11 — I lavoretti · scroll totale 420vh
Sfondo viola `#7a35ee`, che alla b2 si scurisce (viola con un velo nero al 60%), e alla b5 torna carta `#fcfbfa`. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | tappeto, parlamento, stelle, flash | — | — | escono |
| **b1** · 90vh<br>Poi è tornata a terra ed è diventata una hostess… | Caterina | x 50% | 45vh | fa un salto, **atterra** e cambia in s11-cate-hostess |
| **b2** · 60vh<br>…la notte… | sfondo | — | — | si scurisce |
| **b3** · 60vh<br>…nelle discoteche milanesi… | s11-luci-discoteca (3 fasci di luce dall'alto) | x 25%, 50%, 75%, dall'alto | 70vh | sfumano e oscillano (a tempo reale) |
| **b4** · 60vh<br>…a vendere Ploom. | s11-vassoio-dispositivi (dispositivi generici, nessun logo) | x 50%, al 35%, in mano a lei | 10vh | spunta |
| **b5** · 90vh<br>E, per molti borghesi del suo condominio, «la dogsitter sudamericana». | luci, vassoio | — | — | escono; lo sfondo torna carta |
| | s11-condominio (facciata, fondale) | x 50%, a terra | 70vh | sale dal basso dietro di lei |
| | s11-vicini (4 sagome nelle finestre) | nelle finestre della facciata | 10vh | spuntano |
| | fumetto dei vicini | x 72%, al 78% | 14vh | spunta con dentro «la dogsitter sudamericana» |
| | Caterina | da x 30% a x 60% | 45vh | cambia in s11-cate-dogsitter; corre trascinata dai cani |
| | s11-cani (4) | davanti a lei, a terra | 15vh | entrano da sinistra correndo |

---

## S12 — La mediatrice culturale · scroll totale 390vh
Sfondo carta `#fcfbfa`. Caterina ragazza, 45vh.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | condominio, vicini, fumetto, cani | — | — | escono |
| | Caterina | torna a x 50% | 45vh | cambia in s12-cate-ragazza |
| **b1** · 90vh<br>Ma essere mezza sudamericana, oltre a qualche insulto velatamente razzista… | s12-insulti [DA DEFINIRE] | x 70%, al 60% | 12vh | sfuma |
| **b2** · 60vh<br>…e qualche aggiuntina di traumi… | s01-ampolla (richiamo alla scena 1) | x 80%, al 72% | 12vh | spunta; ne cade una goccia corallo fino a terra; poi l'ampolla sfuma |
| **b3** · 90vh<br>…ha fatto sì che Caterina diventasse una mediatrice culturale… | insulti | — | — | escono |
| | Caterina | x 50% | 45vh | cambia in s12-cate-mediatrice |
| | s12-fumetti-lingue (3) | x 32% al 65%, x 50% all'82%, x 68% al 65% | 12vh | spuntano uno dopo l'altro |
| **b4** · 90vh<br>…per donne e bambine immigrate, negli ospedali e nei consultori. | s12-ospedale | x 14%, a terra | 40vh | entra da sinistra |
| | s12-consultorio | x 86%, a terra | 35vh | entra da destra |
| | s12-donne-bambine [DA DEFINIRE] | x 32% e x 68%, a terra | 40vh | spuntano |

---

## S13 — Da dicembre a maggio (il bugiardino) · scroll totale 800vh
Sostituisce le vecchie S13 Laurea, S14 Borsa e S15 Aprile–maggio.

Sfondo giallo `#fed728` che si spegne battuta dopo battuta fino al grigio `#b0b4ba` (b11), poi nero (b13). Caterina adulta, 50vh, x 50%, a terra.

**Ritmo** (musica: canzone-4): è un montaggio veloce, letto d'un fiato come il foglietto illustrativo di un farmaco: battute corte (50–60vh). **Niente esce**: ogni oggetto resta in scena e si somma agli altri, attorno a lei o attaccato a lei, leggermente ruotato, fino alla b13. In questa scena il sottotitolo ha l'aspetto di un **bugiardino** (classe `is-bugiardino`: foglio bianco stretto, testo piccolo in grazie, intestazione fissa «CATERINA · foglietto illustrativo · posologia: da dicembre a maggio»).

**Tre fasi di Caterina**: fase 1 colorata con capelli lunghi (laurea), fase 2 capelli corti e prime occhiaie (magistrale), fase 3 grigia con occhiaie forti. In più il codice abbassa la saturazione di Caterina a ogni battuta (filtro, da 1 a 0.35 tra b2 e b8), che torna piena solo quando cambia in «amici».

**Oggetti cliccabili** (bottoni con nome accessibile che aprono il foglio degli approfondimenti; contenuti in `assets/media/s13/`, per ora segnaposto): computer → esperimento Minecraft; busta → mail della borsa + schermate dell'app per maranza; logo Abilicity → link all'articolo; progetto finale → progetto dell'app per daltonici + la gag. Si riconoscono da un piccolo puntino di carta che pulsa.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | elementi di S12 | — | — | escono |
| | Caterina | x 50%, a terra | 50vh | cambia in s13-cate-fase-1 (capelli lunghi, colorata) |
| | intestazione del bugiardino | sopra i sottotitoli | — | si srotola |
| **b1** · 50vh<br>Caterina, da dicembre a maggio: si è laureata in Scienze psicosociali, | s13-corona (alloro) | sulla sua testa | 8vh | cade dall'alto e si posa storta sulla testa; resta attaccata a lei |
| | s13-spritz | nella sua mano destra | 8vh | cade e le finisce in mano; resta attaccato |
| | s13-coriandoli (riusa quelli esistenti) | dal cielo | 2–3vh | piovono |
| **b2** · 50vh<br>ha iniziato la magistrale in Teoria e tecnologia della comunicazione, | Caterina | x 50% | 50vh | cambia in s13-cate-fase-2 (capelli corti, prime occhiaie) |
| | s13-computer (**cliccabile**) | x 30%, al 30% | 14vh | spunta; sullo schermo un paesaggio a blocchi generico |
| **b3** · 50vh<br>ha vinto una borsa di studio per il master con un'app per maranza, | s13-busta-borsa (**cliccabile**) | x 70%, al 62% | 10vh | entra volando da destra e si apre |
| **b4** · 50vh<br>ha dato gli esami del primo semestre, | s13-libri | x 36%, a terra | 6 → 16vh | la pila cresce a scatti seguendo lo scroll |
| **b5** · 60vh<br>ha portato un suo vecchio progetto, Abilicity, in una mostra digitale delle Paralimpiadi invernali, | s13-abilicity-logo (**cliccabile**, file fornito da Caterina) | x 72%, al 40% | 10vh | spunta come un cartellino appeso |
| **b6** · 50vh<br>ha fatto una vagonata di networking agli eventi, | Caterina | x 50% | 50vh | cambia in s13-cate-fase-3 (grigia, occhiaie forti) |
| | s13-telefono-notifiche con `sticker/sticker-linkedin` sullo schermo | x 26%, al 55% | 14vh | spunta; il badge «100» (HTML) conta da 1 a 100 seguendo lo scroll |
| | s13-biglietti (biglietti da visita, 6 copie) | tutto attorno | 4vh | piovono e si accumulano ai suoi piedi |
| **b7** · 60vh<br>ha continuato a fare la mediatrice negli ospedali, per donne e bambine immigrate, assistendo a visite… ecco, non sempre allegre, | s13-badge-mediatrice | sul petto di Caterina | 5vh | si attacca |
| | s13-nuvoletta-grigia | sopra la sua testa | 10vh | spunta e resta, piovigginando |
| **b8** · 60vh<br>e ha concluso il master… uhm… presentando in ritardo il progetto finale. | s13-sveglia | x 64%, a terra | 8vh | spunta e trema |
| | s13-progetto-finale (**cliccabile**) | x 60%, al 30% | 12vh | arriva trascinato in ritardo da destra |
| **b9** · 50vh<br>Però ha conosciuto dei bellissimi amici, | Caterina | x 50% | 50vh | cambia in s13-cate-amici (viso ancora stanco, vestiti colorati); la saturazione torna piena |
| | s13-amico-1…4 (facce di carta) | attorno alla sua testa, tra il 65% e l'80% | 9vh | spuntano una alla volta |
| **b10** · 50vh<br>e ha imparato un sacco di cose. | Caterina | x 50% | 50vh | cambia in s13-cate-hyperfocus (occhi a palla) |
| | sticker da `assets/img/sticker/` (figma, claude, miro, antigravity) | sparsi attorno a lei | 7vh | si «schiaffano» come adesivi (scala 1.3 → 1, rotazione casuale ±12°), **non** sono carta: niente texture né ombra papercut, solo una leggera ombra da adesivo |
| **b11** · 60vh<br>Poi le avversità della vita… | s13-avversita-1…3 [DA DEFINIRE] | cadono dall'alto attorno a lei | 12vh | cadono pesanti; lo sfondo arriva al grigio |
| **b12** · 60vh<br>…e ogni tanto Silvelena e Liborio, con una nuvoletta, ne aggiungevano un'altra. | s13-papa-busto, s13-mamma-busto | x 8% e x 92%, al 20% | 25vh | entrano dai lati (papà a sinistra, mamma a destra) |
| | s13-nuvoletta-genitori (2 copie) | dalla bocca di ciascuno | 12vh | spuntano; da ciascuna cade un problema (s13-problema-1, -2 [DA DEFINIRE], 8vh) su Caterina |
| **b13** · 90vh<br>(nessun testo) | tutti gli oggetti della scena | — | — | **si moltiplicano** (cloni sfalsati che spuntano sempre più fitti) fino a coprire tutta la pagina; poi lo schermo va al **nero** |

Tutto il montaggio: voce registrata tutta d'un fiato e tagliata in un file per battuta (`s13-b1.mp3` … `s13-b12.mp3`).

**Musica**: `assets/musica/canzone-4.mp3` di sottofondo per tutto il montaggio. Entra al cambio scena (sfumata in 1 secondo, volume 0.3; scende a 0.2 mentre parla la voce), continua fino alla b12. Alla b13, mentre tutto si moltiplica, il volume sale fino a 0.6 e la velocità di riproduzione sale da 1 a 1.25 seguendo lo scroll; quando lo schermo diventa nero la musica si **interrompe di colpo** (silenzio fino a Maya). Tornando indietro riparte dal punto giusto solo scorrendo di nuovo in avanti.

---

## S14 — L'Olanda · scroll totale 420vh
Parte dal nero `#000`. Il colore torna poco a poco: nero → blu notte → azzurro cielo `#cfe6ff` (b2–b3) → pieno colore (b4).

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | tutto | — | — | resta il nero |
| **b1** · 90vh<br>(nessun testo) | s14-maya-fronte (Maya vista di fronte) | x 50%, al 45% | 6 → 60vh | si avvicina dal buio: cresce seguendo lo scroll, trotterellando |
| | s14-maya-bacio (primo piano, lingua fuori) | x 50%, al 50% | 90vh | a fine battuta sostituisce la precedente e «lecca» lo schermo (scatto in avanti 1 → 1.08 → 1); spunta un piccolo cuore di carta (s14-cuore, 6vh) |
| **b2** · 90vh<br>Allora io, Ale e Maya abbiamo girato l'Olanda… | Maya | — | — | torna piccola e va a terra a x 40% (s09-maya, 18vh) |
| | s14-mulino, s14-tulipani, s14-bici | x 15%, x 50% (in basso, larga), x 82% | 45vh, 12vh, 18vh | salgono dal basso, ancora desaturati |
| | Caterina (s13-cate-fase-3), s09-ale | x 50% e x 64%, a terra | 50vh, 55vh | entrano camminando da sinistra |
| **b3** · 90vh<br>…abbiamo respirato, e ci siamo goduti ogni giorno come se potesse essere l'ultimo. | tutta la scena | — | — | la saturazione sale seguendo lo scroll |
| | Caterina | x 50% | 50vh | respiro profondo (scala 1 → 1.06 → 1, lento) |
| **b4** · 90vh<br>E tutto è tornato a colori. | mulino, tulipani, bici | — | — | escono in basso |
| | s14-prato (fondale) | tutta la larghezza, a terra | 30vh | sale dal basso, pieno colore |
| | Caterina (s15-cate-colorata), Ale, Maya | x 45%, x 60%, x 35% | 50vh, 55vh, 18vh | a inizio battuta passano alle versioni **di spalle** (s14-cate-spalle, s14-ale-spalle, s14-maya-spalle) e **corrono via uno alla volta** verso l'orizzonte del prato: prima Maya, poi Ale, poi Caterina (sfalsati di ~1/4 di battuta). Ognuno sale verso ~40% dello schermo e si rimpicciolisce a 1/5 (50→10, 55→11, 18→4vh), con piccolo rimbalzo di corsa; a fine battuta spariscono all'orizzonte |

**Musica**: `assets/musica/canzone-1.mp3` entra piano dalla b2 (volume basso, 0.25), sale un po' alla b4 e sfuma al cambio scena.

---

## S15 — Cosa ama Caterina · scroll totale 860vh
Sfondo viola `#7a35ee`, dietro Caterina un grande cerchio di carta gialla (60vh). Caterina adulta, 50vh, sola, al centro, a terra.

**Idea**: Caterina parte con vestiti neutri e si «rivestisce» di colore battuta dopo battuta. Due immagini nella stessa posa e sulla stessa tela, `s15-cate-base` (neutra) e `s15-cate-colorata`: il livello colorato sale di opacità da 0 (b1) a 1 (b9). A ogni cosa che ama, un **ciondolo** entra grande accanto a lei, poi rimpicciolisce e va ad appendersi alla sua cintura, come un portachiavi sempre più esagerato. Ciondoli 4–5vh appesi, distribuiti lungo la cintura (circa al 45% della sua altezza), che oscillano a tempo reale.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | prato, Ale, Maya | — | — | escono correndo a destra |
| | Caterina | x 50% | 50vh | cambia in s15-cate-base (telefono in mano, auricolari nelle orecchie) |
| **b1** · 90vh<br>Caterina ama la musica, l'arte, i videogame… | Caterina | — | — | a inizio battuta si infila gli auricolari (piccolo sobbalzo); parte `assets/musica/canzone-2.mp3` |
| | s15-ciondolo-nota, -tavolozza, -gamepad | alla cintura | 10 → 4vh | entrano uno dopo l'altro |
| **b2** · 90vh<br>…il buon cibo (profilo Hinge di un uomo performativo)… | s15-telefono-dating + s15-foto-cibo-1…3 | x 80%, al 50% | 18vh | come prima: spunta, mostra 3 foto di cibo, esce |
| | s15-ciondolo-forchetta | alla cintura | 4vh | entra |
| **b3** · 60vh<br>…i cedri, Glee, Futurama… | s15-ciondolo-cedro, -microfono, -tv | alla cintura | 4vh | entrano |
| **b4** · 130vh<br>…i Pokémon, soprattutto perché da piccola non glieli compravano, e ora li colleziona con Alessandro… | s09-ale con s15-carta-in-mano (carta inventata) | x 78%, a terra | 55vh | spunta |
| | s15-ciondolo-carta | alla cintura | 4vh | entra |
| **b5** · 60vh<br>…il judo… | s15-ciondolo-judo (cintura annodata) | alla cintura | 4vh | entra |
| **b6** · 90vh<br>…le cose simpatiche come questa, da fare con l'aiuto dell'AI… | s15-ciondolo-scintilla | alla cintura | 4vh | entra |
| | barra di avanzamento | in alto | — | brilla una volta |
| **b7** · 90vh<br>…i gattini, i cagnolini, ma ogni essere vivente… | s15-gattino, s09-maya | x 36% e x 62%, a terra | 15vh, 18vh | entrano correndo e si siedono |
| | s15-ciondolo-zampa | alla cintura | 4vh | entra |
| **b8** · 60vh<br>…essere utile… | s15-ciondolo-cuore | alla cintura | 4vh | entra |
| **b9** · 130vh<br>…arrampicarsi a cazzo di cane, cadere e rialzarsi. | s15-parete-arrampicata | x 88%, a terra | 70vh | sale dal basso |
| | Caterina | da x 50% alla parete e ritorno | 50vh | come prima: corre, sale goffamente, **cade**, si rialza e torna al centro; i ciondoli sbatacchiano |
| | s15-ciondolo-moschettone | alla cintura | 4vh | entra quando si rialza; ora Caterina è a pieno colore |

**Musica**: canzone-2 a volume medio-basso (0.35), sotto la voce (se la voce è attiva scende a 0.2 mentre parla); sfuma alla b1 di S16.

---

## S16 — Il saggio · scroll totale 380vh + video
Sfondo viola come S15.

| Battuta · scroll | Elemento | Dove | Altezza | Cosa fa |
|---|---|---|---|---|
| **cambio scena** · 60vh | Ale, gattino, Maya, parete | — | — | escono |
| **b1** · 90vh<br>Ah! E ho fatto anche il saggio di danza polinesiana con le mie amichette. | Caterina | x 50% | 50vh | alza il telefono verso di noi (piccola rotazione) |
| | canzone-2 | — | — | sfuma |
| **b2** · 130vh<br>(nessun testo) | s16-telefono-grande (cornice di telefono di carta, schermo vuoto) | parte dalla sua mano, finisce a tutto schermo | 8 → 110vh | cresce seguendo lo scroll finché lo schermo del telefono copre la pagina; Caterina e sfondo restano dietro |
| | s16-play (grande bottone play di carta, **`<button>`** «Guarda il saggio») | centro | 18vh | spunta a fine crescita |
| **b3** · 100vh<br>(nessun testo) | video `assets/musica/video-3.mp4` | dentro lo schermo del telefono, a tutto schermo | — | parte **solo al clic** su play, con audio; controlli: pausa/ripresa cliccando, Esc ferma |
| | testo HTML Chunko bold nero «Grazie a chi mi ha accompagnata fin qua» | al 70% | ~5vh | spunta sopra il video al 20% della durata del video |
| | testo Chunko bold nero «Grazie a voi per l'opportunità» | al 50% | ~5vh | spunta al 50% della durata |
| | testo Chunko bold nero «Buona giornata e buon lavoro!» | al 30% | ~5vh | spunta all'80% della durata |
| | s16-logo + bottone **Ricomincia** | x 50%, al 58% / al 14% | 40vh / 7vh | a fine video; al clic lo scroll torna all'inizio (3 secondi, Lenis) |

Le scritte sono immagini papercut; il loro testo c'è anche in HTML (nascosto alla vista, letto dagli screen reader). **Se il video non parte** (nessun clic, prefers-reduced-motion o file mancante): le tre scritte, il logo e Ricomincia compaiono seguendo lo scroll durante la b3, sopra un fotogramma fermo (poster `s16-video-poster.jpg`). Con prefers-reduced-motion il telefono è già a tutto schermo senza crescita.

«Buona giornata» richiama il fumetto della mamma nella scena 1.

**Musica e video**: solo file forniti da Caterina in `assets/musica/` (canzone-1.mp3, canzone-2.mp3, video-3.mp4, canzone-4.mp3, canzone-5.mp3). Nuovo interruttore **MUSICA** accanto a VOCE (predefinito acceso); la musica parte solo dopo il primo clic o tasto (come la voce), va avanti solo scorrendo in avanti, si ferma tornando indietro prima della sua scena.

---

## Checklist (ordine di lavoro per PROGRESSO.md)

1. Scena 1 — correzioni e allineamento alle misure di questo file
2. Barra di avanzamento
3. S00 — Titolo "Ciao"
4. Sistema approfondimenti (bottone + foglio + segnaposto)
5. Personaggio centrale che si muove (campo `move`)
6. S02
7. S03
8. S04
9. S05
10. S06
11. S07
12. S08
13. S09
14. S10
15. S11
16. S12
17. S13 Da dicembre a maggio (bugiardino)
18. S14 L'Olanda
19. S15 Cosa ama Caterina (ciondoli)
20. S16 Il saggio (telefono, video, scritte, logo, Ricomincia)
