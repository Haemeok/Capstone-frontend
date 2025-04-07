import { createBrowserRouter } from "react-router";
import Root from "./Root";
import MyPage from "../Pages/MyPage";
import RecipesPage from "../Pages/RecipesPage";
import NewRecipePage from "../Pages/NewRecipePage";
import RecipeDetailPage from "../Pages/RecipeDetailPage";
import CommentsPage from "@/Pages/CommentsPage";
import DiscussionPage from "@/Pages/DiscussionPage";
import UserDetailPage from "@/Pages/UserDetailPage";
import AIRecipePage from "@/Pages/AIRecipePage";
import HomePage from "@/Pages/HomePage";
import IngredientsPage from "@/Pages/IngredientsPage";
import { userDetail } from "@/mock";
import SearchPage from "@/Pages/SearchPage";
import Page from "@/Pages/tPage";
import NewIngredientsPage from "@/Pages/NewIngredientsPage";
import ScrollTransformNavbar from "@/Pages/tPage2";
import LoginPage from "@/Pages/LoginPage";
import RecipeSlideShowPage from "@/Pages/RecipeSlideShowPage";

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
        path: "users/:id",
        element: <UserDetailPage />,
      },
      {
        path: "my",
        element: <MyPage />,
      },
      {
        path: "air",
        element: <AIRecipePage />,
      },
      {
        path: "ingredients/new",
        element: <NewIngredientsPage />,
      },
      {
        path: "ingredients",
        element: <IngredientsPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "/login/oauth2/code/google",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "test",
    element: <ScrollTransformNavbar />,
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
    path: "recipes/:id",
    element: <RecipeDetailPage />,
  },
  {
    path: "recipes/:id/slideshow",
    element: <RecipeSlideShowPage />,
  },
]);

export default router;
