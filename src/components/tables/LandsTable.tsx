import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DataTable } from "../ui/data-table";
import type { Land } from "../../types/inventory";

interface LandsTableProps {
  lands: Land[];
  onEdit: (land: Land) => void;
  onDelete: (land: Land) => void;
}

const LandsTable = ({ lands, onEdit, onDelete }: LandsTableProps) => {
  const columns = [
    {
      key: "index",
      label: "No",
      sortable: true,
      render: (value: any, item: Land, index?: number) => index !== undefined ? index + 1 : 1,
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
                alt="Foto tanah"
                className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <img
                src={value}
                alt="Foto tanah"
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
      key: "locationName",
      label: "Lokasi",
      sortable: true,
    },
    {
      key: "locationCode",
      label: "Kode Lokasi",
      sortable: true,
    },
    {
      key: "area",
      label: "Luas",
      sortable: true,
      render: (value: number) => `${value.toLocaleString("id-ID")} m²`,
    },
    {
      key: "price",
      label: "Harga",
      sortable: true,
      render: (value: number) => `Rp ${value.toLocaleString("id-ID")}`,
    },
  ];

  const renderActions = (land: Land) => (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
            Detail
          </Button>
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
                <img src={land.photoUrl} alt={`Foto ${land.locationName}`} className="max-h-[70vh] sm:max-h-[60vh] md:max-h-[55vh] lg:max-h-[50vh] xl:max-h-[45vh] w-auto max-w-full rounded object-contain" />
              ) : (
                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200" onClick={() => onEdit(land)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm"
        onClick={() => onDelete(land)}
      >
        Hapus
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Tanah</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={lands}
          columns={columns}
          searchPlaceholder="Cari tanah..."
          actions={renderActions}
          exportable={true}
          emptyMessage="Belum ada data tanah."
        />
      </CardContent>
    </Card>
  );
};

export default LandsTable;
