import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { Loan } from "../../types/inventory";

interface ActivityTimelineProps {
  loans: Loan[];
}

const ActivityTimeline = ({ loans }: ActivityTimelineProps) => {
  const recentLoans = loans.slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Aktivitas Peminjaman Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentLoans.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada riwayat peminjaman.</p>
        ) : (
          recentLoans.map((loan, index) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{loan.borrowerName}</p>
                  <Badge variant={new Date(loan.returnDate) < new Date() ? "destructive" : "secondary"}>
                    {new Date(loan.loanDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Meminjam <span className="font-medium text-foreground">{loan.itemName}</span> hingga {" "}
                  {new Date(loan.returnDate).toLocaleDateString("id-ID")}
                </p>
                {loan.notes ? <p className="text-xs text-muted-foreground">Catatan: {loan.notes}</p> : null}
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
