import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import EnsureAuth from './util/EnsureAuth';
import RedirectIfAuth from './util/RedirectIfAuth';
import Homepage from './components/pages/Homepage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <EnsureAuth>
            <Homepage />
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
            <SignUpPage />
          </RedirectIfAuth>
        ),
      },
    ],
  },
]);

export default router;
