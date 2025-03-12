import OpenAI from "openai";
import { contextBuilderWeekly } from "./builders/context.builder.js";

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

// update weekly themes in user context

export const getWeeklyContextThemes = async (contextObj) => {
  try {
    const pretext =
      "As a CBT therapist, analyze the user's weekly data including mood entries, journal entries, and chat history. " +
      "Identify patterns, recurring topics, and areas of focus across all three categories. " +
      "Your response MUST be in valid JSON format following this exact structure:\n\n" +
      "```json\n" +
      "{\n" +
      '  "moodThemes": {\n' +
      '    "theme": "[One concise theme that captures the mood patterns]",\n' +
      '    "description": "[1-2 line description explaining the theme]"\n' +
      "  },\n" +
      '  "journalThemes": {\n' +
      '    "theme": "[One concise theme that captures journal content patterns]",\n' +
      '    "description": "[1-2 line description explaining the theme]"\n' +
      "  },\n" +
      '  "chatThemes": {\n' +
      '    "theme": "[One concise theme that captures conversation patterns]",\n' +
      '    "description": "[1-2 line description explaining the theme]"\n' +
      "  }\n" +
      "}\n```\n\n" +
      'If there\'s insufficient data in any category, provide a theme that indicates this (e.g., "Insufficient data") with a description explaining what would be helpful to collect. ALL three theme categories MUST be present in your response.\n\n';

    const contextString = contextBuilderWeekly(contextObj);

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

    // Extract the JSON from the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) ||
      response.match(/```([\s\S]*?)```/) || [null, response];

    const jsonString = jsonMatch[1];

    try {
      const parsedThemes = JSON.parse(jsonString);
      return parsedThemes;
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", error);
      console.error("Raw response:", response);

      // Return a fallback response if parsing fails
      return {
        moodThemes: {
          theme: "Error analyzing mood data",
          description:
            "Could not generate mood themes due to processing error.",
        },
        journalThemes: {
          theme: "Error analyzing journal data",
          description:
            "Could not generate journal themes due to processing error.",
        },
        chatThemes: {
          theme: "Error analyzing chat data",
          description:
            "Could not generate chat themes due to processing error.",
        },
      };
    }
  } catch (error) {
    console.log(`Error updating weekly context themes: ${error.message}`);
  }
};
