/**
 * ARDF Client - Simplified wrapper for the ARDF API
 *
 * @example
 * ```typescript
 * import { ARDFClient } from '@ardf/sdk';
 *
 * const client = new ARDFClient({
 *   baseUrl: 'https://ardf.dev',
 *   token: 'your-jwt-token'
 * });
 *
 * // Discover skills
 * const skills = await client.skills.discover('send email');
 *
 * // Create an agent
 * const agent = await client.agents.create({
 *   name: 'My Email Bot',
 *   framework: 'custom'
 * });
 * ```
 */

import { OpenAPI } from './core/OpenAPI';
import {
  AgentsService,
  AuthenticationService,
  CredentialsService,
  DashboardService,
  SkillsService
} from './index';

export interface ARDFClientConfig {
  /**
   * Base URL of the ARDF API
   * @default 'https://ardf.dev'
   */
  baseUrl?: string;

  /**
   * JWT authentication token
   * Get this from /api/auth/login
   */
  token?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Main ARDF Client class
 */
export class ARDFClient {
  /**
   * Authentication operations
   */
  public readonly auth: AuthClient;

  /**
   * Skills discovery and management
   */
  public readonly skills: SkillsClient;

  /**
   * Agent management
   */
  public readonly agents: AgentsClient;

  /**
   * Credential vault operations
   */
  public readonly credentials: CredentialsClient;

  /**
   * Dashboard analytics
   */
  public readonly dashboard: DashboardClient;

  constructor(config: ARDFClientConfig = {}) {
    // Configure OpenAPI client
    OpenAPI.BASE = config.baseUrl || 'https://ardf.dev';
    OpenAPI.TOKEN = config.token;

    if (config.timeout) {
      // @ts-ignore - OpenAPI client supports timeout
      OpenAPI.TIMEOUT = config.timeout;
    }

    // Initialize sub-clients
    this.auth = new AuthClient();
    this.skills = new SkillsClient();
    this.agents = new AgentsClient();
    this.credentials = new CredentialsClient();
    this.dashboard = new DashboardClient();
  }

  /**
   * Update the authentication token
   */
  public setToken(token: string): void {
    OpenAPI.TOKEN = token;
  }

  /**
   * Update the base URL
   */
  public setBaseUrl(baseUrl: string): void {
    OpenAPI.BASE = baseUrl;
  }
}

/**
 * Authentication client with simplified methods
 */
class AuthClient {
  /**
   * Register a new user
   */
  async register(email: string, username: string, password: string) {
    return AuthenticationService.registerUser({
      requestBody: { email, username, password }
    });
  }

  /**
   * Login and get JWT token
   */
  async login(email: string, password: string) {
    return AuthenticationService.loginUser({
      requestBody: { email, password }
    });
  }

  /**
   * Get current user information
   */
  async me() {
    return AuthenticationService.getCurrentUser();
  }

  /**
   * Check usage quota
   */
  async quota() {
    return AuthenticationService.getQuota();
  }
}

/**
 * Skills client with simplified methods
 */
class SkillsClient {
  /**
   * Discover skills by natural language intent
   *
   * @param intent - What you need (e.g., "send email", "process payments")
   * @param options - Discovery options
   * @returns Ranked list of relevant skills
   */
  async discover(intent: string, options?: {
    agentId?: number;
    budget?: 'free_only' | 'free_preferred' | 'any';
    reliability?: 'high' | 'enterprise';
    topK?: number;
  }) {
    return SkillsService.discoverSkills({
      requestBody: {
        intent,
        agent_id: options?.agentId,
        context: options ? {
          budget: options.budget,
          reliability: options.reliability,
        } : undefined,
        top_k: options?.topK || 5,
      }
    });
  }

  /**
   * Discover skills using parallel OSWP (2-4x faster)
   */
  async discoverParallel(intent: string, options?: {
    topK?: number;
    budget?: 'free_only' | 'free_preferred' | 'any';
    reliability?: 'high' | 'enterprise';
    mergeStrategy?: 'first-wins' | 'highest-confidence' | 'consensus';
  }) {
    return SkillsService.discoverSkillsParallel({
      requestBody: {
        intent,
        top_k: options?.topK || 5,
        budget: options?.budget,
        reliability: options?.reliability,
        merge_strategy: options?.mergeStrategy,
      }
    });
  }

  /**
   * Publish a new skill to the marketplace
   */
  async publish(skill: {
    name: string;
    description: string;
    category: 'api' | 'library' | 'tool' | 'dataset' | 'template';
    capabilities: string[];
    pricingModel: 'free' | 'freemium' | 'paid' | 'enterprise';
    requiresCredentials?: boolean;
    requiredService?: 'stripe' | 'openai' | 'anthropic' | 'resend' | 'twilio' | 'sendgrid' | 'github' | 'custom';
    visibilityType?: 'public' | 'private';
    slug?: string;
  }) {
    return SkillsService.publishSkill({
      requestBody: {
        name: skill.name,
        description: skill.description,
        category: skill.category,
        capabilities: skill.capabilities,
        pricing_model: skill.pricingModel,
        requires_credentials: skill.requiresCredentials,
        required_service: skill.requiredService as any,
        visibility_type: skill.visibilityType,
        slug: skill.slug,
      }
    });
  }

  /**
   * List skills with filters
   */
  async list(filters?: {
    category?: 'api' | 'library' | 'tool' | 'dataset' | 'template';
    pricing?: 'free' | 'freemium' | 'paid' | 'enterprise';
    verified?: boolean;
    minTrust?: number;
    limit?: number;
    offset?: number;
  }) {
    return SkillsService.listSkills({
      category: filters?.category,
      pricing: filters?.pricing,
      verified: filters?.verified,
      minTrust: filters?.minTrust,
      limit: filters?.limit,
      offset: filters?.offset,
    });
  }

  /**
   * Get skill details by ID or slug
   */
  async get(slugOrId: string | number) {
    return SkillsService.getSkill({
      slug: String(slugOrId)
    });
  }

  /**
   * Update a skill you created
   */
  async update(id: number, updates: {
    name?: string;
    description?: string;
    longDescription?: string;
    category?: 'api' | 'library' | 'tool' | 'dataset' | 'template';
    capabilities?: string[];
    tags?: string[];
    pricingModel?: 'free' | 'freemium' | 'paid' | 'enterprise';
    costEstimate?: string;
    docsUrl?: string;
    homepageUrl?: string;
  }) {
    return SkillsService.updateSkill({
      id,
      requestBody: {
        name: updates.name,
        description: updates.description,
        long_description: updates.longDescription,
        category: updates.category,
        capabilities: updates.capabilities,
        tags: updates.tags,
        pricing_model: updates.pricingModel,
        cost_estimate: updates.costEstimate,
        docs_url: updates.docsUrl,
        homepage_url: updates.homepageUrl,
      }
    });
  }

  /**
   * Delete a skill you created
   */
  async delete(id: number) {
    return SkillsService.deleteSkill({ id });
  }
}

/**
 * Agents client with simplified methods
 */
class AgentsClient {
  /**
   * Create a new AI agent
   */
  async create(agent: {
    name: string;
    description?: string;
    framework?: 'crewai' | 'langgraph' | 'autogen' | 'langchain' | 'custom';
    endpoint?: string;
  }) {
    return AgentsService.createAgent({
      requestBody: {
        name: agent.name,
        description: agent.description,
        framework: agent.framework || 'custom',
        endpoint: agent.endpoint,
      }
    });
  }

  /**
   * List all your agents
   */
  async list(status?: 'active' | 'inactive' | 'archived') {
    return AgentsService.listAgents({ status });
  }

  /**
   * Get agent details
   */
  async get(id: number) {
    return AgentsService.getAgent({ id });
  }

  /**
   * Update an agent
   */
  async update(id: number, updates: {
    name?: string;
    description?: string;
    framework?: 'crewai' | 'langgraph' | 'autogen' | 'langchain' | 'custom';
    endpoint?: string;
    status?: 'active' | 'inactive' | 'archived';
  }) {
    return AgentsService.updateAgent({
      id,
      requestBody: updates
    });
  }

  /**
   * Delete an agent
   */
  async delete(id: number) {
    return AgentsService.deleteAgent({ id });
  }

  /**
   * Assign a skill to an agent
   */
  async assignSkill(agentId: number, skillId: number, enabled: boolean = true) {
    return AgentsService.assignSkill({
      id: agentId,
      requestBody: {
        skill_id: skillId,
        enabled,
      }
    });
  }

  /**
   * Remove a skill from an agent
   */
  async removeSkill(agentId: number, skillId: number) {
    return AgentsService.removeSkill({
      id: agentId,
      skillId,
    });
  }

  /**
   * Enable or disable a skill for an agent
   */
  async toggleSkill(agentId: number, skillId: number, enabled: boolean) {
    return AgentsService.toggleSkill({
      id: agentId,
      skillId,
      requestBody: { enabled }
    });
  }

  /**
   * Assign a credential to an agent
   */
  async assignCredential(agentId: number, credentialId: number) {
    return AgentsService.assignCredential({
      id: agentId,
      requestBody: {
        credential_id: credentialId
      }
    });
  }

  /**
   * Remove a credential from an agent
   */
  async removeCredential(agentId: number, credentialId: number) {
    return AgentsService.removeCredential({
      id: agentId,
      credId: credentialId
    });
  }

  /**
   * Execute a skill with the agent
   *
   * @param agentId - Agent ID
   * @param skillSlug - Skill slug (e.g., "resend-email-api")
   * @param action - Action to perform (e.g., "send")
   * @param parameters - Action parameters
   */
  async executeSkill(
    agentId: number,
    skillSlug: string,
    action: string,
    parameters?: Record<string, any>
  ) {
    return AgentsService.executeSkill({
      agentId,
      requestBody: {
        skill_slug: skillSlug,
        action,
        parameters,
      }
    });
  }

  /**
   * Discover skills assigned to this agent
   */
  async discoverSkills(agentId: number, intent: string, topK: number = 5) {
    return AgentsService.discoverAgentSkills({
      agentId,
      requestBody: {
        intent,
        top_k: topK,
      }
    });
  }

  /**
   * Get execution history for an agent
   */
  async executions(agentId: number, options?: {
    limit?: number;
    status?: 'success' | 'error' | 'timeout';
  }) {
    return AgentsService.getExecutions({
      id: agentId,
      limit: options?.limit,
      status: options?.status,
    });
  }
}

/**
 * Credentials client with simplified methods
 */
class CredentialsClient {
  /**
   * Create a new encrypted credential
   */
  async create(credential: {
    name: string;
    value: string;
    service?: string;
    type?: 'api_key' | 'oauth_token' | 'bearer' | 'secret' | 'custom';
    expiresAt?: string;
    notes?: string;
  }) {
    return CredentialsService.createCredential({
      requestBody: {
        name: credential.name,
        value: credential.value,
        service: credential.service,
        type: credential.type || 'api_key',
        expires_at: credential.expiresAt,
        notes: credential.notes,
      }
    });
  }

  /**
   * List all your credentials (values are hidden)
   */
  async list() {
    return CredentialsService.listCredentials();
  }

  /**
   * Get credential details (value is hidden)
   */
  async get(id: number) {
    return CredentialsService.getCredential({ id });
  }

  /**
   * Update a credential
   */
  async update(id: number, updates: {
    name?: string;
    value?: string;
    expiresAt?: string;
    notes?: string;
  }) {
    return CredentialsService.updateCredential({
      id,
      requestBody: {
        name: updates.name,
        value: updates.value,
        expires_at: updates.expiresAt,
        notes: updates.notes,
      }
    });
  }

  /**
   * Delete a credential
   */
  async delete(id: number) {
    return CredentialsService.deleteCredential({ id });
  }

  /**
   * Get list of supported services
   */
  async services() {
    return CredentialsService.listServices();
  }

  /**
   * Get credentials expiring within 30 days
   */
  async expiring() {
    return CredentialsService.getExpiringCredentials();
  }
}

/**
 * Dashboard client for analytics
 */
class DashboardClient {
  /**
   * Get overall metrics
   */
  async metrics() {
    return DashboardService.getDashboardMetrics();
  }

  /**
   * Get recent activity feed
   */
  async activity(limit: number = 10) {
    return DashboardService.getActivity({ limit });
  }

  /**
   * Get usage over time for charts
   */
  async usageOverTime(period: 'day' | 'week' | 'month' = 'week') {
    return DashboardService.getUsageOverTime({ period });
  }

  /**
   * Get agent performance metrics
   */
  async agentPerformance() {
    return DashboardService.getAgentPerformance();
  }

  /**
   * Get skill usage statistics
   */
  async skillUsage() {
    return DashboardService.getSkillUsage();
  }

  /**
   * Get errors summary
   */
  async errorsSummary() {
    return DashboardService.getErrorsSummary();
  }
}

// Export everything
export * from './index';
export { ARDFClient as default };
