import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { MessageCircle, Search, X, ShoppingBag } from "lucide-react";
import { OrderSkeleton } from "../components/Skeleton";
import { useState, useEffect } from "react";
import { whatsappUrl } from "../lib/whatsapp";
import Pagination from "../components/Pagination";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const statuses = ["جديد", "قيد التجهيز", "قيد المعالجة", "تم الشحن", "تم التوصيل", "مكتمل", "ملغي"];

export default function Orders() {
  useEffect(() => { document.title = "الطلبات — الثقة"; }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
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
    try {
      await updateStatus({ id: id as Id<"orders">, status });
      showToast("تم تحديث الحالة");
    } catch (err) {
      showToast("فشل تحديث الحالة", "error");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
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
      case "جديد": return "bg-info-container text-info";
      case "قيد التجهيز": case "قيد المعالجة": return "bg-warning-container text-warning";
      case "تم الشحن": return "bg-surface-container-highest text-on-surface-variant";
      case "تم التوصيل": case "مكتمل": return "bg-success-container text-success";
      case "ملغي": return "bg-error-container text-error";
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
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="بحث باسم العميل أو رقم الهاتف..."
              aria-label="بحث عن طلب"
              className="w-full bg-surface border border-outline-variant rounded-full py-3 pr-12 pl-10 text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} aria-label="مسح البحث"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-on-surface active:scale-[0.97] transition duration-150">
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            aria-label="تصفية حسب الحالة"
            className="bg-surface border border-outline-variant rounded-full px-4 py-3 text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <option value="">جميع الحالات</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="text-sm text-on-surface-variant flex items-center">{totalItems} طلب</div>
        </div>

        {!orders ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={48} className="text-outline-variant mb-4" />
            <h3 className="text-xl font-bold mb-2">{search || statusFilter ? "لا توجد طلبات مطابقة" : "لا توجد طلبات"}</h3>
            <p className="text-on-surface-variant">{search || statusFilter ? "حاول تغيير معايير البحث" : "لم يتم تقديم أي طلبات بعد"}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paged?.map((order, idx) => (
                <div key={order._id} className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)]"
                  style={{ animation: `fadeSlideUp 300ms ease-out forwards`, animationDelay: `${idx * 40}ms` }}>
                  <div tabIndex={0} role="button"
                    className="p-4 lg:p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none rounded-xl"
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(expandedId === order._id ? null : order._id); } }}
                  >
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                        {order.customerName[0]}
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold">{order.customerName}</h4>
                        <p className="text-xs text-on-surface-variant">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(order.status)}`}>{order.status}</span>
                      <span className="font-bold">{order.total} د.أ</span>
                      <span className="text-xs text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString("ar-JO")}</span>
                    </div>
                  </div>

                  <div className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ gridTemplateRows: expandedId === order._id ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <div className="px-4 lg:px-6 pb-6 border-t border-surface-container-highest pt-4">
                        <div className="mb-4">
                          <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">المنتجات</h5>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm flex-row-reverse gap-4">
                                <span className="break-words min-w-0">{item.productName} × {item.quantity}</span>
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
                            <p className="text-sm text-on-surface-variant break-words">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                          <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} aria-label="تغيير حالة الطلب"
                            className="border border-outline-variant rounded-full px-4 py-2 text-xs font-bold bg-transparent focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40">
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>

                          <a href={whatsappUrl(`السلام عليكم ${order.customerName}، بخصوص طلبك رقم ${order._id.slice(-6)} حالته: ${order.status}`)}
                            target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-xs font-bold hover:bg-surface-container-low active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150"><MessageCircle size={14} /> واتساب</a>

                        <button onClick={() => setDeleteTarget(order._id)}
                          className="px-4 py-2 rounded-full border border-error-container text-xs font-bold text-error hover:bg-error-container active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:outline-none transition duration-150">حذف</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination current={safePage} total={totalItems} pageSize={pageSize} onChange={setPage} />
          </>
        )}
        <Toast toast={toast} />
        <ConfirmDialog
          open={deleteTarget !== null}
          title="حذف الطلب"
          message="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
          confirmLabel="حذف"
          destructive
          onConfirm={() => { handleDelete(deleteTarget!); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AdminLayout>
  );
}
