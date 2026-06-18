"use client";

import { motion, type Variants } from "framer-motion";

type RegionKey = "us" | "eu" | "asia";

interface RegionGalleryCardProps {
  region: RegionKey;
  title: string;
  label: string;
  index?: number;
}

const card: Variants = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const glow: Variants = {
  rest: { opacity: 0.18 },
  hover: { opacity: 0.38, transition: { duration: 0.35 } },
};

const line: Variants = {
  rest: { scaleX: 0.32, originX: 0 },
  hover: { scaleX: 1, originX: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/*
 * Simplified but geographically accurate silhouettes.
 * viewBox: 0 0 220 150 — each path hand-fitted to fill ~65% of the canvas.
 */
const mapPaths: Record<RegionKey, string> = {
  // Continental United States — flat north border, Florida peninsula, angled west coast
  us: "M42,32 L38,46 L35,60 L38,72 L50,82 L68,90 L86,94 L102,94 L112,90 L116,82 L120,98 L122,114 L126,104 L128,86 L136,74 L150,60 L162,44 L168,32 L148,26 L125,25 L100,25 L75,26 L55,28 Z",

  // Europe — NW Atlantic edge, Iberian coast, Mediterranean, Adriatic, Balkans, Baltic
  eu: "M68,30 L54,44 L48,58 L52,70 L66,82 L84,90 L98,96 L100,112 L106,120 L114,116 L114,100 L120,88 L140,76 L155,62 L158,48 L152,36 L135,28 L112,24 L90,24 L74,26 Z",

  // Asia Pacific — massive east-west span, Indian subcontinent peninsula, SE Asian coast
  asia: "M35,30 L58,24 L88,20 L118,20 L148,22 L170,28 L186,38 L192,52 L188,66 L176,76 L158,82 L140,85 L128,80 L120,92 L115,108 L112,118 L109,106 L112,94 L106,86 L96,92 L85,84 L74,90 L62,82 L46,74 L32,60 L28,44 Z",
};

function RegionMap({ region, title }: { region: RegionKey; title: string }) {
  const gradId = `${region}-fill`;
  const glowId = `${region}-glow`;

  return (
    <svg
      viewBox="0 0 220 150"
      role="img"
      aria-label={`${title} region`}
      style={{
        width: "100%",
        maxWidth: "220px",
        aspectRatio: "22 / 15",
        display: "block",
        filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.5))",
        overflow: "visible",
      }}
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(226, 180, 105, 0.18)" />
          <stop offset="100%" stopColor="rgba(200, 160, 96, 0)" />
        </radialGradient>
        <linearGradient id={gradId} x1="20%" x2="80%" y1="10%" y2="95%">
          <stop offset="0%" stopColor="rgba(240, 220, 178, 0.82)" />
          <stop offset="50%" stopColor="rgba(200, 160, 96, 0.55)" />
          <stop offset="100%" stopColor="rgba(110, 80, 38, 0.52)" />
        </linearGradient>
      </defs>

      {/* Ambient glow behind the shape */}
      <ellipse cx="110" cy="75" rx="95" ry="60" fill={`url(#${glowId})`} />

      {/* Landmass silhouette */}
      <path
        d={mapPaths[region]}
        fill={`url(#${gradId})`}
        stroke="rgba(240, 215, 165, 0.5)"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RegionGalleryCard({ region, title, label, index = 0 }: RegionGalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.1, duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.article
        variants={card}
        initial="rest"
        whileHover="hover"
        style={{
          position: "relative",
          minHeight: "190px",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(14, 15, 20, 0.98) 0%, rgba(9, 10, 15, 0.98) 100%)",
          border: "1px solid rgba(200, 160, 96, 0.16)",
          padding: "clamp(1.4rem, 2.8vw, 2.25rem)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.82fr) minmax(118px, 0.68fr)",
          gap: "clamp(1rem, 2vw, 1.75rem)",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <motion.div
          variants={glow}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 82% 35%, rgba(200, 160, 96, 0.18) 0%, transparent 58%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
          <motion.div
            variants={line}
            style={{
              height: "1px",
              background: "rgba(210, 170, 105, 0.66)",
              marginBottom: "1.35rem",
            }}
          />
          <p
            style={{
              fontSize: "0.56rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(210, 170, 105, 0.76)",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "0.7rem",
            }}
          >
            {label}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(2rem, 4.1vw, 3.15rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 0.95,
              color: "rgba(242, 232, 210, 0.97)",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              marginTop: "1.3rem",
              fontSize: "0.55rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "rgba(160, 145, 115, 0.58)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Stock Room
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1, justifySelf: "end", width: "100%" }}>
          <RegionMap region={region} title={title} />
        </div>
      </motion.article>
    </motion.div>
  );
}
