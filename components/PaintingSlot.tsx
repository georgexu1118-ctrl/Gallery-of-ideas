"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { PaintingSlot } from "@/lib/stockRoom";
import { savePDF, getPDF, deletePDF } from "@/lib/pdfStore";

interface Props {
  slot: PaintingSlot;
  index: number;
  region: string;
  onSave: (updated: PaintingSlot) => void;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function PaintingSlotComp({ slot, index, region, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [ticker, setTicker] = useState(slot.ticker);
  const [name, setName] = useState(slot.name);
  const [pdfMeta, setPdfMeta] = useState<{ name: string; size: number } | null>(
    slot.pdfName ? { name: slot.pdfName, size: slot.pdfSize ?? 0 } : null
  );
  const tickerRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEmpty = !slot.ticker;
  const pdfKey = `${region}-${slot.id}`;

  useEffect(() => {
    setTicker(slot.ticker);
    setName(slot.name);
    setPdfMeta(slot.pdfName ? { name: slot.pdfName, size: slot.pdfSize ?? 0 } : null);
  }, [slot.ticker, slot.name, slot.pdfName, slot.pdfSize]);

  function handleCardClick() {
    if (editing) return;
    setFlipped((f) => !f);
  }

  function startEdit(e?: React.MouseEvent) {
    e?.stopPropagation();
    setFlipped(false);
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

  async function handlePDFUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await savePDF(pdfKey, file);
      const meta = { name: file.name, size: file.size };
      setPdfMeta(meta);
      onSave({ ...slot, pdfName: file.name, pdfSize: file.size });
    } catch (err) {
      console.error("PDF save failed:", err);
    }
    e.target.value = "";
  }

  async function openPDF(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const data = await getPDF(pdfKey);
      if (!data) return;
      const blob = new Blob([data.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error("PDF open failed:", err);
    }
  }

  async function removePDF(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deletePDF(pdfKey);
    } catch {
      /* ignore */
    }
    setPdfMeta(null);
    const { pdfName: _pdfName, pdfSize: _pdfSize, ...rest } = slot;
    onSave(rest as PaintingSlot);
  }

  const frameBoxShadow = `
    0 0 0 1.5px rgba(175, 135, 58, 0.6),
    0 0 0 5px rgba(6, 7, 11, 1),
    0 0 0 8px rgba(155, 115, 45, 0.45),
    0 0 0 10.5px rgba(120, 88, 28, 0.28),
    0 28px 50px rgba(0,0,0,0.65),
    0 8px 18px rgba(0,0,0,0.45)
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 + index * 0.045,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      onClick={!editing ? handleCardClick : undefined}
      whileHover={!editing && !flipped ? { y: -3, transition: { duration: 0.25 } } : {}}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        cursor: editing ? "default" : "pointer",
        boxShadow: frameBoxShadow,
        perspective: "1000px",
      }}
    >
      {/* ── Flip container ─────────────────────────────────────────── */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.55,
          ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        }}
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── FRONT FACE ─────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#07080c",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          } as React.CSSProperties}
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

          {/* PDF attached indicator */}
          {pdfMeta && !editing && (
            <span
              aria-label="PDF attached"
              style={{
                position: "absolute",
                top: "0.65rem",
                right: "0.65rem",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "rgba(242, 196, 109, 0.72)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />
          )}

          {editing ? (
            /* Edit mode */
            <div
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) commit();
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
            /* Empty frame */
            <motion.div
              initial={{ opacity: 0.28 }}
              whileHover={{ opacity: 0.7 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => { e.stopPropagation(); startEdit(); }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
              }}
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
            /* Filled frame */
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
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at 50% 48%, rgba(200, 160, 96, 0.06) 0%, transparent 68%)",
                  pointerEvents: "none",
                }}
              />
              <span
                style={{
                  position: "relative",
                  fontFamily:
                    'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
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
                onClick={(e) => startEdit(e)}
                style={{
                  position: "absolute",
                  bottom: "0.7rem",
                  fontSize: "0.42rem",
                  letterSpacing: "0.3em",
                  color: "rgba(242, 196, 109, 0.85)",
                  fontFamily: "var(--font-inter), sans-serif",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  zIndex: 3,
                }}
              >
                Edit
              </motion.span>
            </div>
          )}
        </div>

        {/* ── BACK FACE ──────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#07080c",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.1rem",
            gap: "0.85rem",
          } as React.CSSProperties}
        >
          {/* Subtle grid texture */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(200,160,96,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,160,96,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            }}
          />

          {/* Slot number (back) */}
          <span
            style={{
              position: "absolute",
              top: "0.6rem",
              left: "0.7rem",
              fontSize: "0.46rem",
              letterSpacing: "0.28em",
              color: "rgba(200, 160, 96, 0.52)",
              fontFamily: "var(--font-inter), sans-serif",
              pointerEvents: "none",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* "Files" label */}
          <span
            style={{
              position: "absolute",
              top: "0.6rem",
              right: "0.7rem",
              fontSize: "0.44rem",
              letterSpacing: "0.3em",
              color: "rgba(200, 160, 96, 0.48)",
              fontFamily: "var(--font-inter), sans-serif",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Files
          </span>

          {/* PDF content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.65rem",
              width: "100%",
            }}
          >
            {pdfMeta ? (
              <>
                {/* PDF icon */}
                <svg width="26" height="30" viewBox="0 0 26 32" fill="none">
                  <path
                    d="M3 0h14l7 7v23a2 2 0 01-2 2H3a2 2 0 01-2-2V2a2 2 0 012-2z"
                    fill="rgba(200,160,96,0.07)"
                    stroke="rgba(242,196,109,0.55)"
                    strokeWidth="1"
                  />
                  <path
                    d="M17 0v7h7"
                    stroke="rgba(242,196,109,0.45)"
                    strokeWidth="1"
                  />
                  <rect x="5" y="16" width="14" height="1" rx="0.5" fill="rgba(242,196,109,0.35)" />
                  <rect x="5" y="19" width="10" height="1" rx="0.5" fill="rgba(242,196,109,0.25)" />
                  <rect x="5" y="22" width="12" height="1" rx="0.5" fill="rgba(242,196,109,0.25)" />
                </svg>

                {/* Filename */}
                <span
                  style={{
                    fontSize: "0.45rem",
                    letterSpacing: "0.08em",
                    color: "rgba(242, 228, 195, 0.78)",
                    fontFamily: "var(--font-inter), sans-serif",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  {pdfMeta.name}
                </span>
                <span
                  style={{
                    fontSize: "0.41rem",
                    letterSpacing: "0.18em",
                    color: "rgba(175, 158, 128, 0.45)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {fmtSize(pdfMeta.size)}
                </span>

                {/* Open / Remove */}
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <button
                    onClick={openPDF}
                    style={{
                      background: "rgba(242, 196, 109, 0.08)",
                      border: "1px solid rgba(242, 196, 109, 0.35)",
                      color: "rgba(242, 196, 109, 0.9)",
                      fontSize: "0.43rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-inter), sans-serif",
                      padding: "0.28rem 0.55rem",
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                  <button
                    onClick={removePDF}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(200, 90, 70, 0.3)",
                      color: "rgba(200, 110, 90, 0.65)",
                      fontSize: "0.43rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-inter), sans-serif",
                      padding: "0.28rem 0.55rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Replace */}
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(175, 158, 128, 0.38)",
                    fontSize: "0.4rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-inter), sans-serif",
                    cursor: "pointer",
                    padding: "0.15rem",
                  }}
                >
                  Replace
                </button>
              </>
            ) : (
              /* No PDF — upload zone */
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = "rgba(242, 196, 109, 0.5)";
                  el.style.background = "rgba(242, 196, 109, 0.04)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = "rgba(200, 160, 96, 0.22)";
                  el.style.background = "transparent";
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.55rem",
                  background: "transparent",
                  border: "1px dashed rgba(200, 160, 96, 0.22)",
                  padding: "0.9rem 0.7rem",
                  cursor: "pointer",
                  width: "100%",
                  transition: "border-color 0.25s, background 0.25s",
                }}
              >
                {/* Folder icon */}
                <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
                  <path
                    d="M2 5a2 2 0 012-2h4l2 2h10a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"
                    stroke="rgba(200,160,96,0.58)"
                    strokeWidth="1"
                    fill="rgba(200,160,96,0.05)"
                  />
                </svg>
                <span
                  style={{
                    fontSize: "0.43rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(200, 160, 96, 0.62)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  Attach PDF
                </span>
              </button>
            )}
          </div>

          {/* Ticker ghost label at bottom */}
          {slot.ticker && (
            <span
              style={{
                position: "absolute",
                bottom: "0.7rem",
                fontFamily:
                  'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
                fontSize: "clamp(0.65rem, 1.3vw, 0.9rem)",
                fontStyle: "italic",
                color: "rgba(242, 228, 195, 0.28)",
                letterSpacing: "0.06em",
                pointerEvents: "none",
              }}
            >
              {slot.ticker}
            </span>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePDFUpload}
            style={{ display: "none" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
