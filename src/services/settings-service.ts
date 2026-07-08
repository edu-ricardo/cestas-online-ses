import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface StoreSettings {
  whatsappNumber: string;
}

const SETTINGS_COLLECTION = "settings";
const STORE_CONFIG_DOC = "store_config";

export const SettingsService = {
  async getSettings(): Promise<StoreSettings | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as StoreSettings;
    }
    return null;
  },

  async updateSettings(settings: StoreSettings): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
    await setDoc(docRef, settings);
  }
};
