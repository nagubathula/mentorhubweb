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
    console.log('Success updating Student Onboarding Questionnaire');
  }
}

update();
