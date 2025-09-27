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
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-500">
            Detail
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-bold">Detail Surat Masuk</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Informasi lengkap surat masuk</p>
          </DialogHeader>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Informasi Dasar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No. Surat</label>
                    <p className="font-medium">{mail.mailNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal</label>
                    <p className="font-medium">{new Date(mail.date).toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pengirim</label>
                    <p className="font-medium">{mail.sender}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Penerima</label>
                    <p className="font-medium">{mail.recipient}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alamat Pengirim</label>
                  <p className="font-medium text-sm">{mail.senderAddress}</p>
                </div>
              </div>

              {/* Subject and Content Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                  Perihal & Isi Surat
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perihal</label>
                    <p className="font-medium">{mail.subject}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Isi Surat</label>
                    <div className="bg-card border rounded-md p-4 text-sm whitespace-pre-wrap leading-relaxed">
                      {mail.content}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Processing Section */}
              <div className="bg-muted/20 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  Status & Pemrosesan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kategori</label>
                    <Badge variant="outline" className="w-fit">{categoryLabels[mail.category]}</Badge>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prioritas</label>
                    <Badge
                      className="w-fit"
                      variant={
                        mail.priority === "urgent" ? "destructive" :
                        mail.priority === "tinggi" ? "secondary" :
                        "outline"
                      }
                    >
                      {priorityLabels[mail.priority]}
                    </Badge>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
                    <Badge
                      className="w-fit"
                      variant={
                        mail.status === "selesai" ? "default" :
                        mail.status === "ditindaklanjuti" ? "secondary" :
                        "outline"
                      }
                    >
                      {statusLabels[mail.status]}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diterima Oleh</label>
                    <p className="font-medium">{mail.receivedBy}</p>
                  </div>
                  {mail.processedBy && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diproses Oleh</label>
                      <p className="font-medium">{mail.processedBy}</p>
                    </div>
                  )}
                  {mail.processedDate && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tanggal Diproses</label>
                      <p className="font-medium">{new Date(mail.processedDate).toLocaleDateString("id-ID")}</p>
                    </div>
                  )}
                </div>
                {mail.notes && (
                  <div className="space-y-2 pt-2 border-t">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Catatan</label>
                    <div className="bg-card border rounded-md p-3 text-sm whitespace-pre-wrap">
                      {mail.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Attachment */}
            <div className="lg:col-span-1">
              <div className="bg-muted/20 rounded-lg p-4 h-fit sticky top-4">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                  Lampiran
                </h3>
                <div className="flex items-center justify-center">
                  {mail.attachmentUrl ? (
                    <img 
                      src={mail.attachmentUrl} 
                      alt={`Lampiran ${mail.subject}`} 
                      className="w-full max-h-[400px] object-contain rounded-lg border shadow-sm" 
                    />
                  ) : (
                    <div className="w-full h-48 rounded-lg bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-muted-foreground">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm font-medium">Tidak ada lampiran</span>
                      <span className="text-xs">Lampiran tidak tersedia</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:border-green-600" onClick={() => onEdit(mail)}>
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 shadow-sm dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:border-red-600"
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