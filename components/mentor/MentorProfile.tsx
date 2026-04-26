import { User, Settings, BookOpen, Clock, Star, Users, MapPin, Briefcase, Mail, PlayCircle, Lock } from "lucide-react";

export function MentorProfile() {
  const profile = {
    name: "Vikram Patel",
    email: "vikram.p@mentorhub.io",
    role: "Senior React Developer",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
  };

  const myCourses = [
    { id: 1, title: "Advanced Mentoring Techniques", modules: 12, duration: "4 hours", progress: 100, locked: false },
    { id: 2, type: "NEW", title: "Handling Difficult Questions", modules: 5, duration: "1.5 hours", progress: 0, locked: false },
    { id: 3, title: "Career Coaching Mastery", modules: 8, duration: "3 hours", progress: 0, locked: true },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <h2 className="text-[20px] font-semibold text-slate-800">Profile</h2>
        <button className="bg-white border border-slate-200 text-slate-500 p-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
          <img src={profile.avatar} className="w-full h-full object-cover bg-slate-100" alt={profile.name}/>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mt-4">{profile.name}</h3>
        <p className="text-[13px] text-slate-500 font-medium mt-1">{profile.role}</p>

        <div className="w-full mt-6 space-y-3 pb-4 border-b border-slate-50">
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
              <span className="text-[20px] font-bold text-slate-800">14</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Mentees</span>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <span className="text-[20px] font-bold text-slate-800">340</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Sessions</span>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <span className="text-[20px] font-bold text-slate-800 flex items-center gap-1">4.9<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/></span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Rating</span>
            </div>
        </div>
      </div>

      {/* 6. My Courses */}
      <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100">
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
      </div>
    </div>
  );
}
