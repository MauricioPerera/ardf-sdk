# ARDF TypeScript SDK

Official TypeScript/JavaScript SDK for the ARDF (AI Resource Discovery Framework) platform.

[![npm version](https://img.shields.io/npm/v/@ardf/sdk.svg)](https://www.npmjs.com/package/@ardf/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 What is ARDF?

ARDF is a complete agent management platform that combines:

- **Skills Marketplace** - Semantic search for AI tools, APIs, and resources
- **Agent Management** - Create, manage, and execute AI agents with skills
- **Secure Credential Vault** - AES-256-GCM encrypted credential storage
- **Real-time Dashboard** - Monitor executions, success rates, and performance

## 🚀 Installation

```bash
npm install @ardf/sdk
# or
yarn add @ardf/sdk
# or
pnpm add @ardf/sdk
```

## 📦 Quick Start

```typescript
import { ARDFClient } from '@ardf/sdk';

// Initialize the client
const client = new ARDFClient({
  baseUrl: 'https://ardf.dev',
  token: 'your-jwt-token' // Get this from /api/auth/login
});

// Discover skills by natural language
const skills = await client.skills.discover('send transactional emails');

console.log(`Found ${skills.results} skills:`);
skills.skills?.forEach(skill => {
  console.log(`- ${skill.name} (trust: ${skill.trust_score}/100)`);
});
```

## 🔐 Authentication

### Register a new user

```typescript
const result = await client.auth.register(
  'user@example.com',
  'username',
  'SecurePassword123!'
);
```

### Login and get token

```typescript
const loginResult = await client.auth.login(
  'user@example.com',
  'SecurePassword123!'
);

// Set the token for subsequent requests
client.setToken(loginResult.token);
```

### Get current user info

```typescript
const user = await client.auth.me();
console.log('Current user:', user.user);
```

### Check usage quota

```typescript
const quota = await client.auth.quota();
console.log(`Quota: ${quota.quota_used}/${quota.quota_limit}`);
```

## 🔍 Skills Discovery

### Basic semantic search

```typescript
// Simple discovery
const skills = await client.skills.discover('process credit card payments');

// With filters
const skills = await client.skills.discover(
  'send notifications',
  {
    budget: 'free_preferred',
    reliability: 'high',
    topK: 5
  }
);
```

### Parallel discovery (2-4x faster)

```typescript
const skills = await client.skills.discoverParallel(
  'analyze sentiment in text',
  {
    topK: 3,
    mergeStrategy: 'highest-confidence'
  }
);

console.log(`Performance: ${skills.metadata?.speedup} speedup`);
```

### Browse skills by category

```typescript
const skills = await client.skills.list({
  category: 'api',
  verified: true,
  minTrust: 80,
  limit: 20
});
```

### Get skill details

```typescript
const skill = await client.skills.get('resend-email-api');
console.log('Skill:', skill.skill);
```

## 🤖 Agent Management

### Create an agent

```typescript
const agent = await client.agents.create({
  name: 'Email Bot',
  description: 'Automated email sending agent',
  framework: 'custom' // 'crewai' | 'langgraph' | 'autogen' | 'langchain' | 'custom'
});
```

### List agents

```typescript
const agents = await client.agents.list('active');
console.log(`Total agents: ${agents.total}`);
```

### Assign skills to agent

```typescript
// Assign a skill
await client.agents.assignSkill(agentId, skillId, true);

// Remove a skill
await client.agents.removeSkill(agentId, skillId);

// Toggle skill enabled/disabled
await client.agents.toggleSkill(agentId, skillId, false);
```

### Execute a skill

```typescript
const execution = await client.agents.executeSkill(
  agentId,
  'resend-email-api', // skill slug
  'send', // action
  {
    to: 'user@example.com',
    subject: 'Welcome!',
    html: '<h1>Hello</h1>'
  }
);

console.log(`Status: ${execution.status}`);
console.log(`Duration: ${execution.duration_ms}ms`);
```

### View execution history

```typescript
const executions = await client.agents.executions(agentId, {
  limit: 10,
  status: 'success'
});

console.log(`Total executions: ${executions.total}`);
```

## 🔐 Credential Management

### Create encrypted credentials

```typescript
const credential = await client.credentials.create({
  name: 'Stripe Production Key',
  service: 'stripe',
  type: 'api_key',
  value: 'sk_live_xxxxxxxxxxxxx',
  notes: 'Production key - expires 2025-12-31',
  expiresAt: '2025-12-31T00:00:00Z'
});

console.log('Credential created:', credential.credential.name);
// Note: value is encrypted and never returned in responses
```

### List credentials

```typescript
const credentials = await client.credentials.list();
console.log(`Total credentials: ${credentials.total}`);
// Values are never exposed in responses for security
```

### Assign credential to agent

```typescript
await client.agents.assignCredential(agentId, credentialId);
```

### Check expiring credentials

```typescript
const expiring = await client.credentials.expiring();
console.log(`${expiring.count} credentials expiring within 30 days`);
```

### List supported services

```typescript
const services = await client.credentials.services();
console.log('Supported services:', services.services);
```

## 📊 Dashboard & Analytics

### Get dashboard metrics

```typescript
const metrics = await client.dashboard.metrics();

console.log('Metrics:', {
  totalExecutions: metrics.executions?.total,
  successRate: metrics.success_rate,
  activeAgents: metrics.active_agents
});
```

### Get recent activity

```typescript
const activity = await client.dashboard.activity(10);
console.log('Recent activity:', activity.activity);
```

### Get usage over time

```typescript
const usage = await client.dashboard.usageOverTime('week');
console.log('Usage data:', usage.data);
```

### Get agent performance

```typescript
const performance = await client.dashboard.agentPerformance();
console.log('Agent performance:', performance.agents);
```

## 📝 Publishing Skills

### Publish a public skill

```typescript
const skill = await client.skills.publish({
  name: 'My Email Service',
  slug: 'my-email-service',
  description: 'Custom email service integration',
  category: 'api',
  capabilities: ['email', 'transactional'],
  pricingModel: 'freemium',
  requiresCredentials: true,
  requiredService: 'sendgrid',
  visibilityType: 'public' // Requires admin verification
});
```

### Publish a private skill

```typescript
const skill = await client.skills.publish({
  name: 'Internal CRM',
  slug: 'internal-crm',
  description: 'Private CRM integration',
  category: 'api',
  capabilities: ['crm', 'contacts'],
  pricingModel: 'free',
  visibilityType: 'private' // Automatically verified, only visible to you
});
```

### Update a skill

```typescript
await client.skills.update(skillId, {
  description: 'Updated description',
  capabilities: ['email', 'transactional', 'marketing'],
  tags: ['communication', 'api'],
  docsUrl: 'https://docs.example.com',
  homepageUrl: 'https://example.com'
});
```

### Delete a skill

```typescript
await client.skills.delete(skillId);
```

## 🛠️ Advanced Configuration

### Custom base URL

```typescript
const client = new ARDFClient({
  baseUrl: 'http://localhost:3001', // For development
  token: 'your-token'
});
```

### Request timeout

```typescript
const client = new ARDFClient({
  baseUrl: 'https://ardf.dev',
  token: 'your-token',
  timeout: 60000 // 60 seconds
});
```

### Update token dynamically

```typescript
client.setToken('new-jwt-token');
```

## 🔒 Security Features

### Credential Encryption

- All credential values are encrypted using **AES-256-GCM**
- Unique initialization vector (IV) per credential
- Values are **NEVER** exposed in API responses
- Automatic decryption during skill execution only

### Best Practices

```typescript
// Monitor expiring credentials
const expiring = await client.credentials.expiring();
if (expiring.count > 0) {
  console.log('⚠️  You have expiring credentials!');
  expiring.credentials?.forEach(cred => {
    console.log(`- ${cred.name} expires on ${cred.expires_at}`);
  });
}

// Rotate credentials regularly (every 90 days recommended)
await client.credentials.update(credId, {
  value: 'new-secure-key',
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
});
```

## 📚 Examples

Check out the [examples directory](./examples) for complete working examples:

- **[01-quick-start.ts](./examples/01-quick-start.ts)** - Complete quick start guide
- **[02-skill-discovery.ts](./examples/02-skill-discovery.ts)** - Advanced skill discovery
- **[03-agent-execution.ts](./examples/03-agent-execution.ts)** - Agent skill execution
- **[04-publish-skill.ts](./examples/04-publish-skill.ts)** - Publishing your own skills

### Running examples

```bash
# Set your token
export ARDF_TOKEN="your-jwt-token"

# Run an example
npx tsx examples/01-quick-start.ts
```

## 🐛 Error Handling

```typescript
try {
  const skills = await client.skills.discover('send email');
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded
    console.log('Rate limit:', error.body.limit);
    console.log('Resets at:', error.body.reset_at);
  } else if (error.status === 401) {
    // Unauthorized
    console.log('Invalid or expired token');
  } else if (error.status === 400) {
    // Validation error
    console.log('Validation errors:', error.body.details);
  } else {
    // Generic error
    console.log('Error:', error.message);
  }
}
```

## 📖 API Documentation

Full API documentation available at:
- **Interactive Docs**: https://ardf.dev/api/docs
- **OpenAPI Spec**: https://ardf.dev/openapi.json

## 🤝 Support

- **Documentation**: https://ardf.dev/documentation.html
- **GitHub Issues**: https://github.com/ardf/sdk/issues
- **Email**: support@ardf.dev

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details

## 🔗 Links

- **Website**: https://ardf.dev
- **Platform**: https://ardf.dev/ardf/dashboard.html
- **API Docs**: https://ardf.dev/api/docs
- **npm**: https://www.npmjs.com/package/@ardf/sdk

## 🌟 Features

- ✅ **Type-safe** - Full TypeScript support with auto-generated types
- ✅ **Promise-based** - Modern async/await API
- ✅ **Tree-shakeable** - Only bundle what you use
- ✅ **Zero dependencies** - Lightweight and fast
- ✅ **Rate limiting** - Built-in rate limit handling
- ✅ **Error handling** - Comprehensive error types
- ✅ **Cancellable requests** - Cancel in-flight requests
- ✅ **Browser & Node.js** - Works everywhere JavaScript runs

## 🚦 Rate Limits

- **Unauthenticated**: 100 discoveries/day, 10 executions/day
- **Free tier**: Unlimited discoveries, 3 agents max
- **Pro tier** ($29/mo): Unlimited discoveries, unlimited agents

Check your quota:

```typescript
const quota = await client.auth.quota();
console.log(`${quota.quota_remaining} of ${quota.quota_limit} remaining`);
```

## 🔄 Migration Guide

### From direct API calls

**Before:**
```typescript
const response = await fetch('https://ardf.dev/api/skills/discover', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ intent: 'send email' })
});
const data = await response.json();
```

**After:**
```typescript
const skills = await client.skills.discover('send email');
```

---

Made with ❤️ by the ARDF team
