"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Thesis } from "@/lib/theses";

const card: Variants = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const overlay: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.35 } },
};

const accentLine: Variants = {
  rest: { scaleX: 0.28, originX: 0 },
  hover: { scaleX: 1, originX: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const viewLink: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3, delay: 0.05 } },
};

interface ExhibitCardProps {
  thesis: Thesis;
  index?: number;
}

export default function ExhibitCard({ thesis, index = 0 }: ExhibitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.2 + index * 0.09,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/gallery/${thesis.slug}`} className="block h-full">
        <motion.article
          className="relative h-full flex flex-col cursor-pointer overflow-hidden"
          variants={card}
          initial="rest"
          whileHover="hover"
          style={{
            background: "#181920",
            padding: "clamp(2rem, 4vw, 3rem)",
            border: "1px solid rgba(242, 196, 109, 0.2)",
          }}
        >
          {/* Ambient hover glow */}
          <motion.div
            variants={overlay}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(242, 196, 109, 0.12) 0%, transparent 70%)",
              boxShadow: "inset 0 0 0 1px rgba(242, 196, 109, 0.36)",
            }}
          />

          {/* Top accent line */}
          <motion.div
            variants={accentLine}
            className="relative z-10 mb-8"
            style={{
              height: "1px",
              background: "rgba(242, 196, 109, 0.82)",
            }}
          />

          {/* Category */}
          {thesis.category && (
            <p
              className="relative z-10"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "rgba(242, 196, 109, 0.92)",
                fontFamily: "var(--font-inter), sans-serif",
                marginBottom: "0.875rem",
              }}
            >
              {thesis.category}
            </p>
          )}

          {/* Title */}
          <h2
            className="relative z-10"
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(1.5rem, 2.3vw, 2.05rem)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.22,
              color: "rgba(255, 242, 214, 0.98)",
              marginBottom: "0.6rem",
            }}
          >
            {thesis.title}
          </h2>

          {/* Date */}
          <p
            className="relative z-10"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              color: "rgba(205, 185, 145, 0.78)",
              fontFamily: "var(--font-inter), sans-serif",
              marginBottom: "1.5rem",
            }}
          >
            {thesis.dateFormatted}
          </p>

          {/* Excerpt */}
          <p
            className="relative z-10 flex-grow"
            style={{
              fontFamily: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
              fontSize: "1rem",
              fontStyle: "italic",
              lineHeight: 1.75,
              color: "rgba(221, 205, 171, 0.9)",
            }}
          >
            &ldquo;{thesis.excerpt}&rdquo;
          </p>

          {/* View Exhibit — appears on hover */}
          <motion.div
            variants={viewLink}
            className="relative z-10 flex items-center gap-2 mt-8"
          >
            <span
              style={{
                fontSize: "0.58rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(242, 196, 109, 0.96)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              View Exhibit
            </span>
            <svg
              width="13"
              height="7"
              viewBox="0 0 13 7"
              fill="none"
              style={{ color: "rgba(242, 196, 109, 0.96)" }}
            >
              <path d="M0 3.5H11M8.5 1L11 3.5L8.5 6" stroke="currentColor" strokeWidth="0.7" />
            </svg>
          </motion.div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
