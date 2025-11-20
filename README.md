# ARDF MCP Server

> **Give Claude access to 100+ APIs through semantic search**

A Model Context Protocol (MCP) server that connects Claude to the ARDF marketplace - enabling semantic discovery and execution of APIs, tools, and services using natural language.

## 🚀 What is this?

Instead of manually finding and configuring APIs, Claude can now:

```
You: "Send a welcome email to new users"
Claude: *uses discover_skills("send transactional emails")*
Claude: "I found Resend Email API - it's perfect for this. Here's how to use it..."
```

**Before ARDF MCP:**
- You manually search for APIs
- You read documentation
- You write integration code
- You handle errors and fallbacks

**After ARDF MCP:**
- Claude searches 100+ APIs semantically
- Claude finds the right tool for your task
- Claude provides ready-to-use code snippets
- Claude suggests fallback options

## ✨ Features

- **Semantic Search**: Find APIs using natural language ("accept payments" → Stripe, PayPal, Square)
- **100+ Verified APIs**: Email, SMS, payments, weather, maps, AI, and more
- **Trust Scoring**: APIs ranked by reliability, uptime, and community validation
- **Cost Transparency**: See pricing before you commit
- **Smart Fallbacks**: Claude suggests alternatives if primary API fails
- **Zero Config**: Works out of the box with Claude Desktop

## 📦 Installation

### Option 1: NPX (Recommended)

```bash
npx @ardf/mcp-server
```

### Option 2: Global Install

```bash
npm install -g @ardf/mcp-server
```

### Option 3: Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ardf": {
      "command": "npx",
      "args": ["-y", "@ardf/mcp-server"]
    }
  }
}
```

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Restart Claude Desktop. Done!

## 🎯 Usage Examples

### Example 1: Send Emails

```
You: I need to send password reset emails
Claude: Let me find the best email API for you...

*Claude uses discover_skills("send transactional emails")*

Claude: I found Resend Email API (trust score: 95/100)
- Pricing: Free up to 100 emails/day, then $20/month
- Authentication: API Key
- Here's a code snippet to send emails...
```

### Example 2: Accept Payments

```
You: How do I accept credit card payments?
Claude: *uses discover_skills("accept credit card payments")*

Claude: I found 3 options:
1. Stripe Payment API (trust: 98/100) - $0.029 + 2.9% per transaction
2. PayPal Checkout (trust: 95/100) - 2.9% + $0.30
3. Square Payments (trust: 92/100) - 2.6% + $0.10

Which pricing model works best for you?
```

### Example 3: Get Weather Data

```
You: I need weather forecast for users' locations
Claude: *uses discover_skills("weather forecast API")*

Claude: Found OpenWeatherMap API (verified)
- Free tier: 1000 calls/day
- Data: 5-day forecast, hourly updates
- Here's how to integrate it...
```

## 🛠 Available Tools

### `discover_skills`
Search for APIs using natural language intent.

```javascript
// Claude uses this internally
discover_skills({
  intent: "send transactional emails",
  limit: 5
})

// Returns top 5 most relevant APIs with:
// - Name, description, capabilities
// - Endpoint, authentication type
// - Pricing, trust score, relevance score
// - Quick start code snippets
```

### `get_skill_details`
Get comprehensive info about a specific API.

```javascript
get_skill_details({
  skill_id: "resend-email-api"
})

// Returns:
// - Full documentation URL
// - Authentication details
// - Pricing breakdown
// - Code examples (request/response)
// - Uptime stats, ratings, usage count
```

### `list_skills`
Browse all available APIs, optionally filtered.

```javascript
list_skills({
  category: "api",
  verified: true,
  limit: 20
})

// Returns paginated list of skills
// Useful for exploring what's available
```

## 🎬 Real-World Use Cases

### Use Case 1: AI Agent Builder

```
You're building an AI agent that needs to:
- Send SMS notifications (Claude finds Twilio)
- Process payments (Claude finds Stripe)
- Generate PDFs (Claude finds PDF.co)
- Store files (Claude finds Cloudinary)

Claude discovers all APIs in seconds using ARDF MCP.
```

### Use Case 2: No-Code Automation

```
You: Create a workflow that:
1. Monitors GitHub issues
2. Sends Slack notifications
3. Creates Trello cards
4. Emails the team

Claude: *discovers 4 APIs semantically*
Here's the complete integration code...
```

### Use Case 3: Rapid Prototyping

```
You: I need to prototype a fintech app
Claude: *discovers payment, banking, KYC, fraud detection APIs*
Here are the top 10 financial APIs ranked by trust score...
```

## 🔐 Environment Variables

```bash
# Optional: Custom ARDF API endpoint
export ARDF_API_URL=https://your-ardf-instance.com

# Default: http://127.0.0.1:3001 (local development)
```

## 📊 Architecture

```
┌─────────────┐
│   Claude    │
│  Desktop    │
└──────┬──────┘
       │ MCP Protocol
       ▼
┌─────────────┐
│ ARDF MCP    │
│   Server    │
└──────┬──────┘
       │ HTTP API
       ▼
┌─────────────┐
│    ARDF     │
│ Marketplace │  ─────► 100+ APIs
│  (Semantic  │         (Email, SMS,
│   Search)   │          Payment, etc)
└─────────────┘
```

## 🆚 Comparison

| Feature | ARDF MCP | Manual API Search | Zapier |
|---------|----------|-------------------|--------|
| **Semantic Search** | ✅ Natural language | ❌ Manual Google | ⚠️ Keyword only |
| **Pricing** | 🎯 Free + pay-as-you-go | ❌ Per-API pricing | 💰 $99+/month |
| **Setup Time** | ⚡ 30 seconds | 🐌 Hours per API | ⚠️ Minutes |
| **Trust Scoring** | ✅ Automated | ❌ Manual research | ⚠️ Limited |
| **Code Generation** | ✅ Via Claude | ❌ Manual coding | ❌ No-code only |
| **Fallback Suggestions** | ✅ Automatic | ❌ Manual | ❌ None |
| **Developer-First** | ✅ API + CLI | ⚠️ Varies | ❌ GUI only |

## 🤝 Contributing

ARDF MCP is open-source and built with:
- **MCP SDK** by Anthropic
- **TypeScript** for type safety
- **Node.js** 18+ runtime

Want to add more APIs? Contributions welcome!

```bash
git clone https://github.com/MauricioPerera/ardf-sdk.git
cd ardf-mcp-server
npm install
npm run dev
```

## 📝 FAQ

### Q: Is this free?

**A:** The MCP server is 100% free and open-source. ARDF API has a free tier (100 discoveries/month). Premium plans available for heavy usage.

### Q: Does this work with Claude.ai web?

**A:** Currently MCP is only supported in Claude Desktop app. Web support coming from Anthropic soon.

### Q: Can I add my own API to ARDF?

**A:** Yes! Visit [ardf.dev/publish](https://ardf.dev/publish) to list your API. Free tier available.

### Q: What if ARDF API is down?

**A:** The MCP server will return clear error messages. You can also self-host ARDF API.

### Q: Is my data secure?

**A:** ARDF MCP only sends your semantic search queries to ARDF API. No API keys or sensitive data are transmitted.

## 🔗 Links

- **ARDF Website**: [ardf.dev](https://ideas.automators.work/ardf)
- **API Documentation**: [ardf.dev/docs](https://ideas.automators.work/ardf)
- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Report Issues**: [GitHub Issues](https://github.com/MauricioPerera/ardf-sdk/issues)

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

Built with by the ARDF team.

---

**Give Claude superpowers. Install ARDF MCP today.**

```bash
npx @ardf/mcp-server
```

**Star us on GitHub if you find this useful!**
