import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from './lib/firebase';
import SmoothScrollProvider from './hooks/useSmoothScroll';
import PageLoader from './sections/PageLoader';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Products from './sections/Products';
import OffersSection from './sections/Offers';
import Story from './sections/Story';
import TestimonialsSection from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const AdminProducts = lazy(() => import('./admin/Products'));
const AdminOrders = lazy(() => import('./admin/Orders'));
const AdminContacts = lazy(() => import('./admin/Contacts'));
const AdminOffers = lazy(() => import('./admin/Offers'));
const AdminUsers = lazy(() => import('./admin/Users'));
const SignInPage = lazy(() => import('./components/SignIn'));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-on-surface-variant">جاري التحميل...</div>
    </div>
  );
}

const LandingPage = () => {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      {!loaderDone && <PageLoader onComplete={() => setLoaderDone(true)} />}
      <div className="flex flex-col min-h-screen" dir="rtl" style={{ opacity: loaderDone ? 1 : 0, transition: 'opacity 0.3s' }}>
        <SmoothScrollProvider>
          <Navbar />
          <Hero />
          <Products />
          <OffersSection />
          <Story />
          <TestimonialsSection />
          <Contact />
          <Footer />
        </SmoothScrollProvider>
      </div>
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
};

export default function App() {
  useEffect(() => { initAnalytics(); }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
