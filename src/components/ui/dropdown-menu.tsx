import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, asChild }) => {
  return <div>{children}</div>;
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = "start",
  className
}) => {
  return (
    <div
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  className
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  children,
  checked = false,
  onCheckedChange,
  className
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
};

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ children, className }) => {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  );
};

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className }) => {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};