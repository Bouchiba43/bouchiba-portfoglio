import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { PageTransitionProvider } from "./components/ui/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bouchiba Ahmed Seddik portfolio",
  description:
    "Passionate DevOps Engineer specializing in cloud infrastructure, containerization, and CI/CD automation",
  icons: {
    icon: [
      { url: '/icon.svg', sizes: '64x64', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/web-app-manifest-512x512.png" />
        <meta property="og:title" content="Bouchiba Ahmed Seddik portfolio" />
        <meta property="og:description" content="Passionate DevOps Engineer specializing in cloud infrastructure, containerization, and CI/CD automation" />
        <meta property="og:image" content="/favicon/apple-touch-icon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-website-url.com" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Bouchiba Ahmed Seddik portfolio" />
        <meta name="twitter:description" content="Passionate DevOps Engineer specializing in cloud infrastructure, containerization, and CI/CD automation" />
        <meta name="twitter:image" content="/favicon/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PageTransitionProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1f2937",
                  color: "#fff",
                  border: "1px solid #374151",
                },
              }}
            />
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
