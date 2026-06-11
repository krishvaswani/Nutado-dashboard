"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, UserPlus, ArrowRight, X, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { getAllUsers } from "@/lib/firebase/firestore";

interface SelectCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelectCustomerModal({ isOpen, onClose }: SelectCustomerModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadClients() {
      setLoading(true);
      try {
        const allUsers = await getAllUsers();
        const clientUsers = allUsers.filter((u) => u.role === "client");
        setClients(clientUsers);
      } catch (err) {
        console.error("Failed to load clients list in SelectCustomerModal:", err);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, [isOpen]);

  const filtered = clients.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.company || "").toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  });

  const handleSelectClient = (clientId: string) => {
    onClose();
    router.push(`/onboarding/step1?customerId=${clientId}`);
  };

  const handleStartFresh = () => {
    onClose();
    router.push("/onboarding/step1");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Order for Client"
      description="Choose a client to pre-fill their company and contact details, or start with a new lead."
      size="md"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-field pl-10 py-3 text-sm focus:ring-[#ec2626] focus:border-[#ec2626]"
          />
        </div>

        {/* Option to start fresh */}
        <button
          onClick={handleStartFresh}
          className="w-full flex items-center justify-between p-4 bg-brand-50/20 hover:bg-brand-50/40 rounded-xl border border-dashed border-[#ec2626]/30 transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ec2626]/10 text-[#ec2626] flex items-center justify-center shrink-0">
              <UserPlus size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-nutado-gray-900 group-hover:text-[#ec2626] transition-colors">
                Place Order for a New Lead / Fresh Customer
              </p>
              <p className="text-xs text-nutado-gray-500 mt-0.5">
                Start onboarding flow from scratch with standard details
              </p>
            </div>
          </div>
          <ArrowRight size={16} className="text-nutado-gray-400 group-hover:text-[#ec2626] transition-colors group-hover:translate-x-1 duration-200" />
        </button>

        {/* Customer List */}
        <div className="max-h-[320px] overflow-y-auto pr-1 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="animate-spin text-[#ec2626]" size={24} />
              <span className="text-xs text-nutado-gray-400 font-medium">Loading client accounts...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 border border-nutado-gray-100 rounded-xl text-nutado-gray-400 text-xs">
              {search ? "No clients match your search query." : "No client accounts registered yet."}
            </div>
          ) : (
            filtered.map((client) => {
              const names = client.name.split(" ");
              const initials = names.map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "C";
              return (
                <button
                  key={client.uid}
                  onClick={() => handleSelectClient(client.uid)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-nutado-gray-100 hover:border-[#ec2626]/30 hover:bg-gray-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-nutado-green text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-nutado-gray-900 truncate">
                        {client.name}
                      </p>
                      <p className="text-[11px] text-nutado-gray-400 truncate mt-0.5">
                        {client.company || "Individual"} • {client.email}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1 text-[#ec2626] shrink-0 font-medium text-xs flex items-center gap-1">
                    Select <ArrowRight size={13} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
