# Vercel AI SDK Setup Guide - Zero Configuration

## The Concept

Vercel AI SDK uses the **Vercel AI Gateway**, which is a unified interface that:
- Automatically handles authentication for you
- Routes requests to AI providers (OpenAI, Anthropic, etc.)
- Manages API keys securely on Vercel's backend
- Works WITHOUT manual API key configuration

## What You Don't Need to Do

❌ You DO NOT need to:
- Get an OpenAI API key
- Get Anthropic API key
- Get any provider API key
- Add OPENAI_API_KEY to .env
- Configure model authentication manually

## What You Already Have

Your app currently uses:
```
model: "openai/gpt-4o-mini"
```

This automatically routes through Vercel AI Gateway, which is already integrated in your Vercel project.

## How It Works in Your Code

### Current Working Implementation:

1. **Quiz Generation** (`lib/ai/quiz-generator.ts`):
```
import { generateText } from "ai"
const { text } = await generateText({
  model: "openai/gpt-4o-mini",  // ← Gateway handles this automatically
  prompt: "..."
})
```

2. **Flashcard Generation** (`app/api/generate-flashcards/route.ts`):
```
Same setup - no API keys needed
```

3. **AI Tutor** (`lib/ai/tutor-generator.ts`):
```
Same setup - no API keys needed
```

## Supported Models Through Gateway

These work automatically without API keys:

- `openai/gpt-4o-mini` (default)
- `openai/gpt-4-turbo`
- `anthropic/claude-sonnet-4.5`
- `anthropic/claude-opus`
- `xai/grok-4-fast`
- `google/gemini-2.0-flash`
- `fireworks/llama-v3.1-405b`

## Why Your App Works Without API Keys

Your Vercel project has access to the AI Gateway through:
1. Vercel platform authentication
2. Project connection to Vercel dashboard
3. Zero configuration needed

## If You Want Custom API Key (Optional)

If you prefer to use your OWN API keys instead of the gateway:

### For OpenAI:

1. Get API key from https://platform.openai.com/api-keys
2. Add to .env:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```
3. Update code:
```
import { openai } from "@ai-sdk/openai"
const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "..."
})
```
4. Install provider package:
```
npm install @ai-sdk/openai
```

### For Anthropic:

1. Get API key from https://console.anthropic.com/
2. Add to .env:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```
3. Update code:
```
import { anthropic } from "@ai-sdk/anthropic"
const { text } = await generateText({
  model: anthropic("claude-opus"),
  prompt: "..."
})
```
4. Install provider package:
```
npm install @ai-sdk/anthropic
```

## Current Setup in Your App

Your app is already perfectly configured to use:
- ✅ Vercel AI Gateway (zero config)
- ✅ GPT-4o-mini model
- ✅ All AI features working (quiz, flashcard, tutor)
- ✅ No API keys exposed in code
- ✅ Secure authentication through Vercel

## Testing

Your AI features should work immediately:

1. Sign up and complete profile
2. Go to Practice & Quizzes
3. Select a quiz mode
4. Choose difficulty
5. Click "Generate Quiz"
6. AI generates questions in seconds

No setup needed! The Vercel AI Gateway handles everything.

## Summary

- **Current Status**: ✅ Fully working with Vercel AI Gateway
- **API Key Needed**: ❌ No
- **Configuration Needed**: ❌ No
- **Environment Variables**: Only Supabase variables needed

Your AI Tutor app is production-ready as-is!
