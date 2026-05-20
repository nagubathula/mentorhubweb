const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://vhrmcfwlkjgepdcyhmnw.supabase.co', 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe');

const studentOnboardingQuestions = [
  {
    step: 1,
    title: "Education & Language",
    icon: "GraduationCap",
    color: "#0cb4ce",
    questions: [
      { id: "q1", number: "Q1.", text: "Which college are you studying at or have studied at?", type: "input", placeholder: "e.g. IIT Bombay, VIT Vellore, BITS Pilani..." },
      { id: "q2", number: "Q2.", text: "Which branch / department are you from?", type: "chips", options: ["Computer Science / IT", "Electronics / ECE", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Commerce / BBA / MBA", "Arts / Humanities", "Science (BSc / MSc)", "Other"] },
      { id: "q3", number: "Q3.", text: "What is your mother tongue?", type: "chips", options: ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Odia", "English", "Other"] },
      { id: "q4", number: "Q4.", text: "Which languages can you speak comfortably?", type: "chips", multiSelect: true, options: ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Odia", "Other"] }
    ]
  },
  {
    step: 2,
    title: "Personal Inspiration",
    icon: "Star",
    color: "#f59e0b",
    questions: [
      { id: "q5", number: "Q5.", text: "Who inspires you the most in life?", type: "chips", options: ["A family member", "A teacher/mentor", "A successful entrepreneur", "A scientist/engineer", "A celebrity/public figure"] },
      { id: "q6", number: "Q6.", text: "Which famous personality do you admire most?", type: "input", placeholder: "e.g. Elon Musk, APJ Abdul Kalam..." },
      { id: "q7", number: "Q7.", text: "If you could have dinner with one successful person, who would it be?", type: "input", placeholder: "Type a name..." }
    ]
  },
  {
    step: 3,
    title: "Movies & Entertainment",
    icon: "Video",
    color: "#ef4444",
    questions: [
      { id: "q8", number: "Q8.", text: "What type of movies do you enjoy the most?", type: "chips", options: ["Sci-fi / Technology", "Action", "Comedy", "Drama", "Biographies / Inspirational"] },
      { id: "q9", number: "Q9.", text: "Who is your favorite actor or actress?", type: "input", placeholder: "Type a name..." },
      { id: "q10", number: "Q10.", text: "Which movie motivates you the most?", type: "input", placeholder: "e.g. The Pursuit of Happyness..." }
    ]
  },
  {
    step: 4,
    title: "Sports & Activities",
    icon: "Trophy",
    color: "#10b981",
    questions: [
      { id: "q11", number: "Q11.", text: "Do you play or follow sports?", type: "chips", options: ["Yes, regularly", "Occasionally", "Rarely", "Not really"] },
      { id: "q12", number: "Q12.", text: "Which sport do you like the most?", type: "chips", options: ["Cricket", "Football", "Badminton", "Basketball", "Other"] },
      { id: "q13", number: "Q13.", text: "What role do you usually enjoy in team activities?", type: "chips", options: ["Leader", "Strategist", "Supporter", "Independent contributor"] }
    ]
  },
  {
    step: 5,
    title: "Thinking Style",
    icon: "Brain",
    color: "#8b5cf6",
    questions: [
      { id: "q14", number: "Q14.", text: "Which activity sounds most exciting to you?", type: "chips", options: ["Solving logical puzzles", "Designing creative things", "Analyzing data or trends", "Building machines or gadgets", "Managing people/projects"] },
      { id: "q15", number: "Q15.", text: "What type of challenges do you enjoy most?", type: "chips", options: ["Technical problems", "Creative challenges", "Strategy games", "Real-world business problems"] }
    ]
  },
  {
    step: 6,
    title: "Skills & Interests",
    icon: "Zap",
    color: "#3b82f6",
    questions: [
      { id: "q16", number: "Q16.", text: "Which skills do you already have?", type: "chips", multiSelect: true, options: ["Programming", "Design", "Data analysis", "Communication", "Leadership", "None yet"] },
      { id: "q17", number: "Q17.", text: "Which tools or languages have you tried before?", type: "chips", multiSelect: true, options: ["Python", "Java", "Excel", "SQL", "Figma", "None"] }
    ]
  },
  {
    step: 7,
    title: "Learning Preferences",
    icon: "BookOpen",
    color: "#14b8a6",
    questions: [
      { id: "q18", number: "Q18.", text: "How do you learn best?", type: "chips", options: ["Watching videos", "Doing hands-on projects", "Learning with a mentor", "Reading"] },
      { id: "q19", number: "Q19.", text: "How many hours per week can you spend learning new skills?", type: "chips", options: ["3-5 hours", "5-10 hours", "10+ hours"] }
    ]
  },
  {
    step: 8,
    title: "Fun Questions",
    icon: "Sparkles",
    color: "#f97316",
    questions: [
      { id: "q20", number: "Q20.", text: "If you had a superpower, what would it be?", type: "chips", options: ["Super intelligence", "Time travel", "Super speed", "Reading minds"] },
      { id: "q21", number: "Q21.", text: "If you could build any technology, what would it be?", type: "input", placeholder: "Dream big! Describe it..." },
      { id: "q22", number: "Q22.", text: "If you could start a company, what problem would you solve?", type: "input", placeholder: "What problem matters to you?" }
    ]
  }
];

async function update() {
  const { data, error } = await supabase
    .from('questionnaires')
    .update({ questions: studentOnboardingQuestions })
    .eq('title', 'Student Onboarding Questionnaire');

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Success updating Student Onboarding Questionnaire to all 8 phases');
  }
}

update();
