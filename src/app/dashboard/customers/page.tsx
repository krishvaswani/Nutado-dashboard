"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Mail, Phone, UserPlus, Loader2 } from "lucide-react";
import { MOCK_CUSTOMERS } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import AddCustomerModal from "@/components/dashboard/AddCustomerModal";
import { getAllUsers, subscribeOrders } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/Toast";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    let unsubOrders = () => {};
    
    async function loadData() {
      try {
        const users = await getAllUsers();
        const clients = users.filter((u) => u.role === "client");
        
        const realCustomersMapped = clients.map((u) => {
          const names = u.name.split(" ");
          const avatar = names.map(n => n[0]).join("").substring(0, 2).toUpperCase() || "C";
          
          return {
            id: u.uid,
            name: u.name,
            email: u.email,
            company: u.company || "Individual",
            phone: u.phone || "Not provided",
            avatar: avatar,
            status: (u as any).status || "active",
            totalOrders: 0,
            totalSpend: 0,
            lastOrder: u.createdAt || new Date().toISOString(),
            isReal: true,
          };
        });

        unsubOrders = subscribeOrders((orders) => {
          const updated = realCustomersMapped.map((c) => {
            const clientOrders = orders.filter(
              (o) => o.customerId === c.id || o.createdByUid === c.id
            );
            
            const totalOrders = clientOrders.length;
            const totalSpend = clientOrders
              .filter((o) => o.status !== "cancelled")
              .reduce((sum, o) => sum + (o.total || 0), 0);
            
            const lastOrderDate = clientOrders.length > 0 
              ? clientOrders[0].createdAt 
              : c.lastOrder;

            return {
              ...c,
              totalOrders,
              totalSpend,
              lastOrder: lastOrderDate,
            };
          });

          setCustomers(updated);
          setLoading(false);
        });
      } catch (err) {
        console.error("Failed to load real customer profiles:", err);
        setCustomers([]);
        setLoading(false);
      }
    }

    loadData();
    
    return () => {
      unsubOrders();
    };
  }, []);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="animate-spin text-nutado-green" size={32} />
        <p className="text-sm text-nutado-gray-500">Loading customers database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Customers</h1>
          <p className="text-sm text-nutado-gray-500 mt-0.5">{customers.length} total customers</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <UserPlus size={15} /> Add Customer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length.toString(), color: "text-nutado-gray-900" },
          { label: "Active", value: customers.filter((c) => c.status === "active").length.toString(), color: "text-green-600" },
          { label: "Inactive", value: customers.filter((c) => c.status === "inactive").length.toString(), color: "text-red-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 text-center">
            <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-nutado-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filter === f ? "bg-nutado-green text-white" : "bg-nutado-gray-100 text-nutado-gray-600 hover:bg-nutado-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Customer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-nutado-green text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {customer.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-nutado-gray-900">{customer.name}</p>
                  <p className="text-xs text-nutado-gray-400">{customer.company}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                customer.status === "active" ? "bg-green-50 text-green-700" : "bg-nutado-gray-100 text-nutado-gray-500"
              }`}>
                {customer.status}
              </span>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-nutado-gray-500">
                <Mail size={12} className="flex-shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-nutado-gray-500">
                <Phone size={12} className="flex-shrink-0" />
                <span>{customer.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-nutado-gray-100">
              <div className="text-center">
                <p className="text-sm font-bold text-nutado-gray-900">{customer.totalOrders}</p>
                <p className="text-[10px] text-nutado-gray-400">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-nutado-green">{formatCurrency(customer.totalSpend)}</p>
                <p className="text-[10px] text-nutado-gray-400">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-nutado-gray-900">{formatDate(customer.lastOrder)}</p>
                <p className="text-[10px] text-nutado-gray-400">Last Order</p>
              </div>
            </div>
            <Link
              href={`/dashboard/customers/${customer.id}`}
              className="mt-3 w-full flex items-center justify-center py-2 rounded-lg border border-nutado-gray-200 text-xs font-semibold text-nutado-gray-600 hover:bg-nutado-gray-50 hover:text-nutado-green hover:border-nutado-green transition-all"
            >
              View Profile →
            </Link>
          </div>
        ))}
      </div>

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newCust) => setCustomers((prev) => [newCust, ...prev])}
        addToast={addToast}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
