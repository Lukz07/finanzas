import { Redis } from '@upstash/redis';
import * as storage from 'node-persist';

interface CacheOptions {
  key: string;
  value: any;
  ttl?: number; // TTL en milisegundos para node-persist
}

export class CacheManager {
  private static instance: CacheManager;
  private redis: Redis | null = null;
  private isDevelopment: boolean;
  private static isStorageInitialized = false; // Flag para asegurar inicialización única

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // if (this.isDevelopment && !CacheManager.isStorageInitialized) {
    //   storage.init({
    //     dir: '.cache/dev-storage', // Directorio para guardar la caché
    //     expiredInterval: 2 * 60 * 1000, // Comprobar expirados cada 2 minutos
    //   }).then(() => {
    //     console.log('💾 Almacenamiento persistente inicializado para desarrollo.');
    //     CacheManager.isStorageInitialized = true;
    //   }).catch(err => {
    //     console.error('❌ Error al inicializar almacenamiento persistente:', err);
    //   });
    // } else if (!this.isDevelopment) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || '',
        token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
      });
    // }
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public async set({ key, value, ttl }: CacheOptions): Promise<void> {
    // if (this.isDevelopment) {
    //   if (!CacheManager.isStorageInitialized) {
    //     console.warn('⏳ Esperando inicialización del almacenamiento persistente...');
    //     await storage.init({ dir: '.cache/dev-storage' }); // Re-intenta o espera
    //     CacheManager.isStorageInitialized = true;
    //   }
    //   try {
    //     await storage.setItem(key, value, ttl ? { ttl } : undefined);
    //     console.log('💾 Guardado en caché persistente de desarrollo:', { key });
    //   } catch (error) {
    //     console.error('❌ Error al guardar en caché persistente:', { key, error });
    //   }
    // } else {
      if (!this.redis) throw new Error('Redis no está inicializado');
      await this.redis.set(key, value, ttl ? { px: ttl } : undefined); // px para milisegundos en Redis
    // }
  }

  public async get<T>(key: string): Promise<T | null> {
    // if (this.isDevelopment) {
    //   if (!CacheManager.isStorageInitialized) {
    //     console.warn('⏳ Esperando inicialización del almacenamiento persistente...');
    //     await storage.init({ dir: '.cache/dev-storage' }); // Re-intenta o espera
    //     CacheManager.isStorageInitialized = true;
    //   }
    //   try {
    //     const value = await storage.getItem(key);
    //     if (value === undefined) { // node-persist devuelve undefined si no existe o expiró
    //       console.log('❌ No se encontró o expiró en caché persistente:', key);
    //       return null;
    //     }
    //     console.log('✅ Obtenido de caché persistente de desarrollo:', { key });
    //     return value as T;
    //   } catch (error) {
    //     console.error('❌ Error al obtener de caché persistente:', { key, error });
    //     return null;
    //   }
    // } else {
      if (!this.redis) throw new Error('Redis no está inicializado');
      return await this.redis.get<T>(key);
    // }
  }

  public async delete(key: string): Promise<void> {
    // if (this.isDevelopment) {
    //   if (!CacheManager.isStorageInitialized) return; // No hacer nada si no está inicializado
    //   try {
    //     await storage.removeItem(key);
    //     console.log('🗑️ Eliminado de caché persistente de desarrollo:', key);
    //   } catch (error) {
    //     console.error('❌ Error al eliminar de caché persistente:', { key, error });
    //   }
    // } else {
      if (!this.redis) throw new Error('Redis no está inicializado');
      await this.redis.del(key);
    // }
  }

  public async clear(): Promise<void> {
    // if (this.isDevelopment) {
    //   if (!CacheManager.isStorageInitialized) return;
    //   try {
    //     await storage.clear();
    //     console.log('🧹 Caché persistente de desarrollo limpiada');
    //   } catch (error) {
    //     console.error('❌ Error al limpiar caché persistente:', error);
    //   }
    // } else {
      if (!this.redis) throw new Error('Redis no está inicializado');
      const keys = await this.redis.keys('*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    // }
  }
} 