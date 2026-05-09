import { Request, Response, NextFunction } from 'express';
import { ResourcesService } from './resources.service';
import { AuditService } from '../audit/audit.service';
import {
  createResourceSchema, updateResourceSchema,
  commentSchema, ratingSchema, reportSchema,
  resourceQuerySchema, approvalSchema,
} from './resources.validator';
import { prisma } from '../../prisma/client';
import { ValidationError } from '../../utils/api';

export class ResourcesController {

  /** GET /resources — Public list of approved resources */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = resourceQuerySchema.parse(req.query);
      // Non-admins can only see approved
      if (!req.permissions?.has('*') && !req.permissions?.has('approve_resources')) {
        query.status = 'approved';
      }
      const result = await ResourcesService.findAll(query);
      res.json(result);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Invalid query', e.errors));
      next(e);
    }
  }

  /** GET /resources/:id — Single resource detail */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const resource = await ResourcesService.findById(id);
      // Increment view count in background
      ResourcesService.incrementView(id).catch(() => {});
      res.json(resource);
    } catch (e) { next(e); }
  }

  /** POST /resources — Create new resource (auth required) */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createResourceSchema.parse(req.body);
      const resource = await ResourcesService.create(data, req.user!.id);

      AuditService.log(req, req.user!.id, 'resource.created', 'Resource', resource.id, { title: data.title }).catch(() => {});

      res.status(201).json(resource);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }

  /** PATCH /resources/:id — Update resource (owner or admin) */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = updateResourceSchema.parse(req.body);
      const isAdmin = req.permissions?.has('*') || req.permissions?.has('approve_resources') || false;
      const resource = await ResourcesService.update(id, data, req.user!.id, isAdmin);

      AuditService.log(req, req.user!.id, 'resource.updated', 'Resource', id).catch(() => {});

      res.json(resource);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }

  /** DELETE /resources/:id — Soft-delete resource */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const isAdmin = req.permissions?.has('*') || req.permissions?.has('approve_resources') || false;
      await ResourcesService.delete(id, req.user!.id, isAdmin);

      AuditService.log(req, req.user!.id, 'resource.deleted', 'Resource', id).catch(() => {});

      res.json({ ok: true, message: 'Resource deleted' });
    } catch (e) { next(e); }
  }

  /** POST /resources/:id/approve — Admin approve */
  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { note } = approvalSchema.parse(req.body);
      const resource = await ResourcesService.approve(id, req.user!.id, note);

      AuditService.log(req, req.user!.id, 'resource.approved', 'Resource', id).catch(() => {});

      res.json(resource);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }

  /** POST /resources/:id/reject — Admin reject */
  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { note } = approvalSchema.parse(req.body);
      const resource = await ResourcesService.reject(id, req.user!.id, note);

      AuditService.log(req, req.user!.id, 'resource.rejected', 'Resource', id).catch(() => {});

      res.json(resource);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }

  /** POST /resources/:id/comments — Add comment */
  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { content } = commentSchema.parse(req.body);
      const comment = await ResourcesService.addComment(id, content, req.user!.id);
      res.status(201).json(comment);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }

  /** GET /resources/:id/comments — List comments */
  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
      const result = await ResourcesService.getComments(id, page, pageSize);
      res.json(result);
    } catch (e) { next(e); }
  }

  /** POST /resources/:id/rate — Rate resource */
  static async rate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { value } = ratingSchema.parse(req.body);
      const rating = await ResourcesService.rateResource(id, req.user!.id, value);
      res.json(rating);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }

  /** POST /resources/:id/report — Report resource */
  static async report(req: Request, res: Response, next: NextFunction) {
    try {
      const data = reportSchema.parse(req.body);
      const report = await prisma.report.create({
        data: { ...data, reporterId: req.user!.id },
      });

      AuditService.log(req, req.user!.id, 'report.created', data.entityType, data.entityId, { reason: data.reason }).catch(() => {});

      res.status(201).json(report);
    } catch (e: any) {
      if (e.name === 'ZodError') return next(new ValidationError('Validation failed', e.errors));
      next(e);
    }
  }
}
