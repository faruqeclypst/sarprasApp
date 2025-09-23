import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Room } from "../../types/inventory";

interface RoomsTableProps {
  rooms: Room[];
}

const conditionLabels: Record<Room["condition"], string> = {
  baik: "Baik",
  cukup: "Cukup",
  rusak: "Rusak",
};

const RoomsTable = ({ rooms }: RoomsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Ruang</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Nama Ruang</th>
              <th className="px-4 py-3">Kode Gedung</th>
              <th className="px-4 py-3">Kondisi</th>
              <th className="px-4 py-3">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data ruangan.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="border-b/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{room.name}</td>
                  <td className="px-4 py-3">{room.buildingCode}</td>
                  <td className="px-4 py-3">
                    <Badge variant={room.condition === "rusak" ? "destructive" : room.condition === "cukup" ? "secondary" : "default"}>
                      {conditionLabels[room.condition]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{room.notes ?? "-"}</td>
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
