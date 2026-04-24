import { ChevronDown, Search, ArrowRight, MessageSquare, Video, Medal, Target, MapPin, Clock, BookOpen, Layers, CheckCircle2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function MentorStudents() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'STUDENT');
      if (data) {
        setStudents(data.map(p => ({
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'Unknown Student',
          course: (p.preferences as any)?.q1 || "Mentorship Track",
          progress: Math.floor(Math.random() * 60) + 20,
          streak: Math.floor(Math.random() * 10),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
          status: "Active",
          needsAttention: Math.random() > 0.8
        })));
      }
    };
    fetchStudents();
  }, []);

  if (selectedStudent) {
    return (
      <div className="space-y-6 pb-20">
         <div className="flex items-center gap-3 mt-4 px-1">
           <button onClick={() => setSelectedStudent(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
             <ChevronDown className="w-5 h-5 rotate-90" />
           </button>
           <h2 className="text-[18px] font-semibold text-slate-800">Student Profile</h2>
         </div>

         <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative z-10">
              <img src={selectedStudent.avatar} className="w-full h-full object-cover bg-slate-100" alt={selectedStudent.name}/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-4 relative z-10">{selectedStudent.name}</h3>
            <p className="text-[14px] text-indigo-600 font-medium mt-1 relative z-10">{selectedStudent.course}</p>
            
            <div className="flex gap-2 mt-4 relative z-10 w-full px-2">
              <button className="flex-1 bg-[#0f172a] text-white py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-colors"><MessageSquare className="w-4 h-4"/> Message</button>
              <button className="flex-1 bg-indigo-50 text-indigo-600 py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"><Video className="w-4 h-4"/> Call</button>
            </div>
         </div>

         {/* 12. Student Detail View Key Metrics */}
         <div className="flex gap-3 px-1">
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[24px] font-bold text-slate-800">{selectedStudent.streak}</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Day Streak</p>
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[24px] font-bold text-slate-800">85%</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Quiz Avg</p>
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-[24px] font-bold text-slate-800">4/12</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Modules</p>
            </div>
         </div>

         <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 mb-4 text-slate-800 font-medium text-[15px]">
             <Layers className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> Current Module
           </div>
           <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
             <div className="flex justify-between items-start mb-2">
               <h4 className="text-[14px] font-semibold text-indigo-900">Variables & Data Types</h4>
               <span className="text-[11px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md">IN PROGRESS</span>
             </div>
             <div className="w-full h-1.5 bg-indigo-100 rounded-full mt-4 flex overflow-hidden">
                <div className="bg-indigo-500 w-3/4 h-full"></div>
             </div>
             <p className="text-[12px] text-indigo-500 font-medium mt-2 text-right">75% Complete</p>
           </div>
         </div>

         <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
            <h3 className="text-[15px] font-medium text-slate-800 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Target className="w-4 h-4"/></div>
                <div className="flex-1"><p className="text-[14px] font-medium text-slate-700">Set Weekly Goal</p></div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left">
                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg"><Medal className="w-4 h-4"/></div>
                <div className="flex-1"><p className="text-[14px] font-medium text-slate-700">Award Badge</p></div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <h2 className="text-[20px] font-semibold text-slate-800">My Students</h2>
        <button className="bg-white border border-slate-200 text-slate-500 p-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-4">
        {students.map(s => (
          <div key={s.id} onClick={() => setSelectedStudent(s)} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer flex flex-col relative overflow-hidden group">
            {s.needsAttention && (
               <div className="absolute top-0 right-0 bg-red-50 text-red-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-b border-l border-red-100 flex items-center gap-1 z-10">
                 NEEDS ATTENTION
               </div>
            )}
            <div className="flex gap-4">
              <img src={s.avatar} className="w-14 h-14 rounded-full object-cover border border-slate-100 bg-slate-50" alt={s.name} />
              <div className="flex-1">
                 <h3 className="text-[15px] font-bold text-slate-800">{s.name}</h3>
                 <p className="text-[13px] text-slate-500 font-medium mb-1 line-clamp-1">{s.course}</p>
                 <div className="flex items-center gap-2 text-[11px] mt-2">
                   <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{s.status}</span>
                   <span className="flex items-center gap-1 text-slate-400 font-medium"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/> {s.streak} day streak</span>
                 </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50">
               <div className="flex justify-between items-center text-[12px] font-medium text-slate-500 mb-2">
                 <span>Course Progress</span>
                 <span>{s.progress}%</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className={`h-full rounded-full ${s.needsAttention ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${s.progress}%`}}></div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
