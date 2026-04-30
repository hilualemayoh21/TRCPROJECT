"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_1 = require("../config");
const logger = (0, pino_1.default)({
    level: config_1.config.logLevel,
    transport: config_1.config.isDev ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    } : undefined,
    base: {
        env: config_1.config.env,
    },
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
});
exports.default = logger;
//# sourceMappingURL=logger.js.map