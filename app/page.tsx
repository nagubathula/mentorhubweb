"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Phone, ShieldCheck, ArrowLeft, GraduationCap, Users, ArrowRight, Camera, Star, SkipForward, Trophy, Brain, Code, BookOpen, Zap, BrainCircuit, Lightbulb, BookOpenCheck, Bell, Search, User, Mail, CheckCircle2, Clock, Circle, Target, MessageSquare, BookText, Send, Play, PlayCircle, FileText, Video, Swords, NotebookPen, Heart, Briefcase, Sun, Flame, Coins, Activity, Home, Gamepad2, ChevronRight, Calendar, Quote, CheckCircle, Layers, Lock, Award, ChevronUp, ChevronDown, Dices, X, TrendingUp, TrendingDown, Image as ImageIcon, Trash2, Plus, Pencil, BarChart2, ListChecks, Medal, Link, MessageCircle, AtSign, UserCircle, MapPin, LogOut, RotateCcw, Layout, HelpCircle, ExternalLink } from "lucide-react";
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
import { StudentResources } from "@/components/student/StudentResources";
import { mentorCoursesCatalog } from "@/lib/mentorCoursesData";
import { CourseDetailsScreen } from "@/components/admin/CourseDetailsScreen";

type FlowState = "WELCOME" | "STUDENT_WELCOME" | "MENTOR_WELCOME" | "SIGNIN" | "SIGNUP" | "ROLE" | "STUDENT_PROFILE" | "STUDENT_QUIZ" | "STUDENT_SCREENING" | "DASHBOARD_AWAITING" | "DASHBOARD_MAIN" | "COURSE_DETAILS" | "GAMES" | "NOTES" | "PROFILE" | "MENTOR_PROFILE" | "MENTOR_QUIZ" | "MENTOR_MATCHING" | "MENTOR_DASHBOARD" | "MENTOR_STUDENTS" | "MENTOR_NOTES" | "MENTOR_COURSES" | "MENTOR_CIRCLE" | "MENTOR_ACCOUNT" | "PORTFOLIO" | "WELLNESS" | "FACTS" | "GRATITUDE_WALL" | "MESSAGES" | "RESOURCES" | "ALL_TASKS";

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

// Icon mapping helper for dynamic questionnaires
const IconMap: Record<string, any> = {
  GraduationCap, Star, Lightbulb, BookOpenCheck, Users, Target, Layout, Sparkles, MessageSquare, BookOpen, Brain, Code, Zap, Video, Trophy
};

const getIcon = (iconName: string) => IconMap[iconName] || HelpCircle;

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const LOCAL_ENROLLMENTS_KEY = "mentorhub_local_enrollments";

const AESTHETIC_GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-indigo-600",
];

const getGradientClass = (id: string) => {
  if (!id) return AESTHETIC_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AESTHETIC_GRADIENTS.length;
  return AESTHETIC_GRADIENTS[index];
};

export default function OnboardingFlow() {
  const [state, setState] = useState<FlowState>("WELCOME");
  const isDashboard = ["DASHBOARD_MAIN", "DASHBOARD_AWAITING", "COURSE_DETAILS", "GAMES", "NOTES", "PROFILE", "MENTOR_MATCHING", "MENTOR_DASHBOARD", "MENTOR_STUDENTS", "MENTOR_COURSES", "MENTOR_NOTES", "MENTOR_CIRCLE", "MENTOR_ACCOUNT", "PORTFOLIO", "WELLNESS", "FACTS", "GRATITUDE_WALL", "MESSAGES", "RESOURCES", "ALL_TASKS"].includes(state);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "MENTOR" | null>(null);
  
  // Custom user data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  // Default Feature Flags fallback
  const DEFAULT_FEATURE_FLAGS: Record<string, boolean> = {
    student_dashboard: true,
    student_courses: true,
    student_games: true,
    student_game_snakes: true,
    student_game_ludo: true,
    student_game_kbc: true,
    student_portfolio: true,
    student_wellness: true,
    student_messages: true,
    student_gratitude: true,
    student_notes: true,
    student_facts: true,
    mentor_dashboard: true,
    mentor_students: true,
    mentor_courses: true,
    mentor_sessions: true,
    mentor_circle: true,
    mentor_account: true,
    mentor_messages: true,
    mentor_gratitude: true,
    mentor_inspiration: true,
  };
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>(DEFAULT_FEATURE_FLAGS);
  
  // Tracking
  const [quizIndex, setQuizIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  
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
  const [streakCount, setStreakCount] = useState(0);
  const [activeInspiration, setActiveInspiration] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messaging state
  const [mappedMentor, setMappedMentor] = useState<any>(null);
  const [enrolledCourse, setEnrolledCourse] = useState<any>(null);
  
  // Feedback state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackImageUrl, setFeedbackImageUrl] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  // Helper to map and inject enabled: true property to modules/lessons to match decompiler 'l5' exactly
  const mapToExtendedCourse = (c: any) => {
    if (!c) return null;
    
    // Parse description if it contains serialized JSON metadata
    let parsedCourse = { ...c };
    try {
      if (c.description && c.description.trim().startsWith('{')) {
        const parsed = JSON.parse(c.description);
        if (parsed && typeof parsed === 'object') {
          parsedCourse = {
            ...c,
            description: parsed.description || "",
            difficulty: parsed.difficulty || "Beginner",
            duration: parsed.duration || "10 hours",
            category: parsed.category || "General",
            modules: parsed.modules || parsed.content || [],
            content: parsed.modules || parsed.content || []
          };
        }
      }
    } catch (e) {
      console.warn("Error parsing serialized course description", e);
    }
    
    const source = parsedCourse;
    // Prefer database course content if it exists, fallback to catalog otherwise
    const hasDbContent = (source.content && source.content.length > 0) || (source.modules && source.modules.length > 0);
    const catalogCourse = !hasDbContent ? mentorCoursesCatalog.find(cat => cat.title === source.title || cat.id === source.id) : null;
    const finalSource = hasDbContent ? source : (catalogCourse || source);

    return {
      id: finalSource.id,
      title: finalSource.title,
      shortTitle: finalSource.shortTitle || finalSource.title.slice(0, 15),
      description: finalSource.description || "",
      category: finalSource.category || "General",
      difficulty: finalSource.difficulty || "Beginner",
      duration: finalSource.duration || "10 hours",
      enrolled: true,
      progress: courseProgress.length > 0 ? Math.round((courseProgress.length / (finalSource.modules?.reduce((acc: number, m: any) => acc + m.lessons.length, 0) || finalSource.content?.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0) || 1)) * 100) : 0,
      color: finalSource.color || "text-emerald-600",
      bgColor: finalSource.bgColor || "bg-emerald-500",
      icon: finalSource.icon || <BookOpen className="w-5 h-5" />,
      modules: (finalSource.modules || finalSource.content || []).map((m: any) => {
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

  // Dynamic Questionnaires State
  const [studentQuizSteps, setStudentQuizSteps] = useState<QuizStepData[]>([]);
  const [studentScreeningSteps, setStudentScreeningSteps] = useState<any[]>([]);
  const [mentorQuizSteps, setMentorQuizSteps] = useState<QuizStepData[]>([]);
  const [isLoadingQuestionnaires, setIsLoadingQuestionnaires] = useState(true);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const { data, error } = await supabase
          .from('questionnaires')
          .select('*')
          .eq('is_active', true);
        
        if (data) {
          const studentQuiz = data.find(q => q.title.includes("Student Onboarding"));
          const studentScreening = data.find(q => q.title.includes("Student Behavioral"));
          const mentorQuiz = data.find(q => q.title.includes("Mentor Onboarding"));

          if (studentQuiz) setStudentQuizSteps(studentQuiz.questions as any);
          if (studentScreening) setStudentScreeningSteps(studentScreening.questions as any);
          if (mentorQuiz) setMentorQuizSteps(mentorQuiz.questions as any);
        }
      } catch (err) {
        console.error("Failed to fetch questionnaires:", err);
      } finally {
        setIsLoadingQuestionnaires(false);
      }
    };
    fetchQuestionnaires();
  }, []);

  const hasLoadedFromCookies = useRef(false);

  // 1. Load state from cookies on mount
  useEffect(() => {
    try {
      const stateVal = getCookie('mentorhub_state');
      if (stateVal) setState(stateVal as FlowState);

      const roleVal = getCookie('mentorhub_role');
      if (roleVal) setRole(roleVal as "STUDENT" | "MENTOR");

      const nameVal = getCookie('mentorhub_name');
      if (nameVal) setName(nameVal);

      const emailVal = getCookie('mentorhub_email');
      if (emailVal) setEmail(emailVal);

      const avatarVal = getCookie('mentorhub_avatarUrl');
      if (avatarVal) setAvatarUrl(avatarVal);

      const selectionsVal = getCookie('mentorhub_selections');
      if (selectionsVal) {
        try { setSelections(JSON.parse(selectionsVal)); } catch(e) {}
      }

      const screeningSelectionsVal = getCookie('mentorhub_screeningSelections');
      if (screeningSelectionsVal) {
        try { setScreeningSelections(JSON.parse(screeningSelectionsVal)); } catch(e) {}
      }

      const quizIndexVal = getCookie('mentorhub_quizIndex');
      if (quizIndexVal) setQuizIndex(Number(quizIndexVal));

      const screeningIndexVal = getCookie('mentorhub_screeningIndex');
      if (screeningIndexVal) setScreeningIndex(Number(screeningIndexVal));

      const mentorQuizIndexVal = getCookie('mentorhub_mentorQuizIndex');
      if (mentorQuizIndexVal) setMentorQuizIndex(Number(mentorQuizIndexVal));

      const mentorExpertiseVal = getCookie('mentorhub_mentorExpertise');
      if (mentorExpertiseVal) setMentorExpertise(mentorExpertiseVal);

      const coinsVal = getCookie('mentorhub_coinsCount');
      if (coinsVal) setCoinsCount(Number(coinsVal));

      const streakVal = getCookie('mentorhub_streakCount');
      if (streakVal) setStreakCount(Number(streakVal));
    } catch (e) {
      console.error("Error reading cookies", e);
    } finally {
      hasLoadedFromCookies.current = true;
    }
  }, []);

  // 2. Sync state to cookies whenever it changes
  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_state', state);
  }, [state]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    if (role) setCookie('mentorhub_role', role);
  }, [role]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_name', name);
  }, [name]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_email', email);
  }, [email]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    if (avatarUrl) setCookie('mentorhub_avatarUrl', avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_selections', JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_screeningSelections', JSON.stringify(screeningSelections));
  }, [screeningSelections]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_quizIndex', String(quizIndex));
  }, [quizIndex]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_screeningIndex', String(screeningIndex));
  }, [screeningIndex]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_mentorQuizIndex', String(mentorQuizIndex));
  }, [mentorQuizIndex]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_mentorExpertise', mentorExpertise);
  }, [mentorExpertise]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_coinsCount', String(coinsCount));
  }, [coinsCount]);

  useEffect(() => {
    if (!hasLoadedFromCookies.current) return;
    setCookie('mentorhub_streakCount', String(streakCount));
  }, [streakCount]);

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
        setState("WELCOME");
        setRole(null);
        setName("");
        setEmail("");
        // Clear all cookies
        setCookie('mentorhub_state', '', -1);
        setCookie('mentorhub_role', '', -1);
        setCookie('mentorhub_name', '', -1);
        setCookie('mentorhub_email', '', -1);
        setCookie('mentorhub_avatarUrl', '', -1);
        setCookie('mentorhub_selections', '', -1);
        setCookie('mentorhub_screeningSelections', '', -1);
        setCookie('mentorhub_quizIndex', '', -1);
        setCookie('mentorhub_screeningIndex', '', -1);
        setCookie('mentorhub_mentorQuizIndex', '', -1);
        setCookie('mentorhub_mentorExpertise', '', -1);
        setCookie('mentorhub_coinsCount', '', -1);
        setCookie('mentorhub_streakCount', '', -1);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Real-Time Feature Flags Subscription & Syncing
  useEffect(() => {
    const fetchFlags = async () => {
      let mergedFlags = { ...DEFAULT_FEATURE_FLAGS };
      
      // Load local overrides
      try {
        const local = localStorage.getItem('mentorhub_feature_flags');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((f: any) => {
              mergedFlags[f.key] = f.is_enabled;
            });
          } else if (typeof parsed === 'object') {
            mergedFlags = { ...mergedFlags, ...parsed };
          }
        }
      } catch (e) {
        console.warn("Local storage parse error for feature flags", e);
      }

      // Try database fetch
      try {
        const { data: flags, error } = await supabase.from('feature_flags').select('key, is_enabled');
        if (!error && flags && flags.length > 0) {
          flags.forEach((f: any) => {
            mergedFlags[f.key] = f.is_enabled;
          });
        }
      } catch (e) {
        console.warn("Supabase fetch error for feature flags", e);
      }

      setFeatureFlags(mergedFlags);
    };

    fetchFlags();

    // Listen for local tab change events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mentorhub_feature_flags') {
        fetchFlags();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Subscribe to Postgres realtime updates on feature_flags table
    const channel = supabase
      .channel('realtime-feature-flags')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feature_flags' },
        () => {
          fetchFlags();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.unsubscribe();
    };
  }, []);

  const handleSessionSync = async (session: any) => {
    if (!session?.user) return;
    
    setEmail(session.user.email || "");
    if (session.user.user_metadata?.full_name) setName(session.user.user_metadata.full_name);

    // Fetch profile to see where to send the user
    try {
      // Fetch feature flags
      const { data: flags } = await supabase.from('feature_flags').select('key, is_enabled');
      if (flags && flags.length > 0) {
        const flagsMap = { ...DEFAULT_FEATURE_FLAGS };
        flags.forEach((f: any) => flagsMap[f.key] = f.is_enabled);
        setFeatureFlags(flagsMap);
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name || "");
        setRole(profile.role as any);
        setCoinsCount(profile.coins || 0);
        setStreakCount(profile.streak || 0);
        
        // Restore last known state if available
        if (profile.last_state) {
          const prefs = (profile.preferences as any) || {};
          if (profile.last_state === "MENTOR_MATCHING" && prefs.has_seen_matching) {
            setState("MENTOR_DASHBOARD");
          } else {
            setState(profile.last_state as any);
          }
        }
        
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

        // Fetch assigned students for mentor to determine landing page
        if (profile.role === "MENTOR") {
          const { data: mappings } = await supabase
            .from('mapping')
            .select('student_id')
            .eq('mentor_id', session.user.id);
          
          const prefs = (profile.preferences as any) || {};
          if ((mappings && mappings.length > 0) || prefs.has_seen_matching) {
             // If already has students or has seen matching, dashboard is the better default
             if (!profile.last_state || profile.last_state === "MENTOR_MATCHING") {
               setState("MENTOR_DASHBOARD");
             }
          }
        }

        // Auto-redirect based on role if still in auth screens and no saved state
        if (["WELCOME", "MENTOR_WELCOME", "STUDENT_WELCOME", "SIGNIN", "SIGNUP", "ROLE"].includes(state) && !profile.last_state) {
          const prefs = (profile.preferences as any) || {};
          if (profile.role === 'MENTOR' && prefs.has_seen_matching) {
            setState('MENTOR_DASHBOARD');
          } else {
            setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
          }
        }
      } else {
        // No profile? Send to role selection
        if (["WELCOME", "SIGNIN", "SIGNUP"].includes(state)) {
          setState("ROLE");
        }
      }
    } catch (e) {
      console.error("Session sync error:", e);
    }
  };

  // Sync state changes to DB for persistence
  useEffect(() => {
    const syncState = async () => {
      if (!isDashboard) return; // Only sync dashboard-level states
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('profiles').update({
          last_state: state
        }).eq('id', session.user.id);
      }
    };
    syncState();
  }, [state, isDashboard]);

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

  const markMatchingAsSeen = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', session.user.id)
          .maybeSingle();
        
        const currentPrefs = (profile?.preferences as any) || {};
        const newPrefs = { ...currentPrefs, has_seen_matching: true };
        
        await supabase.from('profiles').update({
          preferences: newPrefs,
          last_state: "MENTOR_DASHBOARD"
        }).eq('id', session.user.id);

        if (selectedStudents.length > 0) {
          await supabase.from('mapping').delete().eq('mentor_id', session.user.id);
          
          const newMappings = selectedStudents.map(studentId => ({
            mentor_id: session.user.id,
            student_id: studentId
          }));
          
          await supabase.from('mapping').insert(newMappings);
        }
      } catch (err) {
        console.error("Error saving student selections / matching status:", err);
      }
    }
    setState("MENTOR_DASHBOARD");
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
  const [availableCourses, setAvailableCourses] = useState<any[]>(mentorCoursesCatalog);
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
                avatar_url: profile.avatar_url,
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
        if (!session) {
          const localEnrollmentsStr = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
          if (localEnrollmentsStr) {
            try {
              const localEnrs = JSON.parse(localEnrollmentsStr);
              setStudentEnrollments(localEnrs);
              const latestLocal = localEnrs[0];
              if (latestLocal) {
                setEnrollmentId(latestLocal.id);
                setEnrolledCourse(latestLocal.course);
                setCourseProgress(latestLocal.progress || []);
              }
            } catch (e) {
              console.error("Failed to parse local enrollments in guest mode", e);
            }
          }
          return;
        }
        
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

        const parsedEnrollments = (enrollments || []).map(enr => {
          let c = enr.course;
          if (c) {
            try {
              if (c.description && c.description.trim().startsWith('{')) {
                const parsed = JSON.parse(c.description);
                if (parsed && typeof parsed === 'object') {
                  c = {
                    ...c,
                    description: parsed.description || "",
                    difficulty: parsed.difficulty || "Beginner",
                    duration: parsed.duration || "10 hours",
                    category: parsed.category || "General",
                    modules: parsed.modules || parsed.content || [],
                    content: parsed.modules || parsed.content || []
                  } as any;
                }
              }
            } catch (e) {
              console.warn("Failed to parse serialized enrollment course description JSON", e);
            }
          }
          return {
            ...enr,
            course: c
          };
        });

        if (parsedEnrollments && parsedEnrollments.length > 0) {
          setStudentEnrollments(parsedEnrollments);
          const enrollment = parsedEnrollments[0];
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
        
        const parsedDbCourses = (dbCourses || []).map((c: any) => {
          try {
            if (c.description && c.description.trim().startsWith('{')) {
              const parsed = JSON.parse(c.description);
              if (parsed && typeof parsed === 'object') {
                return {
                  ...c,
                  description: parsed.description || "",
                  difficulty: parsed.difficulty || "Beginner",
                  duration: parsed.duration || "10 hours",
                  category: parsed.category || "General",
                  modules: parsed.modules || parsed.content || [],
                  content: parsed.modules || parsed.content || []
                };
              }
            }
          } catch (e) {
            console.warn("Failed to parse serialized course description JSON", e);
          }
          return c;
        });

        const localCatalog = mentorCoursesCatalog;
        const combined = [
          ...parsedDbCourses.map(c => ({
            ...c,
            modules: c.modules || c.content || []
          })),
          ...localCatalog.filter(c => !parsedDbCourses.some(sc => sc.title === c.title))
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
            if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
            const prefs = (profile.preferences as any) || {};
            if (typeof prefs.coins === 'number') {
              setCoinsCount(prefs.coins);
            }
            if (profile.role === 'MENTOR' && prefs.has_seen_matching) {
              setState('MENTOR_DASHBOARD');
            } else {
              setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
            }
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
      const coinDelta = isAdding ? 2 : -2;
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
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
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

  const handleSkipLogin = async (selectedRole: "STUDENT" | "MENTOR") => {
    setAuthLoading(true);
    setAuthError("");
    const guestEmail = selectedRole === "STUDENT" ? "guest.student@kindmentor.com" : "guest.mentor@kindmentor.com";
    const guestPassword = "Password123";
    const guestName = selectedRole === "STUDENT" ? "Guest Student" : "Guest Mentor";

    try {
      // 1. Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });

      if (data?.user) {
        setName(guestName);
        setEmail(guestEmail);
        setRole(selectedRole);
        
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) {
          if (profile.name) setName(profile.name);
          if (profile.role) setRole(profile.role as any);
        }
        
        setState(selectedRole === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE");
        return;
      }

      // 2. If sign in failed, try to sign up
      if (error) {
        const { data: signUpData } = await supabase.auth.signUp({
          email: guestEmail,
          password: guestPassword,
          options: {
            data: {
              full_name: guestName,
              role: selectedRole,
            }
          }
        });

        if (signUpData?.user) {
          setName(guestName);
          setEmail(guestEmail);
          setRole(selectedRole);
          
          setState(selectedRole === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE");
          return;
        }
      }
    } catch (err) {
      console.warn("Guest sign in error, falling back to mock session", err);
    } finally {
      setAuthLoading(false);
    }

    // 3. Absolute Fallback: Bypassing auth and mocking state variables locally (useful for offline/mock-only setups)
    setName(guestName);
    setEmail(guestEmail);
    setRole(selectedRole);
    setState(selectedRole === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setState("WELCOME");
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

  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const feedbackPayload = {
      user_id: session?.user?.id || null,
      user_name: name || "Anonymous",
      user_email: email || session?.user?.email || "anonymous@mentorhub.com",
      user_role: role ? role.toLowerCase() : "student",
      message: feedbackMessage,
      image_url: feedbackImageUrl || null,
      created_at: new Date().toISOString()
    };

    // 1. Submit to Supabase DB
    const { error } = await (supabase as any).from('platform_feedback').insert([feedbackPayload]);

    // 2. Submit to localStorage fallback
    try {
      const stored = localStorage.getItem("local_platform_feedback");
      const localList = stored ? JSON.parse(stored) : [];
      localList.push({
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        ...feedbackPayload
      });
      localStorage.setItem("local_platform_feedback", JSON.stringify(localList));
    } catch (e) {
      console.error("Local storage sync error:", e);
    }

    setIsSubmittingFeedback(false);

    if (error) {
      console.error("Supabase feedback insert error, but stored in fallback local storage:", error);
      alert("Feedback saved locally! Thank you for sharing your thoughts.");
    } else {
      alert("Feedback submitted successfully! Thank you for helping us improve.");
    }

    // Reset fields & close modal
    setFeedbackMessage("");
    setFeedbackImageUrl("");
    setIsFeedbackModalOpen(false);
  };

  const handleStudentEnrollCourse = async (courseObj: any, isOverride: boolean = false) => {
    if (isOverride) {
      const confirm = window.confirm(`Are you sure you want to override "${courseObj.title}"? This will reset all your progress for this course.`);
      if (!confirm) return;
    }

    setEnrollingCourseId(courseObj.id);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || "guest-student-id";

    let actualCourseId = courseObj.id;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(actualCourseId);

    if (!isUUID && userId !== "guest-student-id") {
      // Create course record in DB first if catalog mock course is being enrolled
      const serializedDescription = JSON.stringify({
        description: courseObj.description || "",
        difficulty: courseObj.difficulty || "Beginner",
        duration: courseObj.duration || "10 hours",
        category: courseObj.category || "General",
        modules: (courseObj.modules || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description || "",
          enabled: m.enabled !== false,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: l.duration || "15 mins",
            type: l.type || "video",
            enabled: l.enabled !== false
          }))
        }))
      });

      const payload = {
        title: courseObj.title,
        description: serializedDescription,
        status: 'Active'
      };

      const { data: newCourse, error } = await supabase.from('courses').insert(payload).select().single();
      if (error) {
        console.warn("DB Course creation failed, falling back to local mode:", error.message);
        actualCourseId = `local-course-${Date.now()}`;
      } else {
        actualCourseId = newCourse.id;
      }
    } else if (!isUUID) {
      actualCourseId = `local-course-${Date.now()}`;
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
      if (userId !== "guest-student-id") {
        await supabase.from('enrollments')
          .delete()
          .eq('student_id', userId)
          .eq('course_id', actualCourseId);
      }
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

      if (userId !== "guest-student-id") {
        const { data: existing } = await supabase.from('enrollments')
          .select('*')
          .eq('student_id', userId)
          .eq('course_id', actualCourseId)
          .eq('status', 'Active');

        if (existing && existing.length > 0) {
          setEnrollingCourseId(null);
          alert("You are already enrolled in this course! Use the override option if you want to restart.");
          return;
        }
      }
    }

    const enrollmentPayload = {
      student_id: userId,
      course_id: actualCourseId,
      status: 'Active',
      progress: []
    };

    let enrollData: any = null;
    let enrollErr: any = true;
    let dbEnrollData: any = null;

    if (userId !== "guest-student-id") {
      const res = await supabase.from('enrollments')
        .insert(enrollmentPayload)
        .select('*, course:courses(*)')
        .single();
      dbEnrollData = res.data;
      enrollErr = res.error;
    }

    if (enrollErr) {
      if (enrollErr !== true) {
        console.warn("DB Enrollment failed, completing locally:", enrollErr.message);
      }
      // Fallback: Create mock enrollment object
      enrollData = {
        id: `local-enr-${Date.now()}`,
        student_id: userId,
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
      const existingLocalStr = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
      const existingLocal = existingLocalStr ? JSON.parse(existingLocalStr) : [];
      const updatedLocal = [enrollData, ...existingLocal];
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
        
        const userRole = data.user.user_metadata?.role || role;
        if (userRole) setRole(userRole as "STUDENT" | "MENTOR");

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) {
          if (profile.name) setName(profile.name);
          if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
          if (profile.role) {
            setRole(profile.role as "STUDENT" | "MENTOR");
            const prefs = (profile.preferences as any) || {};
            if (profile.role === 'MENTOR' && prefs.has_seen_matching) {
              setState('MENTOR_DASHBOARD');
            } else {
              setState(profile.role === 'STUDENT' ? 'DASHBOARD_MAIN' : 'MENTOR_MATCHING');
            }
          } else {
            setState(userRole ? (userRole === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE") : "ROLE");
          }
        } else {
          setState(userRole ? (userRole === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE") : "ROLE");
        }
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
      const { data, error } = await supabase.auth.signUp({ 
        email: authEmail, 
        password: authPassword,
        options: {
          data: {
            role: role // Carry forward the role selected
          }
        }
      });
      if (error) { setAuthError(error.message); return; }
      if (data.session) {
        if (data.user?.email) setEmail(data.user.email);
        setState(role ? (role === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE") : "ROLE");
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
      if (userId) {
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
      }
    } catch (e) {
      console.error("Save profile caught error", e);
    }
    
    setState(userRole === 'STUDENT' ? 'DASHBOARD_AWAITING' : 'MENTOR_MATCHING');
  };

  const nextQuizStep = () => {
    if (quizIndex < studentQuizSteps.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setState("STUDENT_SCREENING");
      setQuizIndex(0);
    }
  };

  const handleNextScreening = () => {
    if (screeningIndex < studentScreeningSteps.length - 1) {
      setScreeningIndex(screeningIndex + 1);
    } else {
      saveProfileData("STUDENT");
    }
  };


  // Animation variants
  const variants: any = {
    initial: { opacity: 0, scale: 0.96, y: 15, filter: "blur(4px)" },
    enter: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.96, y: -15, filter: "blur(4px)", transition: { duration: 0.4, ease: "easeIn" } },
  };

  // Header Component
  const LogoHeader = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="mb-4 hover:scale-105 transition-all duration-300">
        <img src="/logo.svg" alt="Kind Mentor Logo" className="w-28 h-28 object-contain" />
      </div>
      <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1 tracking-tight">Kind Mentor</h1>
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Connect & Grow</p>
    </div>
  );


  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-0 md:p-6 selection:bg-orange-200 font-inter">
      <div className={`w-full ${isDashboard ? 'max-w-[1600px] h-[100dvh] md:h-[calc(100vh-3rem)] rounded-none md:rounded-3xl bg-white/90 backdrop-blur-3xl border-slate-200/50' : 'w-full md:max-w-lg h-[100dvh] md:h-auto md:max-h-[90vh] rounded-none md:rounded-[1.5rem] bg-white/70 backdrop-blur-2xl border-white/60 premium-shadow'} overflow-hidden relative flex flex-col md:border transition-all duration-500 ease-out`}>

        <div className={`flex-1 relative ${isDashboard ? 'px-0 pt-0 pb-0 overflow-hidden' : state === 'WELCOME' ? 'p-0 flex flex-col bg-white overflow-hidden' : (state === 'MENTOR_WELCOME' || state === 'STUDENT_WELCOME') ? 'p-0 flex flex-col bg-[#fdfdfc] overflow-y-auto hidden-scrollbar' : 'px-5 sm:px-8 py-6 sm:py-8 flex flex-col justify-start md:justify-center overflow-y-auto hidden-scrollbar pb-[calc(4rem+env(safe-area-inset-bottom))]'}`}>
          <AnimatePresence mode="wait">
            {state === "WELCOME" && (
              <motion.div key="welcome" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col">
                {/* Top Section with Gradient */}
                <div className="pt-16 pb-12 px-8 bg-gradient-to-b from-[#fdfbf7] via-[#f7f5ff] to-[#f0f4ff] flex flex-col items-center">
                  {/* Logo */}
                  <div className="mb-5 hover:scale-105 transition-all duration-300">
                    <img src="/logo.svg" alt="Kind Mentor Logo" className="w-24 h-24 object-contain" />
                  </div>
                  <h1 className="text-xl font-medium text-slate-900 mb-5 font-inter tracking-tight">KindMentor</h1>
                  
                  <div className="bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors cursor-pointer text-white px-4 py-2 rounded-full flex items-center gap-2 text-[13px] font-medium mb-10 shadow-sm">
                    <Sparkles className="w-4 h-4" /> 60-Day Mentorship Journey
                  </div>

                  <div className="space-y-4 text-[15px] text-slate-700 font-medium w-full max-w-xs mx-auto pl-2">
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0" />
                      <p>Connect with mentors who get you</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0" />
                      <p>Learn through guided conversations</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0" />
                      <p>Grow with bite-sized daily steps</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex-1 px-6 py-8 bg-white flex flex-col justify-center border-t border-slate-100/50">
                  <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
                    {authError && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl px-4.5 py-3.5 text-[13px] text-red-600 font-medium leading-relaxed">{authError}</div>
                    )}
                    <Button variant="outline" className="h-[54px] rounded-2xl text-[15px] font-medium border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 mb-1" onClick={handleGoogleSignIn}>
                      <GoogleIcon /> Continue with Google
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleSkipLogin("STUDENT")}
                        className="flex-1 h-12 rounded-[12px] text-[13px] font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all animate-in fade-in duration-300"
                      >
                        Skip Login (Student)
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleSkipLogin("MENTOR")}
                        className="flex-1 h-12 rounded-[12px] text-[13px] font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all animate-in fade-in duration-300"
                      >
                        Skip Login (Mentor)
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {state === "STUDENT_WELCOME" && (
              <motion.div key="student_welcome" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col overflow-y-auto hidden-scrollbar pb-8 relative bg-[#fdfdfc]">
                <div className="sticky top-0 left-0 right-0 p-6 z-10 flex items-center bg-gradient-to-b from-[#fdfdfc] to-transparent">
                  <button onClick={() => setState("WELCOME")} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="px-8 flex flex-col items-center mt-2 flex-1">
                  <div className="mb-6 hover:scale-105 transition-all duration-300">
                    <img src="/logo.svg" alt="Kind Mentor Logo" className="w-20 h-20 object-contain" />
                  </div>
                  
                  <h1 className="text-[22px] font-semibold text-slate-900 mb-4 font-inter tracking-tight">
                    Welcome, Student
                  </h1>
                  
                  <p className="text-center text-[15px] italic text-slate-600 font-medium mb-12 max-w-[300px] leading-relaxed">
                    "9 in 10 learners grow faster with a mentor by their side."
                  </p>
                  
                  <div className="w-full space-y-6 mb-12 max-w-sm mx-auto">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#fee2e2] flex items-center justify-center text-[#ef4444] shrink-0">
                        <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">60 days to become your best self</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">A guided journey from where you are to where you belong.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#fce7f3] flex items-center justify-center text-[#ec4899] shrink-0">
                        <Users className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">Meet your mentor</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">Get matched with mentors who fit your goals.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#e0e7ff] flex items-center justify-center text-[#6366f1] shrink-0">
                        <GraduationCap className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">Learn at your pace</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">Personalized journeys, bite-sized lessons.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#d1fae5] flex items-center justify-center text-[#10b981] shrink-0">
                        <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">Grow with rewards</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">Earn coins, build streaks, celebrate wins.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-sm mx-auto mt-auto shrink-0 pb-6">
                    <Button 
                      onClick={() => setState("SIGNUP")} 
                      className="w-full h-14 rounded-[16px] text-[16px] font-medium font-inter bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-lg shadow-slate-950/10 transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {state === "MENTOR_WELCOME" && (
              <motion.div key="mentor_welcome" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col overflow-y-auto hidden-scrollbar pb-8 relative bg-[#fdfdfc]">
                <div className="sticky top-0 left-0 right-0 p-6 z-10 flex items-center bg-gradient-to-b from-[#fdfdfc] to-transparent">
                  <button onClick={() => setState("WELCOME")} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="px-8 flex flex-col items-center mt-2 flex-1">
                  <div className="mb-6 hover:scale-105 transition-all duration-300">
                    <img src="/logo.svg" alt="Kind Mentor Logo" className="w-20 h-20 object-contain" />
                  </div>
                  
                  <h1 className="text-[22px] font-semibold text-slate-900 mb-4 font-inter tracking-tight">
                    Welcome, Mentor
                  </h1>
                  
                  <p className="text-center text-[15px] italic text-slate-600 font-medium mb-12 max-w-[300px] leading-relaxed">
                    "Only 1 in 100 professionals choose to mentor — your guidance is rare and needed."
                  </p>
                  
                  <div className="w-full space-y-6 mb-12 max-w-sm mx-auto">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#ede9fe] flex items-center justify-center text-[#8b5cf6] shrink-0">
                        <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">60 days to shape a future</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">A structured journey to grow someone — and yourself.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#ffe4e6] flex items-center justify-center text-[#e11d48] shrink-0">
                        <Heart className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">Guide motivated learners</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">Connect with students who truly value your time.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#f3e8ff] flex items-center justify-center text-[#a855f7] shrink-0">
                        <Users className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">Join a mentor circle</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">Belong to a community of thoughtful guides.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#ffedd5] flex items-center justify-center text-[#f97316] shrink-0">
                        <BookOpen className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 mt-0.5">
                        <h4 className="text-[16px] font-medium text-slate-900 mb-1">Brush up your craft</h4>
                        <p className="text-[14px] text-slate-500 leading-snug">Teaching deepens what you already know.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-sm mx-auto mt-auto shrink-0 pb-6">
                    <Button 
                      onClick={() => setState("SIGNUP")} 
                      className="w-full h-14 rounded-[16px] text-[16px] font-medium font-inter bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-lg shadow-slate-950/10 transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}



            {state === "SIGNIN" && (
              <motion.div key="signin" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center">
                <div className="mb-2 shrink-0"><button onClick={() => setState("WELCOME")} className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 transition-all shrink-0"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1 ml-1 shrink-0">
                  <h2 className="text-2xl font-medium tracking-tight text-slate-900">
                    {role ? `${role === "STUDENT" ? "Student" : "Mentor"} Sign In` : "Welcome Back"}
                  </h2>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Sign in to your learning vault</p>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  {authError && authError !== "confirm-email" && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl px-4.5 py-3.5 text-[13px] text-red-600 font-medium leading-relaxed">{authError}</div>
                  )}
                  <Button variant="outline" className="h-[54px] rounded-2xl text-[15px] font-medium border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 mb-1" onClick={handleGoogleSignIn}>
                    <GoogleIcon /> Continue with Google
                  </Button>
                  
                  <p className="text-[13px] text-slate-400 text-center mt-1">
                    Don't have an account?{" "}
                    <button className="text-[#0f172a] font-medium hover:underline" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNUP"); }}>Create one</button>
                  </p>
                </div>
              </motion.div>
            )}

            {state === "SIGNUP" && (
              <motion.div key="signup" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col justify-center">
                <div className="mb-2 shrink-0"><button onClick={() => setState("WELCOME")} className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 transition-all shrink-0"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1 ml-1 shrink-0">
                  <h2 className="text-2xl font-medium tracking-tight text-slate-900">
                    {role ? `Create ${role === "STUDENT" ? "Student" : "Mentor"} Account` : "Create Account"}
                  </h2>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Start your personalized education path</p>
                </div>
                {authError === "confirm-email" ? (
                  <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-3xl p-6 flex flex-col items-center text-center gap-3">
                    <ShieldCheck className="w-12 h-12 text-[#059669] animate-bounce" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Check your email</p>
                      <p className="text-[13px] text-slate-500 leading-relaxed">We sent a confirmation link to <span className="font-semibold text-slate-700">{authEmail}</span>. Click it to activate your {role ? (role === "STUDENT" ? "Student" : "Mentor") + " account." : "account."}</p>
                    </div>
                    <button className="text-[13px] text-slate-500 hover:text-slate-700 mt-2 font-semibold hover:underline" onClick={() => { setAuthError(""); setState("SIGNIN"); }}>Back to sign in</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    {authError && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl px-4.5 py-3.5 text-[13px] text-red-600 font-medium leading-relaxed">{authError}</div>
                    )}
                    
                    <Button variant="outline" className="h-[54px] rounded-2xl text-[15px] font-medium border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 mb-1" onClick={handleGoogleSignIn}>
                      <GoogleIcon /> Continue with Google
                    </Button>
                    
                    <button onClick={() => setState("ROLE")} className="text-[12px] text-slate-400 font-medium hover:text-slate-600 hover:underline transition-all text-center mb-1">Skip to Test Questionnaire</button>

                    <p className="text-[13px] text-slate-400 text-center mt-1">
                      Already have an account?{" "}
                      <button className="text-[#0f172a] font-medium hover:underline" onClick={() => { setAuthError(""); setAuthPassword(""); setState("SIGNIN"); }}>Sign in</button>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {state === "ROLE" && (
              <motion.div key="role" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-2 justify-center">
                <div className="mb-2 shrink-0"><button onClick={() => setState("WELCOME")} className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 transition-all shrink-0"><ArrowLeft className="w-5 h-5" /></button></div>
                <div className="mb-6 space-y-1.5 ml-1 shrink-0">
                  <h2 className="text-2xl font-medium tracking-tight text-slate-900">I am a...</h2>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Choose your path to get started</p>
                </div>
                <div className="flex flex-col gap-4.5 mb-6">
                  {["STUDENT", "MENTOR"].map((r) => (
                    <button key={r} onClick={() => setRole(r as "STUDENT"|"MENTOR")} className={`flex items-center gap-5 p-5 rounded-[1.5rem] border text-left transition-all duration-300 active:scale-98 ${role === r ? "border-slate-950 bg-slate-50 shadow-md ring-1 ring-slate-950" : "border-slate-100 hover:border-slate-200 bg-white/40 hover:bg-white"}`}>
                      <div className={`p-4 rounded-2xl shrink-0 transition-all ${role === r ? "bg-slate-950 text-white shadow-md rotate-3" : "bg-slate-100 text-slate-500"}`}>
                        {r === "STUDENT" ? <GraduationCap className="w-7 h-7" /> : <Users className="w-7 h-7" />}
                      </div>
                      <div>
                        <h3 className={`text-[17px] font-medium mb-0.5 transition-colors ${role === r ? "text-slate-950" : "text-slate-700"}`}>{r === "STUDENT" ? "Student" : "Mentor"}</h3>
                        <p className="text-[13px] text-slate-400 leading-relaxed font-medium">{r === "STUDENT" ? "Find an expert mentor and level up your skills." : "Share your engineering expertise and guide others."}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-auto shrink-0">
                  <Button disabled={!role} onClick={() => { setState(role === "STUDENT" ? "STUDENT_PROFILE" : "MENTOR_PROFILE") }} className={`w-full h-[54px] rounded-2xl text-[15px] font-medium transition-all shadow-md active:scale-98 ${role ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-100 text-slate-400"}`}>
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
                    {avatarUrl ? (
                      <div 
                        className="w-[104px] h-[104px] rounded-full border border-slate-200 bg-cover bg-center shadow-sm"
                        style={{ backgroundImage: `url(${avatarUrl})` }}
                      ></div>
                    ) : (
                      <div className="w-[104px] h-[104px] rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-300 shadow-sm">
                        <User className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
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
                <div className="mt-8 shrink-0 flex flex-col">
                  <Button onClick={() => setState("STUDENT_QUIZ")} className="w-full h-[52px] rounded-xl text-[15px] font-medium bg-[#0f172a] text-white hover:bg-[#1e293b]">Continue <ArrowRight className="w-[18px] h-[18px] ml-1.5" /></Button>
                </div>
              </motion.div>
            )}

            {state === "STUDENT_QUIZ" && studentQuizSteps.length > 0 && (
              <div className="w-full">
                {(() => {
                  const currentData = studentQuizSteps[quizIndex];
                  const Icon = getIcon(currentData.icon as any);
                  return (
                    <>
                      <div className="flex items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100"
                            style={{ backgroundColor: currentData.color || '#3b82f6' }}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-blue-600 text-[11px] font-medium uppercase tracking-widest mb-1">Step {currentData.step} of {studentQuizSteps.length}</p>
                            <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight">{currentData.title}</h2>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (quizIndex > 0) {
                              setQuizIndex(quizIndex - 1);
                            } else {
                              setState("STUDENT_PROFILE");
                            }
                          }} 
                          className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-1 text-[13px] font-medium px-4"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      </div>

                      <div className="space-y-8">
                        {currentData.questions.map((q: any) => (
                          <div key={q.id} className="space-y-3">
                            <Label className="text-[14px] font-medium text-slate-700">{q.text}</Label>
                            {q.type === "input" ? (
                              <Input 
                                placeholder={q.placeholder}
                                value={(selections[q.id] as string) || ""}
                                onChange={(e) => setSelections({ ...selections, [q.id]: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                            ) : (
                              <div className="space-y-1.5 pt-1">
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    const optionsList = q.options || [];
                                    const isExpanded = !!expandedQuestions[q.id];
                                    const displayedOpts = (() => {
                                      if (optionsList.length <= 5 || isExpanded) return optionsList;
                                      const base = optionsList.slice(0, 4);
                                      const other = optionsList.find((opt: string) => opt.toLowerCase() === 'other');
                                      if (other && !base.includes(other)) {
                                        return [...base, other];
                                      }
                                      return base;
                                    })();
                                    return displayedOpts.map((opt: string) => (
                                      <SelectionChip
                                        key={opt}
                                        label={opt}
                                        active={selections[q.id] === opt}
                                        onClick={() => setSelections({ ...selections, [q.id]: opt })}
                                      />
                                    ));
                                  })()}
                                </div>
                                {q.options && q.options.length > 5 && (
                                  <button 
                                    type="button"
                                    onClick={() => setExpandedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                    className="text-[12px] text-blue-600 font-semibold hover:text-blue-700 transition-colors ml-1 mt-1 hover:underline cursor-pointer inline-flex items-center gap-1"
                                  >
                                    {expandedQuestions[q.id] ? "Show Less" : `+ ${q.options.length - (q.options.slice(0, 4).includes(q.options.find((opt: string) => opt.toLowerCase() === 'other') || '') ? 4 : 5)} More`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}

                <div className="mt-12 flex flex-col">
                  <Button 
                    onClick={nextQuizStep} 
                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-medium text-[15px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  >
                    {quizIndex === studentQuizSteps.length - 1 ? "Complete Journey" : "Continue"} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {state === "STUDENT_SCREENING" && studentScreeningSteps.length > 0 && (
              <div className="w-full">
                {(() => {
                  const currentPhase = studentScreeningSteps[screeningIndex];
                  const Icon = getIcon(currentPhase.icon as any);
                  const q = currentPhase.questions?.[0]; // Screening usually has 1 question per step
                  
                  if (!q) return null;

                  return (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-100"
                            style={{ backgroundColor: currentPhase.color || '#3b82f6' }}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-blue-600 text-[11px] font-medium uppercase tracking-widest mb-1">Step {screeningIndex + 1} of {studentScreeningSteps.length}</p>
                            <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight">{currentPhase.title}</h2>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (screeningIndex > 0) {
                              setScreeningIndex(screeningIndex - 1);
                            } else {
                              setState("STUDENT_QUIZ");
                              setQuizIndex(studentQuizSteps.length - 1);
                            }
                          }} 
                          className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-1 text-[13px] font-medium px-4"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      </div>

                      <div className="space-y-6">
                        <p className="text-lg font-medium text-slate-800 leading-snug">{q.text}</p>
                        <div className="grid grid-cols-1 gap-3">
                          {q.options?.map((opt: string) => (
                            <button
                              key={opt}
                              onClick={() => setScreeningSelections({ ...screeningSelections, [q.id || currentPhase.title]: opt })}
                              className={cn(
                                "p-5 rounded-2xl border text-left transition-all duration-300 group",
                                screeningSelections[q.id || currentPhase.title] === opt
                                  ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-[15px]">{opt}</span>
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                  screeningSelections[q.id || currentPhase.title] === opt ? "bg-white border-white" : "border-slate-100"
                                )}>
                                  {screeningSelections[q.id || currentPhase.title] === opt && <Check className="w-3.5 h-3.5 text-slate-900" />}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <Button 
                          onClick={handleNextScreening} 
                          disabled={!screeningSelections[q.id || currentPhase.title]}
                          className="w-full h-14 rounded-2xl bg-slate-900 text-white font-medium text-[15px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                        >
                          {screeningIndex === studentScreeningSteps.length - 1 ? "Go to Dashboard" : "Next Question"} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {state === "DASHBOARD_AWAITING" && (
              <motion.div key="dashboard_awaiting" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-0 bg-white px-6 md:px-8 overflow-y-auto hidden-scrollbar pb-[calc(8rem+env(safe-area-inset-bottom))] items-center">
                <div className="w-full max-w-2xl flex flex-col gap-5 pt-8">
                  {/* Header */}
                  <div className="w-full relative flex items-center justify-between gap-4 shrink-0 border-b border-slate-100 pb-5 mb-1">
                    <div className="space-y-1">
                      <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight leading-tight">Welcome, {name || 'Guest Student'}! 👋</h2>
                      <p className="text-[13px] font-medium text-slate-400">Application submitted successfully.</p>
                    </div>
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-slate-200 shrink-0">
                      <Bell className="w-5 h-5 text-slate-500" />
                    </Button>
                  </div>

                  {/* 1. Onboarding Status Card */}
                  <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                          <Clock className="w-4.5 h-4.5 text-slate-400"/> Onboarding Status
                        </CardTitle>
                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200/50 rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> In Progress
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-6">
                      <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                        <div className="relative pl-6">
                          <div className="absolute -left-[13px] bg-white p-1">
                            <div className="bg-emerald-500 text-white rounded-full p-0.5">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <p className="text-[14px] text-slate-900 font-semibold leading-none">Profile Created</p>
                            <p className="text-[12px] text-slate-400 mt-1 font-medium">Your details are saved</p>
                          </div>
                          <div className="absolute top-6 -left-[13px] w-0.5 h-6 bg-slate-100 ml-[11px]"></div>
                        </div>

                        <div className="relative pl-6">
                          <div className="absolute -left-[13px] bg-white p-1">
                            <div className="bg-emerald-500 text-white rounded-full p-0.5">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <p className="text-[14px] text-slate-900 font-semibold leading-none">Questionnaire Completed</p>
                            <p className="text-[12px] text-slate-400 mt-1 font-medium">Preferences recorded</p>
                          </div>
                          <div className="absolute top-6 -left-[13px] w-0.5 h-6 bg-slate-100 ml-[11px]"></div>
                        </div>

                        <div className="relative pl-6">
                          <div className="absolute -left-[13px] bg-white p-1">
                            <div className="bg-amber-500 text-white rounded-full p-0.5 shadow-sm animate-pulse">
                              <Search className="w-3.5 h-3.5" strokeWidth={3} />
                            </div>
                          </div>
                          <div>
                            <p className="text-[14px] text-amber-600 font-semibold leading-none">Finding Best Mentor...</p>
                            <p className="text-[12px] text-slate-400 mt-1 font-medium">Matching based on your goals (Est: 24-48 hrs)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Profile Overview Card (Combined, Clean, No Nested Boxes) */}
                  <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                          <User className="w-4.5 h-4.5 text-slate-400"/> Profile Overview
                        </CardTitle>
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200/50 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                          Complete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 pb-5 space-y-4">
                      {/* Name Row */}
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-xl shrink-0">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Full Name</p>
                          <p className="text-[14px] text-slate-800 font-semibold">{name || "Guest Student"}</p>
                        </div>
                      </div>
                      
                      <div className="h-px bg-slate-100 w-full" />

                      {/* Email Row */}
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-xl shrink-0">
                          <Mail className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Email</p>
                          <p className="text-[14px] text-slate-800 font-semibold">{email || "guest.student@kindmentor.com"}</p>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 w-full" />

                      {/* Preferences */}
                      <div className="space-y-2.5 pt-1">
                        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Your Preferences</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-slate-600 text-[12px] font-semibold">Computer Science / IT</span>
                          <span className="px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-slate-600 text-[12px] font-semibold">Hindi</span>
                          <span className="px-3 py-1.5 rounded-full border border-slate-100 bg-slate-50 text-slate-600 text-[12px] font-semibold">Yes, regularly</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 3. While You Wait Actions Card */}
                  <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <CardTitle className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4.5 h-4.5 text-slate-400"/> While You Wait
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4 pb-4">
                      <button onClick={() => setState("DASHBOARD_MAIN")} className="w-full text-left p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-200 active:scale-99 transition-all flex items-start gap-4 group">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform border border-indigo-100">
                          <BookText className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-slate-900 font-semibold mb-0.5">Explore Courses</p>
                          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">Browse the Python curriculum while you wait</p>
                        </div>
                      </button>
                      <button onClick={() => setState("DASHBOARD_MAIN")} className="w-full text-left p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-200 active:scale-99 transition-all flex items-start gap-4 group">
                        <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform border border-violet-100">
                          <MessageSquare className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-slate-900 font-semibold mb-0.5">Community Circle</p>
                          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">Join the student community to connect with peers</p>
                        </div>
                      </button>
                    </CardContent>
                  </Card>

                  {/* 4. Action Button */}
                  <Button onClick={() => setState("DASHBOARD_MAIN")} className="w-full h-14 rounded-2xl text-[15px] font-semibold flex gap-2 items-center justify-center transition-all bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 mt-2">
                    Explore Dashboard Preview <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}

             {(state === "DASHBOARD_MAIN" || state === "COURSE_DETAILS" || state === "GAMES" || state === "NOTES" || state === "PROFILE" || state === "PORTFOLIO" || state === "WELLNESS" || state === "FACTS" || state === "GRATITUDE_WALL" || state === "MESSAGES" || state === "RESOURCES" || state === "ALL_TASKS") && (
                <motion.div key="student_portal" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col bg-slate-50/50 mesh-bg relative">
                 <div className="flex-1 overflow-y-auto hidden-scrollbar px-6 pt-0 md:px-8 pb-[calc(8rem+env(safe-area-inset-bottom))]">
            
            {state === "MESSAGES" && featureFlags.student_messages !== false && (
              <div className="flex flex-col h-full bg-white font-inter animate-in fade-in slide-in-from-right duration-300 -mx-6 md:-mx-8">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 md:px-8 border-b border-slate-100 flex items-center gap-4 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setState("DASHBOARD_MAIN")}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Button>
                  <div className="flex-1">
                    <h2 className="text-[17px] font-medium text-slate-900 leading-tight">Conversation</h2>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
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
                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 space-y-6 hidden-scrollbar bg-slate-50/40">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <p className="text-slate-800 font-medium text-[15px]">No messages yet</p>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">Start the conversation with your mentor to get guidance on your learning path.</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.from_user_id === mappedMentor?.id ? false : true;
                      const urlRegex = /(https?:\/\/[^\s\)\>]+)/g;
                      const hasLink = msg.body.match(urlRegex);
                      
                      let resourceTitle = "";
                      if (hasLink) {
                        const boldMatch = msg.body.match(/\*\*([^*]+)\*\*/);
                        if (boldMatch) {
                          resourceTitle = boldMatch[1];
                        } else {
                          const bookLine = msg.body.split('\n').find((l: string) => l.includes("📚"));
                          if (bookLine) {
                            resourceTitle = bookLine.replace("📚", "").replace(/\*/g, "").trim();
                          } else {
                            resourceTitle = "Recommended Resource";
                          }
                        }
                      }

                      return (
                        <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative animate-in fade-in slide-in-from-bottom-2 duration-300`} style={{ animationDelay: `${i * 50}ms` }}>
                          <div className="flex items-center gap-2 max-w-[85%]">
                            {isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity" title="Delete Message"><Trash2 className="w-4 h-4" /></button>}
                            <div className={`px-5 py-3.5 rounded-[1.5rem] text-[14.5px] font-medium leading-relaxed ${isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-lg shadow-slate-900/5' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                              <div>{msg.body}</div>
                              {hasLink && (
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setState("RESOURCES");
                                  }}
                                  className={`mt-3 p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all duration-200 cursor-pointer text-left shadow-3xs ${
                                    isMe 
                                      ? "bg-white/10 hover:bg-white/15 border-white/20 text-white" 
                                      : "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100/60 text-slate-800"
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center shadow-3xs bg-white text-indigo-600`}>
                                      <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[12.5px] font-bold leading-tight truncate">
                                        {resourceTitle}
                                      </p>
                                      <p className={`text-[10px] font-semibold mt-0.5 leading-normal truncate ${
                                        isMe ? "text-white/60" : "text-slate-400"
                                      }`}>
                                        {hasLink[0]}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between gap-2 border-t border-dashed pt-2.5 border-slate-100/20">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                      isMe ? "text-white/70" : "text-indigo-600"
                                    }`}>
                                      Open in Resource Hub 🚀
                                    </span>
                                    <ExternalLink className={`w-3 h-3 ${isMe ? "text-white/75" : "text-indigo-600"}`} />
                                  </div>
                                </div>
                              )}
                            </div>
                            {!isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity" title="Delete Message"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                          <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider mt-2 ml-3 mr-3">{isMe ? 'You' : mappedMentor?.name || 'Mentor'}</span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 md:px-8 border-t border-slate-100 bg-white shrink-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
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

            {state === "DASHBOARD_MAIN" && (
              <div className="flex flex-col pt-0 relative w-full items-center pb-32 font-inter">
                <div className="w-full max-w-2xl flex flex-col gap-4">

                
                {/* Premium Welcome Greeting Header */}
                <div className="w-full relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                  <div className="space-y-1 pr-16 sm:pr-0">
                    <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight leading-tight">Welcome Back, {name ? name.split(' ')[0] : 'Student'}! 👋</h2>
                    <p className="text-[13px] font-medium text-slate-400">Step closer to your educational milestones today.</p>
                  </div>
                    <div className="absolute top-1 right-1 flex items-center gap-2 shrink-0 sm:relative sm:top-auto sm:right-auto sm:self-center mr-1">
                      <button
                        onClick={() => setIsFeedbackModalOpen(true)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all"
                        title="Share Feedback"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-slate-600">{coinsCount}</span>
                      </div>
                    </div>
                </div>

                {/* Today's Inspiration & Mentor Chat Card */}
                <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
                  <CardContent className="p-4 pt-5 flex flex-col gap-4">
                    <div className="flex gap-3 w-full relative group/insp">
                      <div className="bg-violet-100 p-3 rounded-full text-violet-600 shrink-0 self-start shadow-sm border border-violet-200/50">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <p className="text-[11px] font-bold text-violet-600 mb-1">
                          {activeInspiration 
                            ? `${activeInspiration.type === "thought" ? "Morning Thought" : "Evening Reflection"} from ${activeInspiration.author}` 
                            : `Day ${Math.max(1, streakCount)} of 60 • Building Your Best Self`}
                        </p>
                        <p className="text-[13px] font-medium text-slate-700 italic leading-relaxed">
                          {activeInspiration 
                            ? `"${activeInspiration.message}"` 
                            : '"Your future self will thank you for today\'s effort."'}
                          <span className="text-slate-400 font-sans not-italic block mt-1 font-medium">
                            — {activeInspiration ? activeInspiration.author : "MentorHub"}
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
                    {featureFlags.student_messages !== false && (
                      <div className="pt-4 border-t border-slate-100/60">
                        {messages.length > 0 && (
                          <div className="mb-2 space-y-3 pr-1">
                            {messages.slice(-1).map((msg, i) => {
                              const isMe = msg.from_user_id === mappedMentor?.id ? false : true;
                              const urlRegex = /(https?:\/\/[^\s\)\>]+)/g;
                              const hasLink = msg.body.match(urlRegex);
                              
                              let resourceTitle = "";
                              if (hasLink) {
                                const boldMatch = msg.body.match(/\*\*([^*]+)\*\*/);
                                if (boldMatch) {
                                  resourceTitle = boldMatch[1];
                                } else {
                                  const bookLine = msg.body.split('\n').find((l: string) => l.includes("📚"));
                                  if (bookLine) {
                                    resourceTitle = bookLine.replace("📚", "").replace(/\*/g, "").trim();
                                  } else {
                                    resourceTitle = "Recommended Resource";
                                  }
                                }
                              }

                              return (
                                <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}>
                                  <div className="flex items-center gap-2 max-w-[85%]">
                                    {isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                    <div className={`px-4 py-2.5 rounded-[1.25rem] text-[13.5px] font-medium leading-relaxed ${isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-sm shadow-slate-900/5' : 'bg-slate-50 text-slate-700 border border-slate-100/60 rounded-tl-none shadow-xs'}`}>
                                      <div>{msg.body}</div>
                                      {hasLink && (
                                        <div 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setState("RESOURCES");
                                          }}
                                          className={`mt-2.5 p-3 rounded-xl border flex flex-col gap-2 transition-all duration-200 cursor-pointer text-left shadow-3xs ${
                                            isMe 
                                              ? "bg-white/10 hover:bg-white/15 border-white/20 text-white" 
                                              : "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100/60 text-slate-800"
                                          }`}
                                        >
                                          <div className="flex items-start gap-2">
                                            <div className="p-1.5 rounded-md shrink-0 flex items-center justify-center bg-white text-indigo-600 shadow-3xs">
                                              <BookOpen className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className="text-[11.5px] font-bold leading-tight truncate">
                                                {resourceTitle}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between gap-2 border-t border-dashed pt-2 border-slate-100/10">
                                            <span className="text-[9px] font-bold uppercase tracking-wider">
                                              Open in Resource Hub 🚀
                                            </span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {!isMe && <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity shrink-0 animate-in fade-in" title="Delete Message"><Trash2 className="w-3.5 h-3.5" /></button>}
                                  </div>
                                  <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider mt-1 ml-2 mr-2">{isMe ? 'You' : mappedMentor?.name || 'Mentor'}</span>
                                </div>
                              );
                            })}
                            {messages.length > 1 && (
                              <div className="flex justify-center -mt-1">
                                <button 
                                  onClick={() => setState("MESSAGES")}
                                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4 py-1.5"
                                >
                                  View all messages
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-400 mb-1 font-medium">
                          {sendSuccess ? (
                            <span className="text-emerald-500 font-medium flex items-center gap-1">
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
                    )}
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

                  const nextLesson = allLessons.find((l: any) => !courseProgress.includes(l.id));

                  return (
                    <div className="flex flex-col">

                      
                      <div 
                        onClick={() => setState("COURSE_DETAILS")}
                        className="w-full p-4 bg-white rounded-[1.25rem] shadow-xs border border-slate-100 hover:border-indigo-100 transition-all active:scale-[0.98] cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Code className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-slate-900 font-medium text-[15px] truncate">{enrolledCourse.title}</p>
                              <p className="text-slate-400 font-medium text-[13px]">{progressPct}%</p>
                            </div>
                            
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden mb-2.5">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>

                            <div className="flex items-center gap-3 text-[12px] font-medium text-slate-400 tracking-tight">
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
                              <p className="text-slate-600 font-medium text-[12px]">
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
                  <div className="flex flex-col items-center justify-center py-4 text-center px-4 bg-white rounded-[1.25rem] border border-dashed border-slate-200 mt-3">
                    <GraduationCap className="w-5 h-5 text-slate-400 mb-1.5" />
                    <h2 className="text-[13.5px] font-semibold text-slate-800 mb-0.5">No Courses Enrolled</h2>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal mb-2.5">
                      Select a learning path to start your journey.
                    </p>
                    <Button onClick={() => setIsCourseCatalogOpen(true)} variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg h-8 px-3 font-semibold text-[11.5px] shadow-none flex items-center gap-1 transition-all">
                      <Plus className="w-3 h-3" /> Browse Catalog
                    </Button>
                  </div>
                )}


                  {/* Tasks & Milestones */}

                {/* Todo List / Course Milestones Widget */}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2.5 px-1">
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-[15px]">
                      <ListChecks className="w-[18px] h-[18px] text-orange-500" /> To-Dos
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
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 p-0 h-auto hover:bg-transparent shadow-none"
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
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 p-0 h-auto hover:bg-transparent shadow-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add To-Do
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[1.5rem] border border-slate-100 p-4 space-y-3 shadow-sm">
                    {/* Course Milestones (from Enrolled Course) */}
                    {enrolledCourse && (
                      <div className="space-y-2">
                        <div className="flex flex-col max-h-[180px] overflow-y-auto hidden-scrollbar pr-1">
                          {(enrolledCourse.content || []).flatMap((mod: any) => 
                            (mod.topics || []).map((topic: string, idx: number) => {
                              const topicId = `${mod.id}-${idx}`;
                              const isCompleted = courseProgress.includes(topicId);
                              return (
                                <div key={topicId} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 transition-all">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div 
                                      onClick={() => handleToggleActivity(topicId)}
                                      className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all shrink-0 ${isCompleted ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 bg-white'}`}
                                    >
                                      {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-[12.5px] font-semibold truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{topic}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-medium uppercase shrink-0 px-2 py-0.5 bg-slate-100/50 rounded-md truncate max-w-[80px]">{mod.title}</span>
                                </div>
                              );
                            })
                          ).slice(0, 4)}
                        </div>
                      </div>
                    )}

                    {/* Custom Student Todos */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1">My To-Dos</p>
                      <div className="flex flex-col max-h-[180px] overflow-y-auto hidden-scrollbar pr-1">
                        {customTodos.length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                            <p className="text-xs text-slate-400 font-medium">No custom to-dos yet. Click "Add To-Do" to start!</p>
                          </div>
                        ) : (
                          customTodos.slice(0, 3).map((todo) => {
                            const isCompleted = todo.status === 'Completed';
                            return (
                              <div key={todo.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 transition-all group">
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
                                  title="Delete to-do"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                      {customTodos.length > 3 && (
                        <button 
                          onClick={() => setState("ALL_TASKS")}
                          className="w-full text-center py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-dashed border-slate-200 mt-3 flex items-center justify-center gap-1.5 bg-white"
                        >
                          <span>See All To-Dos ({customTodos.length})</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  </div>

                
                {/* Dynamic Content Rows */}
                <div className="w-full space-y-2.5">
                  
                  {/* Gaming Quiz Row (Redirects directly to GAMES state) */}
                  {featureFlags.student_games !== false && (
                    <div 
                      onClick={() => setState("GAMES")}
                      className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                    >
                      <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-3.5 rounded-2xl mr-4.5 shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-all"><Swords className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Learning Arena</p>
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
                  )}

                  {/* Running Notes Row (Redirects to NOTES state) */}
                  {featureFlags.student_notes !== false && (
                    <div 
                      onClick={() => setState("NOTES")}
                      className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                    >
                      <div className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><NotebookPen className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Study Notebook</p>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full font-lato">2</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">Text notes & lecture boards</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  )}

                  {/* Learning Resource Hub */}
                  <div 
                    onClick={() => setState("RESOURCES")}
                    className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99"
                  >
                    <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[14.5px] font-medium text-slate-800">Resource Library</p>
                        <span className="bg-indigo-100 text-indigo-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">
                          {messages.filter(msg => msg.body.includes("http://") || msg.body.includes("https://")).length > 0 
                            ? `${messages.filter(msg => msg.body.includes("http://") || msg.body.includes("https://")).length} items` 
                            : "Docs"}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Mentor shared guides & developer reference docs</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                   {/* Gratitude Wall */}
                  {featureFlags.student_gratitude !== false && (
                    <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("GRATITUDE_WALL")}>
                      <div className="bg-rose-50 text-rose-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Heart className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Gratitude Wall</p>
                          <span className="text-rose-500 text-[11px] font-medium font-lato">3 / 12</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">Send tokens of appreciation</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  )}

                  {/* My Portfolio */}
                  {featureFlags.student_portfolio !== false && (
                    <div className="bg-white rounded-[1.25rem] p-4 flex items-center shadow-sm border border-slate-100/50 relative cursor-pointer group hover:shadow-md hover:border-slate-200 transition-all active:scale-99" onClick={() => setState("PORTFOLIO")}>
                      <div className="bg-indigo-50 text-indigo-500 p-3.5 rounded-2xl mr-4.5 shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-all"><Briefcase className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14.5px] font-medium text-slate-800">Showcase Portfolio</p>
                          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-medium px-2 py-0.5 rounded-full font-lato">4 projects</span>
                        </div>
                        <p className="text-[12px] text-slate-400 font-medium">Build as you learn modules</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  )}

                  {/* Mental Wellness card */}
                  {featureFlags.student_wellness !== false && (
                    <div className="bg-gradient-to-r from-[#effdf5] to-[#e0f2fe] rounded-[1.25rem] border border-[#a7f3d0]/30 p-4 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("WELLNESS")}>
                       <div className="flex items-center justify-between relative z-10 mb-3">
                         <div className="flex items-center gap-3">
                           <div className="bg-white/75 text-[#14b8a6] p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Heart className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                           <div>
                             <div className="flex items-center gap-2">
                               <p className="text-[14.5px] font-medium text-teal-900">Mental Wellness</p>
                               <span className="bg-teal-100 text-teal-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                             </div>
                             <p className="text-[12px] text-teal-700/70 font-semibold leading-relaxed mt-0.5">Calm Reset · Gratitude Game · Memes</p>
                           </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-teal-500/50 group-hover:translate-x-0.5 transition-transform" />
                       </div>
                       <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-teal-800/60 relative z-10 px-1">
                         <span className="flex items-center gap-1">🧘 Brain Recharge</span>
                         <span className="flex items-center gap-1">🙏 Gratitude Points</span>
                         <span className="flex items-center gap-1">😂 Daily Memes</span>
                       </div>
                    </div>
                  )}

                  {/* Interesting Facts card */}
                  <div className="bg-gradient-to-r from-[#fefce8] to-[#fffbeb] rounded-[1.25rem] border border-[#fde047]/30 p-4 flex flex-col shadow-sm cursor-pointer relative overflow-hidden group hover:shadow-md transition-all active:scale-99" onClick={() => setState("FACTS")}>
                     <div className="flex items-center justify-between relative z-10 mb-3">
                       <div className="flex items-center gap-3">
                         <div className="bg-amber-100/50 text-amber-600 p-2.5 rounded-xl backdrop-blur-sm shadow-xs group-hover:scale-105 transition-transform"><Lightbulb className="w-[18px] h-[18px]" strokeWidth={2.5} /></div>
                         <div>
                           <div className="flex items-center gap-2">
                             <p className="text-[14.5px] font-medium text-amber-900">Interesting Facts</p>
                             <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">New</span>
                           </div>
                           <p className="text-[12px] text-amber-700/70 font-semibold leading-relaxed mt-0.5">Small facts. Big inspiration.</p>
                         </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-amber-500/50 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-amber-800/60 relative z-10 px-1">
                       <span className="flex items-center gap-1">🧠 Brain & Learning</span>
                       <span className="flex items-center gap-1">💻 Tech & Code</span>
                       <span className="flex items-center gap-1">🏆 Challenges</span>
                     </div>
                  </div>

                  {/* Mentor's Thought of the Day */}
                  <div className="bg-slate-100/50 rounded-[1.25rem] p-5 shadow-sm mt-4 border border-slate-100/50 flex flex-col">
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-[14px] mb-3">
                      <Sun className="w-4 h-4 text-orange-500 animate-spin-slow" strokeWidth={2.5} /> Mentor's Thought of the Day
                    </div>
                    <div className="bg-white rounded-2xl p-4 italic text-slate-700 text-[14px] leading-relaxed relative border border-slate-100/30 font-medium shadow-xs">
                      "Consistency beats intensity. Practice a little every day."
                      <span className="block text-slate-400 not-italic text-[12px] font-medium uppercase tracking-wider mt-2">— Pradeep K.</span>
                    </div>
                    <button className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded-2xl mt-3.5 font-medium text-[13px] flex gap-2 items-center justify-center transition-all active:scale-98 shadow-sm h-12">
                      <Heart className="w-[18px] h-[18px] fill-current text-rose-500 animate-pulse" /> Read & Reflect
                    </button>
                    <div className="flex justify-between items-center mt-4 px-1">
                      <p className="text-[12px] font-medium text-orange-500 flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {streakCount}-day streak</p>
                      <p className="text-[12px] font-medium text-amber-600 flex items-center gap-1"><Coins className="w-3.5 h-3.5 fill-amber-100" /> +5 XP per reflection</p>
                    </div>
                  </div>
                </div>

                {/* Footer Stats Row */}
                <div className="mt-4 mb-4 flex justify-between bg-white rounded-[1.25rem] p-5 shadow-sm border border-slate-100/50">
                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Day Streak</span>
                     <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> {streakCount}</span>
                   </div>
                   <div className="w-px bg-slate-100 my-1"></div>
                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Coins</span>
                     <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><Coins className="w-5 h-5 text-amber-500 fill-amber-500" /> {coinsCount}</span>
                   </div>
                   <div className="w-px bg-slate-100 my-1"></div>
                   <div className="flex flex-col gap-1.5">
                     <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Progress</span>
                     <span className="text-[17px] font-medium tracking-tight flex items-center gap-2 text-slate-900"><TrendingUp className="w-5 h-5 text-emerald-500" /> 85%</span>
                   </div>
                </div>

                {/* Final Quote */}
                <div className="text-center pb-[calc(8rem+env(safe-area-inset-bottom))] flex flex-col gap-1 items-center mb-4">
                   <p className="text-slate-400/80 italic text-[13px] relative flex gap-2"><Quote className="w-4 h-4 shrink-0 text-slate-300" /> "You're doing great, keep pushing!"</p>
                   <p className="text-slate-300 text-[12px] font-medium ml-6">— Pradeep K.</p>
                </div>
                </div>
              </div>
            )}

            {state === "COURSE_DETAILS" && featureFlags.student_courses !== false && (
              <div className="flex flex-col h-full bg-white font-inter animate-in fade-in slide-in-from-right duration-300 -mx-6 md:-mx-8">
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
                      completedLessons={courseProgress}
                      onToggleLesson={handleToggleActivity}
                      onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                    />
                  );
                })()}
              </div>
            )}

            {state === "GAMES" && featureFlags.student_games !== false && (
               <div className="flex flex-col pt-0 bg-slate-50 pb-[calc(8rem+env(safe-area-inset-bottom))] -mx-6 md:-mx-8 px-0 overflow-hidden">
                <StudentGames
                  userName={name || "Student"}
                  userCoins={coinsCount}
                  onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                  onBack={() => setState("DASHBOARD_MAIN")}
                  onPlayComplete={handlePlayComplete}
                  enrolledCourse={enrolledCourse}
                  featureFlags={featureFlags}
                />
              </div>
            )}

            {state === "WELLNESS" && featureFlags.student_wellness !== false && (
              <MentalWellness
                coins={coinsCount}
                onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "FACTS" && featureFlags.student_facts !== false && (
              <InterestingFacts
                coins={coinsCount}
                onCoinsEarned={(delta) => updateCoinsInDb(Math.max(0, coinsCount + delta))}
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "PORTFOLIO" && featureFlags.student_portfolio !== false && (
              <StudentPortfolio
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "GRATITUDE_WALL" && featureFlags.student_gratitude !== false && (
              <GratitudeWall
                coins={coinsCount}
                onBack={() => setState("DASHBOARD_MAIN")}
              />
            )}

            {state === "RESOURCES" && (
              <StudentResources
                mappedMentor={mappedMentor}
                messages={messages}
                onBack={() => setState("MESSAGES")}
              />
            )}

            {state === "ALL_TASKS" && (
              <div className="flex flex-col pt-0 bg-slate-50 pb-[calc(8rem+env(safe-area-inset-bottom))] relative min-h-[85vh] -mx-6 md:-mx-8 px-6 md:px-8 font-inter">
                {/* Header */}
                <div className="sticky top-0 bg-slate-50/95 backdrop-blur-md pt-5 pb-4 z-30 px-0 mx-0 flex justify-between items-center border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-100 transition-colors shrink-0">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="text-[16px] font-semibold text-slate-800 leading-tight">My To-Dos</p>
                      <p className="text-[12px] text-slate-400 font-semibold">{customTodos.length} to-do{customTodos.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      setTodoTitleInput("");
                      setTodoNotesInput("");
                      setIsTodoSheetOpen(true);
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                  >
                    <Plus className="w-4 h-4" /> Add To-Do
                  </Button>
                </div>

                {/* To-Dos List */}
                <div className="flex-1 space-y-4">
                  {customTodos.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-white p-8">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
                        <ListChecks className="w-8 h-8" />
                      </div>
                      <p className="text-slate-800 font-semibold text-[15px] mb-1">All caught up!</p>
                      <p className="text-slate-400 text-xs max-w-[240px] mx-auto leading-relaxed">No custom to-dos registered. Create a new to-do to organize your educational roadmap.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[1.5rem] border border-slate-100 p-5 divide-y divide-slate-100 shadow-xs">
                      {customTodos.map((todo) => {
                        const isCompleted = todo.status === 'Completed';
                        return (
                          <div key={todo.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 transition-all group">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div 
                                onClick={() => handleToggleTodoStatus(todo.id)}
                                className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all shrink-0 ${isCompleted ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}
                              >
                                {isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                              </div>
                              <div className="min-w-0">
                                <span className={`text-[14px] font-semibold block truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{todo.title}</span>
                                {todo.notes && <span className="text-[11.5px] text-slate-400 block mt-0.5 leading-relaxed">{todo.notes}</span>}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 shrink-0 rounded-lg hover:bg-red-50"
                              title="Delete to-do"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {state === "NOTES" && featureFlags.student_notes !== false && (
               <div className="flex flex-col pt-0 bg-slate-50 pb-[calc(8rem+env(safe-area-inset-bottom))] relative min-h-[85vh] -mx-6 md:-mx-8 px-6 md:px-8">
                
                {/* Header */}
                <div className="sticky top-0 bg-slate-50/95 backdrop-blur-md pt-5 pb-4 z-30 px-0 mx-0 flex justify-between items-center border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setState("DASHBOARD_MAIN")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-100 shadow-sm border border-slate-100 transition-colors shrink-0">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="text-[16px] font-medium text-slate-800 leading-tight">Running Notes</p>
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
                          <p className="text-[14px] font-medium text-slate-800">New Running Note</p>
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
                              className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 text-xs font-medium transition-all active:scale-[0.98]"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleSaveNote}
                              disabled={!noteContentInput.trim()}
                              className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
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
                      <p className="text-[15px] font-medium text-slate-700">No running notes yet</p>
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
                                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-1 text-[11px] font-medium text-slate-400">
                                    Tap to Expand
                                  </div>
                                )}
                              </button>
                              <div className="px-5 py-4 flex items-center justify-between bg-white border-t border-slate-50">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <Camera className="w-4 h-4 text-orange-400 shrink-0" strokeWidth={2.2} />
                                  <p className="text-[13.5px] font-medium text-slate-800 truncate leading-none">{note.title}</p>
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
               <div className="flex flex-col pt-0 bg-slate-50 pb-[calc(8rem+env(safe-area-inset-bottom))] -mx-6 md:-mx-8 px-0 overflow-hidden">
                
                {/* Purple Top Block */}
                <div className="bg-[#0f172a] pt-8 pb-16 px-6 md:px-8 relative">
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
                       {avatarUrl ? (
                         <div 
                           className="w-[88px] h-[88px] rounded-full border-2 border-white/20 bg-cover bg-center shadow-lg"
                           style={{ backgroundImage: `url(${avatarUrl})` }}
                         ></div>
                       ) : (
                         <div className="w-[88px] h-[88px] rounded-full border-2 border-white/20 flex items-center justify-center bg-slate-800 text-slate-400 shadow-lg">
                           <User className="w-10 h-10 stroke-[1.5]" />
                         </div>
                       )}
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
                <div className="flex-1 bg-slate-50 relative -mt-8 rounded-t-[2rem] px-6 md:px-8 pt-6 pb-8 border border-white">
                  
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
                           <p className="text-[15px] font-medium text-slate-800 tracking-wider">MHUB-0H2CY</p>
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
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                  <div className="w-full max-w-2xl mx-auto flex justify-around items-center px-3 sm:px-12 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                    {featureFlags.student_dashboard !== false && (
                      <button onClick={() => setState("DASHBOARD_MAIN")} className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 ${state === "DASHBOARD_MAIN" ? "text-slate-900 font-semibold" : "text-slate-400 hover:text-slate-600"}`}>
                        <Home className="w-5 h-5" strokeWidth={state === "DASHBOARD_MAIN" ? 2.5 : 2}/>
                        <span className="text-[10px]">Home</span>
                      </button>
                    )}
                    {featureFlags.student_courses !== false && (
                      <button onClick={() => setState("COURSE_DETAILS")} className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 ${state === "COURSE_DETAILS" ? "text-slate-900 font-semibold" : "text-slate-400 hover:text-slate-600"}`}>
                        <BookOpen className="w-5 h-5" strokeWidth={state === "COURSE_DETAILS" ? 2.5 : 2}/>
                        <span className="text-[10px]">Courses</span>
                      </button>
                    )}
                    {featureFlags.student_games !== false && (
                      <button onClick={() => setState("GAMES")} className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 relative ${state === "GAMES" ? "text-slate-900 font-semibold" : "text-slate-400 hover:text-slate-600"}`}>
                        <Gamepad2 className="w-5 h-5" strokeWidth={state === "GAMES" ? 2.5 : 2}/>
                        {state !== "GAMES" && <div className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}
                        <span className="text-[10px]">Games</span>
                      </button>
                    )}
                    {featureFlags.student_notes !== false && (
                      <button onClick={() => setState("NOTES")} className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 ${state === "NOTES" ? "text-slate-900 font-semibold" : "text-slate-400 hover:text-slate-600"}`}>
                        <NotebookPen className="w-5 h-5" strokeWidth={state === "NOTES" ? 2.5 : 2}/>
                        <span className="text-[10px]">Notes</span>
                      </button>
                    )}
                    <button onClick={() => setState("PROFILE")} className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 ${state === "PROFILE" ? "text-slate-900 font-semibold" : "text-slate-400 hover:text-slate-600"}`}>
                      <User className="w-5 h-5" strokeWidth={state === "PROFILE" ? 2.5 : 2}/>
                      <span className="text-[10px]">Profile</span>
                    </button>
                  </div>
                </div>

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
                            <h3 className="text-[17px] font-medium tracking-tight">Schedule 1:1 Session</h3>
                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">With {mappedMentor?.name || "your Mentor"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleScheduleSession} className="p-6 space-y-4 overflow-y-auto hidden-scrollbar pb-8">
                        
                        {/* Session Title */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Session Title</Label>
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
                          <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Topics / Notes</Label>
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
                            <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Date</Label>
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
                            <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Time</Label>
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
                          <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Duration</Label>
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
                            className="flex-1 h-11 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-medium"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 h-11 rounded-xl bg-[#0f172a] text-white hover:bg-slate-800 font-medium text-xs shadow-md"
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
                            <h3 className="text-[17px] font-medium tracking-tight">Add Custom To-Do</h3>
                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Keep track of your study objectives</p>
                          </div>
                        </div>
                      </div>

                      {/* Todo Form */}
                      <form onSubmit={handleAddTodo} className="p-5 space-y-4 overflow-y-auto hidden-scrollbar pb-8">
                        
                        {/* To-Do Title */}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">To-Do Title</Label>
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
                          <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Notes / Description</Label>
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
                            className="flex-1 h-11 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-medium"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 h-11 rounded-xl bg-[#0f172a] text-white hover:bg-slate-800 font-medium text-xs shadow-md"
                          >
                            Create To-Do
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
                            <h3 className="text-[17px] font-medium tracking-tight">Explore Learning Paths</h3>
                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Choose from expert-designed courses</p>
                          </div>
                        </div>
                      </div>

                      {/* Course Catalog List */}
                      <div className="p-5 space-y-3.5 overflow-y-auto hidden-scrollbar flex-1">
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
                                    <h4 className="text-[14.5px] font-medium text-slate-800 truncate">{course.title}</h4>
                                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                                      {activeModCount} modules · {totalLessons || "Comprehensive"} lessons
                                    </p>
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  {isEnrolled ? (
                                    <div className="flex flex-col items-end gap-1.5">
                                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Enrolled
                                      </span>
                                      <button 
                                        onClick={() => handleStudentEnrollCourse(course, true)}
                                        className="text-[10px] text-slate-400 font-medium hover:text-red-500 transition-colors uppercase tracking-tight flex items-center gap-1"
                                      >
                                        <RotateCcw className="w-2.5 h-2.5" /> Override
                                      </button>
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => handleStudentEnrollCourse(course)}
                                      disabled={enrollingCourseId === course.id}
                                      className="bg-[#0f172a] hover:bg-slate-800 text-white font-medium text-xs h-8 px-3.5 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
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
              <motion.div key="mentor_profile" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col pt-4 overflow-y-auto hidden-scrollbar">
                <div className="mb-2 shrink-0">
                  <button onClick={() => setState("ROLE")} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center mb-6 mt-2 shrink-0">
                  <div className="relative">
                    {avatarUrl ? (
                      <div 
                        className="w-[104px] h-[104px] rounded-full border border-slate-200 bg-cover bg-center shadow-sm"
                        style={{ backgroundImage: `url(${avatarUrl})` }}
                      ></div>
                    ) : (
                      <div className="w-[104px] h-[104px] rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-300 shadow-sm">
                        <User className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 w-[34px] h-[34px] bg-[#0f172a] rounded-full flex items-center justify-center text-white ring-[3px] ring-white shadow-sm hover:scale-105 transition-transform">
                      <Camera className="w-[15px] h-[15px]" />
                    </button>
                  </div>
                </div>

                <div className="mb-6 space-y-1.5 shrink-0">
                  <h2 className="text-lg font-medium text-slate-900">Your profile</h2>
                  <p className="text-[14px] text-slate-500">Tell us a little about yourself.</p>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label className="text-[13px] text-slate-600 font-medium ml-1">Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-[50px] rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] text-slate-600 font-medium ml-1">Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="h-[50px] rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] text-slate-600 font-medium ml-1">Your expertise</Label>
                    <Textarea value={mentorExpertise} onChange={e => setMentorExpertise(e.target.value)} placeholder="e.g. UX Design, Product Strategy..." className="min-h-[110px] resize-none rounded-xl border-slate-200 text-[15px] placeholder:text-slate-400 bg-slate-50/50" />
                  </div>
                </div>

                <div className="mt-8 shrink-0 flex flex-col">
                  <Button disabled={!name || !email} onClick={() => setState("MENTOR_QUIZ")} className={`w-full h-[52px] rounded-xl text-[15px] font-medium transition-all ${name && email ? "bg-[#0f172a] text-white hover:bg-[#1e293b]" : "bg-slate-200/60 text-slate-400"}`}>
                    Continue <ArrowRight className="w-[18px] h-[18px] ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {state === "MENTOR_QUIZ" && mentorQuizSteps.length > 0 && (
              <div className="w-full">
                {(() => {
                  const currentData = mentorQuizSteps[mentorQuizIndex];
                  const Icon = getIcon(currentData.icon as any);
                  return (
                    <>
                      <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                          <p className="text-blue-600 text-[11px] font-medium uppercase tracking-widest mb-1">Mentor Application ({currentData.step} of {mentorQuizSteps.length})</p>
                          <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight">{currentData.title}</h2>
                        </div>
                        <button 
                          onClick={() => {
                            if (mentorQuizIndex > 0) {
                              setMentorQuizIndex(mentorQuizIndex - 1);
                            } else {
                              setState("MENTOR_PROFILE");
                            }
                          }} 
                          className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-1 text-[13px] font-medium px-4"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      </div>

                      <div className="space-y-8">
                        {currentData.questions.map((q: any) => (
                          <div key={q.id} className="space-y-3">
                            <Label className="text-[14px] font-medium text-slate-700">{q.text}</Label>
                            {q.type === "input" ? (
                              <Input 
                                placeholder={q.placeholder}
                                value={(selections[q.id] as string) || ""}
                                onChange={(e) => setSelections({ ...selections, [q.id]: e.target.value })}
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                            ) : (
                              <div className="space-y-1.5 pt-1">
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    const optionsList = q.options || [];
                                    const isExpanded = !!expandedQuestions[q.id];
                                    const displayedOpts = (() => {
                                      if (optionsList.length <= 5 || isExpanded) return optionsList;
                                      const base = optionsList.slice(0, 4);
                                      const other = optionsList.find((opt: string) => opt.toLowerCase() === 'other');
                                      if (other && !base.includes(other)) {
                                        return [...base, other];
                                      }
                                      return base;
                                    })();
                                    return displayedOpts.map((opt: string) => (
                                      <SelectionChip
                                        key={opt}
                                        label={opt}
                                        active={selections[q.id] === opt}
                                        onClick={() => setSelections({ ...selections, [q.id]: opt })}
                                      />
                                    ));
                                  })()}
                                </div>
                                {q.options && q.options.length > 5 && (
                                  <button 
                                    type="button"
                                    onClick={() => setExpandedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                    className="text-[12px] text-blue-600 font-semibold hover:text-blue-700 transition-colors ml-1 mt-1 hover:underline cursor-pointer inline-flex items-center gap-1"
                                  >
                                    {expandedQuestions[q.id] ? "Show Less" : `+ ${q.options.length - (q.options.slice(0, 4).includes(q.options.find((opt: string) => opt.toLowerCase() === 'other') || '') ? 4 : 5)} More`}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 flex flex-col">
                        <Button 
                          onClick={() => mentorQuizIndex < mentorQuizSteps.length - 1 ? setMentorQuizIndex(mentorQuizIndex + 1) : saveProfileData("MENTOR")} 
                          className={cn(
                            "w-full h-14 rounded-2xl font-medium text-[15px] transition-all",
                            (selections['q101'] || selections['q102'] || selections['q103'] || selections['q104'] || mentorQuizIndex >= 0) 
                              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200" 
                              : "bg-slate-200 text-slate-400 pointer-events-none"
                          )}
                        >
                          {mentorQuizIndex === mentorQuizSteps.length - 1 ? "Complete Application" : "Continue"} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {state === "MENTOR_MATCHING" && (
              <motion.div key="mentor_matching" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col bg-white overflow-y-auto hidden-scrollbar pb-[calc(12rem+env(safe-area-inset-bottom))] px-6 md:px-8 items-center">
                <div className="w-full max-w-2xl flex flex-col gap-5 pt-8">
                  
                  {/* Header */}
                  <div className="w-full relative flex items-center justify-between gap-4 shrink-0 border-b border-slate-100 pb-5 mb-1">
                    <div className="space-y-1">
                      <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight leading-tight">Welcome, {name ? name.split(' ')[0] : 'Satya'}! 👋</h2>
                      <p className="text-[13px] font-medium text-slate-400">Review & select your first students to mentor.</p>
                    </div>
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-slate-200 shrink-0">
                      <Bell className="w-5 h-5 text-slate-500" />
                    </Button>
                  </div>

                  {/* Banner */}
                  <Card className="bg-indigo-50/60 border border-indigo-100/40 p-5 rounded-[1.25rem] flex items-start gap-3.5 relative overflow-hidden shadow-3xs">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
                    <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="relative z-10">
                       <p className="text-[13px] font-semibold text-slate-800 mb-1 leading-tight">{realStudents.length} student{realStudents.length !== 1 ? 's' : ''} {realStudents.length === 1 ? 'is' : 'are'} waiting for a mentor</p>
                       <p className="text-[12px] text-slate-500 leading-relaxed font-medium">Select the students you&apos;d like to mentor. You can review their profiles and questionnaire responses below.</p>
                    </div>
                  </Card>

                  {/* Sort Bar */}
                  <div className="flex items-center gap-3 mt-1 mb-1 px-1">
                     <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Sort by:</span>
                     <button className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[12px] font-semibold shadow-sm transition-all hover:bg-slate-800">Best Match</button>
                     <button className="bg-white text-slate-600 hover:bg-slate-50 px-4 py-1.5 rounded-full text-[12px] font-semibold border border-slate-100 shadow-3xs transition-all">Recent</button>
                  </div>

                  {/* Student List */}
                  <div className="space-y-4">
                    {realStudents.map(student => {
                      const isExpanded = expandedStudents.includes(student.id);
                      const isSelected = selectedStudents.includes(student.id);
                      return (
                      <Card key={student.id} className={`bg-white rounded-[1.5rem] border ${isSelected ? 'border-slate-900 shadow-xs ring-1 ring-slate-900' : 'border-slate-100'} p-5.5 transition-all relative flex flex-col hover:border-slate-200`}>
                        
                        {isExpanded ? (
                          <div className="flex flex-col">
                            {/* Expanded Header info */}
                            <div className="flex gap-4 mb-4">
                              <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50 flex items-center justify-center relative">
                                  {student.avatar_url ? (
                                    <img 
                                      className="w-full h-full object-cover" 
                                      src={student.avatar_url} 
                                      alt={student.name}
                                    />
                                  ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(student.id)} flex items-center justify-center text-white font-black text-lg uppercase tracking-tight shadow-inner`}>
                                      {student.name ? student.name.trim().charAt(0).toUpperCase() : '?'}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                  <h3 className="text-[15px] font-medium text-slate-800">{student.name}</h3>
                                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${student.match.startsWith('9') ? 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]' : 'bg-[#eff6ff] text-[#3b82f6] border-[#bfdbfe]'}`}>{student.match} match</span>
                                </div>
                                <p className="text-[12px] text-slate-500 leading-relaxed font-medium line-clamp-1">{student.desc}</p>
                              </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center gap-2 mb-4 text-[13px] text-slate-600 w-full border border-slate-100/50">
                              <Mail className="w-4 h-4 shrink-0 text-slate-400" /> <span className="font-semibold">{student.email || "student@example.com"}</span>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-indigo-50/50">
                              <div className="flex items-center gap-2 text-indigo-600 mb-2.5">
                                <Target className="w-4 h-4 shrink-0" />
                                <span className="text-[13px] font-semibold">Learning Goal</span>
                              </div>
                              <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                                {student.desc}
                              </p>
                            </div>
                            
                            <div className="mb-6 px-1">
                              <div className="flex items-center gap-2 text-slate-500 mb-4">
                                <BookOpen className="w-[18px] h-[18px] shrink-0" />
                                <span className="text-[13px] font-semibold text-slate-700">Questionnaire Responses</span>
                              </div>
                              <div className="space-y-3.5">
                                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[13.5px] gap-1 border-b border-slate-100/50 pb-2.5">
                                   <span className="text-slate-400">Inspiration</span>
                                   <span className="text-slate-800 font-medium text-right">{student.preferences?.inspiration || "A teacher/mentor"}</span>
                                 </div>
                                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[13.5px] gap-1 border-b border-slate-100/50 pb-2.5">
                                   <span className="text-slate-400">Movie Preference</span>
                                   <span className="text-slate-800 font-medium text-right">{student.preferences?.movie || "Sci-fi / Technology"}</span>
                                 </div>
                                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[13.5px] gap-1 border-b border-slate-100/50 pb-2.5">
                                   <span className="text-slate-400">Learning Style</span>
                                   <span className="text-slate-800 font-medium text-right">{student.preferences?.style || "Hands-on projects"}</span>
                                 </div>
                                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[13.5px] gap-1 pb-1">
                                   <span className="text-slate-400">Location</span>
                                   <span className="text-slate-800 font-medium text-right">{student.preferences?.location || student.location || "Mumbai, India"}</span>
                                 </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button onClick={(e) => { e.stopPropagation(); setSelectedStudents(prev => isSelected ? prev.filter(id => id !== student.id) : [...prev, student.id]); }} className={`flex-1 py-5 rounded-[12px] text-[13.5px] font-medium flex items-center justify-center gap-2 transition-all ${isSelected ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'}`}>
                                {isSelected ? "Deselect Student" : <><Check className="w-4 h-4" /> Select Student</>}
                              </Button>
                              <Button variant="ghost" onClick={(e) => { e.stopPropagation(); setExpandedStudents(prev => prev.filter(id => id !== student.id)); }} className="text-[13px] text-slate-400 font-medium hover:text-slate-600 hover:bg-slate-100/50 rounded-[12px]">
                                Collapse
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div onClick={() => setSelectedStudents(prev => isSelected ? prev.filter(id => id !== student.id) : [...prev, student.id])} className="cursor-pointer">
                            <div className="flex gap-4">
                              <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50 flex items-center justify-center relative">
                                  {student.avatar_url ? (
                                    <img 
                                      className="w-full h-full object-cover" 
                                      src={student.avatar_url} 
                                      alt={student.name}
                                    />
                                  ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(student.id)} flex items-center justify-center text-white font-black text-lg uppercase tracking-tight shadow-inner`}>
                                      {student.name ? student.name.trim().charAt(0).toUpperCase() : '?'}
                                    </div>
                                  )}
                                </div>
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
                                    <span key={tag} className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 px-2.5 py-1 rounded-md font-medium">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100/50 flex justify-center text-[12px] text-slate-400 font-semibold items-center gap-1 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setExpandedStudents(prev => [...prev, student.id]); }}>
                              View Full Profile <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </Card>
                    )})}
                  </div>
                </div>

                {/* Fixed Bottom Action Container */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col p-5 sm:rounded-b-2xl z-50">
                   <div className="w-full max-w-2xl mx-auto flex flex-col">
                     <Button onClick={async () => { if(selectedStudents.length > 0) { await markMatchingAsSeen(); } }} className={`w-full h-[52px] rounded-xl text-[14px] font-semibold flex gap-2 items-center justify-center transition-all shadow-md ${selectedStudents.length > 0 ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10 active:scale-[0.98]" : "bg-slate-200/60 text-slate-400 pointer-events-none"}`}>
                       {selectedStudents.length > 0 ? `Select ${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''}` : "Select at least one student"}
                     </Button>
                     <button onClick={markMatchingAsSeen} className="text-[12px] text-slate-400 font-semibold hover:text-slate-600 mt-4 text-center transition-colors">
                       Skip for now — I&apos;ll review students later
                     </button>
                   </div>
                </div>

              </motion.div>
            )}

             {(state === "MENTOR_DASHBOARD" || state === "MENTOR_STUDENTS" || state === "MENTOR_COURSES" || state === "MENTOR_NOTES" || state === "MENTOR_CIRCLE" || state === "MENTOR_ACCOUNT") && (
                <motion.div key="mentor_portal" variants={variants} initial="initial" animate="enter" exit="exit" className="h-full flex flex-col bg-slate-50/50 mesh-bg relative font-inter">
                  <div className="flex-1 overflow-y-auto hidden-scrollbar px-6 pt-0 md:px-8 pb-[calc(8rem+env(safe-area-inset-bottom))]">
                   
                   {/* Mentor Portal Shared Header (only for main dashboard) */}
                   {state === "MENTOR_DASHBOARD" && (
                     <div className="w-full flex flex-col pt-0 pb-2 gap-4">
                        <div className="w-full flex justify-between items-center">
                          <div className="space-y-1">
                            <h2 className="text-xl font-medium tracking-tight text-slate-900 tracking-tight leading-tight">Welcome Back, {name ? name.split(' ')[0] : 'Mentor'}! 👋</h2>
                            <p className="text-[13px] font-medium text-slate-400">Your guidance makes all the difference today.</p>
                          </div>
                          <button
                            onClick={() => setIsFeedbackModalOpen(true)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all shrink-0"
                            title="Share Feedback"
                          >
                            <MessageSquare className="w-4.5 h-4.5" />
                          </button>
                        </div>
                     </div>
                   )}
                  {state === "MENTOR_DASHBOARD" && featureFlags.mentor_dashboard !== false && (
                    <MentorHome 
                      featureFlags={featureFlags} 
                      onSelectStudent={(studentId) => {
                        setActiveStudentId(studentId);
                        setState("MENTOR_STUDENTS");
                      }} 
                    />
                  )}
                  {state === "MENTOR_STUDENTS" && featureFlags.mentor_students !== false && (
                    <MentorStudents 
                      activeStudentId={activeStudentId} 
                      onSelectStudent={setActiveStudentId} 
                    />
                  )}
                  {state === "MENTOR_COURSES" && featureFlags.mentor_courses !== false && <MentorCourses />}
                  {state === "MENTOR_NOTES" && featureFlags.mentor_sessions !== false && <MentorNotes />}
                  {state === "MENTOR_CIRCLE" && featureFlags.mentor_circle !== false && <MentorCircle />}
                  {state === "MENTOR_ACCOUNT" && featureFlags.mentor_account !== false && <MentorProfile onSignOut={handleSignOut} />}
                </div>

                  {/* Bottom Navigation - Premium Mentor Style */}
                  <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100/80 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
                    <div className="w-full max-w-2xl mx-auto flex justify-around items-center px-3 sm:px-12 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                      {featureFlags.mentor_dashboard !== false && <button onClick={() => setState("MENTOR_DASHBOARD")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_DASHBOARD" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                        <Home className={`w-5 h-5 ${state === "MENTOR_DASHBOARD" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_DASHBOARD" ? 2.5 : 2}/>
                        <span className={`text-[10px] ${state === "MENTOR_DASHBOARD" ? "font-semibold" : "font-medium"}`}>Home</span>
                      </button>}
                      {featureFlags.mentor_students !== false && <button onClick={() => setState("MENTOR_STUDENTS")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_STUDENTS" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                        <Users className={`w-5 h-5 ${state === "MENTOR_STUDENTS" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_STUDENTS" ? 2.5 : 2}/>
                        <span className={`text-[10px] ${state === "MENTOR_STUDENTS" ? "font-semibold" : "font-medium"}`}>Students</span>
                      </button>}
                      {featureFlags.mentor_courses !== false && <button onClick={() => setState("MENTOR_COURSES")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_COURSES" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                        <GraduationCap className={`w-5 h-5 ${state === "MENTOR_COURSES" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_COURSES" ? 2.5 : 2}/>
                        <span className={`text-[10px] ${state === "MENTOR_COURSES" ? "font-semibold" : "font-medium"}`}>Courses</span>
                      </button>}
                      {featureFlags.mentor_sessions !== false && <button onClick={() => setState("MENTOR_NOTES")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_NOTES" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                        <NotebookPen className={`w-5 h-5 ${state === "MENTOR_NOTES" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_NOTES" ? 2.5 : 2}/>
                        <span className={`text-[10px] ${state === "MENTOR_NOTES" ? "font-semibold" : "font-medium"}`}>Notes</span>
                      </button>}
                      {featureFlags.mentor_circle !== false && <button onClick={() => setState("MENTOR_CIRCLE")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_CIRCLE" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                        <Users className={`w-5 h-5 ${state === "MENTOR_CIRCLE" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_CIRCLE" ? 2.5 : 2}/>
                        <span className={`text-[10px] ${state === "MENTOR_CIRCLE" ? "font-semibold" : "font-medium"}`}>Circle</span>
                      </button>}
                      {featureFlags.mentor_account !== false && <button onClick={() => setState("MENTOR_ACCOUNT")} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${state === "MENTOR_ACCOUNT" ? "text-slate-900 scale-110" : "text-slate-400 hover:text-slate-600 hover:scale-105"}`}>
                        <User className={`w-5 h-5 ${state === "MENTOR_ACCOUNT" ? "fill-slate-900" : ""}`} strokeWidth={state === "MENTOR_ACCOUNT" ? 2.5 : 2}/>
                        <span className={`text-[10px] ${state === "MENTOR_ACCOUNT" ? "font-semibold" : "font-medium"}`}>Profile</span>
                      </button>}
                    </div>
                  </div>
              </motion.div>
            )}

          </AnimatePresence>



          <AnimatePresence>
            {isFeedbackModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100/80 flex flex-col relative font-inter"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setIsFeedbackModalOpen(false);
                      setFeedbackMessage("");
                      setFeedbackImageUrl("");
                    }}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-50 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header Section */}
                  <div className="p-6 pb-4 border-b border-slate-50 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-3xs shrink-0">
                      <MessageSquare className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight">Share Your Feedback</h3>
                      <p className="text-[11.5px] font-semibold text-indigo-500 uppercase tracking-widest mt-1">Platform Improvement</p>
                    </div>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">Your Message <span className="text-red-500">*</span></label>
                      <textarea
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="What went well? What can we do better? Found a bug? Let us know in detail!"
                        rows={4}
                        required
                        className="w-full border border-slate-200 rounded-2xl px-5 py-4 bg-slate-50 text-[14px] text-slate-800 outline-none hover:bg-slate-50/50 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-0.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Screenshot URL <span className="text-slate-350 font-normal font-sans tracking-normal capitalize">(Optional)</span></label>
                        <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                      <input
                        type="url"
                        value={feedbackImageUrl}
                        onChange={(e) => setFeedbackImageUrl(e.target.value)}
                        placeholder="Paste link to an image/screenshot (e.g. imgur link)"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 bg-slate-50 text-[13px] text-slate-800 outline-none hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner"
                      />
                    </div>

                    {feedbackImageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-100 max-h-32 flex justify-center bg-slate-50">
                        <img
                          src={feedbackImageUrl}
                          alt="Feedback attachment preview"
                          className="object-cover w-full h-full max-h-32"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer Section */}
                  <div className="p-5 border-t border-slate-50 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="hidden xs:block">
                      <p className="text-[10px] text-slate-400 leading-none">Submitting as:</p>
                      <p className="text-[11px] text-slate-600 font-bold leading-none mt-1.5 truncate max-w-[130px]">{name || "Student"}</p>
                    </div>
                    <div className="flex gap-2.5 ml-auto w-full xs:w-auto">
                      <button
                        onClick={() => {
                          setIsFeedbackModalOpen(false);
                          setFeedbackMessage("");
                          setFeedbackImageUrl("");
                        }}
                        className="flex-1 xs:flex-none h-11 px-5 border border-slate-200 hover:border-slate-300 bg-white text-[13px] font-semibold text-slate-600 rounded-xl active:scale-95 transition-all shadow-3xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={isSubmittingFeedback || !feedbackMessage.trim()}
                        className="flex-1 xs:flex-none h-11 px-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-slate-950/15"
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Feedback</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
