import { MessageSquare, Calendar, Circle, Check, Zap, Trophy, ShieldCheck, Heart, Sparkles, BookOpen, Clock, Activity, Medal, Star, Flame, Lightbulb, Bell, X } from "lucide-react";
import { useState } from "react";

export function MentorHome() {
  const [showNotification, setShowNotification] = useState(true);
  const [reviews, setReviews] = useState([
    { id: 1, title: "Grade Calculator", student: "Sneha Iyer", time: "2 hours ago" },
    { id: 2, title: "Data Visualization Set", student: "Vikram Patel", time: "5 hours ago" }
  ]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* 14. New Student Notifications */}
      {showNotification && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 mt-6 items-start mx-1">
          <div className="bg-[#0f172a] rounded-full p-2 text-white shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 mt-0.5 min-w-0">
             <h3 className="text-slate-900 font-semibold text-[15px]">New Student Assigned!</h3>
             <p className="text-slate-500 text-[13px] mt-1 leading-relaxed">Admin has assigned "Kavya Nair" to you for the Python Web Development track. Check the Students tab!</p>
          </div>
          <button onClick={() => setShowNotification(false)} className="text-slate-300 hover:text-slate-600 transition-colors p-1 shrink-0"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* 7. Daily Inspiration Widget */}
      <div className="bg-[#0f172a] rounded-[1.5rem] p-6 text-white shadow-md mx-1 mt-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-12"></div>
         <div className="flex items-center gap-2 mb-4 text-slate-400 font-medium text-[13px] tracking-wider uppercase">
           <Zap className="w-4 h-4 text-amber-400" /> Morning Thought
         </div>
         <p className="text-[17px] font-medium leading-relaxed italic text-slate-200 mb-4">
           "The best mentors don't just give answers, they help students fall in love with the questions."
         </p>
         <div className="flex gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[20px] font-bold flex items-center gap-1.5"><Flame className="w-5 h-5 text-amber-400" /> 5</span>
              <span className="text-[11px] text-slate-400">Day Streak</span>
            </div>
            <div className="w-px bg-white/10 my-1"></div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold flex items-center gap-1.5"><MessageSquare className="w-5 h-5 text-emerald-400" /> 12</span>
              <span className="text-[11px] text-slate-400">Responses</span>
            </div>
            <div className="w-px bg-white/10 my-1"></div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold flex items-center gap-1.5"><Trophy className="w-5 h-5 text-amber-300" /> 8</span>
              <span className="text-[11px] text-slate-400">Improved</span>
            </div>
         </div>
      </div>

      {/* 8. Mentor Stats */}
      <div className="flex gap-4 px-1">
         <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-2"><BookOpen className="w-4 h-4"/> <span className="text-[11px] font-bold uppercase tracking-wider">Students</span></div>
            <div className="text-2xl font-bold text-slate-800">14</div>
         </div>
         <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-2"><Clock className="w-4 h-4"/> <span className="text-[11px] font-bold uppercase tracking-wider">Hours</span></div>
            <div className="text-2xl font-bold text-slate-800">128</div>
         </div>
         <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-2"><Star className="w-4 h-4"/> <span className="text-[11px] font-bold uppercase tracking-wider">Rating</span></div>
            <div className="text-2xl font-bold text-slate-800">4.9</div>
         </div>
      </div>

      {/* 1. Student Messages (Re-used existing) */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-slate-800 font-medium text-[15px]">
          <MessageSquare className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> 
          Student Messages 
          <span className="bg-rose-100 text-rose-500 text-[11px] px-2 py-0.5 rounded-full ml-1">2 new</span>
        </div>

        <div className="flex gap-4 mb-6 relative">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" className="w-[42px] h-[42px] rounded-full object-cover shrink-0 bg-slate-100" alt="Arjun"/>
          <div className="flex-1 mt-0.5">
            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-medium text-slate-800">Arjun Mehta</span> 
              <span className="text-slate-300 text-[12px]">9:15 AM</span> 
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </div>
            <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">Sir, I&apos;m stuck on list comprehensions. Can we discuss in today&apos;s session?</p>
            <button className="text-[12px] text-slate-400 mt-2 font-medium hover:text-slate-600 flex items-center gap-1">Reply &rarr;</button>
          </div>
        </div>

        <div className="flex gap-4 relative">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-[42px] h-[42px] rounded-full object-cover shrink-0 bg-slate-100" alt="Sneha"/>
          <div className="flex-1 mt-0.5">
            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-medium text-slate-800">Sneha Iyer</span> 
              <span className="text-slate-300 text-[12px]">8:42 AM</span> 
            </div>
            <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">Submitted my Grade Calculator project for review! 🎉</p>
            <button className="text-[12px] text-slate-400 mt-2 font-medium hover:text-slate-600 flex items-center gap-1">Reply &rarr;</button>
          </div>
        </div>
      </div>

      {/* 2 & 3. Today's Plan & Mentees Overview (Re-used existing layout) */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800 font-medium text-[15px]">
            <Calendar className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> Today&apos;s Plan
          </div>
          <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-500 text-[12px] px-2.5 py-1 rounded-full font-medium">1/4 sessions</span>
            <span className="bg-orange-50 text-orange-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{reviews.length} reviews</span>
          </div>
        </div>

        {/* 3. Mentees */}
        <p className="text-[11px] text-slate-400 tracking-widest font-semibold mb-4 uppercase">Mentees</p>
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img className="w-12 h-12 rounded-full border border-slate-200 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Arjun"/>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full ring-[2.5px] ring-white"></div>
            </div>
            <span className="text-[12px] text-slate-600 mt-2 font-medium">Arjun</span>
            <div className="w-[30px] h-1 bg-blue-500 rounded-full mt-1.5 flex overflow-hidden">
               <div className="bg-blue-600 w-2/3 h-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <img className="w-12 h-12 rounded-full border border-slate-200 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" alt="Priya"/>
            </div>
            <span className="text-[12px] text-slate-600 mt-2 font-medium">Priya</span>
            <div className="w-[30px] h-1 bg-slate-200 rounded-full mt-1.5 flex overflow-hidden">
               <div className="bg-orange-400 w-1/2 h-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative opacity-80">
              <img className="w-12 h-12 rounded-full border border-slate-200 object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" alt="Rahul"/>
              <div className="absolute bottom-0 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full ring-[2.5px] ring-white flex items-center justify-center text-[8px] text-white font-bold">!</div>
            </div>
            <span className="text-[12px] text-slate-600 mt-2 font-medium">Rahul</span>
            <div className="w-[30px] h-1 bg-slate-200 rounded-full mt-1.5 flex overflow-hidden">
               <div className="bg-amber-400 w-1/4 h-full"></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 my-6"></div>

        {/* Sessions */}
        <p className="text-[11px] text-slate-400 tracking-widest font-semibold mb-4 uppercase">Sessions</p>
        <div className="space-y-4">
           <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100/50">
             <Circle className="w-5 h-5 text-slate-300 mt-1 shrink-0"/>
             <div className="text-[12px] text-slate-400 font-medium mt-1.5 w-[55px] shrink-0">10:00 AM</div>
             <div className="flex-1 min-w-0">
               <p className="text-[14px] text-slate-800 font-medium truncate">OOP Concepts Review</p>
               <p className="text-[13px] text-slate-400 mt-0.5">Arjun Mehta</p>
             </div>
             <span className="bg-blue-50 text-blue-500 text-[11px] px-2 py-0.5 rounded font-medium mt-0.5 shrink-0">1:1</span>
           </div>

           <div className="flex gap-4 items-start p-4 bg-white border border-transparent">
             <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-white mt-1 shrink-0"><Check className="w-3 h-3"/></div>
             <div className="text-[12px] text-slate-300 font-medium mt-1.5 w-[55px] shrink-0">11:30 AM</div>
             <div className="flex-1 min-w-0">
               <p className="text-[14px] text-slate-300 font-medium line-through truncate">Module 6: Functions Deep-...</p>
               <p className="text-[13px] text-slate-300 mt-0.5">Group Session</p>
             </div>
             <span className="bg-slate-100 text-slate-400 text-[11px] px-2 py-0.5 rounded font-medium mt-0.5 shrink-0">Group</span>
           </div>

           <div className="flex gap-4 items-start p-4 bg-white border border-transparent">
             <Circle className="w-5 h-5 text-slate-300 mt-1 shrink-0"/>
             <div className="text-[12px] text-slate-400 font-medium mt-1.5 w-[55px] shrink-0">2:00 PM</div>
             <div className="flex-1 min-w-0">
               <p className="text-[14px] text-slate-800 font-medium truncate">Project Review: Grade Calc...</p>
               <p className="text-[13px] text-slate-400 mt-0.5">Sneha Iyer</p>
             </div>
             <span className="bg-amber-50 text-amber-600 text-[11px] px-2 py-0.5 rounded font-medium mt-0.5 shrink-0">Review</span>
           </div>
        </div>

        <div className="border-t border-slate-50 my-6"></div>
        {/* 4. Review Queue List directly in Home Plan */}
        <p className="text-[11px] text-slate-400 tracking-widest font-semibold mb-4 uppercase">Pending Reviews</p>
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-100 transition-colors">
              <div className="bg-blue-50 text-blue-500 rounded-lg p-2"><Medal className="w-4 h-4"/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-slate-800 truncate">{r.title}</p>
                <p className="text-[12px] text-slate-400">{r.student} • {r.time}</p>
              </div>
              <button onClick={() => setReviews(prev => prev.filter(item => item.id !== r.id))} className="text-[11px] font-medium bg-slate-900 text-white px-3 py-1.5 rounded-full shrink-0 shadow-sm hover:scale-105 transition-transform">Review</button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-[13px] text-slate-400">All caught up!</p>}
        </div>
      </div>

      {/* 9. Student Gratitude Wall */}
      <div className="bg-emerald-50 rounded-[1.5rem] border border-emerald-100 p-5 shadow-sm relative overflow-hidden">
        <Heart className="absolute -bottom-4 -right-4 w-24 h-24 text-emerald-200/50 -rotate-12" />
        <div className="flex items-center gap-2 mb-4 text-emerald-800 font-semibold text-[15px] relative z-10">
          <Heart className="w-[18px] h-[18px] fill-emerald-200 text-emerald-600" strokeWidth={2}/> Gratitude Wall
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-50 relative z-10">
          <p className="text-[14px] text-emerald-900 italic leading-relaxed">"Honestly transformed how I approach debugging. Thanks for being so patient with me during our session yesterday!"</p>
          <div className="flex items-center gap-2 mt-4">
             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-6 h-6 rounded-full object-cover" alt="Student" />
             <span className="text-[12px] font-medium text-emerald-700">- Priya S.</span>
          </div>
        </div>
      </div>

      {/* 11. Mentor Best Practices */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-slate-800 font-medium text-[15px]">
          <Lightbulb className="w-[18px] h-[18px] text-amber-500" strokeWidth={2}/> Mentor Playbook
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-[14px] text-slate-700 font-medium">The 5-Minute Debug Method</span>
            <span className="text-slate-400 text-[18px]">&rarr;</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-[14px] text-slate-700 font-medium">Handling Imposter Syndrome</span>
            <span className="text-slate-400 text-[18px]">&rarr;</span>
          </div>
        </div>
      </div>

    </div>
  );
}
