import { createBrowserRouter } from "react-router";
import Root from "./Root";
import MyPage from "../Pages/MyPage";
import RecipesPage from "../Pages/RecipesPage";
import NewRecipePage from "../Pages/NewRecipePage";
import RecipeDetailPage from "../Pages/RecipeDetailPage";
import CommentsPage from "@/Pages/CommentsPage";
import DiscussionPage from "@/Pages/DiscussionPage";
import NewIngredientPage from "@/Pages/NewIngredientPage";
import UserDetailPage from "@/Pages/UserDetailPage";
import AIRecipePage from "@/Pages/AIRecipePage";
import HomePage from "@/Pages/HomePage";
import IngredientsPage from "@/Pages/IngredientsPage";
import { userDetail } from "@/mock";
import SearchPage from "@/Pages/SearchPage";

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "recipes",
        element: <RecipesPage />,
      },
      {
        path: "recipes/new",
        element: <NewRecipePage />,
      },
      {
        path: "recipes/:id",
        element: <RecipeDetailPage />,
      },
      {
        path: "recipes/:id/comments",
        element: <CommentsPage />,
      },
      {
        path: "recipes/:id/comments/:commentId",
        element: <DiscussionPage />,
      },
      {
        path: "users/:id",
        element: <UserDetailPage user={userDetail} />,
      },
      {
        path: "my",
        element: <MyPage />,
      },
      {
        path: "users/:id/ingredients/new",
        element: <NewIngredientPage />,
      },
      {
        path: "air",
        element: <AIRecipePage />,
      },
      {
        path: "ingredients",
        element: <IngredientsPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
]);

export default router;
