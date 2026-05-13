import { ChevronDown, Search, ArrowRight, MessageSquare, Video, Medal, Target, MapPin, Clock, BookOpen, Layers, CheckCircle2, Star } from "lucide-react";
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
         <div className="flex items-center gap-3 mt-4 px-1">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setSelectedStudent(null)} 
             className="w-10 h-10 rounded-full"
           >
             <ChevronDown className="w-5 h-5 rotate-90" />
           </Button>
           <h2 className="text-[18px] font-semibold text-slate-800">Student Profile</h2>
         </div>

         <Card className="p-6 flex flex-col items-center relative overflow-hidden shadow-sm hover:translate-y-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative z-10 bg-slate-100">
              <img src={selectedStudent.avatar} className="w-full h-full object-cover" alt={selectedStudent.name}/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-4 relative z-10">{selectedStudent.name}</h3>
            <p className="text-[14px] text-slate-600 font-medium mt-1 relative z-10">{studentEnrollment?.course?.title || "No Active Course"}</p>
            
            <div className="flex gap-2 mt-4 relative z-10 w-full px-2">
              <Button className="flex-1 bg-[#0f172a] text-white py-2.5 h-10 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-colors">
                <MessageSquare className="w-4 h-4"/> Message
              </Button>
              <Button variant="outline" className="flex-1 py-2.5 h-10 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                <Video className="w-4 h-4"/> Call
              </Button>
            </div>
         </Card>

         {/* Student Detail View Key Metrics */}
         <div className="flex gap-3 px-1">
            <Card className="flex-1 p-4 text-center hover:translate-y-0 shadow-sm">
              <p className="text-[24px] font-bold text-slate-800">{selectedStudent.streak}</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Day Streak</p>
            </Card>
            <Card className="flex-1 p-4 text-center hover:translate-y-0 shadow-sm">
              <p className="text-[24px] font-bold text-slate-800">85%</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Quiz Avg</p>
            </Card>
            <Card className="flex-1 p-4 text-center hover:translate-y-0 shadow-sm">
              <p className="text-[24px] font-bold text-slate-800">
                {completedTopics}/{totalTopics}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Topics</p>
            </Card>
         </div>

         <Card className="p-5 shadow-sm hover:translate-y-0">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-medium text-[15px]">
              <Layers className="w-[18px] h-[18px] text-slate-500" strokeWidth={2}/> {studentEnrollment ? 'Active Course' : 'No Active Course'}
            </div>
            {studentEnrollment ? (
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[14px] font-semibold text-slate-900">{studentEnrollment.course.title}</h4>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">IN PROGRESS</span>
                </div>
                <Progress value={progressPercent} className="mt-4" />
                <p className="text-[12px] text-slate-500 font-medium mt-2 text-right">
                  {progressPercent}% Complete
                </p>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <p className="text-[13px] text-slate-400">Assign a course to start tracking progress.</p>
              </div>
            )}
         </Card>

         <Card className="p-5 shadow-sm hover:translate-y-0">
            <h3 className="text-[15px] font-medium text-slate-800 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-600 p-2 rounded-lg"><BookOpen className="w-4 h-4"/></div>
                  <div className="flex-1"><p className="text-[14px] font-medium text-slate-700">Assign Course</p></div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCourseId} onValueChange={(val) => setSelectedCourseId(val || "")}>
                    <SelectTrigger className="flex-1 bg-white py-2 px-3 text-[13px] border border-slate-200 rounded-lg outline-none h-10 min-w-[200px]">
                      <SelectValue placeholder="Select a course..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAssignCourse}
                    disabled={isAssigning || !selectedCourseId}
                    className="bg-[#0f172a] text-white px-4 h-10 rounded-lg text-[13px] font-medium disabled:opacity-50 shrink-0"
                  >
                    {isAssigning ? "..." : "Assign"}
                  </Button>
                </div>
              </div>
              <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left bg-white">
                <div className="bg-slate-100 text-slate-600 p-2 rounded-lg"><Target className="w-4 h-4"/></div>
                <div className="flex-1"><p className="text-[14px] font-medium text-slate-700">Set Weekly Goal</p></div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
         </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mt-6 px-1">
        <h2 className="text-[20px] font-semibold text-slate-800">My Students</h2>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full shadow-sm">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {students.map(s => (
          <Card key={s.id} onClick={() => setSelectedStudent(s)} className="p-4 cursor-pointer hover:border-slate-300 transition-colors flex flex-col relative overflow-hidden">
            <div className="flex gap-4">
              <img src={s.avatar} className="w-14 h-14 rounded-full object-cover border border-slate-100 bg-slate-50" alt={s.name} />
              <div className="flex-1">
                 <h3 className="text-[15px] font-bold text-slate-800">{s.name}</h3>
                 <p className="text-[13px] text-slate-500 font-medium mb-1 line-clamp-1">{s.course}</p>
                 <div className="flex items-center gap-2 text-[11px] mt-2">
                   <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{s.status}</span>
                   <span className="flex items-center gap-1 text-slate-400 font-medium"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/> {s.streak} day streak</span>
                 </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center text-[12px] font-medium text-slate-500 mb-2">
                 <span>Course Progress</span>
                 <span>{s.progress}%</span>
               </div>
               <Progress value={s.progress} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
