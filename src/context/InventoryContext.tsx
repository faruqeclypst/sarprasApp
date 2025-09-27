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
import r2Service from "../lib/r2";
import type { InventoryItem, Land, Loan, Room, IncomingMail, OutgoingMail } from "../types/inventory";
import { useAuth } from "./AuthContext";

export interface InventoryContextValue {
  items: InventoryItem[];
  rooms: Room[];
  lands: Land[];
  loans: Loan[];
  incomingMail: IncomingMail[];
  outgoingMail: OutgoingMail[];
  allItems: InventoryItem[];
  allRooms: Room[];
  allLands: Land[];
  allLoans: Loan[];
  allIncomingMail: IncomingMail[];
  allOutgoingMail: OutgoingMail[];
  search: string;
  setSearch: (value: string) => void;
  createItem: (payload: Omit<InventoryItem, "id">) => Promise<void>;
  createRoom: (payload: Omit<Room, "id">) => Promise<void>;
  createLand: (payload: Omit<Land, "id">) => Promise<void>;
  createLoan: (payload: Omit<Loan, "id">) => Promise<void>;
  createIncomingMail: (payload: Omit<IncomingMail, "id">) => Promise<void>;
  createOutgoingMail: (payload: Omit<OutgoingMail, "id">) => Promise<void>;
  updateItem: (id: string, payload: Partial<InventoryItem>) => Promise<void>;
  updateRoom: (id: string, payload: Partial<Room>) => Promise<void>;
  updateLand: (id: string, payload: Partial<Land>) => Promise<void>;
  updateLoan: (id: string, payload: Partial<Loan>) => Promise<void>;
  updateIncomingMail: (id: string, payload: Partial<IncomingMail>) => Promise<void>;
  updateOutgoingMail: (id: string, payload: Partial<OutgoingMail>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  deleteLand: (id: string) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  deleteIncomingMail: (id: string) => Promise<void>;
  deleteOutgoingMail: (id: string) => Promise<void>;
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
  const [incomingMail, setIncomingMail] = useState<IncomingMail[]>([]);
  const [outgoingMail, setOutgoingMail] = useState<OutgoingMail[]>([]);
  const [search, setSearch] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItems([]);
      setRooms([]);
      setLands([]);
      setLoans([]);
      setIncomingMail([]);
      setOutgoingMail([]);
      setSearch("");
      return;
    }

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
      setIncomingMail(
        Object.entries<IncomingMail>(value.incomingMail ?? {}).map(([id, mail]) => ({
          ...mail,
          id,
        }))
      );
      setOutgoingMail(
        Object.entries<OutgoingMail>(value.outgoingMail ?? {}).map(([id, mail]) => ({
          ...mail,
          id,
        }))
      );
    });

    return () => unsubscribe();
  }, [user]);

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

  const filteredIncomingMail = useMemo(() => {
    if (!search) return incomingMail;
    const lowered = search.toLowerCase();
    return incomingMail.filter((mail) =>
      [
        mail.mailNumber,
        mail.sender,
        mail.recipient,
        mail.subject,
        mail.content,
        mail.notes ?? ""
      ].some((value) => value.toLowerCase().includes(lowered))
    );
  }, [incomingMail, search]);

  const filteredOutgoingMail = useMemo(() => {
    if (!search) return outgoingMail;
    const lowered = search.toLowerCase();
    return outgoingMail.filter((mail) =>
      [
        mail.mailNumber,
        mail.sender,
        mail.recipient,
        mail.subject,
        mail.content,
        mail.notes ?? ""
      ].some((value) => value.toLowerCase().includes(lowered))
    );
  }, [outgoingMail, search]);

  const createEntity = useCallback(
    async <T extends object>(collection: string, payload: T) => {
      if (!user) {
        throw new Error("Pengguna belum masuk");
      }
      const newRef = push(collectionRef(collection));
      await set(newRef, payload);
    },
    [user]
  );

  const updateEntity = useCallback(
    async <T extends object>(collection: string, id: string, payload: T) => {
      if (!user) {
        throw new Error("Pengguna belum masuk");
      }
      await update(ref(database, `inventory/${collection}/${id}`), payload);
    },
    [user]
  );

  const deleteEntity = useCallback(
    async (collection: string, id: string) => {
      if (!user) {
        throw new Error("Pengguna belum masuk");
      }

      // Get the data before deleting to check for associated files
      const entityRef = ref(database, `inventory/${collection}/${id}`);
      const snapshot = await new Promise<any>((resolve, reject) => {
        onValue(entityRef, (snap) => {
          resolve(snap.val());
        }, reject, { onlyOnce: true });
      });

      // Delete associated files if they exist
      // Check for both photoUrl (used by inventory items) and attachmentUrl (used by mail)
      const fileUrl = snapshot.photoUrl || snapshot.attachmentUrl;
      if (snapshot && fileUrl && r2Service.isR2Url(fileUrl)) {
        try {
          const deleteResult = await r2Service.deleteFile(fileUrl);
          if (deleteResult) {
            console.log(`Successfully deleted associated file for ${collection}/${id}:`, fileUrl);
          } else {
            console.warn(`File deletion returned false for ${collection}/${id}:`, fileUrl);
          }
        } catch (error) {
          console.error(`Failed to delete associated file for ${collection}/${id}:`, error);
          // Continue with deletion even if file deletion fails
        }
      }

      // Delete the entity from database
      await remove(entityRef);
    },
    [user]
  );

  const value: InventoryContextValue = {
    items: filteredItems,
    rooms: filteredRooms,
    lands: filteredLands,
    loans: filteredLoans,
    incomingMail: filteredIncomingMail,
    outgoingMail: filteredOutgoingMail,
    allItems: items,
    allRooms: rooms,
    allLands: lands,
    allLoans: loans,
    allIncomingMail: incomingMail,
    allOutgoingMail: outgoingMail,
    search,
    setSearch,
    createItem: (payload) => createEntity("items", payload),
    createRoom: (payload) => createEntity("rooms", payload),
    createLand: (payload) => createEntity("lands", payload),
    createLoan: (payload) => createEntity("loans", payload),
    createIncomingMail: (payload) => createEntity("incomingMail", payload),
    createOutgoingMail: (payload) => createEntity("outgoingMail", payload),
    updateItem: (id, payload) => updateEntity("items", id, payload),
    updateRoom: (id, payload) => updateEntity("rooms", id, payload),
    updateLand: (id, payload) => updateEntity("lands", id, payload),
    updateLoan: (id, payload) => updateEntity("loans", id, payload),
    updateIncomingMail: (id, payload) => updateEntity("incomingMail", id, payload),
    updateOutgoingMail: (id, payload) => updateEntity("outgoingMail", id, payload),
    deleteItem: (id) => deleteEntity("items", id),
    deleteRoom: (id) => deleteEntity("rooms", id),
    deleteLand: (id) => deleteEntity("lands", id),
    deleteLoan: (id) => deleteEntity("loans", id),
    deleteIncomingMail: (id) => deleteEntity("incomingMail", id),
    deleteOutgoingMail: (id) => deleteEntity("outgoingMail", id),
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
