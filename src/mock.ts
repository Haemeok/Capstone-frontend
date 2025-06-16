import { DetailedRecipeGridItem, Recipe } from './type/recipe';
import { User } from './type/user';
import { Comment } from './type/comment';

export const categories = [
  '🏠홈파티',
  '🌼피크닉',
  '🏕️캠핑',
  '🥗다이어트/건강식',
  '🍽️혼밥',
  '🥐브런치',
  '🍶술안주',
];

export const cookingTimes = [
  '10분이내',
  '20분이내',
  '30분이내',
  '1시간이내',
  '2시간이내',
];

export const cookingTimeItems = [
  { label: '10분이내', value: 10 },
  { label: '20분이내', value: 20 },
  { label: '30분이내', value: 30 },
  { label: '1시간이내', value: 60 },
  { label: '2시간이내', value: 120 },
];

export const recommendedTags = [
  '건강한',
  '간편한',
  '영양가있는',
  '비건',
  '고단백',
];

export const m: Omit<
  Recipe,
  | 'ratingInfo'
  | 'comments'
  | 'likeCount'
  | 'likedByCurrentUser'
  | 'favoriteByCurrentUser'
> = {
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

export const user: User = {
  nickname: 'Stefanie Hiekmann',
  email: '',
  introduction: 'Contributor',
  profileImage:
    'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
  id: 1,
};

export const comments: Comment[] = [
  {
    id: 1,
    content:
      '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    createdAt: '2021-01-01',
    author: user,
    likeCount: 15,
    replyCount: 3,
    likedByCurrentUser: false,
  },
  {
    id: 5,
    content:
      '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    createdAt: '2021-01-01',
    author: user,
    likeCount: 15,
    replyCount: 3,
    likedByCurrentUser: false,
  },
  {
    id: 2,
    content:
      '정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.',
    createdAt: '2021-01-01',
    author: user,
    likeCount: 7,
    replyCount: 0,
    likedByCurrentUser: true,
  },
  {
    id: 3,
    content:
      '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    createdAt: '2021-01-01',
    author: user,
    likeCount: 23,
    replyCount: 5,
    likedByCurrentUser: true,
  },
  {
    id: 4,
    content:
      '재료를 조금 변경해서 만들어도 될까요?재료를 조금 변경해서 만들어도 될까요?재료를 조금 변경해서 만들어도 될까요?',
    createdAt: '2021-01-01',
    author: user,
    likeCount: 4,
    replyCount: 1,
    likedByCurrentUser: false,
  },
];

export const replies: Comment[] = [
  {
    id: 101,
    content: '정말 맛있어 보이는 요리네요! 이번 주말에 꼭 해볼게요.',
    createdAt: '2021-01-02',
    author: user,
    likeCount: 3,
    replyCount: 0,
    likedByCurrentUser: false,
  },
  {
    id: 102,
    content: '재료를 조금 변경해서 만들어도 될까요?',
    createdAt: '2021-01-03',
    author: user,
    likeCount: 1,
    replyCount: 0,
    likedByCurrentUser: true,
  },
  {
    id: 103,
    content: '저는 이 레시피를 조금 변형해서 만들었는데 정말 좋았어요!',
    createdAt: '2021-01-04',
    author: user,
    likeCount: 5,
    replyCount: 0,
    likedByCurrentUser: false,
  },
];

export const createdRecipes: DetailedRecipeGridItem[] = [
  {
    id: 1,
    title: '홈메이드 치킨 파프리카',
    imageUrl:
      'https://images.services.kitchenstories.io/xS81VNt2AAZ40ucVuKkTIIHuZkY=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R3269_Einfacher_fluffiger_Apfelkuchen.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
  },
  {
    id: 7,
    title: '타코 볼',
    imageUrl:
      'https://images.services.kitchenstories.io/OHvQHI8pRjezdt1gHprcyf4jo9Q=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R481-final-photo.jpg',
    authorName: '홍길동',
    createdAt: '2021-01-01',
    likeCount: 10,
    likedByCurrentUser: false,
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
    cookingTime: 30,
    ratingCount: 10,
    authorId: 1,
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
  },
];

export const userDetail: User = {
  id: 1,
  nickname: 'Stefanie Hiekmann',
  email: '',
  introduction: 'Contributor',
  profileImage:
    'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
};

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
