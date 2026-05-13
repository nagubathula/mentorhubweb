"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, Sparkles, Heart, Bookmark, Code, Briefcase, Brain, FlaskConical, Lightbulb, Award, Check, HelpCircle, Trophy, ThumbsUp } from "lucide-react";

interface InterestingFactsProps {
  onBack: () => void;
  coins: number;
  onCoinsEarned: (amount: number) => void;
}

// 1. Facts List matching Uo in unminified_index.js
const factsData = [
  { id: 1, text: "The first computer programmer was Ada Lovelace in 1843 — over 100 years before modern computers existed.", category: "tech", emoji: "💻" },
  { id: 2, text: "The first website ever created is still online today. It was published by Tim Berners-Lee in 1991.", category: "tech", emoji: "🌐" },
  { id: 3, text: "Python is named after the comedy group Monty Python, not the snake.", category: "tech", emoji: "🐍" },
  { id: 4, text: "The average smartphone today has more computing power than NASA had during the Apollo 11 moon landing.", category: "tech", emoji: "📱" },
  { id: 5, text: "Many successful engineers wrote their first code as beginners without formal training.", category: "career", emoji: "🚀" },
  { id: 6, text: "Steve Jobs once said that connecting ideas from different fields creates innovation.", category: "career", emoji: "💡" },
  { id: 7, text: "Many tech founders built their first product while still learning the basics.", category: "career", emoji: "🔥" },
  { id: 8, text: "The most in-demand skill across all industries in 2025 is creative problem-solving.", category: "career", emoji: "🎯" },
  { id: 9, text: "The brain remembers information better when learning is spaced over time (the spacing effect).", category: "brain", emoji: "🧠" },
  { id: 10, text: "Taking short breaks improves concentration and creativity — your brain processes information during rest.", category: "brain", emoji: "☕" },
  { id: 11, text: "Teaching others helps you remember concepts 90% longer than just reading about them.", category: "brain", emoji: "📖" },
  { id: 12, text: "Your brain forms new neural connections every single time you learn something new.", category: "brain", emoji: "⚡" },
  { id: 13, text: "The human brain uses about 20% of the body's total energy despite being only 2% of body weight.", category: "science", emoji: "🔬" },
  { id: 14, text: "Octopuses have three hearts and blue blood.", category: "science", emoji: "🐙" },
  { id: 15, text: "Honey never spoils — jars found in ancient Egyptian tombs are still edible after 3,000 years.", category: "science", emoji: "🍯" },
  { id: 16, text: "There are more possible chess games than atoms in the observable universe.", category: "science", emoji: "♟️" },
  { id: 17, text: "The first bug in computing was literally a moth stuck in a computer relay at Harvard in 1947.", category: "code", emoji: "🪲" },
  { id: 18, text: "JavaScript was created in just 10 days by Brendan Eich in 1995.", category: "code", emoji: "⚡" },
  { id: 19, text: "The first version of Windows was released in 1985 and required only 256 KB of memory.", category: "code", emoji: "🪟" },
  { id: 20, text: "There are over 700 programming languages in the world. You only need to master a few!", category: "code", emoji: "🧑‍💻" },
  { id: 21, text: "Consistency matters more than intensity in skill building. Small daily steps beat rare marathons.", category: "motivation", emoji: "🌟" },
  { id: 22, text: "Many great inventions came from solving everyday problems — not from genius moments.", category: "motivation", emoji: "✨" },
  { id: 23, text: "The best way to learn something is to build something with it.", category: "motivation", emoji: "🛠️" },
  { id: 24, text: "Every expert was once a beginner. The only difference is they never stopped learning.", category: "motivation", emoji: "🏆" }
];

// Categories definition matching g0 in unminified_index.js
const categories = [
  { key: "all", label: "All", icon: Sparkles, color: "text-violet-600", bg: "bg-violet-100" },
  { key: "tech", label: "Tech", icon: Code, color: "text-blue-600", bg: "bg-blue-100" },
  { key: "career", label: "Career", icon: Briefcase, color: "text-orange-600", bg: "bg-orange-100" },
  { key: "brain", label: "Brain", icon: Brain, color: "text-pink-600", bg: "bg-pink-100" },
  { key: "science", label: "Science", icon: FlaskConical, color: "text-emerald-600", bg: "bg-emerald-100" },
  { key: "code", label: "Code", icon: Lightbulb, color: "text-cyan-600", bg: "bg-cyan-100" },
  { key: "motivation", label: "Inspire", icon: Award, color: "text-amber-600", bg: "bg-amber-100" }
];

// Aesthetic tokens matching Ld in unminified_index.js
const aestheticStyles: Record<string, any> = {
  tech: { border: "border-blue-200", badge: "bg-blue-50", badgeText: "text-blue-600", glow: "from-blue-500/10 to-transparent" },
  career: { border: "border-orange-200", badge: "bg-orange-50", badgeText: "text-orange-600", glow: "from-orange-500/10 to-transparent" },
  brain: { border: "border-pink-200", badge: "bg-pink-50", badgeText: "text-pink-600", glow: "from-pink-500/10 to-transparent" },
  science: { border: "border-emerald-200", badge: "bg-emerald-50", badgeText: "text-emerald-600", glow: "from-emerald-500/10 to-transparent" },
  code: { border: "border-cyan-200", badge: "bg-cyan-50", badgeText: "text-cyan-600", glow: "from-cyan-500/10 to-transparent" },
  motivation: { border: "border-amber-200", badge: "bg-amber-50", badgeText: "text-amber-600", glow: "from-amber-500/10 to-transparent" }
};

// Quiz Question matching ti in unminified_index.js
const triviaChallenge = {
  fact: "JavaScript was created in just 10 days.",
  question: "How long do you think it takes to learn the basics of JavaScript?",
  options: ["A weekend", "A few weeks", "A month", "Depends on practice!"],
  correctIndex: 3
};

// Calculate Fact of the Day programmatically matching R9 in unminified_index.js
function getFactOfTheDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 864e5);
  return factsData[dayOfYear % factsData.length];
}

export function InterestingFacts({ onBack, coins, onCoinsEarned }: InterestingFactsProps) {
  const [activeTab, setActiveTab] = useState<"feed" | "challenge" | "saved">("feed");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Interaction sets
  const [likedFacts, setLikedFacts] = useState<Set<number>>(new Set());
  const [savedFacts, setSavedFacts] = useState<Set<number>>(new Set());
  
  // Challenge quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChallengeSubmitted, setIsChallengeSubmitted] = useState(false);

  const factOfTheDay = getFactOfTheDay();

  const handleLikeFact = (id: number) => {
    setLikedFacts(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
        onCoinsEarned(1); // Earning +1 coin on like
      }
      return copy;
    });
  };

  const handleSaveFact = (id: number) => {
    setSavedFacts(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const handleChallengeSubmit = () => {
    if (selectedOption === null) return;
    setIsChallengeSubmitted(true);
    if (selectedOption === triviaChallenge.correctIndex) {
      onCoinsEarned(10); // +10 coins on correct answer
    }
  };

  // Filter items
  const filteredFacts = selectedCategory === "all"
    ? factsData
    : factsData.filter(f => f.category === selectedCategory);

  const savedFactsList = factsData.filter(f => savedFacts.has(f.id));

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
              <p className="text-gray-900 text-sm font-semibold">Interesting Facts</p>
              <p className="text-gray-400 text-[11px]">Small facts. Big inspiration.</p>
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
            { key: "feed" as const, label: "Feed", icon: Sparkles },
            { key: "challenge" as const, label: "Challenge", icon: HelpCircle },
            { key: "saved" as const, label: "Saved", icon: Bookmark }
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
                <IconComponent className="w-3.5 h-3.5" />
                {tab.label}
                {tab.key === "saved" && savedFacts.size > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-violet-100 text-violet-600 text-[9px] flex items-center justify-center font-bold">
                    {savedFacts.size}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Fact of the Day Highlight Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
                
                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <p className="text-white/85 text-[10px] uppercase font-bold tracking-wider">Fact of the Day</p>
                  </div>
                  
                  <p className="text-sm font-medium leading-relaxed">"{factOfTheDay.text}"</p>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleLikeFact(factOfTheDay.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        likedFacts.has(factOfTheDay.id)
                          ? "bg-white/30 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/15"
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${likedFacts.has(factOfTheDay.id) ? "fill-current text-rose-400" : ""}`} />
                      {likedFacts.has(factOfTheDay.id) ? "Liked" : "Like"}
                    </button>
                    <button
                      onClick={() => handleSaveFact(factOfTheDay.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        savedFacts.has(factOfTheDay.id)
                          ? "bg-white/30 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/15"
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${savedFacts.has(factOfTheDay.id) ? "fill-current text-violet-300" : ""}`} />
                      {savedFacts.has(factOfTheDay.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Category selector slider carousel */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map(cat => {
                  const CatIcon = cat.icon;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 border ${
                        isSelected
                          ? `${cat.bg} ${cat.color} border-transparent shadow-sm`
                          : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Facts Cards Feed */}
              <div className="space-y-3">
                {filteredFacts.map((fact, idx) => {
                  const styles = aestheticStyles[fact.category] || { border: "border-gray-200", badge: "bg-gray-50", badgeText: "text-gray-500", glow: "from-gray-500/5 to-transparent" };
                  const isLiked = likedFacts.has(fact.id);
                  const isSaved = savedFacts.has(fact.id);

                  return (
                    <motion.div
                      key={fact.id}
                      className={`bg-white rounded-xl p-4 border ${styles.border} relative overflow-hidden shadow-sm`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${styles.glow}`} />
                      
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5 shrink-0">{fact.emoji}</span>
                        <div className="flex-1 min-w-0 space-y-3">
                          <p className="text-gray-700 text-xs font-semibold leading-relaxed">{fact.text}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles.badge} ${styles.badgeText}`}>
                              {fact.category}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleLikeFact(fact.id)}
                                className={`flex items-center gap-0.5 text-[11px] transition-colors ${
                                  isLiked ? "text-rose-500" : "text-gray-300 hover:text-gray-400"
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                              </button>
                              <button
                                onClick={() => handleSaveFact(fact.id)}
                                className={`flex items-center gap-0.5 text-[11px] transition-colors ${
                                  isSaved ? "text-violet-500" : "text-gray-300 hover:text-gray-400"
                                }`}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "challenge" && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Daily Trivia Fact Banner */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-200" />
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Weekly Curiosity Challenge</p>
                  </div>
                  <p className="text-white/90 text-xs font-bold mt-1">Did you know?</p>
                  <p className="text-sm font-semibold leading-relaxed">"{triviaChallenge.fact}"</p>
                </div>
              </div>

              {/* Challenge Quiz Box */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                <p className="text-gray-800 text-xs font-bold">{triviaChallenge.question}</p>
                
                <div className="space-y-2">
                  {triviaChallenge.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const showCorrect = isChallengeSubmitted && idx === triviaChallenge.correctIndex;
                    const showWrong = isChallengeSubmitted && isSelected && idx !== triviaChallenge.correctIndex;

                    return (
                      <button
                        key={idx}
                        disabled={isChallengeSubmitted}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-between ${
                          showCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/5"
                            : showWrong
                            ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm"
                            : isSelected
                            ? "border-violet-300 bg-violet-50 text-violet-700"
                            : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            isSelected ? "border-violet-400 bg-violet-100" : "border-gray-200 bg-white"
                          }`}>
                            {showCorrect ? <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} /> : String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {isChallengeSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-xs text-center border font-bold ${
                      selectedOption === triviaChallenge.correctIndex
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {selectedOption === triviaChallenge.correctIndex ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl animate-bounce">🎉</span>
                        <p>Correct answer! You earned 10 coins!</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🤔</span>
                        <p>Nice try! The correct answer is: "{triviaChallenge.options[triviaChallenge.correctIndex]}"</p>
                        <p className="text-[10px] text-amber-600/70 mt-1 uppercase tracking-wider font-bold">Keep exploring — curiosity is your superpower!</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={handleChallengeSubmit}
                    disabled={selectedOption === null}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      selectedOption !== null
                        ? "bg-violet-600 text-white shadow-violet-600/10 hover:bg-violet-700 active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 pointer-events-none"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Submit Answer
                  </button>
                )}
              </div>

              {/* Curiosity Stats Row */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-[9px] uppercase font-bold tracking-wider mb-3">Your Curiosity Metrics</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-gray-50/50 p-2 rounded-xl">
                    <p className="text-gray-900 text-lg font-bold">{likedFacts.size}</p>
                    <p className="text-gray-400 text-[10px] font-semibold">Liked</p>
                  </div>
                  <div className="text-center bg-gray-50/50 p-2 rounded-xl">
                    <p className="text-gray-900 text-lg font-bold">{savedFacts.size}</p>
                    <p className="text-gray-400 text-[10px] font-semibold">Saved</p>
                  </div>
                  <div className="text-center bg-gray-50/50 p-2 rounded-xl">
                    <p className="text-gray-900 text-lg font-bold">{isChallengeSubmitted ? 1 : 0}</p>
                    <p className="text-gray-400 text-[10px] font-semibold">Challenges</p>
                  </div>
                </div>
              </div>

              {/* Mentor Quote Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100 space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <p className="text-indigo-900 text-[10px] font-bold uppercase tracking-wider">Mentor's Fact of the Day</p>
                </div>
                <p className="text-gray-700 text-xs italic leading-relaxed font-medium">
                  "Did you know debugging skills are one of the most valuable skills in software engineering? Master the art of finding bugs!"
                </p>
                <p className="text-indigo-400 text-[10px] font-bold">— Pradeep K., Your Mentor</p>
              </div>
            </motion.div>
          )}

          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {savedFactsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm px-6 min-h-[300px]">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 text-2xl text-gray-300">
                    📂
                  </div>
                  <h3 className="text-gray-800 text-xs font-bold">No saved facts yet</h3>
                  <p className="text-gray-400 text-[10px] max-w-[200px] mt-1 leading-relaxed">
                    Tap the save bookmark icon on any fact in your feed to bookmark it here for later.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedFactsList.map((fact, idx) => {
                    const styles = aestheticStyles[fact.category] || { border: "border-gray-200", badge: "bg-gray-50", badgeText: "text-gray-500", glow: "from-gray-500/5 to-transparent" };
                    const isLiked = likedFacts.has(fact.id);

                    return (
                      <motion.div
                        key={fact.id}
                        className={`bg-white rounded-xl p-4 border ${styles.border} relative overflow-hidden shadow-sm`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${styles.glow}`} />
                        
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5 shrink-0">{fact.emoji}</span>
                          <div className="flex-1 min-w-0 space-y-3">
                            <p className="text-gray-700 text-xs font-semibold leading-relaxed">{fact.text}</p>
                            
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles.badge} ${styles.badgeText}`}>
                                {fact.category}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleLikeFact(fact.id)}
                                  className={`flex items-center gap-0.5 text-[11px] transition-colors ${
                                    isLiked ? "text-rose-500" : "text-gray-300 hover:text-gray-400"
                                  }`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                                </button>
                                <button
                                  onClick={() => handleSaveFact(fact.id)}
                                  className="flex items-center gap-0.5 text-[11px] text-violet-500"
                                >
                                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
