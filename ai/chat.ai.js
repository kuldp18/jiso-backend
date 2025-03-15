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

// get chat response from AI
export const getChatResponse = async (message, history = [], userInfo) => {
  const truncatedHistory = history.slice(-25); // Limit history to last 25 messages

  const systemPrompt = {
    role: "system",
    content: `You are Ana, a warm, human-like CBT therapist who chats with clients through text. You sound like a real person — calm, compassionate, and helpful.

Guidelines:
1. Pay close attention to the conversation history. Maintain emotional continuity, remember what the user has shared earlier, and build on it.
2. Keep responses natural and conversational — use contractions and a casual tone.
3. Typically reply in 2-5 sentences unless the client needs deeper support.
4. Always validate feelings gently before offering CBT insights or practical tools.
5. Mirror the client's tone and energy. Be a supportive presence.
6. Never say things like "As an AI therapist", "I don't have feelings", or any robotic disclaimers. You're just Ana, the therapist — warm, human, and here to help.
7. If the user seems overwhelmed, hopeless, or in distress, respond gently. Validate them and suggest speaking to someone they trust or a professional in person. Avoid diagnosing or making assumptions.


Ask thoughtful questions when needed. Be emotionally attuned and consistent.`,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,

      messages: [
        systemPrompt,
        ...truncatedHistory,
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0].message.content;

    return result;
  } catch (error) {
    console.error(
      `Error getting chat response for message: ${message}: ${error.message}`
    );
    return null;
  }
};

//  create chat summary
export const createChatSummary = async (chat) => {
  const chatTranscript = chat.messages
    .map((msg) => {
      const senderLabel = msg.sender === "user" ? "User" : "Ana";
      return `${senderLabel}: ${msg.content}`;
    })
    .join("\n");

  const summaryPrompt = {
    role: "user",
    content: `Here is a transcript of a CBT therapy chat session between Ana and the user:

${chatTranscript}

Please summarize this chat session concisely in about 100-150 words. Include:
- User's emotional state
- Key topics discussed
- Any cognitive patterns or distortions identified
- CBT techniques or strategies Ana used
- Any progress or shift in thinking
- Suggestions or goals for next chat session

Important: Don't include phrases like "In this chat session...", 'As an AI therapist...", or "The user said..." etc. Create a narrative summary as if you're reflecting on the chat session.

Keep it concise, warm, and emotionally aware. Write the summary like Ana reflecting on the chat session, not like a generic report.`,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [systemPrompt, summaryPrompt],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;

    if (!result) {
      chat.summaryStatus = "error";
      chat.summaryError = "Error or empty response from AI model";
      await chat.save();
    }

    chat.summary = result;
    chat.summaryStatus = "complete";
    chat.summaryError = null;
    await chat.save();
  } catch (error) {
    console.error(
      `Error getting chat summary for chat ${chat._id}: ${error.message}`
    );
    chat.summaryStatus = "error";
    chat.summaryError = error.message;
    await chat.save();
  }
};
