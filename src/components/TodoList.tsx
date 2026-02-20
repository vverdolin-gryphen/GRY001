import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchTodos, updateTodoStatus, updateTodoDetails, createUpdate } from '../lib/api';
import { mockBuildings, mockUsers } from '../data/mock';
import { format, differenceInDays } from 'date-fns';
import { Filter, X, Save, MessageSquare, Flag, Plus } from 'lucide-react';
import { Todo, Status, Priority } from '../types';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // New Todo State
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Filters
  const [statusFilters, setStatusFilters] = useState<Status[]>(['Not Started', 'In Progress', 'Completed']);
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [filterBuilding, setFilterBuilding] = useState<string>('All');

  // Modal State
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [modalUpdateText, setModalUpdateText] = useState('');

  useEffect(() => {
    async function loadTodos() {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch todos", error);
      } finally {
        setLoading(false);
      }
    }
    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTodoTitle,
      description: "New task description...",
      status: 'Not Started',
      priority: 'Low',
      buildingId: 'b1',
      updates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos([newTodo, ...todos]);
    setNewTodoTitle('');
    setIsAdding(false);
  };

  const togglePriority = async (e: React.MouseEvent, todo: Todo) => {
    e.stopPropagation();
    const toggledPriority = todo.priority === 'High' ? 'Low' : 'High';

    const updatedTodo = { ...todo, priority: toggledPriority };
    setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));

    try {
      await updateTodoDetails(updatedTodo);
    } catch (err) {
      console.error("Failed to update priority", err);
    }
  };

  const filteredTodos = useMemo(() => {
    let result = todos.filter(todo => {
      if (!statusFilters.includes(todo.status)) return false;
      if (filterBuilding !== 'All' && todo.buildingId !== filterBuilding) return false;
      return true;
    });

    result.sort((a, b) => {
      if (highPriorityOnly) {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (a.priority !== 'High' && b.priority === 'High') return 1;
      }
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });

    return result;
  }, [todos, statusFilters, highPriorityOnly, filterBuilding]);

  // ... (Keep existing handlers: toggleStatusFilter, handleModalUpdate, saveModalChanges, helpers)

  const toggleStatusFilter = (status: Status) => {
    setStatusFilters(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const getDaysOpened = (todo: any) => {
    if (todo.status === 'Not Started') return 0;
    const start = new Date(todo.inProgressOn || todo.openedOn);
    const end = todo.status === 'Completed' ? new Date(todo.completedOn!) : new Date();
    return differenceInDays(end, start);
  };

  const getCardStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-[#f0fdf4] border-emerald-200';
      case 'In Progress': return 'bg-[#f4f9ff] border-blue-200';
      case 'Not Started': return 'bg-[#fff8f8] border-rose-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Not Started': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'text-rose-500';
      case 'Medium': return 'text-amber-500';
      case 'Low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const handleModalUpdate = async () => {
    if (!editingTodo || !modalUpdateText.trim()) return;
    try {
      const newUpdate = await createUpdate(editingTodo.id, modalUpdateText);
      const updatedTodo = { ...editingTodo, updates: [newUpdate, ...editingTodo.updates] };
      setEditingTodo(updatedTodo);
      setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
      setModalUpdateText('');
    } catch (error) { console.error(error); }
  };

  const saveModalChanges = async () => {
    if (!editingTodo) return;
    try {
      await updateTodoDetails(editingTodo);
      await updateTodoStatus(editingTodo.id, editingTodo.status);
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? editingTodo : t));
      setEditingTodo(null);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
            <div className="flex flex-wrap gap-2">
              {(['Not Started', 'In Progress', 'Completed'] as Status[]).map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${statusFilters.includes(status)
                    ? getBadgeStyle(status)
                    : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden lg:block mx-2"></div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">High Priority:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={highPriorityOnly}
                onChange={() => setHighPriorityOnly(!highPriorityOnly)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden lg:block mx-2"></div>

          <select
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
          >
            <option value="All">All Buildings</option>
            {mockBuildings.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.buildingNum})</option>
            ))}
          </select>
        </div>

        {/* ADD TODO BUTTON */}
        <div className="flex items-center gap-2 w-full xl:w-auto">
          {isAdding ? (
            <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-right-4">
              <input
                autoFocus
                type="text"
                placeholder="Task title..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full xl:w-48 outline-none focus:ring-2 focus:ring-slate-900"
                value={newTodoTitle}
                onChange={e => setNewTodoTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
              />
              <button onClick={handleAddTodo} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                <Save size={16} />
              </button>
              <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full xl:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors cursor-pointer shadow-sm shadow-slate-200"
            >
              <Plus size={18} />
              Add Task
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTodos.map(todo => {
          const building = mockBuildings.find(b => b.id === todo.buildingId);
          const latestUpdate = todo.updates[0];
          const isPriority = todo.priority === 'High';

          return (
            <div
              key={todo.id}
              onClick={() => setEditingTodo(todo)}
              className={`rounded-3xl shadow-sm border p-6 flex flex-col min-h-[260px] transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer ${getCardStyle(todo.status)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(todo.status)}`}>
                  {todo.status}
                </span>

                <div
                  onClick={(e) => togglePriority(e, todo)}
                  title="Toggle Priority"
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-full shadow-sm border cursor-pointer transition-all ${isPriority
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                >
                  <Flag size={14} className={isPriority ? 'fill-amber-500 text-amber-500' : ''} />
                  <span className="text-xs font-semibold">{isPriority ? 'Important' : 'Normal'}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-900 leading-tight mb-2 line-clamp-2" title={todo.title}>{todo.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <span className="truncate max-w-[150px]" title={building?.name}>{building?.name}</span>
                  <span>•</span>
                  <span>{getDaysOpened(todo)}d open</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 mb-6">{todo.description}</p>

              <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  <span>{todo.updates.length} updates</span>
                </div>
                {latestUpdate && (
                  <span className="truncate max-w-[140px] italic text-gray-400" title={latestUpdate.description}>
                    "{latestUpdate.description}"
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filteredTodos.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No todos found matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Todo Details Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Edit Todo Details</h2>
              <button
                onClick={() => setEditingTodo(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingTodo.title}
                      onChange={e => setEditingTodo({ ...editingTodo, title: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingTodo.description}
                      onChange={e => setEditingTodo({ ...editingTodo, description: e.target.value })}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        value={editingTodo.status}
                        onChange={e => setEditingTodo({ ...editingTodo, status: e.target.value as Status })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                      <select
                        value={editingTodo.priority}
                        onChange={e => setEditingTodo({ ...editingTodo, priority: e.target.value as Priority })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Building</label>
                    <select
                      value={editingTodo.buildingId}
                      onChange={e => setEditingTodo({ ...editingTodo, buildingId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {mockBuildings.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Updates</label>
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-y-auto mb-4 space-y-3 min-h-[200px]">
                    {editingTodo.updates.length > 0 ? (
                      editingTodo.updates.map((update, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm">
                          <span className="font-semibold text-gray-900 block mb-1 text-xs text-blue-600">
                            {format(new Date(update.timestamp), 'MMM d, yyyy - HH:mm')}
                          </span>
                          <span className="text-gray-700">{update.description}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center mt-4">No updates yet.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a new update..."
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      value={modalUpdateText}
                      onChange={(e) => setModalUpdateText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleModalUpdate()}
                    />
                    <button
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center justify-center cursor-pointer font-medium text-sm"
                      onClick={handleModalUpdate}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setEditingTodo(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveModalChanges}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer text-sm flex items-center gap-2 shadow-sm"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
