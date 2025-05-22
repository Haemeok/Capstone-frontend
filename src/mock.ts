import { DetailedRecipeGridItem } from './type/recipe';
import { User } from './type/user';
import { Comment } from './type/comment';
import { CategoryItem } from './type/recipe';

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
export const recommendedTags = [
  '건강한',
  '간편한',
  '영양가있는',
  '비건',
  '고단백',
];

export const user: User = {
  nickname: 'Stefanie Hiekmann',
  email: '',
  profileContent: 'Contributor',
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
    profileImage:
      'https://images.services.kitchenstories.io/OeGe1CD7jlU0qT1gjUn1_RScHk4=/256x0/filters:quality(100)/images.kitchenstories.io/userImages/Stefanie_Hiekmann_63a34cdd.png',
    avgRating: 4.5,
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
