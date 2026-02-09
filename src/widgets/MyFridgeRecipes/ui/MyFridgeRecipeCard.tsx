"use client";

import { useRouter } from "next/navigation";

import { Star } from "lucide-react";
import { motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import { MyFridgeRecipeItem } from "@/entities/recipe/model/types";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { RecipeLikeButton } from "@/features/recipe-like";

import ExpandableIngredients from "./ExpandableIngredients";

type MyFridgeRecipeCardProps = {
  recipe: MyFridgeRecipeItem;
};

const MyFridgeRecipeCard = ({ recipe }: MyFridgeRecipeCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    triggerHaptic("Light");
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <motion.div
      className="relative flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md"
      onClick={handleCardClick}
      whileTap={{ scale: 0.99 }}
    >
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover"
          width={128}
          height={128}
        />
        <div
          className="absolute right-0 top-0 p-2 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <RecipeLikeButton
            recipeId={recipe.id}
            initialIsLiked={recipe.likedByCurrentUser}
            initialLikeCount={recipe.likeCount}
            buttonClassName="text-white"
            iconClassName="fill-gray-300 opacity-80"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
        <p className="line-clamp-2 text-base font-bold text-gray-900">
          {recipe.title}
        </p>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-700">{recipe.avgRating}</span>
          <span>({recipe.ratingCount})</span>
          <span>·</span>
          <span>{recipe.cookingTime}분</span>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <UserProfileImage
            profileImage={recipe.profileImage}
            userId={recipe.authorId}
          />
          <UserName username={recipe.authorName} userId={recipe.authorId} />
        </div>

        <ExpandableIngredients
          matchedIngredients={recipe.matchedIngredients}
          missingIngredients={recipe.missingIngredients}
        />
      </div>
    </motion.div>
  );
};

export default MyFridgeRecipeCard;
