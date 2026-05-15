"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Dices, Trophy, Award, Lock, Sparkles, Coins, Gamepad2, Play, ChevronRight, X, Heart, ShieldAlert, BadgeHelp, CheckCircle2, User, Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Types ---
type GameType = "snakes" | "ludo" | "kbc" | "leaderboard";

interface GameProps {
  userName: string;
  userCoins: number;
  onCoinsEarned: (coins: number) => void;
  onBack: () => void;
  onPlayComplete?: (game: "snakes" | "ludo" | "kbc", score: number, coinsEarned: number) => void;
}

// --- Constants ---
const DAILY_LIMIT = 3;
const STORAGE_DAILY_PLAYS = "mentorhub_daily_plays";
const MAX_BOARD_POSITION = 30;
const BOARD_COLS = 5;
const BOARD_ROWS = 6;

// Snakes & Ladders positions
const SNAKES: Record<number, number> = { 27: 7, 21: 3, 17: 10, 24: 12 };
const LADDERS: Record<number, number> = { 4: 16, 9: 22, 14: 26, 2: 11 };

// Ludo constant board array helper
const N9 = [
  ["G", "G", "G", "G", "G", "G", "P", "RS", "P", "R", "R", "R", "R", "R", "R"],
  ["G", "E", "E", "E", "E", "G", "P", "RH", "P", "R", "E", "E", "E", "E", "R"],
  ["G", "E", "E", "E", "E", "G", "P", "RH", "P", "R", "E", "E", "E", "E", "R"],
  ["G", "E", "E", "E", "E", "G", "P", "RH", "P", "R", "E", "E", "E", "E", "R"],
  ["G", "E", "E", "E", "E", "G", "P", "RH", "P", "R", "E", "E", "E", "E", "R"],
  ["G", "G", "G", "G", "G", "G", "P", "RH", "P", "R", "R", "R", "R", "R", "R"],
  ["P", "P", "P", "P", "P", "P", "C", "C", "C", "P", "P", "P", "P", "P", "P"],
  ["BS", "BH", "BH", "BH", "BH", "C", "C", "C", "C", "C", "RH", "RH", "RH", "RH", "RS"],
  ["P", "P", "P", "P", "P", "P", "C", "C", "C", "P", "P", "P", "P", "P", "P"],
  ["B", "B", "B", "B", "B", "B", "P", "BH", "P", "Y", "Y", "Y", "Y", "Y", "Y"],
  ["B", "E", "E", "E", "E", "B", "P", "BH", "P", "Y", "E", "E", "E", "E", "Y"],
  ["B", "E", "E", "E", "E", "B", "P", "BH", "P", "Y", "E", "E", "E", "E", "Y"],
  ["B", "E", "E", "E", "E", "B", "P", "BH", "P", "Y", "E", "E", "E", "E", "Y"],
  ["B", "E", "E", "E", "E", "B", "P", "BH", "P", "Y", "E", "E", "E", "E", "Y"],
  ["B", "B", "B", "B", "B", "B", "P", "BH", "P", "Y", "Y", "Y", "Y", "Y", "Y"]
];

// Calculate board serpentine coordinates (from 1 to 30)
function getBoardCoordinates(pos: number) {
  const i = pos - 1;
  const row = Math.floor(i / BOARD_COLS);
  const col = row % 2 === 0 ? i % BOARD_COLS : BOARD_COLS - 1 - (i % BOARD_COLS);
  return {
    row: BOARD_ROWS - 1 - row,
    col: col
  };
}

// --- Static Questions Mocks matching APK ---
const SNAKES_QUESTIONS = [
  { id: "aq1", moduleId: "m1", question: "What is the correct file extension for Python files?", options: [".py", ".python", ".pt", ".pn"], correctIndex: 0, difficulty: "easy", coins: 5 },
  { id: "aq2", moduleId: "m1", question: "Which command runs a Python script in the terminal?", options: ["run script.py", "python script.py", "exec script.py", "start script.py"], correctIndex: 1, difficulty: "easy", coins: 5 },
  { id: "aq3", moduleId: "m2", question: "Which of these is NOT a Python data type?", options: ["int", "float", "char", "str"], correctIndex: 2, difficulty: "easy", coins: 5 },
  { id: "aq4", moduleId: "m2", question: "What does type(3.14) return?", options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'decimal'>"], correctIndex: 1, difficulty: "medium", coins: 10 },
  { id: "aq5", moduleId: "m2", question: "What is the result of int('42')?", options: ["'42'", "42", "Error", "4.2"], correctIndex: 1, difficulty: "easy", coins: 5 },
  { id: "aq6", moduleId: "m3", question: "Which keyword starts a conditional block in Python?", options: ["switch", "if", "when", "case"], correctIndex: 1, difficulty: "easy", coins: 5 },
  { id: "aq7", moduleId: "m3", question: "What does 'elif' stand for?", options: ["else finally", "else if", "element if", "eliminate if"], correctIndex: 1, difficulty: "easy", coins: 5 },
  { id: "aq8", moduleId: "m3", question: "What does 'not True' evaluate to?", options: ["True", "False", "None", "Error"], correctIndex: 1, difficulty: "medium", coins: 10 },
  { id: "aq9", moduleId: "m4", question: "What will 'for i in range(3)' iterate?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"], correctIndex: 1, difficulty: "medium", coins: 10 },
  { id: "aq10", moduleId: "m4", question: "Which keyword exits a loop immediately?", options: ["stop", "exit", "break", "return"], correctIndex: 2, difficulty: "easy", coins: 5 },
  { id: "aq11", moduleId: "m5", question: "How do you define a function in Python?", options: ["function myFunc():", "def myFunc():", "fn myFunc():", "func myFunc():"], correctIndex: 1, difficulty: "easy", coins: 5 },
  { id: "aq12", moduleId: "m5", question: "What does a function return if there's no return statement?", options: ["0", "''", "None", "False"], correctIndex: 2, difficulty: "medium", coins: 10 }
];

const LUDO_QUESTIONS = [
  { id: "lq1", question: "What keyword is used to create a class in Python?", options: ["class", "struct", "object", "define"], correctIndex: 0, coins: 5 },
  { id: "lq2", question: "Which operator is used for exponentiation?", options: ["^", "**", "//", "%%"], correctIndex: 1, coins: 5 },
  { id: "lq3", question: "What does len([1,2,3]) return?", options: ["2", "3", "4", "Error"], correctIndex: 1, coins: 5 },
  { id: "lq4", question: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], correctIndex: 2, coins: 5 },
  { id: "lq5", question: "What is the output of bool('')?", options: ["True", "False", "None", "Error"], correctIndex: 1, coins: 10 },
  { id: "lq6", question: "Which method adds an item to the end of a list?", options: ["add()", "push()", "append()", "insert()"], correctIndex: 2, coins: 5 },
  { id: "lq7", question: "What does 'pass' do in Python?", options: ["Exits loop", "Skips iteration", "Does nothing", "Returns None"], correctIndex: 2, coins: 5 },
  { id: "lq8", question: "What is the result of 10 // 3?", options: ["3.33", "3", "4", "3.0"], correctIndex: 1, coins: 10 }
];

const KBC_QUESTIONS = [
  { id: "k1", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Mode Language"], correctIndex: 0, difficulty: "easy" },
  { id: "k2", question: "Which symbol is used for comments in Python?", options: ["//", "/*", "#", "--"], correctIndex: 2, difficulty: "easy" },
  { id: "k3", question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Utility"], correctIndex: 1, difficulty: "easy" },
  { id: "k4", question: "Which language is used to style web pages?", options: ["HTML", "Python", "CSS", "Java"], correctIndex: 2, difficulty: "easy" },
  { id: "k5", question: "What is the output of print(2 + 3)?", options: ["23", "5", "2+3", "Error"], correctIndex: 1, difficulty: "easy" },
  { id: "k6", question: "Which company created JavaScript?", options: ["Microsoft", "Google", "Netscape", "Apple"], correctIndex: 2, difficulty: "easy" },
  { id: "k7", question: "What does URL stand for?", options: ["Universal Resource Locator", "Uniform Resource Locator", "Unified Resource Link", "Universal Reference Link"], correctIndex: 1, difficulty: "easy" },
  { id: "k8", question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctIndex: 2, difficulty: "medium" },
  { id: "k9", question: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1, difficulty: "medium" },
  { id: "k10", question: "What does API stand for?", options: ["Application Programming Interface", "Applied Program Integration", "Automatic Program Interaction", "Application Process Interface"], correctIndex: 0, difficulty: "medium" },
  { id: "k11", question: "In Python, what does 'self' refer to?", options: ["The class", "The module", "The current instance", "A global variable"], correctIndex: 2, difficulty: "medium" },
  { id: "k12", question: "Which protocol is used for secure web browsing?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correctIndex: 2, difficulty: "medium" },
  { id: "k13", question: "What is a 'foreign key' in databases?", options: ["Primary identifier", "Link to another table", "Encrypted key", "Index column"], correctIndex: 1, difficulty: "medium" },
  { id: "k14", question: "What does DNS resolve?", options: ["IP to MAC", "Domain to IP", "URL to FTP", "Port to IP"], correctIndex: 1, difficulty: "medium" },
  { id: "k15", question: "Which sorting algorithm has worst-case O(n log n)?", options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"], correctIndex: 2, difficulty: "medium" }
];

const KBC_LADDER = [
  { level: 1, amount: "1,000 Coins", safe: false },
  { level: 2, amount: "2,000 Coins", safe: false },
  { level: 3, amount: "3,000 Coins", safe: false },
  { level: 4, amount: "5,000 Coins", safe: false },
  { level: 5, amount: "10K Coins", safe: true },
  { level: 6, amount: "20K Coins", safe: false },
  { level: 7, amount: "40K Coins", safe: false },
  { level: 8, amount: "80K Coins", safe: false },
  { level: 9, amount: "1.6L Coins", safe: false },
  { level: 10, amount: "3.2L Coins", safe: true },
  { level: 11, amount: "6.4L Coins", safe: false },
  { level: 12, amount: "12.5L Coins", safe: false },
  { level: 13, amount: "25L Coins", safe: false },
  { level: 14, amount: "50L Coins", safe: false },
  { level: 15, amount: "1 Crore Coins", safe: true }
];

// --- Static Leaderboard List matching APK ---
const STATIC_STUDENTS = [
  { id: "f1", name: "Aarav M.", avatar: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", score: 1280, streak: 7, rank: 1, quizAvg: 92, online: true },
  { id: "f2", name: "Sneha R.", avatar: "https://images.unsplash.com/photo-1680983387172-aedb346ba443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", score: 1150, streak: 5, rank: 2, quizAvg: 88, online: false },
  { id: "f3", name: "Rohan P.", avatar: "https://images.unsplash.com/photo-1664845780736-88dc71de5be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", score: 980, streak: 3, rank: 4, quizAvg: 82, online: true },
  { id: "f4", name: "Priya K.", avatar: "https://images.unsplash.com/photo-1676253135268-2bf3095dfcc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", score: 870, streak: 2, rank: 5, quizAvg: 78, online: false },
  { id: "f5", name: "Vikram S.", avatar: "https://images.unsplash.com/photo-1611181355758-089959e2cfb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150", score: 760, streak: 1, rank: 6, quizAvg: 74, online: true }
];

// Ludo board paths
const LUDO_PATH = [
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0], [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6],
  [0, 6], [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12],
  [6, 13], [6, 14], [7, 14], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8],
  [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6]
];
const LUDO_PLAYABLE_TILES = LUDO_PATH.slice(0, LUDO_PATH.length - 1);
const LUDO_TILES_COUNT = LUDO_PLAYABLE_TILES.length;
const LUDO_SAFE_TILES = [0, 8, 13, 21, 26, 34, 39, 47];
const LUDO_PLAYER_START = 0;
const LUDO_AI_START = 26;
const LUDO_PLAYER_HOME_PATH = [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]];
const LUDO_AI_HOME_PATH = [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]];
const LUDO_MAX_STEPS = LUDO_TILES_COUNT + 5;

// --- Subcomponents ---

// Daily Limit Indicator
function LimitIndicator({ remaining, gameName }: { remaining: number; gameName: string }) {
  if (remaining >= DAILY_LIMIT) return null;
  return (
    <p className="text-right text-gray-400 text-[10px] font-semibold tracking-wide mb-1 px-1">
      {remaining} of {DAILY_LIMIT} plays remaining today
    </p>
  );
}

// Limit Reached Screen
function LimitReachedView({ gameName }: { gameName: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-14 text-center bg-white rounded-3xl border border-slate-100 shadow-sm px-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-rose-500 animate-pulse" />
      </div>
      <h3 className="text-slate-800 text-[16px] font-bold mb-1">Daily Limit Reached</h3>
      <p className="text-slate-400 text-xs leading-normal max-w-[240px]">
        You've completed your daily practice sessions for <strong className="text-slate-600">{gameName}</strong>. Come back tomorrow!
      </p>
    </motion.div>
  );
}

// Coin SVG
export function CustomCoin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="9" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="1.2" />
      <text x="10" y="14.5" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="800">C</text>
      <defs>
        <linearGradient id="coinGrad" x1="3" y1="3" x2="17" y2="17">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- Main Container Component ---
export function StudentGames({ userName, userCoins, onCoinsEarned, onBack, onPlayComplete }: GameProps) {
  const [activeTab, setActiveTab] = useState<GameType>("snakes");
  const [dailyPlays, setDailyPlays] = useState<Record<string, number>>({ snakes: 0, ludo: 0, kbc: 0 });

  // Load daily plays on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const stored = localStorage.getItem(STORAGE_DAILY_PLAYS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setDailyPlays({
            snakes: parsed.snakes || 0,
            ludo: parsed.ludo || 0,
            kbc: parsed.kbc || 0
          });
        } else {
          // New day, reset
          localStorage.setItem(STORAGE_DAILY_PLAYS, JSON.stringify({ date: today, snakes: 0, ludo: 0, kbc: 0 }));
        }
      } else {
        localStorage.setItem(STORAGE_DAILY_PLAYS, JSON.stringify({ date: today, snakes: 0, ludo: 0, kbc: 0 }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const recordPlay = (game: "snakes" | "ludo" | "kbc", score: number = 100, coinsEarned: number = 50) => {
    const today = new Date().toISOString().split("T")[0];
    const newPlays = { ...dailyPlays, [game]: dailyPlays[game] + 1 };
    setDailyPlays(newPlays);
    try {
      localStorage.setItem(STORAGE_DAILY_PLAYS, JSON.stringify({ date: today, ...newPlays }));
    } catch (e) {}

    if (onPlayComplete) {
      onPlayComplete(game, score, coinsEarned);
    }
  };

  const resetTestingLimits = () => {
    const today = new Date().toISOString().split("T")[0];
    const reset = { snakes: 0, ludo: 0, kbc: 0 };
    setDailyPlays(reset);
    localStorage.setItem(STORAGE_DAILY_PLAYS, JSON.stringify({ date: today, ...reset }));
  };

  const getRemainingPlays = (game: "snakes" | "ludo" | "kbc") => {
    return Math.max(0, DAILY_LIMIT - dailyPlays[game]);
  };

  const firstLetter = (userName.split(" ")[0] || "Y")[0].toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header Panel */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-slate-800 text-[16px] font-bold">Learning Arena</h2>
            <p className="text-slate-400 text-xs font-semibold">Interactive Education Games</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1.5 shadow-sm">
            <CustomCoin className="w-4 h-4" />
            <span className="text-amber-700 text-xs font-bold tabular-nums">{userCoins}</span>
          </div>
        </div>

        {/* Reset Trigger for Testing */}
        <div className="flex justify-between items-center px-1">
          <button
            onClick={resetTestingLimits}
            className="text-[10px] text-rose-500 font-semibold underline underline-offset-2 hover:text-rose-600 transition-colors"
          >
            🔄 Reset Daily Limits (Dev Testing)
          </button>
        </div>

        {/* Game Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1.5 mt-3">
          {(["snakes", "ludo", "kbc", "leaderboard"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const isLimitReached = tab !== "leaderboard" && getRemainingPlays(tab) === 0;
            
            const label = tab === "snakes" ? "S&L" : tab === "ludo" ? "Ludo" : tab === "kbc" ? "KBC" : "Board";
            const icon =
              tab === "snakes" ? (
                <Gamepad2 className="w-3.5 h-3.5" />
              ) : tab === "ludo" ? (
                <Dices className="w-3.5 h-3.5" />
              ) : tab === "kbc" ? (
                <Trophy className="w-3.5 h-3.5" />
              ) : (
                <Award className="w-3.5 h-3.5" />
              );

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center gap-1.5 ${
                  isActive
                    ? "bg-white text-slate-800 shadow-sm"
                    : isLimitReached
                    ? "text-slate-300"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {icon}
                <span>{label}</span>
                {isLimitReached && <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Screen Render */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "snakes" && (
            <motion.div key="snakes-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <LimitIndicator remaining={getRemainingPlays("snakes")} gameName="Snake & Ladder" />
              {getRemainingPlays("snakes") > 0 ? (
                <SnakesGame
                  userName={userName}
                  userCoins={userCoins}
                  onCoinsEarned={onCoinsEarned}
                  onPlayComplete={(score, coins) => recordPlay("snakes", score, coins)}
                  firstLetter={firstLetter}
                />
              ) : (
                <LimitReachedView gameName="Snake & Ladder" />
              )}
            </motion.div>
          )}

          {activeTab === "ludo" && (
            <motion.div key="ludo-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <LimitIndicator remaining={getRemainingPlays("ludo")} gameName="Ludo Quiz" />
              {getRemainingPlays("ludo") > 0 ? (
                <LudoGame
                  userName={userName}
                  userCoins={userCoins}
                  onCoinsEarned={onCoinsEarned}
                  onPlayComplete={(score, coins) => recordPlay("ludo", score, coins)}
                  firstLetter={firstLetter}
                />
              ) : (
                <LimitReachedView gameName="Ludo Quiz" />
              )}
            </motion.div>
          )}

          {activeTab === "kbc" && (
            <motion.div key="kbc-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <LimitIndicator remaining={getRemainingPlays("kbc")} gameName="KBC Tech Edition" />
              {getRemainingPlays("kbc") > 0 ? (
                <KbcGame
                  userName={userName}
                  userCoins={userCoins}
                  onCoinsEarned={onCoinsEarned}
                  onPlayComplete={(score, coins) => recordPlay("kbc", score, coins)}
                />
              ) : (
                <LimitReachedView gameName="KBC Tech Edition" />
              )}
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div key="leaderboard-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <LeaderboardView userName={userName} userCoins={userCoins} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// 1. SNAKES & LADDERS QUIZ GAMEPLAY
// ==========================================
interface SubGameProps {
  userName: string;
  userCoins: number;
  onCoinsEarned: (coins: number) => void;
  onPlayComplete: (score: number, coins: number) => void;
  firstLetter: string;
}

function SnakesGame({ userName, userCoins, onCoinsEarned, onPlayComplete, firstLetter }: SubGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [aiPosition, setAiPosition] = useState(0);
  const [activeTurn, setActiveTurn] = useState<"player" | "opponent">("player");
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null);
  const [statusText, setStatusText] = useState("Your turn! Roll & Answer to move.");
  const [statusType, setStatusType] = useState<"info" | "win" | "lose" | "wait" | "snake" | "ladder">("info");
  const [opponent, setOpponent] = useState<any>(STATIC_STUDENTS[0]);
  const [questionPool, setQuestionPool] = useState<Set<string>>(new Set());
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [slideAnimation, setSlideAnimation] = useState<{ type: "snake" | "ladder"; from: number; to: number } | null>(null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [tempDiceRoll, setTempDiceRoll] = useState(0);
  const [selectedRoll, setSelectedRoll] = useState(0);
  const [canRoll, setCanRoll] = useState(false);

  // Initialize game
  const startGame = () => {
    setIsPlaying(true);
    setPlayerPosition(0);
    setAiPosition(0);
    setActiveTurn("player");
    setIsGameOver(false);
    setWinner(null);
    setStatusText("Your turn! Answer the quiz to roll.");
    setStatusType("info");
    setQuestionPool(new Set());
    setCoinsEarned(0);
    setTurnCount(0);
    setSlideAnimation(null);
    setCanRoll(false);
    setOpponent(STATIC_STUDENTS[Math.floor(Math.random() * STATIC_STUDENTS.length)]);
  };

  const selectRandomQuestion = useCallback(() => {
    const unasked = SNAKES_QUESTIONS.filter((q) => !questionPool.has(q.id));
    const pool = unasked.length > 0 ? unasked : SNAKES_QUESTIONS;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setQuestionPool((prev) => new Set(prev).add(picked.id));
    return picked;
  }, [questionPool]);

  // Check for snakes or ladders landing
  const checkGridEffects = useCallback((pos: number) => {
    if (SNAKES[pos]) {
      return {
        finalPos: SNAKES[pos],
        event: `Slipped down a snake to ${SNAKES[pos]}!`,
        type: "snake" as const
      };
    } else if (LADDERS[pos]) {
      return {
        finalPos: LADDERS[pos],
        event: `Climbed up a ladder to ${LADDERS[pos]}!`,
        type: "ladder" as const
      };
    }
    return { finalPos: pos, event: "", type: null };
  }, []);

  const triggerOpponentTurn = () => {
    setIsMoving(true);
    setStatusText(`${opponent.name} is thinking...`);
    setStatusType("wait");

    const correct = Math.random() > 0.45; // AI accuracy
    const roll = correct ? Math.floor(Math.random() * 3) + 1 : 0;

    setTimeout(() => {
      if (correct) {
        setAiPosition((prev) => {
          let next = Math.min(prev + roll, MAX_BOARD_POSITION);
          const effects = checkGridEffects(next);
          next = effects.finalPos;

          if (next >= MAX_BOARD_POSITION) {
            setIsGameOver(true);
            setWinner("opponent");
            setStatusText(`${opponent.name} reached the finish line! Opponent wins.`);
            setStatusType("lose");
            setIsMoving(false);
            onPlayComplete(0, coinsEarned);
            return MAX_BOARD_POSITION;
          }

          setStatusText(
            effects.type
              ? `${opponent.name}: ${effects.event}`
              : `${opponent.name} answered correctly & moved ${roll} step${roll > 1 ? "s" : ""} to position ${next}`
          );
          setStatusType(effects.type || "info");
          return next;
        });
      } else {
        setStatusText(`${opponent.name} answered wrong! Staying at position ${aiPosition}.`);
        setStatusType("info");
      }

      // Switch turn back to player
      setTimeout(() => {
        setIsMoving(false);
        setActiveTurn("player");
        setStatusText("Your turn! Answer the question to move.");
        setStatusType("info");
      }, 1500);
    }, 1500);
  };

  const handleOpenQuestionDialog = () => {
    if (activeTurn !== "player" || isMoving || showQuestion || isGameOver) return;
    const q = selectRandomQuestion();
    setCurrentQuestion(q);
    setShowQuestion(true);
    setSelectedOption(null);
    setAnswerStatus(null);
    setCanRoll(false);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    if (answerStatus || !currentQuestion) return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setAnswerStatus(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      onCoinsEarned(currentQuestion.coins);
      setCoinsEarned((prev) => prev + currentQuestion.coins);
      setCanRoll(true);
    } else {
      setTimeout(() => {
        setShowQuestion(false);
        setIsMoving(true);
        setTurnCount((prev) => prev + 1);
        setStatusText("Wrong answer — you stay at position " + playerPosition);
        setStatusType("info");
        setTimeout(() => {
          setIsMoving(false);
          setActiveTurn("opponent");
          triggerOpponentTurn();
        }, 1200);
      }, 1400);
    }
  };

  const rollDiceAndMove = () => {
    if (!canRoll || isDiceRolling) return;
    setIsDiceRolling(true);

    let rollsCount = 0;
    const interval = setInterval(() => {
      setTempDiceRoll(Math.floor(Math.random() * 3) + 1);
      rollsCount++;
      if (rollsCount >= 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 3) + 1;
        setTempDiceRoll(finalRoll);
        setSelectedRoll(finalRoll);
        setIsDiceRolling(false);
        setCanRoll(false);

        // Advance player on grid
        setTimeout(() => {
          setShowQuestion(false);
          setIsMoving(true);
          setTurnCount((prev) => prev + 1);

          const next = Math.min(playerPosition + finalRoll, MAX_BOARD_POSITION);
          const effects = checkGridEffects(next);

          setPlayerPosition(next);

          if (effects.type) {
            setTimeout(() => {
              setSlideAnimation({ type: effects.type!, from: next, to: effects.finalPos });
              setTimeout(() => {
                setPlayerPosition(effects.finalPos);
                setSlideAnimation(null);

                if (effects.finalPos >= MAX_BOARD_POSITION) {
                  setIsGameOver(true);
                  setWinner("player");
                  onCoinsEarned(50);
                  setCoinsEarned((prev) => prev + 50);
                  setStatusText("You reached the finish! You Win 🏆");
                  setStatusType("win");
                  setIsMoving(false);
                  onPlayComplete(Math.max(10, 100 - turnCount), coinsEarned + 50);
                } else {
                  setStatusText(effects.event);
                  setStatusType(effects.type!);
                  setTimeout(() => {
                    setActiveTurn("opponent");
                    triggerOpponentTurn();
                  }, 1200);
                }
              }, 1100);
            }, 500);
          } else {
            if (next >= MAX_BOARD_POSITION) {
              setIsGameOver(true);
              setWinner("player");
              onCoinsEarned(50);
              setCoinsEarned((prev) => prev + 50);
              setStatusText("You reached the finish! You Win 🏆");
              setStatusType("win");
              setIsMoving(false);
              onPlayComplete(Math.max(10, 100 - turnCount), coinsEarned + 50);
            } else {
              setStatusText(`Rolled ${finalRoll}! Moved to position ${next}.`);
              setStatusType("info");
              setTimeout(() => {
                setActiveTurn("opponent");
                triggerOpponentTurn();
              }, 1200);
            }
          }
        }, 800);
      }
    }, 80);
  };

  const handleExit = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setWinner(null);
  };

  // Pre-generate grid cells
  const gridCells = [];
  for (let pos = 1; pos <= MAX_BOARD_POSITION; pos++) {
    const coords = getBoardCoordinates(pos);
    gridCells.push({ num: pos, ...coords });
  }

  // Row arrays
  const rowCells: Record<number, any[]> = {};
  for (let i = 0; i < BOARD_ROWS; i++) rowCells[i] = [];
  gridCells.forEach((cell) => {
    rowCells[cell.row].push(cell);
  });
  Object.keys(rowCells).forEach((k: any) => {
    rowCells[k].sort((a, b) => a.col - b.col);
  });

  if (!isPlaying) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="bg-white rounded-3xl p-6 w-full mb-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-xl">
              🎲
            </div>
            <div>
              <h3 className="text-slate-800 text-[16px] font-bold">Snake & Ladder Quiz</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">Combine intelligence & luck to win!</p>
            </div>
          </div>

          {/* Quick Rules */}
          <div className="bg-slate-50 rounded-2xl p-4.5 space-y-3 mb-5 border border-slate-100/50">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">✅</span>
              <p className="text-slate-600 text-xs font-medium">Answer correctly to roll a dice (1–3 steps)</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">❌</span>
              <p className="text-slate-600 text-xs font-medium">Answer wrong and stay put this turn</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🪜</span>
              <p className="text-slate-600 text-xs font-medium">Ladders climb you upwards to advanced positions</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🐍</span>
              <p className="text-slate-600 text-xs font-medium">Snakes slide you back down to lower positions</p>
            </div>
          </div>

          {/* Player vs AI banner */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {firstLetter}
                </div>
                <p className="text-slate-600 text-[10px] font-bold">You</p>
              </div>
              <div className="bg-slate-800 text-white text-[10px] px-3 py-1 rounded-full font-bold">VS</div>
              <div className="flex flex-col items-center gap-1">
                <img src={opponent.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-slate-200" />
                <p className="text-slate-600 text-[10px] font-bold">{opponent.name}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={startGame}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
          >
            Play Snake & Ladder
          </Button>
        </div>
      </motion.div>
    );
  }

  const pPercent = Math.round((playerPosition / MAX_BOARD_POSITION) * 100);
  const aiPercent = Math.round((aiPosition / MAX_BOARD_POSITION) * 100);
  const isPlayerTurnActive = activeTurn === "player" && !isMoving && !isGameOver;

  return (
    <div className="flex flex-col gap-3 font-sans pb-10">
      {/* Race Progress Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Player Progress */}
          <div className={`flex-1 flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all ${activeTurn === "player" && !isGameOver ? "bg-blue-50/50 ring-1 ring-blue-100" : ""}`}>
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{firstLetter}</div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-[10px] font-bold">You</p>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-500 rounded-full" animate={{ width: `${pPercent}%` }} transition={{ type: "spring", damping: 15 }} />
                </div>
                <span className="text-blue-500 text-[9px] font-bold">{playerPosition}</span>
              </div>
            </div>
          </div>

          <span className="text-slate-300 text-[10px] font-bold">VS</span>

          {/* AI Progress */}
          <div className={`flex-1 flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all flex-row-reverse ${activeTurn === "opponent" && !isGameOver ? "bg-rose-50/50 ring-1 ring-rose-100" : ""}`}>
            <img src={opponent.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-rose-100" />
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-[10px] font-bold text-right">{opponent.name.split(" ")[0]}</p>
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden rotate-180">
                  <motion.div className="h-full bg-rose-500 rounded-full" animate={{ width: `${aiPercent}%` }} transition={{ type: "spring", damping: 15 }} />
                </div>
                <span className="text-rose-500 text-[9px] font-bold">{aiPosition}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board Layout */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)` }}>
          {Object.keys(rowCells)
            .reverse()
            .map((rKey: any) =>
              rowCells[rKey].map(({ num }) => {
                const isPlayerHere = num === playerPosition;
                const isAiHere = num === aiPosition;
                const isBothHere = isPlayerHere && isAiHere;
                const hasSnake = !!SNAKES[num];
                const hasLadder = !!LADDERS[num];
                const isFinish = num === MAX_BOARD_POSITION;
                const isStart = num === 1;

                let cellBg = "bg-slate-50 border-slate-100/50";
                if (isFinish) cellBg = "bg-amber-50 border-amber-200 text-amber-600";
                else if (hasSnake) cellBg = "bg-rose-50 border-rose-200 text-rose-500";
                else if (hasLadder) cellBg = "bg-emerald-50 border-emerald-200 text-emerald-600";
                else if (isStart) cellBg = "bg-blue-50 border-blue-200 text-blue-500";

                return (
                  <div key={num} className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${cellBg}`}>
                    <span className="absolute top-1 left-1.5 text-[8px] font-extrabold text-slate-300 leading-none">{num}</span>
                    {!isPlayerHere && !isAiHere && (
                      <span className="text-sm">
                        {isFinish ? "🏆" : hasSnake ? "🐍" : hasLadder ? "🪜" : ""}
                      </span>
                    )}

                    {/* Render Tokens */}
                    {isBothHere ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex -space-x-2">
                          <motion.div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-extrabold ring-2 ring-white shadow-md z-10" layoutId="player-token">
                            {firstLetter}
                          </motion.div>
                          <motion.div className="w-5 h-5 rounded-full overflow-hidden ring-2 ring-white shadow-md z-10" layoutId="opponent-token">
                            <img src={opponent.avatar} alt="" className="w-full h-full object-cover" />
                          </motion.div>
                        </div>
                      </div>
                    ) : isPlayerHere ? (
                      <motion.div className="absolute inset-0 flex items-center justify-center z-10" layoutId="player-token">
                        <motion.div className="w-6.5 h-6.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-extrabold ring-2 ring-white shadow-md" />
                      </motion.div>
                    ) : isAiHere ? (
                      <motion.div className="absolute inset-0 flex items-center justify-center z-10" layoutId="opponent-token">
                        <div className="w-6.5 h-6.5 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                          <img src={opponent.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                );
              })
            )}
        </div>

        {/* Board Slide Actions Overlay */}
        <AnimatePresence>
          {slideAnimation && (
            <motion.div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center pointer-events-none z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-3xl shadow-xl border ${slideAnimation.type === "snake" ? "bg-rose-500 border-rose-400 text-white" : "bg-emerald-500 border-emerald-400 text-white"}`}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
              >
                <span className="text-3xl">{slideAnimation.type === "snake" ? "🐍" : "🪜"}</span>
                <p className="text-xs font-bold">{slideAnimation.type === "snake" ? "Snake Attack!" : "Ladder Climb!"}</p>
                <p className="text-[10px] font-medium opacity-90">
                  {slideAnimation.from} ➔ {slideAnimation.to}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Status Log Box */}
      <div className={`rounded-xl px-3.5 py-3 text-xs font-semibold flex items-center gap-2 justify-center shadow-sm border ${
        isGameOver
          ? winner === "player"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-rose-50 text-rose-600 border-rose-100"
          : statusType === "snake"
          ? "bg-rose-50 text-rose-600 border-rose-100"
          : statusType === "ladder"
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : statusType === "wait"
          ? "bg-slate-50 text-slate-400 border-slate-100"
          : "bg-blue-50 text-blue-600 border-blue-100"
      }`}>
        <span className="text-sm shrink-0">{isGameOver ? (winner === "player" ? "🎉" : "😔") : statusType === "wait" ? "⏳" : "💡"}</span>
        <span>{statusText}</span>
      </div>

      {/* Gameplay Trigger Button */}
      {!isGameOver && (
        <Button
          onClick={handleOpenQuestionDialog}
          disabled={!isPlayerTurnActive}
          className={`w-full py-4 h-12 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all ${
            isPlayerTurnActive
              ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isPlayerTurnActive ? "🎲 Answer & Roll" : activeTurn === "opponent" ? `${opponent.name}'s turn...` : "Moving token..."}
        </Button>
      )}

      {/* End Session Stats */}
      {isGameOver && (
        <motion.div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-4">
            <span className="text-4xl block mb-2">{winner === "player" ? "🏆" : "💪"}</span>
            <h4 className="text-slate-800 text-[16px] font-black">{winner === "player" ? "Victory!" : `${opponent.name} won!`}</h4>
            <p className="text-slate-400 text-xs font-medium mt-0.5">
              {winner === "player" ? `Finished in ${turnCount} turns! +50 bonus coins earned.` : "A solid effort! Reset limits & try again."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-slate-800 font-bold text-xs">{turnCount}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Turns</p>
            </div>
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-amber-600 font-extrabold text-xs">+{coinsEarned}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Coins</p>
            </div>
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-slate-800 font-bold text-xs">{playerPosition}/30</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Final</p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Button onClick={handleExit} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl h-11 text-xs">Exit</Button>
            <Button onClick={startGame} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-11 text-xs flex items-center justify-center gap-1">🎲 Play Again</Button>
          </div>
        </motion.div>
      )}

      {/* QUESTION DIALOG DRAWER */}
      <AnimatePresence>
        {showQuestion && currentQuestion && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div className="absolute inset-0 bg-slate-900/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !answerStatus && setShowQuestion(false)} />
            <motion.div
              className="relative w-full max-w-md bg-white rounded-t-3xl p-5 pb-8 shadow-2xl z-10 max-h-[85%] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎲</span>
                  <p className="text-slate-800 text-xs font-extrabold">Answer correctly to roll!</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-bold">
                  <span>Pos {playerPosition}</span>
                </div>
              </div>

              {/* Module Banner */}
              <div className="flex items-center gap-2 mb-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">P</div>
                <p className="text-slate-500 text-xs font-bold">Python Basics Practice</p>
                <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  currentQuestion.difficulty === "easy" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}>
                  +{currentQuestion.coins} coins
                </span>
              </div>

              <p className="text-slate-800 text-[14px] font-bold leading-relaxed mb-4">{currentQuestion.question}</p>

              {/* Options Grid */}
              <div className="space-y-2">
                {currentQuestion.options.map((opt: string, idx: number) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctIndex;

                  let optStyle = "bg-slate-50 border-slate-100 text-slate-700";
                  if (answerStatus) {
                    if (isSelected && answerStatus === "correct") optStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold";
                    else if (isSelected && answerStatus === "wrong") optStyle = "bg-rose-50 border-rose-500 text-rose-700 font-semibold";
                    else if (isCorrectAnswer) optStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold";
                  } else if (isSelected) {
                    optStyle = "bg-slate-900 border-slate-900 text-white";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSubmit(idx)}
                      disabled={!!answerStatus}
                      className={`w-full px-4 py-3 rounded-xl border text-left text-xs font-medium transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center border text-[9px] font-bold text-slate-400 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dice Roll section if correct */}
              <AnimatePresence>
                {answerStatus === "wrong" && (
                  <motion.div className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                    <span>😔</span> Wrong — no dice roll this turn!
                  </motion.div>
                )}

                {answerStatus === "correct" && !isMoving && (
                  <motion.div className="mt-5 space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-center text-emerald-600 text-xs font-extrabold">✅ Correct Answer! Lock in your dice roll below.</p>
                    <Button
                      onClick={rollDiceAndMove}
                      disabled={isDiceRolling}
                      className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
                    >
                      <motion.span className="text-lg" animate={isDiceRolling ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}>🎲</motion.span>
                      {isDiceRolling ? "Rolling..." : "Roll Dice"}
                    </Button>

                    {isDiceRolling && tempDiceRoll > 0 && (
                      <motion.div className="text-center mt-2" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                        <span className="text-4xl">
                          {["⚀", "⚁", "⚂"][tempDiceRoll - 1]}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {answerStatus === "correct" && selectedRoll > 0 && !isDiceRolling && (
                  <motion.div className="mt-4 flex flex-col items-center gap-1.5 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <span className="text-4xl">➔ {["⚀", "⚁", "⚂"][selectedRoll - 1]}</span>
                    <p className="text-xs font-bold">You rolled {selectedRoll}! Moving forward {selectedRoll} step{selectedRoll > 1 ? "s" : ""}.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 2. LUDO QUIZ MINI-GAME
// ==========================================
function LudoGame({ userName, userCoins, onCoinsEarned, onPlayComplete, firstLetter }: SubGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [aiPosition, setAiPosition] = useState(0);
  const [activeTurn, setActiveTurn] = useState<"player" | "ai">("player");
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(LUDO_QUESTIONS[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceVal, setDiceVal] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);
  const [logText, setLogText] = useState("Your turn! Answer a question to roll the dice.");
  const [showSixCelebration, setShowSixCelebration] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [opponent, setOpponent] = useState<any>(STATIC_STUDENTS[1]);
  const [questionPool, setQuestionPool] = useState<Set<string>>(new Set());

  const startGame = () => {
    setIsPlaying(true);
    setPlayerPosition(0);
    setAiPosition(0);
    setActiveTurn("player");
    setLogText("Your turn! Answer a question to roll the dice.");
    setIsGameOver(false);
    setWinner(null);
    setCoinsEarned(0);
    setTurnCount(0);
    setQuestionPool(new Set());
    setShowSixCelebration(false);
    setOpponent(STATIC_STUDENTS[Math.floor(Math.random() * STATIC_STUDENTS.length)]);
  };

  const selectRandomQuestion = useCallback(() => {
    const unasked = LUDO_QUESTIONS.filter((q) => !questionPool.has(q.id));
    const pool = unasked.length > 0 ? unasked : LUDO_QUESTIONS;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setQuestionPool((prev) => new Set(prev).add(picked.id));
    return picked;
  }, [questionPool]);

  const getCoordinates = (step: number, isPlayer: boolean) => {
    if (step <= 0) return null;
    const homePath = isPlayer ? LUDO_PLAYER_HOME_PATH : LUDO_AI_HOME_PATH;
    const baseOffset = isPlayer ? LUDO_PLAYER_START : LUDO_AI_START;

    if (step <= LUDO_TILES_COUNT) {
      const idx = (baseOffset + step - 1) % LUDO_TILES_COUNT;
      return LUDO_PLAYABLE_TILES[idx];
    }
    const homeIdx = step - LUDO_TILES_COUNT - 1;
    return homeIdx < homePath.length ? homePath[homeIdx] : [7, 7];
  };

  const handleOpenQuestion = () => {
    if (activeTurn !== "player" || isRolling || showQuestion || isGameOver) return;
    const q = selectRandomQuestion();
    setCurrentQuestion(q);
    setShowQuestion(true);
    setSelectedOption(null);
    setAnswerStatus(null);
    setDiceVal(0);
  };

  const handleAnswerOptionClick = (optionIdx: number) => {
    if (answerStatus) return;
    setSelectedOption(optionIdx);
    const correct = optionIdx === currentQuestion.correctIndex;
    setAnswerStatus(correct ? "correct" : "wrong");

    if (correct) {
      onCoinsEarned(currentQuestion.coins);
      setCoinsEarned((prev) => prev + currentQuestion.coins);
    } else {
      setTimeout(() => {
        setShowQuestion(false);
        setActiveTurn("ai");
        setLogText("Wrong answer — turn skipped!");
        triggerAiTurn();
      }, 1400);
    }
  };

  const handleRollDice = () => {
    if (answerStatus !== "correct" || isRolling) return;
    setIsRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setDiceVal(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceVal(finalRoll);
        setIsRolling(false);

        setTimeout(() => {
          setShowQuestion(false);
          setTurnCount((prev) => prev + 1);

          // Ludo logic
          let nextPos = playerPosition + finalRoll;

          // Need a 6 to open
          if (playerPosition === 0 && finalRoll !== 6) {
            setLogText(`Rolled ${finalRoll} — need a 6 to open home base!`);
            setActiveTurn("ai");
            setTimeout(triggerAiTurn, 1000);
            return;
          }

          if (playerPosition === 0 && finalRoll === 6) {
            nextPos = 1;
            setShowSixCelebration(true);
            setTimeout(() => setShowSixCelebration(false), 1400);
          }

          if (nextPos > LUDO_MAX_STEPS) {
            setLogText(`Rolled ${finalRoll} — overshot home! Try again.`);
            setActiveTurn("ai");
            setTimeout(triggerAiTurn, 1000);
            return;
          }

          // Land on opponent -> capture
          if (nextPos > 0 && nextPos <= LUDO_TILES_COUNT) {
            const playerCoords = getCoordinates(nextPos, true);
            const aiCoords = getCoordinates(aiPosition, false);
            if (playerCoords && aiCoords && playerCoords[0] === aiCoords[0] && playerCoords[1] === aiCoords[1]) {
              const safe = LUDO_SAFE_TILES.includes((LUDO_PLAYER_START + nextPos - 1) % LUDO_TILES_COUNT);
              if (!safe) {
                setAiPosition(0);
                setLogText(`Rolled ${finalRoll}! CAPTURED opponent's token! 🎯`);
              }
            }
          }

          setPlayerPosition(nextPos);

          if (nextPos >= LUDO_MAX_STEPS) {
            setIsGameOver(true);
            setWinner("player");
            onCoinsEarned(50);
            setCoinsEarned((prev) => prev + 50);
            setLogText("Congratulations! You won Ludo Quiz! 🏆");
            onPlayComplete(Math.max(10, 100 - turnCount), coinsEarned + 50);
            return;
          }

          if (finalRoll === 6) {
            setShowSixCelebration(true);
            setLogText("Rolled a 6! Extra turn granted!");
            setTimeout(() => {
              setShowSixCelebration(false);
            }, 1200);
          } else {
            setActiveTurn("ai");
            setTimeout(triggerAiTurn, 1000);
          }
        }, 800);
      }
    }, 70);
  };

  const triggerAiTurn = () => {
    setLogText("Opponent is thinking... 🤖");
    setTimeout(() => {
      const correct = Math.random() > 0.4;
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceVal(roll);

      if (!correct) {
        setLogText("Opponent answered wrong — turn skipped! Your turn.");
        setActiveTurn("player");
        return;
      }

      let nextPos = aiPosition + roll;
      if (aiPosition === 0 && roll !== 6) {
        setLogText(`Opponent rolled ${roll} — needs 6 to open.`);
        setActiveTurn("player");
        return;
      }

      if (aiPosition === 0 && roll === 6) {
        nextPos = 1;
      }

      if (nextPos > LUDO_MAX_STEPS) {
        setLogText(`Opponent rolled ${roll} — overshot home.`);
        setActiveTurn("player");
        return;
      }

      // Capture player
      if (nextPos > 0 && nextPos <= LUDO_TILES_COUNT) {
        const aiCoords = getCoordinates(nextPos, false);
        const playerCoords = getCoordinates(playerPosition, true);
        if (aiCoords && playerCoords && aiCoords[0] === playerCoords[0] && aiCoords[1] === playerCoords[1]) {
          const safe = LUDO_SAFE_TILES.includes((LUDO_AI_START + nextPos - 1) % LUDO_TILES_COUNT);
          if (!safe) {
            setPlayerPosition(0);
            setLogText(`Opponent captured your token! 😱`);
          }
        }
      }

      setAiPosition(nextPos);

      if (nextPos >= LUDO_MAX_STEPS) {
        setIsGameOver(true);
        setWinner("ai");
        setLogText("Opponent won! Try again.");
        onPlayComplete(0, coinsEarned);
        return;
      }

      setLogText(`Opponent rolled ${roll}! Moved to position ${nextPos}. Your turn.`);
      setActiveTurn("player");
    }, 1500);
  };

  if (!isPlaying) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="bg-white rounded-3xl p-6 w-full mb-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 text-xl">
              🎲
            </div>
            <div>
              <h3 className="text-slate-800 text-[16px] font-bold">Ludo Quiz Challenge</h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">Roll & race to home before the AI!</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4.5 space-y-3 mb-5 border border-slate-100/50">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🎯</span>
              <p className="text-slate-600 text-xs font-medium">Roll a 6 to release your token from base</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">✅</span>
              <p className="text-slate-600 text-xs font-medium">Correct answer ➔ Roll dice (1–6 steps)</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">❌</span>
              <p className="text-slate-600 text-xs font-medium">Wrong answer ➔ Skip turn completely</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">⭐</span>
              <p className="text-slate-600 text-xs font-medium">Star squares are safe spots from opponent captures</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">💥</span>
              <p className="text-slate-600 text-xs font-medium">Landing exactly on AI's spot captures them home!</p>
            </div>
          </div>

          <Button
            onClick={startGame}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
          >
            Start Ludo Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  const playerCoords = getCoordinates(playerPosition, true);
  const aiCoords = getCoordinates(aiPosition, false);
  const isBothTokenHere = playerCoords && aiCoords && playerCoords[0] === aiCoords[0] && playerCoords[1] === aiCoords[1];

  return (
    <div className="flex flex-col gap-3 font-sans pb-10">
      {/* Mini Scoreboard */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">{firstLetter}</div>
          <div>
            <p className="text-slate-800 font-extrabold text-[10px]">You</p>
            <p className="text-blue-500 text-[9px] font-bold">{playerPosition === 0 ? "In Base" : playerPosition >= LUDO_MAX_STEPS ? "Won" : `Pos ${playerPosition}`}</p>
          </div>
        </div>

        <div className="text-center px-4 font-bold text-slate-400">
          {diceVal > 0 ? (
            <motion.span className="text-3xl text-indigo-600" animate={isRolling ? { rotate: 360, scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
              {["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][diceVal - 1]}
            </motion.span>
          ) : (
            <span className="text-2xl text-slate-300">🎲</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-row-reverse">
          <div className="w-6.5 h-6.5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-rose-100">🤖</div>
          <div className="text-right">
            <p className="text-slate-800 font-extrabold text-[10px]">{opponent.name.split(" ")[0]}</p>
            <p className="text-rose-500 text-[9px] font-bold">{aiPosition === 0 ? "In Base" : aiPosition >= LUDO_MAX_STEPS ? "Won" : `Pos ${aiPosition}`}</p>
          </div>
        </div>
      </div>

      {/* Grid Board Render (15x15) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm relative">
        <div className="grid grid-cols-15 gap-px" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
          {N9.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isPlayerHere = playerCoords && playerCoords[0] === rIdx && playerCoords[1] === cIdx;
              const isAiHere = aiCoords && aiCoords[0] === rIdx && aiCoords[1] === cIdx;
              const isBothHere = isPlayerHere && isAiHere;

              // Find path index for safe spot mapping
              let pathIdx = -1;
              for (let t = 0; t < LUDO_PATH.length; t++) {
                if (LUDO_PATH[t][0] === rIdx && LUDO_PATH[t][1] === cIdx) {
                  pathIdx = t;
                  break;
                }
              }
              const isSafe = pathIdx >= 0 && LUDO_SAFE_TILES.includes(pathIdx);

              // Cell Coloring Matching APK
              let cellBg = "bg-slate-50";
              let cellBorder = "";

              if (cell === "B") cellBg = "bg-blue-100/70";
              else if (cell === "R") cellBg = "bg-rose-100/70";
              else if (cell === "G") cellBg = "bg-emerald-100/70";
              else if (cell === "Y") cellBg = "bg-amber-100/70";
              else if (cell === "C") cellBg = "bg-slate-800";
              else if (cell === "BS") {
                cellBg = "bg-blue-200";
                cellBorder = "border border-blue-300";
              } else if (cell === "RS") {
                cellBg = "bg-rose-200";
                cellBorder = "border border-rose-300";
              } else if (isSafe) {
                cellBg = "bg-yellow-50";
                cellBorder = "border border-yellow-200";
              } else if (cell === "P" || cell === "BH" || cell === "RH") {
                cellBg = "bg-white";
                cellBorder = "border border-slate-200/50";
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`aspect-square flex items-center justify-center relative ${cellBg} ${cellBorder}`}
                  style={{ minWidth: 0 }}
                >
                  {/* Decorative Base Circles */}
                  {cell === "B" && rIdx === 11 && cIdx === 2 && <div className="w-2.5 h-2.5 rounded-full bg-blue-400 opacity-60" />}
                  {cell === "R" && rIdx === 2 && cIdx === 12 && <div className="w-2.5 h-2.5 rounded-full bg-rose-400 opacity-60" />}
                  {cell === "G" && rIdx === 2 && cIdx === 2 && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-60" />}
                  {cell === "Y" && rIdx === 12 && cIdx === 12 && <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-60" />}

                  {isSafe && !isPlayerHere && !isAiHere && <span className="text-[6px] text-yellow-500 font-black">★</span>}
                  {cell === "C" && rIdx === 7 && cIdx === 7 && !isPlayerHere && !isAiHere && <span className="text-[7px]">🏠</span>}

                  {/* Token Overlay */}
                  {isBothHere ? (
                    <div className="flex gap-px absolute z-10 scale-[0.85]">
                      <div className="w-2 h-2 rounded-full bg-blue-500 border border-white" />
                      <div className="w-2 h-2 rounded-full bg-rose-500 border border-white" />
                    </div>
                  ) : isPlayerHere ? (
                    <motion.div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[5px] font-extrabold ring-1 ring-white shadow-md z-10" layoutId="ludo-p">
                      {firstLetter}
                    </motion.div>
                  ) : isAiHere ? (
                    <motion.div className="w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[5px] font-extrabold ring-1 ring-white shadow-md z-10" layoutId="ludo-a">
                      🤖
                    </motion.div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Safe Bases Status Alerts */}
        {playerPosition === 0 && (
          <div className="flex items-center gap-1.5 mt-2 px-1 text-[9px] text-blue-500 font-bold">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[5px] font-extrabold">{firstLetter}</div>
            <span>Your token is at home — roll a 6 to open!</span>
          </div>
        )}
        {aiPosition === 0 && (
          <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-rose-400 font-bold">
            <div className="w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center text-white text-[5px] font-extrabold">🤖</div>
            <span>Opponent token is in base.</span>
          </div>
        )}
      </div>

      {/* Ludo Celebrations */}
      <AnimatePresence>
        {showSixCelebration && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-indigo-500 text-white px-5 py-3 rounded-2xl shadow-xl text-center border border-indigo-400" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <span className="text-4xl block mb-1">🎯</span>
              <p className="text-xs font-black">Rolled a 6!</p>
              <p className="text-[10px] text-white/80 font-bold">{playerPosition === 0 ? "Releasing token!" : "Bonus Turn Granted!"}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Feed Status */}
      <div className="rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold bg-slate-100 text-slate-600 shadow-sm border border-slate-200/50">
        <span className="text-sm shrink-0">{activeTurn === "ai" ? "⏳" : "💡"}</span>
        <span>{logText}</span>
      </div>

      {/* Play Controls */}
      {!isGameOver && (
        <Button
          onClick={handleOpenQuestion}
          disabled={activeTurn !== "player" || isRolling}
          className={`w-full py-4 h-12 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all ${
            activeTurn === "player"
              ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          🎲 {activeTurn === "player" ? "Answer & Roll" : "Waiting for Opponent..."}
        </Button>
      )}

      {/* Game Over Banner */}
      {isGameOver && (
        <motion.div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm text-center" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-4xl block mb-2">{winner === "player" ? "🏆" : "💪"}</span>
          <h4 className="text-slate-800 text-[16px] font-black">{winner === "player" ? "Victory!" : "Opponent won!"}</h4>
          <p className="text-slate-400 text-xs font-medium mt-1">
            {winner === "player" ? `Completed in ${turnCount} turns! +50 bonus coins earned.` : "Try again to master Ludo!"}
          </p>

          <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-slate-800 font-bold text-xs">{turnCount}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Turns</p>
            </div>
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-amber-600 font-extrabold text-xs">+{coinsEarned}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Coins</p>
            </div>
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-slate-800 font-bold text-xs">{playerPosition}/35</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Progress</p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Button onClick={startGame} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold h-11 rounded-xl text-xs flex items-center justify-center gap-1">🎲 Play Again</Button>
          </div>
        </motion.div>
      )}

      {/* QUESTION DIALOG MODAL */}
      <AnimatePresence>
        {showQuestion && currentQuestion && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div className="absolute inset-0 bg-slate-900/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !answerStatus && setShowQuestion(false)} />
            <motion.div
              className="relative w-full max-w-md bg-white rounded-t-3xl p-5 pb-8 shadow-2xl z-10 max-h-[85%] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

              <p className="text-slate-800 text-[14px] font-bold leading-relaxed mb-4">{currentQuestion.question}</p>

              <div className="space-y-2">
                {currentQuestion.options.map((opt: string, idx: number) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let optStyle = "bg-slate-50 border-slate-100 text-slate-700";
                  if (answerStatus) {
                    if (isSelected && answerStatus === "correct") optStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold";
                    else if (isSelected && answerStatus === "wrong") optStyle = "bg-rose-50 border-rose-500 text-rose-700 font-semibold";
                    else if (isCorrect) optStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold";
                  } else if (isSelected) {
                    optStyle = "bg-slate-900 border-slate-900 text-white";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerOptionClick(idx)}
                      disabled={!!answerStatus}
                      className={`w-full px-4 py-3 rounded-xl border text-left text-xs font-medium transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center border text-[9px] font-bold text-slate-400 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Rolling Controls */}
              <AnimatePresence>
                {answerStatus === "wrong" && (
                  <motion.div className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                    😔 Wrong answer — turn skipped!
                  </motion.div>
                )}

                {answerStatus === "correct" && (
                  <motion.div className="mt-5 space-y-3 animate-slideup" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-center text-emerald-600 text-xs font-extrabold">✅ Correct Answer! Lock in your dice roll below.</p>
                    <Button
                      onClick={handleRollDice}
                      disabled={isRolling}
                      className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
                    >
                      <motion.span className="text-lg" animate={isRolling ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}>🎲</motion.span>
                      {isRolling ? "Rolling..." : "Roll Dice"}
                    </Button>

                    {isRolling && diceVal > 0 && (
                      <motion.div className="text-center mt-2" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                        <span className="text-4xl">
                          {["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][diceVal - 1]}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 3. KAUN BANEGA CROREPATHI (KBC) TECH GAME
// ==========================================
function KbcGame({ userName, userCoins, onCoinsEarned, onPlayComplete }: Omit<SubGameProps, "firstLetter">) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionsList, setShowQuestionsList] = useState(false);
  const [lockedOption, setLockedOption] = useState<number | null>(null);
  const [revealingStatus, setRevealingStatus] = useState<"correct" | "wrong" | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameResultTitle, setGameResultTitle] = useState("0 Coins");
  const [lifelines, setLifelines] = useState({ fifty: true, audience: true });
  const [removedOptions, setRemovedOptions] = useState<Set<number>>(new Set());
  const [audiencePoll, setAudiencePoll] = useState<number[] | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [confirmQuitPrompt, setConfirmQuitPrompt] = useState(false);
  const [accumulatedCoins, setAccumulatedCoins] = useState(0);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (timerActive && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimerActive(false);
            setRevealingStatus("wrong");
            setIsRevealing(true);
            triggerLoss("timeout");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [timerActive, timer]);

  const selectRandomQuestions = useCallback(() => {
    const easy = [...KBC_QUESTIONS].filter((q) => q.difficulty === "easy").sort(() => Math.random() - 0.5).slice(0, 5);
    const medium = [...KBC_QUESTIONS].filter((q) => q.difficulty === "medium").sort(() => Math.random() - 0.5).slice(0, 5);
    const hard = [...KBC_QUESTIONS].filter((q) => q.difficulty === "hard").sort(() => Math.random() - 0.5).slice(0, 5);
    return [...easy, ...medium, ...hard];
  }, []);

  const startKbc = () => {
    const qList = selectRandomQuestions();
    setQuestions(qList);
    setLevel(0);
    setIsPlaying(true);
    setIsGameOver(false);
    setLockedOption(null);
    setRevealingStatus(null);
    setIsRevealing(false);
    setGameResultTitle("0 Coins");
    setLifelines({ fifty: true, audience: true });
    setRemovedOptions(new Set());
    setAudiencePoll(null);
    setConfirmQuitPrompt(false);
    setAccumulatedCoins(0);
    setCelebrationActive(false);
    setTimer(30);
    setTimerActive(true);
  };

  const activeQuestion = questions[level];
  const activeLadderNode = KBC_LADDER[level];

  const getSafeCheckPointAmount = () => {
    for (let i = level - 1; i >= 0; i--) {
      if (KBC_LADDER[i].safe) return KBC_LADDER[i].amount;
    }
    return "0 Coins";
  };

  const handleOptionClick = (idx: number) => {
    if (isRevealing || revealingStatus || removedOptions.has(idx)) return;
    setLockedOption(idx);
  };

  const lockOptionSelected = () => {
    if (lockedOption === null || isRevealing || revealingStatus) return;
    setIsRevealing(true);
    setTimerActive(false);

    setTimeout(() => {
      const isCorrect = lockedOption === activeQuestion.correctIndex;
      setRevealingStatus(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        // Award coins
        const earned = level < 5 ? 5 : level < 10 ? 10 : 20;
        onCoinsEarned(earned);
        setAccumulatedCoins((prev) => prev + earned);

        if (level === KBC_LADDER.length - 1) {
          // Absolute Crore Winner!
          setGameResultTitle(KBC_LADDER[level].amount);
          setCelebrationActive(true);
          setTimeout(() => {
            setIsGameOver(true);
            onCoinsEarned(100);
            setAccumulatedCoins((prev) => prev + 100);
            onPlayComplete(100, accumulatedCoins + 100);
          }, 2000);
        } else {
          setTimeout(() => {
            setLevel((prev) => prev + 1);
            setLockedOption(null);
            setRevealingStatus(null);
            setIsRevealing(false);
            setRemovedOptions(new Set());
            setAudiencePoll(null);
            setTimer(level < 4 ? 30 : level < 9 ? 45 : 60);
            setTimerActive(true);
          }, 1500);
        }
      } else {
        triggerLoss("wrong");
      }
    }, 2000);
  };

  const triggerLoss = (cause: "wrong" | "timeout" | "quit") => {
    setTimerActive(false);
    const safeAmount = getSafeCheckPointAmount();
    setGameResultTitle(cause === "quit" ? KBC_LADDER[level - 1]?.amount || "0 Coins" : safeAmount);
    setTimeout(() => {
      setIsGameOver(true);
      onPlayComplete(level * 10, accumulatedCoins);
    }, cause === "quit" ? 500 : 1500);
  };

  const handleQuitGame = () => {
    if (level === 0) {
      setIsPlaying(false);
      return;
    }
    if (!confirmQuitPrompt) {
      setConfirmQuitPrompt(true);
      return;
    }
    triggerLoss("quit");
  };

  const triggerFiftyFifty = () => {
    if (!lifelines.fifty || revealingStatus || isRevealing) return;
    setLifelines((prev) => ({ ...prev, fifty: false }));
    const correctIdx = activeQuestion.correctIndex;
    const wrg = [0, 1, 2, 3].filter((idx) => idx !== correctIdx).sort(() => Math.random() - 0.5).slice(0, 2);
    setRemovedOptions(new Set(wrg));
  };

  const triggerAudiencePoll = () => {
    if (!lifelines.audience || revealingStatus || isRevealing) return;
    setLifelines((prev) => ({ ...prev, audience: false }));

    const correctIdx = activeQuestion.correctIndex;
    const votesCorrect = Math.floor(Math.random() * 25) + 48; // Audience strongly prefers correct
    let remaining = 100 - votesCorrect;

    const poll = [0, 0, 0, 0];
    poll[correctIdx] = votesCorrect;

    for (let i = 0; i < 4; i++) {
      if (i === correctIdx) continue;
      // Distribute remaining
      const sub = [0, 1, 2, 3].filter((idx) => idx !== correctIdx && idx !== i).length === 0 ? remaining : Math.floor(Math.random() * Math.min(remaining, 25));
      poll[i] = sub;
      remaining -= sub;
    }

    const total = poll.reduce((acc, v) => acc + v, 0);
    if (total !== 100) {
      poll[correctIdx] += 100 - total;
    }

    setAudiencePoll(poll);
  };

  if (!isPlaying) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="bg-white rounded-3xl p-6 w-full mb-4 border border-slate-100 shadow-sm">
          {/* Neon KBC Intro */}
          <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 mb-4 overflow-hidden text-center text-white border border-indigo-500/20 shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <motion.div className="text-4xl mb-2.5" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 4 }}>
              💎
            </motion.div>
            <p className="text-yellow-400 text-[10px] font-extrabold tracking-widest uppercase mb-1">KAUN BANEGA</p>
            <h3 className="text-white text-[18px] font-black tracking-wide">CROREPATHI</h3>
            <p className="text-purple-300 text-[10px] font-semibold mt-1">MentorHub Tech Edition</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4.5 space-y-3 mb-5 border border-slate-100/50">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🎯</span>
              <p className="text-slate-600 text-xs font-medium">Answer 15 progressive questions to hit 1 Crore Coins</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">⏱️</span>
              <p className="text-slate-600 text-xs font-medium">Time Limits: 30s (Easy) ➔ 45s (Med) ➔ 60s (Hard)</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🛡️</span>
              <p className="text-slate-600 text-xs font-medium">Safe checkpoints at Level 5 (10K) and Level 10 (3.2L)</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🆘</span>
              <p className="text-slate-600 text-xs font-medium">Two premium lifelines: 50:50 and Audience Poll</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-5 text-amber-700">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p className="text-[10px] font-bold">This KBC game can be played once per day limit. Make it count!</p>
          </div>

          <Button
            onClick={startKbc}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/10 active:scale-[0.98] transition-all"
          >
            Play KBC Tech Edition
          </Button>
        </div>
      </motion.div>
    );
  }

  if (isGameOver) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="bg-white rounded-3xl p-6 w-full text-center border border-slate-100 shadow-sm">
          {celebrationActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-5%",
                    backgroundColor: ["#f59e0b", "#4f46e5", "#ec4899", "#10b981"][i % 4]
                  }}
                  animate={{ y: "110vh", rotate: 360 }}
                  transition={{ duration: 2.5 + Math.random() * 2, ease: "easeIn" }}
                />
              ))}
            </div>
          )}

          <span className="text-5xl block mb-3">{gameResultTitle === "1 Crore Coins" ? "🏆" : "💪"}</span>
          <h3 className="text-slate-800 text-[18px] font-black">{gameResultTitle === "1 Crore Coins" ? "CROREPATHI!" : "Game Over"}</h3>
          <p className="text-indigo-600 font-extrabold text-2xl mt-1">{gameResultTitle}</p>
          <p className="text-slate-400 text-xs font-semibold mt-1">Reached Level {level + (revealingStatus === "correct" ? 1 : 0)} of 15</p>

          <div className="grid grid-cols-3 gap-2 my-5">
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-slate-800 font-bold text-xs">{level + (revealingStatus === "correct" ? 1 : 0)}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Level</p>
            </div>
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-amber-600 font-extrabold text-xs">+{accumulatedCoins}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Coins</p>
            </div>
            <div className="bg-slate-50 rounded-xl py-2 px-1">
              <p className="text-slate-800 font-bold text-xs">{2 - Object.values(lifelines).filter(Boolean).length}/2</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Lifelines</p>
            </div>
          </div>

          <Button
            onClick={startKbc}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-11 rounded-xl text-xs font-bold"
          >
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  const timerPercent = (timer / (level < 4 ? 30 : level < 9 ? 45 : 60)) * 100;
  const timerColor = timer <= 5 ? "bg-rose-500 animate-pulse" : timer <= 10 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="flex flex-col gap-3 font-sans pb-10">
      {/* Time & Income Header */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className={`text-xs font-bold tabular-nums ${timer <= 10 ? "text-rose-500" : "text-slate-600"}`}>{timer}s</span>
          </div>

          <button
            onClick={() => setShowQuestionsList(!showQuestionsList)}
            className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 active:scale-95 transition-all"
          >
            Income Ladder: {activeLadderNode.amount}
          </button>

          <button
            onClick={handleQuitGame}
            className="text-xs font-bold text-slate-400 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 hover:text-slate-600 active:bg-slate-100"
          >
            {confirmQuitPrompt ? "Confirm Quit?" : "Quit"}
          </button>
        </div>

        {/* Horizontal Timer Bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div className={`h-full rounded-full ${timerColor}`} animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Income Ladder Overlay List */}
      <AnimatePresence>
        {showQuestionsList && (
          <motion.div
            className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm max-h-52 overflow-y-auto space-y-1.5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {[...KBC_LADDER].reverse().map((ladder, idx) => {
              const activeIdx = KBC_LADDER.length - 1 - idx;
              const isCurrent = activeIdx === level;
              const isPassed = activeIdx < level;

              return (
                <div
                  key={ladder.level}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                    isCurrent
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                      : isPassed
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  <span className="w-5">{ladder.level}</span>
                  <span className={ladder.safe ? "text-amber-500 font-extrabold" : ""}>{ladder.amount}</span>
                  {ladder.safe && <span className="text-[8px] opacity-75">🛡️ Checkpoint</span>}
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  {isCurrent && <span className="text-indigo-600">▶ Current</span>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 mb-1.5 overflow-hidden border border-indigo-500/25 shadow-lg">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between mb-3 text-[10px] font-extrabold uppercase tracking-wide">
          <span className="text-indigo-300">Question {level + 1} of 15</span>
          <span className="text-yellow-400">For {activeLadderNode.amount}</span>
        </div>
        <p className="text-white text-xs font-bold leading-relaxed">{activeQuestion.question}</p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {activeQuestion.options.map((opt: string, idx: number) => {
          const isRemoved = removedOptions.has(idx);
          const isSelected = lockedOption === idx;
          const isCorrect = idx === activeQuestion.correctIndex;

          let btnStyle = "bg-white border-slate-200 text-slate-700";
          if (isRemoved) btnStyle = "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed";
          else if (revealingStatus) {
            if (isCorrect) btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
            else if (isSelected) btnStyle = "bg-rose-50 border-rose-500 text-rose-700 font-bold";
          } else if (isSelected) {
            btnStyle = "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold ring-1 ring-indigo-400";
          }

          return (
            <button
              key={idx}
              disabled={isRemoved || isRevealing}
              onClick={() => handleOptionClick(idx)}
              className={`px-3 py-3.5 rounded-xl border text-left transition-all text-xs flex items-center gap-2.5 ${btnStyle}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                isSelected ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {["A", "B", "C", "D"][idx]}
              </span>
              <span className="flex-1 leading-snug">{isRemoved ? "—" : opt}</span>
            </button>
          );
        })}
      </div>

      {/* Audience Poll Render */}
      <AnimatePresence>
        {audiencePoll && (
          <motion.div className="bg-purple-50 rounded-2xl p-4 mb-2 border border-purple-100 shadow-sm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-1.5 mb-3 text-purple-900">
              <span className="text-sm">📊</span>
              <p className="text-[10px] font-extrabold tracking-wider uppercase">Audience Poll Results</p>
            </div>
            <div className="space-y-2">
              {audiencePoll.map((percent, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-purple-500 w-3">{["A", "B", "C", "D"][idx]}</span>
                  <div className="flex-1 h-3 bg-purple-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.6 }} />
                  </div>
                  <span className="text-[10px] font-extrabold text-purple-600 w-8 text-right">{percent}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lifeline Buttons */}
      <div className="flex items-center gap-2.5 mb-2">
        <button
          onClick={triggerFiftyFifty}
          disabled={!lifelines.fifty || isRevealing || !!revealingStatus}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 border transition-all ${
            lifelines.fifty && !isRevealing && !revealingStatus
              ? "bg-white border-slate-200 text-slate-600 active:scale-95 shadow-sm"
              : "bg-slate-100 border-slate-200 text-slate-300"
          }`}
        >
          <BadgeHelp className="w-4 h-4" />
          50:50 Lifeline
        </button>

        <button
          onClick={triggerAudiencePoll}
          disabled={!lifelines.audience || isRevealing || !!revealingStatus}
          className={`flex-1 py-3 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 border transition-all ${
            lifelines.audience && !isRevealing && !revealingStatus
              ? "bg-white border-slate-200 text-slate-600 active:scale-95 shadow-sm"
              : "bg-slate-100 border-slate-200 text-slate-300"
          }`}
        >
          <Users className="w-4 h-4" />
          Audience Poll
        </button>
      </div>

      {/* Lock Answer Action Trigger */}
      <Button
        onClick={lockOptionSelected}
        disabled={lockedOption === null || isRevealing}
        className={`w-full py-4 h-12 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
          lockedOption !== null && !isRevealing
            ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98]"
            : isRevealing
            ? "bg-amber-100 text-amber-700 cursor-not-allowed"
            : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
        }`}
      >
        {isRevealing ? (
          <>
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>⏳</motion.span>
            Locking Answer...
          </>
        ) : lockedOption !== null ? (
          "🔒 Lock It In!"
        ) : (
          "Select An Option"
        )}
      </Button>

      {/* Feedback Banner */}
      <AnimatePresence>
        {revealingStatus && (
          <motion.div
            className={`rounded-xl px-3.5 py-3 flex items-center gap-2 text-xs font-bold border ${
              revealingStatus === "correct" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>{revealingStatus === "correct" ? "🎉" : "😔"}</span>
            <span>
              {revealingStatus === "correct"
                ? level === KBC_LADDER.length - 1
                  ? "AMAZING! You won 1 Crore Coins!"
                  : "Correct! Level Up ➔ " + KBC_LADDER[level + 1].amount
                : "Wrong! You walk away with " + getSafeCheckPointAmount()}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 4. LOCAL LEADERBOARD LIST VIEW
// ==========================================
function LeaderboardView({ userName, userCoins }: { userName: string; userCoins: number }) {
  // Sort user into ranking list
  const cleanName = userName.split(" ")[0] || "You";

  const rankedList = [
    ...STATIC_STUDENTS.map((item) => ({ ...item, isUser: false })),
    { id: "me", name: cleanName, avatar: "", score: userCoins, streak: 3, rank: 3, quizAvg: 85, online: true, isUser: true }
  ];

  // Sort by score
  rankedList.sort((a, b) => b.score - a.score);

  // Recalculate ranks dynamically
  const ranksWithUser = rankedList.map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5 pb-8 font-sans">
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-xl shadow-inner">
            🏆
          </div>
          <div>
            <h3 className="text-slate-800 text-[15px] font-bold">Arena Leaderboard</h3>
            <p className="text-slate-400 text-[11px] font-semibold">Live rankings based on earned coins</p>
          </div>
        </div>

        {/* Ranked Items */}
        <div className="space-y-2">
          {ranksWithUser.map((std, idx) => {
            return (
              <motion.div
                key={std.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border ${
                  std.isUser ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10" : "bg-white border-slate-100"
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Rank Badge */}
                <span className={`text-xs font-black w-6 text-center shrink-0 ${std.rank === 1 ? "text-amber-500" : std.isUser ? "text-slate-300" : "text-slate-400"}`}>
                  {std.rank === 1 ? "🥇" : std.rank === 2 ? "🥈" : std.rank === 3 ? "🥉" : std.rank}
                </span>

                {/* Avatar */}
                <div className="relative shrink-0">
                  {std.isUser ? (
                    <div className="w-8.5 h-8.5 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-xs shadow-md border-2 border-slate-700">
                      {cleanName[0].toUpperCase()}
                    </div>
                  ) : (
                    <img src={std.avatar} alt="" className="w-8.5 h-8.5 rounded-full object-cover shadow-sm border border-slate-200" />
                  )}
                  {std.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate">{std.isUser ? "You" : std.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-medium ${std.isUser ? "text-slate-300" : "text-slate-400"}`}>Streak</span>
                    <span className="text-orange-500 text-[10px] font-extrabold flex items-center">
                      <Flame className="w-3 h-3 fill-orange-400 text-orange-500 shrink-0" /> {std.streak}
                    </span>
                  </div>
                </div>

                {/* Coins score */}
                <div className="flex items-center gap-1 shrink-0 bg-slate-50/5 rounded-xl px-2 py-1">
                  <CustomCoin className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[12px] font-extrabold tabular-nums">{std.score}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

