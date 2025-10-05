import express from 'express';
import cors from 'cors';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

app.post('/api/bedrock/analyze-image', async (req, res) => {
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
            source: { 
              type: "base64", 
              media_type: "image/jpeg",
              data: image 
            }
          }, {
            type: "text",
            text: "Analyze this food image and return ONLY a valid JSON object with these exact fields: description (string), nutritionInfo (object with calories, protein, carbs, fat as strings), dietaryTags (array of strings), allergens (array of strings), suggestedFoodTypes (array of strings). Do not include any text before or after the JSON."
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
    
    // Extract JSON from the response
    let analysis;
    try {
      // Look for JSON in the response text
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Format nutrition info properly
        if (analysis.nutritionInfo) {
          const nutrition = analysis.nutritionInfo;
          analysis.nutritionInfo = {
            calories: nutrition.calories || 'Unknown',
            protein: nutrition.protein || 'Unknown',
            carbohydrates: nutrition.carbs || nutrition.carbohydrates || 'Unknown',
            fat: nutrition.fat || 'Unknown'
          };
        }
        
        // Ensure arrays exist
        analysis.dietaryTags = analysis.dietaryTags || [];
        analysis.allergens = analysis.allergens || ['None detected'];
        analysis.suggestedFoodTypes = analysis.suggestedFoodTypes || [];
        
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.log('JSON parse error, creating structured response');
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
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});