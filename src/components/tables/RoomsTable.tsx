import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
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

const RoomsTable = ({ rooms, onEdit, onDelete }: RoomsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Ruang</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nama Ruang</th>
              <th className="px-4 py-3">Kode Gedung</th>
              <th className="px-4 py-3">Kondisi</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data ruangan.
                </td>
              </tr>
            ) : (
              rooms.map((room, index) => (
                <tr key={room.id} className="border-b/60 last:border-0">
                  <td className="px-4 py-3 w-12 text-center align-middle">{index + 1}</td>
                  <td className="px-4 py-3">
                    {room.photoUrl ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={room.photoUrl}
                            alt={`Foto ${room.name}`}
                            className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-2 sm:p-4">
                          <img
                            src={room.photoUrl}
                            alt={`Foto ${room.name}`}
                            className="mx-auto max-h-[80vh] w-auto rounded"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted ring-1 ring-border" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{room.name}</td>
                  <td className="px-4 py-3">{room.buildingCode}</td>
                  <td className="px-4 py-3">
                    <Badge variant={room.condition === "rusak" ? "destructive" : room.condition === "cukup" ? "secondary" : "default"}>
                      {conditionLabels[room.condition]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">Lihat Detail</Button>
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
                                <div className="text-muted-foreground">Keterangan</div>
                                <div className="col-span-2 whitespace-pre-wrap">{room.notes ?? "-"}</div>
                              </div>
                            </div>
                            <div className="flex items-start justify-center">
                              {room.photoUrl ? (
                                <img src={room.photoUrl} alt={`Foto ${room.name}`} className="max-h-[60vh] rounded object-contain" />
                              ) : (
                                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(room)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(room)}
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

export default RoomsTable;
