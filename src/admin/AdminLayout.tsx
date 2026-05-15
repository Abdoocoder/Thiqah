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
} from "lucide-react";
import { useState, type ReactNode } from "react";

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

  const isAdmin = user?.publicMetadata?.isAdmin === true || user?.publicMetadata?.isAdmin === "true";
  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const menuItems = allMenuItems.filter((item) => item.minRole === null || isAdmin);

  return (
    <div className="flex bg-background min-h-screen" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-full w-72 bg-surface border-l border-surface-container-highest flex flex-col p-6 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center px-4">
          <Link to="/" className="text-2xl font-bold text-on-surface">
            الثقة
          </Link>
        </div>

        <div className="flex items-center gap-4 px-4 mb-10">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "م"}
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {user?.fullName || "مستخدم"}
            </h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              مدير
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-on-surface-variant hover:bg-surface-variant"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <SignOutButton redirectUrl="/">
          <button className="flex items-center gap-4 px-4 py-3 text-error hover:bg-error-container hover:text-on-error-container rounded-full transition-colors mt-auto w-full">
            <LogOut size={20} />
            <span className="text-sm font-medium">تسجيل خروج</span>
          </button>
        </SignOutButton>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest px-4 lg:px-8 py-4 flex justify-between items-center h-16 lg:h-20">
          <button
            className="lg:hidden text-on-surface-variant hover:text-on-surface"
            onClick={() => setSidebarOpen(true)}
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
