/**
 * Download an array of objects as a CSV file.
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename = "export.csv"
): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = String(row[h] ?? "").replace(/"/g, '""');
        return val.includes(",") || val.includes('"') || val.includes("\n")
          ? `"${val}"`
          : val;
      })
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Format orders data for CSV export.
 */
export function formatOrdersForExport(orders: {
  orderNumber: string;
  customer: string;
  company: string;
  occasion: string;
  quantity: number;
  total: number;
  status: string;
  deliveryDate: string;
  createdAt: string;
}[]) {
  return orders.map((o) => ({
    "Order Number":  o.orderNumber,
    "Customer":      o.customer,
    "Company":       o.company,
    "Occasion":      o.occasion,
    "Quantity":      o.quantity,
    "Total (₹)":     o.total,
    "Status":        o.status,
    "Delivery Date": o.deliveryDate,
    "Order Date":    o.createdAt,
  }));
}
