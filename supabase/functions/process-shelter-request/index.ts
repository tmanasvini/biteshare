import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ShelterRequestInput {
  requestText: string;
  shelterName?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { requestText, shelterName }: ShelterRequestInput = await req.json();

    if (!requestText) {
      return new Response(
        JSON.stringify({ error: "Request text is required" }),
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
          portionCount: 50,
          urgency: "medium",
          dietaryPreferences: ["No specific preferences"],
          timeframe: "As soon as possible",
          additionalNotes: requestText,
          note: "Using basic parsing - AI analysis unavailable"
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

    const prompt = `Parse this natural language food request from ${shelterName || 'a shelter'} and extract:
1. Number of portions needed (estimate if not explicitly stated)
2. Urgency level (low, medium, high, critical)
3. Dietary preferences or restrictions mentioned
4. Timeframe for when food is needed
5. Any additional important notes

Request: "${requestText}"

Format your response as JSON with these exact keys:
{
  "portionCount": number,
  "urgency": "low|medium|high|critical",
  "dietaryPreferences": ["preference1", "preference2"],
  "timeframe": "description of when needed",
  "additionalNotes": "any other important information"
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
            content: prompt,
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
    const responseText = anthropicData.content[0].text;

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);

    return new Response(
      JSON.stringify(parsed),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in process-shelter-request:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process request",
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
