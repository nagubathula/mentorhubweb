"use client";

import { MessageSquare, Calendar, Circle, Check, Zap, Trophy, ShieldCheck, Heart, Sparkles, BookOpen, Clock, Activity, Medal, Star, Flame, Lightbulb, Bell, X, Send, Trash2, Users, ChevronDown, ChevronRight, GraduationCap, FileText, Share2, Pencil, Video, Link, Package, Layers, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { MentorPlaybook } from "./MentorPlaybook";
import { MentorInspiration } from "./MentorInspiration";
import { MentorCircle } from "./MentorCircle";
import { MentorNotes } from "./MentorNotes";
import { MentorCourses } from "./MentorCourses";
import { MentorShareMaterials } from "./MentorShareMaterials";

const supabase = createClient();

const ROADMAP_WEEKS = [
  {
    week: 1,
    title: "Introduction & Goals",
    items: ["Understand student goals", "Define target role", "Create growth plan"],
    status: "completed"
  },
  {
    week: 2,
    title: "Course Guidance",
    items: ["Explain course roadmap", "Set weekly milestones", "Share resources & best practices"],
    status: "completed"
  },
  {
    week: 3,
    title: "Learning Support",
    items: ["Review progress and assignments", "Solve learning blockers", "Build consistency"],
    status: "active"
  },
  {
    week: 4,
    title: "Resume, Portfolio & Branding",
    items: ["Build resume and portfolio", "Improve LinkedIn profile", "Showcase projects effectively"],
    status: "upcoming"
  },
  {
    week: 5,
    title: "Project Improvement",
    items: ["Refine course projects", "Improve storytelling and visuals", "Create portfolio-ready work"],
    status: "upcoming"
  },
  {
    week: 6,
    title: "Communication & Confidence",
    items: ["Practice presentations", "Improve project explanation", "Build confidence"],
    status: "upcoming"
  },
  {
    week: 7,
    title: "Interview & Career Prep",
    items: ["Practice interview questions", "Explore opportunities", "Learn networking basics"],
    status: "upcoming"
  },
  {
    week: 8,
    title: "Final Review & Launch",
    items: ["Final resume review", "Polish portfolio", "Start applying 🚀"],
    status: "upcoming"
  }
];

const AESTHETIC_GRADIENTS = [
  "from-slate-900 to-slate-800",
  "from-blue-900 to-slate-900",
  "from-slate-800 to-blue-950",
  "from-blue-800 to-slate-900",
  "from-slate-900 to-blue-900",
  "from-blue-950 to-slate-900",
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

const STUDENT_AESTHETIC_GRADIENTS = [
  "from-blue-50 to-slate-100 text-indigo-700 border-indigo-200/60",
  "from-slate-50 to-blue-50 text-slate-700 border-slate-200",
  "from-blue-50/80 to-slate-100 text-indigo-600 border-indigo-200/50",
  "from-slate-100 to-blue-50 text-slate-800 border-slate-200/80",
];

const getStudentAestheticGradient = (id: string) => {
  if (!id) return STUDENT_AESTHETIC_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % STUDENT_AESTHETIC_GRADIENTS.length;
  return STUDENT_AESTHETIC_GRADIENTS[index];
};

const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
};

const getProgressStyles = (pct: number) => {
  return { stroke: "#3b82f6", bg: "bg-[#3b82f6]", text: "text-[#3b82f6]" };
};

interface MentorHomeProps {
  featureFlags?: Record<string, boolean>;
  onSelectStudent?: (studentId: string) => void;
  onNavigateToPack?: () => void;
  mentorEmail?: string;
  mentorName?: string;
}

export function MentorHome({ featureFlags = {}, onSelectStudent, onNavigateToPack, mentorEmail, mentorName: mentorNameProp }: MentorHomeProps) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("mentor_assigned_student_notification_dismissed");
      if (!dismissed) {
        setShowNotification(true);
      }
    }
  }, []);
  const [reviews, setReviews] = useState<any[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(3);
  const [stats, setStats] = useState({ students: 0, hours: 0, rating: 5.0 });
  const [latestGratitude, setLatestGratitude] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [mentorName, setMentorName] = useState(mentorNameProp || "Mentor");
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [activeRoadmapStudentId, setActiveRoadmapStudentId] = useState<string>("");
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMap, setSendSuccessMap] = useState<Record<string, boolean>>({});
  const [sessions, setSessions] = useState<any[]>([]);
  const [outreachStudentId, setOutreachStudentId] = useState<string>("");
  const [showShareMaterials, setShowShareMaterials] = useState(false);
  const [selectedStudentForSharing, setSelectedStudentForSharing] = useState<string>("");
  const [activeFact, setActiveFact] = useState<any>(null);
  const [factCopied, setFactCopied] = useState(false);

  // Share Hub States
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [shareMode, setShareMode] = useState<"bundle" | "course" | "resource" | "task">("bundle");
  
  // All-in-One Bundle state
  const [bundleCourse, setBundleCourse] = useState("");
  const [bundleTask, setBundleTask] = useState("");
  const [bundleResource, setBundleResource] = useState("");
  const [bundleNotes, setBundleNotes] = useState("");

  // Course state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [courseNotes, setCourseNotes] = useState("");

  // Resource state
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  // Task state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [isSharingHub, setIsSharingHub] = useState(false);
  const [shareHubSuccess, setShareHubSuccess] = useState<string | null>(null);

  // Initialize selectedStudentIds with all assigned students once loaded
  useEffect(() => {
    if (assignedStudents.length > 0 && selectedStudentIds.length === 0) {
      setSelectedStudentIds(assignedStudents.map(s => s.id));
    }
  }, [assignedStudents]);

  const handleToggleStudentSelect = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === assignedStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(assignedStudents.map(s => s.id));
    }
  };

  const BUNDLE_PRESETS = [
    {
      label: "🚀 Next.js & React Pack",
      course: "Next.js 16+ App Router Masterclass",
      task: "Build responsive layout & integrate hooks in Week 3 project",
      resource: "https://nextjs.org/docs",
      notes: "Please focus on Server Components vs Client Components before starting the assignment!"
    },
    {
      label: "🎨 UI/UX Design System",
      course: "Figma UI/UX & Product Design Systems",
      task: "Design 3 responsive screens in Figma & export assets",
      resource: "https://lawsofux.com/",
      notes: "Follow the psychological design heuristics when laying out primary call-to-actions."
    },
    {
      label: "⚡ Full Stack Backend Pack",
      course: "Node.js & Supabase Backend Architecture",
      task: "Set up Postgres RLS policies and construct API endpoints",
      resource: "https://supabase.com/docs",
      notes: "Review the indexing primer before running DB migrations."
    },
    {
      label: "📹 Live Sync & Review",
      course: "8-Week Mentor-Led Career Journey",
      task: "Prepare demo of your latest project for live review",
      resource: "GENERATE_MEET_LINK",
      notes: "Let's connect live for 30 minutes to review code and discuss resume updates!"
    }
  ];

  const COURSE_PRESETS = [
    { label: "Next.js 16+", title: "Next.js 16+ App Router Masterclass", url: "https://nextjs.org/docs", notes: "8-week structured roadmap covering Server Components, routing, and deployment." },
    { label: "Full Stack", title: "Full Stack Web Development (React & Node)", url: "https://github.com/goldbergyoni/nodebestpractices", notes: "End-to-end full stack architecture guide with production best practices." },
    { label: "UI/UX Design", title: "UI/UX & Product Design Systems", url: "https://lawsofux.com/", notes: "Design system masterclass from wireframing to Figma prototypes." },
    { label: "System Design", title: "Data Structures & System Design Primer", url: "https://github.com/donnemartin/system-design-primer", notes: "Targeted coding patterns and scalable system design for interviews." }
  ];

  const RESOURCE_PRESETS = [
    { label: "Next.js Docs", title: "Next.js 16+ Architecture Guide", url: "https://nextjs.org/docs", msg: "Official guide on Server Components, routing, and caching behavior." },
    { label: "CSS Flexbox", title: "CSS Flexbox & Grid Masterclass", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", msg: "Step-by-step masterclass covering responsive layouts and properties." },
    { label: "Figma UI", title: "Figma UI/UX Design for Beginners", url: "https://www.youtube.com/watch?v=FTFaQWZBqA8", msg: "A great video tutorial on creating stunning components in Figma." },
    { label: "Google Meet", title: "Google Meet Sync Room", url: "GENERATE_MEET_LINK", msg: "Let's connect live for our progress review and support session." }
  ];

  const TASK_PRESETS = [
    { title: "Complete Week 2 challenges", notes: "Implement React hooks, handle state updates, and push to your portfolio repo." },
    { title: "Update LinkedIn profile", notes: "Update your profile summary with current role objectives and add your portfolio link." },
    { title: "Submit resume draft", notes: "Review the career templates, compile your experience draft, and share for feedback." },
    { title: "Solve learning blocker", notes: "Identify the top 3 issues blocking your progress and list ideas to resolve them." }
  ];

  const applyBundlePreset = (preset: typeof BUNDLE_PRESETS[0]) => {
    let url = preset.resource;
    if (url === "GENERATE_MEET_LINK") {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      url = `https://meet.google.com/${part1}-${part2}-${part3}`;
    }
    setBundleCourse(preset.course);
    setBundleTask(preset.task);
    setBundleResource(url);
    setBundleNotes(preset.notes);
  };

  const applyCoursePreset = (preset: typeof COURSE_PRESETS[0]) => {
    setCourseTitle(preset.title);
    setCourseUrl(preset.url);
    setCourseNotes(preset.notes);
  };

  const applyResourcePreset = (preset: typeof RESOURCE_PRESETS[0]) => {
    let url = preset.url;
    if (url === "GENERATE_MEET_LINK") {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      url = `https://meet.google.com/${part1}-${part2}-${part3}`;
    }
    setResourceTitle(preset.title);
    setResourceUrl(url);
    setShareMessage(preset.msg);
  };

  const applyTaskPreset = (preset: typeof TASK_PRESETS[0]) => {
    setTaskTitle(preset.title);
    setTaskNotes(preset.notes);
  };

  const handleShareHubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    if (shareMode === "bundle" && (!bundleCourse.trim() && !bundleTask.trim() && !bundleResource.trim())) {
      alert("Please fill in at least a course, task, or resource for the package.");
      return;
    }

    if (shareMode === "course" && !courseTitle.trim()) {
      alert("Please fill in the course title.");
      return;
    }

    if (shareMode === "resource" && (!resourceTitle.trim() || !resourceUrl.trim())) {
      alert("Please fill in the resource title and URL.");
      return;
    }

    if (shareMode === "task" && !taskTitle.trim()) {
      alert("Please fill in the task title.");
      return;
    }

    setIsSharingHub(true);
    let errorsCount = 0;
    
    let bodyText = "";
    if (shareMode === "bundle") {
      let url = bundleResource.trim();
      if (url === "GENERATE_MEET_LINK") {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        url = `https://meet.google.com/${part1}-${part2}-${part3}`;
      } else if (url && !/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }

      bodyText = `📦 **MENTOR LEARNING PACKAGE**\n\n`;
      if (bundleCourse.trim()) bodyText += `🎓 **Course / Roadmap**: ${bundleCourse.trim()}\n`;
      if (bundleTask.trim()) bodyText += `📋 **Assigned Task**: ${bundleTask.trim()}\n`;
      if (url) bodyText += `🔗 **Featured Link**: ${url}\n`;
      if (bundleNotes.trim()) bodyText += `\n💬 **Mentor Note**: ${bundleNotes.trim()}`;
    } else if (shareMode === "course") {
      let url = courseUrl.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      bodyText = `🎓 **COURSE ROADMAP**: ${courseTitle.trim()}\n${url ? `🔗 **Link**: ${url}\n` : ""}${courseNotes.trim() ? `\n📝 **Notes**: ${courseNotes.trim()}` : ""}`;
    } else if (shareMode === "resource") {
      let url = resourceUrl.trim();
      if (url === "GENERATE_MEET_LINK") {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        url = `https://meet.google.com/${part1}-${part2}-${part3}`;
      } else if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      bodyText = `📚 **${resourceTitle.trim()}**\n🔗 ${url}\n\n${shareMessage.trim()}`;
    } else {
      bodyText = `📋 **TASK**: ${taskTitle.trim()}\n📝 **Notes**: ${taskNotes.trim()}${taskDueDate ? `\n📅 **Due Date**: ${taskDueDate}` : ""}`;
    }

    // Send message to each selected student
    for (const studentId of selectedStudentIds) {
      if (studentId.startsWith("mock-student-")) {
        const mockMsg = {
          id: `mock-msg-${Date.now()}-${studentId}`,
          from_user_id: mentorId || "guest-mentor-id",
          to_user_id: studentId,
          sender_name: "Mentor",
          body: bodyText,
          created_at: new Date().toISOString(),
          is_read: true
        };
        setMessages(prev => [mockMsg, ...prev]);
      } else {
        const { error } = await supabase.from('messages').insert({
          from_user_id: mentorId,
          to_user_id: studentId,
          body: bodyText,
          sender_name: "Mentor",
          is_read: false
        } as any);
        if (error) {
          console.error("Error inserting message for student:", studentId, error);
          errorsCount++;
        }
      }
    }

    setIsSharingHub(false);
    if (errorsCount === 0) {
      const successText = shareMode === "bundle"
        ? `Learning Package shared with ${selectedStudentIds.length} mentee${selectedStudentIds.length > 1 ? 's' : ''}!`
        : shareMode === "course"
        ? `Course shared with ${selectedStudentIds.length} mentee${selectedStudentIds.length > 1 ? 's' : ''}!`
        : shareMode === "resource"
        ? `Resource shared with ${selectedStudentIds.length} mentee${selectedStudentIds.length > 1 ? 's' : ''}!`
        : `Task assigned to ${selectedStudentIds.length} mentee${selectedStudentIds.length > 1 ? 's' : ''}!`;

      setShareHubSuccess(successText);
      // Reset inputs
      setBundleCourse("");
      setBundleTask("");
      setBundleResource("");
      setBundleNotes("");
      setCourseTitle("");
      setCourseUrl("");
      setCourseNotes("");
      setResourceTitle("");
      setResourceUrl("");
      setShareMessage("");
      setTaskTitle("");
      setTaskNotes("");
      setTaskDueDate("");
      setTimeout(() => {
        setShareHubSuccess(null);
        if (onNavigateToPack) onNavigateToPack();
      }, 1000);
    } else {
      alert(`Shared with some errors. Failed for ${errorsCount} students.`);
    }
  };

  // Student joined date edit states
  const [isEditingJoinedDate, setIsEditingJoinedDate] = useState(false);
  const [editJoinedDateValue, setEditJoinedDateValue] = useState("");
  const [isSavingJoinedDate, setIsSavingJoinedDate] = useState(false);

  const handleSaveJoinedDate = async () => {
    if (!activeRoadmapStudentId || !editJoinedDateValue) return;
    setIsSavingJoinedDate(true);
    try {
      const student = assignedStudents.find(s => s.id === activeRoadmapStudentId);
      if (!student) return;

      const updatedPrefs = {
        ...(student.preferences || {}),
        joined_date: editJoinedDateValue
      };

      if (activeRoadmapStudentId.startsWith("mock-student-")) {
        // Mock save
        setTimeout(() => {
          setAssignedStudents(prev => prev.map(s => {
            if (s.id === activeRoadmapStudentId) {
              const createdDate = new Date(editJoinedDateValue);
              const diffTime = Math.abs(Date.now() - createdDate.getTime());
              const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              return {
                ...s,
                preferences: updatedPrefs,
                daysJoined: diffDays
              };
            }
            return s;
          }));
          setIsEditingJoinedDate(false);
          setIsSavingJoinedDate(false);
        }, 500);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ preferences: updatedPrefs })
        .eq('id', activeRoadmapStudentId);

      if (error) {
        alert("Error updating joined date: " + error.message);
      } else {
        setAssignedStudents(prev => prev.map(s => {
          if (s.id === activeRoadmapStudentId) {
            const createdDate = new Date(editJoinedDateValue);
            const diffTime = Math.abs(Date.now() - createdDate.getTime());
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            return {
              ...s,
              preferences: updatedPrefs,
              daysJoined: diffDays
            };
          }
          return s;
        }));
        setIsEditingJoinedDate(false);
      }
    } catch (e: any) {
      console.error(e);
      alert("Error: " + e.message);
    } finally {
      setIsSavingJoinedDate(false);
    }
  };

  // Interactive review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewSession, setSelectedReviewSession] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // New session scheduling state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedStudentId, setSchedStudentId] = useState("");
  const [schedTitle, setSchedTitle] = useState("");
  const [schedNotes, setSchedNotes] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedDuration, setSchedDuration] = useState("30");
  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleSession = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mentorId || !schedStudentId || !schedTitle.trim() || !schedDate || !schedTime) {
      alert("Please fill in all required fields (mentee, title, date, time).");
      return;
    }
    setIsScheduling(true);
    const scheduledAtStr = `${schedDate}T${schedTime}:00`;

    if (schedStudentId.startsWith("mock-student-")) {
      setTimeout(() => {
        setIsScheduling(false);
        setIsScheduleOpen(false);
        setSchedTitle("");
        setSchedNotes("");
        setSchedDate("");
        setSchedTime("");
        setSchedDuration("30");
        
        const targetStudent = assignedStudents.find(s => s.id === schedStudentId);
        const newSession = {
          id: `mock-session-${Date.now()}`,
          mentor_id: mentorId,
          student_id: schedStudentId,
          title: schedTitle.trim(),
          notes: schedNotes.trim() || null,
          scheduled_at: scheduledAtStr,
          duration_minutes: Number(schedDuration),
          status: 'Scheduled',
          student: targetStudent
        };
        setSessions(prev => [...prev, newSession].sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()));
        alert("Session scheduled successfully (Mock Mode)!");
      }, 500);
      return;
    }

    try {
      const { error } = await supabase.from('sessions').insert({
        mentor_id: mentorId,
        student_id: schedStudentId,
        title: schedTitle.trim(),
        notes: schedNotes.trim() || null,
        scheduled_at: scheduledAtStr,
        duration_minutes: Number(schedDuration),
        status: 'Scheduled'
      });

      if (error) {
        alert("Error scheduling session: " + error.message);
      } else {
        setIsScheduleOpen(false);
        setSchedTitle("");
        setSchedNotes("");
        setSchedDate("");
        setSchedTime("");
        setSchedDuration("30");
        fetchAllMentorData(mentorId, true, mentorEmail);
        alert("Session scheduled successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScheduling(false);
    }
  };

  const fetchAllMentorData = async (currentUserId: string, isMounted: boolean, userEmail?: string) => {
    // Check if the user is a guest mentor
    let isGuest = userEmail === "guest.mentor@kindmentor.com";
    if (!userEmail) {
      const { data: { session } } = await supabase.auth.getSession();
      isGuest = session?.user?.email === "guest.mentor@kindmentor.com";
    }

    // Fetch profile name
    if (!isGuest) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', currentUserId).single();
      if (profile?.name && isMounted) {
        setMentorName(profile.name);
      }
    }

    // Fetch assigned students
    const { data: mappings } = await supabase.from('mapping')
      .select('student:profiles!mapping_student_id_fkey(*)')
      .eq('mentor_id', currentUserId);
    
    let assigned = mappings?.map((m: any) => m.student).filter(Boolean) || [];

    if (isGuest) {
      assigned = [
        {
          id: "mock-student-1",
          name: "Aarav Mehta",
          email: "aarav.mehta@gmail.com",
          created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
          preferences: { joined_date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0] },
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
        },
        {
          id: "mock-student-2",
          name: "Ananya Iyer",
          email: "ananya.iyer@gmail.com",
          created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
          preferences: { joined_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0] },
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
        },
        {
          id: "mock-student-3",
          name: "Kabir Sharma",
          email: "kabir.sharma@gmail.com",
          created_at: new Date(Date.now() - 32 * 86400000).toISOString(),
          preferences: { joined_date: new Date(Date.now() - 32 * 86400000).toISOString().split('T')[0] },
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir"
        }
      ] as any;
    }

    // Load active enrollments progress for mapped students
    let enrichedStudents: any[] = [];
    if (assigned.length > 0) {
      const enrollmentMap = new Map();
      if (!isGuest) {
        const { data: enrollments } = await supabase.from('enrollments')
          .select('*, course:courses(*)')
          .in('student_id', assigned.map((s: any) => s.id))
          .eq('status', 'Active');

        if (enrollments) {
          enrollments.forEach((e: any) => {
            enrollmentMap.set(e.student_id, e);
          });
        }
      }

      enrichedStudents = assigned.map((p: any) => {
        let progressPercent = 0;
        if (p.id === "mock-student-1") progressPercent = 65;
        else if (p.id === "mock-student-2") progressPercent = 30;
        else if (p.id === "mock-student-3") progressPercent = 90;
        else {
          const studentEnrollment = enrollmentMap.get(p.id);
          const totalTopics = (studentEnrollment?.course?.content || []).reduce((acc: number, m: any) => acc + (m.topics?.length || m.lessons?.length || 0), 0);
          const completedTopics = studentEnrollment?.progress?.length || 0;
          progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
        }

        const prefs = (p.preferences as any) || {};
        const joinedDateStr = prefs.joined_date || p.created_at;
        const createdDate = joinedDateStr ? new Date(joinedDateStr) : new Date();
        const diffTime = Math.abs(Date.now() - createdDate.getTime());
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        return {
          ...p,
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'Unknown Student',
          progress: progressPercent,
          avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
          daysJoined: diffDays
        };
      });
    }

    if (!isMounted) return;
    setAssignedStudents(enrichedStudents);
    if (enrichedStudents.length > 0) {
      setActiveRoadmapStudentId(prev => prev || enrichedStudents[0].id);
    }

    // Fetch messages
    const { data: msgs } = await supabase.from('messages')
      .select('*')
      .eq('to_user_id', currentUserId)
      .order('created_at', { ascending: false });
    
    let messagesList = msgs || [];
    if (isGuest) {
      const mockMessages = [
        {
          id: "mock-msg-1",
          from_user_id: "mock-student-1",
          to_user_id: currentUserId,
          sender_name: "Aarav Mehta",
          body: "Hey mentor! I finished the Week 2 coding challenges on React hooks. Could you review my portfolio repo when you get a chance? Here is the link: https://github.com/aaravmehta/my-portfolio",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          is_read: false
        },
        {
          id: "mock-msg-2",
          from_user_id: "mock-student-2",
          to_user_id: currentUserId,
          sender_name: "Ananya Iyer",
          body: "Hi, I'm having some trouble setting up Tailwind CSS with Next.js Turbopack. The dev server keeps reloading. Any tips on how to fix this?",
          created_at: new Date(Date.now() - 18000000).toISOString(),
          is_read: false
        },
        {
          id: "mock-msg-3",
          from_user_id: "mock-student-3",
          to_user_id: currentUserId,
          sender_name: "Kabir Sharma",
          body: "Thanks for the feedback on my resume! I applied those changes and sent it to a recruiter today.",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          is_read: true
        }
      ];
      messagesList = [...mockMessages, ...messagesList] as any;
    }
    if (isMounted) setMessages(messagesList);

    // Fetch Scheduled Sessions
    const { data: sessData } = await supabase.from('sessions')
      .select('*, student:profiles!sessions_student_id_fkey(*)')
      .eq('mentor_id', currentUserId)
      .order('scheduled_at', { ascending: true });
    
    let sessionsList = sessData || [];
    if (isGuest) {
      const mockSessions = [
        {
          id: "mock-session-1",
          mentor_id: currentUserId,
          student_id: "mock-student-1",
          title: "Resume & LinkedIn Polish",
          notes: "Review resume draft and edit profile section.",
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          duration_minutes: 45,
          status: 'Scheduled',
          student: {
            id: "mock-student-1",
            name: "Aarav Mehta",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
          }
        },
        {
          id: "mock-session-2",
          mentor_id: currentUserId,
          student_id: "mock-student-2",
          title: "Next.js Coding Session & Topic Review",
          notes: "Tailwind CSS issues, troubleshooting Next.js config.",
          scheduled_at: new Date(Date.now() + 172800000).toISOString(),
          duration_minutes: 60,
          status: 'Scheduled',
          student: {
            id: "mock-student-2",
            name: "Ananya Iyer",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
          }
        },
        {
          id: "mock-session-3",
          mentor_id: currentUserId,
          student_id: "mock-student-3",
          title: "Introduction & Goal Alignment",
          notes: "Outline growth milestones and goals.",
          scheduled_at: new Date(Date.now() - 259200000).toISOString(),
          duration_minutes: 30,
          status: 'Completed',
          student: {
            id: "mock-student-3",
            name: "Kabir Sharma",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir"
          }
        }
      ];
      sessionsList = [...mockSessions, ...sessionsList] as any;
      sessionsList.sort((a: any, b: any) => new Date(a.scheduled_at as string).getTime() - new Date(b.scheduled_at as string).getTime());
    }
    if (isMounted) {
      setSessions(sessionsList);
    }

    // Calculate completed sessions total hours
    const completedSessions = sessionsList.filter((s: any) => s.status === 'Completed' || s.status === 'completed');
    const totalMinutes = completedSessions.reduce((sum: number, s: any) => sum + (s.duration_minutes || 30), 0);
    const totalHours = Math.round(totalMinutes / 60) || 0;

    // Fetch reviews written for this mentor
    const { data: reviewsReceived } = await supabase.from('reviews')
      .select('*')
      .eq('reviewee_id', currentUserId);

    let avgRating = 5.0;
    if (isGuest) {
      avgRating = 4.9;
    } else if (reviewsReceived && reviewsReceived.length > 0) {
      const rated = reviewsReceived.filter((r: any) => r.rating !== null);
      if (rated.length > 0) {
        avgRating = Math.round((rated.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / rated.length) * 10) / 10;
      }
    }

    if (isMounted) {
      setStats({
        students: enrichedStudents.length,
        hours: totalHours,
        rating: avgRating
      });
    }

    // Generate/Fetch Pending Reviews (Completed sessions that don't have review feedback yet)
    let reviewedSessionIds = new Set();
    if (!isGuest) {
      const { data: reviewsWritten } = await supabase.from('reviews')
        .select('session_id')
        .eq('reviewer_id', currentUserId);
      reviewedSessionIds = new Set(reviewsWritten?.map((r: any) => r.session_id).filter(Boolean) || []);
    }

    const pendingReviewSessions = sessionsList.filter((s: any) => 
      (s.status === 'Completed' || s.status === 'completed' || (s.scheduled_at && new Date(s.scheduled_at) < new Date())) && 
      !reviewedSessionIds.has(s.id)
    );

    const formattedPendingReviews = pendingReviewSessions.map((s: any) => ({
      id: s.id,
      title: s.title || "Session Review",
      student: s.student?.name || s.student?.email?.split('@')[0] || "Student",
      studentId: s.student_id,
      time: s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString() : "Recent"
    }));

    if (isMounted) {
      setReviews(formattedPendingReviews);
    }

    // Fetch latest community gratitude messages
    const { data: gratitude } = await supabase.from('gratitude_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (gratitude && gratitude.length > 0 && isMounted) {
      setLatestGratitude(gratitude[0]);
    }
  };

  useEffect(() => {
    let channel: any;
    let isMounted = true;

    const loadFact = async () => {
      // 1. Try local storage first for admin-pushed facts (real-time sync)
      const pushed = localStorage.getItem("pushed_fact_of_the_day");
      if (pushed) {
        try {
          const parsed = JSON.parse(pushed);
          if (isMounted) {
            setActiveFact(parsed);
            return;
          }
        } catch (e) {}
      }

      // 2. Try custom facts from localStorage next
      const customFactsStr = localStorage.getItem("custom_interesting_facts");
      if (customFactsStr) {
        try {
          const parsed = JSON.parse(customFactsStr);
          const published = parsed.filter((f: any) => f.is_published);
          if (published.length > 0) {
            const active = published.find((f: any) => f.is_active_today) || published[0];
            if (isMounted) {
              setActiveFact(active);
              return;
            }
          }
        } catch (e) {}
      }

      try {
        const { data: dbFacts } = await supabase
          .from('interesting_facts' as any)
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false }) as { data: any[] | null };

        if (dbFacts && dbFacts.length > 0 && isMounted) {
          const active = dbFacts.find(f => f.is_active_today) || dbFacts[0];
          setActiveFact(active);
        } else {
          // Fallback static facts
          const fallbackFacts = [
            { id: "f1", content: "Sharks existed before trees first appeared on Earth—by nearly **50 million years**.", category: "world", emoji: "🌍" },
            { id: "f2", content: "There are more possible chess games than atoms estimated in the observable universe.", category: "space", emoji: "🪐" },
            { id: "f3", content: "A single lightning bolt can heat the surrounding air to **five times hotter than the Sun's surface**.", category: "world", emoji: "🌍" },
            { id: "f4", content: "The world's oldest known tree is over **4,800 years old** and is still alive.", category: "world", emoji: "🌍" }
          ];
          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 864e5);
          if (isMounted) {
            setActiveFact(fallbackFacts[dayOfYear % fallbackFacts.length]);
          }
        }
      } catch (err) {
        console.error("Failed to load mentor fact", err);
      }
    };

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const emailToCheck = session?.user?.email || mentorEmail;
      const isGuest = emailToCheck === "guest.mentor@kindmentor.com";

      if (!session && !isGuest) {
        if (!isMounted) return;
        return;
      }
      
      const currentUserId = session?.user?.id || "guest-mentor-id";
      setMentorId(currentUserId);

      if (mentorNameProp) {
        setMentorName(mentorNameProp);
      }

      await fetchAllMentorData(currentUserId, isMounted, emailToCheck);

      // Fetch Fact of the Day
      loadFact();

      // Real-time message listener
      if (session) {
        channel = supabase.channel(`mentor-messages-${currentUserId}`);
        channel
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages', 
            filter: `to_user_id=eq.${currentUserId}` 
          }, (payload: any) => {
            if (isMounted) setMessages(prev => [payload.new, ...prev]);
          })
          .subscribe();
      }
    };

    init();
    window.addEventListener("storage", loadFact);

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
      window.removeEventListener("storage", loadFact);
    };
  }, []);

  const handleReply = async (studentId: string, studentName: string, bodyText?: string) => {
    const text = bodyText || replyInputs[studentId] || "";
    if (!text.trim() || !mentorId) return;

    setIsSending(true);

    if (studentId.startsWith("mock-student-")) {
      setTimeout(() => {
        setIsSending(false);
        setReplyInputs(prev => ({ ...prev, [studentId]: "" }));
        setSendSuccessMap(prev => ({ ...prev, [studentId]: true }));
        
        const newMsg = {
          id: `mock-reply-${Date.now()}`,
          from_user_id: mentorId,
          to_user_id: studentId,
          body: text,
          sender_name: "Mentor",
          is_read: true,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [newMsg, ...prev]);
        
        setTimeout(() => {
          setSendSuccessMap(prev => ({ ...prev, [studentId]: false }));
        }, 3000);
      }, 500);
      return;
    }

    const { error } = await supabase.from('messages').insert({
      from_user_id: mentorId,
      to_user_id: studentId,
      body: text,
      sender_name: "Mentor",
      is_read: false
    } as any);

    setIsSending(false);
    if (error) {
      console.error("Error replying:", error);
      alert("Error sending message: " + error.message);
    } else {
      setReplyInputs(prev => ({ ...prev, [studentId]: "" }));
      setSendSuccessMap(prev => ({ ...prev, [studentId]: true }));
      setTimeout(() => {
        setSendSuccessMap(prev => ({ ...prev, [studentId]: false }));
      }, 3000);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (msgId.startsWith("mock-")) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
      return;
    }
    const { error } = await supabase.from('messages').delete().eq('id', msgId);
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } else {
      alert("Error deleting message: " + error.message);
    }
  };

  const handleOpenReviewModal = (sessionReview: any) => {
    setSelectedReviewSession(sessionReview);
    setReviewRating(5);
    setReviewFeedback("");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReviewSession || !mentorId) return;

    setIsSubmittingReview(true);

    if (selectedReviewSession.id.startsWith("mock-")) {
      setTimeout(() => {
        setIsSubmittingReview(false);
        setIsReviewModalOpen(false);
        setSelectedReviewSession(null);
        setReviews(prev => prev.filter(r => r.id !== selectedReviewSession.id));
        alert("Review submitted successfully (Mock Mode)!");
      }, 500);
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      session_id: selectedReviewSession.id,
      reviewer_id: mentorId,
      reviewee_id: selectedReviewSession.studentId,
      rating: reviewRating,
      feedback: reviewFeedback.trim() || null
    });

    setIsSubmittingReview(false);
    if (error) {
      alert("Error submitting review: " + error.message);
    } else {
      setIsReviewModalOpen(false);
      setSelectedReviewSession(null);
      fetchAllMentorData(mentorId, true, mentorEmail);
    }
  };

  const getDynamicRoadmapStatus = () => {
    if (assignedStudents.length === 0) {
      return { activeWeek: 3, optOutDays: ["Saturday", "Sunday"], learningDays: 15, skippedDays: 6, studentName: "Demo" };
    }
    
    const student = assignedStudents.find(s => s.id === activeRoadmapStudentId) || assignedStudents[0];
    const joinedDateStr = student.preferences?.joined_date || student.created_at;
    const createdDate = joinedDateStr ? new Date(joinedDateStr) : new Date();
    createdDate.setHours(0,0,0,0);
    
    const today = new Date();
    today.setHours(23,59,59,999);
    
    const prefs = student.preferences || {};
    const optOutDays = Array.isArray(prefs.opt_out_days) ? prefs.opt_out_days : ["Saturday", "Sunday"];
    
    let learningDays = 0;
    let skippedDays = 0;
    
    const current = new Date(createdDate);
    while (current <= today) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'long' });
      if (optOutDays.includes(dayName)) {
        skippedDays++;
      } else {
        learningDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    learningDays = Math.max(1, learningDays);
    const activeWeek = Math.min(8, Math.max(1, Math.ceil(learningDays / 7)));
    
    return { activeWeek, optOutDays, learningDays, skippedDays, studentName: student.name };
  };

  useEffect(() => {
    if (assignedStudents.length > 0) {
      const { activeWeek } = getDynamicRoadmapStatus();
      setExpandedWeek(activeWeek);
    }
  }, [activeRoadmapStudentId, assignedStudents]);

  return (
    <div className="space-y-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">

      {/* Subtle Learning Pack Entry Point */}
      {onNavigateToPack && (
        <div className="px-1 animate-in fade-in duration-300">
          <div 
            onClick={onNavigateToPack}
            className="group bg-white border border-slate-200/80 hover:border-indigo-200 rounded-2xl p-3.5 px-4 shadow-3xs hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/70 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
                    Learning Packs
                  </h4>
                  <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/60 leading-none">
                    Broadcast
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-none">
                  Share courses, tasks & content with mentees in chat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 shrink-0">
              <span className="hidden sm:inline">Open Pack</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* 1. Share Hub (Hidden as requested) */}
      {false && (
      <div id="share-hub-card" className="px-1 animate-in fade-in slide-in-from-top-3 duration-500">
        <Card className="p-6 shadow-sm overflow-hidden bg-white border border-slate-100 rounded-3xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
          
          <div className="flex items-center gap-2.5 mb-5 relative z-10">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
              <Share2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none">Mentor Share Hub</p>
              <h3 className="text-slate-900 font-bold text-[15px] mt-1.5 leading-none">Broadcast Courses, Tasks & Content in Chat 🚀</h3>
            </div>
          </div>

          {/* Mentees Selector Grid/List with Progress Indicators */}
          <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mb-5 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Select Recipients (with Live Progress):</span>
              <button 
                type="button"
                onClick={handleToggleSelectAll}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                {selectedStudentIds.length === assignedStudents.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {assignedStudents.length === 0 ? (
                <p className="text-xs text-slate-400 py-1">No mentees available to select.</p>
              ) : (
                assignedStudents.map((stud) => {
                  const isSelected = selectedStudentIds.includes(stud.id);
                  const progress = stud.progress || 0;
                  return (
                    <button
                      key={stud.id}
                      type="button"
                      onClick={() => handleToggleStudentSelect(stud.id)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-50/90 border-indigo-200 text-indigo-900 shadow-sm" 
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-100 flex items-center justify-center bg-slate-50 shrink-0">
                        <img src={stud.avatar} alt={stud.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col text-left leading-none">
                        <span className="truncate max-w-[85px] font-bold text-[11.5px]">{stud.name?.split(" ")[0]}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-8 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">{progress}%</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 ${
                        isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-2.5 font-medium">
              Sharing will send messages in chat to <strong className="text-slate-700">{selectedStudentIds.length}</strong> selected mentee{selectedStudentIds.length !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Mode Selector Tabs (4 Modes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 border border-slate-100 bg-slate-50/70 p-1 rounded-2xl mb-5 relative z-10">
            <button
              type="button"
              onClick={() => setShareMode("bundle")}
              className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                shareMode === "bundle"
                  ? "bg-white text-indigo-650 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <Package className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
              <span className="truncate">All-in-One Pack</span>
            </button>

            <button
              type="button"
              onClick={() => setShareMode("course")}
              className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                shareMode === "course"
                  ? "bg-white text-indigo-650 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 shrink-0 text-purple-500" />
              <span className="truncate">Course & Roadmap</span>
            </button>

            <button
              type="button"
              onClick={() => setShareMode("resource")}
              className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                shareMode === "resource"
                  ? "bg-white text-indigo-650 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <Link className="w-3.5 h-3.5 shrink-0 text-sky-500" />
              <span className="truncate">Content & Links</span>
            </button>

            <button
              type="button"
              onClick={() => setShareMode("task")}
              className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-0 ${
                shareMode === "task"
                  ? "bg-white text-indigo-650 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              <span className="truncate">Assign Tasks</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleShareHubSubmit} className="space-y-4 relative z-10">
            {shareMode === "bundle" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100/50 mb-1">
                  <p className="text-[11px] text-indigo-800 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    Share tasks, resources, AND course materials together in ONE chat message!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">1. Course / Curriculum</Label>
                    <Input
                      value={bundleCourse}
                      onChange={(e) => setBundleCourse(e.target.value)}
                      placeholder="e.g. Next.js 16+ App Router Masterclass"
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">2. Task / Action Item</Label>
                    <Input
                      value={bundleTask}
                      onChange={(e) => setBundleTask(e.target.value)}
                      placeholder="e.g. Build Week 3 project component & push to GitHub"
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">3. Content / Resource Link</Label>
                    <Input
                      value={bundleResource}
                      onChange={(e) => setBundleResource(e.target.value)}
                      placeholder="e.g. https://nextjs.org/docs"
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">4. Mentor Note / Context</Label>
                    <Input
                      value={bundleNotes}
                      onChange={(e) => setBundleNotes(e.target.value)}
                      placeholder="e.g. Focus on Server Components before starting!"
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Bundle Presets */}
                <div className="pt-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 ml-1">Quick All-in-One Bundles:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {BUNDLE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyBundlePreset(preset)}
                        className="text-[10.5px] px-2.5 py-1.5 rounded-full border border-indigo-100/60 bg-indigo-50/30 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200 font-semibold transition-all cursor-pointer shadow-3xs"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {shareMode === "course" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Course Title / Roadmap</Label>
                    <Input
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. Next.js 16+ App Router Masterclass"
                      required={shareMode === "course"}
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Course Link / Material URL (Optional)</Label>
                    <Input
                      value={courseUrl}
                      onChange={(e) => setCourseUrl(e.target.value)}
                      placeholder="e.g. nextjs.org/docs"
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Course Guidance & Notes</Label>
                  <Textarea
                    value={courseNotes}
                    onChange={(e) => setCourseNotes(e.target.value)}
                    placeholder="Provide overview of modules, target deadlines, or study strategy..."
                    rows={2}
                    className="rounded-xl border-slate-200 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white shadow-2xs resize-none"
                  />
                </div>

                {/* Course Presets */}
                <div className="pt-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 ml-1">Featured Courses:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COURSE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyCoursePreset(preset)}
                        className="text-[10.5px] px-2.5 py-1.5 rounded-full border border-purple-100/60 bg-purple-50/30 text-purple-700 hover:bg-purple-50 hover:border-purple-200 font-semibold transition-all cursor-pointer shadow-3xs"
                      >
                        🎓 {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {shareMode === "resource" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Resource Title</Label>
                    <Input
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      placeholder="e.g. Next.js Routing Guide"
                      required={shareMode === "resource"}
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Resource URL</Label>
                    <Input
                      value={resourceUrl}
                      onChange={(e) => setResourceUrl(e.target.value)}
                      placeholder="e.g. nextjs.org/docs"
                      required={shareMode === "resource"}
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Message / Instructions</Label>
                  <Textarea
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    placeholder="Provide context or instructions for this resource..."
                    rows={2}
                    className="rounded-xl border-slate-200 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white shadow-2xs resize-none"
                  />
                </div>

                <div className="pt-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 ml-1">Quick Content Presets:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {RESOURCE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyResourcePreset(preset)}
                        className="text-[10.5px] px-2.5 py-1.5 rounded-full border border-sky-100/60 bg-sky-50/30 text-sky-700 hover:bg-sky-50 hover:border-sky-200 font-semibold transition-all cursor-pointer shadow-3xs"
                      >
                        {preset.label === "Google Meet" ? "📹 Meet Room" : preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {shareMode === "task" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Task / Assignment Title</Label>
                    <Input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Implement Tailwind in Project"
                      required={shareMode === "task"}
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Due Date (Optional)</Label>
                    <Input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="bg-white border-slate-200 text-xs h-10 px-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs text-slate-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider ml-1">Task Notes / Steps</Label>
                  <Textarea
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    placeholder="Detail the steps or criteria to complete this task..."
                    rows={2}
                    className="rounded-xl border-slate-200 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white shadow-2xs resize-none"
                  />
                </div>

                <div className="pt-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 ml-1">Task Templates:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TASK_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyTaskPreset(preset)}
                        className="text-[10.5px] px-2.5 py-1.5 rounded-full border border-emerald-100/60 bg-emerald-50/30 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 font-semibold transition-all cursor-pointer shadow-3xs"
                      >
                        📋 {preset.title.split(" ")[0]} {preset.title.split(" ").slice(1, 3).join(" ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submission Status & Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                {shareHubSuccess && (
                  <div className="text-[11.5px] text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50/90 p-2 px-3 rounded-xl border border-emerald-200 animate-in fade-in slide-in-from-top-1">
                    <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" /> {shareHubSuccess}
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isSharingHub || selectedStudentIds.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-all shadow-md shrink-0 border-0 cursor-pointer"
              >
                {isSharingHub ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-white rounded-full animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {shareMode === "bundle"
                      ? `Share Learning Pack to ${selectedStudentIds.length} Mentees`
                      : shareMode === "course"
                      ? `Share Course to ${selectedStudentIds.length} Mentees`
                      : shareMode === "resource"
                      ? `Share Content to ${selectedStudentIds.length} Mentees`
                      : `Assign Task to ${selectedStudentIds.length} Mentees`} 🚀
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      )}

      {/* 2. Mentees & Course Progress (Beneath Share Hub) */}
      {featureFlags.mentor_students !== false && (
        <div className="px-1 animate-in fade-in duration-500" style={{ animationDelay: "100ms" }}>
          <Card className="p-6 shadow-sm bg-white border border-slate-100 rounded-3xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none">Mentees & Course Progress</p>
                  <h3 className="text-slate-900 font-bold text-[15px] mt-1.5 leading-none">Track Study Progress & Milestones 📊</h3>
                </div>
              </div>
              <span className="bg-indigo-50 text-indigo-600 text-[11px] px-2.5 py-1 rounded-full font-bold">
                {assignedStudents.length} Assigned
              </span>
            </div>

            <div className="space-y-4">
              {assignedStudents.length === 0 ? (
                <div className="w-full py-8 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Users className="w-8 h-8 text-slate-300 mb-2" />
                  <span className="text-[13px] text-slate-400 font-medium">No assigned mentees yet.</span>
                </div>
              ) : (
                assignedStudents.map((stud) => {
                  const progress = stud.progress || 0;
                  const pStyle = getProgressStyles(progress);
                  
                  // Calculate student dynamic week/milestone info
                  const joinedDateStr = stud.preferences?.joined_date || stud.created_at;
                  const createdDate = joinedDateStr ? new Date(joinedDateStr) : new Date();
                  createdDate.setHours(0,0,0,0);
                  const today = new Date();
                  today.setHours(23,59,59,999);
                  const optOutDays = Array.isArray(stud.preferences?.opt_out_days) ? stud.preferences.opt_out_days : ["Saturday", "Sunday"];
                  let learningDays = 0;
                  const current = new Date(createdDate);
                  while (current <= today) {
                    const dayName = current.toLocaleDateString('en-US', { weekday: 'long' });
                    if (!optOutDays.includes(dayName)) learningDays++;
                    current.setDate(current.getDate() + 1);
                  }
                  learningDays = Math.max(1, learningDays);
                  const activeWeekNum = Math.min(8, Math.max(1, Math.ceil(learningDays / 7)));
                  const activeWeekObj = ROADMAP_WEEKS.find(w => w.week === activeWeekNum) || ROADMAP_WEEKS[0];

                  return (
                    <div 
                      key={stud.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        activeRoadmapStudentId === stud.id 
                          ? "bg-slate-50/50 border-indigo-100" 
                          : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      {/* Left: Avatar and Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex items-center justify-center shrink-0 w-11 h-11">
                          <svg className="absolute w-11 h-11 transform -rotate-90">
                            <circle cx="22" cy="22" r="19" stroke="#f1f5f9" strokeWidth="1.5" fill="transparent" />
                            <circle 
                              cx="22" 
                              cy="22" 
                              r="19" 
                              stroke={pStyle.stroke} 
                              strokeWidth="2.5" 
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 19}
                              strokeDashoffset={2 * Math.PI * 19 - (progress / 100) * 2 * Math.PI * 19}
                              strokeLinecap="round"
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center z-10">
                            <img src={stud.avatar} alt={stud.name} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-850 text-xs sm:text-[13px] leading-tight flex items-center gap-1.5">
                            {stud.name}
                            {activeRoadmapStudentId === stud.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-650" />
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 leading-none truncate max-w-[180px]">{stud.email}</span>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                            Joined {stud.daysJoined} days ago
                          </span>
                        </div>
                      </div>

                      {/* Middle: Horizontal Progress Bar */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span>Course Progress</span>
                          <span className={pStyle.text}>{progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                          <div 
                            className={`h-full ${pStyle.bg} rounded-full transition-all duration-500`} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold truncate leading-tight mt-0.5">
                          Active week: <strong className="text-slate-700">Week {activeWeekNum} - {activeWeekObj.title}</strong>
                        </p>
                      </div>

                      {/* Right: Quick Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto pt-1 md:pt-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentIds([stud.id]);
                            setShareMode("bundle");
                            document.getElementById("share-hub-card")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="text-[10.5px] font-bold h-8 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1 cursor-pointer shadow-3xs border-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Share Pack
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRoadmapStudentId(stud.id);
                            document.getElementById("roadmap-section")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`text-[10.5px] font-bold h-8 px-3.5 rounded-xl border flex items-center gap-1 transition-all cursor-pointer ${
                            activeRoadmapStudentId === stud.id
                              ? "bg-slate-900 border-slate-900 text-white shadow-3xs"
                              : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          {activeRoadmapStudentId === stud.id ? "Focusing Roadmap" : "Focus Roadmap"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectStudent?.(stud.id)}
                          className="text-[10.5px] font-bold h-8 px-3.5 rounded-xl bg-indigo-50 border border-indigo-100/50 hover:bg-indigo-100 text-indigo-700 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 3. 8-Week Career Roadmap (Moved down, focused student) */}
      <div id="roadmap-section" className="px-1 animate-in fade-in duration-500" style={{ animationDelay: "150ms" }}>
        <Card className="p-6 shadow-sm overflow-hidden bg-white border border-slate-100 rounded-3xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
                <Zap className="w-4 h-4 fill-indigo-100" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none">8-Week Roadmap</p>
                <h3 className="text-slate-900 font-bold text-[15px] mt-1.5 leading-none">8-Week Mentor-Led Career Journey 🚀</h3>
              </div>
            </div>

            {/* Mentee Selector Dropdown for Roadmap */}
            {assignedStudents.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 shadow-2xs self-start sm:self-auto">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Viewing Roadmap for:</span>
                <select
                  value={activeRoadmapStudentId}
                  onChange={(e) => setActiveRoadmapStudentId(e.target.value)}
                  className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer pr-1 border-0 p-0"
                >
                  {assignedStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Dynamic calculations info */}
          {(() => {
            const { activeWeek, optOutDays, learningDays, skippedDays } = getDynamicRoadmapStatus();
            const student = assignedStudents.find(s => s.id === activeRoadmapStudentId) || assignedStudents[0];
            const currentStudentJoinedDate = student?.preferences?.joined_date || student?.created_at || new Date().toISOString();
            const dynamicWeeks = ROADMAP_WEEKS.map(w => {
              let status = "upcoming";
              if (w.week < activeWeek) {
                status = "completed";
              } else if (w.week === activeWeek) {
                status = "active";
              }
              return { ...w, status };
            });

            return (
              <>
                <div className="space-y-3 relative pl-1">
                  {dynamicWeeks.map((w, idx) => {
                    const isExpanded = expandedWeek === w.week;
                    const isCompleted = w.status === "completed";
                    const isActive = w.status === "active";
                    
                    let titleColor = "text-slate-500 font-medium";
                    let statusIcon = null;

                    if (isCompleted) {
                      titleColor = "text-slate-400 line-through font-medium";
                      statusIcon = (
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      );
                    } else if (isActive) {
                      titleColor = "text-indigo-650 font-bold";
                      statusIcon = (
                        <div className="w-5 h-5 rounded-full bg-indigo-650 text-white flex items-center justify-center shrink-0 border border-indigo-650 shadow-sm shadow-indigo-650/20">
                          <span className="text-[10px] font-black">{w.week}</span>
                        </div>
                      );
                    } else {
                      statusIcon = (
                        <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                          <span className="text-[9px] font-bold">{w.week}</span>
                        </div>
                      );
                    }

                    return (
                      <div key={w.week} className="border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                        <button
                          type="button"
                          onClick={() => setExpandedWeek(isExpanded ? null : w.week)}
                          className="w-full flex items-center justify-between text-left py-1 hover:bg-slate-50/50 rounded-lg px-1 transition-colors border-0 bg-transparent cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {statusIcon}
                            <span className={`text-[12.5px] truncate ${titleColor}`}>
                              Week {w.week}: {w.title}
                            </span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180 text-slate-650' : ''}`} />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-7.5"
                            >
                              <div className="pt-2 pb-1 space-y-2">
                                {w.items.map((item, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[11.5px] text-slate-500 font-medium">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCompleted ? 'bg-slate-350' : isActive ? 'bg-indigo-500' : 'bg-slate-250'}`} />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Study days summary under active week if selected */}
                {student && (
                  <div className="mt-4 pt-3.5 border-t border-slate-50 text-[11px] font-semibold space-y-2">
                    <div className="flex justify-between items-center text-slate-450 bg-slate-50/30 p-2 rounded-xl border border-slate-100/50">
                      <span>Rest Schedule: {optOutDays.join(", ")}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditJoinedDateValue(currentStudentJoinedDate.split("T")[0]);
                            setIsEditingJoinedDate(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-850 flex items-center gap-0.5 text-[10.5px] bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-3xs cursor-pointer"
                        >
                          <Pencil className="w-2.5 h-2.5" /> Edit Joined Date
                        </button>
                      </div>
                    </div>
                    <p className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/50 p-2 px-3 rounded-xl leading-normal text-slate-500/80">
                      <span>⚡</span>
                      <span>
                        Active week: <strong>{learningDays} study days</strong> ({skippedDays} rest days skipped).
                      </span>
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </Card>
      </div>

      {/* 4. Today's Plan & Upcoming Sessions (Streamlined, no mentees list) */}
      {featureFlags.mentor_sessions !== false && (
        <div className="px-1 animate-in fade-in duration-500" style={{ animationDelay: "200ms" }}>
          <Card className="p-5.5 shadow-sm h-auto flex flex-col gap-0 bg-white border border-slate-100 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-medium text-[15px]">
                <Calendar className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> Today&apos;s Plan
              </div>
              <div className="flex gap-2">
                <span className="bg-indigo-50 text-indigo-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
                <span className="bg-orange-50 text-orange-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3.5">
              <p className="text-[10px] text-slate-400 tracking-[0.15em] font-semibold uppercase">Upcoming Sessions</p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  if (assignedStudents.length > 0) {
                    setSchedStudentId(assignedStudents[0].id);
                  }
                  const d = new Date();
                  setSchedDate(d.toISOString().split('T')[0]);
                  setSchedTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
                  setIsScheduleOpen(true);
                }}
                className="text-[10px] text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 font-semibold h-8 px-3 rounded-full transition-all active:scale-95 shadow-sm"
              >
                + New Session
              </Button>
            </div>
            
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-[12.5px] text-slate-400 font-medium py-1.5 pl-1">No upcoming sessions scheduled yet.</p>
              ) : (
                sessions.map((sess) => {
                  const isCompleted = sess.status === 'Completed' || sess.status === 'completed';
                  const schedDate = sess.scheduled_at ? new Date(sess.scheduled_at) : null;
                  const timeStr = schedDate ? schedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Flexible";
                  const dateStr = schedDate ? schedDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) : "";

                  return (
                    <div key={sess.id} className={`flex gap-4 items-center p-4 rounded-2xl border transition-all hover:border-slate-200 group active:scale-[0.98] ${isCompleted ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <span className="text-[13px] font-medium leading-none">{timeStr.split(' ')[0]}</span>
                        <span className="text-[9px] font-semibold uppercase mt-1 opacity-70">{timeStr.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-medium truncate ${isCompleted ? 'text-slate-400' : 'text-slate-900'}`}>{sess.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{sess.student?.name || "Student"}</span>
                          <span className="text-slate-200 text-[10px]">|</span>
                          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{dateStr}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl font-medium text-[10px] shrink-0 shadow-3xs ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                        {sess.duration_minutes || 30}M
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 14. New Student Notifications (Real Data) - Premium Light Theme */}
      {featureFlags.mentor_students !== false && showNotification && assignedStudents.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-100/50 px-5 py-3.5 mx-1 mt-6 rounded-[1.25rem] flex items-center justify-between gap-3 text-indigo-700 shadow-3xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
          <div className="flex items-center gap-2.5 min-w-0 relative z-10">
            <Bell className="w-4.5 h-4.5 text-indigo-500 shrink-0 animate-bounce" />
            <p className="text-[12.5px] font-semibold tracking-tight text-slate-800 leading-tight">
              You have {assignedStudents.length} assigned student{assignedStudents.length > 1 ? 's' : ''}! Latest student: <span className="text-indigo-600 font-black">"{assignedStudents[0].name || assignedStudents[0].email.split('@')[0]}"</span>. Check the Students tab for details.
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setShowNotification(false);
              localStorage.setItem("mentor_assigned_student_notification_dismissed", "true");
            }} 
            className="text-slate-400 hover:text-slate-700 transition-colors shrink-0 w-7 h-7 rounded-lg hover:bg-slate-100/50 relative z-10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 1. Student Messages (Real Data) */}
      {featureFlags.mentor_messages !== false && (
        <Card className="p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800 font-medium text-[15px]">
            <MessageSquare className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> 
            Student Messages 
            {messages.filter(m => m.from_user_id !== mentorId && !m.is_read).length > 0 && (
              <span className="bg-indigo-50 text-indigo-600 text-[11px] px-2 py-0.5 rounded-full ml-1">
                {messages.filter(m => m.from_user_id !== mentorId && !m.is_read).length} new
              </span>
            )}
          </div>
          <Button variant="link" size="xs" className="text-slate-400 hover:text-slate-600 font-medium p-0">View All</Button>
        </div>

        <div className="space-y-5">
          {(() => {
            const latestMessagesPerStudent: any[] = [];
            const seenStudents = new Set();
            messages
              .filter(m => m.from_user_id !== mentorId)
              .forEach(m => {
                if (!seenStudents.has(m.from_user_id)) {
                  seenStudents.add(m.from_user_id);
                  latestMessagesPerStudent.push(m);
                }
              });

            if (latestMessagesPerStudent.length === 0) {
              if (assignedStudents.length === 0) {
                return (
                  <div className="py-6 text-center">
                    <p className="text-slate-400 text-[13px]">No assigned mentees yet. Once a mentee is assigned, you can send them messages.</p>
                  </div>
                );
              }

              const targetStudentId = outreachStudentId || assignedStudents[0]?.id || "";
              const targetStudent = assignedStudents.find(s => s.id === targetStudentId);
              const studentName = targetStudent?.name || targetStudent?.email?.split('@')[0] || "Student";
              const currentInput = replyInputs[targetStudentId] || "";
              const isSuccess = sendSuccessMap[targetStudentId] || false;

              return (
                <div className="flex flex-col gap-3 py-1.5 animate-in fade-in duration-300">
                  <p className="text-slate-500 text-[12.5px] font-medium leading-normal bg-indigo-50/40 p-3 rounded-2xl border border-indigo-50/60">
                    👋 No messages yet from your students. Choose a student below to reach out and say hello!
                  </p>
                  
                  <div className="flex flex-col gap-2.5">
                    {!isSuccess && (
                      <div className="flex items-center gap-1.5 px-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">To:</span>
                        <select
                          value={targetStudentId}
                          onChange={(e) => setOutreachStudentId(e.target.value)}
                          className="bg-transparent border-0 text-slate-700 text-xs font-semibold focus:ring-0 focus:outline-none cursor-pointer hover:text-slate-900 transition-colors p-0"
                        >
                          {assignedStudents.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.name || student.email?.split('@')[0]}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      {isSuccess ? (
                        <div className="text-[11.5px] text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50/80 p-2.5 px-3.5 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-1">
                          <Check className="w-3.5 h-3.5" strokeWidth={3.5} /> Message sent to {studentName} successfully!
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input 
                            value={currentInput}
                            onChange={(e) => setReplyInputs(prev => ({ ...prev, [targetStudentId]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && currentInput.trim() && handleReply(targetStudentId, studentName)}
                            placeholder="Paste links or type a message to share..."
                            disabled={isSending}
                            className="flex-1 bg-white hover:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 text-[12.5px] transition-all disabled:opacity-50 h-9.5 px-3.5 rounded-xl border-slate-200 shadow-3xs"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const chars = "abcdefghijklmnopqrstuvwxyz";
                              const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                              const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                              const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                              const link = `https://meet.google.com/${part1}-${part2}-${part3}`;
                              setReplyInputs(prev => ({ 
                                ...prev, 
                                [targetStudentId]: (prev[targetStudentId] || "") + (prev[targetStudentId] ? " " : "") + link
                              }));
                            }}
                            className="w-9.5 h-9.5 rounded-xl flex items-center justify-center border border-slate-100 bg-white text-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-650 transition-all shrink-0 shadow-sm active:scale-95"
                            size="icon"
                            title="Insert Google Meet Link"
                          >
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleReply(targetStudentId, studentName)}
                            disabled={isSending || !currentInput.trim()}
                            className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm ${currentInput.trim() && !isSending ? 'bg-slate-900 text-white hover:bg-slate-800 scale-100 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                            size="icon"
                          >
                            {isSending ? <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" strokeWidth={2.5} />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return latestMessagesPerStudent.slice(0, 3).map((msg, index) => {
              const studentReplyInput = replyInputs[msg.from_user_id] || "";
              const studentSendSuccess = sendSuccessMap[msg.from_user_id] || false;

              return (
                <div key={msg.id} className="group relative flex flex-col gap-2.5">
                  {index > 0 && <div className="border-t border-slate-100/60 pt-4.5 mt-2"></div>}
                  
                  {/* Header: Avatar, Name, Time & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm shrink-0">
                      {msg.sender_name?.substring(0, 2) || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-[13.5px] truncate">{msg.sender_name}</span>
                        {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0"></span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Delete Button on Hover */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteMessage(msg.id)} 
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all w-8 h-8 rounded-full shrink-0" 
                      title="Delete Message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Message Body */}
                  <div className="pl-1">
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{msg.body}</p>
                  </div>
                  
                  {/* Reply Section */}
                  <div className="mt-1">
                    {studentSendSuccess ? (
                      <div className="text-[11.5px] text-emerald-600 font-medium flex items-center gap-1.5 bg-emerald-50/80 p-2 px-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-1">
                        <Check className="w-3.5 h-3.5" strokeWidth={3.5} /> Reply sent successfully!
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input 
                          value={studentReplyInput}
                          onChange={(e) => setReplyInputs(prev => ({ ...prev, [msg.from_user_id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleReply(msg.from_user_id, msg.sender_name)}
                          placeholder={`Reply to ${msg.sender_name} or share links...`}
                          disabled={isSending}
                          className="flex-1 bg-white/95 hover:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 text-[12.5px] transition-all disabled:opacity-50 h-9.5 px-3.5 rounded-xl border-slate-200 shadow-3xs"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const chars = "abcdefghijklmnopqrstuvwxyz";
                            const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                            const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                            const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                            const link = `https://meet.google.com/${part1}-${part2}-${part3}`;
                            setReplyInputs(prev => ({ 
                              ...prev, 
                              [msg.from_user_id]: (prev[msg.from_user_id] || "") + (prev[msg.from_user_id] ? " " : "") + link
                            }));
                          }}
                          className="w-9.5 h-9.5 rounded-xl flex items-center justify-center border border-slate-100 bg-white text-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-655 transition-all shrink-0 shadow-sm active:scale-95"
                          size="icon"
                          title="Insert Google Meet Link"
                        >
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleReply(msg.from_user_id, msg.sender_name)}
                          disabled={isSending || !studentReplyInput.trim()}
                          className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm ${studentReplyInput.trim() && !isSending ? 'bg-slate-900 text-white hover:bg-slate-800 scale-100 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                          size="icon"
                        >
                          {isSending ? <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" strokeWidth={2.5} />}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* Resource Sharing Banner Promotion - Encourages mentors to send resources */}
        {assignedStudents.length > 0 && (
          <div className="mt-5 pt-4.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-indigo-50/20 p-4 rounded-2xl border border-slate-100/50 animate-in fade-in duration-300">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 shadow-3xs">
                <Lightbulb className="w-4.5 h-4.5 animate-pulse-subtle" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-slate-800 leading-tight">Pro-Tip: Share useful learning links!</p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-normal">Send curated Next.js docs, CSS cheat sheets, or custom roadmaps with 1-click.</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                const activeStudent = outreachStudentId || assignedStudents[0]?.id || "";
                setSelectedStudentForSharing(activeStudent);
                setShowShareMaterials(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] h-9 px-4.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm self-start sm:self-auto shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Materials
            </Button>
          </div>
        )}
      </Card>
      )}





      {/* 10. Interesting Fact of the Day (Clipboard Share Helper) */}
      {featureFlags.mentor_facts !== false && activeFact && (
        <div className="px-1 mt-6">
          <div className="bg-gradient-to-r from-violet-50/60 to-indigo-50/40 rounded-3xl p-5 border border-violet-100/50 relative overflow-hidden group shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-indigo-950 font-bold text-[13px] relative z-10">
              <span className="flex items-center gap-1.5">
                <span className="text-base animate-bounce-slow">{activeFact.emoji || "💡"}</span> 
                Interesting Fact of the Day
                <span className="bg-violet-100 text-violet-750 text-[8.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ml-1.5">
                  {activeFact.category}
                </span>
              </span>
            </div>
            <p 
              className="text-[13px] text-indigo-900 leading-relaxed font-semibold px-1 relative z-10"
              dangerouslySetInnerHTML={{ __html: activeFact.content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }}
            />
            <div className="flex gap-2 relative z-10 mt-1">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Hey! Did you know? ${activeFact.content.replace(/\*\*/g, '')}`);
                  setFactCopied(true);
                  setTimeout(() => setFactCopied(false), 2000);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-[12px] flex gap-2 items-center justify-center transition-all active:scale-98 border h-9.5 cursor-pointer ${
                  factCopied 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50/50"
                }`}
              >
                {factCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied to Share!
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" /> Share in Chat / Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Resources & Community Grid */}
      <div className="px-1 mt-6">
        <p className="text-[10px] text-slate-400 tracking-[0.15em] font-semibold mb-4 uppercase">Resources & Community</p>
        <div className="grid grid-cols-2 gap-3">
          {/* Mentor Circle Card */}
          <div 
            onClick={() => setShowCircle(true)}
            className="p-4.5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer group active:scale-[0.98] flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-50/70 flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5.5 h-5.5 text-indigo-500 fill-indigo-50" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 leading-tight">Mentor Circle</p>
              <p className="text-[10.5px] text-slate-400 font-medium mt-1">6+ mentors</p>
            </div>
          </div>

          {/* Best Practices Card */}
          <div 
            onClick={() => setShowPlaybook(true)}
            className="p-4.5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer group active:scale-[0.98] flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-50/70 flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5.5 h-5.5 text-indigo-500 fill-indigo-50" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 leading-tight">Best Practices</p>
              <p className="text-[10.5px] text-slate-400 font-medium mt-1">10 techniques</p>
            </div>
          </div>

          {/* Session Notes Card */}
          <div 
            onClick={() => setShowNotes(true)}
            className="p-4.5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 transition-all cursor-pointer group active:scale-[0.98] flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5.5 h-5.5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 leading-tight">Session Notes</p>
              <p className="text-[10.5px] text-slate-400 font-medium mt-1">3 notes</p>
            </div>
          </div>

          {/* My Courses Card */}
          <div 
            onClick={() => setShowCourses(true)}
            className="p-4.5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 transition-all cursor-pointer group active:scale-[0.98] flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5.5 h-5.5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 leading-tight">My Courses</p>
              <p className="text-[10.5px] text-slate-400 font-medium mt-1">4 enrolled</p>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Student Gratitude Wall (Subtle design moved to bottom) */}
      {featureFlags.mentor_gratitude !== false && (
        <div className="px-1 mt-7 mb-4">
          <div className="bg-emerald-50/20 border border-emerald-100/40 rounded-2xl p-4.5 text-center relative overflow-hidden">
            <Heart className="w-4 h-4 fill-emerald-500/80 text-emerald-500/80 mx-auto mb-2.5 animate-pulse-subtle" />
            <p className="text-[12.5px] text-emerald-800/90 italic leading-relaxed font-medium max-w-md mx-auto">
              "{latestGratitude?.message_content || latestGratitude?.message || "Honestly transformed how I approach debugging. Thanks for being so patient with me during our session yesterday!"}"
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100/50 text-emerald-600 flex items-center justify-center shadow-3xs shrink-0">
                <GraduationCap className="w-3 h-3" />
              </div>
              <span className="text-[10.5px] text-emerald-700/80 font-bold uppercase tracking-wider">
                {latestGratitude?.display_name || latestGratitude?.name || "Priya S."} • Student Gratitude
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Overlays */}
      <AnimatePresence>
        {showPlaybook && (
          <MentorPlaybook onBack={() => setShowPlaybook(false)} />
        )}
        {showInspiration && (
          <MentorInspiration mentorName={mentorName} onClose={() => setShowInspiration(false)} />
        )}
        {showCircle && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-inter overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex-1 overflow-y-auto hidden-scrollbar p-6">
              <MentorCircle onClose={() => setShowCircle(false)} />
            </div>
          </motion.div>
        )}
        {showNotes && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-inter overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex-1 overflow-y-auto hidden-scrollbar p-6">
              <MentorNotes onClose={() => setShowNotes(false)} />
            </div>
          </motion.div>
        )}
        {showCourses && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-inter overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex-1 overflow-y-auto hidden-scrollbar px-6 py-6 md:px-8">
              <MentorCourses onClose={() => setShowCourses(false)} />
            </div>
          </motion.div>
        )}
        {showShareMaterials && (
          <MentorShareMaterials 
            mentorId={mentorId || ""}
            assignedStudents={assignedStudents}
            defaultStudentId={selectedStudentForSharing}
            onClose={() => {
              setShowShareMaterials(false);
              if (mentorId) fetchAllMentorData(mentorId, true, mentorEmail);
            }}
          />
        )}
      </AnimatePresence>

      {/* Interactive Review Dialog Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedReviewSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-950 font-medium text-base">Write Review Feedback</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Session: {selectedReviewSession.title}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setSelectedReviewSession(null);
                  }}
                  className="text-slate-300 hover:text-slate-600 text-sm font-medium w-6 h-6 rounded-full hover:bg-slate-50 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-medium tracking-wider">Rating Score</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-2xl transition-transform active:scale-90 animate-none p-0 bg-transparent"
                      >
                        <span className={star <= reviewRating ? "text-amber-400" : "text-slate-200"}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-medium tracking-wider">Comments & Mentorship Notes</p>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback, next steps, or learning outcomes for this student..."
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    className="w-full text-xs text-slate-800 placeholder-slate-300 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl px-3 py-2 outline-none border border-slate-200 resize-none transition-all focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      setSelectedReviewSession(null);
                    }}
                    className="flex-1 rounded-xl text-xs"
                    disabled={isSubmittingReview}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    className="flex-1 rounded-xl text-xs bg-slate-900 text-white"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? "Saving..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Session Modal */}
      <AnimatePresence>
        {isScheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0f172a]/40 backdrop-blur-xs p-0 sm:p-4">
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-t-[2rem] sm:rounded-2xl w-full sm:max-w-md overflow-hidden shadow-2xl border-t sm:border border-slate-100 flex flex-col max-h-[85vh] sm:max-h-none shrink-0"
            >
              {/* Pull handle bar */}
              <div className="w-full flex justify-center py-2.5 bg-[#0f172a] shrink-0 sm:hidden">
                <div className="w-12 h-1 rounded-full bg-white/20"></div>
              </div>

              {/* Header */}
              <div className="bg-[#0f172a] text-white px-6 pb-6 pt-5 sm:pt-6 relative shrink-0">
                <button 
                  onClick={() => setIsScheduleOpen(false)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-medium tracking-tight">Schedule 1:1 Session</h3>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Invite your mentee to a live interactive session</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form 
                onSubmit={handleScheduleSession} 
                className="p-6 space-y-4 overflow-y-auto hidden-scrollbar pb-8"
              >
                
                {/* Select Mentee */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Select Mentee</Label>
                  <select
                    value={schedStudentId}
                    onChange={(e) => setSchedStudentId(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
                  >
                    <option value="" disabled>Choose a mentee...</option>
                    {assignedStudents.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>

                {/* Session Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Session Title</Label>
                  <Input 
                    value={schedTitle}
                    onChange={(e) => setSchedTitle(e.target.value)}
                    placeholder="e.g. Code Review, Career Guidance"
                    required
                    className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>

                {/* Topics / Notes */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Topics / Notes</Label>
                  <Textarea 
                    value={schedNotes}
                    onChange={(e) => setSchedNotes(e.target.value)}
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
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      required
                      className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Time</Label>
                    <Input 
                      type="time"
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      required
                      className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus:border-slate-400 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>

                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider ml-1">Duration</Label>
                  <select 
                    value={schedDuration}
                    onChange={(e) => setSchedDuration(e.target.value)}
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
                    onClick={() => setIsScheduleOpen(false)}
                    className="flex-1 h-11 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-medium"
                    disabled={isScheduling}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 rounded-xl bg-[#0f172a] text-white hover:bg-slate-800 font-medium text-xs shadow-md"
                    disabled={isScheduling || !schedTitle.trim() || !schedDate || !schedTime}
                  >
                    {isScheduling ? "Booking..." : "Book Session"}
                  </Button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
