export interface BalloonSlotData {
  id: number;
  color: string;
  nickname: string;
  delay: number;
}

export interface FlowerQuality {
  char: string;
  meaning: string;
  flowerName: string;
  flowerType: "sunflower" | "rose" | "tulip" | "lavender" | "daisy";
  message: string;
}

export interface MemoryItem {
  id: number;
  src: string;
  title: string;
  caption: string;
  date: string;
}

export type LoveLetterStage =
  | "intro"
  | "outerBox"
  | "innerBox"
  | "envelope"
  | "opening"
  | "sliding"
  | "unfolding"
  | "letterOpen";

export type MemoryStage = "intro" | "developing" | "viewing" | "collage";

export type WishStage = "idle" | "holding" | "darkness" | "revealed";

export type HeroStage = "idle" | "launching" | "fireworks";
