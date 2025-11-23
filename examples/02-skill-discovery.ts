/**
 * Skill Discovery Examples
 *
 * This example demonstrates different ways to discover skills:
 * - Basic semantic search
 * - Filtered search (budget, reliability)
 * - Parallel discovery (faster)
 * - Browse skills by category
 */

import { ARDFClient } from '../client';

async function skillDiscoveryExamples(token: string) {
  const client = new ARDFClient({
    baseUrl: 'https://ardf.dev',
    token
  });

  console.log('🔍 ARDF Skill Discovery Examples\n');

  // Example 1: Basic semantic search
  console.log('1️⃣  Basic Semantic Search');
  console.log('Query: "I need to process credit card payments"\n');

  const basicSearch = await client.skills.discover(
    'I need to process credit card payments'
  );

  console.log(`Found ${basicSearch.results} skills:`);
  basicSearch.skills?.forEach((skill) => {
    console.log(`  - ${skill.name}`);
    console.log(`    Relevance: ${(skill.relevance_score! * 100).toFixed(1)}%`);
    console.log(`    Trust Score: ${skill.trust_score}/100`);
    console.log(`    Pricing: ${skill.pricing_model}`);
    console.log();
  });

  // Example 2: Filtered search (free only, high reliability)
  console.log('\n2️⃣  Filtered Search (Free + High Reliability)');
  console.log('Query: "send notifications to users"\n');

  const filteredSearch = await client.skills.discover(
    'send notifications to users',
    {
      budget: 'free_only',
      reliability: 'high',
      topK: 5
    }
  );

  console.log(`Found ${filteredSearch.results} free, reliable skills:`);
  filteredSearch.skills?.forEach((skill) => {
    console.log(`  - ${skill.name} (${skill.cost_estimate || 'Free'})`);
  });

  // Example 3: Parallel discovery (2-4x faster)
  console.log('\n3️⃣  Parallel Discovery (OSWP - Faster!)');
  console.log('Query: "analyze sentiment in text"\n');

  const startTime = Date.now();
  const parallelSearch = await client.skills.discoverParallel(
    'analyze sentiment in text',
    {
      topK: 3,
      mergeStrategy: 'highest-confidence'
    }
  );
  const duration = Date.now() - startTime;

  console.log(`Found ${parallelSearch.results} skills in ${duration}ms`);
  if (parallelSearch.metadata) {
    console.log(`Performance: ${parallelSearch.metadata.speedup} speedup`);
    console.log(`Sources used: ${parallelSearch.metadata.successfulSources}/${parallelSearch.metadata.sources?.length}`);
    console.log(`Cache hit: ${parallelSearch.metadata.cacheHit ? 'Yes' : 'No'}`);
  }

  parallelSearch.skills?.forEach((skill) => {
    console.log(`  - ${skill.name}`);
  });

  // Example 4: Browse skills by category
  console.log('\n4️⃣  Browse Skills by Category');
  console.log('Category: API\n');

  const browseResults = await client.skills.list({
    category: 'api',
    verified: true,
    minTrust: 80,
    limit: 10
  });

  console.log(`Found ${browseResults.pagination?.returned} verified API skills:`);
  browseResults.skills?.forEach((skill) => {
    console.log(`  - ${skill.name} (${skill.category})`);
  });

  // Example 5: Get specific skill details
  console.log('\n5️⃣  Get Skill Details');
  if (basicSearch.skills && basicSearch.skills.length > 0) {
    const firstSkill = basicSearch.skills[0];
    console.log(`Fetching details for: ${firstSkill.name}\n`);

    const skillDetails = await client.skills.get(firstSkill.slug || firstSkill.id);
    console.log('Details:', {
      name: skillDetails.skill.name,
      description: skillDetails.skill.description,
      capabilities: skillDetails.skill.capabilities,
      trustScore: skillDetails.skill.trust_score,
      verified: skillDetails.skill.verified,
      requiresCredentials: skillDetails.skill.requires_credentials,
      docsUrl: skillDetails.skill.docs_url
    });
  }

  console.log('\n✨ Discovery examples complete!');
}

// Example usage
const TOKEN = process.env.ARDF_TOKEN || 'your-jwt-token-here';

if (TOKEN === 'your-jwt-token-here') {
  console.log('❌ Please set ARDF_TOKEN environment variable');
  console.log('   export ARDF_TOKEN="your-jwt-token"');
  process.exit(1);
}

skillDiscoveryExamples(TOKEN).catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
