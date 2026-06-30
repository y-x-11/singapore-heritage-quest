import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { MISSIONS, LOCATIONS } from '@heritage/shared';

interface Student {
  id: string;
  name: string;
  xp: number;
  level: number;
  completed: number;
  lastActive: string;
  location: string;
}

const DEMO_STUDENTS: Student[] = [
  { id: '1', name: 'Aisha K.', xp: 320, level: 4, completed: 5, lastActive: 'Today', location: 'chinatown' },
  { id: '2', name: 'Marcus T.', xp: 275, level: 3, completed: 4, lastActive: 'Today', location: 'little-india' },
  { id: '3', name: 'Priya S.', xp: 210, level: 3, completed: 3, lastActive: '2 days ago', location: 'kampong-glam' },
  { id: '4', name: 'James L.', xp: 180, level: 2, completed: 2, lastActive: '3 days ago', location: 'chinatown' },
  { id: '5', name: 'Emma W.', xp: 150, level: 2, completed: 2, lastActive: 'Today', location: 'little-india' },
];

const columnHelper = createColumnHelper<Student>();

const columns = [
  columnHelper.accessor('name', { header: 'Name', cell: (info) => (
    <Link to={`/students/${info.row.original.id}`} className="text-teal font-semibold hover:underline">
      {info.getValue()}
    </Link>
  )}),
  columnHelper.accessor('xp', { header: 'XP' }),
  columnHelper.accessor('level', { header: 'Level', cell: (info) => `Lv. ${info.getValue()}` }),
  columnHelper.accessor('completed', { header: 'Missions', cell: (info) => `${info.getValue()}/${MISSIONS.length}` }),
  columnHelper.accessor('lastActive', { header: 'Last Active' }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => LOCATIONS.find((l) => l.id === info.getValue())?.name ?? info.getValue(),
  }),
];

export default function Students() {
  const [filter, setFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  const filtered = DEMO_STUDENTS.filter((s) => {
    if (locationFilter !== 'all' && s.location !== locationFilter) return false;
    return s.name.toLowerCase().includes(filter.toLowerCase());
  });

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportCsv = () => {
    const header = 'Name,XP,Level,Missions Completed,Last Active,Location\n';
    const rows = filtered.map((s) =>
      `${s.name},${s.xp},${s.level},${s.completed}/${MISSIONS.length},${s.lastActive},${LOCATIONS.find((l) => l.id === s.location)?.name}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heritage-quest-progress.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-navy">Students</h1>
          <p className="text-navy/60 font-body">Track individual student progress</p>
        </div>
        <button onClick={exportCsv} className="bg-navy text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-navy/90">
          Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search students..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2 font-body flex-1 max-w-xs focus:border-teal outline-none"
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2 font-body focus:border-teal outline-none"
        >
          <option value="all">All Locations</option>
          {LOCATIONS.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-left px-6 py-4 font-heading font-bold text-sm text-navy/70">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-50 hover:bg-cream/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 font-body text-sm text-navy">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
