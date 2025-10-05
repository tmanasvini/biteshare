import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FoodAnalysisRequest {
  imageBase64: string;
  diningHallName?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { imageBase64, diningHallName }: FoodAnalysisRequest = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicApiKey) {
      console.error("ANTHROPIC_API_KEY not configured");
      return new Response(
        JSON.stringify({
          description: "Assorted grilled chicken breast, roasted vegetables (carrots, broccoli, bell peppers), and seasoned rice pilaf",
          nutritionInfo: {
            calories: "350-400 per portion",
            protein: "High",
            carbohydrates: "Moderate",
            fat: "Low"
          },
          dietaryTags: ["High Protein", "Gluten-Free"],
          allergens: ["None detected"],
          suggestedFoodTypes: ["Entrees", "Vegetables", "Grains"],
          note: "Using mock data - AI analysis unavailable"
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const prompt = `Analyze this food image from ${diningHallName || 'a dining hall'} and provide:
1. A detailed description of the food items visible
2. Estimated nutritional information per portion (calories, protein, carbs, fat levels)
3. Dietary tags (e.g., vegetarian, vegan, gluten-free, high protein, low fat)
4. Potential allergens (e.g., nuts, dairy, gluten, soy, shellfish)
5. Suggested food type categories (e.g., Entrees, Sides, Salads, Desserts, Vegetables, Grains)

Format your response as JSON with these exact keys:
{
  "description": "detailed description",
  "nutritionInfo": {
    "calories": "estimate per portion",
    "protein": "High/Moderate/Low",
    "carbohydrates": "High/Moderate/Low",
    "fat": "High/Moderate/Low"
  },
  "dietaryTags": ["tag1", "tag2"],
  "allergens": ["allergen1", "allergen2"],
  "suggestedFoodTypes": ["type1", "type2"]
}`;

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const error = await anthropicResponse.text();
      console.error("Anthropic API error:", error);
      throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
    }

    const anthropicData = await anthropicResponse.json();
    const analysisText = anthropicData.content[0].text;

    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(analysisText);

    return new Response(
      JSON.stringify(analysis),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in analyze-food-image:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to analyze image",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
