---
title: Ask ServiceStack Docs - Introducing AI Search
summary: Learn about the new AI Search feature - Typesense Conversational RAG for ServiceStack Docs
tags: [llms,ai,docs]
author: Lucy Bates
image: https://servicestack.net/img/posts/typesense-ai-search/bg.webp
---

We're excited to announce the new Typesense-powered **AI Search**, a powerful new feature bringing 
conversational AI capabilities to [ServiceStack Docs](https://docs.servicestack.net). 

[![](https://servicestack.net/img/posts/typesense-ai-search/ai-search-default.webp)](https://docs.servicestack.net)

### Comprehensive Docs

As ServiceStack has grown over the years, so have our docs - now spanning hundreds of pages covering everything
from core features to advanced integrations. While comprehensive documentation is invaluable, finding the right information
quickly can be challenging. Traditional search works well when you know what you're looking for, but what about when you
need to understand concepts, explore solutions, or learn how different features work together? That's where **AI Search** comes in.

[![](https://servicestack.net/img/posts/typesense-ai-search/ai-search-button.webp)](https://docs.servicestack.net)


**AI Search** leverages Typesense's advanced [Conversational Search API](https://typesense.org/docs/29.0/api/conversational-search-rag.html) 
that uses Retrieval-Augmented Generation (RAG) of our docs combined with an LLM to provide intelligent, context-aware answers 
directly from our documentation.

[![](https://servicestack.net/img/posts/typesense-ai-search/ai_search_add_servicestack_reference.webp)](https://docs.servicestack.net)

#### AI Search vs Instant Typesense Search

**AI Search** is ideal for when you need conversational answers, explanations of concepts, or help understanding 
how different features work together. The AI excels at synthesizing information across multiple documentation pages 
to answer complex `how do I...` questions. 

Otherwise the existing instant Typesense Search is still the best option when you know exactly what you're looking for - like a 
specific API name, configuration option, or documentation page. 

## What is Typesense AI Search?

Typesense AI Search is a conversational interface that allows you to ask natural language questions about 
ServiceStack and receive:

- **AI-Generated Answers** - Intelligent responses powered by Typesense's conversational model
- **Relevant Documentation Links** - Direct links to the most relevant documentation pages
- **Multi-turn Conversations** - Ask follow-up questions within the same conversation context

## Key Features

[![](https://servicestack.net/img/posts/typesense-ai-search/ai-search-button.webp)](https://docs.servicestack.net)

### 🤖 Conversational Interface

Click the AI Search button (chat icon) in the header to open an intuitive modal dialog. 
Type your question and get instant answers without leaving the documentation.

### 📚 Retrieval-Augmented Generation (RAG)

The AI doesn't just generate responses - it grounds its answers in actual ServiceStack documentation. 
Each response includes:

- **AI-Generated Answer** - Contextual explanation based on your question
- **Search Results** - Up to 10 relevant documentation snippets with direct links
- **Snippets** - Quick previews of relevant content to help find what you need

### 💬 Multi-turn Conversations

Maintain context across multiple questions in a single conversation:

- Ask initial questions about ServiceStack features
- Follow up with clarifications or related topics
- The conversation ID is automatically maintained for coherent context
- Start a new conversation anytime by clicking on **clear** links or refreshing

### Asking Questions

- Type your question naturally (e.g., "How do I set up authentication?")
- Review the AI answer and explore the suggested documentation links

### Following Up

1. Ask related questions in the same conversation
2. The AI maintains context from previous messages
3. Click any documentation link to navigate to the full page
4. Start a new conversation anytime by refreshing

## Technical Implementation

The AI Search feature was built with:

- [TypesenseConversation Component](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/mjs/components/TypesenseConversation.mjs) - AI Search UI Vue component
- **Indexing** - Uses [typesense-docsearch-scraper](https://github.com/typesense/typesense-docsearch-scraper) to index 
content and generate embeddings using custom field definitions defined in [typesense-scraper-config.json](https://github.com/ServiceStack/docs.servicestack.net/blob/main/search-server/typesense-scraper/typesense-scraper-config.json)
- **Setup** - Conversational Model and Conversation History collection created in [setup-search-index.yml](https://github.com/ServiceStack/docs.servicestack.net/blob/main/.github/workflows/setup-search-index.yml) GitHub Action
- **LLM** - Typesense sends the query and relevant context to Gemini Flash 2.5 as the Conversational Model
- **Backend**: Uses [Typesense Conversational Search (RAG)](https://typesense.org/docs/29.0/api/conversational-search-rag.html) `multi_search` API

## Use Cases

### For Developers

- **Quick Answers** - Get instant answers without searching through docs
- **Learning** - Understand ServiceStack concepts through conversational explanations
- **Troubleshooting** - Ask about common issues and get relevant solutions
- **Discovery** - Find features you didn't know existed

### For Teams

- **Onboarding** - New team members can quickly learn ServiceStack
- **Documentation** - Reduces support burden by providing instant answers
- **Knowledge Base** - Conversational access to your documentation

## Feedback & Support

We'd love to hear your feedback! If you encounter any issues or have suggestions for improvements, please [let us know!](https://forums.servicestack.net/).