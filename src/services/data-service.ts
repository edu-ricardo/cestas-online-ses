import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  getDoc
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Category {
  id?: string;
  name: string;
}

const CATEGORIES_COLLECTION = "categories";

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  },

  async create(category: Category): Promise<string> {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category);
    return docRef.id;
  },

  async update(id: string, category: Partial<Category>): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, category);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string; // Mantido para compatibilidade com registros antigos
  images?: ProductImage[]; // Nova propriedade para múltiplas imagens
  isActive: boolean;
  createdAt: number;
}

const PRODUCTS_COLLECTION = "products";

export const ProductService = {
  async getAll(onlyActive = false): Promise<Product[]> {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    let q = query(colRef);
    
    if (onlyActive) {
      q = query(colRef, where("isActive", "==", true));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  async create(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
    return docRef.id;
  },

  async update(id: string, product: Partial<Product>): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, product);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  }
};
