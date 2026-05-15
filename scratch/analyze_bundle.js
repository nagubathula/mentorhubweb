const fs = require('fs');
const path = require('path');

const bundlePath = '/home/rustymachine/Downloads/LearningPlace.apk_Decompiler.com/resources/assets/public/assets/index-TmZRJIKb.js';

if (!fs.existsSync(bundlePath)) {
  console.error("Bundle not found!");
  process.exit(1);
}

const content = fs.readFileSync(bundlePath, 'utf8');
console.log("Bundle loaded. Length:", content.length);

// 1. Find URLs
const urlRegex = /https?:\/\/[^\s"'`<>]+/g;
const urls = content.match(urlRegex) || [];
const uniqueUrls = [...new Set(urls)];
console.log("\n--- Unique URLs found in Bundle ---");
console.log(uniqueUrls.slice(0, 30));

// 2. Find typical API or base route patterns
const pathRegex = /"\/[a-zA-Z0-9_/-]+"/g;
const paths = content.match(pathRegex) || [];
const uniquePaths = [...new Set(paths)];
console.log("\n--- Unique Path Strings found in Bundle (sample) ---");
console.log(uniquePaths.filter(p => p.length > 3 && p.length < 50).slice(0, 50));

// 3. Search for specific keywords with surrounding context
const keywords = ['login', 'register', 'dashboard', 'course', 'enroll', 'student', 'mentor', 'learning', 'admin', 'auth', 'user', 'supabase', 'quiz', 'module', 'topic'];
console.log("\n--- Keyword Contexts ---");
keywords.forEach(keyword => {
  const regex = new RegExp(`.{0,80}${keyword}.{0,80}`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0].trim());
    if (matches.length >= 5) break; // Limit to 5 per keyword
  }
  console.log(`\nKeyword [${keyword}]: Found ${matches.length} matches`);
  matches.forEach((m, idx) => {
    console.log(`  ${idx + 1}: ... ${m} ...`);
  });
});
