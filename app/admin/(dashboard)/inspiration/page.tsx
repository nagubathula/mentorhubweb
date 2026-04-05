import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function InspirationPage() {
  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Inspiration</h1>
        <p className="text-[15px] text-slate-500 mt-1">Manage inspiration</p>
      </div>

      <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Wrench className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-900">Coming Soon</p>
          <p className="text-[15px] mt-1 text-center max-w-sm">This page is currently under construction. Check back later for updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}
