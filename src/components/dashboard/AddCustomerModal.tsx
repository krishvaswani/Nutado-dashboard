"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { adminCreateClient } from "@/lib/firebase/firestore";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (customer: Record<string, unknown>) => void;
  addToast?: (message: string, type?: "success" | "error" | "info" | "warning") => void;
}

export default function AddCustomerModal({ isOpen, onClose, onAdd, addToast }: AddCustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.company.trim()) e.company = "Company is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
                              e.email   = "Valid email required";
    if (!form.password.trim() || form.password.length < 6)
                              e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      const profile = await adminCreateClient({
        name: form.name,
        company: form.company,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      onAdd?.({
        id: profile.uid,
        name: profile.name,
        company: profile.company,
        email: profile.email,
        phone: profile.phone,
        totalOrders: 0,
        totalSpend: 0,
        lastOrder: new Date().toISOString(),
        status: "active",
        avatar: profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      });

      addToast?.("Customer registered successfully!", "success");
      setForm({ name: "", company: "", email: "", phone: "", password: "" });
      onClose();
    } catch (err: any) {
      console.error("Failed to register customer:", err);
      if (addToast) {
        addToast(err.message || "Failed to register customer.", "error");
      } else {
        alert(err.message || "Failed to register customer in Firebase.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Full Name *</label>
          <input className={`input-field ${errors.name ? "border-red-400" : ""}`} placeholder="e.g. Priya Sharma"
            value={form.name} onChange={(e) => set("name", e.target.value)} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Company *</label>
          <input className={`input-field ${errors.company ? "border-red-400" : ""}`} placeholder="e.g. Infosys Ltd."
            value={form.company} onChange={(e) => set("company", e.target.value)} />
          {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Email *</label>
          <input type="email" className={`input-field ${errors.email ? "border-red-400" : ""}`}
            placeholder="priya@infosys.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Phone</label>
          <input type="tel" className="input-field" placeholder="+91 98765 43210"
            value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Password *</label>
          <input type="text" className={`input-field ${errors.password ? "border-red-400" : ""}`}
            placeholder="Min 6 characters (e.g. Consuetudo123)" value={form.password} onChange={(e) => set("password", e.target.value)} />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} loading={loading}>Add Customer</Button>
        </div>
      </div>
    </Modal>
  );
}
