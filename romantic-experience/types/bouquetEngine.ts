import { FlowerItem } from './bouquet';

export type FlowerTier = 'hero' | 'large' | 'medium' | 'small' | 'filler' | 'greenery';

export type WrapStyle = 'korean-matte-black' | 'blush-pink-silk' | 'champagne-gold' | 'kraft-vintage';
export type RibbonStyle = 'satin-black' | 'champagne-gold' | 'rose-velvet' | 'silk-cream';

export interface FlowerCatalogItem extends FlowerItem {
    tier: FlowerTier;
    realDiameterMm: number; // Real-world diameter in mm for scale consistency
    stemThicknessPx: number;
}

export interface PlacedBloom3D {
    instanceId: string;
    flowerId: string;
    name: string;
    imageSrc: string;
    tier: FlowerTier;

    // 3D Spatial Coordinates (Center of Bloom Head)
    x: number; // Horizontal offset from tie-point (px)
    y: number; // Vertical offset from tie-point (px)
    z: number; // Depth layer (0 = back, 100 = front)

    // Natural Procedural Rotation & Perspective
    rotationDeg: number;
    tiltDeg: number;
    scale: number;
    opacity: number;

    // Collision Bounds
    radiusPx: number;

    // Stem Data
    stemControlX: number;
    stemThickness: number;
    stemColor: string;
}

export interface StemPathData {
    id: string;
    startX: number;
    startY: number;
    controlX: number;
    controlY: number;
    endX: number;
    endY: number;
    thickness: number;
    color: string;
    zIndex: number;
}

export interface BouquetCompositionResult {
    blooms: PlacedBloom3D[];
    stems: StemPathData[];
    boundingWidth: number;
    boundingHeight: number;
    tiePointY: number;
    autoGreeneryCount: number;
    autoBabysBreathCount: number;
}