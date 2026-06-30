import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MISSIONS, LOCATIONS } from '@heritage/shared';

const DEMO_STUDENTS = [
  { name: 'Aisha K.', xp: 320, completed: 5, active: true },
  { name: 'Marcus T.', xp: 275, completed: 4, active: true },
  { name: 'Priya S.', xp: 210, completed: 3, active: false },
  { name: 'James L.', xp: 180, completed: 2, active: false },
  { name: 'Emma W.', xp: 150, completed: 2, active: true },
];

const LOCATION_PROGRESS = LOCATIONS.map((loc) => ({
  name: loc.name.split(' ')[0],
  completed: DEMO_STUDENTS.reduce((sum, s) => sum + Math.min(s.completed, 3), 0),
}));

const PIE_DATA = [
  { name: 'Completed', value: 16, color: '#2A9D8F' },
  { name: 'In Progress', value: 8, color: '#FFD166' },
  { name: 'Not Started', value: 21, color: '#E0E0E0' },
];

export default function Dashboard() {
  const avgCompletion = Math.round(
    (DEMO_STUDENTS.reduce((s, st) => s + st.completed, 0) / (DEMO_STUDENTS.length * MISSIONS.length)) * 100
  );
  const activeToday = DEMO_STUDENTS.filter((s) => s.active).length;
  const topPerformers = [...DEMO_STUDENTS].sort((a, b) => b.xp - a.xp).slice(0, 3);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-2">Dashboard</h1>
      <p className="text-navy/60 font-body mb-8">Class overview and progress analytics</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-navy/60 font-body text-sm">Avg Completion</p>
          <p className="font-heading font-extrabold text-4xl text-teal mt-1">{avgCompletion}%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-navy/60 font-body text-sm">Active Today</p>
          <p className="font-heading font-extrabold text-4xl text-sunshine mt-1">{activeToday}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-navy/60 font-body text-sm">Total Students</p>
          <p className="font-heading font-extrabold text-4xl text-merlion mt-1">{DEMO_STUDENTS.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Progress by Location</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={LOCATION_PROGRESS}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="completed" fill="#2A9D8F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Mission Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PIE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">🏆 Top Performers</h2>
        <div className="space-y-3">
          {topPerformers.map((s, i) => (
            <div key={s.name} className="flex items-center gap-4">
              <span className="font-heading font-extrabold text-gold w-6">{i + 1}</span>
              <span className="font-body font-semibold text-navy flex-1">{s.name}</span>
              <span className="font-heading font-bold text-teal">{s.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
