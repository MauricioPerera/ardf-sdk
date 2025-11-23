/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Credential } from '../models/Credential';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CredentialsService {
    /**
     * List credentials
     * Get all credentials for the authenticated user. Values are never exposed in API responses.
     * @returns any List of credentials (values hidden)
     * @throws ApiError
     */
    public static listCredentials(): CancelablePromise<{
        credentials?: Array<Credential>;
        total?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/credentials',
        });
    }
    /**
     * Create credential
     * Create a new encrypted credential. Value is encrypted with AES-256-GCM before storage.
     * @returns any Credential created successfully
     * @throws ApiError
     */
    public static createCredential({
        requestBody,
    }: {
        requestBody: {
            name: string;
            /**
             * Service identifier
             */
            service?: string;
            type?: 'api_key' | 'oauth_token' | 'bearer' | 'secret' | 'custom';
            /**
             * The credential value (will be encrypted)
             */
            value: string;
            /**
             * Optional expiration date
             */
            expires_at?: string;
            /**
             * Optional notes about this credential
             */
            notes?: string;
        },
    }): CancelablePromise<{
        success?: boolean;
        credential?: Credential;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/credentials',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get credential details
     * Get credential metadata (value is never exposed)
     * @returns any Credential details
     * @throws ApiError
     */
    public static getCredential({
        id,
    }: {
        id: number,
    }): CancelablePromise<{
        credential?: Credential;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/credentials/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update credential
     * Update credential properties or rotate value
     * @returns any Credential updated
     * @throws ApiError
     */
    public static updateCredential({
        id,
        requestBody,
    }: {
        id: number,
        requestBody?: {
            name?: string;
            /**
             * New encrypted value
             */
            value?: string;
            expires_at?: string;
            notes?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/credentials/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete credential
     * Permanently delete a credential
     * @returns any Credential deleted successfully
     * @throws ApiError
     */
    public static deleteCredential({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/credentials/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List supported services
     * Get list of supported services for credentials
     * @returns any List of services
     * @throws ApiError
     */
    public static listServices(): CancelablePromise<{
        services?: Array<{
            id?: string;
            name?: string;
            description?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/credentials/services',
        });
    }
    /**
     * Get expiring credentials
     * Get credentials expiring within the next 30 days
     * @returns any List of expiring credentials
     * @throws ApiError
     */
    public static getExpiringCredentials(): CancelablePromise<{
        credentials?: Array<Credential>;
        count?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/credentials/expiring',
        });
    }
}
