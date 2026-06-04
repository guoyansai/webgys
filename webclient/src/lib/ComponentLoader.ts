import { defineAsyncComponent, markRaw, shallowReactive } from 'vue';

/**
 * LRU 缓存实现
 */
class LRUCache {
  private cache = new Map<string, any>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): any | undefined {
    const value = this.cache.get(key);
    if (value) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  keys(): IterableIterator<string> {
    return this.cache.keys();
  }
}

// ========== 全局组件缓存（使用 LRU）==========
const globalCache = new LRUCache(50);

/**
 * 从路径中提取组件名称
 */
const extractComponentName = (path: string, modulefile: any, fullname: boolean): string | null => {
  if (fullname) return path;
  if (modulefile?.default?.__name) return modulefile.default.__name;
  const match = path.match(/([^\\/]+)(?=\.vue$)/);
  return match ? match[1] : null;
};

export interface ComponentLoaderOptions {
  app?: any;
  files: Record<string, any>;
  eager?: boolean;
  fullname?: boolean;
  cache?: boolean;
  cacheKey?: string;
  target?: any;
  targetKey?: string;
  mode?: 'global' | 'dynamic' | 'hybrid';
  preload?: string[];
  preloadDelay?: number;
}

export interface ComponentLoaderResult {
  get: (key: string) => any;
  clear: () => void;
  map: Record<string, any>;
  loadAll: () => Promise<void>;
  loadBatch: (keys: string[]) => Promise<void>;
}

export function createComponentLoader(options: ComponentLoaderOptions): ComponentLoaderResult {
  const { app, files = {}, eager = true, fullname = false, cache = true, cacheKey = 'comp_', target, targetKey = 'comps', mode = 'global', preload = [], preloadDelay = 500 } = options;

  // 使用 Map 提升查找性能
  const componentMap = new Map<string, any>();
  const localCache = shallowReactive<Record<string, any>>({});
  
  // 保持兼容的 object 映射
  const objectMap: Record<string, any> = {};

  const initComponentMap = () => {
    for (const [path, moduleOrLoader] of Object.entries(files)) {
      const name = extractComponentName(path, eager ? moduleOrLoader : null, fullname);
      if (name) {
        componentMap.set(name, moduleOrLoader);
        objectMap[name] = moduleOrLoader; // 保持 object 映射
      }
    }

    if (target && targetKey) {
      if (!target[targetKey]) target[targetKey] = {};
      componentMap.forEach((value, key) => {
        target[targetKey][key] = value;
      });
    }
  };

  const getComponent = (key: string) => {
    if (localCache[key]) return localCache[key];

    const globalKey = `${cacheKey}${key}`;
    if (cache && globalCache.has(globalKey)) {
      return (localCache[key] = globalCache.get(globalKey));
    }

    const comp = componentMap.get(key) || target?.[targetKey]?.[key];
    if (!comp) return null;

    const resolved = comp.default
      ? markRaw(comp.default)
      : defineAsyncComponent({
          loader: () =>
            comp().catch((error: any) => {
              console.error(`Failed to load component: ${key}`, error);
              return comp(); // 重试一次
            }),
          loadingComponent: { template: '<div class="comp-loading">Loading...</div>' },
          errorComponent: {
            template: '<div class="comp-error">Loading failed. <button @click="$emit(\'retry\')">Retry</button></div>',
            emits: ['retry'],
          },
          delay: 200,
          timeout: 10000,
          suspensible: true,
        });

    if (cache) {
      localCache[key] = resolved;
      globalCache.set(globalKey, resolved);
    }

    return resolved;
  };

  const clearCache = () => {
    Object.keys(localCache).forEach((key) => {
      delete localCache[key];
    });

    if (cacheKey) {
      for (const key of globalCache.keys()) {
        if (key.startsWith(cacheKey)) globalCache.delete(key);
      }
    }
  };

  const registerGlobalComponents = (vuecomps: Record<string, any>) => {
    if (!app) return;

    for (const [name, comp] of componentMap) {
      if (app._context.components[name]) continue;

      const component = comp.default || defineAsyncComponent(comp);
      app.component(name, component);
      vuecomps[name] = comp.default || comp;
    }
  };

  const loadBatch = async (keys: string[]) => {
    const promises = keys.map((key) => {
      if (localCache[key] || (cache && globalCache.has(`${cacheKey}${key}`))) {
        return Promise.resolve();
      }
      const comp = componentMap.get(key);
      if (!comp) return Promise.resolve();

      // 异步组件需要等待加载完成
      if (comp.default) {
        // 同步组件
        getComponent(key);
        return Promise.resolve();
      } else {
        // 异步组件，等待加载
        return comp().then(() => {
          getComponent(key);
        }).catch(() => {
          // 忽略加载错误
        });
      }
    });

    await Promise.all(promises);
  };

  const loadAll = async () => {
    const keys = Array.from(componentMap.keys());
    await loadBatch(keys);
  };

  const preloadComponents = () => {
    requestIdleCallback(
      () => {
        preload.forEach((key) => {
          if (componentMap.has(key)) {
            getComponent(key);
          }
        });
      },
      { timeout: preloadDelay }
    );
  };

  initComponentMap();

  if (mode === 'global' || mode === 'hybrid') {
    registerGlobalComponents({} as Record<string, any>);
  }

  if (preload.length > 0) {
    preloadComponents();
  }

  return {
    get: getComponent,
    clear: clearCache,
    map: objectMap, // 返回 object 类型保持兼容
    loadAll,
    loadBatch,
  };
}

export default { createComponentLoader };