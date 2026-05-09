import { prisma } from '../../prisma/client';
import { AppError, NotFoundError } from '../../utils/api';
import { Prisma } from '@prisma/client';

interface CreateResourceInput {
  title: string;
  description: string;
  type: string;
  categoryId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  visibility?: string;
  tags?: string[];
}

interface ResourceQueryInput {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  sort: string;
  authorId?: string;
}

const RESOURCE_INCLUDE = {
  author: { select: { id: true, name: true, email: true } },
  category: { select: { id: true, name: true, slug: true, color: true } },
  _count: { select: { comments: true, ratings: true } },
} as const;

export class ResourcesService {

  static async create(data: CreateResourceInput, authorId: string) {
    if (data.categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!cat) throw new NotFoundError('Category not found');
    }

    return prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId || null,
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        fileSize: data.fileSize || null,
        thumbnailUrl: data.thumbnailUrl || null,
        visibility: data.visibility || 'public',
        tags: data.tags || [],
        status: 'pending',
        authorId,
      },
      include: RESOURCE_INCLUDE,
    });
  }

  static async findAll(query: ResourceQueryInput) {
    const where: Prisma.ResourceWhereInput = { deletedAt: null };

    // Default to approved for public queries
    where.status = query.status || 'approved';

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { has: query.search } },
      ];
    }
    if (query.category) where.categoryId = query.category;
    if (query.type) where.type = query.type;
    if (query.authorId) where.authorId = query.authorId;

    const orderBy: Prisma.ResourceOrderByWithRelationInput =
      query.sort === 'oldest' ? { createdAt: 'asc' } :
      query.sort === 'popular' ? { viewCount: 'desc' } :
      query.sort === 'top_rated' ? { viewCount: 'desc' } : // fallback, real rating sort below
      { createdAt: 'desc' };

    const skip = (query.page - 1) * query.pageSize;

    const [items, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: RESOURCE_INCLUDE,
        orderBy,
        skip,
        take: query.pageSize,
      }),
      prisma.resource.count({ where }),
    ]);

    // Compute average rating for each resource
    const enriched = await Promise.all(
      items.map(async (r) => {
        const agg = await prisma.rating.aggregate({
          where: { resourceId: r.id },
          _avg: { value: true },
        });
        return { ...r, averageRating: agg._avg.value ?? 0 };
      })
    );

    return { items: enriched, page: query.page, pageSize: query.pageSize, total };
  }

  static async findById(id: string) {
    const resource = await prisma.resource.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...RESOURCE_INCLUDE,
        comments: {
          where: { deletedAt: null },
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!resource) throw new NotFoundError('Resource not found');

    const agg = await prisma.rating.aggregate({
      where: { resourceId: id },
      _avg: { value: true },
    });

    return { ...resource, averageRating: agg._avg.value ?? 0 };
  }

  static async update(id: string, data: Partial<CreateResourceInput>, userId: string, isAdmin: boolean) {
    const resource = await prisma.resource.findFirst({ where: { id, deletedAt: null } });
    if (!resource) throw new NotFoundError('Resource not found');
    if (resource.authorId !== userId && !isAdmin) {
      throw new AppError('Not authorized to update this resource', 403);
    }

    return prisma.resource.update({
      where: { id },
      data: {
        ...data,
        // Reset to pending if content changed by non-admin
        ...(!isAdmin && (data.title || data.description) ? { status: 'pending' } : {}),
      },
      include: RESOURCE_INCLUDE,
    });
  }

  static async delete(id: string, userId: string, isAdmin: boolean) {
    const resource = await prisma.resource.findFirst({ where: { id, deletedAt: null } });
    if (!resource) throw new NotFoundError('Resource not found');
    if (resource.authorId !== userId && !isAdmin) {
      throw new AppError('Not authorized to delete this resource', 403);
    }

    return prisma.resource.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async approve(id: string, reviewerId: string, note?: string) {
    const resource = await prisma.resource.findFirst({ where: { id, deletedAt: null } });
    if (!resource) throw new NotFoundError('Resource not found');
    if (resource.status === 'approved') throw new AppError('Resource already approved', 400);

    return prisma.resource.update({
      where: { id },
      data: { status: 'approved', reviewedBy: reviewerId, reviewedAt: new Date(), reviewNote: note || null },
      include: RESOURCE_INCLUDE,
    });
  }

  static async reject(id: string, reviewerId: string, note?: string) {
    const resource = await prisma.resource.findFirst({ where: { id, deletedAt: null } });
    if (!resource) throw new NotFoundError('Resource not found');

    return prisma.resource.update({
      where: { id },
      data: { status: 'rejected', reviewedBy: reviewerId, reviewedAt: new Date(), reviewNote: note || null },
      include: RESOURCE_INCLUDE,
    });
  }

  static async incrementView(id: string) {
    await prisma.resource.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  }

  static async addComment(resourceId: string, content: string, authorId: string) {
    const resource = await prisma.resource.findFirst({ where: { id: resourceId, deletedAt: null, status: 'approved' } });
    if (!resource) throw new NotFoundError('Resource not found');

    return prisma.comment.create({
      data: { content, resourceId, authorId },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  static async getComments(resourceId: string, page: number, pageSize: number) {
    const where = { resourceId, deletedAt: null };
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.comment.count({ where }),
    ]);
    return { items, page, pageSize, total };
  }

  static async rateResource(resourceId: string, userId: string, value: number) {
    const resource = await prisma.resource.findFirst({ where: { id: resourceId, deletedAt: null, status: 'approved' } });
    if (!resource) throw new NotFoundError('Resource not found');

    return prisma.rating.upsert({
      where: { resourceId_userId: { resourceId, userId } },
      create: { resourceId, userId, value },
      update: { value },
    });
  }
}
