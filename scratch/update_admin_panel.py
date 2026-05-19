import re

with open("components/admin/AdminPanel.tsx", "r") as f:
    content = f.read()

# 1. Update data state init
content = content.replace("games: [], studentQuiz: [], mentorQuiz: [],", "games: [], studentQuiz: [], mentorQuiz: [], feature_flags: [],")

# 2. Update Promise.all destructuring
content = content.replace("games, studentQuiz, mentorQuiz] = await Promise.all([", "games, studentQuiz, mentorQuiz, feature_flags] = await Promise.all([")

# 3. Update Promise.all fetching
q_feature_flags = '      q(() => supabase.from("feature_flags").select("*").limit(200)),\n    ]);'
content = content.replace("    ]);", q_feature_flags, 1) # Only replace the first occurrence (which is inside fetchAll)

# 4. Update setData
content = content.replace("games, studentQuiz, mentorQuiz });", "games, studentQuiz, mentorQuiz, feature_flags });")

# 5. Add case to renderPage switch
content = content.replace('case "settings":       return <SettingsPage />;', 'case "features":       return <FeaturesPage data={data} fetchAll={fetchAll} />;\n      case "settings":       return <SettingsPage />;')

# 6. Define FeaturesPage
features_page_code = """
function FeaturesPage({ data, fetchAll }: { data: any, fetchAll: () => void }) {
  const supabase = createClient();
  const flags = data.feature_flags || [];
  const [isSaving, setIsSaving] = useState(false);

  const toggleFeature = async (id: string, currentStatus: boolean) => {
    setIsSaving(true);
    const { error } = await supabase.from('feature_flags').update({ is_enabled: !currentStatus }).eq('id', id);
    if (error) alert("Error: " + error.message);
    else fetchAll();
    setIsSaving(false);
  };

  const studentFeatures = flags.filter((f: any) => f.category === 'student');
  const mentorFeatures = flags.filter((f: any) => f.category === 'mentor');

  return (
    <PageShell title="Feature Controls" subtitle="Dynamically enable or disable platform modules.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-5 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-500" /> Student Portal Features</h3>
          <div className="space-y-1">
            {studentFeatures.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-slate-800">{f.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Key: {f.key}</p>
                </div>
                <button onClick={() => toggleFeature(f.id, f.is_enabled)} disabled={isSaving} className={`w-11 h-6 rounded-full relative transition-colors ${f.is_enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${f.is_enabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
            {studentFeatures.length === 0 && <p className="text-sm text-slate-400 italic">No features found. Run migration.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-5 flex items-center gap-2"><UserCheck className="w-5 h-5 text-violet-500" /> Mentor Portal Features</h3>
          <div className="space-y-1">
            {mentorFeatures.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-slate-800">{f.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Key: {f.key}</p>
                </div>
                <button onClick={() => toggleFeature(f.id, f.is_enabled)} disabled={isSaving} className={`w-11 h-6 rounded-full relative transition-colors ${f.is_enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${f.is_enabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
            {mentorFeatures.length === 0 && <p className="text-sm text-slate-400 italic">No features found. Run migration.</p>}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

function SettingsPage() {"""

content = content.replace("function SettingsPage() {", features_page_code)

with open("components/admin/AdminPanel.tsx", "w") as f:
    f.write(content)

