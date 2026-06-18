"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MonetBackground from "@/components/MonetBackground";

export default function LandingPage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  async function handleEnter() {
    if (isExiting) return;
    setIsExiting(true);
    await new Promise((r) => setTimeout(r, 1050));
    router.push("/gallery");
  }

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* ── Monet background ──────────────────────────────────────────── */}
      <MonetBackground />

      {/* ── Cinematic blackout overlay ────────────────────────────────── */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "#040508", zIndex: 50 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 1 : 0 }}
        transition={{ duration: 0.95, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* ── Hero content ──────────────────────────────────────────────── */}
      <motion.div
        className="relative flex flex-col items-center text-center"
        style={{ zIndex: 10, padding: "0 1.5rem", maxWidth: "900px" }}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -12 : 0,
          filter: isExiting ? "blur(8px)" : "blur(0px)",
        }}
        transition={{
          opacity: { duration: isExiting ? 0.55 : 1.6, ease: "easeInOut" },
          y: { duration: isExiting ? 0.55 : 1.6 },
          filter: { duration: isExiting ? 0.55 : 0.01 },
          delay: isExiting ? 0 : 0.4,
        }}
      >
        {/* Collection label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: "rgba(200, 160, 96, 0.42)",
            fontFamily: "var(--font-inter), sans-serif",
            marginBottom: "2.25rem",
          }}
        >
          A Private Collection
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
            fontSize: "clamp(4.2rem, 10.5vw, 9rem)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 0.92,
            color: "rgba(232, 218, 195, 0.9)",
            letterSpacing: "-0.01em",
          }}
        >
          George&apos;s
          <br />
          <span style={{ color: "rgba(228, 215, 190, 0.75)" }}>Gallery</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1.4, ease: "easeOut" }}
          style={{
            fontSize: "clamp(0.56rem, 1.1vw, 0.68rem)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(135, 122, 100, 0.48)",
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            marginTop: "2.5rem",
            marginBottom: "5rem",
            lineHeight: 1.9,
          }}
        >
          A personal gallery of investment theses
          <br />
          &amp;&nbsp;previous plays
        </motion.p>

        {/* Enter button */}
        <motion.button
          onClick={handleEnter}
          disabled={isExiting}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.65, duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          style={{
            padding: "0.875rem 2.75rem",
            border: "1px solid rgba(200, 160, 96, 0.18)",
            background: "transparent",
            cursor: isExiting ? "default" : "pointer",
            letterSpacing: "0.42em",
            fontSize: "0.58rem",
            textTransform: "uppercase",
            color: "rgba(185, 172, 148, 0.58)",
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 400,
            outline: "none",
            transition: "color 0.45s ease, border-color 0.45s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(200, 160, 96, 0.78)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(200, 160, 96, 0.32)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(185, 172, 148, 0.58)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(200, 160, 96, 0.18)";
          }}
        >
          Enter the Gallery
        </motion.button>
      </motion.div>

      {/* ── Attribution ───────────────────────────────────────────────── */}
      <motion.p
        className="absolute"
        style={{
          bottom: "2.25rem",
          fontSize: "0.52rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(95, 86, 70, 0.38)",
          fontFamily: "var(--font-inter), sans-serif",
          zIndex: 10,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ delay: 2.1, duration: 1.3 }}
      >
        Curated by George Xu
      </motion.p>
    </main>
  );
}
