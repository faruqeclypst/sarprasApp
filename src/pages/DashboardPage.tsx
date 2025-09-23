import { Package2, PiggyBank, Building2, Activity } from "lucide-react";

import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import InventoryDistribution from "../components/dashboard/InventoryDistribution";
import StatCard from "../components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useInventory } from "../context/InventoryContext";

const DashboardPage = () => {
  const { items, rooms, lands, loans } = useInventory();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAssetValue = items.reduce((sum, item) => sum + item.totalPrice, 0) + lands.reduce((sum, land) => sum + land.price, 0);
  const healthyRooms = rooms.filter((room) => room.condition === "baik").length;
  const activeLoans = loans.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Selamat datang di Dashboard Sarpras</h1>
        <p className="text-sm text-muted-foreground">
          Monitor inventaris sekolah secara real-time dengan integrasi Firebase Realtime Database.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Barang"
          description="Jumlah unit yang tercatat dalam sistem"
          value={totalItems}
          icon={<Package2 className="h-5 w-5" />}
        />
        <StatCard
          title="Nilai Aset"
          description="Akumulasi nilai barang dan tanah"
          value={`Rp ${totalAssetValue.toLocaleString("id-ID")}`}
          icon={<PiggyBank className="h-5 w-5" />}
        />
        <StatCard
          title="Ruang Layak"
          description="Ruang dengan kondisi baik"
          value={`${healthyRooms} / ${rooms.length}`}
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          title="Peminjaman Aktif"
          description="Transaksi yang masih berlangsung"
          value={activeLoans}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <InventoryDistribution items={items} rooms={rooms} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Ringkasan Sarpras</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Barang tercatat</p>
                <p className="text-xl font-semibold text-foreground">{items.length} jenis</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total ruang</p>
                <p className="text-xl font-semibold text-foreground">{rooms.length} ruang</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kepemilikan tanah</p>
                <p className="text-xl font-semibold text-foreground">{lands.length} lokasi</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <ActivityTimeline loans={loans} />
      </div>
    </div>
  );
};

export default DashboardPage;
