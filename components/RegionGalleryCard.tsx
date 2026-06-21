"use client";

import Image from "next/image";
import Link from "next/link";
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
  rest: { opacity: 0.26 },
  hover: { opacity: 0.48, transition: { duration: 0.35 } },
};

const line: Variants = {
  rest: { scaleX: 0.32, originX: 0 },
  hover: { scaleX: 1, originX: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const mapImages: Record<
  RegionKey,
  {
    src: string;
    width: number;
    height: number;
    maxWidth: string;
    translateY?: string;
  }
> = {
  us: {
    src: "/regional-maps/us.png",
    width: 1800,
    height: 1348,
    maxWidth: "250px",
  },
  eu: {
    src: "/regional-maps/eu.png",
    width: 550,
    height: 506,
    maxWidth: "170px",
    translateY: "-2px",
  },
  asia: {
    src: "/regional-maps/asia.png",
    width: 736,
    height: 482,
    maxWidth: "238px",
  },
};

function RegionMap({ region, title }: { region: RegionKey; title: string }) {
  const map = mapImages[region];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "132px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-10% -12%",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(242, 196, 109, 0.18) 0%, rgba(242, 196, 109, 0.08) 42%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <Image
        src={map.src}
        width={map.width}
        height={map.height}
        alt={`${title} map`}
        priority
        style={{
          width: "100%",
          maxWidth: map.maxWidth,
          height: "auto",
          display: "block",
          opacity: 0.96,
          transform: `translateY(${map.translateY ?? "0"})`,
          filter:
            "drop-shadow(0 14px 20px rgba(0, 0, 0, 0.58)) drop-shadow(0 0 14px rgba(242, 196, 109, 0.18))",
        }}
      />
    </div>
  );
}

export default function RegionGalleryCard({ region, title, label, index = 0 }: RegionGalleryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.1, duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/gallery/${region}`} style={{ textDecoration: "none", display: "block" }}>
        <motion.article
          variants={card}
          initial="rest"
          whileHover="hover"
          style={{
            position: "relative",
            minHeight: "190px",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(25, 26, 33, 0.98) 0%, rgba(18, 19, 26, 0.98) 100%)",
            border: "1px solid rgba(242, 196, 109, 0.22)",
            padding: "clamp(1.4rem, 2.8vw, 2.25rem)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.78fr) minmax(132px, 0.72fr)",
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
              background: "radial-gradient(ellipse at 82% 35%, rgba(242, 196, 109, 0.24) 0%, transparent 58%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
            <motion.div
              variants={line}
              style={{
                height: "1px",
                background: "rgba(242, 196, 109, 0.84)",
                marginBottom: "1.35rem",
              }}
            />
            <p
              style={{
                fontSize: "0.56rem",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "rgba(242, 196, 109, 1)",
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
                color: "rgba(255, 242, 214, 0.98)",
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
                color: "rgba(194, 174, 132, 0.72)",
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
      </Link>
    </motion.div>
  );
}