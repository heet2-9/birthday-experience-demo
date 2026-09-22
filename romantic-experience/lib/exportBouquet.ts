import { PlacedBloom3D, StemPathData } from "@/types/bouquetEngine";

interface FillerItem {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface ExportOptions {
  blooms: PlacedBloom3D[];
  stems: StemPathData[];
  fillers: {
    bb: FillerItem[];
    leaves: FillerItem[];
  };
  wrapperScale: number;
  wrapperSrc: string;
  filename?: string;
}

/**
 * Loads an image src into an HTMLImageElement asynchronously
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * High-Resolution Transparent PNG Exporter for Bespoke Bouquet
 */
export async function exportBouquetToPNG(options: ExportOptions): Promise<void> {
  const { blooms, stems, fillers, wrapperScale, wrapperSrc, filename = "emmas-bespoke-bouquet.png" } = options;

  if (!blooms || blooms.length === 0) {
    throw new Error("No flowers selected to download.");
  }

  // HD Export Multiplier (Base canvas 440x580 -> Export size 2200x2900 4K Crisp Alpha PNG)
  const EXPORT_SCALE = 5;
  const BASE_WIDTH = 440;
  const BASE_HEIGHT = 580;
  const canvasWidth = BASE_WIDTH * EXPORT_SCALE;
  const canvasHeight = BASE_HEIGHT * EXPORT_SCALE;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    throw new Error("Could not initialize 2D context for image export.");
  }

  // Clear canvas to ensure true transparent background with alpha channel
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const centerX = (BASE_WIDTH / 2) * EXPORT_SCALE;
  const centerY = (BASE_HEIGHT / 2) * EXPORT_SCALE;

  // 1. Preload all unique flower bloom images and the front wrapper image
  const uniqueSrcs = Array.from(new Set([...blooms.map((b) => b.imageSrc), wrapperSrc]));
  const imageMap = new Map<string, HTMLImageElement>();

  await Promise.all(
    uniqueSrcs.map(async (src) => {
      try {
        const img = await loadImage(src);
        imageMap.set(src, img);
      } catch (err) {
        console.warn(`Failed to preload image for export: ${src}`, err);
      }
    })
  );

  // ── LAYER 1: Stem System Bezier Curves ──────────────────────────
  ctx.save();
  stems.forEach((stem) => {
    const startX = centerX + stem.startX * EXPORT_SCALE;
    const startY = centerY + stem.startY * EXPORT_SCALE;
    const controlX = centerX + stem.controlX * EXPORT_SCALE;
    const controlY = centerY + stem.controlY * EXPORT_SCALE;
    const endX = centerX + stem.endX * EXPORT_SCALE;
    const endY = centerY + stem.endY * EXPORT_SCALE;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);

    ctx.strokeStyle = "#1b431c";
    ctx.lineWidth = Math.max(2, stem.thickness) * EXPORT_SCALE;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 6 * EXPORT_SCALE;
    ctx.shadowOffsetY = 2 * EXPORT_SCALE;
    ctx.stroke();
  });
  ctx.restore();

  // ── LAYER 2: Eucalyptus Leaf Accents ────────────────────────────
  fillers.leaves.forEach((leaf) => {
    ctx.save();
    const posX = centerX + leaf.x * EXPORT_SCALE;
    const posY = centerY + leaf.y * EXPORT_SCALE;
    ctx.translate(posX, posY);
    ctx.rotate((leaf.rotation * Math.PI) / 180);
    const s = leaf.scale * 0.55 * EXPORT_SCALE;
    ctx.scale(s, s);

    // Draw Eucalyptus Leaf SVG Path onto canvas
    ctx.beginPath();
    ctx.ellipse(0, 0, 7 * EXPORT_SCALE, 9 * EXPORT_SCALE, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(45, 106, 49, 0.85)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 18 * EXPORT_SCALE);
    ctx.lineTo(0, -9 * EXPORT_SCALE);
    ctx.strokeStyle = "rgba(27, 67, 28, 0.7)";
    ctx.lineWidth = 1 * EXPORT_SCALE;
    ctx.stroke();
    ctx.restore();
  });

  // ── LAYER 3: Baby's Breath Filler Clusters ──────────────────────
  fillers.bb.forEach((bb) => {
    ctx.save();
    const posX = centerX + bb.x * EXPORT_SCALE;
    const posY = centerY + bb.y * EXPORT_SCALE;
    ctx.translate(posX, posY);
    ctx.rotate((bb.rotation * Math.PI) / 180);
    const s = bb.scale * 0.58 * EXPORT_SCALE;

    // Stem lines
    ctx.beginPath();
    ctx.moveTo(0, 12 * s);
    ctx.lineTo(0, -2 * s);
    ctx.moveTo(0, 4 * s);
    ctx.lineTo(-7 * s, -4 * s);
    ctx.moveTo(0, 4 * s);
    ctx.lineTo(7 * s, -4 * s);
    ctx.strokeStyle = "rgba(56, 102, 59, 0.7)";
    ctx.lineWidth = 1 * EXPORT_SCALE;
    ctx.stroke();

    // Florets
    const florets = [
      { cx: -7 * s, cy: -4 * s, r: 1.8 * s, fill: "#FFFFFF" },
      { cx: 7 * s, cy: -4 * s, r: 1.8 * s, fill: "#FFFFFF" },
      { cx: 0, cy: -7 * s, r: 2.2 * s, fill: "#FFFDF0" },
      { cx: -4 * s, cy: -9 * s, r: 1.5 * s, fill: "#FFFFFF" },
      { cx: 4 * s, cy: -9 * s, r: 1.5 * s, fill: "#FFFFFF" },
    ];

    florets.forEach((f) => {
      ctx.beginPath();
      ctx.arc(f.cx, f.cy, Math.max(1, f.r), 0, Math.PI * 2);
      ctx.fillStyle = f.fill;
      ctx.fill();
    });
    ctx.restore();
  });

  // ── LAYER 4: Bloom Heads (Sorted by Z for depth) ───────────────
  const sortedBlooms = [...blooms].sort((a, b) => a.z - b.z);
  sortedBlooms.forEach((bloom) => {
    const img = imageMap.get(bloom.imageSrc);
    if (!img) return;

    ctx.save();
    const posX = centerX + bloom.x * EXPORT_SCALE;
    const posY = centerY + bloom.y * EXPORT_SCALE;

    ctx.translate(posX, posY);
    ctx.rotate((bloom.rotationDeg * Math.PI) / 180);

    const bloomWidth = 96 * bloom.scale * EXPORT_SCALE;
    const bloomHeight = 96 * bloom.scale * EXPORT_SCALE;

    // Drop shadow
    const dropShadowPx = Math.round(8 + (bloom.z / 100) * 12) * EXPORT_SCALE;
    ctx.shadowColor = `rgba(0, 0, 0, ${0.55 + (bloom.z / 100) * 0.35})`;
    ctx.shadowBlur = dropShadowPx;
    ctx.shadowOffsetY = dropShadowPx * 0.6;

    ctx.drawImage(img, -bloomWidth / 2, -bloomHeight / 2, bloomWidth, bloomHeight);
    ctx.restore();
  });

  // ── LAYER 5: Front Wrapper PNG (Front Lapel Folds & Bow) ────────
  const wrapperImg = imageMap.get(wrapperSrc);
  if (wrapperImg) {
    ctx.save();
    const wrapWidth = 400 * wrapperScale * EXPORT_SCALE;
    const wrapHeight = 340 * wrapperScale * EXPORT_SCALE;

    // Position wrapper at lower center
    const wrapX = centerX - wrapWidth / 2;
    const wrapY = canvasHeight - wrapHeight - 10 * EXPORT_SCALE;

    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 25 * EXPORT_SCALE;
    ctx.shadowOffsetY = 15 * EXPORT_SCALE;

    ctx.drawImage(wrapperImg, wrapX, wrapY, wrapWidth, wrapHeight);
    ctx.restore();
  }

  // Convert canvas to PNG Blob and trigger instant browser download
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to generate PNG blob."));
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke blob URL to prevent memory leaks
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 1000);

        resolve();
      },
      "image/png",
      1.0
    );
  });
}
