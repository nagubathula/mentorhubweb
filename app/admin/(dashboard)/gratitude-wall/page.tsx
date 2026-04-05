import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, IndianRupee, Sparkles, ChevronDown, User, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function GratitudeWallPage() {
  const messages = [
    {
      id: 1,
      sender: "Arjun Mehta",
      initials: "AR",
      color: "bg-purple-100 text-purple-700",
      time: "2 days ago",
      amount: "₹200",
      content: '"Thank you to my mentor for helping me understand SQL. This platform changed my career!"',
    },
    {
      id: 2,
      sender: "Anonymous",
      initials: "A",
      color: "bg-slate-100 text-slate-500",
      time: "3 days ago",
      amount: "₹100",
      content: '"Grateful for the free mentorship. Keep up the great work!"',
      isAnonymous: true,
    },
    {
      id: 3,
      sender: "Priya Sharma",
      initials: "PR",
      color: "bg-pink-100 text-pink-700",
      time: "5 days ago",
      amount: "₹50",
      content: '"The community here is amazing. My mentor guided me through my first React project."',
    },
    {
      id: 4,
      sender: "Anonymous",
      initials: "A",
      color: "bg-slate-100 text-slate-500",
      time: "1 week ago",
      amount: "₹100",
      content: '"Small contribution but big thanks. This platform is a blessing for students like me."',
      isAnonymous: true,
    },
    {
      id: 5,
      sender: "Karthik Nair",
      initials: "KA",
      color: "bg-blue-100 text-blue-700",
      time: "1 week ago",
      amount: "₹500",
      content: '"I got my first internship thanks to the guidance I received here. Forever grateful!"',
    },
    {
      id: 6,
      sender: "Sneha Iyer",
      initials: "SN",
      color: "bg-indigo-100 text-indigo-700",
      time: "2 weeks ago",
      amount: "₹200",
      content: '"Thank you for making quality mentorship accessible to everyone."',
    },
  ];

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Gratitude Wall</h1>
        </div>
        <p className="text-[15px] text-slate-500 mt-1">Support the learning community & view heartfelt messages</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-slate-900">47</div>
            <div className="text-[13px] text-slate-500 font-medium">Total Contributions</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-emerald-600">₹15,800</div>
            <div className="text-[13px] text-slate-500 font-medium">Total Raised</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-slate-900">8</div>
            <div className="text-[13px] text-slate-500 font-medium">This Month</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-slate-900">₹336</div>
            <div className="text-[13px] text-slate-500 font-medium">Avg Contribution</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Left Column - Contribution Flow */}
        <div className="w-[420px] shrink-0 space-y-6">
          {/* Info banner */}
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 flex gap-3">
            <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-rose-800 leading-relaxed font-medium">
              This mentorship platform runs as a community-driven initiative to help students learn with guidance from mentors. If this platform helped you, you may contribute voluntarily to support the platform's operational costs.
            </p>
          </div>

          {/* Cost Card */}
          <Card className="border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">Total Cost Last Month</div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">₹28,000</div>
                  <p className="text-xs text-slate-500 max-w-[250px]">These costs keep the platform running for all students.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100 text-amber-600">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mt-4 hover:text-blue-700 transition-colors">
                <ChevronDown className="w-4 h-4" />
                <span>View Cost Breakdown</span>
              </button>
            </CardContent>
          </Card>

          {/* Contribute Card */}
          <Card className="border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-rose-600 font-medium">
                <Heart className="w-5 h-5" />
                <span>Contribute with Gratitude</span>
              </div>
              <p className="text-[13px] text-slate-600 mb-5">
                If you found value in this mentorship program, you may contribute to help cover operational costs.
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {["₹50", "₹100", "₹200", "₹500", "Custom"].map((amt, i) => (
                  <button key={i} className={`px-4 py-2 border rounded-full text-sm transition-colors ${i === 1 ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                    {amt}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="text-xs text-slate-500 mb-2 block">Leave a gratitude note (optional)</label>
                <Textarea 
                  placeholder="e.g. Thank you to my mentor for helping me understand SQL." 
                  className="resize-none h-20 text-sm border-slate-200 bg-slate-50/50 shadow-none focus-visible:ring-1"
                />
              </div>

              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 mb-6">
                <button className="flex-1 flex items-center justify-center gap-2 text-xs py-2 bg-slate-900 text-white rounded-md font-medium shadow-sm">
                  <User className="w-3.5 h-3.5" />
                  Show my name
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 text-xs py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors">
                  <EyeOff className="w-3.5 h-3.5" />
                  Post anonymously
                </button>
              </div>

              <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-400 cursor-not-allowed border-none h-11" disabled>
                <Heart className="w-4 h-4 mr-2 opacity-50" />
                Contribute with Gratitude
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Messages List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="text-[15px] font-semibold text-slate-900">Community Messages</h2>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
              {["All", "Named", "Anonymous"].map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    filter === "All"
                      ? "bg-[#0f172a] text-white font-medium shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className="border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white shadow-sm">
                        <AvatarFallback className={`${msg.color} text-[11px] font-semibold`}>
                          {msg.isAnonymous && <EyeOff className="w-4 h-4" />}
                          {!msg.isAnonymous && msg.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-[13px] text-slate-900">{msg.sender}</div>
                        <div className="text-xs text-slate-400">{msg.time}</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-100">
                      {msg.amount}
                    </div>
                  </div>
                  <p className="text-[13px] text-slate-600 italic">
                    {msg.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
