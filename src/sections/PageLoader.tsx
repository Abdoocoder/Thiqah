import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

// Floating particle configs
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 6,
  drift: (Math.random() - 0.5) * 60,
}));

// SVG progress arc
const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PageLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const portalRef      = useRef<HTMLDivElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);
  const logoWrapRef    = useRef<HTMLDivElement>(null);
  const logoRef        = useRef<HTMLImageElement>(null);
  const arcRef         = useRef<SVGCircleElement>(null);
  const titleWrapRef   = useRef<HTMLDivElement>(null);
  const titleRef       = useRef<HTMLHeadingElement>(null);
  const shineRef       = useRef<HTMLSpanElement>(null);
  const subtitleRef    = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible]     = useState(true);
  const [progress, setProgress]   = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      /* ── initial states ── */
      gsap.set(portalRef.current,   { scale: 0, opacity: 0 });
      gsap.set(glowRef.current,     { scale: 0.4, opacity: 0 });
      gsap.set(logoWrapRef.current, { scale: 0.6, opacity: 0, y: 10 });
      gsap.set(titleWrapRef.current,{ y: 36, opacity: 0 });
      gsap.set(shineRef.current,    { x: "-110%" });
      gsap.set(subtitleRef.current, { y: 16, opacity: 0 });
      if (arcRef.current) arcRef.current.style.strokeDashoffset = String(CIRCUMFERENCE);

      /* ── progress counter ── */
      const prog = { val: 0 };
      gsap.to(prog, {
        val: 100,
        duration: 3.8,
        ease: "power1.inOut",
        onUpdate: () => setProgress(Math.round(prog.val)),
      });

      /* ── SVG arc ── */
      gsap.to(arcRef.current, {
        strokeDashoffset: 0,
        duration: 3.8,
        ease: "power1.inOut",
      });

      /* ── Glow pulse (independent — must NOT be in main tl) ── */
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.35,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });

      /* ── main timeline ── */
      const tl = gsap.timeline({
        onComplete: () => { setVisible(false); onComplete(); },
      });

      // 1. Portal light blooms
      tl.to(portalRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: "expo.out",
      })
      // 2. Central glow pulses open
      .to(glowRef.current, {
        scale: 1.2,
        opacity: 0.55,
        duration: 1,
        ease: "power3.out",
      }, "-=1.0")
      // 3. Logo materializes
      .to(logoWrapRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
      }, "-=0.7")
      // 4. Glow settles softly (one-shot, NOT repeat)
      // 5. Title slides up from behind overflow mask
      .to(titleWrapRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
      }, "-=0.8")
      // 6. Golden shimmer sweeps across the text
      .to(shineRef.current, {
        x: "200%",
        duration: 1.1,
        ease: "power2.inOut",
      }, "-=0.5")
      // 7. Tagline fades in with letter-spacing expansion
      .to(subtitleRef.current, {
        y: 0,
        opacity: 0.6,
        duration: 1,
        letterSpacing: "0.45em",
        ease: "power2.out",
      }, "-=0.5")

      // Hold...
      // ── EXIT ──
      // 8. Blur & fade all content inward
      .to(
        [logoWrapRef.current, titleWrapRef.current, subtitleRef.current, portalRef.current],
        {
          opacity: 0,
          scale: 0.85,
          filter: "blur(12px)",
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.in",
        },
        "+=1.4"
      )
      // 9. Container slides up with easing
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "expo.inOut",
      }, "-=0.35");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "radial-gradient(circle at 50% 50%, #1c2118 0%, #090c08 100%)" }}
    >
      {/* ── Floating Particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `rgba(208, 235, 161, ${Math.random() * 0.25 + 0.05})`,
            animationName: "float-up",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}

      {/* ── Background Portal Light ── */}
      <div
        ref={portalRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, rgba(208,235,161,0.08) 0%, rgba(143,185,70,0.04) 40%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Central Glow (behind logo) ── */}
      <div
        ref={glowRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle, rgba(208,235,161,0.45) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* ── Logo + SVG Progress Arc ── */}
      <div ref={logoWrapRef} className="relative flex items-center justify-center mb-10 z-10">
        {/* Circular progress SVG */}
        <svg
          className="absolute"
          width="180"
          height="180"
          viewBox="0 0 180 180"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track ring */}
          <circle
            cx="90" cy="90" r={RADIUS}
            fill="none"
            stroke="rgba(208,235,161,0.08)"
            strokeWidth="1.5"
          />
          {/* Progress arc */}
          <circle
            ref={arcRef}
            cx="90" cy="90" r={RADIUS}
            fill="none"
            stroke="rgba(208,235,161,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: CIRCUMFERENCE,
            }}
          />
          {/* Inner dashed orbit */}
          <circle
            cx="90" cy="90" r={RADIUS - 10}
            fill="none"
            stroke="rgba(208,235,161,0.04)"
            strokeWidth="1"
            strokeDasharray="3 8"
          />
        </svg>

        {/* Progress number */}
        <span
          className="absolute bottom-[-2rem] text-[10px] font-mono tracking-widest"
          style={{ color: "rgba(208,235,161,0.35)" }}
        >
          {String(progress).padStart(3, "0")}
        </span>

        {/* Logo image */}
        <img
          ref={logoRef}
          src="/logo.png"
          alt="الثقة"
          className="w-20 h-20 md:w-24 md:h-24 object-contain relative z-10"
          style={{ filter: "drop-shadow(0 0 18px rgba(208,235,161,0.3))" }}
        />
      </div>

      {/* ── Brand Name ── */}
      <div className="overflow-hidden mt-4 z-10">
        <div ref={titleWrapRef} className="relative">
          {/* Shimmer overlay (sweeps L→R, text stays intact) */}
          <span
            ref={shineRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 20%, rgba(255,255,220,0.65) 50%, transparent 80%)",
              mixBlendMode: "screen",
              zIndex: 2,
              width: "100%",
            }}
          />
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold relative z-1"
            style={{
              color: "#e8e4d8",
              direction: "rtl",
              textShadow: "0 0 40px rgba(208,235,161,0.25)",
              letterSpacing: "-0.01em",
            }}
          >
            الثقة
          </h1>
        </div>
      </div>

      {/* ── Tagline ── */}
      <p
        ref={subtitleRef}
        className="mt-5 text-[11px] font-light tracking-[0.3em] z-10"
        style={{
          color: "rgba(208,235,161,0.6)",
          direction: "rtl",
          letterSpacing: "0.3em",
        }}
      >
        جودة وكفالة
      </p>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0px) scale(1); opacity: 0.15; }
          100% { transform: translateY(-40px) scale(1.4); opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
