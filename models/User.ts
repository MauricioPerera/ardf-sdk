/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    id?: number;
    email?: string;
    username?: string;
    plan?: User.plan;
    role?: User.role;
    quota_remaining?: number;
    created_at?: string;
};
export namespace User {
    export enum plan {
        FREE = 'free',
        PRO = 'pro',
        ENTERPRISE = 'enterprise',
    }
    export enum role {
        USER = 'user',
        ADMIN = 'admin',
    }
}

