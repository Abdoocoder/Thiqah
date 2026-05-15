const PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "962779248914";

export function whatsappUrl(text: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}

export function orderMessage(productName: string) {
  return `السلام عليكم، أرغب في طلب ${productName} من متجر الثقة.`;
}

export function generalInquiry() {
  return "السلام عليكم، لدي استفسار عن منتجات متجر الثقة.";
}

export function openWhatsapp(text: string) {
  window.open(whatsappUrl(text), "_blank");
}
