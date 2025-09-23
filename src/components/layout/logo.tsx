import { GraduationCap } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">SIM Sarpras</p>
        <p className="text-xs text-muted-foreground">Inventaris Sekolah Terpadu</p>
      </div>
    </div>
  );
};

export default Logo;
