import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Flex } from '@chakra-ui/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Flex direction="column" maxWidth="100vw" minHeight="100vh">
      <Header />
      <Flex as="main" id="outlet" direction="column" flex="1">
        <Outlet />
      </Flex>
      <Footer />
      <Toaster />
    </Flex>
  );
}

export default App;
