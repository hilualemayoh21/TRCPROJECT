"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const express_1 = require("express");
const api_1 = require("../utils/api");
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const alerting_1 = require("../utils/alerting");
function errorHandler(err, req, res, next) {
    const requestId = req.requestId;
    if (err instanceof api_1.AppError) {
        logger_1.default.warn({ requestId, code: err.code, message: err.message, userId: req.user?.id });
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details || {}
            }
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Input validation failed',
                details: err.errors
            }
        });
    }
    logger_1.default.error({ requestId, stack: err.stack, message: err.message, userId: req.user?.id });
    alerting_1.AlertingService.critical(`Internal Server Error: ${err.message}`, {
        requestId,
        path: req.path,
        userId: req.user?.id
    }).catch(() => { });
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
            details: {}
        }
    });
}
//# sourceMappingURL=error.middleware.js.map