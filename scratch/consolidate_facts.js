const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, 'seed_facts.js');
const ADMIN_FILE = path.join(__dirname, '../components/admin/AdminPanel.tsx');

// Additional facts pool to ensure we reach exactly 150 unique facts
const extraFactsPool = [
  { content: "The world's quietest room is -20.3 dBA, so quiet you can hear your own heartbeat and bones grinding.", category: "world", emoji: "🤫" },
  { content: "Glaciers and ice sheets hold about **69 percent** of the world's freshwater.", category: "world", emoji: "🏔️" },
  { content: "The oceans hold about 96.5 percent of all Earth's water, covering 71 percent of the surface.", category: "world", emoji: "🌊" },
  { content: "A day on Earth was only 18 hours long about **1.4 billion years ago**.", category: "world", emoji: "🕰️" },
  { content: "There are more trees on Earth than stars in the Milky Way galaxy.", category: "space", emoji: "🌲" },
  { content: "The Sun makes up **99.86 percent** of the total mass of the entire Solar System.", category: "space", emoji: "☀️" },
  { content: "One day on Mercury lasts approximately **59 Earth days**.", category: "space", emoji: "🪐" },
  { content: "The footprints on the moon will not disappear because there is no wind or water to erode them.", category: "space", emoji: "👣" },
  { content: "A newborn panda is smaller than a mouse, weighing only about 100 grams.", category: "animal", emoji: "🐼" },
  { content: "Otters have a pocket in their skin to store their favorite rock for cracking open shellfish.", category: "animal", emoji: "🦦" },
  { content: "Squirrels plant thousands of new trees each year simply by forgetting where they buried their acorns.", category: "animal", emoji: "🐿️" },
  { content: "Dragonflies have a **95 percent success rate** when hunting, making them the most effective predators.", category: "animal", emoji: "🛸" },
  { content: "The Chenab Bridge in Jammu and Kashmir is the world's highest rail bridge, taller than the Eiffel Tower.", category: "india", emoji: "🌉" },
  { content: "The average person walks the equivalent of **five times around the world** in their lifetime.", category: "human", emoji: "🚶" },
  { content: "An individual blood cell takes about **60 seconds** to make a complete circuit of the body.", category: "human", emoji: "🩸" },
  { content: "Your brain is more active when you are sleeping than when you are watching television.", category: "human", emoji: "🧠" },
  { content: "The first domain name ever registered was Symbolics.com on March 15, 1985.", category: "tech", emoji: "🌐" },
  { content: "The first computer game was created in 1961 and was called Spacewar!.", category: "tech", emoji: "🎮" },
  { content: "C++ was designed by Bjarne Stroustrup at Bell Labs as an extension of the C language.", category: "tech", emoji: "💻" },
  { content: "Failure is simply the opportunity to begin again, this time more intelligently.", category: "motivation", emoji: "🌱" },
  { content: "The only way to do great work is to love what you do.", category: "motivation", emoji: "❤️" }
];

function run() {
  console.log('Reading seed facts...');
  const seedContent = fs.readFileSync(SEED_FILE, 'utf8');
  const seedMatch = seedContent.match(/const facts = (\[[\s\S]*?\]);/);
  if (!seedMatch) {
    console.error('Could not parse facts array from seed_facts.js');
    process.exit(1);
  }
  const seedFacts = eval(seedMatch[1]);

  console.log('Reading admin panel fallback facts...');
  const adminContent = fs.readFileSync(ADMIN_FILE, 'utf8');
  const adminMatch = adminContent.match(/const staticFallbackFacts = (\[[\s\S]*?\]);/);
  if (!adminMatch) {
    console.error('Could not parse staticFallbackFacts from AdminPanel.tsx');
    process.exit(1);
  }
  const adminFacts = eval(adminMatch[1]);

  // Combine and deduplicate
  const seenContent = new Set();
  const mergedFacts = [];

  function addFact(fact) {
    // Normalize content to prevent duplicate texts
    const normalized = fact.content.toLowerCase().replace(/[^\w]/g, "");
    if (!seenContent.has(normalized)) {
      seenContent.add(normalized);
      mergedFacts.push({
        content: fact.content,
        category: fact.category || 'general',
        emoji: fact.emoji || '💡'
      });
      return true;
    }
    return false;
  }

  // Add seed facts first
  seedFacts.forEach(addFact);
  // Add admin fallback facts
  adminFacts.forEach(addFact);

  console.log(`Unique facts before pool: ${mergedFacts.length}`);

  // Fill from pool if needed
  let poolIndex = 0;
  while (mergedFacts.length < 150 && poolIndex < extraFactsPool.length) {
    addFact(extraFactsPool[poolIndex]);
    poolIndex++;
  }

  console.log(`Unique facts after pool filling: ${mergedFacts.length}`);

  // Ensure exactly 150 facts
  if (mergedFacts.length > 150) {
    mergedFacts.splice(150);
  }

  console.log(`Final target unique facts: ${mergedFacts.length}`);

  // 1. Rewrite seed_facts.js
  const updatedSeedFactsString = 'const facts = ' + JSON.stringify(mergedFacts, null, 2) + ';';
  const newSeedContent = seedContent.replace(/const facts = \[[\s\S]*?\];/, updatedSeedFactsString);
  fs.writeFileSync(SEED_FILE, newSeedContent, 'utf8');
  console.log('Successfully updated seed_facts.js!');

  // 2. Rewrite AdminPanel.tsx staticFallbackFacts
  const adminFallbackFacts = mergedFacts.map((f, i) => ({
    id: `f${i + 1}`,
    content: f.content,
    category: f.category,
    emoji: f.emoji,
    is_published: true,
    is_active_today: false
  }));
  const updatedAdminFactsString = 'const staticFallbackFacts = ' + JSON.stringify(adminFallbackFacts, null, 2) + ';';
  const newAdminContent = adminContent.replace(/const staticFallbackFacts = \[[\s\S]*?\];/, updatedAdminFactsString);
  fs.writeFileSync(ADMIN_FILE, newAdminContent, 'utf8');
  console.log('Successfully updated AdminPanel.tsx!');
}

run();
