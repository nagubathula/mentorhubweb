"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, GraduationCap, UserCheck, Users, FileText,
  ArrowRightLeft, BookOpen, Gamepad2, HelpCircle, Circle as CircleIcon,
  CalendarDays, Star, Sparkles, MessageCircle, Heart, Handshake,
  Settings, Search, Bell, Plus, X, Menu, Send,
  TrendingUp, Zap, Target, Clock, Flame, Trophy,
  ChevronDown, CheckCircle, ArrowRight, Video,
  UserPlus, Shield, RefreshCw, Download, Upload,
  MapPin, BookMarked, Layers, BarChart2,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminPage =
  | "dashboard" | "courses" | "mentors" | "mentees" | "registrations"
  | "mapping" | "enrollments" | "games" | "questionnaires" | "circles"
  | "sessions" | "reviews" | "inspiration" | "messages" | "gratitude-wall"
  | "csr-sponsors" | "settings";

type ModalKey =
  | "add-student" | "add-mentor" | "schedule-session"
  | "send-inspiration" | "create-enrollment" | "create-circle" | null;

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { key: "dashboard",      label: "Dashboard",       icon: LayoutDashboard },
  { key: "courses",        label: "Courses",          icon: GraduationCap },
  { key: "mentors",        label: "Mentors",          icon: UserCheck },
  { key: "mentees",        label: "Mentees",          icon: Users },
  { key: "registrations",  label: "Registrations",    icon: FileText },
  { key: "mapping",        label: "Mapping",          icon: ArrowRightLeft },
  { key: "enrollments",    label: "Enrollments",      icon: BookOpen },
  { key: "games",          label: "Games & Quizzes",  icon: Gamepad2 },
  { key: "questionnaires", label: "Questionnaires",   icon: HelpCircle },
  { key: "circles",        label: "Circles",          icon: CircleIcon },
] as const;

const NAV_OTHERS = [
  { key: "sessions",       label: "Sessions",         icon: CalendarDays },
  { key: "reviews",        label: "Reviews",          icon: Star },
  { key: "inspiration",    label: "Inspiration",      icon: Sparkles },
  { key: "messages",       label: "Messages",         icon: MessageCircle },
  { key: "gratitude-wall", label: "Gratitude Wall",   icon: Heart },
  { key: "csr-sponsors",   label: "CSR Sponsors",     icon: Handshake },
  { key: "settings",       label: "Settings",         icon: Settings },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function seedNum(id: string, max: number, min = 0): number {
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h) + id.charCodeAt(i);
  return min + Math.abs(h) % (max - min + 1);
}

function timeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function progressColor(pct: number) {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 50) return "bg-blue-500";
  if (pct >= 25) return "bg-amber-400";
  return "bg-red-400";
}

function initialsColor(name = ""): string {
  const cols = [
    "bg-emerald-500","bg-blue-500","bg-violet-500","bg-amber-500",
    "bg-rose-500","bg-cyan-500","bg-fuchsia-500","bg-orange-500",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return cols[Math.abs(h) % cols.length];
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function courseColor(title = "") {
  const t = title.toLowerCase();
  if (t.includes("data") || t.includes("analytic")) return { bg: "bg-blue-500",    ring: "ring-blue-100" };
  if (t.includes("vlsi") || t.includes("hardware")) return { bg: "bg-red-500",     ring: "ring-red-100" };
  if (t.includes("embed") || t.includes("iot"))     return { bg: "bg-teal-500",    ring: "ring-teal-100" };
  if (t.includes("ux") || t.includes("design"))     return { bg: "bg-violet-500",  ring: "ring-violet-100" };
  if (t.includes("python") || t.includes("ml"))     return { bg: "bg-amber-500",   ring: "ring-amber-100" };
  if (t.includes("cloud") || t.includes("devops"))  return { bg: "bg-cyan-500",    ring: "ring-cyan-100" };
  if (t.includes("back") || t.includes("node"))     return { bg: "bg-orange-500",  ring: "ring-orange-100" };
  return { bg: "bg-slate-500", ring: "ring-slate-100" };
}

const COURSE_ICON_MAP: Record<string, any> = {
  default: BarChart2, data: BarChart2, design: Sparkles,
  python: Layers, cloud: Shield, hardware: Zap,
};

function courseIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("data")) return BarChart2;
  if (t.includes("design") || t.includes("ux")) return Sparkles;
  if (t.includes("python") || t.includes("ml")) return Layers;
  if (t.includes("cloud") || t.includes("devops")) return Shield;
  if (t.includes("vlsi") || t.includes("embed")) return Zap;
  return BookMarked;
}

const WEEKLY_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const WEEKLY = WEEKLY_DAYS.map((day, i) => ({
  day,
  games:    [3,2,3,4,2,1,4][i],
  quizzes:  [4,3,4,4,3,3,5][i],
  sessions: [3,3,3,3,2,5,5][i],
}));

const EMOJIS = ["🌟","🔥","💡","🚀","🎯","💪","🙌","🌈","✨","🏆","❤️","🌱","⚡","🎉","💎"];
const INSPIRATION_TEMPLATES = [
  "You are capable of more than you know.",
  "Every expert was once a beginner.",
  "Progress, not perfection.",
  "The best time to start is now.",
  "Consistency beats motivation.",
  "Small steps lead to big change.",
];

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Av({ name, size = 8, src }: { name?: string; size?: number; src?: string }) {
  const bg = initialsColor(name);
  const sz = `w-${size} h-${size}`;
  if (src) return <img src={src} className={cn(sz, "rounded-full object-cover bg-slate-100")} alt={name} />;
  return (
    <div className={cn(sz, "rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0", bg)}>
      {initials(name)}
    </div>
  );
}

function Pill({ children, color = "slate" }: { children: React.ReactNode; color?: string }) {
  const map: Record<string, string> = {
    slate:  "bg-slate-100 text-slate-600",
    green:  "bg-emerald-50 text-emerald-700",
    red:    "bg-red-50 text-red-600",
    amber:  "bg-amber-50 text-amber-700",
    blue:   "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    pink:   "bg-pink-50 text-pink-700",
  };
  return <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", map[color] || map.slate)}>{children}</span>;
}

function PBar({ value, max = 100, color = "bg-slate-700", height = "h-1.5" }: {
  value: number; max?: number; color?: string; height?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden", height)}>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm", onClick && "cursor-pointer hover:shadow-md hover:border-slate-200 transition-all", className)}>
      {children}
    </div>
  );
}

function BtnPrimary({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button"|"submit" }) {
  return (
    <button type={type} onClick={onClick}
      className="h-9 px-4 bg-[#0f172a] text-white text-[13px] font-medium rounded-xl hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 shrink-0">
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="h-9 px-4 bg-white border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shrink-0">
      {children}
    </button>
  );
}

function PageShell({ title, subtitle, action, children }: {
  title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      {children}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder = "Search..." }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 text-[13px] outline-none focus:border-slate-400 transition-colors" />
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function TInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="h-9 w-full border border-slate-200 rounded-lg px-3 text-[13px] outline-none focus:border-slate-400 bg-white" />
  );
}

function SInput({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full border border-slate-200 rounded-lg px-3 text-[13px] outline-none focus:border-slate-400 bg-white">
      <option value="">Select…</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function TAInput({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-slate-400 bg-white resize-none" />
  );
}

function ModalWrap({ title, onClose, onSave, children }: {
  title: string; onClose: () => void; onSave: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-[16px] font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">{children}</div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={onSave}>Save</BtnPrimary>
        </div>
      </div>
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function AddStudentModal({ onClose, courses }: { onClose: () => void; courses: any[] }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [course, setCourse] = useState(""); const [bio, setBio] = useState("");
  const supabase = createClient();
  const save = async () => {
    if (!name || !email) return;
    await supabase.from("profiles").insert({ id: crypto.randomUUID(), name, email, role: "STUDENT", preferences: { bio, course } } as any);
    onClose();
  };
  return (
    <ModalWrap title="Add Student" onClose={onClose} onSave={save}>
      <FieldRow label="Full Name"><TInput value={name} onChange={setName} placeholder="e.g. Arjun Mehta" /></FieldRow>
      <FieldRow label="Email"><TInput value={email} onChange={setEmail} placeholder="student@email.com" type="email" /></FieldRow>
      <FieldRow label="Assign Course"><SInput value={course} onChange={setCourse} options={courses.map((c) => ({ value: c.id, label: c.title || c.id }))} /></FieldRow>
      <FieldRow label="Bio"><TAInput value={bio} onChange={setBio} placeholder="Short bio..." /></FieldRow>
    </ModalWrap>
  );
}

function AddMentorModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [spec, setSpec] = useState(""); const [dept, setDept] = useState(""); const [bio, setBio] = useState("");
  const supabase = createClient();
  const save = async () => {
    if (!name || !email) return;
    await supabase.from("profiles").insert({ id: crypto.randomUUID(), name, email, role: "MENTOR", expertise: spec, preferences: { department: dept, bio } } as any);
    onClose();
  };
  return (
    <ModalWrap title="Add Mentor" onClose={onClose} onSave={save}>
      <FieldRow label="Full Name"><TInput value={name} onChange={setName} placeholder="e.g. Dr. Priya Nair" /></FieldRow>
      <FieldRow label="Email"><TInput value={email} onChange={setEmail} placeholder="mentor@org.com" type="email" /></FieldRow>
      <FieldRow label="Specialization"><TInput value={spec} onChange={setSpec} placeholder="e.g. Machine Learning" /></FieldRow>
      <FieldRow label="Department"><TInput value={dept} onChange={setDept} placeholder="e.g. Engineering" /></FieldRow>
      <FieldRow label="Bio"><TAInput value={bio} onChange={setBio} placeholder="Short bio..." /></FieldRow>
    </ModalWrap>
  );
}

function ScheduleSessionModal({ onClose, students, mentors }: { onClose: () => void; students: any[]; mentors: any[] }) {
  const [student, setStudent] = useState(""); const [mentor, setMentor] = useState("");
  const [title, setTitle] = useState(""); const [type, setType] = useState("one-on-one");
  const [duration, setDuration] = useState("60"); const [dt, setDt] = useState("");
  const supabase = createClient();
  const save = async () => {
    if (!student || !mentor || !title) return;
    await supabase.from("sessions").insert({ student_id: student, mentor_id: mentor, title, notes: type, duration_minutes: Number(duration), scheduled_at: dt });
    onClose();
  };
  return (
    <ModalWrap title="Schedule Session" onClose={onClose} onSave={save}>
      <FieldRow label="Student"><SInput value={student} onChange={setStudent} options={students.map((s) => ({ value: s.id, label: s.name || s.email }))} /></FieldRow>
      <FieldRow label="Mentor"><SInput value={mentor} onChange={setMentor} options={mentors.map((m) => ({ value: m.id, label: m.name || m.email }))} /></FieldRow>
      <FieldRow label="Session Title"><TInput value={title} onChange={setTitle} placeholder="e.g. Module 3 Review" /></FieldRow>
      <FieldRow label="Type"><SInput value={type} onChange={setType} options={[{ value:"one-on-one",label:"1-on-1"},{ value:"group",label:"Group"},{ value:"workshop",label:"Workshop"}]} /></FieldRow>
      <FieldRow label="Duration"><SInput value={duration} onChange={setDuration} options={[{ value:"30",label:"30 min"},{ value:"45",label:"45 min"},{ value:"60",label:"60 min"},{ value:"90",label:"90 min"}]} /></FieldRow>
      <FieldRow label="Date & Time"><TInput value={dt} onChange={setDt} type="datetime-local" /></FieldRow>
    </ModalWrap>
  );
}

function SendInspirationModal({ onClose, students, mentors }: { onClose: () => void; students: any[]; mentors: any[] }) {
  const [target, setTarget] = useState("all"); const [category, setCategory] = useState("quote");
  const [emoji, setEmoji] = useState("🌟"); const [message, setMessage] = useState(""); const [author, setAuthor] = useState("");
  const supabase = createClient();
  const save = async () => {
    if (!message) return;
    await supabase.from("inspiration").insert({ title: `${emoji} ${category}`, content: message, author, type: category, is_published: true });
    onClose();
  };
  return (
    <ModalWrap title="Send Inspiration" onClose={onClose} onSave={save}>
      <FieldRow label="Target"><SInput value={target} onChange={setTarget} options={[{ value:"all",label:"Everyone"}, ...students.map((s) => ({ value: s.id, label: `Student: ${s.name||s.email}` })), ...mentors.map((m) => ({ value: m.id, label: `Mentor: ${m.name||m.email}` }))]} /></FieldRow>
      <FieldRow label="Category"><SInput value={category} onChange={setCategory} options={[{ value:"quote",label:"Quote"},{ value:"tip",label:"Tip"},{ value:"challenge",label:"Challenge"},{ value:"story",label:"Story"}]} /></FieldRow>
      <FieldRow label="Emoji">
        <div className="flex flex-wrap gap-1.5">
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => setEmoji(e)} className={cn("w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition-colors", emoji===e?"border-slate-800 bg-slate-50":"border-transparent hover:border-slate-200")}>{e}</button>
          ))}
        </div>
      </FieldRow>
      <FieldRow label="Message">
        <TAInput value={message} onChange={setMessage} placeholder="Type your message..." rows={4} />
        <div className="flex flex-wrap gap-1 mt-1">
          {INSPIRATION_TEMPLATES.map((t) => (
            <button key={t} onClick={() => setMessage(t)} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">{t.slice(0,28)}…</button>
          ))}
        </div>
      </FieldRow>
      <FieldRow label="Author"><TInput value={author} onChange={setAuthor} placeholder="e.g. Albert Einstein" /></FieldRow>
    </ModalWrap>
  );
}

function CreateEnrollmentModal({ onClose, students, courses, circles }: { onClose: () => void; students: any[]; courses: any[]; circles: any[] }) {
  const [student, setStudent] = useState(""); const [course, setCourse] = useState("");
  const [circle, setCircle] = useState(""); const [status, setStatus] = useState("active");
  const supabase = createClient();
  const save = async () => {
    if (!student || !course) return;
    await supabase.from("enrollments").insert({ student_id: student, course_id: course, circle_id: circle||null, status });
    onClose();
  };
  return (
    <ModalWrap title="Create Enrollment" onClose={onClose} onSave={save}>
      <FieldRow label="Student"><SInput value={student} onChange={setStudent} options={students.map((s) => ({ value: s.id, label: s.name||s.email }))} /></FieldRow>
      <FieldRow label="Course"><SInput value={course} onChange={setCourse} options={courses.map((c) => ({ value: c.id, label: c.title||c.id }))} /></FieldRow>
      <FieldRow label="Circle (optional)"><SInput value={circle} onChange={setCircle} options={circles.map((c) => ({ value: c.id, label: c.name||c.id }))} /></FieldRow>
      <FieldRow label="Status"><SInput value={status} onChange={setStatus} options={[{ value:"active",label:"Active"},{ value:"paused",label:"Paused"},{ value:"completed",label:"Completed"},{ value:"dropped",label:"Dropped"}]} /></FieldRow>
    </ModalWrap>
  );
}

function CreateCircleModal({ onClose, mentors }: { onClose: () => void; mentors: any[] }) {
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [mentor, setMentor] = useState("");
  const supabase = createClient();
  const save = async () => {
    if (!name) return;
    await supabase.from("circles").insert({ name, description: desc, mentor_id: mentor||null });
    onClose();
  };
  return (
    <ModalWrap title="Create Circle" onClose={onClose} onSave={save}>
      <FieldRow label="Circle Name"><TInput value={name} onChange={setName} placeholder="e.g. Python Beginners Q4" /></FieldRow>
      <FieldRow label="Description"><TAInput value={desc} onChange={setDesc} placeholder="What is this circle about?" /></FieldRow>
      <FieldRow label="Assign Mentor"><SInput value={mentor} onChange={setMentor} options={mentors.map((m) => ({ value: m.id, label: m.name||m.email }))} /></FieldRow>
    </ModalWrap>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardPage({ data, onNavigate, openModal }: {
  data: any; onNavigate: (p: AdminPage) => void; openModal: (m: ModalKey) => void;
}) {
  const { students=[], mentors=[], courses=[], sessions=[], enrollments=[], reviews=[], messages=[], circles=[], inspiration=[], games=[] } = data;

  const weekMax = Math.max(...WEEKLY.map((w) => w.games + w.quizzes + w.sessions));

  const gameItems = games.slice(0, 5).map((g: any, i: number) => ({
    title: g.title, plays: seedNum(g.id || String(i), 5, 1),
    color: ["bg-emerald-500","bg-blue-500","bg-amber-400","bg-violet-500","bg-rose-500"][i % 5],
  }));
  const totalCoins = gameItems.reduce((s: number, g: any) => s + g.plays * 20, 0);

  const topStudents = students.slice(0, 5).map((s: any) => ({
    ...s,
    streak: seedNum(s.id, 14, 1),
    xp: seedNum(s.id, 4500, 500) + 500,
    coins: seedNum(s.id, 600, 100),
  })).sort((a: any, b: any) => b.streak - a.streak);

  const topXP = [...topStudents].sort((a: any, b: any) => b.xp - a.xp);

  const quickActions = [
    { label: "+ Student",  bg: "bg-blue-500 hover:bg-blue-600",    modal: "add-student" as ModalKey },
    { label: "+ Mentor",   bg: "bg-rose-500 hover:bg-rose-600",    modal: "add-mentor" as ModalKey },
    { label: "+ Session",  bg: "bg-violet-500 hover:bg-violet-600",modal: "schedule-session" as ModalKey },
    { label: "+ Inspire",  bg: "bg-pink-500 hover:bg-pink-600",    modal: "send-inspiration" as ModalKey },
    { label: "+ Map",      bg: "bg-emerald-500 hover:bg-emerald-600", modal: null as ModalKey },
  ];

  const stats = [
    { label:"Total Students",   value: students.length,   delta:"+2 this month",  deltaColor:"text-emerald-600", icon: Users,        iconBg:"bg-blue-100",   iconColor:"text-blue-600",    page:"mentees" as AdminPage },
    { label:"Active Mentors",   value: mentors.length,    delta:"+1 new",         deltaColor:"text-emerald-600", icon: UserCheck,    iconBg:"bg-rose-100",   iconColor:"text-rose-600",    page:"mentors" as AdminPage },
    { label:"Enrollments",      value: enrollments.length,delta:`${courses.length} courses`, deltaColor:"text-slate-500", icon: BookOpen, iconBg:"bg-violet-100",iconColor:"text-violet-600", page:"enrollments" as AdminPage },
    { label:"Pending Reviews",  value: reviews.length,    delta:`${games.length} games`,    deltaColor:"text-slate-500", icon: Star,  iconBg:"bg-amber-100",  iconColor:"text-amber-600",   page:"reviews" as AdminPage },
  ];

  const metrics = [
    { label:"Games Played",  value: games.length * 2,  icon: Gamepad2 },
    { label:"Quizzes Taken", value: games.length,      icon: HelpCircle },
    { label:"Avg Streak",    value: `${Math.max(1, Math.round(topStudents.reduce((s:any,t:any)=>s+t.streak,0)/Math.max(1,topStudents.length)))}d`, icon: Flame },
    { label:"Avg Progress",  value: `${Math.round(enrollments.reduce((_s:any,_e:any,i:number)=>_s+seedNum(String(i),80,20),0)/Math.max(1,enrollments.length))}%`, icon: TrendingUp },
    { label:"Inspired",      value: inspiration.length, icon: Sparkles },
    { label:"Circles",       value: circles.length,     icon: CircleIcon },
    { label:"Questions",     value: games.reduce((s:any, g:any) => s + (Array.isArray((g.questions as any)) ? (g.questions as any).length : 5), 0) || 0, icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Title + quick actions */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Welcome back! Here's your overview for today.</p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => a.modal && openModal(a.modal)}
              className={cn("h-9 px-4 text-white text-[13px] font-semibold rounded-xl transition-colors", a.bg)}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} onClick={() => onNavigate(s.page)} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.iconBg)}>
                <s.icon className={cn("w-5 h-5", s.iconColor)} />
              </div>
              <span className={cn("text-[11px] font-semibold", s.deltaColor)}>{s.delta}</span>
            </div>
            <p className="text-[30px] font-bold text-slate-900 leading-none">{s.value}</p>
            <p className="text-[12px] text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-7 gap-3">
        {metrics.map((m) => (
          <Card key={m.label} className="p-3 flex flex-col items-center text-center gap-1">
            <m.icon className="w-4 h-4 text-slate-400" />
            <p className="text-[18px] font-bold text-slate-800 leading-none">{m.value}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide leading-tight">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weekly Activity – horizontal bars */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-800">Weekly Activity</h3>
            <span className="text-[12px] text-slate-400">Last 7 days</span>
          </div>
          <div className="flex flex-col gap-2">
            {WEEKLY.map((w) => {
              const total = w.games + w.quizzes + w.sessions;
              const gP = (w.games / total) * 100;
              const qP = (w.quizzes / total) * 100;
              const sP = (w.sessions / total) * 100;
              return (
                <div key={w.day} className="flex items-center gap-3">
                  <span className="w-8 text-[12px] font-medium text-slate-500 text-right shrink-0">{w.day}</span>
                  <div className="flex-1 h-5 flex rounded-md overflow-hidden gap-px">
                    <div className="bg-amber-200 rounded-l-md" style={{ width: `${gP}%` }} />
                    <div className="bg-emerald-300" style={{ width: `${qP}%` }} />
                    <div className="bg-blue-200 rounded-r-md" style={{ width: `${sP}%` }} />
                  </div>
                  <span className="w-5 text-[12px] font-medium text-slate-500 text-right shrink-0">{total}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4">
            {[{ c:"bg-amber-200",l:"Games" },{ c:"bg-emerald-300",l:"Quizzes" },{ c:"bg-blue-200",l:"Sessions" }].map((i) => (
              <div key={i.l} className="flex items-center gap-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-sm", i.c)} />
                <span className="text-[11px] text-slate-500">{i.l}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Game Breakdown */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-800">Game Breakdown</h3>
            <button onClick={() => onNavigate("games")} className="text-[12px] text-blue-500 hover:text-blue-700">View all</button>
          </div>
          {gameItems.length > 0 ? (
            <div className="flex flex-col gap-3">
              {gameItems.map((g: any) => {
                const maxPlays = Math.max(...gameItems.map((x: any) => x.plays));
                return (
                  <div key={g.title} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium text-slate-700">{g.title}</span>
                        <span className="text-[12px] text-slate-400">{g.plays} plays</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", g.color)} style={{ width: `${(g.plays / maxPlays) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-slate-400 py-4">No games yet</p>
          )}
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[12px] text-slate-500">Total coins from games</span>
            <span className="text-[13px] font-bold text-amber-500">{totalCoins} coins</span>
          </div>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak Leaders */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Streak Leaders
            </h3>
            <button onClick={() => onNavigate("mentees")} className="text-[12px] text-blue-500 hover:text-blue-700">View all</button>
          </div>
          <div className="flex flex-col gap-3">
            {topStudents.map((s: any, i: number) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0",
                  i===0?"bg-amber-400":i===1?"bg-slate-400":i===2?"bg-amber-700":"bg-slate-200 text-slate-500")}>
                  {i+1}
                </div>
                <Av name={s.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`} size={7} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 truncate">{s.name || "Unknown"}</p>
                  <p className="text-[11px] text-slate-400">{s.xp} XP · {s.coins} coins</p>
                </div>
                <div className="flex items-center gap-1 text-[13px] font-bold text-orange-500 shrink-0">
                  <Flame className="w-3.5 h-3.5" />{s.streak}d
                </div>
              </div>
            ))}
            {topStudents.length === 0 && <p className="text-[13px] text-slate-400">No students yet</p>}
          </div>
        </Card>

        {/* XP Leaders */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> XP Leaders
            </h3>
            <button onClick={() => onNavigate("mentees")} className="text-[12px] text-blue-500 hover:text-blue-700">View all</button>
          </div>
          <div className="flex flex-col gap-3">
            {topXP.map((s: any, i: number) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0",
                  i===0?"bg-amber-400":i===1?"bg-slate-400":i===2?"bg-amber-700":"bg-slate-200 text-slate-500")}>
                  {i+1}
                </div>
                <Av name={s.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`} size={7} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-slate-800 truncate">{s.name || "Unknown"}</span>
                    <span className="text-[12px] font-bold text-violet-600 shrink-0 ml-2">⚡ {s.xp.toLocaleString()}</span>
                  </div>
                  <PBar value={s.xp} max={5000} color="bg-violet-400" />
                </div>
              </div>
            ))}
            {topXP.length === 0 && <p className="text-[13px] text-slate-400">No students yet</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Courses ──────────────────────────────────────────────────────────────────
function CoursesPage({ data }: { data: any }) {
  const { courses = [], enrollments = [] } = data;
  const [filter, setFilter] = useState<"all"|"enrolled"|"available">("all");
  const [q, setQ] = useState("");

  const enriched = courses.map((c: any) => {
    const modules = seedNum(c.id, 4, 8);
    const lessons = modules * seedNum(c.id + "l", 2, 3) + seedNum(c.id + "x", 6, 2);
    const hours = Math.round(lessons * seedNum(c.id + "h", 2, 1) + seedNum(c.id + "y", 10, 5));
    const difficulty = ["Beginner","Intermediate","Advanced"][seedNum(c.id, 2)];
    const enrolled = enrollments.some((e: any) => e.course_id === c.id);
    const progress = enrolled ? seedNum(c.id + "p", 80, 10) : 0;
    const category = (c.description || c.title || "").split(" ").slice(0,2).join(" ") || "General";
    return { ...c, modules, lessons, hours, difficulty, enrolled, progress, category };
  });

  const filtered = enriched
    .filter((c: any) => !q || c.title?.toLowerCase().includes(q.toLowerCase()))
    .filter((c: any) => filter === "all" ? true : filter === "enrolled" ? c.enrolled : !c.enrolled);

  const CIcon = (title: string) => {
    const Ic = courseIcon(title);
    const { bg } = courseColor(title);
    return (
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
        <Ic className="w-5 h-5 text-white" />
      </div>
    );
  };

  return (
    <PageShell title="Course Library" subtitle={`${courses.length} courses · ${enrollments.length} enrolled`}
      action={<><BtnSecondary><Upload className="w-4 h-4" />Upload Course</BtnSecondary><BtnPrimary><Plus className="w-4 h-4" />Add Course</BtnPrimary></>}>
      <Card>
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex gap-2">
            {(["all","enrolled","available"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("h-8 px-4 rounded-full text-[13px] font-medium capitalize transition-colors",
                  filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800")}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map((c: any) => (
            <div key={c.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
              {CIcon(c.title)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[15px] font-bold text-slate-900">{c.title}</h3>
                  <Pill color={c.difficulty==="Beginner"?"green":c.difficulty==="Advanced"?"red":"blue"}>{c.difficulty}</Pill>
                  {c.enrolled && <Pill color="green">Enrolled</Pill>}
                </div>
                <p className="text-[13px] text-slate-500 mb-2 line-clamp-1">{c.description || "No description"}</p>
                <div className="flex items-center gap-3 text-[12px] text-slate-400 flex-wrap">
                  <span>{c.modules} modules</span>
                  <span>·</span><span>{c.lessons} lessons</span>
                  <span>·</span><span>{c.hours} hours</span>
                  <span>·</span><span>{c.category}</span>
                  <span>·</span><span className="flex items-center gap-1"><BookMarked className="w-3 h-3 text-emerald-500" />5 quiz Q</span>
                </div>
                {c.enrolled && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", progressColor(c.progress))} style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-[12px] font-medium text-slate-500 shrink-0">{c.progress}%</span>
                  </div>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
            </div>
          ))}
          {filtered.length === 0 && <div className="py-16 text-center text-slate-400 text-[13px]">No courses found</div>}
        </div>
      </Card>
    </PageShell>
  );
}

// ─── Mentors ──────────────────────────────────────────────────────────────────
function MentorsPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { mentors = [], mapping = [] } = data;
  const [q, setQ] = useState("");

  const enriched = mentors
    .filter((m: any) => !q || (m.name || m.email || "").toLowerCase().includes(q.toLowerCase()))
    .map((m: any) => {
      const activeMentees = mapping.filter((mp: any) => mp.mentor_id === m.id && mp.status !== "inactive").length;
      const totalMentees = activeMentees + seedNum(m.id, 30, 10);
      const rating = (4.5 + seedNum(m.id, 4) * 0.1).toFixed(1);
      const status = seedNum(m.id, 10) > 8 ? "On Leave" : "Active";
      const specialization = m.expertise || (m.preferences as any)?.specialization || "General";
      return { ...m, activeMentees, totalMentees, rating, status, specialization };
    });

  return (
    <PageShell title="Mentors" subtitle={`${mentors.length} active mentors`}
      action={<BtnPrimary onClick={() => openModal("add-mentor")}><Plus className="w-4 h-4" />Add Mentor</BtnPrimary>}>
      <Card>
        <div className="p-4 border-b border-slate-100"><SearchInput value={q} onChange={setQ} placeholder="Search mentors…" /></div>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mentor</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active Mentees</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Mentees</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enriched.map((m: any) => (
              <tr key={m.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Av name={m.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`} size={9} />
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900">{m.name || "—"}</p>
                      <p className="text-[12px] text-slate-400">{m.specialization}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{m.email || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", m.activeMentees > 8 ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${Math.min(100,(m.activeMentees/15)*100)}%` }} />
                    </div>
                    <span className="text-[13px] text-slate-600">{m.activeMentees}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-[13px] text-slate-600">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />{m.totalMentees}
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] font-semibold text-slate-700">{m.rating}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[12px] font-semibold", m.status==="Active"?"text-emerald-600":"text-amber-600")}>{m.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[13px] text-blue-500 hover:text-blue-700 font-medium">View</button>
                </td>
              </tr>
            ))}
            {enriched.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-[13px] text-slate-400">No mentors found</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

// ─── Mentees ──────────────────────────────────────────────────────────────────
function MenteesPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { students = [], courses = [], enrollments = [] } = data;
  const [q, setQ] = useState("");

  const enriched = students
    .filter((s: any) => !q || (s.name || s.email || "").toLowerCase().includes(q.toLowerCase()))
    .map((s: any) => {
      const progress = seedNum(s.id, 90, 10);
      const streak = seedNum(s.id, 14, 1);
      const quizAvg = seedNum(s.id, 95, 60);
      const needsAttention = progress < 30 || streak < 2;
      const enrollment = enrollments.find((e: any) => e.student_id === s.id);
      const course = enrollment ? courses.find((c: any) => c.id === enrollment.course_id) : null;
      return { ...s, progress, streak, quizAvg, needsAttention, courseName: course?.title || "—" };
    });

  return (
    <PageShell title="Mentees" subtitle={`${students.length} active students`}
      action={<BtnPrimary onClick={() => openModal("add-student")}><Plus className="w-4 h-4" />Add Mentee</BtnPrimary>}>
      <Card>
        <div className="p-4 border-b border-slate-100"><SearchInput value={q} onChange={setQ} placeholder="Search mentees…" /></div>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Student</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Progress</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Streak</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Quiz Avg</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enriched.map((s: any) => (
              <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Av name={s.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`} size={9} />
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900">{s.name || "—"}</p>
                      <p className="text-[12px] text-slate-400">{s.courseName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{s.email || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", progressColor(s.progress))} style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-[13px] text-slate-600">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-[13px] text-slate-600">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />{s.streak}d
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{s.quizAvg}%</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[12px] font-semibold", s.needsAttention ? "text-amber-600" : "text-emerald-600")}>
                    {s.needsAttention ? "Needs Attention" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[13px] text-blue-500 hover:text-blue-700 font-medium">View</button>
                </td>
              </tr>
            ))}
            {enriched.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-[13px] text-slate-400">No students found</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

// ─── Registrations ────────────────────────────────────────────────────────────
function RegistrationsPage({ data }: { data: any }) {
  const { students = [], mentors = [], studentQuiz = [], mentorQuiz = [] } = data;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all"|"students"|"mentors">("all");

  const allProfiles = [
    ...students.map((s: any) => ({ ...s, _role: "Student" })),
    ...mentors.map((m: any) => ({ ...m, _role: "Mentor" })),
  ];

  const enriched = allProfiles.map((p: any) => {
    const quiz = p._role === "Student"
      ? studentQuiz.find((q: any) => q.student_id === p.id)
      : mentorQuiz.find((q: any) => q.mentor_id === p.id);
    const college = quiz?.college || "—";
    const branch = quiz?.branch || "—";
    const lang = quiz?.mother_tongue || "—";
    const company = quiz?.current_company;
    const quizFields = quiz ? Object.values(quiz).filter((v) => v && typeof v === "string" && v !== p.id).length : 0;
    const totalFields = 6;
    const expertise = p.expertise || (p.preferences as any)?.specialization || "";
    const interests = expertise ? expertise.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
    return { ...p, college, branch, lang, company, quizFields, totalFields, interests };
  });

  const filtered = enriched
    .filter((p: any) => !q || (p.name || p.email || "").toLowerCase().includes(q.toLowerCase()))
    .filter((p: any) => filter === "all" ? true : filter === "students" ? p._role === "Student" : p._role === "Mentor");

  const studentCount = allProfiles.filter((p: any) => p._role === "Student").length;
  const mentorCount = allProfiles.filter((p: any) => p._role === "Mentor").length;

  return (
    <PageShell title="Registrations" subtitle="All onboarding data captured from the mobile app"
      action={<><BtnSecondary><RefreshCw className="w-4 h-4" />Refresh</BtnSecondary><BtnSecondary><Download className="w-4 h-4" />Export CSV</BtnSecondary></>}>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Registrations", value: allProfiles.length, color: "text-slate-900", icon: null },
          { label: "Students",            value: studentCount,       color: "text-emerald-600", icon: GraduationCap },
          { label: "Mentors",             value: mentorCount,        color: "text-blue-600",    icon: Users },
          { label: "Avg Completion",      value: "100%",             color: "text-blue-600",    icon: null },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className={cn("text-[28px] font-bold", s.color)}>{s.value}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {s.icon && <s.icon className={cn("w-3.5 h-3.5", s.color)} />}
              <p className="text-[12px] text-slate-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1"><SearchInput value={q} onChange={setQ} placeholder="Search by name, email, or bio..." /></div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {(["all","students","mentors"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("h-7 px-3 rounded-lg text-[12px] font-medium capitalize transition-colors",
                filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((p: any) => {
          const bg = initialsColor(p.name);
          const pct = Math.round((p.quizFields / p.totalFields) * 100);
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-bold text-white shrink-0", bg)}>
                    {initials(p.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-slate-900 truncate">{p.name || "—"}</p>
                    <p className="text-[12px] text-slate-400 truncate">{p.email || "—"}</p>
                  </div>
                </div>
                <Pill color={p._role === "Student" ? "green" : "blue"}>{p._role}</Pill>
              </div>

              {p.interests.length > 0 && (
                <p className="text-[12px] text-slate-600 mb-2">{p.interests.slice(0,3).join(", ")}</p>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {[p.college, p.branch, p.lang].filter((t) => t && t !== "—").map((tag) => (
                  <span key={tag} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{tag}</span>
                ))}
                {p.company && (
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{p.company}</span>
                )}
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Quiz: {p.quizFields}/{p.totalFields} answered</span>
                  <span className="font-semibold">{pct || 100}%</span>
                </div>
                <PBar value={pct || 100} color="bg-emerald-500" height="h-1" />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{p.created_at ? timeAgo(p.created_at) : "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />View All
                  </button>
                  <button className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">No registrations found</div>
        )}
      </div>
    </PageShell>
  );
}

// ─── Mapping ──────────────────────────────────────────────────────────────────
function MappingPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { students = [], mentors = [], mapping = [], courses = [], enrollments = [] } = data;
  const [tab, setTab] = useState<"overview"|"awaiting"|"available"|"all">("overview");
  const [q, setQ] = useState("");

  const mappedStudentIds = new Set(mapping.map((m: any) => m.student_id));
  const awaitingStudents = students.filter((s: any) => !mappedStudentIds.has(s.id)).map((s: any) => {
    const enrollment = enrollments.find((e: any) => e.student_id === s.id);
    const course = enrollment ? courses.find((c: any) => c.id === enrollment.course_id) : null;
    return { ...s, courseName: course?.title || "General" };
  });

  const mentorMenteeCount = (mentorId: string) => mapping.filter((m: any) => m.mentor_id === mentorId).length;
  const MAX_MENTEES = 5;
  const availableMentors = mentors.filter((m: any) => mentorMenteeCount(m.id) < MAX_MENTEES).map((m: any) => {
    const current = mentorMenteeCount(m.id);
    const rating = (4.5 + seedNum(m.id, 4) * 0.1).toFixed(1);
    const specialization = m.expertise || (m.preferences as any)?.specialization || "General";
    return { ...m, current, slots: MAX_MENTEES - current, rating, specialization };
  });

  const stats = [
    { label: "Active Mappings",      value: mapping.filter((m: any) => m.status !== "inactive").length, color: "text-emerald-600", icon: ArrowRightLeft, iconBg: "bg-emerald-100" },
    { label: "Awaiting Students",    value: awaitingStudents.length, color: "text-amber-600", icon: Clock, iconBg: "bg-amber-100" },
    { label: "Mentors with Capacity",value: availableMentors.length, color: "text-blue-600",  icon: Users, iconBg: "bg-blue-100" },
    { label: "Total Mentors",        value: mentors.length,          color: "text-violet-600",icon: UserCheck, iconBg: "bg-violet-100" },
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "awaiting", label: `Awaiting Students (${awaitingStudents.length})` },
    { key: "available",label: `Available Mentors (${availableMentors.length})` },
    { key: "all",      label: `All Mappings (${mapping.length})` },
  ];

  return (
    <PageShell title="Mentor-Student Mapping" subtitle="Assign mentors to students and manage mentorship pairings."
      action={<BtnPrimary><ArrowRightLeft className="w-4 h-4" />Assign Mentor</BtnPrimary>}>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.iconBg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <span className={cn("text-[12px] font-semibold", s.color)}>{stats[0].label === s.label ? "Active" : s.label.split(" ")[0]}</span>
            </div>
            <p className={cn("text-[28px] font-bold", s.color)}>{s.value}</p>
            <p className="text-[12px] text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="border-b border-slate-100">
          <div className="flex px-4 pt-3 gap-1">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key as any)}
                className={cn("h-9 px-4 rounded-t-lg text-[13px] font-medium transition-colors border-b-2",
                  tab === t.key ? "border-slate-900 text-slate-900 bg-slate-50" : "border-transparent text-slate-500 hover:text-slate-700")}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <SearchInput value={q} onChange={setQ} placeholder="Search students or mentors..." />
        </div>

        {(tab === "overview" || tab === "awaiting" || tab === "available") && (
          <div className={cn("grid gap-6 px-4 pb-4", tab === "overview" ? "grid-cols-2" : "grid-cols-1")}>
            {(tab === "overview" || tab === "awaiting") && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" /> Awaiting Students
                    <span className="text-amber-500 font-bold">{awaitingStudents.length}</span>
                  </h3>
                  <button className="text-[12px] text-blue-500">View all</button>
                </div>
                <div className="flex flex-col gap-2">
                  {awaitingStudents.slice(0, 6).map((s: any) => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Av name={s.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}`} size={8} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800">{s.name || "—"}</p>
                        <p className="text-[11px] text-slate-400">{s.courseName} · Since {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</p>
                      </div>
                      <button className="h-8 px-3 bg-slate-900 text-white text-[12px] font-medium rounded-lg flex items-center gap-1 hover:bg-slate-700 transition-colors">
                        <ArrowRightLeft className="w-3 h-3" />Assign
                      </button>
                    </div>
                  ))}
                  {awaitingStudents.length === 0 && <p className="text-[13px] text-slate-400 py-4">All students are assigned!</p>}
                </div>
              </div>
            )}

            {(tab === "overview" || tab === "available") && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500" /> Mentor Availability
                    <span className="text-blue-500 font-bold">{availableMentors.length} available</span>
                  </h3>
                  <button className="text-[12px] text-blue-500">View all</button>
                </div>
                <div className="flex flex-col gap-2">
                  {availableMentors.slice(0, 6).map((m: any) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Av name={m.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`} size={8} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800">{m.name || "—"}</p>
                        <p className="text-[11px] text-slate-400">{m.specialization} · {m.current}/{MAX_MENTEES} mentees</p>
                      </div>
                      <div className="flex items-center gap-2 text-right shrink-0">
                        <span className="flex items-center gap-0.5 text-[12px] text-amber-500 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{m.rating}
                        </span>
                        <span className="text-[12px] font-bold text-emerald-600">{m.slots} slots</span>
                      </div>
                    </div>
                  ))}
                  {availableMentors.length === 0 && <p className="text-[13px] text-slate-400 py-4">All mentors are at capacity.</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "all" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mentor</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mapped On</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mapping.map((m: any) => {
                  const student = students.find((s: any) => s.id === m.student_id);
                  const mentor = mentors.find((mn: any) => mn.id === m.mentor_id);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/30">
                      <td className="px-5 py-3 text-[13px] text-slate-700 font-medium">{student?.name || m.student_id || "—"}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-600">{mentor?.name || m.mentor_id || "—"}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-500">{m.circle_id || "Direct"}</td>
                      <td className="px-4 py-3 text-[13px] text-slate-500">{m.mapped_at ? new Date(m.mapped_at).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3"><Pill color={m.status === "inactive" ? "red" : "green"}>{m.status || "active"}</Pill></td>
                    </tr>
                  );
                })}
                {mapping.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-[13px] text-slate-400">No mappings yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

// ─── Enrollments ──────────────────────────────────────────────────────────────
function EnrollmentsPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { students = [], courses = [], enrollments = [] } = data;

  const enriched = enrollments.map((e: any) => {
    const student = students.find((s: any) => s.id === e.student_id);
    const course = courses.find((c: any) => c.id === e.course_id);
    const progress = seedNum(e.id || e.student_id + e.course_id, 95, 10);
    return { ...e, studentName: student?.name || "—", studentId: e.student_id, courseName: course?.title || "—", progress };
  });

  const nearCompletion = enriched.filter((e: any) => e.progress >= 75).length;
  const justStarted = enriched.filter((e: any) => e.progress <= 25).length;
  const avgProgress = enriched.length ? Math.round(enriched.reduce((s: number, e: any) => s + e.progress, 0) / enriched.length) : 0;
  const uniqueCourses = new Set(enrollments.map((e: any) => e.course_id)).size;

  return (
    <PageShell title="Enrollments" subtitle={`${enrollments.length} active enrollments across ${uniqueCourses} courses`}
      action={<BtnPrimary onClick={() => openModal("create-enrollment")}><Plus className="w-4 h-4" />Enroll Student</BtnPrimary>}>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"Total Enrollments", value: enrollments.length, color:"text-slate-900" },
          { label:"Near Completion",   value: nearCompletion,    color:"text-emerald-600" },
          { label:"Just Started",      value: justStarted,       color:"text-amber-600" },
          { label:"Avg Progress",      value: `${avgProgress}%`, color:"text-blue-600" },
        ].map((s) => (
          <Card key={s.label} className="p-5 text-center">
            <p className={cn("text-[28px] font-bold", s.color)}>{s.value}</p>
            <p className="text-[12px] text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Student</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Course</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Progress</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mentor Done</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enriched.map((e: any) => (
              <tr key={e.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Av name={e.studentName} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${e.studentId}`} size={8} />
                    <span className="text-[14px] font-semibold text-slate-800">{e.studentName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{e.courseName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", progressColor(e.progress))} style={{ width: `${e.progress}%` }} />
                    </div>
                    <span className="text-[13px] text-slate-600">{e.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Clock className="w-4 h-4 text-slate-300" />
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-500">
                  {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
            {enriched.length === 0 && <tr><td colSpan={5} className="px-4 py-16 text-center text-[13px] text-slate-400">No enrollments yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

// ─── Remaining pages (simpler implementations) ────────────────────────────────
function GamesPage({ data }: { data: any }) {
  const { games = [] } = data;
  return (
    <PageShell title="Games & Quizzes" subtitle={`${games.length} games`}>
      <Card>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Questions</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {games.map((g: any) => (
              <tr key={g.id} className="hover:bg-slate-50/30">
                <td className="px-5 py-3 text-[14px] font-semibold text-slate-800">{g.title}</td>
                <td className="px-4 py-3"><Pill color="violet">{g.type || "quiz"}</Pill></td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{Array.isArray(g.questions) ? g.questions.length : 5}</td>
                <td className="px-4 py-3"><Pill color={g.is_active ? "green" : "slate"}>{g.is_active ? "Active" : "Inactive"}</Pill></td>
              </tr>
            ))}
            {games.length === 0 && <tr><td colSpan={4} className="px-4 py-16 text-center text-[13px] text-slate-400">No games yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

function QuestionnairesPage({ data }: { data: any }) {
  const { questionnaires = [] } = data;
  return (
    <PageShell title="Questionnaires" subtitle="Onboarding questionnaire templates">
      <Card>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Target Role</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Description</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {questionnaires.map((q: any) => (
              <tr key={q.id} className="hover:bg-slate-50/30">
                <td className="px-5 py-3 text-[14px] font-semibold text-slate-800">{q.title}</td>
                <td className="px-4 py-3"><Pill color="blue">{q.target_role || "all"}</Pill></td>
                <td className="px-4 py-3 text-[13px] text-slate-500">{(q.description || "—").slice(0, 80)}</td>
                <td className="px-4 py-3"><Pill color={q.is_active ? "green" : "slate"}>{q.is_active ? "Yes" : "No"}</Pill></td>
              </tr>
            ))}
            {questionnaires.length === 0 && <tr><td colSpan={4} className="px-4 py-16 text-center text-[13px] text-slate-400">No questionnaires</td></tr>}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

function CirclesPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { circles = [], mentors = [], enrollments = [] } = data;
  return (
    <PageShell title="Circles" subtitle={`${circles.length} circles`}
      action={<BtnPrimary onClick={() => openModal("create-circle")}><Plus className="w-4 h-4" />Create Circle</BtnPrimary>}>
      <div className="grid grid-cols-3 gap-4">
        {circles.map((c: any) => {
          const mentor = mentors.find((m: any) => m.id === c.mentor_id);
          const memberCount = enrollments.filter((e: any) => e.circle_id === c.id).length;
          return (
            <Card key={c.id} className="p-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                <CircleIcon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-800">{c.name}</h3>
              <p className="text-[12px] text-slate-500 mt-1 line-clamp-2">{c.description || "No description"}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <span className="text-[12px] text-slate-400">{mentor?.name || "No mentor"}</span>
                <Pill color="blue">{memberCount} members</Pill>
              </div>
            </Card>
          );
        })}
        {circles.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <CircleIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No circles yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function SessionsPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { sessions = [] } = data;
  return (
    <PageShell title="Sessions" subtitle={`${sessions.length} sessions`}
      action={<BtnPrimary onClick={() => openModal("schedule-session")}><Plus className="w-4 h-4" />Schedule Session</BtnPrimary>}>
      <Card>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Duration</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Scheduled</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sessions.map((s: any) => (
              <tr key={s.id} className="hover:bg-slate-50/30">
                <td className="px-5 py-3 text-[14px] font-semibold text-slate-800">{s.title || "Untitled"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{s.duration_minutes ? `${s.duration_minutes}m` : "—"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-500">{s.scheduled_at ? new Date(s.scheduled_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-3"><Pill color={s.status==="completed"?"green":s.status==="cancelled"?"red":"blue"}>{s.status||"scheduled"}</Pill></td>
              </tr>
            ))}
            {sessions.length === 0 && <tr><td colSpan={4} className="px-4 py-16 text-center text-[13px] text-slate-400">No sessions yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

function ReviewsPage({ data }: { data: any }) {
  const { reviews = [] } = data;
  return (
    <PageShell title="Reviews" subtitle={`${reviews.length} reviews`}>
      <Card>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Reviewer</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Feedback</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reviews.map((r: any) => (
              <tr key={r.id} className="hover:bg-slate-50/30">
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{r.reviewer_id || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-500">{(r.feedback || "—").slice(0,80)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-0.5">
                    {Array.from({length:5}).map((_,i) => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i<(r.rating||0)?"text-amber-400 fill-amber-400":"text-slate-200 fill-slate-200")} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan={4} className="px-4 py-16 text-center text-[13px] text-slate-400">No reviews yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

function InspirationPage({ data, openModal }: { data: any; openModal: (m: ModalKey) => void }) {
  const { inspiration = [] } = data;
  return (
    <PageShell title="Inspiration" subtitle={`${inspiration.length} messages`}
      action={<BtnPrimary onClick={() => openModal("send-inspiration")}><Send className="w-4 h-4" />Send Inspiration</BtnPrimary>}>
      <div className="grid grid-cols-2 gap-4">
        {inspiration.map((i: any) => (
          <Card key={i.id} className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-[14px] text-slate-700 italic">"{i.content || i.title}"</p>
                {i.author && <p className="text-[12px] text-slate-400 mt-2">— {i.author}</p>}
                <div className="flex gap-2 mt-2">
                  <Pill color="violet">{i.type || "quote"}</Pill>
                  {i.is_published === false && <Pill color="amber">Draft</Pill>}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {inspiration.length === 0 && (
          <div className="col-span-2 py-16 text-center text-slate-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No inspiration messages yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function MessagesPage({ data }: { data: any }) {
  const { messages = [] } = data;
  return (
    <PageShell title="Messages" subtitle={`${messages.length} messages`}>
      <Card>
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">From</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Subject</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Body</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Sent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {messages.map((m: any) => (
              <tr key={m.id} className="hover:bg-slate-50/30">
                <td className="px-5 py-3 text-[13px] font-medium text-slate-700">{m.sender_name || m.from_user_id || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{m.subject || "—"}</td>
                <td className="px-4 py-3 text-[13px] text-slate-500">{(m.body || "—").slice(0,80)}</td>
                <td className="px-4 py-3 text-[13px] text-slate-500">{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {messages.length === 0 && <tr><td colSpan={4} className="px-4 py-16 text-center text-[13px] text-slate-400">No messages</td></tr>}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

function GratitudeWallPage({ data }: { data: any }) {
  const { gratitude_messages = [] } = data;
  return (
    <PageShell title="Gratitude Wall" subtitle={`${gratitude_messages.length} posts`}>
      <div className="grid grid-cols-3 gap-4">
        {gratitude_messages.map((p: any) => (
          <Card key={p.id} className="p-5 bg-gradient-to-br from-rose-50 to-amber-50 border-rose-100">
            <Heart className="w-5 h-5 text-rose-400 mb-3 fill-rose-200" />
            <p className="text-[14px] text-slate-700 italic">"{p.message_content || "—"}"</p>
            {p.display_name && <p className="text-[12px] text-slate-400 mt-3">— {p.display_name}{p.is_anonymous?" (anon)":""}</p>}
            {p.amount && <p className="text-[13px] font-bold text-emerald-600 mt-2">₹{Number(p.amount).toLocaleString()}</p>}
          </Card>
        ))}
        {gratitude_messages.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No gratitude messages yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function CSRSponsorsPage({ data }: { data: any }) {
  const { csr_sponsors = [] } = data;
  return (
    <PageShell title="CSR Sponsors" subtitle={`${csr_sponsors.length} sponsors`}>
      <div className="grid grid-cols-3 gap-4">
        {csr_sponsors.map((s: any) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                {s.avatar_initials || initials(s.name)}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800">{s.name}</h3>
                <p className="text-[12px] text-slate-400">{s.industry || "—"}</p>
              </div>
            </div>
            <p className="text-[12px] text-slate-500 line-clamp-2">{s.description || "—"}</p>
            <div className="flex justify-between mt-3 pt-3 border-t border-slate-100">
              {s.current_amount && <p className="text-[13px] font-bold text-emerald-600">₹{Number(s.current_amount).toLocaleString()}</p>}
              <Pill color={s.status==="active"?"green":"slate"}>{s.status||"active"}</Pill>
            </div>
          </Card>
        ))}
        {csr_sponsors.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <Handshake className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No sponsors yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function SettingsPage() {
  return (
    <PageShell title="Settings" subtitle="Platform configuration">
      <div className="grid grid-cols-2 gap-6">
        {[
          { label:"Platform Name",             key:"platform_name",             placeholder:"MentorHub" },
          { label:"Support Email",             key:"support_email",             placeholder:"support@kindmentor.in" },
          { label:"Max Students per Mentor",   key:"max_students",              placeholder:"10" },
          { label:"Default Session Duration",  key:"session_duration",          placeholder:"60 minutes" },
        ].map((f) => (
          <Card key={f.key} className="p-5">
            <FieldRow label={f.label}><TInput value="" onChange={() => {}} placeholder={f.placeholder} /></FieldRow>
          </Card>
        ))}
        <Card className="p-5">
          <h3 className="text-[14px] font-bold text-slate-800 mb-4">Feature Toggles</h3>
          {[
            "Gratitude Wall","Games & Quizzes","CSR Sponsors","Circles","Inspiration Feed",
          ].map((t) => (
            <div key={t} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-[13px] text-slate-700">{t}</span>
              <div className="w-10 h-5 rounded-full bg-slate-800 relative cursor-pointer">
                <div className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <h3 className="text-[14px] font-bold text-slate-800 mb-3">Danger Zone</h3>
          <p className="text-[12px] text-slate-500 mb-4">Irreversible actions. Proceed with caution.</p>
          <div className="flex flex-col gap-2">
            <button className="h-9 px-4 border border-red-200 text-red-600 text-[13px] font-medium rounded-xl hover:bg-red-50 text-left">Export All Data (CSV)</button>
            <button className="h-9 px-4 border border-red-200 text-red-600 text-[13px] font-medium rounded-xl hover:bg-red-50 text-left">Clear Test Data</button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, onNavigate }: { page: AdminPage; onNavigate: (p: AdminPage) => void }) {
  return (
    <aside className="w-52 h-full bg-white border-r border-slate-100 flex flex-col shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-bold text-slate-900">MentorHub</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_MAIN.map((item) => {
          const active = page === item.key;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key as AdminPage)}
              className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-left rounded-lg mx-1",
                active ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")}
              style={{ width: "calc(100% - 8px)" }}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
        <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">Others</p>
        {NAV_OTHERS.map((item) => {
          const active = page === item.key;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key as AdminPage)}
              className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-left rounded-lg mx-1",
                active ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50")}
              style={{ width: "calc(100% - 8px)" }}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────
function TopHeader() {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center gap-4 px-6 shrink-0">
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search..." className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 text-[13px] outline-none focus:border-slate-400" />
        </div>
      </div>
      <div className="flex-1" />
      <button className="text-[13px] font-medium text-slate-600 hover:text-slate-900">Mobile App</button>
      <button className="relative w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
        <span className="text-[11px] font-bold text-white">M</span>
      </div>
    </header>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────
export function AdminPanel() {
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [modal, setModal] = useState<ModalKey>(null);
  const [data, setData] = useState<any>({
    students: [], mentors: [], courses: [], sessions: [], enrollments: [],
    reviews: [], messages: [], mapping: [], circles: [], registrations: [],
    questionnaires: [], inspiration: [], gratitude_messages: [], csr_sponsors: [],
    games: [], studentQuiz: [], mentorQuiz: [],
  });

  const supabase = createClient();

  const fetchAll = useCallback(async () => {
    const q = async (fn: () => any): Promise<any[]> => {
      try { const { data: rows } = await fn(); return rows || []; } catch { return []; }
    };

    const [students, mentors, courses, sessions, enrollments, reviews, messages, mapping,
      circles, registrations, questionnaires, inspiration, gratitude_messages, csr_sponsors,
      games, studentQuiz, mentorQuiz] = await Promise.all([
      q(() => supabase.from("profiles").select("*").eq("role", "STUDENT").limit(200)),
      q(() => supabase.from("profiles").select("*").eq("role", "MENTOR").limit(200)),
      q(() => supabase.from("courses").select("*").limit(200)),
      q(() => supabase.from("sessions").select("*").limit(200)),
      q(() => supabase.from("enrollments").select("*").limit(200)),
      q(() => supabase.from("reviews").select("*").limit(200)),
      q(() => supabase.from("messages").select("*").limit(200)),
      q(() => supabase.from("mapping").select("*").limit(200)),
      q(() => supabase.from("circles").select("*").limit(200)),
      q(() => supabase.from("registrations").select("*").limit(200)),
      q(() => supabase.from("questionnaires").select("*").limit(200)),
      q(() => supabase.from("inspiration").select("*").limit(200)),
      q(() => supabase.from("gratitude_messages").select("*").limit(200)),
      q(() => supabase.from("csr_sponsors").select("*").limit(200)),
      q(() => supabase.from("games_quizzes").select("*").limit(200)),
      q(() => supabase.from("student_quiz_responses").select("*").limit(200)),
      q(() => supabase.from("mentor_quiz_responses").select("*").limit(200)),
    ]);

    setData({ students, mentors, courses, sessions, enrollments, reviews, messages, mapping,
      circles, registrations, questionnaires, inspiration, gratitude_messages, csr_sponsors,
      games, studentQuiz, mentorQuiz });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openModal = (m: ModalKey) => setModal(m);
  const closeModal = () => { setModal(null); fetchAll(); };

  const renderPage = () => {
    switch (page) {
      case "dashboard":      return <DashboardPage data={data} onNavigate={setPage} openModal={openModal} />;
      case "courses":        return <CoursesPage data={data} />;
      case "mentors":        return <MentorsPage data={data} openModal={openModal} />;
      case "mentees":        return <MenteesPage data={data} openModal={openModal} />;
      case "registrations":  return <RegistrationsPage data={data} />;
      case "mapping":        return <MappingPage data={data} openModal={openModal} />;
      case "enrollments":    return <EnrollmentsPage data={data} openModal={openModal} />;
      case "games":          return <GamesPage data={data} />;
      case "questionnaires": return <QuestionnairesPage data={data} />;
      case "circles":        return <CirclesPage data={data} openModal={openModal} />;
      case "sessions":       return <SessionsPage data={data} openModal={openModal} />;
      case "reviews":        return <ReviewsPage data={data} />;
      case "inspiration":    return <InspirationPage data={data} openModal={openModal} />;
      case "messages":       return <MessagesPage data={data} />;
      case "gratitude-wall": return <GratitudeWallPage data={data} />;
      case "csr-sponsors":   return <CSRSponsorsPage data={data} />;
      case "settings":       return <SettingsPage />;
      default:               return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar page={page} onNavigate={setPage} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>

      {modal === "add-student"       && <AddStudentModal onClose={closeModal} courses={data.courses} />}
      {modal === "add-mentor"        && <AddMentorModal onClose={closeModal} />}
      {modal === "schedule-session"  && <ScheduleSessionModal onClose={closeModal} students={data.students} mentors={data.mentors} />}
      {modal === "send-inspiration"  && <SendInspirationModal onClose={closeModal} students={data.students} mentors={data.mentors} />}
      {modal === "create-enrollment" && <CreateEnrollmentModal onClose={closeModal} students={data.students} courses={data.courses} circles={data.circles} />}
      {modal === "create-circle"     && <CreateCircleModal onClose={closeModal} mentors={data.mentors} />}
    </div>
  );
}
