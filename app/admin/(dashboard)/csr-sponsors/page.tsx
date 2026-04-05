import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Handshake, Plus, Search, Eye, Pencil, Trash2, Users, UserCheck } from "lucide-react";

export default function CSRSponsorsPage() {
  const sponsors = [
    {
      name: "Infosys Foundation",
      industry: "Information Technology",
      status: "Active",
      description: "Supporting education and skill development through technology-driven mentorship programs.",
      tags: ["Education", "Skill Development", "Digital Literacy"],
      progress: { current: "₹800K", total: "₹1500K", percentage: 53 },
      stats: { mentees: 120, mentors: 3 },
      avatar: "IF"
    },
    {
      name: "Wipro Cares",
      industry: "Information Technology",
      status: "Active",
      description: "Empowering underprivileged students with access to quality tech education and mentorship.",
      tags: ["Education", "Sustainability", "Community Development"],
      progress: { current: "₹500K", total: "₹800K", percentage: 63 },
      stats: { mentees: 75, mentors: 2 },
      avatar: "WC"
    },
    {
      name: "Tata Trusts",
      industry: "Conglomerate",
      status: "Active",
      description: "Bridging the education gap by sponsoring mentorship programs for rural and semi-urban students.",
      tags: ["Rural Education", "Healthcare", "Livelihood"],
      progress: { current: "₹1200K", total: "₹2500K", percentage: 48 },
      stats: { mentees: 200, mentors: 3 },
      avatar: "TT"
    },
    {
      name: "Reliance Foundation",
      industry: "Conglomerate",
      status: "Prospect",
      description: "In discussions for sponsoring STEM mentorship tracks for first generation learners.",
      tags: ["Education", "Sports", "Rural Transformation"],
      progress: { current: "₹0", total: "₹0", percentage: 0 },
      stats: { mentees: 0, mentors: 0 },
      avatar: "RF"
    },
    {
      name: "HCL Foundation",
      industry: "Information Technology",
      status: "Completed",
      description: "Completed a pilot mentorship program and evaluating next phase of partnership.",
      tags: ["Education", "Environment", "Health"],
      progress: { current: "₹600K", total: "₹600K", percentage: 100 },
      stats: { mentees: 50, mentors: 1 },
      avatar: "HF"
    },
    {
      name: "Zoho Schools",
      industry: "Software",
      status: "Pending",
      description: "MoU signed, awaiting first tranche disbursement for student mentorship sponsorship.",
      tags: ["Education", "Rural Youth", "Open Source"],
      progress: { current: "₹150K", total: "₹400K", percentage: 38 },
      stats: { mentees: 30, mentors: 2 },
      avatar: "ZS"
    }
  ];

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Handshake className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">CSR Sponsors</h1>
          </div>
          <p className="text-[15px] text-slate-500 mt-1">Manage sponsor companies participating in CSR activity</p>
        </div>
        <Button className="bg-[#0f172a] hover:bg-slate-800 text-white rounded-full px-6 h-10">
          <Plus className="w-4 h-4 mr-2" />
          Add Sponsor
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-slate-900">3</div>
            <div className="text-[13px] text-slate-500 font-medium">Active Partners</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-emerald-600">₹58.0L</div>
            <div className="text-[13px] text-slate-500 font-medium">Total Pledged</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-blue-600">₹32.5L</div>
            <div className="text-[13px] text-slate-500 font-medium">Disbursed</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-xl bg-white/70">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[104px]">
            <div className="text-2xl font-bold text-purple-600">475</div>
            <div className="text-[13px] text-slate-500 font-medium">Students Impacted</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search sponsors..."
            className="w-full pl-9 bg-white border-slate-200 h-9 rounded-md shadow-sm"
          />
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {["All", "Active", "Pending", "Prospect", "Completed"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                filter === "All"
                  ? "bg-[#0f172a] text-white font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor, index) => (
          <Card key={index} className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden flex flex-col">
            <CardContent className="p-5 flex-1 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <Avatar className="h-10 w-10 border border-slate-100">
                    <AvatarFallback className="bg-slate-50 text-slate-600 font-semibold">{sponsor.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-900">{sponsor.name}</h3>
                    <p className="text-xs text-slate-500">{sponsor.industry}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`
                  ${sponsor.status === 'Active' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}
                  ${sponsor.status === 'Prospect' ? 'text-slate-600 border-slate-200 bg-slate-50' : ''}
                  ${sponsor.status === 'Completed' ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}
                  ${sponsor.status === 'Pending' ? 'text-amber-600 border-amber-200 bg-amber-50' : ''}
                  text-[11px] font-medium rounded-full px-2.5 py-0.5 shadow-none
                `}>
                  {sponsor.status}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-[13px] text-slate-600 leading-snug mb-4 flex-1">
                {sponsor.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sponsor.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">{sponsor.progress.current} / {sponsor.progress.total}</span>
                  <span className="font-medium text-slate-700">{sponsor.progress.percentage}%</span>
                </div>
                <Progress value={sponsor.progress.percentage} className={`h-1.5 ${sponsor.status === 'Active' ? '[&>div]:bg-emerald-500' : sponsor.status === 'Pending' ? '[&>div]:bg-amber-500' : sponsor.status === 'Completed' ? '[&>div]:bg-blue-500' : '[&>div]:bg-slate-300'}`} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{sponsor.stats.mentees}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>{sponsor.stats.mentors}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
