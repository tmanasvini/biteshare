import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { IAMClient, ListAttachedUserPoliciesCommand, GetUserCommand } from "@aws-sdk/client-iam";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const stsClient = new STSClient({ 
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const iamClient = new IAMClient({ 
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function checkPermissions() {
  try {
    // Check who we are
    const identityCommand = new GetCallerIdentityCommand({});
    const identity = await stsClient.send(identityCommand);
    console.log('Current user:', identity);
    
    // Extract username from ARN
    const username = identity.Arn.split('/').pop();
    console.log('Username:', username);
    
    // Check user policies
    const policiesCommand = new ListAttachedUserPoliciesCommand({
      UserName: username
    });
    const policies = await iamClient.send(policiesCommand);
    console.log('Attached policies:', policies.AttachedPolicies);
    
  } catch (error) {
    console.error('Permission check failed:', error.message);
  }
}

checkPermissions();