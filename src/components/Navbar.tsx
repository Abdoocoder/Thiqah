import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#products", label: "المنتجات" },
  { href: "#offers", label: "العروض" },
  { href: "#contact", label: "تواصل معنا" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen(!open)}
            className="text-primary hover:text-black transition-colors lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-primary">الثقة للمنتجات البلدية</h1>
          <nav className="hidden lg:flex items-center gap-8 mr-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(l.href.slice(1)); }}
                className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            لوحة التحكم
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-surface border-b border-surface-container-highest">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => { e.preventDefault(); setOpen(false); scrollToSection(l.href.slice(1)); }}
                className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
