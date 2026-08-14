"use client";

import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  X,
  Search,
  BookOpen,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  Code,
  Monitor,
  BarChart3,
  Brain,
  Palette,
  Zap,
  Cpu,
  Bot,
  Shield,
  Wifi,
  Cloud,
  Database,
  Wrench,
  Smartphone,
  Radio,
  Building2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { courseCategories, CourseCategory, mentorCoursesCatalog } from "@/lib/mentorCoursesData";

export interface ExploreLearningPathsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: any[];
  enrolledCourseIds?: string[] | Set<string>;
  onEnrollCourse: (course: any) => void;
  enrollingCourseId?: string | null;
  title?: string;
  subtitle?: string;
  actionButtonLabel?: (course: any, isEnrolled: boolean) => React.ReactNode;
}

function renderCategoryIcon(iconName: string, className = "w-5 h-5") {
  switch (iconName) {
    case "Code": return <Code className={className} />;
    case "Monitor": return <Monitor className={className} />;
    case "BarChart3": return <BarChart3 className={className} />;
    case "Brain": return <Brain className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Shield": return <Shield className={className} />;
    case "Wifi": return <Wifi className={className} />;
    case "Cloud": return <Cloud className={className} />;
    case "Database": return <Database className={className} />;
    case "Wrench": return <Wrench className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Radio": return <Radio className={className} />;
    default: return <BookOpen className={className} />;
  }
}

export function ExploreLearningPathsModal({
  isOpen,
  onClose,
  courses,
  enrolledCourseIds = new Set(),
  onEnrollCourse,
  enrollingCourseId,
  title = "Explore Learning Paths",
  subtitle = "Choose from expert-designed course domains",
  actionButtonLabel,
}: ExploreLearningPathsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");

  const enrolledSet = useMemo(() => {
    if (enrolledCourseIds instanceof Set) return enrolledCourseIds;
    return new Set(enrolledCourseIds || []);
  }, [enrolledCourseIds]);

  // Combine passed courses or fallback to catalog
  const allCoursesList = useMemo(() => {
    const list = courses && courses.length > 0 ? courses : mentorCoursesCatalog;
    return list;
  }, [courses]);

  // Map courses to their respective domains/categories
  const mappedCategories = useMemo(() => {
    return courseCategories.map((cat) => {
      const catCourses = allCoursesList.filter((c: any) => {
        if (c.categoryId === cat.id) return true;
        if (c.categoryName && c.categoryName.toLowerCase() === cat.name.toLowerCase()) return true;
        if (c.category && c.category.toLowerCase() === cat.name.toLowerCase()) return true;

        // Fallback matching by title
        const t = (c.title || "").toLowerCase();
        if (cat.id === "cat-prog-lang") return ["python", "c", "c++", "java", "javascript"].some(k => t === k || t.startsWith(k + " "));
        if (cat.id === "cat-web-dev") return ["html & css", "react.js", "node.js", "full stack development"].some(k => t.includes(k));
        if (cat.id === "cat-data-science") return ["data analytics", "data science", "power bi", "excel"].some(k => t.includes(k));
        if (cat.id === "cat-ai-ml") return ["artificial intelligence", "machine learning", "deep learning", "generative ai", "computer vision", "natural language processing"].some(k => t.includes(k));
        if (cat.id === "cat-ui-ux") return ["ui design", "ux design", "figma", "graphic design", "design thinking"].some(k => t.includes(k));
        if (cat.id === "cat-embedded") return ["embedded systems", "embedded c", "microcontrollers", "arduino", "raspberry pi", "embedded linux"].some(k => t.includes(k));
        if (cat.id === "cat-vlsi") return ["vlsi", "verilog", "systemverilog", "fpga", "cmos", "rtl"].some(k => t.includes(k));
        if (cat.id === "cat-iot-robotics") return ["internet of things", "iot", "robotics", "sensors"].some(k => t.includes(k));
        if (cat.id === "cat-cybersec") return ["cybersecurity", "network security", "ethical hacking", "web security"].some(k => t.includes(k));
        if (cat.id === "cat-networking") return ["computer networks", "network administration", "wireless networking"].some(k => t.includes(k));
        if (cat.id === "cat-cloud-devops") return ["cloud computing", "aws", "azure", "devops", "docker", "kubernetes", "ci/cd"].some(k => t.includes(k));
        if (cat.id === "cat-databases") return ["database management", "sql", "mysql", "postgresql", "mongodb"].some(k => t.includes(k));
        if (cat.id === "cat-soft-dev") return ["software engineering", "object-oriented", "data structures", "software testing", "git & github"].some(k => t.includes(k));
        if (cat.id === "cat-mobile-dev") return ["android development", "flutter", "react native"].some(k => t.includes(k));
        if (cat.id === "cat-core-electronics") return ["digital electronics", "analog electronics", "signals & systems", "dsp", "communication systems", "control systems", "antenna", "rf", "pcb"].some(k => t.includes(k));
        if (cat.id === "cat-other-eng") return ["mechanical", "civil", "biotechnology", "aerospace"].some(k => t.includes(k));
        return false;
      });

      return {
        ...cat,
        courses: catCourses,
      };
    });
  }, [allCoursesList]);

  // Handle Search Filtering
  const activeSearchQuery = searchQuery.trim().toLowerCase();

  const filteredCategoriesWithCourses = useMemo(() => {
    return mappedCategories.map((cat) => {
      let matchingCourses = cat.courses;

      if (activeSearchQuery) {
        matchingCourses = cat.courses.filter((c: any) => {
          const titleMatch = (c.title || "").toLowerCase().includes(activeSearchQuery);
          const descMatch = (c.description || "").toLowerCase().includes(activeSearchQuery);
          const catNameMatch = cat.name.toLowerCase().includes(activeSearchQuery);
          const keywordMatch = Array.isArray(c.keywords) && c.keywords.some((k: string) => k.toLowerCase().includes(activeSearchQuery));
          return titleMatch || descMatch || catNameMatch || keywordMatch;
        });
      }

      return {
        ...cat,
        filteredCourses: matchingCourses,
      };
    }).filter((cat) => {
      if (selectedCategoryId !== "All" && cat.id !== selectedCategoryId) {
        return false;
      }
      if (activeSearchQuery) {
        // Show if category name matches or if it contains matching courses
        const catMatch = cat.name.toLowerCase().includes(activeSearchQuery);
        return catMatch || cat.filteredCourses.length > 0;
      }
      return cat.courses.length > 0;
    });
  }, [mappedCategories, selectedCategoryId, activeSearchQuery]);

  const activeCategoryDetail = useMemo(() => {
    if (selectedCategoryId === "All") return null;
    return courseCategories.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const totalDisplayedCoursesCount = useMemo(() => {
    return filteredCategoriesWithCourses.reduce((acc, cat) => acc + cat.filteredCourses.length, 0);
  }, [filteredCategoriesWithCourses]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategoryId("All");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      <div className="bg-[#0f172a] text-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full sm:max-w-4xl md:max-w-5xl overflow-hidden shadow-2xl border-t sm:border border-white/10 flex flex-col max-h-[94vh] h-[90vh] animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Pull handle bar */}
        <div className="w-full flex justify-center py-2 bg-[#0f172a] shrink-0 sm:hidden">
          <div className="w-12 h-1 rounded-full bg-white/20"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 pt-4 pb-3 md:px-7 md:pt-5 border-b border-white/10 shrink-0 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xs">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                  {title}
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-90"
              aria-label="Close modal"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories or courses..."
              className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/15 rounded-2xl text-xs md:text-sm text-white placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* TOP DOMAIN NAVIGATION BAR (Horizontally Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto hidden-scrollbar py-1 -mx-1 px-1">
            {/* "All" Tab */}
            <button
              onClick={() => setSelectedCategoryId("All")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5",
                selectedCategoryId === "All"
                  ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                  : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10"
              )}
            >
              All Courses
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-extrabold",
                  selectedCategoryId === "All" ? "bg-slate-200 text-slate-900" : "bg-white/15 text-slate-300"
                )}
              >
                {allCoursesList.length}
              </span>
            </button>

            {/* 16 Category Domain Tabs */}
            {courseCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              const catCourseCount = mappedCategories.find(m => m.id === cat.id)?.courses.length || cat.courseCount || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5",
                    isSelected
                      ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                      : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10"
                  )}
                >
                  {renderCategoryIcon(cat.icon, "w-3.5 h-3.5")}
                  {cat.name}
                  <span
                    className={cn(
                      "text-[9.5px] px-1.5 py-0.2 rounded-full font-extrabold",
                      isSelected ? "bg-slate-200 text-slate-900" : "bg-white/15 text-slate-300"
                    )}
                  >
                    {catCourseCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body / Courses Display */}
        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-7 space-y-6 hidden-scrollbar bg-slate-900/50">
          
          {/* Selected Domain Header (When a single domain is selected) */}
          {activeCategoryDetail && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md",
                    activeCategoryDetail.bgColor || "bg-indigo-600"
                  )}
                >
                  {renderCategoryIcon(activeCategoryDetail.icon, "w-6 h-6")}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight">{activeCategoryDetail.name}</h4>
                  <p className="text-xs text-slate-300 font-medium leading-normal mt-1">
                    {activeCategoryDetail.description}
                  </p>
                </div>
              </div>

              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0">
                {totalDisplayedCoursesCount} Available Courses
              </span>
            </div>
          )}

          {/* Empty Search Result State */}
          {filteredCategoriesWithCourses.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4 space-y-3 bg-white/5 rounded-3xl border border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-slate-400 mb-1">
                <Search className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-white">No courses found</p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
                We couldn&apos;t find any course matching your search in the selected domain.
              </p>
              <Button
                onClick={handleClearSearch}
                className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Search
              </Button>
            </div>
          ) : (
            /* Render Courses grouped by Domain */
            filteredCategoriesWithCourses.map((cat) => {
              const displayCourses = cat.filteredCourses;
              if (displayCourses.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-3.5">
                  {/* Category Section Header (Shown when 'All' domain is selected or searching) */}
                  {selectedCategoryId === "All" && (
                    <div className="flex items-center justify-between pb-1 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs",
                            cat.bgColor || "bg-indigo-600"
                          )}
                        >
                          {renderCategoryIcon(cat.icon, "w-4 h-4")}
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{cat.name}</h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {displayCourses.length} Courses
                      </span>
                    </div>
                  )}

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayCourses.map((course: any) => {
                      const isEnrolled = enrolledSet.has(course.id) || enrolledSet.has(course.title);
                      const modulesCount = course.modules?.length || course.content?.length || 0;
                      const lessonsCount =
                        course.modules?.reduce((acc: number, m: any) => {
                          return acc + (m.lessons?.length || m.topics?.length || 0);
                        }, 0) || 0;

                      const isEnrollingThis = enrollingCourseId === course.id;

                      return (
                        <div
                          key={course.id}
                          className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 md:p-5 flex flex-col justify-between gap-3.5 transition-all duration-200 group hover:bg-white/[0.07] shadow-sm"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex gap-3 min-w-0">
                                <div
                                  className={cn(
                                    "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-sm transition-transform group-hover:scale-105 duration-300",
                                    course.bgColor || cat.bgColor || "bg-indigo-500"
                                  )}
                                >
                                  {course.icon || renderCategoryIcon(cat.icon, "w-5.5 h-5.5")}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm md:text-base font-bold text-white truncate leading-snug">
                                    {course.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                      {cat.shortName}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                    <span className="bg-white/10 text-slate-300 text-[9.5px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                      {course.difficulty || "Beginner"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Course Stats */}
                            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                {modulesCount} modules
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                {lessonsCount} lessons
                              </span>
                              {course.duration && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    {course.duration}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Course Description */}
                            <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
                              {course.description || "Master core concepts and build practical projects step by step."}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 border-t border-white/10 flex justify-end items-center">
                            {actionButtonLabel ? (
                              actionButtonLabel(course, isEnrolled)
                            ) : isEnrolled ? (
                              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
                                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} /> Enrolled
                              </div>
                            ) : (
                              <Button
                                onClick={() => onEnrollCourse(course)}
                                disabled={isEnrollingThis}
                                className="bg-white hover:bg-slate-100 text-slate-900 text-[11px] font-bold px-5 py-2.5 h-auto rounded-xl uppercase tracking-wider active:scale-95 transition-all shadow-sm disabled:opacity-50"
                              >
                                {isEnrollingThis ? "Enrolling..." : "+ Enroll"}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
