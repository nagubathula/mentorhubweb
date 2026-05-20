with open("components/mentor/MentorHome.tsx", "r") as f:
    content = f.read()

# 1. Update export function signature
content = content.replace("export function MentorHome() {", "export function MentorHome({ featureFlags = {} }: { featureFlags?: Record<string, boolean> }) {", 1)

# 2. Wrap Notifications
old_notification = """      {/* 14. New Student Notifications (Real Data) - Premium Light Theme */}
      {showNotification && assignedStudents.length > 0 && ("""

new_notification = """      {/* 14. New Student Notifications (Real Data) - Premium Light Theme */}
      {featureFlags.mentor_students !== false && showNotification && assignedStudents.length > 0 && ("""

content = content.replace(old_notification, new_notification, 1)

# 3. Wrap Daily Inspiration Widget
old_inspiration = """      {/* 7. Daily Inspiration Widget - Premium Light Theme */}
      <div 
        onClick={() => setShowInspiration(true)}
        className="bg-white border border-slate-100 p-7 mx-1 mt-4 relative overflow-hidden cursor-pointer hover:shadow-2xl hover:border-indigo-100 active:scale-[0.99] transition-all rounded-[2rem] shadow-xl shadow-slate-200/50 group"
      >
         <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-[80px] -translate-y-24 translate-x-20"></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full blur-[60px] translate-y-16 -translate-x-16"></div>
         
         <div className="flex items-center gap-2 mb-5 text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase relative z-10">
           <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Morning Thought
         </div>
         <p className="text-[20px] font-medium leading-relaxed italic text-slate-800 mb-8 relative z-10">
           "The best mentors don't just give answers, they help students fall in love with the questions."
         </p>
         <div className="flex justify-between pt-6 border-t border-slate-100 relative z-10">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Day Streak</span>
              <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> 5</span>
            </div>
            <div className="w-px bg-slate-100 my-1"></div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Responses</span>
              <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><MessageSquare className="w-5 h-5 text-indigo-500 fill-indigo-500" /> 12</span>
            </div>
            <div className="w-px bg-slate-100 my-1"></div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Improved</span>
              <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><Trophy className="w-5 h-5 text-amber-500 fill-amber-500" /> 8</span>
            </div>
         </div>
      </div>"""

new_inspiration = """      {/* 7. Daily Inspiration Widget - Premium Light Theme */}
      {featureFlags.mentor_inspiration !== false && (
        <div 
          onClick={() => setShowInspiration(true)}
          className="bg-white border border-slate-100 p-7 mx-1 mt-4 relative overflow-hidden cursor-pointer hover:shadow-2xl hover:border-indigo-100 active:scale-[0.99] transition-all rounded-[2rem] shadow-xl shadow-slate-200/50 group animate-in fade-in zoom-in-95 duration-200"
        >
           <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-[80px] -translate-y-24 translate-x-20"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full blur-[60px] translate-y-16 -translate-x-16"></div>
           
           <div className="flex items-center gap-2 mb-5 text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase relative z-10">
             <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Morning Thought
           </div>
           <p className="text-[20px] font-medium leading-relaxed italic text-slate-800 mb-8 relative z-10">
             "The best mentors don't just give answers, they help students fall in love with the questions."
           </p>
           <div className="flex justify-between pt-6 border-t border-slate-100 relative z-10">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Day Streak</span>
                <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> 5</span>
              </div>
              <div className="w-px bg-slate-100 my-1"></div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Responses</span>
                <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><MessageSquare className="w-5 h-5 text-indigo-500 fill-indigo-500" /> 12</span>
              </div>
              <div className="w-px bg-slate-100 my-1"></div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Improved</span>
                <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><Trophy className="w-5 h-5 text-amber-500 fill-amber-500" /> 8</span>
              </div>
           </div>
        </div>
      )}"""

content = content.replace(old_inspiration, new_inspiration, 1)

# 4. Wrap Stats Cards individually
old_stats = """      {/* 8. Mentor Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 px-1">
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2">
              <BookOpen className="w-5 h-5"/>
            </div>
            <div className="text-[17px] font-medium tracking-tight text-slate-900 leading-none">{stats.students}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">Mentees</div>
         </div>
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-2">
              <Clock className="w-5 h-5"/>
            </div>
            <div className="text-[17px] font-medium tracking-tight text-slate-900 leading-none">{stats.hours}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">Hours</div>
         </div>
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
              <Star className="w-5 h-5 fill-emerald-500"/>
            </div>
            <div className="text-[17px] font-medium tracking-tight text-slate-900 leading-none">{stats.rating}</div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">Rating</div>
         </div>
      </div>"""

new_stats = """      {/* 8. Mentor Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-1">
         {featureFlags.mentor_students !== false && (
           <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2">
                <BookOpen className="w-5 h-5"/>
              </div>
              <div className="text-[17px] font-medium tracking-tight text-slate-900 leading-none">{stats.students}</div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">Mentees</div>
           </div>
         )}
         {featureFlags.mentor_sessions !== false && (
           <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-2">
                <Clock className="w-5 h-5"/>
              </div>
              <div className="text-[17px] font-medium tracking-tight text-slate-900 leading-none">{stats.hours}</div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">Hours</div>
           </div>
         )}
         {featureFlags.mentor_sessions !== false && (
           <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
                <Star className="w-5 h-5 fill-emerald-500"/>
              </div>
              <div className="text-[17px] font-medium tracking-tight text-slate-900 leading-none">{stats.rating}</div>
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-2">Rating</div>
           </div>
         )}
      </div>"""

content = content.replace(old_stats, new_stats, 1)

# 5. Wrap Student Messages Card
old_messages_card = """      {/* 1. Student Messages (Real Data) */}
      <Card className="p-5 shadow-sm">"""

new_messages_card = """      {/* 1. Student Messages (Real Data) */}
      {featureFlags.mentor_messages !== false && (
        <Card className="p-5 shadow-sm">"""

content = content.replace(old_messages_card, new_messages_card, 1)

# Add closing brace to Student Messages Card (before 2 & 3. Today's Plan)
old_closing_messages = """            ))
          )}
        </div>
      </Card>

      {/* 2 & 3. Today's Plan & Mentees Overview */}"""

new_closing_messages = """            ))
          )}
        </div>
      </Card>
      )}

      {/* 2 & 3. Today's Plan & Mentees Overview */}"""

content = content.replace(old_closing_messages, new_closing_messages, 1)

# 6. Wrap Today's Plan Card
old_plan_card = """      {/* 2 & 3. Today's Plan & Mentees Overview */}
      <Card className="p-5 shadow-sm">"""

new_plan_card = """      {/* 2 & 3. Today's Plan & Mentees Overview */}
      {(featureFlags.mentor_students !== false || featureFlags.mentor_sessions !== false) && (
        <Card className="p-5 shadow-sm">"""

content = content.replace(old_plan_card, new_plan_card, 1)

# Inside Today's Plan Card, wrap Mentees
old_mentees_overview = """        {/* 3. Mentees */}
        <p className="text-[10px] text-slate-400 tracking-[0.15em] font-black mb-5 uppercase">My Mentees</p>
        <div className="flex gap-5 mb-8 overflow-x-auto pb-4 hidden-scrollbar">"""

new_mentees_overview = """        {/* 3. Mentees */}
        {featureFlags.mentor_students !== false && (
          <>
            <p className="text-[10px] text-slate-400 tracking-[0.15em] font-black mb-5 uppercase">My Mentees</p>
            <div className="flex gap-5 mb-8 overflow-x-auto pb-4 hidden-scrollbar">"""

content = content.replace(old_mentees_overview, new_mentees_overview, 1)

# Close Mentees overview (before Upcoming Sessions)
old_sessions_header = """            ))
          )}
        </div>

        <div className="border-t border-slate-50 my-6"></div>

        {/* Sessions */}"""

new_sessions_header = """            ))
          )}
        </div>
          </>
        )}

        {featureFlags.mentor_sessions !== false && (
          <>
            <div className="border-t border-slate-50 my-6"></div>

            {/* Sessions */}"""

content = content.replace(old_sessions_header, new_sessions_header, 1)

# Close Sessions & Reviews inside the Today's Plan Card
old_plan_closing = """          {reviews.length === 0 && <p className="text-[13px] text-slate-400">All caught up!</p>}
        </div>
      </Card>"""

new_plan_closing = """          {reviews.length === 0 && <p className="text-[13px] text-slate-400">All caught up!</p>}
        </div>
          </>
        )}
      </Card>
      )}"""

content = content.replace(old_plan_closing, new_plan_closing, 1)

# 7. Wrap Gratitude Wall
old_gratitude_wall = """      {/* 9. Student Gratitude Wall */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all rounded-[1.5rem]">"""

new_gratitude_wall = """      {/* 9. Student Gratitude Wall */}
      {featureFlags.mentor_gratitude !== false && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all rounded-[1.5rem]">"""

content = content.replace(old_gratitude_wall, new_gratitude_wall, 1)

# Close Gratitude wall card
old_playbook = """      </Card>

      {/* 11. Mentor Best Practices */}"""

new_playbook = """      </Card>
      )}

      {/* 11. Mentor Best Practices */}"""

content = content.replace(old_playbook, new_playbook, 1)

with open("components/mentor/MentorHome.tsx", "w") as f:
    f.write(content)

print("Step 4 changes completed successfully!")
