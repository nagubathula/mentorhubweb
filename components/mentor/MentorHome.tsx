"use client";

import { MessageSquare, Calendar, Circle, Check, Zap, Trophy, ShieldCheck, Heart, Sparkles, BookOpen, Clock, Activity, Medal, Star, Flame, Lightbulb, Bell, X, Send, Trash2, Users, ChevronDown, GraduationCap, FileText, Share2, Pencil } from "lucide-react";
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

interface MentorHomeProps {
  featureFlags?: Record<string, boolean>;
  onSelectStudent?: (studentId: string) => void;
}

export function MentorHome({ featureFlags = {}, onSelectStudent }: MentorHomeProps) {
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
  const [mentorName, setMentorName] = useState("Mentor");
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
        fetchAllMentorData(mentorId, true);
        alert("Session scheduled successfully!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScheduling(false);
    }
  };

  const fetchAllMentorData = async (currentUserId: string, isMounted: boolean) => {
    // Fetch profile name
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', currentUserId).single();
    if (profile?.name && isMounted) {
      setMentorName(profile.name);
    }

    // Fetch assigned students
    const { data: mappings } = await supabase.from('mapping')
      .select('student:profiles!mapping_student_id_fkey(*)')
      .eq('mentor_id', currentUserId);
    
    const assigned = mappings?.map(m => m.student).filter(Boolean) || [];

    // Load active enrollments progress for mapped students
    let enrichedStudents: any[] = [];
    if (assigned.length > 0) {
      const { data: enrollments } = await supabase.from('enrollments')
        .select('*, course:courses(*)')
        .in('student_id', assigned.map(s => s.id))
        .eq('status', 'Active');

      const enrollmentMap = new Map();
      if (enrollments) {
        enrollments.forEach(e => {
          enrollmentMap.set(e.student_id, e);
        });
      }

      enrichedStudents = assigned.map(p => {
        const studentEnrollment = enrollmentMap.get(p.id);
        const totalTopics = (studentEnrollment?.course?.content || []).reduce((acc: number, m: any) => acc + (m.topics?.length || m.lessons?.length || 0), 0);
        const completedTopics = studentEnrollment?.progress?.length || 0;
        const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

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
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
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
    
    if (isMounted && msgs) setMessages(msgs);

    // Fetch Scheduled Sessions
    const { data: sessData } = await supabase.from('sessions')
      .select('*, student:profiles!sessions_student_id_fkey(*)')
      .eq('mentor_id', currentUserId)
      .order('scheduled_at', { ascending: true });
    
    if (isMounted && sessData) {
      setSessions(sessData);
    }

    // Calculate completed sessions total hours
    const completedSessions = sessData?.filter(s => s.status === 'Completed' || s.status === 'completed') || [];
    const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 30), 0);
    const totalHours = Math.round(totalMinutes / 60) || 0;

    // Fetch reviews written for this mentor
    const { data: reviewsReceived } = await supabase.from('reviews')
      .select('*')
      .eq('reviewee_id', currentUserId);

    let avgRating = 5.0;
    if (reviewsReceived && reviewsReceived.length > 0) {
      const rated = reviewsReceived.filter(r => r.rating !== null);
      if (rated.length > 0) {
        avgRating = Math.round((rated.reduce((sum, r) => sum + (r.rating || 0), 0) / rated.length) * 10) / 10;
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
    const { data: reviewsWritten } = await supabase.from('reviews')
      .select('session_id')
      .eq('reviewer_id', currentUserId);

    const reviewedSessionIds = new Set(reviewsWritten?.map(r => r.session_id).filter(Boolean) || []);

    const pendingReviewSessions = sessData?.filter(s => 
      (s.status === 'Completed' || s.status === 'completed' || (s.scheduled_at && new Date(s.scheduled_at) < new Date())) && 
      !reviewedSessionIds.has(s.id)
    ) || [];

    const formattedPendingReviews = pendingReviewSessions.map(s => ({
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

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMounted) return;
      
      const currentUserId = session.user.id;
      setMentorId(currentUserId);

      await fetchAllMentorData(currentUserId, isMounted);

      // Real-time message listener
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
    };

    init();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleReply = async (studentId: string, studentName: string, bodyText?: string) => {
    const text = bodyText || replyInputs[studentId] || "";
    if (!text.trim() || !mentorId) return;

    setIsSending(true);
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
      fetchAllMentorData(mentorId, true);
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

      {/* 8-Week Roadmap Relocated to the Top */}
      <div className="px-1 animate-in fade-in slide-in-from-top-3 duration-500">
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
                  className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
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
                <div className="space-y-5 relative pl-1">
                  {dynamicWeeks.map((w, idx) => {
                    const isExpanded = expandedWeek === w.week;
                    const isCompleted = w.status === "completed";
                    const isActive = w.status === "active";
                    
                    let circleBg = "bg-slate-50 border border-slate-200 text-slate-400";
                    let titleColor = "text-slate-500 font-medium";
                    
                    if (isCompleted) {
                      circleBg = "bg-emerald-500 text-white";
                      titleColor = "text-slate-700 font-medium";
                    } else if (isActive) {
                      circleBg = "bg-violet-50 border-2 border-violet-500 text-violet-600 font-bold animate-pulse";
                      titleColor = "text-violet-600 font-bold";
                    }

                    return (
                      <div key={w.week} className="relative flex items-start gap-4">
                        {/* Vertical timeline connector */}
                        {idx < dynamicWeeks.length - 1 && (
                          <div className={`absolute left-3 top-7 bottom-[-25px] w-[2px] ${
                            isCompleted ? "bg-emerald-200" : "bg-slate-100"
                          }`} />
                        )}

                        {/* Icon Circle */}
                        <button 
                          onClick={() => setExpandedWeek(isExpanded ? null : w.week)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 z-10 transition-all active:scale-90 ${circleBg}`}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            w.week
                          )}
                        </button>

                        {/* Content Block */}
                        <div className="flex-1 min-w-0">
                          <div 
                            onClick={() => setExpandedWeek(isExpanded ? null : w.week)}
                            className="flex items-center justify-between cursor-pointer py-0.5 group"
                          >
                            <span className={`text-[13px] transition-colors group-hover:text-slate-900 ${titleColor}`}>
                              Week {w.week} — {w.title}
                            </span>
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <span className="bg-violet-50 border border-violet-100 text-violet-600 text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0">
                                  This week
                                </span>
                              )}
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                isExpanded ? "rotate-180 text-slate-600" : ""
                              }`} />
                            </div>
                          </div>

                          {/* Sub-items Accordion */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2.5 ml-1 space-y-2 border-l border-slate-100 pl-3">
                                  {w.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-start gap-2 text-slate-500 hover:text-slate-800 transition-colors py-0.5 animate-in fade-in slide-in-from-left-2 duration-200">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                      <span className="text-[12px] font-medium leading-relaxed">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Info with dynamic rest calculations */}
                {assignedStudents.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] font-medium text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>🗓️</span>
                      <div>
                        {isEditingJoinedDate ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="date"
                              value={editJoinedDateValue}
                              onChange={(e) => setEditJoinedDateValue(e.target.value)}
                              className="bg-white border border-slate-200 text-slate-800 text-[10.5px] font-semibold rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                            />
                            <button
                              onClick={handleSaveJoinedDate}
                              disabled={isSavingJoinedDate}
                              className="h-6 px-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md text-[9px] font-bold disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              {isSavingJoinedDate ? "..." : "Save"}
                            </button>
                            <button
                              onClick={() => setIsEditingJoinedDate(false)}
                              className="h-6 px-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md text-[9px] font-medium transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="flex items-center gap-1">
                            Joined on <strong className="text-slate-700">{new Date(currentStudentJoinedDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong>
                            <button
                              onClick={() => {
                                const d = new Date(currentStudentJoinedDate);
                                const yyyy = d.getFullYear();
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const dd = String(d.getDate()).padStart(2, '0');
                                setEditJoinedDateValue(`${yyyy}-${mm}-${dd}`);
                                setIsEditingJoinedDate(true);
                              }}
                              className="p-0.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors inline-flex items-center justify-center cursor-pointer ml-0.5"
                              title="Edit Joined Date"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/50 p-2 px-3 rounded-xl leading-normal text-slate-500/80">
                      <span>⚡</span>
                      <span>
                        Active week: <strong>{learningDays} study days</strong> ({skippedDays} rest days skipped based on rest schedule: <em>{optOutDays.join(", ")}</em>).
                      </span>
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </Card>
      </div>
      
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
              <span className="bg-rose-100 text-rose-500 text-[11px] px-2 py-0.5 rounded-full ml-1">
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
                <div className="flex flex-col gap-3.5 py-1.5 animate-in fade-in duration-300">
                  <p className="text-slate-500 text-[12.5px] font-medium leading-normal bg-indigo-50/40 p-3 rounded-2xl border border-indigo-50/60">
                    👋 No messages yet from your students. Choose a student below to reach out and say hello!
                  </p>
                  
                  <div className="flex flex-col gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Reach out to:</span>
                      <select
                        value={targetStudentId}
                        onChange={(e) => setOutreachStudentId(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors shadow-3xs cursor-pointer min-w-[140px]"
                      >
                        {assignedStudents.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name || student.email?.split('@')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-1">
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
                            placeholder={`Type a friendly message to ${studentName}...`}
                            disabled={isSending}
                            className="flex-1 bg-white hover:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 text-[12.5px] transition-all disabled:opacity-50 h-9.5 px-3.5 rounded-xl border-slate-200 shadow-3xs"
                          />
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
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50/50 transition-all w-8 h-8 rounded-full shrink-0" 
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
                          placeholder={`Reply to ${msg.sender_name}...`}
                          disabled={isSending}
                          className="flex-1 bg-white/95 hover:bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 text-[12.5px] transition-all disabled:opacity-50 h-9.5 px-3.5 rounded-xl border-slate-200 shadow-3xs"
                        />
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

      {/* 2 & 3. Today's Plan & Mentees Overview */}
      {(featureFlags.mentor_students !== false || featureFlags.mentor_sessions !== false) && (
        <Card className="p-5.5 shadow-sm h-auto flex flex-col gap-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-800 font-medium text-[15px]">
            <Calendar className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> Today&apos;s Plan
          </div>
          <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
            <span className="bg-orange-50 text-orange-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* 3. Mentees */}
        {featureFlags.mentor_students !== false && (
          <>
            <p className="text-[10px] text-slate-400 tracking-[0.15em] font-semibold mb-2 uppercase">My Mentees</p>
            <div className="flex gap-4.5 mb-1.5 overflow-x-auto pb-1 hidden-scrollbar">
          {assignedStudents.length === 0 ? (
            <div className="w-full py-6 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-300 mb-2" />
              <span className="text-[13px] text-slate-400 font-medium">No assigned mentees yet.</span>
            </div>
          ) : (
            assignedStudents.map((stud, idx) => (
              <div 
                key={stud.id} 
                onClick={() => onSelectStudent?.(stud.id)}
                className="flex flex-col items-center min-w-[70px] group cursor-pointer"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-[22px] overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50 group-hover:shadow-md group-hover:border-slate-200/50 transition-all duration-300 group-active:scale-95 flex items-center justify-center relative">
                    {stud.avatar_url ? (
                      <img 
                        className="w-full h-full object-cover" 
                        src={stud.avatar_url} 
                        alt={stud.name}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(stud.id)} flex items-center justify-center text-white font-black text-xl uppercase tracking-tight shadow-inner`}>
                        {stud.name ? stud.name.trim().charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold leading-none z-10">
                      {stud.daysJoined || 1}
                    </div>
                  )}
                </div>
                <span className="text-[12px] text-slate-900 mt-2 font-medium truncate max-w-[75px] group-hover:text-indigo-600 transition-colors">
                  {stud.name?.split(" ")[0]}
                </span>
              </div>
            ))
          )}
        </div>
          </>
        )}

        {featureFlags.mentor_sessions !== false && (
          <>
            <div className="border-t border-slate-100/60 my-2.5"></div>

            {/* Sessions */}
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
          </>
        )}
      </Card>
      )}





      {/* 11. Resources & Community Grid */}
      <div className="px-1 mt-6">
        <p className="text-[10px] text-slate-400 tracking-[0.15em] font-semibold mb-4 uppercase">Resources & Community</p>
        <div className="grid grid-cols-2 gap-3">
          {/* Mentor Circle Card */}
          <div 
            onClick={() => setShowCircle(true)}
            className="p-4.5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-teal-200 transition-all cursor-pointer group active:scale-[0.98] flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-50/70 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5.5 h-5.5 text-teal-600 fill-teal-50" />
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
            <div className="flex-1 overflow-y-auto hidden-scrollbar">
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
              if (mentorId) fetchAllMentorData(mentorId, true);
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
