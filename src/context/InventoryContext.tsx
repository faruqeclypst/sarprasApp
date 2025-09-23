import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onValue, push, ref, remove, set, update } from "firebase/database";

import { database } from "../lib/firebase";
import type { InventoryItem, Land, Loan, Room } from "../types/inventory";

export interface InventoryContextValue {
  items: InventoryItem[];
  rooms: Room[];
  lands: Land[];
  loans: Loan[];
  allItems: InventoryItem[];
  allRooms: Room[];
  allLands: Land[];
  allLoans: Loan[];
  search: string;
  setSearch: (value: string) => void;
  createItem: (payload: Omit<InventoryItem, "id">) => Promise<void>;
  createRoom: (payload: Omit<Room, "id">) => Promise<void>;
  createLand: (payload: Omit<Land, "id">) => Promise<void>;
  createLoan: (payload: Omit<Loan, "id">) => Promise<void>;
  updateItem: (id: string, payload: Partial<InventoryItem>) => Promise<void>;
  updateRoom: (id: string, payload: Partial<Room>) => Promise<void>;
  updateLand: (id: string, payload: Partial<Land>) => Promise<void>;
  updateLoan: (id: string, payload: Partial<Loan>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  deleteLand: (id: string) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

const collectionRef = (collection: string) => ref(database, `inventory/${collection}`);

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onValue(ref(database, "inventory"), (snapshot) => {
      const value = snapshot.val() ?? {};
      setItems(
        Object.entries<InventoryItem>(value.items ?? {}).map(([id, item]) => ({
          ...item,
          id,
        }))
      );
      setRooms(
        Object.entries<Room>(value.rooms ?? {}).map(([id, room]) => ({
          ...room,
          id,
        }))
      );
      setLands(
        Object.entries<Land>(value.lands ?? {}).map(([id, land]) => ({
          ...land,
          id,
        }))
      );
      setLoans(
        Object.entries<Loan>(value.loans ?? {}).map(([id, loan]) => ({
          ...loan,
          id,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const lowered = search.toLowerCase();
    return items.filter((item) =>
      [item.code, item.name, item.brand, item.specification, item.source]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(lowered))
    );
  }, [items, search]);

  const filteredRooms = useMemo(() => {
    if (!search) return rooms;
    const lowered = search.toLowerCase();
    return rooms.filter((room) =>
      [room.name, room.buildingCode, room.notes ?? ""].some((value) =>
        value.toLowerCase().includes(lowered)
      )
    );
  }, [rooms, search]);

  const filteredLands = useMemo(() => {
    if (!search) return lands;
    const lowered = search.toLowerCase();
    return lands.filter((land) =>
      [
        land.locationName,
        land.locationCode,
        land.address,
        land.certificateNumber,
        land.origin,
        land.description ?? "",
      ].some((value) => value.toLowerCase().includes(lowered))
    );
  }, [lands, search]);

  const filteredLoans = useMemo(() => {
    if (!search) return loans;
    const lowered = search.toLowerCase();
    return loans.filter((loan) =>
      [loan.borrowerName, loan.itemName, loan.notes ?? ""].some((value) =>
        value.toLowerCase().includes(lowered)
      )
    );
  }, [loans, search]);

  const createEntity = useCallback(async <T extends object>(collection: string, payload: T) => {
    const newRef = push(collectionRef(collection));
    await set(newRef, payload);
  }, []);

  const updateEntity = useCallback(async <T extends object>(collection: string, id: string, payload: T) => {
    await update(ref(database, `inventory/${collection}/${id}`), payload);
  }, []);

  const deleteEntity = useCallback(async (collection: string, id: string) => {
    await remove(ref(database, `inventory/${collection}/${id}`));
  }, []);

  const value: InventoryContextValue = {
    items: filteredItems,
    rooms: filteredRooms,
    lands: filteredLands,
    loans: filteredLoans,
    allItems: items,
    allRooms: rooms,
    allLands: lands,
    allLoans: loans,
    search,
    setSearch,
    createItem: (payload) => createEntity("items", payload),
    createRoom: (payload) => createEntity("rooms", payload),
    createLand: (payload) => createEntity("lands", payload),
    createLoan: (payload) => createEntity("loans", payload),
    updateItem: (id, payload) => updateEntity("items", id, payload),
    updateRoom: (id, payload) => updateEntity("rooms", id, payload),
    updateLand: (id, payload) => updateEntity("lands", id, payload),
    updateLoan: (id, payload) => updateEntity("loans", id, payload),
    deleteItem: (id) => deleteEntity("items", id),
    deleteRoom: (id) => deleteEntity("rooms", id),
    deleteLand: (id) => deleteEntity("lands", id),
    deleteLoan: (id) => deleteEntity("loans", id),
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory harus digunakan di dalam InventoryProvider");
  }

  return context;
};
