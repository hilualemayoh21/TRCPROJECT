"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingService = void 0;
const logger_1 = __importDefault(require("./logger"));
const axios_1 = __importDefault(require("axios"));
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
class AlertingService {
    static async notify(message, severity = 'info', context) {
        const payload = {
            timestamp: new Date().toISOString(),
            severity,
            message,
            context,
        };
        // Log locally
        logger_1.default.error(payload, `[ALERT][${severity.toUpperCase()}] ${message}`);
        // Send to external service (Slack/PagerDuty)
        if (SLACK_WEBHOOK) {
            try {
                await axios_1.default.post(SLACK_WEBHOOK, {
                    text: `*${severity.toUpperCase()} ALERT*: ${message}\n\`\`\`${JSON.stringify(context, null, 2)}\`\`\``
                });
            }
            catch (err) {
                logger_1.default.error({ err }, 'Failed to send external alert');
            }
        }
    }
    static async critical(message, context) {
        return this.notify(message, 'critical', context);
    }
    static async warning(message, context) {
        return this.notify(message, 'warning', context);
    }
}
exports.AlertingService = AlertingService;
//# sourceMappingURL=alerting.js.map