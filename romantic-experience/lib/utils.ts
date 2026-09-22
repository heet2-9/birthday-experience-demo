import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FlowerCatalogItem, PlacedBloom3D, StemPathData, BouquetCompositionResult, WrapStyle } from "@/types/bouquetEngine";
import { BouquetState } from "@/types/bouquet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Deterministic pseudo-random helper
function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function generateRealisticBouquetLayout(
  counts: BouquetState,
  catalog: FlowerCatalogItem[],
  wrapStyle?: WrapStyle
): BouquetCompositionResult {
  const rawList: { item: FlowerCatalogItem; instanceIdx: number }[] = [];

  // Expand selected quantities without altering any flower assets or attributes
  Object.entries(counts).forEach(([id, qty]) => {
    const item = catalog.find((f) => f.id === id);
    if (item) {
      for (let i = 0; i < qty; i++) {
        rawList.push({ item, instanceIdx: i });
      }
    }
  });

  const totalCount = rawList.length;

  if (totalCount === 0) {
    return {
      blooms: [],
      stems: [],
      boundingWidth: 380,
      boundingHeight: 520,
      tiePointY: 135,
      autoGreeneryCount: 0,
      autoBabysBreathCount: 0,
    };
  }

  // 1. Sort flowers: Hero & Large first for central focal placement
  const tierOrder: Record<string, number> = { hero: 1, large: 2, medium: 3, small: 4, filler: 5, greenery: 6 };
  rawList.sort((a, b) => (tierOrder[a.item.tier] || 5) - (tierOrder[b.item.tier] || 5));

  const tiePointY = 135; // Central ribbon knot Y coordinate
  const initialBlooms: PlacedBloom3D[] = [];

  // 2. Compact Front-Wrapper Dome Distribution (Lowered y = 28 so bouquet sits comfortably inside wrapper throat)
  const maxRadiusX = Math.min(60, 26 + Math.sqrt(totalCount) * 7.5);
  const maxRadiusY = Math.min(44, 20 + Math.sqrt(totalCount) * 5.5);

  rawList.forEach((entry, idx) => {
    const { item, instanceIdx } = entry;
    const isHero = item.tier === 'hero' || item.tier === 'large';
    const isSmall = item.tier === 'small' || item.tier === 'filler';

    let x = 0;
    // Lowered flower cluster baseline (y = 28) so lower blooms nestle comfortably inside the wrapper opening
    let y = 28;
    let z = 50;
    let scale = isHero ? 0.68 : isSmall ? 0.58 : 0.63;

    if (idx === 0) {
      // Hero Central Focal Bloom
      x = 0;
      y = 28;
      z = 60;
      scale = 0.72;
    } else if (idx <= 4) {
      // Ring 1: Inner Focal Arc around center
      const angle = ((idx - 1) / 4) * Math.PI * 2 - Math.PI / 2;
      const rx = maxRadiusX * 0.48;
      const ry = maxRadiusY * 0.48;
      x = rx * Math.cos(angle);
      y = 28 + ry * Math.sin(angle);
      z = 50 + (idx % 2) * 4;
    } else if (idx <= 9) {
      // Ring 2: Middle Dome Layer
      const ringIdx = idx - 5;
      const angle = (ringIdx / 5) * Math.PI * 2 - Math.PI * 0.75;
      const rx = maxRadiusX * 0.82;
      const ry = maxRadiusY * 0.82;
      x = rx * Math.cos(angle);
      y = 32 + ry * Math.sin(angle);
      z = 40 + (ringIdx % 3) * 4;
    } else {
      // Ring 3: Outer Compact Perimeter (Lower greenery & stem bases sit deep inside wrapper throat)
      const overflowIdx = idx - 10;
      const goldenAngle = 137.5 * (Math.PI / 180);
      const theta = overflowIdx * goldenAngle;
      const rRatio = Math.min(1.0, 0.85 + overflowIdx * 0.035);
      x = maxRadiusX * rRatio * Math.cos(theta);
      y = 38 + maxRadiusY * rRatio * Math.sin(theta);
      z = 30 + (overflowIdx % 4) * 3;
    }

    // Micro organic jitter for handcrafted feel
    const pseudoRandom = Math.sin(idx * 777 + instanceIdx * 333);
    const jitterX = (seeded(idx * 31 + instanceIdx * 7) - 0.5) * 4;
    const jitterY = (seeded(idx * 43 + instanceIdx * 13) - 0.5) * 3;
    const rotationDeg = (x / maxRadiusX) * 12 + pseudoRandom * 5;

    x += jitterX;
    y += jitterY;

    initialBlooms.push({
      instanceId: `${item.id}-${instanceIdx}`,
      flowerId: item.id,
      name: item.name,
      imageSrc: item.imageSrc,
      tier: item.tier,
      x: Math.round(x),
      y: Math.round(y),
      z: Math.round(z),
      rotationDeg: Number(rotationDeg.toFixed(1)),
      tiltDeg: Number((x / 25).toFixed(1)),
      scale: Number(scale.toFixed(2)),
      opacity: 1,
      radiusPx: Math.max(20, item.realDiameterMm * 0.24),
      stemControlX: x * 0.3,
      stemThickness: Math.max(2, (item.stemThicknessPx || 4) * 0.65),
      stemColor: idx % 2 === 0 ? '#1b431c' : '#235225',
    });
  });

  // 3. Solve Collisions to allow natural organic petal overlaps
  const resolvedBlooms = solveFlowerCollisions(initialBlooms);

  // 4. Generate Stem Bezier Curves Converging to Ribbon Knot inside Core
  const stems: StemPathData[] = resolvedBlooms.map((bloom) => {
    const startX = bloom.x;
    const startY = bloom.y + 12; // Starts inside the core at flower base
    const endX = bloom.x * 0.03; // Converges tightly at ribbon knot
    const endY = tiePointY + 65;

    const controlX = bloom.x * 0.35;
    const controlY = (startY + tiePointY) * 0.5;

    return {
      id: `stem-${bloom.instanceId}`,
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      thickness: bloom.stemThickness,
      color: bloom.stemColor,
      zIndex: bloom.z - 10,
    };
  });

  return {
    blooms: resolvedBlooms,
    stems,
    boundingWidth: 380,
    boundingHeight: 520,
    tiePointY,
    autoGreeneryCount: Math.max(5, Math.floor(totalCount * 0.7)),
    autoBabysBreathCount: Math.max(5, Math.floor(totalCount * 0.7)),
  };
}

/**
 * Force-field collision solver allowing natural organic petal overlaps
 */
function solveFlowerCollisions(blooms: PlacedBloom3D[]): PlacedBloom3D[] {
  const result = blooms.map((b) => ({ ...b }));
  const iterations = 6;

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const b1 = result[i];
        const b2 = result[j];

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = (b1.radiusPx + b2.radiusPx) * 0.54;

        if (dist < minDist) {
          const overlap = (minDist - dist) * 0.35;
          const nx = dx / dist;
          const ny = dy / dist;

          b1.x -= nx * overlap;
          b1.y -= ny * overlap;
          b2.x += nx * overlap;
          b2.y += ny * overlap;
        }
      }
    }
  }

  // Sort by Z index so back blooms render behind front blooms
  return result.sort((a, b) => a.z - b.z);
}