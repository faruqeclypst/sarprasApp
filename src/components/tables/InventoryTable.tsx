import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { InventoryItem, Room } from "../../types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  rooms: Room[];
}

const conditionLabels: Record<InventoryItem["condition"], string> = {
  baik: "Baik",
  cukup: "Cukup",
  rusak: "Rusak",
};

const InventoryTable = ({ items, rooms }: InventoryTableProps) => {
  const roomLookup = new Map(rooms.map((room) => [room.id, room.name]));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Daftar Barang</CardTitle>
          <p className="text-sm text-muted-foreground">Pantau kondisi dan lokasi barang sekolah.</p>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Merk</th>
              <th className="px-4 py-3">Jumlah</th>
              <th className="px-4 py-3">Harga Total</th>
              <th className="px-4 py-3">Sumber</th>
              <th className="px-4 py-3">Ruang</th>
              <th className="px-4 py-3">Kondisi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data barang.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{item.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.specification}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.brand}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">Rp {item.totalPrice.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">{item.source}</td>
                  <td className="px-4 py-3">{roomLookup.get(item.roomId) ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.condition === "rusak" ? "destructive" : item.condition === "cukup" ? "secondary" : "default"}>
                      {conditionLabels[item.condition]}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
