// Client-side logger
const logger = {
    /**
     * Logs a standard message to the console only in development.
     * @param {...any} args - The message and any variables to log.
     */
    log: (...args) => {
        if (process.env.NODE_ENV !== 'development') return;
        console.log(...args);
    },
    /**
     * Logs a standard message to the console only in development.
     * @param {...any} args - The message and any variables to log.
     */
    info: (...args) => {
        if (process.env.NODE_ENV !== 'development') return;
        console.info(...args);
    },
    /**
     * Logs a warning to the console only in development.
     * @param {...any} args - The message and any variables to log.
     */
    warn: (...args) => {
        if (process.env.NODE_ENV !== 'development') return;
        console.warn(...args);
    },

    /**
     * Logs an error to the console only in development.
     * @param {...any} args - The message and any variables to log.
     */
    error: (...args) => {
        if (process.env.NODE_ENV !== 'development') return;
        console.error(...args);
    },
};

export default logger;