"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
// Load .env file
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test', 'staging']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('4000'),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url().optional().default('redis://localhost:6379'),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters long"),
    RATE_LIMIT_WINDOW: zod_1.z.string().transform(Number).default('15'),
    RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('100'),
    LOG_LEVEL: zod_1.z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
    process.exit(1);
}
exports.config = Object.freeze({
    env: _env.data.NODE_ENV,
    isDev: _env.data.NODE_ENV === 'development',
    isProd: _env.data.NODE_ENV === 'production',
    isStaging: _env.data.NODE_ENV === 'staging',
    port: _env.data.PORT,
    dbUrl: _env.data.DATABASE_URL,
    redisUrl: _env.data.REDIS_URL,
    jwtSecret: _env.data.JWT_SECRET,
    refreshSecret: _env.data.JWT_REFRESH_SECRET,
    rateLimitWindow: _env.data.RATE_LIMIT_WINDOW,
    rateLimitMax: _env.data.RATE_LIMIT_MAX,
    logLevel: _env.data.LOG_LEVEL,
});
//# sourceMappingURL=index.js.map