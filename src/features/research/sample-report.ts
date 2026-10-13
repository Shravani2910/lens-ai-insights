import type { ResearchReport } from "./research-api";

// This deliberately illustrative mock is isolated from real API state.
// It contains no factual findings, evidence, or fabricated source links.
export const sampleReport: ResearchReport = {
  title: "AI tools for independent teams",
  summary:
    "This example shows how an eventual research report can be structured. Its statements below are placeholders, not findings.",
  findings: [
    {
      title: "A sample finding goes here",
      detail:
        "A concise synthesis of a market signal would appear in this space after the research agent verifies it.",
      evidence: "Illustrative evidence excerpt — not a real quote or source.",
      sources: [],
    },
    {
      title: "A second signal can be compared",
      detail:
        "Validated evidence can help distinguish a durable opportunity from a passing trend.",
      evidence: "Source evidence will be supplied by the connected research service.",
      sources: [],
    },
  ],
  recommendations: [
    "Example recommendation — replace with a conclusion supported by evidence.",
    "Example next step — test the strongest open question with primary research.",
  ],
};