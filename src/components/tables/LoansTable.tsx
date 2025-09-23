import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { Loan } from "../../types/inventory";

interface LoansTableProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (loan: Loan) => void;
}

const LoansTable = ({ loans, onEdit, onDelete }: LoansTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Data Peminjaman</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Peminjam</th>
              <th className="px-4 py-3">Barang</th>
              <th className="px-4 py-3">Tgl Pinjam</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Belum ada data peminjaman.
                </td>
              </tr>
            ) : (
              loans.map((loan, index) => {
                const dueDate = new Date(loan.returnDate);
                const isLate = dueDate < new Date();
                return (
                  <tr key={loan.id} className="border-b/60 last:border-0">
                    <td className="px-4 py-3 w-12 text-center align-middle">{index + 1}</td>
                    <td className="px-4 py-3">
                      {loan.photoUrl ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <img
                              src={loan.photoUrl}
                              alt={`Foto peminjaman ${loan.itemName}`}
                              className="h-10 w-10 cursor-pointer rounded object-cover ring-1 ring-border"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-2 sm:p-4">
                            <img
                              src={loan.photoUrl}
                              alt={`Foto peminjaman ${loan.itemName}`}
                              className="mx-auto max-h-[80vh] w-auto rounded"
                            />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted ring-1 ring-border" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{loan.borrowerName}</td>
                    <td className="px-4 py-3">{loan.itemName}</td>
                    <td className="px-4 py-3">{new Date(loan.loanDate).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3">
                      <Badge variant={isLate ? "destructive" : "secondary"}>
                        {isLate ? "Terlambat" : "Dipinjam"}
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
                              <DialogTitle>Detail Peminjaman</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 sm:grid-cols-2">
                              <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                                  <div className="text-muted-foreground">Peminjam</div>
                                  <div className="col-span-2 font-medium">{loan.borrowerName}</div>
                                  <div className="text-muted-foreground">Barang</div>
                                  <div className="col-span-2 font-medium">{loan.itemName}</div>
                                  <div className="text-muted-foreground">Tanggal Pinjam</div>
                                  <div className="col-span-2 font-medium">{new Date(loan.loanDate).toLocaleString("id-ID")}</div>
                                  <div className="text-muted-foreground">Batas Kembali</div>
                                  <div className="col-span-2 font-medium">{dueDate.toLocaleString("id-ID")}</div>
                                  <div className="text-muted-foreground">Status</div>
                                  <div className="col-span-2">
                                    <Badge variant={isLate ? "destructive" : "secondary"}>
                                      {isLate ? "Terlambat" : "Dipinjam"}
                                    </Badge>
                                  </div>
                                  {loan.notes ? (
                                    <>
                                      <div className="text-muted-foreground">Catatan</div>
                                      <div className="col-span-2 whitespace-pre-wrap">{loan.notes}</div>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                              <div className="flex items-start justify-center">
                                {loan.photoUrl ? (
                                  <img src={loan.photoUrl} alt={`Foto peminjaman ${loan.itemName}`} className="max-h-[60vh] rounded object-contain" />
                                ) : (
                                  <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => onEdit(loan)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(loan)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default LoansTable;
