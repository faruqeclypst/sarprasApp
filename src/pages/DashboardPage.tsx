import { 
  Package2, 
  Wallet, 
  Building2, 
  Activity, 
  Mail, 
  MailOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useInventory } from "../context/InventoryContext";
import { cn } from "../lib/utils";

const DashboardPage = () => {
  const { items, rooms, lands, loans, incomingMail, outgoingMail } = useInventory();

  // Calculate real statistics from actual data
  const totalItems = items.length;
  const totalAssetValue = 0;
  const healthyRooms = rooms.filter(room => room.condition === "baik").length;
  const totalRooms = rooms.length;
  const activeLoans = loans.filter(loan => loan.status === "dipinjam").length;
  const totalIncomingMail = incomingMail.length;
  const totalOutgoingMail = outgoingMail.length;
  const unreadIncomingMail = incomingMail.filter(mail => mail.status === "belum_dibaca").length;
  const pendingOutgoingMail = outgoingMail.filter(mail => mail.status === "draft").length;

  const roomHealthPercentage = totalRooms > 0 ? Math.round((healthyRooms / totalRooms) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Dashboard Sarpras
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Monitor dan kelola inventaris sekolah
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-green-600 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Sistem Aktif
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Package2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-sm text-muted-foreground">Items</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{totalItems}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Barang</div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="text-xs sm:text-sm text-muted-foreground">Value</span>
            </div>
            <div className="text-base sm:text-xl font-bold">
              {totalAssetValue > 1000000 
                ? `${(totalAssetValue / 1000000).toFixed(1)}M` 
                : `${(totalAssetValue / 1000).toFixed(0)}K`}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Nilai Aset</div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span className="text-xs sm:text-sm text-muted-foreground">Health</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{roomHealthPercentage}%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Ruang Sehat</div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              <span className="text-xs sm:text-sm text-muted-foreground">Active</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{activeLoans}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Peminjaman</div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-4">
        {/* Left Column - Summary */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          {/* Asset Overview Card */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold">Ringkasan Aset</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 sm:gap-4 grid-cols-3 sm:grid-cols-5">
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{totalItems}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Barang</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{totalRooms}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Ruangan</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-lg sm:text-2xl font-bold">{lands.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Tanah & Bangunan</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:block hidden">
                  <p className="text-lg sm:text-2xl font-bold">{totalIncomingMail}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">S. Masuk</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:block hidden">
                  <p className="text-lg sm:text-2xl font-bold">{totalOutgoingMail}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">S. Keluar</p>
                </div>
              </div>
              {/* Mobile mail stats */}
              <div className="grid gap-3 grid-cols-2 mt-3 sm:hidden">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold">{totalIncomingMail}</p>
                  <p className="text-xs text-muted-foreground mt-1">Surat Masuk</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-lg font-bold">{totalOutgoingMail}</p>
                  <p className="text-xs text-muted-foreground mt-1">Surat Keluar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Condition Analysis */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-semibold">Kondisi Ruangan</CardTitle>
                <Badge variant="outline" className="text-xs">{totalRooms}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 sm:gap-4 grid-cols-3">
                <div className="text-center p-4 sm:p-6 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
                    {rooms.filter(room => room.condition === "baik").length}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Baik</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {rooms.filter(room => room.condition === "cukup").length}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">Cukup</p>
                </div>
                <div className="text-center p-4 sm:p-6 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <p className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400">
                    {rooms.filter(room => room.condition === "rusak").length}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Rusak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6 sm:space-y-8">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold">Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Peminjaman</span>
                </div>
                <span className="text-lg font-bold">{activeLoans}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Ruang Sehat</span>
                </div>
                <span className="text-lg font-bold">{roomHealthPercentage}%</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">S. Masuk</span>
                </div>
                <span className="text-lg font-bold">{totalIncomingMail}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <MailOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">S. Keluar</span>
                </div>
                <span className="text-lg font-bold">{totalOutgoingMail}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
