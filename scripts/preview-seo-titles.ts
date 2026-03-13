import { generateSeoPages } from '../src/shared/config/seo/seoPages';

const pages = generateSeoPages();

// 영양테마 페이지 샘플
console.log('=== 영양테마 페이지 ===');
const nutritionPages = pages.filter(p =>
  Object.keys(p.params).some(k => k.startsWith('min') || (k.startsWith('max') && k !== 'maxCost'))
  && !p.params.ingredientIds
  && !p.params.dishType
  && !p.params.tags
);
nutritionPages.slice(0, 7).forEach(p => {
  console.log(`📌 ${p.title}`);
  console.log(`   ${p.description}`);
  console.log();
});

// 재료 × 영양테마
console.log('=== 재료 × 영양테마 ===');
const ingNutrition = pages.filter(p =>
  p.params.ingredientIds &&
  Object.keys(p.params).some(k => k.startsWith('min') || (k.startsWith('max') && k !== 'maxCost'))
);
ingNutrition.slice(0, 5).forEach(p => {
  console.log(`📌 ${p.title}`);
  console.log(`   ${p.description}`);
  console.log();
});

// 재료 × dishType
console.log('=== 재료 × dishType ===');
const ingDish = pages.filter(p => p.params.ingredientIds && p.params.dishType && !p.params.tags);
ingDish.slice(0, 3).forEach(p => {
  console.log(`📌 ${p.title}`);
});

// 3차원 조합
console.log('\n=== 3차원 (재료×dish×tag) ===');
const triple = pages.filter(p => p.params.ingredientIds && p.params.dishType && p.params.tags);
triple.slice(0, 3).forEach(p => {
  console.log(`📌 ${p.title}`);
});

console.log(`\nTotal pages: ${pages.length}`);
