import { createBrowserRouter } from 'react-router';
import Root from './Root';

import NewRecipePage from '../Pages/NewRecipe/NewRecipePage';
import RecipeDetailPage from '../Pages/RecipeDetailPage';
import CommentsPage from '@/Pages/CommentPage/CommentsPage';
import DiscussionPage from '@/Pages/DiscussionPage';
import AIRecipePage from '@/Pages/AIRecipePage';
import HomePage from '@/Pages/Home/HomePage';
import IngredientsPage from '@/Pages/IngredientsPage/IngredientsPage';
import SearchPage from '@/Pages/SearchPage/SearchPage';

import NewIngredientsPage from '@/Pages/NewIngredientsPage';
import LoginPage from '@/Pages/LoginPage';
import RecipeSlideShowPage from '@/Pages/RecipeSlideShowPage';
import GoogleCallback from '@/Pages/GoogleCallback';

import CategoryDetailPage from '@/Pages/CategoryDetailPage';
import ReviewPage from '@/Pages/ReviewPage/ReviewPage';
import CalendarDetailPage from '@/Pages/CalendarDetailPage';
import UserInfoChangePage from '@/Pages/UserInfoChangePage';
import UserDetailPage from '@/Pages/UserPage/UserDetailPage';
import UpdateRecipePage from '@/Pages/UpdateRecipe/UpdateRecipePage';

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'recipes/new',
        element: <NewRecipePage />,
      },
      {
        path: 'recipes/:recipeId/edit',
        element: <UpdateRecipePage />,
      },

      {
        path: 'users/:userId',
        element: <UserDetailPage />,
      },

      {
        path: 'ai-recipe',
        element: <AIRecipePage />,
      },
      {
        path: 'ingredients/new',
        element: <NewIngredientsPage />,
      },
      {
        path: 'ingredients',
        element: <IngredientsPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: '/oauth2/redirect',
        element: <GoogleCallback />,
      },
      {
        path: 'recipes/:recipeId/comments',
        element: <CommentsPage />,
      },
      {
        path: 'recipes/:recipeId/comments/:commentId',
        element: <DiscussionPage />,
      },
      {
        path: 'recipes/:recipeId',
        element: <RecipeDetailPage />,
      },
      {
        path: 'recipes/category/:categorySlug',
        element: <CategoryDetailPage />,
      },
      {
        path: 'calendar/:date',
        element: <CalendarDetailPage />,
      },
    ],
  },

  {
    path: 'recipes/:recipeId/slideshow',
    element: <RecipeSlideShowPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'recipes/:recipeId/rate',
    element: <ReviewPage />,
  },
  {
    path: 'user/info',
    element: <UserInfoChangePage />,
  },
]);

export default router;
