export type RegionKey = "us" | "eu" | "asia";

export interface PaintingSlot {
  id: number;
  ticker: string;
  name: string;
}

export const SLOT_COUNT = 10;

export const REGION_META: Record<RegionKey, { title: string; label: string; wallLabel: string }> = {
  us:   { title: "US",   label: "North America", wallLabel: "North American Equities" },
  eu:   { title: "EU",   label: "Europe",        wallLabel: "European Equities"       },
  asia: { title: "Asia", label: "Asia Pacific",  wallLabel: "Asia Pacific Equities"   },
};

function emptySlots(): PaintingSlot[] {
  return Array.from({ length: SLOT_COUNT }, (_, i) => ({
    id: i + 1,
    ticker: "",
    name: "",
  }));
}

export function getSlots(region: RegionKey): PaintingSlot[] {
  if (typeof window === "undefined") return emptySlots();
  try {
    const raw = localStorage.getItem(`gallery-wall-${region}`);
    return raw ? JSON.parse(raw) : emptySlots();
  } catch {
    return emptySlots();
  }
}

export function saveSlots(region: RegionKey, slots: PaintingSlot[]): void {
  try {
    localStorage.setItem(`gallery-wall-${region}`, JSON.stringify(slots));
  } catch {
    /* silently fail in SSR or private-mode */
  }
}
