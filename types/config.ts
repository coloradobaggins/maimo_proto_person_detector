// types/config.ts

export interface SensorDetections {
    DETECTION_INTERVAL_MS: number;
    CONSECUTIVE_HITS_REQUIRED: number;
    COOLDOWN_MS: number;
    VERIFY_MAX_ATTEMPTS: number;
}

export type DetectionProfile = "idle" | "adult" | "child" | "both";

export interface ContentItem {
    lang: string;
    title: string;
    description: string;
}

export interface ProfileData {
    content: ContentItem[];
}

export interface AppConfig {
    config: {
        sensor_detections: SensorDetections;
        detection_profiles: DetectionProfile[];
    };
    data: Record<DetectionProfile, ProfileData>;
}