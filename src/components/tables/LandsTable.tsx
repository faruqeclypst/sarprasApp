import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { Land } from "../../types/inventory";

interface LandsTableProps {
  lands: Land[];
  onEdit: (land: Land) => void;
  onDelete: (land: Land) => void;
}

const LandsTable = ({ lands, onEdit, onDelete }: LandsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Tanah</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Kode Lokasi</th>
              <th className="px-4 py-3">Luas</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {lands.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data tanah.
                </td>
              </tr>
            ) : (
              lands.map((land, index) => (
                <tr key={land.id} className="border-b/60 last:border-0">
                  <td className="px-4 py-3 w-12 text-center align-middle">{index + 1}</td>
                  <td className="px-4 py-3">
                    {land.photoUrl ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={land.photoUrl}
                            alt={`Foto ${land.locationName}`}
                            className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-2 sm:p-4">
                          <img
                            src={land.photoUrl}
                            alt={`Foto ${land.locationName}`}
                            className="mx-auto max-h-[80vh] w-auto rounded"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted ring-1 ring-border" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{land.locationName}</td>
                  <td className="px-4 py-3">{land.locationCode}</td>
                  <td className="px-4 py-3">{land.area.toLocaleString("id-ID")}&nbsp;m²</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">Lihat Detail</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detail Tanah</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                                <div className="text-muted-foreground">Lokasi</div>
                                <div className="col-span-2 font-medium">{land.locationName}</div>
                                <div className="text-muted-foreground">Kode Lokasi</div>
                                <div className="col-span-2 font-medium">{land.locationCode}</div>
                                <div className="text-muted-foreground">Luas</div>
                                <div className="col-span-2 font-medium">{land.area.toLocaleString("id-ID")} m²</div>
                                <div className="text-muted-foreground">Tahun Perolehan</div>
                                <div className="col-span-2 font-medium">{land.acquisitionYear}</div>
                                <div className="text-muted-foreground">Alamat</div>
                                <div className="col-span-2 whitespace-pre-wrap">{land.address}</div>
                                <div className="text-muted-foreground">No. Sertifikat</div>
                                <div className="col-span-2 font-medium">{land.certificateNumber}</div>
                                <div className="text-muted-foreground">Asal</div>
                                <div className="col-span-2 font-medium">{land.origin}</div>
                                <div className="text-muted-foreground">Harga</div>
                                <div className="col-span-2 font-medium">Rp {land.price.toLocaleString("id-ID")}</div>
                                {land.description ? (
                                  <>
                                    <div className="text-muted-foreground">Keterangan</div>
                                    <div className="col-span-2 whitespace-pre-wrap">{land.description}</div>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <div className="flex items-start justify-center">
                              {land.photoUrl ? (
                                <img src={land.photoUrl} alt={`Foto ${land.locationName}`} className="max-h-[60vh] rounded object-contain" />
                              ) : (
                                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(land)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(land)}
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

export default LandsTable;
