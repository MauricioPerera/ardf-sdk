/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DashboardMetrics = {
    executions?: {
        total?: number;
        today?: number;
        this_month?: number;
    };
    success_rate?: number;
    active_agents?: number;
    total_agents?: number;
    avg_response_time_ms?: number;
    most_active_agent?: {
        id?: number;
        name?: string;
        executions?: number;
    };
    most_used_skill?: {
        id?: number;
        name?: string;
        executions?: number;
    };
};

