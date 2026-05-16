import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import AdminLayout from "./AdminLayout";
import { Plus, Edit2, Trash2, CloudUpload, Package, PackagePlus } from "lucide-react";
import { CardSkeleton } from "../components/Skeleton";
import { useState, useRef, useId, useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../components/useToast";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

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
  useEffect(() => { document.title = "المنتجات — الثقة"; }, []);

  const products = useQuery(api.products.list, {});
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
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
      console.error("Failed to save product", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeProduct({ id: id as Id<"products"> });
      showToast("تم حذف المنتج", "info");
    } catch (err) {
      showToast("فشل الحذف", "error");
      console.error("Failed to delete product", err);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 text-right">
        <div className="flex justify-between items-end flex-row-reverse">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">إدارة المنتجات</h2>
            <p className="text-on-surface-variant">إضافة وتعديل المنتجات المتاحة</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-inverse-surface text-on-inverse px-6 py-3.5 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150">
            <Plus size={16} /> إضافة منتج
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {showForm && (
            <div className="xl:col-span-1 bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-surface-container-highest h-fit sticky top-28">
              <h3 className="text-xl font-bold mb-6">{editingId ? "تعديل منتج" : "منتج جديد"}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <label tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
                  className="aspect-video bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none">
                  {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="معاينة الصورة" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <><CloudUpload size={40} className="text-on-surface-variant mb-4 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors text-center px-4">اسحب الصورة هنا أو اضغط للرفع</span></>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </label>

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
                    className="flex-1 bg-inverse-surface text-on-inverse py-4 rounded-full text-sm font-bold hover:bg-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 disabled:opacity-50 disabled:active:scale-100">
                    {isSubmitting ? "جاري الحفظ..." : editingId ? "حفظ التغييرات" : "إضافة المنتج"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-6 py-4 rounded-full border border-outline text-sm font-bold hover:bg-surface-variant active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150">إلغاء</button>
                </div>
              </form>
            </div>
          )}

          <div className={`${showForm ? "xl:col-span-2" : "xl:col-span-3"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {!products ? (
              Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            ) : products.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <Package size={48} className="text-outline-variant mb-4" />
                <h3 className="text-xl font-bold mb-2">لا توجد منتجات</h3>
                <p className="text-on-surface-variant mb-6">المتجر فارغ. أضف منتجك الأول لتبدأ البيع</p>
                <button onClick={() => { resetForm(); setShowForm(true); }}
                  className="bg-inverse-surface text-on-inverse px-6 py-3.5 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-primary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150">
                  <PackagePlus size={16} /> إضافة منتج
                </button>
              </div>
            ) : (
              products.map((product, idx) => (
                <div key={product._id} className="animate-fade-in bg-surface rounded-2xl overflow-hidden border border-surface-container-highest group shadow-card hover:shadow-card-lift hover:-translate-y-0.5 transition-[transform,box-shadow] duration-300 ease-out" style={{ animationDelay: `${idx * 40}ms` }}>
                  <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
                    <img src={product.imageUrl || "/placeholder.svg"} alt={product.nameAr} loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 flex gap-2 translate-y-0 opacity-100 lg:translate-y-0 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-200">
                      <button onClick={() => editProduct(product)} aria-label="تعديل المنتج"
                        className="w-11 h-11 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-on-surface hover:text-primary active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150"><Edit2 size={16} /></button>
                      <button onClick={() => setDeleteTarget(product._id)} aria-label="حذف المنتج"
                        className="w-11 h-11 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center text-error hover:bg-error-container active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6 text-right">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{product.categoryAr}</span>
                    <h4 className="text-base lg:text-lg font-bold truncate">{product.nameAr}</h4>
                    <div className="flex justify-between items-center mt-4 flex-row-reverse">
                      <span className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-bold">متوفر: {product.stock} {product.unit}</span>
                      <span className="text-lg font-bold text-primary">{product.price} د.أ</span>
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
          title="حذف المنتج"
          message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
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
  const errorId = useId();
  const resolvedId = id || inputId;
  return (
    <div className="text-right">
      <label htmlFor={resolvedId} className="block text-xs font-bold text-on-surface-variant mb-2">{label}</label>
      <input id={resolvedId} {...reg}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="block w-full bg-surface-container-low/50 border-b-2 border-on-surface-variant/30 py-3.5 text-lg focus:outline-none focus:border-primary focus-visible:ring-0 transition-all duration-200 text-right rounded-none px-1" />
      {error && <p id={errorId} role="alert" className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ label, error, children, id, ...reg }: { label: string; error?: string; children: ReactNode; id?: string } & Record<string, unknown>) {
  const selectId = useId();
  const errorId = useId();
  const resolvedId = id || selectId;
  return (
    <div className="text-right">
      <label htmlFor={resolvedId} className="block text-xs font-bold text-on-surface-variant mb-2">{label}</label>
      <select id={resolvedId} {...reg}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="w-full bg-surface-container-low/50 border-b-2 border-on-surface-variant/30 py-3.5 text-lg focus:outline-none focus-visible:ring-0 transition-all duration-200 appearance-none cursor-pointer text-right rounded-none px-1">{children}</select>
      {error && <p id={errorId} role="alert" className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}

function TextField({ label, error, id, ...reg }: { label: string; error?: string; id?: string } & Record<string, unknown>) {
  const textareaId = useId();
  const errorId = useId();
  const resolvedId = id || textareaId;
  return (
    <div className="text-right">
      <label htmlFor={resolvedId} className="block text-xs font-bold text-on-surface-variant mb-2">{label}</label>
      <textarea id={resolvedId} {...reg}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className="w-full bg-surface-container-low/50 border-b-2 border-on-surface-variant/30 py-3 text-sm focus:outline-none focus-visible:ring-0 transition-all duration-200 resize-none h-24 text-right rounded-none px-1" />
      {error && <p id={errorId} role="alert" className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
