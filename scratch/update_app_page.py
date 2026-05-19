import re

with open("app/page.tsx", "r") as f:
    content = f.read()

# 1. Add State
state_decl = '  const [email, setEmail] = useState("");'
new_state = state_decl + '\n  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});'
content = content.replace(state_decl, new_state)

# 2. Add fetch in handleSessionSync
fetch_profile = "      const { data: profile, error } = await supabase"
fetch_flags_code = """      // Fetch feature flags
      const { data: flags } = await supabase.from('feature_flags').select('key, is_enabled');
      if (flags) {
        const flagsMap: Record<string, boolean> = {};
        flags.forEach((f: any) => flagsMap[f.key] = f.is_enabled);
        setFeatureFlags(flagsMap);
      }

      const { data: profile, error } = await supabase"""
content = content.replace(fetch_profile, fetch_flags_code, 1)

# 3. Update Student Nav
student_nav_target = """                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-between px-10 sm:px-16 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                  <button onClick={() => setState("DASHBOARD_MAIN")} className={`flex flex-col items-center gap-1 w-12 ${state === "DASHBOARD_MAIN" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Home className="w-5 h-5" strokeWidth={state === "DASHBOARD_MAIN" ? 2.5 : 2}/><span className="text-[10px] font-semibold">Home</span></button>
                  <button onClick={() => setState("COURSE_DETAILS")} className={`flex flex-col items-center gap-1 w-12 ${state === "COURSE_DETAILS" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><BookOpen className="w-5 h-5" strokeWidth={state === "COURSE_DETAILS" ? 2.5 : 2}/><span className="text-[10px] font-medium">Courses</span></button>
                  <button onClick={() => setState("GAMES")} className={`flex flex-col items-center gap-1 w-12 ${state === "GAMES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"} relative`}><Gamepad2 className="w-5 h-5" strokeWidth={state === "GAMES" ? 2.5 : 2}/>{state !== "GAMES" && <div className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}<span className="text-[10px] font-medium">Games</span></button>
                  <button onClick={() => setState("NOTES")} className={`flex flex-col items-center gap-1 w-12 ${state === "NOTES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><NotebookPen className="w-5 h-5" strokeWidth={state === "NOTES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Notes</span></button>
                  <button onClick={() => setState("PROFILE")} className={`flex flex-col items-center gap-1 w-12 ${state === "PROFILE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><User className="w-5 h-5" strokeWidth={state === "PROFILE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Profile</span></button>
                </div>"""

student_nav_new = """                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-between px-10 sm:px-16 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                  {featureFlags.student_dashboard !== false && <button onClick={() => setState("DASHBOARD_MAIN")} className={`flex flex-col items-center gap-1 w-12 ${state === "DASHBOARD_MAIN" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Home className="w-5 h-5" strokeWidth={state === "DASHBOARD_MAIN" ? 2.5 : 2}/><span className="text-[10px] font-semibold">Home</span></button>}
                  {featureFlags.student_courses !== false && <button onClick={() => setState("COURSE_DETAILS")} className={`flex flex-col items-center gap-1 w-12 ${state === "COURSE_DETAILS" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><BookOpen className="w-5 h-5" strokeWidth={state === "COURSE_DETAILS" ? 2.5 : 2}/><span className="text-[10px] font-medium">Courses</span></button>}
                  {featureFlags.student_games !== false && <button onClick={() => setState("GAMES")} className={`flex flex-col items-center gap-1 w-12 ${state === "GAMES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"} relative`}><Gamepad2 className="w-5 h-5" strokeWidth={state === "GAMES" ? 2.5 : 2}/>{state !== "GAMES" && <div className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}<span className="text-[10px] font-medium">Games</span></button>}
                  {featureFlags.student_notes !== false && <button onClick={() => setState("NOTES")} className={`flex flex-col items-center gap-1 w-12 ${state === "NOTES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><NotebookPen className="w-5 h-5" strokeWidth={state === "NOTES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Notes</span></button>}
                  <button onClick={() => setState("PROFILE")} className={`flex flex-col items-center gap-1 w-12 ${state === "PROFILE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><User className="w-5 h-5" strokeWidth={state === "PROFILE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Profile</span></button>
                </div>"""
content = content.replace(student_nav_target, student_nav_new)

# 4. Update Mentor Nav
mentor_nav_target = """                  <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/80 flex justify-between px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                    <button onClick={() => setState("MENTOR_DASHBOARD")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_DASHBOARD" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <Home className={`w-5 h-5 ${state === "MENTOR_DASHBOARD" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_DASHBOARD" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_DASHBOARD" ? "font-medium" : "font-semibold"}`}>Home</span>
                    </button>
                    <button onClick={() => setState("MENTOR_STUDENTS")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_STUDENTS" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <Users className={`w-5 h-5 ${state === "MENTOR_STUDENTS" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_STUDENTS" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_STUDENTS" ? "font-medium" : "font-semibold"}`}>Students</span>
                    </button>
                    <button onClick={() => setState("MENTOR_COURSES")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_COURSES" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <GraduationCap className={`w-5 h-5 ${state === "MENTOR_COURSES" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_COURSES" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_COURSES" ? "font-medium" : "font-semibold"}`}>Courses</span>
                    </button>
                    <button onClick={() => setState("MENTOR_NOTES")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_NOTES" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <NotebookPen className={`w-5 h-5 ${state === "MENTOR_NOTES" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_NOTES" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_NOTES" ? "font-medium" : "font-semibold"}`}>Notes</span>
                    </button>
                    <button onClick={() => setState("MENTOR_CIRCLE")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_CIRCLE" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <Users className={`w-5 h-5 ${state === "MENTOR_CIRCLE" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_CIRCLE" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_CIRCLE" ? "font-medium" : "font-semibold"}`}>Circle</span>
                    </button>
                    <button onClick={() => setState("MENTOR_ACCOUNT")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_ACCOUNT" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <User className={`w-5 h-5 ${state === "MENTOR_ACCOUNT" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_ACCOUNT" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_ACCOUNT" ? "font-medium" : "font-semibold"}`}>Profile</span>
                    </button>
                  </div>"""

mentor_nav_new = """                  <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/80 flex justify-between px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                    {featureFlags.mentor_dashboard !== false && <button onClick={() => setState("MENTOR_DASHBOARD")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_DASHBOARD" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <Home className={`w-5 h-5 ${state === "MENTOR_DASHBOARD" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_DASHBOARD" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_DASHBOARD" ? "font-medium" : "font-semibold"}`}>Home</span>
                    </button>}
                    {featureFlags.mentor_students !== false && <button onClick={() => setState("MENTOR_STUDENTS")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_STUDENTS" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <Users className={`w-5 h-5 ${state === "MENTOR_STUDENTS" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_STUDENTS" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_STUDENTS" ? "font-medium" : "font-semibold"}`}>Students</span>
                    </button>}
                    {featureFlags.mentor_courses !== false && <button onClick={() => setState("MENTOR_COURSES")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_COURSES" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <GraduationCap className={`w-5 h-5 ${state === "MENTOR_COURSES" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_COURSES" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_COURSES" ? "font-medium" : "font-semibold"}`}>Courses</span>
                    </button>}
                    {featureFlags.mentor_sessions !== false && <button onClick={() => setState("MENTOR_NOTES")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_NOTES" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <NotebookPen className={`w-5 h-5 ${state === "MENTOR_NOTES" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_NOTES" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_NOTES" ? "font-medium" : "font-semibold"}`}>Notes</span>
                    </button>}
                    {featureFlags.mentor_circle !== false && <button onClick={() => setState("MENTOR_CIRCLE")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_CIRCLE" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <Users className={`w-5 h-5 ${state === "MENTOR_CIRCLE" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_CIRCLE" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_CIRCLE" ? "font-medium" : "font-semibold"}`}>Circle</span>
                    </button>}
                    {featureFlags.mentor_account !== false && <button onClick={() => setState("MENTOR_ACCOUNT")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_ACCOUNT" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                      <User className={`w-5 h-5 ${state === "MENTOR_ACCOUNT" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_ACCOUNT" ? 2.5 : 2}/>
                      <span className={`text-[10px] ${state === "MENTOR_ACCOUNT" ? "font-medium" : "font-semibold"}`}>Profile</span>
                    </button>}
                  </div>"""

content = content.replace(mentor_nav_target, mentor_nav_new)

with open("app/page.tsx", "w") as f:
    f.write(content)

