/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RateLimitError = {
    error: RateLimitError.error;
    message: string;
    /**
     * Maximum requests allowed in window
     */
    limit: number;
    /**
     * Time window for rate limit
     */
    window: string;
    /**
     * When the rate limit resets
     */
    reset_at: string;
    upgrade_url?: string;
};
export namespace RateLimitError {
    export enum error {
        RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
    }
}

