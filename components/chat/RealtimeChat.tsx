"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Send, ArrowLeft, Search, User, Circle, CheckCheck, Clock, 
  MessageSquare, ShieldCheck, Video, Phone, RefreshCw, AlertCircle,
  Sparkles, Check
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const supabase = createClient();

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "MENTOR";
  avatar_url?: string | null;
  expertise?: string | null;
  last_seen?: string | null;
}

export interface ChatMessage {
  id: string;
  from_user_id: string;
  to_user_id: string;
  body: string;
  sender_name?: string | null;
  is_read?: boolean | null;
  created_at: string;
}

interface RealtimeChatProps {
  currentUser: ChatUser;
  onBack: () => void;
  initialContactId?: string | null;
}

export function RealtimeChat({ currentUser, onBack, initialContactId }: RealtimeChatProps) {
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [activeContact, setActiveContact] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;
  const [showMobileChat, setShowMobileChat] = useState<boolean>(!!initialContactId);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  // Toast notice helper
  const showError = (msg: string) => {
    setErrorNotice(msg);
    setTimeout(() => setErrorNotice(null), 4000);
  };

  // 1. Setup Supabase Realtime Presence channel for tracking Online/Offline status
  useEffect(() => {
    if (!currentUser?.id) return;

    const presenceChannel = supabase.channel("online-presence-chat", {
      config: { presence: { key: currentUser.id } }
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const onlineIds = new Set<string>();
        Object.keys(state).forEach((key) => {
          onlineIds.add(key);
        });
        setOnlineUserIds(onlineIds);
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
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user_id: currentUser.id,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [currentUser?.id]);

  // 2. Fetch contacts mapped to current user
  const fetchContacts = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoadingContacts(true);

    try {
      const isStudent = currentUser.role === "STUDENT";
      let fetchedContacts: ChatUser[] = [];

      if (isStudent) {
        // Fetch mapped mentors for this student
        const { data: mappings, error } = await supabase
          .from("mapping")
          .select("mentor:profiles!mapping_mentor_id_fkey(*)")
          .eq("student_id", currentUser.id);

        if (!error && mappings && mappings.length > 0) {
          fetchedContacts = mappings
            .map((m: any) => m.mentor)
            .filter(Boolean)
            .map((p: any) => ({
              id: p.id,
              name: p.name || p.email?.split("@")[0] || "Mentor",
              email: p.email || "",
              role: "MENTOR" as const,
              avatar_url: p.avatar_url || (p.preferences as any)?.avatar_url || null,
              expertise: p.expertise || "Senior Mentor"
            }));
        }

        // Guest / Demo account fallback only if user is demo guest
        if (fetchedContacts.length === 0 && (currentUser.id === "guest-student-id" || currentUser.id?.includes("student-id"))) {
          fetchedContacts = [
            {
              id: "guest-mentor-id",
              name: "Rahul Kumar",
              email: "rahul.k@kindmentor.com",
              role: "MENTOR",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulKumar",
              expertise: "Senior UI/UX & Tech Mentor"
            }
          ];
        }
      } else {
        // Mentor side: Fetch mapped students for this mentor
        const { data: mappings, error } = await supabase
          .from("mapping")
          .select("student:profiles!mapping_student_id_fkey(*)")
          .eq("mentor_id", currentUser.id);

        if (!error && mappings && mappings.length > 0) {
          fetchedContacts = mappings
            .map((m: any) => m.student)
            .filter(Boolean)
            .map((p: any) => ({
              id: p.id,
              name: p.name || p.email?.split("@")[0] || "Student",
              email: p.email || "",
              role: "STUDENT" as const,
              avatar_url: p.avatar_url || (p.preferences as any)?.avatar_url || null,
              expertise: p.expertise || "Mentee"
            }));
        }

        // Guest / Demo account fallback only if user is demo guest
        if (fetchedContacts.length === 0 && (currentUser.id === "guest-mentor-id" || currentUser.id?.includes("mentor-id"))) {
          fetchedContacts = [
            {
              id: "mock-student-1",
              name: "Karthik Talluri",
              email: "karthik.talluri@example.com",
              role: "STUDENT",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik",
              expertise: "Full-Stack Web Dev Student"
            },
            {
              id: "mock-student-2",
              name: "Ananya Iyer",
              email: "ananya.iyer@example.com",
              role: "STUDENT",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
              expertise: "UI/UX Design Student"
            }
          ];
        }
      }

      setContacts(fetchedContacts);

      // Select active contact
      if (initialContactId) {
        const found = fetchedContacts.find((c) => c.id === initialContactId);
        if (found) {
          setActiveContact(found);
          setShowMobileChat(true);
        } else if (fetchedContacts.length > 0) {
          setActiveContact(fetchedContacts[0]);
        }
      } else if (fetchedContacts.length > 0 && !activeContact) {
        setActiveContact(fetchedContacts[0]);
      }
    } catch (err: any) {
      console.error("Failed to load chat contacts:", err);
      showError("Could not load contacts.");
    } finally {
      setIsLoadingContacts(false);
    }
  }, [currentUser?.id, currentUser?.role, initialContactId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // 3. Fetch unread counts for all contacts
  const fetchUnreadCounts = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const { data: unreadMsgs, error } = await supabase
        .from("messages")
        .select("from_user_id")
        .eq("to_user_id", currentUser.id)
        .eq("is_read", false);

      if (!error && unreadMsgs) {
        const counts: Record<string, number> = {};
        unreadMsgs.forEach((m: any) => {
          if (m.from_user_id) {
            counts[m.from_user_id] = (counts[m.from_user_id] || 0) + 1;
          }
        });
        setUnreadCounts(counts);
      }
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchUnreadCounts();
  }, [fetchUnreadCounts]);

  // 4. Fetch messages when activeContact changes
  const fetchMessages = useCallback(async () => {
    if (!currentUser?.id || !activeContact?.id) {
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);

    try {
      // Query messages between currentUser and activeContact
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(from_user_id.eq.${currentUser.id},to_user_id.eq.${activeContact.id}),and(from_user_id.eq.${activeContact.id},to_user_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Messages query error:", error);
        // Fallback mock messages if error or mock student
        setMessages([]);
      } else {
        setMessages(data || []);
      }

      // Mark incoming messages as read
      await supabase
        .from("messages")
        .update({ is_read: true } as any)
        .eq("from_user_id", activeContact.id)
        .eq("to_user_id", currentUser.id)
        .eq("is_read", false);

      // Decrement unread count for active contact
      setUnreadCounts((prev) => ({ ...prev, [activeContact.id]: 0 }));
    } catch (err: any) {
      console.error("Error loading conversation:", err);
    } finally {
      setIsLoadingMessages(false);
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [currentUser?.id, activeContact?.id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 5. Supabase Realtime Subscription for incoming & outgoing messages
  useEffect(() => {
    if (!currentUser?.id) return;

    const channel = supabase.channel(`user-messages-realtime-${currentUser.id}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages"
        },
        (payload: any) => {
          const newMsg: ChatMessage = payload.new;

          // Check if message belongs to active conversation
          if (
            activeContact &&
            ((newMsg.from_user_id === activeContact.id && newMsg.to_user_id === currentUser.id) ||
              (newMsg.from_user_id === currentUser.id && newMsg.to_user_id === activeContact.id))
          ) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });

            // If received while active contact open, mark as read immediately
            if (newMsg.from_user_id === activeContact.id) {
              supabase
                .from("messages")
                .update({ is_read: true } as any)
                .eq("id", newMsg.id);
            }
          } else if (newMsg.to_user_id === currentUser.id) {
            // Update unread count for other contacts
            setUnreadCounts((prev) => ({
              ...prev,
              [newMsg.from_user_id]: (prev[newMsg.from_user_id] || 0) + 1
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, activeContact?.id]);

  // 6. Handle Send Message
  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || isSending || !activeContact || !currentUser?.id) return;

    setIsSending(true);

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          from_user_id: currentUser.id,
          to_user_id: activeContact.id,
          body: text,
          sender_name: currentUser.name || "User",
          is_read: false
        } as any)
        .select("*")
        .single();

      if (error || !data) {
        console.error("Database message insert error:", error);
        showError("Message failed to send. Please try again.");
      } else {
        const confirmedMsg = data as ChatMessage;
        setMessages((prev) => {
          if (prev.some((m) => m.id === confirmedMsg.id)) return prev;
          return [...prev, confirmedMsg];
        });
        setMessageInput("");
        setTimeout(() => scrollToBottom(true), 50);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      showError("Message failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.expertise && c.expertise.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format message timestamps
  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-h-[850px] bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl animate-in fade-in duration-300">
      
      {/* Toast Error Alert */}
      {errorNotice && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-rose-700 text-xs font-semibold flex items-center gap-2 justify-between z-50">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            {errorNotice}
          </span>
          <button onClick={() => setErrorNotice(null)} className="text-rose-400 hover:text-rose-600 font-bold text-sm">×</button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: CONTACTS LIST */}
        {/* ========================================================================= */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ${
            showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Contacts Header */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </Button>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">Messages</h2>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentUser.role === "STUDENT" ? "Your Mentors" : "Your Students"}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-100">
                {contacts.length} {currentUser.role === "STUDENT" ? "Mentor" : "Student"}{contacts.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentUser.role === "STUDENT" ? "Search mentors..." : "Search students..."}
                className="pl-9 pr-4 h-9 text-xs rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Contacts List Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 hidden-scrollbar">
            {isLoadingContacts ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                      <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center space-y-3 flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-700">No contacts found</p>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">
                  {searchQuery ? "Try matching a different name or email." : "No connected users available yet."}
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isActive = activeContact?.id === contact.id;
                const isOnline = onlineUserIds.has(contact.id);
                const unread = unreadCounts[contact.id] || 0;

                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setActiveContact(contact);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-3.5 flex items-center gap-3 transition-all text-left cursor-pointer relative ${
                      isActive
                        ? "bg-indigo-50/60 border-l-4 border-indigo-600 font-semibold"
                        : "hover:bg-slate-50/80 bg-white"
                    }`}
                  >
                    {/* Avatar with Online Badge */}
                    <div className="relative shrink-0">
                      {contact.avatar_url ? (
                        <img
                          src={contact.avatar_url}
                          alt={contact.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          isOnline ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs truncate ${isActive ? "font-bold text-indigo-950" : "font-semibold text-slate-800"}`}>
                          {contact.name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {contact.expertise || contact.email}
                      </p>
                    </div>

                    {/* Unread Counter Badge */}
                    {unread > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 animate-in zoom-in duration-200">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: ACTIVE CONVERSATION */}
        {/* ========================================================================= */}
        <div
          className={`flex-1 flex flex-col bg-white overflow-hidden transition-all duration-300 ${
            showMobileChat ? "flex" : "hidden md:flex"
          }`}
        >
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3.5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden w-8 h-8 rounded-full bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>

                  {/* Active Contact Avatar */}
                  <div className="relative shrink-0">
                    {activeContact.avatar_url ? (
                      <img
                        src={activeContact.avatar_url}
                        alt={activeContact.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {activeContact.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        onlineUserIds.has(activeContact.id) ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                      {activeContact.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          onlineUserIds.has(activeContact.id) ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {onlineUserIds.has(activeContact.id) ? (
                        <span className="text-emerald-600 font-semibold">Online</span>
                      ) : (
                        <span className="text-slate-400">Offline (Last seen recently)</span>
                      )}
                      <span className="text-slate-300">•</span>
                      <span>{activeContact.expertise || activeContact.role}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchMessages}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Refresh conversation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 hidden-scrollbar">
                {isLoadingMessages ? (
                  <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-14 h-14 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No messages yet</p>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                      Send a message to start real-time mentoring conversation with {activeContact.name}.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.from_user_id === currentUser.id;
                    const isTemp = msg.id.startsWith("temp-");

                    return (
                      <div
                        key={msg.id || index}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1 animate-in fade-in slide-in-from-bottom-1 duration-200`}
                      >
                        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                          {!isMe && (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mb-1">
                              {activeContact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 rounded-2xl text-xs sm:text-[13.5px] font-medium leading-relaxed break-words shadow-2xs ${
                              isMe
                                ? "bg-slate-900 text-white rounded-br-xs"
                                : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                            }`}
                          >
                            {msg.body}
                          </div>
                        </div>

                        <div className={`flex items-center gap-1 text-[10px] font-medium text-slate-400 px-1 ${isMe ? "pr-1" : "pl-8"}`}>
                          <span>{formatTime(msg.created_at)}</span>
                          {isMe && (
                            <span className="text-slate-400">
                              {isTemp ? (
                                <Clock className="w-3 h-3 text-slate-300 inline animate-spin" />
                              ) : (
                                <CheckCheck className={`w-3.5 h-3.5 inline ${msg.is_read ? "text-indigo-500" : "text-slate-400"}`} />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="p-3.5 md:p-4 border-t border-slate-200/80 bg-white shrink-0">
                <div className="flex items-end gap-2.5">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message ${activeContact.name}...`}
                    disabled={isSending}
                    rows={1}
                    className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none min-h-[46px] max-h-28 shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />

                  <Button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={isSending || !messageInput.trim()}
                    className={`h-[46px] w-[46px] rounded-2xl shrink-0 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                      messageInput.trim() && !isSending
                        ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4.5 h-4.5" strokeWidth={2.2} />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-2 text-center hidden sm:block">
                  Press <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px]">Shift + Enter</kbd> for new line
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 bg-slate-50/40">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Select a conversation</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
                Choose a contact from the left list to start messaging in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
