'use client';

import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
      <Toaster position="top-right" />
    </SessionProvider>
  );
} 