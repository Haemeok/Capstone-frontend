import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import TransformingNavbar from "@/components/NavBar/TransformingNavBar";

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const [halfRating, setHalfRating] = useState<number>(3.5);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsButtonVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto pb-16 relative">
      <TransformingNavbar
        title={recipe.title}
        targetRef={imageRef}
        titleThreshold={0.7}
        textColorThreshold={0.5}
        shadowThreshold={0.8}
      />
      <div ref={imageRef} className="w-full h-64">
        <SuspenseImage
          src={recipe.imageURL}
          alt={recipe.title}
          className="w-full h-full object-cover"
          blackOverlay={true}
        />
      </div>

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
          <HeartButton
            className="flex items-center justify-center border-2 rounded-full p-2 w-16 h-16"
            label="좋아요"
          />
          <SaveButton
            className="flex items-center justify-center border-2 rounded-full p-2 w-16 h-16"
            label="저장"
          />
          <ShareButton
            className="flex items-center justify-center border-2 rounded-full p-2 w-16 h-16"
            label="공유"
          />
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
      <div ref={observerRef} className="h-1 w-full" />
      <Box>
        <RecipeStepList RecipeSteps={RecipeSteps} />
      </Box>

      {isButtonVisible && (
        <div className="fixed bottom-6 justify-center w-full flex z-50">
          <Button
            className="rounded-full p-4 bg-[#5cc570] text-white shadow-lg hover:bg-[#4bb560] transition-all"
            onClick={() =>
              navigate(`/recipes/${recipe.id}/slideShow`, {
                state: { recipeSteps: RecipeSteps },
              })
            }
          >
            요리하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
