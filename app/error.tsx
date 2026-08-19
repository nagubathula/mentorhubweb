"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("KindMentor App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-100 flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            The application encountered a temporary issue. Don't worry, your data and progress are safe.
          </p>
        </div>
        {error?.message && (
          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Error Details</p>
            <p className="text-xs font-mono text-slate-700 mt-0.5 break-words line-clamp-3">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3 w-full pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-200"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="h-11 rounded-xl border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
