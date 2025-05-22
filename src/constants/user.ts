import { User } from '@/type/user';
import { Calendar, LucideIcon } from 'lucide-react';
import { Award } from 'lucide-react';
import { BookOpen } from 'lucide-react';

export const guestUser: User = {
  id: 0,
  nickname: '게스트',
  profileImage: '/default-profile.png',
  username: '@guest',
  profileContent: '로그인하여 더 많은 기능을 사용해보세요.',
};

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const tabs: Tab[] = [
  { id: '나의 레시피', label: '나의 레시피', icon: Award },
  { id: '북마크', label: '북마크', icon: BookOpen },
  { id: '캘린더', label: '캘린더', icon: Calendar },
];
