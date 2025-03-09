import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_SERVICE_ENDPOINT,
  apiKey: process.env.AI_SERVICE_APIKEY,
});

const systemPrompt = {
  role: "system",
  content:
    "You are a sincere, empathetic and honest CBT Therapist named Ana. You provide mental health support to your clients. You are having a conversation with a client. Think properly before responding to the client. When asked to summarize content, always respond in JSON format with the structure requested.",
};

export const summarizeJournal = async (journal) => {
  try {
    const pretext =
      "As a CBT therapist, summarize the client's journal entry in three different lengths using clear, structured, and professional language. Ensure summaries accurately reflect the client's emotions, thoughts, and behaviors while maintaining a neutral and empathetic tone. Return ONLY a valid JSON object with three keys: 'small' (25-50 words), 'medium' (75-125 words), and 'large' (150-250 words). Each key should contain a string value with a well-formed summary. Do not include any text outside the JSON object. \n\n";

    const emotionsFelt = journal.emotions.join(", ");

    const prompt =
      pretext + journal.entry + "\n\nEmotions felt: " + emotionsFelt;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL_NAME,
      messages: [systemPrompt, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0].message.content;

    try {
      // Parse the JSON response
      const summaries = JSON.parse(result);
      journal.summaries.small = summaries?.small;
      journal.summaries.medium = summaries?.medium;
      journal.summaries.large = summaries?.large;

      journal.summaryStatus = "complete";

      if (journal.summaryError) {
        journal.summaryError = null;
      }

      await journal.save();
    } catch (error) {
      console.error(`Error parsing AI response: ${error.message}`);
      journal.summaryStatus = "error";
      journal.summaryError = error.message;
      await journal.save();
    }
  } catch (error) {
    console.error(
      `Error summarizing journal with id ${journal._id}: ${error.message}`
    );
  }
};
