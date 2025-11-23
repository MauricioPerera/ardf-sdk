/**
 * Agent Skill Execution Example
 *
 * This example shows how to:
 * 1. Create an agent
 * 2. Create encrypted credentials
 * 3. Assign skills and credentials to the agent
 * 4. Execute a skill with automatic credential injection
 * 5. View execution history
 */

import { ARDFClient } from '../client';

async function agentExecutionExample(token: string) {
  const client = new ARDFClient({
    baseUrl: 'https://ardf.dev',
    token
  });

  console.log('🤖 ARDF Agent Execution Example\n');

  // Step 1: Create an agent
  console.log('1️⃣  Creating agent...');
  const agent = await client.agents.create({
    name: 'Payment Processing Agent',
    description: 'Handles payment processing and notifications',
    framework: 'custom'
  });
  console.log(`✅ Agent created: ${agent.data.name} (ID: ${agent.data.id})\n`);

  // Step 2: Create credentials
  console.log('2️⃣  Creating encrypted credentials...');

  // Example: Stripe credential
  const stripeCredential = await client.credentials.create({
    name: 'Stripe Test Key',
    service: 'stripe',
    type: 'api_key',
    value: 'sk_test_xxxxxxxxxxxxx', // Replace with actual test key
    notes: 'Stripe test mode key for development'
  });
  console.log(`✅ Credential created: ${stripeCredential.credential.name} (ID: ${stripeCredential.credential.id})`);
  console.log(`   Service: ${stripeCredential.credential.service}`);
  console.log(`   Type: ${stripeCredential.credential.type}`);
  console.log(`   Value: [ENCRYPTED - Never exposed in responses] ✅\n`);

  // Step 3: Discover payment processing skills
  console.log('3️⃣  Discovering payment processing skills...');
  const skills = await client.skills.discover(
    'process credit card payments',
    { budget: 'any', reliability: 'enterprise', topK: 3 }
  );

  console.log(`✅ Found ${skills.results} skills:`);
  skills.skills?.forEach((skill, i) => {
    console.log(`   ${i + 1}. ${skill.name} (${skill.pricing_model})`);
  });
  console.log();

  // Step 4: Assign skill and credential to agent
  if (skills.skills && skills.skills.length > 0) {
    const paymentSkill = skills.skills[0];

    console.log('4️⃣  Assigning skill to agent...');
    await client.agents.assignSkill(agent.data.id, paymentSkill.id);
    console.log(`✅ Skill "${paymentSkill.name}" assigned\n`);

    console.log('5️⃣  Assigning credential to agent...');
    await client.agents.assignCredential(agent.data.id, stripeCredential.credential.id);
    console.log(`✅ Credential assigned\n`);

    // Step 5: Execute the skill
    console.log('6️⃣  Executing skill with agent...');
    console.log(`   Skill: ${paymentSkill.slug}`);
    console.log(`   Action: charge`);
    console.log(`   Parameters: { amount: 1000, currency: 'usd' }\n`);

    try {
      const execution = await client.agents.executeSkill(
        agent.data.id,
        paymentSkill.slug!,
        'charge',
        {
          amount: 1000, // $10.00 in cents
          currency: 'usd',
          description: 'Test payment from ARDF SDK'
        }
      );

      console.log('✅ Execution completed successfully!');
      console.log(`   Status: ${execution.status}`);
      console.log(`   Duration: ${execution.duration_ms}ms`);
      console.log(`   Execution ID: ${execution.id}`);

      if (execution.response_data) {
        console.log(`   Response:`, execution.response_data);
      }
    } catch (error: any) {
      if (error.status === 403) {
        console.log('⚠️  Missing required credentials');
        console.log('   This skill requires valid API credentials to execute');
      } else {
        console.log(`❌ Execution failed: ${error.message}`);
      }
    }
    console.log();

    // Step 6: View execution history
    console.log('7️⃣  Viewing execution history...');
    const executions = await client.agents.executions(agent.data.id, {
      limit: 10
    });

    console.log(`✅ Total executions: ${executions.total}`);
    if (executions.executions && executions.executions.length > 0) {
      console.log('Recent executions:');
      executions.executions.forEach((exec, i) => {
        console.log(`   ${i + 1}. ${exec.skill_name} - ${exec.status} (${exec.duration_ms}ms)`);
      });
    }
  }

  // Step 7: Get agent performance metrics
  console.log('\n8️⃣  Agent Performance Metrics...');
  const performance = await client.dashboard.agentPerformance();
  const agentMetrics = performance.agents?.find((a: any) => a.agent_id === agent.data.id);

  if (agentMetrics) {
    console.log('✅ Performance:');
    console.log(`   Total executions: ${agentMetrics.total_executions}`);
    console.log(`   Success rate: ${agentMetrics.success_rate}%`);
    console.log(`   Avg duration: ${agentMetrics.avg_duration_ms}ms`);
  }

  console.log('\n✨ Agent execution example complete!');
  console.log('\n📝 Key Security Features:');
  console.log('   ✅ Credentials encrypted with AES-256-GCM');
  console.log('   ✅ Values never exposed in API responses');
  console.log('   ✅ Automatic decryption during execution');
  console.log('   ✅ Full audit trail of all executions');
}

// Example usage
const TOKEN = process.env.ARDF_TOKEN;

if (!TOKEN) {
  console.log('❌ Please set ARDF_TOKEN environment variable');
  console.log('   First, login to get a token:');
  console.log('   curl -X POST https://ardf.dev/api/auth/login \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"email":"your@email.com","password":"yourpassword"}\'');
  process.exit(1);
}

agentExecutionExample(TOKEN).catch((error) => {
  console.error('❌ Error:', error.message);
  if (error.body) {
    console.error('Details:', error.body);
  }
  process.exit(1);
});
