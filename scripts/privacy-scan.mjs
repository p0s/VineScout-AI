import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const maxFindings = 20;

const contentChecks = [
  {
    label: "absolute local path",
    pattern: /\/Users\/[^'"\s)]+|\/home\/[^'"\s)]+|C:\\Users\\[^'"\s)]+/i
  },
  {
    label: "secret-looking value",
    pattern:
      /\b(?:sk-[A-Za-z0-9_-]{20,}|(?:API_KEY|AUTH_TOKEN|ADMIN_TOKEN|ACCESS_TOKEN|SECRET|SERVICE_ROLE_KEY)\s*=\s*['"]?[^'"\s#]+['"]?)/i
  }
];

const pathChecks = [
  {
    label: "private document path",
    pattern: /(^|\/)[A-Z0-9_-]*(?:PITCH|OUTLINE|SCRIPT|PROMPT|PRIVATE|SECRET)[A-Z0-9_-]*\.md$/i
  },
  {
    label: "private credential path",
    pattern: /(^|\/)(?:\.env(?!\.example$)|.*\.(?:pem|key|p8|p12|keystore|jks|sqlite|sqlite3|db))$/i
  }
];

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function isText(buffer) {
  return !buffer.includes(0);
}

function listTrackedFiles() {
  return git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
    .split("\0")
    .filter(Boolean);
}

function listCommits() {
  return git(["rev-list", "--all"])
    .trim()
    .split("\n")
    .filter(Boolean);
}

function scanCurrentTree(findings) {
  for (const file of listTrackedFiles()) {
    for (const check of pathChecks) {
      if (check.pattern.test(file)) {
        findings.push({ scope: "tree", label: check.label, file });
      }
    }

    let buffer;
    try {
      buffer = readFileSync(file);
    } catch {
      continue;
    }
    if (!isText(buffer)) continue;

    const content = buffer.toString("utf8");
    for (const check of contentChecks) {
      if (check.pattern.test(content)) {
        findings.push({ scope: "tree", label: check.label, file });
      }
    }
  }
}

function scanReachableHistory(findings) {
  for (const commit of listCommits()) {
    const files = git(["ls-tree", "-r", "--name-only", commit])
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const file of files) {
      for (const check of pathChecks) {
        if (check.pattern.test(file)) {
          findings.push({ scope: "history", label: check.label, commit: commit.slice(0, 12), file });
        }
      }
    }

    for (const file of files) {
      let buffer;
      try {
        buffer = execFileSync("git", ["show", `${commit}:${file}`], {
          maxBuffer: 20 * 1024 * 1024,
          stdio: ["ignore", "pipe", "ignore"]
        });
      } catch {
        continue;
      }
      if (!isText(buffer)) continue;

      const content = buffer.toString("utf8");
      for (const check of contentChecks) {
        if (check.pattern.test(content)) {
          findings.push({ scope: "history", label: check.label, commit: commit.slice(0, 12), file });
        }
      }
    }
  }
}

const findings = [];
scanCurrentTree(findings);
scanReachableHistory(findings);

if (findings.length > 0) {
  console.error(`Privacy scan failed with ${findings.length} finding(s). Showing up to ${maxFindings}:`);
  for (const finding of findings.slice(0, maxFindings)) {
    const commit = finding.commit ? ` ${finding.commit}` : "";
    console.error(`- [${finding.scope}${commit}] ${finding.label}: ${finding.file}`);
  }
  process.exit(1);
}

console.log("Privacy scan passed.");
