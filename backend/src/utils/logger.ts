import pino from 'pino';
import { config } from '../config';

const logger = pino({
  level: config.logLevel,
  transport: config.isDev ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
  base: {
    env: config.env,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

export default logger;
