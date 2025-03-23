// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-container">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;