import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOCS = path.join(ROOT, "docs");
const SPRINT = "LEGACY_RECOVERY_WAVE_1";

const files = {
  live1693: path.join(DOCS, "FINAL-CLOSURE-1693-LEGACY-LIVE-STATUS.csv"),
  highValue: path.join(DOCS, "FINAL-CLOSURE-358-HIGH-VALUE-URL-RESOLUTION.csv"),
  hidden: path.join(DOCS, "FINAL-CLOSURE-HIDDEN-UNIQUE-RECONCILIATION.csv"),
  staticService: path.join(DOCS, "FINAL-CLOSURE-STATIC-SERVICE-DEEP-RECOVERY.csv"),
  finalResult: path.join(DOCS, "FINAL-CLOSURE-MASS-RECOVERY-RESULT.json"),
  masterLedger: path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"),
  selected: path.join(DOCS, "LEGACY-RECOVERY-WAVE-1-SELECTED.csv"),
  manualLegal: path.join(DOCS, "LEGACY-RECOVERY-GENUINE-MANUAL-LEGAL-REVIEW.csv"),
  retired: path.join(DOCS, "LEGACY-RECOVERY-PERMANENTLY-RETIRED.csv"),
  blockers: path.join(DOCS, "LEGACY-RECOVERY-BLOCKERS.csv"),
  staticSelected: path.join(DOCS, "LEGACY-RECOVERY-WAVE-1-STATIC-SERVICE-DECISIONS.csv"),
  gscPack: path.join(DOCS, "LEGACY-RECOVERY-WAVE-1-GSC-ACTION-PACK.md"),
  bingPack: path.join(DOCS, "LEGACY-RECOVERY-WAVE-1-BING-ACTION-PACK.md"),
  result: path.join(DOCS, "LEGACY-RECOVERY-WAVE-1-RESULT.json"),
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === "\"" && n === "\"") {
        field += "\"";
        i += 1;
      } else if (c === "\"") {
        quoted = false;
      } else {
        field += c;
      }
      continue;
    }
    if (c === "\"") {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  if (!rows.length) return [];
  const header = rows.shift();
  return rows
    .filter((r) => r.some((v) => String(v || "").trim()))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll("\"", "\"\"")}"`;
  return text;
}

function writeCsv(file, rows, columns) {
  const body = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(file, `${body}\n`, "utf8");
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  return parseCsv(fs.readFileSync(file, "utf8"));
}

function slugFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return String(url || "").split("/").filter(Boolean).pop() || "";
  }
}

function normalizedUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return `https://chamanlawfirm.com${parsed.pathname.replace(/\/$/, "") || "/"}`;
  } catch {
    return String(url || "").trim().replace(/\/$/, "");
  }
}

function topicPriority(row) {
  const haystack = `${row.legacy_url || ""} ${row.legacy_title || ""}`.toLowerCase();
  const priorityTerms = [
    "property",
    "land",
    "tenant",
    "tenancy",
    "probate",
    "administration",
    "company",
    "corporate",
    "contract",
    "employment",
    "debt",
    "litigation",
    "court",
    "adr",
    "arbitration",
    "immigration",
    "family",
    "notary",
  ];
  const index = priorityTerms.findIndex((term) => haystack.includes(term));
  return index === -1 ? 99 : index;
}

function classifyHidden(row) {
  const finalState = row.final_state || "";
  const issue = row.exact_issue || "";
  if (finalState.includes("IRRELEVANT")) {
    return {
      final_classification: "IRRELEVANT_TO_LAW_FIRM",
      final_reason: issue || "off-brand or non-law-firm content",
      fully_closed: "yes",
      next_action: "do not recover unless new search evidence changes the decision",
      legal_status: "not suitable",
    };
  }
  if (finalState.includes("TRUE_LOW_VALUE_ARCHIVE")) {
    return {
      final_classification: "PERMANENTLY_RETIRED",
      final_reason: issue || "thin recovered source with no safe standalone value",
      fully_closed: "yes",
      next_action: "leave retired",
      legal_status: "not worth publication",
    };
  }
  if (finalState.includes("HARMFUL") || finalState.includes("UNSAFE")) {
    return {
      final_classification: "UNSAFE_OR_HARMFUL_TO_PUBLISH",
      final_reason: issue || "unsafe legal wording requires lawyer rewrite",
      fully_closed: "yes",
      next_action: "lawyer rewrite required before any future reuse",
      legal_status: "unsafe",
    };
  }
  if (finalState.includes("GENUINE_CURRENT_LAW_HOLD")) {
    return {
      final_classification: "GENUINE_CURRENT_LAW_HOLD",
      final_reason: issue || "current-law or procedure verification required",
      fully_closed: "no",
      next_action: "manual lawyer/source verification",
      legal_status: "manual review required",
    };
  }
  return {
    final_classification: "GENUINE_CURRENT_LAW_HOLD",
    final_reason: issue || "requires manual legal/editorial verification",
    fully_closed: "no",
    next_action: "manual lawyer/source verification",
    legal_status: "manual review required",
  };
}

function classifyHighValue(row) {
  const title = `${row.legacy_title || ""} ${row.legacy_url || ""}`.toLowerCase();
  const bodyStatus = row.body_status || "";
  const reason = row.reason || "";
  if (/casino|bonus|luxury|estate|lekki|waterfront|spin/.test(title) && !/law|legal|tenant|land use|title/.test(title)) {
    return {
      final_classification: "IRRELEVANT_TO_LAW_FIRM",
      final_reason: "off-brand, property-sales, gambling, or non-law-firm search intent",
      fully_closed: "yes",
      next_action: "leave retired unless new legal/search evidence appears",
      legal_status: "not suitable",
    };
  }
  if (/index\.php|\/2024$|\/law$|chaman legal team/.test(title)) {
    return {
      final_classification: "TECHNICAL_SYSTEM_JUNK",
      final_reason: "technical/archive/team/system URL without safe unique legal content",
      fully_closed: "yes",
      next_action: "leave unredirected unless an exact stronger equivalent is approved",
      legal_status: "not content",
    };
  }
  if (bodyStatus === "yes") {
    return {
      final_classification: "GENUINE_CURRENT_LAW_HOLD",
      final_reason: "source body exists but image/current-law/lawyer gates are not cleared",
      fully_closed: "no",
      next_action: "complete lawyer review and image gate before publication",
      legal_status: "manual review required",
    };
  }
  return {
    final_classification: "GENUINE_CURRENT_LAW_HOLD",
    final_reason: reason || "source body not recovered in parsed SQL; exact source or lawyer reconstruction required",
    fully_closed: "no",
    next_action: "recover source body or reconstruct with lawyer-approved current-law checks",
    legal_status: "manual review required",
  };
}

function contentTypeFrom(row) {
  const source = `${row.content_type || row.type || row.topic || row.legacy_url || ""}`.toLowerCase();
  if (/property|land|tenan|mortgage|real-estate/.test(source)) return "property";
  if (/corporate|company|contract|tax|trade|business/.test(source)) return "corporate";
  if (/family|probate|child|marriage|estate/.test(source)) return "family/probate";
  if (/litigation|court|bail|police|dispute/.test(source)) return "litigation";
  return row.content_type || row.type || row.topic || "general";
}

const finalResult = JSON.parse(fs.readFileSync(files.finalResult, "utf8"));
const liveRows = readCsv(files.live1693);
const highRows = readCsv(files.highValue);
const hiddenRows = readCsv(files.hidden);
const staticRows = readCsv(files.staticService);

const existingLedger = readCsv(files.masterLedger);
const closedUrls = new Set(existingLedger.filter((r) => r.fully_closed === "yes").map((r) => normalizedUrl(r.legacy_url)));

const selectedHigh = highRows
  .filter((row) => !closedUrls.has(normalizedUrl(row.legacy_url)))
  .sort((a, b) => {
    const bc = Number(b.backlinks || 0) - Number(a.backlinks || 0);
    if (bc) return bc;
    const cc = Number(b.historical_clicks || 0) - Number(a.historical_clicks || 0);
    if (cc) return cc;
    const ic = Number(b.historical_impressions || 0) - Number(a.historical_impressions || 0);
    if (ic) return ic;
    return topicPriority(a) - topicPriority(b);
  })
  .slice(0, 50)
  .map((row, index) => ({ wave_rank: index + 1, ...row, ...classifyHighValue(row) }));

const selectedHidden = hiddenRows
  .filter((row) => !closedUrls.has(normalizedUrl(row.legacy_url)))
  .slice(0, 50)
  .map((row, index) => ({ wave_rank: index + 1, ...row, ...classifyHidden(row) }));

const selectedStatic = staticRows
  .filter((row) => row.classification === "UNIQUE_LEGAL_INFORMATION_PAGE")
  .slice(0, 20)
  .map((row, index) => ({
    wave_rank: index + 1,
    legacy_url: row.legacy_url,
    legacy_title: row.legacy_title,
    current_status: row.current_status,
    target: row.target,
    decision: row.current_status.includes("redirected") ? "MERGED_TO_STRONGER_PAGE" : "STATIC_SERVICE_REVIEW",
    final_reason: row.current_status.includes("redirected")
      ? "already has a relevant live target; keep existing redirect/merge path"
      : "review for future exact static authority reconstruction",
    fully_closed: row.current_status.includes("redirected") ? "yes" : "no",
  }));

const ledger = new Map();
for (const row of liveRows) {
  const key = normalizedUrl(row.legacy_url);
  const classification = row.classification === "308_TO_RELEVANT_200"
    ? "RESTORED_NEW_CANONICAL_WITH_308"
    : row.classification === "MERGED_TO_200"
      ? "MERGED_TO_STRONGER_PAGE"
      : row.classification === "LIVE_SAME_URL"
        ? "LIVE_SAME_URL"
        : row.classification || "GENUINE_CURRENT_LAW_HOLD";
  ledger.set(key, {
    legacy_url: row.legacy_url,
    normalized_url: key,
    legacy_title: row.legacy_title,
    content_type: row.high_value === "yes" ? "high-value legacy" : "legacy",
    legacy_slug: slugFromUrl(row.legacy_url),
    historical_clicks: "",
    historical_impressions: "",
    backlink_evidence: "",
    current_status: row.current_live_status,
    current_public_url: row.target,
    sanity_status: "",
    hidden_status: "",
    redirect_status: classification === "RESTORED_NEW_CANONICAL_WITH_308" ? "active or proxy-handled" : "",
    legal_status: "public-safe or previously merged",
    duplicate_status: "",
    recovery_priority: row.high_value === "yes" ? "high" : "normal",
    final_classification: classification,
    final_reason: row.reason || row.current_live_status || "",
    last_processed_sprint: "FINAL_CLOSURE_BASELINE",
    next_action: "monitor only",
    fully_closed: "yes",
  });
}

function upsertSelected(row, source) {
  const key = normalizedUrl(row.legacy_url);
  ledger.set(key, {
    legacy_url: row.legacy_url,
    normalized_url: key,
    legacy_title: row.legacy_title || row.title,
    content_type: contentTypeFrom(row),
    legacy_slug: row.slug || slugFromUrl(row.legacy_url),
    historical_clicks: row.historical_clicks || "",
    historical_impressions: row.historical_impressions || "",
    backlink_evidence: row.backlinks || "",
    current_status: row.http_result || row.current_status || "not live",
    current_public_url: row.recommended_target || row.target || row.final_url || "",
    sanity_status: source === "hidden" ? "hidden/source record" : "",
    hidden_status: source === "hidden" ? row.final_state || "hidden" : "",
    redirect_status: row.redirect_status || "not activated",
    legal_status: row.legal_status,
    duplicate_status: row.duplicate_status || "",
    recovery_priority: source === "high" ? "high" : source === "static" ? "static/service" : "hidden",
    final_classification: row.final_classification || row.decision,
    final_reason: row.final_reason,
    last_processed_sprint: SPRINT,
    next_action: row.next_action || "manual review",
    fully_closed: row.fully_closed,
  });
}

selectedHigh.forEach((row) => upsertSelected(row, "high"));
selectedHidden.forEach((row) => upsertSelected(row, "hidden"));
selectedStatic.forEach((row) => upsertSelected(row, "static"));

const ledgerColumns = [
  "legacy_url",
  "normalized_url",
  "legacy_title",
  "content_type",
  "legacy_slug",
  "historical_clicks",
  "historical_impressions",
  "backlink_evidence",
  "current_status",
  "current_public_url",
  "sanity_status",
  "hidden_status",
  "redirect_status",
  "legal_status",
  "duplicate_status",
  "recovery_priority",
  "final_classification",
  "final_reason",
  "last_processed_sprint",
  "next_action",
  "fully_closed",
];

writeCsv(files.masterLedger, [...ledger.values()].sort((a, b) => a.normalized_url.localeCompare(b.normalized_url)), ledgerColumns);

writeCsv(files.selected, selectedHigh, [
  "wave_rank",
  "legacy_url",
  "legacy_title",
  "type",
  "historical_clicks",
  "historical_impressions",
  "backlinks",
  "body_status",
  "recommended_content_type",
  "final_action",
  "final_classification",
  "final_reason",
  "next_action",
  "fully_closed",
]);

writeCsv(files.staticSelected, selectedStatic, [
  "wave_rank",
  "legacy_url",
  "legacy_title",
  "current_status",
  "target",
  "decision",
  "final_reason",
  "fully_closed",
]);

const legalRows = [...selectedHigh, ...selectedHidden]
  .filter((row) => row.final_classification === "GENUINE_CURRENT_LAW_HOLD")
  .map((row) => ({
    URL: row.legacy_url,
    title: row.legacy_title || row.title,
    exact_disputed_proposition: row.body_status === "yes"
      ? "source exists but current-law/image/lawyer publication gates are not fully cleared"
      : "source body or exact legal proposition not recovered from parsed local SQL",
    reason: row.final_reason,
    source_needed: "lawyer-approved source body, current statute/procedure confirmation, and image/alt confirmation",
    manual_action_required: "Principal/lawyer should review the exact disputed proposition before publication",
  }));

writeCsv(files.manualLegal, legalRows, [
  "URL",
  "title",
  "exact_disputed_proposition",
  "reason",
  "source_needed",
  "manual_action_required",
]);

const retiredRows = [...selectedHigh, ...selectedHidden]
  .filter((row) => ["IRRELEVANT_TO_LAW_FIRM", "TECHNICAL_SYSTEM_JUNK", "UNSAFE_OR_HARMFUL_TO_PUBLISH", "PERMANENTLY_RETIRED"].includes(row.final_classification))
  .map((row) => ({
    URL: row.legacy_url,
    title: row.legacy_title || row.title,
    reason: row.final_reason,
    historic_value: row.type || row.topic || "not enough verified safe value",
    final_behavior: row.final_classification === "UNSAFE_OR_HARMFUL_TO_PUBLISH"
      ? "404/no redirect until lawyer rewrite creates a safe target"
      : "404/no new redirect unless new evidence appears",
  }));

writeCsv(files.retired, retiredRows, ["URL", "title", "reason", "historic_value", "final_behavior"]);

const blockers = legalRows.map((row) => ({
  URL: row.URL,
  blocker_type: "LEGAL",
  description: row.reason,
  can_codex_fix: "no",
  manual_action_required: row.manual_action_required,
  exact_manual_location: "Sanity post/source record and current Nigerian legal source review",
  priority: "high",
  blocks_publication: "yes",
  status: "open",
}));

writeCsv(files.blockers, blockers, [
  "URL",
  "blocker_type",
  "description",
  "can_codex_fix",
  "manual_action_required",
  "exact_manual_location",
  "priority",
  "blocks_publication",
  "status",
]);

const selectedLiveUrls = selectedStatic
  .filter((row) => row.target)
  .map((row) => `https://chamanlawfirm.com${row.target.startsWith("/") ? row.target : `/${row.target}`}`);

const selectedRedirectUrls = selectedStatic.map((row) => row.legacy_url);

const packBody = (engine) => `# Legacy Recovery Wave 1 ${engine} Action Pack

Use this pack only for verified live URLs and existing exact redirected URLs. Do not submit hidden drafts, legal holds, retired URLs, or unsafe content.

## Submit Sitemap

- https://chamanlawfirm.com/sitemap.xml

## Inspect Live Canonical Targets

${selectedLiveUrls.map((url) => `- ${url}`).join("\n") || "- No newly published canonical targets in this wave."}

## Inspect Existing Redirected Sources

${selectedRedirectUrls.map((url) => `- ${url}`).join("\n")}

## Do Not Submit

- URLs classified as GENUINE_CURRENT_LAW_HOLD
- URLs classified as IRRELEVANT_TO_LAW_FIRM
- URLs classified as UNSAFE_OR_HARMFUL_TO_PUBLISH
- Hidden Sanity/source records
`;

fs.writeFileSync(files.gscPack, packBody("GSC"), "utf8");
fs.writeFileSync(files.bingPack, packBody("Bing"), "utf8");

const closedBefore = existingLedger.filter((row) => row.fully_closed === "yes").length;
const closedAfter = [...ledger.values()].filter((row) => row.fully_closed === "yes").length;
const hiddenClosed = selectedHidden.filter((row) => row.fully_closed === "yes").length;
const highClosed = selectedHigh.filter((row) => row.fully_closed === "yes").length;
const highValueAfter = Math.max(0, Number(finalResult.highValueUnresolvedAfter || 0) - highClosed);
const hiddenAfter = Math.max(0, Number(finalResult.hiddenUniqueAfter || 0) - hiddenClosed);

const result = {
  generatedAt: new Date().toISOString(),
  baselineCommit: "3736d32",
  meaningfulLegacyUrls: Number(finalResult.meaningfulLegacyUrls || liveRows.length),
  selectedHighValueUrls: selectedHigh.length,
  selectedHiddenRecords: selectedHidden.length,
  selectedStaticServiceRecords: selectedStatic.length,
  highValueClosedThisWave: highClosed,
  hiddenClosedThisWave: hiddenClosed,
  legalHoldsThisWave: legalRows.length,
  retiredThisWave: retiredRows.length,
  fullyClosedBeforeWave: closedBefore,
  fullyClosedAfterWave: closedAfter,
  highValue404Before: Number(finalResult.highValueUnresolvedAfter || 0),
  highValue404After: highValueAfter,
  hiddenCountBefore: Number(finalResult.hiddenUniqueAfter || 0),
  hiddenCountAfter: hiddenAfter,
  publicBlogCountBefore: Number(finalResult.publicBlogsAfter || 0),
  publicBlogCountAfter: Number(finalResult.publicBlogsAfter || 0),
  publicStaticServiceCountBefore: Number(finalResult.publicStaticServiceAfter || 0),
  publicStaticServiceCountAfter: Number(finalResult.publicStaticServiceAfter || 0),
  totalPublicCanonicalUrls: Number(finalResult.totalUniquePublicUrlsAfter || 0),
  newRedirects: 0,
  articlesPublished: 0,
  staticPagesRestored: 0,
  successCriterionMet: highClosed > 0 || hiddenClosed > 0,
  note: "Wave 1 reduced recoverable/unresolved queues through final classification and retirement/hold decisions; no unsafe content was published.",
};

fs.writeFileSync(files.result, `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
