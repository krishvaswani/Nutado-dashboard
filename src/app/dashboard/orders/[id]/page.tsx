"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Download, Mail, MapPin, Phone, Check, Save, AlertCircle, XCircle, Calendar, MessageSquare, Plus, Clock, Trash2, Tag } from "lucide-react";
import { useOrder } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { updateOrderStatus, updateOrderPricing, updateOrderFollowUps } from "@/lib/firebase/firestore";
import type { OrderProduct, OrderStatus } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { order, loading } = useOrder(id);
  const { profile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [editedProducts, setEditedProducts] = useState<OrderProduct[]>([]);
  const [editedTotal, setEditedTotal] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);

  // Follow-up state variables
  const [followUpDate, setFollowUpDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [followUpRemarks, setFollowUpRemarks] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  useEffect(() => {
    if (order && !initialized) {
      const normalizedProducts = (order.products || []).map((p) => {
        // If price is 0, undefined, or missing, default to the catalog price from MOCK_PRODUCTS
        if (!p.price || p.price === 0) {
          const catalogProd = MOCK_PRODUCTS.find(
            (cp) => cp.id === p.id || cp.name.toLowerCase() === p.name.toLowerCase()
          );
          if (catalogProd) {
            return { ...p, price: catalogProd.price };
          }
        }
        return p;
      });

      setEditedProducts(normalizedProducts);

      // Automatically recalculate total based on quantity and default catalog prices (inclusive of 18% GST)
      let initialTotal = order.total || 0;
      if (initialTotal === 0 || initialTotal === 1500) {
        const productSum = normalizedProducts.reduce(
          (sum, p) => sum + (p.price ?? 0) * (p.quantity || 1),
          0
        );
        if (productSum > 0) {
          initialTotal = Math.round((productSum * (order.quantity || 1) + 1500) * 1.18);
        }
      }
      setEditedTotal(initialTotal);
      setInitialized(true);
    }
  }, [order, initialized]);

  function handlePriceChange(productId: number, newPrice: number) {
    const updated = editedProducts.map((p) =>
      p.id === productId ? { ...p, price: newPrice } : p
    );
    setEditedProducts(updated);

    // Recalculate total value automatically (inclusive of 18% GST) if there are product prices
    const productSum = updated.reduce(
      (sum, p) => sum + (p.price ?? 0) * (p.quantity || 1),
      0
    );
    if (productSum > 0) {
      setEditedTotal(Math.round((productSum * (order?.quantity || 1) + 1500) * 1.18));
    }
  }

  function handleTotalOverride(newTotal: number) {
    setEditedTotal(newTotal);
  }

  async function handleSavePricing() {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderPricing(order.id, editedProducts, editedTotal);
      setSuccessMessage("Enquiry pricing updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update pricing:", err);
      alert("Failed to update pricing.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleApproveOrder() {
    if (!order) return;
    setUpdating(true);
    try {
      // First save pricing
      await updateOrderPricing(order.id, editedProducts, editedTotal);
      // Then mark status as processing to move it to the Orders tab
      await updateOrderStatus(order.id, "processing");
      setSuccessMessage("Enquiry approved successfully and moved to Active Orders!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to approve order:", err);
      alert("Failed to approve order.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleCancelOrder() {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, "cancelled");
      setSuccessMessage("Lead enquiry cancelled successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to cancel enquiry:", err);
      alert("Failed to cancel enquiry.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleMarkPending() {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, "pending");
      setSuccessMessage("Status updated back to Pending Lead.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to mark pending:", err);
      alert("Failed to mark pending.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setSuccessMessage(`Order status updated to ${newStatus} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleAddFollowUp(e: React.FormEvent) {
    e.preventDefault();
    if (!order || !followUpRemarks.trim()) return;
    setSavingFollowUp(true);
    try {
      const newEntry = {
        date: followUpDate,
        remarks: followUpRemarks.trim(),
        callerName: profile?.name || profile?.email || "Tele-caller",
        createdAt: new Date().toISOString()
      };
      const currentFollowUps = order.followUps || [];
      const updated = [newEntry, ...currentFollowUps]; // Newest first
      await updateOrderFollowUps(order.id, updated);
      setFollowUpRemarks("");
      setSuccessMessage("Follow-up remark added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add follow-up:", err);
      alert("Failed to add follow-up entry.");
    } finally {
      setSavingFollowUp(false);
    }
  }

  async function handleDeleteFollowUp(indexToDelete: number) {
    if (!order || !confirm("Are you sure you want to delete this follow-up entry?")) return;
    setSavingFollowUp(true);
    try {
      const currentFollowUps = order.followUps || [];
      const updated = currentFollowUps.filter((_, idx) => idx !== indexToDelete);
      await updateOrderFollowUps(order.id, updated);
      setSuccessMessage("Follow-up entry deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete follow-up:", err);
      alert("Failed to delete follow-up entry.");
    } finally {
      setSavingFollowUp(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-nutado-gray-400 p-6 font-medium animate-pulse">Loading lead details...</div>;
  }

  if (!order) {
    return <div className="text-sm text-red-600 p-6 font-semibold">Order or enquiry not found.</div>;
  }

  const quantity = order?.quantity || 1;
  const perBoxPrice = editedProducts.reduce((sum, p) => sum + (p.price ?? 0) * (p.quantity || 1), 0);
  
  let totalProductsValue = 0;
  let brandingPackaging = 1500;
  let gstValue = 0;
  let subtotalBeforeGst = 0;

  const autoProductSum = perBoxPrice * quantity;
  const autoGrandTotal = Math.round((autoProductSum + 1500) * 1.18);

  if (editedTotal === autoGrandTotal || editedTotal === 0) {
    // Forward calculation (Standard dynamic pricing)
    totalProductsValue = autoProductSum;
    subtotalBeforeGst = totalProductsValue + brandingPackaging;
    gstValue = Math.round(subtotalBeforeGst * 0.18);
  } else {
    // Reverse calculation (Manual Grand Total Override)
    subtotalBeforeGst = Math.round(editedTotal / 1.18);
    gstValue = editedTotal - subtotalBeforeGst;
    totalProductsValue = Math.max(0, subtotalBeforeGst - brandingPackaging);
  }

  // Catalog original pricing calculation (before overwrite/discount)
  let catalogPerBoxPrice = 0;
  if (editedProducts.length === 0) {
    catalogPerBoxPrice = order.boxType === "signature" ? 699 : 449;
  } else {
    catalogPerBoxPrice = editedProducts.reduce((sum, p) => {
      const catalogProd = MOCK_PRODUCTS.find(
        (cp) => cp.id === p.id || cp.name.toLowerCase() === p.name.toLowerCase()
      );
      const origPrice = catalogProd ? catalogProd.price : (p.price || 0);
      return sum + origPrice * (p.quantity || 1);
    }, 0);
  }

  const catalogProductSum = catalogPerBoxPrice * quantity;
  const catalogGrandTotal = Math.round((catalogProductSum + 1500) * 1.18);
  const totalPricingDiscount = catalogGrandTotal > editedTotal ? catalogGrandTotal - editedTotal : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link
            href={order.status === "pending" ? "/dashboard/enquiries" : "/dashboard/orders"}
            className="flex items-center gap-1.5 text-sm text-nutado-gray-500 hover:text-nutado-green transition-colors mb-2 font-medium"
          >
            <ChevronLeft size={15} /> Back to {order.status === "pending" ? "Enquiries" : "Orders"}
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
              {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-nutado-gray-500 mt-0.5 font-medium">
            Lead on {formatDate(order.createdAt)} · {order.quantity} boxes · {order.occasion}
          </p>
        </div>

        {/* Lead/Order Action Panel */}
        <div className="flex items-center gap-2 flex-wrap">
          {order.status === "pending" ? (
            <>
              <button
                onClick={handleSavePricing}
                disabled={updating}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-3 hover:bg-nutado-gray-50 border border-nutado-gray-200 text-nutado-gray-700 rounded-lg transition-all font-semibold"
              >
                <Save size={14} />
                Save Changes
              </button>
              <button
                onClick={handleApproveOrder}
                disabled={updating}
                className="btn-primary flex items-center gap-2 text-sm py-2 bg-nutado-green hover:bg-nutado-green-dark text-white font-semibold transition-all px-4 rounded-lg disabled:opacity-70 shadow-sm"
              >
                <Check size={14} />
                Approve & Convert
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={updating}
                className="flex items-center gap-2 text-sm py-2 px-3 text-red-600 hover:bg-red-50 border border-red-200 bg-white rounded-lg transition-all font-semibold"
              >
                <XCircle size={14} />
                Cancel Lead
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 bg-white p-2 border border-nutado-gray-200 rounded-lg shadow-sm">
              <span className="text-xs font-semibold text-nutado-gray-500">Update Status:</span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                disabled={updating}
                className="px-2.5 py-1.5 border border-nutado-gray-200 rounded-lg text-xs font-semibold text-nutado-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-nutado-green hover:border-nutado-gray-300 transition-colors cursor-pointer"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Move to Enquiries (Pending)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <Check size={14} className="text-emerald-600 animate-bounce" /> {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-nutado-gray-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-nutado-gray-900">
                {order.status === "pending" ? "Lead Items & Price Configuration" : "Order Items"}
              </h2>
              {order.status === "pending" && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-wide">
                  Enquiry pricing mode
                </span>
              )}
            </div>

            <div className="divide-y divide-nutado-gray-100">
              {editedProducts.length === 0 ? (
                <div className="px-5 py-4 text-sm text-nutado-gray-500">
                  Signature box order. Products will be curated by the Nutado team.
                </div>
              ) : (
                editedProducts.map((item) => {
                  const catalogProduct = MOCK_PRODUCTS.find(
                    (cp) => cp.id === item.id || cp.name.toLowerCase() === item.name.toLowerCase()
                  );
                  const defaultCatalogPrice = catalogProduct ? catalogProduct.price : undefined;
                  const hasDiscount = defaultCatalogPrice !== undefined && item.price !== undefined && item.price < defaultCatalogPrice;

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-nutado-gray-900">{item.name}</p>
                        <p className="text-xs text-nutado-gray-400 mt-0.5">{item.brand || "Nutado catalog"}</p>
                      </div>

                      {order.status === "pending" ? (
                        <div className="flex items-center gap-3.5 flex-wrap">
                          {hasDiscount && (
                            <div className="text-right">
                              <p className="text-xs text-nutado-gray-400 line-through font-medium">
                                {formatCurrency(defaultCatalogPrice)}
                              </p>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                -{Math.round(((defaultCatalogPrice - (item.price || 0)) / defaultCatalogPrice) * 100)}% off
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-nutado-gray-500 font-semibold">Price: ₹</span>
                            <input
                              type="number"
                              min={0}
                              value={item.price !== undefined ? item.price : 0}
                              onChange={(e) => handlePriceChange(item.id, Number(e.target.value) || 0)}
                              className="w-24 px-2.5 py-1 border border-nutado-gray-200 rounded-lg text-sm font-medium text-nutado-gray-800 focus:outline-none focus:ring-1 focus:ring-nutado-green bg-nutado-gray-50/50 hover:border-nutado-gray-300 transition-colors"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            {hasDiscount && (
                              <span className="text-xs text-nutado-gray-400 line-through font-medium">
                                {formatCurrency(defaultCatalogPrice)}
                              </span>
                            )}
                            <span className="text-sm font-semibold text-nutado-gray-700">
                              {item.price !== undefined ? formatCurrency(item.price) : "Included"}
                            </span>
                          </div>
                          {hasDiscount && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-0.5 inline-block">
                              Saved {formatCurrency(defaultCatalogPrice - (item.price || 0))} ({Math.round(((defaultCatalogPrice - (item.price || 0)) / defaultCatalogPrice) * 100)}% off)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Financial Calculations Card */}
            <div className="px-5 py-4 bg-nutado-gray-50 border-t border-nutado-gray-100 space-y-3">
              {order.status === "pending" && (
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-nutado-gray-200/60">
                  <span className="text-xs font-semibold text-nutado-gray-600 flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-amber-500 animate-pulse" /> Override Total Price:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-nutado-gray-400">Total ₹</span>
                    <input
                      type="number"
                      min={0}
                      value={editedTotal}
                      onChange={(e) => handleTotalOverride(Number(e.target.value) || 0)}
                      className="w-28 px-2.5 py-1 border border-amber-200 rounded-lg text-sm font-bold text-nutado-green focus:outline-none focus:ring-1 focus:ring-nutado-green bg-white shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-nutado-gray-500">Per Box Price (Items sum)</span>
                <span className="font-semibold text-nutado-gray-900">{formatCurrency(perBoxPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nutado-gray-500">Total Product Price ({quantity} boxes)</span>
                <span className="font-medium text-nutado-gray-900">{formatCurrency(totalProductsValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nutado-gray-500">Branding & Packaging Fixed</span>
                <span className="font-medium text-nutado-gray-900">{formatCurrency(brandingPackaging)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1.5 border-t border-dashed border-nutado-gray-200">
                <span className="text-nutado-gray-500 font-semibold">Subtotal (Excl. GST)</span>
                <span className="font-semibold text-nutado-gray-900">{formatCurrency(subtotalBeforeGst)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nutado-gray-500">GST (18%)</span>
                <span className="font-medium text-nutado-gray-900">{formatCurrency(gstValue)}</span>
              </div>

              {totalPricingDiscount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 transition-all duration-300">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} className="text-emerald-500" /> Custom discount applied
                  </span>
                  <span className="font-bold">-{formatCurrency(totalPricingDiscount)} ({Math.round((totalPricingDiscount / catalogGrandTotal) * 100)}% off)</span>
                </div>
              )}

              <div className="border-t border-nutado-gray-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-nutado-gray-900">Total Estimated Price</span>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    {totalPricingDiscount > 0 && (
                      <span className="text-sm text-nutado-gray-400 line-through font-medium">
                        {formatCurrency(catalogGrandTotal)}
                      </span>
                    )}
                    <span className="font-bold text-nutado-green text-lg">{formatCurrency(editedTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Customer Lead</h2>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-nutado-gray-900">{order.customer}</p>
              <p className="text-xs text-nutado-gray-400">{order.company}</p>
              <div className="flex items-center gap-2 text-xs text-nutado-gray-500">
                <Mail size={13} className="flex-shrink-0" />
                <span>{order.customerId || "Linked in Firebase"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-nutado-gray-500">
                <Phone size={13} className="flex-shrink-0" />
                <span>Shared through client dashboard</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-nutado-gray-500">
                <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                <span>{order.address || "No address shared"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Order Metadata</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">Created by</span>
                <span className="font-medium text-nutado-gray-900 capitalize">{order.createdByRole || "client"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">Box type</span>
                <span className="font-medium text-nutado-gray-900 capitalize">{order.boxType || "signature"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">Message template</span>
                <span className="font-medium text-nutado-gray-900">{order.messageTemplate || "—"}</span>
              </div>
            </div>
          </div>

          {/* Follow-up & Remarks Timeline Card */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5 space-y-4">
            <h2 className="font-display font-semibold text-nutado-gray-900 flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" /> Follow-up / Remarks
            </h2>
            <p className="text-xs text-nutado-gray-400 -mt-2 leading-relaxed">
              Record date-wise tele-caller activities and notes for this specific lead.
            </p>

            <form onSubmit={handleAddFollowUp} className="space-y-3 pt-2 border-t border-nutado-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-nutado-gray-500 uppercase mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    required
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-nutado-gray-200 rounded-lg text-nutado-gray-700 focus:outline-none focus:ring-1 focus:ring-nutado-green bg-nutado-gray-50/50 font-medium"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={savingFollowUp || !followUpRemarks.trim()}
                    className="w-full btn-primary flex items-center justify-center gap-1.5 text-xs py-1.5 bg-nutado-green hover:bg-nutado-green-dark text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Plus size={13} /> Add Remarks
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-nutado-gray-500 uppercase mb-1">Remarks / Note</label>
                <textarea
                  placeholder="e.g. Discussed custom packaging. Customer is checking budget."
                  required
                  rows={2}
                  value={followUpRemarks}
                  onChange={(e) => setFollowUpRemarks(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-nutado-gray-200 rounded-lg text-nutado-gray-700 focus:outline-none focus:ring-1 focus:ring-nutado-green bg-nutado-gray-50/50 placeholder-nutado-gray-300 font-medium"
                />
              </div>
            </form>

            <div className="pt-2 border-t border-nutado-gray-100 max-h-[300px] overflow-y-auto pr-1">
              <h3 className="text-xs font-bold text-nutado-gray-500 uppercase mb-3 flex items-center gap-1.5">
                <Clock size={12} /> Timeline ({(order.followUps || []).length})
              </h3>
              
              {(order.followUps || []).length === 0 ? (
                <div className="text-center py-6 border border-dashed border-nutado-gray-100 rounded-lg bg-nutado-gray-50/30">
                  <MessageSquare size={20} className="mx-auto text-nutado-gray-300 mb-1.5" />
                  <p className="text-[11px] text-nutado-gray-400">No follow-ups recorded yet.</p>
                </div>
              ) : (
                <div className="relative pl-3 border-l-2 border-amber-100 space-y-4 ml-1.5 py-1">
                  {(order.followUps || []).map((item, index) => (
                    <div key={item.createdAt || index} className="relative text-xs">
                      {/* Timeline indicator circle */}
                      <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-amber-500 shadow-sm animate-pulse" />
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 text-[10px]">
                          {formatDate(item.date)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-nutado-gray-400 font-bold capitalize">
                            By {item.callerName}
                          </span>
                          <button
                            onClick={() => handleDeleteFollowUp(index)}
                            disabled={savingFollowUp}
                            className="text-nutado-gray-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="text-nutado-gray-700 mt-1 font-semibold bg-nutado-gray-50/50 p-2 rounded-lg border border-nutado-gray-100 break-words leading-relaxed">
                        {item.remarks}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
