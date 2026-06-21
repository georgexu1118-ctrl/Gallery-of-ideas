"use client";

import { useState, useRef, useEffect } from "react";
import { saveFile, getFile, deleteFile } from "@/lib/pdfStore";

// ── Types ──────────────────────────────────────────────────────────────

interface PlayImage {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  rotation: number;
  addedAt: number;
}

const STORAGE_KEY = "gallery-plays-v2";
const DEFAULT_H = 480;
const MIN_H = 260;

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Polaroid image card ────────────────────────────────────────────────

function ImageCard({
  img,
  zIndex,
  onDragStart,
  onResizeStart,
  onRemove,
  onFocus,
}: {
  img: PlayImage;
  zIndex: number;
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  onRemove: () => void;
  onFocus: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let alive = true;
    getFile(`play-${img.id}`).then((data) => {
      if (!data || !alive) return;
      const blob = new Blob([data.buffer], { type: data.type || "image/png" });
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setSrc(url);
    });
    return () => {
      alive = false;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [img.id]);

  if (!src) return null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => { onFocus(); onDragStart(e); }}
      style={{
        position: "absolute",
        left: img.x,
        top: img.y,
        width: img.w,
        zIndex,
        transform: `rotate(${img.rotation}deg)`,
        transformOrigin: "center center",
        cursor: "grab",
        userSelect: "none",
        // Polaroid frame
        background: "#f4f1ea",
        padding: "7px 7px 30px",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.7), 0 4px 14px rgba(0,0,0,0.4)"
          : "0 6px 22px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.18s",
      }}
    >
      {/* Photo */}
      <img
        src={src}
        alt={img.name}
        draggable={false}
        style={{ width: "100%", display: "block", pointerEvents: "none",
          userSelect: "none", minHeight: "60px", background: "#e8e5dc" }}
      />

      {/* Polaroid label */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
        height: "30px", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "0 6px" }}>
        <span style={{ fontSize: "0.38rem", letterSpacing: "0.1em",
          color: "rgba(70,60,45,0.5)", fontFamily: "var(--font-inter),sans-serif",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {img.name.replace(/\.[^.]+$/, "")}
        </span>
      </div>

      {/* Remove ×  */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        style={{
          position: "absolute", top: "-9px", right: "-9px",
          width: "19px", height: "19px", borderRadius: "50%",
          background: "#1e202a", border: "1px solid rgba(200,160,96,0.35)",
          color: "rgba(220,180,100,0.85)", fontSize: "0.65rem", lineHeight: 1,
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.18s",
          zIndex: 10,
        }}>
        ×
      </button>

      {/* Resize grip */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e); }}
        style={{
          position: "absolute", bottom: "5px", right: "4px",
          width: "14px", height: "14px", cursor: "nwse-resize",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 0.55 : 0, transition: "opacity 0.18s", zIndex: 10,
        }}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <line x1="2" y1="8" x2="8" y2="2" stroke="rgba(70,60,45,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="5" y1="8" x2="8" y2="5" stroke="rgba(70,60,45,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── Corner screw decoration ────────────────────────────────────────────

function Screw({ style }: { style: React.CSSProperties }) {
  return (
    <div aria-hidden style={{
      position: "absolute", width: "9px", height: "9px", borderRadius: "50%",
      background: "radial-gradient(circle at 38% 38%, #4e5060, #282a34)",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)",
      ...style,
    }}>
      {/* Cross slot */}
      <div style={{ position: "absolute", inset: "3px", background: "rgba(0,0,0,0.3)",
        clipPath: "polygon(45% 0%,55% 0%,55% 45%,100% 45%,100% 55%,55% 55%,55% 100%,45% 100%,45% 55%,0% 55%,0% 45%,45% 45%)" }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────

export default function PreviousPlays() {
  const [images, setImages]       = useState<PlayImage[]>([]);
  const [tableHeight, setTableHeight] = useState(DEFAULT_H);
  const [order, setOrder]         = useState<string[]>([]); // z-order (last = top)
  const [mounted, setMounted]     = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const fileRef  = useRef<HTMLInputElement>(null);

  // ── Persist ──────────────────────────────────────────────────────

  function persist(imgs: PlayImage[], h: number, ord: string[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ images: imgs, tableHeight: h, order: ord }));
    } catch {}
  }

  // ── Load ─────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setImages(p.images ?? []);
        setTableHeight(p.tableHeight ?? DEFAULT_H);
        setOrder(p.order ?? (p.images ?? []).map((i: PlayImage) => i.id));
      }
    } catch {}
    setMounted(true);
  }, []);

  // ── Upload ───────────────────────────────────────────────────────

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const id = makeId();
    try {
      await saveFile(`play-${id}`, file);
      const img: PlayImage = {
        id, name: file.name,
        x: Math.max(10, Math.random() * 200),
        y: Math.max(10, Math.random() * 120),
        w: 170,
        rotation: (Math.random() - 0.5) * 6,
        addedAt: Date.now(),
      };
      const nextImgs = [...images, img];
      const nextOrd  = [...order, id];
      setImages(nextImgs);
      setOrder(nextOrd);
      persist(nextImgs, tableHeight, nextOrd);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    e.target.value = "";
  }

  // ── Bring to front ───────────────────────────────────────────────

  function bringToFront(id: string) {
    setOrder((prev) => {
      const next = [...prev.filter((i) => i !== id), id];
      persist(images, tableHeight, next);
      return next;
    });
  }

  // ── Drag image ───────────────────────────────────────────────────

  function startDrag(e: React.MouseEvent, img: PlayImage) {
    if (e.button !== 0) return;
    e.preventDefault();
    const tbl = tableRef.current;
    if (!tbl) return;
    const tRect = tbl.getBoundingClientRect();
    const offsetX = e.clientX - tRect.left - img.x;
    const offsetY = e.clientY - tRect.top  - img.y;

    function onMove(ev: MouseEvent) {
      if (!tableRef.current) return;
      const r = tableRef.current.getBoundingClientRect();
      const x = Math.max(0, ev.clientX - r.left - offsetX);
      const y = Math.max(0, ev.clientY - r.top  - offsetY);
      setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, x, y } : i));
    }
    function onUp() {
      setImages((prev) => { persist(prev, tableHeight, order); return prev; });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // ── Resize image ─────────────────────────────────────────────────

  function startImgResize(e: React.MouseEvent, img: PlayImage) {
    e.preventDefault();
    const startX = e.clientX;
    const startW = img.w;
    function onMove(ev: MouseEvent) {
      const w = Math.max(80, startW + ev.clientX - startX);
      setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, w } : i));
    }
    function onUp() {
      setImages((prev) => { persist(prev, tableHeight, order); return prev; });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // ── Resize table ─────────────────────────────────────────────────

  function startTableResize(e: React.MouseEvent) {
    e.preventDefault();
    const startY = e.clientY;
    const startH = tableHeight;
    function onMove(ev: MouseEvent) {
      const h = Math.max(MIN_H, startH + ev.clientY - startY);
      setTableHeight(h);
    }
    function onUp() {
      setTableHeight((h) => { persist(images, h, order); return h; });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // ── Remove ───────────────────────────────────────────────────────

  async function removeImage(id: string) {
    try { await deleteFile(`play-${id}`); } catch {}
    const nextImgs = images.filter((i) => i.id !== id);
    const nextOrd  = order.filter((i) => i !== id);
    setImages(nextImgs);
    setOrder(nextOrd);
    persist(nextImgs, tableHeight, nextOrd);
  }

  if (!mounted) return null;

  // z-index by order array position
  const zMap = Object.fromEntries(order.map((id, i) => [id, i + 1]));

  return (
    <section style={{ maxWidth: "1400px", margin: "0 auto",
      padding: "0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,7rem)" }}>

      {/* Label */}
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.46em", textTransform: "uppercase",
        color: "rgba(242,196,109,1)", fontFamily: "var(--font-inter),sans-serif",
        marginBottom: "1rem" }}>
        Previous Plays
      </p>

      {/* Heading */}
      <h2 style={{ fontFamily: 'var(--font-cormorant),"Cormorant Garamond",Georgia,serif',
        fontSize: "clamp(2.2rem,4.5vw,3.8rem)", fontWeight: 300, fontStyle: "italic",
        lineHeight: 1, color: "rgba(255,242,214,0.98)",
        marginBottom: "clamp(1.5rem,3vw,2.2rem)" }}>
        Trade History
      </h2>

      {/* Rule */}
      <div style={{ height: "1px", marginBottom: "clamp(1.5rem,3vw,2.5rem)",
        background: "linear-gradient(90deg,rgba(200,160,96,0.38) 0%,rgba(200,160,96,0.1) 60%,transparent 100%)" }} />

      {/* ── Table wrapper ─────────────────────────────────────── */}
      <div>
        {/* Top steel rail */}
        <div style={{
          height: "4px",
          background: "linear-gradient(90deg, #2c2f3c 0%, #4a4d5e 20%, #5c5f72 50%, #4a4d5e 80%, #2a2d38 100%)",
          borderRadius: "3px 3px 0 0",
          boxShadow: "0 1px 0 rgba(255,255,255,0.07), 0 2px 6px rgba(0,0,0,0.4)",
        }} />

        {/* Left edge */}
        <div style={{ display: "flex" }}>
          <div style={{ width: "5px", flexShrink: 0,
            background: "linear-gradient(180deg, #3e4152 0%, #2a2d38 100%)",
            boxShadow: "inset -1px 0 0 rgba(0,0,0,0.3), 1px 0 0 rgba(255,255,255,0.04)" }} />

          {/* Table surface */}
          <div
            ref={tableRef}
            style={{
              flex: 1,
              position: "relative",
              height: tableHeight,
              overflow: "hidden",
              cursor: "default",
              // Brushed dark steel
              background: `
                linear-gradient(180deg,
                  #222530 0%,
                  #1c1e2a 30%,
                  #1a1c28 70%,
                  #1e2030 100%)
              `,
              // Horizontal brushed lines
              backgroundImage: `
                repeating-linear-gradient(
                  180deg,
                  rgba(255,255,255,0.014) 0px,
                  rgba(255,255,255,0.014) 1px,
                  transparent 1px,
                  transparent 4px
                )
              `,
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.055),
                inset 0 -1px 0 rgba(0,0,0,0.55)
              `,
            }}
          >
            {/* Corner screws */}
            <Screw style={{ top: 10, left: 10 }} />
            <Screw style={{ top: 10, right: 10 }} />
            <Screw style={{ bottom: 10, left: 10 }} />
            <Screw style={{ bottom: 10, right: 10 }} />

            {/* Empty state */}
            {images.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "0.9rem", pointerEvents: "none" }}>
                {/* Placeholder polaroid outlines */}
                {[[-18, -10, 2], [10, 8, -3], [-6, 24, 1]].map(([dx, dy, rot], i) => (
                  <div key={i} aria-hidden style={{
                    position: "absolute",
                    width: 70 + i * 10, height: 60 + i * 8,
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transform: `translate(${dx * 2}px, ${dy * 2}px) rotate(${rot}deg)`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }} />
                ))}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="2" width="28" height="28" rx="2"
                    stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <circle cx="10" cy="11" r="3" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <path d="M2 20l8-7 6 5 4-4 10 9"
                    stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: "0.44rem", letterSpacing: "0.3em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.16)",
                  fontFamily: "var(--font-inter),sans-serif" }}>
                  Add screenshots
                </span>
              </div>
            )}

            {/* Images */}
            {images.map((img) => (
              <ImageCard
                key={img.id}
                img={img}
                zIndex={zMap[img.id] ?? 1}
                onDragStart={(e) => startDrag(e, img)}
                onResizeStart={(e) => startImgResize(e, img)}
                onRemove={() => removeImage(img.id)}
                onFocus={() => bringToFront(img.id)}
              />
            ))}

            {/* Add button */}
            <button
              onClick={() => fileRef.current?.click()}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(200,160,96,0.16)";
                el.style.borderColor = "rgba(242,196,109,0.5)";
                el.style.color = "rgba(242,196,109,0.9)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(30,32,40,0.85)";
                el.style.borderColor = "rgba(200,160,96,0.22)";
                el.style.color = "rgba(200,160,96,0.58)";
              }}
              style={{
                position: "absolute", bottom: 14, right: 16, zIndex: 50,
                display: "flex", alignItems: "center", gap: "0.35rem",
                background: "rgba(30,32,40,0.85)",
                border: "1px solid rgba(200,160,96,0.22)",
                color: "rgba(200,160,96,0.58)", fontSize: "0.42rem",
                letterSpacing: "0.28em", textTransform: "uppercase",
                fontFamily: "var(--font-inter),sans-serif",
                padding: "0.38rem 0.75rem", cursor: "pointer",
                transition: "all 0.2s", backdropFilter: "blur(4px)",
              }}>
              <span style={{ fontSize: "0.75rem", lineHeight: 0.9 }}>+</span>
              Add Screenshot
            </button>
          </div>

          {/* Right edge */}
          <div style={{ width: "5px", flexShrink: 0,
            background: "linear-gradient(180deg, #3e4152 0%, #2a2d38 100%)",
            boxShadow: "inset 1px 0 0 rgba(0,0,0,0.3), -1px 0 0 rgba(255,255,255,0.04)" }} />
        </div>

        {/* Bottom steel rail */}
        <div style={{
          height: "8px",
          background: "linear-gradient(180deg, #2e3140 0%, #22242e 60%, #1a1c24 100%)",
          borderRadius: "0 0 3px 3px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3), 0 -1px 0 rgba(255,255,255,0.04)",
        }} />

        {/* Resize handle */}
        <div
          onMouseDown={startTableResize}
          title="Drag to resize"
          style={{ height: "22px", cursor: "ns-resize",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "3px", userSelect: "none", marginTop: "3px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ width: "22px", height: "1.5px",
              borderRadius: "1px", background: "rgba(200,160,96,0.18)" }} />
          ))}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*"
        onChange={handleUpload} style={{ display: "none" }} />
    </section>
  );
}
