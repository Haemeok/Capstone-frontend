import { checkRobots } from "./checks/robots.js";
import {
  checkSitemaps,
  checkSitemapUrlCountDrop,
  pickRecipeSampleUrls,
  pickRandomSampleUrls,
} from "./checks/sitemap.js";
import { checkOgTags } from "./checks/ogTags.js";
import { checkJsonLd } from "./checks/jsonLd.js";
import { checkCanonical } from "./checks/canonical.js";
import { checkLighthouseSeo } from "./checks/lighthouse.js";
import { checkRecipeMeta } from "./checks/recipeMeta.js";
import { config } from "./config.js";
import { reportAndExit } from "./reporter.js";
import type { CheckResult, Tier } from "./types.js";

const parseTier = (): Tier => {
  const tierIdx = process.argv.indexOf("--tier");
  const tier = tierIdx >= 0 ? process.argv[tierIdx + 1] : "daily";

  if (tier !== "daily" && tier !== "deep") {
    console.error(`Invalid tier: ${tier}. Use --tier daily or --tier deep`);
    process.exit(1);
  }

  return tier;
};

const main = async () => {
  const tier = parseTier();
  console.log(`Running SEO health check (tier: ${tier})\n`);

  const allResults: CheckResult[] = [];

  // Step 1: robots.txt
  console.log("Checking robots.txt...");
  const robotsResults = await checkRobots();
  allResults.push(...robotsResults);

  // Step 2: Sitemaps
  console.log("Checking sitemaps...");
  const { results: sitemapResults, allUrls } = await checkSitemaps();
  allResults.push(...sitemapResults);

  // Step 3: Build sample page list
  const recipeSampleUrls = pickRecipeSampleUrls(allUrls);
  const fixedSamplePages = [
    ...config.samplePages,
    ...recipeSampleUrls,
  ];

  console.log(
    `Sample pages: ${fixedSamplePages.length} fixed + ${config.randomSampleCount} random`
  );

  // Step 4: OG tags on fixed samples
  console.log("Checking OG tags (fixed samples)...");
  const ogResults = await checkOgTags(fixedSamplePages);
  allResults.push(...ogResults);

  // Step 5: JSON-LD on fixed samples
  console.log("Checking JSON-LD (fixed samples)...");
  const jsonLdResults = await checkJsonLd(fixedSamplePages);
  allResults.push(...jsonLdResults);

  // Step 6: Canonical on fixed samples
  console.log("Checking canonical URLs (fixed samples)...");
  const canonicalResults = await checkCanonical(fixedSamplePages);
  allResults.push(...canonicalResults);

  // Step 7: Random sample spot-check (OG tags only)
  console.log("Checking random samples from sitemap...");
  const randomUrls = pickRandomSampleUrls(allUrls);
  const randomResults = await checkOgTags(randomUrls);
  allResults.push(...randomResults);

  // Deep-only checks
  if (tier === "deep") {
    // Step 8: Sitemap URL count drop detection
    console.log("Checking sitemap URL count changes...");
    const countResults = await checkSitemapUrlCountDrop(allUrls);
    allResults.push(...countResults);

    // Step 9: Lighthouse SEO
    console.log("Running Lighthouse SEO audit...");
    const lighthousePages = ["/", ...recipeSampleUrls.slice(0, 2)];
    const lighthouseResults = await checkLighthouseSeo(lighthousePages);
    allResults.push(...lighthouseResults);

    // Step 10: Recipe metadata consistency
    console.log("Checking recipe metadata consistency...");
    const recipeMetaResults = await checkRecipeMeta(recipeSampleUrls);
    allResults.push(...recipeMetaResults);
  }

  reportAndExit(allResults);
};

main().catch((err) => {
  console.error("SEO health check crashed:", err);
  process.exit(1);
});
