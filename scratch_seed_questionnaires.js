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
      description: "Screening questions assessing curiosity and drive to explore beyond the syllabus.",
      target_role: "STUDENT",
      is_active: true,
      questions: [
        {
          step: 1, title: "Curiosity", icon: "Lightbulb",
          text: "When you see something you don't understand, what do you do?",
          options: ["Search online to understand it", "Ask someone who knows", "Try to explore it yourself", "Ignore it and move on"]
        },
        {
          step: 2, title: "Exploring Beyond Syllabus", icon: "BookOpenCheck",
          text: "How often do you explore topics beyond your school or college syllabus?",
          options: ["Very often", "Sometimes", "Occasionally", "Never"]
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
