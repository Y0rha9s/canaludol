'use client';
import { SessionProvider } from 'next-auth/react';
//sssss
export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}