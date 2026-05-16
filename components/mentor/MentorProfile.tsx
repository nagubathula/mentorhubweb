"use client";

import { User, Settings, BookOpen, Clock, Star, Users, MapPin, Briefcase, Mail, PlayCircle, Lock, LogOut } from "lucide-react";
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
      <div className="flex items-center justify-between mt-6 px-1">
        <h2 className="text-[20px] font-semibold text-slate-800">Profile</h2>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full shadow-sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-6 flex flex-col items-center hover:translate-y-0 shadow-sm">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
          <img src={profile.avatar} className="w-full h-full object-cover bg-slate-100" alt={profile.name}/>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mt-4">{profile.name}</h3>
        <p className="text-[13px] text-slate-500 font-medium mt-1">{profile.role}</p>

        <div className="w-full mt-6 space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 text-[14px] text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" /> {profile.email}
          </div>
          <div className="flex items-center gap-3 text-[14px] text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" /> {profile.location}
          </div>
          <div className="flex items-center gap-3 text-[14px] text-slate-600">
            <Briefcase className="w-4 h-4 text-slate-400" /> 4 years mentoring
          </div>
        </div>

        <div className="w-full flex gap-2 mt-4 pt-2">
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <span className="text-[20px] font-bold text-slate-800">{metrics.mentees}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Mentees</span>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <span className="text-[20px] font-bold text-slate-800">{metrics.sessions}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Sessions</span>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <span className="text-[20px] font-bold text-slate-800 flex items-center gap-1">{metrics.rating}<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/></span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Rating</span>
            </div>
        </div>
      </Card>

      {/* My Courses */}
      <Card className="p-5 shadow-sm hover:translate-y-0">
         <div className="flex items-center gap-2 mb-4 text-slate-800 font-medium text-[15px]">
           <BookOpen className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> My Courses
         </div>
         <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">Exclusive training materials to level up your mentoring skills.</p>

         <div className="space-y-4">
           {myCourses.map(course => (
             <div key={course.id} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex gap-4 items-center group">
               {course.type === "NEW" && (
                 <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">NEW</div>
               )}
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${course.locked ? 'bg-slate-200 text-slate-400' : course.progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-[#0f172a] text-white'}`}>
                 {course.locked ? <Lock className="w-5 h-5"/> : <PlayCircle className="w-6 h-6"/>}
               </div>
               <div className="flex-1 min-w-0 pr-2">
                 <h4 className={`text-[14px] font-bold truncate ${course.locked ? 'text-slate-400' : 'text-slate-800'}`}>{course.title}</h4>
                 <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mt-1">
                   <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {course.modules} mods</span>
                   <span>·</span>
                   <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {course.duration}</span>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </Card>
      
      {/* Log Out Option */}
      <Button 
        onClick={onSignOut} 
        variant="destructive"
        className="w-full h-14 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-semibold text-[15px] rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors"
      >
        <LogOut className="w-[18px] h-[18px]" strokeWidth={2.5}/> Log Out
      </Button>

    </div>
  );
}
