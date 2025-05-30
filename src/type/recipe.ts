import { User } from './user';
import { Comment } from './comment';

export type UserIngredient = Omit<IngredientItem, 'unit' | 'price'>;

export type IngredientPayload = Omit<
  IngredientItem,
  'category' | 'price' | 'id' | 'imageUrl' | 'inFridge'
>;

export type RecipeStep = {
  stepNumber: number;
  instruction: string;
  stepImageUrl: string;
  action?: string;
  ingredients?: IngredientItem[];
  stepImageKey: string | null | undefined;
};

export type RecipeStepPayload = Omit<
  RecipeStep,
  'stepImageUrl' | 'action' | 'ingredients' | 'imageKey'
> & {
  ingredients: IngredientPayload[];
  imageKey?: string;
};

type RatingInfo = {
  avgRating: number;
  myRating: number;
  ratingCount: number;
};

export type Recipe = {
  id: number;
  title: string;
  dishType: string;
  description: string;
  cookingTime: number | undefined | '';
  imageUrl: string;
  youtubeUrl?: string;
  cookingTools: string[];
  servings: number | undefined | '';
  totalIngredientCost: number;
  marketPrice: number;
  imageKey: string | null | undefined;
  ratingInfo: RatingInfo;
  ingredients: IngredientItem[];
  steps: RecipeStep[];
  tagNames: string[];
  comments: Comment[];
  author: User;
  likeCount: number;
  likedByCurrentUser: boolean;
  favoriteByCurrentUser: boolean;
  private: boolean;
};

export type RecipePayload = Omit<
  Recipe,
  | 'id'
  | 'ingredients'
  | 'steps'
  | 'totalIngredientCost'
  | 'marketPrice'
  | 'youtubeUrl'
  | 'imageURL'
  | 'author'
  | 'likeCount'
  | 'likedByCurrentUser'
  | 'favoriteByCurrentUser'
  | 'ratingInfo'
  | 'comments'
  | 'imageUrl'
  | 'imageKey'
  | 'private'
> & {
  ingredients: IngredientPayload[];
  steps: RecipeStepPayload[];
  cookingTime: number;
  servings: number;
  imageKey?: string | null;
};

export type AIRecommendedRecipe = Omit<
  Recipe,
  | 'ratingInfo'
  | 'likeCount'
  | 'likedByCurrentUser'
  | 'favoriteByCurrentUser'
  | 'comments'
  | 'commentCount'
  | 'ingredients'
> & {
  ingredients: IngredientWithAI[];
};

export const m: AIRecommendedRecipe = {
  id: 30,
  title: '돼지고기 고추장 볶음',
  dishType: '볶음',
  description:
    '매콤하고 감칠맛 넘치는 돼지고기 고추장 볶음입니다. 밥반찬으로 아주 좋아요.',
  cookingTime: 30,
  imageUrl: '/pig.jpg',
  imageKey: null,
  youtubeUrl: '',
  cookingTools: ['프라이팬', '칼', '도마', '볼'],
  servings: 2,
  author: {
    id: 1,
    nickname: '테스트유저1',
    profileImage: 'https://example.com/profile1.jpg',
    introduction: '소개글1',
  },
  tagNames: ['🍶 술안주', '⚡ 초스피드 / 간단 요리', '🍽️ 혼밥'],
  ingredients: [
    {
      id: 47,
      name: '다진돼지고기',
      quantity: '200',
      unit: 'g',
      price: 3000,
    },
    {
      id: 211,
      name: '양파',
      quantity: '0.25',
      unit: '개',
      price: 200,
    },
    {
      id: 60,
      name: '대파',
      quantity: '0.5',
      unit: '단',
      price: 1500,
    },
    {
      id: 18,
      name: '고추장',
      quantity: '2',
      unit: '큰술',
      price: 400,
    },
    {
      id: 19,
      name: '고춧가루',
      quantity: '1',
      unit: '작은술',
      price: 90,
    },
    {
      id: 252,
      name: '진간장',
      quantity: '1',
      unit: '큰술',
      price: 100,
    },
    {
      id: 166,
      name: '설탕',
      quantity: '1',
      unit: '큰술',
      price: 40,
    },
    {
      id: 48,
      name: '다진마늘',
      quantity: '1',
      unit: '큰술',
      price: 210,
    },
    {
      id: 96,
      name: '맛술',
      quantity: '1',
      unit: '큰술',
      price: 90,
    },
    {
      id: 260,
      name: '참기름',
      quantity: '1',
      unit: '큰술',
      price: 380,
    },
    {
      id: 324,
      name: '후추',
      quantity: '0.1',
      unit: '작은술',
      price: 24,
    },
  ],
  steps: [
    {
      stepNumber: 1,
      instruction:
        '양파 1/4개를 채 썰고, 대파 1/2대는 송송 썰어 준비합니다. (매운맛을 원하면 청양고추를 추가해도 좋습니다.)',
      stepImageUrl: '',
      stepImageKey: '',
      action: '썰기',
      ingredients: [],
    },
    {
      stepNumber: 2,
      instruction:
        '볼에 고추장 2큰술, 고춧가루 1작은술, 진간장 1큰술, 설탕 1큰술, 다진 마늘 1큰술, 맛술 1큰술, 참기름 1큰술, 후추 약간을 넣고 잘 섞어 양념장을 만듭니다.',
      stepImageUrl: '',
      stepImageKey: '',
      action: '섞기',
      ingredients: [],
    },
    {
      stepNumber: 3,
      instruction:
        '프라이팬에 기름을 두르지 않고 다진 돼지고기 200g을 넣고 볶아줍니다.',
      stepImageUrl: '',
      stepImageKey: '',
      action: '볶기',
      ingredients: [],
    },
    {
      stepNumber: 4,
      instruction:
        '돼지고기가 익으면 만들어둔 양념장을 넣고 재료와 잘 어우러지도록 볶아줍니다.',
      stepImageUrl: '',
      stepImageKey: '',
      action: '볶기',
      ingredients: [],
    },
    {
      stepNumber: 5,
      instruction:
        '양념이 고루 볶아지면 썰어둔 양파와 대파를 넣고 양파가 살짝 투명해질 때까지 함께 볶아 완성합니다.',
      stepImageUrl: '',
      stepImageKey: '',
      action: '볶기',
      ingredients: [],
    },
  ],
  totalIngredientCost: 6034,
  marketPrice: 7965,
  private: true,
};

export type RecipeFormValues = {
  title: string;
  dishType: string;
  description: string;
  cookingTime: string | number;
  servings: string | number;
  youtubeUrl?: string;
  cookingTools?: string[];
  tagNames: string[];
  imageFile: FileList | null;
  imageKey?: string | null;
  ingredients: IngredientPayload[];
  steps: Array<{
    stepNumber: number;
    instruction: string;
    imageFile?: FileList | null;
    imageKey?: string | null;
    ingredients: IngredientPayload[];
  }>;
};

export type DetailedRecipeGridItem = BaseRecipeGridItem & {
  avgRating: number;
  ratingCount: number;
};

export type BaseRecipeGridItem = {
  id: number;
  title: string;
  imageUrl: string;
  authorName: string;
  authorId: number;
  profileImage: string;
  cookingTime?: number;
  createdAt: string;
  likeCount: number;
  likedByCurrentUser: boolean;
};

export type UserRecipeGridItem = Omit<
  BaseRecipeGridItem,
  'authorName' | 'profileImage' | 'likeCount' | 'authorId'
>;

export type IngredientItem = {
  id: number;
  name: string;
  imageUrl?: string;
  category?: string;
  quantity?: string;
  price?: number;
  unit: string;
  inFridge: boolean;
};

export type IngredientWithAI = Omit<IngredientItem, 'inFridge'>;

export type CategoryItem = {
  id: number;
  name: string;
  imageUrl: string;
  count: number;
};

export type DefaultOption = {
  code: null;
  displayName: string;
};

export type SpecificOption = {
  code: string;
  displayName: string;
};

export type FilterOption = DefaultOption | SpecificOption;

export type RecipeHistoryItem = {
  recipeId: number;
  recipeTitle: string;
  savings: number;
  imageUrl: string;
};

export type RecipeDailySummary = {
  date: string;
  totalSavings: number;
  totalCount: number;
  firstImageUrl: string;
};
