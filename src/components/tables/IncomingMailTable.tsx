import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DataTable } from "../ui/data-table";
import type { IncomingMail } from "../../types/inventory";

interface IncomingMailTableProps {
  incomingMail: IncomingMail[];
  onEdit: (mail: IncomingMail) => void;
  onDelete: (mail: IncomingMail) => void;
}

const priorityLabels: Record<IncomingMail["priority"], string> = {
  rendah: "Rendah",
  normal: "Normal",
  tinggi: "Tinggi",
  urgent: "Urgent",
};

const categoryLabels: Record<IncomingMail["category"], string> = {
  undangan: "Undangan",
  pemberitahuan: "Pemberitahuan",
  permohonan: "Permohonan",
  laporan: "Laporan",
  lainnya: "Lainnya",
};

const statusLabels: Record<IncomingMail["status"], string> = {
  belum_dibaca: "Belum Dibaca",
  sudah_dibaca: "Sudah Dibaca",
  ditindaklanjuti: "Ditindaklanjuti",
  selesai: "Selesai",
};

const IncomingMailTable = ({ incomingMail, onEdit, onDelete }: IncomingMailTableProps) => {
  const columns = [
    {
      key: "index",
      label: "No",
      sortable: true,
      render: (value: any, item: IncomingMail, index?: number) => index !== undefined ? index + 1 : 1,
    },
    {
      key: "attachmentUrl",
      label: "Lampiran",
      sortable: false,
      render: (value: string) => (
        value ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Lihat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <img
                src={value}
                alt="Lampiran surat"
                className="mx-auto max-h-[90vh] sm:max-h-[80vh] md:max-h-[75vh] lg:max-h-[70vh] xl:max-h-[65vh] w-auto max-w-full rounded object-contain"
              />
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )
      ),
    },
    {
      key: "mailNumber",
      label: "No. Surat",
      sortable: true,
    },
    {
      key: "date",
      label: "Tanggal",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString("id-ID"),
    },
    {
      key: "sender",
      label: "Pengirim",
      sortable: true,
    },
    {
      key: "subject",
      label: "Perihal",
      sortable: true,
      render: (value: string) => (
        <div className="max-w-48 truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "priority",
      label: "Prioritas",
      sortable: true,
      render: (value: IncomingMail["priority"]) => (
        <Badge 
          variant={
            value === "urgent" ? "destructive" : 
            value === "tinggi" ? "secondary" : 
            "outline"
          }
        >
          {priorityLabels[value]}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: IncomingMail["status"]) => (
        <Badge 
          variant={
            value === "selesai" ? "default" : 
            value === "ditindaklanjuti" ? "secondary" : 
            "outline"
          }
        >
          {statusLabels[value]}
        </Badge>
      ),
    },
  ];

  const renderActions = (mail: IncomingMail) => (
    <div className="flex justify-end gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
            Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Surat Masuk</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                <div className="text-muted-foreground">No. Surat</div>
                <div className="col-span-2 font-medium">{mail.mailNumber}</div>
                <div className="text-muted-foreground">Tanggal</div>
                <div className="col-span-2 font-medium">{new Date(mail.date).toLocaleString("id-ID")}</div>
                <div className="text-muted-foreground">Pengirim</div>
                <div className="col-span-2 font-medium">{mail.sender}</div>
                <div className="text-muted-foreground">Alamat Pengirim</div>
                <div className="col-span-2 font-medium">{mail.senderAddress}</div>
                <div className="text-muted-foreground">Penerima</div>
                <div className="col-span-2 font-medium">{mail.recipient}</div>
                <div className="text-muted-foreground">Perihal</div>
                <div className="col-span-2 font-medium">{mail.subject}</div>
                <div className="text-muted-foreground">Kategori</div>
                <div className="col-span-2">
                  <Badge variant="outline">{categoryLabels[mail.category]}</Badge>
                </div>
                <div className="text-muted-foreground">Prioritas</div>
                <div className="col-span-2">
                  <Badge 
                    variant={
                      mail.priority === "urgent" ? "destructive" : 
                      mail.priority === "tinggi" ? "secondary" : 
                      "outline"
                    }
                  >
                    {priorityLabels[mail.priority]}
                  </Badge>
                </div>
                <div className="text-muted-foreground">Status</div>
                <div className="col-span-2">
                  <Badge 
                    variant={
                      mail.status === "selesai" ? "default" : 
                      mail.status === "ditindaklanjuti" ? "secondary" : 
                      "outline"
                    }
                  >
                    {statusLabels[mail.status]}
                  </Badge>
                </div>
                <div className="text-muted-foreground">Diterima Oleh</div>
                <div className="col-span-2 font-medium">{mail.receivedBy}</div>
                {mail.processedBy && (
                  <>
                    <div className="text-muted-foreground">Diproses Oleh</div>
                    <div className="col-span-2 font-medium">{mail.processedBy}</div>
                  </>
                )}
                {mail.processedDate && (
                  <>
                    <div className="text-muted-foreground">Tanggal Diproses</div>
                    <div className="col-span-2 font-medium">{new Date(mail.processedDate).toLocaleString("id-ID")}</div>
                  </>
                )}
                <div className="text-muted-foreground col-span-3 font-medium mt-2">Isi Surat:</div>
                <div className="col-span-3 whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded">{mail.content}</div>
                {mail.notes && (
                  <>
                    <div className="text-muted-foreground">Catatan</div>
                    <div className="col-span-2 whitespace-pre-wrap">{mail.notes}</div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-start justify-center">
              {mail.attachmentUrl ? (
                <img src={mail.attachmentUrl} alt={`Lampiran ${mail.subject}`} className="max-h-[70vh] sm:max-h-[60vh] md:max-h-[55vh] lg:max-h-[50vh] xl:max-h-[45vh] w-auto max-w-full rounded object-contain" />
              ) : (
                <div className="h-48 w-48 rounded bg-muted ring-1 ring-border flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Tidak ada lampiran</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200" onClick={() => onEdit(mail)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm"
        onClick={() => onDelete(mail)}
      >
        Hapus
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Surat Masuk</CardTitle>
        <p className="text-sm text-muted-foreground">Kelola surat masuk institusi.</p>
      </CardHeader>
      <CardContent>
        <DataTable
          data={incomingMail}
          columns={columns}
          searchPlaceholder="Cari surat masuk..."
          actions={renderActions}
          exportable={true}
          emptyMessage="Belum ada data surat masuk."
        />
      </CardContent>
    </Card>
  );
};

export default IncomingMailTable;