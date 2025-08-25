import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Flex, Grid, GridItem } from '@chakra-ui/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';

function App() {
  const { isAuth } = useAuth();
  return (
    <Flex direction='column' maxWidth='100vw' minHeight='100vh'>
      <Header />
      <Grid
        as='main'
        id='outlet'
        templateColumns={{ base: '1fr', xl: 'repeat(5, 1fr)' }}
        flex='1'
      >
        {isAuth && (
          <GridItem colSpan={1} display={{ base: 'none', xl: 'block' }}>
            {' '}
            <Navbar />
          </GridItem>
        )}
        <GridItem colSpan={{ base: 5, xl: isAuth ? 4 : 5 }} mx={'4'}>
          <Outlet />
        </GridItem>
      </Grid>
      {!isAuth && <Footer />}
      <Toaster />
    </Flex>
  );
}

export default App;
