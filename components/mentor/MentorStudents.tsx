import { ChevronDown, Search, ArrowRight, MessageSquare, Video, Medal, Target, MapPin, Clock, BookOpen, Layers, CheckCircle2, Star, Users, Zap, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MentorStudents() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentEnrollment, setStudentEnrollment] = useState<any>(null);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: mappings } = await supabase.from('mapping')
      .select('student:profiles!mapping_student_id_fkey(*)')
      .eq('mentor_id', session.user.id);
    
    const assigned = mappings?.map(m => m.student).filter(Boolean) || [];

    if (assigned.length > 0) {
      // Fetch active enrollments for these students
      const { data: enrollments } = await supabase.from('enrollments')
        .select('*, course:courses(*)')
        .in('student_id', assigned.map(s => s.id))
        .eq('status', 'Active');

      const enrollmentMap = new Map();
      if (enrollments) {
        enrollments.forEach(e => {
          enrollmentMap.set(e.student_id, e);
        });
      }

      setStudents(assigned.map(p => {
        const studentEnrollment = enrollmentMap.get(p.id);
        const courseTitle = studentEnrollment?.course?.title || "No Active Course";
        
        const totalTopics = (studentEnrollment?.course?.content || []).reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0);
        const completedTopics = studentEnrollment?.progress?.length || 0;
        const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        return {
          id: p.id,
          name: p.name || p.email?.split('@')[0] || 'Unknown Student',
          email: p.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
          status: studentEnrollment ? "Enrolled" : "Awaiting Course",
          course: courseTitle,
          progress: progressPercent,
          streak: Math.floor(Math.random() * 10) + 1,
        };
      }));
    } else {
      setStudents([]);
    }

    // Fetch courses for assignment
    const { data: courseData } = await supabase.from('courses').select('*');
    setCourses(courseData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const fetchEnrollment = async () => {
        const { data: enrollment } = await supabase.from('enrollments')
          .select('*, course:courses(*)')
          .eq('student_id', selectedStudent.id)
          .eq('status', 'Active')
          .maybeSingle();
        setStudentEnrollment(enrollment);
      };
      fetchEnrollment();
    }
  }, [selectedStudent]);

  const handleAssignCourse = async () => {
    if (!selectedCourseId || !selectedStudent) return;
    setIsAssigning(true);

    // 1. Deactivate all existing enrollments for this student first to avoid duplicates
    await supabase.from('enrollments')
      .update({ status: 'Inactive' })
      .eq('student_id', selectedStudent.id);

    // 2. Insert new active enrollment
    const { error } = await supabase.from('enrollments').insert({
      student_id: selectedStudent.id,
      course_id: selectedCourseId,
      status: 'Active',
      progress: []
    });

    setIsAssigning(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Course assigned successfully!");
      
      const { data: enrollment } = await supabase.from('enrollments')
        .select('*, course:courses(*)')
        .eq('student_id', selectedStudent.id)
        .eq('status', 'Active')
        .maybeSingle();
      setStudentEnrollment(enrollment);

      // Refresh the main student list with actual db entries
      fetchData();
    }
  };

  if (selectedStudent) {
    const totalTopics = (studentEnrollment?.course?.content || []).reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0);
    const completedTopics = studentEnrollment?.progress?.length || 0;
    const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return (
      <div className="space-y-6 pb-20">
         <div className="flex items-center gap-4 mt-6 px-1">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setSelectedStudent(null)} 
             className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
           >
             <ChevronDown className="w-5 h-5 rotate-90" />
           </Button>
           <h2 className="text-xl font-bold font-volkhov text-slate-900 tracking-tight">Student Profile</h2>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-16 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
            
            <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative z-10 bg-slate-100 group-hover:scale-105 transition-transform duration-500">
              <img src={selectedStudent.avatar} className="w-full h-full object-cover" alt={selectedStudent.name}/>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-6 relative z-10 font-volkhov">{selectedStudent.name}</h3>
            <p className="text-[13px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-2 relative z-10">
              {studentEnrollment?.course?.title || "No Active Course"}
            </p>
            
            <div className="flex gap-3 mt-8 relative z-10 w-full">
              <Button className="flex-1 bg-slate-900 text-white py-6 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                <MessageSquare className="w-4.5 h-4.5 fill-white/20"/> Message
              </Button>
              <Button variant="outline" className="flex-1 py-6 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]">
                <Video className="w-4.5 h-4.5 text-indigo-500"/> Call
              </Button>
            </div>
         </div>

         {/* Student Detail View Key Metrics */}
         <div className="flex gap-3 px-1">
            <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900 font-volkhov">{selectedStudent.streak}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Streak</p>
            </div>
            <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900 font-volkhov">85%</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Quiz</p>
            </div>
            <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
              <p className="text-2xl font-black text-slate-900 font-volkhov">
                {completedTopics}/{totalTopics}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Topics</p>
            </div>
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Layers className="w-5 h-5" />
                </div>
                <p className="text-[15px] font-bold text-slate-900">{studentEnrollment ? 'Active Curriculum' : 'No Active Curriculum'}</p>
              </div>
              {studentEnrollment && (
                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 shadow-3xs uppercase tracking-wider">
                  In Progress
                </span>
              )}
            </div>

            {studentEnrollment ? (
              <div className="space-y-5">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                     <h4 className="text-[14px] font-bold text-slate-900 leading-tight">{studentEnrollment.course.title}</h4>
                     <p className="text-[12px] text-slate-400 font-medium">Started {new Date(studentEnrollment.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                   </div>
                   <span className="text-xl font-black text-indigo-600 font-volkhov">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100/50">
                  <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                 <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                 <p className="text-[13px] text-slate-400 font-medium">Assign a curriculum to track progress.</p>
              </div>
            )}
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-[15px] font-bold text-slate-900">Mentor Actions</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-3xs"><BookOpen className="w-4 h-4"/></div>
                  <p className="text-[13px] font-bold text-slate-700">Assign New Course</p>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCourseId} onValueChange={(val) => setSelectedCourseId(val || "")}>
                    <SelectTrigger className="flex-1 bg-white border-slate-200 rounded-xl text-[13px] font-medium h-11 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm">
                      <SelectValue placeholder="Choose curriculum..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-[13px] font-medium">{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAssignCourse}
                    disabled={isAssigning || !selectedCourseId}
                    className="bg-slate-900 text-white px-5 h-11 rounded-xl text-[13px] font-bold disabled:opacity-50 shrink-0 shadow-lg shadow-slate-900/5 active:scale-95 transition-all"
                  >
                    {isAssigning ? "..." : "Assign"}
                  </Button>
                </div>
              </div>
              
              <button className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-3xs"><Target className="w-4 h-4"/></div>
                  <p className="text-[13px] font-bold text-slate-700">Set Weekly Milestone</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </button>

              <button className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shadow-3xs"><Heart className="w-4 h-4"/></div>
                  <p className="text-[13px] font-bold text-slate-700">Send Kudos</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <h2 className="text-2xl font-bold font-volkhov text-slate-900 tracking-tight">My Students</h2>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full shadow-sm bg-white border-slate-100 text-slate-400 hover:text-slate-600 active:scale-95 transition-transform">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 px-1">
        {students.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
               <Users className="w-10 h-10" />
             </div>
             <p className="text-slate-400 font-medium">No students assigned to you yet.</p>
          </div>
        ) : (
          students.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedStudent(s)} 
              className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <img src={s.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm bg-slate-100 group-hover:scale-105 transition-transform" alt={s.name} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                     <h3 className="text-[16px] font-bold text-slate-900 font-volkhov">{s.name}</h3>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{s.status}</span>
                   </div>
                   <p className="text-[13px] text-slate-500 font-medium mt-1 line-clamp-1">{s.course}</p>
                   <div className="flex items-center gap-3 mt-3">
                     <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                       <Star className="w-3.5 h-3.5 fill-amber-500"/> {s.streak} Day Streak
                     </div>
                     <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                       <Target className="w-3.5 h-3.5" /> {s.progress}%
                     </div>
                   </div>
                </div>
              </div>
              
              <div className="mt-5">
                 <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                   <span>Curriculum Progress</span>
                   <span className="text-slate-900">{s.progress}%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.progress}%` }}></div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
