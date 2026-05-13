"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Plus, Pencil, Trash2, Send, ChevronRight, X, Check, 
  BookOpen, Clock, Activity, Target, Settings, ArrowRight, ArrowLeft, 
  Layers, BookMarked, Download, Upload, ChevronDown, CheckCircle2, 
  AlertCircle, FileSpreadsheet, Play, Code2, HelpCircle, FolderOpen, Save, Eye
} from "lucide-react";
import React from "react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { mentorCoursesCatalog } from "@/lib/mentorCoursesData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CourseDetailsScreen } from "@/components/admin/CourseDetailsScreen";

const supabase = createClient();

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

// Helper to map and inject enabled: true property to modules/lessons to match decompiler 'l5' exactly
function l5(c: any): ExtendedCourse {
  return {
    id: c.id,
    title: c.title,
    shortTitle: c.shortTitle || c.title.slice(0, 15),
    description: c.description || "",
    category: c.category || "General",
    difficulty: c.difficulty || "Beginner",
    duration: c.duration || "10 hours",
    enrolled: c.enrolled ?? false,
    progress: c.progress || 0,
    color: c.color || "text-emerald-600",
    bgColor: c.bgColor || "bg-emerald-500",
    icon: c.icon || <BookOpen className="w-5 h-5" />,
    modules: (c.modules || c.content || []).map((m: any) => {
      const dbLessons = m.lessons || (m.topics || []).map((topicName: string, tIdx: number) => ({
        id: `${m.id || 'm'}-l-${tIdx}`,
        title: topicName,
        duration: "10 min",
        type: "video",
        enabled: true
      }));

      return {
        id: m.id || `m-${Date.now()}-${Math.random()}`,
        title: m.title || "Untitled Module",
        description: m.description || "",
        color: m.color || "bg-emerald-500",
        enabled: m.enabled ?? true,
        lessons: dbLessons.map((l: any) => ({
          id: l.id || `l-${Date.now()}-${Math.random()}`,
          title: l.title || "Untitled Lesson",
          duration: l.duration || "10 min",
          type: l.type || "video",
          enabled: l.enabled ?? true
        }))
      };
    })
  };
}

// Lesson type icon renderer matching decompiled o5
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

export function MentorCourses() {
  const [courses, setCourses] = useState<ExtendedCourse[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Customizer/Editor UI states matching decompiler bD variables
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [parsedModules, setParsedModules] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Assign modal state
  const [assigningCourse, setAssigningCourse] = useState<ExtendedCourse | null>(null);
  const [assignStep, setAssignStep] = useState<"preview" | "selectStudent">("preview");
  const [isEditingCourse, setIsEditingCourse] = useState(false);

  // Review Queue state declarations
  const [activeTab, setActiveTab] = useState<"builder" | "queue">("builder");
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);
  const [submissionRating, setSubmissionRating] = useState(5);
  const [submissionFeedback, setSubmissionFeedback] = useState("");

  const fetchReviewQueue = async () => {
    try {
      const { data } = await supabase
        .from('review_queue')
        .select('*, student:profiles!review_queue_student_id_fkey(*)')
        .order('id', { ascending: false });
      if (data) {
        setReviewQueue(data);
      }
    } catch (e) {
      console.error("Error fetching review queue:", e);
    }
  };

  const handleCompleteSubmissionReview = async (status: "Approved" | "Rejected") => {
    if (!selectedSubmission) return;
    try {
      const { error } = await supabase
        .from('review_queue')
        .update({
          status,
          feedback: submissionFeedback.trim() || null,
          rating: submissionRating,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedSubmission.id);

      if (error) {
        alert("Error updating review submission: " + error.message);
      } else {
        setIsSubmitReviewOpen(false);
        setSelectedSubmission(null);
        fetchReviewQueue();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch courses from Supabase
    const { data: dbCourses } = await supabase.from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    // Combine database courses with mock ones if they aren't duplicate
    const localCatalog = mentorCoursesCatalog;
    const combined = [
      ...(dbCourses || []).map(c => ({
        ...c,
        modules: (c as any).content || []
      })),
      ...localCatalog.filter(c => !(dbCourses || []).some(sc => sc.title === c.title))
    ];

    setCourses(combined.map(l5));

    // Fetch students assigned to this mentor
    const { data: mappings } = await supabase.from('mapping')
      .select('student:profiles!mapping_student_id_fkey(*)')
      .eq('mentor_id', session.user.id);
    
    setAssignedStudents(mappings?.map(m => m.student).filter(Boolean) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchReviewQueue();
  }, [fetchAllData]);

  const activeCourse = courses.find(c => c.id === selectedCourseId);

  // Core modification wrappers matching decompiler: I, W, H, _, le, R
  const I = (courseId: string, updates: Partial<ExtendedCourse>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
  };

  const W = (courseId: string, moduleId: string, updates: Partial<ExtendedModule>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c,
      modules: c.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
    } : c));
  };

  const H = (courseId: string, moduleId: string, lessonId: string, updates: Partial<ExtendedLesson>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? {
      ...c,
      modules: c.modules.map(m => m.id === moduleId ? {
        ...m,
        lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
      } : m)
    } : c));
  };

  const _ = (courseId: string, moduleId: string) => {
    const activeMod = courses.find(c => c.id === courseId)?.modules.find(m => m.id === moduleId);
    if (!activeMod) return;

    const newLesson: ExtendedLesson = {
      id: `les-${Date.now()}`,
      title: "New Lesson",
      duration: "10 min",
      type: "video"
    };

    W(courseId, moduleId, {
      lessons: [...activeMod.lessons, newLesson]
    });
  };

  const le = (courseId: string, moduleId: string, lessonId: string) => {
    const activeMod = courses.find(c => c.id === courseId)?.modules.find(m => m.id === moduleId);
    if (activeMod) {
      W(courseId, moduleId, {
        lessons: activeMod.lessons.filter(l => l.id !== lessonId)
      });
    }
  };

  // Perform save to Supabase database
  const handleSaveToDatabase = async () => {
    if (!activeCourse) return;
    setIsSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    const payload = {
      title: activeCourse.title,
      description: activeCourse.description,
      difficulty: activeCourse.difficulty,
      duration: activeCourse.duration,
      category: activeCourse.category,
      content: activeCourse.modules, // Save modified syllabus
      mentor_id: session?.user?.id,
      status: 'Active'
    };

    let err;
    // If course ID is a UUID, update it. Otherwise, insert a new customized course in DB
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(activeCourse.id);
    
    if (isUUID) {
      const { error } = await supabase.from('courses').update(payload).eq('id', activeCourse.id);
      err = error;
    } else {
      const { error } = await supabase.from('courses').insert({
        ...payload,
        index_code: activeCourse.shortTitle
      });
      err = error;
    }

    setIsSaving(false);
    if (err) {
      alert("Error saving course syllabus: " + err.message);
    } else {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      fetchAllData();
    }
  };

  // Decompiled CSV parsing algorithm exactly recreated
  const parseCSV = (text: string) => {
    const rows = text.trim().split("\n");
    if (rows.length < 2) {
      setErrors(["File is empty"]);
      return;
    }
    const modulesAcc: any[] = [];
    const parseErrors: string[] = [];
    const allowedTypes = ["video", "exercise", "quiz", "project", "reading"];

    for (let i = 1; i < rows.length; i++) {
      const columns: string[] = [];
      let cell = "";
      let inQuotes = false;
      
      for (const char of rows[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          columns.push(cell.trim());
          cell = "";
        } else {
          cell += char;
        }
      }
      columns.push(cell.trim());

      const [modTitle, modDesc, lesTitle, lesDuration, lesType] = columns;
      if (!modTitle || !lesTitle) {
        parseErrors.push(`Row ${i + 1}: Missing module or lesson title`);
        continue;
      }

      let existingMod = modulesAcc.find(m => m.title === modTitle);
      if (!existingMod) {
        existingMod = {
          title: modTitle,
          description: modDesc || "",
          lessons: []
        };
        modulesAcc.push(existingMod);
      }

      existingMod.lessons.push({
        title: lesTitle,
        duration: lesDuration || "10 min",
        type: allowedTypes.includes(lesType) ? lesType : "video"
      });
    }

    setParsedModules(modulesAcc);
    setErrors(parseErrors);
  };

  // Decompiled JSON parsing algorithm exactly recreated
  const parseJSON = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      const modulesList = parsed.modules || parsed;
      if (!Array.isArray(modulesList)) {
        setErrors(["JSON must be an array or contain a 'modules' array"]);
        return;
      }
      const modulesAcc: any[] = [];
      const parseErrors: string[] = [];

      modulesList.forEach((m, idx) => {
        if (!m.title) {
          parseErrors.push(`Module ${idx + 1}: Missing title`);
          return;
        }
        const lessons = (m.lessons || []).filter((l: any) => l.title).map((l: any) => ({
          title: l.title,
          duration: l.duration || "10 min",
          type: l.type || "video"
        }));
        modulesAcc.push({
          title: m.title,
          description: m.description || "",
          lessons
        });
      });

      setParsedModules(modulesAcc);
      setErrors(parseErrors);
    } catch {
      setErrors(["Invalid JSON format"]);
    }
  };

  const handleFileReader = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (file.name.endsWith(".json")) {
        parseJSON(text);
      } else {
        parseCSV(text);
      }
    };
    reader.readAsText(file);
  };

  // Confirm adding custom uploaded modules to current course content
  const handleAddUploadedModules = () => {
    if (!selectedCourseId || parsedModules.length === 0) return;
    const mappedNewMods: ExtendedModule[] = parsedModules.map((m, idx) => ({
      id: `up-m${Date.now()}-${idx}`,
      title: m.title,
      description: m.description,
      color: "bg-emerald-500",
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      enabled: true,
      lessons: m.lessons.map((l: any, lIdx: number) => ({
        id: `up-l${Date.now()}-${idx}-${lIdx}`,
        title: l.title,
        duration: l.duration,
        type: l.type,
        enabled: true
      }))
    }));

    if (activeCourse) {
      I(selectedCourseId, {
        modules: [...activeCourse.modules, ...mappedNewMods]
      });
    }

    setParsedModules([]);
    setErrors([]);
    setUploadPanelOpen(false);
  };

  // Download template action helper
  const handleDownloadTemplate = () => {
    const content = `module_title,module_description,lesson_title,lesson_duration,lesson_type\nModule 1,Description here,Lesson 1,12 min,video\nModule 1,Description here,Lesson 2,15 min,exercise\nModule 2,Another module,Lesson 3,18 min,video\nModule 2,Another module,Quiz,8 min,quiz`;
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "course_index_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Course enrollment assignment
  const handleAssignCourse = async (studentId: string) => {
    if (!assigningCourse) return;
    setIsSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    let actualCourseId = assigningCourse.id;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(actualCourseId);

    if (!isUUID) {
      // Must create a course record in DB first if mock course is being assigned
      const payload = {
        title: assigningCourse.title,
        index_code: assigningCourse.shortTitle,
        description: assigningCourse.description,
        content: assigningCourse.modules,
        mentor_id: session?.user?.id,
        status: 'Active'
      };

      const { data: newCourse, error } = await supabase.from('courses').insert(payload).select().single();
      if (error) {
        setIsSaving(false);
        alert("Error mapping catalog course: " + error.message);
        return;
      }
      actualCourseId = newCourse.id;
    }

    const { error: enrollErr } = await supabase.from('enrollments').insert({
      student_id: studentId,
      course_id: actualCourseId,
      status: 'Active'
    });

    setIsSaving(false);
    if (enrollErr) {
      alert("Error assigning course to student: " + enrollErr.message);
    } else {
      alert("Success! Course assigned to student.");
      setAssigningCourse(null);
      fetchAllData();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden -mx-4 -my-4 min-h-[92vh]">
      <AnimatePresence mode="wait">
        {!selectedCourseId ? (
          // SCREEN 1: Course list manager screen matching decompiled bD catalog view
          <motion.div 
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col h-full overflow-y-auto"
          >
            {/* Premium Emerald Header Panel */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 pt-10 pb-8 text-white relative shadow-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight leading-none">Course Architect</h2>
                    <p className="text-[11px] text-emerald-100 font-medium mt-1">Design customizable student index structures</p>
                  </div>
                </div>
                <Button 
                  size="icon"
                  onClick={() => {
                    const newId = `c-${Date.now()}`;
                    const newCourse: ExtendedCourse = {
                      id: newId,
                      title: "New Custom Path",
                      shortTitle: "New Path",
                      description: "Custom path description details",
                      color: "text-emerald-600",
                      bgColor: "bg-emerald-500",
                      icon: <BookOpen className="w-5 h-5" />,
                      category: "Engineering",
                      difficulty: "Beginner",
                      duration: "24 hours",
                      enrolled: false,
                      progress: 0,
                      modules: []
                    };
                    setCourses(prev => [newCourse, ...prev]);
                    setSelectedCourseId(newId);
                  }}
                  className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 border-0 text-white"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex bg-white/10 p-1.5 rounded-2xl mt-4 max-w-sm mx-auto">
                <button
                  onClick={() => setActiveTab("builder")}
                  className={cn(
                    "flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all",
                    activeTab === "builder" ? "bg-white text-emerald-900 shadow" : "text-white/80 hover:text-white"
                  )}
                >
                  Syllabus Builder
                </button>
                <button
                  onClick={() => setActiveTab("queue")}
                  className={cn(
                    "flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all",
                    activeTab === "queue" ? "bg-white text-emerald-900 shadow" : "text-white/80 hover:text-white"
                  )}
                >
                  Review Queue ({reviewQueue.filter(r => r.status === 'Pending').length})
                </button>
              </div>
            </div>

            {/* Courses list matching mobile styling exactly */}
            {activeTab === "builder" && (
              <div className="px-5 py-6 space-y-3 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-xs font-semibold">Loading curriculum path...</p>
                  </div>
                ) : (
                  courses.map((course, idx) => {
                    const activeModCount = course.modules.filter(m => m.enabled).length;
                    const totalLessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
                      >
                        <div 
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setIsEditingCourse(false);
                          }}
                          className="flex-1 flex items-center gap-3.5 cursor-pointer min-w-0"
                        >
                          <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[13px] font-bold text-slate-900 truncate leading-tight group-hover:text-emerald-600 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-slate-400 text-[10px] mt-1 font-medium">
                              {activeModCount}/{course.modules.length} modules · {totalLessonCount} lessons · {course.difficulty}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            onClick={() => {
                              setAssigningCourse(course);
                              setAssignStep("preview");
                            }}
                            size="sm"
                            className="h-8 rounded-lg text-[10px] bg-slate-900 text-white hover:bg-slate-800"
                          >
                            <Send className="w-3 h-3 mr-1" /> Assign
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setIsEditingCourse(false);
                            }}
                            className="w-8 h-8 rounded-lg text-slate-300 hover:text-slate-900 hover:bg-slate-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "queue" && (
              <div className="px-5 py-6 space-y-3.5 flex-1 overflow-y-auto">
                {reviewQueue.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm font-bold">Review queue is empty!</p>
                    <p className="text-xs text-slate-400 mt-1">Students haven't submitted capstones yet.</p>
                  </div>
                ) : (
                  reviewQueue.map((item, index) => {
                    const studentName = item.student?.name || item.student?.email?.split('@')[0] || "Student";
                    const isPending = item.status === "Pending" || item.status === "pending";

                    return (
                      <Card key={item.id} className="p-5 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide",
                              isPending ? "bg-amber-100 text-amber-700 border border-amber-200" :
                              item.status === "Approved" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                              "bg-rose-100 text-rose-700 border border-rose-200"
                            )}>
                              {item.status}
                            </span>
                            <h4 className="text-sm font-black text-slate-800 mt-2">{item.project_title}</h4>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Submitted by {studentName}</p>
                          </div>
                          
                          {item.submission_link && (
                            <a
                              href={item.submission_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-500 hover:underline font-bold flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl shrink-0"
                            >
                              View Submission &rarr;
                            </a>
                          )}
                        </div>

                        {item.feedback && (
                          <div className="mt-4 p-3 bg-slate-50 border rounded-xl">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Your Feedback</p>
                            <p className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">"{item.feedback}"</p>
                            {item.rating && (
                              <div className="flex gap-0.5 mt-2 text-amber-400 text-sm">
                                {Array.from({ length: item.rating }).map((_, i) => <span key={i}>★</span>)}
                              </div>
                            )}
                          </div>
                        )}

                        {isPending && (
                          <div className="flex gap-2 border-t border-slate-50 pt-4 mt-4">
                            <Button
                              onClick={() => {
                                setSelectedSubmission(item);
                                setSubmissionFeedback("");
                                setSubmissionRating(5);
                                setIsSubmitReviewOpen(true);
                              }}
                              className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                            >
                              Review Submission
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        ) : !isEditingCourse ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50"
          >
            <CourseDetailsScreen 
              course={activeCourse!} 
              onBack={() => setSelectedCourseId(null)} 
              actionButtonText="Assign to Student"
              onActionClick={() => {
                setAssigningCourse(activeCourse!);
                setAssignStep("selectStudent");
              }}
              secondaryActionButtonText="Customize Syllabus"
              onSecondaryActionClick={() => setIsEditingCourse(true)}
            />
          </motion.div>
        ) : (
          // SCREEN 3: Edit Course Screen matching decompiler bD screen with exact inputs, templates and module lists
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50"
          >
            {/* Header with Save progress bar status */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-4 pb-4 text-white shrink-0 shadow-md">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsEditingCourse(false);
                    setExpandedModuleId(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <p className="text-white text-xs font-bold">Edit Course Path</p>
                
                <button
                  onClick={handleSaveToDatabase}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-[11px] font-bold active:scale-95 transition-transform flex items-center gap-1.5"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable editor fields and modules layout */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
              
              {/* Core metadata editor form */}
              {activeCourse && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-bold mb-1.5 block">Course Title</label>
                    <input
                      type="text"
                      value={activeCourse.title}
                      onChange={(e) => I(activeCourse.id, { title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-bold mb-1.5 block">Description</label>
                    <textarea
                      value={activeCourse.description}
                      onChange={(e) => I(activeCourse.id, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-400 text-[10px] uppercase font-bold mb-1.5 block">Difficulty</label>
                      <select
                        value={activeCourse.difficulty}
                        onChange={(e: any) => I(activeCourse.id, { difficulty: e.target.value })}
                        className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-bold outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] uppercase font-bold mb-1.5 block">Duration</label>
                      <input
                        type="text"
                        value={activeCourse.duration}
                        onChange={(e) => I(activeCourse.id, { duration: e.target.value })}
                        className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] uppercase font-bold mb-1.5 block">Category</label>
                      <input
                        type="text"
                        value={activeCourse.category}
                        onChange={(e) => I(activeCourse.id, { category: e.target.value })}
                        className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Status active module summary banner */}
              {activeCourse && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-emerald-900 text-xs font-bold">
                        {activeCourse.modules.filter(m => m.enabled).length}/{activeCourse.modules.length} active modules
                      </p>
                      <p className="text-emerald-600 text-[10px] font-medium mt-0.5">
                        {activeCourse.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.enabled).length, 0)} lessons enabled
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Course Index Accordion matching decompiler bD toggle */}
              <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => {
                    setUploadPanelOpen(!uploadPanelOpen);
                    setParsedModules([]);
                    setErrors([]);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition-all",
                    uploadPanelOpen ? "bg-emerald-600 text-white" : "text-slate-700 bg-white hover:bg-slate-50"
                  )}
                >
                  <Upload className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">Upload Course Index</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform shrink-0", uploadPanelOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {uploadPanelOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-white"
                    >
                      <div className="p-4 border-t border-slate-50 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-[10px] font-medium">Upload CSV or JSON with custom modules schema</p>
                          <button
                            onClick={handleDownloadTemplate}
                            className="text-emerald-600 text-[10px] font-bold flex items-center gap-1 hover:underline"
                          >
                            <Download className="w-3 h-3" /> Template
                          </button>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFileReader(file);
                          }}
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer",
                            dragOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <FileSpreadsheet className={cn("w-8 h-8 mx-auto mb-2", dragOver ? "text-emerald-500" : "text-slate-300")} />
                          <p className="text-slate-500 text-[11px] font-bold">Drag & drop course index, or browse</p>
                          
                          <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl cursor-pointer mt-3 active:scale-95 transition-transform">
                            <Upload className="w-3 h-3" /> Browse Files
                            <input
                              type="file"
                              accept=".csv,.json"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileReader(file);
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Error logger matching mobile list */}
                        {errors.length > 0 && (
                          <div className="bg-red-50 rounded-xl p-3 border border-red-100 space-y-1">
                            {errors.slice(0, 3).map((err, uIdx) => (
                              <p key={uIdx} className="text-red-600 text-[10px] font-medium flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {err}
                              </p>
                            ))}
                            {errors.length > 3 && (
                              <p className="text-red-400 text-[10px] font-bold pl-4">+{errors.length - 3} more errors</p>
                            )}
                          </div>
                        )}

                        {/* Parser success state indicator */}
                        {parsedModules.length > 0 && (
                          <div className="space-y-3">
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-center justify-between">
                              <p className="text-emerald-800 text-[10px] font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                {parsedModules.length} modules · {parsedModules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons ready
                              </p>
                            </div>

                            <div className="max-h-28 overflow-y-auto border border-slate-100 rounded-xl p-2.5 bg-slate-50 space-y-1.5">
                              {parsedModules.map((pm, uIdx) => (
                                <div key={uIdx} className="bg-white rounded-lg px-2.5 py-1.5 flex justify-between items-center text-[10px] font-bold text-slate-700">
                                  <span className="truncate flex-1 pr-2">{pm.title}</span>
                                  <span className="text-slate-400 shrink-0">({pm.lessons.length} lessons)</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2 shrink-0 pt-1">
                              <Button
                                onClick={handleAddUploadedModules}
                                className="flex-1 h-9 rounded-xl text-[10px] font-bold bg-slate-900 text-white hover:bg-slate-800"
                              >
                                Add {parsedModules.length} Modules
                              </Button>
                              <Button
                                onClick={() => {
                                  setParsedModules([]);
                                  setErrors([]);
                                }}
                                variant="outline"
                                className="h-9 px-4 rounded-xl text-[10px] font-bold text-slate-500"
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion module editor list section */}
              {activeCourse && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Syllabus Index</p>
                    <Button
                      onClick={() => {
                        const newModId = `mod-${Date.now()}`;
                        const newModule: ExtendedModule = {
                          id: newModId,
                          title: "New Custom Module",
                          description: "Custom module content overview",
                          color: "bg-emerald-500",
                          icon: <Layers className="w-4 h-4" />,
                          enabled: true,
                          lessons: []
                        };
                        I(activeCourse.id, {
                          modules: [...activeCourse.modules, newModule]
                        });
                        setExpandedModuleId(newModId);
                      }}
                      variant="ghost"
                      className="h-7 text-emerald-600 text-[10.5px] font-bold px-2 rounded-lg hover:bg-emerald-50"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Module
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {activeCourse.modules.map((mod, modIdx) => {
                      const isExpanded = expandedModuleId === mod.id;

                      return (
                        <div
                          key={mod.id}
                          className={cn(
                            "bg-white rounded-2xl border overflow-hidden transition-all duration-200",
                            mod.enabled ? "border-slate-100" : "border-slate-100 opacity-55"
                          )}
                        >
                          {/* Module summary line */}
                          <div className="flex items-center gap-2.5 px-4 py-3.5">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10.5px] font-bold shrink-0">
                              {modIdx + 1}
                            </div>

                            <button
                              onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                              className="flex-1 text-left min-w-0"
                            >
                              <p className="text-slate-900 text-xs font-bold truncate">{mod.title}</p>
                              <p className="text-slate-400 text-[10px] font-medium mt-0.5">{mod.lessons.length} lessons</p>
                            </button>

                            <button
                              onClick={() => W(activeCourse.id, mod.id, { enabled: !mod.enabled })}
                              className="shrink-0 p-1 rounded-lg hover:bg-slate-50"
                            >
                              {mod.enabled ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <X className="w-5 h-5 text-slate-300" />
                              )}
                            </button>

                            <button
                              onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                              className="shrink-0 p-1"
                            >
                              <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", isExpanded && "rotate-180")} />
                            </button>
                          </div>

                          {/* Expanded lessons list mapping exactly to bD detail workflow */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="bg-slate-50/55 border-t border-slate-50 px-4 py-3 space-y-2"
                              >
                                {mod.lessons.map((les) => {
                                  const isEditing = editingLessonId === les.id;

                                  return (
                                    <div
                                      key={les.id}
                                      className={cn(
                                        "flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-100 transition-all shadow-none",
                                        les.enabled ? "" : "opacity-50 bg-slate-50"
                                      )}
                                    >
                                      <RenderLessonIcon type={les.type} />

                                      {isEditing ? (
                                        <input
                                          value={les.title}
                                          onChange={(e) => H(activeCourse.id, mod.id, les.id, { title: e.target.value })}
                                          onBlur={() => setEditingLessonId(null)}
                                          className="flex-1 px-2 py-1 bg-slate-50 rounded-lg text-xs font-medium text-slate-900 outline-none border border-slate-200 focus:border-emerald-300"
                                          autoFocus
                                          onKeyDown={(e) => e.key === "Enter" && setEditingLessonId(null)}
                                        />
                                      ) : (
                                        <p className="flex-1 text-slate-800 text-xs font-bold truncate">{les.title}</p>
                                      )}

                                      <span className="text-slate-400 text-[10px] font-medium shrink-0 pr-1">{les.duration}</span>

                                      {/* Quick action buttons matching decompiler */}
                                      <button
                                        onClick={() => setEditingLessonId(isEditing ? null : les.id)}
                                        className="p-1 text-slate-300 hover:text-slate-600 shrink-0"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => H(activeCourse.id, mod.id, les.id, { enabled: !les.enabled })}
                                        className="p-1 shrink-0"
                                      >
                                        {les.enabled ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                          <X className="w-3.5 h-3.5 text-slate-300" />
                                        )}
                                      </button>

                                      <button
                                        onClick={() => le(activeCourse.id, mod.id, les.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 shrink-0"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}

                                <button
                                  onClick={() => _(activeCourse.id, mod.id)}
                                  className="w-full flex items-center justify-center gap-1.5 py-2 text-emerald-600 bg-white hover:bg-emerald-50 rounded-xl border border-slate-100 text-[10.5px] font-bold transition-all mt-2"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Lesson
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Enrollment Assignment Dialog Overlay */}
      {assigningCourse && (
        <Dialog open={!!assigningCourse} onOpenChange={(open) => { if (!open) setAssigningCourse(null); }}>
          <DialogContent className={cn("bg-white rounded-3xl border-0 shadow-2xl overflow-hidden p-0", assignStep === "preview" ? "max-w-2xl" : "max-w-md p-6")}>
            {assignStep === "preview" ? (
              <div className="max-h-[85vh] overflow-y-auto">
                <CourseDetailsScreen 
                  course={assigningCourse} 
                  onBack={() => setAssigningCourse(null)} 
                  actionButtonText="Proceed to Assign Course"
                  onActionClick={() => setAssignStep("selectStudent")}
                />
              </div>
            ) : (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <button 
                      onClick={() => setAssignStep("preview")} 
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors mr-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <DialogTitle className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Send className="w-5 h-5 text-emerald-500" /> Select Student
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-xs text-slate-400 font-medium pl-8">
                    Select an assigned student to enroll in <span className="font-bold text-slate-800">{assigningCourse.title}</span>.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pt-4 pr-1">
                  {assignedStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleAssignCourse(student.id)}
                      disabled={isSaving}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-100/80 hover:border-slate-900/10 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100/50 flex items-center justify-center font-bold text-emerald-700 text-xs uppercase shrink-0">
                          {student.name ? student.name.slice(0, 2) : "ST"}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">{student.name || student.email.split('@')[0]}</p>
                          <p className="text-[10.5px] text-slate-400 font-semibold truncate mt-0.5">{student.email}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                    </button>
                  ))}
                  {assignedStudents.length === 0 && (
                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <AlertCircle className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-slate-400 text-xs font-semibold">No mentees mapped to you yet</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
      {/* Submit Review Submission Feedback Dialog */}
      <AnimatePresence>
        {isSubmitReviewOpen && selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-950 font-bold text-base">Review Project Submission</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Project: {selectedSubmission.project_title}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsSubmitReviewOpen(false);
                    setSelectedSubmission(null);
                  }}
                  className="text-slate-300 hover:text-slate-600 text-sm font-bold w-6 h-6 rounded-full hover:bg-slate-50 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rating Score</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSubmissionRating(star)}
                        className="text-2xl transition-transform active:scale-90 p-0 bg-transparent"
                      >
                        <span className={star <= submissionRating ? "text-amber-400" : "text-slate-200"}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Review Comments & Feedback</p>
                  <textarea
                    rows={3}
                    placeholder="Provide detailed feedback, next steps, or request improvements..."
                    value={submissionFeedback}
                    onChange={(e) => setSubmissionFeedback(e.target.value)}
                    className="w-full text-xs text-slate-800 placeholder-slate-300 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl px-3 py-2 outline-none border border-slate-200 resize-none transition-all focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleCompleteSubmissionReview("Rejected")}
                    className="flex-1 rounded-xl text-xs bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:text-rose-700 font-bold"
                  >
                    Request Changes
                  </Button>
                  <Button
                    onClick={() => handleCompleteSubmissionReview("Approved")}
                    className="flex-1 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Approve Submission
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
