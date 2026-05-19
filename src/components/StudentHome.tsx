/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, GraduationCap, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Button, Card, Input } from './ui';

interface Literature {
  id: string;
  title: string;
  author: string;
}

interface StudentHomeProps {
  onStartTest: (data: { name: string; surname: string; selectedLiteratureIds: string[] }) => void;
  literatureList: Literature[];
}

export function StudentHome({ onStartTest, literatureList }: StudentHomeProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleLiterature = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (!name || !surname || selectedIds.length === 0) return;
    onStartTest({ name, surname, selectedLiteratureIds: selectedIds });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block p-4 bg-indigo-100 rounded-full text-indigo-600 mb-4"
        >
          <GraduationCap size={48} />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Guliston davlat pedagogika instituti
        </h1>
        <p className="text-xl text-gray-600">
          Kitobxonlik online test topshirish platformasiga xush kelibsiz
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-600 font-semibold mb-2">
            <User size={24} />
            <h2>Shaxsiy ma'lumotlar</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ismingiz</label>
              <Input 
                placeholder="Ismingizni kiriting" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Familiyangiz</label>
              <Input 
                placeholder="Familiyangizni kiriting" 
                value={surname} 
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-600 font-semibold mb-2">
            <BookOpen size={24} />
            <h2>Adabiyotlarni tanlang</h2>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-indigo-200">
            {literatureList.map((lit) => (
              <label 
                key={lit.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedIds.includes(lit.id) 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <input 
                  type="checkbox"
                  className="hidden"
                  checked={selectedIds.includes(lit.id)}
                  onChange={() => toggleLiterature(lit.id)}
                />
                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
                  selectedIds.includes(lit.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                }`}>
                  {selectedIds.includes(lit.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{lit.title}</div>
                  <div className="text-sm text-gray-500">{lit.author}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          size="lg" 
          disabled={!name || !surname || selectedIds.length === 0}
          onClick={handleStart}
          className="w-full md:w-auto"
        >
          Testni boshlash
        </Button>
      </div>
    </div>
  );
}
