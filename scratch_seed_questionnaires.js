const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vhrmcfwlkjgepdcyhmnw.supabase.co';
const supabaseKey = 'sb_publishable_ydTHzAWqcxh5309HHs-tCQ_RjOBCzFe';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedQuestionnaires() {
  // Clear existing questionnaires if any
  const { error: deleteError } = await supabase.from('questionnaires').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error("Error clearing old questionnaires:", deleteError);
  } else {
    console.log("Successfully cleared previous questionnaires.");
  }

  const questionnaires = [
    {
      title: "Student Onboarding Questionnaire",
      description: "Initial onboarding questions covering education, branch, language, and personal inspiration.",
      target_role: "STUDENT",
      is_active: true,
      questions: [
        {
          step: 1, title: "Education & Language", icon: "GraduationCap", color: "#0cb4ce",
          questions: [
            { id: "q1", number: "Q1.", text: "Which college are you studying at or have studied at?", type: "input", placeholder: "e.g. IIT Bombay..." },
            { id: "q2", number: "Q2.", text: "Which branch / department are you from?", type: "chips", options: ["Computer Science / IT", "Electronics / ECE", "Mechanical", "Electrical", "Civil", "Commerce / BBA", "Arts", "Science", "Other"] },
            { id: "q3", number: "Q3.", text: "What is your mother tongue?", type: "chips", options: ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "English", "Other"] }
          ]
        },
        {
          step: 2, title: "Personal Inspiration", icon: "Star", color: "#f59e0b",
          questions: [
            { id: "q5", number: "Q5.", text: "Who inspires you the most in life?", type: "chips", options: ["Family member", "Teacher/mentor", "Entrepreneur", "Scientist/engineer", "Celebrity"] },
            { id: "q6", number: "Q6.", text: "Which famous personality do you admire most?", type: "input", placeholder: "e.g. Elon Musk..." }
          ]
        }
      ]
    },
    {
      title: "Student Behavioral Screening",
      description: "Screening questions assessing curiosity, focus, and learning mindset.",
      target_role: "STUDENT",
      is_active: true,
      questions: [
        {
          step: 1, title: "Curiosity", icon: "Lightbulb", color: "#3b82f6",
          questions: [
            { id: "b1", number: "Q1.", text: "When you see something you don't understand, what do you do?", type: "chips", options: ["Search online to understand it", "Ask someone who knows", "Try to explore it yourself", "Ignore it and move on"] }
          ]
        },
        {
          step: 2, title: "Exploring Beyond Syllabus", icon: "BookOpenCheck", color: "#8b5cf6",
          questions: [
            { id: "b2", number: "Q2.", text: "How often do you explore topics beyond your school or college syllabus?", type: "chips", options: ["Very often", "Sometimes", "Occasionally", "Never"] }
          ]
        },
        {
          step: 3, title: "Learning Excitement", icon: "Sparkles", color: "#f59e0b",
          questions: [
            { id: "b3", number: "Q3.", text: "What excites you most when learning something new?", type: "chips", options: ["Understanding how it works", "Applying it in real life", "Creating something with it", "Just finishing it quickly without caring about learning"] }
          ]
        },
        {
          step: 4, title: "Activity Interest", icon: "Target", color: "#ef4444",
          questions: [
            { id: "b4", number: "Q4.", text: "Which activity sounds most interesting to you?", type: "chips", options: ["Solving puzzles", "Building a project", "Designing something creative", "Doing nothing and waiting for others to do it"] }
          ]
        },
        {
          step: 5, title: "Focus Duration", icon: "Clock", color: "#10b981",
          questions: [
            { id: "b5", number: "Q5.", text: "How long can you usually focus on a task?", type: "chips", options: ["20-40 minutes", "40-60 minutes", "More than 1 hour", "Less than 5 minutes"] }
          ]
        },
        {
          step: 6, title: "Distractions", icon: "Zap", color: "#ef4444",
          questions: [
            { id: "b6", number: "Q6.", text: "When studying, how often do you get distracted by social media?", type: "chips", options: ["Rarely", "Sometimes", "Occasionally", "Always and I don't try to control it"] }
          ]
        },
        {
          step: 7, title: "Handling Difficult Problems", icon: "Brain", color: "#3b82f6",
          questions: [
            { id: "b7", number: "Q7.", text: "If a problem is difficult, what do you do?", type: "chips", options: ["Keep trying until I solve it", "Take a short break and try again", "Ask someone for help after trying", "Immediately give up"] }
          ]
        },
        {
          step: 8, title: "Learning Discipline", icon: "Target", color: "#8b5cf6",
          questions: [
            { id: "b8", number: "Q8.", text: "When you start learning a new skill, how likely are you to continue practicing?", type: "chips", options: ["Very likely", "Likely if I find it interesting", "Sometimes", "I usually quit quickly"] }
          ]
        },
        {
          step: 9, title: "Motivation", icon: "Sparkles", color: "#f59e0b",
          questions: [
            { id: "b9", number: "Q9.", text: "What motivates you most while learning?", type: "chips", options: ["Curiosity", "Career goals", "Building something useful", "Just passing time without learning anything"] }
          ]
        },
        {
          step: 10, title: "Learning Style", icon: "BookOpen", color: "#10b981",
          questions: [
            { id: "b10", number: "Q10.", text: "How do you prefer to learn?", type: "chips", options: ["Hands-on practice", "Watching tutorials", "Learning from mentors", "Not interested in learning actively"] }
          ]
        },
        {
          step: 11, title: "Self Improvement", icon: "RefreshCw", color: "#0f172a",
          questions: [
            { id: "b11", number: "Q11.", text: "If you realize you made a mistake, what do you do?", type: "chips", options: ["Try to fix it", "Learn why it happened", "Ask for feedback", "Ignore it completely"] }
          ]
        },
        {
          step: 12, title: "Curiosity Level", icon: "Lightbulb", color: "#3b82f6",
          questions: [
            { id: "b12", number: "Q12.", text: "How curious are you about learning new skills or technologies?", type: "chips", options: ["Very curious", "Moderately curious", "Slightly curious", "Not curious at all"] }
          ]
        }
      ]
    },
    {
      title: "Mentor Onboarding Questionnaire",
      description: "Onboarding questionnaire for mentors covering professional experience, company, college, and language.",
      target_role: "MENTOR",
      is_active: true,
      questions: [
        {
          step: 1, title: "Education, Language & Contact", icon: "GraduationCap", color: "#0cb4ce",
          questions: [
            { id: "q101", number: "Q101.", text: "Which company are you currently working at?", type: "input", placeholder: "e.g. Google, TCS, Infosys, Startup..." },
            { id: "q102", number: "Q102.", text: "Which college did you study at?", type: "input", placeholder: "e.g. IIT Delhi, NIT Trichy, BITS Pilani..." },
            { id: "q103", number: "Q103.", text: "Which branch / department did you study?", type: "chips", options: ["Computer Science / IT", "Electronics / ECE", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Commerce / BBA / MBA", "Arts / Humanities", "Science (BSc / MSc)", "Other"] },
            { id: "q104", number: "Q104.", text: "What is your mother tongue?", type: "chips", options: ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "English", "Other"] }
          ]
        }
      ]
    }
  ];

  const { data, error } = await supabase.from('questionnaires').insert(questionnaires).select();
  console.log("Seeded Questionnaires:", data, "Error:", error);
}

seedQuestionnaires();
