
export interface DBRecord {
  id: string;
  type: 'chat' | 'image' | 'search' | 'voice';
  input: string;
  output: string;
  timestamp: number;
  metadata?: any;
}

const STORAGE_KEY = 'wls_saas_db';

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
    records.unshift(newRecord); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  },

  deleteRecord: (id: string) => {
    const records = db.getRecords().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
