"use client";

import { useEffect, useState } from "react";
import {
  subscribeOrderById,
  subscribeOrders,
  subscribeOrdersForCustomer,
} from "@/lib/firebase/firestore";
import type { OrderRecord } from "@/types";

export function useOrders(customerId?: string, isClient = false) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isClient && !customerId) {
      setOrders([]);
      setLoading(true);
      return;
    }

    const unsubscribe = customerId
      ? subscribeOrdersForCustomer(customerId, (nextOrders) => {
          setOrders(nextOrders);
          setLoading(false);
        })
      : subscribeOrders((nextOrders) => {
          setOrders(nextOrders);
          setLoading(false);
        });

    return unsubscribe;
  }, [customerId, isClient]);

  return { orders, loading };
}

export function useOrder(id?: string) {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    return subscribeOrderById(id, (nextOrder) => {
      setOrder(nextOrder);
      setLoading(false);
    });
  }, [id]);

  return { order, loading };
}
