import React from 'react';
import { StemPathData } from '@/types/bouquetEngine';

interface Props {
    stems: StemPathData[];
}

export const RealisticStemSystem: React.FC<Props> = React.memo(({ stems }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
                <linearGradient id="stemShade" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0f2e10" />
                    <stop offset="50%" stopColor="#225424" />
                    <stop offset="100%" stopColor="#0d2410" />
                </linearGradient>
            </defs>

            {stems.map((stem) => {
                const pathD = `M ${stem.startX} ${stem.startY} Q ${stem.controlX} ${stem.controlY} ${stem.endX} ${stem.endY}`;
                return (
                    <path
                        key={stem.id}
                        d={pathD}
                        fill="none"
                        stroke="url(#stemShade)"
                        strokeWidth={stem.thickness}
                        strokeLinecap="round"
                        className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    />
                );
            })}
        </svg>
    );
});

RealisticStemSystem.displayName = 'RealisticStemSystem';