"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ExhibitCard from "@/components/ExhibitCard";
import { getAllTheses } from "@/lib/theses";

// ── Tab nav (shared visual) ─────────────────────────────────────────────────

function GalleryNav({ active }: { active: "gallery" | "theses" }) {
  const tabStyle = (tab: typeof active): React.CSSProperties => ({
    fontSize: "0.56rem",
    letterSpacing: "0.38em",
    textTransform: "uppercase",
    fontFamily: "var(--font-inter), sans-serif",
    textDecoration: "none",
    color: active === tab ? "rgba(242,196,109,0.98)" : "rgba(175,158,125,0.52)",
    borderBottom: active === tab ? "1px solid rgba(242,196,109,0.55)" : "1px solid transparent",
    paddingBottom: "0.25rem",
    transition: "color 0.3s, border-color 0.3s",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem",
      marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
      <Link href="/gallery" style={tabStyle("gallery")}
        onMouseEnter={(e) => { if (active !== "gallery") (e.currentTarget as HTMLAnchorElement).style.color = "rgba(210,190,155,0.8)"; }}
        onMouseLeave={(e) => { if (active !== "gallery") (e.currentTarget as HTMLAnchorElement).style.color = "rgba(175,158,125,0.52)"; }}>
        Gallery
      </Link>
      <span style={{ color: "rgba(200,160,96,0.2)", fontSize: "0.5rem" }}>·</span>
      <Link href="/gallery/theses" style={tabStyle("theses")}
        onMouseEnter={(e) => { if (active !== "theses") (e.currentTarget as HTMLAnchorElement).style.color = "rgba(210,190,155,0.8)"; }}
        onMouseLeave={(e) => { if (active !== "theses") (e.currentTarget as HTMLAnchorElement).style.color = "rgba(175,158,125,0.52)"; }}>
        Broad Investment Theses
      </Link>
    </div>
  );
}

export default function ThesesPage() {
  const theses = getAllTheses();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      style={{ minHeight: "100vh", background: "#13141a" }}
    >
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "80%", height: "500px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(242,196,109,0.11) 0%, transparent 65%)" }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <header style={{ maxWidth: "1400px", margin: "0 auto",
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem) 0" }}>

          {/* Back link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            style={{ marginBottom: "clamp(2rem,4vw,3.5rem)" }}>
            <Link href="/"
              style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase",
                color: "rgba(205,185,145,0.78)", fontFamily: "var(--font-inter),sans-serif",
                textDecoration: "none", transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,213,130,0.98)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(205,185,145,0.78)")}>
              ← George&apos;s Gallery
            </Link>
          </motion.div>

          {/* Nav tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.9 }}>
            <GalleryNav active="theses" />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ height: "1px", marginBottom: "clamp(2rem,4vw,3.5rem)",
              background: "linear-gradient(90deg,rgba(242,196,109,0.48) 0%,rgba(242,196,109,0.16) 60%,transparent 100%)" }} />

          {/* Section label */}
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            style={{ fontSize: "0.6rem", letterSpacing: "0.46em", textTransform: "uppercase",
              color: "rgba(242,196,109,1)", fontFamily: "var(--font-inter),sans-serif",
              marginBottom: "1.1rem" }}>
            The Collection
          </motion.p>

          {/* Page title */}
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--font-cormorant),"Cormorant Garamond",Georgia,serif',
              fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 300, fontStyle: "italic",
              lineHeight: 1, color: "rgba(255,242,214,0.98)", marginBottom: "1.25rem" }}>
            Broad Investment Theses
          </motion.h1>

          {/* Count */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            style={{ fontSize: "0.6rem", letterSpacing: "0.28em",
              color: "rgba(205,185,145,0.78)", fontFamily: "var(--font-inter),sans-serif",
              marginBottom: "clamp(3rem,6vw,5rem)" }}>
            {theses.length} {theses.length === 1 ? "exhibit" : "exhibits"}&nbsp;&nbsp;
            &middot;&nbsp;&nbsp;Curated by George Xu
          </motion.p>
        </header>

        {/* Exhibit grid */}
        <section style={{ maxWidth: "1400px", margin: "0 auto",
          padding: "0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,8rem)" }}>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ height: "1px", marginBottom: "clamp(2rem,4vw,3.5rem)",
              background: "linear-gradient(90deg,rgba(242,196,109,0.36) 0%,rgba(242,196,109,0.13) 70%,transparent 100%)" }} />

          <div style={{ display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,380px),1fr))",
            gap: "1px", background: "rgba(242,196,109,0.16)" }}>
            {theses.map((thesis, i) => (
              <ExhibitCard key={thesis.slug} thesis={thesis} index={i} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ maxWidth: "1400px", margin: "0 auto",
          padding: "2.5rem clamp(1.5rem,6vw,5rem) 4rem",
          borderTop: "1px solid rgba(242,196,109,0.16)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.38em", textTransform: "uppercase",
            color: "rgba(194,174,132,0.68)", fontFamily: "var(--font-inter),sans-serif" }}>
            George&apos;s Gallery
          </p>
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em",
            color: "rgba(174,155,118,0.58)", fontFamily: "var(--font-inter),sans-serif" }}>
            A private collection
          </p>
        </footer>
      </div>
    </motion.main>
  );
}
