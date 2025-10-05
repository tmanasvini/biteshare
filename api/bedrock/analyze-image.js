import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  console.log('Bedrock API called');
  
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    console.log('Image received, length:', image.length);
    
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{
          role: "user",
          content: [{
            type: "image",
            source: { type: "base64", data: image }
          }, {
            type: "text",
            text: "Analyze this food image. Return JSON with: description, nutritionInfo (calories, protein, carbs, fat), dietaryTags, allergens, suggestedFoodTypes."
          }]
        }],
        max_tokens: 1000
      })
    });

    console.log('Sending request to Claude...');
    const response = await client.send(command);
    console.log('Claude response received');
    
    const result = JSON.parse(new TextDecoder().decode(response.body));
    console.log('Claude result:', result);
    
    const analysisText = result.content[0].text;
    console.log('Analysis text:', analysisText);
    
    // Try to parse JSON from the response
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      // If not valid JSON, create a structured response
      analysis = {
        description: analysisText,
        nutritionInfo: { calories: '200-300 per portion', protein: 'Moderate', carbohydrates: 'Moderate', fat: 'Low' },
        dietaryTags: ['Fresh'],
        allergens: ['Unknown'],
        suggestedFoodTypes: ['Mixed']
      };
    }
    
    res.json(analysis);
  } catch (error) {
    console.error('Bedrock error:', error);
    res.status(500).json({ error: error.message });
  }
}