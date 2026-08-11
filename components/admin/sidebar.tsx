"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Users,
  FileText,
  ArrowRightLeft,
  BookOpen,
  Gamepad2,
  HelpCircle,
  Circle,
  CalendarDays,
  Star,
  Sparkles,
  MessageCircle,
  MessageSquare,
  Heart,
  Handshake,
  Settings,
  ChevronLeft,
  StickyNote,
  Lightbulb,
  LogOut
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/admin/courses", icon: GraduationCap },
  { name: "Mentors", href: "/admin/mentors", icon: UserCheck },
  { name: "Mentees", href: "/admin/mentees", icon: Users },
  { name: "Registrations", href: "/admin/registrations", icon: FileText },
  { name: "Mapping", href: "/admin/mapping", icon: ArrowRightLeft },
  { name: "Enrollments", href: "/admin/enrollments", icon: BookOpen },
  { name: "Games & Quizzes", href: "/admin/games-quizzes", icon: Gamepad2 },
  { name: "Questionnaires", href: "/admin/questionnaires", icon: HelpCircle },
  { name: "Circles", href: "/admin/circles", icon: Circle },
];

const othersNavItems = [
  { name: "Sessions", href: "/admin/sessions", icon: CalendarDays },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Inspiration", href: "/admin/inspiration", icon: Sparkles },
  { name: "Interesting Facts", href: "/admin/facts", icon: Lightbulb },
  { name: "Messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Gratitude Wall", href: "/admin/gratitude-wall", icon: Heart },
  { name: "Running Notes", href: "/admin/notes", icon: StickyNote },
  { name: "User Feedback", href: "/admin/feedback", icon: MessageSquare },
  { name: "CSR Sponsors", href: "/admin/csr-sponsors", icon: Handshake },
  { name: "Feature Controls", href: "/admin/features", icon: Settings },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col justify-between hidden md:flex shrink-0">
      <div className="overflow-y-auto w-full pt-6">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-medium text-xl flex-1 tracking-tight text-slate-900">MentorHub</span>
        </div>

        <div className="flex flex-col px-3 space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors group",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-indigo-100/50"
                    : "text-slate-500 hover:bg-slate-100 font-medium"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <span>{item.name}</span>
              </Link>
            )
          })}

          <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            OTHERS
          </div>

          {othersNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors group",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-indigo-100/50"
                    : "text-slate-500 hover:bg-slate-100 font-medium"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t flex flex-col gap-1">
        <button 
          onClick={() => {
            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors px-3 py-2 rounded-lg font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
