import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DataTable } from "../ui/data-table";
import type { Loan } from "../../types/inventory";

interface LoansTableProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
  onMarkReturned: (loan: Loan) => void;
}

const LoansTable = ({ loans, onEdit, onDelete, onMarkReturned }: LoansTableProps) => {
  const columns = [
    {
      key: "index",
      label: "No",
      sortable: true,
      render: (value: any, item: Loan, index?: number) => index !== undefined ? index + 1 : 1,
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
                alt="Foto peminjaman"
                className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <img
                src={value}
                alt="Foto peminjaman"
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
      key: "borrowerName",
      label: "Peminjam",
      sortable: true,
    },
    {
      key: "itemName",
      label: "Barang",
      sortable: true,
    },
    {
      key: "loanDate",
      label: "Tgl Pinjam",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: any, item: Loan) => {
        return (
          <Badge variant={item.status === "dikembalikan" ? "default" : "secondary"}>
            {item.status === "dikembalikan" ? "Dikembalikan" : "Dipinjam"}
          </Badge>
        );
      },
    },
  ];

  const renderActions = (loan: Loan) => {
    const dueDate = new Date(loan.returnDate);

    return (
      <div className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-500">
              Detail
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-xl font-bold">Detail Peminjaman</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Informasi lengkap peminjaman barang</p>
            </DialogHeader>
            
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left column - Main Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Section */}
                <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full"></div>
                    Informasi Peminjaman
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Peminjam</label>
                      <p className="font-medium text-lg">{loan.borrowerName}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Barang Dipinjam</label>
                      <p className="font-medium text-lg">{loan.itemName}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Pinjam</label>
                      <p className="font-medium">{new Date(loan.loanDate).toLocaleDateString("id-ID")}</p>
                      <p className="text-xs text-muted-foreground">{new Date(loan.loanDate).toLocaleTimeString("id-ID")}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Batas Pengembalian</label>
                      <p className="font-medium">{dueDate.toLocaleDateString("id-ID")}</p>
                      <p className="text-xs text-muted-foreground">{dueDate.toLocaleTimeString("id-ID")}</p>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                    Status & Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Peminjaman</label>
                      <Badge
                        className="w-fit text-base px-3 py-1"
                        variant={loan.status === "dikembalikan" ? "default" : "secondary"}
                      >
                        {loan.status === "dikembalikan" ? "Sudah Dikembalikan" : "Masih Dipinjam"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Durasi Peminjaman</label>
                      <p className="font-medium">
                        {Math.ceil((dueDate.getTime() - new Date(loan.loanDate).getTime()) / (1000 * 60 * 60 * 24))} hari
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline indicator */}
                  <div className="mt-4 p-4 bg-card border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Progress Peminjaman</span>
                      <span className="text-xs text-muted-foreground">
                        {loan.status === "dikembalikan" ? "Selesai" : 
                         dueDate < new Date() ? "Terlambat" : "Berjalan"}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            loan.status === "dikembalikan" ? "bg-green-500 w-full" :
                            dueDate < new Date() ? "bg-red-500 w-full" : "bg-blue-500 w-2/3"
                          }`}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Dipinjam</span>
                        <span>Jatuh Tempo</span>
                        <span>Selesai</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {loan.notes && (
                  <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                      Catatan Tambahan
                    </h3>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keterangan</label>
                      <div className="bg-card border rounded-md p-4 text-sm whitespace-pre-wrap leading-relaxed">
                        {loan.notes}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Cards */}
                <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                    Ringkasan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-card rounded-lg border">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.ceil((new Date().getTime() - new Date(loan.loanDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Hari Berlalu</p>
                    </div>
                    <div className="text-center p-3 bg-card rounded-lg border">
                      <p className={`text-2xl font-bold ${
                        loan.status === "dikembalikan" ? "text-green-600 dark:text-green-400" :
                        dueDate < new Date() ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
                      }`}>
                        {loan.status === "dikembalikan" ? "0" :
                         Math.max(0, Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Hari Tersisa</p>
                    </div>
                    <div className="text-center p-3 bg-card rounded-lg border">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                        loan.status === "dikembalikan" ? "bg-green-500" :
                        dueDate < new Date() ? "bg-red-500" : "bg-blue-500"
                      }`}></div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {loan.status === "dikembalikan" ? "Dikembalikan" :
                         dueDate < new Date() ? "Terlambat" : "Aktif"}
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
                    Dokumentasi
                  </h3>
                  <div className="flex items-center justify-center">
                    {loan.photoUrl ? (
                      <div className="space-y-3 w-full">
                        <img 
                          src={loan.photoUrl} 
                          alt={`Foto peminjaman ${loan.itemName}`} 
                          className="w-full max-h-[400px] object-cover rounded-lg border shadow-sm" 
                        />
                        <div className="text-center">
                          <p className="text-xs font-medium">{loan.itemName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium">Tidak ada foto</span>
                        <span className="text-xs">Dokumentasi tidak tersedia</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {loan.status === "dipinjam" && (
          <Button
            variant="secondary"
            size="sm"
            className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:border-green-600"
            onClick={() => onMarkReturned(loan)}
          >
            Kembalikan
          </Button>
        )}
        <Button variant="secondary" size="sm" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900 dark:border-blue-600" onClick={() => onEdit(loan)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:border-red-600"
          onClick={() => onDelete(loan)}
        >
          Hapus
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Peminjaman</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={loans}
          columns={columns}
          searchPlaceholder="Cari peminjaman..."
          actions={renderActions}
          exportable={true}
          emptyMessage="Belum ada data peminjaman."
        />
      </CardContent>
    </Card>
  );
};

export default LoansTable;
