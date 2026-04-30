import logger from './logger';
import axios from 'axios';

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export type AlertSeverity = 'info' | 'warning' | 'critical';

export class AlertingService {
  static async notify(message: string, severity: AlertSeverity = 'info', context?: any) {
    const payload = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      context,
    };

    // Log locally
    logger.error(payload, `[ALERT][${severity.toUpperCase()}] ${message}`);

    // Send to external service (Slack/PagerDuty)
    if (SLACK_WEBHOOK) {
      try {
        await axios.post(SLACK_WEBHOOK, {
          text: `*${severity.toUpperCase()} ALERT*: ${message}\n\`\`\`${JSON.stringify(context, null, 2)}\`\`\``
        });
      } catch (err) {
        logger.error({ err }, 'Failed to send external alert');
      }
    }
  }

  static async critical(message: string, context?: any) {
    return this.notify(message, 'critical', context);
  }

  static async warning(message: string, context?: any) {
    return this.notify(message, 'warning', context);
  }
}
