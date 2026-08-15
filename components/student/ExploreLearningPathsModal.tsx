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
  onUnenrollCourse?: (course: any) => void;
  enrollingCourseId?: string | null;
  unenrollingCourseId?: string | null;
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
  onUnenrollCourse,
  enrollingCourseId,
  unenrollingCourseId,
  title = "Explore Learning Paths",
  subtitle = "Choose from expert-designed course domains",
  actionButtonLabel,
}: ExploreLearningPathsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [courseToUnenroll, setCourseToUnenroll] = useState<any | null>(null);

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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      <div className="bg-[#F8FAFC] text-[#0F172A] rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-4xl md:max-w-5xl overflow-hidden shadow-2xl border border-[#E2E8F0] flex flex-col max-h-[94vh] h-[90vh] animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Pull handle bar */}
        <div className="w-full flex justify-center py-2.5 bg-white shrink-0 sm:hidden border-b border-[#E2E8F0]">
          <div className="w-12 h-1 rounded-full bg-slate-300"></div>
        </div>

        {/* Modal Top Header (Light Professional Theme) */}
        <div className="bg-white text-[#0F172A] px-5 pt-5 pb-4 md:px-7 md:pt-6 border-b border-[#E2E8F0] shrink-0 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E] shadow-2xs">
                <GraduationCap className="w-5.5 h-5.5 text-[#0F766E]" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#0F172A] tracking-tight leading-tight">
                  {title}
                </h3>
                <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-all active:scale-90"
              aria-label="Close modal"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <Search className="w-4.5 h-4.5 text-[#0F766E]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories or courses..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs md:text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* TOP DOMAIN NAVIGATION BAR (Horizontally Scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto hidden-scrollbar py-1 -mx-1 px-1">
            {/* "All Courses" Tab */}
            <button
              onClick={() => setSelectedCategoryId("All")}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 flex items-center gap-1.5 cursor-pointer",
                selectedCategoryId === "All"
                  ? "bg-[#0F766E] text-white shadow-sm font-bold scale-[1.02]"
                  : "bg-white text-[#475569] hover:bg-[#EFF6FF] hover:text-[#115E59] border border-[#E2E8F0]"
              )}
            >
              All Courses
              <span
                className={cn(
                  "text-[9.5px] px-1.5 py-0.2 rounded-full font-bold",
                  selectedCategoryId === "All" ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
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
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 flex items-center gap-1.5 cursor-pointer",
                    isSelected
                      ? "bg-[#0F766E] text-white shadow-sm font-bold scale-[1.02]"
                      : "bg-white text-[#475569] hover:bg-[#EFF6FF] hover:text-[#115E59] border border-[#E2E8F0]"
                  )}
                >
                  {renderCategoryIcon(cat.icon, "w-3.5 h-3.5")}
                  {cat.name}
                  <span
                    className={cn(
                      "text-[9.5px] px-1.5 py-0.2 rounded-full font-bold",
                      isSelected ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#475569]"
                    )}
                  >
                    {catCourseCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body / Courses Display (#F8FAFC) */}
        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-7 space-y-6 hidden-scrollbar bg-[#F8FAFC]">
          
          {/* Selected Domain Header */}
          {activeCategoryDetail && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E] shrink-0 shadow-2xs">
                  {renderCategoryIcon(activeCategoryDetail.icon, "w-5.5 h-5.5")}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0F172A] leading-tight">{activeCategoryDetail.name}</h4>
                  <p className="text-xs text-[#475569] font-medium leading-normal mt-0.5">
                    {activeCategoryDetail.description}
                  </p>
                </div>
              </div>

              <span className="bg-[#EFF6FF] text-[#0F766E] border border-[#0F766E]/20 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                {totalDisplayedCoursesCount} Available Courses
              </span>
            </div>
          )}

          {/* Empty Search Result State */}
          {filteredCategoriesWithCourses.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4 space-y-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#0F766E] mb-1">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-[#0F172A]">No courses found</p>
              <p className="text-xs text-[#475569] max-w-xs leading-relaxed font-medium">
                We couldn&apos;t find any course matching your search in the selected domain.
              </p>
              <Button
                onClick={handleClearSearch}
                className="mt-2 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
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
                <div key={cat.id} className="space-y-3">
                  {/* Category Section Header (Shown when 'All' domain is selected) */}
                  {selectedCategoryId === "All" && (
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E] text-xs">
                          {renderCategoryIcon(cat.icon, "w-3.5 h-3.5")}
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">{cat.name}</h4>
                      </div>
                      <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
                        {displayCourses.length} Courses
                      </span>
                    </div>
                  )}

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayCourses.map((course: any, idx: number) => {
                      const isEnrolled = enrolledSet.has(course.id) ||
                                         enrolledSet.has(course.title) ||
                                         (course.title && enrolledSet.has(course.title.toLowerCase())) ||
                                         (course.index_code && enrolledSet.has(course.index_code));
                      const modulesCount = course.modules?.length || course.content?.length || 0;
                      const lessonsCount =
                        course.modules?.reduce((acc: number, m: any) => {
                          return acc + (m.lessons?.length || m.topics?.length || 0);
                        }, 0) || 0;

                      const isEnrollingThis = enrollingCourseId === course.id || enrollingCourseId === course.title;
                      const isUnenrollingThis = unenrollingCourseId === course.id || unenrollingCourseId === course.title;

                      return (
                        <div
                          key={`${cat.id}-${course.id}-${idx}`}
                          className="bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-2xl p-4 md:p-5 flex flex-col justify-between gap-3.5 transition-all duration-200 group hover:shadow-md shadow-2xs"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 duration-200">
                                  {course.icon || renderCategoryIcon(cat.icon, "w-5 h-5")}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm md:text-base font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors truncate leading-snug">
                                    {course.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider">
                                      {cat.shortName}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="bg-[#F1F5F9] text-[#475569] text-[9.5px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#E2E8F0]">
                                      {course.difficulty || "Beginner"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Course Stats */}
                            <div className="flex items-center gap-2.5 text-[11px] font-medium text-[#64748B] bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]/80">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-[#64748B]" />
                                {modulesCount} modules
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-[#64748B]" />
                                {lessonsCount} lessons
                              </span>
                              {course.duration && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                                    {course.duration}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Course Description */}
                            <p className="text-xs text-[#475569] font-medium leading-relaxed line-clamp-2">
                              {course.description || "Master core concepts and build practical projects step by step."}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2.5 border-t border-[#E2E8F0] flex justify-end items-center gap-2">
                            {actionButtonLabel ? (
                              actionButtonLabel(course, isEnrolled)
                            ) : isEnrolled ? (
                              <div className="flex items-center gap-2">
                                <div className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                                  <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={3} /> Enrolled
                                </div>
                                {onUnenrollCourse && (
                                  <Button
                                    onClick={() => setCourseToUnenroll(course)}
                                    disabled={isUnenrollingThis}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-bold px-3 py-1.5 h-auto rounded-xl uppercase tracking-wider active:scale-95 transition-all shadow-2xs disabled:opacity-50"
                                  >
                                    {isUnenrollingThis ? "Unenrolling..." : "Unenroll"}
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <Button
                                onClick={() => onEnrollCourse(course)}
                                disabled={isEnrollingThis}
                                className="bg-[#0F766E] hover:bg-[#115E59] text-white text-[11px] font-bold px-4 py-2 h-auto rounded-xl uppercase tracking-wider active:scale-95 transition-all shadow-xs disabled:opacity-50"
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

        {/* Unenroll Confirmation Modal Dialog */}
        {courseToUnenroll && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">Unenroll from this course?</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Your course enrollment for &quot;{courseToUnenroll.title}&quot; will be removed.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setCourseToUnenroll(null)}
                  disabled={unenrollingCourseId === courseToUnenroll.id}
                  className="h-9 px-4 rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (onUnenrollCourse) {
                      await onUnenrollCourse(courseToUnenroll);
                    }
                    setCourseToUnenroll(null);
                  }}
                  disabled={unenrollingCourseId === courseToUnenroll.id}
                  className="h-9 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
                >
                  {unenrollingCourseId === courseToUnenroll.id ? "Unenrolling..." : "Unenroll"}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
