import { useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  FileText,
  LoaderCircle,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  requestResearch,
  type ResearchReport,
  type ResearchSource,
} from "@/features/research/research-api";
import { sampleReport } from "@/features/research/sample-report";

const examples = [
  "Where is AI creating real value for small businesses?",
  "Map the emerging market for grid-scale battery software",
  "Who is building the next generation of vertical SaaS?",
];

const workflow = ["Planning", "Researching", "Validating", "Synthesizing"];

type RequestState = "idle" | "loading" | "success" | "error";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lens — See what matters | Startup research analyst" },
      {
        name: "description",
        content:
          "Research startups, markets, competitors, and emerging technology with evidence-first analysis from Lens.",
      },
      { property: "og:title", content: "Lens — See what matters" },
      {
        property: "og:description",
        content: "An evidence-first research desk for startup and market intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LensWorkspace,
});

function LensWorkspace() {
  const [question, setQuestion] = useState("");
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"findings" | "recommendations">("findings");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isConfigured = Boolean(import.meta.env.VITE_RESEARCH_API_URL?.trim());

  const startResearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || requestState === "loading") return;

    setReport(null);
    setIsSample(false);
    setError("");
    setRequestState("loading");
    try {
      const result = await requestResearch(trimmedQuestion);
      setReport(result);
      setRequestState("success");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The research request failed. Please try again.",
      );
      setRequestState("error");
    }
  };

  const showSample = () => {
    setReport(sampleReport);
    setIsSample(true);
    setError("");
    setRequestState("success");
    setActiveSection("findings");
  };

  const startNew = () => {
    setQuestion("");
    setReport(null);
    setIsSample(false);
    setError("");
    setRequestState("idle");
    setActiveSection("findings");
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line-subtle bg-background">
        <div className="mx-auto flex h-[68px] max-w-[1460px] items-center justify-between px-5 md:px-10">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Lens home" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Search className="size-[15px]" strokeWidth={1.8} />
              </span>
              <span className="font-display text-[24px] leading-none">lens</span>
            </Link>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <span className="hidden text-xs text-muted-foreground sm:inline">Research desk</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className={`size-1.5 rounded-full ${isConfigured ? "bg-primary" : "bg-muted-foreground/40"}`} />
              {isConfigured ? "Service connected" : "Service not connected"}
            </span>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <Button variant="ghost" size="sm" className="h-9 gap-2 px-2.5 text-xs" onClick={startNew}>
              <Plus className="size-4" strokeWidth={1.7} />
              <span>New research</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1460px] grid-cols-1 gap-12 px-5 pb-24 pt-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-[clamp(48px,8vw,132px)] lg:pt-[68px]">
        <section className="min-w-0">
          <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <span>Independent thinking, clearly sourced</span>
            <span className="size-1 rounded-full bg-muted-foreground/50" />
            <span>01 / Research</span>
          </div>
          <h1 className="max-w-[790px] font-display text-[clamp(3.4rem,7.3vw,6.2rem)] leading-[0.96] tracking-[-0.035em]">
            See what
            <br className="hidden sm:block" /> matters.
          </h1>
          <p className="mt-6 max-w-[540px] text-[15px] leading-7 text-ink-soft">
            A sharper view of startups, markets, and the ideas reshaping them. Start with a question; follow the evidence.
          </p>

          <form onSubmit={startResearch} className="mt-11" aria-label="Start a research request">
            <label htmlFor="research-question" className="mb-3 block text-[13px] font-medium">
              What are you looking to understand?
            </label>
            <div className="rounded-sm border border-border bg-card transition-colors focus-within:border-foreground/45">
              <Textarea
                id="research-question"
                ref={textareaRef}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about a company, market, competitor, technology…"
                className="min-h-[138px] resize-y rounded-none border-0 bg-transparent px-5 py-5 text-[15px] leading-7 shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 md:min-h-[150px]"
                maxLength={1200}
                aria-describedby="question-meta"
              />
              <div id="question-meta" className="flex items-center justify-between border-t border-line-subtle px-4 py-3">
                <span className="text-[11px] text-muted-foreground">{question.length} / 1,200</span>
                <Button
                  type="submit"
                  disabled={!question.trim() || requestState === "loading"}
                  className="h-10 gap-2 rounded-sm px-4 text-[13px] font-medium"
                >
                  {requestState === "loading" ? (
                    <><LoaderCircle className="size-4 animate-spin" /> Researching</>
                  ) : (
                    <>Start research <ArrowUp className="size-4" /></>
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
              A few places to begin
            </div>
            <div className="flex flex-col items-start gap-1.5">
              {examples.map((example, index) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setQuestion(example);
                    textareaRef.current?.focus();
                  }}
                  className="group flex max-w-full items-start gap-2 py-1 text-left text-[13px] leading-5 text-ink-soft transition-colors hover:text-foreground"
                >
                  <span className="mt-[1px] w-4 shrink-0 font-mono text-[10px] text-muted-foreground/70">0{index + 1}</span>
                  <span>{example}</span>
                  <ArrowRight className="mt-0.5 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">The process</div>
                <h2 className="mt-2 font-display text-[27px] leading-tight">From question to clarity.</h2>
              </div>
              <span className="text-xs text-muted-foreground">Evidence first. Conclusions second.</span>
            </div>
            <ol className="mt-7 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-3" aria-label="Research workflow">
              {workflow.map((stage, index) => (
                <li key={stage} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11px] text-ink-soft">
                    0{index + 1}
                  </span>
                  <span className="text-[13px] text-ink-soft">{stage}</span>
                  {index < workflow.length - 1 && <span className="hidden h-px flex-1 bg-line-subtle sm:block" />}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[11px] text-muted-foreground">Stages show the research method; live progress is not available until a service is connected.</p>
          </div>

          <ReportPanel
            report={report}
            isSample={isSample}
            state={requestState}
            error={error}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onRetry={() => void startResearch()}
          />
        </section>

        <aside className="lg:pt-3">
          <div className="border-t border-border pt-5 lg:border-t-0 lg:pt-0">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Field notes
            </div>
            <h2 className="mt-4 font-display text-[25px] leading-tight">Good questions lead somewhere.</h2>
            <p className="mt-3 text-[13px] leading-6 text-ink-soft">
              Find the signal beneath the story. Lens is built for the questions that deserve more than a quick search.
            </p>
            <div className="mt-7 border-y border-line-subtle py-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <FileText className="size-3.5" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[12px] font-medium">Evidence, not assertions</h3>
                  <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">Every finding should lead back to a source you can inspect.</p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Sparkles className="size-3.5" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[12px] font-medium">Made for the next decision</h3>
                  <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">A useful report ends with clear trade-offs and next steps.</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="mt-4 h-auto gap-2 px-0 py-2 text-xs text-ink-soft hover:bg-transparent hover:text-foreground" onClick={showSample}>
              <FileText className="size-3.5" /> See an example report <ChevronRight className="size-3.5" />
            </Button>
            <div className="mt-2 border-t border-line-subtle pt-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Research service</span>
                <span className="font-medium">{isConfigured ? "Connected" : "Not configured"}</span>
              </div>
              {!isConfigured && (
                <p className="mt-2 text-[11px] leading-[1.6] text-muted-foreground">
                  Live analysis will be available when the research API is connected. Example reports are illustrative only.
                </p>
              )}
            </div>
            <div className="mt-8 text-[11px] text-muted-foreground">LENS / INDEPENDENT RESEARCH</div>
          </div>
        </aside>
      </main>
      <footer className="border-t border-line-subtle">
        <div className="mx-auto flex max-w-[1460px] flex-col gap-1.5 px-5 py-5 text-[10px] uppercase tracking-[0.11em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10">
          <span>Lens research desk</span>
          <span>Clarity comes from looking closer.</span>
        </div>
      </footer>
    </div>
  );
}

type ReportPanelProps = {
  report: ResearchReport | null;
  isSample: boolean;
  state: RequestState;
  error: string;
  activeSection: "findings" | "recommendations";
  onSectionChange: (section: "findings" | "recommendations") => void;
  onRetry: () => void;
};

function ReportPanel({
  report,
  isSample,
  state,
  error,
  activeSection,
  onSectionChange,
  onRetry,
}: ReportPanelProps) {
  if (state === "idle" && !report) return null;

  return (
    <section className="mt-16 border-t border-border pt-7" aria-live="polite">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Research report</div>
          <h2 className="mt-2 font-display text-[30px] leading-tight">Your findings</h2>
        </div>
        {report && (
          <span className={`w-fit border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.09em] ${isSample ? "border-border bg-secondary text-secondary-foreground" : "border-primary/20 bg-paper-soft text-foreground"}`}>
            {isSample ? "Illustrative sample — not real research" : "Research service result"}
          </span>
        )}
      </div>

      {state === "loading" && (
        <div className="mt-7 border-y border-line-subtle py-8" role="status">
          <div className="flex items-center gap-3">
            <LoaderCircle className="size-4 animate-spin text-ink-soft" />
            <span className="text-sm font-medium">Waiting for the research service</span>
          </div>
          <p className="mt-2 pl-7 text-xs leading-5 text-muted-foreground">Your question was sent. Results will appear only after a complete report is returned.</p>
        </div>
      )}

      {state === "error" && (
        <div className="mt-7 border-y border-border py-6">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div className="min-w-0">
              <h3 className="text-sm font-medium">Research could not be completed</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{error}</p>
              <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 rounded-sm">
                <RotateCcw className="size-3.5" /> Try again
              </Button>
            </div>
          </div>
        </div>
      )}

      {state === "success" && report && (
        <div className="mt-7">
          {isSample && <p className="mb-5 border-l-2 border-border py-1 pl-3 text-xs leading-5 text-muted-foreground">This preview contains placeholder copy only. It has no factual claims, evidence, or sources.</p>}
          <h3 className="font-display text-[26px] leading-tight">{report.title}</h3>
          <p className="mt-3 max-w-3xl text-[14px] leading-7 text-ink-soft">{report.summary}</p>
          <div className="mt-7 flex gap-5 border-b border-border">
            <button
              type="button"
              aria-pressed={activeSection === "findings"}
              onClick={() => onSectionChange("findings")}
              className={`border-b-2 px-0.5 pb-3 text-[12px] transition-colors ${activeSection === "findings" ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Key findings <span className="ml-1.5 text-[10px] text-muted-foreground">{report.findings.length}</span>
            </button>
            <button
              type="button"
              aria-pressed={activeSection === "recommendations"}
              onClick={() => onSectionChange("recommendations")}
              className={`border-b-2 px-0.5 pb-3 text-[12px] transition-colors ${activeSection === "recommendations" ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Recommendations <span className="ml-1.5 text-[10px] text-muted-foreground">{report.recommendations.length}</span>
            </button>
          </div>

          {activeSection === "findings" ? (
            <div className="divide-y divide-line-subtle">
              {report.findings.map((finding, index) => (
                <article key={`${finding.title}-${index}`} className="grid gap-3 py-6 sm:grid-cols-[34px_minmax(0,1fr)] sm:gap-4">
                  <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-medium">{finding.title}</h4>
                    <p className="mt-2 text-[13px] leading-6 text-ink-soft">{finding.detail}</p>
                    <blockquote className="mt-3 border-l border-border pl-3 text-[12px] italic leading-5 text-muted-foreground">{finding.evidence}</blockquote>
                    {finding.sources.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                        {finding.sources.map((source: ResearchSource) => (
                          <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-ink-soft underline decoration-border underline-offset-4 hover:text-foreground">
                            {source.label}<ExternalLink className="size-3" />
                          </a>
                        ))}
                      </div>
                    ) : isSample ? (
                      <div className="mt-3 text-[10px] uppercase tracking-[0.09em] text-muted-foreground">No source — sample placeholder</div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <ol className="divide-y divide-line-subtle">
              {report.recommendations.map((recommendation, index) => (
                <li key={`${recommendation}-${index}`} className="grid gap-3 py-5 sm:grid-cols-[34px_minmax(0,1fr)] sm:gap-4">
                  <span className="flex size-6 items-center justify-center rounded-full border border-border text-ink-soft"><Check className="size-3" /></span>
                  <p className="text-[13px] leading-6 text-ink-soft">{recommendation}</p>
                </li>
              ))}
            </ol>
          )}
          {isSample && (
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground"><span>Preview only</span><ChevronRight className="size-3" /><span>Real findings require a connected research service</span></div>
          )}
        </div>
      )}

      {state === "success" && !report && (
        <div className="mt-7 border-y border-border py-8 text-sm text-muted-foreground">No report was returned. No findings have been added.</div>
      )}
    </section>
  );
}
