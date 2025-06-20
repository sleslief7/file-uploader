import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import EnsureAuth from './util/EnsureAuth';
import RedirectIfAuth from './util/RedirectIfAuth';
import Homepage from './components/pages/Homepage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';

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
            <SignupPage />
          </RedirectIfAuth>
        ),
      },
    ],
  },
]);

export default router;
