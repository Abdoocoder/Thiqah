import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { Plus, Edit2, Trash2, CloudUpload, BadgePercent } from "lucide-react";
import { CardSkeleton } from "../components/Skeleton";
import { useState, useRef, useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const offerSchema = z.object({
  title: z.string().min(1, "مطلوب"),
  titleAr: z.string().min(1, "مطلوب"),
  description: z.string().min(1, "مطلوب"),
  descriptionAr: z.string().min(1, "مطلوب"),
  discount: z.number().min(1, "مطلوب").max(100, "أقصى خصم 100%"),
  expiryDate: z.string().min(1, "مطلوب"),
});

type OfferFormData = z.infer<typeof offerSchema>;

export default function Offers() {
  useEffect(() => { document.title = "العروض — الثقة"; }, []);

  const offers = useQuery(api.offers.list, {});
  const createOffer = useMutation(api.offers.create);
  const updateOffer = useMutation(api.offers.update);
  const removeOffer = useMutation(api.offers.remove);
  const generateUploadUrl = useMutation(api.offers.generateUploadUrl);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { showToast, toast } = useToast();

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: { title: "", titleAr: "", description: "", descriptionAr: "", discount: 0, expiryDate: "" },
  });

  function resetForm() {
    reset();
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
  }

  function editOffer(o: Doc<"offers">) {
    setValue("title", o.title);
    setValue("titleAr", o.titleAr);
    setValue("description", o.description);
    setValue("descriptionAr", o.descriptionAr);
    setValue("discount", o.discount);
    setValue("expiryDate", new Date(o.expiryDate).toISOString().slice(0, 16));
    setEditingId(o._id);
    setShowForm(true);
  }

  async function onSubmit(data: OfferFormData) {
    try {
      let imageStorageId = undefined;
      if (selectedFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": selectedFile.type }, body: selectedFile });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      const expiryDate = new Date(data.expiryDate).getTime();
      if (editingId) {
        await updateOffer({ id: editingId as Id<"offers">, ...data, expiryDate, imageStorageId: imageStorageId as Id<"_storage"> | undefined });
      } else {
        await createOffer({ ...data, expiryDate, imageStorageId: imageStorageId as Id<"_storage"> | undefined });
      }
      showToast(editingId ? "تم تحديث العرض" : "تم إضافة العرض");
      resetForm();
    } catch (err) {
      showToast("فشل الحفظ", "error");
      console.error("Failed to save offer", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeOffer({ id: id as Id<"offers"> });
      showToast("تم حذف العرض", "info");
    } catch (err) {
      showToast("فشل الحذف", "error");
      console.error("Failed to delete offer", err);
    }
  }

  const isExpired = (date: number) => Date.now() > date;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">إدارة العروض</h2>
            <p className="text-on-surface-variant">إضافة وتعديل العروض الموسمية</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-inverse-surface text-on-inverse px-6 py-3 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:bg-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150">
            <Plus size={16} /> إضافة عرض
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {showForm && (
            <div className="xl:col-span-1 bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-surface-container-highest h-fit sticky top-28">
              <h3 className="text-xl font-bold mb-6">{editingId ? "تعديل عرض" : "عرض جديد"}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <label tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
                  className="aspect-video bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none">
                  {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="معاينة الصورة" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <><CloudUpload size={40} className="text-outline-variant mb-4 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-outline-variant uppercase tracking-wider group-hover:text-primary transition-colors text-center px-4">صورة العرض</span></>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </label>

                <InputField label="العنوان (عربي)" error={errors.titleAr?.message} {...register("titleAr")} />
                <InputField label="العنوان (إنجليزي)" error={errors.title?.message} {...register("title")} />
                <InputField label="الوصف (عربي)" error={errors.descriptionAr?.message} {...register("descriptionAr")} />
                <InputField label="الوصف (إنجليزي)" error={errors.description?.message} {...register("description")} />
                <InputField label="نسبة الخصم (%)" type="number" error={errors.discount?.message} {...register("discount", { valueAsNumber: true })} />
                <InputField label="تاريخ الانتهاء" type="datetime-local" error={errors.expiryDate?.message} {...register("expiryDate")} />

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 bg-inverse-surface text-on-inverse py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 disabled:opacity-50 disabled:active:scale-100">
                    {isSubmitting ? "جاري الحفظ..." : editingId ? "حفظ التغييرات" : "إضافة العرض"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-6 py-4 rounded-full border border-outline text-xs font-bold uppercase tracking-widest hover:bg-surface-variant active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150">إلغاء</button>
                </div>
              </form>
            </div>
          )}

          <div className={`${showForm ? "xl:col-span-2" : "xl:col-span-3"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {!offers ? (
              Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            ) : offers.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <BadgePercent size={48} className="text-outline-variant mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد عروض</h3>
                <p className="text-on-surface-variant mb-6">لم تُضف أي عروض بعد. أنشئ عرضاً لتنشيط المبيعات</p>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                  className="bg-inverse-surface text-on-inverse px-6 py-3 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:bg-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150">
                  <Plus size={16} /> إضافة عرض
                </button>
              </div>
            ) : (
              offers.map((offer, idx) => (
                <div key={offer._id} className={`animate-fade-in bg-surface rounded-2xl overflow-hidden border shadow-card hover:shadow-card-lift hover:-translate-y-0.5 transition-all duration-300 ease-out ${isExpired(offer.expiryDate) ? "opacity-50" : ""}`} style={{ animationDelay: `${idx * 40}ms` }}>
                  {offer.imageUrl && (
                    <div className="aspect-video bg-surface-container-low overflow-hidden">
                      <div className="relative">
                        <img src={offer.imageUrl} alt={offer.titleAr} className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  )}
                  <div className="p-6 text-right">
                    <div className="flex justify-between items-center mb-3 flex-row-reverse">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">خصم {offer.discount}%</span>
                      <span className="text-xs text-on-surface-variant">{isExpired(offer.expiryDate) ? "منتهي" : new Date(offer.expiryDate).toLocaleDateString("ar-JO")}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{offer.titleAr}</h4>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{offer.descriptionAr}</p>
                    <div className="flex gap-2">
                      <button onClick={() => editOffer(offer)} aria-label="تعديل العرض" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-outline text-sm font-bold hover:bg-surface-variant active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150"><Edit2 size={14} /> تعديل</button>
                      <button onClick={() => setDeleteTarget(offer._id)} aria-label="حذف العرض" className="flex items-center gap-2 px-4 py-3 rounded-full border border-error-container text-sm font-bold text-error hover:bg-error-container active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:outline-none transition duration-150"><Trash2 size={14} /> حذف</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Toast toast={toast} />
        <ConfirmDialog
          open={deleteTarget !== null}
          title="حذف العرض"
          message="هل أنت متأكد من حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء."
          confirmLabel="حذف"
          destructive
          onConfirm={() => { handleDelete(deleteTarget!); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AdminLayout>
  );
}

function InputField({ label, error, id, ...reg }: { label: string; error?: string; id?: string } & Record<string, unknown>) {
  const inputId = useId();
  return (
    <div className="text-right">
      <label htmlFor={id || inputId} className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</label>
      <input id={id || inputId} {...reg} className="block w-full bg-surface-container-low/50 border-b-2 border-on-surface-variant/30 py-3.5 text-lg focus:outline-none focus:border-primary focus-visible:ring-0 transition-all duration-200 text-right rounded-none px-1" />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
