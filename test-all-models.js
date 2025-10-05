import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const claudeModels = [
  "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "anthropic.claude-3-5-sonnet-20240620-v1:0",
  "anthropic.claude-3-sonnet-20240229-v1:0",
  "anthropic.claude-3-haiku-20240307-v1:0",
  "anthropic.claude-3-opus-20240229-v1:0"
];

async function testModel(modelId) {
  try {
    const command = new InvokeModelCommand({
      modelId: modelId,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{
          role: "user",
          content: "Hello"
        }],
        max_tokens: 10
      })
    });

    await client.send(command);
    console.log(`✅ ${modelId} - WORKS`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelId} - ${error.message}`);
    return false;
  }
}

async function testAllModels() {
  console.log('Testing Claude models...\n');
  
  for (const modelId of claudeModels) {
    await testModel(modelId);
  }
}

testAllModels();