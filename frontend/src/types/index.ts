export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  tags?: Tag[];
}

export interface PromptParameters {
  aspectRatio?: string;
  version?: string;
  negativePrompt?: string;
  temperature?: number;
  seed?: number;
}

export interface Prompt {
  _id: string;
  title: string;
  slug: string;
  aiModel: 'ChatGPT' | 'Midjourney' | 'Claude' | 'Stable Diffusion' | 'DALL-E' | 'Gemini' | 'Other';
  category: Category | string;
  tags: string[];
  content: string;
  parameters?: PromptParameters;
  description?: string;
  sampleOutputUrl?: string;
  isPublished: boolean;
  viewsCount: number;
  copiesCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsStats {
  totalPrompts: number;
  totalCategories: number;
  totalViews: number;
  totalCopies: number;
  totalLikes: number;
}
