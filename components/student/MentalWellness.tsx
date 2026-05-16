"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, Flame, Heart, Sparkles, Smile, RefreshCw, Check, BookOpen, Star, MessageCircle, AlertCircle, Play, ChevronLeft, ChevronRight, Laugh } from "lucide-react";

interface MentalWellnessProps {
  onBack: () => void;
  coins: number;
  onCoinsEarned: (amount: number) => void;
}

// 1. Data Definitions matching unminified_index.js
const breathingExercises = [
  { label: "Close your eyes", icon: "😌", duration: 3, instruction: "Gently close your eyes and relax your face." },
  { label: "Breathe in deeply", icon: "🌬️", duration: 5, instruction: "Inhale slowly through your nose for 5 seconds." },
  { label: "Hold your breath", icon: "⏸️", duration: 3, instruction: "Hold gently... don't strain." },
  { label: "Breathe out slowly", icon: "💨", duration: 5, instruction: "Exhale through your mouth for 5 seconds." },
  { label: "Relax your shoulders", icon: "🧘", duration: 4, instruction: "Drop your shoulders. Release the tension." },
  { label: "Focus on breathing", icon: "🎯", duration: 5, instruction: "Notice the rhythm. In... and out..." }
];

const positiveAffirmations = [
  "I am capable of learning anything.",
  "It's okay to take breaks.",
  "My pace is my own, and that's enough.",
  "I am growing every single day.",
  "Mistakes help me learn."
];

const gratitudePrompts = [
  "Something I learned today...",
  "Something that made me smile...",
  "Someone who helped me...",
  "A small win I had...",
  "Something I'm proud of..."
];

const defaultGratitudeEntries = [
  { text: "I understood SQL joins", emoji: "🧠", time: "Today, 2:30 PM" },
  { text: "I finished my assignment on time", emoji: "🎉", time: "Today, 11:45 AM" },
  { text: "I asked a question to my mentor", emoji: "💪", time: "Yesterday, 4:15 PM" },
  { text: "Helped a classmate debug their code", emoji: "🤝", time: "Yesterday, 3:00 PM" },
  { text: "Completed my first project", emoji: "🏆", time: "2 days ago" }
];

const memesData = [
  {
    id: "m1",
    title: "The Debugging Experience",
    category: "Debugging",
    top: "When the code works",
    bottom: "but you don't know why",
    emoji: "😅",
    bg: "from-blue-100 to-cyan-100",
    border: "border-blue-200/60",
    reactions: { laugh: 42, relate: 28, fire: 15 }
  },
  {
    id: "m2",
    title: "Classic Developer Moment",
    category: "Programming",
    top: '"It works on my machine"',
    bottom: "— Every developer, everywhere",
    emoji: "💻",
    bg: "from-violet-100 to-purple-100",
    border: "border-violet-200/60",
    reactions: { laugh: 67, relate: 45, fire: 23 }
  },
  {
    id: "m3",
    title: "Semicolon Hunt",
    category: "Debugging",
    top: "Spent 2 hours debugging",
    bottom: "It was a missing semicolon",
    emoji: "🔍",
    bg: "from-rose-100 to-pink-100",
    border: "border-rose-200/60",
    reactions: { laugh: 53, relate: 61, fire: 12 }
  },
  {
    id: "m4",
    title: "Stack Overflow Life",
    category: "Learning",
    top: "Copy code from Stack Overflow",
    bottom: '"I am a programmer now"',
    emoji: "📋",
    bg: "from-amber-100 to-orange-100",
    border: "border-amber-200/60",
    reactions: { laugh: 78, relate: 55, fire: 30 }
  },
  {
    id: "m5",
    title: "Learning Curve",
    category: "Learning",
    top: "Day 1: Python is so easy!",
    bottom: "Day 7: What are decorators?? 🤯",
    emoji: "📈",
    bg: "from-emerald-100 to-teal-100",
    border: "border-emerald-200/60",
    reactions: { laugh: 35, relate: 72, fire: 18 }
  },
  {
    id: "m6",
    title: "Git Confusion",
    category: "Programming",
    top: "git push --force",
    bottom: "Team: 👁️👄👁️",
    emoji: "😱",
    bg: "from-red-100 to-orange-100",
    border: "border-red-200/60",
    reactions: { laugh: 88, relate: 40, fire: 35 }
  }
];

export function MentalWellness({ onBack, coins, onCoinsEarned }: MentalWellnessProps) {
  const [activeTab, setActiveTab] = useState<"calm" | "gratitude" | "memes">("calm");

  return (
    <motion.div
      className="flex flex-col h-full bg-gray-50 -mx-5"
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
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                <p className="text-gray-900 text-sm font-semibold">Mental Wellness</p>
              </div>
              <p className="text-gray-400 text-[11px]">Take care of your mind while you learn</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 rounded-full px-2.5 py-1 border border-amber-100">
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-amber-600 text-xs font-semibold">{coins}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: "calm" as const, label: "Calm Reset", icon: "🧘" },
            { key: "gratitude" as const, label: "Gratitude", icon: "🙏" },
            { key: "memes" as const, label: "Memes", icon: "😂" }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-md text-xs flex items-center justify-center gap-1 transition-all font-medium ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-[10px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "calm" && (
            <CalmReset key="calm" onCoinsEarned={onCoinsEarned} />
          )}
          {activeTab === "gratitude" && (
            <GratitudeGame key="gratitude" onCoinsEarned={onCoinsEarned} />
          )}
          {activeTab === "memes" && (
            <MemesCarousel key="memes" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ==================== CALM RESET VIEW ====================
function CalmReset({ onCoinsEarned }: { onCoinsEarned: (amount: number) => void }) {
  const [isStarted, setIsStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [activeAffirmationIdx, setActiveAffirmationIdx] = useState(0);
  
  const timerRef = useRef<number | null>(null);
  const targetCycles = 5;

  const startExercise = useCallback(() => {
    setIsStarted(true);
    setActiveStep(0);
    setTimeLeft(breathingExercises[0].duration);
    setIsCompleted(false);
    setCycleCount(0);
  }, []);

  const stopExercise = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsStarted(false);
    setActiveStep(0);
    setTimeLeft(0);
    setIsCompleted(false);
    setCycleCount(0);
  }, []);

  // Breathing timer ticks
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next breathing step
          let nextStep = activeStep + 1;
          if (nextStep >= breathingExercises.length) {
            // Completed 1 full cycle
            const nextCycleCount = cycleCount + 1;
            if (nextCycleCount >= targetCycles) {
              // Completed all 5 cycles!
              setIsCompleted(true);
              setIsStarted(false);
              onCoinsEarned(10);
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            }
            setCycleCount(nextCycleCount);
            setActiveStep(0);
            return breathingExercises[0].duration;
          } else {
            setActiveStep(nextStep);
            return breathingExercises[nextStep].duration;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, activeStep, cycleCount, isCompleted, onCoinsEarned]);

  // Rotate affirmations every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAffirmationIdx(prev => (prev + 1) % positiveAffirmations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentExercise = breathingExercises[activeStep];
  // Calculate completion percentage: D = isStarted ? (cycleCount + activeStep / breathingExercises.length) / targetCycles * 100 : 0
  const progressPercent = isStarted 
    ? ((cycleCount + activeStep / breathingExercises.length) / targetCycles) * 100 
    : 0;

  return (
    <motion.div
      className="px-5 pt-4 pb-6 space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Intro block */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <p className="text-teal-900 text-xs font-semibold">5-Minute Brain Recharge Mode</p>
          <span className="bg-teal-100 text-teal-600 text-[9px] px-1.5 py-0.5 rounded font-bold">RELAX</span>
        </div>
        <p className="text-teal-700 text-[11px] leading-relaxed">
          Deep, deliberate breathing signals your brain to lower stress, increases oxygen, and resets your cognitive load for better learning.
        </p>
      </div>

      {/* Main interaction board */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
        {!isStarted && !isCompleted ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🧘
            </div>
            <div>
              <h3 className="text-gray-800 text-sm font-semibold">Calm Reset breathing cycle</h3>
              <p className="text-gray-400 text-[11px] mt-1 max-w-[240px] mx-auto leading-relaxed">
                We will guide you through 5 deep breathing cycles. Takes around 2-3 minutes.
              </p>
            </div>
            <button
              onClick={startExercise}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 active:scale-95 transition-transform flex items-center gap-2 mx-auto shadow-md shadow-teal-600/10"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Reset
            </button>
          </div>
        ) : isCompleted ? (
          <div className="text-center space-y-4 py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <span className="text-4xl animate-pulse">✨</span>
            </div>
            <div>
              <h3 className="text-gray-900 text-sm font-semibold">Brain Recharged!</h3>
              <p className="text-gray-400 text-[11px] max-w-[240px] mx-auto leading-relaxed">
                Great job! You completed all 5 breathing cycles and refreshed your mental space.
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 text-xs px-3 py-1 rounded-full border border-amber-100 w-fit mx-auto font-semibold">
              <Coins className="w-4 h-4 fill-amber-500 text-amber-500" />
              +10 coins earned!
            </div>
            <button
              onClick={startExercise}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto hover:bg-gray-200 active:scale-95 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Do it again
            </button>
          </div>
        ) : (
          <div className="text-center w-full space-y-6">
            {/* SVG Countdown Circle and Breathing Orb */}
            <div className="relative w-36 h-36 mx-auto">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={364.42}
                  animate={{ strokeDashoffset: 364.42 * (1 - (timeLeft / currentExercise.duration)) }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              
              {/* Breathing central orb with expanding scale based on step description */}
              <motion.div
                className="absolute inset-3 rounded-full bg-gradient-to-br from-teal-50 to-cyan-100 flex flex-col items-center justify-center shadow-inner"
                animate={{
                  scale: currentExercise.label.includes("Breathe in") ? [1, 1.15] :
                         currentExercise.label.includes("Breathe out") ? [1.15, 1] :
                         currentExercise.label.includes("Hold") ? 1.15 : 1
                }}
                transition={{ duration: currentExercise.duration, ease: "easeInOut" }}
              >
                <span className="text-2xl mb-1">{currentExercise.icon}</span>
                <span className="text-teal-800 text-xl font-bold">{timeLeft}s</span>
              </motion.div>
            </div>

            {/* Instruction description */}
            <div className="space-y-1 px-4 min-h-[50px]">
              <p className="text-gray-900 text-sm font-semibold">{currentExercise.label}</p>
              <p className="text-gray-400 text-[11px] leading-relaxed">{currentExercise.instruction}</p>
            </div>

            {/* Progress indicators */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-4 px-2">
              <div className="text-left">
                <p className="text-gray-400 text-[10px]">Cycle Progress</p>
                <p className="text-gray-700 text-xs font-semibold">Cycle {cycleCount + 1} of {targetCycles}</p>
              </div>
              <button
                onClick={stopExercise}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg text-[11px] font-semibold hover:bg-gray-100"
              >
                Exit Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rotating affirmation footer card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-1">Affirmation of the Moment</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeAffirmationIdx}
            className="text-teal-600 text-xs font-semibold leading-relaxed"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            "{positiveAffirmations[activeAffirmationIdx]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ==================== GRATITUDE VIEW ====================
function GratitudeGame({ onCoinsEarned }: { onCoinsEarned: (amount: number) => void }) {
  const [entries, setEntries] = useState<any[]>(defaultGratitudeEntries);
  const [formInputs, setFormInputs] = useState<string[]>(["", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [points, setPoints] = useState(45);
  const [streak, setStreak] = useState(3);
  const [promptIdx, setPromptIdx] = useState(0);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  const handleInputChange = (idx: number, val: string) => {
    setFormInputs(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const filledCount = formInputs.filter(inp => inp.trim()).length;

  const handleSubmit = () => {
    if (filledCount === 0) return;

    const coinsPayout = filledCount * 5;
    const addedEntries = formInputs
      .filter(inp => inp.trim())
      .map(inp => ({
        text: inp,
        emoji: ["🌟", "💪", "🎯", "🧠", "❤️"][Math.floor(Math.random() * 5)],
        time: "Just now"
      }));

    setEntries(prev => [...addedEntries, ...prev]);
    setPoints(prev => prev + coinsPayout);
    setStreak(prev => prev + 1);
    onCoinsEarned(coinsPayout);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormInputs(["", "", ""]);
      setPromptIdx(prev => (prev + 1) % 3);
    }, 3000);
  };

  // Prompts logic
  const currentPrompts = [
    gratitudePrompts[(promptIdx * 3) % gratitudePrompts.length],
    gratitudePrompts[(promptIdx * 3 + 1) % gratitudePrompts.length],
    gratitudePrompts[(promptIdx * 3 + 2) % gratitudePrompts.length]
  ];

  const levelNum = Math.floor(points / 30) + 1;
  const levelProgress = (points % 30) / 30;
  const levelNames = ["Grateful Beginner", "Thankful Thinker", "Gratitude Champion", "Appreciation Master", "Zen Master"];
  const levelName = levelNames[Math.min(levelNum - 1, levelNames.length - 1)];

  return (
    <motion.div
      className="px-5 pt-4 pb-6 space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Progress Card */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500">
              🙏
            </div>
            <div>
              <p className="text-gray-900 text-xs font-bold">Gratitude Points</p>
              <p className="text-rose-600 text-[10px] font-semibold">Level {levelNum}: {levelName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-900 text-lg font-bold leading-none">{points}</p>
            <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider">points</p>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] text-gray-500 font-medium">
            <span>Level {levelNum}</span>
            <span>Level {levelNum + 1}</span>
          </div>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-rose-100/40">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
              animate={{ width: `${levelProgress * 100}%` }}
              transition={{ type: "spring", damping: 20 }}
            />
          </div>
        </div>

        {/* Streaks row */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="text-gray-600 text-[10px] font-semibold">{streak}-day streak</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-gray-600 text-[10px] font-semibold">{entries.length} total entries</span>
          </div>
          <span className="text-rose-500 text-[10px] ml-auto font-bold">+5 coins each</span>
        </div>
      </div>

      {/* Editor block */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">📝</span>
          <p className="text-gray-900 text-xs font-semibold">Write 3 Good Things Today</p>
          <span className="ml-auto px-1.5 py-0.5 bg-rose-50 text-rose-500 text-[10px] rounded-md font-bold">
            {filledCount}/3
          </span>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="text-4xl"
            >
              🎉
            </motion.div>
            <p className="text-gray-900 text-xs font-bold">Gratitude Recorded!</p>
            <div className="flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1 w-fit mx-auto text-amber-600 text-xs font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              +{filledCount * 5} coins earned
            </div>
            <p className="text-gray-400 text-[10px]">{streak}-day streak! Keep going!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentPrompts.map((p, idx) => (
              <div key={idx} className="space-y-1 relative">
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="text-xs">{["1️⃣", "2️⃣", "3️⃣"][idx]}</span>
                    {p}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formInputs[idx]}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="Today I am grateful for..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-xs text-gray-900 placeholder:text-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 transition-all"
                  />
                  {formInputs[idx].trim() && (
                    <motion.div
                      className="absolute right-3 top-2.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-2.5 h-2.5 text-emerald-500" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={filledCount === 0}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md ${
                filledCount > 0
                  ? "bg-rose-500 text-white shadow-rose-500/10 hover:bg-rose-600"
                  : "bg-gray-100 text-gray-300 pointer-events-none"
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              Submit Gratitude (+{filledCount * 5} coins)
            </button>
          </div>
        )}
      </div>

      {/* Accordion List of Entries */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsJournalOpen(!isJournalOpen)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <p className="text-gray-900 text-xs font-semibold">Past Gratitude Entries</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
              {entries.length} entries
            </span>
            <motion.span
              animate={{ rotate: isJournalOpen ? 90 : 0 }}
              className="text-gray-400 text-xs font-bold"
            >
              ▶
            </motion.span>
          </div>
        </button>

        <AnimatePresence>
          {isJournalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-50"
            >
              <div className="p-3.5 space-y-2 max-h-60 overflow-y-auto">
                {entries.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <span className="text-sm shrink-0">{entry.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-xs leading-relaxed font-medium">{entry.text}</p>
                      <p className="text-gray-300 text-[10px] mt-0.5">{entry.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quote Footer */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-3.5 text-center">
        <p className="text-gray-600 text-xs italic leading-relaxed">
          "Gratitude turns what we have into enough."
        </p>
        <p className="text-gray-400 text-[10px] mt-1 font-medium">Write 3 things daily to build a zen mind!</p>
      </div>
    </motion.div>
  );
}

// ==================== DAILY MEMES VIEW ====================
function MemesCarousel() {
  const [activeMemeIdx, setActiveMemeIdx] = useState(0);
  const [reactions, setReactions] = useState<Record<string, string>>({}); // memeId -> reactionType

  const activeMeme = memesData[activeMemeIdx];

  const handleNext = () => {
    setActiveMemeIdx(prev => (prev + 1) % memesData.length);
  };

  const handlePrev = () => {
    setActiveMemeIdx(prev => (prev - 1 + memesData.length) % memesData.length);
  };

  const handleReaction = (memeId: string, reaction: string) => {
    setReactions(prev => {
      const current = prev[memeId];
      if (current === reaction) {
        // Toggle off
        const copy = { ...prev };
        delete copy[memeId];
        return copy;
      }
      return { ...prev, [memeId]: reaction };
    });
  };

  const reactionButtons = [
    { key: "laugh", label: "😂", activeColor: "bg-amber-100 text-amber-600 border-amber-300" },
    { key: "relate", label: "🤝", activeColor: "bg-blue-100 text-blue-600 border-blue-300" },
    { key: "fire", label: "🔥", activeColor: "bg-orange-100 text-orange-600 border-orange-300" }
  ];

  return (
    <motion.div
      className="px-5 pt-4 pb-6 space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Promo Card */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 p-4 flex gap-3.5 items-start">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Smile className="w-5 h-5 text-amber-600 fill-amber-100" />
        </div>
        <div>
          <p className="text-gray-900 text-xs font-semibold">Meme of the Day</p>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            Learning can be stressful. A quick laugh reduces cortisol by up to 39% and improves technical retention!
          </p>
        </div>
      </div>

      {/* Meme Card Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMeme.id}
          className={`bg-gradient-to-br ${activeMeme.bg} rounded-2xl border ${activeMeme.border} shadow-sm overflow-hidden flex flex-col min-h-[220px]`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-5 text-center flex-1 flex flex-col justify-center items-center">
            <span className="px-2 py-0.5 bg-white/70 text-gray-600 text-[9px] font-bold rounded-full uppercase tracking-wider mb-2">
              {activeMeme.category}
            </span>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="text-6xl my-3"
            >
              {activeMeme.emoji}
            </motion.div>
            <h4 className="text-gray-800 text-sm font-semibold mb-0.5">{activeMeme.top}</h4>
            <p className="text-gray-600 text-xs italic">{activeMeme.bottom}</p>
          </div>

          {/* Reactions bar */}
          <div className="bg-white/50 backdrop-blur-sm px-4 py-3 border-t border-gray-100/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-[10px] font-semibold">{activeMeme.title}</span>
              <span className="text-gray-400 text-[10px] font-semibold">{activeMemeIdx + 1}/{memesData.length}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {reactionButtons.map(btn => {
                const isSelected = reactions[activeMeme.id] === btn.key;
                const count = activeMeme.reactions[btn.key as keyof typeof activeMeme.reactions] + (isSelected ? 1 : 0);
                return (
                  <button
                    key={btn.key}
                    onClick={() => handleReaction(activeMeme.id, btn.key)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs transition-all active:scale-95 ${
                      isSelected 
                        ? btn.activeColor 
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span>{btn.label}</span>
                    <span className="font-semibold text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl text-xs text-gray-600 border border-gray-100 active:scale-95 transition-transform font-semibold hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
          Previous
        </button>
        <div className="flex gap-1.5">
          {memesData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMemeIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeMemeIdx ? "bg-gray-900 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white rounded-xl text-xs text-gray-600 border border-gray-100 active:scale-95 transition-transform font-semibold hover:bg-gray-50"
        >
          Next
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* All Memes Selector Cards Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm space-y-2">
        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-1">Meme Deck</p>
        <div className="grid grid-cols-3 gap-2">
          {memesData.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveMemeIdx(idx)}
              className={`p-2 rounded-xl text-center transition-all active:scale-95 border ${
                idx === activeMemeIdx
                  ? `bg-gradient-to-br ${m.bg} border-gray-300 ring-1 ring-gray-200`
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
            >
              <span className="text-xl block mb-1">{m.emoji}</span>
              <span className="text-[9px] text-gray-500 font-medium line-clamp-1">{m.title}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
