# Google Gemini API Setup Instructions

## Step 1: Get Your Gemini API Key

1. Go to **https://aistudio.google.com/app/apikeys**
2. Click **"Create API Key"** button
3. Copy the generated API key
4. Keep it secure - never commit it to version control

## Step 2: Add to Environment Variables

In the v0 app, go to the **Vars** section (left sidebar) and add:

```
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Gemini API key from Step 1.

## Step 3: Install Gemini SDK Package

The following package is required:

```bash
npm install @google/generative-ai
```

This is already added to the project and will be installed automatically.

## Step 4: Verify It's Working

1. Go to the AI Tutor page
2. Ask a question like "What is photosynthesis?"
3. You should get a real AI-generated response from Gemini API

## Security Notes

- Never expose your API key in client-side code
- All API calls go through the server (`/api/*` routes)
- The API key is stored securely in environment variables
- Rate limiting is enforced per user

## Available Models

- **gemini-1.5-flash** (faster, recommended for education)
- **gemini-1.5-pro** (more powerful, higher cost)
- **gemini-2.0-flash** (latest, if available)

The app is configured to use `gemini-1.5-flash` for optimal performance and cost.

## Troubleshooting

If you get an error like "GEMINI_API_KEY is not set":
1. Make sure you added it to the Vars section
2. Refresh the page
3. Check that the key is copied correctly without extra spaces

If responses are slow:
- This is normal for first request (model warm-up)
- Subsequent requests should be faster
