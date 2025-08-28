import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import EnsureAuth from './util/wrappers/EnsureAuth';
import RedirectIfAuth from './util/wrappers/RedirectIfAuth';
import Homepage from './components/pages/Homepage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignUpPage';
import FavoritesPage from './components/pages/FavoritesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to='/home' replace />,
      },
      {
        path: '/:folderId',
        element: (
          <EnsureAuth>
            <Homepage />
          </EnsureAuth>
        ),
      },
      {
        path: '/favorites',
        element: (
          <EnsureAuth>
            <FavoritesPage />
          </EnsureAuth>
        ),
      },
      {
        path: '/login',
        element: (
          <RedirectIfAuth>
            <LoginPage />
          </RedirectIfAuth>
        ),
      },
      {
        path: '/sign-up',
        element: (
          <RedirectIfAuth>
            <SignupPage />
          </RedirectIfAuth>
        ),
      },
      {
        path: '*',
        element: <Navigate to='/home' replace />,
      },
    ],
  },
]);

export default router;
