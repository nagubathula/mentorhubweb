"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Check, Lock, ChevronDown, Play, Code2, HelpCircle, 
  FolderOpen, BookOpen, Award, CheckCircle2, AlertCircle, Layers, Plus
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
}

export function CourseDetailsScreen({ 
  course, 
  onBack, 
  actionButtonText, 
  onActionClick,
  secondaryActionButtonText,
  onSecondaryActionClick
}: CourseDetailsScreenProps) {
  // State matching 'useState("m2")' or first module ID
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(course.modules[0]?.id || null);

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
  const getModuleStatus = (mod: ExtendedModule, idx: number) => {
    if (progressPercent === 100) return "completed";
    if (idx === 0) return "current";
    if (idx === 1 && progressPercent > 30) return "current";
    if (idx < Math.ceil(course.modules.length * (progressPercent / 100))) return "completed";
    return "locked";
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden">
      {/* SCREEN HERO HEADER: matches y9 white/gray visual theme */}
      <div className="bg-white px-5 pt-10 pb-5 border-b border-slate-100 shadow-sm shrink-0">
        {/* Back Button Row */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <p className="text-slate-800 text-xs font-bold flex-1">Course Details</p>
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
              className="h-8 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 border border-slate-100"
            >
              <Plus className="w-3 h-3" /> {secondaryActionButtonText}
            </button>
          )}
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4.5">
          <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100/50">
            <p className="text-slate-900 text-xs font-black">{progressPercent}%</p>
            <p className="text-slate-400 text-[9px] font-bold mt-0.5">Complete</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100/50">
            <p className="text-slate-900 text-xs font-black">{completedCount}/{totalLessons}</p>
            <p className="text-slate-400 text-[9px] font-bold mt-0.5">Lessons</p>
          </div>
          <div className="bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100/50">
            <p className="text-slate-900 text-xs font-black">~6h</p>
            <p className="text-slate-400 text-[9px] font-bold mt-0.5">Remaining</p>
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

      {/* SYLLABUS LISTING: Matches decompiled y9 middle layer scrolling layout */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">Syllabus Curriculum</p>
        </div>

        <div className="relative">
          {/* Vertical Timeline line matching left-[15px] in y9 */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200" />

          <div className="space-y-1">
            {course.modules.map((mod, modIdx) => {
              const isExpanded = selectedModuleId === mod.id;
              const status = getModuleStatus(mod, modIdx);
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
                            <span className="text-[10px] font-bold text-slate-400">
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
                            const lessonCompleted = lesIdx < stats.done;
                            const isCurrent = !lessonCompleted && lesIdx === stats.done && status !== "locked";
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
                                  <p className={cn("text-xs font-bold leading-tight", isLocked ? "text-slate-400" : isCurrent ? "text-slate-900" : "text-slate-600")}>
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
      <div className="bg-white px-5 py-3.5 pb-8 border-t border-slate-100 shrink-0 shadow-lg flex items-center justify-center gap-3">
        {secondaryActionButtonText && (
          <button
            onClick={onSecondaryActionClick}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all border border-slate-200/50"
          >
            {secondaryActionButtonText}
          </button>
        )}
        <button
          onClick={onActionClick || onBack}
          className={cn(secondaryActionButtonText ? "flex-1" : "w-full", "bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-transform")}
        >
          <Play className="w-3.5 h-3.5 fill-white" strokeWidth={2.5} /> {actionButtonText || "Continue Learning"}
        </button>
      </div>
    </div>
  );
}
