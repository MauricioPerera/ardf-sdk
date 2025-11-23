/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Execution = {
    id?: number;
    agent_id?: number;
    agent_name?: string;
    skill_id?: number;
    skill_name?: string;
    action?: string;
    status?: Execution.status;
    duration_ms?: number;
    error_message?: string;
    /**
     * Parameters sent to the skill
     */
    request_data?: Record<string, any>;
    /**
     * Response from the skill
     */
    response_data?: Record<string, any>;
    created_at?: string;
};
export namespace Execution {
    export enum status {
        SUCCESS = 'success',
        ERROR = 'error',
        TIMEOUT = 'timeout',
    }
}

