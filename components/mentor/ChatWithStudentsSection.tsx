"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, User, Circle, ShieldCheck, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatLastActive } from "@/components/chat/RealtimeChat";

const supabase = createClient();

export interface StudentProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null;
  preferences?: any;
  last_message?: string | null;
  unread_count?: number;
}

interface ChatWithStudentsSectionProps {
  mentorId?: string | null;
  students?: StudentProfile[];
  onOpenChat: (studentId: string) => void;
}

export function ChatWithStudentsSection({
  mentorId,
  students: studentsProp,
  onOpenChat,
}: ChatWithStudentsSectionProps) {
  const [students, setStudents] = useState<StudentProfile[]>(studentsProp || []);
  const [isLoading, setIsLoading] = useState<boolean>(!studentsProp || (studentsProp.length === 0 && !!mentorId));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [lastMessages, setLastMessages] = useState<Record<string, { body: string; created_at: string }>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // 1. Fetch assigned students for mentorId directly from DB mapping table
  const fetchAssignedStudents = useCallback(async () => {
    if (!mentorId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Query mapping table for assigned students
      const { data: mappings, error } = await supabase
        .from("mapping")
        .select("student:profiles!mapping_student_id_fkey(*)")
        .eq("mentor_id", mentorId);

      if (error) {
        console.error("Failed to load assigned students:", error);
        setErrorMsg("Unable to load students. Please try again.");
        setStudents([]);
      } else {
        const fetchedList = (mappings || [])
          .map((m: any) => m.student)
          .filter(Boolean)
          .map((p: any) => ({
            id: p.id,
            name: p.name || p.email?.split("@")[0] || "Student",
            email: p.email || "",
            avatar_url: p.avatar_url || (p.preferences as any)?.avatar_url || null,
          }));

        setStudents(fetchedList);
        setErrorMsg(null);
      }
    } catch (err) {
      console.error("Exception loading assigned students:", err);
      setErrorMsg("Unable to load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [mentorId]);

  useEffect(() => {
    if (studentsProp && studentsProp.length > 0) {
      setStudents(studentsProp);
      setIsLoading(false);
      setErrorMsg(null);
    } else if (mentorId) {
      fetchAssignedStudents();
    } else {
      setIsLoading(false);
    }
  }, [mentorId, studentsProp, fetchAssignedStudents]);

  // 2. Fetch last messages & unread counts for each student
  const fetchMessagesData = useCallback(async () => {
    if (!mentorId || students.length === 0) return;

    try {
      const studentIds = students.map((s) => s.id);

      // Fetch last message for each student
      const { data: msgsData } = await supabase
        .from("messages")
        .select("*")
        .or(`from_user_id.eq.${mentorId},to_user_id.eq.${mentorId}`)
        .order("created_at", { ascending: false });

      if (msgsData) {
        const lastMsgMap: Record<string, { body: string; created_at: string }> = {};
        const unreadsMap: Record<string, number> = {};

        msgsData.forEach((m: any) => {
          const otherId = m.from_user_id === mentorId ? m.to_user_id : m.from_user_id;

          if (otherId && studentIds.includes(otherId)) {
            // First encountered message for this pair is the latest
            if (!lastMsgMap[otherId]) {
              lastMsgMap[otherId] = {
                body: m.body,
                created_at: m.created_at,
              };
            }

            // Count unread incoming messages from student
            if (m.from_user_id === otherId && m.to_user_id === mentorId && !m.is_read) {
              unreadsMap[otherId] = (unreadsMap[otherId] || 0) + 1;
            }
          }
        });

        setLastMessages(lastMsgMap);
        setUnreadCounts(unreadsMap);
      }
    } catch (err) {
      console.error("Error loading student messages data:", err);
    }
  }, [mentorId, students]);

  useEffect(() => {
    fetchMessagesData();
  }, [fetchMessagesData]);

  // 3. Supabase Realtime Presence channel for Online/Offline status
  useEffect(() => {
    if (!mentorId) return;

    const presenceChannel = supabase.channel("online-presence-chat");

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        setOnlineUserIds(new Set(Object.keys(state)));
      })
      .on("presence", { event: "join" }, ({ key }: { key: string }) => {
        setOnlineUserIds((prev) => new Set(prev).add(key));
      })
      .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
        setOnlineUserIds((prev) => {
          const updated = new Set(prev);
          updated.delete(key);
          return updated;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [mentorId]);

  // 4. Real-time Message Listener to update last message & unread count instantly
  useEffect(() => {
    if (!mentorId) return;

    const channel = supabase.channel(`mentor-students-chat-realtime-${mentorId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: any) => {
          const newMsg = payload.new;
          if (newMsg.from_user_id === mentorId || newMsg.to_user_id === mentorId) {
            const studentId = newMsg.from_user_id === mentorId ? newMsg.to_user_id : newMsg.from_user_id;

            setLastMessages((prev) => ({
              ...prev,
              [studentId]: { body: newMsg.body, created_at: newMsg.created_at },
            }));

            if (newMsg.to_user_id === mentorId && !newMsg.is_read) {
              setUnreadCounts((prev) => ({
                ...prev,
                [studentId]: (prev[studentId] || 0) + 1,
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mentorId]);

  // LOADING STATE
  if (isLoading) {
    return (
      <Card className="w-full rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Loading students...
          </span>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // ERROR STATE
  if (errorMsg) {
    return (
      <Card className="w-full rounded-[1.5rem] shadow-sm border border-rose-100 bg-rose-50/50 overflow-hidden p-5 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
          !
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-900">{errorMsg}</h3>
        </div>
        <Button
          onClick={fetchAssignedStudents}
          variant="outline"
          className="h-8 px-3 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100/80 px-5 pt-5 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
          Chat with Students
        </CardTitle>
        <Badge
          variant="secondary"
          className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-100"
        >
          {students.length} Student{students.length !== 1 ? "s" : ""}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {students.length === 0 ? (
          <div className="p-8 text-center space-y-2 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <User className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No Students Assigned</p>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[260px]">
              Students assigned to you will appear here for 1-on-1 real-time chat.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {students.map((student) => {
              const isOnline = onlineUserIds.has(student.id);
              const lastMsg = lastMessages[student.id];
              const unread = unreadCounts[student.id] || 0;

              return (
                <div
                  key={student.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/50 p-2.5 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar with Online/Offline indicator */}
                    <div className="relative shrink-0">
                      {student.avatar_url ? (
                        <img
                          src={student.avatar_url}
                          alt={student.name || "Student"}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                          {(student.name || "S").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          isOnline ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                    </div>

                    {/* Student Info & Last Message Snippet */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {student.name}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                            isOnline
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isOnline
                            ? "● Online"
                            : formatLastActive((student?.preferences as any)?.last_seen)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate font-medium">
                        {lastMsg ? (
                          <span>"{lastMsg.body}"</span>
                        ) : (
                          <span className="text-slate-400 italic">No messages yet</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Unread Count Badge */}
                  <div className="flex items-center gap-3 justify-end shrink-0">
                    {unread > 0 && (
                      <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                        {unread} unread
                      </span>
                    )}

                    <Button
                      onClick={() => onOpenChat(student.id)}
                      className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
