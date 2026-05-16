"use client";

import { User, Settings, BookOpen, Clock, Star, Users, MapPin, Briefcase, Mail, PlayCircle, Lock, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export function MentorProfile({ onSignOut }: { onSignOut?: () => void }) {
  const [profile, setProfile] = useState<any>({
    name: "Vikram Patel",
    email: "vikram.p@kindmentor.com",
    role: "Senior React Developer",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
  });

  const [metrics, setMetrics] = useState({
    mentees: 0,
    sessions: 0,
    rating: 5.0
  });

  useEffect(() => {
    const fetchMentorProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const currentUserId = session.user.id;

      // Fetch profile
      const { data: profData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();

      if (profData) {
        setProfile({
          name: profData.name || profData.email?.split("@")[0] || "Mentor",
          email: profData.email || "",
          role: profData.expertise || "Senior Software Developer",
          location: (profData.preferences as any)?.location || "Bangalore, India",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId}`
        });
      }

      // Fetch mentees mapping count
      const { data: mappings } = await supabase
        .from("mapping")
        .select("id")
        .eq("mentor_id", currentUserId);

      const menteesCount = mappings?.length || 0;

      // Fetch completed sessions count
      const { data: sessData } = await supabase
        .from("sessions")
        .select("id")
        .eq("mentor_id", currentUserId)
        .eq("status", "Completed");

      const completedCount = sessData?.length || 0;

      // Fetch ratings average
      const { data: reviewsReceived } = await supabase
        .from("reviews")
        .select("rating")
        .eq("reviewee_id", currentUserId);

      let avgRating = 5.0;
      if (reviewsReceived && reviewsReceived.length > 0) {
        const rated = reviewsReceived.filter(r => r.rating !== null);
        if (rated.length > 0) {
          avgRating = Math.round((rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length) * 10) / 10;
        }
      }

      setMetrics({
        mentees: menteesCount,
        sessions: completedCount,
        rating: avgRating
      });
    };

    fetchMentorProfile();
  }, []);

  const myCourses = [
    { id: 1, title: "Advanced Mentoring Techniques", modules: 12, duration: "4 hours", progress: 100, locked: false },
    { id: 2, type: "NEW", title: "Handling Difficult Questions", modules: 5, duration: "1.5 hours", progress: 0, locked: false },
    { id: 3, title: "Career Coaching Mastery", modules: 8, duration: "3 hours", progress: 0, locked: true },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-8 px-1">
        <h2 className="text-2xl font-bold font-volkhov text-slate-900 tracking-tight">My Profile</h2>
        <Button variant="ghost" size="icon" className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 active:scale-95 transition-transform">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -translate-y-20 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl translate-y-14 -translate-x-14"></div>

        <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative z-10 bg-slate-50 group-hover:scale-105 transition-transform duration-500">
          <img src={profile.avatar} className="w-full h-full object-cover" alt={profile.name}/>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mt-6 font-volkhov relative z-10">{profile.name}</h3>
        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 relative z-10">{profile.role}</p>

        <div className="w-full mt-10 grid grid-cols-1 gap-4 pb-8 border-b border-slate-50 relative z-10">
          <div className="flex items-center gap-4 text-[13px] text-slate-600 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-3xs"><Mail className="w-4.5 h-4.5" /></div>
            {profile.email}
          </div>
          <div className="flex items-center gap-4 text-[13px] text-slate-600 font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-3xs"><MapPin className="w-4.5 h-4.5" /></div>
            {profile.location}
          </div>
        </div>

        <div className="w-full flex justify-between mt-8 relative z-10">
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-black text-slate-900 font-volkhov">{metrics.mentees}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Mentees</span>
            </div>
            <div className="w-px h-10 bg-slate-100 self-center"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-black text-slate-900 font-volkhov">{metrics.sessions}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Sessions</span>
            </div>
            <div className="w-px h-10 bg-slate-100 self-center"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-black text-slate-900 font-volkhov flex items-center gap-1.5">
                {metrics.rating}
                <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400"/>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Rating</span>
            </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <BookOpen className="w-5 h-5" />
             </div>
             <p className="text-[15px] font-bold text-slate-900">Training Modules</p>
           </div>
           <Button variant="ghost" className="text-[11px] font-black text-indigo-600 uppercase tracking-wider px-0 hover:bg-transparent">View All</Button>
         </div>

         <div className="space-y-4">
           {myCourses.map(course => (
             <div key={course.id} className="relative p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex gap-4 items-center group active:scale-[0.98] transition-all cursor-pointer">
               {course.type === "NEW" && (
                 <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">New</div>
               )}
               <div className={cn(
                 "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300",
                 course.locked ? 'bg-slate-100 text-slate-300' : 
                 course.progress === 100 ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white group-hover:bg-indigo-600'
               )}>
                 {course.locked ? <Lock className="w-5 h-5"/> : <PlayCircle className="w-6 h-6"/>}
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className={cn(
                   "text-[14px] font-bold truncate transition-colors",
                   course.locked ? 'text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'
                 )}>{course.title}</h4>
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                   <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {course.modules} Mods</span>
                   <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {course.duration}</span>
                 </div>
               </div>
               {!course.locked && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />}
             </div>
           ))}
         </div>
      </div>
      
      {/* Log Out Option */}
      <div className="px-1">
        <Button 
          onClick={onSignOut} 
          className="w-full h-16 bg-white hover:bg-rose-50 border border-slate-100 hover:border-rose-100 text-slate-400 hover:text-rose-600 font-bold text-[14px] uppercase tracking-[0.15em] rounded-[1.5rem] flex items-center justify-center gap-3 shadow-sm transition-all active:scale-[0.98] group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
          Sign Out
        </Button>
      </div>
    </div>

  );
}
