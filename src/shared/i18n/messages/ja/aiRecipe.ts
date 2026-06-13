import type { AiRecipeDict } from "../../types";

export const aiRecipe: AiRecipeDict = {
  modelSelectHeading: "どのAIと一緒に料理しますか？",
  loginDrawerMessage: "AIと一緒にレシピを作ってみましょう",
  backToModelSelect: "AIを選び直す",
  generateRecipe: "レシピを生成する",
  errorFallback: "AIレシピの生成中に問題が発生しました",
  loading: {
    titleSuffix: "レシピを作っています",
    progressLabel: "進捗",
    tipHeading: "💡 ちょっと一言",
    tipBody: [
      "他の作業をしていても大丈夫です",
      "他のページを見たり、冷蔵庫を確認したりしてみてください。",
      "レシピが完成したらお知らせします。",
    ],
    eta: "通常2〜3分ほどかかります",
  },
  error: {
    defaultMessage: "レシピの生成中にエラーが発生しました。",
    failureHeading: "レシピの生成に失敗しました",
    failureBody: "レシピの生成中に問題が発生しました。",
    retryButton: "もう一度試す",
    persistentTip: "問題が続く場合は、しばらくしてからもう一度お試しください。",
  },
  models: {
    INGREDIENT_FOCUS: {
      name: "冷蔵庫の食材",
      description: "家にある食材で作る、とっておきの一品",
    },
    COST_EFFECTIVE: {
      name: "コスパ料理",
      description: "リーズナブルに、でもしっかりおいしく",
    },
    NUTRITION_BALANCE: {
      name: "栄養バランス",
      description: "PFCバランスとカロリーまでしっかり管理",
    },
    FINE_DINING: {
      name: "ファインダイニング",
      description: "自宅の食卓を高級レストランのように",
    },
  },
  steps: [
    "食材を分析しています",
    "おいしい組み合わせを探しています",
    "調理の手順を整理しています",
    "最終仕上げをしています",
    "レシピを完成させています",
  ],
  diningTiers: {
    BLACK: {
      label: "ブラック",
      description: "モダンで革新的な美食体験",
      features: [
        "身近な食材を使用",
        "ファインダイニングの調理法",
        "中級者向けの難易度",
        "一般的な調理器具",
      ],
    },
    WHITE: {
      label: "ホワイト",
      description: "本格派ファインダイニングの優雅さ",
      features: [
        "高級食材も使用可",
        "繊細な調理技法",
        "上級者向けの難易度",
        "専門的な調理器具が必要",
      ],
    },
  },
  price: {
    pageTitle: "コスパレシピ生成 | Recipio",
    pageDescription:
      "予算に合わせたコスパレシピをAIが提案します。会社員の平均昼食代より安く、おいしい料理を楽しみましょう。",
    headerTitle: "コスパレシピ生成",
    headerDescription:
      "予算と好みの料理ジャンルを選ぶと、ぴったりのコスパレシピを生成します",
    budgetLabel: "目標予算",
    foodPickHeading: "今日は何が食べたいですか？",
    foodPickDescription: "好みの料理ジャンルを選んでください",
    averageMealInfo: "会社員の平均昼食予算（{price}ウォン）です",
    savingsMessage: "会社員の平均昼食代より{savings}ウォンお得！",
    monthlySavingsMessage: "毎日続けると、1か月で{months}万ウォンの節約に！",
    savingsBadgeLabel: "今月の節約見込み",
    savingsBadgeSuffix: "節約中！",
    dailyPracticeTip: "毎日1食実践すれば達成できます",
  },
  ingredient: {
    pickerInitialCategory: "すべて",
    pickerMineCategory: "マイ食材",
    submitToastSuffix: "種類の食材",
  },
  nutrition: {
    pageHeading: "栄養バランス",
    cookingStyleLabel: "料理スタイル",
    macroModeLabel: "PFC重視",
    calorieModeLabel: "カロリー重視",
    macroSliderSetLabel: "指定",
    macroSliderAutoLabel: "自動",
    unlimitedValue: "制限なし",
    macroCarbs: "炭水化物",
    macroProtein: "たんぱく質",
    macroFat: "脂質",
    macroCalories: "目標カロリー",
    styles: {
      Asian_Style: {
        label: "アジアンスタイル",
        description: "和食・中華・韓国料理",
      },
      Western_Style: {
        label: "洋食スタイル",
        description: "イタリアン・フレンチ",
      },
      Light_Fresh: {
        label: "軽めでさっぱり",
        description: "サラダ・ヘルシー系",
      },
    },
    guidance: {
      calories: {
        low: "⚡ ダイエット集中モード！",
        mid: "🍽️ ちょうどいい一食",
        high: "💪 エネルギーチャージ！",
        max: "🔥 バルクアップ！",
      },
      protein: {
        low: "🥗 軽めのたんぱく質",
        mid: "💪 バランスよく筋肉ケア",
        high: "🏋️ 筋肉増量モード！",
      },
      carbs: {
        low: "🔥 低糖質・高脂質モード！",
        mid: "⚖️ バランスのとれたエネルギー",
        high: "⚡ エネルギー全開！",
      },
      fat: {
        low: "🥗 クリーンな食事！",
        mid: "👍 程よい満足感",
        high: "🧈 良質な脂質をしっかり摂取",
      },
    },
  },
  fineDining: {
    pageTitle: "ファインダイニングレシピ生成 | Recipio",
    pageDescription:
      "自宅の食卓を高級レストランのように。AIが提案するファインダイニングレシピをお楽しみください。",
    ingredientSectionHeading: "食材を選ぶ",
    ingredientSectionDescription: "使用する食材を選んでください（最低3つ）",
    ingredientSearchPlaceholder: "食材を検索...",
    ingredientSearchAriaLabel: "食材を検索する",
    ingredientCountSuffix: "種類の食材が追加されました",
    selectedIngredientsHeading: "選択中の食材",
    removeAllLabel: "すべて削除",
    removeAllAriaLabel: "すべての食材を削除",
    removeIngredientAriaLabel: "{name}を削除",
    tierSectionHeading: "スタイルを選ぶ",
    tierSectionDescription:
      "ご希望のファインダイニングスタイルを選んでください",
  },
  form: {
    dishType: {
      sectionTitle: "料理の種類",
      options: [
        "🍽️ すべて",
        "🍳 炒め物",
        "🍲 汁物・鍋",
        "🥩 焼き物",
        "🥗 和え物・サラダ",
        "🍤 揚げ物・焼き",
        "🥘 蒸し物・煮物",
        "🍕 オーブン料理",
        "🍣 刺身・生食",
        "🥒 漬け物・ピクルス",
        "🍝 ご飯・麺・パスタ",
        "🍰 デザート・おやつ",
      ],
    },
    servings: {
      sectionTitle: "人数",
      decreaseLabel: "人数を減らす",
      increaseLabel: "人数を増やす",
      unit: "人前",
    },
    cookingTime: {
      sectionTitle: "調理時間",
    },
    aiCharacter: {
      withSuffix: "と一緒に",
      subtitle: "あなただけのレシピを作ってみましょう",
    },
    progressButton: {
      label: "レシピを生成する",
    },
    usageLimitBanner: {
      message: "本日のAIレシピ生成回数を使い切りました。",
      subMessage: "また明日お試しください",
    },
    ingredientManager: {
      addButtonLabel: "食材を追加する",
      addButtonAriaLabel: "食材を追加する",
      ingredientsAddedCount: "種類の食材が追加されました",
      addPrompt: "レシピ生成のために食材を追加してください",
      selectedHeading: "選択中の食材",
      removeAllLabel: "すべて削除",
    },
  },
};
