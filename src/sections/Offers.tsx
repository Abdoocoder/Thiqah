import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { openWhatsapp, orderMessage } from "../lib/whatsapp";
import { MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function CountdownTimer({ expiryDate }: { expiryDate: number }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const diff = expiryDate - now;
      if (diff <= 0) {
        setTimeLeft("انتهى العرض");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <span className="font-mono text-lg tracking-wider tabular-nums">
      {timeLeft}
    </span>
  );
}

export default function Offers() {
  const offers = useQuery(api.offers.list, { activeOnly: true });
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [offers]);

  const active = offers?.filter((o) => Date.now() < o.expiryDate) || [];

  return (
    <section id="offers" ref={sectionRef} className="py-24 px-6 bg-surface-container-low scroll-mt-20">
      <div className="max-w-7xl mx-auto w-full text-right">
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-4">العروض الموسمية</h3>
          <p className="text-on-surface-variant max-w-2xl">
            عروض حصرية لفترة محدودة. لا تفوّت الفرصة!
          </p>
        </div>

        {!offers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : active.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">لا توجد عروض حالياً. تابعونا قريباً!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {active.map((offer, i) => (
              <div
                key={offer._id}
                ref={(el) => { if (el) cardsRef.current[i] = el; }}
                className="bg-surface rounded-2xl border border-surface-container-highest p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-6 flex-row-reverse">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    خصم {offer.discount}%
                  </span>
                  <CountdownTimer expiryDate={offer.expiryDate} />
                </div>
                <h4 className="text-xl font-bold mb-3">{offer.titleAr}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {offer.descriptionAr}
                </p>
                <button
                  onClick={() => openWhatsapp(orderMessage(offer.titleAr))}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary transition-colors"
                >
                  <MessageCircle size={16} />
                  اطلب العرض
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
