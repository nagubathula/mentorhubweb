const fs = require('fs');

function run() {
  const filepath = '/home/rustymachine/.gemini/antigravity/brain/0c081f5f-aa74-4634-9cd7-13e8d585209f/.system_generated/logs/overview.txt';
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const lines = fileContent.split('\n');
  console.log('Total lines read:', lines.length);
  
  // Line 24 is index 23 (0-indexed)
  const line = lines[23];
  if (line) {
    try {
      const parsed = JSON.parse(line);
      console.log('Successfully parsed line 24!');
      fs.writeFileSync('/home/rustymachine/Documents/GitHub/mentorhubweb/scratch/extracted_facts.md', parsed.content);
      console.log('Wrote parsed content to /home/rustymachine/Documents/GitHub/mentorhubweb/scratch/extracted_facts.md');
    } catch (e) {
      console.error('Failed to parse line 24 as JSON:', e.message);
      fs.writeFileSync('/home/rustymachine/Documents/GitHub/mentorhubweb/scratch/raw_line_24.txt', line);
    }
  } else {
    console.log('Line 24 is undefined');
  }
}

run();
