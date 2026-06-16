import type { LandingDict } from "../../types";

export const landing: LandingDict = {
  recipeCount: {
    label: "5万+",
    phrase: "5万件以上",
  },
  hero: {
    badge: "{count} レシピ・YouTubeリンク抽出・AIおすすめ",
    titleLine1: "毎日の料理を",
    titleHighlight: "もっと手軽に、楽しく",
    subjectHighlight: "YouTubeリンク1つでレシピを保存",
    subjectRest: "。{count} のレシピからAIがぴったりをおすすめします",
    cta: "無料で始める",
    checklist: ["登録不要", "全機能を無料で", "1分で開始"],
  },
  problems: {
    eyebrow: "こんな経験ありませんか?",
    title: "料理って、なぜこんなに大変?",
    subtitle: "多くの人が抱える料理の悩み、もう一人で抱えなくて大丈夫",
    items: [
      {
        title: "上がり続ける外食・デリバリー代",
        description: "外食コストが上がる今、家で作るほうが経済的です",
      },
      {
        title: "材料メモが面倒な料理動画",
        description: "動画を止めて材料を書き写す手間はもう不要です",
      },
      {
        title: "余った材料、どうする?",
        description: "作った後に余る材料の使い道に悩んでいませんか",
      },
      {
        title: "料理に時間がかかりすぎる",
        description: "忙しい毎日でも手早く作れるレシピが必要です",
      },
    ],
  },
  stats: {
    title: "実際のユーザーの成果",
    subtitle: "レシピオで料理を始めた人たちのリアルな変化をご覧ください",
    items: [
      {
        metric: "5万+",
        label: "キュレーションレシピ",
        description: "YouTube・人気レシピ・AI生成まで",
      },
      {
        metric: "45%",
        label: "月平均の食費削減",
        description: "デリバリー・外食と比べた節約効果",
      },
      {
        metric: "48分",
        label: "1日の悩む時間を短縮",
        description: "「今日何食べる?」の時間",
      },
      {
        metric: "98%",
        label: "冷蔵庫の食材消費率",
        description: "食材のムダを最小限に",
      },
    ],
  },
  tagChips: {
    eyebrow: "シーン別レシピ",
    title: "どんな日も、どんなシーンも",
    subtitle: "シーンにぴったりのレシピをすぐ見つけられます",
    groupLabels: {
      occasion: "記念日・特別な日",
      situation: "日常・シーン別",
      speed: "時短で作る",
    },
    chipNames: {
      HOME_PARTY: "ホームパーティー",
      HOLIDAY: "記念日",
      BRUNCH: "ブランチ",
      PICNIC: "ピクニック",
      SOLO: "ひとりごはん",
      LUNCHBOX: "お弁当",
      HEALTHY: "ダイエット",
      LATE_NIGHT: "夜食",
      DRINK: "おつまみ",
      HANGOVER: "二日酔い回復",
      CAMPING: "キャンプ",
      KIDS: "子どものおかず",
      QUICK: "超時短",
      AIR_FRYER: "エアフライヤー",
    },
  },
  features: {
    eyebrow: "主な機能",
    title: "料理をもっと手軽にする方法",
    subtitle: "複雑な料理をシンプルに、キッチンをスマートに",
    items: [
      {
        badge: "YouTube抽出",
        title: "YouTubeリンク1つでレシピが完成",
        description:
          "動画を止めてメモする必要はありません。リンクを貼るだけで材料・手順・分量まで自動抽出します。",
        benefits: [
          "材料を自動整理",
          "手順をステップ別に整理",
          "動画と一緒に保存",
          "好きなYouTuberのレシピそのまま",
        ],
      },
      {
        badge: "{count} レシピ",
        title: "国内最大級のキュレーションレシピ",
        description:
          "YouTube由来からAI生成、人気の家庭料理まで{phrase}を一か所で探せます。",
        benefits: [
          "人気の最新レシピ",
          "YouTube由来レシピを多数収録",
          "シーン・記念日別のタグ分類",
        ],
      },
      {
        badge: "AIおすすめ",
        title: "あなただけの最適レシピ",
        description:
          "さまざまな条件からレシピを生成します。AIレシピ生成プラットフォーム",
        benefits: [
          "コスパ重視のレシピ生成",
          "栄養バランス重視のレシピ生成",
          "ファインダイニングのレシピ生成",
          "冷蔵庫の余り食材でレシピ生成",
        ],
      },
      {
        badge: "スマート管理",
        title: "冷蔵庫の食材からレシピを自動提案",
        description:
          "持っている食材を登録すると、AIが作れるレシピを自動で見つけます。ムダなく効率的に。",
        benefits: ["余り食材を活用するレシピ"],
      },
    ],
  },
  testimonials: {
    eyebrow: "ユーザーの声",
    title: "すでに多くの人が体験しています",
    subtitle: "実際のユーザーの率直な声をご覧ください",
    items: [
      {
        name: "田中 健太",
        role: "一人暮らし3年・東京",
        content:
          "冷蔵庫の余り野菜の使い道がいつも悩みでしたが、食材を入れるだけで炒め物や鍋のレシピが出てきて本当に便利。今月は食品ロスがほぼゼロでした。",
        avatar: "🏠",
        rating: 5,
        highlight: "冷蔵庫の食材を使い切り",
      },
      {
        name: "佐藤 美咲",
        role: "ピラティス講師・大阪",
        content:
          "食事管理中なのでカロリーとタンパク質が大事。動画レシピを見ながら栄養成分まで確認できるアプリは初めてです。",
        avatar: "🧘‍♀️",
        rating: 5,
        highlight: "栄養成分がひと目で",
      },
      {
        name: "鈴木 大輔",
        role: "会社員・横浜",
        content:
          "YouTubeで料理を覚えるたびに動画を止めるのが面倒でしたが、テキストで整理されていて調理がぐっと速くなりました。",
        avatar: "👨‍💻",
        rating: 5,
        highlight: "調理時間を短縮",
      },
      {
        name: "高橋 由香",
        role: "家計簿をつける主婦・名古屋",
        content:
          "レシピごとにおおよその原価がわかるのが助かります。デリバリーより安く済んだのが目で見えて、作る気になります。",
        avatar: "📝",
        rating: 5,
        highlight: "デリバリーより節約",
      },
      {
        name: "山本 翔",
        role: "料理初心者・福岡",
        content:
          "お湯の量も測れなかった私が、分量が正確だから失敗せずに作れました。",
        avatar: "🍳",
        rating: 5,
        highlight: "失敗しない分量ガイド",
      },
      {
        name: "中村 さやか",
        role: "ワーキングマザー・札幌",
        content:
          "退職後に買い物の時間がない時、冷蔵庫の卵と豆腐だけで立派な一品ができました。献立の悩みが減ったのが一番大きい。",
        avatar: "👩‍👧‍👦",
        rating: 5,
        highlight: "献立の悩みを解決",
      },
    ],
  },
  finalCta: {
    titleLine1: "今日から始める",
    titleHighlight: "もっと手軽な料理生活",
    subtitle:
      "{count} のレシピとAIおすすめ、YouTubeリンク抽出まで。今すぐ無料で。",
    primaryCta: "無料で始める",
    secondaryCta: "人気レシピを見る",
  },
};
