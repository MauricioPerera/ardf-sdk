/**
 * Skill Publishing Example
 *
 * This example shows how to publish your own skills to ARDF:
 * - Public skills (require admin verification)
 * - Private skills (automatically verified)
 * - Update and manage your skills
 */

import { ARDFClient } from '../client';

async function publishSkillExample(token: string) {
  const client = new ARDFClient({
    baseUrl: 'https://ardf.dev',
    token
  });

  console.log('📦 ARDF Skill Publishing Example\n');

  // Example 1: Publish a public skill
  console.log('1️⃣  Publishing a public skill...');
  console.log('Name: My Email Service Integration\n');

  const publicSkill = await client.skills.publish({
    name: 'My Email Service Integration',
    slug: 'my-email-service',
    description: 'Custom email service integration with advanced features',
    category: 'api',
    capabilities: ['email', 'transactional', 'marketing', 'templates'],
    pricingModel: 'freemium',
    requiresCredentials: true,
    requiredService: 'sendgrid',
    visibilityType: 'public' // Requires admin verification
  });

  console.log('✅ Public skill published!');
  console.log(`   ID: ${publicSkill.skill.id}`);
  console.log(`   Slug: ${publicSkill.skill.slug}`);
  console.log(`   Verified: ${publicSkill.skill.verified}`);
  console.log(`   ℹ️  Public skills require admin verification\n`);

  // Example 2: Publish a private skill (automatically verified)
  console.log('2️⃣  Publishing a private skill...');
  console.log('Name: Internal CRM Integration\n');

  const privateSkill = await client.skills.publish({
    name: 'Internal CRM Integration',
    slug: 'internal-crm',
    description: 'Private integration with our company CRM system',
    category: 'api',
    capabilities: ['crm', 'contacts', 'deals'],
    pricingModel: 'free',
    requiresCredentials: true,
    requiredService: 'custom',
    visibilityType: 'private' // Automatically verified
  });

  console.log('✅ Private skill published!');
  console.log(`   ID: ${privateSkill.skill.id}`);
  console.log(`   Verified: ${privateSkill.skill.verified}`);
  console.log(`   ℹ️  Private skills are only visible to you\n`);

  // Example 3: Update a skill
  console.log('3️⃣  Updating skill...');

  await client.skills.update(privateSkill.skill.id, {
    description: 'Updated: Private integration with our company CRM system v2',
    capabilities: ['crm', 'contacts', 'deals', 'reporting'],
    tags: ['internal', 'crm', 'sales'],
    docsUrl: 'https://docs.mycompany.com/crm-integration',
    homepageUrl: 'https://mycompany.com'
  });

  console.log('✅ Skill updated successfully\n');

  // Example 4: Get skill details
  console.log('4️⃣  Fetching updated skill details...');
  const skillDetails = await client.skills.get(privateSkill.skill.slug!);

  console.log('✅ Skill details:');
  console.log(`   Name: ${skillDetails.skill.name}`);
  console.log(`   Description: ${skillDetails.skill.description}`);
  console.log(`   Capabilities: ${skillDetails.skill.capabilities?.join(', ')}`);
  console.log(`   Tags: ${skillDetails.skill.tags?.join(', ')}`);
  console.log(`   Docs: ${skillDetails.skill.docs_url}`);
  console.log(`   Homepage: ${skillDetails.skill.homepage_url}\n`);

  // Example 5: List your published skills
  console.log('5️⃣  Listing your published skills...');
  const mySkills = await client.skills.list({
    // This will show all public skills + your private skills
    limit: 20
  });

  console.log(`✅ Found ${mySkills.pagination?.returned} skills`);
  console.log('Your published skills might include:');
  mySkills.skills?.forEach((skill) => {
    if (skill.visibility_type === 'private' ||
        skill.slug === 'my-email-service' ||
        skill.slug === 'internal-crm') {
      console.log(`   - ${skill.name} (${skill.visibility_type})`);
    }
  });
  console.log();

  // Example 6: Delete a skill (commented out for safety)
  console.log('6️⃣  Deleting skill (demonstration only)...');
  console.log('   ⚠️  Skill deletion is permanent!');
  console.log('   To delete, uncomment the following code:\n');
  console.log('   await client.skills.delete(privateSkill.skill.id);\n');

  // Uncomment to actually delete:
  // await client.skills.delete(privateSkill.skill.id);
  // console.log('✅ Skill deleted successfully\n');

  console.log('✨ Skill publishing example complete!\n');
  console.log('📝 Publishing Best Practices:');
  console.log('   1. Use descriptive, clear names');
  console.log('   2. Provide detailed descriptions for better discovery');
  console.log('   3. Add relevant capabilities and tags');
  console.log('   4. Include documentation URLs');
  console.log('   5. Use private visibility for testing');
  console.log('   6. Switch to public after thorough testing');
}

// Example usage
const TOKEN = process.env.ARDF_TOKEN;

if (!TOKEN) {
  console.log('❌ Please set ARDF_TOKEN environment variable');
  console.log('   export ARDF_TOKEN="your-jwt-token"');
  process.exit(1);
}

publishSkillExample(TOKEN).catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.body) {
    console.error('Details:', error.body);
  }
  process.exit(1);
});
