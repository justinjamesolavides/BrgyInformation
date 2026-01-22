import fs from 'fs';
import path from 'path';

export class FileStorage {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(process.cwd(), 'data', filename);
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf8');
    }
  }

  private readData(): any[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data file:', error);
      return [];
    }
  }

  private writeData(data: any[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing data file:', error);
      throw new Error('Failed to save data');
    }
  }

  getAll(): any[] {
    return this.readData();
  }

  getById(id: number): any | null {
    const data = this.readData();
    return data.find(item => item.id === id) || null;
  }

  create(item: any): any {
    const data = this.readData();
    const newItem = { ...item, id: this.generateId(), createdAt: new Date().toISOString() };
    data.push(newItem);
    this.writeData(data);
    return newItem;
  }

  update(id: number, updates: any): any | null {
    const data = this.readData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    this.writeData(data);
    return data[index];
  }

  delete(id: number): boolean {
    const data = this.readData();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return false;

    data.splice(index, 1);
    this.writeData(data);
    return true;
  }

  findByEmail(email: string): any | null {
    const data = this.readData();
    return data.find(item => item.email === email) || null;
  }

  private generateId(): number {
    const data = this.readData();
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    return maxId + 1;
  }
}

// Create storage instances
export const usersStorage = new FileStorage('users.json');
export const residentsStorage = new FileStorage('residents.json');