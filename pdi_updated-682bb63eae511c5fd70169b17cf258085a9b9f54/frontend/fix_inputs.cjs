const fs = require('fs');

const files = [
  'src/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaNiceRoadDutiesPage.tsx',
  'src/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaItplDutiesPage.tsx',
  'src/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaJpNagarDutiesPage.tsx',
  'src/pages/educator-hub/InstitutionalIdentity/OurTeams/EkyaBtmLayoutDutiesPage.tsx'
];

const replacement = `              ) : selectedDuty?.id === 'club-in-charge' ? (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Club Name</Label>
                  <Input placeholder="e.g. Visual Arts Club" value={formData.clubName} onChange={(e) => setFormData(prev => ({ ...prev, clubName: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                </div>
              ) : selectedDuty?.id === 'events-competitions' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Event Name</Label>
                      <Input value={formData.eventName} onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Grade</Label>
                      <Input value={formData.grade} onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'teacher-talk' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Theme</Label>
                    <Input value={formData.theme} onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'floor-in-charge' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Floor</Label>
                    <Input placeholder="e.g. Ground Floor" value={formData.floor} onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Block Covered</Label>
                    <Input placeholder="e.g. EY to PY" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'teacher-blog' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Month</Label>
                    <Select value={formData.month} onValueChange={(val) => setFormData(prev => ({ ...prev, month: val }))}>
                      <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold"><SelectValue placeholder="Select Month" /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                          <SelectItem key={m} value={m} className="focus:bg-primary/10 data-[highlighted]:bg-primary/10 font-bold">{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Status / Subject</Label>
                    <Input placeholder="e.g. ✅ or subject" value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'buddy-group' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Lead (LA)</Label>
                      <Input value={formData.leadLA} onChange={(e) => setFormData(prev => ({ ...prev, leadLA: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Lead (General)</Label>
                      <Input value={formData.leadGeneral} onChange={(e) => setFormData(prev => ({ ...prev, leadGeneral: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Mentees (LA)</Label>
                      <Input value={formData.menteesLA1} onChange={(e) => setFormData(prev => ({ ...prev, menteesLA1: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Mentees (General)</Label>
                      <Input value={formData.menteesGen1} onChange={(e) => setFormData(prev => ({ ...prev, menteesGen1: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                </div>
              ) : selectedDuty?.id === 'room-allocation' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Room Name</Label>
                    <Input placeholder="e.g. Chemistry Lab" value={formData.teacherId} onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Floor / Level</Label>
                    <Input placeholder="e.g. Level 0" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Room Code</Label>
                    <Input placeholder="e.g. L3111" value={formData.floor} onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              ) : selectedDuty?.id === 'staff-list' || selectedDuty?.id === 'class-teacher-lists' ? (
                <div className="space-y-6">
                  {selectedDuty?.id === 'class-teacher-lists' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Subject / Non-Class Teachers</Label>
                      <Input value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Block</Label>
                      <Input placeholder="e.g. MS, SS" value={formData.block} onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Grade</Label>
                      <Input placeholder="e.g. I to X" value={formData.grade} onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  </div>
                  {selectedDuty?.id === 'staff-list' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Subject</Label>
                      <Input value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Start Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">End Date</Label>
                    <Input type="date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              )`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const targetStr = `              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">Start Date</Label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 font-bold">End Date</Label>
                    <Input type="date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className="h-14 rounded-2xl font-bold" />
                  </div>
                </div>
              )`;
  
  if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync(f, content);
    console.log('Fixed inputs in ' + f);
  } else {
    console.log('Target string not found in ' + f);
  }
});
