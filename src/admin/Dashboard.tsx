import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AdminLayout from "./AdminLayout";
import { memo, useEffect } from "react";
import { TrendingUp, ShoppingCart, AlertTriangle, Package, type LucideIcon } from "lucide-react";
import { TableSkeleton, ContactSkeleton } from "../components/Skeleton";

const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  sub,
  destructive,
  idx = 0,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  destructive?: boolean;
  idx?: number;
}) {
  return (
    <div
      className="group bg-surface rounded-xl p-6 border border-surface-container-highest flex flex-col justify-between shadow-card text-right transition-[transform,box-shadow] duration-300 ease-card hover:shadow-card-lift hover:-translate-y-0.5"
      style={{ animation: `countIn 250ms ease-out forwards`, animationDelay: `${idx * 60}ms` }}
    >
      <div className="flex justify-between items-start flex-row-reverse">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
          destructive ? "bg-error-container text-error" : "bg-primary/10 text-primary"
        }`}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums">{value}</p>
        {sub && (
          <p
            className={`text-xs flex items-center gap-1 justify-end ${
              destructive ? "text-error" : "text-on-surface-variant"
            }`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
});

export default function Dashboard() {
  useEffect(() => { document.title = "نظرة عامة — الثقة"; }, []);

  const products = useQuery(api.products.list, {});
  const orders = useQuery(api.orders.list, {});
  const contacts = useQuery(api.contacts.list, {});
  const offers = useQuery(api.offers.list, {});

  const totalSales =
    orders
      ?.filter((o) => o.status === "تم التوصيل" || o.status === "مكتمل")
      .reduce((sum, o) => sum + o.total, 0) || 0;

  const activeOrders = orders?.filter((o) =>
    ["جديد", "قيد التجهيز", "قيد المعالجة"].includes(o.status)
  ).length || 0;

  const lowStock =
    products?.filter((p) => p.stock < 20).length || 0;

  const totalProducts = products?.length || 0;
  const activeOffers = offers?.filter((o) => !(Date.now() > o.expiryDate)).length || 0;
  const unreadContacts = contacts?.filter((c) => !c.read).length || 0;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              نظرة عامة
            </h2>
            <p className="text-on-surface-variant">
              ملخص أداء المتجر
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="إجمالي المبيعات"
            value={`${totalSales} د.أ`}
            icon={TrendingUp}
            sub={`${orders?.length || 0} طلب`}
            idx={0}
          />
          <StatCard
            title="الطلبات النشطة"
            value={`${activeOrders}`}
            icon={ShoppingCart}
            sub="قيد المعالجة"
            idx={1}
          />
          <StatCard
            title="المنتجات"
            value={`${totalProducts}`}
            icon={Package}
            sub={`${offers?.length || 0} عرض نشط`}
            idx={2}
          />
          <StatCard
            title="مخزون منخفض"
            value={`${lowStock}`}
            icon={AlertTriangle}
            sub="أقل من 20 قطعة"
            destructive={lowStock > 0}
            idx={3}
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-card">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center flex-row-reverse">
            <h3 className="text-xl font-bold">أحدث الطلبات</h3>
          </div>
          {!orders ? (
            <div className="p-6">
              <TableSkeleton rows={4} />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              لا توجد طلبات بعد
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir="rtl">
                <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest">
                  <tr>
                    <th className="py-3 px-3 sm:px-6 font-normal">رقم الطلب</th>
                    <th className="py-3 px-3 sm:px-6 font-normal">العميل</th>
                    <th className="py-3 px-3 sm:px-6 font-normal">الحالة</th>
                    <th className="py-3 px-3 sm:px-6 font-normal">المجموع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest">
                  {orders.slice(0, 5).map((order, idx) => (
                    <tr
                      key={order._id}
                      className="animate-fade-in hover:bg-surface-container-low transition-colors"
                      style={{ animationDelay: `${idx * 60}ms` }}>
                      <td className="py-3 px-3 sm:px-6 font-medium text-sm">
                        {order._id.slice(-6)}
                      </td>
                      <td className="py-3 px-3 sm:px-6">
                        <div className="flex items-center gap-2 sm:gap-3 flex-row-reverse">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold shrink-0">
                            {order.customerName[0]}
                          </div>
                          <span className="text-sm truncate max-w-[80px] sm:max-w-none">
                            {order.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-6">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            order.status === "جديد"
                              ? "bg-primary-container text-on-primary-container"
                              : order.status === "تم التوصيل" || order.status === "مكتمل"
                              ? "bg-success-container text-success"
                              : "bg-surface-container-highest"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-6 font-bold text-sm whitespace-nowrap">
                        {order.total} د.أ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-card">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center flex-row-reverse">
            <h3 className="text-xl font-bold">أحدث الرسائل</h3>
          </div>
          {!contacts ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <ContactSkeleton key={i} />)}
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              لا توجد رسائل بعد
            </div>
          ) : (
            <div className="divide-y divide-surface-container-highest">
              {contacts.slice(0, 3).map((contact, idx) => (
                <div
                  key={contact._id}
                  className={`animate-fade-in p-6 flex items-start gap-4 flex-row-reverse ${
                    !contact.read ? "bg-primary-container/10" : ""
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-sm font-bold shrink-0">
                    {contact.name[0]}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex justify-between items-center flex-row-reverse">
                      <h4 className="font-bold text-sm">{contact.name}</h4>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(contact.createdAt).toLocaleDateString("ar-JO")}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
