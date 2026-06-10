# Why Agentic AI?

## The short version

CampusPilot AI uses an **agentic** architecture — a LangChain agent powered by
**Llama 3.3 70B (via Groq)** that dynamically calls tools — not a scripted
chatbot, because helping a student reach a destination accessibly is a
*multi-step, changing, goal-directed* problem, which is exactly what agentic
systems are built for.

## What "agentic" actually means

A traditional chatbot is **reactive**: it matches a question to a script and
returns a fixed response. It does not pursue a goal, hold state, or act on the
world.[^goodcall][^ibm] An **agentic AI** adds memory, tool access, and reasoning
on top of an LLM so it can *plan actions, use tools, and pursue goals* across
multiple steps.[^arxiv][^ibm] A useful description of its loop is **Perception →
Reasoning → Action → Memory**.[^automationanywhere] Its defining traits are
autonomy, planning, and tool integration.[^unified]

## Why CampusPilot specifically needs it

This isn't theoretical — it maps directly onto our build:

1. **It dynamically chooses tools.** The agent decides, per query, whether to call
   `route_query` (graph routing in Neo4j), `qr_lookup` (resolve a scanned QR to a
   location), `profile_detect` (set the disability profile), or `flag_obstacle`
   (report a blocked path). Picking the right tool for an open-ended request is
   core agentic behaviour, not chatbot behaviour.[^unified][^ibm]

2. **Routing must be re-planned dynamically.** An accessible route depends on live
   conditions — a path gets flagged blocked, a route is closed. The agent detects
   the change and re-plans the next viable accessible path, the "rerouting"
   behaviour accessible-navigation systems are expected to provide.[^navigine]

3. **It remembers the user and context.** The agent keeps state — your **last
   scanned QR code** and **active disability profile** — so a blind cane user and a
   power-wheelchair user get different routes without re-asking. Persistent memory
   is something agents do and scripted bots don't.[^unified]

4. **It's proactive and conversational, with safe fallbacks.** Students ask in
   plain language; queries are pre-classified (navigation vs. emergency) so
   responses are fast and emergencies get strict handling — adaptive, goal-pursuing
   behaviour that separates agentic AI from reactive chatbots.[^rellify][^arxiv]

## Where a simple chatbot would suffice — and why we go further
For trivial FAQs ("library hours?") a scripted bot is cheaper.[^rellify]
CampusPilot's value is the *hard* cases — dynamic, personalised, multi-step
accessible routing — where a reactive system hits a wall. That gap is the
justification for an agentic approach.

---

[^goodcall]: Goodcall — *Agentic AI Platforms vs Traditional Chatbot Builders.* https://www.goodcall.com/voice-ai/agentic-ai-platforms-vs-traditional-chatbot-builders
[^ibm]: IBM — *Agentic AI vs. Generative AI.* https://www.ibm.com/think/topics/agentic-ai-vs-generative-ai
[^arxiv]: *Caveats and Mitigations for Individual Users of AI Chatbots* (arXiv:2508.10272), §2.5. https://arxiv.org/pdf/2508.10272
[^automationanywhere]: Automation Anywhere — *What is Agentic AI?* https://www.automationanywhere.com/rpa/agentic-ai
[^unified]: Unified Infotech — *Agentic AI vs Traditional Chatbots.* https://www.unifiedinfotech.net/blog/agentic-ai-vs-traditional-chatbots/
[^navigine]: Navigine — *Accessible Indoor Navigation: 2026 ADA Compliance Guide.* https://navigine.com/blog/accessible-indoor-navigation-the-2026-guide-to-compliance-and-universal-design/
[^rellify]: Rellify — *Agentic AI vs. Traditional Chatbots.* https://rellify.com/blog/agentic-ai-vs-traditional-chatbots
