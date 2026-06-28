import { checkCanonical } from "./checks/canonical.js";
import { checkJsonLd } from "./checks/jsonLd.js";
import { checkLighthouseSeo } from "./checks/lighthouse.js";
import { checkOgTags } from "./checks/ogTags.js";
import { checkRecipeMeta } from "./checks/recipeMeta.js";
import { checkRobots } from "./checks/robots.js";
import {
  checkSitemaps,
  checkSitemapUrlCountDrop,
  pickRandomSampleUrls,
  pickRecipeSampleUrls,
} from "./checks/sitemap.js";
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

  // Step 1: robots.txt + sitemaps 병렬 실행 (독립적)
  console.log("Checking robots.txt + sitemaps...");
  const [robotsResults, { results: sitemapResults, allUrls }] =
    await Promise.all([checkRobots(), checkSitemaps()]);

  const allResults: CheckResult[] = [...robotsResults, ...sitemapResults];

  // Step 2: 샘플 구성
  const recipeSampleUrls = pickRecipeSampleUrls(allUrls);
  const fixedSamplePages = [...config.samplePages, ...recipeSampleUrls];
  const randomUrls = pickRandomSampleUrls(allUrls);

  console.log(
    `Sample pages: ${fixedSamplePages.length} fixed + ${randomUrls.length} random`
  );

  // Step 3: OG + JSON-LD + Canonical + Random OG 병렬 실행
  console.log("Checking OG tags, JSON-LD, canonical, random samples...");
  const [ogResults, jsonLdResults, canonicalResults, randomResults] =
    await Promise.all([
      checkOgTags(fixedSamplePages),
      checkJsonLd(fixedSamplePages),
      checkCanonical(fixedSamplePages),
      checkOgTags(randomUrls),
    ]);

  allResults.push(
    ...ogResults,
    ...jsonLdResults,
    ...canonicalResults,
    ...randomResults
  );

  // Deep-only checks
  if (tier === "deep") {
    console.log("Running deep checks...");
    const lighthousePages = ["/", ...recipeSampleUrls.slice(0, 2)];

    // URL count + recipe meta 병렬, Lighthouse는 순차 (무거움)
    const [countResults, recipeMetaResults] = await Promise.all([
      checkSitemapUrlCountDrop(allUrls),
      checkRecipeMeta(recipeSampleUrls),
    ]);
    allResults.push(...countResults, ...recipeMetaResults);

    console.log("Running Lighthouse SEO audit...");
    const lighthouseResults = await checkLighthouseSeo(lighthousePages);
    allResults.push(...lighthouseResults);
  }

  reportAndExit(allResults);
};

main().catch((err) => {
  console.error("SEO health check crashed:", err);
  process.exit(1);
});
