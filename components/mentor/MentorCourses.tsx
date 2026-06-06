"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, Plus, Pencil, Trash2, Send, ChevronRight, X, Check, 
  BookOpen, Clock, Activity, Target, Settings, ArrowRight, ArrowLeft, 
  Layers, BookMarked, Download, Upload, ChevronDown, CheckCircle2, 
  AlertCircle, FileSpreadsheet, Play, Code2, HelpCircle, FolderOpen, Save, Eye, Star,
  Cpu, Layout, BarChart2, Code, Brain
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

const AESTHETIC_GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-indigo-600",
];

const getGradientClass = (id: string) => {
  if (!id) return AESTHETIC_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AESTHETIC_GRADIENTS.length;
  return AESTHETIC_GRADIENTS[index];
};

const getCourseIcon = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("design") || cat.includes("ux") || cat.includes("ui")) return <Layout className="w-5.5 h-5.5 text-white" />;
  if (cat.includes("data") || cat.includes("analytics") || cat.includes("science")) return <BarChart2 className="w-5.5 h-5.5 text-white" />;
  if (cat.includes("code") || cat.includes("programming") || cat.includes("web") || cat.includes("software")) return <Code className="w-5.5 h-5.5 text-white" />;
  if (cat.includes("brain") || cat.includes("mental") || cat.includes("health")) return <Brain className="w-5.5 h-5.5 text-white" />;
  if (cat.includes("vlsi") || cat.includes("semiconductor") || cat.includes("hardware") || cat.includes("engineering")) return <Cpu className="w-5.5 h-5.5 text-white" />;
  return <BookOpen className="w-5.5 h-5.5 text-white" />;
};

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
  status?: string;
}

// Helper to map and inject enabled: true property to modules/lessons to match decompiler 'l5' exactly
function l5(c: any): ExtendedCourse {
  let finalSource = { ...c };
  
  // Only parse description JSON if modules/content are not already populated
  if (!finalSource.modules && !finalSource.content && finalSource.description && typeof finalSource.description === 'string' && finalSource.description.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(finalSource.description);
      if (parsed && typeof parsed === 'object') {
        finalSource = {
          ...finalSource,
          description: parsed.description || "",
          difficulty: parsed.difficulty || "Beginner",
          duration: parsed.duration || "10 hours",
          category: parsed.category || "General",
          modules: parsed.modules || parsed.content || [],
          content: parsed.modules || parsed.content || []
        };
      }
    } catch (e) {
      console.warn("Failed to parse description in l5:", e);
    }
  }

  return {
    id: finalSource.id,
    title: finalSource.title,
    shortTitle: finalSource.shortTitle || finalSource.title.slice(0, 15),
    description: finalSource.description || "",
    category: finalSource.category || "General",
    difficulty: finalSource.difficulty || "Beginner",
    duration: finalSource.duration || "10 hours",
    enrolled: finalSource.enrolled ?? false,
    progress: finalSource.progress || 0,
    status: finalSource.status || "Active",
    color: finalSource.color || "text-emerald-600",
    bgColor: finalSource.bgColor || "bg-emerald-500",
    icon: finalSource.icon || <BookOpen className="w-5 h-5" />,
    modules: (finalSource.modules || finalSource.content || []).map((m: any, mIdx: number) => {
      const moduleId = m.id || `m-${finalSource.id}-${mIdx}`;
      const dbLessons = m.lessons || (m.topics || []).map((topicName: string, tIdx: number) => ({
        id: `l-${finalSource.id}-${mIdx}-${tIdx}`,
        title: topicName,
        duration: "10 min",
        type: "video",
        enabled: true
      }));

      return {
        id: moduleId,
        title: m.title || "Untitled Module",
        description: m.description || "",
        color: m.color || "bg-emerald-500",
        enabled: m.enabled ?? true,
        lessons: dbLessons.map((l: any, lIdx: number) => ({
          id: l.id || `l-${finalSource.id}-${mIdx}-${lIdx}`,
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

export function MentorCourses({ onClose }: { onClose?: () => void } = {}) {
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
  // Student context customization state
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const [studentEnrollments, setStudentEnrollments] = useState<any[]>([]);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [activeEnrollmentId, setActiveEnrollmentId] = useState<string | null>(null);

  const fetchStudentEnrollments = useCallback(async (studentId: string) => {
    if (studentId === "all") {
      setStudentEnrollments([]);
      return;
    }
    try {
      const { data: enrollments, error } = await supabase.from('enrollments')
        .select('*, course:courses(*)')
        .eq('student_id', studentId)
        .eq('status', 'Active')
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error("Error fetching student enrollments:", error);
        return;
      }

      const parsedEnrollments = (enrollments || []).map(enr => {
        let c = enr.course;
        if (c) {
          try {
            if (c.description && c.description.trim().startsWith('{')) {
              const parsed = JSON.parse(c.description);
              if (parsed && typeof parsed === 'object') {
                c = {
                  ...c,
                  description: parsed.description || "",
                  difficulty: parsed.difficulty || "Beginner",
                  duration: parsed.duration || "10 hours",
                  category: parsed.category || "General",
                  modules: parsed.modules || parsed.content || [],
                  content: parsed.modules || parsed.content || []
                } as any;
              }
            }
          } catch (e) {
            console.warn("Failed to parse course JSON:", e);
          }
        }
        return {
          ...enr,
          course: c ? l5(c) : null
        };
      });

      setStudentEnrollments(parsedEnrollments);
    } catch (e) {
      console.error(e);
    }
  }, [supabase]);

  useEffect(() => {
    if (selectedStudentId !== "all") {
      fetchStudentEnrollments(selectedStudentId);
    }
  }, [selectedStudentId, fetchStudentEnrollments]);

  const fetchReviewQueue = async (studentIds: string[] = []) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let filterStudentIds = studentIds;
      if (filterStudentIds.length === 0) {
        const { data: mappings } = await supabase.from('mapping')
          .select('student_id')
          .eq('mentor_id', session.user.id);
        filterStudentIds = mappings?.map(m => m.student_id).filter(Boolean) || [];
      }

      if (filterStudentIds.length === 0) {
        setReviewQueue([]);
        return;
      }

      const { data, error } = await supabase
        .from('review_queue')
        .select('*, student:profiles!review_queue_student_id_fkey(*)')
        .in('student_id', filterStudentIds)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.warn("Failed to fetch review_queue, falling back to reviews table:", error.message);
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .in('reviewee_id', filterStudentIds)
          .order('created_at', { ascending: false });

        if (reviewsData) {
          const { data: studentProfiles } = await supabase.from('profiles')
            .select('*')
            .in('id', filterStudentIds);
          
          const mappedReviews = reviewsData.map((r: any) => ({
            id: r.id,
            student_id: r.reviewee_id,
            mentor_id: r.reviewer_id,
            project_name: r.session_id || "Project Submission",
            status: r.rating ? "done" : "pending",
            submitted_at: r.created_at,
            feedback: r.feedback,
            rating: r.rating,
            student: studentProfiles?.find((s: any) => s.id === r.reviewee_id) || null
          }));
          setReviewQueue(mappedReviews);
        }
      } else if (data) {
        setReviewQueue(data);
      }
    } catch (e) {
      console.error("Error fetching review queue:", e);
    }
  };

  const handleCompleteSubmissionReview = async (status: "Approved" | "Rejected") => {
    if (!selectedSubmission) return;
    try {
      const isFromReviewsTable = !selectedSubmission.project_name || selectedSubmission.project_name === "Project Submission" || selectedSubmission.hasOwnProperty('reviewee_id');

      let updateError;
      if (!isFromReviewsTable) {
        const { error } = await supabase
          .from('review_queue')
          .update({
            status,
            feedback: submissionFeedback.trim() || null,
            rating: submissionRating,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', selectedSubmission.id);
        updateError = error;
      }

      if (isFromReviewsTable || (updateError && updateError.code === 'PGRST205')) {
        const { error } = await supabase
          .from('reviews')
          .update({
            feedback: submissionFeedback.trim() || null,
            rating: submissionRating
          })
          .eq('id', selectedSubmission.id);
        updateError = error;
      }

      if (updateError) {
        alert("Error updating review submission: " + updateError.message);
      } else {
        setIsSubmitReviewOpen(false);
        setSelectedSubmission(null);
        const studentIds = assignedStudents.map(s => s.id);
        fetchReviewQueue(studentIds);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const [coursesRes, mappingsRes] = await Promise.all([
        supabase.from('courses')
          .select('*')
          .or(`mentor_id.is.null,mentor_id.eq.${session.user.id}`)
          .order('created_at', { ascending: false }),
        supabase.from('mapping')
          .select('student:profiles!mapping_student_id_fkey(*)')
          .eq('mentor_id', session.user.id)
      ]);

      const dbCourses = coursesRes.data || [];
      const assigned = mappingsRes.data?.map(m => m.student).filter(Boolean) || [];
      const studentIds = assigned.map(s => s.id);
      setAssignedStudents(assigned);

      if (studentIds.length > 0) {
        await fetchReviewQueue(studentIds);
      } else {
        setReviewQueue([]);
      }

      const parsedDbCourses = dbCourses.map((c: any) => {
        try {
          if (c.description && c.description.trim().startsWith('{')) {
            const parsed = JSON.parse(c.description);
            if (parsed && typeof parsed === 'object') {
              return {
                ...c,
                description: parsed.description || "",
                difficulty: parsed.difficulty || "Beginner",
                duration: parsed.duration || "10 hours",
                category: parsed.category || "General",
                modules: parsed.modules || parsed.content || [],
                content: parsed.modules || parsed.content || []
              };
            }
          }
        } catch (e) {
          console.warn("Failed to parse course description JSON", e);
        }
        return c;
      });

      const localCatalog = mentorCoursesCatalog;
      const combined = [
        ...parsedDbCourses.map(c => ({
          ...c,
          modules: c.modules || c.content || []
        })),
        ...localCatalog.filter(c => !parsedDbCourses.some(sc => sc.title === c.title))
      ];

      setCourses(combined.map(l5));
    } catch (err) {
      console.error("Critical error in fetchAllData:", err);
      setCourses(mentorCoursesCatalog.map(l5));
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAllData();
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

    const serializedDescription = JSON.stringify({
      description: activeCourse.description || "",
      difficulty: activeCourse.difficulty || "Beginner",
      duration: activeCourse.duration || "10 hours",
      category: activeCourse.category || "General",
      modules: (activeCourse.modules || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description || "",
        enabled: m.enabled !== false,
        lessons: (m.lessons || []).map((l: any) => ({
          id: l.id,
          title: l.title,
          duration: l.duration || "15 mins",
          type: l.type || "video",
          enabled: l.enabled !== false
        }))
      }))
    });

    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(activeCourse.id);
    const isCustom = activeCourse.status === 'Custom';

    let err;

    if (selectedStudentId && selectedStudentId !== "all") {
      // Customizing for a specific student
      const payload = {
        title: activeCourse.title,
        description: serializedDescription,
        mentor_id: session?.user?.id,
        status: 'Custom'
      };

      if (isUUID && isCustom) {
        // Update in-place
        const { error } = await supabase.from('courses').update(payload).eq('id', activeCourse.id);
        err = error;
      } else {
        // Clone and insert new custom course
        const { data: newCourse, error: insertError } = await supabase.from('courses')
          .insert(payload)
          .select('id')
          .single();

        if (insertError) {
          err = insertError;
        } else if (newCourse) {
          // Update the enrollment to point to this new customized course
          if (activeEnrollmentId) {
            const { error: enrollError } = await supabase.from('enrollments')
              .update({ course_id: newCourse.id })
              .eq('id', activeEnrollmentId);
            err = enrollError;
          } else {
            // Deactivate other active enrollments first
            await supabase.from('enrollments')
              .update({ status: 'Inactive' })
              .eq('student_id', selectedStudentId);

            const { error: enrollError } = await supabase.from('enrollments').insert({
              student_id: selectedStudentId,
              course_id: newCourse.id,
              status: 'Active'
            });
            err = enrollError;
          }
        }
      }
    } else {
      // General Course Template
      const payload = {
        title: activeCourse.title,
        description: serializedDescription,
        mentor_id: session?.user?.id,
        status: activeCourse.status || 'Active'
      };

      if (isUUID) {
        const { error } = await supabase.from('courses').update(payload).eq('id', activeCourse.id);
        err = error;
      } else {
        const { error } = await supabase.from('courses').insert(payload);
        err = error;
      }
    }

    setIsSaving(false);
    if (err) {
      alert("Error saving course syllabus: " + err.message);
    } else {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      setIsEditingCourse(false);
      setSelectedCourseId(null);
      setActiveEnrollmentId(null);
      await fetchAllData();
      if (selectedStudentId && selectedStudentId !== "all") {
        await fetchStudentEnrollments(selectedStudentId);
      }
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
      const serializedDescription = JSON.stringify({
        description: assigningCourse.description || "",
        difficulty: assigningCourse.difficulty || "Beginner",
        duration: assigningCourse.duration || "10 hours",
        category: assigningCourse.category || "General",
        modules: (assigningCourse.modules || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description || "",
          enabled: m.enabled !== false,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: l.duration || "15 mins",
            type: l.type || "video",
            enabled: l.enabled !== false
          }))
        }))
      });

      const payload = {
        title: assigningCourse.title,
        description: serializedDescription,
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
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden -mx-6 md:-mx-8 min-h-[92vh]">
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
            <div className="bg-slate-900 px-6 pt-12 pb-8 md:px-8 text-white relative shadow-xl shadow-slate-900/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-y-24 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl translate-y-16 -translate-x-16"></div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  {onClose && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white shadow-lg backdrop-blur-sm mr-1 shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </Button>
                  )}
                  <div className="w-12 h-12 bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium tracking-tight tracking-tight leading-tight">Course Architect</h2>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-1">Design & Guide Curriculum</p>
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
                  className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white shadow-lg backdrop-blur-sm"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              </div>

              <div className="mt-5 mb-4 flex items-center gap-3 relative z-10">
                <span className="text-xs text-white/60 font-semibold shrink-0">Student:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-300 backdrop-blur-md cursor-pointer flex-1 md:flex-initial"
                >
                  <option value="all" className="text-slate-900 font-semibold">General Course Templates</option>
                  {assignedStudents.map((s) => (
                    <option key={s.id} value={s.id} className="text-slate-900 font-semibold">
                      {s.name || s.email?.split('@')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl relative z-10 border border-white/5">
                <button
                  onClick={() => setActiveTab("builder")}
                  className={cn(
                    "flex-1 py-3 text-center text-xs font-black uppercase tracking-[0.1em] rounded-xl transition-all",
                    activeTab === "builder" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"
                  )}
                >
                  Syllabus Builder
                </button>
                <button
                  onClick={() => setActiveTab("queue")}
                  className={cn(
                    "flex-1 py-3 text-center text-xs font-black uppercase tracking-[0.1em] rounded-xl transition-all",
                    activeTab === "queue" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"
                  )}
                >
                  Review Queue {reviewQueue.filter(r => r.status === 'Pending' && (selectedStudentId === 'all' || r.student_id === selectedStudentId)).length > 0 && <span className="ml-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full inline-flex items-center justify-center text-[10px] shadow-sm">{reviewQueue.filter(r => r.status === 'Pending' && (selectedStudentId === 'all' || r.student_id === selectedStudentId)).length}</span>}
                </button>
              </div>
            </div>

            {/* Courses list matching mobile styling exactly */}
            {activeTab === "builder" && (
              <div className="px-6 py-6 md:px-8 space-y-3 flex-1 overflow-y-auto">
                {selectedStudentId !== "all" ? (
                  // STUDENT CUSTOMIZED LEARNING PATHS (Image 2 style)
                  <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 bg-white p-5 rounded-[1.5rem] border border-slate-100/80 shadow-xs">
                      <div>
                        <h3 className="text-base font-black uppercase tracking-wider text-slate-900">My Learning Paths</h3>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">
                          Track {assignedStudents.find(s => s.id === selectedStudentId)?.name || "student"}'s progress and tailor their curriculum.
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsCatalogModalOpen(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-xs flex items-center gap-1.5 self-start md:self-auto"
                      >
                        <Plus className="w-4 h-4" /> Browse Catalog
                      </Button>
                    </div>

                    {loading ? (
                      <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                        <p className="text-xs font-semibold">Loading student paths...</p>
                      </div>
                    ) : studentEnrollments.length === 0 ? (
                      <div className="bg-white rounded-[2rem] border border-slate-100 p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">No Learning Paths Assigned</h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1.5 mb-6">Assign expert-designed courses or customize a syllabus to begin guiding this student.</p>
                        <Button
                          onClick={() => setIsCatalogModalOpen(true)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl"
                        >
                          Assign First Course
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {studentEnrollments.map((enrollment, idx) => {
                          const course = enrollment.course;
                          if (!course) return null;

                          const courseModules = course.modules || [];
                          const totalLessons = courseModules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0);
                          const completedLessons = Array.isArray(enrollment.progress) ? enrollment.progress.length : 0;
                          const progressPct = enrollment.progress_pct ?? (totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0);

                          const nextUpLesson = courseModules
                            .flatMap((m: any) => m.lessons || [])
                            .find((l: any) => l.enabled && !(enrollment.progress || []).includes(l.id))?.title || "Course Completed!";

                          const bgGradient = getGradientClass(course.id);

                          return (
                            <motion.div
                              key={enrollment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 relative overflow-hidden group"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-2.5xl bg-gradient-to-tr ${bgGradient} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                                  {getCourseIcon(course.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{course.category || "General"}</span>
                                    <span className="bg-slate-50 text-slate-600 text-[10px] font-semibold border border-slate-200/60 rounded-lg px-2 py-0.5 uppercase tracking-wider shrink-0">
                                      {course.difficulty || "Beginner"}
                                    </span>
                                  </div>
                                  <h4 className="text-[16px] font-bold text-slate-900 truncate mt-1">
                                    {course.title}
                                  </h4>
                                </div>
                              </div>

                              <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-4 line-clamp-2">
                                {course.description || "Master core concepts and build practical projects step by step."}
                              </p>

                              {/* Progress Section */}
                              <div className="mt-5 space-y-2">
                                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                                  <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-slate-400" /> Course Progress</span>
                                  <span className="text-slate-900 font-bold">{progressPct}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 pt-1">
                                  <span>{courseModules.filter((m: any) => m.enabled).length} modules</span>
                                  <span>{completedLessons}/{totalLessons} lessons</span>
                                </div>
                              </div>

                              {/* Next Lesson Box */}
                              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 mt-5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                  <Play className="w-3.5 h-3.5 text-slate-500 fill-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Up</p>
                                  <p className="text-xs font-bold text-slate-700 truncate mt-0.5">{nextUpLesson}</p>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2.5 mt-5">
                                <Button
                                  onClick={() => {
                                    setSelectedCourseId(course.id);
                                    setActiveEnrollmentId(enrollment.id);
                                    setIsEditingCourse(true);
                                  }}
                                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-11 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                                >
                                  <Pencil className="w-3.5 h-3.5" /> Customize Course
                                </Button>
                                <Button
                                  onClick={async () => {
                                    if (confirm("Are you sure you want to unassign this course for this student?")) {
                                      const { error } = await supabase.from('enrollments')
                                        .update({ status: 'Inactive' })
                                        .eq('id', enrollment.id);
                                      if (error) {
                                        alert("Error: " + error.message);
                                      } else {
                                        alert("Course unassigned successfully.");
                                        fetchStudentEnrollments(selectedStudentId);
                                      }
                                    }
                                  }}
                                  variant="outline"
                                  className="h-11 px-4 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 border border-slate-200/60"
                                >
                                  Unassign
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  // GENERAL COURSE CATALOG (Image 1 style)
                  loading ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                      <p className="text-xs font-semibold">Loading curriculum path...</p>
                    </div>
                  ) : (
                    courses.map((course, idx) => {
                      const activeModCount = course.modules.filter(m => m.enabled).length;
                      const totalLessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                      const bgGradient = getGradientClass(course.id);

                      return (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group p-5 relative"
                        >
                          <div className="flex items-start gap-4">
                            {/* Accent Icon Container */}
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${bgGradient} text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300`}>
                              {getCourseIcon(course.category)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{course.category || "General"}</span>
                                <span className="bg-slate-50 text-slate-600 text-[10px] font-semibold border border-slate-200/60 rounded-lg px-2 py-0.5 uppercase tracking-wider shrink-0">
                                  {course.difficulty || "Beginner"}
                                </span>
                              </div>
                              <h3 className="text-[16px] font-bold text-slate-900 truncate mt-1 group-hover:text-indigo-600 transition-colors">
                                {course.title}
                              </h3>
                            </div>
                          </div>

                          {/* Body Content */}
                          <div className="flex-1 flex flex-col justify-between gap-4 mt-4">
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                              {course.description || "Master core concepts and build practical projects step by step."}
                            </p>

                            <div className="flex items-center gap-4 text-[11.5px] font-semibold text-slate-400 pt-1">
                              <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-slate-300" /> {activeModCount} modules</span>
                              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-300" /> {totalLessonCount} lessons</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2.5 pt-2">
                              <Button 
                                onClick={() => {
                                  setSelectedCourseId(course.id);
                                  setIsEditingCourse(false);
                                }}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-11 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-4 h-4" /> View Details
                              </Button>
                              <Button
                                onClick={() => {
                                  setAssigningCourse(course);
                                  setAssignStep("selectStudent");
                                }}
                                className="h-11 px-5 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all active:scale-[0.98]"
                              >
                                Assign to Mentee
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedCourseId(course.id);
                                  setIsEditingCourse(true);
                                }}
                                size="icon"
                                variant="outline"
                                className="w-11 h-11 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 shrink-0"
                                title="Edit Syllabus"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )
                )}
              </div>
            )}

            {activeTab === "queue" && (
              <div className="px-6 py-6 md:px-8 space-y-3.5 flex-1 overflow-y-auto">
                {reviewQueue.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm font-medium">Review queue is empty!</p>
                    <p className="text-xs text-slate-400 mt-1">Students haven't submitted capstones yet.</p>
                  </div>
                ) : (
                  reviewQueue.map((item, index) => {
                    const studentName = item.student?.name || item.student?.email?.split('@')[0] || "Student";
                    const isPending = item.status === "Pending" || item.status === "pending";

                    return (
                      <div key={item.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                          <div className="min-w-0 flex-1">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-3xs",
                              isPending ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              item.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              "bg-rose-50 text-rose-600 border border-rose-100"
                            )}>
                              {item.status}
                            </span>
                            <h4 className="text-[16px] font-medium text-slate-900 mt-3 truncate">{item.project_title}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                               <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">
                                 {studentName.substring(0, 2)}
                               </div>
                               <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{studentName}</p>
                            </div>
                          </div>
                          
                          {item.submission_link && (
                            <a
                              href={item.submission_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-wider flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100/50 px-3 py-2 rounded-xl shrink-0 transition-all active:scale-95 shadow-3xs"
                            >
                              View <ArrowRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {item.feedback && (
                          <div className="mt-5 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl relative z-10">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.15em] mb-2">Mentor Feedback</p>
                            <p className="text-[13px] font-medium text-slate-700 leading-relaxed italic">"{item.feedback}"</p>
                            {item.rating && (
                              <div className="flex gap-1 mt-3 text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < item.rating ? "fill-amber-500" : "text-slate-200"}`} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {isPending && (
                          <div className="flex gap-2 border-t border-slate-50 pt-5 mt-5 relative z-10">
                            <Button
                              onClick={() => {
                                setSelectedSubmission(item);
                                setSubmissionFeedback("");
                                setSubmissionRating(5);
                                setIsSubmitReviewOpen(true);
                              }}
                              className="flex-1 py-6 text-[12px] font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
                            >
                              Review Submission
                            </Button>
                          </div>
                        )}
                      </div>
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
              actionButtonText="Assign to Mentee"
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
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 text-white shrink-0 shadow-md">
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
                <p className="text-white text-xs font-medium">Edit Course Path</p>
                
                <button
                  onClick={handleSaveToDatabase}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-[11px] font-medium active:scale-95 transition-transform flex items-center gap-1.5"
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
            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 space-y-4">
              
              {/* Core metadata editor form */}
              {activeCourse && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-medium mb-1.5 block">Course Title</label>
                    <input
                      type="text"
                      value={activeCourse.title}
                      onChange={(e) => I(activeCourse.id, { title: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-medium mb-1.5 block">Description</label>
                    <textarea
                      value={activeCourse.description}
                      onChange={(e) => I(activeCourse.id, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-slate-400 text-[10px] uppercase font-medium mb-1.5 block">Difficulty</label>
                      <select
                        value={activeCourse.difficulty}
                        onChange={(e: any) => I(activeCourse.id, { difficulty: e.target.value })}
                        className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] uppercase font-medium mb-1.5 block">Duration</label>
                      <input
                        type="text"
                        value={activeCourse.duration}
                        onChange={(e) => I(activeCourse.id, { duration: e.target.value })}
                        className="w-full px-2.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-900 font-medium outline-none border border-slate-100 focus:border-emerald-300 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] uppercase font-medium mb-1.5 block">Category</label>
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
                      <p className="text-emerald-900 text-xs font-medium">
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
                    "w-full flex items-center gap-2 px-4 py-3.5 text-xs font-medium transition-all",
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
                            className="text-emerald-600 text-[10px] font-medium flex items-center gap-1 hover:underline"
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
                          <p className="text-slate-500 text-[11px] font-medium">Drag & drop course index, or browse</p>
                          
                          <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-medium rounded-xl cursor-pointer mt-3 active:scale-95 transition-transform">
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
                              <p className="text-red-400 text-[10px] font-medium pl-4">+{errors.length - 3} more errors</p>
                            )}
                          </div>
                        )}

                        {/* Parser success state indicator */}
                        {parsedModules.length > 0 && (
                          <div className="space-y-3">
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-center justify-between">
                              <p className="text-emerald-800 text-[10px] font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                {parsedModules.length} modules · {parsedModules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons ready
                              </p>
                            </div>

                            <div className="max-h-28 overflow-y-auto border border-slate-100 rounded-xl p-2.5 bg-slate-50 space-y-1.5">
                              {parsedModules.map((pm, uIdx) => (
                                <div key={uIdx} className="bg-white rounded-lg px-2.5 py-1.5 flex justify-between items-center text-[10px] font-medium text-slate-700">
                                  <span className="truncate flex-1 pr-2">{pm.title}</span>
                                  <span className="text-slate-400 shrink-0">({pm.lessons.length} lessons)</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2 shrink-0 pt-1">
                              <Button
                                onClick={handleAddUploadedModules}
                                className="flex-1 h-9 rounded-xl text-[10px] font-medium bg-slate-900 text-white hover:bg-slate-800"
                              >
                                Add {parsedModules.length} Modules
                              </Button>
                              <Button
                                onClick={() => {
                                  setParsedModules([]);
                                  setErrors([]);
                                }}
                                variant="outline"
                                className="h-9 px-4 rounded-xl text-[10px] font-medium text-slate-500"
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
                      className="h-7 text-emerald-600 text-[10.5px] font-medium px-2 rounded-lg hover:bg-emerald-50"
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
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10.5px] font-medium shrink-0">
                              {modIdx + 1}
                            </div>

                            <button
                              onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                              className="flex-1 text-left min-w-0"
                            >
                              <p className="text-slate-900 text-xs font-medium truncate">{mod.title}</p>
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
                                        <p className="flex-1 text-slate-800 text-xs font-medium truncate">{les.title}</p>
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
                                  className="w-full flex items-center justify-center gap-1.5 py-2 text-emerald-600 bg-white hover:bg-emerald-50 rounded-xl border border-slate-100 text-[10.5px] font-medium transition-all mt-2"
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
                    Select an assigned student to enroll in <span className="font-medium text-slate-800">{assigningCourse.title}</span>.
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
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100/50 flex items-center justify-center font-medium text-emerald-700 text-xs uppercase shrink-0">
                          {student.name ? student.name.slice(0, 2) : "ST"}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[13px] font-medium text-slate-900 truncate leading-tight">{student.name || student.email.split('@')[0]}</p>
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
      {/* Browse Catalog Dialog (Explore Learning Paths modal matching Image 1) */}
      <AnimatePresence>
        {isCatalogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-slate-900 text-white rounded-t-[2.5rem] w-full max-w-xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Explore Learning Paths</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Choose from expert-designed courses</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCatalogModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body / Courses List */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {courses
                  .filter(c => c.status !== 'Custom') // Only show template courses
                  .map((course) => {
                    const modulesCount = course.modules.filter(m => m.enabled).length;
                    const lessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                    const isAlreadyEnrolled = studentEnrollments.some(e => e.course_id === course.id);

                    return (
                      <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getGradientClass(course.id)} flex items-center justify-center shrink-0`}>
                              {getCourseIcon(course.category)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{course.title}</h4>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                {modulesCount} modules · {lessonsCount} lessons
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={async () => {
                              try {
                                // Deactivate existing active enrollments first
                                await supabase.from('enrollments')
                                  .update({ status: 'Inactive' })
                                  .eq('student_id', selectedStudentId);

                                const { error } = await supabase.from('enrollments').insert({
                                  student_id: selectedStudentId,
                                  course_id: course.id,
                                  status: 'Active'
                                });

                                if (error) {
                                  alert("Error assigning course: " + error.message);
                                } else {
                                  alert("Course assigned successfully!");
                                  setIsCatalogModalOpen(false);
                                  fetchStudentEnrollments(selectedStudentId);
                                }
                              } catch (err: any) {
                                console.error(err);
                              }
                            }}
                            disabled={isAlreadyEnrolled}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shrink-0 transition-all",
                              isAlreadyEnrolled 
                                ? "bg-white/10 text-white/40 cursor-default" 
                                : "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                            )}
                          >
                            {isAlreadyEnrolled ? "Assigned" : "+ Enroll"}
                          </Button>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {course.description || "Master core concepts and build practical projects step by step."}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  <h3 className="text-slate-950 font-medium text-base">Review Project Submission</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Project: {selectedSubmission.project_title}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsSubmitReviewOpen(false);
                    setSelectedSubmission(null);
                  }}
                  className="text-slate-300 hover:text-slate-600 text-sm font-medium w-6 h-6 rounded-full hover:bg-slate-50 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-medium tracking-wider">Rating Score</p>
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
                  <p className="text-slate-400 text-[10px] uppercase font-medium tracking-wider">Review Comments & Feedback</p>
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
                    className="flex-1 rounded-xl text-xs bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:text-rose-700 font-medium"
                  >
                    Request Changes
                  </Button>
                  <Button
                    onClick={() => handleCompleteSubmissionReview("Approved")}
                    className="flex-1 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
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
