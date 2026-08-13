"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Check, Lock, ChevronDown, Play, Code2, HelpCircle, 
  FolderOpen, BookOpen, Award, CheckCircle2, AlertCircle, Layers, Plus, Users, Edit3, Brain, Coins, Sparkles, Bot, X, Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { COURSE_QUESTIONS } from "@/lib/courseQuestionsData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ExtendedLesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  enabled?: boolean;
}

export interface ExtendedModule {
  id: string;
  title: string;
  description: string;
  color?: string;
  icon?: React.ReactNode;
  enabled: boolean;
  lessons: ExtendedLesson[];
}

export interface ExtendedCourse {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  color?: string;
  bgColor?: string;
  icon?: React.ReactNode;
  category: string;
  difficulty: string;
  duration: string;
  enrolled: boolean;
  progress: number;
  modules: ExtendedModule[];
}

function RenderLessonIcon({ type }: { type: string }) {
  switch (type) {
    case "video":
      return <Play className="w-3.5 h-3.5 text-blue-500" />;
    case "exercise":
      return <Code2 className="w-3.5 h-3.5 text-emerald-500" />;
    case "quiz":
      return <HelpCircle className="w-3.5 h-3.5 text-amber-500" />;
    case "project":
      return <FolderOpen className="w-3.5 h-3.5 text-violet-500" />;
    default:
      return <BookOpen className="w-3.5 h-3.5 text-slate-400" />;
  }
}

interface CourseDetailsScreenProps {
  course: ExtendedCourse;
  onBack: () => void;
  actionButtonText?: string;
  onActionClick?: () => void;
  secondaryActionButtonText?: string;
  onSecondaryActionClick?: () => void;
  completedLessons?: string[];
  onToggleLesson?: (lessonId: string) => void;
  adminData?: any;
  hideMarkAsComplete?: boolean;
  onCoinsEarned?: (amount: number) => void;
}

export function CourseDetailsScreen({ 
  course, 
  onBack, 
  actionButtonText, 
  onActionClick,
  secondaryActionButtonText,
  onSecondaryActionClick,
  completedLessons = [],
  onToggleLesson,
  adminData,
  hideMarkAsComplete = false,
  onCoinsEarned
}: CourseDetailsScreenProps) {
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [mounted, setMounted] = useState(false);

  // AI Assistant Panel state
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ id: string; sender: "user" | "ai"; text: string }[]>([]);
  const [aiInputQuery, setAiInputQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const aiChatEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (aiMessages.length > 0) {
      aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, isAiLoading]);

  const handleSendAiQuestion = async (queryText?: string) => {
    const textToSend = queryText || aiInputQuery;
    if (!textToSend || !textToSend.trim() || isAiLoading) return;

    const trimmed = textToSend.trim();
    setAiErrorMessage(null);
    setAiInputQuery("");

    const userMsg = { id: `user-${Date.now()}`, sender: "user" as const, text: trimmed };
    const updatedHistory = [...aiMessages, userMsg];
    setAiMessages(updatedHistory);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          courseContext: `Course Name: "${course.title}", Category: "${course.category}", Description: "${course.description}"`,
          history: updatedHistory.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Could not process question.");
      }

      const aiMsg = { id: `ai-${Date.now()}`, sender: "ai" as const, text: data.response || "No response received." };
      setAiMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Course AI query error:", err);
      setAiErrorMessage("Sorry, I couldn't process that question. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getSuggestedQuestionsForCourse = () => {
    const titleLower = (course.title || "").toLowerCase();
    if (titleLower.includes("vlsi") || titleLower.includes("semiconductor") || titleLower.includes("circuit") || titleLower.includes("transistor")) {
      return [
        "Explain MOSFET in simple words.",
        "What is CMOS logic in VLSI?",
        "Difference between NMOS and PMOS?",
        "Explain gate delay & dynamic power"
      ];
    }
    if (titleLower.includes("python") || titleLower.includes("programming")) {
      return [
        "Explain Python loops simply",
        "List vs Tuple in Python?",
        "How do functions work in Python?",
        "What are Python dictionaries?"
      ];
    }
    if (titleLower.includes("data") || titleLower.includes("ml") || titleLower.includes("machine learning")) {
      return [
        "What is Machine Learning?",
        "Supervised vs Unsupervised Learning?",
        "Explain DBMS Normalization",
        "What is a Confusion Matrix?"
      ];
    }
    if (titleLower.includes("web") || titleLower.includes("react") || titleLower.includes("frontend") || titleLower.includes("design")) {
      return [
        "What is React state & props?",
        "Flexbox vs CSS Grid?",
        "What is Responsive Web Design?",
        "How do REST APIs work?"
      ];
    }
    return [
      `What are the core principles of ${course.title}?`,
      `Explain the most important topics in ${course.title}`,
      `How is ${course.title} applied in real projects?`,
      `Give me a quick summary of ${course.title}`
    ];
  };

  const suggestedQuestions = getSuggestedQuestionsForCourse();

  const renderFormattedAiText = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", lang: match[1] || "code", content: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return (
      <div className="space-y-1.5 leading-relaxed">
        {parts.map((part, pIdx) => {
          if (part.type === "code") {
            return (
              <div key={pIdx} className="my-2 rounded-xl bg-slate-900 p-2.5 font-mono text-[11.5px] text-slate-100 overflow-x-auto shadow-inner border border-slate-800">
                <div className="flex justify-between items-center text-[9px] text-slate-400 mb-1 border-b border-slate-800 pb-1 uppercase tracking-widest font-sans font-semibold">
                  <span>{part.lang}</span>
                  <Code2 className="w-3 h-3 text-slate-500" />
                </div>
                <pre className="whitespace-pre overflow-x-auto">{part.content}</pre>
              </div>
            );
          }
          const lines = part.content.split("\n");
          return (
            <div key={pIdx} className="space-y-1">
              {lines.map((line, lIdx) => {
                if (line.startsWith("### ")) {
                  return <h4 key={lIdx} className="text-xs font-bold text-slate-900 mt-1.5 mb-0.5">{line.replace("### ", "")}</h4>;
                }
                if (line.startsWith("#### ")) {
                  return <h5 key={lIdx} className="text-[11.5px] font-semibold text-slate-800 mt-1 mb-0.5">{line.replace("#### ", "")}</h5>;
                }
                const boldRegex = /\*\*([^*]+)\*\*/g;
                const subParts = line.split(boldRegex);
                return (
                  <p key={lIdx} className={line.trim() === "" ? "h-1" : ""}>
                    {subParts.map((sub, sIdx) => {
                      if (sIdx % 2 === 1) {
                        return <strong key={sIdx} className="font-bold text-slate-900">{sub}</strong>;
                      }
                      return sub;
                    })}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(course.modules[0]?.id || null);

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentLesson = allLessons.find(l => !completedLessons.includes(l.id)) || allLessons[allLessons.length - 1];
  const isCurrentLessonCompleted = completedLessons.includes(currentLesson?.id);

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Math.floor(totalLessons * (course.progress / 100));
  const progressPercent = course.progress;

  const getModuleStats = (mod: ExtendedModule) => {
    const total = mod.lessons.length;
    const done = Math.min(total, Math.max(0, Math.floor(total * (progressPercent / 100))));
    return {
      done,
      total,
      percent: total > 0 ? Math.round((done / total) * 100) : 0
    };
  };

  const getModuleStatus = (mod: ExtendedModule) => {
    const lessons = mod.lessons;
    const completedInModule = lessons.filter(l => completedLessons.includes(l.id)).length;
    
    if (completedInModule === lessons.length) return "completed";
    if (lessons.some(l => l.id === currentLesson?.id)) return "current";
    return "locked";
  };

  const generateMockQuestion = (lessonTitle: string) => {
    // 1. Direct match check from imported modular COURSE_QUESTIONS
    if (COURSE_QUESTIONS[lessonTitle]) {
      return COURSE_QUESTIONS[lessonTitle];
    }

    const lowerTitle = lessonTitle.toLowerCase();

    // 2. VLSI / Semiconductor Keywords Check
    if (lowerTitle.includes("mosfet") || lowerTitle.includes("transistor") || lowerTitle.includes("cmos") || lowerTitle.includes("vlsi") || lowerTitle.includes("silicon") || lowerTitle.includes("ic ") || lowerTitle.includes("circuit")) {
      return {
        question: `In integrated circuit and VLSI designs, what is a key design consideration for "${lessonTitle}"?`,
        options: [
          "Minimizing gate propagation delay and dynamic power dissipation",
          "Selecting a high-level software operating system",
          "Designing user-friendly CSS flexbox styles",
          "Executing relational database outer joins"
        ],
        correct: "Minimizing gate propagation delay and dynamic power dissipation"
      };
    }

    if (lowerTitle.includes("verilog") || lowerTitle.includes("hdl") || lowerTitle.includes("rtl") || lowerTitle.includes("fpga") || lowerTitle.includes("synthesis")) {
      return {
        question: `When writing synthesizable hardware description code for "${lessonTitle}", what is standard practice?`,
        options: [
          "Using non-blocking assignments (<=) for sequential registers and blocking assignments (=) for combinational logic",
          "Including arbitrary software delay loops to throttle execution",
          "Rendering custom HTML components inside the user's web browser",
          "Establishing persistent socket connections using Node Express"
        ],
        correct: "Using non-blocking assignments (<=) for sequential registers and blocking assignments (=) for combinational logic"
      };
    }

    // 3. Web Dev / Software Keywords Check
    if (lowerTitle.includes("react") || lowerTitle.includes("next.js") || lowerTitle.includes("javascript") || lowerTitle.includes("frontend") || lowerTitle.includes("css") || lowerTitle.includes("dom") || lowerTitle.includes("component")) {
      return {
        question: `When building modern user interfaces for "${lessonTitle}", which concept is most important?`,
        options: [
          "Managing state changes efficiently and minimizing unnecessary re-renders",
          "Allocating physical registers inside the silicon processor",
          "Verifying the semiconductor doping concentration profiles",
          "Creating complex nested multi-table database indexes"
        ],
        correct: "Managing state changes efficiently and minimizing unnecessary re-renders"
      };
    }

    if (lowerTitle.includes("node") || lowerTitle.includes("express") || lowerTitle.includes("backend") || lowerTitle.includes("api") || lowerTitle.includes("server")) {
      return {
        question: `For a secure and high-performance backend API relating to "${lessonTitle}", what is highly recommended?`,
        options: [
          "Implementing proper request validation, token authentication, and error-handling middleware",
          "Storing all user passwords in plaintext inside public cookies",
          "Adding client-side visual hover effects directly in raw backend scripts",
          "Tuning the transistor gate threshold voltage"
        ],
        correct: "Implementing proper request validation, token authentication, and error-handling middleware"
      };
    }

    if (lowerTitle.includes("database") || lowerTitle.includes("sql") || lowerTitle.includes("mongodb") || lowerTitle.includes("postgres") || lowerTitle.includes("query")) {
      return {
        question: `Which technique is primarily used to optimize database query performance for "${lessonTitle}"?`,
        options: [
          "Creating appropriate database indexes on frequently filtered columns",
          "Re-compiling the system kernel on every query execution",
          "Modifying the client-side border radius values",
          "Increasing transistor dynamic gate sizing"
        ],
        correct: "Creating appropriate database indexes on frequently filtered columns"
      };
    }

    // 4. Fallback Generic Smart Synthesis
    return {
      question: `What is the core conceptual focus of the topic "${lessonTitle}"?`,
      options: [
        `Applying industry-standard best practices and patterns specific to "${lessonTitle}"`,
        "Deploying the system without prior local testing or verification",
        "Replacing all components with static placeholder designs",
        "Using outdated legacy methods that cause memory leaks"
      ],
      correct: `Applying industry-standard best practices and patterns specific to "${lessonTitle}"`
    };
  };

  const currentQuestion = currentLesson ? generateMockQuestion(currentLesson.title) : null;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden">
      
      {/* Scrollable Container wrapping Header, Intelligence, and Syllabus list */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar flex flex-col">
        
        {/* SCREEN HERO HEADER */}
        <div className="bg-white px-6 pt-10 pb-5 md:px-8 border-b border-slate-100 shadow-sm shrink-0">
          {/* Breadcrumb & Back Row */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shrink-0"
                title="Back to Courses"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                <button onClick={onBack} className="hover:text-slate-900 transition-colors">Courses</button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-extrabold">{course.shortTitle || course.title}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAiPanelOpen(true)}
              className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm border border-indigo-400/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none shrink-0"
              title={`Ask AI Mentor about ${course.title}`}
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span>✨ Ask AI Mentor</span>
            </button>
          </div>

          {/* Hero details flex row */}
          <div className="flex items-start justify-between gap-3.5">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-black text-sm leading-tight truncate">{course.title}</p>
                <p className="text-slate-400 text-[10.5px] leading-relaxed mt-1 font-medium">
                  Master curriculum from zero to confident. {course.modules.length} modules · {totalLessons} lessons
                </p>
              </div>
            </div>
            {secondaryActionButtonText && (
              <button 
                onClick={onSecondaryActionClick}
                className="h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 text-[10px] font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 border border-slate-100"
              >
                {secondaryActionButtonText.toLowerCase().includes("edit") ? (
                  <Edit3 className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                {secondaryActionButtonText}
              </button>
            )}
          </div>

          {/* Dynamic Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-4.5">
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100/50">
              <p className="text-slate-900 text-xs font-black">{progressPercent}%</p>
              <p className="text-slate-400 text-[9px] font-medium mt-0.5">Complete</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100/50">
              <p className="text-slate-900 text-xs font-black">{completedCount}/{totalLessons}</p>
              <p className="text-slate-400 text-[9px] font-medium mt-0.5">Lessons</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100/50">
              <p className="text-slate-900 text-xs font-black">~6h</p>
              <p className="text-slate-400 text-[9px] font-medium mt-0.5">Remaining</p>
            </div>
          </div>

          {/* Course progress bar slider */}
          <div className="mt-4 px-1">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-slate-900 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>
        </div>
        
        {/* Admin Intelligence Section */}
        {adminData && (
          <div className="px-6 py-6 md:px-8 bg-white border-b border-slate-100 flex flex-col gap-6 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-500" /> Admin Intelligence
              </h3>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-medium uppercase tracking-wider border border-blue-100">
                   {adminData.enrollments?.filter((e: any) => e.course_id === course.id).length || 0} Students
                 </span>
                 <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-medium uppercase tracking-wider border border-violet-100">
                   {(() => {
                     const enrolledStudentIds = adminData.enrollments?.filter((e: any) => e.course_id === course.id).map((e: any) => e.student_id);
                     const uniqueMentors = new Set(adminData.mapping?.filter((m: any) => enrolledStudentIds?.includes(m.student_id)).map((m: any) => m.mentor_id));
                     return uniqueMentors.size;
                   })()} Mentors
                 </span>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                 <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-3">Enrolled Student & Mentor Pairings</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {(() => {
                     const enrolledInCourse = adminData.enrollments?.filter((e: any) => e.course_id === course.id) || [];
                     
                     if (enrolledInCourse.length === 0) return <p className="text-[12px] text-slate-400 font-medium italic col-span-2">No students enrolled in this path yet.</p>;

                     return enrolledInCourse.map((enrollment: any) => {
                       const student = adminData.students?.find((s: any) => s.id === enrollment.student_id);
                       const mapping = adminData.mapping?.find((m: any) => m.student_id === enrollment.student_id);
                       const mentor = mapping ? adminData.mentors?.find((mn: any) => mn.id === mapping.mentor_id) : null;

                       return (
                         <div key={enrollment.id} className="flex flex-col gap-2 p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                 <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 overflow-hidden border border-white">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.id || enrollment.student_id}`} alt={student?.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                   <p className="text-[13px] font-medium text-slate-900">{student?.name || "Anonymous Student"}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">{enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : "New Enrollment"}</p>
                                 </div>
                              </div>
                              <div className="h-5 px-2 rounded-md bg-emerald-50 border border-emerald-100 flex items-center">
                                 <span className="text-[9px] font-black text-emerald-600 uppercase">{enrollment.progress_pct || 0}%</span>
                              </div>
                            </div>
                            
                            <div className="mt-2 pt-2 border-t border-slate-100/50 flex items-center gap-2">
                               <div className="w-5 h-5 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                                  <Users className="w-3 h-3 text-violet-600" />
                               </div>
                               <p className="text-[11px] font-semibold text-slate-500">
                                 Mentor: <span className={cn("ml-1 font-medium", mentor ? "text-violet-600" : "text-amber-500 italic")}>
                                   {mentor ? mentor.name : "Unassigned"}
                                 </span>
                               </p>
                            </div>
                         </div>
                       );
                     });
                   })()}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* SYLLABUS LISTING */}
        <div className="px-6 pt-5 pb-24 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <p className="text-slate-900 text-xs font-medium uppercase tracking-wider">Syllabus Curriculum</p>
          </div>

          <div className="relative">
            {/* Vertical Timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200" />

            <div className="space-y-1">
              {course.modules.map((mod, modIdx) => {
                const isExpanded = selectedModuleId === mod.id;
                const status = getModuleStatus(mod);
                const stats = getModuleStats(mod);

                return (
                  <div key={mod.id} className="relative">
                    {/* Module Toggle Header Card */}
                    <button
                      onClick={() => setSelectedModuleId(isExpanded ? null : mod.id)}
                      className="w-full flex items-start gap-3 py-2.5 text-left group"
                    >
                      {/* Circle timeline bullet */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={cn(
                            "w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all shadow-sm border",
                            status === "completed" 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : status === "current" 
                              ? "bg-emerald-600 border-emerald-600 text-white" 
                              : "bg-slate-100 border-slate-200 text-slate-400"
                          )}
                        >
                          {status === "completed" ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : status === "locked" ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Layers className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>

                      {/* Module title/descriptions */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between">
                          <p className={cn("text-xs font-black truncate", status === "locked" ? "text-slate-400" : "text-slate-800")}>
                            {mod.title}
                          </p>
                          <div className="flex items-center gap-2">
                            {status !== "locked" && (
                              <span className="text-[10px] font-medium text-slate-400">
                                {stats.done}/{stats.total}
                              </span>
                            )}
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className={cn("w-3.5 h-3.5", status === "locked" ? "text-slate-300" : "text-slate-400")} />
                            </motion.div>
                          </div>
                        </div>

                        <p className="text-[10.5px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                          {mod.description}
                        </p>

                        {/* Mini inline timeline progress slider */}
                        {status !== "locked" && (
                          <div className="mt-2.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className={cn("h-full rounded-full", status === "completed" ? "bg-emerald-500" : "bg-emerald-600")}
                              initial={{ width: 0 }}
                              animate={{ width: `${stats.percent}%` }}
                              transition={{ duration: 0.4, delay: modIdx * 0.05 }}
                            />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Expanded Lessons list */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="ml-[39px] mb-2"
                        >
                          <div className="space-y-1.5 py-1">
                            {mod.lessons.map((les, lesIdx) => {
                              const lessonCompleted = completedLessons.includes(les.id);
                              const isCurrent = les.id === currentLesson?.id;
                              const isLocked = !lessonCompleted && !isCurrent;

                              return (
                                <motion.div
                                  key={les.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: lesIdx * 0.04 }}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
                                    isCurrent 
                                      ? "bg-white shadow-sm border-slate-100 scale-[1.01]" 
                                      : lessonCompleted 
                                      ? "bg-slate-50 border-transparent" 
                                      : "bg-transparent border-transparent"
                                  )}
                                >
                                  {/* Bullet with checkmark/icon */}
                                  <div
                                    className={cn(
                                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border",
                                      lessonCompleted 
                                        ? "bg-emerald-100 border-emerald-100 text-emerald-600" 
                                        : isCurrent 
                                        ? "bg-emerald-600 border-emerald-600 text-white" 
                                        : "bg-slate-100 border-slate-200 text-slate-300"
                                    )}
                                  >
                                    {lessonCompleted ? (
                                      <Check className="w-3 h-3" />
                                    ) : isLocked ? (
                                      <Lock className="w-2.5 h-2.5" />
                                    ) : (
                                      <RenderLessonIcon type={les.type} />
                                    )}
                                  </div>

                                  {/* Lesson title and metadata details */}
                                  <div className="flex-1 min-w-0">
                                    <p className={cn("text-xs font-medium leading-tight", isLocked ? "text-slate-400" : isCurrent ? "text-slate-900" : "text-slate-600")}>
                                      {les.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-slate-400 font-semibold">{les.duration}</span>
                                      <span className="text-slate-300 text-xs">·</span>
                                      <span className="text-[10px] text-slate-400 font-semibold capitalize">{les.type}</span>
                                    </div>
                                  </div>

                                  {isCurrent && (
                                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                                      <Play className="w-3.5 h-3.5 text-white shrink-0 ml-0.5" />
                                    </div>
                                  )}
                                  {lessonCompleted && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certification badge teaser card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-slate-900 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-xs font-black">Earn Your Certificate</p>
              <p className="text-slate-400 text-[10.5px] mt-0.5 font-medium leading-relaxed">
                Complete all course syllabus modules to get your engineering certification.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg px-2.5 py-1 shrink-0 border border-white/5">
              <p className="text-amber-400 text-xs font-black">{progressPercent}%</p>
            </div>
          </motion.div>
        </div>
        
      </div>

      {/* Sticky footer button panel */}
      {(!hideMarkAsComplete || secondaryActionButtonText) && (
        <div className="bg-white px-6 py-3.5 pb-4 md:px-8 border-t border-slate-100 shrink-0 shadow-lg flex items-center justify-center gap-3 relative z-30">
          {secondaryActionButtonText && (
            <button
              onClick={onSecondaryActionClick}
              className={cn(
                hideMarkAsComplete ? "w-full bg-slate-900 hover:bg-slate-800 text-white" : "flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800",
                "py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium active:scale-[0.98] transition-all border border-slate-200/50"
              )}
            >
              {secondaryActionButtonText.toLowerCase().includes("edit") ? (
                <Edit3 className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              {secondaryActionButtonText}
            </button>
          )}
          {!hideMarkAsComplete && (
            <button
              onClick={() => {
                if (currentLesson && onToggleLesson && !isCurrentLessonCompleted) {
                  setShowKnowledgeCheck(true);
                } else if (onActionClick) {
                  onActionClick();
                } else {
                  onBack();
                }
              }}
              className={cn(secondaryActionButtonText ? "flex-1" : "w-full", "bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium active:scale-[0.98] transition-transform")}
            >
              {isCurrentLessonCompleted ? (
                 <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed</>
              ) : (
                 <><Check className="w-3.5 h-3.5" strokeWidth={3} /> Mark as complete</>
              )}
            </button>
          )}
        </div>
      )}

      {/* Knowledge Check Bottom Sheet */}
      {mounted && createPortal(
        <AnimatePresence>
          {showKnowledgeCheck && currentQuestion && currentLesson && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !showCoinAnimation && setShowKnowledgeCheck(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999]"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[1000] flex flex-col p-5 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] w-full max-h-[85vh]"
              >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 shrink-0" />
                
                <div className="flex items-center gap-2 mb-2 shrink-0">
                   <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-violet-600" />
                   </div>
                   <p className="text-[11px] font-black tracking-widest uppercase text-slate-400">Knowledge Check</p>
                </div>

                <h3 className="text-[15px] font-bold text-slate-900 mb-4 leading-tight shrink-0">{currentQuestion.question}</h3>

                <div className="overflow-y-auto max-h-[220px] my-2 pr-1 hidden-scrollbar shrink-0">
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === opt;
                      let bgClass = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                      let textClass = "text-slate-700";
                      
                      if (isSelected) {
                        if (isAnswerCorrect === true) {
                          bgClass = "bg-emerald-50 border-emerald-500";
                          textClass = "text-emerald-700 font-bold";
                        } else if (isAnswerCorrect === false) {
                          bgClass = "bg-rose-50 border-rose-500";
                          textClass = "text-rose-700 font-bold";
                        } else {
                          bgClass = "bg-blue-50 border-blue-500";
                          textClass = "text-blue-700 font-bold";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isAnswerCorrect) return;
                            setSelectedAnswer(opt);
                            setIsAnswerCorrect(null);
                          }}
                          className={cn("w-full text-left px-4 py-3.5 rounded-2xl border text-[13px] transition-all", bgClass, textClass)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isAnswerCorrect === false && (
                  <p className="text-rose-500 text-xs font-medium text-center mb-3 mt-1 flex items-center justify-center gap-1.5 animate-in slide-in-from-bottom-2 shrink-0">
                    <AlertCircle className="w-3.5 h-3.5" /> Not quite right. Try again!
                  </p>
                )}

                <button
                  disabled={!selectedAnswer || isAnswerCorrect === true}
                  onClick={() => {
                    if (selectedAnswer === currentQuestion.correct) {
                      setIsAnswerCorrect(true);
                      setShowCoinAnimation(true);
                      if (onCoinsEarned) onCoinsEarned(2);
                      
                      setTimeout(() => {
                        if (onToggleLesson) onToggleLesson(currentLesson.id);
                        setShowKnowledgeCheck(false);
                        setTimeout(() => {
                          setShowCoinAnimation(false);
                          setSelectedAnswer(null);
                          setIsAnswerCorrect(null);
                        }, 500);
                      }, 2000);
                    } else {
                      setIsAnswerCorrect(false);
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-4 rounded-2xl text-[13px] font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 mt-2"
                >
                  {isAnswerCorrect ? "Correct!" : "Submit Answer"}
                </button>

                <AnimatePresence>
                  {showCoinAnimation && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-t-[2rem]">
                      <motion.div
                        initial={{ opacity: 0, y: "100%", scale: 0.8 }}
                        animate={{ opacity: 1, y: "-100%", scale: 1.2 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-amber-400 text-white px-5 py-2.5 rounded-full shadow-2xl font-black text-base border-2 border-white/50 z-[60]"
                      >
                        <Coins className="w-5 h-5 fill-amber-100" /> +2
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Floating Course AI Assistant Panel */}
      {mounted && createPortal(
        <AnimatePresence>
          {isAiPanelOpen && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAiPanelOpen(false)}
                className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[990] sm:hidden"
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-[999] flex flex-col overflow-hidden font-inter"
              >
                {/* Panel Header */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2.5 min-w-0 z-10">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 border border-indigo-400/30 shadow-xs">
                      <Sparkles className="w-4 h-4 text-indigo-100" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                        AI Assistant
                      </h4>
                      <p className="text-[11px] font-medium text-slate-300 truncate">
                        Ask anything about {course.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAiPanelOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 z-10"
                    title="Close AI Assistant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages Window */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[180px] max-h-[280px] hidden-scrollbar bg-slate-50/50">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-6 px-2 space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1 border border-indigo-100">
                        <Bot className="w-5 h-5" />
                      </div>
                      <p className="text-slate-800 font-bold text-xs">Got a question about {course.shortTitle || course.title}?</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Ask me to explain any concept, lesson, or formula from this course!
                      </p>
                    </div>
                  ) : (
                    aiMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn("flex flex-col", msg.sender === "user" ? "items-end" : "items-start")}
                      >
                        <div className="flex items-end gap-2 max-w-[88%]">
                          {msg.sender === "ai" && (
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mb-1">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "px-3.5 py-2.5 rounded-2xl text-[12.5px] font-medium leading-relaxed",
                              msg.sender === "user"
                                ? "bg-slate-900 text-white rounded-tr-none shadow-xs"
                                : "bg-white text-slate-800 border border-slate-100 shadow-2xs"
                            )}
                          >
                            {msg.sender === "user" ? (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                              renderFormattedAiText(msg.text)
                            )}
                          </div>
                        </div>
                        <span className="text-[9.5px] font-medium text-slate-400 uppercase tracking-wider mt-1 px-1">
                          {msg.sender === "user" ? "You" : "Course AI"}
                        </span>
                      </div>
                    ))
                  )}

                  {isAiLoading && (
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="px-3.5 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium flex items-center gap-2 rounded-tl-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}

                  {aiErrorMessage && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-xs text-rose-600 font-medium">
                      {aiErrorMessage}
                    </div>
                  )}
                  <div ref={aiChatEndRef} />
                </div>

                {/* Suggested Questions */}
                <div className="px-3 py-2 bg-white border-t border-b border-slate-100 flex flex-wrap gap-1.5 shrink-0 max-h-[85px] overflow-y-auto hidden-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 w-full flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-indigo-500" /> Suggested for this course:
                  </span>
                  {suggestedQuestions.map((qText, qIdx) => (
                    <button
                      key={qIdx}
                      disabled={isAiLoading}
                      onClick={() => handleSendAiQuestion(qText)}
                      className="px-2.5 py-1 rounded-full border border-slate-200/80 bg-slate-50 text-[10.5px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95 text-left disabled:opacity-50"
                    >
                      {qText}
                    </button>
                  ))}
                </div>

                {/* Input Row */}
                <div className="p-3 bg-white shrink-0">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={aiInputQuery}
                      disabled={isAiLoading}
                      onChange={(e) => setAiInputQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendAiQuestion();
                        }
                      }}
                      placeholder={`Ask a question...`}
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 outline-none hover:bg-slate-50 focus-visible:ring-slate-900 transition-all h-9"
                    />
                    <Button
                      onClick={() => handleSendAiQuestion()}
                      disabled={isAiLoading || !aiInputQuery.trim()}
                      className={cn(
                        aiInputQuery.trim() && !isAiLoading
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-slate-100 text-slate-400",
                        "h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0 p-0 disabled:opacity-50"
                      )}
                    >
                      {isAiLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
