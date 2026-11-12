import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider } from "@/lib/i18n";
import ErrorBoundary from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import { lazy, Suspense, useEffect } from "react";
import { initGA4 } from "@/lib/ga4";

// Critical routes loaded eagerly
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Non-critical routes loaded lazily
const Generate = lazy(() => import("./pages/Generate"));
const AIGallery = lazy(() => import("./pages/AIGallery"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const SharedCollection = lazy(() => import("./pages/SharedCollection"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminUserDetail = lazy(() => import("./pages/AdminUserDetail"));
const AdminSecurity = lazy(() => import("./pages/AdminSecurity"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Terms = lazy(() => import("./pages/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Initialize GA4 on mount (script will load asynchronously)
useEffect(() => {
  initGA4();
}, []);

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <I18nProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LazyFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/gallery" element={<AIGallery />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/collection/:shareToken" element={<SharedCollection />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/security" element={<AdminSecurity />} />
                    <Route path="/admin/user/:userId" element={<AdminUserDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    <Route path="/coohom-interior-design" element={<CoohomLandingPage />} />
                    <Route path="/room/:slug" element={<RoomCategoryPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <CookieConsent />
              </BrowserRouter>
            </TooltipProvider>
          </I18nProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
