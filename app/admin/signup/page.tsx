"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function AdminSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || password.length < 6) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push("/admin/dashboard");
    } else {
      setConfirmEmail(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center justify-center mb-8 gap-3">
          <div className="mb-2 hover:scale-105 transition-all duration-300">
            <img src="/logo.svg" alt="Kind Mentor Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kind Mentor</h1>
          <p className="text-sm text-slate-500 font-medium">Admin Portal Access</p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
          <CardHeader className="space-y-1 pb-6 px-6 pt-6">
            <CardTitle className="text-xl font-semibold">Create an Account</CardTitle>
            <CardDescription className="text-slate-500 text-[14px]">
              Set up your administrator credentials
            </CardDescription>
          </CardHeader>

          {confirmEmail ? (
            <CardContent className="px-6 pb-6">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                <p className="font-medium text-slate-900">Check your email</p>
                <p className="text-sm text-slate-500">
                  We sent a confirmation link to{" "}
                  <span className="font-medium text-slate-700">{email}</span>.
                  Click it to activate your account.
                </p>
                <Link href="/admin/login" className="text-sm text-blue-600 font-medium hover:underline mt-2">
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Dr. Mentor"
                    className="bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 shadow-none h-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@kindmentor.com"
                    className="bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 shadow-none h-10"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password <span className="text-slate-400 font-normal">(min. 6 characters)</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 shadow-none h-10"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm text-red-600">
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-4">
                <Button
                  className="w-full bg-[#0f172a] hover:bg-slate-800 text-white shadow-sm h-10 disabled:opacity-50"
                  disabled={loading || !email.includes("@") || password.length < 6}
                  onClick={handleSignUp}
                >
                  {loading ? "Creating account…" : "Create Admin Account"}
                </Button>
                <div className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href="/admin/login" className="text-blue-600 font-medium hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
