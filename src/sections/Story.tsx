import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { scale: 1, y: 0 },
        {
          scale: 1.1,
          y: "-10%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      gsap.from(".story-content", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-black text-white flex items-center min-h-[600px] scroll-mt-20"
    >
      <div className="absolute inset-0 z-0">
        <div
          ref={bgRef}
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3AsgseHp2wEDUDjheQXbDAWwduJgwrMUVj17ujJEDlQ1MWQGpBDplVOsGv8ICscKxC8tT8VOkbRgEsrvDR8vmeH7N3eDK5ecl-zbXyc6WOqUrEvPl1dZD1I3IrkIONvNMpdDwRkOWz2lyYu73KuYSoCPk-dCzl1HOOY9_HwBbn94asz-3OFSezKA2VuPFZoAvvjTG4mr_PJDnzmv-LZsU6wfZzyBEMmt585mm16Pn3DdW7fX6KfFqftP8gMXRKA3xPjvUGu9a5OEv')`,
          }}
        />
      </div>
      <div className="relative z-10 px-6 max-w-7xl mx-auto w-full text-right">
        <div className="max-w-xl mr-0 story-content">
          <span className="text-xs font-bold text-primary uppercase tracking-widest mb-4 block">
            قصتنا
          </span>
          <h3 className="text-4xl font-light mb-6 leading-tight">
            من الأرض، بكل فخر وعناية.
          </h3>
          <p className="text-lg opacity-80 leading-relaxed mb-8">
            نحن نؤمن بأن الجودة الحقيقية تبدأ من التربة. في مزارعنا بمأدبا، نحافظ على
            التقاليد الزراعية القديمة ونمزجها بمعايير العصر الحديث لتقديم منتجات بلدية
            ترقى لتوقعاتكم.
          </p>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white text-white text-xs font-bold tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300">
            اكتشف المزيد
          </button>
        </div>
      </div>
    </section>
  );
}
