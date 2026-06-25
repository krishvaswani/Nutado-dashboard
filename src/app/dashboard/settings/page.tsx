"use client";

import { useState, useEffect } from "react";
import { Save, Bell, Palette, User, Shield, Building, Monitor, Users, Search, RefreshCw, Plus, Check, Sliders, PartyPopper, Trash2, Heart, ShoppingBag, Gift, Star, Cake, Flame, Calendar, Sparkles, Lock, Pencil, X, Image as ImageIcon, ImageOff } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  CUSTOM_BOX_CRITERIA_KEY,
  DEFAULT_CUSTOM_BOX_CRITERIA,
} from "@/lib/constants";
import { getAllUsers, updateUserRole, upsertUserProfile, subscribeOccasions, createOccasion, deleteOccasion, updateOccasion, uploadImageFile, adminCreateEmployee, deleteUserProfile } from "@/lib/firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import type { AuthProfile } from "@/types";

const TABS = [
  { id: "profile",      label: "Profile",      icon: User     },
  { id: "company",      label: "Company",      icon: Building },
  { id: "criteria",     label: "Box Criteria",  icon: Sliders  },
  { id: "employees",    label: "Employees & Roles", icon: Users },
  { id: "occasions",    label: "Manage Occasions", icon: PartyPopper },
  { id: "branding",     label: "Branding",     icon: Palette  },
  { id: "appearance",   label: "Appearance",   icon: Monitor  },
  { id: "notifications",label: "Notifications",icon: Bell     },
  { id: "security",     label: "Security",     icon: Shield   },
];

const MINI_ICON_MAP: Record<string, any> = {
  Sparkles,
  Heart,
  ShoppingBag,
  PartyPopper,
  Gift,
  Star,
  Cake,
  Flame,
  Calendar,
};



export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [primaryColor, setPrimaryColor] = useState("#ec2626");
  const [customCriteria, setCustomCriteria] = useLocalStorage(
    CUSTOM_BOX_CRITERIA_KEY,
    DEFAULT_CUSTOM_BOX_CRITERIA,
  );

  const { profile: currentProfile } = useAuth();
  const [usersList, setUsersList] = useState<AuthProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpRole, setNewEmpRole] = useState<"employee" | "admin">("employee");
  const [newEmpCompany, setNewEmpCompany] = useState("");
  const [newEmpPassword, setNewEmpPassword] = useState("");

  const [occasionsList, setOccasionsList] = useState<any[]>([]);
  const [loadingOccasions, setLoadingOccasions] = useState(false);
  const [showAddOccasionForm, setShowAddOccasionForm] = useState(false);
  const [newOccasionLabel, setNewOccasionLabel] = useState("");
  const [newOccasionCategory, setNewOccasionCategory] = useState("gifting");
  const [newOccasionColor, setNewOccasionColor] = useState("purple");
  const [newOccasionIcon, setNewOccasionIcon] = useState("Sparkles");
  const [editingOccasionId, setEditingOccasionId] = useState<string | null>(null);
  const [newOccasionImg, setNewOccasionImg] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [newOccasionFestivalDate, setNewOccasionFestivalDate] = useState("");
  const [newOccasionBannerEnabled, setNewOccasionBannerEnabled] = useState(false);
  const [newOccasionBannerMessage, setNewOccasionBannerMessage] = useState("");
  const [newOccasionPreOrderDays, setNewOccasionPreOrderDays] = useState(7);
  const [newOccasionBannerImg, setNewOccasionBannerImg] = useState("");
  const [uploadingBannerImg, setUploadingBannerImg] = useState(false);

  useEffect(() => {
    if (activeTab === "employees") {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "occasions") {
      setLoadingOccasions(true);
      const unsub = subscribeOccasions((list) => {
        setOccasionsList(list);
        setLoadingOccasions(false);
      });
      return () => unsub();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAllUsers();
      setUsersList(data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "employee" | "client") => {
    setSavingUserId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsersList((prev) => prev.map((u) => (u.uid === userId ? { ...u, role: newRole } : u)));
      setSuccessMessage("Role updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating role:", err);
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this employee account? This action is permanent and cannot be undone."
      )
    )
      return;
    setLoadingUsers(true);
    try {
      await deleteUserProfile(userId);
      setUsersList((prev) => prev.filter((u) => u.uid !== userId));
      setSuccessMessage("Employee deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete user profile:", err);
      alert("Failed to delete employee profile. Please try again.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail || !newEmpPassword) return;
    setLoadingUsers(true);
    try {
      const newProfile = await adminCreateEmployee({
        name: newEmpName,
        email: newEmpEmail,
        company: newEmpCompany || "Consuetudo",
        role: newEmpRole,
        password: newEmpPassword,
      });
      setUsersList((prev) => [newProfile, ...prev]);
      setSuccessMessage("Employee profile created successfully!");
      setNewEmpName("");
      setNewEmpEmail("");
      setNewEmpCompany("");
      setNewEmpPassword("");
      setShowAddForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Error adding employee:", err);
      alert(
        err?.message ||
          "Failed to create employee account. Please ensure the email format is correct and the password is at least 6 characters."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddOccasion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccasionLabel.trim()) return;
    setLoadingOccasions(true);
    try {
      if (editingOccasionId) {
        await updateOccasion(editingOccasionId, {
          label: newOccasionLabel.trim(),
          category: newOccasionCategory,
          color: newOccasionColor,
          icon: newOccasionIcon,
          img: newOccasionImg || undefined,
          festivalDate: newOccasionFestivalDate || undefined,
          bannerEnabled: newOccasionBannerEnabled,
          bannerMessage: newOccasionBannerMessage || undefined,
          preOrderDays: newOccasionPreOrderDays,
          bannerImg: newOccasionBannerImg || undefined,
        });
        setSuccessMessage("Occasion updated successfully!");
        setEditingOccasionId(null);
      } else {
        await createOccasion({
          label: newOccasionLabel.trim(),
          category: newOccasionCategory,
          color: newOccasionColor,
          icon: newOccasionIcon,
          img: newOccasionImg || undefined,
          festivalDate: newOccasionFestivalDate || undefined,
          bannerEnabled: newOccasionBannerEnabled,
          bannerMessage: newOccasionBannerMessage || undefined,
          preOrderDays: newOccasionPreOrderDays,
          bannerImg: newOccasionBannerImg || undefined,
        });
        setSuccessMessage("Custom occasion created successfully!");
      }
      setNewOccasionLabel("");
      setNewOccasionImg("");
      setNewOccasionFestivalDate("");
      setNewOccasionBannerEnabled(false);
      setNewOccasionBannerMessage("");
      setNewOccasionPreOrderDays(7);
      setNewOccasionBannerImg("");
      setShowAddOccasionForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add or update occasion:", err);
    } finally {
      setLoadingOccasions(false);
    }
  };

  const handleDeleteOccasion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this occasion?")) return;
    setLoadingOccasions(true);
    try {
      await deleteOccasion(id);
      setSuccessMessage("Occasion deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete custom occasion:", err);
    } finally {
      setLoadingOccasions(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Settings</h1>
        <p className="text-sm text-nutado-gray-500 mt-0.5">Manage your account and platform preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-brand-50 text-nutado-green"
                    : "text-nutado-gray-600 hover:bg-nutado-gray-50"
                }`}
              >
                <Icon size={16} className={activeTab === id ? "text-nutado-green" : "text-nutado-gray-400"} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 bg-white rounded-xl border border-nutado-gray-200 shadow-card p-6">
          {activeTab === "profile" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-nutado-gray-900">Profile Information</h2>
              <div className="flex items-center gap-4 pb-5 border-b border-nutado-gray-100">
                <div className="w-16 h-16 rounded-full bg-nutado-green text-white flex items-center justify-center text-xl font-bold">JD</div>
                <div>
                  <p className="text-sm font-semibold text-nutado-gray-900">John Doe</p>
                  <p className="text-xs text-nutado-gray-400 mt-0.5">Administrator</p>
                  <button className="mt-2 text-xs font-semibold text-nutado-green hover:text-nutado-green-dark">Change Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">First Name</label>
                  <input type="text" defaultValue="John" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Last Name</label>
                  <input type="text" defaultValue="Doe" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Email</label>
                  <input type="email" defaultValue="john@acme.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
                </div>
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "company" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-nutado-gray-900">Company Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Company Name</label>
                  <input type="text" defaultValue="Acme Pvt. Ltd." className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">GSTIN</label>
                  <input type="text" placeholder="22AAAAA0000A1Z5" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">PAN</label>
                  <input type="text" placeholder="AAAAA0000A" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Registered Address</label>
                  <textarea rows={3} defaultValue="123 Business Park, Sector 5, Bengaluru, Karnataka 560001" className="input-field resize-none" />
                </div>
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === "criteria" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="font-display font-semibold text-nutado-gray-900 text-lg">
                  Build Your Own Criteria
                </h2>
                <p className="text-xs text-nutado-gray-500 mt-0.5">
                  These rules control when custom box slots unlock on the client-facing order flow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">
                    Products Per Unlock
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={customCriteria.requiredProductsPerUnlock}
                    onChange={(e) =>
                      setCustomCriteria((prev) => ({
                        ...prev,
                        requiredProductsPerUnlock: Math.max(
                          1,
                          Number(e.target.value) || 1,
                        ),
                      }))
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">
                    Max Unlock Slots
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={customCriteria.maxUnlockedSlots}
                    onChange={(e) =>
                      setCustomCriteria((prev) => ({
                        ...prev,
                        maxUnlockedSlots: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">
                    Min Products To Continue
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={customCriteria.customBoxMinProducts}
                    onChange={(e) =>
                      setCustomCriteria((prev) => ({
                        ...prev,
                        customBoxMinProducts: Math.max(1, Number(e.target.value) || 1),
                      }))
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-nutado-gray-200 bg-nutado-gray-50 p-3.5">
                <p className="text-xs text-nutado-gray-600 leading-relaxed">
                  Current rule: every{" "}
                  <span className="font-semibold text-nutado-green">{customCriteria.requiredProductsPerUnlock}</span>{" "}
                  selected products unlocks one slot, up to{" "}
                  <span className="font-semibold text-nutado-green">{customCriteria.maxUnlockedSlots}</span> slots.
                  Minimum products required to continue in custom mode:{" "}
                  <span className="font-semibold text-nutado-green">{customCriteria.customBoxMinProducts}</span>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccessMessage("Custom criteria parameters saved successfully!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                }}
                className="btn-primary flex items-center gap-2 text-sm mt-2"
              >
                <Save size={15} /> Save Criteria
              </button>

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fade-in mt-3">
                  <Check size={14} className="text-emerald-600" /> {successMessage}
                </div>
              )}
            </div>
          )}

          {activeTab === "employees" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-semibold text-nutado-gray-900 text-lg">
                    Employees & Platform Roles
                  </h2>
                  <p className="text-xs text-nutado-gray-500 mt-0.5">
                    View registered users, assign administrative or employee privileges, or onboard new employees.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fetchUsers}
                    className="p-2 border border-nutado-gray-200 rounded-lg hover:bg-nutado-gray-50 text-nutado-gray-600 transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw size={16} className={loadingUsers ? "animate-spin" : ""} />
                  </button>
                  {currentProfile?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                      <Plus size={15} /> Add Employee
                    </button>
                  )}
                </div>
              </div>

              {/* Toast/Notification feedback */}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
                  <Check size={14} className="text-emerald-600" /> {successMessage}
                </div>
              )}

              {/* Add employee form */}
              {showAddForm && (
                <form
                  onSubmit={handleAddEmployee}
                  className="p-4 border border-brand-100 bg-brand-50/30 rounded-xl space-y-4 animate-slide-up"
                >
                  <h3 className="text-sm font-semibold text-nutado-gray-900">Add New Employee Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        placeholder="Sarah Connor"
                        className="input-field py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-700 mb-1">Work Email</label>
                      <input
                        type="email"
                        required
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        placeholder="sarah.c@nutado.com"
                        className="input-field py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-700 mb-1">Login Password *</label>
                      <input
                        type="password"
                        required
                        value={newEmpPassword}
                        onChange={(e) => setNewEmpPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="input-field py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={newEmpCompany}
                        onChange={(e) => setNewEmpCompany(e.target.value)}
                        placeholder="Consuetudo"
                        className="input-field py-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-700 mb-1">System Role</label>
                      <select
                        value={newEmpRole}
                        onChange={(e) => setNewEmpRole(e.target.value as any)}
                        className="input-field py-2 text-xs bg-white font-semibold text-nutado-gray-800"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-2 border border-nutado-gray-200 text-nutado-gray-600 rounded-lg hover:bg-nutado-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-nutado-green hover:bg-nutado-green-dark text-white rounded-lg transition-colors"
                    >
                      Save Employee
                    </button>
                  </div>
                </form>
              )}

              {/* Search filter */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-nutado-gray-200 rounded-lg text-sm placeholder-nutado-gray-400 focus:outline-none focus:ring-1 focus:ring-nutado-green focus:border-nutado-green transition-all"
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
              </div>

              {/* Users List Table */}
              <div className="border border-nutado-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200 text-xs font-semibold text-nutado-gray-500 uppercase tracking-wider">
                        <th className="px-5 py-3">Member Details</th>
                        <th className="px-5 py-3">Workplace</th>
                        <th className="px-5 py-3">Active Role</th>
                        <th className="px-5 py-3 text-right">Assign Platform Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nutado-gray-200 text-sm">
                      {loadingUsers ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-10 text-center text-nutado-gray-400">
                            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-nutado-green" />
                            Loading workspace directory...
                          </td>
                        </tr>
                      ) : usersList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-10 text-center text-nutado-gray-400">
                            No employees or users found in the database.
                          </td>
                        </tr>
                      ) : (
                        usersList
                          .filter((user) => user.role !== "client")
                          .filter((user) => {
                            const name = user.name?.toLowerCase() || "";
                            const email = user.email?.toLowerCase() || "";
                            const role = user.role?.toLowerCase() || "";
                            const term = searchTerm.toLowerCase();
                            return name.includes(term) || email.includes(term) || role.includes(term);
                          })
                          .map((user) => (
                            <tr key={user.uid} className="hover:bg-nutado-gray-50/55 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-brand-100 text-nutado-green flex items-center justify-center font-bold text-sm select-none border border-brand-200 shrink-0">
                                    {(user.name ?? "E").slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-nutado-gray-900 truncate">
                                      {user.name || "Unnamed User"}
                                    </p>
                                    <p className="text-xs text-nutado-gray-500 truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-nutado-gray-700">
                                <p className="font-medium text-xs text-nutado-gray-800">
                                  {user.company || "Consuetudo"}
                                </p>
                                {user.createdAt && (
                                  <p className="text-[10px] text-nutado-gray-400 mt-0.5">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                  </p>
                                )}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                                      : "bg-blue-100 text-blue-800 border border-blue-200"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {savingUserId === user.uid ? (
                                    <span className="text-xs text-nutado-gray-400 font-medium">
                                      Saving...
                                    </span>
                                  ) : currentProfile?.role === "admin" ? (
                                    <>
                                      <select
                                        value={user.role}
                                        onChange={(e) =>
                                          handleRoleChange(user.uid, e.target.value as any)
                                        }
                                        className="px-2.5 py-1.5 border border-nutado-gray-200 rounded-lg text-xs font-semibold text-nutado-gray-800 focus:outline-none focus:ring-1 focus:ring-nutado-green focus:border-nutado-green bg-white shadow-sm hover:border-nutado-gray-300 transition-colors cursor-pointer"
                                      >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Administrator</option>
                                      </select>
                                      {currentProfile?.uid !== user.uid && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteUser(user.uid)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center shrink-0 border border-red-100"
                                          title="Delete Employee"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-xs text-nutado-gray-500 font-semibold uppercase tracking-wider bg-nutado-gray-50 px-2.5 py-1.5 rounded-lg border border-nutado-gray-150 select-none">
                                      {user.role}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "occasions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-semibold text-nutado-gray-900 text-lg">
                    Manage Occasions
                  </h2>
                  <p className="text-xs text-nutado-gray-500 mt-0.5">
                    Create and manage custom occasions. Added occasions instantly appear as options in the client onboarding flow.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoadingOccasions(true);
                      const unsub = subscribeOccasions((list) => {
                        setOccasionsList(list);
                        setLoadingOccasions(false);
                      });
                      setTimeout(unsub, 1000);
                    }}
                    className="p-2 border border-nutado-gray-200 rounded-lg hover:bg-nutado-gray-50 text-nutado-gray-600 transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw size={16} className={loadingOccasions ? "animate-spin" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddOccasionForm(!showAddOccasionForm)}
                    className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                  >
                    <Plus size={15} /> Add Occasion
                  </button>
                </div>
              </div>

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
                  <Check size={14} className="text-emerald-600" /> {successMessage}
                </div>
              )}

              {/* Add Custom Occasion Form */}
              {showAddOccasionForm && (
                <form
                  onSubmit={handleAddOccasion}
                  className="p-5 border border-brand-100 bg-brand-50/20 rounded-2xl space-y-4 animate-slide-up"
                >
                  <h3 className="text-sm font-semibold text-[#ec2626]">
                    {editingOccasionId ? "Edit Occasion Details" : "Add Custom Occasion"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-nutado-gray-600 mb-1.5">Occasion Name *</label>
                      <input
                        type="text"
                        required
                        value={newOccasionLabel}
                        onChange={(e) => setNewOccasionLabel(e.target.value)}
                        placeholder="e.g. Summer Festival, Foundation Day..."
                        className="input-field py-2.5 text-xs bg-white focus:ring-[#ec2626] focus:border-[#ec2626]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-nutado-gray-600 mb-1.5">Category *</label>
                      <select
                        value={newOccasionCategory}
                        onChange={(e) => setNewOccasionCategory(e.target.value)}
                        className="input-field py-2.5 text-xs bg-white text-nutado-gray-800 font-semibold cursor-pointer"
                      >
                        <option value="festivals">Traditional Festivals</option>
                        <option value="corporate">Corporate & Milestones</option>
                        <option value="gifting">Gifting & Special Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-nutado-gray-600 mb-1.5">Color Theme *</label>
                      <select
                        value={newOccasionColor}
                        onChange={(e) => setNewOccasionColor(e.target.value)}
                        className="input-field py-2.5 text-xs bg-white text-nutado-gray-800 font-semibold cursor-pointer"
                      >
                        <option value="purple">Purple Theme</option>
                        <option value="pink">Pink Theme</option>
                        <option value="blue">Blue Theme</option>
                        <option value="amber">Amber Theme</option>
                        <option value="emerald">Emerald Theme</option>
                        <option value="red">Red Theme</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-nutado-gray-600 mb-1.5">Occasion Image (Optional)</label>
                      <div className="flex items-center gap-2">
                        {newOccasionImg ? (
                          <div className="relative w-10 h-10 rounded-xl border border-nutado-gray-250 overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-inner">
                            <img src={newOccasionImg} alt="Preview" className="w-full h-full object-contain p-1" />
                            <button
                              type="button"
                              onClick={() => setNewOccasionImg("")}
                              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-650 transition-colors shadow-sm"
                              title="Remove Image"
                            >
                              <X size={8} className="stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl border-2 border-dashed border-nutado-gray-250 bg-nutado-gray-50 flex items-center justify-center text-nutado-gray-400 shrink-0">
                            <ImageOff size={14} />
                          </div>
                        )}
                        <label className="flex-1">
                          <div className="px-2.5 py-2.5 bg-white border border-nutado-gray-250 rounded-xl text-[10px] font-bold tracking-wide uppercase text-nutado-gray-700 hover:border-nutado-gray-350 transition-colors cursor-pointer text-center shadow-sm select-none">
                            {uploadingImg ? "Uploading..." : newOccasionImg ? "Change" : "Upload File"}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingImg(true);
                              try {
                                const url = await uploadImageFile(file);
                                setNewOccasionImg(url);
                              } catch (err) {
                                console.error("Occasion image upload failed:", err);
                              } finally {
                                setUploadingImg(false);
                              }
                            }}
                            className="hidden"
                            disabled={uploadingImg}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-nutado-gray-100 pt-4 mt-4 space-y-4">
                    <h4 className="text-xs font-bold text-nutado-gray-700 uppercase tracking-wider">Festival & Banner Popup Configuration (Optional)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-nutado-gray-600 mb-1">Festival Date</label>
                        <input 
                          type="date" 
                          value={newOccasionFestivalDate} 
                          onChange={(e) => setNewOccasionFestivalDate(e.target.value)} 
                          className="input-field py-2 text-xs bg-white" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-nutado-gray-600 mb-1">Pre-order Deadline (Days Buffer)</label>
                        <input 
                          type="number" 
                          value={newOccasionPreOrderDays} 
                          onChange={(e) => setNewOccasionPreOrderDays(Number(e.target.value))} 
                          className="input-field py-2 text-xs bg-white" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-nutado-gray-700 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={newOccasionBannerEnabled} 
                          onChange={(e) => setNewOccasionBannerEnabled(e.target.checked)} 
                          className="rounded border-nutado-gray-300 text-nutado-green focus:ring-nutado-green cursor-pointer" 
                        />
                        Enable Reminder Popup Banner
                      </label>
                    </div>

                    {newOccasionBannerEnabled && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-nutado-gray-600 mb-1">Banner Reminder Message</label>
                            <textarea 
                              value={newOccasionBannerMessage} 
                              onChange={(e) => setNewOccasionBannerMessage(e.target.value)} 
                              placeholder="e.g. Diwali is coming on Nov 8! Order your customized box today to receive it in time."
                              rows={2.5} 
                              className="input-field py-2 text-xs resize-none bg-white font-medium" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-nutado-gray-600 mb-1">Banner Image (Optional)</label>
                            <div className="flex items-center gap-2 mt-1">
                              {newOccasionBannerImg ? (
                                <div className="relative w-12 h-12 rounded-xl border border-nutado-gray-250 overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-inner">
                                  <img src={newOccasionBannerImg} alt="Banner Preview" className="w-full h-full object-contain p-1" />
                                  <button
                                    type="button"
                                    onClick={() => setNewOccasionBannerImg("")}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-650 transition-colors shadow-sm animate-fade-in"
                                    title="Remove Banner Image"
                                  >
                                    <X size={8} className="stroke-[3]" />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-xl border-2 border-dashed border-nutado-gray-250 bg-nutado-gray-50 flex items-center justify-center text-nutado-gray-400 shrink-0">
                                  <ImageOff size={16} />
                                </div>
                              )}
                              <label className="flex-1">
                                <div className="px-2.5 py-3.5 bg-white border border-nutado-gray-250 rounded-xl text-[10px] font-bold tracking-wide uppercase text-nutado-gray-700 hover:border-nutado-gray-350 transition-colors cursor-pointer text-center shadow-sm select-none">
                                  {uploadingBannerImg ? "Uploading..." : newOccasionBannerImg ? "Change Banner" : "Upload Banner"}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploadingBannerImg(true);
                                    try {
                                      const url = await uploadImageFile(file);
                                      setNewOccasionBannerImg(url);
                                    } catch (err) {
                                      console.error("Banner image upload failed:", err);
                                    } finally {
                                      setUploadingBannerImg(false);
                                    }
                                  }}
                                  className="hidden"
                                  disabled={uploadingBannerImg}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-nutado-gray-600 mb-2">Select Visual Icon *</label>
                    <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                      {[
                        { name: "Sparkles", Icon: Sparkles },
                        { name: "Heart", Icon: Heart },
                        { name: "ShoppingBag", Icon: ShoppingBag },
                        { name: "PartyPopper", Icon: PartyPopper },
                        { name: "Gift", Icon: Gift },
                        { name: "Star", Icon: Star },
                        { name: "Cake", Icon: Cake },
                        { name: "Flame", Icon: Flame },
                        { name: "Calendar", Icon: Calendar },
                      ].map((item) => {
                        const isChosen = newOccasionIcon === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setNewOccasionIcon(item.name)}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                              isChosen
                                ? "border-[#ec2626] bg-[#fff5f5] text-[#ec2626] shadow-sm scale-105"
                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            <item.Icon size={18} className="stroke-[2]" />
                            <span className="text-[9px] font-bold tracking-wide uppercase shrink-0">{item.name.substring(0, 7)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddOccasionForm(false);
                        setEditingOccasionId(null);
                        setNewOccasionLabel("");
                        setNewOccasionImg("");
                        setNewOccasionFestivalDate("");
                        setNewOccasionBannerEnabled(false);
                        setNewOccasionBannerMessage("");
                        setNewOccasionPreOrderDays(7);
                        setNewOccasionBannerImg("");
                      }}
                      className="px-3.5 py-2 border border-nutado-gray-200 text-nutado-gray-600 rounded-lg hover:bg-nutado-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loadingOccasions}
                      className="px-5 py-2 bg-nutado-green hover:bg-nutado-green-dark text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {loadingOccasions ? "Saving..." : editingOccasionId ? "Update Occasion" : "Save Occasion"}
                    </button>
                  </div>
                </form>
              )}

              {/* Custom Occasions Table */}
              <div className="border border-nutado-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200 text-xs font-semibold text-nutado-gray-500 uppercase tracking-wider">
                        <th className="px-5 py-3">Occasion Detail</th>
                        <th className="px-5 py-3">Onboarding Category</th>
                        <th className="px-5 py-3">Theme & Icon</th>
                        <th className="px-5 py-3">Festival & Banner Popup</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nutado-gray-200 text-sm">
                      {loadingOccasions && occasionsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-nutado-gray-400">
                            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-nutado-green" />
                            Loading occasions directory...
                          </td>
                        </tr>
                      ) : occasionsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-nutado-gray-400 text-xs">
                            No occasions found. Click &quot;Add Occasion&quot; above to create one!
                          </td>
                        </tr>
                      ) : (
                        occasionsList.map((occ) => {
                          const catLabel =
                            occ.category === "festivals"
                              ? "Traditional Festivals"
                              : occ.category === "corporate"
                              ? "Corporate & Milestones"
                              : "Gifting & Special Days";

                          return (
                            <tr key={occ.id} className="hover:bg-nutado-gray-50/50 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {occ.img ? (
                                    <div className="w-8 h-8 rounded-lg border border-nutado-gray-200 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                      <img src={occ.img} alt={occ.label} className="w-full h-full object-contain p-0.5" />
                                    </div>
                                  ) : (
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 bg-gradient-to-tr ${
                                      occ.color === "purple" ? "from-violet-500 to-purple-400" :
                                      occ.color === "pink" ? "from-pink-500 to-rose-400" :
                                      occ.color === "blue" ? "from-blue-500 to-indigo-400" :
                                      occ.color === "amber" ? "from-amber-500 to-orange-400" :
                                      occ.color === "emerald" ? "from-emerald-500 to-teal-400" :
                                      "from-red-500 to-rose-500"
                                    }`}>
                                      {(() => {
                                        const OccIcon = MINI_ICON_MAP[occ.icon] || Sparkles;
                                        return <OccIcon size={14} className="stroke-[2.5]" />;
                                      })()}
                                    </div>
                                  )}
                                  <span className="font-semibold text-nutado-gray-900 capitalize">
                                    {occ.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs font-semibold text-nutado-gray-500">
                                {catLabel}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize bg-gray-50 border border-gray-150`}>
                                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${
                                    occ.color === "purple" ? "from-violet-500 to-purple-400" :
                                    occ.color === "pink" ? "from-pink-500 to-rose-400" :
                                    occ.color === "blue" ? "from-blue-500 to-indigo-400" :
                                    occ.color === "amber" ? "from-amber-500 to-orange-400" :
                                    occ.color === "emerald" ? "from-emerald-500 to-teal-400" :
                                    "from-red-500 to-rose-500"
                                  }`} />
                                  <span className="text-[10px] uppercase font-bold text-nutado-gray-600 tracking-wider">
                                    {occ.icon} ({occ.color})
                                  </span>
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {occ.festivalDate ? (
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-1.5 font-semibold text-nutado-gray-800">
                                      <Calendar size={12} className="text-nutado-gray-400" />
                                      <span>{new Date(occ.festivalDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        occ.bannerEnabled
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                                          : "bg-gray-100 text-gray-500"
                                      }`}>
                                        {occ.bannerEnabled ? "Banner Active" : "Banner Disabled"}
                                      </span>
                                      {occ.bannerEnabled && (
                                        <span className="text-[10px] text-nutado-gray-400 font-medium">({occ.preOrderDays || 7}d buffer)</span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-nutado-gray-400 font-medium">—</span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-right space-x-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingOccasionId(occ.id);
                                    setNewOccasionLabel(occ.label);
                                    setNewOccasionCategory(occ.category);
                                    setNewOccasionColor(occ.color);
                                    setNewOccasionIcon(occ.icon);
                                    setNewOccasionImg(occ.img || "");
                                    setNewOccasionFestivalDate(occ.festivalDate || "");
                                    setNewOccasionBannerEnabled(occ.bannerEnabled || false);
                                    setNewOccasionBannerMessage(occ.bannerMessage || "");
                                    setNewOccasionPreOrderDays(occ.preOrderDays || 7);
                                    setNewOccasionBannerImg(occ.bannerImg || "");
                                    setShowAddOccasionForm(true);
                                  }}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                                  title="Edit Occasion"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOccasion(occ.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                                  title="Delete Occasion"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "branding" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-nutado-gray-900">Brand Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Brand Name</label>
                  <input type="text" defaultValue="Acme Gifting" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Tagline</label>
                  <input type="text" defaultValue="Gifts that truly delight" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 rounded-lg border border-nutado-gray-300 cursor-pointer p-1" />
                    <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field flex-1" />
                  </div>
                </div>
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Save size={15} /> Save Branding
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-nutado-gray-900">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { label: "New orders", sub: "Get notified when a new order is placed", on: true },
                  { label: "Order status updates", sub: "Alerts when order status changes", on: true },
                  { label: "Delivery confirmations", sub: "When orders are delivered successfully", on: true },
                  { label: "Low stock alerts", sub: "When product inventory is running low", on: false },
                  { label: "Weekly reports", sub: "Summary of performance every Monday", on: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-xl border border-nutado-gray-200">
                    <div>
                      <p className="text-sm font-medium text-nutado-gray-900">{notif.label}</p>
                      <p className="text-xs text-nutado-gray-400 mt-0.5">{notif.sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notif.on} className="sr-only peer" />
                      <div className="w-10 h-5 bg-nutado-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-nutado-green" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-nutado-gray-900">Appearance</h2>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-nutado-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-nutado-gray-900">Theme</p>
                    <p className="text-xs text-nutado-gray-500 mt-0.5">Choose between light, dark, or system theme</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <h2 className="font-display font-semibold text-nutado-gray-900">Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Save size={15} /> Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
