import { get } from '@/services/http'

export interface PublicStats {
  totalResources: number
  totalCategories: number
  totalDownloads: number
}

export interface FeaturedResource {
  id: string
  title: string
  description: string
  type: string
  thumbnailUrl?: string
  downloadCount: number
  viewCount: number
  author: {
    name: string
    institution?: string
  }
  category?: {
    name: string
  }
  averageRating: number
}

export const publicApi = {
  async getStats() {
    return get<PublicStats>('/public/stats')
  },
  
  async getFeatured() {
    return get<{ items: FeaturedResource[] }>('/public/featured')
  }
}
