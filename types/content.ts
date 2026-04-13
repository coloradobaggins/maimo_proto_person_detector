// ─── Tipos de contenido ───────────────────────────────────────────────────────

export interface GalleryImage {
    url: string;
    caption?: string;
}

export interface GalleryItem {
    id: number;
    title: string;
    description: string;
    tags: string[];
    mainImage: string;
    thumbImage?: string;
    images?: GalleryImage[];
}

export interface Category {
    id: string;
    title: string;
    coverImage: string;
    shortDescription?: string;
    latitude?: number;
    longitude?: number;
    items: GalleryItem[];
}

export interface AppContent {
    categories: Category[];
}