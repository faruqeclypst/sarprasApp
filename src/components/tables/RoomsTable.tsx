import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DataTable } from "../ui/data-table";
import type { Room } from "../../types/inventory";

interface RoomsTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const conditionLabels: Record<Room["condition"], string> = {
  baik: "Baik",
  cukup: "Cukup",
  rusak: "Rusak",
};

const roomTypeLabels: Record<NonNullable<Room["roomType"]>, string> = {
  kelas: "Kelas",
  laboratorium: "Laboratorium",
  kantor: "Kantor",
  ruang_rapat: "Ruang Rapat",
  perpustakaan: "Perpustakaan",
  lainnya: "Lainnya",
};

const RoomsTable = ({ rooms, onEdit, onDelete }: RoomsTableProps) => {
  const columns = [
    {
      key: "index",
      label: "No",
      sortable: true,
      render: (value: any, item: Room, index?: number) => index !== undefined ? index + 1 : 1,
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
                alt="Foto ruang"
                className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <img
                src={value}
                alt="Foto ruang"
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
      key: "name",
      label: "Nama Ruang",
      sortable: true,
    },
    {
      key: "buildingCode",
      label: "Kode Gedung",
      sortable: true,
    },
    {
      key: "condition",
      label: "Kondisi",
      sortable: true,
      render: (value: Room["condition"]) => (
        <Badge variant={value === "rusak" ? "destructive" : value === "cukup" ? "secondary" : "default"}>
          {conditionLabels[value]}
        </Badge>
      ),
    },
    {
      key: "roomType",
      label: "Jenis",
      sortable: true,
      render: (value: Room["roomType"]) => value ? roomTypeLabels[value] : "-",
    },
    {
      key: "capacity",
      label: "Kapasitas",
      sortable: true,
      render: (value: Room["capacity"]) => value ? `${value} orang` : "-",
    },
    {
      key: "floor",
      label: "Lantai",
      sortable: true,
      render: (value: Room["floor"]) => value ? value.toString() : "-",
    },
  ];

  const renderActions = (room: Room) => (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-500">
            Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-bold">Detail Ruang</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Informasi lengkap ruang dan fasilitas</p>
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
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Ruang</label>
                    <p className="font-medium text-lg">{room.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kode Gedung</label>
                    <p className="font-medium font-mono text-sm">{room.buildingCode}</p>
                  </div>
                  {room.roomType && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Jenis Ruang</label>
                      <p className="font-medium">{roomTypeLabels[room.roomType]}</p>
                    </div>
                  )}
                  {room.floor && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lantai</label>
                      <p className="font-medium">Lantai {room.floor}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Capacity & Condition Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  Kapasitas & Kondisi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.capacity && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kapasitas</label>
                      <p className="font-bold text-xl text-blue-600 dark:text-blue-400">{room.capacity} orang</p>
                    </div>
                  )}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kondisi Ruang</label>
                    <Badge
                      className="w-fit text-base px-3 py-1"
                      variant={room.condition === "rusak" ? "destructive" : room.condition === "cukup" ? "secondary" : "default"}
                    >
                      {conditionLabels[room.condition]}
                    </Badge>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="mt-4 p-4 bg-card border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Status Ruang</span>
                    <span className="text-xs text-muted-foreground">
                      {room.condition === "baik" ? "Siap Pakai" : 
                       room.condition === "cukup" ? "Perlu Perhatian" : "Perlu Perbaikan"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      room.condition === "baik" ? "bg-green-500" : 
                      room.condition === "cukup" ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            room.condition === "baik" ? "bg-green-500 w-full" :
                            room.condition === "cukup" ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">
                      {room.condition === "baik" ? "100%" : 
                       room.condition === "cukup" ? "67%" : "33%"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {room.notes && (
                <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                    Keterangan
                  </h3>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Catatan Tambahan</label>
                    <div className="bg-card border rounded-md p-4 text-sm whitespace-pre-wrap leading-relaxed">
                      {room.notes}
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                  Ringkasan Ruang
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {room.capacity || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Kapasitas Orang</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {room.floor || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Lantai</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                      room.condition === "baik" ? "bg-green-500" :
                      room.condition === "cukup" ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {conditionLabels[room.condition]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Photo */}
            <div className="lg:col-span-1">
              <div className="bg-muted/20 rounded-lg p-4 h-fit sticky top-4">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  Foto Ruang
                </h3>
                <div className="flex items-center justify-center">
                  {room.photoUrl ? (
                    <div className="space-y-3 w-full">
                      <img 
                        src={room.photoUrl} 
                        alt={`Foto ${room.name}`} 
                        className="w-full max-h-[400px] object-cover rounded-lg border shadow-sm" 
                      />
                      <div className="text-center">
                        <p className="text-xs font-medium">{room.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm font-medium">Tidak ada foto</span>
                      <span className="text-xs">Foto ruang tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:border-green-600" onClick={() => onEdit(room)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:border-red-600"
        onClick={() => onDelete(room)}
      >
        Hapus
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Ruang</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={rooms}
          columns={columns}
          searchPlaceholder="Cari ruang..."
          actions={renderActions}
          exportable={true}
          emptyMessage="Belum ada data ruangan."
        />
      </CardContent>
    </Card>
  );
};

export default RoomsTable;
