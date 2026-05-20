const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vhrmcfwlkjgepdcyhmnw.supabase.co',
  'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe'
);

const KBC_QUESTIONS = [
  { id: "k1", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Mode Language"], correctIndex: 0, difficulty: "easy" },
  { id: "k2", question: "Which symbol is used for comments in Python?", options: ["//", "/*", "#", "--"], correctIndex: 2, difficulty: "easy" },
  { id: "k3", question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Utility"], correctIndex: 1, difficulty: "easy" },
  { id: "k4", question: "Which language is used to style web pages?", options: ["HTML", "Python", "CSS", "Java"], correctIndex: 2, difficulty: "easy" },
  { id: "k5", question: "What is the output of print(2 + 3)?", options: ["23", "5", "2+3", "Error"], correctIndex: 1, difficulty: "easy" },
  { id: "k6", question: "Which company created JavaScript?", options: ["Microsoft", "Google", "Netscape", "Apple"], correctIndex: 2, difficulty: "easy" },
  { id: "k7", question: "What does URL stand for?", options: ["Universal Resource Locator", "Uniform Resource Locator", "Unified Resource Link", "Universal Reference Link"], correctIndex: 1, difficulty: "easy" },
  { id: "k8", question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctIndex: 2, difficulty: "medium" },
  { id: "k9", question: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1, difficulty: "medium" },
  { id: "k10", question: "What does API stand for?", options: ["Application Programming Interface", "Applied Program Integration", "Automatic Program Interaction", "Application Process Interface"], correctIndex: 0, difficulty: "medium" },
  { id: "k11", question: "In Python, what does 'self' refer to?", options: ["The class", "The module", "The current instance", "A global variable"], correctIndex: 2, difficulty: "medium" },
  { id: "k12", question: "Which protocol is used for secure web browsing?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correctIndex: 2, difficulty: "medium" },
  { id: "k13", question: "What is a 'foreign key' in databases?", options: ["Primary identifier", "Link to another table", "Encrypted key", "Index column"], correctIndex: 1, difficulty: "medium" },
  { id: "k14", question: "What does DNS resolve?", options: ["IP to MAC", "Domain to IP", "URL to FTP", "Port to IP"], correctIndex: 1, difficulty: "medium" },
  { id: "k15", question: "Which sorting algorithm has worst-case O(n log n)?", options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"], correctIndex: 2, difficulty: "medium" }
];

async function seed() {
  const { error } = await supabase
    .from('games_quizzes')
    .update({ 
      questions: KBC_QUESTIONS,
      is_active: true
    })
    .eq('id', '83ea8eb6-d17b-483d-8438-56ee46737b09');

  if (error) {
    console.error('Error seeding:', error);
  } else {
    console.log('Seeded KBC questions successfully!');
  }
}

seed();
