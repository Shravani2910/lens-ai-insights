import { describe, expect, it } from "vitest";

import { isResearchReport } from "./research-api";

const validReport = {
  title: "A report",
  summary: "A research summary.",
  findings: [
    {
      title: "A finding",
      detail: "What it means.",
      evidence: "A cited observation.",
      sources: [{ label: "Source", url: "https://example.org/report" }],
    },
  ],
  recommendations: ["Investigate further."],
};

describe("isResearchReport", () => {
  it("accepts a complete report with source links", () => {
    expect(isResearchReport(validReport)).toBe(true);
  });

  it("rejects results without evidence or source links", () => {
    expect(
      isResearchReport({
        ...validReport,
        findings: [{ ...validReport.findings[0], sources: [] }],
      }),
    ).toBe(false);
  });

  it("rejects a malformed source URL", () => {
    expect(
      isResearchReport({
        ...validReport,
        findings: [
          { ...validReport.findings[0], sources: [{ label: "Source", url: "javascript:alert(1)" }] },
        ],
      }),
    ).toBe(false);
  });
});