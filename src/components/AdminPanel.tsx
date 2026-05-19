/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, FileText, LayoutDashboard, LogOut, Plus, Settings, ShieldCheck, Trash2, Upload, Users } from 'lucide-react';
import React, { useState } from 'react';
import { parseWordTest } from '../lib/parser';
import { Button, Card, Input } from './ui';

interface AdminPanelProps {
  literature: any[];
  questions: any[];
  results: any[];
  settings: { duration: number; questionCount: number };
  onAddLiterature: (data: any) => Promise<void>;
  onDeleteLiterature: (id: string) => Promise<void>;
  onUploadQuestions: (litId: string, questions: any[]) => Promise<void>;
  onUpdateSettings: (settings: { duration: number; questionCount: number }) => void;
  onLogout: () => void;
  onRefreshData?: () => Promise<void>;
}

export function AdminPanel({ 
  literature, 
  questions,
  results, 
  settings,
  onAddLiterature, 
  onDeleteLiterature, 
  onUploadQuestions,
  onUpdateSettings,
  onLogout,
  onRefreshData
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'literature' | 'uploads' | 'results' | 'settings'>('dashboard');
  const [newLit, setNewLit] = useState({ title: '', author: '', description: '' });
  const [selectedLitId, setSelectedLitId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [tempSettings, setTempSettings] = useState(settings);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedLitId) return;

    try {
      setIsUploading(true);
      const parsed = await parseWordTest(file);
      if (parsed.length === 0) {
        throw new Error('Fayl ichidan test savollari topilmadi. Jadval shaklida ekanligini tekshiring.');
      }
      await onUploadQuestions(selectedLitId, parsed);
      alert(`Muvaffaqiyatli! ${parsed.length} ta savol yuklandi.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Faylni o\'qishda xatolik yuz berdi. Fayl .docx formatida va jadval ko\'rinishida ekanligini tekshiring.');
    } finally {
      setIsUploading(false);
    }
  };

  const getQuestionCount = (id: string) => {
    return questions.filter(q => q.literatureId === id).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-indigo-100 flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800 tracking-tight flex items-center gap-2">
          <ShieldCheck size={28} className="text-indigo-400" />
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-700 text-white shadow-lg shadow-black/20' : 'hover:bg-indigo-800/50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('literature')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'literature' ? 'bg-indigo-700 text-white shadow-lg shadow-black/20' : 'hover:bg-indigo-800/50'}`}
          >
            <Book size={20} /> Adabiyotlar
          </button>
          <button 
            onClick={() => setActiveTab('uploads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'uploads' ? 'bg-indigo-700 text-white shadow-lg shadow-black/20' : 'hover:bg-indigo-800/50'}`}
          >
            <Upload size={20} /> Test Yuklash
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'results' ? 'bg-indigo-700 text-white shadow-lg shadow-black/20' : 'hover:bg-indigo-800/50'}`}
          >
            <Users size={20} /> Natijalar
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-indigo-700 text-white shadow-lg shadow-black/20' : 'hover:bg-indigo-800/50'}`}
          >
            <Settings size={20} /> Sozlamalar
          </button>
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full hover:bg-rose-900/50 text-rose-200 rounded-xl transition-colors">
            <LogOut size={20} /> Chiqish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Statistika</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-indigo-600 text-white border-none p-8 shadow-lg shadow-indigo-200">
                <div className="text-indigo-100 flex items-center gap-2 mb-4">
                  <Book size={24} /> Jami adabiyotlar
                </div>
                <div className="text-4xl font-bold">{literature.length}</div>
              </Card>
              <Card className="bg-emerald-600 text-white border-none p-8 shadow-lg shadow-emerald-200">
                <div className="text-emerald-100 flex items-center gap-2 mb-4">
                  <Users size={24} /> Test topshirganlar
                </div>
                <div className="text-4xl font-bold">{results.length}</div>
              </Card>
              <Card className="bg-amber-600 text-white border-none p-8 shadow-lg shadow-amber-200">
                <div className="text-amber-100 flex items-center gap-2 mb-4">
                  <FileText size={24} /> Jami savollar
                </div>
                <div className="text-4xl font-bold">{questions.length}</div>
              </Card>
            </div>

            <Card className="p-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Joriy sozlamalar</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-gray-500 uppercase font-black">Test vaqti</div>
                  <div className="text-2xl font-bold text-indigo-600">{settings.duration} minut</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase font-black">Savollar soni</div>
                  <div className="text-2xl font-bold text-indigo-600">{settings.questionCount} ta</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-8 py-12 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Tizim sozlamalari</h1>
            <Card className="p-8 space-y-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test davomiyligi (minut)</label>
                  <Input 
                    type="number" 
                    value={tempSettings.duration}
                    onChange={e => setTempSettings({...tempSettings, duration: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Testdagi savollar soni</label>
                  <Input 
                    type="number" 
                    value={tempSettings.questionCount}
                    onChange={e => setTempSettings({...tempSettings, questionCount: parseInt(e.target.value) || 0})}
                  />
                  <p className="text-xs text-gray-400 mt-2">Talaba bir necha kitob tanlasa, savollar shu songa bo'linadi.</p>
                </div>
              </div>
              <Button onClick={() => {
                onUpdateSettings(tempSettings);
                alert("Sozlamalar saqlandi!");
              }} className="w-full">Saqlash</Button>
            </Card>
          </div>
        )}

        {activeTab === 'literature' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 font-sans">Adabiyotlar boshqaruvi</h1>
              <div className="flex gap-4">
                <Input placeholder="Kitob nomi" value={newLit.title} onChange={e => setNewLit({...newLit, title: e.target.value})} className="w-48" />
                <Input placeholder="Muallif" value={newLit.author} onChange={e => setNewLit({...newLit, author: e.target.value})} className="w-48" />
                <Button onClick={() => {
                  onAddLiterature(newLit);
                  setNewLit({ title: '', author: '', description: '' });
                }} className="flex items-center gap-2">
                  <Plus size={20} /> Qo'shish
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="font-mono text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Nomi</th>
                    <th className="px-6 py-4">Muallif</th>
                    <th className="px-6 py-4 text-center">Savollar soni</th>
                    <th className="px-6 py-4">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-mono text-sm">
                  {literature.map(lit => (
                    <tr key={lit.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{lit.title}</td>
                      <td className="px-6 py-4 text-gray-600">{lit.author}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getQuestionCount(lit.id) > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                          {getQuestionCount(lit.id)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => onDeleteLiterature(lit.id)} className="text-rose-500 hover:text-rose-700 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="max-w-xl mx-auto space-y-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Testlarni yuklash</h1>
            <p className="text-gray-500">Word faylini (tablitsali) yuklang. Har bir savol 5 ta katakdan iborat bo'lishi kerak.</p>
            
            <Card className="p-12 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 text-left">Adabiyotni tanlang</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-200"
                  value={selectedLitId}
                  onChange={e => setSelectedLitId(e.target.value)}
                >
                  <option value="">Tanlang...</option>
                  {literature.map(lit => <option key={lit.id} value={lit.id}>{lit.title}</option>)}
                </select>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  accept=".doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={!selectedLitId || isUploading}
                />
                <div className={`p-12 border-2 border-dashed rounded-3xl flex flex-col items-center gap-4 transition-colors ${
                  isUploading ? 'bg-gray-50 border-gray-200' : 'border-indigo-200 group-hover:border-indigo-400 bg-indigo-50/30'
                }`}>
                  <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600">
                    <FileText size={32} />
                  </div>
                  <div className="font-medium text-gray-900">
                    {isUploading ? "Yuklanmoqda..." : "Word faylini bosing yoki sudrab keling"}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">.doc, .docx fayllar uchun</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Talabalar natijalari</h1>
          {onRefreshData && (
            <Button 
              variant="outline" 
              onClick={async () => {
                await onRefreshData();
                alert("Ma'lumotlar yangilandi!");
              }}
              className="flex items-center gap-2"
            >
              <Users size={18} /> Yangilash
            </Button>
          )}
        </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="font-mono text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Ism Familiya</th>
                    <th className="px-6 py-4">Natija</th>
                    <th className="px-6 py-4">Sana</th>
                    <th className="px-6 py-4">Dona</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-mono text-sm">
                  {results.map(res => (
                    <tr key={res.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{res.studentSurname} {res.studentName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            (res.score / res.total) > 0.7 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {res.score} / {res.total}
                          </span>
                          <button 
                            onClick={() => {
                              const selectedLitTitles = literature
                                .filter(l => res.literatureIds.includes(l.id))
                                .map(l => l.title);
                              
                              import('../lib/pdf').then(({ generateResultsPDF }) => {
                                generateResultsPDF({
                                  studentName: res.studentName,
                                  studentSurname: res.studentSurname,
                                  literatureTitles: selectedLitTitles,
                                  score: res.score,
                                  total: res.total,
                                  timestamp: new Date(res.timestamp),
                                });
                              });
                            }}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Natijani PDF yuklab olish"
                          >
                            <FileText size={18} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(res.timestamp).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(res.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
