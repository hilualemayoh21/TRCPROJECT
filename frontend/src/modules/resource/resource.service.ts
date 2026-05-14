import { get, post } from '@/services/http';
import type { 
  Resource, 
  PaginatedResources, 
  ResourceQueryParams, 
  Comment, 
  Rating 
} from './resource.types';

export const resourceService = {
  async listResources(params: ResourceQueryParams = {}) {
    return get<PaginatedResources>('/resources', { params });
  },

  async getResource(id: string) {
    return get<Resource>(`/resources/${encodeURIComponent(id)}`);
  },

  async getComments(id: string) {
    return get<Comment[]>(`/resources/${encodeURIComponent(id)}/comments`);
  },

  async addComment(id: string, content: string) {
    return post<Comment>(`/resources/${encodeURIComponent(id)}/comments`, { content });
  },

  async rateResource(id: string, value: number) {
    return post<{ averageRating: number }>(`/resources/${encodeURIComponent(id)}/rate`, { value });
  },

  async reportResource(id: string, reason: string, description?: string) {
    return post(`/resources/${encodeURIComponent(id)}/report`, { reason, description });
  },

  async getCategories() {
    return get<Category[]>('/public/categories');
  }
};
