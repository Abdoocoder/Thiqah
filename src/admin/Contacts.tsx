import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { MessageCircle, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { whatsappUrl } from "../lib/whatsapp";
import Pagination from "../components/Pagination";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

export default function Contacts() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const contacts = useQuery(api.contacts.list, { search: search || undefined });
  const markRead = useMutation(api.contacts.markRead);
  const removeContact = useMutation(api.contacts.remove);
  const { showToast, toast } = useToast();

  const totalItems = contacts?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = contacts?.slice((safePage - 1) * pageSize, safePage * pageSize);
  const unreadCount = contacts?.filter((c) => !c.read).length || 0;

  async function handleMarkRead(id: string) {
    await markRead({ id: id as Id<"contacts"> });
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await removeContact({ id: id as Id<"contacts"> });
      showToast("تم حذف الرسالة", "info");
    } catch (err) {
      showToast("فشل الحذف", "error");
      console.error(err);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">رسائل العملاء</h2>
            <p className="text-on-surface-variant">
              {unreadCount > 0 ? `${unreadCount} رسالة غير مقروءة` : "جميع الرسائل مقروءة"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="بحث بالاسم أو البريد أو الرسالة..."
              className="w-full bg-surface border border-outline-variant rounded-full py-3 pr-12 pl-6 text-sm focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="text-sm text-on-surface-variant flex items-center">{totalItems} رسالة</div>
        </div>

        {!contacts ? (
          <div className="p-12 text-center text-on-surface-variant animate-pulse">جاري التحميل...</div>
        ) : totalItems === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">لا توجد رسائل مطابقة</div>
        ) : (
          <>
            <div className="space-y-4">
              {paged?.map((contact) => (
                <div key={contact._id}
                  className={`bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-sm transition-all ${!contact.read ? "ring-1 ring-primary" : ""}`}
                  onClick={() => !contact.read && handleMarkRead(contact._id)}
                  onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !contact.read) { e.preventDefault(); handleMarkRead(contact._id); } }}
                  tabIndex={contact.read ? -1 : 0} role="button">
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start gap-4 flex-row-reverse">
                      <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shrink-0">
                        {contact.name[0]}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex justify-between items-center flex-row-reverse mb-2">
                          <div>
                            <h4 className="font-bold">{contact.name}</h4>
                            <p className="text-[10px] text-on-surface-variant">{contact.email} · {contact.phone}</p>
                          </div>
                          <span className="text-[10px] text-on-surface-variant">{new Date(contact.createdAt).toLocaleDateString("ar-JO")}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{contact.message}</p>
                        <div className="flex gap-3">
                          <a href={whatsappUrl(`السلام عليكم ${contact.name}، وصلتنا رسالتك: ${contact.message}`)}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 text-[#25D366] text-[10px] font-bold hover:bg-[#25D366]/20 transition-colors">
                            <MessageCircle size={14} /> رد عبر واتساب
                          </a>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={14} /> حذف
                          </button>
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
      </div>
    </AdminLayout>
  );
}
