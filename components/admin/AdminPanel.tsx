"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, GraduationCap, UserCheck, Users, FileText,
  ArrowRightLeft, BookOpen, Gamepad2, HelpCircle, Circle as CircleIcon,
  CalendarDays, Star, Sparkles, MessageCircle, Heart, Handshake,
  Settings, Search, Bell, Plus, X, Menu, Send,
  TrendingUp, Zap, Target, Clock, Flame, Trophy,
  ChevronDown, CheckCircle, ArrowRight, ArrowLeft, Check, Video,
  UserPlus, Shield, RefreshCw, Download, Upload,
  MapPin, BookMarked, Layers, BarChart2, Activity, ChevronRight,
  ChevronLeft, Cpu, Lightbulb, Save, Trash2, Edit3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { mentorCoursesCatalog, MentorCourse } from "@/lib/mentorCoursesData";
import { CourseDetailsScreen } from "./CourseDetailsScreen";
import { CourseCustomizer } from "./CourseCustomizer";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminPage =
  | "dashboard" | "courses" | "mentors" | "mentees" | "registrations"
  | "mapping" | "enrollments" | "games" | "questionnaires" | "circles"
  | "sessions" | "reviews" | "inspiration" | "messages" | "gratitude-wall"
  | "csr-sponsors" | "settings";

type ModalKey =
  | "add-student" | "add-mentor" | "schedule-session"
  | "send-inspiration" | "create-enrollment" | "create-circle" | "create-mapping" 
  | "edit-course" | null;

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
  if (t.includes("data") || t.includes("analytic")) return { bg: "bg-blue-500",    text: "text-blue-600",    light: "bg-blue-50",    ring: "ring-blue-100" };
  if (t.includes("vlsi") || t.includes("hardware")) return { bg: "bg-red-500",     text: "text-red-600",     light: "bg-red-50",     ring: "ring-red-100" };
  if (t.includes("embed") || t.includes("iot"))     return { bg: "bg-teal-500",    text: "text-teal-600",    light: "bg-teal-50",    ring: "ring-teal-100" };
  if (t.includes("ux") || t.includes("design"))     return { bg: "bg-violet-500",  text: "text-violet-600",  light: "bg-violet-50",  ring: "ring-violet-100" };
  if (t.includes("python") || t.includes("ml"))     return { bg: "bg-amber-500",   text: "text-amber-600",   light: "bg-amber-50",   ring: "ring-amber-100" };
  if (t.includes("cloud") || t.includes("devops"))  return { bg: "bg-cyan-500",    text: "text-cyan-600",    light: "bg-cyan-50",    ring: "ring-cyan-100" };
  if (t.includes("comm") || t.includes("signal"))   return { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50", ring: "ring-emerald-100" };
  if (t.includes("digit") || t.includes("circuit")) return { bg: "bg-indigo-500",  text: "text-indigo-600",  light: "bg-indigo-50",  ring: "ring-indigo-100" };
  return { bg: "bg-slate-500", text: "text-slate-600", light: "bg-slate-50", ring: "ring-slate-100" };
}

function courseIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("data") || t.includes("analytic")) return BarChart2;
  if (t.includes("design") || t.includes("ux")) return Sparkles;
  if (t.includes("python") || t.includes("ml")) return Layers;
  if (t.includes("cloud") || t.includes("devops")) return Shield;
  if (t.includes("vlsi") || t.includes("micro")) return Zap;
  if (t.includes("comm") || t.includes("signal") || t.includes("digit")) return Activity;
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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card as ShadcnCard, CardContent as ShadcnCardContent } from "@/components/ui/card";

function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <ShadcnCard onClick={onClick} className={cn("rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:translate-y-0", onClick && "cursor-pointer hover:shadow-md hover:border-slate-200 transition-all", className)}>
      <ShadcnCardContent className="p-0">
        {children}
      </ShadcnCardContent>
    </ShadcnCard>
  );
}

function BtnPrimary({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button"|"submit" }) {
  return (
    <Button type={type} onClick={onClick} className="h-9 px-4 bg-[#0f172a] text-white text-[13px] font-medium rounded-xl hover:bg-[#1e293b] transition-colors flex items-center gap-1.5 shrink-0">
      {children}
    </Button>
  );
}

function BtnSecondary({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <Button variant="outline" type="button" onClick={onClick} className="h-9 px-4 border border-slate-200 text-slate-600 text-[13px] font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 shrink-0 bg-white">
      {children}
    </Button>
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
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 text-[13px] outline-none focus:border-slate-400 transition-colors shadow-none" />
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
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="h-9 w-full border border-slate-200 rounded-lg px-3 text-[13px] outline-none focus:border-slate-400 bg-white shadow-none" />
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
    <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-slate-400 bg-white resize-none shadow-none min-h-16" />
  );
}

function ModalWrap({ title, onClose, onSave, children }: {
  title: string; onClose: () => void; onSave: () => void; children: React.ReactNode;
}) {
  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-[16px] font-bold text-slate-900">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-5 py-4 flex flex-col gap-4 text-slate-700">{children}</div>
        <DialogFooter className="flex justify-end gap-2 px-5 pb-5 pt-2 bg-slate-50 border-t border-slate-100">
          <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={onSave}>Save</BtnPrimary>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [target, setTarget] = useState("all"); const [category, setCategory] = useState("Quote");
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
      <FieldRow label="Category"><SInput value={category} onChange={setCategory} options={[{ value:"Quote",label:"Quote"},{ value:"Tip",label:"Tip"},{ value:"Challenge",label:"Challenge"},{ value:"Story",label:"Story"}]} /></FieldRow>
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
  const [circle, setCircle] = useState(""); const [status, setStatus] = useState("Active");
  const supabase = createClient();
  const save = async () => {
    if (!student || !course) return;
    
    let actualCourseId = course;
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(actualCourseId);

    if (!isUUID) {
      const selectedCourse = courses.find(c => c.id === course);
      if (selectedCourse) {
        const coursePayload = {
          title: selectedCourse.title,
          description: selectedCourse.description,
          status: 'Active'
        };
        const { data: newCourse, error: createError } = await supabase.from('courses').insert(coursePayload).select().single();
        if (createError) {
          alert("Error creating course: " + createError.message);
          return;
        }
        actualCourseId = newCourse.id;
      }
    }

    await supabase.from("enrollments").insert({ student_id: student, course_id: actualCourseId, circle_id: circle||null, status });
    onClose();
  };
  return (
    <ModalWrap title="Create Enrollment" onClose={onClose} onSave={save}>
      <FieldRow label="Student"><SInput value={student} onChange={setStudent} options={students.map((s) => ({ value: s.id, label: s.name||s.email }))} /></FieldRow>
      <FieldRow label="Course"><SInput value={course} onChange={setCourse} options={courses.map((c) => ({ value: c.id, label: c.title||c.id }))} /></FieldRow>
      <FieldRow label="Circle (optional)"><SInput value={circle} onChange={setCircle} options={circles.map((c) => ({ value: c.id, label: c.name||c.id }))} /></FieldRow>
      <FieldRow label="Status"><SInput value={status} onChange={setStatus} options={[{ value:"Active",label:"Active"},{ value:"Paused",label:"Paused"},{ value:"Completed",label:"Completed"},{ value:"Dropped",label:"Dropped"}]} /></FieldRow>
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

function CreateMappingModal({ onClose, students, mentors, circles }: { onClose: () => void; students: any[]; mentors: any[]; circles: any[] }) {
  const [student, setStudent] = useState(""); 
  const [mentor, setMentor] = useState("");
  const [circle, setCircle] = useState(""); 
  const [status, setStatus] = useState("Active");
  const supabase = createClient();
  const save = async () => {
    if (!student || !mentor) return;
    const { error } = await supabase.from("mapping").insert({ student_id: student, mentor_id: mentor, circle_id: circle||null, status });
    if (error) {
      alert("Error mapping student: " + error.message);
    } else {
      alert("Student mapped successfully!");
      onClose();
    }
  };
  return (
    <ModalWrap title="Assign Mentor to Student" onClose={onClose} onSave={save}>
      <FieldRow label="Student"><SInput value={student} onChange={setStudent} options={students.map((s) => ({ value: s.id, label: s.name||s.email }))} /></FieldRow>
      <FieldRow label="Mentor"><SInput value={mentor} onChange={setMentor} options={mentors.map((m) => ({ value: m.id, label: m.name||m.email }))} /></FieldRow>
      <FieldRow label="Circle (optional)"><SInput value={circle} onChange={setCircle} options={circles.map((c) => ({ value: c.id, label: c.name||c.id }))} /></FieldRow>
      <FieldRow label="Status"><SInput value={status} onChange={setStatus} options={[{ value:"Active",label:"Active"},{ value:"Inactive",label:"Inactive"}]} /></FieldRow>
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
    { label: "+ Map",      bg: "bg-emerald-500 hover:bg-emerald-600", modal: "create-mapping" as ModalKey },
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
        <div className="flex flex-wrap gap-2 justify-end">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => a.modal && openModal(a.modal)}
              className={cn("h-9 px-4 text-white text-[13px] font-semibold rounded-xl transition-colors whitespace-nowrap", a.bg)}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {metrics.map((m) => (
          <Card key={m.label} className="p-3 flex flex-col items-center text-center gap-1">
            <m.icon className="w-4 h-4 text-slate-400" />
            <p className="text-[18px] font-bold text-slate-800 leading-none">{m.value}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide leading-tight">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
function CourseItem({ course, onView, onEdit }: { course: MentorCourse; onView: (c: MentorCourse) => void; onEdit: (c: MentorCourse) => void }) {
  const iconMap: Record<string, any> = {
    "Data Analytics": BarChart2,
    "VLSI Design": Zap,
    "Embedded Systems": Cpu,
    "UX Design": Lightbulb,
  };
  const Icon = iconMap[course.title] || GraduationCap;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-6 bg-white hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 relative"
      onClick={() => onView(course)}
    >
      <div className="flex items-start gap-6">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105", course.bgColor || "bg-blue-600")}>
           <Icon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{course.title}</h3>
            <span className="px-3 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider">{course.difficulty}</span>
            {course.enrolled && <span className="px-3 py-0.5 rounded-lg bg-violet-50 text-violet-600 text-[11px] font-bold uppercase tracking-wider">Enrolled</span>}
          </div>
          
          <p className="text-[14px] text-slate-500 line-clamp-1 mb-4 leading-relaxed font-medium">{course.description}</p>
          
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-[12px] font-semibold text-slate-400">
             <span>{course.modules?.length || 10} modules</span>
             <span>35 lessons</span>
             <span>42 hours</span>
             <span className="text-slate-500">{course.category || "General"}</span>
             <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">
                <HelpCircle className="w-3.5 h-3.5" /> 5 quiz Q
             </span>
          </div>
        </div>
        
        <ChevronDown className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors mt-2" />
      </div>
      
      {/* Progress Bar at the bottom */}
      <div className="mt-6 flex items-center gap-4">
         <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-1000", course.bgColor || "bg-blue-600")} style={{ width: `${course.progress || 0}%` }} />
         </div>
         <span className="text-[12px] font-bold text-slate-400">{course.progress || 0}%</span>
      </div>
    </motion.div>
  );
}

function CoursesPage({ data, setSelectedCourse, setCourseViewMode, onEdit }: { 
  data: any; 
  setSelectedCourse: (c: MentorCourse | null) => void;
  setCourseViewMode: (m: "list" | "detail" | "edit") => void;
  onEdit: (c: MentorCourse) => void 
}) {
  const [activeTab, setActiveTab] = useState<"All" | "Enrolled" | "Available">("All");
  const [q, setQ] = useState("");

  const allCourses = [...(data.courses || []), ...mentorCoursesCatalog.filter(c => !(data.courses || []).find((sc: any) => sc.title === c.title))];

  const filtered = allCourses.filter(c => {
    const matchesTab = activeTab === "All" || (activeTab === "Enrolled" ? c.enrolled : !c.enrolled);
    const matchesSearch = (c.title || "").toLowerCase().includes(q.toLowerCase()) || (c.description || "").toLowerCase().includes(q.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const enrolledCount = allCourses.filter(c => c.enrolled).length;

  return (
    <PageShell 
      title="Course Library" 
      subtitle={`${allCourses.length} courses · ${enrolledCount} enrolled`}
      action={
        <div className="flex gap-3">
          <button className="h-11 px-6 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Upload className="w-4 h-4 text-slate-400" /> Upload Course
          </button>
          <button onClick={() => onEdit({} as any)} className="h-11 px-6 bg-[#0f172a] text-white text-[13px] font-bold rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="w-5 h-5" /> Add Course
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex gap-3 p-1 bg-white rounded-full border border-slate-100 shadow-sm">
            {["All", "Enrolled", "Available"].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t as any)}
                className={cn(
                  "px-6 py-2 rounded-full text-[13px] font-bold transition-all",
                  activeTab === t ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="w-full md:w-80">
            <SearchInput value={q} onChange={setQ} placeholder="Search courses..." />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden divide-y divide-slate-50 shadow-sm">
          {filtered.map(c => (
            <CourseItem 
              key={c.id} 
              course={c} 
              onView={(course) => { setSelectedCourse(course); setCourseViewMode("detail"); }} 
              onEdit={onEdit} 
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-400 text-[14px] font-medium">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
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
      const activeMentees = mapping.filter((mp: any) => mp.mentor_id === m.id && mp.status !== "Inactive").length;
      const totalMentees = activeMentees + seedNum(m.id, 30, 10);
      const rating = (4.5 + seedNum(m.id, 4) * 0.1).toFixed(1);
      const status = seedNum(m.id, 10) > 8 ? "On Leave" : "Active";
      const specialization = m.expertise || (m.preferences as any)?.specialization || "General";
      return { ...m, activeMentees, totalMentees, rating, status, specialization };
    });

  return (
    <PageShell title="Mentors" subtitle={`${mentors.length} active mentors`}
      action={<BtnPrimary onClick={() => openModal("add-mentor")}><Plus className="w-4 h-4" />Add Mentor</BtnPrimary>}>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100"><SearchInput value={q} onChange={setQ} placeholder="Search mentors…" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
        </div>
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
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100"><SearchInput value={q} onChange={setQ} placeholder="Search mentees…" /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
        </div>
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
    { label: "Active Mappings",      value: mapping.filter((m: any) => m.status !== "Inactive").length, color: "text-emerald-600", icon: ArrowRightLeft, iconBg: "bg-emerald-100" },
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
      action={<BtnPrimary onClick={() => openModal("create-mapping")}><ArrowRightLeft className="w-4 h-4" />Assign Mentor</BtnPrimary>}>

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
                      <button onClick={() => openModal("create-mapping")} className="h-8 px-3 bg-slate-900 text-white text-[12px] font-medium rounded-lg flex items-center gap-1 hover:bg-slate-700 transition-colors">
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
                      <td className="px-4 py-3"><Pill color={m.status === "Inactive" ? "red" : "green"}>{m.status || "Active"}</Pill></td>
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
function GamesPage({ data, fetchAll }: { data: any, fetchAll: () => void }) {
  const { games = [] } = data;
  const supabase = createClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = games.find((g: any) => g.id === selectedId);

  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("");
  const [editQuestions, setEditQuestions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selected) {
      setEditTitle(selected.title || "");
      setEditType(selected.type || "quiz");
      setEditQuestions(Array.isArray(selected.questions) ? selected.questions : []);
    }
  }, [selected]);

  const handleSave = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("games_quizzes")
      .update({
        title: editTitle,
        type: editType,
        questions: editQuestions
      })
      .eq("id", selectedId);
    
    setIsSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      fetchAll();
      setSelectedId(null);
    }
  };

  if (selectedId && selected) {
    return (
      <PageShell 
        title="Edit Game/Quiz" 
        subtitle={`Modifying ${selected.title}`}
        action={
          <div className="flex gap-3">
             <BtnSecondary onClick={() => setSelectedId(null)}>Cancel</BtnSecondary>
             <BtnPrimary onClick={handleSave} disabled={isSaving}>
               {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
             </BtnPrimary>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-[14px] font-bold text-slate-900 mb-4 uppercase tracking-widest">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-slate-400 uppercase mb-1.5 block">Game Title</label>
                  <input 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-400 uppercase mb-1.5 block">Game Type</label>
                  <select 
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-slate-200 outline-none"
                  >
                    <option value="quiz">Standard Quiz</option>
                    <option value="kbc">KBC Style</option>
                    <option value="coding">Coding Challenge</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-widest">Question Bank</h3>
                <BtnSecondary onClick={() => setEditQuestions([...editQuestions, { 
                  id: `q-${Date.now()}`, 
                  question: "New Question Text", 
                  options: ["Option A", "Option B", "Option C", "Option D"], 
                  correctIndex: 0, 
                  difficulty: "easy" 
                }])}>
                  <Plus className="w-4 h-4" /> Add Question
                </BtnSecondary>
              </div>

              <div className="space-y-6">
                {editQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[12px] font-bold text-slate-400 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <input 
                          value={q.question}
                          onChange={(e) => {
                            const newQ = [...editQuestions];
                            newQ[idx].question = e.target.value;
                            setEditQuestions(newQ);
                          }}
                          className="w-full bg-transparent border-none text-[16px] font-bold text-slate-900 focus:ring-0 p-0 mb-4"
                          placeholder="What is the question?"
                        />
                        <div className="grid grid-cols-2 gap-3">
                           {q.options.map((opt: string, oIdx: number) => (
                             <div key={oIdx} className="flex items-center gap-2">
                               <input 
                                 type="radio" 
                                 name={`correct-${idx}`} 
                                 checked={q.correctIndex === oIdx}
                                 onChange={() => {
                                   const newQ = [...editQuestions];
                                   newQ[idx].correctIndex = oIdx;
                                   setEditQuestions(newQ);
                                 }}
                                 className="w-4 h-4 text-blue-600"
                               />
                               <input 
                                 value={opt}
                                 onChange={(e) => {
                                   const newQ = [...editQuestions];
                                   newQ[idx].options[oIdx] = e.target.value;
                                   setEditQuestions(newQ);
                                 }}
                                 className="flex-1 h-9 px-3 bg-white border border-slate-100 rounded-lg text-[13px] font-medium outline-none focus:border-blue-200"
                               />
                             </div>
                           ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => setEditQuestions(editQuestions.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50">
                       <select 
                         value={q.difficulty}
                         onChange={(e) => {
                           const newQ = [...editQuestions];
                           newQ[idx].difficulty = e.target.value;
                           setEditQuestions(newQ);
                         }}
                         className="text-[11px] font-bold uppercase tracking-wider bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none"
                       >
                         <option value="easy">Easy</option>
                         <option value="medium">Medium</option>
                         <option value="hard">Hard</option>
                       </select>
                       <span className="text-[11px] font-bold text-slate-400 uppercase">Difficulty</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Games & Quizzes" subtitle={`${games.length} content templates`}>
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Game Title</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Questions</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {games.map((g: any) => (
              <tr key={g.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-[15px] font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{g.title}</td>
                <td className="px-6 py-4"><Pill color="violet">{g.type || "quiz"}</Pill></td>
                <td className="px-6 py-4 text-[13px] font-bold text-slate-600">{Array.isArray(g.questions) ? g.questions.length : 0} Items</td>
                <td className="px-6 py-4"><Pill color={g.is_active ? "green" : "slate"}>{g.is_active ? "Live" : "Inactive"}</Pill></td>
                <td className="px-6 py-4 text-right">
                   <button 
                     onClick={() => setSelectedId(g.id)}
                     className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                   >
                     Manage
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

function QuestionnaireManager({ questionnaire, onBack, onSave }: { questionnaire: any, onBack: () => void, onSave: () => void }) {
  const [title, setTitle] = useState(questionnaire.title || "");
  const [description, setDescription] = useState(questionnaire.description || "");
  const [questions, setQuestions] = useState<any[]>(Array.isArray(questionnaire.questions) ? JSON.parse(JSON.stringify(questionnaire.questions)) : []);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const saveChanges = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('questionnaires')
      .update({ title, description, questions })
      .eq('id', questionnaire.id);

    setIsSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      onSave();
      onBack();
    }
  };

  const addPhase = () => {
    setQuestions([...questions, {
      step: questions.length + 1,
      title: "New Phase",
      icon: "Star",
      color: "#3b82f6",
      questions: []
    }]);
  };

  const removePhase = (idx: number) => {
    if (!confirm("Are you sure you want to remove this entire phase?")) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const addQuestion = (phaseIdx: number) => {
    const newQs = [...questions];
    newQs[phaseIdx].questions.push({
      id: `q-${Date.now()}`,
      text: "New Question Text?",
      type: "chips",
      options: ["Option 1", "Option 2"]
    });
    setQuestions(newQs);
  };

  const removeQuestion = (phaseIdx: number, qIdx: number) => {
    const newQs = [...questions];
    newQs[phaseIdx].questions = newQs[phaseIdx].questions.filter((_: any, i: number) => i !== qIdx);
    setQuestions(newQs);
  };

  const updateQuestion = (phaseIdx: number, qIdx: number, field: string, val: any) => {
    const newQs = [...questions];
    newQs[phaseIdx].questions[qIdx][field] = val;
    setQuestions(newQs);
  };

  return (
    <div className="space-y-6 pb-32 max-w-5xl mx-auto">
      {/* Premium Header */}
      <Card className="p-8 bg-slate-900 border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full -mr-40 -mt-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-blue-500/30">
                LIVE EDITOR
              </div>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <h1 className="text-white/40 text-[12px] font-bold uppercase tracking-widest">Questionnaire Settings</h1>
            </div>
            
            <div className="space-y-2">
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-transparent border-none text-3xl md:text-5xl font-black text-white p-0 focus:ring-0 placeholder:text-white/10 tracking-tight" 
                placeholder="Questionnaire Title"
              />
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full bg-transparent border-none text-slate-400 text-[16px] p-0 focus:ring-0 resize-none min-h-[40px] placeholder:text-white/20 leading-relaxed" 
                placeholder="Brief description of this questionnaire..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="h-12 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl flex items-center gap-2 transition-all border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>
            <button 
              onClick={saveChanges}
              disabled={isSaving}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              SAVE CHANGES
            </button>
          </div>
        </div>
      </Card>

      {/* Main Content Areas */}
      <div className="space-y-16 mt-12">
        {questions.map((step: any, sIdx: number) => (
          <div key={sIdx} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${sIdx * 100}ms` }}>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[18px] shadow-xl ring-4 ring-slate-100">
                {sIdx + 1}
              </div>
              <div className="flex-1 flex items-center gap-4">
                <input 
                  value={step.title}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[sIdx].title = e.target.value;
                    setQuestions(newQs);
                  }}
                  className="text-[24px] font-black text-slate-800 bg-transparent border-none p-0 focus:ring-0 flex-1 placeholder:text-slate-200"
                  placeholder="Phase Title (e.g. Education & Language)"
                />
                <button 
                  onClick={() => removePhase(sIdx)}
                  className="opacity-0 group-hover:opacity-100 p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden md:block h-[2px] bg-slate-100 flex-[0.5] rounded-full" />
            </div>

            <div className="grid grid-cols-1 gap-8">
              {step.questions.map((q: any, qIdx: number) => (
                <Card key={qIdx} className="p-8 border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group/q bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-slate-50 group-hover/q:bg-blue-600 transition-colors" />
                  
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover/q:text-blue-600 group-hover/q:bg-blue-50 flex items-center justify-center font-black text-[15px] transition-all border border-slate-100 group-hover/q:border-blue-100">
                        {String(qIdx + 1).padStart(2, '0')}
                      </div>
                      <button 
                        onClick={() => removeQuestion(sIdx, qIdx)}
                        className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all lg:mt-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="w-full sm:w-[220px]">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Display Type</label>
                          <select 
                            value={q.type} 
                            onChange={(e) => updateQuestion(sIdx, qIdx, "type", e.target.value)}
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[13px] font-bold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                          >
                            <option value="input">Standard Text Input</option>
                            <option value="chips">Multiple Choice Chips</option>
                          </select>
                        </div>
                        <div className="w-full sm:w-[120px]">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Q-Label</label>
                          <input 
                            value={q.number || `Q${qIdx + 1}.`} 
                            onChange={(e) => updateQuestion(sIdx, qIdx, "number", e.target.value)}
                            className="w-full h-11 text-[13px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-200 transition-all text-center"
                          />
                        </div>
                        <div className="flex-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Question Content</label>
                        <textarea 
                          value={q.text || q.question || ""} 
                          onChange={(e) => updateQuestion(sIdx, qIdx, q.text ? "text" : "question", e.target.value)}
                          placeholder="What would you like to ask students?"
                          rows={2}
                          className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-[18px] font-bold text-slate-900 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all outline-none placeholder:text-slate-200 leading-relaxed"
                        />
                      </div>

                      {(q.type === "chips" || q.options) && (
                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Options List</label>
                            <span className="text-[10px] text-slate-300 font-medium">Separate with commas</span>
                          </div>
                          <input 
                            value={Array.isArray(q.options) ? q.options.join(", ") : ""} 
                            onChange={(e) => updateQuestion(sIdx, qIdx, "options", e.target.value.split(",").map(s => s.trim()))}
                            placeholder="e.g. Option A, Option B, Option C..."
                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-5 text-[14px] text-slate-600 focus:border-blue-400 transition-all outline-none shadow-sm"
                          />
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(q.options) && q.options.filter(Boolean).map((opt: string, oi: number) => (
                              <div key={oi} className="px-4 py-1.5 bg-blue-50/50 border border-blue-100 rounded-xl text-[12px] text-blue-600 font-bold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {q.type === "input" && (
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Input Hint (Placeholder)</label>
                          <input 
                            value={q.placeholder || ""} 
                            onChange={(e) => updateQuestion(sIdx, qIdx, "placeholder", e.target.value)}
                            placeholder="e.g. Type your college name here..."
                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-5 text-[14px] text-slate-600 focus:border-blue-400 transition-all outline-none shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              <button 
                onClick={() => addQuestion(sIdx)}
                className="w-full py-6 bg-white border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 flex items-center justify-center gap-3 font-black text-[15px] uppercase tracking-widest"
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Plus className="w-5 h-5" />
                </div>
                Add New Question to this phase
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addPhase}
          className="w-full py-12 bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[40px] text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-500 flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-black text-[18px] uppercase tracking-[0.2em] ml-2">Create New Phase</span>
        </button>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-700">
        <div className="hidden md:block">
          <p className="text-white text-[14px] font-bold tracking-tight">{questions.length} Phases</p>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Live Configuration</p>
        </div>
        <div className="w-px h-8 bg-white/10 hidden md:block" />
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white/60 hover:text-white text-[14px] font-bold px-4">Discard</button>
          <button 
            onClick={saveChanges}
            disabled={isSaving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-900/40 transition-all active:scale-95"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            FINALIZE & PUBLISH
          </button>
        </div>
      </div>
    </div>
  );
}


function QuestionnairesPage({ data, onView, onEdit }: { data: any, onView: (q: any) => void, onEdit: (q: any) => void }) {
  const { questionnaires = [] } = data;

  const courseQuestions = questionnaires.filter((q: any) => 
    q.title.toLowerCase().includes("course") || 
    q.title.toLowerCase().includes("bank")
  );
  
  const onboardingQuestionnaires = questionnaires.filter((q: any) => 
    !courseQuestions.some((cq: any) => cq.id === q.id)
  );

  const renderTable = (list: any[], title: string) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <div className="h-6 w-1 bg-blue-600 rounded-full" />
        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h3>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Flow Title</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Target Role</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Questions</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((q: any) => {
              const totalQs = Array.isArray(q.questions) 
                ? q.questions.reduce((acc: number, step: any) => acc + (step.questions?.length || 0), 0)
                : 0;
              
              return (
                <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-slate-900">{q.title}</span>
                      <span className="text-[12px] text-slate-400 font-medium truncate max-w-[300px]">{q.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Pill color="blue">{q.target_role || "all"}</Pill></td>
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-600">{totalQs} Questions</td>
                  <td className="px-6 py-4"><Pill color={q.is_active ? "green" : "slate"}>{q.is_active ? "Live" : "Draft"}</Pill></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => onView(q)}
                      className="text-[11px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => onEdit(q)}
                      className="text-[11px] font-extrabold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 text-[13px] font-medium italic">
                  No {title.toLowerCase()} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );

  return (
    <PageShell title="Questionnaires" subtitle="Onboarding and Course question templates">
      <div className="space-y-12">
        {renderTable(onboardingQuestionnaires, "Onboarding Flow")}
        {renderTable(courseQuestions, "Course Questions")}
      </div>
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
          { label:"Platform Name",             key:"platform_name",             placeholder:"Kind Mentor" },
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

// Main AdminPanel component rendered within a layout
export function AdminPanel({ initialPage = "dashboard" }: { initialPage?: AdminPage }) {
  const [page, setPage] = useState<AdminPage>(initialPage);
  const [modal, setModal] = useState<ModalKey>(null);
  const [data, setData] = useState<any>({
    students: [], mentors: [], courses: [], sessions: [], enrollments: [],
    reviews: [], messages: [], mapping: [], circles: [], registrations: [],
    questionnaires: [], inspiration: [], gratitude_messages: [], csr_sponsors: [],
    games: [], studentQuiz: [], mentorQuiz: [],
  });

  const [selectedCourse, setSelectedCourse] = useState<MentorCourse | null>(null);
  const [courseViewMode, setCourseViewMode] = useState<"list" | "detail" | "edit">("list");

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any | null>(null);
  const [qViewMode, setQViewMode] = useState<"list" | "detail" | "edit">("list");

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

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const openModal = (m: ModalKey) => setModal(m);
  const closeModal = () => { setModal(null); fetchAll(); };

  const renderPage = () => {
    switch (page) {
      case "dashboard":      return <DashboardPage data={data} onNavigate={setPage} openModal={openModal} />;
      case "courses":        
        if (courseViewMode === "detail" && selectedCourse) {
          return <CourseDetailsScreen 
            course={selectedCourse as any} 
            onBack={() => setCourseViewMode("list")} 
            adminData={data}
          />;
        }
        if (courseViewMode === "edit") {
          return <CourseCustomizer 
            initialCourse={selectedCourse || {
              id: `c-${Date.now()}`,
              title: "New Course",
              shortTitle: "New Path",
              description: "Course description here",
              color: "text-blue-600",
              bgColor: "bg-blue-500",
              icon: <BookOpen className="w-5 h-5" />,
              category: "Engineering",
              difficulty: "Beginner",
              duration: "10 hours",
              modules: [],
              enrolled: false,
              progress: 0
            }} 
            onSave={async (updatedData) => { 
              console.log("Saving course data:", updatedData); 
              
              const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(updatedData.id);
              const payload = {
                title: updatedData.title,
                description: updatedData.description,
                status: 'Active',
              };

              let error;
              if (isUUID) {
                const { error: err } = await supabase
                  .from('courses')
                  .update(payload)
                  .eq('id', updatedData.id);
                error = err;
              } else {
                const { error: err } = await supabase
                  .from('courses')
                  .insert({
                    ...payload,
                    id: updatedData.id
                  });
                error = err;
              }

              if (error) {
                alert("Error saving course: " + error.message);
              } else {
                setCourseViewMode("list"); 
                fetchAll();
              }
            }} 
            onCancel={() => setCourseViewMode("list")} 
          />;
        }
        return <CoursesPage 
          data={data} 
          setSelectedCourse={setSelectedCourse}
          setCourseViewMode={setCourseViewMode}
          onEdit={(c) => { setSelectedCourse(c); setCourseViewMode("edit"); }}
        />;
      case "mentors":        return <MentorsPage data={data} openModal={openModal} />;
      case "mentees":        return <MenteesPage data={data} openModal={openModal} />;
      case "registrations":  return <RegistrationsPage data={data} />;
      case "mapping":        return <MappingPage data={data} openModal={openModal} />;
      case "enrollments":    return <EnrollmentsPage data={data} openModal={openModal} />;
      case "games":          return <GamesPage data={data} fetchAll={fetchAll} />;
      case "questionnaires": 
        if ((qViewMode === "detail" || qViewMode === "edit") && selectedQuestionnaire) {
          return <QuestionnaireManager 
            questionnaire={selectedQuestionnaire} 
            onBack={() => setQViewMode("list")} 
            onSave={fetchAll}
          />;
        }
        return <QuestionnairesPage 
          data={data} 
          onView={(q) => { setSelectedQuestionnaire(q); setQViewMode("detail"); }}
          onEdit={(q) => { setSelectedQuestionnaire(q); setQViewMode("edit"); }}
        />;
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
    <div className="flex flex-col flex-1 min-w-0">
      {renderPage()}

      {modal === "add-student"       && <AddStudentModal onClose={closeModal} courses={data.courses} />}
      {modal === "add-mentor"        && <AddMentorModal onClose={closeModal} />}
      {modal === "schedule-session"  && <ScheduleSessionModal onClose={closeModal} students={data.students} mentors={data.mentors} />}
      {modal === "send-inspiration"  && <SendInspirationModal onClose={closeModal} students={data.students} mentors={data.mentors} />}
      {modal === "create-enrollment" && <CreateEnrollmentModal onClose={closeModal} students={data.students} courses={data.courses} circles={data.circles} />}
      {modal === "create-circle"     && <CreateCircleModal onClose={closeModal} mentors={data.mentors} />}
      {modal === "create-mapping"    && <CreateMappingModal onClose={closeModal} students={data.students} mentors={data.mentors} circles={data.circles} />}
    </div>
  );
}
