import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, ListTodo, ChevronRight, Check, HelpCircle, Sparkles, Heart, Lightbulb, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MentorPlaybookProps {
  onBack: () => void;
}

// --- Types & Data ---
interface PlaybookItem {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
  practices: string[];
  suggestedQuestions?: string[];
  example: {
    type: "tip" | "quote" | "comparison";
    content: string;
    bad?: string;
  };
}

const PLAYBOOK_PRACTICES: PlaybookItem[] = [
  {
    id: "bp1",
    title: "Understand the Student",
    emoji: "🧠",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
    description: "Before teaching, understand who your student is — their goals, skill level, and learning style.",
    practices: [
      "Ask about the student's career goals",
      "Understand their current skill level",
      "Identify their strengths and weaknesses"
    ],
    suggestedQuestions: [
      "What skills do you want to develop?",
      "What challenges are you facing in learning?",
      "What type of learning works best for you?"
    ],
    example: {
      type: "tip",
      content: "Start every mentorship with a 15-minute discovery call."
    }
  },
  {
    id: "bp2",
    title: "Set Clear Weekly Goals",
    emoji: "🎯",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Students stay motivated when they know what to do next. Define small, achievable weekly goals.",
    practices: [
      "Define small weekly learning goals",
      "Break big topics into small tasks",
      "Track progress regularly"
    ],
    example: {
      type: "tip",
      content: "Week Goal: Learn SQL joins and complete 3 practice queries."
    }
  },
  {
    id: "bp3",
    title: "Encourage Hands-On Learning",
    emoji: "⚙️",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    description: "Students learn faster by doing. Prioritize projects and practical tasks over passive learning.",
    practices: [
      "Assign small practical tasks",
      "Encourage students to build projects",
      "Let students solve problems independently first"
    ],
    example: {
      type: "quote",
      content: "How would you solve this problem?"
    }
  },
  {
    id: "bp4",
    title: "Give Constructive Feedback",
    emoji: "💬",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    description: "Feedback helps students improve. Focus on what's working and suggest clear improvements.",
    practices: [
      "Focus on what the student did well",
      "Suggest clear improvements",
      "Avoid harsh criticism"
    ],
    example: {
      type: "comparison",
      content: "Your logic is correct. Try improving code readability.",
      bad: "This code is wrong."
    }
  },
  {
    id: "bp5",
    title: "Motivate Through Small Wins",
    emoji: "🏆",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    description: "Celebrate progress, no matter how small. Recognition fuels motivation.",
    practices: [
      "Appreciate effort, not just results",
      "Recognize improvement publicly",
      "Encourage consistency over perfection"
    ],
    example: {
      type: "quote",
      content: "Great work finishing your first project!"
    }
  },
  {
    id: "bp6",
    title: "Encourage Daily Learning Habits",
    emoji: "🔥",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    description: "Consistency builds skills. Help students develop a daily practice routine.",
    practices: [
      "Encourage daily practice",
      "Recommend short learning sessions (20 min)",
      "Track learning streaks"
    ],
    example: {
      type: "quote",
      content: "Spend 20 minutes daily instead of long sessions once a week."
    }
  },
  {
    id: "bp7",
    title: "Share Real Industry Insights",
    emoji: "🚀",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    description: "Students value real-world guidance. Share your career experiences and industry knowledge.",
    practices: [
      "Share career experiences and stories",
      "Explain how skills are used in industry",
      "Discuss common mistakes beginners make"
    ],
    example: {
      type: "quote",
      content: "Understanding SQL joins is crucial for data analyst roles."
    }
  },
  {
    id: "bp8",
    title: "Be Supportive and Patient",
    emoji: "🤝",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    description: "Students may struggle. Your patience and support create a safe learning environment.",
    practices: [
      "Encourage questions — no question is silly",
      "Be patient with beginners",
      "Create a safe, judgement-free space"
    ],
    example: {
      type: "quote",
      content: "It's okay to make mistakes while learning."
    }
  },
  {
    id: "bp9",
    title: "Encourage Reflection",
    emoji: "🌱",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    description: "Reflection improves understanding. Ask students to think about what they learned.",
    practices: [
      "Ask students to reflect on their learning",
      "Encourage self-evaluation after each session"
    ],
    suggestedQuestions: [
      "What did you learn today?",
      "What was the most challenging part?"
    ],
    example: {
      type: "tip",
      content: "End each session with a 2-minute reflection exercise."
    }
  },
  {
    id: "bp10",
    title: "Help Students Prepare for Careers",
    emoji: "💼",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    description: "Connect learning to careers. Help students build portfolios and prepare for interviews.",
    practices: [
      "Help students build projects for portfolios",
      "Review resumes and portfolios",
      "Conduct mock interviews"
    ],
    example: {
      type: "quote",
      content: "Let's turn your project into a portfolio case study."
    }
  }
];

interface ConversationItem {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  items: string[];
  example: string;
}

const CONVERSATION_GUIDELINES: ConversationItem[] = [
  {
    id: "cl1",
    title: "Icebreaker Conversation",
    emoji: "❄️",
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    description: "Use the student's interests to start a casual, relaxed conversation.",
    items: [
      "Mention the student's favorite movie or actor",
      "Ask about their hobbies",
      "Ask what inspired them to learn this skill"
    ],
    example: "You mentioned Interstellar is your favorite movie. What did you like most about it?"
  },
  {
    id: "cl2",
    title: "Relate Learning to Interests",
    emoji: "🎯",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
    description: "Connect the student's interests with learning topics to make sessions memorable.",
    items: [
      "Use examples related to the student's interests",
      "Connect concepts to real-world topics they enjoy"
    ],
    example: "Think of debugging like analyzing a cricket match strategy."
  },
  {
    id: "cl3",
    title: "Encourage Personal Sharing",
    emoji: "💬",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Encourage the student to open up about their motivations and preferences.",
    items: [
      "Ask about what motivates them",
      "Ask what they enjoy learning most",
      "Encourage personal thoughts and opinions"
    ],
    example: "What made you interested in becoming a data analyst?"
  },
  {
    id: "cl4",
    title: "Appreciate Progress",
    emoji: "🌟",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    description: "Recognize effort and celebrate improvements, no matter how small.",
    items: [
      "Appreciate small wins",
      "Encourage consistency",
      "Celebrate improvements publicly"
    ],
    example: "Great job completing that dashboard project!"
  },
  {
    id: "cl5",
    title: "Guide Learning Clearly",
    emoji: "🎯",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    description: "Help students focus on the next step with clear, actionable guidance.",
    items: [
      "Break down complex problems into steps",
      "Give practical, specific suggestions",
      "Recommend curated resources"
    ],
    example: "Practice SQL joins with two datasets today."
  },
  {
    id: "cl6",
    title: "Share Personal Stories",
    emoji: "🚀",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    description: "Share relatable career experiences to inspire and connect with students.",
    items: [
      "Share early career struggles",
      "Explain lessons learned along the way",
      "Give real career insights and advice"
    ],
    example: "When I first started learning Python, debugging felt frustrating too."
  },
  {
    id: "cl7",
    title: "Emotional Check-In",
    emoji: "😊",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    description: "Check how the student feels about their progress and offer reassurance.",
    items: [
      "Ask how confident they feel",
      "Encourage them during struggles",
      "Offer reassurance and support"
    ],
    example: "What part of the project felt most difficult?"
  },
  {
    id: "cl8",
    title: "Set the Next Goal",
    emoji: "🏁",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    description: "End the session with clear direction and a realistic next step.",
    items: [
      "Define the next learning task",
      "Confirm the student understands the plan",
      "Set a realistic weekly goal"
    ],
    example: "This week, focus on building your first dashboard."
  },
  {
    id: "cl9",
    title: "End with Encouragement",
    emoji: "🌱",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    description: "Finish every conversation on a positive, motivating note.",
    items: [
      "Appreciate the student's effort today",
      "Encourage continued learning",
      "Invite questions anytime"
    ],
    example: "You're making good progress — keep going!"
  }
];

const STATIC_STUDENT_PROFILES = [
  {
    name: "Rahul Kumar",
    track: "Data Analytics",
    avatar: "RK",
    interests: {
      movie: "Interstellar",
      actor: "Shah Rukh Khan",
      sport: "Cricket",
      inspiration: "Elon Musk",
      hobbies: ["Gaming", "Watching tech videos"]
    }
  },
  {
    name: "Sneha Iyer",
    track: "Web Development",
    avatar: "SI",
    interests: {
      movie: "The Social Network",
      actor: "Alia Bhatt",
      sport: "Badminton",
      inspiration: "Sheryl Sandberg",
      hobbies: ["Reading", "UI Design"]
    }
  },
  {
    name: "Arjun Mehta",
    track: "Python Programming",
    avatar: "AM",
    interests: {
      movie: "The Matrix",
      actor: "Ranveer Singh",
      sport: "Football",
      inspiration: "Sundar Pichai",
      hobbies: ["Coding challenges", "Chess"]
    }
  }
];

export function MentorPlaybook({ onBack }: MentorPlaybookProps) {
  const [activeTab, setActiveTab] = useState<"practices" | "checklist">("practices");
  const [expandedPracticeId, setExpandedPracticeId] = useState<string | null>("bp1");
  const [readPracticeIds, setReadPracticeIds] = useState<Set<string>>(new Set(["bp1"]));
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeGuideId, setActiveGuideId] = useState<string | null>("cl1");
  const [activeStudentIndex, setActiveStudentIndex] = useState<number>(0);

  const togglePractice = (id: string) => {
    setExpandedPracticeId(expandedPracticeId === id ? null : id);
    setReadPracticeIds(prev => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });
  };

  const toggleCheckItem = (id: string, index: number) => {
    const compoundKey = `${id}-${index}`;
    setCheckedItems(prev => {
      const updated = new Set(prev);
      if (updated.has(compoundKey)) {
        updated.delete(compoundKey);
      } else {
        updated.add(compoundKey);
      }
      return updated;
    });
  };

  const currentStudent = STATIC_STUDENT_PROFILES[activeStudentIndex];
  
  // Progress calculations
  const practicesProgress = Math.round((readPracticeIds.size / PLAYBOOK_PRACTICES.length) * 100);
  const totalChecklistItems = CONVERSATION_GUIDELINES.reduce((sum, cl) => sum + cl.items.length, 0);
  const checklistProgress = Math.round((checkedItems.size / totalChecklistItems) * 100);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-sans overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
    >
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-3 border-b border-slate-100 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <p className="text-slate-900 text-[15px] font-bold">Mentor Hub Playbook</p>
            </div>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5">
              {activeTab === "practices" ? "Techniques to help students learn faster" : "Structured conversation guide for sessions"}
            </p>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab("practices")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "practices" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Best Practices
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "checklist" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" /> Conversations
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "practices" ? (
            <motion.div
              key="practices_tab"
              className="px-5 pt-4 pb-6 space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress and Greeting */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    animate={{ width: `${practicesProgress}%` }}
                    transition={{ type: "spring", damping: 20 }}
                  />
                </div>
                <span className="text-slate-500 text-[11px] font-bold shrink-0">{readPracticeIds.size}/{PLAYBOOK_PRACTICES.length} read</span>
              </div>

              {/* Guide Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-4 flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-950 text-xs font-extrabold tracking-wide uppercase mb-1">Your Mentoring Playbook</p>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    10 proven practices to guide, motivate, and support your students effectively. Tap each card to expand and learn more.
                  </p>
                </div>
              </div>

              {/* List of Practices Accordions */}
              <div className="space-y-3">
                {PLAYBOOK_PRACTICES.map((p, idx) => {
                  const isExpanded = expandedPracticeId === p.id;
                  const isRead = readPracticeIds.has(p.id);

                  return (
                    <motion.div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                      layout
                    >
                      <button
                        onClick={() => togglePractice(p.id)}
                        className="w-full p-4 flex items-center gap-3.5 text-left active:bg-slate-50/80 transition-colors"
                      >
                        <div className={`w-9.5 h-9.5 rounded-xl ${p.bgColor} flex items-center justify-center shrink-0 ${p.color} text-lg shadow-xs`}>
                          {p.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-slate-800 text-[14px] font-bold leading-tight truncate">{p.title}</p>
                            {isRead && (
                              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <p className="text-slate-400 text-[11px] font-medium truncate mt-1">{p.description}</p>
                        </div>
                        <ChevronRight className={`w-4.5 h-4.5 text-slate-300 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {/* Expanded Section Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-50 px-4 pb-5 pt-3.5 bg-slate-50/30"
                          >
                            <p className="text-slate-600 text-xs leading-relaxed mb-4 font-medium">{p.description}</p>
                            
                            {/* Best Practices Check points */}
                            <div className="mb-4">
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">Key Guidelines</p>
                              <div className="space-y-2">
                                {p.practices.map((pr, pIdx) => (
                                  <div key={pIdx} className="flex items-start gap-2.5 py-0.5">
                                    <div className={`w-4 h-4 rounded-full ${p.bgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                                      <Check className={`w-2.5 h-2.5 ${p.color}`} strokeWidth={3} />
                                    </div>
                                    <p className="text-slate-700 text-xs leading-relaxed font-medium">{pr}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Suggested Questions if available */}
                            {p.suggestedQuestions && (
                              <div className="mb-4">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">Questions to Ask</p>
                                <div className="space-y-2">
                                  {p.suggestedQuestions.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-slate-100/50 rounded-xl px-3 py-2 border border-slate-200/40 flex items-start gap-2">
                                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                      <p className="text-slate-600 text-xs italic font-medium">"{q}"</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Examples Tip / Quotes */}
                            <div>
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">
                                {p.example.type === "comparison" ? "Actionable Examples" : p.example.type === "quote" ? "Suggested Saying" : "Pro Tip"}
                              </p>
                              {p.example.type === "comparison" ? (
                                <div className="space-y-2">
                                  <div className="bg-emerald-50/50 rounded-xl px-3 py-2.5 border-l-4 border-emerald-500">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                                      <span className="text-emerald-700 text-[10px] font-black uppercase tracking-wider">Recommended</span>
                                    </div>
                                    <p className="text-slate-700 text-xs italic font-medium leading-relaxed">"{p.example.content}"</p>
                                  </div>
                                  {p.example.bad && (
                                    <div className="bg-rose-50/50 rounded-xl px-3 py-2.5 border-l-4 border-rose-500">
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="text-rose-600 text-[10px] font-black uppercase tracking-wider">Avoid Saying</span>
                                      </div>
                                      <p className="text-slate-400 text-xs italic font-medium leading-relaxed line-through">"{p.example.bad}"</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className={`${p.bgColor}/70 rounded-xl px-3 py-3 border border-slate-100`}>
                                  <p className="text-slate-700 text-xs italic font-medium leading-relaxed">"{p.example.content}"</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Footer Insight */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Heart className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-slate-800 text-xs font-bold mb-1">You're Making a Difference</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-semibold px-2">
                    Every interaction matters. These practices help you guide students more effectively, build strong relationships, and ensure consistent mentoring quality.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checklist_tab"
              className="px-5 pt-4 pb-6 space-y-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Checklist Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-500 rounded-full"
                    animate={{ width: `${checklistProgress}%` }}
                    transition={{ type: "spring", damping: 20 }}
                  />
                </div>
                <span className="text-slate-500 text-[11px] font-bold shrink-0">{checkedItems.size}/{totalChecklistItems} done</span>
              </div>

              {/* Student Profile Selection Snapshot */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1 justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-500" />
                    <p className="text-slate-900 text-xs font-extrabold tracking-wide uppercase">Student Profile Reference</p>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-600 text-[9px] font-black uppercase tracking-wider rounded-md">Context Cards</span>
                </div>

                {/* Profiles Mini-Selector Tabs */}
                <div className="flex gap-2">
                  {STATIC_STUDENT_PROFILES.map((std, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStudentIndex(idx)}
                      className={`flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        activeStudentIndex === idx
                          ? "bg-white shadow-xs text-slate-900 border-sky-300"
                          : "bg-sky-50/50 text-slate-500 border-transparent hover:bg-sky-50"
                      }`}
                    >
                      <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-black shadow-xs ${
                        activeStudentIndex === idx ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-600"
                      }`}>
                        {std.avatar}
                      </div>
                      <span className="truncate max-w-[65px]">{std.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Student Details Panel */}
                <div className="bg-white/70 backdrop-blur-xs rounded-xl p-3.5 space-y-3 border border-sky-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-black shadow-sm uppercase">
                      {currentStudent.avatar}
                    </div>
                    <div>
                      <p className="text-slate-800 text-[13px] font-bold leading-tight">{currentStudent.name}</p>
                      <p className="text-sky-500 text-[10px] font-black uppercase tracking-wider mt-0.5">{currentStudent.track}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Movie", value: currentStudent.interests.movie, icon: "🎬" },
                      { label: "Actor", value: currentStudent.interests.actor, icon: "🌟" },
                      { label: "Sport", value: currentStudent.interests.sport, icon: "⚽" },
                      { label: "Inspiration", value: currentStudent.interests.inspiration, icon: "💡" }
                    ].map((interest, iIdx) => (
                      <div key={iIdx} className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                        <p className="text-slate-400 text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
                          <span>{interest.icon}</span> {interest.label}
                        </p>
                        <p className="text-slate-700 text-xs font-bold truncate">{interest.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Hobbies */}
                  <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 flex flex-col">
                    <p className="text-slate-400 text-[8.5px] font-bold uppercase tracking-wider mb-1.5">🎮 Hobbies & Passions</p>
                    <div className="flex flex-wrap gap-1">
                      {currentStudent.interests.hobbies.map((hobby, hIdx) => (
                        <span key={hIdx} className="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10.5px] font-bold rounded-full border border-sky-100/30">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-50/90 rounded-xl px-3.5 py-2.5 border border-amber-100/50">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 text-[11px] leading-relaxed font-semibold italic">
                    Use these interests to start a friendly, natural conversation with {currentStudent.name.split(" ")[0]}.
                  </p>
                </div>
              </div>

              {/* Checklist Guidelines Accordions */}
              <div className="space-y-3">
                {CONVERSATION_GUIDELINES.map((cl, idx) => {
                  const isExpanded = activeGuideId === cl.id;
                  
                  // Compute progress of this specific card
                  const currentDoneCount = cl.items.filter((_, clIdx) => checkedItems.has(`${cl.id}-${clIdx}`)).length;
                  const isFinished = currentDoneCount === cl.items.length;

                  return (
                    <motion.div
                      key={cl.id}
                      className={`bg-white rounded-2xl border transition-all ${
                        isFinished ? "border-emerald-200 bg-emerald-50/5" : "border-slate-100"
                      } shadow-sm overflow-hidden`}
                      layout
                    >
                      <button
                        onClick={() => setActiveGuideId(isExpanded ? null : cl.id)}
                        className="w-full p-4 flex items-center gap-3.5 text-left active:bg-slate-50/80 transition-colors"
                      >
                        <div className={`w-9.5 h-9.5 rounded-xl ${cl.bgColor} flex items-center justify-center shrink-0 ${cl.color} text-lg shadow-xs`}>
                          {cl.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-[14px] font-bold leading-tight truncate ${isFinished ? 'text-emerald-700 font-extrabold' : 'text-slate-800'}`}>
                              {cl.title}
                            </p>
                            {isFinished && (
                              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />
                              </div>
                            )}
                            {!isFinished && currentDoneCount > 0 && (
                              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                {currentDoneCount}/{cl.items.length}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-[11px] font-medium truncate mt-1">{cl.description}</p>
                        </div>
                        <ChevronRight className={`w-4.5 h-4.5 text-slate-300 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-slate-50 px-4 pb-5 pt-3.5 bg-slate-50/30"
                          >
                            <p className="text-slate-600 text-xs leading-relaxed mb-3.5 font-medium">{cl.description}</p>

                            {/* Checklist Sub-items */}
                            <div className="space-y-2 mb-4">
                              {cl.items.map((item, itemIdx) => {
                                const compoundKey = `${cl.id}-${itemIdx}`;
                                const isChecked = checkedItems.has(compoundKey);

                                return (
                                  <button
                                    key={itemIdx}
                                    onClick={() => toggleCheckItem(cl.id, itemIdx)}
                                    className="w-full flex items-start gap-2.5 py-2 text-left active:scale-[0.99] transition-transform group"
                                  >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                      isChecked ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/20" : "border-slate-300 group-hover:border-slate-400"
                                    }`}>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
                                    </div>
                                    <p className={`text-xs leading-relaxed transition-all font-medium ${
                                      isChecked ? "text-slate-400 line-through" : "text-slate-700"
                                    }`}>
                                      {item}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Conversation starter quote */}
                            <div className={`${cl.bgColor} rounded-xl px-3 py-3 border border-slate-100`}>
                              <p className="text-slate-400 text-[8.5px] font-bold uppercase tracking-wider mb-1">Example Prompt</p>
                              <p className="text-slate-700 text-xs italic font-medium leading-relaxed">"{cl.example}"</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Footer Insight */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Sparkles className="w-6 h-6 text-teal-500" />
                  </div>
                  <p className="text-slate-800 text-xs font-bold mb-1">Conversations Build Trust</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-semibold px-2">
                    When students feel understood as a person — not just a learner — they engage more, learn faster, and stay motivated throughout their journey.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
