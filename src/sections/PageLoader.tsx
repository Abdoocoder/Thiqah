import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function PageLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.from(textRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
      .from(barRef.current, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.8,
        ease: "power2.inOut",
      })
      .to(barRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        containerRef.current,
        {
          y: "-100%",
          duration: 0.8,
          ease: "power3.inOut",
        },
        "+=0.1"
      );

    return () => tl.kill();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-inverse-surface flex flex-col items-center justify-center"
      >
        <div ref={textRef} className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="الثقة" className="w-20 h-20 md:w-28 md:h-28" />
          <h1 className="text-4xl md:text-6xl font-bold text-on-inverse tracking-tight">
            الثقة
          </h1>
        </div>
      <p className="text-on-inverse/40 text-sm mt-4 tracking-widest uppercase text-[10px]">
        جودة وكفالة
      </p>
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary origin-right"
      />
    </div>
  );
}
