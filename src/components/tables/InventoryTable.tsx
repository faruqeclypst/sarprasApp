import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { InventoryItem, Room } from "../../types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  rooms: Room[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

const conditionLabels: Record<InventoryItem["condition"], string> = {
  baik: "Baik",
  cukup: "Cukup",
  rusak: "Rusak",
};

const InventoryTable = ({ items, rooms, onEdit, onDelete }: InventoryTableProps) => {
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
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Ruang</th>
              <th className="px-4 py-3">Kondisi</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data barang.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="border-b/60 last:border-0">
                  <td className="px-4 py-3 w-12 text-center align-middle">{index + 1}</td>
                  <td className="px-4 py-3">
                    {item.photoUrl ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={item.photoUrl}
                            alt={`Foto ${item.name}`}
                            className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-2 sm:p-4">
                          <img
                            src={item.photoUrl}
                            alt={`Foto ${item.name}`}
                            className="mx-auto max-h-[80vh] w-auto rounded"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted ring-1 ring-border" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.specification}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{roomLookup.get(item.roomId) ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.condition === "rusak" ? "destructive" : item.condition === "cukup" ? "secondary" : "default"}>
                      {conditionLabels[item.condition]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">Lihat Detail</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detail Barang</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                                <div className="text-muted-foreground">Kode</div>
                                <div className="col-span-2 font-medium">{item.code}</div>
                                <div className="text-muted-foreground">Nama</div>
                                <div className="col-span-2 font-medium">{item.name}</div>
                                <div className="text-muted-foreground">Merk</div>
                                <div className="col-span-2 font-medium">{item.brand}</div>
                                <div className="text-muted-foreground">Spesifikasi</div>
                                <div className="col-span-2 whitespace-pre-wrap">{item.specification}</div>
                                <div className="text-muted-foreground">Jumlah</div>
                                <div className="col-span-2 font-medium">{item.quantity}</div>
                                <div className="text-muted-foreground">Harga Total</div>
                                <div className="col-span-2 font-medium">Rp {item.totalPrice.toLocaleString("id-ID")}</div>
                                <div className="text-muted-foreground">Sumber</div>
                                <div className="col-span-2 font-medium">{item.source}</div>
                                <div className="text-muted-foreground">Ruang</div>
                                <div className="col-span-2 font-medium">{roomLookup.get(item.roomId) ?? "-"}</div>
                                <div className="text-muted-foreground">Kondisi</div>
                                <div className="col-span-2">
                                  <Badge variant={item.condition === "rusak" ? "destructive" : item.condition === "cukup" ? "secondary" : "default"}>
                                    {conditionLabels[item.condition]}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start justify-center">
                              {item.photoUrl ? (
                                <img src={item.photoUrl} alt={`Foto ${item.name}`} className="max-h-[60vh] rounded object-contain" />
                              ) : (
                                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(item)}
                      >
                        Hapus
                      </Button>
                    </div>
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
