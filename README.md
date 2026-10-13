# Lens AI Insights

Build a premium, production-quality web app called **Lens — See What Matters**, an AI Startup Research Analyst.

**Design direction**
- Ultra-minimal, sophisticated monochrome interface: white/off-white background, black typography, subtle gray borders, generous whitespace, restrained shadows.
- Beautiful editorial typography and a polished SaaS dashboard aesthetic.
- Fully responsive, with excellent desktop and mobile layouts.
- Avoid generic chatbot styling, excessive gradients, bright colors, and unnecessary cards.

**Main experience**
1. A refined landing/dashboard with the Lens wordmark and a concise headline: “See what matters.”
2. A large research-goal input where users can enter questions about startups, markets, competitors, technologies, and business opportunities.
3. A prominent “Start research” button, with example research prompts.
4. A research workspace showing distinct workflow stages: Planning, Researching, Validating, and Synthesizing.
5. A results dashboard with a structured final report, key findings, evidence, source links, and recommendations.
6. Loading, empty, error, and retry states. Never fabricate research results or pretend a backend request succeeded.

**Technical requirements**
- Use React, TypeScript, Tailwind CSS, and reusable components.
- Build the frontend with clean component organization.
- Keep the research API URL configurable through an environment variable.
- Prepare an API service layer for a Python FastAPI backend that will connect to an existing LangGraph research agent.
- Do not implement a fake AI backend, invent sources, or require a Supabase database for the initial version.
- Initially use clearly labeled mock data only for UI previews. Keep mock data separate from real API results so we can connect the actual backend later.

First, create the complete polished frontend and make the core research flow visually functional.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1e05c863-65ce-4c00-83a1-ecc04544df13).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
