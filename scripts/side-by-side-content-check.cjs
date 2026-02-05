const fs = require("fs");
const path = require("path");

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeLineCount(filePath) {
  const content = safeRead(filePath);
  if (content == null) return null;
  return content.split(/\r?\n/).length;
}

function countOccurrences(content, pattern) {
  if (!content) return 0;
  const re = typeof pattern === "string" ? new RegExp(pattern, "g") : pattern;
  const matches = content.match(re);
  return matches ? matches.length : 0;
}

console.log("=== CONTENT COMPARISON: Old vs New Routes (Node) ===\n");

// Home page sections (count occurrences of "Section" in the file)
const oldHomePath = path.join("src", "app", "page.tsx");
const newHomePath = path.join("src", "app", "[locale]", "page.tsx");
const oldHomeContent = safeRead(oldHomePath);
const newHomeContent = safeRead(newHomePath);

const oldHomeSections = oldHomeContent ? countOccurrences(oldHomeContent, "Section") : null;
const newHomeSections = newHomeContent ? countOccurrences(newHomeContent, "Section") : null;

console.log("📄 HOME PAGE:");
console.log(
  `  Sections: ${oldHomeSections ?? "N/A"} → ${newHomeSections ?? "N/A"}`
);
if (
  typeof oldHomeSections === "number" &&
  typeof newHomeSections === "number" &&
  newHomeSections >= oldHomeSections
) {
  console.log("  ✅ OK");
} else {
  console.log("  ⚠️ Check manually");
}

// About page line counts
console.log("\n📄 ABOUT PAGE:");
const oldAboutPath = path.join("src", "app", "about", "page.tsx");
const newAboutPath = path.join("src", "app", "[locale]", "about", "page.tsx");
if (fs.existsSync(oldAboutPath)) {
  const oldAboutLines = safeLineCount(oldAboutPath);
  const newAboutLines = safeLineCount(newAboutPath);
  console.log(`  Lines: ${oldAboutLines} → ${newAboutLines}`);
  if (typeof oldAboutLines === "number" && typeof newAboutLines === "number") {
    const diff = newAboutLines - oldAboutLines;
    const diffAbs = Math.abs(diff);
    if (diffAbs < 30) {
      console.log(`  ✅ OK (±${diff} lines)`);
    } else {
      console.log(`  ⚠️ Significant change: ${diff} lines`);
    }
  } else {
    console.log("  ⚠️ Could not read both about pages");
  }
} else {
  console.log(
    "  ℹ️ No old about page found (may have been driven purely by content.json)"
  );
}

// FAQ questions count: old from src/content/content.json, new from messages/ar.json
console.log("\n📄 FAQ PAGE:");
console.log("  Checking question count...");

let oldFaqQ = null;
try {
  const oldContent = require("../src/content/content.json");
  if (oldContent.faq && Array.isArray(oldContent.faq.categories)) {
    oldFaqQ = oldContent.faq.categories.reduce((sum, cat) => {
      if (Array.isArray(cat.questions)) return sum + cat.questions.length;
      return sum;
    }, 0);
  }
} catch {
  oldFaqQ = null;
}

let newFaqQ = null;
try {
  const newMessages = require("../messages/ar.json");
  if (newMessages.faq && Array.isArray(newMessages.faq.categories)) {
    newFaqQ = newMessages.faq.categories.reduce((sum, cat) => {
      if (Array.isArray(cat.questions)) return sum + cat.questions.length;
      return sum;
    }, 0);
  }
} catch {
  newFaqQ = null;
}

console.log(`  Questions: ${oldFaqQ ?? "N/A"} → ${newFaqQ ?? "N/A"}`);
if (
  typeof oldFaqQ === "number" &&
  typeof newFaqQ === "number" &&
  newFaqQ >= oldFaqQ
) {
  console.log("  ✅ OK");
} else {
  console.log("  ⚠️ Check manually");
}

// Quiz steps line counts
console.log("\n📄 QUIZ PAGES:");
["step1-favorites", "step2-disliked", "step3-allergy"].forEach((step) => {
  const oldStepPath = path.join("src", "app", "quiz", step, "page.tsx");
  const newStepPath = path.join(
    "src",
    "app",
    "[locale]",
    "quiz",
    step,
    "page.tsx"
  );
  if (fs.existsSync(oldStepPath)) {
    const oldLines = safeLineCount(oldStepPath);
    const newLines = safeLineCount(newStepPath);
    console.log(`  ${step}: ${oldLines} → ${newLines} lines`);
  }
});

// Auth pages line counts
console.log("\n📄 AUTH PAGES:");
["login", "register"].forEach((pageName) => {
  const oldAuthPath = path.join("src", "app", pageName, "page.tsx");
  const newAuthPath = path.join("src", "app", "[locale]", pageName, "page.tsx");
  if (fs.existsSync(oldAuthPath)) {
    const oldLines = safeLineCount(oldAuthPath);
    const newLines = safeLineCount(newAuthPath);
    const diff = typeof oldLines === "number" && typeof newLines === "number"
      ? newLines - oldLines
      : "N/A";
    console.log(`  ${pageName}: ${oldLines} → ${newLines} (diff: ${diff})`);
  }
});

// Animation usage counts via simple string search
console.log("\n=== COMPONENT PRESERVATION CHECK ===");
console.log("Home page components:");
if (oldHomeContent) {
  const importLinesOld = oldHomeContent
    .split(/\r?\n/)
    .filter((l) => l.startsWith("import") && l.includes("@/components"))
    .slice(0, 5);
  console.log("  Old imports:");
  if (importLinesOld.length === 0) {
    console.log("    (none)");
  } else {
    importLinesOld.forEach((l) => console.log("    " + l.trim()));
  }
}
if (newHomeContent) {
  const importLinesNew = newHomeContent
    .split(/\r?\n/)
    .filter((l) => l.startsWith("import") && l.includes("@/components"))
    .slice(0, 5);
  console.log("  New imports:");
  if (importLinesNew.length === 0) {
    console.log("    (none)");
  } else {
    importLinesNew.forEach((l) => console.log("    " + l.trim()));
  }
}

function countMotionUsage(dir) {
  let count = 0;
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && full.endsWith("page.tsx")) {
        const c = safeRead(full);
        if (c && (c.includes("MotionDiv") || c.includes("motion."))) {
          count++;
        }
      }
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return count;
}

const oldMotion = countMotionUsage(path.join("src", "app"));
const newMotion = countMotionUsage(path.join("src", "app", "[locale]"));
console.log("\nAnimation components (MotionDiv, motion.):");
console.log(`  Old pages with motion: ${oldMotion}`);
console.log(`  New pages with motion: ${newMotion}`);

console.log("\n=== END OF CONTENT COMPARISON (Node) ===");

