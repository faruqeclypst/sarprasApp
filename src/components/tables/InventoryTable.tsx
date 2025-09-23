import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DataTable } from "../ui/data-table";
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

  const columns = [
    {
      key: "index",
      label: "No",
      sortable: true,
      render: (value: any, item: InventoryItem, index?: number) => index !== undefined ? index + 1 : 1,
    },
    {
      key: "photoUrl",
      label: "Foto",
      sortable: false,
      render: (value: string) => (
        value ? (
          <Dialog>
            <DialogTrigger asChild>
              <img
                src={value}
                alt="Foto barang"
                className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <img
                src={value}
                alt="Foto barang"
                className="mx-auto max-h-[90vh] sm:max-h-[80vh] md:max-h-[75vh] lg:max-h-[70vh] xl:max-h-[65vh] w-auto max-w-full rounded object-contain"
              />
            </DialogContent>
          </Dialog>
        ) : (
          <div className="h-10 w-10 rounded bg-muted ring-1 ring-border" />
        )
      ),
    },
    {
      key: "code",
      label: "Kode",
      sortable: true,
    },
    {
      key: "name",
      label: "Nama",
      sortable: true,
      render: (value: string, item: InventoryItem) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">{item.specification}</span>
        </div>
      ),
    },
    {
      key: "roomId",
      label: "Ruang",
      sortable: true,
      render: (value: string) => roomLookup.get(value) ?? "-",
    },
    {
      key: "condition",
      label: "Kondisi",
      sortable: true,
      render: (value: InventoryItem["condition"]) => (
        <Badge variant={value === "rusak" ? "destructive" : value === "cukup" ? "secondary" : "default"}>
          {conditionLabels[value]}
        </Badge>
      ),
    },
    {
      key: "quantity",
      label: "Jumlah",
      sortable: true,
    },
    {
      key: "totalPrice",
      label: "Harga Total",
      sortable: true,
      render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
    },
  ];

  const renderActions = (item: InventoryItem) => (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
            Detail
          </Button>
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
                <img src={item.photoUrl} alt={`Foto ${item.name}`} className="max-h-[70vh] sm:max-h-[60vh] md:max-h-[55vh] lg:max-h-[50vh] xl:max-h-[45vh] w-auto max-w-full rounded object-contain" />
              ) : (
                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200" onClick={() => onEdit(item)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm"
        onClick={() => onDelete(item)}
      >
        Hapus
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Daftar Barang</CardTitle>
        <p className="text-sm text-muted-foreground">Pantau kondisi dan lokasi barang sekolah.</p>
      </CardHeader>
      <CardContent>
        <DataTable
          data={items}
          columns={columns}
          searchPlaceholder="Cari barang..."
          actions={renderActions}
          exportable={true}
          emptyMessage="Belum ada data barang."
        />
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
