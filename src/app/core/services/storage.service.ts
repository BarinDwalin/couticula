import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  storeValue(key: string, obj: any) {
    this.storage.set(key, obj);
  }

  getStatistic(key: string) {
    return this.storage.get(key);
  }
}
