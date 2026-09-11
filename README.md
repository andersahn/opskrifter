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

To måder:

- `relaterede:` i frontmatter tager en liste af **filnavne uden `.md`** og
  viser dem som links nederst på siden. Et navn der ikke findes, springes over.
- Midt i teksten: helt almindelige markdown-links,
  `[mayonnaise](/opskrifter/mayonnaise/)`.

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
src/opskrifter/             Opskrifterne, én markdown-fil hver
src/billeder/               Billeder
src/css/style.css           Al styling, med lys og mørk tilstand
```
