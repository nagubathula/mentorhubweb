"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, ShieldCheck, Circle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const supabase = createClient();

export interface MentorProfile {
  id: string;
  name: string | null;
  email: string | null;
  role?: string | null;
  expertise?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  preferences?: any;
}

interface YourMentorCardProps {
  currentUserId?: string | null;
  mentor?: MentorProfile | null;
  isLoading?: boolean;
  onOpenChat: (mentorId?: string) => void;
  unreadCount?: number;
}

export function YourMentorCard({
  currentUserId,
  mentor: mentorProp,
  isLoading: isLoadingProp = false,
  onOpenChat,
  unreadCount = 0,
}: YourMentorCardProps) {
  const [mentor, setMentor] = useState<MentorProfile | null>(mentorProp || null);
  const [isLoading, setIsLoading] = useState<boolean>(isLoadingProp);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(unreadCount);

  // Sync prop changes
  useEffect(() => {
    if (mentorProp !== undefined) {
      setMentor(mentorProp);
    }
  }, [mentorProp]);

  // If mentor is not passed as prop, fetch from 'mapping' table for currentUserId
  useEffect(() => {
    if (mentorProp !== undefined || !currentUserId) return;

    let isMounted = true;
    const fetchAssignedMentor = async () => {
      setIsLoading(true);
      try {
        const { data: mapping, error } = await supabase
          .from("mapping")
          .select("mentor:profiles!mapping_mentor_id_fkey(*)")
          .eq("student_id", currentUserId)
          .maybeSingle();

        if (!error && mapping && (mapping as any).mentor) {
          if (isMounted) {
            setMentor((mapping as any).mentor as MentorProfile);
          }
        } else {
          if (isMounted) {
            setMentor(null);
          }
        }
      } catch (err) {
        console.error("Error fetching assigned mentor:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAssignedMentor();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, mentorProp]);

  // Track unread messages count if mentor exists
  useEffect(() => {
    if (!currentUserId || !mentor?.id) return;

    let isMounted = true;
    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("from_user_id", mentor.id)
          .eq("to_user_id", currentUserId)
          .eq("is_read", false);

        if (!error && count !== null && isMounted) {
          setUnreadMsgCount(count);
        }
      } catch (err) {
        console.error("Error checking unread messages:", err);
      }
    };

    fetchUnreadCount();

    // Listen for realtime incoming messages to update unread count
    const channel = supabase.channel(`unread-mentor-msg-${currentUserId}`);
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `to_user_id=eq.${currentUserId}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.from_user_id === mentor.id) {
            if (isMounted) setUnreadMsgCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [currentUserId, mentor?.id]);

  // Track online/offline status via Supabase Realtime Presence
  useEffect(() => {
    if (!mentor?.id) {
      setIsOnline(false);
      return;
    }

    const presenceChannel = supabase.channel("online-presence-chat");

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const online = Object.keys(state).includes(mentor.id);
        setIsOnline(online);
      })
      .on("presence", { event: "join" }, ({ key }: { key: string }) => {
        if (key === mentor.id) setIsOnline(true);
      })
      .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
        if (key === mentor.id) setIsOnline(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [mentor?.id]);

  if (isLoading) {
    return (
      <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden p-5 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-28 mb-4" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      </Card>
    );
  }

  // NO MENTOR ASSIGNED STATE
  if (!mentor) {
    return (
      <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">No Mentor Assigned</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5">
              Your mentor will appear here once one is assigned.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // MENTOR ASSIGNED STATE
  const designation =
    mentor.expertise ||
    mentor.bio ||
    (mentor.preferences as any)?.designation ||
    "Senior Mentor";

  return (
    <Card className="w-full relative z-10 rounded-[1.5rem] shadow-sm border border-slate-100 bg-white overflow-hidden hover:border-slate-200 transition-all">
      <CardContent className="p-5 flex flex-col space-y-4">
        {/* Card Header Title */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Your Mentor
          </span>
          {unreadMsgCount > 0 && (
            <Badge className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-bounce">
              {unreadMsgCount} New Message{unreadMsgCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Mentor Info Row */}
        <div className="flex items-center gap-3.5">
          {/* Avatar with Online/Offline Indicator */}
          <div className="relative shrink-0">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.name || "Mentor"}
                className="w-13 h-13 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
              />
            ) : (
              <div className="w-13 h-13 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                {(mentor.name || "M").charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                isOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
              title={isOnline ? "Online" : "Offline"}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-tight truncate flex items-center gap-1.5">
              {mentor.name || "Assigned Mentor"}
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            </h3>
            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
              {designation}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              <span
                className={`text-[11px] font-semibold ${
                  isOnline ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onOpenChat(mentor.id)}
          className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all active:scale-98 flex items-center justify-center gap-2 shadow-md shadow-slate-200 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          Chat with Mentor
        </Button>
      </CardContent>
    </Card>
  );
}
