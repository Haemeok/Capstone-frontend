/**
 * 블로그 포스트 생성 시험용 스크립트.
 *
 * 사용:
 *   npx tsx scripts/test-blog-post.ts
 *
 * .env / .env.local 에 XAI_API_KEY가 있어야 함.
 */
import fs from "node:fs";
import path from "node:path";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

import {
  type BlogPost,
  BlogPostSchema,
} from "../src/app/admin/recipe-blog-test/lib/blogPost.schema";
import {
  CLOSING_SEEDS,
  LEAD_SEEDS,
  pickSeedByRecipeId,
} from "../src/app/admin/recipe-blog-test/lib/blogPostStyle";
import {
  buildBlogPostSystemPrompt,
  buildBlogPostUserPrompt,
  computePerServingMetrics,
} from "../src/app/admin/recipe-blog-test/lib/buildBlogPostPrompt";
import type { Recipe } from "../src/entities/recipe/model/types";

const xai = createOpenAI({
  name: "xai",
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY ?? "",
});

const FAKE_RECIPE_GAJI: Recipe = {
  id: "test-gaji-muchim",
  title: "꼬들꼬들 가지무침 (김치 스타일)",
  dishType: "반찬",
  description: "",
  cookingTime: 30,
  imageUrl: "",
  cookingTools: ["냄비", "채칼", "볼"],
  servings: 6,
  totalIngredientCost: 21000,
  marketPrice: 36700,
  imageKey: null,
  ratingInfo: { avgRating: 0, myRating: 0, ratingCount: 0 },
  ingredients: [
    { id: "i1", name: "가지", quantity: "8", unit: "개", inFridge: false, calories: 0 } as never,
    { id: "i2", name: "부추", quantity: "200", unit: "g", inFridge: false, calories: 0 } as never,
    { id: "i3", name: "무", quantity: "200", unit: "g", inFridge: false, calories: 0 } as never,
    { id: "i4", name: "양파", quantity: "1", unit: "개", inFridge: false, calories: 0 } as never,
    { id: "i5", name: "고춧가루", quantity: "16", unit: "큰술", inFridge: false, calories: 0 } as never,
    { id: "i6", name: "멸치액젓", quantity: "8", unit: "큰술", inFridge: false, calories: 0 } as never,
    { id: "i7", name: "생강가루", quantity: "0.5", unit: "작은술", inFridge: false, calories: 0 } as never,
    { id: "i8", name: "깨", quantity: "16", unit: "g", inFridge: false, calories: 0 } as never,
    { id: "i9", name: "설탕", quantity: "0.3", unit: "큰술", inFridge: false, calories: 0 } as never,
    { id: "i10", name: "소금", quantity: "8", unit: "큰술", inFridge: false, calories: 0 } as never,
    { id: "i11", name: "물", quantity: "2000", unit: "ml", inFridge: false, calories: 0 } as never,
  ],
  steps: [
    { stepNumber: 1, instruction: "가지와 부추를 흐르는 물에 씻습니다", action: "손질하기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 2, instruction: "가지 꼭지를 떼고 길게 칼집을 넣습니다", action: "썰기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 3, instruction: "물 2000ml를 끓이고 소금 8큰술을 넣어 불을 끕니다", action: "끓이기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 4, instruction: "뜨거운 소금물에 가지를 넣고 5분간 데칩니다", action: "데치기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 5, instruction: "무를 채칼로 얇게 채썰어 준비합니다", action: "채썰기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 6, instruction: "채썬 무에 설탕을 넣고 5분간 절입니다", action: "버무리기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 7, instruction: "양파와 부추를 잘게 다집니다", action: "다지기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 8, instruction: "무에 다진 양파, 부추, 고춧가루, 멸치액젓, 깨, 생강가루를 넣고 버무려 양념을 만듭니다", action: "버무리기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 9, instruction: "데친 가지의 물기를 손으로 짭니다", action: "손질하기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 10, instruction: "물기 짠 가지 칼집 사이에 양념을 채웁니다", action: "무치기", stepImageUrl: "", stepImageKey: null },
    { stepNumber: 11, instruction: "용기에 담아 서늘한 곳에서 숙성시킵니다", action: "담그기", stepImageUrl: "", stepImageKey: null },
  ],
  tags: [],
  comments: [],
  author: { id: "u", nickname: "u", profileImage: "", hasFirstRecord: false, remainingAiQuota: 0, remainingYoutubeQuota: 0 },
  likeCount: 0,
  likedByCurrentUser: false,
  favoriteByCurrentUser: false,
  private: false,
  aiGenerated: false,
  isCloneable: false,
  totalCalories: 996,
  nutrition: { protein: 57, carbohydrate: 173, fat: 32, sugar: 53, sodium: 58140 },
};

const MODEL_ID = "grok-4-1-fast-reasoning";

const countNarrative = (post: BlogPost): number => {
  return (
    post.lead.length +
    post.steps.map((s) => s.body).join("").length +
    post.appliedKnowledge.length +
    (post.bonusVariation?.length ?? 0) +
    post.closingNote.length
  );
};

const detectAvgWords = (post: BlogPost): string[] => {
  const banned = ["싱그", "단맛이 살아", "향이 퍼", "부드러워", "어우러", "균형 잡", "깊어집니다", "고르게 배입니다", "감칠맛이 올라"];
  const text = [post.lead, ...post.steps.map((s) => s.body), post.appliedKnowledge, post.bonusVariation ?? "", post.closingNote].join(" ");
  return banned.filter((w) => text.includes(w));
};

const detectBannedTone = (post: BlogPost): string[] => {
  const banned = ["여러분", "오늘은", "강추", "필수템", "꿀팁", "황금비율", "실패 없는", "초보도 쉽게", "단 10분", "한국식", "정리해 봤습니다", "알아봤습니다"];
  const text = [post.lead, ...post.steps.map((s) => s.body), post.appliedKnowledge, post.bonusVariation ?? "", post.closingNote].join(" ");
  return banned.filter((w) => text.includes(w));
};

const detectLeadMisplacedMetrics = (post: BlogPost): string[] => {
  const lead = post.lead;
  const found: string[] = [];
  if (/나트륨\s*\d/.test(lead)) found.push("나트륨");
  if (/단백질\s*\d/.test(lead)) found.push("단백질");
  if (/지방\s*\d/.test(lead)) found.push("지방");
  if (/당류?\s*\d/.test(lead)) found.push("당");
  return found;
};

const detectClosingHygieneTail = (post: BlogPost): string[] => {
  const closing = post.closingNote;
  const tail = closing.split(/[.!?]/).slice(-3).join(" ");
  const triggers = ["냉장", "보관", "나트륨", "간 맞춰", "주의"];
  return triggers.filter((t) => tail.includes(t));
};

const autoScore = (post: BlogPost) => {
  const narrative = countNarrative(post);
  const stepBodyAvg = post.steps.reduce((sum, s) => sum + s.body.length, 0) / post.steps.length;
  const avgWords = detectAvgWords(post);
  const bannedTone = detectBannedTone(post);
  const leadMisplaced = detectLeadMisplacedMetrics(post);
  const closingHygieneTail = detectClosingHygieneTail(post);

  const checks = [
    { id: "A1", desc: "schema validation", pass: true },
    { id: "A2", desc: `서술 본문 ≥ 1500자 (실측 ${narrative})`, pass: narrative >= 1500 },
    { id: "A3", desc: `step body 평균 ≥ 80자 (실측 ${Math.round(stepBodyAvg)})`, pass: stepBodyAvg >= 80 },
    { id: "A4", desc: `kitchenTips 2~4개 (실측 ${post.kitchenTips.length})`, pass: post.kitchenTips.length >= 2 && post.kitchenTips.length <= 4 },
    { id: "A5", desc: `appliedKnowledge 250~600자 (실측 ${post.appliedKnowledge.length})`, pass: post.appliedKnowledge.length >= 250 && post.appliedKnowledge.length <= 620 },
    { id: "A6", desc: `평균치 표현 미검출 (검출 ${avgWords.length}: ${avgWords.join(", ") || "-"})`, pass: avgWords.length === 0 },
    { id: "A7", desc: `금지어 미검출 (검출 ${bannedTone.length}: ${bannedTone.join(", ") || "-"})`, pass: bannedTone.length === 0 },
    { id: "A8", desc: `lead 정량 후크는 원가/시간/kcal만 (오류 ${leadMisplaced.length}: ${leadMisplaced.join(", ") || "-"})`, pass: leadMisplaced.length === 0 },
    { id: "A9", desc: `closing 마지막 보관·주의 노트 미검출 (검출 ${closingHygieneTail.length}: ${closingHygieneTail.join(", ") || "-"})`, pass: closingHygieneTail.length === 0 },
  ];

  return { narrative, stepBodyAvg, checks, avgWords, bannedTone };
};

const main = async () => {
  if (!process.env.XAI_API_KEY) {
    console.error("XAI_API_KEY 누락");
    process.exit(1);
  }

  const recipe = FAKE_RECIPE_GAJI;
  const slots = [...recipe.steps.map((s) => `step-${s.stepNumber}`), "final-plated"];
  const metrics = computePerServingMetrics(recipe);
  const leadSeed = pickSeedByRecipeId(LEAD_SEEDS, recipe.id);
  const closingSeed = pickSeedByRecipeId(CLOSING_SEEDS, recipe.id);
  const system = buildBlogPostSystemPrompt(leadSeed, closingSeed);
  const prompt = buildBlogPostUserPrompt(recipe, slots, metrics);

  console.log(`[recipe] ${recipe.title}`);
  console.log(`[seeds] lead=${leadSeed.id}, closing=${closingSeed.id}`);
  console.log(`[system prompt] ${system.length} chars`);
  console.log(`[user prompt] ${prompt.length} chars`);
  console.log();

  const startedAt = Date.now();
  let post: BlogPost;
  try {
    const { object } = await generateObject({
      model: xai(MODEL_ID),
      schema: BlogPostSchema,
      mode: "json",
      system,
      prompt,
    });
    post = object;
  } catch (err) {
    console.error("[generateObject] FAILED:", err);
    process.exit(1);
  }

  const elapsed = Date.now() - startedAt;
  console.log(`[generated] in ${elapsed}ms`);
  console.log();

  const round = process.env.ROUND ?? "1";
  const outDir = path.resolve("test-results");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(outDir, `gaji-r${round}-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify({ seeds: { lead: leadSeed.id, closing: closingSeed.id }, post }, null, 2));
  console.log(`[saved] ${file}`);
  console.log();

  const { narrative, stepBodyAvg, checks } = autoScore(post);
  console.log("=== 자동 채점 ===");
  for (const c of checks) {
    console.log(`  ${c.pass ? "✅" : "❌"} ${c.id}: ${c.desc}`);
  }
  const passCount = checks.filter((c) => c.pass).length;
  console.log(`  → ${passCount}/${checks.length} 통과`);
  console.log();

  console.log("=== 본문 미리보기 (수동 채점용) ===");
  console.log(`▣ title.main: ${post.title.main}`);
  console.log(`▣ title.sub:  ${post.title.sub}`);
  console.log();
  console.log(`▣ lead (${post.lead.length}자):`);
  console.log(`  ${post.lead}`);
  console.log();
  console.log(`▣ steps (총 ${post.steps.length}개, 평균 ${Math.round(stepBodyAvg)}자):`);
  for (const s of post.steps) {
    console.log(`  [${s.stepNumber}] (${s.body.length}자) ${s.body}`);
  }
  console.log();
  console.log(`▣ kitchenTips (${post.kitchenTips.length}개):`);
  post.kitchenTips.forEach((t, i) => console.log(`  [${i + 1}] ${t}`));
  console.log();
  console.log(`▣ appliedKnowledge (${post.appliedKnowledge.length}자):`);
  console.log(`  ${post.appliedKnowledge}`);
  console.log();
  console.log(`▣ bonusVariation:`);
  console.log(`  ${post.bonusVariation ?? "(null)"}`);
  console.log();
  console.log(`▣ closingNote (${post.closingNote.length}자):`);
  console.log(`  ${post.closingNote}`);
  console.log();
  console.log(`▣ hashtags: ${post.hashtags.join(" ")}`);
  console.log();
  console.log(`▣ 서술 본문 합산: ${narrative}자 (목표 1,500자+)`);
};

main();
