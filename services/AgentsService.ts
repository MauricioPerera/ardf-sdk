/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Agent } from '../models/Agent';
import type { Execution } from '../models/Execution';
import type { Skill } from '../models/Skill';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AgentsService {
    /**
     * List all agents
     * Get all agents belonging to the authenticated user
     * @returns any List of agents
     * @throws ApiError
     */
    public static listAgents({
        status,
    }: {
        /**
         * Filter by agent status
         */
        status?: 'active' | 'inactive' | 'archived',
    }): CancelablePromise<{
        agents?: Array<Agent>;
        total?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Create a new agent
     * Create a new AI agent
     * @returns any Agent created successfully
     * @throws ApiError
     */
    public static createAgent({
        requestBody,
    }: {
        requestBody: {
            name: string;
            description?: string;
            framework?: 'crewai' | 'langgraph' | 'autogen' | 'langchain' | 'custom';
            /**
             * Optional webhook endpoint for async execution results
             */
            endpoint?: string;
        },
    }): CancelablePromise<{
        success?: boolean;
        agent?: Agent;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get agent details
     * Get detailed information about a specific agent
     * @returns any Agent details
     * @throws ApiError
     */
    public static getAgent({
        id,
    }: {
        id: number,
    }): CancelablePromise<{
        agent?: Agent;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Agent not found`,
            },
        });
    }
    /**
     * Update agent
     * Update agent properties
     * @returns any Agent updated successfully
     * @throws ApiError
     */
    public static updateAgent({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: {
            name?: string;
            description?: string;
            framework?: 'crewai' | 'langgraph' | 'autogen' | 'langchain' | 'custom';
            endpoint?: string;
            status?: 'active' | 'inactive' | 'archived';
        },
    }): CancelablePromise<{
        success?: boolean;
        agent?: Agent;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/agents/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Agent not found`,
            },
        });
    }
    /**
     * Delete agent
     * Permanently delete an agent
     * @returns any Agent deleted successfully
     * @throws ApiError
     */
    public static deleteAgent({
        id,
    }: {
        id: number,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/agents/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Agent not found`,
            },
        });
    }
    /**
     * Assign skill to agent
     * Add a skill to an agent
     * @returns any Skill assigned successfully
     * @throws ApiError
     */
    public static assignSkill({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: {
            skill_id: number;
            enabled?: boolean;
        },
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{id}/skills',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Enable/disable skill
     * Toggle skill enabled status for an agent
     * @returns any Skill status updated
     * @throws ApiError
     */
    public static toggleSkill({
        id,
        skillId,
        requestBody,
    }: {
        id: number,
        skillId: number,
        requestBody: {
            enabled: boolean;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/agents/{id}/skills/{skillId}',
            path: {
                'id': id,
                'skillId': skillId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove skill from agent
     * Unassign a skill from an agent
     * @returns any Skill removed successfully
     * @throws ApiError
     */
    public static removeSkill({
        id,
        skillId,
    }: {
        id: number,
        skillId: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/agents/{id}/skills/{skillId}',
            path: {
                'id': id,
                'skillId': skillId,
            },
        });
    }
    /**
     * Assign credential to agent
     * Add a credential to an agent
     * @returns any Credential assigned successfully
     * @throws ApiError
     */
    public static assignCredential({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: {
            credential_id: number;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{id}/credentials',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove credential from agent
     * Unassign a credential from an agent
     * @returns any Credential removed successfully
     * @throws ApiError
     */
    public static removeCredential({
        id,
        credId,
    }: {
        id: number,
        credId: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/agents/{id}/credentials/{credId}',
            path: {
                'id': id,
                'credId': credId,
            },
        });
    }
    /**
     * Execute a skill
     * Execute a skill assigned to an agent with automatic credential injection.
     *
     * **How it works:**
     * 1. Agent executes a skill
     * 2. System checks if skill requires credentials
     * 3. Finds agent's assigned credential for that service
     * 4. Decrypts credential value (AES-256-GCM)
     * 5. Injects credential into execution
     * 6. Returns execution result
     * @returns Execution Skill executed successfully
     * @throws ApiError
     */
    public static executeSkill({
        agentId,
        requestBody,
    }: {
        agentId: number,
        requestBody: {
            skill_slug: string;
            action: string;
            /**
             * Parameters for the skill execution
             */
            parameters?: Record<string, any>;
        },
    }): CancelablePromise<Execution> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{agentId}/execute-skill',
            path: {
                'agentId': agentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid parameters or skill not assigned`,
                403: `Missing required credential`,
            },
        });
    }
    /**
     * Discover skills for agent
     * Semantic search limited to skills assigned to this agent
     * @returns any Skills discovered
     * @throws ApiError
     */
    public static discoverAgentSkills({
        agentId,
        requestBody,
    }: {
        agentId: number,
        requestBody: {
            intent: string;
            top_k?: number;
        },
    }): CancelablePromise<{
        query?: string;
        results?: number;
        skills?: Array<Skill>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/agents/{agentId}/discover-skills',
            path: {
                'agentId': agentId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get execution history
     * Get execution history for a specific agent
     * @returns any Execution history
     * @throws ApiError
     */
    public static getExecutions({
        id,
        limit = 50,
        status,
    }: {
        id: number,
        limit?: number,
        status?: 'success' | 'error' | 'timeout',
    }): CancelablePromise<{
        executions?: Array<Execution>;
        total?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/agents/{id}/executions',
            path: {
                'id': id,
            },
            query: {
                'limit': limit,
                'status': status,
            },
        });
    }
}
