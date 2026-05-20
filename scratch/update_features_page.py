import re

with open("components/admin/AdminPanel.tsx", "r") as f:
    content = f.read()

# The current FeaturesPage code
old_features_page = """function FeaturesPage({ data, fetchAll }: { data: any, fetchAll: () => void }) {
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
    <PageShell title="Feature Controls" subtitle="Dynamically enable or disable platform modules.">"""

new_features_page = """function FeaturesPage({ data, fetchAll }: { data: any, fetchAll: () => void }) {
  const supabase = createClient();
  const flags = data.feature_flags || [];
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeature, setNewFeature] = useState({ key: '', title: '', category: 'student' });

  const toggleFeature = async (id: string, currentStatus: boolean) => {
    setIsSaving(true);
    const { error } = await supabase.from('feature_flags').update({ is_enabled: !currentStatus }).eq('id', id);
    if (error) alert("Error: " + error.message);
    else fetchAll();
    setIsSaving(false);
  };

  const handleCreateFeature = async () => {
    if (!newFeature.key || !newFeature.title) return alert("Key and Title are required.");
    setIsSaving(true);
    const { error } = await supabase.from('feature_flags').insert([{
      key: newFeature.key,
      title: newFeature.title,
      category: newFeature.category,
      is_enabled: true
    }]);
    setIsSaving(false);
    if (error) alert("Error: " + error.message);
    else {
      setShowAddModal(false);
      setNewFeature({ key: '', title: '', category: 'student' });
      fetchAll();
    }
  };

  const studentFeatures = flags.filter((f: any) => f.category === 'student');
  const mentorFeatures = flags.filter((f: any) => f.category === 'mentor');
  const globalFeatures = flags.filter((f: any) => f.category !== 'student' && f.category !== 'mentor');

  return (
    <PageShell title="Feature Controls" subtitle="Dynamically enable or disable platform modules." action={<BtnPrimary onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Feature</BtnPrimary>}>
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[16px] font-semibold text-slate-900">Add New Feature</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-slate-500 mb-1.5 block">Feature Key (Unique)</label>
                <input value={newFeature.key} onChange={(e) => setNewFeature({...newFeature, key: e.target.value})} placeholder="e.g. student_portfolio" className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-slate-900 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-slate-500 mb-1.5 block">Display Title</label>
                <input value={newFeature.title} onChange={(e) => setNewFeature({...newFeature, title: e.target.value})} placeholder="e.g. My Portfolio" className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-slate-900 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-slate-500 mb-1.5 block">Portal Category</label>
                <select value={newFeature.category} onChange={(e) => setNewFeature({...newFeature, category: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
                  <option value="student">Student Portal</option>
                  <option value="mentor">Mentor Portal</option>
                  <option value="global">Global Settings</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <BtnSecondary onClick={() => setShowAddModal(false)}>Cancel</BtnSecondary>
              <BtnPrimary onClick={handleCreateFeature} disabled={isSaving}>{isSaving ? "Saving..." : "Create Feature"}</BtnPrimary>
            </div>
          </div>
        </div>
      )}"""

# Replace in content
if old_features_page in content:
    content = content.replace(old_features_page, new_features_page)
else:
    print("Error: Could not find old_features_page string.")

with open("components/admin/AdminPanel.tsx", "w") as f:
    f.write(content)
