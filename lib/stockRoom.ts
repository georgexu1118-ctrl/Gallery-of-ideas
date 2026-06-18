export type RegionKey = "us" | "eu" | "asia";

export interface PaintingSlot {
  id: number;
  ticker: string;
  name: string;
}

export const REGION_SLOT_COUNTS: Record<RegionKey, number> = {
  us:   15,
  eu:   10,
  asia: 10,
};

export const REGION_META: Record<RegionKey, { title: string; label: string; wallLabel: string }> = {
  us:   { title: "US",   label: "North America", wallLabel: "North American Equities" },
  eu:   { title: "EU",   label: "Europe",        wallLabel: "European Equities"       },
  asia: { title: "Asia", label: "Asia Pacific",  wallLabel: "Asia Pacific Equities"   },
};

function emptySlots(count: number): PaintingSlot[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    ticker: "",
    name: "",
  }));
}

export function getSlots(region: RegionKey): PaintingSlot[] {
  const count = REGION_SLOT_COUNTS[region];
  if (typeof window === "undefined") return emptySlots(count);
  try {
    const raw = localStorage.getItem(`gallery-wall-${region}`);
    if (!raw) return emptySlots(count);
    const saved: PaintingSlot[] = JSON.parse(raw);
    if (saved.length >= count) return saved;
    // Pad with empty slots to reach the target count, preserving saved data
    const extra = Array.from({ length: count - saved.length }, (_, i) => ({
      id: saved.length + i + 1,
      ticker: "",
      name: "",
    }));
    return [...saved, ...extra];
  } catch {
    return emptySlots(count);
  }
}

export function saveSlots(region: RegionKey, slots: PaintingSlot[]): void {
  try {
    localStorage.setItem(`gallery-wall-${region}`, JSON.stringify(slots));
  } catch {
    /* silently fail in SSR or private-mode */
  }
}
