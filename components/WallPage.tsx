"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PaintingSlotComp from "@/components/PaintingSlot";
import { getSlots, saveSlots, REGION_META, REGION_SLOT_COUNTS, type RegionKey, type PaintingSlot } from "@/lib/stockRoom";

interface Props {
  region: RegionKey;
}

export default function WallPage({ region }: Props) {
  const meta = REGION_META[region];
  const slotCount = REGION_SLOT_COUNTS[region];
  const [slots, setSlots] = useState<PaintingSlot[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setSlots(getSlots(region));
    setMounted(true);
  }, [region]);

  function handleSave(updated: PaintingSlot) {
    setSlots((prev) => {
      const next = prev.map((s) => (s.id === updated.id ? updated : s));
      saveSlots(region, next);
      return next;
    });
  }

  const filled = slots.filter((s) => s.ticker).length;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      style={{ minHeight: "100vh", background: "#09090e" }}
    >
      {/* Gallery lighting — overhead radial */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "70%",
            height: "600px",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200, 160, 96, 0.055) 0%, transparent 68%)",
          }}
        />
        {/* Subtle wall vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(4, 5, 8, 0.35) 100%)",
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Header ──────────────────────────────────────────────── */}
        <header
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 6vw, 5rem) 0",
          }}
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "clamp(2.5rem, 5vw, 4.5rem)",
            }}
          >
            <Link
              href="/gallery"
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "rgba(175, 158, 125, 0.65)",
                fontFamily: "var(--font-inter), sans-serif",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(210, 170, 105, 0.95)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(175, 158, 125, 0.65)")
              }
            >
              ← The Collection
            </Link>
            <span style={{ color: "rgba(200, 160, 96, 0.2)", fontSize: "0.55rem" }}>·</span>
            <span
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "rgba(200, 160, 96, 0.72)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {meta.label}
            </span>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(200, 160, 96, 0.35) 0%, rgba(200, 160, 96, 0.08) 55%, transparent 100%)",
              marginBottom: "clamp(2rem, 4vw, 3.5rem)",
            }}
          />

          {/* Region label */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.46em",
              textTransform: "uppercase",
              color: "rgba(242, 196, 109, 0.96)",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "0.9rem",
            }}
          >
            {meta.label}
          </motion.p>

          {/* Page title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1,
              color: "rgba(242, 230, 205, 0.96)",
              marginBottom: "1rem",
            }}
          >
            {meta.wallLabel}
          </motion.h1>

          {/* Wall I / count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.28em",
              color: "rgba(175, 158, 130, 0.58)",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "clamp(3rem, 6vw, 5rem)",
            }}
          >
            Wall I&nbsp;&nbsp;·&nbsp;&nbsp;
            {mounted ? `${filled} of ${slotCount} positions filled` : `${slotCount} positions`}
            &nbsp;&nbsp;·&nbsp;&nbsp;Click to edit · double-click to flip
          </motion.p>
        </header>

        {/* ── Painting wall ────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 6vw, 5rem) clamp(5rem, 10vw, 9rem)",
          }}
        >
          {/* Thin rule */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.65, duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(200, 160, 96, 0.22) 0%, rgba(200, 160, 96, 0.06) 70%, transparent 100%)",
              marginBottom: "clamp(2.5rem, 5vw, 4.5rem)",
            }}
          />

          {/* 5 × 2 painting grid */}
          {mounted && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "clamp(2rem, 4vw, 3.5rem)",
              }}
            >
              {slots.map((slot, i) => (
                <PaintingSlotComp
                  key={slot.id}
                  slot={slot}
                  index={i}
                  region={region}
                  onSave={handleSave}
                />
              ))}
            </div>
          )}

          {/* Responsive: collapse to fewer columns on small screens */}
          <style>{`
            @media (max-width: 900px) {
              section > div[style*="repeat(5"] {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            @media (max-width: 580px) {
              section > div[style*="repeat(5"] {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "2.5rem clamp(1.5rem, 6vw, 5rem) 4rem",
            borderTop: "1px solid rgba(200, 160, 96, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "rgba(140, 125, 98, 0.42)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            George&apos;s Gallery
          </p>
          <p
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.26em",
              color: "rgba(120, 108, 84, 0.35)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Positions saved locally
          </p>
        </footer>
      </div>
    </motion.main>
  );
}
