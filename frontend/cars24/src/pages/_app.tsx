"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LocationProvider } from "@/context/LocationContext";
import { useToast, ToastContainer } from "@/components/ui/ToastContainer";
import { NotificationPrompt } from "@/components/NotificationPrompt";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

function AppContent({ Component, pageProps }: AppProps) {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <NotificationPrompt />
      <Toaster richColors />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <NotificationProvider>
          <LocationProvider>
            <AppContent {...props} />
          </LocationProvider>
        </NotificationProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
