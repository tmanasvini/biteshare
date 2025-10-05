import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-west-2" });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { request } = req.body;
    
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{
          role: "user",
          content: `Extract structured data from this shelter request: "${request}"\n\nReturn JSON with: urgency (low/medium/high), foodTypes (array), quantity (number), specialRequirements (array), deadline (ISO date if mentioned).`
        }],
        max_tokens: 500
      })
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    res.json(JSON.parse(result.content[0].text));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}