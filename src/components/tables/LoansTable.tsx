import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
              <th className="px-4 py-3">Nama Peminjam</th>
              <th className="px-4 py-3">Barang</th>
              <th className="px-4 py-3">Tgl Pinjam</th>
              <th className="px-4 py-3">Tgl Kembali</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Catatan</th>
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
              loans.map((loan) => {
                const dueDate = new Date(loan.returnDate);
                const isLate = dueDate < new Date();
                return (
                  <tr key={loan.id} className="border-b/60 last:border-0">
                    <td className="px-4 py-3 font-medium">{loan.borrowerName}</td>
                    <td className="px-4 py-3">{loan.itemName}</td>
                    <td className="px-4 py-3">{new Date(loan.loanDate).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3">{dueDate.toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3">
                      <Badge variant={isLate ? "destructive" : "secondary"}>
                        {isLate ? "Terlambat" : "Dipinjam"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{loan.notes ?? "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
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
