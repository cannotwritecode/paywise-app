
// Simple in-memory mock database for demonstration purposes
// In a real production app, this would be a connection to PostgreSQL/MySQL

export interface Receipt {
  id: string;
  image_url: string;
  ocr_data: any;
  processed: boolean;
  created_at: Date;
}

class MockDB {
  private receipts: Receipt[] = [];

  async insertReceipt(receipt: Omit<Receipt, "id" | "created_at">): Promise<Receipt> {
    const newReceipt = {
      ...receipt,
      id: Math.random().toString(36).substring(7),
      created_at: new Date(),
    };
    this.receipts.push(newReceipt);
    return newReceipt;
  }

  async getReceipt(id: string): Promise<Receipt | undefined> {
    return this.receipts.find((r) => r.id === id);
  }

  async updateReceipt(id: string, updates: Partial<Receipt>): Promise<Receipt | null> {
    const index = this.receipts.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.receipts[index] = { ...this.receipts[index], ...updates };
    return this.receipts[index];
  }
}

export const db = new MockDB();
