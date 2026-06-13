import type { SearchDiscoveryDict } from "../../types";

export const searchDiscovery: SearchDiscoveryDict = {
  searchInputAria: "レシピを検索",
  searchClearAria: "入力をクリア",
  recentSearchTitle: "最近の検索",
  recentViewedTitle: "最近見たレシピ",
  clearAction: "クリア",
  latestRecipesTitle: "できたての新着レシピ",
  contentSectionTitle: "こんなレシピはいかが？",
  nutritionSectionTitle: "今日はどんな一品にする？",
  placeholders: {
    breakfast: [
      "朝にうれしい「卵焼き」を検索",
      "5分で「トースト」を検索",
      "やさしい「おかゆ」を検索",
      "ほっと「味噌汁」を検索",
    ],
    lunch: [
      "がっつり「牛丼」を検索",
      "ひとりランチ「ラーメン」を検索",
      "ふんわり「オムライス」を検索",
      "サクサク「唐揚げ」を検索",
    ],
    dinner: [
      "定番「カレー」を検索",
      "ほっこり「肉じゃが」を検索",
      "仕事帰りに「焼き鳥」を検索",
      "あったか「鍋」を検索",
    ],
  },
  contentPages: {
    "diet-healthy": {
      title: "🥗 軽やかなヘルシーごはん",
      subtitle: "低カロリー・高たんぱく",
    },
    "ai-creative": {
      title: "🤖 AIが考えた新しい組み合わせ",
      subtitle: "自分では思いつかないレシピ",
    },
    "chef-secret": {
      title: "👨‍🍳 人気シェフの定番レシピ",
      subtitle: "登録者100万人のレシピ",
    },
    "solo-drink": {
      title: "🍶 おうちで楽しむ家飲み",
      subtitle: "10分でできるおつまみ",
    },
    "budget-gourmet": {
      title: "💰 ちょっと贅沢な節約ごはん",
      subtitle: "コスパのいいレシピ",
    },
    "late-night-guilty": {
      title: "🌙 夜食にうれしい一品",
      subtitle: "低カロリーで安心",
    },
    "youtube-mukbang": {
      title: "📺 動画で見たあの料理",
      subtitle: "おうちで再現するレシピ",
    },
    "hangover-soup": {
      title: "🍲 飲んだ翌日の一杯",
      subtitle: "やさしいスープ・汁物",
    },
    "air-fryer-legend": {
      title: "🔥 エアフライヤーの定番",
      subtitle: "人気の簡単レシピ",
    },
    "kids-snack": {
      title: "🧒 子どもが喜ぶおやつ",
      subtitle: "家族で楽しむ手作り",
    },
    "home-party-flex": {
      title: "🏠 おもてなしのホームパーティ",
      subtitle: "見映えするメニュー",
    },
    "protein-bulk": {
      title: "💪 高たんぱくの食事管理",
      subtitle: "たんぱく質30g以上",
    },
  },
  nutritionThemes: {
    KETO: { label: "ケト" },
    LOW_SUGAR: { label: "低糖質" },
    HIGH_PROTEIN: { label: "高たんぱく" },
    WEGOVY_FRIENDLY: { label: "GLP-1向け" },
    ANTI_AGING: { label: "エイジングケア" },
    LOW_CALORIE: { label: "低カロリー" },
    LOW_FAT: { label: "低脂質" },
    LOW_SODIUM: { label: "減塩" },
    BALANCED: { label: "バランス食" },
    BUDGET: { label: "節約" },
  },
};
