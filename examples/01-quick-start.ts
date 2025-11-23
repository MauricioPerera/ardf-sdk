/**
 * Quick Start Example - Getting Started with ARDF SDK
 *
 * This example shows the basic workflow:
 * 1. Register/Login
 * 2. Create an agent
 * 3. Discover skills
 * 4. Assign a skill to the agent
 * 5. Execute the skill
 */

import { ARDFClient } from '../client';

async function quickStart() {
  // Initialize the client
  const client = new ARDFClient({
    baseUrl: 'https://ardf.dev', // or 'http://localhost:3001' for development
  });

  console.log('🚀 ARDF SDK Quick Start\n');

  // Step 1: Register a new user
  console.log('📝 Step 1: Registering user...');
  try {
    const registerResult = await client.auth.register(
      'demo@example.com',
      'demouser',
      'SecurePassword123!'
    );
    console.log('✅ User registered:', registerResult.user);
  } catch (error) {
    console.log('ℹ️  User might already exist, proceeding to login...');
  }

  // Step 2: Login and get token
  console.log('\n🔐 Step 2: Logging in...');
  const loginResult = await client.auth.login(
    'demo@example.com',
    'SecurePassword123!'
  );
  console.log('✅ Logged in successfully');
  console.log('Token:', loginResult.token.substring(0, 20) + '...');

  // Set the token for subsequent requests
  client.setToken(loginResult.token);

  // Step 3: Create an agent
  console.log('\n🤖 Step 3: Creating an agent...');
  const agent = await client.agents.create({
    name: 'Email Bot',
    description: 'Automated email sending agent',
    framework: 'custom'
  });
  console.log('✅ Agent created:', agent);

  // Step 4: Discover skills
  console.log('\n🔍 Step 4: Discovering email skills...');
  const skillsResult = await client.skills.discover(
    'send transactional emails',
    {
      budget: 'free_preferred',
      reliability: 'high',
      topK: 3
    }
  );
  console.log(`✅ Found ${skillsResult.results} skills:`);
  skillsResult.skills?.forEach((skill, i) => {
    console.log(`  ${i + 1}. ${skill.name} (trust: ${skill.trust_score}/100)`);
  });

  // Step 5: Assign the top skill to the agent
  if (skillsResult.skills && skillsResult.skills.length > 0) {
    const topSkill = skillsResult.skills[0];
    console.log(`\n🔗 Step 5: Assigning "${topSkill.name}" to agent...`);

    await client.agents.assignSkill(agent.data.id, topSkill.id, true);
    console.log('✅ Skill assigned successfully');

    // Step 6: Check agent's assigned skills
    console.log('\n📋 Step 6: Verifying agent skills...');
    const agentDetails = await client.agents.get(agent.data.id);
    console.log(`✅ Agent has ${agentDetails.agent.skills_count} skill(s) assigned`);
  }

  // Step 7: Get dashboard metrics
  console.log('\n📊 Step 7: Checking dashboard metrics...');
  const metrics = await client.dashboard.metrics();
  console.log('✅ Metrics:', {
    totalAgents: metrics.total_agents,
    activeAgents: metrics.active_agents,
    totalExecutions: metrics.executions?.total
  });

  console.log('\n✨ Quick start complete!');
  console.log('Next steps:');
  console.log('  - Create credentials for your skills');
  console.log('  - Execute skills with your agent');
  console.log('  - Monitor performance in the dashboard');
}

// Run the example
quickStart().catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.body) {
    console.error('Details:', error.body);
  }
  process.exit(1);
});
