/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Credential object. The `value` field is NEVER exposed in API responses for security.
 */
export type Credential = {
    id?: number;
    name?: string;
    service?: string;
    type?: Credential.type;
    /**
     * Optional expiration date
     */
    expires_at?: string;
    notes?: string;
    created_at?: string;
};
export namespace Credential {
    export enum type {
        API_KEY = 'api_key',
        OAUTH_TOKEN = 'oauth_token',
        BEARER = 'bearer',
        SECRET = 'secret',
        CUSTOM = 'custom',
    }
}

