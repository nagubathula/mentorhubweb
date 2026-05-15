import { Users, Search, Star, Plus, Check, LogOut, ArrowLeft, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MentorCircle() {
  const [circles, setCircles] = useState<any[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [circleMembers, setCircleMembers] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();

  const fetchCirclesAndMemberships = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setCurrentUser(session.user);

      // Fetch all circles
      const { data: dbCircles } = await supabase.from('circles').select('*').order('created_at', { ascending: false });
      
      if (dbCircles) {
        const circlesWithCount = await Promise.all(dbCircles.map(async (c) => {
          const { count } = await supabase
            .from('circle_members')
            .select('*', { count: 'exact', head: true })
            .eq('circle_id', c.id);

          let isMember = false;
          if (session) {
            const { data: membership } = await supabase
              .from('circle_members')
              .select('*')
              .eq('circle_id', c.id)
              .eq('student_id', session.user.id)
              .maybeSingle();
            isMember = !!membership;
          }

          return {
            ...c,
            memberCount: count || 0,
            isMember
          };
        }));
        setCircles(circlesWithCount);
      }
    } catch (e) {
      console.error("Error fetching circles:", e);
    }
  };

  useEffect(() => {
    fetchCirclesAndMemberships();

    const fetchMentors = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'MENTOR');
      if (data) {
        setMentors(data.map((m, idx) => ({
          id: m.id,
          name: m.name || m.email?.split('@')[0] || 'Unknown Mentor',
          role: m.expertise || "Mentor",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.id}`,
          top: idx < 3
        })));
      }
    };
    fetchMentors();
  }, []);

  const handleCreateCircle = async () => {
    if (!newCircleName.trim() || !newCircleDesc.trim() || !currentUser) return;
    try {
      const { data, error } = await supabase.from('circles').insert({
        name: newCircleName.trim(),
        description: newCircleDesc.trim(),
        created_by: currentUser.id
      }).select().single();

      if (error) {
        console.error("Error creating circle:", error);
        alert(error.message);
        return;
      }

      await supabase.from('circle_members').insert({
        circle_id: data.id,
        student_id: currentUser.id
      });

      setNewCircleName("");
      setNewCircleDesc("");
      setIsCreateOpen(false);
      fetchCirclesAndMemberships();
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinCircle = async (circleId: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('circle_members').insert({
        circle_id: circleId,
        student_id: currentUser.id
      });
      if (error) console.error("Error joining circle:", error);
      fetchCirclesAndMemberships();
      if (selectedCircle && selectedCircle.id === circleId) {
        fetchCircleMembers(circleId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveCircle = async (circleId: string) => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('student_id', currentUser.id);
      if (error) console.error("Error leaving circle:", error);
      fetchCirclesAndMemberships();
      if (selectedCircle && selectedCircle.id === circleId) {
        fetchCircleMembers(circleId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCircleMembers = async (circleId: string) => {
    try {
      const { data: memberships } = await supabase
        .from('circle_members')
        .select('student_id')
        .eq('circle_id', circleId);

      if (memberships && memberships.length > 0) {
        const memberIds = memberships.map(m => m.student_id).filter((id): id is string => !!id);
        const { data: dbProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', memberIds);

        if (dbProfiles) {
          setCircleMembers(dbProfiles.map(p => ({
            id: p.id,
            name: p.name || p.email?.split('@')[0] || "Member",
            role: p.role,
            expertise: p.expertise || p.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`
          })));
        }
      } else {
        setCircleMembers([]);
      }
    } catch (e) {
      console.error("Error fetching circle members:", e);
    }
  };

  const selectCircle = async (circle: any) => {
    if (selectedCircle && selectedCircle.id === circle.id) {
      setSelectedCircle(null);
      setCircleMembers([]);
    } else {
      setSelectedCircle(circle);
      fetchCircleMembers(circle.id);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Mentorship Circles</h2>
          <p className="text-[13px] text-slate-500 font-medium">{circles.length} Active communities</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Circle</span>
        </Button>
      </div>

      {isCreateOpen && (
        <Card className="p-5 border-indigo-100 bg-indigo-50/20 space-y-3">
          <h4 className="text-sm font-bold text-slate-800">Create Circle</h4>
          <input 
            type="text" 
            placeholder="Circle Name"
            value={newCircleName}
            onChange={(e) => setNewCircleName(e.target.value)}
            className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-200"
          />
          <textarea 
            placeholder="Circle Description..."
            value={newCircleDesc}
            onChange={(e) => setNewCircleDesc(e.target.value)}
            rows={2}
            className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-200 resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1 py-2 text-xs font-semibold rounded-xl">Cancel</Button>
            <Button size="sm" onClick={handleCreateCircle} className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl">Create & Join</Button>
          </div>
        </Card>
      )}

      {selectedCircle ? (
        <div className="space-y-4">
          <button 
            onClick={() => selectCircle(selectedCircle)} 
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Circles
          </button>

          <Card className="p-5 shadow-sm bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0">
            <h3 className="text-lg font-black">{selectedCircle.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{selectedCircle.description}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">{selectedCircle.memberCount} Members</span>
              {selectedCircle.isMember ? (
                <Button size="xs" variant="destructive" onClick={() => handleLeaveCircle(selectedCircle.id)} className="text-[10px] h-7 px-3 py-1 rounded-full flex items-center gap-1.5"><LogOut className="w-3.5 h-3.5"/> Leave</Button>
              ) : (
                <Button size="xs" onClick={() => handleJoinCircle(selectedCircle.id)} className="text-[10px] h-7 px-3 py-1 rounded-full bg-white text-indigo-950 hover:bg-slate-100 font-black flex items-center gap-1.5"><Check className="w-3.5 h-3.5"/> Join Circle</Button>
              )}
            </div>
          </Card>

          <h3 className="text-[11px] text-slate-400 tracking-widest font-semibold uppercase px-1 mt-6">Roster</h3>
          <div className="space-y-2.5">
            {circleMembers.map((m) => (
              <Card key={m.id} className="p-3.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} className="w-9 h-9 rounded-full bg-slate-100 object-cover" alt="" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{m.name}</h4>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-50 border text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-1 inline-block">{m.expertise}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100/50 rounded-full px-2.5 py-1 text-indigo-600 text-[10px] font-black">
                  <Shield className="w-3 h-3 shrink-0" />
                  {m.role}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="bg-[#0f172a] text-white p-6 mx-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
             <div className="flex items-center gap-2 mb-2 relative z-10">
               <Users className="w-5 h-5 text-slate-300" />
               <span className="font-semibold text-[15px]">Circles Network</span>
             </div>
             <p className="text-3xl font-bold mt-2 relative z-10">{circles.length}</p>
             <p className="text-slate-300 text-[13px] font-medium relative z-10">Active groups for code-reviews, sharing, & mentoring</p>
          </Card>

          <h3 className="text-[11px] text-slate-400 tracking-widest font-semibold uppercase px-1 mt-6 mb-4">Explore Circles</h3>
          <div className="grid gap-3.5">
            {circles.map((c) => (
              <Card key={c.id} onClick={() => selectCircle(c)} className="p-4.5 hover:border-slate-300 cursor-pointer transition-all shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
                    {c.isMember && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">Joined</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-normal mt-1 min-h-[36px] line-clamp-2">{c.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3">
                  <span className="text-[10px] font-semibold text-slate-400">{c.memberCount} Members</span>
                  <Button size="xs" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs">Enter Circle &rarr;</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
