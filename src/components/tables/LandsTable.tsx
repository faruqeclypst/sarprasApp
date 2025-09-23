import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Land } from "../../types/inventory";

interface LandsTableProps {
  lands: Land[];
}

const LandsTable = ({ lands }: LandsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Tanah</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Kode Lokasi</th>
              <th className="px-4 py-3">Luas</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3">Alamat</th>
              <th className="px-4 py-3">No. Sertifikat</th>
              <th className="px-4 py-3">Harga</th>
            </tr>
          </thead>
          <tbody>
            {lands.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data tanah.
                </td>
              </tr>
            ) : (
              lands.map((land) => (
                <tr key={land.id} className="border-b/60 last:border-0">
                  <td className="px-4 py-3 font-medium">{land.locationName}</td>
                  <td className="px-4 py-3">{land.locationCode}</td>
                  <td className="px-4 py-3">{land.area.toLocaleString("id-ID")}&nbsp;m²</td>
                  <td className="px-4 py-3">{land.acquisitionYear}</td>
                  <td className="px-4 py-3 text-muted-foreground">{land.address}</td>
                  <td className="px-4 py-3">{land.certificateNumber}</td>
                  <td className="px-4 py-3">Rp {land.price.toLocaleString("id-ID")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default LandsTable;
