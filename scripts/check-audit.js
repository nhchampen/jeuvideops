const fs = require("fs");
const path = require("path");

// Read the npm audit JSON output
const reportPath = path.join(process.cwd(), "audit-report.json");
if (!fs.existsSync(reportPath)) {
  console.error("No audit report found. Run npm audit --json first.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

// Severity levels (lower number = less severe)
const severityOrder = ["info", "low", "moderate", "high", "critical"];
const severityScore = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

// Configurable threshold — can be set via environment variable
// Default: fail only on 'high' or 'critical'
const threshold = process.env.FAIL_ON_SEVERITY || "high";

// Find the highest severity in the report
let highestSeverity = "info";
let totalVulns = 0;

if (report.vulnerabilities) {
  for (const [pkg, vuln] of Object.entries(report.vulnerabilities)) {
    totalVulns += vuln.severity !== "info" ? 1 : 0;
    if (severityScore[vuln.severity] > severityScore[highestSeverity]) {
      highestSeverity = vuln.severity;
    }
  }
}

// Also check the metadata summary if available
if (report.metadata && report.metadata.vulnerabilities) {
  const summary = report.metadata.vulnerabilities;
  const sevList = ["info", "low", "moderate", "high", "critical"];
  for (const sev of sevList) {
    if (
      summary[sev] > 0 &&
      severityScore[sev] > severityScore[highestSeverity]
    ) {
      highestSeverity = sev;
    }
  }
}

console.log(`Audit summary:`);
console.log(`Total vulnerabilities found: ${totalVulns}`);
console.log(`Highest severity: ${highestSeverity}`);
console.log(`Fail threshold: ${threshold}`);

// Decide if build should fail
if (severityScore[highestSeverity] >= severityScore[threshold]) {
  console.error(`BUILD FAILED: Found ${highestSeverity} severity vulnerabilities (threshold = ${threshold})`);
  console.error(`   Fix with: npm audit fix`);
  process.exit(1);
} else if (totalVulns > 0) {
  console.warn(`WARNING: Vulnerabilities found but below threshold (${threshold})`);
  console.warn(`   Consider running: npm audit fix`);
  process.exit(0);
} else {
  console.log(`No vulnerabilities found!`);
  process.exit(0);
}
