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
  onStartTest: (data: { 
    name: string; 
    surname: string; 
    course: string; 
    educationType: string; 
    specialty: string; 
    selectedLiteratureIds: string[] 
  }) => void;
  literatureList: Literature[];
}

const BAKALAVRIAT_SPECIALTIES = [
  "Pedagogika",
  "Maktabgacha ta’lim",
  "Boshlang‘ich ta’lim",
  "Tasviriy san’at va muhandislik grafikasi",
  "Musiqa ta’limi",
  "O‘zbek tili va adabiyoti",
  "Ona tili va adabiyoti: rus tili",
  "Ona tili va adabiyoti: qozoq tili",
  "Xorijiy til va adabiyoti: ingliz tili",
  "Milliy g‘oya, ma’naviyat asoslari va huquq ta’limi",
  "Jismoniy madaniyat",
  "Texnologik ta’lim",
  "Tarix",
  "Biologiya",
  "Kimyo",
  "Geografiya",
  "Fizika",
  "Matematika",
  "Amaliy matematika"
];

const MAGISTRATURA_SPECIALTIES = [
  "Pedagogika",
  "Ta’lim va tarbiya nazariyasi va metodikasi (maktabgacha ta’lim)",
  "Ta’lim va tarbiya nazariyasi va metodikasi (boshlang‘ich ta’lim)",
  "Tasviriy san’at",
  "O‘zbek tili va adabiyoti",
  "Xorijiy til va adabiyoti: ingliz tili",
  "Ijtimoiy-gumanitar fanlarni o‘qitish metodikasi (ma’naviyat asoslari)",
  "Ijtimoiy-gumanitar fanlarni o‘qitish metodikasi (huquq ta’limi)",
  "Jismoniy tarbiya va sport mashg‘ulotlari nazariyasi va metodikasi",
  "Ijtimoiy-gumanitar fanlarni o‘qitish metodikasi (tarix)",
  "Aniq va tabiiy fanlarni o‘qitish metodikasi (biologiya)",
  "Aniq va tabiiy fanlarni o‘qitish metodikasi (kimyo)",
  "Aniq va tabiiy fanlarni o‘qitish metodikasi (geografiya)",
  "Ta'limda axborot texnologiyalari"
];

export function StudentHome({ onStartTest, literatureList }: StudentHomeProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [course, setCourse] = useState(''); // '1' yoki '2'
  const [educationType, setEducationType] = useState(''); // 'Bakalavriat' yoki 'Magistratura'
  const [specialty, setSpecialty] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleLiterature = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (!name || !surname || !course || !educationType || !specialty || selectedIds.length === 0) return;
    onStartTest({ 
      name, 
      surname, 
      course, 
      educationType, 
      specialty, 
      selectedLiteratureIds: selectedIds 
    });
  };

  const currentSpecialties = educationType === 'Bakalavriat' 
    ? BAKALAVRIAT_SPECIALTIES 
    : educationType === 'Magistratura' 
      ? MAGISTRATURA_SPECIALTIES 
      : [];

  const isFormValid = name.trim() && surname.trim() && course && educationType && specialty && selectedIds.length > 0;

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

            {/* Kursni tanlash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kursni tanlang</label>
              <div className="grid grid-cols-2 gap-3">
                {['1', '2'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCourse(c)}
                    className={`py-2.5 px-4 rounded-xl border-2 transition-all font-medium text-sm ${
                      course === c
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {c}-kurs
                  </button>
                ))}
              </div>
            </div>

            {/* Ta'lim turini tanlash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ta'lim turi</label>
              <div className="grid grid-cols-2 gap-3">
                {['Bakalavriat', 'Magistratura'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setEducationType(type);
                      setSpecialty(''); // Ta'lim turi o'zgarganda yo'nalishni tozalaymiz
                    }}
                    className={`py-2.5 px-4 rounded-xl border-2 transition-all font-medium text-sm ${
                      educationType === type
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Yo'nalishlarni tanlash */}
            {educationType && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-350">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mutaxassislik yo'nalishi</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white text-gray-700 font-medium transition-all duration-200"
                >
                  <option value="" disabled>Yo'nalishingizni tanlang</option>
                  {currentSpecialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
          disabled={!isFormValid}
          onClick={handleStart}
          className="w-full md:w-auto"
        >
          Testni boshlash
        </Button>
      </div>
    </div>
  );
}
