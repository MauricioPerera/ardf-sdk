/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Activity } from '../models/Activity';
import type { DashboardMetrics } from '../models/DashboardMetrics';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardService {
    /**
     * Get dashboard metrics
     * Get overall metrics for the authenticated user
     * @returns DashboardMetrics Dashboard metrics
     * @throws ApiError
     */
    public static getDashboardMetrics(): CancelablePromise<DashboardMetrics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/metrics',
        });
    }
    /**
     * Get recent activity
     * Get recent execution activity feed
     * @returns any Activity feed
     * @throws ApiError
     */
    public static getActivity({
        limit = 10,
    }: {
        limit?: number,
    }): CancelablePromise<{
        activity?: Array<Activity>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/activity',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get usage over time
     * Get execution usage statistics over time for charts
     * @returns any Usage statistics
     * @throws ApiError
     */
    public static getUsageOverTime({
        period = 'week',
    }: {
        period?: 'day' | 'week' | 'month',
    }): CancelablePromise<{
        data?: Array<{
            date?: string;
            executions?: number;
            success?: number;
            errors?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/usage-over-time',
            query: {
                'period': period,
            },
        });
    }
    /**
     * Get agent performance
     * Get performance metrics for each agent
     * @returns any Agent performance metrics
     * @throws ApiError
     */
    public static getAgentPerformance(): CancelablePromise<{
        agents?: Array<{
            agent_id?: number;
            agent_name?: string;
            total_executions?: number;
            success_rate?: number;
            avg_duration_ms?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/agent-performance',
        });
    }
    /**
     * Get skill usage statistics
     * Get usage statistics for skills
     * @returns any Skill usage statistics
     * @throws ApiError
     */
    public static getSkillUsage(): CancelablePromise<{
        skills?: Array<{
            skill_name?: string;
            executions?: number;
            success_rate?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/skill-usage',
        });
    }
    /**
     * Get errors summary
     * Get summary of recent errors
     * @returns any Errors summary
     * @throws ApiError
     */
    public static getErrorsSummary(): CancelablePromise<{
        total_errors?: number;
        errors_today?: number;
        recent_errors?: Array<{
            agent_name?: string;
            skill_name?: string;
            error_message?: string;
            timestamp?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/errors-summary',
        });
    }
}
