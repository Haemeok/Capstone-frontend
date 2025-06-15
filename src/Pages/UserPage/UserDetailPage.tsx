import { useParams } from 'react-router';
import { useUserStore } from '@/store/useUserStore';
import { guestUser } from '@/constants/user';
import ActionButton from './ActionButton';
import { useUserQuery } from '@/hooks/useUserQuery';
import UserTab from './UserTab';
import SuspenseImage from '@/components/Image/SuspenseImage';
import SettingsActionButton from './SettingsActionButton';
import UserInfoEditButton from './UserInfoEditButton';
import PrevButton from '@/components/Button/PrevButton';
import Header from './Header';

const UserDetailPage = () => {
  const { user: loggedInUser } = useUserStore();
  const { userId: profileId } = useParams();

  const isOwnProfile =
    loggedInUser !== null && Number(profileId) === loggedInUser.id;

  const { user } = useUserQuery(
    Number(profileId),
    Number(profileId) !== loggedInUser?.id,
  );

  const displayUser = isOwnProfile ? loggedInUser : (user ?? guestUser);

  return (
    <div className="flex flex-col overflow-hidden">
      <Header isOwnProfile={isOwnProfile} />

      <div className="relative z-10 px-6">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full">
                <SuspenseImage
                  src={displayUser.profileImage ?? ''}
                  alt={displayUser.nickname}
                  className="h-full w-full object-cover"
                />
              </div>
              {isOwnProfile && (
                <UserInfoEditButton
                  nickname={displayUser.nickname}
                  description={displayUser.introduction ?? ''}
                  profileImageUrl={displayUser.profileImage ?? ''}
                />
              )}
            </div>

            <h2 className="text-dark mb-5 text-2xl font-bold">
              {displayUser.nickname}
            </h2>
          </div>
          <ActionButton
            isLoggedIn={!!loggedInUser}
            isOwnProfile={isOwnProfile}
            isGuest={displayUser.id === guestUser.id}
          />
        </div>

        <p className="text-mm text-dark mt-3 max-w-[90%]">
          {displayUser.introduction}
        </p>
      </div>

      <UserTab
        displayUser={displayUser}
        isOwnProfile={isOwnProfile}
        isLoggedIn={!!loggedInUser}
      />
    </div>
  );
};

export default UserDetailPage;
