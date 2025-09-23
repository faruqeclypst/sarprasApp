export interface Room {
  id: string;
  name: string;
  buildingCode: string;
  photoUrl?: string;
  condition: "baik" | "cukup" | "rusak";
  notes?: string;
}

export interface Land {
  id: string;
  locationName: string;
  locationCode: string;
  area: number;
  acquisitionYear: number;
  address: string;
  certificateNumber: string;
  origin: string;
  price: number;
  description?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  brand: string;
  specification: string;
  quantity: number;
  totalPrice: number;
  source: string;
  roomId: string;
  photoUrl?: string;
  condition: "baik" | "cukup" | "rusak";
}

export interface Loan {
  id: string;
  loanDate: string;
  returnDate: string;
  itemId: string;
  itemName: string;
  borrowerName: string;
  photoUrl?: string;
  notes?: string;
}

export interface InventorySnapshot {
  items: Record<string, InventoryItem>;
  rooms: Record<string, Room>;
  lands: Record<string, Land>;
  loans: Record<string, Loan>;
}

export type InventoryEntity = InventoryItem | Room | Land | Loan;
