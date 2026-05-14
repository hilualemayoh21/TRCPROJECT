export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  resourceId: string;
  createdAt: string;
  author?: User;
}

export interface Rating {
  id: string;
  value: number;
  userId: string;
  resourceId: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  categoryId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  visibility: string;
  tags: string[];
  status: string;
  authorId: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  author?: User;
  category?: Category;
  _count?: {
    comments: number;
    ratings: number;
  };
  averageRating?: number;
}

export interface PaginatedResources {
  items: Resource[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ResourceQueryParams {
  page?: number;
  pageSize?: number;
  q?: string;
  categoryId?: string;
  type?: string;
  tags?: string[];
}
