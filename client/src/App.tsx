import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from './components/Header';
import Footer from './components/Footer';
import { Flex } from '@chakra-ui/react';

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
