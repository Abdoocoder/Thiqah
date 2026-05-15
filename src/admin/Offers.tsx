import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { Plus, Edit2, Trash2, CloudUpload } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

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
  const offers = useQuery(api.offers.list, {});
  const createOffer = useMutation(api.offers.create);
  const updateOffer = useMutation(api.offers.update);
  const removeOffer = useMutation(api.offers.remove);
  const generateUploadUrl = useMutation(api.offers.generateUploadUrl);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;
    try {
      await removeOffer({ id: id as Id<"offers"> });
      showToast("تم حذف العرض", "info");
    } catch (err) {
      showToast("فشل الحذف", "error");
      console.error(err);
    }
  }

  const isExpired = (date: number) => Date.now() > date;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">إدارة العروض</h2>
            <p className="text-on-surface-variant">إضافة وتعديل العروض الموسمية</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-primary transition-all">
            <Plus size={16} /> إضافة عرض
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {showForm && (
            <div className="xl:col-span-1 bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-surface-container-highest h-fit sticky top-28">
              <h3 className="text-xl font-bold mb-6">{editingId ? "تعديل عرض" : "عرض جديد"}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div onClick={() => fileRef.current?.click()}
                  className="aspect-video bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors group">
                  {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <><CloudUpload size={40} className="text-outline-variant mb-4 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-bold text-outline-variant uppercase tracking-wider group-hover:text-primary transition-colors text-center px-4">صورة العرض</span></>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />

                <InputField label="العنوان (عربي)" error={errors.titleAr?.message} {...register("titleAr")} />
                <InputField label="العنوان (إنجليزي)" error={errors.title?.message} {...register("title")} />
                <InputField label="الوصف (عربي)" error={errors.descriptionAr?.message} {...register("descriptionAr")} />
                <InputField label="الوصف (إنجليزي)" error={errors.description?.message} {...register("description")} />
                <InputField label="نسبة الخصم (%)" type="number" error={errors.discount?.message} {...register("discount", { valueAsNumber: true })} />
                <InputField label="تاريخ الانتهاء" type="datetime-local" error={errors.expiryDate?.message} {...register("expiryDate")} />

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50">
                    {isSubmitting ? "جاري الحفظ..." : editingId ? "حفظ التغييرات" : "إضافة العرض"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-6 py-4 rounded-full border border-outline text-[10px] font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">إلغاء</button>
                </div>
              </form>
            </div>
          )}

          <div className={`${showForm ? "xl:col-span-2" : "xl:col-span-3"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {!offers ? (
              <div className="col-span-full p-12 text-center text-on-surface-variant animate-pulse">جاري التحميل...</div>
            ) : offers.length === 0 ? (
              <div className="col-span-full p-12 text-center text-on-surface-variant">لا توجد عروض بعد</div>
            ) : (
              offers.map((offer) => (
                <div key={offer._id} className={`bg-surface rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all ${isExpired(offer.expiryDate) ? "opacity-50" : ""}`}>
                  {offer.imageUrl && (
                    <div className="aspect-video bg-surface-container-low">
                      <img src={offer.imageUrl} alt={offer.titleAr} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 text-right">
                    <div className="flex justify-between items-center mb-3 flex-row-reverse">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">خصم {offer.discount}%</span>
                      <span className="text-[10px] text-on-surface-variant">{isExpired(offer.expiryDate) ? "منتهي" : new Date(offer.expiryDate).toLocaleDateString("ar-JO")}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{offer.titleAr}</h4>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{offer.descriptionAr}</p>
                    <div className="flex gap-2">
                      <button onClick={() => editOffer(offer)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-outline text-[10px] font-bold hover:bg-surface-variant transition-colors"><Edit2 size={14} /> تعديل</button>
                      <button onClick={() => handleDelete(offer._id)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /> حذف</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <Toast toast={toast} />
      </div>
    </AdminLayout>
  );
}

function InputField({ label, error, ...reg }: { label: string; error?: string } & Record<string, unknown>) {
  return (
    <div className="relative pt-4 text-right">
      <input {...reg} className="peer block w-full bg-transparent border-b border-on-surface-variant py-3 text-lg focus:outline-none focus:border-primary transition-colors text-right" />
      <label className="absolute right-0 top-0 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pointer-events-none">{label}</label>
      {error && <p className="text-[10px] text-error mt-1">{error}</p>}
    </div>
  );
}
