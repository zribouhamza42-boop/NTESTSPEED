import React, { useState, useEffect } from "react";
import { PageId, Language, SpeedResults, Article, VPNOffer, RDPOffer } from "./types";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SpeedTest from "./components/SpeedTest";
import AIDiagnostics from "./components/AIDiagnostics";
import VPNOffers from "./components/VPNOffers";
import RDPOffers from "./components/RDPOffers";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";
import { FutureSoundEngine } from "./components/FutureAmbiance";

interface ProtectedAdminRouteProps {
  setCurrentPage: (page: PageId) => void;
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ setCurrentPage, children }: ProtectedAdminRouteProps) {
  const { token, user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Checks for authenticatedUser (token and user info)
    if (!token || !user) {
      window.history.replaceState(null, "", "/");
      setCurrentPage("home");
      return;
    }

    // Role-based permissions
    const hasPrivilege = ["super_admin", "admin", "editor"].includes(user.role);
    if (!hasPrivilege) {
      window.history.replaceState(null, "", "/");
      setCurrentPage("home");
      return;
    }

    // Extra sensitive path check for non-super admins
    const path = window.location.pathname;
    if (path.startsWith("/admin/users") || path === "/admin/users" || path.startsWith("/admin/settings") || path === "/admin/settings") {
      if (user.role !== "super_admin") {
        window.history.replaceState(null, "", "/");
        setCurrentPage("home");
      }
    }
  }, [token, user, loading, setCurrentPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 font-mono text-xs">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-amber-400 mb-2"></div>
        <span>جاري التحقق من صلاحيات الدخول الموثقة...</span>
      </div>
    );
  }

  if (!token || !user) {
    return null;
  }

  const hasPrivilege = ["super_admin", "admin", "editor"].includes(user.role);
  if (!hasPrivilege) {
    return null;
  }

  return <>{children}</>;
}

export default function App() {
  // Arabic default language + English support
  const [language, setLanguage] = useState<Language>("ar");
  
  // Custom vanilla HTML5 path-sync router
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const p = window.location.pathname;
    if (p === "/admin" || p.startsWith("/admin/")) return "admin";
    if (p === "/login") return "login";
    if (p === "/speedtest") return "speedtest";
    if (p === "/vpn") return "vpn";
    if (p === "/rdp") return "rdp";
    if (p === "/blog") return "blog";
    if (p === "/how-it-works") return "how-it-works";
    if (p === "/faq") return "faq";
    return "home";
  });
  
  // Track speed results across simulation
  const [speedResults, setSpeedResults] = useState<SpeedResults | null>(null);

  // Dynamic site data states
  const [articles, setArticles] = useState<Article[]>([]);
  const [vpnOffers, setVpnOffers] = useState<VPNOffer[]>([]);
  const [rdpOffers, setRdpOffers] = useState<RDPOffer[]>([]);

  // Authenticate & Token States sourced from globally verified AuthContext
  const { token, user, loading: authLoading, login: handleLoginSuccess, logout } = useAuth();

  const fetchSiteData = async () => {
    try {
      const resp = await fetch("/api/site-data");
      if (resp.ok) {
        const data = await resp.json();
        setArticles(data.articles || []);
        setVpnOffers(data.vpnOffers || []);
        setRdpOffers(data.rdpOffers || []);
      }
    } catch (err) {
      console.error("Failed to fetch site data:", err);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);
  
  // Synchronize dynamic routing and back/forward browser navigation
  useEffect(() => {
    const syncRoute = () => {
      const p = window.location.pathname;
      if (p === "/admin" || p.startsWith("/admin/")) setCurrentPage("admin");
      else if (p === "/login") setCurrentPage("login");
      else if (p === "/speedtest") setCurrentPage("speedtest");
      else if (p === "/vpn") setCurrentPage("vpn");
      else if (p === "/rdp") setCurrentPage("rdp");
      else if (p === "/blog") setCurrentPage("blog");
      else if (p === "/how-it-works") setCurrentPage("how-it-works");
      else if (p === "/faq") setCurrentPage("faq");
      else setCurrentPage("home");
    };
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  // Sync navigation calls with address bar pathing
  const handlePageChange = (page: PageId) => {
    let path = "/";
    if (page === "home") path = "/";
    else if (page === "admin") path = "/admin";
    else if (page === "login") path = "/login";
    else path = `/${page}`;
    
    // Play sci-fi audio tick on page transition
    FutureSoundEngine.playTick();
    
    window.history.pushState(null, "", path);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    handlePageChange("home");
  };

  // Enforce Route Protection mechanisms (Frontend)
  useEffect(() => {
    if (authLoading) return;
    const path = window.location.pathname;
    
    if (currentPage === "admin") {
      // Check if logged in
      if (!token || !user) {
        window.history.replaceState(null, "", "/login");
        setCurrentPage("login");
        return;
      }
      
      // Check administrative privilege requirements
      const hasPrivilege = ["super_admin", "admin", "editor"].includes(user.role);
      if (!hasPrivilege) {
        window.history.replaceState(null, "", "/");
        setCurrentPage("home");
        return;
      }

      // Check highly sensitive SuperAdmin endpoints
      if (path.startsWith("/admin/users") || path === "/admin/users" || path.startsWith("/admin/settings") || path === "/admin/settings") {
        if (user.role !== "super_admin") {
          window.history.replaceState(null, "", "/");
          setCurrentPage("home");
        }
      }
    }

    if (currentPage === "login") {
      // Redirect already logged in users away from login
      if (token && user) {
        const hasPrivilege = ["super_admin", "admin", "editor"].includes(user.role);
        if (hasPrivilege) {
          window.history.replaceState(null, "", "/admin");
          setCurrentPage("admin");
        } else {
          window.history.replaceState(null, "", "/");
          setCurrentPage("home");
        }
      }
    }
  }, [currentPage, token, user, authLoading]);

  // Read clean sub-path for secondary component controls
  const getAdminSubPath = () => {
    const p = window.location.pathname;
    if (p.startsWith("/admin/")) {
      return p.substring(7); // e.g., "users", "settings", "blog", "offers"
    }
    return "";
  };

  const [vpnFilter, setVpnFilter] = useState<'all' | 'gaming' | 'speed' | 'privacy'>("all");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const handleTestComplete = (results: SpeedResults) => {
    setSpeedResults(results);
    setVpnFilter("all");
  };

  // Synchronize document direction with active language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white"
      id="smart-doctor-app-root"
    >
      <div>
        {/* Navigation bar (Completely hidden of admin items) */}
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={handlePageChange} 
          language={language} 
          toggleLanguage={toggleLanguage} 
        />

        {/* Global Alert Notification */}
        {currentPage === 'home' && (
          <div className="bg-gradient-to-r from-blue-950 via-[#0B1020] to-blue-950 border-b-2 border-b-[#00F0FF]/35 text-center py-2.5 px-4 text-xs font-mono shadow-[0_4px_12px_rgba(0,120,255,0.08)]" id="global-announcement-bar">
            <span>
              {language === 'ar' 
                ? "💡 جرب ترقية DNS لعنوان 1.1.1.1 لتخطي تذبذب مزودي الخدمة واستعراض عروض الـ RDP الحصرية" 
                : "💡 Try DNS 1.1.1.1 to bypass ISP routing buffers and inspect exclusive high-speed RDP offers"
              }
            </span>
          </div>
        )}

        {/* Active Route Wrapper */}
        <main className="py-8 transition-opacity duration-300" id="main-content">
          
          {currentPage === "home" && (
            <Home 
              language={language} 
              setCurrentPage={handlePageChange} 
              onTestComplete={handleTestComplete}
            />
          )}

          {currentPage === "speedtest" && (
            <SpeedTest 
              language={language} 
              onTestComplete={handleTestComplete} 
              setCurrentPage={handlePageChange} 
            />
          )}

          {currentPage === "analysis" && (
            <AIDiagnostics 
              language={language} 
              speedResults={speedResults} 
              setCurrentPage={handlePageChange} 
              setVpnFilter={setVpnFilter} 
            />
          )}

          {currentPage === "vpn" && (
            <VPNOffers 
              language={language} 
              vpnFilter={vpnFilter} 
              setVpnFilter={setVpnFilter} 
              vpnOffers={vpnOffers}
            />
          )}

          {currentPage === "rdp" && (
            <RDPOffers 
              language={language} 
              rdpOffers={rdpOffers}
            />
          )}

          {currentPage === "how-it-works" && (
            <HowItWorks 
              language={language} 
              setCurrentPage={handlePageChange} 
            />
          )}

          {currentPage === "faq" && (
            <Faq 
              language={language} 
            />
          )}

          {currentPage === "blog" && (
            <Blog 
              language={language} 
              setCurrentPage={handlePageChange}
              articles={articles}
            />
          )}

          {currentPage === "login" && (
            <Login 
              language={language}
              onLoginSuccess={handleLoginSuccess}
              setCurrentPage={handlePageChange}
            />
          )}

          {currentPage === "admin" && (
            <ProtectedAdminRoute
              setCurrentPage={handlePageChange}
            >
              <AdminDashboard 
                language={language}
                articles={articles}
                vpnOffers={vpnOffers}
                rdpOffers={rdpOffers}
                refreshData={fetchSiteData}
                setCurrentPage={handlePageChange}
                authToken={token!}
                authenticatedUser={user!}
                onLogout={handleLogout}
                initialSubPath={getAdminSubPath()}
              />
            </ProtectedAdminRoute>
          )}

        </main>
      </div>

      {/* Global Footer */}
      <Footer 
        language={language} 
        setCurrentPage={handlePageChange} 
      />

    </div>
  );
}
