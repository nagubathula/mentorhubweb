import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function TopHeader() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex-1 flex max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 bg-slate-50 border-none shadow-none text-sm placeholder:text-slate-400 h-9 rounded-md focus-visible:ring-1 focus-visible:ring-slate-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 ml-4">
        <Link href="#" className="text-sm text-slate-600 font-medium hover:text-slate-900 transition-colors">
          Mobile App
        </Link>
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-slate-100">
          <AvatarImage src="" />
          <AvatarFallback className="bg-slate-900 text-white text-xs font-medium">M</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
