"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Check, ExternalLink, Link as LinkIcon, BookOpen, Clock, Activity, Award, Briefcase, ChevronDown, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  skills: string[];
  link?: string;
  status: "planned" | "in-progress" | "completed";
}

interface StudentPortfolioProps {
  onBack: () => void;
}

// 1. Module Definition matching Course Modules
const syllabusModules = [
  { id: "m1", title: "Getting Started", color: "bg-emerald-500", icon: "🚀" },
  { id: "m2", title: "Data Types & Variables", color: "bg-blue-500", icon: "🔢" },
  { id: "m3", title: "Control Flow", color: "bg-violet-500", icon: "🔀" },
  { id: "m4", title: "Loops & Iterations", color: "bg-amber-500", icon: "🔁" },
  { id: "m5", title: "Functions & Scope", color: "bg-pink-500", icon: "📦" },
  { id: "m6", title: "Lists & Tuples", color: "bg-indigo-500", icon: "📚" },
  { id: "m7", title: "Dictionaries & Sets", color: "bg-rose-500", icon: "🗺️" },
  { id: "m8", title: "File Input & Output", color: "bg-cyan-500", icon: "💾" },
  { id: "m9", title: "OOP: Classes & Objects", color: "bg-teal-500", icon: "🧱" },
  { id: "m10", title: "Error & Exception Handling", color: "bg-emerald-600", icon: "🛡️" },
  { id: "m11", title: "Libraries & Modules", color: "bg-sky-500", icon: "🔌" },
  { id: "m12", title: "Final Capstone Project", color: "bg-orange-500", icon: "🏆" }
];

// Default Projects List
const defaultProjects: Project[] = [
  {
    id: "p1",
    title: "Simple Calculator",
    description: "Built a command-line calculator that handles basic arithmetic operations, decimal parsing, and input validation in Python.",
    moduleId: "m2",
    skills: ["Python", "Variables", "Operators"],
    link: "https://github.com/example/cli-calc",
    status: "completed"
  },
  {
    id: "p2",
    title: "Choose Your Own Adventure",
    description: "Built an interactive terminal game with multiple storyline paths, loops to prevent invalid inputs, and recursive state mapping.",
    moduleId: "m3",
    skills: ["Python", "If/Else", "Functions", "Recursion"],
    link: "",
    status: "in-progress"
  },
  {
    id: "p3",
    title: "Library Organizer",
    description: "A Python script to represent book checkout catalogs, card holders, and author entities utilizing object oriented programming principles.",
    moduleId: "m9",
    skills: ["Python", "OOP", "Classes", "Inheritance"],
    link: "",
    status: "planned"
  }
];

// Status metadata styling matching ae in unminified_index.js
const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  planned: { label: "📋 Plan", bg: "bg-gray-100", color: "text-gray-500" },
  "in-progress": { label: "🔨 Build", bg: "bg-amber-50 border border-amber-100", color: "text-amber-600" },
  completed: { label: "✅ Done", bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-600" }
};

const supabase = createClient();

export function StudentPortfolio({ onBack }: StudentPortfolioProps) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "in-progress" | "planned">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrollmentProgress, setEnrollmentProgress] = useState<any>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newModuleId, setNewModuleId] = useState("m1");
  const [newSkills, setNewSkills] = useState("");
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (p) {
        setProfile(p);
        const savedPortfolio = (p.preferences as any)?.portfolio;
        if (savedPortfolio && Array.isArray(savedPortfolio)) {
          setProjects(savedPortfolio);
        } else {
          setProjects(defaultProjects);
        }
      }

      const { data: enroll } = await supabase
        .from("enrollments")
        .select("*")
        .eq("student_id", session.user.id)
        .maybeSingle();
      if (enroll) {
        setEnrollmentProgress(enroll);
      }
    };

    fetchPortfolio();
  }, []);

  const savePortfolioToDB = async (updatedProjects: Project[]) => {
    if (!profile) return;
    const currentPrefs = profile.preferences || {};
    const updatedPrefs = {
      ...currentPrefs,
      portfolio: updatedProjects
    };

    const { error } = await supabase
      .from("profiles")
      .update({ preferences: updatedPrefs } as any)
      .eq("id", profile.id);

    if (error) {
      console.error("Error saving portfolio:", error);
    } else {
      setProfile((prev: any) => prev ? {
        ...prev,
        preferences: updatedPrefs
      } : null);
    }
  };

  const handleAddProject = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;

    const parsedSkills = newSkills
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const addedProj: Project = {
      id: "p_" + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      moduleId: newModuleId,
      skills: parsedSkills.length > 0 ? parsedSkills : ["Python"],
      link: newLink.trim() || undefined,
      status: "planned"
    };

    const newProjs = [addedProj, ...projects];
    setProjects(newProjs);
    savePortfolioToDB(newProjs);
    setIsAddOpen(false);

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewModuleId("m1");
    setNewSkills("");
    setNewLink("");
  };

  const handleDeleteProject = (id: string) => {
    const newProjs = projects.filter(p => p.id !== id);
    setProjects(newProjs);
    savePortfolioToDB(newProjs);
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
    }
  };

  const handleUpdateStatus = (id: string, status: "planned" | "in-progress" | "completed") => {
    const newProjs = projects.map(p => (p.id === id ? { ...p, status } : p));
    setProjects(newProjs);
    savePortfolioToDB(newProjs);
  };

  // Filtered projects
  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(p => p.status === activeFilter);

  // Stats calculation
  const completedCount = projects.filter(p => p.status === "completed").length;
  const uniqueModulesUsed = new Set(projects.map(p => p.moduleId)).size;
  const totalSkillsCount = projects.reduce((acc, p) => acc + p.skills.length, 0);

  return (
    <motion.div
      className="flex flex-col h-full bg-gray-50 -mx-5"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
    >
      {/* Header */}
      <div className="bg-white px-5 pt-3 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div>
              <p className="text-gray-900 text-sm font-semibold">My Portfolio</p>
              <p className="text-gray-400 text-[11px]">Build projects as you learn</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-indigo-600 text-xs font-semibold">{projects.length}</span>
          </div>
        </div>
      </div>

      {/* Main Panel scrollable */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] space-y-4">
        {/* Gamified Profile Metrics */}
        {profile && (
          <motion.div
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
                🔥
              </div>
              <div>
                <p className="text-[9px] uppercase font-black tracking-widest text-white/75">STREAK</p>
                <p className="text-sm font-black">{profile.streak || 1} Days</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
                🪙
              </div>
              <div>
                <p className="text-[9px] uppercase font-black tracking-widest text-white/75">COINS</p>
                <p className="text-sm font-black">{profile.coins ?? 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-[9px] uppercase font-black tracking-widest text-white/75">EXP</p>
                <p className="text-sm font-black">{profile.xp ?? 10} XP</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Course enrollment progress card */}
        {enrollmentProgress && (
          <motion.div
            className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Curriculum Progress</p>
              <p className="text-indigo-600 text-xs font-bold">{enrollmentProgress.progress_pct || 0}% Complete</p>
            </div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${enrollmentProgress.progress_pct || 0}%` }}
              />
            </div>
            <p className="text-gray-400 text-[10px] font-semibold">
              You&apos;ve completed {enrollmentProgress.modules_completed || 0} modules so far. Keep it up!
            </p>
          </motion.div>
        )}

        {/* Header Grid Stats */}
        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <p className="text-gray-900 text-lg font-bold leading-none">{completedCount}</p>
            <p className="text-gray-400 text-[9px] uppercase tracking-wider font-bold mt-1">Completed</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <p className="text-gray-900 text-lg font-bold leading-none">{uniqueModulesUsed}</p>
            <p className="text-gray-400 text-[9px] uppercase tracking-wider font-bold mt-1">Modules</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <p className="text-gray-900 text-lg font-bold leading-none">{totalSkillsCount}</p>
            <p className="text-gray-400 text-[9px] uppercase tracking-wider font-bold mt-1">Skills</p>
          </div>
        </motion.div>

        {/* Course modules coverage progress card */}
        <motion.div
          className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Course coverage</p>
            <p className="text-gray-900 text-xs font-bold">{uniqueModulesUsed}/12 modules</p>
          </div>
          
          <div className="flex gap-1.5 h-2">
            {syllabusModules.map(mod => {
              const hasProject = projects.some(p => p.moduleId === mod.id);
              return (
                <div
                  key={mod.id}
                  className={`flex-1 rounded-full h-full transition-all duration-300 ${
                    hasProject ? mod.color : "bg-gray-100"
                  }`}
                  title={mod.title}
                />
              );
            })}
          </div>

          <p className="text-gray-400 text-[11px] leading-relaxed">
            {uniqueModulesUsed === 0
              ? "Add your first project to get started!"
              : uniqueModulesUsed < 4
              ? "Good start! Keep adding projects as you learn 🌱"
              : uniqueModulesUsed < 8
              ? "Great progress! Your portfolio is taking shape 🚀"
              : uniqueModulesUsed < 12
              ? "Almost full coverage! You're building something impressive ⭐"
              : "Full course coverage! Your portfolio is complete 🏆"}
          </p>
        </motion.div>

        {/* Tabs filters slider */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: "all" as const, label: "All", count: projects.length },
            { key: "completed" as const, label: "Completed", count: projects.filter(p => p.status === "completed").length },
            { key: "in-progress" as const, label: "Building", count: projects.filter(p => p.status === "in-progress").length },
            { key: "planned" as const, label: "Planned", count: projects.filter(p => p.status === "planned").length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeFilter === tab.key
                  ? "bg-gray-900 text-white border-transparent shadow-sm"
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] ${activeFilter === tab.key ? "text-gray-300" : "text-gray-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* New project form overlay drawer */}
        <AnimatePresence>
          {isAddOpen && (
            <motion.div
              className="bg-white border border-indigo-100 rounded-xl p-4 shadow-md space-y-3.5"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-indigo-500 text-sm">📁</span>
                <p className="text-gray-900 text-xs font-bold uppercase tracking-wider">New Project</p>
              </div>

              <input
                type="text"
                placeholder="Project title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-xs text-gray-900 placeholder-gray-300 bg-gray-50 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-100 border border-gray-100"
                autoFocus
              />

              <textarea
                placeholder="What did you build? Describe your project..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                rows={3}
                className="w-full text-xs text-gray-700 placeholder-gray-300 bg-gray-50 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-100 resize-none border border-gray-100"
              />

              {/* Related module select block */}
              <div className="space-y-1.5">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Related Syllabus Module</p>
                <div className="flex flex-wrap gap-1.5">
                  {syllabusModules.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => setNewModuleId(mod.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        newModuleId === mod.id
                          ? `${mod.color} text-white border-transparent`
                          : "bg-gray-50 text-gray-400 border-gray-100"
                      }`}
                    >
                      {mod.title.split(" ").slice(0, 2).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Skills (comma-separated, e.g. Python, Loops, Variables)"
                value={newSkills}
                onChange={e => setNewSkills(e.target.value)}
                className="w-full text-xs text-gray-700 placeholder-gray-300 bg-gray-50 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-100 border border-gray-100"
              />

              <input
                type="text"
                placeholder="Project Link / GitHub (optional)"
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
                className="w-full text-xs text-gray-700 placeholder-gray-300 bg-gray-50 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-100 border border-gray-100"
              />

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-semibold hover:bg-gray-200 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  disabled={!newTitle.trim() || !newDesc.trim()}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md ${
                    newTitle.trim() && newDesc.trim()
                      ? "bg-gray-900 text-white shadow-gray-900/10 hover:bg-black"
                      : "bg-gray-100 text-gray-300 pointer-events-none"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  Add Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Accordion List */}
        {filteredProjects.length === 0 && !isAddOpen ? (
          <div className="flex flex-col items-center py-12 bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-3xl">
              📦
            </div>
            <h3 className="text-gray-800 text-xs font-bold">No projects yet</h3>
            <p className="text-gray-400 text-[10px] mt-1">Tap the float button below to add your first project.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((proj, idx) => {
              const relatedMod = syllabusModules.find(m => m.id === proj.moduleId);
              const isExpanded = expandedProjectId === proj.id;
              const statusInfo = statusConfig[proj.status] || { label: "Planned", bg: "bg-gray-100", color: "text-gray-500" };

              return (
                <motion.div
                  key={proj.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  {/* Header summary button */}
                  <button
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    className="w-full p-4 text-left flex items-start gap-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${relatedMod?.color || "bg-gray-400"} flex items-center justify-center shrink-0 text-white font-bold`}>
                      {relatedMod?.icon || "📁"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-gray-900 text-xs font-bold truncate flex-1">{proj.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[10px] font-semibold">
                        {relatedMod?.title || "General Engineering"}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {/* Body expansion details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="px-4 pb-4 overflow-hidden border-t border-gray-50"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pt-3.5 space-y-3.5">
                          <p className="text-gray-500 text-xs leading-relaxed font-medium">
                            {proj.description}
                          </p>

                          {/* Skills pill list */}
                          {proj.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {proj.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-bold rounded-md"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Project Link indicator */}
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-indigo-500 text-[11px] font-bold w-fit hover:underline"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[200px]">{proj.link}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          )}

                          {/* Project action selectors footer */}
                          <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                            <div className="flex gap-1.5 flex-1">
                              {(["planned", "in-progress", "completed"] as const).map(status => {
                                const isCurrent = proj.status === status;
                                return (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(proj.id, status);
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                      isCurrent
                                        ? "bg-gray-900 text-white shadow-sm"
                                        : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                                    }`}
                                  >
                                    {status === "planned" ? "📋 Plan" : status === "in-progress" ? "🔨 Build" : "✅ Done"}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(proj.id);
                              }}
                              className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-rose-50 hover:border-rose-100 text-gray-400 hover:text-rose-500 active:scale-90 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Informational advice box at the bottom */}
        {projects.length > 0 && (
          <motion.div
            className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-2xl">💼</span>
            <p className="text-gray-500 text-xs mt-2 leading-relaxed font-semibold">
              Add projects as you complete each module. By the end of the course, you&apos;ll have a full portfolio to showcase to recruiters!
            </p>
            <p className="text-gray-300 text-[10px] font-semibold mt-1">Tap any project card to adjust its planning state</p>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      {!isAddOpen && (
        <button
          onClick={() => setIsAddOpen(true)}
          className="absolute bottom-20 right-5 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all z-50 hover:bg-black"
        >
          <Plus className="w-5 h-5" strokeWidth={3} />
        </button>
      )}
    </motion.div>
  );
}
