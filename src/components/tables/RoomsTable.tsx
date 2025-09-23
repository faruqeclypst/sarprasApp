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
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
            Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Ruang</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                <div className="text-muted-foreground">Nama</div>
                <div className="col-span-2 font-medium">{room.name}</div>
                <div className="text-muted-foreground">Kode Gedung</div>
                <div className="col-span-2 font-medium">{room.buildingCode}</div>
                <div className="text-muted-foreground">Kondisi</div>
                <div className="col-span-2">
                  <Badge variant={room.condition === "rusak" ? "destructive" : room.condition === "cukup" ? "secondary" : "default"}>
                    {conditionLabels[room.condition]}
                  </Badge>
                </div>
                {room.roomType && (
                  <>
                    <div className="text-muted-foreground">Jenis Ruang</div>
                    <div className="col-span-2 font-medium">{roomTypeLabels[room.roomType]}</div>
                  </>
                )}
                {room.capacity && (
                  <>
                    <div className="text-muted-foreground">Kapasitas</div>
                    <div className="col-span-2 font-medium">{room.capacity} orang</div>
                  </>
                )}
                {room.floor && (
                  <>
                    <div className="text-muted-foreground">Lantai</div>
                    <div className="col-span-2 font-medium">{room.floor}</div>
                  </>
                )}
                {room.notes && (
                  <>
                    <div className="text-muted-foreground">Keterangan</div>
                    <div className="col-span-2 whitespace-pre-wrap">{room.notes}</div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-start justify-center">
              {room.photoUrl ? (
                <img src={room.photoUrl} alt={`Foto ${room.name}`} className="max-h-[70vh] sm:max-h-[60vh] md:max-h-[55vh] lg:max-h-[50vh] xl:max-h-[45vh] w-auto max-w-full rounded object-contain" />
              ) : (
                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Tidak ada foto</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200" onClick={() => onEdit(room)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm"
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
