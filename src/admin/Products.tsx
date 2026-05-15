import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { Plus, Edit2, Trash2, CloudUpload } from "lucide-react";
import { useState, useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";

const productSchema = z.object({
  name: z.string().min(1, "مطلوب"),
  nameAr: z.string().min(1, "مطلوب"),
  category: z.string().min(1, "مطلوب"),
  categoryAr: z.string().min(1, "مطلوب"),
  price: z.number().min(0.01, "السعر مطلوب"),
  description: z.string().min(1, "مطلوب"),
  descriptionAr: z.string().min(1, "مطلوب"),
  stock: z.number().min(0, "غير صالح"),
  unit: z.string().min(1, "مطلوب"),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  { en: "زيت زيتون", ar: "زيت زيتون" },
  { en: "أجبان", ar: "أجبان" },
  { en: "سمن بلدي", ar: "سمن بلدي" },
];

export default function Products() {
  const products = useQuery(api.products.list, {});
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { showToast, toast } = useToast();

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", nameAr: "", category: "زيت زيتون", categoryAr: "زيت زيتون", price: 0, description: "", descriptionAr: "", stock: 0, unit: "كغم" },
  });

  function resetForm() {
    reset();
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
  }

  function editProduct(p: Doc<"products">) {
    setValue("name", p.name);
    setValue("nameAr", p.nameAr);
    setValue("category", p.category);
    setValue("categoryAr", p.categoryAr);
    setValue("price", p.price);
    setValue("description", p.description);
    setValue("descriptionAr", p.descriptionAr);
    setValue("stock", p.stock);
    setValue("unit", p.unit);
    setEditingId(p._id);
    setShowForm(true);
  }

  async function onSubmit(data: ProductFormData) {
    try {
      let imageStorageId = undefined;
      if (selectedFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": selectedFile.type }, body: selectedFile });
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      if (editingId) {
        await updateProduct({ id: editingId as Id<"products">, ...data, imageStorageId: imageStorageId as Id<"_storage"> | undefined });
      } else {
        await createProduct({ ...data, imageStorageId: imageStorageId as Id<"_storage"> | undefined });
      }
      showToast(editingId ? "تم تحديث المنتج" : "تم إضافة المنتج");
      resetForm();
    } catch (err) {
      showToast("فشل الحفظ", "error");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await removeProduct({ id: id as Id<"products"> });
      showToast("تم حذف المنتج", "info");
    } catch (err) {
      showToast("فشل الحذف", "error");
      console.error(err);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">إدارة المنتجات</h2>
            <p className="text-on-surface-variant">إضافة وتعديل المنتجات المتاحة</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-primary transition-all">
            <Plus size={16} /> إضافة منتج
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {showForm && (
            <div className="xl:col-span-1 bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-surface-container-highest h-fit sticky top-28">
              <h3 className="text-xl font-bold mb-6">{editingId ? "تعديل منتج" : "منتج جديد"}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div onClick={() => fileRef.current?.click()}
                  className="aspect-square bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors group">
                  {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <><CloudUpload size={40} className="text-outline-variant mb-4 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-bold text-outline-variant uppercase tracking-wider group-hover:text-primary transition-colors text-center px-4">اسحب الصورة هنا أو اضغط للرفع</span></>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />

                <InputField label="الاسم (عربي)" error={errors.nameAr?.message} {...register("nameAr")} />
                <InputField label="الاسم (إنجليزي)" error={errors.name?.message} {...register("name")} />

                <SelectField label="التصنيف" error={errors.category?.message}
                  {...register("category", { onChange: (e) => { const cat = categories.find((c) => c.en === e.target.value); if (cat) setValue("categoryAr", cat.ar); } })}>
                  {categories.map((c) => <option key={c.en} value={c.en}>{c.en}</option>)}
                </SelectField>

                <InputField label="السعر (د.أ)" type="number" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
                <InputField label="المخزون" type="number" error={errors.stock?.message} {...register("stock", { valueAsNumber: true })} />
                <InputField label="الوحدة" error={errors.unit?.message} {...register("unit")} />
                <TextField label="الوصف (عربي)" error={errors.descriptionAr?.message} {...register("descriptionAr")} />
                <TextField label="الوصف (إنجليزي)" error={errors.description?.message} {...register("description")} />

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 bg-black text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50">
                    {isSubmitting ? "جاري الحفظ..." : editingId ? "حفظ التغييرات" : "إضافة المنتج"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-6 py-4 rounded-full border border-outline text-[10px] font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors">إلغاء</button>
                </div>
              </form>
            </div>
          )}

          <div className={`${showForm ? "xl:col-span-2" : "xl:col-span-3"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {!products ? (
              <div className="col-span-full p-12 text-center text-on-surface-variant animate-pulse">جاري التحميل...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full p-12 text-center text-on-surface-variant">لا توجد منتجات بعد. أضف منتجك الأول!</div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="bg-surface rounded-2xl overflow-hidden border border-surface-container-highest group shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-[4/3] bg-surface-container-low">
                    <img src={product.imageUrl || "/placeholder.svg"} alt={product.nameAr}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => editProduct(product)}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface hover:text-primary transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(product._id)}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-error hover:bg-error-container transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6 text-right">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{product.categoryAr}</span>
                    <h4 className="text-base lg:text-lg font-bold truncate">{product.nameAr}</h4>
                    <div className="flex justify-between items-center mt-4 flex-row-reverse">
                      <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold">متوفر: {product.stock} {product.unit}</span>
                      <span className="text-lg font-bold text-primary">{product.price} د.أ</span>
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

function SelectField({ label, error, children, ...reg }: { label: string; error?: string; children: ReactNode } & Record<string, unknown>) {
  return (
    <div className="relative pt-4 text-right">
      <label className="absolute top-0 right-0 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
      <select {...reg} className="w-full bg-transparent border-b border-on-surface-variant py-3 text-lg focus:outline-none appearance-none cursor-pointer text-right">{children}</select>
      {error && <p className="text-[10px] text-error mt-1">{error}</p>}
    </div>
  );
}

function TextField({ label, error, ...reg }: { label: string; error?: string } & Record<string, unknown>) {
  return (
    <div className="relative pt-4 text-right">
      <label className="absolute top-0 right-0 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
      <textarea {...reg} className="w-full bg-transparent border-b border-on-surface-variant py-3 text-sm focus:outline-none resize-none h-24 text-right" />
      {error && <p className="text-[10px] text-error mt-1">{error}</p>}
    </div>
  );
}
