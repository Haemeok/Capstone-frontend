import { createBrowserRouter } from "react-router";
import Root from "./Root";
import MyPage from "../Pages/MyPage";
import RecipesPage from "../Pages/RecipesPage";
import NewRecipePage from "../Pages/NewRecipePage";
import RecipeDetailPage from "../Pages/RecipeDetailPage";
import CommentsPage from "@/Pages/CommentsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
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
    ],
  },
]);

export default router;
