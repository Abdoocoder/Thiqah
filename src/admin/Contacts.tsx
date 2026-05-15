import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { MessageCircle, Trash2, Search, X, Inbox } from "lucide-react";
import { ContactSkeleton } from "../components/Skeleton";
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
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="بحث بالاسم أو البريد أو الرسالة..."
              aria-label="بحث في الرسائل"
              className="w-full bg-surface border border-outline-variant rounded-full py-3 pr-12 pl-10 text-sm focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors" />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} aria-label="مسح البحث"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-[0.97] transition duration-150">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="text-sm text-on-surface-variant flex items-center">{totalItems} رسالة</div>
        </div>

        {!contacts ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <ContactSkeleton key={i} />)}
          </div>
        ) : totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Inbox size={48} className="text-outline-variant mb-4" />
            <h3 className="text-xl font-bold mb-2">{search ? "لا توجد رسائل مطابقة" : "صندوق الوارد فارغ"}</h3>
            <p className="text-on-surface-variant">{search ? "حاول تغيير كلمات البحث" : "لم يستلم المتجر أي رسائل بعد"}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paged?.map((contact, idx) => (
                <div key={contact._id}
                  className={`bg-surface rounded-xl border border-surface-container-highest overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.04)] transition-shadow duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${!contact.read ? "ring-1 ring-primary" : ""}`}
                  style={{ animation: `fadeSlideUp 300ms ease-out forwards`, animationDelay: `${idx * 40}ms` }}
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
                            <p className="text-xs text-on-surface-variant truncate">{contact.email} · {contact.phone}</p>
                          </div>
                          <span className="text-xs text-on-surface-variant">{new Date(contact.createdAt).toLocaleDateString("ar-JO")}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed mb-4 break-words">{contact.message}</p>
                        <div className="flex gap-3">
                          <a href={whatsappUrl(`السلام عليكم ${contact.name}، وصلتنا رسالتك: ${contact.message}`)}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-whatsapp/10 text-whatsapp text-xs font-bold hover:bg-whatsapp/20 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-whatsapp/40 focus-visible:outline-none transition duration-150">
                            <MessageCircle size={14} /> رد عبر واتساب
                          </a>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-error-container text-xs font-bold text-error hover:bg-error-container active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:outline-none transition duration-150">
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
