import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Send, MessageCircle } from "lucide-react";
import { openWhatsapp, generalInquiry, whatsappUrl } from "../lib/whatsapp";

const contactSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(7, "رقم الهاتف غير صحيح"),
  message: z.string().min(5, "الرسالة قصيرة جداً"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const createContact = useMutation(api.contacts.create);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setSending(true);
    setServerError("");
    try {
      await createContact(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError("فشل الإرسال. حاول مرة أخرى.");
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center p-12 bg-surface-container-low rounded-2xl border border-surface-container-highest">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h4 className="text-xl font-bold mb-2">شكراً لتواصلك!</h4>
        <p className="text-on-surface-variant mb-6">سنرد عليك في أقرب وقت ممكن.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto w-full scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h3 className="text-3xl font-bold mb-4">تواصل معنا</h3>
        <p className="text-on-surface-variant">نحن هنا للإجابة على استفساراتك</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-6">
        <div className="text-right">
          <input
            type="text"
            placeholder="الاسم الكامل"
            aria-label="الاسم الكامل"
            {...register("name")}
            className="w-full bg-surface border border-surface-container-highest rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-right"
          />
          {errors.name && (
            <p className="text-error text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="text-right">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            aria-label="البريد الإلكتروني"
            {...register("email")}
            className="w-full bg-surface border border-surface-container-highest rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-right"
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="text-right">
          <input
            type="tel"
            placeholder="رقم الهاتف"
            aria-label="رقم الهاتف"
            {...register("phone")}
            className="w-full bg-surface border border-surface-container-highest rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors text-right"
          />
          {errors.phone && (
            <p className="text-error text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="text-right">
          <textarea
            rows={4}
            placeholder="رسالتك..."
            aria-label="رسالتك"
            {...register("message")}
            className="w-full bg-surface border border-surface-container-highest rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none text-right"
          />
          {errors.message && (
            <p className="text-error text-xs mt-1">{errors.message.message}</p>
          )}
        </div>

        {serverError && (
          <div className="text-error text-sm text-center bg-error-container/20 rounded-xl px-4 py-3">
            {serverError}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={sending}
            className="flex-1 bg-inverse-surface text-on-inverse px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {sending ? "جاري الإرسال..." : "إرسال"}
          </button>
          <a
            href={whatsappUrl(generalInquiry())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-full border border-outline text-xs font-bold tracking-widest hover:bg-surface-container-low transition-colors"
          >
            <MessageCircle size={16} className="text-whatsapp" />
            واتساب
          </a>
        </div>
      </form>
    </section>
  );
}
