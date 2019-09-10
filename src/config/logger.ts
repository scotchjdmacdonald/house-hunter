import * as winston from 'winston';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'user-service',
    },
    transports: [
        new winston.transports.File({
            filename: `logs/error.log`,
            level: 'error',
        }),
        new winston.transports.File({
            filename: `logs/all.log`,
            level: 'debug',
        }),
    ],
});

// use console for debugging locally
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
