"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronLeft, Mail, Phone, MapPin, Building,
  ShoppingBag, TrendingUp, Calendar, Package, Loader2, Trash2
} from "lucide-react";
import { MOCK_CUSTOMERS, MOCK_ORDERS } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import { getUserProfile, subscribeOrders, deleteUserProfile, upsertUserProfile } from "@/lib/firebase/firestore";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("password123");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      `Are you absolutely sure you want to delete the profile of ${customer.name}? This action is permanent and cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteUserProfile(id);
      alert("Customer profile deleted successfully.");
      router.push("/dashboard/customers");
    } catch (err) {
      console.error("Failed to delete customer profile:", err);
      alert("An error occurred while deleting this customer profile.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSavePassword = async () => {
    setUpdatingPassword(true);
    try {
      const profile = await getUserProfile(id);
      if (profile) {
        await upsertUserProfile({
          ...profile,
          password: password.trim(),
        });
        alert("Password updated successfully.");
      } else {
        alert("Customer profile not found in database.");
      }
    } catch (err) {
      console.error("Failed to update password:", err);
      alert("An error occurred while saving the password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  useEffect(() => {
    let unsubOrders = () => {};

    async function loadCustomer() {
      // 1. Check if mock customer first
      const mock = MOCK_CUSTOMERS.find((c) => c.id === id);
      if (mock) {
        setCustomer(mock);
        setCustomerOrders(MOCK_ORDERS.slice(0, mock.totalOrders));
        setLoading(false);
        return;
      }

      // 2. Fetch real customer from Firestore
      try {
        const profile = await getUserProfile(id);
        if (profile) {
          setPassword((profile as any).password || "password123");
          const names = profile.name.split(" ");
          const avatar = names.map(n => n[0]).join("").substring(0, 2).toUpperCase() || "C";

          const baseCustomer = {
            id: profile.uid,
            name: profile.name,
            email: profile.email,
            company: profile.company || "Individual",
            phone: profile.phone || "Not provided",
            avatar,
            status: (profile as any).status || "active",
            totalOrders: 0,
            totalSpend: 0,
            lastOrder: profile.createdAt || new Date().toISOString(),
          };

          unsubOrders = subscribeOrders((orders) => {
            const clientOrders = orders.filter(
              (o) => o.customerId === id || o.createdByUid === id
            );

            const totalOrders = clientOrders.length;
            const totalSpend = clientOrders
              .filter((o) => o.status !== "cancelled")
              .reduce((sum, o) => sum + (o.total || 0), 0);

            const lastOrderDate = clientOrders.length > 0 
              ? clientOrders[0].createdAt 
              : baseCustomer.lastOrder;

            setCustomer({
              ...baseCustomer,
              totalOrders,
              totalSpend,
              lastOrder: lastOrderDate,
            });
            setCustomerOrders(clientOrders);
            setLoading(false);
          });
        } else {
          setCustomer(MOCK_CUSTOMERS[0]);
          setCustomerOrders(MOCK_ORDERS.slice(0, MOCK_CUSTOMERS[0].totalOrders));
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load real customer:", err);
        setCustomer(MOCK_CUSTOMERS[0]);
        setCustomerOrders(MOCK_ORDERS.slice(0, MOCK_CUSTOMERS[0].totalOrders));
        setLoading(false);
      }
    }

    loadCustomer();

    return () => {
      unsubOrders();
    };
  }, [id]);

  if (loading || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="animate-spin text-nutado-green" size={32} />
        <p className="text-sm text-nutado-gray-500">Loading customer profile...</p>
      </div>
    );
  }

  const avgOrder = customer.totalOrders
    ? Math.round(customer.totalSpend / customer.totalOrders)
    : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-1.5 text-sm text-nutado-gray-500 hover:text-nutado-green transition-colors mb-2"
        >
          <ChevronLeft size={15} /> Back to Customers
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-nutado-green text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {customer.avatar}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
                {customer.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-nutado-gray-500">{customer.company}</span>
                <Badge variant={customer.status === "active" ? "green" : "gray"} dot>
                  {customer.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`mailto:${customer.email}`}
              className="btn-secondary flex items-center gap-2 text-sm py-2"
            >
              <Mail size={14} /> Email
            </Link>
            <Link 
              href={`/onboarding/step1?customerId=${id}`}
              className="btn-primary flex items-center gap-2 text-sm py-2"
            >
              <Package size={14} /> New Order
            </Link>
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="flex items-center gap-2 text-sm py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: info + contact */}
        <div className="space-y-4">
          {/* Contact info */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">
              Contact Details
            </h2>
            <div className="space-y-3">
              {[
                { icon: Mail,     label: "Email",   value: customer.email },
                { icon: Phone,    label: "Phone",   value: customer.phone },
                { icon: Building, label: "Company", value: customer.company },
                { icon: MapPin,   label: "City",    value: "Mumbai, Maharashtra" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-nutado-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-nutado-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-nutado-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-nutado-gray-900 truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Security (Admin/Staff only) */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5 animate-fade-in">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">
              Account Security
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-nutado-gray-400 uppercase tracking-wide mb-1.5">
                  Client Password
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ec2626] focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleSavePassword}
                    disabled={updatingPassword}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#ec2626] hover:bg-[#7c0404] rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {updatingPassword ? "Saving..." : "Save"}
                  </button>
                </div>
                <p className="text-[11px] text-nutado-gray-400 mt-2">
                  Clients created via draft orders use this password to sign in.
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">
              Overview
            </h2>
            <div className="space-y-3">
              {[
                { icon: ShoppingBag,  label: "Total Orders",   value: String(customer.totalOrders), color: "bg-blue-50 text-blue-600" },
                { icon: TrendingUp,   label: "Lifetime Spend", value: formatCurrency(customer.totalSpend), color: "bg-green-50 text-green-600" },
                { icon: TrendingUp,   label: "Avg Order Value",value: formatCurrency(avgOrder), color: "bg-purple-50 text-purple-600" },
                { icon: Calendar,     label: "Last Order",     value: formatDate(customer.lastOrder), color: "bg-amber-50 text-amber-600" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-sm text-nutado-gray-500">{label}</span>
                    <span className="text-sm font-bold text-nutado-gray-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {["Corporate", "Diwali", "High Value", "Recurring"].map((tag) => (
                <Badge key={tag} variant="gray">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right: orders history */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order history */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-nutado-gray-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-nutado-gray-900">Order History</h2>
              <span className="text-xs text-nutado-gray-400">{customer.totalOrders} orders</span>
            </div>
            <div className="divide-y divide-nutado-gray-100">
              {customerOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-nutado-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-nutado-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-sm font-semibold text-nutado-green hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-nutado-gray-400 mt-0.5">
                      {order.quantity} boxes · {order.occasion} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-nutado-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-nutado-gray-400 mt-0.5">
                      Due {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {customer.totalOrders > customerOrders.length && (
              <div className="px-5 py-3 border-t border-nutado-gray-100 text-center">
                <button className="text-xs font-semibold text-nutado-green hover:text-nutado-green-dark">
                  Load more orders
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">
              Internal Notes
            </h2>
            <textarea
              rows={3}
              placeholder="Add a note about this customer..."
              className="input-field resize-none text-sm"
              defaultValue="VIP client — always orders before Diwali. Prefers premium packaging. Contact via email only."
            />
            <button className="mt-3 btn-primary text-sm py-2">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
