import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { openWhatsapp, orderMessage } from "../lib/whatsapp";

interface ProductCardProps {
  image: string;
  category: string;
  title: string;
}

export default function ProductCard({ image, category, title }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group flex flex-col gap-4 cursor-pointer text-right"
      onClick={() => openWhatsapp(orderMessage(title))}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openWhatsapp(orderMessage(title)); } }}
      role="button" tabIndex={0}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-container">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-col gap-1 p-2">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{category}</span>
        <h4 className="text-lg font-medium">{title}</h4>
        <div className="flex items-center gap-2 text-primary mt-2 justify-start">
          <ShoppingCart size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">طلب عبر واتساب</span>
        </div>
      </div>
    </motion.div>
  );
}
