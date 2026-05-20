"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Check, Lock, ChevronDown, Play, Code2, HelpCircle, 
  FolderOpen, BookOpen, Award, CheckCircle2, AlertCircle, Layers, Plus, Users, Edit3, Brain, Coins
} from "lucide-react";
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

import { cn } from "@/lib/utils";
import React from "react";

// Lesson type icon renderer matching decompiled g helper inside y9
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

  useEffect(() => {
    setMounted(true);
  }, []);
  // State matching 'useState("m2")' or first module ID
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(course.modules[0]?.id || null);

  // Find the first lesson that is not completed to be the "current" one
  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentLesson = allLessons.find(l => !completedLessons.includes(l.id)) || allLessons[allLessons.length - 1];
  const isCurrentLessonCompleted = completedLessons.includes(currentLesson?.id);

  // Lesson aggregates matching l, c and u from decompiled y9
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Math.floor(totalLessons * (course.progress / 100));
  const progressPercent = course.progress;

  // Helper matching d in y9
  const getModuleStats = (mod: ExtendedModule) => {
    const total = mod.lessons.length;
    const done = Math.min(total, Math.max(0, Math.floor(total * (progressPercent / 100))));
    return {
      done,
      total,
      percent: total > 0 ? Math.round((done / total) * 100) : 0
    };
  };

  // Helper matching h in y9
  const getModuleStatus = (mod: ExtendedModule) => {
    const lessons = mod.lessons;
    const completedInModule = lessons.filter(l => completedLessons.includes(l.id)).length;
    
    if (completedInModule === lessons.length) return "completed";
    if (lessons.some(l => l.id === currentLesson?.id)) return "current";
    return "locked";
  };

  const generateMockQuestion = (lessonTitle: string) => {
    const lowerTitle = lessonTitle.toLowerCase();
    if (lowerTitle.includes("data") || lowerTitle.includes("analytics")) {
      return {
        question: `What is the primary focus of "${lessonTitle}"?`,
        options: ["Analyzing patterns and trends", "Designing user interfaces", "Writing backend APIs", "Configuring web servers"],
        correct: "Analyzing patterns and trends"
      };
    } else if (lowerTitle.includes("design") || lowerTitle.includes("ux")) {
      return {
        question: `What is a key principle in "${lessonTitle}"?`,
        options: ["User empathy and testing", "Database optimization", "Server deployment", "Algorithmic efficiency"],
        correct: "User empathy and testing"
      };
    } else {
      return {
        question: `Which of the following best describes "${lessonTitle}"?`,
        options: ["A core foundational concept", "An advanced deployment strategy", "A deprecated framework", "A social media trend"],
        correct: "A core foundational concept"
      };
    }
  };

  const currentQuestion = currentLesson ? generateMockQuestion(currentLesson.title) : null;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden">
      {/* SCREEN HERO HEADER: matches y9 white/gray visual theme */}
      <div className="bg-white px-5 pt-10 pb-5 border-b border-slate-100 shadow-sm shrink-0">
        {/* Breadcrumb & Back Row */}
        <div className="flex items-center gap-3 mb-4">
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

        {/* Hero flex columns */}
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
        <div className="px-5 py-6 bg-white border-b border-slate-100 flex flex-col gap-6 shrink-0">
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

      {/* SYLLABUS LISTING: Matches decompiled y9 middle layer scrolling layout */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <p className="text-slate-900 text-xs font-medium uppercase tracking-wider">Syllabus Curriculum</p>
        </div>

        <div className="relative">
          {/* Vertical Timeline line matching left-[15px] in y9 */}
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
                    {/* Circle timeline bullet matching w-[30px] h-[30px] */}
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

                  {/* Expanded Lessons list matching 'ml-[39px]' */}
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
                            // Calculate status matching completion mock
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
                                {/* Circle bullet with checkmark or lock indicator */}
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

        {/* Certification badge teaser overlay card */}
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

      {/* Sticky footer button panel matching decompiled y9 exactly */}
      {(!hideMarkAsComplete || secondaryActionButtonText) && (
        <div className="bg-white px-5 py-3.5 pb-4 border-t border-slate-100 shrink-0 shadow-lg flex items-center justify-center gap-3">
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

      {/* Knowledge Check Bottom Sheet using Portal to render on top of all stack frames */}
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
                            if (isAnswerCorrect) return; // Prevent changing after correct
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

                {/* +2 Coins Animation Overlay */}
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

    </div>
  );
}
