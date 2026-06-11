import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut as secondarySignOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, hasFirebaseEnv, storage } from "@/lib/firebase/client";
import type { AuthProfile, OrderRecord, SignatureBoxRecord, OrderProduct } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const USERS_COLLECTION = "users";
const ORDERS_COLLECTION = "orders";

function requireDb() {
  if (!db || !hasFirebaseEnv) {
    throw new Error("Firebase environment variables are missing.");
  }

  return db;
}

function buildOrderNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `NTD-${year}-${suffix}`;
}

export async function upsertUserProfile(profile: AuthProfile) {
  const firestore = requireDb();
  await setDoc(doc(firestore, USERS_COLLECTION, profile.uid), profile, { merge: true });
}

export async function getUserProfile(uid: string) {
  const firestore = requireDb();
  const snap = await getDoc(doc(firestore, USERS_COLLECTION, uid));
  return snap.exists() ? (snap.data() as AuthProfile) : null;
}

export async function getUserProfileByEmail(email: string) {
  const firestore = requireDb();
  const usersQuery = query(collection(firestore, USERS_COLLECTION), where("email", "==", email));
  const snap = await getDocs(usersQuery);
  return snap.empty ? null : (snap.docs[0].data() as AuthProfile);
}

export async function deleteUserProfile(uid: string) {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, USERS_COLLECTION, uid));
}

export interface CreateOrderInput {
  customer: string;
  company: string;
  quantity: number;
  occasion: string;
  address?: string;
  total: number;
  items: number;
  createdByUid: string;
  createdByRole: AuthProfile["role"];
  customerId: string;
  boxType?: OrderRecord["boxType"];
  signatureBoxId?: number | string;
  products: NonNullable<OrderRecord["products"]>;
  industry?: string;
  message?: string;
  messageTemplate?: string;
  logoChoice?: string;
  ribbonTheme?: string;
}

export async function createOrder(input: CreateOrderInput) {
  const firestore = requireDb();
  const order: Omit<OrderRecord, "id"> = {
    orderNumber: buildOrderNumber(),
    customer: input.customer,
    company: input.company,
    occasion: input.occasion,
    items: input.items,
    quantity: input.quantity,
    total: input.total,
    status: "pending",
    deliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      .toISOString()
      .slice(0, 10),
    createdAt: new Date().toISOString(),
    address: input.address ?? "To be confirmed",
    customerId: input.customerId,
    createdByUid: input.createdByUid,
    createdByRole: input.createdByRole,
    boxType: input.boxType,
    signatureBoxId: input.signatureBoxId,
    products: input.products,
    industry: input.industry,
    message: input.message,
    messageTemplate: input.messageTemplate,
    logoChoice: input.logoChoice,
    ribbonTheme: input.ribbonTheme,
  };

  const ref = await addDoc(collection(firestore, ORDERS_COLLECTION), {
    ...order,
    serverCreatedAt: serverTimestamp(),
  });

  return {
    id: ref.id,
    ...order,
  } satisfies OrderRecord;
}

function mapOrderSnapshot(
  callback: (orders: OrderRecord[]) => void,
): (snap: QuerySnapshot) => void {
  return (snap) => {
    callback(
      snap.docs.map((entry: QueryDocumentSnapshot) => ({
        id: entry.id,
        ...(entry.data() as Omit<OrderRecord, "id">),
      })),
    );
  };
}

export function subscribeOrders(callback: (orders: OrderRecord[]) => void): Unsubscribe {
  if (!db || !hasFirebaseEnv) {
    callback([]);
    return () => undefined;
  }

  const ordersQuery = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    ordersQuery,
    mapOrderSnapshot(callback),
    (err) => {
      console.warn("subscribeOrders error bypassed safely:", err);
      callback([]);
    }
  );
}

export function subscribeOrdersForCustomer(
  customerId: string,
  callback: (orders: OrderRecord[]) => void,
): Unsubscribe {
  if (!db || !hasFirebaseEnv) {
    callback([]);
    return () => undefined;
  }

  const ordersQuery = query(collection(db, ORDERS_COLLECTION), where("customerId", "==", customerId));

  return onSnapshot(
    ordersQuery,
    (snap) => {
      const mapped = snap.docs
        .map((entry) => ({
          id: entry.id,
          ...(entry.data() as Omit<OrderRecord, "id">),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      callback(mapped);
    },
    (err) => {
      console.warn("subscribeOrdersForCustomer error bypassed safely:", err);
      callback([]);
    }
  );
}

export function subscribeOrderById(
  id: string,
  callback: (order: OrderRecord | null) => void,
): Unsubscribe {
  if (!db || !hasFirebaseEnv) {
    callback(null);
    return () => undefined;
  }

  return onSnapshot(
    doc(db, ORDERS_COLLECTION, id),
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snap.id,
        ...(snap.data() as Omit<OrderRecord, "id">),
      });
    },
    (err) => {
      console.warn("subscribeOrderById error bypassed safely:", err);
      callback(null);
    }
  );
}

export async function updateOrderStatus(id: string, status: OrderRecord["status"]) {
  const firestore = requireDb();
  await setDoc(doc(firestore, ORDERS_COLLECTION, id), { status }, { merge: true });
}

export async function updateOrderPricing(id: string, products: OrderProduct[], total: number) {
  const firestore = requireDb();
  await setDoc(doc(firestore, ORDERS_COLLECTION, id), { products, total }, { merge: true });
}

export async function updateOrderFollowUps(id: string, followUps: any[]) {
  const firestore = requireDb();
  await setDoc(doc(firestore, ORDERS_COLLECTION, id), { followUps }, { merge: true });
}

export async function getAllUsers() {
  const firestore = requireDb();
  const snap = await getDocs(collection(firestore, USERS_COLLECTION));
  return snap.docs.map((d) => d.data() as AuthProfile);
}

export async function updateUserRole(uid: string, role: AuthProfile["role"]) {
  const firestore = requireDb();
  await setDoc(doc(firestore, USERS_COLLECTION, uid), { role }, { merge: true });
}

const BOXES_COLLECTION = "signature_boxes";
const LOCAL_STORAGE_BOXES_KEY = "nutado_custom_signature_boxes";

function getLocalBoxes(): SignatureBoxRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOXES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBoxes(boxes: SignatureBoxRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_BOXES_KEY, JSON.stringify(boxes));
  } catch {}
}

export async function updateSignatureBox(id: string, box: Partial<SignatureBoxRecord>) {
  try {
    const firestore = requireDb();
    await setDoc(doc(firestore, BOXES_COLLECTION, id), box, { merge: true });
    
    // Update local storage too if it's stored there
    const local = getLocalBoxes();
    const idx = local.findIndex((b) => b.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...box };
      saveLocalBoxes(local);
    }
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_boxes_updated"));
    }
  } catch (err) {
    console.warn("Failed to update signature box in Firestore. Updating LocalStorage.", err);
    const local = getLocalBoxes();
    const idx = local.findIndex((b) => b.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...box };
      saveLocalBoxes(local);
    }
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_boxes_updated"));
    }
  }
}

export async function createSignatureBox(box: Omit<SignatureBoxRecord, "id">) {
  try {
    const firestore = requireDb();
    const ref = await addDoc(collection(firestore, BOXES_COLLECTION), box);
    return { id: ref.id, ...box };
  } catch (err) {
    console.warn("Failed to write signature box to Firestore. Falling back to LocalStorage.", err);
    const local = getLocalBoxes();
    const newBox: SignatureBoxRecord = {
      id: `local_${Date.now()}`,
      ...box,
    };
    local.push(newBox);
    saveLocalBoxes(local);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_boxes_updated"));
    }
    return newBox;
  }
}

export function subscribeSignatureBoxes(callback: (boxes: SignatureBoxRecord[]) => void): Unsubscribe {
  let firestoreBoxes: SignatureBoxRecord[] = [];
  
  const triggerCombined = () => {
    const local = getLocalBoxes();
    const combined = [...firestoreBoxes];
    for (const lBox of local) {
      if (!combined.some(fb => fb.id === lBox.id)) {
        combined.push(lBox);
      }
    }
    callback(combined);
  };

  let handleLocalUpdate = () => {
    triggerCombined();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("nutado_boxes_updated", handleLocalUpdate);
  }

  let unsubFirestore = () => {};
  if (db && hasFirebaseEnv) {
    const boxesQuery = query(collection(db, BOXES_COLLECTION), orderBy("createdAt", "desc"));
    unsubFirestore = onSnapshot(
      boxesQuery,
      (snap) => {
        firestoreBoxes = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SignatureBoxRecord, "id">),
        }));
        triggerCombined();
      },
      (error) => {
        console.warn("Firestore signature_boxes read error, loading LocalStorage only:", error);
        triggerCombined();
      }
    );
  } else {
    triggerCombined();
  }

  return () => {
    unsubFirestore();
    if (typeof window !== "undefined") {
      window.removeEventListener("nutado_boxes_updated", handleLocalUpdate);
    }
  };
}

// ─── Products Persistence ───────────────────────────────────────────
const PRODUCTS_COLLECTION = "products";
const LOCAL_STORAGE_PRODUCTS_KEY = "nutado_custom_products";

function getLocalProducts(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalProducts(products: any[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
}

export async function createProduct(product: Omit<any, "id">) {
  const newId = `prod_${Date.now()}`;
  const record = {
    ...product,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  try {
    const firestore = requireDb();
    await setDoc(doc(firestore, PRODUCTS_COLLECTION, newId), record);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_products_updated"));
    }
    return record;
  } catch (err) {
    console.warn("Failed to write product to Firestore. Falling back to LocalStorage.", err);
    const local = getLocalProducts();
    local.push(record);
    saveLocalProducts(local);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_products_updated"));
    }
    return record;
  }
}

export async function updateProduct(id: string | number, product: Partial<any>) {
  try {
    const firestore = requireDb();
    await setDoc(doc(firestore, PRODUCTS_COLLECTION, String(id)), product, { merge: true });
    
    const local = getLocalProducts();
    const idx = local.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...product };
      saveLocalProducts(local);
    }
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_products_updated"));
    }
  } catch (err) {
    console.warn("Failed to update product in Firestore. Updating LocalStorage.", err);
    const local = getLocalProducts();
    const idx = local.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...product };
      saveLocalProducts(local);
    }
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_products_updated"));
    }
  }
}

export async function deleteProduct(id: string | number) {
  try {
    const firestore = requireDb();
    await setDoc(doc(firestore, PRODUCTS_COLLECTION, String(id)), { deleted: true }, { merge: true });
    
    const local = getLocalProducts();
    const filtered = local.filter((p) => String(p.id) !== String(id));
    saveLocalProducts(filtered);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_products_updated"));
    }
  } catch (err) {
    console.warn("Failed to delete product in Firestore. Deleting from LocalStorage.", err);
    const local = getLocalProducts();
    const filtered = local.filter((p) => String(p.id) !== String(id));
    saveLocalProducts(filtered);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nutado_products_updated"));
    }
  }
}

export function subscribeProducts(callback: (products: any[]) => void): Unsubscribe {
  let firestoreProducts: any[] = [];
  
  const triggerCombined = () => {
    const local = getLocalProducts();
    
    // Start with static preset mock products
    const combined = [...MOCK_PRODUCTS];
    
    // Merge firestore custom products
    firestoreProducts.forEach(fp => {
      const idx = combined.findIndex(cp => String(cp.id) === String(fp.id));
      if (idx !== -1) {
        combined[idx] = { ...combined[idx], ...fp };
      } else {
        combined.unshift(fp); // Add newly created custom products to the top
      }
    });

    // Merge local storage custom products
    local.forEach(lp => {
      const idx = combined.findIndex(cp => String(cp.id) === String(lp.id));
      if (idx !== -1) {
        combined[idx] = { ...combined[idx], ...lp };
      } else {
        combined.unshift(lp); // Add newly created custom products to the top
      }
    });
    
    callback(combined);
  };

  const handleLocalUpdate = () => {
    triggerCombined();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("nutado_products_updated", handleLocalUpdate);
  }

  let unsubFirestore = () => {};
  if (db && hasFirebaseEnv) {
    const productsQuery = query(collection(db, PRODUCTS_COLLECTION));
    unsubFirestore = onSnapshot(
      productsQuery,
      (snap) => {
        firestoreProducts = snap.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
          }))
          .filter((p: any) => !p.deleted);
        triggerCombined();
      },
      (error) => {
        console.warn("Firestore products read error, loading LocalStorage & Mock only:", error);
        triggerCombined();
      }
    );
  } else {
    triggerCombined();
  }

  return () => {
    unsubFirestore();
    if (typeof window !== "undefined") {
      window.removeEventListener("nutado_products_updated", handleLocalUpdate);
    }
  };
}

export async function adminCreateClient(input: {
  name: string;
  company: string;
  email: string;
  phone?: string;
  password?: string;
}) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize secondary app instance to prevent disrupting the admin auth session
  const secondaryApp = getApps().find((app) => app.name === "Secondary") 
    || initializeApp(firebaseConfig, "Secondary");
  
  const secondaryAuth = getAuth(secondaryApp);
  
  // 1. Create user in Firebase Auth
  const credential = await createUserWithEmailAndPassword(
    secondaryAuth,
    input.email,
    input.password || "Nutado123!" // default fallback password if not provided
  );

  // 2. Set client display name
  await updateProfile(credential.user, { displayName: input.name });

  // 3. Create the Firestore profile document using secondary db (authenticated as client self)
  const secondaryDb = getFirestore(secondaryApp);
  const profile: AuthProfile = {
    uid: credential.user.uid,
    email: input.email,
    name: input.name,
    company: input.company,
    phone: input.phone || "",
    role: "client",
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(secondaryDb, USERS_COLLECTION, profile.uid), profile, { merge: true });

  // 4. Cleanly sign out of the secondary auth session
  await secondarySignOut(secondaryAuth);

  return profile;
}

export async function adminCreateEmployee(input: {
  name: string;
  email: string;
  company: string;
  role: "employee" | "admin";
  password?: string;
}) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const secondaryApp = getApps().find((app) => app.name === "Secondary") 
    || initializeApp(firebaseConfig, "Secondary");
  
  const secondaryAuth = getAuth(secondaryApp);
  
  // 1. Create employee credentials in Firebase Auth
  const credential = await createUserWithEmailAndPassword(
    secondaryAuth,
    input.email,
    input.password || "Nutado123!"
  );

  // 2. Set employee display name
  await updateProfile(credential.user, { displayName: input.name });

  // 3. Create the Firestore profile document using secondary db
  const secondaryDb = getFirestore(secondaryApp);
  const profile: AuthProfile = {
    uid: credential.user.uid,
    email: input.email,
    name: input.name,
    company: input.company || "Nutado",
    role: input.role,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(secondaryDb, USERS_COLLECTION, profile.uid), profile, { merge: true });

  // 4. Cleanly sign out of the secondary auth session
  await secondarySignOut(secondaryAuth);

  return profile;
}

export async function uploadImageFile(file: File): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  // Client-side image compression helper
  const compressImage = (f: File, maxW = 600, maxH = 600): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxW) {
              height = Math.round((height * maxW) / width);
              width = maxW;
            }
          } else {
            if (height > maxH) {
              width = Math.round((width * maxH) / height);
              height = maxH;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = () => {
          resolve(event.target?.result as string);
        };
      };
      reader.onerror = () => {
        resolve("");
      };
    });
  };

  const dataURItoBlob = (dataURI: string) => {
    try {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch (e) {
      return null;
    }
  };

  // 1. Compress the file first to a tiny optimized representation
  const compressedBase64 = await compressImage(file);
  
  if (!compressedBase64) {
    throw new Error("Failed to read image file.");
  }

  // 2. If storage is not initialized, return the tiny compressed base64 directly
  if (!storage) {
    console.warn("Firebase Storage is not initialized. Using compressed Base64 fallback.");
    return compressedBase64;
  }

  // 3. Otherwise try to upload the highly compressed blob to Firebase Storage
  const compressedBlob = dataURItoBlob(compressedBase64);
  if (!compressedBlob) {
    console.warn("Failed to convert compressed image to blob. Using Base64 fallback.");
    return compressedBase64;
  }

  // Create a timeout promise that rejects after 3.5 seconds
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Upload timeout")), 3500)
  );

  try {
    const storageRef = ref(storage, `uploads/${Date.now()}_compressed_${file.name.replace(/\.[^/.]+$/, "")}.jpg`);
    const uploadTask = uploadBytes(storageRef, compressedBlob).then(snapshot => getDownloadURL(snapshot.ref));
    
    // Race the upload task against the 3.5 second timeout
    return await Promise.race([uploadTask, timeoutPromise]);
  } catch (error) {
    console.warn("Firebase Storage upload failed or timed out. Falling back to compressed Base64:", error);
    return compressedBase64;
  }
}

const LOCAL_STORAGE_OCCASIONS_KEY = "nutado_custom_occasions";

function getLocalOccasions(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_OCCASIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOccasions(occasions: any[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_OCCASIONS_KEY, JSON.stringify(occasions));
  } catch {}
}

export async function createOccasion(data: { label: string; category: string; color: string; icon: string; img?: string }) {
  const docId = data.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const record = {
    id: docId,
    label: data.label,
    category: data.category,
    color: data.color,
    icon: data.icon,
    img: data.img || null,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to Firestore if available
  try {
    const firestore = requireDb();
    await setDoc(doc(firestore, "occasions", docId), record);
  } catch (err) {
    console.warn("createOccasion Firestore save bypassed:", err);
  }

  // 2. Save to Local Storage as a robust offline/local fallback
  const local = getLocalOccasions();
  const next = [record, ...local.filter(o => o.id !== docId)];
  saveLocalOccasions(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nutado_occasions_updated"));
  }
}

export async function updateOccasion(id: string, data: { label: string; category: string; color: string; icon: string; img?: string }) {
  // 1. Update in Firestore if available
  try {
    const firestore = requireDb();
    await setDoc(
      doc(firestore, "occasions", id),
      {
        label: data.label,
        category: data.category,
        color: data.color,
        icon: data.icon,
        img: data.img || null,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("updateOccasion Firestore update bypassed:", err);
  }

  // 2. Update in Local Storage
  const local = getLocalOccasions();
  const idx = local.findIndex(o => o.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...data, img: data.img || local[idx].img || null };
  } else {
    // If it's a seed preset being customized/updated locally
    const preset = SEED_OCCASIONS.find(o => o.id === id);
    local.push({
      id,
      label: data.label,
      category: data.category,
      color: data.color,
      icon: data.icon,
      img: data.img || null,
      createdAt: preset ? new Date().toISOString() : new Date().toISOString(),
    });
  }
  saveLocalOccasions(local);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nutado_occasions_updated"));
  }
}

export async function deleteOccasion(id: string) {
  // 1. Delete in Firestore if available
  try {
    const firestore = requireDb();
    await deleteDoc(doc(firestore, "occasions", id));
  } catch (err) {
    console.warn("deleteOccasion Firestore delete bypassed:", err);
  }

  // 2. Delete in Local Storage
  const local = getLocalOccasions();
  const next = local.filter(o => o.id !== id);
  saveLocalOccasions(next);

  // Mark deleted presets locally (in case they delete a default preset, we want it hidden!)
  if (typeof window !== "undefined") {
    const deletedPresets = JSON.parse(localStorage.getItem("nutado_deleted_presets") || "[]");
    if (!deletedPresets.includes(id)) {
      deletedPresets.push(id);
      localStorage.setItem("nutado_deleted_presets", JSON.stringify(deletedPresets));
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nutado_occasions_updated"));
  }
}

const SEED_OCCASIONS = [
  { id: "diwali", label: "Diwali", category: "festivals", color: "amber", icon: "Sparkles" },
  { id: "eid", label: "Eid", category: "festivals", color: "emerald", icon: "Sparkles" },
  { id: "onam", label: "Onam", category: "festivals", color: "amber", icon: "Sparkles" },
  { id: "rakhi", label: "Rakhi", category: "festivals", color: "red", icon: "Sparkles" },
  { id: "janmashtami", label: "Janmashtami", category: "festivals", color: "blue", icon: "Sparkles" },
  { id: "navratri", label: "Navratri", category: "festivals", color: "pink", icon: "Sparkles" },
  { id: "birthday", label: "Birthday", category: "corporate", color: "purple", icon: "Cake" },
  { id: "corp-anniversary", label: "Corp. Anniversary", category: "corporate", color: "purple", icon: "Briefcase" },
  { id: "special-days", label: "Special Days", category: "gifting", color: "pink", icon: "Heart" },
  { id: "consumer-gifting", label: "Consumer Gifting", category: "gifting", color: "blue", icon: "ShoppingBag" },
  { id: "new-year", label: "New Year & Holidays", category: "gifting", color: "amber", icon: "PartyPopper" },
  { id: "custom-occasion", label: "Custom Moments", category: "gifting", color: "purple", icon: "Sparkles" },
];

export async function seedOccasionsIfNeeded() {
  try {
    const firestore = requireDb();
    for (const occ of SEED_OCCASIONS) {
      const docRef = doc(firestore, "occasions", occ.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          ...occ,
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn("seeding occasions error bypassed:", err);
  }
}

export function subscribeOccasions(callback: (occasions: any[]) => void): Unsubscribe {
  let firestoreOccasions: any[] = [];

  const triggerCombined = () => {
    const local = getLocalOccasions();
    const deletedPresets = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("nutado_deleted_presets") || "[]")
      : [];

    // Start with static preset default occasions, filtering out any deleted presets
    const combined = SEED_OCCASIONS.filter(so => !deletedPresets.includes(so.id)).map(so => ({
      ...so,
      createdAt: "1970-01-01T00:00:00.000Z", // base priority for presets
    }));

    // Merge firestore custom/updated occasions
    firestoreOccasions.forEach(fo => {
      const idx = combined.findIndex(co => co.id === fo.id);
      if (idx !== -1) {
        combined[idx] = { ...combined[idx], ...fo };
      } else {
        combined.unshift(fo);
      }
    });

    // Merge local storage custom/updated occasions
    local.forEach(lo => {
      const idx = combined.findIndex(co => co.id === lo.id);
      if (idx !== -1) {
        combined[idx] = { ...combined[idx], ...lo };
      } else {
        combined.unshift(lo);
      }
    });

    // Sort combined list by createdAt descending to guarantee absolute sorting correctness
    combined.sort((a: any, b: any) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });

    callback(combined);
  };

  // Handle local storage storage event
  const handleLocalUpdate = () => {
    triggerCombined();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("nutado_occasions_updated", handleLocalUpdate);
  }

  // Trigger initial list render using local fallback
  triggerCombined();

  // Try to load real-time database updates from Firestore
  let unsubscribeFirestore = () => {};
  try {
    const firestore = requireDb();
    seedOccasionsIfNeeded(); // trigger database seeding in background

    const occasionsQuery = query(collection(firestore, "occasions"));
    unsubscribeFirestore = onSnapshot(
      occasionsQuery,
      (snap) => {
        firestoreOccasions = snap.docs.map((d) => d.data());
        triggerCombined();
      },
      (err) => {
        console.warn("subscribeOccasions Firestore listener failed, using local/preset fallbacks:", err);
        triggerCombined();
      }
    );
  } catch (e) {
    console.warn("subscribeOccasions setup failed, using local/preset fallbacks:", e);
    triggerCombined();
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("nutado_occasions_updated", handleLocalUpdate);
    }
    unsubscribeFirestore();
  };
}


