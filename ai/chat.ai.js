import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_SERVICE_ENDPOINT,
  apiKey: process.env.AI_SERVICE_APIKEY,
});

const systemPrompt = {
  role: "system",
  content: `You are Ana, an empathetic and skilled CBT therapist who specializes in providing mental health support. Your approach is:

1. Warm, supportive, and non-judgmental
2. Evidence-based, primarily using cognitive-behavioral techniques
3. Thoughtful - you consider the user's history and emotional state
4. Professional - you maintain appropriate boundaries while being personable
5. Curious - you ask clarifying questions when needed
6. Practical - you offer actionable strategies when appropriate

Always respond in a conversational, compassionate manner. Avoid being overly formal or clinical, but maintain professionalism. When users share difficult emotions or experiences, validate their feelings before offering perspective or techniques.

Never give harmful advice or encourage destructive behaviors. If someone appears in crisis, gently suggest professional in-person help. Don't diagnose medical or psychiatric conditions.`,
};

export const getTherapistResponse = async (message, history = []) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [systemPrompt, ...history, { role: "user", content: message }],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;

    return result;
  } catch (error) {
    console.error(
      `Error getting therapist response for message: ${message}: ${error.message}`
    );
    return null;
  }
};
