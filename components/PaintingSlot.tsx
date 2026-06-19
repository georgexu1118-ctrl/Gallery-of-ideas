"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { PaintingSlot } from "@/lib/stockRoom";

interface Props {
  slot: PaintingSlot;
  index: number;
  onSave: (updated: PaintingSlot) => void;
}

export default function PaintingSlotComp({ slot, index, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [ticker, setTicker] = useState(slot.ticker);
  const [name, setName]     = useState(slot.name);
  const tickerRef = useRef<HTMLInputElement>(null);
  const isEmpty = !slot.ticker;

  // Sync external slot changes (e.g. load from localStorage)
  useEffect(() => {
    setTicker(slot.ticker);
    setName(slot.name);
  }, [slot.ticker, slot.name]);

  function startEdit() {
    setEditing(true);
    setTimeout(() => tickerRef.current?.focus(), 40);
  }

  function commit() {
    setEditing(false);
    onSave({ ...slot, ticker: ticker.trim().toUpperCase(), name: name.trim() });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.045, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={!editing ? startEdit : undefined}
      whileHover={!editing ? { y: -3, transition: { duration: 0.25 } } : {}}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        cursor: editing ? "default" : "pointer",
        background: "#07080c",
        // Multi-layer frame effect
        boxShadow: `
          0 0 0 1.5px rgba(175, 135, 58, 0.6),
          0 0 0 5px rgba(6, 7, 11, 1),
          0 0 0 8px rgba(155, 115, 45, 0.45),
          0 0 0 10.5px rgba(120, 88, 28, 0.28),
          0 28px 50px rgba(0,0,0,0.65),
          0 8px 18px rgba(0,0,0,0.45)
        `,
      }}
    >
      {/* Slot number */}
      <span
        style={{
          position: "absolute",
          top: "0.6rem",
          left: "0.7rem",
          fontSize: "0.46rem",
          letterSpacing: "0.28em",
          color: "rgba(200, 160, 96, 0.52)",
          fontFamily: "var(--font-inter), sans-serif",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {editing ? (
        /* ── Edit mode ──────────────────────────────────────────────── */
        <div
          /* Save whenever focus leaves the entire edit area */
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              commit();
            }
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            gap: "1rem",
          }}
        >
          <input
            ref={tickerRef}
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={handleKey}
            placeholder="TICKER"
            maxLength={10}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid rgba(200, 160, 96, 0.4)",
              outline: "none",
              textAlign: "center",
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(242, 228, 195, 0.97)",
              width: "100%",
              letterSpacing: "0.08em",
              paddingBottom: "0.35rem",
            }}
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Company name"
            style={{
              background: "transparent",
              border: "none",
              borderBottom: "1px solid rgba(200, 160, 96, 0.15)",
              outline: "none",
              textAlign: "center",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: "rgba(175, 158, 128, 0.72)",
              width: "100%",
              paddingBottom: "0.25rem",
            }}
          />
          <p
            style={{
              fontSize: "0.44rem",
              letterSpacing: "0.28em",
              color: "rgba(140, 125, 95, 0.38)",
              fontFamily: "var(--font-inter), sans-serif",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Enter to save
          </p>
        </div>
      ) : isEmpty ? (
        /* ── Empty frame ───────────────────────────────────────────── */
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
          }}
          initial={{ opacity: 0.28 }}
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.25 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1V17M1 9H17" stroke="rgba(200,160,96,0.9)" strokeWidth="0.75" />
          </svg>
          <span
            style={{
              fontSize: "0.46rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(200,160,96,0.85)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Add Ticker
          </span>
        </motion.div>
      ) : (
        /* ── Filled frame ──────────────────────────────────────────── */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
            gap: "0.5rem",
          }}
        >
          {/* Subtle inner glow behind ticker */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 48%, rgba(200, 160, 96, 0.06) 0%, transparent 68%)",
              pointerEvents: "none",
            }}
          />

          <span
            style={{
              position: "relative",
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(242, 228, 195, 0.97)",
              letterSpacing: "0.06em",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {slot.ticker}
          </span>

          {slot.name && (
            <span
              style={{
                position: "relative",
                fontSize: "0.52rem",
                letterSpacing: "0.2em",
                color: "rgba(175, 158, 128, 0.62)",
                fontFamily: "var(--font-inter), sans-serif",
                textAlign: "center",
                lineHeight: 1.45,
              }}
            >
              {slot.name}
            </span>
          )}

          {/* Edit hint */}
          <motion.span
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              position: "absolute",
              bottom: "0.7rem",
              fontSize: "0.42rem",
              letterSpacing: "0.3em",
              color: "rgba(242, 196, 109, 0.85)",
              fontFamily: "var(--font-inter), sans-serif",
              textTransform: "uppercase",
            }}
          >
            Edit
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}
