import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from './item';
const DBName = "cache";
const StoreName = "chapters";
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private match = /^[0-9a-f]{32}$/
  private db: any = null;
  constructor(private httpClient: HttpClient,
  ) {
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
        const objectStore = db.createObjectStore(
          StoreName,
          {
            keyPath: 'id',
          }
        );
      };
      result.onsuccess = (evt) => {
        this.db = result.result;
      };
      result.onerror = (evt) => {
        console.warn("indexedDB.open error")
      };
    } catch (e) {
      console.warn(e);
    }

  }

  request(book: string, chapter: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // 查找 緩衝
      this.httpClient.post("/book/chapter", {
        ID: book,
        Chapter: chapter,
        MD5: null,
      }).subscribe(
        (item: Item) => {
          let text: string = null;
          if (item.Hit) {
            // 命中 緩存 直接 返回 緩存 數據

            // 更新 緩存 熱度
            console.log("cache hit");
          } else {
            text = item.Val;
            if (item.MD5 != null && item.MD5 != undefined && item.MD5 != "" &&
              this.match.test(item.MD5)
            ) {
              // 設置新 緩存
              console.log("update cache", item.MD5);
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
}
