/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Activity = {
    id?: number;
    agent_name?: string;
    skill_name?: string;
    action?: string;
    status?: Activity.status;
    duration_ms?: number;
    created_at?: string;
    relative_time?: string;
};
export namespace Activity {
    export enum status {
        SUCCESS = 'success',
        ERROR = 'error',
        TIMEOUT = 'timeout',
    }
}

