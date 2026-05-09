import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export class PublicController {

  /** GET /public/stats — Homepage stats (no auth) */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalResources, totalUsers, totalCategories, totalDownloads] = await Promise.all([
        prisma.resource.count({ where: { status: 'approved', deletedAt: null } }),
        prisma.user.count({ where: { status: 'active', deletedAt: null } }),
        prisma.category.count(),
        prisma.resource.aggregate({
          where: { status: 'approved', deletedAt: null },
          _sum: { downloadCount: true },
        }),
      ]);

      res.json({
        totalResources,
        totalUsers,
        totalCategories,
        totalDownloads: totalDownloads._sum.downloadCount || 0,
      });
    } catch (e) { next(e); }
  }

  /** GET /public/featured — Top resources for homepage */
  static async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);

      const resources = await prisma.resource.findMany({
        where: { status: 'approved', deletedAt: null, visibility: 'public' },
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
          _count: { select: { comments: true, ratings: true } },
        },
        orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      });

      // Enrich with average rating
      const enriched = await Promise.all(
        resources.map(async (r: any) => {
          const agg = await prisma.rating.aggregate({
            where: { resourceId: r.id },
            _avg: { value: true },
          });
          return { ...r, averageRating: agg._avg.value ?? 0 };
        })
      );

      res.json(enriched);
    } catch (e) { next(e); }
  }

  /** GET /public/categories — All categories with resource counts */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: { select: { resources: { where: { status: 'approved', deletedAt: null } } } },
        },
        orderBy: { name: 'asc' },
      });

      res.json(categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        color: c.color,
        resourceCount: c._count.resources,
      })));
    } catch (e) { next(e); }
  }
}
