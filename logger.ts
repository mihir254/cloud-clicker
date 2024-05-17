import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logTransport = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '2m',
    maxFiles: '10d'
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    logTransport,
  ]
});

// const logger = {
//   ...baseLogger,
//   logFullError: (level: string, message: string, error: Error) => {
//     const fullMessage = `${message}\n${error?.stack || 'No stack trace available'}`;
//     baseLogger.log({ level, message: fullMessage });
//   }
// };

export default logger;
