"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Phone, ShieldCheck, ArrowLeft, GraduationCap, Users, ArrowRight, Camera, Star, SkipForward, Trophy, Brain, Code, BookOpen, Zap, BrainCircuit, Lightbulb, BookOpenCheck, Bell, Search, User, Mail, CheckCircle2, Clock, Circle, Target, MessageSquare, BookText, Send, Play, PlayCircle, FileText, Video, Swords, NotebookPen, Heart, Briefcase, Sun, Flame, Coins, Activity, Home, Gamepad2, ChevronRight, Calendar, Quote, CheckCircle, Layers, Lock, Award, ChevronUp, ChevronDown, Dices, X, TrendingUp, TrendingDown, Image as ImageIcon, Trash2, Plus, Pencil, BarChart2, ListChecks, Medal, Link, MessageCircle, AtSign, UserCircle, MapPin, LogOut, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase";
const supabase = createClient();
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

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
import { MentorCourses } from "@/components/mentor/MentorCourses";
import { StudentGames } from "@/components/student/StudentGames";
import { MentalWellness } from "@/components/student/MentalWellness";
import { InterestingFacts } from "@/components/student/InterestingFacts";
import { StudentPortfolio } from "@/components/student/StudentPortfolio";
import { GratitudeWall } from "@/components/student/GratitudeWall";
import { mentorCoursesCatalog } from "@/lib/mentorCoursesData";
import { CourseDetailsScreen } from "@/components/admin/CourseDetailsScreen";

type FlowState = "LOGIN" | "SIGNIN" | "SIGNUP" | "ROLE" | "STUDENT_PROFILE" | "STUDENT_QUIZ" | "STUDENT_SCREENING" | "DASHBOARD_AWAITING" | "DASHBOARD_MAIN" | "COURSE_DETAILS" | "GAMES" | "NOTES" | "PROFILE" | "MENTOR_PROFILE" | "MENTOR_QUIZ" | "MENTOR_MATCHING" | "MENTOR_DASHBOARD" | "MENTOR_STUDENTS" | "MENTOR_NOTES" | "MENTOR_COURSES" | "MENTOR_CIRCLE" | "MENTOR_ACCOUNT" | "PORTFOLIO" | "WELLNESS" | "FACTS" | "GRATITUDE_WALL" | "MESSAGES";

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

const LOCAL_ENROLLMENTS_KEY = "mentorhub_local_enrollments";

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
  
  // Games state
  const [gamesList, setGamesList] = useState<any[]>([]);
  const [activePlayableGame, setActivePlayableGame] = useState<any>(null);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [currentGameQuestionIndex, setCurrentGameQuestionIndex] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(1);
  const [aiPosition, setAiPosition] = useState(1);
  const [gameTurn, setGameTurn] = useState<"player" | "ai">("player");
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "idle">("idle");
  const [selectedGameAnswerOption, setSelectedGameAnswerOption] = useState<string | null>(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [wasAnswerCorrect, setWasAnswerCorrect] = useState(false);
  const [coinsCount, setCoinsCount] = useState(240);
  const [activeInspiration, setActiveInspiration] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messaging state
  const [mappedMentor, setMappedMentor] = useState<any>(null);
  const [enrolledCourse, setEnrolledCourse] = useState<any>(null);
  
  // Helper to map and inject enabled: true property to modules/lessons to match decompiler 'l5' exactly
  const mapToExtendedCourse = (c: any) => {
    if (!c) return null;
    
    // Check if we can find full data from catalog
    const catalogCourse = mentorCoursesCatalog.find(cat => cat.title === c.title || cat.id === c.id);
    const source = catalogCourse || c;

    return {
      id: source.id,
      title: source.title,
      shortTitle: source.shortTitle || source.title.slice(0, 15),
      description: source.description || "",
      category: source.category || "General",
      difficulty: source.difficulty || "Beginner",
      duration: source.duration || "10 hours",
      enrolled: true,
      progress: courseProgress.length > 0 ? Math.round((courseProgress.length / (source.modules?.reduce((acc: number, m: any) => acc + m.lessons.length, 0) || source.content?.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0) || 1)) * 100) : 0,
      color: source.color || "text-emerald-600",
      bgColor: source.bgColor || "bg-emerald-500",
      icon: source.icon || <BookOpen className="w-5 h-5" />,
      modules: (source.modules || source.content || []).map((m: any) => {
        const dbLessons = m.lessons || (m.topics || []).map((topicName: string, tIdx: number) => ({
          id: `${m.id || 'm'}-l-${tIdx}`,
          title: topicName,
          duration: "10 min",
          type: "video",
          enabled: true
        }));

        return {
          id: m.id || `m-${Date.now()}-${Math.random()}`,
          title: m.title || "Untitled Module",
          description: m.description || "",
          color: m.color || "bg-emerald-500",
          enabled: m.enabled ?? true,
          lessons: dbLessons.map((l: any) => ({
            id: l.id || `l-${Date.now()}-${Math.random()}`,
            title: l.title || "Untitled Lesson",
            duration: l.duration || "10 min",
            type: l.type || "video",
            enabled: l.enabled ?? true
          }))
        };
      })
    };
  };
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [studentSessions, setStudentSessions] = useState<any[]>([]);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("30");
  const [sendSuccess, setSendSuccess] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (state === "MESSAGES") {
      scrollToBottom();
    }
  }, [messages, state]);

  useEffect(() => {
    // 1. Check for initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleSessionSync(session);
      }
    };
    checkUser();

    // 2. Listen for auth changes (including OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await handleSessionSync(session);
      } else if (event === 'SIGNED_OUT') {
        setState("LOGIN");
        setRole(null);
        setName("");
        setEmail("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionSync = async (session: any) => {
    if (!session?.user) return;
    
    setEmail(session.user.email || "");
    if (session.user.user_metadata?.full_name) setName(session.user.user_metadata.full_name);

    // Fetch profile to see where to send the user
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name || "");
        setRole(profile.role as any);
        setCoinsCount(profile.coins || 0);
        
        // Fetch enrollments for student
        if (profile.role === "STUDENT") {
          const { data: enrolls } = await supabase
            .from('enrollments')
            .select('*, course:courses(*)')
            .eq('student_id', session.user.id);
          
          if (enrolls) {
            setStudentEnrollments(enrolls);
            // Set first enrollment as active if none set
            if (enrolls.length > 0 && !enrolledCourse) {
              setEnrollmentId(enrolls[0].id);
              setEnrolledCourse(enrolls[0].course);
              setCourseProgress((enrolls[0].progress as string[]) || []);
            }
          }

          // Fetch notes for student
          const { data: dbNotes } = await supabase
            .from('student_notes')
            .select('*')
            .eq('student_id', session.user.id)
            .order('timestamp', { ascending: false });
          
          if (dbNotes) setNotes(dbNotes);

          // Fetch custom todos
          const { data: dbTodos } = await supabase
            .from('custom_todos')
            .select('*')
            .eq('student_id', session.user.id)
            .order('created_at', { ascending: false });

          if (dbTodos) setCustomTodos(dbTodos);
        }

        // Auto-redirect based on role if still in auth screens
        if (["LOGIN", "SIGNIN", "SIGNUP", "ROLE"].includes(state)) {
          setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
        }
      } else {
        // No profile? Send to role selection
        if (["LOGIN", "SIGNIN", "SIGNUP"].includes(state)) {
          setState("ROLE");
        }
      }
    } catch (e) {
      console.error("Session sync error:", e);
    }
  };

  // Student Running Notes State and Handlers
  const [notes, setNotes] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mentorhub_running_notes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading notes:", e);
        }
      }
    }
    return [
      {
        id: "n1",
        type: "text",
        title: "Variables & Data Types",
        content: "Python variables store data values. x = 5 assigns integer 5 to variable x. Variables don't need type declaration.",
        timestamp: Date.now() - 86400000
      },
      {
        id: "n2",
        type: "text",
        title: "Lists in Python",
        content: "Lists are ordered, mutable collections. Created with square brackets: my_list = [1, 2, 3]. Can contain mixed types.",
        timestamp: Date.now() - 43200000
      }
    ];
  });
  const [noteTitleInput, setNoteTitleInput] = useState("");
  const [noteContentInput, setNoteContentInput] = useState("");
  const [showNoteCreator, setShowNoteCreator] = useState(false);
  const [expandedPhotoNoteId, setExpandedPhotoNoteId] = useState<string | null>(null);

  // Sync notes to localstorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mentorhub_running_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleSaveNote = async () => {
    if (!noteContentInput.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    
    const newNote = {
      id: `n-${Date.now()}`,
      type: "text",
      title: noteTitleInput.trim() || "Untitled Note",
      content: noteContentInput.trim(),
      timestamp: Date.now(),
      student_id: session?.user?.id
    };
    
    setNotes(prev => [newNote, ...prev]);
    setNoteTitleInput("");
    setNoteContentInput("");
    setShowNoteCreator(false);

    if (session) {
      await supabase.from('student_notes').insert(newNote as any);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('student_notes').delete().eq('id', id);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result && typeof result === 'string') {
        const newNote = {
          id: `n-${Date.now()}`,
          type: "photo",
          title: file.name.replace(/\.[^.]+$/, "") || "Paper Note",
          content: result,
          timestamp: Date.now()
        };
        setNotes(prev => [newNote, ...prev]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Clear input value
  };

  const formatNoteTime = (time: number) => {
    const diff = Date.now() - time;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  // KBC state
  const [kbcPoints, setKbcPoints] = useState(0);
  const [kbcTimer, setKbcTimer] = useState(30);
  const [isKbcLocked, setIsKbcLocked] = useState(false);
  const [lockedOption, setLockedOption] = useState<string | null>(null);
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineFlipUsed, setLifelineFlipUsed] = useState(false);
  const [removedOptions, setRemovedOptions] = useState<string[]>([]);
  const [isRevealingLock, setIsRevealingLock] = useState(false);

  // Screening tracking
  const [screeningIndex, setScreeningIndex] = useState(0);
  const [screeningSelections, setScreeningSelections] = useState<Record<string, string>>({});

  // Mentor tracking
  const [mentorExpertise, setMentorExpertise] = useState("");
  const [mentorQuizIndex, setMentorQuizIndex] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [expandedStudents, setExpandedStudents] = useState<string[]>([]);
  const [realStudents, setRealStudents] = useState<any[]>([]);


  // Student Course Catalog State
  const [isCourseCatalogOpen, setIsCourseCatalogOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [studentEnrollments, setStudentEnrollments] = useState<any[]>([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  // Student Custom Todos State
  const [customTodos, setCustomTodos] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mentorhub_student_todos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error loading todos:", e);
        }
      }
    }
    return [
      { id: "todo-1", title: "Review React components", notes: "Focus on hooks and state management", status: "Pending" },
      { id: "todo-2", title: "Complete Git cheat sheet", notes: "Create a reference guide for commands", status: "Completed" }
    ];
  });
  
  const [isTodoSheetOpen, setIsTodoSheetOpen] = useState(false);
  const [todoTitleInput, setTodoTitleInput] = useState("");
  const [todoNotesInput, setTodoNotesInput] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mentorhub_student_todos', JSON.stringify(customTodos));
    }
  }, [customTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoTitleInput.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    
    const newTodo = {
      id: `todo-${Date.now()}`,
      student_id: session?.user?.id,
      title: todoTitleInput.trim(),
      notes: todoNotesInput.trim() || "No notes added",
      status: "Pending"
    };
    
    setCustomTodos(prev => [newTodo, ...prev]);
    setTodoTitleInput("");
    setTodoNotesInput("");
    setIsTodoSheetOpen(false);

    if (session) {
      await supabase.from('custom_todos').insert(newTodo as any);
    }
  };

  const handleToggleTodoStatus = async (todoId: string) => {
    const updated = customTodos.find(t => t.id === todoId);
    if (!updated) return;
    const nextStatus = updated.status === 'Completed' ? 'Pending' : 'Completed';
    
    setCustomTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { ...todo, status: nextStatus } 
        : todo
    ));

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('custom_todos').update({ status: nextStatus }).eq('id', todoId);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    setCustomTodos(prev => prev.filter(todo => todo.id !== todoId));
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('custom_todos').delete().eq('id', todoId);
    }
  };

  useEffect(() => {
    const loadInspiration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Fetch any active/sent inspirations from DB
          const { data: dbInspirations } = await supabase
            .from('inspirations')
            .select('*')
            .eq('sent', true)
            .order('sent_at', { ascending: false });

          if (dbInspirations && dbInspirations.length > 0) {
            // Get read/dismissed inspirations for this student
            const { data: readPosts } = await supabase
              .from('inspiration_reads')
              .select('post_id')
              .eq('student_id', session.user.id);

            const readIds = readPosts ? readPosts.map(r => r.post_id) : [];
            const unread = dbInspirations.filter(insp => !readIds.includes(insp.id));

            if (unread.length > 0) {
              const latest = unread[0];
              
              // Resolve author name from profiles if mentor_id is present
              let authorName = "Mentor";
              if (latest.mentor_id) {
                const { data: mProfile } = await supabase.from('profiles').select('name').eq('id', latest.mentor_id).maybeSingle();
                if (mProfile?.name) authorName = mProfile.name;
              }

              setActiveInspiration({
                id: latest.id,
                type: latest.type === "morning" ? "thought" : "reflection",
                message: latest.content,
                author: authorName,
                isDb: true
              });
              return;
            }
          }
        }

        // Fallback to localStorage if no DB inspiration is active
        const stored = localStorage.getItem("mentorhub_inspiration_messages");
        if (stored) {
          const list = JSON.parse(stored);
          const active = list.filter((s: any) => !s.dismissed).pop();
          if (active) {
            setActiveInspiration(active);
            return;
          }
        }
        setActiveInspiration(null);
      } catch (err) {
        console.error("Failed to load inspiration", err);
      }
    };

    loadInspiration();
    window.addEventListener("storage", loadInspiration);
    return () => window.removeEventListener("storage", loadInspiration);
  }, [state]);

  const dismissInspiration = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && activeInspiration?.isDb) {
        // Insert record to mark as read/dismissed for this student
        const { error } = await supabase.from('inspiration_reads').insert({
          post_id: id,
          student_id: session.user.id,
          saved: false
        });
        if (error) console.error("Error saving inspiration read status:", error);
        
        // Trigger reload
        setActiveInspiration(null);
        return;
      }

      // Legacy fallback
      const stored = localStorage.getItem("mentorhub_inspiration_messages");
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map((item: any) => {
          if (item.id === id) {
            return { ...item, dismissed: true };
          }
          return item;
        });
        localStorage.setItem("mentorhub_inspiration_messages", JSON.stringify(updated));
        setActiveInspiration(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    if (state === "DASHBOARD_MAIN") {
      const fetchDashboardData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        // 1. Fetch Mentor Mapping
        const { data: mapping } = await supabase.from('mapping')
          .select('mentor_id')
          .eq('student_id', session.user.id)
          .maybeSingle();
        
        if (mapping && mapping.mentor_id) {
          const { data: mentorProfile } = await supabase.from('profiles')
            .select('*')
            .eq('id', mapping.mentor_id)
            .maybeSingle();
          if (mentorProfile) setMappedMentor(mentorProfile);
        }

        // 2. Fetch Enrollments & Courses
        const { data: enrollments } = await supabase.from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', session.user.id)
          .eq('status', 'Active')
          .order('enrolled_at', { ascending: false });

        if (enrollments && enrollments.length > 0) {
          setStudentEnrollments(enrollments);
          const enrollment = enrollments[0];
          setEnrollmentId(enrollment.id);
          setEnrolledCourse(enrollment.course);
          setCourseProgress((enrollment.progress as string[]) || []);
        } else {
          setStudentEnrollments([]);
          setEnrollmentId(null);
          setEnrolledCourse(null);
          setCourseProgress([]);
        }

        // Merge Local Enrollments (fallback for DB schema issues)
        const localEnrollmentsStr = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
        if (localEnrollmentsStr) {
          try {
            const localEnrs = JSON.parse(localEnrollmentsStr);
            setStudentEnrollments(prev => {
              const combined = [...prev];
              localEnrs.forEach((le: any) => {
                if (!combined.some(c => c.id === le.id)) {
                  combined.unshift(le);
                }
              });
              return combined;
            });
            // If no active enrollment from DB, pick the latest local one
            if (!enrollments || enrollments.length === 0) {
              const latestLocal = localEnrs[0];
              if (latestLocal) {
                setEnrollmentId(latestLocal.id);
                setEnrolledCourse(latestLocal.course);
                setCourseProgress(latestLocal.progress || []);
              }
            }
          } catch (e) {
            console.error("Failed to parse local enrollments", e);
          }
        }

        // Fetch all DB courses to combine with mentorCoursesCatalog
        const { data: dbCourses } = await supabase.from('courses').select('*');
        const localCatalog = mentorCoursesCatalog;
        const combined = [
          ...(dbCourses || []).map(c => ({
            ...c,
            modules: c.content || []
          })),
          ...localCatalog.filter(c => !(dbCourses || []).some(sc => sc.title === c.title))
        ];
        setAvailableCourses(combined);

        // Fetch student scheduled sessions
        const { data: sessData } = await supabase.from('sessions')
          .select('*')
          .eq('student_id', session.user.id)
          .order('scheduled_at', { ascending: true });
        if (sessData) setStudentSessions(sessData);

        // 3. Fetch Messages
        const { data: msgs } = await supabase.from('messages')
          .select('*')
          .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
          .order('created_at', { ascending: true });
        if (msgs) setMessages(msgs);

        // Setup real-time listener for messages
        const channel = supabase
          .channel('messages-changes')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `to_user_id=eq.${session.user.id}` },
            (payload) => {
              setMessages(prev => [...prev, payload.new]);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      };
      fetchDashboardData();
    }
  }, [state]);

  useEffect(() => {
    if (state === "GAMES") {
      const fetchGames = async () => {
        const { data, error } = await supabase.from('games_quizzes').select('*');
        if (data && data.length > 0) {
          setGamesList(data);
        } else {
          setGamesList([
            {
              id: 'fallback-s&l-1',
              title: 'Snake & Ladder: Python Basics',
              description: 'A fun way to test your Python knowledge.',
              type: 'Quiz',
              is_active: true,
              questions: [
                { q: "Which of these is a Python data type?", options: ["List", "Array", "Vector"], answer: "List" },
                { q: "How do you define a function in Python?", options: ["def myFunc():", "function myFunc():", "func myFunc():"], answer: "def myFunc():" }
              ]
            }
          ]);
        }
      };
      fetchGames();
    }
  }, [state]);

  useEffect(() => {
    if (state === "GAMES" && isPlayingGame && gameTurn === "ai" && gameStatus === "playing") {
      const timer = setTimeout(() => {
        const roll = Math.floor(Math.random() * 3) + 1;
        setDiceValue(roll);
        
        let newPos = aiPosition + roll;
        
        if (newPos >= 20) {
          newPos = 20;
          setAiPosition(20);
          setGameStatus("lost");
          return;
        }
        
        const ladders: Record<number, number> = { 3: 11, 8: 15 };
        const snakes: Record<number, number> = { 12: 4, 17: 9 };
        
        if (ladders[newPos]) {
          newPos = ladders[newPos];
        } else if (snakes[newPos]) {
          newPos = snakes[newPos];
        }
        
        setAiPosition(newPos);
        
        // Return to player turn
        setGameTurn("player");
        setIsQuestionAnswered(false);
        setSelectedGameAnswerOption(null);
        if (activePlayableGame && activePlayableGame.questions) {
          setCurrentGameQuestionIndex(prev => (prev + 1) % activePlayableGame.questions.length);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, isPlayingGame, gameTurn, gameStatus, aiPosition, activePlayableGame]);

  useEffect(() => {
    let timerId: any = null;
    if (state === "GAMES" && isPlayingGame && activePlayableGame?.title?.includes("KBC") && gameStatus === "playing" && !isQuestionAnswered && !isKbcLocked) {
      timerId = setInterval(() => {
        setKbcTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            setGameStatus("lost");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [state, isPlayingGame, activePlayableGame, gameStatus, isQuestionAnswered, isKbcLocked, currentGameQuestionIndex]);

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
            if (profile.name) setName(profile.name);
            const prefs = (profile.preferences as any) || {};
            if (typeof prefs.coins === 'number') {
              setCoinsCount(prefs.coins);
            }
            setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
          } else {
            setState("ROLE");
          }
        }
      } catch (e) {
        console.error("Session check error", e);
      }
    };
    checkActiveSession();
  }, []);

  const updateCoinsInDb = async (newCoins: number) => {
    setCoinsCount(newCoins);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from('profiles').select('xp').eq('id', session.user.id).maybeSingle();
      const currentXp = profile?.xp || 0;
      const currentCoins = coinsCount;
      const coinDelta = newCoins - currentCoins;

      await supabase.from('profiles').update({
        coins: newCoins,
        xp: currentXp + (coinDelta > 0 ? coinDelta * 10 : 0) // earn 10 XP for every new coin
      }).eq('id', session.user.id);
    }
  };

  const handlePlayComplete = async (game: "snakes" | "ludo" | "kbc", score: number, coinsEarned: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Log game play session
      const { error: gameErr } = await supabase.from('games').insert({
        user_id: session.user.id,
        game_type: game,
        score: score,
        coins_earned: coinsEarned,
        metadata: { completed_at: new Date().toISOString() }
      });
      if (gameErr) console.error("Error logging game session:", gameErr);

      // 2. Log quiz results if game contains questions
      if (game === "snakes" || game === "ludo") {
        const { error: quizErr } = await supabase.from('quiz_results').insert({
          user_id: session.user.id,
          module_id: game === "snakes" ? "snakes_ladders_game" : "ludo_quiz_game",
          score: score,
          total_questions: game === "snakes" ? 12 : 8,
          coins_earned: coinsEarned
        });
        if (quizErr) console.error("Error logging quiz results:", quizErr);
      }

      // 3. Increment streak and award XP for completing the game
      const { data: profile } = await supabase.from('profiles').select('streak, xp').eq('id', session.user.id).maybeSingle();
      if (profile) {
        const currentStreak = profile.streak ?? 1;
        const currentXp = profile.xp ?? 0;

        const nextXp = currentXp + 50; // Award flat 50 XP for finishing a game!
        const nextStreak = currentStreak + 1;

        await supabase.from('profiles').update({
          xp: nextXp,
          streak: nextStreak
        }).eq('id', session.user.id);
      }
    } catch (e) {
      console.error("Error handling play complete", e);
    }
  };

  const handleToggleActivity = async (activityId: string) => {
    if (!enrollmentId) return;
    
    const isAdding = !courseProgress.includes(activityId);
    const newProgress = isAdding
      ? [...courseProgress, activityId]
      : courseProgress.filter(id => id !== activityId);
    
    setCourseProgress(newProgress);
    
    const { error } = await supabase.from('enrollments')
      .update({ progress: newProgress })
      .eq('id', enrollmentId);
    
    if (error) {
      console.error("Error updating progress:", error);
    } else {
      const coinDelta = isAdding ? 1 : -1;
      const nextCoins = Math.max(0, coinsCount + coinDelta);
      await updateCoinsInDb(nextCoins);
    }
  };

  const handleToggleSessionStatus = async (sessId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Scheduled' : 'Completed';
    
    const { error } = await supabase.from('sessions')
      .update({ status: newStatus })
      .eq('id', sessId);

    if (error) {
      console.error("Error updating session status:", error);
      alert("Error updating session status: " + error.message);
      return;
    }

    setStudentSessions(prev => prev.map(s => s.id === sessId ? { ...s, status: newStatus } : s));

    const isCompleting = newStatus === 'Completed';
    const coinDelta = isCompleting ? 1 : -1;
    const nextCoins = Math.max(0, coinsCount + coinDelta);
    await updateCoinsInDb(nextCoins);
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (!scheduleTitle.trim()) {
      alert("Please enter a title for the session.");
      return;
    }

    const scheduledAtStr = `${scheduleDate}T${scheduleTime}:00`;

    const { data, error } = await supabase.from('sessions').insert({
      student_id: session.user.id,
      mentor_id: mappedMentor?.id || null,
      title: scheduleTitle,
      notes: scheduleNotes,
      duration_minutes: Number(scheduleDuration),
      scheduled_at: scheduledAtStr,
      status: 'Scheduled'
    }).select().single();

    if (error) {
      alert("Error scheduling session: " + error.message);
    } else {
      setStudentSessions(prev => [...prev, data]);
      setIsSchedulingModalOpen(false);
      setScheduleTitle("");
      setScheduleNotes("");
      setScheduleDate("");
      setScheduleTime("");
      alert("Session scheduled successfully!");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        }
      });
      
      if (error) {
        console.error("Google Auth Error:", error);
        setAuthError(error.message);
      }
    } catch (e) {
      console.error(e);
      setAuthError("Failed to initiate Google Sign-In.");
    } finally {
      setAuthLoading(false);
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

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    if (!mappedMentor) {
      alert("No mentor assigned yet. Please wait for an admin to match you with a mentor.");
      return;
    }

    setSendLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSendLoading(false);
      return;
    }

    const newMessage = {
      from_user_id: session.user.id,
      to_user_id: mappedMentor.id,
      body: messageInput,
      sender_name: name || email.split('@')[0],
      is_read: false
    };

    const { data, error } = await supabase.from('messages').insert(newMessage as any).select().single();
    
    setSendLoading(false);
    if (data) {
      setMessages(prev => [...prev, data]);
      setMessageInput("");
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } else if (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message: " + error.message);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    const { error } = await supabase.from('messages').delete().eq('id', msgId);
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } else {
      alert("Error deleting message: " + error.message);
    }
  };

  const handleStudentEnrollCourse = async (courseObj: any, isOverride: boolean = false) => {
    if (isOverride) {
      const confirm = window.confirm(`Are you sure you want to override "${courseObj.title}"? This will reset all your progress for this course.`);
      if (!confirm) return;
    }

    setEnrollingCourseId(courseObj.id);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setEnrollingCourseId(null);
      return;
    }

    let actualCourseId = courseObj.id;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(actualCourseId);

    if (!isUUID) {
      // Create course record in DB first if catalog mock course is being enrolled
      const payload = {
        title: courseObj.title,
        index_code: courseObj.shortTitle || courseObj.title.slice(0, 15),
        description: courseObj.description,
        content: courseObj.modules,
        status: 'Active'
      };

      const { data: newCourse, error } = await supabase.from('courses').insert(payload).select().single();
      if (error) {
        console.warn("DB Course creation failed, falling back to local mode:", error.message);
        actualCourseId = `local-course-${Date.now()}`;
      } else {
        actualCourseId = newCourse.id;
      }
    }

    // Handle Override cleanup
    if (isOverride) {
      // Clear local progress
      localStorage.removeItem(`course_progress_${courseObj.title}`);
      
      // Remove from local enrollments
      const localEnrollmentsStr = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
      if (localEnrollmentsStr) {
        const localEnrollments = JSON.parse(localEnrollmentsStr);
        const filtered = localEnrollments.filter((le: any) => le.course.title !== courseObj.title);
        localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(filtered));
      }

      // Delete from DB
      await supabase.from('enrollments')
        .delete()
        .eq('student_id', session.user.id)
        .eq('course_id', actualCourseId);
    } else {
      // Standard check if already enrolled
      const localEnrollmentsStr = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
      const localEnrollments = localEnrollmentsStr ? JSON.parse(localEnrollmentsStr) : [];
      
      const isAlreadyLocal = localEnrollments.some((le: any) => le.course.title === courseObj.title);
      if (isAlreadyLocal) {
        setEnrollingCourseId(null);
        alert("You are already enrolled in this course! Use the override option if you want to restart.");
        return;
      }

      const { data: existing } = await supabase.from('enrollments')
        .select('*')
        .eq('student_id', session.user.id)
        .eq('course_id', actualCourseId)
        .eq('status', 'Active');

      if (existing && existing.length > 0) {
        setEnrollingCourseId(null);
        alert("You are already enrolled in this course! Use the override option if you want to restart.");
        return;
      }
    }

    const enrollmentPayload = {
      student_id: session.user.id,
      course_id: actualCourseId,
      status: 'Active',
      progress: []
    };

    let enrollData: any = null;
    const { data: dbEnrollData, error: enrollErr } = await supabase.from('enrollments')
      .insert(enrollmentPayload)
      .select('*, course:courses(*)')
      .single();

    if (enrollErr) {
      console.warn("DB Enrollment failed, completing locally:", enrollErr.message);
      // Fallback: Create mock enrollment object
      enrollData = {
        id: `local-enr-${Date.now()}`,
        student_id: session.user.id,
        course_id: actualCourseId,
        status: 'Active',
        progress: [],
        enrolled_at: new Date().toISOString(),
        course: {
          ...courseObj,
          id: actualCourseId,
          modules: courseObj.modules || []
        }
      };
      
      // Save to localStorage
      const updatedLocal = [enrollData, ...localEnrollments];
      localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(updatedLocal));
    } else {
      enrollData = dbEnrollData;
    }

    setEnrollingCourseId(null);
    alert("Successfully enrolled in " + courseObj.title + "!");
    setIsCourseCatalogOpen(false);
    
    if (enrollData) {
      setStudentEnrollments(prev => {
        const exists = prev.some(e => e.id === enrollData.id);
        return exists ? prev : [enrollData, ...prev];
      });
      setEnrollmentId(enrollData.id);
      setEnrolledCourse(enrollData.course);
      setCourseProgress(enrollData.progress || []);
      setState("COURSE_DETAILS"); // Redirect to details immediately
    }
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
        if (profile) {
          if (profile.name) setName(profile.name);
          setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
        } else setState("ROLE");
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
      const userId = session?.user?.id;
      if (!userId) return;

      const profileData = {
        id: userId,
        name,
        email,
        role: userRole,
        expertise: mentorExpertise,
        preferences: Object.keys(selections).length > 0 ? selections : screeningSelections,
        coins: 0,
        streak: 1,
        xp: 10
      };
      const { error } = await supabase.from('profiles').upsert(profileData);
      if (error) console.error("Supabase Profile Save Error:", error);

      // Save to onboarding_answers table for STUDENT
      if (userRole === "STUDENT") {
        const combinedAnswers = {
          quiz: selections,
          screening: screeningSelections
        };
        const { error: answersError } = await supabase.from('onboarding_answers').insert({
          user_id: userId,
          answers: combinedAnswers
        });
        if (answersError) console.error("Supabase onboarding_answers Save Error:", answersError);
      }
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
  const variants: any = {
    initial: { opacity: 0, scale: 0.96, y: 15, filter: "blur(4px)" },
    enter: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.96, y: -15, filter: "blur(4px)", transition: { duration: 0.4, ease: "easeIn" } },
  };

  // Header Component
  const LogoHeader = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-600 text-white p-4 rounded-3xl mb-4 shadow-xl shadow-orange-500/20 hover:scale-105 hover:rotate-3 transition-all duration-300">
        <Sparkles className="w-10 h-10 animate-pulse" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl font-bold font-volkhov text-slate-900 mb-1 tracking-tight">Learning Place</h1>
      <p className="text-slate-400 text-xs font-semibold font-mulish uppercase tracking-widest">at MentorHub</p>
    </div>
  );

  const isDashboard = ["DASHBOARD_MAIN", "DASHBOARD_AWAITING", "COURSE_DETAILS", "GAMES", "NOTES", "PROFILE", "MENTOR_MATCHING", "MENTOR_DASHBOARD", "MENTOR_STUDENTS", "MENTOR_COURSES", "MENTOR_NOTES", "MENTOR_CIRCLE", "MENTOR_ACCOUNT", "PORTFOLIO", "WELLNESS", "FACTS", "GRATITUDE_WALL", "MESSAGES"].includes(state);

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-0 md:p-6 selection:bg-orange-200 font-inter">
      <div className={`w-full ${isDashboard ? 'max-w-7xl h-screen md:h-[calc(100vh-3rem)] rounded-none md:rounded-3xl bg-white/90 backdrop-blur-3xl border-slate-200/50' : 'w-full md:max-w-lg h-screen md:h-auto md:max-h-[90vh] rounded-none md:rounded-[1.5rem] bg-white/70 backdrop-blur-2xl border-white/60 premium-shadow'} overflow-hidden relative flex flex-col md:border transition-all duration-500 ease-out`}>

        <div className={`flex-1 relative overflow-hidden ${isDashboard ? 'px-0 pt-0 pb-0' : 'px-8 py-8 flex flex-col justify-center'}`}>
          <AnimatePresence mode="wait">
            {state === "LOGIN" && (
              <motion.div key="login" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center gap-6">
                <div className="mb-2"><LogoHeader /></div>
                <div className="flex flex-col gap-3.5">
                  <Button className="h-[54px] rounded-2xl text-[15px] font-bold font-mulish bg-[#0f172a] hover:bg-[#1e293b] active:scale-98 transition-all text-white border-0 shadow-lg shadow-slate-950/10 flex items-center justify-center gap-2" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNIN"); }}>
                    <Mail className="w-5 h-5" /> Sign In with Email
                  </Button>
                  <Button variant="outline" className="h-[54px] rounded-2xl text-[15px] font-bold font-mulish border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md active:scale-98 transition-all" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNUP"); }}>
                    Create New Account
                  </Button>
                </div>
                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[11px] text-slate-400 font-bold font-mulish uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <Button variant="outline" className="h-[54px] rounded-2xl text-[15px] font-bold font-mulish border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5" onClick={handleGoogleSignIn}>
                  <GoogleIcon /> Continue with Google
                </Button>
                <button 
                  onClick={() => setState("ROLE")} 
                  className="text-[13px] text-slate-400 font-bold hover:text-slate-600 hover:underline transition-all mt-2"
                >
                  Skip to Test Questionnaire
                </button>
              </motion.div>
            )}

            {state === "SIGNIN" && (
              <motion.div key="signin" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center">
                <div className="mb-2 shrink-0"><button onClick={() => setState("LOGIN")} className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 transition-all shrink-0"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1 ml-1 shrink-0">
                  <h2 className="text-3xl font-bold font-volkhov text-slate-900">Welcome Back</h2>
                  <p className="text-sm font-medium text-slate-400 font-mulish uppercase tracking-wider">Sign in to your learning vault</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Email Address</Label>
                    <Input type="email" placeholder="you@example.com" className="h-[52px] rounded-2xl border-slate-200 placeholder:text-slate-400 text-[15px] px-4.5 bg-white/40 focus-visible:ring-slate-950" value={authEmail} onChange={(e) => { setAuthEmail(e.target.value); setAuthError(""); }} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Password</Label>
                    <Input type="password" placeholder="••••••••" className="h-[52px] rounded-2xl border-slate-200 placeholder:text-slate-400 text-[15px] px-4.5 bg-white/40 focus-visible:ring-slate-950" value={authPassword} onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSignIn()} />
                  </div>
                  {authError && authError !== "confirm-email" && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl px-4.5 py-3.5 text-[13px] text-red-600 font-medium leading-relaxed">{authError}</div>
                  )}
                  <Button disabled={authLoading || !authEmail.includes("@") || !authPassword} className="h-[54px] rounded-2xl text-[15px] font-bold font-mulish bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-100 disabled:text-slate-400 active:scale-98 transition-all mt-2 flex items-center justify-center gap-1.5 shadow-lg shadow-slate-950/10" onClick={handleSignIn}>
                    {authLoading ? "Verifying Credentials…" : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                  <p className="text-[13px] text-slate-400 text-center mt-2.5">
                    Don't have an account?{" "}
                    <button className="text-[#0f172a] font-bold hover:underline" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNUP"); }}>Create one</button>
                  </p>
                </div>
              </motion.div>
            )}

            {state === "SIGNUP" && (
              <motion.div key="signup" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center">
                <div className="mb-2 shrink-0"><button onClick={() => setState("LOGIN")} className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 transition-all shrink-0"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1 ml-1 shrink-0">
                  <h2 className="text-3xl font-bold font-volkhov text-slate-900">Create Account</h2>
                  <p className="text-sm font-medium text-slate-400 font-mulish uppercase tracking-wider">Start your personalized education path</p>
                </div>
                {authError === "confirm-email" ? (
                  <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-3xl p-6 flex flex-col items-center text-center gap-3">
                    <ShieldCheck className="w-12 h-12 text-[#059669] animate-bounce" />
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Check your email</p>
                      <p className="text-[13px] text-slate-500 leading-relaxed">We sent a confirmation link to <span className="font-semibold text-slate-700">{authEmail}</span>. Click it to activate your account.</p>
                    </div>
                    <button className="text-[13px] text-slate-500 hover:text-slate-700 mt-2 font-semibold hover:underline" onClick={() => { setAuthError(""); setState("SIGNIN"); }}>Back to sign in</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Email Address</Label>
                      <Input type="email" placeholder="you@example.com" className="h-[52px] rounded-2xl border-slate-200 placeholder:text-slate-400 text-[15px] px-4.5 bg-white/40 focus-visible:ring-slate-950" value={authEmail} onChange={(e) => { setAuthEmail(e.target.value); setAuthError(""); }} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Password <span className="text-slate-400 font-normal">(min. 6 characters)</span></Label>
                      <Input type="password" placeholder="••••••••" className="h-[52px] rounded-2xl border-slate-200 placeholder:text-slate-400 text-[15px] px-4.5 bg-white/40 focus-visible:ring-slate-950" value={authPassword} onChange={(e) => { setAuthPassword(e.target.value); setAuthError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSignUp()} />
                    </div>
                    {authError && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl px-4.5 py-3.5 text-[13px] text-red-600 font-medium leading-relaxed">{authError}</div>
                    )}
                    <Button disabled={authLoading || !authEmail.includes("@") || authPassword.length < 6} className="h-[54px] rounded-2xl text-[15px] font-bold font-mulish bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-100 disabled:text-slate-400 active:scale-98 transition-all mt-2 flex items-center justify-center gap-1.5 shadow-lg shadow-slate-950/10" onClick={handleSignUp}>
                      {authLoading ? "Creating Account…" : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                    </Button>
                    <p className="text-[13px] text-slate-400 text-center mt-2.5">
                      Already have an account?{" "}
                      <button className="text-[#0f172a] font-bold hover:underline" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNIN"); }}>Sign in</button>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {state === "ROLE" && (
              <motion.div key="role" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-2 justify-center">
                <div className="mb-2 shrink-0"><button onClick={() => setState("LOGIN")} className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 transition-all shrink-0"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1.5 ml-1 shrink-0">
                  <h2 className="text-3xl font-bold font-volkhov text-slate-900">I am a...</h2>
                  <p className="text-sm font-medium text-slate-400 font-mulish uppercase tracking-wider">Choose your path to get started</p>
                </div>
                <div className="flex flex-col gap-4.5 mb-6">
                  {["STUDENT", "MENTOR"].map((r) => (
                    <button key={r} onClick={() => setRole(r as "STUDENT"|"MENTOR")} className={`flex items-center gap-5 p-5 rounded-[1.5rem] border text-left transition-all duration-300 active:scale-98 ${role === r ? "border-slate-950 bg-slate-50 shadow-md ring-1 ring-slate-950" : "border-slate-100 hover:border-slate-200 bg-white/40 hover:bg-white"}`}>
                      <div className={`p-4 rounded-2xl shrink-0 transition-all ${role === r ? "bg-slate-950 text-white shadow-md rotate-3" : "bg-slate-100 text-slate-500"}`}>
                        {r === "STUDENT" ? <GraduationCap className="w-7 h-7" /> : <Users className="w-7 h-7" />}
                      </div>
                      <div>
                        <h3 className={`text-[17px] font-bold font-mulish mb-0.5 transition-colors ${role === r ? "text-slate-950" : "text-slate-700"}`}>{r === "STUDENT" ? "Student" : "Mentor"}</h3>
                        <p className="text-[13px] text-slate-400 leading-relaxed font-medium">{r === "STUDENT" ? "Find an expert mentor and level up your skills." : "Share your engineering expertise and guide others."}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-auto shrink-0">
                  <Button disabled={!role} onClick={() => { setState(role === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE") }} className={`w-full h-[54px] rounded-2xl text-[15px] font-bold font-mulish transition-all shadow-md active:scale-98 ${role ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-100 text-slate-400"}`}>
                    Continue <ArrowRight className="w-4 h-4 ml-1.5" />
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
              <motion.div key="dashboard_awaiting" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-slate-50 -mx-5 px-5 -mt-2 overflow-y-auto hidden-scrollbar pb-32">
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
                          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl"><Mail className="w-5 h-5" /></div>
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

            { (state === "DASHBOARD_MAIN" || state === "COURSE_DETAILS" || state === "GAMES" || state === "NOTES" || state === "PROFILE" || state === "PORTFOLIO" || state === "WELLNESS" || state === "FACTS" || state === "GRATITUDE_WALL" || state === "MESSAGES") && (
              <motion.div key="student_portal" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col bg-slate-50/50 mesh-bg">
                <div className="flex-1 overflow-y-auto hidden-scrollbar px-5 pb-6">
            
            {state === "MESSAGES" && (
              <div className="flex flex-col h-full bg-white font-inter animate-in fade-in slide-in-from-right duration-300 -mx-5">
                {/* Header */}
                <div className="px-5 pt-6 pb-4 border-b border-slate-100 flex items-center gap-4 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setState("DASHBOARD_MAIN")}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Button>
                  <div className="flex-1">
                    <h2 className="text-[17px] font-bold text-slate-900 leading-tight">Conversation</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {mappedMentor ? `With ${mappedMentor.name}` : "Mentor Chat"}
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mappedMentor?.id || 'mentor'}`} alt="mentor" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 hidden-scrollbar bg-slate-50/40">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <p className="text-slate-800 font-bold text-[15px]">No messages yet</p>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">Start the conversation with your mentor to get guidance on your learning path.</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.from_user_id === mappedMentor?.id ? false : true;
                      return (
                        <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative animate-in fade-in slide-in-from-bottom-2 duration-300`} style={{ animationDelay: `${i * 50}ms` }}>
                          <div className="flex items-center gap-2 max-w-[85%]">
                            {isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity" title="Delete Message"><Trash2 className="w-4 h-4" /></button>}
                            <div className={`px-5 py-3.5 rounded-[1.5rem] text-[14.5px] font-medium leading-relaxed ${isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-lg shadow-slate-900/5' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                              {msg.body}
                            </div>
                            {!isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity" title="Delete Message"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                          <span className="text-[10px] font-bold text-slate-300 font-mulish uppercase tracking-wider mt-2 ml-3 mr-3">{isMe ? 'You' : mappedMentor?.name || 'Mentor'}</span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0 pb-8">
                   <div className="flex gap-3 items-end">
                    <Textarea 
                      value={messageInput}
                      disabled={sendLoading}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-slate-200 rounded-[1.5rem] px-5 py-3.5 bg-slate-50 text-[14.5px] text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 min-h-[56px] max-h-32 resize-none shadow-inner"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={sendLoading || !messageInput.trim()}
                      className={`${messageInput.trim() && !sendLoading ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10' : 'bg-slate-100 text-slate-400'} w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0 disabled:opacity-50`}
                    >
                      {sendLoading ? (
                        <div className="w-5 h-5 border-3 border-slate-400 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-6 h-6" strokeWidth={2.5} />
                      )}
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-4 font-medium italic">Shift + Enter for new line</p>
                </div>
              </div>
            )}

            {state === "DASHBOARD_MAIN" &&
              <div className="flex flex-col pt-0 relative w-full items-center pb-8 font-inter">
                <div className="w-full max-w-2xl xl:max-w-none xl:grid xl:grid-cols-[2fr_1fr] gap-6 px-5">
                  {/* Left Column */}
                  <div className="flex flex-col">
                
                {/* Premium Welcome Greeting Header */}
                <div className="w-full relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 shrink-0">
                  <div className="space-y-1 pr-16 sm:pr-0">
                    <h2 className="text-2xl font-bold font-volkhov text-slate-900 tracking-tight leading-tight">Welcome Back, {name ? name.split(' ')[0] : 'Student'}! 👋</h2>
                    <p className="text-[13px] font-medium text-slate-400">Step closer to your educational milestones today.</p>
                  </div>
                    <div className="absolute top-1 right-1 flex items-center gap-3 shrink-0 sm:relative sm:top-auto sm:right-auto sm:self-center mr-1">
                     <div className="flex items-center gap-1.5">
                       <Coins className="w-4 h-4 text-amber-500" />
                       <span className="text-sm font-semibold text-slate-600">{coinsCount}</span>
                     </div>
                   </div>
                </div>

                {/* Today's Inspiration & Mentor Chat Card */}
                <Card className="w-full mt-4 relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                  <CardContent className="p-4 pt-5 flex flex-col gap-4">
                    <div className="flex gap-3 w-full relative group/insp">
                      <div className="bg-orange-50 p-3 rounded-2xl text-orange-500 shrink-0 self-start shadow-sm border border-orange-100/50">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-[11px] font-bold font-mulish text-orange-500 uppercase tracking-widest mb-1">
                          {activeInspiration 
                            ? `${activeInspiration.type === "thought" ? "Morning Thought" : "Evening Reflection"} from ${activeInspiration.author}` 
                            : "Today's Inspiration"}
                        </p>
                        <p className="text-[14px] font-medium font-volkhov text-slate-700 italic leading-relaxed">
                          {activeInspiration 
                            ? `"${activeInspiration.message}"` 
                            : '"Education is the most powerful weapon you can use to change the world."'}
                          <span className="text-slate-400 font-sans not-italic block mt-1 font-medium">
                            — {activeInspiration ? activeInspiration.author : "Nelson Mandela"}
                          </span>
                        </p>
                      </div>
                      {activeInspiration && (
                        <button
                          onClick={() => dismissInspiration(activeInspiration.id)}
                          className="absolute top-0 right-0 w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center opacity-0 group-hover/insp:opacity-100"
                          title="Dismiss thought"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="pt-4 border-t border-slate-100/60">
                      {messages.length > 0 && (
                        <div className="mb-2 space-y-3 pr-1">
                          {messages.slice(-1).map((msg, i) => {
                            const isMe = msg.from_user_id === mappedMentor?.id ? false : true;
                            return (
                              <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
                                <div className="flex items-center gap-2 max-w-[85%]">
                                  {isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                  <div className={`px-4 py-2.5 rounded-[1.25rem] text-[13.5px] font-medium leading-relaxed ${isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-sm shadow-slate-900/5' : 'bg-slate-50 text-slate-700 border border-slate-100/60 rounded-tl-none shadow-xs'}`}>
                                    {msg.body}
                                  </div>
                                  {!isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                </div>
                                <span className="text-[10px] font-bold text-slate-300 font-mulish uppercase tracking-wider mt-1 ml-2 mr-2">{isMe ? 'You' : mappedMentor?.name || 'Mentor'}</span>
                              </div>
                            );
                          })}
                          {messages.length > 1 && (
                            <div className="flex justify-center -mt-1">
                              <button 
                                onClick={() => setState("MESSAGES")}
                                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4 py-1.5"
                              >
                                View all messages
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 mb-1 font-medium">
                        {sendSuccess ? (
                          <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Message sent successfully!
                          </span>
                        ) : mappedMentor ? (
                          `Connected with ${mappedMentor.name}`
                        ) : (
                          "Don't hesitate, every question matters."
                        )}
                      </p>
                      <div className="flex gap-2">
                        <Input 
                          value={messageInput}
                          disabled={sendLoading}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder={mappedMentor ? `Ask ${mappedMentor.name}...` : "Ask a quick question..."}
                          className="flex-1 border border-slate-200 rounded-2xl px-4.5 py-3 bg-slate-50/50 text-[14px] text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-950 transition-all disabled:opacity-50 h-11"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={sendLoading || !messageInput.trim()}
                          className={`${messageInput.trim() && !sendLoading ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400'} w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 shrink-0 disabled:opacity-50`}
                        >
                          {sendLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-[18px] h-[18px]" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>


                {enrolledCourse ? (() => {
                  const modules = enrolledCourse.modules || enrolledCourse.content || [];
                  const totalModules = modules.length;
                  const allLessons = modules.reduce((acc: any[], m: any) => [...acc, ...(m.lessons || m.topics || [])], []);
                  const totalLessons = allLessons.length;
                  const completedLessons = courseProgress.length;
                  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                  
                  const completedModules = modules.filter((m: any) => 
                    (m.lessons || m.topics || []).every((l: any) => courseProgress.includes(l.id))
                  ).length;

                  const nextLesson = allLessons.find(l => !courseProgress.includes(l.id));

                  return (
                    <div className="mt-6 flex flex-col">
                      <div className="flex items-center justify-between px-1 mb-3">
                        <div className="flex items-center gap-2">
                           <BookOpenCheck className="w-[18px] h-[18px] text-indigo-500" />
                           <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest font-mulish">Continue Learning</p>
                        </div>
                      </div>
                      
                      <div 
                        onClick={() => setState("COURSE_DETAILS")}
                        className="w-full p-4 bg-white rounded-2xl shadow-xs border border-slate-100 hover:border-indigo-100 transition-all active:scale-[0.98] cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Code className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-slate-900 font-bold text-[15px] truncate">{enrolledCourse.title}</p>
                              <p className="text-slate-400 font-bold text-[13px]">{progressPct}%</p>
                            </div>
                            
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden mb-2.5">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>

                            <div className="flex items-center gap-3 text-[12px] font-bold text-slate-400 tracking-tight">
                              <span>{completedModules}/{totalModules} modules</span>
                              <span className="text-slate-200 font-normal">|</span>
                              <span>{completedLessons}/{totalLessons} lessons</span>
                            </div>
                          </div>
                        </div>

                        {nextLesson && (
                          <div className="mt-2 px-3 py-2.5 bg-slate-50 rounded-xl flex items-center justify-between group/next">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
                                <PlayCircle className="w-3.5 h-3.5 text-indigo-500" />
                              </div>
                              <p className="text-slate-600 font-bold text-[12px]">
                                Next: <span className="text-indigo-600">{nextLesson.title}</span>
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover/next:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })() : (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-white rounded-3xl border border-dashed border-slate-200 mt-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-5">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <h2 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2">No Courses Enrolled</h2>
                    <p className="text-[13px] text-slate-500 font-medium max-w-xs leading-relaxed mb-6">
                      Select a learning path to start your educational journey.
                    </p>
                    <Button onClick={() => setIsCourseCatalogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Browse Catalog
                    </Button>
                  </div>
                )}
              </div>
                  {/* Right Column */}
                  <div className="flex flex-col">
                {/* Todo List / Course Milestones Widget */}
                <div className="w-full mt-4">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <div className="flex items-center gap-2 text-slate-700 font-bold font-mulish text-[15px]">
                      <ListChecks className="w-[18px] h-[18px] text-orange-500" /> Tasks & Milestones
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Button 
                        onClick={() => {
                          const d = new Date();
                          setScheduleDate(d.toISOString().split('T')[0]);
                          setScheduleTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
                          setIsSchedulingModalOpen(true);
                        }}
                        variant="ghost"
                        className="text-xs text-orange-500 hover:text-orange-600 font-bold font-mulish flex items-center gap-1 p-0 h-auto hover:bg-transparent shadow-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> Schedule Session
                      </Button>
                      <span className="text-slate-200">|</span>
                      <Button 
                        onClick={() => {
                          setTodoTitleInput("");
                          setTodoNotesInput("");
                          setIsTodoSheetOpen(true);
                        }}
                        variant="ghost"
                        className="text-xs text-orange-500 hover:text-orange-600 font-bold font-mulish flex items-center gap-1 p-0 h-auto hover:bg-transparent shadow-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Task
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.5rem] border border-slate-100 p-4 space-y-3 shadow-sm">
                    {/* Course Milestones (from Enrolled Course) */}
                    {enrolledCourse && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mulish">Course Milestones</p>
                          <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md font-bold font-mulish">Auto-imported</span>
                        </div>
                        <div className="space-y-2 max-h-[180px] overflow-y-auto hidden-scrollbar pr-1">
                          {(enrolledCourse.content || []).flatMap((mod: any) => 
                            (mod.topics || []).map((topic: string, idx: number) => {
                              const topicId = `${mod.id}-${idx}`;
                              const isCompleted = courseProgress.includes(topicId);
                              return (
                                <div key={topicId} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100/50 transition-all">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div 
                                      onClick={() => handleToggleActivity(topicId)}
                                      className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all shrink-0 ${isCompleted ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 bg-white'}`}
                                    >
                                      {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-[12.5px] font-semibold truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{topic}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-bold font-mulish uppercase shrink-0 px-2 py-0.5 bg-slate-100/50 rounded-md truncate max-w-[80px]">{mod.title}</span>
                                </div>
                              );
                            })
                          ).slice(0, 4)}
                        </div>
                      </div>
                    )}

                    {/* Custom Student Todos */}
                    <div className={cn("space-y-3", enrolledCourse ? "pt-3 border-t border-slate-50" : "")}>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mulish px-1">My Tasks</p>
                      <div className="space-y-2 max-h-[180px] overflow-y-auto hidden-scrollbar pr-1">
                        {customTodos.length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                            <p className="text-xs text-slate-400 font-medium">No custom tasks yet. Click "Add Task" to start!</p>
                          </div>
                        ) : (
                          customTodos.map((todo) => {
                            const isCompleted = todo.status === 'Completed';
                            return (
                              <div key={todo.id} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100/50 transition-all group">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div 
                                    onClick={() => handleToggleTodoStatus(todo.id)}
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all shrink-0 ${isCompleted ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 bg-white'}`}
                                  >
                                    {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
                                  </div>
                                  <div className="min-w-0">
                                    <span className={`text-[12.5px] font-semibold block truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{todo.title}</span>
                                    {todo.notes && <span className="text-[10px] text-slate-400 block truncate leading-tight">{todo.notes}</span>}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Content Rows */}
                <div className="w-full mt-4 space-y-3">
                  
                  {/* Gaming Quiz Row (Redirects directly to GAMES state) */}
                  <div 
                    onClick={() => setState("GAMES")}
                    className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                  >
                    <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-3.5 rounded-2xl mr-4.5 shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all"><Swords className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-bold font-mulish text-slate-800">Learning Arena</p>
                        <span className="bg-[#dcfce7] text-[#166534] text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">Live</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">S&L or KBC points quiz · 300+ coins</p>
                    </div>
                    <div className="flex items-center shrink-0">
                      <div className="flex -space-x-1.5 mr-3">
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover shadow-xs"></div>
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover shadow-xs"></div>
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 bg-[url('https://i.pravatar.cc/100?img=5')] bg-cover shadow-xs"></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Running Notes Row (Redirects to NOTES state) */}
                  <div 
                    onClick={() => setState("NOTES")}
                    className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                  >
                    <div className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><NotebookPen className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-bold font-mulish text-slate-800">Study Notebook</p>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-lato">2</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Text notes & lecture boards</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                   {/* Gratitude Wall */}
                  <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("GRATITUDE_WALL")}>
                    <div className="bg-rose-50 text-rose-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Heart className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-bold font-mulish text-slate-800">Gratitude Wall</p>
                        <span className="text-rose-500 text-[11px] font-bold font-lato">3 / 12</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Send tokens of appreciation</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* My Portfolio */}
                  <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("PORTFOLIO")}>
                    <div className="bg-indigo-50 text-indigo-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Briefcase className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-bold font-mulish text-slate-800">Showcase Portfolio</p>
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-lato">4 projects</span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Build as you learn modules</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* Mental Wellness card */}
                  <div className="bg-gradient-to-r from-[#effdf5] to-[#e0f2fe] rounded-[1.5rem] border border-[#a7f3d0]/30 p-5 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("WELLNESS")}>
                     <div className="flex items-center justify-between relative z-10 mb-3.5">
                       <div className="flex items-center gap-3">
                         <div className="bg-white/75 text-[#14b8a6] p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Heart className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14.5px] font-bold font-mulish text-teal-900">Mental Wellness</p>
                             <span className="bg-teal-100 text-teal-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                           </div>
                           <p className="text-[12px] text-teal-700/70 font-semibold leading-relaxed mt-0.5">Calm Reset · Gratitude Game · Memes</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-teal-500/50 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-teal-800/60 relative z-10 px-1 font-mulish">
                       <span className="flex items-center gap-1">🧘 Brain Recharge</span>
                       <span className="flex items-center gap-1">🙏 Gratitude Points</span>
                       <span className="flex items-center gap-1">😂 Daily Memes</span>
                     </div>
                  </div>

                  {/* Interesting Facts card */}
                  <div className="bg-gradient-to-r from-[#fefce8] to-[#fffbeb] rounded-[1.5rem] border border-[#fde047]/30 p-5 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("FACTS")}>
                     <div className="flex items-center justify-between relative z-10 mb-3.5">
                       <div className="flex items-center gap-3">
                         <div className="bg-amber-100/50 text-amber-600 p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Lightbulb className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14.5px] font-bold font-mulish text-amber-900">Interesting Facts</p>
                             <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                           </div>
                           <p className="text-[12px] text-amber-700/70 font-semibold leading-relaxed mt-0.5">Small facts. Big inspiration.</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-amber-500/50 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-amber-800/60 relative z-10 px-1 font-mulish">
                       <span className="flex items-center gap-1">🧠 Brain & Learning</span>
                       <span className="flex items-center gap-1">💻 Tech & Code</span>
                       <span className="flex items-center gap-1">🏆 Challenges</span>
                     </div>
                  </div>

                  {/* Mentor's Thought of the Day */}
                  <div className="bg-slate-100/50 rounded-[1.5rem] p-5.5 shadow-sm mt-6 border border-slate-100/50 flex flex-col">
                    <div className="flex items-center gap-2 text-slate-700 font-bold font-mulish text-[14px] mb-3.5">
                      <Sun className="w-4 h-4 text-orange-500 animate-spin-slow" strokeWidth={2.5} /> Mentor's Thought of the Day
                    </div>
                    <div className="bg-white rounded-2xl p-4.5 italic text-slate-700 text-[14px] leading-relaxed relative border border-slate-100/30 font-medium font-volkhov shadow-xs">
                      "Consistency beats intensity. Practice a little every day."
                      <span className="block text-slate-400 not-italic text-[12px] font-bold font-mulish uppercase tracking-wider mt-2.5">— Pradeep K.</span>
                    </div>
                    <button className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3.5 rounded-2xl mt-4 font-bold font-mulish text-[13px] flex gap-2 items-center justify-center transition-all active:scale-98 shadow-sm">
                      <Heart className="w-[18px] h-[18px] fill-current text-rose-500 animate-pulse" /> Read & Reflect
                    </button>
                    <div className="flex justify-between items-center mt-4.5 px-1 font-mulish">
                      <p className="text-[12px] font-bold text-orange-500 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> 3-day streak</p>
                      <p className="text-[12px] font-bold text-amber-600 flex items-center gap-1"><Coins className="w-3.5 h-3.5 fill-amber-100" /> +5 XP per reflection</p>
                    </div>
                  </div>
                </div>

                {/* Footer Stats Row */}
                <div className="mt-6 mb-4 flex divide-x divide-slate-100 bg-white rounded-[1.5rem] p-4.5 shadow-sm mx-1 border border-slate-50 font-lato">
                   <div className="flex flex-col items-center flex-1 justify-center">
                     <p className="text-slate-800 font-extrabold text-[22px]">3</p>
                     <p className="text-slate-400 text-[10px] font-extrabold font-mulish uppercase tracking-wider mt-0.5">Day Streak</p>
                   </div>
                   <div className="flex flex-col items-center flex-1 justify-center text-amber-500">
                     <div className="flex items-center gap-1 text-[22px] font-extrabold"><Coins className="w-5 h-5 fill-amber-100 animate-pulse" /> {coinsCount}</div>
                     <p className="text-slate-400 text-[10px] font-extrabold font-mulish uppercase tracking-wider mt-0.5">Coins</p>
                   </div>
                   <div className="flex flex-col items-center flex-1 justify-center">
                     <p className="text-slate-800 font-extrabold text-[22px]">85%</p>
                     <p className="text-slate-400 text-[10px] font-extrabold font-mulish uppercase tracking-wider mt-0.5">Quiz Avg</p>
                   </div>
                </div>
              </div>

                </div>

                {/* Final Quote */}
                <div className="text-center pb-24 px-5 flex flex-col gap-1 items-center mb-6">
                   <p className="text-slate-400/80 italic text-[13px] relative flex gap-2"><Quote className="w-4 h-4 shrink-0 text-slate-300" /> "You're doing great, keep pushing!"</p>
                   <p className="text-slate-300 text-[12px] font-medium ml-6">— Pradeep K.</p>
                </div>
              </div>
            }

            {state === "COURSE_DETAILS" && (
              <div className="w-full h-full bg-white fixed inset-0 z-[60] overflow-hidden flex flex-col">
                {(() => {
                  const extendedCourse = mapToExtendedCourse(enrolledCourse);
                  if (!extendedCourse) return null;
                  return (
                    <CourseDetailsScreen 
                      course={extendedCourse as any}
                      onBack={() => setState("DASHBOARD_MAIN")}
                      actionButtonText="Continue Learning"
                      onActionClick={() => setState("DASHBOARD_MAIN")}
                      secondaryActionButtonText="Change Course"
                      onSecondaryActionClick={() => setIsCourseCatalogOpen(true)}
                    />
                  );
                })()}
              </div>
            )}

            {state === "GAMES" && (
              <div className="flex flex-col pt-0 bg-slate-50 pb-12 -mx-5 px-0 overflow-hidden">
                <StudentGames
                  userName={name || "Student"}
                  userCoins={coinsCount}
                  onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                  onBack={() => setState("DASHBOARD_MAIN")}
                  onPlayComplete={handlePlayComplete}
                />
              </div>
            )}

            {state === "WELLNESS" && (
              <MentalWellness
                coins={coinsCount}
                onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "FACTS" && (
              <InterestingFacts
                coins={coinsCount}
                onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "PORTFOLIO" && (
              <StudentPortfolio
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "GRATITUDE_WALL" && (
              <GratitudeWall
                coins={coinsCount}
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "NOTES" && (
              <div className="flex flex-col pt-0 bg-slate-50 pb-24 relative min-h-[85vh] -mx-5 px-5">
                
                {/* Header */}
                <div className="sticky top-0 bg-slate-50/95 backdrop-blur-md pt-5 pb-4 z-30 px-0 mx-0 flex justify-between items-center border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-100 transition-colors shrink-0">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="text-[16px] font-bold text-slate-800 leading-tight">Running Notes</p>
                      <p className="text-[12px] text-slate-400 font-semibold">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     {/* Hidden File Inputs */}
                     <input 
                       type="file" 
                       id="camera-capture-input" 
                       accept="image/*" 
                       capture="environment" 
                       className="hidden" 
                       onChange={handlePhotoUpload} 
                     />
                     <input 
                       type="file" 
                       id="image-gallery-input" 
                       accept="image/*" 
                       className="hidden" 
                       onChange={handlePhotoUpload} 
                     />
                     
                     <button 
                       onClick={() => document.getElementById('camera-capture-input')?.click()}
                       className="w-10 h-10 rounded-full bg-white border border-slate-150 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
                       title="Capture Paper Note"
                     >
                       <Camera className="w-[18px] h-[18px]" strokeWidth={2.2} />
                     </button>
                     <button 
                       onClick={() => document.getElementById('image-gallery-input')?.click()}
                       className="w-10 h-10 rounded-full bg-white border border-slate-150 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
                       title="Upload Note Photo"
                     >
                       <ImageIcon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                     </button>
                  </div>
                </div>

                <div className="space-y-4 mx-0 relative z-10 px-0 pb-16">
                  {/* Notes Creator Form */}
                  <AnimatePresence>
                    {showNoteCreator && (
                      <motion.div 
                        initial={{ opacity: 0, y: -15, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -15, height: 0 }}
                        className="bg-white rounded-3xl p-5 border border-blue-100 shadow-sm overflow-hidden mb-4 relative"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                            <NotebookPen className="w-4 h-4" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-800">New Running Note</p>
                        </div>
                        
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Note title (optional)" 
                            value={noteTitleInput}
                            onChange={(e) => setNoteTitleInput(e.target.value)}
                            className="w-full text-sm text-slate-800 placeholder-slate-300 bg-slate-50/50 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-100 focus:bg-white border border-slate-150 transition-all"
                          />
                          <textarea 
                            placeholder="Write your note contents here..." 
                            value={noteContentInput}
                            onChange={(e) => setNoteContentInput(e.target.value)}
                            rows={4}
                            autoFocus
                            className="w-full text-sm text-slate-700 placeholder-slate-300 bg-slate-50/50 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-blue-100 focus:bg-white resize-none border border-slate-150 transition-all"
                          />
                          <div className="flex gap-2.5 pt-1">
                            <button 
                              onClick={() => {
                                setShowNoteCreator(false);
                                setNoteTitleInput("");
                                setNoteContentInput("");
                              }}
                              className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all active:scale-[0.98]"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleSaveNote}
                              disabled={!noteContentInput.trim()}
                              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                                noteContentInput.trim() 
                                  ? 'bg-[#0f172a] text-white hover:bg-slate-900 shadow-sm shadow-slate-900/10' 
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" /> Save Note
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty State */}
                  {notes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                        <NotebookPen className="w-7 h-7 text-slate-300" strokeWidth={1.8} />
                      </div>
                      <p className="text-[15px] font-bold text-slate-700">No running notes yet</p>
                      <p className="text-[12px] text-slate-400 mt-1 max-w-[240px] leading-relaxed">Write down thoughts or tap the header icons to save paper notes as photos.</p>
                    </div>
                  )}

                  {/* Notes List */}
                  <AnimatePresence initial={false}>
                    {notes.map((note) => (
                      <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {note.type === "photo" ? (
                          <Card className="bg-white rounded-[1.25rem] border border-slate-100 overflow-hidden shadow-xs hover:shadow-sm transition-all">
                            <CardContent className="p-0">
                              <button 
                                onClick={() => setExpandedPhotoNoteId(expandedPhotoNoteId === note.id ? null : note.id)} 
                                className="w-full relative block text-left animate-in fade-in zoom-in-95 duration-200"
                              >
                                <img 
                                  src={note.content} 
                                  alt={note.title} 
                                  className={`w-full object-cover transition-all duration-300 ${
                                    expandedPhotoNoteId === note.id ? "max-h-[28rem]" : "max-h-36"
                                  }`} 
                                />
                                {expandedPhotoNoteId !== note.id && (
                                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-1 text-[11px] font-bold text-slate-400">
                                    Tap to Expand
                                  </div>
                                )}
                              </button>
                              <div className="px-5 py-4 flex items-center justify-between bg-white border-t border-slate-50">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <Camera className="w-4 h-4 text-orange-400 shrink-0" strokeWidth={2.2} />
                                  <p className="text-[13.5px] font-bold text-slate-800 truncate leading-none">{note.title}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                  <span className="text-slate-350 text-[10.5px] font-medium">{formatNoteTime(note.timestamp)}</span>
                                  <button 
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all"
                                    title="Delete Photo Note"
                                  >
                                    <Trash2 className="w-[15px] h-[15px]" />
                                  </button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-white rounded-[1.25rem] border border-slate-100 overflow-hidden shadow-xs hover:shadow-sm transition-all group">
                            <CardContent className="p-5">
                              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                                 <span className="flex items-center gap-2 text-[14px] font-extrabold text-slate-800">
                                   <FileText className="w-4 h-4 text-blue-400 shrink-0" strokeWidth={2.5}/> 
                                   <span className="truncate max-w-[180px]">{note.title}</span>
                                 </span>
                                 <div className="flex items-center gap-3 shrink-0 ml-4">
                                   <span className="text-[10.5px] text-slate-350 font-medium">{formatNoteTime(note.timestamp)}</span>
                                   <button 
                                     onClick={() => handleDeleteNote(note.id)}
                                     className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                                     title="Delete Note"
                                   >
                                     <Trash2 className="w-[15px] h-[15px]" />
                                   </button>
                                 </div>
                              </div>
                              <p className="text-[13px] text-slate-600 leading-relaxed pr-2 whitespace-pre-wrap">{note.content}</p>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* FAB */}
                {!showNoteCreator && (
                  <button 
                    onClick={() => setShowNoteCreator(true)}
                    className="fixed bottom-28 right-6 w-14 h-14 bg-[#0f172a] hover:bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all z-40 border-2 border-white"
                  >
                    <Plus className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}

            {state === "PROFILE" && (
              <div className="flex flex-col pt-0 bg-slate-50 pb-12 -mx-5 px-0 overflow-hidden">
                
                {/* Purple Top Block */}
                <div className="bg-[#0f172a] pt-8 pb-16 px-5 relative">
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
                       <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-slate-700 shadow-md border-2 border-transparent">
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
                  <Card className="bg-white rounded-3xl border border-slate-100 -mt-12 mb-6">
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[13px] font-medium">
                        <span className="text-slate-600">Profile Completeness</span>
                        <span className="text-rose-500">37%</span>
                      </div>
                      <div className="h-[6px] w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-rose-400 w-[37%] rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>

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
                     <Card size="sm" className="bg-amber-50/50 border border-amber-100/50 shadow-sm py-4">
                       <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                         <Coins className="w-5 h-5 text-amber-500 fill-amber-100" />
                         <div className="text-center">
                           <p className="text-[15px] font-semibold text-slate-800 leading-tight">240</p>
                           <p className="text-[11px] text-slate-500">Coins</p>
                         </div>
                       </CardContent>
                     </Card>
                     <Card size="sm" className="bg-orange-50/50 border border-orange-100/50 shadow-sm py-4">
                       <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                         <Flame className="w-5 h-5 text-orange-500" />
                         <div className="text-center">
                           <p className="text-[15px] font-semibold text-slate-800 leading-tight">3</p>
                           <p className="text-[11px] text-slate-500 whitespace-nowrap">Day Streak</p>
                         </div>
                       </CardContent>
                     </Card>
                     <Card size="sm" className="bg-slate-50/50 border border-slate-100/50 shadow-sm py-4">
                       <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                         <Target className="w-5 h-5 text-slate-500" />
                         <div className="text-center">
                           <p className="text-[15px] font-semibold text-slate-800 leading-tight">85%</p>
                           <p className="text-[11px] text-slate-500">Quiz Avg</p>
                         </div>
                       </CardContent>
                     </Card>
                     <Card size="sm" className="bg-blue-50/50 border border-blue-100/50 shadow-sm py-4">
                       <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                         <BookOpen className="w-5 h-5 text-blue-500" />
                         <div className="text-center">
                           <p className="text-[15px] font-semibold text-slate-800 leading-tight">1</p>
                           <p className="text-[11px] text-slate-500">Courses</p>
                         </div>
                       </CardContent>
                     </Card>
                     <Card size="sm" className="bg-slate-50 border border-slate-100 shadow-sm py-4">
                       <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                         <Briefcase className="w-5 h-5 text-slate-500" />
                         <div className="text-center">
                           <p className="text-[15px] font-semibold text-slate-800 leading-tight">4</p>
                           <p className="text-[11px] text-slate-500">Projects</p>
                         </div>
                       </CardContent>
                     </Card>
                     <Card size="sm" className="bg-emerald-50/50 border border-emerald-100/50 shadow-sm py-4">
                       <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                         <FileText className="w-5 h-5 text-emerald-500" />
                         <div className="text-center">
                           <p className="text-[15px] font-semibold text-slate-800 leading-tight">2</p>
                           <p className="text-[11px] text-slate-500">Notes</p>
                         </div>
                       </CardContent>
                     </Card>
                  </div>
                  
                  {/* Share & Earn */}
                  <Card className="bg-gradient-to-br from-[#fffbeb] to-[#fff7ed] border border-[#fef08a] rounded-3xl">
                     <CardContent className="p-5">
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
                         <Button variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 font-medium text-[13px] px-5 h-12 rounded-xl transition-colors border border-amber-100">
                           <Link className="w-4 h-4 mr-2" /> Copy
                         </Button>
                       </div>

                       <div className="flex gap-2">
                         <Button variant="outline" className="flex-1 h-auto bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-100 transition-colors gap-1.5">
                           <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.5} />
                           <span className="text-[10px] font-medium text-emerald-600">WhatsApp</span>
                         </Button>
                         <Button variant="outline" className="flex-1 h-auto bg-pink-50 text-pink-600 hover:bg-pink-100 flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-100 transition-colors gap-1.5">
                           <Camera className="w-5 h-5 text-pink-600 shrink-0" strokeWidth={2.5} />
                           <span className="text-[10px] font-medium text-pink-600">Instagram</span>
                         </Button>
                         <Button variant="outline" className="flex-1 h-auto bg-slate-100 text-slate-700 hover:bg-slate-200 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 transition-colors gap-1.5">
                           <AtSign className="w-5 h-5 text-slate-700 shrink-0" strokeWidth={2.5} />
                           <span className="text-[10px] font-medium text-slate-700">X / Twitter</span>
                         </Button>
                         <Button variant="outline" className="flex-[0.8] h-auto bg-slate-100 text-slate-500 hover:bg-slate-200 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 transition-colors gap-1.5 relative">
                           <Link className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={2.5} />
                           <span className="text-[10px] font-medium text-slate-500" style={{ whiteSpace: 'nowrap', transform: 'scale(0.85)' }}>Copy Link</span>
                         </Button>
                       </div>
                     </CardContent>
                  </Card>
                  
                  {/* Log Out Option */}
                  <Button variant="destructive" onClick={handleSignOut} className="w-full mt-6 bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium py-3.5 h-12 rounded-2xl flex items-center justify-center gap-2 border border-rose-100 transition-colors shadow-sm">
                    <LogOut className="w-[18px] h-[18px]" strokeWidth={2.5}/> Log Out
                  </Button>

                </div>
              </div>
            )}
                </div>
                
                {/* Bottom Navigation */}
                {state !== "MESSAGES" && (
                  <div className="shrink-0 bg-white border-t border-slate-100 flex justify-between px-5 pt-3 pb-8 sm:rounded-b-2xl">
                    <button onClick={() => setState("DASHBOARD_MAIN")} className={`flex flex-col items-center gap-1 w-12 ${state === "DASHBOARD_MAIN" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Home className="w-5 h-5" strokeWidth={state === "DASHBOARD_MAIN" ? 2.5 : 2}/><span className="text-[10px] font-semibold">Home</span></button>
                    <button onClick={() => setState("COURSE_DETAILS")} className={`flex flex-col items-center gap-1 w-12 ${state === "COURSE_DETAILS" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><BookOpen className="w-5 h-5" strokeWidth={state === "COURSE_DETAILS" ? 2.5 : 2}/><span className="text-[10px] font-medium">Courses</span></button>
                    <button onClick={() => setState("GAMES")} className={`flex flex-col items-center gap-1 w-12 ${state === "GAMES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"} relative`}><Gamepad2 className="w-5 h-5" strokeWidth={state === "GAMES" ? 2.5 : 2}/>{state !== "GAMES" && <div className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}<span className="text-[10px] font-medium">Games</span></button>
                    <button onClick={() => setState("NOTES")} className={`flex flex-col items-center gap-1 w-12 ${state === "NOTES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><NotebookPen className="w-5 h-5" strokeWidth={state === "NOTES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Notes</span></button>
                    <button onClick={() => setState("PROFILE")} className={`flex flex-col items-center gap-1 w-12 ${state === "PROFILE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><User className="w-5 h-5" strokeWidth={state === "PROFILE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Profile</span></button>
                  </div>
                )}

                {/* Scheduling Bottom Sheet */}
                {isSchedulingModalOpen && (
                  <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-xs z-50 flex items-end justify-center transition-all">
                    <div className="bg-white rounded-t-[2rem] w-full sm:max-w-md overflow-hidden shadow-2xl border-t border-slate-100 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-350">
                      
                      {/* Pull handle bar */}
                      <div className="w-full flex justify-center py-2.5 bg-[#0f172a] shrink-0">
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
                      </div>

                      {/* Header */}
                      <div className="bg-[#0f172a] text-white px-5 pb-6 pt-1 relative">
                        <button 
                          onClick={() => setIsSchedulingModalOpen(false)}
                          className="absolute top-2 right-4 text-slate-300 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-[18px] font-bold font-volkhov tracking-tight">Schedule 1:1 Session</h3>
                            <p className="text-[11px] text-slate-400 font-bold font-mulish uppercase tracking-wider">With {mappedMentor?.name || "your Mentor"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleScheduleSession} className="p-6 space-y-4 overflow-y-auto hidden-scrollbar pb-8 font-mulish">
                        
                        {/* Session Title */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Session Title</Label>
                          <Input 
                            value={scheduleTitle}
                            onChange={(e) => setScheduleTitle(e.target.value)}
                            placeholder="e.g. Code Review, Career Guidance"
                            required
                            className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                          />
                        </div>

                        {/* Description / Notes */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Topics / Notes</Label>
                          <Textarea 
                            value={scheduleNotes}
                            onChange={(e) => setScheduleNotes(e.target.value)}
                            placeholder="What would you like to cover during this session?"
                            rows={3}
                            className="rounded-xl border-slate-200 text-sm font-semibold resize-none focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                          />
                        </div>

                        {/* Date and Time Group */}
                        <div className="grid grid-cols-2 gap-4">
                          
                          {/* Date */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Date</Label>
                            <Input 
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              required
                              className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                            />
                          </div>

                          {/* Time */}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Time</Label>
                            <Input 
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              required
                              className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                            />
                          </div>

                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Duration</Label>
                          <select 
                            value={scheduleDuration}
                            onChange={(e) => setScheduleDuration(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
                          >
                            <option value="15">15 minutes (Quick check-in)</option>
                            <option value="30">30 minutes (Standard review)</option>
                            <option value="45">45 minutes (Deep dive)</option>
                            <option value="60">60 minutes (Pair programming)</option>
                          </select>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-3">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setIsSchedulingModalOpen(false)}
                            className="flex-1 h-11 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold font-mulish"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 h-11 rounded-xl bg-[#0f172a] text-white hover:bg-slate-800 font-bold text-xs font-mulish shadow-md"
                          >
                            Book Session
                          </Button>
                        </div>

                      </form>

                    </div>
                  </div>
                )}

                {/* Add Custom Todo Bottom Sheet */}
                {isTodoSheetOpen && (
                  <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-xs z-50 flex items-end justify-center transition-all">
                    <div className="bg-white rounded-t-[2rem] w-full sm:max-w-md overflow-hidden shadow-2xl border-t border-slate-100 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-350">
                      
                      {/* Pull handle bar */}
                      <div className="w-full flex justify-center py-2.5 bg-[#0f172a] shrink-0">
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
                      </div>

                      {/* Header */}
                      <div className="bg-[#0f172a] text-white px-5 pb-6 pt-1 relative">
                        <button 
                          onClick={() => setIsTodoSheetOpen(false)}
                          className="absolute top-2 right-4 text-slate-300 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                            <ListChecks className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-[18px] font-bold font-volkhov tracking-tight">Add Custom Task</h3>
                            <p className="text-[11px] text-slate-400 font-bold font-mulish uppercase tracking-wider">Keep track of your study objectives</p>
                          </div>
                        </div>
                      </div>

                      {/* Todo Form */}
                      <form onSubmit={handleAddTodo} className="p-5 space-y-4 overflow-y-auto hidden-scrollbar pb-8 font-mulish">
                        
                        {/* Task Title */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Task Title</Label>
                          <Input 
                            value={todoTitleInput}
                            onChange={(e) => setTodoTitleInput(e.target.value)}
                            placeholder="e.g. Build CSS landing page"
                            required
                            className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                          />
                        </div>

                        {/* Description / Notes */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Notes / Description</Label>
                          <Textarea 
                            value={todoNotesInput}
                            onChange={(e) => setTodoNotesInput(e.target.value)}
                            placeholder="Add details about what you want to achieve"
                            rows={3}
                            className="rounded-xl border-slate-200 text-sm font-semibold resize-none focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                          />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-3">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setIsTodoSheetOpen(false)}
                            className="flex-1 h-11 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold font-mulish"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 h-11 rounded-xl bg-[#0f172a] text-white hover:bg-slate-800 font-bold text-xs font-mulish shadow-md"
                          >
                            Create Task
                          </Button>
                        </div>

                      </form>

                    </div>
                  </div>
                )}

                {/* Course Catalog Bottom Sheet */}
                {isCourseCatalogOpen && (
                  <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-xs z-[100] flex items-end justify-center transition-all">
                    <div className="bg-white rounded-t-[2rem] w-full sm:max-w-md overflow-hidden shadow-2xl border-t border-slate-100 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-350">
                      
                      {/* Pull handle bar */}
                      <div className="w-full flex justify-center py-2.5 bg-[#0f172a] shrink-0">
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
                      </div>

                      {/* Header */}
                      <div className="bg-[#0f172a] text-white px-5 pb-6 pt-1 relative shrink-0">
                        <button 
                          onClick={() => setIsCourseCatalogOpen(false)}
                          className="absolute top-2 right-4 text-slate-300 hover:text-white transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-[18px] font-bold font-volkhov tracking-tight">Explore Learning Paths</h3>
                            <p className="text-[11px] text-slate-400 font-bold font-mulish uppercase tracking-wider">Choose from expert-designed courses</p>
                          </div>
                        </div>
                      </div>

                      {/* Course Catalog List */}
                      <div className="p-5 space-y-3.5 overflow-y-auto hidden-scrollbar flex-1 font-mulish">
                        {availableCourses.map((course) => {
                          const isEnrolled = studentEnrollments.some(e => e.course?.id === course.id);
                          const activeModCount = course.modules?.length || course.content?.length || 0;
                          const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || m.topics?.length || 0), 0) || 0;

                          return (
                            <div 
                              key={course.id}
                              className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 relative hover:bg-slate-50 transition-all"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex gap-3 min-w-0">
                                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", course.bgColor || "bg-orange-500", "text-white")}>
                                    <BookOpen className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-[14.5px] font-bold text-slate-800 truncate">{course.title}</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                      {activeModCount} modules · {totalLessons || "Comprehensive"} lessons
                                    </p>
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  {isEnrolled ? (
                                    <div className="flex flex-col items-end gap-1.5">
                                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Enrolled
                                      </span>
                                      <button 
                                        onClick={() => handleStudentEnrollCourse(course, true)}
                                        className="text-[10px] text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-tight flex items-center gap-1"
                                      >
                                        <RotateCcw className="w-2.5 h-2.5" /> Override
                                      </button>
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => handleStudentEnrollCourse(course)}
                                      disabled={enrollingCourseId === course.id}
                                      className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs h-8 px-3.5 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                                    >
                                      {enrollingCourseId === course.id ? "Adding..." : "+ Enroll"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                {course.description || "Master core concepts and build practical projects step by step."}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                )}
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
              <motion.div key="mentor_matching" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-white px-5 overflow-y-auto hidden-scrollbar pb-32">
                
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-md pt-8 pb-6 z-30 border-b border-slate-100">
                  <div className="flex items-center gap-4">
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
                <div className="bg-slate-50 rounded-[1.5rem] p-6 mt-8 border border-slate-100 flex gap-4">
                  <Sparkles className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[13px] font-semibold text-slate-800 mb-1">{realStudents.length} students are waiting for a mentor</p>
                     <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Select the students you'd like to mentor. You can review their profiles and questionnaire responses below.</p>
                  </div>
                </div>

                {/* Sort Bar */}
                <div className="flex items-center gap-4 mt-10 mb-6">
                   <span className="text-[12px] text-slate-400 font-medium">Sort by:</span>
                   <button className="bg-[#0f172a] text-white px-4 py-1.5 rounded-full text-[12px] font-medium shadow-sm">Best Match</button>
                   <button className="bg-slate-50 text-slate-500 hover:bg-slate-100 px-4 py-1.5 rounded-full text-[12px] font-medium border border-slate-200 transition-colors">Recent</button>
                </div>

                {/* Student List */}
                <div className="space-y-5">
                  {realStudents.map(student => {
                    const isExpanded = expandedStudents.includes(student.id);
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                    <div key={student.id} className={`bg-white rounded-[1.5rem] border ${isSelected ? 'border-slate-900 shadow-[0_0_0_1.5px_rgba(15,23,42,1)]' : 'border-slate-100'} p-6 pb-5 shadow-sm transition-all relative flex flex-col`}>
                      
                      {isExpanded ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); setExpandedStudents(prev => prev.filter(id => id !== student.id)); }} className="flex justify-center items-center text-[13px] text-slate-400 font-medium pb-4 hover:text-slate-600 w-full mt-[-4px]">
                            Hide Details <ChevronUp className="w-4 h-4 ml-1" />
                          </button>
                          
                          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center gap-2 mb-4 text-[14px] text-slate-600 w-full border border-slate-100/50">
                            <Mail className="w-4 h-4 shrink-0 text-slate-400" /> <span className="font-medium">{student.email || "vikram.p@gmail.com"}</span>
                          </div>
                          
                          <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-[#ede9fe]">
                            <div className="flex items-center gap-2 text-slate-700 mb-2.5">
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
                          
                          <button onClick={(e) => { e.stopPropagation(); setSelectedStudents(prev => isSelected ? prev.filter(id => id !== student.id) : [...prev, student.id]); }} className={`w-full py-[14px] rounded-[14px] text-[15px] font-medium flex items-center justify-center gap-2 transition-all ${isSelected ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200' : 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm'}`}>
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
                                {student.tags.map((tag: string) => (
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
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col p-5 sm:rounded-b-2xl z-50">
                   <button onClick={() => { if(selectedStudents.length > 0) setState("MENTOR_DASHBOARD") }} className={`w-full h-[52px] rounded-xl text-[15px] font-medium flex gap-2 items-center justify-center transition-all shadow-sm ${selectedStudents.length > 0 ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-200/60 text-slate-400"}`}>
                     {selectedStudents.length > 0 ? `Select ${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''}` : "Select at least one student"}
                   </button>
                   <button onClick={() => setState("MENTOR_DASHBOARD")} className="text-[12px] text-slate-400 font-medium hover:text-slate-600 mt-4 text-center">
                     Skip for now — I&apos;ll review students later
                   </button>
                </div>

              </motion.div>
            )}

            {(state === "MENTOR_DASHBOARD" || state === "MENTOR_STUDENTS" || state === "MENTOR_COURSES" || state === "MENTOR_NOTES" || state === "MENTOR_CIRCLE" || state === "MENTOR_ACCOUNT") && (
              <motion.div key="mentor_portal" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col bg-slate-50">
                <div className="flex-1 overflow-y-auto hidden-scrollbar px-5 pb-6">
                  {state === "MENTOR_DASHBOARD" && <MentorHome />}
                  {state === "MENTOR_STUDENTS" && <MentorStudents />}
                  {state === "MENTOR_COURSES" && <MentorCourses />}
                  {state === "MENTOR_NOTES" && <MentorNotes />}
                  {state === "MENTOR_CIRCLE" && <MentorCircle />}
                  {state === "MENTOR_ACCOUNT" && <MentorProfile onSignOut={handleSignOut} />}
                </div>

                {/* Bottom Navigation */}
                <div className="shrink-0 bg-white border-t border-slate-100 flex justify-between px-5 pt-3 pb-8 sm:rounded-b-2xl">
                  <button onClick={() => setState("MENTOR_DASHBOARD")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_DASHBOARD" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Home className="w-5 h-5" strokeWidth={state === "MENTOR_DASHBOARD" ? 2.5 : 2}/><span className="text-[10px] font-semibold">Home</span></button>
                  <button onClick={() => setState("MENTOR_STUDENTS")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_STUDENTS" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Users className="w-5 h-5" strokeWidth={state === "MENTOR_STUDENTS" ? 2.5 : 2}/><span className="text-[10px] font-medium">Students</span></button>
                  <button onClick={() => setState("MENTOR_COURSES")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_COURSES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><GraduationCap className="w-5 h-5" strokeWidth={state === "MENTOR_COURSES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Courses</span></button>
                  <button onClick={() => setState("MENTOR_NOTES")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_NOTES" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><NotebookPen className="w-5 h-5" strokeWidth={state === "MENTOR_NOTES" ? 2.5 : 2}/><span className="text-[10px] font-medium">Notes</span></button>
                  <button onClick={() => setState("MENTOR_CIRCLE")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_CIRCLE" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><Users className="w-5 h-5" strokeWidth={state === "MENTOR_CIRCLE" ? 2.5 : 2}/><span className="text-[10px] font-medium">Circle</span></button>
                  <button onClick={() => setState("MENTOR_ACCOUNT")} className={`flex flex-col items-center gap-1 w-12 ${state === "MENTOR_ACCOUNT" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}><User className="w-5 h-5" strokeWidth={state === "MENTOR_ACCOUNT" ? 2.5 : 2}/><span className="text-[10px] font-medium">Profile</span></button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
