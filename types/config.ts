// types/config.ts
export type PuzzleCategory = "obelisco" | "paseodelbajo" | "subtes"
export const PUZZLE_CATEGORIES: PuzzleCategory[] = ["obelisco", "paseodelbajo", "subtes"];

export interface PuzzleImage {
    filename: string;
    title: string;
    description: string;
}

export interface PuzzleCategory_Data {
    images: PuzzleImage[]
}

export interface SensorDetections {
    DETECTION_INTERVAL_MS: number;
    CONSECUTIVE_HITS_REQUIRED: number;
    COOLDOWN_MS: number;
    VERIFY_MAX_ATTEMPTS: number;
}

export type DetectionProfile = "idle" | "adult" | "child" | "both";

export interface Hero {
    type: "image" | "video";
    url: string;
}

export interface Section {
    title: string;
    description: string;
    link?: {
        label: string;
        url: string;
    };
}

export interface DiscoverButton {
    label: string;
    icon: string;
    url: string;
}

export interface ContentItem {
    lang: string;
    title: string;
    description: string;
    hero?: Hero;
    sections?: Section[];
    buttons?: DiscoverButton[];
}

export interface ProfileData {
    content: ContentItem[];
}

export interface AppConfig {
    config: {
        sensor_detections: SensorDetections;
        detection_profiles: DetectionProfile[];
        default_puzzle_category: PuzzleCategory;
    };
    data: Record<DetectionProfile, ProfileData>;
    puzzles: Record<PuzzleCategory, PuzzleCategory_Data>;
}