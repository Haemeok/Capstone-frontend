import { cn } from '@/lib/utils';
import SuspenseImage from '../Image/SuspenseImage';
import { Star } from 'lucide-react';
import RecipeLikeButton from '../RecipeLikeButton';
import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from '@/type/recipe';
import { useNavigate } from 'react-router';
import UserProfileImage from '../UserProfileImage';
import Username from '../Username';

type DetailedRecipeGridItemProps = {
  recipe: DetailedRecipeGridItemType;
  height: number;
};

const DetailedRecipeGridItem = ({
  recipe,
  height,
}: DetailedRecipeGridItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(`relative flex h-76 shrink-0 flex-col gap-2 rounded-2xl`)}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <SuspenseImage
        src={recipe.imageUrl}
        alt={recipe.title}
        className={cn(`relative h-52 min-h-52 w-full rounded-2xl object-cover`)}
      />

      <div className="absolute top-0 right-0 p-2 text-right">
        <RecipeLikeButton
          recipeId={recipe.id}
          initialIsLiked={recipe.likedByCurrentUser}
          initialLikeCount={recipe.likeCount}
          buttonClassName="text-white"
          iconClassName="fill-gray-300 opacity-80"
        />
      </div>

      <div className="flex grow flex-col px-2 pb-2">
        <p className="truncate font-semibold">{recipe.title}</p>
        <div className="flex items-center gap-[2px]">
          <Star size={15} className="fill-gray-800" />
          <p className="text-mm text-gray-800">{recipe.avgRating}</p>
          <p className="text-mm text-gray-800">{`(${recipe.ratingCount})`}</p>
          <p className="text-mm text-gray-800">·</p>
          <p className="text-mm text-gray-800">{`${recipe.cookingTime}분`}</p>
        </div>
        <div className="flex items-center gap-1">
          <UserProfileImage
            profileImage={recipe.profileImage}
            userId={recipe.authorId}
          />
          <Username username={recipe.authorName} userId={recipe.authorId} />
        </div>
      </div>
    </div>
  );
};

export default DetailedRecipeGridItem;
