import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CaretLeft, PencilSimple, Check, X, Info, Lightbulb, FileText,
  ListChecks, Table, Plus, ArrowRight, Sparkle, TrendUp, Trash
} from '@phosphor-icons/react';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { EARLY_YEARS_RESOURCES, ResourcePageData } from '../data/earlyYearsData';
import { settingsService } from '@/services/settingsService';
import { useAuth } from '@/hooks/useAuth';

// Helper: update a section's content immutably
function updateSection(pageData: ResourcePageData, idx: number, content: any): ResourcePageData {
  const newSections = [...pageData.sections];
  newSections[idx] = { ...newSections[idx], content };
  return { ...pageData, sections: newSections };
}

function updateSectionTitle(pageData: ResourcePageData, idx: number, title: string): ResourcePageData {
  const newSections = [...pageData.sections];
  newSections[idx] = { ...newSections[idx], title };
  return { ...pageData, sections: newSections };
}

// Editable input wrapper
const EditInput = ({ value, onChange, className = '' }: { value: string; onChange: (v: string) => void; className?: string }) => (
  <input value={value} onChange={e => onChange(e.target.value)}
    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#EA104A]/30 text-sm font-medium ${className}`} />
);

const EditTextarea = ({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#EA104A]/30 text-sm font-medium leading-relaxed" />
);

export default function EarlyYearsResourcePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageData, setPageData] = useState<ResourcePageData | null>(null);
  const [saving, setSaving] = useState(false);

  const settingKey = `page_early_years_${slug?.replace(/-/g, '_')}`;

  useEffect(() => {
    const load = async () => {
      if (!slug || !EARLY_YEARS_RESOURCES[slug]) return;
      const defaults = JSON.parse(JSON.stringify(EARLY_YEARS_RESOURCES[slug]));
      try {
        const result = await settingsService.getSetting(settingKey);
        if (result?.value) {
          setPageData({ ...defaults, ...result.value });
        } else {
          setPageData(defaults);
        }
      } catch {
        setPageData(defaults);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const canEdit = () => {
    const role = user?.role?.toUpperCase() || '';
    return ['ADMIN', 'SUPERADMIN', 'TESTER'].includes(role);
  };

  const handleSave = async () => {
    if (!pageData) return;
    setSaving(true);
    try {
      await settingsService.saveSetting(settingKey, pageData);
    } catch (err) {
      console.error('Failed to save:', err);
    }
    setSaving(false);
    setIsEditMode(false);
  };

  if (!pageData) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#EA104A]/20 border-t-[#EA104A] rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Resource...</p>
      </div>
    </div>
  );

  // --- RENDER HELPERS ---
  const renderSectionHeader = (section: any, idx: number) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-[#EA104A]/10 flex items-center justify-center text-[#EA104A] border border-[#EA104A]/10 shadow-sm">
        {section.type === 'list' && <ListChecks weight="duotone" size={28} />}
        {section.type === 'table' && <Table weight="duotone" size={28} />}
        {section.type === 'text' && <FileText weight="duotone" size={28} />}
        {section.type === 'checklist' && <Check weight="bold" size={28} />}
        {section.type === 'tips' && <Lightbulb weight="duotone" size={28} />}
        {section.type === 'glossary' && <Info weight="duotone" size={28} />}
        {section.type === 'milestones' && <TrendUp weight="duotone" size={28} />}
        {section.type === 'dos_donts' && <Check weight="duotone" size={28} />}
      </div>
      <div className="flex-1">
        <h2 className="text-[10px] font-black text-[#EA104A] tracking-[0.4em] uppercase opacity-70">Category 0{idx + 1}</h2>
        {isEditMode ? (
          <EditInput value={section.title} onChange={v => setPageData(updateSectionTitle(pageData, idx, v))} className="text-2xl font-black" />
        ) : (
          <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">{section.title}</h3>
        )}
      </div>
    </div>
  );

  const renderText = (section: any, idx: number) => (
    <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#EA104A]/20" />
      {isEditMode ? (
        <EditTextarea value={section.content} onChange={v => setPageData(updateSection(pageData, idx, v))} rows={8} />
      ) : (
        <div className="text-xl text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
          {section.content.split('\n\n').map((para: string, pi: number) => (
            <p key={pi} className="mb-6 last:mb-0">
              {para.split('\n').map((line: string, li: number) => (
                <span key={li} className="block">
                  {line.startsWith('•') ? (
                    <span className="flex items-start gap-4 pl-6 mb-3">
                      <span className="text-[#EA104A] mt-2 font-black">•</span>
                      <span>{line.replace('•', '').trim()}</span>
                    </span>
                  ) : line}
                </span>
              ))}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderList = (section: any, idx: number) => {
    const items = section.content as { label: string; text: string }[];
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-4 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#EA104A] shadow-inner font-black text-xl border border-slate-100">{i + 1}</div>
            {isEditMode ? (
              <div className="space-y-2">
                <EditInput value={item.label} onChange={v => { const c = [...items]; c[i] = { ...c[i], label: v }; setPageData(updateSection(pageData, idx, c)); }} className="font-bold" />
                <EditTextarea value={item.text} onChange={v => { const c = [...items]; c[i] = { ...c[i], text: v }; setPageData(updateSection(pageData, idx, c)); }} />
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 text-2xl uppercase tracking-tighter">{item.label}</h4>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">{item.text}</p>
              </div>
            )}
          </div>
        ))}
        {isEditMode && (
          <button onClick={() => { const c = [...items, { label: 'New Item', text: 'Description' }]; setPageData(updateSection(pageData, idx, c)); }}
            className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 hover:text-[#EA104A] hover:border-[#EA104A] transition-all">
            <Plus size={20} /> Add Item
          </button>
        )}
      </div>
    );
  };

  const renderTable = (section: any, idx: number) => {
    const { headers, rows } = section.content;
    return (
      <div className="overflow-hidden rounded-[3rem] border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                {headers.map((h: string, hi: number) => (
                  <th key={hi} className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {isEditMode ? <EditInput value={h} onChange={v => { const nh = [...headers]; nh[hi] = v; setPageData(updateSection(pageData, idx, { headers: nh, rows })); }} className="bg-slate-800 text-white border-slate-700" /> : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row: string[], ri: number) => (
                <tr key={ri} className="hover:bg-[#EA104A]/5 transition-colors">
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className={`px-8 py-6 text-base ${ci === 0 ? 'font-black text-slate-900 uppercase tracking-tight' : 'text-slate-600 font-medium'}`}>
                      {isEditMode ? <EditTextarea value={cell} onChange={v => { const nr = rows.map((r: string[], rri: number) => rri === ri ? r.map((c: string, cci: number) => cci === ci ? v : c) : r); setPageData(updateSection(pageData, idx, { headers, rows: nr })); }} rows={2} /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
              {isEditMode && (
                <tr>
                  <td colSpan={headers.length} className="p-4">
                    <button onClick={() => { const nr = [...rows, headers.map(() => '')]; setPageData(updateSection(pageData, idx, { headers, rows: nr })); }}
                      className="text-sm font-bold text-[#EA104A] hover:underline flex items-center gap-2"><Plus size={14} /> Add Row</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderChecklist = (section: any, idx: number) => {
    const items = section.content as string[];
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm group">
            <div className="w-10 h-10 rounded-2xl bg-[#EA104A]/10 flex items-center justify-center text-[#EA104A] shadow-sm"><Check weight="bold" size={18} /></div>
            {isEditMode ? (
              <div className="flex-1 flex items-center gap-2">
                <EditInput value={item} onChange={v => { const c = [...items]; c[i] = v; setPageData(updateSection(pageData, idx, c)); }} />
                <button onClick={() => { const c = items.filter((_: any, ii: number) => ii !== i); setPageData(updateSection(pageData, idx, c)); }} className="text-rose-400 hover:text-rose-600"><Trash size={16} /></button>
              </div>
            ) : (
              <span className="text-base font-black text-slate-800 tracking-tight leading-tight uppercase">{item}</span>
            )}
          </div>
        ))}
        {isEditMode && (
          <button onClick={() => setPageData(updateSection(pageData, idx, [...items, 'New checklist item']))}
            className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 hover:text-[#EA104A] hover:border-[#EA104A] transition-all">
            <Plus size={20} /> Add Item
          </button>
        )}
      </div>
    );
  };

  const renderDosDonts = (section: any, idx: number) => {
    const items = section.content as { type: string; text: string }[];
    const dos = items.filter(i => i.type === 'do');
    const donts = items.filter(i => i.type === 'dont');

    const updateItem = (itemIdx: number, text: string) => {
      const c = [...items]; c[itemIdx] = { ...c[itemIdx], text }; setPageData(updateSection(pageData, idx, c));
    };
    const removeItem = (itemIdx: number) => {
      setPageData(updateSection(pageData, idx, items.filter((_: any, ii: number) => ii !== itemIdx)));
    };

    return (
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-8 py-4 bg-emerald-50 rounded-[2rem] border border-emerald-100">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check size={16} weight="bold" /></div>
            <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">Effective Standards (Do's)</h4>
          </div>
          <div className="space-y-4">
            {dos.map((item, i) => {
              const globalIdx = items.indexOf(item);
              return (
                <div key={i} className="flex items-start gap-5 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                  <span className="text-emerald-500 font-black mt-0.5">✓</span>
                  {isEditMode ? (
                    <div className="flex-1 flex items-center gap-2">
                      <EditInput value={item.text} onChange={v => updateItem(globalIdx, v)} />
                      <button onClick={() => removeItem(globalIdx)} className="text-rose-400 hover:text-rose-600"><Trash size={16} /></button>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-slate-700 tracking-tight leading-relaxed">{item.text}</span>
                  )}
                </div>
              );
            })}
            {isEditMode && (
              <button onClick={() => setPageData(updateSection(pageData, idx, [...items, { type: 'do', text: 'New do item' }]))}
                className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-2"><Plus size={14} /> Add Do</button>
            )}
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-8 py-4 bg-rose-50 rounded-[2rem] border border-rose-100">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white"><X size={16} weight="bold" /></div>
            <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest">Avoid This (Don'ts)</h4>
          </div>
          <div className="space-y-4">
            {donts.map((item, i) => {
              const globalIdx = items.indexOf(item);
              return (
                <div key={i} className="flex items-start gap-5 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                  <span className="text-rose-500 font-black mt-0.5">✗</span>
                  {isEditMode ? (
                    <div className="flex-1 flex items-center gap-2">
                      <EditInput value={item.text} onChange={v => updateItem(globalIdx, v)} />
                      <button onClick={() => removeItem(globalIdx)} className="text-rose-400 hover:text-rose-600"><Trash size={16} /></button>
                    </div>
                  ) : (
                    <span className="text-base font-bold text-slate-700 tracking-tight leading-relaxed">{item.text}</span>
                  )}
                </div>
              );
            })}
            {isEditMode && (
              <button onClick={() => setPageData(updateSection(pageData, idx, [...items, { type: 'dont', text: "New don't item" }]))}
                className="text-sm font-bold text-rose-600 hover:underline flex items-center gap-2"><Plus size={14} /> Add Don't</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGlossary = (section: any, idx: number) => {
    const items = section.content as { term: string; meaning: string }[];
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm group">
            {isEditMode ? (
              <div className="space-y-3">
                <EditInput value={item.term} onChange={v => { const c = [...items]; c[i] = { ...c[i], term: v }; setPageData(updateSection(pageData, idx, c)); }} className="font-bold" />
                <EditTextarea value={item.meaning} onChange={v => { const c = [...items]; c[i] = { ...c[i], meaning: v }; setPageData(updateSection(pageData, idx, c)); }} />
                <button onClick={() => setPageData(updateSection(pageData, idx, items.filter((_: any, ii: number) => ii !== i)))} className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-1"><Trash size={12} /> Remove</button>
              </div>
            ) : (
              <>
                <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#EA104A] shadow-inner group-hover:bg-[#EA104A] group-hover:text-white transition-all"><Info size={20} weight="duotone" /></div>
                  {item.term}
                </h4>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{item.meaning}</p>
              </>
            )}
          </div>
        ))}
        {isEditMode && (
          <button onClick={() => setPageData(updateSection(pageData, idx, [...items, { term: 'New Term', meaning: 'Definition' }]))}
            className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 hover:text-[#EA104A] hover:border-[#EA104A] transition-all">
            <Plus size={20} /> Add Term
          </button>
        )}
      </div>
    );
  };

  const renderTips = (section: any, idx: number) => (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem] p-12 md:p-20 border border-amber-200/50 flex flex-col md:flex-row items-center gap-12 shadow-sm relative overflow-hidden">
      <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center flex-none">
        <Lightbulb className="w-12 h-12 text-amber-500" weight="fill" />
      </div>
      <div className="space-y-6 flex-1">
        <h4 className="text-xl font-black text-amber-600 uppercase tracking-[0.3em]">QUICK TIPS</h4>
        {isEditMode ? (
          <EditTextarea value={section.content} onChange={v => setPageData(updateSection(pageData, idx, v))} rows={4} />
        ) : (
          <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight italic">{section.content}</p>
        )}
      </div>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32">
      <PortalBanner
        title={pageData.title}
        subtitle={pageData.subtitle}
        icon={Sparkle}
        onBack={() => navigate(-1)}
        onEdit={() => { if (isEditMode) { handleSave(); } else { setIsEditMode(true); } }}
        canEdit={canEdit()}
        className="mt-6 mb-12"
        rightAction={isEditMode ? (
          <div className="flex items-center gap-3">
            <button onClick={() => { setIsEditMode(false); /* reload from server */ }} className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-black text-[10px] uppercase tracking-widest">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Check weight="bold" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : undefined}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">
        {/* Editable Title & Subtitle */}
        {isEditMode && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Title</label>
            <EditInput value={pageData.title} onChange={v => setPageData({ ...pageData, title: v })} className="text-2xl font-black" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtitle</label>
            <EditTextarea value={pageData.subtitle} onChange={v => setPageData({ ...pageData, subtitle: v })} />
          </div>
        )}

        <div className="space-y-24">
          {pageData.sections.map((section, idx) => (
            <motion.section key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.1 }} className="space-y-12">
              {renderSectionHeader(section, idx)}
              <div className="relative">
                {section.type === 'text' && renderText(section, idx)}
                {section.type === 'list' && renderList(section, idx)}
                {(section.type === 'table' || section.type === 'milestones') && renderTable(section, idx)}
                {section.type === 'checklist' && renderChecklist(section, idx)}
                {section.type === 'dos_donts' && renderDosDonts(section, idx)}
                {section.type === 'glossary' && renderGlossary(section, idx)}
                {section.type === 'tips' && renderTips(section, idx)}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-32 border-t-2 border-slate-100 flex flex-col items-center gap-10 text-center">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Ekya Early Years Academy</p>
            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">End of Framework Documentation</h4>
          </div>
          <button onClick={() => navigate(-1)} className="px-12 py-5 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-[#EA104A] hover:scale-105 transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group">
            <CaretLeft weight="bold" className="group-hover:-translate-x-2 transition-transform" />
            Return to Academic Hub
            <ArrowRight weight="bold" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
