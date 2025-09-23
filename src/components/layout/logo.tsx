import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-12 w-12 object-contain"
        />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">SIM Sarpras</p>
        <p className="text-xs text-muted-foreground">SMAN MODAL BANGSA</p>
      </div>
    </div>
  );
};

export default Logo;
