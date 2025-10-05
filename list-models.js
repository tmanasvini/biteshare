import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new BedrockClient({ 
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function listModels() {
  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    
    const claudeModels = response.modelSummaries.filter(model => 
      model.modelId.includes('claude')
    );
    
    console.log('Available Claude models:');
    claudeModels.forEach(model => {
      console.log(`- ${model.modelId}`);
    });
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();