"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { PaintingSlot, DocumentItem } from "@/lib/stockRoom";
import { makeDocId } from "@/lib/stockRoom";
import { saveFile, getFile, deleteFile } from "@/lib/pdfStore";

interface Props {
  slot: PaintingSlot;
  index: number;
  region: string;
  onSave: (updated: PaintingSlot) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────

function fileKey(region: string, slotId: number, docId: string) {
  return `${region}-${slotId}-${docId}`;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function sourceLabel(doc: DocumentItem): string {
  if (doc.type === "file") {
    const ext = doc.name.split(".").pop()?.toUpperCase();
    return ext ?? "File";
  }
  const url = doc.url ?? "";
  if (/docs\.google\.com/.test(url)) return "Docs";
  if (/drive\.google\.com/.test(url)) return "Drive";
  if (/sheets\.google\.com/.test(url)) return "Sheets";
  if (/notion\.so/.test(url)) return "Notion";
  if (/figma\.com/.test(url)) return "Figma";
  return "Link";
}

function isValidUrl(s: string) {
  try { new URL(s); return true; } catch { return false; }
}

// ── Doc type icon ──────────────────────────────────────────────────────

function DocIcon({ doc }: { doc: DocumentItem }) {
  if (doc.type === "file") {
    return (
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
        <path d="M1.5 0h5.5l3 3v9a.5.5 0 01-.5.5h-8A.5.5 0 011 12V.5A.5.5 0 011.5 0z"
          fill="rgba(200,160,96,0.08)" stroke="rgba(200,160,96,0.5)" strokeWidth="0.7" />
        <path d="M7 0v3h3" stroke="rgba(200,160,96,0.4)" strokeWidth="0.7" />
      </svg>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <rect x="0.5" y="0.5" width="10" height="10" rx="1.5"
        fill="rgba(130,180,240,0.06)" stroke="rgba(130,180,240,0.45)" strokeWidth="0.7" />
      <path d="M3.5 5.5h4M5.5 3.5v4" stroke="rgba(130,180,240,0.5)" strokeWidth="0.7"
        strokeLinecap="round" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────

export default function PaintingSlotComp({ slot, index, region, onSave }: Props) {
  const [editing, setEditing]   = useState(false);
  const [flipped, setFlipped]   = useState(false);
  const [ticker, setTicker]     = useState(slot.ticker);
  const [companyName, setCompanyName] = useState(slot.name);

  // back-face form state
  const [adding, setAdding]     = useState(false);
  const [addMode, setAddMode]   = useState<"file" | "link">("link");
  const [linkUrl, setLinkUrl]   = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [urlError, setUrlError] = useState(false);

  const tickerRef  = useRef<HTMLInputElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);
  const urlRef     = useRef<HTMLInputElement>(null);

  const docs: DocumentItem[] = slot.documents ?? [];
  const isEmpty = !slot.ticker;

  useEffect(() => {
    setTicker(slot.ticker);
    setCompanyName(slot.name);
  }, [slot.ticker, slot.name]);

  // Reset add form when flipping back
  useEffect(() => {
    if (!flipped) {
      setAdding(false);
      setLinkUrl("");
      setLinkLabel("");
      setUrlError(false);
    }
  }, [flipped]);

  // Focus URL input when switching to add-link mode
  useEffect(() => {
    if (adding && addMode === "link") {
      setTimeout(() => urlRef.current?.focus(), 30);
    }
  }, [adding, addMode]);

  // ── Front face actions ───────────────────────────────────────────────

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
    onSave({ ...slot, ticker: ticker.trim().toUpperCase(), name: companyName.trim() });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
  }

  // ── Back face actions ────────────────────────────────────────────────

  function addDoc(doc: DocumentItem) {
    onSave({ ...slot, documents: [...docs, doc] });
    setAdding(false);
    setLinkUrl("");
    setLinkLabel("");
  }

  function removeDoc(docId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const doc = docs.find((d) => d.id === docId);
    if (doc?.type === "file") {
      deleteFile(fileKey(region, slot.id, docId)).catch(() => {});
    }
    onSave({ ...slot, documents: docs.filter((d) => d.id !== docId) });
  }

  async function openDoc(doc: DocumentItem, e: React.MouseEvent) {
    e.stopPropagation();
    if (doc.type === "link" && doc.url) {
      window.open(doc.url, "_blank", "noopener");
      return;
    }
    try {
      const data = await getFile(fileKey(region, slot.id, doc.id));
      if (!data) return;
      const blob = new Blob([data.buffer], { type: data.type || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error("Open file failed:", err);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = makeDocId();
    try {
      await saveFile(fileKey(region, slot.id, id), file);
      addDoc({ id, type: "file", name: file.name, fileSize: file.size, addedAt: Date.now() });
    } catch (err) {
      console.error("File save failed:", err);
    }
    e.target.value = "";
  }

  function handleAddLink(e: React.MouseEvent) {
    e.stopPropagation();
    const raw = linkUrl.trim();
    const full = raw.startsWith("http") ? raw : `https://${raw}`;
    if (!isValidUrl(full)) { setUrlError(true); return; }
    setUrlError(false);
    const name = linkLabel.trim() || new URL(full).hostname.replace("www.", "");
    addDoc({ id: makeDocId(), type: "link", name, url: full, addedAt: Date.now() });
  }

  // ── Frame styles ─────────────────────────────────────────────────────

  const frameShadow = `
    0 0 0 1.5px rgba(175,135,58,0.6),
    0 0 0 5px rgba(6,7,11,1),
    0 0 0 8px rgba(155,115,45,0.45),
    0 0 0 10.5px rgba(120,88,28,0.28),
    0 28px 50px rgba(0,0,0,0.65),
    0 8px 18px rgba(0,0,0,0.45)
  `;

  const inputBase: React.CSSProperties = {
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "var(--font-inter), sans-serif",
    color: "rgba(242,228,195,0.88)",
    width: "100%",
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.045, duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      onClick={!editing ? handleCardClick : undefined}
      whileHover={!editing && !flipped ? { y: -3, transition: { duration: 0.25 } } : {}}
      style={{ position: "relative", aspectRatio: "3/4", cursor: editing ? "default" : "pointer",
        boxShadow: frameShadow, perspective: "1000px" }}
    >
      {/* ── Flip container ───────────────────────────────────────── */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}
      >

        {/* ══ FRONT FACE ══════════════════════════════════════════ */}
        <div style={{
          position: "absolute", inset: 0, background: "#07080c",
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
        } as React.CSSProperties}>

          {/* Slot number */}
          <span style={{ position: "absolute", top: "0.6rem", left: "0.7rem",
            fontSize: "0.46rem", letterSpacing: "0.28em", color: "rgba(200,160,96,0.52)",
            fontFamily: "var(--font-inter), sans-serif", pointerEvents: "none" }}>
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Doc count badge */}
          {docs.length > 0 && !editing && (
            <span style={{ position: "absolute", top: "0.55rem", right: "0.65rem",
              minWidth: "14px", height: "14px", borderRadius: "7px",
              background: "rgba(200,160,96,0.14)", border: "1px solid rgba(200,160,96,0.32)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.38rem", letterSpacing: "0.06em", color: "rgba(242,196,109,0.8)",
              fontFamily: "var(--font-inter), sans-serif", pointerEvents: "none",
              padding: "0 3px" }}>
              {docs.length}
            </span>
          )}

          {/* Edit mode */}
          {editing ? (
            <div
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) commit(); }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", padding: "1.5rem", gap: "1rem" }}>
              <input ref={tickerRef} value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                onKeyDown={handleKey} placeholder="TICKER" maxLength={10}
                style={{ ...inputBase, borderBottom: "1px solid rgba(200,160,96,0.4)",
                  textAlign: "center",
                  fontFamily: 'var(--font-cormorant),"Cormorant Garamond",Georgia,serif',
                  fontSize: "clamp(1.5rem,2.8vw,2.1rem)", fontStyle: "italic",
                  color: "rgba(242,228,195,0.97)", letterSpacing: "0.08em",
                  paddingBottom: "0.35rem" }} />
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={handleKey} placeholder="Company name"
                style={{ ...inputBase, borderBottom: "1px solid rgba(200,160,96,0.15)",
                  textAlign: "center", fontSize: "0.58rem", letterSpacing: "0.2em",
                  color: "rgba(175,158,128,0.72)", paddingBottom: "0.25rem" }} />
              <p style={{ fontSize: "0.44rem", letterSpacing: "0.28em",
                color: "rgba(140,125,95,0.38)", fontFamily: "var(--font-inter),sans-serif",
                textTransform: "uppercase", textAlign: "center" }}>
                Enter to save
              </p>
            </div>

          ) : isEmpty ? (
            /* Empty frame */
            <motion.div initial={{ opacity: 0.28 }} whileHover={{ opacity: 0.7 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => { e.stopPropagation(); startEdit(); }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1V17M1 9H17" stroke="rgba(200,160,96,0.9)" strokeWidth="0.75" />
              </svg>
              <span style={{ fontSize: "0.46rem", letterSpacing: "0.38em",
                textTransform: "uppercase", color: "rgba(200,160,96,0.85)",
                fontFamily: "var(--font-inter),sans-serif" }}>
                Add Ticker
              </span>
            </motion.div>

          ) : (
            /* Filled frame */
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "1.25rem", gap: "0.5rem" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse at 50% 48%,rgba(200,160,96,0.06) 0%,transparent 68%)" }} />
              <span style={{ position: "relative",
                fontFamily: 'var(--font-cormorant),"Cormorant Garamond",Georgia,serif',
                fontSize: "clamp(1.5rem,3vw,2.2rem)", fontStyle: "italic", fontWeight: 400,
                color: "rgba(242,228,195,0.97)", letterSpacing: "0.06em",
                lineHeight: 1, textAlign: "center" }}>
                {slot.ticker}
              </span>
              {slot.name && (
                <span style={{ position: "relative", fontSize: "0.52rem", letterSpacing: "0.2em",
                  color: "rgba(175,158,128,0.62)", fontFamily: "var(--font-inter),sans-serif",
                  textAlign: "center", lineHeight: 1.45 }}>
                  {slot.name}
                </span>
              )}
              <motion.span initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                onClick={(e) => startEdit(e)}
                style={{ position: "absolute", bottom: "0.7rem", fontSize: "0.42rem",
                  letterSpacing: "0.3em", color: "rgba(242,196,109,0.85)",
                  fontFamily: "var(--font-inter),sans-serif", textTransform: "uppercase",
                  cursor: "pointer", zIndex: 3 }}>
                Edit
              </motion.span>
            </div>
          )}
        </div>

        {/* ══ BACK FACE ═══════════════════════════════════════════ */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", inset: 0, background: "#06070b",
            backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex", flexDirection: "column",
            padding: "0.7rem 0.75rem 0.65rem",
            gap: 0, overflow: "hidden",
          } as React.CSSProperties}
        >
          {/* Ambient glow */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 30%,rgba(200,160,96,0.04) 0%,transparent 70%)" }} />

          {/* Grid texture */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `linear-gradient(rgba(200,160,96,0.025) 1px,transparent 1px),
              linear-gradient(90deg,rgba(200,160,96,0.025) 1px,transparent 1px)`,
            backgroundSize: "16px 16px" }} />

          {/* ── Header row ─────────────────────────────────────── */}
          <div style={{ position: "relative", zIndex: 2, display: "flex",
            alignItems: "center", justifyContent: "space-between",
            marginBottom: "0.45rem", flexShrink: 0 }}>
            <span style={{ fontSize: "0.44rem", letterSpacing: "0.28em",
              color: "rgba(200,160,96,0.48)", fontFamily: "var(--font-inter),sans-serif" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.44rem", letterSpacing: "0.36em",
              textTransform: "uppercase", color: "rgba(200,160,96,0.6)",
              fontFamily: "var(--font-inter),sans-serif" }}>
              Research
            </span>
            {/* Flip back */}
            <button onClick={(e) => { e.stopPropagation(); setFlipped(false); setAdding(false); }}
              title="Back"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
                color: "rgba(200,160,96,0.45)", fontSize: "0.55rem", lineHeight: 1,
                display: "flex", alignItems: "center" }}>
              ←
            </button>
          </div>

          {/* Thin gold rule */}
          <div style={{ height: "1px", flexShrink: 0, marginBottom: "0.4rem",
            background: "linear-gradient(90deg,rgba(200,160,96,0.22) 0%,rgba(200,160,96,0.06) 70%,transparent 100%)" }} />

          {/* ── Main area ──────────────────────────────────────── */}
          <div style={{ position: "relative", zIndex: 2, flex: 1,
            display: "flex", flexDirection: "column", minHeight: 0 }}>

            {!adding ? (
              <>
                {docs.length === 0 ? (
                  /* Empty folder */
                  <div style={{ flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                      <path d="M2 5a2 2 0 012-2h5l2 2h13a2 2 0 012 2v13a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"
                        stroke="rgba(200,160,96,0.35)" strokeWidth="1"
                        fill="rgba(200,160,96,0.04)" />
                    </svg>
                    <span style={{ fontSize: "0.42rem", letterSpacing: "0.28em",
                      textTransform: "uppercase", color: "rgba(200,160,96,0.38)",
                      fontFamily: "var(--font-inter),sans-serif", textAlign: "center" }}>
                      Empty folder
                    </span>
                  </div>
                ) : (
                  /* Document table */
                  <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                    {/* Column headers */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem",
                      paddingBottom: "0.3rem", marginBottom: "0.2rem",
                      borderBottom: "1px solid rgba(200,160,96,0.1)" }}>
                      <span style={{ flex: 1, fontSize: "0.38rem", letterSpacing: "0.28em",
                        textTransform: "uppercase", color: "rgba(200,160,96,0.32)",
                        fontFamily: "var(--font-inter),sans-serif" }}>
                        Document
                      </span>
                      <span style={{ width: "28px", textAlign: "right", fontSize: "0.38rem",
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "rgba(200,160,96,0.32)", fontFamily: "var(--font-inter),sans-serif" }}>
                        Type
                      </span>
                    </div>

                    {/* Rows */}
                    {docs.map((doc, di) => (
                      <div key={doc.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.35rem",
                          padding: "0.3rem 0",
                          borderBottom: di < docs.length - 1 ? "1px solid rgba(200,160,96,0.07)" : "none",
                          background: di % 2 === 0 ? "rgba(200,160,96,0.015)" : "transparent" }}>
                        {/* Icon */}
                        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                          <DocIcon doc={doc} />
                        </span>

                        {/* Name */}
                        <span style={{ flex: 1, fontSize: "0.41rem", letterSpacing: "0.06em",
                          color: "rgba(242,228,195,0.72)", fontFamily: "var(--font-inter),sans-serif",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          lineHeight: 1.3 }}>
                          {doc.name}
                          {doc.fileSize && (
                            <span style={{ display: "block", fontSize: "0.36rem",
                              color: "rgba(175,158,128,0.38)", letterSpacing: "0.1em" }}>
                              {fmtSize(doc.fileSize)}
                            </span>
                          )}
                        </span>

                        {/* Type badge */}
                        <span style={{ flexShrink: 0, fontSize: "0.36rem", letterSpacing: "0.1em",
                          color: doc.type === "link" ? "rgba(130,180,240,0.65)" : "rgba(200,160,96,0.6)",
                          fontFamily: "var(--font-inter),sans-serif", whiteSpace: "nowrap" }}>
                          {sourceLabel(doc)}
                        </span>

                        {/* Actions */}
                        <div style={{ flexShrink: 0, display: "flex", gap: "0.2rem" }}>
                          <button onClick={(e) => openDoc(doc, e)}
                            title="Open"
                            style={{ background: "none", border: "none", cursor: "pointer",
                              padding: "2px", color: "rgba(200,160,96,0.5)", fontSize: "0.52rem",
                              lineHeight: 1, display: "flex", alignItems: "center" }}>
                            ↗
                          </button>
                          <button onClick={(e) => removeDoc(doc.id, e)}
                            title="Remove"
                            style={{ background: "none", border: "none", cursor: "pointer",
                              padding: "2px", color: "rgba(200,100,80,0.45)", fontSize: "0.52rem",
                              lineHeight: 1, display: "flex", alignItems: "center" }}>
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setAdding(true); setAddMode("link"); }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(242,196,109,0.9)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(200,160,96,0.48)"; }}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0",
                    color: "rgba(200,160,96,0.48)", fontSize: "0.41rem", letterSpacing: "0.26em",
                    textTransform: "uppercase", fontFamily: "var(--font-inter),sans-serif",
                    marginTop: docs.length > 0 ? "0.3rem" : 0, flexShrink: 0, transition: "color 0.2s" }}>
                  <span style={{ fontSize: "0.7rem", lineHeight: 0.9 }}>+</span> Add Document
                </button>
              </>
            ) : (
              /* ── Add document form ─────────────────────────── */
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", flex: 1 }}>

                {/* Mode tabs */}
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {(["link", "file"] as const).map((m) => (
                    <button key={m}
                      onClick={(e) => { e.stopPropagation(); setAddMode(m); }}
                      style={{ flex: 1, background: addMode === m
                          ? "rgba(200,160,96,0.12)" : "transparent",
                        border: `1px solid ${addMode === m ? "rgba(200,160,96,0.35)" : "rgba(200,160,96,0.12)"}`,
                        color: addMode === m ? "rgba(242,196,109,0.88)" : "rgba(200,160,96,0.42)",
                        fontSize: "0.4rem", letterSpacing: "0.22em", textTransform: "uppercase",
                        fontFamily: "var(--font-inter),sans-serif",
                        padding: "0.28rem 0", cursor: "pointer", transition: "all 0.2s" }}>
                      {m === "link" ? "Link" : "File"}
                    </button>
                  ))}
                </div>

                {addMode === "link" ? (
                  <>
                    {/* URL input */}
                    <div style={{ borderBottom: `1px solid ${urlError ? "rgba(220,100,80,0.5)" : "rgba(200,160,96,0.25)"}`,
                      paddingBottom: "0.2rem" }}>
                      <input ref={urlRef} value={linkUrl}
                        onChange={(e) => { setLinkUrl(e.target.value); setUrlError(false); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddLink(e as unknown as React.MouseEvent); }}
                        placeholder="Paste URL…"
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...inputBase, fontSize: "0.41rem", letterSpacing: "0.05em",
                          color: urlError ? "rgba(220,120,100,0.88)" : "rgba(242,228,195,0.82)" }} />
                    </div>

                    {/* Label input */}
                    <div style={{ borderBottom: "1px solid rgba(200,160,96,0.13)",
                      paddingBottom: "0.2rem" }}>
                      <input value={linkLabel}
                        onChange={(e) => setLinkLabel(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddLink(e as unknown as React.MouseEvent); }}
                        placeholder="Label (optional)"
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...inputBase, fontSize: "0.4rem", letterSpacing: "0.08em",
                          color: "rgba(175,158,128,0.7)" }} />
                    </div>

                    {urlError && (
                      <span style={{ fontSize: "0.38rem", color: "rgba(220,120,100,0.7)",
                        fontFamily: "var(--font-inter),sans-serif", letterSpacing: "0.1em" }}>
                        Invalid URL
                      </span>
                    )}
                  </>
                ) : (
                  /* File mode */
                  <div style={{ flex: 1, display: "flex", alignItems: "center",
                    justifyContent: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "rgba(242,196,109,0.45)";
                        el.style.color = "rgba(242,196,109,0.85)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = "rgba(200,160,96,0.22)";
                        el.style.color = "rgba(200,160,96,0.55)";
                      }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center",
                        gap: "0.4rem", background: "transparent",
                        border: "1px dashed rgba(200,160,96,0.22)", padding: "0.7rem 0.9rem",
                        cursor: "pointer", color: "rgba(200,160,96,0.55)",
                        transition: "border-color 0.2s, color 0.2s", width: "100%" }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 1v10M5 5l4-4 4 4" stroke="currentColor" strokeWidth="1"
                          strokeLinecap="round" />
                        <path d="M2 13v3a1 1 0 001 1h12a1 1 0 001-1v-3"
                          stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: "0.41rem", letterSpacing: "0.24em",
                        textTransform: "uppercase", fontFamily: "var(--font-inter),sans-serif" }}>
                        Choose File
                      </span>
                    </button>
                  </div>
                )}

                {/* Action row */}
                <div style={{ display: "flex", gap: "0.3rem", marginTop: "auto", flexShrink: 0 }}>
                  {addMode === "link" && (
                    <button onClick={handleAddLink}
                      style={{ flex: 1, background: "rgba(200,160,96,0.1)",
                        border: "1px solid rgba(200,160,96,0.32)",
                        color: "rgba(242,196,109,0.88)", fontSize: "0.41rem",
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        fontFamily: "var(--font-inter),sans-serif",
                        padding: "0.32rem 0", cursor: "pointer" }}>
                      Add
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); setAdding(false); setUrlError(false); }}
                    style={{ flex: addMode === "link" ? 0 : 1, background: "transparent",
                      border: "1px solid rgba(200,160,96,0.15)",
                      color: "rgba(175,158,128,0.5)", fontSize: "0.41rem",
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      fontFamily: "var(--font-inter),sans-serif",
                      padding: "0.32rem 0.55rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ghost ticker */}
          {slot.ticker && (
            <div style={{ flexShrink: 0, textAlign: "center", marginTop: "0.3rem",
              pointerEvents: "none" }}>
              <span style={{
                fontFamily: 'var(--font-cormorant),"Cormorant Garamond",Georgia,serif',
                fontSize: "clamp(0.6rem,1.2vw,0.82rem)", fontStyle: "italic",
                color: "rgba(242,228,195,0.22)", letterSpacing: "0.06em" }}>
                {slot.ticker}
              </span>
            </div>
          )}

          {/* Hidden file input */}
          <input ref={fileRef} type="file"
            onChange={handleFileUpload} style={{ display: "none" }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
