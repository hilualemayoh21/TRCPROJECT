import { z } from 'zod';

export const createResourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  type: z.enum(['document', 'video', 'image', 'dataset', 'article']),
  categoryId: z.string().uuid().optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().max(255).optional(),
  fileSize: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional(),
  visibility: z.enum(['public', 'private', 'restricted']).default('public'),
  tags: z.array(z.string().max(50)).max(20).default([]),
});

export const updateResourceSchema = createResourceSchema.partial();

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
});

export const ratingSchema = z.object({
  value: z.number().int().min(1).max(5),
});

export const reportSchema = z.object({
  reason: z.enum(['spam', 'inappropriate', 'copyright', 'misinformation', 'other']),
  description: z.string().max(1000).optional(),
  entityType: z.enum(['resource', 'comment', 'user']),
  entityId: z.string().uuid(),
});

export const resourceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().max(200).optional(),
  category: z.string().optional(),
  type: z.enum(['document', 'video', 'image', 'dataset', 'article']).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'top_rated']).default('newest'),
  authorId: z.string().uuid().optional(),
});

export const approvalSchema = z.object({
  note: z.string().max(500).optional(),
});
