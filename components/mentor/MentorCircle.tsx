import { Users, Search, Medal, MessageCircle, Heart, Share2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function MentorCircle() {
  const [mentors, setMentors] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchMentors = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'MENTOR');
      if (data && data.length > 0) {
        setMentors(data.map((m, index) => ({
          id: m.id,
          name: m.name || m.email?.split('@')[0] || 'Unknown Mentor',
          role: (m.preferences as any)?.q101 || m.expertise || "Mentor",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`,
          sessions: Math.floor(Math.random() * 50) + 10,
          top: index < 5
        })));
      } else {
        setMentors([]);
      }
    };
    fetchMentors();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Mentorship Circle</h2>
          <p className="text-[13px] text-slate-500 font-medium">128 mentors connected</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-500 p-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-indigo-600 rounded-[1.5rem] p-6 text-white shadow-md mx-1 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
         <div className="flex items-center gap-2 mb-2 relative z-10">
           <Users className="w-5 h-5 text-indigo-200" />
           <span className="font-semibold text-[15px]">Community Activity</span>
         </div>
         <p className="text-3xl font-bold mt-2 relative z-10">340</p>
         <p className="text-indigo-200 text-[13px] font-medium relative z-10">Sessions completed this week across MentorHub</p>
      </div>

      {/* 10. Top Mentors Spotlight */}
      <h3 className="text-[11px] text-slate-400 tracking-widest font-semibold uppercase px-1 mt-8 mb-4">Top Mentors This Month</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 hidden-scrollbar">
        {mentors.filter(m => m.top).map(m => (
          <div key={m.id} className="min-w-[140px] bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center relative shrink-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-white p-1.5 rounded-full shadow-sm ring-4 ring-slate-50">
              <Star className="w-3.5 h-3.5 fill-white" />
            </div>
            <img src={m.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 mt-2 mb-3 bg-slate-100" alt={m.name}/>
            <h4 className="text-[14px] font-bold text-slate-800 leading-tight">{m.name}</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wide px-2 relative min-h-[30px] flex items-center justify-center">{m.role}</p>
          </div>
        ))}
      </div>

      <h3 className="text-[11px] text-slate-400 tracking-widest font-semibold uppercase px-1 mt-4 mb-4">Feed</h3>
      <div className="space-y-4">
        {/* Post Mock */}
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
           <div className="flex gap-3 mb-3">
             <img src={mentors[1].avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar"/>
             <div>
               <h4 className="text-[14px] font-bold text-slate-800">{mentors[1].name}</h4>
               <p className="text-[11px] text-slate-400 font-medium">{mentors[1].role} · 2h ago</p>
             </div>
           </div>
           <p className="text-[14px] text-slate-700 leading-relaxed">
             Just finished a fantastic pair programming session on React hooks! Highly recommend using practical analogies when explaining `useEffect` dependency arrays to beginners.
           </p>
           <div className="flex gap-6 mt-4 pt-4 border-t border-slate-50">
             <button className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors text-[13px] font-medium"><Heart className="w-4 h-4"/> 24</button>
             <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-500 transition-colors text-[13px] font-medium"><MessageCircle className="w-4 h-4"/> 5</button>
             <button className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-500 transition-colors text-[13px] font-medium ml-auto"><Share2 className="w-4 h-4"/></button>
           </div>
        </div>
      </div>
    </div>
  );
}
