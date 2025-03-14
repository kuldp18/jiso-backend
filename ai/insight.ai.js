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

For insights: Provide descriptive, analytical observations about the user's patterns, behaviors, and experiences in third-person format. These insights will be used for internal processing.

For suggestions: Address the user directly by their first name when available. Use a conversational, one-to-one therapeutic voice with "you" statements. These suggestions will be shown directly to the user.

Be concise and avoid unnecessary repetition or paraphrasing. Focus on providing meaningful insights and suggestions rather than simply summarizing the user's data.

When referencing the user's journals, moods, goals, or struggles, incorporate them naturally without labeling them as "Journal Theme 1" or "Goal 2" etc. Also don't mention the themes like 'from your mood theme of XYZ or journal theme of ABC' etc.

Always respond in a compassionate manner. When referencing difficult emotions or experiences, approach them with sensitivity. Never give harmful advice or encourage destructive behaviors. If someone appears in crisis, gently suggest professional in-person help. Don't diagnose medical or psychiatric conditions.`,
};

// get weekly insights for user

export const getWeeklyInsights = async (insightObj) => {
  try {
    const contextString = userInsightBuilder(insightObj);
    const pretext =
      "As a CBT therapist, analyze the user's weekly data including mood entries, journal entries, chat history, goals, and struggles. " +
      "For insights: Write descriptive, analytical observations in third-person format for internal processing. " +
      "For suggestions: Address the user directly by their first name if available, using a conversational one-to-one therapeutic voice with 'you' statements. " +
      "When referencing journals, moods, goals, or struggles, incorporate them naturally without using labels like 'Journal Theme 1' or 'Goal 2'. " +
      "Be concise and avoid unnecessary repetition. " +
      "Your response MUST be in valid JSON format with EXACTLY these two keys: insights and suggestions.\n\n" +
      "```json\n" +
      "{\n" +
      '  "insights": [\n' +
      "    {\n" +
      '      "insight": "[First key insight about patterns, trends, or notable observations]",\n' +
      '      "description": "[2-3 sentence analytical explanation with supporting evidence from the data]"\n' +
      "    },\n" +
      "    {\n" +
      '      "insight": "[Second key insight if applicable]",\n' +
      '      "description": "[2-3 sentence analytical explanation]"\n' +
      "    }\n" +
      "  ],\n" +
      '  "suggestions": [\n' +
      "    {\n" +
      '      "suggestion": "[First actionable recommendation based on the insights and user\'s goals]",\n' +
      '      "description": "[How to implement this suggestion and why it would be helpful - in direct conversational format]"\n' +
      "    },\n" +
      "    {\n" +
      '      "suggestion": "[Second actionable recommendation if applicable]",\n' +
      '      "description": "[How to implement this suggestion and why it would be helpful - in direct conversational format]"\n' +
      "    }\n" +
      "  ]\n" +
      "}\n```\n\n" +
      "Provide 1-3 insights that capture meaningful patterns from the data. " +
      "Provide 1-3 practical, specific suggestions that directly relate to the insights and the user's goals and struggles. " +
      "If there is insufficient data, note that in an insight and provide suggestions for what data would be helpful.\n\n";

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

// get monthly insights for user
export const getMonthlyInsights = async (insightObj) => {
  try {
    const contextString = userInsightBuilder(insightObj);
    const pretext =
      "As a CBT therapist, analyze the user's monthly data including mood entries, journal entries, chat history, goals, and struggles. " +
      "For insights: Write descriptive, analytical observations in third-person format for internal processing. " +
      "For suggestions: Address the user directly by their first name if available, using a conversational one-to-one therapeutic voice with 'you' statements. " +
      "When referencing journals, moods, goals, or struggles, incorporate them naturally without using labels like 'Journal Theme 1' or 'Goal 2'. " +
      "Be concise and avoid unnecessary repetition. " +
      "Your response MUST be in valid JSON format with EXACTLY these two keys: insights and suggestions.\n\n" +
      "```json\n" +
      "{\n" +
      '  "insights": [\n' +
      "    {\n" +
      '      "insight": "[First key insight about patterns, trends, or notable observations]",\n' +
      '      "description": "[2-3 sentence analytical explanation with supporting evidence from the data]"\n' +
      "    },\n" +
      "    {\n" +
      '      "insight": "[Second key insight if applicable]",\n' +
      '      "description": "[2-3 sentence analytical explanation]"\n' +
      "    }\n" +
      "  ],\n" +
      '  "suggestions": [\n' +
      "    {\n" +
      '      "suggestion": "[First actionable recommendation based on the insights and user\'s goals]",\n' +
      '      "description": "[How to implement this suggestion and why it would be helpful - in direct conversational format]"\n' +
      "    },\n" +
      "    {\n" +
      '      "suggestion": "[Second actionable recommendation if applicable]",\n' +
      '      "description": "[How to implement this suggestion and why it would be helpful - in direct conversational format]"\n' +
      "    }\n" +
      "  ]\n" +
      "}\n```\n\n" +
      "Provide 3-6 insights that capture meaningful patterns from the data. " +
      "Provide 3-6 practical, specific suggestions that directly relate to the insights and the user's goals and struggles. " +
      "If there is insufficient data, note that in an insight and provide suggestions for what data would be helpful.\n\n";

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
    console.error("Failed to generate monthly insights:", error);
    return {
      insights: [],
      suggestions: [],
    };
  }
};
