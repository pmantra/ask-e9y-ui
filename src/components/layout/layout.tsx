// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex="1" overflow="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;