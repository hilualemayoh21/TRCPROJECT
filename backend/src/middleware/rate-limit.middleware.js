"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../config");
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimitWindow * 60 * 1000,
    max: config_1.config.rateLimitMax,
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: `Too many attempts, please try again in ${config_1.config.rateLimitWindow} minutes.`,
            details: {}
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rate-limit.middleware.js.map