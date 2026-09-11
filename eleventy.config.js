export default function (eleventyConfig) {
  // Billeder og CSS kopieres råt over i _site/
  eleventyConfig.addPassthroughCopy("src/billeder");
  eleventyConfig.addPassthroughCopy("src/css");

  // Alle opskrifter, sorteret alfabetisk efter dansk sortering (æ ø å til sidst)
  eleventyConfig.addCollection("opskrifter", (collection) =>
    collection
      .getFilteredByGlob("src/opskrifter/*.md")
      .sort((a, b) => a.data.titel.localeCompare(b.data.titel, "da"))
  );

  // Unikke kategorier på tværs af alle opskrifter — bruges til /kategori/-siderne
  eleventyConfig.addCollection("kategorier", (collection) => {
    const set = new Set();
    for (const item of collection.getFilteredByGlob("src/opskrifter/*.md")) {
      for (const tag of item.data.tags || []) set.add(tag);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "da"));
  });

  // Ingredienser må skrives enten som en flad liste eller som grupper med
  // overskrift. Her laves begge former om til én fælles struktur, så skabelonen
  // kun skal kunne håndtere ét format.
  eleventyConfig.addFilter("grupper", (ingredienser) => {
    if (!ingredienser) return [];
    const grupper = [];
    let løse = null;
    for (const post of ingredienser) {
      if (typeof post === "string") {
        if (!løse) grupper.push((løse = { gruppe: null, liste: [] }));
        løse.liste.push(post);
      } else {
        løse = null;
        grupper.push({ gruppe: post.gruppe, liste: post.liste || [] });
      }
    }
    return grupper;
  });

  // Slå en opskrift op på dens filnavn — bruges af "relaterede:" i frontmatter
  eleventyConfig.addFilter("opskriftBySlug", function (slug) {
    const alle = this.ctx.collections.opskrifter || [];
    return alle.find((o) => o.fileSlug === slug);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
