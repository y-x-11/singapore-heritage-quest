import { useState } from 'react';
import { generateJoinCode } from '@heritage/shared';

export default function Classes() {
  const [classes, setClasses] = useState([
    { id: '1', name: 'Heritage Explorers 2026', school: 'UWCSEA Dover', code: 'HERIT1', students: 5 },
  ]);
  const [newName, setNewName] = useState('');
  const [newSchool, setNewSchool] = useState('');

  const createClass = () => {
    if (!newName) return;
    setClasses([
      ...classes,
      { id: String(Date.now()), name: newName, school: newSchool || 'International School', code: generateJoinCode(), students: 0 },
    ]);
    setNewName('');
    setNewSchool('');
  };

  return (
    <div>
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-2">Classes</h1>
      <p className="text-navy/60 font-body mb-8">Create classes and manage join codes</p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">Create New Class</h2>
        <div className="flex gap-4 flex-wrap">
          <input
            placeholder="Class name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 font-body flex-1 min-w-[200px] focus:border-teal outline-none"
          />
          <input
            placeholder="School name"
            value={newSchool}
            onChange={(e) => setNewSchool(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 font-body flex-1 min-w-[200px] focus:border-teal outline-none"
          />
          <button onClick={createClass} className="bg-teal text-white font-heading font-bold px-6 py-2 rounded-xl hover:bg-teal/90">
            Create Class
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-navy">{cls.name}</h3>
              <p className="text-navy/50 font-body text-sm">{cls.school} · {cls.students} students</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-navy/50 font-body">Join Code</p>
              <p className="font-heading font-extrabold text-2xl text-teal tracking-widest">{cls.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
