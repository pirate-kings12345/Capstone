import React from 'react';
import { motion } from 'motion/react';
import { Camera, Edit3, Settings } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { AppLayout } from '../../layouts/AppLayout';
import { useAppNavigation } from '../../navigation/AppNavigator';

export const Profile: React.FC = () => {
  const { userName, isGuestMode, history, savedResults } = useAppStore();
  const { navigate } = useAppNavigation();

  return (
    <AppLayout title="Profile" showBack>
      <div className="w-full max-w-xl mx-auto space-y-8 pb-12">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-4"
        >
          <div className="relative">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #4FC3F7 0%, #1F3FAF 100%)',
                border: '4px solid white',
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : 'A'}
            </div>
            {isGuestMode && (
              <div className="absolute bottom-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
                GUEST
              </div>
            )}
          </div>
          
          <h2 className="mt-4 text-2xl font-black text-[#111111]">
            {userName || 'Explorer'}
          </h2>
          {!isGuestMode && (
            <p className="text-sm text-slate-500 mt-1 font-medium">user@example.com</p>
          )}

          <div className="flex gap-3 mt-5">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button 
              onClick={() => navigate('Settings')}
              className="flex items-center justify-center w-11 h-11 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Quick Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#1F3FAF]">{history.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scans</span>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#4FC3F7]">{savedResults.length}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Saved</span>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-black text-slate-700 mt-1">2026</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Member</span>
          </div>
        </motion.div>

        {/* Recent Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-[#111111] mb-4 pl-2">Recent Collections</h3>

          {savedResults.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-md border border-slate-200 border-dashed rounded-[32px] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-[#111111] font-bold mb-2">No saved fish yet.</h4>
              <p className="text-sm text-slate-500 mb-6 max-w-[200px]">
                Build your collection by scanning and saving species.
              </p>
              <button 
                onClick={() => navigate('Camera')}
                className="bg-[#1F3FAF] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#1F3FAF]/30 hover:bg-[#1a3696] transition-all cursor-pointer"
              >
                Start Scanning
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedResults.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 cursor-pointer"
                  onClick={() => navigate('SavedResults')}
                >
                  <div className="aspect-square rounded-2xl bg-slate-100 mb-3 overflow-hidden">
                    <img src={item.imageUrl} alt={item.commonName} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold text-sm text-[#111111] truncate">{item.commonName}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{item.date}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
