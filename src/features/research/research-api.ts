export type ResearchSource = {
  label: string;
  url: string;
};

export type ResearchFinding = {
  title: string;
  detail: string;
  evidence: string;
  sources: ResearchSource[];
};

export type ResearchReport = {
  title: string;
  summary: string;
  findings: ResearchFinding[];
  recommendations: string[];
};

export class ResearchApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResearchApiError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isSource = (value: unknown): value is ResearchSource => {
  if (!isRecord(value) || !isText(value["label"]) || !isText(value["url"])) return false;
  try {
    const url = new URL(value["url"]);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export function isResearchReport(value: unknown): value is ResearchReport {
  if (
    !isRecord(value) ||
    !isText(value["title"]) ||
    !isText(value["summary"]) ||
    !Array.isArray(value["findings"]) ||
    value["findings"].length === 0 ||
    !Array.isArray(value["recommendations"]) ||
    value["recommendations"].length === 0 ||
    !value["recommendations"].every(isText)
  ) {
    return false;
  }

  return value["findings"].every(
    (finding) =>
      isRecord(finding) &&
      isText(finding["title"]) &&
      isText(finding["detail"]) &&
      isText(finding["evidence"]) &&
      Array.isArray(finding["sources"]) &&
      finding["sources"].length > 0 &&
      finding["sources"].every(isSource),
  );
}

export async function requestResearch(question: string): Promise<ResearchReport> {
  const endpoint = import.meta.env["VITE_RESEARCH_API_URL"]?.trim();
  if (!endpoint) {
    throw new ResearchApiError(
      "The research service is not configured yet. Add VITE_RESEARCH_API_URL to connect your research API.",
    );
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch {
    throw new ResearchApiError("We couldn’t reach the research service. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new ResearchApiError(
      `The research service returned an error (${response.status}). Please try again.`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ResearchApiError("The research service returned unreadable data. Please try again.");
  }

  const report = isRecord(payload) && "report" in payload ? payload["report"] : payload;
  if (!isResearchReport(report)) {
    throw new ResearchApiError(
      "The research service returned an incomplete report. No results were shown; please try again.",
    );
  }

  return report;
}