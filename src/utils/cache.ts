interface CacheEntry {
  value: any;
  expiresAt: number;
}

class Cache {
  // use redis for multiple servers
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, value: any, ttl: number) {
    const expiresAt = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }
}

export default new Cache();
