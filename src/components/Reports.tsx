import { useState } from 'react';
import { mockBuildings, mockUsers } from '../data/mock';
import { Download, Mail, Filter, Plus, Trash2, FileText, ArrowLeft, Save, Pencil } from 'lucide-react';

interface SavedReport {
  id: string;
  name: string;
  statusFilter: string;
  buildingFilter: string;
  userFilter: string;
  timePeriod: string;
  automated: boolean;
  frequency?: 'weekly' | 'monthly';
}

const initialReports: SavedReport[] = [
  {
    id: 'r1',
    name: 'Monthly Building B-01 Overview',
    statusFilter: 'All Statuses',
    buildingFilter: 'b1',
    userFilter: 'All Users',
    timePeriod: 'Last 30 Days',
    automated: true,
    frequency: 'monthly'
  },
  {
    id: 'r2',
    name: 'Weekly In-Progress Tasks',
    statusFilter: 'In Progress',
    buildingFilter: 'All Buildings',
    userFilter: 'All Users',
    timePeriod: 'Last 7 Days',
    automated: true,
    frequency: 'weekly'
  }
];

export default function Reports() {
  const [isCreating, setIsCreating] = useState(false);
  const [reports, setReports] = useState<SavedReport[]>(initialReports);

  // Form State
  const [reportName, setReportName] = useState('');
  const [status, setStatus] = useState('All Statuses');
  const [building, setBuilding] = useState('All Buildings');
  const [user, setUser] = useState('All Users');
  const [timePeriod, setTimePeriod] = useState('Last 30 Days');
  const [automated, setAutomated] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');

  const handleDelete = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const handleSaveReport = () => {
    if (!reportName.trim()) return;

    const newReport: SavedReport = {
      id: Math.random().toString(36).substr(2, 9),
      name: reportName,
      statusFilter: status,
      buildingFilter: building,
      userFilter: user,
      timePeriod,
      automated,
      frequency: automated ? frequency : undefined
    };

    setReports([...reports, newReport]);
    setIsCreating(false);

    // Reset form
    setReportName('');
    setStatus('All Statuses');
    setBuilding('All Buildings');
    setUser('All Users');
    setTimePeriod('Last 30 Days');
    setAutomated(false);
    setFrequency('weekly');
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <button
          onClick={() => setIsCreating(false)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Reports
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Report</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Report Name</label>
              <input
                type="text"
                placeholder="e.g., Monthly Maintenance Overview"
                value={reportName}
                onChange={e => setReportName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                Filter Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Statuses</option>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                  <select
                    value={building}
                    onChange={e => setBuilding(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Buildings</option>
                    {mockBuildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                  <select
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Users</option>
                    {mockUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                  <select
                    value={timePeriod}
                    onChange={e => setTimePeriod(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Year to Date</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                Automated Reports
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Send by Email (.pdf)</p>
                    <p className="text-xs text-gray-500">Automatically generate and send this report.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={automated} onChange={() => setAutomated(!automated)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {automated && (
                  <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="frequency" value="weekly" checked={frequency === 'weekly'} onChange={() => setFrequency('weekly')} className="text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Weekly</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="frequency" value="monthly" checked={frequency === 'monthly'} onChange={() => setFrequency('monthly')} className="text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Monthly</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                disabled={!reportName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
              >
                <Save size={18} />
                Save Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Saved Reports</h2>
            <p className="text-sm text-gray-500">Manage your automated and saved reports</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={18} />
          New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 pr-4">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{report.name}</h3>
                <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 cursor-pointer">
                  <Pencil size={14} />
                </button>
              </div>
              <button
                onClick={() => handleDelete(report.id)}
                className="text-gray-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                title="Delete Report"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-2 mb-6 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium text-gray-900">{report.statusFilter}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Building:</span>
                <span className="font-medium text-gray-900 truncate max-w-[120px]" title={report.buildingFilter}>
                  {report.buildingFilter === 'All Buildings' ? 'All' : mockBuildings.find(b => b.id === report.buildingFilter)?.name || report.buildingFilter}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Period:</span>
                <span className="font-medium text-gray-900">{report.timePeriod}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              {report.automated ? (
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                  <Mail size={14} />
                  Automated ({report.frequency})
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-semibold">
                  Manual Only
                </div>
              )}

              <button className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-xl transition-colors cursor-pointer" title="Generate Now">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No saved reports</h3>
            <p className="text-gray-500 mb-4">Create your first report to get started.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Create New Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
