import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="text-[15px] text-slate-500 mt-1">Manage your admin preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white/70">
          <div className="p-6 pb-4">
            <h2 className="text-[15px] font-medium text-slate-900">Profile</h2>
          </div>
          <CardContent className="p-6 pt-0 flex gap-6">
            <div className="flex-1 space-y-2">
              <Label htmlFor="display-name" className="text-xs text-slate-500 font-normal">Display Name</Label>
              <Input
                id="display-name"
                defaultValue="Dr. Mentor"
                className="bg-slate-50/50 border-slate-100 placeholder:text-slate-400 h-10 shadow-none rounded-lg"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="email" className="text-xs text-slate-500 font-normal">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="mentor@mentorhub.com"
                className="bg-slate-50/50 border-slate-100 placeholder:text-slate-400 h-10 shadow-none rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white/70">
          <div className="p-6 pb-4">
            <h2 className="text-[15px] font-medium text-slate-900">Notifications</h2>
          </div>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-1" className="text-sm font-normal text-slate-600">New student messages</Label>
              <Switch id="notif-1" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-2" className="text-sm font-normal text-slate-600">Review submissions</Label>
              <Switch id="notif-2" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-3" className="text-sm font-normal text-slate-600">Session reminders</Label>
              <Switch id="notif-3" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-4" className="text-sm font-normal text-slate-600">Weekly digest</Label>
              <Switch id="notif-4" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* App Card */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white/70">
          <div className="p-6 pb-4">
            <h2 className="text-[15px] font-medium text-slate-900">App</h2>
          </div>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Mobile onboarding app</span>
              <a href="#" className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Open App
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Version</span>
              <span className="text-sm text-slate-400">1.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
