import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo/Branding Centered Above */}
        <div className="flex flex-col items-center justify-center mb-8 gap-3">
          <div className="bg-[#0f172a] p-3 rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">MentorHub</h1>
          <p className="text-sm text-slate-500 font-medium">Admin Portal Access</p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
          <CardHeader className="space-y-1 pb-6 px-6 pt-6">
            <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
            <CardDescription className="text-slate-500 text-[14px]">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mentorhub.com"
                className="bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 shadow-none h-10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <Link href="#" className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 shadow-none h-10"
              />
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-4">
            {/* The button links directly to dashboard as a mock action */}
            <Link href="/admin/dashboard" className="w-full">
              <Button className="w-full bg-[#0f172a] hover:bg-slate-800 text-white shadow-sm h-10">
                Sign In to Dashboard
              </Button>
            </Link>
            <div className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/admin/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
