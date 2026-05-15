/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Menu, 
  MessageCircle, 
  ShoppingCart, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  AlertTriangle,
  History,
  MoreVertical,
  Eye,
  CloudUpload,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

// --- Shared Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-primary',
    outline: 'border border-outline text-on-surface hover:bg-surface-container',
    ghost: 'text-on-surface hover:bg-surface-container-low',
    admin: 'bg-primary text-white hover:bg-primary-container',
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all duration-300 font-semibold tracking-wider uppercase text-xs ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Landing Page Screens ---

const LandingPage = () => {
  return (
    <div className="flex flex-col" dir="rtl">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button className="text-primary hover:text-black transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-primary">الثقة للمنتجات البلدية</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs font-bold border border-outline px-4 py-2 rounded hover:bg-surface-container transition-colors">
              AR/EN
            </button>
            <Link to="/admin" className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 parallax-bg"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDD4gG2wh2XMtpm3HCp4xDtZeL7avCF1ArxfOndRIE8zgDXRlNIlV4qAjkm87uu9QVnex3s1W_EpVYSezGaGOunbvKe9Ohxjrb-eYkBeUi3ShBCq54z1E2lZ0kL58_72-K3nBMFeJz3-3e6HPxlemF6zqbLHudgU97Aj2IEICJl75Hh08LgN9LdURa6aHsRJ1lcu0ha6JN1PKIwmCfpQDHDanphtu1U07c-nXpmfhHg3iGmUVgON3DLwM3nZ27SE9lkOjM5RRKJXKTG')` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
          >
            الأصالة من قلب مأدبا
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button className="gap-3">
              <MessageCircle size={20} />
              اطلب الآن عبر واتساب
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">منتجاتنا المميزة</h3>
          <p className="text-on-surface-variant max-w-2xl mx-auto">جودة لا تضاهى، من مزارعنا إلى مائدتكم مباشرة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProductCard 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuC1j3jsj83GLPSxBxRpYr92klIX9DiFQ1QRAw1SSfQDAW89iEjVVTWMOjdJCZKAl62nXbhL8b9dT_TucWxV2_Y74pfDp8NRDyr2GtDokB6Ttr_BpN8t6732cp8xYfZJuHeJmNvSZKLq2ukM9fxQ_HN0Oc847EyXrkmhRgeMOf7SUHjQNT2YNQg_o-HDHBuQiec_k8zchDGPT90OfXGrzpZl_3MXW0bBWk7zNW9Jy2qbb4Zgd1KKetFOLMnk_jvEasH2wBlKMWNx_PkR"
            category="زيت زيتون"
            title="زيت زيتون بكر ممتاز"
          />
          <ProductCard 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuC-iFxdUhgNNgAbAZ5ByKwFtJk3hscECUJ3PomsP-AyKwUPC-pYHgRyLPnYmB1HBoNQNHQVXRm1RppH84gmBsF934DTNfC-2vx066eHVwy4qpMFtO1SZzcdaDiALfmiLiSV2-Pm2DUqdE5Zuhe4HudyIO93KkyhS3lwJQeRfNIwEDGS1csxMrupVNhRcLMRtvjQ-cJ1-dsB2V8A9ANR3qAB2U7INJf_o2sF8oJVQdHh0hRofniIF6sr9dKDlbxB__Wb7Joq6fxaygxt"
            category="أجبان"
            title="جبنة غنم بلدية"
            className="md:mt-12"
          />
          <ProductCard 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBj55iEfKgtk1YLvXBum1UXZ2lXi9bLRQuf1MvAgun2tGLmpeX8y8jqmDNTNmGvEEuXVao7Wnek4Vwe4RQoYlrirP9OXjssczyOvqcr0lnJnzhI0H0hgiNzfvkXgRGhXa-_9ypz2H1wjGahQlynq8If-rHMHDgDh6_Yo4Hhyo3YcbO68VUz1OFVWEbtAJfkjfNkm3jGrD9EAhyXNFf-wAVrJJn5Ho16ez7YW3Mt4DzxX3-NVQfE3RCfdkzUfPhT5I7sgatcmEcxJTBW"
            category="سمن"
            title="سمن بلدي أصلي"
          />
        </div>
      </section>

      {/* Story */}
      <section className="relative py-32 overflow-hidden bg-black text-white flex items-center min-h-[600px]">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center parallax-bg opacity-40"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3AsgseHp2wEDUDjheQXbDAWwduJgwrMUVj17ujJEDlQ1MWQGpBDplVOsGv8ICscKxC8tT8VOkbRgEsrvDR8vmeH7N3eDK5ecl-zbXyc6WOqUrEvPl1dZD1I3IrkIONvNMpdDwRkOWz2lyYu73KuYSoCPk-dCzl1HOOY9_HwBbn94asz-3OFSezKA2VuPFZoAvvjTG4mr_PJDnzmv-LZsU6wfZzyBEMmt585mm16Pn3DdW7fX6KfFqftP8gMXRKA3xPjvUGu9a5OEv')` }}
          />
        </div>
        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full text-right">
          <div className="max-w-xl mr-0">
            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4 block">قصتنا</span>
            <h3 className="text-4xl font-light mb-6 leading-tight">من الأرض، بكل فخر وعناية.</h3>
            <p className="text-lg opacity-80 leading-relaxed mb-8">
              نحن نؤمن بأن الجودة الحقيقية تبدأ من التربة. في مزارعنا بمأدبا، نحافظ على التقاليد الزراعية القديمة ونمزجها بمعايير العصر الحديث لتقديم منتجات بلدية ترقى لتوقعاتكم.
            </p>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              اكتشف المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-6 text-white text-center">
        <h4 className="text-2xl font-bold mb-8">الثقة للمنتجات البلدية</h4>
        <nav className="flex flex-wrap justify-center gap-8 mb-8 opacity-60">
          <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Our Story</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Farm to Table</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Contact Support</a>
        </nav>
        <p className="text-sm opacity-40">© 2024 الثقة للمنتجات البلدية. Quality & Warranty Guaranteed.</p>
      </footer>
    </div>
  );
};

const ProductCard = ({ image, category, title, className = '' }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`group flex flex-col gap-4 cursor-pointer text-right ${className}`}
  >
    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-container">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex flex-col gap-1 p-2">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{category}</span>
      <h4 className="text-lg font-medium">{title}</h4>
      <div className="flex items-center gap-2 text-primary mt-2 group-hover:gap-3 transition-all justify-start">
        <ShoppingCart size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">طلب عبر واتساب</span>
      </div>
    </div>
  </motion.div>
);

// --- Admin Components ---

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '#' },
    { icon: Settings, label: 'Settings', path: '#' },
  ];

  return (
    <div className="flex bg-background min-h-screen" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 fixed right-0 top-0 h-full bg-surface-container-low border-l border-surface-container-highest flex flex-col p-6 z-40">
        <div className="mb-12 flex items-center px-4">
          <Link to="/" className="text-2xl font-bold text-on-surface">الثقة</Link>
        </div>
        
        <div className="flex items-center gap-4 px-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant overflow-hidden">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhGYEmH0zkGDnf1ecYFILLW3-N12i31417IC6GVJA5yRBZIC9szceLjvLzgJCioZIWV4aiv0JNEPybByksN6HnZ9zGsS8nfg_-1Rtj2MKcFlvz7yrS9w5gf7DMyuj8cASRheCFWlml-tBFgIAb-TFxyAv8ZC8dp7IB-T6oDYg122YHRG1YAxdchOlwzm-jgVPXJYWkaeHeBukTtGhnL14wmUzrUWhEP5I425dK6dyGxkiYUOjaKOsYArYh5iG5cqHSnjywg6YsCYlJ" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Admin User</h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Manage Storefront</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all ${location.pathname === item.path ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant'}`}
            >
              <item.icon size={20} fill={location.pathname === item.path ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3 text-error hover:bg-error-container rounded-full transition-colors mt-auto">
          <LogOut size={20} />
          <span className="text-sm font-medium leading-none">تسجيل خروج</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-72">
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest px-8 py-4 flex justify-between items-center h-20">
          <h1 className="text-xl font-bold">الثقة للمنتجات البلدية</h1>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">AR/EN</button>
        </header>
        <div className="p-8 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const orders = [
    { id: '#ORD-092', customer: 'أحمد محمود', initial: 'أ.م', status: 'قيد التجهيز', price: '120 د.أ' },
    { id: '#ORD-091', customer: 'سارة عبدالله', initial: 'س.ع', status: 'تم الشحن', price: '45 د.أ' },
    { id: '#ORD-090', customer: 'محمد حسن', initial: 'م.ح', status: 'تم الشحن', price: '210 د.أ' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-12 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-4xl font-bold mb-2">نظرة عامة</h2>
            <p className="text-on-surface-variant">مرحباً بعودتك، إليك ملخص لأداء المتجر اليوم.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface border border-outline px-6 py-3 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-surface-container transition-colors">
              <History size={16} />
              إنشاء عرض
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-primary transition-colors">
              <Plus size={16} />
              إضافة منتج
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="إجمالي المبيعات" value="4,250 د.أ" icon={TrendingUp} trend="+12% هذا الأسبوع" />
          <StatCard title="الطلبات النشطة" value="24" icon={ShoppingCart} sub="10 قيد التجهيز" />
          <StatCard title="مستوى المخزون" value="8" icon={AlertTriangle} trend="منتجات منخفضة" destructive />
        </div>

        <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center flex-row-reverse">
            <h3 className="text-xl font-bold">أحدث الطلبات</h3>
            <button className="text-[10px] font-bold text-primary tracking-widest uppercase">عرض الكل</button>
          </div>
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest">
              <tr>
                <th className="py-4 px-6 font-normal">رقم الطلب</th>
                <th className="py-4 px-6 font-normal">العميل</th>
                <th className="py-4 px-6 font-normal text-right">الحالة</th>
                <th className="py-4 px-6 font-normal text-right">المجموع</th>
                <th className="py-4 px-6 font-normal text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-6 font-medium">{order.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">
                        {order.initial}
                      </div>
                      <span className="text-sm">{order.customer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.status === 'قيد التجهيز' ? 'bg-surface-container-highest' : 'bg-primary-container text-on-primary-container'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold">{order.price}</td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-on-surface-variant hover:text-black">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, sub, destructive }: any) => (
  <div className="bg-surface rounded-xl p-6 h-48 border border-surface-container-highest flex flex-col justify-between shadow-sm text-right">
    <div className="flex justify-between items-start flex-row-reverse">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</span>
      <Icon size={18} className={destructive ? 'text-error' : 'text-primary'} />
    </div>
    <div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {trend && <p className={`text-xs flex items-center gap-1 justify-end ${destructive ? 'text-error' : 'text-primary'}`}>{trend}</p>}
      {sub && <p className="text-xs text-on-surface-variant">{sub}</p>}
    </div>
  </div>
);

const Products = () => {
  return (
    <AdminLayout>
       <div className="max-w-6xl mx-auto space-y-12 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-4xl font-bold mb-2">إدارة المنتجات</h2>
            <p className="text-on-surface-variant">إضافة وتعديل المنتجات المتاحة في المتجر.</p>
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-full flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase hover:bg-primary transition-all">
            <Plus size={18} />
            إضافة منتج جديد
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add/Edit Product Form */}
          <div className="xl:col-span-1 bg-surface-container-low rounded-2xl p-8 border border-surface-container-highest h-fit sticky top-28">
            <h3 className="text-xl font-bold mb-8">تفاصيل المنتج</h3>
            <div className="space-y-6">
              <div className="aspect-square bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors group">
                <CloudUpload size={40} className="text-outline-variant mb-4 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-bold text-outline-variant uppercase tracking-wider group-hover:text-primary transition-colors text-center">اسحب الصورة هنا أو اضغط للرفع</span>
              </div>
              
              <FloatingInput label="اسم المنتج" value="زيت زيتون بكر ممتاز" />
              
              <div className="relative pt-4 text-right">
                <label className="absolute top-0 right-0 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">التصنيف</label>
                <div className="relative border-b border-on-surface-variant flex items-center flex-row-reverse">
                  <select className="w-full bg-transparent py-3 text-lg focus:outline-none appearance-none cursor-pointer text-right px-0">
                    <option>زيت زيتون</option>
                    <option>سمن بلدي</option>
                    <option>أجبان</option>
                  </select>
                  <ChevronDown className="absolute left-0 pointer-events-none" size={18} />
                </div>
              </div>

              <FloatingInput label="السعر (دينار أردني)" value="45.00" type="number" />
              
              <div className="relative pt-4">
                <label className="absolute top-0 right-0 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">الوصف</label>
                <textarea className="w-full bg-transparent border-b border-on-surface-variant py-3 text-sm focus:outline-none resize-none h-24 text-right" defaultValue="عصرة أولى على البارد، من مزارع مادبا العريقة. يتميز بحموضة منخفضة ونكهة غنية." />
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors">حفظ التغييرات</button>
                <button className="px-6 py-4 rounded-full border border-outline text-[10px] font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">إلغاء</button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <ProductAdminCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuC1j3jsj83GLPSxBxRpYr92klIX9DiFQ1QRAw1SSfQDAW89iEjVVTWMOjdJCZKAl62nXbhL8b9dT_TucWxV2_Y74pfDp8NRDyr2GtDokB6Ttr_BpN8t6732cp8xYfZJuHeJmNvSZKLq2ukM9fxQ_HN0Oc847EyXrkmhRgeMOf7SUHjQNT2YNQg_o-HDHBuQiec_k8zchDGPT90OfXGrzpZl_3MXW0bBWk7zNW9Jy2qbb4Zgd1KKetFOLMnk_jvEasH2wBlKMWNx_PkR"
                title="زيت زيتون بكر ممتاز - تنكة ١٦ كغم"
                category="زيت زيتون"
                price="120.00 د.أ"
                stock="45"
             />
             <ProductAdminCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuC-iFxdUhgNNgAbAZ5ByKwFtJk3hscECUJ3PomsP-AyKwUPC-pYHgRyLPnYmB1HBoNQNHQVXRm1RppH84gmBsF934DTNfC-2vx066eHVwy4qpMFtO1SZzcdaDiALfmiLiSV2-Pm2DUqdE5Zuhe4HudyIO93KkyhS3lwIeRfNIwEDGS1csxMrupVNhRcLMRtvjQ-cJ1-dsB2V8A9ANR3qAB2U7INJf_o2sF8oJVQdHh0hRofniIF6sr9dKDlbxB__Wb7Joq6fxaygxt"
                title="جبنة نابلسية مغلية - ١ كغم"
                category="أجبان"
                price="6.50 د.أ"
                stock="120"
             />
             <ProductAdminCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBj55iEfKgtk1YLvXBum1UXZ2lXi9bLRQuf1MvAgun2tGLmpeX8y8jqmDNTNmGvEEuXVao7Wnek4Vwe4RQoYlrirP9OXjssczyOvqcr0lnJnzhI0H0hgiNzfvkXgRGhXa-_9ypz2H1wjGahQlynq8If-rHMHDgDh6_Yo4Hhyo3YcbO68VUz1OFVWEbtAJfkjfNkm3jGrD9EAhyXNFf-wAVrJJn5Ho16ez7YW3Mt4DzxX3-NVQfE3RCfdkzUfPhT5I7sgatcmEcxJTBW"
                title="سمن غنم بلدي أصلي - مرتبان كبير"
                category="سمن بلدي"
                price="25.00 د.أ"
                stock="15"
                span
             />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const ProductAdminCard = ({ image, title, category, price, stock, span }: any) => (
  <div className={`bg-surface rounded-2xl overflow-hidden border border-surface-container-highest group ${span ? 'md:col-span-2' : ''} shadow-sm transition-all hover:shadow-md h-fit text-right`}>
    <div className={`relative overflow-hidden bg-surface-container-low ${span ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface hover:text-primary transition-colors">
          <Edit2 size={16} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-error hover:bg-error-container hover:text-white transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 flex-row-reverse">
      <div className="text-right">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{category}</span>
        <h4 className="text-lg font-bold truncate max-w-[250px]">{title}</h4>
      </div>
      <div className="flex gap-4 items-center whitespace-nowrap flex-row-reverse">
        <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold">متوفر: {stock}</span>
        <span className="text-xl font-bold text-primary">{price}</span>
      </div>
    </div>
  </div>
);

const FloatingInput = ({ label, value, type = 'text' }: any) => (
  <div className="relative pt-4 text-right">
    <input 
      type={type}
      defaultValue={value}
      placeholder=" " 
      className="peer block w-full bg-transparent border-b border-on-surface-variant py-3 text-lg focus:outline-none focus:border-primary transition-colors text-right"
    />
    <label className="absolute right-0 top-0 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">
      {label}
    </label>
  </div>
);

const Orders = () => {
    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-12 text-right">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-bold">الطلبات والتواصل</h2>
                    <p className="text-on-surface-variant">إدارة الطلبات الحديثة، رسائل العملاء، والتواصل السريع.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white rounded-xl border border-surface-container-highest p-8 shadow-sm">
                        <div className="flex justify-between items-center border-b border-surface-container-high pb-6 mb-6 flex-row-reverse">
                            <h3 className="text-xl font-bold">أحدث الطلبات</h3>
                            <button className="text-[10px] font-bold text-primary flex items-center gap-2 uppercase tracking-widest">
                                <ArrowRight size={14} />
                                عرض الكل
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-surface-container-highest">
                                    <tr>
                                        <th className="py-4 px-4 font-normal text-right">رقم الطلب</th>
                                        <th className="py-4 px-4 font-normal text-right">العميل</th>
                                        <th className="py-4 px-4 font-normal text-right">التاريخ</th>
                                        <th className="py-4 px-4 font-normal text-right">الحالة</th>
                                        <th className="py-4 px-4 font-normal text-right">المبلغ</th>
                                        <th className="py-4 px-4 font-normal text-center">إجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[
                                        { id: '#ORD-9021', name: 'أحمد عبدالله', date: '٢٤ أكتوبر ٢٠٢٤', status: 'قيد المعالجة', price: '١٤٥ د.أ', statusStyle: 'bg-primary-container text-on-primary-container' },
                                        { id: '#ORD-9020', name: 'سارة خليل', date: '٢٣ أكتوبر ٢٠٢٤', status: 'مكتمل', price: '٨٥ د.أ', statusStyle: 'border border-outline-variant' },
                                        { id: '#ORD-9019', name: 'محمود الرواشدة', date: '٢٢ أكتوبر ٢٠٢٤', status: 'بانتظار الدفع', price: '٢١٠ د.أ', statusStyle: 'bg-error-container text-on-error-container' },
                                    ].map((row) => (
                                        <tr key={row.id} className="hover:bg-surface-container-low transition-colors border-b border-surface-container-highest last:border-none">
                                            <td className="py-4 px-4 font-bold">{row.id}</td>
                                            <td className="py-4 px-4">{row.name}</td>
                                            <td className="py-4 px-4 text-on-surface-variant">{row.date}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.statusStyle}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-bold">{row.price}</td>
                                            <td className="py-4 px-4 text-center">
                                                <button className="text-on-surface-variant hover:text-black transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Quick Contact */}
                        <div className="bg-white rounded-xl border border-surface-container-highest p-8 shadow-sm flex flex-col gap-6">
                            <h3 className="text-lg font-bold border-b border-surface-container-high pb-4">تواصل سريع</h3>
                            <div className="flex flex-col gap-4">
                                {[
                                    { name: 'أحمد عبدالله', phone: '079 123 4567', initial: 'أع' },
                                    { name: 'سارة خليل', phone: '078 987 6543', initial: 'سخ' },
                                    { name: 'محمود الرواشدة', phone: '077 555 1234', initial: 'مر' },
                                ].map((contact) => (
                                    <div key={contact.phone} className="flex items-center justify-between group cursor-pointer hover:bg-surface-container-low p-2 rounded-lg transition-all border border-transparent hover:border-surface-container-highest flex-row-reverse">
                                        <div className="flex items-center gap-4 flex-row-reverse">
                                            <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-xs uppercase">
                                                {contact.initial}
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-sm font-bold">{contact.name}</span>
                                                <span className="text-[10px] text-on-surface-variant tracking-wider">{contact.phone}</span>
                                            </div>
                                        </div>
                                        <button className="text-surface-variant group-hover:text-[#25D366] transition-colors">
                                            <MessageCircle size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inbox */}
                        <div className="bg-white rounded-xl border border-surface-container-highest p-8 shadow-sm flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b border-surface-container-high pb-4 flex-row-reverse">
                                <h3 className="text-lg font-bold">صندوق الوارد</h3>
                                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">٢ جديد</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="p-4 rounded-xl bg-surface-container-low border-r-4 border-primary space-y-2">
                                    <div className="flex justify-between text-xs font-bold flex-row-reverse">
                                        <span>خالد النجار</span>
                                        <span className="text-on-surface-variant opacity-60">منذ ساعتين</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant line-clamp-2">مرحباً، أود الاستفسار عن توفر زيت الزيتون البكر الممتاز في عبوات سعة ٥ لتر للطلب بالجملة.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border border-surface-container-highest hover:bg-surface-container-low transition-colors space-y-2 cursor-pointer text-right">
                                    <div className="flex justify-between text-xs font-bold flex-row-reverse">
                                        <span className="opacity-70">ياسمين طارق</span>
                                        <span className="text-on-surface-variant opacity-40">أمس</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant opacity-60 line-clamp-1">شكراً لكم على التوصيل السريع. المنتجات ممتازة.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// --- App Root ---

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}
