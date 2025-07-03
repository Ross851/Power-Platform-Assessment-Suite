interface CacheItem<T> {
  data: T
  timestamp: number
  ttl?: number
}

export class StorageCache {
  private prefix = "ppas_cache_"
  
  constructor(
    private storage: Storage = typeof window !== "undefined" ? localStorage : null!
  ) {}

  async get<T>(key: string): Promise<T | null> {
    if (!this.storage) return null
    
    try {
      const item = this.storage.getItem(this.prefix + key)
      if (!item) return null

      const cached: CacheItem<T> = JSON.parse(item)
      
      // Check if expired
      if (cached.ttl && Date.now() - cached.timestamp > cached.ttl) {
        await this.delete(key)
        return null
      }

      return cached.data
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (!this.storage) return

    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl
      }
      
      this.storage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.error("Cache set error:", error)
      // Handle quota exceeded
      if (error instanceof Error && error.name === "QuotaExceededError") {
        await this.cleanup()
        // Retry once
        try {
          this.storage.setItem(this.prefix + key, JSON.stringify({ data, timestamp: Date.now(), ttl }))
        } catch {
          // Give up
        }
      }
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.storage) return
    this.storage.removeItem(this.prefix + key)
  }

  async clear(): Promise<void> {
    if (!this.storage) return
    
    const keys = Object.keys(this.storage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key)
      }
    })
  }

  async cleanup(): Promise<void> {
    if (!this.storage) return

    const now = Date.now()
    const keys = Object.keys(this.storage)
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = this.storage.getItem(key)
          if (item) {
            const cached: CacheItem<any> = JSON.parse(item)
            if (cached.ttl && now - cached.timestamp > cached.ttl) {
              this.storage.removeItem(key)
            }
          }
        } catch {
          // Invalid item, remove it
          this.storage.removeItem(key)
        }
      }
    })
  }
}

export class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private timers = new Map<string, NodeJS.Timeout>()

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }

    return item.data
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    // Clear existing timer if any
    const existingTimer = this.timers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.timers.delete(key)
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }

    this.cache.set(key, item)

    // Set auto-cleanup timer if TTL specified
    if (ttl) {
      const timer = setTimeout(() => {
        this.delete(key)
      }, ttl)
      this.timers.set(key, timer)
    }
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
    
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }
  }

  async clear(): Promise<void> {
    this.cache.clear()
    
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }

  get size(): number {
    return this.cache.size
  }
}

export class CacheManager {
  private memoryCache = new MemoryCache()
  private storageCache = new StorageCache()
  
  constructor(
    private config = {
      memoryTTL: 5 * 60 * 1000, // 5 minutes
      storageTTL: 24 * 60 * 60 * 1000, // 24 hours
      useMemoryCache: true,
      useStorageCache: true
    }
  ) {}

  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    if (this.config.useMemoryCache) {
      const memoryResult = await this.memoryCache.get<T>(key)
      if (memoryResult !== null) {
        return memoryResult
      }
    }

    // Try storage cache
    if (this.config.useStorageCache) {
      const storageResult = await this.storageCache.get<T>(key)
      if (storageResult !== null) {
        // Populate memory cache
        if (this.config.useMemoryCache) {
          await this.memoryCache.set(key, storageResult, this.config.memoryTTL)
        }
        return storageResult
      }
    }

    return null
  }

  async set<T>(key: string, data: T, options?: { memoryTTL?: number; storageTTL?: number }): Promise<void> {
    const memoryTTL = options?.memoryTTL ?? this.config.memoryTTL
    const storageTTL = options?.storageTTL ?? this.config.storageTTL

    // Set in both caches
    const promises: Promise<void>[] = []
    
    if (this.config.useMemoryCache) {
      promises.push(this.memoryCache.set(key, data, memoryTTL))
    }
    
    if (this.config.useStorageCache) {
      promises.push(this.storageCache.set(key, data, storageTTL))
    }

    await Promise.all(promises)
  }

  async delete(key: string): Promise<void> {
    const promises: Promise<void>[] = []
    
    if (this.config.useMemoryCache) {
      promises.push(this.memoryCache.delete(key))
    }
    
    if (this.config.useStorageCache) {
      promises.push(this.storageCache.delete(key))
    }

    await Promise.all(promises)
  }

  async clear(): Promise<void> {
    const promises: Promise<void>[] = []
    
    if (this.config.useMemoryCache) {
      promises.push(this.memoryCache.clear())
    }
    
    if (this.config.useStorageCache) {
      promises.push(this.storageCache.clear())
    }

    await Promise.all(promises)
  }

  async cleanup(): Promise<void> {
    if (this.config.useStorageCache) {
      await this.storageCache.cleanup()
    }
  }
}

// Export singleton instance with default config
export const cacheManager = new CacheManager()