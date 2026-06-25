import '../src/index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import QueryProvider from '../src/components/QueryProvider';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import RootLayoutWrapper from '../src/components/RootLayout'; // the old RootLayout might have Navbar/Footer? Let me check

import { Plus_Jakarta_Sans } from 'next/font/google'
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata = {
  title: 'StartupForge',
  description: 'Connect Founders with Collaborators.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <RootLayoutWrapper>
                {children}
              </RootLayoutWrapper>
              <Toaster position="top-center" />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
