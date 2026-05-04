"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (customer: Record<string, unknown>) => void;
}

export default function AddCustomerModal({ isOpen, onClose, onAdd }: AddCustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
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
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setTimeout(() => {
      onAdd?.({
        ...form,
        id: `c${Date.now()}`,
        totalOrders: 0,
        totalSpend: 0,
        lastOrder: new Date().toISOString().split("T")[0],
        status: "active",
        avatar: form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      });
      setLoading(false);
      onClose();
      setForm({ name: "", company: "", email: "", phone: "" });
    }, 700);
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
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} loading={loading}>Add Customer</Button>
        </div>
      </div>
    </Modal>
  );
}
