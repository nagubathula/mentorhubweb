"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Settings, User, Key, Bell, Shield, LogOut, X, ChevronRight, 
  ArrowLeft, Check, Lock, Eye, EyeOff, AlertCircle, Sparkles, Mail, MapPin, Briefcase,
  Camera, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

interface MentorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    email: string;
    role: string;
    location: string;
    avatar: string | null;
  };
  onProfileUpdate: () => void;
  onSignOut?: () => void;
}

type ViewState = "MAIN" | "EDIT_PROFILE" | "CHANGE_PASSWORD" | "NOTIFICATIONS" | "PRIVACY";

export function MentorSettingsModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
  onSignOut
}: MentorSettingsModalProps) {
  const [currentView, setCurrentView] = useState<ViewState>("MAIN");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Picture State & Ref
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isRemoveAvatarModalOpen, setIsRemoveAvatarModalOpen] = useState(false);
  const [isPreviewAvatarOpen, setIsPreviewAvatarOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  // Edit Profile Form State
  const [nameInput, setNameInput] = useState(profile.name || "");
  const [emailInput, setEmailInput] = useState(profile.email || "");
  const [roleInput, setRoleInput] = useState(profile.role || "");
  const [locationInput, setLocationInput] = useState(profile.location || "");
  const [avatarInput, setAvatarInput] = useState(profile.avatar || "");

  // Change Password Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    sessionReminders: true,
    menteeRequests: true,
    weeklyDigest: false,
  });

  // Privacy Preferences State
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: true,
    showLocation: true,
    directMessages: true,
  });

  // Keep form fields synced when profile prop changes
  useEffect(() => {
    setNameInput(profile.name || "");
    setEmailInput(profile.email || "");
    setRoleInput(profile.role || "");
    setLocationInput(profile.location || "");
    setAvatarInput(profile.avatar || "");
  }, [profile]);

  // Load saved preferences from localStorage if available
  useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem("mentor_notif_prefs");
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedPrivacy = localStorage.getItem("mentor_privacy_prefs");
      if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
    } catch (e) {
      console.warn("Failed to load preferences from localStorage", e);
    }
  }, []);

  if (!isOpen) return null;

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Avatar Upload Handler
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      let finalAvatarUrl = "";
      if (userId) {
        const fileExt = file.name.split('.').pop() || 'png';
        const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        if (!uploadErr) {
          const { data: { publicUrl: url } } = supabase.storage.from('avatars').getPublicUrl(filePath);
          finalAvatarUrl = url;
        }
      }

      if (!finalAvatarUrl) {
        finalAvatarUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      setAvatarInput(finalAvatarUrl);

      if (userId) {
        const { data: prof } = await supabase.from('profiles').select('preferences').eq('id', userId).maybeSingle();
        const currentPrefs = (prof?.preferences as any) || {};
        const updatedPrefs = { ...currentPrefs, avatar_url: finalAvatarUrl };

        await supabase
          .from('profiles')
          .update({ preferences: updatedPrefs })
          .eq('id', userId);
      }

      onProfileUpdate();
      showToast("success", "Profile picture updated successfully!");
    } catch (err: any) {
      console.error("Failed to upload avatar:", err);
      showToast("error", "Failed to upload profile picture.");
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  // Avatar Remove Handler
  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // 1. Storage Cleanup if Supabase Storage URL
      if (avatarInput && avatarInput.includes('/storage/v1/object/public/avatars/')) {
        try {
          const parts = avatarInput.split('/storage/v1/object/public/avatars/');
          if (parts.length > 1) {
            const filePath = decodeURIComponent(parts[1]);
            await supabase.storage.from('avatars').remove([filePath]);
          }
        } catch (storageErr) {
          console.warn("Storage avatar removal warning:", storageErr);
        }
      }

      // 2. Database Update
      if (userId) {
        const { data: prof } = await supabase.from('profiles').select('preferences').eq('id', userId).maybeSingle();
        const currentPrefs = (prof?.preferences as any) || {};
        const updatedPrefs = { ...currentPrefs, avatar_url: null };

        const { error: dbErr } = await supabase
          .from('profiles')
          .update({ preferences: updatedPrefs })
          .eq('id', userId);

        if (dbErr) {
          console.error("Database avatar removal error:", dbErr);
          showToast("error", "Failed to remove profile picture: " + dbErr.message);
          return;
        }
      }

      setAvatarInput("");
      onProfileUpdate();
      showToast("success", "Profile picture removed successfully!");
      setIsRemoveAvatarModalOpen(false);
    } catch (err: any) {
      console.error("Remove profile picture error:", err);
      showToast("error", "Failed to remove profile picture.");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // 1. Edit Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Fallback local update if no active Supabase session
        showToast("success", "Profile details updated locally.");
        onProfileUpdate();
        setIsSaving(false);
        return;
      }

      const currentUserId = session.user.id;
      const { data: prof } = await supabase.from("profiles").select("preferences").eq("id", currentUserId).maybeSingle();
      const currentPrefs = (prof?.preferences as any) || {};

      // Update Supabase profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          name: nameInput,
          expertise: roleInput,
          preferences: {
            ...currentPrefs,
            location: locationInput,
            avatar_url: avatarInput || null
          }
        })
        .eq("id", currentUserId);

      if (error) {
        console.error("Supabase profile update error:", error);
        showToast("error", error.message || "Failed to update profile in database.");
      } else {
        showToast("success", "Profile updated successfully!");
        onProfileUpdate();
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      showToast("error", "An unexpected error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match. Please try again.");
      return;
    }

    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        showToast("error", error.message || "Failed to update password.");
      } else {
        showToast("success", "Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      showToast("error", "Failed to update password. Please check your credentials.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Save Notification Settings
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("mentor_notif_prefs", JSON.stringify(notifications));
      showToast("success", "Notification preferences saved!");
    } catch (err) {
      showToast("error", "Failed to save preferences.");
    }
  };

  // 4. Save Privacy Settings
  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("mentor_privacy_prefs", JSON.stringify(privacy));
      showToast("success", "Privacy settings updated!");
    } catch (err) {
      showToast("error", "Failed to save privacy settings.");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white px-6 py-5 relative shrink-0 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {currentView !== "MAIN" ? (
              <button 
                type="button"
                onClick={() => { setCurrentView("MAIN"); setFeedbackMsg(null); }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Back to Settings"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#4F46E5]/20 border border-[#4F46E5]/40 flex items-center justify-center text-[#4F46E5]">
                <Settings className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                {currentView === "MAIN" && "Settings"}
                {currentView === "EDIT_PROFILE" && "Edit Profile"}
                {currentView === "CHANGE_PASSWORD" && "Change Password"}
                {currentView === "NOTIFICATIONS" && "Notification Settings"}
                {currentView === "PRIVACY" && "Privacy Settings"}
              </h3>
              <p className="text-[11px] text-[#CBD5E1] font-semibold uppercase tracking-wider">
                {currentView === "MAIN" && "Manage your mentor profile & options"}
                {currentView === "EDIT_PROFILE" && "Update your public profile details"}
                {currentView === "CHANGE_PASSWORD" && "Update your account password"}
                {currentView === "NOTIFICATIONS" && "Manage email & session alerts"}
                {currentView === "PRIVACY" && "Control your profile visibility"}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMsg && (
          <div className={`px-6 py-3 text-xs font-semibold flex items-center gap-2 border-b shrink-0 ${
            feedbackMsg.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}>
            {feedbackMsg.type === "success" ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto hidden-scrollbar flex-1 space-y-4">

          {/* MAIN MENU */}
          {currentView === "MAIN" && (
            <div className="space-y-3">
              <button 
                type="button"
                onClick={() => setCurrentView("EDIT_PROFILE")}
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-100 flex items-center justify-between group transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Edit Profile</h4>
                    <p className="text-[11.5px] text-slate-400 font-medium">Update name, expertise, location & photo</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                type="button"
                onClick={() => setCurrentView("CHANGE_PASSWORD")}
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-100 flex items-center justify-between group transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">Change Password</h4>
                    <p className="text-[11.5px] text-slate-400 font-medium">Update your account login password</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                type="button"
                onClick={() => setCurrentView("NOTIFICATIONS")}
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-100 flex items-center justify-between group transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Notification Settings</h4>
                    <p className="text-[11.5px] text-slate-400 font-medium">Manage email alerts & session reminders</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button 
                type="button"
                onClick={() => setCurrentView("PRIVACY")}
                className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-100 flex items-center justify-between group transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Privacy Settings</h4>
                    <p className="text-[11.5px] text-slate-400 font-medium">Control profile visibility & contact info</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Logout Button Option */}
              {onSignOut && (
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  className="w-full p-4 rounded-2xl border border-rose-100 bg-rose-50/30 hover:bg-rose-50 flex items-center justify-between group transition-all cursor-pointer text-left mt-2"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-rose-600">Sign Out</h4>
                      <p className="text-[11.5px] text-rose-400 font-medium">Safely log out of your MentorHub account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              )}
            </div>
          )}

          {/* VIEW: EDIT PROFILE */}
          {currentView === "EDIT_PROFILE" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Full Name</Label>
                <div className="relative">
                  <Input 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="h-12 rounded-xl border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white pl-10"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Expertise / Role Title</Label>
                <div className="relative">
                  <Input 
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g. Senior React Developer & Mentor"
                    required
                    className="h-12 rounded-xl border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white pl-10"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Location</Label>
                <div className="relative">
                  <Input 
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="h-12 rounded-xl border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white pl-10"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Email Address</Label>
                <div className="relative">
                  <Input 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    type="email"
                    disabled
                    className="h-12 rounded-xl border-slate-200 text-sm font-medium bg-slate-100 text-slate-500 pl-10 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
                <p className="text-[10px] text-slate-400 ml-1">Email cannot be modified directly.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Profile Picture</Label>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {avatarInput ? (
                    <button
                      type="button"
                      onClick={() => setIsPreviewAvatarOpen(true)}
                      className="w-16 h-16 rounded-2xl bg-cover bg-center border-2 border-slate-200 shrink-0 relative group overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer"
                      style={{ backgroundImage: `url(${avatarInput})` }}
                      title="Tap to view full profile picture"
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase backdrop-blur-[1px]">
                        <Eye className="w-3.5 h-3.5 mr-0.5" /> View
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 border border-slate-300 hover:scale-105 transition-transform cursor-pointer"
                      title="Upload profile picture"
                    >
                      <User className="w-7 h-7" />
                    </button>
                  )}

                  <div className="flex flex-col gap-2 flex-1">
                    {avatarInput ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isUploadingAvatar || isRemovingAvatar}
                          className="h-9 px-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          {isUploadingAvatar ? "Uploading..." : "Change Photo"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setIsRemoveAvatarModalOpen(true)}
                          disabled={isUploadingAvatar || isRemovingAvatar}
                          className="h-9 px-3.5 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar || isRemovingAvatar}
                        className="h-9 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 w-fit"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        {isUploadingAvatar ? "Uploading..." : "+ Upload Profile Picture"}
                      </Button>
                    )}
                    <p className="text-[11px] text-slate-500 font-medium">Supports JPG, PNG or WEBP.</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-500">Or Paste Image URL</Label>
                  <Input 
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-10 rounded-xl border-slate-200 text-xs font-medium bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentView("MAIN")}
                  className="flex-1 h-12 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}

          {/* VIEW: CHANGE PASSWORD */}
          {currentView === "CHANGE_PASSWORD" && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">New Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="h-12 rounded-xl border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="h-12 rounded-xl border-slate-200 text-sm font-medium bg-slate-50 focus:bg-white pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentView("MAIN")}
                  className="flex-1 h-12 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 h-12 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          )}

          {/* VIEW: NOTIFICATION SETTINGS */}
          {currentView === "NOTIFICATIONS" && (
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Email Notifications</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Receive important emails regarding your account</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Session Reminders</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Get reminders 15 minutes before 1:1 sessions</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifications.sessionReminders}
                    onChange={(e) => setNotifications({ ...notifications, sessionReminders: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Mentee Assignment Alerts</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Notify when new mentees request guidance</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifications.menteeRequests}
                    onChange={(e) => setNotifications({ ...notifications, menteeRequests: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Weekly Mentor Summary</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Receive weekly progress updates on your mentees</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentView("MAIN")}
                  className="flex-1 h-12 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Preferences
                </Button>
              </div>
            </form>
          )}

          {/* VIEW: PRIVACY SETTINGS */}
          {currentView === "PRIVACY" && (
            <form onSubmit={handleSavePrivacy} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Public Profile Visibility</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Allow mentees to find your mentor profile</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={privacy.profileVisible}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Show Email to Mentees</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Display email address on mentor profile card</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Show Location</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Display your city/region on your profile</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={privacy.showLocation}
                    onChange={(e) => setPrivacy({ ...privacy, showLocation: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h5 className="text-[13.5px] font-semibold text-slate-800">Direct Messaging</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Allow assigned mentees to message you directly</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={privacy.directMessages}
                    onChange={(e) => setPrivacy({ ...privacy, directMessages: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentView("MAIN")}
                  className="flex-1 h-12 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Settings
                </Button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer / Close Action */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end shrink-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 hover:bg-white font-medium text-xs shadow-2xs cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Remove Profile Picture Confirmation Dialog */}
      {isRemoveAvatarModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 leading-tight">Remove profile picture?</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Are you sure you want to remove your profile picture?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRemoveAvatarModalOpen(false)}
                disabled={isRemovingAvatar}
                className="h-9 px-4 rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isRemovingAvatar}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isRemovingAvatar ? "Removing..." : "Remove"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Photo Preview Lightbox Modal */}
      {isPreviewAvatarOpen && avatarInput && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setIsPreviewAvatarOpen(false)}
        >
          <div 
            className="bg-slate-900 rounded-[2.5rem] p-6 max-w-sm w-full border border-slate-800 shadow-2xl flex flex-col items-center gap-5 text-center relative animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setIsPreviewAvatarOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image Preview */}
            <div className="relative mt-2">
              <div 
                className="w-64 h-64 md:w-72 md:h-72 rounded-[2.5rem] border-4 border-white/20 bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: `url(${avatarInput})` }}
              />
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">{nameInput || "Mentor"}</h3>
              <p className="text-xs text-slate-400 font-medium">{roleInput || "Mentor Profile"}</p>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2.5 w-full pt-2 border-t border-slate-800/80">
              <Button
                type="button"
                onClick={() => {
                  setIsPreviewAvatarOpen(false);
                  avatarInputRef.current?.click();
                }}
                disabled={isUploadingAvatar || isRemovingAvatar}
                className="flex-1 h-11 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4 mr-1.5" />
                Change Photo
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsPreviewAvatarOpen(false);
                  setIsRemoveAvatarModalOpen(true);
                }}
                disabled={isUploadingAvatar || isRemovingAvatar}
                className="flex-1 h-11 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
