import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { whatsappUrl } from "../lib/whatsapp";
import Pagination from "../components/Pagination";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

const statuses = ["جديد", "قيد التجهيز", "قيد المعالجة", "تم الشحن", "تم التوصيل", "مكتمل", "ملغي"];

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageSize = 15;

  const orders = useQuery(api.orders.list, { search: search || undefined, statusFilter: statusFilter || undefined });
  const updateStatus = useMutation(api.orders.updateStatus);
  const removeOrder = useMutation(api.orders.remove);
  const { showToast, toast } = useToast();

  const totalItems = orders?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = orders?.slice((safePage - 1) * pageSize, safePage * pageSize);

  async function handleStatusChange(id: string, status: string) {
    await updateStatus({ id: id as Id<"orders">, status });
    showToast("تم تحديث الحالة");
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await removeOrder({ id: id as Id<"orders"> });
      showToast("تم حذف الطلب", "info");
    } catch (err) {
      showToast("فشل الحذف", "error");
      console.error(err);
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "جديد": return "bg-blue-50 text-blue-700";
      case "قيد التجهيز": case "قيد المعالجة": return "bg-amber-50 text-amber-700";
      case "تم الشحن": return "bg-purple-50 text-purple-700";
      case "تم التوصيل": case "مكتمل": return "bg-emerald-50 text-emerald-700";
      case "ملغي": return "bg-red-50 text-red-700";
      default: return "bg-surface-container-highest";
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">الطلبات</h2>
            <p className="text-on-surface-variant">إدارة الطلبات وتحديث حالتها</p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="بحث باسم العميل أو رقم الهاتف..."
              className="w-full bg-surface border border-outline-variant rounded-full py-3 pr-12 pl-6 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-surface border border-outline-variant rounded-full px-4 py-3 text-sm focus:outline-none focus:border-primary"
          >
            <option value="">جميع الحالات</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="text-sm text-on-surface-variant flex items-center">{totalItems} طلب</div>
        </div>

        {!orders ? (
          <div className="p-12 text-center text-on-surface-variant animate-pulse">جاري التحميل...</div>
        ) : totalItems === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">لا توجد طلبات مطابقة</div>
        ) : (
          <>
            <div className="space-y-4">
              {paged?.map((order) => (
                <div key={order._id} className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-sm">
                  <div className="p-4 lg:p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  >
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                        {order.customerName[0]}
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold">{order.customerName}</h4>
                        <p className="text-[10px] text-on-surface-variant">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColor(order.status)}`}>{order.status}</span>
                      <span className="font-bold">{order.total} د.أ</span>
                      <span className="text-[10px] text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString("ar-JO")}</span>
                    </div>
                  </div>

                  {expandedId === order._id && (
                    <div className="px-4 lg:px-6 pb-6 border-t border-surface-container-highest pt-4">
                      <div className="mb-4">
                        <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">المنتجات</h5>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm flex-row-reverse">
                              <span>{item.productName} × {item.quantity}</span>
                              <span className="font-medium">{item.price * item.quantity} د.أ</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm font-bold mt-3 pt-3 border-t border-surface-container-highest flex-row-reverse">
                          <span>المجموع</span>
                          <span>{order.total} د.أ</span>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mb-4">
                          <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">ملاحظات</h5>
                          <p className="text-sm text-on-surface-variant">{order.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border border-outline-variant rounded-full px-4 py-2 text-xs font-bold bg-transparent focus:outline-none focus:border-primary">
                          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <a href={whatsappUrl(`السلام عليكم ${order.customerName}، بخصوص طلبك رقم ${order._id.slice(-6)} حالته: ${order.status}`)}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-[10px] font-bold hover:bg-surface-container-low transition-colors">
                          <MessageCircle size={14} className="text-[#25D366]" /> واتساب
                        </a>

                        <button onClick={() => handleDelete(order._id)}
                          className="px-4 py-2 rounded-full border border-red-200 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors">حذف</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Pagination current={safePage} total={totalItems} pageSize={pageSize} onChange={setPage} />
          </>
        )}
        <Toast toast={toast} />
      </div>
    </AdminLayout>
  );
}
