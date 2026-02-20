import { useState } from 'react';
import { mockBuildings } from '../data/mock';
import { Building2, Plus } from 'lucide-react';

export default function Settings() {
  const [buildings, setBuildings] = useState(mockBuildings);
  const currentUser = 'u1'; // Mocking current user

  const toggleResponsible = (buildingId: string) => {
    setBuildings(buildings.map(b => {
      if (b.id === buildingId) {
        const isResponsible = b.relatedUsers.includes(currentUser);
        return {
          ...b,
          relatedUsers: isResponsible
            ? b.relatedUsers.filter(id => id !== currentUser)
            : [...b.relatedUsers, currentUser]
        };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Building Portfolio</h2>
            <p className="text-sm text-gray-500">Manage the buildings under your responsibility</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer shadow-sm">
          <Plus size={18} />
          Add Building
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map(building => {
          const isResponsible = building.relatedUsers.includes(currentUser);

          return (
            <div key={building.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-mono font-medium">
                  {building.buildingNum}
                </div>
                {isResponsible ? (
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    Active
                  </span>
                ) : (
                  <span className="bg-gray-50 text-gray-400 px-2.5 py-1 rounded-md text-xs font-semibold">
                    Inactive
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{building.name}</h3>
              <p className="text-sm text-gray-500 mb-6 flex items-start gap-1">
                {building.address}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Responsible</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isResponsible}
                    onChange={() => toggleResponsible(building.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
