import { Search, Plus, FileText, Clock, Trash2, Edit2, X } from "lucide-react";
import { useState } from "react";

export function MentorNotes() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Arjun's Debugging Issue", content: "Discussed list comprehensions and how they map to standard loops. Arjun seemed to grasp the concept after 2 examples.", time: "Today, 10:45 AM" },
    { id: 2, title: "Group Session Module 6 Prep", content: "Make sure all students have completed the pre-reading. Sneha usually leads the questions so prepare a challenging one for her.", time: "Yesterday, 6:00 PM" },
    { id: 3, title: "Rahul Catchup", content: "Needs extra motivation. Falling behind on assignments. Set a micro-goal for this weekend to just write 10 lines of code.", time: "Oct 12" }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeNote, setActiveNote] = useState<any>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleSaveNote = () => {
    if (!editTitle) return;
    if (activeNote?.id) {
       setNotes(notes.map(n => n.id === activeNote.id ? { ...n, title: editTitle, content: editContent } : n));
    } else {
       setNotes([{ id: Date.now(), title: editTitle, content: editContent, time: "Just now" }, ...notes]);
    }
    setIsCreating(false);
    setActiveNote(null);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  }

  if (isCreating) {
    return (
      <div className="space-y-6 pb-20">
         <div className="flex items-center justify-between mt-4 px-1">
           <button onClick={() => {setIsCreating(false); setActiveNote(null);}} className="text-slate-500 hover:text-slate-700 p-2 -ml-2"><X className="w-5 h-5"/></button>
           <h2 className="text-[16px] font-semibold text-slate-800">{activeNote ? 'Edit Note' : 'New Note'}</h2>
           <button onClick={handleSaveNote} className="text-indigo-600 font-semibold text-[14px]">Save</button>
         </div>

         <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex flex-col min-h-[60vh]">
            <input 
              type="text" 
              placeholder="Note Title" 
              className="text-xl font-bold text-slate-900 border-none outline-none bg-transparent mb-4 placeholder:text-slate-300"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium mb-6">
              <Clock className="w-3.5 h-3.5"/> {activeNote ? activeNote.time : 'Just now'}
            </div>
            <textarea 
              placeholder="Start typing your session notes here..." 
              className="flex-1 w-full resize-none text-[15px] leading-relaxed text-slate-700 bg-transparent border-none outline-none placeholder:text-slate-300"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
         </div>
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
         <input type="text" placeholder="Search notes..." className="w-full h-12 bg-white rounded-xl border border-slate-200 pl-11 text-[14px] outline-none hover:border-slate-300 focus:border-indigo-500 transition-colors shadow-sm" />
      </div>

      <div className="grid gap-4 mt-2">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>No notes yet</p>
          </div>
        ) : notes.map(n => (
          <div key={n.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 relative group overflow-hidden">
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur pl-2">
                <button onClick={() => { setActiveNote(n); setEditTitle(n.title); setEditContent(n.content); setIsCreating(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => deleteNote(n.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
             </div>
             
             <h3 className="text-[16px] font-bold text-slate-800 mb-2 truncate pr-16">{n.title}</h3>
             <p className="text-[14px] text-slate-500 leading-relaxed mb-4 line-clamp-3">{n.content}</p>
             <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
               <Clock className="w-3.5 h-3.5"/> {n.time}
             </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button onClick={() => { setEditTitle(''); setEditContent(''); setActiveNote(null); setIsCreating(true); }} className="fixed bottom-24 right-6 w-14 h-14 bg-[#0f172a] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#1e293b] transition-all z-40">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
