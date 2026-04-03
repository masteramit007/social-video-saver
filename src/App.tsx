import React, { Suspense, lazy } from 'react';
import { RouteObject, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CookieConsent from '@/components/CookieConsent';
import './i18n';

// Lazy Loads
const Home = lazy(() => import('./pages/Home'));
const PlatformPage = lazy(() => import('./pages/PlatformPage'));
const AudioPlatformPage = lazy(() => import('./pages/AudioPlatformPage'));
const PSEOPage = lazy(() => import('./pages/PSEOPage'));
const VideoCategory = lazy(() => import('./pages/VideoCategory'));
const AudioCategory = lazy(() => import('./pages/AudioCategory'));
const WatermarkFreePage = lazy(() => import('./pages/WatermarkFreePage'));
const RegionPage = lazy(() => import('./pages/RegionPage'));
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="neon-spinner" />
  </div>
);

// --- THE SECRET SAUCE: EXPORTING THE ROUTES ARRAY ---
const Layout: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <div className="app-wrapper">
          <AnimatedBackground />
          <Navbar />
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
          <Footer />
          <BackToTop />
          <CookieConsent />
        </div>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/video-downloader", element: <VideoCategory /> },
      { path: "/audio-downloader", element: <AudioCategory /> },
      { path: "/watermark-free-downloader", element: <WatermarkFreePage /> },
      { path: "/download/china", element: <RegionPage /> },
      { path: "/download/india", element: <RegionPage /> },
      { path: "/download/russia", element: <RegionPage /> },
      { path: "/download/korea", element: <RegionPage /> },
      { path: "/download/:platform", element: <PlatformPage /> },
      { path: "/audio/:platform", element: <AudioPlatformPage /> },
      { path: "/:lang/download/:platform", element: <PSEOPage /> },
      { path: "/:lang/audio/:platform", element: <PSEOPage /> },
      { path: "/blog", element: <BlogIndex /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/about", element: <About /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/contact", element: <Contact /> },
      { path: "/sitemap", element: <SitemapPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default Layout;