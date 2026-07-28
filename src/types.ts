export type SlideLayout = 
  | 'cover' 
  | 'content' 
  | 'quote' 
  | 'comparison' 
  | 'checklist' 
  | 'stats' 
  | 'cta';

export type AspectFormat = '3:4' | '4:5' | '1:1';

export type ContentLanguage = 'pt-BR' | 'es-LA';

export type ThemeStyle = 
  | 'modern-dark' 
  | 'clean-light' 
  | 'luxury-gold' 
  | 'neon-vibrant' 
  | 'pastel-creative' 
  | 'corporate-blue' 
  | 'custom';

export type FontPairing = 
  | 'sans-modern' 
  | 'serif-display' 
  | 'tech-bold' 
  | 'editorial';

export interface SlideItem {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  quoteAuthor?: string;
  statNumber?: string;
  statLabel?: string;
  comparisonBefore?: string;
  comparisonAfter?: string;
  ctaText?: string;
  badgeText?: string;
  customBg?: string;
  accentColor?: string;
  image?: string;
  useAiBg?: boolean;
  titleOffset?: { x: number; y: number };
  subtitleOffset?: { x: number; y: number };
}

export interface BrandProfile {
  handle: string;
  name: string;
  avatarUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontPairing: FontPairing;
  website?: string;
  niche: string;
  tone: string;
  tagline?: string;
}

export interface CarouselProject {
  id: string;
  title: string;
  aspectRatio: AspectFormat;
  themeStyle: ThemeStyle;
  slides: SlideItem[];
  brand: BrandProfile;
  caption: string;
  caption2?: string;
  hashtags: string[];
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  showSwipeIndicator: boolean;
  showSlideCounter: boolean;
  showBrandHandle: boolean;
}

export interface IdeaItem {
  id: string;
  title: string;
  niche: string;
  hook: string;
  category: string;
  description: string;
  slidesCount: number;
  tags: string[];
}

export interface ScheduledPost {
  id: string;
  projectId: string;
  projectTitle: string;
  scheduledDate: string;
  scheduledTime: string;
  platforms: ('instagram' | 'linkedin' | 'tiktok' | 'pinterest')[];
  status: 'scheduled' | 'published' | 'draft';
  thumbnailSlide: SlideItem;
  caption: string;
  hashtags: string[];
  brandHandle: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  niche: string;
  category: string;
  previewColor: string;
  aspectRatio: AspectFormat;
  themeStyle: ThemeStyle;
  slides: Omit<SlideItem, 'id'>[];
  defaultBrand: Partial<BrandProfile>;
}
