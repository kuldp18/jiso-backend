import OpenAI from "openai";
import { userInsightBuilder } from "./builders/context.builder.js";

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

const pretext =
  "As a CBT therapist, analyze the user's weekly data including mood entries, journal entries, chat history, goals, and struggles. " +
  "Based on this data, generate insights and suggestions for the user. " +
  "Your response MUST be in valid JSON format with EXACTLY these two keys: insights and suggestions.\n\n" +
  "```json\n" +
  "{\n" +
  '  "insights": [\n' +
  "    {\n" +
  '      "insight": "[First key insight about patterns, trends, or notable observations]",\n' +
  '      "description": "[2-3 sentence explanation with supporting evidence from the data]"\n' +
  "    },\n" +
  "    {\n" +
  '      "insight": "[Second key insight if applicable]",\n' +
  '      "description": "[2-3 sentence explanation]"\n' +
  "    }\n" +
  "  ],\n" +
  '  "suggestions": [\n' +
  "    {\n" +
  '      "suggestion": "[First actionable recommendation based on the insights and user\'s goals]",\n' +
  '      "description": "[How to implement this suggestion and why it would be helpful]"\n' +
  "    },\n" +
  "    {\n" +
  '      "suggestion": "[Second actionable recommendation if applicable]",\n' +
  '      "description": "[How to implement this suggestion and why it would be helpful]"\n' +
  "    }\n" +
  "  ]\n" +
  "}\n```\n\n" +
  "Provide 1-3 insights that capture meaningful patterns from the data. " +
  "Provide 1-3 practical, specific suggestions that directly relate to the insights and the user's goals and struggles. " +
  "If there is insufficient data, note that in an insight and provide suggestions for what data would be helpful.\n\n";

// get weekly insights for user

export const getWeeklyInsights = async (insightObj) => {
  try {
    const contextString = userInsightBuilder(insightObj);

    const prompt = {
      role: "user",
      content: pretext + contextString,
    };

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [systemPrompt, prompt],
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;

    // parse JSON from response
    const parsedResponse = JSON.parse(response);

    return parsedResponse;
  } catch (error) {
    console.error("Failed to generate weekly insights:", error);
    return {
      insights: [],
      suggestions: [],
    };
  }
};
