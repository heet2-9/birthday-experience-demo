import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlacedBloom3D, StemPathData, WrapStyle, RibbonStyle } from '@/types/bouquetEngine';
import { RealisticStemSystem } from './RealisticStemSystem';

// Transparent PNG Bouquet Wrapper Asset Path (Single Front Wrapper Architecture)
const FRONT_WRAPPER_SRC = '/assets/front-wrapper.png';

interface Props {
    blooms: PlacedBloom3D[];
    stems: StemPathData[];
    tiePointY?: number;
    wrapStyle?: WrapStyle;
    ribbonStyle?: RibbonStyle;
    autoBabysBreathCount: number;
}

// ── Delicate Gypsophila (Baby's Breath) Filler Component ───────────
const BabysBreathCluster = React.memo(function BabysBreathCluster({ x, y, scale, rotation }: { x: number; y: number; scale: number; rotation: number }) {
    return (
        <div
            className="absolute pointer-events-none z-18"
            style={{
                transform: `translate(${x}px, ${y}px) scale(${scale * 0.58}) rotate(${rotation}deg)`,
            }}
        >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 26 L14 12" stroke="#38663b" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
                <path d="M14 18 L7 10" stroke="#38663b" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
                <path d="M14 18 L21 10" stroke="#38663b" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
                {/* Micro White Gypsophila Florets */}
                <circle cx="7" cy="10" r="1.8" fill="#FFFFFF" opacity="0.95" />
                <circle cx="21" cy="10" r="1.8" fill="#FFFFFF" opacity="0.95" />
                <circle cx="14" cy="7" r="2.2" fill="#FFFDF0" opacity="0.98" />
                <circle cx="10" cy="5" r="1.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="18" cy="5" r="1.5" fill="#FFFFFF" opacity="0.9" />
            </svg>
        </div>
    );
});

// ── Minimal Eucalyptus Leaf Accent Component ────────────────────────
const EucalyptusLeafAccent = React.memo(function EucalyptusLeafAccent({ x, y, scale, rotation }: { x: number; y: number; scale: number; rotation: number }) {
    return (
        <div
            className="absolute pointer-events-none z-14"
            style={{
                transform: `translate(${x}px, ${y}px) scale(${scale * 0.55}) rotate(${rotation}deg)`,
            }}
        >
            <svg width="22" height="30" viewBox="0 0 22 30" fill="none">
                <path d="M11 30 L11 3" stroke="#1b431c" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                <ellipse cx="11" cy="12" rx="7" ry="9" fill="#2d6a31" opacity="0.8" />
                <ellipse cx="11" cy="12" rx="5" ry="7" stroke="#4ade80" strokeWidth="0.4" opacity="0.25" fill="none" />
            </svg>
        </div>
    );
});

export const StudioBouquetCanvas: React.FC<Props> = React.memo(({
    blooms,
    stems,
    autoBabysBreathCount,
}) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const hasFlowers = blooms.length > 0;

    // Dynamic scale for wrapper based on bouquet volume
    const totalCount = blooms.length;
    const wrapperScale = totalCount === 0
        ? 0.95
        : Math.min(1.10, Math.max(0.92, 0.95 + Math.sqrt(totalCount) * 0.03));

    // Compute automatic fillers (Baby's breath & leaves) nestled inside core gaps
    const fillers = useMemo(() => {
        if (!hasFlowers) return { bb: [], leaves: [] };

        const bbList: { x: number; y: number; scale: number; rotation: number; id: string }[] = [];
        const leafList: { x: number; y: number; scale: number; rotation: number; id: string }[] = [];

        blooms.forEach((bloom, i) => {
            const side = i % 2 === 0 ? 1 : -1;
            const offsetX = side * (8 + (i % 3) * 6);
            const offsetY = -4 + (i % 3) * 4;

            bbList.push({
                x: bloom.x + offsetX,
                y: bloom.y + offsetY,
                scale: 0.55 + (i % 3) * 0.06,
                rotation: side * (10 + i * 15),
                id: `bb-fill-${i}`,
            });

            if (Math.abs(bloom.x) > 18 || bloom.y < -35) {
                const leafAngle = (bloom.x / 60) * 30;
                leafList.push({
                    x: bloom.x + (bloom.x > 0 ? 12 : -12),
                    y: bloom.y - 4,
                    scale: 0.55 + (i % 2) * 0.08,
                    rotation: leafAngle,
                    id: `leaf-accent-${i}`,
                });
            }
        });

        return { bb: bbList.slice(0, autoBabysBreathCount + 1), leaves: leafList };
    }, [blooms, hasFlowers, autoBabysBreathCount]);

    return (
        <div
            ref={canvasContainerRef}
            className="relative w-full h-[620px] rounded-3xl bg-gradient-to-b from-[#120a0e] via-[#0b0608] to-[#040203] shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-rose-950/40 flex items-center justify-center overflow-hidden select-none"
        >
            {/* Studio Lighting Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(244,63,94,0.14),transparent_70%)] pointer-events-none z-0" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-amber-200/5 blur-[140px] rounded-full pointer-events-none z-0" />

            {/* Floating Sparkle Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1.5 h-1.5 bg-rose-200/30 rounded-full blur-[0.5px]"
                        animate={{
                            y: [-20, 640],
                            x: [Math.sin(i) * 40, Math.cos(i) * 40],
                            opacity: [0, 0.7, 0],
                        }}
                        transition={{
                            duration: 9 + i * 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: i * 0.5,
                        }}
                        style={{ left: `${10 + i * 7.5}%` }}
                    />
                ))}
            </div>

            {/* 3D Bouquet Container - Centered on Shared Vertical Axis */}
            <div className="relative w-[440px] h-[580px] flex items-center justify-center">

                {/* Soft Backing Shadow for Floral Contrast */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[240px] h-[200px] bg-black/40 blur-[40px] rounded-full pointer-events-none z-5" />

                {/* ── LAYER 1: Stem System (Converging Bezier Stems starting inside Core) ── */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <RealisticStemSystem stems={stems} />
                </div>

                {/* ── LAYER 2: Eucalyptus Greenery Leaves ── */}
                <div className="absolute inset-0 flex items-center justify-center z-14 pointer-events-none">
                    <AnimatePresence>
                        {hasFlowers &&
                            fillers.leaves.map((leaf) => (
                                <motion.div
                                    key={leaf.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 0.9, scale: leaf.scale }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <EucalyptusLeafAccent {...leaf} />
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>

                {/* ── LAYER 3: Baby's Breath Filler Clusters ── */}
                <div className="absolute inset-0 flex items-center justify-center z-18 pointer-events-none">
                    <AnimatePresence>
                        {hasFlowers &&
                            fillers.bb.map((bb) => (
                                <motion.div
                                    key={bb.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 0.95, scale: bb.scale }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <BabysBreathCluster {...bb} />
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>

                {/* ── LAYER 4: Bloom Heads (100% Perfectly Visible, Compact Central Dome) ── */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <AnimatePresence>
                        {blooms.map((bloom) => {
                            const dropShadowPx = Math.round(8 + (bloom.z / 100) * 12);
                            const shadowAlpha = (0.55 + (bloom.z / 100) * 0.35).toFixed(2);

                            return (
                                <motion.div
                                    key={bloom.instanceId}
                                    initial={{ opacity: 0, scale: 0.1, y: -50 }}
                                    animate={{
                                        opacity: bloom.opacity,
                                        scale: bloom.scale,
                                        x: bloom.x,
                                        y: bloom.y,
                                        rotate: bloom.rotationDeg,
                                    }}
                                    exit={{ opacity: 0, scale: 0.1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 220,
                                        damping: 22,
                                    }}
                                    className="absolute origin-center cursor-pointer hover:brightness-110 transition-all"
                                    style={{
                                        zIndex: bloom.z + 10,
                                        filter: `drop-shadow(0 ${dropShadowPx}px ${dropShadowPx + 4}px rgba(0,0,0,${shadowAlpha}))`,
                                    }}
                                >
                                    <img
                                        src={bloom.imageSrc}
                                        alt={bloom.name}
                                        className="w-24 h-24 object-contain pointer-events-none select-none"
                                        loading="eager"
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* ── LAYER 5: Front Wrapper PNG (Front Lapel Folds & Satin Ribbon Bow) ── */}
                <motion.div
                    animate={{ scale: wrapperScale }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className="absolute -bottom-6 z-30 pointer-events-none flex items-center justify-center w-[380px] sm:w-[420px] h-[340px]"
                >
                    <img
                        src={FRONT_WRAPPER_SRC}
                        alt="Front Wrapper Collar"
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] select-none pointer-events-none"
                        style={{ mixBlendMode: 'lighten' }}
                        loading="eager"
                    />
                </motion.div>

                {/* Empty Canvas Prompt */}
                {!hasFlowers && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute z-40 text-center px-8"
                    >
                        <p className="font-serif italic text-rose-200/70 text-lg tracking-wide">
                            Select flowers from the menu to craft Emma’s bespoke bouquet...
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Signature Watermark */}
            <div className="absolute bottom-4 inset-x-0 text-center z-40">
                <p className="font-serif italic text-rose-200/80 text-xs sm:text-sm tracking-widest drop-shadow-md">
                    For Emma ❤️ — Crafted with everlasting love.
                </p>
            </div>
        </div>
    );
});

StudioBouquetCanvas.displayName = 'StudioBouquetCanvas';