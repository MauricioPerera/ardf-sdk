#!/usr/bin/env node

/**
 * ARDF MCP Server
 *
 * Gives Claude access to 100+ APIs through semantic search.
 * Built on Model Context Protocol (MCP) by Anthropic.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// ARDF API Configuration
const ARDF_API_BASE = process.env.ARDF_API_URL || 'http://127.0.0.1:3001';

/**
 * Available MCP Tools
 */
const TOOLS: Tool[] = [
  {
    name: 'discover_skills',
    description: 'Search for APIs, tools, and services using natural language. Returns the top 5 most relevant resources based on semantic similarity.',
    inputSchema: {
      type: 'object',
      properties: {
        intent: {
          type: 'string',
          description: 'What you want to do in natural language. Examples: "send transactional emails", "accept credit card payments", "get weather forecast"'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 5)',
          default: 5
        }
      },
      required: ['intent']
    }
  },
  {
    name: 'get_skill_details',
    description: 'Get detailed information about a specific API or tool by its slug or ID. Returns endpoint, authentication, pricing, documentation, and usage examples.',
    inputSchema: {
      type: 'object',
      properties: {
        skill_id: {
          type: 'string',
          description: 'The slug or ID of the skill (e.g., "resend-email-api", "stripe-payment-api")'
        }
      },
      required: ['skill_id']
    }
  },
  {
    name: 'list_skills',
    description: 'List all available skills, optionally filtered by category or verification status. Useful for browsing what\'s available.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category: api, library, tool, dataset',
          enum: ['api', 'library', 'tool', 'dataset']
        },
        verified: {
          type: 'boolean',
          description: 'Only show verified skills'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
          default: 20
        }
      }
    }
  }
];

/**
 * Fetch helper with error handling
 */
async function fetchJSON(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to fetch from ARDF API: ${error.message}`);
  }
}

/**
 * Tool: discover_skills
 */
async function discoverSkills(intent: string, limit: number = 5) {
  const data = await fetchJSON(`${ARDF_API_BASE}/api/skills/discover`, {
    method: 'POST',
    body: JSON.stringify({ intent, limit }),
  }) as any;

  if (!data.skills || data.skills.length === 0) {
    return {
      message: `No skills found for intent: "${intent}"`,
      suggestions: [
        'Try rephrasing your query',
        'Be more specific about what you want to do',
        'Example intents: "send emails", "process payments", "get weather data"'
      ]
    };
  }

  const results = data.skills.map((skill: any) => ({
    name: skill.name,
    slug: skill.slug,
    description: skill.description,
    category: skill.category,
    capabilities: skill.capabilities,
    endpoint: skill.endpoint,
    auth_type: skill.auth_type,
    pricing: skill.cost_estimate || skill.pricing_model,
    trust_score: skill.trust_score,
    relevance_score: skill.relevance_score,
    why_relevant: skill.why_relevant,
    quick_start: skill.quick_start
  }));

  return {
    query: intent,
    results_count: results.length,
    skills: results,
    next_steps: [
      `Use get_skill_details with slug to see full documentation`,
      `Try different queries to find alternatives`,
      `Check trust_score and pricing before using`
    ]
  };
}

/**
 * Tool: get_skill_details
 */
async function getSkillDetails(skillId: string) {
  // Try to fetch by slug first
  let data: any;

  try {
    // Assume it's a slug, fetch from /api/skills endpoint
    data = await fetchJSON(`${ARDF_API_BASE}/api/skills?slug=${skillId}`) as any;

    if (!data.skills || data.skills.length === 0) {
      // Try numeric ID
      data = await fetchJSON(`${ARDF_API_BASE}/api/skills/${skillId}`) as any;
    } else {
      data = data.skills[0];
    }
  } catch (error: any) {
    throw new Error(`Skill not found: ${skillId}. Try using discover_skills first.`);
  }

  return {
    skill: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      long_description: data.long_description,
      category: data.category,
      capabilities: data.capabilities,
      tags: data.tags,
      endpoint: data.endpoint,
      auth_type: data.auth_type,
      docs_url: data.docs_url,
      homepage_url: data.homepage_url,
      github_url: data.github_url,
      pricing_model: data.pricing_model,
      cost_estimate: data.cost_estimate,
      verified: data.verified,
      trust_score: data.trust_score,
      uptime_7d: data.uptime_7d,
      rating: data.rating,
      usage_count: data.usage_count,
      code_snippet: data.code_snippet,
      example_request: data.example_request,
      example_response: data.example_response
    },
    usage_tips: [
      `Read the documentation at: ${data.docs_url || 'N/A'}`,
      `Authentication type: ${data.auth_type}`,
      `Pricing: ${data.cost_estimate || data.pricing_model}`,
      data.verified ? '✅ This is a verified skill' : '⚠️ Unverified - use with caution'
    ]
  };
}

/**
 * Tool: list_skills
 */
async function listSkills(category?: string, verified?: boolean, limit: number = 20) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (verified !== undefined) params.append('verified', verified.toString());
  params.append('limit', limit.toString());

  const data = await fetchJSON(`${ARDF_API_BASE}/api/skills?${params.toString()}`) as any;

  if (!data.skills || data.skills.length === 0) {
    return {
      message: 'No skills found matching your criteria',
      total: 0,
      skills: []
    };
  }

  const skills = data.skills.map((skill: any) => ({
    name: skill.name,
    slug: skill.slug,
    description: skill.description,
    category: skill.category,
    verified: skill.verified,
    trust_score: skill.trust_score,
    pricing: skill.pricing_model
  }));

  return {
    total: data.total || skills.length,
    filters: { category, verified, limit },
    skills,
    tip: 'Use get_skill_details with any slug to see full information'
  };
}

/**
 * Main MCP Server
 */
async function main() {
  const server = new Server(
    {
      name: 'ardf-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'discover_skills': {
          const { intent, limit } = args as { intent: string; limit?: number };
          const result = await discoverSkills(intent, limit);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'get_skill_details': {
          const { skill_id } = args as { skill_id: string };
          const result = await getSkillDetails(skill_id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'list_skills': {
          const { category, verified, limit } = args as {
            category?: string;
            verified?: boolean;
            limit?: number;
          };
          const result = await listSkills(category, verified, limit);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('ARDF MCP Server running on stdio');
  console.error(`Connected to ARDF API at: ${ARDF_API_BASE}`);
  console.error('Available tools:', TOOLS.map(t => t.name).join(', '));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
