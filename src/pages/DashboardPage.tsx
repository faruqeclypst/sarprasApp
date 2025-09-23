import { Package2, PiggyBank, Building2, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useInventory } from "../context/InventoryContext";

const DashboardPage = () => {
  const { items, rooms, lands, loans } = useInventory();

  // Calculate real statistics from actual data
  const totalItems = items.length;
  const totalAssetValue = items.reduce((sum, item) => sum + item.totalPrice, 0) +
                         lands.reduce((sum, land) => sum + land.price, 0);
  const healthyRooms = rooms.filter(room => room.condition === "baik").length;
  const totalRooms = rooms.length;
  const activeLoans = loans.filter(loan => loan.status === "dipinjam").length;

  const roomHealthPercentage = totalRooms > 0 ? Math.round((healthyRooms / totalRooms) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dashboard Sarpras</h2>
          <p className="text-sm text-muted-foreground">Monitor inventaris sekolah</p>
        </div>
      </div>

      {/* Stats Grid - Consistent with other pages */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {/* Total Items Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Barang</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </CardContent>
        </Card>

        {/* Asset Value Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Nilai Aset</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                Rp {totalAssetValue.toLocaleString('id-ID')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Room Health Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold text-purple-600">{roomHealthPercentage}%</div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Kesehatan Ruang</p>
              <p className="text-sm sm:text-base font-semibold text-gray-900">{healthyRooms}/{totalRooms}</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Loans Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Peminjaman Aktif</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{activeLoans}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Consistent structure */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column - Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Ringkasan Aset
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                <p className="text-sm text-gray-600">Barang</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{totalRooms}</p>
                <p className="text-sm text-gray-600">Ruangan</p>
              </div>
              <div className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{lands.length}</p>
                <p className="text-sm text-gray-600">Tanah</p>
              </div>
            </CardContent>
          </Card>

          {/* Room Condition */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Kondisi Ruangan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {rooms.filter(room => room.condition === "baik").length}
                  </p>
                  <p className="text-sm text-gray-600">Baik</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-600">
                    {rooms.filter(room => room.condition === "cukup").length}
                  </p>
                  <p className="text-sm text-gray-600">Cukup</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">
                    {rooms.filter(room => room.condition === "rusak").length}
                  </p>
                  <p className="text-sm text-gray-600">Rusak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity */}
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Peminjaman Aktif</p>
                  <p className="text-sm text-gray-600">{activeLoans} transaksi</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Kesehatan Ruangan</p>
                  <p className="text-sm text-gray-600">{roomHealthPercentage}% baik</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Total Nilai Aset</p>
                  <p className="text-sm text-gray-600">Rp {totalAssetValue.toLocaleString('id-ID')}</p>
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
