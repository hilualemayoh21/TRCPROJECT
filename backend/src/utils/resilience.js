"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
exports.createCircuitBreaker = createCircuitBreaker;
exports.withTimeout = withTimeout;
const opossum_1 = __importDefault(require("opossum"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Simple retry helper for transient failures
 */
async function withRetry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    }
    catch (error) {
        if (retries <= 0)
            throw error;
        logger_1.default.warn({ err: error, retriesLeft: retries }, 'Operation failed, retrying...');
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
    }
}
/**
 * Circuit Breaker factory
 */
function createCircuitBreaker(fn, name) {
    const options = {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
        resetTimeout: 30000, // After 30 seconds, try again.
    };
    const breaker = new opossum_1.default(fn, options);
    breaker.on('open', () => logger_1.default.error(`Circuit Breaker [${name}] is OPEN`));
    breaker.on('halfOpen', () => logger_1.default.warn(`Circuit Breaker [${name}] is HALF-OPEN`));
    breaker.on('close', () => logger_1.default.info(`Circuit Breaker [${name}] is CLOSED`));
    return breaker;
}
/**
 * Timeout helper
 */
async function withTimeout(promise, timeoutMs, errorMessage = 'Operation timed out') {
    let timeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    });
    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutHandle);
        return result;
    }
    catch (error) {
        clearTimeout(timeoutHandle);
        throw error;
    }
}
//# sourceMappingURL=resilience.js.map