"use client"
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Provider } from "react-redux";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { store } from '@/store/store';
import OperatorNavbar from '@/components/common/OperatorNavbar';
import { useEffect } from 'react';
import { nav_links } from '@/utils/constants';
import AuthProvider from '@/components/auth/AuthProvider';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  useEffect(() => {
    // redirect to dashboord 
    if (window.location.pathname === "/") {
      window.location.replace(nav_links['dashboard']);
    }

  }, []);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <AuthProvider>

            <main>
              <OperatorNavbar />
              {children}
            </main>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
