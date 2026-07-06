// app/lib/notes-cache.server.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class NotesCache {
  private cache = new Map<string, CacheItem<any>>();
  private ttl: number = 3600; // 1 час

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const age = (Date.now() - item.timestamp) / 1000;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const notesCache = new NotesCache();