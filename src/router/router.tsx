import { createBrowserRouter } from 'react-router';
import Root from './Root';
import RecipesPage from '../Pages/RecipesPage';
import NewRecipePage from '../Pages/NewRecipe/NewRecipePage';
import RecipeDetailPage from '../Pages/RecipeDetailPage';
import CommentsPage from '@/Pages/CommentsPage';
import DiscussionPage from '@/Pages/DiscussionPage';
import UserDetailPage from '@/Pages/UserDetailPage';
import AIRecipePage from '@/Pages/AIRecipePage';
import HomePage from '@/Pages/Home/HomePage';
import IngredientsPage from '@/Pages/IngredientsPage';
import SearchPage from '@/Pages/SearchPage/SearchPage';

import NewIngredientsPage from '@/Pages/NewIngredientsPage';
import LoginPage from '@/Pages/LoginPage';
import RecipeSlideShowPage from '@/Pages/RecipeSlideShowPage';
import GoogleCallback from '@/Pages/GoogleCallback';

import CategoryDetailPage from '@/Pages/CategoryDetailPage';

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },

      {
        path: 'recipes',
        element: <RecipesPage />,
      },
      {
        path: 'recipes/new',
        element: <NewRecipePage />,
      },

      {
        path: 'users/:id',
        element: <UserDetailPage />,
      },

      {
        path: 'air',
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
        path: 'recipes/:id/comments',
        element: <CommentsPage />,
      },
      {
        path: 'recipes/:id/comments/:commentId',
        element: <DiscussionPage />,
      },
      {
        path: 'recipes/:id',
        element: <RecipeDetailPage />,
      },
      {
        path: 'recipes/category/:categorySlug',
        element: <CategoryDetailPage />,
      },
    ],
  },

  {
    path: 'recipes/:id/slideshow',
    element: <RecipeSlideShowPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
]);

export default router;
