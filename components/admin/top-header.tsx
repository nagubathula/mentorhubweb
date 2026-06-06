"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Search, UserPlus, AlertCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

function timeAgo(d: string): string {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function TopHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [unmapped, setUnmapped] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const fetchData = async () => {
    try {
      // 1. Fetch unassigned profiles (role is null)
      const { data: unassignedList } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .is('role', null)
        .order('created_at', { ascending: false });
      
      setUnassigned(unassignedList || []);

      // 2. Fetch unmapped students
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .eq('role', 'STUDENT');
      
      const { data: mappings } = await supabase
        .from('mapping')
        .select('student_id');

      if (studentProfiles && mappings) {
        const mappedIds = new Set(mappings.map(m => m.student_id));
        const unmappedList = studentProfiles.filter(s => !mappedIds.has(s.id));
        // Sort by created_at descending
        unmappedList.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        setUnmapped(unmappedList);
      } else {
        setUnmapped([]);
      }
    } catch (error) {
      console.error("Error fetching notification data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('admin-notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mapping' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    ...unassigned.map(u => ({
      id: `unassigned-${u.id}`,
      type: "unassigned",
      title: "New Google Registration",
      description: `${u.name || u.email || 'Google User'} needs role assignment.`,
      time: u.created_at,
    })),
    ...unmapped.map(s => ({
      id: `unmapped-${s.id}`,
      type: "unmapped",
      title: "Unmapped Student",
      description: `${s.name || s.email} has no mentor assigned.`,
      time: s.created_at,
    }))
  ];

  notifications.sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime());

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-white shrink-0">
      <div className="flex-1 flex max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-300" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 bg-slate-50/50 border border-slate-100 shadow-none text-[13px] font-medium placeholder:text-slate-400 h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 ml-2 md:ml-4">
        <Link href="#" className="hidden lg:block text-[13px] text-slate-400 font-medium hover:text-slate-900 transition-colors">
          Mobile App
        </Link>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-xl border border-slate-100 focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
              </>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-50">
                <span className="text-[14px] font-bold text-slate-800">Pending Actions</span>
                {notifications.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[11px] font-semibold">
                    {notifications.length} Action{notifications.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-[13px] flex flex-col items-center gap-2">
                    <Bell className="w-8 h-8 text-slate-200" />
                    <span>All caught up! No pending actions.</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors flex items-start gap-3 border-b border-slate-50/50 last:border-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        n.type === 'unassigned' ? 'bg-amber-50 text-amber-600' : 'bg-violet-50 text-violet-600'
                      }`}>
                        {n.type === 'unassigned' ? <UserPlus className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight truncate">{n.title}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{n.description}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{timeAgo(n.time)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-medium text-white cursor-pointer shadow-lg border-2 border-white ring-1 ring-slate-100 overflow-hidden">
           M
        </div>
      </div>
    </header>
  );
}
