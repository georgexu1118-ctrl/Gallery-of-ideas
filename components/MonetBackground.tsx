"use client";

export default function MonetBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">

      {/* ── Layer 1: Sky gradient ─────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #030508 0%, #060d1a 28%, #120905 52%, #060508 100%)",
        }}
      />

      {/* ── Layer 2: Primary sunrise glow (diffuse) ───────────────────── */}
      <div
        className="absolute"
        style={{
          right: "18%",
          top: "32%",
          width: "580px",
          height: "300px",
          background:
            "radial-gradient(ellipse at center, rgba(185, 78, 18, 0.38) 0%, rgba(130, 44, 8, 0.18) 38%, rgba(70, 20, 4, 0.07) 65%, transparent 85%)",
          filter: "blur(35px)",
          animation: "monet-pulse 9s ease-in-out infinite",
        }}
      />

      {/* ── Layer 3: Secondary warm halo ────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          right: "14%",
          top: "28%",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse at 60% 55%, rgba(150, 55, 10, 0.14) 0%, rgba(80, 25, 4, 0.06) 50%, transparent 75%)",
          filter: "blur(60px)",
          animation: "monet-glow 14s ease-in-out infinite 2s",
        }}
      />

      {/* ── Layer 4: Sun disk (barely visible) ──────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          right: "26.5%",
          top: "40%",
          width: "48px",
          height: "48px",
          background:
            "radial-gradient(circle, rgba(230, 135, 45, 0.9) 0%, rgba(195, 82, 18, 0.5) 55%, transparent 100%)",
          filter: "blur(5px)",
          animation: "monet-glow 7s ease-in-out infinite 0.5s",
        }}
      />

      {/* ── Layer 5: Horizon atmospheric band ───────────────────────────── */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "48%",
          height: "90px",
          marginTop: "-45px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(140, 58, 12, 0.05) 15%, rgba(190, 82, 18, 0.14) 38%, rgba(215, 102, 28, 0.22) 60%, rgba(160, 62, 14, 0.1) 78%, transparent 100%)",
          filter: "blur(18px)",
          animation: "monet-drift 22s ease-in-out infinite",
        }}
      />

      {/* ── Layer 6: Left fog bank ───────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 10% 48%, rgba(12, 18, 32, 0.65) 0%, rgba(8, 12, 22, 0.3) 35%, transparent 58%)",
          animation: "monet-fog 28s ease-in-out infinite",
        }}
      />

      {/* ── Layer 7: Right fog bank ──────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 92% 44%, rgba(10, 15, 28, 0.55) 0%, rgba(6, 10, 18, 0.25) 32%, transparent 55%)",
          animation: "monet-fog 35s ease-in-out infinite reverse",
        }}
      />

      {/* ── Layer 8: Water zone (lower half darkening) ──────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "50%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(4, 5, 10, 0.65) 35%, #020306 100%)",
        }}
      />

      {/* ── Layer 9: Water ripple reflections ───────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{ height: "50%" }}
      >
        {/* Warm (sun reflection) ripples */}
        {[0, 1, 2].map((i) => (
          <div
            key={`warm-${i}`}
            className="absolute left-0 right-0"
            style={{
              bottom: `${14 + i * 9}%`,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, rgba(${195 - i * 18}, ${72 - i * 8}, ${16 - i * 4}, ${0.38 - i * 0.07}) 30%, rgba(${218 - i * 18}, ${100 - i * 8}, ${24 - i * 4}, ${0.55 - i * 0.08}) 55%, rgba(${195 - i * 18}, ${72 - i * 8}, ${16 - i * 4}, ${0.38 - i * 0.07}) 72%, transparent 100%)`,
              filter: "blur(0.6px)",
              animation: `monet-ripple ${5.5 + i * 1.8}s ease-in-out infinite ${i * 0.6}s`,
            }}
          />
        ))}
        {/* Cool (water ambient) ripples */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`cool-${i}`}
            className="absolute left-0 right-0"
            style={{
              bottom: `${42 + i * 8}%`,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, rgba(65, 88, 118, ${0.18 - i * 0.02}) 28%, rgba(82, 108, 140, ${0.25 - i * 0.03}) 50%, rgba(65, 88, 118, ${0.18 - i * 0.02}) 72%, transparent 100%)`,
              filter: "blur(0.4px)",
              animation: `monet-ripple ${4.2 + i * 2.1}s ease-in-out infinite ${i * 0.9 + 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* ── Layer 10: Horizon line glow ──────────────────────────────────── */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "49%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(180, 95, 20, 0.12) 20%, rgba(220, 128, 35, 0.4) 42%, rgba(235, 140, 45, 0.48) 58%, rgba(180, 95, 20, 0.12) 80%, transparent 100%)",
          filter: "blur(1.5px)",
          animation: "monet-glow 11s ease-in-out infinite 1s",
        }}
      />

      {/* ── Layer 11: Distant silhouettes ────────────────────────────────── */}
      <svg
        className="absolute left-0 right-0 w-full"
        style={{ top: "calc(49% - 62px)" }}
        height="62"
        viewBox="0 0 1440 62"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g opacity="0.1" stroke="rgba(60,75,100,1)" fill="none">
          {/* Left mast */}
          <line x1="205" y1="4" x2="205" y2="62" strokeWidth="0.8" />
          <line x1="190" y1="19" x2="220" y2="19" strokeWidth="0.5" />
          <line x1="205" y1="4" x2="195" y2="22" strokeWidth="0.5" />
          <line x1="205" y1="4" x2="215" y2="22" strokeWidth="0.5" />
          {/* Center structure */}
          <line x1="700" y1="10" x2="700" y2="62" strokeWidth="0.8" />
          <line x1="660" y1="38" x2="740" y2="38" strokeWidth="0.5" />
          <line x1="700" y1="10" x2="688" y2="30" strokeWidth="0.5" />
          <line x1="700" y1="10" x2="712" y2="30" strokeWidth="0.5" />
          {/* Right mast */}
          <line x1="1180" y1="7" x2="1180" y2="62" strokeWidth="0.8" />
          <line x1="1165" y1="25" x2="1195" y2="25" strokeWidth="0.5" />
        </g>
        {/* Hull shapes */}
        <g opacity="0.08" fill="rgba(18,22,35,1)">
          <ellipse cx="700" cy="62" rx="90" ry="9" />
          <ellipse cx="205" cy="62" rx="55" ry="7" />
          <ellipse cx="1180" cy="62" rx="60" ry="7" />
        </g>
      </svg>

      {/* ── Layer 12: Radial vignette ─────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(2, 3, 6, 0.72) 100%)",
        }}
      />

      {/* ── Layer 13: Film grain texture ─────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "172px 172px",
          opacity: 0.032,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
