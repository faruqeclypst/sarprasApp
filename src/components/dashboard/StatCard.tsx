import { ReactNode } from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
  title: string;
  description: string;
  value: ReactNode;
  icon: ReactNode;
}

const StatCard = ({ title, description, value, icon }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="text-primary">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{value}</div>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
