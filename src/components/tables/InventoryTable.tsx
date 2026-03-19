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
      key: "acquisitionDate",
      label: "Tanggal Perolehan",
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString("id-ID") : "-",
    },
  ];

  const renderActions = (item: InventoryItem) => (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-500">
            Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-bold">Detail Barang Inventaris</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Informasi lengkap barang inventaris</p>
          </DialogHeader>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Informasi Dasar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kode Barang</label>
                    <p className="font-medium font-mono text-sm">{item.code}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Barang</label>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Merk/Brand</label>
                    <p className="font-medium">{item.brand}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Jumlah</label>
                    <p className="font-medium">{item.quantity} unit</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Spesifikasi</label>
                  <div className="bg-card border rounded-md p-3 text-sm whitespace-pre-wrap">
                    {item.specification}
                  </div>
                </div>
              </div>

              {/* Acquisition & Location Information Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  Informasi Perolehan & Lokasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Perolehan</label>
                    <p className="font-medium">{item.acquisitionDate ? new Date(item.acquisitionDate).toLocaleDateString("id-ID") : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sumber Perolehan</label>
                    <p className="font-medium">{item.source}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lokasi Ruang</label>
                    <p className="font-medium">{roomLookup.get(item.roomId) ?? "Tidak diketahui"}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kondisi Barang</label>
                    <Badge
                      className="w-fit"
                      variant={item.condition === "rusak" ? "destructive" : item.condition === "cukup" ? "secondary" : "default"}
                    >
                      {conditionLabels[item.condition]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  Informasi Tambahan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Inventaris</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.condition === "baik" ? "bg-green-500" : 
                        item.condition === "cukup" ? "bg-yellow-500" : "bg-red-500"
                      }`}></div>
                      <span className="text-sm font-medium">
                        {item.condition === "baik" ? "Siap Pakai" : 
                         item.condition === "cukup" ? "Perlu Perhatian" : "Perlu Perbaikan"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Photo */}
            <div className="lg:col-span-1">
              <div className="bg-muted/20 rounded-lg p-4 h-fit sticky top-4">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  Foto Barang
                </h3>
                <div className="flex items-center justify-center">
                  {item.photoUrl ? (
                    <div className="space-y-3 w-full">
                      <img 
                        src={item.photoUrl} 
                        alt={`Foto ${item.name}`} 
                        className="w-full max-h-[400px] object-cover rounded-lg border shadow-sm" 
                      />
                      <div className="text-center">
                        <p className="text-xs font-medium">{item.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Tidak ada foto</span>
                      <span className="text-xs">Foto barang tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:border-green-600" onClick={() => onEdit(item)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:border-red-600"
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
