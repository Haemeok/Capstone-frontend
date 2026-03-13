import { generateSeoPages } from '../src/shared/config/seo/seoPages';

const pages = generateSeoPages();
console.log('Total SEO pages:', pages.length);

let qOnly = 0, ingOnly = 0, ingDish = 0, ingTag = 0, ingCost = 0;
let dishTag = 0, costCombo = 0, nutritionCombo = 0, ingNutrition = 0, triple = 0;

for (const p of pages) {
  const keys = Object.keys(p.params);
  const hasIng = keys.includes('ingredientIds');
  const hasDish = keys.includes('dishType');
  const hasTag = keys.includes('tags');
  const hasCost = keys.includes('maxCost');
  const hasQ = keys.includes('q');
  const hasNutrition = keys.some(k => (k.startsWith('min') || k.startsWith('max')) && k !== 'maxCost');

  if (hasQ) qOnly++;
  else if (hasIng && hasDish && hasTag) triple++;
  else if (hasIng && hasNutrition) ingNutrition++;
  else if (hasIng && hasDish) ingDish++;
  else if (hasIng && hasTag) ingTag++;
  else if (hasIng && hasCost) ingCost++;
  else if (hasIng) ingOnly++;
  else if (hasDish && hasTag) dishTag++;
  else if (hasCost) costCombo++;
  else nutritionCombo++;
}

console.log('A. q only:', qOnly);
console.log('B. ingredient only:', ingOnly);
console.log('C. ingredient×dish:', ingDish);
console.log('D. ingredient×tag:', ingTag);
console.log('E. ingredient×cost:', ingCost);
console.log('F. dish×tag:', dishTag);
console.log('G. cost combos:', costCombo);
console.log('H. nutrition combos:', nutritionCombo);
console.log('I. ingredient×nutrition:', ingNutrition);
console.log('J. triple (ing×dish×tag):', triple);

// Sample pages
console.log('\n--- Sample pages ---');
const samples = [
  pages.find(p => p.params.ingredientIds && p.params.dishType && !p.params.tags),
  pages.find(p => p.params.ingredientIds && p.params.tags && !p.params.dishType),
  pages.find(p => p.params.ingredientIds && p.params.dishType && p.params.tags),
  pages.find(p => p.params.maxCost && p.params.tags),
  pages.find(p => p.params.minProtein),
];
samples.forEach(s => s && console.log(JSON.stringify(s, null, 0)));
