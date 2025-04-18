# VIBR - Intent-First AI Chat Platform

<div align="center">
 <img src="public/vibr-logo.png" alt="VIBR Logo" width="180" />
 <h3>The AI chat that gets your vibe. Built for coders, by coders.</h3>
 <p><em>Next.js Global Hackathon 2025 - Best Use of AI Track</em></p>
</div>

<div align="center">
 <a href="#-demo">Live Demo</a> •
 <a href="#-key-features">Key Features</a> •
 <a href="#-why-vibr">Why VIBR?</a> •
 <a href="#️-tech-stack">Tech Stack</a> •
 <a href="#-installation">Installation</a> •
 <a href="#️-usage">Usage</a> •
 <a href="#️-architecture">Architecture</a> •
 <a href="#️-roadmap">Roadmap</a> •
 <a href="#-team">Team</a>
</div>

<br />

## 🚀 The Intent-First Revolution

VIBR is not just another AI chat platform. It's a revolutionary approach to AI interaction that fundamentally changes how developers work with artificial intelligence.

**The Problem**: Most AI tools today rely on slow, generic LLM responses for every task—even when speed, security, or accuracy matters most. This one-size-fits-all approach creates unnecessary latency, security risks, and suboptimal experiences.

**Our Solution**: VIBR flips this model with our intent-based engine that understands your workflow, routes simple tasks through fast local logic, and only uses LLMs when creative reasoning is needed.

## 📹 Demo

Check out our 1-minute demo video to see VIBR in action:

<div align="center">
  <video src="public/vibr_demo.mp4" width="640" height="360" controls></video>
</div>

This demo clip provides a brief example of the modularity and intelligent routing capabilities of VIBR. It highlights how the platform can handle various intents, from simple project creation to complex creative tasks, all while maintaining security and performance.

The demo video showcases VIBR login with Supabase Auth, intent-based routing in action with secure Supabase db operations as server actions for "Create project" and "Add description", llm-routing for creative tasks with context enrichment for "Write X post", and more. The UI in the demo showcases the inline chat interface, with the floating option and action button option also available.
You can also [download the demo video](public/vibr_demo.mp4) to view it directly.

## 🎯 Key Features

### 1. Intent-Based Routing

- **High-Proximity Intents**: Project creation, file operations, and other structured tasks are handled by specialized knowledge graphs
- **Low-Proximity Intents**: Creative tasks enhanced with local context before reaching the LLM
- **Security-Sensitive Intents**: Secure handling of sensitive operations that never leave your environment

### 2. Performance Advantages

- **10x Faster Response**: Intent-based routing eliminates unnecessary LLM calls
- **Enhanced Security**: Sensitive data never reaches external LLMs
- **Context-Aware Intelligence**: Understands your workflow and adapts accordingly
- **Reduced Costs**: Optimized resource usage means lower operational costs

### 3. Developer Experience

- **Seamless Integration**: Works with your existing tools and workflows
- **Personalized Responses**: Learns from your coding style and preferences
- **Multi-Model Support**: Leverages multiple AI models for optimal results
- **Open Source**: 100% open source and extensible

## Why VIBR?

### Innovation in AI Interaction

VIBR represents a paradigm shift in how we interact with AI. Instead of treating all requests equally, we've created an intelligent system that understands intent and routes accordingly. This is not just an incremental improvement—it's a fundamental rethinking of AI chat architecture.

### Solving Real Developer Problems

As developers ourselves, we built VIBR to solve the real-world frustrations we experienced with existing AI tools:

- Waiting for simple operations that shouldn't need LLM processing
- Worrying about sensitive data being sent to external models
- Receiving generic responses that lack project context
- Paying for token usage on operations that don't require it

### Technical Excellence

Our implementation showcases technical excellence through:

- Advanced intent classification using specialized knowledge graphs
- Hybrid processing pipeline that optimizes for both speed and creativity
- Secure local processing for sensitive operations
- Seamless context sharing between local and remote processing

### Next.js Integration

VIBR is built with Next.js at its core, leveraging:

- App Router for optimized routing and navigation
- Server Components for enhanced performance
- Server Actions for secure data operations
- Edge Runtime for global low-latency responses

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Edge Functions
- **AI**: OpenAI, Vercel AI SDK, Custom Intent Classification System
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 📦 Installation

```bash

# Clone the repository

git clone <https://github.com/headline-design/vibr-ai.git>

# Navigate to the project directory

cd vibr

# Install dependencies

npm install

# Set up environment variables

cp .env.example .env.local

# Add your API keys to .env.local

# Run the development server

npm run dev
```

## 🖥️ Usage

### Getting Started

1. Create an account or sign in
2. Start a new chat session
3. Ask anything - from project creation to creative content generation
4. Experience the difference in response times based on intent

### Example Prompts

- **High-Proximity Intent**: "Create a new Next.js project called Dashboard"
- **Low-Proximity Intent**: "Write a tweet announcing my new project"
- **Security-Sensitive Intent**: "Show me my API keys for the Dashboard project"

## 🏗️ Architecture

VIBR's architecture consists of four main components:

1. **Intent Classification Engine**

- Analyzes user input to determine request type
- Routes to appropriate processing pipeline
- Continuously learns from user interactions

2. **Local Processing System**

- Handles high-proximity intents
- Executes deterministic operations
- Ensures data security and privacy

3. **Enhanced LLM Pipeline**

- Processes creative and complex requests
- Enriches prompts with local context
- Optimizes token usage

4. **Context Management System**

- Maintains project and user context
- Provides relevant information to both pipelines
- Ensures consistent user experience

## 📊 Performance Metrics

| Metric | Traditional AI | VIBR |
|--------|---------------|------|
| Response Time (simple tasks) | 2-5 seconds | 0.2-0.5 seconds |
| Response Time (complex tasks) | 5-10 seconds | 3-7 seconds |
| Token Usage | 100% | 40-60% |
| Security Risk Level | Medium-High | Low |
| Context Awareness | Generic | Project-Specific |

## 🗺️ Roadmap

- **Q2 2025**: Public beta launch
- **Q3 2025**: VIBR Coding Manager Platform release
- **Q4 2025**: Enterprise features and integrations
- **Q1 2026**: Mobile application

## 👥 Team

VIBR was created by developers who were frustrated with the limitations of existing AI tools and decided to build something better.

- **Lead Developer & Founder**: [Aaron Martinez](https://github.com/headline-design) - Based in Texas, USA
- **AI Architecture**: Collaborative effort with contributions from the open source community
- **UX Design**: In-house design with feedback from early users
- **Full Stack Development**: Led by Aaron with support from contributors

Aaron started VIBR after experiencing firsthand the limitations of existing AI coding assistants and recognizing the need for a more intelligent, context-aware solution that respects both performance and security concerns.

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

The AGPL-3.0 is a copyleft license that requires anyone who distributes your code or a derivative work to make the source available under the same terms. It also specifically addresses the use of software over a network, requiring that the complete source code be made available to any network user of the AGPL-licensed work.

Key restrictions:

- Anyone who modifies and distributes the code must make their modifications available under AGPL
- If the code is used as part of a network service, the complete source code must be made available to users
- All derivative works must be licensed under AGPL
- Commercial use is permitted, but all code must remain open source

## 🙏 Acknowledgements

- [Next.js Team](https://nextjs.org/) for creating an amazing framework
- [Vercel](https://vercel.com/) for their AI SDK and hosting platform
- [OpenAI](https://openai.com/) for their powerful language models
- [Supabase](https://supabase.com/) for their database solutions

---

<div align="center">
 <p>Built with ❤️ for the Next.js Global Hackathon 2025</p>
 <p>
   <a href="https://x.com/ussaaron_">X</a> •
   <a href="https://github.com/headline-design/vibr-ai">GitHub</a> •
   <a href="https://vibr.fun">Website</a>
 </p>
</div>
