import React from 'react';
import { motion } from 'framer-motion';
import { FlowerItem } from '@/types/bouquet';
import { FlowerCatalogItem } from '@/types/bouquetEngine';

interface Props {
    flower: FlowerItem | FlowerCatalogItem;
    quantity: number;
    onUpdateQuantity: (id: string, delta: number) => void;
}

export const FlowerCard: React.FC<Props> = React.memo(({ flower, quantity, onUpdateQuantity }) => {
    return (
        <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="relative group rounded-2xl p-4 bg-gradient-to-b from-rose-950/20 via-neutral-900/60 to-black/80 border border-rose-900/20 hover:border-rose-500/40 backdrop-blur-md shadow-xl flex flex-col items-center text-center transition-all duration-300"
        >
            {/* Background Soft Glow */}
            <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none" />

            {/* Flower Image Preview */}
            <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                <motion.img
                    src={flower.imageSrc}
                    alt={flower.name}
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                    loading="lazy"
                />
            </div>

            {/* Metadata */}
            <h3 className="font-serif text-lg font-medium text-rose-100 tracking-wide">
                {flower.name}
            </h3>
            <p className="text-xs font-serif italic text-amber-200/80 mt-0.5">
                &ldquo;{flower.meaning}&rdquo;
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed px-1">
                {flower.symbolism}
            </p>

            {/* Quantity Controls */}
            <div className="mt-4 flex items-center gap-3 bg-neutral-950/80 border border-rose-900/30 rounded-full px-3 py-1 z-10 shadow-inner">
                <button
                    onClick={() => onUpdateQuantity(flower.id, -1)}
                    disabled={quantity === 0}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-rose-200 hover:bg-rose-900/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-medium text-sm"
                    aria-label={`Decrease ${flower.name} quantity`}
                >
                    -
                </button>
                <span className="w-5 text-center font-mono text-sm font-semibold text-rose-50">
                    {quantity}
                </span>
                <button
                    onClick={() => onUpdateQuantity(flower.id, 1)}
                    disabled={quantity >= 10}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-rose-200 hover:bg-rose-900/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-medium text-sm"
                    aria-label={`Increase ${flower.name} quantity`}
                >
                    +
                </button>
            </div>
        </motion.div>
    );
});

FlowerCard.displayName = 'FlowerCard';