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

const mapPaths: Record<RegionKey, string[]> = {
  us: [
    "M33 75 C42 57 60 49 80 52 C99 43 124 45 141 57 C155 59 168 66 180 80 C171 88 151 90 136 85 C121 96 101 97 84 89 C67 93 48 89 33 75 Z",
    "M78 92 C88 96 100 98 114 96 C104 108 91 113 80 105 C76 101 75 97 78 92 Z",
    "M151 91 C158 90 166 91 173 96 C165 101 157 101 150 97 C147 95 148 92 151 91 Z",
  ],
  eu: [
    "M74 50 C85 41 101 42 113 50 C125 45 140 51 144 64 C154 68 159 78 154 88 C143 91 134 86 128 78 C118 83 105 82 96 74 C86 80 72 77 66 68 C60 61 64 54 74 50 Z",
    "M101 80 C108 89 116 97 127 102 C117 106 107 103 101 94 C97 88 96 83 101 80 Z",
    "M137 91 C145 91 151 95 154 102 C146 104 139 101 136 96 C134 93 134 91 137 91 Z",
  ],
  asia: [
    "M46 66 C62 43 92 37 119 45 C137 35 166 40 184 58 C198 65 205 82 196 96 C181 101 165 94 154 82 C139 92 118 92 103 82 C89 95 67 95 52 83 C43 77 41 71 46 66 Z",
    "M125 88 C137 92 148 102 155 117 C141 117 129 108 122 96 C119 91 120 88 125 88 Z",
    "M166 96 C176 99 186 106 190 117 C178 119 168 112 163 103 C161 99 162 96 166 96 Z",
    "M88 89 C96 95 103 103 105 114 C94 113 86 105 82 96 C80 92 82 89 88 89 Z",
  ],
};

function RegionMap({ region, title }: { region: RegionKey; title: string }) {
  return (
    <svg
      viewBox="0 0 220 150"
      role="img"
      aria-label={`${title} map`}
      style={{
        width: "100%",
        maxWidth: "220px",
        aspectRatio: "22 / 15",
        display: "block",
        filter: "drop-shadow(0 18px 24px rgba(0, 0, 0, 0.45))",
      }}
    >
      <defs>
        <radialGradient id={`${region}-map-glow`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(226, 180, 105, 0.45)" />
          <stop offset="58%" stopColor="rgba(200, 160, 96, 0.16)" />
          <stop offset="100%" stopColor="rgba(200, 160, 96, 0)" />
        </radialGradient>
        <linearGradient id={`${region}-map-fill`} x1="25%" x2="75%" y1="15%" y2="90%">
          <stop offset="0%" stopColor="rgba(242, 224, 188, 0.78)" />
          <stop offset="55%" stopColor="rgba(200, 160, 96, 0.48)" />
          <stop offset="100%" stopColor="rgba(118, 88, 47, 0.5)" />
        </linearGradient>
      </defs>
      <ellipse cx="112" cy="78" rx="92" ry="58" fill={`url(#${region}-map-glow)`} />
      <path
        d="M24 93 C64 72 97 70 130 82 C157 92 180 89 203 76"
        fill="none"
        stroke="rgba(200, 160, 96, 0.16)"
        strokeWidth="1"
      />
      <path
        d="M24 108 C67 91 103 88 137 98 C161 105 184 101 203 92"
        fill="none"
        stroke="rgba(200, 160, 96, 0.1)"
        strokeWidth="1"
      />
      {mapPaths[region].map((path, i) => (
        <path
          key={path}
          d={path}
          fill={`url(#${region}-map-fill)`}
          stroke="rgba(242, 224, 188, 0.42)"
          strokeWidth={i === 0 ? "1.15" : "0.85"}
          strokeLinejoin="round"
        />
      ))}
      <circle cx="112" cy="78" r="2.3" fill="rgba(235, 190, 115, 0.95)" />
      <circle cx="112" cy="78" r="8" fill="none" stroke="rgba(235, 190, 115, 0.32)" strokeWidth="1" />
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
