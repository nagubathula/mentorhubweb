"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Phone, ShieldCheck, ArrowLeft, GraduationCap, Users, ArrowRight, Camera, Star, SkipForward, Trophy, Brain, Code, BookOpen, Zap, BrainCircuit, Lightbulb, BookOpenCheck, Bell, Search, User, Mail, CheckCircle2, Clock, Circle, Target, MessageSquare, BookText, Send, Play, FileText, Video, Swords, NotebookPen, Heart, Briefcase, Sun, Flame, Coins, Activity, Home, Gamepad2, ChevronRight, Calendar, Quote, CheckCircle, Layers, Lock, Award, ChevronUp, ChevronDown, Dices, X, TrendingUp, TrendingDown, Image as ImageIcon, Trash2, Plus, Pencil, BarChart2, ListChecks, Medal, Link, MessageCircle, AtSign, UserCircle, MapPin, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase";
const supabase = createClient();

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { MentorHome } from "@/components/mentor/MentorHome";
import { MentorStudents } from "@/components/mentor/MentorStudents";
import { MentorNotes } from "@/components/mentor/MentorNotes";
import { MentorCircle } from "@/components/mentor/MentorCircle";
import { MentorProfile } from "@/components/mentor/MentorProfile";

type FlowState = "LOGIN" | "SIGNIN" | "SIGNUP" | "ROLE" | "STUDENT_PROFILE" | "STUDENT_QUIZ" | "STUDENT_SCREENING" | "DASHBOARD_AWAITING" | "DASHBOARD_MAIN" | "COURSE_DETAILS" | "GAMES" | "NOTES" | "PROFILE" | "MENTOR_PROFILE" | "MENTOR_QUIZ" | "MENTOR_MATCHING" | "MENTOR_DASHBOARD" | "MENTOR_STUDENTS" | "MENTOR_CIRCLE";

// Google SVG Icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const SelectionChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-2 rounded-full border text-[13px] transition-colors whitespace-nowrap ${
      active 
        ? "border-slate-800 bg-slate-900 text-white font-medium" 
        : "border-slate-200 text-slate-600 hover:border-slate-300"
    }`}
  >
    {label}
  </button>
)

type QuizQuestion = {
  id: string;
  number: string;
  text: string;
  type: "input" | "chips";
  options?: string[];
  placeholder?: string;
  multiSelect?: boolean;
};

type QuizStepData = {
  step: number;
  title: string;
  icon: any;
  color: string;
  questions: QuizQuestion[];
};

const QUIZ_STEPS: QuizStepData[] = [
  {
    step: 1, title: "Education & Language", icon: GraduationCap, color: "#0cb4ce",
    questions: [
      { id: "q1", number: "Q1.", text: "Which college are you studying at or have studied at?", type: "input", placeholder: "e.g. IIT Bombay..." },
      { id: "q2", number: "Q2.", text: "Which branch / department are you from?", type: "chips", options: ["Computer Science / IT", "Electronics / ECE", "Mechanical", "Electrical", "Civil", "Commerce / BBA", "Arts", "Science", "Other"] },
      { id: "q3", number: "Q3.", text: "What is your mother tongue?", type: "chips", options: ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "English", "Other"] }
    ]
  },
  {
    step: 2, title: "Personal Inspiration", icon: Star, color: "#f59e0b",
    questions: [
      { id: "q5", number: "Q5.", text: "Who inspires you the most in life?", type: "chips", options: ["Family member", "Teacher/mentor", "Entrepreneur", "Scientist/engineer", "Celebrity"] },
      { id: "q6", number: "Q6.", text: "Which famous personality do you admire most?", type: "input", placeholder: "e.g. Elon Musk..." }
    ]
  }
];

const SCREENING_STEPS = [
  {
    step: 1, title: "Curiosity", icon: Lightbulb,
    text: "When you see something you don't understand, what do you do?",
    options: ["Search online to understand it", "Ask someone who knows", "Try to explore it yourself", "Ignore it and move on"]
  },
  {
    step: 2, title: "Exploring Beyond Syllabus", icon: BookOpenCheck,
    text: "How often do you explore topics beyond your school or college syllabus?",
    options: ["Very often", "Sometimes", "Occasionally", "Never"]
  }
];

const MENTOR_QUIZ_STEPS: QuizStepData[] = [
  {
    step: 1, title: "Education, Language & Contact", icon: GraduationCap, color: "#0cb4ce",
    questions: [
      { id: "q101", number: "Q101.", text: "Which company are you currently working at?", type: "input", placeholder: "e.g. Google, TCS, Infosys, Startup..." },
      { id: "q102", number: "Q102.", text: "Which college did you study at?", type: "input", placeholder: "e.g. IIT Delhi, NIT Trichy, BITS Pilani..." },
      { id: "q103", number: "Q103.", text: "Which branch / department did you study?", type: "chips", options: ["Computer Science / IT", "Electronics / ECE", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Commerce / BBA / MBA", "Arts / Humanities", "Science (BSc / MSc)", "Other"] },
      { id: "q104", number: "Q104.", text: "What is your mother tongue?", type: "chips", options: ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "English", "Other"] }
    ]
  }
];

const MOCK_STUDENTS = [
  { id: "s1", name: "Vikram Patel", email: "vikram.p@gmail.com", match: "94%", desc: "Build a portfolio website and learn Python for data analysis", time: "2 hours ago", location: "Mumbai, India", tags: ["Python", "Web Development", "Data Science"], image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", preferences: { inspiration: "A teacher/mentor", movie: "Sci-fi / Technology", style: "Hands-on projects", location: "Mumbai, India" } },
  { id: "s2", name: "Ananya Krishnan", email: "ananya.k@gmail.com", match: "88%", desc: "Machine Learning, AI fundamentals", time: "5 hours ago", location: "Bangalore, India", tags: ["Machine Learning", "Python", "Mathematics"], image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", preferences: { inspiration: "A scientist", movie: "Documentaries", style: "Reading / Self-paced", location: "Bangalore, India" } },
  { id: "s3", name: "Kavya Nair", email: "kavya.n@gmail.com", match: "82%", desc: "Automation, scripting, career pivot into tech", time: "1 day ago", location: "Chennai, India", tags: ["Automation", "Python", "Career Change"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", preferences: { inspiration: "Family member", movie: "Action / Adventure", style: "Visual / Video courses", location: "Chennai, India" } }
];

export default function OnboardingFlow() {
  const [state, setState] = useState<FlowState>("LOGIN");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "MENTOR" | null>(null);
  
  // Custom user data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Tracking
  const [quizIndex, setQuizIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  
  // Screening tracking
  const [screeningIndex, setScreeningIndex] = useState(0);
  const [screeningSelections, setScreeningSelections] = useState<Record<string, string>>({});

  // Mentor tracking
  const [mentorExpertise, setMentorExpertise] = useState("");
  const [mentorQuizIndex, setMentorQuizIndex] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [expandedStudents, setExpandedStudents] = useState<string[]>([]);
  const [realStudents, setRealStudents] = useState<any[]>(MOCK_STUDENTS);

  useEffect(() => {
    if (state === "MENTOR_MATCHING" || state === "DASHBOARD_MAIN") {
      const fetchStudents = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('role', 'STUDENT');
        if (data && data.length > 0) {
          const formatted = data.map(profile => {
             const prefs = (profile.preferences as any) || {};
             const tags = [];
             if (prefs.q2) {
               if (Array.isArray(prefs.q2)) tags.push(...prefs.q2);
               else tags.push(prefs.q2);
             }
             if (prefs.q3) {
               if (Array.isArray(prefs.q3)) tags.push(...prefs.q3);
               else tags.push(prefs.q3);
             }
             if (tags.length === 0) tags.push("Computer Science", "Web Development");

             const desc = prefs.q1 ? `Studying at ${prefs.q1}` : "Looking to grow and learn new skills.";

             return {
                id: profile.id,
                name: profile.name || profile.email?.split('@')[0] || "Student",
                email: profile.email || "student@example.com",
                match: (Math.floor(Math.random() * (98 - 75 + 1)) + 75) + "%",
                desc,
                time: "Recently joined",
                location: "Online",
                tags: tags.slice(0, 3),
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
                preferences: {
                   inspiration: prefs.q5 || "A teacher/mentor",
                   movie: "Sci-fi / Technology",
                   style: "Hands-on projects", 
                   location: "Online"
                }
             };
          });
          setRealStudents(formatted);
        }
      };
      fetchStudents();
    }
  }, [state]);

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (session.user.user_metadata?.full_name) setName(session.user.user_metadata.full_name);
          else if (session.user.user_metadata?.name) setName(session.user.user_metadata.name);
          if (session.user.email) setEmail(session.user.email);
          
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) {
            setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
          } else {
            setState("ROLE");
          }
        }
      } catch (e) {
        console.error("Session check skipped");
      }
    };
    checkActiveSession();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined
        }
      });
      if (error) console.error("Google Auth Error:", error);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setState("LOGIN");
  };

  const handleSelect = (qId: string, val: string, multi: boolean = false) => {
    setSelections(prev => {
      if (multi) {
        const curr = (prev[qId] as string[]) || [];
        return { ...prev, [qId]: curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val] };
      }
      return { ...prev, [qId]: prev[qId] === val ? "" : val };
    });
  };

  const handleInputChange = (qId: string, val: string) => {
    setSelections(prev => ({ ...prev, [qId]: val }));
  };

  const handleSignIn = async () => {
    if (!authEmail.includes("@") || !authPassword) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) { setAuthError(error.message); return; }
      if (data.user) {
        if (data.user.user_metadata?.full_name) setName(data.user.user_metadata.full_name);
        else if (data.user.user_metadata?.name) setName(data.user.user_metadata.name);
        if (data.user.email) setEmail(data.user.email);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
        else setState("ROLE");
      }
    } catch (e) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!authEmail.includes("@") || authPassword.length < 6) return;
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) { setAuthError(error.message); return; }
      if (data.session) {
        if (data.user?.email) setEmail(data.user.email);
        setState("ROLE");
      } else {
        setAuthError("confirm-email");
      }
    } catch (e) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const saveProfileData = async (userRole: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const profileData = {
        id: session?.user?.id || `demo-${Date.now()}`,
        name,
        email,
        role: userRole,
        expertise: mentorExpertise,
        preferences: Object.keys(selections).length > 0 ? selections : screeningSelections
      };
      const { error } = await supabase.from('profiles').upsert(profileData);
      if (error) console.error("Supabase Profile Save Error:", error);
    } catch (e) {
      console.error("Save profile caught error", e);
    }
    
    setState(userRole === 'STUDENT' ? 'DASHBOARD_AWAITING' : 'MENTOR_MATCHING');
  };

  const nextQuizStep = () => {
    if (quizIndex < QUIZ_STEPS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setState("STUDENT_SCREENING");
    }
  };

  const prevQuizStep = () => {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
    } else {
      setState("STUDENT_PROFILE");
    }
  };
  
  const nextScreeningStep = async () => {
    if (screeningIndex < SCREENING_STEPS.length - 1) {
      setScreeningIndex(screeningIndex + 1);
    } else {
      await saveProfileData("STUDENT");
    }
  }

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 15 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.15, ease: "easeIn" as const } },
  };

  // Header Component
  const LogoHeader = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="bg-[#0f172a] text-white p-4 rounded-2xl mb-4">
        <Sparkles className="w-10 h-10" strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">MentorHub</h1>
      <p className="text-slate-500 text-sm">Connect, learn, and grow together.</p>
    </div>
  );

  const isDashboard = state === "DASHBOARD_MAIN" || state === "DASHBOARD_AWAITING" || state === "MENTOR_MATCHING";

  return (
    <div className={`min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6 selection:bg-slate-200 font-sans`}>
      <div className={`w-full ${isDashboard ? 'max-w-7xl min-h-[calc(100vh-3rem)] rounded-none md:rounded-3xl' : 'max-w-lg h-screen md:h-[calc(100vh-3rem)] md:rounded-3xl'} bg-white shadow-none md:shadow-sm overflow-hidden relative flex flex-col md:border border-slate-200 transition-all duration-300 ease-in-out`}>

        <div className={`flex-1 relative overflow-hidden ${isDashboard ? 'px-0 pt-0 pb-0' : 'px-6 pt-6 pb-6'}`}>
          <AnimatePresence mode="wait">
            {state === "LOGIN" && (
              <motion.div key="login" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center gap-6">
                <div className="mb-2"><LogoHeader /></div>
                <div className="flex flex-col gap-3">
                  <Button className="h-14 rounded-xl text-[15px] font-medium bg-[#0f172a] hover:bg-[#1e293b]" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNIN"); }}>
                    <Mail className="w-5 h-5 mr-2" /> Sign In
                  </Button>
                  <Button variant="outline" className="h-14 rounded-xl text-[15px] font-medium border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNUP"); }}>
                    Create Account
                  </Button>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[12px] text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <Button variant="outline" className="h-14 rounded-xl text-[15px] font-medium border-slate-200 text-slate-700 hover:bg-slate-50" onClick={handleGoogleSignIn}>
                  <GoogleIcon /> Continue with Google
                </Button>
              </motion.div>
            )}

            {state === "SIGNIN" && (
              <motion.div key="signin" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center">
                <div className="mb-2"><button onClick={() => setState("LOGIN")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1 ml-1">
                  <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
                  <p className="text-sm text-slate-500">Sign in to your account to continue.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600 font-medium ml-1">Email</Label>
                    <Input type="email" placeholder="you@example.com" className="h-[52px] rounded-xl border-slate-200 placeholder:text-slate-400 text-base px-4" value={authEmail} onChange={(e) => { setAuthEmail(e.target.value); setAuthError(""); }} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600 font-medium ml-1">Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-[52px] rounded-xl border-slate-200 placeholder:text-slate-400 text-base px-4" value={authPassword} onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSignIn()} />
                  </div>
                  {authError && authError !== "confirm-email" && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{authError}</div>
                  )}
                  <Button disabled={authLoading || !authEmail.includes("@") || !authPassword} className="h-[52px] rounded-xl text-[15px] font-medium bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-100 disabled:text-slate-400 mt-1" onClick={handleSignIn}>
                    {authLoading ? "Signing in…" : <>Sign In <ArrowRight className="w-4 h-4 ml-1.5" /></>}
                  </Button>
                  <p className="text-[13px] text-slate-400 text-center mt-1">
                    Don&apos;t have an account?{" "}
                    <button className="text-slate-700 font-medium hover:underline" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNUP"); }}>Create one</button>
                  </p>
                </div>
              </motion.div>
            )}

            {state === "SIGNUP" && (
              <motion.div key="signup" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center">
                <div className="mb-2"><button onClick={() => setState("LOGIN")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1 ml-1">
                  <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
                  <p className="text-sm text-slate-500">Join MentorHub and start your journey.</p>
                </div>
                {authError === "confirm-email" ? (
                  <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-xl p-5 flex flex-col items-center text-center gap-3">
                    <ShieldCheck className="w-10 h-10 text-[#059669]" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Check your email</p>
                      <p className="text-sm text-slate-500">We sent a confirmation link to <span className="font-medium text-slate-700">{authEmail}</span>. Click it to activate your account.</p>
                    </div>
                    <button className="text-[13px] text-slate-500 hover:text-slate-700 mt-1" onClick={() => { setAuthError(""); setState("SIGNIN"); }}>Back to sign in</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600 font-medium ml-1">Email</Label>
                      <Input type="email" placeholder="you@example.com" className="h-[52px] rounded-xl border-slate-200 placeholder:text-slate-400 text-base px-4" value={authEmail} onChange={(e) => { setAuthEmail(e.target.value); setAuthError(""); }} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600 font-medium ml-1">Password <span className="text-slate-400 font-normal">(min. 6 characters)</span></Label>
                      <Input type="password" placeholder="••••••••" className="h-[52px] rounded-xl border-slate-200 placeholder:text-slate-400 text-base px-4" value={authPassword} onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSignUp()} />
                    </div>
                    {authError && (
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{authError}</div>
                    )}
                    <Button disabled={authLoading || !authEmail.includes("@") || authPassword.length < 6} className="h-[52px] rounded-xl text-[15px] font-medium bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-100 disabled:text-slate-400 mt-1" onClick={handleSignUp}>
                      {authLoading ? "Creating account…" : <>Create Account <ArrowRight className="w-4 h-4 ml-1.5" /></>}
                    </Button>
                    <p className="text-[13px] text-slate-400 text-center mt-1">
                      Already have an account?{" "}
                      <button className="text-slate-700 font-medium hover:underline" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNIN"); }}>Sign in</button>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {state === "ROLE" && (
              <motion.div key="role" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-4">
                <div className="mb-2"><button onClick={() => setState("LOGIN")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-8 space-y-1.5 ml-1">
                  <h2 className="text-2xl font-semibold text-slate-900">I am a...</h2>
                  <p className="text-sm text-slate-500">Choose your role to get started.</p>
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  {["STUDENT", "MENTOR"].map((r) => (
                    <button key={r} onClick={() => setRole(r as "STUDENT"|"MENTOR")} className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${role === r ? "border-[#0f172a] ring-1 ring-[#0f172a] bg-slate-50 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"}`}>
                      <div className={`p-3.5 rounded-xl shrink-0 transition-colors ${role === r ? "bg-slate-200/60 text-[#0f172a]" : "bg-slate-100 text-slate-500"}`}>
                        {r === "STUDENT" ? <GraduationCap className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className={`text-base font-medium mb-1 transition-colors ${role === r ? "text-slate-900" : "text-slate-700"}`}>{r === "STUDENT" ? "Student" : "Mentor"}</h3>
                        <p className="text-[13px] text-slate-500 leading-snug tracking-wide">{r === "STUDENT" ? "Find a mentor and level up your skills." : "Share your expertise and guide others."}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button disabled={!role} onClick={() => { setState(role === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE") }} className={`w-full h-[52px] rounded-xl text-[15px] font-medium transition-all ${role ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-100 text-slate-400"}`}>
                    Continue <ArrowRight className="w-[18px] h-[18px] ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {state === "STUDENT_PROFILE" && (
              <motion.div key="student_profile" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-4 overflow-y-auto hidden-scrollbar">
                <div className="mb-2 shrink-0"><button onClick={() => setState("ROLE")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="flex flex-col items-center mb-6 mt-2 shrink-0">
                  <div className="relative">
                    <div className="w-[104px] h-[104px] rounded-full border border-slate-200 overflow-hidden flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop')] bg-cover bg-center grayscale shadow-sm object-cover"></div>
                    <button className="absolute bottom-0 right-0 w-[34px] h-[34px] bg-[#0f172a] rounded-full flex items-center justify-center text-white ring-[3px] ring-white shadow-sm hover:scale-105 transition-transform"><Camera className="w-[15px] h-[15px]" /></button>
                  </div>
                </div>
                <div className="mb-6 space-y-1.5 shrink-0">
                  <h2 className="text-lg font-medium text-slate-900">Your profile</h2><p className="text-[14px] text-slate-500">Tell us a little about yourself.</p>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="space-y-2"><Label className="text-[13px] text-slate-600 font-medium ml-1">Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-[50px] rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-slate-50/50" /></div>
                  <div className="space-y-2"><Label className="text-[13px] text-slate-600 font-medium ml-1">Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="h-[50px] rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-slate-50/50" /></div>
                  <div className="space-y-2"><Label className="text-[13px] text-slate-600 font-medium ml-1">What do you want to learn?</Label><Textarea placeholder="e.g. UI Design, Frontend Development..." className="min-h-[110px] resize-none rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-slate-50/50" /></div>
                </div>
                <div className="mt-8 shrink-0">
                  <Button onClick={() => setState("STUDENT_QUIZ")} className="w-full h-[52px] rounded-xl text-[15px] font-medium bg-[#0f172a] text-white hover:bg-[#1e293b]">Continue <ArrowRight className="w-[18px] h-[18px] ml-1.5" /></Button>
                </div>
              </motion.div>
            )}

            {state === "STUDENT_QUIZ" && (() => {
              const currentData = QUIZ_STEPS[quizIndex];
              const Icon = currentData.icon;
              return (
                <motion.div key={`quiz_${quizIndex}`} variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0">
                  <div className="mb-6 shrink-0 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={prevQuizStep} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 flex items-center gap-1.5 focus:outline-none">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-500">{currentData.step} of 8</span>
                      </button>
                      <button className="text-[13px] text-slate-400 flex items-center gap-1.5 hover:text-slate-600 focus:outline-none font-medium">
                        <SkipForward className="w-3.5 h-3.5" /> Skip All
                      </button>
                    </div>
                    <div className="w-full flex gap-1.5 mb-6">
                      {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentData.step ? 'bg-slate-900' : 'bg-slate-200'}`} />)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-full text-white`} style={{ backgroundColor: currentData.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-medium text-slate-900">{currentData.title}</h2>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-3 -mr-3 pb-8 space-y-8 scrollbar-thin">
                    {currentData.questions.map((q) => (
                      <div key={q.id} className="space-y-3.5">
                        <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
                          <span className="text-slate-400 font-normal mr-1">{q.number}</span>{q.text}
                        </p>
                        {q.type === "input" ? (
                          <Input placeholder={q.placeholder} value={(selections[q.id] as string) || ""} onChange={(e) => handleInputChange(q.id, e.target.value)} className="h-[50px] rounded-xl border-slate-200 text-[15px] bg-slate-50/50" />
                        ) : (
                          <div className="flex flex-wrap gap-2.5">
                            {q.options?.map(opt => {
                              const selected = q.multiSelect ? ((selections[q.id] as string[]) || []).includes(opt) : selections[q.id] === opt;
                              return <SelectionChip key={opt} label={opt} active={selected} onClick={() => handleSelect(q.id, opt, q.multiSelect)} />;
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 shrink-0 bg-white border-t border-slate-50 mt-auto">
                    <Button onClick={nextQuizStep} className="w-full h-[52px] rounded-xl text-[15px] font-medium bg-[#0f172a] text-white hover:bg-[#1e293b]">
                      {quizIndex === QUIZ_STEPS.length - 1 ? "Finish Quiz" : "Next"} <ArrowRight className="w-[18px] h-[18px] ml-1.5" />
                    </Button>
                    {quizIndex !== QUIZ_STEPS.length - 1 && (
                      <button onClick={nextQuizStep} className="w-full mt-4 pb-1 text-[13px] font-medium text-slate-400 hover:text-slate-600">Skip this section</button>
                    )}
                  </div>
                </motion.div>
              );
            })()}

            {state === "STUDENT_SCREENING" && (() => {
              const currentData = SCREENING_STEPS[screeningIndex];
              const Icon = currentData.icon;
              return (
                <motion.div key={`screening_${screeningIndex}`} variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0">
                  <div className="mb-4 shrink-0 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => { if(screeningIndex > 0) setScreeningIndex(screeningIndex - 1); else setState("STUDENT_QUIZ") }} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 flex items-center gap-1.5 focus:outline-none">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-500">{currentData.step} of 12</span>
                      </button>
                      <div className="flex items-center gap-3">
                         <button className="text-[13px] text-slate-400 flex items-center gap-1.5 hover:text-slate-600 focus:outline-none font-medium">
                           <SkipForward className="w-3.5 h-3.5" /> Skip for now
                         </button>
                         <div className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium ml-2">
                           <BrainCircuit className="w-3.5 h-3.5" /> Screening
                         </div>
                      </div>
                    </div>
                    
                    <div className="w-full flex gap-1 mb-6">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={i} className={`h-1 flex-[1] rounded-full ${i <= currentData.step ? 'bg-slate-800' : 'bg-slate-100'}`} />)}
                    </div>
                
                    {currentData.step === 1 && (
                      <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-xl p-4 text-[13px] text-blue-600 mb-6 font-medium leading-relaxed">
                        This short quiz helps us understand your curiosity, focus, and learning mindset. Answer honestly.
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-slate-100 text-slate-500">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="text-[15px] font-medium text-slate-400">{currentData.title}</h2>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-3 -mr-3 pb-8 scrollbar-thin">
                    <p className="text-[16px] text-slate-800 font-medium leading-relaxed mb-6 mt-2">
                      {currentData.text}
                    </p>
                    
                    <div className="space-y-3">
                      {currentData.options.map(opt => {
                        const selected = screeningSelections[currentData.title] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setScreeningSelections(prev => ({...prev, [currentData.title]: opt}))}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                              selected 
                                ? "border-[#0ea5e9] bg-[#f0f9ff] text-slate-900 shadow-sm ring-1 ring-[#0ea5e9]" 
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? "border-[#0ea5e9]" : "border-slate-300"}`}>
                              {selected && <div className="w-3 h-3 rounded-full bg-[#0ea5e9]" />}
                            </div>
                            <span className="text-[15px]">{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-4 shrink-0 bg-white border-t border-slate-50 mt-auto">
                    <Button onClick={nextScreeningStep} className={`w-full h-[52px] rounded-xl text-[15px] font-medium transition-all ${screeningSelections[currentData.title] ? "bg-[#e2e8f0] text-slate-600 hover:bg-[#cbd5e1]" : "bg-slate-100 text-slate-400"}`}>
                      Next <ArrowRight className="w-[18px] h-[18px] ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })()}

            {state === "DASHBOARD_AWAITING" && (
              <motion.div key="dashboard_awaiting" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-6 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
                {/* Header */}
                <div className="pt-8 pb-4 flex items-center justify-between z-10 w-full mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-full text-white shadow-sm ring-4 ring-blue-600/20">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-[18px] md:text-2xl font-semibold text-slate-900 leading-tight">Welcome, {name || "Satya"}!</h2>
                      <p className="text-[14px] text-slate-500 font-medium">Application submitted successfully.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Bell className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  {/* Left Column */}
                  <div className="flex-1 space-y-6">
                    {/* Profile Card */}
                    <Card>
                      <CardHeader className="pb-3 border-b border-slate-100">
                         <div className="flex justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5"/> Your Profile</CardTitle>
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete</Badge>
                         </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><User className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[12px] text-slate-500 uppercase font-semibold tracking-wider">Full Name</p>
                            <p className="text-[15px] text-slate-900 font-medium">{name || "Satya"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl"><Mail className="w-5 h-5" /></div>
                          <div>
                            <p className="text-[12px] text-slate-500 uppercase font-semibold tracking-wider">Email</p>
                            <p className="text-[15px] text-slate-900 font-medium">{email || "satyasai2108@gmail.com"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Preferences Card */}
                    <Card>
                       <CardHeader className="pb-3 border-b border-slate-100">
                         <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="w-5 h-5"/> Your Preferences</CardTitle>
                       </CardHeader>
                       <CardContent className="pt-4">
                          <div className="flex flex-wrap gap-2">
                             <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">Computer Science / IT</Badge>
                             <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">Hindi</Badge>
                             <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">Yes, regularly</Badge>
                          </div>
                       </CardContent>
                    </Card>

                    {/* Assignment Progress */}
                    <Card>
                      <CardHeader className="pb-4 border-b border-slate-100">
                        <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5"/> Assignment Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                         <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                            <div className="relative pl-6">
                              <div className="absolute -left-[13px] bg-white p-1"><div className="bg-emerald-500 text-white rounded-full p-0.5"><CheckCircle2 className="w-4 h-4" /></div></div>
                              <div><p className="text-[15px] text-slate-900 font-medium leading-none">Profile Created</p><p className="text-[13px] text-slate-500 mt-1">Your details are saved</p></div>
                              <div className="absolute top-6 -left-[13px] w-0.5 h-6 bg-emerald-500 ml-[11px]"></div>
                            </div>
                            <div className="relative pl-6">
                              <div className="absolute -left-[13px] bg-white p-1"><div className="bg-emerald-500 text-white rounded-full p-0.5"><CheckCircle2 className="w-4 h-4" /></div></div>
                              <div><p className="text-[15px] text-slate-900 font-medium leading-none">Questionnaire Completed</p><p className="text-[13px] text-slate-500 mt-1">Preferences recorded</p></div>
                              <div className="absolute top-6 -left-[13px] w-0.5 h-6 bg-emerald-500 ml-[11px]"></div>
                            </div>
                            <div className="relative pl-6">
                              <div className="absolute -left-[13px] bg-white p-1"><div className="bg-amber-500 text-white rounded-full p-1 shadow-sm"><Search className="w-3.5 h-3.5" strokeWidth={3} /></div></div>
                              <div><p className="text-[15px] text-amber-600 font-medium leading-none">Finding Best Mentor...</p><p className="text-[13px] text-slate-500 mt-1">Matching based on your goals</p></div>
                            </div>
                         </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column / Sticky Sidebar */}
                  <div className="w-full md:w-[380px] space-y-6 shrink-0">
                    {/* Yellow Banner */}
                    <div className="bg-gradient-to-b from-[#fff7ed] to-[#fffbed] border border-[#ffedd5] rounded-xl p-8 relative overflow-hidden flex flex-col items-center text-center shadow-sm">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffedd5]/50 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
                      <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-5 z-10">
                        <Search className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 z-10 mb-2">Awaiting Assignment</h3>
                      <div className="flex gap-1.5 mb-5 z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-30"></div>
                      </div>
                      <p className="text-[15px] text-amber-800 z-10 mb-6 font-medium">Analyzing learning preferences...</p>
                      <div className="w-full bg-white/80 rounded-xl py-3 px-5 flex justify-between items-center z-10">
                        <span className="text-sm text-slate-600 font-medium">Estimated wait time</span>
                        <span className="text-sm font-semibold text-orange-600 flex items-center gap-1.5"><Clock className="w-4 h-4" /> 24-48 hrs</span>
                      </div>
                    </div>

                    {/* Explore Actions */}
                    <Card>
                      <CardHeader className="pb-3 border-b border-slate-100">
                        <CardTitle className="text-lg text-blue-700 flex items-center gap-2"><Sparkles className="w-5 h-5"/> While You Wait</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <Button variant="outline" className="w-full justify-start h-auto p-4 flex gap-4 hover:bg-blue-50/50 group">
                           <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform"><BookText className="w-5 h-5" /></div>
                           <div className="text-left flex-1"><p className="text-[15px] text-slate-900 font-semibold mb-0.5">Explore Courses</p><p className="text-[13px] text-slate-500 font-normal whitespace-normal">Browse the Python curriculum while you wait</p></div>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-auto p-4 flex gap-4 hover:bg-blue-50/50 group">
                           <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform"><MessageSquare className="w-5 h-5" /></div>
                           <div className="text-left flex-1"><p className="text-[15px] text-slate-900 font-semibold mb-0.5">Community</p><p className="text-[13px] text-slate-500 font-normal whitespace-normal">Join the student community to connect with peers</p></div>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-emerald-50 border-emerald-200">
                      <CardContent className="p-5 flex gap-4 items-start">
                         <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                         <div>
                           <p className="text-emerald-800 font-semibold mb-1">You're in good hands</p>
                           <p className="text-sm text-emerald-700">Our mentors are verified professionals. We carefully match based on your goals.</p>
                         </div>
                      </CardContent>
                    </Card>
                    
                    <Button onClick={() => setState("DASHBOARD_MAIN")} className="w-full h-[52px] rounded-xl text-[15px] font-medium flex gap-2 items-center justify-center transition-all bg-[#0f172a] text-white hover:bg-[#1e293b] mt-4 shadow-xl shadow-slate-900/10">
                      Explore Dashboard Preview <ArrowRight className="w-[18px] h-[18px]" />
                    </Button>

                  </div>
                </div>
              </motion.div>
            )}

            {state === "DASHBOARD_MAIN" && (
              <motion.div key="dashboard_main" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-8 -mt-2 overflow-y-auto hidden-scrollbar pb-36 relative w-full items-center">
                <div className="w-full max-w-2xl xl:max-w-none xl:grid xl:grid-cols-[2fr_1fr] gap-8">
                  {/* Left Column */}
                  <div className="space-y-6 flex flex-col">
                
                {/* Top Section / Header Quote */}
                <div className="bg-white rounded-[1.5rem] p-5 pt-8 shadow-sm border border-slate-100 flex flex-col gap-4 mt-2 mx-1 relative z-10">
                  <div className="flex gap-4">
                    <div className="bg-purple-50 p-2.5 rounded-full text-purple-600 shrink-0 self-start">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mb-1.5">Today's Inspiration</p>
                      <p className="text-[13px] text-slate-700 font-medium italic leading-relaxed">
                        "Education is the most powerful weapon you can use to change the world." 
                        <span className="text-slate-400 not-italic block mt-1">— Nelson Mandela</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-400 mb-1.5">Don't hesitate, every question matters.</p>
                    <div className="flex gap-2">
                      <div className="flex-1 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-[14px] text-slate-400 outline-none hover:bg-slate-100 transition-colors cursor-text">
                        Ask a quick question...
                      </div>
                      <button className="bg-slate-100 w-[46px] rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors shrink-0">
                        <Send className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tracking / Progress Card */}
                <div className="bg-white rounded-3xl p-5 mx-1 mt-4 shadow-sm border border-slate-100 flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500">
                        <Code className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <p className="text-slate-800 font-medium text-[15px]">Python Fundamentals</p>
                    </div>
                    <span className="text-[13px] text-slate-400 font-medium">35%</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 w-[35%] rounded-full"></div>
                    </div>
                    <div className="flex gap-4 text-[12px] font-medium text-slate-400">
                      <span>4/12 modules</span>
                      <span>·</span>
                      <span>13/36 lessons</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[13px] text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" /> Next: Variables & Data Types
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                  </div>
                  {/* Right Column */}
                  <div className="space-y-6">
                {/* Today's Schedule Options */}
                <div className="mt-6 mx-1">
                  <div className="flex justify-between items-end mb-4 px-1">
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-[15px]">
                      <Calendar className="w-[18px] h-[18px]" /> Today's Schedule
                    </div>
                    <span className="text-[12px] text-slate-400 font-medium">4 tasks</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {/* Task 1 */}
                    <div className="bg-white rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm border border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">9:00 AM</p>
                          <p className="text-[14px] text-slate-800 font-medium mb-0.5">Python Basics - Lesson 3</p>
                          <p className="text-[12px] text-slate-400">Variables & Data Types</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-sm shrink-0">
                        <Play className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Task 2 */}
                    <div className="bg-white rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm border border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">10:30 AM</p>
                          <p className="text-[14px] text-slate-800 font-medium mb-0.5">Submit Assignment #2</p>
                          <p className="text-[12px] text-slate-400">Loops & Functions practice</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shadow-sm shrink-0">
                        <FileText className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Task 3 */}
                    <div className="bg-white rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm border border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">12:00 PM</p>
                          <p className="text-[14px] text-slate-800 font-medium mb-0.5">Mentor 1:1 Call</p>
                          <p className="text-[12px] text-slate-400">Weekly check-in with your mentor</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-sm shrink-0">
                        <Video className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Task 4 */}
                    <div className="bg-white rounded-[1.5rem] p-4 flex items-center justify-between shadow-sm border border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">2:00 PM</p>
                          <p className="text-[14px] text-slate-800 font-medium mb-0.5">Quick Quiz: Data Types</p>
                          <p className="text-[12px] text-slate-400">5 min - Test your knowledge</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#8b5cf6] text-white flex items-center justify-center shadow-sm shrink-0">
                        <Target className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Content Rows */}
                <div className="mt-6 mx-1 space-y-3">
                  
                  {/* Gaming Quiz */}
                  <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-50 relative cursor-pointer group">
                    <div className="bg-[#0f172a] text-white p-3 rounded-[14px] mr-4 shadow-sm group-hover:scale-105 transition-transform"><Swords className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-medium text-slate-800">Gaming Quiz</p>
                        <span className="bg-[#dcfce7] text-[#166534] text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Live</span>
                      </div>
                      <p className="text-[12px] text-slate-400">Challenge friends · 240 coins</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex -space-x-1.5 mr-3">
                         <div className="w-6 h-6 rounded-full border border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover"></div>
                         <div className="w-6 h-6 rounded-full border border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover"></div>
                         <div className="w-6 h-6 rounded-full border border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=5')] bg-cover"></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  {/* Running Notes */}
                  <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-50 cursor-pointer group">
                    <div className="bg-slate-100 text-slate-400 p-3 rounded-[14px] mr-4 group-hover:scale-105 transition-transform"><NotebookPen className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-medium text-slate-800">Running Notes</p>
                        <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-2 rounded-full">2</span>
                      </div>
                      <p className="text-[12px] text-slate-400">Text notes & paper photos</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>

                  {/* Gratitude Wall */}
                  <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-50 cursor-pointer group">
                    <div className="bg-pink-50 text-pink-400 p-3 rounded-[14px] mr-4 group-hover:scale-105 transition-transform"><Heart className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-medium text-slate-800">Gratitude Wall</p>
                        <span className="text-pink-500 text-[11px] font-medium">3/12</span>
                      </div>
                      <p className="text-[12px] text-slate-400">Ways to thank your mentor</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>

                  {/* My Portfolio */}
                  <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-slate-50 cursor-pointer group">
                    <div className="bg-indigo-50 text-indigo-400 p-3 rounded-[14px] mr-4 group-hover:scale-105 transition-transform"><Briefcase className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14px] font-medium text-slate-800">My Portfolio</p>
                        <span className="bg-indigo-50 text-indigo-500 text-[11px] font-medium px-2 rounded-full">4 projects</span>
                      </div>
                      <p className="text-[12px] text-slate-400">Build as you learn · 3/12 modules</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>

                  {/* Mental Wellness */}
                  <div className="bg-gradient-to-r from-[#effdf5] to-[#e0f2fe] rounded-[1.5rem] border border-[#a7f3d0]/40 p-4 pb-5 flex flex-col shadow-sm cursor-pointer relative overflow-hidden">
                     <div className="flex items-center justify-between relative z-10 mb-3">
                       <div className="flex items-center gap-3">
                         <div className="bg-white/50 text-[#14b8a6] p-2.5 rounded-xl backdrop-blur-sm"><Heart className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14px] font-medium text-teal-900">Mental Wellness</p>
                             <span className="bg-teal-100 text-teal-600 text-[10px] px-1.5 rounded uppercase font-bold tracking-wide">New</span>
                           </div>
                           <p className="text-[12px] text-teal-700/70 font-medium">Calm Reset · Gratitude Game · Memes</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-teal-500/50" />
                     </div>
                     <div className="flex gap-4 text-[11px] font-medium text-teal-800/60 relative z-10 px-1">
                       <span className="flex items-center gap-1">🧘 Brain Recharge</span>
                       <span className="flex items-center gap-1">🙏 Gratitude Points</span>
                       <span className="flex items-center gap-1">😂 Daily Memes</span>
                     </div>
                  </div>

                  {/* Interesting Facts */}
                  <div className="bg-gradient-to-r from-[#fefce8] to-[#fffbeb] rounded-[1.5rem] border border-[#fde047]/30 p-4 pb-5 flex flex-col shadow-sm cursor-pointer relative overflow-hidden">
                     <div className="flex items-center justify-between relative z-10 mb-3">
                       <div className="flex items-center gap-3">
                         <div className="bg-amber-100/50 text-amber-500 p-2.5 rounded-xl backdrop-blur-sm"><Lightbulb className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14px] font-medium text-amber-900">Interesting Facts</p>
                             <span className="bg-amber-100/50 text-amber-600 text-[10px] px-1.5 rounded uppercase font-bold tracking-wide">New</span>
                           </div>
                           <p className="text-[12px] text-amber-700/70 font-medium">Small facts. Big inspiration.</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-amber-500/50" />
                     </div>
                     <div className="flex gap-4 text-[11px] font-medium text-amber-800/60 relative z-10 px-1">
                       <span className="flex items-center gap-1">🧠 Brain & Learning</span>
                       <span className="flex items-center gap-1">💻 Tech & Code</span>
                       <span className="flex items-center gap-1">🏆 Challenges</span>
                     </div>
                  </div>

                  {/* Mentor's Thought of the Day */}
                  <div className="bg-[#f5f3ff] rounded-[1.5rem] p-5 shadow-sm mt-6 border border-purple-100/50 flex flex-col">
                    <div className="flex items-center gap-2 text-purple-600 font-medium text-[14px] mb-3">
                      <Sun className="w-4 h-4" strokeWidth={2.5} /> Mentor's Thought of the Day
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 italic text-slate-700 text-[14px] leading-relaxed relative border border-white">
                      "Consistency beats intensity. Practice a little every day."
                      <span className="block text-purple-400 not-italic text-[13px] mt-2">— Pradeep K.</span>
                    </div>
                    <button className="w-full bg-[#8b5cf6] text-white py-3.5 rounded-xl mt-4 font-medium flex gap-2 items-center justify-center hover:bg-[#7c3aed] transition-colors shadow-sm shadow-purple-200">
                      <Heart className="w-[18px] h-[18px]" /> Read & Reflect
                    </button>
                    <div className="flex justify-between items-center mt-4 px-1">
                      <p className="text-[12px] font-medium text-orange-500 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> 3-day streak</p>
                      <p className="text-[12px] font-medium text-amber-600 flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> +5 XP per reflection</p>
                    </div>
                  </div>
                </div>

                {/* Footer Stats Row */}
                <div className="mt-6 mb-4 flex divide-x divide-slate-100 bg-white rounded-[1.5rem] p-4 shadow-sm mx-1 border border-slate-50">
                   <div className="flex flex-col items-center flex-1 justify-center">
                     <p className="text-slate-800 font-semibold text-[20px]">3</p>
                     <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider mt-0.5">Day Streak</p>
                   </div>
                   <div className="flex flex-col items-center flex-1 justify-center text-amber-500">
                     <div className="flex items-center gap-1 text-[20px] font-semibold"><Coins className="w-5 h-5 fill-amber-100" /> 240</div>
                     <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider mt-0.5">Coins</p>
                   </div>
                   <div className="flex flex-col items-center flex-1 justify-center">
                     <p className="text-slate-800 font-semibold text-[20px]">85%</p>
                     <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider mt-0.5">Quiz Avg</p>
                   </div>
                </div>
                
                  </div>
                </div>
                {/* Final Quote */}
                <div className="text-center pb-24 px-6 flex flex-col gap-1 items-center mb-6">
                   <p className="text-slate-400/80 italic text-[13px] relative flex gap-2"><Quote className="w-4 h-4 shrink-0 text-slate-300" /> "You're doing great, keep pushing!"</p>
                   <p className="text-slate-300 text-[12px] font-medium ml-6">— Pradeep K.</p>
                </div>

                {/* Fixed Bottom Navigation Menu */}
                <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">
                   <div onClick={() => setState("DASHBOARD_MAIN")} className="flex flex-col items-center gap-1 text-slate-900 cursor-pointer group">
                     <div className="relative">
                       <Home className="w-6 h-6 stroke-[2.2px] group-hover:-translate-y-0.5 transition-transform" />
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                     </div>
                     <span className="text-[10px] font-bold mt-1">Home</span>
                   </div>
                   <div onClick={() => setState("COURSE_DETAILS")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <BookOpen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Courses</span>
                   </div>
                   <div onClick={() => setState("GAMES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group relative">
                     <Gamepad2 className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                     <span className="text-[10px] font-semibold mt-1">Games</span>
                   </div>
                   <div onClick={() => setState("NOTES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <NotebookPen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Notes</span>
                   </div>
                   <div onClick={() => setState("PROFILE")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <UserCircle className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Profile</span>
                   </div>
                </div>

              </motion.div>
            )}

            {state === "COURSE_DETAILS" && (
              <motion.div key="course_details" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-white -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-40 relative">
                
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-md pt-5 pb-3 z-30 flex items-center gap-4 px-1 mx-1">
                  <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <p className="text-[16px] font-medium text-slate-800">Course Details</p>
                </div>

                {/* Course Intro */}
                <div className="px-2 mt-2">
                  <div className="flex gap-4 mb-6">
                    <div className="w-14 h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Code className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-medium text-slate-900 mb-1">Python Fundamentals</h2>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Master Python from zero to confident coder. 12 modules · 36 lessons</p>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="flex gap-3 mb-6">
                    <div className="flex-1 bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                      <p className="font-semibold text-slate-800 text-[15px]">14%</p>
                      <p className="text-[11px] text-slate-400 mt-1">Complete</p>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                      <p className="font-semibold text-slate-800 text-[15px]">5/36</p>
                      <p className="text-[11px] text-slate-400 mt-1">Lessons</p>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                      <p className="font-semibold text-slate-800 text-[15px]">~6h</p>
                      <p className="text-[11px] text-slate-400 mt-1">Remaining</p>
                    </div>
                  </div>

                  {/* Progress Bar overall */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-slate-900 w-[14%] rounded-full"></div>
                  </div>
                </div>

                {/* Syllabus List */}
                <div className="px-2 border-t border-slate-100 pt-6 flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-[18px] h-[18px] text-slate-500" strokeWidth={2.5} />
                    <h3 className="text-[16px] font-medium text-slate-800">Syllabus</h3>
                  </div>

                  <div className="space-y-0 relative border-l-2 border-slate-100 ml-4 max-w-full">
                    
                    {/* Module 1 (Completed) */}
                    <div className="relative pl-6 pb-6">
                      <div className="absolute -left-[18px] bg-white p-1">
                        <div className="w-7 h-7 rounded-full bg-[#10b981] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="pr-2">
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="text-[14px] text-slate-800 font-medium">Getting Started</p>
                          <div className="flex gap-2 items-center text-slate-400">
                             <span className="text-[12px] font-medium">3/3</span>
                             <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-[13px] text-slate-500 mb-4 max-w-[240px]">Set up your environment and write your first line of code</p>
                        <div className="h-1 bg-[#10b981] w-full rounded-full"></div>
                      </div>
                    </div>

                    {/* Module 2 (Active) */}
                    <div className="relative pl-6 pb-6">
                      <div className="absolute -left-[18px] bg-white p-1 top-0 z-10">
                        <div className="w-7 h-7 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                          <Layers className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="pr-2">
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="text-[14px] text-slate-900 font-medium pb-0.5">Data Types & Variables</p>
                          <div className="flex gap-2 items-center text-slate-400">
                             <span className="text-[12px] font-medium">2/5</span>
                             <ChevronUp className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-[13px] text-slate-500 mb-4 max-w-[240px]">Understand how Python stores and handles data</p>
                        
                        {/* Expanded Lessons */}
                        <div className="space-y-2 mb-4">
                           {/* Lesson 1 completed */}
                           <div className="flex items-center gap-4 py-2">
                             <div className="bg-[#ecfdf5] text-[#10b981] p-1.5 rounded-full shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                             <div className="flex-1">
                               <p className="text-[13px] text-slate-700 font-medium">Numbers & Strings</p>
                               <p className="text-[11px] text-slate-400">12 min · Video</p>
                             </div>
                             <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                           </div>
                           
                           {/* Lesson 2 completed */}
                           <div className="flex items-center gap-4 py-2">
                             <div className="bg-[#ecfdf5] text-[#10b981] p-1.5 rounded-full shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                             <div className="flex-1">
                               <p className="text-[13px] text-slate-700 font-medium">Booleans & None</p>
                               <p className="text-[11px] text-slate-400">8 min · Video</p>
                             </div>
                             <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                           </div>

                           {/* Lesson 3 active */}
                           <div className="flex items-center gap-4 py-3 px-4 bg-white rounded-2xl border border-blue-200 shadow-sm -ml-4 mr-0">
                             <div className="bg-[#3b82f6] text-white p-1.5 rounded-full shrink-0 shadow-sm"><Play className="w-4 h-4" /></div>
                             <div className="flex-1">
                               <p className="text-[13px] text-slate-900 font-bold">Variables & Assignment</p>
                               <p className="text-[11px] text-slate-500">10 min · Video</p>
                             </div>
                             <div className="bg-[#3b82f6] text-white p-1.5 rounded-full"><Play className="w-[14px] h-[14px]" /></div>
                           </div>
                        </div>

                        <div className="h-1 bg-slate-100 flex w-full rounded-full overflow-hidden">
                           <div className="h-full bg-[#3b82f6] w-[40%] rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Locked Modules */}
                    <div className="relative pl-6 pb-6">
                      <div className="absolute -left-[14px] bg-white py-1 transition-colors">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center bg-white"><Lock className="w-3 h-3" strokeWidth={3} /></div>
                      </div>
                      <div className="pr-2 opacity-50 pointer-events-none">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[14px] text-slate-800 font-medium">Error Handling</p>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[12px] text-slate-500">Handle exceptions gracefully</p>
                      </div>
                    </div>

                    <div className="relative pl-6 pb-6">
                      <div className="absolute -left-[14px] bg-white py-1">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center bg-white"><Lock className="w-3 h-3" strokeWidth={3} /></div>
                      </div>
                      <div className="pr-2 opacity-50 pointer-events-none">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[14px] text-slate-800 font-medium">Modules & Packages</p>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[12px] text-slate-500">Organize and reuse code across projects</p>
                      </div>
                    </div>

                    <div className="relative pl-6 pb-8">
                      <div className="absolute -left-[14px] bg-white py-1">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center bg-white"><Lock className="w-3 h-3" strokeWidth={3} /></div>
                      </div>
                      <div className="pr-2 opacity-50 pointer-events-none">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[14px] text-slate-800 font-medium">Final Project</p>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[12px] text-slate-500">Build a complete Python application from scratch</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Earn Your Certificate Card */}
                <div className="mx-2 mb-8 bg-[#0f172a] rounded-3xl p-5 flex gap-4 items-center shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
                  <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl shrink-0 z-10">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="z-10 flex-1">
                    <p className="text-white font-medium text-[14px] mb-1">Earn Your Certificate</p>
                    <p className="text-slate-400 text-[12px] leading-snug">Complete all 12 modules to get your Python Fundamentals certificate</p>
                  </div>
                  <div className="z-10 bg-slate-800 text-amber-500 font-medium text-[12px] px-2.5 py-1 rounded-lg shrink-0 border border-slate-700">
                    14%
                  </div>
                </div>

                {/* Fixed Bottom Container (Button + Nav) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col px-6 pb-6 pt-4 sm:rounded-b-2xl z-50">
                   
                   <button className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-medium flex gap-2 items-center justify-center hover:bg-[#1e293b] transition-colors mb-6 shadow-md shadow-slate-900/10">
                     <Play className="w-[18px] h-[18px]" strokeWidth={2.5} /> Continue Learning
                   </button>

                   <div className="flex items-center justify-between">
                     <div onClick={() => setState("DASHBOARD_MAIN")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                       <Home className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                       <span className="text-[10px] font-semibold mt-1">Home</span>
                     </div>
                     <div className="flex flex-col items-center gap-1 text-slate-900 cursor-pointer group">
                       <div className="relative">
                         <BookOpen className="w-6 h-6 stroke-[2.2px] group-hover:-translate-y-0.5 transition-transform" />
                         <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                       </div>
                       <span className="text-[10px] font-bold mt-1">Courses</span>
                     </div>
                     <div onClick={() => setState("GAMES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group relative">
                       <Gamepad2 className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                       <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                       <span className="text-[10px] font-semibold mt-1">Games</span>
                     </div>
                     <div onClick={() => setState("NOTES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                       <NotebookPen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                       <span className="text-[10px] font-semibold mt-1">Notes</span>
                     </div>
                     <div onClick={() => setState("PROFILE")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                       <UserCircle className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                       <span className="text-[10px] font-semibold mt-1">Profile</span>
                     </div>
                   </div>
                </div>

              </motion.div>
            )}

            {state === "GAMES" && (
              <motion.div key="games" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
                
                {/* Header */}
                <div className="sticky top-0 bg-slate-50/95 backdrop-blur-md pt-5 pb-3 z-30 px-1 mx-1 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div>
                        <p className="text-[16px] font-medium text-slate-800 leading-tight">Gaming Quiz</p>
                        <p className="text-[12px] text-slate-400 font-medium">Python Fundamentals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full border border-amber-100 font-medium text-[13px]">
                      <Coins className="w-4 h-4 fill-amber-200" /> 240
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-500 text-[12px] font-medium pl-1">
                     <Zap className="w-3.5 h-3.5" /> <span className="underline decoration-rose-300 underline-offset-2">Reset daily limits (testing)</span>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex items-center justify-between bg-slate-100/80 rounded-2xl p-1 mb-2 mt-1">
                    <div className="bg-white text-slate-900 rounded-xl px-4 py-2 text-[13px] font-semibold flex items-center gap-1.5 shadow-sm">
                      <Zap className="w-4 h-4" /> S&L
                    </div>
                    <div className="text-slate-400 hover:text-slate-600 px-4 py-2 text-[13px] font-semibold transition-colors cursor-pointer">Ludo</div>
                    <div className="text-slate-400 hover:text-slate-600 px-4 py-2 text-[13px] font-semibold transition-colors cursor-pointer">KBC</div>
                    <div className="text-slate-400 hover:text-slate-600 px-4 py-2 text-[13px] font-semibold transition-colors cursor-pointer">Board</div>
                  </div>
                </div>

                {/* Game Card */}
                <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 mt-2 mx-1 flex flex-col">
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm relative overflow-hidden">
                       <Dices className="w-7 h-7 text-white/90 relative z-10" strokeWidth={1.5} />
                       <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
                    </div>
                    <div>
                      <h2 className="text-[17px] font-medium text-slate-800 mb-0.5">Snake & Ladder Quiz</h2>
                      <p className="text-[13px] text-slate-400 font-medium tracking-wide">Answer questions to move forward!</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-4 flex flex-col gap-3 mb-6">
                     <div className="flex gap-2">
                       <div className="flex-1 flex items-start gap-2.5">
                         <div className="bg-emerald-100 text-emerald-600 p-1 rounded-md shrink-0"><CheckCircle className="w-3.5 h-3.5" /></div>
                         <span className="text-[13px] text-slate-600 font-medium leading-tight">Correct → roll dice (1-3)</span>
                       </div>
                       <div className="flex-1 flex items-start gap-2.5">
                         <div className="bg-rose-100 text-rose-600 p-1 rounded-md shrink-0"><X className="w-3.5 h-3.5" strokeWidth={3} /></div>
                         <span className="text-[13px] text-slate-600 font-medium leading-tight">Wrong → stay put</span>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <div className="flex-1 flex items-center gap-2.5">
                         <TrendingUp className="w-5 h-5 text-amber-700 shrink-0 stroke-[2.5px]" />
                         <span className="text-[13px] text-slate-600 font-medium">Ladder → climb up!</span>
                       </div>
                       <div className="flex-1 flex items-center gap-2.5">
                         <TrendingDown className="w-5 h-5 text-teal-500 shrink-0 stroke-[2.5px]" />
                         <span className="text-[13px] text-slate-600 font-medium">Snake → slide down!</span>
                       </div>
                     </div>
                  </div>

                  {/* Matchup */}
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-4 flex items-center justify-between mb-8 relative">
                    <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-[18px] font-semibold border-2 border-white shadow-sm ring-2 ring-blue-500/20">S</div>
                      <span className="text-[12px] text-slate-800 font-medium">You</span>
                    </div>
                    
                    <div className="bg-[#0f172a] text-white text-[11px] font-bold px-2.5 py-1 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 ring-4 ring-slate-50">VS</div>
                    
                    <div className="flex flex-col items-center gap-2 relative z-10 w-20">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover"></div>
                      <span className="text-[12px] text-slate-800 font-medium">Vikram S.</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-medium flex gap-2 items-center justify-center hover:bg-[#1e293b] transition-colors shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                    <Dices className="w-5 h-5" strokeWidth={2} /> Start Game
                  </button>

                </div>

                {/* Fixed Bottom Navigation Menu */}
                <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">
                   <div onClick={() => setState("DASHBOARD_MAIN")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <Home className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Home</span>
                   </div>
                   <div onClick={() => setState("COURSE_DETAILS")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <BookOpen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Courses</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 text-slate-900 cursor-pointer group">
                     <div className="relative">
                       <Gamepad2 className="w-6 h-6 stroke-[2.2px] group-hover:-translate-y-0.5 transition-transform" />
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                     </div>
                     <span className="text-[10px] font-bold mt-1">Games</span>
                   </div>
                   <div onClick={() => setState("NOTES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <NotebookPen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Notes</span>
                   </div>
                   <div onClick={() => setState("PROFILE")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <UserCircle className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Profile</span>
                   </div>
                </div>
              </motion.div>
            )}

            {state === "NOTES" && (
              <motion.div key="notes" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
                
                {/* Header */}
                <div className="sticky top-0 bg-slate-50/95 backdrop-blur-md pt-5 pb-4 z-30 px-1 mx-1 flex justify-between items-center border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-100 transition-colors shrink-0">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="text-[16px] font-medium text-slate-800 leading-tight">Running Notes</p>
                      <p className="text-[12px] text-slate-400 font-medium">2 notes</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm"><Camera className="w-[18px] h-[18px]" /></button>
                     <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm"><ImageIcon className="w-[18px] h-[18px]" /></button>
                  </div>
                </div>

                <div className="space-y-4 mx-1 relative z-10">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                       <span className="flex items-center gap-2 text-[14px] font-medium text-slate-800"><FileText className="w-4 h-4 text-slate-300" strokeWidth={2.5}/> Variables & Data Types</span>
                       <div className="flex items-center gap-3">
                         <span className="text-[11px] text-slate-300 font-medium tracking-wide">1d ago</span>
                         <button className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 className="w-[15px] h-[15px]" /></button>
                       </div>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed pr-2">Python variables store data values. x = 5 assigns integer 5 to variable x. Variables don't need type declaration.</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                       <span className="flex items-center gap-2 text-[14px] font-medium text-slate-800"><FileText className="w-4 h-4 text-slate-300" strokeWidth={2.5}/> Lists in Python</span>
                       <div className="flex items-center gap-3">
                         <span className="text-[11px] text-slate-300 font-medium tracking-wide">12h ago</span>
                         <button className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 className="w-[15px] h-[15px]" /></button>
                       </div>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed pr-2">Lists are ordered, mutable collections. Created with square brackets: my_list = [1, 2, 3]. Can contain mixed types.</p>
                  </div>
                </div>

                {/* FAB */}
                <button className="absolute bottom-28 right-6 w-14 h-14 bg-[#0f172a] rounded-full flex items-center justify-center text-white shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all z-40 border-2 border-white">
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </button>

                {/* Fixed Bottom Navigation Menu */}
                <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">
                   <div onClick={() => setState("DASHBOARD_MAIN")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <Home className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Home</span>
                   </div>
                   <div onClick={() => setState("COURSE_DETAILS")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <BookOpen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Courses</span>
                   </div>
                   <div onClick={() => setState("GAMES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group relative">
                     <Gamepad2 className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                     <span className="text-[10px] font-semibold mt-1">Games</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 text-slate-900 cursor-pointer group">
                     <div className="relative">
                       <NotebookPen className="w-6 h-6 stroke-[2.2px] group-hover:-translate-y-0.5 transition-transform" />
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                     </div>
                     <span className="text-[10px] font-bold mt-1">Notes</span>
                   </div>
                   <div onClick={() => setState("PROFILE")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <UserCircle className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Profile</span>
                   </div>
                </div>
              </motion.div>
            )}

            {state === "PROFILE" && (
              <motion.div key="profile" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
                
                {/* Purple Top Block */}
                <div className="bg-[#8b5cf6] pt-8 pb-16 px-5 relative -mx-1 -mt-1 -mr-1">
                  <div className="flex justify-between items-center text-white mb-6">
                    <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <p className="font-medium text-[15px]">My Profile</p>
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-500/80 transition-colors shrink-0" onClick={handleSignOut}>
                      <LogOut className="w-[17px] h-[17px]" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3">
                     <div className="relative">
                       <div className="w-[88px] h-[88px] rounded-full border-2 border-white/20 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop')] bg-cover bg-center grayscale shadow-lg object-cover"></div>
                       <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#8b5cf6] shadow-md border-2 border-transparent">
                         <Camera className="w-[13px] h-[13px]" strokeWidth={3} />
                       </button>
                     </div>
                     <div className="text-center text-white">
                        <h2 className="text-[20px] font-medium leading-tight">{name || "Satya"}</h2>
                        <p className="text-[13px] text-white/70 font-medium flex items-center justify-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {email || "satyasai2108@gmail.com"}</p>
                     </div>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#7c3aed] text-white text-[11px] px-2.5 py-1 rounded font-medium flex items-center gap-1 border border-white/10 shadow-sm"><GraduationCap className="w-3.5 h-3.5" /> Student</span>
                        <span className="bg-white/10 text-white/80 text-[11px] px-2.5 py-1 rounded font-medium border border-white/5">Joined Mar 2026</span>
                     </div>
                  </div>
                </div>

                {/* Overlapping Content Box */}
                <div className="flex-1 bg-slate-50 relative -mt-8 rounded-t-[2rem] px-5 pt-6 pb-8 border border-white">
                  
                  {/* Completeness Bar */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3 -mt-12 mb-6">
                    <div className="flex justify-between items-center text-[13px] font-medium">
                      <span className="text-slate-600">Profile Completeness</span>
                      <span className="text-rose-500">37%</span>
                    </div>
                    <div className="h-[6px] w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-rose-400 w-[37%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Nav Pills */}
                  <div className="flex items-center justify-between bg-white rounded-[1.5rem] p-1.5 shadow-sm border border-slate-100 mb-6">
                    <div className="bg-slate-50 text-slate-800 rounded-xl px-5 py-2.5 text-[13px] font-semibold flex items-center gap-2 border border-slate-200/60 shadow-sm">
                      <BarChart2 className="w-4 h-4" /> Overview
                    </div>
                    <div className="text-slate-400 hover:text-slate-600 px-5 py-2.5 text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer">
                      <ListChecks className="w-4 h-4" /> Answers
                    </div>
                    <div className="text-slate-400 hover:text-slate-600 px-5 py-2.5 text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer">
                      <Medal className="w-4 h-4" /> Badges
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                     <div className="bg-amber-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-amber-100/50 shadow-sm gap-2">
                       <Coins className="w-5 h-5 text-amber-500 fill-amber-100" />
                       <div className="text-center">
                         <p className="text-[15px] font-semibold text-slate-800 leading-tight">240</p>
                         <p className="text-[11px] text-slate-500">Coins</p>
                       </div>
                     </div>
                     <div className="bg-orange-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-orange-100/50 shadow-sm gap-2">
                       <Flame className="w-5 h-5 text-orange-500" />
                       <div className="text-center">
                         <p className="text-[15px] font-semibold text-slate-800 leading-tight">3</p>
                         <p className="text-[11px] text-slate-500 whitespace-nowrap">Day Streak</p>
                       </div>
                     </div>
                     <div className="bg-purple-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-purple-100/50 shadow-sm gap-2">
                       <Target className="w-5 h-5 text-purple-500" />
                       <div className="text-center">
                         <p className="text-[15px] font-semibold text-slate-800 leading-tight">85%</p>
                         <p className="text-[11px] text-slate-500">Quiz Avg</p>
                       </div>
                     </div>
                     <div className="bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-blue-100/50 shadow-sm gap-2">
                       <BookOpen className="w-5 h-5 text-blue-500" />
                       <div className="text-center">
                         <p className="text-[15px] font-semibold text-slate-800 leading-tight">1</p>
                         <p className="text-[11px] text-slate-500">Courses</p>
                       </div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-indigo-100/50 shadow-sm gap-2">
                       <Briefcase className="w-5 h-5 text-indigo-500" />
                       <div className="text-center">
                         <p className="text-[15px] font-semibold text-slate-800 leading-tight">4</p>
                         <p className="text-[11px] text-slate-500">Projects</p>
                       </div>
                     </div>
                     <div className="bg-emerald-50/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-emerald-100/50 shadow-sm gap-2">
                       <FileText className="w-5 h-5 text-emerald-500" />
                       <div className="text-center">
                         <p className="text-[15px] font-semibold text-slate-800 leading-tight">2</p>
                         <p className="text-[11px] text-slate-500">Notes</p>
                       </div>
                     </div>
                  </div>
                  
                  {/* Share & Earn */}
                  <div className="bg-gradient-to-br from-[#fffbeb] to-[#fff7ed] rounded-3xl border border-[#fef08a] p-5 shadow-sm">
                     <div className="flex items-center gap-3 mb-5">
                       <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0"><Coins className="w-5 h-5" /></div>
                       <div>
                         <p className="text-[15px] font-medium text-slate-900 leading-tight mb-0.5">Share & Earn Coins</p>
                         <p className="text-[12px] text-amber-700/70 font-medium">Invite friends, get rewarded!</p>
                       </div>
                     </div>
                     
                     <div className="bg-white rounded-2xl border border-amber-100 p-2 flex justify-between items-center shadow-sm mb-5">
                       <div className="pl-3">
                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Your referral code</p>
                         <p className="text-[15px] font-bold text-slate-800 tracking-wider">MHUB-0H2CY</p>
                       </div>
                       <button className="bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium text-[13px] px-5 py-3 rounded-xl transition-colors border border-amber-100">
                         <div className="flex items-center gap-2"><Link className="w-4 h-4" /> Copy</div>
                       </button>
                     </div>

                     <div className="flex gap-2">
                       <button className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-100 transition-colors gap-1.5">
                         <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
                         <span className="text-[10px] font-medium">WhatsApp</span>
                       </button>
                       <button className="flex-1 bg-pink-50 text-pink-600 hover:bg-pink-100 flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-100 transition-colors gap-1.5">
                         <Camera className="w-5 h-5" strokeWidth={2.5} />
                         <span className="text-[10px] font-medium">Instagram</span>
                       </button>
                       <button className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 transition-colors gap-1.5">
                         <AtSign className="w-5 h-5" strokeWidth={2.5} />
                         <span className="text-[10px] font-medium">X / Twitter</span>
                       </button>
                       <button className="flex-[0.8] bg-slate-100 text-slate-500 hover:bg-slate-200 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 transition-colors gap-1.5 relative">
                         <Link className="w-5 h-5" strokeWidth={2.5} />
                         <span className="text-[10px] font-medium" style={{ whiteSpace: 'nowrap', transform: 'scale(0.85)' }}>Copy Link</span>
                       </button>
                     </div>
                  </div>
                  
                </div>

                {/* Fixed Bottom Navigation Menu */}
                <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 sm:rounded-b-2xl z-50">
                   <div onClick={() => setState("DASHBOARD_MAIN")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <Home className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Home</span>
                   </div>
                   <div onClick={() => setState("COURSE_DETAILS")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <BookOpen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Courses</span>
                   </div>
                   <div onClick={() => setState("GAMES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group relative">
                     <Gamepad2 className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <div className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                     <span className="text-[10px] font-semibold mt-1">Games</span>
                   </div>
                   <div onClick={() => setState("NOTES")} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group">
                     <NotebookPen className="w-6 h-6 stroke-[2px] group-hover:-translate-y-0.5 transition-transform" />
                     <span className="text-[10px] font-semibold mt-1">Notes</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 text-slate-900 cursor-pointer group">
                     <div className="relative">
                       <UserCircle className="w-6 h-6 stroke-[2.2px] group-hover:-translate-y-0.5 transition-transform" />
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                     </div>
                     <span className="text-[10px] font-bold mt-1">Profile</span>
                   </div>
                </div>

              </motion.div>
            )}

            {state === "MENTOR_PROFILE" && (
              <motion.div key="mentor_profile" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-4 overflow-y-auto hidden-scrollbar relative bg-white">
                <div className="flex gap-1.5 justify-center mb-6 mt-2 shrink-0">
                   {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 2 ? 'bg-[#0f172a]' : 'bg-slate-100'}`} />)}
                </div>
                <div className="mb-8 shrink-0"><button onClick={() => setState("ROLE")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></button></div>
                
                <div className="mb-8 space-y-1.5 shrink-0">
                  <h2 className="text-[18px] font-medium text-[#0f172a]">Your profile</h2>
                  <p className="text-[14px] text-slate-500">Tell us a little about yourself.</p>
                </div>

                <div className="space-y-5 flex-1">
                  <div className="space-y-2"><Label className="text-[13px] text-slate-600 font-medium ml-1">Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-[50px] rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-white" /></div>
                  <div className="space-y-2"><Label className="text-[13px] text-slate-600 font-medium ml-1">Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="h-[50px] rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-white" /></div>
                  <div className="space-y-2"><Label className="text-[13px] text-slate-600 font-medium ml-1">Your expertise</Label><Textarea value={mentorExpertise} onChange={e => setMentorExpertise(e.target.value)} placeholder="e.g. UX Design, Product Strategy..." className="min-h-[110px] resize-none rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-white" /></div>
                </div>

                <div className="mt-8 shrink-0 mb-4">
                  <Button disabled={!name || !email} onClick={() => setState("MENTOR_QUIZ")} className={`w-full h-[52px] rounded-xl text-[15px] font-medium transition-all ${name && email ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-200/60 text-slate-400"}`}>
                    Continue <ArrowRight className="w-[18px] h-[18px] ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {state === "MENTOR_QUIZ" && (() => {
              const currentData = MENTOR_QUIZ_STEPS[mentorQuizIndex];
              const Icon = currentData.icon;
              return (
                <motion.div key={`mentor_quiz_${mentorQuizIndex}`} variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-white">
                  <div className="flex gap-1.5 justify-center mb-4 mt-6 shrink-0">
                     {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= (mentorQuizIndex + 3) ? 'bg-[#0f172a]' : 'bg-slate-100'}`} />)}
                  </div>
                  <div className="mb-6 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                      <button onClick={() => mentorQuizIndex > 0 ? setMentorQuizIndex(mentorQuizIndex - 1) : setState("MENTOR_PROFILE")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 flex items-center gap-1.5 focus:outline-none">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-500">{currentData.step} of {MENTOR_QUIZ_STEPS.length}</span>
                      </button>
                      <button className="text-[13px] text-slate-400 flex items-center gap-1.5 hover:text-slate-600 focus:outline-none font-medium">
                        <SkipForward className="w-3.5 h-3.5" /> Skip All
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-full text-white`} style={{ backgroundColor: currentData.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-[17px] font-medium text-[#0f172a]">{currentData.title}</h2>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-3 -mr-3 pb-8 space-y-8 scrollbar-thin">
                    {currentData.questions.map((q) => (
                      <div key={q.id} className="space-y-3.5">
                        <p className="text-[14px] text-slate-700 font-medium leading-relaxed">
                          <span className="text-slate-400 font-normal mr-1">{q.number}</span>{q.text}
                        </p>
                        {q.type === "input" ? (
                          <Input placeholder={q.placeholder} value={(selections[q.id] as string) || ""} onChange={(e) => handleInputChange(q.id, e.target.value)} className="h-[50px] rounded-xl border-slate-200 text-[15px] bg-white shadow-sm shadow-slate-100/50 hover:border-slate-300 transition-colors focus-visible:ring-[#0cb4ce]/20" />
                        ) : (
                          <div className="flex flex-wrap gap-2.5">
                            {q.options?.map(opt => {
                              const selected = q.multiSelect ? ((selections[q.id] as string[]) || []).includes(opt) : selections[q.id] === opt;
                              return <SelectionChip key={opt} label={opt} active={selected} onClick={() => handleSelect(q.id, opt, q.multiSelect)} />;
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 shrink-0 bg-white border-t border-slate-50 mt-auto mb-4">
                    <Button onClick={() => mentorQuizIndex < MENTOR_QUIZ_STEPS.length - 1 ? setMentorQuizIndex(mentorQuizIndex + 1) : saveProfileData("MENTOR")} className={`w-full h-[52px] rounded-xl text-[15px] font-medium transition-all ${(selections['q101'] || selections['q102'] || selections['q103'] || selections['q104']) ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-200/60 text-slate-400"}`}>
                      Next <ArrowRight className="w-[18px] h-[18px] ml-1.5" />
                    </Button>
                    <button onClick={() => saveProfileData("MENTOR")} className="w-full mt-4 pb-1 text-[13px] font-medium text-slate-400 hover:text-slate-600">Skip this section</button>
                  </div>
                </motion.div>
              );
            })()}

            {state === "MENTOR_MATCHING" && (
              <motion.div key="mentor_matching" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-white -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
                
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-md pt-5 pb-4 z-30 px-2 mx-1 border-b border-slate-100">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-[5px] bg-slate-800 rounded-full z-20"></div>
                  <div className="flex items-center gap-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-[#7c3aed] flex items-center justify-center text-white shadow-sm text-lg font-semibold shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[18px] font-medium text-slate-900 leading-tight">Welcome, {name || "satya"}!</p>
                      <p className="text-[13px] text-slate-400 font-medium">Review & select your students</p>
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div className="bg-[#eef2ff] rounded-[1.5rem] p-5 mt-4 mx-2 border border-[#e0e7ff] flex gap-4">
                  <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[13px] font-semibold text-indigo-800 mb-1">{realStudents.length} students are waiting for a mentor</p>
                     <p className="text-[12px] text-indigo-500 leading-relaxed font-medium">Select the students you'd like to mentor. You can review their profiles and questionnaire responses below.</p>
                  </div>
                </div>

                {/* Sort Bar */}
                <div className="flex items-center gap-3 px-2 mt-6 mb-4">
                   <span className="text-[12px] text-slate-400 font-medium">Sort by:</span>
                   <button className="bg-[#0f172a] text-white px-4 py-1.5 rounded-full text-[12px] font-medium shadow-sm">Best Match</button>
                   <button className="bg-slate-50 text-slate-500 hover:bg-slate-100 px-4 py-1.5 rounded-full text-[12px] font-medium border border-slate-200 transition-colors">Recent</button>
                </div>

                {/* Student List */}
                <div className="space-y-4 px-2">
                  {realStudents.map(student => {
                    const isExpanded = expandedStudents.includes(student.id);
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                    <div key={student.id} className={`bg-white rounded-[1.5rem] border ${isSelected ? 'border-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,1)]' : 'border-slate-100'} p-5 pb-4 shadow-sm transition-all relative flex flex-col`}>
                      
                      {isExpanded ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); setExpandedStudents(prev => prev.filter(id => id !== student.id)); }} className="flex justify-center items-center text-[13px] text-slate-400 font-medium pb-4 hover:text-slate-600 w-full mt-[-4px]">
                            Hide Details <ChevronUp className="w-4 h-4 ml-1" />
                          </button>
                          
                          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center gap-2 mb-4 text-[14px] text-slate-600 w-full border border-slate-100/50">
                            <Mail className="w-4 h-4 shrink-0 text-slate-400" /> <span className="font-medium">{student.email || "vikram.p@gmail.com"}</span>
                          </div>
                          
                          <div className="bg-[#f5f3ff] rounded-xl p-4 mb-5 border border-[#ede9fe]">
                            <div className="flex items-center gap-2 text-indigo-600 mb-2.5">
                              <Target className="w-4 h-4 shrink-0" />
                              <span className="text-[13px] font-semibold">Learning Goal</span>
                            </div>
                            <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                              {student.desc}
                            </p>
                          </div>
                          
                          <div className="mb-6 px-1">
                            <div className="flex items-center gap-2 text-slate-500 mb-4">
                              <BookOpen className="w-[18px] h-[18px] shrink-0" />
                              <span className="text-[14px] font-medium">Questionnaire Responses</span>
                            </div>
                            <div className="space-y-3.5">
                               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[14px] gap-1 border-b border-slate-50 pb-2.5">
                                 <span className="text-slate-400">Inspiration</span>
                                 <span className="text-slate-800 font-medium text-right">{student.preferences?.inspiration || "A teacher/mentor"}</span>
                               </div>
                               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[14px] gap-1 border-b border-slate-50 pb-2.5">
                                 <span className="text-slate-400">Movie Preference</span>
                                 <span className="text-slate-800 font-medium text-right">{student.preferences?.movie || "Sci-fi / Technology"}</span>
                               </div>
                               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[14px] gap-1 border-b border-slate-50 pb-2.5">
                                 <span className="text-slate-400">Learning Style</span>
                                 <span className="text-slate-800 font-medium text-right">{student.preferences?.style || "Hands-on projects"}</span>
                               </div>
                               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[14px] gap-1 pb-1">
                                 <span className="text-slate-400">Location</span>
                                 <span className="text-slate-800 font-medium text-right">{student.preferences?.location || student.location || "Mumbai, India"}</span>
                               </div>
                            </div>
                          </div>
                          
                          <button onClick={(e) => { e.stopPropagation(); setSelectedStudents(prev => isSelected ? prev.filter(id => id !== student.id) : [...prev, student.id]); }} className={`w-full py-[14px] rounded-[14px] text-[15px] font-medium flex items-center justify-center gap-2 transition-all ${isSelected ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm' : 'bg-[#5b32f6] hover:bg-indigo-600 text-white shadow-sm'}`}>
                            {isSelected ? "Deselect This Student" : <><Check className="w-[18px] h-[18px]" /> Select This Student</>}
                          </button>
                        </>
                      ) : (
                        <div onClick={() => setSelectedStudents(prev => isSelected ? prev.filter(id => id !== student.id) : [...prev, student.id])} className="cursor-pointer">
                          <div className="flex gap-4">
                            <div className="relative shrink-0">
                              <img src={student.image} alt={student.name} className="w-14 h-14 rounded-full object-cover shadow-sm bg-slate-100 grayscale hover:grayscale-0 transition-all border border-slate-100" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-0.5">
                                <h3 className="text-[15px] font-medium text-slate-800">{student.name}</h3>
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${student.match.startsWith('9') ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' : 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]'}`}>{student.match} match</span>
                              </div>
                              <p className="text-[12px] text-slate-500 mb-2 leading-relaxed line-clamp-1">{student.desc}</p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mb-3">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {student.time}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {student.location}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {student.tags.map(tag => (
                                  <span key={tag} className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-1 rounded-md font-medium">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center text-[12px] text-slate-400 font-medium items-center gap-1 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setExpandedStudents(prev => [...prev, student.id]); }}>
                            View Full Profile <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>

                {/* Fixed Bottom Action Container */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col p-6 sm:rounded-b-2xl z-50">
                   <button onClick={() => { if(selectedStudents.length > 0) setState("MENTOR_DASHBOARD") }} className={`w-full h-[52px] rounded-xl text-[15px] font-medium flex gap-2 items-center justify-center transition-all shadow-sm ${selectedStudents.length > 0 ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-200/60 text-slate-400"}`}>
                     {selectedStudents.length > 0 ? `Select ${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''}` : "Select at least one student"}
                   </button>
                   <button onClick={() => setState("MENTOR_DASHBOARD")} className="text-[12px] text-slate-400 font-medium hover:text-slate-600 mt-4 text-center">
                     Skip for now — I&apos;ll review students later
                   </button>
                </div>

              </motion.div>
            )}

            {(state === "MENTOR_DASHBOARD" || state === "MENTOR_STUDENTS" || state === "NOTES" || state === "MENTOR_CIRCLE" || state === "PROFILE") && (
              <motion.div key="mentor_portal" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-6 px-4 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
                
                {state === "MENTOR_DASHBOARD" && <MentorHome />}
                {state === "MENTOR_STUDENTS" && <MentorStudents />}
                {state === "NOTES" && <MentorNotes />}
                {state === "MENTOR_CIRCLE" && <MentorCircle />}
                {state === "PROFILE" && <MentorProfile />}

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-between px-6 pt-3 pb-8 z-50 sm:rounded-b-3xl max-w-lg mx-auto">
                  <button onClick={() => setState("MENTOR_DASHBOARD")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_DASHBOARD" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Home className="w-5 h-5" strokeWidth={state === "MENTOR_DASHBOARD" ? 2.5 : 2}/><span className="text-[10px] font-semibold">Home</span></button>
                  <button onClick={() => setState("MENTOR_STUDENTS")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_STUDENTS" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Users className="w-5 h-5" strokeWidth={state === "MENTOR_STUDENTS" ? 2.5 : 2}/><span className="text-[10px] font-medium">Students</span></button>
                  <button onClick={() => setState("NOTES")} className={`flex flex-col items-center gap-1 w-12 ${state === "NOTES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><NotebookPen className="w-5 h-5" strokeWidth={state === "NOTES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Notes</span></button>
                  <button onClick={() => setState("MENTOR_CIRCLE")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_CIRCLE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Users className="w-5 h-5" strokeWidth={state === "MENTOR_CIRCLE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Circle</span></button>
                  <button onClick={() => setState("PROFILE")} className={`flex flex-col items-center gap-1 w-12 ${state === "PROFILE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><User className="w-5 h-5" strokeWidth={state === "PROFILE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Profile</span></button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
