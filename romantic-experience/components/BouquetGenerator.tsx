import React, { useState, useMemo, useCallback } from 'react';
import { Download } from 'lucide-react';
import { FlowerCatalogItem, WrapStyle, RibbonStyle } from '@/types/bouquetEngine';
import { BouquetState } from '@/types/bouquet';
import { generateRealisticBouquetLayout } from '@/lib/utils';
import { StudioBouquetCanvas } from './StudioBouquetCanvas';
import { FlowerCard } from './FlowerCard';
import { safeConfetti } from '@/lib/confetti';
import { exportBouquetToPNG } from '@/lib/exportBouquet';

// Existing project flower catalog mapped with realistic dimensions
const FLORAL_CATALOG: FlowerCatalogItem[] = [
    {
        id: 'white-lily',
        name: 'White-Lily',
        meaning: 'Endless Passion',
        symbolism: 'Symbolizes deep romance, devotion, and timeless grace.',
        imageSrc: '/assets/flowers/white-lily.webp',
        tier: 'large',
        realDiameterMm: 95,
        stemThicknessPx: 5,
    },
    {
        id: 'sunflower',
        name: 'Sunflower',
        meaning: 'Prosperity & Romance',
        symbolism: 'Embodiment of delicate charm, fortune, and soft affection.',
        imageSrc: '/assets/flowers/sunflower.webp',
        tier: 'hero',
        realDiameterMm: 115,
        stemThicknessPx: 6,
    },
    {
        id: 'red-rose',
        name: 'Rose',
        meaning: 'Purity of Heart',
        symbolism: 'Reflects commitment, majesty, and unconditional devotion.',
        imageSrc: '/assets/flowers/red-rose.webp',
        tier: 'medium',
        realDiameterMm: 85,
        stemThicknessPx: 4,
    },
    {
        id: 'lavender',
        name: 'Lavender',
        meaning: 'Serenity & Faith',
        symbolism: 'Fills the bouquet with peaceful, calming, and eternal affection.',
        imageSrc: '/assets/flowers/lavender.webp',
        tier: 'small',
        realDiameterMm: 50,
        stemThicknessPx: 3,
    },
];

export default function BouquetGenerator() {
    const [counts, setCounts] = useState<BouquetState>({});
    const [isDownloading, setIsDownloading] = useState(false);

    const [wrapStyle] = useState<WrapStyle>('korean-matte-black');
    const [ribbonStyle] = useState<RibbonStyle>('satin-black');

    const handleUpdateQuantity = useCallback((id: string, delta: number) => {
        setCounts((prev) => {
            const current = prev[id] || 0;
            const next = Math.max(0, Math.min(10, current + delta));
            return { ...prev, [id]: next };
        });
    }, []);

    const handleReset = useCallback(() => {
        setCounts({});
    }, []);

    const handleBloomCelebration = useCallback(() => {
        safeConfetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#ff2a85', '#ffffff', '#ff73b3'],
        });
    }, []);

    // Compute 3D Florist Composition in Real-Time
    const composition = useMemo(
        () => generateRealisticBouquetLayout(counts, FLORAL_CATALOG, wrapStyle),
        [counts, wrapStyle]
    );

    // High-Resolution PNG Export Handler
    const handleDownloadPNG = useCallback(async () => {
        if (composition.blooms.length === 0 || isDownloading) return;

        try {
            setIsDownloading(true);

            // Compute fillers matching canvas rendering logic
            const bbList: { x: number; y: number; scale: number; rotation: number }[] = [];
            const leafList: { x: number; y: number; scale: number; rotation: number }[] = [];

            composition.blooms.forEach((bloom, i) => {
                const side = i % 2 === 0 ? 1 : -1;
                const offsetX = side * (8 + (i % 3) * 6);
                const offsetY = -4 + (i % 3) * 4;

                bbList.push({
                    x: bloom.x + offsetX,
                    y: bloom.y + offsetY,
                    scale: 0.55 + (i % 3) * 0.06,
                    rotation: side * (10 + i * 15),
                });

                if (Math.abs(bloom.x) > 18 || bloom.y < -35) {
                    const leafAngle = (bloom.x / 60) * 30;
                    leafList.push({
                        x: bloom.x + (bloom.x > 0 ? 12 : -12),
                        y: bloom.y - 4,
                        scale: 0.55 + (i % 2) * 0.08,
                        rotation: leafAngle,
                    });
                }
            });

            const totalCount = composition.blooms.length;
            const wrapperScale = Math.min(1.10, Math.max(0.92, 0.95 + Math.sqrt(totalCount) * 0.03));

            await exportBouquetToPNG({
                blooms: composition.blooms,
                stems: composition.stems,
                fillers: {
                    bb: bbList.slice(0, composition.autoBabysBreathCount + 1),
                    leaves: leafList,
                },
                wrapperScale,
                wrapperSrc: '/assets/front-wrapper.png',
                filename: 'emmas-bespoke-bouquet.png',
            });
        } catch (err) {
            console.error('Failed to download bouquet PNG:', err);
        } finally {
            setIsDownloading(false);
        }
    }, [composition, isDownloading]);

    return (
        <section className="w-full min-h-screen bg-[#030303] text-white py-16 px-4 sm:px-8 select-none">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">

                {/* Luxury Header */}
                <div className="text-center space-y-3">
                    <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-rose-200 to-amber-200 tracking-tight">
                        Emma&apos;s <span className="italic text-[#ff2a85]"> DIY </span>Bouquet
                    </h2>
                    <p className="font-mono text-xs sm:text-sm text-neutral-400 uppercase tracking-widest">
                        I think this part will be the most beautiful thing you will see today
                    </p>
                </div>

                {/* Workspace Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                    {/* Left Canvas: Live Viewport */}
                    <div className="lg:col-span-7 w-full flex flex-col items-center">
                        <StudioBouquetCanvas
                            blooms={composition.blooms}
                            stems={composition.stems}
                            tiePointY={composition.tiePointY}
                            wrapStyle={wrapStyle}
                            ribbonStyle={ribbonStyle}
                            autoBabysBreathCount={composition.autoBabysBreathCount}
                        />

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                            <button
                                onClick={handleBloomCelebration}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#ff2a85] to-rose-700 text-white font-serif text-sm font-semibold tracking-wider hover:shadow-[0_0_25px_rgba(255,42,133,0.5)] transition-all active:scale-95"
                            >
                                Celebrate it
                            </button>
                            <button
                                onClick={handleDownloadPNG}
                                disabled={isDownloading || composition.blooms.length === 0}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/40 text-amber-100 font-mono text-xs uppercase tracking-widest hover:border-amber-300 hover:bg-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2 active:scale-95"
                            >
                                <Download className="w-4 h-4 text-amber-300" />
                                {isDownloading ? 'Downloading...' : 'Download Bouquet'}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Remake Bouquet
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Flower Catalog Controls */}
                    <div className="lg:col-span-5 w-full flex flex-col gap-4 max-h-[640px] overflow-y-auto pr-1">
                        {FLORAL_CATALOG.map((flower) => (
                            <FlowerCard
                                key={flower.id}
                                flower={flower}
                                quantity={counts[flower.id] || 0}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}