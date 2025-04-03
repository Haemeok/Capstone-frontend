import React, { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router";
import UserProfile from "@/components/UserProfile";
import CollapsibleP from "@/components/CollapsibleP";

import { recipe, ingredients, user, RecipeSteps, comments } from "@/mock";
import RecipeStepList from "@/components/RecipeStepList";
import SuspenseImage from "@/components/Image/SuspenseImage";
import Ratings from "@/components/Ratings";
import HeartButton from "@/components/Button/HeartButton";
import SaveButton from "@/components/Button/SaveButton";
import ShareButton from "@/components/Button/ShareButton";
import LockButton from "@/components/Button/LockButton";
import Box from "@/components/ui/Box";
import CommentBox from "@/components/CommentBox";
import { Button } from "@/components/ui/button";

const RecipeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [halfRating, setHalfRating] = useState<number>(3.5);
  return (
    <div className="mx-auto ">
      <SuspenseImage src={recipe.imageURL} alt={recipe.title} />
      <Box className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">{recipe.title}</h1>
        <Ratings
          precision={0.5}
          allowHalf={true}
          value={halfRating}
          onChange={(value) => setHalfRating(value)}
          className="w-full"
          showValue={true}
        />
        <div className="flex gap-4 justify-center">
          <HeartButton />
          <SaveButton />
          <ShareButton />
          <LockButton />
        </div>
      </Box>
      <Box>
        <UserProfile user={user} />
        <CollapsibleP />
      </Box>
      <Box>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <Button
            variant="ghost"
            className="cursor-pointer text-[#5cc570]"
            onClick={() => navigate("comments")}
          >
            Read More
          </Button>
        </div>
        <CommentBox comment={comments[0]} />
      </Box>
      <Box>
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="flex flex-col gap-1">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="grid grid-cols-2 gap-4">
              <p className="text-left font-bold">{ingredient.name}</p>
              <p className="text-left">{ingredient.quantity}</p>
            </li>
          ))}
        </ul>
      </Box>
      <Box>
        <RecipeStepList RecipeSteps={RecipeSteps} />
      </Box>
    </div>
  );
};

export default RecipeDetailPage;
