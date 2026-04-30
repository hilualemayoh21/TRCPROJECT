"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracingMiddleware = void 0;
const express_1 = require("express");
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../utils/logger"));
const tracingMiddleware = (req, res, next) => {
    const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.default.info({
            type: 'http-response',
            requestId,
            userId: req.user?.id || 'anonymous',
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    next();
};
exports.tracingMiddleware = tracingMiddleware;
// Also update express.d.ts to include requestId
//# sourceMappingURL=tracing.middleware.js.map