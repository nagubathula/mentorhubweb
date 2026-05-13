"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Heart, Users, Sparkles, MessageCircle, DollarSign, Award, Send, Gift, ShieldAlert, ArrowRight, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface GratitudeWallProps {
  onBack: () => void;
  coins: number;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "express" | "action" | "gift" | "daily";
  completed: boolean;
  color: string;
  bgColor: string;
  icon: string;
}

interface Donation {
  id: string;
  name: string;
  message: string;
  anonymous: boolean;
  amount: number;
}

// 1. Gratitude Checklist items matching Ct in unminified_index.js
const initialChecklist: ChecklistItem[] = [
  {
    id: "g1",
    title: "Write a Thank-You Note",
    description: "Write a heartfelt handwritten or digital thank-you note telling your mentor how they've helped you grow.",
    category: "express",
    completed: false,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    icon: "✉️"
  },
  {
    id: "g2",
    title: "Share Their Impact Publicly",
    description: "Post on social media or in your community about how your mentor has influenced your journey. Tag them!",
    category: "express",
    completed: false,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    icon: "🌐"
  },
  {
    id: "g3",
    title: "Give a Small Thoughtful Gift",
    description: "A book they'd love, their favorite coffee, or something that shows you pay attention to what they enjoy.",
    category: "gift",
    completed: false,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    icon: "🎁"
  },
  {
    id: "g4",
    title: "Apply Their Advice & Show Results",
    description: "The best gratitude is growth. Apply what they taught you and share your progress — nothing makes a mentor prouder.",
    category: "action",
    completed: true,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    icon: "📈"
  },
  {
    id: "g5",
    title: "Be on Time & Prepared",
    description: "Respect your mentor's time by always being punctual and coming prepared with questions and updates.",
    category: "daily",
    completed: true,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    icon: "⏰"
  },
  {
    id: "g6",
    title: "Offer to Help Them Back",
    description: "Ask if there's anything you can help with — research, a project, or even teaching what you've learned to others.",
    category: "action",
    completed: false,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    icon: "🤝"
  },
  {
    id: "g7",
    title: "Send a Coffee or Treat",
    description: "Surprise your mentor with their favorite coffee, tea, or a treat. A small gesture goes a long way!",
    category: "gift",
    completed: false,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    icon: "☕"
  },
  {
    id: "g8",
    title: "Give a Genuine Compliment",
    description: "Tell your mentor specifically what you admire about them — their patience, knowledge, or how they explain things.",
    category: "express",
    completed: false,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    icon: "💬"
  },
  {
    id: "g9",
    title: "Recommend Them to Others",
    description: "If someone asks for a mentor or guidance, recommend yours. This helps expand their impact and shows deep trust.",
    category: "action",
    completed: false,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    icon: "📢"
  },
  {
    id: "g10",
    title: "Celebrate Their Wins",
    description: "Pay attention to your mentor's achievements. Congratulate them, celebrate milestones, and cheer them on.",
    category: "daily",
    completed: false,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    icon: "🎉"
  },
  {
    id: "g11",
    title: "Say 'Thank You' Regularly",
    description: "Don't save it for special occasions. A simple, sincere 'thank you' after every session means more than you think.",
    category: "daily",
    completed: true,
    color: "text-rose-400",
    bgColor: "bg-rose-50",
    icon: "💖"
  },
  {
    id: "g12",
    title: "Pay It Forward",
    description: "Mentor someone else. The greatest gratitude you can show is by passing on the knowledge and kindness you received.",
    category: "action",
    completed: false,
    color: "text-violet-500",
    bgColor: "bg-violet-50",
    icon: "🌟"
  }
];

// 2. Initial Community Contributions matching Es in unminified_index.js
const initialDonations: Donation[] = [
  { id: "cm1", name: "Priya S.", message: "Thank you to my mentor for helping me understand SQL. This platform changed my learning journey!", anonymous: false, amount: 200 },
  { id: "cm2", name: "Anonymous", message: "The mentorship I received here was invaluable. Happy to support!", anonymous: true, amount: 100 },
  { id: "cm3", name: "Arjun K.", message: "My mentor helped me crack my first internship. Forever grateful! 🙏", anonymous: false, amount: 500 },
  { id: "cm4", name: "Anonymous", message: "Great initiative. Keep helping students learn and grow.", anonymous: true, amount: 50 },
  { id: "cm5", name: "Sneha R.", message: "The community activities are amazing. Love being part of this!", anonymous: false, amount: 100 }
];

const supabase = createClient();

export function GratitudeWall({ onBack, coins }: GratitudeWallProps) {
  const [activeTab, setActiveTab] = useState<"support" | "wall">("support");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "express" | "action" | "gift" | "daily">("all");

  // Community support form
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [supportName, setSupportName] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [supportAmount, setSupportAmount] = useState<number>(100);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationsAndUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }

      const { data, error } = await supabase
        .from("gratitude_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        const formatted: Donation[] = data.map(row => ({
          id: row.id,
          name: row.display_name || (row.is_anonymous ? "Anonymous" : "Kind Student"),
          message: row.message_content || "",
          anonymous: row.is_anonymous || false,
          amount: row.amount || 0
        }));
        setDonations(formatted);
      }
    };

    fetchDonationsAndUser();
  }, []);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSupportSubmit = async () => {
    if (supportAmount <= 0 || !supportMsg.trim()) return;

    const displayName = isAnonymous ? "Anonymous" : supportName.trim() || "Kind Student";

    const { error } = await supabase.from("gratitude_messages").insert({
      display_name: displayName,
      message_content: supportMsg.trim(),
      amount: supportAmount,
      is_anonymous: isAnonymous,
      sender_id: userId
    });

    if (error) {
      console.error("Error creating gratitude message:", error);
      alert("Error submitting support: " + error.message);
      return;
    }

    const addedDonation: Donation = {
      id: "cm_" + Date.now(),
      name: displayName,
      message: supportMsg.trim(),
      anonymous: isAnonymous,
      amount: supportAmount
    };

    setDonations(prev => [addedDonation, ...prev]);
    setSupportSuccess(true);
    setTimeout(() => {
      setSupportSuccess(false);
      setIsFormOpen(false);
      setSupportName("");
      setSupportMsg("");
      setSupportAmount(100);
      setIsAnonymous(false);
    }, 3000);
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const filteredChecklist = selectedFilter === "all"
    ? checklist
    : checklist.filter(item => item.category === selectedFilter);

  return (
    <motion.div
      className="absolute inset-0 z-40 bg-gray-50 flex flex-col h-full"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
    >
      {/* Header */}
      <div className="bg-white px-5 pt-3 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div>
              <p className="text-gray-900 text-sm font-semibold">Gratitude Wall</p>
              <p className="text-gray-400 text-[11px]">Appreciate guidance. Build community.</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 rounded-full px-2.5 py-1 border border-amber-100">
            <Users className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-amber-600 text-xs font-semibold">{donations.length + 50} members</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: "support" as const, label: "Community Support", icon: Heart },
            { key: "wall" as const, label: "Gratitude Wall", icon: Award }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 rounded-md text-xs flex items-center justify-center gap-1.5 transition-all font-medium ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${activeTab === tab.key ? "text-rose-500 fill-rose-50" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Support Banner Info Card */}
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Keep Learning Free & Open</p>
                  </div>
                  <h3 className="text-sm font-semibold leading-relaxed">Sponsor Learning & Mentorship</h3>
                  <p className="text-white/85 text-[11px] leading-relaxed">
                    MentorHub is a student-first open platform. Voluntary support is fully re-invested into server maintenance, community workspace allowances, and resources for underprivileged coders.
                  </p>
                </div>
              </div>

              {/* Form trigger / Contribution Overlay */}
              <AnimatePresence>
                {isFormOpen ? (
                  <motion.div
                    className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm space-y-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {supportSuccess ? (
                      <div className="text-center py-6 space-y-3">
                        <span className="text-4xl animate-bounce">💖</span>
                        <p className="text-gray-900 text-xs font-bold">Contribution Pledged!</p>
                        <p className="text-gray-400 text-[10px] max-w-[200px] mx-auto leading-relaxed">
                          Thank you so much! Your pledge helps keep this platform accessible for thousands of novice developers.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                          <p className="text-gray-800 text-xs font-bold">Support Pledge Form</p>
                          <button
                            onClick={() => setIsFormOpen(false)}
                            className="text-gray-300 hover:text-gray-500 text-xs font-bold"
                          >
                            Close
                          </button>
                        </div>

                        {/* Name input */}
                        <div className="space-y-1">
                          <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Your Name (or leave blank)</p>
                          <input
                            type="text"
                            placeholder="e.g. Priya S."
                            value={supportName}
                            onChange={e => setSupportName(e.target.value)}
                            disabled={isAnonymous}
                            className="w-full text-xs text-gray-900 placeholder-gray-300 bg-gray-50 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-rose-200 border border-gray-100 disabled:opacity-50"
                          />
                        </div>

                        {/* Message input */}
                        <div className="space-y-1">
                          <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Support Message</p>
                          <textarea
                            placeholder="Write a message to our community, mentors, or student body..."
                            value={supportMsg}
                            onChange={e => setSupportMsg(e.target.value)}
                            rows={3}
                            className="w-full text-xs text-gray-700 placeholder-gray-300 bg-gray-50 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-rose-200 resize-none border border-gray-100"
                          />
                        </div>

                        {/* Custom contribution chip buttons */}
                        <div className="space-y-1.5">
                          <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Contribution Amount</p>
                          <div className="grid grid-cols-4 gap-2">
                            {[50, 100, 200, 500].map(amt => (
                              <button
                                key={amt}
                                onClick={() => setSupportAmount(amt)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                  supportAmount === amt
                                    ? "bg-rose-500 text-white border-transparent"
                                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
                                }`}
                              >
                                ₹{amt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Anonymous Toggle checkboxes */}
                        <label className="flex items-center gap-2 text-xs text-gray-500 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={e => {
                              setIsAnonymous(e.target.checked);
                              if (e.target.checked) setSupportName("Anonymous");
                              else setSupportName("");
                            }}
                            className="rounded border-gray-200 text-rose-500 focus:ring-rose-200"
                          />
                          <span>Pledge as Anonymous</span>
                        </label>

                        <button
                          onClick={handleSupportSubmit}
                          disabled={!supportMsg.trim()}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                            supportMsg.trim()
                              ? "bg-rose-500 text-white shadow-rose-500/10 hover:bg-rose-600"
                              : "bg-gray-100 text-gray-300 pointer-events-none"
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Contribute ₹{supportAmount}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-3 bg-white border border-rose-100 rounded-2xl flex items-center justify-center gap-2 text-rose-600 text-xs font-bold shadow-sm hover:bg-rose-50/50 active:scale-95 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-current text-rose-500" />
                    Support the Platform
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </AnimatePresence>

              {/* Scrollable feed list of pledges */}
              <div className="space-y-2.5">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Supporters Board</p>
                {donations.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-3 relative overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    {/* Tiny side ribbon highlighting contribution size */}
                    {item.amount >= 500 && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 text-white flex items-center justify-center font-bold text-[8px] rotate-45 translate-x-3.5 -translate-y-3.5" title="Sponsor Level">
                        ⭐
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 font-bold text-xs">
                      {item.anonymous ? "👤" : item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 text-xs font-bold">{item.anonymous ? "Anonymous Supporter" : item.name}</p>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          ₹{item.amount}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed font-medium">"{item.message}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "wall" && (
            <motion.div
              key="wall"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Gratitude progress card */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-500 text-sm">
                      🌟
                    </div>
                    <div>
                      <p className="text-gray-900 text-xs font-bold">Gratitude Progress</p>
                      <p className="text-indigo-600 text-[10px] font-semibold">Thanking your mentor matters</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 text-lg font-bold leading-none">{progressPercent}%</p>
                    <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">Complete</p>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="space-y-1">
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-indigo-100/40">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ type: "spring", damping: 20 }}
                    />
                  </div>
                </div>

                <p className="text-gray-500 text-[11px] leading-relaxed">
                  You have completed <strong className="text-indigo-600">{completedCount}</strong> of <strong className="text-gray-600">{checklist.length}</strong> gratitude ideas. Checking off custom actions helps appreciate your mentor's guidance.
                </p>
              </div>

              {/* Categories selector horizontal scrollable carousel */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { key: "all" as const, label: "All" },
                  { key: "express" as const, label: "Express" },
                  { key: "action" as const, label: "Actions" },
                  { key: "gift" as const, label: "Gifts" },
                  { key: "daily" as const, label: "Daily" }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedFilter(cat.key)}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                      selectedFilter === cat.key
                        ? "bg-violet-600 text-white border-transparent shadow-sm"
                        : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Filtered checklist nodes card deck */}
              <div className="space-y-2.5">
                {filteredChecklist.map((item, idx) => {
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-3.5 cursor-pointer select-none transition-all hover:border-gray-200 active:scale-[0.99] relative overflow-hidden`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      {/* Left Side Icon */}
                      <div className={`w-8 h-8 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center shrink-0 text-lg font-bold`}>
                        {item.icon}
                      </div>

                      {/* Content middle */}
                      <div className="flex-1 min-w-0 space-y-1 pr-4">
                        <p className={`text-xs font-bold leading-none ${item.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                          {item.title}
                        </p>
                        <p className={`text-[10px] leading-relaxed ${item.completed ? "text-gray-300 line-through" : "text-gray-500"}`}>
                          {item.description}
                        </p>
                      </div>

                      {/* Checkbox state right */}
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        item.completed
                          ? "bg-emerald-500 border-transparent text-white"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
