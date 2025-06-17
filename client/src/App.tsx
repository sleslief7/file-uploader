import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div id="app">
      <Header />
      <div id="outlet">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
