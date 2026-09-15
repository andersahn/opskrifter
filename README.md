# Opskrifter

Statisk opskriftssamling bygget med [Eleventy](https://www.11ty.dev/).
Ingen database, ingen backend — kun HTML-filer der lægges på GitHub Pages.

## Kom i gang

```bash
npm install
npm start     # http://localhost:8080, bygger om ved hver gemt fil
npm run build # bygger til _site/
```

## Ny opskrift

Læg en `.md`-fil i `src/opskrifter/`. Filnavnet bliver adressen:
`src/opskrifter/aioli.md` → `/opskrifter/aioli/`. Den kommer automatisk på
forsiden og på sine kategorisider — der er ingen liste der skal opdateres.

```markdown
---
titel: Aioli
beskrivelse: Kort linje der står på forsidekortet.
tid: 15 minutter
portioner: ca. 250 ml
sværhedsgrad: Nem
tags:
  - Saucer
billede: /billeder/aioli.webp
billedtekst: Aioli med et drys persille.
relaterede:
  - mayonnaise
ingredienser:
  - 2 æggeblommer, stuetemperatur
  - 3 fed hvidløg
---

## Fremgangsmåde

1. Første trin.
2. Andet trin.
```

Alle felter undtagen `titel` kan udelades. Mangler `billede`, viser kortet på
forsiden et neutralt farvefelt i stedet.

### Ingredienser i grupper

Skal opskriften deles op, kan `ingredienser` skrives med overskrifter:

```yaml
ingredienser:
  - gruppe: Til dejen
    liste:
      - 500 g hvedemel
      - 300 ml vand
  - gruppe: Til fyldet
    liste:
      - 400 g hakkede tomater
```

### Links mellem opskrifter

Tre måder, alle med almindelige rod-relative stier:

- `relaterede:` i frontmatter tager en liste af **filnavne uden `.md`** og
  viser dem som links nederst på siden. Et navn der ikke findes, springes over.
- Midt i teksten: helt almindelige markdown-links,
  `[mayonnaise](/opskrifter/mayonnaise/)`.
- **På en ingrediens:** markdown virker også inde i `ingredienser:`, så
  `- 150 g [mayonnaise](/opskrifter/mayonnaise/)` bliver til et klikbart link i
  ingredienslisten.

Du skal ikke tænke på `pathPrefix` nogen af stederne. `HtmlBasePlugin` skriver
det ind i alle links i den færdige HTML, så skriv altid stien fra roden.

## Billeder

Billederne ligger i `src/billeder/` og kopieres direkte over i den byggede side.
Henvis til dem som `/billeder/filnavn.webp`.

**Skalér altid ned før du committer.** Git gemmer hver version af en binær fil
for evigt, så ét uskaleret telefonfoto på 6 MB gør repoet permanent tungere.
1200 px bredde i WebP lander typisk på 100-200 kB:

```bash
brew install imagemagick
magick mogrify -path src/billeder/ -resize 1200x -quality 82 -format webp raw-fotos/*.jpg
```

Skabelonen sætter selv `loading="lazy"` og `width`/`height`, så siden ikke
hopper mens billederne loader.

## Installér som app på telefonen

Siden er en PWA: åbn den i browseren på telefonen og vælg **Føj til
hjemmeskærm** (Safari: del-knappen → Føj til hjemmeskærm; Chrome: menuen →
Installér app). Den åbner så uden browserkrom og virker offline.

- `src/manifest.njk` bliver til `manifest.webmanifest` med navn, farver og
  ikoner.
- `src/sw.njk` bliver til `sw.js`, en service worker der henter alle sider,
  CSS og ikoner ned ved installation. Sider hentes netværk-først, så nye
  opskrifter dukker op med det samme; alt andet serveres fra cachen. Hvert byg
  får et nyt versionsnummer, så telefonen opdaterer sig selv efter en udgivelse.
- `src/offline.njk` vises hvis en side ikke er hentet ned og der ikke er net.
- Ikonerne ligger i `src/ikoner/`. `ikon.svg` er kilden; PNG-udgaverne
  genereres med ImageMagick:

```bash
cd src/ikoner
for s in 192 512; do magick -background none -density 384 ikon.svg -resize ${s}x${s} ikon-$s.png; done
magick -background none -density 384 ikon.svg -resize 180x180 apple-touch-icon.png
magick -background none -density 384 ikon.svg -resize 410x410 -gravity center -background '#9a3b1e' -extent 512x512 ikon-maskable-512.png
```

Alle stier i manifest og service worker går gennem `url`-filtret, så
`pathPrefix` er med når siden ligger under `brugernavn.github.io/opskrifter/`.

## Udgivelse på GitHub Pages

1. Opret et repo på GitHub og push koden.
2. **Settings → Pages → Build and deployment → Source:** vælg **GitHub Actions**.

Det er alt. `.github/workflows/deploy.yml` bygger og udgiver ved hvert push til
`main`, og den sætter selv `pathPrefix` til repo-navnet, så links virker både på
`brugernavn.github.io/opskrifter/` og på et eget domæne.

## Filer

```
eleventy.config.js          Konfiguration, collections og filtre
src/_data/site.json         Sidens navn og undertitel
src/_includes/base.njk      Ydre skabelon: hoved, fod, <head>
src/_includes/opskrift.njk  Skabelonen for en opskriftsside
src/index.njk               Forsiden med opskriftskort
src/kategori.njk            Genererer én side pr. kategori
src/manifest.njk            Web-manifest til installation som app
src/sw.njk                  Service worker, offline-cache
src/offline.njk             Siden der vises uden net
src/ikoner/                 App-ikoner
src/opskrifter/             Opskrifterne, én markdown-fil hver
src/billeder/               Billeder
src/css/style.css           Al styling, med lys og mørk tilstand
```
