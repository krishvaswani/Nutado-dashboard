"use client";

import { useState } from "react";
import { Save, Bell, Palette, User, Shield, Building, Monitor } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const TABS = [
  { id: "profile",      label: "Profile",      icon: User     },
  { id: "company",      label: "Company",      icon: Building },
  { id: "branding",     label: "Branding",     icon: Palette  },
  { id: "appearance",   label: "Appearance",   icon: Monitor  },
  { id: "notifications",label: "Notifications",icon: Bell     },
  { id: "security",     label: "Security",     icon: Shield   },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [primaryColor, setPrimaryColor] = useState("#0a6e3a");

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

                <div className="p-4 rounded-xl border border-nutado-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-nutado-gray-900">Compact Mode</p>
                    <p className="text-xs text-nutado-gray-500 mt-0.5">Reduce spacing for a denser layout</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-nutado-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-nutado-green" />
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-nutado-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-nutado-gray-900">Sidebar Collapsed by Default</p>
                    <p className="text-xs text-nutado-gray-500 mt-0.5">Start with the sidebar minimised</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-nutado-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-nutado-green" />
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-nutado-gray-200">
                  <p className="text-sm font-semibold text-nutado-gray-900 mb-3">Language & Region</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-600 mb-1.5">Language</label>
                      <select className="input-field text-sm py-2">
                        <option>English (US)</option>
                        <option>English (IN)</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-nutado-gray-600 mb-1.5">Currency</label>
                      <select className="input-field text-sm py-2">
                        <option>₹ INR</option>
                        <option>$ USD</option>
                        <option>€ EUR</option>
                      </select>
                    </div>
                  </div>
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
