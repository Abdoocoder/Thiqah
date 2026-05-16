import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MessageCircle } from "lucide-react";
import { openWhatsapp, orderMessage } from "../lib/whatsapp";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current && sectionRef.current) {
        gsap.to(bgRef.current, {
          y: "15%",
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".hero-word");
        gsap.from(words, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.2,
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.8,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = "الأصالة من قلب مأدبا".split(" ").map((word, i) => (
    <span key={i} className="hero-word">
      {word}
    </span>
  ));

  return (
    <section id="hero" ref={sectionRef} className="relative h-dvh flex items-center justify-center overflow-hidden scroll-mt-20">
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDD4gG2wh2XMtpm3HCp4xDtZeL7avCF1ArxfOndRIE8zgDXRlNIlV4qAjkm87uu9QVnex3s1W_EpVYSezGaGOunbvKe9Ohxjrb-eYkBeUi3ShBCq54z1E2lZ0kL58_72-K3nBMFeJz3-3e6HPxlemF6zqbLHudgU97Aj2IEICJl75Hh08LgN9LdURa6aHsRJ1lcu0ha6JN1PKIwmCfpQDHDanphtu1U07c-nXpmfhHg3iGmUVgON3DLwM3nZ27SE9lkOjM5RRKJXKTG')`,
        }}
      >
        <div className="absolute inset-0 bg-inverse-surface/40" />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-on-inverse mb-8 tracking-tight flex flex-wrap justify-center gap-x-4"
        >
          {words}
        </h1>
        <div ref={ctaRef}>
          <button
            onClick={() => openWhatsapp(orderMessage("منتجات الثقة"))}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-colors duration-300 font-semibold tracking-wider uppercase text-xs bg-inverse-surface text-on-inverse hover:bg-primary"
          >
            <MessageCircle size={20} />
            اطلب الآن عبر واتساب
          </button>
        </div>
      </div>
    </section>
  );
}
