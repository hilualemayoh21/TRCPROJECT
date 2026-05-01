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
import rolesRoutes from './modules/roles/roles.routes';
import { adminUsersRouter, usersRouter } from './modules/users/users.routes';
import auditRoutes from './modules/audit/audit.routes';
import adminRoutes from './modules/admin/admin.routes';
import { prisma } from './prisma/client';

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(tracingMiddleware);

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/auth', authRateLimiter, authRoutes);
app.use('/roles', rolesRoutes);
app.use('/users', usersRouter);
app.use('/admin/users', adminUsersRouter);
app.use('/admin', auditRoutes);
app.use('/admin', adminRoutes);

// Health Check
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
