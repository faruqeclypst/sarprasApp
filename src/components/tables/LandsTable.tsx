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
                alt="Foto"
                className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <img
                src={value}
                alt="Foto"
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
  ];

  const renderActions = (land: Land) => (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-500">
            Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-bold">Detail Tanah & Bangunan</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Informasi lengkap aset</p>
          </DialogHeader>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Informasi Lokasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Lokasi</label>
                    <p className="font-medium">{land.locationName}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kode Lokasi</label>
                    <p className="font-medium font-mono text-sm">{land.locationCode}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Luas Tanah</label>
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{land.area.toLocaleString("id-ID")} m²</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tahun Perolehan</label>
                    <p className="font-medium">{land.acquisitionYear}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alamat Lengkap</label>
                  <div className="bg-card border rounded-md p-3 text-sm whitespace-pre-wrap">
                    {land.address}
                  </div>
                </div>
              </div>

              {/* Legal Information Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  Informasi Legal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No. Sertifikat</label>
                    <p className="font-medium font-mono text-sm">{land.certificateNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Asal Perolehan</label>
                    <p className="font-medium">{land.origin}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              {land.description && (
                <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                    Keterangan Tambahan
                  </h3>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deskripsi</label>
                    <div className="bg-card border rounded-md p-4 text-sm whitespace-pre-wrap leading-relaxed">
                      {land.description}
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Statistics */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                  Ringkasan Aset
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <p className="text-2xl font-bold text-primary">{land.area.toLocaleString("id-ID")}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Meter Persegi</p>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{new Date().getFullYear() - land.acquisitionYear}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Tahun Kepemilikan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Photo */}
            <div className="lg:col-span-1">
              <div className="bg-muted/20 rounded-lg p-4 h-fit sticky top-4">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  Foto
                </h3>
                <div className="flex items-center justify-center">
                  {land.photoUrl ? (
                    <div className="space-y-3 w-full">
                      <img 
                        src={land.photoUrl} 
                        alt={`Foto ${land.locationName}`} 
                        className="w-full max-h-[400px] object-cover rounded-lg border shadow-sm" 
                      />
                      <div className="text-center">
                        <p className="text-xs font-medium">{land.locationName}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">Tidak ada foto</span>
                      <span className="text-xs">Foto tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:border-green-600" onClick={() => onEdit(land)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:border-red-600"
        onClick={() => onDelete(land)}
      >
        Hapus
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Tanah & Bangunan</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={lands}
          columns={columns}
          searchPlaceholder="Cari..."
          actions={renderActions}
          exportable={true}
          emptyMessage="Belum ada data."
        />
      </CardContent>
    </Card>
  );
};

export default LandsTable;
