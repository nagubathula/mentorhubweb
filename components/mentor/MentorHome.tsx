"use client";

import { MessageSquare, Calendar, Circle, Check, Zap, Trophy, ShieldCheck, Heart, Sparkles, BookOpen, Clock, Activity, Medal, Star, Flame, Lightbulb, Bell, X, Send, Trash2 } from "lucide-react";
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

const supabase = createClient();

export function MentorHome() {
  const [showNotification, setShowNotification] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ students: 0, hours: 0, rating: 5.0 });
  const [latestGratitude, setLatestGratitude] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [mentorName, setMentorName] = useState("Mentor");
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

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

        return {
          ...p,
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'Unknown Student',
          progress: progressPercent,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`
        };
      });
    }

    if (!isMounted) return;
    setAssignedStudents(enrichedStudents);

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
    const text = bodyText || replyInput;
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
      setReplyInput("");
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
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

  return (
    <div className="space-y-6 pb-20">
      
      {/* 14. New Student Notifications (Real Data) */}
      {showNotification && assignedStudents.length > 0 && (
        <Card className="bg-slate-50 border border-slate-200 p-4 flex gap-4 mt-6 items-start mx-1 hover:translate-y-0 shadow-none">
          <div className="bg-[#0f172a] rounded-full p-2 text-white shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 mt-0.5 min-w-0">
             <h3 className="text-slate-900 font-semibold text-[15px]">You have {assignedStudents.length} assigned student{assignedStudents.length > 1 ? 's' : ''}!</h3>
             <p className="text-slate-500 text-[13px] mt-1 leading-relaxed">
               Latest student: "{assignedStudents[0].name || assignedStudents[0].email.split('@')[0]}". Check the Students tab for details.
             </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotification(false)} 
            className="text-slate-300 hover:text-slate-600 transition-colors p-1 shrink-0 w-8 h-8 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {/* 7. Daily Inspiration Widget */}
      <Card 
        onClick={() => setShowInspiration(true)}
        className="bg-[#0f172a] text-white p-6 mx-1 mt-4 relative overflow-hidden cursor-pointer hover:bg-slate-900 active:scale-[0.99] transition-all"
      >
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
      </Card>

      {/* 8. Mentor Stats */}
      <div className="flex gap-4 px-1">
         <Card className="flex-1 p-4 shadow-sm hover:translate-y-[-2px]">
            <div className="flex items-center gap-2 text-slate-500 mb-2"><BookOpen className="w-4 h-4"/> <span className="text-[11px] font-bold uppercase tracking-wider">Students</span></div>
            <div className="text-2xl font-bold text-slate-800">{stats.students}</div>
         </Card>
         <Card className="flex-1 p-4 shadow-sm hover:translate-y-[-2px]">
            <div className="flex items-center gap-2 text-slate-500 mb-2"><Clock className="w-4 h-4"/> <span className="text-[11px] font-bold uppercase tracking-wider">Hours</span></div>
            <div className="text-2xl font-bold text-slate-800">{stats.hours}</div>
         </Card>
         <Card className="flex-1 p-4 shadow-sm hover:translate-y-[-2px]">
            <div className="flex items-center gap-2 text-slate-500 mb-2"><Star className="w-4 h-4"/> <span className="text-[11px] font-bold uppercase tracking-wider">Rating</span></div>
            <div className="text-2xl font-bold text-slate-800">{stats.rating}</div>
         </Card>
      </div>

      {/* 1. Student Messages (Real Data) */}
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

        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-slate-400 text-[13px]">No messages yet from your students.</p>
            </div>
          ) : (
            messages.filter(m => m.from_user_id !== mentorId).slice(0, 1).map((msg) => (
              <div key={msg.id} className="flex gap-4 relative group">
                <div className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 uppercase font-bold text-[14px]">
                  {msg.sender_name?.substring(0, 2) || "S"}
                </div>
                <div className="flex-1 mt-0.5">
                  <div className="flex items-center gap-2 text-[14px]">
                    <span className="font-medium text-slate-800">{msg.sender_name}</span> 
                    <span className="text-slate-300 text-[12px]">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span> 
                    {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteMessage(msg.id)} 
                      className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity w-8 h-8 rounded-full" 
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">{msg.body}</p>
                  
                  <div className="mt-3">
                    {sendSuccess ? (
                      <div className="text-[12px] text-emerald-500 font-medium flex items-center gap-1 py-2">
                        <Check className="w-3 h-3" /> Reply sent successfully!
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input 
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleReply(msg.from_user_id, msg.sender_name)}
                          placeholder={`Reply to ${msg.sender_name}...`}
                          disabled={isSending}
                          className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white text-[14px] outline-none transition-all disabled:opacity-50 h-12 px-4 rounded-xl border border-slate-200"
                        />
                        <Button 
                          onClick={() => handleReply(msg.from_user_id, msg.sender_name)}
                          disabled={isSending || !replyInput.trim()}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${replyInput.trim() && !isSending ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}
                          size="icon"
                        >
                          {isSending ? <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 2 & 3. Today's Plan & Mentees Overview */}
      <Card className="p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-800 font-medium text-[15px]">
            <Calendar className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> Today&apos;s Plan
          </div>
          <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</span>
            <span className="bg-orange-50 text-orange-500 text-[12px] px-2.5 py-1 rounded-full font-medium">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* 3. Mentees */}
        <p className="text-[11px] text-slate-400 tracking-widest font-semibold mb-4 uppercase">Mentees</p>
        <div className="flex gap-6 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {assignedStudents.length === 0 ? (
            <span className="text-[13px] text-slate-400">No assigned mentees yet.</span>
          ) : (
            assignedStudents.map((stud, idx) => (
              <div key={stud.id} className="flex flex-col items-center min-w-[60px]">
                <div className="relative">
                  <img 
                    className="w-12 h-12 rounded-full border border-slate-200 object-cover bg-slate-50" 
                    src={stud.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stud.id}`} 
                    alt={stud.name}
                  />
                  {idx === 0 && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full ring-[2.5px] ring-white"></div>}
                </div>
                <span className="text-[12px] text-slate-600 mt-2 font-medium truncate max-w-[70px]" title={stud.name}>
                  {stud.name?.split(" ")[0]}
                </span>
                <div className="w-[30px] h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                   <div className="bg-blue-600 h-full" style={{ width: `${stud.progress || 0}%` }}></div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-50 my-6"></div>

        {/* Sessions */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] text-slate-400 tracking-widest font-semibold uppercase">Sessions</p>
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
            className="text-[10px] text-indigo-600 border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50 font-bold h-7 px-2.5 rounded-full"
          >
            + Schedule Session
          </Button>
        </div>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">No upcoming sessions scheduled yet.</p>
          ) : (
            sessions.map((sess) => {
              const isCompleted = sess.status === 'Completed' || sess.status === 'completed';
              const schedDate = sess.scheduled_at ? new Date(sess.scheduled_at) : null;
              const timeStr = schedDate ? schedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Flexible";
              const dateStr = schedDate ? schedDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) : "";

              return (
                <div key={sess.id} className={`flex gap-4 items-start p-4 rounded-xl border transition-all ${isCompleted ? 'bg-emerald-50/10 border-transparent' : 'bg-slate-50 border-slate-100/50'}`}>
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white mt-1 shrink-0"><Check className="w-3.5 h-3.5" strokeWidth={3} /></div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 mt-1 shrink-0" />
                  )}
                  <div className="text-[12px] text-slate-400 font-bold mt-1.5 w-[70px] shrink-0">{timeStr}<br/><span className="text-[10px] text-slate-400">{dateStr}</span></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-bold truncate ${isCompleted ? 'text-slate-300 line-through' : 'text-slate-800'}`}>{sess.title}</p>
                    <p className="text-[13px] text-slate-400 mt-0.5">{sess.student?.name || "Student"}</p>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium mt-0.5 shrink-0 ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                    {sess.duration_minutes || 30}m
                  </span>
                </div>
              );
            })
          )}
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
              <Button 
                onClick={() => handleOpenReviewModal(r)} 
                className="text-[11px] font-medium rounded-full shrink-0 shadow-sm hover:scale-105 transition-transform"
                size="sm"
              >
                Review
              </Button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-[13px] text-slate-400">All caught up!</p>}
        </div>
      </Card>

      {/* 9. Student Gratitude Wall */}
      <Card className="bg-emerald-50 border border-emerald-100 p-5 relative overflow-hidden shadow-none hover:translate-y-0">
        <Heart className="absolute -bottom-4 -right-4 w-24 h-24 text-emerald-200/50 -rotate-12" />
        <div className="flex items-center gap-2 mb-4 text-emerald-800 font-semibold text-[15px] relative z-10">
          <Heart className="w-[18px] h-[18px] fill-emerald-200 text-emerald-600" strokeWidth={2}/> Community Gratitude Wall
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-50 relative z-10">
          <p className="text-[14px] text-emerald-900 italic leading-relaxed">
            "{latestGratitude?.message_content || latestGratitude?.message || "Honestly transformed how I approach debugging. Thanks for being so patient with me during our session yesterday!"}"
          </p>
          <div className="flex items-center gap-2 mt-4">
             <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-[10px] uppercase shrink-0">
               {(latestGratitude?.display_name || latestGratitude?.name || "Priya S.").substring(0, 2)}
             </div>
             <span className="text-[12px] font-medium text-emerald-700">
               - {latestGratitude?.display_name || latestGratitude?.name || "Priya S."}
             </span>
          </div>
        </div>
      </Card>

      {/* 11. Mentor Best Practices */}
      <Card 
        onClick={() => setShowPlaybook(true)}
        className="p-5 shadow-sm hover:border-slate-300 transition-colors cursor-pointer active:scale-[0.99]"
      >
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
      </Card>

      {/* Full-Screen Overlays */}
      <AnimatePresence>
        {showPlaybook && (
          <MentorPlaybook onBack={() => setShowPlaybook(false)} />
        )}
        {showInspiration && (
          <MentorInspiration mentorName={mentorName} onClose={() => setShowInspiration(false)} />
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
                  <h3 className="text-slate-950 font-bold text-base">Write Review Feedback</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Session: {selectedReviewSession.title}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setSelectedReviewSession(null);
                  }}
                  className="text-slate-300 hover:text-slate-600 text-sm font-bold w-6 h-6 rounded-full hover:bg-slate-50 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rating Score</p>
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
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Comments & Mentorship Notes</p>
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
                    <h3 className="text-[18px] font-bold font-volkhov tracking-tight">Schedule 1:1 Session</h3>
                    <p className="text-[11px] text-slate-400 font-bold font-mulish uppercase tracking-wider">Invite your mentee to a live interactive session</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form 
                onSubmit={handleScheduleSession} 
                className="p-6 space-y-4 overflow-y-auto hidden-scrollbar pb-8 font-mulish"
              >
                
                {/* Select Mentee */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Select Mentee</Label>
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
                  <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Session Title</Label>
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
                  <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Topics / Notes</Label>
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
                    <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Date</Label>
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
                    <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Time</Label>
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
                  <Label className="text-xs text-slate-500 font-bold font-mulish uppercase tracking-wider ml-1">Duration</Label>
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
                    className="flex-1 h-11 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold font-mulish"
                    disabled={isScheduling}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 rounded-xl bg-[#0f172a] text-white hover:bg-slate-800 font-bold text-xs font-mulish shadow-md"
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
