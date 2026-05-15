import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "أحمد عبدالله",
    text: "زيت الزيتون عندهم ممتاز، طعم ونكهة لا تُضاهى. صراحة أحسن زيت ذقته. التوصيل كان سريع والتغليف ممتاز.",
    location: "مأدبا",
  },
  {
    name: "سارة محمود",
    text: "الجبنة البلدية طعمها ولا غلطة. ذكرتني بأيام زمان. أولادي صاروا يطلبونها كل أسبوع. سعرها معقول جداً.",
    location: "عمان",
  },
  {
    name: "د. خالد النجار",
    text: "أشتري منهم منذ سنة، والمنتجات ثابتة الجودة. السمن البلدي أصلي ١٠٠٪. أنصح الجميع بتجربة منتجاتهم.",
    location: "الزرقاء",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.from(card.querySelectorAll(".testimonial-text"), {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 px-6 bg-black text-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto w-full text-right">
        <div className="mb-16">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">
            آراء العملاء
          </span>
          <h3 className="text-3xl md:text-5xl font-bold leading-tight">
            ماذا يقول عنا عملاؤنا
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="relative"
            >
              <div className="text-6xl text-primary/20 leading-none mb-4 font-serif">
                "
              </div>
              <p className="testimonial-text text-base md:text-lg leading-relaxed opacity-80 mb-8">
                {t.text}
              </p>
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {t.name[0]}
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
