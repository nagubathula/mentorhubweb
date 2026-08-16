import React, { useState } from "react";
import { 
  ArrowLeft, 
  Package, 
  Search, 
  Info, 
  GraduationCap, 
  FileText, 
  Link as LinkIcon, 
  MessageSquare, 
  ExternalLink, 
  Check, 
  Plus, 
  Send, 
  Smile, 
  Users, 
  Sparkles, 
  X, 
  ThumbsUp,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LearningPackItem {
  id: string;
  sender: string;
  senderRole: string;
  senderAvatar?: string;
  time: string;
  message?: string;
  isPack?: boolean;
  packData?: {
    courseTitle?: string;
    courseUrl?: string;
    taskTitle?: string;
    taskUrl?: string;
    resourceTitle?: string;
    resourceUrl?: string;
    mentorNote?: string;
  };
  recipientCount?: number;
  reactions: number;
  hasReacted?: boolean;
  initial?: string;
  avatarBg?: string;
}

export function MentorLearningPack({ onClose }: { onClose?: () => void } = {}) {
  // Preset list of mentees
  const mentees = [
    { id: "1", name: "You (Mentor)", role: "Mentor", isMentor: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    { id: "2", name: "Aarav", initial: "A", bg: "bg-indigo-500" },
    { id: "3", name: "Riya", initial: "R", bg: "bg-emerald-500" },
    { id: "4", name: "Karthik", initial: "K", bg: "bg-amber-500" },
    { id: "5", name: "Deepa", initial: "D", bg: "bg-blue-500" },
    { id: "6", name: "Pooja", initial: "P", bg: "bg-pink-500" },
  ];

  // Chat feed state initialized with sample Learning Pack thread
  const [messages, setMessages] = useState<LearningPackItem[]>([
    {
      id: "pack-1",
      sender: "You (Mentor)",
      senderRole: "Mentor",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      time: "10:30 AM",
      message: "Hey team! 👋\nSharing this week's learning pack. Check the course, complete the task, and go through the resources. Let me know if you have any questions!",
      isPack: true,
      packData: {
        courseTitle: "Next.js 16+ App Router Masterclass",
        courseUrl: "https://nextjs.org/docs",
        taskTitle: "Build Week 3 project component & push to GitHub",
        taskUrl: "https://github.com",
        resourceTitle: "https://nextjs.org/docs",
        resourceUrl: "https://nextjs.org/docs",
        mentorNote: "Focus on Server Components before starting!"
      },
      recipientCount: 5,
      reactions: 5,
      hasReacted: false,
    },
    {
      id: "reply-1",
      sender: "Aarav",
      senderRole: "Student",
      initial: "A",
      avatarBg: "bg-indigo-500",
      time: "10:32 AM",
      message: "Got it! Will start with the course.",
      reactions: 1,
      hasReacted: false,
    },
    {
      id: "reply-2",
      sender: "Riya",
      senderRole: "Student",
      initial: "R",
      avatarBg: "bg-emerald-500",
      time: "10:32 AM",
      message: "Thanks mentor!",
      reactions: 0,
      hasReacted: false,
    },
    {
      id: "reply-3",
      sender: "Karthik",
      senderRole: "Student",
      initial: "K",
      avatarBg: "bg-amber-500",
      time: "10:33 AM",
      message: "Will push the code by EOD.",
      reactions: 0,
      hasReacted: false,
    }
  ]);

  // Input states
  const [inputText, setInputText] = useState("");
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);

  // New Pack Form State
  const [packCourse, setPackCourse] = useState("Next.js 16+ App Router Masterclass");
  const [packTask, setPackTask] = useState("Build Week 3 project component & push to GitHub");
  const [packResource, setPackResource] = useState("https://nextjs.org/docs");
  const [packNote, setPackNote] = useState("Focus on Server Components before starting!");

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: LearningPackItem = {
      id: `msg-${Date.now()}`,
      sender: "You (Mentor)",
      senderRole: "Mentor",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: inputText.trim(),
      reactions: 0
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
  };

  const handleCreateNewPack = () => {
    const newPackMsg: LearningPackItem = {
      id: `pack-${Date.now()}`,
      sender: "You (Mentor)",
      senderRole: "Mentor",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: "Hey team! 👋\nBroadcasting a new learning pack! Make sure to review all attached items below.",
      isPack: true,
      packData: {
        courseTitle: packCourse.trim() || "Web Development Masterclass",
        courseUrl: "https://nextjs.org",
        taskTitle: packTask.trim() || "Complete practical assignment",
        taskUrl: "https://github.com",
        resourceTitle: packResource.trim() || "https://developer.mozilla.org",
        resourceUrl: packResource.trim() || "https://developer.mozilla.org",
        mentorNote: packNote.trim() || "Feel free to reach out if you get stuck!"
      },
      recipientCount: 5,
      reactions: 0
    };

    setMessages(prev => [...prev, newPackMsg]);
    setIsPackModalOpen(false);
  };

  const toggleReaction = (id: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === id) {
        const hasReacted = !msg.hasReacted;
        return {
          ...msg,
          hasReacted,
          reactions: hasReacted ? msg.reactions + 1 : Math.max(0, msg.reactions - 1)
        };
      }
      return msg;
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28 font-inter animate-in fade-in duration-300">
      
      {/* 1. Page Title & Action Header (Matching Mentor Portal Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3.5">
          {onClose && (
            <button 
              onClick={onClose}
              className="w-9.5 h-9.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-all shadow-3xs cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/80">
                <Package className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-slate-900 leading-none">
                Learning Pack
              </h2>
            </div>
            <p className="text-[12px] text-slate-400 font-medium mt-1">
              Broadcast courses, tasks, resources, and mentor notes to your mentees
            </p>
          </div>
        </div>
      </div>

      {/* 2. Recipients & Quick Search Strip */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto hidden-scrollbar">
          {/* Mentor Profile Chip */}
          <div className="flex items-center gap-2 pr-2.5 border-r border-slate-200/70 shrink-0">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200 shadow-2xs">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt="You (Mentor)" 
                className="w-full h-full object-cover" 
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <span className="text-[11.5px] font-bold text-slate-700 whitespace-nowrap">You (Mentor)</span>
          </div>

          {/* Mentee Avatar Circles */}
          <div className="flex items-center gap-1.5 shrink-0">
            {mentees.filter(m => !m.isMentor).map((m) => (
              <div 
                key={m.id}
                title={m.name}
                className={`w-7 h-7 rounded-full ${m.bg} text-white font-bold text-[11px] flex items-center justify-center shadow-2xs cursor-pointer hover:scale-105 transition-transform`}
              >
                {m.initial}
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold text-[10.5px] flex items-center justify-center border border-slate-200 shrink-0">
              +5
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer border-0 bg-transparent">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer border-0 bg-transparent">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Stream Feed */}
      <div className="space-y-6 pt-1">
        
        {/* Date Divider */}
        <div className="flex justify-center my-3">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100/90 border border-slate-200/40 px-3.5 py-0.5 rounded-full shadow-3xs">
            Today
          </span>
        </div>

        {/* Render Messages */}
        {messages.map((item) => (
          <div key={item.id} className="space-y-3">
            {item.isPack ? (
              /* --- PACK MESSAGE STREAM ITEM --- */
              <div className="flex gap-3 max-w-full">
                {/* Sender Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  <img src={item.senderAvatar} alt={item.sender} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  {/* Header line */}
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-900">{item.sender}</span>
                    <span className="text-[10.5px] font-semibold text-slate-400">{item.time}</span>
                  </div>

                  {/* Introductory Text */}
                  {item.message && (
                    <p className="text-[13px] text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                      {item.message}
                    </p>
                  )}

                  {/* Embedded Learning Pack Content Block */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-3.5 relative overflow-hidden">
                    
                    {/* Section 1: Course / Curriculum */}
                    {item.packData?.courseTitle && (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8.5 h-8.5 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 border border-purple-100/60 mt-0.5">
                            <GraduationCap className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-purple-600 tracking-tight block leading-none mb-1">
                              Course / Curriculum
                            </span>
                            <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                              {item.packData.courseTitle}
                            </h4>
                          </div>
                        </div>
                        <a 
                          href={item.packData.courseUrl || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-purple-500 hover:text-purple-700 p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    <div className="border-t border-slate-100" />

                    {/* Section 2: Task / Action Item */}
                    {item.packData?.taskTitle && (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/60 mt-0.5">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-emerald-600 tracking-tight block leading-none mb-1">
                              Task / Action Item
                            </span>
                            <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                              {item.packData.taskTitle}
                            </h4>
                          </div>
                        </div>
                        <a 
                          href={item.packData.taskUrl || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    <div className="border-t border-slate-100" />

                    {/* Section 3: Content / Resource Link */}
                    {item.packData?.resourceTitle && (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8.5 h-8.5 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 border border-sky-100/60 mt-0.5">
                            <LinkIcon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-sky-600 tracking-tight block leading-none mb-1">
                              Content / Resource Link
                            </span>
                            <h4 className="text-[13px] font-bold text-sky-600 underline truncate max-w-[240px] sm:max-w-xs leading-tight">
                              {item.packData.resourceTitle}
                            </h4>
                          </div>
                        </div>
                        <a 
                          href={item.packData.resourceUrl || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-sky-500 hover:text-sky-700 p-1.5 rounded-lg hover:bg-sky-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    <div className="border-t border-slate-100" />

                    {/* Section 4: Mentor Note / Context */}
                    {item.packData?.mentorNote && (
                      <div className="flex items-start gap-3">
                        <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/60 mt-0.5">
                          <MessageSquare className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-amber-600 tracking-tight block leading-none mb-1">
                            Mentor Note / Context
                          </span>
                          <p className="text-[12.5px] font-bold text-slate-800 leading-tight">
                            {item.packData.mentorNote}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pack Reactions & Time */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => toggleReaction(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                        item.hasReacted 
                          ? "bg-amber-50 border-amber-200 text-amber-700 shadow-2xs" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>👍</span>
                      <span>{item.reactions}</span>
                    </button>
                    <span className="text-[10.5px] text-slate-400 font-medium ml-1">{item.time}</span>
                  </div>

                  {/* Shared with Mentees System Badge */}
                  {item.recipientCount && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50/60 border border-indigo-100/60 text-[11px] text-slate-600 font-medium">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Shared with {item.recipientCount} mentees</span>
                        <span className="text-[10px] text-slate-400 ml-1">{item.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* --- REGULAR CHAT MESSAGE REPLIES --- */
              <div className="flex gap-3 max-w-full">
                {/* Avatar */}
                {item.senderAvatar ? (
                  <div className="w-8.5 h-8.5 rounded-full overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                    <img src={item.senderAvatar} alt={item.sender} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-8.5 h-8.5 rounded-full ${item.avatarBg || "bg-indigo-500"} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                    {item.initial || item.sender.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-bold text-slate-900">{item.sender}</span>
                    <span className="text-[10.5px] font-semibold text-slate-400">{item.time}</span>
                  </div>
                  <div className="inline-block bg-white border border-slate-200/80 shadow-3xs rounded-2xl px-4 py-2.5 text-[12.5px] text-slate-800 font-medium">
                    {item.message}
                  </div>

                  {/* Reactions */}
                  {item.reactions > 0 && (
                    <div className="pt-0.5">
                      <button
                        onClick={() => toggleReaction(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[10.5px] font-semibold text-slate-600 shadow-3xs"
                      >
                        <span>👍</span>
                        <span>{item.reactions}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. Bottom Input Bar & Quick Attachment Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-md space-y-3 mt-6">
        
        {/* Main Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPackModalOpen(true)}
            className="w-9.5 h-9.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer shrink-0 border-0"
            title="Broadcast New Learning Pack"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 relative flex items-center">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="w-full h-10 px-4 pr-10 rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-3xs"
            />
            <button
              type="button"
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-0 cursor-pointer"
            >
              <Smile className="w-4.5 h-4.5" />
            </button>
          </div>

          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9.5 h-9.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-0 flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer border-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Attachment Toolbar */}
        <div className="flex items-center justify-around pt-1.5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsPackModalOpen(true)}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 hover:text-sky-600 py-1 px-2.5 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer bg-transparent border-0"
          >
            <LinkIcon className="w-3.5 h-3.5 text-sky-500" />
            <span>Link</span>
          </button>
          
          <div className="w-[1px] h-3.5 bg-slate-200" />

          <button
            type="button"
            onClick={() => setIsPackModalOpen(true)}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 hover:text-purple-600 py-1 px-2.5 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer bg-transparent border-0"
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            <span>Course</span>
          </button>

          <div className="w-[1px] h-3.5 bg-slate-200" />

          <button
            type="button"
            onClick={() => setIsPackModalOpen(true)}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 hover:text-emerald-600 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer bg-transparent border-0"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Task</span>
          </button>

          <div className="w-[1px] h-3.5 bg-slate-200" />

          <button
            type="button"
            onClick={() => setIsPackModalOpen(true)}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 hover:text-amber-600 py-1 px-2.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer bg-transparent border-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Note</span>
          </button>
        </div>
      </div>

      {/* 5. Create / Edit Learning Pack Modal */}
      {isPackModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 bg-white border border-slate-100 shadow-2xl rounded-3xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Package className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Broadcast Learning Pack</h3>
              </div>
              <button
                onClick={() => setIsPackModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer bg-transparent border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">🎓 Course / Curriculum</label>
                <Input
                  value={packCourse}
                  onChange={(e) => setPackCourse(e.target.value)}
                  placeholder="e.g. Next.js 16+ App Router Masterclass"
                  className="bg-slate-50 border-slate-200 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">📋 Task / Action Item</label>
                <Input
                  value={packTask}
                  onChange={(e) => setPackTask(e.target.value)}
                  placeholder="e.g. Build Week 3 project component & push to GitHub"
                  className="bg-slate-50 border-slate-200 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-sky-600 uppercase tracking-wider block">🔗 Content / Resource Link</label>
                <Input
                  value={packResource}
                  onChange={(e) => setPackResource(e.target.value)}
                  placeholder="e.g. https://nextjs.org/docs"
                  className="bg-slate-50 border-slate-200 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider block">💬 Mentor Note / Context</label>
                <Textarea
                  value={packNote}
                  onChange={(e) => setPackNote(e.target.value)}
                  placeholder="e.g. Focus on Server Components before starting!"
                  rows={2}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setIsPackModalOpen(false)}
                className="flex-1 rounded-xl text-xs font-semibold py-2.5 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateNewPack}
                className="flex-1 rounded-xl text-xs font-semibold py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer border-0"
              >
                Broadcast Pack 🚀
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
