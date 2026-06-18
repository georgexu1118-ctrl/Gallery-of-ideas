"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ExhibitCard from "@/components/ExhibitCard";
import { getAllTheses } from "@/lib/theses";

export default function GalleryPage() {
  const theses = getAllTheses();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      style={{ minHeight: "100vh", background: "#0c0d12" }}
    >
      {/* Subtle gallery atmosphere */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "500px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(200, 160, 96, 0.07) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Gallery header ─────────────────────────────────────────── */}
        <header
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 5rem) 0",
          }}
        >
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}
          >
            <Link
              href="/"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(175, 158, 125, 0.7)",
                fontFamily: "var(--font-inter), sans-serif",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(210, 170, 105, 0.95)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(175, 158, 125, 0.7)")
              }
            >
              ← George&apos;s Gallery
            </Link>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(200, 160, 96, 0.35) 0%, rgba(200, 160, 96, 0.1) 60%, transparent 100%)",
              marginBottom: "clamp(2rem, 4vw, 3.5rem)",
            }}
          />

          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.46em",
              textTransform: "uppercase",
              color: "rgba(210, 170, 105, 0.75)",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "1.1rem",
            }}
          >
            The Collection
          </motion.p>

          {/* Gallery title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1,
              color: "rgba(242, 230, 205, 0.96)",
              marginBottom: "1.25rem",
            }}
          >
            Investment Theses
          </motion.h1>

          {/* Exhibit count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              color: "rgba(175, 158, 130, 0.65)",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "clamp(3rem, 6vw, 5rem)",
            }}
          >
            {theses.length} {theses.length === 1 ? "exhibit" : "exhibits"}&nbsp;&nbsp;
            &middot;&nbsp;&nbsp;Curated by George Xu
          </motion.p>
        </header>

        {/* ── Exhibit grid ───────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 6vw, 5rem) clamp(4rem, 8vw, 8rem)",
          }}
        >
          {/* Thin golden rule */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(200, 160, 96, 0.25) 0%, rgba(200, 160, 96, 0.08) 70%, transparent 100%)",
              marginBottom: "clamp(2rem, 4vw, 3.5rem)",
            }}
          />

          {/* Card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
              gap: "1px",
              background: "rgba(200, 160, 96, 0.1)",
            }}
          >
            {theses.map((thesis, i) => (
              <ExhibitCard key={thesis.slug} thesis={thesis} index={i} />
            ))}
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "2.5rem clamp(1.5rem, 6vw, 5rem) 4rem",
            borderTop: "1px solid rgba(200, 160, 96, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(155, 140, 110, 0.55)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            George&apos;s Gallery
          </p>
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.28em",
              color: "rgba(140, 125, 98, 0.45)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            A private collection
          </p>
        </footer>
      </div>
    </motion.main>
  );
}
