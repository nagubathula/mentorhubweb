"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Code, 
  Sparkles, 
  GraduationCap, 
  Smile, 
  Compass, 
  Link as LinkIcon, 
  Check, 
  Bookmark,
  Share2,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentResourcesProps {
  mappedMentor: any;
  messages: any[];
  onBack: () => void;
}

interface CuratedResource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: "Frontend" | "Backend" | "Design" | "Wellness" | "Interview Prep" | "Videos";
  icon: React.ReactNode;
}

export function StudentResources({ mappedMentor, messages, onBack }: StudentResourcesProps) {
  const [activeTab, setActiveTab] = useState<"shared" | "curated">("shared");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const curatedResources: CuratedResource[] = [
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
      description: "Step-by-step masterclass covering responsive layouts and flex properties.",
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
      description: "A highly visual guide covering design heuristics and psychological principles for premium UIs.",
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

  // Helper to extract resource links from messages
  const extractResourcesFromMessages = (msgs: any[]) => {
    const extracted: { id: string; title: string; url: string; date: string; sender: string }[] = [];
    const urlRegex = /(https?:\/\/[^\s\)\>]+)/g;

    msgs.forEach((msg) => {
      // Find all URLs in message body
      const urls = msg.body.match(urlRegex);
      if (urls) {
        urls.forEach((url: string, index: number) => {
          // Extract title
          let title = "Recommended Link";
          const boldRegex = /\*\*([^*]+)\*\*/;
          const boldMatch = msg.body.match(boldRegex);
          
          if (boldMatch) {
            title = boldMatch[1];
          } else {
            const lines = msg.body.split('\n');
            const bookLine = lines.find((l: string) => l.includes("📚"));
            if (bookLine) {
              title = bookLine.replace("📚", "").replace(/\*/g, "").trim();
            } else {
              title = "Resource Shared by Mentor";
            }
          }

          // Clean url of trailing punctuations if any
          const cleanUrl = url.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim() || url;

          extracted.push({
            id: `${msg.id || "msg"}-${index}`,
            title,
            url,
            date: new Date(msg.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            sender: msg.from_user_id === mappedMentor?.id ? (mappedMentor?.name || "Mentor") : "You"
          });
        });
      }
    });

    return extracted;
  };

  const sharedResources = extractResourcesFromMessages(messages);

  // Filters
  const filteredShared = sharedResources.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCurated = curatedResources.filter(res => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch = searchQuery.trim() === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      className="flex flex-col h-full bg-slate-50 -mx-6 md:-mx-8 font-inter"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
    >
      {/* Header Bar */}
      <div className="bg-white px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 border-b border-slate-100 shrink-0 shadow-3xs">
        <div className="flex items-center justify-between mb-4.5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center active:scale-95 transition-transform text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-slate-900 text-[15px] font-bold">Resource Hub</p>
              <p className="text-slate-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">My Learning Materials</p>
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-[11px] font-bold border border-indigo-100 flex items-center gap-1 shadow-3xs">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{sharedResources.length} shared</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("shared")}
            className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all font-bold ${
              activeTab === "shared"
                ? "bg-white text-indigo-600 shadow-3xs"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Shared by Mentor
            {sharedResources.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 text-[9px] flex items-center justify-center font-bold">
                {sharedResources.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("curated")}
            className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all font-bold ${
              activeTab === "curated"
                ? "bg-white text-indigo-600 shadow-3xs"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Curated Guides
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 pb-[calc(8rem+env(safe-area-inset-bottom))] md:px-8">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "shared" ? "Search materials shared with you..." : "Search guides, docs, cheat sheets..."}
            className="pl-10 bg-white border-slate-200 text-xs h-10 rounded-xl transition-all shadow-3xs hover:border-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "shared" ? (
            <motion.div
              key="shared-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {filteredShared.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-100 rounded-3xl shadow-3xs px-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300 shadow-3xs">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-800 text-[13.5px] font-bold">No materials shared yet</h3>
                  <p className="text-slate-400 text-xs max-w-[240px] mt-1.5 leading-relaxed font-semibold">
                    Once your mentor {mappedMentor?.name ? `(${mappedMentor.name})` : ""} shares links, syllabus guidelines, or useful materials in chat, they will automatically appear here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredShared.map((res, index) => (
                    <motion.div
                      key={res.id}
                      className="bg-white p-4.5 rounded-[1.5rem] border border-slate-100 hover:border-indigo-100 transition-all shadow-3xs flex flex-col justify-between gap-4"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-3xs">
                          <LinkIcon className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-800 text-[13.5px] leading-tight truncate">
                              {res.title}
                            </h4>
                            <span className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                              Shared Resource
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-400 font-semibold truncate mt-1">
                            {res.url}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                              From: {res.sender}
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold">•</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{res.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Clickable Card Action */}
                      <div className="border-t border-slate-50 pt-3 flex justify-end">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] h-8 px-4 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-3xs"
                        >
                          Open Resource Link
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="curated-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Category tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 hidden-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] px-3 py-1.5 rounded-full font-bold shrink-0 transition-all border ${
                      activeCategory === cat 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-3xs" 
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredCurated.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-3xs">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-xs">No resources found matching search criteria.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredCurated.map((res, index) => (
                    <motion.div
                      key={res.id}
                      className="bg-white p-4.5 rounded-[1.5rem] border border-slate-100 hover:border-indigo-100 transition-all shadow-3xs flex flex-col justify-between gap-4 group"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-3xs">
                          {res.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-800 text-[13.5px] leading-tight truncate group-hover:text-indigo-600 transition-colors">
                              {res.title}
                            </h4>
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
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

                      {/* Clickable Card Action */}
                      <div className="border-t border-slate-50 pt-3 flex justify-end">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] h-8 px-4 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-3xs"
                        >
                          View Guide
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
