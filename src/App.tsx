/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
// Add X to imports
import { Bell, Search, Plus, LogOut, Loader2, X, Camera } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    slackHandle: '',
    avatarUrl: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.user_metadata) {
        setProfile({
          fullName: session.user.user_metadata.full_name || '',
          phoneNumber: session.user.user_metadata.phone_number || '',
          slackHandle: session.user.user_metadata.slack_handle || '',
          avatarUrl: session.user.user_metadata.avatar_url || ''
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.user_metadata) {
        setProfile({
          fullName: session.user.user_metadata.full_name || '',
          phoneNumber: session.user.user_metadata.phone_number || '',
          slackHandle: session.user.user_metadata.slack_handle || '',
          avatarUrl: session.user.user_metadata.avatar_url || ''
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleUpdateProfile = async () => {
    if (!session) return;
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          phone_number: profile.phoneNumber,
          slack_handle: profile.slackHandle,
          avatar_url: profile.avatarUrl
        }
      });
      if (error) throw error;
      setShowProfileModal(false);
      // Optional: Show success toast
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'todos':
        return <TodoList />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {activeTab === 'todos' ? 'To do' : activeTab}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'dashboard' && 'Your personal dashboard overview'}
              {activeTab === 'todos' && 'Manage your property tasks'}
              {activeTab === 'reports' && 'Generate and schedule reports'}
              {activeTab === 'settings' && 'Manage your building portfolio'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Removed Add Todo Button from Header */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100/80 border-none rounded-full py-2.5 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{profile.fullName || session.user.email?.split('@')[0]}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 cursor-pointer group relative hover:shadow-md transition-all"
                onClick={() => setShowProfileModal(true)}
              >
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${session.user.email}&background=random`} alt="User" referrerPolicy="no-referrer" />
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                      <img src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${session.user.email}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slack Handle</label>
                <input
                  type="text"
                  value={profile.slackHandle}
                  onChange={e => setProfile({ ...profile, slackHandle: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="@john.doe"
                />
              </div>


            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setShowProfileModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer text-sm">Cancel</button>
              <button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer text-sm shadow-sm">Save Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
