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
  Heart,
  Handshake,
  Settings,
  ChevronLeft
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
  { name: "Messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Gratitude Wall", href: "/admin/gratitude-wall", icon: Heart },
  { name: "CSR Sponsors", href: "/admin/csr-sponsors", icon: Handshake },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col justify-between hidden md:flex shrink-0">
      <div className="overflow-y-auto w-full pt-6">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="bg-[#0f172a] p-1.5 rounded-md flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-lg flex-1">MentorHub</span>
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
                    ? "bg-[#0f172a] text-white"
                    : "text-slate-500 hover:bg-slate-100"
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
                    ? "bg-[#0f172a] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t">
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors px-3 py-2">
          <ChevronLeft className="w-4 h-4" />
          <span>Collapse</span>
        </button>
      </div>
    </div>
  );
}
