import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';
import { tracingMiddleware } from './middleware/tracing.middleware';
import { authRateLimiter } from './middleware/rate-limit.middleware';
import authRoutes from './modules/auth/auth.routes';
import { adminUsersRouter, usersRouter } from './modules/users/users.routes';
import auditRoutes from './modules/audit/audit.routes';
import adminRoutes from './modules/admin/admin.routes';
import resourceRoutes from './modules/resources/resources.routes';
import publicRoutes from './modules/public/public.routes';
import { prisma } from './prisma/client';

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(tracingMiddleware);

// Serve uploads as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── DEBUG ROUTES (Top Priority) ───
app.get('/ping', (req, res) => res.status(200).send('pong'));
app.get('/api/test', (req, res) => res.status(200).json({ ok: true }));
app.get('/api/test-email', async (req, res) => {
  const { EmailService } = await import('./utils/email');
  const result = await EmailService.verifyConnection();
  res.json(result);
});

// ─── API ROUTES ───
app.use('/api/public', publicRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin', auditRoutes);
app.use('/api/admin', adminRoutes);

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check (Kept at root for Render health checks)
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {}

  res.json({
    status: 'ok',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error Handling
app.use(errorHandler);

export default app;
