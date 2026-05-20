"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Users,
  Settings,
  MessageCircle
} from "lucide-react";

const navItems = [
  { name: "Dash", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/admin/courses", icon: GraduationCap },
  { name: "Mentors", href: "/admin/mentors", icon: UserCheck },
  { name: "Mentees", href: "/admin/mentees", icon: Users },
  { name: "Chat", href: "/admin/messages", icon: MessageCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-between px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
              isActive ? "text-[#0f172a]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
            <span className="text-[10px] font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
