import {
  Ingredient,
  IngredientItem,
  Recipe,
  RecipeGridItem,
  RecipeStep,
  Recipe as RecipeType,
} from './type/recipe';
import { User } from './type/user';
import { Comment } from './type/comment';
import { CategoryItem } from './type/recipe';

export const ingredients: Ingredient[] = [
  { quantity: '250', name: 'red cabbage', unit: 'g' },
  { quantity: '2', name: 'scallions', unit: '개' },
  { quantity: '500', name: 'oyster mushrooms', unit: 'g' },
  { quantity: '8', name: 'olive oil', unit: '큰술' },
  { quantity: '3', name: 'garlic', unit: '쪽' },
  { quantity: '400', name: 'full-fat Greek yogurt', unit: 'g' },
  { quantity: '1', name: 'lemon juice', unit: 'tsp' },
  { quantity: '0.5', name: 'maple syrup', unit: 'tsp' },
  { quantity: '1', name: 'maple syrup', unit: '큰술' },
  { quantity: '1', name: 'ground cumin', unit: 'tsp' },
  { quantity: '2', name: 'sweet paprika powder', unit: 'tsp' },
  { quantity: '1', name: 'baharat spice mix', unit: 'tsp' },
  { quantity: '4', name: 'flatbreads (small)', unit: '개' },
  { quantity: '0', name: 'salt', unit: 'tsp' },
];

export const categories = [
  '🏠홈파티',
  '🌼피크닉',
  '🏕️캠핑',
  '🥗다이어트/건강식',
  '🍽️혼밥',
  '🥐브런치',
  '🍶술안주',
];
export const categoriesItems: CategoryItem[] = [
  {
    id: 1,
    name: '🏠홈파티',
    imageUrl: '/cooking2.png',
    count: 10,
  },
  {
    id: 2,
    name: '🌼피크닉',
    imageUrl: '/picnic2.png',
    count: 10,
  },
  {
    id: 3,
    name: '🏕️캠핑',
    imageUrl: '/camping2.png',
    count: 10,
  },
  {
    id: 4,
    name: '🥗다이어트|건강식',
    imageUrl: '/workout (1).png',
    count: 10,
  },
  {
    id: 5,
    name: '명절',
    imageUrl: '/holiday2.png',
    count: 10,
  },
  {
    id: 6,
    name: '🍽️혼밥',
    imageUrl: 'Honbab.png',
    count: 10,
  },
  {
    id: 7,
    name: '🍶술안주',
    imageUrl: 'Beer.png',
    count: 10,
  },
  {
    id: 8,
    name: '🥐브런치',
    imageUrl: 'Brunch.png',
    count: 10,
  },
  {
    id: 9,
    name: '🔌에어프라이어',
    imageUrl: 'AirFry.png',
    count: 10,
  },
  {
    id: 10,
    name: '🍱 도시락',
    imageUrl: 'Dosirac.png',
    count: 10,
  },
];
export const cookingTimes = [
  '10분이내',
  '20분이내',
  '30분이내',
  '1시간이내',
  '2시간이내',
];
export const recommendedTags = [
  '건강한',
  '간편한',
  '영양가있는',
  '비건',
  '고단백',
];

export let RecipeSteps: RecipeStep[] = [
  {
    ingredients: [
      {
        quantity: '130',
        name: '마가린',
        unit: 'g',
      },
      {
        quantity: '130',
        name: '마가린',
        unit: 'g',
      },
      {
        quantity: '130',
        name: '마가린',
        unit: 'g',
      },
    ],
    instruction:
      '비건 베케이라미를 만들기 위해 마가린을 녹이고 부드러운 비건 우유를 천천히 넣어 섞어줍니다.',
    stepImageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    stepNumber: 1,
  },
  {
    ingredients: [
      {
        quantity: '2',
        name: '비건 베케이라미',
        unit: 'tbsp',
      },
      {
        quantity: '0',
        name: '비건 우유',
        unit: 'tsp',
      },
      {
        quantity: '0',
        name: '비건 베케이라미',
        unit: 'tsp',
      },
    ],
    instruction: '영양 효모, 육두구, 소금과 후추를 넣고 저어줍니다.',
    stepImageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    stepNumber: 2,
  },
  {
    ingredients: [
      {
        quantity: '2',
        name: '영양 효모',
        unit: 'tbsp',
      },
      {
        quantity: '0',
        name: '소금',
        unit: 'tsp',
      },
      {
        quantity: '0',
        name: '고추',
        unit: 'tsp',
      },
    ],
    instruction:
      '오븐을 200°C/400°F로 예열합니다. 양파와 마늘은 껍질을 벗기고 버섯은 깨끗이 씻습니다. 양파, 마늘, 타임은 잘게 다지고 버섯은 슬라이스합니다.',
    stepImageUrl:
      'https://images.services.kitchenstories.io/aWWyLRLa6Z4z5up2sI9UGPMGHQo=/384x0/filters:quality(80)/images.kitchenstories.io/recipeStepImages/16_01_63_ScallionPancake_Step03.jpg',
    stepNumber: 3,
  },
  {
    ingredients: [
      {
        quantity: '2',
        name: '버섯',
        unit: 'tbsp',
      },
      {
        quantity: '0',
        name: '타임',
        unit: 'tsp',
      },
      {
        quantity: '0',
        name: '버섯',
        unit: 'tsp',
      },
    ],
    instruction:
      '프라이팬에 기름을 두르고 양파, 마늘, 베지 분더 시즈닝(사용 중인 경우)을 중간 불에서 향이 나고 부드러워질 때까지 볶습니다. 버섯과 타임을 넣고 버섯이 갈색이 될 때까지 몇 분간 조리한 후 필요하면 기름을 조금 더 추가합니다. 시금치를 넣고 시들해질 때까지 자주 저어가며 조리합니다. 소금과 후추로 간합니다. 따로 보관합니다.',
    stepImageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    stepNumber: 4,
  },
  {
    ingredients: [
      {
        quantity: '2',
        name: '버섯',
        unit: 'tbsp',
      },
      {
        quantity: '0',
        name: '소금',
        unit: 'tsp',
      },
      {
        quantity: '0',
        name: '후추',
        unit: 'tsp',
      },
    ],
    instruction:
      '캐서롤 접시 바닥에 토마토 소스를 한 겹 펴 바릅니다. 국수 층을 올린 다음 베샤멜 소스 층과 야채 층을 추가합니다. 그 위에 면과 토마토 소스를 한 겹 더 얹고 캐서롤 접시가 가득 찰 때까지 이 패턴을 반복합니다. 베샤멜 소스 층과 남은 버섯과 시금치로 마무리합니다. 타임 잎으로 장식합니다. 200°C/400°F에서 약 30~40분간 또는 측면에 기포가 생기고 윗면이 노릇노릇해질 때까지 구워줍니다. 살짝 식힌 후 슬라이스하여 제공합니다. 맛있게 드세요!',
    stepImageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    stepNumber: 5,
  },
];

export const user: User = {
  nickname: 'Stefanie Hiekmann',
  email: '',
  profileContent: 'Contributor',
  profileImage:
    'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
  id: 1,
};

export const recipe: Recipe = {
  id: 1,
  title: `시금치와 버섯을 곁들인 가장 크리미한 비건 라자냐`,
  imageURL:
    'https://images.services.kitchenstories.io/Q2f9UtDQHKs_yStKPdSqLyNtZl4=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R480-final-photo-_1.jpg',
  ingredients: ingredients,
  description: '시금치와 버섯을 곁들인 가장 크리미한 비건 라자냐',
  steps: RecipeSteps,
  dishType: 'pasta',
  cookingTime: 30,
  cookingTools: ['oven'],
  servings: 4,
  tagNames: ['비건', '건강한', '간편한', '영양가있는'],
};

export const comments: Comment[] = [
  {
    id: 1,
    content:
      '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    date: '2021-01-01',
    user: user,
    likeCount: 15,
    replyCount: 3,
    isLiked: false,
  },
  {
    id: 2,
    content:
      '정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.',
    date: '2021-01-01',
    user: user,
    likeCount: 7,
    replyCount: 0,
    isLiked: true,
  },
  {
    id: 3,
    content:
      '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    date: '2021-01-01',
    user: user,
    likeCount: 23,
    replyCount: 5,
    isLiked: true,
  },
  {
    id: 4,
    content:
      '재료를 조금 변경해서 만들어도 될까요?재료를 조금 변경해서 만들어도 될까요?재료를 조금 변경해서 만들어도 될까요?',
    date: '2021-01-01',
    user: user,
    likeCount: 4,
    replyCount: 1,
    isLiked: false,
  },
];

export const replies: Comment[] = [
  {
    id: 101,
    content: '정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.',
    date: '2021-01-02',
    user: user,
    likeCount: 3,
    replyCount: 0,
    isLiked: false,
  },
  {
    id: 102,
    content: '재료를 조금 변경해서 만들어도 될까요?',
    date: '2021-01-03',
    user: user,

    likeCount: 1,
    replyCount: 0,
    isLiked: true,
  },
  {
    id: 103,
    content: '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    date: '2021-01-04',
    user: user,
    likeCount: 5,
    replyCount: 0,
    isLiked: false,
  },
];

export const createdRecipes: RecipeGridItem[] = [
  {
    id: 1,
    title: '홈메이드 치킨 파프리카',
    imageUrl:
      'https://images.services.kitchenstories.io/xS81VNt2AAZ40ucVuKkTIIHuZkY=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R3269_Einfacher_fluffiger_Apfelkuchen.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },

  {
    id: 2,
    title: '치즈 수플레',
    imageUrl:
      'https://images.services.kitchenstories.io/uAIq0Ol-MtURpAWD34v0MwUHXGU=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R3292_air_fryer_camembert.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
  {
    id: 3,
    title: '타코 볼',
    imageUrl:
      'https://images.services.kitchenstories.io/OHvQHI8pRjezdt1gHprcyf4jo9Q=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R481-final-photo.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
  {
    id: 4,
    title: '매콤한 베트남 쌀국수',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
  {
    id: 5,
    title: '홈메이드 치킨 파프리카',
    imageUrl:
      'https://images.services.kitchenstories.io/xS81VNt2AAZ40ucVuKkTIIHuZkY=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R3269_Einfacher_fluffiger_Apfelkuchen.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },

  {
    id: 6,
    title: '치즈 수플레',
    imageUrl:
      'https://images.services.kitchenstories.io/uAIq0Ol-MtURpAWD34v0MwUHXGU=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R3292_air_fryer_camembert.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
  {
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
    id: 7,
    title: '타코 볼',
    imageUrl:
      'https://images.services.kitchenstories.io/OHvQHI8pRjezdt1gHprcyf4jo9Q=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R481-final-photo.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
  },
  {
    id: 8,
    title: '매콤한 베트남 쌀국수',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
];

export const cookbookRecipes: RecipeGridItem[] = [
  {
    id: 5,
    title: '주말 브런치 컬렉션',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },

  {
    id: 6,
    title: '이탈리안 파스타 마스터리',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
  {
    id: 1,
    title: '주말 브런치 컬렉션',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },

  {
    id: 2,
    title: '이탈리안 파스타 마스터리',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
  {
    id: 3,
    title: '주말 브런치 컬렉션',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },

  {
    id: 4,
    title: '이탈리안 파스타 마스터리',
    imageUrl:
      'https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    rating: 4.5,
    cookingTime: 30,
    commentCount: 10,
  },
];

export const userDetail: User = {
  id: 1,
  nickname: 'Stefanie Hiekmann',
  email: '',
  profileContent: 'Contributor',
  profileImage:
    'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
};

export const ingredientItems: IngredientItem[] = [
  {
    id: 1,
    name: '브로콜리',
    category: '야채',
    imageUrl: '/bro.png',
  },
  {
    id: 2,
    name: '양파',
    category: '야채',
    imageUrl: '/onion.png',
  },
  {
    id: 3,
    name: '애호박',
    category: '야채',
    imageUrl: '/jukini.png',
  },
  {
    id: 4,
    name: '토마토',
    category: '야채',
    imageUrl: '/tomato.png',
  },
  {
    id: 5,
    name: '땅콩',
    category: '야채',
    imageUrl: '/peanut.png',
  },
  {
    id: 6,
    name: '가다랑어포',
    category: '야채',
    imageUrl: '/gadaranga.png',
  },
  {
    id: 7,
    name: '감자전분',
    category: '야채',
    imageUrl: '/potatoC.png',
  },
  {
    id: 8,
    name: '간장',
    category: '과일',
    imageUrl: '/soy2.png',
  },
  {
    id: 9,
    name: '콜라',
    category: '야채',
    imageUrl: '/coke.png',
  },
  {
    id: 10,
    name: '콜라',
    category: '야채',
    imageUrl: '/coke2.png',
  },
  {
    id: 11,
    name: '콜라',
    category: '야채',
    imageUrl: '/coke3.png',
  },
  {
    id: 12,
    name: '콜라',
    category: '야채',
    imageUrl: '/coke4.png',
  },
  {
    id: 13,
    name: '가쓰오부시',
    category: '야채',
    imageUrl: '/row-1-column-1.webp',
  },
  {
    id: 14,
    name: '가래떡',
    category: '야채',
    imageUrl: '/row-1-column-2.webp',
  },
  {
    id: 15,
    name: '가지',
    category: '야채',
    imageUrl: '/row-2-column-1.webp',
  },
  {
    id: 16,
    name: '갈치',
    category: '야채',
    imageUrl: '/row-2-column-2.webp',
  },
  {
    id: 17,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 18,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 19,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 20,
    name: '감',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 21,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 22,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 23,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 24,
    name: '파프리카',
    category: '야채',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 25,
    name: '가다랑어포',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 26,
    name: '단무지',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 27,
    name: '두유',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 28,
    name: '라이스페이퍼',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 29,
    name: '만두',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 30,
    name: '만두피',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 31,
    name: '맛살',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 32,
    name: '모짜렐라치즈',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 33,
    name: '미트볼',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 34,
    name: '계란',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 35,
    name: '다크초콜릿',
    category: '가공/유제품',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 36,
    name: '국거리소고기',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 37,
    name: '다진돼지고기',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 38,
    name: '다진소고기',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 39,
    name: '닭가슴살',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 40,
    name: '닭고기',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 41,
    name: '닭날개',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 42,
    name: '닭다리',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 43,
    name: '대패삼겹살',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 44,
    name: '돼지 갈매기살',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 45,
    name: '돼지 뒷다리',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 46,
    name: '돼지 등심',
    category: '고기',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 47,
    name: '감자전분',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 48,
    name: '검은깨',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 49,
    name: '귀리',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 50,
    name: '깨',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 51,
    name: '녹두',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 52,
    name: '들깨가루',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 53,
    name: '밀가루',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 54,
    name: '밥',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 55,
    name: '백미',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 56,
    name: '보리',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 57,
    name: '부침가루',
    category: '곡물',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 58,
    name: '감',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 59,
    name: '곶감',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 60,
    name: '귤',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 61,
    name: '딸기',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 62,
    name: '레몬',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 63,
    name: '망고',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 64,
    name: '매실',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 65,
    name: '메론',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 66,
    name: '바나나',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 67,
    name: '배',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 68,
    name: '복숭아',
    category: '과일',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 69,
    name: '냉면사리',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 70,
    name: '당면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 71,
    name: '라면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 72,
    name: '메밀면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 73,
    name: '비빔면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 74,
    name: '소면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 75,
    name: '스파게티면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 76,
    name: '쌀국수면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 77,
    name: '우동면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 78,
    name: '짜장라면',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
  {
    id: 79,
    name: '쫄면사리',
    category: '면',
    imageUrl:
      'https://deec3j55ge0ut.cloudfront.net/uploads/pop-up/1674804824093_2e89f21674.jpeg',
  },
];

// --- Mock Data (실제로는 API 호출 등으로 가져와야 함) ---
export const popularShows = [
  {
    id: 1,
    name: 'SCAM INC',
    imageUrl: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=SCAM+INC',
  },
  {
    id: 2,
    name: 'AI IN...',
    imageUrl: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=AI+IN',
  },
  {
    id: 3,
    name: 'Podcast 3',
    imageUrl:
      'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Podcast+3',
  },
];

export const youMightLike = [
  {
    id: 4,
    name: 'The Ancients',
    imageUrl: 'https://via.placeholder.com/150x150/e0f2fe/0c4a6e?text=Ancients',
  },
  {
    id: 5,
    name: 'TED Talks Daily',
    imageUrl: 'https://via.placeholder.com/150x150/ffffff/dc2626?text=TED',
  },
  {
    id: 6,
    name: 'Another Show',
    imageUrl: 'https://via.placeholder.com/150x150/f3f4f6/1f2937?text=Show',
  },
  {
    id: 7,
    name: 'Podcast 4',
    imageUrl: 'https://via.placeholder.com/150x150/d1fae5/047857?text=Podcast',
  },
];
// --- End Mock Data ---
