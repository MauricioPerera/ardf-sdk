/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Skill } from '../models/Skill';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SkillsService {
    /**
     * Discover skills by intent
     * Semantic search for skills using natural language. Returns ranked results based on relevance, trust score, and context.
     *
     * **Agent Scoping**: When called by an agent (with agent_id parameter), this endpoint only returns skills that have been explicitly assigned to that agent by the user via the agent management dashboard.
     *
     * **Usage**:
     * - **For Users**: Omit agent_id to browse all available skills in the marketplace
     * - **For Agents**: Include agent_id to get only assigned skills (respects agent_skill_assignments)
     * @returns any Successfully discovered skills
     * @throws ApiError
     */
    public static discoverSkills({
        requestBody,
    }: {
        requestBody: {
            /**
             * Natural language description of what you need
             */
            intent: string;
            /**
             * Optional: Filter results to skills assigned to this agent
             */
            agent_id?: number;
            context?: {
                /**
                 * Budget preference for API selection
                 */
                budget?: 'free_only' | 'free_preferred' | 'any';
                /**
                 * Required reliability level
                 */
                reliability?: 'high' | 'enterprise';
                /**
                 * Maximum acceptable latency in milliseconds
                 */
                max_latency_ms?: number;
            };
            /**
             * Number of results to return
             */
            top_k?: number;
        },
    }): CancelablePromise<{
        query?: string;
        results?: number;
        skills?: Array<Skill>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/skills/discover',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - intent is required`,
                429: `Rate limit exceeded (unauthenticated users only)`,
            },
        });
    }
    /**
     * Publish a new skill
     * Publish your API or service as a skill in the ARDF marketplace.
     *
     * **Visibility Options:**
     * - **Public**: Visible to all users, but requires admin verification. Use for skills you want to share with the community.
     * - **Private**: Only visible to you, automatically verified. Use for personal integrations or testing.
     *
     * **Credentials:**
     * If your skill requires API credentials (API keys, tokens), set `requires_credentials: true` and specify the `required_service` identifier.
     * @returns any Skill published successfully
     * @throws ApiError
     */
    public static publishSkill({
        requestBody,
    }: {
        requestBody: {
            /**
             * Clear, descriptive name for your skill
             */
            name: string;
            /**
             * URL-friendly identifier (auto-generated if not provided)
             */
            slug?: string;
            /**
             * Clear, concise description
             */
            description: string;
            /**
             * Skill category
             */
            category: 'api' | 'library' | 'tool' | 'dataset' | 'template';
            /**
             * List of capabilities
             */
            capabilities: Array<string>;
            pricing_model: 'free' | 'freemium' | 'paid' | 'enterprise';
            /**
             * Whether this skill requires API credentials
             */
            requires_credentials?: boolean;
            /**
             * Service identifier for credentials
             */
            required_service?: 'stripe' | 'openai' | 'anthropic' | 'resend' | 'twilio' | 'sendgrid' | 'github' | 'custom';
            visibility_type?: 'public' | 'private';
        },
    }): CancelablePromise<{
        message?: string;
        skill?: Skill;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/skills/publish',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - Missing required fields`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * List and browse skills
     * Browse all available skills with advanced filtering. Shows public skills and your own private skills if authenticated.
     *
     * **Filters:**
     * - category: Filter by skill category (api, library, tool, dataset, template)
     * - pricing: Filter by pricing model (free, freemium, paid, enterprise)
     * - verified: Show only verified skills
     * - min_trust: Minimum trust score (0-100)
     * @returns any List of skills
     * @throws ApiError
     */
    public static listSkills({
        category,
        pricing,
        verified,
        minTrust,
        limit = 20,
        offset,
    }: {
        /**
         * Filter by category
         */
        category?: 'api' | 'library' | 'tool' | 'dataset' | 'template',
        /**
         * Filter by pricing model
         */
        pricing?: 'free' | 'freemium' | 'paid' | 'enterprise',
        /**
         * Show only verified skills
         */
        verified?: boolean,
        /**
         * Minimum trust score (0-100)
         */
        minTrust?: number,
        /**
         * Number of results to return
         */
        limit?: number,
        /**
         * Pagination offset
         */
        offset?: number,
    }): CancelablePromise<{
        skills?: Array<Skill>;
        pagination?: {
            /**
             * Maximum items per page
             */
            limit: number;
            /**
             * Starting position
             */
            offset: number;
            /**
             * Number of items in this response
             */
            returned: number;
            /**
             * Total items available (optional)
             */
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/skills',
            query: {
                'category': category,
                'pricing': pricing,
                'verified': verified,
                'min_trust': minTrust,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get skill details
     * Get detailed information about a specific skill by ID or slug
     * @returns any Skill details
     * @throws ApiError
     */
    public static getSkill({
        slug,
    }: {
        /**
         * Skill ID (number) or slug (string)
         */
        slug: string,
    }): CancelablePromise<{
        skill?: Skill;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/skills/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                404: `Skill not found`,
            },
        });
    }
    /**
     * Update skill
     * Update a skill you created. Only the skill creator can update it.
     * @returns any Skill updated successfully
     * @throws ApiError
     */
    public static updateSkill({
        id,
        requestBody,
    }: {
        /**
         * Skill ID
         */
        id: number,
        requestBody: {
            name?: string;
            description?: string;
            /**
             * Extended description with more details
             */
            long_description?: string;
            category?: 'api' | 'library' | 'tool' | 'dataset' | 'template';
            capabilities?: Array<string>;
            tags?: Array<string>;
            pricing_model?: 'free' | 'freemium' | 'paid' | 'enterprise';
            cost_estimate?: string;
            docs_url?: string;
            homepage_url?: string;
        },
    }): CancelablePromise<{
        message?: string;
        skill?: Skill;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/skills/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No fields to update`,
                403: `You can only update your own skills`,
                404: `Skill not found`,
            },
        });
    }
    /**
     * Delete skill
     * Permanently delete a skill you created. Only the skill creator can delete it.
     * @returns any Skill deleted successfully
     * @throws ApiError
     */
    public static deleteSkill({
        id,
    }: {
        /**
         * Skill ID
         */
        id: number,
    }): CancelablePromise<{
        message?: string;
        skill_name?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/skills/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `You can only delete your own skills`,
                404: `Skill not found`,
            },
        });
    }
    /**
     * Parallel skill discovery (2-4x faster)
     * Advanced semantic search using OSWP (Optimistic Worker Scheduling Protocol) with 4 parallel discovery methods:
     *
     * **Parallel Methods:**
     * - **Cache lookup** (~50ms, 95% confidence) - Fastest, checks recent queries
     * - **Vector search** (~200ms, 80% confidence) - Semantic similarity using embeddings
     * - **Keyword search** (~150ms, 70% confidence) - Traditional text matching
     * - **LLM generation** (~500ms, 60% confidence) - AI-powered skill matching
     *
     * **Merge Strategies:**
     * - `first-wins`: Return first successful result (lowest latency)
     * - `highest-confidence`: Return result with highest confidence score (default)
     * - `consensus`: Combine results from multiple sources for best accuracy
     *
     * **Performance:** Typically 2-4x faster than standard discovery endpoint.
     *
     * **Use Cases:**
     * - Real-time agent skill discovery
     * - Interactive UI with instant results
     * - High-throughput batch processing
     * @returns any Successfully discovered skills with performance metadata
     * @throws ApiError
     */
    public static discoverSkillsParallel({
        requestBody,
    }: {
        requestBody: {
            /**
             * Natural language description of what you need
             */
            intent: string;
            /**
             * Number of results to return
             */
            top_k?: number;
            /**
             * Budget preference for API selection
             */
            budget?: 'free_only' | 'free_preferred' | 'any';
            /**
             * Required reliability level
             */
            reliability?: 'high' | 'enterprise';
            /**
             * How to combine results from parallel sources
             */
            merge_strategy?: 'first-wins' | 'highest-confidence' | 'consensus';
        },
    }): CancelablePromise<{
        query?: string;
        results?: number;
        skills?: Array<Skill>;
        /**
         * Performance metrics from parallel execution
         */
        metadata?: {
            method?: string;
            mergeStrategy?: string;
            sources?: Array<string>;
            /**
             * Number of sources that returned results
             */
            successfulSources?: number;
            /**
             * Total execution time in milliseconds
             */
            totalLatency?: number;
            /**
             * Estimated time for sequential execution
             */
            sequential_would_take?: number;
            /**
             * Performance improvement vs sequential
             */
            speedup?: string;
            /**
             * Average confidence score of results
             */
            averageConfidence?: number;
            /**
             * Whether results were served from cache
             */
            cacheHit?: boolean;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/skills/discover-parallel',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - intent is required`,
                429: `Rate limit exceeded (unauthenticated users only)`,
                500: `Parallel discovery failed`,
            },
        });
    }
}
