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
         <div className="flex items-center justify-between mt-4 px-1">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => {setIsCreating(false); setActiveNote(null);}} 
             className="w-10 h-10 rounded-full"
           >
             <X className="w-5 h-5"/>
           </Button>
           <h2 className="text-[16px] font-semibold text-slate-800">{activeNote ? 'Edit Note' : 'New Note'}</h2>
           <Button variant="ghost" onClick={handleSaveNote} className="font-semibold text-[14px]">Save</Button>
         </div>

         <Card className="p-5 shadow-sm hover:translate-y-0 min-h-[60vh] flex flex-col gap-4">
            <Input 
              type="text" 
              placeholder="Note Title" 
              className="text-xl font-bold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 h-auto p-0 focus-visible:ring-0 shadow-none focus-visible:border-transparent"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5"/> {activeNote ? activeNote.time : 'Just now'}
            </div>
            <Textarea 
               placeholder="Start typing your session notes here..." 
               className="flex-1 w-full resize-none text-[15px] leading-relaxed text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-300 p-0 focus-visible:ring-0 min-h-[40vh] shadow-none focus-visible:border-transparent"
               value={editContent}
               onChange={(e) => setEditContent(e.target.value)}
            />
         </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <h2 className="text-[20px] font-semibold text-slate-800">Session Notes</h2>
      </div>

      <div className="flex gap-2 relative px-1">
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search className="w-4 h-4"/></div>
         <Input 
           type="text" 
           placeholder="Search notes..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="w-full h-12 bg-white pl-11 text-[14px] rounded-xl outline-none transition-colors border border-slate-200" 
         />
      </div>

      <div className="grid gap-4 mt-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>No notes found</p>
          </div>
        ) : filteredNotes.map(n => (
          <Card key={n.id} className="p-5 shadow-sm relative group overflow-hidden">
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur pl-2">
                <Button variant="ghost" size="icon" onClick={() => { setActiveNote(n); setEditTitle(n.title); setEditContent(n.content); setIsCreating(true); }} className="w-8 h-8 rounded-lg text-slate-700"><Edit2 className="w-4 h-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteNote(n.id)} className="w-8 h-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
             </div>
             
             <h3 className="text-[16px] font-bold text-slate-800 mb-2 truncate pr-16">{n.title}</h3>
             <p className="text-[14px] text-slate-500 leading-relaxed mb-4 line-clamp-3">{n.content}</p>
             <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
               <Clock className="w-3.5 h-3.5"/> {n.time}
             </div>
          </Card>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="h-20 shrink-0 relative">
        <Button 
          onClick={() => { setEditTitle(''); setEditContent(''); setActiveNote(null); setIsCreating(true); }} 
          className="absolute bottom-4 right-2 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#1e293b] transition-all z-40 bg-[#0f172a] text-white"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
