import { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchTodos, fetchBuildings } from '../lib/api';
import { Todo, Building } from '../types';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [todosData, buildingsData] = await Promise.all([
          fetchTodos(),
          fetchBuildings()
        ]);
        setTodos(todosData);
        setBuildings(buildingsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    const inProgress = todos.filter(t => t.status === 'In Progress').length;
    const notStarted = todos.filter(t => t.status === 'Not Started').length;
    const completed = todos.filter(t => t.status === 'Completed').length;
    const total = todos.length;

    const statusData = [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Not Started', value: notStarted, color: '#f43f5e' },
    ];

    const buildingData = buildings.map(b => {
      const opened = todos.filter(t => t.buildingId === b.id && t.status !== 'Completed').length;
      return { name: b.name, opened };
    });

    // Simplified monthly data for demo (can be enhanced with real date parsing)
    const monthlyData = [
      { name: 'Aug', new: 2, completed: 1 },
      { name: 'Sep', new: 5, completed: 3 },
      { name: 'Oct', new: 3, completed: 2 },
    ];

    return { inProgress, notStarted, completed, total, statusData, buildingData, monthlyData };
  }, [todos, buildings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards with Gradients */}
        <div className="bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 font-medium">Not Started</p>
              <h3 className="text-4xl font-bold text-gray-900 mt-2">{stats.notStarted}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
              <AlertCircle className="text-rose-500" size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Tasks waiting to begin</p>
        </div>

        <div className="bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 font-medium">In Progress</p>
              <h3 className="text-4xl font-bold text-gray-900 mt-2">{stats.inProgress}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
              <Clock className="text-blue-500" size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Tasks currently active</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-100 via-green-50 to-lime-50 p-6 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 font-medium">Completed</p>
              <h3 className="text-4xl font-bold text-gray-900 mt-2">{stats.completed}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-500" size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Tasks finished (last 30 days)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Todos per Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Opened Todos per Building</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.buildingData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <XAxis type="number" allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="opened" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">New vs Completed Todos (Monthly)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Legend />
                <Bar dataKey="new" name="New Todos" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="completed" name="Completed Todos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
