"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getThesis } from "@/lib/theses";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ThesisPage({ params }: PageProps) {
  const { slug } = use(params);
  const thesis = getThesis(slug);

  if (!thesis) {
    notFound();
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ minHeight: "100vh", background: "#0c0d12" }}
    >
      {/* Subtle overhead lighting */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "500px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(200, 160, 96, 0.055) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
        {/* ── Nav ───────────────────────────────────────────────────── */}
        <nav
          style={{
            padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 6vw, 5rem)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            <Link
              href="/gallery"
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
              ← The Collection
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <Link
              href="/"
              style={{
                fontSize: "0.57rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(155, 140, 110, 0.55)",
                fontFamily: "var(--font-inter), sans-serif",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(210, 170, 105, 0.8)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(155, 140, 110, 0.55)")
              }
            >
              George&apos;s Gallery
            </Link>
          </motion.div>
        </nav>

        {/* ── Exhibition room ─────────────────────────────────────── */}
        <article style={{ padding: "0 clamp(1.5rem, 6vw, 5rem) clamp(5rem, 10vw, 9rem)" }}>
          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              height: "1px",
              background: "linear-gradient(90deg, rgba(200, 160, 96, 0.4) 0%, rgba(200, 160, 96, 0.12) 50%, transparent 100%)",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
            }}
          />

          {/* Exhibit header */}
          <header style={{ maxWidth: "780px" }}>
            {thesis.category && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.85 }}
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  color: "rgba(210, 170, 105, 0.78)",
                  fontFamily: "var(--font-inter), sans-serif",
                  marginBottom: "1.1rem",
                }}
              >
                {thesis.category}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.08,
                color: "rgba(242, 230, 205, 0.97)",
                marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                letterSpacing: "0.005em",
              }}
            >
              {thesis.title}
            </motion.h1>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.9 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                marginBottom: "clamp(3rem, 6vw, 5rem)",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.28em",
                  color: "rgba(175, 158, 128, 0.75)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {thesis.dateFormatted}
              </span>

              {thesis.tags && thesis.tags.length > 0 && (
                <>
                  <span
                    style={{
                      width: "1px",
                      height: "10px",
                      background: "rgba(200, 160, 96, 0.3)",
                      display: "inline-block",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.875rem" }}>
                    {thesis.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.57rem",
                          letterSpacing: "0.32em",
                          color: "rgba(165, 148, 118, 0.65)",
                          fontFamily: "var(--font-inter), sans-serif",
                          textTransform: "uppercase",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </header>

          {/* Body text */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 1.1, ease: "easeOut" }}
            style={{
              maxWidth: "680px",
              borderTop: "1px solid rgba(200, 160, 96, 0.15)",
              paddingTop: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            <div className="thesis-body" dangerouslySetInnerHTML={{ __html: thesis.content }} />
          </motion.div>

          {/* End mark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              maxWidth: "680px",
              marginTop: "clamp(3rem, 6vw, 5rem)",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            <div style={{ height: "1px", width: "40px", background: "rgba(200, 160, 96, 0.45)" }} />
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.38em",
                color: "rgba(200, 160, 96, 0.55)",
                fontFamily: "var(--font-inter), sans-serif",
                textTransform: "uppercase",
              }}
            >
              End of exhibit
            </span>
          </motion.div>

          {/* Back to collection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            style={{
              maxWidth: "680px",
              marginTop: "clamp(3rem, 5vw, 4.5rem)",
              paddingTop: "clamp(2rem, 4vw, 3rem)",
              borderTop: "1px solid rgba(200, 160, 96, 0.1)",
            }}
          >
            <Link
              href="/gallery"
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
              ← Return to the Collection
            </Link>
          </motion.div>
        </article>
      </div>
    </motion.main>
  );
}
