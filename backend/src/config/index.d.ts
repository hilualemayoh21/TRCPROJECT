export declare const config: Readonly<{
    env: "development" | "production" | "test" | "staging";
    isDev: boolean;
    isProd: boolean;
    isStaging: boolean;
    port: number;
    dbUrl: string;
    redisUrl: string;
    jwtSecret: string;
    refreshSecret: string;
    rateLimitWindow: number;
    rateLimitMax: number;
    logLevel: "error" | "debug" | "info" | "warn";
}>;
export type Config = typeof config;
//# sourceMappingURL=index.d.ts.map