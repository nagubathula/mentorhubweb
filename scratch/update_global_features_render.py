with open("components/admin/AdminPanel.tsx", "r") as f:
    content = f.read()

old_grid_block = """      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>"""

new_grid_block = """      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-5 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500" /> Global / Other Features</h3>
          <div className="space-y-1">
            {globalFeatures.map((f: any) => (
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
            {globalFeatures.length === 0 && <p className="text-sm text-slate-400 italic">No global features added yet.</p>}
          </div>
        </Card>
      </div>"""

if old_grid_block in content:
    content = content.replace(old_grid_block, new_grid_block)
    print("Successfully replaced grid block!")
else:
    print("Could not find old grid block!")

with open("components/admin/AdminPanel.tsx", "w") as f:
    f.write(content)
