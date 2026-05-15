const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

async function seed() {
  // Clear existing games
  const { error: deleteError } = await supabase.from('games_quizzes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error("Error clearing old games:", deleteError);
  } else {
    console.log("Successfully cleared previous games.");
  }

  const games = [
    {
      title: 'Snake & Ladder: Quiz Challenge',
      description: 'Climb ladders and avoid snakes by answering Python and General Programming questions correctly. Play against Vikram S.!',
      type: 'Game',
      is_active: true,
      questions: [
        { q: "Which operator is used for exponentiation in Python?", options: ["^", "**", "e", "pow"], answer: "**" },
        { q: "Which programming language is predominantly used for native Android App development?", options: ["Kotlin", "Swift", "C#", "PHP"], answer: "Kotlin" },
        { q: "What is the output of 2 + '2' in JavaScript?", options: ["4", "22", "NaN", "TypeError"], answer: "22" },
        { q: "Which SQL clause is used to filter group results?", options: ["WHERE", "HAVING", "LIMIT", "ORDER BY"], answer: "HAVING" },
        { q: "What is the size of an IPv4 address?", options: ["32 bits", "64 bits", "128 bits", "16 bits"], answer: "32 bits" }
      ]
    },
    {
      title: 'KBC: Kaun Banega Crorepati (Engineering Edition)',
      description: 'Answer 10 engineering and technology questions to reach 1000 points. Play with a real-time exam timer, lifeline help, and progressive money tree structure.',
      type: 'Quiz',
      is_active: true,
      questions: [
        { q: "Which of these is the correct file extension for Python files?", options: [".py", ".pt", ".pyt", ".p"], answer: ".py" },
        { q: "In Javascript, which keyword is used to declare a block-scoped local variable?", options: ["var", "let", "const", "local"], answer: "let" },
        { q: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperTabular Markup Language", "None of these"], answer: "HyperText Markup Language" },
        { q: "Which data structure operates on a Last In First Out (LIFO) basis?", options: ["Queue", "Stack", "Tree", "Array"], answer: "Stack" },
        { q: "What is the primary purpose of a database primary key?", options: ["To uniquely identify each record", "To encrypt the table", "To sort the rows in memory", "To create a backup copy"], answer: "To uniquely identify each record" },
        { q: "Which HTTP method is used to update existing data on a server?", options: ["GET", "POST", "PUT", "DELETE"], answer: "PUT" },
        { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Color Style Sheets"], answer: "Cascading Style Sheets" },
        { q: "In git, which command is used to record changes to the repository history?", options: ["git save", "git commit", "git push", "git add"], answer: "git commit" },
        { q: "Which of these is NOT a relational database management system?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], answer: "MongoDB" },
        { q: "What is the time complexity of searching in a perfectly balanced Binary Search Tree?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: "O(log n)" }
      ]
    }
  ];

  const { data, error } = await supabase.from('games_quizzes').insert(games).select();
  console.log("Seeded:", data, "Error:", error);
}

seed();
