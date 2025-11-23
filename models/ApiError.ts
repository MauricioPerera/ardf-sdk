/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApiError = {
    /**
     * Machine-readable error code (snake_case)
     */
    error: string;
    /**
     * User-friendly error message
     */
    message: string;
    /**
     * Additional error details (optional)
     */
    details?: Record<string, any>;
    /**
     * URL for upgrading plan (optional)
     */
    upgrade_url?: string;
};

