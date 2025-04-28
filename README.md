# Jiso Backend

Jiso is a comprehensive mental health platform that leverages AI technology to provide personalized support through mood tracking, journaling, therapy chat, and data-driven insights. This repository contains the backend API that powers the Jiso application.

## 📋 Overview

Jiso's backend is built on a modern MERN stack architecture (MongoDB, Express, React, Node.js) with integrated AI capabilities. The system leverages natural language processing to analyze user inputs and provide therapeutic responses, personal insights, and actionable suggestions.

Key features include:

- Conversational AI therapy with a CBT-based approach
- Mood and emotion tracking
- Journaling with AI-generated summaries
- Personal goals and struggles management
- Weekly and monthly AI-generated insights
- Comprehensive analytics dashboard

## 🧠 AI Integration

Jiso uses Qwen 2.5 7B, an open-source LLM from Alibaba Cloud, to power its AI capabilities. The system employs several AI components:

- **Therapeutic Chat**: A conversational AI that implements cognitive behavioral therapy techniques
- **Journal Analysis**: Automatic summarization of journal entries at multiple levels of detail
- **Theme Extraction**: Identification of recurring patterns in user mood, journaling, and conversations
- **Insight Generation**: Weekly and monthly analysis of user data to provide personalized insights
- **Suggestion Creation**: AI-generated practical recommendations based on user goals and struggles

### Local LLM Setup with Ollama

For local development or deployments without external AI services, we recommend using [Ollama](https://ollama.ai/) to run the Qwen 2.5 7B model locally:

1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Pull the Qwen 2.5 7B model:
   ```bash
   ollama pull qwen2:7b
   ```
3. Configure your `.env` file to use Ollama's API:
   ```
   AI_SERVICE_ENDPOINT=http://localhost:11434/v1
   AI_SERVICE_APIKEY=ollama
   AI_MODEL_NAME=qwen2:7b
   ```

Ollama provides an OpenAI-compatible API that works seamlessly with our integration, allowing for easy local development without relying on external services.

## 🏗️ Project Structure

```
├── ai/                    # AI integration components
│   ├── chat.ai.js         # Therapeutic chat implementation
│   ├── context.ai.js      # Context analysis for themes
│   ├── insight.ai.js      # Insights and suggestions generation
│   ├── journal.ai.js      # Journal summarization
│   └── builders/          # Context building utilities
├── controllers/           # API route controllers
├── middlewares/           # Express middlewares
├── models/                # Mongoose data models
├── routes/                # API route definitions
├── utils/                 # Utility functions
├── mailersend/            # Email functionality
├── server.js              # Main application entry point
└── data-dictionary.md     # Detailed data model documentation
```

## 🗄️ Data Models

The application uses several interconnected MongoDB models:

1. **User**: Authentication and profile information
2. **UserContext**: Personalized user context including goals, struggles, and themes
3. **Journal**: User journal entries with AI-generated summaries
4. **Mood**: Emotional state tracking
5. **Chat**: Conversations with the AI therapist
6. **Insight**: AI-generated insights and suggestions

Detailed schema information is available in the [data-dictionary.md](./data-dictionary.md) file.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Ollama (for local AI model serving) or alternative AI service endpoint

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/jiso-backend.git
cd jiso-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=8888
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
AI_SERVICE_ENDPOINT=http://localhost:11434/v1
AI_SERVICE_APIKEY=ollama
AI_MODEL_NAME=qwen2:7b
CRON_API_KEY=your_cron_api_key
# Email configuration
MAILERSEND_API_KEY=your_mailersend_api_key
```

4. Start the development server

```bash
npm run dev
```

## 🔍 API Endpoints

The API is organized into the following routes:

- **Auth**: `/api/v1/auth` - User authentication and profile management
- **User Context**: `/api/v1/context` - User goals, struggles, and theme management
- **Journals**: `/api/v1/journals` - Journal entry CRUD operations
- **Moods**: `/api/v1/moods` - Mood entry CRUD operations
- **Insights**: `/api/v1/insights` - Access to AI-generated insights
- **Chats**: `/api/v1/chats` - Conversation management with the AI therapist
- **Dashboard**: `/api/v1/dashboard` - Analytics and data visualization endpoints
- **Cron**: `/api/v1/cron` - Scheduled tasks for AI processing

## ⚙️ Scheduled Tasks

The application includes several automated processes that run periodically:

1. **Weekly Context Updates**: Analyzes user data to identify weekly themes
2. **Monthly Context Updates**: Provides deeper analysis over a monthly timeframe
3. **Weekly Insight Generation**: Creates personalized insights based on weekly themes
4. **Monthly Insight Generation**: Produces more comprehensive monthly insights
5. **Journal Summarization**: Automatically summarizes new journal entries
6. **Chat Summarization**: Creates concise summaries of therapy conversations

## 🛡️ Security

- JWT-based authentication with refresh tokens
- Email verification for new accounts
- Password reset functionality
- API key protection for cron jobs
- MongoDB document-level access control

## 📊 AI-Generated Insight Features

The backend provides extensive AI generated analytics for data visualization:

- Mood trends and emotion frequency analysis
- Journal analytics with emotion and tag tracking
- Goal completion metrics
- Chat session analysis

## 👥 Authors

- Kuldeep Solanki
