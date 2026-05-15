import { MessageCircle } from "lucide-react";
import { openWhatsapp, generalInquiry, whatsappUrl } from "../lib/whatsapp";

const quickLinks = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#products", label: "المنتجات" },
  { href: "#offers", label: "العروض" },
  { href: "#contact", label: "اتصل بنا" },
];

export default function Footer() {
  return (
    <footer className="bg-inverse-surface pt-16 pb-8 px-6 text-on-inverse">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-right">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="الثقة للمنتجات البلدية" className="h-10 w-10" />
              <h4 className="text-2xl font-bold">الثقة للمنتجات البلدية</h4>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              منتجات بلدية طازجة من مزارعنا في مأدبا إلى مائدتكم. جودة وكفالة.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">
              روابط سريعة
            </h5>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">
              تواصل معنا
            </h5>
            <a
              href={whatsappUrl(generalInquiry())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-whatsapp hover:text-whatsapp/80 transition-colors mb-4"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-bold">0779248914</span>
            </a>
            <p className="text-sm opacity-60">مأدبا، الأردن</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center space-y-2">
          <p className="text-sm opacity-40">
            © {new Date().getFullYear()} الثقة للمنتجات البلدية. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs opacity-30 hover:opacity-60 transition-opacity">
            تصميم وتطوير بواسطة{" "}
            <a
              href="https://www.abdoocoder.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-on-inverse transition-colors"
            >
              Abdoo Coder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
