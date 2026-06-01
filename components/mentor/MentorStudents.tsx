import { ChevronDown, Search, ArrowRight, MessageSquare, Video, Medal, Target, MapPin, Clock, BookOpen, Layers, CheckCircle2, Star, Users, Zap, Heart, Check, Sparkles, X, GraduationCap, Plus, Edit3, Eye, EyeOff, Trash2, Play, Code2, HelpCircle, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mentorCoursesCatalog } from "@/lib/mentorCoursesData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

interface MentorStudentsProps {
  activeStudentId?: string | null;
  onSelectStudent?: (studentId: string | null) => void;
}

export function MentorStudents({ activeStudentId, onSelectStudent }: MentorStudentsProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentEnrollment, setStudentEnrollment] = useState<any>(null);
  const [isCourseCatalogOpen, setIsCourseCatalogOpen] = useState(false);
  
  // Course Customizer States
  const [customizingCourse, setCustomizingCourse] = useState<any>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [addingModule, setAddingModule] = useState(false);
  const [newModTitle, setNewModTitle] = useState("");
  const [editingModuleTitle, setEditingModuleTitle] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const supabase = createClient();

  // Helper to clone a course for customization
  const startCustomizing = (course: any) => {
    const clonedModules = (course.modules || course.content || []).map((m: any) => {
      const lessons = m.lessons || (m.topics || []).map((topicName: string, tIdx: number) => ({
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
        enabled: m.enabled !== false,
        lessons: lessons.map((l: any) => ({
          id: l.id || `l-${Date.now()}-${Math.random()}`,
          title: l.title || "Untitled Lesson",
          duration: l.duration || "10 min",
          type: l.type || "video",
          enabled: l.enabled !== false
        }))
      };
    });

    setCustomizingCourse({
      ...course,
      modules: clonedModules
    });
    setIsCourseCatalogOpen(false);
  };

  const updateModule = (moduleId: string, updates: any) => {
    if (!customizingCourse) return;
    setCustomizingCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) => m.id === moduleId ? { ...m, ...updates } : m)
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: any) => {
    if (!customizingCourse) return;
    setCustomizingCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lessons: m.lessons.map((l: any) => l.id === lessonId ? { ...l, ...updates } : l)
        };
      })
    }));
  };

  const addNewModule = () => {
    if (!customizingCourse || !newModTitle.trim()) return;
    const newMod = {
      id: `m-${Date.now()}`,
      title: newModTitle.trim(),
      description: "",
      enabled: true,
      lessons: []
    };
    setCustomizingCourse((prev: any) => ({
      ...prev,
      modules: [...prev.modules, newMod]
    }));
    setNewModTitle("");
    setAddingModule(false);
  };

  const addLesson = (moduleId: string) => {
    if (!customizingCourse) return;
    const newLes = {
      id: `l-${Date.now()}`,
      title: "New Lesson",
      duration: "10 min",
      type: "video",
      enabled: true
    };
    setCustomizingCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lessons: [...m.lessons, newLes]
        };
      })
    }));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    if (!customizingCourse) return;
    setCustomizingCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lessons: m.lessons.filter((l: any) => l.id !== lessonId)
        };
      })
    }));
  };

  const getLessonIcon = (type: string) => {
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
  };

  const handleAssignCustomizedCourse = async () => {
    if (!customizingCourse || !selectedStudent) return;
    setIsAssigning(true);

    try {
      // Serialize customized modules/content inside description JSON
      const serializedDescription = JSON.stringify({
        description: customizingCourse.description || "",
        difficulty: customizingCourse.difficulty || "Beginner",
        duration: customizingCourse.duration || "10 hours",
        category: customizingCourse.category || "General",
        modules: customizingCourse.modules
      });

      // Insert new custom course in DB with full columns so database triggers run
      const { data: newDbCourse, error: insertError } = await supabase.from('courses')
        .insert({
          title: customizingCourse.title,
          description: serializedDescription,
          content: customizingCourse.modules || [],
          difficulty: customizingCourse.difficulty || "Beginner",
          duration: customizingCourse.duration || "10 hours",
          category: customizingCourse.category || "General",
          status: 'Active'
        })
        .select('id')
        .single();

      if (insertError) {
        console.error("Failed to insert custom course:", insertError);
        alert("Failed to insert custom course: " + insertError.message);
        setIsAssigning(false);
        return;
      }

      // Deactivate existing active enrollments for this student first to avoid duplicates
      await supabase.from('enrollments')
        .update({ status: 'Inactive' })
        .eq('student_id', selectedStudent.id);

      // Insert new active enrollment referencing our verified DB course ID
      const { error } = await supabase.from('enrollments').insert({
        student_id: selectedStudent.id,
        course_id: newDbCourse.id,
        status: 'Active'
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Course customized and assigned successfully!");
        setCustomizingCourse(null);
        
        // Refresh active enrollment details
        const { data: enrollment } = await supabase.from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', selectedStudent.id)
          .eq('status', 'Active')
          .maybeSingle();

        let parsedEnrollment = enrollment;
        if (parsedEnrollment && parsedEnrollment.course) {
          let c = parsedEnrollment.course;
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
          parsedEnrollment = {
            ...parsedEnrollment,
            course: c
          };
        }
        setStudentEnrollment(parsedEnrollment);

        // Refresh the main student list
        await fetchData();
      }
    } catch (e: any) {
      alert("Unexpected error: " + e.message);
    } finally {
      setIsAssigning(false);
    }
  };

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: mappings } = await supabase.from('mapping')
      .select('student:profiles!mapping_student_id_fkey(*)')
      .eq('mentor_id', session.user.id);
    
    const assigned = mappings?.map(m => m.student).filter(Boolean) || [];

    if (assigned.length > 0) {
      // Fetch active enrollments for these students
      const { data: enrollments } = await supabase.from('enrollments')
        .select('*, course:courses(*)')
        .in('student_id', assigned.map(s => s.id))
        .eq('status', 'Active');

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
            console.warn("Failed to parse serialized enrollment course description JSON", e);
          }
        }
        return {
          ...enr,
          course: c
        };
      });

      const enrollmentMap = new Map();
      parsedEnrollments.forEach(e => {
        enrollmentMap.set(e.student_id, e);
      });

      setStudents(assigned.map(p => {
        const studentEnrollment = enrollmentMap.get(p.id);
        const courseTitle = studentEnrollment?.course?.title || "No Active Course";
        
        const modules = studentEnrollment?.course?.modules || studentEnrollment?.course?.content || [];
        const totalTopics = modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || m.topics?.length || 0), 0);
        const completedTopics = studentEnrollment?.progress?.length || 0;
        const progressPercent = studentEnrollment?.progress_pct ?? (totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0);

        return {
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'Unknown Student',
          email: p.email,
          avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
          avatar_url: p.avatar_url,
          status: studentEnrollment ? "Enrolled" : "Awaiting Course",
          course: courseTitle,
          progress: progressPercent,
          streak: Math.floor(Math.random() * 10) + 1,
          preferences: p.preferences || {},
          created_at: p.created_at,
        };
      }));
    } else {
      setStudents([]);
    }

    // Fetch courses for assignment
    const { data: courseData } = await supabase.from('courses').select('*');
    const parsedCourses = (courseData || []).map((c: any) => {
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
              content: parsed.modules || parsed.content || [],
              isDb: true
            };
          }
        }
      } catch (e) {
        console.warn("Failed to parse course description JSON", e);
      }
      return { ...c, isDb: true };
    });

    const localCatalog = mentorCoursesCatalog;
    const combined = [
      ...parsedCourses,
      ...localCatalog.filter(c => !parsedCourses.some(sc => sc.title === c.title))
    ];
    setCourses(combined);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeStudentId && students.length > 0) {
      const match = students.find(s => s.id === activeStudentId);
      if (match) {
        setSelectedStudent(match);
      }
    }
  }, [activeStudentId, students]);

  useEffect(() => {
    if (selectedStudent) {
      const fetchEnrollment = async () => {
        const { data: enrollment } = await supabase.from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', selectedStudent.id)
          .eq('status', 'Active')
          .maybeSingle();
        
        let parsedEnrollment = enrollment;
        if (parsedEnrollment && parsedEnrollment.course) {
          let c = parsedEnrollment.course;
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
            console.warn("Failed to parse serialized enrollment course description JSON", e);
          }
          parsedEnrollment = {
            ...parsedEnrollment,
            course: c
          };
        }
        setStudentEnrollment(parsedEnrollment);
      };
      fetchEnrollment();
    }
  }, [selectedStudent]);

  const handleAssignCourse = async (courseIdOverride?: string) => {
    const activeCourseId = courseIdOverride || selectedCourseId;
    if (!activeCourseId || !selectedStudent) return;
    setIsAssigning(true);

    try {
      const courseObj = courses.find(c => c.id === activeCourseId);
      if (!courseObj) {
        setIsAssigning(false);
        return;
      }

      let dbCourseId = activeCourseId;

      // If the course is a local catalog course and not yet in the DB's courses table
      if (!courseObj.isDb) {
        // Check if a course with this title already exists in the database
        const { data: existingCourse } = await supabase.from('courses')
          .select('id')
          .eq('title', courseObj.title)
          .maybeSingle();

        if (existingCourse) {
          dbCourseId = existingCourse.id;
        } else {
          // Serialize modules/content inside description JSON
          const serializedDescription = JSON.stringify({
            description: courseObj.description || "",
            difficulty: courseObj.difficulty || "Beginner",
            duration: courseObj.duration || "10 hours",
            category: courseObj.category || "General",
            modules: courseObj.modules || courseObj.content || []
          });

          const { data: newDbCourse, error: insertError } = await supabase.from('courses')
            .insert({
              title: courseObj.title,
              description: serializedDescription,
              content: courseObj.modules || courseObj.content || [],
              difficulty: courseObj.difficulty || "Beginner",
              duration: courseObj.duration || "10 hours",
              category: courseObj.category || "General",
              status: 'Active'
            })
            .select('id')
            .single();

          if (insertError) {
            console.error("Failed to seed course to DB:", insertError);
            alert("Error seeding course to DB: " + insertError.message);
            setIsAssigning(false);
            return;
          }

          dbCourseId = newDbCourse.id;
        }
      }

      // 1. Deactivate all existing enrollments for this student first to avoid duplicates
      await supabase.from('enrollments')
        .update({ status: 'Inactive' })
        .eq('student_id', selectedStudent.id);

      // 2. Insert new active enrollment referencing our verified DB course ID
      const { error } = await supabase.from('enrollments').insert({
        student_id: selectedStudent.id,
        course_id: dbCourseId,
        status: 'Active'
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Course assigned successfully!");
        
        const { data: enrollment } = await supabase.from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', selectedStudent.id)
          .eq('status', 'Active')
          .maybeSingle();

        let parsedEnrollment = enrollment;
        if (parsedEnrollment && parsedEnrollment.course) {
          let c = parsedEnrollment.course;
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
          parsedEnrollment = {
            ...parsedEnrollment,
            course: c
          };
        }
        setStudentEnrollment(parsedEnrollment);

        // Refresh the main student list with actual db entries
        await fetchData();
      }
    } catch (e: any) {
      alert("Unexpected error: " + e.message);
    } finally {
      setIsAssigning(false);
    }
  };

  if (selectedStudent) {
    const courseModules = studentEnrollment?.course?.modules || studentEnrollment?.course?.content || [];
    const totalTopics = courseModules.reduce((acc: number, m: any) => acc + (m.lessons?.length || m.topics?.length || 0), 0);
    const completedTopics = studentEnrollment?.progress?.length || 0;
    const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    if (customizingCourse) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pb-32"
        >
          {/* Customizer Header */}
          <div className="flex items-center gap-4 pt-6 md:pt-8 px-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCustomizingCourse(null)}
              className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </Button>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight text-slate-900">Customize Syllabus</h2>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">FOR {selectedStudent.name}</p>
            </div>
          </div>

          {/* Customizing Course Info Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${customizingCourse.bgColor || "bg-indigo-500"} text-white shadow-md`}>
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{customizingCourse.title}</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {(customizingCourse.modules || []).filter((m: any) => m.enabled !== false).length} Active Modules · {(customizingCourse.modules || []).reduce((acc: number, m: any) => acc + (m.lessons || []).filter((l: any) => l.enabled !== false).length, 0)} Active Lessons
              </p>
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-[0.2em]">Syllabus Modules</h3>
              <button 
                onClick={() => setAddingModule(true)}
                className="text-indigo-600 text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>

            <AnimatePresence>
              {addingModule && (
                <motion.div 
                  className="bg-white rounded-[2rem] p-6 border border-indigo-100 shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Module Title</label>
                      <input 
                        autoFocus 
                        placeholder="Enter title..." 
                        value={newModTitle} 
                        onChange={(e) => setNewModTitle(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-400" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setAddingModule(false)} className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold">Cancel</button>
                      <button onClick={addNewModule} disabled={!newModTitle.trim()} className={cn("flex-1 py-3 rounded-xl text-xs font-bold transition-all", newModTitle.trim() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-300")}>Create Module</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {(customizingCourse.modules || []).map((mod: any, modIdx: number) => (
                <motion.div 
                  key={mod.id}
                  className={cn("bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 border border-slate-100 shadow-sm", mod.enabled !== false ? "opacity-100 border-white/60" : "opacity-40 grayscale-[0.5] border-slate-200")}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => updateModule(mod.id, { enabled: mod.enabled === false ? true : false })}
                        className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md", mod.enabled !== false ? "bg-indigo-600 text-white shadow-indigo-500/20" : "bg-slate-100 text-slate-300 shadow-none")}
                      >
                        {mod.enabled !== false ? <Check className="w-5 h-5" strokeWidth={3} /> : <Layers className="w-5 h-5" />}
                      </button>
                      
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                        {editingModuleTitle === mod.id ? (
                          <input 
                            autoFocus
                            value={mod.title}
                            onChange={(e) => updateModule(mod.id, { title: e.target.value })}
                            onBlur={() => setEditingModuleTitle(null)}
                            className="bg-transparent border-none p-0 text-slate-900 font-black text-base outline-none w-full border-b border-indigo-200 focus:border-indigo-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <h4 className="text-slate-900 font-bold text-base truncate tracking-tight">{mod.title}</h4>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">{(mod.lessons || []).filter((l: any) => l.enabled !== false).length}/{(mod.lessons || []).length} Active</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Module {modIdx + 1}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingModuleTitle(mod.id)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                          <ChevronDown className={cn("w-5 h-5 transition-transform duration-500", expandedModule === mod.id && "rotate-180")} />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedModule === mod.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 pt-6 border-t border-slate-100/60 space-y-3 overflow-hidden"
                        >
                          {(mod.lessons || []).map((lesson: any) => (
                            <div key={lesson.id} className={cn("flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 transition-all", lesson.enabled === false && "opacity-40")}>
                              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100">
                                {getLessonIcon(lesson.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                {editingField === lesson.id ? (
                                  <input 
                                    autoFocus
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })}
                                    onBlur={() => setEditingField(null)}
                                    className="bg-transparent border-none p-0 text-[13px] font-black text-slate-900 outline-none w-full border-b border-indigo-200 focus:border-indigo-400"
                                  />
                                ) : (
                                  <p className="text-slate-900 text-[13px] font-bold truncate tracking-tight">{lesson.title}</p>
                                )}
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">{lesson.duration}</span>
                                  <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />
                                  <span className={cn("text-[10px] font-black uppercase tracking-tighter", lesson.type === "video" ? "text-blue-500" : "text-amber-500")}>{lesson.type}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button onClick={() => setEditingField(lesson.id)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                                <button 
                                  onClick={() => updateLesson(mod.id, lesson.id, { enabled: lesson.enabled === false ? true : false })}
                                  className={cn("p-2 transition-all", lesson.enabled !== false ? "text-indigo-600" : "text-slate-300")}
                                >
                                  {lesson.enabled !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                                <button onClick={() => removeLesson(mod.id, lesson.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => addLesson(mod.id)}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
                          >
                            <Plus className="w-4 h-4" /> Add New Lesson
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex gap-4 pt-8 pb-16 px-1">
            <Button 
              variant="outline" 
              onClick={() => setCustomizingCourse(null)}
              className="flex-1 py-6 rounded-2xl text-[14px] font-bold border-slate-200 bg-white hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignCustomizedCourse}
              disabled={isAssigning}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-2xl text-[14px] font-bold shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
            >
              {isAssigning ? "Assigning..." : "Confirm & Assign"}
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="space-y-6 pb-20">
         <div className="flex items-center gap-4 pt-6 md:pt-8 px-1">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => {
               setSelectedStudent(null);
               onSelectStudent?.(null);
             }}
             className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
           >
             <ChevronDown className="w-5 h-5 rotate-90" />
           </Button>
           <h2 className="text-[17px] font-medium tracking-tight text-slate-900 tracking-tight">Student Profile</h2>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-16 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
            
            <div className="w-28 h-28 rounded-[2.2rem] overflow-hidden border-4 border-white shadow-xl relative z-10 bg-slate-50 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              {selectedStudent.avatar_url ? (
                <img 
                  src={selectedStudent.avatar_url} 
                  className="w-full h-full object-cover" 
                  alt={selectedStudent.name}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(selectedStudent.id)} flex items-center justify-center text-white font-black text-3xl uppercase tracking-tight shadow-inner`}>
                  {selectedStudent.name ? selectedStudent.name.trim().charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>
            <h3 className="text-xl font-medium tracking-tight text-slate-900 mt-6 relative z-10">{selectedStudent.name}</h3>
            <p className="text-[13px] text-slate-400 font-medium uppercase tracking-[0.15em] mt-2 relative z-10">
              {studentEnrollment?.course?.title || "No Active Course"}
            </p>
            
            <div className="flex gap-3 mt-8 relative z-10 w-full">
              <Button className="flex-1 bg-slate-900 text-white py-6 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                <MessageSquare className="w-4.5 h-4.5 fill-white/20"/> Message
              </Button>
              <Button variant="outline" className="flex-1 py-6 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-2 border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]">
                <Video className="w-4.5 h-4.5 text-indigo-500"/> Call
              </Button>
            </div>
         </div>

          {/* Student Detail View Key Metrics */}
          <div className="flex gap-3 px-1">
             <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
               <p className="text-2xl font-bold text-slate-900">{selectedStudent.streak}</p>
               <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-2">Streak</p>
             </div>
             <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
               <p className="text-2xl font-bold text-slate-900">85%</p>
               <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-2">Quiz</p>
             </div>
             <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
               <p className="text-2xl font-bold text-slate-900">
                 {completedTopics}/{totalTopics}
               </p>
               <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-2">Topics</p>
             </div>
          </div>

          {/* Learning Preferences & Interests */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
             <div className="flex items-center gap-2.5">
               <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                 <Sparkles className="w-5 h-5" />
               </div>
               <p className="text-[15px] font-medium text-slate-900">Preferences & Interests</p>
             </div>

             {/* Student Filled Interests Tags */}
             <div className="space-y-2">
               <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Filled Interests</span>
               <div className="flex flex-wrap gap-2 pt-1">
                 {(selectedStudent.preferences?.interests || selectedStudent.interests || ["Python Basics", "Web Tech", "Problem Solving"]).map((interest: string) => (
                   <span key={interest} className="text-[11px] bg-indigo-50/50 text-indigo-600 border border-indigo-100/40 px-3 py-1.5 rounded-xl font-semibold shadow-3xs hover:bg-indigo-50 transition-colors">
                     {interest}
                   </span>
                 ))}
               </div>
             </div>

             {/* Filled Questionnaire Grid */}
             <div className="grid grid-cols-2 gap-3.5 pt-2">
               <div className="bg-slate-50/50 border border-slate-100/60 p-3.5 rounded-2xl space-y-1">
                 <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 block">Learning Style</span>
                 <span className="text-[12.5px] font-semibold text-slate-700 block leading-tight">
                   {selectedStudent.preferences?.style || "Hands-on projects"}
                 </span>
               </div>
               <div className="bg-slate-50/50 border border-slate-100/60 p-3.5 rounded-2xl space-y-1">
                 <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 block">Personal Inspiration</span>
                 <span className="text-[12.5px] font-semibold text-slate-700 block leading-tight">
                   {selectedStudent.preferences?.inspiration || "A teacher/mentor"}
                 </span>
               </div>
               <div className="bg-slate-50/50 border border-slate-100/60 p-3.5 rounded-2xl space-y-1">
                 <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 block">Favorite Movie/Genre</span>
                 <span className="text-[12.5px] font-semibold text-slate-700 block leading-tight">
                   {selectedStudent.preferences?.movie || "Sci-fi / Technology"}
                 </span>
               </div>
               <div className="bg-slate-50/50 border border-slate-100/60 p-3.5 rounded-2xl space-y-1">
                 <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 block">Student Location</span>
                 <span className="text-[12.5px] font-semibold text-slate-700 block leading-tight">
                   {selectedStudent.preferences?.location || selectedStudent.location || "Mumbai, India"}
                 </span>
               </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2.5">
                 <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                   <Layers className="w-5 h-5" />
                 </div>
                 <p className="text-[15px] font-medium text-slate-900">{studentEnrollment ? 'Active Curriculum' : 'No Active Curriculum'}</p>
               </div>
               {studentEnrollment && (
                 <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 shadow-3xs uppercase tracking-wider">
                   In Progress
                 </span>
               )}
             </div>

             {studentEnrollment ? (
               <div className="space-y-5">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h4 className="text-[14px] font-medium text-slate-900 leading-tight">{studentEnrollment.course.title}</h4>
                      <p className="text-[12px] text-slate-400 font-medium">Started {new Date(studentEnrollment.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span className="text-xl font-bold text-indigo-600">{progressPercent}%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100/50">
                   <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                 </div>

                 {/* Additional Course Information & Progress Details */}
                 <div className="border-t border-slate-100/60 pt-4 mt-2 space-y-4">
                   {studentEnrollment.course.description && (
                     <div className="space-y-1">
                       <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Course Description</span>
                       <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">
                         {studentEnrollment.course.description}
                       </p>
                     </div>
                   )}
                   
                   <div className="flex gap-4.5 text-[11px] font-medium text-slate-500">
                     <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400"/> {studentEnrollment.course.duration || "12 hours"}</span>
                     <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-slate-400"/> {studentEnrollment.course.difficulty || "Intermediate"}</span>
                     <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-400"/> {(studentEnrollment.course.modules || studentEnrollment.course.content || []).length} Modules</span>
                   </div>

                   {/* Modules Accordion/Progress Checklist */}
                   <div className="space-y-3.5 mt-3 pt-3 border-t border-slate-50">
                     <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Detailed Curriculum Progress</span>
                     <div className="space-y-3">
                       {(studentEnrollment.course.modules || studentEnrollment.course.content || []).map((mod: any, modIdx: number) => {
                         const lessons = mod.lessons || mod.topics || [];
                         return (
                           <div key={mod.id || modIdx} className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                             <div className="flex justify-between items-center">
                               <h5 className="text-[12.5px] font-bold text-slate-800 leading-snug">
                                 {mod.title || `Module ${modIdx + 1}`}
                               </h5>
                               <span className="text-[10px] text-slate-400 font-semibold">{lessons.length} lessons</span>
                             </div>
                             {lessons.length > 0 && (
                               <div className="space-y-2 pl-0.5">
                                 {lessons.map((les: any, lesIdx: number) => {
                                   const lessonId = les.id || `mod-${modIdx}-les-${lesIdx}`;
                                   const isCompleted = (studentEnrollment.progress || []).includes(lessonId);
                                   return (
                                     <div key={lessonId} className="flex items-center justify-between text-[11.5px] font-medium text-slate-600">
                                       <div className="flex items-center gap-2 max-w-[85%]">
                                         <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 bg-white'}`}>
                                           {isCompleted && <Check className="w-2.5 h-2.5" strokeWidth={4} />}
                                         </div>
                                         <span className={`truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                           {les.title || les.name || les}
                                         </span>
                                       </div>
                                       {les.duration && (
                                         <span className="text-[10px] text-slate-400 font-medium shrink-0">{les.duration}</span>
                                       )}
                                     </div>
                                   );
                                 })}
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="py-8 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-[13px] text-slate-400 font-medium">Assign a curriculum to track progress.</p>
               </div>
            )}
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-[15px] font-medium text-slate-900">Mentor Actions</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-3xs"><BookOpen className="w-4 h-4"/></div>
                  <p className="text-[13px] font-medium text-slate-700">Assign New Course</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsCourseCatalogOpen(true)}
                    className="flex-1 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[13px] font-medium h-11 px-4 flex items-center justify-between transition-all shadow-sm text-slate-500 hover:text-slate-700 active:scale-[0.99] text-left"
                  >
                    <span className="truncate">
                      {selectedCourseId 
                        ? (courses.find(c => c.id === selectedCourseId)?.title || "Selected Course")
                        : "Choose curriculum..."
                      }
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </button>
                  <Button 
                    onClick={() => handleAssignCourse()}
                    disabled={isAssigning || !selectedCourseId}
                    className="bg-slate-900 text-white px-5 h-11 rounded-xl text-[13px] font-medium disabled:opacity-50 shrink-0 shadow-lg shadow-slate-900/5 active:scale-95 transition-all"
                  >
                    {isAssigning ? "..." : "Assign"}
                  </Button>
                </div>
              </div>
              
              <button className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-3xs"><Target className="w-4 h-4"/></div>
                  <p className="text-[13px] font-medium text-slate-700">Set Weekly Milestone</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </button>

              <button className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shadow-3xs"><Heart className="w-4 h-4"/></div>
                  <p className="text-[13px] font-medium text-slate-700">Send Kudos</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>
         </div>

          {/* Course Catalog Bottom Sheet */}
          {isCourseCatalogOpen && (
            <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xs z-[100] flex items-end justify-center transition-all">
              <div className="bg-white rounded-t-[2.5rem] w-full sm:max-w-md overflow-hidden shadow-2xl border-t border-slate-100 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                
                {/* Pull handle bar */}
                <div className="w-full flex justify-center py-3.5 bg-[#0f172a] shrink-0 cursor-pointer" onClick={() => setIsCourseCatalogOpen(false)}>
                  <div className="w-12 h-1.5 rounded-full bg-white/20"></div>
                </div>

                {/* Header */}
                <div className="bg-[#0f172a] text-white px-6 pb-6 pt-1 relative shrink-0">
                  <button 
                    onClick={() => setIsCourseCatalogOpen(false)}
                    className="absolute top-2 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3.5 mt-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-amber-400 border border-white/10 shadow-inner">
                      <GraduationCap className="w-5.5 h-5.5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold tracking-tight text-white leading-tight">Explore Learning Paths</h3>
                      <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">CHOOSE FROM EXPERT-DESIGNED COURSES</p>
                    </div>
                  </div>
                </div>

                {/* Course Catalog List */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1 hidden-scrollbar bg-slate-50/30">
                  {courses.map((course) => {
                    const activeModCount = course.modules?.length || course.content?.length || 0;
                    const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || m.topics?.length || 0), 0) || 0;
                    const isActive = studentEnrollment && studentEnrollment.course?.title === course.title;

                    return (
                      <div 
                        key={course.id}
                        className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-4 relative hover:shadow-lg hover:border-slate-200/80 transition-all duration-300 group shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-4 min-w-0">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${course.bgColor || "bg-indigo-500"} text-white shadow-md transition-transform group-hover:scale-105 duration-300`}>
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                              <h4 className="text-[16px] font-black text-slate-900 truncate leading-snug tracking-tight">{course.title}</h4>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.08em] mt-1">
                                {activeModCount} modules · {totalLessons || "Comprehensive"} lessons
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 pt-1">
                            {isActive ? (
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] px-3.5 py-2 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                                <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} /> Assigned
                              </span>
                            ) : (
                              <Button 
                                onClick={() => startCustomizing(course)}
                                disabled={isAssigning}
                                className="bg-[#0f172a] hover:bg-slate-800 text-white text-[11px] font-black px-5 py-2.5 h-auto rounded-full uppercase tracking-wider active:scale-95 transition-all shadow-sm"
                              >
                                + Enroll
                              </Button>
                            )}
                          </div>
                        </div>

                        {course.description && (
                          <p className="text-[13px] text-slate-600 leading-relaxed font-semibold pl-0.5 mt-1 border-t border-slate-50 pt-3">
                            {course.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
       </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between pt-6 md:pt-8 px-1">
        <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight">My Students</h2>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full shadow-sm bg-white border-slate-100 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 px-1">
        {students.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
               <Users className="w-10 h-10" />
             </div>
             <p className="text-slate-400 font-medium">No students assigned to you yet.</p>
          </div>
        ) : (
          students.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedStudent(s)} 
              className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[18px] overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50 group-hover:shadow-md transition-all group-active:scale-95 flex items-center justify-center relative">
                    {s.avatar_url ? (
                      <img 
                        className="w-full h-full object-cover" 
                        src={s.avatar_url} 
                        alt={s.name}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(s.id)} flex items-center justify-center text-white font-black text-xl uppercase tracking-tight shadow-inner`}>
                        {s.name ? s.name.trim().charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm z-10">
                    <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                     <h3 className="text-[16px] font-medium text-slate-900">{s.name}</h3>
                     <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{s.status}</span>
                   </div>
                   <p className="text-[13px] text-slate-500 font-medium mt-1 line-clamp-1">{s.course}</p>
                   <div className="flex items-center gap-3 mt-3">
                     <div className="flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                       <Star className="w-3.5 h-3.5 fill-amber-500"/> {s.streak} Day Streak
                     </div>
                     <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                       <Target className="w-3.5 h-3.5" /> {s.progress}%
                     </div>
                   </div>
                </div>
              </div>
              
              <div className="mt-5">
                 <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                   <span>Curriculum Progress</span>
                   <span className="text-slate-900">{s.progress}%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.progress}%` }}></div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
