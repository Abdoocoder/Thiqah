import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AdminLayout from "./AdminLayout";
import { TrendingUp, ShoppingCart, AlertTriangle, Package, type LucideIcon } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  sub,
  destructive,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
  destructive?: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-surface-container-highest flex flex-col justify-between shadow-sm text-right">
      <div className="flex justify-between items-start flex-row-reverse">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          {title}
        </span>
        <Icon
          size={18}
          className={destructive ? "text-error" : "text-primary"}
        />
      </div>
      <div>
        <p className="text-3xl font-bold mb-1">{value}</p>
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
}

export default function Dashboard() {
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
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
          />
          <StatCard
            title="الطلبات النشطة"
            value={`${activeOrders}`}
            icon={ShoppingCart}
            sub="قيد المعالجة"
          />
          <StatCard
            title="المنتجات"
            value={`${totalProducts}`}
            icon={Package}
            sub={`${offers?.length || 0} عرض نشط`}
          />
          <StatCard
            title="مخزون منخفض"
            value={`${lowStock}`}
            icon={AlertTriangle}
            sub="أقل من 20 قطعة"
            destructive={lowStock > 0}
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center flex-row-reverse">
            <h3 className="text-xl font-bold">أحدث الطلبات</h3>
          </div>
          {!orders ? (
            <div className="p-12 text-center text-on-surface-variant animate-pulse">
              جاري التحميل...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              لا توجد طلبات بعد
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right" dir="rtl">
                <thead className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="py-4 px-6 font-normal">رقم الطلب</th>
                    <th className="py-4 px-6 font-normal">العميل</th>
                    <th className="py-4 px-6 font-normal">الحالة</th>
                    <th className="py-4 px-6 font-normal">المجموع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest">
                  {orders.slice(0, 5).map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">
                        {order._id.slice(-6)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 flex-row-reverse">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">
                            {order.customerName[0]}
                          </div>
                          <span className="text-sm">
                            {order.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            order.status === "جديد"
                              ? "bg-primary-container text-on-primary-container"
                              : order.status === "تم التوصيل" || order.status === "مكتمل"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-surface-container-highest"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold">
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
        <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
          <div className="p-6 border-b border-surface-container-highest flex justify-between items-center flex-row-reverse">
            <h3 className="text-xl font-bold">أحدث الرسائل</h3>
          </div>
          {!contacts ? (
            <div className="p-12 text-center text-on-surface-variant animate-pulse">
              جاري التحميل...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              لا توجد رسائل بعد
            </div>
          ) : (
            <div className="divide-y divide-surface-container-highest">
              {contacts.slice(0, 3).map((contact) => (
                <div
                  key={contact._id}
                  className={`p-6 flex items-start gap-4 flex-row-reverse ${
                    !contact.read ? "bg-primary-container/10" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-sm font-bold shrink-0">
                    {contact.name[0]}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex justify-between items-center flex-row-reverse">
                      <h4 className="font-bold text-sm">{contact.name}</h4>
                      <span className="text-[10px] text-on-surface-variant">
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
