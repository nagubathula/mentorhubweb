import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function TopHeader() {
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
        <Link href="#" className="hidden lg:block text-[13px] text-slate-400 font-bold hover:text-slate-900 transition-colors">
          Mobile App
        </Link>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-xl border border-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white cursor-pointer shadow-lg border-2 border-white ring-1 ring-slate-100 overflow-hidden">
           M
        </div>
      </div>
    </header>
  );
}
