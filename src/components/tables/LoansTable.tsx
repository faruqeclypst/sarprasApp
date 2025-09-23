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
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
              Detail
            </Button>
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
                    <Badge variant={loan.status === "dikembalikan" ? "default" : "secondary"}>
                      {loan.status === "dikembalikan" ? "Dikembalikan" : "Dipinjam"}
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
                  <img src={loan.photoUrl} alt={`Foto peminjaman ${loan.itemName}`} className="max-h-[70vh] sm:max-h-[60vh] md:max-h-[55vh] lg:max-h-[50vh] xl:max-h-[45vh] w-auto max-w-full rounded object-contain" />
                ) : (
                  <div className="h-48 w-48 rounded bg-muted ring-1 ring-border" />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {loan.status === "dipinjam" && (
          <Button
            variant="secondary"
            size="sm"
            className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
            onClick={() => onMarkReturned(loan)}
          >
            Kembalikan
          </Button>
        )}
        <Button variant="secondary" size="sm" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" onClick={() => onEdit(loan)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm"
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
