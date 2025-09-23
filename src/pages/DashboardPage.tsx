import { Package2, PiggyBank, Building2, Activity } from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const DashboardPage = () => {
  // Using specific data values as provided
  const totalItems = 7;
  const totalAssetValue = 10400000;
  const healthyRooms = 1;
  const totalRooms = 2;
  const activeLoans = 1;

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 pt-1 sm:pt-2 px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground leading-tight">Selamat datang di Dashboard Sarpras</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Monitor inventaris sekolah secara real-time dengan integrasi Firebase Realtime Database.
        </p>
      </div>

      {/* Stats Grid - Responsive layout with equal height cards */}
      <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4 items-stretch">
        <div className="h-full">
          <StatCard
            title="Total Barang"
            description="Jumlah unit yang tercatat dalam sistem"
            value={totalItems}
            icon={<Package2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            gradient="from-emerald-500/15 to-teal-500/15"
          />
        </div>
        <div className="h-full">
          <StatCard
            title="Nilai Aset"
            description="Akumulasi nilai barang dan tanah"
            value={`Rp ${totalAssetValue.toLocaleString("id-ID")}`}
            icon={<PiggyBank className="h-4 w-4 sm:h-5 sm:w-5" />}
            gradient="from-amber-500/15 to-orange-500/15"
          />
        </div>
        <div className="h-full">
          <StatCard
            title="Ruang Layak"
            description="Ruang dengan kondisi baik"
            value={`${healthyRooms} / ${totalRooms}`}
            icon={<Building2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            gradient="from-blue-500/15 to-indigo-500/15"
          />
        </div>
        <div className="h-full">
          <StatCard
            title="Peminjaman Aktif"
            description="Transaksi yang masih berlangsung"
            value={activeLoans}
            icon={<Activity className="h-4 w-4 sm:h-5 sm:w-5" />}
            gradient="from-purple-500/15 to-pink-500/15"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Summary Card with specific data */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50/80 to-slate-100/40 backdrop-blur-xl shadow-lg">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5" />

            {/* Animated background elements - responsive */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-bl from-white/30 to-transparent rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 lg:-translate-y-20 lg:translate-x-20" />
            <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12 lg:translate-y-16 lg:-translate-x-16" />

            <CardHeader className="relative pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                Ringkasan Sarpras
              </CardTitle>
            </CardHeader>
            <CardContent className="relative grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-3 items-stretch">
              <div className="group cursor-pointer text-center sm:text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/60 to-emerald-100/30 hover:from-emerald-100/60 hover:to-emerald-200/30 active:from-emerald-200/60 active:to-emerald-300/30 transition-all duration-300 border border-emerald-200/30 h-full flex flex-col justify-center">
                <p className="text-xs sm:text-sm text-emerald-600/80 font-medium mb-1 sm:mb-2">Barang tercatat</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700">{totalItems}</p>
                <p className="text-xs text-emerald-600/60 mt-1">jenis barang</p>
              </div>
              <div className="group cursor-pointer text-center sm:text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/60 to-blue-100/30 hover:from-blue-100/60 hover:to-blue-200/30 active:from-blue-200/60 active:to-blue-300/30 transition-all duration-300 border border-blue-200/30 h-full flex flex-col justify-center">
                <p className="text-xs sm:text-sm text-blue-600/80 font-medium mb-1 sm:mb-2">Total ruang</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700">{totalRooms}</p>
                <p className="text-xs text-blue-600/60 mt-1">ruang kelas</p>
              </div>
              <div className="group cursor-pointer text-center sm:text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50/60 to-amber-100/30 hover:from-amber-100/60 hover:to-amber-200/30 active:from-amber-200/60 active:to-amber-300/30 transition-all duration-300 border border-amber-200/30 h-full flex flex-col justify-center">
                <p className="text-xs sm:text-sm text-amber-600/80 font-medium mb-1 sm:mb-2">Kepemilikan tanah</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-700">3</p>
                <p className="text-xs text-amber-600/60 mt-1">lokasi tanah</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Activity Timeline with mock data */}
        <div className="h-full">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50/80 to-slate-100/40 backdrop-blur-xl shadow-lg h-full flex flex-col">
            <CardHeader className="relative pb-3 sm:pb-4 flex-shrink-0">
              <CardTitle className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                Aktivitas Terkini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 flex-1">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Peminjaman aktif</p>
                  <p className="text-xs text-muted-foreground">1 transaksi berlangsung</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Ruang dalam kondisi baik</p>
                  <p className="text-xs text-muted-foreground">1 dari 2 ruang tersedia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
