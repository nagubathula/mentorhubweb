"use client";

import { Search, Plus, FileText, Clock, Trash2, Edit2, X, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export function MentorNotes({ onClose }: { onClose?: () => void } = {}) {
  const [notes, setNotes] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editColor, setEditColor] = useState<"white" | "blue" | "teal" | "yellow" | "pink" | "purple">("white");

  useEffect(() => {
    const fetchNotes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (p) {
        setProfile(p);
        const savedNotes = (p.preferences as any)?.notes;
        if (savedNotes && Array.isArray(savedNotes)) {
          setNotes(savedNotes);
        } else {
          // Fallback to initial notes
          const initial = [
            { id: 1, title: "Arjun's Debugging Issue", content: "Discussed list comprehensions and how they map to standard loops. Arjun seemed to grasp the concept after 2 examples.", time: "Today, 10:45 AM", color: "white" },
            { id: 2, title: "Group Session Module 6 Prep", content: "Make sure all students have completed the pre-reading. Sneha usually leads the questions so prepare a challenging one for her.", time: "Yesterday, 6:00 PM", color: "white" },
            { id: 3, title: "Rahul Catchup", content: "Needs extra motivation. Falling behind on assignments. Set a micro-goal for this weekend to just write 10 lines of code.", time: "Oct 12", color: "white" }
          ];
          setNotes(initial);
        }
      }
    };

    fetchNotes();
  }, []);

  const saveNotesToDB = async (updatedNotes: any[]) => {
    if (!profile) return;
    const currentPrefs = profile.preferences || {};
    const updatedPrefs = {
      ...currentPrefs,
      notes: updatedNotes
    };

    const { error } = await supabase
      .from("profiles")
      .update({ preferences: updatedPrefs } as any)
      .eq("id", profile.id);

    if (error) {
      console.error("Error saving notes to Supabase:", error);
    } else {
      setProfile((prev: any) => prev ? {
        ...prev,
        preferences: updatedPrefs
      } : null);
    }
  };

  const handleSaveNote = () => {
    if (!editTitle) return;
    let updated: any[] = [];
    if (activeNote?.id) {
       updated = notes.map(n => n.id === activeNote.id ? { ...n, title: editTitle, content: editContent, color: editColor } : n);
    } else {
       const newNote = {
         id: Date.now(),
         title: editTitle,
         content: editContent,
         color: editColor,
         time: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       };
       updated = [newNote, ...notes];
    }
    setNotes(updated);
    saveNotesToDB(updated);
    setIsCreating(false);
    setActiveNote(null);
    setEditColor("white");
  };

  const deleteNote = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotesToDB(updated);
  };

  const filteredNotes = notes.filter(n => 
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCreating) {
    return (
      <div className="space-y-6 pb-20">
         <div className="flex items-center justify-between pt-6 md:pt-8 px-1">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => {setIsCreating(false); setActiveNote(null); setEditColor("white");}} 
             className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
           >
             <X className="w-5 h-5"/>
           </Button>
           <h2 className="text-[17px] font-bold tracking-tight text-slate-900">{activeNote ? 'Edit Session Note' : 'New Session Note'}</h2>
           <Button 
             onClick={handleSaveNote} 
             disabled={!editTitle.trim()}
             className={`px-5 h-10 rounded-xl text-[13px] font-medium transition-all active:scale-95 ${
               editTitle.trim()
                 ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                 : 'bg-slate-100 text-slate-350 cursor-not-allowed'
             }`}
           >
             Save
           </Button>
         </div>

         <div className={`p-6 rounded-[2rem] border shadow-xs min-h-[55vh] flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
           editColor === "blue" ? "bg-blue-50 border-blue-200/50" :
           editColor === "teal" ? "bg-emerald-50 border-emerald-200/50" :
           editColor === "yellow" ? "bg-amber-50 border-amber-200/50" :
           editColor === "pink" ? "bg-rose-50 border-rose-200/50" :
           editColor === "purple" ? "bg-purple-50 border-purple-200/50" :
           "bg-white border-slate-100"
         }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-16 translate-x-12"></div>
            
            <Input 
              type="text" 
              placeholder="Note Title" 
              className="text-lg font-bold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-400 h-auto p-0 focus-visible:ring-0 shadow-none focus-visible:border-transparent relative z-10"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider relative z-10">
              <Clock className="w-3.5 h-3.5 text-slate-400"/> {activeNote ? activeNote.time : 'New Session Note'}
            </div>
            <div className="w-full h-px bg-slate-100/60 relative z-10"></div>
            <Textarea 
               placeholder="Start typing your session notes, student feedback, or industry insights here..." 
               className="flex-1 w-full resize-none text-[14px] font-medium leading-relaxed text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-400 p-0 focus-visible:ring-0 min-h-[25vh] shadow-none focus-visible:border-transparent relative z-10"
               value={editContent}
               onChange={(e) => setEditContent(e.target.value)}
            />

            {/* Color Picker Row */}
            <div className="flex flex-col gap-2 pt-3 border-t border-black/5 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Note Background Color</p>
              <div className="flex gap-2.5">
                {[
                  { key: "white", label: "White", class: "bg-white border-slate-200" },
                  { key: "blue", label: "Blue", class: "bg-blue-50 border-blue-200/60" },
                  { key: "teal", label: "Teal", class: "bg-emerald-50 border-emerald-200/60" },
                  { key: "yellow", label: "Yellow", class: "bg-amber-50 border-amber-200/60" },
                  { key: "pink", label: "Pink", class: "bg-rose-50 border-rose-200/60" },
                  { key: "purple", label: "Purple", class: "bg-purple-50 border-purple-200/60" }
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setEditColor(c.key as any)}
                    className={`w-7 h-7 rounded-full border transition-all hover:scale-110 active:scale-95 ${c.class} ${
                      editColor === c.key ? "ring-2 ring-slate-900 ring-offset-2 scale-105" : "border-slate-200"
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between pt-6 md:pt-8 px-1">
        <div className="flex items-center gap-3">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
            </Button>
          )}
          <h2 className="text-xl font-medium tracking-tight text-slate-900 leading-tight">Session Notes</h2>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 shadow-3xs">
          <FileText className="w-4 h-4" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">{notes.length} Total</span>
        </div>
      </div>

      <div className="flex gap-2 relative px-1">
         <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Search className="w-4 h-4" strokeWidth={2.5}/></div>
         <Input 
           type="text" 
           placeholder="Search through your mentorship archive..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="w-full h-14 bg-white pl-12 text-[14px] font-medium rounded-2xl outline-none transition-all border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200" 
         />
      </div>

      <div className="grid gap-5 px-1 mt-2">
        {filteredNotes.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
               <FileText className="w-10 h-10" />
             </div>
             <div>
               <p className="text-slate-900 font-medium">No notes found</p>
               <p className="text-slate-400 text-xs font-medium mt-1">Start recording your session insights today.</p>
             </div>
          </div>
        ) : filteredNotes.map(n => {
          const cardBg = 
            n.color === "blue" ? "bg-blue-50 border-blue-200/50 hover:border-blue-300" :
            n.color === "teal" ? "bg-emerald-50 border-emerald-200/50 hover:border-emerald-300" :
            n.color === "yellow" ? "bg-amber-50 border-amber-200/50 hover:border-amber-300" :
            n.color === "pink" ? "bg-rose-50 border-rose-200/50 hover:border-rose-300" :
            n.color === "purple" ? "bg-purple-50 border-purple-200/50 hover:border-purple-300" :
            "bg-white border-slate-100 hover:border-slate-200";

          const cardDot = 
            n.color === "blue" ? "bg-blue-400" :
            n.color === "teal" ? "bg-emerald-400" :
            n.color === "yellow" ? "bg-amber-400" :
            n.color === "pink" ? "bg-rose-400" :
            n.color === "purple" ? "bg-purple-400" :
            "bg-indigo-500";

          return (
            <div 
              key={n.id} 
              onClick={() => { setActiveNote(n); setEditTitle(n.title); setEditContent(n.content); setEditColor(n.color || "white"); setIsCreating(true); }}
              className={`p-6 rounded-[2rem] border shadow-sm relative group overflow-hidden transition-all duration-300 hover:shadow-md active:scale-[0.99] cursor-pointer ${cardBg}`}
            >
               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 bg-white/90 backdrop-blur px-2 py-1 rounded-xl shadow-sm border border-slate-100 z-20">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setActiveNote(n); setEditTitle(n.title); setEditContent(n.content); setEditColor(n.color || "white"); setIsCreating(true); }} className="w-9 h-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"><Edit2 className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} className="w-9 h-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4"/></Button>
               </div>
               
               <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${cardDot}`}></div>
                   <h3 className="text-[16px] font-bold text-slate-900 truncate pr-12">{n.title}</h3>
                 </div>
                 <p className="text-[14px] text-slate-600 font-medium leading-relaxed line-clamp-2">{n.content}</p>
                 <div className="flex items-center gap-2 mt-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-white/60 px-2.5 py-1.5 rounded-lg border border-slate-150 shadow-3xs">
                     <Clock className="w-3.5 h-3.5 text-indigo-400"/> {n.time}
                   </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button - Premium Style */}
      <div className="fixed bottom-28 right-6 z-40">
        <Button 
          onClick={() => { setEditTitle(''); setEditContent(''); setEditColor('white'); setActiveNote(null); setIsCreating(true); }} 
          className="w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/20 hover:scale-105 hover:-rotate-6 transition-all duration-300 bg-slate-900 text-white active:scale-95 group border-2 border-white"
          size="icon"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
