const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

async function seed() {
  const games = [
    {
      title: 'Algorithm Arena',
      description: 'Solve algorithmic puzzles to climb the leaderboard.',
      type: 'Game',
      is_active: true,
      questions: [
        { q: "What is the time complexity of binary search?", options: ["O(1)", "O(n)", "O(log n)"], answer: "O(log n)" },
        { q: "Which sorting algorithm is fastest in average case?", options: ["Bubble Sort", "Quick Sort", "Insertion Sort"], answer: "Quick Sort" }
      ]
    },
    {
      title: 'Web Dev Jeopardy',
      description: 'Test your HTML/CSS/JS knowledge in a jeopardy style game.',
      type: 'Quiz',
      is_active: true,
      questions: [
        { q: "Which tag is used for the largest heading?", options: ["<h1>", "<heading>", "<h6>"], answer: "<h1>" },
        { q: "Which property is used to change text color?", options: ["font-color", "color", "text-color"], answer: "color" }
      ]
    },
    {
      title: 'Data Science Scavenger Hunt',
      description: 'Find clues in data sets and build predictive models.',
      type: 'Game',
      is_active: true,
      questions: [
        { q: "What library is best for data manipulation in Python?", options: ["Requests", "Pandas", "Matplotlib"], answer: "Pandas" }
      ]
    },
    {
      title: 'UX/UI Speed Design',
      description: 'Identify design flaws quickly under time pressure.',
      type: 'Game',
      is_active: true,
      questions: [
        { q: "What does UX stand for?", options: ["User Exchange", "User Experience", "User Expansion"], answer: "User Experience" }
      ]
    }
  ];

  const { data, error } = await supabase.from('games_quizzes').insert(games).select();
  console.log(data, error);
}

seed();
