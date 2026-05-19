/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, LogIn, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { StudentHome } from './components/StudentHome';
import { Question, TestView } from './components/TestView';
import { Button, Card, Input } from './components/ui';
import { supabase } from './lib/supabase';

type View = 'student-home' | 'testing' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [view, setView] = useState<View>('student-home');
  const [studentInfo, setStudentInfo] = useState({ name: '', surname: '', selectedIds: [] as string[] });
  const [literature, setLiterature] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [settings, setSettings] = useState({ duration: 30, questionCount: 50 });

  // Load data from Supabase on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Literature
      const { data: litData } = await supabase.from('literature').select('*').order('created_at', { ascending: false });
      if (litData) setLiterature(litData);

      // 2. Fetch Questions
      const { data: qData } = await supabase.from('questions').select('*');
      if (qData) {
        const mappedQuestions: Question[] = qData.map(q => ({
          id: q.id,
          literatureId: q.literature_id,
          question: q.question_text,
          options: q.options,
          correctOption: q.correct_option
        }));
        setAllQuestions(mappedQuestions);
      }

      // 3. Fetch Results
      const { data: resData } = await supabase.from('results').select('*').order('timestamp', { ascending: false });
      if (resData) {
        const mappedResults = resData.map(r => ({
          ...r,
          literatureIds: r.literature_ids,
          studentName: r.student_name,
          studentSurname: r.student_surname
        }));
        setResults(mappedResults);
      }

      // 4. Fetch Settings
      const { data: settsData } = await supabase.from('settings').select('*').eq('key', 'main').single();
      if (settsData) {
        setSettings({ duration: settsData.duration, questionCount: settsData.question_count });
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  };

  const handleUpdateSettings = async (newSettings: { duration: number, questionCount: number }) => {
    setSettings(newSettings);
    await supabase.from('settings').upsert({ 
      key: 'main', 
      duration: newSettings.duration, 
      question_count: newSettings.questionCount 
    });
  };

  const startTest = ({ name, surname, selectedLiteratureIds }: { name: string; surname: string; selectedLiteratureIds: string[] }) => {
    setStudentInfo({ name, surname, selectedIds: selectedLiteratureIds });
    
    const TOTAL_QUESTIONS = settings.questionCount; 
    const finalQuestions: Question[] = [];
    const countPerLit = Math.floor(TOTAL_QUESTIONS / selectedLiteratureIds.length);
    let remainder = TOTAL_QUESTIONS % selectedLiteratureIds.length;

    selectedLiteratureIds.forEach((litId) => {
      const litQuestions = allQuestions.filter(q => q.literatureId === litId);
      const taking = countPerLit + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      const shuffledLit = [...litQuestions].sort(() => Math.random() - 0.5);
      finalQuestions.push(...shuffledLit.slice(0, Math.min(taking, shuffledLit.length)));
    });
    
    if (finalQuestions.length === 0) {
      alert("Tanlangan adabiyotlar bo'yicha savollar topilmadi. Iltimos, boshqa adabiyot tanlang yoki admin bilan bog'laning.");
      return;
    }

    const finalShuffled = finalQuestions.sort(() => Math.random() - 0.5);
    setTestQuestions(finalShuffled);
    setView('testing');
  };

  const finishTest = async (result: any) => {
    const finalResult = {
      student_name: studentInfo.name,
      student_surname: studentInfo.surname,
      score: result.score,
      total: result.total,
      literature_ids: studentInfo.selectedIds,
      timestamp: new Date().toISOString(),
    };
    
    const { data, error } = await supabase.from('results').insert([finalResult]).select();
    if (error) {
      console.error('Error saving result:', error);
    } else if (data) {
      setResults([data[0], ...results]);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin777') { 
      setIsAdminAuthenticated(true);
      setView('admin-dashboard');
    } else {
      alert("Parol noto'g'ri!");
    }
  };

  const handleAddLiterature = async (lit: any) => {
    const { data, error } = await supabase.from('literature').insert([{
      title: lit.title,
      author: lit.author,
      description: lit.description
    }]).select();

    if (data) {
      setLiterature([data[0], ...literature]);
    }
  };

  const handleDeleteLiterature = async (id: string) => {
    const { error } = await supabase.from('literature').delete().eq('id', id);
    if (!error) {
      setLiterature(literature.filter(l => l.id !== id));
      setAllQuestions(allQuestions.filter(q => q.literatureId !== id));
    }
  };

  const handleUploadQuestions = async (litId: string, qList: any[]) => {
    const dbQuestions = qList.map(q => ({
      literature_id: litId,
      question_text: q.question,
      options: q.options,
      correct_option: q.correctOption
    }));

    const { data, error } = await supabase.from('questions').insert(dbQuestions).select();
    
    if (data) {
      const mapped = data.map(q => ({
        id: q.id,
        literatureId: q.literature_id,
        question: q.question_text,
        options: q.options,
        correctOption: q.correct_option
      }));
      setAllQuestions([...allQuestions, ...mapped]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      {view !== 'admin-dashboard' && (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
          <div 
            className="flex items-center gap-2 text-indigo-700 font-bold text-xl cursor-pointer"
            onClick={() => setView('student-home')}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <BookOpen size={24} />
            </div>
            <span className="hidden sm:inline tracking-tight">GulDPI Kitobxonlik</span>
          </div>
          <div className="flex gap-4">
            {view === 'student-home' && (
              <button 
                onClick={() => setView('admin-login')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium text-sm"
              >
                <ShieldCheck size={18} /> Admin Panel
              </button>
            )}
            {view === 'admin-login' && (
              <button 
                onClick={() => setView('student-home')}
                className="text-gray-500 hover:text-indigo-600 transition-colors font-medium text-sm"
              >
                Bosh sahifa
              </button>
            )}
          </div>
        </nav>
      )}

      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {view === 'student-home' && (
          <StudentHome literatureList={literature} onStartTest={startTest} />
        )}

        {view === 'testing' && (
          <TestView 
            questions={testQuestions} 
            studentName={studentInfo.name} 
            studentSurname={studentInfo.surname}
            onFinish={finishTest}
            durationMinutes={settings.duration}
          />
        )}

        {view === 'admin-login' && (
          <div className="max-w-md mx-auto py-24 px-4 text-center space-y-8">
            <div className="p-6 bg-indigo-100 rounded-full inline-block text-indigo-600">
              <LogIn size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Admin tizimiga kirish</h2>
              <Card className="p-8 space-y-6">
                <div className="text-left space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Admin paroli</label>
                  <Input 
                    type="password" 
                    placeholder="Parolni kiriting" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                </div>
                <Button className="w-full" onClick={handleAdminLogin}>Kirish</Button>
                <p className="text-xs text-gray-400">Parol: xxx</p>
              </Card>
            </div>
          </div>
        )}

        {view === 'admin-dashboard' && (
          <AdminPanel 
            literature={literature}
            questions={allQuestions}
            results={results}
            settings={settings}
            onAddLiterature={handleAddLiterature}
            onDeleteLiterature={handleDeleteLiterature}
            onUploadQuestions={handleUploadQuestions}
            onUpdateSettings={handleUpdateSettings}
            onLogout={() => {
              setIsAdminAuthenticated(false);
              setView('student-home');
            }}
          />
        )}
      </main>

      {view !== 'admin-dashboard' && (
        <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Guliston Davlat Pedagogika Instituti. Barcha huquqlar himoyalangan.
        </footer>
      )}
    </div>
  );
}

