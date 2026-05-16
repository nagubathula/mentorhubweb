"use client";

import { Search, Plus, FileText, Clock, Trash2, Edit2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export function MentorNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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
            { id: 1, title: "Arjun's Debugging Issue", content: "Discussed list comprehensions and how they map to standard loops. Arjun seemed to grasp the concept after 2 examples.", time: "Today, 10:45 AM" },
            { id: 2, title: "Group Session Module 6 Prep", content: "Make sure all students have completed the pre-reading. Sneha usually leads the questions so prepare a challenging one for her.", time: "Yesterday, 6:00 PM" },
            { id: 3, title: "Rahul Catchup", content: "Needs extra motivation. Falling behind on assignments. Set a micro-goal for this weekend to just write 10 lines of code.", time: "Oct 12" }
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
       updated = notes.map(n => n.id === activeNote.id ? { ...n, title: editTitle, content: editContent } : n);
    } else {
       const newNote = {
         id: Date.now(),
         title: editTitle,
         content: editContent,
         time: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       };
       updated = [newNote, ...notes];
    }
    setNotes(updated);
    saveNotesToDB(updated);
    setIsCreating(false);
    setActiveNote(null);
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
         <div className="flex items-center justify-between mt-6 px-1">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => {setIsCreating(false); setActiveNote(null);}} 
             className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
           >
             <X className="w-5 h-5"/>
           </Button>
           <h2 className="text-xl font-bold font-volkhov text-slate-900 tracking-tight">{activeNote ? 'Edit Note' : 'New Note'}</h2>
           <Button 
             onClick={handleSaveNote} 
             className="bg-slate-900 text-white px-5 h-10 rounded-xl text-[13px] font-bold shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
           >
             Save
           </Button>
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[60vh] flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-16 translate-x-12"></div>
            
            <Input 
              type="text" 
              placeholder="Note Title" 
              className="text-2xl font-bold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-200 h-auto p-0 focus-visible:ring-0 shadow-none focus-visible:border-transparent font-volkhov relative z-10"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest relative z-10">
              <Clock className="w-4 h-4 text-indigo-400"/> {activeNote ? activeNote.time : 'New Session Note'}
            </div>
            <div className="w-full h-px bg-slate-50 relative z-10"></div>
            <Textarea 
               placeholder="Start typing your session notes, student feedback, or industry insights here..." 
               className="flex-1 w-full resize-none text-[15px] font-medium leading-relaxed text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-300 p-0 focus-visible:ring-0 min-h-[40vh] shadow-none focus-visible:border-transparent relative z-10"
               value={editContent}
               onChange={(e) => setEditContent(e.target.value)}
            />
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-8 px-1">
        <h2 className="text-2xl font-bold font-volkhov text-slate-900 tracking-tight leading-tight">Session Notes</h2>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 shadow-3xs">
          <FileText className="w-4 h-4" />
          <span className="text-[11px] font-black uppercase tracking-wider">{notes.length} Total</span>
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
               <p className="text-slate-900 font-bold font-volkhov">No notes found</p>
               <p className="text-slate-400 text-xs font-medium mt-1">Start recording your session insights today.</p>
             </div>
          </div>
        ) : filteredNotes.map(n => (
          <div key={n.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-md hover:border-slate-200 active:scale-[0.98] cursor-pointer">
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 bg-white/90 backdrop-blur px-2 py-1 rounded-xl shadow-sm border border-slate-100">
                <Button variant="ghost" size="icon" onClick={() => { setActiveNote(n); setEditTitle(n.title); setEditContent(n.content); setIsCreating(true); }} className="w-9 h-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"><Edit2 className="w-4 h-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteNote(n.id)} className="w-9 h-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4"/></Button>
             </div>
             
             <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                 <h3 className="text-[16px] font-bold text-slate-900 font-volkhov truncate pr-12">{n.title}</h3>
               </div>
               <p className="text-[14px] text-slate-500 font-medium leading-relaxed line-clamp-2">{n.content}</p>
               <div className="flex items-center gap-2 mt-2">
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                   <Clock className="w-3.5 h-3.5 text-indigo-400"/> {n.time}
                 </div>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button - Premium Style */}
      <div className="fixed bottom-28 right-6 z-40">
        <Button 
          onClick={() => { setEditTitle(''); setEditContent(''); setActiveNote(null); setIsCreating(true); }} 
          className="w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/20 hover:scale-105 hover:-rotate-6 transition-all duration-300 bg-slate-900 text-white active:scale-95 group"
          size="icon"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
