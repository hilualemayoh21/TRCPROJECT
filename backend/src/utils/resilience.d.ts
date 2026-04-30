import CircuitBreaker from 'opossum';
/**
 * Simple retry helper for transient failures
 */
export declare function withRetry<T>(fn: () => Promise<T>, retries?: number, delay?: number): Promise<T>;
/**
 * Circuit Breaker factory
 */
export declare function createCircuitBreaker<T, Args extends any[]>(fn: (...args: Args) => Promise<T>, name: string): CircuitBreaker<Args, T>;
/**
 * Timeout helper
 */
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T>;
//# sourceMappingURL=resilience.d.ts.map