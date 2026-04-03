const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function scoreWithGemini(base64Image, subject) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.",
    );
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `You are a hilarious but encouraging art teacher named "Noodle Judge". 
A student claims they drew a "${subject}". 

Score their doodle from 1 to 10 based on:
- Recognizability: Can you actually tell it's a ${subject}?
- Effort: Did they genuinely try?
- Charm: Is it delightfully terrible or surprisingly good?

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": <number 1-10>,
  "feedback": "<one encouraging sentence about what they did well>",
  "roast": "<one funny roast that's savage but kind — make them laugh, not cry>"
}`,
          },
          {
            inline_data: {
              mime_type: "image/png",
              data: base64Image,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 429) {
      console.warn("Gemini limit reached! Using fallback mock score.");
      return {
        score: Math.floor(Math.random() * 4) + 6, // Random score between 6 and 9
        feedback: "The judge was taking a nap and couldn't grade it properly, but passed you anyway!",
        roast: "You got lucky! The API rate limit just saved you from a brutal roasting.",
      };
    }

    throw new Error(
      errorData?.error?.message || `Gemini API error: ${response.status}`,
    );
  }

  const data = await response.json();

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error(
      "Gemini returned an empty response. The doodle might be too abstract!",
    );
  }

  const cleanedText = rawText
    .replace(/```json\s*/g, "") // Remove opening ```json
    .replace(/```\s*/g, "") // Remove closing ```
    .trim();

  try {
    const result = JSON.parse(cleanedText);
    return {
      score: Math.min(10, Math.max(1, Number(result.score) || 5)),
      feedback: result.feedback || "Nice effort!",
      roast: result.roast || "No comment... and that says a lot.",
    };
  } catch {
    console.warn("Failed to parse Gemini response:", cleanedText);
    return {
      score: 5,
      feedback: "The judge is confused but impressed by your creativity.",
      roast: "I asked for JSON and got modern art. You're consistent at least.",
    };
  }
}
