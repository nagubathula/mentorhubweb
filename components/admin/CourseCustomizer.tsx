"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  Check,
  PlayCircle,
  Code,
  Brain,
  Award,
  BookOpen,
  ArrowLeft,
  Eye,
  EyeOff,
  Settings,
  Layers,
  ToggleLeft,
  ToggleRight,
  Upload,
  Download,
  FileUp,
  Sparkles,
} from "lucide-react";
import { MentorCourse, MentorModule, MentorLesson } from "@/lib/mentorCoursesData";
import { cn } from "@/lib/utils";

// ── Types ──

interface EditableCourse {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  enrolled: boolean;
  modules: EditableModule[];
}

interface EditableModule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  lessons: EditableLesson[];
}

interface EditableLesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "exercise" | "quiz" | "project" | "reading";
  enabled: boolean;
}

function courseToEditable(course: MentorCourse): EditableCourse {
  return {
    id: course?.id || `c-${Date.now()}`,
    title: course?.title || "",
    shortTitle: course?.shortTitle || "",
    description: course?.description || "",
    category: course?.category || "Engineering",
    difficulty: course?.difficulty || "Beginner",
    duration: course?.duration || "10h",
    enrolled: course?.enrolled || false,
    modules: course?.modules?.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      enabled: true,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        type: l.type,
        enabled: true,
      })),
    })) || [],
  };
}

const lessonTypeOptions: { value: EditableLesson["type"]; label: string }[] = [
  { value: "video", label: "Video" },
  { value: "exercise", label: "Exercise" },
  { value: "quiz", label: "Quiz" },
  { value: "project", label: "Project" },
  { value: "reading", label: "Reading" },
];

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video": return <PlayCircle className="w-3.5 h-3.5 text-blue-500" />;
    case "exercise": return <Code className="w-3.5 h-3.5 text-emerald-500" />;
    case "quiz": return <Brain className="w-3.5 h-3.5 text-amber-500" />;
    case "project": return <Award className="w-3.5 h-3.5 text-violet-500" />;
    default: return <BookOpen className="w-3.5 h-3.5 text-gray-400" />;
  }
};

const getLessonColor = (type: string) => {
  switch (type) {
    case "video": return "bg-blue-50 text-blue-600 border-blue-200";
    case "exercise": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "quiz": return "bg-amber-50 text-amber-600 border-amber-200";
    case "project": return "bg-violet-50 text-violet-600 border-violet-200";
    default: return "bg-gray-50 text-gray-500 border-gray-200";
  }
};

// ── Admin Course Customizer (Desktop) ──

export function CourseCustomizer({
  initialCourse,
  onCancel,
  onSave,
}: {
  initialCourse: MentorCourse;
  onCancel: () => void;
  onSave: (data: EditableCourse) => void;
}) {
  const [data, setData] = useState<EditableCourse>(() => courseToEditable(initialCourse));
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [addingModuleMode, setAddingModuleMode] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateModule = (moduleId: string, updates: Partial<EditableModule>) => {
    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<EditableLesson>) => {
    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
          : m
      ),
    }));
  };

  const addModule = () => {
    if (!newModuleTitle.trim()) return;
    const newMod: EditableModule = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle.trim(),
      description: newModuleDesc.trim() || "New module",
      enabled: true,
      lessons: [],
    };
    setData((prev) => ({ ...prev, modules: [...prev.modules, newMod] }));
    setNewModuleTitle("");
    setNewModuleDesc("");
    setAddingModuleMode(false);
    setExpandedModule(newMod.id);
  };

  const removeModule = (moduleId: string) => {
    setData((prev) => ({ ...prev, modules: prev.modules.filter((m) => m.id !== moduleId) }));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: EditableLesson = {
      id: `les-${Date.now()}`,
      title: "New Lesson",
      duration: "10 min",
      type: "video",
      enabled: true,
    };
    updateModule(moduleId, {
      lessons: [...(data.modules.find((m) => m.id === moduleId)?.lessons || []), newLesson],
    });
    setEditingLesson(newLesson.id);
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    const mod = data.modules.find((m) => m.id === moduleId);
    if (mod) {
      updateModule(moduleId, { lessons: mod.lessons.filter((l) => l.id !== lessonId) });
    }
  };

  const moveModule = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= data.modules.length) return;
    const newModules = [...data.modules];
    [newModules[idx], newModules[newIdx]] = [newModules[newIdx], newModules[idx]];
    setData((prev) => ({ ...prev, modules: newModules }));
  };

  const moveLesson = (moduleId: string, lessonIdx: number, dir: -1 | 1) => {
    const mod = data.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const newIdx = lessonIdx + dir;
    if (newIdx < 0 || newIdx >= mod.lessons.length) return;
    const newLessons = [...mod.lessons];
    [newLessons[lessonIdx], newLessons[newIdx]] = [newLessons[newIdx], newLessons[lessonIdx]];
    updateModule(moduleId, { lessons: newLessons });
  };

  const enabledModules = data.modules.filter((m) => m.enabled).length;
  const enabledLessons = data.modules.reduce((a, m) => a + m.lessons.filter((l) => l.enabled).length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        className="bg-white rounded-[1.85rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Course Architect</h2>
              <p className="text-gray-400 text-[13px] font-medium">{enabledModules} modules · {enabledLessons} lessons active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.span
                  className="text-emerald-600 text-sm font-bold flex items-center gap-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Check className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-[13px] font-black uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Course Info */}
          <div className="px-8 py-8 border-b border-gray-50 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Course Title</label>
                <input
                  value={data.title}
                  onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-gray-100 focus:border-gray-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Short Title</label>
                <input
                  value={data.shortTitle}
                  onChange={(e) => setData((prev) => ({ ...prev, shortTitle: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-gray-100 focus:border-gray-300 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-gray-100 focus:border-gray-300 focus:bg-white transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Category</label>
                <input
                  value={data.category}
                  onChange={(e) => setData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-gray-100 focus:border-gray-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Difficulty</label>
                <select
                  value={data.difficulty}
                  onChange={(e) => setData((prev) => ({ ...prev, difficulty: e.target.value as EditableCourse["difficulty"] }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-gray-100 focus:border-gray-300 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Duration</label>
                <input
                  value={data.duration}
                  onChange={(e) => setData((prev) => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-gray-100 focus:border-gray-300 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-black text-lg uppercase tracking-tight">Curriculum ({data.modules.length})</h3>
              <button
                onClick={() => setAddingModuleMode(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[12px] font-black uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                <Plus className="w-4 h-4" /> Add Module
              </button>
            </div>

            {/* Add module form */}
            <AnimatePresence>
              {addingModuleMode && (
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 space-y-4 shadow-inner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Module title"
                    className="w-full px-4 py-3 bg-white rounded-xl text-[14px] font-bold text-gray-900 outline-none border border-blue-200 focus:border-blue-400 shadow-sm"
                    autoFocus
                  />
                  <input
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    placeholder="Module description"
                    className="w-full px-4 py-3 bg-white rounded-xl text-[14px] font-medium text-gray-900 outline-none border border-blue-200 focus:border-blue-400 shadow-sm"
                  />
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={addModule}
                      disabled={!newModuleTitle.trim()}
                      className="px-6 py-2 bg-blue-600 text-white text-[12px] font-black uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
                    >
                      Add Module
                    </button>
                    <button
                      onClick={() => { setAddingModuleMode(false); setNewModuleTitle(""); setNewModuleDesc(""); }}
                      className="px-6 py-2 text-gray-500 text-[12px] font-bold hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {data.modules.map((mod, modIdx) => {
                const isExpanded = expandedModule === mod.id;
                const isEditing = editingModule === mod.id;

                return (
                  <div
                    key={mod.id}
                    className={`border rounded-[1.5rem] overflow-hidden transition-all shadow-sm ${mod.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-70"}`}
                  >
                    {/* Module header */}
                    <div className="flex items-center gap-4 px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveModule(modIdx, -1)}
                          className="text-gray-300 hover:text-gray-500 transition-colors p-0.5"
                          disabled={modIdx === 0}
                        >
                          <ChevronDown className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => moveModule(modIdx, 1)}
                          className="text-gray-300 hover:text-gray-500 transition-colors p-0.5"
                          disabled={modIdx === data.modules.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                        className="flex-1 flex items-center gap-4 text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-[13px] font-black shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all">
                          {modIdx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              value={mod.title}
                              onChange={(e) => updateModule(mod.id, { title: e.target.value })}
                              className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-[15px] font-bold text-gray-900 outline-none border border-gray-200 focus:border-gray-400"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          ) : (
                            <p className="text-gray-900 text-[15px] font-black group-hover:text-blue-600 transition-colors truncate">{mod.title}</p>
                          )}
                          {isEditing ? (
                            <input
                              value={mod.description}
                              onChange={(e) => updateModule(mod.id, { description: e.target.value })}
                              className="w-full px-3 py-1.5 mt-2 bg-gray-50 rounded-lg text-xs text-gray-500 outline-none border border-gray-200 focus:border-gray-400"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <p className="text-gray-400 text-xs mt-0.5 font-medium truncate">{mod.lessons.length} lessons · {mod.description}</p>
                          )}
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingModule(isEditing ? null : mod.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isEditing ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-400"}`}
                        >
                          {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => updateModule(mod.id, { enabled: !mod.enabled })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all"
                        >
                          {mod.enabled ? (
                            <Eye className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                        <button
                          onClick={() => removeModule(mod.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded lessons */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          className="border-t border-gray-100 bg-gray-50/30 px-6 py-5"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="space-y-2">
                            {mod.lessons.map((lesson, lesIdx) => {
                              const isLessonEditing = editingLesson === lesson.id;
                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all shadow-sm ${lesson.enabled ? "bg-white border border-gray-100" : "bg-gray-50 opacity-60"}`}
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <button onClick={() => moveLesson(mod.id, lesIdx, -1)} className="text-gray-300 hover:text-gray-500 transition-colors" disabled={lesIdx === 0}>
                                      <ChevronDown className="w-3 h-3 rotate-180" />
                                    </button>
                                    <button onClick={() => moveLesson(mod.id, lesIdx, 1)} className="text-gray-300 hover:text-gray-500 transition-colors" disabled={lesIdx === mod.lessons.length - 1}>
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  {isLessonEditing ? (
                                    <div className="flex-1 flex flex-wrap items-center gap-3">
                                      <input
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })}
                                        className="flex-1 min-w-[200px] px-3 py-1.5 bg-gray-50 rounded-lg text-[13px] font-bold outline-none border border-gray-200 focus:border-gray-400 text-gray-900"
                                      />
                                      <select
                                        value={lesson.type}
                                        onChange={(e) => updateLesson(mod.id, lesson.id, { type: e.target.value as EditableLesson["type"] })}
                                        className="px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-black uppercase tracking-wider outline-none border border-gray-200 text-gray-700 cursor-pointer"
                                      >
                                        {lessonTypeOptions.map((o) => (
                                          <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                      </select>
                                      <input
                                        value={lesson.duration}
                                        onChange={(e) => updateLesson(mod.id, lesson.id, { duration: e.target.value })}
                                        className="w-24 px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-bold outline-none border border-gray-200 text-gray-700"
                                      />
                                    </div>
                                  ) : (
                                    <p className="flex-1 text-gray-700 text-[13px] font-bold truncate">{lesson.title}</p>
                                  )}
                                  {!isLessonEditing && (
                                    <>
                                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getLessonColor(lesson.type)}`}>{lesson.type}</span>
                                      <span className="text-gray-400 text-[11px] font-black w-16 text-right uppercase tracking-tighter">{lesson.duration}</span>
                                    </>
                                  )}
                                  <div className="flex items-center gap-1 ml-2">
                                    <button
                                      onClick={() => setEditingLesson(isLessonEditing ? null : lesson.id)}
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isLessonEditing ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-400"}`}
                                    >
                                      {isLessonEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      onClick={() => updateLesson(mod.id, lesson.id, { enabled: !lesson.enabled })}
                                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all"
                                    >
                                      {lesson.enabled ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-gray-300" />}
                                    </button>
                                    <button
                                      onClick={() => removeLesson(mod.id, lesson.id)}
                                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => addLesson(mod.id)}
                            className="mt-4 flex items-center gap-2 px-4 py-2 text-blue-600 text-[11px] font-black uppercase tracking-wider hover:bg-white rounded-xl transition-all border border-dashed border-blue-100 hover:border-blue-300"
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
        </div>
      </motion.div>
    </div>
  );
}


// ── Mentor Course Customizer (Mobile Overlay) ──

export function MentorCourseCustomizer({
  courses,
  onClose,
}: {
  courses: MentorCourse[];
  onClose: () => void;
}) {
  const [editableCourses, setEditableCourses] = useState<EditableCourse[]>(() =>
    courses.map(courseToEditable)
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showUploadIndex, setShowUploadIndex] = useState(false);
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [uploadParsedMods, setUploadParsedMods] = useState<{ title: string; description: string; lessons: { title: string; duration: string; type: string }[] }[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const selectedCourse = editableCourses.find((c) => c.id === selectedCourseId);

  const updateCourse = (courseId: string, updates: Partial<EditableCourse>) => {
    setEditableCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...updates } : c)));
  };

  const updateModuleInCourse = (courseId: string, moduleId: string, updates: Partial<EditableModule>) => {
    setEditableCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, modules: c.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)) }
          : c
      )
    );
  };

  const updateLessonInCourse = (courseId: string, moduleId: string, lessonId: string, updates: Partial<EditableLesson>) => {
    setEditableCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId
                  ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
                  : m
              ),
            }
          : c
      )
    );
  };

  const addLessonToCourse = (courseId: string, moduleId: string) => {
    const course = editableCourses.find((c) => c.id === courseId);
    const mod = course?.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const newLesson: EditableLesson = {
      id: `les-${Date.now()}`,
      title: "New Lesson",
      duration: "10 min",
      type: "video",
      enabled: true,
    };
    updateModuleInCourse(courseId, moduleId, { lessons: [...mod.lessons, newLesson] });
  };

  const removeLessonFromCourse = (courseId: string, moduleId: string, lessonId: string) => {
    const course = editableCourses.find((c) => c.id === courseId);
    const mod = course?.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    updateModuleInCourse(courseId, moduleId, { lessons: mod.lessons.filter((l) => l.id !== lessonId) });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Upload Index Helpers ──
  const parseUploadCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) { setUploadErrors(["File is empty"]); return; }
    const mods: typeof uploadParsedMods = []; const errs: string[] = [];
    const validTypes = ["video", "exercise", "quiz", "project", "reading"];
    for (let i = 1; i < lines.length; i++) {
      const parts: string[] = []; let cur = ""; let inQ = false;
      for (const ch of lines[i]) { if (ch === '"') inQ = !inQ; else if (ch === "," && !inQ) { parts.push(cur.trim()); cur = ""; } else cur += ch; }
      parts.push(cur.trim());
      const [mt, md, lt, ld, lty] = parts;
      if (!mt || !lt) { errs.push(`Row ${i+1}: Missing module/lesson title`); continue; }
      let mod = mods.find(m => m.title === mt);
      if (!mod) { mod = { title: mt, description: md || "", lessons: [] }; mods.push(mod); }
      mod.lessons.push({ title: lt, duration: ld || "10 min", type: validTypes.includes(lty) ? lty : "video" });
    }
    setUploadParsedMods(mods); setUploadErrors(errs);
  };

  const parseUploadJSON = (text: string) => {
    try {
      const data = JSON.parse(text); const raw = data.modules || data;
      if (!Array.isArray(raw)) { setUploadErrors(["JSON must be an array or have 'modules'"]); return; }
      const mods: typeof uploadParsedMods = []; const errs: string[] = [];
      raw.forEach((m: any, i: number) => {
        if (!m.title) { errs.push(`Module ${i+1}: Missing title`); return; }
        const lessons = (m.lessons || []).filter((l: any) => l.title).map((l: any) => ({ title: l.title, duration: l.duration || "10 min", type: l.type || "video" }));
        mods.push({ title: m.title, description: m.description || "", lessons });
      });
      setUploadParsedMods(mods); setUploadErrors(errs);
    } catch { setUploadErrors(["Invalid JSON format"]); }
  };

  const handleUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { const t = e.target?.result as string; file.name.endsWith(".json") ? parseUploadJSON(t) : parseUploadCSV(t); };
    reader.readAsText(file);
  };

  const confirmUploadIndex = () => {
    if (!selectedCourseId || uploadParsedMods.length === 0) return;
    const newMods: EditableModule[] = uploadParsedMods.map((m, mi) => ({
      id: `up-m${Date.now()}-${mi}`, title: m.title, description: m.description, enabled: true,
      lessons: m.lessons.map((l, li) => ({ id: `up-l${Date.now()}-${mi}-${li}`, title: l.title, duration: l.duration, type: l.type as EditableLesson["type"], enabled: true })),
    }));
    const course = editableCourses.find(c => c.id === selectedCourseId);
    if (course) updateCourse(selectedCourseId, { modules: [...course.modules, ...newMods] });
    setUploadParsedMods([]); setUploadErrors([]); setShowUploadIndex(false);
  };

  const downloadIndexTemplate = () => {
    const t = `module_title,module_description,lesson_title,lesson_duration,lesson_type\nModule 1,Description here,Lesson 1,12 min,video\nModule 1,Description here,Lesson 2,15 min,exercise\nModule 2,Another module,Lesson 3,18 min,video\nModule 2,Another module,Quiz,8 min,quiz`;
    const b = new Blob([t], { type: "text/csv" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "course_index_template.csv"; a.click(); URL.revokeObjectURL(u);
  };

  // Course list view
  if (!selectedCourse) {
    return (
      <motion.div
        className="absolute inset-0 z-40 bg-gray-50 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-3 pb-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <p className="text-white/90 text-xs">Customize Courses</p>
            <div className="w-8" />
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-sm">Course Manager</p>
            <p className="text-white/70 text-xs mt-0.5">{editableCourses.length} courses available</p>
          </div>
        </div>

        {/* Course List */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-2.5">
          {editableCourses.map((course, i) => {
            const enabledMods = course.modules.filter((m) => m.enabled).length;
            const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
            return (
              <motion.button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className="w-full bg-white rounded-xl p-3.5 text-left active:scale-[0.98] transition-transform border border-gray-100"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-xs truncate">{course.title}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">
                      {enabledMods}/{course.modules.length} modules · {totalLessons} lessons · {course.difficulty}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Course detail/edit view
  const enabledModules = selectedCourse.modules.filter((m) => m.enabled).length;

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-gray-50 flex flex-col"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-3 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => { setSelectedCourseId(null); setExpandedModule(null); }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <p className="text-white/90 text-xs">Edit Course</p>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs active:scale-95 transition-transform flex items-center gap-1"
          >
            {saved ? <><Check className="w-3 h-3" /> Saved!</> : <><Save className="w-3 h-3" /> Save</>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-3">
        {/* Course Info */}
        <div className="bg-white rounded-xl p-3.5 border border-gray-100 space-y-3">
          <div>
            <label className="text-gray-400 text-[10px] mb-1 block">Course Title</label>
            <input
              value={selectedCourse.title}
              onChange={(e) => updateCourse(selectedCourse.id, { title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-900 outline-none border border-gray-100 focus:border-emerald-300"
            />
          </div>
          <div>
            <label className="text-gray-400 text-[10px] mb-1 block">Description</label>
            <textarea
              value={selectedCourse.description}
              onChange={(e) => updateCourse(selectedCourse.id, { description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-900 outline-none border border-gray-100 focus:border-emerald-300 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-gray-400 text-[10px] mb-1 block">Difficulty</label>
              <select
                value={selectedCourse.difficulty}
                onChange={(e) => updateCourse(selectedCourse.id, { difficulty: e.target.value as EditableCourse["difficulty"] })}
                className="w-full px-2 py-2 bg-gray-50 rounded-lg text-xs text-gray-900 outline-none border border-gray-100"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] mb-1 block">Duration</label>
              <input
                value={selectedCourse.duration}
                onChange={(e) => updateCourse(selectedCourse.id, { duration: e.target.value })}
                className="w-full px-2 py-2 bg-gray-50 rounded-lg text-xs text-gray-900 outline-none border border-gray-100"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] mb-1 block">Category</label>
              <input
                value={selectedCourse.category}
                onChange={(e) => updateCourse(selectedCourse.id, { category: e.target.value })}
                className="w-full px-2 py-2 bg-gray-50 rounded-lg text-xs text-gray-900 outline-none border border-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Module stats */}
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <p className="text-emerald-800 text-xs">{enabledModules}/{selectedCourse.modules.length} modules active</p>
            </div>
            <p className="text-emerald-600 text-[10px]">
              {selectedCourse.modules.reduce((a, m) => a + m.lessons.filter((l) => l.enabled).length, 0)} lessons enabled
            </p>
          </div>
        </div>

        {/* Upload Index */}
        <button
          onClick={() => { setShowUploadIndex(!showUploadIndex); setUploadParsedMods([]); setUploadErrors([]); }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all ${showUploadIndex ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-100 active:scale-[0.98]"}`}
        >
          <Upload className="w-4 h-4" />
          <span className="flex-1 text-left">Upload Course Index</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showUploadIndex ? "rotate-180" : ""}`} />
        </button>

        {showUploadIndex && (
          <div className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-[10px]">Upload CSV or JSON with modules & lessons</p>
              <button onClick={downloadIndexTemplate} className="text-emerald-600 text-[10px] flex items-center gap-1 hover:underline"><Download className="w-3 h-3" /> Template</button>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setUploadDragOver(true); }}
              onDragLeave={() => setUploadDragOver(false)}
              onDrop={e => { e.preventDefault(); setUploadDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUploadFile(f); }}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${uploadDragOver ? "border-emerald-400 bg-emerald-50" : "border-gray-200"}`}
            >
              <FileUp className={`w-7 h-7 mx-auto mb-1.5 ${uploadDragOver ? "text-emerald-400" : "text-gray-300"}`} />
              <p className="text-gray-400 text-[10px] mb-2">Drag & drop or browse</p>
              <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg cursor-pointer active:scale-95 transition-transform">
                <Upload className="w-3 h-3" /> Browse Files
                <input type="file" accept=".csv,.json" onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadFile(f); }} className="hidden" />
              </label>
            </div>

            <p className="text-gray-300 text-[10px]">CSV: module_title, module_description, lesson_title, lesson_duration, lesson_type</p>

            {uploadErrors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                {uploadErrors.slice(0, 3).map((e, i) => <p key={i} className="text-red-600 text-[10px]">{e}</p>)}
                {uploadErrors.length > 3 && <p className="text-red-400 text-[10px]">+{uploadErrors.length - 3} more errors</p>}
              </div>
            )}

            {uploadParsedMods.length > 0 && (
              <div className="space-y-2">
                <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="text-emerald-700 text-[10px]">{uploadParsedMods.length} modules · {uploadParsedMods.reduce((a, m) => a + m.lessons.length, 0)} lessons ready</p>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {uploadParsedMods.map((mod, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg px-2.5 py-1.5">
                      <p className="text-gray-900 text-[10px]">{mod.title} <span className="text-gray-400">({mod.lessons.length} lessons)</span></p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={confirmUploadIndex} className="flex-1 py-2 bg-gray-900 text-white text-[10px] rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Add {uploadParsedMods.length} Modules
                  </button>
                  <button onClick={() => { setUploadParsedMods([]); setUploadErrors([]); }} className="px-3 py-2 bg-gray-100 text-gray-500 text-[10px] rounded-lg">Clear</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modules */}
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Modules</p>
          <div className="space-y-2">
            {selectedCourse.modules.map((mod, modIdx) => {
              const isExpanded = expandedModule === mod.id;
              return (
                <motion.div
                  key={mod.id}
                  className={`bg-white rounded-xl border overflow-hidden transition-all ${mod.enabled ? "border-gray-100" : "border-gray-100 opacity-60"}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: mod.enabled ? 1 : 0.6, y: 0 }}
                  transition={{ delay: modIdx * 0.03 }}
                >
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] shrink-0">
                      {modIdx + 1}
                    </div>
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      <p className="text-gray-900 text-xs truncate">{mod.title}</p>
                      <p className="text-gray-400 text-[10px]">{mod.lessons.length} lessons</p>
                    </button>
                    <button
                      onClick={() => updateModuleInCourse(selectedCourse.id, mod.id, { enabled: !mod.enabled })}
                      className="shrink-0"
                    >
                      {mod.enabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-300 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-50 px-3 py-2.5 bg-gray-50/50 space-y-1.5">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all ${lesson.enabled ? "bg-white" : "bg-gray-50 opacity-50"}`}
                        >
                          {getLessonIcon(lesson.type)}
                          {editingField === lesson.id ? (
                            <input
                              value={lesson.title}
                              onChange={(e) => updateLessonInCourse(selectedCourse.id, mod.id, lesson.id, { title: e.target.value })}
                              onBlur={() => setEditingField(null)}
                              className="flex-1 px-2 py-0.5 bg-gray-50 rounded text-xs text-gray-900 outline-none border border-gray-200 focus:border-emerald-300"
                              autoFocus
                            />
                          ) : (
                            <p className="flex-1 text-gray-700 text-xs truncate">{lesson.title}</p>
                          )}
                          <span className="text-gray-400 text-[10px]">{lesson.duration}</span>
                          <button onClick={() => setEditingField(editingField === lesson.id ? null : lesson.id)} className="shrink-0">
                            <Edit3 className="w-3 h-3 text-gray-300" />
                          </button>
                          <button
                            onClick={() => updateLessonInCourse(selectedCourse.id, mod.id, lesson.id, { enabled: !lesson.enabled })}
                            className="shrink-0"
                          >
                            {lesson.enabled ? (
                              <Eye className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-gray-300" />
                            )}
                          </button>
                          <button
                            onClick={() => removeLessonFromCourse(selectedCourse.id, mod.id, lesson.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="w-3 h-3 text-gray-300" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addLessonToCourse(selectedCourse.id, mod.id)}
                        className="w-full flex items-center justify-center gap-1 py-2 text-emerald-600 text-[10px] hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Lesson
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Mentor Single Course Customizer (Mobile Overlay) ──
// For mentors to customize only the course they are mentoring (e.g. Python)

interface SyllabusEditableModule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  lessons: SyllabusEditableLesson[];
}

interface SyllabusEditableLesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "exercise" | "quiz" | "project" | "reading";
  enabled: boolean;
}

function syllabusToEditable(modules: MentorModule[]): SyllabusEditableModule[] {
  return modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    enabled: true,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      type: l.type as SyllabusEditableLesson["type"],
      enabled: true,
    })),
  }));
}

export function MentorMyCourseCustomizer({
  courseTitle,
  syllabus,
  onClose,
  onSave,
}: {
  courseTitle: string;
  syllabus: MentorModule[];
  onClose: () => void;
  onSave?: (modules: MentorModule[]) => void;
}) {
  const [modules, setModules] = useState<SyllabusEditableModule[]>(() =>
    syllabusToEditable(syllabus)
  );
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [addingModule, setAddingModule] = useState(false);
  const [newModTitle, setNewModTitle] = useState("");
  const [newModDesc, setNewModDesc] = useState("");
  const [editingModuleTitle, setEditingModuleTitle] = useState<string | null>(null);
  const [showUpIdx, setShowUpIdx] = useState(false);
  const [upIdxDrag, setUpIdxDrag] = useState(false);
  const [upIdxMods, setUpIdxMods] = useState<{ title: string; description: string; lessons: { title: string; duration: string; type: string }[] }[]>([]);
  const [upIdxErrs, setUpIdxErrs] = useState<string[]>([]);

  const parseIdxCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) { setUpIdxErrs(["File is empty"]); return; }
    const mods: typeof upIdxMods = []; const errs: string[] = [];
    const vt = ["video","exercise","quiz","project","reading"];
    for (let i = 1; i < lines.length; i++) {
      const parts: string[] = []; let cur = ""; let inQ = false;
      for (const ch of lines[i]) { if (ch === '"') inQ = !inQ; else if (ch === "," && !inQ) { parts.push(cur.trim()); cur = ""; } else cur += ch; }
      parts.push(cur.trim());
      const [mt, md, lt, ld, lty] = parts;
      if (!mt || !lt) { errs.push(`Row ${i+1}: Missing title`); continue; }
      let mod = mods.find(m => m.title === mt);
      if (!mod) { mod = { title: mt, description: md || "", lessons: [] }; mods.push(mod); }
      mod.lessons.push({ title: lt, duration: ld || "10 min", type: vt.includes(lty) ? lty : "video" });
    }
    setUpIdxMods(mods); setUpIdxErrs(errs);
  };
  const parseIdxJSON = (text: string) => {
    try {
      const data = JSON.parse(text); const raw = data.modules || data;
      if (!Array.isArray(raw)) { setUpIdxErrs(["Need array or {modules:[...]}"]); return; }
      const mods: typeof upIdxMods = []; const errs: string[] = [];
      raw.forEach((m: any, i: number) => {
        if (!m.title) { errs.push(`Module ${i+1}: No title`); return; }
        mods.push({ title: m.title, description: m.description || "", lessons: (m.lessons || []).filter((l: any) => l.title).map((l: any) => ({ title: l.title, duration: l.duration || "10 min", type: l.type || "video" })) });
      });
      setUpIdxMods(mods); setUpIdxErrs(errs);
    } catch { setUpIdxErrs(["Invalid JSON"]); }
  };
  const handleIdxFile = (file: File) => { const r = new FileReader(); r.onload = e => { const t = e.target?.result as string; file.name.endsWith(".json") ? parseIdxJSON(t) : parseIdxCSV(t); }; r.readAsText(file); };
  const confirmIdxUpload = () => {
    if (upIdxMods.length === 0) return;
    const newMods: SyllabusEditableModule[] = upIdxMods.map((m, mi) => ({
      id: `up-${Date.now()}-${mi}`, title: m.title, description: m.description, enabled: true,
      lessons: m.lessons.map((l, li) => ({ id: `up-l-${Date.now()}-${mi}-${li}`, title: l.title, duration: l.duration, type: l.type as SyllabusEditableLesson["type"], enabled: true })),
    }));
    setModules(prev => [...prev, ...newMods]); setUpIdxMods([]); setUpIdxErrs([]); setShowUpIdx(false);
  };
  const downloadIdxTemplate = () => {
    const t = `module_title,module_description,lesson_title,lesson_duration,lesson_type\nModule 1,Description,Lesson 1,12 min,video\nModule 1,Description,Lesson 2,15 min,exercise\nModule 2,Another,Lesson 3,18 min,video\nModule 2,Another,Quiz,8 min,quiz`;
    const b = new Blob([t], { type: "text/csv" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "index_template.csv"; a.click(); URL.revokeObjectURL(u);
  };

  const enabledModules = modules.filter((m) => m.enabled).length;
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const enabledLessons = modules.reduce(
    (a, m) => a + m.lessons.filter((l) => l.enabled).length,
    0
  );

  const updateModule = (id: string, updates: Partial<SyllabusEditableModule>) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<SyllabusEditableLesson>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
          : m
      )
    );
  };

  const addLesson = (moduleId: string) => {
    const newLesson: SyllabusEditableLesson = { id: `les-${Date.now()}`, title: "New Lesson", duration: "10 min", type: "video", enabled: true };
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) {
      updateModule(moduleId, { lessons: [...mod.lessons, newLesson] });
      setEditingField(newLesson.id);
    }
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) updateModule(moduleId, { lessons: mod.lessons.filter((l) => l.id !== lessonId) });
  };

  const addNewModule = () => {
    if (!newModTitle.trim()) return;
    const newMod: SyllabusEditableModule = { id: `mod-${Date.now()}`, title: newModTitle.trim(), description: newModDesc.trim() || "New module", enabled: true, lessons: [] };
    setModules((prev) => [...prev, newMod]);
    setNewModTitle("");
    setNewModDesc("");
    setAddingModule(false);
    setExpandedModule(newMod.id);
  };

  const removeModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    if (expandedModule === id) setExpandedModule(null);
  };

  const moveModule = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= modules.length) return;
    const arr = [...modules];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setModules(arr);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <PlayCircle />;
      case "exercise": return <Code />;
      case "quiz": return <Brain />;
      case "project": return <Award />;
      default: return <BookOpen />;
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[100] mesh-bg flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      {/* Header */}
      <div className="bg-[#0f172a] px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-32 translate-x-32" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </motion.button>
          <div className="text-center">
            <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Syllabus Architect</p>
            <h2 className="text-white text-[16px] font-black tracking-tight">{courseTitle}</h2>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { if (onSave) onSave(modules as unknown as MentorModule[]); setSaved(true); }}
            className="px-4 py-2 bg-blue-600 rounded-xl text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-900/20"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : "Save"}
          </motion.button>
        </div>

        <div className="flex items-center justify-center gap-6 relative z-10">
          <div className="text-center">
            <p className="text-white text-xl font-black">{modules.length}</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Modules</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-white text-xl font-black">{enabledLessons}</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Active</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 space-y-6">
        {/* Info Banner */}
        <div className="glass-panel rounded-3xl p-5 border-indigo-100/50">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-slate-900 font-black text-sm uppercase tracking-tight">Personalize for Mentees</p>
              <p className="text-slate-500 text-[12px] mt-1 leading-relaxed font-medium">
                Toggle modules, rename lessons, or upload a custom index. These changes only affect students assigned to you.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Index */}
        <button
          onClick={() => { setShowUpIdx(!showUpIdx); setUpIdxMods([]); setUpIdxErrs([]); }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all ${showUpIdx ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-100 active:scale-[0.98]"}`}
        >
          <Upload className="w-4 h-4" />
          <span className="flex-1 text-left">Upload Course Index</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showUpIdx ? "rotate-180" : ""}`} />
        </button>

        {showUpIdx && (
          <div className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-[10px]">Upload CSV or JSON with modules & lessons</p>
              <button onClick={downloadIdxTemplate} className="text-blue-600 text-[10px] flex items-center gap-1 hover:underline"><Download className="w-3 h-3" /> Template</button>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setUpIdxDrag(true); }}
              onDragLeave={() => setUpIdxDrag(false)}
              onDrop={e => { e.preventDefault(); setUpIdxDrag(false); const f = e.dataTransfer.files[0]; if (f) handleIdxFile(f); }}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${upIdxDrag ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}
            >
              <FileUp className={`w-7 h-7 mx-auto mb-1.5 ${upIdxDrag ? "text-blue-400" : "text-gray-300"}`} />
              <p className="text-gray-400 text-[10px] mb-2">Drag & drop or browse</p>
              <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg cursor-pointer active:scale-95 transition-transform">
                <Upload className="w-3 h-3" /> Browse Files
                <input type="file" accept=".csv,.json" onChange={e => { const f = e.target.files?.[0]; if (f) handleIdxFile(f); }} className="hidden" />
              </label>
            </div>

            <p className="text-gray-300 text-[10px]">CSV columns: module_title, module_description, lesson_title, lesson_duration, lesson_type</p>

            {upIdxErrs.length > 0 && (
              <div className="bg-red-50 rounded-lg p-2 border border-red-100">
                {upIdxErrs.slice(0, 3).map((e, i) => <p key={i} className="text-red-600 text-[10px]">{e}</p>)}
                {upIdxErrs.length > 3 && <p className="text-red-400 text-[10px]">+{upIdxErrs.length - 3} more</p>}
              </div>
            )}

            {upIdxMods.length > 0 && (
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  <p className="text-blue-700 text-[10px]">{upIdxMods.length} modules · {upIdxMods.reduce((a, m) => a + m.lessons.length, 0)} lessons ready</p>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1">
                  {upIdxMods.map((mod, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg px-2.5 py-1.5">
                      <p className="text-gray-900 text-[10px]">{mod.title} <span className="text-gray-400">({mod.lessons.length} lessons)</span></p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={confirmIdxUpload} className="flex-1 py-2 bg-gray-900 text-white text-[10px] rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Add {upIdxMods.length} Modules
                  </button>
                  <button onClick={() => { setUpIdxMods([]); setUpIdxErrs([]); }} className="px-3 py-2 bg-gray-100 text-gray-500 text-[10px] rounded-lg">Clear</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Module List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]">Syllabus Modules</h3>
            <button 
              onClick={() => setAddingModule(true)}
              className="text-blue-600 text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Add New
            </button>
          </div>

          <AnimatePresence>
            {addingModule && (
              <motion.div 
                className="glass-card rounded-[1.5rem] p-6 border-blue-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Module Title</label>
                    <input autoFocus placeholder="Enter title..." value={newModTitle} onChange={(e) => setNewModTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-400" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddingModule(false)} className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold">Cancel</button>
                    <button onClick={addNewModule} disabled={!newModTitle.trim()} className={cn("flex-1 py-3 rounded-xl text-xs font-bold transition-all", newModTitle.trim() ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-300")}>Create Module</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        <div className="space-y-3">
            {modules.map((mod, modIdx) => (
              <motion.div 
                key={mod.id}
                className={cn("bg-white/70 backdrop-blur-md rounded-[1.5rem] overflow-hidden border border-white shadow-lg", mod.enabled ? "opacity-100" : "opacity-40 grayscale-[0.5]")}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateModule(mod.id, { enabled: !mod.enabled })}
                      className={cn("w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all", mod.enabled ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-300 shadow-none")}
                    >
                      {mod.enabled ? <Check className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex-1 min-w-0" onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                      {editingModuleTitle === mod.id ? (
                        <input 
                          autoFocus
                          value={mod.title}
                          onChange={(e) => updateModule(mod.id, { title: e.target.value })}
                          onBlur={() => setEditingModuleTitle(null)}
                          className="bg-transparent border-none p-0 text-slate-900 font-black text-sm outline-none w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h4 className="text-slate-900 font-black text-[15px] truncate tracking-tight">{mod.title}</h4>
                      )}
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">
                        {mod.lessons.filter(l => l.enabled).length}/{mod.lessons.length} Active · Mod {modIdx + 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingModuleTitle(mod.id)} className="p-1.5 text-slate-300"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)} className="p-1.5 text-slate-300">
                        <ChevronDown className={cn("w-4 h-4 transition-transform", expandedModule === mod.id && "rotate-180")} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedModule === mod.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-slate-100 space-y-2.5"
                      >
                        {mod.lessons.map((lesson) => (
                          <div key={lesson.id} className={cn("flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100", !lesson.enabled && "opacity-40")}>
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                              {React.cloneElement(getLessonIcon(lesson.type) as React.ReactElement<{ className?: string }>, { className: "w-3.5 h-3.5" })}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              {editingField === lesson.id ? (
                                <input 
                                  autoFocus
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(mod.id, lesson.id, { title: e.target.value })}
                                  onBlur={() => setEditingField(null)}
                                  className="bg-transparent border-none p-0 text-[12px] font-black text-slate-900 outline-none w-full"
                                />
                              ) : (
                                <p className="text-slate-900 text-[12px] font-black truncate">{lesson.title}</p>
                              )}
                              <p className="text-slate-400 text-[9px] font-black uppercase tracking-tighter mt-0.5">{lesson.duration} · {lesson.type}</p>
                            </div>

                            <div className="flex items-center gap-0.5">
                              <button onClick={() => setEditingField(lesson.id)} className="p-1 text-slate-300"><Edit3 className="w-3 h-3" /></button>
                              <button onClick={() => updateLesson(mod.id, lesson.id, { enabled: !lesson.enabled })} className={cn("p-1", lesson.enabled ? "text-blue-500" : "text-slate-300")}>
                                {lesson.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button onClick={() => removeLesson(mod.id, lesson.id)} className="p-1 text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => addLesson(mod.id)}
                          className="w-full py-3 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3 h-3" /> Add Lesson
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
