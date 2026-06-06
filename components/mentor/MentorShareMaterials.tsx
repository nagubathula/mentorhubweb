"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Send, 
  ExternalLink, 
  BookOpen, 
  Code, 
  Sparkles, 
  GraduationCap, 
  Smile, 
  Compass, 
  Link as LinkIcon, 
  Check, 
  Plus 
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const supabase = createClient();

interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: "Frontend" | "Backend" | "Design" | "Wellness" | "Interview Prep";
  icon: React.ReactNode;
}

interface MentorShareMaterialsProps {
  mentorId: string;
  assignedStudents: any[];
  defaultStudentId?: string;
  onClose: () => void;
}

export function MentorShareMaterials({ mentorId, assignedStudents, defaultStudentId, onClose }: MentorShareMaterialsProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    defaultStudentId || (assignedStudents[0]?.id || "")
  );
  
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const curatedResources: Resource[] = [
    {
      id: "res-1",
      title: "Next.js 16+ Architecture & Router Guide",
      url: "https://nextjs.org/docs",
      description: "Official guide on Server Components, layouts, nested routing, and caching behavior.",
      category: "Frontend",
      icon: <Code className="w-4.5 h-4.5 text-indigo-500" />
    },
    {
      id: "res-2",
      title: "Interactive Guide to CSS Flexbox & Grid layouts",
      url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      description: "Step-by-step masterclass covering responsive responsive layouts and flex properties.",
      category: "Frontend",
      icon: <Code className="w-4.5 h-4.5 text-sky-500" />
    },
    {
      id: "res-3",
      title: "Node.js & Express Production Best Practices",
      url: "https://github.com/goldbergyoni/nodebestpractices",
      description: "Gold-standard curation on architecture, error handling, security, and project structures.",
      category: "Backend",
      icon: <Compass className="w-4.5 h-4.5 text-emerald-500" />
    },
    {
      id: "res-4",
      title: "Supabase & Postgres Indexing Primer",
      url: "https://supabase.com/docs/guides/database/joins-and-nesting",
      description: "A comprehensive developer primer on database indices, joins, and nested relations.",
      category: "Backend",
      icon: <Compass className="w-4.5 h-4.5 text-teal-500" />
    },
    {
      id: "res-5",
      title: "Laws of UX: Psychological Principles Handbook",
      url: "https://lawsofux.com/",
      description: "A highly visual guide covering design heuristic and psychological principles for premium UIs.",
      category: "Design",
      icon: <Sparkles className="w-4.5 h-4.5 text-pink-500" />
    },
    {
      id: "res-6",
      title: "System Design Interview Primer",
      url: "https://github.com/donnemartin/system-design-primer",
      description: "Massive open-source resources explaining highly scalable backend system design.",
      category: "Interview Prep",
      icon: <GraduationCap className="w-4.5 h-4.5 text-amber-500" />
    },
    {
      id: "res-7",
      title: "Mindfulness & Strategic Study Habits",
      url: "https://www.headspace.com/mindfulness",
      description: "Curated mindfulness and focused deep-learning tips to avoid mental burnout.",
      category: "Wellness",
      icon: <Smile className="w-4.5 h-4.5 text-rose-500" />
    }
  ];

  const categories = ["All", "Frontend", "Backend", "Design", "Wellness", "Interview Prep"];

  const handleQuickSend = async (title: string, url: string) => {
    if (!selectedStudentId || !mentorId) {
      alert("Please ensure a student is selected and you are logged in.");
      return;
    }

    setIsSending(true);
    
    const friendlyMessage = `Hey! 🚀 I thought this resource would be super helpful for your learning path:\n\n📚 **${title}**\n🔗 ${url}\n\nLet me know if you have any questions about this material!`;

    try {
      const { error } = await supabase.from('messages').insert({
        from_user_id: mentorId,
        to_user_id: selectedStudentId,
        body: friendlyMessage,
        sender_name: "Mentor",
        is_read: false
      } as any);

      if (error) {
        alert("Failed to send: " + error.message);
      } else {
        const student = assignedStudents.find(s => s.id === selectedStudentId);
        const name = student?.name || student?.email?.split('@')[0] || "student";
        
        setSuccessMessage(`Resource sent to ${name} successfully!`);
        setTimeout(() => setSuccessMessage(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendCustomResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) return;

    let formattedUrl = customUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    await handleQuickSend(customTitle.trim(), formattedUrl);
    setCustomTitle("");
    setCustomUrl("");
  };

  const filteredResources = curatedResources.filter(res => {
    const matchesTab = activeTab === "All" || res.category === activeTab;
    const matchesSearch = searchQuery.trim() === "" || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedStudent = assignedStudents.find(s => s.id === selectedStudentId);
  const studentName = selectedStudent?.name || selectedStudent?.email?.split('@')[0] || "student";

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-inter overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 md:px-8 flex items-center justify-between shrink-0 shadow-3xs">
        <div className="flex items-center gap-3.5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-slate-900 font-bold text-[15px] leading-tight">Share Materials & Resources</h2>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Encourage student learning</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 max-w-xl mx-auto w-full pb-20">
        
        {/* Recipient Selector Banner */}
        <div className="bg-gradient-to-r from-indigo-50/50 to-violet-50/50 border border-indigo-100/40 p-4.5 rounded-[1.25rem] flex items-center justify-between gap-4 shadow-3xs">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Sharing With</p>
            <h3 className="text-slate-800 font-bold text-[13.5px] mt-1 truncate">Sending directly to {studentName}</h3>
          </div>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-white border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-3xs cursor-pointer"
          >
            {assignedStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name || student.email?.split('@')[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Global Toast Success Message */}
        {successMessage && (
          <motion.div 
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold p-3 px-4 rounded-xl flex items-center gap-2 shadow-xs"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
            {successMessage}
          </motion.div>
        )}

        {/* Custom Resource Link Builder Card */}
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-3xs space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4.5 h-4.5 text-indigo-500" />
            <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Share a Custom Material Link</h4>
          </div>
          <form onSubmit={handleSendCustomResource} className="space-y-3.5">
            <div>
              <Input 
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Resource Title (e.g. Recommended Syllabus Guide)"
                required
                className="bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-xs h-10 px-3.5 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
            <div>
              <Input 
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="URL / Link Address (e.g. github.com/...)"
                required
                className="bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-xs h-10 px-3.5 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
            <Button 
              type="submit"
              disabled={isSending || !customTitle.trim() || !customUrl.trim()}
              className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Quick-Send Custom Resource
            </Button>
          </form>
        </div>

        {/* Curated Resources Directory Header & Search */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-[13px] uppercase tracking-wider">Browse Curated Resources</h3>
            <span className="text-[11px] text-slate-400 font-semibold">{filteredResources.length} available</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input 
              value={searchQuery === " " ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, docs, primers..."
              className="pl-9 bg-white border-slate-200 text-xs h-10 rounded-xl transition-all shadow-3xs hover:border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 hidden-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`text-[11.5px] px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all border ${
                  activeTab === cat 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-3xs" 
                    : "bg-white border-slate-100 hover:border-slate-200 text-slate-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Feed */}
        <div className="space-y-3.5">
          {filteredResources.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-3xs">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">No resources found matching search criteria.</p>
            </div>
          ) : (
            filteredResources.map(res => (
              <div 
                key={res.id} 
                className="bg-white p-4.5 rounded-[1.5rem] border border-slate-100 hover:border-indigo-100 transition-all shadow-3xs group flex flex-col justify-between gap-4"
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-3xs">
                    {res.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-slate-800 text-[13px] leading-tight truncate group-hover:text-indigo-600 transition-colors">
                        {res.title}
                      </h4>
                      <span className="bg-slate-100 text-slate-500 text-[9.5px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-400 font-semibold truncate mt-1">
                      {res.url}
                    </p>
                    <p className="text-[12px] text-slate-500 leading-normal font-medium mt-2">
                      {res.description}
                    </p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="border-t border-slate-100/60 pt-3.5 flex items-center justify-between gap-3">
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    View Resource
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  
                  <Button 
                    onClick={() => handleQuickSend(res.title, res.url)}
                    disabled={isSending}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[11px] h-8 px-3 rounded-full flex items-center gap-1.5 active:scale-95 transition-all shadow-3xs border border-indigo-50"
                  >
                    <Send className="w-3 h-3" />
                    Quick-Send to {studentName}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </motion.div>
  );
}
