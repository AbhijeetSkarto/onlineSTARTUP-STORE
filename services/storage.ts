
export interface DBRecord {
  id: string;
  type: 'chat' | 'image' | 'search' | 'voice' | 'purchase';
  input: string;
  output: string;
  timestamp: number;
  metadata?: any;
}

const STORAGE_KEY = 'wls_saas_db';
const CART_KEY = 'wls_cart';

export const db = {
  getRecords: (): DBRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecord: (record: Omit<DBRecord, 'id' | 'timestamp'>) => {
    const records = db.getRecords();
    const newRecord: DBRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  },

  getCart: (): string[] => {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  },

  addToCart: (productId: string) => {
    const cart = db.getCart();
    if (!cart.includes(productId)) {
      cart.push(productId);
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  },

  removeFromCart: (productId: string) => {
    const cart = db.getCart().filter(id => id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  clearCart: () => localStorage.removeItem(CART_KEY),

  deleteRecord: (id: string) => {
    const records = db.getRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
