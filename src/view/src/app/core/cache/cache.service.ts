import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from './item';
import { Subject, Subscription } from 'rxjs';
import { Cache } from './cache';
export class CacheItem{
  ID:string
  MD5:string
  Size:number
}
class Element {
  Next: Element = null;
  Pre: Element = null;

  Key: string = null;
}

const DBName = "cache";
const StoreName = "chapters";
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private match = /^[0-9a-f]{32}$/
  private db: any = null;
  private isInit: boolean = false;
  private subject = new Subject<boolean>();
  cache: Cache;
  // 緩存
  private keys = {};
  // 緩存 容量
  private cap: number;
  // 讀取 緩存量
  private len: number = 0;
  // 鏈表 頭尾
  private front: Element = null;
  private back: Element = null;

  constructor(private httpClient: HttpClient
  ) {
    this.load();
    if (!window.indexedDB) {
      console.warn("not support indexedDB");
      this.isInit = true;
      this.subject.next(true);
      return;
    }
    if (!this.cache.enable) {
      console.log("disable cache");
      this.isInit = true;
      this.subject.next(true);
      return;
    }
    this.cap = this.cache.capacity;

    try {
      const result = window.indexedDB.open(DBName);
      result.onupgradeneeded = (evt) => {
        const db = result.result;
        // 檢索 倉庫是否存在
        if (db.objectStoreNames.contains(StoreName)) {
          // 已經 存在 不用 創建
          return;
        }

        // 創建倉庫
        db.createObjectStore(
          StoreName,
          {
            keyPath: 'ID',
          }
        );
      };
      result.onsuccess = (evt) => {
        this.db = result.result;
        this.isInit = true;
        console.log("cache.capacity :", this.cache.capacity);
        this.subject.next(true);
      };
      result.onerror = (evt) => {
        console.warn("indexedDB.open error");
        this.isInit = true;
        this.subject.next(true);
      };
    } catch (e) {
      console.warn(e);
      this.isInit = true;
      this.subject.next(true);
    }
  }
  // 加載 配置
  private load() {
    if (typeof (Storage) == "undefined") {
      this.cache = new Cache();
      this.cache.enable = true;
      this.cache.capacity = 200;
      return undefined;
    }
    this.cache = new Cache();
    let v: any = this.getKey("cache.enable");
    if (v == "0") {
      this.cache.enable = false;
    } else {
      this.cache.enable = true;
    }
    v = parseInt(this.getKey("cache.capacity"));
    if (isNaN(v) || v < 1) {
      v = 200;
    }
    this.cache.capacity = v;
  }
  private getKey(key: string): string {
    if (typeof (Storage) == "undefined") {
      console.warn("not support storage")
      return undefined;
    }
    return localStorage.getItem(key)
  }
  private setKey(key: string, val: string) {
    if (typeof (Storage) == "undefined") {
      console.warn("not support storage")
      return;
    }
    localStorage.setItem(key, val);
  }
  request(book: string, chapter: string): Promise<string> {
    if (this.isInit) {
      return this.doRequest(book, chapter);
    }
    return new Promise<string>((resolve, reject) => {
      console.log("cache wait init.");
      const observable = this.subject.asObservable();
      let subscription: Subscription;
      subscription = observable.subscribe(() => {
        this.doRequest(book, chapter).then(resolve, reject);
        if (subscription) {
          subscription.unsubscribe();
        }
      })
    });
  }
  private doRequest(book: string, chapter: string): Promise<string> {
    const cacheID = this.getID(book, chapter);
    // 緩存 未就緒 直接 連接
    if (!this.db) {
      return this.requestDirect(cacheID, book, chapter);
    }
    return this.requestCache(cacheID, book, chapter);
  }
  private getID(book: string, chapter: string) {
    return "cache:" + book + "." + chapter;
  }
  private updateCache(item: Item) {
    // 數據庫 未就緒
    if (!this.db) {
      console.warn("db not ready,ignore updateCache")
      return;
    }
    try {
      // 更新 數據庫緩存
      const request = this.db.transaction([StoreName], 'readwrite').objectStore(StoreName)
        .put({
          ID: item.ID,
          Val: item.Val,
          MD5: item.MD5,
        });
      request.onsuccess = (evt) => {        // 成功 更新 lru
        //驗證 存在
        this.unsafeSet(item.ID)
      }
    } catch (e) {
      console.error(e)
    }
  }
  private unsafeSet(id: string) {
    let find = this.keys[id] as Element;
    if (find) {
      // 移動到 Back
      this.unsafeToBack(find);
    } else {
      // 刪除 過期 緩存
      while (this.len == this.cap &&
        this.front != null) {

        //刪除 front
        this.unsafeDelete(this.front);
      }

      // 創建 新緩存
      this.unsafeNew(id)
    }
  }
  private unsafeDelete(ele: Element) {
    const key = ele.Key;
    this.len--;
    // 刪除 內存
    delete this.keys[key];

    this.unsafeRemoveList(ele);

    // 刪除 數據庫
    // 數據庫 未就緒
    if (!this.db) {
      console.warn("db not ready,ignore unsafeDelete")
      return;
    }
    try {
      // 更新 數據庫緩存
      this.db.transaction([StoreName], 'readwrite').objectStore(StoreName).delete(key);
    } catch (e) {
      console.error(e)
    }
  }
  private unsafeRemoveList(ele: Element) {
    if (ele.Next == null) {
      this.back = ele.Pre;
    } else { //需要 設置 next
      ele.Next.Pre = ele.Pre;
      if (ele.Pre == null) {
        this.front = ele.Next;
      } else {
        ele.Pre.Next = ele.Next;
      }
    }
    if (ele.Pre == null) {
      this.front = ele.Next;
    } else { //需要 設置 pre
      ele.Pre.Next = ele.Next;
      if (ele.Next == null) {
        this.back = ele.Pre;
      } else {
        ele.Next.Pre = ele.Pre;
      }
    }
  }
  private unsafeNew(key: string) {
    const ele = new Element();
    ele.Pre = this.back;
    ele.Key = key;

    this.keys[key] = ele
    if (this.back == null) {
      this.front = ele;
    } else {
      this.back.Next = ele;
    }
    this.back = ele;
    this.len++;
  }
  private unsafeToBack(ele: Element) {
    if (ele.Next == null) {
      //本來就是 back 節點 直接返回
      return
    }

    ele.Next.Pre = ele.Pre
    if (ele.Pre == null) {
      this.front = ele.Next
    } else {
      ele.Pre.Next = ele.Next
    }

    ele.Next = null;
    ele.Pre = this.back;
    this.back.Next = ele;
    this.back = ele;
  }
  private unsafeToBackByID(id: string) {
    const ele = this.keys[id];
    if (ele) {
      this.unsafeToBack(ele);
    }
  }
  private unsafeRemoveListByID(id: string) {
    const ele = this.keys[id];
    if (ele) {
      this.len--;
      // 刪除 內存
      delete this.keys[id];

      this.unsafeRemoveList(ele);
    }
  }
  private requestCache(cacheID: string, book: string, chapter: string): Promise<string> {
    // 存在 緩存
    return new Promise<string>((resolve, reject) => {
      // 查詢 值
      const id = cacheID;
      try {
        // 查詢 數據庫
        const request = this.db.transaction([StoreName], 'readonly').objectStore(StoreName)
          .get(id);
        request.onsuccess = (evt) => {
          var result = evt.target.result;
          if (result) {
            this.doRequestCache(cacheID, book, chapter, result).then(
              resolve, reject,
            );
          } else {
            this.unsafeRemoveListByID(cacheID);
            this.requestDirect(cacheID, book, chapter).then(
              resolve, reject,
            );
          }
        }
      } catch (e) {
        //reject(e)
        console.error(e);
        this.unsafeRemoveListByID(cacheID);
        this.requestDirect(cacheID, book, chapter).then(
          resolve, reject,
        );
      }
    });
  }
  private doRequestCache(cacheID: string, book: string, chapter: string, cache: Item): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.post("/book/chapter", {
        ID: book,
        Chapter: chapter,
        MD5: cache.MD5,
      }).subscribe(
        (item: Item) => {
          let text: string = null;
          if (item.Hit) {
            // 緩存 命中
            text = cache.Val;
            console.log("cache hit :", cacheID);
            this.unsafeToBackByID(cacheID);
          } else {
            // 未命中 緩存 設置新 緩存
            text = item.Val;
            if (item.MD5 != null && item.MD5 != undefined && item.MD5 != "" &&
              this.match.test(item.MD5)
            ) {
              // 設置新 緩存
              item.ID = cacheID;
              this.updateCache(item);
            }
          }
          resolve(text);
        },
        (e) => {
          reject(e);
        },
      );
    });
  }
  private requestDirect(cacheID: string, book: string, chapter: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.post("/book/chapter", {
        ID: book,
        Chapter: chapter,
      }).subscribe(
        (item: Item) => {
          let text: string = null;
          text = item.Val;
          if (item.MD5 != null && item.MD5 != undefined && item.MD5 != "" &&
            this.match.test(item.MD5)
          ) {
            // 設置新 緩存
            item.ID = cacheID;
            this.updateCache(item);
          }
          resolve(text);
        },
        (e) => {
          reject(e);
        },
      );
    });
  }
  // 保存設置
  save(data: Cache) {
    this.cache.enable = data.enable;
    this.cache.capacity = data.capacity;
    if (typeof (Storage) == "undefined") {
      console.warn("not support storage")
      return;
    }

    if (this.cache.enable) {
      localStorage.setItem("cache.enable", "1");
    } else {
      localStorage.setItem("cache.enable", "0");
    }
    localStorage.setItem("cache.capacity", "" + this.cache.capacity);
  }
  getCaches(match?: RegExp): Promise<Array<CacheItem>> {
    return new Promise<Array<CacheItem>>((resolve, reject) => {
      if (!this.db) {
        console.log("db not init");
        resolve(null);
        return;
      }
      try {
        const objectStore = this.db.transaction(StoreName).objectStore(StoreName);
        let rs = new Array<CacheItem>();
        objectStore.openCursor().onsuccess = (evt) => {
          const cursor = evt.target.result;
          if (cursor) {
            if (!match || match.test(cursor.value.ID)) {
              const ele = {
                ID: cursor.value.ID,
                MD5: cursor.value.MD5,
                Size: 0,
              };
              if (typeof cursor.value.Val == "string") {
                ele.Size = cursor.value.Val.length;
              }
              rs.push(ele);
            }
            cursor.continue();
          } else {
            if (rs.length == 0) {
              rs = null;
            }
            resolve(rs);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}