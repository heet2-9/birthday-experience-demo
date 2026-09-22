export interface FlowerItem {
    id: string;
    name: string;
    meaning: string;
    symbolism: string;
    imageSrc: string; // Uses your existing project image asset paths
    tier: 'hero' | 'large' | 'medium' | 'small' | 'filler' | 'greenery';
}

export interface PlacedFlower extends FlowerItem {
    instanceId: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    zIndex: number;
}

export interface BouquetState {
    [flowerId: string]: number;
}