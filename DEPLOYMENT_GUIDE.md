# Deployment Guide - ARDF MCP Server

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - **Name**: `ardf-mcp-server`
   - **Description**: "Give Claude access to 100+ APIs through semantic search - MCP Server"
   - **Visibility**: Public
   - **DO NOT** initialize with README (we already have one)

3. Copy the repository URL (e.g., `https://github.com/MauricioPerera/ardf-sdk.git`)

## Step 2: Push Code to GitHub

```bash
cd /opt/ideas-api/mcp-server

# Add remote
git remote add origin https://github.com/MauricioPerera/ardf-sdk.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 3: Update package.json

Edit `package.json` and update the repository URL:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOURUSERNAME/ardf-mcp-server.git"
  }
}
```

Commit the change:

```bash
git add package.json
git commit -m "Update repository URL"
git push
```

## Step 4: Publish to npm

### Prerequisites

1. Create an npm account at https://www.npmjs.com/signup
2. Login to npm:
   ```bash
   npm login
   ```

### Publishing

```bash
cd /opt/ideas-api/mcp-server

# Build the project
bun build src/index.ts --outdir dist --target node --format esm
chmod +x dist/index.js

# Test locally first
npm pack
# This creates ardf-mcp-server-1.0.0.tgz

# Test the package
npm install -g ./ardf-mcp-server-1.0.0.tgz
ardf-mcp --help

# If everything works, publish!
npm publish --access public
```

### After Publishing

1. Verify on npm: https://www.npmjs.com/package/@ardf/mcp-server
2. Test installation: `npx @ardf/mcp-server`

## Step 5: Update URLs in Launch Materials

After GitHub repo is created, update these files:

### LAUNCH.md

Replace placeholders:
- `[link when ready]` → `https://github.com/MauricioPerera/ardf-sdk`
- `[link to README]` → `https://github.com/MauricioPerera/ardf-sdk#readme`

### README.md

Update lines 253, 286:
- `https://github.com/MauricioPerera/ardf-sdk.git` → actual URL

## Step 6: Create GitHub Release

1. Go to your GitHub repo
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: "ARDF MCP Server v1.0.0"
5. Description:
   ```markdown
   ## 🚀 First Release

   Give Claude access to 100+ APIs through semantic search.

   ### Features
   - ✅ Semantic API discovery
   - ✅ 100+ verified APIs
   - ✅ Trust scoring & cost transparency
   - ✅ Zero configuration

   ### Installation
   ```bash
   npx @ardf/mcp-server
   ```

   ### Quick Start
   Add to `claude_desktop_config.json`:
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

   Restart Claude Desktop. Done!

   ### Links
   - [Documentation](https://github.com/MauricioPerera/ardf-sdk#readme)
   - [npm Package](https://www.npmjs.com/package/@ardf/mcp-server)
   - [Report Issues](https://github.com/MauricioPerera/ardf-sdk/issues)
   ```

## Step 7: Launch Checklist

Before launching publicly:

- [ ] GitHub repo created and code pushed
- [ ] npm package published
- [ ] GitHub release created
- [ ] All URLs updated in documentation
- [ ] Tested `npx @ardf/mcp-server` installation
- [ ] Tested with Claude Desktop
- [ ] STRIPE_WEBHOOK_SECRET configured in production
- [ ] Server running at http://31.220.22.176:3001

## Step 8: Launch on Social Media

### Twitter

Post the thread from `LAUNCH.md` (Tweet 1-8)

**Remember to:**
- Add GitHub link
- Add npm package link
- Use hashtags: #AI #Claude #MCP #APIs #OpenSource

### Reddit

Post to:
- r/ClaudeAI (use "Show HN" style post from LAUNCH.md)
- r/SideProject (use "Built in 3 hours" post from LAUNCH.md)

### Indie Hackers

Post the launch announcement from LAUNCH.md

### Product Hunt

**Wait 1 week** after initial launch to build traction, then submit to Product Hunt with:
- Screenshots of Claude using the MCP server
- Demo video (if possible)
- Clear value proposition

## Step 9: Monitor Launch

Track:
- GitHub stars
- npm downloads: `npm info @ardf/mcp-server`
- Issues and feedback
- User signups at http://31.220.22.176:3001/ardf

## Troubleshooting

### npm publish fails with "package already exists"

If `@ardf` scope is taken:
1. Change package name in `package.json` to `ardf-mcp-server` (without @ardf/)
2. Update all documentation references
3. Publish again

### "permission denied" when publishing

1. Make sure you're logged in: `npm whoami`
2. Check package name isn't taken: `npm info @ardf/mcp-server`
3. Verify you have publish rights to the scope

### GitHub push fails

1. Generate a personal access token at https://github.com/settings/tokens
2. Use it as password when prompted
3. Or use SSH: `git remote set-url origin git@github.com:MauricioPerera/ardf-sdk.git`

---

## Current Status

✅ Git repository initialized
✅ Initial commit created
✅ LICENSE added (MIT)
✅ README completed
✅ Package built successfully
⏳ Ready for GitHub push
⏳ Ready for npm publish
⏳ Ready for launch

---

## Quick Commands Reference

```bash
# Check git status
cd /opt/ideas-api/mcp-server
git status

# Build package
bun build src/index.ts --outdir dist --target node --format esm

# Test locally
npm pack
npm install -g ./ardf-mcp-server-1.0.0.tgz

# Publish to npm
npm publish --access public

# Check npm downloads
npm info @ardf/mcp-server

# View git log
git log --oneline
```
