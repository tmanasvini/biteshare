import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CoordinationRequest {
  donation: {
    id: string;
    diningHallName: string;
    foodDescription: string;
    portionCount: number;
    address: string;
  };
  shelter: {
    id: string;
    name: string;
    portionCount: number;
    address: string;
  };
  volunteer: {
    id: string;
    name: string;
    vehicleType: string;
    maxDistanceMiles: number;
  };
  distanceMiles: number;
  estimatedTime: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const coordinationData: CoordinationRequest = await req.json();

    const { donation, shelter, volunteer, distanceMiles, estimatedTime } = coordinationData;

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicApiKey) {
      console.error("ANTHROPIC_API_KEY not configured");
      const mockMessage = `Hi ${volunteer.name}! We have a perfect match for you.

${donation.diningHallName} has ${donation.portionCount} portions of food ready for pickup, and ${shelter.name} urgently needs meals. The shelter is only ${distanceMiles} miles away - well within your ${volunteer.maxDistanceMiles}-mile preference!

Pickup: ${donation.diningHallName}
Address: ${donation.address}

Delivery: ${shelter.name}
Address: ${shelter.address}

Distance: ${distanceMiles} miles
Estimated time: ${estimatedTime}

Food: ${donation.foodDescription}

Your vehicle (${volunteer.vehicleType}) is perfect for this delivery. Can you help make this happen?

(Using template message - AI coordination unavailable)`;

      return new Response(
        JSON.stringify({
          aiMessage: mockMessage,
          pickupTime: "As soon as possible",
          deliveryTime: `${estimatedTime} after pickup`,
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

    const prompt = `You are coordinating a food rescue delivery. Generate a personalized, warm, and encouraging message for a volunteer.

Context:
- Volunteer: ${volunteer.name}, drives a ${volunteer.vehicleType}, willing to travel up to ${volunteer.maxDistanceMiles} miles
- Donation: ${donation.portionCount} portions from ${donation.diningHallName}
- Food: ${donation.foodDescription}
- Pickup address: ${donation.address}
- Shelter: ${shelter.name} needs ${shelter.portionCount} portions
- Delivery address: ${shelter.address}
- Distance: ${distanceMiles} miles (${estimatedTime} drive)

Create a compelling message that:
1. Addresses the volunteer by name warmly
2. Explains why this is a great match for them
3. Provides clear pickup and delivery details
4. Emphasizes the positive impact (number of people helped)
5. Mentions their vehicle is suitable
6. Asks if they can accept
7. Keeps a friendly, encouraging tone
8. Is concise but informative (200-300 words)

Format your response as JSON:
{
  "aiMessage": "the full personalized message",
  "pickupTime": "suggested pickup time",
  "deliveryTime": "suggested delivery time"
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
    const coordination = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);

    return new Response(
      JSON.stringify(coordination),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in coordinate-volunteer:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to coordinate delivery",
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
