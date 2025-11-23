/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register new user
     * @returns any User registered successfully
     * @throws ApiError
     */
    public static registerUser({
        requestBody,
    }: {
        requestBody: {
            email: string;
            username: string;
            password: string;
        },
    }): CancelablePromise<{
        message?: string;
        user?: {
            id?: number;
            email?: string;
            username?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input or user already exists`,
            },
        });
    }
    /**
     * Login user
     * @returns any Login successful
     * @throws ApiError
     */
    public static loginUser({
        requestBody,
    }: {
        requestBody: {
            email: string;
            password: string;
        },
    }): CancelablePromise<{
        /**
         * JWT token for authentication
         */
        token?: string;
        user?: User;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }
    /**
     * Get current user
     * Retrieve information about the authenticated user
     * @returns any User information retrieved successfully
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<{
        user?: User;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
            errors: {
                401: `Unauthorized - Invalid or missing JWT token`,
            },
        });
    }
    /**
     * Check usage quota
     * Get current usage quota and limits for the authenticated user
     * @returns any Quota information retrieved successfully
     * @throws ApiError
     */
    public static getQuota(): CancelablePromise<{
        plan?: 'free' | 'pro' | 'enterprise';
        /**
         * Total discoveries allowed per month
         */
        quota_limit?: number;
        /**
         * Discoveries used this month
         */
        quota_used?: number;
        /**
         * Discoveries remaining this month
         */
        quota_remaining?: number;
        /**
         * When quota resets
         */
        reset_date?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/quota',
            errors: {
                401: `Unauthorized - Invalid or missing JWT token`,
            },
        });
    }
}
