import CircuitBreaker from 'opossum';
import logger from './logger';

/**
 * Simple retry helper for transient failures
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    logger.warn({ err: error, retriesLeft: retries }, 'Operation failed, retrying...');
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
  }
}

/**
 * Circuit Breaker factory
 */
export function createCircuitBreaker<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  name: string
) {
  const options = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
    resetTimeout: 30000, // After 30 seconds, try again.
  };

  const breaker = new CircuitBreaker(fn, options);

  breaker.on('open', () => logger.error(`Circuit Breaker [${name}] is OPEN`));
  breaker.on('halfOpen', () => logger.warn(`Circuit Breaker [${name}] is HALF-OPEN`));
  breaker.on('close', () => logger.info(`Circuit Breaker [${name}] is CLOSED`));

  return breaker;
}

/**
 * Timeout helper
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}
