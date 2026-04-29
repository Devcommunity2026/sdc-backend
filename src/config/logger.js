import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf, errors } = format;

const myCombinedFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const myErrorFormat = printf(({ level, message, label, timestamp, stack }) => {
    return stack
        ? `${timestamp} [${label}] ${level}: ${message}\n${stack}`
        : `${timestamp} [${label}] ${level}: ${message}`;
});

const filterError = format((info) => {
    return info.level === 'error' ? false : info;
});

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: combine(
                label({ label: 'app' }),
                timestamp(),
                myErrorFormat
            )
        }),
        new transports.File({
            filename: './logs/combined.log',
            level: 'info',
            format: combine(
                filterError(),
                label({ label: 'app' }),
                timestamp(),
                myCombinedFormat
            )
        }),
        new transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: combine(
                label({ label: 'app' }),
                timestamp(),
                errors({ stack: true }),
                myErrorFormat
            ),
        })
    ]
});

export default logger