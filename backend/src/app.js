"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middleware/error.middleware");
const tracing_middleware_1 = require("./middleware/tracing.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const roles_routes_1 = __importDefault(require("./modules/roles/roles.routes"));
const users_routes_1 = require("./modules/users/users.routes");
const audit_routes_1 = __importDefault(require("./modules/audit/audit.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const client_1 = require("./prisma/client");
const app = (0, express_1.default)();
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, 'swagger.yaml'));
// Global Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(tracing_middleware_1.tracingMiddleware);
// API Documentation
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Routes
app.use('/auth', rate_limit_middleware_1.authRateLimiter, auth_routes_1.default);
app.use('/roles', roles_routes_1.default);
app.use('/users', users_routes_1.usersRouter);
app.use('/admin/users', users_routes_1.adminUsersRouter);
app.use('/admin', audit_routes_1.default);
app.use('/admin', admin_routes_1.default);
// Health Check
app.get('/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        await client_1.prisma.$queryRaw `SELECT 1`;
        dbStatus = 'connected';
    }
    catch (e) { }
    res.json({
        status: 'ok',
        database: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
// Error Handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map