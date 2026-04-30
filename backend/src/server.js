"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
require("./modules/audit/audit.worker"); // Register worker
const client_1 = require("./prisma/client");
const redis_1 = require("./utils/redis");
const logger_1 = __importDefault(require("./utils/logger"));
const server = app_1.default.listen(config_1.config.port, () => {
    logger_1.default.info(`🚀 TRC Backend (${config_1.config.env}) running on http://localhost:${config_1.config.port}`);
});
const gracefulShutdown = async (signal) => {
    logger_1.default.info(`${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
        logger_1.default.info('HTTP server closed.');
        try {
            await redis_1.auditQueue.close();
            logger_1.default.info('Audit queue closed.');
            await redis_1.redis.quit();
            logger_1.default.info('Redis connection closed.');
            await client_1.prisma.$disconnect();
            logger_1.default.info('Prisma disconnected.');
            process.exit(0);
        }
        catch (err) {
            logger_1.default.error({ err }, 'Error during graceful shutdown');
            process.exit(1);
        }
    });
    // Force close after 10s
    setTimeout(() => {
        logger_1.default.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//# sourceMappingURL=server.js.map