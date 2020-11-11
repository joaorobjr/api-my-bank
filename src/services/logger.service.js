import winston from 'winston';
import settings from '../config/config.js';

const { combine, label, timestamp, printf } = winston.format;

const format = printf(({ timestamp, label, level, message }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: settings.log.level,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${settings.log.path}/${settings.app.name}.log`,
    }),
  ],
  format: combine(
    label({ label: `${settings.app.name}` }),
    timestamp(),
    format
  ),
});
export default logger;
