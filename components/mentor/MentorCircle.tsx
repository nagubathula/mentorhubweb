import { Users, Search, Star, Plus, Check, LogOut, ArrowLeft, Shield, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MentorCircle({ onClose }: { onClose?: () => void } = {}) {
  const [circles, setCircles] = useState<any[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<any>(null);
  const [circleMembers, setCircleMembers] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDesc, setNewCircleDesc] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();
  const selectedCircleRef = useRef<any>(null);

  useEffect(() => {
    selectedCircleRef.current = selectedCircle;
  }, [selectedCircle]);

  const fetchCirclesAndMemberships = async (passedUser?: any) => {
    try {
      let activeUser = passedUser || currentUser;
      if (!activeUser) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          activeUser = session.user;
          setCurrentUser(session.user);
        }
      }

      // Fetch all circles
      const { data: dbCircles } = await supabase
        .from('circles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch all circle memberships in one single query
      const { data: allMembers } = await supabase
        .from('circle_members')
        .select('circle_id, student_id');

      const memberCountMap: Record<string, number> = {};
      const userCircles = new Set<string>();

      if (allMembers) {
        allMembers.forEach((m) => {
          if (m.circle_id) {
            memberCountMap[m.circle_id] = (memberCountMap[m.circle_id] || 0) + 1;
            if (activeUser && m.student_id === activeUser.id) {
              userCircles.add(m.circle_id);
            }
          }
        });
      }

      if (dbCircles) {
        const circlesWithCount = dbCircles.map((c) => ({
          ...c,
          memberCount: memberCountMap[c.id] || 0,
          isMember: userCircles.has(c.id)
        }));
        setCircles(circlesWithCount);

        // Keep selectedCircle details in sync
        if (selectedCircleRef.current) {
          const updated = circlesWithCount.find(c => c.id === selectedCircleRef.current.id);
          if (updated) {
            setSelectedCircle(updated);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching circles:", e);
    }
  };

  useEffect(() => {
    let sessionUser: any = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        sessionUser = session.user;
        setCurrentUser(session.user);
      }
      await fetchCirclesAndMemberships(sessionUser);
    };

    init();

    // Set up real-time postgres changes subscription
    const channel = supabase
      .channel('realtime-mentor-circles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'circles' }, async () => {
        const { data: { session } } = await supabase.auth.getSession();
        await fetchCirclesAndMemberships(session?.user || null);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'circle_members' }, async () => {
        const { data: { session } } = await supabase.auth.getSession();
        await fetchCirclesAndMemberships(session?.user || null);
        // Refresh selected circle details / members if open
        if (selectedCircleRef.current) {
          await fetchCircleMembers(selectedCircleRef.current.id);
        }
      })
      .subscribe();

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateCircle = async () => {
    if (!newCircleName.trim() || !newCircleDesc.trim() || !currentUser) return;
    try {
      const { data, error } = await supabase.from('circles').insert({
        name: newCircleName.trim(),
        description: newCircleDesc.trim(),
        mentor_id: currentUser.id
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
    <div className="space-y-6 pb-24 font-inter">
      {/* Header section */}
      <div className="flex items-center justify-between mt-6 px-1">
        <div className="flex items-center gap-3.5">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-9.5 h-9.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-100 flex items-center justify-center active:scale-95 transition-all shadow-3xs shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
            </Button>
          )}
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Mentorship Circles</h2>
            <p className="text-[12.5px] text-slate-400 font-medium mt-0.5">Collaborate, share knowledge, and grow together</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5 px-4.5 h-9 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Circle</span>
        </Button>
      </div>

      {/* Backdrop blur dialog overlay for Circle Creation */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white border border-slate-100 shadow-2xl rounded-3xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-slate-900">Create a New Circle</h4>
              <button 
                onClick={() => setIsCreateOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Circle Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Enthusiasts"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea 
                  placeholder="What is this circle about? Share the main goals of the group..."
                  value={newCircleDesc}
                  onChange={(e) => setNewCircleDesc(e.target.value)}
                  rows={3}
                  className="w-full text-xs text-slate-800 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/50 transition-all resize-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)} 
                className="flex-1 rounded-xl text-xs font-semibold py-2.5 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCircle} 
                className="flex-1 rounded-xl text-xs font-semibold py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Create & Join
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content Areas */}
      {selectedCircle ? (
        <div className="space-y-5">
          <button 
            onClick={() => selectCircle(selectedCircle)} 
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-semibold text-xs transition-colors px-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Circles
          </button>

          {/* Premium selected circle card banner */}
          <Card className="p-6 shadow-md bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border-0 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-violet-500/15 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 space-y-4">
              <div>
                <span className="bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5">Active Group</span>
                <h3 className="text-xl font-bold tracking-tight mt-3">{selectedCircle.name}</h3>
                <p className="text-[12.5px] text-slate-300 leading-relaxed mt-1.5 font-medium max-w-xl">{selectedCircle.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                  <Users className="w-4 h-4 text-slate-300" />
                  <span>{selectedCircle.memberCount} member{selectedCircle.memberCount !== 1 ? 's' : ''} active</span>
                </div>
                {selectedCircle.isMember ? (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleLeaveCircle(selectedCircle.id)} 
                    className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/20 rounded-xl px-4 py-2 flex items-center gap-1.5 font-semibold transition-all active:scale-95 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Leave Circle
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleJoinCircle(selectedCircle.id)} 
                    className="text-xs bg-white hover:bg-slate-100 text-indigo-950 font-bold rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Join Circle
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Roster list */}
          <div>
            <h3 className="text-[10.5px] text-slate-400 tracking-[0.2em] font-bold uppercase px-1 mt-6 mb-3.5">Circle Roster</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {circleMembers.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white border border-slate-100 rounded-3xl">
                  <p className="text-slate-400 text-xs font-medium">No members in this circle yet.</p>
                </div>
              ) : (
                circleMembers.map((m) => {
                  const isMentor = m.role === 'MENTOR';
                  const roleStyle = isMentor
                    ? 'bg-indigo-50 border-indigo-100/60 text-indigo-600'
                    : 'bg-emerald-50 border-emerald-100/60 text-emerald-600';
                  
                  return (
                    <Card key={m.id} className="p-4 flex items-center justify-between border-slate-100/70 hover:border-slate-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all rounded-2xl bg-white shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          <img src={m.avatar} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-semibold text-slate-900 truncate leading-tight">{m.name}</h4>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                            {m.expertise || (isMentor ? 'Expert Guide' : 'Enthusiastic Learner')}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-bold tracking-wider uppercase shrink-0 ${roleStyle}`}>
                        {m.role}
                      </span>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dashboard network summary card */}
          <Card className="bg-gradient-to-tr from-slate-900 via-slate-900 to-indigo-950 text-white p-6 mx-1 border border-slate-800/80 rounded-[2rem] relative overflow-hidden shadow-xl shadow-slate-950/10">
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Users className="w-5 h-5 text-indigo-300" />
              <span className="font-semibold text-xs tracking-wider uppercase text-indigo-200">Circles Network</span>
            </div>
            <p className="text-3xl font-black tracking-tight mt-2 relative z-10">{circles.length}</p>
            <p className="text-slate-300 text-[13px] font-medium mt-1 leading-normal relative z-10">Active groups for code-reviews, technical exchange, & peer support</p>
          </Card>

          {/* Explore Circles list */}
          <div>
            <h3 className="text-[10.5px] text-slate-400 tracking-[0.2em] font-bold uppercase px-1 mt-6 mb-4">Explore Circles</h3>
            
            {circles.length === 0 ? (
              <div className="py-16 text-center bg-white border border-slate-100 rounded-3xl">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <p className="text-slate-400 text-xs font-semibold">No mentorship circles created yet.</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Click the "New Circle" button to build the first group.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                {circles.map((c) => (
                  <Card 
                    key={c.id} 
                    onClick={() => selectCircle(c)} 
                    className="p-5 hover:border-indigo-100 hover:shadow-[0_8px_30px_rgba(99,102,241,0.03)] cursor-pointer transition-all duration-300 shadow-sm flex flex-col justify-between bg-white rounded-2xl group border-slate-100/70"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-[14px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate">{c.name}</h4>
                        {c.isMember && (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/80 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0">Joined</span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-400 leading-relaxed font-medium min-h-[36px] line-clamp-2">{c.description || 'No description provided.'}</p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-4">
                      <span className="text-[10.5px] font-bold text-slate-400">{c.memberCount} member{c.memberCount !== 1 ? 's' : ''}</span>
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Enter Circle <span className="group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
