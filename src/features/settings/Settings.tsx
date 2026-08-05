import React, { useState, useEffect } from 'react';
import { 
  UserCircle2, Lock, ShieldCheck, Info, LogOut, ChevronRight, 
  Trash2, RefreshCw, AlertCircle, X, Check, FileText, 
  Code2, Users, Camera, Image as ImageIcon, Upload
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { AppLayout } from '../../layouts/AppLayout';
import { useAppNavigation } from '../../navigation/AppNavigator';
import { useCamera } from '../../hooks/mobile/useCamera';
import { AuthService } from '../../services/firebase/AuthService';
import { StorageService } from '../../services/firebase/StorageService';
import { UserRepository } from '../../repositories/UserRepository';
import { MobileStorageService } from '../../services/mobile/MobileStorageService';

export const Settings: React.FC = () => {
  const {
    clearScanHistory,
    userProfile,
    setUserProfile,
    isGuestMode,
    setIsGuestMode,
    setUserName,
    setOnboardingCompleted
  } = useAppStore();

  const { navigate } = useAppNavigation();
  const camera = useCamera();

  // Modals & Dialogs State
  const [activeModal, setActiveModal] = useState<
    'edit_profile' | 'change_password' | 'privacy_policy' | 'terms_of_service' | 'licenses' | null
  >(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDangerous?: boolean;
    onConfirm: () => Promise<void> | void;
  }>({ isOpen: false, title: '', message: '', confirmText: '', onConfirm: () => {} });

  // Edit Profile Local States
  const [editDisplayName, setEditDisplayName] = useState('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState('');

  // Change Password Local States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Feedback Banner & Loading States
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Account Type Detection
  const provider = userProfile?.provider || (isGuestMode ? 'guest' : 'email');
  const isGoogleUser = provider === 'google' || provider === 'google.com';
  const isEmailUser = !isGuestMode && !isGoogleUser;

  // Sync state when entering edit modal
  useEffect(() => {
    if (activeModal === 'edit_profile') {
      setEditDisplayName(userProfile?.displayName || (isGuestMode ? 'Guest User' : ''));
      setPreviewPhotoUrl(userProfile?.photoURL || '');
      camera.clearImage(); // Clear any previous captures
    }
  }, [activeModal, userProfile, isGuestMode]);

  // Update preview when new image is captured from camera/gallery
  useEffect(() => {
    if (camera.capturedImage) {
      setPreviewPhotoUrl(camera.capturedImage);
    }
  }, [camera.capturedImage]);

  // Auto-dismiss Feedback Banners
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Profile Save Handler (Supports Firebase & SQLite/Local)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const newDisplayName = editDisplayName.trim();
      let newPhotoURL = previewPhotoUrl;
      const isNewPhoto = previewPhotoUrl.startsWith('data:');

      if (isGuestMode) {
        // Guest user: save to local state and mobile storage
        const updatedProfile = {
          ...userProfile,
          displayName: newDisplayName,
          photoURL: newPhotoURL,
        };
        setUserProfile(updatedProfile);
        setUserName(newDisplayName);
        await MobileStorageService.getInstance().setJSON('guestProfile', updatedProfile);
      } else {
        // Authenticated user: save to Firebase
        const authService = AuthService.getInstance();
        const currentUser = authService.getCurrentUser();
        if (!currentUser) throw new Error('You are not logged in.');

        // 1. If new photo, upload to Storage
        if (isNewPhoto && newPhotoURL) {
          const storageService = StorageService.getInstance();
          const uploadedUrl = await storageService.uploadProfilePhoto(newPhotoURL);
          if (!uploadedUrl) throw new Error('Failed to upload new profile picture.');
          newPhotoURL = uploadedUrl;
        }

        // 2. Update Firebase Auth profile
        await updateProfile(currentUser, {
          displayName: newDisplayName,
          photoURL: newPhotoURL,
        });

        // 3. Update Firestore profile document
        const userRepository = UserRepository.getInstance();
        await userRepository.updateProfile(currentUser.uid, {
          displayName: newDisplayName,
          photoURL: newPhotoURL,
        });
        
        // 4. Update local state
        setUserProfile({
          ...userProfile,
          displayName: newDisplayName,
          photoURL: newPhotoURL,
        });
        setUserName(newDisplayName);
      }

      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
      setActiveModal(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  // Password Change Handler
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const authService = AuthService.getInstance();
      const user = authService.getCurrentUser();
      if (!user || !user.email) throw new Error('You must be logged in to change your password.');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, newPassword);

      setFeedback({ type: 'success', message: 'Password updated successfully.' });
      setActiveModal(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to update password. Please check your current password and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Clear Local Data Handler
  const triggerDeleteLocalData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Local Data?',
      message: 'This will permanently delete all locally stored scans, downloaded fish information, cached images, and settings from this device.',
      confirmText: 'Delete Data',
      isDangerous: true,
      onConfirm: async () => {
        setLoading(true);
        try {
          clearScanHistory();
          if (isGuestMode) {
            setUserProfile(null);
            setUserName('');
          }
          setFeedback({ type: 'success', message: 'Local storage and cache cleared.' });
        } catch (err) {
          setFeedback({ type: 'error', message: 'Failed to clear local data.' });
        } finally {
          setLoading(false);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Logout Handler
  const triggerLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Logout',
      message: 'Are you sure you want to end your current AQUAID session?',
      confirmText: 'Logout',
      isDangerous: true,
      onConfirm: async () => {
        setLoading(true);
        try {
          setUserName('');
          setUserProfile(null);
          setOnboardingCompleted(false);
          setIsGuestMode(false);
          navigate('Login');
        } catch (err) {
          setFeedback({ type: 'error', message: 'Logout failed. Please try again.' });
        } finally {
          setLoading(false);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <AppLayout title="Settings" showBack>
      <div className="w-full max-w-xl mx-auto space-y-8 pb-24 bg-slate-50 px-4 pt-4">
        
        {/* Global Toast Notification */}
        {feedback && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 max-w-md w-11/12 animate-in fade-in slide-in-from-top-4 duration-300 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {feedback.type === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="text-sm font-bold flex-1">{feedback.message}</p>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ACCOUNT SECTION */}
        <div className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-200/80 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <UserCircle2 className="w-6 h-6 text-[#1F3FAF]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Account</h3>
          </div>

          {/* User Status Card */}
          <div className="p-4 bg-slate-100/80 rounded-2xl flex items-center justify-between border border-slate-200/90">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=1F3FAF&color=fff`}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-base font-extrabold text-slate-900 truncate">
                  {userProfile?.displayName || (isGuestMode ? 'Guest User' : 'AQUAID Member')}
                </h4>
                <p className="text-sm font-medium text-slate-700 truncate">
                  {isGuestMode ? 'Offline Session' : userProfile?.email || 'No email associated'}
                </p>
              </div>
            </div>
            <span className={`text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-full border shrink-0 ${
              isGoogleUser 
                ? 'bg-blue-100 text-blue-800 border-blue-200/80'
                : isEmailUser 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200/80'
                : 'bg-amber-100 text-amber-800 border-amber-200/80'
            }`}>
              {isGoogleUser ? 'Google' : isEmailUser ? 'Email' : 'Guest'}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Edit Profile Button */}
            <button
              onClick={() => setActiveModal('edit_profile')}
              className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-200/60 px-4 py-4 rounded-2xl border border-slate-200/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <UserCircle2 className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-bold text-slate-800">Edit Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            {/* Change Password Button (Restricted to Email Users) */}
            {isEmailUser && (
              <button
                onClick={() => setActiveModal('change_password')}
                className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-200/60 px-4 py-4 rounded-2xl border border-slate-200/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-bold text-slate-800">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            )}

            {/* Logout Action */}
            <button
              onClick={triggerLogout}
              className="w-full flex items-center justify-center gap-2.5 mt-4 py-4 bg-rose-100/80 hover:bg-rose-100 text-rose-700 font-extrabold text-sm rounded-2xl border-2 border-rose-200/30 transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              Logout
            </button>
          </div>
        </div>

        {/* PRIVACY & SECURITY SECTION */}
        <div className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#1F3FAF]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Privacy & Security</h3>
          </div>

          <div className="space-y-3 pt-1">
            <button
              onClick={() => setActiveModal('privacy_policy')}
              className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-200/60 px-4 py-4 rounded-2xl border border-slate-200/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-bold text-slate-800">Privacy Policy</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveModal('terms_of_service')}
              className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-200/60 px-4 py-4 rounded-2xl border border-slate-200/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-bold text-slate-800">Terms of Service</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* DATA MANAGEMENT SECTION */}
        <div className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Data Management</h3>
          </div>

          <button
            onClick={triggerDeleteLocalData}
            className="w-full flex items-center justify-between bg-rose-100/30 hover:bg-rose-100/70 border-2 border-rose-200/50 px-4 py-4 rounded-2xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Trash2 className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-left">
                <span className="text-sm font-extrabold text-rose-800 block">Delete Local Data</span>
                <span className="text-xs font-medium text-slate-600 block mt-1">
                  {isGuestMode 
                    ? 'Clears all local scans & offline database.' 
                    : 'Deletes local cache; cloud account remains safe.'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400 shrink-0" />
          </button>
        </div>

        {/* ABOUT AQUAID SECTION */}
        <div className="bg-white p-5 rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Info className="w-6 h-6 text-[#1F3FAF]" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">About AQUAID</h3>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center bg-slate-100/80 px-4 py-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-sm font-bold text-slate-700">Application Version</span>
              <span className="text-sm font-black text-[#1F3FAF] bg-blue-100 px-3 py-1 rounded-lg border border-blue-200/80">v2.0.0</span>
            </div>

            <div className="bg-slate-100/80 p-4 rounded-2xl space-y-2 border border-slate-200/80">
              <div className="flex items-center gap-3 font-extrabold text-slate-900 text-sm">
                <Users className="w-5 h-5 text-[#1F3FAF]" />
                <span>Developer Team</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed pl-8">
                Capstone Researchers<br />
                Aurora State University of Science and Technology (ASUST)<br />
                BS Information Technology
              </p>
            </div>

            <div className="bg-slate-100/80 p-4 rounded-2xl space-y-2 border border-slate-200/80">
              <div className="flex items-center gap-3 font-extrabold text-slate-900 text-sm">
                <Code2 className="w-5 h-5 text-[#1F3FAF]" />
                <span>Project Information</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed pl-8">
                AQUAID – Fish Recognition & Classification System Using Artificial Intelligence
              </p>
            </div>

            <button
              onClick={() => setActiveModal('licenses')}
              className="w-full flex items-center justify-between bg-slate-100/80 hover:bg-slate-200/60 px-4 py-4 rounded-2xl border border-slate-200/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-bold text-slate-800">Open Source Licenses</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* MODALS & OVERLAYS */}

      {/* EDIT PROFILE MODAL */}
      {activeModal === 'edit_profile' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6 animate-in fade-in-20 zoom-in-95 duration-300 border-2 border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Edit Profile</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Photo Preview & Options */}
              <div className="flex flex-col items-center gap-5">
                <div className="relative group cursor-pointer">
                  <img
                    src={previewPhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(editDisplayName || 'User')}&background=1F3FAF&color=fff`}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-8 border-slate-100 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Upload className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Picture Picker Trigger Buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={camera.takePhoto}
                    className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-colors border border-slate-200"
                  >
                    <Camera className="w-4.5 h-4.5 text-[#1F3FAF]" />
                    Take Photo
                  </button>

                  <button
                    type="button"
                    onClick={camera.pickFromGallery}
                    className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 transition-colors border border-slate-200"
                  >
                    <ImageIcon className="w-4.5 h-4.5 text-[#1F3FAF]" />
                    From Gallery
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3.5 bg-slate-100/80 rounded-2xl border-2 border-slate-200/90 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F3FAF] focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-800 font-extrabold text-sm rounded-2xl hover:bg-slate-200/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-[#1F3FAF] text-white font-extrabold text-sm rounded-2xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/10"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {activeModal === 'change_password' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-6 animate-in fade-in-20 zoom-in-95 duration-300 border-2 border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Change Password</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-100/80 rounded-2xl border-2 border-slate-200/90 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F3FAF] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-100/80 rounded-2xl border-2 border-slate-200/90 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F3FAF] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-100/80 rounded-2xl border-2 border-slate-200/90 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1F3FAF] focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-800 font-extrabold text-sm rounded-2xl hover:bg-slate-200/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-[#1F3FAF] text-white font-extrabold text-sm rounded-2xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/10"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INFORMATIONAL MODALS (Privacy / Terms / Licenses) */}
      {(activeModal === 'privacy_policy' || activeModal === 'terms_of_service' || activeModal === 'licenses') && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in-20 zoom-in-95 duration-300 border-2 border-slate-100">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900 capitalize">
                {activeModal.replace('_', ' ')}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 text-sm leading-relaxed text-slate-700 space-y-5 font-medium">
              {activeModal === 'privacy_policy' && (
                <>
                  <p className="font-extrabold text-slate-900 text-base">1. Data Handling & Security</p>
                  <p>AQUAID collects diagnostic camera feeds and scan metadata to perform localized fish species identification. Information captured in Guest Mode remains on your local hardware cache.</p>
                  <p className="font-extrabold text-slate-900 text-base">2. Synchronization</p>
                  <p>Cloud users benefit from encrypted database backups stored in Firebase Firestore and Firebase Storage.</p>
                </>
              )}

              {activeModal === 'terms_of_service' && (
                <>
                  <p className="font-extrabold text-slate-900 text-base">1. Terms of Use</p>
                  <p>AQUAID is an academic research platform developed under Aurora State University of Science and Technology. Species classification metrics are provided for analytical purposes.</p>
                </>
              )}

              {activeModal === 'licenses' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-100/80 rounded-2xl border-2 border-slate-200/60">
                    <p className="font-extrabold text-slate-900 text-base">React & React Native</p>
                    <p className="text-sm font-semibold text-slate-600">MIT License - Copyright (c) Meta Platforms, Inc.</p>
                  </div>
                  <div className="p-4 bg-slate-100/80 rounded-2xl border-2 border-slate-200/60">
                    <p className="font-extrabold text-slate-900 text-base">Firebase Cloud Infrastructure</p>
                    <p className="text-sm font-semibold text-slate-600">Apache License 2.0 - Google LLC</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t-2 border-slate-100">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3.5 bg-[#1F3FAF] text-white font-extrabold rounded-2xl text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl space-y-5 animate-in fade-in-20 zoom-in-95 duration-300 border-2 border-slate-100 text-center">
            <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${
              confirmDialog.isDangerous ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-[#1F3FAF]'
            }`}>
              {confirmDialog.isDangerous ? <AlertCircle className="w-7 h-7" /> : <Info className="w-7 h-7" />}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900">{confirmDialog.title}</h3>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">{confirmDialog.message}</p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                disabled={loading}
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3.5 bg-slate-100 text-slate-800 font-extrabold rounded-2xl text-sm hover:bg-slate-200/80 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={confirmDialog.onConfirm}
                className={`flex-1 py-3.5 font-extrabold rounded-2xl text-white transition-colors flex items-center justify-center gap-2 shadow-lg ${
                  confirmDialog.isDangerous 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10' 
                    : 'bg-[#1F3FAF] hover:bg-blue-800 shadow-blue-500/10'
                }`}
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}


    </AppLayout>
  );
};

export default Settings;