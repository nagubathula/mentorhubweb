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
  Plus,
  Video
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
  category: "Frontend" | "Backend" | "Design" | "Wellness" | "Interview Prep" | "Videos";
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
  const [customUrl, setCustomUrl] = useState<string>(" ");
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
      id: "res-v1",
      title: "Next.js App Router Crash Course (Video)",
      url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
      description: "A comprehensive video crash course on Next.js App Router, routing, layouts, and server actions.",
      category: "Videos",
      icon: <Video className="w-4.5 h-4.5 text-indigo-500" />
    },
    {
      id: "res-v2",
      title: "React Hooks & State Management (Video)",
      url: "https://www.youtube.com/watch?v=LlvBzyy-558",
      description: "Master React useState, useEffect, useContext, and custom hooks in one crash course.",
      category: "Videos",
      icon: <Video className="w-4.5 h-4.5 text-rose-500" />
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
      id: "res-v3",
      title: "Database Indexing & Query Optimization (Video)",
      url: "https://www.youtube.com/watch?v=HkbdDDXYDek",
      description: "Learn how indexes work under the hood and how to optimize slow SQL queries with video tutorials.",
      category: "Videos",
      icon: <Video className="w-4.5 h-4.5 text-emerald-500" />
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
      id: "res-v4",
      title: "Figma UI/UX Design Tutorial for Beginners (Video)",
      url: "https://www.youtube.com/watch?v=FTFaQWZBqA8",
      description: "Step-by-step video tutorial on creating stunning UI components and prototypes in Figma.",
      category: "Videos",
      icon: <Video className="w-4.5 h-4.5 text-pink-500" />
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

  const categories = ["All", "Frontend", "Backend", "Design", "Videos", "Wellness", "Interview Prep"];

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

  const filteredResources = curatedResources.filter(res => {
    const matchesTab = activeTab === "All" || res.category === activeTab;
    const matchesSearch = searchQuery.trim() === "" || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
        <div className="flex items-center gap-3.5 min-w-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h2 className="text-slate-900 font-bold text-[15px] leading-tight truncate">Share Materials</h2>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5 hidden sm:block">Encourage student learning</p>
          </div>
        </div>

        {/* Subtle recipient selector in the header */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5 shadow-2xs shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0 hidden xs:inline">Send to:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-transparent border-0 text-slate-700 text-xs font-semibold focus:ring-0 focus:outline-none cursor-pointer p-0"
          >
            {assignedStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.name || student.email?.split('@')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 max-w-xl mx-auto w-full pb-20 space-y-6">
        
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

        {/* Custom Resource Link Builder Input */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider px-1">Share a Custom Link</h3>
          <div className="flex gap-2">
            <Input 
              value={customUrl === " " ? "" : customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste any article, document, or video link..."
              className="flex-1 bg-white border-slate-200 text-xs h-10 px-3.5 rounded-xl transition-all shadow-3xs focus:ring-2 focus:ring-indigo-100/50 focus:border-indigo-500"
            />
            <Button 
              onClick={async () => {
                if (!customUrl.trim()) return;
                let formattedUrl = customUrl.trim();
                if (!/^https?:\/\//i.test(formattedUrl)) {
                  formattedUrl = "https://" + formattedUrl;
                }
                let title = "Custom Link";
                try {
                  const urlObj = new URL(formattedUrl);
                  title = urlObj.hostname.replace("www.", "");
                } catch(e) {}
                await handleQuickSend(title, formattedUrl);
                setCustomUrl("");
              }}
              disabled={isSending || !customUrl.trim()}
              className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 active:scale-98 transition-all shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </Button>
          </div>
        </div>

        {/* Curated Resources Directory Header & Search */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Browse Curated Resources</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{filteredResources.length} available</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input 
              value={searchQuery === " " ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, docs, primers..."
              className="pl-9 bg-white border-slate-200 text-xs h-10 rounded-xl transition-all shadow-3xs hover:border-slate-300 focus:ring-2 focus:ring-indigo-100/50 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 hidden-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`text-[11px] px-3.5 py-1.5 rounded-full font-bold shrink-0 transition-all border ${
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
        <div className="space-y-2.5">
          {filteredResources.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-3xs">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">No resources found matching search criteria.</p>
            </div>
          ) : (
            filteredResources.map(res => (
              <div 
                key={res.id} 
                className="bg-white p-3 px-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between gap-3 shadow-3xs group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    {res.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-800 text-[12.5px] truncate group-hover:text-indigo-600 transition-colors">
                        {res.title}
                      </h4>
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">
                      {res.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all"
                    title="Open Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Button 
                    onClick={() => handleQuickSend(res.title, res.url)}
                    disabled={isSending}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-bold text-[10.5px] h-7 px-3 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-3xs border border-indigo-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
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
