import { useAuth, useUser, SignOutButton } from "@clerk/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageCircle,
  LogOut,
  Menu,
  Percent,
  Users,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";

const allMenuItems = [
  { icon: LayoutDashboard, label: "نظرة عامة", path: "/admin", minRole: null },
  { icon: Package, label: "المنتجات", path: "/admin/products", minRole: null },
  { icon: Percent, label: "العروض", path: "/admin/offers", minRole: "admin" },
  { icon: ShoppingCart, label: "الطلبات", path: "/admin/orders", minRole: null },
  { icon: MessageCircle, label: "رسائل العملاء", path: "/admin/contacts", minRole: null },
  { icon: Users, label: "المستخدمين", path: "/admin/users", minRole: "admin" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sidebarOpen) {
      closeRef.current?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [sidebarOpen]);

  const handleTabTrap = useCallback((e: KeyboardEvent) => {
    if (!sidebarOpen || !sidebarRef.current) return;
    const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [sidebarOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleTabTrap);
    return () => document.removeEventListener("keydown", handleTabTrap);
  }, [handleTabTrap]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-on-surface-variant">جاري التحميل...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    navigate("/sign-in");
    return null;
  }

  const isAdmin = String(user?.publicMetadata?.isAdmin ?? "") === "true";
  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const menuItems = allMenuItems.filter((item) => item.minRole === null || isAdmin);

  return (
    <div className="flex bg-background min-h-screen overflow-x-hidden" dir="rtl" style={{ backgroundImage: 'radial-gradient(ellipse at top left, var(--color-surface-container) 0%, transparent 70%)' }}>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-inverse-surface/30 z-30 lg:hidden transition-opacity duration-200 ease-out will-change-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)} aria-hidden="true"
      />

      {/* Sidebar */}
      <aside ref={sidebarRef}
        className={`fixed lg:sticky top-0 right-0 h-full w-72 bg-surface border-l border-surface-container-highest flex flex-col p-6 z-40 transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-on-surface relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:transition-[width] after:duration-200 after:ease-out after:w-0 hover:after:w-full">
            الثقة
          </Link>
          <button ref={closeRef} onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
            className="lg:hidden w-11 h-11 text-on-surface-variant hover:text-on-surface active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 rounded-lg flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 px-4 mb-6 pb-6 border-b border-surface-container-highest">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "م"}
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {user?.fullName || "مستخدم"}
            </h3>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider">
              مدير
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-4 px-4 py-3 rounded-xl relative overflow-hidden active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition-all duration-150 ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-variant"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className={`transition-transform duration-150 group-hover:scale-110 ${location.pathname === item.path ? "text-primary" : ""}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 mt-4 border-t border-surface-container-highest">
          <SignOutButton redirectUrl="/">
            <button className="flex items-center gap-4 px-4 py-3 text-error hover:bg-error-container hover:text-on-error-container rounded-xl active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:outline-none transition duration-150 w-full">
              <LogOut size={20} />
              <span className="text-sm font-medium">تسجيل خروج</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen min-w-0">
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest px-4 lg:px-8 py-4 flex justify-between items-center h-16 lg:h-20">
          <button ref={hamburgerRef}
            className="lg:hidden w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 rounded-lg"
            onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg lg:text-xl font-bold">الثقة للمنتجات البلدية</h1>
          <div />
        </header>
        <div className="p-4 lg:p-8 pb-16">{children}</div>
      </main>
    </div>
  );
}
