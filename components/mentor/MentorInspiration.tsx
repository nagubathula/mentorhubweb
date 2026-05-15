import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sun, Moon, History, Send, Sparkles, Lightbulb, Check, Award, Trophy, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MentorInspirationProps {
  mentorName: string;
  onClose: () => void;
}

// --- Predefined Suggestions & Mock Data ---
const SUGGESTED_THOUGHTS = [
  "Consistency beats intensity. Practice a little every day.",
  "Every expert was once a beginner. Keep going!",
  "Progress matters more than perfection.",
  "Focus on solving problems, not just learning tools.",
  "Spend 10 minutes reviewing yesterday's concepts before learning something new.",
  "Small consistent steps create extraordinary careers.",
  "The best way to learn is to teach someone else.",
  "Debugging is detective work — enjoy the mystery!"
];

interface ReflectionPrompt {
  category: string;
  icon: string;
  prompt: string;
}

const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  { category: "Learning", icon: "📚", prompt: "What is one concept you understood better today?" },
  { category: "Challenge", icon: "🧗", prompt: "What was the most difficult thing you faced today?" },
  { category: "Improvement", icon: "🎯", prompt: "What would you do differently tomorrow?" },
  { category: "Gratitude", icon: "🙏", prompt: "Who or what helped you learn something new today?" },
  { category: "Confidence", icon: "💪", prompt: "What small achievement made you proud today?" }
];

const STATIC_HISTORY = [
  { date: "May 11", type: "thought", text: "Debugging is detective work — enjoy the mystery!", responses: 8, mood: "🙂" },
  { date: "May 10", type: "reflection", text: "What is one concept you understood better today?", responses: 11, mood: "😊" },
  { date: "May 09", type: "thought", text: "The best way to learn is to teach someone else.", responses: 6, mood: "🤩" },
  { date: "May 08", type: "reflection", text: "What was the most difficult thing you faced today?", responses: 9, mood: "🤔" },
  { date: "May 07", type: "thought", text: "Every expert was once a beginner.", responses: 14, mood: "💪" }
];

const STORAGE_KEY = "mentorhub_inspiration_messages";

export function MentorInspiration({ mentorName, onClose }: MentorInspirationProps) {
  const [activeTab, setActiveTab] = useState<"morning" | "evening" | "history">("morning");
  const [morningText, setMorningText] = useState("");
  const [customReflectionText, setCustomReflectionText] = useState("");
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number | null>(0);
  const [isSending, setIsSending] = useState<"thought" | "reflection" | null>(null);
  const [localHistory, setLocalHistory] = useState<any[]>(STATIC_HISTORY);

  // Sync with local storage
  const handleSendMessage = (type: "thought" | "reflection") => {
    setIsSending(type);

    const messageContent = type === "thought" 
      ? morningText 
      : (selectedPromptIdx !== null ? REFLECTION_PROMPTS[selectedPromptIdx].prompt : customReflectionText);

    if (!messageContent.trim()) return;

    setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const list = stored ? JSON.parse(stored) : [];

        const newItem = {
          id: `insp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: type,
          emoji: type === "thought" ? "💡" : (selectedPromptIdx !== null ? REFLECTION_PROMPTS[selectedPromptIdx].icon : "❓"),
          category: type === "thought" ? "motivation" : (selectedPromptIdx !== null ? REFLECTION_PROMPTS[selectedPromptIdx].category.toLowerCase() : "custom"),
          message: messageContent,
          author: mentorName || "Mentor",
          timestamp: Date.now(),
          dismissed: false
        };

        list.push(newItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

        // Add to local visual history
        setLocalHistory(prev => [
          {
            date: "Today",
            type: type,
            text: messageContent,
            responses: 0,
            mood: "—"
          },
          ...prev
        ]);

        // Reset
        if (type === "thought") {
          setMorningText("");
        } else {
          setCustomReflectionText("");
          setSelectedPromptIdx(0);
        }
      } catch (err) {
        console.error("Storage error:", err);
      } finally {
        setIsSending(null);
        alert(`${type === "thought" ? "Morning thought" : "Reflection prompt"} successfully broadcasted to students!`);
      }
    }, 1500);
  };

  const loadSuggestion = () => {
    const randomIdx = Math.floor(Math.random() * SUGGESTED_THOUGHTS.length);
    setMorningText(SUGGESTED_THOUGHTS[randomIdx]);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col font-sans overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
    >
      {/* Header Panel */}
      <div className="bg-white px-5 pt-3 pb-3 border-b border-slate-100 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
          </Button>
          <div className="flex-1">
            <p className="text-slate-900 text-[15px] font-bold">Daily Inspiration Builder</p>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5">Guide and inspire your students every single day</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 shadow-3xs shrink-0">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-700 text-[10.5px] font-bold">5 Day Streak</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab("morning")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "morning" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Morning Thought
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "evening" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Moon className="w-3.5 h-3.5" /> Evening Reflection
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "history" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" /> Metrics Log
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "morning" && (
            <motion.div
              key="morning_thought_tab"
              className="px-5 pt-4 pb-6 space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Card Greeting */}
              <div className="flex items-center gap-3.5 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md shadow-orange-200">
                  <Sun className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-800 text-[15px] font-bold">Good Morning, {mentorName}! ☀️</h3>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">Share a motivational thought that inspires your students today.</p>
                </div>
              </div>

              {/* Compose Workspace */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Your Morning Thought</p>
                <textarea
                  value={morningText}
                  onChange={(e) => setMorningText(e.target.value)}
                  placeholder="Share a motivational thought, learning tip, or personal industry story..."
                  className="w-full h-24 resize-none bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-violet-300 transition-all font-medium"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSendMessage("thought")}
                    disabled={!morningText.trim() || isSending === "thought"}
                    className="flex-1 h-11 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center gap-2 transition-all"
                  >
                    {isSending === "thought" ? (
                      <Check className="w-4 h-4 animate-bounce" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Broadcast to Students
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={loadSuggestion}
                    className="h-11 rounded-xl text-xs font-bold border-violet-200 text-violet-600 hover:bg-violet-50 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Suggest
                  </Button>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Quick Suggestions</p>
                <div className="space-y-2">
                  {SUGGESTED_THOUGHTS.slice(0, 4).map((thought, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMorningText(thought)}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-violet-50/70 border border-slate-100 transition-colors flex items-start gap-2.5"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-xs italic font-medium leading-relaxed">"{thought}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Screen mock */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Student Dashboard Preview</p>
                <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl border border-violet-100 p-4.5 relative overflow-hidden shadow-2xs">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl"></div>
                  <div className="flex items-start gap-3.5 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0 text-lg shadow-sm">
                      💡
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-violet-500 text-[10px] font-black uppercase tracking-wider mb-1.5">Today's Inspiration</p>
                      <p className="text-slate-700 text-xs italic font-semibold leading-relaxed">
                        "{morningText || "Your motivational message will appear here for your students..."}"
                      </p>
                      <p className="text-violet-400 text-[10px] font-bold mt-2 not-italic">— {mentorName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "evening" && (
            <motion.div
              key="evening_reflection_tab"
              className="px-5 pt-4 pb-6 space-y-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Card Greeting */}
              <div className="flex items-center gap-3.5 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                  <Moon className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-800 text-[15px] font-bold">Good Evening, {mentorName}! 🌙</h3>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">Help your students reflect on and consolidates today's learning.</p>
                </div>
              </div>

              {/* Choice Prompt selector */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Choose a Predefined Prompt</p>
                <div className="space-y-2">
                  {REFLECTION_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedPromptIdx(idx);
                        setCustomReflectionText("");
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                        selectedPromptIdx === idx
                          ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200"
                          : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"
                      }`}
                    >
                      <span className="text-lg shrink-0 mt-0.5">{prompt.icon}</span>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-wider ${selectedPromptIdx === idx ? "text-indigo-600" : "text-slate-400"}`}>
                          {prompt.category} Question
                        </p>
                        <p className="text-slate-700 text-xs font-semibold leading-relaxed mt-1">"{prompt.prompt}"</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reflection Writer */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Or Write Your Own Custom Prompt</p>
                <textarea
                  value={customReflectionText}
                  onChange={(e) => {
                    setCustomReflectionText(e.target.value);
                    setSelectedPromptIdx(null);
                  }}
                  placeholder="Type a custom reflection question (e.g. 'What was your biggest takeaway from today's lecture?')..."
                  className="w-full h-16 resize-none bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-300 transition-all font-medium"
                />
              </div>

              <Button
                onClick={() => handleSendMessage("reflection")}
                disabled={(selectedPromptIdx === null && !customReflectionText.trim()) || isSending === "reflection"}
                className="w-full h-12 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-100 transition-all"
              >
                {isSending === "reflection" ? (
                  <Check className="w-4 h-4 animate-bounce" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Send Reflection Prompt
                  </>
                )}
              </Button>

              {/* Yesterday's metrics list */}
              <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm space-y-4">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Yesterday's Reflection Activity</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5 shrink-0">
                    {["RK", "SI", "AM"].map((item, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white text-[8px] font-bold text-slate-500 uppercase shrink-0"
                        style={{ zIndex: 3 - idx }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs font-bold">11 Mentees responded in full</p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <p className="text-xl">😊</p>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Top Mood</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                    <p className="text-xs font-black text-slate-800 tracking-wide uppercase leading-none">MySQL</p>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Top Topic</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                    <p className="text-sm font-black text-slate-800 leading-none">7 Days</p>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Streaks</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history_metrics_tab"
              className="px-5 pt-4 pb-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Stats Overview */}
              <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-md">
                <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest mb-3">Your Inspiration Impact</p>
                <div className="grid grid-cols-3 gap-3.5 border-t border-white/10 pt-3.5">
                  <div className="text-center">
                    <p className="text-2xl font-black font-volkhov leading-none">24</p>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-wider mt-1.5">Reflections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black font-volkhov leading-none">8</p>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-wider mt-1.5">Streak Restores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black font-volkhov leading-none">100%</p>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-wider mt-1.5">Success</p>
                  </div>
                </div>
              </div>

              {/* Motivational Unlockable Badges */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Unlocking Badges</p>
                <div className="flex gap-4">
                  {[
                    { title: "Motivator", duration: "5 days", active: true, color: "bg-amber-100 text-amber-500", icon: <Trophy className="w-5 h-5" /> },
                    { title: "Guiding Light", duration: "20 days", active: false, color: "bg-slate-100 text-slate-400", icon: <Award className="w-5 h-5" /> },
                    { title: "Inspiration Master", duration: "100 days", active: false, color: "bg-slate-100 text-slate-300", icon: <Award className="w-5 h-5" /> }
                  ].map((badge, bIdx) => (
                    <div key={bIdx} className={`flex-1 flex flex-col items-center text-center gap-1.5 ${badge.active ? '' : 'opacity-40'}`}>
                      <div className={`w-11 h-11 rounded-full ${badge.color} flex items-center justify-center shadow-inner`}>
                        {badge.icon}
                      </div>
                      <p className="text-slate-800 text-[10px] font-bold leading-tight mt-1">{badge.title}</p>
                      <p className="text-slate-300 text-[9px] font-bold uppercase tracking-wider leading-none">{badge.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log History */}
              <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm space-y-3">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Broadcast Log History</p>
                <div className="space-y-3.5">
                  {localHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100/60 last:border-0 last:pb-0">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                          item.type === "thought" ? "bg-amber-50 text-amber-600 border border-amber-100/50" : "bg-indigo-50 text-indigo-600 border border-indigo-100/50"
                        }`}>
                          {item.type === "thought" ? "☀️" : "🌙"}
                        </div>
                        <div>
                          <p className="text-slate-800 text-xs font-bold leading-relaxed">{item.text}</p>
                          <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-wider">{item.type} · {item.date}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-slate-800 text-xs font-black flex items-center gap-1 justify-end">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-300" /> {item.responses}
                        </p>
                        <p className="text-slate-400 text-[9px] font-bold mt-1 uppercase">Mood: {item.mood}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
